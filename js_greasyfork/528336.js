// ==UserScript==
// @name     Remove navigation pane from JIRA dashdoard
// @description Makes space available for JIRA dashboard widgets wider
// @version  2
// @namespace basilevs
// @grant    none
// @match    https://jira.spirenteng.com/secure/*
// @license EPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/528336/Remove%20navigation%20pane%20from%20JIRA%20dashdoard.user.js
// @updateURL https://update.greasyfork.org/scripts/528336/Remove%20navigation%20pane%20from%20JIRA%20dashdoard.meta.js
// ==/UserScript==


function removeTabs() {
  console.log("Removing");
  document.getElementsByClassName("dashboard-tabs").item(0)?.remove();
}

window.addEventListener("navigate", (event) => removeTabs());
removeTabs();
