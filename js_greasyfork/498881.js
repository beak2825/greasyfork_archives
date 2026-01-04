// ==UserScript==
// @name         noVNC Paste-typer for Proxmox
// @namespace    https://raw.githubusercontent.com/junkhacker/noVNC-Paste-typer-for-Proxmox/main/noVNC-paste-typer.js
// @version      0.3
// @description  Pastes text into a noVNC window (for use with Proxmox specifically) inspired by the script by Chester Enright
// @author       Junkhacker
// @include      /^https?://.*:8006/.*novnc.*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498881/noVNC%20Paste-typer%20for%20Proxmox.user.js
// @updateURL https://update.greasyfork.org/scripts/498881/noVNC%20Paste-typer%20for%20Proxmox.meta.js
// ==/UserScript==

const delay = 50
;(function () {
    'use strict'
    window.sendString = function(text) {
        const el = document.getElementById("canvas-id")
        let promise = Promise.resolve();
        text.split("").forEach(function(x){
            promise = promise.then(function (){
                let needs_shift = x.match(/[A-Z!@#$%^&*()_+{}:\"<>?~|]/)
                let evt
                if (needs_shift) {
                    evt = new KeyboardEvent("keydown", {keyCode: 16})
                    el.dispatchEvent(evt)
                    evt = new KeyboardEvent("keydown", {key: x, shiftKey: true})
                    el.dispatchEvent(evt)
                    evt = new KeyboardEvent("keyup", {keyCode: 16})
                    el.dispatchEvent(evt)
                }else{
                    evt = new KeyboardEvent("keydown", {key: x})
                    el.dispatchEvent(evt)
                }
                return new Promise(function (resolve) {
                    setTimeout(resolve, delay);
                });
            })
        })

    }
    $(document).ready(function() {
        setTimeout(()=>{
            console.log("Starting up noVNC Paste-typer for Proxmox")
            $("canvas").attr("id", "canvas-id")
            window.addEventListener("paste", (event) => {
                let text = prompt("Enter text to auto type.");
                if (text != null) window.sendString(text);
            })
        }, 1000);
    })
})()
