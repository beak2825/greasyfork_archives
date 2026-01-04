// ==UserScript==
// @name         Fix Comicat Data
// @namespace    http://www.comicat.org/
// @version      2025-08-01
// @description  Fix download url of comicat!
// @author       You
// @match        https://www.comicat.org/show-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=comicat.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544293/Fix%20Comicat%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/544293/Fix%20Comicat%20Data.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.info('----------start-----------')
    const list = document.getElementsByTagName('script')
    console.info('count:', list.length)
    for(let i=0; i < list.length; i++) {
        const item = list[i]
        if (item && item.textContent?.includes('bt_data_title')){
            window.target = item
            console.info(item)
            item.textContent = item.textContent.replace(/\n/g, '')
            eval(item.textContent)
        }
    }
    const ele = document.createElement('script')
    ele.src = list[list.length - 1].src
    document.body.appendChild(ele)
})();