// ==UserScript==
// @name        WaniKani - Christmas kappa edition
// @author      tomboy
// @namespace   japanese
// @description Kappa with Santa hat
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include     http*://*wanikani.com*
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/13878/WaniKani%20-%20Christmas%20kappa%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/13878/WaniKani%20-%20Christmas%20kappa%20edition.meta.js
// ==/UserScript==

window.addEventListener("load", function (e) {
    
  var a = document.getElementsByTagName('img');

  for (var key in a) {
    if (a.hasOwnProperty(key) && /^0$|^[1-9]\d*$/.test(key) && key <= 4294967294) {
      // thanks @hoovard for the santa hat!
      a[key].src = a[key].src.replace('https://cdn.wanikani.com/default-avatar-300x300-20121121.png', 'http://i.imgur.com/w2AolJr.jpg')
    }
  }
});
