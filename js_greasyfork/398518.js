// ==UserScript==
// @name         AV - BV Converter
// @namespace    http://bilibili.com/
// @version      0.1
// @description  Convert AV BV for Bilibili
// @author       LiYin
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398518/AV%20-%20BV%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/398518/AV%20-%20BV%20Converter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
    let tr = {}
    let i = 0;
    for (i = 0; i < 58; i++) {
        tr[table[i]] = i
    }
    const s = [11, 10, 3, 8, 4, 6, 2, 9, 5, 7]
    const xor = 177451812n
    const add = 100618342136696320n

    function av2bv(x) {
        x = BigInt(parseInt(x))
        x = (x ^ xor) + add
        let r = 'BV          '.split('')
        let i = 0;
        for (i = 0; i < 10; i++) {
            console.log(s[i])
            r[s[i]] = table[BigInt(parseInt(x / 58n)) ** BigInt(i) % 58n]
        }
        return r.join('')
    }
    function bv2av(x) {
        let i = 0;
        let r = 0n
        for (i = 0; i < 10; i++) {
            r += BigInt(tr[x[s[i]]]) * 58n ** BigInt(i)
        }
        return (BigInt(r) - add) ^ xor
    }
    setTimeout(function () {
        console.log("Converting...")
        let ih = document.querySelectorAll('.video-data')[0]
        ih.lastElementChild.classList.add('a-crumbs')
        let spanAV = document.createElement('span')
        spanAV.classList.add('a-crumbs')
        let spanBV = document.createElement('span')
        spanBV.classList.add('a-crumbs')
        let aob = location.pathname.replace('/video/', '')
        if (aob.startsWith('bv') || aob.startsWith('bV') || aob.startsWith('Bv') || aob.startsWith('BV')) {
            spanAV.innerText = 'av' + bv2av(aob)
            spanBV.innerText = aob
        } else {
            spanAV.innerText = aob
            spanBV.innerText = av2bv(aob.replace('av', ''))
        }
        ih.appendChild(spanAV)
        ih.appendChild(spanBV)
    }, 5000)
})();