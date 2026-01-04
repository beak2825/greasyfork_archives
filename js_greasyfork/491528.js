// ==UserScript==
// @name         UCAS课程评估
// @namespace    http://tampermonkey.net/
// @version      2024-04-03
// @description  UCAS课程评估，客观题选择非常符合/非常满意，主观题填入18个#，教室选择合适，修读原因口碑好
// @author       emonq
// @match        https://jwxk.ucas.ac.cn/evaluate/evaluateCourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ucas.ac.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491528/UCAS%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BC%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/491528/UCAS%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BC%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#1125")[0].checked=true; // 6.教室的情况和舒适度（单选题）
    $("#1134")[0].checked=true; // 口碑好

    for(let i of $('input')){
        if(i.value==='5'){
            i.checked=true;
        }
    }
    for(let i of $('textarea')){
        if(i.value.length<15)
            i.value="##################";
    }
})();