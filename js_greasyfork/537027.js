// ==UserScript==
// @name         图站标签汉化&替换
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  支持Danbooru和Sankaku，未翻译的标签添加背景色
// @author       deepseek
// @match        https://danbooru.donmai.us/posts/*
// @match        https://chan.sankakucomplex.com/*/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @grant        GM_addStyle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/537027/%E5%9B%BE%E7%AB%99%E6%A0%87%E7%AD%BE%E6%B1%89%E5%8C%96%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/537027/%E5%9B%BE%E7%AB%99%E6%A0%87%E7%AD%BE%E6%B1%89%E5%8C%96%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局样式注入
    GM_addStyle(`
        .unreplaced-tag-highlight {
            background-color: #ffeb3b !important;
            border-radius: 3px !important;
            padding: 1px 3px !important;
        }
    `);

    // ======================
    // 用户配置区
    // ======================
    const CONFIG = {
        sites: {
            // Danbooru配置
            'danbooru.donmai.us': {
                textarea: '#post_tag_string',
                tagContainer: 'div.tag-list.categorized-tag-list',
                categoryConfig: {
                    'Artist': { display: '艺术家', class: 'artist' },
                    'Copyright': { display: '版权信息', class: 'copyright' },
                    'Characters': { display: '角色', class: 'character' },
                    'Character': { display: '角色', class: 'character' },
                    'General': { display: '常规', class: 'general' },
                    'Meta': { display: '元信息', class: 'meta' }
                },
                formatConverter: {
                    pageToConfig: pageTag => pageTag.replace(/ /g, '_'),
                    configToPage: configTag => configTag
                }
            },

            // Sankaku配置
            'chan.sankakucomplex.com': {
                textarea: '#post_tags',
                tagContainer: '#tag-sidebar',
                categoryConfig: {
                    'Artist': { display: '艺术家', selector: 'h6' },
                    'Franchise': { display: '版权', selector: 'h6' },
                    'Character': { display: '角色', selector: 'h6' },
                    'Genre': { display: '类型', selector: 'h6' },
                    'Fashion': {display: '时尚',selector: 'h6'},
                    'Anatomy': { display: '解剖学', selector: 'h6' },
                    'Pose': { display: '姿勢', selector: 'h6' },
                    'Activity': { display: '活动', selector: 'h6' },
                    'Entity': { display: '实体', selector: 'h6' },
                    'Object': { display: '物体', selector: 'h6' },
                    'Setting': { display: '场景设定', selector: 'h6' },
                    'Medium': { display: '媒介特征', selector: 'h6' },
                    'Meta': { display: '元信息', selector: 'h6' },
                    'Automatic': { display: '自动分类', selector: 'h6' }
                },
                formatConverter: {
                    pageToConfig: pageTag => pageTag.toLowerCase().replace(/ /g, '_'),
                    configToPage: configTag => configTag
                }
            }
        },
        tags: [
            ["fox_girl", "狐狸女孩"],
            ["touhou", "东方"],
            ["touhou_project", "东方"],
            ["inaba_tewi", "因幡帝"],
        ]
    };

    // ======================
    // 核心引擎
    // ======================
    class PrecisionReplacer {
        constructor() {
            this.site = this.detectSite();
            this.config = CONFIG.sites[this.site];
            this.tagMap = new Map(CONFIG.tags);
            this.init();
        }

        detectSite() {
            return Object.keys(CONFIG.sites).find(site =>
                location.hostname.includes(site)
            );
        }

        init() {
            if (!this.config) return;
            this.executeReplacements();
            this.setupObserver();
        }

        // 主执行函数
        executeReplacements() {
            this.preserveFormatReplaceTextarea();
            this.adaptPlatformTags();
            this.replaceCategoryHeaders();
        }

        // 文本域替换（保留格式）
        preserveFormatReplaceTextarea() {
            const textarea = document.querySelector(this.config.textarea);
            if (!textarea || textarea.dataset.replaced) return;

            textarea.value = textarea.value.replace(
                /(\S+)(?=\s|$)/g,
                match => this.tagMap.get(match) || match
            );

            textarea.dataset.replaced = 'true';
        }

        // 标签替换与高亮逻辑（修复版）
        adaptPlatformTags() {
            const container = document.querySelector(this.config.tagContainer);
            if (!container || container.dataset.replaced) return;

            container.querySelectorAll('a').forEach(tag => {
                // 清除旧高亮
                if (this.site === 'danbooru.donmai.us') {
                    const li = tag.closest('li');
                    if (li) li.classList.remove('unreplaced-tag-highlight');
                } else {
                    tag.classList.remove('unreplaced-tag-highlight');
                }

                // 转换标签格式
                const pageFormat = tag.textContent.trim();
                const configFormat = this.config.formatConverter.pageToConfig(pageFormat);
                let isReplaced = false;

                // 执行替换
                if (this.tagMap.has(configFormat)) {
                    const replacement = this.tagMap.get(configFormat);
                    tag.textContent = replacement;
                    isReplaced = true;
                }

                // 仅未替换时添加高亮
                if (!isReplaced) {
                    if (this.site === 'danbooru.donmai.us') {
                        const li = tag.closest('li');
                        if (li) li.classList.add('unreplaced-tag-highlight');
                    } else {
                        tag.classList.add('unreplaced-tag-highlight');
                    }
                }
            });

            container.dataset.replaced = 'true';
        }

        // 分类标题替换
        replaceCategoryHeaders() {
            Object.entries(this.config.categoryConfig).forEach(([original, cfg]) => {
                const selector = cfg.selector || `h3.${cfg.class}-tag-list`;
                document.querySelectorAll(selector).forEach(element => {
                    if (!element.dataset.replaced && element.textContent.trim() === original) {
                        this.replaceTextNodes(element, original, cfg.display);
                        element.dataset.replaced = 'true';
                    }
                });
            });
        }

        // 安全文本替换
        replaceTextNodes(element, original, display) {
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while ((node = walker.nextNode())) {
                node.textContent = node.textContent.replace(original, display);
            }
        }

        // 动态内容监听
        setupObserver() {
            new MutationObserver(() => {
                this.executeReplacements();
            }).observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // 启动引擎
    new PrecisionReplacer();
})();