// ==UserScript==
// @name         B站|bilibili 收藏夹名称完全显示+高度调整
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAyZJREFUaEPtWlFy2jAQ3XXof5pewJkpmekpAidJ+IQeAnKIwifkJDin6EzoTNwDlOYA4O2sVIEsFFuSkQdm8CfI0r6VdvftkxHO/MEQ+7/8eH3cJtvsffgtD3nf9s71bNV7H3Yz3/m8AdzMVmMgmPBCBW5um4K4nv1MkTpzBOgBwmQ97D75gPAHMH19A8BULdIEBBufUOdtbzDl69HdbVQActGrZVMQh8bzjkLf9xh57wB7xwYCiQZ/vt8tXLx3LON5rSAATUBwsCYESx1oiOfV+8EAQkAcGk95gTjwPTY6+AMAYhHAByJKEWgXrNVHYx/Uchx9kF7NcXIsDamY0TICtg8m1mvBODzdLUU6eyEHzPWdgDOwfidX7V6IQDoxemEnV827T8ItKW0cwHBRRQ/8j6fNeY7pwGmkyZEc714ihpANMCb2a85ED2WDfUv6bGB2uoHIC7QGrwBpCo2ABGr0xXp6xBAdgHQhufVGpcdqPK2T5fGqRugkwJscp+G6Gg7wMYKFpMk90BFT6U3V0qtp24ORJESBdeBlypQwQBEsYNPY91Y624gLtbDr4O6uKiv/JLgEW4G+g41A1Bq/ewmsjf/jrr9OgCuvGs96pbIZjAAmYPLvXDJSMQF02Is6LdLVyYpO9wTQU9SdjvNNvvjZgBExS56gEmGRfGyTZjD+wVh1c4cgBLHsaxQNAJQdyza+P8CoA0vV61x2YGQHeCi55KZXOaOvgMmnVAFS5cfFY0IkVKiAmDjCXEu6gHBk6QZWqOEMOE6IceECcNRAezFATZaFSbKuW6YFMSVM5nHKjoAXlAVJPa2ukNQvwnPW8Qpl/N/4chcvRRzXCtHqE0AImFYZRVHXh/TWHNuqwDHmW2f/kqCRV7gtu/T7sUGY22CGEAV1xe6C9ZL37GNl1K/qZpL8e38xV3lPbvEGNu3YfPrrWu557TqpGGLxHrL7LutV0xIMG73poavpA77YiW5sDM4FgugZ5MEOl3yWZVhOJ6Cbc2EjgKzEwBbpmpyNWo7Xqbq4foFgDMARdSuCkqP/aGHnJvFs86DTgJd4sgLgMuEbY/5B0Ybna/xpe4TAAAAAElFTkSuQmCC
// @namespace    https://sumver.cn
// @version      0.0.7
// @description  B站|bilibili 收藏夹名称完全显示+高度自适应或完全铺开
// @author       lonelylizard
// @match        https://space.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/494652/B%E7%AB%99%7Cbilibili%20%E6%94%B6%E8%97%8F%E5%A4%B9%E5%90%8D%E7%A7%B0%E5%AE%8C%E5%85%A8%E6%98%BE%E7%A4%BA%2B%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/494652/B%E7%AB%99%7Cbilibili%20%E6%94%B6%E8%97%8F%E5%A4%B9%E5%90%8D%E7%A7%B0%E5%AE%8C%E5%85%A8%E6%98%BE%E7%A4%BA%2B%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==




