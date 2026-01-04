// ==UserScript==
// @name         GitHub Issue 快速编辑器
// @namespace    https://github.com/
// @version      0.2.2
// @description  通过点击 GitHub Issue 标题栏快速进入编辑模式
// @author       RainbowBird
// @match        https://github.com/*/*/issues/*
// @match        https://github.com/*/*/issues
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528644/GitHub%20Issue%20%E5%BF%AB%E9%80%9F%E7%BC%96%E8%BE%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528644/GitHub%20Issue%20%E5%BF%AB%E9%80%9F%E7%BC%96%E8%BE%91%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    const styles = `
        .issue-title-hover {
            transition: background-color 0.2s ease;
            position: relative;
            overflow: hidden;
        }

        .issue-title-hover:hover {
            background-color: rgba(180, 180, 180, 0.1);
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(0, 120, 215, 0.2);
            transform: scale(0);
            animation: ripple-effect 0.6s linear;
            z-index: 0;
        }

        @keyframes ripple-effect {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;

    // 添加样式到页面
    const addStyle = (css) => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    addStyle(styles);

    /**
     * GitHub Issue快速编辑器主类
     */
    class IssueQuickEditor {
        constructor() {
            this.initialized = false;
            this.titleBar = null;
            this.isEditing = false;
            this.config = {
                selectors: {
                    issueBody: '.IssueBodyViewer-module__IssueBody--MXyFt',
                    markdownBody: '[data-testid="markdown-body"]',
                    actionButton: 'span:has(> span:contains("Issue body actions"))',
                    portalRoot: '#__primerPortalRoot__'
                },
                styles: {
                    cursor: 'pointer'
                },
                tooltips: {
                    titleBar: '点击编辑Issue'
                },
                maxAttempts: {
                    loadWait: 20,
                    menuItemWait: 10
                },
                animationDuration: {
                    ripple: 600
                }
            };
        }

        /**
         * 初始化编辑器
         */
        init() {
            if (this.initialized) {
                console.log('Issue快速编辑功能已初始化，跳过');
                return;
            }

            this.waitForElements()
                .then(() => this.setupTitleBar())
                .catch(error => console.error('初始化失败:', error));
        }

        /**
         * 等待关键元素加载
         */
        waitForElements() {
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const checkInterval = setInterval(() => {
                    const issueBodyContainer = document.querySelector(this.config.selectors.issueBody);
                    attempts++;

                    if (issueBodyContainer) {
                        clearInterval(checkInterval);
                        resolve();
                    } else if (attempts >= this.config.maxAttempts.loadWait) {
                        clearInterval(checkInterval);
                        reject(new Error('页面元素加载超时'));
                    }
                }, 500);
            });
        }

        /**
         * 定位标题栏元素
         */
        findTitleBar() {
            const issueBodyContainer = document.querySelector(this.config.selectors.issueBody);
            if (!issueBodyContainer) {
                throw new Error('找不到Issue正文容器');
            }

            const titleBar = issueBodyContainer.previousElementSibling;
            if (!titleBar || titleBar.tagName !== 'DIV') {
                throw new Error('无法找到标题栏');
            }

            return titleBar;
        }

        /**
         * 创建水波纹动画效果
         */
        createRippleEffect(event) {
            const rect = this.titleBar.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const size = Math.max(rect.width, rect.height);

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;

            this.titleBar.appendChild(ripple);
            setTimeout(() => ripple.remove(), this.config.animationDuration.ripple);
        }

        /**
         * 设置标题栏样式和事件
         */
        setupTitleBar() {
            try {
                this.titleBar = this.findTitleBar();
                this.titleBar.style.cursor = this.config.styles.cursor;
                this.titleBar.title = this.config.tooltips.titleBar;
                this.titleBar.classList.add('issue-title-hover');
                this.titleBar.addEventListener('click', this.handleTitleBarClick.bind(this));
                this.initialized = true;
                console.log('Issue快速编辑功能已启用 - 点击标题栏触发编辑');
            } catch (error) {
                console.error('设置标题栏失败:', error);
            }
        }

        /**
         * 处理标题栏点击事件
         */
        handleTitleBarClick(event) {
            if (event.target.tagName === 'A' ||
                event.target.tagName === 'BUTTON' ||
                event.target.closest('a') ||
                event.target.closest('button')) {
                return;
            }

            if (this.isEditing) {
                return;
            }

            try {
                this.isEditing = true;
                this.createRippleEffect(event);
                this.startEditMode();
            } catch (error) {
                console.error('编辑操作失败:', error);
                this.isEditing = false;
            }
        }

        /**
         * 启动编辑模式（使用React Fiber）
         */
        startEditMode() {
            try {
                const actionSpan = document.evaluate(
                    "//*/text()[normalize-space(.)='Issue body actions']/parent::*",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                const actionButton = actionSpan?.parentNode.querySelector('button');
                if (!actionButton) {
                    throw new Error('找不到操作按钮');
                }

                const parentNode = actionButton.parentNode;
                const fiber = this.getReactFiber(parentNode);
                if (!fiber) {
                    throw new Error('找不到React Fiber');
                }

                const props = fiber.memoizedProps;
                if (props && props.children && props.children[1] && props.children[1].props) {
                    const startEditFunc = props.children[1].props.startIssueBodyEdit;
                    if (typeof startEditFunc === 'function') {
                        startEditFunc(true);
                        this.watchForEditModeEnd();
                        return;
                    }
                }

                throw new Error('无法找到startIssueBodyEdit方法');
            } catch (error) {
                console.error('启动编辑模式失败:', error);
                this.isEditing = false;
            }
        }

        /**
         * 获取React Fiber
         */
        getReactFiber(element) {
            for (const key in element) {
                if (key.startsWith('__reactFiber$')) {
                    return element[key];
                }
            }
            return null;
        }

        /**
         * 监听编辑模式结束
         */
        watchForEditModeEnd() {
            const checkForEditForm = () => {
                const editForm = document.querySelector('form.js-quick-submit');
                if (!editForm) {
                    this.isEditing = false;
                    return;
                }
                setTimeout(checkForEditForm, 1000);
            };
            setTimeout(checkForEditForm, 1000);
        }
    }

    // 创建并初始化编辑器实例
    const editor = new IssueQuickEditor();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => editor.init());
    } else {
        setTimeout(() => editor.init(), 500);
    }
})();
