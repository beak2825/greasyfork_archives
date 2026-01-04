// ==UserScript==
// @name         综调优化
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  清除水印+统一字体大小
// @author       moonscimitar
// @match        *://10.53.160.88*/*
// @exclude      *://10.53.160.88*/portal/
// @exclude      *://10.53.160.88*/nms/soc/sqm/pretreament/main.jsp*
// @exclude      *://10.53.160.88*/portal/outSystem/sse.do?s=soc&title=PON%E7%BB%B4%E6%8A%A4%E6%B5%8B%E8%AF%95&redirect_uri=%2Fnms%2Fsoc%2Fsqm%2Fpretreament%2Ftesttool.jsp
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525837/%E7%BB%BC%E8%B0%83%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/525837/%E7%BB%BC%E8%B0%83%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 性能优化配置 ==========
    const CONFIG = {
        FONT: {
            original: 10,
            target: 13,
            forceImportant: true,
            // 添加过滤条件
            excludedParents: ['svg', 'canvas', 'video'] // 排除图形元素
        },
        WATERMARK: {
            selector: '[id^="mask_div"]:not([id*="__"]), .watermark',
            scanInterval: 1500,  // 延长扫描间隔
            useIdleCallback: true // 启用空闲处理
        },
        THROTTLE: {
            mutationObserver: 300, // MutationObserver防抖阈值
            rafBatchSize: 50      // 每帧处理元素数
        }
    };

    // ========== 样式预注入 ==========
    GM_addStyle(`
        ${CONFIG.WATERMARK.selector} {
            display:none !important;
            visibility:hidden !important;
            opacity:0 !important;
        }
        * {
            font-size: ${CONFIG.FONT.target}px ${CONFIG.FONT.forceImportant ? '!important' : ''};
        }
    `);

    // ========== 性能优化工具 ==========
    const Perf = {
        // 防抖函数（带RAF）
        debounceRAF: (func) => {
            let isRunning = false;
            return (...args) => {
                if (!isRunning) {
                    isRunning = true;
                    requestAnimationFrame(() => {
                        func(...args);
                        isRunning = false;
                    });
                }
            };
        },

        // 分帧处理
        chunkProcess: (items, processItem, ctx) => {
            let index = 0;
            const run = () => {
                const start = Date.now();
                while (index < items.length &&
                      (Date.now() - start) < 3) { // 每帧最多处理3ms
                    processItem.call(ctx, items[index], index);
                    index++;
                }
                if (index < items.length) {
                    requestAnimationFrame(run);
                }
            };
            requestAnimationFrame(run);
        }
    };

    // ========== DOM处理模块 ==========
    const DOM = {
        // 安全遍历iframe（优化递归）
        walkFrames: function(root, callback) {
            const frames = root.querySelectorAll('iframe:not([data-processed])');
            frames.forEach(iframe => {
                try {
                    if (iframe.contentDocument) {
                        iframe.dataset.processed = 'true'; // 标记已处理
                        callback(iframe.contentDocument);
                        this.walkFrames(iframe.contentDocument, callback);
                    }
                } catch (e) {
                    console.log('安全策略限制:', e);
                }
            });
        },

        // 优化的MutationObserver
        createObserver: function(target) {
            const debouncedProcess = Perf.debounceRAF(() => {
                this.processMutations(target.ownerDocument);
            });

            new MutationObserver(mutations => {
                const hasSignificantChange = mutations.some(mut => {
                    return mut.addedNodes.length > 0 ||
                           mut.removedNodes.length > 0;
                });
                if (hasSignificantChange) debouncedProcess();
            }).observe(target, {
                subtree: true,
                childList: true,
                attributes: false,
                attributeFilter: ['style']
            });
        },

        // 批量处理变动
        processMutations: (doc) => {
            FontAdjuster.optimizedProcess(doc);
            WatermarkKiller.optimizedRemoval(doc);
        }
    };

    // ========== 字体调整优化 ==========
    const FontAdjuster = {
        optimizedProcess: function(root) {
            const elements = root.querySelectorAll(this.getFilterSelector());
            Perf.chunkProcess(elements, this.processElement);
        },

        getFilterSelector: () => {
            const excluded = CONFIG.FONT.excludedParents
                .map(tag => `:not(${tag})`).join('');
            return `*${excluded}`;
        },

        processElement: function(ele) {
            const inlineSize = ele.style.fontSize;
            if (inlineSize && parseInt(inlineSize) === CONFIG.FONT.original) {
                ele.style.fontSize = `${CONFIG.FONT.target}px`;
                return;
            }

            if (!inlineSize) {
                const computed = parseFloat(getComputedStyle(ele).fontSize);
                if (computed === CONFIG.FONT.original) {
                    ele.style.setProperty(
                        'font-size',
                        `${CONFIG.FONT.target}px`,
                        'important'
                    );
                }
            }
        }
    };

    // ========== 水印清除优化 ==========
    const WatermarkKiller = {
        processedElements: new WeakSet(),

        optimizedRemoval: function(root) {
            const elements = root.querySelectorAll(CONFIG.WATERMARK.selector);
            Perf.chunkProcess(elements, this.processElement);

            DOM.walkFrames(root, (doc) => {
                const frameElements = doc.querySelectorAll(CONFIG.WATERMARK.selector);
                Perf.chunkProcess(frameElements, this.processElement);
            });
        },

        processElement: function(ele) {
            if (!this.processedElements.has(ele)) {
                console.log('移除水印节点:', ele);
                ele.remove();
                this.processedElements.add(ele);
            }
        }
    };

    // ========== 核心控制器优化 ==========
    function masterControl(root) {
        FontAdjuster.optimizedProcess(root);
        WatermarkKiller.optimizedRemoval(root);
    }

    // ========== 初始化优化 ==========
    (function init() {
        // 主文档初始化
        DOM.createObserver(document);
        masterControl(document);

        // 空闲时段处理
        const scheduleIdleTask = () => {
            if (CONFIG.WATERMARK.useIdleCallback) {
                requestIdleCallback(() => {
                    masterControl(document);
                    scheduleIdleTask();
                }, { timeout: 2000 });
            } else {
                setTimeout(scheduleIdleTask, CONFIG.WATERMARK.scanInterval);
            }
        };
        scheduleIdleTask();

        // 事件监听优化
        const delayedMaster = Perf.debounceRAF(masterControl);
        window.addEventListener('load', () => delayedMaster(document));
        document.addEventListener('readystatechange', () => {
            if (document.readyState === 'interactive') {
                delayedMaster(document);
            }
        });
    })();
})();