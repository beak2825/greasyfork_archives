// ==UserScript==
// @name         imitator
// @namespace    http://tampermonkey.net/
// @version      2024-10-24
// @description  def-imitator
// @author       DEF
// @match        https://*.lofter.com/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/513818/imitator.user.js
// @updateURL https://update.greasyfork.org/scripts/513818/imitator.meta.js
// ==/UserScript==

(function() {
    'use strict';
        async function handleDivClick() {
           let content = document.getElementsByClassName("content")[0].innerHTML;
           await navigator.clipboard.writeText(content);
        }

        function insertDiv() {
            const newDiv = document.createElement('div');
            newDiv.textContent = 'copy';
            newDiv.style.position= 'fixed';
            newDiv.style.top='25px';
            newDiv.style.right='0';
            newDiv.style.backgroundColor = 'lightblue';
            newDiv.style.padding = '10px 20px';
            newDiv.style.margin = '10px';
            newDiv.style.cursor='pointer';
            newDiv.style.userSelect='none';
            newDiv.style.border = '1px solid black';
            newDiv.addEventListener('click', handleDivClick);
            document.body.appendChild(newDiv);
        }
        insertDiv();
})();