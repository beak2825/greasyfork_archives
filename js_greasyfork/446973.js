// ==UserScript==
// @name         Dall-e-2 Copy Button Userscript
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Copy the images to clipboard, 
// @author       Jonathan, shoutout to will
// @match        https://labs.openai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/446973/Dall-e-2%20Copy%20Button%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/446973/Dall-e-2%20Copy%20Button%20Userscript.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const getImCount = () => document.querySelectorAll(".task-page-generations .generated-image-overlay").length;
    const addBtn = function() {
        const node = document.getElementsByClassName('task-page-generations')[0];
        const makeImage = function() {
            const imCount = getImCount();
            console.log('copy button clicked');
            const canvas = document.createElement('canvas');
            canvas.id = "copy-canvas";
            const imSize = 400;
            const margin = 8;
            const imAcross = imCount == 6 ? 3 : 2;
            canvas.width = imAcross*imSize + (4*margin);
            canvas.height= 2*imSize + (2*margin) + 50;
            const body = document.getElementsByTagName("body")[0];
            body.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const images = document.getElementsByClassName('generated-image');
            const sig = document.getElementsByClassName('image-signature')[0];
            for(var i = 0; i < imCount; i++) {
                const img = images.item(i).firstChild;
                const x = (imSize * i + (i%imAcross*margin)) % (imAcross*imSize) + margin;
                const y = margin+ (i<imAcross?0:imSize + margin);
                ctx.drawImage(img, x, y, imSize, imSize);
                ctx.translate(x+imSize-80, y+imSize-16);
                for(var p=0;p<sig.children.length;p++) {
                    const pp = sig.children[p]
                    const path = new Path2D(pp.getAttribute('d'));
                    ctx.fillStyle = pp.getAttribute('fill');
                    ctx.fill(path);
                }
                ctx.setTransform(1,0,0,1,0,0);
            }
            ctx.fillStyle = "black";


            const text = "DALL·E - " + document.getElementsByClassName('image-prompt-input')[0].value;
            let fntSize = 32;
            ctx.font = `${fntSize}pt Charter, Georgia`;
            while(ctx.measureText(text).width > canvas.width - 32) {
                fntSize -= 0.25;
                ctx.font = `${fntSize}pt Charter, Georgia`;
            }
            ctx.fillText(text, 16, canvas.height-42+12, canvas.width - 32);
            canvas.toBlob(function(blob) {
                const item = new ClipboardItem({'image/png': blob });
                navigator.clipboard.write([item]);
            })
            document.getElementById("copy-canvas").outerHTML = "";
        };
        const saveAll = function() {
            const imCount = getImCount();
            for(let i = 0; i < imCount; i++) {
                document.getElementsByClassName("task-page-quick-actions-button")[i].click();
                document.getElementsByClassName("menu-item menu-item-selectable")[3].click();
            }
        };
        const rowDiv = document.createElement('div');
        rowDiv.style.cssText = 'align-items: horizontal; align-self: center; flex: auto; align-items: center; padding-bottom: 10px; display: flex; flex-direction: row;max-height: 56px;'
        if (!node) return;
        node.prepend(rowDiv);
        const mkBtn = function(txt, id) {
            const btn = document.createElement('div');
            btn.innerHTML = `<button id="${id}" class="btn btn-medium btn-filled btn-secondary" type="button" aria-haspopup="true" aria-expanded="false"><span class="btn-label-wrap"><span class="btn-label-inner">${txt}</span></span></button>`;
            rowDiv.prepend(btn);
            return btn;
        }
        const btnCopy = mkBtn('Copy', 'btn-copy')
        const btnSave = mkBtn('Save', 'btn-save')
        btnSave.style['padding-right'] = '10px';
        btnSave.addEventListener('click', saveAll);
        btnCopy.addEventListener('click', makeImage);
    }
    setInterval(function() {
        // if task-page-generations-grid is on the page, and the buttons are not, add them
        const imCount = getImCount();
        if(document.getElementsByClassName("task-page-quick-actions-button").length == imCount) {
            if(!document.getElementById('btn-copy')) {
                addBtn();
            }
        }
    },500);
 })();