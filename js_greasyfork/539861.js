// ==UserScript==
// @name Remove Atlassian Intelligence
// @namespace atlassian.net
// @version 0.1
// @description To remove the gosh darned Atlassian Intelligence sections and buttons
// @author influentialeliot
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.atlassian.net/*
// @downloadURL https://update.greasyfork.org/scripts/539861/Remove%20Atlassian%20Intelligence.user.js
// @updateURL https://update.greasyfork.org/scripts/539861/Remove%20Atlassian%20Intelligence.meta.js
// ==/UserScript==

(function() {
let css = `
  :root{
    --ensureLoad: 0;
  }
  
  div:has( > div[data-testid="issue-smart-request-summary.ui.ai-container"] ),
  div[data-testid="issue.views.issue-base.foundation.status.improve-issue"],
  div[aria-label="Summarise"]:has( > button[data-testid="issue-smart-request-summary-trigger.ui.jira-smart-summary-standard-button"] ){
    display: none !important;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
