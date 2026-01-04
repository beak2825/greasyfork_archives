// ==UserScript==
// @name         NaTh BuildSystem 1.2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32878/NaTh%20BuildSystem%2012.user.js
// @updateURL https://update.greasyfork.org/scripts/32878/NaTh%20BuildSystem%2012.meta.js
// ==/UserScript==
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
