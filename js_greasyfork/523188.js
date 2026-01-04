// ==UserScript==
// @name        g
// @description 去
// @namespace   maomao1996.kill-watermark
// @version     1.0.1
// @author      solid
// @license     MIT
// @match       *://*.gaoding.com/editor/*
// @grant       GM_addStyle
// @require     https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js
// @require     https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/523188/g.user.js
// @updateURL https://update.greasyfork.org/scripts/523188/g.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Firebase 配置
    const firebaseConfig = {
        apiKey: "AIzaSyOF6DjuLcQ063hv7w49tO1ods89wMPju00",
        authDomain: "gaoding-c4345.firebaseapp.com",
        databaseURL: "https://gaoding-c4345-default-rtdb.firebaseio.com",
        projectId: "gaoding-c4345",
        storageBucket: "gaoding-c4345.firebasestorage.app",
        messagingSenderId: "994911943377",
        appId: "1:994911943377:web:70e0e41aade96622efa3f0",
        measurementId: "G-4WHM3GXJJD"
    };

    // 初始化 Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    window.addEventListener('load', function() {
        // 创建验证对话框
        function createDialog() {
            const dialog = document.createElement('div');
            dialog.style = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                z-index: 999999;
                text-align: center;
            `;

            dialog.innerHTML = `
                <h3 style="margin-bottom: 15px;">请输入注册码</h3>
                <input type="text" id="codeInput" style="width: 200px; padding: 5px; margin-bottom: 10px;">
                <br>
                <button id="verifyBtn" style="padding: 5px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">验证</button>
            `;

            document.body.appendChild(dialog);

            document.getElementById('verifyBtn').onclick = function() {
                const code = document.getElementById('codeInput').value;
                database.ref('licenses/' + code).once('value').then((snapshot) => {
                    const license = snapshot.val();
                    if (license && license.valid) {
                        const expiryDate = new Date(license.expiresAt);
                        if (new Date() < expiryDate) {
                            localStorage.setItem('gaodingVerified', 'true');
                            localStorage.setItem('gaodingExpiry', license.expiresAt);
                            localStorage.setItem('gaodingCode', code);
                            dialog.remove();
                            initScript();
                            alert(`验证成功！有效期至：${expiryDate.toLocaleDateString()}`);
                        } else {
                            alert('注册码已过期！');
                        }
                    } else {
                        alert('注册码无效或已被禁用！');
                    }
                }).catch((error) => {
                    console.error('验证失败:', error);
                    alert('验证失败，请重试！');
                });
            };
        }

        // 检查注册码状态
        function checkLicenseStatus() {
            return new Promise((resolve) => {
                const code = localStorage.getItem('gaodingCode');
                if (!code) {
                    resolve(false);
                    return;
                }

                database.ref('licenses/' + code).once('value').then((snapshot) => {
                    const license = snapshot.val();
                    if (!license || !license.valid || new Date() > new Date(license.expiresAt)) {
                        localStorage.clear();
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }).catch(() => resolve(false));
            });
        }

        // 初始化脚本
        function initScript() {
            GM_addStyle(`
                div[style*="visibility"][style*="display"][style*="position"][style*="top"][style*="left"] {
                    clip-path:circle(0) !important;
                }
                .water,.watermark {
                    clip-path:circle(0)!;
                    display:none;
                }
                .material-water-mark{
                    clip-path:circle(0)!;
                    display:none;
                }
                div[style*="pointer-events"][style*="background"][style*="position"][style*="top"][style*="left"] {
                    clip-path:circle(0) !important;
                }
            `);

            let GaodingData = null;
            const originalCreateObjectURL = URL.createObjectURL;
            const originalMathMax = Math.max;

            Math.max = function() {
                const args = Array.prototype.slice.call(arguments);
                const result = originalMathMax.apply(null, args);
                if (args[0] <= 500 && args[1] == 256) {
                    const sizeInfo = document.querySelector('[test-id="right-canvas-size-info"]');
                    let width = 1024;
                    if (sizeInfo) {
                        const text = sizeInfo.textContent;
                        const matches = text.match(/(\d+)\s*×\s*(\d+)/);
                        if (matches) width = matches[1];
                    }
                    return width;
                }
                return result;
            };

            URL.createObjectURL = function(blob) {
                if (blob.type === 'image/png' && blob.size > 200000) {
                    GaodingData = blob;
                } else if (blob.type == 'image/svg+xml') {
                    blob = new Blob([''], { type: 'image/svg+xml' });
                }
                return originalCreateObjectURL(blob);
            };

            const button = document.createElement('button');
            button.innerHTML = '下载';
            button.style.cssText = `
                position: fixed;
                right: 20px;
                top: 80px;
                z-index: 999;
                padding: 8px 16px;
                font-size: 14px;
                color: #FF4D4D;
                background-color: #FFD700;
                border: 1px solid #230eff;
                border-radius: 4px;
                cursor: pointer;
            `;

            button.onclick = function() {
                checkLicenseStatus().then(isValid => {
                    if (!isValid) {
                        alert('注册码已失效，请重新验证！');
                        localStorage.clear();
                        location.reload();
                        return;
                    }

                    if (GaodingData) {
                        const url = URL.createObjectURL(GaodingData);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = '无水印设计_' + new Date().getTime() + '.png';
                        link.click();
                        URL.revokeObjectURL(url);
                    } else {
                        alert('请先编辑或移动模板');
                    }
                });
            };

            document.body.appendChild(button);
        }

        // 启动脚本
        checkLicenseStatus().then(isValid => {
            if (isValid) {
                initScript();
            } else {
                setTimeout(createDialog, 2000);
            }
        });
    });
})();