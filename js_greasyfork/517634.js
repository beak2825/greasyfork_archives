// ==UserScript==
// @name         Automatically get name
// @namespace    http://tampermonkey.net/
// @version      2024-11-15
// @description  Get the species name and Latin name
// @author       wokao2333
// @match        https://ppbc.iplant.cn/userspecials/54439/3941
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517634/Automatically%20get%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/517634/Automatically%20get%20name.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert("请不要操作页面，点击确定开始下载")
    let DIV = document.createElement("div");
    DIV.style.position = 'fixed';
    DIV.style.top = '10px';
    DIV.style.left = '20px';
     DIV.style.backgroundColor = 'pink';
    DIV.style.fontSize = '22px';
     DIV.style.fontWeight = '600';
    document.body.appendChild(DIV);
    window.addEventListener('load', function() {
        let title3 = document.querySelector(".title3");
        if (title3) {
            let totalPages = parseInt(title3.innerHTML.match(/\d+/)[0], 10);
            downloadAllPages(parseInt(totalPages/19));
        }
    });

    function downloadAllPages(totalPages) {
        let allNames = [];
        let currentPage = 1;

        function fetchPage() {
            if (currentPage > totalPages) {
                downloadAsWord(allNames);
                return;
            }
            DIV.textContent = `已请求${currentPage}次,请不要操作页面,请求完会自动下载`
            let url = `https://ppbc.iplant.cn/ashx/getuserphotopage.ashx?page=${currentPage}&n=2&group=userspeciallist2&sid=3940&uid=8486BCA5BF54C193`;
            fetch(url)
                .then(response => {
                // 检查响应状态码
                if (response.status === 200) {
                    return response.text();
                } else {
                    throw new Error('Server responded with status: ' + response.status);
                }
            })
                .then(html => {
                if (html.trim() === '') {
                    console.log('无数据');
                    downloadAsWord(allNames);
                    return;
                }

                let parser = new DOMParser();
                let doc = parser.parseFromString(html, "text/html");
                let items = doc.querySelectorAll('.nameall');
                items.forEach(item => {
                    let itemName = item.textContent.trim();
                    if (!allNames.includes(itemName)) {
                        allNames.push(itemName);
                    }
                });
                currentPage++;
                fetchPage();
            })
                .catch(error => {
                console.error('Failed to fetch page:', currentPage, error);
                // 如果发生错误，也下载之前的数据
                downloadAsWord(allNames);
            });
        }


        fetchPage();
    }

    function downloadAsWord(allNames) {
        let content = allNames.join("\n");
        let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "photoName.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("下载完成");
    }
})();
