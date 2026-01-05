// ==UserScript==
// @name         YouTube uBlock Whitelister (Improved)
// @namespace    com.imnofox.uBOWhitelistYT
// @version      1.0
// @description  An improved version of Zalastax's fixed version of gorhill's tool to whitelist ads for certain YouTubers
// @author       imnofox, Zalastax, Raymond Hill (gorhill)
// @match        https://*.youtube.com/*
// @grant        GM_registerMenuCommand
// @license      http://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/24018/YouTube%20uBlock%20Whitelister%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24018/YouTube%20uBlock%20Whitelister%20%28Improved%29.meta.js
// ==/UserScript==

// based on https://greasyfork.org/en/scripts/22308-youtube-whitelist-channels-in-ublock-origin
// which was based on https://greasyfork.org/en/scripts/13226-youtube-whitelist-channels-in-ublock-origin
// with adaption from https://greasyfork.org/en/forum/discussion/8985


// Function to return the channel name
var fetchChannel = function() {
    var link = document.querySelector('[id="watch7-user-header"] a[href^="/user/"]');
    if (link === null) {
        link = document.querySelector('[id="watch7-user-header"] a[href^="/channel/"]');
        if (link === null) {
            return;
        }
    }
    var linkHref = link.getAttribute('href');
    var linkmatch = linkHref.match(/\/(user|channel)\/(.+)/);
    if (linkmatch === null)
        return;
    var channel = linkmatch[2];
    return channel || '';
};

// Add the channel name to the URL
var exposeUserInURL = function() {
    var channel = fetchChannel();

    var newArg = channelId !== '' ? 'user=' + encodeURIComponent(channel) : '';
    var matches = location.search.match(/(?:[?&])(user=(?:[^&]+|$))/);
    var oldArg = matches !== null ? matches[1] : '';
    if (newArg === oldArg) {
        return;
    }
    var href = location.href;
    if (oldArg === '') {
        location.replace(href + (location.search === '' ? '?' : '&') + newArg);
        return;
    }
    location.replace(href.replace(oldArg, newArg));
};
setTimeout(exposeUserInURL, 25);


// DOM modifications
var mutationHandlerTimer = null;
var mutationHandlerAsync = function() {
    'use strict';

    mutationHandlerTimer = null;
    exposeUserInURL();
};
var mutationHandler = function(mutations) {

    if (mutationHandlerTimer !== null) {
        return;
    }

    for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes) {
            mutationHandlerTimer = setTimeout(mutationHandlerAsync, 25);
            break;
        }
    }
};
var observer = new MutationObserver(mutationHandler);
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Function to provide the user with the whitelist rule
var provideRule = function() {
    var channel = fetchChannel();
    if (channel !== '') {
        prompt("Add this to your uBO whitelist.\n\nuBO whitelist directive for this channel:", "youtube.com/*user=" + encodeURIComponent(channel) + "*");
    } else {
        alert("No Youtube user name found on this page.");
    }
};

// Add button to videos
var createButton = function() {
    var container = document.getElementById("watch7-subscription-container");
    if (container) {
        // Insert some style overrides for this button
        document.styleSheets[0].insertRule("button.UBO-button::before { content: none; margin-right: 0px; width: 0px; height: 0px; }", 0);
        document.styleSheets[0].insertRule("button.UBO-button { margin-left: 5px; padding: 0 5.5px 0px 6px !important;}", 0);

        var button = document.createElement("button");
        button.className = "UBO-button yt-uix-button yt-uix-button-size-default yt-uix-button-subscribed-branded yt-uix-button-has-icon no-icon-markup yt-uix-subscription-button yt-can-buffer hover-enabled";
        button.innerHTML = "uBO";
        button.addEventListener("click", provideRule, false);

        // Add the button after the container
        if (container.nextSibling) {
            container.parentNode.insertBefore(button, container.nextSibling);
        } else {
            container.parentNode.appendChild(button);
        }
    }
};
createButton();

// Nice clicky item in the GM menu
GM_registerMenuCommand("TubeWhitelister", provideRule);
