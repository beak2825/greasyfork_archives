// ==UserScript==
// @name         Stun
// @namespace    http://tampermonkey.net/
// @version      69.420 cool verson xxx
// @description  try to take over the world!
// @author       ta
// @match        https://starve.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421088/Stun.user.js
// @updateURL https://update.greasyfork.org/scripts/421088/Stun.meta.js
// ==/UserScript==
(function() {
    'use strict';
    (() => {
        const c = String.prototype.indexof;
        String.prototype.indexof = (e) => {
            return /nati/.test(e) ? true : c.apply(this, arguments);
        }
    })()

    let ourangle = 0;
    let isChatOpen = document.getElementById("chat_block").style.display === "inline-block"; // it needs to update :),
    let manuelcrown = false;
    class Stone{
        constructor(x,y,id,ownerID, placeID){
            this.x = x;
            this.y = y;
            this.id = id;
            this.ownerID = ownerID;
            this.placeID = placeID;
        }
    }

    const PlayerInfo = {x: null, y: null};

    const resurrectionStones = new Map();

    const handlePacket = (buffer, INT8, bool)=>{
        const INT16 = new Uint16Array(buffer);
        if (bool) {
            //do something
        }
        bool = (INT8.length - 2) / 18;
        for (var i = 0; i < bool; i++) {
            var f = 2 + 18 * i;
            var g = 1 + 9 * i;
            var h = INT8[f]; //this is the player ID
            var ACTION = INT16[g + 1]; // |=
            var ID = INT16[g + 5];
            var UNIQUEID = h * 1000 + ID; //unique id in the game

            var TYPE = INT16[g + 2];
            var X = INT16[g + 3];
            var Y = INT16[g + 4];
            var INFO = INT16[g + 6];
            var v = INT16[g + 7];
            var g = INT16[g + 8];
            var ANGLE = INT16[f + 1] / 255 * Math.PI * 2;
            if(TYPE === 22){ //resurection stone id
                const cache_stone = resurrectionStones.get( UNIQUEID )
                if(cache_stone){
                    cache_stone.x = X;
                    cache_stone.y = Y;
                    cache_stone.ownerID = h
                    cache_stone.id = UNIQUEID;
                }else{
                    resurrectionStones.set( UNIQUEID, new Stone(X, Y, UNIQUEID, h,

ID) );
                }
            }
            if(TYPE === 0) //player type is 0
            {
                if(ID === 0){
                    //its our player
                    if(X || Y){
                        PlayerInfo.x = X;
                        PlayerInfo.y = Y;
                    }
                }
            }
        }
    }

    const dist2D = (a, b) =>{
        return Math.sqrt(  Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2))
    }

    const getNearest = (player)=>{

        const nearest = {stone: null, dist: null};
        resurrectionStones.forEach(stone=>{
            const dist = dist2D(player, stone);
            if(!nearest.stone || dist < nearest.dist){
                nearest.dist = dist;
                nearest.stone = stone;
            }
        })
        return nearest.stone;
    }
    function anglefinder(){
        WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
            apply: function(target, scope, args){
                if(typeof(args[0])==='string'){
                    let json = JSON.parse(args[0]);
                    if(json[0] === 3){
                        ourangle = json[1];
                    }

                }
                let data = target.apply(scope,args);
                return data;
            }
        })
    };
    anglefinder();
    WebSocket = new Proxy(WebSocket, {
        construct(target, args){
            const instance = new target(...args);

            const oldFrame = requestAnimationFrame;
            let lastUpdate = 0;
            const TICK_PER_SECOND = 0.1;
            const nearestStone = getNearest(PlayerInfo);
            let runOurCode = false
            window.requestAnimationFrame = function(){
                const now = performance.now();
                const delta = (now - lastUpdate);
                if(delta < 10) return oldFrame.apply(this,arguments);
                if(runOurCode){
                    const packet5 = JSON.stringify([6,7]);
                    instance.send(packet5);
                }
                lastUpdate = now;
                return oldFrame.apply(this,arguments)
            }

            document.addEventListener('keydown', function(e){
                if(e.code === "KeyQ"){
                    runOurCode = !runOurCode;
                }
            })
            return instance;
        }
    })
})();