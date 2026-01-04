// ==UserScript==
// @name                 n666pics
// @description          Disables the 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀 tracking counter.
 
// @name:en              n666pics
// @description:en       Disables the 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀 tracking counter.
 
// @name:ru              n666pics
// @description:ru       Отключает счетчик отслеживания 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀.
 
// @name:uk              n666pics
// @description:uk       Відключає лічильник відстеження 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀.
 
// @name:bg              n666pics
// @description:bg       Деактивира брояча за проследяване на 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀.
 
// @name:zh-CN           n666pics
// @description:zh-CN    禁用跟踪计数器𝗚𝗼𝗼𝗴𝗹𝗲.
 
// @iconURL              https://ssl.gstatic.com/analytics/20200422-01/app/static/analytics_standard_icon.png
// @version              1.3
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
// @downloadURL https://update.greasyfork.org/scripts/513661/n666pics.user.js
// @updateURL https://update.greasyfork.org/scripts/513661/n666pics.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
 
  unsafeWindow._gaUserPrefs = {
    "ioo": function() {
      return true;
    }
  };
})();