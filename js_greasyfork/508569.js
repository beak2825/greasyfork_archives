// ==UserScript==
// @name         9wkts_velki_full_screen
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Adds stylish control buttons for fullscreen and copy link functionality, persisting across navigation
// @match        https://*.9wkts.live/*
// @match        https://*.velkiex123.live/*
// @match        https://*.wickspin24.live/*
// @match        https://*.heppni247.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508569/9wkts_velki_full_screen.user.js
// @updateURL https://update.greasyfork.org/scripts/508569/9wkts_velki_full_screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration object for different sites
    const siteConfigs = {
        '9wkts.live': {
            iframeSelector: "#s-main-container > main > div > div > div:nth-child(1) > div.s-bg-secondary > div > div.s-video-wrapper.s-relative.s-z-0 > iframe",
            parentSelector: "#s-fullmarket-content > div:nth-child(1) > div.s--mx-2.s-px-2.s-flex.s-justify-between.s-items-center.s-bg-secondary.s-h-34px"
        },
        'velkiex123.live': {
            iframeSelector: '#main-container > main > div > div > div:nth-child(1) > div.bg-secondary > div > div.video-wrapper.relative.z-0 > iframe',
            parentSelector: '#main-container > main > div > div > div.px-2.mb-12 > div:nth-child(1) > div.-mx-2.px-2.h-34px.flex.justify-between.items-center.bg-black'
        },
        'wickspin24.live': {
            iframeSelector: '#main-container > main > div > div > div:nth-child(1) > div.bg-secondary > div > div.video-wrapper.relative.z-0 > iframe',
            parentSelector: '#main-container > main > div > div > div.px-2.mb-12 > div:nth-child(1) > div.-mx-2.px-2.h-34px.flex.justify-between.items-center.bg-black'
        },
        'heppni247.live': {
            iframeSelector: '#main-container > main > div > div > div:nth-child(1) > div.bg-secondary > div > div.video-wrapper.relative.z-0 > iframe',
            parentSelector: '#main-container > main > div > div > div.px-2.mb-12 > div:nth-child(1) > div.-mx-2.px-2.h-34px.flex.justify-between.items-center.bg-black'
        }
    };

    // Get the current domain
    const currentDomain = window.location.hostname.replace('www.', '');

    // Get the configuration for the current domain
    const currentConfig = siteConfigs[currentDomain];

    // If no configuration is found for the current domain, exit the script
    if (!currentConfig) {
        console.log('No configuration found for this domain');
        return;
    }

    // Dynamically load Font Awesome stylesheet
    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
    document.head.appendChild(fontAwesomeLink);

    // Function to create a button
    function createButton(iconClass, tooltip) {
        const button = document.createElement("button");
        button.innerHTML = `<i class="${iconClass}"></i>`;
        button.title = tooltip;

        Object.assign(button.style, {
            backgroundColor: "rgba(28, 28, 28, 0.7)",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            margin: "0 4px",
            padding: "6px",
            fontSize: "14px",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        });

        button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = "rgba(44, 44, 44, 0.9)";
            button.style.transform = "translateY(-2px)";
            button.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
        });

        button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = "rgba(28, 28, 28, 0.7)";
            button.style.transform = "translateY(0)";
            button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        });

        return button;
    }

    // Function to show toast message
    function showToast(message) {
        const toast = document.createElement("div");
        toast.innerText = message;

        Object.assign(toast.style, {
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%) translateY(-100%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            zIndex: "10000",
            transition: "transform 0.3s ease-out",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = "translateX(-50%) translateY(0)";
        }, 100);

        setTimeout(() => {
            toast.style.transform = "translateX(-50%) translateY(-100%)";
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    // Fullscreen button handler
    function fullscreenButtonHandler() {
        const iframeEl = document.querySelector(currentConfig.iframeSelector);
        if (iframeEl) {
            const requestFullScreen =
                iframeEl.requestFullscreen ||
                iframeEl.webkitRequestFullscreen ||
                iframeEl.msRequestFullscreen;
            if (requestFullScreen) {
                requestFullScreen.call(iframeEl).catch(err => {
                    showToast("Failed to enter fullscreen mode");
                });
            } else {
                showToast("Fullscreen not supported");
            }
        } else {
            showToast("Video element not found");
        }
    }

    // Copy button handler
    function copyButtonHandler() {
        const iframeEl = document.querySelector(currentConfig.iframeSelector);
        if (iframeEl) {
            const src = iframeEl.src;
            navigator.clipboard.writeText(src).then(() => {
                showToast("Streaming link copied to clipboard");
            }).catch(err => {
                showToast("Failed to copy to clipboard");
            });
        } else {
            showToast("Video element not found");
        }
    }

    // Create the copy button
    const copyButton = createButton("fas fa-copy", "Copy stream link");
    copyButton.addEventListener("click", copyButtonHandler);

    // Create the fullscreen button
    const fullscreenButton = createButton("fas fa-expand", "Fullscreen");
    fullscreenButton.addEventListener("click", fullscreenButtonHandler);

    // Container for buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "customButtonContainer";
    Object.assign(buttonContainer.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(18, 18, 18, 0.6)",
        borderRadius: "8px",
        padding: "4px 8px",
    });

    // Append buttons to the container
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(fullscreenButton);

    // Function to append the button container to the target element
    function appendButtonContainer() {
        const targetElement = document.querySelector(currentConfig.parentSelector);
        if (targetElement && !targetElement.querySelector("#customButtonContainer")) {
            // Create a wrapper div to center the buttons
            const centerWrapper = document.createElement("div");
            Object.assign(centerWrapper.style, {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
            });

            centerWrapper.appendChild(buttonContainer);

            // Ensure the target element uses flexbox for proper centering
            targetElement.style.display = "flex";
            targetElement.style.justifyContent = "space-between";
            targetElement.style.alignItems = "center";

            // Insert the centerWrapper as the second child (in the middle)
            if (targetElement.childNodes.length >= 2) {
                targetElement.insertBefore(centerWrapper, targetElement.childNodes[1]);
            } else {
                targetElement.appendChild(centerWrapper);
            }
        }
    }

    // Function to continuously check for the target element and append buttons
    function checkAndAppendButtons() {
        appendButtonContainer();
        requestAnimationFrame(checkAndAppendButtons);
    }

    // Start the continuous checking
    checkAndAppendButtons();

    // Listen for page changes (for single-page applications)
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                appendButtonContainer();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();