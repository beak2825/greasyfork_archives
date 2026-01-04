// ==UserScript==
// @name         kimi paste file/image
// @namespace    http://tampermonkey.net/
// @version      2024-05-01.1
// @description  kimichat paste file/image directly | 网页中直接粘贴文件
// @author       You
// @match        https://kimi.moonshot.cn/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moonshot.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493918/kimi%20paste%20fileimage.user.js
// @updateURL https://update.greasyfork.org/scripts/493918/kimi%20paste%20fileimage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    'esversion: 8';

    async function onPaste(e){
        if(e.clipboardData.files.length > 0){
            e.preventDefault();
            const inp = document.querySelector('input[type=file]');
            const key = Object.keys(inp).find(key=>{
                return key.startsWith("__reactFiber$");
            });
            const domFiber = inp[key];
            inp.files=e.clipboardData.files;
            domFiber.memoizedProps.onChange({target:inp});
        }
    }

    setTimeout(()=>{
        const editorElem = document.querySelector('div[contenteditable=true]');
        if(!editorElem) return;
        editorElem.addEventListener('paste', onPaste);
    }, 2000);
})();