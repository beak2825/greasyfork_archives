// ==UserScript==
// @name         中图网添加豆瓣链接
// @namespace    https://tampermonkey.net/
// @version      0.1.3
// @description  中图网添加豆瓣链接，点击图书信息里的 ISBN 直接跳转豆瓣书籍页面
// @author       niusann
// @license MIT
// @match      https://www.bookschina.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442816/%E4%B8%AD%E5%9B%BE%E7%BD%91%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/442816/%E4%B8%AD%E5%9B%BE%E7%BD%91%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

function getElementsByXPath(xpath, parent)
{
    let results = [];
    let query = document.evaluate(xpath, parent || document,
                                  null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}

function main(){
    console.log('----')
    var xpath = "//li[contains(text(),'ISBN')]";
    var es=getElementsByXPath(xpath)
    for(var i=0;i<es.length;i++){
        var isbn = es[i].innerHTML;
        if(!isbn)return
        isbn=isbn.replace('ISBN：','')
        var url='https://book.douban.com/isbn/'+isbn+'/'
        es[i].innerHTML='<a target="_blank" style="color: blue" href="'+url+'">ISBN:    '+isbn+'</a>'

        var titleEle = document.querySelector('h1')
        titleEle.innerHTML = '<a target="_blank" style="color: blue" href="'+url+'">'+titleEle.textContent+'</a>'
    }
}

(function() {
    //    document.addEventListener("DOMContentLoaded", main)
    main()
})();