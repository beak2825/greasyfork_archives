// ==UserScript==
// @name Disable editing Jira's task on click
// @license MIT
// @version 0.1
// @description Disable clicking on JIRA tasks to update description
// @match https://*.atlassian.net/*
// @namespace https://greasyfork.org/users/950499
// @downloadURL https://update.greasyfork.org/scripts/450131/Disable%20editing%20Jira%27s%20task%20on%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/450131/Disable%20editing%20Jira%27s%20task%20on%20click.meta.js
// ==/UserScript==

(function () {
    const onLoad = () => {
        const elements = [...document.querySelectorAll('.ak-renderer-document')];
 
        elements.map(
            el => el.addEventListener('click', () => {event.stopImmediatePropagation();}, true)
        );
 
    };
 
    document.addEventListener('DOMContentLoaded', onLoad, false);
    document.addEventListener("DOMNodeInserted", onLoad, false);
 
})();