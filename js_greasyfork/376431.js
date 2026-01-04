// ==UserScript==
// @name         Win Rate Balls
// @namespace    https://greasyfork.org/en/users/165569-electron
// @version      1.0
// @description  Displays win rate on balls
// @author       Electro
// @match        http://*.koalabeast.com:*
// @match        http://tagpro-*.koalabeast.com:*
// @match        http://*.koalabeast.com/game
// @supportURL   https://www.reddit.com/message/compose/?to=-Electron-
// @website      https://streamlyne.stream
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376431/Win%20Rate%20Balls.user.js
// @updateURL https://update.greasyfork.org/scripts/376431/Win%20Rate%20Balls.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const degreeStyle = new PIXI.TextStyle({
        dropShadow: true,
        dropShadowAlpha: 0.5,
        dropShadowAngle: 0.5,
        dropShadowBlur: 4,
        dropShadowDistance: 1,
        fill: "white",
        fontSize: 10,
        lineJoin: "round",
        strokeThickness: 3
    });

    // Wait until the tagpro object exists, and add the function to tagpro.ready
    function addToTagproReady(fn) {
        // Make sure the tagpro object exists.
        if (typeof tagpro !== "undefined") {
            tagpro.ready(fn);
        } else {
            // If not ready, try again after a short delay.
            setTimeout(function() {
                addToTagproReady(fn);
            }, 0);
        }
    }

    addToTagproReady(function() {
        // Listen for the playerLeft event on the game socket.
        tagpro.socket.on("p", function(obj) {
            // Make sure game is not over.
            if(obj.u){
                let players = obj.u;
                // console.log(players);

                players.forEach((item, idx) => {
                    // console.log(tagpro.players[item.id]);
                    if(tagpro.players[item.id].sprites){
                        // console.log(tagpro.players[item.id].sprites.winrate, tagpro.players[item.id]);
                        if(!tagpro.players[item.id].scriptFinished && !tagpro.players[item.id].name.includes("Some Ball ")){
                            tagpro.players[item.id].scriptFinished = true;
                            fetch("https://parretlabs.xyz:8006/tagpro_profile/" + tagpro.players[item.id].name).then(a => a.json()).then(json => {
                                if(tagpro.players[item.id].name === json.displayName){
                                    tagpro.players[item.id].sprites.winrate = new PIXI.Text(json.rollingWin, degreeStyle);
                                    tagpro.players[item.id].sprites.winrate.anchor.x = -1.25;
                                    tagpro.players[item.id].sprites.winrate.anchor.y = -0.4;
                                    tagpro.players[item.id].sprite.addChild(tagpro.players[item.id].sprites.winrate);
                                }
                            });
                        }
                    }
                });
            }
        });
    });
})();