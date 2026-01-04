// ==UserScript==
// @name         bilibili 同时显示 av 号和 bv 号
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  同时显示视频的 bv 号和 av 号
// @author       acdzh
// @match        *://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398533/bilibili%20%E5%90%8C%E6%97%B6%E6%98%BE%E7%A4%BA%20av%20%E5%8F%B7%E5%92%8C%20bv%20%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/398533/bilibili%20%E5%90%8C%E6%97%B6%E6%98%BE%E7%A4%BA%20av%20%E5%8F%B7%E5%92%8C%20bv%20%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function convertNewUrl() {
        let tables = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'.split('');
        let tr = {};
        tables.forEach((t, i) => {tr[t] = i});

        let s = [11, 10, 3, 8, 4, 6, 2, 9, 5, 7];
        let xorNum = 177451812n;
        let addNum = 100618342136696320n;

        let bvToAv = bv => {
            let r = 0n;
            s.forEach((n, i) => { r += BigInt(tr[bv[n]]) * BigInt(58 ** i);})
            return `av${(r - addNum) ^ xorNum}`;
        }

        let aidToBv = aid => {
            let x = (BigInt(aid) ^ xorNum) + addNum;
            let r = ['B', 'V', ...new Array(8)];
            s.forEach((n, i) => { r[n] = tables[x / BigInt(58 ** i) % 58n];});
            return r.join('')
        }

        let urlParts = location.href.split('/');
        if(urlParts[3] !== 'video') return '';
        let beforeParam = location.href.split('?')[1] || '';

        let v = urlParts[4].split('?')[0];
        if (v[0] === 'B' || v[0] === 'b') {
            return `/video/${v}?${beforeParam}${beforeParam ? '&' : ''}` + (beforeParam.indexOf('aid') === -1 ? `aid=${bvToAv(v)}` : '');
        } else {
            return `/video/${aidToBv(parseInt(v.slice(2,100)))}?${beforeParam}${beforeParam ? '&' : ''}` + (beforeParam.indexOf('aid') === -1 ? `aid=${v}` : '');
        }
    }

    history.replaceState({}, document.title, convertNewUrl());

    /*
    (function(history){
        var pushState = history.pushState;
        history.pushState = function(state) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({state: state});
            }
            // ... whatever else you want to do
            // maybe call onhashchange e.handler
            return pushState.apply(history, arguments);
        };
    })(window.history);

    history.onpushstate = function(e) {
        history.replaceState({}, document.title, convertNewUrl());
    }
    */

})();