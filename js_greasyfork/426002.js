// ==UserScript==
// @name         Copy Button for Quizlet
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a copy button to Quizlet vocab lists
// @author       kingquokka
// @match        https://quizlet.com/gb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426002/Copy%20Button%20for%20Quizlet.user.js
// @updateURL https://update.greasyfork.org/scripts/426002/Copy%20Button%20for%20Quizlet.meta.js
// ==/UserScript==


let styleSheet = `
.copyBtn {
    background-color: blue;
    color: white;
    padding: 5px;
    font-size: 10px;
}
`;

let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);

window.addEventListener('load', function() {
    'use strict';

    function copy(ele) {
        let temp = document.createElement('textarea');
        document.body.appendChild(temp);
        temp.value = ele.textContent;
        temp.select();
        document.execCommand('copy');
        temp.remove();
    }

    function addCopyBtn(ele) {
        let btn = document.createElement("button");
        btn.innerHTML = "Copy";
        btn.className = "copyBtn";
        btn.onclick = () => {
            copy(ele.lastChild);
        }

        ele.insertBefore(document.createElement('br'), ele.childNodes[0]);
        ele.insertBefore(btn, ele.childNodes[0]);
    }

    let spanTags = document.getElementsByClassName("SetPageTerm-sideContent");

    console.log(spanTags);

    for (let spanTag of spanTags) {
        addCopyBtn(spanTag);
    }
});
