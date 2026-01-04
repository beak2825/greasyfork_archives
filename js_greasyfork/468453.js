// ==UserScript==
// @license MIT
// @name         Duofarmer redirector fixed by lunatic
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Used in union with DuoHacker to automatically farm XP without interaction (credits to JoRo-Code for the original code)
// @author       lunatic
// @match        https://www.duolingo.com/*
// @icon         https://cdn3.iconfinder.com/data/icons/seo-color-ling-shadow-set1/512/SEO__shadow_search_web_development-18-512.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/468453/Duofarmer%20redirector%20fixed%20by%20lunatic.user.js
// @updateURL https://update.greasyfork.org/scripts/468453/Duofarmer%20redirector%20fixed%20by%20lunatic.meta.js
// ==/UserScript==

const DEBUG = false;
const TRIGGER_URL = "https://www.duolingo.com/learn";

function redirectToPractice() {
  const practiceLink = document.querySelector(
    'a[data-test="global-practice"]'
  );

  if (practiceLink) {
    practiceLink.click();
    if (DEBUG) {
      console.log("Redirected to practice");
    }
  } else {
    if (DEBUG) {
      console.log("Practice link not found");
    }
  }
}

function main() {
  if (DEBUG) {
    console.log("Running main");
  }

  const currentLocation = window.location.href;

  if (DEBUG) {
    console.log("Current location: " + currentLocation);
  }

  if (currentLocation === TRIGGER_URL) {
    redirectToPractice();
  }
}

(function start() {
  setInterval(main, 1000);
})();
