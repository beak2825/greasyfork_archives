// ==UserScript==
// @name         豆瓣小组楼层显示-Show the index of comment in Douban group
// @namespace    https://github.com/DragonCat1
// @version      0.0.1
// @license      MIT
// @description  用了之后Duang～豆瓣小组就能显示楼层了
// @author       铛铛铛铛铛/https://www.douban.com/people/48915223
// @copyright    1991-2018,铛铛铛铛铛-Dragoncat
// @match        https://www.douban.com/group/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369611/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BA-Show%20the%20index%20of%20comment%20in%20Douban%20group.user.js
// @updateURL https://update.greasyfork.org/scripts/369611/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BA-Show%20the%20index%20of%20comment%20in%20Douban%20group.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style=`
#comments .comment-item:before{
content:attr(data-index);
position: absolute;
right: 12px;
bottom: 20px;
font-size: 24px;
font-style: italic;
color: #b4c1bb;
}
`
    const styleEle = document.createElement('style')
    styleEle.type='text/css'
    styleEle.innerHTML =style
    document.head.appendChild(styleEle)
    const allItems = document.querySelectorAll('#comments .comment-item')
    const urlqs = new URLSearchParams(location.search)
    const start = urlqs.get('start')-0||0
    allItems.forEach((ele,index)=>{
        ele.dataset.index=`#${start+index+1}`
    })

})();