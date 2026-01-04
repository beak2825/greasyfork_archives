// ==UserScript==
// @name         Mercury click obtain whitelist
// @autor        Hader Araujo
// @namespace    http://tampermonkey.net/
// @description  code: Mercury click obtain whitelist
// @include      https://mercury.blocksmithlabs.io/
// @license      MIT
// @version      0.06
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/460386/Mercury%20click%20obtain%20whitelist.user.js
// @updateURL https://update.greasyfork.org/scripts/460386/Mercury%20click%20obtain%20whitelist.meta.js
// ==/UserScript==

const oneSecond = 1000
 
function executeWithSleepBegin(delay, func) {
 
    setTimeout(() => {        
        func.call()
    }, delay);
    
};
 
(function () {
    'use strict';
 
    executeWithSleepBegin(oneSecond * 10, () => {

        console.log("inicio");

        const allButtons = document.querySelectorAll("div[id='__next'] > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(6) > div > div:nth-child(10) > div > button")

        for(let i = 0; i < allButtons.length; i++) {
            let button = allButtons[i]
    
            executeWithSleepBegin(oneSecond * 2 * 5 * (i + 1), () => {
                
                console.log("click projeto " + i);
                
                button.click();

                executeWithSleepBegin(oneSecond * 2, () => {
                    const allInternalButtons = document.querySelectorAll("div[id='headlessui-portal-root'] > div > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div div > button")

                    for(let j = 0; j < allInternalButtons.length; j++) {
                        let internalButton = allInternalButtons[j]

                        executeWithSleepBegin(oneSecond * 2 * (+j + 1), () => {
                            
                            console.log("click botão " + j);
                            internalButton.click()
                        })
                    }
                })
            })


            executeWithSleepBegin(oneSecond * ( 2 * 5 * (allButtons.length + 1) + 3 ), () => {
                window.close();
            })

        }

    })
 
})();


