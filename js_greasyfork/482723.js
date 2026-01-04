// ==UserScript==
// @name              Crawler base on SingleFile
// @author            Mark
// @description       Download site in single file automatically
// @license           MIT
// @version           0.0.21
// @match             https://*/*
// @run-at            document-idle
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.xmlHttpRequest
// @grant GM_registerMenuCommand
// @grant unsafeWindow
// @require     https://update.greasyfork.org/scripts/483730/1305396/gm-fetch.js
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @connect *
// @noframes
// @namespace https://greasyfork.org/users/1106595
// @downloadURL https://update.greasyfork.org/scripts/482723/Crawler%20base%20on%20SingleFile.user.js
// @updateURL https://update.greasyfork.org/scripts/482723/Crawler%20base%20on%20SingleFile.meta.js
// ==/UserScript==
 
const REPORT_ADDRESS = "https://crawler-hit.deno.dev/api/update";
const PAGE_LOADING_TIME = 7;
const ERROR_RELOAD_TIME = 10;
const ERROR_RELOAD_LONG_TIME = 60;
const NEXT_TASK_WAITING_TIME = 10;
 
const NO_TASK_WAITING_TIME = 90;
const CF_CHALLENGE_WAITING_TIME = 20;
const QUICK_SLEEP_TIME = 5;
const DOMAIN_REG = /^(https?):\/\/([^\s\/?\.#]+\.?)+$/;
const TASK_MAX_RETRY_TIMES = 3;
const TIME_POINT_TYPES = {
  PREPARE_START: "prepareStart",
  TASK_LOADED: "taskLoaded",
  TASK_REPORTED: "taskReported",
  PRESIGN_INDEX: "presignIndex",
  PRESIGN_SINGLEFILE: "presignSinglefile",
  SINGLE_FILE_SUCCESS: "singleFileSuccess",
  INDEX_FILE_UPLOADED: "indexFileUploaded",
  SINGLE_FILE_UPLOADED: "singleFileUploaded",
  VALIDATE_FAILED: "validateFailed",
};
let gmc = new GM_config({
  id: "CrawlerConfig",
  title: "Crawler setting",
  fields: {
    Name: {
      label: "Name",
      type: "text",
    },
    Password: {
      label: "Password",
      type: "text",
    },
    taskInterval: {
      label: "Task Interval (s)",
      type: "int",
      default: NEXT_TASK_WAITING_TIME,
    },
    taskMaxRetryTimes: {
      label: "Task Max Retry Times",
      type: "int",
      default: TASK_MAX_RETRY_TIMES,
    },
    preferServer: {
      label: "Prefer preSign Server",
      type: "text",
    },
    reportServer: {
      label: "Report Server",
      type: "text",
      default: REPORT_ADDRESS,
    },
  },
  events: {
    init: function () {
      // runs after initialization completes
    },
    save: function () {
      // runs after values are saved
      console.log("save", this.get("Name"), this.get("Password"));
      this.close();
    },
  },
});
 
const crawlerUtil = {
  addScript: (url) => {
    const s = document.createElement("script");
    s.src = url;
    s.onerror = (evt) => {
      setTimeout(() => {
        addScript(url);
      }, 2000);
    };
    document.body.append(s);
  },
 
  addScriptByText: async (url, cache = false, retry = 0) => {
    const s = document.createElement("script");
    s.dataset.crawler = "true";
    const scriptCache = (await GM.getValue("scriptCache")) || {};
    if (cache && scriptCache[url]) {
      s.innerHTML = scriptCache[url];
      document.body.append(s);
      return true;
    }
    try {
      const res = await GM.xmlHttpRequest({
        url: url,
        method: "GET",
      });
 
      const text = res.responseText;
      if (cache) {
        scriptCache[url] = text;
        GM.setValue("scriptCache", scriptCache);
      }
      s.innerHTML = text;
      document.body.append(s);
      return true;
    } catch (error) {
      if (retry > 3) {
        return false;
      }
      await sleep(2);
      return await addScriptByText(url, retry + 1);
    }
  },
 
  getPreSignUrl: async (doi, fileName, name, pass, preferServer = "") => {
    const configServer = DOMAIN_REG.test(preferServer) ? [preferServer] : [];
    const preSignSevers = configServer.concat([
      "https://electrolyte-brain-minio.deno.dev",
    ]);
    async function getPreSignUrlFromServer(serverIndex = 0) {
      try {
        return await (
          await GM_fetch(
            `${preSignSevers[serverIndex]}/api/presignedPutObject?doi=${doi}&file_name=${fileName}&account=${name}&pass=${pass}`
          )
        ).json();
      } catch (error) {
        if (!preSignSevers[serverIndex + 1]) {
          return { reload: true };
        }
        return await getPreSignUrlFromServer(serverIndex + 1);
      }
    }
 
    const preSignRes = await getPreSignUrlFromServer();
    if (preSignRes.reload) {
      return "RELOAD";
    }
 
    const url = preSignRes?.url;
    return url || null;
  },
 
  uploader: async (url, content) => {
    const mime = "application/gzip"
    const gzip_data = pako.gzip(content, { level: 9 });
    const upload_blob = new Blob([gzip_data], { type: mime });
 
    return await GM.xmlHttpRequest({
      method: "PUT",
      url,
      headers: {
        "Content-Type": mime,
        "Content-Length": upload_blob.size,
      },
      data: upload_blob,
    });
  },
 
  downloadFile: (data, fileName) => {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const blob = new Blob([data], {
      type: "application/octet-stream",
    });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  },
 
  generateClientId: () => (1e6 * Math.random()).toString(32).replace(".", ""),
 
  sleep: (duration) => {
    return new Promise((res, rej) => {
      setTimeout(() => res(), duration * 1000);
    });
  },
};
 
// main function
(function () {
  "use strict";
  const {
    addScript,
    addScriptByText,
    generateClientId,
    uploader,
    downloadFile,
    getPreSignUrl,
    sleep,
  } = crawlerUtil;
 
  const dependenciesInit = async () => {
    await addScriptByText(
      "https://cdn.jsdelivr.net/gh/gildas-lormeau/SingleFile-MV3/lib/single-file-bootstrap.js",
      true
    );
    await addScriptByText(
      "https://cdn.jsdelivr.net/gh/gildas-lormeau/SingleFile-MV3/lib/single-file-hooks-frames.js",
      true
    );
    await addScriptByText(
      "https://cdn.jsdelivr.net/gh/gildas-lormeau/SingleFile-MV3/lib/single-file-frames.js",
      true
    );
    await addScriptByText(
      "https://cdn.jsdelivr.net/gh/gildas-lormeau/SingleFile-MV3/lib/single-file.js",
      true
    );
 
    await addScriptByText(
      "https://cdn.jsdelivr.net/gh/IKKEM-Lin/crawler-base-on-singlefile/config.js"
    );
    await addScriptByText(
      "https://crawal-validator.deno.dev/"
    );
    await addScriptByText(
      "https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js"
    );
    return () => {
      document.querySelectorAll("script[data-crawler='true']").forEach((el) => {
        el.parentElement.removeChild(el);
      });
    };
  };
 
  const pureHTMLCleaner = (document) => {
    document.querySelectorAll("script").forEach((el) => {
      el.parentElement.removeChild(el);
    });
    document.querySelectorAll("style").forEach((el) => {
      el.parentElement.removeChild(el);
    });
  };
 
  // Overwrite fetch function to bypass CORS
  window.unsafeWindow.fetch = async (...args) => {
    return await fetch(...args).catch(async (err) => {
      return await GM_fetch(...args);
    });
  };
 
  async function reload(waiting = 60, message = "") {
    console.warn(`%c${message}, reload ${waiting}s later`, printStyle);
    await sleep(waiting);
    location.reload();
  }
 
  function readFile(accept = "", multiple = false) {
    const inputEl = document.createElement("input");
    inputEl.setAttribute("type", "file");
    inputEl.setAttribute("accept", accept);
    inputEl.setAttribute("multiple", !!multiple);
    return new Promise((resolve, reject) => {
      inputEl.addEventListener("change", (e) => {
        resolve(multiple ? inputEl.files : inputEl.files[0]);
        window.removeEventListener("click", onWindowClick, true);
      });
      document.body.append(inputEl);
      inputEl.click();
 
      const onWindowClick = () => {
        if (!inputEl.value) {
          reject(new Error("用户取消选择"));
        }
        window.removeEventListener("click", onWindowClick, true);
      };
      setTimeout(() => {
        window.addEventListener("click", onWindowClick, true);
      }, 100);
    });
  }
 
  function AddImportBtn() {
    const btnWrapImport = document.createElement("div");
    btnWrapImport.id = "CRAWLER_ID";
    btnWrapImport.innerHTML = `<button style="padding: 4px 8px;position: fixed;bottom: 40%;right: 8px;border-radius: 4px;background-color: #224466;color: #fff;">Import</button>`;
    const importBtn = btnWrapImport.querySelector("button");
    importBtn.onclick = async () => {
      if (
        !window.confirm(
          "The data in browser will be clear up. Please make sure you have to do this !!!"
        )
      ) {
        return;
      }
      const file = await readFile(".json");
      const reader = new FileReader();
 
      reader.onload = (event) => {
        const json = JSON.parse(event.target.result);
        // console.log({json}, 'json')
        // this.importFromBackUp.bind(this)(json);
        if (
          json instanceof Array &&
          json.every((item) => item.doi && item.validator)
        ) {
          GM.setValue("tasks", json);
          location.reload();
        } else {
          alert(
            "Please upload json file like [{doi: string, validator: string, ...}]"
          );
        }
      };
 
      reader.readAsText(file);
    };
    document.body.appendChild(btnWrapImport);
    return () => {
      const importBtn = document.getElementById("CRAWLER_ID");
      if (importBtn) {
        importBtn.parentElement.removeChild(importBtn);
      }
    };
  }
 
  GM_registerMenuCommand("Download", async () => {
    const taskData = await GM.getValue("tasks");
    const waitingTasks = taskData.filter(
      (task) =>
        !task.downloaded &&
        task.validated === undefined &&
        validators[task.validator]
    );
    const now = new Date();
    downloadFile(
      JSON.stringify(taskData),
      `${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}-${
        taskData.length
      }-${taskData.length - waitingTasks.length}.json`
    );
  });
 
  GM_registerMenuCommand("Config", async () => {
    gmc.open();
  });
 
  const printStyle = "color: blue;background-color: #ccc;font-size: 20px";
 
  const prepareNextTask = async (nextDoi) => {
    const taskInterval = gmc.get("taskInterval") || NEXT_TASK_WAITING_TIME;
    if (nextDoi) {
      console.log(
        `%cStart next task ${taskInterval}s later...`,
        printStyle,
        nextDoi
      );
      await sleep(taskInterval);
      const taskData = await GM.getValue("tasks");
      const task = taskData.find((task) => task.doi === nextDoi);
      await saveTaskTimepoint(TIME_POINT_TYPES.PREPARE_START, task, taskData);
      location.href = nextDoi;
    } else {
      await reload(NO_TASK_WAITING_TIME, "No tasks waiting");
    }
  };
 
  let lasestTimepoint = 0;
  const saveTaskTimepoint = async (pointName, task, taskData) => {
    if (pointName === TIME_POINT_TYPES.PREPARE_START) {
      task[`timePoint_${pointName}`] = new Date().valueOf()
    }
    else {
      if (lasestTimepoint == 0) {
        lasestTimepoint = task[`timePoint_${TIME_POINT_TYPES.PREPARE_START}`] || 0;
      }
      if (lasestTimepoint == 0) {
        task[`timePoint_${pointName}`] = 0;
      } else {
        task[`timePoint_${pointName}`] = new Date().valueOf() - lasestTimepoint;
      }
      lasestTimepoint = new Date().valueOf();
    }
    await GM.setValue("tasks", taskData);
  };
 
  const checkRetry = async (task, taskData, nextDoi) => {
    const taskMaxRetryTimes = gmc.get("taskMaxRetryTimes") || TASK_MAX_RETRY_TIMES;
    const retryTimes = task.retryTimes || 0;
    let result = true;
    if (retryTimes >= taskMaxRetryTimes) {
      console.log(`%cTask have been retry ${taskMaxRetryTimes} times! ${task.doi}`, printStyle);
      task.validated = false;
      task.updateTime = new Date().valueOf();
      await prepareNextTask(nextDoi);
      result = false;
    } else {
      task.retryTimes = retryTimes + 1;
    }
    await GM.setValue("tasks", taskData);
    return result;
  }
 
  async function start() {
    console.log(new Date());
 
    const importBtnHandler = AddImportBtn();
 
    let clientId = await GM.getValue("clientId");
    if (typeof clientId !== "string" || !clientId) {
      clientId = generateClientId();
      await GM.setValue("clientId", clientId);
    }
 
    // ---------------------------- Script dependencies handler -----------------------------------------------------
    const dependenciesHandler = await dependenciesInit();
 
    if (!singlefile || !singlefile.getPageData) {
      await reload(ERROR_RELOAD_TIME, `singlefile error! ${currentTask.doi}`);
      return;
    }
 
    if (!(validators && DEFAULT_CONFIG)) {
      await reload(
        ERROR_RELOAD_TIME,
        "Can not get validators or DEFAULT_CONFIG"
      );
      return;
    }
 
    // ---------------------------- Get Task -----------------------------------------------------
    const taskData = await GM.getValue("tasks");
    let tasks = taskData || [];
 
    // find task which not downloaded and not validated before
    const waitingTasks = tasks.filter(
      (task) =>
        !task.downloaded &&
        task.validated === undefined &&
        validators[task.validator]
    );
    console.log(
      `%cTry to get tasks firstly(${waitingTasks.length} / ${tasks.length}):`,
      printStyle,
      tasks
    );
 
    if (!waitingTasks.length) {
      await reload(NO_TASK_WAITING_TIME, "No tasks waiting");
      return;
    }
 
    const invalidatedTasks = tasks.filter((task) => task.validated === false);
    const doneTasks = tasks
      .filter((task) => task.downloaded)
      .sort((a, b) => (a.updateTime > b.updateTime ? -1 : 1));
    const previousDay = new Date().valueOf() - 24 * 3600 * 1000;
    const last24hDoneTasks = doneTasks.filter(
      (task) => task.updateTime > previousDay
    );
 
    const lastDoneTime = new Date(doneTasks[0]?.updateTime);
    const currentTask = waitingTasks[0];
    const nextTask = waitingTasks[1] || {};
    await saveTaskTimepoint(TIME_POINT_TYPES.TASK_LOADED, currentTask, tasks);
 
    const updateCurrentTask = async (isSuccess) => {
      currentTask.validated = isSuccess;
      currentTask.updateTime = new Date().valueOf();
      await GM.setValue("tasks", tasks);
    };
 
    // ---------------------------- Report progress -----------------------------------------------------
 
    const reportUrl = gmc.get("reportServer") || REPORT_ADDRESS;
    const reportTip = `Last download time: ${lastDoneTime.toLocaleString()}
      Speed: ${last24hDoneTasks.length} / last 24h`;
    GM.xmlHttpRequest({
      url: reportUrl,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        account: clientId,
        invalidate_count: invalidatedTasks.length,
        done_count: doneTasks.length,
        queue_count: waitingTasks.length,
        tip: reportTip,
      }),
    })
      .then((res) => {
        console.log("Report successfully", { res });
      })
      .finally(() => {
        saveTaskTimepoint(TIME_POINT_TYPES.TASK_REPORTED, currentTask, tasks);
      });
 
 
    // -------------------------- Detect Cloudflare challenge -------------------------------------------------------
    await sleep(PAGE_LOADING_TIME);
    if (document.getElementById("challenge-form")) {
      console.log(`%cCloudflare challenge! ${currentTask.doi}`, printStyle);
      await sleep(CF_CHALLENGE_WAITING_TIME);
      currentTask.cloudflareBlock = true;
      await updateCurrentTask(false);
      await prepareNextTask(nextTask.doi);
      return;
    }
    // bypass els institution check
    if (document.querySelector('.sec-A #bdd-els-close')) {
      const elsCloseBtn = document.querySelector('.sec-A #bdd-els-close');
      elsCloseBtn.click();
    }
 
    // ---------------------------- validated task ------------------------------------------------
 
    const doi = currentTask.doi.replace("https://doi.org/", "").toLowerCase();
    const doiFixed = doi.replaceAll("/", "_");
    
    const validator = (document) => {
      const abs_selectors = validators[currentTask.validator]["sel_A"];
      const para_selectors = validators[currentTask.validator]["sel_P"];
      if (abs_selectors.length == 0 && para_selectors.length == 0) {
        return false;
      }
      const absValidated = abs_selectors.length == 0 || abs_selectors.some((selector) => document.querySelector(selector));
      const paraValidated = para_selectors.length == 0 || para_selectors.some((selector) => document.querySelectorAll(selector).length > 0);
      return absValidated && paraValidated;
    }
 
    let name = "";
    let pass = "";
    let preferServer = "";
    try {
      name = gmc.get("Name");
      pass = gmc.get("Password");
      preferServer = gmc.get("preferServer");
      if (!name || !pass) {
        throw new Error();
      }
    } catch (err) {
      console.error(
        `%cMiss name or password. Please input in config panel.`,
        printStyle
      );
      return;
    }
 
    const indexUrl = await getPreSignUrl(doiFixed, `_.html.gz`, name, pass, preferServer);
    await saveTaskTimepoint(TIME_POINT_TYPES.PRESIGN_INDEX, currentTask, tasks);
    const singlefileUrl = await getPreSignUrl(
      doiFixed,
      `_.sf.html.gz`,
      name,
      pass,
      preferServer
    );
    await saveTaskTimepoint(
      TIME_POINT_TYPES.PRESIGN_SINGLEFILE,
      currentTask,
      tasks
    );
    if (indexUrl === "RELOAD" || singlefileUrl === "RELOAD") {
      await reload(
        ERROR_RELOAD_LONG_TIME,
        "Minio PreSignUrl error, please check url or account"
      );
      return;
    }
    if (!indexUrl && !singlefileUrl) {
      console.error("%cFile existed!!!", printStyle, currentTask.doi);
      await updateCurrentTask(false);
      await prepareNextTask(nextTask.doi);
      return;
    } else { 
      const old_index = await getPreSignUrl(doiFixed, `_.html`, name, pass, preferServer);
      const old_singlefileUrl = await getPreSignUrl(
        doiFixed,
        `_.sf.html`,
        name,
        pass,
        preferServer
      );
      if (!old_index && !old_singlefileUrl) {
        console.error("%cFile existed!!!", printStyle, currentTask.doi);
        await updateCurrentTask(false);
        await prepareNextTask(nextTask.doi);
        return;
      }
    } 
 
    // --------------------------- Page validate ------------------------------------------------------
    if (!document.body.textContent.toLowerCase().includes(doi)) {
      console.log(
        `%cURL not match, will redirect to ${currentTask.doi} 5s later`,
        printStyle
      );
      await sleep(QUICK_SLEEP_TIME);
      if(await checkRetry(currentTask, tasks, nextTask.doi)){
        location.href = currentTask.doi;
      }
      return;
    }
    if (validator(document)) {
      console.log(
        "%cValidate successfully! Downloading page...",
        printStyle,
        waitingTasks,
        tasks
      );
      importBtnHandler();
      // repair special page
      if (typeof documentFixer[currentTask.validator] === "function") {
        documentFixer[currentTask.validator](document);
      }
      try {
        const data = await singlefile.getPageData(DEFAULT_CONFIG);
        await saveTaskTimepoint(
          TIME_POINT_TYPES.SINGLE_FILE_SUCCESS,
          currentTask,
          tasks
        );
        // downloadFile(data.content, `${doiFixed}.singlefile.html`);
        // downloadFile(document.body.parentElement.outerHTML, `${doiFixed}.html`);
        if (singlefileUrl) {
          await uploader(singlefileUrl, data.content);
          await saveTaskTimepoint(
            TIME_POINT_TYPES.SINGLE_FILE_UPLOADED,
            currentTask,
            tasks
          );
        }
        if (indexUrl) {
          dependenciesHandler();
          pureHTMLCleaner(document);
          await uploader(indexUrl, document.body.parentElement.outerHTML);
          await saveTaskTimepoint(
            TIME_POINT_TYPES.INDEX_FILE_UPLOADED,
            currentTask,
            tasks
          );
        }
        console.log("%cUpload successfully!", printStyle);
        currentTask.downloaded = true;
        await updateCurrentTask(true);
      } catch (error) {
        console.error(error);
        if (await checkRetry(currentTask, tasks, nextTask.doi)) {
          await reload(
            ERROR_RELOAD_TIME,
            `singlefile or upload error! ${currentTask.doi}`
          );
        }
        return;
      }
    } else {
      console.log(`%cValidate failed! ${currentTask.doi}`, printStyle);
      await saveTaskTimepoint(
        TIME_POINT_TYPES.VALIDATE_FAILED,
        currentTask,
        tasks
      );
      await updateCurrentTask(false);
    }
 
    // --------------------------- Prepare next task ------------------------------------------------------
    await prepareNextTask(nextTask.doi);
  }
 
  start();
})();