// ==UserScript==
// @name        Test
// @author        test
// @namespace     test
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       1.0.0
// @include       *://en.wikipedia.org/*
// @require       https://code.jquery.com/jquery-3.1.1.min.js
// @description test
// @downloadURL https://update.greasyfork.org/scripts/35397/Test.user.js
// @updateURL https://update.greasyfork.org/scripts/35397/Test.meta.js
// ==/UserScript==
(function () {
  'use strict';

   let tests = $('#test');
  
  // Needed with new updates:
  if (tests.length !== 0) {
    console.log('Previous test div detected');
  }
  
  $('body').append('<div id="test">');
})();



