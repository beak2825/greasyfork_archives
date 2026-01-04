// ==UserScript==
// @name         SQL助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  SQL小助手: 提高编辑SQL效率
// @author       Yanglin Tu
// @match        https://data.sankuai.com/dataMap*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523086/SQL%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523086/SQL%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮
    function createFloatingButton() {
        // 创建容器
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            right: 20px;
            top: 30%;
            z-index: 9999;
        `;

        // 创建主按钮
        const mainButton = document.createElement('button');
        mainButton.textContent = 'SQL助手';
        mainButton.style.cssText = `
            padding: 10px 15px;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 4px 4px 0 0;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            width: 100%;
            transition: all 0.3s;
        `;

        // 创建下拉菜单
        const options = [
            { text: '生成XT视图代码', handler: generateXTView },
            { text: '生成DDL', handler: generateTableDDL },
            { text: '截取code', handler: extractFieldCode },
            { text: '截取名称', handler: extractFieldChineseName },
            { text: '拼接code和名称', handler: combineCodeAndName }
        ];

        // 计算最长选项的宽度（每个中文字符按17px计算，其他字符按8.5px计算）
        const getTextWidth = (text) => {
            return text.split('').reduce((width, char) => {
                return width + (/[\u4e00-\u9fa5]/.test(char) ? 17 : 8.5);
            }, 0);
        };

        const maxTextWidth = Math.max(...options.map(option => getTextWidth(option.text)));
        const buttonWidth = maxTextWidth + 30; // 添加一些内边距

        const dropdown = document.createElement('div');
        dropdown.style.cssText = `
            display: none;
            background-color: white;
            border: 1px solid #e8e8e8;
            border-radius: 0 0 4px 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            width: ${buttonWidth}px;
        `;

        // 创建菜单选项
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.style.cssText = `
                width: 100%;
                padding: 8px 15px;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                transition: all 0.3s;
            `;
            button.addEventListener('click', option.handler);
            button.onmouseover = () => button.style.backgroundColor = '#f5f5f5';
            button.onmouseout = () => button.style.backgroundColor = 'white';
            dropdown.appendChild(button);
        });

        // 切换下拉菜单显示
        mainButton.onclick = () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        };

        // 鼠标移出容器时隐藏下拉菜单
        container.onmouseleave = () => {
            dropdown.style.display = 'none';
        };

        container.appendChild(mainButton);
        container.appendChild(dropdown);
        document.body.appendChild(container);
    }

    // 创建提示框
    function createToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
            animation: fadeInOut 3s ease-in-out;
        `;
        toast.textContent = message;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        return toast;
    }

    // 处理字段信息并生成视图代码
    function generateViewFormat(input) {
        const lines = input.trim().split('\n');
        const dataLines = lines.slice(1);

        const extractedData = dataLines.map(line => {
            const columns = line.trim().split(/\s+/);
            let col2 = columns[1];
            const col3 = columns[2];
            const col5 = columns[4];
            col2 = col2.replace(/<粒度>|<分区>/g, '');
            return { col2, col3, col5 };
        });

        const maxLength = extractedData.reduce((max, item) => {
            return Math.max(max, item.col2.length);
        }, 0);

        function pad(str, length) {
            return str + ' '.repeat(length - str.length);
        }

        let createView = 'DROP VIEW IF EXISTS `$target.table`;\n';
        createView += 'CREATE VIEW IF NOT EXISTS `$target.table` (\n';

        extractedData.forEach((item, index) => {
            const paddedCol2 = pad(item.col2, maxLength);
            createView += `  ${paddedCol2} comment '${item.col5}'`;
            createView += index < extractedData.length - 1 ? ',\n' : '\n';
        });

        // 获取表名
        const tableNameElement = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.detail-top > div.detail-top-content > div:nth-child(3) > div:nth-child(2) > span.mtd-tooltip-rel > span");
        const tableName = tableNameElement ? tableNameElement.textContent.trim() : 'xx';

        // 获取表注释
        const tableCommentElement = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.detail-top > div.detail-top-content > div:nth-child(3) > div:nth-child(1) > div");
        const tableComment = tableCommentElement ? tableCommentElement.textContent.trim() : 'xx';

        createView += `) comment  '${tableComment}'  as\n`;
        createView += 'select \n';

        const selectColumns = extractedData.map(item => item.col2).join(',\n  ');
        createView += `  ${selectColumns}\n  from ${tableName}\n  ;`;

        return createView;
    }

    // 生成XT视图代码的处理函数
    async function generateXTView() {
        try {
            // 原有的生成XT视图代码的逻辑
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.split('?')[0];
            let copyButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.basic-fields > div.basic-fields-header > span.basic-fields-header-right > span");

            // 如果当前页面没有找到复制按钮，先跳转到fields页面
            if (!copyButton) {
                // 查找字段信息按钮 - 使用精确的选择器
                const fieldsInfoButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.bottom-bar-wrapper > div > div > div.mtd-tabs-nav.top > div.mtd-tabs-nav-container > div > div > div:nth-child(3)");

                if (!fieldsInfoButton) {
                    throw new Error('未找到字段信息按钮');
                }

                // 点击字段信息按钮
                fieldsInfoButton.click();

                // 等待复制按钮出现
                await new Promise(resolve => {
                    const checkCopyButton = setInterval(() => {
                        copyButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.basic-fields > div.basic-fields-header > span.basic-fields-header-right > span");
                        if (copyButton) {
                            clearInterval(checkCopyButton);
                            resolve();
                        }
                    }, 100);
                });
            }

            // 模拟点击复制字段信息按钮
            copyButton.click();

            // 等待剪贴板内容
            await new Promise(resolve => setTimeout(resolve, 100));

            // 读取剪贴板内容
            const text = await navigator.clipboard.readText();

            // 生成视图代码
            const viewCode = generateViewFormat(text);

            // 复制到剪贴板
            await navigator.clipboard.writeText(viewCode);

            // 提示用户
            const toast = createToast('视图代码已生成并复制到剪贴板！');
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    }

    // 生成DDL的处理函数
    async function generateTableDDL() {
        try {
            // 原有的生成XT视图代码的逻辑
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.split('?')[0];
            let copyButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.basic-fields > div.basic-fields-header > span.basic-fields-header-right > span");

            // 如果当前页面没有找到复制按钮，先跳转到fields页面
            if (!copyButton) {
                // 查找字段信息按钮 - 使用精确的选择器
                const fieldsInfoButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.bottom-bar-wrapper > div > div > div.mtd-tabs-nav.top > div.mtd-tabs-nav-container > div > div > div:nth-child(3)");

                if (!fieldsInfoButton) {
                    throw new Error('未找到字段信息按钮');
                }

                // 点击字段信息按钮
                fieldsInfoButton.click();

                // 等待复制按钮出现
                await new Promise(resolve => {
                    const checkCopyButton = setInterval(() => {
                        copyButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.basic-fields > div.basic-fields-header > span.basic-fields-header-right > span");
                        if (copyButton) {
                            clearInterval(checkCopyButton);
                            resolve();
                        }
                    }, 100);
                });
            }

            // 模拟点击复制字段信息按钮
            copyButton.click();

            // 等待剪贴板内容
            await new Promise(resolve => setTimeout(resolve, 100));

            // 读取剪贴板内容
            const text = await navigator.clipboard.readText();

            // 使用提供的DDL生成逻辑
            const ddlCode = generateDDLFormat(text);
            await navigator.clipboard.writeText(ddlCode);

            const toast = createToast('DDL代码已生成并复制到剪贴板！');
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    }

    // 添加DDL格式化函数
    function generateDDLFormat(input) {
        const lines = input.trim().split('\n');
        const dataLines = lines.slice(1);

        const extractedData = dataLines.map(line => {
            const columns = line.trim().split(/\s+/);
            let col2 = columns[1];
            const col3 = columns[2];
            const col5 = columns[4];

            col2 = col2.replace(/<粒度>|<分区>/g, '');

            return {
                col2,
                col3,
                col5
            };
        });

        // 找到最长的字段名称和类型，以便对齐
        const maxLength = extractedData.reduce((max, item) => {
            return Math.max(max, item.col2.length);
        }, 0);

        const col3_maxLength = extractedData.reduce((max, item) => {
            return Math.max(max, item.col3.trim().length);
        }, 0);

        function pad(str, length) {
            return str + ' '.repeat(length - str.length);
        }

        // 获取表名
        const tableNameElement = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.detail-top > div.detail-top-content > div:nth-child(3) > div:nth-child(2) > span.mtd-tooltip-rel > span");
        const tableName = tableNameElement ? tableNameElement.textContent.trim() : 'xx';

        // 获取表注释
        const tableCommentElement = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.detail-top > div.detail-top-content > div:nth-child(3) > div:nth-child(1) > div");
        const tableComment = tableCommentElement ? tableCommentElement.textContent.trim() : 'xx';

        let createView = 'CREATE TABLE IF NOT EXISTS `${target.table}` \n(\n';

        extractedData.forEach((item, index) => {
            const paddedCol2 = pad(item.col2, maxLength);
            createView += `  ${paddedCol2}\t\t`;
            createView += pad(item.col3, col3_maxLength);
            createView += `\t comment '${item.col5}'`;
            createView += index < extractedData.length - 1 ? ',\n' : '\n';
        });

        createView += `) \ncomment '${tableComment}' \n`;
        createView += "PARTITIONED BY (dt STRING COMMENT '日期分区字段，格式为datekey(yyyymmdd)') \n";
        createView += 'STORED AS ORC \n;\n';

        return createView;
    }

    // 检查URL是否匹配并初始化
    function checkAndInitialize() {
        const url = window.location.href;
        // 只要URL包含 dataMap#/search/detail/ 就显示按钮
        if (url.includes('dataMap#/search/detail/')) {
            createFloatingButton();
        }
    }

    // 监听URL变化
    let lastUrl = window.location.href;
    new MutationObserver(() => {
        if (lastUrl !== window.location.href) {
            lastUrl = window.location.href;
            checkAndInitialize();
        }
    }).observe(document, {subtree: true, childList: true});

    // 初始化
    checkAndInitialize();

    // 截取code功能
    async function extractFieldCode() {
        try {
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.split('?')[0];
            let copyButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.basic-fields > div.basic-fields-header > span.basic-fields-header-right > span");

            // 如果当前页面没有找到复制按钮，先跳转到fields页面
            if (!copyButton) {
                // 查找字段信息按钮 - 使用精确的选择器
                const fieldsInfoButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.bottom-bar-wrapper > div > div > div.mtd-tabs-nav.top > div.mtd-tabs-nav-container > div > div > div:nth-child(3)");

                if (!fieldsInfoButton) {
                    throw new Error('未找到字段信息按钮');
                }

                // 点击字段信息按钮
                fieldsInfoButton.click();

                // 等待复制按钮出现
                await new Promise(resolve => {
                    const checkCopyButton = setInterval(() => {
                        copyButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.basic-fields > div.basic-fields-header > span.basic-fields-header-right > span");
                        if (copyButton) {
                            clearInterval(checkCopyButton);
                            resolve();
                        }
                    }, 100);
                });
            }

            // 模拟点击复制字段信息按钮
            copyButton.click();

            // 等待剪贴板内容
            await new Promise(resolve => setTimeout(resolve, 100));

            // 读取剪贴板内容
            const inputText = await navigator.clipboard.readText();

            // 处理内容
            const lines = inputText.split('\n');
            const result = lines.filter(line => /^\d/.test(line))
                              .map(line => line.replace('<分区>', '').split(/\s+/)[1])
                              .join(',\n');

            // 复制结果到剪贴板
            await navigator.clipboard.writeText(result);

            const toast = createToast('字段code已提取并复制到剪贴板！');
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    }

    // 截取名称功能
    async function extractFieldChineseName() {
        try {
            // 获取剪贴板内容
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.split('?')[0];
            let copyButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.basic-fields > div.basic-fields-header > span.basic-fields-header-right > span");

            // 如果当前页面没有找到复制按钮，先跳转到fields页面
            if (!copyButton) {
                // 查找字段信息按钮 - 使用精确的选择器
                const fieldsInfoButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.bottom-bar-wrapper > div > div > div.mtd-tabs-nav.top > div.mtd-tabs-nav-container > div > div > div:nth-child(3)");

                if (!fieldsInfoButton) {
                    throw new Error('未找到字段信息按钮');
                }

                // 点击字段信息按钮
                fieldsInfoButton.click();

                // 等待复制按钮出现
                await new Promise(resolve => {
                    const checkCopyButton = setInterval(() => {
                        copyButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.basic-fields > div.basic-fields-header > span.basic-fields-header-right > span");
                        if (copyButton) {
                            clearInterval(checkCopyButton);
                            resolve();
                        }
                    }, 100);
                });
            }

            // 模拟点击复制字段信息按钮
            copyButton.click();

            // 等待剪贴板内容
            await new Promise(resolve => setTimeout(resolve, 100));

            // 读取剪贴板内容
            const inputText = await navigator.clipboard.readText();

            // 处理内容
            const lines = inputText.split('\n');
            const result = lines.filter(line => /^\d/.test(line))
                              .map(line => {
                                  const parts = line.replace('<分区>', '')
                                                  .replace('<粒度>', '')
                                                  .replace('--', '')
                                                  .replace('--', '')
                                                  .trim()
                                                  .split(/C-\d\s+/);
                                  return `'${parts[1]}'`;
                              })
                              .join(',\n');

            // 复制结果到剪贴板
            await navigator.clipboard.writeText(result);

            const toast = createToast('中文名称已提取并复制到剪贴板！');
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    }

    // 拼接code和名称功能
    async function combineCodeAndName() {
        try {
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.split('?')[0];
            let copyButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.basic-fields > div.basic-fields-header > span.basic-fields-header-right > span");

            // 如果当前页面没有找到复制按钮，先跳转到fields页面
            if (!copyButton) {
                // 查找字段信息按钮 - 使用精确的选择器
                const fieldsInfoButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.bottom-bar-wrapper > div > div > div.mtd-tabs-nav.top > div.mtd-tabs-nav-container > div > div > div:nth-child(3)");

                if (!fieldsInfoButton) {
                    throw new Error('未找到字段信息按钮');
                }

                // 点击字段信息按钮
                fieldsInfoButton.click();

                // 等待复制按钮出现
                await new Promise(resolve => {
                    const checkCopyButton = setInterval(() => {
                        copyButton = document.querySelector("#app > div.ls-sidebar-container > div.ls-sidebar-main > div.main-page > div > div.bottom-infos-wrapper.bottom-infos-wrapper-lg > div.bottom-infos > div.basic-fields > div.basic-fields-header > span.basic-fields-header-right > span");
                        if (copyButton) {
                            clearInterval(checkCopyButton);
                            resolve();
                        }
                    }, 100);
                });
            }

            // 模拟点击复制字段信息按钮
            copyButton.click();

            // 等待剪贴板内容
            await new Promise(resolve => setTimeout(resolve, 100));

            // 读取剪贴板内容
            const inputText = await navigator.clipboard.readText();
            // 处理内容
            const lines = inputText.split('\n');
            const codes = lines.filter(line => /^\d/.test(line))
                             .map(line => line.replace('<分区>', '').replace('<粒度>', '').split(/\s+/)[1]);
            const names = lines.filter(line => /^\d/.test(line))
                             .map(line => {
                                 const parts = line.replace('<分区>', '')
                                                 .replace('<粒度>', '')
                                                 .replace('--', '')
                                                 .replace('--', '')
                                                 .trim()
                                                 .split(/C-\d\s+/);
                                 return `'${parts[1]}'`;
                             });
            const result = codes.map((code, index) => `${code} as ${names[index]}`).join(',\n');

            // 复制结果到剪贴板
            await navigator.clipboard.writeText(result);

            const toast = createToast('code和名称已拼接并复制到剪贴板！');
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    }
})();