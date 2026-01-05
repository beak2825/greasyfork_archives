// ==UserScript==
// @name         Amazon Prime Now Checker
// @description  Adds a button to open Amazon items in Amazon Prime Now, when available.
// @namespace    Arithmomaniac_Tampermonkey
// @version      0.1
// @author       Arithmomaniac
// @include      /^https?://(www|smile)\.amazon\.com/.*/[A-Z\d]{10}//
// @run-at       document-ready
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/26237/Amazon%20Prime%20Now%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/26237/Amazon%20Prime%20Now%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var primeIcon = document.querySelector("#priceBadging_feature_div .a-icon-prime");
    if (primeIcon) //available on prime
    {
        var span = document.createElement("span");
        span.className = "prime-now-link";
        span.innerHtml = "<i>Checking Prime Now...</i>";
        primeIcon.parentElement.appendChild(span);

        var primeUrl = "https://primenow.amazon.com" + window.location.pathname;
        GM_xmlhttpRequest({
            url: primeUrl,
            method: "GET",
            onload: function(response) {
                //if item exists and is available in PrimeNow
                if (response.status === 200 && response.responseText.indexOf('<span class="a-color-price a-text-bold">Currently Unavailable.</span>') === -1)
                {
                    
                    span.innerHTML = `<a target="_blank" href="${primeUrl}">` +
                        `<img height="16" src="https://images-na.ssl-images-amazon.com/images/I/31uhU1SAhgL.png"></img>` +
                        `</a>`;
                }
                else
                {
                    span.remove();
                }
            }
    })
    }
})();