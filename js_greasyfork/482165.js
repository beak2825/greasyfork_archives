// ==UserScript==
// @name         在侧边显示 Bilibili 视频字幕/文稿
// @name:en      Show transcript of Bilibili video on the side
// @version      2.1.3
// @description:en  Automatically display Bilibili video subtitles/scripts by default, support click to jump, text selection, auto-scrolling.
// @description     默认自动显示Bilibili视频字幕/文稿，支持点击跳转、文本选中、自动滚动。
// @namespace    https://bilibili.com/
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @author       bowencool
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/482165
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @require      https://cdn.jsdelivr.net/gh/bowencool/Tampermonkey-Scripts@b65b677146fdf0d0af884371a943d7f4a65f6ec8/shared/waitForElementToExist.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/482165/%E5%9C%A8%E4%BE%A7%E8%BE%B9%E6%98%BE%E7%A4%BA%20Bilibili%20%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%E6%96%87%E7%A8%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/482165/%E5%9C%A8%E4%BE%A7%E8%BE%B9%E6%98%BE%E7%A4%BA%20Bilibili%20%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%E6%96%87%E7%A8%BF.meta.js
// ==/UserScript==

async function request(url, options) {
  return fetch(`https://api.bilibili.com${url}`, {
    ...options,
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code != 0) {
        throw new Error(data.message);
      }
      return data.data;
    });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

GM_addStyle(`
.transcript-box {
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  padding: 12px 16px;
  max-height: 50vh;
  overflow: scroll;
  margin-bottom: 20px;
  pointer-events: initial;
}
.transcript-line {
    display: flex;
}
.transcript-line:hover {
  background-color: #0002;
}
.transcript-line.active {
  font-weight: bold;
  background-color: #0002;
}

.transcript-line-time {
    flex: none;
    overflow: hidden;
    width:66px;
    user-select: none;
    corsur: pointer;
    color: var(--bpx-fn-hover-color,#00b5e5);
}

.transcript-line-content {
    // white-space: nowrap;
}

`);

const MUSIC_FILTER_RATE = 0.85;

function fixNumber(n) {
  return n.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

function parseTime(t) {
  t = parseInt(t);
  return `${fixNumber(parseInt(t / 60))}:${fixNumber(t % 60)}`;
}

const transcriptBox = document.createElement("div");
transcriptBox.className = "transcript-box";
transcriptBox.innerHTML =
  "开启字幕中...如果长时间无响应，请手动在视频上打开一次字幕";

async function showTranscript(subtitleInfo) {
  const { body: lines } = subtitleInfo;
  console.log("lines", lines);
  transcriptBox.innerHTML = "";
  for (let line of lines) {
    if (line.music && line.music > MUSIC_FILTER_RATE) {
      continue;
    }
    let timeLink = document.createElement("a");
    timeLink.className = "transcript-line-time";
    // timeLink.setAttribute("data-index", line.index);
    timeLink.textContent = parseTime(line.from);
    timeLink.addEventListener("click", () => {
      document.querySelector("video").currentTime = line.from;
    });
    let lineDiv = document.createElement("div");
    lineDiv.className = "transcript-line";
    lineDiv.setAttribute("data-from", line.from);
    lineDiv.setAttribute("data-to", line.to);
    lineDiv.appendChild(timeLink);
    let span = document.createElement("span");
    span.className = "transcript-line-content";
    span.textContent = line.content;

    lineDiv.appendChild(span);
    transcriptBox.appendChild(lineDiv);
  }
}

async function main() {
  "use strict";

  // B站页面是SSR的，如果插入过早，页面 js 检测到实际 Dom 和期望 Dom 不一致，会导致重新渲染
  await waitForElementToExist("img.bili-avatar-img");
  waitForElementToExist(".bpx-player-ctrl-subtitle .bpx-common-svg-icon").then(
    (btn) => {
      btn.click();
      setTimeout(() => {
        btn.click();
      }, 1000);
    }
  );
  const video = await waitForElementToExist("video");
  video.addEventListener("timeupdate", () => {
    const currentTime = video.currentTime;
    const lastActiveLine = document.querySelector(".transcript-line.active");
    const lineBoxes = lastActiveLine
      ? [lastActiveLine, lastActiveLine.nextSibling]
      : document.querySelectorAll(".transcript-line");

    for (let i = 0; i < lineBoxes.length; i++) {
      const currentLine = lineBoxes[i];
      const from = +currentLine.getAttribute("data-from");
      const to = +currentLine.getAttribute("data-to");
      // console.log({ i, from, to, currentTime }, currentLine);
      if (currentTime >= to || currentTime <= from) {
        // Remove the 'active' class
        if (currentLine.classList.contains("active")) {
          currentLine.classList.remove("active");
        }
      }
      if (currentTime > from && currentTime < to) {
        const targetPosition =
          currentLine.offsetTop - transcriptBox.clientHeight * 0.5;
        transcriptBox.scrollTo(0, targetPosition);
        // Add the 'active' class to the current line
        currentLine.classList.add("active");
        break;
      }
    }
  });

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "src") {
        if (video.src) {
          transcriptBox.innerHTML =
            "开启字幕中...如果长时间无响应，请手动在视频上打开一次字幕";
          waitForElementToExist(
            ".bpx-player-ctrl-subtitle .bpx-common-svg-icon",
            3000
          )
            .then((btn) => {
              btn.click();
              setTimeout(() => {
                btn.click();
              }, 500);
            })
            .catch(() => {
              transcriptBox.innerHTML = "请手动打开字幕";
            });
        }
      }
    }
  });

  observer.observe(video, { attributes: true });

  const danmukuBox = await waitForElementToExist("#danmukuBox");
  // B站页面是SSR的，如果插入过早，页面 js 检测到实际 Dom 和期望 Dom 不一致，会导致重新渲染
  danmukuBox.parentNode.insertBefore(transcriptBox, danmukuBox);
}

main();

traceHttp();

function traceHttp() {
  overrideMethod(XMLHttpRequest.prototype, "send", (originFn) => {
    return function (
      // this: XMLHttpRequest,
      ...args /* : Parameters<XMLHttpRequest['send']> */
    ) {
      this.addEventListener("readystatechange", async () => {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.responseURL.startsWith("https://aisubtitle.hdslb.com")) {
            const subtitleInfo = JSON.parse(this.responseText);
            showTranscript(subtitleInfo);
          }
        }
      });

      return originFn.apply(this, args);
    };
  });
}
function overrideMethod /* <F extends Function> */(
  target /* : { [key: string]: any } */,
  key /* : string */,
  replacement /* : (f: F) => F */
) {
  if (!(key in target)) return;
  const originFn /* : F */ = target[key];
  const wrapped /* : F */ = replacement(originFn);
  if (wrapped instanceof Function) {
    target[key] = wrapped;
  }
}
