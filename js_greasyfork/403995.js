// ==UserScript==
// @name        - youtube.com - Turn On Dark Mode
// @namespace   Yury Ershov
// @match       *://www.youtube.com/*
// @run-at      document-idle
// @noframes
// @grant       none
// @version     1.0
// @author      Yury Ershov
// @description Automatically switch on dark mode. Useful for incognito tabs.
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/403995/-%20youtubecom%20-%20Turn%20On%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/403995/-%20youtubecom%20-%20Turn%20On%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let IsDark = ()=>!!document.querySelector("html[dark]");
  let IsSpinner = ()=>{
    let e = document.querySelector("ytd-popup-container iron-dropdown div#spinner");
    return !e || getComputedStyle(e).display != "none";
  }
  let HasSettings = ()=>!!document.querySelector("button#button[aria-label=Settings]");
  let ClickSettings = ()=>
    [...document.querySelectorAll("button#button[aria-label=Settings]")].forEach(e=>e.click());
  let ClickDarkModeMenu = ()=>
    [...document.querySelectorAll("ytd-toggle-theme-compact-link-renderer")].
      filter(e=>e.innerText=="Dark theme: Off").
      forEach(e=>e.click());
  let ClickDarkModeSwitch = ()=>
    [...document.querySelectorAll("div#submenu div#caption-container")].
      filter(e=>e.innerText=="DARK THEME").
      forEach(e=>
        [...e.querySelectorAll("div#toggleButton")].forEach(e=>e.click()))

  if (IsDark()) return;

  let WaitSettings = ()=>{
    if (!HasSettings()) {
      setTimeout(WaitSettings, 300);
      return;
    }
    ClickSettings();
    let WaitNoSpinner = ()=>{
      if (IsSpinner()) {
        setTimeout(WaitNoSpinner, 1000);
        return;
      }
      ClickDarkModeMenu();
      ClickDarkModeSwitch();
      setTimeout(()=>document.body.click(), 500);
    };
    setTimeout(WaitNoSpinner, 500);
  };

  setTimeout(WaitSettings, 1000);
})();