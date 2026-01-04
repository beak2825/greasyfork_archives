// ==UserScript==
// @name         Starve.io Adblocker V2 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the starve!
// @author       @neformation on discord
// @match        https://starve.io/
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR06Smy-6p99kPDrYxWlG2mYzwaXgjJ6JnOog&s
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513559/Starveio%20Adblocker%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/513559/Starveio%20Adblocker%20V2.meta.js
// ==/UserScript==


                let removeVideoAds = workerTimers.setInterval(() => { if (document['defaultView']['Widget']) { if (document['defaultView']['Widget']['preroll']) { document['defaultView']['Widget']['adsRefresh'] = function () { return }; document['defaultView']['Widget']['createAdPlayer'] = function (argument) { document['defaultView']['Widget']['play'] = argument; return document['defaultView']['Widget']['play'](); }; document['defaultView']['Widget']['preroll'] = function () { workerTimers.setTimeout(() => { return document['defaultView']['Widget']['play'](); }, 0); }; workerTimers.clearInterval(removeVideoAds); }; }; }, 0);