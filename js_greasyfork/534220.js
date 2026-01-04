// ==UserScript==
// @name         GitHub DeepWiki Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在GitHub仓库页面添加DeepWiki按钮，点击跳转到deepwiki.com/{user}/{repo}
// @author       You
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534220/GitHub%20DeepWiki%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/534220/GitHub%20DeepWiki%20Button.meta.js
// ==/UserScript==

/*
* 使用说明:
* 1. 安装油猴扩展(Tampermonkey): https://www.tampermonkey.net/
* 2. 点击油猴图标 -> 添加新脚本 -> 粘贴此脚本内容
* 3. 保存(Ctrl+S 或 Command+S)
* 4. 访问任意GitHub仓库页面，将会在菜单栏上看到"deepwiki"按钮
* 5. 点击按钮跳转到相应的DeepWiki页面
*/

(function () {
    'use strict';

    // 日志函数
    const log = (...args) => console.log('[DeepWiki Button]', ...args);

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
        svg.setAttribute('class', 'octicon');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '110 110 460 500');
        svg.setAttribute('style', 'margin-right:4px;vertical-align:text-bottom;');
        svg.innerHTML = `<path style="fill:#21c19a" d="M418.73,332.37c9.84-5.68,22.07-5.68,31.91,0l25.49,14.71c.82.48,1.69.8,2.58,1.06.19.06.37.11.55.16.87.21,1.76.34,2.65.35.04,0,.08.02.13.02.1,0,.19-.03.29-.04.83-.02,1.64-.13,2.45-.32.14-.03.28-.05.42-.09.87-.24,1.7-.59,2.5-1.03.08-.04.17-.06.25-.1l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-.08.04-.13.11-.2.16-.78.48-1.51,1.02-2.15,1.66-.1.1-.18.21-.28.31-.57.6-1.08,1.26-1.51,1.97-.07.12-.15.22-.22.34-.44.77-.77,1.6-1.03,2.47-.05.19-.1.37-.14.56-.22.89-.37,1.81-.37,2.76v29.43c0,11.36-6.11,21.95-15.95,27.63-9.84,5.68-22.06,5.68-31.91,0l-25.49-14.71c-.82-.48-1.69-.8-2.57-1.06-.19-.06-.37-.11-.56-.16-.88-.21-1.76-.34-2.65-.34-.13,0-.26.02-.4.02-.84.02-1.66.13-2.47.32-.13.03-.27.05-.4.09-.87.24-1.71.6-2.51,1.04-.08.04-.16.06-.24.1l-50.97,29.43c-3.65,2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22l50.97,29.43c.08.04.17.06.24.1.8.44,1.64.79,2.5,1.03.14.04.28.06.42.09.81.19,1.62.3,2.45.32.1,0,.19.04.29.04.04,0,.08-.02.13-.02.89,0,1.77-.13,2.65-.35.19-.04.37-.1.56-.16.88-.26,1.75-.59,2.58-1.06l25.49-14.71c9.84-5.68,22.06-5.68,31.91,0,9.84,5.68,15.95,16.27,15.95,27.63v29.43c0,.95.15,1.87.37,2.76.05.19.09.37.14.56.25.86.59,1.69,1.03,2.47.07.12.15.22.22.34.43.71.94,1.37,1.51,1.97.1.1.18.21.28.31.65.63,1.37,1.18,2.15,1.66.07.04.13.11.2.16l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-.08-.04-.16-.06-.24-.1-.8-.44-1.64-.8-2.51-1.04-.13-.04-.26-.05-.39-.09-.82-.2-1.65-.31-2.49-.33-.13,0-.25-.02-.38-.02-.89,0-1.78.13-2.66.35-.18.04-.36.1-.54.15-.88.26-1.75.59-2.58,1.07l-25.49,14.72c-9.84,5.68-22.07,5.68-31.9,0-9.84-5.68-15.95-16.27-15.95-27.63s6.11-21.95,15.95-27.63Z"></path><path style="fill:#3969ca" d="M141.09,317.65l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c.08-.04.13-.11.2-.16.78-.48,1.51-1.02,2.15-1.66.1-.1.18-.21.28-.31.57-.6,1.08-1.26,1.51-1.97.07-.12.15-.22.22-.34.44-.77.77-1.6,1.03-2.47.05-.19.1-.37.14-.56.22-.89.37-1.81.37-2.76v-29.43c0-11.36,6.11-21.95,15.96-27.63s22.06-5.68,31.91,0l25.49,14.71c.82.48,1.69.8,2.57,1.06.19.06.37.11.56.16.87.21,1.76.34,2.64.35.04,0,.09.02.13.02.1,0,.19-.04.29-.04.83-.02,1.65-.13,2.45-.32.14-.03.28-.05.41-.09.87-.24,1.71-.6,2.51-1.04.08-.04.16-.06.24-.1l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-.08.04-.13.11-.2.16-.78.48-1.51,1.02-2.15,1.66-.1.1-.18.21-.28.31-.57.6-1.08,1.26-1.51,1.97-.07.12-.15.22-.22.34-.44.77-.77,1.6-1.03,2.47-.05.19-.1.37-.14.56-.22.89-.37,1.81-.37,2.76v29.43c0,11.36-6.11,21.95-15.95,27.63-9.84,5.68-22.07,5.68-31.91,0l-25.49-14.71c-.82-.48-1.69-.8-2.58-1.06-.19-.06-.37-.11-.55-.16-.88-.21-1.76-.34-2.65-.35-.13,0-.26.02-.4.02-.83.02-1.66.13-2.47.32-.13.03-.27.05-.4.09-.87.24-1.71.6-2.51,1.04-.08.04-.16.06-.24.1l-50.97,29.43c-3.65,2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22Z"></path><path style="fill:#0294de" d="M396.88,484.35l-50.97-29.43c-.08-.04-.17-.06-.24-.1-.8-.44-1.64-.79-2.51-1.03-.14-.04-.27-.06-.41-.09-.81-.19-1.64-.3-2.47-.32-.13,0-.26-.02-.39-.02-.89,0-1.78.13-2.66.35-.18.04-.36.1-.54.15-.88.26-1.76.59-2.58,1.07l-25.49,14.72c-9.84,5.68-22.06,5.68-31.9,0-9.84-5.68-15.96-16.27-15.96-27.63v-29.43c0-.95-.15-1.87-.37-2.76-.05-.19-.09-.37-.14-.56-.25-.86-.59-1.69-1.03-2.47-.07-.12-.15-.22-.22-.34-.43-.71-.94-1.37-1.51-1.97-.1-.1-.18-.21-.28-.31-.65-.63-1.37-1.18-2.15-1.66-.07-.04-.13-.11-.2-.16l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-3.65,2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22l50.97,29.43c.08.04.17.06.25.1.8.44,1.63.79,2.5,1.03.14.04.29.06.43.09.8.19,1.61.3,2.43.32.1,0,.2.04.3.04.04,0,.09-.02.13-.02.88,0,1.77-.13,2.64-.34.19-.04.37-.1.56-.16.88-.26,1.75-.59,2.57-1.06l25.49-14.71c9.84-5.68,22.06-5.68,31.91,0,9.84,5.68,15.95,16.27,15.95,27.63v29.43c0,.95.15,1.87.37,2.76.05.19.09.37.14.56.25.86.59,1.69,1.03,2.47.07.12.15.22.22.34.43.71.94,1.37,1.51,1.97.1.1.18.21.28.31.65.63,1.37,1.18,2.15,1.66.07.04.13.11.2.16l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22Z"></path>`;
        return svg;
    }

    // 创建DeepWiki按钮
    function createDeepWikiButton(user, repo) {
        try {
            const deepwikiUrl = `https://deepwiki.com/${user}/${repo}`;

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
            button.href = deepwikiUrl;
            button.id = 'deepwiki-button';
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.title = `查看 ${user}/${repo} 的DeepWiki页面`;
            button.setAttribute('data-user', user);
            button.setAttribute('data-repo', repo);
            button.setAttribute('aria-label', `打开 DeepWiki 页面: ${user}/${repo}`);

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
            const text = document.createTextNode('deepwiki');
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
                log(`点击DeepWiki按钮: ${user}/${repo}`);
            });

            return button;
        } catch (e) {
            log('创建按钮时出错:', e);
            return null;
        }
    }

    // 添加按钮到页面
    function addDeepWikiButton() {
        try {
            if (!isRepoPage()) return;

            const userAndRepo = getUserAndRepo();
            if (!userAndRepo) return;

            // 防止重复添加按钮
            if (document.querySelector('#deepwiki-button')) return;

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
                    const deepWikiButton = createDeepWikiButton(userAndRepo.user, userAndRepo.repo);

                    if (deepWikiButton) {
                        // 创建一个容器放在最右侧
                        const container = document.createElement('div');
                        container.className = 'deepwiki-button-container';
                        container.style.marginLeft = 'auto'; // 将按钮推到最右侧
                        container.appendChild(deepWikiButton);

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

                        log(`成功添加DeepWiki按钮: ${userAndRepo.user}/${userAndRepo.repo}`);
                        return;
                    }
                }
            }

            // 如果以上方法都失败，尝试插入到"Star"或"Fork"按钮旁边
            const actionButtons = document.querySelectorAll('.pagehead-actions li, .flex-1 nav ul');
            if (actionButtons && actionButtons.length > 0) {
                const lastAction = actionButtons[actionButtons.length - 1];
                const deepWikiButton = createDeepWikiButton(userAndRepo.user, userAndRepo.repo);

                if (deepWikiButton) {
                    const wrapper = document.createElement('li');
                    if (lastAction.tagName === 'LI') {
                        wrapper.className = lastAction.className;
                    } else {
                        wrapper.style.marginLeft = '8px';
                    }
                    wrapper.appendChild(deepWikiButton);

                    lastAction.parentNode.appendChild(wrapper);
                    log(`成功添加DeepWiki按钮到操作区域: ${userAndRepo.user}/${userAndRepo.repo}`);
                    return;
                }
            }

            // 最后尝试添加到仓库名称右侧
            const repoNavLinks = document.querySelector('nav[aria-label="Repository"], .pagehead-actions');
            if (repoNavLinks) {
                const deepWikiButton = createDeepWikiButton(userAndRepo.user, userAndRepo.repo);
                if (deepWikiButton) {
                    const wrapper = document.createElement('div');
                    wrapper.style.display = 'inline-block';
                    wrapper.style.marginLeft = '8px';
                    wrapper.appendChild(deepWikiButton);

                    repoNavLinks.appendChild(wrapper);
                    log(`成功添加DeepWiki按钮到仓库导航区: ${userAndRepo.user}/${userAndRepo.repo}`);
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
                    setTimeout(addDeepWikiButton, 300); // 延迟执行，确保DOM已完全更新
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
            addDeepWikiButton();

            // 延迟再次尝试（GitHub有时需要额外时间加载）
            setTimeout(addDeepWikiButton, 500);
            setTimeout(addDeepWikiButton, 1000);
            setTimeout(addDeepWikiButton, 2000);

            setupMutationObserver();

            // 处理单页应用路由变化
            window.addEventListener('popstate', function () {
                setTimeout(addDeepWikiButton, 500);
            });

            // 监听URL变化
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    setTimeout(addDeepWikiButton, 500);
                }
            }).observe(document, { subtree: true, childList: true });

            // 定期检查按钮是否存在（备用方案）
            setInterval(addDeepWikiButton, 3000);
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