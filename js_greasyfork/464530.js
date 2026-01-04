// ==UserScript==
// @name         云图Tools_TA内容偏好下载
// @namespace    oceanengine_script
// @version      0.0.3
// @description  这是一个下载云图TA内容偏好的脚本，如果不需要它请在右上角Chrome扩展-油猴脚本中关闭它，以免对其他界面造成影响
// @match        https://*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464530/%E4%BA%91%E5%9B%BETools_TA%E5%86%85%E5%AE%B9%E5%81%8F%E5%A5%BD%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/464530/%E4%BA%91%E5%9B%BETools_TA%E5%86%85%E5%AE%B9%E5%81%8F%E5%A5%BD%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("contents have been loaded");

    function main_copy(){
        function fetchAndDownload() {
            console.log("开始执行");
            document.querySelector("[data-log-value='右侧按钮']").click();
            const col1 = ["二级类目"];
            const col2 = ["TGI"];
            const col3 = ["完播数"];
            const row_data = document.getElementsByClassName("content-table-row");

            for (let index = 0; index < 29; index++) {
                col1.push(row_data[index].getElementsByClassName("content-table-cell content-table-cell-body content-table-cell-first")[0].textContent);
                col2.push(row_data[index].getElementsByClassName("content-table-cell content-table-cell-body")[1].textContent);
                col3.push(row_data[index].getElementsByClassName("content-table-cell content-table-cell-body content-table-cell-last")[0].textContent);
            }

            const results = [];
            const data = {
                "col1": col1,
                "col2": col2,
                "col3": col3
            };

            data.col1.forEach((val, idx) => results.push(`${val}|${data.col2[idx]}|${data.col3[idx]}`));

            copyToClipboardAndShowMessage(results.join("\n"));
        }


        function copyToClipboardAndShowMessage(text) {
            navigator.clipboard.writeText(text)

            const message = document.createElement('div')
            message.innerText = '复制成功！'
            message.style.position = 'fixed'
            message.style.top = '30px'
            message.style.left = '50%'
            message.style.transform = 'translate(-50%, -50%)'
            message.style.backgroundColor = '#4CAF50'
            message.style.color = 'white'
            message.style.padding = '10px 16px'
            message.style.borderRadius = '4px'
            message.style.zIndex = '9999'
            document.body.appendChild(message)

            setTimeout(()=>{
                message.remove()
            }
                       , 3000)
        }

        // 创建一个新的按钮元素
        const copyDataBtn = document.createElement('div');
        copyDataBtn.classList.add('index__iconContainer--jt9As', 'index__iconWrap--ua1gA');
        copyDataBtn.id = 'copyDataBtn';

        // 创建按钮元素内部的HTML内容（图标和标题）
        const btnContent = `
    <div elementtiming="element-timing" data-immersive-translate-effect="1">
        <img alt="" src="http://file.modubus.com/otherpros/mediabook/PC/logo.png" elementtiming="element-timing" style="width: 24px;" data-immersive-translate-effect="1">
        <div class="index__text--OgJxz" elementtiming="element-timing" data-immersive-translate-effect="1">
            <font data-immersive-translate-effect="1">复制数据</font>
        </div>
    </div>
`;

        // 将HTML内容插入到新的按钮元素中
        copyDataBtn.innerHTML = btnContent;

        // 找到原来的按钮容器，将新按钮插入到该容器的前面
        const buttonGroup = document.getElementById('bottom_btn_group');
        buttonGroup.insertBefore(copyDataBtn, buttonGroup.firstChild);

        // 绑定点击事件，调用函数fetchAndDownload
        copyDataBtn.addEventListener('click', fetchAndDownload);

    };

    let showMessage = (message) => {
        const messageBox = document.createElement('div')
        messageBox.innerText = message;
        messageBox.style.position = 'fixed';
        messageBox.style.top = '10px';
        messageBox.style.left = '50%';
        messageBox.style.transform = 'translate(-50%, 0)';
        messageBox.style.backgroundColor = '#4CAF50';
        messageBox.style.color = 'white';
        messageBox.style.padding = '10px 16px';
        messageBox.style.borderRadius = '4px';
        messageBox.style.zIndex = '9999';
        document.body.appendChild(messageBox);

        setTimeout(()=>{
            messageBox.remove();
        }, 3000);
    };

    const checkElementsExist = () => {
        const pageContent = document.body.innerText || document.body.textContent;

        if (pageContent.indexOf("抖音观看视频兴趣分类-一级类目偏好") > -1 &&
            pageContent.indexOf("抖音观看视频兴趣分类-二级类目偏好") > -1) {
            console.log("all required elements are present");
            showMessage("加载成功！");
            main_copy();
        } else {
            console.log("not all required elements are present yet, waiting...");
            setTimeout(() => {
                checkElementsExist();
            }, 200);
        }
    };
    window.addEventListener('load', checkElementsExist, false);

})();