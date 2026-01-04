// ==UserScript==
// @name         解析JSON数据
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  解析JSON数据，支持多级解析和删除，支持自定义解析和删除的key，支持自定义解析的key，支持自定义正则解析
// @author       liheji
// @match        http://hawking.dxmxd02-int.com
// @icon         https://www.duxiaoman.com/static/fe-duxiaoman/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://unpkg.com/layui@2.9.18/dist/layui.js
// @resource     layui https://unpkg.com/layui@2.9.18/dist/css/layui.css
// @require      https://unpkg.com/jquery@3.3.1/dist/jquery.min.js
// @require      https://unpkg.com/jquery.json-viewer@1.5.0/json-viewer/jquery.json-viewer.js
// @resource     json-viewer https://unpkg.com/jquery.json-viewer@1.5.0/json-viewer/jquery.json-viewer.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527912/%E8%A7%A3%E6%9E%90JSON%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/527912/%E8%A7%A3%E6%9E%90JSON%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

var jsonCache = new Map();


(function () {
    'use strict';
    GM_addStyle(GM_getResourceText('layui'));
    GM_addStyle(GM_getResourceText('json-viewer'));

    // =======================可修改=======================
    // 每个json默认最大展示的行数
    const defaultMaxRows = 30;
    // 每个json需要删除的key，支持多级删除，例如：a.b.c
    const deleteKeyList = ['IHeader', 'OHeader'];
    // 每个json需要解析的key，支持多级解析，例如：a.b.c，不支持数组解析
    const parseKeyList = ['ral_output', 'ral_input', 'input', 'output'];
    // 字符中需要解析的key 列如 uri[xxx] 或 "cost":xxx 会将xxx解析到输入框中
    const queryRegexList = ['uri', 'server', 'path', 'did', 'logId|logid', 'errno', 'opcode', 'cost|fgate_cost|total_cost', 'userAgent|ua'];
    // 删除包含列表中任意一个字符串的JSON（不展示）
    const filterStrList = ["未取到值_直接打开"]
    // 日志自动选择的配置
    const autoLogIdMap = {
        "319": "654",
        "20003": "200025",
        "89": "168",
        "20087": "200194",
        "20088": "200195",
    }
    // =======================end=======================

    // layui
    const util = layui.util;
    const layer = layui.layer;
    const tree = layui.tree;
    const layuielement = layui.element;
    // 监听的URL
    const listenLogqueryUrl = '/retrieval/retrieval/logquery'
    const listenLogidUrl = '/hawking/log/query';
    // 监听的选择器
    const logquerySelector = '#tableDtl > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr.el-table__row';
    const logidSelector = 'div.el-select-dropdown.el-popper.is-multiple ul.el-select-group__wrap';
    // 初始化临时数据
    var contentHtml = '';
    var contentList = [];
    window.addEventListener('load', (event) => {
        // 保存原始XMLHttpRequest
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        const originalXhrSend = XMLHttpRequest.prototype.send;

        // 重写XMLHttpRequest
        XMLHttpRequest.prototype.open = function (method, url) {
            this._url = url;
            originalXhrOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function () {
            this.addEventListener('load', function () {
                if (this.status >= 200 && this.status < 300) {
                    let data = null;
                    try {
                        data = JSON.parse(this.responseText);
                    } catch (e) {
                    }
                    if (data && this._url.indexOf(listenLogqueryUrl) >= 0) {
                        refreshButton();
                    }
                    if (data && this._url.indexOf(listenLogidUrl) >= 0) {
                        autoSelectLogId();
                    }
                }
            });

            originalXhrSend.apply(this, arguments);
        };

        util.fixbar({
            bars: [{
                type: 'expanded',
                icon: '',
                content: '展',
            }, {
                type: 'fold',
                icon: '',
                content: '折',
            }],
            click: function (type) {
                switch (type) {
                    case 'expanded':
                        document.querySelectorAll(logquerySelector).forEach(row => {
                            if (row.querySelector('.el-table__expand-icon--expanded')) {
                                return;
                            }
                            row.querySelector('.el-table__expand-icon').click();
                        })
                        break;
                    case 'fold':
                        document.querySelectorAll(logquerySelector).forEach(row => {
                            if (row.querySelector('.el-table__expand-icon--expanded')) {
                                row.querySelector('.el-table__expand-icon').click();
                            }
                        })
                        break;
                }
            }
        });
    });

    /**
     * 刷新按钮
     */
    function refreshButton() {
        // 获取所有行
        const rows = document.querySelectorAll(logquerySelector);
        // 遍历每一行
        rows.forEach(row => {
            // 如果已经添加过按钮则不再添加
            if (row.querySelector('.hover-button')) {
                return;
            }

            // 如果没有json数据则不添加
            if (findAllNestedJsonInString(row.cells[4].innerText).length <= 0) {
                return;
            }

            // 创建解析按钮
            const button = document.createElement('button');
            button.innerHTML = '解析';
            button.className = 'hover-button layui-btn layui-btn-sm layui-btn-normal'; // 指定类名
            button.style.position = 'absolute';
            button.style.left = '20px';
            // // 获取第一个td并添加按钮
            row.cells[1].appendChild(button);
            // 点击按钮显示第三个td的数据
            button.addEventListener('click', () => {
                clickButton(row);
            });
        });
    }

    /**
     * 自动选择日志ID
     */
    function autoSelectLogId() {
        setTimeout(() => {
            const groupWarpList = document.querySelectorAll(logidSelector);
            for (let i = 0; i < groupWarpList.length; i++) {
                const groupWarp = groupWarpList[i];
                const modId = groupWarp.querySelector("li.el-select-group__title")?.innerText?.replace("模块ID:", "");
                const setId = autoLogIdMap[modId];
                if (setId) {
                    groupWarp.querySelectorAll("li.el-select-dropdown__item")
                        .forEach((item) => {
                            if (item.innerText.indexOf("logid " + setId) >= 0 && !item.classList.contains("selected")) {
                                item.click();
                            }
                        })
                }
            }
        }, 200);
    }

    /**
     * 点击按钮解析该行数据
     *
     * @param row
     */
    function clickButton(row) {
        const data = row.cells[4].innerText;
        // 获取调用栈
        const treeItem = { title: '调用堆栈', spread: true, children: [] };
        const value = matchValue(data, 'callStack');
        if (value && value.trim().length > 0) {
            var strs = value.split(">");
            for (var i = 0; i < strs.length; i++) {
                const it = strs[i];
                if (it.trim().length <= 0 || it.indexOf("runtime") >= 0) {
                    continue;
                }
                treeItem.children.push({
                    id: strs[i],
                    title: strs[i]
                })
            }
        }

        // 解析JSON数据
        contentHtml = '';
        contentList = [];
        findAllNestedJsonInString(data).forEach(jsonData => {
            try {
                parseKeyList.forEach(key => {
                    parseDeepJSON(jsonData, key);
                })
                deleteKeyList.forEach(key => {
                    deleteDeepJSON(jsonData, key);
                })
                let jsonResStr = JSON.stringify(jsonData, null, 6);
                let lineCount = jsonResStr.split('\n').length;
                if (lineCount > defaultMaxRows) {
                    lineCount = defaultMaxRows;
                }
                contentList.push([jsonData, jsonResStr]);

                // 堆栈信息
                var tabHeader = "";
                var tabItem = "";
                if (treeItem.children.length > 0) {
                    tabHeader = '<li lay-id="stack">调用栈</li>';
                    tabItem = '<div id="callStack" class="layui-tab-item"></div>'
                }
                contentHtml += `<div class="layui-tab layui-tab-brief" lay-filter="${Math.random().toString(36).substring(2)}" style="margin:20px;"><ul class=layui-tab-title><li class="layui-this" lay-id="view">视图</li><li lay-id="data">原始</li>${tabHeader}</ul><div class="layui-tab-content"><div class="layui-tab-item layui-show"><pre class="layui-textarea" style="height:${lineCount * 20 + 30}px;overflow-y:scroll;resize:none;"></pre></div><div class="layui-tab-item"><textarea class="layui-textarea" rows=${lineCount}></textarea></div>${tabItem}</div></div>`;
            } catch (e) {
                console.error(e);
            }
        });

        if (contentList.length <= 0) {
            layer.msg('没有JSON数据');
            return;
        }

        // 解析queryRegexList
        const formList = [];
        queryRegexList.forEach(key => {
            const skList = key.split('|');
            for (let i = 0; i < skList.length; i++) {
                const value = matchValue(data, skList[i]);
                if (value) {
                    formList.push([skList[i], value]);
                    break
                }
            }
        });

        let formStr = '';
        for (let i = 0; i < formList.length; i += 3) {
            let tmpStr = `<div class="layui-col-xs4"><label class="layui-form-label">${formList[i][0]}</label><div class="layui-input-block"><input type="text" autocomplete="off" class="layui-input" value="${formList[i][1]}"></div></div>`;
            if (formList[i + 1]) {
                tmpStr += `<div class="layui-col-xs4"><label class="layui-form-label">${formList[i + 1][0]}</label><div class="layui-input-block"><input type="text" autocomplete="off" class="layui-input" value="${formList[i + 1][1]}"></div></div>`;
            }
            if (formList[i + 2]) {
                tmpStr += `<div class="layui-col-xs4"><label class="layui-form-label">${formList[i + 2][0]}</label><div class="layui-input-block"><input type="text" autocomplete="off" class="layui-input" value="${formList[i + 2][1]}"></div></div>`;
            }
            formStr += `<div class="layui-row layui-col-space16">${tmpStr}</div>`;
        }
        if (formStr.trim() !== '') {
            contentHtml = `<form class="layui-form layui-form-pane" style="margin: 20px;">${formStr}</form>${contentHtml}`;
        }

        // 弹出解析结果
        layer.open({
            type: 1,
            area: ['80%', '95%'],
            title: '解析结果',
            shade: 0.6,
            shadeClose: true,
            maxmin: false,
            closeBtn: false,
            anim: 0,
            content: contentHtml,
            success: function (layero, index, that) {
                // 为每一个textarea赋值
                const pres = document.querySelectorAll(`${layero.selector}  pre`);
                const textareas = document.querySelectorAll(`${layero.selector}  textarea`);
                for (var i = 0; i < textareas.length; i++) {
                    renderJson(contentList[i][0], pres[i])
                    textareas[i].value = contentList[i][1];
                }
                const closeOnEsc = function (e) {
                    if (e.key === 'Escape') {
                        layer.close(index);
                        document.removeEventListener('keydown', closeOnEsc); // 移除事件监听
                    }
                };
                document.addEventListener('keydown', closeOnEsc); // 添加事件监听

                let textareaE = document.getElementsByClassName("layui-input");
                if (textareaE.length > 0) {
                    textareaE[textareaE.length - 1].focus();
                }

                // 渲染堆栈卡片
                renderStack(treeItem);

                // 添加鼠标事件
                addMounseEventListener();
            }
        });
    }

    /**
     * 渲染JSON
     * 
     * @param {*} jsonObj 
     * @param {*} element 
     */
    function renderJson(jsonObj, element) {
        var options = {
            collapsed: false,
            rootCollapsable: false,
            withQuotes: false,
            withLinks: true
        };
        $(element).jsonViewer(jsonObj, options);
    }

    /**
     * 渲染调用栈信息
     * 
     * @param {*} treeItemt 
     */
    function renderStack(treeItem) {
        // 堆栈调用信息
        if (treeItem.children.length > 0) {
            tree.render({
                elem: '#callStack',
                data: [treeItem],
                onlyIconControl: true,
                id: 'stackTree',
                click: function (obj) {
                    clipboard(obj.data.title)
                        .then(() => { layer.msg("文本已复制") })
                        .catch((err) => { layer.msg(err) });
                }
            });
        }
    }

    /**
     * 添加鼠标和按键事件，复制json数据
     * 
     * @param {*} jsonObj 
     * @param {*} element 
     */
    function addMounseEventListener() {
        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener('mousemove', function (event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        document.addEventListener('keydown', function (event) {
            // 如果有选中的文本，退出函数
            if (window.getSelection && window.getSelection().toString()) {
                return;
            }

            var element = null
            if (isFinite(mouseX) && isFinite(mouseY)) {
                // 获取鼠标所在位置的元素
                var element = document.elementFromPoint(mouseX, mouseY);
                while (element) {
                    if (element.classList && element.classList.contains('layui-tab-item')) {
                        break;
                    }
                    element = element.parentElement;
                }
                // 找到其父元素
                if (element) {
                    element = element.parentElement
                }
            }
            if (element && (event.ctrlKey || event.metaKey) && event.key === 'c') {
                const textarea = element.querySelector("textarea");
                clipboard(textarea.value)
                    .then(() => { layer.msg("JSON已复制") })
                    .catch((err) => { layer.msg(err) });
            } else if (element && element.parentElement && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
                const parent = element.parentElement;
                const filter = parent.getAttribute("lay-filter");

                let curLayid = 0
                let layIdList = [];
                parent.querySelectorAll(".layui-tab-title>li")
                    .forEach((li) => {
                        if (li.classList.contains("layui-this")) {
                            curLayid = layIdList.length;
                        }
                        layIdList.push(li.getAttribute("lay-id"))
                    })

                let nextLayId = '';
                if (event.key === 'ArrowLeft') {
                    nextLayId = layIdList[(curLayid - 1 + layIdList.length) % layIdList.length]
                } else {
                    nextLayId = layIdList[(curLayid + 1) % layIdList.length]
                }
                layuielement.tabChange(filter, nextLayId);
            }
        });
    }

    /**
     * 正则匹配
     *
     * @param data 匹配数据
     * @param re 正则表达式
     * @param num 匹配的第几个
     * @returns {*|null}
     */
    function regexMatch(data, re, num = 2) {
        let match = null;
        if ((match = new RegExp(re).exec(data)) !== null
            && match.length >= num
            && match[num - 1].length > 0) {
            return match[num - 1];
        }
        return null;
    }

    /**
     * 根据key，正则获取对应的value
     *
     * @param data 匹配数据
     * @param key 匹配数据
     * @returns {string|false}
     */
    function matchValue(data, key) {
        // 第一种方式，form
        let match = regexMatch(data, `${key}\\[(.*?)\\]`);
        if (match != null) {
            return match;
        }
        // 另一种方式，json 带引号
        match = regexMatch(data, `\\"${key}\\":\\s*\\"(.*?)\\"`);
        if (match != null) {
            return match;
        }
        // 另一种方式，json 不带引号
        match = regexMatch(data, `\\"${key}\\":\\s*([\\w_\\-.]*)`);
        if (match != null) {
            return match;
        }
        return false;
    }

    /**
     * 删除深层JSON
     *
     * @param obj
     * @param keyPath
     */
    function deleteDeepJSON(obj, keyPath) {
        const keys = keyPath.split('.');
        keys.reduce((acc, key, index) => {
            if (acc && acc.hasOwnProperty(key)) {
                if (index === keys.length - 1) {
                    delete acc[key];
                }
                return acc[key];
            }
            return undefined;
        }, obj);
    }

    /**
     * 解析深层JSON
     *
     * @param obj
     * @param keyPath
     */
    function parseDeepJSON(obj, keyPath) {
        const keys = keyPath.split('.');
        keys.reduce((acc, key, index) => {
            if (acc && acc.hasOwnProperty(key)) {
                if (index === (keys.length - 1) && typeof acc[key] === 'string') {
                    try {
                        acc[key] = JSON.parse(acc[key]);
                    } catch (e) {
                    }
                }
                return acc[key];
            }
            return undefined;
        }, obj);
    }

    /**
     * 过滤掉不需要的JSON
     * @param {*} jsonStr 
     * @returns {boolean}
     */
    function isNeedJSON(jsonStr) {
        for (let j = 0; j < filterStrList.length; j++) {
            if (jsonStr.indexOf(filterStrList[j]) >= 0) {
                return false;
            }
        }
        return true
    }

    /**
     * 查找字符串中的所有JSON对象
     * @param s
     * @returns {*[]}
     */
    function findAllNestedJsonInString(s) {
        const jsonObjects = [];

        var hash = s.slice(0, 100) + s.length;
        if (jsonCache.has(hash)) {
            return jsonCache[hash];
        }

        let start = null;
        let last = null;
        let stack = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (c === '{') {
                if (stack === 0) {
                    start = i;
                }
                stack += 1;
            } else if (c === '}') {
                last = i + 1;
                stack -= 1;
                if (stack === 0 && start !== null) {
                    var jsonStr = s.slice(start, last);
                    if (isNeedJSON(jsonStr)) {
                        try {
                            const jsonData = JSON.parse(jsonStr);
                            jsonObjects.push(jsonData);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    start = null; // Reset start for the next JSON object
                }
            }
        }
        // 兼容字符串中存在错误JSON字符串
        if (stack > 0 && start !== null) {
            var jsonStr = s.slice(start, last);
            if (isNeedJSON(jsonStr)) {
                try {
                    const jsonData = JSON.parse(jsonStr);
                    jsonObjects.push(jsonData);
                } catch (e) {
                    console.error(e);
                }
            }
        }
        jsonCache[hash] = jsonObjects;

        return jsonObjects;
    }

    /**
     * 复制文本到剪贴板
     * 
     * @param {*} text 
     */
    function clipboard(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard) {
                // 使用 Clipboard API
                navigator.clipboard.writeText(text)
                    .then(() => { resolve() })
                    .catch((error) => { reject(error) });
            } else {
                // 旧方法，使用 textarea 模拟复制
                var textarea = document.createElement("textarea");
                document.body.appendChild(textarea);
                textarea.value = text;
                textarea.select();
                const success = document.execCommand("Copy");
                document.body.removeChild(textarea);
                if (success) {
                    resolve();
                } else {
                    reject('复制失败');
                }
            }
        });
    }
})();