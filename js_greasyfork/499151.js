// ==UserScript==
// @name         Yahoo Wider Mail
// @namespace    https://github.com/def00111
// @version      2.2
// @description  Various improvements/fixes for Yahoo Mail
// @author       def00111
// @match        https://mail.yahoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mail.yahoo.com
// @grant        none
// @noframes
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499151/Yahoo%20Wider%20Mail.user.js
// @updateURL https://update.greasyfork.org/scripts/499151/Yahoo%20Wider%20Mail.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const sel = `div[data-test-id="mail-right-rail"]:has(div[data-test-id="gam-iframe"]:only-child) div[data-test-id="comms-properties-bar"]`;

  const config = {
    childList: true,
    subtree: true
  };

  const minimizeData = content => {
    content = content.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '' );
    // now all comments, newlines and tabs have been removed
    content = content.replace( / {2,}/g, ' ' );
    // now there are no more than single adjacent spaces left
    content = content.replace( / ([{:}]) /g, '$1' );
    content = content.replace( /([:;,>~+]) /g, '$1' );
    content = content.replace( / ([!+>])/g, '$1' );
    return content;
  };

  const cssText = minimizeData(`
    #Atom .iy_FF {
      overflow-x: auto !important;
    }
    #Atom :is(.H_3DVPV, .H_tQ, .H_1HK53Y, .H_ZIFfAM) {
      height: auto !important;
    }
    #Atom :is(.W_3v3uk, .W_3nHoX, .W_7iGr) {
      width: auto !important;
    }
    div[class*="bg_png_mask"]:empty {
      min-height: auto !important;
    }
    #basic-mail-app-container {
      & td[class="V_GM W_3n93F p_R o_h G_e"]:has(> a[href^="/b/settings/"]) + td > #norrin-optin {
        display: inline-block !important;
      }
      & table:has(#messageListContainer > div > #gam-iframe-basic-mail > #gpt-iframe) {
        height: 100vh;
      }
      & td:has(> div > #gam-iframe-basic-mail > #gpt-iframe),
      & #messageListContainer > div:has(> #gam-iframe-basic-mail > #gpt-iframe),
      & #norrin-optin {
        display: none !important;
      }
    }
    #mail-app-container {
      #norrin-ybar-header:has(~ &) > #ybar {
        height: auto !important;
        & > #ybar-inner-wrap > div._yb_yuhdug {
          display: none !important;
        }
      }
      & a[data-test-id="redirect-to-full-view-right-rail-btn"] {
        position: static !important;
      }
      & div[data-test-id="epoch-schedule-list-container"]:has(div[data-test-id="event-list-in-day-view-container"]) {
        overflow-y: auto !important;
      }
      & .message-view[data-test-expanded="true"] {
        overflow-x: auto;
      }
      & span[data-test-id="more-less-label"] {
        margin-right: 16px;
      }
      & div[data-test-id="mail-right-rail"]:has(div[data-test-id="gam-iframe"]:only-child) div:has(> div[data-test-id="gam-iframe"] > #gpt-iframe),
      & #mail-app-component div:has(> div[data-test-id="gam-iframe"] > #gpt-iframe),
      & div[data-test-id="mail-right-rail"] > div:has(> div[data-test-id="right-rail-hidead-btn"]),
      & span[data-test-id="settings-link-label"],
      & div:has(> article > a[data-test-id="bottom-sticky-pencil-ad"]),
      & div[data-test-id="contact-card"] + div[data-test-id="gam-iframe"],
      & section[role="banner"] > div[role="navigation"]:has(ul[data-test-id="tab-list"][data-test-count="0"]) {
        display: none !important;
      }
      & #mail-app-component:has(div > div[data-test-id="gam-iframe"] > #gpt-iframe) div.H_74JI:has(> span > span.D_X) {
        height: 100% !important;
      }
      & #mail-app-component:has(+ div[data-test-id="mail-right-rail"] div[data-test-id="gam-iframe"]:only-child) {
        border-right: none !important;
      }
      & #mail-app-component:has(div[data-test-id="message-toolbar"].I_ZkbNhI.m_Z14vXdP) + div[data-test-id="mail-right-rail"]:has(div[data-test-id="gam-iframe"]:only-child) div[data-test-id="comms-properties-bar"]:not(.I_ZkbNhI.m_Z14vXdP) {
        background-color: #fff !important;
        border-bottom: 1px solid #e0e4e9 !important;
        & > div > div > div[data-test-id="popover-container"] > button.cdPFi_ZkbNhI.C_ZOHqTQ {
          fill: inherit !important;
          color: inherit !important;
        }
        & > div[data-test-id="comms-properties"] > * {
          fill: #979ea8 !important;
          color: #fff !important;
        }
      }
      & #mail-app-component:has(div[data-test-id="message-toolbar"].I_T) + div[data-test-id="mail-right-rail"]:has(div[data-test-id="gam-iframe"]:only-child) div[data-test-id="comms-properties-bar"] {
        border-left: none !important;
      }
      & div[data-test-id="mail-right-rail"]:has(div[data-test-id="gam-iframe"]:only-child) div[data-test-id="comms-properties-bar"] {
        border-left: 1px solid #e0e4e9;
        position: absolute;
        right: 0;
      }
      & #mail-app-component:has(+ div[data-test-id="mail-right-rail"] div[data-test-id="gam-iframe"]:only-child) div[data-test-id="search-header"] {
        box-sizing: border-box;
      }
      & div[data-test-id="search-header"] + div[data-test-id="mail-reader-toolbar"] > div[data-test-id="message-toolbar"] {
        max-width: none !important;
      }
      & #mail-app-component:has(+ div[data-test-id="mail-right-rail"] div[data-test-id="gam-iframe"]:only-child) div:is([data-test-id="message-toolbar"], [data-test-id="search-header"]),
      & #mail-app-component:has(+ div[data-test-id="mail-right-rail"] div[data-test-id="gam-iframe"]:only-child) > div > div > div > .compose-header div:is([data-test-id="compose-header-top-bar"], [data-test-id="container-from"]) {
        max-width: calc(100% - var(--ywm-comms-properties-bar-width));
      }
      @media only screen and (max-width: 1400px) {
        & div[data-test-id="message-toolbar"] button span.t_l {
          display: none !important;
        }
      }
    }
  `);

  if (!document.head) {
    await new Promise(resolve => {
      const observer = new MutationObserver(() => {
        if (document.head) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document, config);
    });
  }

  const style = document.createElement("style");
  style.textContent = cssText;
  document.head.append(style);

  let styleEl = null;
  const addStyle = el => {
    const style = window.getComputedStyle(el);
    if (!styleEl) {
      styleEl = document.createElement("style");
      document.head.append(styleEl);
    }
    styleEl.textContent = `:root { --ywm-comms-properties-bar-width: ${style.width}; }`;
  };

  const run = () => {
    const container = document.getElementById("mail-app-container");
    if (container) {
      const node = container.querySelector(sel);
      if (node) {
        addStyle(node);
      } else {
        if (!observer._observing) {
          observer.observe(container, config);
          observer._observing = true;
        }
      }
    }
    const wrap = document.getElementById("ybar-inner-wrap");
    if (wrap && !document.getElementById("ywm-style")) {
      const rect = wrap.getBoundingClientRect();
      const style = document.createElement("style");
      style.id = "ywm-style";
      style.textContent = `#app > section[role="banner"] > div.H_3n1j3 { height: ${rect.height}px !important; }`;
      document.head.append(style);
    }
  };

  const observer = new MutationObserver(() => {
    const node = document.body.querySelector(sel);
    if (node) {
      observer.disconnect();
      observer._observing = false;
      addStyle(node);
    }
  });
  observer._observing = false;

  if (document.readyState != "loading") {
    run();
  }
  document.onreadystatechange = () => run();
})();