// ==UserScript==
// @name         Medium.com: Re-enable Text Selection
// @namespace    https://github.com/aflowofcode
// @version      1.0
// @description  Stop Medium from preventing text selection & clipboard copying
// @author       A Flow of Code
// @match        *://*.medium.com/*
// @match        *://medium.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423971/Mediumcom%3A%20Re-enable%20Text%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/423971/Mediumcom%3A%20Re-enable%20Text%20Selection.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const sp = document.querySelectorAll('[data-selectable-paragraph]');
  sp.forEach(p => p.removeAttribute('data-selectable-paragraph'));
  console.log(`Don't try to control me, Medium - text selection re-enabled on ${sp.length} paragraphs`);
})();