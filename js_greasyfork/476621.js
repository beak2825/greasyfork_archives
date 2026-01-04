// ==UserScript==
// @name           flowr healthbar script
// @namespace      http://tampermonkey.net/
// @version        0.3
// @description    display mobs health
// @author         AstRatJP
// @match          https://flowr.fun/*
// @license        MIT
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/476621/flowr%20healthbar%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/476621/flowr%20healthbar%20script.meta.js
// ==/UserScript==


let healthDisplay = true;
document.addEventListener("keydown", function (event) {
    if (event.key === 'x') {
        healthDisplay = !healthDisplay;
    }
});

function drawHealth() {
    if (healthDisplay) {
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
                const max = Math.sqrt(eneArr[i].maxHp) * 3;
                const now = Math.sqrt(eneArr[i].hp) * 3;

                ctx.strokeStyle = "#222222";
                ctx.lineWidth = 10 * fov;
                ctx.beginPath();
                ctx.moveTo(canvas.w / 2 + (eneArr[i].render.x - me.render.x) * fov - max * fov,
                    canvas.h / 2 + 10 + (eneArr[i].render.y - me.render.y) * fov + eneArr[i].radius * fov)

                ctx.lineTo(canvas.w / 2 + (eneArr[i].render.x - me.render.x) * fov + max * fov,
                    canvas.h / 2 + 10 + (eneArr[i].render.y - me.render.y) * fov + eneArr[i].radius * fov)
                ctx.stroke();


                ctx.strokeStyle = "#85e37d";
                ctx.lineWidth = 7 * fov;
                ctx.beginPath();
                ctx.moveTo(canvas.w / 2 + (eneArr[i].render.x - me.render.x) * fov - max * fov,
                    canvas.h / 2 + 10 + (eneArr[i].render.y - me.render.y) * fov + eneArr[i].radius * fov)

                ctx.lineTo(canvas.w / 2 + (eneArr[i].render.x - me.render.x) * fov - max * fov + now * 2 * fov,
                    canvas.h / 2 + 10 + (eneArr[i].render.y - me.render.y) * fov + eneArr[i].radius * fov)
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(drawHealth);
}

drawHealth();