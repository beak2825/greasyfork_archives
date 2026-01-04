// ==UserScript==
// @name         Overleaf spell check
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Support other languages by pasting content to a textarea and letting chrome do the work.
// @author       myklosbotond
// @match        https://www.overleaf.com/project/*
// @icon         https://www.google.com/s2/favicons?domain=overleaf.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/426208/Overleaf%20spell%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/426208/Overleaf%20spell%20check.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
    'use strict';

    setupCss();
    setupTextAria();
    setupSpellCheckButton();
})();

function setupCss() {
  GM_addStyle(`
    #script-sp-ch-btn {
        display: inline-block;
        width: 20px;
        margin-right: 10px;
    }

    #script-sp-ch-btn i {
        width: 20px;
        background-size: 20px;
        color: wheat;
    }

    #script-float-area {
        position: absolute;
        background: white;
        width: 45%;
        height: 90%;
        top: 5%;
        right: 10px;
        border: 1px solid black;
        cursor: not-allowed;
    }

    #script-float-area div {
        margin-top: 1.25%;
        margin-bottom: 1.1%;
        text-align: center;
    }

    #script-float-area textarea {
        resize: none;
        margin: 2.5%;
        margin-top: 0px;
        width: 95%;
        height: 93%;
    }

    #script-float-area.no-show {
        display: none;
    }
    `);
}

function setupTextAria() {
    const html = `
    <div id="script-float-area" class="no-show">
        <div>Click frame to close</div>
        <textarea></textarea>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeEnd", html);

    window.tmScript = {};
    window.tmScript.floatArea = document.querySelector("#script-float-area");
    window.tmScript.textArea = window.tmScript.floatArea.querySelector("textarea");

    window.tmScript.floatArea.onclick = function() {
        window.tmScript.floatArea.classList.add("no-show");
    }

    window.tmScript.textArea.onclick = function(e) {
        e.stopPropagation();
    }
}

function setupSpellCheckButton() {
    const toolbar = document.querySelector(".toolbar-editor .toolbar-right");

    const spellCheckButton = `
    <div id="script-sp-ch-btn" title="Spell check clipboard">
        <i class="fa fa-fw fa-file-text-o" ></i>
    </div>
    `;

    toolbar.insertAdjacentHTML("afterBegin", spellCheckButton);

    const button = document.querySelector("#script-sp-ch-btn");
    button.onclick = handleSpellCheckClick;
}

async function handleSpellCheckClick() {
    const clipboardText = await navigator.clipboard.readText();

    const strippedText = clipboardText
        .replace(/^%.*$/gm, '')
        .replace(/\\(label|ref|cite|aref|Aref|begin|end|input)\{[^\}]*\}/g, '')
        .replace(/\\[a-zA-Z0-9]*/g, '')
        .replace(/(\s*\n){3,}/g, '\n\n')
        .replace(/(\s*\n)+$/g, '');

    window.tmScript.textArea.value = strippedText;
    window.tmScript.floatArea.classList.remove("no-show");
}