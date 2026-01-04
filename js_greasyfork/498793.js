// ==UserScript==
// @name                   Redirect fake ElAmigos Repacks websites
// @name:fa               انتقال سایت های فیک ال آمیگوس به اصلی
// @description:fa        سایت های ال آمیگوس رو به اصلیش انتقال میده.
// @namespace             bananabread6234
// @author                Black_0_Wolf
// @license               idc
// @version               1.0
// @description           Redirects fake ElAmigos Repacks websites to the original one.
// @match                 *://el-amigos.*/*
// @match                 *://elamigos.*/*
// @match                 *://www.el-amigos.*/*
// @match                 *://www.elamigos.*/*
// @match                 *://www.el-amigo.*/*
// @match                 *://www.elamigo.*/*
// @match                 *://elamigos-games.*/*
// @match                 *://www.elamigos-games.*/*
// @match                 *://www.elamigosedition.*/*
// @match                 *://elamigosedition.*/*
// @grant                 none
// @icon                  https://static.wikia.nocookie.net/metro2033/images/9/99/Faction_Logo_Order.png/revision/latest/scale-to-width-down/120?cb=20191017090524
// @downloadURL https://update.greasyfork.org/scripts/498793/Redirect%20fake%20ElAmigos%20Repacks%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/498793/Redirect%20fake%20ElAmigos%20Repacks%20websites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname !== 'elamigos.site') {
        var pageTitle = document.title;
        var separatorIndex = pageTitle.search(/[\[-|]/); // Search for [ or - or |
        var trimmedTitle = separatorIndex !== -1 ? pageTitle.substring(0, separatorIndex) : pageTitle;
        var encodedTitle = encodeURIComponent(trimmedTitle);
        window.location.href = 'https://www.google.com/search?q=site%3Aelamigos.site+' + encodedTitle;
    }
})();
