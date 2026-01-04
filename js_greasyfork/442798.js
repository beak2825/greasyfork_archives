// ==UserScript==
// @name         吃力网直接获取磁力链
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  吃力网直接获取磁力链的工具
// @author       You
// @include        https://www.sokankan*.cc/search*
// @include        https://www.sokankan*.live/search*
// @include        https://www.sokk*.buzz/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sokankan98.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442798/%E5%90%83%E5%8A%9B%E7%BD%91%E7%9B%B4%E6%8E%A5%E8%8E%B7%E5%8F%96%E7%A3%81%E5%8A%9B%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/442798/%E5%90%83%E5%8A%9B%E7%BD%91%E7%9B%B4%E6%8E%A5%E8%8E%B7%E5%8F%96%E7%A3%81%E5%8A%9B%E9%93%BE.meta.js
// ==/UserScript==

function getLink(src) {
    const host =''
    const sourceUrl = `${host}${src}`
    return new Promise(su => {
        $.get(sourceUrl, (data, status) => {
            const result = $(data).find(".media-left a")[0].href
            su(result)
        })
    })
}
// 复制的方法
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
function createEle(url,parent){
    let eleA=$("<a style='padding-top:20px;color:#409EFF;'>复制磁力地址</a>")
    eleA.click(async ()=>{
        copyText(url)
        let eleB=$("<a style='padding-top:20px;color:#E6A23C;'>已复制成功</a>")
        $(parent).parent().append(eleB)
        setTimeout(()=>{
            eleB.remove()
        },1000)
    })
    $(parent).parent().append(eleA)
}

(function () {
    'use strict';
    //清理广告
    $("div.container:nth-child(2)").remove()
    $("article.item a").each(async (a, b) => {
        if (b.innerHTML.indexOf("在线播放") < 0) {
            const url = await getLink($(b).attr("href"))
            createEle(url,b)
        }
        else {
        $(b).parent().parent().remove()
        }
        //  console.log($(b).attr("href"))
    })
    // Your code here...
})();