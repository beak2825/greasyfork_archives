// ==UserScript==
// @name         删除接龙
// @namespace    http://tampermonkey.net/
// @version      1.1.5.5.1.5
// @description  删除洛谷的传送/接龙
// @author       nr
// @match        *://*.luogu.com.cn/*
// @match        *://*.luogu.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507615/%E5%88%A0%E9%99%A4%E6%8E%A5%E9%BE%99.user.js
// @updateURL https://update.greasyfork.org/scripts/507615/%E5%88%A0%E9%99%A4%E6%8E%A5%E9%BE%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function remove_shabi()
    {
        const shabi_1=document.querySelectorAll('img');
        shabi_1.forEach(img=>
        {
            if(img.src==="https://cdn.luogu.com.cn/upload/image_hosting/7ui7m4sx.png"||img.src==="https://cdn.acwing.com/media/article/image/2024/09/19/126278_64ae8f1776-%E6%8E%A5%E9%BE%99.png")
            {
                const p=document.createElement('p');
                p.innerHTML='<a href="'+img.src+'">该图片有疑似接龙风险。点击以查看，如出现接龙后果自行承担</a>';
                img.replaceWith(p);
            }
        });
        const shabi_2=document.querySelectorAll('*');
        shabi_2.forEach(div=>
        {
            if(div.innerHTML.includes('接龙哈！')||div.innerHTML.includes('传送0人')||div.innerHTML.includes('传送 0 人')||div.innerHTML.includes('传送0 人')||div.innerHTML.includes('传送 0人')
              ||div.innerHTML.includes('传送1人')||div.innerHTML.includes('传送 1 人')||div.innerHTML.includes('传送1 人')||div.innerHTML.includes('传送 1人')
              ||div.innerHTML.includes('传送2人')||div.innerHTML.includes('传送 2 人')||div.innerHTML.includes('传送2 人')||div.innerHTML.includes('传送 2人')
              ||div.innerHTML.includes('传送5人')||div.innerHTML.includes('传送 5 人')||div.innerHTML.includes('传送5 人')||div.innerHTML.includes('传送 5人'))
            {
                remove_shabiest(div);
            }
        });
    }
    function remove_shabiest(elem)
    {
        const dir=elem.querySelectorAll('*');
        let cnt=0;
        dir.forEach(div=>
        {
            if(div.innerHTML.includes('接龙哈！')||div.innerHTML.includes('传送0人')||div.innerHTML.includes('传送 0 人')||div.innerHTML.includes('传送0 人')||div.innerHTML.includes('传送 0人')
              ||div.innerHTML.includes('传送1人')||div.innerHTML.includes('传送 1 人')||div.innerHTML.includes('传送1 人')||div.innerHTML.includes('传送 1人')
              ||div.innerHTML.includes('传送2人')||div.innerHTML.includes('传送 2 人')||div.innerHTML.includes('传送2 人')||div.innerHTML.includes('传送 2人')
              ||div.innerHTML.includes('传送5人')||div.innerHTML.includes('传送 5 人')||div.innerHTML.includes('传送5 人')||div.innerHTML.includes('传送 5人'))
            {
                remove_shabiest(div);
                ++cnt;
            }
        });
        if(!cnt)
        {
            const p=document.createElement(elem.tagName);
            p.textContent='我是**，我不发接龙了';
            for(let attr of elem.attributes) p.setAttribute(attr.name,attr.value);
            elem.replaceWith(p);
        }
    }
    remove_shabi();
    setInterval(remove_shabi,1000);
})();
