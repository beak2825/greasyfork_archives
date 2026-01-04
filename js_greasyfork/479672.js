// ==UserScript==
// @name         Voxiom.io ORE/BASE/DUNGEON XRAY! (WORKING 2024)
// @namespace    http://tampermonkey.net/
// @version      2.1.5
// @description  Simple yet versatile script for voxiom
// @author       You
// @match        https://voxiom.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voxiom.io
// @grant        none
// @license      do whatever just give credit to me lol
// @downloadURL https://update.greasyfork.org/scripts/479672/Voxiomio%20OREBASEDUNGEON%20XRAY%21%20%28WORKING%202024%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479672/Voxiomio%20OREBASEDUNGEON%20XRAY%21%20%28WORKING%202024%29.meta.js
// ==/UserScript==

//Hey there, cheater!
//
//This script is made by ExplodIng_Andrey on discord!
//Want more epic scripts?
//Join up! https://discord.gg/gcq4gDy6te
//If you can, you can also buy the voxiom.io hacked client which has epic features like aimbot!
//
//WARNINGS ABOUT THIS SCRIPT:
//It won't work too great within first loaded chunks when you spawn in the server, make sure to travel out to new territory before digging down
//Also it can't be toggled with ease, you will need to reload the page for it to take effect
//
//Enjoy!

//added return because this script is patched
return

//Script configuration below ↓↓↓

var method = "new"; // possible values: "new" and "old" , if this is set to "old" rock will be visible but transparent

//Script configuation above ↑↑↑

workers=[];
Worker = class extends Worker{
  constructor () {
     super(...arguments);
     window.workers.push(this);
  }
  postMessage () {
     if(method == "new") {
       var index = -1;
       Object.values(arguments[0]).forEach(function (a,b) {
          if(a.length == 32768) {
            index = b;
          }
       });
       index != -1 ? arguments[0][Object.keys(arguments[0])[index]]=Uint8Array.from(Array.from(Object.values(arguments[0])[index]).join().replaceAll(",4,",",0,").replaceAll(",4,",",0,").split(",").map(function(e){return Number(e)})) : 0;
     }
     super.postMessage(...arguments);
  }
}

//how sneaky, dev :3
Worker.toString=function(){return 'function Worker() { [native code] }'}

Blob = class extends Blob {
  constructor () {
      try {
          if(arguments[0][0].includes("Rock") && method == "old") {
              //for debug
              console.log(arguments[0][0]);

              var a = "':!!0x0,'WVe':!0x0,'WVo':{'WVg':{'WVV':-0x99,'WVW':-0x99},'WVd':{'WVV':-0x99,'WVW':-0x99},'WVE':{'WVV':-0x99,'WVW':-0x99},'WVh':{'WVV':-0x99,'WVW':-0x99},'WVL':{'WVV':-0x99,'WVW':-0x99},'WVx':{'WVV':-0x99,'WVW':-0x99}}";
              arguments[0][0]=arguments[0][0].replaceAll("':!0x0,'WVe':!0x0,'WVo':{'WVg':{'WVV':0x1,'WVW':0x1},'WVd':{'WVV':0x1,'WVW':0x1},'WVE':{'WVV':0x1,'WVW':0x1},'WVh':{'WVV':0x1,'WVW':0x1},'WVL':{'WVV':0x1,'WVW':0x1},'WVx':{'WVV':0x1,'WVW':0x1}}", a);
          }
      } catch (e) {
           //no fuϲks given
      }
     super(...arguments);
  }
}