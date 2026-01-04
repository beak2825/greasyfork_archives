// ==UserScript==
// @name         凹凸视频助手
// @namespace    auto
// @version      0.9.24
// @description  愉快地观看凹凸视频
// @author       eValor
// @match        *://www.aotu43.com/recent*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/41063/%E5%87%B9%E5%87%B8%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/41063/%E5%87%B9%E5%87%B8%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var $ = $ || window.$;

    var cleanVideos = function () {
        $('.videos').find('li').each(function (n, e) {
            var element = $(e);
            var videoID = element.attr('id').split('-')[1];
            var embed = 'http://www.aotu43.com/embed/' + videoID + '/';
            element.find('a').attr('href', embed);

            var time = element.find('.video-overlay');
            var videoTime = time.text();

            element.find('.video-details').html('<span class="video-rating">' + videoTime + '</span>');
            time.remove();

            element.find('.video-title').css('width', '100%');
        });
    };

    $(function () {
        cleanVideos();
    });
})();