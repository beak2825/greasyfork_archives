// ==UserScript==
// @name         IT之家PC版去除广告
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  去除IT之家PC版辣品广告链接
// @author       linmii
// @match        *://www.ithome.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/373537/IT%E4%B9%8B%E5%AE%B6PC%E7%89%88%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/373537/IT%E4%B9%8B%E5%AE%B6PC%E7%89%88%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    checkJquery();
    //addEvent();
    removeAds();
})();

function addEvent() {
    $(".page_nav .page_num a").each(function () {
        $(this).onclick = removeAds();
    })
}

function removeAds() {
    let list = $(".new-list li");
    list.each(function() {
        let a = $(this).find("a[href*='lapin.ithome.com']");
        if(a.length > 0) {
            $(this).find("span.title").remove();
        }
    });
    $(".down_app").remove();
}

function checkJquery() {
    if (!typeof jQuery) {
        var jqueryScript = document.createElement("script");
        jqueryScript.type = "text/javascript";
        jqueryScript.src = "https://code.jquery.com/jquery-3.3.1.min.js";
        document.head.append(jqueryScript);
    }
}