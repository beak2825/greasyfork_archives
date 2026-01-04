// ==UserScript==
// @name         Order ID passenger
// @match        https://podval.console3.com/podval/user/*
// @grant          none
// @version      2023.1.1
// @author       Ahmed Esslaoui
// @description  Created for internal use only, Created by Ahmed.
// @created      2023-04-11
// @icon         https://indriver.com/upload/watchdocs/documents/3148693/8mk65yycyn6hjakq.jpg
// @namespace https://greasyfork.org/users/807598
// @downloadURL https://update.greasyfork.org/scripts/463776/Order%20ID%20passenger.user.js
// @updateURL https://update.greasyfork.org/scripts/463776/Order%20ID%20passenger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createHyperlink(element, urlTemplate) {
        const value = element.textContent;
        const url = urlTemplate.replace('%s', value);

        const link = document.createElement('a');
        link.href = url;
        link.textContent = value;
        link.target = '_blank';
        link.style.textDecoration = "underline";
        link.style.cursor = "pointer";

        element.innerHTML = '';
        element.appendChild(link);
    }

    function changeElementToHyperlink(xpath, urlTemplate) {
        const xpathResult = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const element = xpathResult.singleNodeValue;

        if (element) {
            createHyperlink(element, urlTemplate);
        }
    }

    const xpath = '//*[@id="yw1"]/tbody/tr[4]/td';
    const urlTemplate = 'https://podval.console3.com/podval/user/view?id=%s';

    changeElementToHyperlink(xpath, urlTemplate);
})();
