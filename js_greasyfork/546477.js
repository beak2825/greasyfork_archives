// ==UserScript==
// @name         SOOP(숲)·CHZZK(치지직) 라이브 대기
// @version      1.0.0
// @description  SOOP(숲)·CHZZK(치지직) 방송 대기 화면에서 날짜와 시간 표시 및 방송 시작 시 자동 새로고침
// @author       멍멍이
// @match        https://play.sooplive.co.kr/*
// @match        https://chzzk.naver.com/live/*
// @icon         https://res.sooplive.co.kr/favicon.ico
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1443830
// @downloadURL https://update.greasyfork.org/scripts/546477/SOOP%28%EC%88%B2%29%C2%B7CHZZK%28%EC%B9%98%EC%A7%80%EC%A7%81%29%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8C%80%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/546477/SOOP%28%EC%88%B2%29%C2%B7CHZZK%28%EC%B9%98%EC%A7%80%EC%A7%81%29%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8C%80%EA%B8%B0.meta.js
// ==/UserScript==

(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const formatKoreanTime = () => {
    const now = new Date();
    const weekdays = ["일","월","화","수","목","금","토"];
    const Y = now.getFullYear();
    const M = String(now.getMonth() + 1).padStart(2, "0");
    const D = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${Y}-${M}-${D} (${weekdays[now.getDay()]}) ${hh}:${mm}:${ss}`;
  };

  const soopHandler = async () => {
    const waitForElement = async (selector) => {
      return new Promise((resolve) => {
        let observedElement = document.querySelector(selector);
        if (observedElement) return resolve(observedElement);
        let observer = new MutationObserver(() => {
          let observedElement = document.querySelector(selector);
          if (observedElement) {
            observer.disconnect();
            resolve(observedElement);
          }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
      });
    };

    const reloadBroadCastMain = async () => {
      let broadCastText = await waitForElement(`.notBroadingInfoTitle`);
      const bjid = location.pathname.split("/").at(1);
      let BNO = undefined;
      do {
        await sleep(1000);
        const { CHANNEL: resp } = await fetch(
          "https://live.sooplive.co.kr/afreeca/player_live_api.php",
          {
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: `bid=${bjid}&bno=null&type=live&pwd=&player_type=html5&stream_type=common&quality=HD&mode=landing&from_api=0&is_revive=false`,
            method: "POST",
            mode: "cors",
            credentials: "include",
          }
        ).then((r) => r.json());
        BNO = resp.BNO;
        if (broadCastText) {
          broadCastText.innerHTML = `
            <div style="font-size:35px; margin-bottom:10px;">
              ${formatKoreanTime()}
            </div>
            <div style="font-size:25px;">
              방송 시작 기다리는 중...
            </div>
          `;
        }
        if (BNO > 0) break;
      } while (BNO === undefined || location.pathname.split("/").at(-1) != BNO);
      if (BNO != location.pathname.split("/").at(-1) && BNO) {
        location.pathname = `/${bjid}/${BNO}`;
      }
    };

    await reloadBroadCastMain();
    await waitForElement(`#player > div.video_blind > div > div > div`);
    await reloadBroadCastMain();
  };

  const chzzkHandler = async () => {
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
  };

  if (location.hostname.includes("sooplive.co.kr")) {
    soopHandler();
  } else if (location.hostname.includes("chzzk.naver.com")) {
    chzzkHandler();
  }
})();
