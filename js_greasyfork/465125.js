// ==UserScript==
// @name        编程猫社区-超简洁首页
// @namespace   xxsgzs.github.io/bcmindex
// @match       shequ.codemao.cn/*
// @version     1.1.1
// @author      CoderOrangesoft
// @license MIT
// @description 编程猫社区简化主页插件，兼容多插件
// @downloadURL https://update.greasyfork.org/scripts/465125/%E7%BC%96%E7%A8%8B%E7%8C%AB%E7%A4%BE%E5%8C%BA-%E8%B6%85%E7%AE%80%E6%B4%81%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/465125/%E7%BC%96%E7%A8%8B%E7%8C%AB%E7%A4%BE%E5%8C%BA-%E8%B6%85%E7%AE%80%E6%B4%81%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==
setTimeout(()=>{
    let nowHomePage = document.getElementsByClassName("r-home--homepage")
    nowHomePage[0].innerHTML = `<iframe src="https://coderorangesoft.github.io/c/new.html" style="width:100%;height:1000px"></iframe>`;
}, 2000);