// ==UserScript==
// @name         Amazon图书文件名
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  生成 Amazon 网站图书的文件名
// @author       wenmin92
// @match        https://www.amazon.com/*dp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.1.slim.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454733/Amazon%E5%9B%BE%E4%B9%A6%E6%96%87%E4%BB%B6%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/454733/Amazon%E5%9B%BE%E4%B9%A6%E6%96%87%E4%BB%B6%E5%90%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('Tampermonkey', '='.repeat(120));
    console.log('Amazon图书文件名');
    console.log('Tampermonkey', '='.repeat(120));

    // 获取信息, 组装成文件名, 并写到标题下
    const ordinalNumbers = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
    function nth(n) { return n + (["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th"); }
    function pad(num) { return num < 10 ? '0' + num : num; }

    const title = $('#productTitle').text().replace(/[-,]?\s*\w+ edition|\(.*\)\s*$/i, '').trim().replace(/:\s*/g, ' - ').replace(/\s+/g, ' ').replace(/\//g, '_');
    console.log('title', title);
    const author = $('#bylineInfo .author>a, #bylineInfo .author a.contributorNameID').toArray().map(it => $(it).text().trim()).join(', ');
    console.log('author', author);
    const publishInfo = $('#detailBullets_feature_div li>span:contains("Publisher") :last-child').text().trim();
    const publisher = publishInfo.split(/;|\(/)[0]?.replace(/\b(publi|press|media).*/i, '').trim();
    let edition = publishInfo.match(/(\d+(?:st|nd|rd|th))\s+(\w+\s*)?(?:ed\.|edition)/i)?.[1]?.concat(' Edition') ?? '';
    if (!edition && publishInfo.match(/edition|ed\./i)) {
        const editionOrdinalStr = publishInfo.match(/(\w+) (?:edition|ed\.)/i)?.[1]?.toLowerCase();
        edition = ordinalNumbers.indexOf(editionOrdinalStr) > -1 ? nth(ordinalNumbers.indexOf(editionOrdinalStr) + 1) + ' Edition' : '';
    }
    const dateStr = publishInfo.match(/\((\w+ \d{1,2}, \d{4})\)/)?.[1];
    const date = dateStr ? new Date(dateStr) : null;
    const dateFormatted = date ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : '';
    const dateMonth = dateFormatted.replace(/(\d{4})-(\d{2})-\d{2}/, '$1.$2');
    console.log('publishInfo', `${publisher}; ${edition}; ${dateFormatted}`);
    const pages = $('#detailBullets_feature_div li span.a-list-item:contains("pages") span:last-child').text().trim().match(/(\d+)\s+pages/i)?.[1] ?? '';
    console.log('pages', pages);

    const fileName = `${title}, ${edition ? `${edition}, ` : ''}${author}, ${publisher}, ${dateMonth}, ${pages}P`;
    const fileNameHtml = `<p id="custom-file-name" style="margin-bottom:8px">
      <span style="font-weight:bold;user-select:none">FileName: </span>
      <span style="user-select:all">${fileName}</span>
    </p>`;

    $('#averageCustomerReviews_feature_div').after(fileNameHtml);

    // 获取 ISBN, 并写到标题下
    const isbn = $('#detailBullets_feature_div li>span:contains("ISBN-13") :last-child').text().trim().replace(/-/g, '');
    console.log('isbn', isbn);
    const isbnHtml = `<p id="custom-isbn">
      <span style="font-weight:bold;user-select:none">ISBN: </span>
      <span style="user-select:all">${isbn}</span>
    </p>`;
    $('#custom-file-name').after(isbnHtml);
})();