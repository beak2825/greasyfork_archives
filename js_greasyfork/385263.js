// ==UserScript==
// @name  知乎隐藏标题和侧边栏
// @namespace  vince.zhihu
// @include *://zhihu.com
// @include *://www.zhihu.com/*
// @include *://zhuanlan.zhihu.com/*
// @include *://promotion.zhihu.com/*
// @version 1.0
// @description 知乎隐藏固定的头部标题和右侧边栏
// @downloadURL https://update.greasyfork.org/scripts/385263/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98%E5%92%8C%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/385263/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98%E5%92%8C%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

function main(){
    var sticky=document.getElementsByClassName("Sticky");
    if(sticky){
        for ( let idx = 0; idx < sticky.length; idx++) {
            sticky[idx].style.display='none';
        }
    }

}
main();