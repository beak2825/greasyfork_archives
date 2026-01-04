// ==UserScript==
// @name         哔哩哔哩动态图片下载
// @namespace    https://space.bilibili.com/11768481
// @version      2.0.1
// @description  为方便下载bilibili图片而开发。
// @author       伊墨墨 
// @match        https://www.bilibili.com/opus/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*/dynamic*
// @match        https://www.bilibili.com/v/topic/*
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @supportURL   https://greasyfork.org/zh-CN/scripts/531888/feedback
// @homepageURL  https://greasyfork.org/zh-CN/scripts/531888
// @downloadURL https://update.greasyfork.org/scripts/531888/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A8%E6%80%81%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/531888/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A8%E6%80%81%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
 * CHANGELOG:
 * v2.0:
 * - 彻底的重构，改为发送请求来获取数据。
 * - 2.0.1 修复专栏图片下载
 */


(function () {
    'use strict';

    /**
     * =========================================================================
     *  1. 全局配置与常量 (CONFIG)
     * =========================================================================
     */
    const CONFIG = {
        // API 接口地址
        API: {
            DETAIL: 'https://api.bilibili.com/x/polymer/web-dynamic/v1/detail',
            ARTICLE: 'https://api.bilibili.com/x/article/view'
        },
        // 存储键名
        STORAGE: {
            FILENAME_TEMPLATE: 'bili_dl_filename_template',
            FORCE_FALLBACK: 'bili_dl_force_fallback'
        },
        // 默认值配置
        DEFAULTS: {
            TEMPLATE: '{username}_{date}_{itemId}_{index}.{format}',
            FALLBACK: false
        },
        // 限制与阈值
        LIMITS: {
            TEXT_TRUNCATE: 50,      // 动态正文截取长度
            TITLE_TRUNCATE: 20,     // 标题截取长度
            TOAST_DURATION: 3000,   // 提示框显示时长(ms)
            MENU_RENDER_DELAY: 200, // 等待菜单渲染的延迟(ms)
            BLOB_REVOKE_DELAY: 5000 // Blob URL 撤销延迟(ms)
        },
        // 预览用的假数据
        DUMMY_DATA: {
            username: '新华社',
            itemId: '1111111111',
            date: '251213',
            index: '01',
            format: 'jpg',
            title: '关于开展重要工作的通知',
            text: '这里是动态正文内容的预览...',
            type: '图文'
        }
    };

    // 注入 CSS 样式 (保持原版 UI)
    GM_addStyle(`
        .bili-toast-message {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background-color: rgba(51, 51, 51, 0.95); color: white; padding: 10px 20px;
            border-radius: 4px; z-index: 99999; font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); pointer-events: none;
            transition: opacity 0.2s; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .download-images-option { cursor: pointer; user-select: none; }
        .download-images-option:hover .bili-cascader-options__item-label,
        .download-images-option.bili-dyn-more__menu__item:hover { color: #00a1d6; }

        /* Settings Panel */
        .bili-dl-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 19998; backdrop-filter: blur(2px); }
        .bili-dl-settings-panel {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: #fff; border-radius: 8px; width: 520px; max-width: 90vw; z-index: 19999;
            padding: 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2); color: #333;
        }
        .bili-dl-settings-panel h3 { margin: 0 0 20px; text-align: center; font-size: 18px; color: #222; }
        .bili-dl-settings-panel .setting-group { margin-bottom: 20px; }
        .bili-dl-settings-panel label { display: block; font-weight: 500; margin-bottom: 8px; font-size: 14px; }
        .bili-dl-settings-panel input[type="text"] {
            width: 100%; padding: 8px 10px; box-sizing: border-box; margin-bottom: 8px;
            border: 1px solid #ddd; border-radius: 4px; font-size: 14px; transition: border-color 0.2s;
        }
        .bili-dl-settings-panel input[type="text"]:focus { border-color: #00a1d6; outline: none; }

        .preview-box {
            background: #f6f7f8; border: 1px dashed #ccc; border-radius: 4px;
            padding: 10px; font-size: 12px; color: #555; word-break: break-all; margin-bottom: 10px;
        }
        .preview-box code { color: #00a1d6; font-weight: bold; }

        .variable-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 5px; }
        .variable-tag {
            background: #e7f5fa; color: #00a1d6; padding: 2px 6px; border-radius: 3px;
            font-size: 12px; cursor: pointer; border: 1px solid #bce2f3; position: relative;
        }
        .variable-tag:hover { background: #d0eaf5; }
        .variable-tag:hover::after {
            content: attr(data-tip);
            position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
            background: #333; color: #fff; padding: 4px 8px; border-radius: 4px;
            font-size: 11px; white-space: nowrap; pointer-events: none; margin-bottom: 5px; z-index: 10;
        }
        .checkbox-label { display: flex; align-items: center; cursor: pointer; font-weight: normal !important; }
        .checkbox-label input { margin-right: 8px; }
        .tip-text { font-size: 12px; color: #999; margin-top: 4px; line-height: 1.4; }
        .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; }
        .actions button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background 0.2s; }
        .btn-close { background: #f1f2f3; color: #666; }
        .btn-close:hover { background: #e1e2e3; }
        .btn-reset { background: transparent; color: #999; margin-right: auto; }
        .btn-reset:hover { color: #666; text-decoration: underline; }
        .btn-save { background: #00a1d6; color: white; }
        .btn-save:hover { background: #008ebd; }
    `);


    /**
     * =========================================================================
     *  2. 工具模块 (Utils)
     * =========================================================================
     */
    const Utils = {
        showToast: (msg) => {
            const old = document.querySelector('.bili-toast-message');
            if (old) old.remove();
            const toast = document.createElement('div');
            toast.className = 'bili-toast-message';
            toast.textContent = msg;
            document.body.appendChild(toast);
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, CONFIG.LIMITS.TOAST_DURATION);
        },

        formatFilename: (template, data) => {
            let filename = template;
            for (const key in data) {
                const val = data[key] ? String(data[key]) : '';
                filename = filename.replaceAll(`{${key}}`, val);
            }
            return filename.replace(/[\/\\:*?"<>|]/g, '_').trim();
        },

        timestampToDate: (ts) => {
            if (!ts) return '000000';
            const date = new Date(ts * 1000);
            const yy = String(date.getFullYear()).slice(-2);
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yy}${mm}${dd}`;
        },

        waitForElement: (selector, callback) => {
            if (document.querySelector(selector)) return callback(document.querySelector(selector));
            const obs = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) { obs.disconnect(); callback(el); }
            });
            obs.observe(document.body, { childList: true, subtree: true });
        }
    };


    /**
     * =========================================================================
     *  3. 核心探测模块 (Core)
     * =========================================================================
     */
    const Core = {
        // 【v2.2新增】尝试从 window 读取 SSR 数据
        // 这是解决 Opus 正文图片获取失败的最有效方法
        readSSRData: (targetId) => {
            try {
                const state = unsafeWindow.__INITIAL_STATE__;
                if (!state) return null;

                // 检查是否匹配当前的 Opus ID
                // state.detail.id_str 是字符串，targetId 也是字符串
                if (state.detail && (state.detail.id_str === targetId || state.id === targetId)) {
                    console.log('[BiliDL] Hit Opus SSR Data');
                    return { type: 'opus', data: state.detail };
                }

                // 检查是否匹配当前的 Read/CV ID
                if (state.readInfo && (state.readInfo.id == targetId || ('cv' + state.readInfo.id) === targetId)) {
                    console.log('[BiliDL] Hit Read SSR Data');
                    return { type: 'read', data: state.readInfo };
                }

                return null;
            } catch (e) {
                console.warn('[BiliDL] SSR read failed', e);
                return null;
            }
        },

        findIdInObject: (obj, depth = 0, maxDepth = 4, visited = new WeakSet()) => {
            if (!obj || typeof obj !== 'object' || depth > maxDepth) return null;
            if (visited.has(obj)) return null;
            visited.add(obj);

            if (obj.id_str && /^\d{17,}$/.test(obj.id_str)) return obj.id_str;
            if (obj.comment_id_str && /^\d{17,}$/.test(obj.comment_id_str)) return obj.comment_id_str;

            for (let key of Object.keys(obj)) {
                if (key.startsWith('$') || key === 'el' || key === 'container') continue;
                const found = Core.findIdInObject(obj[key], depth + 1, maxDepth, visited);
                if (found) return found;
            }
            return null;
        },

        getDynamicId: (element) => {
            if (!element) return null;
            // 尝试直接属性
            const idAttr = element.getAttribute('data-id');
            if (idAttr) return idAttr;

            // Vue 实例探测
            const vueKey = Object.keys(element).find(key => key.startsWith('__vue'));
            if (vueKey) {
                const id = Core.findIdInObject(element[vueKey]);
                if (id) return id;
            }
            const child = element.querySelector('.bili-dyn-item, .bili-dyn-content');
            if (child) {
                const childKey = Object.keys(child).find(key => key.startsWith('__vue'));
                if (childKey) return Core.findIdInObject(child[childKey]);
            }
            return null;
        }
    };


    /**
     * =========================================================================
     *  4. 网络与下载模块 (Network)
     * =========================================================================
     */
    const Network = {
        // 请求动态详情 API
        fetchDetail: (id) => new Promise((resolve, reject) => {
            // 如果是 cv 号 (旧版专栏)，走 Article API
            if (/^(cv)?\d+$/.test(id) && !/^\d{17,}$/.test(id)) {
                const cvId = id.replace('cv', '');
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${CONFIG.API.ARTICLE}?id=${cvId}`,
                    headers: { "Referer": "https://www.bilibili.com/" },
                    onload: res => {
                        try {
                            const data = JSON.parse(res.responseText);
                            if (data.code === 0 && data.data) resolve({ _type: 'read', ...data.data });
                            else reject(data.message);
                        } catch (e) { reject('JSON解析错误'); }
                    },
                    onerror: () => reject('网络错误')
                });
                return;
            }

            // 标准动态 API (Opus 也走这里，API 返回的 modules 结构与 SSR 一致)
            GM_xmlhttpRequest({
                method: "GET",
                url: `${CONFIG.API.DETAIL}?id=${id}`,
                headers: { "Referer": "https://t.bilibili.com/" },
                onload: res => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.code === 0 && data.data?.item) resolve(data.data.item);
                        else reject(data.message || `Code ${data.code}`);
                    } catch (e) { reject(`JSON解析错误: ${e.message}`); }
                },
                onerror: err => reject(`网络请求错误: ${err.statusText}`)
            });
        }),

        downloadBlob: (url, name) => {
            if (url.startsWith('//')) url = 'https:' + url;
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                headers: { "Referer": "https://t.bilibili.com/" },
                onload: (res) => {
                    if (res.status === 200) {
                        const blob = res.response;
                        const a = document.createElement('a');
                        const blobUrl = URL.createObjectURL(blob);
                        a.href = blobUrl;
                        a.download = name;
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(blobUrl);
                        }, CONFIG.LIMITS.BLOB_REVOKE_DELAY);
                    } else {
                        Utils.showToast(`下载失败: ${res.status}`);
                    }
                },
                onerror: () => Utils.showToast(`网络错误，下载失败: ${name}`)
            });
        }
    };


    /**
     * =========================================================================
     *  5. 解析器模块 (Parser)
     *  大幅增强对 Opus 模块化数据的解析
     * =========================================================================
     */
    const Parser = {
        getDynamicType: (typeStr) => {
            const map = {
                'DYNAMIC_TYPE_AV': '视频',
                'DYNAMIC_TYPE_DRAW': '图文',
                'DYNAMIC_TYPE_WORD': '纯文',
                'DYNAMIC_TYPE_ARTICLE': '专栏',
                'DYNAMIC_TYPE_FORWARD': '转发',
                'DYNAMIC_TYPE_LIVE_RCMD': '直播',
                'DYNAMIC_TYPE_OPUS': '专栏',
                'MAJOR_TYPE_OPUS': '专栏'
            };
            return map[typeStr] || '动态';
        },

        // 统一构建返回对象
        buildData: (rawUrls, info) => {
            const uniqueUrls = [...new Set(rawUrls)]
                .filter(u => !!u)
                .map(url => {
                    if (url.startsWith('//')) url = 'https:' + url;
                    return {
                        url: url.split('@')[0],
                        format: (url.match(/\.(jpg|jpeg|png|gif|webp|avif)/i)||['','jpg'])[1].toLowerCase()
                    };
                });

            return {
                username: info.username || '未知用户',
                itemId: info.itemId,
                date: Utils.timestampToDate(info.pubTime),
                type: info.type || '动态',
                text: info.text ? info.text.slice(0, CONFIG.LIMITS.TEXT_TRUNCATE) : '',
                title: info.title ? info.title.slice(0, CONFIG.LIMITS.TITLE_TRUNCATE) : '',
                images: uniqueUrls
            };
        },

        // 解析 Opus 复杂的 modules 结构 (适用于 API 和 SSR)
        parseOpusStructure: (item, isSSR = false) => {
            const modules = item.modules || [];
            let rawUrls = [];
            let title = '';
            let text = '';
            let pubTime = 0;
            let username = '';
            let itemId = item.id_str;

            // 提取作者信息
            const authorMod = modules.find(m => m.module_author);
            if (authorMod) {
                username = authorMod.module_author.name;
                pubTime = authorMod.module_author.pub_ts;
            }

            // 提取标题
            const titleMod = modules.find(m => m.module_title);
            if (titleMod) {
                title = titleMod.module_title.text;
            }

            // 提取内容 (核心修复点)
            const contentMod = modules.find(m => m.module_content);
            if (contentMod && contentMod.module_content && contentMod.module_content.paragraphs) {
                contentMod.module_content.paragraphs.forEach(p => {
                    // 图片段落: para_type = 2
                    if (p.para_type === 2 && p.pic && p.pic.pics) {
                        p.pic.pics.forEach(img => {
                            if (img.url) rawUrls.push(img.url);
                        });
                    }
                    // 文本段落: para_type = 1 (用于预览)
                    if (p.para_type === 1 && p.text && p.text.nodes) {
                        p.text.nodes.forEach(n => {
                            if (n.word && n.word.words) text += n.word.words;
                        });
                    }
                });
            }

            // 提取 Opus 头部可能的图片 (如头图)
            // 在 SSR 数据中，有时 opus 头图不在 modules 里，而在 item.opus.pics
            if (isSSR && item.opus && item.opus.pics) {
                item.opus.pics.forEach(p => rawUrls.push(p.url));
            } else if (!isSSR && item.modules) {
                 // API 模式下，有时 opus 头图在 dynamic major 里，这里简化处理，正文图最重要
            }

            return Parser.buildData(rawUrls, {
                username, itemId, pubTime, type: '专栏', title, text
            });
        },

        // 解析 Article (旧版 CV) 结构
        parseReadStructure: (data) => {
            let rawUrls = [];
            // 头图
            if (data.banner_url) rawUrls.push(data.banner_url);
            if (data.origin_image_urls) rawUrls.push(...data.origin_image_urls);

            // 正文 HTML 提取
            if (data.content) {
                const imgReg = /<img[^>]+src=["']([^"']+)["']/g;
                let match;
                while ((match = imgReg.exec(data.content)) !== null) rawUrls.push(match[1]);
            }

            return Parser.buildData(rawUrls, {
                username: data.author?.name,
                itemId: 'cv' + data.id,
                pubTime: data.publish_time || data.ctime,
                type: '专栏',
                title: data.title,
                text: data.summary
            });
        },

        parseItem: (item) => {
            // 转发
            if (item.type === 'DYNAMIC_TYPE_FORWARD' && item.orig) {
                return Parser.parseItem(item.orig);
            }

            // Opus (Opus 类型通过 API 返回的也是 modules 数组)
            if (item.modules && Array.isArray(item.modules)) {
                return Parser.parseOpusStructure(item);
            }

            // Article API 返回的数据 (如果是通过 API 抓取的 CV)
            if (item._type === 'read') {
                return Parser.parseReadStructure(item);
            }

            // 普通动态 (图文/视频)
            const modules = item.modules || {};
            const author = modules.module_author || {};
            const major = modules.module_dynamic?.major || {};
            const desc = modules.module_dynamic?.desc || {};

            let rawUrls = [];
            let title = '';

            if (major.opus && major.opus.pics) {
                rawUrls = major.opus.pics.map(p => p.url);
                title = major.opus.title || '';
            } else if (major.draw && major.draw.items) {
                rawUrls = major.draw.items.map(p => p.src);
            } else if (major.archive && major.archive.cover) {
                rawUrls = [major.archive.cover];
                title = major.archive.title || '';
            } else if (major.article && major.article.covers) {
                rawUrls = major.article.covers;
                title = major.article.title || '';
            } else if (major.live_rcmd?.content) {
                try {
                    const d = JSON.parse(major.live_rcmd.content);
                    if (d.live_play_info?.cover) rawUrls = [d.live_play_info.cover];
                } catch(e) {}
            }

            return Parser.buildData(rawUrls, {
                username: author.name,
                itemId: item.id_str,
                pubTime: author.pub_ts,
                type: Parser.getDynamicType(item.type),
                title: title,
                text: desc.text
            });
        }
    };


    /**
     * =========================================================================
     *  6. 业务逻辑控制器 (Controller)
     * =========================================================================
     */
    const Controller = {
        start: async (id) => {
            Utils.showToast(`正在解析数据...`);

            try {
                // 1. 尝试 SSR (最快，最准)
                // 只有当前页面就是该动态/专栏的详情页时，SSR 才有效
                const ssrInfo = Core.readSSRData(id);
                if (ssrInfo) {
                    let parsedData = null;
                    if (ssrInfo.type === 'opus') {
                        parsedData = Parser.parseOpusStructure(ssrInfo.data, true);
                    } else if (ssrInfo.type === 'read') {
                        parsedData = Parser.parseReadStructure(ssrInfo.data);
                    }

                    if (parsedData && parsedData.images.length > 0) {
                        console.log('[BiliDL] Used SSR data');
                        Controller.downloadBatch(parsedData);
                        return;
                    }
                }

                // 2. 如果 SSR 不可用或没数据（例如在列表页点击），回退到 API
                console.log('[BiliDL] Fallback to API');
                const apiItem = await Network.fetchDetail(id);
                const data = Parser.parseItem(apiItem);

                if (!data.images.length) {
                    alert(`该内容 (${data.type}) 中没有找到图片，或者需要进入详情页下载。`);
                    return;
                }
                Controller.downloadBatch(data);

            } catch (err) {
                console.error(err);
                alert(`获取数据失败: ${err}\n请尝试点击进入动态/专栏详情页后再下载。`);
            }
        },

        downloadBatch: (data) => {
            const template = GM_getValue(CONFIG.STORAGE.FILENAME_TEMPLATE, CONFIG.DEFAULTS.TEMPLATE);
            const forceFallback = GM_getValue(CONFIG.STORAGE.FORCE_FALLBACK, CONFIG.DEFAULTS.FALLBACK);

            Utils.showToast(`开始下载 ${data.images.length} 张图片...`);

            data.images.forEach((img, i) => {
                const fileData = { ...data, index: String(i + 1).padStart(2, '0'), format: img.format };
                const filename = Utils.formatFilename(template, fileData);

                if (forceFallback) {
                    Network.downloadBlob(img.url, filename);
                } else {
                    try {
                        GM_download({
                            url: img.url,
                            name: filename,
                            headers: { "Referer": "https://t.bilibili.com/" },
                            onerror: (err) => {
                                console.warn('GM_download error, using fallback:', err);
                                Network.downloadBlob(img.url, filename);
                            }
                        });
                    } catch(e) {
                        Network.downloadBlob(img.url, filename);
                    }
                }
            });
        }
    };


    /**
     * =========================================================================
     *  7. UI 交互模块 (UI)
     * =========================================================================
     */
    const UI = {
        init: () => {
            // 列表页监听 (Cascader 菜单)
            document.body.addEventListener('mouseover', (e) => {
                const moreBtn = e.target.closest('.bili-dyn-item__more');
                if (moreBtn) UI.injectMenu(moreBtn);
            });

            // 详情页注入 (侧边栏)
            // 匹配 opus, read/cv, t.bilibili/id
            const href = location.href;
            const match = href.match(/(?:opus)\/(\d+)|read\/cv(\d+)|t\.bilibili\.com\/(\d+)/);
            if (match) {
                const id = match[1] || match[2] || match[3];
                if (id) UI.injectDetailButton(id);
            }
        },

        injectMenu: (moreBtn) => {
            const wrapper = moreBtn.closest('.bili-dyn-item__more') || moreBtn;
            const cascader = wrapper.querySelector('.bili-cascader, .bili-dyn-more__cascader');
            if (!cascader) return;

            setTimeout(() => {
                const list = cascader.querySelector('.bili-cascader-options, .bili-dyn-more__menu');
                if (list && !list.querySelector('.download-images-option')) {
                    const item = document.createElement('div');
                    item.className = 'download-images-option';

                    if (list.classList.contains('bili-cascader-options')) {
                         item.classList.add('bili-cascader-options__item');
                         item.innerHTML = `<div class="bili-cascader-options__item-custom"><div><div class="bili-cascader-options__item-label">下载图片</div></div></div>`;
                    } else {
                         item.classList.add('bili-dyn-more__menu__item');
                         item.textContent = '下载图片';
                         item.style.padding = "0 12px"; item.style.lineHeight = "30px";
                    }

                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const card = moreBtn.closest('.bili-dyn-list__item, .list__topic-card');
                        if (card) {
                            const id = Core.getDynamicId(card);
                            if (id) Controller.start(id);
                            else alert('无法获取动态ID，请确保这是否是标准的动态卡片。');
                        }
                    });

                    list.insertBefore(item, list.firstChild);
                }
            }, CONFIG.LIMITS.MENU_RENDER_DELAY);
        },

        injectDetailButton: (id) => {
            Utils.waitForElement('.side-toolbar__box', (bar) => {
                if (document.getElementById('bili-detail-dl-btn')) return;
                const btn = document.createElement('div');
                btn.id = 'bili-detail-dl-btn';
                btn.className = 'side-toolbar__action download';
                btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V12.5858L14.2929 11.2929C14.6834 10.9024 15.3166 10.9024 15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929C8.68342 10.9024 9.31658 10.9024 9.70711 11.2929L11 12.5858V5Z" fill="currentColor"/><path d="M4 14C4 13.4477 4.44772 13 5 13H7C7.55228 13 8 13.4477 8 14V18C8 18.5523 7.55228 19 7 19H5C4.44772 19 4 18.5523 4 18V14Z" fill="currentColor"/><path d="M16 13C16.5523 13 17 13.4477 17 14V18C17 18.5523 16.5523 19 16 19H18C18.5523 19 18.5523 19 18V14C19 13.4477 18.5523 13 18 13H16Z" fill="currentColor" opacity="0.5"/><path d="M4 19C3.44772 19 3 19.4477 3 20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20C21 19.4477 20.5523 19 20 19H4Z" fill="currentColor"/></svg><div class="side-toolbar__action__text">下载</div>`;
                btn.addEventListener('click', () => Controller.start(id));
                bar.insertBefore(btn, bar.firstChild);
            });
        }
    };


    /**
     * =========================================================================
     *  8. 设置面板 (Settings)
     * =========================================================================
     */
    const Settings = {
        init: () => GM_registerMenuCommand('下载设置', Settings.open),
        open: () => {
            if (document.querySelector('.bili-dl-settings-panel')) return;

            const bg = document.createElement('div');
            bg.className = 'bili-dl-settings-overlay';
            const p = document.createElement('div');
            p.className = 'bili-dl-settings-panel';

            p.innerHTML = `
                <h3>哔哩哔哩动态图片下载 - 设置</h3>

                <div class="setting-group">
                    <label>文件名格式</label>
                    <input type="text" id="f_tpl">
                    <div class="variable-tags">
                        <span class="variable-tag" data-tip="UP主名字">{username}</span>
                        <span class="variable-tag" data-tip="发布日期 (YYMMDD)">{date}</span>
                        <span class="variable-tag" data-tip="动态ID">{itemId}</span>
                        <span class="variable-tag" data-tip="图片序号 (01)">{index}</span>
                        <span class="variable-tag" data-tip="图片格式 (jpg)">{format}</span>
                        <span class="variable-tag" data-tip="动态标题 (视频/专栏)">{title}</span>
                        <span class="variable-tag" data-tip="动态正文 (前${CONFIG.LIMITS.TEXT_TRUNCATE}字)">{text}</span>
                        <span class="variable-tag" data-tip="类型 (图文/视频)">{type}</span>
                    </div>
                    <div class="tip-text">不支持创建文件夹，所有符号 / \\ 将被替换。</div>
                    <div class="preview-box">
                        预览: <code id="f_preview"></code>
                    </div>
                </div>

                <div class="setting-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="f_fallback"> 备用下载
                    </label>
                    <div class="tip-text">应对可能的浏览器兼容问题，真出错也解决不了233</div>
                </div>

                <div class="actions">
                    <button class="btn-reset">恢复默认</button>
                    <button class="btn-close">关闭</button>
                    <button class="btn-save">保存设置</button>
                </div>
            `;

            document.body.append(bg, p);

            // 逻辑绑定
            const inputTpl = p.querySelector('#f_tpl');
            const previewCode = p.querySelector('#f_preview');
            const checkFallback = p.querySelector('#f_fallback');

            inputTpl.value = GM_getValue(CONFIG.STORAGE.FILENAME_TEMPLATE, CONFIG.DEFAULTS.TEMPLATE);
            checkFallback.checked = GM_getValue(CONFIG.STORAGE.FORCE_FALLBACK, CONFIG.DEFAULTS.FALLBACK);

            const updatePreview = () => {
                previewCode.textContent = Utils.formatFilename(inputTpl.value, CONFIG.DUMMY_DATA);
            };

            inputTpl.addEventListener('input', updatePreview);

            p.querySelectorAll('.variable-tag').forEach(tag => {
                tag.addEventListener('click', () => {
                    const v = tag.textContent;
                    const start = inputTpl.selectionStart;
                    const val = inputTpl.value;
                    inputTpl.value = val.slice(0, start) + v + val.slice(inputTpl.selectionEnd);
                    inputTpl.focus();
                    updatePreview();
                });
            });

            updatePreview();

            // 按钮事件
            const close = () => { bg.remove(); p.remove(); };
            bg.onclick = p.querySelector('.btn-close').onclick = close;

            p.querySelector('.btn-reset').onclick = () => {
                inputTpl.value = CONFIG.DEFAULTS.TEMPLATE;
                checkFallback.checked = CONFIG.DEFAULTS.FALLBACK;
                updatePreview();
                Utils.showToast('已恢复默认设置 (需点击保存生效)');
            };

            p.querySelector('.btn-save').onclick = () => {
                GM_setValue(CONFIG.STORAGE.FILENAME_TEMPLATE, inputTpl.value);
                GM_setValue(CONFIG.STORAGE.FORCE_FALLBACK, checkFallback.checked);
                Utils.showToast('设置已保存');
                close();
            };
        }
    };


    /**
     * =========================================================================
     *  9. 主程序入口 (Main)
     * =========================================================================
     */
    (function Main() {
        Settings.init();
        UI.init();
    })();

})();