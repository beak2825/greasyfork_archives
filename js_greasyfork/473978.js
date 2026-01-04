// ==UserScript==
// @name         Remove alert banner/icon
// @namespace    osu
// @version      1.0.2
// @description  Removes the alert banner and icon from osu pages
// @author       Magnus Cosmos
// @match        https://osu.ppy.sh/*
// @match        https://lazer.ppy.sh/*
// @require      https://greasyfork.org/scripts/473977-osu-web/code/osu-web.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473978/Remove%20alert%20bannericon.user.js
// @updateURL https://update.greasyfork.org/scripts/473978/Remove%20alert%20bannericon.meta.js
// ==/UserScript==

const osu = new OsuWeb(function (body) {
    loaded(".osu-page--notification-banners", body).then((notifBanners) => {
        notifBanners.innerHTML = "";
    });
    loaded(".nav2-header", body).then((nav2Header) => {
        loaded(".avatar--restricted", nav2Header).then((avatarRestricted) => {
            avatarRestricted.classList.remove("avatar--restricted");
        }, { childList: true, subtree: true });
    });
});