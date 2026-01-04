// ==UserScript==
// @name         网易云音乐 播放暂停
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加空格快捷键，完成播放/暂停
// @author       You
// @match        https://music.163.com/
// @icon         https://www.google.com/s2/favicons?domain=163.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427520/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%20%E6%92%AD%E6%94%BE%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/427520/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%20%E6%92%AD%E6%94%BE%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const play = document.getElementsByClassName('ply')[0]

    // Your code here...
    window.addEventListener('load',() => {

        window.addEventListener('keyup', (event) => {
            // 如果play元素不存在或者当前激活的窗口是输入框的话，不进行任何操作
            if (!play || document.activeElement.nodeName.toLowerCase() === 'input'){
                return
            }

            // 监听空格键
            if (event.code == 'Space') {
                play.click()
            }
        })
    })

})();