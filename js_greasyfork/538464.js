// ==UserScript==
// @name         Bangumi Anti-敏感词
// @description  自动在敏感词中间插入零宽空格。
// @version      1.0.3
// @author       wataame
// @match        *://bgm.tv/*
// @match        *://chii.in/*
// @match        *://bangumi.tv/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1389779
// @downloadURL https://update.greasyfork.org/scripts/538464/Bangumi%20Anti-%E6%95%8F%E6%84%9F%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/538464/Bangumi%20Anti-%E6%95%8F%E6%84%9F%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 内置敏感词库
    const DEFAULT_WORDS = [
        "白粉", "香艳", "习近平", "服务中心", "李克强", "支那", "前列腺",
        "办证", "辦證", "毕业证", "畢業證", "冰毒", "安乐死", "腾讯", "隐形眼镜",
        "聊天记录", "枪", "电动车", "医院", "烟草", "早泄", "精神病", "毒枭",
        "春节", "当场死亡", "步枪", "步槍", "春药", "春藥", "大发", "大發",
        "大麻", "代开", "代開", "迷药", "代考", "贷款", "貸款", "发票", "發票",
        "海洛因", "妓女", "可卡因", "批发", "批發", "皮肤病", "皮膚病", "嫖娼",
        "窃听器", "竊听器", "上门服务", "上門服务", "商铺", "商鋪", "手枪", "手槍",
        "铁枪", "鐵枪", "钢枪", "鋼枪", "特殊服务", "特殊服務", "騰訊", "罂粟",
        "牛皮癣", "甲状腺", "假钞", "香烟", "香煙", "学位证", "學位證",
        "摇头丸", "搖頭丸", "援交", "找小姐", "找小妹", "作弊", "v信",
        "医疗政策", "迷魂药", "迷情粉", "迷藥", "麻醉药", "肛门", "麻果", "麻古",
        "假币", "私人侦探", "提现", "借腹生子", "代孕", "客服电话", "刻章",
        "套牌车", "麻将机", "走私"
    ];

    // 零宽空格字符
    const ZERO_WIDTH_SPACE = '\u200B';

    // 直接使用内置词库
    const sensitiveWords = DEFAULT_WORDS;

    // 处理敏感词
    function processSensitiveWords(text) {
        let result = text;
        if (!Array.isArray(sensitiveWords)) {
            console.warn('Sensitive words list is not an array.');
            return text; // Return original text if words list is invalid
        }
        sensitiveWords.forEach(word => {
            if (typeof word === 'string' && word.length > 1) {
                try {
                    const mid = Math.floor(word.length / 2);
                    const replacement = word.slice(0, mid) + ZERO_WIDTH_SPACE + word.slice(mid);
                    // 确保word中的特殊正则字符被转义
                    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    result = result.replace(new RegExp(escapedWord, 'g'), replacement);
                } catch (e) {
                    console.error(`Error processing word "${word}":`, e);
                }
            }
        });
        return result;
    }

    // 监听输入框
    function bindInputs() {
        const selectors = [
            '#title', '#content', '#tpc_content',
            '#comment', 'textarea', 'input[type="text"]'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (element.dataset.sensitiveProcessed) return; // 避免重复绑定
                element.dataset.sensitiveProcessed = 'true';

                element.addEventListener('blur', function() {
                    const processed = processSensitiveWords(this.value);
                    if (processed !== this.value) {
                        this.value = processed;
                    }
                });
            });
        });
    }

    // 监听页面变化
    function observeChanges() {
        const observer = new MutationObserver(() => bindInputs());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 初始化
    function init() {
        bindInputs();
        observeChanges();
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
