// ==UserScript==
// @name         Luogu User Content Block Remover
// @namespace    http://tampermonkey.net/
// @version      2024-01-20
// @match        https://www.luogu.com.cn/user/*
// @grant        none
// @author       Rainbow_qwq
// @description  This removes the content blocker on Luogu user homepage.
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512663/Luogu%20User%20Content%20Block%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/512663/Luogu%20User%20Content%20Block%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function wait(calb, cond) {
        if (cond()) {
            return calb();
        } else {
            setTimeout(function() {
                wait(calb, cond);
            }, 0);
        }
    }
    wait(function() {
        let t = document.querySelector(".introduction.marked");
        if (t.style.display === "none") {
            t.style.display = "block";
            for (let i = 0; i < t.parentElement.children.length; i++) {
                if (t.parentElement.children[i].innerText === '系统维护，该内容暂不可见。') {
                    t.parentElement.children[i].remove();
                }
            }
        }
    }, function() {
        return document.querySelector(".introduction.marked") !== null;
    });
})();