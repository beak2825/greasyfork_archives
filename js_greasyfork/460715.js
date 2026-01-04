// ==UserScript==
// @name     Get YouTube Channel URLs
// @description Gets all of the Channel URLs for your information
// @version  2.0
// @match    https://*.youtube.com/@*
// @match    https://www.youtube.com/@*
// @match    https://youtube.com/@*
// @match    https://www.youtube.com/@
// @match    https://*.youtube.com/c/*
// @match    https://*.youtube.com/user/*
// @match    https://www.youtube.com/channel/*
// @match    https://*.youtube.com/channel/*
// @run-at   document-start
// @grant    GM_setClipboard
// @grant    GM_registerMenuCommand
// @grant    GM_openInTab
// @icon     https://www.google.com/s2/favicons?domain=youtube.com
// @namespace https://github.com/Vandekieft/MonkeyScripts/
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/460715/Get%20YouTube%20Channel%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/460715/Get%20YouTube%20Channel%20URLs.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function refreshPage() {
        location.reload();
    }

    function extractChannelURLs() {
        var htmlContent = document.documentElement.innerHTML;
        var channelUrlRegex = /"channelUrl":"(https:\/\/www\.youtube\.com\/channel\/[a-zA-Z0-9_-]*)"/;
        var vanityUrlRegex = /"vanityChannelUrl":"(http:\/\/www\.youtube\.com\/@[a-zA-Z0-9_-]*)"/;
        var channelUrlMatch = htmlContent.match(channelUrlRegex);
        var vanityUrlMatch = htmlContent.match(vanityUrlRegex);
        var channelUrl = null;
        var vanityUrl = null;

        if (channelUrlMatch) {
            channelUrl = channelUrlMatch[1];
            console.log('Channel URL:', channelUrl);
        }
        if (vanityUrlMatch) {
            vanityUrl = vanityUrlMatch[1];
            console.log('Vanity URL:', vanityUrl);
        }

        var box = document.createElement('div');
        box.style.position = 'fixed';
        box.style.left = '50%';
        box.style.top = '50%';
        box.style.transform = 'translate(-50%, -50%)';
        box.style.backgroundColor = '#333';
        box.style.color = 'cyan';
        box.style.border = '1px solid black';
        box.style.padding = '10px';
        box.style.zIndex = '9999';
        box.style.maxWidth = '80%';
        box.style.overflow = 'hidden';

        var urlsContainer = document.createElement('div');
        urlsContainer.style.marginBottom = '10px';

        if (channelUrl) {
            var channelUrlSection = createURLSection('Channel URL', channelUrl);
            urlsContainer.appendChild(channelUrlSection);
        }
        if (vanityUrl) {
            var vanityUrlSection = createURLSection('Vanity URL', vanityUrl);
            urlsContainer.appendChild(vanityUrlSection);
        }

        var closeButton = createButton('Close', function() {
            box.parentNode.removeChild(box);
        });
        closeButton.style.float = 'right';

        box.appendChild(urlsContainer);
        box.appendChild(closeButton);

        document.body.appendChild(box);
    }

    function createURLSection(label, url) {
        var section = document.createElement('div');
        section.style.marginBottom = '15px';

        var labelElement = document.createElement('span');
        labelElement.textContent = label + ': ';
        labelElement.style.fontSize = '16px';
        labelElement.style.fontWeight = 'bold';
        labelElement.style.fontFamily = 'YouTube Sans';
        section.appendChild(labelElement);

        var urlElement = document.createElement('span');
        urlElement.textContent = url;
        urlElement.style.wordBreak = 'break-all';
        urlElement.style.fontSize = '16px';
        urlElement.style.fontFamily = 'YouTube Sans';
        section.appendChild(urlElement);

        var copyButton = createButton('Copy', function() {
            GM_setClipboard(url);
        });
        copyButton.style.marginRight = '10px';
        copyButton.style.marginLeft = '10px';
        copyButton.style.fontSize = '12px';
        copyButton.style.float = 'right';
        section.appendChild(copyButton);

        return section;
    }

    function createButton(text, onClick) {
        var button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '5px 10px';
        button.style.marginRight = '5px';
        button.style.backgroundColor = '#555';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '12px';
        button.addEventListener('click', onClick);
        return button;
    }

    GM_registerMenuCommand('Load Channel URLs', function() {
        refreshPage();
    });

    GM_registerMenuCommand('Show Loaded Channel URLs', function() {
        extractChannelURLs();
    });
})();