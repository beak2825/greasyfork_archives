// ==UserScript==
// @name			GitHubSourceTreeLink
// @namespace		https://github.com/cunneen
// @version			1.0.0
// @description		Adds a "Clone in SourceTree" link to github pages. Based on jamesgarfield/GitHubSourceTree.
// @respository		https://github.com/cunneen/GitHubSourceTreeLink
// @match			https://github.com/*
// @match			https://*.github.com/*
// @grant			none
// @license			MIT
// @copyright		2025, Mike Cunneen
// @run-at			document-idle
// @homepageURL		https://github.com/cunneen/GitHubSourceTreeLink
// @supportURL		https://github.com/cunneen/GitHubSourceTreeLink/issues
// @downloadURL https://update.greasyfork.org/scripts/544172/GitHubSourceTreeLink.user.js
// @updateURL https://update.greasyfork.org/scripts/544172/GitHubSourceTreeLink.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
//Firefox/GreaseMonkey apppears to not like IIFEs, so use of a named function is required
ghst();
function ghst(){
    const $ = document.querySelectorAll.bind(document);

    //Defining constants
    const sourceTreeUrlPrefix = "x-github-client://openRepo/";
    //GitHub's "Code" dropdown Button
    const gitHubNode = $("react-partial[partial-name='repos-overview'] button[aria-haspopup=true][aria-describedBy$='-loading-announcement'][data-variant='primary']")[0];
    //This is the node before which we're going to insert the new button
    const insertBeforeNode = document.querySelector(".Layout-sidebar > div > div:first-child h2");
    const parentNode = insertBeforeNode.parentNode;


    const sourceTreeNode = document.createElement("a");
    const cloneURL = getSelectedCloneUrl();
    sourceTreeNode.href = sourceTreeUrlPrefix + cloneURL;
    sourceTreeNode.innerHTML = '<span class="octicon octicon-device-desktop"></span>&nbsp;Clone in SourceTree';

    parentNode.insertBefore(sourceTreeNode, insertBeforeNode);

    //Function returns currently selected clone url
    function getSelectedCloneUrl() {
      const reposOverview = JSON.parse(document.body.querySelectorAll('[partial-name="repos-overview"] [data-target="react-partial.embeddedData"][type="application/json"]')[0].textContent) ;

      return reposOverview?.props?.initialPayload?.overview?.codeButton?.local?.protocolInfo?.httpUrl ;
    }
}

