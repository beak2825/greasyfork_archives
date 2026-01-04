// ==UserScript==
// @name         Github Workflow 运行日志快速查看
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  免去一步一步点击查看运行日志
// @author       You
// @match        https://github.com/*/actions/runs/*
// @match        https://github.com/*/runs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420124/Github%20Workflow%20%E8%BF%90%E8%A1%8C%E6%97%A5%E5%BF%97%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420124/Github%20Workflow%20%E8%BF%90%E8%A1%8C%E6%97%A5%E5%BF%97%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var url = window.location.href;
    if (url.indexOf('actions/runs') != -1) {
        document.querySelector(".filter-list > li:nth-child(3) > a").click();
    } else if (url.indexOf('check_suite_focus') != -1) {
        var span = document.querySelectorAll("span");
        for (var i = 0; i < span.length; i++) {
            if (span[i].innerText.indexOf('Cache node_modules') != -1) {
                var run = span[i].closest('details').nextElementSibling.firstElementChild;
                run.click();
                setTimeout(function () {
                    run.scrollIntoView();
                }, 1500);
                break;
            }
        }
    }

})();