// ==UserScript==
// @name         Auto Surround and Closing
// @name:ja      カッコとかを自動閉じ
// @description:ja 自動でカッコとかクォーテーションを閉じる
// @namespace    https://yakisova.com
// @version      1.2.0
// @description  Automatically closes parentheses, etc.
// @author       yakisova41
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471825/Auto%20Surround%20and%20Closing.user.js
// @updateURL https://update.greasyfork.org/scripts/471825/Auto%20Surround%20and%20Closing.meta.js
// ==/UserScript==

'use strict';

const tokens = {
    '"': {
        start: '"',
        close: '"',
        surround: true,
        closing: true
    },
    "'": {
        start: '"',
        close: '"',
        surround: true,
        closing: true
    },
    "`": {
        start: '`',
        close: '`',
        surround: true,
        closing: true
    },
    "(": {
        start: '(',
        close: ')',
        surround: true,
        closing: true
    },
    "[": {
        start: '[',
        close: ']',
        surround: true,
        closing: true
    },
    "<": {
        start: '<',
        close: '>',
        surround: true,
        closing: false
    },
    "{": {
        start: '{',
        close: '}',
        surround: true,
        closing: true
    }
}


function inputListener(elem) {
    let valueState = "";

    elem.addEventListener("keydown", (e)=>{
        if(Object.keys(tokens).includes(e.key)) {
            const { selectionStart, selectionEnd } = e.target;
            const {start, close, surround, closing} = tokens[e.key]

            const before = valueState.slice(0, selectionStart);
            const after = valueState.slice(selectionEnd, valueState.length);

            if(selectionStart !== selectionEnd && surround) {
                e.preventDefault();

                const selected = valueState.slice(selectionStart, selectionEnd);
                e.target.value = `${before}${start}${selected}${close}${after}`;
                e.target.setSelectionRange(selectionStart + 1, selectionEnd + 1);

                
            }
            else if(closing) {
                e.preventDefault();

                e.target.value = `${before}${start}${close}${after}`;
                e.target.setSelectionRange(selectionEnd+ 1, selectionEnd + 1);

                const backspaceHandler = (e)=>{
                    if(e.key === "Backspace") {
                        e.preventDefault();
                        const { selectionStart, selectionEnd } = e.target;
                        const before = valueState.slice(0, selectionStart - 1);
                        const after = valueState.slice(selectionEnd + 1, valueState.length);
                        e.target.value = `${before}${after}`;
                        e.target.setSelectionRange(selectionStart - 1, selectionStart - 1);
                    }
                    elem.removeEventListener("keydown", backspaceHandler);
                }
                elem.addEventListener("keydown", backspaceHandler)
            }  (dawd)
        }
        
        valueState = e.target.value;
    });
}

setInterval(()=>{
    const inputs = document.querySelectorAll(`
        input[type="text"]:not(.attached-auto-surround-and-closing),
        input[type="search"]:not(.attached-auto-surround-and-closing),
        textarea:not(.attached-auto-surround-and-closing)
    `);
    inputs.forEach(input => {
        console.log(input)
        inputListener(input)
        input.classList.add("attached-auto-surround-and-closing")
    });

}, 100);
