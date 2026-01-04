// ==UserScript==
// @name         Production Warning Banner
// @namespace    https://*.picnichealth.com/*
// @version      0.2
// @description  Show a warning when on production app or internal
// @author       jmaslin
// @grant        GM_addStyle
// @include      https://app.picnichealth.com/*
// @include      https://internal.picnichealth.com/*
// @downloadURL https://update.greasyfork.org/scripts/381028/Production%20Warning%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/381028/Production%20Warning%20Banner.meta.js
// ==/UserScript==

GM_addStyle(`
  #dev-banner {
    position: fixed;
    z-index: 9999;

    width: 100%;
    height: 24px;

    text-align: center;
    color: white;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 0.8;
    background-color: #d91818;
  }

  .production-text {
    padding: 4px;
    font-size: 16px;
    font-weight: bold;
  }
`);

(function() {
  'use strict';

  const textEl = '<span class="production-text">PRODUCTION!</span>'.repeat(6);

  const newHTMLHeader = document.createElement('div');
  newHTMLHeader.innerHTML = '<div id="dev-banner" style="top: 0;">' + textEl + '</div>';

  const newHTMLFooter = document.createElement('div');
  newHTMLFooter.innerHTML = '<div id="dev-banner" style="bottom: 0;">' + textEl + '</div>';

  document.body.prepend(newHTMLHeader);
  document.body.prepend(newHTMLFooter);
})();
