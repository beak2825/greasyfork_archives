// ==UserScript==
// @name         ChatGPT Code Completer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ChatGPT limits the amount of code output. So this script adds a continue button on ChatGPT webpage to continue getting the output code stream. Make sure a previous response having a code block is present to make it work.
// @author       Geetesh.Gupta
// @match        https://chat.openai.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456426/ChatGPT%20Code%20Completer.user.js
// @updateURL https://update.greasyfork.org/scripts/456426/ChatGPT%20Code%20Completer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function insertButton(elem) {
        let formElem = document.getElementsByTagName('form')[0];
        let btnsParent = formElem.getElementsByTagName('button')[0].parentElement;
        btnsParent.insertBefore(elem, btnsParent.firstElementChild);
    }

    function createBtn() {
        let continueBtn = document.createElement('button');
        continueBtn.textContent = "Continue";
        continueBtn.setAttribute('style', 'display: flex; cursor: pointer;');
        continueBtn.className = 'btn flex gap-2 justify-center btn-neutral';
        return continueBtn;
    }

    function getPrevNodeValues() {
        let codeBlocks = document.querySelectorAll('code.hljs');
        let lastCodeBlock = codeBlocks[codeBlocks.length - 1];
        let children = lastCodeBlock.innerText.split("\n")
        let res = "";
        for (let i=children.length-1; i>=0 && res.trim().length < 20; i--) {
            res += children[i];
        }
        return res;
    }

    function updateTextArea(value) {
        document.getElementsByTagName('textarea')[0].value = value
    }

    function main() {

        const btn = createBtn();
        insertButton(btn);
        btn.onclick = () => {
            try {
                updateTextArea("what is the remaining part of the previous code? It ended at " + getPrevNodeValues());
            } catch (error) {
                console.log("Some error occured. Possible reasons:- Previous ChatGPT response does not include any code block or Website structure changed. The actual error: ", error)
            }
        }

    }

    main();

})();

