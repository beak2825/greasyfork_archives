// ==UserScript==
// @name         爱奇艺清流下载
// @license      GPL-3.0-only
// @namespace    http://tampermonkey.net/
// @description  用于爱奇艺清流下载
// @author       TSCats
// @version      1.0.2
// @match        *://116.211.227.43/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/494992/%E7%88%B1%E5%A5%87%E8%89%BA%E6%B8%85%E6%B5%81%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/494992/%E7%88%B1%E5%A5%87%E8%89%BA%E6%B8%85%E6%B5%81%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let urlParamsObject = {};
    window.location.search
        .substring(1) // 去掉开头的问号
        .split('&') // 分割成键值对数组
        .forEach(function(pair) {
            var keyValue = pair.split('=');
            urlParamsObject[keyValue[0]] = decodeURIComponent(keyValue[1]); // 解码并存储到对象中
        });

    const baseUrl = "http://127.0.0.1:3001"

    const _open = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function (...args) {
        this.addEventListener("load", () => {
            try {
                // console.log('my-load',args);
                // if(args[0] === 'GET'&&args[1].indexOf('.ts?') !== -1){
                //     downTs(args[1]);
                // }
                if(args[0] === 'GET'&&args[1].indexOf('.m3u8?') !== -1){
                    downM3U8(args[1]);
                }
            } catch { }
        });
        // checkUrl(args[1]);
        return _open.apply(this, args);
    }

    function downM3U8(url){
        let idName = urlParamsObject.tvid;
        const data = {
            videoUrl:urlParamsObject.videoUrl,
            url: url,
            idName
        };
        const response = fetch(baseUrl+'/parse-m3u8', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        if (response.ok) {
            //
        }
    }

    function downTs(tsUrl) {

        const data = {
            url: tsUrl
        };
        const response = fetch(baseUrl+'/download', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        if (response.ok) {
            //
        }
    }




})();
