// JavaScript source code
// ==UserScript==
// @name         AutoRatedbdxaao
// @namespace    http://github.com
// @version      0.3
// @description  dbdx自动老师评分
// @author       Caijibai
// @match        *://219.216.96.4/eams/quality/*
// @downloadURL https://update.greasyfork.org/scripts/383106/AutoRatedbdxaao.user.js
// @updateURL https://update.greasyfork.org/scripts/383106/AutoRatedbdxaao.meta.js
// ==/UserScript==

(() => {
    "use strict";
        var box = document.getElementById('app-main');
        if (box) {
            box.addEventListener('dblclick', function(){
                [].forEach.call(document.getElementsByClassName('option-list'), e => {e.children[0].children[0].checked=true});
            });
        }
})();