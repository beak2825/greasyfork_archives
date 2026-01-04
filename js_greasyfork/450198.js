// ==UserScript==
// @name         MAM Banner Swap
// @namespace    https://greasyfork.org/en/users/705546-yyyzzz999
// @version      0.03
// @description  Wait a few seconds, then substitute a favorite banner 8/25/22
// @author       yyyzzz999
// @match        https://www.myanonamouse.net/*
// @icon         https://cdn.myanonamouse.net/imagebucket/164109/bswp.png
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450198/MAM%20Banner%20Swap.user.js
// @updateURL https://update.greasyfork.org/scripts/450198/MAM%20Banner%20Swap.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

/* Old banners from Previous Winners can be used https://www.myanonamouse.net/banner/winners.php

   Other image favorites:
      https://www.myanonamouse.net/banner/display.php/m/202201/146680:3
      Fireworks Banner by bookloverjen
   https://www.myanonamouse.net/banner/display.php/m/202207/194964:2
   Pac Man Banner by mazzikin
      https://www.myanonamouse.net/banner/display.php/m/202108/146680:3
      https://www.myanonamouse.net/banner/display.php/m/202108/1
      Lego Pirates Banner by bookloverjen

The example below is from August of 2022
*/
(function() {
   'use strict';
   setTimeout(function(){
      const banner = document.querySelector("#msb").firstChild;
      banner.src = "https://cdn.myanonamouse.net/banner/display.php/m/202208/1";
      banner.title = "Moon Ship Banner by bookloverjen";
   }, 5000); // Show current banner for 5 seconds, then replace with Jen's
})();