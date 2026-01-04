// ==UserScript==
// @name Google 2014 Signin Page
// @namespace https://greasyfork.org/en/users/759797-lego-savant
// @version 1.0.0
// @description For signin v3 experiment, a small portion of the "larger 2014 theme"
// @author rlego
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://accounts.google.com/InteractiveLogin/signinchooser*
// @include https://accounts.google*/*
// @include https://myaccount.google*/*
// @include https://myactivity.google*/*
// @include https://adssettings.google*/*
// @downloadURL https://update.greasyfork.org/scripts/491343/Google%202014%20Signin%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/491343/Google%202014%20Signin%20Page.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://accounts.google") || location.href.startsWith("https://myaccount.google") || location.href.startsWith("https://myactivity.google") || location.href.startsWith("https://adssettings.google")) {
  css += `
  /*accounts*/
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 300;
    src: url(https://fonts.gstatic.com/s/opensans/v15/mem5YaGs126MiZpBA-UN_r8OUuhp.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    font-stretch: 100%;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  /****************signin v3****************/
  body > aside[class] {
      display:none
  }
  body > div[class] {
      background:none;
      justify-content:space-between!important;
  }
  body > aside + div:nth-child(2) {
      padding:0!important;
      justify-content:initial;
  }
  body > aside + div:nth-child(2) > div:first-child {
      padding:108px 44px 100px 44px;
      width:100%;
  }
  /*main card*/
  [data-view-id] > div[class] {
      flex-direction:column;
      align-self:center;
      width:274px;
      padding:40px;
      box-sizing:content-box;
      box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
      background-color: #f7f7f7;
      border-radius:2px;
      margin-top:121px;
  }
  [data-view-id] > div[class] > div[class] {
      max-width:none;
      padding:0;
  }
  [data-view-id] > div[class] > div[class]:first-child {
      position:absolute;
      align-self:center;
      margin-top:-229px
  }
  [data-view-id] > div[class] > div[class] c-wiz > div, [data-init-branding] { /*logo*/
      background-image: url(https://ssl.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_112x36dp.png);
      background-size: 112px 36px;
      height: 38px;
      width: 116px;
      display:block;
      margin:0 auto;
      background-repeat:no-repeat;
  }
  [data-view-id] > div[class] > div[class] c-wiz > div svg, [data-init-branding] svg {
      display:none;
  }
  #headingText { /*signing text*/
      font-family: 'Open Sans', arial!important;
      -webkit-font-smoothing: antialiased;
      color: #555;
      font-size: 42px;
      font-weight: 300;
      margin-top: 34px;
      margin-bottom: 22px;
      text-align:center;
  }
  #headingText > span {
      font-family: 'Open Sans', arial!important;
      font-size:0;
  }
  #headingText > span:before {
      content:"One account. All of Google.";
      cursor:text;
      font-size:42px
  }
  #headingSubtext {
      font-family: 'Open Sans', arial!important;
      -webkit-font-smoothing: antialiased;
      color: #555;
      font-size: 18px;
      font-weight: 400;
      margin-bottom: 20px;
      margin-top:0;
      text-align:center;
      line-height:normal
  }
  #headingSubtext > span {
      font-size:0
  }
  #headingSubtext > span:before {
      content:"Sign in with your Google Account";
      font-size:18px;
      cursor:text;
  }
  /*input*/
  [data-is-rendered] > div { /*padding top 8*/
      padding:0!important
  }
  [data-is-rendered] > div > div[class][class], /*height 56*/
  div[class]:has(>div>div>input[autocomplete][type]) { /*same thing but has*/
      height:auto
  }
  [data-is-rendered] > div > div[class][class] ~ div, /*useless*/
   div[class]:has(>div>div>input[autocomplete][type]) ~ div { 
      display:none
  }
  [data-is-rendered] > div > div[class][class] > div, /*ibox / pfp holder*/
  div:has(>div>input[autocomplete][type]) { /*same thing but has*/
      flex-direction:column-reverse;
  }
  [data-is-rendered] > div > div[class][class] > div > div ~ div ~ div, /*ripple death*/
    div[class]:has(>div>div>input[autocomplete][type]) > div > div ~ div ~ div { 
      display:none
  }
  [data-is-rendered] > div > div[class][class] > div > div ~ div, /*pfp main page*/
  div:has(>div>input[autocomplete][type]) > div:nth-child(2) { /*same thing but with :has*/
      display: block;
      height: 96px;
      width: 96px;
      overflow: hidden;
      border-radius: 50%;
      margin-left: auto;
      margin-right: auto;
      z-index: 100;
      margin-bottom: 16px;
      position:static;
      background:url("https://ssl.gstatic.com/accounts/ui/avatar_2x.png");
      background-size:96px;
      transform:none!important;
      border:0;
  }
  [data-is-rendered] > div > div[class][class] > div > div,
   div:has(>div>input[autocomplete][type]) > div:nth-child(1) {
      width:100%;
      flex-direction:column
  }
  #hiddenEmail {
      display:none
  }
  div [class] input[autocomplete][type] {
      appearance: none;
      display: inline-block;
      height: 44px;
      padding: 0 8px;
      margin: 0;
      background: #fff;
      border: 1px solid #d9d9d9;
      border-top: 1px solid #c0c0c0;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -moz-border-radius: 1px;
      -webkit-border-radius: 1px;
      border-radius: 1px;
      font-size: 16px;
      color: #404040;
      font-family:arial;
  }
  div [class] input[autocomplete][type]:hover {
      border: 1px solid #b9b9b9;
      border-top: 1px solid #a0a0a0;
      -moz-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
      -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  }
  div [class] input[autocomplete][type]:focus {
      outline: none;
      border: 1px solid #4d90fe;
      -moz-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
      -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.3)
  }
  input[autocomplete][type]:not(#hiddenEmail) ~ div {
      font-family:arial;
      line-height:44px;
      background:none!important;
      top:unset;
      bottom:0;
      padding:0 1px;
      color: rgb(117, 117, 117)!important;
      display:inline-block!important;
      transform:none!important;
  }

  input[autocomplete][type] ~ div:has(img) {
      display:none!important
  }
  .CDELXb input[autocomplete][type]:not(#hiddenEmail) ~ div { /*hide email or phone text when inputted*/
      display:none!important
  }

  section > header ~ div[class] { /*gap placed below email box, above next box*/
      margin-bottom:10px;
      position:relative;
  }
  /*forgot email*/
  [data-is-rendered] ~ div ~ div.dMNVAe {
      position:absolute;
      bottom:-76px;
      right:0;
  }
  [data-is-rendered] ~ div ~ div.dMNVAe button {
      color:#427fed;
      font:400 13px arial;
  }
  [data-is-rendered] ~ div ~ div.dMNVAe button:before {
      content:none;
  }
  [data-is-rendered] ~ div ~ div.dMNVAe button:hover {
      text-decoration:underline;
  }
  /*next button*/
  [data-primary-action-label], [data-primary-action-label] > div, [data-primary-action-label] > div > div[class][class], [data-primary-action-label], [data-primary-action-label] > div, [data-primary-action-label] > div > div[class][class] > div { /*PARENTS OF NEXT <BUTTON>*/
      display:block;
      margin:0;
      padding:0;
      position:static;
  }
  [data-form-action-uri] ~ div[jsslot] { /*sign in using guest mode removal*/
      display:none
  }
  [data-primary-action-label] > div > div:first-child button[type] {
      margin:0;
      width:100%;
      min-width: 46px;
      text-align: center;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      height: 36px;
      padding: 0 8px;
      line-height: 36px;
      border-radius: 3px;
      transition: all 0.218s;
      text-shadow: 0 1px rgba(0,0,0,0.1);
      border: 1px solid #3079ed;
      background-color: #4d90fe;
      background-image: linear-gradient(#4d90fe, #4787ed);
      user-select: none;
      cursor: default;   
  }
  [data-primary-action-label] > div > div:first-child button[type]:active {
      background-color: #357ae8;
      background-image: -webkit-linear-gradient(top, #4d90fe, #357ae8);
      background-image: -moz-linear-gradient(top, #4d90fe, #357ae8);
      background-image: linear-gradient(#4d90fe, #357ae8);
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
  }
  [data-primary-action-label] > div > div:first-child button[type]:hover {
      border: 1px solid #2f5bb7;
      color: #fff;
      text-shadow: 0 1px rgba(0,0,0,0.3);
      background-color: #357ae8;
      background-image: -webkit-linear-gradient(top, #4d90fe, #357ae8);
      background-image: -moz-linear-gradient(top, #4d90fe, #357ae8);
      background-image: linear-gradient(#4d90fe, #357ae8);
      text-decoration: none;
      transition: all 0.0s;
      box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  }
  [data-primary-action-label] button[type] span {
      font:inherit;
      height:100%;
  }
  /*create account button*/
  [data-primary-action-label] > div > div:last-child button[type] {
      position:absolute;
      margin:0;
      left:0;
      top:60px;
      width:274px;
  }
  [data-primary-action-label] > div > div:last-child button[type] span {
      color:#427fed;
      font-size:14px;
  }
  /*footer*/
  footer {
      font-size: 13px;
      flex-direction:row-reverse
  }
  body > aside + div:nth-child(2) > div:last-child {
      width:100%;
      border-top:1px solid #e5e5e5;
      height:36px;
      padding-top:7px;
  }
  footer > div[class] {
      margin:0;
  }
  footer > div[class] > div {
      display:inline-block;
      vertical-align:middle;
  }
  footer > div[class] > div:before {
      content:url("//ssl.gstatic.com/images/icons/ui/common/universal_language_settings-21.png");
      display:inline-block;
      vertical-align:middle;
      margin-right:3px
  }
  footer > div[class] > div > div {
      border:1px solid;
      margin:0;
  }
  footer > div[class] > div > div > div[class]:first-child {
      margin:0;
      padding:0 2px;
      height:22px;
  }
  footer > div[class] > div > div > div[class] span {
      color:#000;
      font:400 13px arial;
  }
  footer > div[class] > div > div > div[class]:last-child ul {
      padding-left:4px;
  }
  footer ul[class] {
      padding-left:40px;
      font-size:.85em
  }
  footer ul li[class] {
      margin:0;
      color: #737373;
      display: inline;
      padding: 0;
      padding-right: 1.5em;
      padding-top:2px;
      
  }
  footer ul li a[class] {
      all:unset;
      font-family:arial;
      padding:0!important;
  }
  footer ul li a[class]:hover {
      text-decoration:underline;
      cursor:pointer;
  }
  footer ul li a[class]:before {
      content:none;
  }


  .rc-button, .rc-button:visited {
      display: inline-block;
  }
  /*dropdown*/
  [data-should-flip-corner-horizontally][class] {
      border-radius:0;
      background:#fff;
      border-color:#ddd
  }
  [data-should-flip-corner-horizontally][class] li {
      max-height:25px;
      color:#000;
      font:400 13px arial;
  }
  /***/
  /*expired*/
  [data-app-config*="info/sessionexpired"] #headingText span {
      font-size:inherit;
  }
  [data-app-config*="info/sessionexpired"] #headingText span:before {
      content:none!important
  }
  [data-app-config*="info/sessionexpired"] #headingSubtext span {
      font-size:inherit;
  }
  [data-app-config*="info/sessionexpired"] #headingSubtext span:before {
      content:none!important
  }
  /**account recovery***/
  [data-initial-sign-in-data] #headingText {
      font-size:24px;
      margin-top:23px
  }
  [data-initial-sign-in-data] #headingText > span:before {
      content:"Having trouble signing in?";
      font-size:24px
  }
  [data-initial-sign-in-data] #headingSubtext {
      font-size:13px;
      max-width:354px;
      
  }
  [data-initial-sign-in-data] #headingSubtext > span:before {
      content:"Please provide additional information to aid in the recovery process.";
      font-size:13px;
  }
  [data-initial-sign-in-data] [data-is-rendered] > div > div[class][class] > div > div:first-child:before {
      content:"Enter any recovery email or phone number associated with your account";
      display:block;
      color:#404040;
      font:400 15px arial;
      padding-bottom:10px;
      cursor:text;
  }
  [data-initial-sign-in-data] div:has(div>div>div>div>input[autocomplete][type]) ~ div:has(div>div>div>div>input[autocomplete][type]) > div > div > div > div:nth-child(2) {
      display:none;
  }
  [data-initial-sign-in-data] div:first-child:has(>div>div>div>div>input[autocomplete][type]):not(:last-child) > div > div > div > div:nth-child(2) { /*question mark for firstname lastname*/
      background-image:url("//ssl.gstatic.com/accounts/marc/securityquestion.png");
      background-size:125px;
      border-radius:0;
      width:125px;
      height:100px;
  }
  [data-ignore-family-name] > div > div:first-child > div > div > div > div:first-child:before {
      content:"Enter the name on your Google account";
      padding-bottom:10px;
  }
  /*enter password*/
  div:has(>div>#hiddenEmail) {
      margin:0
  }
  #password {
      padding-top:0;
  }
  div[data-value="optionc2"] {
      padding:0
  }
  .uxXgMe .VfPpkd-dgl2Hf-ppHlrf-sM5MNb { /*checkbox container absolute, top -12*/
      position:static;
  }
  .gyrWGe {
      margin:0;
      justify-content:start
  }
  .gyrWGe > div[class] {
      font:400 13px arial;
  }
  .uxXgMe {
      width:auto;
      height:16px;
  }
  input[type=checkbox][class], input[type=radio][class] {
      all:unset;
      -webkit-appearance: none;
      display: inline-block;
      width: 13px;
      height: 13px;
      margin: 0;
      cursor: pointer;
      vertical-align: bottom;
      background: #fff;
      border: 1px solid #c6c6c6;
      -moz-border-radius: 1px;
      -webkit-border-radius: 1px;
      border-radius: 1px;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: relative;
  }
  input[type=checkbox][class]:focus {
      outline: none;
      border-color: #4d90fe;
  }
  input[type=checkbox][class]:active, input[type=radio][class]:active {
      background: #ebebeb;
  }
  input[type=checkbox][class]:hover {
      border-color: #c6c6c6;
      -moz-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
      -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  }
  input[type=checkbox]:checked::after {
      content: url(https://ssl.gstatic.com/ui/v1/menu/checkmark.png);
      display: block;
      position: absolute;
      top: -6px;
      left: -5px;
  }
  input[type=checkbox] ~ div {
      display:none;
  }
  .SOeSgb {
      text-align:center;
  }
  .SOeSgb > div {
      border-color:#ccc;
      border-radius:2px;
      margin-top:-10px;
  }
  `;
}
if (location.href.startsWith("https://accounts.google.com/InteractiveLogin/signinchooser")) {
  css += `
      /*signinchooser*/
      #headingText span {
          font-size:24px!important;
      }
      #headingText span:before {
          font-size:0px!important;
      }
      [data-view-id] > div[class] {
          margin-top:71px
      }
      [data-view-id] > div[class] > div[class]:first-child {
          margin-top:-179px;
      }
      [data-init-is-remove-mode] ul li > div {
          background:none!important;
          font-family:arial;
      }
      [data-init-is-remove-mode] ul li > div div {
          font:inherit;
      }
      [data-init-is-remove-mode] ul li > div div[translate] {
          font-family:arial;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
