// ==UserScript==
// @name         Izyz-Helper
// @namespace    https://greasyfork.org/users/1417526
// @version      0.1.3
// @description  Help you to use izyz easier!
// @author       Weichenleeeee
// @match        https://www.gdzyz.cn/*
// @icon         https://www.gdzyz.cn/assets/weblogo.1b6eba63.svg
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/522290/Izyz-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/522290/Izyz-Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var names = []; // 用实际的名字替换
    var nextButtonEnabled = false; // 是否已点击“添加补录”
    var skipButtonEnabled = false; // 是否点击了跳过按钮
    var volunteersSkipped = [];

    // 检测XLSX库是否加载成功
    setTimeout(function() {
        if (typeof XLSX === "undefined") {
            console.error("XLSX 库加载失败！");
            alert("无法加载 XLSX 库，功能无法使用！");
            return;
        } else {
            console.log("XLSX 库加载成功！");
        }
    }, 1000); // 延迟1秒检查是否加载成功

    // 添加图片上传按钮
    function createImageInput() {
        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '130px';
        container.style.left = '10px';
        container.style.zIndex = 9999;
        
        var label = document.createElement('span');
        label.textContent = '上传志愿者照片';
        label.style.color = '#4CAF50';
        label.style.marginRight = '10px';
        label.style.fontSize = '14px';
        container.appendChild(label);

        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // 限制为图片文件
        input.title = '上传志愿者照片（支持JPG/PNG格式）';
        input.style.padding = '5px';
        input.style.borderRadius = '5px';
        input.style.backgroundColor = '#4CAF50';
        input.style.color = 'white';
        input.style.border = 'none';
        input.style.cursor = 'pointer';
        input.addEventListener('change', handleImageSelect);
        container.appendChild(input);
        document.body.appendChild(container);
    }

    // 添加Excel上传按钮
    function createExcelInput() {
        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '90px';
        container.style.left = '10px';
        container.style.zIndex = 9999;
        
        var label = document.createElement('span');
        label.textContent = '上传志愿者名单';
        label.style.color = '#2196F3';
        label.style.marginRight = '10px';
        label.style.fontSize = '14px';
        container.appendChild(label);

        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls'; // 限制为Excel文件
        input.title = '上传志愿者名单（支持Excel格式）';
        input.style.padding = '5px';
        input.style.borderRadius = '5px';
        input.style.backgroundColor = '#2196F3';
        input.style.color = 'white';
        input.style.border = 'none';
        input.style.cursor = 'pointer';
        input.addEventListener('change', handleExcelSelect);
        container.appendChild(input);
        document.body.appendChild(container);
    }

    // 处理Excel文件选择
    function handleExcelSelect(event) {
        var file = event.target.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });
                var sheet = workbook.Sheets[workbook.SheetNames[0]]; // 默认取第一个工作表

                // 将工作表转换为二维数组，raw: true 确保读取原始数据而不进行格式化
                var json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

                // 打印原始数据以查看第一行
                console.log('读取到的数据：', json);

                // 在整个表格中搜索"姓名"列
                var nameColumnIndex = -1;
                
                // 首先检查表头
                var header = json[0];
                nameColumnIndex = header.findIndex(col => col.trim() === "姓名");
                
                // 如果表头中没有找到，遍历所有行查找
                if (nameColumnIndex === -1) {
                    for (let i = 0; i < json.length; i++) {
                        nameColumnIndex = json[i].findIndex(col => col.trim() === "姓名");
                        if (nameColumnIndex !== -1) {
                            console.log('在第', i + 1, '行找到"姓名"列');
                            break;
                        }
                    }
                }

                if (nameColumnIndex === -1) {
                    alert('未找到“姓名”列，请确保Excel中有“姓名”列');
                    console.error('未找到姓名列');
                    return;
                }

                // 提取姓名列数据，并移除姓名前的数字，跳过表头
                names = json.slice(1).map(row => {
                    let name = row[nameColumnIndex];
                    if (name) {
                        // 使用正则表达式移除姓名前的数字
                        name = name.replace(/^\d+/, '').trim();
                    }
                    return name;
                }).filter(name => name && name !== "姓名"); // 过滤掉空值和"姓名"字符串

                console.log('已加载姓名：', names);
                alert('Excel 文件已成功加载，姓名已提取！');
            };

            reader.onerror = function(ex) {
                console.log(ex);
            };

            reader.readAsBinaryString(file);
        } else {
            alert('请上传有效的 Excel 文件');
        }
    }
    
    // 添加跳过按钮
    function createSkipButton() {
        var skipButton = document.createElement('button');
        skipButton.textContent = '跳过当前志愿者';
        skipButton.style.position = 'fixed';
        skipButton.style.bottom = '50px'; // 放在“上传文件”按钮的上方
        skipButton.style.left = '10px';
        skipButton.style.zIndex = 9999;
        skipButton.style.padding = '10px';
        skipButton.style.borderRadius = '5px';
        skipButton.style.backgroundColor = '#f44336'; // 红色按钮
        skipButton.style.color = 'white';
        skipButton.style.border = 'none';
        skipButton.style.cursor = 'pointer';
        skipButton.style.fontSize = '14px';
        skipButton.addEventListener('click', function() {
            skipButtonEnabled = true; // 设置跳过标志
            console.log('用户点击了跳过按钮1');
            console.log('skipButtonEnabled is ',skipButtonEnabled);
        });
        document.body.appendChild(skipButton);
    }

    // 百度云OCR配置
    const BAIDU_API_KEY = '4rHGTojlMzTYGov3tBHugdI6';
    const BAIDU_SECRET_KEY = 'g4dhvSh3KHXfDoljUPRFceVczdVrGued';
    let accessToken = '';

    // 获取百度云access_token
    function getAccessToken() {
        return new Promise((resolve, reject) => {
            const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`;
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.access_token) {
                            accessToken = data.access_token;
                            console.log('百度云access_token获取成功');
                            resolve();
                        } else {
                            throw new Error('获取access_token失败');
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 将图片文件转换为base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // 处理图片选择
    async function handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            alert('请上传有效的图片文件');
            return;
        }

        try {
            // 获取access_token
            await getAccessToken();
            
            // 将图片转换为base64
            const imageBase64 = await fileToBase64(file);
            
            // 调用百度云OCR API
            const ocrUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${accessToken}`;
            
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: ocrUrl,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: `image=${encodeURIComponent(imageBase64)}&language_type=CHN_ENG`,
                    onload: function(response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.words_result) {
                                names = result.words_result
                                    .map(item => item.words.trim())
                                    .filter(line => line.length > 0)
                                    .map(name => {
                                        // 移除姓名前的数字
                                        name = name.replace(/^\d+/, '').trim();
                                        // 匹配2-4个中文字符的姓名
                                        const chineseNamePattern = /^[\u4e00-\u9fa5]{2,4}$/;
                                        if (chineseNamePattern.test(name)) {
                                            return name;
                                        }
                                        return null;
                                    })
                                    .filter(name => name !== null); // 过滤掉不符合条件的项

                                // 创建选择界面
                                const modal = document.createElement('div');
                                modal.style.position = 'fixed';
                                modal.style.top = '0';
                                modal.style.left = '0';
                                modal.style.width = '100%';
                                modal.style.height = '100%';
                                modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
                                modal.style.zIndex = 10000;
                                
                                const content = document.createElement('div');
                                content.style.position = 'absolute';
                                content.style.top = '50%';
                                content.style.left = '50%';
                                content.style.transform = 'translate(-50%, -50%)';
                                content.style.backgroundColor = 'white';
                                content.style.padding = '20px';
                                content.style.borderRadius = '5px';
                                content.style.width = '400px';
                                
                                const title = document.createElement('h3');
                                title.textContent = '请选择要添加的姓名';
                                title.style.marginBottom = '15px';
                                content.appendChild(title);
                                
                                const list = document.createElement('div');
                                list.style.maxHeight = '300px';
                                list.style.overflowY = 'auto';
                                list.style.marginBottom = '15px';
                                
                                names.forEach((name, index) => {
                                    const item = document.createElement('div');
                                    item.style.display = 'flex';
                                    item.style.alignItems = 'center';
                                    item.style.marginBottom = '10px';
                                    
                                    const checkbox = document.createElement('input');
                                    checkbox.type = 'checkbox';
                                    checkbox.checked = true;
                                    checkbox.style.marginRight = '10px';
                                    
                                    const input = document.createElement('input');
                                    input.type = 'text';
                                    input.value = name;
                                    input.style.flex = '1';
                                    input.style.padding = '5px';
                                    
                                    item.appendChild(checkbox);
                                    item.appendChild(input);
                                    list.appendChild(item);
                                });
                                
                                content.appendChild(list);
                                
                                const buttonContainer = document.createElement('div');
                                buttonContainer.style.display = 'flex';
                                buttonContainer.style.justifyContent = 'flex-end';
                                
                                const confirmButton = document.createElement('button');
                                confirmButton.textContent = '确认';
                                confirmButton.style.padding = '8px 16px';
                                confirmButton.style.backgroundColor = '#4CAF50';
                                confirmButton.style.color = 'white';
                                confirmButton.style.border = 'none';
                                confirmButton.style.borderRadius = '4px';
                                confirmButton.style.cursor = 'pointer';
                                confirmButton.onclick = () => {
                                    const selectedNames = [];
                                    list.querySelectorAll('div').forEach(item => {
                                        const checkbox = item.querySelector('input[type="checkbox"]');
                                        const input = item.querySelector('input[type="text"]');
                                        if (checkbox.checked) {
                                            selectedNames.push(input.value.trim());
                                        }
                                    });
                                    names = selectedNames.filter(name => name.length > 0);
                                    document.body.removeChild(modal);
                                    console.log('用户选择的姓名：', names);
                                    alert('姓名选择完成！');
                                    resolve();
                                };
                                
                                const cancelButton = document.createElement('button');
                                cancelButton.textContent = '取消';
                                cancelButton.style.padding = '8px 16px';
                                cancelButton.style.marginRight = '10px';
                                cancelButton.style.backgroundColor = '#f44336';
                                cancelButton.style.color = 'white';
                                cancelButton.style.border = 'none';
                                cancelButton.style.borderRadius = '4px';
                                cancelButton.style.cursor = 'pointer';
                                cancelButton.onclick = () => {
                                    document.body.removeChild(modal);
                                    resolve();
                                };
                                
                                buttonContainer.appendChild(cancelButton);
                                buttonContainer.appendChild(confirmButton);
                                content.appendChild(buttonContainer);
                                
                                modal.appendChild(content);
                                document.body.appendChild(modal);
                            } else {
                                throw new Error('OCR识别失败');
                            }
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('图片识别失败：', error);
            alert('图片识别失败，请确保图片清晰且包含中文文本');
        }
    }


    // 创建并显示进度条
    function createProgressBar() {
        var progressContainer = document.createElement('div');
        progressContainer.style.position = 'fixed';
        progressContainer.style.bottom = '170px';  // 下移80px
        progressContainer.style.left = '10px';
        progressContainer.style.zIndex = 9999;
        progressContainer.style.width = '300px';
        progressContainer.style.height = '30px';
        progressContainer.style.backgroundColor = '#e0e0e0';
        progressContainer.style.borderRadius = '5px';
            
        var progressBar = document.createElement('div');
        progressBar.style.height = '100%';
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#4CAF50';
        progressBar.style.borderRadius = '5px';
        progressContainer.appendChild(progressBar);
    
        var progressText = document.createElement('span');
        progressText.style.position = 'absolute';
        progressText.style.top = '50%';
        progressText.style.left = '50%';
        progressText.style.transform = 'translate(-50%, -50%)';
        progressText.style.color = 'white';
        progressText.style.fontSize = '14px';
        progressContainer.appendChild(progressText);
    
        var currentVolunteerText = document.createElement('span');
        currentVolunteerText.style.position = 'fixed';
        currentVolunteerText.style.bottom = '210px';  // 下移80px
        currentVolunteerText.style.left = '10px';
        currentVolunteerText.style.zIndex = 9999;
        currentVolunteerText.style.fontSize = '14px';
        currentVolunteerText.style.color = '#4CAF50';
        currentVolunteerText.style.fontWeight = 'bold';
        currentVolunteerText.textContent = '当前录入：第 0 个志愿者';
        document.body.appendChild(currentVolunteerText);
    
        document.body.appendChild(progressContainer); // 确保进度条在页面中显示
    
        return { progressBar, progressText, currentVolunteerText };
    
    }

    // 更新进度条
    function updateProgressBar(progressBar, progressText, current, total, currentVolunteerText) {
        var percentage = Math.round((current / total) * 100);
        progressBar.style.width = percentage + '%';
        progressText.textContent = `进度：${percentage}%`;
        currentVolunteerText.textContent = `当前录入：第 ${current} 个志愿者`;
    }


    // 定义一个函数来模拟点击按钮事件
    async function clickButton(selector, delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
        var button = document.querySelector(selector);
        if (button) {
            button.click();
            console.log(`${selector} 按钮已点击`);
        } else {
            console.log(`${selector} 按钮未找到`);
        }
    }

    // 定义一个函数来输入姓名
    async function inputName(name, delay) { // 将 inputText 作为参数传递
        await new Promise(resolve => setTimeout(resolve, delay));
        let input = document.querySelectorAll('.el-input__inner')[0];
        if (input) {
            input.value = name; // 使用参数 name 而不是全局变量 inputText
            var event = document.createEvent('HTMLEvents');
            event.initEvent("input", true, true);
            event.eventType = 'message';
            input.dispatchEvent(event);
            console.log('姓名已输入');
        } else {
            console.log('文本框未找到');
        }
    }

    async function waitForUserAction() {
        return new Promise(resolve => {
            let resolved = false;
            const handleClick = (event) => {
                if (resolved) return;
                
                // 处理跳过按钮点击
                const skipButton = event.target.closest('button');
                if (skipButton && skipButton.textContent.trim() === '跳过当前志愿者') {
                    console.log('用户点击了跳过按钮');
                    resolved = true;
                    resolve('SKIP');
                    return;
                }

                // 处理添加补录按钮点击
                const nextButton = event.target.closest('button.el-button.el-button--primary');
                if (nextButton && nextButton.querySelector('span')?.textContent.trim() === '添加补录') {
                    console.log('用户点击了“添加补录”按钮');
                    resolved = true;
                    resolve('CONTINUE');
                    return;
                }
            };

            // 使用捕获阶段监听，确保能捕获到动态创建的按钮
            document.addEventListener('click', handleClick, { capture: true });

            // 添加超时检查
            const timeout = setTimeout(() => {
                if (!resolved) {
                    console.log('等待用户操作超时');
                    resolved = true;
                    resolve('TIMEOUT');
                }
            }, 30000); // 30秒超时

            // 清理函数
            return () => {
                document.removeEventListener('click', handleClick, { capture: true });
                clearTimeout(timeout);
            };
        });
    }

    // 定义一个函数来勾选单选框并点击“添加补录”
    async function checkCheckbox(delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
        var checkboxes = document.querySelectorAll('.el-checkbox__inner');
        if (checkboxes.length > 4) {
            console.log('超过4个单选框被找到，等待用户操作');
            alert('出现重名，请手动勾选志愿者，并点击“添加补录”');
            await waitForUserAction(); // 等待用户点击“添加补录”
        }
        else if(checkboxes.length < 4){
            // 查无此人的情况，需要手动勾选
            console.log('查无此人，提供跳过或手动选择的选项');
            alert('查无此人，请手动勾选志愿者并点击“添加补录”，或点击“跳过”按钮');
            const result = await waitForUserAction(); // 等待用户点击“添加补录”或“跳过”
            console.log(result);
            if (result === 'SKIP') {
                return 'SKIP'; // 跳过当前志愿者
            }else if (result === 'CONTINUE') {
                return 'CONTINUE';
            }
        }else{
            // 正常情况
            checkboxes.forEach((checkbox) => checkbox.click());
            console.log('单选框已勾选');
            await clickButton('.el-button.el-button--primary[style*="margin-bottom: 20px;"]', 500); // 点击“添加补录”按钮
            nextButtonEnabled = true; // 标志已完成“添加补录”
        }
    }

    // 主处理函数
    async function processNames(names){
        const { progressBar, progressText, currentVolunteerText } = createProgressBar(); // 创建进度条
        for (let i = 0; i < names.length; i++) {
            console.log(`正在处理志愿者：${names[i]}`);
    
            await clickButton('.el-button.el-button--primary', 1000); // 打开输入页面
            await inputName(names[i], 1000); // 输入志愿者姓名
            await clickButton('.queryOrgBtn', 500); // 点击查询按钮
    
            const result = await checkCheckbox(500);
            if (result === 'SKIP') {
                console.log(`跳过志愿者：${names[i]}`);
                // 记录当前志愿者的名字
                volunteersSkipped.push(names[i]);
                console.log(`记录志愿者：${names[i]}`);
                continue; // 跳过当前志愿者，进入下一个
            }else if (result === 'CONTINUE') {
                console.log(`继续处理志愿者：${names[i]}`);
            }
            // 更新进度条
            updateProgressBar(progressBar, progressText, i + 1, names.length, currentVolunteerText);
    
            // 等待用户完成“添加补录”操作
            await clickButton('.el-button.el-button--primary[style*="display: block; margin: 0px auto;"]', 500); // 点击“下一步”按钮
            console.log('“下一步”已被点击');
            nextButtonEnabled = false; // 重置标志
        };
        // 在最后显示被跳过的志愿者名字
        if (volunteersSkipped.length > 0) {
            alert(`录用完成，被跳过的的志愿者：${volunteersSkipped.join(', ')}`);
        }
    }

    // 创建按钮
    createImageInput();
    createExcelInput();
    createSkipButton();

    // 定义菜单命令：开始
    let menu1 = GM_registerMenuCommand('开始', function () {
        if (names.length === 0) {
            alert('请先上传并加载 Excel 文件！');
            return;
        }
        processNames(names);
    }, 'o');

})();
