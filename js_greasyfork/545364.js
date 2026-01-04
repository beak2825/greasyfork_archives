// ==UserScript==
// @name         Neopets - Karla's Tea Time With Tavi Search Helper
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.5
// @description  Adds easy search ssw and sw buttons to Tea Time With Tavi quest
// @author       Karla
// @match        *://*.neopets.com/games/teatime*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545364/Neopets%20-%20Karla%27s%20Tea%20Time%20With%20Tavi%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/545364/Neopets%20-%20Karla%27s%20Tea%20Time%20With%20Tavi%20Search%20Helper.meta.js
// ==/UserScript==

function insertButtons (target, stamp) {
    try {
        const div = document.createElement('div');
        const hasSSW = toggleSSW__2020;
        if (hasSSW) {
            const sswButton = document.createElement('div');
            sswButton.style.width = '20px';
            sswButton.style.height = '20px';
            sswButton.style.cursor = 'pointer';
            sswButton.style.display = 'inline-block';
            sswButton.innerHTML = '<img src="https://images.neopets.com/shopkeepers/super_shopwizard.gif" style="width: 100%; height: 100%;" />';
            sswButton.addEventListener('click', function() {
                console.log(document.querySelector('#ssw__2020').style.display)
                if (document.querySelector('#ssw__2020').style.display === '' || document.querySelector('#ssw__2020').style.display === 'none') {
                    toggleSSW__2020();
                }
                document.querySelector('#searchstr').value = stamp;
                document.querySelector('#ssw-criteria').selectedIndex = 0;
                document.querySelector('#price-limited').checked = false;
                document.querySelector('#ssw-button-search').click();
            });
            div.appendChild(sswButton);
        }
        const swButton = document.createElement('a');
        swButton.style.width = '20px';
        swButton.style.height = '20px';
        swButton.style.display = 'inline-block';
        swButton.innerHTML = '<img src="https://images.neopets.com/shopkeepers/shopwizard.gif" style="width: 100%; height: 100%;" />';
        swButton.href = `https://www.neopets.com/shops/wizard.phtml?string=${stamp}`;
        swButton.target = '_blank';
        div.appendChild(swButton);
        target.appendChild(div);
    } catch (e) {
        console.log(e);
    }
}

(function() {
    'use strict';

    // Your code here...
    [...document.querySelectorAll('.ttwt-item')].forEach(n => {
        insertButtons(n, n.querySelector('span').textContent);
    })
})();