// ==UserScript==
// @name        BelaSpread
// @namespace   lol
// @description buff penta
// @version     1
// @author      Bela
// @include     http://diep.io/*
// @connect     diep.io
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/367796/BelaSpread.user.js
// @updateURL https://update.greasyfork.org/scripts/367796/BelaSpread.meta.js
// ==/UserScript==

var timeStart = new Date().getTime();
var timeNow = timeStart;
var timePassed = 0;
var timeLast = timeStart;
var timeUnit = 15;

document.addEventListener('keyup', function(e)
{
    var key = e.keyCode || e.which;
});

document.addEventListener('keydown', function(e)
{
    var key = e.keyCode || e.which;
});

document.addEventListener('mousedown', function(e)
{
    var button = e.button;
    if(button == 2)
    {
        overrideStart = new Date().getTime();
        override = !override;
        simulateKeyPress(32, true);
        if(override)
        {
            document.getElementById("canvas").style.pointerEvents = "none";
        }
        else
        {
            document.getElementById("canvas").style.pointerEvents = "all";
        }
    }
});

document.addEventListener('mouseup', function(e)
{
    var button = e.button;
    if(button == 2)
    {
        overrideStart = new Date().getTime();
        override = !override;
        simulateKeyPress(32, false);
        if(override)
        {
            document.getElementById("canvas").style.pointerEvents = "none";
        }
        else
        {
            document.getElementById("canvas").style.pointerEvents = "all";
        }
    }
});

document.addEventListener("mousewheel", function(e)
{
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    cog += delta * 0.004;
    console.log(cog);
}, false);

var override = false;
var overrideStart = 0;
var canvasMouseX = 0;
var canvasMouseY = 0;
document.addEventListener('mousemove', function(e)
{
    canvasMouseX = e.clientX;
    canvasMouseY = e.clientY;
});

function GetCoordClamp(mouseX, mouseY){var ret = {};var hsx = window.innerWidth / 2;var hsy = window.innerHeight / 2;var amx = mouseX - hsx;var amy = mouseY - hsy;var dc = 0.96;if((amx > -hsx * dc) && (amx < hsx * dc) && (amy > -hsy * dc) && (amy < hsy * dc)){ret[0] = mouseX;ret[1] = mouseY;return ret;}else{var fA = (amx * hsy) - (amy * hsx);var fB = (amx * hsy) + (amy * hsx);if(fA > 0){if(fB > 0){amy = amy * (hsx * dc / amx);amx = hsx * dc;}else{amx = amx * (-hsy * dc / amy);amy = -hsy * dc;}}else{if(fB > 0){amx = amx * (hsy * dc / amy);amy = hsy * dc;}else{amy = amy * (-hsx * dc / amx);amx = -hsx * dc;}}ret[0] = amx + hsx;ret[1] = amy + hsy;}return ret;}
function rotateAngle(x, y, deg){var ret = {};if(deg === 0){ret[0] = x;ret[1] = y;}else{var transX = Math.cos(deg * Math.PI / 180);var transY = Math.sin(deg * Math.PI / 180);ret[0] = x * transX - y * transY;ret[1] = y * transX + x * transY;}return ret;}

var cog = 106.84;

function SyncMouse()
{
    if(override)
    {
        var timeCog = ((timeNow - overrideStart) / cog) % 12;
        if(timeCog >= 6)
        {
            timeCog = -timeCog + 6;
        }
        var newXY = rotateAngle(canvasMouseX - window.innerWidth / 2, canvasMouseY - window.innerHeight / 2, timeCog * 17);
        newXY[0] += window.innerWidth / 2;
        newXY[1] += window.innerHeight / 2;
        newXY = GetCoordClamp(newXY[0], newXY[1]);
        simulateMouseMove(newXY[0], newXY[1]);
    }
}

function simulateKeyPress(key, hold)
{
    var eventObj;
    if(hold)
    {
        eventObj = document.createEvent("Events"); eventObj.initEvent("keydown", true, true); eventObj.keyCode = key; window.dispatchEvent(eventObj);
    }
    else
    {
        eventObj = document.createEvent("Events"); eventObj.initEvent("keyup", true, true); eventObj.keyCode = key; window.dispatchEvent(eventObj);
    }
}

function simulateMousePress(button, clientX, clientY, press)
{
    if(press)
    {
        canvas.dispatchEvent(new MouseEvent('mousedown', { 'clientX': clientX, 'clientY': clientY, 'button': button, 'mozPressure' : 1.0 }));
    }
    else
    {
        canvas.dispatchEvent(new MouseEvent('mouseup', { 'clientX': clientX, 'clientY': clientY, 'button': button, 'mozPressure' : 1.0 }));
    }
}

function simulateMouseMove(clientX, clientY)
{
    canvas.dispatchEvent(new MouseEvent('mousemove', { 'clientX': clientX, 'clientY': clientY }));
}

function D2(x1, y1, x2, y2){var difX = x1 - x2;var difY = y1 - y2;return (difX * difX) + (difY * difY);}

function tick()
{
    SyncMouse();
}

function loop()
{
    timeNow = new Date().getTime();
    timePassed = timeNow - timeStart;
    while(timeNow - timeLast > timeUnit)
    {
        timeLast += timeUnit;
        tick();
    }
}
setInterval(loop, 5);