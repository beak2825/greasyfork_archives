// ==UserScript==
// @name         Manyland Shift + Middle-click teleport (with particle trail)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Allows you to teleport by holding shift and then middle-clicking. It also has a particle trail
// @author       Eternity
// @match        http://manyland.com/*
// @icon         https://www.google.com/s2/favicons?domain=manyland.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428722/Manyland%20Shift%20%2B%20Middle-click%20teleport%20%28with%20particle%20trail%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428722/Manyland%20Shift%20%2B%20Middle-click%20teleport%20%28with%20particle%20trail%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function sparkle(position) {
        ig.game.websocket.wssend(ig.game.websocket.ws, "it", position)
    }

    //Thank you MTP3!
    function whiteSparkle(a, b, c, d) {
        a = {
            x: Math.round(100 * a.x) / 100,
            y: Math.round(100 * a.y) / 100
        };

        Math.round(1E3 * c.x);
        Math.round(1E3 * c.y);
        ig.game.websocket.wssend(ig.game.websocket.ws, "lc", {
            pos: a,
            end: b,
            vel: c,
            flp: d
        })
    }

    async function loadObf() {
        if (typeof Deobfuscator == 'undefined')
            await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js")
 
    }

    function main() {
        ig.game.player.kill = function() {};
        ig.game.decorator.collectSparkles = Deobfuscator.function(ig.game.decorator, 'Math.floor(f/5),g,d=d/f,h=e/f,k=1;k<=f;k++', false);
        ig.game.decorator.portalSparkles = Deobfuscator.function(ig.game.decorator, 'e?e:10;a-=5;b-=5;this', false);
        let oldUpdate = ig.game.update;

        ig.game.update = function() {
            let result = oldUpdate.apply(this, arguments);

            if (ig.input.state('shift') && ig.input.pressed('middleclick')) {
                let x = ig.game.screen.x + ig.input.mouse.x;
                let y = ig.game.screen.y + ig.input.mouse.y;

                sparkle({x: ig.game.currentMapCoordsForMouse.x, y: ig.game.currentMapCoordsForMouse.y})
                ig.game.decorator.portalSparkles(ig.game.player.pos.x, ig.game.player.pos.y, 0, 0, 3);
                ig.game.decorator.portalSparkles(ig.game.player.pos.x, ig.game.player.pos.y, 0, 0, 6);
                whiteSparkle(ig.game.player.pos, {x: 0, y: 0}, {x: 0, y: 0}, 0);

                ig.game.decorator.collectSparkles(ig.game.player, {x: x/ig.game.tileSize, y: y/ig.game.tileSize})
                ig.game.player.pos = {x: x, y: y -25}
                whiteSparkle(ig.game.player.pos, {x: 0, y: 0}, {x: 0, y: 0}, 0);
            }

            return result;
        }
    }

    !function loader() {
        let loading = setInterval(() => {
            if(typeof ig === "undefined") return
            else if(typeof ig.game === "undefined") return
            else if(typeof ig.game.screen === "undefined") return
            else if(ig.game.screen.x == 0) return
    
            clearInterval(loading)
            loadObf().then(() => {
                main();
            })
        }, 250)
    }()
    
   
})();