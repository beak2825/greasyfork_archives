// ==UserScript==
// @name         zorHax vBetter
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  Better than other zor hax
// @author       You
// @match        *://zorb.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382196/zorHax%20vBetter.user.js
// @updateURL https://update.greasyfork.org/scripts/382196/zorHax%20vBetter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.isSpeedDetect=0;
    window.addEventListener('load',function(){
        (async ()=>{
          while(!document.querySelector("#input-name"))await new Promise(r=>setTimeout(r,0));
          document.querySelector('#input-name').maxLength=20;
        })();
        ZOR.UI.data.marquee_messages=["Welcome to zorHax vBetter!","Hold E to instantly grow to max size!<br/>(use this and eat someone else to keep size)","Hold R to get speed! (not affected by player scale!)","<a href=\"https://greasyfork.org/scripts/382196\" target=\"_blank\">https://greasyfork.org/scripts/382196</a>","More features coming soon!","working on color change and no dying","hold s/rclick to pause"];
        ZOR.UI.data.news_link="https://greasyfork.org/scripts/382196";
        ZOR.UI.data.news_text="zorHax vBetter = Epic"
        ZOR.UI.data.AUTHORS.push("Creator of zorHax vBetter");
        if(!ZOR.UI.data.player_name.startsWith("[zorHax] "))ZOR.UI.data.player_name="[zorHax] "+ZOR.UI.data.player_name;
        window.console=Raven._originalConsoleMethods;
        window.oldConsoleLog=window.console.log;
        window.console.log=function(){
          if([...arguments].join(" ")=="Game started!")window.scanForCurrentPlayer();
          if([...arguments].join(" ")=="WARNING! You are speeding!")window.isSpeedDetect=1;
          window.oldConsoleLog(...arguments);
        };
        window.console.log=window.console.log.bind(window.oldConsole);
        setInterval(()=>{
            ZOR.UI.engine.set("player_color",Math.floor(Math.random()*ZOR.UI.data.COLORS.length));
            if(currentPlayer()==null)return;//place all current player dependant stuff below me, all others above
            currentPlayer().view.playerColor=ZOR.UI.data.COLORS[ZOR.UI.data.player_color];
            currentPlayer().view.mainSphere.material.uniforms.color.value=new THREE.Color(currentPlayer().view.playerColor);
            //TODO: set colors array to 0 length and force color index 0. to change color create it and set it to that array index of 0's value and update
        },1000);
        window.currentPlayer=function(){return null;};
        setInterval(()=>{
          if(window.currentPlayer()==null)return;
          window.currentPlayer().model.sphere.expectedScale=window.currentPlayer().model.sphere.scale;
          window.currentPlayer().view.update(window.currentPlayer().model.sphere.expectedScale);
          window.currentPlayer().model.abilities.speed_boost.active_duration=0;
          window.currentPlayer().model.abilities.speed_boost.cooldown_delay=0;
          if(window.currentPlayer().isDead)window.currentPlayer().isDead=false;
          if(zorhax.grow){
            if(window.isSpeedDetect==1){
              window.isSpeedDetect=2;
              setTimeout(()=>{
                if(window.isSpeedDetect==2)window.isSpeedDetect=0;
              },3750);
            }
            if(window.isSpeedDetect==0)window.currentPlayer().model.sphere.scale=289.999999;
          }
          if(zorhax.grow||zorhax.speed){
            //somehow disables anticheat :D
            window.currentPlayer().speedBoostStart();
            window.currentPlayer().speedBoostStop();
          }

        },0);
    },false);
    if(window.currentPlayer==null)window.currentPlayer=function(){return null;};
    var zorhax={grow:false,speed:false},keyhandler=function(e){
      if(window.currentPlayer()==null)return;
      if(e.type.endsWith("n")){
        //key down
        switch(e.key.toLowerCase()){
          case "e":
          zorhax.grow=true;
          break;
          case "r":
          zorhax.speed=true;
          break;
        }
      }else{
        //key up
        switch(e.key.toLowerCase()){
          case "e":
          zorhax.grow=false;
          break;
          case "r":
          zorhax.speed=false;
          break;
        }
      }
    };
    window.addEventListener("keydown",keyhandler,false);
    window.addEventListener("keyup",keyhandler,false);
    window.scanForCurrentPlayer=function(){
      Object.keys(ZOR.Game.players).forEach(p=>{
        if(typeof ZOR.Game.players[p]!="undefined"){
          if(ZOR.Game.players[p].is_current_player){
            window.currentPlayer=function(){return ZOR.Game.players[p];};
            window.currentPlayer().model.abilities.speed_boost.isReady=function(){return true;};
            window.currentPlayer().model.abilities.speed_boost.min_scale=0;
            window.currentPlayer().handleCapture=function(){};//not sure if does anything
            window.currentPlayer().getNormSpeed=window.currentPlayer().getSpeed;
            window.currentPlayer().getSpeed=function(){return (zorhax.speed?5:window.currentPlayer().getNormSpeed());};
          }
          console.log(ZOR.Game.players[p]);
        }
      });
    }
})();