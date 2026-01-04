// ==UserScript==  
// @name         Custom Export Rename  
// @namespace    http://tampermonkey.net/  
// @version      1.0  
// @description  导出功能并生成 .xlsx 文件拦截
// @author       广州三组向也 
// @match        *://admin.netshort.com/*
// @grant        none  
// @downloadURL https://update.greasyfork.org/scripts/515206/Custom%20Export%20Rename.user.js
// @updateURL https://update.greasyfork.org/scripts/515206/Custom%20Export%20Rename.meta.js
// ==/UserScript==    
  
(function() {  
    'use strict';  
  
    // 假设导出功能的 URL，需要根据实际情况替换  
    const exportUrl = '*://admin.netshort.com/*';  
  
    // 监听所有的 XMLHttpRequest 请求  
    XMLHttpRequest.prototype.open = (function(open) {  
        return function(method, url, async, user, pass) {  
            this._url = url;  
            open.call(this, method, url, async, user, pass);  
        };  
    })(XMLHttpRequest.prototype.open);  
  
    XMLHttpRequest.prototype.send = (function(send) {  
        return function(body) {  
            this.addEventListener('load', function() {  
                if (this._url === exportUrl && this.responseType === '' && this.status === 200) {  
                    // 拦截导出的响应  
                    const blob = new Blob([this.responseText], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });  
                    const url = URL.createObjectURL(blob);  
  
                    // 获取当前日期  
                    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');  
  
                    // 创建下载链接并触发下载  
                    const a = document.createElement('a');  
                    a.href = url;  
                    a.download = `export_${currentDate}.xlsx`;  
                    document.body.appendChild(a);  
                    a.click();  
  
                    // 清理  
                    document.body.removeChild(a);  
                    URL.revokeObjectURL(url);  
                }  
            });  
            send.call(this, body);  
        };  
    })(XMLHttpRequest.prototype.send);  
  
    // 如果页面使用 fetch API，则需要重写 fetch 函数  
    const originalFetch = window.fetch;  
    window.fetch = async function(url, options) {  
        const response = await originalFetch(url, options);  
  
        if (url === exportUrl && response.ok) {  
            const blob = await response.blob();  
            const urlObject = URL.createObjectURL(blob);  
  
            // 获取当前日期  
            const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');  
  
            // 创建下载链接并触发下载  
            const a = document.createElement('a');  
            a.href = urlObject;  
            a.download = `export_${currentDate}.xlsx`;  
            document.body.appendChild(a);  
            a.click();  
  
            // 清理  
            document.body.removeChild(a);  
            URL.revokeObjectURL(urlObject);  
  
            // 返回修改后的响应（可选，根据需要决定）  
            // 注意：这里的返回可能会导致某些使用 response.json() 等方法的代码出错  
            // 可以根据具体情况决定是否返回原始的 response 或者创建一个新的 Response 对象  
            // return new Response(blob, response);  
        }  
  
        return response;  
    };  
})();