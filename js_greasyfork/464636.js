// ==UserScript==
// @name         Sigmally on Drugs
// @version      2.1
// @description  Weird Sigmally
// @author       Cursed
// @match        *://sigmally.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sigmally.com
// @run-at       document-end
// @license      MIT
// @namespace    https://greasyfork.org/users/981958
// @downloadURL https://update.greasyfork.org/scripts/464636/Sigmally%20on%20Drugs.user.js
// @updateURL https://update.greasyfork.org/scripts/464636/Sigmally%20on%20Drugs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const start = document.createElement("button");
    const stop = document.createElement("button");
    const fillRect = CanvasRenderingContext2D.prototype

    start.innerHTML = "Start";
    stop.innerHTML = "Stop";

    start.addEventListener("click", () => {
        CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
            CanvasRenderingContext2D.fillStyle = "#FFFFFF";
        }
    })
    stop.addEventListener("click", () => {
        location.reload();
    })

    start.style = "z-index: 99999; position: absolute; top: 20px; left: 50%; transform: translate(-50%, -50%)"
    stop.style = "z-index: 99999; position: absolute; top: 20px; left: 55%; transform: translate(-80%, -50%)"
    document.body.appendChild(start)
    document.body.appendChild(stop)
})();