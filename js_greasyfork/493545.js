// ==UserScript==
// @name         igxe租赁押金金额修改
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  孽晓笙
// @match        https://www.igxe.cn/*
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/493545/igxe%E7%A7%9F%E8%B5%81%E6%8A%BC%E9%87%91%E9%87%91%E9%A2%9D%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/493545/igxe%E7%A7%9F%E8%B5%81%E6%8A%BC%E9%87%91%E9%87%91%E9%A2%9D%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // let a = Array.from(document.querySelectorAll('input')).filter(e => e?.id?.includes('cash_pledge-'))

    // a.some(e => {
    //     e.value = parseFloat(e.value * 1.2).toFixed(2)
    // })
    const config = {
        fudu: 1.2  //金额修改这里
    }

    document.addEventListener('dblclick', () => {

        'use strict';
        let a = Array.from(document.querySelectorAll('input')).filter(e => e?.id?.includes('cash_pledge-'))
        console.log(a)
        a.some(e => {

            e.value = parseFloat(e.value * config.fudu).toFixed(2)
        })



        const event = new Event('input');
        a.dispatchEvent(event);
    })
})();
