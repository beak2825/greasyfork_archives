// ==UserScript==
// @name         Real Estate Folder
// @namespace    https://github.com/ChenglongMa/tampermonkey-scripts
// @version      1.0.0
// @description  Hide the properties you don't like
// @author       Chenglong Ma
// @match        *://*.realestate.com.au/*
// @match        *://*.domain.com.au/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=realestate.com.au
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529675/Real%20Estate%20Folder.user.js
// @updateURL https://update.greasyfork.org/scripts/529675/Real%20Estate%20Folder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function encode(str) {
        return encodeURIComponent(str);
    }

    function escapeRegex(str) {
        return str.replace(/([.*+?^${}()|[\]\\])/g, '\\$1');
    }

    function getCookie(name) {
        const escapedName = escapeRegex(encode(name));
        const regex = new RegExp('(?:^|; )' + escapedName + '=([^;]*)');
        const match = document.cookie.match(regex);
        return match ? decodeURIComponent(match[1]) : null;
    }

    function setCookie(name, value, days) {
        const encodedName = encode(name);
        const encodedValue = encode(value);
        let cookieStr = `${encodedName}=${encodedValue}; path=/`;
        if (typeof days === 'number') {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            cookieStr += `; expires=${date.toUTCString()}`;
        }
        document.cookie = cookieStr;
    }

    function updateSummary(details, address, summary, defaultTitle) {
        summary.innerHTML = `<h2 style="cursor: pointer;" title="${address}">${details.open ? defaultTitle : address}</h2>`;
    }

    function getAddress(propertyNode, isRealEstate) {
        if (isRealEstate) {
            const addressSpan = propertyNode.querySelector('h2.residential-card__address-heading > a > span');
            return addressSpan ? addressSpan.textContent : null;
        } else {
            const addressWrapper = propertyNode.querySelector('h2[data-testid="address-wrapper"]');
            if (addressWrapper) {
                const line1 = addressWrapper.querySelector('span[data-testid="address-line1"]');
                const line2 = addressWrapper.querySelector('span[data-testid="address-line2"]');
                return line1 && line2
                    ? `${line1.textContent.trim()} ${line2.textContent.trim()}`
                    : null;
            }
        }
        return null;
    }


    function handleToggle(details, address, summary, defaultTitle) {
        details.removeEventListener('toggle', details._toggleListener);
        details._toggleListener = () => {
            const days = details.open ? -1 : 365;
            setCookie(address, details.open ? 'open' : 'closed', days);
            updateSummary(details, address, summary, defaultTitle);
        };
        details.addEventListener('toggle', details._toggleListener);
    }


    function wrapDivsInDetails() {
        const defaultTitle = 'Click here to hide this property';

        const isRealEstate = window.location.href.includes('realestate.com.au');
        const isDomain = window.location.href.includes('domain.com.au');
        if (!isRealEstate && !isDomain) return;

        const query = isRealEstate ? 'ul.tiered-results' : 'ul[data-testid="results"]';
        const lists = document.querySelectorAll(query);
        lists.forEach((list) => {
            const items = Array.from(list.children).filter(child => child.tagName === 'LI');
            items.forEach(item => {
                const propertyNode = item.firstElementChild;
                if (!propertyNode) return;

                const address = getAddress(propertyNode, isRealEstate);
                if (!address) return;

                const cookieValue = getCookie(address);
                if (propertyNode.tagName === 'DETAILS') {
                    const details = propertyNode;
                    details.open = cookieValue !== 'closed';
                    const summary = details.querySelector('summary');
                    if (summary) {
                        updateSummary(details, address, summary, defaultTitle);
                        handleToggle(details, address, summary, defaultTitle);
                    }
                    return;
                }
                const details = document.createElement('details');
                details.open = cookieValue !== 'closed';

                const summary = document.createElement('summary');
                updateSummary(details, address, summary, defaultTitle);
                details.appendChild(summary);

                item.insertBefore(details, propertyNode);
                details.appendChild(propertyNode);

                handleToggle(details, address, summary, defaultTitle);
            });
        });
    }

    wrapDivsInDetails();
    window.addEventListener('popstate', wrapDivsInDetails);

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
        originalPushState.apply(this, arguments);
        setTimeout(wrapDivsInDetails, 1000);
    };

    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        wrapDivsInDetails();
        setTimeout(wrapDivsInDetails, 1000);
    };
})();