// ==UserScript==
// @name         Yassir costum Background DISCORD
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  You can set custom background image of Discord;
// @author       You
// @match        https://discord.com/channels/*
// @match        https://discord.com/channels/*/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addElement
// @connect      i.pinimg.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464055/Yassir%20costum%20Background%20DISCORD.user.js
// @updateURL https://update.greasyfork.org/scripts/464055/Yassir%20costum%20Background%20DISCORD.meta.js
// ==/UserScript==

(async window => {
    'use strict';
    let intervalTime = 30 * 1000;
    let urls = [
        'https://i.imgur.com/sqmqy20.png',
        'https://i.imgur.com/cCL6TPk.jpeg',
        'https://i.imgur.com/Z6GYpxh.jpeg',
        'https://i.imgur.com/FNJdY5h.jpeg',
        'https://i.imgur.com/uKVG1XM.jpeg'
    ];
    let g_elm = null;
    const del = () => {
        if(g_elm) {
            g_elm.remove();
            g_elm = null;
            return true;
        }
        else return false;
    };
    const addInput = async value => {
        if(del()) return;
        g_elm = await GM.addElement(document.body, 'div', {});
        Object.assign(g_elm.style, {
            'position': 'fixed',
            'width': '100vw',
            'height': '100vh',
            'display': 'flex',
            'flex-wrap': 'wrap',
            'justify-content': 'center',
            'align-items': 'center',
            'z-index': Infinity
        });
        const input = await GM.addElement(g_elm, 'textarea', {
            textContent: value
        });
        Object.assign(input.style, {
            'width': '50vw',
            'height': '30vh',
            'font-size': '24px',
            'font-weight': 'bold'
        });
        const btnSave = await GM.addElement(g_elm, 'button', {
            textContent: 'save'
        });
        await GM.addElement(g_elm, 'div', {
            textContent: '　'
        });
        const btnCancel = await GM.addElement(g_elm, 'button', {
            textContent: 'cancel'
        });
        for(const v of [btnSave, btnCancel]) Object.assign(v.style, {
            'color': 'white',
            'backgroundColor': 'red'
        });
        return new Promise((resolve, reject) => {
            btnSave.addEventListener('click', () => del() && resolve(input.value));
            btnCancel.addEventListener('click', () => del() && reject());
        });
    };
    const key1 = 'intervalTime';
    GM.registerMenuCommand('config interval time', async () => {
        const res = await addInput(await GM.getValue(key1, intervalTime));
        if(!res) return;
        const m = res.match(/[0-9]+/);
        if(!m) return;
        const n = Number(m[0]);
        intervalTime = n;
        GM.setValue(key1, n);
    });
    intervalTime = await GM.getValue(key1, intervalTime);
    const key2 = 'URL';
    GM.registerMenuCommand('config URL', async () => {
        const res = await addInput(await GM.getValue(key2, urls.join('\n')));
        if(!res) return;
        const a = findURL(res);
        if(!a.length) return;
        urls = a;
        GM.setValue(key2, a.join('\n'));
    });
    urls = (await GM.getValue(key2, urls.join('\n'))).split('\n');
    const findURL = str => {
        const m = str.match(/(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g);
        return m ? m : [];
    };
    const memo = new Map;
    const get = async url => {
        if(memo.has(url)) return memo.get(url);
        const res = await GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            withCredentials: true,
            responseType: 'arraybuffer',
        });
        const _url = URL.createObjectURL(new Blob([res.response], {type: 'application/octet-binary'}));
        memo.set(url, _url);
        return _url;
    };
    let g_url = await get(urls[0]);
    const wait = resolve => {
        if(document.querySelector('[class^="chatContent"]')) return resolve();
        setTimeout(() => wait(resolve), 500);
    };
    await new Promise(resolve => wait(resolve));
    const setURL = () => {
        Object.assign(document.body.children[0].style, {
            'background-image': 'url("' + g_url + '")',
            'background-attachment': 'fixed',
            'background-position': 'center center',
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'transition-duration': '1.5s'
        });
    };
    setURL();
    const setOther = () => {
        for(const v of document.querySelectorAll('*')) v.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        document.body.children[0].children[3].style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    };
    setOther();
    let _url = location.href,
        _time = 0,
        index = 0;
    const update = async () => {
        const time = performance.now();
        if(time - _time > intervalTime) {
            g_url = await get(urls[(++index) % urls.length]);
            _time = performance.now();
            setURL();
        }
        else {
            const url = location.href;
            if(url !== _url) {
                _url = url;
                setOther();
            }
        }
        requestAnimationFrame(update);
    };
    update();
})(window.unsafeWindow || window);