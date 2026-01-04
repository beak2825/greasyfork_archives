// ==UserScript==

// @name         latex高亮
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  研思科技脚本
// @author       ErikPan
// @match        https://label.vegas.100tal.com/annotation-detail/low-code-template/Inspect/*
// @match        https://label.vegas.100tal.com/annotation-detail/inspect-conversation-rewrite/*
// @match        https://label.vegas.100tal.com/other-mark/low-code-template/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502029/latex%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/502029/latex%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
    function replace(){
        setTimeout(()=>{
            var reg_list=["//",/\([^,],[^)]\)/g,/\[[^,],[^)]\]/g,/[a-zA-Z]_{\d+}/g,"\\lt","\\gt","{i}",
                /\$\$[^$]+\$\$，\$\$[^$]+\$\$，\$\$[^$]+\$\$/g,
            /\$\$[^$]+\$\$，\$\$[^$]+\$\$/g,
            /\$\$[^$]+\$\$,\$\$[^$]+\$\$/g,
            /\$\$[^$]+\$\$,\$\$[^$]+\$\$,\$\$[^$]+\$\$/g,
            /\$\$[^$]+\$\$，\$\$[^$]+\$\$，\$\$[^$]+\$\$，\$\$[^$]+\$\$/g,
            /\$\$[^$]+\$\$,\$\$[^$]+\$\$,\$\$[^$]+\$\$,\$\$[^$]+\$\$/g,
            /\$\$[^,]+,[^,]+\$\$/g,
            /\$\$[^,]+,[^,]+,[^,]+\$\$/g,
            /\$\$[^,]+,[^,]+,[^,]+,[^,]+\$\$/g,
            ]
            let inputElements = document.getElementsByClassName("ant-input-borderless");
            // 遍历每个 phoneme 元素
            for (let i = 0; i < inputElements.length; i++) {
                var div = document.createElement("div");
                div.innerHTML=inputElements[i].innerHTML
                //console.log(div.innerHTML);
                reg_list.forEach((item)=>{
                    div.innerHTML=div.innerHTML.replaceAll(item,(match)=>{return `<span style="background: yellow;">${match}</span>`})
                })
                if(div.innerHTML!=inputElements[i].innerHTML){
                    document.getElementsByClassName("text-editor-container")[i].appendChild(div)
                }
            }
        },1000)
    }
    replace()

        const skipBtns = document.getElementsByClassName("skip-btn");
        const submitBtn = document.getElementsByClassName("submit-btn")[0];
        const prevControlBtn = document.getElementsByClassName("prev-control-btn")[0];
        const nextControlBtn = document.getElementsByClassName("next-control-btn")[0];

        for (let i = 0; i < skipBtns.length; i++) {
            //console.log("add");
                skipBtns[i].addEventListener("click", replace, false);

        }

        if (submitBtn) {
            submitBtn.addEventListener("click", replace, false);
        }

        if (prevControlBtn) {
            prevControlBtn.addEventListener("click", replace, false);
        }

        if (nextControlBtn) {
            nextControlBtn.addEventListener("click", replace, false);
        }

    },3000)


})();
