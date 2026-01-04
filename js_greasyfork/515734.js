// ==UserScript==
// @name         AI网页内容总结(增强版)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  使用AI总结网页内容的油猴脚本，采用Shadow DOM隔离样式
// @author       Jinfeng
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAABMBJREFUeF7tnU2LHGUQx/81wTXBBGRmtqfHCF7Vi+hBjYecA7mbHBTUi3fxBQ+iURERxLugJwPJFzAfIERQQchFIUchTk9Pd1bQkGB2t2TAwdlhd55+3rq6e2qvXS/9/H9PdXdNzfYQ9E9UARLNrsmhAIQ3gQJQAMIKCKfXClAAwgoIp9cKUADCCgin1wpQAMIKCKfXCmg7gGlZnuFdvMaEp8B4mggD4TVZpWfGpfFo8JGVU0Bj5wpg5q28KD9hprcB9AKeU+2hJCE4A8im5Y8gPF+7WpESSkFwAjCZlh8T4YNIWoiFlYBgDWA2+/O5Pd77ue2XnaMo1w3BGkCWl98AeENsm9aQuE4I9gCm5Q0QXlrVgUBg8Fp52mRTFwR7AHnxF0Ana9iI4inqgOAAoFy7zdNkYB2zTqWzfP35r55LbAjWYpkW0DUAcyAxISiAiuUXC4ICqAggViUoAAsAMSAoAEsAoSEoAAcAISEEA7Bostr0FOTbGIa4MQcDsNhIVQAURXH6wT59DcYLcz8C3+jR8TeT5GTmuCEru5keoysH+s/QF0LtAGazu+Pd/Xs3iWj7wGKZ8x4dfyY2hNAAfC9HtQPI8vIqgJcP3WnMl9PR8BXbXWhjHwOADwQJADsAHj1CtNtpMnjcRlBb21gAXCEIACgmAKWHC8d/pMnwtK2oNvYxAczPo8o9cPl8BQCUVwBcOOIS9F06Gr5qI6it7cYDyPO/033c/wWg8Yp4t/nE1rPjU6dmtqLa2G88gLlYWcaPMN15F8QXwbTb6+Eq7/W/TFO6ayOmi21nAbSlEXOBtuxzGMDlhq7x9wBfAaT9TRWkACITUgCRBTaFVwAmhSIfVwCRBTaFVwAmhSIfVwCRBTaF7wQAyXmASWDT8cYCqNqISc8DTAKbjre+EZOeB5gENh1vbAUsTtzUCWZ5KToPMAlsOt5+ANMiA9Ho8IXyJE2Gj5lEkDzefgC57DzAF17rAUjPAzYegPQ8QAH4KiDs3/pLkLB+3ukbC6BqI+atgHCA1jdiwvp5p29sBVRtxLwVEA6gABRAu/9L0pefVoCvgp7+nQCg84D/d0Ht3w3t4jxguahMnwavFmDtAHQecBBBMABVG7EuzgNa9dXETOcBB0ogWAVUbcQynQfIAtB5QKR7QNUK0HlAAwB49kKi7p1oxEQV9EyuADwF9HVXAL4Kevo3FkDVRsxz/eLuOhETRtDYCrB5DBXW0Cu9AvCSz9+5AQDWvevBf4HtjsBZmgxX3wCwdknWnwVN8vIaAefaLVScs2fg+3EyOG8T3RpAlhefAfS+TZINsv00TQZWr/W3BrCzs/PE/X/2bxFha4OENS6Vme89/FDvyX6//7vReMnAGsDcd5LfeY/An9sk6rwt4a10e/CV7TqdAMyTZNPyBxDOLBL6voGw5XGuj5L+WVvx5/bOAOY/4jOdlZcAegfAMZfkHfDZA/iL0fbgQyJ64LIeZwCLZFlZvohdvN7Wn7GyFY0ZBQi/EuM3PsbfjofDn2xjLNt7A/BJrr4elyAVL4wCWgFhdHSOogCcpQvjqADC6OgcRQE4SxfGUQGE0dE5igJwli6MowIIo6NzFAXgLF0YRwUQRkfnKArAWbowjv8CcMJrjudowOkAAAAASUVORK5CYII=
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @connect      *
// @connect      pieces-os-azure.vercel.app
// @connect      api.ephone.ai
// @connect      snowy-forest-7d66.ttjmggm.workers.dev
// @connect      generativelanguage.googleapis.com
// @connect      free-api.jinfeng-li.us.kg
// @require      https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.min.js
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/515734/AI%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%80%BB%E7%BB%93%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515734/AI%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%80%BB%E7%BB%93%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

