// ==UserScript==
// @name         小红书 WEb页面数据提取
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  优化后的版本，用于更好地监控和调试特定XHR请求
// @author       You_Optimized
// @match        *.xiaohongshu.com/user/profile/*
// @match        *.xiaohongshu.com/explore/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522354/%E5%B0%8F%E7%BA%A2%E4%B9%A6%20WEb%E9%A1%B5%E9%9D%A2%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/522354/%E5%B0%8F%E7%BA%A2%E4%B9%A6%20WEb%E9%A1%B5%E9%9D%A2%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 创建按钮并添加到页面
    const button = document.createElement('div');
    button.id = 'floatingButton';
    button.textContent = '复制';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.width = '100px';
    button.style.height = '40px';
    button.style.lineHeight = '40px';
    button.style.textAlign = 'center';
    button.style.backgroundColor = '#f1f1f1';
    button.style.border = '1px solid #ccc';
    button.style.cursor = 'pointer';
    button.style.userSelect = 'none';
    button.style.zIndex = '1000';

    // 鼠标按下时记录初始位置
    let isDragging = false;
    let startX, startY;

    button.addEventListener('mousedown', (event) => {
        event.preventDefault();
        startX = event.clientX - parseFloat(button.style.right || 0);
        startY = event.clientY - parseFloat(button.style.bottom || 0);
        isDragging = true;
    });

    // 鼠标移动时更新按钮位置
    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            button.style.right = `${event.clientX - startX}px`;
            button.style.bottom = `${event.clientY - startY}px`;
        }
    });

    // 鼠标释放时停止拖动
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });


    // 点击按钮时的行为
    button.addEventListener('click', () => {
        button.textContent = '已复制';
        // 这里可以添加实际的复制到剪贴板的代码

        let user_info = window.__INITIAL_STATE__['user']['userPageData']['_rawValue']
        if (user_info) {
            let nickname = user_info['basicInfo']['nickname']
            let redId = user_info['basicInfo']['redId']
            let ipLocation = user_info['basicInfo']['ipLocation']
            let desc = user_info['basicInfo']['desc']
            let gender = user_info['basicInfo']['gender']
            if (gender) {
                gender = "女"
            } else {
                gender = "男"
            }
            let follows = 0;
            let interaction = 0;
            let fans = 0;

            for (let i = 0; i < user_info['interactions'].length; i++) {
                let item = user_info['interactions'][i]
                if (item['type'] == "follows") {
                    follows = item['count']
                }
                if (item['type'] == "fans") {
                    fans = item['count']
                }
                if (item['type'] == "interaction") {
                    interaction = item['count']
                }
            }

            desc = desc.replaceAll("\t","").replaceAll("\n","").replaceAll("\r","");
            let excelData = `${nickname}\t${redId}\t${ipLocation}\t${gender}\t${follows}\t${fans}\t${interaction}\t${desc}`;
            navigator.clipboard.writeText(excelData).then(function () {
                console.log('文本已复制到剪贴板');
                // 复制成功的操作
            }).catch(function (err) {
                console.error('复制文本到剪贴板时出错：', err);
                // 复制失败的操作
            });
        }


    });

    // 鼠标移出后恢复为“复制”
    button.addEventListener('mouseleave', () => {
        button.textContent = '复制';
    });

    // 将按钮添加到页面
    document.body.appendChild(button);
})();
