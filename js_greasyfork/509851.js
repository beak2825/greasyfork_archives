// ==UserScript==
// @name         深圳教师网公需课（自动播放）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动播放视频并允许选择播放速度。
// @author       keke31h
// @license      MIT
// @match        https://www.0755tt.com/video?*
// @match        https://m.0755tt.com/video?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509851/%E6%B7%B1%E5%9C%B3%E6%95%99%E5%B8%88%E7%BD%91%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/509851/%E6%B7%B1%E5%9C%B3%E6%95%99%E5%B8%88%E7%BD%91%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playbackRate = 1; // 默认播放速度

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .izlx-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 9999;
            max-width: 90%;
            width: 400px;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
        }
        .izlx-dialog h2 {
            margin-top: 0;
            color: #333;
            font-size: 24px;
            text-align: center;
        }
        .izlx-btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 5px;
            border: none;
            border-radius: 5px;
            background-color: #4CAF50;
            color: white;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .izlx-btn:hover {
            background-color: #45a049;
        }
        .izlx-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
        }
    `;
    document.head.appendChild(style);

    // 创建并显示播放速度选择对话框
    function showPlaybackRateDialog() {
        const overlay = document.createElement('div');
        overlay.classList.add('izlx-overlay');
        document.body.appendChild(overlay);

        const dialog = document.createElement('div');
        dialog.classList.add('izlx-dialog');
        dialog.innerHTML = `
            <h2>选择播放速度</h2>
            <div class="izlx-btn-group">
                <button class="izlx-btn rateBtn" data-rate="1">1倍速</button>
                <button class="izlx-btn rateBtn" data-rate="2">2倍速</button>
                <button class="izlx-btn rateBtn" data-rate="4">4倍速</button>
                <button class="izlx-btn rateBtn" data-rate="8">8倍速</button>
                <button class="izlx-btn rateBtn" data-rate="16">16倍速</button>
            </div>
        `;
        document.body.appendChild(dialog);

        dialog.querySelectorAll('.rateBtn').forEach(btn => {
            btn.addEventListener('click', function() {
                playbackRate = parseInt(this.getAttribute('data-rate'));
                dialog.style.opacity = '0';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    dialog.remove();
                    overlay.remove();
                    activateScript();
                }, 300);
            });
        });
    }

    // 激活脚本功能
    function activateScript() {
        setInterval(function(){
            // 自动点击弹窗按钮
            let popupButton = Array.from(document.querySelectorAll('button.el-button.el-button--primary.el-button--medium')).find(el => el.textContent.trim() === '确 定');
            if (popupButton) {
                popupButton.click();
            }
        }, 5000); // 每5秒检测一次

        // 自动设置播放速度为选择的倍速
        setInterval(function(){
            let video = document.querySelector('video');
            if (video && video.playbackRate !== playbackRate) {
                video.playbackRate = playbackRate;
            }
        }, 1000); // 每秒检测一次
    }

    // 直接显示播放速度选择对话框
    showPlaybackRateDialog();
})();