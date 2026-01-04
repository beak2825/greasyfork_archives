// ==UserScript==
// @name         Open Workflow for current Issue
// @namespace    http://schuppentier.org/
// @version      0.2
// @description  Looks up the workflow for the currently opened Issue and opens it in a new tab
// @author       Dennis Stengele
// @match        https://*.atlassian.net/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @run-at       context-menu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464398/Open%20Workflow%20for%20current%20Issue.user.js
// @updateURL https://update.greasyfork.org/scripts/464398/Open%20Workflow%20for%20current%20Issue.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function() {
    'use strict';

    let issuekey = location.pathname.split("/").pop(); // This SHOULD be done with JIRA.Issue.getIssueKey(), but this seems to always return null in Cloud.
    let projectKey = issuekey.split("-")[0];
    let baseUrl = location.origin;

    let issueTypeId = await fetch(`${baseUrl}/rest/api/3/issue/${issuekey}`).then(
        response => { return response.json(); }
    ).then(
        json => { return json.fields.issuetype.id; }
    );

    let projectId = await fetch(`${baseUrl}/rest/api/3/project/${projectKey}`).then(
        response => { return response.json(); }
    ).then(
        json => { return json.id; }
    );

    let workflowName = await fetch(`${baseUrl}/rest/api/3/workflowscheme/project?${new URLSearchParams({ projectId: projectId })}`).then(
        response => { return response.json(); }
    ).then(
        json => { return json.values[0].workflowScheme.issueTypeMappings[issueTypeId] ?? json.values[0].workflowScheme.defaultWorkflow; }
    );

    let encodedWorkflowName = encodeURIComponent(workflowName);

    window.open(`${baseUrl}/secure/admin/workflows/ViewWorkflowSteps.jspa?workflowMode=live&workflowName=${encodedWorkflowName}`, "_blank");
})();