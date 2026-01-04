// ==UserScript==
// @name         掘金复制内容版权去除
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除掘金复制内容时，自带的版权信息
// @author       GodD
// @match        https://juejin.im/post/*
// @match        https://juejin.cn/post/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35531/%E6%8E%98%E9%87%91%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9%E7%89%88%E6%9D%83%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/35531/%E6%8E%98%E9%87%91%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9%E7%89%88%E6%9D%83%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timer = setInterval(()=>{
        let con = document.querySelector('#juejin > div.view-container > main > div.view.column-view');
        if(!con){
            return;
        }

        clearInterval(timer);
        setTimeout(()=>{
            console.info('剪切板初始化')
            con.addEventListener('copy',()=>{
                event.preventDefault();
                event.stopPropagation();
                console.info('触发复制事件')
                let textData = window.getSelection().getRangeAt(0);
                let node = document.createElement('div');
                node.appendChild(window.getSelection().getRangeAt(0).cloneContents());
                if(event.clipboardData){
                    event.clipboardData.setData("text/html", node.innerHTML);
                    event.clipboardData.setData("text/plain",textData);
                }
                else if(window.clipboardData){
                    return window.clipboardData.setData("text", textData);
                }
            })
        },500)
    },200)
    })();