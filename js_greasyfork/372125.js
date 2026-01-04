// ==UserScript==
// @name         Factory Controls Overlay
// @namespace    lol
// @version      2.1
// @description  Factory Controls visualized!
// @author       Licht_denker47
// @match        https://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372125/Factory%20Controls%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/372125/Factory%20Controls%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let x,y,X,Y;
    let Z=false;
    const stroke = ['rgba(21,181,223,0.25)','rgba(255,80,13,0.25)'];
    let radius = [];

    document.onmousemove = function(){
        x = event.clientX;
        y = event.clientY;
    };
    document.onmousedown = function(e){
        if(e.button == 2){Z=true;};
    };
    document.onmouseup = function(e){
        if(e.button == 2){Z=false;};
    };

    const canvas = document.createElement("canvas");
    function get_Radius(){
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        radius[0] = window.innerWidth * 0.17681239669;
        radius[1] = window.innerWidth * 0.06545454545;
        radius[2] = window.innerWidth * 0.16751239669;
        radius[3] = window.innerWidth * 0.06545454545;
        radius[4] = window.innerWidth * 0.36;
        //radius[5] = window.innerWidth * 0.34;
    };
    get_Radius();
    window.addEventListener('resize', get_Radius);

    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";

    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 30;
        ctx.beginPath();
        ctx.arc(X,Y,radius[4],0,2*Math.PI);
        ctx.strokeStyle = stroke[1];
        ctx.stroke();
        if(Z){
            ctx.beginPath();
            ctx.arc(x,y,radius[1],0,2*Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x,y,radius[0],0,2*Math.PI);
            ctx.strokeStyle = stroke[0];
            ctx.stroke();
        } else{
            ctx.beginPath();
            ctx.arc(x,y,radius[2],0,2*Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x,y,radius[3],0,2*Math.PI);
            ctx.strokeStyle = stroke[0];
            ctx.stroke();
        }
        requestAnimationFrame(draw);
    }
    draw();
})();