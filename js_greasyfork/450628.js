// @license MIT
// ==UserScript==
// @name         208css
// @namespace    208css
// @version      0.2
// @description  替换208xs的css
// @author       Aztand
// @match        https://www.280xs.com/dingdian/*
// @downloadURL https://update.greasyfork.org/scripts/450628/208css.user.js
// @updateURL https://update.greasyfork.org/scripts/450628/208css.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("book_text").style.fontFamily="雅黑";
    document.getElementById("book_text").style.fontSize="26px";
    document.getElementById("book_text").style.width="1350px";
    document.getElementById("mains").style.width="1500px";
    document.getElementById("yuntuijian").hidden="true";
    document.getElementsByClassName("book_content_text")[0].style.width="1460px";
    // Your code here...
})();