// Copyright 2024 Jinfeng

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        API_URL: 'https://api.openai.com/v1/chat/completions',
        API_KEY: 'sk-randomKey1234567890',
        MAX_TOKENS: 4000,
        SHORTCUT: 'Alt+S',
        PROMPT: '请用markdown格式全面总结以下网页内容，包含主要观点、关键信息和重要细节。总结需要完整、准确、有条理。',
        MODEL: 'gpt-4o-mini',
        CURRENT_CONFIG_NAME: '' // 用于存储当前使用的配置名称
    };

    // 获取配置
    let CONFIG = {};
    function loadConfig() {
        CONFIG = {
            API_URL: GM_getValue('API_URL', DEFAULT_CONFIG.API_URL),
            API_KEY: GM_getValue('API_KEY', DEFAULT_CONFIG.API_KEY),
            MAX_TOKENS: GM_getValue('MAX_TOKENS', DEFAULT_CONFIG.MAX_TOKENS),
            SHORTCUT: GM_getValue('SHORTCUT', DEFAULT_CONFIG.SHORTCUT),
            PROMPT: GM_getValue('PROMPT', DEFAULT_CONFIG.PROMPT),
            MODEL: GM_getValue('MODEL', DEFAULT_CONFIG.MODEL),
            CURRENT_CONFIG_NAME: GM_getValue('CURRENT_CONFIG_NAME', DEFAULT_CONFIG.CURRENT_CONFIG_NAME)
        };
        // 如果存在已保存的当前配置名称，则加载该配置
        if (CONFIG.CURRENT_CONFIG_NAME) {
            const savedConfig = loadSavedConfig(CONFIG.CURRENT_CONFIG_NAME);
            if (savedConfig) {
                CONFIG = { ...savedConfig, CURRENT_CONFIG_NAME: CONFIG.CURRENT_CONFIG_NAME };
            }
        }
        return CONFIG;
    }

    // 预定义的提示词模版
    const PROMPT_TEMPLATES = [
        {
            title: "通用网页总结",
            content: "请用markdown格式全面总结以下网页内容，包含主要观点、关键信息和重要细节。总结需要完整、准确、有条理。"
        },
        {
            title: "学术论文总结",
            content: "请用markdown格式总结这篇学术论文，包含以下要点：\n1. 研究目的和背景\n2. 研究方法\n3. 主要发现\n4. 结论和意义\n请确保总结准确、专业，并突出论文的创新点。"
        },
        {
            title: "新闻事件总结",
            content: "请用markdown格式总结这则新闻，包含以下要点：\n1. 事件梗概（时间、地点、人物）\n2. 事件经过\n3. 影响和意义\n4. 各方反应\n请确保总结客观、准确，并突出新闻的重要性。"
        },
        {
            title: "一句话概括",
            content: "请用一句简洁但信息量充足的话概括这段内容的核心要点。要求：不超过50个字，通俗易懂，突出重点。"
        },
        {
            title: "知乎专业解答",
            content: "请以知乎回答的风格总结这段内容。要求：\n1. 开头要吸引眼球\n2. 分点论述，层次分明\n3. 使用专业术语\n4. 适当举例佐证\n5. 语气要专业且自信\n6. 结尾点题升华\n注意：要用markdown格式，保持知乎体特有的严谨专业但不失亲和力的风格。"
        },
        {
            title: "表格化总结",
            content: "请将内容重点提取并整理成markdown表格格式。表格应当包含以下列：\n| 主题/概念 | 核心要点 | 补充说明 |\n要求条理清晰，重点突出，易于阅读。"
        },
        {
            title: "深度分析",
            content: "请对内容进行深度分析，包含：\n1. 表层信息提炼\n2. 深层原因分析\n3. 可能的影响和发展\n4. 个人见解和建议\n注意：分析要有洞察力，观点要有独特性，论述要有逻辑性。使用markdown格式。"
        },
        {
            title: "轻松幽默风",
            content: "请用轻松幽默的语气总结这段内容。要求：\n1. 口语化表达\n2. 适当使用梗和比喻\n3. 保持内容准确性\n4. 增加趣味性类比\n注意：幽默要得体，不失专业性。使用markdown格式。"
        },
        {
            title: "要点清单",
            content: "请将内容整理成简洁的要点清单，要求：\n1. 用markdown的项目符号格式\n2. 每点都简洁明了（不超过20字）\n3. 按重要性排序\n4. 分类呈现（如适用）\n5. 突出关键词或数字"
        },
        {
            title: "ELI5通俗解释",
            content: "请用简单易懂的语言解释这段内容，就像向一个五年级学生解释一样。要求：\n1. 使用简单的词汇\n2. 多用比喻和类比\n3. 避免专业术语\n4. 循序渐进地解释\n注意：解释要生动有趣，便于理解，但不能有失准确性。"
        },
        {
            title: "观点对比",
            content: "请以对比的形式总结文中的不同观点或方面：\n\n### 正面观点/优势\n- 观点1\n- 观点2\n\n### 负面观点/劣势\n- 观点1\n- 观点2\n\n### 中立分析\n综合以上观点的分析和建议\n\n注意：要客观公正，论据充分。"
        },
        {
            title: "Q&A模式",
            content: "请将内容重点转化为问答形式，要求：\n1. 问题要简洁清晰\n2. 答案要详细准确\n3. 由浅入深\n4. 覆盖核心知识点\n格式：\nQ1: [问题]\nA1: [答案]\n\n注意：问答要有逻辑性，便于理解和记忆。"
        },
        {
            title: "商务简报",
            content: "请以商务简报的形式总结内容：\n\n### 执行摘要\n[一段概述]\n\n### 关键发现\n- 发现1\n- 发现2\n\n### 数据支撑\n[列出关键数据]\n\n### 行动建议\n1. 建议1\n2. 建议2\n\n注意：简报风格要专业、简洁、重点突出。"
        },
        {
            title: "时间轴梳理",
            content: "请将内容按时间顺序整理成清晰的时间轴：\n\n### 时间轴\n- [时间点1]：事件/进展描述\n- [时间点2]：事件/进展描述\n\n### 关键节点分析\n[分析重要时间节点的意义]\n\n注意：要突出重要时间节点，并分析其意义。"
        },
        {
            title: "观点提炼",
            content: "请提炼这段内容中的核心观点，按逻辑顺序列出。每个观点需要简洁明了，突出其关键性。要求：\n- 使用简洁的语言\n- 突出观点的主旨\n- 按照论点的层次组织"
        },
        {
            title: "趋势预测",
            content: "请基于这段内容分析其背后的趋势，预测未来可能的发展方向。要求：\n- 提出一个清晰的趋势分析框架\n- 分析现有数据和信息如何推动这一趋势\n- 预测可能的行业影响和未来趋势\n- 提供具体的建议或行动步骤"
        },
        {
            title: "关键问题分析",
            content: "请对文中提出的关键问题进行详细分析，包含以下要点：\n1. 问题的背景与成因\n2. 当前解决方案及其效果\n3. 可能的解决方案和优缺点\n4. 解决这一问题的长期影响和潜在风险\n要求：分析要有深度，确保逻辑严密，提出建设性意见。"
        },
        {
            title: "对话式总结",
            content: "请将内容总结为对话式的形式，类似于对话问答。要求：\n- 通过模拟两个人的对话来呈现信息\n- 每个问题要简洁明了\n- 答案要准确、易懂，避免过于专业的术语\n- 对话可以适当加入互动与思考"
        },
        {
            title: "SWOT分析",
            content: "请对这段内容进行SWOT分析（优势、劣势、机会、威胁）。要求：\n- 优势：列出文中描述的优势\n- 劣势：列出可能的劣势或挑战\n- 机会：分析潜在的机会\n- 威胁：分析可能面临的威胁"
        },
        {
            title: "情景假设",
            content: "请基于这段内容，设定一个假设情景并进行分析。要求：\n- 提供假设情景的背景和设定\n- 根据现有内容推演可能的结果\n- 讨论可能面临的挑战与解决方案\n- 结合现实情况，给出合理的建议"
        },
        {
            title: "步骤指南",
            content: "请将这段内容总结成一个清晰的操作步骤指南。要求：\n- 每一步操作清晰简洁\n- 每一步的目标或目的要明确\n- 适当提供示例或注意事项\n- 步骤顺序按逻辑组织"
        }
    ];

    // 保存配置
    function saveConfig(newConfig, configName = '') {
        // 保存基本配置到 GM storage
        Object.keys(newConfig).forEach(key => {
            GM_setValue(key, newConfig[key]);
        });

        // 更新当前配置名称
        if (configName) {
            GM_setValue('CURRENT_CONFIG_NAME', configName);
            // 如果选择了已保存的配置，也将其保存到 saved_configs
            const savedConfigs = getAllConfigs();
            savedConfigs[configName] = { ...newConfig };
            GM_setValue('saved_configs', savedConfigs);
        }

        // 更新内存中的配置
        CONFIG = {
            ...CONFIG,
            ...newConfig,
            CURRENT_CONFIG_NAME: configName || CONFIG.CURRENT_CONFIG_NAME
        };
    }

    // 更新配置选择器
    function updateConfigSelectors(settingsPanel, modal) {
        const configs = getAllConfigs();
        const configNames = Object.keys(configs);
        const currentConfigName = CONFIG.CURRENT_CONFIG_NAME;
    
        // 更新所有配置选择器的函数
        const updateSelect = (select, includeCurrentConfig = false) => {
            if (!select) return;
            
            let options = [];
            
            // 添加默认选项
            if (includeCurrentConfig) {
                options.push(`<option value="" ${!currentConfigName ? 'selected' : ''}>当前配置${!currentConfigName ? '（未保存）' : ''}</option>`);
            } else {
                options.push(`<option value="">--选择配置--</option>`);
            }
            
            // 添加已保存的配置
            options = options.concat(configNames.map(name =>
                `<option value="${name}" ${name === currentConfigName ? 'selected' : ''}>${name}</option>`
            ));
            
            select.innerHTML = options.join('');
        };
    
        // 更新设置面板的选择器
        if (settingsPanel) {
            const settingsPanelSelect = settingsPanel.querySelector('#config-select');
            updateSelect(settingsPanelSelect, false);
            
            // 更新操作按钮的显示状态
            const configSelected = settingsPanelSelect.value !== "";
            
            // 显示/隐藏删除配置按钮
            const deleteConfigBtn = settingsPanel.querySelector('.delete-config-btn');
            if (deleteConfigBtn) {
                deleteConfigBtn.style.display = configSelected ? 'inline-block' : 'none';
            }
            
            // 显示/隐藏重命名配置按钮
            const renameConfigBtn = settingsPanel.querySelector('.rename-config-btn');
            if (renameConfigBtn) {
                renameConfigBtn.style.display = configSelected ? 'inline-block' : 'none';
            }
        }
    
        // 更新总结模态框的选择器
        if (modal) {
            const modalSelect = modal.querySelector('.ai-config-select');
            updateSelect(modalSelect, true);
        }
    }

    // 重命名配置的函数
    function renameConfig(oldName, newName) {
        if (oldName === newName) return false;
        
        const configs = getAllConfigs();
        if (!configs[oldName]) {
            alert('找不到要重命名的配置');
            return false;
        }
        
        // 保存配置到新名称
        configs[newName] = configs[oldName];
        // 删除旧配置
        delete configs[oldName];
        
        // 保存更新后的配置
        GM_setValue('saved_configs', configs);
        
        // 如果重命名的是当前使用的配置，更新当前配置名称
        if (CONFIG.CURRENT_CONFIG_NAME === oldName) {
            CONFIG.CURRENT_CONFIG_NAME = newName;
            GM_setValue('CURRENT_CONFIG_NAME', newName);
        }
        
        return true;
    }

    // 初始化重命名相关的事件监听
    function initializeRenameEvents(settingsPanel, modal) {
        const renameBtn = settingsPanel.querySelector('.rename-config-btn');
        if (!renameBtn) return;

        renameBtn.addEventListener('click', () => {
            const currentConfigName = settingsPanel.querySelector('#config-select').value;
            if (!currentConfigName) {
                alert('请先选择要重命名的配置');
                return;
            }

            // 显示重命名输入组
            let renameGroup = settingsPanel.querySelector('.rename-input-group');
            if (!renameGroup) {
                renameGroup = document.createElement('div');
                renameGroup.className = 'rename-input-group';
                renameGroup.innerHTML = `
                    <input type="text" id="config-rename" placeholder="输入新配置名称">
                    <button class="confirm-rename-btn">确认重命名</button>
                    <button class="cancel-rename-btn">取消</button>
                `;
                // 插入到按钮组之前
                settingsPanel.querySelector('.buttons').insertAdjacentElement('beforebegin', renameGroup);
            }
            renameGroup.style.display = 'flex';
            
            // 设置输入框的默认值为当前配置名
            const renameInput = renameGroup.querySelector('#config-rename');
            renameInput.value = currentConfigName;
            renameInput.focus();
            renameInput.select();
        });

        // 代理事件处理
        settingsPanel.addEventListener('click', (e) => {
            if (e.target.classList.contains('confirm-rename-btn')) {
                const oldName = settingsPanel.querySelector('#config-select').value;
                const newName = settingsPanel.querySelector('#config-rename').value.trim();
                
                if (!newName) {
                    alert('请输入新配置名称');
                    return;
                }
                
                if (renameConfig(oldName, newName)) {
                    // 更新选择器
                    updateConfigSelectors(settingsPanel, modal);
                    // 隐藏重命名输入组
                    settingsPanel.querySelector('.rename-input-group').style.display = 'none';
                    alert('重命名成功');
                }
            } else if (e.target.classList.contains('cancel-rename-btn')) {
                // 隐藏重命名输入组
                settingsPanel.querySelector('.rename-input-group').style.display = 'none';
            }
        });
    }

    // 修改设置面板的事件处理
    function initializeSettingsEvents(panel, modal, settingsOverlay) {
        const saveBtn = panel.querySelector('.save-btn');
        const configSelect = panel.querySelector('#config-select');
        const shortcutInput = panel.querySelector('#shortcut');

        // 更新快捷键输入框的占位符提示
        const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
        shortcutInput.placeholder = isMac ?
            '例如: Option+S, ⌘+Shift+Y' :
            '例如: Alt+S, Ctrl+Shift+Y';

        // 更新"应用设置"按钮文本
        saveBtn.textContent = '保存并应用';

        // 配置选择变更事件
        configSelect.addEventListener('change', (e) => {
            const selectedConfig = loadSavedConfig(e.target.value);
            if (selectedConfig) {
                // 更新设置面板中的输入值
                panel.querySelector('#api-url').value = selectedConfig.API_URL;
                panel.querySelector('#api-key').value = selectedConfig.API_KEY;
                panel.querySelector('#max-tokens').value = selectedConfig.MAX_TOKENS;
                // 根据系统显示适当的快捷键格式
                shortcutInput.value = getSystemShortcutDisplay(selectedConfig.SHORTCUT);
                panel.querySelector('#prompt').value = selectedConfig.PROMPT;
                panel.querySelector('#model').value = selectedConfig.MODEL;
            }
        });

        // 保存按钮点击事件
        saveBtn.addEventListener('click', () => {
            let newShortcut = panel.querySelector('#shortcut').value.trim();

            // 统一将 Option 转换为 Alt 存储
            newShortcut = newShortcut.replace(/Option\+/g, 'Alt+');

            if (!validateShortcut(newShortcut)) {
                alert(isMac ?
                    '快捷键格式不正确，请使用例如 Option+S, ⌘+Shift+Y 的格式。' :
                    '快捷键格式不正确，请使用例如 Alt+S, Ctrl+Shift+Y 的格式。'
                );
                return;
            }

            const selectedConfigName = configSelect.value;
            const newConfig = {
                API_URL: panel.querySelector('#api-url').value.trim(),
                API_KEY: panel.querySelector('#api-key').value.trim(),
                MAX_TOKENS: parseInt(panel.querySelector('#max-tokens').value) || DEFAULT_CONFIG.MAX_TOKENS,
                SHORTCUT: newShortcut || DEFAULT_CONFIG.SHORTCUT,
                PROMPT: panel.querySelector('#prompt').value.trim() || DEFAULT_CONFIG.PROMPT,
                MODEL: panel.querySelector('#model').value.trim() || DEFAULT_CONFIG.MODEL
            };

            // 保存配置并更新当前配置名称
            saveConfig(newConfig, selectedConfigName);

            // 更新两个面板中的配置选择器
            updateConfigSelectors(panel, modal);

            // 关闭设置面板
            panel.style.display = 'none';
            settingsOverlay.style.display = 'none';

            alert(`配置已保存并应用${selectedConfigName ? `（当前配置：${selectedConfigName}）` : ''}`);
        });
    }

    function getAllConfigs() {
        return GM_getValue('saved_configs', {});
    }

    function saveConfigAs(name, config) {
        const configs = getAllConfigs();
        configs[name] = config;
        GM_setValue('saved_configs', configs);
    }

    // 删除配置函数
    function deleteConfig(name, panel, modal) {
        const configs = getAllConfigs();
        delete configs[name];
        GM_setValue('saved_configs', configs);
    
        // 如果删除的是当前正在使用的配置，重置为默认配置
        if (name === CONFIG.CURRENT_CONFIG_NAME) {
            const defaultConfig = { ...DEFAULT_CONFIG, CURRENT_CONFIG_NAME: '' };
            Object.keys(defaultConfig).forEach(key => {
                GM_setValue(key, defaultConfig[key]);
            });
            CONFIG = defaultConfig;
    
            // 更新设置面板中的输入值为默认值
            if (panel) {
                panel.querySelector('#api-url').value = DEFAULT_CONFIG.API_URL;
                panel.querySelector('#api-key').value = DEFAULT_CONFIG.API_KEY;
                panel.querySelector('#max-tokens').value = DEFAULT_CONFIG.MAX_TOKENS;
                panel.querySelector('#shortcut').value = DEFAULT_CONFIG.SHORTCUT;
                panel.querySelector('#prompt').value = DEFAULT_CONFIG.PROMPT;
                panel.querySelector('#model').value = DEFAULT_CONFIG.MODEL;
            }
        }
    
        // 保存更新后的配置
        GM_setValue('saved_configs', configs);
    
        // 更新两个面板的配置选择器
        updateConfigSelectors(panel, modal);
    
        return Object.keys(configs).length;
    }

    // 删除配置按钮事件处理
    function initializeDeleteConfigButton(settingsPanel, modal) {
        const deleteBtn = settingsPanel.querySelector('.delete-config-btn');
        const configSelect = settingsPanel.querySelector('#config-select');
    
        // 删除配置按钮点击事件
        deleteBtn.addEventListener('click', () => {
            const configName = configSelect.value;
            if (!configName) {
                alert('请先选择要删除的配置');
                return;
            }
    
            if (confirm(`确定要删除配置"${configName}"吗？`)) {
                deleteConfig(configName, settingsPanel, modal);
    
                // 如果删除的是当前正在使用的配置，更新模态框中的配置显示
                if (configName === CONFIG.CURRENT_CONFIG_NAME) {
                    const modalSelect = modal.querySelector('.ai-config-select');
                    if (modalSelect) {
                        modalSelect.value = '';
                    }
    
                    // 如果有重试按钮，触发重新生成总结
                    const retryBtn = modal.querySelector('.ai-retry-btn');
                    if (retryBtn) {
                        retryBtn.click();
                    }
                }
    
                alert(`配置"${configName}"已删除${configName === CONFIG.CURRENT_CONFIG_NAME ? '，已恢复默认配置' : ''}`);
            }
        });
    }

    function loadSavedConfig(name) {
        const configs = getAllConfigs();
        return configs[name];
    }

    // 创建设置面板
    function createSettingsPanel(shadow) {
        const panel = document.createElement('div');
        panel.className = 'ai-settings-panel';
        panel.innerHTML = `
            <h3>设置</h3>
            <div class="form-group">
                <label for="api-url">API URL</label>
                <input type="text" id="api-url" value="${CONFIG.API_URL}">
            </div>
            <div class="form-group">
                <label for="api-key">API Key</label>
                <input type="text" id="api-key" value="${CONFIG.API_KEY}">
            </div>
            <div class="form-group">
                <label for="model">模型</label>
                <input type="text" id="model" value="${CONFIG.MODEL}">
            </div>
            <div class="form-group">
                <label for="max-tokens">最大Token数</label>
                <input type="number" id="max-tokens" value="${CONFIG.MAX_TOKENS}">
            </div>
            <div class="form-group">
                <label for="shortcut">快捷键 (例如: Alt+S, Ctrl+Shift+Y)</label>
                <input type="text" id="shortcut" value="${CONFIG.SHORTCUT}">
            </div>
            <div class="form-group">
                <label for="prompt">总结提示词</label>
                <textarea id="prompt">${CONFIG.PROMPT}</textarea>
            </div>
            <div class="form-group config-select-group">
                <label for="config-select">当前配置</label>
                <select class="ai-config-select" id="config-select">
                    <option value="">--选择配置--</option>
                    ${Object.keys(getAllConfigs()).map(name =>
                        `<option value="${name}">${name}</option>`
                    ).join('')}
                </select>
                <select class="ai-prompt-template-select" id="prompt-template-select">
                    <option value="">--提示词模版--</option>
                    ${PROMPT_TEMPLATES.map(template =>
                        `<option value="${template.title}">${template.title}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group save-as-group buttons" style="display: none;">
                <label for="config-name">配置名称</label>
                <div class="save-as-input-group">
                    <input type="text" id="config-name" placeholder="输入配置名称">
                    <button class="confirm-save-as-btn">保存配置</button>
                    <button class="cancel-save-as-btn">取消</button>
                </div>
            </div>
            <div class="form-group rename-group buttons" style="display: none;">
                <label for="rename-config">重命名配置</label>
                <div class="rename-input-group">
                    <input type="text" id="rename-config" placeholder="输入新配置名称">
                    <button class="confirm-rename-btn">确认重命名</button>
                    <button class="cancel-rename-btn">取消</button>
                </div>
            </div>
            <div class="buttons">
                <button class="clear-cache-btn">恢复默认设置</button>
                <button class="delete-config-btn">删除此配置</button>
                <button class="save-as-btn">另存为新配置</button>
                <button class="rename-config-btn">重命名配置</button>
                <button class="cancel-btn">关闭</button>
                <button class="save-btn">应用设置</button>
            </div>
        `;

        // 样式定义在Shadow DOM内部
        const style = document.createElement('style');
        style.textContent = `
            .ai-settings-panel {
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-sizing: border-box;
                font-family: Microsoft Yahei,PingFang SC,HanHei SC,Arial;
                font-size: 15px;
                z-index: 100001;
            }
            .ai-settings-panel h3 {
                margin: 0 0 20px 0;
                padding-bottom: 10px;
                border-bottom: 1px solid #dee2e6;
                color: #495057;
                font-size: 18px;
                font-weight: 900;
            }
            .form-group {
                margin-bottom: 15px;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
                color: #495057;
                font-weight: 600;
            }
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
                background: #fff;
                color: #495057;
            }
            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #60a5fa;
                box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
            }
            .form-group textarea {
                height: 100px;
                resize: vertical;
                font-family: Microsoft Yahei,PingFang SC,HanHei SC,Arial;
            }
            .form-group.config-select-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .form-group.config-select-group label {
                flex: 0 0 auto;
                margin-bottom: 0;
            }

            .form-group:not(.config-select-group) {
                display: block; /* 恢复其他form-group的默认布局 */
            }
            .buttons {
                display: flex;
                justify-content: space-around;
                gap: 10px;
                margin-top: 20px;
            }
            .buttons button {
                padding: 8px 8px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: background 0.3s;
                color: #fff;
            }
            .cancel-btn {
                background: #6c757d;
            }
            .cancel-btn:hover {
                background: #5a6268;
            }
            .clear-cache-btn {
                background: #b47474cc !important;
            }
            .clear-cache-btn:hover {
                background: #c82333 !important;
            }
            .ai-config-select {
                padding: 6px 12px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 14px;
                background: #fff;
                color: #495057;
                margin-right: 10px;
            }
            .save-as-group {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #dee2e6;
            }
            .delete-config-btn {
                background: #b47474cc !important;
            }
            .delete-config-btn:hover {
                background: #c82333 !important;
            }
            .save-as-input-group {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            .save-as-input-group input {
                flex: 1;
            }
            .save-as-input-group button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
            }
            .save-btn, .confirm-save-as-btn {
                background: #617043cc !important;
            }
            .save-btn:hover, .confirm-save-as-btn:hover {
                background: #218838 !important;
            }
            .cancel-save-as-btn {
                background: #6c757d;
            }
            .cancel-save-as-btn:hover {
                background: #5a6268;
            }
            .save-as-btn, .rename-config-btn {
                background: #647f96cc !important;
            }
            .save-as-btn:hover, .rename-config-btn:hover {
                background: #2980b9 !important;
            }
            .ai-prompt-template-select {
                padding: 6px 12px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 14px;
                background: #fff;
                color: #495057;
                margin-left: 10px;
                flex-grow: 1;
            }
            .form-group.config-select-group {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: nowrap;
            }
            .ai-config-select {
                flex-grow: 1;
            }
            .rename-input-group {
                display: none;
                gap: 10px;
                margin: 10px 0;
                padding: 10px 0;
                border-top: 1px solid #dee2e6;
            }

            .rename-input-group input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 14px;
            }

            .rename-input-group button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
            }

            .rename-input-group .confirm-rename-btn {
                background: #617043cc;
            }

            .rename-input-group .confirm-rename-btn:hover {
                background: #218838;
            }

            .rename-input-group .cancel-rename-btn {
                background: #6c757d;
            }

            .rename-input-group .cancel-rename-btn:hover {
                background: #5a6268;
            }
        `;

        // 创建新的覆盖层
        const settingsOverlay = document.createElement('div');
        settingsOverlay.className = 'ai-settings-overlay';
        settingsOverlay.style.display = 'none'; // 默认隐藏

        // 添加点击覆盖层关闭设置面板的事件
        settingsOverlay.addEventListener('click', () => {
            panel.style.display = 'none';
            settingsOverlay.style.display = 'none';
        });

        // 定义样式
        const overlayStyle = document.createElement('style');
        overlayStyle.textContent = `
            .ai-settings-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 100000; /* 确保覆盖层在设置面板下方 */
            }
        `;
        shadow.appendChild(overlayStyle);
        shadow.appendChild(settingsOverlay);
        shadow.appendChild(panel);

        // 事件监听
        panel.querySelector('.save-btn').addEventListener('click', () => {
            const newShortcut = panel.querySelector('#shortcut').value.trim();
            if (!validateShortcut(newShortcut)) {
                alert('快捷键格式不正确，请使用例如 Alt+S, Ctrl+Shift+Y 的格式。');
                return;
            }

            const newConfig = {
                API_URL: panel.querySelector('#api-url').value.trim(),
                API_KEY: panel.querySelector('#api-key').value.trim(),
                MAX_TOKENS: parseInt(panel.querySelector('#max-tokens').value) || DEFAULT_CONFIG.MAX_TOKENS,
                SHORTCUT: newShortcut || DEFAULT_CONFIG.SHORTCUT,
                PROMPT: panel.querySelector('#prompt').value.trim() || DEFAULT_CONFIG.PROMPT,
                MODEL: panel.querySelector('#model').value.trim() || DEFAULT_CONFIG.MODEL
            };
            saveConfig(newConfig);
            panel.style.display = 'none';
            settingsOverlay.style.display = 'none';
        });

        panel.querySelector('.cancel-btn').addEventListener('click', () => {
            panel.style.display = 'none';
            settingsOverlay.style.display = 'none';
        });

        // 清除缓存按钮事件
        panel.querySelector('.clear-cache-btn').addEventListener('click', () => {
            const keys = ['API_URL', 'API_KEY', 'MAX_TOKENS', 'SHORTCUT', 'PROMPT', 'MODEL'];
            keys.forEach(key => GM_setValue(key, undefined)); // 设置为undefined模拟删除

            // 重置为默认配置
            CONFIG = { ...DEFAULT_CONFIG };

            // 更新输入框的值
            panel.querySelector('#api-url').value = CONFIG.API_URL;
            panel.querySelector('#api-key').value = CONFIG.API_KEY;
            panel.querySelector('#max-tokens').value = CONFIG.MAX_TOKENS;
            panel.querySelector('#shortcut').value = CONFIG.SHORTCUT;
            panel.querySelector('#prompt').value = CONFIG.PROMPT;
            panel.querySelector('#model').value = CONFIG.MODEL;

            alert('缓存已清除，已恢复默认设置');
        });

        // 添加提示词模版选择的事件处理
        const promptTemplateSelect = panel.querySelector('#prompt-template-select');
        const promptTextarea = panel.querySelector('#prompt');

        promptTemplateSelect.addEventListener('change', (e) => {
            const selectedTemplate = PROMPT_TEMPLATES.find(t => t.title === e.target.value);
            if (selectedTemplate) {
                promptTextarea.value = selectedTemplate.content;
            }
        });

        shadow.appendChild(style);

        return { panel, overlay: settingsOverlay };
    }

    // 快捷键验证
    function validateShortcut(shortcut) {
        // 更新正则表达式以支持 Option 键
        const regex = /^((Ctrl|Alt|Shift|Meta|Option)\+)*[A-Za-z]$/;
        return regex.test(shortcut);
    }

    // 创建DOM元素并使用 Shadow DOM
    function createElements() {
        // 创建根容器
        const rootContainer = document.createElement('div');
        rootContainer.id = 'ai-summary-root';

        // 附加 Shadow DOM
        const shadow = rootContainer.attachShadow({ mode: 'open' });

        // 创建样式和结构
        const style = document.createElement('style');
        style.textContent = `
            .ai-summary-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                align-items: center;
                z-index: 99990;
                user-select: none;
                align-items: stretch;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                height: 30px;
                background-color: rgba(75, 85, 99, 0.8);
                border-radius: 5px;
            }
            .ai-drag-handle {
                width: 15px;
                height: 100%;
                background-color: rgba(75, 85, 99, 0.5);
                border-radius: 5px;
                cursor: move;
                margin-right: 1px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .ai-drag-handle::before {
                content: "⋮";
                color: #f3f4f6;
                font-size: 16px;
                transform: rotate(90deg);
            }
            .ai-summary-btn {
                padding: 5px 15px;
                background-color: rgba(75, 85, 99, 0.8);
                color: #f3f4f6;
                border: 1px solid rgba(75, 85, 99, 0.6);
                border-radius: 0 4px 4px 0;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s;
                height: 100%;
                line-height: 1;
                font-family: Microsoft Yahei,PingFang SC,HanHei SC,Arial;
            }
            .ai-summary-btn:hover {
                background-color: rgba(75, 85, 99, 0.9);
            }
            .ai-summary-btn:active {
                transform: scale(0.95);
                transition: transform 0.1s;
            }
            .ai-summary-modal {
                user-select: none;
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                max-width: 800px;
                max-height: 80vh;
                background: #f8f9fa;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                border-radius: 8px;
                z-index: 99995;
                overflow: hidden;
                font-family: Microsoft Yahei,PingFang SC,HanHei SC,Arial;
            }
            .ai-summary-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 99994;
            }
            .ai-summary-header {
                padding: 15px 20px;
                background: #e7ebee;
                border-bottom: 1px solid #dee2e6;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            .ai-summary-header h3 {
                color: #495057;
                margin: 0;
                padding: 0;
                font-size: 18px;
                font-weight: 900;
                line-height: 1.4;
                font-family: inherit;
            }
            .ai-summary-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #6c757d;
                padding: 0 5px;
                line-height: 1;
                font-family: inherit;
            }
            .ai-summary-close:hover {
                color: #495057;
            }
            .ai-summary-content {
                user-select: text;
                padding: 20px;
                overflow-y: auto;
                max-height: calc(80vh - 130px);
                line-height: 1.6;
                color: #374151;
                font-size: 15px;
                font-family: inherit;
                -webkit-overflow-scrolling: touch; /* 改善移动端滚动体验 */
            }
            .ai-summary-content h1 {
                font-size: 1.8em;
                margin: 1.5em 0 0.8em;
                padding-bottom: 0.3em;
                border-bottom: 2px solid #e5e7eb;
                font-weight: 600;
                line-height: 1.3;
                color: #1f2937;
            }
            .ai-summary-content h2 {
                font-size: 1.5em;
                margin: 1.3em 0 0.7em;
                padding-bottom: 0.2em;
                border-bottom: 1px solid #e5e7eb;
                font-weight: 600;
                line-height: 1.3;
                color: #1f2937;
            }
            .ai-summary-content h3 {
                font-size: 1.3em;
                margin: 1.2em 0 0.6em;
                font-weight: 600;
                line-height: 1.3;
                color: #1f2937;
            }
            .ai-summary-content p {
                margin: 1em 0;
                line-height: 1.8;
                color: inherit;
            }
            .ai-summary-content ul,
            .ai-summary-content ol {
                margin: 1em 0;
                padding-left: 2em;
                line-height: 1.6;
            }
            .ai-summary-content li {
                margin: 0.5em 0;
                line-height: inherit;
                color: inherit;
            }
            .ai-summary-content blockquote {
                margin: 1em 0;
                padding: 0.5em 1em;
                border-left: 4px solid #60a5fa;
                background: #f3f4f6;
                color: #4b5563;
                font-style: normal;
            }
            .ai-summary-content code {
                background: #f3f4f6;
                padding: 0.2em 0.4em;
                border-radius: 3px;
                font-family: Consolas, Monaco, "Courier New", monospace;
                font-size: 0.9em;
                color: #d946ef;
                white-space: pre-wrap;
            }
            .ai-summary-content pre {
                background: #1f2937;
                color: #e5e7eb;
                padding: 1em;
                border-radius: 6px;
                overflow-x: auto;
                margin: 1em 0;
                white-space: pre;
                word-wrap: normal;
            }
            .ai-summary-content pre code {
                background: none;
                color: inherit;
                padding: 0;
                border-radius: 0;
                font-size: inherit;
                white-space: pre;
            }
            .ai-summary-content table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
                font-size: inherit;
            }
            .ai-summary-content th,
            .ai-summary-content td {
                border: 1px solid #d1d5db;
                padding: 0.5em;
                text-align: left;
                color: inherit;
                background: none;
            }
            .ai-summary-content th {
                background: #f9fafb;
                font-weight: 600;
            }
            .ai-summary-footer {
                padding: 15px 20px;
                border-top: 1px solid #dee2e6;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                align-items: center;
                position: sticky;
                bottom: 0;
                background: #f0f2f4;
                z-index: 1;
            }
            .ai-summary-footer button {
                padding: 8px 16px;
                background: #6c757d;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: background 0.3s;
                font-size: 14px;
                line-height: 1;
                font-family: inherit;
            }
            .ai-summary-footer button:hover {
                background: #5a6268;
            }
            .ai-download-btn svg,
            .ai-retry-btn svg,
            .ai-copy-btn svg,
            .ai-settings-btn svg {
                width: 20px;
                height: 20px;
            }
            .ai-loading {
                text-align: center;
                padding: 20px;
                color: #6c757d;
                font-family: inherit;
            }
            .ai-loading-dots:after {
                content: '.';
                animation: dots 1.5s steps(5, end) infinite;
            }
            @keyframes dots {
                0%, 20% { content: '.'; }
                40% { content: '..'; }
                60% { content: '...'; }
                80%, 100% { content: ''; }
            }
            .ai-download-btn,
            .ai-summary-btn,
            .ai-retry-btn,
            .ai-copy-btn,
            .ai-settings-btn {
                z-index: 99991;
                position: relative;
            }
            /* 优化移动端响应式布局 */
            @media (max-width: 768px) {
                .ai-settings-panel,
                .ai-summary-modal {
                    width: 95%;
                    max-height: 90vh;
                }
                .ai-summary-footer {
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .ai-summary-container {
                    bottom: 10px;
                    right: 10px;
                }
            }
            .ai-summary-modal,
            .ai-summary-overlay,
            .ai-settings-panel {
                transition: opacity 0.2s ease-in-out;
            }
            .buttons button:active {
                transform: translateY(1px);
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            .ai-summary-header,
            .ai-summary-footer,
            .ai-summary-close,
            ai-download-btn,
            .ai-settings-btn,
            .ai-retry-btn,
            .ai-copy-btn {
                user-select: none;
            }
        `;

        // 创建按钮和拖动把手
        const container = document.createElement('div');
        container.className = 'ai-summary-container';
        container.innerHTML = `
            <div class="ai-drag-handle"></div>
            <button class="ai-summary-btn">总结网页</button>
        `;

        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'ai-summary-modal';
        modal.innerHTML = `
            <div class="ai-summary-header">
                <h3>网页内容总结</h3>
                <button class="ai-summary-close">×</button>
            </div>
            <div class="ai-summary-content"></div>
            <div class="ai-summary-footer">
                <select class="ai-config-select">
                    <option value="">当前配置</option>
                    ${Object.keys(getAllConfigs()).map(name =>
                        `<option value="${name}">${name}</option>`
                    ).join('')}
                </select>
                <button class="ai-settings-btn" title="打开设置">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
                <button class="ai-retry-btn" title="重新总结">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-2.3-6M21 3v6h-6"></path>
                    </svg>
                </button>
                <button class="ai-download-btn" title="下载总结">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>下载总结</span>
                </button>
                <button class="ai-copy-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>复制总结</span>
                </button>
            </div>
        `;

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'ai-summary-overlay';

        // 创建设置面板
        const { panel: settingsPanel, overlay: settingsOverlay } = createSettingsPanel(shadow);

        // 将所有元素添加到Shadow DOM
        shadow.appendChild(style);
        shadow.appendChild(container);
        shadow.appendChild(modal);
        shadow.appendChild(overlay);
        shadow.appendChild(settingsPanel);

        // 将根容器添加到body
        document.body.appendChild(rootContainer);

        return {
            container,
            button: container.querySelector('.ai-summary-btn'),
            modal,
            overlay,
            dragHandle: container.querySelector('.ai-drag-handle'),
            settingsPanel,
            settingsOverlay, // 返回新的覆盖层引用
            shadow,
            downloadBtn: modal.querySelector('.ai-download-btn')
        };
    }

    // 获取网页内容
    function getPageContent() {
        const title = document.title;
        const content = document.body.innerText;
        return { title, content };
    }

    // 显示错误信息
    function showError(container, error, details = '') {
        container.innerHTML = `
            <div class="ai-summary-error" style="color: red;">
                <strong>错误：</strong> ${error}
            </div>
            ${details ? `<div class="ai-summary-debug">${details}</div>` : ''}
        `;
    }

    // 创建全局的markdown渲染器实例
    const markdownRenderer = window.markdownit({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true
    });

    // 全局变量，用于存储原始的 Markdown 文本
    let originalMarkdownText = '';

    // 打字机效果函数
    function typeWriter(element, text, renderMarkdown, speed = 30, step = 5) {
        let index = 0;
        element.innerHTML = ''; // 清空内容

        function type() {
            if (index < text.length) {
                const currentIndex = Math.min(index + step, text.length);
                const currentText = text.substring(0, currentIndex);
                // 使用 markdownRenderer 渲染当前文本
                element.innerHTML = renderMarkdown(currentText);
                index = currentIndex;
                // 使用 requestAnimationFrame 代替 setTimeout
                requestAnimationFrame(type);
            } else {
                // 确保完全渲染
                element.innerHTML = renderMarkdown(text);
            }
        }

        type();
    }

    // 调用API进行总结
    async function summarizeContent(content, shadow) {
        const contentContainer = shadow.querySelector('.ai-summary-content');
        contentContainer.innerHTML = '<div class="ai-loading">正在生成总结<span class="ai-loading-dots"></span></div>';

        let summary = '';

        // 添加超时检查
        const timeoutId = setTimeout(() => {
            contentContainer.innerHTML = `
                <p>错误: 请求超时，请检查API URL、API Key和网络连接</p>
            `;
            // 由于无法直接 reject，这里只更新 DOM
        }, 20000);

        try {
            const requestPromise = new Promise((resolve, reject) => {
                console.log("Sending request to:", CONFIG.API_URL); // Log the URL
                console.log("Request headers:", {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}` // Log the authorization header (carefully, don't expose your key publicly!)
                });
                console.log("Request body:", {
                    model: CONFIG.MODEL,
                    messages: [
                        { role: 'system', content: CONFIG.PROMPT },
                        { role: 'user', content: content }
                    ],
                    max_tokens: CONFIG.MAX_TOKENS,
                    temperature: 0.7,
                    stream: false
                });

                GM.xmlHttpRequest({
                    method: 'POST',
                    url: CONFIG.API_URL,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CONFIG.API_KEY}`
                    },
                    data: JSON.stringify({
                        model: CONFIG.MODEL,
                        messages: [
                            { role: 'system', content: CONFIG.PROMPT },
                            { role: 'user', content: content }
                        ],
                        max_tokens: CONFIG.MAX_TOKENS,
                        temperature: 0.7,
                        stream: false // 使用非流式请求
                    }),
                    onload: function(response) {
                        console.log("Response status:", response.status); // Log the response status
                        console.log("Response headers:", response.responseHeaders); // Log response headers
                        console.log("Response text:", response.responseText); // Log the response body

                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const result = JSON.parse(response.responseText);
                                summary = result.choices[0].message.content;

                                // 存储完整的总结文本到全局变量
                                originalMarkdownText = summary;

                                // 使用打字机效果逐步显示总结
                                typeWriter(contentContainer, summary, markdownRenderer.render.bind(markdownRenderer), 30, 5);

                                clearTimeout(timeoutId); // 清除超时
                                resolve(summary);
                            } catch (e) {
                                clearTimeout(timeoutId); // 清除超时
                                reject(new Error(`解析响应失败: ${e.message}`));
                            }
                        } else {
                            clearTimeout(timeoutId); // 清除超时
                            reject(new Error(`API请求失败 (${response.status}): 请检查API URL和Key是否正确`));
                        }
                    },
                    onerror: function(error) {
                        console.error('请求错误:', error);
                        clearTimeout(timeoutId); // 清除超时
                        reject(new Error('网络请求错误'));
                    },
                    ontimeout: function() {
                        clearTimeout(timeoutId); // 清除超时
                        reject(new Error('请求超时'));
                    }
                });
            });

            // 等待请求完成或超时
            summary = await requestPromise;

            return summary;
        } catch (error) {
            clearTimeout(timeoutId); // 清除超时
            console.error('总结生成错误:', error);
            contentContainer.innerHTML = `
                <p>错误: ${error.message}</p>
            `;
            throw error;
        }
    }

    // 初始化事件监听
    function initializeEvents(elements) {
        const { container, button, modal, overlay, dragHandle, settingsPanel, settingsOverlay, shadow } = elements;

        // 初始化删除配置按钮
        initializeDeleteConfigButton(settingsPanel, modal);

        // 初始化拖动功能
        initializeDrag(container, dragHandle, shadow);

        // 点击按钮显示模态框
        button.addEventListener('click', async () => {
            if (!CONFIG.API_KEY) {
                alert('请先配置API Key。');
                settingsPanel.style.display = 'block';
                settingsOverlay.style.display = 'block';
                shadow.querySelector('.ai-summary-overlay').style.display = 'block';
                return;
            }

            showModal(modal, overlay);
            const contentContainer = modal.querySelector('.ai-summary-content');

            try {
                if (!CONFIG.API_URL) {
                    throw new Error('请先配置API URL');
                }

                const { content } = getPageContent();
                if (!content.trim()) {
                    throw new Error('网页内容为空，无法生成总结。');
                }

                const summary = await summarizeContent(content, shadow);
                if (summary) {
                    // contentContainer.innerHTML = markdownRenderer.render(summary);
                }
            } catch (error) {
                console.error('Summary Error:', error);
                showError(contentContainer, error.message);
            }
        });

        // 关闭模态框
        modal.querySelector('.ai-summary-close').addEventListener('click', () => {
            hideModal(modal, overlay);
        });

        // 点击总结页面外的覆盖层关闭模态框
        overlay.addEventListener('click', () => {
            hideModal(modal, overlay);
        });

        // 下载按钮功能
        elements.downloadBtn.addEventListener('click', () => {
            // 检查 originalMarkdownText 是否有内容
            if (!originalMarkdownText) {
                alert('总结内容尚未生成或已失效。');
                return;
            }

            // 提取第一行并去除markdown语法
            let firstLine = originalMarkdownText.split('\n')[0].trim();
            firstLine = firstLine.replace(/^#+\s*/, ''); // 移除开头的'#'和空格

            if (!firstLine) {
                alert('总结内容格式错误，无法生成文件名。');
                return;
            }

            // 生成安全的文件名
            let safeFirstLine = firstLine.length > 30 ? firstLine.substring(0, 30) : firstLine;
            // 移除文件名中的非法字符
            safeFirstLine = safeFirstLine.replace(/[<>:"/\\|?*]/g, '');
            // 替换空格为下划线
            const encodedFirstLine = encodeURIComponent(safeFirstLine).replace(/%20/g, '_');
            const fileName = `网页总结-${encodedFirstLine}.md`;

            // 创建 Blob 并触发下载
            const blob = new Blob([originalMarkdownText], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        });

        // 复制按钮功能
        modal.querySelector('.ai-copy-btn').addEventListener('click', () => {
            // 检查 originalMarkdownText 是否有内容
            if (!originalMarkdownText) {
                alert('总结内容尚未生成或已失效。');
                return;
            }

            // 使用保存的原始markdown文本
            navigator.clipboard.writeText(originalMarkdownText).then(() => {
                const copyBtn = modal.querySelector('.ai-copy-btn');
                const textSpan = copyBtn.querySelector('span');
                const originalText = textSpan.textContent;
                textSpan.textContent = '已复制！';
                textSpan.style.opacity = '0.7';
                setTimeout(() => {
                    textSpan.textContent = originalText;
                    textSpan.style.opacity = '1';
                }, 2000);
            }).catch(() => {
                alert('复制失败，请手动复制内容。');
            });
        });

        // 添加快捷键支持
        document.addEventListener('keydown', (e) => {
            if (isShortcutPressed(e, CONFIG.SHORTCUT)) {
                e.preventDefault();
                button.click();
            }
            if (e.key === 'Escape') {
                // 优先关闭设置面板
                if (settingsPanel.style.display === 'block') {
                    settingsPanel.style.display = 'none';
                    settingsOverlay.style.display = 'none';
                }
                // 然后关闭总结模态框
                if (modal.style.display === 'block') {
                    hideModal(modal, overlay);
                }
            }
        });

        // 添加重试按钮事件处理
        modal.querySelector('.ai-retry-btn').addEventListener('click', async () => {
            const contentContainer = modal.querySelector('.ai-summary-content');
            contentContainer.innerHTML = '<div class="ai-loading">正在重新生成总结<span class="ai-loading-dots"></span></div>';
            try {
                const { content } = getPageContent();
                if (!content.trim()) {
                    throw new Error('网页内容为空，无法生成总结。');
                }
                const summary = await summarizeContent(content, shadow);
                if (summary) {
                    contentContainer.innerHTML = markdownRenderer.render(summary);
                }
            } catch (error) {
                console.error('Retry Error:', error);
                showError(contentContainer, error.message);
            }
        });

        // 设置按钮功能（现在在模态框底部）
        modal.querySelector('.ai-settings-btn').addEventListener('click', () => {
            // 更新设置面板中的值
            settingsPanel.querySelector('#api-url').value = CONFIG.API_URL;
            settingsPanel.querySelector('#api-key').value = CONFIG.API_KEY;
            settingsPanel.querySelector('#max-tokens').value = CONFIG.MAX_TOKENS;
            settingsPanel.querySelector('#shortcut').value = CONFIG.SHORTCUT;
            settingsPanel.querySelector('#prompt').value = CONFIG.PROMPT;
            settingsPanel.querySelector('#model').value = CONFIG.MODEL;

            settingsPanel.style.display = 'block';
            settingsOverlay.style.display = 'block';
        });

        // 关闭设置面板时，隐藏其覆盖层
        settingsPanel.querySelector('.cancel-btn').addEventListener('click', () => {
            settingsPanel.style.display = 'none';
            settingsOverlay.style.display = 'none';
        });
        settingsPanel.querySelector('#config-select').addEventListener('change', (e) => {
            const selectedConfig = loadSavedConfig(e.target.value);
            const configSelected = e.target.value !== "";
            
            // 更新表单值
            if (selectedConfig) {
                settingsPanel.querySelector('#api-url').value = selectedConfig.API_URL;
                settingsPanel.querySelector('#api-key').value = selectedConfig.API_KEY;
                settingsPanel.querySelector('#max-tokens').value = selectedConfig.MAX_TOKENS;
                settingsPanel.querySelector('#shortcut').value = selectedConfig.SHORTCUT;
                settingsPanel.querySelector('#prompt').value = selectedConfig.PROMPT;
                settingsPanel.querySelector('#model').value = selectedConfig.MODEL;
            }
        
            // 更新按钮显示状态
            settingsPanel.querySelector('.delete-config-btn').style.display = configSelected ? 'inline-block' : 'none';
            settingsPanel.querySelector('.rename-config-btn').style.display = configSelected ? 'inline-block' : 'none';
        });

        // 另存为配置按钮事件
        settingsPanel.querySelector('.save-as-btn').addEventListener('click', () => {
            const saveAsGroup = settingsPanel.querySelector('.save-as-group');
            saveAsGroup.style.display = 'block';
        });

        // 保存新配置事件
        settingsPanel.querySelector('#config-name').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const configName = e.target.value.trim();
                if (configName) {
                    const newConfig = {
                        API_URL: settingsPanel.querySelector('#api-url').value.trim(),
                        API_KEY: settingsPanel.querySelector('#api-key').value.trim(),
                        MAX_TOKENS: parseInt(settingsPanel.querySelector('#max-tokens').value),
                        SHORTCUT: settingsPanel.querySelector('#shortcut').value.trim(),
                        PROMPT: settingsPanel.querySelector('#prompt').value.trim(),
                        MODEL: settingsPanel.querySelector('#model').value.trim()
                    };
                    saveConfigAs(configName, newConfig);
                    updateConfigSelectors();
                    settingsPanel.querySelector('.save-as-group').style.display = 'none';
                    e.target.value = '';
                    alert('配置已保存');
                }
            }
        });

        // 删除配置按钮事件
        settingsPanel.querySelector('.delete-config-btn').addEventListener('click', () => {
            const configSelect = settingsPanel.querySelector('#config-select');
            const configName = configSelect.value;
            if (configName && confirm(`确定要删除配置"${configName}"吗？`)) {
                deleteConfig(configName);
                // 如果删除的是当前正在使用的配置，则清除当前配置名称
                if (configName === CONFIG.CURRENT_CONFIG_NAME) {
                    CONFIG.CURRENT_CONFIG_NAME = '';
                    GM_setValue('CURRENT_CONFIG_NAME', '');
                }
                updateConfigSelectors();
                settingsPanel.querySelector('.delete-config-btn').style.display = 'none';
            }
        });

        // 总结面板中的配置选择事件
        modal.querySelector('.ai-config-select').addEventListener('change', async (e) => {
            const configName = e.target.value;
            if (configName) {
                // 选择了已保存的配置
                const selectedConfig = loadSavedConfig(configName);
                if (selectedConfig) {
                    CONFIG = { ...selectedConfig, CURRENT_CONFIG_NAME: configName };
                    saveConfig(CONFIG);
                    GM_setValue('CURRENT_CONFIG_NAME', configName);

                    // 使用新配置重新生成总结
                    modal.querySelector('.ai-retry-btn').click();
                }
            } else {
                // 如果选择了"当前配置"，则恢复到未保存的当前配置状态
                CONFIG.CURRENT_CONFIG_NAME = '';
                GM_setValue('CURRENT_CONFIG_NAME', '');
                // 注意：这里不需要重置其他配置项，保持当前的设置不变
            }
        });

        // 总结模态框中的配置选择事件
        modal.querySelector('.ai-config-select').addEventListener('change', async (e) => {
            const configName = e.target.value;
            if (configName) {
                const selectedConfig = loadSavedConfig(configName);
                if (selectedConfig) {
                    saveConfig(selectedConfig, configName);
                    // 重新生成总结
                    modal.querySelector('.ai-retry-btn').click();
                }
            } else {
                // 选择了"当前配置"选项
                saveConfig(CONFIG, '');
            }

            // 同步更新设置面板的选择器
            updateConfigSelectors(settingsPanel, modal);
        });

        // 初始化设置面板的事件
        initializeSettingsEvents(settingsPanel, modal, settingsOverlay);

        // 初始化时更新一次选择器
        updateConfigSelectors(settingsPanel, modal);

        // 另存为配置按钮事件
        settingsPanel.querySelector('.save-as-btn').addEventListener('click', () => {
            const saveAsGroup = settingsPanel.querySelector('.save-as-group');
            saveAsGroup.style.display = 'block';
            settingsPanel.querySelector('#config-name').focus(); // 自动聚焦到输入框
        });

        // 取消保存配置
        settingsPanel.querySelector('.cancel-save-as-btn').addEventListener('click', () => {
            const saveAsGroup = settingsPanel.querySelector('.save-as-group');
            saveAsGroup.style.display = 'none';
            settingsPanel.querySelector('#config-name').value = '';
        });

        // 保存配置的函数
        function saveCurrentConfig(configName) {
            if (configName) {
                // 从设置面板获取当前的所有设置值
                const newConfig = {
                    API_URL: settingsPanel.querySelector('#api-url').value.trim(),
                    API_KEY: settingsPanel.querySelector('#api-key').value.trim(),
                    MAX_TOKENS: parseInt(settingsPanel.querySelector('#max-tokens').value) || DEFAULT_CONFIG.MAX_TOKENS,
                    SHORTCUT: settingsPanel.querySelector('#shortcut').value.trim() || DEFAULT_CONFIG.SHORTCUT,
                    PROMPT: settingsPanel.querySelector('#prompt').value.trim() || DEFAULT_CONFIG.PROMPT,
                    MODEL: settingsPanel.querySelector('#model').value.trim() || DEFAULT_CONFIG.MODEL
                };

                // 检查配置名是否已存在
                if (getAllConfigs()[configName] &&
                    !confirm(`配置"${configName}"已存在，是否覆盖？`)) {
                    return false;
                }

                // 保存配置到存储中
                saveConfigAs(configName, newConfig);

                // 更新当前配置
                CONFIG = { ...newConfig, CURRENT_CONFIG_NAME: configName };
                GM_setValue('CURRENT_CONFIG_NAME', configName);

                // 更新两个面板中的配置选择器
                updateConfigSelectors(settingsPanel, modal);

                // 重置并隐藏保存表单
                settingsPanel.querySelector('.save-as-group').style.display = 'none';
                settingsPanel.querySelector('#config-name').value = '';

                alert('配置已保存并设为当前配置');
                return true;
            }
            return false;
        }

        // 确认保存配置按钮事件
        settingsPanel.querySelector('.confirm-save-as-btn').addEventListener('click', () => {
            const configName = settingsPanel.querySelector('#config-name').value.trim();
            saveCurrentConfig(configName);
        });

        // 保存新配置事件（回车键）
        settingsPanel.querySelector('#config-name').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const configName = e.target.value.trim();
                saveCurrentConfig(configName);
            }
        });

        // 重命名按钮事件
        settingsPanel.querySelector('.rename-config-btn').addEventListener('click', () => {
            const configSelect = settingsPanel.querySelector('#config-select');
            const currentConfigName = configSelect.value;
            
            if (!currentConfigName) {
                alert('请先选择要重命名的配置');
                return;
            }

            const renameGroup = settingsPanel.querySelector('.rename-group');
            const renameInput = settingsPanel.querySelector('#rename-config');
            
            // 设置输入框的默认值为当前配置名
            renameInput.value = currentConfigName;
            
            // 显示重命名输入组
            renameGroup.style.display = 'block';
            
            // 聚焦输入框并选中文本
            renameInput.focus();
            renameInput.select();
        });
        // 确认重命名按钮事件
        settingsPanel.querySelector('.confirm-rename-btn').addEventListener('click', () => {
            const configSelect = settingsPanel.querySelector('#config-select');
            const oldName = configSelect.value;
            const newName = settingsPanel.querySelector('#rename-config').value.trim();

            if (!oldName) {
                alert('请先选择要重命名的配置');
                return;
            }

            if (!newName) {
                alert('请输入新的配置名称');
                return;
            }

            if (oldName === newName) {
                alert('新名称与原名称相同');
                return;
            }

            // 检查新名称是否已存在
            const configs = getAllConfigs();
            if (configs[newName] && !confirm(`配置名"${newName}"已存在，是否覆盖？`)) {
                return;
            }

            // 执行重命名操作
            if (renameConfig(oldName, newName)) {
                // 更新选择器
                updateConfigSelectors(settingsPanel, modal);
                // 隐藏重命名输入组
                settingsPanel.querySelector('.rename-group').style.display = 'none';
                // 清空输入框
                settingsPanel.querySelector('#rename-config').value = '';
                alert('重命名成功');
            }
        });
        // 取消重命名按钮事件
        settingsPanel.querySelector('.cancel-rename-btn').addEventListener('click', () => {
            const renameGroup = settingsPanel.querySelector('.rename-group');
            renameGroup.style.display = 'none';
            settingsPanel.querySelector('#rename-config').value = '';
        });

        // 初始化重命名相关的事件
        initializeRenameEvents(elements.settingsPanel, elements.modal);
    }

    // 判断快捷键是否被按下
    function isShortcutPressed(event, shortcut) {
        const keys = shortcut.split('+');
        let ctrl = false, alt = false, shift = false, meta = false, key = null;

        keys.forEach(k => {
            const lower = k.toLowerCase();
            if (lower === 'ctrl') ctrl = true;
            // 将 Option 键映射到 Alt 键，因为在 Mac 中 Option 键触发的是 altKey
            if (lower === 'alt' || lower === 'option') alt = true;
            if (lower === 'shift') shift = true;
            if (lower === 'meta') meta = true;
            if (lower.length === 1 && /^[a-z]$/.test(lower)) key = lower;
        });

        if (key && event.key.toLowerCase() === key) {
            return event.ctrlKey === ctrl &&
                   event.altKey === alt &&
                   event.shiftKey === shift &&
                   event.metaKey === meta;
        }

        return false;
    }

    // 多系统适配的快捷键显示
    function getSystemShortcutDisplay(shortcut) {
        const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
        if (!isMac) return shortcut;

        // 为 Mac 系统转换快捷键显示
        return shortcut.replace(/Alt\+/g, 'Option+')
                    .replace(/Ctrl\+/g, '⌘+')
                    .replace(/Meta\+/g, '⌘+');
    }

    // 显示模态框
    function showModal(modal, overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    // 隐藏模态框
    function hideModal(modal, overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }

    const DOCK_POSITIONS = {
        LEFT: 'left',
        RIGHT: 'right',
        NONE: 'none'
    };

    const DEBOUNCE_TIME = 10; // 防抖时间
    const FOLD_DELAY = 1000; // 折叠延迟时间

    const DOCK_THRESHOLD = 100; // 贴靠触发阈值

    function savePosition(container) {
        const position = {
            left: container.style.left,
            top: container.style.top,
            right: container.style.right,
            bottom: container.style.bottom,
            dockPosition: container.dataset.dockPosition || DOCK_POSITIONS.NONE,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        };
        GM_setValue('containerPosition', position);
    }

    function loadPosition(container) {
        const savedPosition = GM_getValue('containerPosition');
        if (savedPosition) {
            const currentWindowRatio = window.innerWidth / savedPosition.windowWidth;
            const heightRatio = window.innerHeight / (savedPosition.windowHeight || window.innerHeight);

            if (savedPosition.dockPosition === DOCK_POSITIONS.LEFT) {
                dockToLeft(container);
            } else if (savedPosition.dockPosition === DOCK_POSITIONS.RIGHT) {
                dockToRight(container);
            } else {
                // 计算新位置时考虑容器尺寸
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;

                // 计算并约束水平位置
                const left = parseInt(savedPosition.left) * currentWindowRatio;
                const maxLeft = window.innerWidth - containerWidth;
                const safeLeft = Math.max(0, Math.min(left, maxLeft));

                // 计算并约束垂直位置
                const rawTop = parseInt(savedPosition.top);
                let safeTop;

                if (rawTop * heightRatio > window.innerHeight - containerHeight) {
                    // 如果计算后的位置会超出窗口底部，则放置在可见区域内
                    safeTop = window.innerHeight - containerHeight - 20; // 20px作为底部边距
                } else {
                    // 否则保持相对位置
                    safeTop = Math.max(0, Math.min(rawTop * heightRatio, window.innerHeight - containerHeight));
                }

                // 应用安全位置
                container.style.left = `${safeLeft}px`;
                container.style.top = `${safeTop}px`;
                container.style.right = 'auto';
                container.style.bottom = 'auto';
            }
        }
    }

    function initializeDrag(container, dragHandle, shadow) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let foldTimeout;

        const style = document.createElement('style');
        style.textContent = `
            .ai-summary-container {
                transition: transform 0.3s ease;
            }
            .ai-summary-container.docked {
                transition: all 0.3s ease;
            }
            .ai-drag-handle {
                pointer-events: auto !important;
            }
            .ai-summary-container.docked .ai-summary-btn {
                width: 0;
                padding: 0;
                opacity: 0;
                overflow: hidden;
                border-color: rgba(75, 85, 99, 0);
                transition: all 0.3s ease, border-color 0.3s ease;
            }
            .ai-summary-container.docked.show-btn .ai-summary-btn {
                width: 80px;
                padding: 5px 15px;
                opacity: 1;
            }
            .ai-summary-container.docked:hover .ai-summary-btn {
                width: 80px;
                padding: 5px 15px;
                opacity: 1;
            }
            .ai-summary-container.right-dock {
                right: 0 !important;
                left: auto !important;
            }
            .ai-summary-container.left-dock {
                left: 0 !important;
                right: auto !important;
            }
        `;
        shadow.appendChild(style);

        // 鼠标进入和离开事件处理
        container.addEventListener('mouseenter', () => {
            clearTimeout(foldTimeout); // 清除之前的折叠计时器
            if (container.classList.contains('docked')) {
                container.classList.add('show-btn');
            }
        });

        container.addEventListener('mouseleave', () => {
            if (container.classList.contains('docked')) {
                // 设置延迟折叠
                foldTimeout = setTimeout(() => {
                    container.classList.remove('show-btn');
                }, FOLD_DELAY);
            }
        });

        // 防抖函数
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        loadPosition(container);

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;

            // 开始拖动时，先记录当前位置
            if (container.classList.contains('right-dock')) {
                currentX = window.innerWidth - container.offsetWidth;
            } else if (container.classList.contains('left-dock')) {
                currentX = 0;
            } else {
                currentX = rect.left;
            }
            currentY = rect.top;

            container.classList.remove('docked', 'right-dock', 'left-dock', 'show-btn');
            container.dataset.dockPosition = DOCK_POSITIONS.NONE;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const newX = e.clientX - initialX;
            const newY = e.clientY - initialY;
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;

            if (e.clientX < DOCK_THRESHOLD) {
                dockToLeft(container);
                container.classList.add('show-btn'); // 贴靠时立即显示按钮
            }
            else if (e.clientX > window.innerWidth - DOCK_THRESHOLD) {
                dockToRight(container);
                container.classList.add('show-btn'); // 贴靠时立即显示按钮
            }
            else {
                const maxX = window.innerWidth - containerWidth;
                const maxY = window.innerHeight - containerHeight;

                currentX = Math.max(0, Math.min(newX, maxX));
                currentY = Math.max(0, Math.min(newY, maxY));

                container.style.left = `${currentX}px`;
                container.style.top = `${currentY}px`;
                container.style.right = 'auto';
                container.dataset.dockPosition = DOCK_POSITIONS.NONE;
                container.classList.remove('docked', 'right-dock', 'left-dock', 'show-btn');
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = 'auto';
                savePosition(container);
            }
        });

        // 使用防抖处理窗口调整
        const debouncedLoadPosition = debounce(() => {
            loadPosition(container);
        }, DEBOUNCE_TIME);

        window.addEventListener('resize', debouncedLoadPosition);
    }

    function dockToLeft(container) {
        container.classList.add('docked', 'left-dock');
        container.dataset.dockPosition = DOCK_POSITIONS.LEFT;
        container.style.left = '0';
        container.style.right = 'auto';
    }

    function dockToRight(container) {
        container.classList.add('docked', 'right-dock');
        container.dataset.dockPosition = DOCK_POSITIONS.RIGHT;
        container.style.right = '0';
        container.style.left = 'auto';
    }

    // 1. 加载配置
    loadConfig();

    // 2. 创建元素
    const elements = createElements();

    // 3. 初始化事件
    initializeEvents(elements);

    // 4. 检查配置是否完整
    if (!CONFIG.API_URL || !CONFIG.API_KEY) {
        elements.settingsPanel.style.display = 'block';
        elements.shadow.querySelector('.ai-summary-overlay').style.display = 'block';
        alert('请先配置API URL和API Key。');
    }
})();