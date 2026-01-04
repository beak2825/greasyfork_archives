// ==UserScript==
// @name         skip mock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  个人容器环境使用
// @license MIT
// @author       You
// @match        http://localhost:18080/*
// @match        http://localhost:8080/*
// @match        https://alb.atuotest.sto.test.shopee.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465831/skip%20mock.user.js
// @updateURL https://update.greasyfork.org/scripts/465831/skip%20mock.meta.js
// ==/UserScript==

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}

(function() {
    'use strict';
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onUrlChange();
        }
    }).observe(document, {subtree: true, childList: true});

    function onUrlChange() {
        if (! /\blcEnv=test\b/.test (location.search) ) {
            var oldUrlPath  = window.location.pathname;
            if ( oldUrlPath == "/dns/management/release/deployment"  || oldUrlPath == "/sgw/waf/ipset") {
                var url = document.location.toString();
                var updateUrl = updateQueryStringParameter(url, 'lcEnv', 'test');
                console.log(updateUrl);
                console.log(url != updateUrl);
                if (url != updateUrl) {
                    document.location = updateUrl;
                }
            }
        }
    }


})();

