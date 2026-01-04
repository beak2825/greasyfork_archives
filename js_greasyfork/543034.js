// ==UserScript==
// @name          广州商学院教务系统下载所有成绩
// @namespace     https://github.com/poboll/gcc-cjcx
// @version       1.3
// @description   修复版：在广州商学院教务系统成绩查询页面，增加一个“导出所有成绩”的按钮，方便导出所有学期的成绩。
// @author        在虎2025
// @homepageURL   https://poboll.github.io/gcc-cjcx/
// @homepage      https://poboll.github.io/gcc-cjcx/
// @supportURL    https://github.com/poboll/gcc-cjcx/issues
// @match         https://jwxt.gcc.edu.cn/cjcx/cjcx_cxDgXscj.html*
// @grant         none
// @license MIT
// @copyright     2025, 在虎
// @downloadURL https://update.greasyfork.org/scripts/543034/%E5%B9%BF%E5%B7%9E%E5%95%86%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89%E6%88%90%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/543034/%E5%B9%BF%E5%B7%9E%E5%95%86%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89%E6%88%90%E7%BB%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心函数：初始化脚本
    function initializeScript() {
        // --- 从页面中获取必需的 CSRF token ---
        var csrftokenInput = document.querySelector('#csrftoken');
        var csrftoken = csrftokenInput ? csrftokenInput.value : null;

        if (!csrftoken) {
            console.error('GCC成绩导出脚本: 关键安全令牌(csrftoken)未找到, 脚本无法执行导出。');
            return; // 如果没有token，提前终止
        }

        // 1. 创建一个隐藏的下载链接，用于后续触发文件下载
        var downloadLink = document.createElement('a');
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);

        // 2. 创建一个新的“导出所有成绩”按钮
        var exportAllBtn = document.createElement('button');
        exportAllBtn.type = 'button';
        exportAllBtn.className = 'btn btn-default btn_dc';
        exportAllBtn.style.marginLeft = '5px';
        exportAllBtn.innerHTML = '<i class="bigger-100 glyphicon glyphicon-export"></i> 导出所有成绩';

        // 3. 创建一个弹窗，点击按钮时会显示项目信息
        var projectUrl = 'https://github.com/poboll/gcc-cjcx';
        var popupHtml = '' +
            '<div id="popup-window" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">' +
            '    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 10px; text-align: center; font-family: sans-serif;">' +
            '        <h3>脚本信息</h3>' +
            '        <p>项目主页: <a href="' + projectUrl + '" target="_blank" style="color: #0366d6; text-decoration: none;">' + projectUrl.replace('https://','') + '</a></p>' +
            '        <p>如果觉得好用，欢迎点个 Star 支持一下！</p>' +
            '        <img id="qrcode" src="" alt="GitHub项目地址二维码" style="margin-top: 10px; max-width: 180px; max-height: 180px;">' +
            '        <p style="font-size: 14px;">扫码访问项目主页</p>' +
            '        <p style="margin-top: 20px; font-size: 12px; color: #888;">&copy; 2025 在虎</p>' +
            '        <button id="close-popup" style="margin-top: 15px; padding: 8px 16px; border-radius: 5px; border: 1px solid #ccc; background-color: #f0f0f0; cursor: pointer;">关闭</button>' +
            '    </div>' +
            '</div>';
        document.body.insertAdjacentHTML('beforeend', popupHtml);

        // 获取弹窗相关元素
        var popupWindow = document.querySelector('#popup-window');
        var qrcodeImg = document.querySelector('#qrcode');
        var closePopupButton = document.querySelector('#close-popup');

        // 设置二维码图片
        var qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(projectUrl) + '&size=200x200';
        if (qrcodeImg) {
            qrcodeImg.src = qrCodeUrl;
        }

        // 绑定弹窗关闭按钮事件
        if (closePopupButton) {
            closePopupButton.addEventListener('click', function() {
                if (popupWindow) popupWindow.style.display = 'none';
            });
        }

        // 4. 绑定“导出所有成绩”按钮的点击事件
        exportAllBtn.addEventListener('click', function() {
            if (popupWindow) popupWindow.style.display = 'block'; // 显示弹窗

            function downFile(blob) {
                downloadLink.download = "GCC_全部成绩_" + new Date().getTime() + ".xlsx";
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.click();
                URL.revokeObjectURL(downloadLink.href);
            }

            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/cjcx/cjcx_dcXsKccjList.html', true);
            xhr.responseType = 'blob';
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            // 5. 核心：构造请求数据
            var data = 'gnmkdmKey=N305005&xnm=&xqm=&dcclbh=JW_N305005_GLY&exportModel.selectCol=kcmc%40%E8%AF%BE%E7%A8%8B%E5%90%8D%E7%A7%B0&exportModel.selectCol=xnmmc%40%E5%AD%A6%E5%B9%B4&exportModel.selectCol=xqmmc%40%E5%AD%A6%E6%9C%9F&exportModel.selectCol=kkbmmc%40%E5%BC%80%E8%AF%BE%E5%AD%A6%E9%99%A2&exportModel.selectCol=kch%40%E8%AF%BE%E7%A0%81&exportModel.selectCol=jxbmc%40%E6%95%99%E5%AD%A6%E7%8F%AD&exportModel.selectCol=xf%40%E5%AD%A6%E5%88%86&exportModel.selectCol=xmcj%40%E6%88%90%E7%BB%A9&exportModel.selectCol=xmblmc%40%E6%88%90%E7%BB%A9%E5%88%86%E9%A1%B9&exportModel.exportWjgs=xls&fileName=%E5%AD%A6%E7%94%9F%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA&csrftoken=' + csrftoken;

            xhr.onload = function() {
                if (xhr.status === 200) {
                    downFile(xhr.response);
                } else {
                    alert("导出失败！错误码：" + xhr.status + "。请按F12打开控制台(Console)查看详细错误。");
                    console.error("请求失败，状态码：" + xhr.status, xhr.statusText);
                }
            };
            xhr.onerror = function() {
                alert("导出失败！请求发生网络错误。");
                console.error("请求发生错误");
            };
            xhr.send(data);
        });

        // 6. 将新创建的按钮添加到页面的按钮工具栏中
        var butAncd = document.querySelector('#but_ancd');
        if (butAncd) {
            butAncd.appendChild(exportAllBtn);
        } else {
            console.warn("GCC成绩导出脚本: 未找到 '#but_ancd' 元素，导出按钮未能添加。");
        }
    }

    // 使用 MutationObserver 监听 #but_ancd 元素的出现
    var observer = new MutationObserver(function(mutations, obs) {
        var butAncd = document.querySelector('#but_ancd');
        if (butAncd) {
            initializeScript(); // 找到元素后执行初始化
            obs.disconnect(); // 找到并执行后，停止观察
        }
    });

    // 开始观察 document.body 的子节点变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 备用：如果页面加载很快，#but_ancd 可能已经存在，此时直接尝试初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        var butAncdCheck = document.querySelector('#but_ancd');
        if (butAncdCheck) {
            initializeScript();
            observer.disconnect(); // 如果已经执行，停止观察
        }
    }

})();