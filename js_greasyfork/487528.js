// ==UserScript==
// @name         Replace Dropdown Lists for Bangumi
// @name:zh-CN   bangumi下拉列表排序
// @namespace    https://github.com/Adachi-Git/ReplaceDropdownListsForBangumi
// @version      0.6
// @description  调整页面上的下拉列表选项顺序，保留原本的默认值，并按首字母排序，并且使用懒加载功能
// @author       Adachi
// @match        *://bangumi.tv/subject/*
// @match        *://bgm.tv/subject/*
// @match        *://chii.in/subject/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487528/Replace%20Dropdown%20Lists%20for%20Bangumi.user.js
// @updateURL https://update.greasyfork.org/scripts/487528/Replace%20Dropdown%20Lists%20for%20Bangumi.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var delay = 2000; // 设置延迟执行时间，单位是毫秒

    // 汉字拼音首字母映射表
    var pinyinMap = {
        '原': 'Y',
        '总': 'Z',
        '导': 'D',
        '副': 'F',
        '脚': 'J',
        '分': 'F',
        '主': 'Z',
        '演': 'Y',
        '音': 'Y',
        '人': 'R',
        '构': 'G',
        '系': 'X',
        '美': 'M',
        '色': 'S',
        '机': 'J',
        '道': 'D',
        '作': 'Z',
        '动': 'D',
        '摄': 'S',
        'C': 'C',
        '3': '3',
        '监': 'J',
        '第': 'D',
        'O': 'O',
        '制': 'Z',
        '背': 'B',
        '数': 'S',
        '剪': 'J',
        '插': 'C',
        '企': 'Q',
        '宣': 'X',
        '录': 'L',
        '製': 'Z',
        '设': 'S',
        '特': 'T',
        '配': 'P',
        '联': 'L',
        '补': 'B',
        '执': 'Z',
        '助': 'Z',
        '台': 'T',
        '后': 'H',
        '协': 'X',
        '连': 'L',
        '译': 'Y',
        '客': 'K',
        '文': 'W',
        '出': 'C',
        '改': 'G',
        '前': 'Q',
        '续': 'X',
        '全': 'Q',
        '番': 'F',
        '相': 'X',
        '不': 'B',
        '衍': 'Y',
        '角': 'J',
        '其': 'Q',
        '开': 'K',
        '发': 'F',
        '游': 'Y',
        '剧': 'J',
        'S': 'S',
        '程': 'C',
        'Q': 'Q',
        '关': 'G',
        '创': 'C',
        '编': 'B',
        '共': 'G',
        '故': 'G',
        '艺': 'Y',
        '厂': 'C',
        '片': 'P',
        '印': 'Y',
        '广': 'G',
    };

    // 定义一个函数来处理下拉列表的逻辑
    function adjustSelectOptions(select) {
        // 保存原本的默认值
        var defaultValue = select.value;

        // 获取所有选项并转换为数组
        var optionsArray = Array.from(select.options);

        // 移除所有选项
        optionsArray.forEach(function(option) {
            select.remove(option.index);
        });

        // 按汉字的拼音首字母排序选项数组
        optionsArray.sort(function(a, b) {
            var pinyinA = pinyinMap[a.textContent[0]];
            var pinyinB = pinyinMap[b.textContent[0]];

            // 如果拼音首字母不存在，则将其视为 -Infinity，确保空值被放到列表的最上面
            pinyinA = pinyinA ? pinyinA : -Infinity;
            pinyinB = pinyinB ? pinyinB : -Infinity;

            // 排序时忽略空值
            if (pinyinA === -Infinity && pinyinB === -Infinity) {
                return 0;
            } else if (pinyinA === -Infinity) {
                return -1;
            } else if (pinyinB === -Infinity) {
                return 1;
            } else {
                return pinyinA.localeCompare(pinyinB);
            }
        });

        // 将重新排序后的选项重新添加到下拉列表中，并在选项文本前添加拼音首字母
        optionsArray.forEach(function(option) {
            var originalText = option.textContent;
            var pinyin = pinyinMap[originalText[0]];

            // 如果拼音首字母存在，则在文本前添加拼音首字母；否则只保留原始文本
            option.textContent = (pinyin ? pinyin + ' - ' : '') + originalText;
            select.add(option);
        });

        // 保留原本的默认值
        select.value = defaultValue;
    }

    // 延迟执行处理函数
    setTimeout(function() {
        // 查找可见的下拉列表并处理它们
        var selects = document.querySelectorAll('select[name^="infoArr"]:not([data-adjusted])');
        selects.forEach(function(select) {
            if (isElementInViewport(select)) {
                adjustSelectOptions(select);
                select.setAttribute('data-adjusted', 'true');
            }
        });
    }, delay);

    // 添加 DOM 变化的监听器
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 查找新增的下拉列表并处理
            var newSelects = mutation.target.querySelectorAll('select[name^="infoArr"]:not([data-adjusted])');
            newSelects.forEach(function(newSelect) {
                if (isElementInViewport(newSelect)) {
                    adjustSelectOptions(newSelect);
                    newSelect.setAttribute('data-adjusted', 'true');
                }
            });
        });
    });

    // 监听整个文档的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 添加滚动事件监听器
    window.addEventListener('scroll', function() {
        // 查找尚未处理的下拉列表
        var selects = document.querySelectorAll('select[name^="infoArr"]:not([data-adjusted])');
        selects.forEach(function(select) {
            // 如果该下拉列表在视图内，进行处理并标记为已处理
            if (isElementInViewport(select)) {
                adjustSelectOptions(select);
                select.setAttribute('data-adjusted', 'true');
            }
        });
    });

    // 检查元素是否在视图内
    function isElementInViewport(element) {
        var rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
})();