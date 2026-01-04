// ==UserScript==
// @name         [Neopets] Lottery RNG 2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Rolls lottery tickets.
// @author       Piotr Kardovsky
// @match        https://www.neopets.com/games/lottery.phtml
// @icon         https://www.google.com/s2/favicons?domain=neopets.com
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/462215/%5BNeopets%5D%20Lottery%20RNG%202.user.js
// @updateURL https://update.greasyfork.org/scripts/462215/%5BNeopets%5D%20Lottery%20RNG%202.meta.js
// ==/UserScript==

GM_addStyle(`
#content > table > tbody > tr > td.content > table:nth-child(1) > tbody > tr > td:nth-child(2) > p:nth-child(5) { height: 290px; overflow: auto }
`);

(function() {
    'use strict';
    let sub = document.querySelector('input[value="Buy a Lottery Ticket!"]')

    let rollTicket = () => {
        let lno = [];
        while (lno.length < 6) {
            let rng = 1 + Math.floor(Math.random() * 30);
            while (lno.includes(rng)) { rng = 1 + Math.floor(Math.random() * 30); }
            lno.push(rng);
        }
        return lno.sort((i, j) => i > j ? 1 : -1 );
    }

    let nDupe = () => {
        let tarr = [];
        while (tarr.length < 20) {
            let nums = rollTicket();
            while (tarr.includes(nums)) { nums = rollTicket(); }
            tarr.push(nums);
        }
        //console.log(tarr);
        return tarr;
    }

    let t = null;
    let m = 0;
    let rc = document.querySelector('.content input[name="_ref_ck"]').value;
    let dto = '';

    let twebtn = document.createElement('button');
    twebtn.innerText = "Buy 20 tickets";
    twebtn.style.height = "40px";
    twebtn.addEventListener('click', () => {
        let tloop = setInterval( () => {
            if (m < 20) {
                t = nDupe();
                //dto = `_ref_ck=${rc}&one=${t[m][0]}&two=${t[m][1]}&three=${t[m][2]}&four=${t[m][3]}&five=${t[m][4]}&six=${t[m][5]}`;
                dto = {'_ref_ck': rc, 'one': t[m][0], 'two':t[m][1],'three': t[m][2],'four':t[m][3],'five':t[m][4],'six':t[m][5]};
                parent.$.post('/games/process_lottery.phtml', dto, (r) => {
                    let res = r;
                    console.log(res);
                    if (res.includes('errorMessage')) {clearInterval(tloop); alert('hey')};
                });
                twebtn.innerText = `Ticket ${m+1}/20 bought`;
                m++;
            } else {
                clearInterval(tloop);
            }
        }, 2700 + Math.random() * 2020 );

    });

    document.querySelector('.content table').append(twebtn);



})();