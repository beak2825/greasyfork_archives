// ==UserScript==
// @name         Nijie.info Image Downloader
// @namespace    pks
// @version      0.6
// @description  Show all hentai images on author's page.
// @author       pks
// @match        http://nijie.info/members_illust.php?id=*
// @match        https://nijie.info/members_illust.php?id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/32375/Nijieinfo%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/32375/Nijieinfo%20Image%20Downloader.meta.js
// ==/UserScript==

$(function (){
    $('.nijie').each(function (index, element) {
        $(document).queue('ajaxQueue', function () {
            $.ajax($(element).find('.nijiedao a').attr('href'), {
                dataType: 'html',
                success: function (data) {
                    var count = 1;
                    $(data).find('#gallery_open .mozamoza.ngtag').each(function () {
                        if (!$(element).find('.download').length) $(element).append('<div class="download"></div>');
                        $(element).find('.download').append('<a class="downloadlink" href="' + $(this).attr('src').replace(/__rs_l\d+x\d+\//, '') + '">[' + count + ']</a>');
                        count++;
                    });
                    setTimeout(function(){
                        $(document).dequeue('ajaxQueue');
                    },25);
                }
            });
        });
    });
    $(document).dequeue('ajaxQueue');
});