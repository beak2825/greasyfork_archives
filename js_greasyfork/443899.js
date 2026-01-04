// ==UserScript==
// @name         Kemono Party Blacklist
// @namespace    https://MeusArtis.ca
// @version      2.0.2
// @author       Meus Artis
// @description  Blacklists posts by Creator ID
// @icon         https://www.google.com/s2/favicons?domain=kemono.cr
// @match        https://coomer.st/*/user/*
// @match        https://coomer.st/artists*
// @match        https://coomer.st/account/favorites/*
// @match        https://coomer.st/posts*
// @match        https://kemono.cr/*/user/*
// @match        https://kemono.cr/artists*
// @match        https://kemono.cr/account/favorites/*
// @match        https://kemono.cr/dms*
// @match        https://kemono.cr/posts*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      CC BY-NC-SA 4.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/443899/Kemono%20Party%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/443899/Kemono%20Party%20Blacklist.meta.js
// ==/UserScript==
(function () {
    const styleSheet = document.createElement("style");
    const styles = `.creator__blacklist{color:#ddd;font-weight:700;text-shadow:#000 0 0 3px,#000 -1px -1px 0px,#000 1px 1px 0;background-color:transparent;border:transparent}.user-header__blacklist{box-sizing:border-box;font-weight:700;color:#fff;text-shadow:#000 0 0 3px,#000 -1px -1px 0px,#000 1px 1px 0;background-color:transparent;border:transparent;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}`;
    document.head.appendChild(styleSheet);
    styleSheet.innerText = styles;
    styleSheet.type = "text/css";
    if (GM_getValue("Blacklist") === undefined) {
        const BlacklistStorage = window.localStorage.getItem("blacklist");
        if (BlacklistStorage) {
            try {
                alert("Migrating Blacklist to GreaseMonkey storage");
                const OldBlacklist = JSON.parse(BlacklistStorage);
                const NewBlacklist = Array.isArray(OldBlacklist)
                    ? OldBlacklist.filter(id => typeof id === "string" && id.length > 0)
                    : [];
                GM_setValue("Blacklist", NewBlacklist.join(','));
                if (confirm("Migration complete! Remove old localStorage entry?")) {
                    window.localStorage.removeItem("blacklist");
                    console.log("LocalStorage Blacklist removed");
                } else {
                    console.log("LocalStorage Blacklist retained");
                }
            } catch (e) {
                console.error("Migration failed:", e);
                alert("Error migrating Blacklist, Creating a new one");
                GM_setValue("Blacklist", "");
            }
        } else {
            alert("Blacklist does not exist, creating a new one");
            GM_setValue("Blacklist", "");
        }
    }
    function getBlacklist() {
        return GM_getValue("Blacklist", "").split(',').filter(Boolean);
    }
    function saveBlacklist(list) {
        GM_setValue("Blacklist", list.join(','));
    }
    let Blacklisted = getBlacklist();
    function applyBlacklist() {
        Blacklisted.forEach((item) => {
            $(`article[data-user='${item}']`).css({ display: "none" });
            $(`a[data-id='${item}']`).css({ display: "none" });
            $(`article.dm-card header a[href='/patreon/user/${item}']`).closest("article").css({ display: "none" });
        });
    }
    function setupBlacklistButtons() {
        const HeadMetaPost = document.querySelector("meta[name='user']");
        const HeadMetaArtist = document.querySelector("meta[name='artist_name']");
        const HeadMetaID = HeadMetaPost ? HeadMetaPost.getAttribute("content") : null;
        const HeadMetaArtistID = document.querySelector("meta[name='id']").getAttribute("content");
        const ButtonArea = document.querySelector('.post__actions');
        const ButtonAreaArtist = document.querySelector('.user-header__actions');
        const BlacklistButton = document.createElement("BUTTON");
        BlacklistButton.classList.add("creator__blacklist");
        BlacklistButton.type = "button";
        if (HeadMetaID) {
            const isBlacklisted = Blacklisted.includes(HeadMetaID);
            BlacklistButton.innerHTML = isBlacklisted
                ? '<span class="creator__blacklist-icon">⛒</span><span>Blacklisted</span>'
                : '<span class="creator__blacklist-icon">⛔</span><span>Blacklist</span>';
            BlacklistButton.onclick = () => {
                Blacklisted = getBlacklist();
                if (isBlacklisted) {
                    Blacklisted = Blacklisted.filter(id => id !== HeadMetaID);
                    console.log("Creator Unblacklisted");
                } else {
                    Blacklisted.push(HeadMetaID);
                    console.log("Creator Blacklisted");
                }
                saveBlacklist(Blacklisted);
                history.back();
            };
            if (ButtonArea) {
                console.log("Post Page");
                ButtonArea.appendChild(BlacklistButton);
            }
        } else {
            const isBlacklisted = Blacklisted.includes(HeadMetaArtistID);
            BlacklistButton.innerHTML = isBlacklisted
                ? '<span class="creator__blacklist-icon">⛒</span><span>Blacklisted</span>'
                : '<span class="creator__blacklist-icon">⛔</span><span>Blacklist</span>';
            BlacklistButton.onclick = () => {
                Blacklisted = getBlacklist();
                if (isBlacklisted) {
                    Blacklisted = Blacklisted.filter(id => id !== HeadMetaArtistID);
                    console.log("Creator Unblacklisted");
                } else {
                    Blacklisted.push(HeadMetaArtistID);
                    console.log("Creator Blacklisted");
                }
                saveBlacklist(Blacklisted);
                history.back();
            };
            if (ButtonAreaArtist) {
                console.log("Artist Page");
                ButtonAreaArtist.appendChild(BlacklistButton);
            }
        }
    }
    function observeUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                callback();
            }
        }).observe(document.body, { childList: true, subtree: true });
    }
    function initializeScript() {
        setTimeout(() => {
            Blacklisted = getBlacklist();
            applyBlacklist();
            setupBlacklistButtons();
        }, 333);
    }
    function donate() {
        window.open("https://ko-fi.com/meusartis", '_blank')
    }
    GM_registerMenuCommand("Donate", donate);
    window.addEventListener("DOMContentLoaded", initializeScript);
    observeUrlChange(initializeScript);
})();