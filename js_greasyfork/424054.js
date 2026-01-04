// ==UserScript==
// @name         Text Selection Medium.com: Re-enable 
// @namespace    https://github.com/aflowofcode
// @version      1.0
// @description  Selection & clipboard copying Stop Medium from preventing text 
// @author       A Flow of Code
// @match        *://*.medium.com/*
// @match        *://medium.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424054/Text%20Selection%20Mediumcom%3A%20Re-enable.user.js
// @updateURL https://update.greasyfork.org/scripts/424054/Text%20Selection%20Mediumcom%3A%20Re-enable.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
  const sp = document.querySelectorAll('[data-selectable-paragraph]');
  sp.forEach(p => p.removeAttribute('data-selectable-paragraph'));
  console.log(`Don't try to control me, Medium - text selection re-enabled on ${sp.length} paragraphs`);
})();