// ==UserScript==
// @name           !!Virt: Test
// @namespace      virtonomica
// @include        http*://*virtonomic*.*/*/window/technology_market/ask/by_unit/*/offer/set
// @description    Учусь JS
// @version        1.1
// @downloadURL https://update.greasyfork.org/scripts/27584/%21%21Virt%3A%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/27584/%21%21Virt%3A%20Test.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  function getLocale() {
    return (document.location.hostname === 'virtonomica.ru') ? 'ru' : 'en';
  }
  function getRealm(){
    var svHref = window.location.href;
    var matches = svHref.match(/\/(\w+)\/main\/company\/view\//);
    return matches[1];
  }
alert("This is an alert box!");
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}