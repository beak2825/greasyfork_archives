// ==UserScript==
// @name         drones like real!
// @version      1.6669
// @description  just look at 'em all!
// @author       shadam hussein
// @match        *://diep.io/*
// @grant        none
// @namespace https://greasyfork.org/users/176941
// @downloadURL https://update.greasyfork.org/scripts/387992/drones%20like%20real%21.user.js
// @updateURL https://update.greasyfork.org/scripts/387992/drones%20like%20real%21.meta.js
// ==/UserScript==
"use strict";

let IMAGE_LINK = "https://cdn.discordapp.com/attachments/374952956635906058/605493183434063956/drone.png";

let DO_STROKE = true;

let img = new Image();
img.src = IMAGE_LINK;
let c = CanvasRenderingContext2D.prototype;
let ctx = document.getElementById("canvas").getContext("2d");
let fillSave = c.fill;
let strokeSave = c.stroke;
let origin = { x: 0, y: 0 };
let second = { x: 0, y: 0 };
let length = { x: 0, y: 0 };
let angle = 0;
let count = 0;
c._moveTo = c.moveTo;
c.moveTo = function(x, y) {
    c.fill = fillSave;
    c.stroke = strokeSave;
    origin = { x, y };
    count = 1;
    this._moveTo(x, y);
};
c._lineTo = c.lineTo;
c.lineTo = function(x, y) {
    switch(count) {
        case 1:
            length = Math.sqrt(Math.pow(x - origin.x, 2) + Math.pow(y - origin.y, 2));
            second = { x, y };
            angle = Math.atan2(y - origin.y, x - origin.x);
            count++;
            break;
        case 2:
            if(Math.sqrt(Math.pow(second.x + Math.cos(angle + 2/3 * Math.PI) * length - x, 2) +
                         Math.pow(second.y + Math.sin(angle + 2/3 * Math.PI) * length - y, 2)) < 1e-6) {
                ctx.drawImage(img, (x + origin.x + second.x) / 3 - img.width / 2, (y + origin.y + second.y) / 3 - img.height / 2);
                c.fill = function() {
                    c.fill = fillSave;
                };
                if(DO_STROKE == false) {
                    c.stroke = function() {
                        c.stroke = strokeSave;
                    };
                }
            }
            count = 0;
            break;
    }
    this._lineTo(x, y);
};