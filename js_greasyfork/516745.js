// ==UserScript==
// @name         Akropolix Custom Background for Discord (CHECK DESCRIPTION)
// @namespace    http://tampermonkey.net/
// @version      1.0
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
// @connect      i.imgur.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516745/Akropolix%20Custom%20Background%20for%20Discord%20%28CHECK%20DESCRIPTION%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516745/Akropolix%20Custom%20Background%20for%20Discord%20%28CHECK%20DESCRIPTION%29.meta.js
// ==/UserScript==
 
(async window => {
    'use strict';
    let intervalTime = 30 * 1000;
    let urls = [
        'https://i.imgur.com/hlZrVDB.jpeg',
        'https://i.imgur.com/SIyqgKB.jpeg',
        'https://i.imgur.com/J8V91hl.jpeg',
        'https://i.imgur.com/0MWeIGh.jpeg',
        'https://i.imgur.com/dlXmhj2.jpeg',
        'https://i.imgur.com/0n5ABML.jpeg',
        'https://i.imgur.com/E97d5Os.jpeg',
        'https://i.imgur.com/M5XW9to.jpeg',
        'https://i.imgur.com/BA9KErM.jpeg',
        'https://i.imgur.com/HlmWDMU.jpeg',
        'https://i.imgur.com/mpHgYA0.jpeg',
        'https://i.imgur.com/i5xTVVY.jpeg',
        'https://i.imgur.com/2kRiHpi.jpeg',
        'https://i.imgur.com/9kpCu1G.jpeg',
        'https://i.imgur.com/9jIb37N.jpeg',
        'https://i.imgur.com/xMFjdBO.png',
        'https://i.imgur.com/dDTrHos.jpeg',
        'https://i.imgur.com/b2uC7xM.jpeg',
        'https://i.imgur.com/MEQXj5M.png',
        'https://i.imgur.com/MEQXj5M.png',
        'https://i.imgur.com/oA6omGR.jpeg',
        'https://i.imgur.com/raYviJK.jpeg',
        'https://i.imgur.com/D0LzVED.jpeg',
        'https://i.imgur.com/TVoRUuK.jpeg',
        'https://i.imgur.com/p8YLCSF.png',
        'https://i.imgur.com/bTiEKQ6.jpeg',
        'https://i.imgur.com/Qouo9mm.jpeg'
      
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