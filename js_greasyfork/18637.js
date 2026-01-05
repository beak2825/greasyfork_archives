// ==UserScript==
// @name         Compucalitv Remove Links Counter
// @namespace    http://tampermonkey.net/
// @version      1.9.0
// @description  Elimina el contador para ver enlaces en CompucaliTV!
// @author       DarioGabriel
// @match        https://*/*
// @match        *compucalitv.com*
// @include      *compucalitv.com*
// @include      *compucalitv.pro*
// @include      *compul.in*
// @include      *cwctv.me*
// @include      *ctvtg.me*
// @include      *ctvout.buzz*
// @include      *ctvurl.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18637/Compucalitv%20Remove%20Links%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/18637/Compucalitv%20Remove%20Links%20Counter.meta.js
// ==/UserScript==

var currentURL = window.location.href.toString();

if (currentURL.match(/.+:\/\/.+\/url\/#/) !== null) {
    var encodedURL = currentURL.replace(/.+:\/\/.+\/url\/#/, '');
    console.log(encodedURL);
    var decodedURL = atob(atob(atob(encodedURL))); //3x base64 decode
    decodedURL = decodedURL.replace(/.+url=/,'')
    window.open(decodeURIComponent(decodedURL),'_self','noopener,noreferrer,resizable')
}
else {
    (function() {
        'use strict';

        if ((document.URL.indexOf("ctvout") >= 0) || (document.URL.indexOf("ctvurl") >= 0) || (document.URL.indexOf("ctv") >= 0))
        {
            location.href = global.fastLink+atob(getAfterSharp())
        }
        else
        {
            var CompulClick = document.getElementsByClassName("btn btn-lg btn-success")[0];
            if (CompulClick !== undefined) CompulClick.click();

            var LockerDiv = document.getElementsByClassName("onp-sl-content")[0];
            if (LockerDiv !== undefined)
            {
                LockerDiv.setAttribute("data-lock-id", "");
                LockerDiv.style.display = "inline";
            }

            CompulClick = document.getElementsByClassName("linkhidder")[0];
            if (CompulClick !== undefined) CompulClick.click();
            try
            {
                if (targetURL)
                {
                    window.location.replace(targetURL);
                }
            }
            catch(e)
            {
            }
            try
            {
                if (link)
                {
                    window.location.replace(link);
                }
            }
            catch(e)
            {
            }
        }
    })();
}