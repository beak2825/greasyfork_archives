// ==UserScript==
// @name         Restore Revision Time Visual Text in Google Apps
// @version      1.2
// @description  Brings back visual last edit text in drive apps due to M3 migration by Google.
// @author       ZachTheDev
// @match        https://docs.google.com/document*
// @match        https://docs.google.com/presentation*
// @match        https://docs.google.com/spreadsheets*
// @namespace https://greasyfork.org/users/1038934
// @downloadURL https://update.greasyfork.org/scripts/462286/Restore%20Revision%20Time%20Visual%20Text%20in%20Google%20Apps.user.js
// @updateURL https://update.greasyfork.org/scripts/462286/Restore%20Revision%20Time%20Visual%20Text%20in%20Google%20Apps.meta.js
// ==/UserScript==

(function() {
    function addBackRevisionVisualText() {
        const escapeHTMLPolicy = trustedTypes.createPolicy("use-raw-string", {
            createHTML: (string) => string,
        });
        const revisionButtonElement = document.getElementById("docs-revisions-appbarbutton");
        var revisionTextFromButton = revisionButtonElement.getAttribute("data-tooltip");
        const menubarElement = document.getElementById("docs-menubar");
        const revisionVisualTextHTML = "<div id=\"revisionVisualText\" class=\"menu-button goog-control goog-inline-block\" role=\"menuitem\" style=\"background-color: transparent;text-decoration: underline;\" data-tooltip=\"Open version history\"></div>";
        const rangeForRevisionVisualTextHTML = document.createRange();
        const fragmentForRevisionVisualTextHTML = rangeForRevisionVisualTextHTML.createContextualFragment(escapeHTMLPolicy.createHTML(revisionVisualTextHTML));
        menubarElement.appendChild(fragmentForRevisionVisualTextHTML);
        const revisionVisualTextElement = document.getElementById("revisionVisualText");
        const setAttributeWatcher = revisionButtonElement.setAttribute;
        revisionButtonElement.setAttribute = (key, value) => {
            revisionTextFromButton = revisionButtonElement.getAttribute("data-tooltip");
            revisionVisualTextElement.innerHTML = escapeHTMLPolicy.createHTML(revisionTextFromButton);
            setAttributeWatcher.call(revisionButtonElement, key, value);
        };
        revisionVisualTextElement.addEventListener("mousedown", function (event) {
            revisionButtonElement.dispatchEvent(new MouseEvent("mousedown"));
            revisionButtonElement.classList.remove("jfk-button-hover");
            revisionButtonElement.dispatchEvent(new MouseEvent("mouseup"));
            event.stopPropagation(); // fixes bug where menus would open on hover after first click of the revisionVisualTextElement
        });
        revisionButtonElement.addEventListener("mouseenter", (event) => {revisionButtonElement.classList.add("jfk-button-hover");}, false);
    }
    addBackRevisionVisualText();
})();