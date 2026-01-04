// ==UserScript==
// @name                CloudMusic - Show all songs on the playlist
// @name:zh-CN          网易云音乐 - 显示歌单中的所有歌曲
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             2.0.1
// @description         Show all songs in the playlist
// @description:zh-CN   显示歌单中的所有歌曲
// @author              pana
// @license             GNU General Public License v3.0 or later
// @match               *://music.163.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/405985/CloudMusic%20-%20Show%20all%20songs%20on%20the%20playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/405985/CloudMusic%20-%20Show%20all%20songs%20on%20the%20playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cookie = {
        set: function(key, val, time) {
            let date = new Date();
            let expires_days = time;
            date.setTime(date.getTime() + expires_days * 24 * 3600 * 1000);
            document.cookie = key + "=" + val + ";expires=" + date.toGMTString();
        },
        get: function(key) {
            let get_cookie = document.cookie.replace(/[ ]/g, "");
            let arr_cookie = get_cookie.split(";");
            let tips;
            for (let i = 0; i < arr_cookie.length; i++) {
                let arr = arr_cookie[i].split("=");
                if (key === arr[0]) {
                    tips = arr[1];
                    break;
                }
            }
            return tips;
        },
        delete: function(key) {
            let date = new Date();
            date.setTime(date.getDate() - 1);
            document.cookie = key + "=v; expires =" + date.toGMTString();
        }
    };
    function init_Cloud_Music() {
        if (cookie.get('os') != 'pc' || cookie.get('appver') != '2.7.1.198242') {
            cookie.set('os', 'pc', 30);
            cookie.set('appver', '2.7.1.198242', 30);
            location.reload();
        }
        if (location.href.indexOf('/playlist?id=') !== -1) {
            if (document.getElementById('m-playlist')) {
                document.querySelectorAll('.soil').forEach((item) => {
                    item.parentNode.removeChild(item);
                });
            }
        }
    }
    init_Cloud_Music();
})();
