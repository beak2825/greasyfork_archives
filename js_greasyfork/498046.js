// ==UserScript==
// @name         推理罪自动打卡签到
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  推理罪网站自动打卡签到，打开网站任意页面就可以打卡和完成任务。
// @author       forkfox
// @match        https://www.tuiliz.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498046/%E6%8E%A8%E7%90%86%E7%BD%AA%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/498046/%E6%8E%A8%E7%90%86%E7%BD%AA%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //send数据函数

    //参数1：url;参数2：请求类型get或post;参数3：post的body;
    function runAsync(url,send_type,data_ry) {

        var p = new Promise((resolve, reject) => {

            GM.xmlHttpRequest({
                method: send_type,
                url: url,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                data:data_ry,
                onload: function(response){
                    resolve(response.responseText);
                },
                onerror: function(response){
                    reject("请求失败");
                }
            });

        })

        return p;
    }

    function doTask(){
        runAsync("/home.php?mod=task&do=apply&id=6","GET").then((result)=> {return result;}).then(function(result){
            if (result != "请求失败") {
                showPrompt(null, null, '<span>已成功执行今日任务</span>', 1500);
                showCreditPrompt();
            } else {
                showPrompt(null, null, '<span>任务失败</span>', 1500);
            }
        });
    }

    function doSign(link){
        runAsync(link,"GET").then((result)=> {return result;}).then(function(result){
            if (result != "请求失败") {
                showPrompt(null, null, '<span>已成功签到</span>', 1500);
            } else {
                showPrompt(null, null, '<span>签到失败</span>', 1500);
            }
        });
    }

    function checkAndDoAll(){
        runAsync("/plugin.php?id=zqlj_sign", "GET").then((result)=> {return result;}).then(function(result){
            const regex = /<a href="(plugin\.php\?id=zqlj_sign&sign=[^"]*)"[^>]*>(.*?)<\/a>/;
            const match = result.match(regex);

            if (match) {
                const hrefValue = match[1];
                const linkText = match[2];

                if (linkText === "点击打卡") {
                    doSign(hrefValue);
                    return;
                }

                showPrompt(null, null, '<span>今日已签到</span>', 1500);
            }
        });

        runAsync("/home.php?mod=task&do=view&id=6","GET").then((result)=> {return result;}).then(function(result){
            if (result.indexOf('<img src="static/image/task/disallow.gif"') !== -1) {
                showPrompt(null, null, '<span>今日任务已完成</span>', 1500);
                return;
            }
            doTask();
        });
    }

    checkAndDoAll();
})();