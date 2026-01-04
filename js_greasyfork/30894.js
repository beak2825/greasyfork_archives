// ==UserScript==
// @name        Snipta Dark Theme
// @namespace   https://Github.com/Baker/Userscripts
// @version     1.0
// @description This is just a basic dark theme for Snipta.com. 
// @include     http://snipta.com/*
// @include     https://snipta.com/*
// @author      Baker
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30894/Snipta%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/30894/Snipta%20Dark%20Theme.meta.js
// ==/UserScript==

GM_addStyle(`

  html {
    background-color: #252525 !important;
  }
  header {
    background-color: #252525 !important;
  }
  .header__title {
    color: white;
  }
  body {
    background-color: #252525 !important;
  }
  .converter {
    background-color: #333;
    border: 1px solid #444;
  }
  .input__field {
    color: #fff;
  }
  .select, .select__placeholder, .select__options {
    color: #fff;
    background-color: #333 !important;;
  }
  .options__list-item:hover {
    background-color: #252525 !important;
  }
  .converter__divider {
    color: #fff;
  }
  footer {
    background-color: #252525 !important;
  }
  .footer__list-item__link {
    color: white;
  }

`);