// ==UserScript==
// @name         在豆瓣读书显示 Z-Library 书籍
// @description  直接查找在 Z-Library 网站上的书籍资源
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Tim
// @match        https://book.douban.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489382/%E5%9C%A8%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E6%98%BE%E7%A4%BA%20Z-Library%20%E4%B9%A6%E7%B1%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/489382/%E5%9C%A8%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E6%98%BE%E7%A4%BA%20Z-Library%20%E4%B9%A6%E7%B1%8D.meta.js
// ==/UserScript==

var domain = "https://zlib.shop"

let ad = document.getElementById('dale_book_subject_top_right')
ad.parentNode.removeChild(ad);

let fetch_anchor = function (anchor) {
    return anchor.nextSibling.nodeValue.trim();
};

// 对使用GM_xmlhttpRequest返回的html文本进行处理并返回DOM树
function page_parser(responseText) {
    return (new DOMParser()).parseFromString(responseText, 'text/html');
}

function getDoc(url, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (responseDetail) {
            if (responseDetail.status === 200) {
                let doc = page_parser(responseDetail.responseText);
                callback(doc, responseDetail);
            }
        }
    });
}

function prependDomStringInAside(domString) {
    let e = document.getElementsByClassName('aside')[0]
    let doc = new DOMParser().parseFromString(domString, "text/html");
    e.prepend(doc.body.firstChild)
}

function appendDomStringInZlib(domString) {
    let doc = new DOMParser().parseFromString(domString, "text/html");
    document.getElementById('zlib').append(doc.body.firstChild)
}

(function() {
    'use strict';

    let name = document.getElementById('wrapper').getElementsByTagName('h1')[0].getElementsByTagName('span')[0].innerHTML

    prependDomStringInAside(`<div id="zlib" style="margin-bottom:20px"><h2>Z-Library · · · · · · </h2><div>正在获取资源...</div></div>`)
    let url = `${domain}/s/${name}?extensions%5B%5D=epub&extensions%5B%5D=pdf%5B%5D=mobi%5B%5D=azw3%5B%5D=txt`
    getDoc(url, function (doc) {
        document.getElementById('zlib').innerHTML = ''
        let ele = doc.getElementById('searchResultBox')
        let items = ele.getElementsByClassName('resItemBox')
        let totalCounter = doc.getElementsByClassName('totalCounter')[0].innerHTML.replace(/[()]*/ig, '')
        appendDomStringInZlib(`<h2>Z-Library (<span id="filterItemsNum">0</span>) · · · · · · <span class="pl">(<a href="${url}" target="_blank">全部 ${totalCounter}</a>)</span></h2>`)
        appendDomStringInZlib(`<div class="clear"></div>`)
        let filterItemsNum = 0
        for (let i = 0; i < items.length && filterItemsNum < 5; i++) {
            let basic = items[i].getElementsByTagName('td')[2].getElementsByTagName('a')
            let name = basic[0].innerText
            let link = basic[0].getAttribute("href")
            let publisher = ''
            let author = []
            for (let i = 1; i < basic.length; i++){
                if (basic[i].getAttribute("title") === 'Publisher') {
                    publisher = basic[i].innerText
                } else {
                    author.push(basic[i].innerText)
                }
            }
            let img = items[i].getElementsByTagName('img')[0].outerHTML.replace('data-src', 'src')
            let year = ''
            let property_year = items[i].getElementsByClassName('property_year')
            if (property_year.length > 0) {
                year = items[i].getElementsByClassName('property_year')[0].getElementsByClassName('property_value')[0].innerText
            }
            let file = items[i].getElementsByClassName('property__file')[0].getElementsByClassName('property_value')[0].innerText
            console.log(publisher === '' ? '' : `${publisher}`, author.join(',') === '' ? '' : `<br/>${author.join(',')}`, file === '' ? '' : `<br/>${file}`)
            let infos = []
            if (publisher !== '') infos.push(publisher)
            if (author.join(',') !== '') infos.push(author.join(','))
            if (file !== '') infos.push(file)
            console.log(infos)
            appendDomStringInZlib(`
<div class="c-aside name-offline"">
  <div class="ll">${img}</div>
  <div style="padding-left:60px">
    <a href="${domain}${link}" target="_blank">${name}</a> ${year === '' ? '' : '(' + year + ')'}<br/>
    <span class="pl">
      ${infos.join('<br/>')}
    </span>
  </div>
</div>`)
            appendDomStringInZlib(`<div class="clear"></div>`)
            appendDomStringInZlib(`<div class="ul" style="margin-bottom:12px;"></div>`)
            filterItemsNum++
        }
        document.getElementById('filterItemsNum').innerHTML = filterItemsNum
        if (filterItemsNum == 0) {
            appendDomStringInZlib(`<div>NoResult</div>`)
        }
        let images = document.getElementById('zlib').getElementsByTagName('img')
        for (let i = 0; i < images.length; i++) {
            images[i].setAttribute('width', '50px')
        }
    });
})();