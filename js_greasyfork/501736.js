// ==UserScript==
// @name         网页数据提取器（Notion API版，自动/手动模式，姓名拆分）
// @namespace    http://tampermonkey.net/
// @version      2.9.1
// @description  从特定网页自动或手动提取姓名（拆分为姓和名）、手机号、部门和公司，并通过API发送到Notion数据库
// @match        https://ibpm.h3c.com/bpm/rule?wf_num=R_S003_B036*
// @match        https://ibpm.h3c.com/bpm/rule?wf_num=R_S003_B062*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/501736/%E7%BD%91%E9%A1%B5%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88Notion%20API%E7%89%88%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%89%8B%E5%8A%A8%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%A7%93%E5%90%8D%E6%8B%86%E5%88%86%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/501736/%E7%BD%91%E9%A1%B5%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88Notion%20API%E7%89%88%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%89%8B%E5%8A%A8%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%A7%93%E5%90%8D%E6%8B%86%E5%88%86%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Notion API配置
    const NOTION_API_KEY = 'secret_wy4UEm2l2TroTz7CFHsNadbnCgwNhcRN6bsao8zN0fL';
    const NOTION_DATABASE_ID = '8e8edae2832547bcb47ce9b36cf0bf6d';

    // 获取用户设置的“显示添加按钮”状态（默认为 true）
    let showButton = GM_getValue('showButton', true);

    // 注册菜单命令用于切换“显示添加按钮”状态
    GM_registerMenuCommand(showButton ? '隐藏添加按钮' : '显示添加按钮', () => {
        showButton = !showButton;
        GM_setValue('showButton', showButton);
        alert(`已${showButton ? '显示' : '隐藏'}添加按钮。请刷新页面以应用更改。`);
    });

    // 创建一个小型浮动按钮
    function createFloatingButton() {
        if (!showButton) return; // 如果设置为不显示，则直接返回
        const button = document.createElement('button');
        button.textContent = '+';
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
        button.addEventListener('click', () => extractAndSendToNotion(true));
        document.body.appendChild(button);
    }

    // 主函数：提取数据并发送到Notion
    function extractAndSendToNotion(isManual = false) {
        const nameElement = document.getElementById('ADD_ID');
        const phoneElement = document.getElementById('PHONENUM');
        const departmentElement = document.getElementById('SYBM');
        if (!nameElement || !phoneElement || !departmentElement) {
            if (isManual) {
                alert('无法找到所需的页面元素。请确保您在正确的页面上。');
            }
            return;
        }

        const fullName = nameElement.textContent.trim();
        const chineseName = fullName.match(/[\u4e00-\u9fa5]+/)?.[0] || '';
        const { lastName, firstName } = splitChineseName(chineseName);
        const phone = phoneElement.textContent.trim();
        const department = departmentElement.tagName.toLowerCase() === 'input'
            ? departmentElement.value.trim()
            : departmentElement.textContent.trim();
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

        checkAndSendToNotion(data, isManual);
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

    // 检查数据是否存在并发送数据到Notion
    function checkAndSendToNotion(data, isManual) {
        const phone = data.properties["手机"].phone_number;

        GM_xmlhttpRequest({
            method: "POST",
            url: `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
            headers: {
                "Authorization": `Bearer ${NOTION_API_KEY}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                filter: {
                    property: "手机",
                    phone_number: {
                        equals: phone
                    }
                }
            }),
            onload: function(response) {
                const results = JSON.parse(response.responseText).results;
                if (results.length === 0) {
                    // 数据不存在，发送到Notion
                    sendToNotion(data, isManual);
                } else {
                    console.log("数据已存在，不重复添加");
                    if (isManual) {
                        alert("数据已存在于Notion，不需要重复添加。");
                    }
                }
            },
            onerror: function(error) {
                console.error("检查数据时出错:", error);
                if (isManual) {
                    alert("检查数据时出错，请查看控制台以获取详细信息。");
                }
            }
        });
    }

    // 发送数据到Notion
    function sendToNotion(data, isManual) {
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
                    if (isManual) {
                        alert("数据成功添加到Notion！");
                    } else {
                        console.log("数据自动添加到Notion成功");
                    }
                } else {
                    console.error("添加到Notion失败:", response.responseText);
                    if (isManual) {
                        alert("添加到Notion失败，请查看控制台以获取详细信息。");
                    }
                }
            },
            onerror: function(error) {
                console.error("发送请求时出错:", error);
                if (isManual) {
                    alert("发送请求时出错，请查看控制台以获取详细信息。");
                }
            }
        });
    }

    // 在页面加载完成后添加浮动按钮并设置自动传输
    window.addEventListener('load', () => {
        createFloatingButton();
        setTimeout(() => extractAndSendToNotion(false), 1000); // 1秒后自动传输
    });
})();
