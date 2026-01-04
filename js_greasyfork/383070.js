// JavaScript source code
// ==UserScript==
// @name         AutoRateTeacher
// @namespace    http://github.com/emon100
// @version      0.1
// @description  自动评老师
// @author       Inspired by DuckSoft & Nekokir & wanghaiwei.
// @match        *://219.216.96.4/*
// @downloadURL https://update.greasyfork.org/scripts/383070/AutoRateTeacher.user.js
// @updateURL https://update.greasyfork.org/scripts/383070/AutoRateTeacher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('dblclick',function(){
        var box = document.getElementById('question-list');
        if (box) {
                [].forEach.call(document.getElementsByClassName('option-list'), e => {e.children[0].children[0].checked=true});
                setTimeout("document.getElementById('sub').click()",10);
        }
    });
})();

