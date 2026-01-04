// ==UserScript==
// @name         PrairieLearn Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Dark mode for PrairieLearn
// @author       plon
// @match        https://us.prairielearn.com/*
// @exclude      https://us.prairielearn.com/pl/workspace/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532874/PrairieLearn%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/532874/PrairieLearn%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const darkModeStyles = `
        :root {
            --pl-dark-bg-primary: #1a1a1a;
            --pl-dark-bg-secondary: #222222;
            --pl-dark-bg-tertiary: #2a2a2a;
            --pl-dark-text-primary: #e0e0e0;
            --pl-dark-text-secondary: #b0b0b0;
            --pl-dark-border-color: #444444;
            --pl-dark-link-color: #4da8ff;
            --pl-dark-link-hover-color: #80bfff;
            --pl-dark-code-bg: #282c34;
            --pl-dark-code-text: #abb2bf;
            --pl-dark-disabled-bg: #333333;
            --pl-dark-disabled-text: #777777;
        }

        html {
             color-scheme: dark;
        }
        body {
            background-color: var(--pl-dark-bg-primary) !important;
            color: var(--pl-dark-text-primary) !important;
        }


        .card, .panel, .container, .container-fluid, .modal-content, .dropdown-menu, .popover, .navbar, .offcanvas, .list-group-item, .jumbotron,
        header, footer, nav, main,
        [class*="bg-light"], [class*="bg-white"],
        .tooltip-inner  {
            background-color: var(--pl-dark-bg-secondary) !important;
            color: var(--pl-dark-text-primary) !important;
            border-color: var(--pl-dark-border-color) !important;
        }

        .modal-header, .modal-footer, .card-header, .card-footer, .popover-header, .offcanvas-header, .list-group-item-heading  {
            background-color: var(--pl-dark-bg-tertiary) !important;
            border-color: var(--pl-dark-border-color) !important;
            color: inherit !important;
        }

        .popover .popover-arrow::before, .popover .popover-arrow::after { border-color: transparent !important; }
        .bs-popover-top > .popover-arrow::after, .bs-popover-auto[data-popper-placement^="top"] > .popover-arrow::after { border-top-color: var(--pl-dark-bg-secondary) !important; }
        .bs-popover-end > .popover-arrow::after, .bs-popover-auto[data-popper-placement^="right"] > .popover-arrow::after { border-right-color: var(--pl-dark-bg-secondary) !important; }
        .bs-popover-bottom > .popover-arrow::after, .bs-popover-auto[data-popper-placement^="bottom"] > .popover-arrow::after { border-bottom-color: var(--pl-dark-bg-tertiary) !important; }
        .bs-popover-bottom > .popover-arrow::before, .bs-popover-auto[data-popper-placement^="bottom"] > .popover-arrow::before { border-bottom-color: var(--pl-dark-border-color) !important; }
        .bs-popover-start > .popover-arrow::after, .bs-popover-auto[data-popper-placement^="left"] > .popover-arrow::after { border-left-color: var(--pl-dark-bg-secondary) !important; }

        .popover-body {
             color: var(--pl-dark-text-primary) !important;
        }



        button, input, select, textarea, .form-control, .form-select, .input-group-text {
            background-color: var(--pl-dark-bg-tertiary) !important;
            color: var(--pl-dark-text-primary) !important;
            border: 1px solid var(--pl-dark-border-color) !important;
        }
        input::placeholder, textarea::placeholder { color: var(--pl-dark-text-secondary) !important; opacity: 0.7 !important; }
        input:disabled, textarea:disabled, button:disabled, select:disabled, .form-control:disabled, .form-select:disabled { background-color: var(--pl-dark-disabled-bg) !important; color: var(--pl-dark-disabled-text) !important; opacity: 0.7 !important; cursor: not-allowed !important; }
        .form-check-input { background-color: var(--pl-dark-bg-tertiary) !important; border-color: var(--pl-dark-border-color) !important; }
        .form-check-input:checked { background-color: var(--pl-dark-link-color) !important; border-color: var(--pl-dark-link-color) !important; }
        .form-control-plaintext { color: var(--pl-dark-text-primary) !important; background-color: transparent !important; border-color: transparent !important; }



        .btn { border-color: var(--pl-dark-border-color) !important; }
        .btn-primary { background-color: #0d6efd !important; border-color: #0b5ed7 !important; color: white !important; }
        .btn-primary:hover { background-color: #0b5ed7 !important; border-color: #0a58ca !important; }
        .btn-secondary, .btn-light { background-color: #444 !important; border-color: #555 !important; color: var(--pl-dark-text-primary) !important; }
        .btn-secondary:hover, .btn-light:hover { background-color: #555 !important; border-color: #666 !important;}
        .btn-danger { background-color: #dc3545 !important; border-color: #b02a37 !important; color: white !important; }
        .btn-danger:hover { background-color: #b02a37 !important; border-color: #a02633 !important; }
        .btn-info { background-color: #1a4d5a !important; border-color: #2a6d7a !important; color: #cff4fc !important; }
        .btn-info:hover { background-color: #2a6d7a !important; border-color: #3aa0b8 !important; }
        .btn-success { background-color: #198754 !important; border-color: #146c43 !important; color: white !important; }
        .btn-success:hover { background-color: #146c43 !important; border-color: #105635 !important; }
        .btn-warning { background-color: #ffc107 !important; border-color: #d39e00 !important; color: #333 !important; }
        .btn-warning:hover { background-color: #d39e00 !important; border-color: #b88a00 !important; }
        .btn-link { color: var(--pl-dark-link-color) !important; background-color: transparent !important; border-color: transparent !important; text-decoration: underline !important; }
        .btn-link:hover { color: var(--pl-dark-link-hover-color) !important; }



        table, .table { border-color: var(--pl-dark-border-color) !important; }
        th, td {
            background-color: var(--pl-dark-bg-tertiary) !important;
            color: var(--pl-dark-text-primary) !important;
            border-color: var(--pl-dark-border-color) !important;
             vertical-align: middle !important;
        }
        thead th { background-color: #303030 !important; }
        .table-striped tbody tr:nth-of-type(odd) > * { background-color: var(--pl-dark-bg-secondary) !important; }
        .table-hover tbody tr:hover > * { background-color: #353535 !important; }



        a { color: var(--pl-dark-link-color) !important; }
        a:hover { color: var(--pl-dark-link-hover-color) !important; }



        .text-dark, .text-black, .text-body { color: var(--pl-dark-text-primary) !important; }
        .text-muted { color: var(--pl-dark-text-secondary) !important; }



        :not(.pl-file-editor) code, :not(.pl-file-editor) kbd, :not(.pl-file-editor) samp, :not(.pl-file-editor) pre {
             background-color: var(--pl-dark-code-bg) !important;
             color: var(--pl-dark-code-text) !important;
             border: 1px solid var(--pl-dark-border-color) !important;
             border-radius: 3px;
             padding: 0.2em 0.4em;
        }
         :not(.pl-file-editor) pre { padding: 0.8em !important; overflow: auto;}
         :not(.pl-file-editor) pre code { background-color: transparent !important; color: inherit !important; border: none !important; padding: 0 !important; }



        img, svg, [class*="fa-"], [class*="bi-"], [class*="glyphicon-"] {
            background-color: transparent !important;
        }


        .pl-file-editor .editor span[class*="ace_"],
        .pl-file-editor .editor div[class*="ace_"] { color: initial !important; background-color: initial !important; }
        .pl-file-editor .editor { background-color: initial !important; color: initial !important; border: initial !important; }
        .pl-file-editor .editor .ace_gutter { background: initial !important; color: initial !important; }
        .pl-file-editor .editor .ace_cursor { color: initial !important; }
        .pl-file-editor .modal-content { background-color: var(--pl-dark-bg-secondary) !important; color: var(--pl-dark-text-primary) !important; border-color: var(--pl-dark-border-color) !important; }



        hr, .dropdown-divider { border-top-color: var(--pl-dark-border-color) !important; opacity: 0.25 !important; }
        .border, .border-top, .border-bottom, .border-start, .border-end { border-color: var(--pl-dark-border-color) !important; }




        .progress {
             background-color: #444444 !important;
             border-radius: 0.25rem;
             border: 1px solid var(--pl-dark-border-color) !important;


             height: 1.25rem;
             position: relative;
             overflow: hidden;
        }

        .progress.border-success { border-color: #1e6a45 !important; }
        .progress.border-primary { border-color: #0b5ed7 !important; }
        .progress.border-info { border-color: #3aa0b8 !important; }
        .progress.border-warning { border-color: #997404 !important; }
        .progress.border-danger { border-color: #b02a37 !important; }

        .progress-bar {
             color: white !important;
             font-weight: 600;
             display: flex !important;
             justify-content: center !important;
             align-items: center !important;
             background-color: initial;
         }

         .progress-bar.bg-success { background-color: #198754 !important; }
         .progress-bar.bg-info { background-color: #0dcaf0 !important; }
         .progress-bar.bg-warning { background-color: #ffc107 !important; color: #333 !important; }
         .progress-bar.bg-danger { background-color: #dc3545 !important; }
         .progress-bar.bg-primary { background-color: #0d6efd !important; }
         .progress-bar.bg-secondary { background-color: #6c757d !important; }


         .progress > div:not(.progress-bar) {
            color: white !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            font-weight: 600;
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            line-height: normal;
         }



    `;

    const styleElement = document.createElement("style");
    styleElement.id = "prairielearn-dark-mode-style";
    styleElement.textContent = darkModeStyles;
    document.head.appendChild(styleElement);
})();
