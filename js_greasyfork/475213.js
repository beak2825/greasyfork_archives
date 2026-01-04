// ==UserScript==
// @name        起点显示优书网评分
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在起点书籍页面显示优书网评分
// @author       chen310
// @match        https://www.qidian.com/book/*
// @icon         https://qdfepccdn.qidian.com/www.qidian.com/favicon/qd_icon.ico
// @grant        GM_xmlhttpRequest
// @connect      api.yousuu.com
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/475213/%E8%B5%B7%E7%82%B9%E6%98%BE%E7%A4%BA%E4%BC%98%E4%B9%A6%E7%BD%91%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/475213/%E8%B5%B7%E7%82%B9%E6%98%BE%E7%A4%BA%E4%BC%98%E4%B9%A6%E7%BD%91%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const bookElement = document.getElementById("bookName");
    const bookName = document.querySelector('meta[property="og:novel:book_name"]').getAttribute("content");
    const writer = document.querySelector('meta[property="og:novel:author"]').getAttribute("content");
    const apiUrl = `https://api.yousuu.com/api/search?type=title&value=${encodeURIComponent(bookName)}`;

    GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        onload: function (response) {
            if (response.status === 200) {
                try {
                    const jsonData = JSON.parse(response.responseText);
                    const book = jsonData.data.books.find(b => b.title === bookName && b.author === writer);
                    if (book) {
                        const element = document.createElement("a");
                        element.target = "_blank";
                        element.style.color = "#5790df";
                        element.style.fontSize = "16px";
                        element.href = "https://www.yousuu.com/book/" + book.bookId;
                        element.textContent = " 优书网: " + book.score / 10;
                        bookElement.style.display = "inline";
                        bookElement.parentNode.insertBefore(element, bookElement.nextSibling);
                    } else {
                        console.log("找不到这本书");
                    }
                } catch (error) {
                    console.error("解析 JSON 数据时出错:", error);
                }
            } else {
                console.error("请求失败，状态码：" + response.status);
            }
        },
        onerror: function (error) {
            console.error("请求错误:", error);
        }
    });

})();