(function () {
    'use strict';

    // 创建一个 MutationObserver 实例来监听 DOM 变化
    let observer = null;

    // 收起收藏夹时，隐藏收藏夹区域，其他收藏夹才能顶上去
    function handleCollapseItemHidden(targetElement) {
        let css = `
            .vui_collapse_item{
                max-height: unset !important;
            }
            .fav-collapse, .vui_collapse_item {
                height: unset !important;
            }
            `
        setStyle(css)
    }

    // 启动对特定元素的监听
    function startObserving(targetNode) {
        // 如果没有提供有效的 targetNode，则不启动监听
        if (!targetNode) {
            console.warn('startObserving: 未提供有效的 targetNode');
            return;
        }

        // 配置要观察的选项
        const config = {
            attributes: true, // 观察属性变化
            attributeFilter: ['style'], // 只关心 'style' 属性的变化
            subtree: true // 观察所有后代节点
        };

        // 回调函数，当观察到变动时执行
        const callback = function(mutationsList, _observer) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.classList && target.classList.contains('vui_collapse_item_content')) {
                         const computedStyle = window.getComputedStyle(target);
                         // 如果用户折叠了收藏夹，则隐藏收藏夹区域
                         if (computedStyle.display === 'none' ||
                             (target.style && target.style.cssText && target.style.cssText.includes('display: none'))) {
                            handleCollapseItemHidden(target);
                         }
                    }
                }
            }
        };

        // 如果已有旧的 observer，先断开连接
        if (observer) {
             observer.disconnect();
        }
        // 创建新的 observer 实例
        observer = new MutationObserver(callback);
        // 开始观察传入的 targetNode
        observer.observe(targetNode, config);
        // console.log('MutationObserver 已启动，观察目标:', targetNode);
    }

    // 停止监听
    function stopObserving() {
        if (observer) {
             observer.disconnect();
             observer = null;
             // console.log('MutationObserver 已停止');
        }
    }


    // 注册右键菜单命令
    const fold_fn_menu = GM_registerMenuCommand("收藏夹设置", function () {
        let cur_choose = window.confirm("当前状态:\n" + (GM_getValue("fold_status") === true ? "始终展示全部收藏夹（无滚动条）" : "收藏夹高度自适应（可能有滚动条）") +
            "\n\n按【确认】修改为" + (GM_getValue("fold_status") === true ? "收藏夹高度自适应（可能有滚动条）" : "始终展示全部收藏夹（无滚动条）") + "，按【取消】保持设置不变\n设置后请手动刷新一次网页");
        if (cur_choose) {
            GM_setValue("fold_status", !GM_getValue("fold_status"));
        }
    });

    // 样式注入函数
    function setStyle(css) {
        let css_list = css.split("}");
        css_list.forEach((item, index, array) => {
            GM_addStyle(item + "}")
        });
    }

    // 折叠处理函数
    function fold_fn() {
        // === 新增：修复收藏夹名称换行显示 ===
        let css = `
                /* 收藏项高度自适应 */
                .fav-sidebar-item,
                .vui_sidebar-item {
                    height: auto !important;
                    min-height: unset !important;
                    padding: 4px 4px !important;
                }

                /* 标题容器：支持多行文本 */
                .vui_sidebar-item-title {
                    display: flex !important;
                    align-items: flex-start !important;
                    height: auto !important;
                    line-height: 1.4 !important;
                    padding: 2px 0 !important;
                    gap: 8px; /* 图标与文字间距 */
                }

            /* 自动换行（考虑了以前允许合集标题超过20个字的可能（撑开高度，多行显示） */
            .fav-sidebar-item .vui_sidebar-item-title .vui_ellipsis.multi-mode {
                display: block !important;
                -webkit-line-clamp: unset !important;
                -webkit-box-orient: unset !important;
                overflow: visible !important;
                text-overflow: clip !important;
                white-space: normal !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
                word-break: normal !important;
                min-width: 0 !important;
                max-width:150px !important;/* 150px是最佳宽度，再大会产生抖动 */
                flex: 1; /* 占据剩余空间 */
            }

            /* 右侧数字：保持右对齐 */
            .vui_sidebar-item-right {
                align-self: flex-start !important;
                margin-top: 2px !important;
                white-space: nowrap !important;
            }

        `;
        setStyle(css);

        // 高度逻辑处理
        if (GM_getValue("fold_status")) {
            let scrollHeight = document.querySelector(".fav-sortable-list")?.scrollHeight || 0;
            if (scrollHeight > 0) {
                let css_folded = `
                .fav-collapse-wrap {
                    max-height: unset !important;
                }
            `;
                setStyle(css_folded);
            }
        } else {
            let fav_height = document.querySelector(".fav-sortable-list")?.scrollHeight || 0;
            let res_height = window.innerHeight;
            let dif_height = res_height - 320;

            if (fav_height > dif_height) {
                let css_responsive = `
                .fav-collapse, .vui_collapse_item {
                    height: ${dif_height}px !important;
                }
                .vui_collapse_item {
                    max-height: ${dif_height + 30}px !important;
                }
                .fav-collapse-wrap {
                    max-height: ${dif_height}px !important;
                    height: ${dif_height - 50}px !important;
                }
            `;
                setStyle(css_responsive);
            } else {
                let css_full = `
                .fav-collapse, .vui_collapse_item, .fav-collapse-wrap {
                    height: 100% !important;
                }
                .fav-collapse-wrap {
                    max-height: 100% !important;
                }
            `;
                setStyle(css_full);
            }
        }
    }

    // 等待收藏夹异步加载完成，获取到高度后才能进行处理（scrollHeight > 0）
    function waitForElementWithScroll(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    if (element.scrollHeight > 0) {
                        resolve(element);
                    } else {
                        setTimeout(checkElement, 100);
                    }
                } else {
                    // console.log("未找到目标元素：" + selector);
                    const now = Date.now();
                    if (now - startTime < timeout) {
                        setTimeout(checkElement, 100);
                    } else {
                        // reject(new Error("等待元素出现超时：" + selector));
                    }
                }
            };

            checkElement(); // 立即开始检测
        });
    }

    // 主运行函数
    function run() {
        // 等待列表异步加载
        waitForElementWithScroll('.fav-sortable-list', 5000)
            .then(() => {
                // .fav-sortable-list 加载完成后，执行原有的折叠处理逻辑
                fold_fn();

                // 监听收藏区域父节点，方便后面监听折叠操作
                return waitForElementWithScroll('.favlist-aside', 3000);
            })
            .then((favlistAsideElement) => {
                // .favlist-aside 也加载完成后，使用它作为观察目标启动 MutationObserver
                if (favlistAsideElement) {
                    startObserving(favlistAsideElement);
                }
            })
            .catch(error => {
                console.warn("run: 等待元素失败：", error.message);
                // 即使等待失败，也尝试启动监听（如果能找到 .favlist-aside），以防元素稍后加载
                const fallbackTarget = document.querySelector('.favlist-aside');
                if (fallbackTarget) {
                   startObserving(fallbackTarget);
                } else {
                    console.warn('run catch: 仍未找到 .favlist-aside 元素，MutationObserver 未启动。');
                }
            });
    }


    // 页面加载完成后执行
    window.addEventListener('DOMContentLoaded', function () {
        run();
    });

    // 监听窗口变化和页面切换
    const debounce = (fn, delay) => {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(() => fn(), delay);
        };
    };

    window.addEventListener('resize', debounce(run, 500));
    window.addEventListener('pushState', run);
    window.addEventListener('replaceState', run);
    window.onpopstate = run;

    // 重写 history 方法以便监听页面切换
    const bindEventListener = function (type) {
        const historyEvent = history[type];
        return function () {
            const newEvent = historyEvent.apply(this, arguments);
            const e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return newEvent;
        };
    };
    history.pushState = bindEventListener('pushState');
    history.replaceState = bindEventListener('replaceState');

    // 在脚本卸载时清理资源
    window.addEventListener('beforeunload', function() {
        stopObserving();
    });

})();