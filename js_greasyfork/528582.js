// ==UserScript==
// @name            EpikChat Enable Modal Action Items
// @namespace       dannysaurus.epik
// @version         0.1
// @description     Enable disabled action items in the user action modal on EpikChat
// @license         MIT License
//
// @match           https://www.epikchat.com/chat*
//
// @require         https://update.greasyfork.org/scripts/528456/1545566/UTILS_DOM%20Library.js
// 
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/528582/EpikChat%20Enable%20Modal%20Action%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/528582/EpikChat%20Enable%20Modal%20Action%20Items.meta.js
// ==/UserScript==

/* jslint esversion: 11 */
/* global unsafeWindow */
(async () => {
    'use strict';
    /**´ @module UTILS */
    const UTILS = (() => {
        const {
            trySelectElement,
            getUsername,
            areKeysPressed,
            selectors,
        } = unsafeWindow.dannysaurus_epik.libraries.UTILS_DOM;
        return {
            trySelectElement,
            getUsername,
            selectors,
        };
    })();

    /** @module CONFIG */
    const CONFIG = (() => {
        const ids = {
            userActionModal: 'user_action_modal',
            username: UTILS.selectors.ids.username,
        };
        const classNames = {
            disableUlitemMenu: 'disableUlitemMenu',
            modal: 'modal',
            fade: 'fade',
            in: 'in',
            secondaryactions: 'secondaryactions',
        };
        const attributes = {};

        const selectors = {
            disableUlitemMenu: `.${classNames.disableUlitemMenu}`,
            modalFadedIn: `.${classNames.modal}.${classNames.fade}.${classNames.in}`,
            secondaryactions: `.${classNames.secondaryactions}`,
        };

        const delays = {};

        return {
            ids,
            classNames,
            attributes,
            selectors,
            delays,
        };
    })();

    let modalContainer = await UTILS.trySelectElement({ selectors: `#${CONFIG.ids.userActionModal}` });
    console.log("EpikChat Enable Modal Action Items - running");

    const enableModalMenuItems = () => {

        const disableUlitemList = modalContainer.querySelectorAll(CONFIG.selectors.disableUlitemMenu);
        disableUlitemList.forEach(disableUlitemMenu => {
            disableUlitemMenu.classList.remove(CONFIG.classNames.disableUlitemMenu);
        });

        const secondaryActionList = modalContainer.querySelectorAll(CONFIG.selectors.secondaryactions);
        secondaryActionList.forEach(secondaryAction => {
            const hiddenChildren = Array.from(secondaryAction.children).filter(child => child.style.display === 'none');
            hiddenChildren.forEach(hiddenChild => {
                hiddenChild.style.display = 'block';
            });
        });
    };

    const observer = new MutationObserver((mutationsList) => {
        if (!modalContainer.querySelector(`a[href$='/${UTILS.getUsername()}']`)) {
            return;
        }

        if (mutationsList
            .filter(mutation => mutation.type === 'attributes')
            .filter(mutation => mutation.attributeName === 'class')
            .some(mutation => mutation.target.matches(CONFIG.selectors.modalFadedIn))) {

            enableModalMenuItems();
        }
    });
    observer.observe(modalContainer, {
        attributes: true,
        attributeFilter: ['class'],
    });
})();