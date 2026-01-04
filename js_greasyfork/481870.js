// ==UserScript==
// @name           hitbox & range
// @namespace      http://tampermonkey.net/
// @version        0.2
// @description    display enemy hitbox
// @author         AstRatJP
// @icon           https://florr.io/favicon-32x32.png
// @match          https://flowr.fun/*
// @license        MIT
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/481870/hitbox%20%20range.user.js
// @updateURL https://update.greasyfork.org/scripts/481870/hitbox%20%20range.meta.js
// ==/UserScript==

const mag = [300, 675, 900, 1125, 1500, 1950, 2550, 3300, 0]; //common~super
const te = [0, 0, 0, 0, 1500, 1900, 0, 0, 0];
    
function drawHitBox() {
    let floObj = room.flowers;
    let floArr = [];
    for (const key in floObj) {
        floArr.push(floObj[key]);
    }
    const me = floArr.find(item => item.name === localStorage.getItem("nickname"));
    if (me) {
        let eneArr = [];
        let eneObj = room.enemies;

        for (const key in eneObj) {
            eneArr.push(eneObj[key]);
        }
        for (let i = 0; i < eneArr.length; i++) {
            if (eneArr[i].hp < 0) {
                eneArr.splice(i, 1);
                i--;
                break;
            }

            ctx.strokeStyle = "#0000ff";
            ctx.lineWidth = 3 * fov;
            ctx.beginPath();
            ctx.arc(canvas.w / 2 + (eneArr[i].render.x - me.render.x) * fov, canvas.h / 2 + (eneArr[i].render.y - me.render.y) * fov, eneArr[i].render.radius * fov, 0, 2 * Math.PI);
            ctx.stroke();
        }
        let rarity = 8; //0
        for (var i = 0; i < me.petals.length; i++) {
            if (me.petals[i].type === "Magnet") {
                rarity = me.petals[i].rarity;
                break;
            }
        }
        ctx.strokeStyle = "#4788ff";
        ctx.beginPath();
        ctx.arc(canvas.w / 2, canvas.h / 2, mag[rarity]/4 * fov, 0, 2 * Math.PI);
        ctx.stroke();
        
        rarity = 8; //0
        for (var i = 0; i < me.petals.length; i++) {
            if (me.petals[i].type === "Third Eye") {
                rarity = me.petals[i].rarity;
                break;
            }
        }
        ctx.strokeStyle = "#ff6347";
        ctx.beginPath();
        ctx.arc(canvas.w / 2, canvas.h / 2, te[rarity]/8 * fov, 0, 2 * Math.PI);
        ctx.stroke();
    }


    requestAnimationFrame(drawHitBox);
}

drawHitBox();