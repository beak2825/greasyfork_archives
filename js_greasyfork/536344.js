// ==UserScript==
// @name         ServiceNow - Show Workflow / Flow Context in Catalog Task
// @version      0.0.1
// @description  Simulate the "Show Workflow" or "Flow Context" UI Action in Catalog Task
// @author       Matteo Lecca
// @match        *.service-now.com*/sc_task.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/users/1246673
// @downloadURL https://update.greasyfork.org/scripts/536344/ServiceNow%20-%20Show%20Workflow%20%20Flow%20Context%20in%20Catalog%20Task.user.js
// @updateURL https://update.greasyfork.org/scripts/536344/ServiceNow%20-%20Show%20Workflow%20%20Flow%20Context%20in%20Catalog%20Task.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof g_form === 'undefined') return;
    if (g_form.isNewRecord()) return;
    if (!g_form.getValue('request_item')) return;

    g_form.getReference('request_item', function(request){
        if (!request.context && !request.flow_context) return;

        let relatedLinksContainer = document.querySelector('.related_links_container');
        if (!relatedLinksContainer)
            relatedLinksContainer = document.querySelector('.form_action_button_container');
        if (relatedLinksContainer) {
            relatedLinksContainer = relatedLinksContainer.parentElement;
        }
        else return;

        let contextURL = '';

        if (request.context) {
            let workflowURL = new GlideURL('/context_workflow.do');
            workflowURL.addParam('sysparm_stack', 'no');
            workflowURL.addParam('sysparm_table', 'sc_req_item');
            workflowURL.addParam('sysparm_document', request.sys_id);
            contextURL = workflowURL.getURL();
        } else if (request.flow_context) {
            let flowURL = new GlideURL('/catalog_flow_context.do');
            flowURL.addParam('sysparm_sys_id', request.sys_id);
            flowURL.addParam('sysparm_ck', g_form.getValue('sysparm_ck'));
            contextURL = flowURL.getURL();
        }

        if (!contextURL) return;

        let showLink = document.createElement('a');
        showLink.href = '#';
        showLink.className = 'navigation_link action_context default-focus-outline';
        showLink.title = '[WK - SN] Simulate the "Show Workflow" or "Flow Context" UI Action';
        showLink.textContent = '[WK - SN] View Diagram Context';
        showLink.addEventListener('click', () => g_navigation.open(contextURL, '_blank'));
        relatedLinksContainer.appendChild(showLink);

    });
})();