// ==UserScript==
        // @name         Youtube AdBlock
        // @namespace    http://tampermonkey.net/
        // @version      1.0
        // @description  Change the title and icon of *specific* websites
        // @author       loser.dev (.lo5r)
        // @match        *://xnxx.com/*
        // @match        *://pornhub.com/*
        // @match        *://monsnode.com/*
        // @icon         https://static.vecteezy.com/system/resources/previews/023/986/704/non_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png
        // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506802/Youtube%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/506802/Youtube%20AdBlock.meta.js
        // ==/UserScript==

        (function() {
            'use strict';

            document.title = 'Youtube';

            function changeFavicon(link) {
                let favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
                favicon.type = 'image/png';
                favicon.rel = 'icon';
                favicon.href = link;
                document.getElementsByTagName('head')[0].appendChild(favicon);
            }

            changeFavicon('https://static.vecteezy.com/system/resources/previews/023/986/704/non_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png');

        })();