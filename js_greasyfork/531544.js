// ==UserScript==
// @name         libulib提示词生成助手
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  在libulib网页上使用DeepSeek生成Stable Diffusion提示词
// @author       You
// @match        https://libulib.com/*
// @match        https://*.liblib.art/*
// @match        https://liblib.art/*
// @grant        GM_xmlhttpRequest
// @connect      api.deepseek.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531544/libulib%E6%8F%90%E7%A4%BA%E8%AF%8D%E7%94%9F%E6%88%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531544/libulib%E6%8F%90%E7%A4%BA%E8%AF%8D%E7%94%9F%E6%88%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // DeepSeek API 配置
    const DEEPSEEK_API_KEY = 'sk-6fbd209f4e0649bb8b55286348a9f606';
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

    // 系统提示词
    const SYSTEM_PROMPT = `你是一个专业的提示词生成助手，需要为Stable Diffusion F.1模型生成高质量的提示词。请遵循以下规则：

1. 必须在提示词的首词中包含"chan"元素
2. 需要符合Stable Diffusion F.1模型的提示词特征
3. 提示词必须精炼，格式整齐，清晰分成正向提示词和负向提示词两部分
4. 根据用户输入的需求自动发散提示词，提示词只用于stable diffusion生图相关内容
5. 必须确保生成的是完整的全身形象，正向提示词中加入"full body, full shot"关键词
6. 在负向提示词中必须加入"cropped, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, bad feet, fewer toes, extra toes"防止生成局部和低质量图像
7. 返回格式必须是JSON，包含positive和negative两个字段，分别对应正向和负向提示词
8. 所有提示词必须使用英文，即使用户输入的是中文，也要将意思转换为英文关键词

返回的JSON格式示例：
{
  "positive": "chan, detailed character, full body, full shot, [other positive prompts in English]",
  "negative": "cropped, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, bad feet, fewer toes, extra toes, [other negative prompts in English]"
}`;

    // 创建用户输入模态框
    function createUserInputModal() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '10000';
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        const modal = document.createElement('div');
        modal.style.position = 'absolute';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.borderRadius = '8px';
        modal.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        modal.style.width = '500px';
        modal.style.maxWidth = '90%';

        const header = document.createElement('h2');
        header.textContent = 'Stable Diffusion提示词生成';
        header.style.marginTop = '0';
        header.style.marginBottom = '20px';
        header.style.color = '#333';
        header.style.textAlign = 'center';
        modal.appendChild(header);

        // 输入框 - 提示词描述
        const inputLabel = document.createElement('div');
        inputLabel.textContent = '请输入你想要的图像描述';
        inputLabel.style.fontWeight = 'bold';
        inputLabel.style.marginBottom = '5px';
        modal.appendChild(inputLabel);

        const inputField = document.createElement('textarea');
        inputField.style.width = '100%';
        inputField.style.height = '80px';
        inputField.style.marginBottom = '15px';
        inputField.style.padding = '8px';
        inputField.style.boxSizing = 'border-box';
        inputField.style.borderRadius = '4px';
        inputField.style.border = '1px solid #ddd';
        inputField.placeholder = '例如：一个魔法师正在魔法学院施展魔法';
        modal.appendChild(inputField);

        // 加载状态区域
        const loadingContainer = document.createElement('div');
        loadingContainer.style.display = 'none';
        loadingContainer.style.marginBottom = '15px';
        loadingContainer.style.padding = '10px';
        loadingContainer.style.backgroundColor = '#f5f5f5';
        loadingContainer.style.borderRadius = '4px';
        loadingContainer.style.maxHeight = '150px';
        loadingContainer.style.overflowY = 'auto';
        modal.appendChild(loadingContainer);

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.gap = '10px';
        modal.appendChild(buttonContainer);

        // 生成提示词按钮
        const generateButton = document.createElement('button');
        generateButton.textContent = '生成提示词';
        generateButton.style.padding = '10px 16px';
        generateButton.style.backgroundColor = '#4CAF50';
        generateButton.style.color = 'white';
        generateButton.style.border = 'none';
        generateButton.style.borderRadius = '4px';
        generateButton.style.cursor = 'pointer';
        generateButton.style.flex = '1';
        generateButton.style.height = '58px';
        buttonContainer.appendChild(generateButton);

        // 检查是否在physton-gradio-container环境中
        const isInPhystonContainer = !!document.querySelector('.physton-gradio-container');
        const isInTabsContent = !!document.querySelector('.el-tabs__content');

        // 根据容器类型添加第二个按钮
        if (isInPhystonContainer) {
            // 在physton环境中添加"优化提示词"按钮
            const optimizeButton = document.createElement('button');
            optimizeButton.textContent = '优化提示词';
            optimizeButton.style.padding = '10px 16px';
            optimizeButton.style.backgroundColor = '#2196F3';
            optimizeButton.style.color = 'white';
            optimizeButton.style.border = 'none';
            optimizeButton.style.borderRadius = '4px';
            optimizeButton.style.cursor = 'pointer';
            optimizeButton.style.flex = '1';
            optimizeButton.style.height = '58px';
            buttonContainer.appendChild(optimizeButton);

            // 优化提示词按钮点击事件
            optimizeButton.addEventListener('click', () => {
                // 查找当前输入框中的内容
                const textareas = document.querySelectorAll('.physton-prompt textarea');
                if (textareas.length === 0) {
                    alert('未找到提示词输入框');
                    return;
                }

                // 获取当前选中或第一个输入框的内容
                let currentPrompt = '';
                let targetTextarea = null;
                
                // 尝试找到当前获得焦点的输入框
                for (const textarea of textareas) {
                    if (document.activeElement === textarea) {
                        currentPrompt = textarea.value.trim();
                        targetTextarea = textarea;
                        break;
                    }
                }
                
                // 如果没有找到焦点输入框，使用第一个输入框
                if (!targetTextarea) {
                    targetTextarea = textareas[0];
                    currentPrompt = targetTextarea.value.trim();
                }

                if (!currentPrompt) {
                    alert('请先在输入框中输入需要优化的提示词');
                    return;
                }

                // 显示加载状态
                loadingContainer.style.display = 'block';
                loadingContainer.innerHTML = '<div>正在优化提示词，请稍候...</div>';
                generateButton.disabled = true;
                generateButton.style.backgroundColor = '#ccc';
                optimizeButton.disabled = true;
                optimizeButton.style.backgroundColor = '#ccc';

                // 调用DeepSeek API优化提示词
                optimizePrompt(currentPrompt, loadingContainer)
                    .then(data => {
                        // 关闭模态框
                        document.body.removeChild(overlay);

                        // 用优化后的提示词替换原输入框内容
                        if (data.positive) {
                            targetTextarea.value = data.positive;
                            targetTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                            targetTextarea.dispatchEvent(new Event('change', { bubbles: true }));
                            console.log('提示词已优化并更新');
                        }
                    })
                    .catch(error => {
                        loadingContainer.innerHTML += `<div style="color: red;">优化失败: ${error.message}</div>`;
                        generateButton.disabled = false;
                        generateButton.style.backgroundColor = '#4CAF50';
                        optimizeButton.disabled = false;
                        optimizeButton.style.backgroundColor = '#2196F3';
                    });
            });
            
        } else if (isInTabsContent) {
            // 在el-tabs__content环境中添加两个按钮：开始生图和优化提示词
            const buttonGroup = document.createElement('div');
            buttonGroup.style.display = 'flex';
            buttonGroup.style.gap = '10px';
            buttonGroup.style.flex = '1';
            
            // 开始生图按钮
            const startGenerateButton = document.createElement('button');
            startGenerateButton.textContent = '开始生图';
            startGenerateButton.style.padding = '10px 16px';
            startGenerateButton.style.backgroundColor = '#2196F3';
            startGenerateButton.style.color = 'white';
            startGenerateButton.style.border = 'none';
            startGenerateButton.style.borderRadius = '4px';
            startGenerateButton.style.cursor = 'pointer';
            startGenerateButton.style.flex = '1';
            startGenerateButton.style.height = '58px';
            buttonGroup.appendChild(startGenerateButton);
            
            // 优化提示词按钮
            const optimizeButton = document.createElement('button');
            optimizeButton.textContent = '优化提示词';
            optimizeButton.style.padding = '10px 16px';
            optimizeButton.style.backgroundColor = '#9C27B0'; // 紫色，与其他按钮区分
            optimizeButton.style.color = 'white';
            optimizeButton.style.border = 'none';
            optimizeButton.style.borderRadius = '4px';
            optimizeButton.style.cursor = 'pointer';
            optimizeButton.style.flex = '1';
            optimizeButton.style.height = '58px';
            buttonGroup.appendChild(optimizeButton);
            
            // 将按钮组添加到容器
            buttonContainer.appendChild(buttonGroup);
            
            // 开始生图按钮点击事件
            startGenerateButton.addEventListener('click', () => {
                // 关闭对话框
                document.body.removeChild(overlay);
                // 调用精确查找并触发生成按钮的函数
                findAndTriggerGenerateButton();
            });
            
            // 优化提示词按钮点击事件
            optimizeButton.addEventListener('click', () => {
                // 获取用户输入的图像描述
                const userDescription = inputField.value.trim();
                if (!userDescription) {
                    alert('请先输入图像描述');
                    return;
                }
                
                // 显示加载状态
                loadingContainer.style.display = 'block';
                loadingContainer.innerHTML = '<div>正在根据描述优化提示词，请稍候...</div>';
                generateButton.disabled = true;
                generateButton.style.backgroundColor = '#ccc';
                startGenerateButton.disabled = true;
                startGenerateButton.style.backgroundColor = '#ccc';
                optimizeButton.disabled = true;
                optimizeButton.style.backgroundColor = '#ccc';
                
                // 构建优化请求
                const enhancedSystemPrompt = `你是一个专业的提示词生成助手。请根据用户给出的图像描述，生成高质量的Stable Diffusion提示词。请遵循以下规则：
1. 必须在提示词的首词中包含"chan"元素
2. 需要符合Stable Diffusion F.1模型的提示词特征
3. 提示词必须精炼，格式整齐，清晰分成正向提示词和负向提示词两部分
4. 根据用户输入的需求自动发散提示词，提示词只用于stable diffusion生图相关内容
5. 必须确保生成的是完整的全身形象，正向提示词中加入"full body, full shot"关键词
6. 在负向提示词中必须加入"cropped, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, bad feet, fewer toes, extra toes"防止生成局部和低质量图像
7. 分析用户的描述意图，灵活调整提示词以完美表达用户想要的视觉效果
8. 返回格式必须是JSON，包含positive和negative两个字段，分别对应正向和负向提示词
9. 不论用户输入是什么语言，都必须将提示词翻译成英文关键词
10. 优化时保持大部分原提示词不变，仅通过调整权重来优化，例如：
    - 使用(1.2)增加权重
    - 使用(0.8)降低权重
    - 保持原有提示词顺序，只调整权重

返回的JSON格式示例：
{
  "positive": "chan, detailed character(1.2), full body, full shot, [保持原有提示词，仅调整权重]",
  "negative": "cropped, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, bad feet, fewer toes, extra toes, [保持原有提示词，仅调整权重]"
}`;

                const enhancedUserPrompt = `请根据以下图像描述生成并优化Stable Diffusion提示词: "${userDescription}"。
                
我希望生成的提示词能够准确表达我的描述意图，并具有高质量的视觉效果。`;
                
                // 调用DeepSeek API
                callDeepSeekAPIWithPrompt(enhancedSystemPrompt, enhancedUserPrompt, loadingContainer)
                    .then(data => {
                        // 关闭模态框
                        document.body.removeChild(overlay);
                        
                        // 填充表单
                        fillPromptFields(data);
                        console.log('根据描述优化的提示词已更新到输入框');
                    })
                    .catch(error => {
                        loadingContainer.innerHTML += `<div style="color: red;">优化失败: ${error.message}</div>`;
                        generateButton.disabled = false;
                        generateButton.style.backgroundColor = '#4CAF50';
                        startGenerateButton.disabled = false;
                        startGenerateButton.style.backgroundColor = '#2196F3';
                        optimizeButton.disabled = false;
                        optimizeButton.style.backgroundColor = '#9C27B0';
                    });
            });
            
        } else {
            // 在其他环境中添加"开始生图"按钮
            const startGenerateButton = document.createElement('button');
            startGenerateButton.textContent = '开始生图';
            startGenerateButton.style.padding = '10px 16px';
            startGenerateButton.style.backgroundColor = '#2196F3';
            startGenerateButton.style.color = 'white';
            startGenerateButton.style.border = 'none';
            startGenerateButton.style.borderRadius = '4px';
            startGenerateButton.style.cursor = 'pointer';
            startGenerateButton.style.flex = '1';
            startGenerateButton.style.height = '58px';
            buttonContainer.appendChild(startGenerateButton);

            // 点击开始生图按钮
            startGenerateButton.addEventListener('click', () => {
                // 关闭对话框
                document.body.removeChild(overlay);
                // 调用精确查找并触发生成按钮的函数
                findAndTriggerGenerateButton();
            });
        }

        generateButton.addEventListener('click', () => {
            const input = inputField.value.trim();

            if (!input) {
                alert('请输入图像描述');
                return;
            }

            // 显示加载状态
            loadingContainer.style.display = 'block';
            loadingContainer.innerHTML = '<div>正在调用AI生成提示词，请稍候...</div>';
            generateButton.disabled = true;
            generateButton.style.backgroundColor = '#ccc';
            
            // 禁用第二个按钮（无论是优化还是开始生图）
            const secondButton = buttonContainer.children[1];
            if (secondButton) {
                secondButton.disabled = true;
                secondButton.style.backgroundColor = '#ccc';
            }

            // 调用DeepSeek API
            callDeepSeekAPI(input, loadingContainer)
                .then(data => {
                    // 关闭模态框
                    document.body.removeChild(overlay);

                    // 填充表单
                    fillPromptFields(data);
                })
                .catch(error => {
                    loadingContainer.innerHTML += `<div style="color: red;">发生错误: ${error.message}</div>`;
                    generateButton.disabled = false;
                    generateButton.style.backgroundColor = '#4CAF50';
                    
                    // 恢复第二个按钮
                    if (secondButton) {
                        secondButton.disabled = false;
                        secondButton.style.backgroundColor = '#2196F3';
                    }
                });
        });

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // 调用DeepSeek API
    function callDeepSeekAPI(input, loadingContainer) {
        return new Promise((resolve, reject) => {
            const userPrompt = `请根据以下描述生成适合Stable Diffusion F.1模型的提示词："${input}"。必须包含"chan"相关元素。`;

            loadingContainer.innerHTML += `<div>发送请求到DeepSeek API...</div>`;

            GM_xmlhttpRequest({
                method: "POST",
                url: DEEPSEEK_API_URL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                },
                data: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: SYSTEM_PROMPT
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ],
                    temperature: 0.7,
                    stream: true
                }),
                onloadstart: function() {
                    loadingContainer.innerHTML += `<div>开始接收数据...</div>`;
                },
                onprogress: function(response) {
                    // 处理流式响应
                    const newData = response.responseText;
                    try {
                        // 显示正在生成的内容（粗略处理，实际需要正确解析SSE格式）
                        const latestChunk = newData.split('data: ').pop().trim();
                        if (latestChunk && latestChunk !== '[DONE]') {
                            const parsedChunk = JSON.parse(latestChunk);
                            if (parsedChunk.choices && parsedChunk.choices[0].delta.content) {
                                loadingContainer.innerHTML += `<span>${parsedChunk.choices[0].delta.content}</span>`;
                                // 自动滚动到底部
                                loadingContainer.scrollTop = loadingContainer.scrollHeight;
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误，继续处理流
                    }
                },
                onload: function(response) {
                    try {
                        loadingContainer.innerHTML += `<div>数据接收完成，正在处理...</div>`;

                        // 处理最终的完整响应
                        const lines = response.responseText.split('\n');
                        let jsonData = null;

                        // 提取最后一个有效的数据块
                        for (let i = lines.length - 1; i >= 0; i--) {
                            const line = lines[i].trim();
                            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                const jsonStr = line.substring(6);
                                const parsed = JSON.parse(jsonStr);
                                if (parsed.choices && parsed.choices[0].delta.content) {
                                    // 尝试从内容中提取JSON
                                    const content = parsed.choices[0].delta.content;
                                    if (content.includes('{') && content.includes('}')) {
                                        const jsonMatch = content.match(/\{[\s\S]*\}/);
                                        if (jsonMatch) {
                                            jsonData = JSON.parse(jsonMatch[0]);
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        // 如果上面没提取到，尝试从整个响应中提取
                        if (!jsonData) {
                            const fullContent = lines
                                .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                .map(line => {
                                    try {
                                        return JSON.parse(line.substring(6)).choices[0].delta.content || '';
                                    } catch (e) {
                                        return '';
                                    }
                                })
                                .join('');

                            const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
                            if (jsonMatch) {
                                jsonData = JSON.parse(jsonMatch[0]);
                            }
                        }

                        if (jsonData) {
                            loadingContainer.innerHTML += `<div style="color: green;">成功提取数据！</div>`;
                            resolve(jsonData);
                        } else {
                            reject(new Error('无法从响应中提取有效的JSON数据'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(new Error('API请求失败'));
                }
            });
        });
    }

    // 调用DeepSeek API带自定义系统提示词
    function callDeepSeekAPIWithPrompt(systemPrompt, userPrompt, loadingContainer) {
        return new Promise((resolve, reject) => {
            loadingContainer.innerHTML += `<div>发送请求到DeepSeek API...</div>`;

            GM_xmlhttpRequest({
                method: "POST",
                url: DEEPSEEK_API_URL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                },
                data: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ],
                    temperature: 0.7,
                    stream: true
                }),
                onloadstart: function() {
                    loadingContainer.innerHTML += `<div>开始接收数据...</div>`;
                },
                onprogress: function(response) {
                    // 处理流式响应
                    const newData = response.responseText;
                    try {
                        // 显示正在生成的内容（粗略处理，实际需要正确解析SSE格式）
                        const latestChunk = newData.split('data: ').pop().trim();
                        if (latestChunk && latestChunk !== '[DONE]') {
                            const parsedChunk = JSON.parse(latestChunk);
                            if (parsedChunk.choices && parsedChunk.choices[0].delta.content) {
                                loadingContainer.innerHTML += `<span>${parsedChunk.choices[0].delta.content}</span>`;
                                // 自动滚动到底部
                                loadingContainer.scrollTop = loadingContainer.scrollHeight;
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误，继续处理流
                    }
                },
                onload: function(response) {
                    try {
                        loadingContainer.innerHTML += `<div>数据接收完成，正在处理...</div>`;

                        // 处理最终的完整响应
                        const lines = response.responseText.split('\n');
                        let jsonData = null;

                        // 提取最后一个有效的数据块
                        for (let i = lines.length - 1; i >= 0; i--) {
                            const line = lines[i].trim();
                            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                const jsonStr = line.substring(6);
                                const parsed = JSON.parse(jsonStr);
                                if (parsed.choices && parsed.choices[0].delta.content) {
                                    // 尝试从内容中提取JSON
                                    const content = parsed.choices[0].delta.content;
                                    if (content.includes('{') && content.includes('}')) {
                                        const jsonMatch = content.match(/\{[\s\S]*\}/);
                                        if (jsonMatch) {
                                            jsonData = JSON.parse(jsonMatch[0]);
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        // 如果上面没提取到，尝试从整个响应中提取
                        if (!jsonData) {
                            const fullContent = lines
                                .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                .map(line => {
                                    try {
                                        return JSON.parse(line.substring(6)).choices[0].delta.content || '';
                                    } catch (e) {
                                        return '';
                                    }
                                })
                                .join('');

                            const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
                            if (jsonMatch) {
                                jsonData = JSON.parse(jsonMatch[0]);
                            }
                        }

                        if (jsonData) {
                            loadingContainer.innerHTML += `<div style="color: green;">成功提取优化后的提示词！</div>`;
                            resolve(jsonData);
                        } else {
                            reject(new Error('无法从响应中提取有效的JSON数据'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(new Error('API请求失败'));
                }
            });
        });
    }

    // 优化提示词函数
    function optimizePrompt(currentPrompt, loadingContainer) {
        return new Promise((resolve, reject) => {
            const optimizeSystemPrompt = `你是一个专业的提示词优化助手，请帮助用户优化Stable Diffusion的提示词。请遵循以下规则：

1. 保持提示词的主题和关键元素
2. 使提示词更加精炼、有效，并符合Stable Diffusion F.1模型的提示词特征
3. 确保优化后的提示词包含"chan"元素（如果原提示词中没有）
4. 保持正向提示词中的"full body, full shot"关键词
5. 返回格式必须是JSON，包含positive字段
6. 不要添加解释，直接返回优化后的提示词
7. 无论输入是什么语言，所有提示词必须使用英文表达
8. 优化时保持大部分原提示词不变，仅通过调整权重来优化，例如：
   - 使用(1.2)增加权重
   - 使用(0.8)降低权重
   - 保持原有提示词顺序，只调整权重

返回的JSON格式示例：
{
  "positive": "chan, detailed character(1.2), full body, full shot, [保持原有提示词，仅调整权重]"
}`;

            const userPrompt = `请优化以下Stable Diffusion提示词，保持其主题和关键元素，但使其更加精炼有效：

${currentPrompt}`;

            loadingContainer.innerHTML += `<div>发送优化请求到DeepSeek API...</div>`;

            GM_xmlhttpRequest({
                method: "POST",
                url: DEEPSEEK_API_URL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                },
                data: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: optimizeSystemPrompt
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ],
                    temperature: 0.7,
                    stream: true
                }),
                onloadstart: function() {
                    loadingContainer.innerHTML += `<div>开始接收数据...</div>`;
                },
                onprogress: function(response) {
                    // 处理流式响应
                    const newData = response.responseText;
                    try {
                        // 显示正在生成的内容（粗略处理，实际需要正确解析SSE格式）
                        const latestChunk = newData.split('data: ').pop().trim();
                        if (latestChunk && latestChunk !== '[DONE]') {
                            const parsedChunk = JSON.parse(latestChunk);
                            if (parsedChunk.choices && parsedChunk.choices[0].delta.content) {
                                loadingContainer.innerHTML += `<span>${parsedChunk.choices[0].delta.content}</span>`;
                                // 自动滚动到底部
                                loadingContainer.scrollTop = loadingContainer.scrollHeight;
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误，继续处理流
                    }
                },
                onload: function(response) {
                    try {
                        loadingContainer.innerHTML += `<div>数据接收完成，正在处理...</div>`;

                        // 处理最终的完整响应
                        const lines = response.responseText.split('\n');
                        let jsonData = null;

                        // 提取最后一个有效的数据块
                        for (let i = lines.length - 1; i >= 0; i--) {
                            const line = lines[i].trim();
                            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                const jsonStr = line.substring(6);
                                const parsed = JSON.parse(jsonStr);
                                if (parsed.choices && parsed.choices[0].delta.content) {
                                    // 尝试从内容中提取JSON
                                    const content = parsed.choices[0].delta.content;
                                    if (content.includes('{') && content.includes('}')) {
                                        const jsonMatch = content.match(/\{[\s\S]*\}/);
                                        if (jsonMatch) {
                                            jsonData = JSON.parse(jsonMatch[0]);
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        // 如果上面没提取到，尝试从整个响应中提取
                        if (!jsonData) {
                            const fullContent = lines
                                .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                .map(line => {
                                    try {
                                        return JSON.parse(line.substring(6)).choices[0].delta.content || '';
                                    } catch (e) {
                                        return '';
                                    }
                                })
                                .join('');

                            const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
                            if (jsonMatch) {
                                jsonData = JSON.parse(jsonMatch[0]);
                            }
                        }

                        if (jsonData) {
                            loadingContainer.innerHTML += `<div style="color: green;">成功提取优化后的提示词！</div>`;
                            resolve(jsonData);
                        } else {
                            reject(new Error('无法从响应中提取有效的JSON数据'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(new Error('API请求失败'));
                }
            });
        });
    }

    // 创建页面主按钮
    function createMainButton() {
        // 延迟检查container的存在，因为页面可能需要时间加载
        function checkForContainer() {
            // 尝试查找多种可能的容器
            const container = document.querySelector('.physton-gradio-container') || 
                              document.querySelector('.el-tabs__content');
                              
            if (!container) {
                // 如果没找到容器，200ms后再次检查
                setTimeout(checkForContainer, 200);
                return;
            }
            
            // 如果容器是el-tabs__content，则跳过添加按钮
            if (container.className.includes('el-tabs__content')) {
                console.log('检测到el-tabs__content区域，根据要求跳过添加按钮');
                return;
            }
            
            console.log('找到可用容器:', container.className);
            
            // 创建按钮容器
            const button = document.createElement('div');
            button.style.position = 'absolute';
            button.style.top = '10px';
            button.style.right = '10px';
            button.style.padding = '8px 16px';
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '8px';
            button.style.cursor = 'pointer';
            button.style.zIndex = '1000';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.transition = 'background-color 0.3s ease';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            button.style.fontSize = '14px';
            
            // 文本内容 - 根据容器类型显示不同的按钮文本
            const text = document.createElement('span');
            
            // 根据容器类型确定按钮文本
            const isPhystonContainer = container.className.includes('physton-gradio-container');
            
            if (isPhystonContainer) {
                text.textContent = '提示词助手';
            } else {
                text.textContent = 'SD提示词生成';
            }
            
            button.appendChild(text);
            
            // 鼠标悬停效果
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#3e8e41';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#4CAF50';
            });

            button.addEventListener('click', (e) => {
                e.stopPropagation();
                createUserInputModal();
            });

            // 将按钮添加到容器中
            if (!container.style.position || container.style.position === 'static') {
                container.style.position = 'relative';
            }
            container.appendChild(button);
            
            console.log('提示词助手按钮已添加到容器', container.className);
        }
        
        // 开始检查容器
        checkForContainer();
    }

    // 根据返回的JSON数据填充提示词输入框
    function fillPromptFields(data) {
        try {
            // 检查数据是否存在
            if (!data) {
                console.error('No data provided');
                return;
            }

            console.log('填充提示词数据:', data);

            // 获取正向和负向提示词
            const positivePrompt = data.positive || '';
            const negativePrompt = data.negative || '';

            // 新的检测逻辑：在Stable Diffusion WebUI中，通常第一个大文本框是正向提示词，第二个是负向提示词
            const textareas = document.querySelectorAll('textarea');
            console.log(`找到 ${textareas.length} 个文本框`);
            
            if (textareas.length < 2) {
                console.error('没有找到足够的文本框');
                return;
            }
            
            // 1. 首先尝试在physton-prompt中查找
            let foundInPhystonPrompt = false;
            const phyPositive = document.querySelector('.physton-prompt-positive textarea');
            const phyNegative = document.querySelector('.physton-prompt-negative textarea');
            
            if (phyPositive && phyNegative) {
                console.log('通过physton-prompt类名直接找到提示词输入框');
                foundInPhystonPrompt = true;
                
                // 填充正向提示词
                phyPositive.value = '';
                phyPositive.dispatchEvent(new Event('input', { bubbles: true }));
                if (positivePrompt) {
                    phyPositive.value = positivePrompt;
                    phyPositive.dispatchEvent(new Event('input', { bubbles: true }));
                    phyPositive.dispatchEvent(new Event('change', { bubbles: true }));
                }
                
                // 填充负向提示词
                phyNegative.value = '';
                phyNegative.dispatchEvent(new Event('input', { bubbles: true }));
                if (negativePrompt) {
                    phyNegative.value = negativePrompt;
                    phyNegative.dispatchEvent(new Event('input', { bubbles: true }));
                    phyNegative.dispatchEvent(new Event('change', { bubbles: true }));
                }
                
                return;
            }
            
            // 2. 使用固定索引（liblib.art网站通常第一个是正向，第二个是负向）
            if (!foundInPhystonPrompt) {
                // 优先使用较大的文本框（高度>50px的）
                const largeTextareas = Array.from(textareas).filter(t => t.clientHeight > 50);
                
                if (largeTextareas.length >= 2) {
                    console.log('使用较大的文本框顺序填充（第一个=正向，第二个=负向）');
                    
                    // 填充正向提示词到第一个大文本框
                    largeTextareas[0].value = '';
                    largeTextareas[0].dispatchEvent(new Event('input', { bubbles: true }));
                    if (positivePrompt) {
                        largeTextareas[0].value = positivePrompt;
                        largeTextareas[0].dispatchEvent(new Event('input', { bubbles: true }));
                        largeTextareas[0].dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    
                    // 填充负向提示词到第二个大文本框 
                    largeTextareas[1].value = '';
                    largeTextareas[1].dispatchEvent(new Event('input', { bubbles: true }));
                    if (negativePrompt) {
                        largeTextareas[1].value = negativePrompt;
                        largeTextareas[1].dispatchEvent(new Event('input', { bubbles: true }));
                        largeTextareas[1].dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } else {
                    console.log('使用普通顺序填充（第一个=正向，第二个=负向）');
                    
                    // 直接使用索引0和1
                    // 填充正向提示词到第一个文本框
                    textareas[0].value = '';
                    textareas[0].dispatchEvent(new Event('input', { bubbles: true }));
                    if (positivePrompt) {
                        textareas[0].value = positivePrompt;
                        textareas[0].dispatchEvent(new Event('input', { bubbles: true }));
                        textareas[0].dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    
                    // 填充负向提示词到第二个文本框
                    textareas[1].value = '';
                    textareas[1].dispatchEvent(new Event('input', { bubbles: true }));
                    if (negativePrompt) {
                        textareas[1].value = negativePrompt;
                        textareas[1].dispatchEvent(new Event('input', { bubbles: true }));
                        textareas[1].dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            }

        } catch (error) {
            console.error('填充提示词时出错:', error);
        }
    }

    // 创建一个函数用于精确定位和触发生成按钮
    function findAndTriggerGenerateButton() {
        console.log('开始精确查找并触发生成按钮...');
        
        // 防止重复点击的标记 - 延长到10秒
        if (window.isGenerateButtonTriggering) {
            console.log('生成按钮触发中，请稍候...');
            return;
        }
        
        // 设置触发中标记，10秒后自动清除
        window.isGenerateButtonTriggering = true;
        setTimeout(() => {
            window.isGenerateButtonTriggering = false;
        }, 10000); // 延长到10秒以确保足够的操作时间
        
        // 目标按钮的精确特征
        const TARGET_SPECS = {
            id: 'btnGenerate',
            text: ['开始生图', '生成', 'Generate', '开始', '创建', 'Create', 'Start'],
            width: 300,  // 目标宽度
            height: 58,  // 目标高度
            widthTolerance: 50, // 宽度误差范围
            heightTolerance: 15, // 高度误差范围
            bgColor: '#1F74FF' // 目标背景色
        };
        
        // 辅助函数：等待元素加载
        function waitForElement(selector, maxAttempts = 20, interval = 300) {
            return new Promise((resolve) => {
                let attempts = 0;
                
                const checkElement = () => {
                    const element = document.querySelector(selector);
                    if (element) {
                        console.log(`找到元素: ${selector}`);
                        resolve(element);
                        return;
                    }
                    
                    attempts++;
                    if (attempts >= maxAttempts) {
                        console.log(`等待元素超时: ${selector}`);
                        resolve(null);
                        return;
                    }
                    
                    setTimeout(checkElement, interval);
                };
                
                checkElement();
            });
        }
        
        // 辅助函数：RGB颜色转十六进制
        function rgbToHex(rgbStr) {
            try {
                // 处理rgb或rgba格式
                const rgb = rgbStr.match(/\d+/g);
                if (!rgb || rgb.length < 3) return '';
                
                const r = parseInt(rgb[0]);
                const g = parseInt(rgb[1]);
                const b = parseInt(rgb[2]);
                
                return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            } catch (e) {
                return '';
            }
        }
        
        // 辅助函数：计算颜色相似度 (0-1，1为完全匹配)
        function colorSimilarity(color1, color2) {
            try {
                // 转换为十六进制格式
                const hex1 = color1.startsWith('#') ? color1.toLowerCase() : rgbToHex(color1).toLowerCase();
                const hex2 = color2.startsWith('#') ? color2.toLowerCase() : rgbToHex(color2).toLowerCase();
                
                if (!hex1 || !hex2) return 0;
                
                // 简单颜色匹配，检查是否包含关键颜色代码
                if (hex1.includes('1f74ff') || hex2.includes('1f74ff')) return 0.9;
                if (hex1.includes('74') && hex1.includes('ff')) return 0.7;
                
                // 简单匹配蓝色系
                const isBlue1 = hex1.includes('00f') || hex1.includes('00b') || hex1.includes('33f');
                const isBlue2 = hex2.includes('00f') || hex2.includes('00b') || hex2.includes('33f');
                
                if (isBlue1 && isBlue2) return 0.6;
                
                return 0;
            } catch (e) {
                return 0;
            }
        }
        
        // 辅助函数：检查按钮是否匹配目标特征
        function scoreButtonMatch(btn) {
            if (!btn || !isValidButton(btn)) return 0;
            
            let score = 0;
            
            // 1. ID匹配 (优先级最高)
            if (btn.id === TARGET_SPECS.id) {
                score += 10;
            }
            
            // 2. 文本内容匹配
            const btnText = btn.textContent.trim().toLowerCase();
            for (const text of TARGET_SPECS.text) {
                if (btnText.includes(text.toLowerCase())) {
                    score += 3;
                    break;
                }
            }
            
            // 3. 尺寸匹配
            const widthDiff = Math.abs(btn.offsetWidth - TARGET_SPECS.width);
            const heightDiff = Math.abs(btn.offsetHeight - TARGET_SPECS.height);
            
            if (widthDiff <= TARGET_SPECS.widthTolerance && heightDiff <= TARGET_SPECS.heightTolerance) {
                // 越接近目标尺寸，得分越高
                const sizeSimilarity = 1 - Math.max(widthDiff / TARGET_SPECS.width, heightDiff / TARGET_SPECS.height);
                score += sizeSimilarity * 3;
            }
            
            // 4. 颜色匹配
            const btnStyle = window.getComputedStyle(btn);
            const btnBgColor = btnStyle.backgroundColor;
            const colorMatch = colorSimilarity(btnBgColor, TARGET_SPECS.bgColor);
            
            score += colorMatch * 4;
            
            console.log(`按钮评分 [${btnText}]: ${score.toFixed(2)}, 尺寸: ${btn.offsetWidth}x${btn.offsetHeight}, 颜色: ${btnBgColor}`);
            
            return score;
        }
        
        // 检查按钮是否有效(可见且未禁用)
        function isValidButton(btn) {
            if (!btn) return false;
            
            const btnStyle = window.getComputedStyle(btn);
            const isVisible = btnStyle.display !== 'none' && 
                              btnStyle.visibility !== 'hidden' && 
                              btnStyle.opacity !== '0' &&
                              btn.offsetParent !== null;
            const isEnabled = !btn.disabled && 
                             !btn.classList.contains('disabled') && 
                             !btn.hasAttribute('disabled');
            
            return isVisible && isEnabled;
        }
        
        // 辅助函数：查找最符合条件的按钮
        async function findBestMatchButton() {
            // 最高优先级：通过class="start-raw pointer"查找开始生图按钮
            const startRawButtons = document.querySelectorAll('.start-raw.pointer, .start-raw');
            if (startRawButtons.length > 0) {
                for (const btn of startRawButtons) {
                    if (isValidButton(btn)) {
                        console.log('通过class="start-raw pointer"找到开始生图按钮');
                        return btn;
                    }
                }
            }
            
            // 次高优先级：查找包含"开始生图"文本的按钮
            const exactTextButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
                return btn.textContent.trim().includes('开始生图') && isValidButton(btn);
            });
            
            if (exactTextButtons.length > 0) {
                console.log('找到精确匹配"开始生图"文本的按钮');
                return exactTextButtons[0];
            }
            
            // 尝试直接通过ID查找
            await waitForElement(`#${TARGET_SPECS.id}`, 5);
            const btnById = document.getElementById(TARGET_SPECS.id);
            if (btnById && isValidButton(btnById)) {
                console.log(`通过ID直接找到目标按钮: #${TARGET_SPECS.id}`);
                return btnById;
            }
            
            // 特殊处理: 首先尝试在el-tabs__content区域内查找生成按钮
            const elTabsContent = document.querySelector('.el-tabs__content');
            if (elTabsContent) {
                console.log('优先在el-tabs__content区域查找按钮');
                
                // 0. 最优先查找"开始生图"按钮
                const exactMatchBtns = Array.from(elTabsContent.querySelectorAll('button')).filter(btn => {
                    return btn.textContent.trim().includes('开始生图') && isValidButton(btn);
                });
                
                if (exactMatchBtns.length > 0) {
                    console.log('在el-tabs__content中找到"开始生图"按钮');
                    return exactMatchBtns[0];
                }
                
                // 1. 尝试查找文本包含"生成"的按钮
                const generateBtns = Array.from(elTabsContent.querySelectorAll('button')).filter(btn => {
                    const btnText = btn.textContent.trim().toLowerCase();
                    return (btnText.includes('生成') || btnText.includes('开始') || btnText.includes('generate')) && isValidButton(btn);
                });
                
                if (generateBtns.length > 0) {
                    console.log(`在el-tabs__content中找到${generateBtns.length}个生成按钮，使用第一个`);
                    return generateBtns[0];
                }
                
                // 2. 尝试Element UI特有的按钮格式
                const elButtons = elTabsContent.querySelectorAll('.el-button--primary, .el-button--default');
                
                for (const btn of elButtons) {
                    if (isValidButton(btn)) {
                        const score = scoreButtonMatch(btn);
                        if (score >= 2) {
                            console.log(`在el-tabs__content中找到符合条件的Element UI按钮，评分: ${score.toFixed(2)}`);
                            return btn;
                        }
                    }
                }
                
                // 3. 查找蓝色背景的按钮
                const allElTabsButtons = elTabsContent.querySelectorAll('button');
                for (const btn of allElTabsButtons) {
                    if (isValidButton(btn)) {
                        const btnStyle = window.getComputedStyle(btn);
                        const btnBgColor = btnStyle.backgroundColor;
                        const colorMatch = colorSimilarity(btnBgColor, TARGET_SPECS.bgColor);
                        
                        if (colorMatch > 0.4) {
                            console.log(`在el-tabs__content中找到蓝色按钮，颜色匹配度: ${colorMatch.toFixed(2)}`);
                            return btn;
                        }
                    }
                }
                
                // 4. 尝试查找特定父容器中的按钮
                const actionContainers = elTabsContent.querySelectorAll('.actions, .control-panel, .button-row, .form-actions');
                for (const container of actionContainers) {
                    const btns = container.querySelectorAll('button');
                    if (btns.length > 0 && isValidButton(btns[0])) {
                        console.log('在el-tabs__content的操作容器中找到按钮');
                        return btns[0];
                    }
                }
            }
            
            // 查找所有可能的按钮并评分
            const allButtons = [
                ...document.querySelectorAll('button'),
                ...document.querySelectorAll('div[role="button"]'),
                ...document.querySelectorAll('.button'),
                ...document.querySelectorAll('.btn')
            ];
            
            // 优先查找包含"开始生图"文本的按钮
            for (const btn of allButtons) {
                if (btn.textContent.trim().includes('开始生图') && isValidButton(btn)) {
                    console.log('找到包含"开始生图"文本的按钮');
                    return btn;
                }
            }
            
            console.log(`找到 ${allButtons.length} 个按钮元素进行评分`);
            
            // 对所有按钮评分并返回最佳匹配
            let bestButton = null;
            let highestScore = 0;
            
            for (const btn of allButtons) {
                const score = scoreButtonMatch(btn);
                if (score > highestScore) {
                    highestScore = score;
                    bestButton = btn;
                }
            }
            
            if (bestButton && highestScore >= 3) {
                console.log(`找到最佳匹配按钮，评分: ${highestScore.toFixed(2)}`);
                return bestButton;
            }
            
            // 特殊场景处理: 在liblib.art网站上的特定容器中查找
            const specialContainers = [
                '.sdapi-container',
                '.txt2img-container',
                '.generation-container',
                '.el-tabs__content',
                '.el-tab-pane',
                '.tab-content'
            ];
            
            for (const containerSelector of specialContainers) {
                const container = document.querySelector(containerSelector);
                if (container) {
                    console.log(`在特殊容器 ${containerSelector} 中查找按钮`);
                    const containerButtons = container.querySelectorAll('button');
                    
                    for (const btn of containerButtons) {
                        const score = scoreButtonMatch(btn);
                        if (score > highestScore) {
                            highestScore = score;
                            bestButton = btn;
                        }
                    }
                }
            }
            
            // 如果还是没找到，尝试最简单的方法：查找蓝色背景按钮
            if (!bestButton) {
                console.log('尝试通过背景色查找按钮');
                const blueButtons = [];
                
                document.querySelectorAll('button').forEach(btn => {
                    if (isValidButton(btn)) {
                        const btnStyle = window.getComputedStyle(btn);
                        const btnBgColor = btnStyle.backgroundColor;
                        const colorMatch = colorSimilarity(btnBgColor, TARGET_SPECS.bgColor);
                        
                        if (colorMatch > 0.3) {
                            blueButtons.push({btn, match: colorMatch});
                        }
                    }
                });
                
                if (blueButtons.length > 0) {
                    // 按颜色匹配度排序
                    blueButtons.sort((a, b) => b.match - a.match);
                    console.log(`找到 ${blueButtons.length} 个蓝色按钮，使用匹配度最高的`);
                    bestButton = blueButtons[0].btn;
                }
            }
            
            return bestButton;
        }
        
        // 触发按钮点击流程
        async function executeButtonClick() {
            try {
                // 等待页面完全加载
                if (document.readyState !== 'complete') {
                    console.log('等待页面完成加载...');
                    await new Promise(resolve => {
                        window.addEventListener('load', resolve, { once: true });
                        // 如果页面已经加载完成，直接解决
                        if (document.readyState === 'complete') {
                            resolve();
                        }
                    });
                }
                
                console.log('页面已加载完成，开始查找按钮...');
                
                // 找到最佳匹配按钮
                const bestButton = await findBestMatchButton();
                
                if (!bestButton) {
                    throw new Error('未找到符合条件的生成按钮');
                }
                
                // 显示目标按钮信息
                console.log('准备点击按钮:', {
                    id: bestButton.id,
                    text: bestButton.textContent.trim(),
                    size: `${bestButton.offsetWidth}x${bestButton.offsetHeight}`,
                    bgColor: window.getComputedStyle(bestButton).backgroundColor
                });
                
                // 添加视觉反馈
                const originalStyles = {
                    outline: bestButton.style.outline,
                    boxShadow: bestButton.style.boxShadow,
                    transform: bestButton.style.transform
                };
                
                // 高亮显示按钮
                bestButton.style.outline = '3px solid yellow';
                bestButton.style.boxShadow = '0 0 10px rgba(255, 255, 0, 0.7)';
                bestButton.style.transform = 'scale(1.05)';
                
                // 添加触发延迟以便用户能看到反馈
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // 恢复原始样式并执行点击
                setTimeout(() => {
                    bestButton.style.outline = originalStyles.outline;
                    bestButton.style.boxShadow = originalStyles.boxShadow;
                    bestButton.style.transform = originalStyles.transform;
                }, 300);
                
                // 执行点击操作
                console.log('正在点击生成按钮...');
                bestButton.click();
                
                console.log('生成按钮点击完成');
                
                // 操作完成，清除标记
                setTimeout(() => {
                    window.isGenerateButtonTriggering = false;
                }, 1000);
                
                return true;
            } catch (error) {
                console.error('生成按钮触发失败:', error);
                alert(`生成按钮触发失败: ${error.message}，请手动点击生成按钮`);
                window.isGenerateButtonTriggering = false;
                return false;
            }
        }
        
        // 启动点击流程
        executeButtonClick();
    }

    // 初始化：创建主按钮
    createMainButton();
})(); 