// ==UserScript==
// @name         COUB.COM - hide selected authors and disliked videos
// @namespace    https://coub.com
// @version      1.2
// @description  hides selected authors and disliked videos on COUB.COM
// @author       Rhoads
// @license      CC-BY-SA-4.0
// @icon         https://cs14.pikabu.ru/avatars/2609/m2609364-1795047659.png
// @match        https://coub.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/453179/COUBCOM%20-%20hide%20selected%20authors%20and%20disliked%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/453179/COUBCOM%20-%20hide%20selected%20authors%20and%20disliked%20videos.meta.js
// ==/UserScript==

(async function () {
    "use strict";

    // author href with forward '/'
    let BLACKLIST = new Set(JSON.parse(GM_getValue("CoubBannedAuthors", "[]")));

    BLACKLIST.forEach((coubAuthor) =>
    {
        GM_registerMenuCommand(`Unban ${coubAuthor}`, function() { UnbanAuthor(coubAuthor); });
    });

    let lastCleanedPageID = "-1";

    function cleanUp(targetNode) {
        const lastPage = document.querySelector(".coubs-list__inner .page:last-child");

        if (lastCleanedPageID === lastPage.dataset.pageId) {
            return;
        }

        lastCleanedPageID = lastPage.dataset.pageId;

        const coubs = lastPage.querySelectorAll("div.coub--normal-card");

        coubs.forEach((coub) =>
        {
            //let coubTitle = coub.querySelector("h5.description__title > a")?.title;

            if (!!coub.querySelector(".coub__dislike-button.-on"))
            {
                //console.log(`[COUB.COM - BLACKLIST] Removed disliked coub: ${coubTitle}`);
                coub.remove();

                return;
            }

            let coubDescription = coub.querySelector("div.coub-description__about__inner");
            let coubAuthor = coubDescription.querySelector("a.hbold.coub-description__about__user")?.getAttribute("href");

            if (BLACKLIST.has(coubAuthor))
            {
                //console.log(`[COUB.COM - BLACKLIST] Removed blacklisted coub author: ${coubAuthor}`);
                coub.remove();

                return;
            }

            // add BAN button

            var button = document.createElement('button');
            button.setAttribute('id', 'ButtonBanAuthor');
            button.innerHTML = "Ban!";
            coubDescription.appendChild(button).addEventListener("click", function() { ButtonBanAuthorClickAction(coubAuthor); }, false);
        });
    }

    function ButtonBanAuthorClickAction (coubAuthor) {
        //console.log(`[COUB.COM - BLACKLIST] Blacklist coub author: ${coubAuthor}`);
        BLACKLIST.add(coubAuthor);
        SaveBlacklist();
    }

    function UnbanAuthor(coubAuthor) {
        //console.log(`[COUB.COM - BLACKLIST] Unban: ${coubAuthor}`);
        BLACKLIST.delete(coubAuthor);
        SaveBlacklist();
    }

    function SaveBlacklist() {
        GM_setValue("CoubBannedAuthors", JSON.stringify([...BLACKLIST]));
    }

    async function waitUntilExists(selector) {
        return new Promise(function check(resolve, reject) {
            let el = document.querySelector(selector);

            if (el) {
                return resolve(el);
            }

            setTimeout(function () {
                check(resolve, reject);
            }, 100);
        });
    }

    await waitUntilExists(".coubs-list__inner > .page");

    cleanUp();

    window.addEventListener("scroll", cleanUp);
})();
