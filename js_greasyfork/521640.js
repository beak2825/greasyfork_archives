// ==UserScript==
// @name         swarmsim cheatsheet left menu
// @namespace    http://tampermonkey.net/
// @version      2024-12-24
// @description  swarmsim cheatsheet left menu! god!
// @author       imzhi <yxz_blue@126.com>
// @match        https://static.oschina.net/trytry/swarmsim/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oschina.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521640/swarmsim%20cheatsheet%20left%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/521640/swarmsim%20cheatsheet%20left%20menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'p') {
            event.preventDefault();
            // 如果需要的话，可以在这里实现你的逻辑
            document.querySelectorAll(`.tab-pane.active .table  > tbody > tr`)[curr_act()+1].click()
        }
    });

    function curr_act() {
        const tr_multi = document.querySelectorAll(`.tab-pane.active .table  > tbody > tr`)
        const index_act = 0
        for (const [tr_key, tr_item] of Object.entries(tr_multi)) {
            console.log('tr_multi', tr_key, tr_item, tr_item.className)
            if (tr_multi.className && tr_multi.className.includes('active')) {
                index_act = tr_key
                break
            }
        }
        return index_act
    }
})();