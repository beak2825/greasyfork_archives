// ==UserScript==
// @name         fondo del lienzo edit
// @version      1.0
// @description  Drawaria.online adds file upload
// @author       el pana random
// @author       XD el pana
// @match        https://drawaria.online/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/472271/fondo%20del%20lienzo%20edit.user.js
// @updateURL https://update.greasyfork.org/scripts/472271/fondo%20del%20lienzo%20edit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Resize canvas
    let canvas = document.getElementById('canvas');
    canvas.height = 650;
    canvas.width = 780;

    // Add file upload button
    let target = document.getElementById('downloadcanvas');
    // Create button for toggling sounds with Material Icon and text
    let togglebtn = document.createElement('button');
    togglebtn.id = 'imagebot';
    togglebtn.type = 'button';
    togglebtn.classList.add('btn', 'btn-light', 'btn-sm', 'btn-block');
    togglebtn.innerHTML = '<i class="material-icons" style="font-size: 16px;">&#xe432;</i><span>Upload Image</span>';
    // Add styles for Material Icons font family
    let linkElm = document.createElement("link");
    linkElm.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    linkElm.rel="stylesheet";
    document.head.appendChild(linkElm);
    let styleElem=document.createElement("style");
styleElem.textContent=`
    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
    }
`;
  document.head.appendChild(styleElem);
    togglebtn.addEventListener('click', function() {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function() {
            let file = input.files[0];
            let reader = new FileReader();
            reader.onload = function() {
                let img = new Image();
                img.onload = function() {
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    });
    target.parentNode.insertBefore(togglebtn, target.nextSibling);
})();