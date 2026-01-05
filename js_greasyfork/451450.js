// ==UserScript==
// @name         Create Gitlab Branch
// @namespace    http://www.cochlear.com/
// @version      0.5
// @description  Add a button to Jira issues to create a branch (named after the issue id) in Gitlab, if it doesn't already exist.
// @author       Scott Sedgwick
// @license      MIT
// @match        https://cltd-jira.cochlear.com/browse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451450/Create%20Gitlab%20Branch.user.js
// @updateURL https://update.greasyfork.org/scripts/451450/Create%20Gitlab%20Branch.meta.js
// ==/UserScript==

// Uploaded to https://greasyfork.org/en/scripts/451450-create-gitlab-branch

(async function() {
    'use strict';
    const BASE_URI = "https://gitlab.cochlear.dev/api/v4/";
    const TOKEN = "glpat-xFyiWGN46Pv_MoyG9Z_Q";

    async function gitlabGet(path) {
        const response = await GM.xmlHttpRequest({
            method: "GET",
            url: BASE_URI + path,
            headers: { "PRIVATE-TOKEN": TOKEN }
        });
        return JSON.parse(response.responseText);
    }

    async function getProjectId(projectName) {
        const ps = await gitlabGet("projects");
        const p = ps.filter(function(value) { return (value.name == projectName); })[0];
        if (p) {
            return p.id;
        } else {
            return false;
        }
    }

    async function getBranchExists(projectName, branchName) {
        const pid = await getProjectId(projectName);
        if (pid) {
            const bs = await gitlabGet("projects/" + pid + "/repository/branches");
            if (bs && bs != []) {
                if (bs.filter(function(value) { return (value.name == branchName); })[0]) {
                    return true;
                }
            }
        }
        return false;
    }

    let browsePath = "//div[@id='viewissue-devstatus-panel']/div[@class='mod-content']";
    let browseDiv = document.evaluate(browsePath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (browseDiv) {
        let project = document.getElementById('project-name-val').href.split('/').at(-1);
        let issue = document.getElementById('key-val').innerText;
        const branchExists = await getBranchExists(project, issue);

        if (branchExists) {
            const gitlabText = document.createElement('p');
            gitlabText.innerHTML = 'Branch already exists in Gitlab';
            browseDiv.appendChild(gitlabText);
        } else {
            let nburi = 'https://gitlab.cochlear.dev/next-gen-fitting/' + project + '/-/branches/new?branch_name=' + issue;
            const gitlabLink = document.createElement('a');
            gitlabLink.setAttribute('href', nburi);
            gitlabLink.innerHTML = 'Create branch in Gitlab';
            browseDiv.appendChild(gitlabLink);
        }
    } else {
        console.log("Position to insert not found");
    }
})();