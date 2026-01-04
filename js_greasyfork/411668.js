// ==UserScript==
// @name         ServiceNow - Show Workflow Contexts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add Related Link to go to Workflow Context for current record
// @author       Ricardo Constantino <ricardo.constantino@fruitionpartners.pt>
// @match        https://*.service-now.com/*.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411668/ServiceNow%20-%20Show%20Workflow%20Contexts.user.js
// @updateURL https://update.greasyfork.org/scripts/411668/ServiceNow%20-%20Show%20Workflow%20Contexts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof g_form === 'undefined') return;

    var relatedLinksContainer = document.querySelector('ul.related_links_container');
    if (!relatedLinksContainer || relatedLinksContainer.children.length < 1) return;

    //var versionsElement = relatedLinksContainer.children[0].cloneNode(true);
    let versionsElement = document.createElement('li');
    let linkElement = document.createElement('a');
    linkElement.href = '/wf_context.do?sysparm_query=id=' + g_form.getUniqueValue();
    linkElement.textContent = 'Show Workflow Contexts';
    linkElement.addClassName('navigation_link');
    versionsElement.appendChild(linkElement);
    relatedLinksContainer.insertAdjacentElement('afterbegin', versionsElement);
})();
