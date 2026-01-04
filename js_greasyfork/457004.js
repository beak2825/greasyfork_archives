// ==UserScript==
// @name         NPU 评教
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  翱翔教务评教,稀碎能用版本
// @author       2ndElement
// @match        https://jwxt.nwpu.edu.cn/evaluation-student-frontend/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nwpu.edu.cn
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/457004/NPU%20%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/457004/NPU%20%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function autoAssess() {
        var choices = document.getElementsByClassName("el-radio__input");
        var button = document.getElementsByClassName("el-button")[2];
        function doit() {
            for (let i = 1; i < choices.length; i += 5) {
                const element = choices[i];
                element.click();
            }
            setTimeout(() => {
                button.click();
            }, 200);
        }
        try {
            doit();
        } catch (error) {
            console.log(error);
        }
    }
    function enter() {
        document
            .getElementsByClassName(
            "el-tooltip el-link el-link--primary is-underline"
        )[0]
            .click();
        setTimeout(() => {
            autoAssess();
        }, 2000);
    }
    function back() {
        if(document.getElementsByClassName("el-message__icon el-icon-error").length !=0){
            location.replace("https://jwxt.nwpu.edu.cn/evaluation-student-frontend/#/byTask");
        }
    }
    setInterval(()=>{enter()}, 6000);
    setInterval(()=>{back()},6000);
    // Your code here...
})();