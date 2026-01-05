// ==UserScript==
// @name       Crunchyroll Resolution Enforcement
// @namespace  https://greasyfork.org/en/users/13772-endorakai
// @version    1.0
// @description  Sets Crunchyroll Resolution To Preferred Resolution
// @include      http://www.crunchyroll.com/*/*episode*
// @exclude      http://www.crunchyroll.com/*/*?p360=1
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/16025/Crunchyroll%20Resolution%20Enforcement.user.js
// @updateURL https://update.greasyfork.org/scripts/16025/Crunchyroll%20Resolution%20Enforcement.meta.js
// ==/UserScript==

window.location.replace (window.location.href + "?p360=1");

//you can change the resolutions by going to "?p360=1" on line 11
//and changing it to:
//480 res = "?p480=1"
//720 res = "?p720=1" <<<---REQUIRES THEIR MEMBERSHIP/LOGGED IN
//1080 res= "?p1080=1" <<<---REQUIRES THEIR MEMBERSHIP/LOGGED IN
//***MUST ALSO CHANGE YOUR EXCLUDE THE SAME WAY SO YOU DONT 
//***KEEP LOOPING THE PAGE:
//***simply change the *?p360=1 to the same paste you used to edit line 11