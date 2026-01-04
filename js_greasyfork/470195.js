// ==UserScript==
// @name         吴签磁力下载
// @namespace    http://tampermonkey.net/
// @description  吴签磁力获取磁力链的工具
// @license jam
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include        https://wuqian*.top/search?keyword=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wuqianqe.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470195/%E5%90%B4%E7%AD%BE%E7%A3%81%E5%8A%9B%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/470195/%E5%90%B4%E7%AD%BE%E7%A3%81%E5%8A%9B%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
// 复制的方法

function getLink(src) {
    const host =''
    const sourceUrl =src
    return new Promise(su => {
        $.get(sourceUrl, (data, status) => {
            const result = $(data).find("#magnet")[0].href
            su(result)
        })
    })
}

function copyText(text, callback){ // text: 要复制的内容， callback: 回调
    var tag = document.createElement('input');
    tag.setAttribute('id', 'cp_hgz_input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('cp_hgz_input').select();
    document.execCommand('copy');
    document.getElementById('cp_hgz_input').remove();
    if(callback) {callback(text)}
}
(function() {
    'use strict';
    $("div .panel").each((idx,item)=>{
        //获取跳转链接
        const link= `${window.location.origin}${$($(item).find("a")[0]).attr("href")}`

        const tag = document.createElement('div');
        tag.setAttribute('id', 'btnCopy');
        tag.innerText="复制磁力链"
        tag.style="padding: 10px 15px;cursor: pointer;color: blue;"
        tag.onclick=()=>{
            tag.innerText="正在复制"
            tag.style="padding: 10px 15px;cursor: pointer;color: red;"
            getLink(link).then(r=>{
                copyText(r)
                tag.innerText="复制成功"
                tag.style="padding: 10px 15px;cursor: pointer;color: red;font-weight: bold;"
                setTimeout(()=>{
                    tag.innerText="复制磁力链"
                    tag.style="padding: 10px 15px;cursor: pointer;color: blue;"
                },2000)
            })
        }
        item.appendChild(tag)
    })
    // Your code here...
})();