// ==UserScript==
// @name         Kill popup window
// @namespace    https://greasyfork.org/en/scripts/408032-close-all-popup-window/
// @version      0.5
// @description  Close all popup window automatic
// @author       TechComet
// @include http://*/*
// @include https://*/*
// @supportURL   https://greasyfork.org/en/scripts/408032-close-all-popup-window/feedback
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408032/Kill%20popup%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/408032/Kill%20popup%20window.meta.js
// ==/UserScript==

// replace all `no_close` to custom any string


(function() {
    'use strict';

    var element_url = document.getElementsByTagName("a"), index_url;

    for (index_url = element_url.length - 1; index_url >= 0; index_url--) {
        var cur_url = element_url[index_url]
        var prefix = function (url) { return cur_url.href.indexOf(url) != -1 };

        cur_url.href = cur_url.href + "#no_close"

    }



    var except = [
        'google.com', 'facebook.com' //example except WebSites
    ]

    var hostname = window.location.hostname.replace("www.", "")

    if (window.location.href.indexOf("#no_close") == -1) {
    if (except.indexOf(hostname) == -1) {
        window.close();
    }
    }
    
})();