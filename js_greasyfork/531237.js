// ==UserScript==
// @name         Nc.me表单自动填充生成器 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  生成随机数据并一键填充表单，支持数据保存和恢复，导出功能
// @author       cursor 0.46.11
// @match        *://*.namecheap.com/*
// @match        *://*.nc.me/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531237/Ncme%E8%A1%A8%E5%8D%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531237/Ncme%E8%A1%A8%E5%8D%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 数据生成工具 - 内联数据避免外部依赖
    const DataGenerator = {
        // 美国常用名
        firstNames: ["John", "Jane", "Alex", "Emily", "Chris", "Katie", "Mike", "Laura", "David", "Sarah", 
                     "Robert", "Amanda", "James", "Jennifer", "Michael", "Elizabeth", "William", "Jessica", 
                     "Thomas", "Melissa", "Kevin", "Rachel", "Brian", "Nicole", "Steven", "Michelle"],
        
        // 美国常用姓
        lastNames: ["Smith", "Johnson", "Brown", "Williams", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", 
                   "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee",
                   "Thompson", "White", "Harris", "Clark", "Lewis", "Young", "Walker", "Hall"],
        
        // 美国常用街道名
        streetNames: ["Main", "Oak", "Park", "Pine", "Maple", "Cedar", "Elm", "Washington", "Lake", "Hill",
                    "Walnut", "Spring", "North", "South", "East", "West", "Center", "River", "Church"],
        
        // 美国常用街道类型
        streetTypes: ["St", "Ave", "Blvd", "Dr", "Rd", "Ln", "Way", "Pl", "Ct", "Terrace", "Circle", "Drive"],
        
        // 美国常用城市
        cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", 
                "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", 
                "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Boston"],
        
        // 美国州
        states: [
            { full: "Alabama", abbr: "AL" }, { full: "Alaska", abbr: "AK" },
            { full: "Arizona", abbr: "AZ" }, { full: "Arkansas", abbr: "AR" },
            { full: "California", abbr: "CA" }, { full: "Colorado", abbr: "CO" },
            { full: "Connecticut", abbr: "CT" }, { full: "Delaware", abbr: "DE" },
            { full: "Florida", abbr: "FL" }, { full: "Georgia", abbr: "GA" },
            { full: "Hawaii", abbr: "HI" }, { full: "Idaho", abbr: "ID" },
            { full: "Illinois", abbr: "IL" }, { full: "Indiana", abbr: "IN" },
            { full: "Iowa", abbr: "IA" }, { full: "Kansas", abbr: "KS" },
            { full: "Kentucky", abbr: "KY" }, { full: "Louisiana", abbr: "LA" },
            { full: "Maine", abbr: "ME" }, { full: "Maryland", abbr: "MD" },
            { full: "Massachusetts", abbr: "MA" }, { full: "Michigan", abbr: "MI" },
            { full: "Minnesota", abbr: "MN" }, { full: "Mississippi", abbr: "MS" },
            { full: "Missouri", abbr: "MO" }, { full: "Montana", abbr: "MT" },
            { full: "Nebraska", abbr: "NE" }, { full: "Nevada", abbr: "NV" },
            { full: "New Hampshire", abbr: "NH" }, { full: "New Jersey", abbr: "NJ" },
            { full: "New Mexico", abbr: "NM" }, { full: "New York", abbr: "NY" },
            { full: "North Carolina", abbr: "NC" }, { full: "North Dakota", abbr: "ND" },
            { full: "Ohio", abbr: "OH" }, { full: "Oklahoma", abbr: "OK" },
            { full: "Oregon", abbr: "OR" }, { full: "Pennsylvania", abbr: "PA" },
            { full: "Rhode Island", abbr: "RI" }, { full: "South Carolina", abbr: "SC" },
            { full: "South Dakota", abbr: "SD" }, { full: "Tennessee", abbr: "TN" },
            { full: "Texas", abbr: "TX" }, { full: "Utah", abbr: "UT" },
            { full: "Vermont", abbr: "VT" }, { full: "Virginia", abbr: "VA" },
            { full: "Washington", abbr: "WA" }, { full: "West Virginia", abbr: "WV" },
            { full: "Wisconsin", abbr: "WI" }, { full: "Wyoming", abbr: "WY" }
        ],
        
        // 随机数生成
        randomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        // 随机选择数组元素
        randomElement: function(array) {
            return array[this.randomInt(0, array.length - 1)];
        },
        
        // 生成随机字符串
        randomString: function(length, chars) {
            chars = chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },
        
        // 生成随机用户名 - 只包含字母和数字
        getUserName: function(firstName, lastName) {
            if (!firstName || !lastName) {
                firstName = this.randomElement(this.firstNames);
                lastName = this.randomElement(this.lastNames);
            }
            
            // 生成几种可能的用户名格式 - 仅使用字母和数字
            const formats = [
                firstName.toLowerCase() + lastName.toLowerCase(),
                firstName.toLowerCase() + this.randomInt(1, 999),
                firstName.toLowerCase() + lastName.toLowerCase() + this.randomInt(1, 99),
                firstName.toLowerCase().substring(0, 1) + lastName.toLowerCase() + this.randomInt(100, 999),
                firstName.toLowerCase() + this.randomInt(1000, 9999)
            ];
            
            // 获取一个随机格式的用户名
            let username = this.randomElement(formats);
            
            // 确保只包含字母和数字
            username = username.replace(/[^a-z0-9]/g, '');
            
            return username;
        },
        
        // 生成随机密码
        getPassword: function(length, includeSpecial) {
            length = length || 10;
            let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            if (includeSpecial) {
                chars += "!@#$%^&*()_+~`|}{[]\\:;?><,./-=";
            }
            return this.randomString(length, chars);
        },
        
        // 生成随机街道地址
        getStreetAddress: function() {
                const number = this.randomInt(100, 9999);
                const street = this.randomElement(this.streetNames);
                const type = this.randomElement(this.streetTypes);
                return number + " " + street + " " + type;
        },
        
        // 生成随机公寓/单元号
        getSecondaryAddress: function() {
                const formats = [
                    "Apt " + this.randomInt(1, 999),
                    "Suite " + this.randomInt(1, 999),
                    "Unit " + this.randomInt(1, 999),
                    "#" + this.randomInt(1, 999)
                ];
                return this.randomElement(formats);
        },
        
        // 生成随机邮编
        getZipCode: function() {
                return "" + this.randomInt(10000, 99999);
        },
        
        // 生成随机电话号码 - 使用(xxx) xxx-xxxx格式
        getPhoneNumber: function() {
            const areaCode = this.randomInt(200, 999);
            const prefix = this.randomInt(200, 999);
            const lineNumber = this.randomInt(1000, 9999);
            
            return `(${areaCode}) ${prefix}-${lineNumber}`;
        },
        
        // 生成完整个人信息数据集
        generatePersonData: function() {
            const firstName = this.randomElement(this.firstNames);
            const lastName = this.randomElement(this.lastNames);
            const state = this.randomElement(this.states);
            
            return {
                username: this.getUserName(firstName, lastName),
                password: this.getPassword(12, true),
                email: "请自行填写用于验证的邮箱", // 固定值
                firstName: firstName,
                lastName: lastName,
                addressLine1: this.getStreetAddress(),
                addressLine2: this.getSecondaryAddress(),
                city: this.randomElement(this.cities),
                state: state.full,
                stateAbbr: state.abbr,
                postalCode: this.getZipCode(),
                phone: this.getPhoneNumber(),
                timestamp: new Date().toLocaleString(),
                filled: false // 添加填充状态标记
            };
        }
    };

    // 数据存储工具 - 使用GM API
    const DataStorage = {
        storageKey: 'formFiller_NamecheapData',
        
        // 检查用户名是否已存在 
        isUsernameDuplicate: function(username) {
            const allData = this.getAllData();
            return allData.some(item => item.username === username);
        },
        
        // 保存数据
        saveData: function(data) {
            try {
                // 首先检查用户名是否已经存在
                if (this.isUsernameDuplicate(data.username)) {
                    return { success: false, message: '该用户名已存在于保存的数据中' };
                }
                
                // 获取现有数据
                let savedData = this.getAllData();
                
                // 生成唯一ID
                data.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
                savedData.push(data);
                
                // 使用GM_setValue保存数据
                GM_setValue(this.storageKey, savedData);
                
                console.log("数据已保存", data);
                return { success: true, id: data.id };
            } catch(e) {
                console.error("保存数据失败:", e);
                return { success: false, message: "保存数据失败: " + e.message };
            }
        },
        
        // 获取所有保存的数据
        getAllData: function() {
            try {
                // 使用GM_getValue获取数据
                const data = GM_getValue(this.storageKey, []);
                console.log("读取的数据:", data);
                return data;
            } catch(e) {
                console.error("读取数据失败:", e);
                return [];
            }
        },
        
        // 获取指定ID的数据
        getData: function(id) {
            const allData = this.getAllData();
            return allData.find(item => item.id === id);
        },
        
        // 删除数据
        deleteData: function(id) {
            let allData = this.getAllData();
            allData = allData.filter(item => item.id !== id);
            GM_setValue(this.storageKey, allData);
        },
        
        // 清空所有数据
        clearAllData: function() {
            GM_setValue(this.storageKey, []);
        },
        
        // 导出所有数据为文本
        exportDataAsText: function() {
            const allData = this.getAllData();
            if (allData.length === 0) {
                return "没有保存的数据";
            }
            
            let text = "表单填充数据导出 - " + new Date().toLocaleString() + "\n\n";
            
            allData.forEach((data, index) => {
                text += `--- 记录 ${index + 1} ---\n`;
                text += `姓名: ${data.firstName} ${data.lastName}\n`;
                text += `用户名: ${data.username}\n`;
                text += `密码: ${data.password}\n`;
                text += `邮箱: ${data.email || '未填写'}\n`;
                text += `地址: ${data.addressLine1}\n`;
                text += `地址2: ${data.addressLine2 || '无'}\n`;
                text += `城市: ${data.city}\n`;
                text += `州/省: ${data.state}\n`;
                text += `邮编: ${data.postalCode}\n`;
                text += `电话: ${data.phone}\n`;
                text += `保存时间: ${data.timestamp || '未知'}\n\n`;
            });
            
            return text;
        }
    };

    // 存储生成的数据、表单填充状态和邮箱填写状态
    let generatedData = {};
    let hasFilledForm = false;
    let emailFilled = false; 
    let userFilledEmail = ""; 

    // 创建UI
    const UI = {
        panel: null,
        dataContainer: null,
        savedDataContainer: null,
        saveButton: null,
        showSavedData: false,
        buttonContainer: null,
        secondRowContainer: null,
        notificationArea: null, 
        
        // 初始化UI
        init: function() {
            // 检测当前页面类型
            const isSignInPage = window.location.href.includes('/login') || 
                                window.location.href.includes('/signin');
            
            // 创建控制面板 - 统一上边界高度
            this.panel = document.createElement('div');
            this.panel.style.cssText = `
                position: fixed;
                top: 200px;
                left: 20px;
                width: 350px;
                background: #f8f9fa;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 10px;
                z-index: 10000;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                max-height: ${isSignInPage ? '90vh' : '75vh'};
                overflow-y: auto;
            `;

            // 创建标题 - 缩小边距
            const title = document.createElement('h3');
            title.textContent = 'Nc.me表单填写助手';
            title.style.cssText = `
                margin: 0 0 8px 0; 
                color: #333; 
                font-size: 16px; 
                text-align: center; 
                padding: 6px 0; 
                background-color: #f1f8e9; 
                border-radius: 4px; 
                border-bottom: 2px solid #4CAF50;
                font-weight: bold;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            `;
            this.panel.appendChild(title);
            
            // 创建通知区域 - 在标题下方
            this.notificationArea = document.createElement('div');
            this.notificationArea.style.cssText = `
                margin: -10px 0 10px 0;
                padding: 0;
                min-height: 30px;
                text-align: center;
            `;
            this.panel.appendChild(this.notificationArea);
            
            // 如果是登录页面，只显示保存的数据
            if (isSignInPage) {
                this.savedDataContainer = document.createElement('div');
                this.savedDataContainer.id = 'saved-data';
                this.panel.appendChild(this.savedDataContainer);
                
                // 显示保存的数据
                this.displaySavedData();
            } else {
                // 注册页面的完整UI
                this.dataContainer = document.createElement('div');
                this.dataContainer.id = 'faker-data';
                this.panel.appendChild(this.dataContainer);

                // 创建保存数据容器
                this.savedDataContainer = document.createElement('div');
                this.savedDataContainer.id = 'saved-data';
                this.savedDataContainer.style.display = 'none';
                this.panel.appendChild(this.savedDataContainer);

                // 创建按钮容器
                this.buttonContainer = document.createElement('div');
                this.buttonContainer.style.cssText = 'display: flex; margin-top: 10px; gap: 6px; flex-wrap: wrap;';
                this.panel.appendChild(this.buttonContainer);

                // 创建生成按钮
                const generateButton = document.createElement('button');
                generateButton.textContent = '重新生成';
                generateButton.style.cssText = `
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    flex: 1;
                    min-width: 100px;
                    font-size: 13px;
                `;
                generateButton.onclick = () => {
                    generatedData = DataGenerator.generatePersonData();
                    hasFilledForm = false;
                    emailFilled = false;
                    userFilledEmail = "";
                    
                    // 重置邮箱表单字段
                    const emailField = findFormField('email');
                    if (emailField) {
                        emailField.value = '';
                        emailField.dispatchEvent(new Event('input', { bubbles: true }));
                        emailField.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    
                    this.updateSaveButtonState();
                    this.displayCurrentData();
                };
                this.buttonContainer.appendChild(generateButton);

                // 创建填充按钮
                const fillButton = document.createElement('button');
                fillButton.textContent = '一键填充';
                fillButton.style.cssText = `
                    background: #2196F3;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    flex: 1;
                    min-width: 100px;
                    font-size: 13px;
                `;
                fillButton.onclick = () => {
                    fillForm();
                    hasFilledForm = true;
                    this.updateSaveButtonState();
                };
                this.buttonContainer.appendChild(fillButton);

                // 创建保存按钮
                this.saveButton = document.createElement('button');
                this.saveButton.textContent = '保存数据';
                this.saveButton.style.cssText = `
                    background: #FF9800;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    flex: 1;
                    min-width: 100px;
                    font-size: 13px;
                    opacity: 0.5;
                `;
                this.saveButton.disabled = true;
                this.saveButton.onclick = () => {
                    if (hasFilledForm && emailFilled) {
                        // 从表单中读取当前值
                        const formData = readFormData();
                        
                        // 显示邮箱确认对话框
                        if (confirm(`请确认填写的邮箱地址是否正确：\n${formData.email}\n\n点击"确定"继续保存，点击"取消"返回修改`)) {
                            const result = DataStorage.saveData(formData);
                            if (result.success) {
                                this.showStatusMessage('数据已保存', 'success');
                                hasFilledForm = false;
                                this.updateSaveButtonState();
                            } else {
                                this.showStatusMessage(result.message, 'warning');
                            }
                        }
                    }
                };
                this.buttonContainer.appendChild(this.saveButton);

                // 第二行按钮
                this.secondRowContainer = document.createElement('div');
                this.secondRowContainer.style.cssText = 'display: flex; margin-top: 10px; gap: 10px;';
                this.panel.appendChild(this.secondRowContainer);

                // 创建数据切换按钮
                const toggleButton = document.createElement('button');
                toggleButton.textContent = '查看保存的数据';
                toggleButton.id = 'toggle-data-view-btn';
                toggleButton.style.cssText = `
                    background: #757575;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    flex: 1;
                `;
                toggleButton.onclick = () => this.toggleDataView();
                this.secondRowContainer.appendChild(toggleButton);

                // 创建导出按钮
                const exportButton = document.createElement('button');
                exportButton.textContent = '导出数据';
                exportButton.style.cssText = `
                    background: #9C27B0;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    flex: 1;
                `;
                exportButton.onclick = () => this.exportData();
                this.secondRowContainer.appendChild(exportButton);
                
                // 显示当前数据
                this.displayCurrentData();
                
                // 添加对表单中邮箱字段的监听
                this.setupEmailListener();
            }

            // 添加面板到文档
            document.body.appendChild(this.panel);
        },
        
        // 邮箱字段的监听器
        setupEmailListener: function() {
            // 使用MutationObserver监听DOM变化
            const observer = new MutationObserver(() => {
                // 尝试查找邮箱字段
                const emailField = findFormField('email');
                if (emailField) {
                    // 获取当前值（如果有的话）
                    if (emailField.value && emailField.value.trim() !== '') {
                        userFilledEmail = emailField.value;
                        emailFilled = true;
                        this.updateSaveButtonState();
                    }
                    
                    // 为邮箱字段添加事件监听器
                    emailField.addEventListener('input', (e) => {
                        userFilledEmail = e.target.value;
                        emailFilled = userFilledEmail.trim() !== '';
                        this.updateSaveButtonState();
                    });
                    
                    // 监听到邮箱字段后可以停止观察
                    observer.disconnect();
                }
            });
            
            // 开始观察文档变化
            observer.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
            
            // 立即尝试查找一次
            const emailField = findFormField('email');
            if (emailField) {
                // 获取当前值（如果有的话）
                if (emailField.value && emailField.value.trim() !== '') {
                    userFilledEmail = emailField.value;
                    emailFilled = true;
                    this.updateSaveButtonState();
                }
                
                emailField.addEventListener('input', (e) => {
                    userFilledEmail = e.target.value;
                    emailFilled = userFilledEmail.trim() !== '';
                    this.updateSaveButtonState();
                });
            }
        },
        
        // 更新保存按钮状态
        updateSaveButtonState: function() {
            if (hasFilledForm && emailFilled) {
                this.saveButton.disabled = false;
                this.saveButton.style.opacity = '1';
                this.saveButton.style.cursor = 'pointer';
            } else {
                this.saveButton.disabled = true;
                this.saveButton.style.opacity = '0.5';
                this.saveButton.style.cursor = 'not-allowed';
            }
        },
        
        // 导出数据为文本文件
        exportData: function() {
            const text = DataStorage.exportDataAsText();
            const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `Nc.me账户数据_${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();
            
            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            this.showStatusMessage('数据已导出', 'success');
        },
        
        // 显示当前生成的数据 
        displayCurrentData: function() {
            // 创建表格显示数据
            let html = '<table style="width:100%; border-collapse: collapse; font-size: 14px;">';
            
            for (const [key, value] of Object.entries(generatedData)) {
                // 不显示一些重复或不必要的字段
                if (key === 'id' || key === 'timestamp' || key === 'stateAbbr' || key === 'filled') continue;
                
                // 特殊处理email字段，显示用户输入的值或红色提示信息
                let displayValue = value;
                if (key === 'email') {
                    if (emailFilled) {
                        displayValue = userFilledEmail;
                    } else {
                        // 使用红色字体显示提示信息
                        displayValue = '<span style="color: #FF0000; font-weight: bold;">请填写邮箱后再保存</span>';
                    }
                }
                
                html += `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 4px 0; color: #666; font-weight: bold;">${formatKey(key)}:</td>
                        <td style="padding: 4px 0;">${displayValue}</td>
                    </tr>
                `;
            }
            
            html += '</table>';
            this.dataContainer.innerHTML = html;
        },
        
        // 显示保存的数据列表 - 调整登录页面按钮布局
        displaySavedData: function() {
            const savedData = DataStorage.getAllData();
            const isSignInPage = window.location.href.includes('/login') || 
                                window.location.href.includes('/signin');
            
            if (savedData.length === 0) {
                this.savedDataContainer.innerHTML = '<p style="text-align:center; color:#666;">没有保存的数据</p>';
                return;
            }
            
            let html = '';
            
            // 调整登录页面按钮布局
            if (!isSignInPage) {
                // 注册页面的清空按钮 
                html += `
                    <div style="margin-bottom: 10px;">
                        <button id="clear-all-data" style="background:#f44336; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
                            清空所有数据
                        </button>
                    </div>
                `;
            } else {
                // 登录页面 - 左右两侧分别放置清空和导出按钮
                html += `
                    <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                        <button id="clear-all-data" style="background:#f44336; color:white; border:none; padding:3px 6px; border-radius:3px; cursor:pointer; font-size: 11px;">
                            清空所有数据
                        </button>
                        <button id="export-data" style="background:#9C27B0; color:white; border:none; padding:3px 6px; border-radius:3px; cursor:pointer; font-size: 11px;">
                            导出数据
                        </button>
                    </div>
                `;
            }
            
            html += '<div style="max-height: 400px; overflow-y: auto;">';
            
            savedData.forEach(data => {
                // 显示邮箱，如果没有则显示提示文本
                const emailDisplay = data.email && data.email !== "用于验证的邮箱" && data.email !== "请自行填写用于验证的邮箱" 
                    ? data.email 
                    : '<span style="color:#999;">未填写邮箱</span>';
                
                if (isSignInPage) {
                    // 登录页面 - 更紧凑的卡片
                    html += `
                        <div style="margin-bottom: 6px; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                                <span style="font-weight: bold; overflow: hidden; text-overflow: ellipsis; max-width: 200px; font-size: 13px;">${emailDisplay}</span>
                                <span style="color: #666; font-size: 11px;">${data.timestamp || '未知时间'}</span>
                            </div>
                            
                            <div style="margin-bottom: 3px; display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                                <span>用户名: ${data.username}</span>
                                <button class="copy-btn" data-text="${data.username}" style="background:#4CAF50; color:white; border:none; padding:1px 6px; border-radius:3px; cursor:pointer; font-size: 11px;">
                                    复制
                                </button>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                                <span>密码: ${data.password}</span>
                                <button class="copy-btn" data-text="${data.password}" style="background:#4CAF50; color:white; border:none; padding:1px 6px; border-radius:3px; cursor:pointer; font-size: 11px;">
                                    复制
                                </button>
                            </div>
                        </div>
                    `;
                } else {
                    // 注册页面 - 更紧凑的卡片
                    html += `
                        <div style="margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                                <span style="font-weight: bold; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${emailDisplay}</span>
                                <span style="color: #666; font-size: 11px;">${data.timestamp || '未知时间'}</span>
                            </div>
                            
                            <div style="margin-bottom: 3px; display: flex; justify-content: space-between; align-items: center;">
                                <span>用户名: ${data.username}</span>
                                <button class="copy-btn" data-text="${data.username}" style="background:#4CAF50; color:white; border:none; padding:1px 5px; border-radius:3px; cursor:pointer; font-size: 11px;">
                                    复制
                                </button>
                            </div>
                            
                            <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                                <span>密码: ${data.password}</span>
                                <button class="copy-btn" data-text="${data.password}" style="background:#4CAF50; color:white; border:none; padding:1px 5px; border-radius:3px; cursor:pointer; font-size: 11px;">
                                    复制
                                </button>
                            </div>
                            
                            <div style="display: flex; gap: 4px;">
                                <button data-id="${data.id}" class="load-data-btn" style="background:#2196F3; color:white; border:none; padding:2px 6px; border-radius:3px; cursor:pointer; flex:1; font-size: 11px;">
                                    加载
                                </button>
                                <button data-id="${data.id}" class="delete-data-btn" style="background:#f44336; color:white; border:none; padding:2px 6px; border-radius:3px; cursor:pointer; flex:1; font-size: 11px;">
                                    删除
                                </button>
                            </div>
                        </div>
                    `;
                }
            });
            
            html += '</div>';
            this.savedDataContainer.innerHTML = html;
            
            // 添加事件监听
            setTimeout(() => {
                // 复制按钮事件监听
                this.savedDataContainer.querySelectorAll('.copy-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const textToCopy = e.target.getAttribute('data-text');
                        navigator.clipboard.writeText(textToCopy).then(() => {
                            this.showStatusMessage('已复制到剪贴板', 'success');
                        }).catch(err => {
                            console.error('复制失败:', err);
                            this.showStatusMessage('复制失败', 'error');
                        });
                    });
                });
                
                // 非登录页面的按钮事件
                if (!isSignInPage) {
                    this.savedDataContainer.querySelectorAll('.load-data-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = e.target.getAttribute('data-id');
                            this.loadSavedData(id);
                        });
                    });
                    
                    this.savedDataContainer.querySelectorAll('.delete-data-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = e.target.getAttribute('data-id');
                            this.deleteSavedData(id);
                        });
                    });
                }
                
                // 清空按钮 - 两种页面都有
                const clearAllBtn = document.getElementById('clear-all-data');
                if (clearAllBtn) {
                    clearAllBtn.addEventListener('click', () => this.clearAllSavedData());
                }
                
                // 登录页面专用导出按钮
                if (isSignInPage) {
                    const exportBtn = document.getElementById('export-data');
                    if (exportBtn) {
                        exportBtn.addEventListener('click', () => this.exportData());
                    }
                }
            }, 0);
        },
        
        // 切换数据视图（当前/保存的）
        toggleDataView: function() {
            this.showSavedData = !this.showSavedData;
            
            if (this.showSavedData) {
                this.dataContainer.style.display = 'none';
                this.savedDataContainer.style.display = 'block';
                this.displaySavedData();
                
                // 隐藏主操作按钮
                this.buttonContainer.style.display = 'none';
                
                // 更新切换按钮文字
                const toggleBtn = document.getElementById('toggle-data-view-btn');
                if (toggleBtn) toggleBtn.textContent = '返回当前数据';
            } else {
                this.dataContainer.style.display = 'block';
                this.savedDataContainer.style.display = 'none';
                this.displayCurrentData();
                
                // 显示主操作按钮
                this.buttonContainer.style.display = 'flex';
                
                // 更新切换按钮文字
                const toggleBtn = document.getElementById('toggle-data-view-btn');
                if (toggleBtn) toggleBtn.textContent = '查看保存的数据';
            }
        },
        
        // 加载保存的数据
        loadSavedData: function(id) {
            const data = DataStorage.getData(id);
            if (data) {
                generatedData = data;
                hasFilledForm = false;
                this.updateSaveButtonState();
                this.displayCurrentData();
                this.toggleDataView();
                this.showStatusMessage('数据已加载', 'info');
            }
        },
        
        // 删除保存的数据
        deleteSavedData: function(id) {
            if (confirm('确定要删除这条数据吗？')) {
                DataStorage.deleteData(id);
                this.displaySavedData();
                this.showStatusMessage('数据已删除', 'success');
            }
        },
        
        // 清空所有保存的数据
        clearAllSavedData: function() {
            if (confirm('确定要删除所有保存的数据吗？')) {
                DataStorage.clearAllData();
                this.displaySavedData();
                this.showStatusMessage('所有数据已清空', 'success');
            }
        },
        
        // 显示状态消息 - 改为在面板内显示
        showStatusMessage: function(message, type = 'info') {
            // 清除旧消息
            const oldMessages = this.notificationArea.querySelectorAll('.status-message');
            oldMessages.forEach(msg => msg.remove());
            
            // 创建新消息
            const statusDiv = document.createElement('div');
            statusDiv.textContent = message;
            statusDiv.className = 'status-message';
            
            // 根据消息类型设置不同样式
            let bgColor, textColor = 'white';
            switch(type) {
                case 'success':
                    bgColor = '#4CAF50';
                    break;
                case 'warning':
                    bgColor = '#FF9800';
                    break;
                case 'error':
                    bgColor = '#F44336';
                    break;
                default:
                    bgColor = '#2196F3'; // info
            }
            
            statusDiv.style.cssText = `
                padding: 8px 12px;
                border-radius: 4px;
                color: ${textColor};
                margin: 5px 0;
                animation: fadeIn 0.3s ease-in-out;
                background-color: ${bgColor};
            `;
            
            // 添加到通知区域
            this.notificationArea.appendChild(statusDiv);
            
            // 自动隐藏
            setTimeout(() => {
                statusDiv.style.animation = 'fadeOut 0.5s ease-in-out forwards';
                setTimeout(() => statusDiv.remove(), 500);
            }, 3000);
        }
    };

    // 格式化键名为更友好的显示
    function formatKey(key) {
        return key
            .replace(/([A-Z])/g, ' $1') // 在大写字母前添加空格
            .replace(/^./, str => str.toUpperCase()) // 首字母大写
            .replace(/([a-z])(\d)/, '$1 $2') // 在字母和数字之间添加空格
            .replace('Line', ' Line '); // 处理地址行
    }

    // 填充表单
    function fillForm() {
        // 查找表单字段
        const usernameField = findFormField('username', 'user', 'login');
        const passwordField = findFormField('password', 'pass');
        const confirmPasswordField = findFormField('password_confirmation', 'confirm', 'repeat', 'verif');
        const emailField = findFormField('email');
        const firstNameField = findFormField('first_name', 'firstname', 'fname', 'first name', 'name');
        const lastNameField = findFormField('last_name', 'lastname', 'lname', 'last name', 'surname');
        
        const addressLine1Field = findFormField('address_1', 'address1', 'address-line-1', 'address_line_1', 'address', 'street', 'line1');
        const addressLine2Field = findFormField('address_2', 'address2', 'address-line-2', 'address_line_2', 'apt', 'suite', 'line2');
        
        const cityField = findFormField('city', 'town');
        const stateField = findFormField('state', 'province', 'region');
        const postalCodeField = findFormField('zipcode', 'postal', 'zip', 'postcode');
        const phoneField = findFormField('phone_intl', 'phone', 'telephone', 'mobile', 'cell');

        // 填充字段
        fillField(usernameField, generatedData.username);
        fillField(passwordField, generatedData.password);
        fillField(confirmPasswordField, generatedData.password);
        
        // Email不自动填充，但检查是否已有用户输入的值
        if (emailField) {
            // 如果邮箱字段已有内容，保存用户输入的邮箱值
            if (emailField.value && emailField.value.trim() !== '') {
                userFilledEmail = emailField.value;
                emailFilled = true;
            } else {
                // 如果已经有用户填写的邮箱值，则可以选择保留而不清空
                // 这是可选的，取决于您希望的行为
            }
        }
        
        fillField(firstNameField, generatedData.firstName);
        fillField(lastNameField, generatedData.lastName);
        fillField(addressLine1Field, generatedData.addressLine1);
        fillField(addressLine2Field, generatedData.addressLine2);
        fillField(cityField, generatedData.city);
        fillField(stateField, generatedData.state);
        fillField(postalCodeField, generatedData.postalCode);
        fillField(phoneField, generatedData.phone);

        // 处理额外的电话国家代码字段
        const phoneCountryField = document.querySelector('input[name="phone_country"]');
        if (phoneCountryField) {
            phoneCountryField.value = '1'; // 默认美国国家代码
            phoneCountryField.dispatchEvent(new Event('input', { bubbles: true }));
            phoneCountryField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 处理隐藏的电话字段
        const hiddenPhoneField = document.querySelector('input[name="phone"]');
        if (hiddenPhoneField) {
            hiddenPhoneField.value = generatedData.phone;
            hiddenPhoneField.dispatchEvent(new Event('input', { bubbles: true }));
            hiddenPhoneField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 显示填充结果
        UI.showStatusMessage('表单已填充', 'success');
        
        // 标记数据已填充状态
        generatedData.filled = true;
        
        // 更新保存按钮状态
        UI.updateSaveButtonState();
        
        // 更新显示的数据为表单中的当前值
        generatedData = readFormData();
        UI.displayCurrentData();
    }

    // 通过多种可能的名称查找表单字段
    function findFormField(...possibleNames) {
        for (const name of possibleNames) {
            // 尝试通过id查找
            let element = document.getElementById(name);
            if (element && isInputElement(element)) return element;

            // 尝试通过name查找
            element = document.querySelector(`[name="${name}"], [name="${name.toLowerCase()}"]`);
            if (element && isInputElement(element)) return element;

            // 尝试通过placeholder查找
            element = document.querySelector(`[placeholder*="${name}"], [placeholder*="${name.toLowerCase()}"]`);
            if (element && isInputElement(element)) return element;

            // 查找特定的确认密码和地址字段
            if (name === 'confirm' || name === 'password_confirmation') {
                element = document.querySelector('input[name="password_confirmation"]');
                if (element) return element;
            }
            
            if (name === 'address_1' || name === 'address1') {
                element = document.querySelector('input[name="address_1"]');
                if (element) return element;
            }
            
            if (name === 'address_2' || name === 'address2') {
                element = document.querySelector('input[name="address_2"]');
                if (element) return element;
            }

            // 尝试通过标签相关文本查找
            const labels = Array.from(document.querySelectorAll('label'));
            for (const label of labels) {
                if (label.textContent.toLowerCase().includes(name.toLowerCase())) {
                    // 检查for属性
                    if (label.htmlFor) {
                        element = document.getElementById(label.htmlFor);
                        if (element && isInputElement(element)) return element;
                    }
                    
                    // 检查嵌套的input
                    element = label.querySelector('input, textarea, select');
                    if (element && isInputElement(element)) return element;
                }
            }
        }

        // 使用更通用的选择器
        for (const name of possibleNames) {
            const elements = document.querySelectorAll('input, textarea, select');
            for (const element of elements) {
                if (!isInputElement(element)) continue;
                
                // 检查是否在附近有相关文本
                const parent = element.parentElement;
                if (parent && parent.textContent.toLowerCase().includes(name.toLowerCase())) {
                    return element;
                }

                // 检查placeholder属性是否含有相关文本
                const placeholder = element.getAttribute('placeholder');
                if (placeholder && placeholder.toLowerCase().includes(name.toLowerCase())) {
                    return element;
                }
            }
        }

        return null;
    }

    // 判断是否是输入元素
    function isInputElement(element) {
        if (!element) return false;
        return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT';
    }

    // 填充字段
    function fillField(field, value) {
        if (!field || !value) return;

        // 设置值
        field.value = value;
        
        // 触发事件，确保表单验证能够响应
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        field.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // 从表单中读取当前值的函数
    function readFormData() {
        // 查找表单字段
        const usernameField = findFormField('username', 'user', 'login');
        const passwordField = findFormField('password', 'pass');
        const emailField = findFormField('email');
        const firstNameField = findFormField('first_name', 'firstname', 'fname', 'first name', 'name');
        const lastNameField = findFormField('last_name', 'lastname', 'lname', 'last name', 'surname');
        const addressLine1Field = findFormField('address_1', 'address1', 'address-line-1', 'address_line_1', 'address', 'street', 'line1');
        const addressLine2Field = findFormField('address_2', 'address2', 'address-line-2', 'address_line_2', 'apt', 'suite', 'line2');
        const cityField = findFormField('city', 'town');
        const stateField = findFormField('state', 'province', 'region');
        const postalCodeField = findFormField('zipcode', 'postal', 'zip', 'postcode');
        const phoneField = findFormField('phone_intl', 'phone', 'telephone', 'mobile', 'cell');

        // 读取字段值
        const formData = {
            username: usernameField ? usernameField.value : generatedData.username,
            password: passwordField ? passwordField.value : generatedData.password,
            email: emailField ? emailField.value : userFilledEmail,
            firstName: firstNameField ? firstNameField.value : generatedData.firstName,
            lastName: lastNameField ? lastNameField.value : generatedData.lastName,
            addressLine1: addressLine1Field ? addressLine1Field.value : generatedData.addressLine1,
            addressLine2: addressLine2Field ? addressLine2Field.value : generatedData.addressLine2,
            city: cityField ? cityField.value : generatedData.city,
            state: stateField ? stateField.value : generatedData.state,
            postalCode: postalCodeField ? postalCodeField.value : generatedData.postalCode,
            phone: phoneField ? phoneField.value : generatedData.phone,
            timestamp: new Date().toLocaleString(),
            id: generatedData.id || null  // 保留ID如果已存在
        };

        return formData;
    }

    // 添加动画样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }

    // 初始化时添加动画样式
    addStyles();

    // 初始化UI和数据
    UI.init();
    generatedData = DataGenerator.generatePersonData();
    UI.displayCurrentData();
})();