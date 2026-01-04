// ==UserScript==
// @name         Fjern skidt fra ekstrabladet.dk
// @namespace    https://greasyfork.org/en/users/1453751-daath
// @version      1.6
// @description  Fjerner en masse ubrugeligt skidt fra ekstrabladet.dk som reklamer og betalt indhold
// @author       daath
// @match        https://ekstrabladet.dk/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531783/Fjern%20skidt%20fra%20ekstrabladetdk.user.js
// @updateURL https://update.greasyfork.org/scripts/531783/Fjern%20skidt%20fra%20ekstrabladetdk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeById(id) {
        const element = document.getElementById(id);
        // Check if the element exists before attempting to remove it
        if (element) {
            // Use the parentNode.removeChild() method for better compatibility
            element.parentNode.removeChild(element);
        }
    }

    function removeParentById(id) {
        const element = document.getElementById(id);
        if (element) element.parentElement.remove();
    }

    function removeByQuerySelect(selector) {
        document.querySelectorAll(selector).forEach(div => {
            div.remove();
        });
    }

    function removeParentByQuerySelect(selector) {
        document.querySelectorAll(selector).forEach(div => {
            const parentElement = div.parentElement;
            if (parentElement) parentElement.remove();
        });
    }

    function removeElements() {
        document.querySelectorAll('article.dre-item--feature-plus').forEach(article => {
            const parentDiv = article.parentElement;
            if (parentDiv) {
                parentDiv.remove();
            }
        });

        removeByQuerySelect('div[data-spcmngmtype="annonce"]');
        removeByQuerySelect('div[data-spcmngm="udvalgt_til_dig_front"]');
        removeByQuerySelect('div[data-spcmngm="udvalgt_til_dig3_front"]');
        removeByQuerySelect('div[data-spcmngm="dre-podcast"]');
        removeByQuerySelect('div[data-spcmngm="dre-nat1"]');

        [...document.getElementsByClassName('dre-item__chaser--badge-premium')].forEach(div => {
            div.parentElement.remove();
        });

        removeParentByQuerySelect('[id^=ebbanner_megaboard_dynamisk]');
        removeById("megaboardContainer");
        removeByQuerySelect('[id^=ebbanner_wrapper_megaboard_]');
        removeByQuerySelect('[id^=ebbanner_wrapper_monster]');
        removeById("ebbanner_megaboard_artikel");
        removeById("megaboard_container");
        removeById("ebbanner_wrapper_monster_bund");

        removeByQuerySelect("#fnTopnavigation > div.navmenu-inner > div:nth-child(1) > a.menu-item.menu-item--button.button.butto_n--primary.button--solid");
        removeByQuerySelect("#navigationPodcast");
    }

    // Ensure the DOM is fully loaded before running the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeObserver);
    } else {
        initializeObserver();
    }

    // Initialize the MutationObserver to watch for dynamic content changes
    function initializeObserver() {
        removeElements();
        const observer = new MutationObserver(removeElements);
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();