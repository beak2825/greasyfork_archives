// ==UserScript==
// @name         Dynamic Hyperlink by Ahmed /Watch
// @match        https://podval.console3.com/podval/user/*
// @grant        none
// @version      2024.2.0
// @author       Ahmed Esslaoui
// @description  Created for internal use only, Created by Ahmed.
// @created      2023-04-06
// @icon         https://indriver.com/upload/watchdocs/documents/3148693/8mk65yycyn6hjakq.jpg
// @namespace    https://greasyfork.org/users/807598
// @downloadURL https://update.greasyfork.org/scripts/463596/Dynamic%20Hyperlink%20by%20Ahmed%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/463596/Dynamic%20Hyperlink%20by%20Ahmed%20Watch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const xpath = "//*[@id='content']/div/div[2]/a";
    const linkTemplate1 = "https://watchdocs.prod.euce1.aws.indrive.tech/hq/requests?UserRequestSearchModer%5Bcity_id%5D=&UserRequestSearchModer%5Btransport_id%5D=&UserRequestSearchModer%5Bservice_id%5D=&UserRequestSearchModer%5Buser_id%5D=%s&UserRequestSearchModer%5Bphone%5D=&UserRequestSearchModer%5Bstate%5D=&UserRequestSearchModer%5Brecruited%5D=&UserRequestSearchModer%5Btype%5D=0";
    const linkTemplate2 = "https://watchdocs.prod.euce1.aws.indrive.tech/hq/requests?UserRequestSearchModer%5Bcity_id%5D=&UserRequestSearchModer%5Btransport_id%5D=&UserRequestSearchModer%5Bservice_id%5D=&UserRequestSearchModer%5Buser_id%5D=%s&UserRequestSearchModer%5Bphone%5D=&UserRequestSearchModer%5Bfirst_name%5D=&UserRequestSearchModer%5Blast_name%5D=&UserRequestSearchModer%5Bstate%5D=&UserRequestSearchModer%5Brecruited%5D=&UserRequestSearchModer%5Btype%5D=10";
    const linkTemplate3 = "https://cherdak.console3.com/global/user-services/users/%s";
    const linkTemplate4 = "https://cherdak.console3.com/mena/new-order/users/%s";

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function createHyperlink(element, link) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            const value = element.textContent;
            const url = link.replace('%s', value);
            window.open(url, '_blank');
        });
    }

    function duplicateElement(element, labelText) {
        const clone = element.cloneNode(true);
        clone.setAttribute('data-custom', 'duplicate');
        const container = document.createElement('div');
        const label = document.createElement('span');
        label.textContent = `${labelText}: `;
        container.appendChild(label);
        container.appendChild(clone);
        element.parentNode.insertBefore(container, element.nextSibling);
        return clone;
    }

    const element1 = getElementByXpath(xpath);

    if (element1) {
        createHyperlink(element1, linkTemplate1);
        const element2 = duplicateElement(element1, 'Transport change');
        createHyperlink(element2, linkTemplate2);
        const element3 = duplicateElement(element1, 'User Service Cherdak');
        createHyperlink(element3, linkTemplate3);
        const element4 = duplicateElement(element1, 'New Order profile');
        createHyperlink(element4, linkTemplate4);
    } else {
        console.error('Element not found');
    }

})();
