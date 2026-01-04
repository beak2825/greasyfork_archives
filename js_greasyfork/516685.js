// ==UserScript==
// @name         화면 아몰랑 (간단 버전)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  사이트가 로딩될 때마다 화면 중앙을 무조건 클릭합니다
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516685/%ED%99%94%EB%A9%B4%20%EC%95%84%EB%AA%B0%EB%9E%91%20%28%EA%B0%84%EB%8B%A8%20%EB%B2%84%EC%A0%84%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516685/%ED%99%94%EB%A9%B4%20%EC%95%84%EB%AA%B0%EB%9E%91%20%28%EA%B0%84%EB%8B%A8%20%EB%B2%84%EC%A0%84%29.meta.js
// ==/UserScript==
'use strict';

function createFullscreenButton() {
  document.body.insertAdjacentHTML("afterbegin", '<div id="b0n" style="background-color: transparent; position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; opacity: 0; z-index: 2147483647"><svg width="24" height="24" style="margin: auto;"><path d="M7,14L5,14v5h5v-2L7,17v-3zM5,10h2L7,7h3L10,5L5,5v5zM17,17h-3v2h5v-5h-2v3zM14,5v2h3v3h2L19,5h-5z"/></svg></div>');
  
  var btn = document.getElementById("b0n");
  var reF = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
  
  var action = function() {
    reF.call(document.documentElement);
    btn.style.display = 'none';
  }
  
  btn.onclick = action;
}

createFullscreenButton();

document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement) {
    var existingBtn = document.getElementById("b0n");
    if (existingBtn) {
      existingBtn.style.display = 'flex';
    } else {
      createFullscreenButton();
    }
  }
});