// ==UserScript==
// @name                GitLab navigation buttons
// @description         Add buttons on the top bar for quick navigation
// @author              eXistenZNL
// @namespace           eXistenZNL

// @grant               none
// @run-at              document-end
// @include             *://gitlab.com/*
// @include             *://gitlab.*.com/*

// @date                03/22/2021
// @modified            05/20/2021
// @version             1.1.0
// @downloadURL https://update.greasyfork.org/scripts/428343/GitLab%20navigation%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/428343/GitLab%20navigation%20buttons.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const nav = document.querySelector('div.top-bar-container');
    const html = `
    <div class="gl-display-none gl-sm-display-block">
      <ul class="breadcrumbs-list">
        <li><a href="/dashboard/projects">Projects</a></li>
        <li><a href="/dashboard/groups">Groups</a></li>
        <li><a href="/dashboard/milestones">Milestones</a></li>
        <li><a href="/dashboard/snippets">Snippets</a></li>
        <li><a href="/dashboard/activity">Activity</a></li>
        <li><a href="/admin">Admin</a></li>
      </ul>
    </div>`
    $(nav).append(html);
})();