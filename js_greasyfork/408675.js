// ==UserScript==
// @name         Closes "Some known" Pop-Up Sites/Ad Redirects
// @version      0.1
// @description  tries to close certain websites to prevent pop-ups/redirects.
// @author       Cepryx

// @match        *://*.lp.powerapp.download/*
// @match        *://*.fiefionfortes.casa/*
// @match        *://*.inservinea.com/*
// @match        *://*.protection.byguardio.com/*
// @match        *://*.tortsv.gq/*
// @match        *://*.takefr.cf/*
// @match        *://*.toomiplay.com/*
// @match        *://*.deej.almeusciu.site/*
// @match        *://*.upgradecircle.findgreatsourceforupgrade.info/*
// @match        *://*.afew.zoyufo.pw/*
// @match        *://*.upgradebestmaintenancetheclicks.icu/*
// @match        *://*.s3.amazonaws.com/*
// @match        *://*.updatemostrenewedapplication.best/*
// @match        *://*.get.anyconvertersearch.com/*
// @match        *://*.digitaltrends.com/*
// @match        *://*.wildbearads.com/*
// @match        *://*.wildbearads.bid/*











/*    ADD WEBSITES/AD SITES HERE ^^^ ON THESE BLANK LINES ^^^   */

// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        window.close
// @namespace https://greasyfork.org/users/675767
// @downloadURL https://update.greasyfork.org/scripts/408675/Closes%20%22Some%20known%22%20Pop-Up%20SitesAd%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/408675/Closes%20%22Some%20known%22%20Pop-Up%20SitesAd%20Redirects.meta.js
// ==/UserScript==



/*    TO ADD WEBSITES/AD SITES TO THIS LIST ADD THE FOLLOWING CODE TO THE LIST OF "@match"'s ABOVE     */
/*    // @match        *://*.POP-UP-URL-HERE.com/*     */

(function() {
    'use strict';
    window.close()
})();

