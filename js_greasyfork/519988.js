// ==UserScript==
// @name         豆瓣电子书下载助手 - ZLibrary、Anna Archive
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动在豆瓣的书籍页面添加多个电子资源网站入口，支持 ZLibrary、Anna Archive、XMU 图书馆等。
// @match        https://book.douban.com/*
// @grant        GM_xmlhttpRequest
// @license      GNU GPL
// @author       mao
// @downloadURL https://update.greasyfork.org/scripts/519988/%E8%B1%86%E7%93%A3%E7%94%B5%E5%AD%90%E4%B9%A6%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20-%20ZLibrary%E3%80%81Anna%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/519988/%E8%B1%86%E7%93%A3%E7%94%B5%E5%AD%90%E4%B9%A6%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20-%20ZLibrary%E3%80%81Anna%20Archive.meta.js
// ==/UserScript==


//  ================获取图书数量====================
// 发送HTTP请求
function getDoc(url, callback) {
    // 这里必须使用tampermonkey提供的xhr，使用原生的xhr会报错，要在@grant声明该对象
    GM_xmlhttpRequest({
        method: 'GET', // 使用GET方法请求
        url: url, // 请求的URL
        onload: function (responseDetail) { // 请求完成后的回调函数
            // 设置超时
            var timeout = setTimeout(function () {
                console.error("请求超时");
            }, 5000); // 5秒超时

            if (responseDetail.status === 200) { // 检查响应状态是否为200（成功）
                clearTimeout(timeout); // 清除超时
                let doc = page_parser(responseDetail.responseText);
                callback(doc, responseDetail); // 调用回调函数，传递文档和响应细节
            } else {
                console.error(url + " 请求失败，状态码：" + responseDetail.status); // 处理非200状态
            }
        }
    });
}

// 解析响应的HTML文本
function page_parser(responseText) {
    return (new DOMParser()).parseFromString(responseText, 'text/html'); // 使用DOMParser解析HTML字符串
}

// 获取搜索结果中的图书数量
function fetchBookCount(url) {
    // 发送HTTP请求
    getDoc(url, function (doc, responseDetail) {
        let bookCount = "?"

        // 提取搜索结果中的图书数量
        if (!doc) {
            console.error("zlib html为空，获取数据失败"); // Log an error if doc is null
        }
        let element = doc.querySelector("#subprojectsSearch > li > span")

        bookCount = element ? element.textContent.trim() : "?"
        console.log("在zlib搜索到图书" + bookCount + "本")


        // 在zlib按钮后面添加当前图书的数量
        // 本在在外部调用fetchBookCount，但是会自动成异步，有点麻烦，所以写在这里了
        const zlibEle = document.querySelector("#ZLib");
        zlibEle.textContent += bookCount;
    });

}
// ======================添加zlib anna xmu 搜索按钮=============================

// 获取图书的关键词，图书ISBN或图书名称，用于检索
function getBookInfo() {
    // 获取书籍info信息
    const bookInfo = document.querySelector("#info");

    // 获取所有的span元素
    const spans = bookInfo.querySelectorAll("span.pl");
    let isbn = '';

    // 遍历所有的span元素，查找包含'ISBN'的元素
    spans.forEach(span => {
        if (span.textContent.trim() === 'ISBN:') {
            isbn = span.nextSibling.textContent.trim(); // 获取下一个兄弟节点的文本内容
        }
    });

    console.log("ISBN:" + isbn); // 输出ISBN值
    const bookName = document.querySelector("#wrapper > h1 > span").textContent.trim();
    console.log("图书名称：" + bookName);
    // 检索词，优先检索ISBN
    return isbn ? isbn : bookName; // 返回检索词
}

// 新增方法：为ZLIB按钮添加悬停样式
function addHoverStyle(button) {
    button.className = "redbutt j a_collect_btn rr";  //使用现成的样式
    button.style.transition = "background-color 0.3s, color 0.3s"; // 添加过渡效果
    button.onmouseover = function () {
        button.style.backgroundColor = "#37a"; // 悬停时背景色
        button.style.color = "#fff"; // 悬停时文字颜色
    };
    button.onmouseout = function () {
        button.style.backgroundColor = ""; // 恢复背景色
        button.style.color = ""; // 恢复文字颜色
    };
}


// 新增方法：创建ZLibrary按钮
function createZlibButtons(container, hosts, keyword) {
    // 遍历 hosts 词典，为每个网址生成对应的按钮
    Object.keys(hosts).forEach(hostName => {
        const zlibButton = document.createElement("a");
        zlibButton.id = hostName
        zlibButton.textContent = hostName; // 使用网站名称作为按钮文本
        addHoverStyle(zlibButton);    // 为按钮添加样式

        // 为按钮添加点击事件，使用对应的 URL
        zlibButton.addEventListener("click", function () {
            const url = `${hosts[hostName]}${encodeURIComponent(keyword)}`;
            window.open(url, "_blank");
        });

        container.style.display = 'flex';
        container.appendChild(zlibButton);
    });
}

// =============================================

(function () {
    "use strict";

    // 1.定义一个包含多个 ZLibrary 网站名称和对应 URL 的词典
    const hosts = {
        "ZLib": "https://z-library.sk/s/",
        "Anna": "https://annas-archive.org/search?q=",
    };


    // 2.获取书籍关键词
    const bookKeyword = getBookInfo();

    // 3.在[想读 在读 读过]后面添加zlib按钮
    const interestDiv = document.querySelector("#interest_sect_level.clearfix");
    if (!interestDiv) {
        console.log("豆瓣页面更新了，脚本失效了，请联系作者进行处理")
    }
    createZlibButtons(interestDiv, hosts, bookKeyword);

    // 4.添加zlib搜索的图书数量
    const url = `${hosts['ZLib']}${encodeURIComponent(bookKeyword)}`;
    fetchBookCount(url)
})();



