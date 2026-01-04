// ==UserScript==
// @name         处理 Chrome 键盘滚屏
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1
// @description  可访问性优化
// @author       Veg
// @include    *.zhihu.com/question/*/answer/*
// @include    https://zhuanlan.zhihu.com/p/*
// @include    *://jingyan.baidu.com/*
// @include    http://bbs.zol.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38455/%E5%A4%84%E7%90%86%20Chrome%20%E9%94%AE%E7%9B%98%E6%BB%9A%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/38455/%E5%A4%84%E7%90%86%20Chrome%20%E9%94%AE%E7%9B%98%E6%BB%9A%E5%B1%8F.meta.js
// ==/UserScript==

document.addEventListener("scroll",function (e) {
e.stopPropagation();
},null);
/*
var audio = new Audio("http://veg.ink/music/open.mp3");
audio.volume = 0.7;
audio.play();
*/