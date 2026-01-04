// ==UserScript==
// @name         豆瓣高清图-douban high resolution image
// @namespace    https://github.com/DragonCat1
// @version      0.5.3
// @license      MIT
// @description  豆瓣图片换成高分辨率原图 包括：首页时间线配图、书籍封面图、电影封面图、专辑/歌曲封面图、同城活动封面图、小组话题内容图、日记内容图、小组头像、用户头像（鼠标经过显示）、相册照片 请配合右键“另存为”或“在新标签中打开图片”食用 *不支持背景图和懒加载的图
// @author       铛铛铛铛铛/https://www.douban.com/people/48915223
// @copyright    1991-2018,铛铛铛铛铛-Dragoncat
// @match        https://*.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369448/%E8%B1%86%E7%93%A3%E9%AB%98%E6%B8%85%E5%9B%BE-douban%20high%20resolution%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/369448/%E8%B1%86%E7%93%A3%E9%AB%98%E6%B8%85%E5%9B%BE-douban%20high%20resolution%20image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement("style")
    style.innerHTML = `
/*覆盖原有样式*/
.doumail-list li,.status-item,.obu dt,#comments,.comment-item,.user-face,.member-list .pic,.profile-entry{
overflow: visible!important;
}
.status-item .hd .usr-pic {
z-index: initial;
}
.channel-item .pic img{
width:100%;
}
.note a img{
max-width:120px;
}
.album-item img,.album_s,.album,.album-list .pic img{
height:auto;
background-size: 100% 100%;
}
.album_photo{
height:auto;
}
/*新样式*/
.uhead-wrap{
position: relative;
}
.raw-uhead{
visibility: hidden;
position: absolute;
transition: all 0.1s;
z-index: 1;
opacity: 0;
width: auto!important;
height: auto!important;
top:0;
left:0;
border: 1px dashed #037b82;
border-radius: 0 !important;
}
.uhead-wrap:hover .raw-uhead{
transition: all 0.1s 0.15s;
visibility: visible;
opacity: 1;
}

`
    const regexps = {
        userhead:[/^(https:\/\/img\d\.doubanio\.com\/icon\/u)[a-z]*(\d+-\d+)(\.jpg)$/,
                  function(prefix){
                      return `$1${prefix}$2$3`
                  }],
        common:[/^(https:\/\/img\d\.doubanio\.com\/p?view\/(event_poster|subject|note|status|group|group_topic|photo|richtext)\/).+(\/public\/.+\..+)$/,
                function(prefix){
                    return `$1${prefix}$3`
                }]
    }
    const prefixs=['r','raw','l','large']
    document.head.appendChild(style)
    const imgs =document.querySelectorAll("img")
    imgs.forEach((img)=>{
        if(regexps.userhead[0].test(img.src)){
            let index = 0
            let rpic=img.src.replace(regexps.userhead[0],regexps.userhead[1](prefixs[index]))
            const headWrap = document.createElement('div')
            headWrap.className='uhead-wrap'
            const rawImg = document.createElement('img')
            rawImg.className='raw-uhead'
            rawImg.dataset.src=rpic
            if(img.x>document.documentElement.offsetWidth/2-img.width/2) rawImg.style.cssText='left: initial; right: 0px;'
            headWrap.append(img.cloneNode(),rawImg)
            img.replaceWith(headWrap)
            headWrap.addEventListener("mouseenter",()=>{
                if(!headWrap.children[1].src){
                    headWrap.children[1].src=headWrap.children[1].dataset.src
                }
            })
            rawImg.onerror=(e)=>{
                console.log(index)
                index+=1
                if(index>=prefixs.length) return
                rawImg.src=rawImg.src.replace(regexps.userhead[0],regexps.userhead[1](prefixs[index]))
            }
        }
        else if(regexps.common[0].test(img.src)){
            let index = 0
            img.src =img.src.replace(regexps.common[0],regexps.common[1](prefixs[index]))
            img.onerror=(e)=>{
                index+=1
                if(index>=prefixs.length) return
                img.src=img.src.replace(regexps.common[0],regexps.common[1](prefixs[index]))
            }
        }
    })
})();