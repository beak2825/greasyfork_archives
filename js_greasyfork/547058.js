// ==UserScript==
// @name         Neopets - Karla's Auto Wishing Well
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.1
// @description  Automatically makes wishes at wishing well
// @author       Karla
// @match        *://*.neopets.com/wishing.phtml*
// @homepage     https://neopointskarla.com
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @downloadURL https://update.greasyfork.org/scripts/547058/Neopets%20-%20Karla%27s%20Auto%20Wishing%20Well.user.js
// @updateURL https://update.greasyfork.org/scripts/547058/Neopets%20-%20Karla%27s%20Auto%20Wishing%20Well.meta.js
// ==/UserScript==

let item = GM_getValue('item') || '';
let np = GM_getValue('np') || '21';
let auto = GM_getValue('auto_ww') || false;

const sleep = (time) =>
new Promise((resolve) => setTimeout(resolve, time));

const random_in_range = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
};

async function makeWish() {
    const match = document.body.innerHTML.match(/Wish Count:\s*(\d+)/);
    if (match) {
        const wishCount = parseInt(match[1], 10);
        console.log(`Making wish ${wishCount + 1}`);
    } else if (document.body.innerHTML.includes('Thanks for your donation')) {
        console.log('Wish done');
        return;
    } else {
        console.log(`Making wish 1`);
    }
    await sleep(random_in_range(500, 900));
    document.querySelector('[name="donation"]').value = np;
    await sleep(random_in_range(500, 900));
    document.querySelector('[name="wish"]').value = item;
    await sleep(random_in_range(500, 900));
    document.querySelector('[value="Make a Wish"]').click();
}

(function() {
    'use strict';

    // Your code here...
    try {
        const div = document.createElement('div');
        div.style.marginTop = '20px';
        div.innerHTML = `
        <div>-- Wishing Well Auto Wisher --</div>
        <br/>
      <label>Item: <input id="k-item" ${auto ? 'disabled' : ''} /></label>
      <label>Np: <input id="k-np" type="number" min="21" ${auto ? 'disabled' : ''} /></label>
      <button>${auto ? 'Stop' : 'Start'}</button>
    `;
        const itemInput = div.querySelector('#k-item');
        itemInput.value = item;
        itemInput.addEventListener('change', function(event) {
            item = event.target.value;
            GM_setValue('item', item);
        });
        const npInput = div.querySelector('#k-np');
        npInput.value = np;
        npInput.addEventListener('change', function(event) {
            np = event.target.value;
            GM_setValue('np', np);
        });
        const startButton = div.querySelector('button');
        startButton.addEventListener('click', function() {
            auto = !auto;
            GM_setValue('auto_ww', auto);
            if (auto) {
                startButton.innerHTML = 'Stop';
                itemInput.disabled = true;
                npInput.disabled = true;
                makeWish();
            } else {
                startButton.innerHTML = 'Start';
                itemInput.removeAttribute('disabled');
                npInput.removeAttribute('disabled');
            }
        });

        const anchor = document.querySelector('[src="//images.neopets.com/images/wishingwell.gif"]').parentNode;
        anchor.append(div);

        if (auto) {
            makeWish();
        }
    } catch (e) {
        console.log(e);
    }
})();