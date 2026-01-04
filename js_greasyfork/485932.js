// ==UserScript==
// @name         Draggable Keystokes Modified
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds draggable keystrokes.
// @author       Blueify, Gnosis
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @ Modified from https://greasyfork.org/scripts/480712-draggable-keystokes
// @downloadURL https://update.greasyfork.org/scripts/485932/Draggable%20Keystokes%20Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/485932/Draggable%20Keystokes%20Modified.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keystrokescontainer = document.createElement('div');
    keystrokescontainer.style.zIndex = '10000';
    keystrokescontainer.style.width = '300px';
    keystrokescontainer.style.height = '170px';
    keystrokescontainer.style.transform = 'translate(-50%, -50%)';
    keystrokescontainer.style.backgroundColor = '#000000';
    keystrokescontainer.style.position = 'fixed';
    keystrokescontainer.style.left = GM_getValue('left') ? (GM_getValue('left') + 'px') : '50%';
    keystrokescontainer.style.top = GM_getValue('top') ? (GM_getValue('top') + 'px') : '50%';
    keystrokescontainer.style.opacity = '70%';
    window.addEventListener('load', () => document.body.appendChild(keystrokescontainer));

    let isDragging = false;

    keystrokescontainer.addEventListener('mousedown', (event) => {
        if (event.target.nodeName !== 'INPUT') {
            isDragging = true;
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const left = event.clientX;
            const top = event.clientY;

            keystrokescontainer.style.left = left + 'px';
            keystrokescontainer.style.top = top + 'px';

            GM_setValue('left', left);
            GM_setValue('top', top);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    const wkey = document.createElement('div');
    wkey.style.position = 'fixed';
    wkey.style.color = '#ffffff';
    wkey.textContent = 'W';
    wkey.style.top = '5px';
    wkey.style.transform = 'translate(-50%)';
    wkey.style.left = '50%';
    wkey.style.zIndex = '10000';
    wkey.style.fontWeight = 'bold';
    wkey.style.borderRadius = '10px';
    wkey.style.backgroundColor = '#66ccff';
    wkey.style.fontSize = '24px';
    wkey.style.height = '50px';
    wkey.style.width = '50px';
    wkey.style.textAlign = 'center';
    wkey.style.lineHeight = '50px';


    const skey = document.createElement('div');
    skey.style.position = 'fixed';
    skey.style.color = '#ffffff';
    skey.textContent = 'S';
    skey.style.top = '60px';
    skey.style.left = '50%';
    skey.style.transform = 'translateX(-50%)';
    skey.style.zIndex = '10000';
    skey.style.fontWeight = 'bold';
    skey.style.borderRadius = '10px';
    skey.style.backgroundColor = '#66ccff';
    skey.style.fontSize = '24px';
    skey.style.height = '50px';
    skey.style.width = '50px';
    skey.style.textAlign = 'center';
    skey.style.lineHeight = '50px';

    const akey = document.createElement('div');
    akey.style.position = 'fixed';
    akey.style.color = '#ffffff';
    akey.textContent = 'A';
    akey.style.top = '60px';
    akey.style.left = '31.5%';
    akey.style.transform = 'translateX(-50%)';
    akey.style.zIndex = '10000';
    akey.style.fontWeight = 'bold';
    akey.style.borderRadius = '10px';
    akey.style.backgroundColor = '#66ccff';
    akey.style.fontSize = '24px';
    akey.style.height = '50px';
    akey.style.width = '50px';
    akey.style.textAlign = 'center';
    akey.style.lineHeight = '50px';

    const dkey = document.createElement('div');
    dkey.style.position = 'fixed';
    dkey.style.color = '#ffffff';
    dkey.textContent = 'D';
    dkey.style.top = '60px';
    dkey.style.left = '68%';
    dkey.style.transform = 'translateX(-50%)';
    dkey.style.zIndex = '10000';
    dkey.style.fontWeight = 'bold';
    dkey.style.borderRadius = '10px';
    dkey.style.backgroundColor = '#66ccff';
    dkey.style.fontSize = '24px';
    dkey.style.height = '50px';
    dkey.style.width = '50px';
    dkey.style.textAlign = 'center';
    dkey.style.lineHeight = '50px';

    const lmb = document.createElement('div');
    lmb.style.position = 'fixed';
    lmb.style.color = '#ffffff';
    lmb.textContent = 'LMB';
    lmb.style.top = '115px';
    lmb.style.left = '260px';
    lmb.style.transform = 'translateX(-50%)';
    lmb.style.zIndex = '10000';
    lmb.style.fontWeight = 'bold';
    lmb.style.borderRadius = '10px';
    lmb.style.backgroundColor = '#66ccff';
    lmb.style.fontSize = '18px';
    lmb.style.height = '50px';
    lmb.style.width = '50px';
    lmb.style.textAlign = 'center';
    lmb.style.lineHeight = '50px';

    const rmb = document.createElement('div');
    rmb.style.position = 'fixed';
    rmb.style.color = '#ffffff';
    rmb.textContent = 'RMB';
    rmb.style.top = '60px';
    rmb.style.left = '260px';
    rmb.style.transform = 'translateX(-50%)';
    rmb.style.zIndex = '10000';
    rmb.style.fontWeight = 'bold';
    rmb.style.borderRadius = '10px';
    rmb.style.backgroundColor = '#66ccff';
    rmb.style.fontSize = '18px';
    rmb.style.height = '50px';
    rmb.style.width = '50px';
    rmb.style.textAlign = 'center';
    rmb.style.lineHeight = '50px';

    const shift = document.createElement('div');
    shift.style.position = 'fixed';
    shift.style.color = '#ffffff';
    shift.textContent = 'SPRINT';
    shift.style.top = '115px';
    shift.style.left = '40px';
    shift.style.transform = 'translateX(-50%)';
    shift.style.zIndex = '10000';
    shift.style.fontWeight = 'bold';
    shift.style.borderRadius = '10px';
    shift.style.backgroundColor = '#66ccff';
    shift.style.fontSize = '10px';
    shift.style.height = '50px';
    shift.style.width = '50px';
    shift.style.textAlign = 'center';
    shift.style.lineHeight = '50px';

    const crouch = document.createElement('div');
    crouch.style.position = 'fixed';
    crouch.style.color = '#ffffff';
    crouch.textContent = 'CROUCH';
    crouch.style.top = '60px';
    crouch.style.left = '40px';
    crouch.style.transform = 'translateX(-50%)';
    crouch.style.zIndex = '10000';
    crouch.style.fontWeight = 'bold';
    crouch.style.borderRadius = '10px';
    crouch.style.backgroundColor = '#66ccff';
    crouch.style.fontSize = '10px';
    crouch.style.height = '50px';
    crouch.style.width = '50px';
    crouch.style.textAlign = 'center';
    crouch.style.lineHeight = '50px';

    const space = document.createElement('div');
    space.style.position = 'fixed';
    space.style.color = '#ffffff';
    space.textContent = '_____';
    space.style.top = '115px';
    space.style.left = '50%';
    space.style.transform = 'translateX(-50%)';
    space.style.zIndex = '10000';
    space.style.fontWeight = 'bold';
    space.style.borderRadius = '10px';
    space.style.backgroundColor = '#66ccff';
    space.style.fontSize = '18px';
    space.style.height = '50px';
    space.style.width = '160px';
    space.style.textAlign = 'center';
    space.style.lineHeight = '50px';

    // Add the elements to the body and the clientMainMenu
    keystrokescontainer.appendChild(wkey);
    keystrokescontainer.appendChild(skey);
    keystrokescontainer.appendChild(akey);
    keystrokescontainer.appendChild(dkey);
    keystrokescontainer.appendChild(lmb);
    keystrokescontainer.appendChild(rmb);
    keystrokescontainer.appendChild(space);
    keystrokescontainer.appendChild(shift);
    keystrokescontainer.appendChild(crouch);

    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyW') {
            wkey.style.backgroundColor = '#3366ff';
        }
        else if (event.code === 'KeyS') {
            skey.style.backgroundColor = '#3366ff';
        }
        else if (event.code === 'KeyA') {
            akey.style.backgroundColor = '#3366ff';
        }
        else if (event.code === 'KeyD') {
            dkey.style.backgroundColor = '#3366ff';
        }
        else if (event.code === 'Space') {
            space.style.backgroundColor = '#3366ff';
        }
        else if (event.code === 'ShiftLeft') {
            shift.style.backgroundColor = '#3366ff';
        }
        else if (event.code === 'KeyC' || event.code === 'KeyZ' || event.key === 'Control') {
            crouch.style.backgroundColor = '#3366ff';
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'KeyW') {
            wkey.style.backgroundColor = '#66ccff';
        }
        else if (event.code === 'KeyS') {
            skey.style.backgroundColor = '#66ccff';
        }
        else if (event.code === 'KeyA') {
            akey.style.backgroundColor = '#66ccff';
        }
        else if (event.code === 'KeyD') {
            dkey.style.backgroundColor = '#66ccff';
        }
        else if (event.code === 'Space') {
            space.style.backgroundColor = '#66ccff';
        }
        else if (event.code === 'ShiftLeft') {
            shift.style.backgroundColor = '#66ccff';
        }
        else if (event.code === 'KeyC' || event.code === 'KeyZ' || event.key === 'Control') {
            crouch.style.backgroundColor = '#66ccff';
        }
    });

    document.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            lmb.style.backgroundColor = '#3366ff';
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = '#3366ff';
        }
    });

    document.addEventListener('mouseup', (event) => {
        if (event.button === 0) {
            lmb.style.backgroundColor = '#66ccff';
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = '#66ccff';
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === '`') {
            if (keystrokescontainer.style.visibility === 'hidden') {
                keystrokescontainer.style.visibility = 'visible';
            } else {
                keystrokescontainer.style.visibility = 'hidden';
            }
        }
    });
})();