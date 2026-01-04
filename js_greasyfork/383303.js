// ==UserScript==
// @name         Shikimori.one — Hide smotretanime.ru in player page
// @name:ru      Скрыть smotretanime.ru на странице плеера shikimori.one
// @namespace    https://shikimori.one/
// @version      0.1
// @description  Hide smotretanime.ru in player page on shikimori.one
// @description:ru Скрывает smotretanime.ru на странице плеера shikimori.one
// @author       astreloff
// @match        https://play.shikimori.org/animes/*/video_online
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/383303/Shikimorione%20%E2%80%94%20Hide%20smotretanimeru%20in%20player%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/383303/Shikimorione%20%E2%80%94%20Hide%20smotretanimeru%20in%20player%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

$('.b-video_variant:contains("smotretanime.ru")').hide()
})();