// ==UserScript==
// @name         Amazon - Open Channel Page from Offer Page
// @description  Amazon - Open Channel Page from Offer Page.
// @version      0.1
// @author       to
// @namespace    https://github.com/to
// @license      MIT
//
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
//
// @match        https://www.amazon.co.jp/gp/video/offers/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @downloadURL https://update.greasyfork.org/scripts/444176/Amazon%20-%20Open%20Channel%20Page%20from%20Offer%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/444176/Amazon%20-%20Open%20Channel%20Page%20from%20Offer%20Page.meta.js
// ==/UserScript==

GM_registerMenuCommand('Open', () => {
	let match = location.href.match(/benefitId=(.+?)(&|$)/);
    if(match)
        GM_openInTab('https://www.amazon.co.jp/gp/video/storefront/?contentType=subscription&contentId=' + match[1]);
});