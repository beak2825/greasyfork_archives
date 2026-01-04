// ==UserScript==
// @name         三审发稿自动化脚本
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  自动化审稿流程，支持多套默认值方案管理。
// @author       玖柒
// @match        http://192.168.1.177:8239/scrp/erpmain.cfm
// @match        http://116.211.105.20:8239/scrp/erpmain.cfm
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523905/%E4%B8%89%E5%AE%A1%E5%8F%91%E7%A8%BF%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523905/%E4%B8%89%E5%AE%A1%E5%8F%91%E7%A8%BF%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

function getFieldLabel(key) {
    const fieldLabels = {
        fgzs: '发稿字数',
        cskssj: '初审开始日期',
        cssj: '初审结束日期',
        sfield334: '政治思想性评价',
        sfield344: '*内容特色评价',
        sfield338: '形式质量评价',
        csyj: '*初审结论',
        sfield340: '需要修改的内容',
        sfield341: '加工过程纪要',
        sfield343: '提请复审解决的问题',
        sfield339: '专家或权威部门审稿意见',
        fskssj: '二审开始日期',
        fssj: '二审结束日期',
        sfield348: '书稿内容和形式评价',
        sfield354: '政治思想性评价',
        sfield353: '初审工作评价',
        fsyj: '复审结论',
        sfield350: '还需要修改和处理的问题',
        sfield352: '对责任编辑提出问题的处理意见',
        sfield356: '提请终审解决的问题',
        zskssj: '三审开始日期',
        zssj: '三审结束日期',
        sfield375: '内容价值评价',
        sfield379: '政治思想性评价',
        sfield378: '初、复审工作评价',
        sfield363: '对复审提出问题的处理意见',
        jgbj2: '还需要修改和处理的问题',
        swbj: '提请分管社领导处理的问题',
        zsyj: '终审结论'
    };
    return fieldLabels[key] || key; // 如果找不到对应的标题，则返回字段名
}

