// ==UserScript==
// @name         Amber CMS Input
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Amber Inner Script
// @author       Jack Ding
// @match        https://cms.ambergroup.io/
// @icon         https://www.google.com/s2/favicons?domain=ambergroup.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428260/Amber%20CMS%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/428260/Amber%20CMS%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const xxx = document.createElement("button")
    xxx.innerText = "Unlimit Input"
    xxx.style.position ="fixed"
    xxx.style.top = "60px"
    xxx.style.right = "60px"
    xxx.style.zIndex = 9999

    document.body.append(xxx)

    xxx.addEventListener("click",()=>{
        const inputList = document.getElementsByTagName("input")
        for(let i =0;i<inputList.length;i++){
            inputList[i].style.border = "1px solid red"
            console.log(inputList[i].maxLength)
            inputList[i].maxLength = 999
        }

        const textareaList = document.getElementsByTagName("textarea")
        for(let i =0;i<textareaList.length;i++){
            textareaList[i].style.border = "1px solid red"
            console.log(textareaList[i].maxLength)
            textareaList[i].maxLength = 999
        }
    })
})();