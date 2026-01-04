// ==UserScript==
// @name         GitHub ZRead.AI Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在GitHub仓库页面添加ZRead.AI按钮，点击跳转到zread.ai/{user}/{repo}
// @author       huhu
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544266/GitHub%20ZReadAI%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/544266/GitHub%20ZReadAI%20Button.meta.js
// ==/UserScript==

/*
* 使用说明:
* 1. 安装油猴扩展(Tampermonkey): https://www.tampermonkey.net/
* 2. 点击油猴图标 -> 添加新脚本 -> 粘贴此脚本内容
* 3. 保存(Ctrl+S 或 Command+S)
* 4. 访问任意GitHub仓库页面，将会在菜单栏上看到"zread.ai"按钮
* 5. 点击按钮跳转到相应的ZRead.AI页面
*/

(function () {
    'use strict';

    // 日志函数
    const log = (...args) => console.log('[ZRead.AI Button]', ...args);

    // 检查是否在仓库页面
    function isRepoPage() {
        try {
            return document.querySelector('main#js-repo-pjax-container') !== null ||
                document.querySelector('div[data-pjax="#repo-content-pjax-container"]') !== null ||
                (window.location.pathname.split('/').filter(Boolean).length >= 2 &&
                    !window.location.pathname.includes('/settings') &&
                    !window.location.pathname.includes('/issues'));
        } catch (e) {
            log('检查仓库页面时出错:', e);
            return false;
        }
    }

    // 获取用户名和仓库名
    function getUserAndRepo() {
        try {
            const pathParts = window.location.pathname.split('/').filter(part => part.length > 0);
            if (pathParts.length >= 2) {
                return {
                    user: pathParts[0],
                    repo: pathParts[1]
                };
            }
        } catch (e) {
            log('获取用户和仓库信息时出错:', e);
        }
        return null;
    }

    // 创建SVG图标元素
    function createSVGIconElement() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('data-view-component', 'true');
        svg.setAttribute('class', 'v-align-middle');
        svg.setAttribute('style', 'margin-right:4px;vertical-align:text-bottom;');
        svg.innerHTML = `
            <path d="M9.91922 3.2002H4.47922C3.77229 3.2002 3.19922 3.77327 3.19922 4.4802V9.9202C3.19922 10.6271 3.77229 11.2002 4.47922 11.2002H9.91922C10.6261 11.2002 11.1992 10.6271 11.1992 9.9202V4.4802C11.1992 3.77327 10.6261 3.2002 9.91922 3.2002Z" fill="currentColor"></path>
            <path d="M9.91922 20.7998H4.47922C3.77229 20.7998 3.19922 21.3729 3.19922 22.0798V27.5198C3.19922 28.2267 3.77229 28.7998 4.47922 28.7998H9.91922C10.6261 28.7998 11.1992 28.2267 11.1992 27.5198V22.0798C11.1992 21.3729 10.6261 20.7998 9.91922 20.7998Z" fill="currentColor"></path>
            <path d="M27.5208 3.2002H22.0808C21.3739 3.2002 20.8008 3.77327 20.8008 4.4802V9.9202C20.8008 10.6271 21.3739 11.2002 22.0808 11.2002H27.5208C28.2277 11.2002 28.8008 10.6271 28.8008 9.9202V4.4802C28.8008 3.77327 28.2277 3.2002 27.5208 3.2002Z" fill="currentColor"></path>
            <path d="M8 24L24 8L8 24Z" fill="currentColor"></path>
            <path d="M8 24L24 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        `;
        return svg;
    }

    // 创建ZRead.AI按钮
    function createZReadAIButton(user, repo) {
        try {
            const zreadaiUrl = `https://zread.ai/${user}/${repo}`;

            // 查找页面上已存在的按钮来模仿其样式
            const existingButtons = document.querySelectorAll('.btn-sm, [data-hydro-click]');
            let templateButton = null;
            for (const btn of existingButtons) {
                if (btn.textContent.includes('Fork') || btn.textContent.includes('Star') ||
                    btn.textContent.includes('Watch') || btn.textContent.includes('Code')) {
                    templateButton = btn;
                    break;
                }
            }

            // 创建按钮元素
            const button = document.createElement('a');
            button.href = zreadaiUrl;
            button.id = 'zreadai-button';
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.title = `查看 ${user}/${repo} 的ZRead.AI页面`;
            button.setAttribute('data-user', user);
            button.setAttribute('data-repo', repo);
            button.setAttribute('aria-label', `打开 ZRead.AI 页面: ${user}/${repo}`);

            // 如果找到了模板按钮，复制其类名和样式
            if (templateButton) {
                const classNames = Array.from(templateButton.classList)
                    .filter(cls => !cls.includes('selected') && !cls.includes('disabled') &&
                        !cls.includes('tooltipped') && !cls.includes('BtnGroup'));
                button.className = classNames.join(' ');
            } else {
                button.className = 'btn btn-sm';
            }

            // 添加SVG图标
            const svgIcon = createSVGIconElement();
            button.appendChild(svgIcon);

            // 添加文本
            const text = document.createTextNode('zread.ai');
            button.appendChild(text);

            // 如果没有模板按钮，应用基本样式确保可见
            if (!templateButton) {
                button.style.backgroundColor = '#f6f8fa';
                button.style.border = '1px solid rgba(27,31,36,0.15)';
                button.style.borderRadius = '6px';
                button.style.color = '#24292f';
                button.style.padding = '3px 12px';
                button.style.fontSize = '12px';
                button.style.fontWeight = '500';
                button.style.lineHeight = '20px';
                button.style.textDecoration = 'none';
            }

            // 添加点击事件跟踪
            button.addEventListener('click', function (e) {
                log(`点击ZRead.AI按钮: ${user}/${repo}`);
            });

            return button;
        } catch (e) {
            log('创建按钮时出错:', e);
            return null;
        }
    }

    // 添加按钮到页面
    function addZReadAIButton() {
        try {
            if (!isRepoPage()) return;

            const userAndRepo = getUserAndRepo();
            if (!userAndRepo) return;

            // 防止重复添加按钮
            if (document.querySelector('#zreadai-button')) return;

            // 尝试在最右侧添加按钮
            const targetSelectors = [
                '.file-navigation',                     // 文件导航区域
                '.d-flex.mb-3.px-3.px-md-4.px-lg-5',    // 新版GitHub界面头部
                '#repository-container-header .d-flex'  // 仓库容器头部
            ];

            for (const selector of targetSelectors) {
                const targetElements = document.querySelectorAll(selector);
                if (targetElements && targetElements.length > 0) {
                    const targetElement = targetElements[0];
                    const zreadaiButton = createZReadAIButton(userAndRepo.user, userAndRepo.repo);

                    if (zreadaiButton) {
                        // 创建一个容器放在最右侧
                        const container = document.createElement('div');
                        container.className = 'zreadai-button-container';
                        container.style.marginLeft = 'auto'; // 将按钮推到最右侧
                        container.appendChild(zreadaiButton);

                        // 特殊处理文件导航区域，需要放在特定位置
                        if (selector === '.file-navigation') {
                            const actionsContainer = targetElement.querySelector('.d-flex');
                            if (actionsContainer) {
                                actionsContainer.appendChild(container);
                            } else {
                                targetElement.appendChild(container);
                            }
                        } else {
                            targetElement.appendChild(container);
                        }

                        log(`成功添加ZRead.AI按钮: ${userAndRepo.user}/${userAndRepo.repo}`);
                        return;
                    }
                }
            }

            // 如果以上方法都失败，尝试插入到"Star"或"Fork"按钮旁边
            const actionButtons = document.querySelectorAll('.pagehead-actions li, .flex-1 nav ul');
            if (actionButtons && actionButtons.length > 0) {
                const lastAction = actionButtons[actionButtons.length - 1];
                const zreadaiButton = createZReadAIButton(userAndRepo.user, userAndRepo.repo);

                if (zreadaiButton) {
                    const wrapper = document.createElement('li');
                    if (lastAction.tagName === 'LI') {
                        wrapper.className = lastAction.className;
                    } else {
                        wrapper.style.marginLeft = '8px';
                    }
                    wrapper.appendChild(zreadaiButton);

                    lastAction.parentNode.appendChild(wrapper);
                    log(`成功添加ZRead.AI按钮到操作区域: ${userAndRepo.user}/${userAndRepo.repo}`);
                    return;
                }
            }

            // 最后尝试添加到仓库名称右侧
            const repoNavLinks = document.querySelector('nav[aria-label="Repository"], .pagehead-actions');
            if (repoNavLinks) {
                const zreadaiButton = createZReadAIButton(userAndRepo.user, userAndRepo.repo);
                if (zreadaiButton) {
                    const wrapper = document.createElement('div');
                    wrapper.style.display = 'inline-block';
                    wrapper.style.marginLeft = '8px';
                    wrapper.appendChild(zreadaiButton);

                    repoNavLinks.appendChild(wrapper);
                    log(`成功添加ZRead.AI按钮到仓库导航区: ${userAndRepo.user}/${userAndRepo.repo}`);
                    return;
                }
            }

            log('未找到合适的位置添加按钮');
        } catch (e) {
            log('添加按钮时出错:', e);
        }
    }

    // 处理页面动态加载
    function setupMutationObserver() {
        try {
            const observer = new MutationObserver(function (mutations) {
                let shouldCheck = false;

                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        shouldCheck = true;
                    }
                });

                if (shouldCheck) {
                    setTimeout(addZReadAIButton, 300); // 延迟执行，确保DOM已完全更新
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            log('成功设置MutationObserver');
        } catch (e) {
            log('设置MutationObserver时出错:', e);
        }
    }

    // 初始化
    function init() {
        try {
            log('初始化脚本...');

            // 立即尝试添加按钮
            addZReadAIButton();

            // 延迟再次尝试（GitHub有时需要额外时间加载）
            setTimeout(addZReadAIButton, 500);
            setTimeout(addZReadAIButton, 1000);
            setTimeout(addZReadAIButton, 2000);

            setupMutationObserver();

            // 处理单页应用路由变化
            window.addEventListener('popstate', function () {
                setTimeout(addZReadAIButton, 500);
            });

            // 监听URL变化
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    setTimeout(addZReadAIButton, 500);
                }
            }).observe(document, { subtree: true, childList: true });

            // 定期检查按钮是否存在（备用方案）
            setInterval(addZReadAIButton, 3000);
        } catch (e) {
            log('初始化时出错:', e);
        }
    }

    // 当页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
