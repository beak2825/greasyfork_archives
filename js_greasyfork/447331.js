// ==UserScript==
// @name         [Neopets] Select Last X Items (Quick Stock Helper)
// @namespace    https://greasyfork.org/en/scripts/447331
// @version      0.91
// @description  Adds options to quickly-er batch select items in quick stock. Goes from the last item because that's how I roll. ONLY SELECTS. DOUBLE CHECK YOUR OWN INPUTS BEFORE HITTING SUBMIT!
// @author       Piotr Kardovsky
// @match        http*://www.neopets.com/quickstock.phtml*
// @match        http*://neopets.com/quickstock.phtml*
// @icon         https://www.neopets.com//favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/447331/%5BNeopets%5D%20Select%20Last%20X%20Items%20%28Quick%20Stock%20Helper%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447331/%5BNeopets%5D%20Select%20Last%20X%20Items%20%28Quick%20Stock%20Helper%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const actions = ["Stock", "Deposit", "Donate", "Discard", "Gallery", "Closet", "Shed"];

    // Default amount. Simple enuff.
    const DEFAULT_AMOUNT = 10;

    // Default action. You can either use actions[x] where x = a number from 0 to 6, OR:
    // Choose 1 of the following. Make sure they're still in the quotes.
    // "Stock", "Deposit", "Donate", "Discard", "Gallery", "Closet", "Shed"
    const DEFAULT_ACTION = actions[1];

    // Include NC Items by default
    const NC_DEF = true;

    window.addEventListener('load', () => {
        let qs = document.querySelector('form[name="quickstock"] table');
        // 3 is "magic", the header + check all + submit count as rows
        let rws = qs.rows.length - 3;
        //let nr = (rws - Math.floor(rws/20) + 1) % 20 === 0 ? rws - Math.floor(rws/20) + 1 : rws - Math.floor(rws/20);
        let items = qs.querySelectorAll('input[type="hidden"]');
        let ncsep = qs.querySelector('td[colspan="7"]');
        let npi = items.length; let nci = 0;
        if (ncsep != undefined && ncsep != null) {
            nci = qs.querySelectorAll('input[type="radio"][name^="cash_radio_arr"][value="deposit"]').length;
        }

        // Amount
        let num = document.createElement('input');
        num.type = 'number';
        num.min = 0;
        num.max = 70;
        num.value = DEFAULT_AMOUNT;
        num.style.width = '48px';
        num.style.height = '22px';

        // Action
        let sty = document.createElement('select');
        sty.style.height = '28px';
        actions.forEach((i) => {
            let o = document.createElement('option');
            o.text = i;
            sty.add(o);
        });
        sty.value = DEFAULT_ACTION;

        // Include NC
        let ncchk = document.createElement('input');
        ncchk.classList.add('ncchk');
        ncchk.checked = NC_DEF;
        ncchk.type = 'checkbox';

        let ncchkLabel = document.createElement('span');
        ncchkLabel.textContent = 'Include NC?';
        ncchkLabel.addEventListener('click', (e) => {document.querySelector('.ncchk').checked = !document.querySelector('.ncchk').checked});

        // Button
        let dpb = document.createElement('button');
        dpb.innerText = 'Select!';
        dpb.style.height = '28px';
        dpb.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('form[name="quickstock"]').reset();
            if (parseInt(num.value) > parseInt(num.max)) num.value = num.max;

            let total = num.value;
            let ntotal = total > nci ? nci : total;
            if (ncchk.checked == true) {
                let ncitm = document.querySelectorAll(`input[name^="cash_radio_arr"][value="deposit"]`);
                for (let i = nci; i > nci - ntotal; i--) {
                    let itm = document.querySelector(`input[name^="${ncitm[i-1].name}"][value="${sty.value.toLowerCase()}"]`);
                    if (itm != null && itm != undefined) {
                        if (itm.checked == false) itm.checked = true;
                    }
                }
                total = total - nci;
            }

            for (let i = npi; i > npi - total; i--) {
                let itm = document.querySelector(`input[name^="radio_arr[${i}]"][value="${sty.value.toLowerCase()}"]`);
                if (itm != null && itm != undefined) {
                    if (itm.checked == false) itm.checked = true;
                }
            }

        });

        let container = document.createElement('div');
        let ic = document.createElement('span');
        npi != 1 ? ic.innerText = `${npi} items` : ic.innerText = `${npi} item`;
        nci != 1 ? ic.innerText += ` and ${nci} NC items.` : ic.innerText += ` and ${nci} NC item.`;

        container.classList.add('qsdc');
        container.innerHTML = "<strong>Select last: </strong>"
        container.append(num, sty, dpb, document.createElement('br'), ncchk, ncchkLabel, document.createElement('br'), ic);
        document.querySelector('.content').append(container);
    });
})();