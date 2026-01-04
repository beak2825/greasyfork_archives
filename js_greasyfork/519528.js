// ==UserScript==
// @name         取色器
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  网页取色器
// @author       dbf
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519528/%E5%8F%96%E8%89%B2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/519528/%E5%8F%96%E8%89%B2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var eyeDropperBtn = document.createElement("button");
    eyeDropperBtn.innerHTML = "取色器";
    eyeDropperBtn.style.position = "fixed";
    eyeDropperBtn.style.top = "5px";
    eyeDropperBtn.style.left = "5px";
    eyeDropperBtn.style.zIndex = 1000;
    eyeDropperBtn.style.backgroundColor = "rgb(255 202 138)";
    eyeDropperBtn.style.color = "white";
    eyeDropperBtn.style.padding = "5px 5px";
    eyeDropperBtn.style.border = "none";
    eyeDropperBtn.style.cursor = "pointer";
    eyeDropperBtn.style.borderRadius = "4px";
    eyeDropperBtn.style.fontSize = "12px";
    eyeDropperBtn.draggable=true

    eyeDropperBtn.onclick = function() {
        if (!window.EyeDropper) {
            alert("浏览器不支持 EyeDropper API")
            return;
        }

        const eyeDropper = new EyeDropper();

        eyeDropper
            .open()
            .then((result) => {
            alert( result.sRGBHex);

        })
            .catch((e) => {
            alert(e)
        });

    };
    document.body.addEventListener("dragover",(event) => {
        event.preventDefault();
    },false );

    eyeDropperBtn.ondragend = function(event){
        event.target.style.left = event.clientX+"px"
        event.target.style.top = event.clientY+"px"
        event.target.style.cursor = 'pointer'
    }


    if (window === window.top) {
        document.body.appendChild(eyeDropperBtn);
    }


})();