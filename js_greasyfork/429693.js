// ==UserScript==
// @name                Gitlab navigation buttons
// @description         Add back the buttons on the navigation bar that have been hidden in the hamburger menu in GitLab 14. Modified from https://greasyfork.org/en/scripts/428343-gitlab-navigation-buttons
// @author              v1rgul
// @namespace           v1rgul

// @grant               none
// @run-at              document-end
// @include             *://gitlab.com/*
// @include             *://gitlab.*.*/*
// @include             *://git.*.*/*

// @date                2021-07-21
// @version             1.0.0
// @require             https://cdn.staticfile.org/jquery/1.12.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/429693/Gitlab%20navigation%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/429693/Gitlab%20navigation%20buttons.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const nav = document.querySelector('div.title-container');
    const html = `
    <div class="gl-display-none gl-sm-display-block">
      <ul class="nav navbar-sub-nav">
        <!--
        <li class="nav-item"><a href="/dashboard/projects" class="" >
          <span class="gl-button-text"><span class="gl-display-flex">
              <svg role="img" aria-hidden="true" class="gl-icon s16 gl-mr-2!"><use href="/assets/icons-1b2dadc4c3d49797908ba67b8f10da5d63dd15d859bde28d66fb60bbb97a4dd5.svg#project"></use></svg>
              Projects
          </span></span>
        </a></li>
        -->
        <li class="nav-item"><a href="/dashboard/projects" class="" >
          <span class="gl-button-text"><span class="gl-display-flex">
              <svg class="gl-icon s16 gl-mr-2!" data-testid="star-icon"><use xlink:href="/assets/icons-1b2dadc4c3d49797908ba67b8f10da5d63dd15d859bde28d66fb60bbb97a4dd5.svg#star"></use></svg>
              Starred Projects
          </span></span>
        </a></li>
        <li class="nav-item"><a href="/dashboard/groups" class="" >
          <span class="gl-button-text"><span class="gl-display-flex">
              <svg role="img" aria-hidden="true" class="gl-icon s16 gl-mr-2!"><use href="/assets/icons-1b2dadc4c3d49797908ba67b8f10da5d63dd15d859bde28d66fb60bbb97a4dd5.svg#group"></use></svg>
              Groups
          </span></span>
        </a></li>
        <!--
        <li class="nav-item"><a href="/dashboard/milestones" class="" >
          <span class="gl-button-text"><span class="gl-display-flex">
              <svg role="img" aria-hidden="true" class="gl-icon s16 gl-mr-2!"><use href="/assets/icons-1b2dadc4c3d49797908ba67b8f10da5d63dd15d859bde28d66fb60bbb97a4dd5.svg#clock"></use></svg>
              Milestones
          </span></span>
        </a></li>
        <li class="nav-item"><a href="/dashboard/snippets" class="" >
          <span class="gl-button-text"><span class="gl-display-flex">
              <svg role="img" aria-hidden="true" class="gl-icon s16 gl-mr-2!"><use href="/assets/icons-1b2dadc4c3d49797908ba67b8f10da5d63dd15d859bde28d66fb60bbb97a4dd5.svg#snippet"></use></svg>
              Snippets
          </span></span>
        </a></li>
        <li class="nav-item"><a href="/dashboard/activity" class="" >
          <span class="gl-button-text"><span class="gl-display-flex">
              <svg role="img" aria-hidden="true" class="gl-icon s16 gl-mr-2!"><use href="/assets/icons-1b2dadc4c3d49797908ba67b8f10da5d63dd15d859bde28d66fb60bbb97a4dd5.svg#history"></use></svg>
              Activity
          </span></span>
        </a></li>
        -->
        <!-- btn top-nav-menu-item gl-display-block gl-w-full btn-default btn-md gl-button btn-default-tertiary qa-admin-area-link -->
        <li class="nav-item"><a href="/admin" class="" >
          <span class="gl-button-text"><span class="gl-display-flex">
              <svg role="img" aria-hidden="true" class="gl-icon s16 gl-mr-2!"><use href="/assets/icons-1b2dadc4c3d49797908ba67b8f10da5d63dd15d859bde28d66fb60bbb97a4dd5.svg#admin"></use></svg>
              Admin
          </span></span>
        </a></li>
      </ul>
    </div>`
    $(nav).append(html);
})();