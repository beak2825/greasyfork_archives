// ==UserScript==
// @name         网页简化
// @namespace    github.com/zddava/gm_simplify
// @version      0.3
// @description  simplify some web pages
// @author       archer
// @match        *://*.cnblogs.com/*/*.html
// @icon         https://avatars.githubusercontent.com/u/1776283?v=4
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/471812/%E7%BD%91%E9%A1%B5%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/471812/%E7%BD%91%E9%A1%B5%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let simplified = false;

    function simplify_cnblogs() {
        if (simplified) {
            return;
        }

        // 处理#home下除了header和main的其他div
        let homeBlocks = document.querySelectorAll("#home > div");
        if (homeBlocks) {
            for (let i = 0; i < homeBlocks.length; i++) {
                if (homeBlocks[i].id && ('header' == homeBlocks[i].id || 'main' == homeBlocks[i].id)) {
                    continue;
                }

                if (homeBlocks[i].className && homeBlocks[i].className.indexOf("clear") != -1) {
                    homeBlocks[i].style.width = "0";
                    continue;
                }

                homeBlocks[i].style.display = 'none';
            }
        }

        // 隐藏leftcontent
        let leftContent = document.querySelector("#leftcontent");
        if (leftContent) {
            leftContent.style.display = 'none';
        }

        // 把#main的grid方式布局改成flex
        let mainBlock = document.querySelector("#main");
        if (mainBlock) {
            if (mainBlock.style.display == '') {
                mainBlock.style.display = 'flex';
            }
        }

        // 调整#main/#centercontent的margin，padding
        if (!mainBlock) {
            mainBlock = document.querySelector("#centercontent");
        }

        if (mainBlock) {
            let marginLeft = parseInt(getComputedStyle(mainBlock).getPropertyValue("margin-left"));
            if (!isNaN(marginLeft) && marginLeft > 20) {
                mainBlock.style.marginLeft = '20px';
            }

            let marginRight = parseInt(getComputedStyle(mainBlock).getPropertyValue("margin-right"));
            if (!isNaN(marginRight) && marginRight > 20) {
                mainBlock.style.marginRight = '20px';
            }

            let paddingLeft = parseInt(getComputedStyle(mainBlock).getPropertyValue("padding-left"));
            if (!isNaN(paddingLeft) && paddingLeft > 20) {
                mainBlock.style.paddingLeft = '20px';
            }

            let paddingRight = parseInt(getComputedStyle(mainBlock).getPropertyValue("padding-right"));
            if (!isNaN(paddingRight) && paddingRight > 20) {
                mainBlock.style.paddingRight = '20px';
            }
        }

        // 处理文章主体
        let mainContent;

        let mainBlocks = document.querySelectorAll("#main > div");
        if (!mainBlocks) {
            mainBlocks = document.querySelectorAll("#centercontent > div");
        }

        if (!mainBlocks) {
            return;
        }

        for (let i = 0; i < mainBlocks.length; i++) {
            if (mainBlocks[i].id && (mainBlocks[i].id != "mainContent" && mainBlocks[i].id != "post_detail")) {
                mainBlocks[i].style.display = 'none';
                continue;
            }

            if (mainBlocks[i].className && mainBlocks[i].className.indexOf("clear") != -1) {
                mainBlocks[i].style.width = "0";
                continue;
            }

            mainContent = mainBlocks[i];
        }

        if (!mainContent) {
            return;
        }

        document.querySelector("#catalog") ? mainContent.style.width = '75vw' : mainContent.style.width = '95%';

        let marginLeft = parseInt(getComputedStyle(mainContent).getPropertyValue("margin-left"));
        if (!isNaN(marginLeft) && marginLeft > 20) {
            let top = mainContent.style.marginTop;
            mainContent.style.margin = '0 auto';
            mainContent.style.marginTop = top;
        }

        let toolbar = document.querySelector(".custom-toolbar");
        if (toolbar) {
            toolbar.style.display = 'none';
        }

        simplified = true;
    }

    setTimeout(simplify_cnblogs, 2000);

    window.onload = function () {
        simplify_cnblogs();
    };

})();