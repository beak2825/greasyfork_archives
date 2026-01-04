// ==UserScript==
// @name         学费
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  Automatically fill in the CyberSource checkout form - Enhanced Debug Version
// @author       You
// @match        https://secureacceptance.cybersource.com/checkout*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536928/%E5%AD%A6%E8%B4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/536928/%E5%AD%A6%E8%B4%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[CyberSource AutoFill] Script starting...');
    console.log('[CyberSource AutoFill] Current URL:', window.location.href);

    // 生成随机个人信息的函数
    function generateRandomPersonalInfo() {
        // 美国常见名字列表
        const firstNames = ['John', 'Michael', 'Robert', 'David', 'James', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth',
                           'William', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy',
                           'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Lisa', 'Michelle', 'Kimberly', 'Emily', 'Donna'];

        // 美国常见姓氏列表
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
                          'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
                          'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King'];

        // 美国主要城市列表
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
                       'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco',
                       'Indianapolis', 'Seattle', 'Denver', 'Boston', 'Portland', 'Las Vegas', 'Nashville', 'Oklahoma City', 'Detroit'];

        // 美国州代码列表
        const states = [
            { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
            { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
            { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
            { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
            { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
            { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
            { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
            { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
            { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
            { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
            { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
            { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
            { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
            { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
            { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
            { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
            { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
        ];

        // 街道名称列表
        const streetNames = ['Main', 'Oak', 'Maple', 'Washington', 'Lincoln', 'Park', 'Pine', 'Cedar', 'Elm', 'Walnut',
                           'Lake', 'Hill', 'Cherry', 'Highland', 'Forest', 'River', 'Valley', 'Church', 'Sunset', 'Ridge'];

        // 街道类型列表
        const streetTypes = ['Street', 'Avenue', 'Boulevard', 'Drive', 'Lane', 'Road', 'Way', 'Place', 'Court', 'Circle'];

        // 随机选择函数
        const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];
        const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        // 随机生成一个街道地址
        const streetNumber = getRandomNumber(1, 9999);
        const streetName = getRandomItem(streetNames);
        const streetType = getRandomItem(streetTypes);
        const address = `${streetNumber} ${streetName} ${streetType}`;

        // 随机选择一个州
        const selectedState = getRandomItem(states);

        // 根据选定的州生成一个合理的邮编（简化版，实际美国邮编规则更复杂）
        const zipCode = getRandomNumber(10000, 99999).toString();

        // 随机生成一个看起来合理的邮箱地址
        const firstName = getRandomItem(firstNames).toLowerCase();
        const lastName = getRandomItem(lastNames).toLowerCase();
        const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
        const randomNumber = getRandomNumber(1, 999);
        const email = `${firstName}.${lastName}${randomNumber}@${getRandomItem(emailDomains)}`;

        // 生成随机美国手机号 (格式: XXX-XXX-XXXX)
        const areaCode = getRandomNumber(200, 999); // 区号通常不以0或1开头
        const exchange = getRandomNumber(200, 999); // 交换机代码通常不以0或1开头
        const subscriberNumber = getRandomNumber(1000, 9999);
        const phoneNumber = `${areaCode}-${exchange}-${subscriberNumber}`;

        // 返回生成的随机个人信息
        return {
            'bill_to_forename': getRandomItem(firstNames),
            'bill_to_surname': getRandomItem(lastNames),
            'bill_to_address_line1': address,
            'bill_to_address_city': getRandomItem(cities),
            'bill_to_address_country': 'US', // 默认为美国
            'bill_to_address_state_us_ca': selectedState.code,
            'bill_to_address_postal_code': zipCode,
            'bill_to_email': email,
            'bill_to_phone': phoneNumber
        };
    }

    // 定义要填写的数据 - 始终使用随机生成的信息
    let formData = generateRandomPersonalInfo();
    console.log('[CyberSource AutoFill] Generated form data:', formData);

    // 定义信用卡信息变量
    let savedCardInfo = '';

    // 卡库相关变量
    let cardLibrary = [];
    let currentCardIndex = -1;

    // 只检查是否有保存的信用卡信息，不检查个人信息
    // 注意：已移除检查个人信息的代码，确保每次都生成新的随机信息
    const savedCardData = localStorage.getItem('cyberSourceCardInfo');
    if (savedCardData) {
        try {
            savedCardInfo = savedCardData;
            console.log('[CyberSource AutoFill] 已加载保存的信用卡数据');
        } catch (e) {
            console.error('[CyberSource AutoFill] 无法加载保存的信用卡数据', e);
        }
    }

    // 加载卡库
    const savedLibraryData = localStorage.getItem('cyberSourceCardLibrary');
    if (savedLibraryData) {
        try {
            cardLibrary = JSON.parse(savedLibraryData);
            console.log(`[CyberSource AutoFill] 已加载卡库数据，共有 ${cardLibrary.length} 张卡`);
        } catch (e) {
            console.error('[CyberSource AutoFill] 无法加载卡库数据', e);
            cardLibrary = [];
        }
    }

    // 强制创建面板的函数
    function forceCreateUI() {
        console.log('[CyberSource AutoFill] 强制创建UI...');

        // 检查是否已经存在面板
        const existingPanel = document.getElementById('cybersource-autofill-panel');
        if (existingPanel) {
            console.log('[CyberSource AutoFill] 发现已存在的面板，移除中...');
            existingPanel.remove();
        }

        try {
            createUI();
            console.log('[CyberSource AutoFill] UI创建成功');
        } catch (error) {
            console.error('[CyberSource AutoFill] 创建UI时发生错误:', error);

            // 如果还是失败，创建一个简单的调试面板
            createSimpleDebugPanel();
        }
    }

    // 创建简单的调试面板
    function createSimpleDebugPanel() {
        console.log('[CyberSource AutoFill] 创建简单调试面板...');

        try {
            const debugPanel = document.createElement('div');
            debugPanel.id = 'cybersource-debug-panel';
            debugPanel.style.cssText = `
                position: fixed !important;
                top: 10px !important;
                right: 10px !important;
                z-index: 999999 !important;
                background: red !important;
                color: white !important;
                padding: 15px !important;
                border: 2px solid white !important;
                border-radius: 5px !important;
                font-family: Arial, sans-serif !important;
                font-size: 14px !important;
                width: 250px !important;
                box-shadow: 0 0 20px rgba(0,0,0,0.5) !important;
            `;

            debugPanel.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: white;">脚本调试信息</h3>
                <p>脚本已加载</p>
                <p>URL: ${window.location.href}</p>
                <p>时间: ${new Date().toLocaleTimeString()}</p>
                <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px;">关闭</button>
            `;

            document.body.appendChild(debugPanel);
            console.log('[CyberSource AutoFill] 简单调试面板创建成功');
        } catch (e) {
            console.error('[CyberSource AutoFill] 连简单面板都无法创建:', e);
        }
    }

    // 多重触发机制
    function initializeScript() {
        console.log('[CyberSource AutoFill] 开始初始化脚本...');

        // 立即尝试创建UI
        if (document.readyState === 'complete') {
            console.log('[CyberSource AutoFill] 页面已完全加载，立即创建UI');
            setTimeout(forceCreateUI, 100);
        }

        // 等待页面完全加载
        window.addEventListener('load', function() {
            // 延迟执行以确保所有DOM元素都已加载
            setTimeout(function() {
                fillForm();
                forceCreateUI();

                // 如果有保存的信用卡信息，自动填写
                if (savedCardInfo && savedCardInfo.trim() !== '') {
                    setTimeout(function() {
                        fillCreditCardInfo(savedCardInfo);
                        console.log('[CyberSource AutoFill] 自动填写已保存的信用卡信息');
                    }, 500);
                }
            }, 1000);
        });

        // 监听页面状态变化
        document.addEventListener('readystatechange', function() {
            console.log('[CyberSource AutoFill] 页面状态变化:', document.readyState);
            if (document.readyState === 'interactive' || document.readyState === 'complete') {
                setTimeout(forceCreateUI, 500);
            }
        });

        // 定时检查并重新创建面板
        let checkCount = 0;
        const checkInterval = setInterval(function() {
            checkCount++;
            console.log(`[CyberSource AutoFill] 第${checkCount}次检查面板是否存在...`);

            const panel = document.getElementById('cybersource-autofill-panel') || document.getElementById('cybersource-debug-panel');
            if (!panel) {
                console.log('[CyberSource AutoFill] 面板不存在，重新创建...');
                forceCreateUI();
            } else {
                console.log('[CyberSource AutoFill] 面板存在，检查通过');
            }

            // 最多检查30次（150秒）
            if (checkCount >= 30) {
                clearInterval(checkInterval);
                console.log('[CyberSource AutoFill] 停止定时检查');
            }
        }, 5000);
    }

    // 创建用户界面
    function createUI() {
        console.log('[CyberSource AutoFill] 开始创建UI...');

        const container = document.createElement('div');
        container.id = 'cybersource-autofill-panel'; // 添加ID便于调试
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '9999';
        container.style.padding = '10px';
        container.style.backgroundColor = '#f0f0f0';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.width = '300px';
        container.style.maxHeight = '90vh';
        container.style.overflowY = 'auto';

        // 添加标题
        const title = document.createElement('h3');
        title.textContent = 'CyberSource 自动填写';
        title.style.margin = '0 0 10px 0';
        title.style.color = '#333';
        title.style.textAlign = 'center';
        container.appendChild(title);

        // 信用卡输入部分
        const cardSection = createCreditCardSection();
        container.appendChild(cardSection);

        // 添加分隔线
        const divider = document.createElement('hr');
        divider.style.margin = '15px 0';
        divider.style.border = '0';
        divider.style.borderTop = '1px solid #ccc';
        container.appendChild(divider);

        // 卡库部分
        const cardLibrarySection = createCardLibrarySection();
        container.appendChild(cardLibrarySection);

        // 添加分隔线
        const divider2 = document.createElement('hr');
        divider2.style.margin = '15px 0';
        divider2.style.border = '0';
        divider2.style.borderTop = '1px solid #ccc';
        container.appendChild(divider2);

        // 个人信息修改部分
        const personalSection = createPersonalInfoSection();
        container.appendChild(personalSection);

        // 添加新的一个按钮，用于生成新的随机信息
        const randomizeButton = document.createElement('button');
        randomizeButton.textContent = '生成新的随机信息';
        randomizeButton.style.width = '100%';
        randomizeButton.style.padding = '5px';
        randomizeButton.style.backgroundColor = '#28a745';
        randomizeButton.style.color = 'white';
        randomizeButton.style.border = 'none';
        randomizeButton.style.borderRadius = '3px';
        randomizeButton.style.cursor = 'pointer';
        randomizeButton.style.marginTop = '10px';

        randomizeButton.addEventListener('click', function() {
            // 生成新的随机个人信息
            const newRandomInfo = generateRandomPersonalInfo();

            // 更新表单数据
            formData = newRandomInfo;

            // 更新UI上的输入框
            for (const [fieldName, value] of Object.entries(newRandomInfo)) {
                const input = document.getElementById('custom_' + fieldName);
                if (input) {
                    input.value = value;
                }
            }

            // 立即应用到表单
            fillForm();

            alert('已生成并应用新的随机个人信息!');
        });

        container.appendChild(randomizeButton);

        // 添加到页面
        document.body.appendChild(container);
        console.log('[CyberSource AutoFill] UI容器已添加到页面');
    }

    // 创建卡库部分
    function createCardLibrarySection() {
        const section = document.createElement('div');

        const title = document.createElement('h3');
        title.textContent = '信用卡库';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '16px';

        // 卡库状态
        const statusContainer = document.createElement('div');
        statusContainer.style.marginBottom = '10px';
        statusContainer.style.display = 'flex';
        statusContainer.style.justifyContent = 'space-between';
        statusContainer.style.alignItems = 'center';

        const libraryStatus = document.createElement('div');
        libraryStatus.id = 'library_status';
        libraryStatus.style.fontSize = '14px';
        libraryStatus.textContent = `卡库: ${cardLibrary.length} 张卡`;

        statusContainer.appendChild(libraryStatus);

        // 批量导入区域
        const importArea = document.createElement('textarea');
        importArea.placeholder = '批量导入信用卡，每行一张卡 (格式: 卡号|月份|年份|CVV 或 卡号|月年|CVV)';
        importArea.style.width = '100%';
        importArea.style.height = '80px';
        importArea.style.padding = '5px';
        importArea.style.marginBottom = '10px';
        importArea.style.boxSizing = 'border-box';
        importArea.style.resize = 'vertical';

        // 批量导入按钮
        const importButton = document.createElement('button');
        importButton.textContent = '导入到卡库';
        importButton.style.width = '100%';
        importButton.style.padding = '5px';
        importButton.style.backgroundColor = '#0066cc';
        importButton.style.color = 'white';
        importButton.style.border = 'none';
        importButton.style.borderRadius = '3px';
        importButton.style.cursor = 'pointer';
        importButton.style.marginBottom = '10px';

        importButton.addEventListener('click', function() {
            const cardsText = importArea.value.trim();
            if (!cardsText) {
                alert('请输入信用卡信息');
                return;
            }

            const lines = cardsText.split('\n').filter(line => line.trim() !== '');
            const invalidLines = [];
            let validCount = 0;

            lines.forEach((line, index) => {
                line = line.trim().replace(/\s+/g, '').replace(/\//g, '|');
                const parts = line.split('|');

                if (parts.length >= 3 && parts.length <= 4) {
                    // 检查卡号是否是数字，并且长度至少为13位
                    const cardNumber = parts[0].trim();
                    if (/^\d{13,19}$/.test(cardNumber)) {
                        // 检查月份是否有效
                        let expiryMonth;
                        if (parts.length === 4) {
                            expiryMonth = parts[1].trim();
                        } else {
                            const expiryDate = parts[1].trim();
                            if (expiryDate.length === 3) {
                                expiryMonth = expiryDate.substring(0, 1);
                            } else if (expiryDate.length === 4) {
                                expiryMonth = expiryDate.substring(0, 2);
                            } else if (expiryDate.length % 2 === 1) {
                                expiryMonth = expiryDate.substring(0, 1);
                            } else {
                                const half = expiryDate.length / 2;
                                expiryMonth = expiryDate.substring(0, half);
                            }
                        }

                        const monthValue = parseInt(expiryMonth, 10);
                        if (!isNaN(monthValue) && monthValue >= 1 && monthValue <= 12) {
                            // 有效卡信息，添加到卡库
                            if (!cardLibrary.includes(line)) {
                                cardLibrary.push(line);
                                validCount++;
                            }
                        } else {
                            invalidLines.push({ index: index + 1, reason: '无效的月份值' });
                        }
                    } else {
                        invalidLines.push({ index: index + 1, reason: '卡号格式不正确' });
                    }
                } else {
                    invalidLines.push({ index: index + 1, reason: '格式不正确' });
                }
            });

            // 保存卡库
            saveCardLibrary();

            // 更新卡库状态
            updateCardLibraryStatus();

            // 清空导入区域
            importArea.value = '';

            // 提示导入结果
            if (validCount > 0) {
                let resultMessage = `成功导入 ${validCount} 张卡`;
                if (invalidLines.length > 0) {
                    resultMessage += `，有 ${invalidLines.length} 行无效`;
                    console.error('无效的卡信息行:', invalidLines);
                }
                alert(resultMessage);
            } else if (invalidLines.length > 0) {
                alert(`导入失败，所有 ${invalidLines.length} 行都无效`);
                console.error('无效的卡信息行:', invalidLines);
            } else {
                alert('没有有效的卡信息可导入');
            }
        });

        // 随机使用卡库中的一张卡按钮
        const useRandomCardButton = document.createElement('button');
        useRandomCardButton.textContent = '随机使用一张卡';
        useRandomCardButton.style.width = '100%';
        useRandomCardButton.style.padding = '5px';
        useRandomCardButton.style.backgroundColor = '#28a745';
        useRandomCardButton.style.color = 'white';
        useRandomCardButton.style.border = 'none';
        useRandomCardButton.style.borderRadius = '3px';
        useRandomCardButton.style.cursor = 'pointer';
        useRandomCardButton.style.marginBottom = '10px';

        useRandomCardButton.addEventListener('click', function() {
            if (cardLibrary.length === 0) {
                alert('卡库为空，请先导入卡');
                return;
            }

            // 随机选择一张卡
            currentCardIndex = Math.floor(Math.random() * cardLibrary.length);
            const card = cardLibrary[currentCardIndex];

            // 填写卡信息
            const cardInput = document.querySelector('input[type="text"][placeholder="输入信用卡信息..."]');
            if (cardInput) {
                cardInput.value = card;
                cardInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // 显示当前使用的卡索引
            const libraryStatus = document.getElementById('library_status');
            if (libraryStatus) {
                libraryStatus.textContent = `卡库: ${cardLibrary.length} 张卡 (当前使用: #${currentCardIndex + 1})`;
            }
        });

        // 从卡库中删除当前使用的卡按钮
        const deleteCurrentCardButton = document.createElement('button');
        deleteCurrentCardButton.textContent = '从卡库中删除当前卡';
        deleteCurrentCardButton.style.width = '100%';
        deleteCurrentCardButton.style.padding = '5px';
        deleteCurrentCardButton.style.backgroundColor = '#dc3545';
        deleteCurrentCardButton.style.color = 'white';
        deleteCurrentCardButton.style.border = 'none';
        deleteCurrentCardButton.style.borderRadius = '3px';
        deleteCurrentCardButton.style.cursor = 'pointer';
        deleteCurrentCardButton.style.marginBottom = '10px';

        deleteCurrentCardButton.addEventListener('click', function() {
            if (cardLibrary.length === 0) {
                alert('卡库为空');
                return;
            }

            // 获取当前输入框中的卡信息
            const cardInput = document.querySelector('input[type="text"][placeholder="输入信用卡信息..."]');
            if (!cardInput || !cardInput.value.trim()) {
                alert('请先输入或选择一张卡');
                return;
            }

            // 格式化当前输入的卡信息，以便与卡库中的格式进行比较
            let currentCard = cardInput.value.trim().replace(/\s+/g, '').replace(/\//g, '|');

            // 在卡库中查找当前卡
            const cardIndex = cardLibrary.findIndex(card => {
                // 对比卡号部分（第一部分），因为日期格式可能不同但卡号相同
                const currentCardParts = currentCard.split('|');
                const libraryCardParts = card.split('|');

                // 如果卡号相同，认为是同一张卡
                return currentCardParts[0] === libraryCardParts[0];
            });

            if (cardIndex === -1) {
                alert('当前卡不在卡库中');
                return;
            }

            // 删除找到的卡
            const deletedCard = cardLibrary.splice(cardIndex, 1)[0];

            // 保存卡库
            saveCardLibrary();

            // 更新当前卡索引
            if (cardIndex === currentCardIndex) {
                currentCardIndex = -1;
            } else if (currentCardIndex > cardIndex) {
                // 如果删除的卡在当前卡之前，当前卡索引减1
                currentCardIndex--;
            }

            // 更新卡库状态
            updateCardLibraryStatus();

            // 清空卡信息输入框
            cardInput.value = '';

            // 清空当前保存的卡信息
            localStorage.removeItem('cyberSourceCardInfo');
            savedCardInfo = '';

            // 更新状态提示
            const cardStatus = document.getElementById('card_status');
            if (cardStatus) {
                cardStatus.textContent = '';
            }

            alert(`已从卡库中删除卡: ${deletedCard}`);
        });

        // 清空卡库按钮
        const clearLibraryButton = document.createElement('button');
        clearLibraryButton.textContent = '清空卡库';
        clearLibraryButton.style.width = '100%';
        clearLibraryButton.style.padding = '5px';
        clearLibraryButton.style.backgroundColor = '#6c757d';
        clearLibraryButton.style.color = 'white';
        clearLibraryButton.style.border = 'none';
        clearLibraryButton.style.borderRadius = '3px';
        clearLibraryButton.style.cursor = 'pointer';

        clearLibraryButton.addEventListener('click', function() {
            if (confirm(`确定要清空卡库吗？当前有 ${cardLibrary.length} 张卡。`)) {
                // 清空卡库
                cardLibrary = [];

                // 保存卡库
                saveCardLibrary();

                // 重置当前卡索引
                currentCardIndex = -1;

                // 更新卡库状态
                updateCardLibraryStatus();

                alert('已清空卡库');
            }
        });

        section.appendChild(title);
        section.appendChild(statusContainer);
        section.appendChild(importArea);
        section.appendChild(importButton);
        section.appendChild(useRandomCardButton);
        section.appendChild(deleteCurrentCardButton);
        section.appendChild(clearLibraryButton);

        return section;
    }

    // 保存卡库
    function saveCardLibrary() {
        try {
            localStorage.setItem('cyberSourceCardLibrary', JSON.stringify(cardLibrary));
            console.log(`卡库已保存，共有 ${cardLibrary.length} 张卡`);
        } catch (e) {
            console.error('保存卡库失败', e);
        }
    }

    // 更新卡库状态显示
    function updateCardLibraryStatus() {
        const libraryStatus = document.getElementById('library_status');
        if (libraryStatus) {
            if (currentCardIndex !== -1) {
                libraryStatus.textContent = `卡库: ${cardLibrary.length} 张卡 (当前使用: #${currentCardIndex + 1})`;
            } else {
                libraryStatus.textContent = `卡库: ${cardLibrary.length} 张卡`;
            }
        }
    }

    // 创建信用卡信息部分
    function createCreditCardSection() {
        const section = document.createElement('div');

        const title = document.createElement('h3');
        title.textContent = '信用卡信息';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '16px';

        const label = document.createElement('label');
        label.textContent = '卡号|月份|年份|CVV 或 卡号|月年|CVV（分隔符可用 | 或 / ）:';
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        label.style.fontSize = '14px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入信用卡信息...';
        input.style.width = '100%';
        input.style.padding = '5px';
        input.style.marginBottom = '5px';
        input.style.boxSizing = 'border-box';
        // 如果有保存的信用卡信息，则设置为默认值
        if (savedCardInfo) {
            input.value = savedCardInfo;
        }

        // 创建状态提示文本
        const statusText = document.createElement('div');
        statusText.id = 'card_status';
        statusText.style.fontSize = '12px';
        statusText.style.color = '#28a745';
        statusText.style.marginBottom = '5px';
        if (savedCardInfo && savedCardInfo.trim() !== '') {
            statusText.textContent = '已自动填写信用卡信息';
        }

        // 创建记住信用卡信息的复选框
        const saveCardContainer = document.createElement('div');
        saveCardContainer.style.marginBottom = '10px';

        const saveCardCheckbox = document.createElement('input');
        saveCardCheckbox.type = 'checkbox';
        saveCardCheckbox.id = 'save_card_info';
        saveCardCheckbox.checked = true; // 默认选中
        saveCardCheckbox.style.marginRight = '5px';

        const saveCardLabel = document.createElement('label');
        saveCardLabel.htmlFor = 'save_card_info';
        saveCardLabel.textContent = '记住此信用卡信息';
        saveCardLabel.style.fontSize = '14px';

        saveCardContainer.appendChild(saveCardCheckbox);
        saveCardContainer.appendChild(saveCardLabel);

        // 创建清除信用卡信息的按钮
        const clearButton = document.createElement('button');
        clearButton.textContent = '清除信用卡信息';
        clearButton.style.width = '100%';
        clearButton.style.padding = '5px';
        clearButton.style.backgroundColor = '#dc3545';
        clearButton.style.color = 'white';
        clearButton.style.border = 'none';
        clearButton.style.borderRadius = '3px';
        clearButton.style.cursor = 'pointer';
        clearButton.style.marginBottom = '5px';

        clearButton.addEventListener('click', function() {
            input.value = '';
            localStorage.removeItem('cyberSourceCardInfo');
            savedCardInfo = '';
            statusText.textContent = '';

            // 重置当前卡索引
            currentCardIndex = -1;

            // 更新卡库状态
            updateCardLibraryStatus();

            alert('已清除保存的信用卡信息');
        });

        // 实时自动填写 - 监听输入框变化
        input.addEventListener('change', function() {
            const cardInfo = input.value;
            if (cardInfo.trim() !== '') {
                if (saveCardCheckbox.checked) {
                    savedCardInfo = cardInfo;
                    localStorage.setItem('cyberSourceCardInfo', cardInfo);
                    console.log('信用卡信息已自动保存');
                }

                fillCreditCardInfo(cardInfo);
                statusText.textContent = '已自动填写信用卡信息';
            }
        });

        section.appendChild(title);
        section.appendChild(label);
        section.appendChild(input);
        section.appendChild(statusText);
        section.appendChild(saveCardContainer);
        section.appendChild(clearButton);

        return section;
    }

    // 创建个人信息修改部分
    function createPersonalInfoSection() {
        const section = document.createElement('div');

        const title = document.createElement('h3');
        title.textContent = '个人信息设置';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '16px';

        section.appendChild(title);

        // 为每个表单项创建输入框
        const formFields = [
            { id: 'bill_to_forename', label: '名字' },
            { id: 'bill_to_surname', label: '姓氏' },
            { id: 'bill_to_address_line1', label: '地址' },
            { id: 'bill_to_address_city', label: '城市' },
            { id: 'bill_to_address_country', label: '国家' },
            { id: 'bill_to_address_state_us_ca', label: '州/省' },
            { id: 'bill_to_address_postal_code', label: '邮编' },
            { id: 'bill_to_email', label: '邮箱' },
            { id: 'bill_to_phone', label: '电话' }
        ];

        formFields.forEach(field => {
            const fieldContainer = document.createElement('div');
            fieldContainer.style.marginBottom = '8px';

            const label = document.createElement('label');
            label.textContent = field.label + ':';
            label.style.display = 'block';
            label.style.fontSize = '14px';
            label.style.marginBottom = '2px';

            const input = document.createElement('input');
            input.type = 'text';
            input.id = 'custom_' + field.id;
            input.value = formData[field.id] || '';
            input.style.width = '100%';
            input.style.padding = '5px';
            input.style.boxSizing = 'border-box';

            // 添加更新功能 - 当输入框内容变化时立即更新当前表单数据
            input.addEventListener('input', function() {
                if (input.value.trim() !== '') {
                    formData[field.id] = input.value.trim();

                    // 不再保存到localStorage

                    // 立即应用到表单
                    const formField = document.getElementById(field.id) || document.querySelector(`[name="${field.id}"]`);
                    if (formField) {
                        formField.value = input.value.trim();
                        formField.dispatchEvent(new Event('input', { bubbles: true }));
                        console.log(`已自动更新 ${field.id}: ${input.value.trim()}`);
                    }
                }
            });

            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            section.appendChild(fieldContainer);
        });

        return section;
    }

    // 解析并填写信用卡信息
    function fillCreditCardInfo(cardInfo) {
        console.log('开始填写信用卡信息...');

        // 移除所有空格
        cardInfo = cardInfo.replace(/\s+/g, '');
        // 支持 | 或 / 作为分隔符
        cardInfo = cardInfo.replace(/\//g, '|');

        // 解析信用卡信息
        const parts = cardInfo.split('|');

        let cardNumber, expiryMonth, expiryYear, cvv;

        // 处理不同格式的日期
        if (parts.length === 4) {
            // 格式: 卡号|月份|年份|CVV
            cardNumber = parts[0].trim();
            expiryMonth = parts[1].trim();
            expiryYear = parts[2].trim();
            cvv = parts[3].trim();
            console.log('使用分隔日期格式: 月|年');
        } else if (parts.length === 3) {
            // 格式: 卡号|月年|CVV
            cardNumber = parts[0].trim();

            // 从组合的月年中提取月份和年份
            const expiryDate = parts[1].trim();

            // 如果日期长度为3（例如125表示1月2025年）
            if (expiryDate.length === 3) {
                expiryMonth = expiryDate.substring(0, 1);
                expiryYear = expiryDate.substring(1);
            }
            // 如果日期长度为4（例如0125表示1月2025年）
            else if (expiryDate.length === 4) {
                expiryMonth = expiryDate.substring(0, 2);
                expiryYear = expiryDate.substring(2);
            }
            // 其他情况尝试智能解析
            else {
                // 如果长度为奇数，假设月份是单个数字
                if (expiryDate.length % 2 === 1) {
                    expiryMonth = expiryDate.substring(0, 1);
                    expiryYear = expiryDate.substring(1);
                } else {
                    // 如果长度为偶数，平分月份和年份
                    const half = expiryDate.length / 2;
                    expiryMonth = expiryDate.substring(0, half);
                    expiryYear = expiryDate.substring(half);
                }
            }

            cvv = parts[2].trim();
            console.log(`使用组合日期格式: 月年 (解析为: 月=${expiryMonth}, 年=${expiryYear})`);
        } else {
            console.error('信用卡信息格式不正确。正确格式: 卡号|月份|年份|CVV 或 卡号|月年|CVV');
            alert('信用卡信息格式不正确。正确格式: 卡号|月份|年份|CVV 或 卡号|月年|CVV');
            return;
        }

        // 处理月份值，确保是有效值（1-12）
        const monthValue = parseInt(expiryMonth, 10);
        if (isNaN(monthValue) || monthValue < 1 || monthValue > 12) {
            console.error(`无效的月份值: ${expiryMonth}`);
            alert(`无效的月份值: ${expiryMonth}。月份必须介于1和12之间。`);
            return;
        }

        // 填写卡号
        const cardNumberField = document.getElementById('card_number');
        if (cardNumberField) {
            cardNumberField.value = cardNumber;
            cardNumberField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log(`已填写卡号: ${cardNumber}`);
        } else {
            console.warn('未找到卡号字段');
        }

        // 根据卡号第一位选择卡类型
        const firstDigit = cardNumber.charAt(0);
        if (firstDigit === '4') {
            // Visa卡
            const visaRadio = document.getElementById('card_type_001');
            if (visaRadio) {
                visaRadio.checked = true;
                visaRadio.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('已选择Visa卡');
            }
        } else if (firstDigit === '5') {
            // MasterCard卡
            const masterCardRadio = document.getElementById('card_type_002');
            if (masterCardRadio) {
                masterCardRadio.checked = true;
                masterCardRadio.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('已选择MasterCard卡');
            }
        } else if (firstDigit === '6') {
            // 6开头的信用卡，选择type 004
            const type004Radio = document.getElementById('card_type_004');
            if (type004Radio) {
                type004Radio.checked = true;
                type004Radio.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('已选择6开头的信用卡类型004');
            } else {
                console.warn('未找到card_type_004选项');
            }
        } else {
            console.log(`未识别的卡类型，首位数字: ${firstDigit}`);
        }

        // 填写有效期月份
        const monthSelect = document.getElementById('card_expiry_month');
        if (monthSelect) {
            // 确保月份有两位数
            const paddedMonth = expiryMonth.toString().padStart(2, '0');
            monthSelect.value = paddedMonth;
            monthSelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`已选择月份: ${paddedMonth}`);
        } else {
            console.warn('未找到月份选择字段');
        }

        // 填写有效期年份
        const yearSelect = document.getElementById('card_expiry_year');
        if (yearSelect) {
            // 将两位数年份转换为四位数
            const fullYear = expiryYear.length === 2 ? `20${expiryYear}` : expiryYear;
            yearSelect.value = fullYear;
            yearSelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`已选择年份: ${fullYear}`);
        } else {
            console.warn('未找到年份选择字段');
        }

        // 填写CVV
        const cvvField = document.getElementById('card_cvn');
        if (cvvField) {
            cvvField.value = cvv;
            cvvField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log(`已填写CVV: ${cvv}`);
        } else {
            console.warn('未找到CVV字段');
        }

        console.log('信用卡信息填写完成!');
    }

    // 填写表单的主函数
    function fillForm() {
        console.log('开始自动填写表单...');

        // 遍历表单数据并填写
        for (const [fieldName, value] of Object.entries(formData)) {
            const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);

            if (field) {
                if (field.tagName === 'SELECT') {
                    field.value = value;
                    // 触发change事件，使页面可能的验证脚本能检测到变化
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    field.value = value;
                    // 触发input事件，使页面可能的验证脚本能检测到变化
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                }
                console.log(`已填写 ${fieldName}: ${value}`);
            } else {
                console.warn(`未找到字段: ${fieldName}`);
            }
        }

        console.log('基本表单填写完成!');
    }

    // 启动脚本
    console.log('[CyberSource AutoFill] 启动初始化...');
    initializeScript();
})();