// ==UserScript==
// @name         tiktok-scraper
// @namespace    https://greasyfork.org/en/users/14470-sewil
// @version      1.2.2
// @description  tiktok dl links scraper
// @author       Sewil
// @match        https://www.tiktok.com/@*
// @require      https://code.jquery.com/jquery-3.6.0.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455429/tiktok-scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/455429/tiktok-scraper.meta.js
// ==/UserScript==

console.log('tiktok-scraper');
var links = new Set();

var navSelector = '[data-e2e="tiktok-logo"]';
var itemSelector = '[data-e2e="user-post-item"] a';
var linkRegex = /https:\/\/www.tiktok.com\/@[A-Za-z-\d_]+\/video\/\d+/g;
$(document).ready(function () {
    setTimeout(function() {
        $(navSelector).after('<input id="tiktok-scraper_button" type="button" value="DL Links (' + links.size + ')" style="margin-left: 10px;"/>');
        $('#tiktok-scraper_button').on('click', function () {
            var json = [Array.from(links).join('\n')];
            var blob = new Blob(json, { type: 'text/plain;charset=utf-8' });
            var url = window.URL || window.webkitURL;
            var link = url.createObjectURL(blob);
            var a = $('<a />');
            a.attr('download', 'links.txt');
            a.attr('href', link);
            $('body').append(a);
            a[0].click();
            $('body').remove(a);
        });
    }, 2000);
    console.log('tiktok-scraper ready');
    $(itemSelector).each(handleLink);
    $(document).arrive(itemSelector, handleLink);
    function handleLink() {
        var link = $(this).attr('href');
        console.log('handleLink', link);
        if (!link.match(linkRegex)) return;
        links.add(link);
        $('#tiktok-scraper_button').val(
            'DL Links (' + links.size + ')'
        );
    }
});
