// ==UserScript==
// @name         NoTranslateForIEEE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  zh-cn
// @description  NoTranslateForIEEE
// @author       XiXi
// @match        https://ieeexplore.ieee.org/document/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ieee.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481199/NoTranslateForIEEE.user.js
// @updateURL https://update.greasyfork.org/scripts/481199/NoTranslateForIEEE.meta.js
// ==/UserScript==

let initHtml = () => {
    var htmlCode = `
<style>
    .wb-tool {
        width: 300px;
        bottom: 20px;
        right: 20px;
        padding: 10px 10px 8px 10px;
        background-color: #eee;
        z-index: 9999;
        position: fixed;
        overflow: hidden;
        border-radius: 10px;
        transition: all 0.5s;
        box-shadow: 0 0 5px 2px rgba(0, 0, 0, .2);
    }
</style>
<div class="wb-tool">
<button id="add">增加类</button>
</div>
`;
    let insertElement = document.createElement("div");
    insertElement.innerHTML = htmlCode;
    document.body.append(insertElement);
    document.getElementById("add").addEventListener('click', () => {
        alert('ok')

        const nList = ['inline-formula', 'MathJax_Display'];
        for(const n of nList) {
            let eles = document.getElementsByClassName(n);
            for (let i = 0; i < eles.length; i++) {
                eles[i].classList.add("notranslate");
            }
        }

    }, false)
}


(function() {
    'use strict';
    window.onload=function(){
        initHtml();
    }

    // Your code here...
})();