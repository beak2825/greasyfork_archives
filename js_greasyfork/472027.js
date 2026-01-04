// ==UserScript==
// @name         南+多域名跳转与替换
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect and replace domain links of South-Plus
// @author       SakuraPY
// @match        *://*.east-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://north-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://blue-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://imoutolove.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472027/%E5%8D%97%2B%E5%A4%9A%E5%9F%9F%E5%90%8D%E8%B7%B3%E8%BD%AC%E4%B8%8E%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/472027/%E5%8D%97%2B%E5%A4%9A%E5%9F%9F%E5%90%8D%E8%B7%B3%E8%BD%AC%E4%B8%8E%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const domains = [
        "east-plus.net",
        "south-plus.net",
        "south-plus.org",
        "white-plus.net",
        "north-plus.net",
        "level-plus.net",
        "soul-plus.net",
        "snow-plus.net",
        "spring-plus.net",
        "summer-plus.net",
        "blue-plus.net",
        "imoutolove.me"
    ];
    // Set your selected domain here
    const selectedDomain = 'blue-plus.net';

    // Redirect if the current host is not the selected domain or its subdomain
    //const now_domain = window.location.host;
    //if (!now_domain.includes(selectedDomain)) {
    //    window.location.host = selectedDomain;
    //}
    if (window.location.host !== selectedDomain) {
        window.location.host = selectedDomain;
    }
    // Replace <a href=></a> that targets the domains(or the subdomain of the domains) above(and its text) to the selected domain
    // if it is inside <a>, like the img <a href="u.php?action-show-uid-1359305.html"><img src="https://pic.imgdb.cn/item/62a500b209475431296f9991.png"></a>
    // dont replace it
    const links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const href = link.href;
        const text = link.text;
        if (href) {
            for (let j = 0; j < domains.length; j++) {
                if (href.includes(domains[j])) {
                    // if not inside <a>, replace it
                    if (link.childElementCount === 0) {
                        //replace url
                        //link.href = href.replace(domains[j], selectedDomain);
                        //replace url(all host)
                        link.href = href.replace(href.split('/')[2], selectedDomain);
                        //replace text
                        //link.text = text.replace(domains[j], selectedDomain);
                        //replace text(all host)
                        link.text = text.replace(href.split('/')[2], selectedDomain);
                    }
                }
            }
        }
    }
})();
