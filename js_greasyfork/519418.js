// ==UserScript==
// @name         b站直播数据抓取助手(支持弹幕、礼物流水导出统计)
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  打开直播页面自动开始抓取数据,目前支持数据有：弹幕、SC、礼物、舰队、点赞总数、看过人数、粉丝数量变化!
// @author       口吃者
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519418/b%E7%AB%99%E7%9B%B4%E6%92%AD%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96%E5%8A%A9%E6%89%8B%28%E6%94%AF%E6%8C%81%E5%BC%B9%E5%B9%95%E3%80%81%E7%A4%BC%E7%89%A9%E6%B5%81%E6%B0%B4%E5%AF%BC%E5%87%BA%E7%BB%9F%E8%AE%A1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519418/b%E7%AB%99%E7%9B%B4%E6%92%AD%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96%E5%8A%A9%E6%89%8B%28%E6%94%AF%E6%8C%81%E5%BC%B9%E5%B9%95%E3%80%81%E7%A4%BC%E7%89%A9%E6%B5%81%E6%B0%B4%E5%AF%BC%E5%87%BA%E7%BB%9F%E8%AE%A1%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    class Node {
        constructor(data) {
            this.data = data;
            this.next = null;
        }
    }
    class HighPerformanceTableData {
        constructor() {
            this.head = null;  // 指向链表的头节点
            this.size = 0;     // 记录链表中的元素数量
        }

        // 从头部快速添加一个新元素
        addFirst(element) {
            const newNode = new Node(element);
            newNode.next = this.head;
            this.head = newNode;
            this.size++;
        }

        // 将链表中的所有元素转换成数组
        toArray() {
            const result = [];
            let current = this.head;
            while (current) {
                result.push(current.data);
                current = current.next;
            }
            return result;
        }

        // 获取容器大小
        getSize() {
            return this.size;
        }

        // 打印链表中的元素（可选）
        print() {
            let str = "";
            let current = this.head;
            while (current) {
                str += JSON.stringify(current.data) + " ";
                current = current.next;
            }
            console.log(str.trim());
        }
    }
    layuiLoad();
    var wssSubUrl = 'wss://zj-cn-live-comet.chat.bilibili.com:2245/sub'
    var originalWebSocket = WebSocket;
    var wsSub;
    var guardLvMapped = { 0: "无", 1: "总督", 2: "提督", 3: "舰长" };
    var wsSubTable01Data = new HighPerformanceTableData();
    var wsSubTable02Data = new HighPerformanceTableData();
    var wsSubData03 = {fans:-1, watchedChange:-1, clickCount:-1, fansDate:-1, watchedChangeDate:-1, clickCountDate:-1};
    HookedWebSocket.prototype = originalWebSocket.prototype;
    unsafeWindow.WebSocket = HookedWebSocket;
    window.addEventListener('load', getLiveData)
    window.addEventListener('load', addPanel)

    var cssText = `
    #MyButton {
        color: #592A0E;
        background: #fff;
        border: none;
        padding: 10px 20px;
        display: inline-block;
        font-size: 11px;
        font-weight: 400;
        width: 70x;
        text-transform: uppercase;
        cursor: pointer;
        position: fixed;
        top: 50%;
        left: -40px;
        z-index: 1000;
        transition: all 0.7s;
    }

    #MyButton span {
        display: inline-block;
    }

    #MyButton::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 100%;
        background-image: linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%);
        opacity: 0;
        z-index: -1;
        transition: all 0.7s;
        backface-visibility: hidden;
    }

    #MyButton:hover {
        overflow: hidden;
        left: -10px;
        color: #fff;
        transition: all 0.7s;
    }

    #MyButton:hover::before {
        left: 0;
        right: 0;
        opacity: 1;
    }

    #MyButton:active {
        letter-spacing: 1.5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: 100ms;
    }

    #MyButton:active::before {
        background-image: linear-gradient(to right, #e06a6a 0%, #e06d6d 0%, #e07373 21%, #d27878 52%, #ae4c4c 78%, #902525 100%);
        opacity: 1;
    }
    #tableBtnContainer{
        text-align: right;
    }
    #tableBtnContainer01{
        text-align: right;
    }
    `
    GMaddStyle(cssText);

    function layuiLoad() {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://www.layuicdn.com/layui/css/layui.css';
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://www.layuicdn.com/layui/layui.js";
        document.head.appendChild(script);
        document.head.appendChild(link);
    }
    function HookedWebSocket(url, protocols) {
        var socket = new originalWebSocket(url, protocols);
        if (url === wssSubUrl) {
            wsSub = socket;
        }
        return socket;
    }

    /* convertToObjectFuc env */
    var wsBinaryHeaderList = [{
        "name": "Header Length",
        "key": "headerLen",
        "bytes": 2,
        "offset": 4,
        "value": 16
    }, {
        "name": "Protocol Version",
        "key": "ver",
        "bytes": 2,
        "offset": 6,
        "value": 1
    }, {
        "name": "Operation",
        "key": "op",
        "bytes": 4,
        "offset": 8,
        "value": 2
    }, {
        "name": "Sequence Id",
        "key": "seq",
        "bytes": 4,
        "offset": 12,
        "value": 1
    }]
    function o_a_getDecoder() {
        return window.TextDecoder ? new window.TextDecoder : {
            decode: function (e) {
                return decodeURIComponent(window.escape(String.fromCharCode.apply(String, new Uint8Array(e))))
            }
        }
    }
    var this_decoder;
    var r_a = {
        "WS_OP_HEARTBEAT": 2,
        "WS_OP_HEARTBEAT_REPLY": 3,
        "WS_OP_MESSAGE": 5,
        "WS_OP_USER_AUTHENTICATION": 7,
        "WS_OP_CONNECT_SUCCESS": 8,
        "WS_PACKAGE_HEADER_TOTAL_LENGTH": 16,
        "WS_PACKAGE_OFFSET": 0,
        "WS_HEADER_OFFSET": 4,
        "WS_VERSION_OFFSET": 6,
        "WS_OPERATION_OFFSET": 8,
        "WS_SEQUENCE_OFFSET": 12,
        "WS_BODY_PROTOCOL_VERSION_NORMAL": 0,
        "WS_BODY_PROTOCOL_VERSION_BROTLI": 3,
        "WS_HEADER_DEFAULT_VERSION": 1,
        "WS_HEADER_DEFAULT_OPERATION": 1,
        "WS_HEADER_DEFAULT_SEQUENCE": 1,
        "WS_AUTH_OK": 0,
        "WS_AUTH_TOKEN_ERROR": -101
    }
    /* convert ArrayBuffer to Object */
    function convertToObjectFuc(e) {
        var t = new DataView(e)
            , i = {
                body: []
            };
        if (i.packetLen = t.getInt32(r_a.WS_PACKAGE_OFFSET),
            wsBinaryHeaderList.forEach((function (e) {
                4 === e.bytes ? i[e.key] = t.getInt32(e.offset) : 2 === e.bytes && (i[e.key] = t.getInt16(e.offset))
            }
            )),
            i.packetLen < e.byteLength && convertToObjectFuc(e.slice(0, i.packetLen)),
            this_decoder || (this_decoder = o_a_getDecoder()),
            !i.op || r_a.WS_OP_MESSAGE !== i.op && i.op !== r_a.WS_OP_CONNECT_SUCCESS)
            i.op && r_a.WS_OP_HEARTBEAT_REPLY === i.op && (i.body = {
                count: t.getInt32(r_a.WS_PACKAGE_HEADER_TOTAL_LENGTH)
            });
        else
            for (var n = r_a.WS_PACKAGE_OFFSET, s = i.packetLen, a = "", l = ""; n < e.byteLength; n += s) {
                s = t.getInt32(n),
                    a = t.getInt16(n + r_a.WS_HEADER_OFFSET);
                if (i.ver === r_a.WS_BODY_PROTOCOL_VERSION_NORMAL) {
                    var c = this_decoder.decode(e.slice(n + a, n + s));
                    l = 0 !== c.length ? JSON.parse(c) : null
                } else if (i.ver === r_a.WS_BODY_PROTOCOL_VERSION_BROTLI) {
                    var h = e.slice(n + a, n + s)
                        , u = unsafeWindow.BrotliDecode(new Uint8Array(h));
                    l = convertToObjectFuc(u.buffer).body
                }
                l && i.body.push(l)
            }
        return i
    }

    /* 转化为表格可用json数据 */
    function convertToTableData(ele) {
        switch (ele.cmd) {
            case "DANMU_MSG":
                let damuInfo = ele.info;
                let damuUserInfo = damuInfo[0][15].user;
                let name = damuUserInfo.base.name;
                let is_mystery = damuUserInfo.base.is_mystery ? 1 : 0;
                let content = damuInfo[1];
                let level = -1;
                let medal = -1;
                let guard_level = '无';
                let score = -1;
                let medalFrom = -1;
                let uid = damuUserInfo.uid;
                if (damuUserInfo.medal) {
                    level = damuInfo[3][0];
                    medal = damuInfo[3][1];
                    guard_level = guardLvMapped[damuUserInfo.medal.guard_level];
                    score = damuUserInfo.medal.score;
                    medalFrom = damuInfo[3][2];
                }
                let time = formatTimestamp(damuInfo[9].ts);
                let consumer_level = damuInfo[16][0];
                let tableJsonData = {
                    name: name,
                    reply_is_mystery: is_mystery,
                    level: level,
                    medal: medal,
                    guard_level: guard_level,
                    score: score,
                    medalFrom: medalFrom,
                    time: time,
                    consumer_level: consumer_level,
                    content: content,
                    uid: uid
                }
                wsSubTable01Data.addFirst(tableJsonData);
                break;
            case "SEND_GIFT":
                let sendGiftInfo = ele.data;
                let sendGiftGiftName = sendGiftInfo.giftName;
                let sendGiftDmScore = sendGiftInfo.dmscore;
                let sendGiftGuardLevel = guardLvMapped[sendGiftInfo.guard_level];
                let sendGiftNum = sendGiftInfo.num;
                let sendGiftUid = sendGiftInfo.uid;
                let sendGiftTime = formatTimestamp(sendGiftInfo.timestamp);
                let sendGiftPrice = sendGiftInfo.price;
                let sendGiftUserName = sendGiftInfo.sender_uinfo.base.name;
                let sendGiftJsonData = {
                    dmscore: sendGiftDmScore,
                    num: sendGiftNum,
                    price: sendGiftPrice,
                    giftName: sendGiftGiftName,
                    time: sendGiftTime,
                    username: sendGiftUserName,
                    uid: sendGiftUid,
                    guard_level: sendGiftGuardLevel
                }
                wsSubTable02Data.addFirst(sendGiftJsonData);
                break;
            case "USER_TOAST_MSG":
                let userToastMsgInfo = ele.data;
                let userToastMsgDmScore = userToastMsgInfo.dmscore;
                let userToastMsgNum = userToastMsgInfo.num;
                let userToastMsgPrice = userToastMsgInfo.price;
                let userToastMsgRoleName = userToastMsgInfo.role_name;
                let userToastMsgSendTime = formatTimestamp(userToastMsgInfo.start_time);
                let userToastMsgUserName = userToastMsgInfo.username;
                let userToastMsgSUid = userToastMsgInfo.uid;
                let userToastMsgGuardLevel = guardLvMapped[userToastMsgInfo.guard_level];
                let userToastMsgJsonData = {
                    dmscore: userToastMsgDmScore,
                    num: userToastMsgNum,
                    price: userToastMsgPrice,
                    giftName: userToastMsgRoleName,
                    time: userToastMsgSendTime,
                    username: userToastMsgUserName,
                    uid: userToastMsgSUid,
                    guard_level: userToastMsgGuardLevel
                }
                wsSubTable02Data.addFirst(userToastMsgJsonData);
                break;
            case "SUPER_CHAT_MESSAGE":
                let superChatMessageInfo = ele.data;
                let superChatMessageTime = formatTimestamp(superChatMessageInfo.ts);
                let superChatMessageGiftName = "醒目留言";
                let superChatMessageGiftNum = superChatMessageInfo.gift.num;
                let superChatMessageContent = superChatMessageInfo.message;
                let superChatMessagePrice = superChatMessageInfo.price;
                let superChatMessageUserName = superChatMessageInfo.user_info.uname;
                let superChatMessageSUid = superChatMessageInfo.uinfo.uid;
                let superChatMessageGuardLevel = guardLvMapped[superChatMessageInfo.user_info.guard_level];
                let superChatMessageDmScore = superChatMessageInfo.dmscore;
                let superChatMessageJsonData = {
                    dmscore: superChatMessageDmScore,
                    num: superChatMessageGiftNum,
                    price: superChatMessagePrice,
                    giftName: superChatMessageGiftName + ": " + superChatMessageContent,
                    time: superChatMessageTime,
                    username: superChatMessageUserName,
                    uid: superChatMessageSUid,
                    guard_level: superChatMessageGuardLevel,
                }
                wsSubTable02Data.addFirst(superChatMessageJsonData);
                break;
            case "LIKE_INFO_V3_UPDATE":
                wsSubData03.clickCount = ele.data.click_count;
                wsSubData03.clickCountDate = getCurrentFormattedDateTime();
                break;
            case "WATCHED_CHANGE":
                wsSubData03.watchedChange = ele.data.num;
                wsSubData03.watchedChangeDate = getCurrentFormattedDateTime();
                break;
            case "ROOM_REAL_TIME_MESSAGE_UPDATE":
                wsSubData03.fans = ele.data.fans;
                wsSubData03.fansDate = getCurrentFormattedDateTime();
                break;
            default:
                // console.log("收到消息:", ele);
                break;
        }
        return true;
    }

    function formatTimestamp(timestamp) {
        // 创建一个新的Date对象，传入时间戳（如果时间戳是以秒为单位，需要乘以1000）
        const date = new Date(timestamp * 1000);

        // 获取年份、月份、日期、小时、分钟和秒数
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // 返回格式化的日期时间字符串
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function getCurrentFormattedDateTime() {
        const now = new Date();
        
        // 获取年份
        const year = now.getFullYear();
        // 获取月份（注意：月份是从0开始的，所以需要加1）
        const month = String(now.getMonth() + 1).padStart(2, '0');
        // 获取日期
        const day = String(now.getDate()).padStart(2, '0');
        // 获取小时
        const hours = String(now.getHours()).padStart(2, '0');
        // 获取分钟
        const minutes = String(now.getMinutes()).padStart(2, '0');
        // 获取秒
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        // 拼接成最终的字符串
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    /*  直播数据获取*/
    function getLiveData() {
        if (!wsSub) {
            console.log('wsSub is null');
            return;
        }
        let originalMessageFuc = wsSub.onmessage;
        wsSub.onmessage = function (event) {
            var objectData = convertToObjectFuc(event.data)
            try {
                if (objectData.body.length >= 1) {
                    if (objectData.body[0].length >= 1) {
                        objectData.body[0].forEach((ele) => {
                            convertToTableData(ele);
                        })
                    }
                }
            } catch (e) {
                console.log("解析消息失败:", e, objectData);
            }

            if (typeof originalMessageFuc === 'function') {
                originalMessageFuc.call(this, event);
            }
        };
    }
    function addPanel() {
        // 定义表格数据
        //默认按照时间戳降序排序 +荣誉等级 粉丝牌名
        var tableData;
        var tableData01;
        var timer;
        function genButtonSpan(text, foo, id, fooParams = {}) {
            let b = document.createElement('button');
            let textSpan = document.createElement('span');
            textSpan.textContent = text;
            b.appendChild(textSpan);
            // 使用箭头函数创建闭包来保存 fooParams 并传递给 foo
            b.addEventListener('click', () => {
                foo.call(b, ...Object.values(fooParams)); // 使用 call 方法确保 this 指向按钮对象
            });
            if (id) { b.id = id };
            return b;
        }

        function genButton(text, foo, id, fooParams = {}) {
            let b = document.createElement('button');
            b.textContent = text;
            // 使用箭头函数创建闭包来保存 fooParams 并传递给 foo
            b.addEventListener('click', () => {
                foo.call(b, ...Object.values(fooParams)); // 使用 call 方法确保 this 指向按钮对象
            });
            if (id) { b.id = id };
            return b;
        }

        function genTable(cls, id) {
            let tb = document.createElement('table');
            if (cls) { tb.className = cls };
            if (id) { tb.id = id };
            return tb;
        }

        function genDiv(cls, id) {
            let d = document.createElement('div');
            if (cls) { d.className = cls };
            if (id) { d.id = id };
            return d;
        }
        async function openPanelFunc() {
            layer.open({
                type: 0, // page 层类型
                title: '选择数据类型',
                shade: 0,
                btn: ['弹幕', '礼物+SC+舰队', '其他'],
                // 按钮1 的回调
                btn1: btn1Fuction,
                btn2: btn2Fuction,
                btn3: btn3Fuction
            });
        }

        function btn1Fuction(index, layero, that) {
            layui.use(['layer', 'table'], function () {
                var layer = layui.layer;
                var table = layui.table;

                // 使用 layer.open 打开一个新的弹出层
                layer.open({
                    type: 1, // 表示这是一个页面层
                    title: '弹幕采集',
                    shade: 0,
                    shadeClose: true, // 点击遮罩关闭
                    area: ['40%', '40%'], // 设置宽度和高度
                    content: layui.$('#MyTableDiv'), // 显示隐藏的 div 内容
                    success: function (layero, index) {
                        updateTableData();
                        renderTable(tableData);
                        timer = setInterval(function () {
                            updateTableData(tableData);
                            table.reloadData('MyTable', { data: tableData });
                        }, 3000);
                        let tableBtn02 = document.querySelector('#tableBtn02')
                        if (tableBtn02.textContent == '开始') {
                            tableBtn02.className += ' layui-btn-warm';
                            tableBtn02.textContent = '暂停';
                        }
                    },
                    end: function () {
                        if (timer) {
                            clearInterval(timer);
                            timer = undefined; // 清除引用
                        }
                    }
                });
                /*  渲染弹幕表格*/
                function renderTable(data) {
                    table.render({
                        id: 'MyTable',
                        elem: '#MyTable',
                        data: data,
                        cols: [[
                            //排序默认是字典序，符合要求
                            { field: 'time', title: '时间', width: 160, sort: true, fixed: 'left' },
                            { field: 'name', title: '姓名', width: 120 },
                            { field: 'content', title: '消息', width: 160 },
                            { field: 'medal', title: '粉丝牌', width: 80 },
                            { field: 'medalFrom', title: '牌子主播', width: 80 },
                            { field: 'level', title: '粉丝牌LV', width: 100 },
                            { field: 'consumer_level', title: '荣誉LV', width: 100 },
                            { field: 'score', title: '贡献值', width: 100 },
                            { field: 'guard_level', title: '身份', width: 80 },
                            { field: 'reply_is_mystery', title: '匿名', width: 80 },
                            { field: 'uid', title: 'uid', width: 80 }
                        ]],
                        page: true // 不显示分页
                    });
                }
            });

            return false;
        }

        function btn2Fuction(index, layero, that) {
            layui.use(['layer', 'table'], function () {
                var layer = layui.layer;
                var table = layui.table;

                // 使用 layer.open 打开一个新的弹出层
                layer.open({
                    type: 1, // 表示这是一个页面层
                    title: '流水采集',
                    shade: 0,
                    shadeClose: true, // 点击遮罩关闭
                    area: ['40%', '40%'], // 设置宽度和高度
                    content: layui.$('#MyTableDiv01'), // 显示隐藏的 div 内容
                    success: function (layero, index) {
                        updateTableData01();
                        renderTable01(tableData01);
                        timer = setInterval(function () {
                            updateTableData01();
                            table.reloadData('MyTable01', { data: tableData01 });
                        }, 3000);
                        let tableBtn02 = document.querySelector('#table01Btn02')
                        if (tableBtn02.textContent == '开始') {
                            tableBtn02.className += ' layui-btn-warm';
                            tableBtn02.textContent = '暂停';
                        }
                    },
                    end: function () {
                        if (timer) {
                            clearInterval(timer);
                            timer = undefined; // 清除引用
                        }
                    }
                });
                /* 渲染流水表格 */
                function renderTable01(data) {
                    table.render({
                        id: 'MyTable01',
                        elem: '#MyTable01',
                        data: data,
                        cols: [[
                            //排序默认是字典序，符合要求
                            { field: 'time', title: '时间', width: 160, sort: true, fixed: 'left' },
                            { field: 'username', title: '姓名', width: 120 },
                            { field: 'giftName', title: '礼物', width: 160 },
                            { field: 'price', title: '价格(分)', width: 80 },
                            { field: 'num', title: '数量', width: 80 },
                            { field: 'uid', title: 'uid', width: 100 },
                            { field: 'guard_level', title: '身份', width: 100 },
                            { field: 'dmscore', title: '贡献值', width: 100 }
                        ]],
                        page: true // 不显示分页
                    });
                }
            });

            return false;
        }

        function btn3Fuction(index, layero, that) {
            layui.use(['layer'], function () {
                var layer = layui.layer;
                layer.open({
                    type: 1, // 表示这是一个页面层
                    title: '其他',
                    shade: 0,
                    shadeClose: true, // 点击遮罩关闭
                    area: ['40%', '40%'], // 设置宽度和高度
                    content: `
                    <div class="layui-padding-3" id="MyTableDiv03">
                        <blockquote class="layui-elem-quote layui-quote-nm">
                            <span class="layui-font-orange">${wsSubData03.watchedChange}</span> 看过直播 |
                            更新于: <span class="layui-badge-dot layui-bg-orange"></span> <span class="layui-font-orange">${wsSubData03.watchedChangeDate}</span> 
                        </blockquote>
                        <blockquote class="layui-elem-quote layui-quote-nm">
                            <span class="layui-font-blue">${wsSubData03.clickCount}</span> 直播点赞总数 |
                            更新于: <span class="layui-badge-dot layui-bg-blue"></span> <span class="layui-font-blue">${wsSubData03.clickCountDate}</span>
                        </blockquote>
                        <blockquote class="layui-elem-quote layui-quote-nm">
                            <span class="layui-font-green">${wsSubData03.fans}</span> 主播粉丝数量 |
                            更新于: <span class="layui-badge-dot layui-bg-green"></span> <span class="layui-font-green">${wsSubData03.fansDate}</span>
                    </div>
                    `, 
                    success: function (layero, index) {
                        updateTableData02();
                        timer = setInterval(function () {
                            updateTableData02();
                        }, 3000);
                    },
                    end: function () {
                        if (timer) {
                            clearInterval(timer);
                            timer = undefined; // 清除引用
                        }
                    }
                });
            });      
            
            return false;
        }
        /* 更新弹幕表格数据  */
        function updateTableData(data) {
            tableData = wsSubTable01Data.toArray();
        }
        /* 更新礼物表格数据 */
        function updateTableData01(data) {
            tableData01 = wsSubTable02Data.toArray();
        }
        /* 更新其他数据 */
        function updateTableData02(data) {
            document.querySelector("#MyTableDiv03 > blockquote:nth-child(1) span:nth-child(1)").textContent = wsSubData03.watchedChange;
            document.querySelector("#MyTableDiv03 > blockquote:nth-child(1) span:nth-child(3)").textContent = wsSubData03.watchedChangeDate;

            document.querySelector("#MyTableDiv03 > blockquote:nth-child(2) span:nth-child(1)").textContent = wsSubData03.clickCount;
            document.querySelector("#MyTableDiv03 > blockquote:nth-child(2) span:nth-child(3)").textContent = wsSubData03.clickCountDate;

            document.querySelector("#MyTableDiv03 > blockquote:nth-child(3) span:nth-child(1)").textContent = wsSubData03.fans;
            document.querySelector("#MyTableDiv03 > blockquote:nth-child(3) span:nth-child(3)").textContent = wsSubData03.fansDate;
        }
        function tableBtn01Fuc() {
            layui.use(['layer', 'table'], function () {
                var layer = layui.layer;
                var table = layui.table;
                table.exportFile('MyTable', tableData, {
                    title: '弹幕' + Date.now().toString()
                });
            });
        }
        function table01Btn01Fuc() {
            layui.use(['layer', 'table'], function () {
                var layer = layui.layer;
                var table = layui.table;
                table.exportFile('MyTable01', tableData01, {
                    title: '流水' + Date.now().toString()
                });
            });
        }
        function tableBtn02Fuc() {
            let tableBtn02 = document.querySelector('#tableBtn02')
            if (timer) {
                clearInterval(timer);
                timer = undefined;
                tableBtn02.classList.remove('layui-btn-warm');
                tableBtn02.textContent = '开始';
                return;
            }
            layui.use(['layer', 'table'], function () {
                var layer = layui.layer;
                var table = layui.table;
                timer = setInterval(function () {
                    updateTableData(tableData);
                    table.reloadData('MyTable', { data: tableData });
                }, 3000);
                tableBtn02.className += ' layui-btn-warm';
                tableBtn02.textContent = '暂停';
            })
        }
        function table01Btn02Fuc() {
            let table01Btn02 = document.querySelector('#table01Btn02')
            if (timer) {
                clearInterval(timer);
                timer = undefined;
                table01Btn02.classList.remove('layui-btn-warm');
                table01Btn02.textContent = '开始';
                return;
            }
            layui.use(['layer', 'table'], function () {
                var layer = layui.layer;
                var table = layui.table;
                timer = setInterval(function () {
                    updateTableData01();
                    table.reloadData('MyTable01', { data: tableData01 });
                }, 3000);
                table01Btn02.className += ' layui-btn-warm';
                table01Btn02.textContent = '暂停';
            })
        }
        function genPanelButtonAndAppendToDOC() {
            let myButton = genButtonSpan('crawler', openPanelFunc, 'MyButton');
            document.body.appendChild(myButton);
        }
        function genBarrageTableAndAppendToDOC() {
            let myTable = genTable('layui-hide', 'MyTable');
            let myTableDiv = genDiv(undefined, 'MyTableDiv');
            let tableBtnContainer = genDiv('layui-btn-container', 'tableBtnContainer');
            let tableBtn01 = genButton('导出', tableBtn01Fuc, 'tableBtn01');
            let tableBtn02 = genButton('暂停', tableBtn02Fuc, 'tableBtn02');
            tableBtn01.className = 'layui-btn';
            tableBtn01.className += ' layui-btn-sm';
            tableBtn02.className = 'layui-btn';
            tableBtn02.className += ' layui-btn-sm';
            tableBtn02.className += ' layui-btn-warm';

            tableBtnContainer.appendChild(tableBtn01);
            tableBtnContainer.appendChild(tableBtn02);
            myTableDiv.appendChild(tableBtnContainer);
            myTableDiv.appendChild(myTable);

            document.body.appendChild(myTableDiv);
        }
        function genGiftTableAndAppendToDOC() {
            let myTable01 = genTable('layui-hide', 'MyTable01');
            let myTableDiv01 = genDiv(undefined, 'MyTableDiv01');
            let tableBtnContainer01 = genDiv('layui-btn-container', 'tableBtnContainer01');
            let table01Btn01 = genButton('导出', table01Btn01Fuc, 'table01Btn01');
            let table01Btn02 = genButton('暂停', table01Btn02Fuc, 'table01Btn02');
            table01Btn01.className = 'layui-btn';
            table01Btn01.className += ' layui-btn-sm';
            table01Btn02.className = 'layui-btn';
            table01Btn02.className += ' layui-btn-sm';
            table01Btn02.className += ' layui-btn-warm';

            tableBtnContainer01.appendChild(table01Btn01);
            tableBtnContainer01.appendChild(table01Btn02);
            myTableDiv01.appendChild(tableBtnContainer01);
            myTableDiv01.appendChild(myTable01);

            document.body.appendChild(myTableDiv01);
        }
        /* 面板按钮 */
        genPanelButtonAndAppendToDOC();
        /* 弹幕表格 */
        genBarrageTableAndAppendToDOC();
        /* 礼物+SC+舰队表格 */
        genGiftTableAndAppendToDOC();
    }

    function GMaddStyle(css) {
        var myStyle = document.createElement('style');
        myStyle.textContent = css;
        var doc = document.head || document.documentElement;
        doc.appendChild(myStyle);
    }
})();