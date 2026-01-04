// ==UserScript==
// @name            EpikChat Sidebar Toggler
// @namespace       dannysaurus.epik
// @version         0.0.1
// @license         MIT License
// @description     Allows toggling the sidebar on and off by clicking in the upper right corner.
//
// @match           https://www.epikchat.com/chat*
//
// @require         https://update.greasyfork.org/scripts/528456/1545566/UTILS_DOM%20Library.js
//
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/528581/EpikChat%20Sidebar%20Toggler.user.js
// @updateURL https://update.greasyfork.org/scripts/528581/EpikChat%20Sidebar%20Toggler.meta.js
// ==/UserScript==

/* jslint esversion: 11 */
/* global unsafeWindow */
(() => {
    'use strict';
    /** @module UTILS */
    const UTILS = (() => {
        const {
            trySelectElement,
            getUsername,
            areKeysPressed,
            selectors,
        } = unsafeWindow.dannysaurus_epik.libraries.UTILS_DOM;
        return {
            trySelectElement,
            areKeysPressed,
            selectors,
        };
    })();

    /** @module CONFIG */
    const CONFIG = (() => {
        const attributes = {
            dataTarget: 'data-target',
            dataLayout_sidebar: 'data-layout_sidebar',
        };
        const ids = {
            friends: 'friends',
            profileImg: 'profileImg',
        };
        const classNames = {
            active: 'active',
            tabPane: 'tab-pane',
        };
        const querySelectors = {
            profileImg: `#${ids.profileImg}`,
            sidebarSection: `.${UTILS.selectors.classNames.sidebarSection}`,
            sidebarTabPaneActive: `.${UTILS.selectors.classNames.sidebarSection} .${classNames.tabPane}.${classNames.active}`,
            sidebarTabPaneFriends: `#${ids.friends}`,
            sidebarTabPaneFriendsButton: `[${attributes.dataTarget}="#${ids.friends}"]`,
        };

        return {
            attributes,
            classNames,
            querySelectors,
        };
    })();

    const toggleSidebar = (parentContainer) => {
        const currentState = parentContainer.getAttribute(CONFIG.attributes.dataLayout_sidebar);
        parentContainer.setAttribute(CONFIG.attributes.dataLayout_sidebar, currentState === 'true' ? 'false' : 'true');
    };

    (async () => {
        const sidebarContainer = await UTILS.trySelectElement({ selectors: CONFIG.querySelectors.sidebarSection, });
        const profileImg = await UTILS.trySelectElement({ selectors: CONFIG.querySelectors.profileImg, });

        const button = document.createElement('button');
        button.textContent = 'SB';
        button.style.marginLeft = '10px';
        button.style.width = `${profileImg.clientHeight}px`;
        button.addEventListener('click', () => {
            toggleSidebar(sidebarContainer);
        });
        profileImg.parentNode.insertBefore(button, profileImg.nextSibling);

        // Change active tab to Friends tab
        const activeTab = document.querySelector(CONFIG.querySelectors.sidebarTabPaneActive);
        if (activeTab) {
            activeTab.classList.remove(CONFIG.classNames.active);
        }
        const friendsPane = document.querySelector(CONFIG.querySelectors.sidebarTabPaneFriends);
        if (friendsPane) {
            friendsPane.classList.add(CONFIG.classNames.active);
        }
        const friendsTab = document.querySelector(CONFIG.querySelectors.sidebarTabPaneFriendsButton);
        if (friendsTab) {
            friendsTab.classList.add(CONFIG.classNames.active);
        }

        console.log('Sidebar Toggle button added and Friends tab activated.');
    })();
})();
