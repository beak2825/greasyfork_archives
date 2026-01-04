// ==UserScript==
// @name         偷偷学习
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在网课界面点击“偷偷学习”，开启你的刷课之旅吧。脚本自动点击“开始学习、继续学习”，后台播放功能不稳定。
// @match        https://htedu.yunxuetang.cn/kng/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507750/%E5%81%B7%E5%81%B7%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/507750/%E5%81%B7%E5%81%B7%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制按钮
    let button = document.createElement('button');
    button.innerHTML = '偷偷学习';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '350px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    document.body.appendChild(button);

    let running = false;
    let goID;

    button.addEventListener('click', () => {
        if (!running) {
            button.innerHTML = '我不学了';
            running = true;
            goID = setInterval(go, 1000);
        } else {
            button.innerHTML = '偷偷学习';
            running = false;
            clearInterval(goID);
        }
    });

    function go() {
        var button1 = document.querySelectorAll('.yxtf-button.yxtf-button--primary.yxtf-button--larger');
        button1.forEach(function(按钮) {
            var spanText = 按钮.querySelector('span').textContent;
            if (spanText.includes('继续学习') || spanText.includes('开始学习')) {
                按钮.click();
            }
        });
        var button2 = document.querySelectorAll('.yxtf-button.yxtf-button--primary.yxtf-button--large');
        button2.forEach(function(按钮) {
            var spans = 按钮.querySelectorAll('span');
            spans.forEach(function(span) {
                if (span.textContent.includes('继续学习')) {
                    按钮.click();
                }
            });
        });
        var button3 = document.querySelectorAll('.ulcdsdk-nextchapterbutton');
        button3.forEach(function(按钮) {
            var spans = 按钮.querySelectorAll('span');
            spans.forEach(function(span) {
                if (span.textContent.includes('继续学习下一章节')) {
                    按钮.click();
                }
            });
        });
        var video = document.querySelector('video');
        if (video && video.paused) {
            video.play();
        }
    }

})();
