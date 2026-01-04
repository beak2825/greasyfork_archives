// ==UserScript==
// @name         sdufelib_douban
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  豆瓣跳转山财图书馆
// @author       Wong
// @match        https://book.douban.com/subject/*
// @icon         https://libsys.sdufe.edu.cn/space/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      libsys.sdufe.edu.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434986/sdufelib_douban.user.js
// @updateURL https://update.greasyfork.org/scripts/434986/sdufelib_douban.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let isbn = getISBN();
    console.log(isbn);
    let postdata = {
        "page": 1,
        "pageSize": 20,
        "indexName": "idx.opac",
        "sortField": "relevance",
        "sortType": "desc",
        "collapseField": "groupId",
        "queryFieldList": [{
            "logic": 0,
            "field": "isbns",
            "values": [getISBN()],
            "operator": "="
        }],
        "filterFieldList": []
    };
    const liburl = "https://libsys.sdufe.edu.cn/meta-local/opac/search/";
    const searchurl = "https://libsys.sdufe.edu.cn/space/searchDetailLocal/";
    GM_xmlhttpRequest({
    url:liburl,
    method :"POST",
    data:JSON.stringify(postdata),
    headers: {
        "Content-type": "application/json;charset=utf-8",
        "Content-Length" : "225"
    },
    onload:function(xhr){
        let responseJson = JSON.parse(xhr.responseText);
        let urlid = responseJson.data.dataList[0].bibId;
        let bookurl = searchurl + urlid;
        processHTML(bookurl);
    }
    });

})();

function getISBN() {
    let myRe = /(\d){13}/g;
    let info = document.getElementById('info');
    return (myRe.exec(info.innerText)[0]);
}


function processHTML(bookurl) {
    let aelem = document.createElement('a');
    let elem = document.getElementById('interest_sect_level');
    aelem.className = "j a_show_login colbutt ll";
    aelem.href = bookurl;
    aelem.target = "_blank";
    aelem.innerHTML = "<span><input type=\"submit\" class=\"minisubmit j\" value=\"图书馆\" title=\"\"></span>";
    elem.prepend(aelem);
}
