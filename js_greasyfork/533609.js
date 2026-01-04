// ==UserScript==
// @name         BlogsMarks - Enable Automatic spell checking for inputs Title, Public and Private Tags
// @namespace    https://blogmarks.net
// @version      0.2
// @description  Enable Automatic spell checking for input Title and Public Private Tags
// @author       Decembre
// @icon         https://icons.iconarchive.com/icons/sicons/basic-round-social/48/blogmarks-icon.png
// @match        https://blogmarks.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533609/BlogsMarks%20-%20Enable%20Automatic%20spell%20checking%20for%20inputs%20Title%2C%20Public%20and%20Private%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/533609/BlogsMarks%20-%20Enable%20Automatic%20spell%20checking%20for%20inputs%20Title%2C%20Public%20and%20Private%20Tags.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var titleInput = document.querySelector('.b #mark-form fieldset input#new-title');
  var publicTagsInput = document.querySelector('.b #mark-form fieldset input#new-publictags');
  var privateTagsInput = document.querySelector('.b #mark-form fieldset input#new-privatetags');

  if (titleInput) {
    titleInput.spellcheck = true;
  }
  if (publicTagsInput) {
    publicTagsInput.spellcheck = true;
  }
  if (privateTagsInput) {
    privateTagsInput.spellcheck = true;
  }
})();