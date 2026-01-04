// ==UserScript==
// @name         b站分P视频随机播放
// @namespace    https://github.com/LU-JIEJIE/bilibili-random-play
// @version      1.1.0
// @author       lu-jiejie
// @description  为B站分P视频添加随机播放功能
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     https://github.com/LU-JIEJIE/bilibili-random-play
// @match        https://www.bilibili.com/video/*
// @downloadURL https://update.greasyfork.org/scripts/469248/b%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/469248/b%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function setLocalStorage(key, value) {
    window.localStorage.setItem(key, value);
  }
  function getLocalStorage(key) {
    return window.localStorage.getItem(key);
  }
  function formatLog(logStr) {
    console.log(`[Bilibili Random Play]: ${logStr}`);
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function createElementFromHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.firstChild;
  }
  function insertBefore(newNode, referenceNode) {
    var _a;
    (_a = referenceNode.parentNode) == null ? void 0 : _a.insertBefore(newNode, referenceNode);
  }
  function insertAfter(newNode, referenceNode) {
    var _a;
    (_a = referenceNode.parentNode) == null ? void 0 : _a.insertBefore(newNode, referenceNode.nextSibling);
  }
  const NOT_LIST_TYPE_VIDEO = "当前页面不是分P视频，无法使用随机播放。";
  const CONTROL_PREV_BUTTON = `<div class="bpx-player-ctrl-btn bpx-player-ctrl-prev" role="button" aria-label="上一个" tabindex="0" "=""><div class="bpx-player-ctrl-btn-icon"><span class="bpx-common-svg-icon"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 22 22" viewBox="0 0 22 22"><path d="M16 5a1 1 0 0 0-1 1v4.615a1.431 1.431 0 0 0-.615-.829L7.21 5.23A1.439 1.439 0 0 0 5 6.445v9.11a1.44 1.44 0 0 0 2.21 1.215l7.175-4.555a1.436 1.436 0 0 0 .616-.828V16a1 1 0 0 0 2 0V6C17 5.448 16.552 5 16 5z"></path></svg></span></div></div>`;
  const CONTROL_NEXT_BUTTON = `<div class="bpx-player-ctrl-btn bpx-player-ctrl-next" role="button" aria-label="下一个" tabindex="0"><div class="bpx-player-ctrl-btn-icon"><span class="bpx-common-svg-icon"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 22 22" viewBox="0 0 22 22"><path d="M16 5a1 1 0 0 0-1 1v4.615a1.431 1.431 0 0 0-.615-.829L7.21 5.23A1.439 1.439 0 0 0 5 6.445v9.11a1.44 1.44 0 0 0 2.21 1.215l7.175-4.555a1.436 1.436 0 0 0 .616-.828V16a1 1 0 0 0 2 0V6C17 5.448 16.552 5 16 5z"></path></svg></span></div></div>`;
  const SET_TIMEOUT_TIME = 500;
  let isRandom = false;
  let totalPage = 0;
  let curRandomIndex = 0;
  let randomList = [];
  let videoList = [];
  let prevButton;
  let nextButton;
  let lock = false;
  function init() {
    ({ totalPage } = getPageInfo());
    if (totalPage === 0) {
      formatLog(NOT_LIST_TYPE_VIDEO);
      return;
    }
    createControlButton();
    resetControlButton();
    initVideoList();
    bindVideoListEvent();
  }
  function getPageInfo() {
    const pageInfoSpan = document.querySelector("span.cur-page");
    if (!pageInfoSpan)
      return { curPage: 0, totalPage: 0 };
    const [curPage, totalPage2] = pageInfoSpan.innerHTML.replace(/\(|\)/, "").split("/").map((item) => Number.parseInt(item));
    return { curPage, totalPage: totalPage2 };
  }
  function initVideoList() {
    setTimeout(() => {
      videoList = Array.from(document.querySelectorAll("ul.list-box > li > a > div.clickitem"));
      if (videoList.length === 0) {
        initVideoList();
      } else {
        createRandomButton();
      }
    }, SET_TIMEOUT_TIME);
  }
  function createControlButton() {
    prevButton = createElementFromHTML(CONTROL_PREV_BUTTON);
    nextButton = createElementFromHTML(CONTROL_NEXT_BUTTON);
    prevButton.addEventListener("click", () => {
      if (isRandom)
        playNext(-1);
      else
        videoList[videoList.length - 1].click();
    });
    nextButton.addEventListener("click", () => {
      if (isRandom)
        playNext();
      else
        videoList[0].click();
    });
  }
  function prevButtonEvent(e) {
    if (isRandom) {
      playNext(-1);
      e.stopPropagation();
      e.preventDefault();
    }
  }
  function nextButtonEvent(e) {
    if (isRandom) {
      playNext();
      e.stopPropagation();
      e.preventDefault();
    }
  }
  function resetControlButton() {
    changeControlButtonState("prev", "remove");
    changeControlButtonState("next", "remove");
    setTimeout(() => {
      const nextButton2 = document.querySelector("div.bpx-player-ctrl-next");
      const prevButton2 = document.querySelector("div.bpx-player-ctrl-prev");
      if (nextButton2 && prevButton2) {
        prevButton2.removeEventListener("click", prevButtonEvent);
        nextButton2.removeEventListener("click", nextButtonEvent);
        prevButton2.addEventListener("click", prevButtonEvent);
        nextButton2.addEventListener("click", nextButtonEvent);
      } else if (nextButton2) {
        changeControlButtonState("prev", "insert");
      } else if (prevButton2) {
        changeControlButtonState("next", "insert");
      } else {
        resetControlButton();
      }
    }, SET_TIMEOUT_TIME);
  }
  function handleRandomState(state) {
    if (state === "on") {
      isRandom = true;
      changeRandomButtonState(true);
      setLocalStorage("isRandom", "true");
      closeAutoPlay();
      initRandomList();
      bindVideoEvent();
    } else if (state === "off") {
      isRandom = false;
      changeRandomButtonState(false);
      setLocalStorage("isRandom", "");
    }
  }
  function closeAutoPlay() {
    lock = true;
    const autoPlayButton = document.querySelector("#multi_page > div.head-con > div.head-right > span:nth-child(2) > span.switch-button");
    if (autoPlayButton == null ? void 0 : autoPlayButton.classList.contains("on"))
      autoPlayButton.click();
    lock = false;
  }
  function playNext(distance = 1) {
    curRandomIndex = (curRandomIndex + distance + totalPage) % randomList.length;
    const nextPage = randomList[curRandomIndex];
    videoList[nextPage - 1].click();
  }
  function bindVideoEvent() {
    setTimeout(() => {
      const video = document.querySelector("div.bpx-player-video-wrap > video");
      if (video) {
        video.addEventListener("ended", (event) => {
          event.stopImmediatePropagation();
          playNext();
        });
      } else {
        bindVideoEvent();
      }
    }, SET_TIMEOUT_TIME);
  }
  function bindVideoListEvent() {
    setTimeout(() => {
      const videoList2 = document.querySelector("ul.list-box");
      videoList2 == null ? void 0 : videoList2.addEventListener("click", (e) => {
        if (e.target.tagName !== "UL") {
          resetControlButton();
          const curPage = +/p=(\d+)/.exec(document.location.href)[1];
          curRandomIndex = randomList.findIndex((item) => item === curPage);
        }
      });
    }, SET_TIMEOUT_TIME);
  }
  function changeControlButtonState(buttonType, buttonState) {
    const playButton = document.querySelector("div.bpx-player-ctrl-play");
    if (buttonType === "prev") {
      if (buttonState === "insert")
        insertBefore(prevButton, playButton);
      else
        prevButton.remove();
    } else if (buttonType === "next") {
      if (buttonState === "insert")
        insertAfter(nextButton, playButton);
      else
        nextButton.remove();
    }
  }
  function createRandomButton() {
    const path = document.querySelector("#multi_page > div.head-con > div.head-right");
    path.insertAdjacentHTML("afterbegin", `
  <span class="next-button" id="random-button">
    <span class="txt">随机</span>
    <span class="switch-button"></span>
  </span>
  `);
    document.querySelector("span#random-button").addEventListener("click", () => {
      if (isRandom)
        handleRandomState("off");
      else
        handleRandomState("on");
    });
    isRandom = Boolean(getLocalStorage("isRandom")) || false;
    if (isRandom)
      handleRandomState("on");
    else
      handleRandomState("off");
    const autoPlayButton = document.querySelector("#multi_page > div.head-con > div.head-right > span:nth-child(2)");
    autoPlayButton.addEventListener("click", () => {
      if ((autoPlayButton == null ? void 0 : autoPlayButton.children[1].classList.contains("on")) && isRandom && !lock)
        handleRandomState("off");
    });
  }
  function changeRandomButtonState(on) {
    const randomButton = document.querySelector("span#random-button .switch-button");
    if (on)
      randomButton.classList.add("on");
    else
      randomButton.classList.remove("on");
  }
  function initRandomList() {
    randomList = Array.from({ length: totalPage }).fill(0).map((_, index) => index + 1);
    for (let i = randomList.length - 1; i >= 0; i--) {
      const randomIndex = randomInt(0, i);
      [randomList[i], randomList[randomIndex]] = [randomList[randomIndex], randomList[i]];
    }
    const { curPage } = getPageInfo();
    randomList.splice(randomList.indexOf(curPage), 1);
    randomList.unshift(curPage);
    curRandomIndex = 0;
  }
  init();

})();
