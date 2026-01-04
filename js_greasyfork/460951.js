// ==UserScript==
// @name         mooc2md
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用来下载mooc上ppt的脚本
// @author       Drelf2018
// @match        *://mooc1.chaoxing.com/mycourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460951/mooc2md.user.js
// @updateURL https://update.greasyfork.org/scripts/460951/mooc2md.meta.js
// ==/UserScript==

function download(title, content) {
    // chatgpt 抄的下载代码
    var blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title + ".md";
    a.click();
    URL.revokeObjectURL(url);
}

function fetch() {
    // 获取 ppt 所在的 doc (嵌套了三个iframe
    var ifr, doc = document
    for (var i = 0; i < 3; i++) {
        ifr = doc.getElementsByTagName("iframe")[0]
        doc = ifr.contentDocument
    }

    // 获取当前文档名
    var title = document.getElementsByClassName("posCatalog_active")[0].innerText;
    title = title.replace("\n已完成", "")
    var md = `# ${title}`

    // 枚举图片链接
    var result = doc.evaluate("/html/body/div[1]/img", doc, null, XPathResult.ANY_TYPE, null);
    var nodes = result.iterateNext();
    var j = 1
    
    while(nodes) {
        md += "![" + j + "](" + nodes.src + ")\n"
        nodes = result.iterateNext();
        j += 1
    }

    // 等待确认并下载
    if(confirm(title + "\n总页数：" + (j - 1))) download(title, md)
}

(function () {
    'use strict';
    var span = document.createElement('span');
    span.style.position = "fixed"
    span.style.width = "50px"
    span.style.height = "50px"
    span.style.backgroundColor = "white"
    span.style.borderRadius = "25px"
    span.style.boxShadow = "0px 1px 3px grey"
    span.style.top = "50px"
    span.style.left = "10px"
    span.innerHTML = "下载"
    span.style.textAlign = "center";
    span.style.lineHeight = "50px";
    span.style.fontSize = "15px";
    span.onclick = fetch
    document.body.appendChild(span);
})();