// ==UserScript==
// @name         ks弹幕监控
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  个人自用脚本
// @author       LEO
// @match        https://zs.kwaixiaodian.com/page/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kwaixiaodian.com
// @grant        GM_xmlhttpRequest
// @license      MIT License
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/466496/ks%E5%BC%B9%E5%B9%95%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/466496/ks%E5%BC%B9%E5%B9%95%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log('可以正常运行')

    let arr = [];

    function waitForElementToLoad(selector, callback) {
        var element = document.querySelector(selector);
        if (element) {
            callback();
        } else {
            setTimeout(function() {
                waitForElementToLoad(selector, callback);
            }, 100);
        }
    }

    waitForElementToLoad('.ReactVirtualized__Grid__innerScrollContainer', function() {
        // 找到需要监控的区域
        var targetNode = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');

        // 创建MutationObserver对象，并传入回调函数
        var observer = new MutationObserver(function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const addedNode of mutation.addedNodes) {

                        var userName = addedNode.querySelector(".head--bKFP8").textContent;
                        var danmu = addedNode.querySelector(".replied-content--OFcGD").textContent;
                        var str = userName + "：" +  danmu;
                        console.log(str)

                        // 存储弹幕
                        if(arr.indexOf(str) === -1){
                            arr.push(str);
                        }

                    }
                }
            }

        });

        // 配置和开始监听
        const config = { attributes: true, childList: true, subtree: true };
        observer.observe(targetNode, config);
    });


    function save(arr){
        var today = new Date(); // 创建一个Date对象实例获取当前日期和时间
        var todayString = today.getDate() + "@" + today.getHours()+"_" + today.getMinutes();

        // 将数组转换为字符串
        var myString = arr.join('\n');

        // 创建一个Blob对象，并通过它创建一个URL以便下载
        var blob = new Blob([myString], {type: "text/plain"});
        var url = URL.createObjectURL(blob);

        // 创建一个链接，并在单击时下载文件
        var downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = todayString + "__danmu.txt";
        downloadLink.click();

        // 清理创建的URL对象
        URL.revokeObjectURL(url);
    }


    // 防止误触，导致数据丢失
    window.addEventListener('beforeunload', function() {
        console.log('离开本页面之前，请先保存数据！');
        if(arr != null){
            save(arr);
        }

    });

    // window.onbeforeunload = function() {
    //     console.log('关闭浏览器前，请先保存数据！');
    //     if(arr != null){
    //         save(arr);
    //     }
    // };

})();