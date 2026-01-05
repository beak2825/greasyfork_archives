// ==UserScript==
// @name        Pankey-B-Gone
// @description Hides all posts by Pankeyman on TFTV
// @namespace   deetr
// @include     /^https?:\/\/(www)?\.teamfortress\.tv\/threads.*$/
// @include     /^https?:\/\/(www)?\.teamfortress\.tv\/forum\/.*$/
// @version     1
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_getValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/10672/Pankey-B-Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/10672/Pankey-B-Gone.meta.js
// ==/UserScript==

hideThreads();


function hideThreads() {
    var desc;
    $('.thread').each(function(i, obj) {
            desc = $(this).find('.main').find('.description').text();
            if (desc.indexOf("Pankeyman") >= 0){
              $(this).hide();
            }
    });
}
