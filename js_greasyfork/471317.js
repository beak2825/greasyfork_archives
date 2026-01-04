// ==UserScript==
// @name         长按鼠标右键进行截图操作并展示识别结果
// @namespace    http://your.namespace/
// @version      1.0
// @description  长按鼠标右键进行截图操作并发送给百度识图进行识别，并在浮动的 DIV 中展示识别结果
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @resource     html2canvas https://pan.baidu.com/s/1GP6JSA9xTbWxNx69LKFT-g?pwd=4t8a
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471317/%E9%95%BF%E6%8C%89%E9%BC%A0%E6%A0%87%E5%8F%B3%E9%94%AE%E8%BF%9B%E8%A1%8C%E6%88%AA%E5%9B%BE%E6%93%8D%E4%BD%9C%E5%B9%B6%E5%B1%95%E7%A4%BA%E8%AF%86%E5%88%AB%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/471317/%E9%95%BF%E6%8C%89%E9%BC%A0%E6%A0%87%E5%8F%B3%E9%94%AE%E8%BF%9B%E8%A1%8C%E6%88%AA%E5%9B%BE%E6%93%8D%E4%BD%9C%E5%B9%B6%E5%B1%95%E7%A4%BA%E8%AF%86%E5%88%AB%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 引入html2canvas库
    var script = document.createElement('script');
    script.src = GM_getResourceURL('html2canvas');
    document.head.appendChild(script);

    var pressTimer; // 用于记录长按右键的计时器

    // 添加浮动的 DIV 元素
    var resultDiv = document.createElement('div');
    resultDiv.style.position = 'fixed';
    resultDiv.style.top = '100px';
    resultDiv.style.right = '20px';
    resultDiv.style.width = '200px';
    resultDiv.style.height = '100px';
    resultDiv.style.backgroundColor = 'white';
    resultDiv.style.border = '1px solid black';
    resultDiv.style.zIndex = '9999';
    resultDiv.style.display = 'none'; // 初始时隐藏

    document.body.appendChild(resultDiv);

    // 添加鼠标右键按下事件监听
    document.addEventListener('mousedown', function(event) {
        if (event.button === 2) { // 右键按下
            // 开始计时，设置延时1000毫秒后执行截图操作
            pressTimer = setTimeout(function() {
                // 使用html2canvas库进行截图
                if (typeof html2canvas === 'undefined') {
                    console.error('html2canvas未定义，请确保引入了html2canvas库。');
                    return;
                }

                html2canvas(document.body).then(function(canvas) {
                    // 将canvas内容转换为base64编码的图片
                    var imageDataURL = canvas.toDataURL();

                    // 发送截图给百度识图API进行识别
                    sendToBaiduOCR(imageDataURL);
                });

            }, 1000); // 长按延时设为1000毫秒
        }
    });

    // 添加鼠标右键抬起事件监听
    document.addEventListener('mouseup', function(event) {
        if (event.button === 2) { // 右键抬起
            // 清除计时器，取消截图操作
            clearTimeout(pressTimer);
        }
    });

    // 发送截图给百度识图API进行识别
    function sendToBaiduOCR(imageDataURL) {
        // 百度API的相关配置，需要替换为您自己的API Key
        var apiKey = 'Your_Baidu_API_Key';
        var ocrUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic';

        // 图片数据
        var imageBase64 = imageDataURL.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

        // 构建请求参数
        var params = {
            image: imageBase64,
            language_type: 'CHN_ENG'
        };

        // 发送图片识别请求
        fetch(ocrUrl + '?access_token=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'image=' + encodeURIComponent(params.image) + '&language_type=' + params.language_type
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log('识别结果：', result);
            // 将识别结果展示在浮动的 DIV 中
            showResult(result);
        })
        .catch(function(error) {
            console.error('识别请求错误：', error);
        });
    }

    // 将识别结果展示在浮动的 DIV 中
    function showResult(result) {
        if (result && result.words_result && result.words_result.length > 0) {
            resultDiv.innerHTML = '识别结果：' + result.words_result[0].words;
        } else {
            resultDiv.innerHTML = '识别失败';
        }

        resultDiv.style.display = 'block'; // 显示浮动的 DIV
    }
})();
