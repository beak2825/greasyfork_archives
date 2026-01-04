// ==UserScript==
// @name         Pretty print your GitLab Snippet
// @namespace    dkt.pprint.gitlabsnippet
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/snippets/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/398763/Pretty%20print%20your%20GitLab%20Snippet.user.js
// @updateURL https://update.greasyfork.org/scripts/398763/Pretty%20print%20your%20GitLab%20Snippet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!document.querySelector('.navbar-gitlab')) return;

    const buttonWrapper = unsafeWindow.document.querySelector('.detail-page-header-actions > div');
    const activateBtn = document.createElement('a');
    activateBtn.className = 'btn btn-grouped';
    activateBtn.href = '#';
    activateBtn.textContent = 'Pretty Print';
    buttonWrapper.append(activateBtn);

    activateBtn.addEventListener('click', (e) => {
        e.preventDefault();

        document.querySelector('.navbar-gitlab').remove();
        document.querySelector('.layout-page > .content-wrapper > .alert-wrapper').remove();
        document.querySelector('#content-body > .detail-page-header').remove();
        document.querySelector('#content-body small.edited-text').remove();
        document.querySelector('#content-body .content-component-block').remove();
        document.querySelector('#content-body .personal-snippets').remove();
        document.querySelector('#content-body #notes').remove();

        window.print()
    });

})();