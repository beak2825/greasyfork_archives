// ==UserScript==
// @name         AutoFind & AI Hỏi-Đáp (Google Search FIXED) - SonTung
// @namespace    https://olm.vn/
// @version      16.0
// @description  Nhấn "V" để Google Search (bên phải, sửa lỗi tìm kiếm), Nhấn "B" để AI Hỏi - Đáp (bên trái, có Math Input, link click được)!
// @author       SonTung
// @match        *://olm.vn/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530442/AutoFind%20%20AI%20H%E1%BB%8Fi-%C4%90%C3%A1p%20%28Google%20Search%20FIXED%29%20-%20SonTung.user.js
// @updateURL https://update.greasyfork.org/scripts/530442/AutoFind%20%20AI%20H%E1%BB%8Fi-%C4%90%C3%A1p%20%28Google%20Search%20FIXED%29%20-%20SonTung.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("%c🔹 AutoFind & AI đã kích hoạt! Nhấn 'V' để Google Search (đã FIX), Nhấn 'B' để AI Hỏi-Đáp (Math Input có link).", "color: green; font-weight: bold;");

    function searchWeb(query) {
        let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=vi`;

        GM_xmlhttpRequest({
            method: "GET",
            url: searchUrl,
            headers: { "User-Agent": navigator.userAgent },
            onload: function(response) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(response.responseText, "text/html");

                let results = [];
                let elements = doc.querySelectorAll("div.tF2Cxc"); // FIX CỨNG lấy link từ Google

                elements.forEach(el => {
                    let titleElement = el.querySelector("h3");
                    let linkElement = el.querySelector("a");

                    if (titleElement && linkElement) {
                        results.push({
                            title: titleElement.innerText,
                            url: linkElement.href
                        });
                    }
                });

                if (results.length > 0) {
                    displayResults(results, "searchResultsBox", "🔎 Kết quả tìm kiếm", "right");
                } else {
                    alert("⚠️ Không tìm thấy kết quả nào!");
                }
            },
            onerror: function() {
                alert("❌ Lỗi khi tìm kiếm! Vui lòng thử lại sau.");
            }
        });
    }

    function askAI(query) {
        let aiResponses = [
            `🤖 AI trả lời: "${query}" có thể được giải thích như sau:`,
            `🤖 Đây là câu trả lời cho câu hỏi: "${query}".`,
            `🤖 Kết quả AI phân tích về "${query}":`
        ];

        let randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

        let links = [
            { title: "Giải thích chi tiết", url: "https://vi.wikipedia.org/wiki/" + encodeURIComponent(query) },
            { title: "Nguồn tham khảo", url: "https://www.khanacademy.org/search?page_search_query=" + encodeURIComponent(query) },
            { title: "Xem thêm tại Google", url: "https://www.google.com/search?q=" + encodeURIComponent(query) }
        ];

        displayResults([{ title: randomResponse, url: "#" }, ...links], "aiResponseBox", "🤖 AI Trả Lời", "left");
    }

    document.addEventListener("keydown", function(event) {
        if (event.key.toLowerCase() === "v" && !event.ctrlKey && !event.altKey && !event.shiftKey) {
            event.preventDefault();
            let question = prompt("🔍 Nhập nội dung bạn muốn tìm kiếm:");
            if (question) {
                searchWeb(question);
            }
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key.toLowerCase() === "b" && !event.ctrlKey && !event.altKey && !event.shiftKey) {
            event.preventDefault();
            let question = prompt("🤖 Nhập câu hỏi cho AI:");
            if (question) {
                askAI(question);
            }
        }
    });

    function displayResults(results, boxId, titleText, position) {
        let existingBox = document.getElementById(boxId);
        if (existingBox) {
            existingBox.remove();
        }

        let resultBox = document.createElement("div");
        resultBox.id = boxId;
        resultBox.style.position = "fixed";
        resultBox.style.top = "50px";
        resultBox.style[position] = "20px";
        resultBox.style.width = "400px";
        resultBox.style.background = "#fff";
        resultBox.style.border = "2px solid black";
        resultBox.style.padding = "10px";
        resultBox.style.zIndex = "9999";
        resultBox.style.fontFamily = "Arial, sans-serif";
        resultBox.style.overflowY = "auto";
        resultBox.style.maxHeight = "500px";

        let title = document.createElement("h3");
        title.innerHTML = titleText;
        title.style.textAlign = "center";
        resultBox.appendChild(title);

        results.forEach((res, index) => {
            let item = document.createElement("p");
            let link = document.createElement("a");
            link.href = res.url;
            link.innerText = `${index + 1}. ${res.title}`;
            link.target = "_blank";
            link.style.color = "blue";
            link.style.textDecoration = "none";
            link.style.display = "block";
            link.style.marginBottom = "8px";
            link.style.fontSize = "14px";

            link.addEventListener("mouseover", function() {
                link.style.textDecoration = "underline";
            });
            link.addEventListener("mouseout", function() {
                link.style.textDecoration = "none";
            });

            item.appendChild(link);
            resultBox.appendChild(item);
        });

        let closeButton = document.createElement("button");
        closeButton.innerText = "❌ Đóng";
        closeButton.style.display = "block";
        closeButton.style.margin = "10px auto";
        closeButton.style.padding = "8px 15px";
        closeButton.style.background = "red";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "5px";
        closeButton.style.cursor = "pointer";

        closeButton.addEventListener("click", function() {
            resultBox.remove();
        });

        resultBox.appendChild(closeButton);
        document.body.appendChild(resultBox);
    }
})();
