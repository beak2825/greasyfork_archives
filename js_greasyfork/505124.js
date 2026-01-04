// ==UserScript==
// @name         fontra汉化(文本替换)
// @namespace    https://github.com/Losketch
// @version      1.0.0
// @author       Losketch
// @description  实时替换页面中的文本，包括 shadow-root 内的文本
// @match        *localhost:8000/editor/-/*
// @match        *localhost:8000/fontinfo/-/*
// @match        *localhost:8000/plugins/plugins.html
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMDAiPjxwYXRoIGZpbGw9IiNGMjE4NTkiIGQ9Ik0wIDg3MFYzMzBDMCAxNDggMTQ4IDAgMzMwIDBoNTQwYzE4MiAwIDMzMCAxNDggMzMwIDMzMHY1NDBjMCAxODItMTQ4IDMzMC0zMzAgMzMwSDMzMEEzMzAgMzMwIDAgMCAxIDAgODcwWm0wIDAiLz48Y2xpcFBhdGggaWQ9ImEiPjxwYXRoIGQ9Ik0wIDN2NGMwIDIgMSAzIDMgM2g0YzIgMCAzLTEgMy0zVjNjMC0yLTEtMy0zLTNIM0MxIDAgMCAxIDAgM1ptMCAwIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0ibWF0cml4KDEyMCAwIDAgLTEyMCAwIDEyMDApIi8+PC9jbGlwUGF0aD48ZyBjbGlwLXBhdGg9InVybCgjYSkiPjxwYXRoIGZpbGw9IiNDNDEzNTMiIGQ9Im0yNTMgMjc4LTg1IDg1djEyMGgxNTB2Mzk1aC02NWwtODUgODV2MTIwaDUyOGw4NS04NVY4NzhINjEzdi04M2gxODVsODUtODVWNjAzaDY1bDg1LTg1VjI3OFptMzYwIDMxMlY0ODNoMjE1djEwN1ptMCAwIi8+PHBhdGggZmlsbD0iIzA0MjMyRCIgZD0iTTMxOCAzMTNIMTY4bDg1IDg1aDY1Wm01MTAgMEg1MjhsODUgODVoMjE1Wm0wIDEyMCA4NSA4NWgxMjBsLTg1LTg1Wk01MjggNjI1bDg1IDg1aDI3MGwtODUtODVaTTE2OCA5MTNsODUgODVoNTI4bC04NS04NVptMCAwIi8+PHBhdGggZmlsbD0iIzA5NEE1RSIgZD0ibTk0OCA0MzMgODUgODVWMjc4bC04NS04NVptLTMzNS0zNS04NS04NXYxOTJoODVabTE4NSAyMjcgODUgODVWNTkwbC04NS04NVptLTE4NSA4NS04NS04NXYxNjhoODVabTgzIDIwMyA4NSA4NVY4NzhsLTg1LTg1Wm0wIDAiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTY4IDE5M3YxMjBoMTUwdjQ4MEgxNjh2MTIwaDUyOFY3OTNINTI4VjYyNWgyNzBWNTA1SDUyOFYzMTNoMzAwdjEyMGgxMjBWMTkzWm0wIDAiLz48L2c+PC9zdmc+
// @grant        none
// @sandbox      JavaScript
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/505124/fontra%E6%B1%89%E5%8C%96%28%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505124/fontra%E6%B1%89%E5%8C%96%28%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const translations = {
        // 上方任务栏 //
        // 视图
        "is not used as a component by any glyph.": " 未被任何字形用作元件。",
        // 编辑
        'Are you sure you want to delete glyph "': '您确定要从字体项目中删除字形 “',
        'from the font project?': '”吗？',
        // 左侧工具栏 //
        "Display Language": "显示语言",
        "Fontra version:": "Fontra 版本：",
        "Python version:": "Python 版本：",
        "Startup time:": "启动时间：",
        "View plugins:": "查看插件：",
        "editor, fontinfo, plugins": "编辑器、字体信息、插件",
        "Project manager:": "项目管理：",
        // Designspace 导航
        "View options": "查看可选项",
        "Apply single-axis mapping": "应用单轴映射",
        "Apply cross-axis mapping": "应用跨轴映射",
        "Show effective location": "显示有效位置",
        "Show hidden axes": "显示隐藏轴",
        "⚠️ The source name should be unique": "⚠️ 源名称应是唯一的",
        "⚠️ The source location must be unique": "⚠️ 源位置必须是唯一的",
        "Are you sure you want to delete source": "您确定要删除源",
        "Also delete associated layer": "同时删除相关层 ",
        "Edit glyph axes": "编辑字形轴",
        // 参考字体
        "Chinese ; Han (Simplified variant) (zh-Hans)": "中文；汉(简体)(zh-Hans)",
        "Chinese ; Han (Traditional variant) (zh-Hant)": "中文；汉(繁体)(zh-Hant)",
        "Chinese ; Hong Kong (zh-HK)": "中文；香港(zh-HK)",
        "Japanese (ja)": "日本(ja)",
        "Korean (ko)": "韩国(ko)",
        // fontinfo 页面
        "New font source...": "新字体源...",
        "Add font source": "添加字体源",
        "Source name:": "源名称：",
        "Status definitions": "状态定义",
        "New status definition": "新状态定义",
        "Delete status definition": "删除状态定义",
        "Is Default": "是否为默认值",
        "If checked, this status will be used as a fallback when a source status is not set": "如果选中，当未设置源状态时，该状态将被用作后备状态",
        // fontinfo 页面
        "Can’t edit glyph “": "无法编辑字形 “",
        "The font is read-only.": "该字体是只读的。",
        "The data could not be saved due to an error.": "由于错误，数据无法保存。",
        "The edit has been reverted.": "编辑内容已被还原。",
        // 右侧工具栏 //
        // 选区信息
        "Lock glyph": "锁定字形",
        "Unlock glyph": "解锁字形",
        "Are you sure you want to unlock glyph": "你确定要解锁字形",
        // 选区变换
        "Distance in units": "距离单位",
        "Path Operations": "路径操作",
        "Remove overlaps": "并集",
        "Subtract contours": "差集",
        "Intersect contours": "交集",
        "Exclude contours": "互斥",
        // Glyph Note
        "Glyph Note": "字形注释",
        "Glyph note (no glyph selected)": "字形注释（未选择字形）",
        "Glyph note for": "字形注释为",
        // Related Glyphs & Characters
        "Related Glyphs & Characters": "相关字形和字符",
        "Related glyphs & characters": "相关字形和字符",
        "Related glyphs & characters for": "相关字形和字符用于",
        "(No glyph selected)": "(未选择字形）",
        "(No related glyphs or characters were found)": "(未找到相关字形或字符）",
        "Characters that decompose with this character": "与该字符一起分解的字符",
        "Character decomposition": "字符分解",
        // plugins //
        "Fontra plugins": "Fontra 插件",
        "Add plugin": "添加插件",
        "Plugin path:": "插件路径",
        // 其他垫底
        "Knife Tool": "刀工具",
        "Delete source": "删除源",
        "Add source": "添加源",
        "Italic Angle": "斜体角度",
        "Font Info": "字体信息",
        "Axes": "参数轴",
        "Sources": "源",
        "General": "常规",
        "Location": "位置",
        "weight": "字重",
        "slant": "偏",
        "Line metrics": "边界度量",
        "Ascender": "上边界",
        "Cap Height": "上限高",
        "x-Height": "x轴高",
        "Baseline": "基线",
        "Descender": "下边界",
        "Minimum": "最低",
        "Default": "默认值",
        "Maximum": "最大",
        "Name": "名称",
        "Layer:": "层：",
        "Okay": "好的",
        "Create": "创建",
        "Cancel": "取消",
        "Delete": "删除",
        "Add": "添加",
        "None": "无",
        "Yes": "是",
        "Cut": "剪切",
        "Copy": "复制",
        "Paste": "粘贴",
    };

    // 替换文本的函数
    function replaceTextInNode(node) {
        for (const key in translations) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes(key)) {
                node.textContent = node.textContent.replace(key, translations[key]);
            }
        }
    }

    // 替换input标签的value属性
    function replaceInputValues(root) {
        root.querySelectorAll('input').forEach(input => {
            for (const key in translations) {
                if (input.value.includes(key)) {
                    input.value = input.value.replace(key, translations[key]);
                }
            }
        });
    }

    // 替换data-tooltip属性
    function replaceTooltipAttributes(root) {
        root.querySelectorAll('[data-tooltip]').forEach(element => {
            for (const key in translations) {
                if (element.getAttribute('data-tooltip').includes(key)) {
                    element.setAttribute('data-tooltip', element.getAttribute('data-tooltip').replace(key, translations[key]));
                }
            }
        });
        root.querySelectorAll('[title]').forEach(element => {
            for (const key in translations) {
                if (element.getAttribute('title').includes(key)) {
                    element.setAttribute('title', element.getAttribute('title').replace(key, translations[key]));
                }
            }
        });
    }

    // 遍历普通节点
    function traverseNodes(node) {
        replaceTextInNode(node);
        node.childNodes.forEach(traverseNodes);
    }

    // 遍历 shadow DOM 节点
    function traverseShadowNodes(shadowRoot) {
        shadowRoot.querySelectorAll('*').forEach(element => {
            if (element.shadowRoot) {
                traverseShadowNodes(element.shadowRoot);
            }
            element.childNodes.forEach(traverseNodes);
        });
        replaceInputValues(shadowRoot); // 替换shadow DOM节点里的input标签的value属性
        replaceTooltipAttributes(shadowRoot); // 替换shadow DOM节点里的data-tooltip属性
    }

    // 定期执行替换操作
    setInterval(() => {
        traverseNodes(document.body);
        document.querySelectorAll('*').forEach(element => {
            if (element.shadowRoot) {
                traverseShadowNodes(element.shadowRoot);
            }
        });
        replaceInputValues(document); // 替换普通DOM节点里的input标签的value属性
        replaceTooltipAttributes(document); // 替换普通DOM节点里的data-tooltip属性
    }, 3000); // 每3秒执行一次
})();