// ==UserScript==
// @name         Rainbow Like
// @namespace    https://pa0neix.github.io/
// @version      0.1
// @description  net
// @author       pnx <pa0neix@gmail.com>
// @match        https://www.fxp.co.il/showthread.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34062/Rainbow%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/34062/Rainbow%20Like.meta.js
// ==/UserScript==

var x = document.createElement('style');
x.innerHTML = '@keyframes rgbFade { from { filter: hue-rotate(0deg); } to { filter: hue-rotate(360deg); } } .removelike { animation: rgbFade 1s linear infinite; }';
document.head.append(x);