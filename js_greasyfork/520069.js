// ==UserScript==
// @name         Claude Dark Pro
// @version      1.2
// @description  Modifies Claude.ai dark theme to provide an even darker experience
// @author       oMaN-Rod
// @match        https://claude.ai/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1407958
// @downloadURL https://update.greasyfork.org/scripts/520069/Claude%20Dark%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/520069/Claude%20Dark%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const colors = {
      // Base theme colors
      mainBg: '#121212',
      secondaryBg: '#1e1e1e',
      accent: '#4a90e2',
      border: 'rgba(255, 255, 255, 0.1)',

      // Code syntax colors (One Dark Pro)
      codeBg: 'rgb(18, 18, 18)',
      codeText: 'rgb(171, 178, 191)'
    };

    const customCSS = `
          /* Base theme styles */
          body.from-bg-200.to-bg-100 {
              background: ${colors.mainBg} !important;
          }

          html.bg-bg-200 {
              background-color: ${colors.mainBg} !important;
          }

          .bg-bg-100,
          .bg-bg-200 {
              background-color: ${colors.mainBg} !important;
          }

          .bg-bg-000,
          .bg-bg-300,
          .bg-bg-400,
          .bg-bg-500 {
              background-color: ${colors.secondaryBg} !important;
          }

          .text-accent-main-000 {
              color: ${colors.accent} !important;
          }

          .border-border-300 {
              border-color: ${colors.border} !important;
          }

          [class*="from-bg-"],
          [class*="to-bg-"],
          [class*="via-bg-"],
          .bg-gradient-to-b,
          .bg-gradient-to-r {
              background: ${colors.mainBg} !important;
              background-image: none !important;
          }

          /* Claude message bubble background */
          .bg-\\[linear-gradient\\(to_bottom\\,_hsla\\(var\\(--bg-000\\)\\/0\\.75\\)_0\\%\\,_hsla\\(var\\(--bg-000\\)_\\/_0\\)_90\\%\\)\\] {
              background: ${colors.mainBg} !important;
              background-image: none !important;
          }

          /* File thumbnails */
          [data-testid="file-thumbnail"] .bg-white {
              background-color: white !important;
          }

          [data-testid="file-thumbnail"] .from-white {
              --tw-gradient-from: white !important;
          }

          [data-testid="file-thumbnail"] .fill-white {
              fill: white !important;
          }

          /* Code block and artifact styling */
          pre, code, .antArtifact {
              background-color: ${colors.codeBg} !important;
              border: none !important;
              border-radius: 4px !important;
              color: ${colors.codeText} !important;
              text-shadow: rgba(0, 0, 0, 0.3) 0px 1px !important;
              font-family: "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace !important;
          }

          .code-block__code {
              background: ${colors.codeBg} !important;
              border: 1px solid ${colors.border} !important;
              border-radius: 8px 8px 0 0 !important;
          }

          pre > div {
              background-color: #000000 !important;
              border-radius: 0 !important;
          }
      `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = customCSS;
    document.head.appendChild(styleSheet);
  })();
