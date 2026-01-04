// ==UserScript==
// @name         Youtube ChannelId Got Easy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script that makes it easier to get the channelid of any youtube channel with one click.
// @author       pacharya on Discord
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471877/Youtube%20ChannelId%20Got%20Easy.user.js
// @updateURL https://update.greasyfork.org/scripts/471877/Youtube%20ChannelId%20Got%20Easy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let copyButton = null;

    function copyChannelId() {
        const channelId = window.ytInitialData.metadata.channelMetadataRenderer.externalId;
        const tempInput = document.createElement('input');
        tempInput.value = channelId;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Channel ID copied to clipboard: ' + channelId);
    }

    function findTargetElement() {
        return document.querySelector(
            'ytd-channel-name div#container > div#text-container > yt-formatted-string'
        );
    }

    function createCopyButton() {
        if (copyButton) {
            copyButton.remove();
        }

        const targetElement = findTargetElement();

        if (!targetElement) return;

        copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Channel ID to Clipboard';
        copyButton.style.marginLeft = '8px';
        copyButton.style.padding = '8px 16px';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.background = '#FF0000';
        copyButton.style.color = '#FFF';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontWeight = 'bold';
        copyButton.style.fontFamily = 'Arial, sans-serif';
        copyButton.onclick = copyChannelId;

        targetElement.parentElement.appendChild(copyButton);
    }

    function waitForElementToExist(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback();
        } else {
            setTimeout(() => waitForElementToExist(selector, callback), 100);
        }
    }

    waitForElementToExist(
        'ytd-channel-name div#container > div#text-container > yt-formatted-string',
        () => {
            createCopyButton();
            const targetNode = findTargetElement();
            const observer = new MutationObserver(createCopyButton);
            observer.observe(targetNode, { childList: true });
        }
    );
})();