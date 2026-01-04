// ==UserScript==
// @name         Copy Branch Name Button
// @namespace    http://forcam.com
// @version      0.1
// @description  Copy branch name button added to Azure DevOps
// @author       Dirk Kirsten, dirk.kirsten@forcam.com
// @match        https://dev.azure.com/*/*/_git/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416638/Copy%20Branch%20Name%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/416638/Copy%20Branch%20Name%20Button.meta.js
// ==/UserScript==

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function copyBranch(node) {
    navigator.clipboard.writeText(node.textContent);
}

function addCopyBranchButton(node) {
        var button = document.createElement("button");
        button.setAttribute('type', 'button');
        button.className = 'bolt-button bolt-icon-button enabled subtle icon-only bolt-focus-treatment';
        button.style = 'padding: 0 8px 0 8px;';
        var span = document.createElement("span");
        span.className = 'left-icon flex-noshrink fabric-icon ms-Icon--Copy medium';
        button.appendChild(span);
        button.onclick = function(e) {
            copyBranch(node);
            e.stopPropagation();
            e.preventDefault();
        };
        insertAfter(button, node);
};

function addForAll(el, query) {
    let matches = el.querySelectorAll(query);
    let i = 0;
    for(i = 0; i < matches.length; i++ ) {
        let match = matches[i];
        addCopyBranchButton(match);
    }
};

function doWatch(watchQuery, query) {
    let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
            if (!mutation.addedNodes) return;

            for (let i = 0; i < mutation.addedNodes.length; i++) {
                let node = mutation.addedNodes[i];
                addForAll(node, query);
            }
        })
    });

    let el = document.querySelector(watchQuery);

    if (el !== null) {
        observer.observe(el, {
            childList: true, subtree: true, attributes: false, characterData: false
        });
    }
}

(function() {
    'use strict';

    doWatch('.bolt-portal-host', '.ms-Icon--OpenSource + span');
    doWatch('.pushes-view-version-dropdown', '.version-dropdown button');
    setTimeout(function() {
        addForAll(document, '.pr-header-branches a');
        addForAll(document, 'span.ms-Icon--OpenSource + a');
        addForAll(document, '.version-dropdown button');
    }, 200);
})();