// ==UserScript==
// @name         拼多多图床 For ZHC
// @namespace    https://github.com/redble
// @version      1.1
// @description  拼多多图床 基于hook输入框可以粘贴上传
// @author       redble
// @match        *://*.chat.zhangsoft.link/*
// @match        *://chat.zhangsoft.link/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473108/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%9B%BE%E5%BA%8A%20For%20ZHC.user.js
// @updateURL https://update.greasyfork.org/scripts/473108/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%9B%BE%E5%BA%8A%20For%20ZHC.meta.js
// ==/UserScript==
(function () {

    const $ = (e) => document.querySelector(e);
    var mode = localStorage.getItem('pddimg_mode') || 'copy';
    const info = (e) => COMMANDS.info({ nick: '*', text: e });
    var _raw_send = send;
    info('拼多多图床脚本已启动，输入/pddimg_set查看帮助');
    send = function (e) {
        if (e.cmd == 'chat') {
            let t = e.text;
            if (t == '/pddimg_set') {
                info(`图床帮助：auto模式为粘贴后发送 | copy模式为自动复制到输入框`); return;
            }
            else if (t == '/pddimg_set auto') {
                info('当前为auto模式');
                localStorage.setItem('pddimg_mode', 'auto');
                return;
            } else if (t == '/pddimg_set copy') {
                info('当前为copy模式');
                localStorage.setItem('pddimg_mode', 'copy');
                return;
            }
        }
        _raw_send(e);
    }
    // 监听paste事件
    document.addEventListener('paste', function (e) {
        const dataTransferItemList = e.clipboardData.items;
        // 过滤非图片类型
        const items = [].slice.call(dataTransferItemList).filter(function (item) {
            return item.type.indexOf('image') !== -1;
        });
        if (items.length === 0) {
            return;
        }
        info('检测到图片，正在上传图片。');
        const dataTransferItem = items[0];
        const blob = dataTransferItem.getAsFile();
        // 获取base64
        const fileReader = new FileReader();
        fileReader.addEventListener('load', function (e) {
            let base64 = e.target.result;
            upload(base64);
        });
        fileReader.readAsDataURL(blob);
    });

    // 上传
    function upload(base64) {
        var url = "https://pddimg.dr0.lol/upload"; // 请求地址
        var data = JSON.stringify({ base64: base64 }); // 将参数base64转换为JSON字符串

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText); // 解析响应数据
                if (res.success) {
                    if (mode == 'auto') {
                        window.send({ cmd: 'chat', text: `![](${res.url})` });
                    } else {
                        insertAtCursor(`![](${res.url})`);
                    }
                }
            }
        };

        xhr.send(data); // 发送请求
    }

})();