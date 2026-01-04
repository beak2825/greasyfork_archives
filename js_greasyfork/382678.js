// ==UserScript==
// @name                [絕]csdn瘦身
// @author              絕版大叔丶
// @namespace           https://sdator.github.io/
// @icon                https://avatars3.githubusercontent.com/u/17621623?s=40&v=4
// @version             1.6.4
// @match               *://blog.csdn.net/*
// @description         删除csdn所有广告，保留主题内容
// @grant               GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382678/%5B%E7%B5%95%5Dcsdn%E7%98%A6%E8%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/382678/%5B%E7%B5%95%5Dcsdn%E7%98%A6%E8%BA%AB.meta.js
// ==/UserScript==



let css = `
body {
    display: flex;
    background-color: bisque;
    justify-content: center;
    align-items: center;
    background-image: url();
}
#diy {
    padding-top: 30px;
    margin: auto;
    width: 70vw;
}
main{
    float: none;
}
`
//css样式
GM_addStyle(css)

$(() => {

    // 重建主题 元素提升到顶部
    $("main").appendTo($("body")).wrap($("<div id='diy'></div>"));
    // 删除多余标签
    $("body *").not('#diy').not($('#diy').find("*")).remove()
    $("[class^=recommend]").remove()
})