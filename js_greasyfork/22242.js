// ==UserScript==
// @name         Sincere Skin changer
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Add skin changing
// @author       Tinsten
// @match        http://agarlist.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22242/Sincere%20Skin%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/22242/Sincere%20Skin%20changer.meta.js
// ==/UserScript==
var skinChanger = false;
var i = 0
var skinSpeed = 900;
var skinList = ["http://i.imgur.com/n1ap9gN.jpg",
                "http://i.imgur.com/xhCMDg8.jpg",
                "http://i.imgur.com/duiRWkd.jpg",
                "http://i.imgur.com/yjJN2bz.jpg",
                "http://i.imgur.com/p2h8cBr.jpg",
                "http://i.imgur.com/MrgbWuU.png",
                "http://i.imgur.com/vgRKwrc.png",
                "http://i.imgur.com/rJF76yz.png",
                "http://i.imgur.com/H7BHANq.png",
                "http://i.imgur.com/Z1UMln9.png",
                "http://i.imgur.com/ga9o23E.png",
                "http://i.imgur.com/ul9o1nL.png",
                "http://i.imgur.com/fgMQfA6.png",
                "http://i.imgur.com/KocW2YW.png",
                "http://i.imgur.com/QeESGLG.png",
                "http://i.imgur.com/vchpRA2.png",
                "http://i.imgur.com/XYH0wUc.png",
                "http://i.imgur.com/osH5xAB.png",
                "http://i.imgur.com/KniTIu7.jpg",
                "http://i.imgur.com/hFniY0F.png",
                "http://i.imgur.com/n2pjurK.png",
                "http://i.imgur.com/J3OUB7Y.jpg",
                "http://i.imgur.com/R0eBnte.png",
                "http://i.imgur.com/C84csvd.png",
                "http://i.imgur.com/AzfjIKk.png",
                "http://i.imgur.com/NQYbAQF.png",
                
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
//$('#overlays2').append('<h6 style="margin-left:500px">Agarlist Skin Changer by Tinsten</h6>')