// ==UserScript==
// @name GitIngest Dark Mode (GitHub Dark Inspired)
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Applies a GitHub dark mode–like theme to GitIngest.
// @author Nighthawk
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.gitingest.com/*
// @downloadURL https://update.greasyfork.org/scripts/524063/GitIngest%20Dark%20Mode%20%28GitHub%20Dark%20Inspired%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524063/GitIngest%20Dark%20Mode%20%28GitHub%20Dark%20Inspired%29.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Base background and text */
    body {
        background-color: #0d1117 !important;
        color: #c9d1d9 !important;
    }

    /* Container backgrounds */
    .main,
    main,
    .container,
    .max-w-4xl,
    .mx-auto {
        background-color: transparent !important;
    }

    /* Cards, panels, and borders */
    .rounded-xl,
    .border-\\[3px\\],
    .border-gray-900 {
        background-color: #161b22 !important;
        border-color: #30363d !important;
    }

    /* Form elements: inputs, textareas, and select */
    input,
    textarea,
    select {
        background-color: #0d1117 !important;
        border: 1px solid #30363d !important;
        color: #c9d1d9 !important;
    }

    input::placeholder,
    textarea::placeholder {
        color: #8b949e !important;
    }

    /* Buttons styling */
    button,
    a.button,
    a[role="button"] {
        background-color: #238636 !important;
        border-color: #238636 !important;
        color: #ffffff !important;
        transition: background-color 0.2s, border-color 0.2s;
    }

    button:hover,
    a.button:hover,
    a[role="button"]:hover {
        background-color: #2ea043 !important;
        border-color: #2ea043 !important;
    }

    /* Hyperlinks */
    a {
        color: #58a6ff !important;
    }

    a:hover {
        text-decoration: underline !important;
    }

    /* Header and Navigation */
    header,
    .navbar {
        background-color: #161b22 !important;
        border-bottom: 1px solid #30363d !important;
    }

    /* Footer */
    footer {
        background-color: #161b22 !important;
        border-top: 1px solid #30363d !important;
        color: #c9d1d9 !important;
    }

    /* Copy and similar UI buttons */
    button,
    .group button {
        box-shadow: none !important;
    }

    /* Range slider */
    input[type="range"] {
        background: #30363d !important;
    }

    /* SVG icons: force to use currentColor for fill and stroke */
    svg {
        fill: currentColor !important;
        stroke: currentColor !important;
    }

    /* Code blocks and monospaced text */
    .font-mono,
    pre,
    code {
        background-color: #161b22 !important;
        color: #c9d1d9 !important;
        border: 1px solid #30363d !important;
    }

    /* Inline background overrides for Tailwind classes (using attribute escapes) */
    .bg-\\[\\#fff4da\\],
    .bg-\\[\\#FAFAFA\\],
    .bg-\\[\\#fafafa\\] {
        background-color: #161b22 !important;
    }

    .bg-\\[\\#ffc480\\] {
        background-color: #238636 !important;
    }

    .bg-gray-900 {
        background-color: #161b22 !important;
    }

    /* Adjust pseudo-shadow offsets (Tailwind translate classes) */
    .translate-y-2,
    .translate-x-2 {
        background-color: #0d1117 !important;
    }

    /* Prose content (for documentation pages) */
    .prose {
        color: #c9d1d9 !important;
    }

    .prose a {
        color: #58a6ff !important;
    }

    .prose blockquote {
        border-left: 4px solid #30363d !important;
        color: #8b949e !important;
    }

    /* Loader spinners */
    .animate-spin {
        color: #ffffff !important;
    }

    /* Override text color utilities if needed */
    .text-gray-900 {
        color: #c9d1d9 !important;
    }

    .text-gray-600 {
        color: #8b949e !important;
    }

    /* Override any additional light backgrounds */
    .bg-\\[\\#e6e8eb\\],
    .bg-white {
        background-color: #161b22 !important;
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
