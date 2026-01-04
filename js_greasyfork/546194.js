// ==UserScript==
// @name         Type
// @namespace    http://tampermonkey.net/
// @version      2025-08-17
// @description  在限制粘贴的网页优雅快速地粘贴内容。
// @author       xhze
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546194/Type.user.js
// @updateURL https://update.greasyfork.org/scripts/546194/Type.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let input = document.createElement('textarea');
    input.style="height: 70vh; width: 70vw; background-color: #f1f1f1; border: solid 2px white; border-radius: 1rem; padding: 3rem; position: absolute; "

    let submit = document.createElement('button');
    submit.style="height: 2.5rem; width: 5rem; background-color: #1f1f1f; border: solid 2px white; border-radius: 1rem; color: white; position: absolute; left: 0px; top: 0px; "
    submit.innerHTML = '完成'

    let span = document.createElement('span');
    span.style="color:red; font-size:5rem; position: absolute; left: 0px; top: 0px; "


    submit.onclick = async function() {
        let text = input.value;
        document.body.removeChild(div);
        isPasting=false;
        typeCharacter(text)
    }


    let div = document.createElement('div');

    div.appendChild(input)
    div.appendChild(submit)

    var isPasting = false;
    var inputElement = document.activeElement

    function handleKeyEvent(e) {
        if(e.ctrlKey &&e.shiftKey && e.key == '<') {
            console.log(e)
            inputElement = document.activeElement
            console.log(inputElement)
            document.body.appendChild(div);
            console.log('ctrl+shift+v');
            input.focus();
            isPasting = true;
        }
    }

    async function typeCharacter(text) {
        for(let index = 0;index<text.length;index++){
            inputElement.value += text[index];
            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);
            await sleep(1);
        }
    }

    function sleep(ms) {
        return new Promise((e,_)=>setTimeout(e,ms))
    }
    //let _ = window.onkeydown;
    //window.onkeydown = e=> {handleKeyEvent();_(e)};
    document.onkeydown = handleKeyEvent;
    // Your code here...
})();