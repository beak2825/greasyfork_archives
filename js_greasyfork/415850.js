// ==UserScript==
// @name         Constructor Skin v2
// @version      0.0
// @description  press ` to toggle auto select
// @author       me
// @match        ://moomoo.io/
// @match        ://sandbox.moomoo.io/
// @match        ://dev.moomoo.io/
// @match        ://.moomoo.io/*
//@match          https://rust-furtive-agenda.glitch.me/?server=1:2:0
// @grant        none
// @namespace https://greasyfork.org/users/703429
// @downloadURL https://update.greasyfork.org/scripts/415850/Constructor%20Skin%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/415850/Constructor%20Skin%20v2.meta.js
// ==/UserScript==
let skinToggle = 1
setInterval(() => {
   if(skinToggle == 1) {
       selectSkinColor("constructor")
    }
}, 0);
document.addEventListener('keydown', (e)=>{
 if(e.keyCode == 192 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        skinToggle = (skinToggle + 1) % 2;
    }
});