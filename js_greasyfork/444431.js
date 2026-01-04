// ==UserScript==
// @name         Fix Aternos
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fully Fix Aternos
// @author       therealphantom
// @match        https://aternos.org/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aternos.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444431/Fix%20Aternos.user.js
// @updateURL https://update.greasyfork.org/scripts/444431/Fix%20Aternos.meta.js
// ==/UserScript==

// fixed file editing bug

(function() {
    $('.btn.btn-white.qXzVvuFiLtRTZzpvwflTRqFXsUjHagfkRNhUIyNiGJbTTud').click()
    setInterval(() => $('.btn.btn-white.qXzVvuFiLtRTZzpvwflTRqFXsUjHagfkRNhUIyNiGJbTTud').click(), 1000)

    const blockStrings = [
        '/reportDetection',
        '/reportUploadError',
        'ib.adnxs.com',
        'onetag-sys.com',
        'prebid.a-mo.net',
        'eb2.3lift.com'
    ];

    XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
    const myOpen = function(method, url, async, user, password) {if(blockStrings.some(substring => url.includes(substring))){return;}this.realOpen(method, url, async, user, password);}
    XMLHttpRequest.prototype.open = myOpen;

    $('.ad-replacement').remove() // ad removing
    $('.ad-label').remove();
    $('.header-link-exaroton-link').remove();
    $('.start-activity.green').remove();
    $('.help-center-articles').remove();
    $('.server-b-tutorials').remove();
    $('.social').remove();
    $('.btn-notext-mobile').find(`[onclick="openSupport()"]`).remove();
    $('.navigation').find(`[title='Резервные копии']`).remove();
    $('.sidebar').remove();
    $('.responsive-leaderboard.mobile-full-width.ad-dfp').remove();
})();