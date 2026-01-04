// ==UserScript==
// @name         Bloxd.io Resolution Scaler
// @match        https://bloxd.io/*
// @description  IMPORTANT: Press = (equals key) WHILE IN A GAMEMODE to toggle the resolution scaler UI.
// @license Creative Commons Attribution-NoDerivatives (CC BY-ND) license. This license allows others to share my script, but you cannot modify it or redistribute it in any form.
// @version 0.0.1.20241110000357
// @namespace https://greasyfork.org/users/1393603
// @downloadURL https://update.greasyfork.org/scripts/516603/Bloxdio%20Resolution%20Scaler.user.js
// @updateURL https://update.greasyfork.org/scripts/516603/Bloxdio%20Resolution%20Scaler.meta.js
// ==/UserScript==

(function() {
    let w, h, v = false, c;

    const style = document.createElement('style');
    style.textContent = '.s{position:fixed;top:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.7);padding:10px;border-radius:15px;z-index:10000;display:none;color:white}.n{margin-left:10px;min-width:40px;display:inline-block}';
    document.head.appendChild(style);

    function init() {
        const canvas = document.getElementById('noa-canvas');
        if (canvas) {
            w = canvas.width;
            h = canvas.height;

            c = document.createElement('div');
            c.className = 's';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '1';
            slider.step = '0.05';
            slider.value = '1';

            const num = document.createElement('span');
            num.className = 'n';
            num.textContent = '1.00';

            slider.oninput = function() {
                num.textContent = (+this.value).toFixed(2);
                canvas.width = w * this.value;
                canvas.height = h * this.value;
            };

            c.appendChild(slider);
            c.appendChild(num);
            document.body.appendChild(c);

            const orig = Element.prototype.requestPointerLock;
            Element.prototype.requestPointerLock = function() {
                if (!v) orig.call(this);
            };

            document.addEventListener('keydown', e => {
                if (e.key === '=' && e.repeat === false) {
                    v = !v;
                    c.style.display = v ? 'block' : 'none';
                    if (document.pointerLockElement) document.exitPointerLock();
                }
            });
        }
    }

    const i = setInterval(() => {
        if (document.getElementById('noa-canvas')) {
            clearInterval(i);
            init();
        }
    }, 100);
})();