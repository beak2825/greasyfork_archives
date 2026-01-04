// ==UserScript==
// @name         ServiceNow - Add "Go to Versions" and "Show File Properties" related links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add useful shortcuts to Update Versions and File Properties of current Customer Update
// @author       Ricardo Constantino <ricardo.constantino@fruitionpartners.pt>
// @match        https://*.service-now.com/sys_update_xml.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411669/ServiceNow%20-%20Add%20%22Go%20to%20Versions%22%20and%20%22Show%20File%20Properties%22%20related%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/411669/ServiceNow%20-%20Add%20%22Go%20to%20Versions%22%20and%20%22Show%20File%20Properties%22%20related%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof g_form === 'undefined') return;
    let relatedLinksContainer = document.querySelector('ul.related_links_container');
    if (!relatedLinksContainer || relatedLinksContainer.children.length < 1) return;

    [
        {
            title: 'Go To Versions',
            href: '/sys_update_version_list.do?sysparm_query=name=' + g_form.getValue('name')
        }, {
            title: 'Show File Properties',
            href: '/sys_metadata.do?sysparm_ignore_class=true&sysparm_query=sys_update_name=' + g_form.getValue('name')
        }
    ].forEach(link => {
        let containerElement = document.createElement('li');
        let linkElement = document.createElement('a');
        linkElement.href = link.href;
        linkElement.textContent = link.title;
        linkElement.addClassName('navigation_link');
        containerElement.appendChild(linkElement);
        relatedLinksContainer.insertAdjacentElement('afterbegin', containerElement);
    });
})();