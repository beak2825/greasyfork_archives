// ==UserScript==
// @name         Wypoko-Ulepszacz
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Usprawnia nowy Wykop bo tak.
// @author       yojc
// @match        https://wykop.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wykop.pl
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458532/Wypoko-Ulepszacz.user.js
// @updateURL https://update.greasyfork.org/scripts/458532/Wypoko-Ulepszacz.meta.js
// ==/UserScript==

(function() {

    const version = "0.11 (2026-01-08)";
    const debugFlag = false;

    function debugLog(arguments) {
        if (debugFlag) {
            if (Array.isArray(arguments)) {
                console.log(...arguments);
            }
            else {
                console.log(arguments);
            }
        }
    }

    const newSettings = {
        wypokHideWithoutTags: {
            text: "Ukrywaj wpisy bez tagów",
            default: false
        },
        wypokExpandLongEntries: {
            text: "Rozwijaj automatycznie wpisy na mirko (bez tego długie nieotagowane wpisy mogą nie zostać ukryte)",
            default: false
        },
        wypokHideGreenEntries: {
            text: "Ukrywaj wpisy zielonek",
            default: false
        },
/*
        wypokHideGreensComments: {
            text: "Ukrywaj komentarze zielonek",
            default: false
        },
        wypokHideBlacklisted: {
            text: "Ukrywaj całkiem komentarze osób z czarnej listy",
            default: false
        },
*/
        wypokDelete: {
            text: "Usuwaj powyższą treść z DOM zamiast ukrywać",
            default: true
        },
        wypokMoveImagesInsideAnchor: {
            text: "Opakuj obrazki w tradycyjne linki",
            default: false,
            style: "section.entry-photo figure > a.moved-image { position: relative; opacity: 100; background: none; border: none; box-shadow: none; top: 0; right: 0; z-index: 0; padding: 0; } section.entry-photo figure > a.moved-image::before { content: none; display: none; }"
        },
        wypokBlockViewingBlacklistedComments: {
            text: "Zablokuj możliwość rozwijania komentarzy osób z czarnej listy",
            default: false,
            style: "aside.black-content { pointer-events: none; } aside.black-content::before { content: none !important; display: none !important; }"
        },
        wypokHideImageDownload: {
            text: "Ukryj przycisk \"Pobierz\" przy obrazkach",
            default: false,
            style: "figure a[download] { display: none !important; }"
        },
/*

        wypokAutoExpandLinkComments: {
            text: "Automatycznie rozwiń komentarze pod znaleziskiem",
            default: false
        },
        wypokDisableLazyLoad: {
            text: "Wyłącz lazyload obrazków (zaznacz, jeśli jest problem z ładowaniem)",
            default: false
        },
*/
        wypokEnlargeSpaceBetweenEntries: {
            text: "Zwiększ odstęp między wpisami i komentarzami pod znaleziskiem",
            default: false,
            style: "section.stream.microblog > .content > * { margin-top: 0 !important } section.stream.microblog > .content > *:not([data-wypok-hidden]):not(.pub-slot-wrapper) ~ *:not([data-wypok-hidden]):not(.pub-slot-wrapper) { margin-top: 32px !important } section.stream.link-comments > .content > * { margin-top: 0 !important } section.stream.link-comments > .content > *:not([data-wypok-hidden]):not(.pub-slot-wrapper) ~ *:not([data-wypok-hidden]):not(.pub-slot-wrapper) { margin-top: 32px !important }"
        },
        wypokHideNewsButton: {
            text: "Ukryj pływający przycisk \"Nowości\"",
            default: false,
            style: ".content > .popper-button.onboarding-btn { display: none; }"
        },
        wypokHideAddButton: {
            text: "Ukryj pływający przycisk \"Dodaj\"",
            default: false,
            style: ".content > .popper-button:not(.onboarding-btn) { display: none; }"
        },
        wypokHideDoodle: {
            text: "Ukryj dodatkowe \"doodle\" logo w pasku tytułowym",
            default: false,
            style: "aside.doodle { display: none !important; }"
        }
    }

    function getSettingValue(name) {
        const localValue = localStorage.getItem(name);

        if (localValue) {
            return localValue === "true";
        }
        else if (newSettings[name]) {
             return newSettings[name].default;
        }
        else {
            debugLog("Setting ${name} is not set or present in the config!");
            return false;
        }
    }
    function setSettingValue(name, value) {
        debugLog(`Setting ${name} in localStorage to ${value}`);
        localStorage.setItem(name, value);
    }

    function refreshStyles() {
        let stylesTag;

        if (document.querySelector("#wypokStyles")) {
            debugLog(`Styles tag found`);
            stylesTag = document.querySelector("#wypokStyles");
        }
        else {
            debugLog(`Creating styles tag`);
            stylesTag = document.createElement("style");
            stylesTag.setAttribute("id", "wypokStyles");
            document.head.append(stylesTag);
        }

        let newStyle = "";

        for (const [key, value] of Object.entries(newSettings)) {
            if (value.style && getSettingValue(key)) {
                debugLog(["Applying style for: ", key, value.style]);
                newStyle += value.style;
            }
        }

        stylesTag.innerHTML = newStyle;
    }

    function appendSettings() {
        debugLog(`Appending settings`);

        const firstSettingsPane = document.querySelector(".display");
        const settingsPane = firstSettingsPane.cloneNode(true);
        const settingSwitchTemplate = settingsPane.querySelector(".form-group").cloneNode(true);

        settingsPane.setAttribute("class", "wypokScript")
        settingsPane.querySelector("h3 span").innerHTML = `<a href=\"https://greasyfork.org/en/scripts/458532-wypoko-ulepszacz\" target=\"_blank\">Wypoko-Ulepszacz v${version}</a>`;

        // Disable spinner and stuff
        settingsPane.querySelector(".form-elements").classList.remove("waiting");
        for (const node of settingsPane.querySelectorAll(".simple-spinner")) {
            node.remove();
        }

        // Remove old switches
        for (const node of settingsPane.querySelectorAll(".form-group")) {
            node.remove();
        }

        // Add new switches
        for (const [key, value] of Object.entries(newSettings)) {
            const node = settingSwitchTemplate.cloneNode(true);
            node.querySelector("input").setAttribute("id", key);
            node.querySelector("input").checked = getSettingValue(key);
            node.querySelector("input").onchange = function() {
                setSettingValue(key, this.checked);
                if (value.style) {
                    refreshStyles();
                }
            }


            node.querySelector("label").setAttribute("for", key);
            node.querySelector("span").textContent = value.text;

            settingsPane.querySelector(".form-elements").append(node);
        }

        firstSettingsPane.parentNode.insertBefore(settingsPane, firstSettingsPane);
    }

    function hideOrRemove(node) {
        debugLog(["Removing or hiding node", node]);

        if (getSettingValue("wypokDelete")) {
            // Fixing broken Mikroblog navigation
            if (node.dataset.wypokDontRemove) {
                node.dataset.wypokHidden = true;
                node.style.display = "none";
                node.innerHTML = "";
            }
            else {
                node.remove();
            }
        }
        else {
            node.dataset.wypokHidden = true;
            if (debugFlag) {
                node.style.background = "#f0f";
            }
            else {
                node.style.display = "none";
            }
        }
    }

    function filterEntries(nodes) {
        if (nodes.length > 0) {
            debugLog(`Filtering ${nodes.length} entries`);
        }

        for (const node of nodes) {
            node.dataset.wypokChecked = true;

            debugLog([`Checking node`, node]);
            // ".entry-content" will be missing when entry has no text
            //debugLog(node.querySelector(":scope > article .entry-content").textContent);

            let toBeRemovedFlag = false;
            let hasNoTags;
            const showMoreButton = node.querySelector(":scope > article .entry-content button.more");

            if (showMoreButton) {
                if (getSettingValue("wypokExpandLongEntries")) {
                    showMoreButton.click();
                    hasNoTags = (node.querySelectorAll(":scope > article .entry-content a[href^='/tag/']").length === 0);
                }
                else {
                    hasNoTags = false;
                }
            }
            else {
                hasNoTags = (node.querySelectorAll(":scope > article .entry-content a[href^='/tag/']").length === 0);
            }

            const isGreen = node.querySelector(":scope > article > header a.green-profile") !== null;

            debugLog(["hasNoTags", hasNoTags, "isGreen", isGreen, "showMoreButton", !!showMoreButton]);

            if ((getSettingValue("wypokHideWithoutTags") && hasNoTags) || (getSettingValue("wypokHideGreenEntries") && isGreen)) {
                toBeRemovedFlag = true;
            }

            if (toBeRemovedFlag) {
                hideOrRemove(node);
            }
        }
    }

    function moveImageInsideAnchor(nodes) {
        const nodesToMove = Array.from(nodes).filter(node => !node.dataset.wypokChecked);
        const nodesToCheck = Array.from(nodes).filter(node => node.dataset.wypokChecked);

        if (nodesToMove.length > 0) {
            debugLog(`Moving ${nodes.length} images to <a> tag`);

            for (const node of nodesToMove) {
                node.dataset.wypokChecked = true;

                const container = node.querySelector("figure");
                const newLink = node.querySelector("figcaption a").cloneNode();
                newLink.classList.add("moved-image");
                const image = node.querySelector("figure > img");

                newLink.onclick = function(e) {
                    e.preventDefault();
                }
                newLink.href = newLink.href.split("?")[0];

                newLink.append(image);
                container.prepend(newLink);
            }
        }

        if (nodesToCheck.length > 0) {
            let fixedNodes = 0;

            for (const node of nodesToCheck) {
                const currentLink = node.querySelector("figure > a");
                const newLinkHref = node.querySelector("figcaption a").href.split("?")[0];

                if (currentLink.href !== newLinkHref) {
                    fixedNodes++;
                    currentLink.href = newLinkHref;
                }
            }

            if (fixedNodes > 0) {
                debugLog(`Fixed image link for ${fixedNodes} nodes`);
            }
        }
    }

    // Observer

    let checkMirkoEntriesFlag = false;
    let checkLinkCommentsFlag = false;
    let appendSettingsFlag = false;

    let oldHref = document.location.href;
    let bodyList = document.querySelector("body")

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                debugLog(`Document location changed`);
                oldHref = document.location.href;
                initPage();
            }
            else {
                if (getSettingValue("wypokMoveImagesInsideAnchor")) {
                    moveImageInsideAnchor(document.querySelectorAll(".entry-photo"));
                }

                if (checkMirkoEntriesFlag) {
                    //debugLog(`Checking Mirko entries`);

                    const mirkoStream = document.querySelector("section.stream.microblog");

                    if ((getSettingValue("wypokHideWithoutTags") || getSettingValue("wypokHideGreenEntries")) && mirkoStream && !mirkoStream.classList.contains("waiting") && !mirkoStream.classList.contains("pending")) {
                        document.querySelector("section.entry:not(.reply):first-child").dataset.wypokDontRemove = true;
                        filterEntries(mirkoStream.querySelectorAll("section.entry:not(.reply):not([data-wypok-checked])"));
                    }
                }
/*
                if (checkLinkCommentsFlag) {
                    //debugLog(`Checking link comments`);

                    const expandButtons = document.querySelectorAll("div.comments button.target:not([data-wypok-clicked])");

                    for (const button of expandButtons) {
                        debugLog(["Clicked", button]);
                        button.click();
                        button.dataset.wypokClicked = true;
                    }
                }
*/
                if (appendSettingsFlag && document.querySelector(".display")) {
                    debugLog("Clearing settings flag");
                    appendSettingsFlag = false;
                    appendSettings();
                }
            }
        });
    });

    let config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);

    function initPage() {
        debugLog(`Initialising page`);

        appendSettingsFlag = false;
        checkMirkoEntriesFlag = false;
        checkLinkCommentsFlag = false;

        if (oldHref.startsWith("https://wykop.pl/ustawienia/ogolne")) {
            debugLog(`Setting appendSettingsFlag`);
            appendSettingsFlag = true;
        }
        else if (oldHref.startsWith("https://wykop.pl/mikroblog") && (getSettingValue("wypokHideWithoutTags") || getSettingValue("wypokHideGreenEntries"))) {
            debugLog(`Setting checkMirkoEntriesFlag`);
            checkMirkoEntriesFlag = true;
        }
        /*
        else if (oldHref.startsWith("https://wykop.pl/link/") && getSettingValue("wypokAutoExpandLinkComments")) {
            debugLog(`Setting checkLinkCommentsFlag`);
            checkLinkCommentsFlag = true;
        }
        */
    }

    function initPageOnce() {
        debugLog(`Initialising things to do only once`);
        refreshStyles();
    }

    initPage();
    initPageOnce();

})();