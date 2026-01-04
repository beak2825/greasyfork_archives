// ==UserScript==
// @name         eBay FR - Corrections du site
// @namespace    eBay_FR_C
// @version      2.0
// @description  Corrige le site eBay FR
// @author       Micdu70
// @match        https://www.ebay.fr/*
// @match        https://*.ebay.fr/*
// @match        http://www.ebay.fr/*
// @match        http://*.ebay.fr/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/413224/eBay%20FR%20-%20Corrections%20du%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/413224/eBay%20FR%20-%20Corrections%20du%20site.meta.js
// ==/UserScript==

function Corrections() {
    var url = window.location.href;
    var reg = /^https?:\/\/.*ebay\.fr\/sh\/lst\/active\/?$/;
    var newUrl;
    if (url.match(reg) !== null) {
        newUrl = 'https://www.ebay.fr/mys/active/rf/container_sort=TIME_LEFT_ENDING_SOONEST&container_filter=ALL&container_limit=25';
        window.location.replace(newUrl);
    } else {
        var checkExist1 = setInterval(function() {
            if (document.getElementById('gh-p-2')) {
                var element = document.getElementById('gh-p-2');
                var message = element.getElementsByTagName('a')[0];
                message.setAttribute('href', 'https://bulksell.ebay.fr/ws/eBayISAPI.dll?SingleList');
                clearInterval(checkExist1);
            }
        }, 100);
        var checkExist2 = setInterval(function() {
            url = window.location.href;
            reg = /^https?:\/\/.*ebay\.fr\/mys\/active\/?$/;
            if (url.match(reg) !== null) {
                newUrl = 'https://www.ebay.fr/mys/active/rf/container_sort=TIME_LEFT_ENDING_SOONEST&container_filter=ALL&container_limit=25';
                window.location.replace(newUrl);
                clearInterval(checkExist2);
            }
        }, 100);
    }
}

Corrections();