(function() {
    'use strict';

    // 创建并添加按钮到页面
    function createButton() {
        const button = document.createElement('button');
        button.innerText = '三审发稿脚本';
        button.style.position = 'fixed';
        button.style.bottom = '30px';
        button.style.right = '20px';
        button.style.padding = '10px 20px';
        button.style.zIndex = 10000;
        button.style.backgroundColor = '#4CAF50';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = onStart;
        document.body.appendChild(button);
    }

    // 启动脚本的主函数
    async function onStart() {
        try {
            initializeValues();

            // 创建选择审次的弹窗
            const stage = await promptStageSelection();
            if (!stage) {
                return;
            }

            // 获取对应审次的默认值
            const defaults = getDefaultValues(stage);
            if (!defaults) {
                alert('无法获取对应审次的默认值。');
                return;
            }

            // 创建并显示可编辑表单
            const userInputs = await promptEditForm(defaults, stage);
            if (!userInputs) {
                return;
            }

            // 设置值到页面对象
            setValues(userInputs);
        } catch (error) {
            console.error('脚本运行出错:', error);
            alert('脚本运行过程中出现错误，请检查控制台日志。');
        }
    }

    // 初始化初始值
    function initializeValues() {
        console.log('初始化初始值...');
        // 您可以在这里添加任何初始化代码
    }

    // 创建选择审次的弹窗
    function promptStageSelection() {
        return new Promise((resolve) => {
            const modal = createModal('请选择审次', ['初审', '复审', '终审'], resolve);
            document.body.appendChild(modal);
        });
    }

    // 获取对应审次的默认值
    function getDefaultValues(stage, schemeName = '默认方案') {
        const savedDefaults = localStorage.getItem(`defaults_${stage}_${schemeName}`);
        if (savedDefaults) {
            return JSON.parse(savedDefaults);
        } else {
            return getHardcodedDefaults(stage);
        }
    }

    // 获取硬编码的默认值
    function getHardcodedDefaults(stage) {
        const raw_words = getv('zs');
        const words = raw_words;
        const today = new Date();

        function getFormattedDate(daysAgo) {
            return formatDate(subtractDays(today, daysAgo));
        }

        if (stage === '初审') {
            return {
                fgzs: words,
                cskssj: getFormattedDate(30),
                cssj: getFormattedDate(23),
                sfield334: '本书没有政治思想性问题。',
                sfield344: getv('nrty'),
                sfield338: '【请自行设置默认值】',
                csyj: '【请自行设置默认值】【请手动结合本书给出一些结论】',
                sfield340: '【请自行设置默认值】',
                sfield341: '【请自行设置默认值】',
                sfield343: '【请自行设置默认值】。',
                sfield339: '可以进行编辑加工'
            };
        } else if (stage === '复审') {
            return {
                fskssj: getFormattedDate(22),
                fssj: getFormattedDate(15),
                sfield348: '【请自行设置默认值】',
                sfield354: '没有政治思想性的问题。',
                sfield353: '【请自行设置默认值】',
                fsyj: '【请自行设置默认值】',
                sfield350: '【请自行设置默认值】',
                sfield352: '已处理。',
                sfield356: '【请自行设置默认值】'
            };
        } else if (stage === '终审') {
            return {
                zskssj: getFormattedDate(14),
                zssj: getFormattedDate(8),
                sfield375: '【请自行设置默认值】',
                sfield379: '未发现思想政治方面的问题。',
                sfield378: '【请自行设置默认值】',
                sfield363: '已处理。',
                jgbj2: '【请自行设置默认值】',
                swbj: '无。',
                zsyj: '【请自行设置默认值】'
            };
        } else {
            return null;
        }
    }

    // 创建并显示可编辑表单
    function promptEditForm(defaults, stage) {
        return new Promise((resolve) => {
            const modal = createFormModal('编辑审次内容', defaults, resolve, stage);
            document.body.appendChild(modal);
        });
    }

    // 设置值到页面对象
    function setValues(values) {
        console.log('设置值到页面对象...');
        const frame_Main = document.getElementById('frame_Main');
        if (frame_Main) {
            console.log('找到 frame_Main iframe');
        } else {
            console.log('未找到 frame_Main iframe');
            return;
        }
        const innerDocMain = frame_Main.contentDocument || frame_Main.contentWindow.document;
        if (innerDocMain) {
            console.log('成功获取 frame_Main 内的文档对象');
        } else {
            console.log('无法获取 frame_Main 内的文档对象');
            return;
        }
        const content2Iframe = innerDocMain.getElementById('content_2');
        if (content2Iframe) {
            console.log('找到 content_2 iframe');
        } else {
            console.log('未找到 content_2 iframe');
            return;
        }
        const innerDocContent2 = content2Iframe.contentDocument || content2Iframe.contentWindow.document;
        if (innerDocContent2) {
            console.log('成功获取 content_2 内的文档对象');
        } else {
            console.log('无法获取 content_2 内的文档对象');
            return;
        }

        for (const [id, value] of Object.entries(values)) {
            setv(id, value, innerDocContent2);
        }

        const submitButton = innerDocContent2.getElementById('submitBtn');
        if (submitButton) {
            console.log('找到 submitBtn 元素，正在点击...');
            submitButton.click();
        } else {
            console.log('未找到 submitBtn 元素');
        }
    }

    // 工具函数
    function getv(id) {
        const frame_Main = document.getElementById('frame_Main'); // 统一为 'frame_Main'
        if (!frame_Main) return '';
        const innerDocMain = frame_Main.contentDocument || frame_Main.contentWindow.document;
        if (!innerDocMain) return '';
        const content2Iframe = innerDocMain.getElementById('content_2');
        if (!content2Iframe) return '';
        const innerDocContent2 = content2Iframe.contentDocument || content2Iframe.contentWindow.document;
        if (!innerDocContent2) return '';
        const element = innerDocContent2.getElementById(id);
        return element ? element.value : '';
    }

    function setv(id, v, doc) {
        const textarea = doc.getElementById(id);
        if (textarea && (textarea.tagName.toLowerCase() === 'textarea' || textarea.tagName.toLowerCase() == 'input')) {
            textarea.value = v;
            console.log(`设置 ${id} 的值为: ${v}`);
        } else {
            console.warn(`Textarea with id "${id}" not found.`);
        }
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function subtractDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }

    // 创建选择审次的模态框
    function createModal(title, options, callback) {
        // 创建模态背景
        const modalBg = document.createElement('div');
        modalBg.style.position = 'fixed';
        modalBg.style.top = '0';
        modalBg.style.left = '0';
        modalBg.style.width = '100%';
        modalBg.style.height = '100%';
        modalBg.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modalBg.style.display = 'flex';
        modalBg.style.justifyContent = 'center';
        modalBg.style.alignItems = 'center';
        modalBg.style.zIndex = '10000';

        // 创建模态内容
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.textAlign = 'center';

        // 标题
        const modalTitle = document.createElement('h2');
        modalTitle.innerText = title;
        modalContent.appendChild(modalTitle);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-around';

        options.forEach(option => {
            const btn = document.createElement('button');
            btn.innerText = option;
            btn.style.padding = '10px 20px';
            btn.style.margin = '0 10px';
            btn.style.cursor = 'pointer';
            btn.onclick = () => {
                document.body.removeChild(modalBg);
                callback(option);
            };
            buttonContainer.appendChild(btn);
        });

        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = '取消';
        cancelBtn.style.padding = '10px 20px';
        cancelBtn.style.marginTop = '20px';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.onclick = () => {
            document.body.removeChild(modalBg);
            callback(null);
        };
        modalContent.appendChild(buttonContainer);
        modalContent.appendChild(cancelBtn);

        modalBg.appendChild(modalContent);
        return modalBg;
    }

    // 创建编辑表单的模态框
    // 创建编辑表单的模态框
    function createFormModal(title, fields, callback, stage) {
        // 创建模态背景
        const modalBg = document.createElement('div');
        modalBg.style.position = 'fixed';
        modalBg.style.top = '0';
        modalBg.style.left = '0';
        modalBg.style.width = '100%';
        modalBg.style.height = '100%';
        modalBg.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modalBg.style.display = 'flex';
        modalBg.style.justifyContent = 'center';
        modalBg.style.alignItems = 'center';
        modalBg.style.zIndex = '10000';

        // 创建模态内容
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.width = '80%';
        modalContent.style.maxHeight = '80%';
        modalContent.style.overflowY = 'auto';

        // 标题
        const modalTitle = document.createElement('h2');
        modalTitle.innerText = title;
        modalContent.appendChild(modalTitle);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';

        // 确认按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.innerText = '确认';
        confirmBtn.style.padding = '10px 20px';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.onclick = (e) => {
            e.preventDefault();
            const result = {};
            for (const key of Object.keys(fields)) {
                result[key] = inputs[key].value;
            }
            document.body.removeChild(modalBg);
            callback(result);
        };
        buttonContainer.appendChild(confirmBtn);

        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = '取消';
        cancelBtn.style.padding = '10px 20px';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.onclick = (e) => {
            e.preventDefault();
            document.body.removeChild(modalBg);
            callback(null);
        };
        buttonContainer.appendChild(cancelBtn);

        // 下拉列表选择方案
        const schemeSelect = document.createElement('select');
        schemeSelect.style.padding = '10px';
        schemeSelect.style.marginLeft = '10px';
        schemeSelect.style.cursor = 'pointer';
        const schemes = getSavedSchemes(stage);
        schemes.forEach(scheme => {
            const option = document.createElement('option');
            option.value = scheme;
            option.innerText = scheme;
            schemeSelect.appendChild(option);
        });

        // 切换方案时更新表单内容
        schemeSelect.onchange = () => {
            const selectedScheme = schemeSelect.value;
            const defaults = getDefaultValues(stage, selectedScheme);
            for (const [key, value] of Object.entries(defaults)) {
                inputs[key].value = value;
            }
        };

        buttonContainer.appendChild(schemeSelect);

        // 保存为当前方案按钮
        const saveCurrentSchemeBtn = document.createElement('button');
        saveCurrentSchemeBtn.innerText = '保存为当前方案';
        saveCurrentSchemeBtn.style.padding = '10px 20px';
        saveCurrentSchemeBtn.style.cursor = 'pointer';
        saveCurrentSchemeBtn.onclick = (e) => {
            e.preventDefault();
            const currentScheme = schemeSelect.value;

            // 获取当前表单的值
            const defaults = {};
            for (const key of Object.keys(fields)) {
                defaults[key] = inputs[key].value;
            }

            // 直接覆盖默认方案
            localStorage.setItem(`defaults_${stage}_${currentScheme}`, JSON.stringify(defaults));
            alert(`方案 "${currentScheme}" 已保存！`);
        };
        buttonContainer.appendChild(saveCurrentSchemeBtn);

        // 新建方案按钮
        const newSchemeBtn = document.createElement('button');
        newSchemeBtn.innerText = '新建方案';
        newSchemeBtn.style.padding = '10px 20px';
        newSchemeBtn.style.cursor = 'pointer';
        newSchemeBtn.onclick = (e) => {
            e.preventDefault();
            const schemeName = prompt('请输入新方案名称：');
            if (schemeName) {
                const defaults = {};
                for (const key of Object.keys(fields)) {
                    defaults[key] = inputs[key].value;
                }
                localStorage.setItem(`defaults_${stage}_${schemeName}`, JSON.stringify(defaults));
                alert(`方案 "${schemeName}" 已保存！`);
                // 刷新下拉列表
                const option = document.createElement('option');
                option.value = schemeName;
                option.innerText = schemeName;
                schemeSelect.appendChild(option);
            }
        };
        buttonContainer.appendChild(newSchemeBtn);

        // 重命名当前方案按钮
        const renameSchemeBtn = document.createElement('button');
        renameSchemeBtn.innerText = '重命名当前方案';
        renameSchemeBtn.style.padding = '10px 20px';
        renameSchemeBtn.style.cursor = 'pointer';
        renameSchemeBtn.onclick = (e) => {
            e.preventDefault();
            const currentScheme = schemeSelect.value;
            if (currentScheme === '默认方案') {
                alert('默认方案无法重命名！');
                return;
            }
            const newName = prompt('请输入新名称：');
            if (newName) {
                const defaults = localStorage.getItem(`defaults_${stage}_${currentScheme}`);
                localStorage.removeItem(`defaults_${stage}_${currentScheme}`);
                localStorage.setItem(`defaults_${stage}_${newName}`, defaults);
                alert(`方案 "${currentScheme}" 已重命名为 "${newName}"！`);
                // 刷新下拉列表
                const option = schemeSelect.querySelector(`option[value="${currentScheme}"]`);
                option.value = newName;
                option.innerText = newName;
            }
        };
        buttonContainer.appendChild(renameSchemeBtn);

        // 删除当前方案按钮
        const deleteSchemeBtn = document.createElement('button');
        deleteSchemeBtn.innerText = '删除当前方案';
        deleteSchemeBtn.style.padding = '10px 20px';
        deleteSchemeBtn.style.cursor = 'pointer';
        deleteSchemeBtn.style.backgroundColor = '#f44336';
        deleteSchemeBtn.style.color = '#fff';
        deleteSchemeBtn.style.border = 'none';
        deleteSchemeBtn.style.borderRadius = '5px';
        deleteSchemeBtn.onclick = (e) => {
            e.preventDefault();
            const currentScheme = schemeSelect.value;
            if (currentScheme === '默认方案') {
                alert('默认方案无法删除！');
                return;
            }
            if (confirm(`确定要删除方案 "${currentScheme}" 吗？`)) {
                localStorage.removeItem(`defaults_${stage}_${currentScheme}`);
                alert(`方案 "${currentScheme}" 已删除！`);
                // 刷新下拉列表
                schemeSelect.removeChild(schemeSelect.querySelector(`option[value="${currentScheme}"]`));
            }
        };
        buttonContainer.appendChild(deleteSchemeBtn);

        modalContent.appendChild(buttonContainer);

        // 表单
        const form = document.createElement('form');

        const inputs = {};
        for (const [key, value] of Object.entries(fields)) {
            const label = document.createElement('label');
            label.innerText = getFieldLabel(key);
            label.style.display = 'block';
            label.style.marginTop = '10px';

            const textarea = document.createElement('textarea');
            textarea.id = key;
            textarea.value = value;
            textarea.style.width = '100%';

            // 单独设置“发稿字数”输入文本框的高度
            if (key === 'fgzs' || key == 'cskssj' || key == 'cssj' || key == 'fskssj' || key == 'fssj' || key == 'zskssj' || key == 'zssj' ) {
                textarea.style.height = '15px';
            } else {
                textarea.style.height = '100px';
            }

            label.appendChild(textarea);
            form.appendChild(label);
            inputs[key] = textarea;
        }

        modalContent.appendChild(form);

        modalBg.appendChild(modalContent);
        return modalBg;
    }

    // 获取已保存的方案列表
    function getSavedSchemes(stage) {
        const schemes = ['默认方案'];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`defaults_${stage}_`)) {
                const schemeName = key.replace(`defaults_${stage}_`, '');
                if (schemeName !== '默认方案') {
                    schemes.push(schemeName);
                }
            }
        }
        return schemes;
    }

    // 添加样式
    function addStyles() {
        // 您可以在这里添加任何需要的样式
    }

    // 初始化脚本
    function init() {
        addStyles();
        createButton();
    }

    // 调用初始化
    init();

})();