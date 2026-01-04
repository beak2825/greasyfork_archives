// ==UserScript==
// @name         test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  test입니다
// @license MIT
// @match        https://www.q-net.or.kr/*
// @downloadURL https://update.greasyfork.org/scripts/487886/test.user.js
// @updateURL https://update.greasyfork.org/scripts/487886/test.meta.js
// ==/UserScript==

// 모든 td 요소를 가져옴
var tdElements = document.querySelectorAll('td');

// 각 td 요소의 값을 확인하고 변경
tdElements.forEach(function(tdElement) {
    var value = tdElement.textContent.trim(); // 값 앞뒤의 공백 제거

    // if문을 사용하여 값을 확인하고 변경
    if (value === '1차') {
        tdElement.textContent = '2차';
    } else if (value === '01130303') {
        tdElement.textContent = '01120202';
    }
});

