// ==UserScript==
// @name         跳过人脸
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  拦截并修改请求中的 image 参数
// @author       YourName
// @match        http://uamportal.paas.sc.ctc.com:22002/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526265/%E8%B7%B3%E8%BF%87%E4%BA%BA%E8%84%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/526265/%E8%B7%B3%E8%BF%87%E4%BA%BA%E8%84%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
     // 创建文件选择输入框
    let inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = 'image/png'; // 限制选择 PNG 图片


    // 监听文件选择事件
    inputFile.addEventListener('change', function(event) {
        let file = event.target.files[0];
        if (file && file.type === 'image/png') {
            let reader = new FileReader();
            reader.onload = function(e) {
                // 获取 Base64 编码
                let base64String = e.target.result;
                console.log(base64String);
                window.loginForFace(base64String)
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid PNG image.");
        }
    });

    window.selectFaceImage = function() {
        inputFile.click();
    };

    // 确保 startFaceAuth 函数已经加载
    const waitForTakePhoto = setInterval(() => {


        if (typeof window.takePhoto === 'function') {
            clearInterval(waitForTakePhoto);

            // 保存原始的 startFaceAuth 方法
            const takePhoto = window.takePhoto;

            // 替换 startFaceAuth 方法
            window.takePhoto = function(...args) {
                window.selectFaceImage();
            };
        }
    }, 100); // 每100毫秒检查一次，直到函数可用

})();
