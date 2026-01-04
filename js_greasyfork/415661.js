// ==UserScript==
// @name           tester
// @description    speed console.log tester
// @author         tester
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=56E2JM7DNDHGQ&item_name=T4.4+script&currency_code=EUR
// @name         tester
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415661/tester.user.js
// @updateURL https://update.greasyfork.org/scripts/415661/tester.meta.js
// ==/UserScript==

 (function(){
var d=function(){
document.body.addEventListener('keydown', function(e){console.log("keydown: "+e.keyCode);}, true);
document.body.addEventListener('keyup', function(e){console.log("keyup: "+e.keyCode);}, true);
document.body.addEventListener('keypress', function(e){console.log("keypress: "+e.keyCode);}, true);
document.body.addEventListener('onchange', function(e){console.log("onchange: "+e);}, true);
};
window.addEventListener("load",d)})();