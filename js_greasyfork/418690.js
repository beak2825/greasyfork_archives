// ==UserScript==
// @name         移除CSDN系统通知小红点
// @namespace    https://h3110w0r1d.com/
// @version      0.2
// @description  运行时期选document-body，可移除CSDN系统通知小红点，如需清空系统通知请将脚本中第二个请求取消注释
// @author       h3110w0r1d
// @match        https://*.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418690/%E7%A7%BB%E9%99%A4CSDN%E7%B3%BB%E7%BB%9F%E9%80%9A%E7%9F%A5%E5%B0%8F%E7%BA%A2%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/418690/%E7%A7%BB%E9%99%A4CSDN%E7%B3%BB%E7%BB%9F%E9%80%9A%E7%9F%A5%E5%B0%8F%E7%BA%A2%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.ajax({
        type: 'POST',
        url: "https://msg.csdn.net/v1/web/message/view/message",
        contentType:'application/json;charset=UTF-8',
        data: '{"type":4}',
        xhrFields: {
            withCredentials:true
        },
        success: function (data) {
            ;
        }
    });
    /*
    $.ajax({
        type: 'POST',
        url: "https://msg.csdn.net/v1/web/message/delete/all",
        contentType:'application/json;charset=UTF-8',
        data: '{"type":4}',
        xhrFields: {
            withCredentials:true
        },
        success: function (data) {
            ;
        }
    });
    */

})();