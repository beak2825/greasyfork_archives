// ==UserScript==
// @name        Bing News Minimal Cleanup
// @description Remove left margin, hide logo, cap captions, restore full text, remove padding, and clear background color
// @match       https://www.bing.com/news*
// @run-at      document-start
// @version 0.0.1.20250504012739
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/534803/Bing%20News%20Minimal%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/534803/Bing%20News%20Minimal%20Cleanup.meta.js
// ==/UserScript==

(function () {
  const css = `.newscontainer {
      margin-left: 0 !important;
    }

    .b_logoArea {
      display: none !important;
    }

    .caption {
      max-width: 290px !important;
    }

    /* Restore full snippets and titles */
    .newsitem .snippet,
    .newsitem .title {
      max-height: none !important;
      display: block !important;
    }

    /* Remove padding inside news cards */
    .newsitem .news-card-body {
      padding: 0 !important;
      display: flex !important;
      flex-direction: column-reverse !important;
    }

    /* Clear background in dark mode news items */
    body.b_dark .newsitem {
      background-color: transparent !important;
    }

    /* Revert title color in dark mode back to default */
    body.b_dark .newsitem .title {
      color: revert !important;
    }

    .newsitem .image {
      float: none !important;
      margin: 0 !important;
    }

    `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();