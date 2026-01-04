// ==UserScript==
// @name         放大头像
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  个人资料头像换大图审核
// @author       You
// @match        https://live-media-monitor.wemomo.com/
// @icon         https://img.ixintu.com/download/jpg/20201104/460120927f80f3b5070e3d5dbcfa2692_512_512.jpg!con
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486549/%E6%94%BE%E5%A4%A7%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/486549/%E6%94%BE%E5%A4%A7%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
function fdtx() {
        document.querySelectorAll('.head-portrait').forEach(function divda(item) {
            item.style.width = '440px'
            item.style.height='100px'
            item.style.padding = '0px'
            item.style.border = '0px'
item.style.display= ''
        })

        document.querySelectorAll('.head-portrait img').forEach(function datu(item) {
            item.src = item.src.replace('_S.jpg', '_L.jpg');
            item.style.width = '100px';
            item.style.height = '100px'
        })
    }
//}
setInterval(fdtx, 3000)


    // Your code here...
})();