// ==UserScript==
// @name Dark Habitica Linguists Commonwealth Theme (Weblate)
// @namespace https://greasyfork.org/users/704808
// @version 0.1.2
// @description A userstyle that turns the Translate Habitica site on Weblate dark.
// @author Nakonana
// @supportURL https://habitica.com/profile/33bb14bd-814d-40cb-98a4-7b76a752761c
// @license CC-BY-4.0
// @grant GM_addStyle
// @run-at document-start
// @match https://translate.habitica.com/*
// @downloadURL https://update.greasyfork.org/scripts/420515/Dark%20Habitica%20Linguists%20Commonwealth%20Theme%20%28Weblate%29.user.js
// @updateURL https://update.greasyfork.org/scripts/420515/Dark%20Habitica%20Linguists%20Commonwealth%20Theme%20%28Weblate%29.meta.js
// ==/UserScript==

(function() {
let css = `

body,
img:not(html),
button:not(html),
ins:not(html),
del:not(html),
.progress:not(.progress-cell),
.green:not(.number),
.red:not(body),
.ct-bar:not(.ct-grid),
.navbar-inverse:not(html),
.navbar-nav > li > .dropdown-menu {
    filter:invert();
    }


html,
.btn-toolbar .btn,
.pagination .green,
.pagination .dropdown-toggle {
    background-color:rgba(23,23,23,1);
    }


body,
.zen-unit:nth-child(1n) tr .translatetext,
.panel,
.list-group-item,
.breadcrumb {
    background-color:#e8e8e8;
    }


.panel-default > .panel-heading,
.comment-content,
.zen-unit:nth-child(2n),
.zen-unit:nth-child(2n) tr .translatetext {
    background-color:#f0f0f0;
    }


.btn-toolbar .btn,
.pagination .green,
.pagination .dropdown-toggle {
    border:1px solid rgb(64, 60, 56);
    }


.history-row + .history-row > div {
    border-top:1px solid rgb(191, 195, 199)
    }


.avatar,
.pagination .dropdown-toggle{
    filter:invert();
    }


.nav > li > a > img {
    filter:initial;
    }


.text-muted{
    background-color: rgba(232,232,232,0);
    color:rgb(130, 130, 130);
    }


.ct-label{
    color:rgb(0, 0, 0);
    }


.red path,
img.state-icon[src="/static/state/alert.svg"]{
    fill: #ff2d19;
    }


del,
.btn-danger {
    background-color: #ff2d19;
    }


.panel-danger > .panel-heading,
.check .list-buttons .btn-warning {
    background-color: #ff2d19;
    color: black;
    }

ins,
.btn-warning {
    background-color: #00d2e6;
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
