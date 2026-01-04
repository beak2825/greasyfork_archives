// ==UserScript==
// @name         图站下载标签&原图
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持Danbooru和Sankaku
// @author       deepseek
// @match        https://danbooru.donmai.us/posts/*
// @match        https://chan.sankakucomplex.com/*/posts/*
// @exclude      https://chan.sankakucomplex.com/*/posts?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537031/%E5%9B%BE%E7%AB%99%E4%B8%8B%E8%BD%BD%E6%A0%87%E7%AD%BE%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/537031/%E5%9B%BE%E7%AB%99%E4%B8%8B%E8%BD%BD%E6%A0%87%E7%AD%BE%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 站点配置
    const SITE_CONFIG = {
        'danbooru.donmai.us': {
            textarea: 'textarea[name="post[tag_string]"]',
            insertParent: '.tag-list.categorized-tag-list',
            insertBefore: 'h3.artist-tag-list',
            btnText: '下载标签&原图',
            getImageData: () => {
                const link = document.querySelector('#post-information #post-info-size a');
                return {
                    url: link?.href || '',
                    filename: link?.href.split('/').pop() || 'danbooru_image'
                };
            }
        },
        'chan.sankakucomplex.com': {
            textarea: 'textarea[name="post[tags]"]',
            insertParent: 'div.sidebar',
            insertBefore: 'div[style="margin-bottom: 1em;"]',
            btnText: '下载标签&原图',
            getImageData: () => {
                // 精准获取Original链接
                const links = Array.from(document.querySelectorAll('a[onclick*="prepare_download"]'))
                    .filter(link => {
                        const onclickStr = link.onclick.toString();
                        return onclickStr.includes('prepare_download') &&
                               !onclickStr.includes('/sample/');
                    });

                if (links.length === 0) return null;

                // 增强参数解析
                const match = links[0].onclick.toString().match(
                    /prepare_download\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/
                );

                if (!match) return null;

                // 从第二个参数获取完整文件名
                const baseName = match[2];
                const extMatch = match[1].match(/\.\w+(\?|$)/);
                const extension = extMatch ? extMatch[0].split('?')[0] : '';

                return {
                    url: `https:${match[1].replace(/&amp;/g, '&')}`,
                    filename: `${baseName}${extension}`
                };
            }
        }
    };

    // 样式配置（保持原样）
    GM_addStyle(`
        .dual-dl-btn {
            margin: 15px 0 !important;
            padding: 12px 20px !important;
            background: #2196F3 !important;
            color: white !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            transition: all 0.3s !important;
            font-family: Arial, sans-serif !important;
        }
        .dual-dl-btn:hover {
            opacity: 0.9 !important;
            box-shadow: 0 2px 6px rgba(33,150,243,0.3) !important;
        }
    `);

    // 创建按钮
    function createButton(site) {
        const btn = document.createElement('button');
        btn.className = 'dual-dl-btn';
        btn.textContent = site.btnText;
        return btn;
    }

    // 处理标签文本
    function processTags(text) {
       return text.replace(/\s/g, '\n');
   }

    // 下载处理器
    function handleDownload(site) {
        return async function() {
            const btn = this;
            const originalText = btn.textContent;
            btn.disabled = true;

            try {
                btn.textContent = '处理中...';

                // 保存标签
                const textarea = document.querySelector(site.textarea);
                if (textarea) {
                    const tags = processTags(textarea.value);
                    GM_download({
                        url: `data:text/plain;charset=utf-8,${encodeURIComponent(tags)}`,
                        name: 'tags.txt',
                        conflictAction: 'overwrite'
                    });
                }

                // 获取文件数据
                const imageData = site.getImageData();
                if (!imageData?.url) throw new Error('无法获取下载链接');

                // 执行下载
                GM_download({
                    url: imageData.url,
                    name: imageData.filename,
                    headers: { Referer: location.href },
                    conflictAction: 'overwrite',
                    onerror: (err) => {
                        console.error('下载失败:', err);
                        window.open(imageData.url);
                    }
                });

                btn.textContent = '✓ 完成';
            } catch (error) {
                btn.textContent = '❌ 失败';
                alert(`${error.message}\n请检查控制台获取详细信息`);
                console.error('错误详情:', error);
            } finally {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 2000);
            }
        }
    }

    // 初始化按钮
    function initButton() {
        const site = SITE_CONFIG[location.hostname];
        if (!site) return;

        const observer = new MutationObserver(() => {
            const parent = document.querySelector(site.insertParent);
            const target = parent?.querySelector(site.insertBefore);
            const existingBtn = parent?.querySelector('.dual-dl-btn');

            if (parent && target && !existingBtn) {
                const btn = createButton(site);
                btn.onclick = handleDownload(site);
                parent.insertBefore(btn, target);
            }
        });

        // 立即检查
        const parent = document.querySelector(site.insertParent);
        const target = parent?.querySelector(site.insertBefore);
        if (parent && target && !parent.querySelector('.dual-dl-btn')) {
            const btn = createButton(site);
            btn.onclick = handleDownload(site);
            parent.insertBefore(btn, target);
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动脚本
    if (document.readyState === 'complete') {
        initButton();
    } else {
        window.addEventListener('load', initButton);
    }
})();