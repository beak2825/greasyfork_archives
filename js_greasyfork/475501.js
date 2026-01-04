// ==UserScript==
// @name         Quicker Debug 增强
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  加强Debug文件
// @author       HDG
// @match        file:///C:/Users/*/AppData/Local/Temp/quicker_*_log.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/475501/Quicker%20Debug%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/475501/Quicker%20Debug%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function extractActionId() {
        var messageInfoElement = document.querySelector('.message-info:nth-child(2)');
        var innerText = messageInfoElement.innerText;
        var regex = /动作ID:([\w-]+)/;
        var match = innerText.match(regex);
        return match[1];
    }

    function extractShareId() {
        var messageInfoElement = document.querySelector('.message-info:nth-child(2)');
        var innerText = messageInfoElement.innerText;
        var regex = /来源动作:([\w-]+)\s*/;
        var match = innerText.match(regex);
        if (match !== null) { // 添加这个条件判断
            return match[1];
        } else {
            return null; // 如果没找到则返回 null
        }
    }

    const id = extractActionId();
    const shareId = extractShareId();
    const rootUrl = "https://192-168-1-7.lan.quicker.cc:13533";

    // 点击上传按钮：自动跳转到动作的评论区
    document.querySelector('a~ a+ a').addEventListener('click', function() {
        if (shareId)
        {
            window.open(`https://getquicker.net/Common/Topics/New?objectType=SharedAction&objectId=${shareId}`, '_blank');
        }
    });

    // Ctrl+左键步骤头部：跳转编辑窗口并高亮步骤
    document.querySelectorAll('.step-header').forEach(function(element) {
        element.addEventListener('click', function(event) {
            if (event.ctrlKey) {
                event.preventDefault();
                element.click();
                element.querySelector('.step-id').click();
            }
        });
    });

})();
