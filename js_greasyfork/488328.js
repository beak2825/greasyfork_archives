// ==UserScript==
// @name GPX+: Autoclicker
// @description Clicks eggs and Pokémon on GPX+
// @include *gpx.plus/info/*
// @version      1.0.0
// @license      MIT
// @grant        none
// @namespace Squornshellous Beta
// @downloadURL https://update.greasyfork.org/scripts/488328/GPX%2B%3A%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/488328/GPX%2B%3A%20Autoclicker.meta.js
// ==/UserScript==

function clickEgg() {
    var info=document.getElementById("infoInteract");
    var buttons=info.querySelectorAll(".infoInteractButton[name='berry'], .infoInteractButton[type='submit']");
    if (info) {
        var us=info.getElementsByTagName("u");
        if (us.length>0) {
            var clicked=0;
            for (var i=0;i<us.length;i++) {
                if (us[i].innerHTML.search("sour")!=-1) {
                    if (buttons[0]) {
                        buttons[0].click();
                        clicked=1;
                    }
                }
                else if (us[i].innerHTML.search("spicy")!=-1) {
                    if (buttons[0]) {
                        buttons[1].click();
                        clicked=1;
                    }
                }
                else if (us[i].innerHTML.search("dry")!=-1) {
                    if (buttons[0]) {
                        buttons[2].click();
                        clicked=1;
                    }
                }
                else if (us[i].innerHTML.search("sweet")!=-1) {
                    if (buttons[0]) {
                        buttons[3].click();
                        clicked=1;
                    }
                }
                else if (us[i].innerHTML.search("bitter")!=-1) {
                    if (buttons[0]) {
                        buttons[4].click();
                        clicked=1;
                    }
                }
            }
            if (clicked==0) if (buttons[0]) buttons[0].click();
        }
        else if (info.innerHTML.search("cannot interact with it")==-1) {
            if (buttons[0]) buttons[0].click();
        }
    }
}
var gpx=setInterval(function() {clickEgg();},500);