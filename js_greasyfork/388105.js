// ==UserScript==
// @name         Pikachu Running GIF/Video Skin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  GIF/Video skin template for Jstris
// @author       jezevec10
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388105/Pikachu%20Running%20GIFVideo%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/388105/Pikachu%20Running%20GIFVideo%20Skin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
        loadVideoSkin("https://i.imgur.com/MkhYjXB.gif",{skinify:true, colorize:true, colorAlpha:.7})    //This is a GIF skin. To use a Video skin, change to this instead:   loadVideoSkin("https://s.jezevec10.com/res/vid/t360c.mp4",{sound:false})

    });
})();