// ==UserScript==
// @name         Discord Dark Background Modifier
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Applies dark background to various Discord UI elements
// @author       You
// @match        https://discord.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531538/Discord%20Dark%20Background%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/531538/Discord%20Dark%20Background%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DARK_BACKGROUND = '#343339';

    function applyDarkStyles() {
        // 1. Modify selected list items (original functionality)
        let listItems = document.querySelectorAll('.listItemWrapper__91816.selected__91816');
        listItems.forEach(listItem => {
            let wrapper = listItem.querySelector('.wrapper_cc5dd2');
            if (wrapper) {
                wrapper.querySelectorAll('*').forEach(child => {
                    child.style.opacity = "0";
                });
                wrapper.style.backgroundImage = "url(https://i.imgur.com/FTckCa9.png)";
                wrapper.style.zIndex = "9999";
                wrapper.style.borderRadius = "10px";
                wrapper.style.backgroundSize = "contain";
                wrapper.style.backgroundRepeat = "no-repeat";
                wrapper.style.backgroundPosition = "center";
            }
        });

        // 2. Modify members list background
        const membersList = document.querySelector('.members_c8ffbb.thin_d125d2.scrollerBase_d125d2.fade_d125d2');
        if (membersList) {
            membersList.style.background = DARK_BACKGROUND;
        }

        // 3. Modify user area panel background
        const userPanel = document.querySelector('section.panels_c48ade[aria-label="User area"]');
        if (userPanel) {
            userPanel.style.background = DARK_BACKGROUND;
        }

        // 4. Modify individual member items
        const memberItems = document.querySelectorAll('.member__5d473.container__91a9d.clickable__91a9d');
        memberItems.forEach(item => {
            item.style.background = DARK_BACKGROUND;
            const childContainer = item.querySelector('.childContainer__91a9d');
            if (childContainer) {
                childContainer.style.background = DARK_BACKGROUND;
            }
        });

        // 5. Modify user panel container
        const userPanelContainer = document.querySelector('.container__37e49');
        if (userPanelContainer) {
            userPanelContainer.style.background = DARK_BACKGROUND;
        }

        // 6. Modify server list container
        const serverListContainer = document.querySelector('.stack_dbd263.scroller_ef3116.none_d125d2.scrollerBase_d125d2');
        if (serverListContainer) {
            serverListContainer.style.background = DARK_BACKGROUND;
        }

        // 7. Modify server list items
        const serverListItems = document.querySelectorAll('.listItem__650eb');
        serverListItems.forEach(item => {
            item.style.background = DARK_BACKGROUND;
        });

        // 8. Modify server list wrappers
        const serverListWrappers = document.querySelectorAll('.wrapper_d144f8');
        serverListWrappers.forEach(wrapper => {
            wrapper.style.background = DARK_BACKGROUND;
        });

        // 9. Modify private channels navigation
        const privateChannelsNav = document.querySelector('.privateChannels__35e86');
        if (privateChannelsNav) {
            privateChannelsNav.style.background = DARK_BACKGROUND;
        }

        // 10. Modify private channels scroller
        const privateChannelsScroller = document.querySelector('.privateChannels__35e86 .scroller__99e7c');
        if (privateChannelsScroller) {
            privateChannelsScroller.style.background = DARK_BACKGROUND;
        }

        // 11. Modify private channel items
        const privateChannelItems = document.querySelectorAll('.channel__972a0.container_e45859');
        privateChannelItems.forEach(item => {
            item.style.background = DARK_BACKGROUND;
        });

        // 12. Modify friends button container
        const friendsButtonContainer = document.querySelector('.friendsButtonContainer__35e86');
        if (friendsButtonContainer) {
            friendsButtonContainer.style.background = DARK_BACKGROUND;
        }

        // 13. Modify section dividers
        const sectionDividers = document.querySelectorAll('.sectionDivider__35e86');
        sectionDividers.forEach(divider => {
            divider.style.background = DARK_BACKGROUND;
        });
    }

    // Wait for elements to exist
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector(selector)) {
                obs.disconnect();
                callback();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Observe changes in Discord UI
    const observer = new MutationObserver(applyDarkStyles);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    applyDarkStyles();
})();