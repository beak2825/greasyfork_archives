// ==UserScript==
// @name         Voxiom Sniper Speed
// @version      0.2
// @description  Move faster with the heavy sniper
// @author       Pix#7008
// @match        https://voxiom.io/*
// @icon         https://avatars.githubusercontent.com/u/44953835?v=4
// @grant        none
// @license      MIT
// @namespace    pixelmelt-vox-sniperspeed
// @downloadURL https://update.greasyfork.org/scripts/442200/Voxiom%20Sniper%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/442200/Voxiom%20Sniper%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function keyup49(){
    var kek = new KeyboardEvent("keyup",{
        keyCode: 49
    })
    document.dispatchEvent(kek);
}

function keyup50(){
    var kek = new KeyboardEvent("keyup",{
        keyCode: 50
    })
    document.dispatchEvent(kek);
}

var hotbarslot = 1
document.body.addEventListener('keydown', function(event) {
    if (event.keyCode == 16) {
        if (hotbarslot == 2) {
            console.log(`Running mode active`)
            var e = new KeyboardEvent("keydown",{
                keyCode: 49
            })
            document.dispatchEvent(e);
            setTimeout(keyup49, 500)
            hotbarslot = 1
        }
    }
    hotbarslot = document.getElementsByClassName(`sc-iAzEPL`)[0].parentElement.children[1].innerHTML
});

document.body.addEventListener('keyup', function(event) {
    if (event.keyCode == 16) {
        if (hotbarslot == 1) {
            console.log(`Running mode de-activated`)
            var f = new KeyboardEvent("keydown",{
                keyCode: 50
            })
            document.dispatchEvent(f);
            setTimeout(keyup50, 500)
            hotbarslot = 2
        }
    }
    hotbarslot = document.getElementsByClassName(`sc-iAzEPL`)[0].parentElement.children[1].innerHTML
});
})();