// ==UserScript==
// @name         Restore Revision Time Visual Text in Google Apps
// @version      1.3
// @description  Brings back visual last edit text in drive apps due to M3 migration by Google.
// @author       ZachTheDev and happyviking
// @match        https://docs.google.com/document*
// @match        https://docs.google.com/presentation*
// @match        https://docs.google.com/spreadsheets*
// @icon         https://cdn-icons-png.flaticon.com/512/1674/1674929.png
// @namespace gdocsrestoreupdatetimestamp
// @downloadURL https://update.greasyfork.org/scripts/462209/Restore%20Revision%20Time%20Visual%20Text%20in%20Google%20Apps.user.js
// @updateURL https://update.greasyfork.org/scripts/462209/Restore%20Revision%20Time%20Visual%20Text%20in%20Google%20Apps.meta.js
// ==/UserScript==

(function () {
  const escapeHTMLPolicy = window.trustedTypes ? trustedTypes?.createPolicy("use-raw-string", {
    createHTML: (string) => string,
  }) : null;

  function addBackRevisionVisualText() {
    const revisionButtonElement = document.getElementById("docs-revisions-appbarbutton");
    var textFromRevisionButtonElement = revisionButtonElement.getAttribute("ariel-label");
    const menubarElement = document.getElementById("docs-menubar");
    const revisionVisualTextHTML = "<div id=\"revisionVisualText\" class=\"menu-button goog-control goog-inline-block\" role=\"menuitem\" style=\"background-color: transparent;text-decoration: underline;\" data-tooltip=\"Open version history\"></div>";
    const rangeForRevisionVisualTextHTML = document.createRange();
    const fragmentForRevisionVisualTextHTML = rangeForRevisionVisualTextHTML.createContextualFragment(escapeHTMLPolicy?.createHTML(revisionVisualTextHTML) ?? revisionVisualTextHTML);
    menubarElement.appendChild(fragmentForRevisionVisualTextHTML);
    const revisionVisualTextElement = document.getElementById("revisionVisualText");


    function callback() {
      console.log(revisionButtonElement.dataset.tooltip)
      textFromRevisionButtonElement = revisionButtonElement.getAttribute("data-tooltip");
      revisionVisualTextElement.innerHTML = escapeHTMLPolicy?.createHTML(textFromRevisionButtonElement) ?? textFromRevisionButtonElement;
    }

    const observer = new MutationObserver(callback);
    observer.observe(revisionButtonElement, {
      attributeFilter: ["tooltip", "data-tooltip"],
      attributeOldValue: true,
    });

    revisionVisualTextElement.addEventListener("mousedown", function (event) {
      revisionButtonElement.dispatchEvent(new MouseEvent("mousedown"));
      revisionButtonElement.classList.remove("jfk-button-hover");
      revisionButtonElement.dispatchEvent(new MouseEvent("mouseup"));
      event.stopPropagation(); // fixes bug where menus would open on hover after first click of the revisionVisualTextElement
    });

    revisionButtonElement.addEventListener("mouseenter", (event) => { revisionButtonElement.classList.add("jfk-button-hover"); }, false);
  }
  addBackRevisionVisualText();
})();