// ==UserScript==
// @name         코레일 오토
// @namespace    http://tampermonkey.net/
// @version      2025-02-27
// @description  코레일 클릭클릭!
// @author       You
// @match        https://www.korail.com/ticket/search/list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=korail.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528192/%EC%BD%94%EB%A0%88%EC%9D%BC%20%EC%98%A4%ED%86%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/528192/%EC%BD%94%EB%A0%88%EC%9D%BC%20%EC%98%A4%ED%86%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function handleF2KeyPress() {
        // F2 키 입력 시
        const soldOutSoonLink = document.querySelector(
            ".price_box.sold_out_soon a"
        );
        if (soldOutSoonLink) {
            soldOutSoonLink.click();
        }
        setTimeout(() => {
            const reservBtn = document.querySelector("button.reservbtn");
            if (reservBtn) {
                reservBtn.click();
            }
        }, 300);
    }

    window.addEventListener("keydown", function (e) {
        if (e.key === "F2") {
            e.preventDefault();
            handleF2KeyPress();
        }
    });

    console.log(`예매 버튼 클릭~`);
})();