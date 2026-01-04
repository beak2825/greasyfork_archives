// ==UserScript==
// @license MIT
// @name         易刷-pob物品对比
// @namespace    http://tampermonkey.net/
// @version      2024-09-25
// @description  易刷-pob物品对比_1
// @author       You
// @match        https://poe.game.qq.com/trade/search/*
// @icon         https://poecdn.game.qq.com/protected/image/trade/layout/logo.png?key=aifr8Q9qj0FYhhu8_rrfhw
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/510143/%E6%98%93%E5%88%B7-pob%E7%89%A9%E5%93%81%E5%AF%B9%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/510143/%E6%98%93%E5%88%B7-pob%E7%89%A9%E5%93%81%E5%AF%B9%E6%AF%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const diffList = []

    function post(url, data, successCallback, errorCallback) {
        // 1. 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        var headers = {
            'Content-Type': 'application/json'
        }
        // 2. 初始化请求
        xhr.open('POST', url, true);

        // 3. 设置请求头
        for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }

        // 4. 定义回调函数来处理响应
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) { // 4 表示请求已完成
                if (xhr.status === 200) { // 200 表示成功
                    if (successCallback) {
                        successCallback(xhr.responseText);
                    }
                } else {
                    if (errorCallback) {
                        errorCallback(xhr.statusText);
                    }
                }
            }
        };

        // 5. 发送请求，并传递请求体数据
        xhr.send(JSON.stringify(data));
    }

    function postPromise(url, data) {
        return new Promise((resolve, reject) => {
            post(url, data, function (response) {
                resolve(response);
            }, function (error) {
                reject(error);
            });
        });
    }
    var url = 'http://127.0.0.1:29899/api/data';

    var thisXhr;
    if(typeof ajax_interceptor_qoweifjqon !== 'undefined' ){
        thisXhr = ajax_interceptor_qoweifjqon.originalXHR;
    }else{
        thisXhr = unsafeWindow.XMLHttpRequest;
    }
    const origSend = thisXhr.prototype.send;
    const origOpen = thisXhr.prototype.open;
    thisXhr.prototype.open = function() {
        if(arguments[1].match('jp/c/i')){
            this.responseType = "blob";
        }else{
            this.responseType = "";
        }
        return origOpen.apply(this, arguments)
    }
    thisXhr.prototype.send = function (...args) {
        this.addEventListener('load', () => {
            if (this.status === 200) {
                customLoad(this, args);
            }
        });
        origSend.apply(this, args);
    };

    const customLoad = async (xhr, ...args) => {
        const http = new URL(xhr.responseURL);
        const req = tryParseJSON(args[0]);
        const res = tryParseJSON(xhr.response);
        if(http.href.match('api/trade/search')){
            diffList.length = 0
        }
        if(http.href.match('api/trade/fetch')){
            try{
                const itemList = res.result.map(a=> decodeURIComponent(escape(atob(a.item.extended.text))).replaceAll("\r\n","\n"))
                const response = await postPromise(url, itemList);
                const resList = JSON.parse(response).message;
                diffList.push(...resList.map((a,i) => {
                    return {
                        html:a,
                        id:res.result[i].id
                    }
                }));
            }catch(e){
                console.log(e)
            }
            setTimeout(() => {
                console.log('diffList',diffList)
                document.querySelectorAll(".resultset .row").forEach( row => {
                    const dataIdValue = row.getAttribute("data-id");
                    const diff = diffList.find( e=> e.id == dataIdValue)
                    if (diff) {
                        diff.html.map(a => {
                            const diffHtml = `<div class="right">${a}</div>`;
                            row.insertAdjacentHTML('beforeend', diffHtml);
                        })

                    }
                })
                diffList.length = 0
            },500)
        }
        // debugger
    }

    const style = document.createElement('style');
    style.textContent = `
        .bold {
            font-weight: bold;
        }
        .green {
            color: green;
        }
        .blue {
            color: #6969d4;
        }
        .orange {
            color: orange;
        }
        #trade {
          min-height: 200px;
          position: relative;
          max-width: 1780px;
          margin: 0 auto 64px;
          }
    `;
    document.head.appendChild(style);

    const tryParseJSON = text => {
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            if (e instanceof SyntaxError) {
                return text;
            }
            throw e;
        }
        return json;
    };
})();