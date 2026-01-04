// ==UserScript==
// @name         monaco注入 emmet
// @namespace    mscststs
// @version      0.3
// @description  为不支持 emmet 但是又使用 monaco 编辑器的网页注入 emmet
// @author       mscststs
// @match             *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397830/monaco%E6%B3%A8%E5%85%A5%20emmet.user.js
// @updateURL https://update.greasyfork.org/scripts/397830/monaco%E6%B3%A8%E5%85%A5%20emmet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let tag = false

    function load(){
        if(!tag){
            tag = true
            let srp = document.createElement("script")
            srp.src = "https://unpkg.com/emmet-monaco-es/dist/emmet-monaco.min.js"
            srp.onload = ()=>{
                emmetMonaco.emmetHTML(monaco);
            }
            document.querySelector("body").appendChild(srp)
        }
    }

    [0,2,4,6,8,10].forEach(d=>{
        setTimeout(()=>{
            if(window.monaco){
                load()
            }
        },d*1000)
    })
})();