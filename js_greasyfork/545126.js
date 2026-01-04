// ==UserScript==
// @name         CHZZK(치지직) 라이브 대기
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  CHZZK(치지직) 라이브 대기 화면에서 날짜와 시간을 표시
// @author       멍멍이
// @match        https://chzzk.naver.com/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545126/CHZZK%28%EC%B9%98%EC%A7%80%EC%A7%81%29%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8C%80%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/545126/CHZZK%28%EC%B9%98%EC%A7%80%EC%A7%81%29%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8C%80%EA%B8%B0.meta.js
// ==/UserScript==
 
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
 
  const formatKoreanTime = () => {
    const now = new Date();
    const w = ["일","월","화","수","목","금","토"][now.getDay()];
    const Y = now.getFullYear();
    const M = String(now.getMonth() + 1).padStart(2, "0");
    const D = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${Y}-${M}-${D} (${w}) ${hh}:${mm}:${ss}`;
  };
 
  const findOfflineTitle = () => {
    const xpath = "//strong[contains(normalize-space(string(.)), '채널이 오프라인 상태입니다') or contains(normalize-space(string(.)), '방송 시작 기다리는 중...')]";
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  };
 
  let intervalId = null;
  let timeNode = null;
 
  const startAddingTime = (node) => {
    if (!node) return;
    if (node.textContent.includes("채널이 오프라인 상태입니다")) {
      node.textContent = "방송 시작 기다리는 중...";
    }
    node.style.fontSize = "25px";
    node.style.fontWeight = "bold";
    if (timeNode && timeNode.parentNode === node.parentNode) return;
    timeNode = document.createElement("div");
    timeNode.style.fontSize = "35px";
    timeNode.style.fontWeight = "bold";
    timeNode.style.color = "white";
    timeNode.style.marginBottom = "10px";
    timeNode.style.textAlign = "center";
    timeNode.style.textShadow = "none";
    timeNode.style.pointerEvents = "none";
    node.insertAdjacentElement("beforebegin", timeNode);
    intervalId = setInterval(() => {
      if (!timeNode || !document.body.contains(timeNode)) {
        stopAddingTime();
        return;
      }
      timeNode.textContent = formatKoreanTime();
    }, 1000);
  };
 
  const stopAddingTime = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (timeNode) {
      timeNode.remove();
      timeNode = null;
    }
  };
 
  const observer = new MutationObserver(() => {
    const node = findOfflineTitle();
    if (node) startAddingTime(node);
    else stopAddingTime();
  });
 
  observer.observe(document.documentElement, { childList: true, subtree: true });
 
  await sleep(200);
  const initial = findOfflineTitle();
  if (initial) startAddingTime(initial);
})();