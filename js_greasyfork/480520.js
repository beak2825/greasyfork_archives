// ==UserScript==
// @name	    图书互助
// @namespace       安装在图书馆参考咨询联盟可查看SS号
// @version	    1.0.5
// @include	    *book.dglib.superlib.net/*
// @include	    *book.ucdrs.superlib.net*
// @include	    *www.sslibrary.com/*
// @include         *book.duxiu.com*
// @description     可以直接显示文献的ss号或dxid进行互助，,可以秒传和生成pdf，PC、手机、MAC、苹果设备都可用，可查询全国图书馆参考咨询联盟、超星、读秀、龙岩、东莞图书馆，获取全文PDF。
// @copyright	    pdfshuwu
// @grant	    none
// @namespace pdfshuwu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480520/%E5%9B%BE%E4%B9%A6%E4%BA%92%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/480520/%E5%9B%BE%E4%B9%A6%E4%BA%92%E5%8A%A9.meta.js
// ==/UserScript==

function fetchSsidByDxid(dxid) {
    var myHeaders = new Headers();
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "dxDxid": dxid });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("https://apicf.pdfshuwu.com/api/front/duxiu/search", requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.code === "200" && data.data && data.data.lists && data.data.lists.length > 0) {
                return data.data.lists[0].dxSsid; // 返回SSID
            } else {
                return "查询不到书籍,数据库暂时只有2018年以内出版的";
            }
        });
}
function fetchSsidBySsid(ssid) {
    var myHeaders = new Headers();
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "dxSsid": ssid });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("https://apicf.pdfshuwu.com/api/front/duxiu/search", requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.code === "200" && data.data && data.data.lists && data.data.lists.length > 0) {
                return data.data.lists[0].dxSsid; // 返回SSID
            } else {
                return "查询不到书籍,数据库暂时只有2018年以内出版的";
            }
        });
}
// 跳转
function createBookLink(ssid) {
    var b = document.createElement("a");
    b.target = "_blank";
    b.innerText = "图书互助";
    b.style.color = 'green';
    b.style.fontSize = '14px';
    b.style.fontWeight = 'bold';
    b.href = "https://www.pdfshuwu.com/details/" + ssid;
    document.body.appendChild(b);
    return b;
}

function handleExample1() {
    var bookList = document.querySelectorAll("table.book1");
    console.log(bookList, 121);
    var btnInput = document.getElementsByClassName("btnInput")
    if (bookList.length == 0) {
        bookList = document.querySelectorAll("table.books");
    }
    if (bookList.length == 0) {
        // bookList = document.querySelectorAll("table");
        bookList = document.querySelectorAll(".books li");
    }
    if (btnInput.length == 1) {
        for (var j = 0; j < bookList.length; j++) {
            (function (index) {
                var dxid = document.getElementById("dxid" + index);
                var dxidVal = dxid.value;
                fetchSsidByDxid(dxidVal).then(ssid => {
                    var p = document.createElement("p");
                    p.innerText = "SSID: " + ssid;
                    p.style.color = 'red';
                    p.style.fontSize = '16px';
                    p.style.fontWeight = 'bold';
                    var blink = createBookLink(ssid);
                    if (blink) {
                        dxid.parentNode.appendChild(p)
                        dxid.parentNode.appendChild(blink)
                    }
                }).catch(error => {
                    console.error('Error fetching ssid:', error);
                });
            })(j);
        }
    } else {
        for (var i = 0; i < bookList.length; i++) {
            (function (index) {
                var dxid = document.getElementById("dxid" + index);
                var dxidVal = dxid.value;
                fetchSsidByDxid(dxidVal).then(ssid => {
                    var p = document.createElement("p");
                    p.innerText = "SSID: " + ssid;
                    p.style.color = 'red';
                    p.style.fontSize = '16px';
                    p.style.fontWeight = 'bold';
                    var blink = createBookLink(ssid);
                    if (blink) {
                        var tr = document.createElement('tr');
                        var td = document.createElement('td');
                        td.colSpan = '3';
                        td.style.paddingLeft = '3%';
                        td.appendChild(p);
                        td.appendChild(blink);
                        tr.appendChild(td);
                        dxid.parentNode.parentNode.parentNode.appendChild(tr);
                    }
                }).catch(error => {
                    console.error('Error fetching ssid:', error);
                });
            })(i);
        }
    }
}

function getSsidFromUrl(queryString) {
    // 创建一个 URL 对象
    const params = new URLSearchParams(queryString)

    // 获取 ssid 参数的值
    var ssidValue = params.get("ssid");
    return ssidValue
}

function handleExample2() {
    var observer = new MutationObserver(function (mutationsList, observer) {
        // 当页面中的 DOM 发生变化时，检查是否加载了目标元素
        var liElements = document.querySelectorAll("li.fl.zli_info");

        if (liElements.length > 0) {
            console.log("li.fl.zli_info 元素已经加载");
            liElements.forEach(function (li) {
                var aTag = li.querySelector("a");
                // 如果 a 标签存在，则获取 href 属性值
                if (aTag) {
                    var hrefValue = aTag.getAttribute("href");

                    fetchSsidBySsid(getSsidFromUrl(hrefValue)).then(ssid => {

                        var p = document.createElement("p");
                        p.innerText = "SSID: " + ssid;
                        p.style.color = 'red';
                        p.style.fontSize = '15px';
                        p.style.fontWeight = 'bold';
                        var blink = createBookLink(ssid);
                        if (blink) {
                            var tr = document.createElement('tr');
                            var td = document.createElement('td');
                            td.colSpan = '3';
                            td.style.paddingLeft = '3%';
                            td.appendChild(p);
                            td.appendChild(blink);
                            tr.appendChild(td);
                            console.log(liElements);
                            aTag.parentNode.parentNode.appendChild(tr);
                        }
                    }).catch(error => {
                        console.error('Error fetching ssid:', error);
                    });

                }
            });


            // 停止监听
            observer.disconnect();
        }
    });

    // 配置 MutationObserver，监听子节点的变化
    observer.observe(document.body, { childList: true, subtree: true });
}
function main() {
    const currentUrl = window.location.href;
    // 根据不同的网站 URL 来执行对应的函数
    if (currentUrl.includes("book.ucdrs.superlib.net/")) {
        handleExample1();
    } else if (currentUrl.includes("www.sslibrary.com")) {
        handleExample2();
    } else {
        console.log("该网站没有特定操作");
    }
}

function detailMain() {
    var string = location.href.match(/(Number).*?(?=&)/);
    var value = string ? string[0].replace('Number=', '') : '';
    const currentUrl = window.location.href;
    // 根据不同的网站 URL 来执行对应的函数
    if (currentUrl.includes("book.ucdrs.superlib.net/")) {
        fetchSsidByDxid(value).then(ssid => {
            var p = document.createElement("p");
            p.innerText = 'SSID:' + ssid;
            p.style.color = 'red';
            p.style.fontSize = '16px';
            p.style.fontWeight = 'bold';

            var blink = createBookLink(ssid);
            var bookImg = document.getElementsByClassName('tubookimg')[0];
            if (bookImg && blink) { // 检查bookImg是否存在
                bookImg.appendChild(p);
                bookImg.appendChild(blink);
            } else {
                console.error('Element not found: .tubookimg');
            }
        }).catch(error => {
            console.error('Error fetching ssid:', error);
        });
    } else {
        console.log("该网站没有特定操作");
    }

}

(function () {
    /// entry
    try {
        main();
        detailMain();
    } catch (e) {
        console.error(e);
    }
})();
