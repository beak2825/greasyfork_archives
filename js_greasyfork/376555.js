// ==UserScript==
// @name         light multibox
// @version      0.11
// @description  just hurt people
// @author       mankind
// @match        *://diep.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/176941
// @downloadURL https://update.greasyfork.org/scripts/376555/light%20multibox.user.js
// @updateURL https://update.greasyfork.org/scripts/376555/light%20multibox.meta.js
// ==/UserScript==

'use strict';

document.addEventListener('keydown', function(e) {
    var key = e.keyCode || e.which;
    GM_setValue('Diep_key' + key, 1);
});

document.addEventListener('keyup', function(e) {
    var key = e.keyCode || e.which;
    GM_setValue('Diep_key' + key, 0);
});

document.addEventListener('mousemove', function(e) {
    var x = e.clientX;
    var y = e.clientY;
    if(x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
        return;
    }
    GM_setValue('Diep_mouseX', x);
    GM_setValue('Diep_mouseY', y);
    GM_setValue('Diep_mouseX_scale', window.innerWidth);
    GM_setValue('Diep_mouseY_scale', window.innerHeight);
});

document.addEventListener('mousedown', function(e) {
    var button = e.button;
    GM_setValue("Diep_mouse_button" + button, 1);
});

document.addEventListener('mouseup', function(e) {
    var button = e.button;
    GM_setValue("Diep_mouse_button" + button, 0);
});

function mousePress(button, on) {
    on ? canvas.dispatchEvent(new MouseEvent('mousedown', { 'button': button })) : canvas.dispatchEvent(new MouseEvent('mouseup', { 'button': button }));
}

function mouseMove(x, y) {
    input.mouse(x, y);
}

function keyPress(key, on) {
    on ? input.keyDown(key) : input.keyUp(key);
}

function scale(x, y, scalex, scaley) {
    return { x: x * (window.innerWidth / scalex), y: y * (window.innerHeight / scaley) };
}

function syncMouse() {
    var button0 = GM_getValue('Diep_mouse_button0');
    var button1 = GM_getValue('Diep_mouse_button1');
    var button2 = GM_getValue('Diep_mouse_button2');
    var x = GM_getValue('Diep_mouseX');
    var y = GM_getValue('Diep_mouseY');
    var scalex = GM_getValue('Diep_mouseX_scale');
    var scaley = GM_getValue('Diep_mouseY_scale');
    var scaled = scale(x, y, scalex, scaley);
    mouseMove(scaled.x, scaled.y);
    mousePress(0, button0);
    mousePress(1, button1);
    mousePress(2, button2);
}

function syncKeys() {
    keyPress(65, GM_getValue('Diep_key' + 65, 0));
    keyPress(68, GM_getValue('Diep_key' + 68, 0));
    keyPress(83, GM_getValue('Diep_key' + 83, 0));
    keyPress(87, GM_getValue('Diep_key' + 87, 0));
    keyPress(67, GM_getValue('Diep_key' + 67, 0));
    keyPress(69, GM_getValue('Diep_key' + 69, 0));
    keyPress(75, GM_getValue('Diep_key' + 75, 0));
    keyPress(79, GM_getValue('Diep_key' + 79, 0));
    keyPress(220, GM_getValue('Diep_key' + 220, 0));
    keyPress(77, GM_getValue('Diep_key' + 77, 0));
    keyPress(85, GM_getValue('Diep_key' + 85, 0));
    for(let i = 49; i < 58; i++) {
        keyPress(i, GM_getValue('Diep_key' + i, 0));
    }
    for(let i = 37; i < 41; i++) {
        keyPress(i, GM_getValue('Diep_key' + i, 0));
    }
    keyPress(13, GM_getValue('Diep_key' + 13, 0));
    keyPress(16, GM_getValue('Diep_key' + 16, 0));
}

(function loop() {
    if(document.readyState != 'complete') {
        return;
    }
    if(!document.hasFocus()) {
        syncKeys();
        syncMouse();
    }
    setTimeout(loop, 100);
})();