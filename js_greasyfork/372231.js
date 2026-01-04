// ==UserScript==
// @name         Audible Library
// @namespace    https://www.audible.com/
// @version      0.1
// @description  Extract book info, display in console
// @author       Adam Skinner
// @match        https://www.audible.com/lib*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/372231/Audible%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/372231/Audible%20Library.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // selector: #adbl-library-content-main > table
    // xpath: //*[@id="adbl-library-content-main"]/table

    const table = $('#adbl-library-content-main > table > tbody > tr > td:nth-child(2)');
    const result = {};
    table.each(function(index) {
        const row = this;
        $('div > span > span > ul > li:nth-child(1)', this).each(function(i2) {
            const href = $('a', this).attr('href');
            if (href) {
                const record = {};
                record.asin = /pd\/.+\/(.+)\?/.exec(href)[1];
                record.title = $(this).text().trim();
                record.href = 'https://www.audible.com' + href;
                result[record.asin] = record;
            }
        });
    });
    console.log(JSON.stringify(result, null, 2));
})();