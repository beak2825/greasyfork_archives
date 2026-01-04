// ==UserScript==
// @name         微信公众号图文模板
// @version      20250905
// @description  为庞门正道微信公众号提供的快速编辑图文底部尾巴的工具。
// @author       XHXIAIEIN
// @namespace    https://greasyfork.org/zh-CN/scripts/406755
// @match        https://mp.weixin.qq.com/cgi-bin/*
// @icon         https://mp.weixin.qq.com/favicon.ico
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406755/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E6%96%87%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/406755/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E6%96%87%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================== 配置和常量 =====================
    const DEFAULT_CONFIG = {
        IMG_WIDTH: 800,
        IMG_HEIGHT: 350,
        IMG_SCROLL_X: '100%',
        IMG_SCROLL_Y: '100%',
        DEFAULT_IMAGE: 'https://mmbiz.qpic.cn/mmbiz_png/I3KJh29KMaQfkJIY6BPweepaQFk8NQ3uiahoHIP6RUQnBibkOEpkMu01ACA0zw0hRkUUqRBO4ediceoYBP58dibjGg/0?wx_fmt=png',
        TEMPLATE_COUNT: 3,
        MIN_TEMPLATE_COUNT: 1,
        MAX_TEMPLATE_COUNT: 10,
        LOAD_DELAY: 400,

        UPDATE_DELAY: 160,
        APP_NAME: 'WeChatArticleTool',
        STORAGE_KEY: 'WeChatArticleTool_Config'
    };

    // 预设文章数据
    const PRESET_ARTICLES = [
        { id: 1, title: "2025 x 秦岭博物馆设计大赛", url: "https://mp.weixin.qq.com/s/qiUZDPTyu3xhUSArj7JAeQ", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1YicXwLchfuOFlLpQbSZFqID6yIUmic8pw7nPghRNJQ6ibnydthOZMTe8E8giciaJKHO5zJ1Cn6Bdszf7Q/640?wx_fmt=png" },
        { id: 2, title: "2024 x 民生同春坊设计大赛(logo篇)", url: "https://mp.weixin.qq.com/s/LxBSZrHXkxbXbfB7xr0zqA", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1YicXwLchfuOFlLpQbSZFqIDOQvO1UxJqEOvnXQyuCmPECAiaib8MRRx10EgJ5xjOv3ickoiaG5aJOtWQA/640?wx_fmt=png" },
        { id: 3, title: "2024 x 民生同春坊设计大赛(包装篇)", url: "https://mp.weixin.qq.com/s/KDTtIsLLdaRQzI5hDva-Mw", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1YicXwLchfuOFlLpQbSZFqIDLBZvsuFJLKyOee826K6aJF0NcRibwNFTOicmhnMuEURJOa44cgY2o9xQ/640?wx_fmt=png" },
        { id: 4, title: "2024 x 丝路欢乐世界文创设计大赛", url: "https://mp.weixin.qq.com/s/Q9nLWtB8B3U8p5_Gl8pQmg", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1asBiapaqibsjGibSVc3WTExtRib1l4S0vtTLlCaRyLH85c6bk9TtNeqlibBpPbpibSwCeaTorcaI3nuVsQ/640?wx_fmt=png" },
        { id: 5, title: "2024 x 华清宫文创设计大赛", url: "https://mp.weixin.qq.com/s/5KOi7pVxGHLTNJc55122HA", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1asBiapaqibsjGibSVc3WTExtR52zZLwp7K6fdaxc5uSWPJbGOfF1ib0eEibsNoVueBpZtEQyDIUgQzWlw/640?wx_fmt=png" },
        { id: 6, title: "2023 x 人工智能Ai创意大赛", url: "https://mp.weixin.qq.com/s/LDWu_RU_VI01ugsXVx4JdQ", imageUrl: "https://mmbiz.qpic.cn/sz_mmbiz_png/I3KJh29KMaSr1wWZFqUbic4pmicrEoj5xv3IianEb5S3xwxyKGb9I8TC0RPeuGzVwTkiakMNicribibnnTyCvL7DatYZw/640?wx_fmt=png" },
        { id: 7, title: "2022 x C4D科幻设计大赛", url: "https://mp.weixin.qq.com/s/9vfORqZikB0lxupC6fje_Q", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1YicXwLchfuOFlLpQbSZFqIDTN2RE9nibOrSdzdTkSstWSag0QumyqHVaqcO95pswBxFx13FIe9ojNQ/640?wx_fmt=png" },
        { id: 8, title: "2021 x 《我和我的家乡》插画大赛", url: "https://mp.weixin.qq.com/s/Ke5tq9fz8Up8k9mNmw1FZg", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1YJJCkibFL6FtDZDChKBIuSicF746vkAI415fu5tNPZHI1WMLeyVPFiagkdWX503GPLFqztvJwrtJBlQ/640?wx_fmt=png" },
        { id: 9, title: "2021 x 控烟表情包设计大赛", url: "https://mp.weixin.qq.com/s/Jqgwz1czs8FC6F5n7Qp8Gg", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1Z88gbTnV974kQoDypzzaYmktO7O8VhNHgLRuUkLHuPpZMnZQD6k4dYXQkG3N85a4lp3rjbpCyU3A/640?wx_fmt=png" },
        { id: 10, title: "2021 x C4D卡通IP设计大赛", url: "https://mp.weixin.qq.com/s/d5_ciSfahNEeRhwqZ-ycEQ", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaQsEGT3ibsFbFgicAtqxtbpaL0OHEj63R1wxvyHf4Viak8jxiaCrd3g29gLPbpcsIIRclHic0DWHiaWWFOg/640?wx_fmt=jpeg" },
        { id: 11, title: "2020 x Kunpo 卡通IP设计大赛", url: "https://mp.weixin.qq.com/s/wn2alA5AY-LfrF7XxCqgOQ", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTXcHW5MVku99RJZujXUQcs7Dwl6WRZBpazYIPibWyM81HrgPfemkslXg/640?wx_fmt=jpeg" },
        { id: 12, title: "2020 x 自嗨锅包装设计大赛", url: "https://mp.weixin.qq.com/s/1c1nSofvsFiWu0wUUdti0A", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTtr0lk4ic4AWjeeTx8fPFibxYib4IS7v5bITu6nib7Dibh0p9OVQJIOEPcWg/640?wx_fmt=jpeg" },
        { id: 13, title: "2020 x 九寨沟文创IP设计大赛", url: "https://mp.weixin.qq.com/s/7ttllAd7YwDTnvqlRCaqtA", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTwJVuWe0YtNMNgvvvjtWhg3uEfO2dYOE2YVy7Q6ic12jpRibWwcWVXADg/640?wx_fmt=jpeg" },
        { id: 14, title: "2020 x 众邦银行卡面设计大赛", url: "https://mp.weixin.qq.com/s/2hRGry776G7NK-7vNoR-xQ", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedT4hqH7ic25KhypwZGBfSsw6Yww0oDaD00jSlic96MZVyAtN3VQrnhHCyA/640?wx_fmt=jpeg" },
        { id: 15, title: "2020 x C4D设计大赛", url: "https://mp.weixin.qq.com/s/PRTSxeRxyVwhlU17Uy_UPw", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTxOoKmo3omdDHhytm5a2ibltG9N7Ch4L1FZakDmmJ69zQRlobjYonsYw/640?wx_fmt=jpeg" },
        { id: 16, title: "2020 x 重庆禁烟海报设计大赛", url: "https://mp.weixin.qq.com/s/rYCAJa1p7aHENbYHwtnh7Q", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedT0mQn64MdhrNDxN7oIic0rcFRDFeFkJaX6sYjf4MEsT5jExhhZA0LmPg/640?wx_fmt=jpeg" },
        { id: 17, title: "2019 x 平安银行卡面设计大赛", url: "https://mp.weixin.qq.com/s/hApQXhG5pX_xQIPWLFzmiw", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTPeDknVibJAAel0RtOARGyw5UIhyX92icoicTbDFtm8oOvfZIPHffJ5w5A/640?wx_fmt=jpeg" },
        { id: 18, title: "2019 x 999感冒灵海报设计大赛", url: "https://mp.weixin.qq.com/s/IGrTpgVG_qppfQFz_f_mtA", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTJib2G63BicKShaLZMlYUV7EpK1AHyeYBSQ1RNsr1NEm7nCIKXxT1TKug/640?wx_fmt=jpeg" },
        { id: 19, title: "2019 x 台历插画设计大赛", url: "https://mp.weixin.qq.com/s/5CG_Is5zTPOJzauHUfDOOw", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTJhibm1UwfZFMFQI5Vcklk4fjocvRZlWkVrmibNFe54ibUiagfx7NVFFAfw/640?wx_fmt=jpeg" },
        { id: 20, title: "2018 x WIS面膜包装设计大赛", url: "https://mp.weixin.qq.com/s/bsEXN-8gGJUOllAkyf4nSg", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTyIYOR6lVxAmzOvWuVicQvRzEr8jYenySly496KrXUlvTjmY1XuTHvPA/640?wx_fmt=jpeg" },
        { id: 21, title: "2018 x 书籍封面设计大赛", url: "https://mp.weixin.qq.com/s/_EaKVgjjvPdcNnCf4L-yUA", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTePGxZpGQFVTUR15EAJtwl1kicNZSRFQn97y7UG1Knb6oiaqNE6qbsuGA/640?wx_fmt=jpeg" },
        { id: 22, title: "2018 x 蜻蜓FM方文山歌词创作大赛", url: "https://mp.weixin.qq.com/s/1j68qVip8b0vCF_ZwxmyNg", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTNyJzWCicU97ZaupbrkQHKUraAooSD3QfgzRibrD0ib7ib6jwVlveHSibRKg/640?wx_fmt=jpeg" },
        { id: 23, title: "2018 x 网易吃鸡游戏海报设计大赛", url: "https://mp.weixin.qq.com/s/2WeQHIgOFU05PjoQiigIVA", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTckrmJLLYjESqCiaibUz6PYXzex4Bdn4897qKhVsdGgC3OK2LNicgDCWAw/640?wx_fmt=jpeg" },
        { id: 24, title: "2017 x 异形电影海报设计大赛", url: "https://mp.weixin.qq.com/s/bxbzlM1PevHGzPOokNg04g", imageUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/I3KJh29KMaTvM0rwNwVN9rKQR5ALibedTktxib40icbbEhwAOppGBdg2lAIa4v6LNLPRMInNpoYVVcnv1fm2iaPicng/640?wx_fmt=jpeg" },
        { id: 25, title: "2021 x 小鳄鱼摄影大赛", url: "https://mp.weixin.qq.com/s/bfH19-Eb-so-p_Z-_o_2CA", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/I3KJh29KMaT3P1AibOBUjE2sMM0thSticHggQMKcsu1z7s91iamhnkACopXbEqAr3le7vhib2B78nOUVhT9om01dQQ/640?wx_fmt=png" },
        { id: 26, title: "2022 x 手机摄影比赛", url: "https://mp.weixin.qq.com/s/Yw1sku9iPUF43ps_fduzjQ", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1an8VjoYcnxaNIHu3rWWNmxnHJZ3Ignkmf6ANjyfQGCibb12MMtddVIM9eBNicca6ibLwbDzaa2nrRJg/640?wx_fmt=png" },
        { id: 27, title: "2024 x 小鳄鱼摄影大赛", url: "https://mp.weixin.qq.com/s/NLRm8xwIFnQLJS--lhd-dw", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1YicXwLchfuOFlLpQbSZFqIDu17Zbia4NJfhT3JgqZRYzWMD1afWgiczwt781v0tb5dzNAawbhsficaFg/640?wx_fmt=png" },
        { id: 28, title: "2025 x 马达微森摄影大赛", url: "https://mp.weixin.qq.com/s/nsVqIGg33nNmntewzZiIiQ", imageUrl: "https://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1YicXwLchfuOFlLpQbSZFqIDxiaw38MG8lnel0QGjiaHibTuD8gxPIPz1FRjw42TfUh1PPOiahE4Kpkk9Q/640?wx_fmt=png" }
    ];

    // 可动态修改的配置
    let CONFIG = { ...DEFAULT_CONFIG };

    const SELECTORS = {
        editor: '#ueditor_0',
        editorContent: '.view',
        svgElements: 'svg',
        subMenu: '.weui-desktop-sub-menu',
        title: '#title',
        layoutContainer: '.XHXIAIEIN-layout',
        iframe: '.XHXIAIEIN-iframe'
    };

    const CSS_CLASSES = {
        layout: 'XHXIAIEIN-layout',
        iframe: 'XHXIAIEIN-iframe',
        viewcode: 'XHXIAIEIN-viewcode',
        smallInput: 'small-input',
        sizeInputs: 'size-inputs'
    };

    // ===================== 配置管理器 =====================
    class ConfigManager {
        static loadConfig() {

            const stored = localStorage.getItem(DEFAULT_CONFIG.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                Object.assign(CONFIG, parsed);
                Utils.log(`已加载配置: 模板数量=${CONFIG.TEMPLATE_COUNT}`);
            }

        }

        static saveConfig() {

            const configToSave = {
                TEMPLATE_COUNT: CONFIG.TEMPLATE_COUNT,
                IMG_WIDTH: CONFIG.IMG_WIDTH,
                IMG_HEIGHT: CONFIG.IMG_HEIGHT,
                IMG_SCROLL_X: CONFIG.IMG_SCROLL_X,
                IMG_SCROLL_Y: CONFIG.IMG_SCROLL_Y,
                DEFAULT_IMAGE: CONFIG.DEFAULT_IMAGE
            };
            localStorage.setItem(DEFAULT_CONFIG.STORAGE_KEY, JSON.stringify(configToSave));
            Utils.log('配置已保存');
        }

        static updateTemplateCount(newCount) {
            const count = Math.max(
                DEFAULT_CONFIG.MIN_TEMPLATE_COUNT,
                Math.min(DEFAULT_CONFIG.MAX_TEMPLATE_COUNT, parseInt(newCount) || DEFAULT_CONFIG.TEMPLATE_COUNT)
            );

            if (count !== CONFIG.TEMPLATE_COUNT) {
                CONFIG.TEMPLATE_COUNT = count;
                this.saveConfig();
                Utils.log(`模板数量已更新为: ${count}`);
                return true;
            }
            return false;
        }

        static resetConfig() {
            Object.assign(CONFIG, DEFAULT_CONFIG);
            localStorage.removeItem(DEFAULT_CONFIG.STORAGE_KEY);
            Utils.log('配置已重置');
        }
    }

    // ===================== 工具函数库 =====================
    class Utils {
        static getUrlParams(name) {
            const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            const result = window.location.search.substr(1).match(reg);
            return result ? decodeURIComponent(result[2]) : null;
        }

        static getTodayDate(format) {
            const date = new Date();
            const formatMap = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds()
            };

            let result = format;
            for (const [pattern, value] of Object.entries(formatMap)) {
                if (new RegExp(`(${pattern})`).test(result)) {
                    const replacement = RegExp.$1.length === 1 ?
                        value.toString() :
                        value.toString().padStart(RegExp.$1.length, '0');
                    result = result.replace(RegExp.$1, replacement);
                }
            }
            return result;
        }

        static sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        static extractBackgroundUrl(htmlString) {
            // 尝试多种模式匹配背景图片URL
            const patterns = [
                /background-image:\s*url\(['"]?([^'")]+)['"]?\)/gi,
                /background:\s*[^;]*url\(['"]?([^'")]+)['"]?\)/gi,
                /url\(['"]?([^'")]+)['"]?\)/gi
            ];

            for (const pattern of patterns) {
                const matches = htmlString.match(pattern);
                if (matches && matches.length > 0) {
                    // 提取第一个匹配的URL
                    const urlMatch = matches[0].match(/url\(['"]?([^'")]+)['"]?\)/);
                    if (urlMatch && urlMatch[1]) {
                        return urlMatch[1].trim();
                    }
                }
            }

            return '';
        }

        static extractArticleUrl(element) {
            const anchor = element.querySelector('a[name="XHXIAIEIN-url"]');
            return anchor ? anchor.getAttribute('href') : null;
        }

        static createElement(tag, className = '', attributes = {}) {
            const element = document.createElement(tag);
            if (className) element.className = className;

            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });

            return element;
        }

        static createElementFromHTML(htmlString) {
            const div = document.createElement('div');
            div.innerHTML = htmlString.trim();
            return div.firstChild;
        }

        static log(message, type = 'info') {
            const prefix = `[${CONFIG?.APP_NAME || DEFAULT_CONFIG.APP_NAME}]`;
            const timestamp = new Date().toLocaleTimeString();
            console[type](`${prefix} ${timestamp}: ${message}`);
        }

        static getChineseNumber(index) {
            const numbers = [
                '一', '二', '三', '四', '五',
                '六', '七', '八', '九', '十'
            ];
            return numbers[index - 1] || `第${index}`;
        }

        static generateRangeArray(count) {
            return Array.from({ length: count }, (_, i) => i + 1);
        }

        static debounce(func, wait) {
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
    }

    // ===================== 模板数据管理 =====================
    class TemplateDataManager {
        constructor() {
            this.templates = new Map();
            this.initialize();
        }

        initialize() {
            Utils.generateRangeArray(CONFIG.TEMPLATE_COUNT).forEach(index => {
                this.templates.set(index, this.createDefaultTemplate(index));
            });
            Utils.log(`初始化了 ${CONFIG.TEMPLATE_COUNT} 个模板`);
        }

        updateTemplateCount(newCount) {
            const oldCount = this.templates.size;

            if (newCount > oldCount) {
                // 添加新模板
                for (let i = oldCount + 1; i <= newCount; i++) {
                    this.templates.set(i, this.createDefaultTemplate(i));
                }
            } else if (newCount < oldCount) {
                // 删除多余模板
                for (let i = oldCount; i > newCount; i--) {
                    this.templates.delete(i);
                }
            }

            Utils.log(`模板数量从 ${oldCount} 更新为 ${newCount}`);
        }

        createDefaultTemplate(index) {
            return {
                id: index,
                title: '',
                text: `第 ${index} 篇文章`,
                url: '',
                img: CONFIG.DEFAULT_IMAGE,
                width: CONFIG.IMG_WIDTH,
                height: CONFIG.IMG_HEIGHT,
                scrollX: CONFIG.IMG_SCROLL_X,
                scrollY: CONFIG.IMG_SCROLL_Y,
                scale: 100,
                locked: false,
                collapsed: true
            };
        }

        getTemplate(index) {
            return this.templates.get(index);
        }

        updateTemplate(index, updates) {
            if (!this.templates.has(index)) {
                Utils.log(`模板 ${index} 不存在`, 'warn');
                return false;
            }

            const template = this.templates.get(index);
            Object.assign(template, updates);
            Utils.log(`更新模板 ${index}: ${Object.keys(updates).join(', ')}`);
            return true;
        }

        moveTemplate(fromIndex, toIndex) {
            const templates = Array.from(this.templates.entries());
            const [removed] = templates.splice(fromIndex - 1, 1);
            templates.splice(toIndex - 1, 0, removed);

            this.templates.clear();
            templates.forEach(([_, template], i) => {
                template.id = i + 1;
                this.templates.set(i + 1, template);
            });

            Utils.log(`模板从位置 ${fromIndex} 移动到 ${toIndex}`);
        }

        toggleTemplateLock(index) {
            const template = this.getTemplate(index);
            if (template) {
                template.locked = !template.locked;
                Utils.log(`模板 ${index} ${template.locked ? '已锁定' : '已解锁'}`);
                return template.locked;
            }
            return false;
        }

        getAllTemplates() {
            return Array.from(this.templates.values());
        }

        resetTemplate(index) {
            if (this.templates.has(index)) {
                this.templates.set(index, this.createDefaultTemplate(index));
                Utils.log(`重置模板 ${index}`);
                return true;
            }
            return false;
        }
    }

    // ===================== DOM 操作管理 =====================
    class DOMManager {
        constructor() {
            this.cache = new Map();
            this.scrollTimeout = null;
        }

        $(selector, useCache = true) {
            if (useCache && this.cache.has(selector)) {
                const cached = this.cache.get(selector);
                if (document.contains(cached)) {
                    return cached;
                }
                this.cache.delete(selector);
            }

            const element = document.querySelector(selector);
            if (element && useCache) {
                this.cache.set(selector, element);
            }
            return element;
        }

        $all(selector) {
            return document.querySelectorAll(selector);
        }

        getEditorContent() {
            return $(SELECTORS.editor)?.contents?.() || null;
        }

        getSVGElements() {
            // 使用缓存避免重复查找
            if (this.cache.has('svgElements')) {
                const cachedElements = this.cache.get('svgElements');
                // 验证缓存元素是否仍然有效
                if (cachedElements && cachedElements.length > 0 &&
                    this.isElementValid(cachedElements[0])) {
                    return cachedElements;
                }
            }

            // 尝试多种方式获取SVG元素
            let svgElements = this.findSVGElementsDirectly();

            if (!svgElements || svgElements.length === 0) {
                const editor = this.getEditorContent();
                svgElements = editor ? editor.find(SELECTORS.svgElements) : [];
            }

            // 缓存SVG元素
            if (svgElements && svgElements.length > 0) {
                this.cache.set('svgElements', svgElements);
            }

            return svgElements || [];
        }

        findSVGElementsDirectly() {
            try {
                const editor = this.getEditorContent();
                if (!editor || !editor[0]) return [];

                // 直接通过DOM查询
                const editorDoc = editor[0].ownerDocument || editor[0];
                return $(editorDoc.querySelectorAll(SELECTORS.svgElements));
            } catch (error) {
                Utils.log(`直接查找SVG元素失败: ${error.message}`, 'warn');
                return [];
            }
        }

        isElementValid(element) {
            try {
                return element && element.length > 0 &&
                       element[0] && element[0].ownerDocument &&
                       element[0].ownerDocument.contains(element[0]);
            } catch (error) {
                return false;
            }
        }

        clearCache() {
            this.cache.clear();
            Utils.log('DOM缓存已清空');
        }

        destroy() {
            // 清理滚动事件监听器
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = null;
            }

            // 清理滚动事件绑定
            const editor = this.getEditorContent();
            if (editor && editor[0]) {
                editor.off('scroll');
            }
            $(window).off('scroll');

            // 清理缓存
            this.clearCache();

            Utils.log('DOM管理器已销毁');
        }

        bindScrollEvents() {
            // 监听页面滚动事件
            const scrollHandler = () => {
                // 清除SVG元素缓存，强制重新获取
                this.cache.delete('svgElements');

                // 延迟执行，避免频繁更新
                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = setTimeout(() => {
                    this.refreshAfterScroll();
                }, 100);
            };

            // 监听编辑器内容区域的滚动
            const editor = this.getEditorContent();
            if (editor && editor[0]) {
                editor.on('scroll', scrollHandler);
            }

            // 监听主窗口滚动
            $(window).on('scroll', scrollHandler);

            Utils.log('滚动事件监听器已绑定');
        }

        refreshAfterScroll() {
            try {
                // 重新获取SVG元素并更新文章位置
                const svgElements = this.getSVGElements();
                if (svgElements && svgElements.length > 0) {
                    // 更新所有文章的位置
                    for (let i = 1; i <= svgElements.length; i++) {
                        if (window.WeChatArticleTool && window.WeChatArticleTool.articleManager) {
                            window.WeChatArticleTool.articleManager.updateArticlePosition(i);
                        }
                    }
                    Utils.log(`滚动后文章位置已更新，共 ${svgElements.length} 个文章`);
                } else {
                    Utils.log('滚动后未找到SVG元素，可能需要重新生成内容', 'warn');
                    // 如果找不到SVG元素，尝试重新生成内容
                    if (window.WeChatArticleTool && window.WeChatArticleTool.articleManager) {
                        window.WeChatArticleTool.articleManager.refreshInformation();
                    }
                }
            } catch (error) {
                Utils.log(`滚动后刷新失败: ${error.message}`, 'error');
            }
        }

        safeExecute(callback, errorMessage = '执行DOM操作时出错') {
            try {
                return callback();
            } catch (error) {
                Utils.log(`${errorMessage}: ${error.message}`, 'error');
                return null;
            }
        }
    }

    // ===================== HTML模板生成器 =====================
    class HTMLTemplateGenerator {
        static generateMainLayout() {
            return `
                <div class="${CSS_CLASSES.layout}">
                    <div class="tool-header">
                        <h3 class="tool-title">文章尾巴工具</h3>
                        <div class="template-count-controls">
                            <button class="count-btn" id="template-count-minus" title="减少模板">−</button>
                            <span class="count-display" id="template-display-count">${CONFIG.TEMPLATE_COUNT}</span>
                            <button class="count-btn" id="template-count-plus" title="增加模板">+</button>
                    </div>
                    </div>
                    <div class="tool-content" id="dynamic-content">
                        ${this.generateArticleInputs()}
                        ${this.generateAdvancedSection()}
                    </div>
                    ${this.generateHiddenIframes()}
                    ${this.generateStyles()}
                </div>
            `;
        }


        static generateArticleInputs() {
            return `
                <div class="articles-section">
                        ${Utils.generateRangeArray(CONFIG.TEMPLATE_COUNT).map(index =>
                            this.generateArticleCard(index)
                        ).join('')}
                </div>
            `;
        }

        static generateArticleCard(index) {
            return `
                <div class="article-module" data-template-index="${index}">
                    <div class="frm_control_group">
                        <div class="input-header">
                            <label id="status-${index}" class="weui-desktop-tips">第${Utils.getChineseNumber(index)}篇文章链接</label>
                            <div class="module-actions">
                                <span class="status-dot" id="status-dot-${index}"></span>
                                <button class="action-btn lock-btn" id="lock-btn-${index}" data-action="toggleLock" data-index="${index}" title="锁定/解锁"></button>
                                <button class="action-btn move-up-btn" data-action="moveUp" data-index="${index}" title="上移"></button>
                                <button class="action-btn move-down-btn" data-action="moveDown" data-index="${index}" title="下移"></button>
                                <button class="action-btn expand-btn" id="expand-btn-${index}" data-action="toggleExpand" data-index="${index}" title="展开/收起"></button>
                            </div>
                        </div>
                    <div class="input_group"><div><input type="text" class="weui-desktop-form__input" id="input-${index}" name="input-${index}" placeholder="文章链接"></div></div>
                    <div class="input_group"><div><input type="text" class="weui-desktop-form__input" id="input-title-${index}" placeholder="文章标题"></div></div>
                    <div class="input_group"><div><input type="text" class="weui-desktop-form__input" id="input-img${index}" placeholder="图片地址"></div></div>
                    <div class="advanced-section" id="advanced-${index}" style="display: none;">
                        <div class="input_group">
                        <div class="size-inputs">
                            <input type="number" class="weui-desktop-form__input small-input" id="input-img${index}-width" placeholder="宽度">
                            <input type="number" class="weui-desktop-form__input small-input" id="input-img${index}-height" placeholder="高度">
                            <input type="number" class="weui-desktop-form__input small-input" id="input-img${index}-offsetX" placeholder="图片X">
                            <input type="number" class="weui-desktop-form__input small-input" id="input-img${index}-offsetY" placeholder="图片Y">
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
            `;
        }

        static generateImagePreview() {
            return `
                <div class="subsection">
                    <div class="subsection-header">图片信息</div>
                    <div class="code-viewer" id="viewcode-img"></div>
                </div>
            `;
        }

        static generateAdvancedSection() {
            return `
                <div class="frm_control_group">
                    <label class="weui-desktop-tips">当前文章的图片</label>
                    <pre class="XHXIAIEIN-viewcode" id="viewcode-img"><code></code></pre>
                </div>
                <div class="frm_control_group">
                    <label class="weui-desktop-tips">正文源码</label>
                    <pre class="XHXIAIEIN-viewcode" id="viewcode-html"><code></code></pre>
                </div>
                <div class="frm_control_group">
                    <label id="status-overwrite" class="weui-desktop-tips">源码覆写</label>
                    <div>
                        <input type="text" class="weui-desktop-form__input" id="input-overwrite" name="input-overwrite" placeholder="填入新的源码">
                    </div>
                </div>
                <div class="frm_control_group">
                    <div>
                        <button class="batch-import-btn" id="batch-import-btn" title="批量导入预设文章">批量导入</button>
                    </div>
                </div>
            `;
        }



        static generateHiddenIframes() {
            return `
                <div id="iframe-container">
                    ${Utils.generateRangeArray(CONFIG.TEMPLATE_COUNT).map(index =>
                        `<iframe class="${CSS_CLASSES.iframe}" id="iframe-${index}" data-template-index="${index}"></iframe>`
                    ).join('')}
                </div>
            `;
        }

        static updateDynamicContent() {
            const dynamicContent = document.querySelector('#dynamic-content');
            const iframeContainer = document.querySelector('#iframe-container');

            if (dynamicContent) {
                dynamicContent.innerHTML = `
                    ${this.generateArticleInputs()}
                    ${this.generateAdvancedSection()}
                `;
            }

            if (iframeContainer) {
                iframeContainer.innerHTML = Utils.generateRangeArray(CONFIG.TEMPLATE_COUNT).map(index =>
                    `<iframe class="${CSS_CLASSES.iframe}" id="iframe-${index}" data-template-index="${index}"></iframe>`
                ).join('');
            }

            // 更新配置显示
            if (window.WeChatArticleTool && window.WeChatArticleTool.eventManager) {
                window.WeChatArticleTool.eventManager.updateConfigDisplay();
            }

            Utils.log(`动态内容已更新: ${CONFIG.TEMPLATE_COUNT}个模板`);
        }

        static generateStyles() {
            return `
                <style type="text/css">
                    .${CSS_CLASSES.layout} {
                        width: 320px;
                        min-height: 400px;
                        max-height: 90vh;
                        padding: 20px;
                        display: block;
                        background-color: #fff;
                        position: absolute;
                        top: 200px;
                        right: 48px;
                        z-index: 10000;
                        border-radius: 12px;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
                        border: 1px solid #e8e8e8;
                        overflow-y: auto;
                        backdrop-filter: blur(10px);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .tool-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 16px;
                        border-bottom: 2px solid #f0f0f0;
                        position: sticky;
                        top: 0;
                        background: #fff;
                        z-index: 10;
                    }

                    .tool-title {
                        margin: 0;
                        font-size: 18px;
                        font-weight: 700;
                        color: #1a1a1a;
                        letter-spacing: -0.02em;
                    }

                    .tool-content {
                        margin-top: 0;
                        padding-top: 0;
                    }

                    .articles-section {
                        margin-bottom: 20px;
                    }

                    .template-count-controls {
                        display: flex;
                        align-items: center;
                        gap: 0;
                        border: 2px solid #e8e8e8;
                        border-radius: 8px;
                        overflow: hidden;
                        background: #fafafa;
                    }

                    .count-btn {
                        width: 32px;
                        height: 32px;
                        border: none;
                        background: #fff;
                        color: #4a4a4a;
                        font-size: 18px;
                        font-weight: 600;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                    }

                    .count-btn:hover:not(:disabled) {
                        background: #f0f0f0;
                        color: #1a1a1a;
                        transform: scale(1.05);
                    }

                    .count-btn:active:not(:disabled) {
                        transform: scale(0.95);
                    }

                    .count-btn:disabled {
                        color: #c0c0c0;
                        cursor: not-allowed;
                        background: #f8f8f8;
                    }

                    .count-display {
                        min-width: 40px;
                        text-align: center;
                        font-size: 14px;
                        font-weight: 600;
                        color: #1a1a1a;
                        padding: 0 12px;
                        border-left: 1px solid #e8e8e8;
                        border-right: 1px solid #e8e8e8;
                        background: #fff;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    /* 功能模块 */
                    .article-module {
                        margin-bottom: 12px;
                        border: 2px solid #f0f0f0;
                        border-radius: 8px;
                        background: #fff;
                        padding: 12px;
                        transition: all 0.2s ease;
                        position: relative;
                    }

                    .input-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                    }

                    .module-actions {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }

                    .status-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #d0d0d0;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 0 0 2px rgba(208, 208, 208, 0.2);
                    }

                    .status-dot.loaded {
                        background: #07c160;
                        box-shadow: 0 0 0 2px rgba(7, 193, 96, 0.2);
                        animation: pulse 2s infinite;
                    }

                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 2px rgba(7, 193, 96, 0.2); }
                        50% { box-shadow: 0 0 0 4px rgba(7, 193, 96, 0.1); }
                        100% { box-shadow: 0 0 0 2px rgba(7, 193, 96, 0.2); }
                    }

                    .action-btn {
                        background: #f8f8f8;
                        border: 1px solid #e0e0e0;
                        width: 20px;
                        height: 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .action-btn:hover {
                        background: #f0f0f0;
                        border-color: #c0c0c0;
                        transform: scale(1.1);
                    }

                    .action-btn:active {
                        transform: scale(0.95);
                    }

                    .lock-btn {
                        background: #f0f0f0;
                    }

                    .lock-btn.locked {
                        background: #ff9500;
                        border-color: #ff9500;
                        color: #fff;
                    }

                    .lock-btn.locked:hover {
                        background: #e6850e;
                        border-color: #e6850e;
                    }

                    .move-up-btn::before {
                        content: '';
                        position: absolute;
                        top: 4px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        border-bottom: 5px solid #666;
                        transition: all 0.2s ease;
                    }

                    .move-up-btn:hover::before {
                        border-bottom-color: #333;
                    }

                    .move-down-btn::before {
                        content: '';
                        position: absolute;
                        bottom: 4px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        border-top: 5px solid #666;
                        transition: all 0.2s ease;
                    }

                    .move-down-btn:hover::before {
                        border-top-color: #333;
                    }

                    .expand-btn::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 0;
                        height: 0;
                        border-left: 3px solid transparent;
                        border-right: 3px solid transparent;
                        border-top: 4px solid #666;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .expand-btn:hover::before {
                        border-top-color: #333;
                    }

                    .expand-btn.expanded::before {
                        transform: translate(-50%, -50%) rotate(180deg);
                    }

                    .advanced-section {
                        margin-top: 8px;
                        padding-top: 8px;
                        border-top: 2px solid #f0f0f0;
                        background: #fafafa;
                        border-radius: 6px;
                        padding: 6px;
                        margin-left: -4px;
                        margin-right: -4px;
                    }

                    .${CSS_CLASSES.layout} .frm_control_group {
                        padding-bottom: 6px;
                        margin-bottom: 8px;
                    }

                    .${CSS_CLASSES.layout} .input_group {
                        padding-bottom: 4px;
                        margin-bottom: 2px;
                    }

                    .${CSS_CLASSES.layout} .weui-desktop-tips {
                        display: block;
                        margin-top: 8px;
                        margin-bottom: 4px;
                        font-size: 13px;
                        color: #4a4a4a;
                        font-weight: 600;
                        letter-spacing: -0.01em;
                    }

                    .${CSS_CLASSES.layout} .weui-desktop-form__input {
                        width: 100%;
                        padding: 10px 12px;
                        border: 2px solid #e8e8e8;
                        border-radius: 6px;
                        font-size: 13px;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        background: #fff;
                        color: #1a1a1a;
                        font-family: inherit;
                    }

                    .${CSS_CLASSES.layout} .weui-desktop-form__input:focus {
                        border-color: #07c160;
                        outline: none;
                        box-shadow: 0 0 0 3px rgba(7, 193, 96, 0.1);
                        background: #fafafa;
                    }

                    .${CSS_CLASSES.layout} .weui-desktop-form__input::placeholder {
                        color: #999;
                        font-size: 12px;
                    }

                    .${CSS_CLASSES.iframe} {
                        width: 0;
                        height: 0;
                        border: 0;
                        position: absolute;
                        left: -1000px;
                        top: -1000px;
                        display: none;
                    }

                    .${CSS_CLASSES.viewcode} {
                        overflow-x: auto;
                        max-height: 200px;
                        background: #f8f9fa;
                        border: 1px solid #e8e8e8;
                        border-radius: 6px;
                        padding: 12px;
                        font-size: 11px;
                        line-height: 1.5;
                        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        color: #2d3748;
                    }

                    .${CSS_CLASSES.smallInput} {
                        width: 75px;
                        margin-right: 8px;
                        font-size: 12px;
                        padding: 8px 10px;
                    }

                    .${CSS_CLASSES.sizeInputs} {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 8px;
                        gap: 8px;
                    }

                    .${CSS_CLASSES.layout} .frm_control_group:last-of-type {
                        margin-bottom: 0;
                    }

                    .${CSS_CLASSES.layout} .batch-import-btn {
                        width: 100%;
                        padding: 12px 16px;
                        background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 13px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 2px 8px rgba(7, 193, 96, 0.2);
                        position: relative;
                        overflow: hidden;
                    }

                    .${CSS_CLASSES.layout} .batch-import-btn:hover {
                        background: linear-gradient(135deg, #06ad56 0%, #059c4e 100%);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
                    }

                    .${CSS_CLASSES.layout} .batch-import-btn:active {
                        background: linear-gradient(135deg, #059c4e 0%, #048a42 100%);
                        transform: translateY(0);
                        box-shadow: 0 2px 6px rgba(7, 193, 96, 0.2);
                    }

                    /* 响应式设计 */
                    @media (max-width: 1200px) {
                        .${CSS_CLASSES.layout} {
                            right: 10px;
                            width: 300px;
                        }
                    }

                    @media (max-width: 768px) {
                        .${CSS_CLASSES.layout} {
                            position: fixed;
                            top: 0;
                            right: 0;
                            left: 0;
                            bottom: 0;
                            width: 100%;
                            height: 100%;
                            max-height: 100vh;
                            border-radius: 0;
                            transform: none;
                            z-index: 10001;
                        }

                        .tool-header {
                            position: sticky;
                            top: 0;
                            background: #fff;
                            z-index: 10;
                            padding: 16px 20px;
                            margin: 0 -20px 20px -20px;
                            border-bottom: 2px solid #f0f0f0;
                        }

                        .article-module {
                            margin-bottom: 16px;
                            padding: 16px;
                        }

                        .${CSS_CLASSES.layout} .weui-desktop-form__input {
                            padding: 12px 14px;
                            font-size: 14px;
                        }

                        .action-btn {
                            width: 24px;
                            height: 24px;
                        }

                        .count-btn {
                            width: 36px;
                            height: 36px;
                            font-size: 20px;
                        }

                        .count-display {
                            height: 36px;
                            font-size: 16px;
                        }
                    }

                    @media (max-width: 480px) {
                        .${CSS_CLASSES.layout} {
                            padding: 16px;
                        }

                        .tool-header {
                            padding: 12px 16px;
                            margin: 0 -16px 16px -16px;
                        }

                        .tool-title {
                            font-size: 16px;
                        }

                        .article-module {
                            padding: 12px;
                        }

                        .${CSS_CLASSES.sizeInputs} {
                            flex-direction: column;
                            gap: 6px;
                        }

                        .${CSS_CLASSES.smallInput} {
                            width: 100%;
                            margin-right: 0;
                        }
                    }

                    /* 滚动条样式 */
                    .${CSS_CLASSES.layout}::-webkit-scrollbar {
                        width: 6px;
                    }

                    .${CSS_CLASSES.layout}::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 3px;
                    }

                    .${CSS_CLASSES.layout}::-webkit-scrollbar-thumb {
                        background: #c1c1c1;
                        border-radius: 3px;
                    }

                    .${CSS_CLASSES.layout}::-webkit-scrollbar-thumb:hover {
                        background: #a8a8a8;
                    }

                    /* 加载动画 */
                    .loading {
                        opacity: 0.6;
                        pointer-events: none;
                    }

                    .loading::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 20px;
                        height: 20px;
                        margin: -10px 0 0 -10px;
                        border: 2px solid #f3f3f3;
                        border-top: 2px solid #07c160;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    /* 状态指示器增强 */
                    .status-indicator {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 11px;
                        color: #666;
                        font-weight: 500;
                    }

                    .status-indicator.success {
                        color: #07c160;
                    }

                    .status-indicator.error {
                        color: #ff4757;
                    }

                    .status-indicator.warning {
                        color: #ff9500;
                    }

                    /* 工具提示 */
                    .tooltip {
                        position: relative;
                        cursor: help;
                    }

                    .tooltip::after {
                        content: attr(data-tooltip);
                        position: absolute;
                        bottom: 125%;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #333;
                        color: #fff;
                        padding: 6px 8px;
                        border-radius: 4px;
                        font-size: 11px;
                        white-space: nowrap;
                        opacity: 0;
                        visibility: hidden;
                        transition: all 0.2s ease;
                        z-index: 1000;
                    }

                    .tooltip:hover::after {
                        opacity: 1;
                        visibility: visible;
                    }

                    /* 焦点状态增强 */
                    .${CSS_CLASSES.layout} *:focus {
                        outline: none;
                    }

                    .${CSS_CLASSES.layout} .weui-desktop-form__input:focus {
                        border-color: #07c160;
                        box-shadow: 0 0 0 3px rgba(7, 193, 96, 0.1);
                        background: #fafafa;
                    }

                    .${CSS_CLASSES.layout} .action-btn:focus {
                        outline: 2px solid #07c160;
                        outline-offset: 2px;
                    }

                    .${CSS_CLASSES.layout} .count-btn:focus {
                        outline: 2px solid #07c160;
                        outline-offset: 2px;
                    }

                    .${CSS_CLASSES.layout} .batch-import-btn:focus {
                        outline: 2px solid #07c160;
                        outline-offset: 2px;
                    }
                </style>
            `;
        }

        static generateArticleTemplate(templates) {
            const articles = templates.map(template => this.generateSingleArticle(template)).join('');
            return `<section name="pangmenzhengdao"><section style="width: 98.5% !important;max-width: 800px !important;margin: 0px auto !important;box-sizing: border-box !important;"><section><p style="margin: 0px 2px;text-align: left;font-size: 12px;">-------------------------</p><p style="margin: 0px 2px;text-align: left;font-size: 12px;">往期精华文章导读：<br></p>${articles}<section><p><br></p><p style="box-sizing: border-box !important;text-align: center !important;font-size: 14px !important;color: rgb(178, 178, 178) !important;">-END-</p><p><br></p></section><p style="display: none !important;font-size: 0px !important;color: transparent !important;line-height: 0px !important;padding: 0px !important;margin: 0px !important;">本文章转载自微信公众号：庞门正道</p><section class="wx-profile-card-cover" style="overflow: hidden;line-height: 0;box-sizing: border-box;"><svg viewBox="0 0 800 354" xmlns="http://www.w3.org/2000/svg" style="box-sizing: border-box;"><foreignObject width="100%" height="100%" style="box-sizing: border-box;"><svg style="background-repeat: no-repeat;background-size: 100%;pointer-events: none;background-image: url(&quot;https://mmbiz.qpic.cn/sz_mmbiz_jpg/I3KJh29KMaTodOa9NiahjQxib6qHK50xZIVaERp7QdfetI86QVbOk6nN6B53w6WInQhuxgYvjwKkdTVMeFfwqQAA/640?wx_fmt=jpeg&quot;);box-sizing: border-box;" viewBox="0 0 800 354"></svg></foreignObject><foreignObject width="100%" height="100%" style="box-sizing: border-box;"><section style="overflow: hidden;opacity: 0;transform: scale(80);-webkit-transform: scale(80);-moz-transform: scale(80);-o-transform: scale(80);box-sizing: border-box;" class="mp_profile_iframe_wrp custom_select_card_wrp"><mpchecktext contenteditable="false" id="1701761888994_0.29576563308299897"></mpchecktext><mp-common-profile class="js_uneditable custom_select_card mp_profile_iframe mp_common_widget" data-id="MzA5NjIzNjgxNw==" data-pluginname="mpprofile" data-headimg="http://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1b8rI9CMYz2Cvl3Ge06Ltr7Rb94SlGeTiaUYc2F8FZqic68Oo8QXuw9agwNhvnKngFBpw6vrnp3unzw/0?wx_fmt=png" data-nickname="庞门正道" data-alias="" data-signature="播主：阿门-前腾讯视觉设计师、站酷排名前10的自由职业设计师。  每天早上与你一起分享一点设计&amp;摄影小知识小技巧。 欢迎回复或咨询探讨相关话题。" data-from="0" data-is_biz_ban="0" contenteditable="false"></mp-common-profile></section></foreignObject></svg></section><section style="margin-top: 8px; max-width: 100% !important; min-height: 1em !important; font-variant-numeric: normal !important; letter-spacing: 0.544px !important; line-height: 27.2px !important; white-space: normal !important; text-align: center !important; background-color: rgb(255, 255, 255) !important; box-sizing: border-box !important; overflow-wrap: break-word !important;"><span style="max-width: 100% !important;color: rgb(255, 255, 255) !important;font-size: 18px !important;background-color: rgb(49, 133, 155) !important;box-sizing: border-box !important;overflow-wrap: break-word !important;"><strong style="max-width: 100% !important;box-sizing: border-box !important;overflow-wrap: break-word !important;padding-left: 6px !important;">越努力，越幸运。</strong></span></section><p style="max-width: 100% !important;min-height: 1em !important;font-variant-numeric: normal !important;letter-spacing: 0.544px !important;line-height: 27.2px !important;white-space: normal !important;text-align: center !important;background-color: rgb(255, 255, 255) !important;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="max-width: 100% !important;color: rgb(255, 255, 255) !important;font-size: 18px !important;background-color: rgb(49, 133, 155) !important;box-sizing: border-box !important;overflow-wrap: break-word !important;"><strong style="max-width: 100% !important;box-sizing: border-box !important;overflow-wrap: break-word !important;padding-left: 6px !important;">这里是庞门正道。</strong></span></p></section></section>`;
        }

        static generateSingleArticle(template) {
            // 使用固定高度和object-fit:cover来统一图片显示
            const imageHeight = template.height || CONFIG.IMG_HEIGHT;
            const imageWidth = template.width || CONFIG.IMG_WIDTH;

            return `<article name="artman_design"><section style="background-color:rgba(255,255,255,0.05);box-sizing:border-box!important;margin:20px auto!important;border-radius:8px!important;box-shadow:rgba(162,169,182,0.255) 0 4px 8px!important;height:auto!important;overflow:hidden;"><section style="text-align:center;margin:0;padding-bottom:0;position:relative;overflow:hidden;"><a href="${template.url}" imgurl="${template.img}" linktype="image" tab="innerlink" data-itemshowtype="0" target="_blank" data-linktype="1"><img src="${template.img}" style="display:block;width:100%;height:${imageHeight}px;border-radius:8px 8px 0 0;object-fit:cover;object-position:center;"></a></section><p name="name-text" style="padding:16px 15px;line-height:1.6em!important;font-size:16px!important;font-variant-numeric:normal!important;letter-spacing:0.6px!important;text-align:left!important;margin-top:0;color:#333;">${template.text}</p></section></article>`;
        }

        static generateFooterSection() {
            return `<section><p><br></p><p style="box-sizing: border-box !important;text-align: center !important;font-size: 14px !important;color: rgb(178, 178, 178) !important;">-END-</p><p><br></p></section>`;
        }

        static generateHiddenText() {
            return `<p style="display: none !important;font-size: 0px !important;color: transparent !important;line-height: 0px !important;padding: 0px !important;margin: 0px !important;">本文章转载自微信公众号：庞门正道</p>`;
        }

        static generateProfileCard() {
            return `<section class="wx-profile-card-cover" style="overflow: hidden;line-height: 0;box-sizing: border-box;"><svg viewBox="0 0 800 354" xmlns="http://www.w3.org/2000/svg" style="box-sizing: border-box;"><foreignObject width="100%" height="100%" style="box-sizing: border-box;"><svg style="background-repeat: no-repeat;background-size: 100%;pointer-events: none;background-image: url(&quot;https://mmbiz.qpic.cn/sz_mmbiz_jpg/I3KJh29KMaTodOa9NiahjQxib6qHK50xZIVaERp7QdfetI86QVbOk6nN6B53w6WInQhuxgYvjwKkdTVMeFfwqQAA/640?wx_fmt=jpeg&quot;);box-sizing: border-box;" viewBox="0 0 800 354"></svg></foreignObject><foreignObject width="100%" height="100%" style="box-sizing: border-box;"><section style="overflow: hidden;opacity: 0;transform: scale(80);-webkit-transform: scale(80);-moz-transform: scale(80);-o-transform: scale(80);box-sizing: border-box;" class="mp_profile_iframe_wrp custom_select_card_wrp"><mpchecktext contenteditable="false" id="1701761888994_0.29576563308299897"></mpchecktext><mp-common-profile class="js_uneditable custom_select_card mp_profile_iframe mp_common_widget" data-id="MzA5NjIzNjgxNw==" data-pluginname="mpprofile" data-headimg="http://mmbiz.qpic.cn/mmbiz_png/Rhh4hWLlib1b8rI9CMYz2Cvl3Ge06Ltr7Rb94SlGeTiaUYc2F8FZqic68Oo8QXuw9agwNhvnKngFBpw6vrnp3unzw/0?wx_fmt=png" data-nickname="庞门正道" data-alias="" data-signature="播主：阿门-前腾讯视觉设计师、站酷排名前10的自由职业设计师。  每天早上与你一起分享一点设计&amp;摄影小知识小技巧。 欢迎回复或咨询探讨相关话题。" data-from="0" data-is_biz_ban="0" contenteditable="false"></mp-common-profile></section></foreignObject></svg></section>`;
        }

        static generateMottoSection() {
            return `<section style="margin-top: 8px; max-width: 100% !important; min-height: 1em !important; font-variant-numeric: normal !important; letter-spacing: 0.544px !important; line-height: 27.2px !important; white-space: normal !important; text-align: center !important; background-color: rgb(255, 255, 255) !important; box-sizing: border-box !important; overflow-wrap: break-word !important;"><span style="max-width: 100% !important;color: rgb(255, 255, 255) !important;font-size: 18px !important;background-color: rgb(49, 133, 155) !important;box-sizing: border-box !important;overflow-wrap: break-word !important;"><strong style="max-width: 100% !important;box-sizing: border-box !important;overflow-wrap: break-word !important;padding-left: 6px !important;">越努力，越幸运。</strong></span></section><p style="max-width: 100% !important;min-height: 1em !important;font-variant-numeric: normal !important;letter-spacing: 0.544px !important;line-height: 27.2px !important;white-space: normal !important;text-align: center !important;background-color: rgb(255, 255, 255) !important;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="max-width: 100% !important;color: rgb(255, 255, 255) !important;font-size: 18px !important;background-color: rgb(49, 133, 155) !important;box-sizing: border-box !important;overflow-wrap: break-word !important;"><strong style="max-width: 100% !important;box-sizing: border-box !important;overflow-wrap: break-word !important;padding-left: 6px !important;">这里是庞门正道。</strong></span></p>`;
        }

    }

    // ===================== 事件管理器 =====================
    class EventManager {
        constructor(templateManager, articleManager) {
            this.templateManager = templateManager;
            this.articleManager = articleManager;
            this.domManager = new DOMManager();
            this.boundHandlers = new Map();
            this.isAdjustingCount = false;  // 防止连续点击的锁定标志
        }

        initialize() {
            this.bindConfigEvents();
            this.bindArticleCardEvents();
            this.bindOverwriteEvents();
            this.bindActionButtonEvents();
            Utils.log('事件管理器初始化完成');
        }

        rebindEvents() {
            this.clearDynamicHandlers();
            this.bindArticleCardEvents();
        }

        bindActionButtonEvents() {
            // 使用事件委托处理所有动作按钮的点击
            const layoutContainer = this.domManager.$(SELECTORS.layoutContainer);
            if (layoutContainer) {
                const buttonHandler = (e) => {
                    const button = e.target.closest('.action-btn');
                    if (!button) return;

                    const action = button.getAttribute('data-action');
                    const index = parseInt(button.getAttribute('data-index'));

                    if (!action || !index) return;

                    // 确保ArticleCardManager已经初始化
                    if (!window.ArticleCardManager) {
                        console.error('ArticleCardManager not initialized');
                        return;
                    }

                    switch (action) {
                        case 'toggleLock':
                            window.ArticleCardManager.toggleLock(index);
                            break;
                        case 'moveUp':
                            window.ArticleCardManager.moveUp(index);
                            break;
                        case 'moveDown':
                            window.ArticleCardManager.moveDown(index);
                            break;
                        case 'toggleExpand':
                            window.ArticleCardManager.toggleExpand(index);
                            break;
                    }
                };

                layoutContainer.addEventListener('click', buttonHandler);
                this.boundHandlers.set('action-buttons', buttonHandler);
            }
        }

        bindConfigEvents() {
            const minusButton = this.domManager.$('#template-count-minus');
            const plusButton = this.domManager.$('#template-count-plus');

            if (minusButton) {
                const minusHandler = () => {
                    this.adjustTemplateCount(-1);
                };
                minusButton.addEventListener('click', minusHandler);
                this.boundHandlers.set('template-count-minus', minusHandler);
            }

            if (plusButton) {
                const plusHandler = () => {
                    this.adjustTemplateCount(1);
                };
                plusButton.addEventListener('click', plusHandler);
                this.boundHandlers.set('template-count-plus', plusHandler);
            }

            // 绑定事件后立即更新显示状态
            this.updateConfigDisplay();
        }

        adjustTemplateCount(change) {
            // 防止连续点击造成的问题
            if (this.isAdjustingCount) {
                Utils.log('正在调整数量中，忽略此次点击');
                return;
            }

            Utils.log(`调整模板数量: ${change}, 当前: ${CONFIG.TEMPLATE_COUNT}`);

            const newCount = Math.max(
                DEFAULT_CONFIG.MIN_TEMPLATE_COUNT,
                Math.min(DEFAULT_CONFIG.MAX_TEMPLATE_COUNT, CONFIG.TEMPLATE_COUNT + change)
            );

            if (newCount !== CONFIG.TEMPLATE_COUNT) {
                this.isAdjustingCount = true;
                Utils.log(`模板数量将从 ${CONFIG.TEMPLATE_COUNT} 更改为 ${newCount}`);

                try {
                    this.handleTemplateCountChange(newCount);
                    this.updateConfigDisplay();
                } finally {
                    // 延迟解锁以确保界面更新完成
                    setTimeout(() => {
                        this.isAdjustingCount = false;
                    }, 100);
                }
            } else {
                Utils.log(`模板数量未改变，保持 ${CONFIG.TEMPLATE_COUNT}`);
            }
        }

        updateConfigDisplay() {
            const currentCountSpan = document.querySelector('#current-count');
            const displayCountSpan = document.querySelector('#template-display-count');
            const minusBtn = document.querySelector('#template-count-minus');
            const plusBtn = document.querySelector('#template-count-plus');

            if (currentCountSpan) currentCountSpan.textContent = CONFIG.TEMPLATE_COUNT;
            if (displayCountSpan) displayCountSpan.textContent = CONFIG.TEMPLATE_COUNT;

            if (minusBtn) {
                minusBtn.disabled = CONFIG.TEMPLATE_COUNT <= DEFAULT_CONFIG.MIN_TEMPLATE_COUNT;
            }
            if (plusBtn) {
                plusBtn.disabled = CONFIG.TEMPLATE_COUNT >= DEFAULT_CONFIG.MAX_TEMPLATE_COUNT;
            }
        }

        bindArticleCardEvents() {
            // 绑定每个卡片的事件，使用原始版本的ID格式
            Utils.generateRangeArray(CONFIG.TEMPLATE_COUNT).forEach(index => {
                this.bindCardInputEvents(index);
            });
        }

        bindCardInputEvents(index) {
            // 文章链接输入
            const urlInput = this.domManager.$(`#input-${index}`);
            if (urlInput) {
                const urlHandler = (e) => {
                    this.handleArticleInput(e.target.value, index);
                };
                urlInput.addEventListener('input', urlHandler);
                this.boundHandlers.set(`input-${index}`, urlHandler);
            }

            // 文章标题输入
            const titleInput = this.domManager.$(`#input-title-${index}`);
            if (titleInput) {
                const titleHandler = (e) => {
                    this.handleTitleInput(e.target.value, index);
                };
                titleInput.addEventListener('input', titleHandler);
                this.boundHandlers.set(`input-title-${index}`, titleHandler);
            }

            // 图片地址输入
            const imgInput = this.domManager.$(`#input-img${index}`);
            if (imgInput) {
                const imgHandler = (e) => {
                    this.handleImageInput(e.target.value, index);
                };
                imgInput.addEventListener('input', imgHandler);
                this.boundHandlers.set(`input-img${index}`, imgHandler);
            }

            // 宽度输入
            const widthInput = this.domManager.$(`#input-img${index}-width`);
            if (widthInput) {
                const widthHandler = (e) => {
                    this.handleWidthInput(e.target.value, index);
                };
                widthInput.addEventListener('input', widthHandler);
                this.boundHandlers.set(`input-img${index}-width`, widthHandler);
            }

            // 高度输入
            const heightInput = this.domManager.$(`#input-img${index}-height`);
            if (heightInput) {
                const heightHandler = (e) => {
                    this.handleHeightInput(e.target.value, index);
                };
                heightInput.addEventListener('input', heightHandler);
                this.boundHandlers.set(`input-img${index}-height`, heightHandler);
            }

            // X偏移输入
            const offsetXInput = this.domManager.$(`#input-img${index}-offsetX`);
            if (offsetXInput) {
                const offsetXHandler = (e) => {
                    this.handleOffsetXInput(e.target.value, index);
                };
                offsetXInput.addEventListener('input', offsetXHandler);
                this.boundHandlers.set(`input-img${index}-offsetX`, offsetXHandler);
            }

            // Y偏移输入
            const offsetYInput = this.domManager.$(`#input-img${index}-offsetY`);
            if (offsetYInput) {
                const offsetYHandler = (e) => {
                    this.handleOffsetYInput(e.target.value, index);
                };
                offsetYInput.addEventListener('input', offsetYHandler);
                this.boundHandlers.set(`input-img${index}-offsetY`, offsetYHandler);
            }
        }


        bindOverwriteEvents() {
            const overwriteInput = this.domManager.$('#input-overwrite');
            if (overwriteInput) {
                const inputHandler = Utils.debounce((e) => {
                    this.articleManager.overwriteContent(e.target.value);
                }, 500);

                const clickHandler = () => {
                    this.articleManager.refreshInformation();
                };

                overwriteInput.addEventListener('input', inputHandler);
                overwriteInput.addEventListener('click', clickHandler);

                this.boundHandlers.set('overwrite-input', inputHandler);
                this.boundHandlers.set('overwrite-click', clickHandler);
            }

            // 绑定批量导入按钮
            const batchImportBtn = this.domManager.$('#batch-import-btn');
            if (batchImportBtn) {
                const batchImportHandler = () => {
                    this.batchImportArticles();
                };

                batchImportBtn.addEventListener('click', batchImportHandler);
                this.boundHandlers.set('batch-import', batchImportHandler);
            }
        }

        // 事件处理方法 - 与原始版本保持一致
        async handleArticleInput(url, templateIndex) {
            if (!url.trim()) return;

            // 更新模板URL
            this.templateManager.updateTemplate(templateIndex, { url });

            // 立即更新文章内容显示
            this.articleManager.updateTemplateContent();
            this.updateLabelStatus(templateIndex);

            // 设置iframe源
            const iframe = this.domManager.$(`#iframe-${templateIndex}`);
            const imageInput = this.domManager.$(`#input-img${templateIndex}`);

            if (iframe) {
                iframe.src = url;
                if (imageInput) {
                    imageInput.value = url;
                }

                // 等待iframe加载
                await Utils.sleep(CONFIG.LOAD_DELAY);
                await this.extractArticleData(templateIndex);
            }
        }

        async extractArticleData(templateIndex) {
            try {
                const iframe = this.domManager.$(`#iframe-${templateIndex}`);
                if (!iframe?.contentWindow) return;

                const title = iframe.contentWindow.frames['msg_title'];
                const image = iframe.contentWindow.frames['cdn_url_235_1'];

                if (title || image) {
                    const updateData = {
                        text: title || '标题获取失败',
                        img: image || CONFIG.DEFAULT_IMAGE
                    };

                    this.templateManager.updateTemplate(templateIndex, updateData);

                    // 立即更新文章内容
                    this.articleManager.updateTemplateContent();
                    this.updateLabelStatus(templateIndex);

                    Utils.log(`文章 ${templateIndex} 数据提取完成: ${title || '无标题'}`);
                } else {
                    Utils.log(`文章 ${templateIndex} 数据提取失败，使用默认数据`);
                    // 即使提取失败，也要确保文章内容更新
                    this.articleManager.updateTemplateContent();
                    this.updateLabelStatus(templateIndex);
                }
            } catch (error) {
                Utils.log(`提取文章数据失败: ${error.message}`, 'error');
                // 出错时也要更新文章内容
                this.articleManager.updateTemplateContent();
                this.updateLabelStatus(templateIndex);
            }
        }

        updateLabelStatus(templateIndex) {
            const template = this.templateManager.getTemplate(templateIndex);
            if (!template) return;

            // 更新卡片信息
            window.ArticleCardManager.updateCardInfo(templateIndex, template);
        }

        handleImageInput(imageUrl, templateIndex) {
            this.templateManager.updateTemplate(templateIndex, { img: imageUrl });
            this.articleManager.updateArticleImage(templateIndex, imageUrl);
            // 同步更新文章内容
            this.articleManager.updateTemplateContent();
        }

        handleWidthInput(width, templateIndex) {
            const numWidth = parseInt(width) || CONFIG.IMG_WIDTH;
            this.templateManager.updateTemplate(templateIndex, { width: numWidth });
            this.articleManager.updateArticleCanvas(templateIndex);
        }

        handleHeightInput(height, templateIndex) {
            const numHeight = parseInt(height) || CONFIG.IMG_HEIGHT;
            this.templateManager.updateTemplate(templateIndex, { height: numHeight });
            this.articleManager.updateArticleCanvas(templateIndex);
        }

        handleOffsetXInput(offsetX, templateIndex) {
            this.templateManager.updateTemplate(templateIndex, { scrollX: offsetX });
            this.articleManager.updateArticlePosition(templateIndex);
        }

        handleOffsetYInput(offsetY, templateIndex) {
            this.templateManager.updateTemplate(templateIndex, { scrollY: offsetY });
            this.articleManager.updateArticlePosition(templateIndex);
        }

        handleTitleInput(title, templateIndex) {
            this.templateManager.updateTemplate(templateIndex, { title, text: title });
            const template = this.templateManager.getTemplate(templateIndex);
            window.ArticleCardManager.updateCardInfo(templateIndex, template);
            // 同步更新文章内容
            this.articleManager.updateTemplateContent();
        }

        batchImportArticles() {
            // 使用预设文章数据
            const articlesData = PRESET_ARTICLES;

            Utils.log('开始批量导入文章...');

            // 确保有足够的模板数量
            const maxCount = Math.max(CONFIG.TEMPLATE_COUNT, articlesData.length);
            if (maxCount > CONFIG.TEMPLATE_COUNT) {
                CONFIG.TEMPLATE_COUNT = maxCount;
                this.templateManager.updateTemplateCount(maxCount);
                HTMLTemplateGenerator.updateDynamicContent();
                this.rebindEvents();
            }

            // 批量导入文章数据
            articlesData.forEach((article, index) => {
                const templateIndex = index + 1;

                // 更新模板数据
                this.templateManager.updateTemplate(templateIndex, {
                    title: article.title,
                    text: article.title,
                    url: article.url,
                    img: article.imageUrl,
                    width: CONFIG.IMG_WIDTH,
                    height: CONFIG.IMG_HEIGHT,
                    scrollX: CONFIG.IMG_SCROLL_X,
                    scrollY: CONFIG.IMG_SCROLL_Y
                });

                // 更新输入框
                const urlInput = this.domManager.$(`#input-${templateIndex}`);
                const titleInput = this.domManager.$(`#input-title-${templateIndex}`);
                const imgInput = this.domManager.$(`#input-img${templateIndex}`);
                const widthInput = this.domManager.$(`#input-img${templateIndex}-width`);
                const heightInput = this.domManager.$(`#input-img${templateIndex}-height`);
                const offsetXInput = this.domManager.$(`#input-img${templateIndex}-offsetX`);
                const offsetYInput = this.domManager.$(`#input-img${templateIndex}-offsetY`);

                if (urlInput) urlInput.value = article.url;
                if (titleInput) titleInput.value = article.title;
                if (imgInput) imgInput.value = article.imageUrl;
                if (widthInput) widthInput.value = CONFIG.IMG_WIDTH;
                if (heightInput) heightInput.value = CONFIG.IMG_HEIGHT;
                if (offsetXInput) offsetXInput.value = CONFIG.IMG_SCROLL_X;
                if (offsetYInput) offsetYInput.value = CONFIG.IMG_SCROLL_Y;

                // 更新卡片信息
                if (window.ArticleCardManager) {
            const template = this.templateManager.getTemplate(templateIndex);
                    window.ArticleCardManager.updateCardInfo(templateIndex, template);
                }
            });

            // 更新文章内容
            this.articleManager.updateTemplateContent();
            Utils.log(`批量导入完成，共导入 ${articlesData.length} 篇预设文章`);

            // 显示成功提示
            alert(`批量导入完成！\n共导入 ${articlesData.length} 篇预设文章\n\n所有文章都已预填写标题、链接和封面图片`);
        }



        handleTemplateCountChange(newCount) {
            const changed = ConfigManager.updateTemplateCount(newCount);
            if (changed) {
                this.rebuildInterface();
            }
        }

        handleConfigReset() {
            if (confirm('确定要重置所有配置吗？')) {
                ConfigManager.resetConfig();
                this.rebuildInterface();
            }
        }


        rebuildInterface() {
            Utils.log('重建界面...');

            // 更新模板管理器
            this.templateManager.updateTemplateCount(CONFIG.TEMPLATE_COUNT);

            // 更新动态内容
            HTMLTemplateGenerator.updateDynamicContent();

            // 清理旧事件
            this.clearDynamicHandlers();

            // 重新绑定事件
            this.bindConfigEvents();
            this.bindArticleCardEvents();

            // 更新页面显示
            this.articleManager.refreshInformation();

            Utils.log(`界面重建完成 - 当前模板数: ${CONFIG.TEMPLATE_COUNT}`);

        }

        clearDynamicHandlers() {
            // 清理动态绑定的事件处理器
            this.boundHandlers.clear();
        }

        destroy() {
            this.boundHandlers.clear();
            this.domManager.clearCache();
            Utils.log('事件管理器已销毁');
        }
    }

    // ===================== 文章卡片管理器 =====================
    class ArticleCardManager {
        constructor() {
            this.templateManager = null;
            this.articleManager = null;
        }

        init(templateManager, articleManager) {
            this.templateManager = templateManager;
            this.articleManager = articleManager;
        }

        moveUp(index) {
            if (index <= 1) return;
            this.moveArticle(index, index - 1);
        }

        moveDown(index) {
            if (index >= CONFIG.TEMPLATE_COUNT) return;
            this.moveArticle(index, index + 1);
        }

        moveToTop(index) {
            this.moveArticle(index, 1);
        }

        moveToBottom(index) {
            this.moveArticle(index, CONFIG.TEMPLATE_COUNT);
        }

        // 统一的文章移动方法
        moveArticle(fromIndex, toIndex) {

            // 1. 更新模板数据
            this.templateManager.moveTemplate(fromIndex, toIndex);

            // 2. 保存当前输入框的值
            const inputValues = this.saveInputValues();

            // 3. 重新生成HTML内容
            HTMLTemplateGenerator.updateDynamicContent();

            // 4. 恢复输入框的值
            this.restoreInputValues(inputValues);

            // 5. 重新绑定事件
            if (window.WeChatArticleTool && window.WeChatArticleTool.eventManager) {
                window.WeChatArticleTool.eventManager.rebindEvents();
            }

            // 6. 更新页面文章内容
            if (window.WeChatArticleTool && window.WeChatArticleTool.articleManager) {
                window.WeChatArticleTool.articleManager.updateTemplateContent();
            }

            Utils.log(`文章移动完成: ${fromIndex} -> ${toIndex}`);
        }

        toggleLock(index) {
            const locked = this.templateManager.toggleTemplateLock(index);
            this.updateLockIndicator(index, locked);
            return locked;
        }

        updateLockIndicator(index, locked) {
            const lockBtn = document.querySelector(`#lock-btn-${index}`);
            const module = document.querySelector(`[data-template-index="${index}"]`);

            if (lockBtn) {
                lockBtn.title = locked ? '解锁' : '锁定';
                lockBtn.className = `action-btn lock-btn ${locked ? 'locked' : ''}`;
            }

            if (module) {
                module.style.borderColor = locked ? '#ff9500' : '#e5e5e5';
                module.style.backgroundColor = locked ? '#fff8f0' : '#fff';
            }
        }

        toggleExpand(index) {
            const advancedSection = document.querySelector(`#advanced-${index}`);
            const expandBtn = document.querySelector(`#expand-btn-${index}`);

            if (advancedSection && expandBtn) {
                const isExpanded = advancedSection.style.display !== 'none';
                advancedSection.style.display = isExpanded ? 'none' : 'block';
                expandBtn.className = `action-btn expand-btn ${isExpanded ? 'expanded' : ''}`;
                expandBtn.title = isExpanded ? '展开' : '收起';
            }
        }

        refreshArticlesList() {
            Utils.log('开始刷新文章列表');

            // 保存当前所有输入框的值
            const inputValues = this.saveInputValues();

            // 重新生成HTML内容
            HTMLTemplateGenerator.updateDynamicContent();

            // 恢复输入框的值
            this.restoreInputValues(inputValues);

            // 重新绑定事件
            if (window.WeChatArticleTool && window.WeChatArticleTool.eventManager) {
                window.WeChatArticleTool.eventManager.rebindEvents();
            }

            Utils.log('文章列表刷新完成');
        }

        saveInputValues() {
            const values = {};

            for (let i = 1; i <= CONFIG.TEMPLATE_COUNT; i++) {
                const module = document.querySelector(`[data-template-index="${i}"]`);
                if (!module) continue;

                const urlInput = module.querySelector(`#input-${i}`);
                const titleInput = module.querySelector(`#input-title-${i}`);
                const imgInput = module.querySelector(`#input-img${i}`);
                const widthInput = module.querySelector(`#input-img${i}-width`);
                const heightInput = module.querySelector(`#input-img${i}-height`);
                const offsetXInput = module.querySelector(`#input-img${i}-offsetX`);
                const offsetYInput = module.querySelector(`#input-img${i}-offsetY`);

                values[i] = {
                    url: urlInput ? urlInput.value : '',
                    title: titleInput ? titleInput.value : '',
                    img: imgInput ? imgInput.value : '',
                    width: widthInput ? widthInput.value : '',
                    height: heightInput ? heightInput.value : '',
                    offsetX: offsetXInput ? offsetXInput.value : '',
                    offsetY: offsetYInput ? offsetYInput.value : ''
                };
            }

            return values;
        }

        restoreInputValues(values) {
            // 恢复所有文章相关的输入框值
            for (let i = 1; i <= CONFIG.TEMPLATE_COUNT; i++) {
                const data = values[i];
                if (!data) continue;

                const module = document.querySelector(`[data-template-index="${i}"]`);
                if (!module) continue;

                const urlInput = module.querySelector(`#input-${i}`);
                const titleInput = module.querySelector(`#input-title-${i}`);
                const imgInput = module.querySelector(`#input-img${i}`);
                const widthInput = module.querySelector(`#input-img${i}-width`);
                const heightInput = module.querySelector(`#input-img${i}-height`);
                const offsetXInput = module.querySelector(`#input-img${i}-offsetX`);
                const offsetYInput = module.querySelector(`#input-img${i}-offsetY`);

                if (urlInput) urlInput.value = data.url;
                if (titleInput) titleInput.value = data.title;
                if (imgInput) imgInput.value = data.img;
                if (widthInput) widthInput.value = data.width;
                if (heightInput) heightInput.value = data.height;
                if (offsetXInput) offsetXInput.value = data.offsetX;
                if (offsetYInput) offsetYInput.value = data.offsetY;
            }
        }

        updateCardInfo(index, data) {
            // 更新状态标签
            const statusLabel = document.querySelector(`#status-${index}`);
            if (statusLabel) {
                statusLabel.textContent = data.text || `第${Utils.getChineseNumber(index)}篇文章链接`;
            }

            // 更新状态指示器
            const statusDot = document.querySelector(`#status-dot-${index}`);
            if (statusDot) {
                statusDot.className = `status-dot ${data.url ? 'loaded' : ''}`;
            }

            // 更新输入框的值
            this.updateCardInputValues(index, data);
        }

        updateCardInputValues(index, data) {
            const inputs = [
                { id: `input-${index}`, value: data.url || '' },
                { id: `input-title-${index}`, value: data.title || '' },
                { id: `input-img${index}`, value: data.img || '' },
                { id: `input-img${index}-width`, value: data.width || '' },
                { id: `input-img${index}-height`, value: data.height || '' },
                { id: `input-img${index}-offsetX`, value: data.scrollX || '' },
                { id: `input-img${index}-offsetY`, value: data.scrollY || '' }
            ];

            inputs.forEach(({ id, value }) => {
                const input = document.querySelector(`#${id}`);
                if (input) {
                    input.value = value;
                }
            });
        }
    }

    // ArticleCardManager实例将在应用初始化时创建

    // ===================== 文章管理器 =====================
    class ArticleManager {
        constructor(templateManager) {
            this.templateManager = templateManager;
            this.domManager = new DOMManager();
        }

        async loadArticleFromUrl(url, templateIndex) {
            try {
                // 更新模板URL
                this.templateManager.updateTemplate(templateIndex, { url });

                // 设置iframe源
                const iframe = this.domManager.$(`#iframe-${templateIndex}`);
                const imageInput = this.domManager.$(`#input-img${templateIndex}`);

                if (iframe) {
                    iframe.src = url;
                    if (imageInput) {
                        imageInput.value = url;
                    }

                    // 等待iframe加载
                    await Utils.sleep(CONFIG.LOAD_DELAY);
                    await this.extractArticleData(templateIndex);
                }
            } catch (error) {
                Utils.log(`加载文章失败: ${error.message}`, 'error');
            }
        }

        async extractArticleData(templateIndex) {
            try {
                const iframe = this.domManager.$(`#iframe-${templateIndex}`);
                if (!iframe?.contentWindow) return;

                const title = iframe.contentWindow.frames['msg_title'];
                const image = iframe.contentWindow.frames['cdn_url_235_1'];

                if (title || image) {
                    const updateData = {
                        text: title || '标题获取失败',
                        img: image || CONFIG.DEFAULT_IMAGE
                    };

                    this.templateManager.updateTemplate(templateIndex, updateData);

                    // 更新卡片信息
                    const template = this.templateManager.getTemplate(templateIndex);
                    window.ArticleCardManager.updateCardInfo(templateIndex, template);

                    await Utils.sleep(CONFIG.UPDATE_DELAY);
                    this.updateTemplateContent();
                    this.updateLabelStatus(templateIndex);
                }
            } catch (error) {
                Utils.log(`提取文章数据失败: ${error.message}`, 'error');
            }
        }

        updateLabelStatus(templateIndex) {
            const template = this.templateManager.getTemplate(templateIndex);
            if (!template) return;

            const statusLabel = this.domManager.$(`#status-${templateIndex}`);
            const widthInput = this.domManager.$(`#input-img${templateIndex}-width`);
            const heightInput = this.domManager.$(`#input-img${templateIndex}-height`);
            const offsetXInput = this.domManager.$(`#input-img${templateIndex}-offsetX`);
            const offsetYInput = this.domManager.$(`#input-img${templateIndex}-offsetY`);

            if (statusLabel) statusLabel.textContent = template.text;
            if (widthInput) widthInput.value = template.width;
            if (heightInput) heightInput.value = template.height;
            if (offsetXInput) offsetXInput.value = template.scrollX;
            if (offsetYInput) offsetYInput.value = template.scrollY;
        }

        updateTemplateContent() {
            try {
                const templates = this.templateManager.getAllTemplates();
                Utils.log(`更新文章内容，模板数量: ${templates.length}`);

                const content = HTMLTemplateGenerator.generateArticleTemplate(templates);

                const editorContent = this.domManager.safeExecute(() => {
                    return $(SELECTORS.editor)?.contents?.()?.find?.(SELECTORS.editorContent)?.[0];
                });

                if (editorContent) {
                    editorContent.innerHTML = content;
                    this.refreshInformation();
                    Utils.log('文章内容已更新');
                } else {
                    Utils.log('未找到编辑器内容区域', 'warn');
                }
            } catch (error) {
                Utils.log(`更新文章内容失败: ${error.message}`, 'error');
            }
        }

        updateArticleImage(templateIndex, imageUrl) {
            const svgElements = this.domManager.getSVGElements();
            const svgElement = svgElements[templateIndex - 1];

            if (svgElement) {
                svgElement.style.backgroundImage = `url(${imageUrl})`;
            }
        }

        updateArticleCanvas(templateIndex) {
            const template = this.templateManager.getTemplate(templateIndex);
            if (!template) return;

            const svgElements = this.domManager.getSVGElements();
            const svgElement = svgElements[templateIndex - 1];

            if (svgElement) {
                svgElement.setAttribute('viewBox', `0 0 ${template.width} ${template.height}`);
            }
        }

        updateArticlePosition(templateIndex) {
            const template = this.templateManager.getTemplate(templateIndex);
            if (!template) return;

            try {
                const svgElements = this.domManager.getSVGElements();
                const svgElement = svgElements[templateIndex - 1];

                if (svgElement && svgElement[0]) {
                    svgElement[0].style.backgroundPosition = `${template.scrollX} ${template.scrollY}`;
                    Utils.log(`文章 ${templateIndex} 位置已更新: ${template.scrollX}, ${template.scrollY}`);
                } else {
                    Utils.log(`未找到文章 ${templateIndex} 的SVG元素`, 'warn');
                }
            } catch (error) {
                Utils.log(`更新文章 ${templateIndex} 位置失败: ${error.message}`, 'error');
            }
        }

        overwriteContent(htmlContent) {
            if (!htmlContent.trim()) return;

            const editorContent = this.domManager.safeExecute(() => {
                return $(SELECTORS.editor)?.contents?.()?.find?.(SELECTORS.editorContent)?.[0];
            });

            if (editorContent) {
                editorContent.innerHTML = htmlContent;
                this.refreshInformation();
            }
        }

        refreshInformation() {
            this.clearViewCodes();
            this.updateHTMLView();
            this.updateImageView();
            this.updateURLInputs();
        }

        clearViewCodes() {
            const htmlView = this.domManager.$('#viewcode-html');
            const imgView = this.domManager.$('#viewcode-img');

            if (htmlView) htmlView.innerHTML = '';
            if (imgView) imgView.innerHTML = '';
        }

        updateHTMLView() {
            const htmlView = this.domManager.$('#viewcode-html');
            const editorContent = this.domManager.safeExecute(() => {
                const editor = document.querySelector(SELECTORS.editor);
                const editorDoc = editor ? (editor.contentDocument || editor.contentWindow?.document) : null;
                return editorDoc ? editorDoc.querySelector(SELECTORS.editorContent) : null;
            });

            if (htmlView && editorContent) {
                htmlView.textContent = editorContent.innerHTML;
            }
        }

        updateImageView() {
            const imgView = this.domManager.$('#viewcode-img');
            if (!imgView) return;

            // 清空之前的内容
            imgView.innerHTML = '';

            const editorDoc = this.domManager.safeExecute(() => {
                const editor = document.querySelector(SELECTORS.editor);
                return editor ? (editor.contentDocument || editor.contentWindow?.document) : null;
            });

            if (!editorDoc) {
                imgView.textContent = '无法访问编辑器内容';
                return;
            }

            // 查找所有图片元素
            const allImages = [];

            // 1. 查找普通的img标签
            const imgElements = editorDoc.querySelectorAll('img');
            imgElements.forEach(img => {
                if (img.src && img.src.trim()) {
                    allImages.push({
                        type: 'img',
                        src: img.src,
                        alt: img.alt || '图片'
                    });
                }
            });

            // 2. 查找SVG中的背景图片
                const svgElements = editorDoc.querySelectorAll('svg');
            svgElements.forEach(svg => {
                const backgroundUrl = Utils.extractBackgroundUrl(svg.outerHTML);
                if (backgroundUrl && backgroundUrl.trim()) {
                    allImages.push({
                        type: 'svg-background',
                        src: backgroundUrl,
                        alt: 'SVG背景图片'
                    });
                }
            });

            // 3. 查找CSS背景图片
            const elementsWithBackground = editorDoc.querySelectorAll('*');
            elementsWithBackground.forEach(element => {
                const style = window.getComputedStyle(element);
                const backgroundImage = style.backgroundImage;
                if (backgroundImage && backgroundImage !== 'none') {
                    const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (urlMatch && urlMatch[1]) {
                        allImages.push({
                            type: 'css-background',
                            src: urlMatch[1],
                            alt: 'CSS背景图片'
                        });
                    }
                }
            });

            // 显示找到的图片
            if (allImages.length === 0) {
                imgView.textContent = '未找到图片';
            } else {
                allImages.forEach((img, index) => {
                    const pre = Utils.createElement('pre');
                    pre.textContent = `${index + 1}. [${img.type}] ${img.src}`;
                    pre.style.marginBottom = '4px';
                    pre.style.fontSize = '12px';
                    imgView.appendChild(pre);
                });
            }
        }

        updateURLInputs() {
            const articles = document.querySelectorAll('[name="pangmenzhengdao"] article');
            articles.forEach((article, index) => {
                const svgElement = article.querySelector('svg');
                const url = Utils.extractArticleUrl(svgElement);
                const input = this.domManager.$(`#input-${index + 1}`);

                if (input && url) {
                    input.value = url;
                }
            });
        }
    }

    // ===================== 主应用类 =====================
    class WeChatArticleToolApp {
        constructor() {
            this.currentPage = this.getCurrentPage();
            this.currentAction = Utils.getUrlParams('action');
            this.templateManager = null;
            this.articleManager = null;
            this.eventManager = null;
            this.domManager = new DOMManager();
        }

        getCurrentPage() {
            return window.location.href.split('/')[4]?.split('?')[0]  || '';
        }

        async initialize() {
            Utils.log(`应用初始化开始 - 页面: ${this.currentPage}, 动作: ${this.currentAction}`);
            await this.addNavigationMenu();
            await this.initializeEditor();
            Utils.log('应用初始化完成');
        }

        async addNavigationMenu() {
            const subMenus = this.domManager.$all(SELECTORS.subMenu);
            if (subMenus.length <= 1) return;

            const token = Utils.getUrlParams('token');
            if (!token) return;

            const menuItem = Utils.createElementFromHTML(`
                <li class="weui-desktop-sub-menu__item">
                    <a href="/cgi-bin/appmsgtemplate?action=list&lang=zh_CN&token=${token}"
                       title="文章尾巴"
                       class="weui-desktop-menu__link">
                        <span class="weui-desktop-menu__link__inner">
                            <span class="weui-desktop-menu__name">文章尾巴</span>
                        </span>
                    </a>
                </li>
            `);

            subMenus[1].appendChild(menuItem);
            Utils.log('导航菜单已添加');
        }

        async initializeEditor() {
            // 检查是否在正确的页面，如果不在编辑页面，也尝试显示工具面板
            const isEditPage = this.currentPage === 'appmsgtemplate' && this.currentAction === 'edit';
            const isTemplatePage = this.currentPage === 'appmsgtemplate';

            // 如果不在模板页面
            if (!isTemplatePage) {
                return;
            }

            // 更新标题
            const titleInput = this.domManager.$(SELECTORS.title);
            if (titleInput) {
                titleInput.value = "尾巴 " + Utils.getTodayDate('MMdd');
            }

            // 创建并添加工具面板
            const layoutHTML = HTMLTemplateGenerator.generateMainLayout();
            const layoutElement = Utils.createElementFromHTML(layoutHTML);
            document.body.appendChild(layoutElement);
            Utils.log('工具面板已添加到页面');

            // 初始化管理器
            this.templateManager = new TemplateDataManager();
            this.articleManager = new ArticleManager(this.templateManager);
            this.eventManager = new EventManager(this.templateManager, this.articleManager);

            // 创建并初始化文章卡片管理器
            window.ArticleCardManager = new ArticleCardManager();
            window.ArticleCardManager.init(this.templateManager, this.articleManager);

            // 初始化事件
            this.eventManager.initialize();

            // 绑定滚动事件
            this.domManager.bindScrollEvents();

            // 初始化所有卡片信息
            Utils.generateRangeArray(CONFIG.TEMPLATE_COUNT).forEach(index => {
                const template = this.templateManager.getTemplate(index);
                window.ArticleCardManager.updateCardInfo(index, template);
            });

            // 等待编辑器内容加载完成
            await Utils.sleep(500);

            // 自动识别当前页面文章
            await this.autoDetectArticles();

            // 刷新信息显示
            await Utils.sleep(100);
            this.articleManager.refreshInformation();

            Utils.log('编辑器初始化完成');
        }

        async autoDetectArticles() {
            try {
                const existingArticles = this.extractFromExistingContent();
                if (existingArticles.length > 0) {
                    for (let i = 0; i < Math.min(existingArticles.length, CONFIG.TEMPLATE_COUNT); i++) {
                        const article = existingArticles[i];
                        const templateIndex = i + 1;

                        this.templateManager.updateTemplate(templateIndex, article);

                        const urlInput = this.domManager.$(`#input-${templateIndex}`);
                        const titleInput = this.domManager.$(`#input-title-${templateIndex}`);
                        const imgInput = this.domManager.$(`#input-img${templateIndex}`);

                        if (urlInput && article.url) urlInput.value = article.url;
                        if (titleInput && article.text) titleInput.value = article.text;
                        if (imgInput && article.img) imgInput.value = article.img;

                        const template = this.templateManager.getTemplate(templateIndex);
                        window.ArticleCardManager.updateCardInfo(templateIndex, template);
                    }
                    return;
                }

                const articleLinks = this.findArticleLinks();
                if (articleLinks.length === 0) return;

                for (let i = 0; i < Math.min(articleLinks.length, CONFIG.TEMPLATE_COUNT); i++) {
                    const link = articleLinks[i];
                    const templateIndex = i + 1;

                    this.templateManager.updateTemplate(templateIndex, {
                        url: link.url,
                        text: link.title || `第${Utils.getChineseNumber(templateIndex)}篇文章`
                    });

                    const urlInput = this.domManager.$(`#input-${templateIndex}`);
                    const titleInput = this.domManager.$(`#input-title-${templateIndex}`);

                    if (urlInput) urlInput.value = link.url;
                    if (titleInput && link.title) titleInput.value = link.title;

                    const template = this.templateManager.getTemplate(templateIndex);
                    window.ArticleCardManager.updateCardInfo(templateIndex, template);

                    if (link.url) {
                        this.articleManager.loadArticleFromUrl(link.url, templateIndex);
                    }
                }
            } catch (error) {
                Utils.log(`自动识别文章失败: ${error.message}`, 'error');
            }
        }

        extractFromExistingContent() {
            const articles = [];

            const editorDoc = this.domManager.safeExecute(() => {
                const editor = document.querySelector(SELECTORS.editor);
                return editor ? (editor.contentDocument || editor.contentWindow?.document) : null;
            });

            if (!editorDoc) return articles;

            const mainSection = editorDoc.querySelector('section[name="pangmenzhengdao"]');
            if (!mainSection) return articles;

            const articleElements = mainSection.querySelectorAll('article[name="artman_design"]');

            articleElements.forEach((article, index) => {
                const linkElement = article.querySelector('a[href]');
                const titleElement = article.querySelector('p[name="name-text"]');
                const imgElement = article.querySelector('img[src]');

                const url = linkElement ? linkElement.getAttribute('href') : '';
                const text = titleElement ? titleElement.textContent.trim() : '';
                const img = imgElement ? imgElement.getAttribute('src') : '';

                if (url || text || img) {
                    articles.push({
                        url: url,
                        text: text,
                        title: text,
                        img: img,
                        width: CONFIG.IMG_WIDTH,
                        height: CONFIG.IMG_HEIGHT,
                        scrollX: CONFIG.IMG_SCROLL_X,
                        scrollY: CONFIG.IMG_SCROLL_Y
                    });
                }
            });

            return articles;
        }

        findArticleLinks() {
            const links = [];

            const elements = this.domManager.$all('a[href*="mp.weixin.qq.com"]');

            elements.forEach(element => {
                const href = element.href;
                const title = element.textContent.trim();

                if (href && title && this.isValidArticleUrl(href)) {
                    if (!links.some(link => link.url === href)) {
                        links.push({
                            url: href,
                            title: title.substring(0, 50)
                        });
                    }
                }
            });

            return links.slice(0, 10);
        }

        isValidArticleUrl(url) {
            return url.includes('mp.weixin.qq.com') && url.includes('__biz=');
        }

        destroy() {
            if (this.eventManager) {
                this.eventManager.destroy();
            }

            if (this.domManager) {
                this.domManager.destroy();
            }

            const layout = this.domManager.$(SELECTORS.layoutContainer);
            if (layout) {
                layout.remove();
            }

            Utils.log('应用已销毁');
        }

        showInitializationTip() {
            const tip = Utils.createElement('div', '', {
                style: `
                    position: fixed;
                    top: 20px;
                    right: 410px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    z-index: 11000;
                    font-size: 13px;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                `
            });
            tip.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 4px;">工具面板已启动</div>
                <div style="font-size: 11px; opacity: 0.9;">当前模板数: ${CONFIG.TEMPLATE_COUNT}个</div>
            `;

            document.body.appendChild(tip);

            setTimeout(() => {
                tip.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                tip.style.opacity = '0';
                tip.style.transform = 'translateY(-20px) scale(0.95)';
                setTimeout(() => tip.remove(), 400);
            }, 2500);
        }
    }

    // ===================== 应用启动 =====================
    let appInstance = null;

    async function startApplication() {
        // 清理之前的实例
        if (appInstance) {
            appInstance.destroy();
        }

        // 创建新实例
        appInstance = new WeChatArticleToolApp();
        await appInstance.initialize();

        window.WeChatArticleTool = appInstance;
    }

    // 等待页面加载完成后启动应用
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        if (appInstance) {
            appInstance.destroy();
        }
    });

})();