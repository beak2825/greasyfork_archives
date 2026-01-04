// ==UserScript==
// @name         GO SMS VIEWER
// @name:kr      김일성
// @namespace    deadinside
// @version      0.5
// @description    view go sms files 
// @description:kr 조선로동당
// @author       deadinside
// @match        http://gosms.gomocdn.com/mms/v14/index.html
// @grant        GM_xmlhttpRequest
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/416542/GO%20SMS%20VIEWER.user.js
// @updateURL https://update.greasyfork.org/scripts/416542/GO%20SMS%20VIEWER.meta.js
// ==/UserScript==

(function () {
    'use strict'

    const tourl = x => `https://gs.3g.cn/D/${x.toString(16)}/w`;

    let start = 1405742, ppage = 99;

    const iframe = src => `<iframe src="${src}" style='height: 400px;'></iframe>`;
    const html = `
    <style>body{background: #000; overflow: scroll; font-size: 16px;} nav {width: 100%;display: flex;position: fixed;left: 0;background: #000;padding: 20px;} nav .panel {margin: auto;color: red;display: flex;color: red;}nav .panel button {background: red;border: none;margin-right: 5px;}nav .panel * {font-family: monospace;}nav .panel input {background: #000;border: 1px solid red;width: 80px;color: red;margin-right: 10px;} </style>
    
    <nav> 
    <div class="panel">
    <label for="ppage">files per page:
        <input type="text" id="ppage" value='99'/>
    </label>
    <label for="start">start id:
        <input type="text" id="start" value='1405742'/>
    </label>
    <button id='back'>back</button>
    <button id='next'>next</button>
    </div>
    </nav>

    <div id='box'></div>
    `;

    document.body.innerHTML = html;

    const box = document.querySelector('#box'),
        ppageEl = document.getElementById('ppage'),
        startEl = document.getElementById('start'),
        next = document.getElementById('next'),
        back = document.getElementById('back');


    const reset = () => {
        console.log(ppage, start)
        ppage = parseInt(ppageEl.value);
        start = parseInt(startEl.value);
    }

    const rem = () => box.innerHTML = '';

    const go = (to = true) => {
        rem();
        reset();
        start += to ? ppage : -ppage;
        startEl.value = start;
        const urls = Array(ppage).fill(start).map((i, j) => i + j).map(x => tourl(x));
        box.innerHTML = urls.map(u => iframe(u)).join('\n');
    }
    go();

    next.addEventListener('click', go);
    back.addEventListener('click', () => go(false));
})();