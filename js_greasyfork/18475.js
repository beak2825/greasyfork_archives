// ==UserScript==
// @name         CS.RIN.RU - Google Blacklist Fix
// @namespace    Royalgamer06
// @version      0.2
// @description  Redirects to working page
// @author       Royalgamer06
// @include      *://cs.rin.ru/forum/viewtopic.php?f=*&t=*
// @grant        none
// @run-at       document-start 
// @downloadURL https://update.greasyfork.org/scripts/18475/CSRINRU%20-%20Google%20Blacklist%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/18475/CSRINRU%20-%20Google%20Blacklist%20Fix.meta.js
// ==/UserScript==

location.href = location.href.split('?f=')[0] + '?t=' + location.href.split('&t=')[1];