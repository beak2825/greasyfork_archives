// ==UserScript==
// @name         GitHub
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Fix formatting
// @author       Ping
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22624/GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/22624/GitHub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `

/* Reduce height of repository search bar */
.header {
  padding: 6px 0;
}

/* Reduce spacing around page heading and repo heading */
.pagehead {
  padding-top: 12px;
}
.pagehead, .repohead {
  margin-bottom: 12px;
}

/* Reduce height of tabs */
a.reponav-item, .tabnav-tab {
  line-height: 16px;
}

/* Reduce line spacing in code */
.blob-num, .blob-code-inner {
  font-size: 11px;
}
.blob-num, .blob-code {
  line-height: 14px;
  vertical-align: baseline;
}
.add-line-comment {
  height: 18px;
}

/* Reduce vertical padding in file header */
.file-header {
  padding: 0 10px;
}
.btn-sm, .social-count {
  line-height: 17px;
}

/* Reduce space between files */
.files-next-bucket .file {
  margin-bottom: 16px;
}

/* Reduce padding above diff summary bar */
.pr-toolbar, .pr-toolbar.is-stuck::after {
  height: 40px;
  margin-bottom: 10px;
}
.diffbar {
  padding-top: 10px;
}
.pr-toolbar.is-stuck + .pr-toolbar-shadow {
  top: 40px;
}

/* See more content in commit status descriptions. */
.branch-action-item.open > .merge-status-list {
  max-height: none;
}
.merge-status-item {
  padding: 6px 12px;
}
.merge-status-item .css-truncate-target {
  white-space: normal;
}
`;
    head.appendChild(style);
})();
