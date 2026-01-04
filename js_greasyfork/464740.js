// ==UserScript==
// @name         newbing输入框样式固定
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  将newbing输入框样式固定下来，不变来变去
// @author       You
// @match        https://www.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464740/newbing%E8%BE%93%E5%85%A5%E6%A1%86%E6%A0%B7%E5%BC%8F%E5%9B%BA%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/464740/newbing%E8%BE%93%E5%85%A5%E6%A1%86%E6%A0%B7%E5%BC%8F%E5%9B%BA%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let myVar = setInterval(() => {
    const container = document.querySelector('.cib-serp-main');
    if(container){
        let shadowRoot = container.shadowRoot;
        let myElement1 = shadowRoot.getElementById('cib-action-bar-main');
        if(myElement1){
            let shadowRoot2 = myElement1.shadowRoot;
            let myElement2 = shadowRoot2.querySelector('.main-container');
            myElement2.style.minHeight = '90px';
            myElement2.style.borderRadius = '12px';
            let buttonCompose = shadowRoot2.querySelector('.button-compose');
            buttonCompose.style.width= '45px'
            let buttonBar = shadowRoot2.querySelector('.bottom-bar');
            buttonBar.style.opacity=1;
            clearInterval(myVar);
        }
    }
    }, 1000);
})();