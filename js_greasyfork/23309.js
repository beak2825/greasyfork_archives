// ==UserScript==
// @name        Tamo ateitis
// @namespace   Mantve
// @include     https://sistema.tamo.lt*
// @version     2
// @grant       none
// @description Enjoy the best Tamo experience
// @downloadURL https://update.greasyfork.org/scripts/23309/Tamo%20ateitis.user.js
// @updateURL https://update.greasyfork.org/scripts/23309/Tamo%20ateitis.meta.js
// ==/UserScript==
// Here I'm retrieving the tag displaying the picture by specifying exact path.
var image = document.querySelector("body > div.container_2 > a > div.col_left");

// Here I just change the background image by yours.
image.style.backgroundImage = "url('https://i.imgsafe.org/18e935fbeb.jpg')";
