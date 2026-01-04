// ==UserScript==
// @name         海豚海豹PT辅助
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A PT site helper
// @author       You
// @match        https://greatposterwall.com/torrents.php*
// @match        https://dicmusic.club/torrents.php*
// @icon         https://www.google.com/s2/favicons?domain=greatposterwall.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428880/%E6%B5%B7%E8%B1%9A%E6%B5%B7%E8%B1%B9PT%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/428880/%E6%B5%B7%E8%B1%9A%E6%B5%B7%E8%B1%B9PT%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // ------------------------ 音乐站
    if (location.origin.includes('dicmusic')) {
        // 折叠
        var link = document.querySelector('a.show_torrents_link'); var event = { ctrlKey: true }; toggle_group(1, link, event);
        // 免费检测
        let has = 0;
        document.querySelectorAll('td.td_info').forEach(node => {
            const text = node.innerText;
            if (text.includes('免费') || text.includes('free')) {
                has = 1;
            }
        });
        if (has) $('#menu ul').append('<li style="color:red">有免费种</li>');
    }

    // ------------------------ 影视站
    if (location.origin.includes('greatposterwall')) {
        // 折叠
        var link = document.querySelector('a.show_torrents_link'); var event = { ctrlKey: true }; toggle_group(1, link, event);
        // 免费检测
        let has = 0;
        document.querySelectorAll('a.torrent_specs').forEach(node => {
            const text = node.innerText;
            if (text.includes('免费') || text.includes('free')) {
                has = 1;
            }
        });
        if (has) $('#menu ul').append('<li style="color:red">有免费种</li>');
    }

})();