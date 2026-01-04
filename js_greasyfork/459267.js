// ==UserScript==
// @name         tiktok-scraper
// @namespace    https://greasyfork.org/en/users/14470-sewil
// @version      1.0.0
// @description  tiktok dl links scraper
// @author       Sewil
// @match        https://www.tiktok.com/@*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459267/tiktok-scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/459267/tiktok-scraper.meta.js
// ==/UserScript==

console.log('tiktok-scraper');
var links = {};

var navSelector = "a[data-e2e='tiktok-logo']";
var parentSelector =
    '#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-w4ewjk-DivShareLayoutV2.enm41490 > div > div.tiktok-xuns3v-DivShareLayoutMain.ee7zj8d4 > div.tiktok-1qb12g8-DivThreeColumnContainer.eegew6e2 > div';
var selector =
    parentSelector +
    '> div > div.tiktok-x6f6za-DivContainer-StyledDivContainerV2.eq741c50 > div > div > a';
$(document).ready(function () {
    $(navSelector).after(
        $(
            '<input id="tiktok-scraper_button" type="button" value="DL Links (0)" style="margin-left: 10px;"/>'
        )
    );
    $('#tiktok-scraper_button').on('click', function () {
        var json = [Object.keys(links).join('\n')];
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
    console.log('tiktok-scraper ready');
    $(selector).each(handleLink);
    $(document).arrive(selector, function () {
        $(selector).each(handleLink);
    });
    function handleLink() {
        var link = $(this).attr('href');
        console.log(link);
        links[link] = '';
        $('#tiktok-scraper_button').val(
            'DL Links (' + Object.keys(links).length + ')'
        );
    }
});
