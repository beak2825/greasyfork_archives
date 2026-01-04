// ==UserScript==
// @name         Intro Bypasser - 17track
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Removes the "😊 Welcome!" introduction steps.
// @author       hacker09
// @include      https://t.17track.net/*
// @icon         https://res.17track.net/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/488153/Intro%20Bypasser%20-%2017track.user.js
// @updateURL https://update.greasyfork.org/scripts/488153/Intro%20Bypasser%20-%2017track.meta.js
// ==/UserScript==

setTimeout((function() { //Starts the setimeout function
  'use strict';
  document.body.innerText.search("😊 Welcome!") > -1 ? location.reload() : ''; //Bypass the intro
}), 800); //Finishes the setimeout function