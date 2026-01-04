// ==UserScript==
// @name         SFU Lib Redirect
// @namespace    undefined
// @version      0.1
// @description  Redirect with SFU library access
// @author       yibum
// @match        https://dl.acm.org/*
// @match        https://ieeexplore.ieee.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38676/SFU%20Lib%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/38676/SFU%20Lib%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url_parsed = new URL(location.href);
    if (url_parsed.host === "dl.acm.org") {
        url_parsed.host = "dl-acm-org.proxy.lib.sfu.ca";
    }
    else {
        url_parsed.host = url_parsed.host + ".proxy.lib.sfu.ca";
    }
    var url_proxy = url_parsed.protocol + "//" + url_parsed.host + url_parsed.pathname + url_parsed.search;
    //console.log(url_proxy);
    // works like as simulating HTTP request
    //window.location.replace(url_proxy);
    // works like as clicking the link;
    window.location.href = url_proxy;
})();