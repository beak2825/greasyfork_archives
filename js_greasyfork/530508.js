// ==UserScript==
// @name        huggingface与hf-mirror相互跳转与modelscope跳转
// @namespace   http://tampermonkey.net/
// @version     2.1
// @description 在 Hugging Face、hf-mirror.com 和 modelscope.cn 的页面添加相互跳转链接，支持 Model card, Files, Discussions 精准映射，并优化 SPA 稳定性。
// @author      flyway + Gemini
// @match       https://huggingface.co/*
// @match       https://hf-mirror.com/*
// @match       https://modelscope.cn/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/530508/huggingface%E4%B8%8Ehf-mirror%E7%9B%B8%E4%BA%92%E8%B7%B3%E8%BD%AC%E4%B8%8Emodelscope%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/530508/huggingface%E4%B8%8Ehf-mirror%E7%9B%B8%E4%BA%92%E8%B7%B3%E8%BD%AC%E4%B8%8Emodelscope%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;
    var isMirrorPage = currentUrl.includes('hf-mirror.com');
    var isModelScopePage = currentUrl.includes('modelscope.cn');
    var isHuggingFacePage = currentUrl.includes('huggingface.co');

    // ModelScope 的 Tab 结构颜色和样式
    const MS_HF_COLOR = 'orange'; // 切换到 HuggingFace
    const MS_HFM_COLOR = 'green';  // 切换到 hf-mirror
    const MS_MODEL_SCOPE_COLOR = '#816DF8'; // 切换到 ModelScope

    // --- 辅助函数：Tab 容器和元素创建 ---

    function getTabContainer() {
        var hfContainer = document.querySelector('div.-mb-px.flex.h-12.items-center.overflow-x-auto.overflow-y-hidden');
        if (hfContainer) return hfContainer;

        var msNav = document.querySelector('div.antd5-tabs-nav');
        if (msNav) {
            return msNav.querySelector('div.antd5-tabs-nav-list');
        }

        return null;
    }

    function createMsJumpTab(text, href, color, className) {
        var tabDiv = document.createElement('div');
        tabDiv.className = 'antd5-tabs-tab ' + className;
        tabDiv.setAttribute('data-node-key', className);

        var tabBtnDiv = document.createElement('div');
        tabBtnDiv.className = 'antd5-tabs-tab-btn';
        tabBtnDiv.setAttribute('role', 'tab');
        tabBtnDiv.setAttribute('aria-selected', 'false');
        tabBtnDiv.setAttribute('tabindex', '0');

        var link = document.createElement('a');
        link.href = href;
        link.target = '_blank';

        var textWrapperDiv = document.createElement('div');
        textWrapperDiv.className = 'modelDetail_tabs_icon';
        textWrapperDiv.textContent = text;
        textWrapperDiv.style.color = color;
        textWrapperDiv.style.fontWeight = 'bold';
        textWrapperDiv.style.padding = '0 10px';

        link.appendChild(textWrapperDiv);
        tabBtnDiv.appendChild(link);
        tabDiv.appendChild(tabBtnDiv);

        return tabDiv;
    }


    // --- 核心 URL 转换逻辑（基于 Tab 路径映射） ---

    /**
     * 将 ModelScope URL 转换为 Hugging Face URL，并精确映射 Tab 路径
     */
    function convertMsToHfUrl(url) {
        var targetUrl = url.replace('modelscope.cn', 'huggingface.co');

        // 1. 移除 /models/ 前缀
        targetUrl = targetUrl.replace(/\/models\//, '/');

        // 2. 移除和替换 ModelScope 的 Tab 路径为 HF 对应的路径
        // 路径映射：/summary -> '' (根目录); /files -> /tree/main; /feedback -> /discussions
        if (targetUrl.includes('/summary')) {
            targetUrl = targetUrl.replace(/\/summary/g, '');
        } else if (targetUrl.includes('/files')) {
            targetUrl = targetUrl.replace(/\/files/g, '/tree/main');
        } else if (targetUrl.includes('/feedback')) {
            targetUrl = targetUrl.replace(/\/feedback/g, '/discussions');
        } else {
            // 如果是模型根目录 (如 /user/repo)，则确保是 HF 的根路径 (Model Card)
            var path = new URL(targetUrl).pathname;
            if (path.match(/^\/([^\/]+)\/([^\/]+)\/?$/)) {
                 // 确保链接以 /user/repo 结束，对应 HF 的 Model Card 页面
                 targetUrl = targetUrl.replace(/\/$/, '');
            }
        }

        // 确保 URL 末尾没有重复的斜杠
        targetUrl = targetUrl.replace(/([^:]\/)\/+/g, '$1');

        return targetUrl;
    }

    /**
     * 将 Hugging Face URL 转换为 ModelScope URL，并精确映射 Tab 路径
     */
    function convertHfToMsUrl(url) {
        var targetUrl = url.replace('huggingface.co', 'modelscope.cn').replace('hf-mirror.com', 'modelscope.cn');

        // 1. 在 user/repo 前面添加 /models
        // 匹配模式：(域名/)(user/repo)
        targetUrl = targetUrl.replace(/(modelscope\.cn\/)([^\/]+\/[^\/]+)/, '$1models/$2');

        // 2. 移除和替换 Hugging Face 的 Tab 路径为 ModelScope 对应的路径
        // 路径映射：/discussions -> /feedback; /tree/main -> /files; (根路径/blob/...) -> /summary

        // 移除 HF 分支或文件路径中的 /main 和 /blob
        targetUrl = targetUrl.replace(/\/main\/?$|\/blob\/?$/g, '');

        if (targetUrl.includes('/discussions')) {
            targetUrl = targetUrl.replace(/\/discussions/g, '/feedback');
        } else if (targetUrl.includes('/tree')) {
            targetUrl = targetUrl.replace(/\/tree/g, '/files');
        } else {
            // 如果是 HF 的根路径（Model Card），则转换为 ModelScope 的 /summary
            var path = new URL(targetUrl).pathname;
            // 匹配 /models/user/repo 或 /models/user/repo/ 形式
            if (path.match(/\/models\/([^\/]+)\/([^\/]+)\/?$/)) {
                if (!targetUrl.endsWith('/')) {
                    targetUrl += '/';
                }
                targetUrl += 'summary';
            }
        }

        // 确保 URL 末尾没有重复的斜杠
        targetUrl = targetUrl.replace(/([^:]\/)\/+/g, '$1');

        return targetUrl;
    }

    // --- 主要功能函数：添加 Tab 链接 ---

    function addTabLink() {
        var tabContainer = getTabContainer();
        if (!tabContainer) return;

        var hfLinkClass = 'tab-alternate custom-tab hf-mirror-jump';

        // 1. HuggingFace 页面互跳和到 ModelScope 的跳转
        if (!isModelScopePage) {
            // ... (Hugging Face / hf-mirror 互跳逻辑不变)
            if (!tabContainer.querySelector('.custom-tab.hf-mirror-jump')) {
                var jumpLink = document.createElement('a');
                jumpLink.className = hfLinkClass;
                jumpLink.style.marginLeft = '10px';
                if (isMirrorPage) {
                    jumpLink.href = currentUrl.replace('hf-mirror.com', 'huggingface.co');
                    jumpLink.textContent = '切换到 huggingface 页面';
                    jumpLink.style.color = MS_HF_COLOR;
                } else {
                    jumpLink.href = currentUrl.replace('huggingface.co', 'hf-mirror.com');
                    jumpLink.textContent = '切换到 hf-mirror 页面';
                    jumpLink.style.color = MS_HFM_COLOR;
                }
                tabContainer.appendChild(jumpLink);
            }

            // Hugging Face / hf-mirror 到 ModelScope 的跳转
            if (!tabContainer.querySelector('.custom-tab.modelscope-jump')) {
                var modelscopeLink = document.createElement('a');
                modelscopeLink.className = hfLinkClass + ' modelscope-jump';
                modelscopeLink.style.marginLeft = '10px';

                var targetUrl = convertHfToMsUrl(currentUrl);

                modelscopeLink.href = targetUrl;
                modelscopeLink.textContent = '切换到 modelscope 页面';
                modelscopeLink.style.color = MS_MODEL_SCOPE_COLOR;

                tabContainer.appendChild(modelscopeLink);
            }
        }

        // 2. ModelScope Tab 添加逻辑
        if (isModelScopePage) {

            if (tabContainer.children.length < 2) return;

            // ModelScope 上的 Tab 链接：切换到 HuggingFace
            if (!tabContainer.querySelector('.ms-hf-jump')) {
                var targetUrl = convertMsToHfUrl(currentUrl);

                var hfJumpTab = createMsJumpTab(
                    '切换到 huggingface 页面',
                    targetUrl,
                    MS_HF_COLOR,
                    'ms-hf-jump'
                );
                tabContainer.appendChild(hfJumpTab);
            }

            // ModelScope 上的 Tab 链接：切换到 hf-mirror
            if (!tabContainer.querySelector('.ms-hfm-jump')) {
                // 仅转换到 HF，然后替换域名到 hf-mirror
                var targetUrl = convertMsToHfUrl(currentUrl).replace('huggingface.co', 'hf-mirror.com');

                var hfmJumpTab = createMsJumpTab(
                    '切换到 hf-mirror 页面',
                    targetUrl,
                    MS_HFM_COLOR,
                    'ms-hfm-jump'
                );
                tabContainer.appendChild(hfmJumpTab);
            }
        }
    }

    // --- 稳定化和初始化 ---

    // ... (addBlobLinks 和 addTreeDownloadButtons 逻辑不变，省略)
    function addBlobLinks() {
        var isModelScopePage = window.location.href.includes('modelscope.cn');
        var isMirrorPage = window.location.href.includes('hf-mirror.com');
        if (isModelScopePage) return;
        var messageDiv = document.querySelector('div.p-4.py-8.text-center');
        if (messageDiv && !messageDiv.querySelector('.custom-links')) {
            var newP = document.createElement('p');
            newP.className = 'custom-links';
            newP.style.marginTop = '20px';
            if (isMirrorPage) {
                return;
            } else {
                var downloadLink = document.querySelector('a[href*="/resolve/"]');
                if (downloadLink) {
                    var originalDownloadUrl = downloadLink.href;
                    var urlObj = new URL(originalDownloadUrl);
                    var mirrorDownloadUrl = urlObj.origin.replace('huggingface.co', 'hf-mirror.com') + urlObj.pathname;
                    var downloadLinkMirror = document.createElement('a');
                    downloadLinkMirror.href = mirrorDownloadUrl;
                    downloadLinkMirror.textContent = '使用 hf-mirror 下载';
                    downloadLinkMirror.style.color = 'green';
                    downloadLinkMirror.style.textDecoration = 'underline';
                    downloadLinkMirror.style.marginRight = '10px';
                    downloadLinkMirror.target = '_blank';
                    downloadLinkMirror.rel = 'noopener noreferrer';
                    newP.appendChild(downloadLinkMirror);
                }
            }
            messageDiv.appendChild(newP);
        }
    }

    function addTreeDownloadButtons() {
        var isTreePage = window.location.href.includes('/tree/main');
        var isMirrorPage = window.location.href.includes('hf-mirror.com');
        var isModelScopePage = window.location.href.includes('modelscope.cn');
        if (!isTreePage || isMirrorPage || isModelScopePage) return;
        var fileLinks = document.querySelectorAll('a.group.col-span-9.flex.items-center[href*="/resolve/"]');
        fileLinks.forEach(function(link) {
            if (!link.querySelector('.custom-mirror-download')) {
                var originalHref = link.href;
                var mirrorHref = originalHref.replace('huggingface.co', 'hf-mirror.com').split('?')[0];
                var originalDownloadBtn = link.querySelector('div.group-hover\\:shadow-xs.ml-2.flex.h-5.w-5');
                if (originalDownloadBtn) {
                    var mirrorDownloadBtn = document.createElement('div');
                    mirrorDownloadBtn.className = 'ml-2 flex h-5 w-5 items-center justify-center rounded-sm border text-green-500 hover:bg-gray-50 hover:text-green-800 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-green-300 xl:ml-4 custom-mirror-download';
                    mirrorDownloadBtn.innerHTML = '<a href="' + mirrorHref + '" target="_blank" rel="noopener noreferrer" title="Download from hf-mirror"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10l10-10z"></path></svg></a>';
                    link.insertBefore(mirrorDownloadBtn, originalDownloadBtn.nextSibling);
                }
            }
        });
    }

    var observerThrottle = false;

    // MutationObserver 持续监控 ModelScope Tab 容器的出现和变化
    var observer = new MutationObserver(function(mutations) {
        if (observerThrottle) return;

        var needsUpdate = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.matches('div.antd5-tabs-nav') || node.matches('div.antd5-tabs-nav-list') || node.closest('div.antd5-tabs-nav-list') || node.closest('div.-mb-px'))) {
                        needsUpdate = true;
                        break;
                    }
                }
            }
        });

        if (needsUpdate) {
            observerThrottle = true;
            setTimeout(() => {
                addTabLink();
                addTreeDownloadButtons();
                addBlobLinks();
                observerThrottle = false;
            }, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面首次加载时执行
    window.addEventListener('load', function() {
        addTabLink();
        addTreeDownloadButtons();
        addBlobLinks();
    });

    // 针对 SPA 特性，在 URL 变化时也重新尝试添加
    var lastUrl = currentUrl;
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            if (isModelScopePage || isHuggingFacePage || isMirrorPage) {
                addTabLink();
            }
        }
    }, 200);

})();