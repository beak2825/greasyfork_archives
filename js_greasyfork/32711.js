// ==UserScript==
// @name         Neopets: Water Plant Auto-Refresher
// @namespace    http://clraik.com/forum/showthread.php?61752-Neopets-Water-Plant-Auto-Refresher
// @version      0.1
// @description  Refreshes the water plant switches at random intervals.
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/altador/plant.phtml?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32711/Neopets%3A%20Water%20Plant%20Auto-Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/32711/Neopets%3A%20Water%20Plant%20Auto-Refresher.meta.js
// ==/UserScript==

/* open the following urls in separate tabs

http://www.neopets.com/altador/plant.phtml?room=3&act=r3s2
http://www.neopets.com/altador/plant.phtml?room=3&act=r3s3
http://www.neopets.com/altador/plant.phtml?room=3&act=r3s4
http://www.neopets.com/altador/plant.phtml?room=1&act=r1v2
http://www.neopets.com/altador/plant.phtml?room=1&act=r1v1
http://www.neopets.com/altador/plant.phtml?room=2&act=r2v4
http://www.neopets.com/altador/plant.phtml?room=2&act=r2s1
http://www.neopets.com/altador/plant.phtml?room=2&act=r2v3

*/

if (document.body.innerHTML.indexOf('One of the engineers stops you before you can do anything.') == -1){
    var wait=Math.floor(Math.random() * 4901) + 100;
    setTimeout(function() {
        location.reload();
    }, wait);
}