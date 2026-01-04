// ==UserScript==
// @name         Specific Chinese text substitution
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动替换网页中的汉字
// @author       ralue
// @match        https://www.h3yun.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538119/Specific%20Chinese%20text%20substitution.user.js
// @updateURL https://update.greasyfork.org/scripts/538119/Specific%20Chinese%20text%20substitution.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        replacements: {
            // 固定词汇翻译
            '全部': 'All',
            '新增': 'Add',
            '导入': 'Import',
            '导出': 'Export',
            '删除': 'Delete',
            '打印二维码': 'Print QR CodeTitle',
            '刷新': 'Refresh',
            '操作记录': 'Operation Log',
            '显示': 'Display',
            '筛选': 'Filter',
            '序号': 'Serial Number',
            '数据标题': 'Date Title',
            '流程状态': 'Process Status',
            '统计': 'Statistics',
            '求和': 'Sum',
            '草稿': 'Draft',
            '已生效': 'Effective',
            '进行中': 'In Progress',
            '已取消': 'Canceled',
            '20 条/页': '20 Record/Page',
            '详情': 'Details',
            '编辑': 'Edit',
            '复制': 'Copy',
            '打印': 'Print',
            '流程日志': 'Process Log',
            '评论': 'Comments',
            '流程详情': 'Process Details',
            '结束': 'End',
            '已审批': 'Approved',
            '同意': 'Agree',
            '提交': 'Submit',
            '跳至': 'Jump to',
            '页': 'Page',
            // 动态模式翻译
            patterns: [
                {
                    regex: /共 (\d+) 条/,  // 捕获数字
                    replace: 'Total $1 Record'  // $1表示捕获的数字
                },
                {
                regex: /(\d+) 条\/页/,
                replace: 'Total $1 Record'

                }
            ]
        },
        excludeSelectors: [
            'input',
            'textarea',
            '[data-no-translate]'
        ]
    };

    const staticRegex = new RegExp(
        Object.keys(config.replacements)
            .filter(k => k !== 'patterns')
            .join('|'),
        'g'
    );

    function dynamicReplacer(text) {
        config.replacements.patterns.forEach(({ regex, replace }) => {
            text = text.replace(regex, replace);
        });

        return text.replace(staticRegex, match =>
            config.replacements[match]
        );
    }

    function shouldSkip(node) {
        return config.excludeSelectors.some(selector =>
            node.parentElement.closest(selector)
        );
    }

    function replaceText() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            { acceptNode: node =>
                shouldSkip(node) ?
                NodeFilter.FILTER_REJECT :
                NodeFilter.FILTER_ACCEPT
            }
        );

        let textNode;
        while ((textNode = walker.nextNode())) {
            const newText = dynamicReplacer(textNode.nodeValue);
            if (newText !== textNode.nodeValue) {
                textNode.nodeValue = newText;
            }
        }
    }

    const observer = new MutationObserver(replaceText);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true
    });

    replaceText();
})();