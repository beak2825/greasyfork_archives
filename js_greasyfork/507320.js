// ==UserScript==
// @name         Discord - Custom Background Image
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Set custom background images on Discord
// @author       You
// @match        https://discord.com/channels/*
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addElement
// @connect      i.imgur.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507320/Discord%20-%20Custom%20Background%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/507320/Discord%20-%20Custom%20Background%20Image.meta.js
// ==/UserScript==

(async window => {
    'use strict';
    
    let intervalTime = 30 * 1000; // 30 seconds
    let urls = [
        'https://i.imgur.com/cHKbKQT.jpeg',
        'https://i.imgur.com/sqmqy20.png',
        'https://i.imgur.com/cCL6TPk.jpeg',
        'https://i.imgur.com/Z6GYpxh.jpeg',
        'https://i.imgur.com/FNJdY5h.jpeg',
        'https://i.imgur.com/uKVG1XM.jpeg'
    ];

    let g_elm = null;

    // Delete background element
    const del = () => {
        if (g_elm) {
            g_elm.remove();
            g_elm = null;
            return true;
        }
        return false;
    };

    // Add input for configuration
    const addInput = async value => {
        if (del()) return;
        g_elm = await GM.addElement(document.body, 'div', {});
        Object.assign(g_elm.style, {
            'position': 'fixed',
            'width': '100vw',
            'height': '100vh',
            'display': 'flex',
            'flex-wrap': 'wrap',
            'justify-content': 'center',
            'align-items': 'center',
            'z-index': '9999',
            'background-color': 'rgba(0, 0, 0, 0.8)'
        });
        const input = await GM.addElement(g_elm, 'textarea', { textContent: value });
        Object.assign(input.style, {
            'width': '50vw',
            'height': '30vh',
            'font-size': '24px',
            'font-weight': 'bold'
        });
        const btnSave = await GM.addElement(g_elm, 'button', { textContent: 'Save' });
        const btnCancel = await GM.addElement(g_elm, 'button', { textContent: 'Cancel' });
        
        [btnSave, btnCancel].forEach(btn => {
            Object.assign(btn.style, {
                'color': 'white',
                'background-color': 'red',
                'margin': '5px',
                'padding': '10px',
                'cursor': 'pointer'
            });
        });

        return new Promise((resolve, reject) => {
            btnSave.addEventListener('click', () => del() && resolve(input.value));
            btnCancel.addEventListener('click', () => del() && reject());
        });
    };

    // Fetch and set values
    const key1 = 'intervalTime';
    GM.registerMenuCommand('Set interval time', async () => {
        const res = await addInput(await GM.getValue(key1, intervalTime));
        if (!res) return;
        const m = res.match(/[0-9]+/);
        if (!m) return;
        const n = Number(m[0]);
        intervalTime = n;
        GM.setValue(key1, n);
    });
    intervalTime = await GM.getValue(key1, intervalTime);

    const key2 = 'URL';
    GM.registerMenuCommand('Set custom URLs', async () => {
        const res = await addInput(await GM.getValue(key2, urls.join('\n')));
        if (!res) return;
        const a = findURL(res);
        if (!a.length) return;
        urls = a;
        GM.setValue(key2, a.join('\n'));
    });
    urls = (await GM.getValue(key2, urls.join('\n'))).split('\n');

    const findURL = str => {
        const m = str.match(/(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g);
        return m ? m : [];
    };

    const memo = new Map();
    const get = async url => {
        if (memo.has(url)) return memo.get(url);
        const res = await GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
        });
        const _url = URL.createObjectURL(new Blob([res.response], {type: 'application/octet-binary'}));
        memo.set(url, _url);
        return _url;
    };

    let g_url = await get(urls[0]);

    const setBackgroundImage = () => {
        const discordBackground = document.querySelector('[class^="app-"]');
        if (discordBackground) {
            Object.assign(discordBackground.style, {
                'background-image': `url("${g_url}")`,
                'background-attachment': 'fixed',
                'background-position': 'center center',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'transition-duration': '1.5s'
            });
        }
    };

    const setOtherElements = () => {
        document.querySelectorAll('*').forEach(v => v.style.backgroundColor = 'rgba(0, 0, 0, 0)');
        const contentBackground = document.querySelector('[class^="chatContent"]');
        if (contentBackground) {
            contentBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }
    };

    setBackgroundImage();
    setOtherElements();

    let _url = location.href,
        _time = 0,
        index = 0;

    const update = async () => {
        const time = performance.now();
        if (time - _time > intervalTime) {
            g_url = await get(urls[(++index) % urls.length]);
            _time = performance.now();
            setBackgroundImage();
        } else {
            const url = location.href;
            if (url !== _url) {
                _url = url;
                setOtherElements();
            }
        }
        requestAnimationFrame(update);
    };

    update();
})(window.unsafeWindow || window);
