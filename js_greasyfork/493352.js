// ==UserScript==
// @name         Eudic Study List CSV Exporter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Export Eudic study list to CSV
// @author       OKayOkay
// @match        https://my.eudic.net/studylist
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/493352/Eudic%20Study%20List%20CSV%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/493352/Eudic%20Study%20List%20CSV%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成后执行
    window.addEventListener('load', function() {
        // 创建按钮
        var button = document.createElement('button');
        button.textContent = 'Export to CSV';
        button.style.marginLeft = '10px';

        // 找到要插入按钮的位置
        var wordsNumberSpan = document.querySelector('.wordsNumber');
        var parentElement = wordsNumberSpan.parentElement;
        parentElement.appendChild(button);

        // 为按钮添加点击事件监听器
        button.addEventListener('click', function() {
            // 构建CSV数据
            var wordBoxElements = Array.from(document.getElementsByClassName("wordBox"));
            var phonBoxElements = Array.from(document.getElementsByClassName("phonBox"));
            var expBoxElements = Array.from(document.getElementsByClassName("expBox"));

            if (wordBoxElements.length === phonBoxElements.length && wordBoxElements.length === expBoxElements.length) {
                var csvData = [];
                for (var i = 1; i < wordBoxElements.length; i++) {
                    csvData.push([
                        wordBoxElements[i].textContent.replace(/,/g,"，"),
                        phonBoxElements[i].textContent.replace(/,/g,"，"),
                        expBoxElements[i].textContent.replace(/,/g,"，")
                    ]);
                }

                // 将数据转换为CSV格式
                var csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent("\uFEFF" + csvData.map(e => e.join(",")).join("\n"));

                // 触发下载
                var link = document.createElement("a");
                link.setAttribute("href", csvContent);
                link.setAttribute("download", "word_list.csv");
                document.body.appendChild(link); // Required for FF

                link.click();
                document.body.removeChild(link);
            } else {
                console.error("The lengths of the lists do not match.");
            }
        });
    }, false);
})();
