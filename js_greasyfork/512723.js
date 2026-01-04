// ==UserScript==
// @name         숲 - 채팅 크게보기
// @namespace    https://www.sooplive.co.kr/
// @version      2024-10-15
// @description  세로가 긴 화면에서 필요 없는 UI를 숨겨 채팅을 크게 봅니다.
// @author       minibox
// @match        https://play.sooplive.co.kr/*/*
// @icon         https://www.sooplive.co.kr/favicon.ico
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512723/%EC%88%B2%20-%20%EC%B1%84%ED%8C%85%20%ED%81%AC%EA%B2%8C%EB%B3%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/512723/%EC%88%B2%20-%20%EC%B1%84%ED%8C%85%20%ED%81%AC%EA%B2%8C%EB%B3%B4%EA%B8%B0.meta.js
// ==/UserScript==

const btn = document.createElement("button");

btn.style.width = "24px";
btn.style.height = "24px";
btn.style.backgroundImage =
  'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2224px%22%20viewBox%3D%220%20-960%20960%20960%22%20width%3D%2224px%22%20fill%3D%22%23d5d7dc%22%3E%3Cpath%20d%3D%22M240-120v-120H120v-80h200v200h-80Zm400%200v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520%200v-200h80v120h120v80H640Z%22%2F%3E%3C%2Fsvg%3E")';
btn.style.marginLeft = "auto";

btn.onclick = (e) => {
  const styles = [
    ["#webplayer_contents", "height", "100vh"],
    ["#webplayer_contents", "margin", "0"],
    ["#soop-gnb", "display", "none"],
    [".player_bottom", "display", "none"],
    [".chat_title", "display", "none"],
    [".section_selectTab", "display", "none"],
    [".wrapping.side", "padding", "0"],
  ];

  if (e.target.classList.contains("off")) {
    styles.forEach((item) => {
      document.querySelector(item[0]).style[item[1]] = "";
    });
    e.target.classList.remove("off");
  } else {
    styles.forEach((item) => {
      document.querySelector(item[0]).style[item[1]] = item[2];
    });
    e.target.classList.add("off");
  }
};

document.querySelector("#ul2").appendChild(btn);
