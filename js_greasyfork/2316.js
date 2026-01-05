// ==UserScript==
// @name        Godville 3D Fix
// @namespace   L34k3d's Mini Tweaks/Fixes
// @include     http://godvillegame.com/superhero
// @version     1
// @grant       none
// @description        All this little script does is make it so the WebGL engine can actually download and use the texture file on the 3D interface.
// @downloadURL https://update.greasyfork.org/scripts/2316/Godville%203D%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/2316/Godville%203D%20Fix.meta.js
// ==/UserScript==

window.onload = function () {
    earthTexture.image.crossOrigin="Anonymous"; 
}