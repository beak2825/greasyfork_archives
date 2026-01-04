// ==UserScript==
// @name        NexusHD Display Same Torrent
// @author      AsukaSong
// @description 在种子列表页面悬浮显示指定种子其它版本的信息
// @include     *//www.nexushd.org/torrents.php*
// @icon        http://www.nexushd.org/favicon.ico
// @run-at      document-end
// @require     https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant       none
// @version     1.1.0
// @namespace   https://greasyfork.org/users/111695

// @downloadURL https://update.greasyfork.org/scripts/39398/NexusHD%20Display%20Same%20Torrent.user.js
// @updateURL https://update.greasyfork.org/scripts/39398/NexusHD%20Display%20Same%20Torrent.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* jshint esnext: true */

(function() {
    'use strict';

    async function getImdbURL(id) {
        try {
            let res = await fetch(`details.php?id=${id}`, { credentials: "same-origin" });
            let text = await res.text();
            return text.match(/www\.imdb\.com\/title\/(tt\d+)/)[1];
        } catch(e) {
            return null;
        }
    }

    async function searchByImdb(imdb) {
        try {
            let res = await fetch(`/torrents.php?incldead=0&spstate=0&inclbookmarked=0&search=${imdb}&search_area=4&search_mode=0`, { credentials: "same-origin" });
            let text = await await res.text();
            let sameTorrents = $(text).find('.torrents > tbody > tr');
            Array.prototype.shift.call(sameTorrents);
            return sameTorrents;
        } catch(e) {
        }
    }

    $('.torrents>tbody>tr').append('<td class="rowfollow"><a class="search-by-imdb">[+]</a></td>');
    $('.torrents>tbody>:first-child td').attr({ class: 'colhead' }).find('.search-by-imdb').html('同类');
    $('.search-by-imdb').on('click', async e => {
        const torrentId = $(e.target).parent().parent().find('.torrentname a[title]').attr('href').match(/\d+/)[0];
        const imdbURL = await getImdbURL(torrentId);
        if(!imdbURL) {
            $(e.target).remove();
            return;
        }
        const sameTorrents = Array.prototype.filter.call(await searchByImdb(imdbURL), item => !item.innerHTML.match(new RegExp(torrentId)));
        $(e.target).parent().parent().after('<div style="height: 10px"></div>').after(sameTorrents).find('.search-by-imdb').remove();
    });
})();