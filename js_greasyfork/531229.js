// ==UserScript==
// @name         sewer-assistant
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  在审核弹窗中显示自定义模板面板，方便快速选择审核意见
// @author       fnyfree/ai
// @match        https://sewerpt.com/*
// @match        https://zmpt.*/*
// @match        *://*.pt/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531229/sewer-assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/531229/sewer-assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .template-panel {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #e6e6e6;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        .template-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #393D49;
        }
        .template-group {
            margin-bottom: 8px;
        }
        .template-group-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #5FB878;
        }
        .template-item {
            margin: 5px 0;
            display: inline-block;
            margin-right: 15px;
        }
        .template-item label {
            cursor: pointer;
        }
        .template-item input {
            margin-right: 4px;
        }
    `);

    // 定义模板组和模板项
    const templateGroups = [
        {
            title: "标题问题",
            templates: [
                { id: "title-chinese", text: "去除主标题的中文" },
                { id: "title-format", text: "标题格式不规范" },
                { id: "title-missing", text: "缺少必要的标题信息" }
            ]
        },
        {
            title: "内容问题",
            templates: [
                { id: "content-mediainfo", text: "缺失Mediainfo信息" },
                { id: "content-description", text: "简介内容不完整，请使用PT-GEN工具获取豆瓣/IMDB数据" },
                { id: "content-screenshots", text: "缺少截图，请补充三张或三张以上截图" } ,
                { id: "content-neirong", text: "请移除与影片截图无关的图片或海报" },
                { id: "content-jjjianjietupian", text: "简介图片异常(错误/无法显示)，请检查" },
                { id: "content-jtjianjietupian", text: "截图图片异常(错误/无法显示)，请检查" }

            ]
        },
        {
            title: "标签/分类问题",
            templates: [
                { id: "category-wrong", text: "分类选择错误" },
                { id: "tag-missing", text: "缺少【】标签，请补充" },
                { id: "content-yueyu", text: "粤语音频请添加粤语标签" },
                { id: "content-guoyu", text: "国语音频请添加国语标签" },
                { id: "content-wanjie", text: "完结剧集请添加完结标签" },
                { id: "content-fenji", text: "分集请添加分集标签" }
            ]
        },
        {
            title: "其他问题",
            templates: [
                { id: "duplicate", text: "重复发布" },
                { id: "low-quality", text: "质量较低" },
                { id: "rules-violation", text: "违反站点规则" }
            ]
        }
    ];

    // 观察DOM变化，检测审核弹窗的出现
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // 元素节点
                    // 查找审核弹窗中的审核表单和评论区域
                    const approvalForm = document.querySelector('.form-comments');
                    const approvalComment = document.querySelector('#approval-comment');

                    if (approvalForm && approvalComment && !document.querySelector('.template-panel')) {
                        console.log('找到审核弹窗，添加模板面板');
                        addTemplatePanel(approvalForm, approvalComment);
                        return;
                    }
                }
            }
        }
    });

    // 开始观察整个document
    observer.observe(document, { childList: true, subtree: true });

    // 添加模板面板到审核弹窗
    function addTemplatePanel(approvalForm, approvalComment) {
        // 创建模板面板
        const templatePanel = document.createElement('div');
        templatePanel.className = 'template-panel';

        // 添加标题
        const title = document.createElement('div');
        title.className = 'template-title';
        title.textContent = '常用审核模板';
        templatePanel.appendChild(title);

        // 为每个模板组创建元素
        templateGroups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'template-group';

            // 添加组标题
            const groupTitle = document.createElement('div');
            groupTitle.className = 'template-group-title';
            groupTitle.textContent = group.title;
            groupDiv.appendChild(groupTitle);

            // 添加模板项
            group.templates.forEach(template => {
                const item = document.createElement('div');
                item.className = 'template-item';

                // 创建复选框
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = template.id;
                checkbox.dataset.text = template.text;

                // 创建标签
                const label = document.createElement('label');
                label.htmlFor = template.id;
                label.textContent = template.text;

                // 添加到item
                item.appendChild(checkbox);
                item.appendChild(label);

                // 复选框change事件处理
                checkbox.addEventListener('change', function() {
                    updateCommentText(approvalComment);
                });

                groupDiv.appendChild(item);
            });

            templatePanel.appendChild(groupDiv);
        });

        // 添加清空按钮
        const clearButton = document.createElement('button');
        clearButton.className = 'layui-btn layui-btn-primary layui-btn-sm';
        clearButton.textContent = '清空模板选择';
        clearButton.style.marginTop = '10px';
        clearButton.addEventListener('click', function() {
            // 取消所有复选框选中状态
            templatePanel.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            // 更新评论文本
            updateCommentText(approvalComment);
        });

        templatePanel.appendChild(clearButton);

        // 找到合适的位置插入模板面板
        const commentTextarea = approvalComment.closest('.layui-form-item');
        commentTextarea.parentNode.insertBefore(templatePanel, commentTextarea.nextSibling);

        console.log('模板面板已添加');
    }

    // 更新评论文本
    function updateCommentText(approvalComment) {
        // 获取所有选中的复选框
        const checkedBoxes = document.querySelectorAll('.template-panel input[type="checkbox"]:checked');

        if (checkedBoxes.length === 0) {
            // 如果没有选中任何模板，则清空文本
            approvalComment.value = '';
            return;
        }

        // 构建评论文本
        let commentText = '';
        checkedBoxes.forEach((checkbox, index) => {
            commentText += (index + 1) + '、' + checkbox.dataset.text;
            if (index < checkedBoxes.length - 1) {
                commentText += '；';
            }
        });

        // 更新评论文本区域
        approvalComment.value = commentText;

        // 模拟触发input事件，确保表单验证能够正确处理
        const event = new Event('input', { bubbles: true });
        approvalComment.dispatchEvent(event);
    }

    // 检测页面上是否已有审核弹窗
    function checkExistingApprovalForm() {
        const approvalForm = document.querySelector('.form-comments');
        const approvalComment = document.querySelector('#approval-comment');

        if (approvalForm && approvalComment && !document.querySelector('.template-panel')) {
            console.log('页面加载时已有审核弹窗，添加模板面板');
            addTemplatePanel(approvalForm, approvalComment);
        }
    }

    // 页面加载后检查是否已有审核弹窗
    window.addEventListener('load', checkExistingApprovalForm);

    // 也可以在DOMContentLoaded时检查
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        checkExistingApprovalForm();
    } else {
        document.addEventListener('DOMContentLoaded', checkExistingApprovalForm);
    }

    // 在iframe加载完成后也进行检查
    document.addEventListener('iframe-loaded', function() {
        setTimeout(checkExistingApprovalForm, 500);
    });

    // 监听特定的事件，例如点击"审核"按钮
    document.addEventListener('click', function(e) {
        if (e.target.matches('.approval') || e.target.closest('.approval')) {
            console.log('点击了审核按钮，等待弹窗出现');
            // 延迟检查，给弹窗出现留出时间
            setTimeout(checkExistingApprovalForm, 1000);
        }
    });
})();
