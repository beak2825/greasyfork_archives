// ==UserScript==
// @name         GitHub Collapse Project Columns
// @namespace    https://github.com/mestiez
// @version      1.3
// @description  makes project columns collapsible
// @author       mestiez
// @match        https://github.com/*/*/projects/*
// @grant        none
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/391999/GitHub%20Collapse%20Project%20Columns.user.js
// @updateURL https://update.greasyfork.org/scripts/391999/GitHub%20Collapse%20Project%20Columns.meta.js
// ==/UserScript==

var button = '<button type="button" class="float-right js-details-target btn-octicon p-1 tooltipped tooltipped-w hide-sm column-menu-item" aria-label="Collapse" aria-expanded="false"><svg class="octicon octicon-plus" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 2L0 8l6 6V2z"></path></svg></button>';
var titleStyle = "font-weight:600; font-size:14px!important;transform-origin:0 100%;transform: rotateZ(90deg) translate(-20px, 0);position:absolute;line-height:40px";
(function () {
    "use strict";

    const columns = document.getElementsByClassName("project-column");
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const details = column.getElementsByClassName("js-details-container")[0];
        const columnCards = column.getElementsByClassName("js-project-column-cards")[0];
        const automationFooter = column.getElementsByClassName("js-project-column-automation-footer")[0];
        const element = details.children[0];
        const newTitle = document.createElement("h4");
        newTitle.style = "display: none";
        newTitle.innerText = column.getElementsByClassName("js-project-column-name")[0].innerText;
        column.insertBefore(newTitle, column.firstChild);

        column.addEventListener("click", () => {
            column.style = "";
            columnCards.style = "";
            if (automationFooter) {automationFooter.style = "";}
            details.style = "";
            newTitle.style = "display: none";
            window.localStorage[column.dataset.id] = "expanded";
        });

        element.innerHTML += button;
        element.lastElementChild.addEventListener("click", (e) => {
            event.stopImmediatePropagation();
            columnCards.style = "filter: opacity(0%); pointer-events: none";
            if (automationFooter) {automationFooter.style = "display: none";}
            details.style = "display: none";
            newTitle.style = titleStyle;
            column.style = "max-width: 40px !important;min-width: 40px !important;white-space: nowrap !important; cursor: pointer !important;";
            window.localStorage[column.dataset.id] = "collapsed";
        });
        if (window.localStorage[column.dataset.id] === "collapsed") {
            element.lastElementChild.click();
        }
    }
})();
