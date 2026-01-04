// ==UserScript==
// @name         Download Principal ticker Symbol
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      MIT
// @description  Extract ticker symbols from principal 401k investment performance page, and download CSV with details
// @author       John Morgan
// @match        https://*.principal.com/RetirementServiceCenter/memberview?page_name=investmentperformance*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=principal.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445927/Download%20Principal%20ticker%20Symbol.user.js
// @updateURL https://update.greasyfork.org/scripts/445927/Download%20Principal%20ticker%20Symbol.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

var $ = window.jQuery;

// This is the most fragile part... this is a web scraper after all.
const xPath = '#tBody1 > tr > th > span > a';
(()=> {
    'use strict';
    const queryParams = ['inv_name', 'ticker', 'SYMBOL'];
    const rows = [['Investment name', 'ticker', 'Symbol', 'Details']];
    const links = $(xPath);
    console.log(links.length);
    links.each(function() {
        let that = this;

        const relativeUri = $(that).attr('href');
        const link = new URL(relativeUri, document.baseURI);
        const row = [];
        queryParams.forEach(heading => row.push(link.searchParams.get(heading)));
        row.push(link);

        rows.push(row);
    });

    let csvContent = rows.map(e => e.join(",")).join("\n");
    let hiddenElement = document.createElement('a');
    
    if (links.length > 0) {
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'output.csv';
        hiddenElement.click();
    }
})();
