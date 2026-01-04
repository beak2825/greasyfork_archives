// ==UserScript==
// @name         CopyPaste - Soop 복붙 허용
// @namespace    https://www.sooplive.co.kr
// @version      1.0
// @description  Soop 라이브 채팅창 복사/붙여넣기 허용
// @description:ko  Soop 라이브 채팅창 복사/붙여넣기 허용
// @author       AppleWind
// @match        https://play.sooplive.co.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sooplive.co.kr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528666/CopyPaste%20-%20Soop%20%EB%B3%B5%EB%B6%99%20%ED%97%88%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/528666/CopyPaste%20-%20Soop%20%EB%B3%B5%EB%B6%99%20%ED%97%88%EC%9A%A9.meta.js
// ==/UserScript==

(function() {
const writeArea = document.getElementById("write_area");
writeArea.addEventListener("cut", (e) => e.stopPropagation(), true);
writeArea.addEventListener("copy", (e) => e.stopPropagation(), true);
writeArea.addEventListener("paste", (e) => e.stopPropagation(), true);

console.log("아프리카 복붙 활성화");

})();