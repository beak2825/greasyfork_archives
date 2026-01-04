// ==UserScript==
// @name         Transfermarkt Redirect (all TLDs to .com, www and non-www)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Redirect all transfermarkt.* domains (except .com) to transfermarkt.com as early as possible
// @match        https://transfermarkt.*/*
// @match        https://www.transfermarkt.*/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540734/Transfermarkt%20Redirect%20%28all%20TLDs%20to%20com%2C%20www%20and%20non-www%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540734/Transfermarkt%20Redirect%20%28all%20TLDs%20to%20com%2C%20www%20and%20non-www%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // List of supported TLDs except .com
    const supportedTlds = [
        "de","ch","com.tr","fr","pl","at","com.ar","com.br","co","es","gr","co.in","jp","mx","pe","pt",
        "co.uk","be","co.id","it","co.kr","nl","ro","co.za","us","world"
    ];
    const host = location.hostname.replace(/^www\./, "");
    if (host === "transfermarkt.com") return;

    // Build regex for all supported TLDs
    const tldPattern = supportedTlds.map(tld => tld.replace('.', '\\.')).join('|');
    const regex = new RegExp(`^https://(www\\.)?transfermarkt\\.(${tldPattern})/`);

    if (regex.test(location.href)) {
        const newUrl = location.href.replace(regex, "https://www.transfermarkt.com/");
        window.location.replace(newUrl);
    }
})();