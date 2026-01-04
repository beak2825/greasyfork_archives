// ==UserScript==
// @name         Ad Free Salt Lake Tribune
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove reading limits from sltrib.com
// @author       You
// @match        https://www.sltrib.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401648/Ad%20Free%20Salt%20Lake%20Tribune.user.js
// @updateURL https://update.greasyfork.org/scripts/401648/Ad%20Free%20Salt%20Lake%20Tribune.meta.js
// ==/UserScript==

const removeAd = function() {
    document.querySelector('.tp-modal-open').style.cssText = "overflow: auto !important";
    document.querySelector(".tp-backdrop").remove();
    document.querySelector(".tp-modal").remove();
}

waitForKeyElements (".tp-modal-open", removeAd);