// ==UserScript==
// @name         Diep Factory Controls Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       adasba and 325 Gerbils
// @match        http://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420702/Diep%20Factory%20Controls%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/420702/Diep%20Factory%20Controls%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = init;
    var mouseX, mouseY;
    function init() {
        if (window.Event) {
            document.captureEvents(Event.MOUSEMOVE);
        }
        document.onmousemove = getCursorXY;
    }
    function getCursorXY(e) {
        mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    }
    var c2 = document.createElement('canvas');
    c2.style = "position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1;";
    document.getElementsByTagName('body')[0].appendChild(c2);
    var ctx2 = c2.getContext('2d');

    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    c.style.opacity = 0;

    var i = 0;

    var depth = 6;

    c2.width = c.width;
    c2.height = c.height;

    window.addEventListener('resize', function() {
        c2.width = c.width;
        c2.height = c.height;
    }, false);

    function loop() {

        ctx2.clearRect(0, 0, c2.width, c2.height);
        ctx2.drawImage(c, 0, 0, c2.width, c2.height);

        var centerX = c2.width / 2;
        var centerY = c2.height / 2;

        //var radius = c2.width*0.20661157024;
        //ctx2.beginPath();
        //ctx2.arc(mouseX, mouseY, radius, 0, 2 * Math.PI, false);
        //ctx2.fillStyle = 'transparent';
        //ctx2.fill();
        //ctx2.lineWidth = 5;
        //ctx2.strokeStyle = 'rgba(255,0,0,0.25)';
        //ctx2.stroke();

        var radius = c2.width*0.16751239669;
        ctx2.beginPath();
        ctx2.arc(mouseX, mouseY, radius, 0, 2 * Math.PI, false);
        ctx2.fillStyle = 'transparent';
        ctx2.fill();
        ctx2.lineWidth = 5;
        ctx2.strokeStyle = 'rgba(255,0,0,0.25)';
        ctx2.stroke();

        radius = c2.width*0.06545454545;
        ctx2.beginPath();
        ctx2.arc(mouseX, mouseY, radius, 0, 2 * Math.PI, false);
        ctx2.fillStyle = 'transparent';
        ctx2.fill();
        ctx2.lineWidth = 5;
        ctx2.strokeStyle = 'rgba(0,128,255,0.25)';
        ctx2.stroke();

        requestAnimationFrame(loop);
    }
    loop();
})();