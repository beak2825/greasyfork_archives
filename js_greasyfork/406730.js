// ==UserScript==
// @name Swap colours of issue status icon at GitHub and Bugzilla. Open=red, closed=green.
// @namespace myfonj
// @version 0.1.5
// @description Makes "good" icons green and "bad" ones red.  Closed issue is good, unresolved is bad.
// @license CC0 - Public Domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/406730/Swap%20colours%20of%20issue%20status%20icon%20at%20GitHub%20and%20Bugzilla%20Open%3Dred%2C%20closed%3Dgreen.user.js
// @updateURL https://update.greasyfork.org/scripts/406730/Swap%20colours%20of%20issue%20status%20icon%20at%20GitHub%20and%20Bugzilla%20Open%3Dred%2C%20closed%3Dgreen.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "bugzilla.mozilla.org" || location.hostname.endsWith(".bugzilla.mozilla.org"))) {
  css += `
   /*
   https://greasyfork.org/en/scripts/406730/versions/new
   https://userstyles.world/style/11232

   Changelog
   0.1.4 (2024-05-15) fix svg colours for open and closed stuff in search
   0.1.3 (2024-02-29) green badge on closed checkmark in timeline (in comments)
   0.1.2 (2023-07-31) merged badge background (= "OK")
   */
   /*
    <span class="bug-status-label text" data-status="closed">Closed</span>
   
   --bug-status-color-open: #188716;
   --bug-status-color-closed: #1B6AB8;
   --bug-status-color-untriaged: #1B9BB8;
   --bug-type-color-defect: #EA3C3D;
   --bug-type-color-enhancement: #2ABA27;
   --bug-type-color-task: #2886C9;
   
   */
   [class*="bug-status"][data-status="open"] {
     --bug-status-color-open: #EA3C3D;
    
   }
   [class*="bug-status"][data-status="closed"] {
     --bug-status-color-closed: #188716;
   }
   .bz_bug_link:not(.bz_closed)  {
    color: color-mix(in srgb, white 30%, red);
   }
   .bz_bug_link.bz_closed {
    color: color-mix(in srgb, white 30%, green);
   }

  `;
}
if ((location.hostname === "github.com" || location.hostname.endsWith(".github.com"))) {
  css += `
   /*
   GitHub - swap colors (open=red, closed=green)
   
   .State--draft,
   .State--open,
   .State--merged,
   .State--closed,
   .State--small
   
   */
   path[d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"], /* dot */
   path[d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"], /* circle */
   .octicon.open,
   .octicon.octicon-issue-opened:not(.UnderlineNav-octicon) path
   {	color: #cb2431; /* original is green */
   }
   path[d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm1.5 0a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm10.28-1.72-4.5 4.5a.75.75 0 0 1-1.06 0l-2-2a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l1.47 1.47 3.97-3.97a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"], /* Circle with check */
   .octicon.closed,
   .octicon.octicon-issue-closed path
   {	color: #28a745; /* original is red */
   }
   .reponav-item .octicon path,
   .table-list-header-toggle .btn-link path,
   .State--green .octicon.octicon-issue-opened path,
   .State--red .octicon.octicon-issue-closed path
   { color: inherit
   }
   .State--open,
   .State--green
   {	background-color: #cb243133; /* original is green */
   ;color: #cb2431;
   }
   .State--merged,
   .State--closed,
   .State--red
   {	background-color: #28a74533; /* original is red */
   ; color: #28a745;
   }
   /* same, but importat, TBH IDK Y it has to be this way */
   .TimelineItem-badge.color-fg-on-emphasis.color-bg-done-emphasis,
   .TimelineItem-badge.color-fg-on-emphasis.color-bg-done-emphasis .octicon-issue-closed
   {	background-color: #28a74533 !important; /* original is violet */
   ; color: #28a745 !important;
   }

  .type-icon-state-closed .octicon-git-pull-request
   { /* leaving original red, as for "closed not merged" */
   }
   .octicon.octicon-git-pull-request.open
   { color: orange; /* original is green */
   }
   .fgColor-open > [d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"],
   .octicon.octicon-git-pull-request.color-fg-open,
   .octicon.octicon-git-pull-request.open.text-green
   { color: orange !important; /* text-green is !important; ghis appears in tooltip */
   }
   .octicon.octicon-git-merge.merged , /* does not seem to be needed anymore */
   .type-icon-state-merged .octicon-git-merge
   { color: #28a745; /* original violet seems quite ok-ish as well, but to be consistent let's make it green. merged PR = OK*/
   }
   .octicon-git-pull-request.closed
   { color: #cb2431; /* original is green; closed not merged - not error, not OK */
   }
   .octicon-git-pull-request.text-gray-light
   { /* "draft" PR is gray */
   }
   /* user closed this issue ... */
   .TimelineItem-badge.text-white.bg-red > .octicon.octicon-circle-slash
   {	background-color: #28a745;
   	outline: .4rem solid #28a745;
   	color: rgba(255,255,255,.2); /* icon shape is like "🚫" here */
   }
   
   /* user reopened this issue ... */
   .TimelineItem-badge.text-white.bg-green > .octicon.octicon-dot-fill
   {	background-color: #cb2431;
   	outline: .4rem solid #cb2431;
   	color: rgba(255,255,255,.2); /* icon shape is "•" here */
   }
  `;
}
css += `regExp("https://github.com/[^/]+/[^/]+/pull/.*")
{
   #partial-discussion-header .State.State--green  { background-color: purple; }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
