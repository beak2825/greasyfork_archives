// ==UserScript==
// @name         Google Purple Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace google dark theme to purple Theme
// @author       fienestar
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468082/Google%20Purple%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/468082/Google%20Purple%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
.sfbg{
  background: #09001e !important;
}
#tsf > div:nth-child(1) > div:nth-child(1) > div:nth-child(2){
  border: none !important;
}
}
`;

    document.head.appendChild(style);

    [...document.querySelectorAll('style')].forEach(style => {
        let html = style.innerHTML;
        console.log('!');
        html = html.replace(/#202124/g, '#09001e')
        html = html.replace(/#303134/g, '#1a1539') // #303134 -> #24202d
        html = html.replace(/#3c4043/g, '#352f44')
        // html = html.replace(/#171717/g, '#110e18')
        html = html.replace(/#171717/g, '#09001e')
        html = html.replace(/#24202d/g, '#09001e')
        html = html.replace(/#c58af9/g, '#d3b2fe')
        style.innerHTML = html;
    });

    const gb = document.getElementById('gb');
    if(gb) gb.style.backgroundColor = ''
})();