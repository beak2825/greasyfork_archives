// ==UserScript==
// @name         r/Layer Cheat
// @namespace    https://sakyum.xyz/
// @version      0.2
// @description  Upload custom images to r/Layer's canvas.
// @author       campital
// @match        *://layers-svc.reddit.com/static/layermaker/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/414429/rLayer%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/414429/rLayer%20Cheat.meta.js
// ==/UserScript==

"use strict";

let canvas = document.querySelector("layer-canvas");

let imageForm = document.createElement("form");
let imageUrlBox = document.createElement("input");
imageUrlBox.setAttribute("type", "url");
let submitBtn = document.createElement("button");
submitBtn.textContent = "Add Image";
imageForm.appendChild(document.createTextNode("Image URL: "));
imageForm.appendChild(imageUrlBox);
imageForm.appendChild(submitBtn);

var imgAbort;
imageForm.onsubmit = function(e) {
    e.preventDefault();
    if(typeof imgAbort === "function") {
        imgAbort();
    }
    imgAbort = GM_xmlhttpRequest({ method: "GET", url: imageUrlBox.value, responseType: "blob", onload: function(res) {
        let imgUri = URL.createObjectURL(res.response);
        let img = new Image;
        img.onload = function() {
            canvas.ctx.globalCompositeOperation = "source-over";
            canvas.ctx.drawImage(img, (canvas.cursor.x / canvas.width) * canvas.ctx.canvas.width,
                                 (canvas.cursor.y / canvas.height) * canvas.ctx.canvas.height);
            canvas.ctxDisplay.globalCompositeOperation = "source-over";
            canvas.ctxDisplay.drawImage(img, (canvas.cursor.x / canvas.width) * canvas.ctxDisplay.canvas.width,
                                        (canvas.cursor.y / canvas.height) * canvas.ctxDisplay.canvas.height);
            canvas.fullyUpdateMiniCanvas();
        }
        img.src = imgUri;
    }});
    imageUrlBox.value = "";
}
canvas.parentElement.appendChild(imageForm);