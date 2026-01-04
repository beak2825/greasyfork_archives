// ==UserScript==
// @name        Generate Metersphere Test Report
// @description 生成 Metersphere 测试计划报告
// @author      SpikeLeung
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version     0.0.5
// @match https://metersphere.gyenno.com/*
// @downloadURL https://update.greasyfork.org/scripts/484637/Generate%20Metersphere%20Test%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/484637/Generate%20Metersphere%20Test%20Report.meta.js
// ==/UserScript==

(function () {
  // API docs: https://metersphere.gyenno.com/webjars/swagger-ui/index.html
  const baseUrl = "https://metersphere.gyenno.com";
  const commonHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const buttonId = "Generate_Metersphere_Test_Report_Btn";
  const STATUS_MAP = {
    Prepare: "未执行",
    Pass: "通过",
    Failure: "失败",
    Blocking: "阻塞",
    Skip: "跳过",
  };
  const STORAGE_KEYS = {
    PASSWORD: 'GMTR_password',
    USERNAME: 'GMTR_username'
  };
  const headers = {
    // @see: https://support.smartbear.com/collaborator/faq/cannot-open-csv-report-considered-as-sylk-file/
    id: "Case ID",
    name: "名称",
    priority: "用例等级",
    project: "所属项目",
    executor: "执行人",
    maintainer: "负责人",
    status: "执行结果",
    updateTime: "更新时间",
  };

  const getPlanId = () => location.href.split("/").pop();

  const getUserInfo = () => {
    let username = localStorage.getItem(STORAGE_KEYS.USERNAME);
    let password = localStorage.getItem(STORAGE_KEYS.PASSWORD);

    if (!username || !password) {
      username = prompt("请输入用户名, 如 xxxx@gyenno.com");
      password = prompt("请输入密码");

      username && localStorage.setItem(STORAGE_KEYS.USERNAME, username);
      password && localStorage.setItem(STORAGE_KEYS.PASSWORD, password);
    }

    return { username, password };
  };

  const createButton = () => {
    const button = document.createElement("button");

    button.innerText = "下载报告";

    return button;
  };

  const addBtn = () => {
    const parentNode = document.querySelector("body");
    const button = createButton();

    button.id = buttonId;
    button.style.position = "absolute";
    button.style.top = "52px";
    button.style.right = "20px";
    button.style.cursor = "pointer";
    button.style.padding = "8px";
    button.style.background = "#783887";
    button.style.color = "#fff";
    button.style.borderRadius = "5px";

    parentNode.append(button);
    button.onclick = downloadReport;
  };

  const formatDate = (utc) => {
    const d = new Date(utc);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();

    return `${year}-${month}-${date}`;
  };

  const formatDateTime = (utc) => {
    const d = new Date(utc);
    const date = formatDate(utc);
    const hour = d.getHours();
    const minute = d.getMinutes();

    return `${date} ${hour}:${minute}`;
  };

  // TODO: 可以存到本地，重复利用，判断 401 更新
  const fetchSecretInfo = async () => {
    const { username, password } = getUserInfo();

    const res = await fetch(`${baseUrl}/signin`, {
      method: "POST",
      headers: {
        ...commonHeaders,
      },
      body: JSON.stringify({
        username,
        password,
        authenticate: "string",
      }),
    });

    const { data, message } = await res.json();

    if (res.status === 500) {
      alert(`API Error: ${message}, 请重新输入账号密码`);
      clearUserInfoStorage();
    }

    return data;
  };

  const clearUserInfoStorage = () => {
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
    localStorage.removeItem(STORAGE_KEYS.PASSWORD);
  };

  const fetchCaseList = async (planId = "") => {
    const { sessionId, csrfToken } = await fetchSecretInfo();

    const res = await fetch(
      `${baseUrl}/track/test/plan/case/list/all/${planId}`,
      {
        method: "GET",
        headers: {
          ...commonHeaders,
          "CSRF-TOKEN": csrfToken,
          "X-AUTH-TOKEN": sessionId,
        },
      }
    );

    const { data } = await res.json();

    return data;
  };

  const fetchPlanInfo = async (planId = "") => {
    const { sessionId, csrfToken } = await fetchSecretInfo();

    const res = await fetch(`${baseUrl}/track/case/node/list/plan/${planId}`, {
      method: "GET",
      headers: {
        ...commonHeaders,
        "CSRF-TOKEN": csrfToken,
        "X-AUTH-TOKEN": sessionId,
      },
    });

    const { data } = await res.json();
    const [project] = data;
    const { name: projectName, children } = project;
    const [plan] = children;
    const { name: planName } = plan;

    return { projectName, planName };
  };

  const generateReport = async () => {
    const data = await fetchCaseList(getPlanId());

    return data
      .map((d) => ({
        id: d.num,
        name: d.name,
        priority: d.priority,
        project: d.projectName,
        executor: d.executorName,
        maintainer: d.maintainerName,
        status: STATUS_MAP[d.status],
        updateTime: formatDateTime(d.updateTime),
      }))
      .sort((a, b) => a.priority.localeCompare(b.priority));
  };

  // Thanks: https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2
  const convertToCSV = (objArray) => {
    const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";

    for (let i = 0; i < array.length; i++) {
      let line = "";

      for (let index in array[i]) {
        if (line != "") line += ",";

        line += array[i][index];
      }

      str += `${line}
`;
    }

    return str;
  };

  const exportCSVFile = (headers, data, fileTitle) => {
    if (headers) {
      data.unshift(headers);
    }

    // Convert Object to JSON
    const jsonObject = JSON.stringify(data);
    const csv = convertToCSV(jsonObject);
    const exportedFilenmae = `${fileTitle}.csv` || "export.csv";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      const link = document.createElement("a");

      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const downloadReport = async () => {
    const reportData = await generateReport();
    const { projectName, planName } = await fetchPlanInfo(getPlanId());
    const fileTitle = `测试报告_${projectName}_${planName}_${formatDate(
      Date.now()
    )}`;
    // call the exportCSVFile() function to process the JSON and trigger the download
    exportCSVFile(headers, reportData, fileTitle);
  };

  const reset = (cb) => {
    const interval = setInterval(() => {
      const btnEl = document.querySelector(`#${buttonId}`);

      if (btnEl) {
        btnEl.remove();
      } else {
        clearInterval(interval);
        cb && cb();
      }
    }, 1000);
  };

  const setup = () => {
    const interval = setInterval(() => {
      const menuEl = document.querySelector(".menu-ul");

      if (menuEl) {
        addBtn();
        clearInterval(interval);
      }
    }, 1000);
  };

  const init = () => {
    reset(() => {
      if (location.href.indexOf("track/plan/view") !== -1) {
        setup();
      }
    });
  };

  window.addEventListener("popstate", init);

  init();
})();
