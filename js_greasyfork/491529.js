// ==UserScript==
// @name         UCAS教师评估
// @namespace    http://tampermonkey.net/
// @version      2024-04-03
// @description  UCAS教师评估，客观题全选非常符合/非常满意，主观题填18个#
// @author       emonq
// @match        https://jwxk.ucas.ac.cn/evaluate/evaluateTeacher/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ucas.ac.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491529/UCAS%E6%95%99%E5%B8%88%E8%AF%84%E4%BC%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/491529/UCAS%E6%95%99%E5%B8%88%E8%AF%84%E4%BC%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

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