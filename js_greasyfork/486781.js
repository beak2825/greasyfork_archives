// ==UserScript==
// @name         Hudl Video Grabber
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2024-03-06
// @description  Adds two button to the Hudl interface. The first copies the video-URL of the selected clip, the second button opens the video in a new tab, allowing you to download it.
// @author       Matthias Metelka
// @match        https://*app.hudl.com/watch/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486781/Hudl%20Video%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/486781/Hudl%20Video%20Grabber.meta.js
// ==/UserScript==
 
// Font Awesome icons
const COPY_ICON = `<i class="fa fa-link" aria-hidden="true"></i>`;
const DOWNLOAD_ICON = `<i class="fa fa-download" aria-hidden="true"></i>`;
 
// Hudl-specific selectors (may break in future versions)
const HEADER_SELECTOR = ".LibraryButton_label__ba22U";
const PLAY_NUMBER_SELECTOR = ".styles_isRowFocused__CNOtU[data-qa-id^='PLAY #-column-']";
 
// Hudl-specific class
const ICON_CLASS = "icon_iconStyle__JYQvH";
 
(async () => {
    'use strict';
 
    // Add icon styles
    let head = document.getElementsByTagName('HEAD')[0];
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
 
    let style = document.createElement('style');
    style.textContent = `
    .copy-button.inactive {
      opacity: 0.2; cursor: initial;
    }
    .copy-button.clicked::before {
      content: "Link kopiert!";
      position: absolute; left: -60%;
    }`;
 
    head.appendChild(link);
    head.appendChild(style);
 
 
    const init = async () => {
        // Wait for page to load
        const loadSelector = `[data-qa-id="keyboard-shortcut-icon"]`;
        await new Promise(resolve => {
            if (document.querySelector(loadSelector)) {
                resolve();
            }
            const observer = new MutationObserver(mutations => {
                console.log("mutation");
                if (document.querySelector(loadSelector)) {
                    observer.disconnect();
                    resolve(document.querySelector(loadSelector));
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
 
        // Return if the buttons already exist in the DOM
        if (document.getElementById("tampermonkeyCopyButton")) return;
 
        // Add buttons
        const videoElement = document.querySelector("video");
        const copyButton = document.createElement("div");
        copyButton.className = `copy-button ${ICON_CLASS}`;
        copyButton.innerHTML = COPY_ICON;
        copyButton.id = "tampermonkeyCopyButton";
 
        const downloadButton = document.createElement("div");
        downloadButton.className = `download-button ${ICON_CLASS}`;
        downloadButton.innerHTML = DOWNLOAD_ICON;
 
        const shortcutIcon = document.querySelector('[data-qa-id="keyboard-shortcut-icon"]');
        shortcutIcon.parentElement.insertBefore(downloadButton, shortcutIcon);
        shortcutIcon.parentElement.insertBefore(copyButton, downloadButton);
 
        // Copy video link to clipboard
        copyButton.addEventListener("click", (e) => {
            if (e.target.classList.contains("inactive")) return
 
            const url = videoElement.getAttribute("src");
 
            const embedContent = `${url}\n>${document.querySelector(HEADER_SELECTOR).innerText}, Play #${document.querySelector(PLAY_NUMBER_SELECTOR).dataset.qaId.split("-").slice(-1)}`
 
            navigator.clipboard.writeText(embedContent).then(() => {
                console.log('Content copied to clipboard');
                copyButton.classList.add("clicked");
                setTimeout(() => { copyButton.classList.remove("clicked") }, 2000);
            }, () => {
                console.error('Failed to copy');
            });
        })
 
        // Open video file in new tab
        downloadButton.addEventListener("click", (e) => {
            const url = videoElement.getAttribute("src");
            window.open(url, "_blank");
        })
 
        // Observe changes to videoElement src attribute
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "attributes") {
                    downloadButton.classList.toggle("inactive", mutation.target.src.startsWith("blob"))
                }
            });
        });
 
        observer.observe(videoElement, {
            attributes: true,
        });
    };
 
    // Sadly there is no native event for URL changes other than the onpopstate event,
    // but that one only fires when the browser backward and forward buttons are used.
    // Hence we need to poll for URL changes.
    let previousURL = "";
    setInterval(() => {
        let currentURL = window.location.href;
        if (currentURL !== previousURL) {
            init();
            previousURL = currentURL;
        }
    }, 1000);
})();