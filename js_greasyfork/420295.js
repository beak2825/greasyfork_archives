// ==UserScript==
// @name         FAB.com Additional Asset Filters
// @namespace    https://github.com/Drakmyth/tampermonkey-userscripts
// @version      0.2
// @author       Drakmyth
// @description  A Tampermonkey userscript to add additional asset filters to FAB.com (formerly the Unreal Engine Marketplace)
// @homepage     https://github.com/Drakmyth/tampermonkey-userscripts
// @supportURL   https://github.com/Drakmyth/tampermonkey-userscripts/issues?q=is%3Aopen+is%3Aissue+label%3Aue-marketplace-filters
// @license      MIT
// @match        https://www.fab.com/search*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420295/FABcom%20Additional%20Asset%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/420295/FABcom%20Additional%20Asset%20Filters.meta.js
// ==/UserScript==

(function() {
    `use strict`;

    var hideOwned = false;

    function doControlsExist() {
        var sortContainer = getSortContainer();
        return sortContainer.querySelector(`.tmnky-custom-control`);
    }

    function addControls() {
        var hideOwnedCheckbox = createCheckbox(`Hide Owned Assets`, hideOwned, toggleHideOwned);

        var sortContainer = getSortContainer();
        var onSaleCheckbox = sortContainer.querySelector(`:nth-child(4)`)

        if (onSaleCheckbox && onSaleCheckbox.parentElement === sortContainer) {
            sortContainer.insertBefore(hideOwnedCheckbox, onSaleCheckbox);
        }
    }

    function getSortContainer() {
        return document.getElementsByClassName(`fabkit-Surface-root`)[0].childNodes[0];
    }

    function createCheckbox(text, initial, onChange) {
        var checkboxAccordionHeaderContainer = document.createElement(`h2`);
        checkboxAccordionHeaderContainer.className = `fabkit-Accordion-headerContainer tmnky-custom-control`;

        var checkboxAccordionHeader = document.createElement(`label`);
        checkboxAccordionHeader.className = `fabkit-Accordion-header`;
        var textElement = document.createTextNode(text);
        checkboxAccordionHeader.appendChild(textElement);
        checkboxAccordionHeaderContainer.appendChild(checkboxAccordionHeader);

        var checkboxAccordionHeaderRight = document.createElement(`div`);
        checkboxAccordionHeaderRight.className = `fabkit-Accordion-headerRight`;
        checkboxAccordionHeader.appendChild(checkboxAccordionHeaderRight);

        var checkboxSwitchRoot = document.createElement(`div`);
        checkboxSwitchRoot.className = `fabkit-Switch-root fabkit-Switch--sm`;
        checkboxAccordionHeaderRight.appendChild(checkboxSwitchRoot)

        var checkboxElement = document.createElement(`input`);
        checkboxElement.type = `checkbox`;
        checkboxElement.className = `input`;
        checkboxElement.checked = initial;
        checkboxElement.addEventListener(`change`, onChange);
        checkboxSwitchRoot.appendChild(checkboxElement);

        var checkboxSwitchWrapperElement = document.createElement(`div`);
        checkboxSwitchWrapperElement.className = `fabkit-Switch-wrapper`;
        checkboxSwitchRoot.appendChild(checkboxSwitchWrapperElement);

        var checkboxSwitchHandle = document.createElement(`div`);
        checkboxSwitchHandle.className = `fabkit-Switch-handle`;
        checkboxSwitchWrapperElement.appendChild(checkboxSwitchHandle);

        return checkboxAccordionHeaderContainer;
    }

    function getAssetContainers() {
        return document.querySelectorAll(`.fabkit-ResultGrid-root>li`);
    }

    function toggleHideOwned(event) {
        hideOwned = event.target.checked;
        onBodyChange();
    }

    function isContainerOwned(container) {
        var ownedLabel = container.querySelector(`div>div:nth-child(2)>div:nth-child(2)`);
        return ownedLabel.innerText === `Owned`;
    }

    function onBodyChange(mut) {

        if (!doControlsExist()) {
            addControls();
        }

        var assetContainers = getAssetContainers();

        for (let container of assetContainers) {
            var isOwned = isContainerOwned(container);
            if (hideOwned && isOwned) {
                container.style.display = `none`;
            } else {
                container.style.display = null;
            }
        }
    }

    var mo = new MutationObserver(onBodyChange);
    mo.observe(document.body, {childList: true, subtree: true});
})();
