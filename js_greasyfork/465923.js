// ==UserScript==
// @name        Github Packages Tab
// @description Adds a Packages tab to Github repository navigation bar.
// @version     1
// @grant       none
// @match       https://github.com/*
// @license      MIT
// @author       Howard D. Lince III
// @supportURL   https://twitter.com/HowardL3
// @namespace    https://github.com/howard3
// @downloadURL https://update.greasyfork.org/scripts/465923/Github%20Packages%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/465923/Github%20Packages%20Tab.meta.js
// ==/UserScript==

(function() {
  const repoUrlRegex = /\/([^\/]+)\/([^\/]+)\//;
  const repoNav = document.querySelector('nav.js-repo-nav ul');
  if (repoNav) {
    const match = repoUrlRegex.exec(window.location.pathname);
    if (match) {
      const orgName = match[1];
      const repoName = match[2];
      const packagesUrl = `https://github.com/orgs/${orgName}/packages?repo_name=${repoName}`;
      const packagesTab = document.createElement('li');
      packagesTab.setAttribute('data-view-component', 'true');
      packagesTab.classList.add('d-inline-flex');
      packagesTab.innerHTML = `
        <a href="${packagesUrl}" data-selected-links="repo_packages" data-tab-item="i8packages-tab" data-hotkey="g p" data-ga-click="Repository, Navigation click, Packages tab" data-view-component="true" class="js-selected-navigation-item UnderlineNav-item hx_underlinenav-item no-wrap js-responsive-underlinenav-item">
          <svg height="16" class="octicon octicon-package UnderlineNav-octicon d-none d-sm-inline" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M14.5 1H1.5C.7 1 0 1.7 0 2.5v11c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-11c0-.8-.7-1.5-1.5-1.5zM1.5 2.02h13v2.17H1.5v-2.17zM1.5 13.98V8.9h13v5.08c0 .18-.14.32-.32.32h-12.36c-.18 0-.32-.14-.32-.32zM5.5 10c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5s.5.22.5.5v2c0 .28-.22.5-.5.5zm3 0c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5s.5.22.5.5v2c0 .28-.22.5-.5.5zm3 0c-.28 0-.5-.22-.5-.5v-2c0-.28.22-.5.5-.5s.5.22.5.5v2c0 .28-.22.5-.5.5z"></path></svg>
          <span data-content="Packages">Packages</span>
        </a>`;
      repoNav.appendChild(packagesTab);
    } else {
      console.log("not found")
    }
  }
})();