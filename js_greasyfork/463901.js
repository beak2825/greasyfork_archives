// ==UserScript==
// @name         聊聊回扫vela
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  聊聊回扫页面优化
// @author       You
// @match        https://vela.wemomo.com/pyxis/frontend/auth/mark/1806*
// @match        https://vela.wemomo.com/pyxis/frontend/auth/mark/1805*
// @match        https://vela.wemomo.com/pyxis/frontend/auth/mark/1810*
// @icon        https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTww75rk1raZUrvmOiHBiMg1LQ0CCpohJ6sv6Ag7xs8UUG_fnm8doDcmnHwiqgiw4ubJI&usqp=CAU
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463901/%E8%81%8A%E8%81%8A%E5%9B%9E%E6%89%ABvela.user.js
// @updateURL https://update.greasyfork.org/scripts/463901/%E8%81%8A%E8%81%8A%E5%9B%9E%E6%89%ABvela.meta.js
// ==/UserScript==

(function() {
    'use strict';
function huisao(){
if (document.querySelectorAll('.list_tRehc')[0].children[1].style.display != 'none') {

    document.querySelectorAll('.list_tRehc').forEach(function dd(item) {
        item.children[0].style.display = 'none'
        //复制
        item.children[1].style.display = 'none'

        item.children[2].children[0].children[0].style.display = 'none'
        item.children[2].children[0].children[1].style.display = 'none'
        item.children[2].children[0].children[4].style.display = 'none'
        item.children[2].children[1].children[0].children[0].style.display = 'none'
    })

}

}

window.onload=setInterval(huisao,500)
    // Your code here...
})();