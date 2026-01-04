// ==UserScript==
// @name         凯恩之角论坛数据库调用修复
// @namespace    https://bbs.d.163.com/
// @version      1.0.2
// @description  修复凯恩之角论坛发帖功能中的物品/技能调用工具代码不能正常显示的BUG
// @author       diablo_sin
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        *://bbs.d.163.com/*
// @connect      163.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538295/%E5%87%AF%E6%81%A9%E4%B9%8B%E8%A7%92%E8%AE%BA%E5%9D%9B%E6%95%B0%E6%8D%AE%E5%BA%93%E8%B0%83%E7%94%A8%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/538295/%E5%87%AF%E6%81%A9%E4%B9%8B%E8%A7%92%E8%AE%BA%E5%9D%9B%E6%95%B0%E6%8D%AE%E5%BA%93%E8%B0%83%E7%94%A8%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主配置
    const config = {
        baseUrl: "https://d.163.com",
        defaultLang: "cn",
        supportedLangs: ["cn", "en", "tw"],
        tooltipPaths: {
            skill: "/js/tooltip/skill.js",
            item: "/js/tooltip/item.js",
            skillrune: "/js/tooltip/skillrune.js",
            trainingbook: "/js/tooltip/trainingbook.js"
        },
        cssUrl: "https://bbs.d.163.com/template/d3/css/tooltips.css"
    };

    // 工具函数
    const utils = {
        getScript: function(url, callback, charset) {
            const script = document.createElement('script');
            script.src = url;
            if (charset) script.charset = charset;
            script.onload = callback;
            document.head.appendChild(script);
        },

        loadCss: function(url) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            document.head.appendChild(link);
        },

        getTooltipUrl: function(type, lang) {
            return `${config.baseUrl}/${lang}${config.tooltipPaths[type]}`;
        },

        getTooltipDataUrl: function(type, lang, data) {
            const baseurl = `${config.baseUrl}/${lang}/js/tooltip`;
            if (type === 'skillrune') {
                const [id, variant] = data.split('#');
                return `${baseurl}${id}-${variant}.js`;
            } else {
                const safeData = data.replace(/[#?]/g, '');
                return `${baseurl}${safeData}.js`;
            }
        },

        createTooltipElement: function() {
            const wrapper = document.createElement('div');
            wrapper.className = 'd3-tooltip-wrapper';
            wrapper.style.display = 'none';
            wrapper.style.position = 'absolute';
            wrapper.style.zIndex = '9999';

            const inner = document.createElement('div');
            inner.className = 'd3-tooltip-wrapper-inner';
            wrapper.appendChild(inner);

            document.body.appendChild(wrapper);
            return {wrapper, inner};
        }
    };

    // 主功能
    class D3Tooltip {
        constructor() {
            this.tooltipData = {};
            this.infoLinkMap = {};
            this.currentLink = null;
            this.tooltipDelay = 500;
            this.tooltipTimeout = null;

            // 创建tooltip元素
            const {wrapper, inner} = utils.createTooltipElement();
            this.tooltipWrapper = wrapper;
            this.tooltipInner = inner;

            // 加载CSS
            utils.loadCss(config.cssUrl);

            // 初始化事件
            this.initEvents();
        }

        initEvents() {
            document.addEventListener('mouseover', (e) => {
                const target = e.target;
                if (target.classList.contains('diablo3tipfix')) {
                    this.handleMouseOver(target);
                }
            });

            document.addEventListener('mouseout', (e) => {
                if (this.currentLink) {
                    this.hideTooltip();
                }
            });
        }

        handleMouseOver(element) {
            this.currentLink = element;

            // 如果是span元素，先转换为a标签
            if (element.classList.contains('diablo3db')) {
                this.convertToLink(element);
                return;
            }

            // 显示加载中状态
            this.showLoading();

            // 获取数据并显示tooltip
            const type = element.getAttribute('dtype');
            const lang = element.getAttribute('dlang') || config.defaultLang;
            const name = element.getAttribute('name') || element.textContent;

            this.requestTooltipData(type, lang, name);
        }

        convertToLink(spanElement) {
            const type = spanElement.getAttribute('dtype');
            const lang = spanElement.getAttribute('dlang') || config.defaultLang;
            const name = spanElement.textContent;

            // 创建新的a标签
            const aElement = document.createElement('a');
            aElement.className = 'diablo3tipfix';
            aElement.setAttribute('dtype', type);
            aElement.setAttribute('dlang', lang);
            aElement.setAttribute('name', name);
            aElement.textContent = name;

            // 根据不同类型设置不同的href
            if(type==='skillrune'){
                aElement.setAttribute('href', 'javascript:;');
            }else{
                var dtype = type==='trainingbook'?'item':type;
                const baseUrl = `https://d.163.com/db/${lang}/49522/searchList/${dtype}?id=${encodeURIComponent(name)}`;
                aElement.setAttribute('href', baseUrl);
                aElement.setAttribute('target', '_blank');
            }

            // 替换span为a标签
            spanElement.parentNode.replaceChild(aElement, spanElement);
        }

        requestTooltipData(type, lang, name) {
            const cacheKey = `${type}-${lang}-${name}`;

            // 检查缓存
            if (this.tooltipData[cacheKey]) {
                this.showTooltip(this.tooltipData[cacheKey]);
                return;
            }

            // 请求数据
            const url = utils.getTooltipUrl(type, lang);
            utils.getScript(url, () => {
                if (window.d3typedata) {
                    if(window.d3typedata[name]){
                        const dataUrl = utils.getTooltipDataUrl(type, lang, window.d3typedata[name]);
                        utils.getScript(dataUrl, () => {
                            this.tooltipData[cacheKey] = window.d3_data;
                            this.showTooltip(window.d3_data);
                            window.d3_data = null;
                        }, 'gbk');
                    } else {
                        this.showError();
                    }
                } else {
                    this.showError();
                }
            }, 'gbk');
        }

        showTooltip(content) {
            clearTimeout(this.tooltipTimeout);
            this.tooltipInner.innerHTML = content;
            this.positionTooltip();
            this.tooltipWrapper.style.display = 'block';
        }

        showLoading() {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = setTimeout(() => {
                this.tooltipInner.innerHTML = '<div class="d3-tooltip"><div class="loading"></div></div>';
                this.positionTooltip();
                this.tooltipWrapper.style.display = 'block';
            }, this.tooltipDelay);
        }

        showError() {
            clearTimeout(this.tooltipTimeout);
            this.tooltipInner.innerHTML = '<div class="d3-tooltip" style="color:#fff;">无数据...</div>';
            this.positionTooltip();
            this.tooltipWrapper.style.display = 'block';
        }

        hideTooltip() {
            clearTimeout(this.tooltipTimeout);
            this.tooltipWrapper.style.display = 'none';
            this.currentLink = null;
        }

        positionTooltip() {
            if (!this.currentLink) return;

            const rect = this.currentLink.getBoundingClientRect();
            const scrollX = window.scrollX || document.documentElement.scrollLeft;
            const scrollY = window.scrollY || document.documentElement.scrollTop;

            let left = rect.right + 5;
            let top = rect.top + scrollY - this.tooltipWrapper.offsetHeight - 5;

            // 检查边界
            if (top < scrollY) {
                top = scrollY;
            }

            if (left + this.tooltipWrapper.offsetWidth > window.innerWidth + scrollX) {
                left = rect.left - this.tooltipWrapper.offsetWidth - 5;
            }

            this.tooltipWrapper.style.left = `${left}px`;
            this.tooltipWrapper.style.top = `${top}px`;
        }
    }

    // 页面加载完成后初始化
    window.addEventListener('DOMContentLoaded', () => {
        new D3Tooltip();

        // 初始转换所有diablo3db元素
        document.querySelectorAll('span.diablo3db').forEach(span => {
            const tooltip = new D3Tooltip();
            tooltip.convertToLink(span);
        });
    });

    // 如果页面是动态加载内容，添加MutationObserver
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList && node.classList.contains('diablo3db')) {
                    const tooltip = new D3Tooltip();
                    tooltip.convertToLink(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();