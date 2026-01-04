// ==UserScript==
// @name         POE_Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Really bad character counter on the top left.
// @author       You
// @match        https://poeditor.com/*
// @include      https://poeditor.com/*
// @icon         https://poeditor.com/public/images/favicons/favicon-16x16.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439251/POE_Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/439251/POE_Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

var html = '<span id="current" style="position:fixed;top:0px;left:0;color: #000;z-index: 1000000;font-size: xxx-large;">0</span>'
document.getElementById("user-account-dropdown").insertAdjacentHTML('afterbegin', html);
$('textarea').keyup(function() {

  var characterCount = $(this).val().length,
      current = $('#current');
  current.text(characterCount);

});

})();
