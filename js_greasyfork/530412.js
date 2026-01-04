// ==UserScript==
// @name         BTSOW磁力链接批量复制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  支持批量选中，一次复制多个磁力链接
// @author       Vincent
// @include      https://btsow.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        GM_setClipboard
// @grant        GM_log
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530412/BTSOW%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/530412/BTSOW%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.onload = function() {
    let ckBtn = document.createElement("button")
    ckBtn.innerText = "创建多选框"
    //copyBtn.setAttribute("style","transform: scale(1.2);")
    let datalist = document.querySelector("div>.tags-box")
    datalist.appendChild(ckBtn)
    ckBtn.onclick = e =>{
        let rows = document.querySelectorAll("div.row>div>a")
        for(let a of rows){
            let magnet = `magnet:?xt=urn:btih:`+a.href.substr(-40)
            let ckBox = document.createElement("input")
            ckBox.setAttribute("type","checkbox")
            ckBox.setAttribute("style","transform:scale(1.5);")//width:1%")
            //ckBox.setAttribute("class","col-lg-1")
            ckBox.setAttribute("tag",magnet)
            a.parentNode.insertBefore(ckBox,a)
            ckBox.onclick = e =>{
                if(e.target.checked==true)
                    ckBox.parentNode.style.background='#E0D2AA'
                else
                    ckBox.parentNode.style.background=''
            }
            a.nextElementSibling.style.width="7%"
            //a.nextElementSibling.nextElementSibling.style.width="10%"
        }
    }
    
    let copyBtn = document.createElement("button")
    copyBtn.innerText = "复制磁链"
    //copyBtn.setAttribute("style","transform: scale(1.2);")
    //let datalist = document.querySelector("div>.tags-box")
    datalist.appendChild(copyBtn)
    copyBtn.onclick = e =>{
        let magList=''
        let total = 0
        let cks = document.querySelectorAll('div :checked')
        if(cks.length>0){
            for(let c of cks){
                GM_log(c.getAttribute('tag'))
                magList = magList+c.getAttribute('tag')+'\n'
                total ++
            }
            GM_setClipboard(magList)
            GM_notification({
				text:total + '个磁力链接复制成功！',
				timeout:1000,
			});
        }
    }
}
})();