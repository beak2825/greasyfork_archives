// ==UserScript==
// @name         No one searches for
// @version      0.1
// @description  Removes the annoying "People also search for" box on Google
// @author       Liam Merlyn
// @include      *.google.*/search?*
// @grant        none
// @namespace https://greasyfork.org/users/580114
// @downloadURL https://update.greasyfork.org/scripts/404636/No%20one%20searches%20for.user.js
// @updateURL https://update.greasyfork.org/scripts/404636/No%20one%20searches%20for.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var boxes = document.querySelectorAll('[id^=eob_]');
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    box.remove();
  }
})();