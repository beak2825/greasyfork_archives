// ==UserScript==
// @name         Takepoint.io - laser sight
// @namespace    http://tampermonkey.net/
// @version      1
// @description  very useless but here you go ig
// @author       You
// @match        https://takepoint.io
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434282/Takepointio%20-%20laser%20sight.user.js
// @updateURL https://update.greasyfork.org/scripts/434282/Takepointio%20-%20laser%20sight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var canvas2 = document.createElement('canvas')
    canvas2.width = window.innerWidth * window.devicePixelRatio;
    canvas2.height = window.innerHeight * window.devicePixelRatio;
    canvas2.style.width = canvas2.width / window.devicePixelRatio + "px";
    canvas2.style.height = canvas2.height / window.devicePixelRatio + "px"
    canvas2.style.zIndex = '9999'
    document.body.appendChild(canvas2)
    var center = [canvas2.width/2, canvas2.height/2]
    var ctx = canvas2.getContext("2d")
    var xratio = canvas2.width / window.innerWidth
    var yratio = canvas2.height/ window.innerHeight
    ctx.scale(xratio, yratio)
    var mouse = {
        'x': 1,
        'y': 1
    }

    document.addEventListener('mousemove', function(event) {
        mouse.x = event.clientX
        mouse.y = event.clientY
    })

    setInterval(() => {
        ctx.clearRect(0, 0, canvas2.width, canvas2.height)

        var coords = extend(mouse, {'x':window.innerWidth/2,'y':window.innerHeight/2}, 0, window.innerWidth, 0, window.innerHeight)
        if(mouse.x > window.innerWidth/2) {
            drawLine(window.innerWidth/2, window.innerHeight/2, Math.round(coords[1].x), Math.round(coords[1].y))
        }
        else {
            drawLine(window.innerWidth/2, window.innerHeight/2, Math.round(coords[0].x), Math.round(coords[0].y))
        }
    }, 16)

    function drawLine(startX, startY, endX, endY) {
        ctx.strokeStyle = "#FF0000"
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
        ctx.globalAlpha = 1
    }


    function extend(p, q, x0, x1, y0, y1) {
        var dx = q.x - p.x;
        var dy = q.y - p.y;
        if (dx === 0) return [{x: p.x, y: y0}, {x: p.x, y: y1}];
        var slope = dy / dx;

        var y_at_x0 = slope * (x0 - p.x) + p.y;
        var y_at_x1 = slope * (x1 - p.x) + p.y;
        var x_at_y0 = (y0 - p.y) / slope + p.x;
        var x_at_y1 = (y1 - p.y) / slope + p.x;

        var r, s;
        if (y_at_x0 < y0) r = {x: x_at_y0, y: y0};
        else if (y_at_x0 <= y1) r = {x: x0, y: y_at_x0};
        else r = {x: x_at_y1, y: y1};

        if (y_at_x1 < y0) s = {x: x_at_y0, y: y0};
        else if (y_at_x1 <= y1) s = {x: x1, y: y_at_x1};
        else s = {x: x_at_y1, y: y1};

        return [r, s];
    }
})();