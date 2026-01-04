// ==UserScript==
// @name         草榴社区优化脚本 v2.9.1
// @name:zh-CN   草榴社区优化脚本 v2.9.1
// @namespace    caoliu-optimizer-script
// @version      2.9.1
// @description  [v2.9.1] A comprehensive optimization script for t66y.com, featuring ad-blocking, anti-adblock bypass, media fixes, short post filtering, and auto-expansion of content.
// @description:zh-CN  (v2.9.1) 修复元数据错误。集广告过滤、反屏蔽、图片/视频修复、短回复过滤、内容自动展开等多功能于一身，旨在提供极致、清爽、流畅的草榴社区浏览体验。修复了评论展开问题并新增原图链接功能。
// @author       Gemini-Pro
// @match        *://*.t66y.com/*
// @match        *://t66y.com/*
// @match        *://*.t66y.com/thread*
// @match        *://*/htm_data/*/*.html
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547171/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC%20v291.user.js
// @updateURL https://update.greasyfork.org/scripts/547171/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC%20v291.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 核心配置 ---
    const CONFIG = {
        // 楼层内容少于或等于 N 个字将被折叠 (0 表示不启用)
        MIN_POST_LENGTH: 5,
        // 调试模式，开启后会在控制台输出脚本信息
        DEBUG_MODE: false
    };

    /**
     * =================================================================
     * 阶段一: 页面加载前执行 (Run at document-start)
     * 目标: 抢在网站本身的恶意脚本执行前，进行主动防御。
     * =================================================================
     */

    // 关键防御：定义一个假的恶意函数，让网站的反广告屏蔽机制失效
    // 这是对抗 "去广告插件屏蔽" 提示的第一道防线
    try {
        Object.defineProperty(window, 'r9aeadS', {
            value: () => {
                log('已成功拦截恶意函数 r9aeadS 的执行。');
            },
            writable: false,
            configurable: false
        });
        Object.defineProperty(window, 'adhtml', {
            value: () => {
                log('已成功拦截恶意函数 adhtml 的执行。');
            },
            writable: false,
            configurable: false
        });
    } catch (e) {
        error('拦截恶意函数失败:', e);
    }


    /**
     * =================================================================
     * 阶段二: DOM 加载完成后执行
     * 目标: 对页面元素进行全面的清理、修复和功能增强。
     * =================================================================
     */
    document.addEventListener('DOMContentLoaded', () => {
        log('v2.9.1 脚本开始执行...');

        // 执行所有优化函数
        runAllOptimizations();

        // 设置一个动态内容监视器（哨兵），应对翻页等异步内容加载
        // 这是确保所有功能在页面变化后依然有效的核心
        const observer = new MutationObserver(mutations => {
            let shouldRun = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    // 检查添加的节点是否是楼层元素，避免不必要的重复执行
                    if (Array.from(mutation.addedNodes).some(node => node.nodeType === 1 && node.querySelector('.t_row_1, #main'))) {
                        shouldRun = true;
                        break;
                    }
                }
            }
            if (shouldRun) {
                log('检测到页面内容变化，重新执行优化...');
                runAllOptimizations();
            }
        });

        const mainContent = document.querySelector('#main');
        if (mainContent) {
            observer.observe(mainContent, {
                childList: true,
                subtree: true
            });
        }

        log('动态内容监视器已启动。');
    });


    /**
     * =================================================================
     * 核心优化功能函数库
     * =================================================================
     */

    /**
     * 主调度函数，按顺序执行所有优化
     */
    function runAllOptimizations() {
        log('--- 开始新一轮全面优化 ---');
        removeAnnoyingElements();
        filterShortPosts();
        fixMediaContent();
        addOriginalImageLinks();
        autoExpandContent();
        deobfuscateLinks();
        log('--- 本轮优化执行完毕 ---');
    }

    /**
     * 1. 广告和干扰元素移除
     * - 移除顶部、底部、帖子内部等所有已知广告位。
     * - 移除 "去广告插件屏蔽" 的告警提示DIV（第二道防线）。
     */
    function removeAnnoyingElements() {
        const selectors = [
            '#header > div.banner > center', // 顶部横幅广告
            '#main > div.t > table.t_msg > tbody > tr > th > b', // 帖子内 "百万影院" 这类文字广告
            'div[class="tac"]', // 帖子下方的一系列广告容器
            'div.ftad-ct', // 页脚滚动广告
            '#main > div.t:not([id])', // 页面中没有ID的顶层div广告块
            '.t_row_1 > .tiptop > .tips', // “去广告插件屏蔽”的告警提示
            '#cnzz_stat_icon_1278893455', // cnzz统计图标
            'a[href*="a.app"]', // APP推广链接
            'a[href*="ysos8.com"]', // 广告链接
            'a[href*="bkmh.me"]' // 广告链接
        ];

        document.querySelectorAll(selectors.join(', ')).forEach(el => {
            log('移除广告/干扰元素:', el);
            el.remove();
        });
    }

    /**
     * 2. 短回复过滤（带主楼保护）
     * - 自动隐藏所有内容长度小于等于设定值的楼层。
     * - 智能保护，确保主楼（第一个帖子）永远不会被隐藏。
     */
    function filterShortPosts() {
        if (CONFIG.MIN_POST_LENGTH <= 0) return;

        const posts = document.querySelectorAll('.t_row_1');
        posts.forEach((post, index) => {
            // index === 0 是主楼，跳过不处理
            if (index === 0) return;

            const content = post.querySelector('.tpc_content');
            if (content && content.innerText.trim().length <= CONFIG.MIN_POST_LENGTH) {
                log(`隐藏短回复 (字数: ${content.innerText.trim().length}):`, post);
                post.style.display = 'none';
            }
        });
    }

    /**
     * 3. 媒体内容修复
     * - 修复因懒加载导致的图片不显示问题。
     * - 修复 thumbsnap.com 视频跳转，使其能直接播放。
     */
    function fixMediaContent() {
        // 修复图片懒加载
        document.querySelectorAll('img[ess-data]').forEach(img => {
            const realSrc = img.getAttribute('ess-data');
            if (realSrc) {
                img.src = realSrc;
                img.removeAttribute('ess-data');
                log('修复懒加载图片:', img);
            }
        });

        // 修复 thumbsnap 视频跳转
        document.querySelectorAll("video[src*='thumbsnap.com/i/']").forEach(video => {
            const originalSrc = video.getAttribute('src');
            if (originalSrc && !originalSrc.includes('cdn2.thumbsnap.com')) {
                const newSrc = originalSrc.replace('thumbsnap.com/i/', 'cdn2.thumbsnap.com/i/87/53/'); // 使用一个可用的CDN前缀
                video.src = newSrc;
                log(`修复视频链接: ${originalSrc} -> ${newSrc}`);
            }
        });
    }

    /**
     * 4. 为图片添加原图链接和点击图标
     * - 在帖子内的每张图片下方，生成一个可点击的“原图链接”。
     * - 在图片左上角添加一个图标，点击可直接打开原图。
     */
    function addOriginalImageLinks() {
        document.querySelectorAll('.tpc_content img:not([data-processed="true"])').forEach(img => {
            img.dataset.processed = 'true'; // 添加处理标记，防止重复添加

            const originalUrl = img.src;

            // 创建一个新的div作为包裹容器，用于相对定位
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';

            // 创建左上角的图标链接
            const iconLink = document.createElement('a');
            iconLink.href = originalUrl;
            iconLink.target = '_blank';
            iconLink.title = '在新标签页中打开原图';
            iconLink.innerHTML = '&#128279;'; // 链接符号 emoji
            Object.assign(iconLink.style, {
                position: 'absolute',
                top: '5px',
                left: '5px',
                zIndex: '10',
                fontSize: '20px',
                color: 'white',
                textDecoration: 'none',
                textShadow: '0 0 4px black, 0 0 4px black' // 加强阴影，使其在任何背景下都可见
            });

            // 创建图片下方的文字链接
            const textLink = document.createElement('a');
            textLink.href = originalUrl;
            textLink.target = '_blank';
            textLink.textContent = '【点击此处查看原图】';
            Object.assign(textLink.style, {
                display: 'block',
                fontWeight: 'bold',
                color: '#E53333',
                marginTop: '5px',
                textAlign: 'center'
            });

            // DOM 操作：将图片放入包裹容器，再添加图标和文字链接
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            wrapper.appendChild(iconLink);
            // 将文字链接插入到包裹容器之后
            wrapper.parentNode.insertBefore(textLink, wrapper.nextSibling);

            log('为图片添加原图链接:', img);
        });
    }


    /**
     * 5. [修复] 内容自动展开
     * - 自动点击“還有 X 條點評”，展开被折叠的楼中楼评论。
     * - 自动展开被隐藏的视频等内容。
     */
    function autoExpandContent() {
        // 展开楼中楼评论
        document.querySelectorAll('div[onclick="show_tpc(this)"]').forEach(el => {
             if (el.style.display !== 'none') {
                log('自动展开评论:', el);
                el.click();
             }
        });

        // 展开其他可能被隐藏的内容 (例如一些需要点击才能加载的视频)
        // 可根据需要添加更多选择器
        const otherExpandableSelectors = [
            // '.some-other-hidden-content-selector'
        ];
        if (otherExpandableSelectors.length > 0) {
            document.querySelectorAll(otherExpandableSelectors.join(',')).forEach(el => el.click());
        }
    }


    /**
     * 6. 下载链接反混淆 (占位)
     * - 此处为未来功能保留，用于处理复杂的跳转和加密链接。
     */
    function deobfuscateLinks() {
        // 示例：将所有指向 "down.com" 的链接的 URL 参数进行解码
        document.querySelectorAll("a[href*='down.com']").forEach(link => {
            // 此处添加具体的反混淆逻辑
        });
    }


    /**
     * =================================================================
     * 辅助函数
     * =================================================================
     */

    /**
     * 日志输出函数，仅在调试模式开启时输出
     * @param {...any} args - 需要打印的日志内容
     */
    function log(...args) {
        if (CONFIG.DEBUG_MODE) {
            console.log('[草榴优化脚本]', ...args);
        }
    }

    /**
     * 错误输出函数
     * @param {...any} args - 需要打印的错误内容
     */
    function error(...args) {
        console.error('[草榴优化脚本]', ...args);
    }

})();
