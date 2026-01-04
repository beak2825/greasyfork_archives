// ==UserScript==
// @name         jump in input box when '+' is pressed.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按下+键，将页面焦点跳到输入框
// @description:en  jump in input box when '+' is pressed.
// @author       Mr.Chen
// @match        http://dict.youdao.com/*
// @match        https://dict.youdao.com/*
// @match        https://dictionary.cambridge.org/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/441379/jump%20in%20input%20box%20when%20%27%2B%27%20is%20pressed.user.js
// @updateURL https://update.greasyfork.org/scripts/441379/jump%20in%20input%20box%20when%20%27%2B%27%20is%20pressed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const inputIds = [
        "search_input",
        "searchword",
        "query",
    ];
    document.onkeyup = ( e ) => {
        // '+'
        if (e.keyCode === 107){
            let inputEle;
            for (let i = 0; i < inputIds.length; i++){
                inputEle = document.querySelector("input#" + inputIds[i]);
                if (inputEle){
                    break;
                }
            }
            if (!inputEle){
                alert("Bad, not working.");
                return ;
            }
            //ele?.focus();
            inputEle?.select();
        }
    }
})();