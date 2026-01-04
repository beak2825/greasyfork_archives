// ==UserScript==
// @name         Install Button for Library Scripts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds an "Install"- Button for library scripts. Useful to have your usercript addon  open it in it's editor. (e.g. Tamper-, Violent- or Grease- monkey)
// @author       You
// @match        https://greasyfork.org/de/scripts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391741/Install%20Button%20for%20Library%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/391741/Install%20Button%20for%20Library%20Scripts.meta.js
// ==/UserScript==
/* jshint esnext: true */
(function() {
    'use strict';
    const getScriptContentEl = (containerElement = document) => {
        return containerElement.id === "script-content" ? containerElement : containerElement.getElementById("script-content");
    };

    const getCurrentTabname = (containerElement = document) => {
        const scriptLinks = containerElement.getElementById("script-links");
        const currentElements = scriptLinks ? scriptLinks.getElementsByClassName("current") : [];

        return currentElements.length ? (currentElements[0].textContent || "").trim() : "";
    };

    const getScriptVersion = (containerElement = document) => {
        const showVersionElements = containerElement.getElementsByClassName("script-show-version");

        if (showVersionElements.length) {
            return Array.from(showVersionElements).map(el => el.textContent).reduce((a, b) => a + " " + b);
        }
        return "";
    };

    const getLibraryHref = (containerElement = document) => {
        const scriptContent = getScriptContentEl();
        const codeElements = scriptContent ? Array.from(scriptContent.getElementsByTagName("CODE")) : [];

        return codeElements.map(el => {
            const match = /require\s(http.+?\.js)\?version/.exec(el.textContent);
            return match ? match[1] : null;
        }).find(link => link);
    };

    if (getCurrentTabname().toLowerCase() === "info") {
        const scriptContentElement = getScriptContentEl();
        const libraryHref = getLibraryHref();

        if (scriptContentElement && libraryHref) {
            const installArea = Object.assign(document.createElement("DIV"), { className: "install-area" });
            const installLink = Object.assign(document.createElement("A"), {
                className: "install-link",
                href: `${libraryHref.slice(0, -2)}user.js`,
                textContent: `Install library ${getScriptVersion()}`
            });

            scriptContentElement.insertBefore(installArea, scriptContentElement.firstChild).appendChild(installLink);
        }
    }
})();