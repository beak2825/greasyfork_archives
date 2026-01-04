// ==UserScript==
// @name         Heybox2Steam
// @namespace    http://tampermonkey.net/
// @version      2025-05-20
// @description  Heybox to Steam
// @author       Faker
// @match        https://www.xiaoheihe.cn/app/topic/game/pc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoheihe.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536581/Heybox2Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/536581/Heybox2Steam.meta.js
// ==/UserScript==

(function(){
    function waitForSelector(selector,callback) {
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {

                            if (node.matches(selector)) {
                                observer.disconnect()
                                callback(found)
                            }

                            const found = node.querySelector(selector);
                            if (found) {
                                observer.disconnect()
                                callback(found)
                            }
                        }
                    });
                }

            })

        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

    }

    waitForSelector('.price-row',(element) => {
        const smbt = document.createElement("div")
        smbt.innerText = "Steam"
        smbt.className = "btn-trend"
        smbt.style.marginLeft = "10px"

        smbt.addEventListener('click', () => {
            const id = location.pathname.split('/').filter(Boolean).pop();
            window.open(`https://store.steampowered.com/app/${id}/`)
        })

        element.append(smbt)

    })

}())