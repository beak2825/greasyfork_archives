// ==UserScript==
// @name         Atcoder Easy Accordion
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Atcoderのアコーディオンメニューを、マウスのホバーで開けるようにします
// @author       Rac
// @license      MIT
// @match        https://atcoder.jp/*
// @exclude      /^https://atcoder\.jp/[^#?]*/json/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532617/Atcoder%20Easy%20Accordion.user.js
// @updateURL https://update.greasyfork.org/scripts/532617/Atcoder%20Easy%20Accordion.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.getElementsByClassName("header-mypage_btn").length != 0) {
        window.scrollTo=()=>{};
    }

    document.querySelectorAll(".nav > li:not(.pull-right)").forEach((element) => {
        element.addEventListener("mouseenter", () => {
            setTimeout(() => {
                element.classList.add("open");
            }, 10);
        });
        element.addEventListener("mouseleave", () => {
            element.classList.remove("open");
        });
    });
    {
        const element = document.getElementsByClassName("header-mypage_btn")[0];
        const element_ac = document.getElementsByClassName("header-mypage_detail")[0];
        if(element && element_ac) {
            let flag1 = false;
            let flag2 = false;
            element.addEventListener("mouseenter", () => {
                flag2 = false;
                if(!element.classList.contains("active")) {
                    setTimeout(() => {
                        if(!element.classList.contains("active")) element.click();
                    }, 10);
                }
            });
            element.addEventListener("mouseleave", () => {
                flag1 = true;
                setTimeout(() => {
                    if(flag1 && element.classList.contains("active")) element.click();
                }, 10);
            });
            element_ac.addEventListener("mouseenter", () => {
                flag1 = false;
                if(!element.classList.contains("active")) element.click();
            });
            element_ac.addEventListener("mouseleave", () => {
                flag2 = true;
                setTimeout(() => {
                    if(flag2 && element.classList.contains("active")) element.click();
                }, 10);
            });
        }
    }

    document.querySelectorAll("#task-statement details").forEach((element) => {
        element.open = true;
    });
})();