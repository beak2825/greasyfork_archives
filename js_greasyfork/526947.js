// ==UserScript==
// @name Reverso.net – Dark Clean [Ath]
// @namespace athari
// @version 1.0.0
// @description Dark theme for Reverso.net (mainly Context.Reverso.net). Attempts to hide all useless elements and ads. Site is constantly updated so the style is often slightly broken.
// @author Athari (https://github.com/Athari)
// @homepageURL https://github.com/Athari/AthariUserCSS
// @supportURL https://github.com/Athari/AthariUserCSS/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.reverso.net/*
// @match *://*.context.reverso.net/*
// @downloadURL https://update.greasyfork.org/scripts/526947/Reversonet%20%E2%80%93%20Dark%20Clean%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/526947/Reversonet%20%E2%80%93%20Dark%20Clean%20%5BAth%5D.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    color-scheme: dark;

    --ath-new-blue-1: #cdedff;
    --ath-new-blue-2: #2a8bdf;
    --ath-new-blue-3: #002052;
    --ath-grey-1: #d9f4ff;
    --ath-grey-2: #79929d;
    --ath-grey-3: #222c31;
    --ath-black-1: #ebebeb;
    --ath-black-2: #7c7c7c;
    --ath-black-3: #151515;
    --ath-yellow-premium-1: #fffdd0;
    --ath-yellow-premium-2: #ffd252;
    --ath-yellow-premium-3: #594711;
    --new-blue-1200: color-mix(in oklch, var(--ath-new-blue-1), var(--ath-new-blue-2) calc(100% / 1200 * (2400 - 2 * 1200)));
    --new-blue-1100: color-mix(in oklch, var(--ath-new-blue-1), var(--ath-new-blue-2) calc(100% / 1200 * (2400 - 2 * 1100)));
    --new-blue-1000: color-mix(in oklch, var(--ath-new-blue-1), var(--ath-new-blue-2) calc(100% / 1200 * (2400 - 2 * 1000)));
    --new-blue-900:  color-mix(in oklch, var(--ath-new-blue-1), var(--ath-new-blue-2) calc(100% / 1200 * (2400 - 2 * 900)));
    --new-blue-800:  color-mix(in oklch, var(--ath-new-blue-1), var(--ath-new-blue-2) calc(100% / 1200 * (2400 - 2 * 800)));
    --new-blue-700:  color-mix(in oklch, var(--ath-new-blue-1), var(--ath-new-blue-2) calc(100% / 1200 * (2400 - 2 * 700)));
    --new-blue-600:  color-mix(in oklch, var(--ath-new-blue-1), var(--ath-new-blue-2) calc(100% / 1200 * 2 * 600));
    --new-blue-500:  color-mix(in oklch, var(--ath-new-blue-3), var(--ath-new-blue-2) calc(100% / 1200 * 2 * 500));
    --new-blue-400:  color-mix(in oklch, var(--ath-new-blue-3), var(--ath-new-blue-2) calc(100% / 1200 * 2 * 400));
    --new-blue-300:  color-mix(in oklch, var(--ath-new-blue-3), var(--ath-new-blue-2) calc(100% / 1200 * 2 * 300));
    --new-blue-200:  color-mix(in oklch, var(--ath-new-blue-3), var(--ath-new-blue-2) calc(100% / 1200 * 2 * 200));
    --new-blue-150:  color-mix(in oklch, var(--ath-new-blue-3), var(--ath-new-blue-2) calc(100% / 1200 * 2 * 150));
    --new-blue-100:  color-mix(in oklch, var(--ath-new-blue-3), var(--ath-new-blue-2) calc(100% / 1200 * 2 * 100));
    --new-blue-50:   color-mix(in oklch, var(--ath-new-blue-3), var(--ath-new-blue-2) calc(100% / 1200 * 2 * 50));
    --grey-1200: color-mix(in oklch, var(--ath-grey-1), var(--ath-grey-2) calc(100% / 1200 * (2400 - 2 * 1200)));
    --grey-1100: color-mix(in oklch, var(--ath-grey-1), var(--ath-grey-2) calc(100% / 1200 * (2400 - 2 * 1100)));
    --grey-1000: color-mix(in oklch, var(--ath-grey-1), var(--ath-grey-2) calc(100% / 1200 * (2400 - 2 * 1000)));
    --grey-900:  color-mix(in oklch, var(--ath-grey-1), var(--ath-grey-2) calc(100% / 1200 * (2400 - 2 * 900)));
    --grey-800:  color-mix(in oklch, var(--ath-grey-1), var(--ath-grey-2) calc(100% / 1200 * (2400 - 2 * 800)));
    --grey-700:  color-mix(in oklch, var(--ath-grey-1), var(--ath-grey-2) calc(100% / 1200 * (2400 - 2 * 700)));
    --grey-600:  color-mix(in oklch, var(--ath-grey-1), var(--ath-grey-2) calc(100% / 1200 * 2 * 600));
    --grey-500:  color-mix(in oklch, var(--ath-grey-3), var(--ath-grey-2) calc(100% / 1200 * 2 * 500));
    --grey-400:  color-mix(in oklch, var(--ath-grey-3), var(--ath-grey-2) calc(100% / 1200 * 2 * 400));
    --grey-300:  color-mix(in oklch, var(--ath-grey-3), var(--ath-grey-2) calc(100% / 1200 * 2 * 300));
    --grey-200:  color-mix(in oklch, var(--ath-grey-3), var(--ath-grey-2) calc(100% / 1200 * 2 * 200));
    --grey-150:  color-mix(in oklch, var(--ath-grey-3), var(--ath-grey-2) calc(100% / 1200 * 2 * 150));
    --grey-100:  color-mix(in oklch, var(--ath-grey-3), var(--ath-grey-2) calc(100% / 1200 * 2 * 100));
    --grey-50:   color-mix(in oklch, var(--ath-grey-3), var(--ath-grey-2) calc(100% / 1200 * 2 * 50));
    --black-1200: color-mix(in oklch, var(--ath-black-1), var(--ath-black-2) calc(100% / 1200 * (2400 - 2 * 1200)));
    --black-1100: color-mix(in oklch, var(--ath-black-1), var(--ath-black-2) calc(100% / 1200 * (2400 - 2 * 1100)));
    --black-1000: color-mix(in oklch, var(--ath-black-1), var(--ath-black-2) calc(100% / 1200 * (2400 - 2 * 1000)));
    --black-900:  color-mix(in oklch, var(--ath-black-1), var(--ath-black-2) calc(100% / 1200 * (2400 - 2 * 900)));
    --black-800:  color-mix(in oklch, var(--ath-black-1), var(--ath-black-2) calc(100% / 1200 * (2400 - 2 * 800)));
    --black-700:  color-mix(in oklch, var(--ath-black-1), var(--ath-black-2) calc(100% / 1200 * (2400 - 2 * 700)));
    --black-600:  color-mix(in oklch, var(--ath-black-1), var(--ath-black-2) calc(100% / 1200 * 2 * 600));
    --black-500:  color-mix(in oklch, var(--ath-black-3), var(--ath-black-2) calc(100% / 1200 * 2 * 500));
    --black-400:  color-mix(in oklch, var(--ath-black-3), var(--ath-black-2) calc(100% / 1200 * 2 * 400));
    --black-300:  color-mix(in oklch, var(--ath-black-3), var(--ath-black-2) calc(100% / 1200 * 2 * 300));
    --black-200:  color-mix(in oklch, var(--ath-black-3), var(--ath-black-2) calc(100% / 1200 * 2 * 200));
    --black-150:  color-mix(in oklch, var(--ath-black-3), var(--ath-black-2) calc(100% / 1200 * 2 * 150));
    --black-100:  color-mix(in oklch, var(--ath-black-3), var(--ath-black-2) calc(100% / 1200 * 2 * 100));
    --black-50:   color-mix(in oklch, var(--ath-black-3), var(--ath-black-2) calc(100% / 1200 * 2 * 50));
    --black-0:    color-mix(in oklch, var(--ath-black-3), var(--ath-black-2) calc(100% / 1200 * 2 * 0));
    --yellow-premium-1200: color-mix(in oklch, var(--ath-yellow-premium-1), var(--ath-yellow-premium-2) calc(100% / 1200 * (2400 - 2 * 1200)));
    --yellow-premium-1100: color-mix(in oklch, var(--ath-yellow-premium-1), var(--ath-yellow-premium-2) calc(100% / 1200 * (2400 - 2 * 1100)));
    --yellow-premium-1000: color-mix(in oklch, var(--ath-yellow-premium-1), var(--ath-yellow-premium-2) calc(100% / 1200 * (2400 - 2 * 1000)));
    --yellow-premium-900:  color-mix(in oklch, var(--ath-yellow-premium-1), var(--ath-yellow-premium-2) calc(100% / 1200 * (2400 - 2 * 900)));
    --yellow-premium-800:  color-mix(in oklch, var(--ath-yellow-premium-1), var(--ath-yellow-premium-2) calc(100% / 1200 * (2400 - 2 * 800)));
    --yellow-premium-700:  color-mix(in oklch, var(--ath-yellow-premium-1), var(--ath-yellow-premium-2) calc(100% / 1200 * (2400 - 2 * 700)));
    --yellow-premium-600:  color-mix(in oklch, var(--ath-yellow-premium-1), var(--ath-yellow-premium-2) calc(100% / 1200 * 2 * 600));
    --yellow-premium-500:  color-mix(in oklch, var(--ath-yellow-premium-3), var(--ath-yellow-premium-2) calc(100% / 1200 * 2 * 500));
    --yellow-premium-400:  color-mix(in oklch, var(--ath-yellow-premium-3), var(--ath-yellow-premium-2) calc(100% / 1200 * 2 * 400));
    --yellow-premium-300:  color-mix(in oklch, var(--ath-yellow-premium-3), var(--ath-yellow-premium-2) calc(100% / 1200 * 2 * 300));
    --yellow-premium-200:  color-mix(in oklch, var(--ath-yellow-premium-3), var(--ath-yellow-premium-2) calc(100% / 1200 * 2 * 200));
    --yellow-premium-150:  color-mix(in oklch, var(--ath-yellow-premium-3), var(--ath-yellow-premium-2) calc(100% / 1200 * 2 * 150));
    --yellow-premium-100:  color-mix(in oklch, var(--ath-yellow-premium-3), var(--ath-yellow-premium-2) calc(100% / 1200 * 2 * 100));
    --yellow-premium-50:   color-mix(in oklch, var(--ath-yellow-premium-3), var(--ath-yellow-premium-2) calc(100% / 1200 * 2 * 50));
  }

  .example {
    filter: none !important;
  }

  app-speller-footer-text,
  app-faq-promotion-speller,
  app-features-promotion,
  app-desktop-app-promotion,
  app-one-click-promotion-speller,
  app-purple-promotion-speller,
  app-ab-full-banner,
  app-features-promotion-speller,
  app-side-banner,
  app-promo-block,
  app-define-features-promo,
  app-vocab-features-promo,
  app-dictionary-promo,
  app-ab-double-banner,
  #sitemaps,
  .home-banner-wrapper,
  .right-content:has(> #rca:only-child),
  .premium-top,
  .rca-no-ads,
  .home-texts,
  .footer-spotlight,
  .footer-indexes,
  .speller-box__promo-container,
  .vocabulary-lists-wrapper,
  .definition-home-page__language-list,
  .premium-banner {
    display: none !important;
  }

  body {
    background: #222 !important;
  }
  app-new-top-bar-desktop,
  [id^="reverso-header"] {
    background: #333 !important;
    border-color: #444 !important;
  }
  footer {
    background: #333 !important;
    p, div {
      color: #ccc !important;
    }
  }
  .background {
    background: #222 !important;
  }
  :is(h1, h2, h3, h4, h5, h6) {
    color: #ccc !important;
  }

  a:not(:is(.dapp-dl-button)) {
    color: #99e !important;
  }

  button,
  input, optgroup, select, textarea, html input[type="button"], input[type="reset"], input[type="submit"], button[disabled], html input[disabled],
  .add-example-button, .more-button, .less-button {
    background: #333 !important;
    border-color: #444 !important;
    color: #eee !important;
    box-shadow: none !important;
  }
  .selector .option-wrapper .option,
  #wrapper .selector .option {
    color: #eee;
  }
  #wrapper .selector.double .drop-down {
    background: #555;
    border-color: #444;
  }
  #pair-selector .selector .drop-down {
    background: #444;
    .option {
      color: #eee;
      &:hover {
        background: #777;
        color: #fff;
      }
    }
  }

  #more-products-menu.selector {
    .drop-down {
      background: #333 !important;
      border-color: #444 !important;
      box-shadow: none !important;
      a:hover {
        background: #555 !important;
      }
    }
  }

  .pannel {
    background: #333 !important;
    border-color: #444 !important;
    color: #ddd;
  }
  .loading-pannel {
    background: #333 !important;
  }
  
  .words-options {
    background: #333 !important;
    border-color: #444 !important;
  }
  .search-title {
    color: #ccc !important;
  }

  #latest-history-content {
    .history-entry {
      background: #444 !important;
      border-color: #333 !important;
      &.even {
        background: #555 !important;
      }
      span {
        color: #ddd !important;
      }
    }
  }
  
  .language-select {
    .selected-language {
      background: #333 !important;
      border-color: #444 !important;
      color: #ddd !important;
    }
  }
  .language-select-options {
    background: #333 !important;
    border-color: #444 !important;
    .language-select-options__search {
      background: #555 !important;
      border-color: #666 !important;
      outline: none !important;
    }
    .options-item {
      color: #ddd !important;
      &:hover {
        background: #555 !important;
      }
    }
  }

  .ui-autocomplete {
    background: #333 !important;
    border-color: #666 !important;
    .ui-menu-item-wrapper.ui-state-active {
      background-color: #444 !important;
    }
  }

  .speller-language-select {
    .speller-language-select__selected-language {
      background: #333 !important;
      border-color: #444 !important;
      .speller-language-select__selected-language__lang-label {
        color: #ddd !important;
      }
    }
    .speller-language-select__list {
      background: #333 !important;
      .speller-language-select__list-item {
        color: #ddd !important;
        &:hover {
          background: #555 !important;
        }
      }
    }
  }

  .speller-dialect-select {
    .speller-dialect-select__value {
      background: #333 !important;
      border-color: #444 !important;
      color: #ddd !important;
    }
    .speller-dialect-select__list {
      background: #333 !important;
      .speller-dialect-select__list-header {
        color: #ccc !important;
      }
      .speller-dialect-select__list-item {
        color: #ddd !important;
        &:hover {
          background: #555 !important;
        }
      }
    }
  }
  
  .content-box {
    background: #222 !important;
    .simple-block {
      background: #333 !important;
      border-color: #444 !important;
    }
  }

  app-context-examples {
    .context-examples__title {
      color: #ccc !important;
    }
    .source {
      color: #ddb !important;
      em {
        background: #554;
        color: #fff;
      }
    }
    .target {
      color: #ddf !important;
      em {
        background: #445;
        color: #fff;
      }
    }
    .app-icon::before {
      color: #99e !important;
    }
  }
  
  app-translation-box {
    .translation-box {
      background: #222 !important;
      .translation-box-wrapper {
        background: #222 !important;
      }
    }
  }

  app-speller-container {
    background: #222 !important;
    .speller-box__top-control,
    .speller-actions-input {
      background: #333 !important;
      border-color: #444 !important;
    }
  }

  #search-links h1 {
    background: #444;
  }
  #search-content,
  #notice-content {
    background: #0000 !important;
    color: #ddd;
  }
  #notice-content .notice a {
    color: #aaf;
  }
  #search-input,
  #pair-selector .selector {
    background: #444 !important;
    border-color: #666 !important;
    input {
      background: #444 !important;
    }
  }
  #search-options .title-content {
    color: #eee;
  }
  #translations-content .translation {
    background: #334;
    border-color: #223;
    color: #ccd;
  }
  #translations-content .translation:hover {
    background: #556;
    border-color: #445;
  }
  #examples-content {
    .other-result {
      background: none !important;
      color: #ccc;
    }
    .example {
      border-color: #777;
      &:hover {
        background: #444;
      }
      .options {
        background: #444;
      }
      .src {
        :is(.text, .text-nikkud) {
          color: #ddb;
          em {
            background: #554;
            color: #fff;
          }
        }
      }
      .trg {
        .text {
          color: #ddf;
          em {
            background: #445;
            color: #fff;
          }
        }
      }
    }
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
