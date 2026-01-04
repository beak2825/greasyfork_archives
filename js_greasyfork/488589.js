// ==UserScript==
// @name         LE英文BD转中文
// @namespace    https://space.bilibili.com/36183305
// @version      1.3
// @description  从lastepochtools模拟器复制BD到踩蘑菇BD模拟器
// @author       牛奶来点辣
// @match        https://www.lastepochtools.com/planner/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @icon         https://i2.hdslb.com/bfs/face/c68d95defb5f33cde509cb46dc44cc3222de0206.jpg@96w_96h_1c_1s_!web-avatar.webp
// @downloadURL https://update.greasyfork.org/scripts/488589/LE%E8%8B%B1%E6%96%87BD%E8%BD%AC%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/488589/LE%E8%8B%B1%E6%96%87BD%E8%BD%AC%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在页面加载完成后执行的代码
    window.addEventListener('load', function() {

        // 查找 class="buttons nav my-builds" 的 div 元素
        const myBuildsDiv = document.querySelector('.buttons.nav.my-builds');

        // 如果找到了 div 元素
        if (myBuildsDiv) {
            // 创建包含按钮样式的 <a> 元素
            const buttonContainer = document.createElement('a');
            buttonContainer.id = 'btn-my-builds-add';
            buttonContainer.className = 'btn mybuilds-add';
            buttonContainer.style.cssText = 'cursor: pointer;'; // 添加一些样式，确保鼠标移动到按钮上时显示手型

            // 创建按钮图标
            const iconSpan = document.createElement('span');
            const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgIcon.setAttribute('height', '24');
            svgIcon.setAttribute('width', '24');
            svgIcon.style.fill = '#e3ba6b!important';
            svgIcon.innerHTML = '<path d="M5 21V5q0-.825.588-1.413Q6.175 3 7 3h6v2H7v12.95l5-2.15 5 2.15V11h2v10l-7-3ZM7 5h6-1Zm10 4V7h-2V5h2V3h2v2h2v2h-2v2Z"></path>';
            iconSpan.appendChild(svgIcon);

            // 创建按钮文本
            const buttonTextDiv = document.createElement('div');
            buttonTextDiv.className = 'button-text';
            buttonTextDiv.textContent = '复制到踩蘑菇';

            // 将按钮图标和文本添加到包含按钮样式的 <a> 元素中
            buttonContainer.appendChild(iconSpan);
            buttonContainer.appendChild(buttonTextDiv);

            // 按钮点击事件
            buttonContainer.addEventListener('click', function() {

                console.log('复制');

                // 模拟点击事件，触发任务执行
                buttonClickHandler();
            });

            // 将包含按钮样式的 <a> 元素添加到 div 元素中
            myBuildsDiv.appendChild(buttonContainer);
        }
    });

    // 模拟按钮点击事件的处理程序
    function buttonClickHandler() {
        const c = le_nk()
          , d = le_ok()
          , e = le_mj;
        le_mj = le_nj.Average;
        le_1h();
        const f = {
            data: le_En(),
            ehp: le_Kn(),
            buffs: le_Gn(),
            tags: le_Jn(c, d)
        };
        le_mj = e;
        le_1h();
        le_0h();
        const datastr = JSON.stringify({
            data: JSON.stringify(le_Bd()),
            tags: JSON.stringify([c, d]),
            precalcData: JSON.stringify(f)
        });

        // 发送POST请求
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://lastepoch.caimogu.cc/planner/save_build",
            data: datastr,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                // 使用正则表达式提取所需值
                const matchResult = response.responseText.match(/"id":"([^"]+)"/);
                const extractedValue = matchResult ? matchResult[1] : null;

                // 输出返回值到控制台
                console.log( `https://lastepoch.caimogu.cc/planner.html?id=${extractedValue}`);

                // 提示用户是否跳转或复制到剪切板
                const confirmResult = confirm("任务执行完成，是否跳转到指定页面？取消会复制链接到剪切板");
                if (confirmResult) {
                    // 跳转到指定页面
                    window.location.href = `https://lastepoch.caimogu.cc/planner.html?id=${extractedValue}`;
                } else {
                    // 复制到剪切板
                    GM_setClipboard( `https://lastepoch.caimogu.cc/planner.html?id=${extractedValue}`, "text");
                    alert("返回值已复制到剪切板");
                }
            },
            onerror: function(error) {
                console.error("POST请求失败:", error);
            }
        });
    }
})();