// ==UserScript==
// @name                   Redirect fake Fitgirl Repacks websites
// @name:fa               انتقال سایت های فیک فیت گرل به اصلی
// @description:fa        سایت های فیک فیت گرل رو به اصلیش انتقال میده.
// @namespace             bananabread2315467
// @author                Black_0_Wolf
// @license               idc
// @version               1.1
// @description           Redirects fake Fitgirl Repacks websites to the original one.
// @match                 *://fitgirl-repacks.*/*
// @match                 *://fitgirlrepacks.*/*
// @match                 *://www.fitgirl-repacks.*/*
// @match                 *://www.fitgirlrepacks.*/*
// @match                 *://www.fitgirl-repack.*/*
// @match                 *://www.fitgirlrepack.*/*
// @match                 *://fitgirl-repacks.site/*
// @grant                 none
// @icon                  https://static.wikia.nocookie.net/metro2033/images/9/99/Faction_Logo_Order.png/revision/latest/scale-to-width-down/120?cb=20191017090524
// @downloadURL https://update.greasyfork.org/scripts/486534/Redirect%20fake%20Fitgirl%20Repacks%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/486534/Redirect%20fake%20Fitgirl%20Repacks%20websites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname !== 'fitgirl-repacks.site') {
        var pageTitle = document.title;
        var separatorIndex = pageTitle.indexOf('–');
        var trimmedTitle = separatorIndex !== -1 ? pageTitle.substring(0, separatorIndex) : pageTitle;
        var encodedTitle = encodeURIComponent(trimmedTitle);
        window.location.href = 'https://fitgirl-repacks.site/?s=' + encodedTitle;
    }
})();