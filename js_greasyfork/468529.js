// ==UserScript==
// @name         LINE活動集章
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  LINE活動集章0613
// @author       forthdog
// @match        https://event.line.me/collectcard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=line.me
// @grant        none
// @license      mine
// @downloadURL https://update.greasyfork.org/scripts/468529/LINE%E6%B4%BB%E5%8B%95%E9%9B%86%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/468529/LINE%E6%B4%BB%E5%8B%95%E9%9B%86%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

function makeBack() {
    let button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '47.5%';
    button.style.width = '5%';
    button.style.height = '5%';
    button.style.zIndex = '9999';
    button.textContent = '集章';

    GM_addStyle(`
        button {
            background-color: #00008b;
            color: #ffffff;
            #padding: 10px 20px;
            font-size: 5%;
        }
    `);

    document.body.appendChild(button);

    button.addEventListener('click', function() {
        window.location = window.location.href.replace('/redemption', '');
    });
}

    function funcA() {
        const a = document.querySelector('button.redeem-button.btn.btn-init.btn-line-green.has-tooltip');
        if (a) {
            a.click();
        }
    }

    function funcB() {
        const b = document.querySelectorAll('div.u-redeem > button');
        if (b) {
            for (let i of b) {
                if (i.innerText == '立即兌換') {
                    i.click();
                }
            }
        }
        makeBack();
    }

    setTimeout(funcA, 500);
    setTimeout(funcB, 1000);
    setTimeout(function() { location.reload(); }, 30000);

})();