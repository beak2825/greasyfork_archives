// ==UserScript==
// @name         네이버 카페 iframe 자동 변환 + 즐겨찾기 정렬
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  네이버 카페에서 iframe 내 링크 자동 처리 및 즐겨찾기 메뉴 드래그 정렬
// @match        https://cafe.naver.com/*
// @grant        none
// @run-at       document-idle
// @noframes     false
// @downloadURL https://update.greasyfork.org/scripts/533231/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20iframe%20%EC%9E%90%EB%8F%99%20%EB%B3%80%ED%99%98%20%2B%20%EC%A6%90%EA%B2%A8%EC%B0%BE%EA%B8%B0%20%EC%A0%95%EB%A0%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/533231/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20iframe%20%EC%9E%90%EB%8F%99%20%EB%B3%80%ED%99%98%20%2B%20%EC%A6%90%EA%B2%A8%EC%B0%BE%EA%B8%B0%20%EC%A0%95%EB%A0%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function parseCafeLink(pathname, search) {
    const cafeIdMatch = pathname.match(/cafes\/(\d+)/);
    const memberCodeMatch = pathname.match(/members\/(\d+)/);
    const isPopular = pathname.includes("/popular");

    if (cafeIdMatch && memberCodeMatch) {
      return {
        type: "MEMBER",
        cafeId: cafeIdMatch[1],
        memberCode: memberCodeMatch[1],
      };
    } else if (cafeIdMatch && isPopular) {
      return {
        type: "POPULAR",
        cafeId: cafeIdMatch[1],
      };
    }
    return null;
  }

  class SideProfileHandler {
    /** @this {HTMLAnchorElement} */
    static sideProfile() {
      const iframe = document.querySelector("#main-area iframe#cafe_main");
      const info = parseCafeLink(this.pathname, this.search);
      if (iframe && info?.type === "MEMBER") {
        this.href = `/ca-fe/cafes/${info.cafeId}/members/${info.memberCode}`;
        this.target = "cafe_main";
      }
    }

    /** @this {HTMLAnchorElement} */
    static popularMenu() {
      const iframe = document.querySelector("#main-area iframe#cafe_main");
      const info = parseCafeLink(this.pathname, this.search);
      if (iframe && info?.type === "POPULAR") {
        this.href = `/ca-fe/cafes/${info.cafeId}/popular`;
        this.target = "cafe_main";
      }
    }

    /** @this {HTMLAnchorElement[]} */
    static menuListNoTarget() {
      const iframe = document.querySelector("#main-area iframe#cafe_main");
      if (iframe) {
        this.forEach((a) => (a.target = "cafe_main"));
      }
    }
  }

  // 자동 실행
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[href*='/member/']").forEach((a) => {
      SideProfileHandler.sideProfile.call(a);
    });

    document.querySelectorAll("a[href*='/popular/']").forEach((a) => {
      SideProfileHandler.popularMenu.call(a);
    });

    const menuAnchors = Array.from(document.querySelectorAll("#menuListArea a"));
    SideProfileHandler.menuListNoTarget.call(menuAnchors);
  });

  // 즐겨찾기 정렬
  function arrangeFavorite(ul, favoriteOrder) {
    const doc = ul.ownerDocument;
    for (const id of favoriteOrder) {
      const a = doc.getElementById(`favoriteMenuLink${id}`);
      const li = a?.closest("li");
      if (li) {
        ul.appendChild(li);
      }
    }
  }

  function onDragStartFavoriteMenu(event) {
    event.dataTransfer.setData("application/ncop.a.id", this.id);
  }

  function onDropFavoriteMenu(event) {
    event.preventDefault();
    const dropFromId = event.dataTransfer.getData("application/ncop.a.id");
    const dropToId = event.target.id;
    const doc = event.target.ownerDocument;
    const aDropFrom = doc.getElementById(dropFromId);
    const aDropTo = doc.getElementById(dropToId);
    const liDropFrom = aDropFrom?.closest("li");
    const liDropTo = aDropTo?.closest("li");
    const ul = event.target.closest("ul");
    if (!ul || !liDropFrom || !liDropTo) return;

    const cafeId = new URLSearchParams(aDropTo.search).get("search.clubid");
    if (!cafeId) return;

    const liArray = [...ul.children];
    const fromIndex = liArray.indexOf(liDropFrom);
    const toIndex = liArray.indexOf(liDropTo);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    if (toIndex < fromIndex) {
      ul.insertBefore(liDropFrom, liDropTo);
    } else {
      ul.insertBefore(liDropFrom, liDropTo.nextSibling);
    }

    const favoriteOrder = [...ul.querySelectorAll("li a")].map((a) => {
      const matches = a.id?.match(/^favoriteMenuLink(?<idStr>\d+)$/);
      if (matches) {
        const { idStr } = matches.groups;
        return parseInt(idStr);
      }
    }).filter((item) => item !== undefined);

    chrome.storage.sync.get("favoriteOrder").then((items) => {
      if (!items.favoriteOrder) {
        items.favoriteOrder = [];
      }
      const favoriteOrderItem = items.favoriteOrder.find((item) => item.cafeId === cafeId);
      if (favoriteOrderItem) {
        favoriteOrderItem.favoriteOrder = favoriteOrder;
      } else {
        items.favoriteOrder.push({ cafeId, favoriteOrder });
      }
      chrome.storage.sync.set(items);
    });
  }

  // 전역 등록
  window.onDragStartFavoriteMenu = onDragStartFavoriteMenu;
  window.onDropFavoriteMenu = onDropFavoriteMenu;
  window.arrangeFavorite = arrangeFavorite;
})();
