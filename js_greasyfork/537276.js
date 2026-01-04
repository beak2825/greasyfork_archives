// ==UserScript==
// @name           jx-greasyfork-force-light
// @version        1.0.0
// @namespace      https://github.com/JenieX/user-js-next
// @description    Ignore GreasyFork behavior of matching browser theme and force light theme.
// @author         JenieX
// @match          https://greasyfork.org/*
// @run-at         document-start
// @noframes
// @compatible     chrome Violentmonkey
// @compatible     edge Violentmonkey
// @supportURL     https://github.com/JenieX/user-js-next/issues
// @homepageURL    https://github.com/JenieX/user-js-next/tree/main/greasyfork-force-light
// @icon           https://github.com/JenieX/assets/raw/main/icons/greasyfork.png
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/537276/jx-greasyfork-force-light.user.js
// @updateURL https://update.greasyfork.org/scripts/537276/jx-greasyfork-force-light.meta.js
// ==/UserScript==

function addStyle(css, parent = document.documentElement) {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css;
  parent.append(style);

  return style;
}

addStyle(':root{--overall-background-color:#f6f6f6!important;--overall-text-color:#000!important;--link-color:#670000!important;--link-visited-color:#a42121!important;--texty-link-visited-color:#333!important;--content-background-color:#fff!important;--content-border-color:#bbb!important;--content-box-shadow-color:#ddd!important;--content-separator-color:#ddd!important;--tab-active-background-color:rgba(0,0,0,.03)!important;--tab-active-box-shadow-color:rgba(0,0,0,.1)!important;--tab-active-top-border-color:#900!important;--inactive-item-background-color:#f5f5f5!important;--code-background-color:#f2e5e5!important;--user-content-background-color-gradient-1:#fcf1f1!important;--user-content-background-color-gradient-2:#fff!important;--user-content-border-left-color:#f2e5e5!important;--list-option-background-color-gradient-1:#fff!important;--list-option-background-color-gradient-2:#eee!important;--notice-background-color:#d9edf7!important;--notice-border-color:#31708f!important;--notice-text-color:#000!important;--alert-background-color:#ffc!important;--alert-border-color:#ffeb3b!important;--alert-text-color:#000!important;--chart-background-color:#dcdcdc!important;--chart-border-color:#dcdcdc!important}');