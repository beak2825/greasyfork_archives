// ==UserScript==
// @name         Readpaper Helper
// @namespace    Terrasse
// @version      1.1.0
// @description  Readpaper website enhancements
// @author       You
// @match        https://readpaper.com/paper/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=readpaper.com
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/505232/Readpaper%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/505232/Readpaper%20Helper.meta.js
// ==/UserScript==

setTimeout(function () {
    'use strict';
    var title = $('h1').text().trim();
    var info_row = $('.info-row');

    // Google Scholar Button
    var scholar_link = `https://scholar.google.com/scholar?q=${title}`;
    var scholar_item = `
<div class="share" id="rh_scholar"><span style="display:flex;align-items:center;">
<i aria-hidden="true" class="aiknowledge-icon icon-chrome"></i>
<a href="${scholar_link}">Scholar</a>
</span></div>`;
    scholar_item = $(scholar_item);
    scholar_item.css('color', '#1f71e0').css('margin-left', '12px');
    info_row.append(scholar_item);

    // Direct PDF Button
    var pdf_item = `
<div class="share" id="rh_pdf"><span style="display:flex;align-items:center;">
<i aria-hidden="true" class="aiknowledge-icon icon-file-pdf-fill"></i>
<a href="#">Fetch PDF</a>
</span></div>`;
    pdf_item = $(pdf_item);
    pdf_item.css('color', '#1f71e0').css('margin-left', '12px');

    pdf_item.click(function () {
        var apiKey = GM_getValue('rh_key', null);
        if (apiKey == null || apiKey.length != 40) {
            apiKey = prompt('Enter API Key:');
            if (apiKey.length != 40) {
                alert('Invalid API Key');
                return;
            }
            GM_setValue('rh_key', apiKey);
        }

        var settings = {
            "url": "https://google.serper.dev/scholar",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "q": title,
            }),
        };

        $.ajax(settings).done(function (response) {
            console.log(response);

            try {
                var link = response.organic[0].link;
                if (link.indexOf('.pdf') != -1) {
                    console.log(`direct link: ${link}`);
                } else if (link.indexOf('/abs/') != -1) {
                    console.log(`redirecting rule '/abs/': ${link}`);
                    link = link.replace('/abs/', '/pdf/');
                } else {
                    console.log(`unknown link type: ${link}`);
                    GM_openInTab(link, {
                        active: true,
                        insert: true,
                        setParent: true
                    });
                    return;
                }
                GM_download({
                    url: link,
                    name: title + '.pdf',
                    saveAs: true
                });
            } catch (error) {
                alert(`Failed to fetch PDF: ${error}`);
            }
        });
    });

    info_row.append(pdf_item);
}, 1000);