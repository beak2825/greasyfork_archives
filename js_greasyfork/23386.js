// ==UserScript==
// @name          АнтиВоланд
// @namespace    АнтиВоланд1
// @version 	   1
// @description   АнтиВоланд2
// @include      http://virtonomic*.*/*/forum/*

// @downloadURL https://update.greasyfork.org/scripts/23386/%D0%90%D0%BD%D1%82%D0%B8%D0%92%D0%BE%D0%BB%D0%B0%D0%BD%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/23386/%D0%90%D0%BD%D1%82%D0%B8%D0%92%D0%BE%D0%BB%D0%B0%D0%BD%D0%B4.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
$('table.message_color2:has(a.username:contains(VolandAV))').remove();

  
  
                   }
  if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}