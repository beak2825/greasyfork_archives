// ==UserScript==
// @name         91porn自动修改url
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  91porn自动修改url，便于使用
// @author       jf
// @match        https://91porny.com/video/viewhd/*
// @match        https://jiuse911.com/video/viewhd/*
// @icon         https://www.google.com/s2/favicons?domain=91porny.com
// @home-url     https://greasyfork.org/zh-CN/scripts/424158-91porn%E8%87%AA%E5%8A%A8%E4%BF%AE%E6%94%B9url
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424158/91porn%E8%87%AA%E5%8A%A8%E4%BF%AE%E6%94%B9url.user.js
// @updateURL https://update.greasyfork.org/scripts/424158/91porn%E8%87%AA%E5%8A%A8%E4%BF%AE%E6%94%B9url.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var url = window.location.href;
    //var res = /\/\/(.+?\..*?)(\/|\?)/.exec(url);
    //var site = res[1];
    //console.log(url, res, site);
    if(url.search("viewhd") != -1) {
        var replaceUrl = url.replace("viewhd", "view");
        console.log(replaceUrl)
        window.location.href = replaceUrl;
    }
})();