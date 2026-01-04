// ==UserScript==
// @name         Kitsun Hotkeys
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Several hotkeys for the kitsun web app
// @author       RysingDragon
// @match        https://kitsun.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368424/Kitsun%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/368424/Kitsun%20Hotkeys.meta.js
// ==/UserScript==

document.addEventListener("keydown", keypress, false);

function keypress(e) {
    var keyCode = e.keyCode;
    if (keyCode == 82) {
        var audio = document.getElementsByTagName("audio")[0];
        if (audio !== null) {
            audio.play();
        }
    }
    var list = document.getElementsByClassName('tabs primary-nav')[0].getElementsByTagName("li");
    if (list !== null) {
        for (var i = 0; i < list.length; i++) {
            var num = i + 1;
            if (keyCode == num.toString().charCodeAt(0)) {
                var link = list[i].firstElementChild;
                window.open(link.href, '_blank');
            }
        }
    }
}