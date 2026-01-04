// ==UserScript==
// @name         click house log trace
// @home-url     https://greasyfork.org/zh-CN/scripts/465054-click-house-log-trace
// @version      1.3
// @description  在click house日志平台增加一键跳转trace按钮（当鼠标经过messageId时）
// @author       zwang57
// @match        http://es.ops.ctripcorp.com/*
// @match        http://es.ops.fws.qa.nt.ctripcorp.com/*
// @downloadURL
// @grant    GM_setClipboard
// @grant GM_getResourceText
// @grant GM_addStyle
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/465054/click%20house%20log%20trace.user.js
// @updateURL https://update.greasyfork.org/scripts/465054/click%20house%20log%20trace.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    var $ = $ || window.$;

    function getJumpUrl(messageId) {
        let siteUrl = window.location.href;

        if(/.fws.qa/g.exec(siteUrl)){
            return `http://bat.fws.qa.nt.ctripcorp.com/trace/${messageId}`;
        }
        if(/.uat./g.exec(siteUrl)){
            return `http://bat.uat.qa.nt.ctripcorp.com/trace/${messageId}`;
        }
        if(/.ops.ctripcorp./g.exec(siteUrl)){
            return `http://bat.fx.ctripcorp.com/trace/${messageId}`;
        }
        return "";
    }

    document.body.addEventListener('mouseover', function(evt) {
        let elem = evt.target;
        // 判断是否是messageId 对应的html元素
        if (!elem.nodeName || elem.nodeName.toUpperCase() != 'TD' || elem.className.indexOf('ng-binding') < 0) return;

        let messageId = elem.innerHTML.trim(); // 获取触发事件元素的html代码
        if (!/^(\d{9}-)/.test(messageId)) return; // 非messageId 不做出路
        if (/^<a.*/.test(messageId)) return; // 如果内容已经被替换成链接，不做处理

        let link = getJumpUrl(messageId)
        if (link) {
            elem.innerHTML = `<a href="${link}" target="_blank">${messageId} <button>🔗Trace</button></a>`;
        }
    })

})();