// ==UserScript==
// @name         치지직 채팅 숨기기
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  hide chat
// @author       lazymoon
// @match        https://chzzk.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493096/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%B1%84%ED%8C%85%20%EC%88%A8%EA%B8%B0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493096/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%B1%84%ED%8C%85%20%EC%88%A8%EA%B8%B0%EA%B8%B0.meta.js
// ==/UserScript==

setTimer();

function setTimer() {
    setInterval(function() {
    var elements = document.getElementsByClassName('live_chatting_list_wrapper__a5XTV')[0].children;
    var numElements = elements.length;
    for (var i = 0; i < numElements - 30; i++) {
        elements[i].style.display = 'none';
    }
  }, 1000);
}