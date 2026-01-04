// ==UserScript==
// @license MIT
// @name         Block alerts on itdog.cn and delete all advertisements
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  en
// @author       JJ
// @match        https://www.itdog.cn/*
// @match        https://itdog.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492555/Block%20alerts%20on%20itdogcn%20and%20delete%20all%20advertisements.user.js
// @updateURL https://update.greasyfork.org/scripts/492555/Block%20alerts%20on%20itdogcn%20and%20delete%20all%20advertisements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.alert = function() {};

    let ggLinkDivs = document.querySelectorAll('div.col-12.gg_link');
    ggLinkDivs.forEach(function(div) {
        div.remove();
    });

    let gifImages = document.querySelectorAll('img[src="/upload/images/20231023230235_692.gif"]');
    gifImages.forEach(function(img) {
        img.remove();
    });

    let nofollowLinks = document.querySelectorAll('a[rel="noopener nofollow"]');
    nofollowLinks.forEach(function(link) {
        link.remove();
    });

    let ggLinkDivs2 = document.querySelectorAll('div.gg_link');
    ggLinkDivs2.forEach(function(div) {
        div.remove();
    });

    let paddingDivs = document.querySelectorAll('div[style="padding: 18px 0 0 18px;"]');
    paddingDivs.forEach(function(div) {
        div.remove();
    });

    let cardHeaderDivs = document.querySelectorAll('div.card-header.p-3');
    cardHeaderDivs.forEach(function(div) {
        div.remove();
    });
})();
