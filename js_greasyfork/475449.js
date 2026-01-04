// ==UserScript==
// @name         Cloudreve缩略图刷新
// @namespace    http://tampermonkey
// @version      1
// @description  强制刷新缩略图生成失败的文件，原理为修改扩展名为bin再修改回来，触发缩略图的刷新。
// @match        *pan.alonealone.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/475449/Cloudreve%E7%BC%A9%E7%95%A5%E5%9B%BE%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/475449/Cloudreve%E7%BC%A9%E7%95%A5%E5%9B%BE%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Create a button and append it to the page
    var button = document.createElement('button');
    button.textContent = '全部重新生成缩略图';
    button.style.position = 'fixed';
    button.style.top = '120px';
    button.style.right = '60px';
    document.body.appendChild(button);

    // Add a click event listener to the button
    button.addEventListener('click', function () {
        let path = decodeURIComponent(new URL(window.location.href).search).substring(6);
        let flagList = []
        let fileNum = 0
        // 请求接口，获取文件列表
        fetch("https://pan.alonealone.com/api/v3/directory" + path, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
                "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Microsoft Edge\";v=\"116\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://pan.alonealone.com/home?path=" + path,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => response.json()).then(data => {
            console.log('Get filelist data:')
            console.log(data);
            // 获取文件的数量
            for (let file of data.data.objects) {
                if (file.type == 'file') {
                    fileNum += 1;
                }
            }
            // 遍历重命名文件名
            for (let file of data.data.objects) {
                if (file.type == 'file') {
                    fetch("https://pan.alonealone.com/api/v3/object/rename", {
                        "headers": {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
                            "content-type": "application/json",
                            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Microsoft Edge\";v=\"116\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin"
                        },
                        "referrer": "https://pan.alonealone.com/home?path=" + path,
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": "{\"action\":\"rename\",\"src\":{\"dirs\":[],\"items\":[\"" + file.id + "\"]},\"new_name\":\"" + file.name + "tmp\"}",
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    }).then(response => response.json()).then(data => {
                        let renameData = data;
                        if (renameData.code == '0') {
                            console.log(file.name + '+bin rename success!');
                            //再把名字改回来
                            fetch("https://pan.alonealone.com/api/v3/object/rename", {
                                "headers": {
                                    "accept": "application/json, text/plain, */*",
                                    "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
                                    "content-type": "application/json",
                                    "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Microsoft Edge\";v=\"116\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin"
                                },
                                "referrer": "https://pan.alonealone.com/home?path=" + path,
                                "referrerPolicy": "strict-origin-when-cross-origin",
                                "body": "{\"action\":\"rename\",\"src\":{\"dirs\":[],\"items\":[\"" + file.id + "\"]},\"new_name\":\"" + file.name + "\"}",
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            }).then(response => response.json()).then(data => {
                                let renameData = data;
                                if (renameData.code == '0') {
                                    console.log(file.name + ' rename back success!');
                                }
                                //每完成一个标记一个
                                flagList.push(1);
                                if (flagList.length == fileNum) { //所有的都完成了就刷新页面
                                    location.reload();
                                }
                            }).catch(error => console.error(error))
                        }
                    }).catch(error => console.error(error))
                }
            }
        }).catch(error => console.error(error))
    });
})();