// ==UserScript==
// @name         淘宝商家发布商家编码自动填充
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a
// @author       OPTICS VALLEY SCI-TECH
// @match        https://item.upload.taobao.com/sell/v2/publish.htm?itemId=*
// @icon         https://img.alicdn.com/imgextra/i3/O1CN012YQVLk25s9FyQlmLa_!!6000000007581-2-tps-162-58.png
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/478238/%E6%B7%98%E5%AE%9D%E5%95%86%E5%AE%B6%E5%8F%91%E5%B8%83%E5%95%86%E5%AE%B6%E7%BC%96%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/478238/%E6%B7%98%E5%AE%9D%E5%95%86%E5%AE%B6%E5%8F%91%E5%B8%83%E5%95%86%E5%AE%B6%E7%BC%96%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        const spans = document.querySelectorAll('span.next-btn-helper');
        //console.log(spans);
        const span = Array.from(spans).find(span => span.innerHTML === '更多批量')
        //console.log("span",span);
        const button = span.parentNode
        //console.log("button",button);
        button.addEventListener('click',() => {
            //console.log('aaa');
            setTimeout(() => {
                document.getElementById('skuOuterId').addEventListener('click',f1);
            },1000);
        });
        },2000);
    function f1(){
        const dialog = document.querySelector('div.next-dialog-body').querySelectorAll('div.multi-operation-item');
        const colorbox = dialog[0];
        const sizebox = dialog[1];
        const color = colorbox.querySelector('span.next-tag-body');
        const size = sizebox.querySelector('span.next-tag-body');
        if(color && size){
            //console.log('aaa',color.innerText + size.innerText)

            const input = document.getElementById('skuOuterId');
            let lastValue = input.value;
            input.value = color.innerText + size.innerText;
            let event = new Event("input", { bubbles: true });
            //  React15
            event.simulated = true;
            //  React16 内部定义了descriptor拦截value，此处重置状态
            let tracker = input._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            input.dispatchEvent(event);
            // document.getElementById('skuOuterId').value = color.innerText + size.innerText
            // document.getElementById('skuOuterId').setAttribute('value',color.innerText + size.innerText);
        }
    }
})();