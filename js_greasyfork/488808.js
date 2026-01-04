// ==UserScript==
// @name         在侧边显示 Bilibili 视频字幕/文稿+字幕下载
// @name:en      Show transcript of Bilibili video on the side
// @version      2.1
// @description:en  Automatically display Bilibili video subtitles/scripts by default, support click to jump, text selection, auto-scrolling.
// @description     默认自动显示Bilibili视频字幕/文稿，支持点击跳转、文本选中、自动滚动。
// @namespace    https://bilibili.com/
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @author       bowencool、fakeoccupational
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/482165
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488808/%E5%9C%A8%E4%BE%A7%E8%BE%B9%E6%98%BE%E7%A4%BA%20Bilibili%20%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%E6%96%87%E7%A8%BF%2B%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/488808/%E5%9C%A8%E4%BE%A7%E8%BE%B9%E6%98%BE%E7%A4%BA%20Bilibili%20%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%E6%96%87%E7%A8%BF%2B%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function waitForElementToExist(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });
  });
}

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
async function showTranscript(subtitleInfo) {
  console.log("showTranscript", subtitleInfo);
  const { body: lines } = await fetch(
    subtitleInfo.subtitle_url.replace(/^\/\//, "https://")
  ).then((res) => res.json());
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
      video.currentTime = line.from;
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


async function myshowTranscript(subtitleInfo,thename) {
  console.log("myshowTranscript", subtitleInfo);
  const { body: lines } = await fetch(
    subtitleInfo.subtitle_url.replace(/^\/\//, "https://")
  ).then((res) => res.json());
  console.log("lines", lines);
  transcriptBox.innerHTML = "";
  var mytext = [];
  for (let line of lines) {
    if (line.music && line.music > MUSIC_FILTER_RATE) {
      continue;
    }
    mytext.push(line.content+"\n")
  }
    var blob = new Blob(mytext, { type: 'text/plain' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = thename+ '.txt';
    document.body.appendChild(link);
    link.click();// Trigger a click event on the link to initiate the download
    document.body.removeChild(link);
}


function getBvid(route /* : string|undefined */) {
  let url;
  if (route) {
    url = new URL(window.location.origin + route);
  } else {
    url = new URL(window.location.href);
  }
  const bvid = url.pathname.match(/\/video\/(\w+)/)?.[1];
  // if (!bvid) throw new Error("没有找到 bvid");
  let curPage = url.searchParams.get("p") - 1;
  if (!curPage || curPage == -1) {
    curPage = 0;
  }
  return { bvid, curPage };
}
async function getTranscript(route /* : string|undefined */) {
  const { bvid, curPage } = getBvid(route);
  if (!bvid) throw new Error("没有找到 bvid");
  const videoInfo = await request("/x/web-interface/view?bvid=" + bvid);
  const {
    subtitle: { subtitles = [] },
  } = await request(
    `/x/player/v2?aid=${videoInfo.aid}&cid=${videoInfo.pages[curPage].cid}`
  );
  console.log("subtitles", subtitles);
  transcriptBox.innerHTML = "没有字幕";
  if (subtitles.length == 0) throw new Error("没有字幕");
  return subtitles;
}

async function getVideoName(route /* : string|undefined */) {
  const { bvid, curPage } = getBvid(route);
  if (!bvid) throw new Error("没有找到 bvid");
  const videoInfo = await request("/x/web-interface/view?bvid=" + bvid);
    console.log('00000000000');
     console.log(videoInfo);
    console.log(videoInfo.pages[0].part);
    let mres = videoInfo.pages[0].part;
  return mres;
}

async function main() {
  "use strict";
  const subtitles = await getTranscript();
  // B站页面是SSR的，如果插入过早，页面 js 检测到实际 Dom 和期望 Dom 不一致，会导致重新渲染
  await waitForElementToExist("img.bili-avatar-img");
  const video = await waitForElementToExist("video");
  // const oldfanfollowEntry = await waitForElementToExist("#oldfanfollowEntry");
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
  await showTranscript(subtitles[0]);

 getVideoName().then((resultObject) => {// 处理异步的Promise对象，https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
  addDownloadButton(subtitles[0],resultObject );
  console.log(resultObject);
})


  const danmukuBox = await waitForElementToExist("#danmukuBox");
  // B站页面是SSR的，如果插入过早，页面 js 检测到实际 Dom 和期望 Dom 不一致，会导致重新渲染
  danmukuBox.parentNode.insertBefore(transcriptBox, danmukuBox);
}

async function updateTranscript(route /* : string|undefined */) {
  const subtitles = await getTranscript(route);
  await showTranscript(subtitles[0]);
}

main();



function addDownloadButton(theurl, thename){
    let myButton = document.createElement('button');
    myButton.textContent = 'Click me';
    myButton.classList.add("download");
    myButton.style = 'font-size: 26px; position: fixed; top: 200px; left: 0; z-index: 9999; list-style: none; border: 1px red solid; border-radius: 10px;background-color: #00ccff; padding:5px';
    myButton.innerHTML ='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="zhuzhan-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z" fill="currentColor"></path></svg>'
    myButton.addEventListener("mouseover", function() {
        myButton.innerHTML ="DOWN LOAD SUBTITLE";
    });

    myButton.addEventListener("mouseout", function() {
        myButton.innerHTML ='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="zhuzhan-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z" fill="currentColor"></path></svg>'
    });
    myButton.addEventListener('click',() => {
        console.log("]]]]]]]]]]]]]]]]",thename,JSON.stringify(thename) );
        myshowTranscript(theurl,thename);
    })
    document.body.appendChild(myButton);
}


function getCurrentState(route) {
  const { bvid, curPage } = getBvid(route);
  return `${bvid}?p=${curPage}`;
}
let lastState = getCurrentState();
traceRoute();

function traceRoute() {
  // popstate 可以监测到 hashchange
  window.addEventListener("popstate", (evt) => {
    const to = getCurrentState();
    if (to !== lastState) {
      console.log("bvid changed when popstate", lastState, to);
      updateTranscript();
    }
  });
  let theHistory /* History */ = history || window.history;
  if (!theHistory) return;

  const replacement = (originFn /* History['pushState'] */) => {
    return (data /* any */, t /* string */, route /* string | undefined */) => {
      const from = getCurrentState();
      const to = getCurrentState(route);
      if (route && from !== to) {
        console.log("bvid changed when pushState", from, to, route);
        updateTranscript(route);
      }
      const ret = originFn.call(theHistory, data, t, route);
      if (to) {
        lastState = to;
      }
      return ret;
    };
  };
  overrideMethod(
    /* <History['pushState']> */ theHistory,
    "pushState",
    replacement
  );
  overrideMethod(
    /* <History['replaceState']> */ theHistory,
    "replaceState",
    replacement
  );
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

