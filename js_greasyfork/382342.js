// ==UserScript==
// @name         narwhaleHax vBetter
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  better than other narwhale hax
// @author       You
// @match        *://narwhale.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382342/narwhaleHax%20vBetter.user.js
// @updateURL https://update.greasyfork.org/scripts/382342/narwhaleHax%20vBetter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load",function(){
      game.options.viewScale=.345;
      game.handleResize();
      var speedboosting=0,
          mpos=[0,0],
          speedboosttimer=0,
          lastviewscale=1,
          midviewscale=(1+(.8/.69))/2;
      var bruhint=setInterval(()=>{
          if(game.scene!==undefined){
              game.targetviewscale=midviewscale;
              clearInterval(bruhint);
              setInterval(()=>{
                  var scrollDiff=game.targetviewscale-lastviewscale;
                  game.options.viewScale+=scrollDiff;
                  game.options.viewScale=Math.max(.1,game.options.viewScale);
                  if(scrollDiff!=0)game.handleResize();
                  game.targetviewscale=midviewscale;
                  lastviewscale=midviewscale;
              },0);
          }
      },0);
      window.addEventListener("keydown",function(e){
          if(e.key.toLowerCase()=="e")speedboosting=1;
      },false);
      window.addEventListener("keyup",function(e){
          if(e.key.toLowerCase()=="e")speedboosttimer=speedboosting=0;
      },false);
      window.addEventListener("mousemove",function(e){
          mpos=[e.clientX,e.clientY];
      },false);
      setInterval(()=>{
        //game.dashable=true;
        game.isDead=false;
          /*
        var scrollDiff=game.targetviewscale-lastviewscale;
        game.options.viewScale+=scrollDiff;
        game.options.viewScale=Math.max(.1,game.options.viewScale);
        if(scrollDiff!=0)game.handleResize();
        game.targetviewscale=midviewscale;
        lastviewscale=midviewscale;
        */
        if(speedboosting){
            //game.timeSlowFactor=.1;
            //game.update(.1)
            speedboosttimer=1-speedboosttimer;
            if(speedboosttimer){
              game.handleMove(window.innerWidth-mpos[0],window.innerHeight-mpos[1]);
              game.SetKeyDown(32);
              game.emitInput();
            }else{
              game.SetKeyUp(32);
              game.emitInput();
              game.handleMove(mpos[0],mpos[1]);
            }


        }
        //game.nowlevel=99;
        //if(game.gameStarted)game.currentControl=game.currentControl==0?16:0;
        //game.displayNarwhal.invincibleDur=999;
        //game.displayNarwhal.curDash=999;
        //game.displayNarwhal.overDash=999;
        //game.displayNarwhal.maxDash=999;
      },0);
      //try{setInterval(()=>game.handleLevelUp(500,[0,1,2,3,4,5],++game.nowlevel),100);}catch(e){}

      //game.dashable=true;
      game.isDead=false;
      //game.displayNarwhal.invincibleDur=999;
      //game.displayNarwhal.curDash=999;
      //game.displayNarwhal.overDash=999;
      //game.displayNarwhal.maxDash=999;
      //game.nowlevel=99;
      //Object.freeze(game.dashable);
      Object.freeze(game.isDead);
      //Object.freeze(game.displayNarwhal.maxDash);
      //Object.freeze(game.displayNarwhal.invincibleDur);
      //Object.freeze(game.nowlevel);
    },false);
})();