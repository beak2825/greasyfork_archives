// ==UserScript==
// @name         隐藏知乎消息红色提醒
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  把红色提醒变成灰色
// @author       1551755561@qq.com
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431007/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E6%B6%88%E6%81%AF%E7%BA%A2%E8%89%B2%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/431007/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E6%B6%88%E6%81%AF%E7%BA%A2%E8%89%B2%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    var numberOfTimes = 200;
    var delay = 10;
    for (var i = 0; i < numberOfTimes; i++) {
        hideRedMessage();
        setTimeout(function(){hideMessageAlarmInTitle()}, delay * i);
    }
    // 兜底
    window.addEventListener('load', function() {
        hideRedMessage();
        hideMessageAlarmInTitle();
    }, false);
})();


function addNewStyle(newStyle) {
    console.log("👴 add new style:", newStyle)
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    styleElement.appendChild(document.createTextNode(newStyle));
}

function hideRedMessage() {
    addNewStyle('.css-11oarr3 {background-color: #8490a6}');
    var has_unread_message = document.getElementsByClassName("AppHeader-notifications")[0].getElementsByTagName("div")[0].textContent != "消息";
    var has_unread_chat = document.getElementsByClassName("AppHeader-messages")[0].getElementsByTagName("div")[0].textContent != "私信";
    console.log("👴🏿", has_unread_message, has_unread_chat);
    if (has_unread_message) {
        var unread_message_element = document.getElementsByClassName("AppHeader-notifications")[0].getElementsByTagName("div")[0];
        unread_message_element.style.backgroundColor = "#8490a6";
    }
    if (has_unread_chat) {
        var unread_chat_element = document.getElementsByClassName("AppHeader-messages")[0].getElementsByTagName("div")[0];
        unread_chat_element.style.backgroundColor = "#8490a6";
    }
}

function hideMessageAlarmInTitle() {
    var title = document.getElementsByTagName("title")[0].innerText;
    console.log(title)
    document.getElementsByTagName("title")[0].innerText = title.replace(/\(.*?\)/i, "").trim();
}
