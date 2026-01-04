// ==UserScript==
// @name         豆瓣读书显示济南大学图书馆馆藏
// @name:      zh-CN
// @namespace    ujn_doubanbook
// @version      1.1
// @description  在豆瓣读书侧栏中显示济南大学图书馆馆藏信息。同时支持校内外访问。由于学校限制，校外无法定位图书位置，因此本脚本默认为校内访问。若要默认校外请修改 outOfSchool 变量。
// @author       Sun
// @license      MIT
// @match        https://book.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @connect  202.194.76.102
// @connect mlib.ujn.edu.cn
// @downloadURL https://update.greasyfork.org/scripts/437750/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E6%98%BE%E7%A4%BA%E6%B5%8E%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%A6%86%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/437750/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E6%98%BE%E7%A4%BA%E6%B5%8E%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%A6%86%E8%97%8F.meta.js
// ==/UserScript==

let outOfSchool = false; // 当前是否处于校外环境下，若是为true，否为false

// 校内根据 marc 和 isbn 获取图书余量
function getBook(marc, isbn, title) {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://202.194.76.102:8080/opac/ajax_isbn_marc_no.php?marc_no=" + marc + "&isbn=" + isbn,
        onload: function(res) {
            if (res.status == 200) {
                var text = res.responseText;
                var json = JSON.parse(text);
                insertBook(marc, title, json.lendAvl.match(/\d+/g));
                console.log(json);
            }
        }
    });
}

// 校外根据 isbn 获取图书余量
function getBookOutSchool(isbn) {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://mlib.ujn.edu.cn/search/searchList?kw=" + isbn + "&schoolid=614&xc=6&searchtype=isbn",
        onload: function(res) {
            if (res.status === 200) {
                const temp_element = (new DOMParser()).parseFromString(res.responseText, "text/html");
                // let temp_element = document.createElement('html')
                // temp_element.innerHTML = res.responseText;
                // console.log(temp_element.getElementsByClassName("list")[0].children);
                if (temp_element.getElementsByClassName("list")[0].children.length === 0) {
                    document.getElementById('ujn_lib_booklist').innerHTML = "<p>图书馆没有这本书（提示：可以试试同书的不同版本）</p>";
                }
                for (const li of temp_element.getElementsByClassName("list")[0].children) {
                    let info = JSON.parse(li.getElementsByTagName("input")[0].getAttribute("value"));
                    insertBook(info, info.title, li.innerText.match(/可借\/总藏：(\d+)\/(\d+)/).slice(1, 3).reverse());
                }
            }
        }
    });
}

// 将图书信息插入至侧栏 ujn_lib_booklist 中
function insertBook(marc, title, remains) {
    let ul = document.getElementById('ujn_lib_booklist'); // 侧栏
    let li = document.createElement("li"); // 条目
    li.setAttribute('class', 'mb8 pl');
    let div = document.createElement("div"); // 书名
    div.setAttribute('class', 'meta-wrapper');
    let div_remain = document.createElement("div"); // 余量
    div_remain.setAttribute('class', 'count');
    div_remain.innerText = "馆藏：" + remains[0] + "  可借：" + remains[1];
    let a = document.createElement("a"); // 链接
    if(!outOfSchool) {
        a.setAttribute('href', 'http://202.194.76.102:8080/opac/item.php?marc_no=' + marc);
    } else {
        a.setAttribute('href', 'javascript:void(0)');
        a.addEventListener("click", () => { openBookPage(marc); });
    }

    a.innerText = title;
    div.appendChild(a);
    div.appendChild(div_remain);
    li.appendChild(div);
    ul.appendChild(li);
}

// 校外打开图书页面
function openBookPage(info) {
    let form = document.createElement("form");
    form.setAttribute('id', 'postform');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', 'https://mlib.ujn.edu.cn/search/bookDetail');
    form.setAttribute('target', 'new_window');

    let xc = document.createElement("input");
    xc.setAttribute("name", "xc");
    xc.setAttribute("value", 6);
    form.appendChild(xc);

    let sid = document.createElement("input");
    sid.setAttribute("name", "schoolid");
    sid.setAttribute("value", 614);
    form.appendChild(sid);

    let dp = document.createElement("input")
    dp.setAttribute("name", "detailParam");
    dp.setAttribute("value", JSON.stringify(info));
    form.appendChild(dp);

    document.head.appendChild(form);
    //window.open('', 'new_Window');
    form.submit();
}

(function() {
    'use strict';

    // 检查 URL 是否合规
    if( ! /https:\/\/book\.douban\.com\/subject\/\d+\/$/.test(location.href) ) {
        return;
    }

    // 侧栏创建显示区域
    let div = document.createElement("div");
    div.setAttribute('class', 'gray_ad');
    div.setAttribute('id', 'ujn_lib');

    let h2 = document.createElement("h2");
    h2.innerText = "济南大学图书馆馆藏";
    div.appendChild(h2);

    let ul = document.createElement("ul");
    ul.setAttribute('id', 'ujn_lib_booklist');
    ul.innerHTML = "<p>查询中</p>";
    div.appendChild(ul);

    document.getElementsByClassName('aside')[0].prepend(div);

    const isbn = document.head.querySelector("meta[property='book:isbn']").content;

    if(!outOfSchool) {
        GM_xmlhttpRequest({
            method: "POST",
            timeout: 2000,
            url: "http://202.194.76.102:8080/opac/ajax_search_adv.php" ,
            data: "{\"searchWords\":[{\"fieldList\":[{\"fieldCode\":\"05\",\"fieldValue\":" + isbn + "}]}],\"filters\":[],\"limiter\":[],\"sortField\":\"relevance\",\"sortType\":\"desc\",\"pageSize\":20,\"pageCount\":1,\"locale\":\"\",\"first\":true}",
            onload: function (res) {
                if (res.status === 200) {
                    document.getElementById('ujn_lib_booklist').innerHTML = "";
                    var json = JSON.parse(res.responseText);
                    console.log(json);
                    let books = json.content;
                    if (books.length === 0) {
                        document.getElementById('ujn_lib_booklist').innerHTML = "<p>图书馆没有这本书</p>";
                    } else {
                        for (const item of books) {
                            getBook(item.marcRecNo, item.isbn, item.title);
                        }
                    }
                }
            },
            ontimeout: function () {
                document.getElementById('ujn_lib_booklist').innerHTML = "<p>请求超时</p><p>不在学校？试试<a id='ujn_switchtoout' href='javascript:void(0);'>校外访问</a></p>";
                document.getElementById('ujn_lib_booklist').addEventListener("click", () => {
                    document.getElementById('ujn_lib_booklist').innerHTML = "";
                    outOfSchool = true;
                    getBookOutSchool(isbn);
                });
            }
        });
    } else {
        document.getElementById('ujn_lib_booklist').innerHTML = "";
        getBookOutSchool(isbn);
    }

})();