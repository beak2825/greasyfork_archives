// ==UserScript==
// @name         Copy fxtwitter or fixupx link buttons
// @name:es      Botones de copiar enlace de fxtwitter o fixupx
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Adds buttons at the top of tweets to easily copy Twitter / X proxies
// @description:es  Añade botones en la parte superior de tweets para copiar proxies de Twitter / X fácilmente
// @author       LuisAlfredo92
// @match        *x.com/*
// @match        *twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license GPL3
// @supportURL https://github.com/LuisAlfredo92/copy-fxtwitter-or-fixupx-link-buttons
// @downloadURL https://update.greasyfork.org/scripts/520472/Copy%20fxtwitter%20or%20fixupx%20link%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/520472/Copy%20fxtwitter%20or%20fixupx%20link%20buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Variables
    const ProxyType = {
        fxtwitter: "fxtwitter",
        fixupx: "fixupx",
        vxtwitter: "vxtwitter",
        girlcockx: "girlcockx",
        stupidpenisx: "stupidpenisx"
    };
    const languages = {
        en: "English",
        es: "Español"
    };
    const re = new RegExp(".*(x.com|twitter.com)\/.+\/status\/.+");
    let exists = false;

    // Labels
    const englishLabels = {
        copyButton: "Copy {0} link",
        copied: "Copied!",
        language: "Language",
        enabledButtons: "Enabled buttons",
        save: "Save"
    };
    const spanishLabels = {
        copyButton: "Copiar enlace de {0}",
        copied: "¡Copiado!",
        language: "Idioma",
        enabledButtons: "Botones habilitados",
        save: "Guardar"
    };

    // Get data from local storage
    let savedData;
    let savedDataString = localStorage.getItem("fxtwitterFixupxButtons");
    if (!savedDataString) {
        savedData = {
            fxtwitter: true,
            fixupx: true,
            vxtwitter: false,
            girlcockx: false,
            stupidpenisx: false,
            language: "en"
        };
        localStorage.setItem("fxtwitterFixupxButtons", JSON.stringify(savedData));
    } else {
        savedData = JSON.parse(savedDataString);
    }
    // There must be a better way to do this
    let labels;
    switch (savedData.language) {
        case "es":
            labels = spanishLabels;
            break;
        default:
            labels = englishLabels;
            break;
    }

    // Function to change url
    const modifyAndSaveUrl = async (type, button) => {
        // Get URL
        const currentUrl = window.location.href;
        const isTwitter = currentUrl.includes("twitter.com");
        let modifiedUrl, proxyHost;
        switch (type) {
            case ProxyType.fxtwitter:
                proxyHost = "fxtwitter.com";
                break;

            case ProxyType.girlcockx:
                proxyHost = "girlcockx.com";
                break;

            case ProxyType.stupidpenisx:
                proxyHost = "stupidpenisx.com";
                break;

            default:
                proxyHost = "fixupx.com";
                break;
        }
        modifiedUrl = currentUrl.replace(isTwitter ? "twitter.com" : "x.com", proxyHost);

        // Copy to url
        try {
            await navigator.clipboard.writeText(modifiedUrl);
            console.log("Modified URL copied to clipboard: ", modifiedUrl);
            // Change the button text to "Copied!", then, wait 3 seconds and change it back to the original text
            const originalText = button.innerText;
            button.innerText = labels.copied;
            setTimeout(() => button.innerText = originalText, 3000);
        } catch (ex) {
            console.error("Failed to copy the modified URL: ", ex);
        }
    }

    // Function to create buttons
    const createButton = (type) => {
        const button = document.createElement("BUTTON");
        button.appendChild(document.createTextNode(labels.copyButton.replace("{0}", type)));
        button.addEventListener("click", () => modifyAndSaveUrl(type, button));
        button.style.width = 80 / totalButtons + "%";
        button.style.flexGrow = "1";
        button.style.flexShrink = "0";
        button.style.textAlign = "center";
        button.style.fontFamily = "TwitterChirp";
        button.style.border = "none";
        button.style.borderRadius = "25px";
        button.style.padding = "10px 0px";
        button.style.fontWeight = "bold";

        return button;
    }

    // Function to create settings
    const createSettings = () => {
        const settings = document.createElement("DIV");
        settings.style.width = "250px";
        settings.style.fontFamily = "TwitterChirp";
        settings.style.display = "none";
        settings.style.flexDirection = "column";
        settings.style.position = "absolute";
        settings.style.top = "10px";
        settings.style.right = "15%";
        settings.style.backgroundColor = "Black";
        settings.style.color = "White";
        settings.style.padding = "10px";
        settings.style.zIndex = "99";
        settings.style.border = "1px solid White";

        // Create checkboxes
        let checkboxesHtml = "";
        for (const key in ProxyType) {
            checkboxesHtml += `
                <div style="display:flex;flex-direction:row;gap:10px;">
                    <input type="checkbox" id="${key}" name="${key}" ${savedData[key] ? "checked" : ""}>
                    <label for="${key}">${ProxyType[key]}</label>
                </div>
            `;
        }

        // Create options for select
        let optionsHtml = "";
        for (const key in languages) {
            optionsHtml += `<option value="${key}" ${key === savedData.language ? "selected=\"selected\"" : ""}>${languages[key]}</option>`;
        }

        settings.innerHTML = `
            <div style="display:flex;flex-direction:row;gap:10px;">
                <label for="lang">${labels.language}: </label>

                <select name="lang" id="lang" value="${savedData.language}">
                    ${optionsHtml}
                </select>
                <button style="margin-left:auto;">X</button>
            </div>
            <p>${labels.enabledButtons}:</p>
            ${checkboxesHtml}
            <button style="margin-top:10px;">${labels.save}</button>
        `;

        // Add event listeners
        const buttons = settings.querySelectorAll("button");
        const closeButton = buttons[0],
            saveButton = buttons[1];
        closeButton.addEventListener("click", () => settings.style.display = "none");

        // Save settings
        saveButton.addEventListener("click", () => {
            const checkboxes = settings.querySelectorAll("input[type=checkbox]");
            checkboxes.forEach(checkbox => {
                savedData[checkbox.name] = checkbox.checked;
            });
            savedData.language = settings.querySelector("#lang").value;
            localStorage.setItem("fxtwitterFixupxButtons", JSON.stringify(savedData));
            // Update labels
            switch (savedData.language) {
                case "es":
                    labels = spanishLabels;
                    break;
                default:
                    labels = englishLabels;
                    break;
            }
            // Update buttons
            saveButton.innerText = labels.save;
        });

        return settings;
    }
    const toggleVisibility = (settings) => {
        settings.style.display = settings.style.display == "none" ? "flex" : "none";
    }

    const callback = (mutationList) => {
        // Check if the current page is a tweet
        const currentUrl = window.location.href;
        if (!re.test(currentUrl)) return;

        for (const mutation of mutationList) {
            if (mutation.type !== "attributes") return;

            // Checks if the buttons doesn't already exist
            if (exists) {
                const existingContainers = document.querySelectorAll("#fxtwitterFixupxButtons");
                if (existingContainers.length != 0)
                    return;

                exists = false;
            }

            const containers = document.querySelectorAll(".css-175oi2r.r-1iusvr4.r-16y2uox.r-ttdzmv");
            if (containers.length == 0) return;

            // Create container and changes its style
            const container = document.createElement("DIV");
            container.id = "fxtwitterFixupxButtons";
            container.style.marginBottom = "15px";
            container.style.display = "flex";
            container.style.flexDirection = "row";
            container.style.gap = "10px";

            // Add buttons
            for (const button of buttons)
                container.appendChild(button);

            // Add settings button
            const settings = createSettings();
            document.body.appendChild(settings);
            const settingsButton = document.createElement("BUTTON");
            settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="height: 25px;filter: invert(1);isolation: isolate;mix-blend-mode: difference;"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>`;
            settingsButton.addEventListener("click", () => toggleVisibility(settings));
            settingsButton.style.width = "10%";
            settingsButton.style.flexGrow = "1";
            settingsButton.style.flexShrink = "0";
            settingsButton.style.textAlign = "center";
            settingsButton.style.fontFamily = "TwitterChirp";
            settingsButton.style.border = "none";
            settingsButton.style.borderRadius = "25px";
            settingsButton.style.fontWeight = "bold";
            container.appendChild(settingsButton);

            // Insert container
            containers[0].prepend(container);
            exists = true;
        }
    };

    // Create buttons
    const buttons = [];
    const totalButtons = Object.keys(ProxyType).map(key => {
        return savedData[key] ? 1 : 0;
    }).reduce((a, b) => a + b, 0);
    Object.keys(ProxyType).forEach(key => {
        if (savedData[key])
            buttons.push(createButton(ProxyType[key]));
    });

    // Displays the buttons when the page is correctly loaded
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, subtree: true };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(document, config);
})();