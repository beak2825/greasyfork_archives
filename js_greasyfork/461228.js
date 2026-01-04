// ==UserScript==
// @name         格式化ithome.com网站，浏览效率提高十倍
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to Make ITHome.com to Simple.
// @author       oixqiu
// @match        https://www.ithome.com/
// @grant        none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/461228/%E6%A0%BC%E5%BC%8F%E5%8C%96ithomecom%E7%BD%91%E7%AB%99%EF%BC%8C%E6%B5%8F%E8%A7%88%E6%95%88%E7%8E%87%E6%8F%90%E9%AB%98%E5%8D%81%E5%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/461228/%E6%A0%BC%E5%BC%8F%E5%8C%96ithomecom%E7%BD%91%E7%AB%99%EF%BC%8C%E6%B5%8F%E8%A7%88%E6%95%88%E7%8E%87%E6%8F%90%E9%AB%98%E5%8D%81%E5%80%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.fl').remove();
    $('.fr').css("width","100%");
    $('.nl').css("width","45%");
    $('a').css("width","80%");
    $('#side_func').remove();
    $('#top').remove();
    $('#nav').remove();
    $('#tt').remove();
    $("#t-b").css("display","block")
    $('.nl').css("width","100%");   // $('#n').css("width","100%");
    $(".t-b").addClass("sel");

})();