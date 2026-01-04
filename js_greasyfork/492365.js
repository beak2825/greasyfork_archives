// ==UserScript==
// @name         Better ChatGPT Dark Theme
// @name:zh-CN   更好的ChatGPT暗色主题
// @namespace    http://tampermonkey.net/
// @version      1.6
// @license      MIT
// @author       izumiChan16
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @description  Set a more friendly dark theme for ChatGPT
// @description:zh-cn 为ChatGPT设置更友好的暗色主题
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/492365/Better%20ChatGPT%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/492365/Better%20ChatGPT%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define custom dark theme styles
    const customDarkStyles = `
    html {
    --main-surface-primary: #eff1f5;
    --sidebar-surface-primary: #e7e9ee;
    --sidebar-surface-secondary: #cdd0d9;
    }
    
    .dark {
        --text-primary: #acb2be !important;
        --text-secondary: #c0c0c0 !important;
        --text-tertiary: #a9a9a9 !important;
        --text-quaternary: #808080 !important;

        --border-light: hsla(0, 0%, 100%, 0.05) !important;
        --border-medium: hsla(0, 0%, 100%, 0.1) !important;
        --border-heavy: hsla(0, 0%, 100%, 0.15) !important;
        --border-xheavy: hsla(0, 0%, 100%, 0.2) !important;

        --main-surface-primary: #21232f !important;
        --main-surface-secondary: #3c4054 !important;
        --main-surface-tertiary: #808080 !important;

        --sidebar-surface-primary: #2d2f41 !important;
        --sidebar-surface-secondary: #373a4d !important;
        --sidebar-surface-tertiary: #696969 !important;

        --link: #7ab7ff !important;
        --link-hover: #5e83b3 !important;
    }

    .bg-gray-950 {
        background-color: rgba(13, 13, 13, var(--tw-bg-opacity));
    }

    :root .bg-gray-950 {
        --tw-bg-opacity: 1;  // More opaque in light theme for better readability
    }

    .dark .bg-gray-950 {
        --tw-bg-opacity: 0.5;  // As originally defined, semi-transparent in dark theme
    }
    `;

    // Function to add styles to the page
    function addCustomStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = customDarkStyles;
        document.head.appendChild(styleSheet);
    }

    // Add custom styles when the script runs
    addCustomStyles();

    // Function to modify CSS variables for eye comfort
    function modifyThemeColors() {
        // Additional style modifications
        const styleSheet = document.createElement('style');
        document.head.appendChild(styleSheet);
        styleSheet.sheet.insertRule('.hljs-bullet, .hljs-link, .hljs-selector-id, .hljs-symbol, .hljs-title { color: #91acee; }', 0);
        styleSheet.sheet.insertRule('.hljs-doctag, .hljs-formula, .hljs-keyword, .hljs-literal { color: #c0a1f0; }', 1);
        styleSheet.sheet.insertRule('.hljs-addition, .hljs-attribute, .hljs-meta-string, .hljs-regexp, .hljs-string { color: #b1d99c; }', 2);
        styleSheet.sheet.insertRule('.hljs-attr, .hljs-number, .hljs-selector-attr, .hljs-selector-class, .hljs-selector-pseudo, .hljs-template-variable, .hljs-type, .hljs-variable { color: #e29da1; }', 3);
        styleSheet.sheet.insertRule(`code.hljs, code[class*=language-], pre[class*=language-] { color: #ccd3f2; }`, 0);
    }



    // Call the function to modify theme colors after the page loads
    window.addEventListener('load', modifyThemeColors);
})();
