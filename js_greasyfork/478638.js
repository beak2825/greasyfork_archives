// ==UserScript==
// @name         Komica Waifu Randomizer
// @name:zh-TW         Komica隨機老婆背景圖
// @description  An elaborate array of waifus
// @description:zh-TW  隨機顯示老婆背景圖，可自訂圖片清單。
// @version      1.6.8
// @match        *://komica1.org/mainmenu.html
// @match        *://*.komica1.org/*/*
// @match        *://*.komica2.net/*/*
// @match        *://rthost.win/*/*
// @match        *://gzone-anime.info/UnitedSites/*/*
// @match        *://eclair.nagatoyuki.org/*/*
// @match        *://storysol.boguspix.com/*
// @match        *://travel.voidfactory.com/*
// @match        *://kagaminerin.org/*/*
// @match        *://komica.yucie.net/*/*
// @match        *://komica.dbfoxtw.me/*/*
// @match        *://*.zawarudo.org/*/*
// @match        *://cat.2nyan.org/cellphone/*
// @match        *://www.akraft.net/service/*
// @match        *://www.akraft.net/service/*/*
// @match        *://acgspace.wsfun.com/*/*
// @match        *://2cat.org/~touhou/*
// @match        *://www.karlsland.net/*/*
// @match        *://*.boguspix.com/*
// @match        *://kemono.wtako.net/*/*
// @match        *://komicolle.org/*
// @match        *://www.camiko.org/*
// @match        *://fecha.tw/*/*
// @match        *://2cha.org/mainmenu.htm
// @match        *://2cha.org/*/*
// @match        *://www.gomiga.org/news.html
// @match        *://www.gomiga.org/*/*
// @match        *://www.manyo.xyz/*
// @match        *://www.2nekos.com/board/liu/*
// @match        *://8kun.top/komica/*
// @match        *://endchan.net/*/*
// @match        *://endchan.net/HappyNeet/*
// @match        *://boards.4chan.org/*/*
// @match        *://tsumanne.net/*
// @match        *://*.2chan.net/*
// @exclude      *://*.komica1.org/*/pixmicat.php?mode=module&load=mod_catalog*
// @exclude      *://*.komica1.org/*/pixmicat.php?mode=module&load=mod_threadlist*
// @exclude      *://*.komica2.net/*/pixmicat.php?mode=module&load=mod_threadlist
// @exclude      *://kemono.wtako.net/kemono/*
// @exclude      *://kemono.wtako.net/kemozone/galleria/*
// @exclude      *://rthost.win/aa/pbbs.html
// @exclude      *://www.karlsland.net/t7s/*
// @exclude      *://www.camiko.org/bbsmenu.htm
// @exclude      *://2cha.org/00/pixmicat.php?mode=module&load=mod_threadlist
// @exclude      *://*.2chan.net/*/futaba.php?mode=*
// @run-at       document-end
// @namespace https://greasyfork.org/users/999571
// @downloadURL https://update.greasyfork.org/scripts/478638/Komica%20Waifu%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/478638/Komica%20Waifu%20Randomizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;

    //  List of Waifu images
    var images = [
        'https://imgur.com/Ifd2MY0.png',
        'https://imgur.com/DaMHLjj.png',
        'https://imgur.com/715IBH8.png',
    ];

    function loadRandomWaifu() {
        var randomImageUrl = images[Math.floor(Math.random() * images.length)];
        var waifuStyle = `
            #waifu {
                background-image: url(${randomImageUrl});
                background-repeat: no-repeat;
                background-size: contain;
                background-position: right bottom;
                position: fixed;
                min-width: 1000px;
                margin-top: 100px;
                top: 0;
                bottom: -20px;
                right: -20px;
                opacity: 0.5;
                z-index: -1;
            }
        `;
        var style = document.createElement("style");
        style.innerText = waifuStyle;
        document.head.appendChild(style);

        var waifuDiv = document.createElement("div");
        waifuDiv.id = "waifu";
        document.body.appendChild(waifuDiv);
    }

    function ensureJQuery(callback) {
        if (window.jQuery) {
            callback();
        } else {
            var script = document.createElement('script');
            script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js';
            script.onload = function() {
                callback();
            };
            document.head.appendChild(script);
        }
    }

    ensureJQuery(function() {
        $(document).ready(function() {
            loadRandomWaifu();
        });
    });

})();
