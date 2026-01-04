// ==UserScript==
// @name         奥维审核助手
// @namespace    https://www.cdzero.cn
// @author       Zero
// @version      1.0.3
// @description  奥维审核助手，审核页面优化，本地计量系统！
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAQhQTFRFAAAAZV74Y13zYlz3Yl33Ylz2ZV34Y133Yl33Zmb/YV32ZV74VVX/Zmb/Zmb/ZF34Y174ZF32ZV33YVv5YGD/ZF33ZFv2Yl77Ylz2ZF72Y174YVz1ZF/6ZF33ZV/5Xl70XFz4Y133ZF31Yl33Zl/4k5D5xMP9jor5iIP52dj9////5eT+z839hoP5amX35+f+aWT3qab7rqv7rar7mpf5lZH5sq/7kI754d/97u3+9fX+jIj5+/r+hYD5+Pj+8PD/o6D7enf3cGv3a2b3dXL3Wlr/Y133Y170ZF/4ZF75Y1z5ZF74ZV72ZF70Ylz3Yl73ZFv2Yl32Yl31ZF34Ylv4VVX/YGD3Y1/7ofrItgAAAFh0Uk5TACYsgplWR11gBTdMCQ8KZohzPyoIezg5U1dsMoyEgS4n1ri9Rq/MrKnc/+XTqJzonLu9vbOwv63i7vWr+6f477ejn52hJcZfl09QkpNcXkEclDRuRgYgO25JM0EAAAFjSURBVHic7dVnU8IwGAfwBxtnFVuGE6tVKNLiAMWBAxe42eP7fxNTWiBpgSR3vEH9v0jv/vf87ppcegX4uwn0I8RmJNSPJAJnEZE5AThPwgUBuEjCJZF3BVmWbYQfy0IOJ2BDsTOdCCSzMnwwKK8qaHxUOeh3IYmhnNsQ8rowD7MTpl0kygujEQqu8TqE1im4wQ83KbjFD1UKqr8bbisxUbij7QLs6bq+LwYPMAHQ8KrHSZgwkvQoXahxW2g+eJgyTdMiXRoXqSMWPD4x7aQHzuoW1ikDZkwniV6RdIssAxrunDGyGAHP3LnzXpFziwsGvHTGrgZ7vO4W+RvWqRp5PHZ7N4C5e1wUHlinitBj1sg8ISLPuHhBPljEa0ns5pQwKQK8vsXexeDH59f3dH2P0wbL/LBMwQo/rFCwWuN1tSoFoc4L6+BJg881vA6gyfqR4yhNvwNotTvy2HTarWHuP5PLD9Z4TTo8zLEwAAAAAElFTkSuQmCC
// @match        http://119.3.232.88:5678/*
// @connect      greasyfork.org
// @run-at       document-body
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473097/%E5%A5%A5%E7%BB%B4%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473097/%E5%A5%A5%E7%BB%B4%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    addBodyCSS();
    // 创建设置按钮
    let state = ['❌ ', '✅ ']
    let imgCarousel = SwitchPrompt("禁止图片轮播", "imgCarousel");
    function SwitchPrompt(name, saveName, initial = 1, click) {
        let Value = GM_getValue(saveName, initial);
        GM_registerMenuCommand(state[Value] + name, () => { SwitchPrompt(name, saveName, initial, true) }, "");
        if (!!click) {
            Value == 1 ? GM_setValue(saveName, 0) : GM_setValue(saveName, 1);
            location.reload();
        }
        return Value;
    }

    // 禁止图片轮播
    let script = document.createElement('script');
    script.innerHTML = `
        const originalSetInterval = window.setInterval;
        window.setInterval = function (callback, delay, ...args) {
            if (callback == "()=>x()") {
                console.log('禁止图片轮播')
                return false;
            }
            const intervalId = originalSetInterval(callback, delay, ...args);
            return intervalId;
        };`;
    script.async = true;
    if (!!imgCarousel) {
        document.head.appendChild(script);
    }

    // 修改页面ico
    function changeFavicon(newIconPath) {
        const link = document.querySelector('link[rel="icon"]') || document.createElement('link');
        link.rel = 'icon';
        link.href = newIconPath;
        document.head.appendChild(link);
    }
    changeFavicon("https://www.avc-mr.com/favicon.ico");

    // 跨域的网络请求
    function GM_XHR({ how, url, data, header }, fun) {
        let headers = {}
        headers["Content-Type"] = "application/json";
        for (let head in header) {
            if (header.hasOwnProperty(head)) {
                headers[head] = header[head];
            }
        }
        GM_xmlhttpRequest({
            method: how,
            url: url,
            data: data,
            headers: header,
            onload: function (data) {
                if (data.readyState == 4) {
                    fun(data);
                }
            }
        })
    }

    // 重写存储器
    function GET_DATA(name) {
        return JSON.parse(localStorage.getItem(name));
    }
    function SET_DATA(name, data) {
        return localStorage.setItem(name, JSON.stringify(data));
    }

    // 格式化当前时间
    function timeRes(type, date = new Date()) {
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let hour = ('0' + date.getHours()).slice(-2);
        let minute = ('0' + date.getMinutes()).slice(-2);
        let second = ('0' + date.getSeconds()).slice(-2);
        let formattedDateTime = year + '-' + month + '-' + day;
        if (type === "hour") {
            formattedDateTime = year + '-' + month + '-' + day + ' ' + hour + ':00:00';
        }
        if (type === "info") {
            formattedDateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        }
        return formattedDateTime;
    }

    //气泡提示
    let BubbleDiv = 0;
    async function Bubble_Msg(a, b, c, div = BubbleDiv) {
        if (!!div) { div.remove(); }
        div = await AddDOM({
            "addNode": document.body,
            "addData": [{
                "name": "div",
                "className": `bubble_center`,
                "add": [{
                    "name": "div",
                    "className": `bubble_msg_main`,
                    "add": [{
                        "name": "div",
                        "className": `bubble_msg_ico`,
                        "innerHTML": a
                    }, {
                        "name": "div",
                        "className": `bubble_msg_text`,
                        "innerHTML": b
                    }]
                }, {
                    "name": "style",
                    "innerHTML": `.bubble_center{
                        animation:fadenum_in ${c}s 1;
                        animation-iteration-count: 1
                    }
                    @keyframes fadenum_in{
                        0%{opacity: 0; top:0px;}
                        ${0.5 / c * 100}%{opacity: 1; top:15px;}
                        ${(c - 1) / c * 100}%{opacity: 1; top:15px;}
                        100%{opacity: 0; top:0px;}
                    }`
                }]
            }]
        }, 0);
        BubbleDiv = div;
        setTimeout(function () {
            div.remove();
        }, (c * 1000) + 500)
        return div;
    }

    // 节点创建函数
    async function AddDOM({ addNode, addData }, first = true) {
        let All = [];
        for await (const dom of addData) {
            const elem = document.createElement(dom.name); //创建元素
            const keys = Object.keys(dom);
            for await (const key of keys) {
                switch (key) {
                    case 'name':
                        break;
                    case 'click':
                        elem.addEventListener("click", dom[key], false);
                        break;
                    case 'function':
                        dom[key](elem);
                        break;
                    default:
                        if (key !== 'add') {
                            elem[key] = dom[key];
                        }
                        break;
                }
            }
            All.push(elem);
            if (!!addNode) {
                addNode.appendChild(elem);
            }
            //循环添加子元素
            if (!!dom.add && dom.add.length > 0) {
                await AddDOM({
                    "addNode": elem,
                    "addData": dom.add
                });
            }
        }
        let outDoc = addNode;
        if (typeof first === "number") {
            outDoc = All[first];
        }
        if (first === "all") {
            outDoc = All;
        }
        return outDoc;
    }

    // 获取Cookie键值
    function getCookie(key) {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith(key + '=')) {
                return cookie.substring(key.length + 1);
            }
        }
        return null; // 如果找不到对应键的值，则返回null
    }

    // 数据看板 /**********************************************************************/
    document.body.addEventListener('DOMNodeInserted', DataBoard);
    async function DataBoard() {
        let sidebar = document.querySelector('.sidebar-container');
        if (!sidebar) {
            return false;
        }
        document.body.removeEventListener('DOMNodeInserted', DataBoard);
        const querySidebar = await AddDOM({
            "addNode": sidebar,
            "addData": [{
                "name": "div",
                "id": "querySidebar",
                "add": [{
                    "name": "div",
                    "innerHTML": "奥维审核助手",
                }, {
                    "name": "div",
                    "id": "formInput",
                    "add": [{
                        "name": "input",
                        "className": "date",
                        "autocomplete": "off",
                        "type": "date",
                        "value": timeRes()
                    }, {
                        "name": "button",
                        "innerHTML": "今天",
                        "className": "today"
                    }, {
                        "name": "button",
                        "innerHTML": "查询",
                        "className": "getdata",
                        "click": () => {
                            document.DataTableLook();
                        }
                    }]
                }, {
                    "name": "table",
                    "id": "doneTable",
                    "add": [{
                        "name": "tr",
                        "add": [{
                            "name": "th",
                            "innerHTML": "类型",
                            "width": "50%"
                        }, {
                            "name": "th",
                            "innerHTML": "完成量",
                            "width": "50%"
                        }]
                    }]
                }]
            }]
        }, 0)
        DataIntercept();
        versionPlug(querySidebar);
        document.DataTableLook(querySidebar.querySelector('#doneTable'));
    }

    // 数组数据大小限制器
    async function arrDataSlicer(data) {
        const maxSize = 4 * 1024 * 1024; // 最大存储限制，单位为字节
        const newData = data.slice(); // 创建数组副本
        const newString = JSON.stringify(newData).length;
        if (newString > maxSize) {
            // 超过存储限制，删除数组第一项
            newData.shift();
            return await arrDataSlicer(newData);
        }
        return newData;
    }

    // 数据拦截器
    function DataIntercept() {
        const open_obj = {
            "clean/video/save": "视频",
            "clean/note/save": "图文",
        };
        // 重写xhr，监听网络请求
        let XMLsend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (data) {
            // 请求的载荷
            const loads = JSON.parse(data);
            if (!!loads) {
                this.addEventListener("load", function () {
                    // 请求的URL
                    const URL = this.responseURL;
                    for (const key in open_obj) {
                        if (new RegExp(key).test(URL)) {
                            // 响应数据
                            const response = JSON.parse(this.responseText);
                            if (response.code === 200) {
                                Processing({
                                    "load": loads,
                                    "type": open_obj[key]
                                });
                            }
                            break;
                        }
                    }
                });
            }
            XMLsend.apply(this, arguments);
        }
        // 处理数据
        async function Processing({ load, type }) {
            const productType = load.productType.length || 0;
            const saveName = "MY_DATA_ALL";
            const user = getCookie('username');
            let Obj = GET_DATA(saveName) || [];
            const nowTime = timeRes("hour");
            let AllData = Obj.find((item) => item.time === nowTime && item.name === user);
            if (!!AllData) {
                let userData = AllData.data.find(({ type: list }) => list == type);
                if (!!userData) {
                    userData.total += 1;
                    userData.label += productType;
                } else {
                    userData = {
                        "type": type,
                        "total": 1,
                        "label": productType
                    }
                    AllData.data.push(userData);
                }
            } else {
                AllData = {
                    "time": nowTime,
                    "name": user,
                    "data": [{
                        "type": type,
                        "total": 1,
                        "label": productType
                    }]
                };
                Obj.push(AllData);
            }
            const saveData = await arrDataSlicer(Obj);
            SET_DATA(saveName, saveData);
            document.DataTableLook();
        }
    }

    // 数据显示
    let outTotal = null;
    document.DataTableLook = async (doneTable) => {
        !doneTable ? "" : outTotal = await AddDOM({
            "addNode": doneTable,
            "addData": [{
                "name": "tr",
                "add": [{
                    "name": "td",
                    "innerHTML": "视频"
                }, {
                    "name": "td",
                    "innerHTML": 0
                }]
            }, {
                "name": "tr",
                "add": [{
                    "name": "td",
                    "innerHTML": "图文"
                }, {
                    "name": "td",
                    "innerHTML": 0
                }]
            }, {
                "name": "tr",
                "id": "totalSumDoc",
                "add": [{
                    "name": "th",
                    "innerHTML": "合计"
                }, {
                    "name": "th",
                    "innerHTML": 0
                }]
            }, {
                "name": "tr",
                "add": [{
                    "name": "td",
                    "innerHTML": "视频标签"
                }, {
                    "name": "td",
                    "innerHTML": 0
                }]
            }, {
                "name": "tr",
                "add": [{
                    "name": "td",
                    "innerHTML": "图文标签"
                }, {
                    "name": "td",
                    "innerHTML": 0
                }]
            }, {
                "name": "tr",
                "id": "labelSumDoc",
                "add": [{
                    "name": "th",
                    "innerHTML": "标签合计"
                }, {
                    "name": "th",
                    "innerHTML": 0
                }]
            }]
        })
        const saveName = "MY_DATA_ALL";
        const objDATA = GET_DATA(saveName) || [];
        const userName = getCookie('username');
        const timeValue = document.querySelector('#formInput .date').value;
        const td1 = outTotal.querySelectorAll('tr td:nth-child(1)');
        const td2 = outTotal.querySelectorAll('tr td:nth-child(2)');
        const totalSum = outTotal.querySelector('#totalSumDoc th:nth-child(2)');
        const labelSum = outTotal.querySelector('#labelSumDoc th:nth-child(2)');
        td1.forEach((key, index) => {
            const typeName = (key.innerHTML).substring(0, 2);
            outData(td2[index]);
            try {
                const dataArr = objDATA
                .filter(obj => {
                    return obj.time.split(' ')[0] === timeValue && obj.name === userName;
                })
                .flatMap(obj => {
                    if (typeof obj.data === "string") {
                        obj.data = JSON.parse(obj.data);
                    }
                    return obj.data.filter(({ type: list }) => list == typeName);
                })
                let outNum = dataArr.reduce((acc, cur) => acc + cur.total, 0);
                if (index > 1) {
                    outNum = dataArr.reduce((acc, cur) => acc + cur.label || 0, 0);
                }
                outData(td2[index], outNum)
                return outNum;
            } catch {
                outData(td2[index], 0)
                return 0;
            }
        })
        function outData(doc, total) {
            if (total === undefined) {
                doc.innerHTML = '查询中...';
                doc.style = '';
                return false;
            }
            doc.total = total;
            doc.innerHTML = total;
            if (total >= 1000) {
                doc.style = `color: #00aa00;font-weight: bold;`;
            }
            totalSum.innerHTML = td2[0].total + td2[1].total;
            labelSum.innerHTML = td2[2].total + td2[3].total;
        }
    }

    // 版本控制器
    const plugUrl = "https://greasyfork.org/zh-CN/scripts/473097-奥维审核助手/code";
    const openUrl = plugUrl + "/奥维审核助手.user.js";
    function versionPlug(MyPlugVer) {
        const version = GM_info.script.version;
        AddDOM({
            "addNode": MyPlugVer,
            "addData": [{
                "name": "div",
                "id": "MyPlugVer",
                "add": [{
                    "name": "span",
                    "innerHTML": `版本：${version}`
                }, {
                    "name": "span",
                    "id": "click",
                    "innerHTML": "初始化",
                    "function": (element) => {
                        clickPlug(element);
                    },
                    "click": (e) => {
                        clickPlug(e.target, true);
                    }
                }, {
                    "name": "a",
                    "href": "https://www.cdzero.cn/",
                    "target": "_blank",
                    "innerHTML": "零零网络"
                }]
            }]
        })
        let loading = null;
        document.myUpVisible = () => {
            if (!!loading) {
                return Bubble_Msg('❌', `新版插件下载中，请稍后...`, 3);
            }
            loading = window.open(openUrl, '_self');
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState == "visible") {
                    location.reload();
                }
            })
        }
        function clickPlug(element, click) {
            if (element.innerHTML === "有更新") {
                return document.myUpVisible();
            }
            if (element.innerHTML === "检测中") {
                return Bubble_Msg('❌', `正在检测中，请稍后...`, 3);
            }
            element.style = "color: red;";
            element.innerHTML = "检测中";
            return updatesPlug(element, click);
        }
        function checkPlug(element, obj, click) {
            const oldVer = Number(version.replace(/[\s.]+/g, ''));
            const newVer = Number(obj.plugver.replace(/[\s.]+/g, ''));
            if (!!obj.plugver && newVer > oldVer) {
                element.innerHTML = "有更新";
                Bubble_Msg('❌', `京东直播助手发现新的版本：${obj.plugver} <a onclick="document.myUpVisible();">更新助手</a>`, 6);
            } else if (!!obj.plugver) {
                element.innerHTML = "最新版";
                element.style = "";
                if (!!click) {
                    Bubble_Msg('✔️', `京东直播助手已经是最新版本！`, 3);
                }
            }
        }
        function updatesPlug(element, click) {
            let CONFIG = GET_DATA('PLUG_CONFIG') || {};
            const toTime = (new Date()).getTime();
            if (!CONFIG.plugver || toTime - CONFIG.plugtime >= 1000 * 60 * 60 * 12 || !!click) {
                GM_XHR({
                    "how": "GET",
                    "url": plugUrl
                }, (xhr) => {
                    const regex = /\/\/\s*@version\s*(\d+\.\d+\.\d+)/g;
                    const newVer = regex.exec(xhr.responseText)[1];
                    if (!!newVer) {
                        CONFIG = GET_DATA('PLUG_CONFIG') || {};
                        CONFIG.plugtime = toTime;
                        CONFIG.plugver = newVer;
                        checkPlug(element, CONFIG, true);
                        CONFIG = SET_DATA('PLUG_CONFIG', CONFIG);
                    } else {
                        Bubble_Msg('❌', `京东直播助手检测更新失败！`, 3);
                        checkPlug(element, '', true);
                    }
                })
            } else {
                checkPlug(element, CONFIG);
            }
        }
    }
})();
function addBodyCSS() {
    GM_addStyle(`
        .hideSidebar #querySidebar {
            display: none;
        }
        #querySidebar {
            position: absolute;
            bottom: 0;
            width: 100%;
            font-size: 14px;
            white-space: nowrap;
            background: #ffffff;
            color: rgba(0,0,0,.65);
            border-radius: 10px 10px 0 0;
            display: flex;
            align-items: center;
            flex-direction: column;
            font-family: "微软雅黑";
        }
        #querySidebar div:nth-child(1){
            height: 26px;
            line-height: 26px;
            font-weight: bold;
        }

        /*输入框*/
        #formInput {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            gap: 5px;
            width: 100%;
        }
        #formInput input {
            width: 60%;
            border-radius: 3px;
            outline: none;
            border: 1px solid #767676;
            color: inherit;
            line-height: 1;
            font-size: inherit;
            font-family: inherit;
        }
        #formInput input:nth-child(2) {
            width: 40%;
            padding-left: 6px;
            padding-right: 6px;
        }
        #formInput input:hover {
            border: 1px solid #40a9ff;
        }
        #formInput input:focus-visible {
            border: 1px solid #ff0000;
        }

        /*按钮*/
        #formInput button {
            background: #6bbbff;
            color: white;
            outline: none;
            border-radius: 3px;
            border: 0 solid #6bbbff;
            transition: all ease-in 0.2s;
            cursor: pointer;
            height: 25px;
            padding: 0 8px;
            width: 20%;
        }
        #formInput button:hover {
            background: #1890ff;
        }
        #formInput button:active {
            transition: all ease-in 0.1s;
            background: #41a4ff;
        }

        /*表格样式*/
        #querySidebar table {
            width: 100%;
            border-spacing: 0;
            text-align: center;
            border-collapse: collapse;
        }
        #querySidebar table th {
            height: 25px;
            font-size: 14.5px;
            background: #6bbbFF;
            color: rgba(0,0,0,0.9);
            border: 0.1px solid #000000;
        }
        #querySidebar table td {
            height: 21px;
            line-height: 20px;
            color: rgba(0,0,0,0.9);
            border: 0.1px solid #000000;
        }
        #querySidebar #doneTable {
            margin-bottom: 5px;
        }

        /*date时间输入框样式*/
        ::-webkit-datetime-edit-year-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-day-field {
            cursor:pointer;
            transition: background-color ease-in 0.2s, color ease-in 0.2s;
        }
        ::-webkit-datetime-edit-year-field:hover,::-webkit-datetime-edit-month-field:hover,::-webkit-datetime-edit-day-field:hover{
            color: #fff;
            background-color:#faad14;
        }
        ::-webkit-calendar-picker-indicator {
            cursor:pointer;
            margin-right: 2px;
            border-radius: 4px;
            transition:background-color ease-in 0.2s;
            background-image: url("data:image/svg+xml;utf8,<svg viewBox='60 64 896 896' xmlns='http://www.w3.org/2000/svg'><path d='M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z' style='fill:hsla(0, 0%, 0%, 0.62)' ></path></svg>");
        }
        ::-webkit-calendar-picker-indicator:hover {
            background-color:#faad14;
            background-image: url("data:image/svg+xml;utf8,<svg viewBox='60 64 896 896' xmlns='http://www.w3.org/2000/svg'><path d='M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z' style='fill:hsl(0, 0%, 100%)' ></path></svg>");
        }

        /*气泡消息*/
        .bubble_center {
            position: fixed;
            display: flex;
            opacity: 0;
            z-index: 2000;
            pointer-events: none;
            font-size: 16px;
            left: 0;
            right: 0;
            align-items: center;
            justify-content: center;
        }
        .bubble_msg_main {
            display: flex;
            background: #ffffff;
            color: #000000;
            padding: 12px 12px;
            text-align: center;
            border-radius: 6px;
            box-shadow: 0 1px 6px rgba(0,0,0,.2);
            line-height: 1;
            pointer-events: auto;
            user-select: text;
        }
        .bubble_msg_ico,
        .bubble_msg_text {
            top: 0;
            bottom: 0;
            margin: auto;
            padding: 0 5px;
        }
        .bubble_msg_text {
            font-size: 16px;
            line-height: 1.2;
        }

        /*插件信息*/
        #MyPlugVer {
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            justify-content: center;
        }
        #MyPlugVer #click {
            cursor: pointer;
            color: green;
        }
        #MyPlugVer a,
        #MyPlugVer span {
            border-radius: 3px;
            padding: 2px 3px;
            line-height: 1;
            transition: 0.2s ease-in-out;
        }
        #MyPlugVer a:hover,
        #MyPlugVer #click:hover {
            background: #1890ff !important;
            color: #fff !important;
        }
        a {
            cursor: pointer !important;
            color: #1890ff !important;
            text-decoration: none !important;
            background-color: transparent !important;
            transition: color .3s !important;
        }
        a:hover {
            color: #40a9ff !important;
        }
        a:active {
            color: #096dd9 !important;
        }
    `)
}