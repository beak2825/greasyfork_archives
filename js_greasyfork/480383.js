// ==UserScript==
// @name         Amazon Deal Notifier
// @namespace    https://www.amazon.com/
// @version      1.3
// @description  Notifies when the claimed percentage exceeds a specified value on Amazon product page
// @author       leon
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.staticfile.org/lodash.js/4.17.21/lodash.min.js
// @match        https://www.amazon.com/dp/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/480383/Amazon%20Deal%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/480383/Amazon%20Deal%20Notifier.meta.js
// ==/UserScript==


(function () {
    'use strict';
    
    const thresholdPercentage = 80; //进度预警值
    const reloadPageTime = 180; //几秒刷新一次页面

    function postData(url, data) {
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data: JSON.stringify(data),
                onload(xhr) {
                    resolve(xhr.responseText);
                }
            });
        });
    }


    jQuery.fn.wait = function (func, times, interval) {
        var _times = times || 20, // 20次
            _interval = interval || 150, // 150毫秒每次
            _selector = this.selector; // 选择器

        return new Promise(function (resolve, reject) {
            var checkElement = function () {
                var _self = $(_selector); // 选择元素

                if (_self.length) {
                    // 如果获取到元素，执行传入的函数
                    func && func.call(_self);
                    resolve(_self); // 解析Promise
                } else if (_times === 0) {
                    // 如果超过次数仍未获取到元素，抛出异常
                    reject(new Error('Failed to find element'));
                } else {
                    _times--; // 次数减1
                    setTimeout(checkElement, _interval); // 延迟执行检查元素的函数
                }
            };

            checkElement(); // 开始检查元素
        });
    };

    const zipCodeSpan = document.getElementById('glow-ingress-line2');
    function getTime() {
        // 创建一个新的Date对象
        var currentDate = new Date();
        // 获取当前日期的各个部分
        var year = currentDate.getFullYear();
        var month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        var day = currentDate.getDate().toString().padStart(2, "0");
        var hours = currentDate.getHours().toString().padStart(2, "0");
        var minutes = currentDate.getMinutes().toString().padStart(2, "0");
        var seconds = currentDate.getSeconds().toString().padStart(2, "0");
        // 构建日期字符串
        var formattedDate = month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        // 返回当前日期
        return formattedDate
    }
    function sendFeiShu(req){
        let asin = getAsin(), msg = `${asin} ${req}`
        const url = `https://open.feishu.cn/open-apis/bot/v2/hook/6d041066-aa78-465e-94c6-fc764f80e460`;
        let data = {
            "msg_type": "post",
            "content": {
                "post": {
                    "zh_cn": {
                        "title": msg,
                        "content": [
                            [{
                                "tag": "text",
                                "text": req,
                            }
                            ]
                        ]
                    }
                }
            }
        }
        postData(url, data)
            .then(response => console.log('sent feishu result-->', response))
            .catch(error => console.error('Error sending feishu msg:', error));

    }

    function sendMsg1(req){
        const notificationURL = `https://sctapi.ftqq.com/SCT111882TXlSjPqV8HFPNhwZwkTpmGHbB.send`;
        let asin = getAsin(),
            msg = `${asin} ${req}`

        postData(notificationURL, {title: msg})
            .then(response => console.log('sendMsg1: ', response))
            .catch(error => console.error('sendMsg1 Error:', error));

    }

    function sendMsg(req) {
            sendMsg1(req);
            sendFeiShu(req);
    }

    function getAsin() {
        // 获取当前网页的URL
        var url = window.location.href;
        // 匹配URL中的B0C9GVXT1D段的值
        var regex = /\/dp\/([A-Z0-9]+)\?/i;
        var match = url.match(regex);
        // 提取匹配到的值
        var asin = match && match[1];
        return asin
    }
    function getZipCode() {
        if (!zipCodeSpan) {
            return false
        }
        return zipCodeSpan.innerText.replace(/[^0-9]/ig, "");
    }
    function checkZipCode() {
        let code = getZipCode()
        console.log("current Deliver to===>", code);
        if (code && code == "10001") {
            return true
        }
        console.log("开始切换地区===>", code);
        zipCodeSpan.click()
        $('#GLUXZipUpdateInput').wait().then(function(el) {
            $("#GLUXZipUpdateInput").val("10001")
            setTimeout(function () {
                $("#GLUXZipUpdate-announce").click()
            }, 800);
            setTimeout(function () {
                window.location.reload();
            }, 2000);
        }).catch(function(error) {
            console.error('Failed to find element:', error);
            sendMsg(`页面加载异常，再在重试刷新～`)
            setTimeout(function () {
                window.location.reload();
            }, 3000);
        });
    }
    checkZipCode();


    // 监控是否达到阈值
    setInterval(() => {
        const spanElement = document.getElementById('dealsx_percent_message');
        if (!spanElement) {
            return false
        }
        const claimedPercentage = parseInt(spanElement.innerText);
        console.log(`实时进度---> 【 ${claimedPercentage}% 】 预警值=${thresholdPercentage} `, getTime())
        if (claimedPercentage > thresholdPercentage) {
            sendMsg(`进度---> ${claimedPercentage}%`)
        }
    }, 8000);

    // 定时刷新网页，防止进度条没更新
    setInterval(() => {
        window.location.reload();
    }, reloadPageTime * 1000);

})();