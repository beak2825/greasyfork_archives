// ==UserScript==
// @name            [ALL] Links Open ALL in NEW BACKGROUND Tab
// @author
// @description     Open ALL links in NEW BACKGROUND tab.
// @downloadURL
// @grant           GM_openInTab
// @homepageURL     https://bitbucket.org/INSMODSCUM/userscripts-scripts/src
// @icon
// @include         http*://*
// @namespace       insmodscum 
// @require         https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @run-at          document-start
// @updateURL
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/20694/%5BALL%5D%20Links%20Open%20ALL%20in%20NEW%20BACKGROUND%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/20694/%5BALL%5D%20Links%20Open%20ALL%20in%20NEW%20BACKGROUND%20Tab.meta.js
// ==/UserScript==

// needs this in metadata:
// @require         https://greasyfork.org/scripts/12228/code/setMutationHandler.js

// source:
// https://greasyfork.org/en/scripts/12367-open-links-in-new-tab/code

attachHandler([].slice.call(document.getElementsByTagName('a')));

setMutationHandler(document, 'a', function(nodes) {
    attachHandler(nodes);
    return true;
});

function attachHandler(nodes) {
    nodes.forEach(function(node) {
        if (node.target != '_blank') {
            node.onclick = clickHandler;
            node.addEventListener('click', clickHandler);
        }
    });
}

function clickHandler(e) {
    if (e.button > 1)
        return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // GM_openInTab(this.href, e.button || e.ctrlKey);
    GM_openInTab(this.href, true);
}