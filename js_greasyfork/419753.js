// ==UserScript==
// @name         Github Action Workflow 自动全部启用
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  自动点击全部 Enable workflow，免去手动一个个点
// @author       You
// @match        https://github.com/*/actions*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419753/Github%20Action%20Workflow%20%E8%87%AA%E5%8A%A8%E5%85%A8%E9%83%A8%E5%90%AF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/419753/Github%20Action%20Workflow%20%E8%87%AA%E5%8A%A8%E5%85%A8%E9%83%A8%E5%90%AF%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {

        if (enable()) {
            let li = document.querySelector("#repo-content-pjax-container > div > div > div.hx_actions-sidebar.col-12.col-lg-3.pr-lg-4.pr-xl-5 > remote-pagination > ul").querySelectorAll("li");

            for (let i = 1; i < li.length; i++) {
                let svg = li[i].querySelector(".octicon,.octicon-stop,mr-2,.color-text-warning");
                if (svg.className.animVal.indexOf("color-text-warning") != -1) {
                    svg.parentNode.click();
                    break;
                }
            }
        }
        if (enable()) {
            reload();
        }
    }

    function enable() {
        let isContinue = true;
        let enableButton = document.querySelectorAll("button");
        if (enableButton != null) {
            for (let i = 0; i < enableButton.length; i++) {
                let button = enableButton[i];
                if (macth(button.innerHTML, 'Enable workflow')) {
                    button.click();
                    //reload();
                    isContinue = false;
                }
            }
        }
        return isContinue;
    }

    function macth(str, macthStr) {
        return str.indexOf(macthStr) != -1;
    }

    function reload() {
        window.location.reload();
    }
})();