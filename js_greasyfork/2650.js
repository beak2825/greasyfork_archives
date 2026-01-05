// ==UserScript==
// @name        Gaia - Hide Announcements
// @description Hide Announcements
// @namespace   gaiarch_v3
// @include     http://www.gaiaonline.com/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2650/Gaia%20-%20Hide%20Announcements.user.js
// @updateURL https://update.greasyfork.org/scripts/2650/Gaia%20-%20Hide%20Announcements.meta.js
// ==/UserScript==
(function () {
    var bubblelist = document.querySelector('#notifyItemList');
    var listitems = bubblelist.children;
    if (listitems.length > 0) {
        Array.prototype.forEach.call(listitems, function(item, idx, list) {
            if(item.classList.contains('notify_announcements')) {
                item.remove();
                if(list.length === 0) document.querySelector('#notifyBubbleContainer').remove();
            }
        })
    }
})();