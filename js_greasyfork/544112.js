// ==UserScript==
// @name         XGO Blockly Translator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Translate XGO Blockly interface from English to Chinese
// @author       Moxiner
// @match        http://47.252.22.82:8088/*
// @grant        none
// @run-at       document-end
// @license      None
// @downloadURL https://update.greasyfork.org/scripts/544112/XGO%20Blockly%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/544112/XGO%20Blockly%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 中英对照表
    const translations = {
        "Please enter your Robot's IP address": "请输入机器人的IP地址",
        // 菜单栏
        "File": "文件",
        "Edit": "编辑",
        "View": "视图",
        "Format": "格式",
        "Tools": "工具",
        "Help": "帮助",
        
        // 文件菜单
        "New": "新建",
        "Open": "打开",
        "Save": "保存",
        "Save As": "另存为",
        "Import": "导入",
        "Extras": "导出",
        "Export Python": "导出为 Python",
        "Themes": "主题",
        "Dark": "暗黑主题",
        "Light": "亮色主题",
        "Default": "重置主题",
        "Run": "运行",
        "Switch Language": "切换语言",
        "Split View": "分屏视图",
        "Close": "关闭",

        // 编辑菜单
        "Undo": "撤销",
        "Redo": "重做",
        "Duplicate": "复制",
        "Add Comment": "添加注释",
        "Clear up Blocks": "整理块",
        "Delete Block": "删除块",
        "Disable Block": "禁用块",

        // 视图菜单
        "Zoom In": "放大",
        "Zoom Out": "缩小",
        "Reset Zoom": "重置缩放",
        "Blocks": "块",

        
        // 工具菜单
        "Settings": "设置",
        "Language": "语言",
        // 基础
        "Basic":"基本",
        "Imports":"导入",
        "import time":"导入 时间",
        "import math":"导入 模块",
        "import random": "导入 随机",
        "time.sleep(": "时间.睡眠(",
        "print(": "打印(",
        'print("': '打印("',
        "pass": "跳过",
        
      
        // 逻辑
        "Logic": "逻辑",
        "and": "与",
        "or": "或",
        "not": "非",
        "None": "无",
        "is": "是",
        "try": "尝试",
        "except": "除外",
        "finally": "最后",

        
        // 循环
        "Loops": "循环",
        "for": "遍历",
        "in range(": "在范围内",
        "break": "中断",
        "in": "在",
        "Repeat": "重复",
        "times :": "时间:",
        "While": "当",

        // 条件
        "Conditions": "条件",
        "condition": "条件",
        "if": "如果",
        "elif": "那么",
        "else": "否则",

        // 定义
        "Definitions": "定义",
        "def": "定义",
        "return": "返回",
        "class": "类",
        "self.": "自身",

        // 文本
        "Text": "文本",
        "text": "文本",
        "create text with ": "创建文本时使用",
        "to": "到",
        "append text": "添加文本",
        "length of ": "长度为",
        "is empty": "为空",
        "in text": "在文本中",
        "find": "查找",
        "occurrences of text": "文本的出现次数",
        "get": "获取",
        "trim spaces from ": "去除空格",
        "print ": "打印",

        // 列表
        "Lists": "列表",

        // 元组
        "Tuple": "元组",
        "Tuple": "元组",

        // 数学
        "Math": "数学",
        "math": "数学",

        // 变量
        "Variables": "变量",
        "Create variable...": "创建变量...",

        // 屏幕
        "Screen": "屏幕",
        
        // 媒体
        "Media": "媒体",
        "Camera": "摄像头",
        "Speaker": "扬声器",
        "micphone": "麦克风",

        // 键盘
        "Key": "键盘",

        // 视觉
        "Vision": "视觉",
        "Voice": "语音",

        // XGO-Mini
        "XGO-Mini": "XGO-Mini",

        // XGO-Lite
        "XGO-Lite": "XGO-Lite",
        


    };

    // 已处理元素的WeakSet，防止重复处理
    const processedElements = new WeakSet();
    
    // 处理状态标志，防止函数重入
    let isProcessing = false;

    // 翻译函数
    function translateText() {
        // 如果正在处理中，则直接返回
        if (isProcessing) return;
        
        try {
            isProcessing = true;
            
            // 获取页面上所有文本节点
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            const textNodes = [];
            let node;

            // 收集所有文本节点
            while ((node = walker.nextNode())) {
                if (node.nodeValue && node.nodeValue.trim()) {
                    textNodes.push(node);
                }
            }

            // 遍历并翻译文本节点
            textNodes.forEach(textNode => {
                const text = textNode.nodeValue.trim();
                if (translations[text]) {
                    textNode.nodeValue = textNode.nodeValue.replace(text, translations[text]);
                }
            });

            // 翻译属性中的文本（如placeholder、title等）
            const attributesToTranslate = ['placeholder', 'title', 'alt'];
            attributesToTranslate.forEach(attr => {
                const elements = document.querySelectorAll(`[${attr}]`);
                elements.forEach(element => {
                    const attrValue = element.getAttribute(attr);
                    if (attrValue && translations[attrValue]) {
                        element.setAttribute(attr, translations[attrValue]);
                    }
                });
            });
            
            // 特殊处理Blockly的SVG文本元素
            const blocklyTextElements = document.querySelectorAll('text.blocklyText');
            blocklyTextElements.forEach(element => {
                // 检查元素是否已经处理过
                if (processedElements.has(element)) return;
                
                const textContent = element.textContent;
                if (textContent && translations[textContent]) {
                    element.textContent = translations[textContent];
                    processedElements.add(element);
                }
                
                // 处理包含&nbsp;的文本（如"import&nbsp;time"）
                const textWithSpaces = textContent.replace(/\u00A0/g, ' ');
                if (translations[textWithSpaces]) {
                    element.textContent = translations[textWithSpaces];
                    processedElements.add(element);
                }
            });
            
            // 处理其他可能的Blockly文本元素
            const blocklyDropdownElements = document.querySelectorAll('.blocklyDropdownText');
            blocklyDropdownElements.forEach(element => {
                if (processedElements.has(element)) return;
                
                const textContent = element.textContent;
                if (textContent && translations[textContent]) {
                    element.textContent = translations[textContent];
                    processedElements.add(element);
                }
            });
            
        } finally {
            // 无论是否出错都释放处理标志
            isProcessing = false;
        }
    }

    // 观察DOM变化并翻译新添加的内容
    const observer = new MutationObserver(function(mutations) {
        let shouldTranslate = false;
        
        // 检查是否有实际的节点变化
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && 
                (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                shouldTranslate = true;
                break;
            }
        }
        
        // 只有在有实际变化时才触发翻译
        if (shouldTranslate) {
            // 延迟执行以确保DOM更新完成
            setTimeout(translateText, 100);
        }
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始翻译
    setTimeout(translateText, 1000);

    // 定期检查是否有新内容需要翻译 (降低频率以提高性能)
    setInterval(translateText, 3000);
})();