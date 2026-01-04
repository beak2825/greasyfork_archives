// ==UserScript==
// @name        Google Translate Page
// @namespace   432346-fke9fgjew89gjwe89
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @noframes
// @version     1.2
// @icon        https://translate.google.com/favicon.ico
// @author      432346-fke9fgjew89gjwe89
// @description Display option to translate the current page with google translate in violentmonkey menu
// @downloadURL https://update.greasyfork.org/scripts/404269/Google%20Translate%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/404269/Google%20Translate%20Page.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.top != window.self)
    return;
  var d = document;

  function translate() {
    
    document.cookie = "googtrans=/auto/en; path=/";

    var d, b, o, v, p;
    b = (d = document).body;
    o = d.createElement('script');
    o.setAttribute('src', 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    o.setAttribute('type', 'text/javascript');
    b.appendChild(o);
    v = b.insertBefore(d.createElement('div'), b.firstChild);
    v.id = 'google_translate_element';
    v.style.display = 'none';
    p = d.createElement('script');
    p.text = 'function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:"auto"},"google_translate_element");}';
    p.setAttribute('type', 'text/javascript');
    b.appendChild(p);
  }

  GM_registerMenuCommand("Translate this page", translate)

})();