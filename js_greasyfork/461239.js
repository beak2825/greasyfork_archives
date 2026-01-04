// ==UserScript==
// @name         setLeetcodeFontFamily
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  set leetcode fontFamily
// @author       You
// @match        https://leetcode.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461239/setLeetcodeFontFamily.user.js
// @updateURL https://update.greasyfork.org/scripts/461239/setLeetcodeFontFamily.meta.js
// ==/UserScript==

(function() {
    'use strict';



    //设置国服周赛leetcode字体
    let coder = document.querySelector(
        "#submission-form-app > div > div > div > div > div.ReactCodeMirror > div > div.CodeMirror-scroll"
    );

    coder.style.fontFamily = "Cascadia Code";


})();