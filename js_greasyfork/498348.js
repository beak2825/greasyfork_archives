// ==UserScript==
// @name         YouTube Converter/Downloader
// @version      1.1.0
// @description  Adds a "Convert" button for easier downloading.
// @author       csuti
// @match        https://www.youtube.com/*
// @grant        none
// @compatible   firefox
// @compatible   chrome
// @compatible   edge
// @compatible   opera
// @namespace https://greasyfork.org/users/1269486
// @downloadURL https://update.greasyfork.org/scripts/498348/YouTube%20ConverterDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/498348/YouTube%20ConverterDownloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the video URL
    function changeVideoUrl() {
        window.location.href = window.location.href.replace("youtube", "youtubepi");
    }

    // Function to create the button
    function createButton() {
        var subscribeButton = document.querySelector(".ytd-subscribe-button-renderer");
        if (!subscribeButton) return;

        if (document.querySelector(".custom-youtube-button")) return;

        var newButton = document.createElement("button");
        newButton.className = "custom-youtube-button";
        newButton.innerHTML = '⟳ <strong>Convert</strong>';

        var darkMode = document.documentElement.getAttribute("dark") !== null;

        var buttonStyle = {
            marginLeft: "8px",
            backgroundColor: darkMode ? "rgba(90, 90, 90, 0.36)" : "#F7F7F7",
            color: darkMode ? "#FFFFFF" : "#404040",
            border: "none",
            padding: "9.66px 16px",
            cursor: "pointer",
            fontSize: "14px",
            borderRadius: "100px",
            transition: "background-color 0.3s",
            fontFamily: "'Roboto', sans-serif"
        };

        Object.assign(newButton.style, buttonStyle);

        newButton.addEventListener("mouseenter", function() {
            newButton.style.backgroundColor = darkMode ? "rgba(140, 140, 140, 0.36)" : "rgba(180, 180, 180, 0.36)";
        });

        newButton.addEventListener("mouseleave", function() {
            newButton.style.backgroundColor = darkMode ? "rgba(90, 90, 90, 0.36)" : "#F7F7F7";
        });

        newButton.addEventListener("click", changeVideoUrl);

        subscribeButton.parentNode.insertBefore(newButton, subscribeButton.nextSibling);
    }

    // Function to initialize the button creation
    function initialize() {
        createButton();
        // Observe changes to the DOM
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes) {
                    Array.from(mutation.addedNodes).forEach(function(node) {
                        if (node.nodeType === 1 && node.classList.contains("ytd-subscribe-button-renderer")) {
                            createButton();
                        }
                    });
                }
            });
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Wait for the document to fully load
    window.addEventListener('load', initialize);

    // Handle dynamic page changes in YouTube's single-page application
    var pageCheckInterval = setInterval(function() {
        if (document.querySelector(".ytd-subscribe-button-renderer")) {
            clearInterval(pageCheckInterval);
            initialize();
        }
    }, 1000);
})();
