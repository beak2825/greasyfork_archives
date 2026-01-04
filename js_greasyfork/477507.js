// ==UserScript==
// @name         GitLab Tweaks
// @namespace    GLT
// @version      1.0.0
// @description  Improve visual design of GitLab, to reduce visual and cognitive strain, and increase zen mindfulness
// @author       joeytwiddle
// @copyright    2018, Paul "Joey" Clark (http://neuralyte.org/~joey)
// @license      MIT
// @match        https://gitlab.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/477507/GitLab%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/477507/GitLab%20Tweaks.meta.js
// ==/UserScript==

/* eslint-env es6 */

(function() {
  'use strict';

  const generalFixes = true;

  // Other fonts I considered: sans-serif, sans, Arial, "Noto Sans", "Open Sans"
  const customFont = '"Open Sans", Arial, sans-serif';

  const customMonospaceFont = '"Lucida Sans Typewriter", "Lucida Console", monospace';

  // Some whitespace around the central content, to enhance zen state
  const padTheCentralColumn = true;

  const padTheHeader = true;

  // Use only one of these, not both.
  // This keeps the grey line separators, but adds some space above and below them (border-bottom)
  const paddingAroundContentBlockSeparators = true;
  // This removes the grey line separators, by turning them into larger transparent separators
  const paddingInsteadOfContentBlockSeparators = false;

  // Don't let the textarea grow too tall.  (If it does, it's likely the submit button will be pushed offscreen!)
  const limitHeightOfTextarea = true;

  const showScrollbarOnIssueSidebar = true;

  const smallScrollbars = true;

  const hideSidebarsUntilHovered = true;


  // Notes:
  // We put `body` at the start of every selector to increase its specificity.
  // That allows our CSS to override the site's CSS, even if we add ours early (which is desirable to avoid relayout).

  if (generalFixes) {
    // If the labels are just the right length, some of the "Request to merge ..." text will touch the "Open in Web IDE" button.
    // We force a little gap on the right-hand side.
    GM_addStyle(`
      body .normal {
        padding-right: 8px;
      }
    `);
  }

  if (typeof customFont !== 'undefined' && customFont) {
    // The website's recommended fonts were: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
    GM_addStyle(`
      body {
        font-family: ${customFont} !important;
      }
    `);
  }

  if (typeof customMonospaceFont !== 'undefined' && customMonospaceFont) {
    // The website's recommended monospace fonts were: "Menlo", "DejaVu Sans Mono", "Liberation Mono", "Consolas", "Ubuntu Mono", "Courier New", "andale mono", "lucida console", monospace
    GM_addStyle(`
      .monospace, .commit-sha, .gfm-commit, .gfm-commit_range, .ref-name, .git-revision-dropdown .dropdown-content ul li a, .mr-state-widget .label-branch, .git-revision-dropdown-toggle, .commit-sha-group .label-monospace, .file-editor .file-title, .file-editor .editor-file-name, .ci-table .api, .git-clone-holder .form-control, .git-clone-holder .search form, .search .git-clone-holder form,
      pre, tt, code, kbd, samp,
      .md code,
      ul.notes>li .note-body .note-text code {
        font-family: ${customMonospaceFont} !important;
      }
    `);
  }

  if (padTheCentralColumn) {
    GM_addStyle(`
      body .content-wrapper .container-fluid {
        padding: 0 30px;
      }
    `);
  }

  if (padTheHeader) {
    GM_addStyle(`
      body .alert-wrapper {
        padding-top: 10px;
      }
      body .breadcrumbs-container {
        padding-bottom: 30px;
      }
      body .detail-page-header {
        margin-bottom: 14px;
      }
    `);
  }

  if (paddingAroundContentBlockSeparators) {
    GM_addStyle(`
      body .content-block {
        margin-bottom: 25px !important;
        padding-bottom: 25px !important;
      }
    `);
  }

  if (paddingInsteadOfContentBlockSeparators) {
    GM_addStyle(`
      body .content-block {
        border-bottom: 20px solid transparent;
      }
    `);
  }

  if (limitHeightOfTextarea) {
    GM_addStyle(`
      body textarea.js-gfm-input {
        max-height: 60vh !important;
        max-height: calc(100vh - 400px) !important;
      }
    `);
  }

  if (showScrollbarOnIssueSidebar) {
    GM_addStyle(`
      body .right-sidebar .issuable-sidebar {
        width: calc(100% - 2px);
      }
    `);
  }

  if (smallScrollbars) {
    // The body here is used to avoid modifying the outermost page scrollbar.
    // Remove 'body *' if you want these to apply to the page scrollbar too.
    GM_addStyle(`
      body *::-webkit-scrollbar {
        width: 8px;
        background: #eee;
      }

      body *::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 10px;
      }

      /*
      body *::-webkit-scrollbar-track {
        box-shadow: inset 0 0 3px white;
        border-radius: 10px;
      }
      */
    `);
  }

  if (hideSidebarsUntilHovered) {
    GM_addStyle(`
      .nav-sidebar > *, .right-sidebar > * {
        opacity: 0;
        transition: opacity 0.2s;
      }

      .nav-sidebar:hover > *, .right-sidebar:hover > * {
        opacity: 1;
      }
    `);
  }

  /*
  // This is good for increasing specificity, but it gets added too late, causing a relayout.
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('vistweaks');
  });
  */
})();
