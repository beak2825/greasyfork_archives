// ==UserScript==
// @name           auto yy script
// @namespace      http://tampermonkey.net/
// @version        0.3
// @description    Press Q to activate. put yy to the 1st slot.
// @author         AstRatJP
// @icon           https://florr.io/favicon-32x32.png
// @match          https://flowr.fun/*
// @license        MIT
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/481319/auto%20yy%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/481319/auto%20yy%20script.meta.js
// ==/UserScript==

let yy = false;
let isnoyy = false;

document.addEventListener("keydown", function (event) {
    if (event.key === 'q') {
        yying();
        yy = !yy;
    }
});


function yying() {
    if (Object.keys(room.flowers).length !== 0) {
            let floObj = room.flowers;
    let floArr = [];
    for (const key in floObj) { floArr.push(floObj[key]); }
    const me = floArr.find(item => item.name === localStorage.getItem("nickname"));
    const myFlo = room.flowers[me.id];
    let attack = Math.ceil(me.petals.length/2);
    let petalAngle = Math.atan2(me.petals[attack].y - me.y, -(me.petals[attack].x - me.x));
    let mouseAngle = Math.atan2(mouse.canvasY - canvas.h / 2, -(mouse.canvasX - canvas.w / 2));
    let clowi = undefined;

    petalAngle = petalAngle + Math.PI;
    mouseAngle = mouseAngle + Math.PI;

    if (Math.sin(petalAngle-mouseAngle)>0) {
        clowi = true;
    } else {
        clowi = false;
    }

    if (yy && !isnoyy && clowi && me.petals[0].type==="Yin Yang") {
        window.dispatchEvent(
        new KeyboardEvent("keydown", {
            "code": "Digit1",
            "key": "1"
        })
    );
        isnoyy = true;
    } else if (yy && isnoyy && !clowi && me.petals[0].type!=="Yin Yang") {
        window.dispatchEvent(
        new KeyboardEvent("keydown", {
            "code": "Digit1",
            "key": "1"
        })
    );
        isnoyy = false;
    }
    }
    requestAnimationFrame(yying);
}

yying();