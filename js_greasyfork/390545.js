// ==UserScript==
// @name         UI debug tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  便于前端开发者调试ui 技巧来源于 https://juejin.im/post/5d74b29d6fb9a06aea61b8b9
// @author       You
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390545/UI%20debug%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/390545/UI%20debug%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var KEY_CODE = 117 // F6  修改这里绑定自己的快捷键
    var remove // 用于记录remove函数 以及判端移除还是插入

    function insertStyle(){
        var styleContent = 'body * {outline: 1px solid red}'
        var styleTag = document.createElement('style')

        styleTag.innerHTML = styleContent
        document.head.appendChild(styleTag)
        return function removeStyle(){
            styleTag.parentNode.removeChild(styleTag)
        }
    }

    window.addEventListener('keydown', function(e){
        if(e.keyCode === KEY_CODE) {
            if(remove){
                remove()
                remove = null
            }else {
                remove = insertStyle()
            }
        }
    })
})();