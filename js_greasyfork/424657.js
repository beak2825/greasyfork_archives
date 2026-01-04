// ==UserScript==
// @name         Video Speedy 视频倍速
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description:zh  加速视频支持1-4倍速
// @description:en  Add video speed x1 - x4
// @author       ZenDojo
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @description Add video speed 加速视频支持1-4倍速
// @downloadURL https://update.greasyfork.org/scripts/424657/Video%20Speedy%20%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/424657/Video%20Speedy%20%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
        let funcDone = false
    function addSpeeds() {
        if (funcDone) return;
        let speedDiv = document.createElement('div')
        for (let i = 1; i <= 4; i += 1) {
            let btn = document.createElement('button');
            btn.style.backgroundColor = '#008CBA';
            btn.style.marginRight = '4px';
            btn.style.border = '1px solid #D3D3D3';
            btn.style.borderRadius = '2px';
            btn.style.width = '60px';
            btn.style.height = '40px';
            btn.style.borderRadius = '2px';
            btn.style.color = '#ffffff';
            btn.style.fontSize = '14px';
            btn.style.borderRadius = '3px';
            btn.style.cursor = 'pointer';
            btn.innerHTML = '×' + i;
            btn.addEventListener('click', function (){document.querySelector('video').playbackRate = i})
            speedDiv.appendChild(btn)
        }
        speedDiv.style.position = 'fixed'
        speedDiv.style.bottom = '50px'
        speedDiv.style.right = '50px'
        speedDiv.style.zIndex = '9999'
        document.querySelector('body').appendChild(speedDiv);
        funcDone = true
    }
    //if(document.querySelector('video')) {
        addSpeeds();
    //}

})();