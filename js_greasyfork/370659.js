// ==UserScript==
// @name         OWOP brush enhanced
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Feels natural af
// @author       JackRed, originally by Quazard
// @match        http://ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370659/OWOP%20brush%20enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/370659/OWOP%20brush%20enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

(function() {
    setTimeout(function() {
        if (OWOP) {
            OWOP.tool.addToolObject(new OWOP.tool.class('Brush', OWOP.cursors.brush, OWOP.fx.player.RECT_SELECT_ALIGNED(16), false, function(tool){
                let inprog = false;
                const set = (x, y, color) => {
                    OWOP.net.protocol.lastSentX = x*16;
                    OWOP.net.protocol.lastSentY = y*16;
                    OWOP.net.connection.send(new Int32Array([OWOP.net.protocol.lastSentX, OWOP.net.protocol.lastSentY, 0]).buffer);
                    OWOP.world.setPixel(x, y, color);
                };
                const eq = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
                function clearChunk(chunkX, chunkY){

                }
                tool.setEvent('mousemove mousedown', function(mouse, event){
                    if(mouse.buttons != 0){
                        if(mouse.buttons == 1) var brushercolor = OWOP.player.selectedColor; else if(mouse.buttons == 2) var brushercolor = [255,255,255];
                        if(mouse.buttons == 1 || mouse.buttons == 2) {
                        var xpos = OWOP.mouse.tileX;
                        var ypos = OWOP.mouse.tileY;
                        OWOP.world.setPixel(xpos, ypos, brushercolor, 0);
                        OWOP.world.setPixel(xpos+1, ypos+1, brushercolor, 0);
                        setTimeout(function() {
                        OWOP.world.setPixel(xpos+1, ypos, brushercolor, 0);
                        OWOP.world.setPixel(xpos, ypos+1, brushercolor, 0);
                            }, 100);
                        }

                    }
                    inprog = true;
                });
            }));
        }
    }, 1000);
})()