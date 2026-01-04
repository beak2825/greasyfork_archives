// ==UserScript==
// @name         自动切换到国内镜像，比如 huggingface
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  google搜索页面修改，增加便条
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @match        https://huggingface.co/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/523515/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%88%B0%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F%EF%BC%8C%E6%AF%94%E5%A6%82%20huggingface.user.js
// @updateURL https://update.greasyfork.org/scripts/523515/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%88%B0%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F%EF%BC%8C%E6%AF%94%E5%A6%82%20huggingface.meta.js
// ==/UserScript==


const dom = {};
dom.query = jQuery.noConflict(true);
dom.query(document).ready(function ($) {
    'use strict';

    const {hostname, pathname} = location;


    function add_search_note(){

        var head=document.querySelector("body > div.flex.min-h-dvh.flex-col > div:nth-child(2) > header");
        $(head).append("<div id='content'><center><a href='https://hf-mirror.com"+pathname+"' target=_blank><font color=red>国内镜像：hf-mirror.com</font></a></center></div>");

    }


    add_search_note();

});