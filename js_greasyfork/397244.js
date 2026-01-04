// ==UserScript==
// @name         V2EX Base64 自动解码
// @namespace    mscststs
// @version      0.18
// @description  把V2ex 的 base64 转义出来
// @license MIT
// @author       mscststs
// @match        https://v2ex.com/*//
// @match        http*://*.v2ex.com/*
// @match        https://www.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397244/V2EX%20Base64%20%E8%87%AA%E5%8A%A8%E8%A7%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/397244/V2EX%20Base64%20%E8%87%AA%E5%8A%A8%E8%A7%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const blockList = ['bilibili'];

    window.copy = window.copy || function (url) {
        const input = document.createElement('input');
        input.setAttribute('value', url);
        input.setAttribute('readonly', 'readonly');
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, 99999999999);
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('复制成功',url);
        }
        document.body.removeChild(input);
    }
    let s = document.querySelector("body");
    window.s = s
    let text = s.innerText;
    let preList = [...document.querySelectorAll("pre")].map(v=>v.innerText)
    preList.forEach(pre=>{
        text = text.replace(pre,"")
    })
    let html = s.innerHTML;
    let tag = [...text.matchAll(/[A-Za-z\d+/\=]{8,}/g)].filter(r=>{
        try{
            let originText = atob(r[0]);
            return true
        }catch(e){
            return false
        }
    })
    tag.forEach(r=>{
        if(blockList.includes(r[0].toLowerCase())){
            console.log(r, 'block')
            return
        }
        let originText = atob(r[0]).replace("\n","");

        // 检查字符串出现次数
        let ViewTextTime =[...text.matchAll(r[0])].length
        let DomTextTime = [...html.matchAll(r[0])].length
        if(ViewTextTime != DomTextTime){
            return
        }
        // 拿出原始字符，检查原始字符串
        let isText =  /^[\n _\+\-a-zA-Z@\.\/\d=!#\$:\?%\^&\*\(\)]{1,}$/.test(originText)
        if(isText){
            try{
                originText = unescape(originText)
            }catch(e){
            }
            console.log("!!!",originText)
            s.innerHTML = s.innerHTML.replace(r[0],`

<span style="position:relative;display:inline-block;color:red;font-size:1.1em;font-weight:bold;margin:0 5px;cursor:pointer" onclick="copy('${originText}')">
    ${originText}
    <span style="display:inline-block;font-size:0.6em;color:#999;">
        (base64 decoded)
    </span>

</span>`)
        }
    })
})();