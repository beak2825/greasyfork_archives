// ==UserScript==
// @name         Doblons green
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Marks green squares when you get close
// @author       You
// @match        http://doblons.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403678/Doblons%20green.user.js
// @updateURL https://update.greasyfork.org/scripts/403678/Doblons%20green.meta.js
// ==/UserScript==

let fff = () => {

    let a = gameObjSprites["6-3-38"];

    if(!a) return setTimeout(fff,1000);

    a.width  = 600;
    a.height = 600;

    let ac = a.getContext("2d");

    ac.lineWidth = 20;
    ac.fillStyle = "#7FFF00";

    ac.beginPath();

    ac.moveTo(0, 0);
    ac.lineTo(a.width, a.height);

    ac.moveTo(a.width, 0);
    ac.lineTo(0, a.height);

    ac.moveTo(a.width/2, 0);
    ac.lineTo(a.width/2, a.height);

    ac.moveTo(0, a.height/2);
    ac.lineTo(a.width, a.height / 2);

    ac.stroke();

    console.log("Done");
};

fff();