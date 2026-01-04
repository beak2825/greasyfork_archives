// ==UserScript==
// @name         switch pytorch code
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  切换到pytorch代码块，而不是默认的块，仅在第一次进入界面时生效
// @description:en  switch pytorch code panel instead default when first in!
// @author       Letsgo0
// @match        https://*.d2l.ai/*/*
// @match        http://*.d2l.ai/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=d2l.ai
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/453077/switch%20pytorch%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/453077/switch%20pytorch%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let timer = setTimeout( switchPytorch,500)
    const stoper = setInterval( ()=>{stopFlag = true;}, 5000);

    function switchPytorch() {
        const selector = 'a[href|="#pytorch"].mdl-tabs__tab';
        const pyEle = document.querySelector(selector)
        if (pyEle){
            const className = pyEle.getAttribute('class') || '';
            if (!className.includes('is-active')){
                pyEle.click()
            }
        }
        else if (stopFlag == false){
            timer = setTimeout( switchPytorch,500);
        }
    }
})();