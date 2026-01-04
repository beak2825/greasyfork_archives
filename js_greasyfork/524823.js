// ==UserScript==
// @name         JavDB Exporter plus
// @version      1.4.0
// @namespace    https://gist.github.com/sqzw-x
// @description  导出 想看、看过、清单 | Export Want, watched, list
// @match        https://javdb.com/users/want_watch_videos*
// @match        https://javdb.com/users/watched_videos*
// @match        https://javdb.com/users/list_detail*
// @match        https://javdb.com/lists*
// @grant        GM_xmlhttpRequest
// @grant        GM_listValues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524823/JavDB%20Exporter%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/524823/JavDB%20Exporter%20plus.meta.js
// ==/UserScript==

const INTERVAL = 500; // 获取评论的请求间隔, 单位毫秒

const get_localStorage = (key) => JSON.parse(localStorage.getItem(key));
const set_localStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let current_action = get_localStorage("current_action") || "";
let actions = [];
let current_result = get_localStorage("current_result") || [];
let url = window.location.href;
let root = window.location.origin;
let closeWindow = null;

// 执行前的准备工作
function preExecute() {
  actions.map((b) => {
    b.button.disabled = true;
  });
  const allImages = document.querySelectorAll("img"); //移除图像增加速度
  allImages.forEach((image) => {
    image.remove();
  });
}

// 重置状态
function reset() {
  if (closeWindow) {
    closeWindow();
    closeWindow = null;
  }
  localStorage.removeItem("current_result");
  localStorage.removeItem("current_action");
  current_result = [];
  current_action = "";
  actions.map((b) => {
    b.button.disabled = false;
    b.button.textContent = b.button.textContent.replace("(运行中...)", "");
  });
}

async function fetchWithRetry(url, maxAttempts = 5) {
  let response;
  let html;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      response = await fetch(url);
      if (response.ok) {
        html = await response.text();
        return html;
      }
      if (response.status === 429) {
        attempts++;
        console.warn(
          `429 Too Many Requests. Retrying... (${attempts}/${maxAttempts - 1})`
        );
        await delay(1000 * attempts); // Exponential backoff
      }
    } catch (error) {
      console.error(`Fetch error: ${error.message}`);
      attempts++;
      await delay(1000 * attempts); // Exponential backoff
    }
  }
  if (!html) {
    throw new Error("Failed to fetch the page after multiple attempts");
  }
  return html;
}

// 获取当前列表页中所有视频的信息
async function getVideosInfo(with_comment) {
  const videoElements = document.querySelectorAll(".item");
  const parser = new DOMParser();
  const fetchPromises = Array.from(videoElements).map(
    async (element, index) => {
      const title = element.querySelector(".video-title").textContent.trim();
      const hasMagnet = element.querySelector("span.tag") !== null;
      const [number, ...titleWords] = title.split(" ");
      const formattedTitle = titleWords.join(" ");
      const [score, scoreNumber] = element
        .querySelector(".value")
        .textContent.replace(/[^0-9-.,]/g, "")
        .split(",");
      const premiered = element
        .querySelector(".meta")
        .textContent.replace(/[^0-9-]/g, "");
      const url = element.id.replace("video-", "");
      const full_url = root + "/v/" + url;

      let comment = "";
      if (with_comment) {
        await delay(index * INTERVAL);
        console.info(`fetch ${full_url}`);
        const html = await fetchWithRetry(full_url);
        const doc = parser.parseFromString(html, "text/html");
        comment = doc.querySelector(".textarea").textContent;
      }
      return {
        number,
        hasMagnet,
        title: formattedTitle,
        score: Number(score),
        scoreNumber: Number(scoreNumber),
        premiered,
        url,
        comment,
      };
    }
  );
  return await Promise.all(fetchPromises);
}

