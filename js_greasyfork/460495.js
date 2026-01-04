// ==UserScript==
// @name         chatGPT-copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy chatGPT content
// @author       mclwh
// @match        https://www.tampermonkey.net/scripts.php?ext=dhdg&updated=true&version=4.18.1
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_log
// @license     ISC
// @downloadURL https://update.greasyfork.org/scripts/460495/chatGPT-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/460495/chatGPT-copy.meta.js
// ==/UserScript==

function createIcon(mode="init"){
    const list = document.querySelectorAll(".markdown")
    const len = list.length
    const newlist = mode == "init"?list:[list[len-1]]
    Array.from(newlist).forEach(i=>{
        if(!i.parentElement.className.match("lichen-copy")){
            const el = document.createElement('div')
            el.innerText = "copy"
            el.style.cssText = `padding:5px 10px;
                    color:white;
                    background:pink;
                    position:absolute;
                    font-size:12px;
                    border-radius:5px;
                    top:-40px;
                    right:0px;
                    cursor: pointer;
                    `
            el.onclick = function(){
                const input = document.createElement("input")
                input.value = i.innerText
                document.body.appendChild(input)
                input.select()
                document.execCommand("copy")
                document.body.removeChild(input)
                el.style.background = "#aaa"
                setTimeout(()=>{
                    el.style.background = "pink"
                },1000)
            }
            i.parentElement.appendChild(el)
            i.parentElement.classList.add("lichen-copy")
            i.parentElement.style.position = "relative"
        }
    })
}


(function() {
    'use strict';

    // Your code here...
    setTimeout(()=>{
        createIcon()
        document.getElementsByTagName("textarea")[0].addEventListener("keydown",function(e){
            if(!e.shiftKey && e.code == "Enter"){
                setTimeout(()=>{

                    createIcon("create")
                },500)
            }
        })
        document.getElementsByTagName("textarea")[0].parentElement.getElementsByTagName("button")[0].addEventListener("click",function(){
            setTimeout(()=>{
                createIcon("create")
            },500)
        })
    },2000)

})();