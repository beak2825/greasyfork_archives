// ==UserScript==
// @name         ISBN_2_JD_TB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.eslite.com/product.aspx*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/381388/ISBN_2_JD_TB.user.js
// @updateURL https://update.greasyfork.org/scripts/381388/ISBN_2_JD_TB.meta.js
// ==/UserScript==

let current_domain = document.domain

if(current_domain === "www.eslite.com"){
    let current_html = $("body")[0].innerText
    let re = /ISBN\s13\s\／\d+/g;
    let result = current_html.match(re);
    let ISBN = result[0].split("／")[1]
    let JD_url = "https://search.jd.com/Search?keyword=" +ISBN
    let TAOBAO_url = "https://s.taobao.com/search?q="+ISBN
    let book_name = $("#ctl00_ContentPlaceHolder1_lblProductName")[0].innerText
    let TAOBAO_url_2 = "https://s.taobao.com/search?q="+book_name
    let element = $(".PI_info")
    element.append(`<a href="${JD_url}">京東商城搜索</a><br>`)
    element.append(`<a href="${TAOBAO_url}">淘寶商城搜索(ISBN)</a><br>`)
    element.append(`<a href="${TAOBAO_url_2}">淘寶商城搜索(作品名稱)</a><br>`)
}