// ==UserScript==
// @name         天涯优化阅读
// @namespace    Ye.Lin
// @version      1.0.0
// @description  优化天涯阅读体，避免文字太多拥挤造成视力问题
// @author       YeLin
// @match        *://www.tianya.im/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tianya.im
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546217/%E5%A4%A9%E6%B6%AF%E4%BC%98%E5%8C%96%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/546217/%E5%A4%A9%E6%B6%AF%E4%BC%98%E5%8C%96%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- CSS styles designed for comfortable reading ---
  // It includes a light theme and an automatic dark theme based on system preferences.
  const comfortableStyles = `
        /* --- Define CSS variables for easy theme management --- */
        :root {
            --item-bg-color: #F9F9F7;       /* Light mode: Off-white background */
            --item-text-color: #f1f2f6;     /* Light mode: Dark gray text */
            --item-heading-color: #111111;  /* Light mode: Slightly darker for headings */
            --item-link-color: #0056b3;      /* Light mode: Standard blue link */
            --item-quote-bg: #F1F1F1;        /* Light mode: Light gray for quotes */
            --item-quote-border: #cccccc;   /* Light mode: Border for quotes */
            --item-code-bg: #e9e9e9;         /* Light mode: Background for inline code */
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --item-bg-color: #1e1e1e;       /* Dark mode: Dark background */
                --item-text-color: #34495e;     /* Dark mode: Light gray text */
                --item-heading-color: #eeeeee;  /* Dark mode: Brighter white for headings */
                --item-link-color: #66b2ff;      /* Dark mode: Lighter blue link */
                --item-quote-bg: #2c2c2c;        /* Dark mode: Darker gray for quotes */
                --item-quote-border: #555555;   /* Dark mode: Muted border for quotes */
                --item-code-bg: #3a3a3a;         /* Dark mode: Background for inline code */
            }
        }

        /* --- Apply styles to the .item-message container --- */
        .item-message, .topic-message {
            /* Font and Color */
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "PingFang SC", "Microsoft YaHei" !important;
            font-size: 18px !important;
            color: var(--item-text-color) !important;
            // background-color: var(--item-bg-color) !important;
            line-height: 1.8 !important;
            transition: background-color 0.3s, color 0.3s;

            /* Layout and Spacing */
            // max-width: 75ch !important; /* Optimal characters per line */
            margin: 3em auto !important; /* Center the block with vertical space */
            padding: 1em !important; /* Comfortable padding inside */
            border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
        }

        /* --- Style elements *inside* .item-message --- */
        .item-message h1, .item-message h2, .item-message h3 {
            color: var(--item-heading-color) !important;
            line-height: 1.3 !important;
            margin-top: 1.8em !important;
            margin-bottom: 0.6em !important;
            border-bottom: none !important;
        }
        .item-message h1 { font-size: 2rem !important; }
        .item-message h2 { font-size: 1.5rem !important; }
        .item-message h3 { font-size: 1.25rem !important; }

        .item-message p {
            margin-bottom: 1.25em !important;
            text-indent: 2em;
        }

        .item-message a {
            color: var(--item-link-color) !important;
            text-decoration: none !important;
            border-bottom: 1px solid var(--item-link-color) !important;
            transition: background-color 0.2s ease-in-out;
        }
        .item-message a:hover {
            background-color: var(--item-link-color) !important;
            color: var(--item-bg-color) !important;
        }

        .item-message blockquote {
            margin: 1.5em 0 !important;
            padding: 0.5em 1.5em !important;
            border-left: 4px solid var(--item-quote-border) !important;
            background-color: var(--item-quote-bg) !important;
            font-style: italic !important;
        }

        .item-message ul, .item-message ol {
            padding-left: 2em !important;
            margin-bottom: 1.25em !important;
        }

        .item-message code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace !important;
            background-color: var(--item-code-bg) !important;
            color: var(--item-text-color) !important;
            padding: 0.15em 0.4em !important;
            border-radius: 4px !important;
            font-size: 0.9em !important;
        }

        .item-message pre {
            background-color: var(--item-quote-bg) !important;
            padding: 1em !important;
            border-radius: 8px !important;
            overflow-x: auto !important;
            margin-bottom: 1.25em !important;
        }
        .item-message pre code {
            background-color: transparent !important;
            padding: 0 !important;
            font-size: 1em !important;
        }
    `;

  // Use GM_addStyle to inject the CSS into the page.
  // This is the recommended way for Tampermonkey scripts.
  GM_addStyle(comfortableStyles);
})();
