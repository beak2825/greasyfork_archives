// ==UserScript==
// @name         Save vertical space for Jira list
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Save vertical space for Jira list.
// @author       no_energy
// @match        https://*.atlassian.net/jira/**/list*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/499433/Save%20vertical%20space%20for%20Jira%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/499433/Save%20vertical%20space%20for%20Jira%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // del list title
    const mainDiv = document.getElementById('ak-main-content');
    const childNodes = mainDiv.querySelectorAll('*');
    const targetNode = Array.from(childNodes).find(node => node.textContent.trim() === 'List');
    if (targetNode && targetNode.parentNode) {
        targetNode.parentNode.parentNode.removeChild(targetNode.parentNode);
    }

    // del navigator bar
    var breadcrumbNav = document.querySelector('nav[aria-label="Breadcrumbs"]');
    breadcrumbNav.parentElement.parentElement.remove();

    // expand list
    var jwm_container = document.getElementById("jwm-container");
    var jwm_container_1 = jwm_container.parentNode;
    jwm_container_1.style.height = "100%";
    var jwm_container_2 = jwm_container_1.parentNode;
    jwm_container_2.style.height = 'calc(100vh - var(--topNavigationHeight))';
})();
