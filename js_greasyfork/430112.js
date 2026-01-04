// ==UserScript==
// @name         Google Image Link Direct
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  Click Image View New Location, directly to the images
// @author       Benyamin Limanto
// @run-at       document-end
// @include      http*://*.google.tld/search*tbm=isch*
// @include      http*://*.google.tld/imgres*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430112/Google%20Image%20Link%20Direct.user.js
// @updateURL https://update.greasyfork.org/scripts/430112/Google%20Image%20Link%20Direct.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.addEventListener('click', e => {
        setTimeout(function(){
            var div = document.querySelectorAll('a[target=_blank] > img');
            for (var i = 0; i < div.length; i++) {
                div[i].parentNode.href = div[i].src;
                div[i].onload = function(e) {
                    e.target.parentNode.href = e.target.src;
                };
            }
        }, 500);
    });
})();