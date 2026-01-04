// ==UserScript==
// @match            https://www.thetrainline.com/*
// @name             Hide Booking.com ad on Trainline
// @description      Uncheck booking.com search on Trainline, and hide the ad
// @name:fr          Trainline : cacher la publicité pour Booking.com
// @description:fr   Décoche la recherche booking.com sur Trainline et cache la publicité
// @namespace        bohwaz
// @version          1.0
// @author           bohwaz
// @license          AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/508011/Hide%20Bookingcom%20ad%20on%20Trainline.user.js
// @updateURL https://update.greasyfork.org/scripts/508011/Hide%20Bookingcom%20ad%20on%20Trainline.meta.js
// ==/UserScript==

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    let c;
    if ((c = document.getElementById('bookingPromo')) && c.checked) {
        c.click();
        c.parentNode.parentNode.parentNode.style.visibility = 'hidden';
    }
}
