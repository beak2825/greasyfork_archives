// ==UserScript==
// @name        WS一下
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     20250718182058
// @description 选中IP、域名、url时弹出悬浮框，一键查询sangfor、微步情报、奇安信、ip138
// @downloadURL https://update.greasyfork.org/scripts/501153/WS%E4%B8%80%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/501153/WS%E4%B8%80%E4%B8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function trimLeftRightSpace(str) {
        str = str.replace(/^\s+|\s+$/g, '');
        str = str.replace(/^\.+|\.+$/g, '');
        return str;
    }

    // 创建悬浮框

    function createFloatingBox(text, callback) {
        var floatingBox = document.createElement('div');
        floatingBox.style.position = 'absolute';
        floatingBox.style.backgroundColor = 'write';
        floatingBox.style.border = '2px dashed black'; // 修改边框为虚线
        floatingBox.style.padding = '10px';
        floatingBox.style.fontSize = '16px';
        floatingBox.style.fontWeight = 'bold';
        floatingBox.style.zIndex = '99999';
        floatingBox.style.borderRadius="25%";
        floatingBox.innerHTML = text;
        floatingBox.addEventListener('click', callback);
        return floatingBox;
    }
    function base64Encode(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }


    // 获取选中的文本并显示悬浮框
    function showFloatingBoxWithSelectedText() {
        var selectedText = window.getSelection().toString();
        selectedText = trimLeftRightSpace(selectedText)

        if (!selectedText){
            return false
        }
        //判断是ip还是域名
        const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const domainPattern = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!ipPattern.test(selectedText) && !domainPattern.test(selectedText) && !urlPattern.test(selectedText)) {
            return false
        }

        var range = window.getSelection().getRangeAt(0);
        var rect = range.getBoundingClientRect();
        var floatingBox = createFloatingBox('WS一下', function() {

            if (ipPattern.test(selectedText)) {
                window.open('https://ti.sangfor.com.cn/analysis-platform/ip_report/' + encodeURIComponent(base64Encode(selectedText))+`?lang=ZH-CN`, '_blank');
                window.open('https://x.threatbook.com/v5/ip/' + selectedText, '_blank');
                window.open('https://ti.qianxin.com/v2/search?type=ip&value=' + selectedText, '_blank');
                window.open('https://ipchaxun.com/' + selectedText+`/`, '_blank');
            } else if (domainPattern.test(selectedText)) {
                window.open('https://ti.sangfor.com.cn/analysis-platform/dns_report/' + encodeURIComponent(base64Encode(selectedText))+`?lang=ZH-CN`, '_blank');
                window.open('https://x.threatbook.com/v5/domain/' + selectedText, '_blank');
                window.open('https://ti.qianxin.com/v2/search?type=domain&value=' + selectedText, '_blank');
                window.open('https://ipchaxun.com/' + selectedText+`/`, '_blank');
                window.open('https://icplishi.com/' + selectedText+`/`, '_blank');
            } else if (urlPattern.test(selectedText)) {
                window.open('https://ti.sangfor.com.cn/analysis-platform/url_report/' + encodeURIComponent(base64Encode(selectedText))+`?lang=ZH-CN`, '_blank');
                window.open('https://ti.qianxin.com/v2/search?type=url&value=' + encodeURIComponent(base64Encode(selectedText))+``, '_blank');
            } else {
                alert("选中值【"+selectedText+"】无法查询，请联系开发者进行兼容")
                return false
            }

        });
        floatingBox.style.left = rect.left + 'px';
        floatingBox.style.top = (rect.bottom + window.scrollY) + 'px';
        document.body.appendChild(floatingBox);
        setTimeout(function() {
            document.body.removeChild(floatingBox);
        }, 3000); // 悬浮框显示3秒后自动消失
    }

    // 监听选中文本事件
    document.addEventListener('mouseup', function() {
        showFloatingBoxWithSelectedText();
    });
})();