// ==UserScript==
// @name         修正Google搜尋中的維基百科為桌面版網頁
// @name:en      Changed Wikipedia to desktop webpage in Google search results
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修正Google搜尋中的維基百科為桌面版網頁。
// @description:en  Changed Wikipedia to desktop webpage in Google search results.
// @author       vincent8914
// @match        https://www.google.com/search*
// @match        https://www.google.com.tw/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449378/%E4%BF%AE%E6%AD%A3Google%E6%90%9C%E5%B0%8B%E4%B8%AD%E7%9A%84%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%E7%82%BA%E6%A1%8C%E9%9D%A2%E7%89%88%E7%B6%B2%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/449378/%E4%BF%AE%E6%AD%A3Google%E6%90%9C%E5%B0%8B%E4%B8%AD%E7%9A%84%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%E7%82%BA%E6%A1%8C%E9%9D%A2%E7%89%88%E7%B6%B2%E9%A0%81.meta.js
// ==/UserScript==

(function() {
    const regexp = /m.wikipedia.org/g;
    var searchResults = document.querySelectorAll('.yuRUbf');
    for(let i = 0; i < searchResults.length; i++){
        if(regexp.test(searchResults[i].innerHTML)){
            searchResults[i].innerHTML = searchResults[i].innerHTML.replace(regexp, 'wikipedia.org');
        }
    }
})();