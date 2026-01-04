// ==UserScript==
// @name         Bloble.io Auto Place and Zoom in and out Combination
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Zoom in and Zoom out, Press 1, 2, 3, 4, 5, 6, or 7 *depending on which building you want to place automatically* NaTh BuildSystem 1.2 + ZOOM HACK for Bloble.io! Sorry for Copying. Before installing this script, Get the Extension: Tampermonkey
// @author       BuildFast (Credit goes to MaximusSRB Zoom hack and this unknown guy who made NaTh BuildSystem 1.2)
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37312/Blobleio%20Auto%20Place%20and%20Zoom%20in%20and%20out%20Combination.user.js
// @updateURL https://update.greasyfork.org/scripts/37312/Blobleio%20Auto%20Place%20and%20Zoom%20in%20and%20out%20Combination.meta.js
// ==/UserScript==

$("#youtuberOf").hide();
$("#youtubeFollow").hide();
$("#adCard").hide();
$("#mobileInstructions").hide();
$("#promoImgHolder").hide();
$("#downloadButtonContainer").hide();
$("#mobileDownloadButtonContainer").hide();
$(".downloadBadge").hide();

var scroll = 0;

mainCanvas.addEventListener ? (window.addEventListener("mousewheel", zoom, !1),
                               mainCanvas.addEventListener("DOMMouseScroll", zoom, !1)) : window.attachEvent("onmousewheel", zoom);

function zoom(a) {
    a = window.event || a;
    a.preventDefault();
    a.stopPropagation();
    scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail))
    if (scroll == -1) { //zoom out
        if (maxScreenHeight < 10000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize());
            scroll = 0
        }
    }

    if (scroll == 1) { //zoom in
        if (maxScreenHeight > 1000) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize())
            scroll = 0
        }
    }
}

mainCanvas.onkeydown = function(event) {
    var k = event.keyCode ? event.keyCode : event.which;
    if (k == 70) { // F to zoom out
        if (maxScreenHeight < 10000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize());
        }
    }
    if (k == 67) {// C to zoom in
        if (maxScreenHeight > 1000) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize())
        }

    }

    {if(65==a||37==a)cameraKeys.l=0,updateCameraInput();if(68==a||39==a)cameraKeys.r=0,updateCameraInput();if(87==a||38==a)cameraKeys.u=0,updateCameraInput();if(83==a||40==a)cameraKeys.d=0,updateCameraInput();if(32==a){var d=unitList.indexOf(activeUnit);sendUnit(d)}void 0!=upgrInputsToIndex["k"+a]&&toggleActiveUnit(upgrInputsToIndex["k"+a]);46==a&&selUnits.length&&sellSelUnits();84==a&&toggleChat("none"==chatListWrapper.style.display);
     27==a&&(toggleActiveUnit(),disableSelUnit(),showSelector=!1);82==a&&(camY=camX=0)}};mainCanvas.onkeydown=function(a){a=a.keyCode?a.keyCode:a.which;socket&&player&&!player.dead&&(65!=a&&37!=a||cameraKeys.l||(cameraKeys.l=-1,cameraKeys.r=0,updateCameraInput()),68!=a&&39!=a||cameraKeys.r||(cameraKeys.r=1,cameraKeys.l=0,updateCameraInput()),87!=a&&38!=a||cameraKeys.u||(cameraKeys.u=-1,cameraKeys.d=0,updateCameraInput()),83!=a&&40!=a||cameraKeys.d||(cameraKeys.d=1,cameraKeys.u=0,updateCameraInput()))}


     addEventListener("keydown", function(a) {
         if (a.keyCode == 51) { //Generators
             for(i=-3.14;i<=2.36;i+=0.050){
                 socket.emit("1",i,132,3);
             }
         }
         if (a.keyCode == 54) { //Armory
             socket.emit("1",UTILS.roundToTwo(2.75),UTILS.roundToTwo(175),7);
         }
         if (a.keyCode == 52) { //Houses
             for(i=-3.134;i<=2.492;i+=0.04620){
                 socket.emit("1",i,194,4);
             }
         }

         if (a.keyCode == 50) {//Turrets
             socket.emit("1",2.75,245.75,2);socket.emit("1",2.50,245,2);socket.emit("1",3,245,2);
             for(i=-2.98;i<=2.2;i+=0.3235){
                 socket.emit("1",i,245,2);
             }
         }
         if (a.keyCode == 49) {//Walls
             for(i=-3.14;i<3.14;i+=0.216){
                 socket.emit("1",i,1e3,1);
             }
         }
         if (a.keyCode == 55) {//Barracks
             socket.emit("1",0.32,310,8);
             socket.emit("1",-0.98,310,8);
             socket.emit("1",1.61,310,8);
             socket.emit("1",-2.27,310,8);
         }
     });

addEventListener("keydown", function(a) {
    if (a.keyCode == 77){
        for(i=0;i<users.length;++i){
            if(users[i].name.startsWith("[G]")&&users[i].name !== player.name){
                camX = users[i].x-player.x;
                camY = users[i].y-player.y;
            }
        }
    }
});