// 导出视频信息
async function doExport(with_comment = false) {
  preExecute();
  const res = await getVideosInfo(with_comment);
  current_result = current_result.concat(res);
  const nextPageButton = document.querySelector(".pagination-next");
  if (nextPageButton) {
    // 前往下一页
    set_localStorage("current_result", current_result);
    nextPageButton.click();
    return;
  }
  // 没有下一页, 导出结果
  downloadResult(current_result);
  // 重置状态
  reset();
}
function downloadResult(res) {
  const json = JSON.stringify(res, null, 2);
  const jsonUrl = URL.createObjectURL(
    new Blob([json], { type: "application/json" })
  );
  const downloadLink = document.createElement("a");
  const dateTime = new Date().toISOString().replace("T", " ").split(".")[0];
  let fileName = "";
  if (url.includes("/watched_videos")) {
    fileName = "watched-videos";
  } else if (url.includes("/want_watch_videos")) {
    fileName = "want-watch-videos";
  } else if (url.includes("/list_detail")) {
    const breadcrumb = document.getElementsByClassName("breadcrumb")[0];
    const li = breadcrumb.parentNode.querySelectorAll("li");
    fileName = li[1].innerText;
  } else if (url.includes("/lists")) {
    fileName = document.querySelector(".actor-section-name").innerText;
  }
  downloadLink.href = jsonUrl;
  downloadLink.download = `${fileName} ${dateTime}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

async function tryUntilExist(fn, interval = 100) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      console.debug("tryUntilExist", fn);
      const result = fn();
      if (result) {
        clearInterval(timer);
        resolve(result);
      }
    }, interval);
  });
}

// 将当前列表页中的所有视频标记为看过
async function markWatched() {
  const videoElements = document.querySelectorAll(".item");
  if (videoElements.length === 0) {
    return;
  }
  for (const element of videoElements) {
    const hasMagnet = element.querySelector("span.tag") !== null;
    if (!hasMagnet) {
      console.info(`skip ${element.id} because no magnet`);
      continue;
    }
    const url = element.id.replace("video-", "");
    const full_url = root + "/v/" + url;
    console.info(`open ${full_url}`);
    const newWindow = window.open(
      full_url,
      "window-for-mark",
      "popup,left=100,top=1000,width=100,height=100"
    );
    if (!newWindow) {
      console.error("Failed to open new window");
      return;
    }
    closeWindow = newWindow.close;
    // newWindow.location.href = full_url;
    while (true) {
      if (newWindow.document.body.innerHTML.includes('take a rest')){
        console.warn("take a rest, wait 10 seconds");
        await delay(3000);
      }
      // 检查 div.review-title 内的文本是否包含 "看過"
      const e = newWindow.document.querySelector("div.review-title");
      if (e && e.textContent.includes("看過")) {
        console.info("success");
        break;
      }
      // 点击看过按钮
      const watchedButton = await tryUntilExist(() =>
        newWindow.document.querySelector("input[value='watched']")
      );
      watchedButton.click();
      console.info(`click watched button`);
      // 点击保存按钮
      const saveButton = await tryUntilExist(() =>
        newWindow.document.querySelector(
          'input[value="保存"].button.is-success'
        )
      );
      saveButton.click();
      console.info(`click save button`);
      await delay(200);
    }
    await delay(1000);
  }
}

async function doMarkWatched() {
  preExecute();
  await markWatched();
  const nextPageButton = document.querySelector(".pagination-next");
  if (nextPageButton) {
    nextPageButton.click();
    return;
  }
  // 关闭窗口
  const w = window.open("", "window-for-mark");
  w.close();
  reset();
}

function runAction(action) {
  switch (action) {
    case "export-json":
      doExport();
      break;
    case "export-json-comment":
      doExport(true);
      break;
    case "mark-watched":
      doMarkWatched();
      break;
  }
}

function init() {
  const handler = (action) => (e) => {
    const button = e.target;
    button.textContent += "(运行中...)";
    set_localStorage("current_action", action);
    runAction(action);
  };
  const b1 = document.createElement("button");
  b1.textContent = "导出 json";
  b1.className = "button is-small";
  b1.addEventListener("click", handler("export-json"));
  actions.push({ button: b1 });

  const b2 = document.createElement("button");
  b2.textContent = "导出(包括评论)";
  b2.className = "button is-small";
  b2.addEventListener("click", handler("export-json-comment"));
  actions.push({ button: b2 });

  const b3 = document.createElement("button");
  b3.textContent = "标记为看过";
  b3.className = "button is-small";
  b3.addEventListener("click", handler("mark-watched"));
  actions.push({ button: b3 });

  const b4 = document.createElement("button");
  b4.textContent = "停止";
  b4.className = "button is-small";
  b4.addEventListener("click", () => {
    if (current_result.length > 0) downloadResult(current_result);
    reset();
    location.reload();
  });

  [b1, b2, b3, b4].map((b) => {
    if (url.includes("/list_detail")) {
      document.querySelector(".breadcrumb").querySelector("ul").appendChild(b);
    } else {
      document.querySelector(".toolbar").appendChild(b);
    }
  });
  // 继续上页任务
  runAction(current_action);
}

if (
  url.includes("/watched_videos") ||
  url.includes("/want_watch_videos") ||
  url.includes("/list_detail") ||
  url.includes("/lists")
) {
  init();
}
