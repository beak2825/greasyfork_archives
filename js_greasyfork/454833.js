// ==UserScript==
// @name         获取浏览器剪切板内容
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取浏览器剪切板内容并跨设备分享
// @author       You
// @match        https://192.168.1.111:3000
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454833/%E8%8E%B7%E5%8F%96%E6%B5%8F%E8%A7%88%E5%99%A8%E5%89%AA%E5%88%87%E6%9D%BF%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/454833/%E8%8E%B7%E5%8F%96%E6%B5%8F%E8%A7%88%E5%99%A8%E5%89%AA%E5%88%87%E6%9D%BF%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const key = new Date().getTime();
    const msgList = [];
    let isSave = false;
    let currentSendData = "";

    var ws = new WebSocket("wss://192.168.1.111:3000");
    //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
    ws.onopen = function () {
        //当WebSocket创建成功时，触发onopen事件        
        ws.send(JSON.stringify({
            type: "connection",
            data: key
        })); //将消息发送到服务端        
    }
    ws.onmessage = async function (e) {
        //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
        try {
            const data = JSON.parse(e.data);
            //  web-clipboard数据
            if ("data" == data.type) {
                // const otherData = data.data.filter(item => {
                //     return key != item.name;
                // })
                console.log('接收到的数据:', data.data);
                // 这里把接收到的数据保存到剪切板
                msgList.push(data.data);
                isSave = true;

                const currentData = msgList.sort((a, b) => {
                    return b.date - a.date;
                })[0].data;
                const res = await saveDataToWebClipboard(currentData);
                isSave = false;
                document.body.innerText = currentData;
            }
        } catch (error) {
        }
    }
    ws.onclose = function (e) {
        //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
        console.log("close");
    }
    ws.onerror = function (e) {
        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        console.log(e);
    }

    //  获取剪切板中的数据
    const getWebClipboard = async () => {
        try {
            if (navigator.clipboard) {
                const text = await navigator.clipboard.readText();
                return text;
            }
        } catch (error) {

        }
        return "";
    }


    //  保存数据到剪切板中
    const saveDataToWebClipboard = async (data) => {
        try {
            if (navigator.clipboard) {
                const text = new Blob([data], { type: 'text/plain' });
                const item = new ClipboardItem({
                    'text/plain': text
                });
                await navigator.clipboard.write([item]);
                return true;
            }
        } catch (error) {
        }
        return false;
    }

    setInterval(async () => {
        const data = await getWebClipboard();
        //  避免重复发送消息。 保存过程中不能发送消息
        if (data != "" && msgList.sort((a, b) => {
            return b.date - a.date;
        })?.[0]?.data != data && !isSave && data != currentSendData) {
            ws.send(JSON.stringify({
                type: "pushData",
                data: { name: key, data }
            }));
            currentSendData = data;
        }
    }, 2000)
})();