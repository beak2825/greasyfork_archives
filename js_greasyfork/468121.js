// ==UserScript==
// @name        中国大学MOOC课后作业自动互评
// @match       https://www.icourse163.org/learn/*
// @namespace   果子修改删去确认弹框，改大点击按钮，慕课自动互评满分，填写评语：作业完成的好，决定给你满分。
// @grant       none
// @version     1.3.2
// @author      zhuufn
// @description 2023/06/07 19:06:00
// @license gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/468121/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%E8%AF%BE%E5%90%8E%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/468121/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%E8%AF%BE%E5%90%8E%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.pingfen = function() {
        var a = document.getElementsByClassName('s');
        for (let i = 0; i < a.length; ++i) {
            a[i].children[a[i].children.length - 1].children[0].checked = true;
        }
        var b = document.getElementsByTagName("textarea");
        for (let i = 0; i < b.length; ++i) {
            b[i].value = "作业完成的好，决定给你满分。";
        }
        // 滚动到页面底部
        window.scrollTo(0, document.body.scrollHeight);
    };

    function addAutoPingfenButton() {
        let tmp = document.createElement("a");
        tmp.innerHTML = "点此自动互评";
        tmp.onclick = function() {
            window.pingfen();
        };
        tmp.style = "font-size: 120px;";
        document.getElementById("j-courseTabList").appendChild(tmp);
    }

    function runWhenReady(readySelector, callback) {
        var numAttempts = 0;
        var tryNow = function() {
            var elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }

    runWhenReady("#j-courseTabList", addAutoPingfenButton);
})();




