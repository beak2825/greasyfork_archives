// ==UserScript==
// @name         ESP Mod | Shell Shockers | flygOn LiTe
// @namespace    https://berrywidgets.com/
// @version      1.3
// @description  See Players through walls. Extrasensory perception (ESP).
// @author       flygOn LiTe
// @match        https://shellshock.io/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://algebra.best/*
// @match        https://scrambled.today/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463599/ESP%20Mod%20%7C%20Shell%20Shockers%20%7C%20flygOn%20LiTe.user.js
// @updateURL https://update.greasyfork.org/scripts/463599/ESP%20Mod%20%7C%20Shell%20Shockers%20%7C%20flygOn%20LiTe.meta.js
// ==/UserScript==
 (function() {
      'use strict';


      //used to store player data
      window.players = new Map();
      window.myPlayer = null;

      //store original push method
      var push = Array.prototype.push;

      //intercept any calls to push to add player data to the window.players map
      Array.prototype.push = function(data) {

          try{
            //checks if the first argument passed to the push method has a player property and an id property. If it does, it stores the player object in the window.players map object with the id property as the key
              if(arguments[0].player && arguments[0].id){
                  window.players.set(arguments[0].player.id, arguments[0].player);

              }
          }catch(e){
            console.log(e);
          }
          //returns the result of calling the original push method, the value of this is the Array object that the method is called on.
          return push.apply(this, arguments);
      }


      const getNearest = (myPlayer, them) => {

          let nearest = {object:null,dist:999};

          them.forEach((obj, ts) =>{

              if(!obj.derp && obj.actor){
                  Object.defineProperty(obj.actor.bodyMesh, 'renderingGroupId',  {
                      get: () => {
                          return 1;
                      }
                  });

                  const setVis = obj.actor.mesh.setVisible;
                  obj.actor.mesh.setVisible = function(args){
                          return setVis.apply(this,[true]);
                  }

                  obj.derp = true;
              }

              if(obj && obj.id != myPlayer.id && obj.hp > 0 && (obj.team == 0 || (obj.team != myPlayer.team))){

                  let dist = calcDist2d(myPlayer, obj);

                  if(dist < nearest.dist){
                      nearest.dist=dist;
                      nearest.object=obj;
                  }
              }


          })
          return nearest;
      }
      //Calculates the distance between two points in 3D space
      const calcDist2d = (player1, player2)=>{return Math.sqrt((player1.x-player2.x)**2 + (player1.y-player2.y)**2 + (player1.z-player2.z)**2)};

      const clearRect = requestAnimationFrame;

      requestAnimationFrame = function(){

          window.players.forEach((obj, ts) =>{
              if(obj.ws){
                  window.myPlayer = obj;
                  window.players.delete(obj.id);
              }
          });

          if(window.myPlayer){
              getNearest(window.myPlayer, window.players);
          }

          return clearRect.apply(this,arguments);
      }
  })();








