// ==UserScript==
// @name          GameBanana CSS - Auto Sort By Rating (All Time)
// @namespace     http://userscripts.org/users/23652
// @description   Auto sorts CSS skins by rating if a sort method is not selected
// @include       http://css.gamebanana.com/*
// @include       https://css.gamebanana.com/*
// @copyright     JoeSimmons
// @version       1.0.0
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/3818/GameBanana%20CSS%20-%20Auto%20Sort%20By%20Rating%20%28All%20Time%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3818/GameBanana%20CSS%20-%20Auto%20Sort%20By%20Rating%20%28All%20Time%29.meta.js
// ==/UserScript==

+function () {
    'use strict';

    var links = document.querySelectorAll('a[href*="/skins/cats/"]'),
        rSkincat = /^https?:\/\/css\.gamebanana\.com\/skins\/cats\/\d+$/i,
        appendString = '?mid=SubmissionsList&vl[sort]=desc&vl[order]=rating&vl[filters][age]=all',
        link, i;

    // make sure the page is not in a frame
    if (window.frameElement || window !== window.top) { return; }

    if ( window.location.href.match(rSkincat) ) {
        window.location.href += appendString;
    } else {
        for (i = 0; link = links[i]; i += 1) {
            if ( link.href.match(rSkincat) ) {
                link.href += appendString;
            }
        }
    }
}();