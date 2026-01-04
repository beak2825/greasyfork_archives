 // ==UserScript==
 // @name        Nitro Math Helper - Auto-reload
// @version     2.0
 // @description This script is used for auto-reloading the Nitro Math game. All current bugs fixed. Enjoy!
 // @match       https://www.nitromath.com/play/*
 // @match       https://www.nitromath.com/play
 // @license MIT
// @namespace https://greasyfork.org/users/1213641
// @downloadURL https://update.greasyfork.org/scripts/479329/Nitro%20Math%20Helper%20-%20Auto-reload.user.js
// @updateURL https://update.greasyfork.org/scripts/479329/Nitro%20Math%20Helper%20-%20Auto-reload.meta.js
 // ==/UserScript==
  
setInterval(function(){
// Presses the Enter key
var e = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, keyCode : 13});
document.dispatchEvent(e);
}, 45000);
