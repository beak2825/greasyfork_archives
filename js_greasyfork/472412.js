// ==UserScript==
// @name         Economist Unblocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove economist paywall
// @author       chengxuncc
// @match        *://*.economist.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472412/Economist%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/472412/Economist%20Unblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the paywall div
    function removePaywall() {
        let paywalls = document.querySelectorAll('div.paywall');
        paywalls.forEach(paywall => {
            paywall.remove();
        });
    }

    // Execute the function on page load
    removePaywall();


    // Set the overflow property to auto for both body and html elements
    document.documentElement.style.overflow = "auto";

    // Query full text of article
    GM_xmlhttpRequest({
        method: "GET",
        url: window.location.href,
        headers: {'referer':'https://www.economist.com/', 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'},
        onload: function (r) {
            if (r.readyState == 4) {
                var data = r.responseText
                var substr = data.match(/\<main((.|\n)*)main\>/g);
                if (substr != null && substr.length > 0) {
                    $("main").replaceWith(substr[0]);
                }
            }
        },
        onerror: function (e) {
            console.error(e);
        }
    });
})();