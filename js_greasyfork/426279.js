// ==UserScript==
// @name         Twitter Image Expander
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevents images in the twitter feed from having the top and bottom cropped off
// @author       Ambit
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @licnse       ISC; https://opensource.org/licenses/ISC
// @downloadURL https://update.greasyfork.org/scripts/426279/Twitter%20Image%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/426279/Twitter%20Image%20Expander.meta.js
// ==/UserScript==

// Copyright 2021 Ambit
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

(function() {
    'use strict';
    const enableDebugLogging = false;
    // Width to use for resizing when the container has no computed size yet
    const defaultWidth = 505;

    console.info("Twitter Image Expander loaded");

    function logat(level, ...args) {
        if (level == "debug" && !enableDebugLogging) return;
        console[level]("twimg-expand:", ...args);
    }

    function debug(...args) { logat("debug", ...args); }
    function warn(...args) { logat("warn", ...args); }

    var globalStyle = document.createElement("style");
    globalStyle.type = "text/css";
    document.head.appendChild(globalStyle);
    globalStyle.sheet.insertRule(`
        [data-testid="tweetPhoto"] {
            margin: 0px !important;
        }`);
    globalStyle.sheet.insertRule(`
        [data-testid="tweetPhoto"] >div {
            background-size: contain !important;
        }`);

    function fixImageContainer(container, image) {
        debug(`h: ${image.naturalHeight}, w: ${image.naturalWidth}, container:`, container);
        if (image.naturalHeight == 0 || image.naturalWidth == 0) return;
        var child = container.querySelector(".r-1adg3ll.r-13qz1uu");
        if (!child) {
            warn("image viewport controlling container not found, skipping");
            return;
        }
        var ratio = (container.clientWidth || defaultWidth) / image.naturalWidth
        var height = image.naturalHeight * ratio;
        debug(`setting height to ${height}px based on ratio ${ratio} for element`, child);
        child.style.paddingBottom = `${height}px`;
    }

    function isPhotoDiv(node) {
        return node && node.localName == "div" && node.getAttribute("data-testid") == "tweetPhoto";
    }

    function fixNode(node) {
        if (node.localName == "img"
            && isPhotoDiv(node.parentElement)
            && node.parentElement.parentElement
            && node.parentElement.parentElement.parentElement) {
            var container = node.parentElement.parentElement.parentElement;

            debug("attaching image fixer");
            node.addEventListener("load", function(event) {
                fixImageContainer(container, node);
            });

            if (node.complete) {
                fixImageContainer(container, node);
            }
        }
    }

    debug("fixing initial nodes");
    var nodes = document.body.getElementsByTagName("img");
    for (var i = 0; i < nodes.length; i++) {
        fixNode(nodes[i]);
    }

    var observer = new MutationObserver(mutationList => {
        mutationList.forEach(mutation => {
            mutation.addedNodes.forEach(fixNode);
        });
    });

    debug("watching for new image posts");
    observer.observe(document.body, {childList: true, subtree: true});
})();