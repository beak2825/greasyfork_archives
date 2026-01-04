// ==UserScript==
// @name         iframe 键盘事件穿透
// @namespace    ttjz_iframe_keyboard_event_penetration
// @version      0.1
// @description  使键盘事件能够在页面和iframe之间穿透
// @author       tongtianjiaozhu
// @license       MIT
// @match        *://*/*
// @run-at document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/528819/iframe%20%E9%94%AE%E7%9B%98%E4%BA%8B%E4%BB%B6%E7%A9%BF%E9%80%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/528819/iframe%20%E9%94%AE%E7%9B%98%E4%BA%8B%E4%BB%B6%E7%A9%BF%E9%80%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function spreadToTop(params) {
        console.log('top')
        if(window !== window.top) {
            let data = {
                dir:'toTop',
                params: params
            }
            window.parent.postMessage(data,'*')
        }
    }

    function spreadToBottom(params) {
        console.log('bottom')
        let data = {
            dir:'toBottom',
            params:params
        }
        let myFrames = document.getElementsByTagName('iframe')
        for(let i =0;i<myFrames.length;i++) {
            myFrames[i].contentWindow.postMessage(data,"*")
        }
    }

    function getKeyHandler(type) {
        return function(e) {
            let keyBoardEvent = {
                key: e.key,
                code: e.code,
                keyCode: e.keyCode,
                location: e.location,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                metaKey: e.metaKey,
                repeat: e.repeat
            }
            let params = {
                url: window.location.href,
                type: type,
                event: keyBoardEvent
            }
            spreadToTop(params)
            spreadToBottom(params)
        }
    }
    let keydownHandler = getKeyHandler('keydown')
    let keyupHandler = getKeyHandler('keyup')
    document.addEventListener('keydown', keydownHandler, true)
    document.addEventListener('keyup', keyupHandler, true)

    let messageHandler = (event)=>{
        if(event.data.params) {
            let dir = event.data.dir
            let params = event.data.params
            console.log(params)
            document.removeEventListener(params.type, params.type==='keydown'?keydownHandler:keyupHandler, true)
            let e = new KeyboardEvent(params.type, params.event)
            console.log(window.location.href,'dispatch')
            document.dispatchEvent(e)
            document.addEventListener(params.type, params.type==='keydown'?keydownHandler:keyupHandler, true)
            if(dir==="toTop") spreadToTop(params)
            else spreadToBottom(params)
        }
    }
    window.addEventListener("message",messageHandler, false);
})();