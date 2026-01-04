// ==UserScript==
// @name                [絕]畅读搜狐
// @author              絕版大叔丶
// @namespace           https://sdator.github.io/
// @icon                https://avatars3.githubusercontent.com/u/17621623?s=40&v=4
// @version             1.2
// @match               *://www.sohu.com/a/*
// @description         删除搜狐所有广告，重建主题内容
// @run-at              document-end
// @grant               GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/384334/%5B%E7%B5%95%5D%E7%95%85%E8%AF%BB%E6%90%9C%E7%8B%90.user.js
// @updateURL https://update.greasyfork.org/scripts/384334/%5B%E7%B5%95%5D%E7%95%85%E8%AF%BB%E6%90%9C%E7%8B%90.meta.js
// ==/UserScript==

let css = `
body {
    display: flex;
    background-color: bisque;
    justify-content: center;
    align-items: center;
}

#diy {
    margin: 50px;
    width: 70vw;
}
`

//css样式
GM_addStyle(css)



$(() => {
    let 元素 = ".text"

    //兼容另一种特殊页面
    let 特殊页面 = $(".article-box.l")
    if (特殊页面.length) {
        元素 += ",.article-box.l"
        特殊页面.children(":gt(4)").remove()
    }

    // 重建主题
    $(元素).appendTo($("body")).wrap($("<div id='diy'></div>"));
    // 删除多余标签
    $("body *").not('#diy').not($('#diy').find("*")).remove()
})