// ==UserScript==
// @name         Skin changer by Nation Gaming & Hardcore
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Skin Changer enjoy
// @author       Nation Gamign And Harcoore
// @match        http://alis.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23528/Skin%20changer%20by%20Nation%20Gaming%20%20Hardcore.user.js
// @updateURL https://update.greasyfork.org/scripts/23528/Skin%20changer%20by%20Nation%20Gaming%20%20Hardcore.meta.js
// ==/UserScript==
var skinChanger = false;
var i = 0
var skinSpeed = 1;
var skinList = ["http://i.imgur.com/4w0HqZq.png",
                       "http://i.imgur.com/tPz2UzJ.png",
                        "http://i.img,ur.com/dLRbJDS.jpg",
                        "http://i.imgur.com/V4dzlPl.png",
                        "http://i.imgur.com/4xP4fwz.png",
                        "http://i.imgur.com/0MFmMgP.png",
                        "http://i.imgur.com/J0kzX57.png",
                        "http://i.imgur.com/SPwd4nK.png",
                        "http://i.imgur.com/5kKCdOr.png",
                        "http://i.imgur.com/GWilhAr.png",
                        "http://i.imgur.com/sHnVpCa.png",
                        "http://i.imgur.com/7cSJx93b.jpg",
                        "http://i.imgur.com/GyBOmb7b.jpg",
                        "http://i.imgur.com/hvyf9ajb.jpg",
                        "http://i.imgur.com/BtQTksgb.jpg",
                        "http://i.imgur.com/j8jhhlC.png",
                        "http://i.imgur.com/p44Z0be.png",
                        "http://i.imgur.com/MHsLmrJb.jpg",
                        "http://i.imgur.com/DwVMyvNb.jpg",
                        "http://i.imgur.com/JVH75lWb.jpg",
                       "http://i.imgur.com/2CITlyFb.jpg",
                       "http://i.imgur.com/E2ZvG5ib.jpg",
                       "http://i.imgur.com/N90hKgIb.jpg",
               ];
window.addEventListener('keydown', keydown);
function keydown(e) {
    if(e.keyCode === 67 && !($("#input_box2").is(":focus"))) {
        skinChanger = !skinChanger;
    }
    if(e.keyCode === 27) {
        skinChanger = false;
    }
}
//$('.content').append('<input style="border:1px solid grey;" placeholder="Time between skin change (milliseconds)" id="skin_change_inputSpeed" value="500" type="number" min="300"/>');
 
 
 
setInterval(function(){
    if(skinChanger) {
        document.getElementById('skin_url').value = skinList[i];
        i++;
        if(i === skinList.length) {i = 0;}
        setNick(document.getElementById('nick').value);
    }
},skinSpeed);
//$('#overlays2').append('<h6 style="margin-left:500px">Agarlist Skin Changer by Da Tiger</h6>')
 
 
//To put it on press c, add skins by "skin url", enjoy