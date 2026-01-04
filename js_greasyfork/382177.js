// ==UserScript==
// @name         limaxHax vBetter
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  better than other limax hax
// @author       You
// @match        *://limax.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382177/limaxHax%20vBetter.user.js
// @updateURL https://update.greasyfork.org/scripts/382177/limaxHax%20vBetter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alpha=50;
    //disable loading ads script
    function objHider(o){this.getObject=function(){return o;}}
    window.getScript=new objHider({}).getObject();
    //on load
    window.addEventListener('load',function(){
        //disable ads when start is clicked
        //change ad player to start
        window.initAipPreroll=document.getElementById("play").onclick=function(){start();};
        //define empty ad funcs and make built in skin hack detector do nothing
        window.skin_hack=window.cgAdControlOff=window.cgAdControlOn=function(){};
        //override handshake function
        window.oldHandshake=handshake;
        handshake=function(a){
          var newA=a;
          newA[1].bonus_max=999;
          oldHandshake(newA);
          console.log(a,newA);
        };
        //change opacity of your player
        window.customAlpha=50;
        setInterval(()=>{
          players_alpha[true_id]=window.customAlpha;
          alpha=window.customAlpha/100;
        },0);
        setInterval(()=>window.customAlpha=Math.floor(51*Math.random()+50),1000);
    },false);
})();