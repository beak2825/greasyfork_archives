// ==UserScript==
// @name         EpicGames Additional Links
// @namespace    EpicGames
// @version      1.0.2
// @author       Wizzergod
// @description  Adds additional links to EpicGames store for free download.
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_openInTab
// @match        *://store.epicgames.com/*/p/*
// @run-at       document-idle
// @inject-into  document-auto
// @noframes     false
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epicgames.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495438/EpicGames%20Additional%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/495438/EpicGames%20Additional%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NewLinks = [
        { url: "https://cs.rin.ru/forum/search.php?keywords=", urlSpecial: "&terms=any&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=Search", title: "CS.RIN.RU" },
        { url: "https://fitgirl-repacks.site/?s=", title: "Fitgirl" },
        { url: "https://gload.to/?s=", title: "Gload" },
        { url: "https://gog-games.com/search/", title: "GOG Games" },
        { url: "https://gogunlocked.com/?s=", title: "GOG Unlocked" },
        { url: "https://steamrip.com/?s=", title: "SteamRIP" },
        { url: "https://steamunlocked.net/?s=", title: "Steam Unlocked" },
        { url: "https://www.downloadha.com/?s=", title: "DownloadHa" },
        { url: "https://www.ovagames.com/?s=", title: "OVA Games" }
    ];

    const titleElement = document.querySelector("title");
    const metaElement = document.querySelector('meta[name="og:title"]');
    const appName = extractAppName(metaElement ? metaElement.getAttribute("content") : titleElement?.textContent);

    function extractAppName(title) {
        const match = title.match(/^(.*?)\s\|/);
        return match ? match[1].trim() : title;
    }

    function createButton(href, text, className) {
        let element = document.createElement("a");
        element.href = href;
        element.target = "_blank";
        element.innerHTML = text;
        element.className = className;
        return element;
    }

const checkExistEpic = setInterval(() => {
    const epicButtons = document.querySelectorAll('.css-66k900');
    if (epicButtons.length) {
        const buttonClass = epicButtons[0].parentElement.className;
        const className = `newbuttons ${buttonClass}`;
        NewLinks.forEach(link => {
            const button = createButton(link.url + appName + (link.urlSpecial || ""), link.title, className);
            epicButtons[0].parentElement.parentElement.insertAdjacentElement('beforebegin', button); // Добавляет после элемента
        });
        clearInterval(checkExistEpic);
    }
}, 100);
})();

GM_addStyle(`
.newbuttons {
  font-size: 12px !important;
  letter-spacing: 0.5px !important;
  font-weight: 500 !important;
  position: relative !important;
  border-radius: 4px !important;
  text-transform: uppercase !important;
  text-align: center !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 25px !important;
  padding: 5px 10px !important;
  height: 25px !important;
  display: flex !important;
  width: 100% !important;
  min-width: auto !important;
  background-color: rgba(0, 153, 228, 0.36) !important;
  color: rgb(255, 255, 255) !important;
  margin-top: 2px !important;
  margin-bottom: 2px !important;
  border: none !important;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.4) !important;
}`);
