// ==UserScript==
// @name         normal tanks!
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  tiny tanks v2
// @author       el bismüt
// @match        *diep.io*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435975/normal%20tanks%21.user.js
// @updateURL https://update.greasyfork.org/scripts/435975/normal%20tanks%21.meta.js
// ==/UserScript==
function face(X, Y, width) {
    let red = parseInt(ctx.fillStyle.slice(1,3), 16).toString();
    let green = parseInt(ctx.fillStyle.slice(3,5), 16).toString();
    let blue = parseInt(ctx.fillStyle.slice(5,7), 16).toString();
    if (red < blue || (green > 150 && blue > 200)) {
        ctx.fillStyle = '#030303';
        ctx.beginPath();
        ctx.ellipse(X - width / 2, Y - width / 8,width / 3, width / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(X + width / 2, Y - width / 8, width / 3, width / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FBFBFB';
        ctx.beginPath();
        ctx.ellipse(X - width / 2 - width / 3 * Math.cos(7*Math.PI/6), Y - width / 8 + width / 2.7 * Math.sin(7*Math.PI/6), width / 9, width / 24, 0, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(X + width / 2 - width / 3 * Math.cos(7*Math.PI/6), Y - width / 8 + width / 2.7 * Math.sin(7*Math.PI/6), width / 9, width / 24, 0, 0, 2*Math.PI);
        ctx.fill();
    }
    else {
        ctx.fillStyle = '#030303';
        ctx.beginPath();
        ctx.ellipse(X - width / 2, Y - width / 8, width / 3, width / 3, 0, 0, 5 * Math.PI / 4);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(X + width / 2, Y - width / 8, width / 3, width / 3, 0, 7 * Math.PI / 4, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#FBFBFB';
        ctx.beginPath();
        ctx.ellipse(X - width / 2 - width / 3 * Math.cos(6*Math.PI/6), Y - width / 8 + width / 2.7 * Math.sin(6*Math.PI/6), width / 9, width / 24, 0, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(X + width / 2 - width / 3 * Math.cos(6*Math.PI/6), Y - width / 8 + width / 2.7 * Math.sin(6*Math.PI/6), width / 9, width / 24, 0, 0, 2*Math.PI);
        ctx.fill();
    }
    ctx.strokeStyle = '#030303';
    ctx.lineWidth = width / 20;
    ctx.beginPath();
    ctx.moveTo(X - width / 12, Y + width / 4);
    ctx.lineTo(X + width / 12, Y + width / 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(X, Y, width, width, 0, 0, 2*Math.PI);
}
var ctx = document.getElementById("canvas").getContext("2d");
ctx.arc = function(x, y, r) {face(x, y, r)}