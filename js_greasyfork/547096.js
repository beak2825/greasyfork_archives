// ==UserScript==
// @name         Bring back Friends
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reverts 'Connections' back to 'Friends' on roblox.com
// @author       JogosGo
// @license      GNU General Public License v3.0
// @match        *://*.roblox.com/*
// @icon         https://github.com/JogosGo/Bring-Back-Friends/blob/main/icon.png?raw=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547096/Bring%20back%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/547096/Bring%20back%20Friends.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isEditable(node) {
        let parent = node.parentNode;
        while (parent) {
            if (
                parent.nodeType === Node.ELEMENT_NODE &&
                (
                    parent.tagName === "INPUT" ||
                    parent.tagName === "TEXTAREA" ||
                    parent.isContentEditable
                )
            ) {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    }

    function isExcluded(node) {
        const excludedSelectors = [
            'div.avatar-name-container',
            '.username',
            '.profile-name',
            '[data-username]',
            '[data-profile-name]',
            '.avatar-name-container',
            '.keyword',
            '.navbar-search-input',
            '#navbar-search-input',
            'input#navbar-search-input.form-control.input-field.new-input-field',
            'div.game-card-name.game-name-title',
            'input.form-control.input-field.ng-pristine.ng-valid.ng-not-empty.ng-touched',
            'div.text-overflow.avatar-name.ng-binding.ng-scope',
            'div.input-group',
            'div.profile-header-details'
        ];
        let parent = node.parentNode;
        while (parent) {
            if (parent.nodeType === Node.ELEMENT_NODE) {
                for (const selector of excludedSelectors) {
                    if (parent.matches(selector)) {
                        return true;
                    }
                }
                if (
                    (parent.tagName === "INPUT" && parent.id === "navbar-search-input") ||
                    (parent.tagName === "INPUT" && parent.getAttribute("ng-model") === "formData.keyword")
                ) {
                    return true;
                }
            }
            parent = parent.parentNode;
        }
        return false;
    }

    function replaceInputPlaceholdersAndValues(root) {
        const inputs = root.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (isExcluded(input)) return;
            if (input.placeholder) {
                input.placeholder = input.placeholder
                    .replace(/\bConnections\b/g, "Friends")
                    .replace(/\bConnection\b/g, "Friend");
            }
            if (document.activeElement !== input && input.value) {
                input.value = input.value
                    .replace(/\bConnections\b/g, "Friends")
                    .replace(/\bConnection\b/g, "Friend");
            }
        });
    }

    function replaceTextNodes(root) {
        const whitelistSelectors = [
            'h1.friends-title',
            'a.rbx-tab-heading',
            'ul.profile-header-social-counts',
            'div.container-header.people-list-header h2',
            'div.friend-carousel-container h2',
            'div.container-header h2.friends-subtitle',
            'div.avatar-card-content span.ng-binding.ng-scope'
        ];
        const whitelistedNodes = root.querySelectorAll(whitelistSelectors.join(', '));
        whitelistedNodes.forEach(node => {
            if (node.matches('ul.profile-header-social-counts')) {
                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        child.nodeValue = child.nodeValue
                            .replace(/\bConnections\b/g, "Friends")
                            .replace(/\bConnection\b/g, "Friend")
                            .replace(/Connect/g, "Friends");
                    }
                });
                return;
            }
            if (node.matches('h1.friends-title')) {
                let words = node.textContent.trim().split(/\s+/);
                let lastWord = words[words.length - 1];
                if (lastWord === "Connections") {
                    words[words.length - 1] = "Friends";
                    node.textContent = words.join(" ");
                } else if (lastWord === "Connection") {
                    words[words.length - 1] = "Friend";
                    node.textContent = words.join(" ");
                }
                return;
            }
            if (node.matches('h2.friends-subtitle')) {
                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        child.nodeValue = child.nodeValue
                            .replace(/\bConnections\b/g, "Friends")
                            .replace(/\bConnection\b/g, "Friend")
                            .replace(/Connect/g, "Friends");
                    } else if (child.nodeType === Node.ELEMENT_NODE && child.title) {
                        child.title = child.title
                            .replace(/\bConnections\b/g, "Friends")
                            .replace(/\bConnection\b/g, "Friend")
                            .replace(/Connect/g, "Friends");
                    }
                });
                return;
            }
            if (node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE) {
                node.childNodes[0].nodeValue = node.childNodes[0].nodeValue
                    .replace(/\bConnections\b/g, "Friends")
                    .replace(/\bConnection\b/g, "Friend")
                    .replace(/Connect/g, "Friends");
            } else {
                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        child.nodeValue = child.nodeValue
                            .replace(/\bConnections\b/g, "Friends")
                            .replace(/\bConnection\b/g, "Friend")
                            .replace(/Connect/g, "Friends");
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        if (child.title) {
                            child.title = child.title
                                .replace(/\bConnections\b/g, "Friends")
                                .replace(/\bConnection\b/g, "Friend")
                                .replace(/Connect/g, "Friends");
                        }
                        child.childNodes.forEach(grand => {
                            if (grand.nodeType === Node.TEXT_NODE) {
                                grand.nodeValue = grand.nodeValue
                                    .replace(/\bConnections\b/g, "Friends")
                                    .replace(/\bConnection\b/g, "Friend")
                                    .replace(/Connect/g, "Friends");
                            }
                        });
                    }
                });
            }
            if (node.title) {
                node.title = node.title
                    .replace(/\bConnections\b/g, "Friends")
                    .replace(/\bConnection\b/g, "Friend")
                    .replace(/Connect/g, "Friends");
            }
        });

        const specialSpans = root.querySelectorAll('span.font-header-2.dynamic-ellipsis-item');
        specialSpans.forEach(span => {
            if (span.textContent.includes("Connect")) {
                span.textContent = span.textContent.replace(/Connect/g, "Friends");
            }
            if (span.title && span.title.includes("Connect")) {
                span.title = span.title.replace(/Connect/g, "Friends");
            }
        });

        const profileHeaderDetails = root.querySelectorAll('div.profile-header-details');
        profileHeaderDetails.forEach(detailDiv => {
            const labels = detailDiv.querySelectorAll('span.profile-header-social-count-label');
            labels.forEach(label => {
                if (label.textContent.includes("Connections")) {
                    label.textContent = label.textContent.replace(/\bConnections\b/g, "Friends").replace(/\bConnection\b/g, "Friend");
                }
                if (label.title && label.title.includes("Connections")) {
                    label.title = label.title.replace(/\bConnections\b/g, "Friends").replace(/\bConnection\b/g, "Friend");
                }
            });
        });

        const textNodes = document.evaluate(
            ".//text()",
            root,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        for (let i = 0; i < textNodes.snapshotLength; i++) {
            const node = textNodes.snapshotItem(i);
            if (
                node.nodeType === Node.TEXT_NODE &&
                !isEditable(node) &&
                !isExcluded(node)
            ) {
                node.nodeValue = node.nodeValue.replace(/\bConnections\b/g, "Friends").replace(/\bConnection\b/g, "Friend");
            }
        }
        if (root instanceof Element || root === document) {
            replaceInputPlaceholdersAndValues(root);
        }
    }

    function run() {
        replaceTextNodes(document);

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        replaceTextNodes(node);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    if (window.location.hostname.endsWith("roblox.com")) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", run);
        } else {
            run();
        }
    }
})();