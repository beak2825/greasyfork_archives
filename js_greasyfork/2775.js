// ==UserScript==
// @name           Virtonomica Del Share Menu
// @namespace      virtonomica
// @description    Deleted share menu & Deleted "Моя реклама"
// @version        1.15
// @include        http://virtonomica.*
// @downloadURL https://update.greasyfork.org/scripts/2775/Virtonomica%20Del%20Share%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/2775/Virtonomica%20Del%20Share%20Menu.meta.js
// ==/UserScript==

var run = function() {
   var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
   $ = win.$;
   $("a:contains('Моя реклама')").parent().hide();
   $('#share').each(function() { this.innerHTML = '';  });
};

// Грязный хак для Google Chrome >:]
if(typeof window.chrome != 'undefined') {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
} else {
    run();
}
