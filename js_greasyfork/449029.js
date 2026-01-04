// ==UserScript==
// @name         Woomy Bot
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Get a bot to play woomy for you!
// @author       Drako Hyena
// @match        https://woomy.surge.sh/
// @match        https://woomy-arras.netlify.app
// @match        https://www.woomy-arras.xyz/
// @grant        none
// @run-at       document-start
// @require      https://greasyfork.org/scripts/448888-woomy-modding-api/code/Woomy%20Modding%20Api.js?version=1085075
// @downloadURL https://update.greasyfork.org/scripts/449029/Woomy%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/449029/Woomy%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict'
    // Wait for the api to load
    if(window.WMA&&window.WMA.loaded){
        run()
    }else{
        if(window.WMALoadQueue){
            window.WMALoadQueue.push(run)
        }else{
            window.WMALoadQueue = [run]
        }
    }

    // Once the api is loaded run this function
    function run(){
        let teamColor = null
        let subId = null
        let button = window.WMA.createButton("BOT mode", "off", ()=>{
            let moreInfo = button.children[1]
            if(moreInfo.innerHTML === "off"){
                teamColor = null
                moreInfo.innerHTML = "on"
                subId = window.WMA.entities.sub(runBot)
            }else if(moreInfo.innerHTML === "on"){
                moreInfo.innerHTML = "off"
                window.WMA.entities.unsub(subId)
                subId = null
            }
        })

        let tick = 0;
        let yourPlayerId = null;
        let yourPlayer = {};
        function aim(closest){
            window.WMA.socket.cmd.set(4, 1); // fire
            let target = window.WMA.global.globalArray[102][0]
            let cord = Object.keys(window.WMA.global.globalArray[102][1]).map(key=>key)
            window.WMA.global[target][cord[0]] = (closest.x-window.WMA.yourPlayer.position.x)
            window.WMA.global[target][cord[1]] = (closest.y-window.WMA.yourPlayer.position.y)
        }
        function runBot(entities){
            if(!window.WMA.yourPlayer.entity) return;
            let closest = {distance:Infinity, x:Infinity, y:Infinity, entity:null}
            let closestPlayer = {distance:Infinity, x:Infinity, y:Infinity, entity:null}
            for (let entity of entities){
                if(entity.color === window.WMA.yourPlayer.entity.color||entity.color === 16/*rocks*/) continue;
                let distance = Math.hypot(window.WMA.yourPlayer.position.x - entity.x,window.WMA.yourPlayer.position.y - entity.y)
                if(entity.name&&entity.name!==window.WMA.yourPlayer.entity.name){
                    if(distance<closestPlayer.distance){
                        closestPlayer = {
                            distance: distance,
                            x: entity.x,
                            y: entity.y,
                            entity: entity,
                        }
                    }
                }
                if(distance<closest.distance){
                    closest = {
                        distance: distance,
                        x: entity.x,
                        y: entity.y,
                        entity: entity,
                    }
                }
            }
            if(closest.entity === null) return
            // Movement
            if (yourPlayer.health < 0.5){
                aim(closest)
                window.WMA.move.to(closest.x, closest.y, 100)
            }else if (!closestPlayer.entity){
                aim(closest)
                window.WMA.move.to(closest.x, closest.y, 100)
            }else if(closest.distance>closestPlayer.distance){
                aim(closestPlayer)
                    if (closest.distance<10){
                        aim(closest)
                    }
                window.WMA.move.away(closestPlayer.x, closestPlayer.y, 100)
            }else{
                aim(closestPlayer)
                window.WMA.move.to(closestPlayer.x, closestPlayer.y, 100)
            }
        }
    }
})();