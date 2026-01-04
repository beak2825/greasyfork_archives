// ==UserScript==
// @name         GitLab Modify  Project Desc Length
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the worldGitLab Modify  Project Desc Length!
// @author       Sean
// @match        http://192.168.0.200/fe3project/*
// @icon         http://192.168.0.200/assets/favicon-7901bd695fb93edb07975966062049829afb56cf11511236e61bcf425070e36e.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466842/GitLab%20Modify%20%20Project%20Desc%20Length.user.js
// @updateURL https://update.greasyfork.org/scripts/466842/GitLab%20Modify%20%20Project%20Desc%20Length.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tryTimes = 6;
    let changed = false;

    // 增加项目描述的输入长度
    function modifyTextareaLen() {
        if(tryTimes > 0 && !changed) {
            setTimeout(() => {
                let textarea = document.getElementById('project_description');
                tryTimes--;
                if(textarea) {
                    textarea.setAttribute("maxlength", "1000");
                    changed = true;
                } else {
                    modifyTextareaLen();
                }
            }, 1000);
        }
    }

    window.onload = function() {
        modifyTextareaLen();
    }
})();