// ==UserScript==
// @name         从必应搜索结果中删除CSDN
// @namespace    https://sjzlei1989.github.io
// @version      0.4
// @description  从必应的搜索结果中删除csdn链接
// @author       xiaolei
// @match        https://cn.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431409/%E4%BB%8E%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%88%A0%E9%99%A4CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/431409/%E4%BB%8E%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%88%A0%E9%99%A4CSDN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const str = "csdn.net";
    let contentDom = document.getElementById("b_results");
    if(contentDom == null) return;
    let items = contentDom.getElementsByClassName("b_algo");
    if(items == null) return;
    let indexToDelete = [];
    for(let i = 0; i < items.length; i++) {
        let sh_favicon = items[i].getElementsByClassName("tilk");
        if(null == sh_favicon) return;
        let url = sh_favicon[0].href;
        if(url.toLowerCase().includes(str)) {
            indexToDelete.push(items[i]);
        }
    }
    for(let i = 0; i < indexToDelete.length; i++) {
        indexToDelete[i].remove();
    }
})();