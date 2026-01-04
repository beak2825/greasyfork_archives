// ==UserScript==
// @name         gitHub hide sidebar
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  hides the sidebar on GitHub tickets to use all horizontal space.
// @author       PK Cakeout
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423696/gitHub%20hide%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/423696/gitHub%20hide%20sidebar.meta.js
// ==/UserScript==
 
(function() {
    document.addEventListener("keydown", (event) => {
        function parent(x) {
            return x && x.parentElement;
        }
 
        if (!(event.key.toLowerCase() === "s" && event.ctrlKey && event.shiftKey)) {
            return;
        }
 
        event.preventDefault();
        let sidebar = parent(document.getElementById("partial-discussion-sidebar"));
        sidebar = sidebar ||
            parent(document.querySelector(".flex-shrink-0.col-12.col-md-3 > .BorderGrid.BorderGrid--spacious")) ||
            parent(parent(document.querySelector(".flex-shrink-0.col-12.col-md-3 > div > .discussion-sidebar-item.sidebar-assignee.js-discussion-sidebar-item")));
 
        if (!sidebar) {
            console.log("Tampermonkey script: Sidebar not found");
            return;
        }
        const mainbar = sidebar.parentElement.children[0];
 
        // Remove col-md-9, hide sidebar with display=none
        const oldStyle = sidebar.getAttribute("style") || "";
        if (oldStyle.indexOf("display:") < 0) {
            sidebar.setAttribute("style", "display: none;");
            mainbar.setAttribute("class", mainbar.attributes.class.value.replaceAll("col-md-9", ""));
        } else {
            sidebar.setAttribute("style", "");
            mainbar.setAttribute("class", mainbar.attributes.class.value + " col-md-9");
        }
    });
})();