// ==UserScript==
// @icon         http://tjjxjy.chinahrt.com/favicon.ico
// @name         天津继续教育
// @namespace    tjucg
// @version      1.2
// @match        https://web.chinahrt.com/course/*
// @description  天津专业技术人员继续教育!
// @author       cnmice
// @grant        none
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min.js
/* globals jQuery, $, waitForKeyElements */
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/429695/%E5%A4%A9%E6%B4%A5%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/429695/%E5%A4%A9%E6%B4%A5%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

function start(){
    var e = $("#iframe");
    var s = e.prop('src').replace('ifDrag=0','ifDrag=1');
    e.prop({'src':s});
}

setTimeout(start,2000)
