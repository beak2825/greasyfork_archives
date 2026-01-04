// ==UserScript==
// @name         巨量算数
// @description  巨量算数辅助工具
// @namespace    https://gitee.com/strategytechnology/tappermonkey
// @license      MIT
// @version      1.2.1
// @author       Andy Zhou
// @match        https://trendinsight.oceanengine.com/*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/kyhgpdeh7nuvanuhd/count/trendinsight.ico
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/xlsx/0.18.2/xlsx.mini.min.js
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/468639/%E5%B7%A8%E9%87%8F%E7%AE%97%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/468639/%E5%B7%A8%E9%87%8F%E7%AE%97%E6%95%B0.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var currentTopicList = []

    var currentTopicParam = {}

    const queryTopicUrl = "https://trendinsight.oceanengine.com/api/open/index/query_topic";

    const headerNames = ["搜索词", "话题", "话题指数", "投稿量", "点赞量", "播放量", "分级", "参考互动率", "互动率差值", "参考播放量", "播放量差值"];

    const nativeSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', function () {
            if (this.responseURL.startsWith(queryTopicUrl)) {
                const result = JSON.parse(this.responseText)
                currentTopicList = result.data.topic_list
                currentTopicParam = JSON.parse(this._data).param
                addExportButton();
            }
        });
        nativeSend.apply(this, arguments);
    };
    function addExportButton() {
        if (document.getElementById('topic-export-button')) {
            return;
        }
        //导出当前话题按钮
        const newElement = document.createElement("span");
        newElement.id = "topic-export-button";
        newElement.className = "cursor-pointer";
        newElement.style = "display: flex;justify-content: center;align-items: center;margin-right: 12px;width: 108px;";
        newElement.innerHTML = `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDYuNjY2NjlMOCAxMC4zMzM0TDQgNi42NjY2OSIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuMzMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOCAzVjEwLjEwNDIiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjMzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTQgMTNIMTIiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjMzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==" class="relative ml-24 mr-8"><span class="font-normal">导出话题</span>`
        const parentElement = document.getElementsByClassName("index-module__selectors--B6NNf")[0];
        parentElement.insertBefore(newElement, parentElement.firstChild);
        newElement.addEventListener("click", () => {
            var searchTopic = new URLSearchParams(location.search).get('topic');
            const datas = getExportDatas(searchTopic, currentTopicList);
            saveExcel(datas, searchTopic);
        });
        //批量导出按钮
        const batchExportButton = document.createElement("div");
        batchExportButton.style = "border-radius: 4px;margin-left: 20px;background-color: #338aff;color: #fff;cursor: pointer;line-height: 42px;text-align: center;width: 100px;";
        batchExportButton.textContent = "批量导出";
        const batchParentElement = document.getElementsByClassName("index-module__searchForm--IwDnY")[0];
        batchExportButton.addEventListener("click", createBatchExportFrom);
        batchParentElement.appendChild(batchExportButton);
    }

    const dialogId = 'export-topic-dialog';
    const inputId = 'export-topic-input';
    const loadingId = 'export-topic-loading';
    //创建批量导出的表单
    function createBatchExportFrom() {
        const dialog = document.createElement('div');
        dialog.id = dialogId;
        dialog.className = 'byted-modal-wrapper';
        //遮罩
        const maskNode = document.createElement('div');
        maskNode.className = "byted-modal-mask byted-modal-mask-show";
        dialog.appendChild(maskNode);

        //内容
        const bodyNode = document.createElement('div');
        bodyNode.className = "byted-modal-body byted-modal-body-no-top";

        const contentNode = document.createElement('div');
        contentNode.className = "byted-content-container byted-modal-content-container byted-modal byted-modal-size-sm byted-modal-show";
        contentNode.style = "align-items: center;background-color: #f7f7f7;border-radius: 12px; margin-top: 24px;padding: 40px 40px 45px;position: relative;width: 600px;";
        bodyNode.appendChild(contentNode);

        //输入框
        const textarea = document.createElement('textarea');
        textarea.id = inputId;
        textarea.className = "byted-text byted-text byted-text-enabled byted-text byted-text byted-text byted-text index-module__textArea--uQ995";
        textarea.placeholder = "请输入需要导出的话题词，每个话题各占一行，可直接粘贴多行文本";
        textarea.setAttribute("rows", 10);
        contentNode.appendChild(textarea);

        //提交按钮
        const submitButton = document.createElement("button");
        submitButton.style = "align-items: center; background: #0d5fff;border-radius: 6px;color: #fff;cursor: pointer;display: flex;font-size: 18px;height: 46px;justify-content: center;line-height: 30px;margin-top: 25px;padding: 10px 20px;width: 100px;";
        submitButton.textContent = "提交";
        submitButton.addEventListener("click", batchExportTopics);
        contentNode.appendChild(submitButton);

        //关闭按钮
        const cancelButton = document.createElement("span");
        cancelButton.style = "color: #333;cursor: pointer;font-size: 20px;left: unset;position: absolute;right: 15px;top: 15px;";
        cancelButton.innerHTML = `<svg width="18px" height="18px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="4" fill="none" fill-rule="evenodd"><g><path d="M14,14 L34,34" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14,34 L34,14" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></g></g></svg>`
        cancelButton.addEventListener("click", () => { document.getElementById(dialogId).remove(); });
        contentNode.appendChild(cancelButton);

        dialog.appendChild(bodyNode);

        //loading
        const loading = document.createElement('div');
        loading.id = loadingId;
        loading.style = "display: none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: hsla(0,0%,100%,.7);z-index: 9999;";
        const loadingSpinner = document.createElement("div");
        loadingSpinner.style = "pointer-events: auto; position: absolute; z-index: 2; left: 50%; transform: translate(-50%, -50%); top: 50%;";
        loadingSpinner.innerHTML = `<div class="byted-loading-wrapper byted-loading-wrapper-label-position-below byted-loading-wrapper-size-md byted-loading-wrapper-show"><span class="byted-icon byted-icon-loading byted-loading-icon"><svg width="30px" height="30px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-icon="spin"><defs><linearGradient x1="0%" y1="100%" x2="100%" y2="100%" id="linearGradient-4"><stop stop-color="currentColor" stop-opacity="0" offset="0%"></stop><stop stop-color="currentColor" stop-opacity="0.50" offset="39.9430698%"></stop><stop stop-color="currentColor" offset="100%"></stop></linearGradient></defs><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect fill-opacity="0.01" fill="none" x="0" y="0" width="36" height="36"></rect><path d="M34,18 C34,9.163444 26.836556,2 18,2 C11.6597233,2 6.18078805,5.68784135 3.59122325,11.0354951" stroke="url(#linearGradient-4)" stroke-width="4" stroke-linecap="round"></path></g></svg></span></div>`;
        loading.appendChild(loadingSpinner);
        const loadingText = document.createElement("div");
        loadingText.style = "position: relative; text-align: center;top: 50%;font-size: 18px;margin-top: 30px;";
        loadingText.textContent = "正在导出中，请稍后...";
        loading.appendChild(loadingText);
        dialog.appendChild(loading);

        document.body.appendChild(dialog);
    }

    //批量导出话题
    async function batchExportTopics() {
        const inputText = document.getElementById(inputId).value;
        if (!inputText) {
            return alert('导出话题不能为空');
        }
        document.getElementById(loadingId).style.display = 'block';

        const topics = inputText.split('\n');
        let allDatas = [];
        for (const topic of topics) {
            if (!topic) {
                continue;
            }
            await unsafeWindow.fetch(queryTopicUrl, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ param: { ...currentTopicParam, keyword: topic.trim() } })
            }).then(response => response.json())
                .then(result => {
                    console.log('Success:', result);
                    getExportDatas(topic, result?.data?.topic_list).forEach(data => {
                        allDatas.push(data);
                    });
                }).catch((error) => { console.error('Error:', error); });
            //每获取完一个话题暂停1秒
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        const fileName = topics.join('_').replace(/[\\/:\*\?"<>\|]/g, '').substr(0, 20);
        saveExcel(allDatas, fileName);
        document.getElementById(dialogId).remove();
    }
    function getExportDatas(searchTopic, topicList) {
        if (!topicList || topicList.length === 0) {
            return [];
        }
        const getInteractionRate = (data) => {
            const digg_cnt = parseInt(data.digg_cnt);
            const play_read_cnt = parseInt(data.play_read_cnt);
            if (!digg_cnt || !play_read_cnt) {
                return 0;
            }
            return digg_cnt / 0.95 / play_read_cnt * 100;
        };
        const getPlayCount = (data) => {
            return parseInt(data.play_read_cnt) || 0;
        };
        let tmpList = topicList.length <= 2 ? topicList : topicList.slice(1, -1);
        const originX = tmpList.map(item => getInteractionRate(item)).reduce((a, b) => a + b) / tmpList.length;
        const originY = tmpList.map(item => getPlayCount(item)).reduce((a, b) => a + b) / tmpList.length;
        return topicList.map(function (row) {
            const point = { x: getInteractionRate(row), y: getPlayCount(row) }
            let level;
            if (point.x >= originX && point.y >= originY) {
                level = "S";
            } else if (point.x >= originX && point.y < originY) {
                level = "A";
            } else if (point.x < originX && point.y >= originY) {
                level = "B";
            } else {
                level = "C";
            }
            return [searchTopic, row.topic_name, row.topic_index, row.item_cnt, row.digg_cnt, row.play_read_cnt, level, originX.toFixed(2) + "%", (point.x - originX).toFixed(2) + "%", originY, parseInt(point.y - originY)];
        });
    }

    //保存excel
    function saveExcel(datas, fileName) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headerNames, ...datas]);
        XLSX.utils.book_append_sheet(wb, ws, currentTopicParam.start_date + "-" + currentTopicParam.end_date);
        XLSX.writeFile(wb, fileName + ".xlsx");
    }
})();