// ==UserScript==
// @name         通用事件监听阻止
// @namespace    http://tampermonkey.net/
// @version      2024-02-05
// @description  阻止你想要阻止的事件监听
// @author       hatrd
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489282/%E9%80%9A%E7%94%A8%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC%E9%98%BB%E6%AD%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/489282/%E9%80%9A%E7%94%A8%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC%E9%98%BB%E6%AD%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oldadd=EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener=function (...args){
        if(window.onblur!==null){
            window.onblur=null;
        }
        if(args.length!==0 && ['copy', ].includes(args[0])){
            console.log('[+] 阻止 ' + args[0] + ' 监听成功！')
            return;
        }
        return oldadd.call(this,...args)
    }
    // Your code here...
})();