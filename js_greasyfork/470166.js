// ==UserScript==
// @name         迅雷云盘
// @namespace    http://tampermonkey.net/
// @version      1.6.4
// @description  获取迅雷云盘的文件链接，可利用本地播放器看视频；可将播放列表导入坚果云；可利用其他工具下载（如idm，curl，Xdown，Motrix，Aria2）。
// @author       bleu
// @run-at       document-end
// @match        https://pan.xunlei.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/470166/%E8%BF%85%E9%9B%B7%E4%BA%91%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/470166/%E8%BF%85%E9%9B%B7%E4%BA%91%E7%9B%98.meta.js
// ==/UserScript==
(function () {
    'use strict';

    setTimeout(function () {

        let reqHeaders;
        let running = {
            'runStatus': false,
        }

        // let observer = new MutationObserver(function (mutationsList) {
        //     for (let mutation of mutationsList) {
        //         if (mutation.type === 'childList') {
        //             if (mutation.target.querySelector('.file-processor')) {
        //                 handle();
        //                 break;
        //             }
        //         }
        //     }
        // });
        // observer.observe($('#__layout')[0], {
        //     childList: true,
        //     subtree: true,
        // });

        // function handle() {

        $('.search-in-app-container').prepend('<button id="my_down" type="button">获取直链</button>');
        $('#my_down').on('click', function () {
            if (running.runStatus) {
                return;
            }

            reqHeaders = {};
            reqHeaders.withCredentials = false;
            reqHeaders['content-type'] = 'application/json';
            for (let key in localStorage) {
                let temp = localStorage.getItem(key);
                if (key.indexOf('credentials') === 0) {
                    reqHeaders.Authorization = JSON.parse(temp).token_type + ' ' + JSON.parse(temp).access_token;
                    reqHeaders.clientid = key.substring(key.indexOf('_') + 1);
                }
                if (key.indexOf('captcha') === 0)
                    reqHeaders['x-captcha-token'] = JSON.parse(temp).token;
                if (key === 'deviceid')
                    reqHeaders['x-device-id'] = temp.substring(temp.indexOf('.') + 1, 32 + temp.indexOf('.') + 1);
            }

            try {
                running.runStatus = true;
                let id = $('.file-processor')[0].__vue__.fileId
                let URL = `https://api-pan.xunlei.com/drive/v1/files/${id}`;

                GM_xmlhttpRequest({
                    method: "GET",
                    timeout: 2000,
                    headers: reqHeaders,
                    url: URL,
                    onload: function (res) {
                        let value = JSON.parse(res.response || null) || res.response || res;
                        console.log(value.web_content_link)
                        alert(value.web_content_link)
                    },
                    onerror: function (err) {
                        console.log(err);
                    },
                    ontimeout: function (err) {
                        console.log(err);
                    }
                });


            } catch (error) {
                alert(error);
                running.runStatus = false;
                return;
            }
            running.runStatus = false;
        })
    }, 3000)


})();
