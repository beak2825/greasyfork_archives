// ==UserScript==
// @name         BetterDGG
// @namespace    John5G
// @match        https://www.destiny.gg/bigscreen*
// @match        https://www.destiny.gg/embed/chat*
// @match        https://strims.gg/*
// @match        https://kick.com/*
// @match        https://*.youtube.com/*
// @version      1.1
// @description  Restore YouTube and Kick support for destiny.gg bigscreen
// @author       John5G
// @connect      kick.com
// @connect      youtube.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        GM_addElement
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470163/BetterDGG.user.js
// @updateURL https://update.greasyfork.org/scripts/470163/BetterDGG.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    let supportedWebsites = {
        'youtube.com': {
            customBehavior: null
        },
        'strims.gg': {
            customBehavior: function () {
                document.arrive('.close-header-btn > .close-header-caret', { existing: true }, (headerCloseButton) => headerCloseButton.click());
            }
        },
        'kick.com': {
            customBehavior: function () {
                document.arrive('video', (video) => {
                    let videoReadyInterval = setInterval(() => {
                        if (video.readyState >= 2) {
                            const theaterButton = document.querySelector('button > span.kick-icon-theater');
                            const chatButton = document.querySelector('.cursor-pointer.opacity-100');
                            const volumePanel = document.querySelector('.vjs-volume-panel');
                            const volumeWheel = document.querySelector('.vjs-volume-level');

                            theaterButton.click();
                            chatButton.click()
                            video.addEventListener("wheel", (event) => updateVolume(event, video, volumeWheel));
                            volumePanel.addEventListener("wheel", (event) => updateVolume(event, video, volumeWheel));

                            clearInterval(videoReadyInterval);
                        }
                    }, 500);
                });
            },
        },
    };

    const destinyPlatforms = {
        "youtube": "https://www.youtube.com/embed/live_stream?channel=UC554eY5jNUfDq3yDOJYirOQ&autoplay=1",
        "kick": "https://kick.com/destiny",
    };

    let loadedPlatform;
    let removedStreamBlock;
    const iframeElement = createIframeElement();

    function addWebsiteWhitelistSection() {
        const chatSettingsForm = document.querySelector('#chat-settings-form');
        if (!chatSettingsForm) {
            return;
        }

        const whitelistSection = document.createElement('div');
        const h4 = document.createElement('h4');
        h4.textContent = 'Supported Websites';
        whitelistSection.appendChild(h4);

        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');
        const textarea = document.createElement('textarea');
        textarea.id = 'supported-websites';
        textarea.classList.add('form-control');
        textarea.style.resize = 'vertical';
        textarea.placeholder = 'Comma separated ...';
        formGroup.appendChild(textarea);
        whitelistSection.appendChild(formGroup);

        chatSettingsForm.appendChild(whitelistSection);

        const supportedWebsitesTextarea = document.querySelector('#supported-websites');
        // Populate the supported websites list
        supportedWebsitesTextarea.value = Object.keys(supportedWebsites).join(', ');

        // Remove a website from the list
        supportedWebsitesTextarea.addEventListener('input', () => {
            const updatedWebsites = supportedWebsitesTextarea.value.split(',').map(website => website.trim());
            supportedWebsites = updatedWebsites.reduce((acc, website) => {
                if (website) {
                    acc[website] = supportedWebsites[website] || { customBehavior: null };
                }
                return acc;
            }, {});
        });
    }

    function createIframeElement() {
        const iframe = document.createElement('iframe');
        iframe.style = "border: medium none; overflow: hidden; width: 100%; height: 100%;";
        iframe.scrolling = "no";
        iframe.allowFullscreen = true;
        iframe.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
        iframe.frameBorder = 0;
        return iframe;
    }

    function updateVolume(event, video, volumeWheel) {
        event.preventDefault();
        video.volume += (event.deltaY < 0) ? 0.01 : -0.01;
        video.volume = Math.min(Math.max(video.volume, 0), 1);
        volumeWheel.style.height = `${video.volume * 100}%`;
    }

    function loadIframe(url) {
        const _document = window.parent.document;
        const streamWrap = _document.querySelector('#stream-wrap');
        const streamBlock = _document.querySelector('#stream-block');
        const offlineText = _document.querySelector('#offline-text')
        let embedElement = _document.querySelector('#stream-wrap #embed');

        if (offlineText) {
            offlineText.style.setProperty("display", "none");
        }

        // Set the display of #stream-block to none
        if (streamBlock) {
            removedStreamBlock = streamBlock;
            streamBlock.remove();
        }

        streamWrap.style.setProperty("align-items", "unset");

        // Create the #embed element if it doesn't exist
        if (!embedElement) {
            embedElement = _document.createElement('div');
            embedElement.id = 'embed';
            embedElement.style.width = '100%';
            embedElement.style.height = 'auto';
            streamWrap.appendChild(embedElement);
        }

        // Remove any existing iframes
        const existingIframe = embedElement.querySelector('iframe');
        if (existingIframe) {
            existingIframe.remove();
        }

        const urlObj = new URL(url);
        const urlParams = urlObj.searchParams;
        urlParams.set('loadedByUserscript', 'true');
        urlObj.search = urlParams.toString();
        iframeElement.src = urlObj.toString();
        embedElement.appendChild(iframeElement);
    }

    function unloadIframe() {
        const _document = window.parent.document;
        const streamWrap = _document.querySelector('#stream-wrap');
        const embedElement = _document.querySelector('#stream-wrap #embed');

        streamWrap.style.setProperty("align-items", "unset");

        // Remove the #embed element
        if (embedElement) {
            embedElement.remove();
        }

        // Reinject the removed streamBlock element
        if (removedStreamBlock) {
            streamWrap.appendChild(removedStreamBlock);
            removedStreamBlock = null;
        }
    }


    function handleChatLinks(_document) {
        _document.arrive('.chat-lines a.externallink', { existing: true }, (link) => {
            link.addEventListener('click', (event) => {
                const linkHref = link.getAttribute('href');
                const isSupported = Object.keys(supportedWebsites).some((website) => linkHref.includes(website));

                if (isSupported) {
                    event.preventDefault();
                    loadIframe(linkHref);
                }
            });
        });
    }

    function handleLiveDestiny() {
        // Force load platform on which destiny is live
        document.arrive("div[data-platform][style*='opacity']", {fireOnAttributesModification: true, existing: true}, (platformButton) => {
            let platformName = platformButton.dataset.platform || platformButton.title.toLowerCase();
            if (platformName !== loadedPlatform) {
                loadIframe(destinyPlatforms[platformName]);
                loadedPlatform = platformName;
            }
        });

        // Call unloadIframe when the stream goes offline
        document.arrive("div[data-platform][style*='display:none']", {fireOnAttributesModification: true, existing: true}, () => {
            unloadIframe();
        });
    }

    function executeCustomBehavior(customBehavior) {
        const urlParams = new URLSearchParams(window.location.search);
        const isLoadedByUserscript = urlParams.get('loadedByUserscript') === 'true';
        if (window !== window.parent && isLoadedByUserscript) {
            customBehavior();
        }
    }

    if (location.href === "https://www.destiny.gg/bigscreen") {
        handleLiveDestiny();
    } else if (location.href.startsWith("https://www.destiny.gg/embed/chat")) {
        handleChatLinks(document);
        document.arrive('#chat-settings-form', { existing: true }, () => {
            addWebsiteWhitelistSection();
        });
    }

    const currentWebsiteConfig = Object.entries(supportedWebsites).find(([website]) => location.href.includes(website));
    if (currentWebsiteConfig && typeof currentWebsiteConfig[1].customBehavior === 'function') {
        executeCustomBehavior(currentWebsiteConfig[1].customBehavior);
    }
})();
