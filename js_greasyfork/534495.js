// ==UserScript==
// @name         Diep.io Multi-Box Mouse + Movement Sync
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle Multi-boxing with Q key: sync mouse + movement across Diep.io tabs
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534495/Diepio%20Multi-Box%20Mouse%20%2B%20Movement%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/534495/Diepio%20Multi-Box%20Mouse%20%2B%20Movement%20Sync.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isMaster = false;
    let enabled = false;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'q') {
            enabled = !enabled;
            if (enabled) {
                isMaster = true;
                console.log('[MultiBox] Master mode enabled.');
            } else {
                isMaster = false;
                console.log('[MultiBox] Master mode disabled.');
            }
        }

        if (enabled && isMaster) {
            localStorage.setItem('multibox_keydown', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('keyup', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_keyup', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_mouse', JSON.stringify({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            }));
        }
    });

    setInterval(() => {
        if (!enabled || isMaster) return;

        // Sync keys
        const down = JSON.parse(localStorage.getItem('multibox_keydown') || '{}');
        const up = JSON.parse(localStorage.getItem('multibox_keyup') || '{}');

        if (down.time && down.time > (window.lastDown || 0)) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: down.key }));
            window.lastDown = down.time;
        }

        if (up.time && up.time > (window.lastUp || 0)) {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: up.key }));
            window.lastUp = up.time;
        }

        // Sync mouse
        const mouse = JSON.parse(localStorage.getItem('multibox_mouse') || '{}');
        if (mouse.time && mouse.time > (window.lastMouse || 0)) {
            const event = new MouseEvent('mousemove', {
                clientX: mouse.x,
                clientY: mouse.y,
                bubbles: true
            });
            document.dispatchEvent(event);
            window.lastMouse = mouse.time;
        }
    }, 10);
})();
// ==UserScript==
// @name         Diep.io Multi-Box Mouse + Movement Sync
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle Multi-boxing with Q key: sync mouse + movement across Diep.io tabs
// @match        *://diep.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isMaster = false;
    let enabled = false;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'q') {
            enabled = !enabled;
            if (enabled) {
                isMaster = true;
                console.log('[MultiBox] Master mode enabled.');
            } else {
                isMaster = false;
                console.log('[MultiBox] Master mode disabled.');
            }
        }

        if (enabled && isMaster) {
            localStorage.setItem('multibox_keydown', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('keyup', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_keyup', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_mouse', JSON.stringify({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            }));
        }
    });

    setInterval(() => {
        if (!enabled || isMaster) return;

        // Sync keys
        const down = JSON.parse(localStorage.getItem('multibox_keydown') || '{}');
        const up = JSON.parse(localStorage.getItem('multibox_keyup') || '{}');

        if (down.time && down.time > (window.lastDown || 0)) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: down.key }));
            window.lastDown = down.time;
        }

        if (up.time && up.time > (window.lastUp || 0)) {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: up.key }));
            window.lastUp = up.time;
        }

        // Sync mouse
        const mouse = JSON.parse(localStorage.getItem('multibox_mouse') || '{}');
        if (mouse.time && mouse.time > (window.lastMouse || 0)) {
            const event = new MouseEvent('mousemove', {
                clientX: mouse.x,
                clientY: mouse.y,
                bubbles: true
            });
            document.dispatchEvent(event);
            window.lastMouse = mouse.time;
        }
    }, 10);
})();
// ==UserScript==
// @name         Diep.io Multi-Box Mouse + Movement Sync
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle Multi-boxing with Q key: sync mouse + movement across Diep.io tabs
// @match        *://diep.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isMaster = false;
    let enabled = false;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'q') {
            enabled = !enabled;
            if (enabled) {
                isMaster = true;
                console.log('[MultiBox] Master mode enabled.');
            } else {
                isMaster = false;
                console.log('[MultiBox] Master mode disabled.');
            }
        }

        if (enabled && isMaster) {
            localStorage.setItem('multibox_keydown', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('keyup', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_keyup', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_mouse', JSON.stringify({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            }));
        }
    });

    setInterval(() => {
        if (!enabled || isMaster) return;

        // Sync keys
        const down = JSON.parse(localStorage.getItem('multibox_keydown') || '{}');
        const up = JSON.parse(localStorage.getItem('multibox_keyup') || '{}');

        if (down.time && down.time > (window.lastDown || 0)) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: down.key }));
            window.lastDown = down.time;
        }

        if (up.time && up.time > (window.lastUp || 0)) {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: up.key }));
            window.lastUp = up.time;
        }

        // Sync mouse
        const mouse = JSON.parse(localStorage.getItem('multibox_mouse') || '{}');
        if (mouse.time && mouse.time > (window.lastMouse || 0)) {
            const event = new MouseEvent('mousemove', {
                clientX: mouse.x,
                clientY: mouse.y,
                bubbles: true
            });
            document.dispatchEvent(event);
            window.lastMouse = mouse.time;
        }
    }, 10);
})();
// ==UserScript==
// @name         Diep.io Multi-Box Mouse + Movement Sync
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle Multi-boxing with Q key: sync mouse + movement across Diep.io tabs
// @match        *://diep.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isMaster = false;
    let enabled = false;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'q') {
            enabled = !enabled;
            if (enabled) {
                isMaster = true;
                console.log('[MultiBox] Master mode enabled.');
            } else {
                isMaster = false;
                console.log('[MultiBox] Master mode disabled.');
            }
        }

        if (enabled && isMaster) {
            localStorage.setItem('multibox_keydown', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('keyup', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_keyup', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_mouse', JSON.stringify({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            }));
        }
    });

    setInterval(() => {
        if (!enabled || isMaster) return;

        // Sync keys
        const down = JSON.parse(localStorage.getItem('multibox_keydown') || '{}');
        const up = JSON.parse(localStorage.getItem('multibox_keyup') || '{}');

        if (down.time && down.time > (window.lastDown || 0)) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: down.key }));
            window.lastDown = down.time;
        }

        if (up.time && up.time > (window.lastUp || 0)) {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: up.key }));
            window.lastUp = up.time;
        }

        // Sync mouse
        const mouse = JSON.parse(localStorage.getItem('multibox_mouse') || '{}');
        if (mouse.time && mouse.time > (window.lastMouse || 0)) {
            const event = new MouseEvent('mousemove', {
                clientX: mouse.x,
                clientY: mouse.y,
                bubbles: true
            });
            document.dispatchEvent(event);
            window.lastMouse = mouse.time;
        }
    }, 10);
})();
// ==UserScript==
// @name         Diep.io Multi-Box Mouse + Movement Sync
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle Multi-boxing with Q key: sync mouse + movement across Diep.io tabs
// @match        *://diep.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isMaster = false;
    let enabled = false;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'q') {
            enabled = !enabled;
            if (enabled) {
                isMaster = true;
                console.log('[MultiBox] Master mode enabled.');
            } else {
                isMaster = false;
                console.log('[MultiBox] Master mode disabled.');
            }
        }

        if (enabled && isMaster) {
            localStorage.setItem('multibox_keydown', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('keyup', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_keyup', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_mouse', JSON.stringify({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            }));
        }
    });

    setInterval(() => {
        if (!enabled || isMaster) return;

        // Sync keys
        const down = JSON.parse(localStorage.getItem('multibox_keydown') || '{}');
        const up = JSON.parse(localStorage.getItem('multibox_keyup') || '{}');

        if (down.time && down.time > (window.lastDown || 0)) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: down.key }));
            window.lastDown = down.time;
        }

        if (up.time && up.time > (window.lastUp || 0)) {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: up.key }));
            window.lastUp = up.time;
        }

        // Sync mouse
        const mouse = JSON.parse(localStorage.getItem('multibox_mouse') || '{}');
        if (mouse.time && mouse.time > (window.lastMouse || 0)) {
            const event = new MouseEvent('mousemove', {
                clientX: mouse.x,
                clientY: mouse.y,
                bubbles: true
            });
            document.dispatchEvent(event);
            window.lastMouse = mouse.time;
        }
    }, 10);
})();
// ==UserScript==
// @name         Diep.io Multi-Box Mouse + Movement Sync
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle Multi-boxing with Q key: sync mouse + movement across Diep.io tabs
// @match        *://diep.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isMaster = false;
    let enabled = false;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'q') {
            enabled = !enabled;
            if (enabled) {
                isMaster = true;
                console.log('[MultiBox] Master mode enabled.');
            } else {
                isMaster = false;
                console.log('[MultiBox] Master mode disabled.');
            }
        }

        if (enabled && isMaster) {
            localStorage.setItem('multibox_keydown', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('keyup', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_keyup', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_mouse', JSON.stringify({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            }));
        }
    });

    setInterval(() => {
        if (!enabled || isMaster) return;

        // Sync keys
        const down = JSON.parse(localStorage.getItem('multibox_keydown') || '{}');
        const up = JSON.parse(localStorage.getItem('multibox_keyup') || '{}');

        if (down.time && down.time > (window.lastDown || 0)) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: down.key }));
            window.lastDown = down.time;
        }

        if (up.time && up.time > (window.lastUp || 0)) {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: up.key }));
            window.lastUp = up.time;
        }

        // Sync mouse
        const mouse = JSON.parse(localStorage.getItem('multibox_mouse') || '{}');
        if (mouse.time && mouse.time > (window.lastMouse || 0)) {
            const event = new MouseEvent('mousemove', {
                clientX: mouse.x,
                clientY: mouse.y,
                bubbles: true
            });
            document.dispatchEvent(event);
            window.lastMouse = mouse.time;
        }
    }, 10);
})();
// ==UserScript==
// @name         Diep.io Multi-Box Mouse + Movement Sync
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle Multi-boxing with Q key: sync mouse + movement across Diep.io tabs
// @match        *://diep.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isMaster = false;
    let enabled = false;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'q') {
            enabled = !enabled;
            if (enabled) {
                isMaster = true;
                console.log('[MultiBox] Master mode enabled.');
            } else {
                isMaster = false;
                console.log('[MultiBox] Master mode disabled.');
            }
        }

        if (enabled && isMaster) {
            localStorage.setItem('multibox_keydown', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('keyup', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_keyup', JSON.stringify({ key: e.key, time: Date.now() }));
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (enabled && isMaster) {
            localStorage.setItem('multibox_mouse', JSON.stringify({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            }));
        }
    });

    setInterval(() => {
        if (!enabled || isMaster) return;

        // Sync keys
        const down = JSON.parse(localStorage.getItem('multibox_keydown') || '{}');
        const up = JSON.parse(localStorage.getItem('multibox_keyup') || '{}');

        if (down.time && down.time > (window.lastDown || 0)) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: down.key }));
            window.lastDown = down.time;
        }

        if (up.time && up.time > (window.lastUp || 0)) {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: up.key }));
            window.lastUp = up.time;
        }

        // Sync mouse
        const mouse = JSON.parse(localStorage.getItem('multibox_mouse') || '{}');
        if (mouse.time && mouse.time > (window.lastMouse || 0)) {
            const event = new MouseEvent('mousemove', {
                clientX: mouse.x,
                clientY: mouse.y,
                bubbles: true
            });
            document.dispatchEvent(event);
            window.lastMouse = mouse.time;
        }
    }, 10);
})();
