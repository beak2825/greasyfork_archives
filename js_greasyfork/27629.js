// ==UserScript==
// @name           VKNoSponsoredFeed
// @namespace      ua.rkot
// @description    Remove sponsored posts from VK.com desktop feed
// @author         github:rkoten
// @version        1.2
// @include        *://vk.com/*
// @grant          none
// @run-at         document-end
// @require        https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/27629/VKNoSponsoredFeed.user.js
// @updateURL https://update.greasyfork.org/scripts/27629/VKNoSponsoredFeed.meta.js
// ==/UserScript==

(function(){
    'use strict';
    function removeElemsByKey(elems, key) {
        for (var i = 0; i < elems.length; ++i) {
            if (elems[i].innerHTML.indexOf(key) != -1) {
                elems[i].remove();
            }
        }
    }

    removeElemsByKey($('.feed_row'), 'class="wall_text_name_explain_promoted_post');
    removeElemsByKey($('._post'), 'class="wall_marked_as_ads"');
}());
