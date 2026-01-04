// ==UserScript==
// @name         dlhtx一键收藏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @grant        none
// @include      *
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393022/dlhtx%E4%B8%80%E9%94%AE%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/393022/dlhtx%E4%B8%80%E9%94%AE%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let dlhtx = document.createElement("dlhtx");
    dlhtx.style=`position: fixed;top: 0%;right: 0;height: 32px;width: 32px;border-radius: 50%;cursor: pointer;background-position-y: -1px;opacity: 0.4;
    background-image: url("http://dlhtx.zicp.vip:3000/img/1573617346215*1573617324.png");transition:all .3s;z-index: 999;`;
    document.body.appendChild(dlhtx);

    dlhtx.addEventListener('mouseover',()=>{
        dlhtx.style.opacity = '1';
    })
    dlhtx.addEventListener('mouseout',()=>{
        dlhtx.style.opacity = '0.4'
    })

    dlhtx.addEventListener('click',()=>{
        console.log('clickl')
        console.log(window.location.href)
        window.open(`http://dlhtx.zicp.vip:81/#/autoSave?href=${window.location.href}`)
    })
    // Your code here...
})();