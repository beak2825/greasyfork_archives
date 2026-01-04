// ==UserScript==
// @name         豆瓣第三方资源
// @namespace    http://tampermonkey.net/
// @version      2024-04-25
// @description  豆瓣电影电视剧关联第三方网盘和播放资源链接
// @author       You
// @match        https://movie.douban.com/subject/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493626/%E8%B1%86%E7%93%A3%E7%AC%AC%E4%B8%89%E6%96%B9%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/493626/%E8%B1%86%E7%93%A3%E7%AC%AC%E4%B8%89%E6%96%B9%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const title = document.title.replace('(豆瓣)','').trim()
    const doulist = document.querySelector('#subject-doulist')
    const sourceBox = document.createElement('div')
    doulist.insertAdjacentElement('beforebegin',sourceBox)

    const buttons = [
        {name:'猫狸盘搜',url:'https://www.alipansou.com/search?k='},
        {name:'4K影视',url:'https://www.4kvm.org/xssearch?s='},
        {name:'APP影院',url:'https://www.appmovie.vip/index.php/vod/search.html?wd='},
        {name:'毕方铺',url:'https://www.iizhi.cn/resource/search/'},
    ]
    let html = `<h2><i class="">外部资源</i></h2>`
    buttons.forEach(item=>{
        const style = "background:#F0F3F5;border:none;padding:4px 10px;margin:4px;color:#007722;"
        html+=`<button style="${style}" data-url="${item.url}">
                ${item.name}
           <button>`
})
    sourceBox.innerHTML = html;
    sourceBox.style.marginBottom = '20px';
    sourceBox.addEventListener('click',event=>{
        const target = event.target
        if(target.tagName==='BUTTON'){
            const url = target.getAttribute('data-url')
            window.open(url+title)
        }
    })
})();