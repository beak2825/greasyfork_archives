// ==UserScript==
// @name       stock-tool
// @namespace  npm/vite-plugin-monkey
// @version    0.0.4
// @author     dd
// @description stock data tool
// @license    MIT
// @match      *www.google.com/finance/quote*
// @icon       https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant      GM.addElement
// @grant      GM.addStyle
// @grant      GM.deleteValue
// @grant      GM.getResourceUrl
// @grant      GM.getValue
// @grant      GM.info
// @grant      GM.listValues
// @grant      GM.notification
// @grant      GM.openInTab
// @grant      GM.registerMenuCommand
// @grant      GM.setClipboard
// @grant      GM.setValue
// @grant      GM.xmlHttpRequest
// @grant      GM_addElement
// @grant      GM_addStyle
// @grant      GM_addValueChangeListener
// @grant      GM_cookie
// @grant      GM_deleteValue
// @grant      GM_download
// @grant      GM_getResourceText
// @grant      GM_getResourceURL
// @grant      GM_getTab
// @grant      GM_getTabs
// @grant      GM_getValue
// @grant      GM_info
// @grant      GM_listValues
// @grant      GM_log
// @grant      GM_notification
// @grant      GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_removeValueChangeListener
// @grant      GM_saveTab
// @grant      GM_setClipboard
// @grant      GM_setValue
// @grant      GM_unregisterMenuCommand
// @grant      GM_webRequest
// @grant      GM_xmlhttpRequest
// @run-at     document-start
// @grant      unsafeWindow
// @grant      window.close
// @grant      window.focus
// @grant      window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/482739/stock-tool.user.js
// @updateURL https://update.greasyfork.org/scripts/482739/stock-tool.meta.js
// ==/UserScript==

listenForRequests();

// 监听XMLHttpRequest网络请求
function listenForRequests() {
    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        //console.log("访问的URL == " + url);
        open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (data) {
        //console.log(' send window.location.href -- ' + window.location.href);
        //console.log("data ------- " + JSON.stringify(data));

        // 保存当前 XMLHttpRequest 对象
        const currentXHR = this;

        // 添加 load 事件监听器
        currentXHR.addEventListener("load", function () {
            var resData = currentXHR.responseText
            //console.log('Response data:----', resData);
            if (resData.startsWith(")]}'")) {
                /// 使用正则表达式匹配模式并提取目标数据
                //const regexNum = /,\[(-?\d+\.\d+),/g;
                const regexNum = /,\[(-?\d+(\.\d+)?),/g;
                let matchNum;
                const resultNumArray = [];

                while ((matchNum = regexNum.exec(resData)) !== null) {
                    // match[1] 包含匹配的目标数据
                    resultNumArray.push(parseFloat(matchNum[1]));
                }

                // 输出结果数组
                console.log("数据-" + resultNumArray.length + "--" + JSON.stringify(resultNumArray));

                //const regexDate = /\[\[([\d,]+),/g;
                //const regexDate = /\[\[([\d,]+)\d+/g;
                const regexDate = /\[\[(\d+,\d+,\d+),/g;
                let matchDate;
                const resultDateArray = [];

                while ((matchDate = regexDate.exec(resData)) !== null) {
                    // match[1] 包含匹配的目标数据
                    const extractedString = matchDate[1];
                    const transformedString = extractedString.slice(5).replace(/,/g, '.');
                    resultDateArray.push(transformedString);
                }
                console.log("日期-" + resultDateArray.length + "--" + JSON.stringify(resultDateArray));
            }
        });
        return send.apply(this, arguments);
    };
}
