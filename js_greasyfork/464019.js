// ==UserScript==
// @name         zoro autofocus
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      5.39
// @description  After the you finish an episode, zoro automatically goes to the next episode but the video player loses focus. This script focuses on the video player automatically for you. (you can use keyboard shortcuts without clicking on the video player).
// @match        https://embed.vodstream.xyz/*
// @match        https://rapid-cloud.co/*
// @match        https://filemoon.sx/*
// @match        https://zoro.to/watch/*
// @match        https://animeheaven.ru/watch/*
// @match        https://animedao.to/watch/*
// @match        https://allanime.to/watch/*
// @match        https://animixplay.tube/*
// @match        https://sanji.to/*
// @include      https://*.123animes.*/anime/*
// @match        https://animehub.ac/watch/*
// @match        https://anihdplay.com/*
// @include      https://gogoanime.*
// @include      https://*.animeshow.*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        GM_getValue
// @author       agent-324
// @license      CC-BY-NC-SA-4.0
// @icon         https://www.google.com/s2/favicons?domain=zoro.to
// @downloadURL https://update.greasyfork.org/scripts/464019/zoro%20autofocus.user.js
// @updateURL https://update.greasyfork.org/scripts/464019/zoro%20autofocus.meta.js
// ==/UserScript==


(function($){

        const myInterval = setInterval(myTimer, 1000);

        function myTimer() {

                    $('div.jw-icon:nth-child(1)')[0].click()
                    clearInterval(myInterval);

    }
})(jQuery);