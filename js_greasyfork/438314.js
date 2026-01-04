// ==UserScript==
// @name         GEE Font Size
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://code.earthengine.google.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/438314/GEE%20Font%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/438314/GEE%20Font%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let buttonBox = document.querySelector('.editor-panel .header div')
    let createButton = (title, innerHTML, func) => {
        let button = document.createElement('button')
        button.classList.add('goog-button')
        button.setAttribute('title', title)
        button.innerHTML = innerHTML
        button.onclick = func
        button.style.marginRight = '6px'
        buttonBox.insertBefore(button, buttonBox.firstChild)
    }

    let addFontSizeStyle = (size) => {
        GM_addStyle(`
        .ace_editor {
            font-size: ${size}px !important; 
        }
    `)
    }
    const minSize = 13
    const maxSize = 60
    addFontSizeStyle(GM_getValue('GEE Font Size', minSize))
    let changeFontSize = (operate) => {
        return () => {
            let box = document.querySelector('.ace_editor')
            let size = Number(getComputedStyle(box).fontSize.replace('px', ''))
            size = eval(operate)
            if (size >= minSize && size <= maxSize) {
                GM_setValue('GEE Font Size', size)
                addFontSizeStyle(size)
            }
        }
    }
    createButton('Decrease Font Size', '-', changeFontSize('size - 1'))
    createButton('Increase Font Size', '+', changeFontSize('size + 1'))
})();