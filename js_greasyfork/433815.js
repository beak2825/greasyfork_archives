// ==UserScript==
// @name         小高教学网去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  教程网去广告
// @author       You
// @match        https://www.12580sky.com/
// @include       https://12580sky.com/
// @include       https://12580sky.com/*
// @include         https://www.12580sky.com/*
// @include       *12580sky.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433815/%E5%B0%8F%E9%AB%98%E6%95%99%E5%AD%A6%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/433815/%E5%B0%8F%E9%AB%98%E6%95%99%E5%AD%A6%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#content_right').remove();
    $(".index-top-ad").remove();
    $(".Textdiv").remove();
    $(".adtext").remove();
    $(".logo-right-decation").remove();
    $(".logo").remove();
     $(".dad").remove();
    $(".index-soft").remove();
    $(".clearfix")[0].remove();
    $(".clearfix")[1].remove();
    $(".clearfix")[2].remove();
    $(".clearfix")[3].remove();
    // Your code here...
})();
