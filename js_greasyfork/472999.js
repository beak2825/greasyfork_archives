// ==UserScript==
// @name         DNF404补丁网下载密码跳过
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  DNF404补丁网下载密码直接跳过
// @author       鲜榨芒果汁
// @match        *://*.dnf404.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472999/DNF404%E8%A1%A5%E4%B8%81%E7%BD%91%E4%B8%8B%E8%BD%BD%E5%AF%86%E7%A0%81%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/472999/DNF404%E8%A1%A5%E4%B8%81%E7%BD%91%E4%B8%8B%E8%BD%BD%E5%AF%86%E7%A0%81%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
$('.btn-lg').click(function(e){
e.preventDefault();
var str =$(".sidebar-card").html();
var star = str.lastIndexOf('f="');
var end = str.lastIndexOf('" ');
 window.open(str.substring(star+3,end));
});
})();