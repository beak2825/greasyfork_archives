// ==UserScript==
// @name                 camnangykhoa
// @description          Disables the 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀 tracking counter.
 
// @name:en              camnangykhoa
// @description:en       Disables the 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀 tracking counter.

// @iconURL              https://ssl.gstatic.com/analytics/20200422-01/app/static/analytics_standard_icon.png
// @version              1.7
// @match                http://*/*
// @match                https://*/*
// @run-at               document-start
// @grant                unsafeWindow
// @noframes
// @namespace            https://stomaks.me
// @supportURL           https://stomaks.me?feedback
// @contributionURL      https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=stomaks@gmail.com&item_name=Greasy+Fork+donation
// @author               Maxim Stoyanov (stomaks)
// @developer            Maxim Stoyanov (stomaks)
// @license              MIT
// @compatible           chrome
// @compatible           firefox
// @compatible           opera
// @compatible           safari
// @downloadURL https://update.greasyfork.org/scripts/485128/camnangykhoa.user.js
// @updateURL https://update.greasyfork.org/scripts/485128/camnangykhoa.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
 
  unsafeWindow._gaUserPrefs = {
    "ioo": function() {
      return true;
    }
  };
})();