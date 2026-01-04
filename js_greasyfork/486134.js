// ==UserScript==
// @name         ECOD-GitLab2Jira
// @namespace    ecod.gitlab.utils
// @version      2.1.4
// @description  Gitlab Merge request title check + Links back to Jira based on ECOD-XXXX formats
// @author       CRK
// @match        https://gitlab.ecodesigncloud.com/ecodesign*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486134/ECOD-GitLab2Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/486134/ECOD-GitLab2Jira.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hookTheMonkeyForGitLab() {
	function getGitLabUrl(node){
		let baseUrl = 'https://jira.fsc.atos-services.net/browse/';
		let ecodRegex = /(ecod[ -_]?\d+)\|(ecod[ -_]?\d+)|(ecod[ -_]?\d+)|(\/\d+)/i;
		let result = ecodRegex.test(node.innerHTML);
		if(result){
			let matches = ecodRegex.exec(node.innerHTML);
            let id = undefined;
            let parentId = undefined;
            //simple regex, no parentId
            if(matches[0]?.trim() === matches[3]?.trim())
            {
                id = matches[0]?.trim();
            } else {
                id = matches[2]?.trim();
                parentId = matches[1]?.trim();
            }
            //console.log(matches);
			return {
                issueUrl: id ? baseUrl + (id.charAt(0) === '/' ? "ECOD-" + id.replace('/', '') : id.replace(' ', '-').replace('_', '-')) : undefined,
                issueButton: id ? id.toUpperCase() : undefined,
                parentUrl: parentId ? baseUrl + (id.charAt(0) === '/' ? "ECOD-" + parentId.replace('/', '') : parentId.replace(' ', '-').replace('_', '-')) : undefined,
                parentButton: parentId ? parentId.toUpperCase() : undefined,
            };
		} else {
            //try as alternative to check the branch name for ID
            let branchNameElement = node.parentNode.parentNode.parentNode.querySelector("button[data-clipboard-text]");
            if(branchNameElement){
                let branchName = branchNameElement.attributes['data-clipboard-text'].value ?? '';

                let result = ecodRegex.test(branchName);
                if(result){
                    let matches = ecodRegex.exec(branchName);
                    let id = matches[0].trim();
                    return {
                        issueUrl : baseUrl + (id.charAt(0) === '/' ? "ECOD-" + id.replace('/', '') : id.replace(' ', '-').replace('_', '-')),
                        issueButton: id.toUpperCase(),
                    };
                }
            }
        }
		return false;
		//window.open(baseUrl + result, '_blank');
	}

    function checkTitle(node){
		let ecodRegex = /(fix|feat)\(ecod[ -_]?\d+(\|ecod[ -_]?\d+)?\): .+/i;
		let result = ecodRegex.test(node.innerHTML);
		return result;
	}

	var linkGitLab = document.createElement('span');
	linkGitLab.setAttribute("style" ,"cursor:pointer;");
	linkGitLab.innerHTML = `<a href='#' class='gl-button btn btn-md btn-default js-issuable-edit'
								   target='_blank'
								   style='background-color: #be06e4; color:white;'
								   id='linkgit'
                                   title='Go to JIRA issue'
								   name='linkgit'>JIRA</a>`;

    var linkGitLabParent = document.createElement('span');
	linkGitLabParent.setAttribute("style" ,"cursor:pointer;");
	linkGitLabParent.innerHTML = `<a href='#' class='gl-button btn btn-md btn-default js-issuable-edit'
								   target='_blank'
								   style='background-color: black; color:white;'
								   id='linkgit'
                                   title='Go to JIRA parent issue'
								   name='linkgit'>Parent</a>`;

    var titleWarning = document.createElement('span');
	titleWarning.setAttribute("style" ,"cursor:help;");
	titleWarning.innerHTML = `<span
								   style='color:red; display: inline; padding-left: 10px; padding-right: 10px; font-size: 22px;'
								   id='titleWarning'
                                   name='titleWarning'
                                   title='Merge Request title is Non-Standard. Make sure you use the Jira "Merge" button to copy the standard MR name convention. Ex: fix(ecod-1234): exact Jira title'
								   >&#9888;</span>`;

    var titleOk = document.createElement('span');
	titleOk.setAttribute("style" ,"cursor:help;");
	titleOk.innerHTML = `<span
								   style='color: #00ff00; display: inline; padding-left: 10px; padding-right: 10px; font-size: 22px;'
								   id='titleWarning'
                                   name='titleWarning'
                                   title='Merge Request title is Standard-OK'
								   >&#x1F5F9;</span>`;

     var shareLinkButton = document.createElement('span');
     shareLinkButton.innerHTML = `<span
                                   class='gl-button btn btn-md btn-default js-issuable-edit'
                                   style='cursor:pointer; background-color: #0f7700; margin-left: 10px;'
                                   name='shareLink'
                                   id='shareLink'
                                   onclick='navigator.clipboard.writeText(window.location.href);'
                                   title='Sharable link'>🔗</span>`;

	let node= document.querySelector('h1[data-testid="title-content"]')
	if(!node) node = document.querySelector('h3[class="commit-title"]')
	if(node) {
		let url = getGitLabUrl(node);

		if(url && url.issueUrl){
			let divContainer = document.createElement('div');

            linkGitLab.firstChild.href = url.issueUrl;
            if(url.issueButton) linkGitLab.firstChild.innerHTML = url.issueButton;

            linkGitLabParent.firstChild.href = url.parentUrl
            if(url?.parentButton) linkGitLabParent.firstChild.innerHTML = url.parentButton;

            divContainer.appendChild(checkTitle(node) ? titleOk : titleWarning);
			divContainer.appendChild(linkGitLab);
            if(url.parentUrl) divContainer.appendChild(linkGitLabParent);
            divContainer.appendChild(shareLinkButton);
			divContainer.setAttribute("style", "margin-top:10px; display: inline");

			node.appendChild(divContainer);
		}
	}
}
    hookTheMonkeyForGitLab()
})();