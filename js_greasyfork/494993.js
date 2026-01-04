// ==UserScript==
// @name         不背单词导出excel单词本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  通过不背单词生词本创建单词本
// @author       GuanZi
// @match        https://www.bbdc.cn/newword
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.0/dist/xlsx.full.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494993/%E4%B8%8D%E8%83%8C%E5%8D%95%E8%AF%8D%E5%AF%BC%E5%87%BAexcel%E5%8D%95%E8%AF%8D%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/494993/%E4%B8%8D%E8%83%8C%E5%8D%95%E8%AF%8D%E5%AF%BC%E5%87%BAexcel%E5%8D%95%E8%AF%8D%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let pages = 1;
    let words = [];
    let loadedPages = 0;

    function createUI() {
        const btn = document.createElement('button');
        btn.id = 'export-btn';
        btn.innerText = '导出单词';
        btn.addEventListener('click', downloadWords);
        document.querySelector('.crumb-wrap').appendChild(btn);
        const infotab = document.createElement('div');
        infotab.id = 'info-tab';
        infotab.innerText = ``;
        infotab.style = 'margin: 10px';
        document.querySelector('.crumb-wrap').appendChild(infotab);
    }


    function downloadWords() {
        document.querySelector('#export-btn').innerText = '正在导出...';
        document.querySelector('#export-btn').removeEventListener('click', downloadWords)
        document.querySelector('#export-btn').addEventListener('click', manipulateWords);
        document.querySelector('#export-btn').disabled = true;
        loadWords().then(() => {
            manipulateWords();
            document.querySelector('#info-tab').innerText = `导出完成！`;
            document.querySelector('#export-btn').disabled = false;
            document.querySelector('#export-btn').innerText = '重新导出';
        })
    }

    function loadWords() {
        let promises = [];
        for (let i = 0; i < pages; i++) {
            promises.push(new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `https://www.bbdc.cn/api/user-new-word?page=${i}`);
                xhr.onload = function (e) {
                    const data = JSON.parse(e.target.responseText);
                    for (const item of data.data_body.wordList) {
                        for (const sentence of item.sentenceList) {
                            // 将单词和译文作为一个对象添加到words数组中
                            words.push({
                                word: sentence.word,
                                translation: item.interpret // 假设item.interpret存在
                            });
                        }
                    }
                    console.log(`page ${i + 1} loaded`);
                    loadedPages++;
                    document.querySelector('#info-tab').innerText = `正在加载单词列表...${loadedPages}/${pages}`;
                    resolve();
                }
                xhr.send();
            }));
        }
        return Promise.all(promises); // 等待所有请求都完成
    }


    function manipulateWords() {
        // 创建一个工作簿和工作表
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(words.map(wordObj => ({ 单词: wordObj.word, 释义: wordObj.translation,第1遍:'','1h':'','1d':'','2d':'','6d':'','14d':'','30d':'' })));

        // 设置工作表标题
       // ws['!ref'] = 'A1:B' + (words.length + 1);,
        XLSX.utils.book_append_sheet(wb, ws, "Words");
        ws['!cols'] = [
            { header: 'A', width: 20 }, // 单词列
            { header: 'B', width: 34.67 }, // 释义列
            { header: 'C', width: 5.25},
            { header: 'D', width: 3.58},
            { header: 'E', width: 3.58},
            { header: 'F', width: 3.58},
            { header: 'G', width: 3.58},
            { header: 'H', width: 3.58},
            { header: 'I', width: 3.58},
        ];

        // 生成blob对象并创建URL
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        const url = window.URL.createObjectURL(blob);

        // 创建一个a元素用于下载
        const a = document.createElement('a');
        a.href = url;
        a.download = 'words.xlsx'; // 设置下载的文件名
        document.body.appendChild(a); // 必须添加到DOM中才能触发点击
        a.click(); // 模拟点击来下载文件

        // 清理
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }


    function init() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://www.bbdc.cn/api/user-new-word?page=0`);
            xhr.onload = function (e) {
                // 读取页面数
                let data = JSON.parse(e.target.responseText);
                pages = data.data_body.pageInfo.totalPage;
                // console.log(pages);
                // console.log(data);
                resolve();
            }
            xhr.send();
        });
    }
    init().then(() => {
        createUI();
    });
})();
