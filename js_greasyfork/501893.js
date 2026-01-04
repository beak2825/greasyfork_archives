// ==UserScript==
// @name         访客登记版：网页数据提取器
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  从特定网页手动提取姓名（拆分为姓和名）、手机号、部门和公司，并通过API发送到Notion数据库
// @match        https://ibpm.h3c.com/bpm/r?wf_num=R_S003_B036*
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/501893/%E8%AE%BF%E5%AE%A2%E7%99%BB%E8%AE%B0%E7%89%88%EF%BC%9A%E7%BD%91%E9%A1%B5%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/501893/%E8%AE%BF%E5%AE%A2%E7%99%BB%E8%AE%B0%E7%89%88%EF%BC%9A%E7%BD%91%E9%A1%B5%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Notion API配置
    const NOTION_API_KEY = 'secret_wy4UEm2l2TroTz7CFHsNadbnCgwNhcRN6bsao8zN0fL';
    const NOTION_DATABASE_ID = '8e8edae2832547bcb47ce9b36cf0bf6d';

    // 创建一个小型浮动按钮
    function createFloatingButton() {
        const button = document.createElement('button');
        button.textContent = '发送到Notion';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.left = '20px';
        button.style.zIndex = '9999';
        button.style.fontSize = '16px';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#f0f0f0';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => extractAndSendToNotion());
        document.body.appendChild(button);
    }

    // 提示发送成功
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.textContent = '数据成功发送到Notion';
        message.style.position = 'fixed';
        message.style.top = '50px';
        message.style.left = '20px';
        message.style.zIndex = '9999';
        message.style.fontSize = '16px';
        message.style.padding = '5px 10px';
        message.style.backgroundColor = '#d4edda';
        message.style.border = '1px solid #c3e6cb';
        message.style.borderRadius = '3px';
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }

    // 主函数：提取数据并发送到Notion
    function extractAndSendToNotion() {
        const nameElement = document.querySelector('span.tag[onclick^="initH3cSeluser_delTag"]');
        const phoneInputElement = document.querySelector('input#N10_applierTel');
        const departmentElement = document.getElementById('N10_applierDept_show');

        if (!nameElement || !phoneInputElement || !departmentElement) {
            alert('无法找到所需的页面元素。请确保您在正确的页面上。');
            return;
        }

        const fullName = nameElement.textContent.trim();
        const chineseName = fullName.match(/[\u4e00-\u9fa5]+/)?.[0] || '';
        const { lastName, firstName } = splitChineseName(chineseName);

        let phone = phoneInputElement.value.trim();
        if (!phone) {
            phone = phoneInputElement.getAttribute('placeholder');
        }

        const department = departmentElement.textContent.trim();
        const companyDepartment = `新华三·${department}`;

        const data = {
            parent: { database_id: NOTION_DATABASE_ID },
            properties: {
                "姓名": { title: [{ text: { content: chineseName } }] },
                "名字": { rich_text: [{ text: { content: firstName } }] },
                "姓氏": { rich_text: [{ text: { content: lastName } }] },
                "手机": { phone_number: phone },
                "部门": { rich_text: [{ text: { content: department } }] },
                "公司": { rich_text: [{ text: { content: "新华三" } }] },
                "公司·部门": { rich_text: [{ text: { content: companyDepartment } }] }
            }
        };

        sendToNotion(data);
    }

    // 拆分中文姓名
    function splitChineseName(chineseName) {
        let lastName = chineseName.substring(0, 1);
        let firstName = chineseName.substring(1);

        // 处理复姓的情况
        const commonLastNames = ['欧阳', '司马', '诸葛', '长孙', '宇文', '慕容', '司徒', '上官'];
        for (let commonLastName of commonLastNames) {
            if (chineseName.startsWith(commonLastName)) {
                lastName = commonLastName;
                firstName = chineseName.substring(commonLastName.length);
                break;
            }
        }

        return { lastName, firstName };
    }

    // 发送数据到Notion
    function sendToNotion(data) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.notion.com/v1/pages",
            headers: {
                "Authorization": `Bearer ${NOTION_API_KEY}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            onload: function(response) {
                if (response.status === 200) {
                    showSuccessMessage();
                } else {
                    console.error("添加到Notion失败:", response.responseText);
                    alert("添加到Notion失败，请查看控制台以获取详细信息。");
                }
            },
            onerror: function(error) {
                console.error("发送请求时出错:", error);
                alert("发送请求时出错，请查看控制台以获取详细信息。");
            }
        });
    }

    // 在页面加载完成后添加浮动按钮
    window.addEventListener('load', createFloatingButton);
})();
