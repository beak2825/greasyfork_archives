// ==UserScript==
// @name         基座模型-工时填写助手
// @namespace    li-auto-jizuomoxing-luchen
// @version      1.1.3
// @description  工时一键上报
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_info
// @grant        GM_openInTab
// @resource     pluginCSS https://bj.bcebos.com/prod-public-cn/voiceplatform/static/crx/index.css
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @match        https://workinghours.chehejia.com/*
// @downloadURL https://update.greasyfork.org/scripts/542239/%E5%9F%BA%E5%BA%A7%E6%A8%A1%E5%9E%8B-%E5%B7%A5%E6%97%B6%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542239/%E5%9F%BA%E5%BA%A7%E6%A8%A1%E5%9E%8B-%E5%B7%A5%E6%97%B6%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// 监听spa 页面url变化

/*! jQuery v3.7.1 | (c) OpenJS Foundation and other contributors | jquery.org/license */

function renderTrigger(mount, unmount) {
  let showContent = false;

  const observer = new MutationObserver(() => {
    if (location.pathname.endsWith("submit")) {
      if (showContent) return;

      showContent = true;
      mount && mount();
    } else {
      showContent = false;
      unmount && unmount();
    }
  });

  observer.observe(document, { subtree: true, childList: true });
}

// 获取 token
const getToken = () => localStorage.getItem("clitoken");
// "" 为day的默认值
const mockRecords = [
  {
    project_code: "B000118",
    // project_title: "理想同学App",
    day7: "",
    day6: "",
    day5: "",
    day4: "",
    day3: "",
    day2: "",
    day1: "0",
  },
  {
    project_code: "C000534",
    // project_title: "MindGPT基座模型",
    day7: "",
    day6: "",
    day5: "",
    day4: "",
    day3: "",
    day2: "",
    day1: "2",
  },
  {
    project_code: "C000535",
    // project_title: "MindGPT-4o基座模型",
    day7: "",
    day6: "",
    day5: "",
    day4: "",
    day3: "",
    day2: "",
    day1: "",
  },
  {
    project_code: "C000224",
    // project_title: "智能体算法及工程体系新技术研究（移转）",
    day7: "",
    day6: "",
    day5: "",
    day4: "",
    day3: "",
    day2: "",
    day1: "",
  },
  {
    project_code: "000000",
    // project_title: "部门公共",
    day7: "",
    day6: "",
    day5: "",
    day4: "",
    day3: "",
    day2: "",
    day1: "",
  },
];
const body = {
  memo: "",
  records: [],
  task_id: "",
};
var saveData = async (task_id, workingHours) => {
  body.task_id = task_id;
  const ALLKey = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"];
  let recordKey = void 0;
  const holidayInfo = JSON.parse(sessionStorage.getItem("holidayInfo"));
  if (holidayInfo) {
    recordKey = ALLKey.filter((_, index) => {
      return holidayInfo[index].is_work_day;
    });
  } else {
    recordKey = ALLKey.slice(0, 5);
  }

  // 遍历工时数组，如果总时长不够8，则将插值分配给最少工时的项目,如果超过8，则将超出的部分分配给最多工时的项目
  const totalWorkingHours = workingHours.reduce(
    (acc, { total }) => acc + 10 * total,
    0
  );
  const diff = 80 - totalWorkingHours;
  let diffProjectCode = void 0;
  if (diff > 0) {
    let minWorkingHours = Infinity;
    workingHours.forEach(({ project_code, total }) => {
      if (total < minWorkingHours) {
        minWorkingHours = total;
        diffProjectCode = project_code;
      }
    });
  } else if (diff < 0) {
    let maxWorkingHours = 0;
    workingHours.forEach(({ project_code, total }) => {
      if (total > maxWorkingHours) {
        maxWorkingHours = total;
        diffProjectCode = project_code;
      }
    });
  }

  const computeRecords = [];
  workingHours.forEach(({ project_code, total }) => {
    const currentProjectRecord = {
      project_code,
    };
    recordKey.forEach((key) => {
      if (diffProjectCode && diffProjectCode === project_code) {
        currentProjectRecord[key] = (total * 10 + diff) / 10;
      } else {
        currentProjectRecord[key] = total;
      }
    });
    computeRecords.push(currentProjectRecord);
  });
  console.log("computeRecords:", computeRecords);
  body.records = computeRecords;
  return await fetch(
    "https://osd-api-public.chehejia.com/osd-ipd-task-time-api/api/v2/staff/task/save-list",
    {
      headers: {
        authorization: `Bearer ${getToken()}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      method: "POST",
    }
  ).then((res) => res.json());
};

var getTaskList = async () => {
  return await fetch(
    "https://osd-api-public.chehejia.com/osd-ipd-task-time-api/api/v2/fill/task/list",
    {
      headers: {
        authorization: `Bearer ${getToken()}`,
        "content-type": "application/json",
      },
      body: '{"type":1}',
      method: "POST",
    }
  ).then((res) => res.json());
};

var getWorkingHours = async () => {
  // @TODO 这里联调调整了浏览器安全策略，后端上线后需要更换地址
  // 当前地址的https协议访问时候 测试环境的CA证书验证不会通过的。因此用http
  return await fetch(
    // "http://ssai-apis-staging.chehejia.com/agi-org-robot/getSheetData",
    "https://sheepdog.ssai.lixiangoa.com/ws/agi_org_robot/agi-org-robot/getSheetData"
  ).then((res) => res.json());
  // return mockRes
};

// 获取节假日信息
async function fetchHolidayInfo() {
  // 获取当前日期所在周的周一和周日日期
  function getCurrentWeekDates() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 周日，1-6 周一到周六

    // 计算周一
    const mondayOffset = currentDay === 0 ? -6 : -(currentDay - 1);
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(8, 0, 0, 0); // 设置为早上8点

    // 周一的基础上+6天
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(8, 0, 0, 0);

    return {
      beginDate: monday.getTime(),
      endDate: sunday.getTime(),
    };
  }
  const { beginDate, endDate } = getCurrentWeekDates();

  return await fetch(
    `https://osd-api-public.chehejia.com/osd-ipd-task-time-api/api/v2/fill/day-label?beginDate=${beginDate}&endDate=${endDate}`,
    {
      headers: {
        authorization: `Bearer ${getToken()}`,
        "content-type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("holidayRes:", data);
      // { code:0, data:[{date: '2025-5-26', is_work_day: true},...], message: '成功'}
      if (data.code === 0) {
        sessionStorage.setItem("holidayInfo", JSON.stringify(data.data));
      }
    })
    .catch((error) => {
      console.error("获取节假日信息失败:", error);
    });
}

function fetchAndStorageOpenId() {
  if (localStorage.getItem("open_id")) return;

  fetch(
    `https://osd-api-public.chehejia.com/osd-ipd-task-time-api/api/v2/user/info`,
    {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
      method: "POST",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("infoRes:", data);
      if (data.code === 0) {
        localStorage.setItem("open_id", data.data.open_id);
      }
    })
    .catch((error) => {
      console.error("open_id获取失败:", error);
    });
}

// 上报用户信息
async function reportByOpenId() {
  const open_id = localStorage.getItem("open_id");
  if (!open_id) return;

  return await fetch(
    `https://sheepdog.ssai.lixiangoa.com/ws/agi_org_robot/agi-org-robot/saveOpenId/${open_id}`
  );
}
console.log("this is content js");
console.log("document", document);
console.log("location", location);
console.log("window", window);
// console.log(document.cookie);

class SearchError extends Error {}
class UnauthorizedError extends Error {}
const appInfo = {
  localVersion: GM_info.script?.version ?? "",
  remoteVersion: "",
};
async function checkUpdate() {
  try {
    if (!appInfo.localVersion) return;
    if (!appInfo.remoteVersion) {
      const remoteVersion = await fetch(
        "https://raw.githubusercontent.com/luchenzuishuai/workinghours-plugin/refs/heads/main/version.json?timestamp=" +
          Date.now()
      )
        .then((res) => res.json())
        .then((res) => res.version);
      appInfo.remoteVersion = remoteVersion;
    }
    let needUpdate = false;
    const localNum = appInfo.localVersion.split(".");
    const remoteNum = appInfo.remoteVersion.split(".");
    for (let i = 0; i < localNum.length; i++) {
      if (localNum[i] < remoteNum[i]) {
        needUpdate = true;
        break;
      }
    }
    console.log(appInfo, needUpdate);

    if (needUpdate) {
      const result = confirm("有新版本，是否前往安装更新？");
      if (result) {
        // window.open(
        //   "https://gf.qytechs.cn/zh-CN/scripts/542239-%E5%9F%BA%E5%BA%A7%E6%A8%A1%E5%9E%8B-%E5%B7%A5%E6%97%B6%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B",
        //   "_blank"
        // );
        GM_openInTab(
          "https://raw.githubusercontent.com/luchenzuishuai/workinghours-plugin/refs/heads/main/all.user.js"
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}
async function init() {
  // 获取节假日信息
  fetchHolidayInfo();
  // 获取open_id
  fetchAndStorageOpenId();
  window.addEventListener("load", checkUpdate);
}
init();
GM_addStyle(GM_getResourceText("pluginCSS"));
//创建页面函数
function createPage() {
  const page = $('<div id="cj_move_page"></div>');
  const header = $(`
    <div id="cj_move_wrapper">
      <h3 id="cj_move_h3">基座模型工时填报</h3>
      <ul id="cj_move_ul">
        <li><a href="https://li.feishu.cn/docx/S7Xhdu1FSozDDWxoC05caY3in9e" target="_blank">帮助文档</a></li>
        <li><a href="https://li.feishu.cn/sheets/QGqtsKMQbhwrzMt5KvncpZ3Nn6d?sheet=0eqTGr" target="_blank">工时报表</a></li>
      </ul>
      </div>
    </div>
    `);
  const but1 = $('<button id="cj_but1">检查更新</button>');
  const but2 = $('<button id="cj_but2">工时上报</button>');
  const progress = $(`
    <div id="progress-container" hidden>
      <div id="progress-bar">
        <div id="progress-fill"></div>
      </div>
      <div id="progress-text">0%</div>
    </div>`);
  const dialog = $(`
    <dialog id="cj_dialog">
      <div id="dialog-header">
        <h2 style="margin: 0;">提示</h2>
      </div>
      <div id="dialog-content">
        <p style="margin: 0;">这是一个对话框示例,这是一个对话框示例,这是一个对话框示例,这是一个对话框示例</p>
      </div>
      <div id="dialog-footer">
        <button id="close-btn" onclick="document.getElementById('cj_dialog')?.close()">关闭</button>
      </div>
    </dialog>
  `);

  page.append(header);
  page.append(but1);
  page.append(but2);
  page.append(progress);
  page.append(dialog);
  $("body").append(page);

  // 消息通知按钮事件（和swoker通信）
  $("#cj_but1").click((e) => {
    try {
      // 非识别错误，弹出对话框
      $("#dialog-content p").text(
        "若有新版本，将前往安装更新(默认不定时自动更新)，手动安装后请刷新工时填报网站。"
      );
      $("#cj_dialog")[0]?.showModal();
      checkUpdate();
    } catch (error) {
      console.log(error);
    }
  });

  // content 加载更多按钮点击事件
  $("#cj_but2").click(async (e) => {
    const saveBtn = $(e.target);
    saveBtn.prop("disabled", true);
    // 禁止点击样式
    saveBtn.css("cursor", "not-allowed");
    saveBtn.css("background-color", "gray");
    saveBtn.text("工时上报中...");
    const progressAnimationCompleteFn = await startProgressAnimation();
    try {
      const res = await getTaskList();
      // 错误时{status:401,error:"Unauthorized"},正常是{code:0,data:{item:[{task_id:xxx}]},message}
      // @TODO：目前只拦截了这个接口，其实也够了，因为每次提交都会先调用这个接口
      if (res.status === 401 || res.error === "Unauthorized")
        throw new UnauthorizedError("身份已过期，将自动刷新页面。");

      // 新员工，没有上报任务
      if (!res.data || !res.data.item || res.data.item.length === 0)
        throw new Error(
          "本周暂无工时填报任务，如果您为新员工，请关注下周填报任务。"
        );

      task_id = res.data.item[0]?.task_id;
      const workingHours = await findWorkingHoursByOpenId();
      const saveRes = await saveData(task_id, workingHours);
      // 非识别错误，弹出对话框
      $("#dialog-content p").text(
        saveRes.code === -1
          ? saveRes.message
          : "工时填写成功，即将刷新页面，查看上报结果"
      );
      $("#cj_dialog")[0]?.showModal();
      if (saveRes.code !== -1) {
        reportByOpenId();
        progressAnimationCompleteFn(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        progressAnimationCompleteFn(false);
      }
    } catch (error) {
      progressAnimationCompleteFn(false);
      if (error instanceof SearchError) {
        const result = confirm(
          error.message + "点击确定，将打开帮助文档，以获取相关人员帮助。"
        );
        if (result) {
          window.open(
            "https://li.feishu.cn/docx/S7Xhdu1FSozDDWxoC05caY3in9e#share-RgYqd0ilMo4RFFx58gocoyAlngg",
            "_blank"
          );
        }
      } else if (error instanceof UnauthorizedError) {
        // 非识别错误，弹出对话框
        $("#dialog-content p").text(error.message || error.toString());
        $("#cj_dialog")[0]?.showModal();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // 非识别错误，弹出对话框
        $("#dialog-content p").text(error.message || error.toString());
        $("#cj_dialog")[0]?.showModal();
        console.log(error);
      }
    } finally {
      saveBtn.prop("disabled", false);
      saveBtn.css("cursor", "pointer");
      // 移除灰色
      saveBtn.css("background-color", "");
      saveBtn.text("工时上报");
      remindUpdateBySourceCode();
    }
  });

  //拖拽
  drag(cj_move_wrapper);
}

renderTrigger(
  () => {
    createPage();
  },
  () => {
    // 将创建的page 移除
    $("#cj_move_page").remove();
  }
);

//拖拽
function drag(ele) {
  let oldX, oldY, newX, newY;
  ele.onmousedown = function (e) {
    if (!cj_move_page.style.right && !cj_move_page.style.bottom) {
      cj_move_page.style.right = 0;
      cj_move_page.style.bottom = 0;
    }
    oldX = e.clientX;
    oldY = e.clientY;
    document.onmousemove = function (e) {
      newX = e.clientX;
      newY = e.clientY;
      cj_move_page.style.right =
        parseInt(cj_move_page.style.right) - newX + oldX + "px";
      cj_move_page.style.bottom =
        parseInt(cj_move_page.style.bottom) - newY + oldY + "px";
      oldX = newX;
      oldY = newY;
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

async function findWorkingHoursByOpenId() {
  // 四舍五入,指定保留小数点后decimals位
  function roundTo(num, decimals = 1) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
  try {
    const res = await getWorkingHours();
    console.log(res);
    // 优先使用open_id，其次使用工号
    const dependencyKey = localStorage.getItem("open_id");
    if (!dependencyKey) throw new Error("未找到open_id,请尝试刷新页面。");

    const workingHoursList = res.data.valueRange.values;
    let searchResult = void 0;
    searchResult = workingHoursList.find((item) => item[1] === dependencyKey);

    if (!searchResult) {
      throw new SearchError("未找到工时记录,请检查工时填写情况表数据。");
    }
    // useFulArray ['0.4','占比*8','项目编码', null,'code','null',....'占比','占比*8','000000']
    searchResult[searchResult.length - 1] = "000000"; // 3个一组，最后一组数组缺少公共代码
    const useFulArray = searchResult.slice(11);
    const finalArray = [];
    for (let i = 0; i < useFulArray.length; i += 3) {
      const ratio = useFulArray[i];
      const project_code = useFulArray[i + 2];
      if (ratio === null || project_code === null) continue;
      finalArray.push({
        project_code,
        total: roundTo(parseFloat(ratio) * 8),
      });
    }
    console.log(finalArray);

    return finalArray;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "wifi请连接内网【lixiang-2022】，并关闭科学上网工具，否则无法获取工时数据"
      );
    } else {
      throw error;
    }
  }
}

async function startProgressAnimation() {
  function simulateProgress(onProgress, onComplete) {
    let progress = 0;
    let speed = 0.5;
    let baseSpeed = 0.5;
    let isRunning = true;
    let cancelAnimationFrameId = null;

    function updateProgress() {
      if (progress >= 99 || !isRunning) return;

      // 新的进度计算策略
      if (progress < 30) {
        // 前30%快速增长
        speed = baseSpeed * 1.5;
      } else if (progress < 70) {
        // 30%-70%中速增长
        speed = baseSpeed;
      } else {
        // 70%以后慢速增长
        speed = baseSpeed * 0.5;
      }

      progress += speed;
      progress = Math.min(99, progress);

      onProgress(Math.round(progress));
      if (isRunning) {
        cancelAnimationFrameId = requestAnimationFrame(updateProgress);
      }
    }

    updateProgress();

    return function complete(isSuccess) {
      cancelAnimationFrameId && cancelAnimationFrame(cancelAnimationFrameId);
      isRunning = false; // 停止进度更新
      onProgress(100, isSuccess);
      onComplete && onComplete();
    };
  }
  const progressContainer = $("#progress-container");
  const progressFill = $("#progress-fill");
  const progressText = $("#progress-text");

  // 重置进度
  progressContainer.css("display", "block");
  progressFill.css("width", "0%");
  progressText.text("0%");
  progressFill.css("background-color", "#4caf50");

  // 短暂延迟，确保重置效果可见
  await new Promise((resolve) => setTimeout(resolve, 300));

  const onCompleteCallback = () => {
    setTimeout(() => {
      progressContainer.css("display", "none");
    }, 600);
  };
  // 开始进度模拟
  const completeProgressFn = simulateProgress((progress, isSuccess = true) => {
    progressFill.css("width", `${progress}%`);
    progressText.text(`${progress}%`);

    if (!isSuccess) {
      progressFill.css("background-color", "#ff5252");
      progressText.text("上报失败");
    }
  }, onCompleteCallback);

  return completeProgressFn;
}
