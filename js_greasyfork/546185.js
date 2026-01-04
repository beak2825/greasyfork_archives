// ==UserScript==
// @name              뮬 판매완료 도우미
// @description       판매가 완료됐으면 판매완료 버튼을 쳐누르라고
// @match             https://www.mule.co.kr/bbs/market/*
// @icon              https://www.mule.co.kr/favicon/android-icon-192x192.png
// @grant             none
// @version           1.3
// @author            coofy
// @license           MIT
// @namespace         https://github.com/wecoofy/mule-helper-scripts
// @homepage          https://github.com/wecoofy/mule-helper-scripts
// @homepageURL       https://github.com/wecoofy/mule-helper-scripts
// @supportURL        https://github.com/wecoofy/mule-helper-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/546185/%EB%AE%AC%20%ED%8C%90%EB%A7%A4%EC%99%84%EB%A3%8C%20%EB%8F%84%EC%9A%B0%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/546185/%EB%AE%AC%20%ED%8C%90%EB%A7%A4%EC%99%84%EB%A3%8C%20%EB%8F%84%EC%9A%B0%EB%AF%B8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // feature toggles
  const REMOVE_PANWAN = true;
  const MARK_PANWAN = true;

  function processItems() {
    const url = new URLSearchParams(window.location.search);
    const viewMode = url.get("mode");
    const sellStatus = url.get("sell_status");
    console.log(`viewMode = '${viewMode}', sellStatus = '${sellStatus}'`);

    if (viewMode === "gallery") {
      processGalleryMode(sellStatus);
    } else {
      processListMode(sellStatus);
    }
  }

  function processGalleryMode(sellStatus) {
    document.querySelectorAll("div.item").forEach((item) => {
      const tit = item.querySelector("a > div > div.tit");
      if (!tit) return;

      // search in title text only
      let isPanwan = false;
      for (let node of tit.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (
            text.includes("판완") ||
            text.includes("판매완료") ||
            text.includes("판매완")
          ) {
            isPanwan = true;
            break;
          }
        }
      }

      if (!isPanwan) {
        return;
      }

      // remove panwan items
      if (
        REMOVE_PANWAN &&
        (sellStatus === "판매중" || sellStatus === "예약중")
      ) {
        item.remove();
        return;
      }

      // mark panwan tag
      if (MARK_PANWAN && sellStatus === "" /* 전체 */) {
        if (!tit.querySelector("span.header-soldout.small")) {
          const span = document.createElement("span");
          span.className = "header-soldout small";
          span.textContent = "판매완료";
          tit.prepend(span);
          // console.log("mark");
        }
      }
    });
  }

  function processListMode(sellStatus) {
    document.querySelectorAll("tbody tr").forEach((row) => {
      // 공지사항이나 광고는 건너뛰기
      if (
        row.classList.contains("notice") ||
        row.classList.contains("board-ad-box")
      ) {
        return;
      }

      const titleCell = row.querySelector("td.title");
      if (!titleCell) return;

      const titleLink = titleCell.querySelector("a");
      if (!titleLink) return;

      // 제목 텍스트에서 판완 검색
      let isPanwan = false;
      const titleText = titleLink.textContent || titleLink.innerText;
      if (
        titleText.includes("판완") ||
        titleText.includes("판매완료") ||
        titleText.includes("판매완")
      ) {
        isPanwan = true;
      }

      // 이미 판매완료 태그가 있는지도 확인
      if (titleCell.querySelector("span.header-soldout.small")) {
        isPanwan = true;
      }

      if (!isPanwan) {
        return;
      }

      // remove panwan items
      if (
        REMOVE_PANWAN &&
        (sellStatus === "판매중" || sellStatus === "예약중")
      ) {
        row.remove();
        return;
      }

      // mark panwan tag
      if (MARK_PANWAN && sellStatus === "" /* 전체 */) {
        if (!titleCell.querySelector("span.header-soldout.small")) {
          const span = document.createElement("span");
          span.className = "header-soldout small";
          span.textContent = "판매완료";
          titleLink.prepend(span);
          titleLink.insertAdjacentText("afterbegin", " ");
          // console.log("mark list item");
        }
      }
    });
  }

  window.addEventListener("load", processItems);
})();

/*
https://www.mule.co.kr/bbs/market/sell?page=1&map=list&mode=gallery&region=&start_price=&end_price=&qf=title&qs=bb735&category=&ct1=&ct2=&ct3=&store=&options=&soldout=&sell_status=&sido=&gugun=&dong=&period=6&of=wdate&od=desc&andor=and
https://www.mule.co.kr/bbs/market/sell?page=1&map=list&mode=list&region=&start_price=&end_price=&qf=title&qs=bb735&category=&ct1=&ct2=&ct3=&store=&options=&soldout=&sell_status=&sido=&gugun=&dong=&period=6&of=wdate&od=desc&andor=and
*/
