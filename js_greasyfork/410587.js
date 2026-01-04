// ==UserScript==
// @name         eBay Seller Location
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Displays the current and registration location of eBay sellers on product listings.
// @author       You
// @match        https://www.ebay.com.au/itm/*
// @match        https://www.ebay.com/itm/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/410587/eBay%20Seller%20Location.user.js
// @updateURL https://update.greasyfork.org/scripts/410587/eBay%20Seller%20Location.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function copyNodeStyle(sourceNode, targetNode) {
        const computedStyle = window.getComputedStyle(sourceNode);
        Array.from(computedStyle).forEach(key => targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)))
    }

    var usr = document.querySelector('a[href*="/usr/"]');
    if (usr) {
        var dat = "https://" + window.location.hostname + "/itm/sellerInfoV2?sid=" + usr.innerText + "&itemId=" + document.querySelector("link[rel='canonical']").href.split('/').pop();
        GM_xmlhttpRequest({
            method: 'GET',
            url: dat,
            headers: {
                 'Accept': 'application/json, text/javascript, */*; q=0.01',
                 'X-Requested-With': 'XMLHttpRequest',
                 'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Mobile Safari/537.36'
            },
            onload: function(response) {
                var data = JSON.parse(JSON.parse(response.responseText));
                var si = document.querySelector(".ux-seller-section__content");
                if (si) {
                    var loc = document.createElement("li");
                    loc.className = "ux-seller-section__item";
                    loc.innerText = 'Registration ' + data.registrationSite.replace("HongKong", "Hong Kong");
                    si.insertAdjacentElement('beforeend', loc);
                }
            }
        });
        fetch(usr.href).then(function(e) {
            return e.text();
        }).then(function(e) {
            var doc = new DOMParser().parseFromString(e, "text/html");
            var si = document.querySelector(".ux-seller-section__content");
            if (si) {
                var loc = document.createElement("li");
                loc.className = "ux-seller-section__item";
                loc.innerText = 'Seller Location: ' + doc.querySelector('.str-about-description__seller-info span').innerText;
                si.insertAdjacentElement('beforeend', loc);
            }
       });
    }
})();