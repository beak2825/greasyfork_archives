// ==UserScript==
// @name         VoidLayoutDesigner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Design AniList profile layouts
// @author       voidnyan
// @match        https://anilist.co/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476681/VoidLayoutDesigner.user.js
// @updateURL https://update.greasyfork.org/scripts/476681/VoidLayoutDesigner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const profileUserName = "voidnyan";
    const refreshIntervalInSeconds = 1;

    const banner = "";
    const pfp = "";
    const bio = "";
    const pinned = "";
    const colorRgb = "77, 199, 222";

    async function replaceImages() {
        const bannerElement = document.querySelector(".banner");
        const pfpElement = document.querySelector("img.avatar");
        const pfpLinkElements = document.querySelectorAll(`a.avatar[href*="${profileUserName}"]`);
        const bioElement = document.querySelector(".about img");
        const pinnedElement = document.querySelector(".activity-text:has(.pinned) img");
        const link = document.querySelector(".page-content > .user");

        if (colorRgb.length > 0) {
            link.style.setProperty("--color-blue", colorRgb);
            link.style.setProperty("--color-blue-dim", colorRgb);
        }

        if (banner.length > 0) {
            bannerElement.style = `background-image: url("${banner}")`;
        }

        if (pfp.length > 0) {
            pfpElement.src = pfp;
            for (const pfpLink of pfpLinkElements) {
                pfpLink.style = `background-image: url("${pfp}")`;
            }
        }

        if (bioElement && bio.length > 0){
            bioElement.src = bio;
        }
        if (pinnedElement && pinned.length > 0) {
            pinnedElement.src = pinned;

        }
    }

    let currentPath = "";
    let tryCount = 0;

    setInterval(() => {
        const path = window.location.pathname;
        if (path !== currentPath || tryCount < 3) {
            currentPath = path;
            if (path === `/user/${profileUserName}/`) {
                replaceImages();
            }
        }
    }, refreshIntervalInSeconds * 1000);

})();