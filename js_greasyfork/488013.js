// ==UserScript==
// @name         不背单词生词本单词+词义导出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不背单词生词本导出，导出为txt文件，由https://greasyfork.org/zh-CN/scripts/474142-不背单词生词本导出 修改而来
// @author       lhish
// @match        https://www.bbdc.cn/newword
// @namespace    https://github.com/lhish/Vocabulary-Export
// @supportURL   https://github.com/lhish/Vocabulary-Export/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bbdc.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488013/%E4%B8%8D%E8%83%8C%E5%8D%95%E8%AF%8D%E7%94%9F%E8%AF%8D%E6%9C%AC%E5%8D%95%E8%AF%8D%2B%E8%AF%8D%E4%B9%89%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/488013/%E4%B8%8D%E8%83%8C%E5%8D%95%E8%AF%8D%E7%94%9F%E8%AF%8D%E6%9C%AC%E5%8D%95%E8%AF%8D%2B%E8%AF%8D%E4%B9%89%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    let pages = 1;
    let words = [];
    let loadedPages = 0;
 
    function createUI() {
        const btn = document.createElement('button');
        btn.id = 'export-btn';
        btn.innerText = '导出单词为txt';
        btn.addEventListener('click', downloadWords);
        document.querySelector('.crumb-wrap').appendChild(btn);
        const infotab = document.createElement('div');
        infotab.id = 'info-tab';
        infotab.innerText = ``;
        infotab.style = 'margin: 10px';
        document.querySelector('.crumb-wrap').appendChild(infotab);
 
        const options = [
            { id: 'random-checkbox', text: '随机打乱', checked: false },
            { id: 'order-checkbox', text: '按顺序排列', checked: false },
            { id: 'phrase-checkbox', text: '去除词组', checked: true },
            { id: 'unique-checkbox', text: '去重', checked: true }
        ];
 
        options.forEach(option => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = option.id;
            checkbox.checked = option.checked;
            checkbox.style = 'margin: 10px';
 
            const label = document.createElement('label');
            label.htmlFor = option.id;
            label.appendChild(document.createTextNode(option.text));
 
            document.querySelector('.crumb-wrap').appendChild(checkbox);
            document.querySelector('.crumb-wrap').appendChild(label);
        });
    }
 
    function downloadWords() {
        document.querySelector('#export-btn').innerText = '正在导出...';
        document.querySelector('#export-btn').removeEventListener('click', downloadWords)
        document.querySelector('#export-btn').addEventListener('click', manipulateWords);
        document.querySelector('#export-btn').disabled = true;
        loadWords().then(() => {
            manipulateWords();
            document.querySelector('#info-tab').innerText = `导出完成！可以重新勾选选项设置导出格式！`;
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
                    for (var item of data.data_body.wordList) {
                        var word1=[]
                        for (const sentence of item.sentenceList) {
                            word1.push(sentence.word);
                        }
                        console.log(item.interpret.replace("\n", " "));
                        word1.push(item.interpret.replace("\n", " ").replace("\n", " ").replace("\n", " ").replace("\n", " ").replace("\n", " ").replace("\n", " "));
                        words.push(word1);
                        console.log(words);
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
        const cfg = {
            random: document.querySelector('#random-checkbox').checked,
            order: document.querySelector('#order-checkbox').checked,
            phrase: document.querySelector('#phrase-checkbox').checked,
            unique: document.querySelector('#unique-checkbox').checked,
        }
        if (cfg.random && cfg.order) {
            alert('随机打乱和按顺序排列不能同时选择!');
            return;
        }
        if (cfg.random) {
            words.sort(() => Math.random() - 0.5);
        }
        if (cfg.order) {
            words.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        }
        if (cfg.phrase) {
            words = words.filter(word => !word.includes(' '));
        }
        if (cfg.unique) {
            words = [...new Set(words)];
        }
        const txt = words.join('\n');
        const blob = new Blob([txt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `words.txt`;
        a.click();
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
