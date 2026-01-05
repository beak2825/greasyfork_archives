// ==UserScript==
// @name        vk music downloader
// @version     1.3
// @description Очень простой скрипт, добавляющий ссылки для скачивания к аудиозаписям на vk.com. Если ссылки не появились автоматически, используйте горячую клавишу F9.
// This simple script adds a download links to audios at vk.com. If links did not appear automatically use F9 hot key.
// @match       https://vk.com/*
// @copyright   nyaa
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// 2015
// @namespace https://greasyfork.org/users/6507
// @downloadURL https://update.greasyfork.org/scripts/10819/vk%20music%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/10819/vk%20music%20downloader.meta.js
// ==/UserScript==

function add_download_links() {
    $('.audio').each(function(){
        if( !$(this).hasClass('proccessed') ) {
            var mp3 = $(this).find('input').val();
            var track_name = $(this).find('.title_wrap').text();
            $(this).find('.title_wrap').prepend('<span style="padding-right: 5px;">[<a class="download-link" title="Скачать" target="_blank" data-track_name="' + track_name + '" href="' + mp3 + '">Save</a>]</span>');
            $(this).addClass('proccessed');
        }
    });
}

$(document).ready(function() {    

    $('body').keydown(function(e){
        if (e.which == 120) {
            add_download_links();
        }
    });
});