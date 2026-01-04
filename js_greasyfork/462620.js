// ==UserScript==
// @name         MxoBot Example Bot
// @namespace    http://tampermonkey.net/<3nevin
// @version      1.1
// @description  Demo bot to illustrate LibNevin. MxoBot
// @author       ngixl
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/462620-mxobot-example-bot/code/MxoBot%20Example%20Bot.js
// ==/UserScript==
/* global NevinCore, NevinWaitForElm*/

const core = new MxoCore({
    timeout: 25
});

MxoWaitForElm('#canvas').then(function(c) {
    c.addEventListener('click', function() {
        const [sx, sy] = document.getElementById('coordinates').textContent.split(',').map(Number)
        core.picker.requestImageFromFileDialog(core.palette).then(a => {
            console.log(core.mxoWS.ws.readyState)
            a.image.addEventListener('load', function() {
                core.engine.tasks = [...core.engine.tasks, ...a.convertToTasks(sx,sy, core.mxoWS)]
            })
        })
    })
}) 