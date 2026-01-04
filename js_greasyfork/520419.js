// ==UserScript==
// @name         ZJUlib2Clipboard
// @namespace    https://github.com/AlainAlan/ZJUlib2douban/tree/main
// @version      0.6
// @description  在ZJU图书馆页面添加功能按钮，自动复制在架可借书籍的信息（索书号、馆藏地点、书名、作者），并去重。
// @author       AlainAllen
// @match        *://opac.zju.edu.cn/*?func=item-global&doc_library=ZJU01&doc_number=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520419/ZJUlib2Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/520419/ZJUlib2Clipboard.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to extract book information from the table
    function extractBookInfo() {
        let rows = document.querySelectorAll("table tr"); // Select all rows in the table
        let availableBooks = [];

        rows.forEach(row => {
            let statusCell = row.querySelector("td:nth-child(2)"); // Status cell
            let locationCell = row.querySelector("td:nth-child(3)"); // Location cell
            let callNumberCell = row.querySelector("td:nth-child(4)"); // Call number cell

            if (
                statusCell &&
                statusCell.textContent.includes("在架上") &&
                locationCell &&
                callNumberCell
            ) {
                availableBooks.push({
                    callNumber: callNumberCell.textContent.trim(), // 索书号
                    location: locationCell.textContent.trim(), // 馆藏地
                });
            }
        });

        // Extract the book title and author from the specific table
        let titleAndAuthorCell = document.querySelector("table[width='600px'] td");
        let titleAndAuthorText = titleAndAuthorCell?.textContent.trim() || "未知书名与作者";

        // Parse title and author
        let [title, author] = titleAndAuthorText.split("/").map(item => item.trim());
        title = title || "未知书名";
        author = author || "未知作者";

        return availableBooks.map(book => ({
            callNumber: book.callNumber,
            location: book.location,
            title: title,
            author: author
        }));
    }

    // Function to deduplicate book information
    function deduplicateBooks(books) {
        let uniqueBooks = [];
        let seen = new Set();

        books.forEach(book => {
            let key = `${book.callNumber}|${book.location}|${book.title}|${book.author}`;
            if (!seen.has(key)) {
                uniqueBooks.push(book);
                seen.add(key);
            }
        });

        return uniqueBooks;
    }

    // Function to copy book information to clipboard
    function copyBookInfoToClipboard() {
        let bookInfo = extractBookInfo();
        let uniqueBookInfo = deduplicateBooks(bookInfo);

        if (uniqueBookInfo.length > 0) {
            let formattedText = uniqueBookInfo.map(info =>
                `书名: ${info.title}\n作者: ${info.author}\n索书号: ${info.callNumber}\n馆藏地点: ${info.location}`
            ).join("\n\n");
            GM_setClipboard(formattedText);
            alert("在架书籍信息已复制到剪贴板！");
        } else {
            alert("没有可借书籍信息！");
        }
    }

    // Function to create and append the floating button
    function createFloatingButton() {
        let button = document.createElement("button");
        button.textContent = "复制可借书籍信息";
        button.style.position = "fixed";
        button.style.top = "10px";
        button.style.right = "10px";
        button.style.padding = "10px";
        button.style.backgroundColor = "#007bff";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.zIndex = "9999";
        button.addEventListener("click", copyBookInfoToClipboard);
        document.body.appendChild(button);
    }

    // Initialize the script
    createFloatingButton();
})();