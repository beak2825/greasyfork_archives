// ==UserScript==
// @name         【网页标题】自定义修改与管理
// @namespace    https://github.com/realSilasYang
// @version      2026-01-05
// @description  根据网址自定义网页标题。拥有可视化设置界面。
// @author       阳熙来
// @license      MIT
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzUzNjEwMjc1OTc1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE3NTIiIGRhdGEtZGFya3JlYWRlci1pbmxpbmUtZmlsbD0iIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0yMTcuNiA3OTMuNmg1NjMuMmMyMC40OCAwIDM4LjQgMTcuOTIgMzguNCAzOC40cy0xNy45MiAzOC40LTM4LjQgMzguNGgtNTYzLjJjLTIwLjQ4IDAtMzguNC0xNS4zNi0zOC40LTM4LjQgMC0yMC40OCAxNy45Mi0zOC40IDM4LjQtMzguNHoiIGZpbGw9IiNBM0NDRkYiIHAtaWQ9IjE3NTMiIHN0eWxlPSItLWRhcmtyZWFkZXItaW5saW5lLWZpbGw6IHZhcigtLWRhcmtyZWFkZXItYmFja2dyb3VuZC1hM2NjZmYsICM0NTQ4NGEpOyIgZGF0YS1kYXJrcmVhZGVyLWlubGluZS1maWxsPSIiPjwvcGF0aD48cGF0aCBkPSJNNzkzLjYgMzQwLjQ4bC01OC44OCA2Ni41Ni0xOTkuNjgtMjA0LjggNjEuNDQtNjRjMTIuOC0xNS4zNiAzMy4yOC0xNS4zNiA0OC42NCAwbDE0OC40OCAxNTMuNmMxMi44IDEyLjggMTIuOCAzMy4yOCAwIDQ4LjY0ek0xOTkuNjggNTQyLjcyTDQ5MS41MiAyMzguMDhsMTk5LjY4IDIwNC44LTI5MS44NCAzMDQuNjRIMTk5LjY4di0yMDQuOHoiIGZpbGw9IiMyNTg5RkYiIHAtaWQ9IjE3NTQiIHN0eWxlPSItLWRhcmtyZWFkZXItaW5saW5lLWZpbGw6IHZhcigtLWRhcmtyZWFkZXItYmFja2dyb3VuZC0yNTg5ZmYsICMyMDVlYTgpOyIgZGF0YS1kYXJrcmVhZGVyLWlubGluZS1maWxsPSIiPjwvcGF0aD48L3N2Zz4=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543769/%E3%80%90%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E3%80%91%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BF%AE%E6%94%B9%E4%B8%8E%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/543769/%E3%80%90%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E3%80%91%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BF%AE%E6%94%B9%E4%B8%8E%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

/**
 * @run-at document-start 说明：
 * 脚本在 document 元素创建后但任何其他内容加载前运行。
 * 这对于尽早劫持 document.title 至关重要，防止网页原标题闪烁。
 */

(function () {
    'use strict';

    // =========================================================================
    //  全局配置与文本管理
    //  (将所有UI文本集中在此，方便后续维护或国际化)
    // =========================================================================

    const CONFIG = {
        // 油猴脚本菜单命令名称
        menu_set_current: "⚙️ 自定义当前网页标题",
        menu_manager: "🗂️ 管理自定义标题规则",

        // 弹窗界面的主标题
        title_set_ui: "自定义当前网页标题",
        title_mgr_ui: "管理自定义标题规则",
        title_confirm_remove: "⚠️ 移除规则",
        title_confirm_reset: "🚨 恢复默认设置",

        // 表单标签与提示语
        label_rule: "网址 (域名或完整 url):",
        label_custom_title: "自定义标题:",
        // {domain} 占位符会被脚本自动替换为当前网站的域名
        hint_rule: "• <strong>默认:</strong> 匹配当前具体网页(含路径和Hash)<br>• <strong>全站:</strong> 删掉斜杠后内容 (仅保留 {domain}) 即可匹配全站",

        // 输入框占位符 (Placeholder)
        ph_title_input: "输入显示的标题",
        ph_rule_name: "规则名",
        ph_new_name: "自定义标题",
        ph_new_url: "域名或完整 url (如 example.com)",

        // 按钮文字
        btn_save: "保存设置 (Enter)",
        btn_cancel: "取消 (Esc)",
        btn_close: "关闭 (Esc)",
        btn_reset: "重置",
        btn_delete: "删除",
        btn_add: "新增",
        btn_confirm_yes: "确认",
        btn_confirm_no: "取消",

        // 系统消息与默认逻辑值
        msg_rule_empty: "规则不能为空",
        msg_saved_prefix: "已保存规则：\n",
        msg_deleted_suffix: "(已删除)",
        msg_confirm_remove: "确定要移除以下网址的规则吗？",
        msg_confirm_reset: "确定要清空所有自定义规则吗？",
        msg_list_empty: "暂无已保存的自定义标题",
        default_new_title_name: "自定义标题"
    };

    // 菜单顶部的小图标 (SVG Base64)，用于增强UI美观度
    const MENU_ICON = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzUzNjEwMjc1OTc1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE3NTIiIGRhdGEtZGFya3JlYWRlci1pbmxpbmUtZmlsbD0iIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0yMTcuNiA3OTMuNmg1NjMuMmMyMC40OCAwIDM4LjQgMTcuOTIgMzguNCAzOC40cy0xNy45MiAzOC40LTM4LjQgMzguNGgtNTYzLjJjLTIwLjQ4IDAtMzguNC0xNS4zNi0zOC40LTM4LjQgMC0yMC40OCAxNy45Mi0zOC40IDM4LjQtMzguNHoiIGZpbGw9IiNBM0NDRkYiIHAtaWQ9IjE3NTMiIHN0eWxlPSItLWRhcmtyZWFkZXItaW5saW5lLWZpbGw6IHZhcigtLWRhcmtyZWFkZXItYmFja2dyb3VuZC1hM2NjZmYsICM0NTQ4NGEpOyIgZGF0YS1kYXJrcmVhZGVyLWlubGluZS1maWxsPSIiPjwvcGF0aD48cGF0aCBkPSJNNzkzLjYgMzQwLjQ4bC01OC44OCA2Ni41Ni0xOTkuNjgtMjA0LjggNjEuNDQtNjRjMTIuOC0xNS4zNiAzMy4yOC0xNS4zNiA0OC42NCAwbDE0OC40OCAxNTMuNmMxMi44IDEyLjggMTIuOCAzMy4yOCAwIDQ4LjY0ek0xOTkuNjggNTQyLjcyTDQ5MS41MiAyMzguMDhsMTk5LjY4IDIwNC44LTI5MS44NCAzMDQuNjRIMTk5LjY4di0yMDQuOHoiIGZpbGw9IiMyNTg5RkYiIHAtaWQ9IjE3NTQiIHN0eWxlPSItLWRhcmtyZWFkZXItaW5saW5lLWZpbGw6IHZhcigtLWRhcmtyZWFkZXItYmFja2dyb3VuZC0yNTg5ZmYsICMyMDVlYTgpOyIgZGF0YS1kYXJrcmVhZGVyLWlubGluZS1maWxsPSIiPjwvcGF0aD48L3N2Zz4=";

    // 默认内置的规则列表 (用户首次安装运行时，这些规则会被写入存储)
    const defaultMap = {
        'tophub.today':  '新闻聚合',
        'www.gushiwen.cn':  '古诗文网'
    };

    // 油猴存储的 Key 名称
    const STORAGE_KEY = 'custom_title_map';

    // =========================================================================
    //  数据存储与工具函数
    // =========================================================================

    /**
     * 读取配置
     * @returns {Object} 域名/路径到标题的映射对象
     */
    function getTitleMap() {
        let stored = GM_getValue(STORAGE_KEY, null);
        if (!stored) {
            // 初始化默认值
            GM_setValue(STORAGE_KEY, defaultMap);
            return defaultMap;
        }
        return stored;
    }

    /**
     * 保存配置
     * @param {Object} newMap 新的映射对象
     */
    function saveTitleMap(newMap) {
        GM_setValue(STORAGE_KEY, newMap);
    }

    /**
     * 标准化 Key (URL清洗)
     * 作用：统一存储格式，避免 'http://' 和 'https://' 造成重复或匹配失败
     * 1. 去除协议头 (http/https)
     * 2. 尝试 URL 解码 (让中文路径可读性更好)
     * 3. 去除末尾斜杠 (统一格式)
     */
    function normalizeKey(input) {
        if (!input) return "";
        let key = input.trim();
        key = key.replace(/^https?:\/\//, ""); // 去除协议头
        try { key = decodeURIComponent(key); } catch(e) {} // 尝试解码 (解决中文网址问题)
        key = key.replace(/\/$/, ""); // 去除末尾斜杠
        return key;
    }

    /**
     * 从 Key 中提取域名
     * 用途：用于调用 Google API 获取网站图标
     */
    function getDomainFromKey(key) {
        if (!key) return '';
        return key.split('/')[0];
    }

    /**
     * 获取 Favicon API 地址
     * 使用 Google 公共服务，尺寸为 64px
     */
    function getFaviconUrl(key) {
        const domain = getDomainFromKey(key);
        return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    }

    // =========================================================================
    //  核心逻辑：标题匹配与锁定
    //  (在页面加载极早期执行)
    // =========================================================================

    const currentMap = getTitleMap();
    const currentHost = location.hostname;

    // 获取当前页面的各项路径参数
    const rawPath = location.pathname;
    const rawHash = location.hash;

    // 获取解码后的路径 (用于匹配中文路径规则)
    const decodedPath = decodeURIComponent(rawPath);
    const decodedHash = decodeURIComponent(rawHash);

    // --- 构建匹配优先级链 ---
    // 逻辑：越具体的规则优先级越高 (完整路径 > 仅路径 > 仅域名)

    // 1. 完整匹配 (含Hash) - 优先尝试解码版，后尝试编码版
    const keyFullDecoded = (currentHost + decodedPath + decodedHash).replace(/\/$/, "");
    const keyFullEncoded = (currentHost + rawPath + rawHash).replace(/\/$/, "");

    // 2. 路径匹配 (无Hash)
    const keyPathDecoded = (currentHost + decodedPath).replace(/\/$/, "");
    const keyPathEncoded = (currentHost + rawPath).replace(/\/$/, "");

    // 3. 域名匹配 (仅域名)
    const domainKey = currentHost;

    // 执行匹配查找
    const targetTitle = currentMap[keyFullDecoded] ||
                        currentMap[keyFullEncoded] ||
                        currentMap[keyPathDecoded] ||
                        currentMap[keyPathEncoded] ||
                        currentMap[domainKey];

    // 如果匹配到了自定义标题，开始执行修改与锁定
    if (targetTitle) {
        // 1. 立即修改当前标题 (最快速度生效)
        document.title = targetTitle;

        // 2. 创建 MutationObserver 持续锁定标题
        // 作用：防止单页应用 (SPA) 路由跳转或其它脚本动态将标题修改回原标题
        const lockTitleObserver = () => {
            const titleEl = document.querySelector('title');
            if (!titleEl) return false;
            new MutationObserver(() => {
                // 一旦检测到变化，立即改回自定义标题
                if (document.title !== targetTitle) document.title = targetTitle;
            }).observe(titleEl, { childList: true, subtree: true });
            return true;
        };

        // 尝试多次锁定，确保在 DOM title 标签加载后能立即挂载观察者
        const maxWait = Date.now() + 5000;
        const tryLock = () => {
            if (lockTitleObserver()) return; // 成功锁定则退出
            if (Date.now() > maxWait) return; // 超时退出
            requestAnimationFrame(tryLock); // 下一帧继续尝试
        };
        tryLock();

        // 3. 劫持 document.title 的 setter 方法 (更强力的锁定)
        // 作用：如果其他脚本尝试执行 document.title = "...", 这里会拦截并强制赋值为 targetTitle
        try {
            let originalTitleDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
            Object.defineProperty(document, 'title', {
                set(v) {
                    // 忽略传入的值 v，强制设置为我们的自定义标题
                    originalTitleDescriptor.set.call(document, targetTitle);
                },
                get() {
                    return originalTitleDescriptor.get.call(document);
                },
                configurable: true
            });
        } catch (e) {}
    }

    // =========================================================================
    //  UI 界面构建与逻辑
    // =========================================================================

    // 注册油猴菜单
    GM_registerMenuCommand(CONFIG.menu_set_current, showSetCurrentUI);
    GM_registerMenuCommand(CONFIG.menu_manager, showManagerUI);

    // 注入全局 CSS 样式
    // 包含：模态框遮罩、深色模式配色、滚动条美化、按钮样式等
    GM_addStyle(`
        /* 模态框遮罩层 - 居中布局 */
        .gm-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); display: flex;
            justify-content: center; align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            backdrop-filter: blur(4px); /* 背景模糊效果 */
            z-index: 999999;
        }
        #gm-confirm-overlay { z-index: 1000000; background: rgba(0,0,0,0.85); }

        /* 模态框主体 */
        .gm-modal-box {
            background: #2b2b2b; color: #e0e0e0; padding: 25px; border-radius: 12px;
            width: 750px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6); max-height: 85vh; display: flex; flex-direction: column;
            border: 1px solid #444;
        }
        /* 确认框尺寸稍小 */
        #gm-confirm-overlay .gm-modal-box { width: 420px; border: 1px solid #555; padding: 30px; box-shadow: 0 15px 40px rgba(0,0,0,0.8); }

        /* 标题栏 */
        .gm-title-header { font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 12px; color: #fff; display: flex; align-items: center; }

        /* 内容区域 (可滚动) */
        .gm-title-content { flex: 1; overflow-y: auto; margin-bottom: 20px; padding-right: 5px; }

        /* 滚动条美化 */
        .gm-title-content::-webkit-scrollbar { width: 6px; }
        .gm-title-content::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
        .gm-title-content::-webkit-scrollbar-track { background: transparent; }

        /* 列表行布局 */
        .gm-title-row {
            display: flex; align-items: center;
            padding: 4px 5px;
            border-bottom: 1px solid #3a3a3a;
            transition: background 0.05s;
            border-radius: 6px;
            min-height: 48px;
        }
        .gm-title-row:hover { background: #333; }
        .gm-title-row:last-child { border-bottom: none; }

        /* 新建规则行特殊样式 */
        .gm-add-row {
            border-top: 1px dashed #555;
            margin-top: 10px;
            padding-top: 10px;
            background: rgba(255, 255, 255, 0.03);
        }
        .gm-add-row:hover { background: rgba(255, 255, 255, 0.06); }

        /* Favicon 图标 */
        .gm-favicon {
            width: 32px; height: 32px;
            margin-right: 12px;
            border-radius: 4px;
            flex-shrink: 0;
            background: #fff;
            object-fit: contain;
        }

        /* 隐形编辑框 (Input/Textarea) - 让文本看起来像普通文字，但点击可编辑 */
        .gm-invisible-input {
            background: transparent;
            border: 1px solid transparent;
            color: inherit;
            outline: none;
            padding: 2px 4px;
            border-radius: 4px;
            transition: all 0.05s ease;
            box-sizing: border-box;
            display: block;
            font-family: inherit;
            resize: none;
            overflow-y: auto;
            scrollbar-width: none; /* Firefox 隐藏滚动条 */
            -ms-overflow-style: none; /* IE 隐藏滚动条 */
        }
        .gm-invisible-input::-webkit-scrollbar { display: none; } /* Chrome 隐藏滚动条 */

        /* 新建规则输入框的 Placeholder 颜色 */
        .gm-add-input::placeholder { color: #bbb; font-style: normal; opacity: 1; }

        /* 规则名列样式 */
        textarea.gm-col-name {
            width: 220px;
            font-size: 15px; font-weight: 700; color: #fff;
            flex-shrink: 0; margin-right: 8px;
            white-space: pre-wrap; word-break: break-all;
            height: 40px; line-height: 1.3;
            align-self: center;
        }

        /* URL列样式 */
        textarea.gm-col-url {
            flex: 1;
            font-size: 14px; color: #bbb; font-family: monospace;
            height: 40px; line-height: 1.4;
            margin-right: 10px;
            white-space: pre-wrap; word-break: break-all;
            align-self: center;
        }

        /* 按钮通用样式 */
        .gm-btn {
            padding: 6px 14px; border: none; border-radius: 6px; cursor: pointer;
            font-size: 13px; font-weight: 500; height: 32px;
            display: inline-flex; align-items: center; justify-content: center;
            user-select: none; /* 防止点击时选中按钮文字 */
            /* [重要修复] 移除 transition: all，只过渡特定属性，解决点击判定失效问题 */
            transition: background-color 0.1s, opacity 0.1s, box-shadow 0.1s;
        }
        .gm-btn:hover { opacity: 0.9; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .gm-btn:active { opacity: 0.7; box-shadow: inset 0 1px 3px rgba(0,0,0,0.3); }

        /* 按钮统一操作列样式 (删除/新增/重置) */
        .gm-btn-action {
            width: 60px;
            padding: 0;
            font-size: 13px;
        }

        .gm-btn-primary { background: #3a86ff; color: white; }
        .gm-btn-danger { background: #e63946; color: white; }
        .gm-btn-success { background: #2a9d8f; color: white; }
        .gm-btn-secondary { background: #4a4a4a; color: #ddd; }

        .gm-btn-group { display: flex; justify-content: flex-end; gap: 10px; align-items: center; }

        /* 确认弹窗专用按钮样式 */
        #gm-confirm-overlay .gm-btn { padding: 8px 24px; font-size: 14px; height: 38px; font-weight: 600; min-width: 80px; }
        #gm-confirm-overlay .gm-btn-group { gap: 15px; margin-top: 10px; }
        #gm-confirm-overlay .gm-btn-danger { box-shadow: 0 4px 12px rgba(230, 57, 70, 0.25); }
        #gm-confirm-overlay .gm-btn-danger:hover { background: #ff4d5a; box-shadow: 0 6px 16px rgba(230, 57, 70, 0.4); }
        #gm-confirm-overlay .gm-btn-secondary { background: #3e3e3e; border: 1px solid #555; }
        #gm-confirm-overlay .gm-btn-secondary:hover { background: #505050; border-color: #666; color: #fff; }

        /* 设置界面的输入框 */
        .gm-input-main {
            width: 100%; padding: 10px; margin: 8px 0 20px 0; box-sizing: border-box;
            border: 1px solid #555; border-radius: 6px;
            background: #333; color: #fff; font-size: 15px; outline: none; font-family: monospace;
        }
        .gm-label { font-size: 14px; color: #bbb; font-weight: bold; margin-top: 5px; display:block; }
        .gm-hint { font-size: 12px; color: #888; margin-top: -10px; margin-bottom: 10px; line-height: 1.5; }

        .gm-confirm-msg { font-size: 15px; line-height: 1.6; color: #eee; margin-bottom: 25px; }
        .gm-confirm-url {
            background: #1a1a1a; padding: 10px; border-radius: 6px;
            margin-top: 10px; color: #ff6b6b; font-family: monospace;
            word-break: break-all; font-size: 13px; border: 1px dashed #555;
        }
    `);

    // 通用创建模态框函数
    // 动态在 DOM 中插入 div，并在关闭时移除
    function createModal(id, title, contentHtml, buttonsHtml) {
        const old = document.getElementById(id);
        if (old) old.remove(); // 防止重复创建

        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.className = 'gm-modal-overlay';
        overlay.innerHTML = `
            <div class="gm-modal-box">
                <div class="gm-title-header">${title}</div>
                <div class="gm-title-content">${contentHtml}</div>
                <div class="gm-btn-group">${buttonsHtml}</div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    // 通用确认对话框 (二次确认)
    function showConfirmDialog(title, msg, highlightText, onConfirm) {
        const html = `
            <div class="gm-confirm-msg">
                ${msg}
                ${highlightText ? `<div class="gm-confirm-url">${highlightText}</div>` : ''}
            </div>
        `;
        const btns = `
            <button type="button" id="gm-confirm-yes" class="gm-btn gm-btn-danger">${CONFIG.btn_confirm_yes}</button>
            <button type="button" id="gm-confirm-no" class="gm-btn gm-btn-secondary">${CONFIG.btn_confirm_no}</button>
        `;

        const overlay = createModal('gm-confirm-overlay', title, html, btns);
        const closeConfirm = () => {
            document.removeEventListener('keydown', confirmEscHandler);
            overlay.remove();
        };
        // 绑定键盘事件：Esc 关闭
        const confirmEscHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeConfirm();
            }
        };
        document.addEventListener('keydown', confirmEscHandler);
        document.getElementById('gm-confirm-no').onclick = closeConfirm;
        overlay.onclick = (e) => { if (e.target === overlay) closeConfirm(); }; // 点击遮罩关闭
        document.getElementById('gm-confirm-yes').onclick = () => { closeConfirm(); onConfirm(); };
    }

    // =========================================================================
    //  界面 1: 设置当前页面标题
    //  (快捷操作，通常用于给当前打开的页面命名)
    // =========================================================================

    function showSetCurrentUI() {
        const map = getTitleMap();

        // 自动填入当前完整解码路径 (含Hash)
        const defaultKey = normalizeKey(location.href);

        // 模拟匹配逻辑以获取当前可能已存在的自定义标题
        const rawPath = location.pathname;
        const rawHash = location.hash;
        const decodedPath = decodeURIComponent(rawPath);
        const decodedHash = decodeURIComponent(rawHash);

        const keyFullDecoded = (location.hostname + decodedPath + decodedHash).replace(/\/$/, "");
        const keyFullEncoded = (location.hostname + rawPath + rawHash).replace(/\/$/, "");
        const keyPathDecoded = (location.hostname + decodedPath).replace(/\/$/, "");
        const domainKey = location.hostname;

        // 如果该页面已有配置，则输入框显示已有标题；否则显示当前网页原标题
        const currentTitleVal = map[keyFullDecoded] || map[keyFullEncoded] || map[keyPathDecoded] || map[domainKey] || document.title;

        // 标题栏
        const headerTitle = `
            <img src="${MENU_ICON}" style="width:24px;height:24px;margin-right:8px;">
            ${CONFIG.title_set_ui}
        `;

        // 提示语处理 (将 {domain} 替换为真实域名)
        const hintText = CONFIG.hint_rule.replace("{domain}", domainKey);

        const html = `
            <label class="gm-label">${CONFIG.label_rule}</label>
            <input type="text" id="gm-key-input" class="gm-input-main" value="${defaultKey}">
            <div class="gm-hint">${hintText}</div>

            <label class="gm-label">${CONFIG.label_custom_title}</label>
            <input type="text" id="gm-new-title" class="gm-input-main" value="${currentTitleVal}" placeholder="${CONFIG.ph_title_input}">
        `;

        const btns = `
            <button type="button" id="gm-btn-save" class="gm-btn gm-btn-primary">${CONFIG.btn_save}</button>
            <button type="button" id="gm-btn-close" class="gm-btn gm-btn-secondary">${CONFIG.btn_cancel}</button>
        `;

        const overlay = createModal('gm-main-overlay', headerTitle, html, btns);

        const closeUI = () => {
            document.removeEventListener('keydown', keyHandler);
            overlay.remove();
        };

        // 保存逻辑
        const saveUI = () => {
            let inputKey = document.getElementById('gm-key-input').value;
            inputKey = normalizeKey(inputKey);

            const newVal = document.getElementById('gm-new-title').value.trim();

            if (!inputKey) { alert(CONFIG.msg_rule_empty); return; }

            const nowMap = getTitleMap();
            // 如果标题为空，则视为删除规则
            if (newVal) nowMap[inputKey] = newVal;
            else delete nowMap[inputKey];

            saveTitleMap(nowMap);
            closeUI();

            // 如果修改的是当前页面，直接刷新查看效果 (提升用户体验)
            // 使用 includes 判断是因为 inputKey 可能去除了协议头
            if (inputKey.includes(currentHost)) location.reload();
            else alert(`${CONFIG.msg_saved_prefix}${inputKey} \n-> ${newVal || CONFIG.msg_deleted_suffix}`);
        };

        document.getElementById('gm-btn-close').onclick = closeUI;
        document.getElementById('gm-btn-save').onclick = saveUI;
        overlay.onclick = (e) => { if (e.target === overlay) closeUI(); };

        const keyHandler = (e) => {
            if (e.key === 'Escape') { e.preventDefault(); closeUI(); }
            else if (e.key === 'Enter') { e.preventDefault(); saveUI(); }
        };
        document.addEventListener('keydown', keyHandler);

        // 自动聚焦输入框并全选，方便直接输入
        setTimeout(() => {
            const input = document.getElementById('gm-new-title');
            if(input) { input.focus(); input.select(); }
        }, 100);
    }

    // =========================================================================
    //  界面 2: 管理所有标题规则
    //  (列表展示、增删改查)
    // =========================================================================

    function showManagerUI() {
        const map = getTitleMap();
        const keys = Object.keys(map);

        let listHtml = '';
        if (keys.length === 0) {
            listHtml = `<div style="text-align:center; padding: 20px; color:#666; font-size:16px;">${CONFIG.msg_list_empty}</div>`;
        } else {
            // 渲染现有规则列表
            keys.forEach(key => {
                const faviconUrl = getFaviconUrl(key);
                listHtml += `
                    <div class="gm-title-row">
                        <img src="${faviconUrl}" class="gm-favicon" loading="lazy" alt="icon" onerror="this.style.opacity=0.3">
                        <textarea class="gm-invisible-input gm-col-name" rows="2" data-key="${key}" placeholder="${CONFIG.ph_rule_name}" spellcheck="false">${map[key]}</textarea>
                        <textarea class="gm-invisible-input gm-col-url" rows="2" data-old-key="${key}" spellcheck="false">${key}</textarea>
                        <button type="button" class="gm-btn gm-btn-danger gm-btn-action" data-key="${key}">${CONFIG.btn_delete}</button>
                    </div>
                `;
            });
        }

        // 底部：新建规则行
        listHtml += `
            <div class="gm-title-row gm-add-row" id="gm-add-container">
                <img id="gm-add-preview" class="gm-favicon" src="" style="visibility: hidden;">
                <textarea id="gm-add-name" class="gm-invisible-input gm-col-name gm-add-input" rows="2" placeholder="${CONFIG.ph_new_name}" spellcheck="false"></textarea>
                <textarea id="gm-add-url" class="gm-invisible-input gm-col-url gm-add-input" rows="2" placeholder="${CONFIG.ph_new_url}" spellcheck="false"></textarea>
                <button type="button" id="gm-btn-add" class="gm-btn gm-btn-success gm-btn-action">${CONFIG.btn_add}</button>
            </div>
        `;

        const headerTitle = `
            <img src="${MENU_ICON}" style="width:24px;height:24px;margin-right:8px;">
            ${CONFIG.title_mgr_ui}
        `;

        // 底部按钮组
        const btns = `
            <button type="button" id="gm-btn-close-mgr" class="gm-btn gm-btn-secondary" style="margin-right: auto; color: #fff;">${CONFIG.btn_close}</button>
            <button type="button" id="gm-btn-reset" class="gm-btn gm-btn-danger gm-btn-action" style="background-color: #333; border: 1px solid #555; color: #999; margin-right: 10px;">${CONFIG.btn_reset}</button>
        `;
        const overlay = createModal('gm-main-overlay', headerTitle, listHtml, btns);

        const closeMgr = () => {
            document.removeEventListener('keydown', mgrKeyHandler);
            overlay.remove();
        };

        document.getElementById('gm-btn-close-mgr').onclick = closeMgr;
        overlay.onclick = (e) => { if (e.target === overlay) closeMgr(); };

        const mgrKeyHandler = (e) => {
            if (e.key === 'Escape') {
                // 如果当前有确认弹窗，Escape 仅关闭确认弹窗（由确认弹窗逻辑处理），不关闭主管理界面
                if (document.getElementById('gm-confirm-overlay')) return;
                e.preventDefault();
                closeMgr();
            }
        };
        document.addEventListener('keydown', mgrKeyHandler);

        // --- 逻辑：添加新规则 ---
        const handleAdd = () => {
            const nameInput = document.getElementById('gm-add-name');
            const urlInput = document.getElementById('gm-add-url');

            const newKey = normalizeKey(urlInput.value);
            const newName = nameInput.value.trim() || CONFIG.default_new_title_name;

            if (!newKey) {
                // 网址为空时，红色闪烁震动提示
                urlInput.focus();
                urlInput.style.backgroundColor = "rgba(230, 57, 70, 0.2)";
                setTimeout(() => urlInput.style.backgroundColor = "", 300);
                return;
            }

            const nowMap = getTitleMap();
            nowMap[newKey] = newName;
            saveTitleMap(nowMap);

            // 重新渲染列表以显示新规则
            closeMgr();
            showManagerUI();
        };

        document.getElementById('gm-btn-add').onclick = handleAdd;

        // 逻辑：新建行 Favicon 实时预览
        // 当用户输入URL并失焦时，自动尝试加载该域名的图标
        const addUrlInput = document.getElementById('gm-add-url');
        addUrlInput.addEventListener('blur', function() {
            let val = normalizeKey(this.value);
            const iconImg = document.getElementById('gm-add-preview');
            if (val && iconImg) {
                const favUrl = getFaviconUrl(val);
                iconImg.src = favUrl;
                iconImg.style.visibility = 'visible';
            }
        });

        // 逻辑：输入框事件绑定 (Enter保存, 失去焦点保存)
        const inputs = overlay.querySelectorAll('.gm-invisible-input');
        inputs.forEach(input => {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this.id === 'gm-add-name' || this.id === 'gm-add-url') {
                        handleAdd(); // 新建行回车直接提交
                    } else {
                        this.blur(); // 普通行回车失焦触发change保存
                    }
                }
            });

            // 监听非新建行的变更 -> 自动保存
            if (!input.classList.contains('gm-add-input')) {
                input.onchange = function() {
                    const nowMap = getTitleMap();

                    if (this.classList.contains('gm-col-url')) {
                        // --- 修改 URL (Key) ---
                        // 需要先删除旧Key，再添加新Key
                        const oldKey = this.dataset.oldKey;
                        const newKey = normalizeKey(this.value);

                        if (!newKey) { this.value = oldKey; return; } // 空值还原
                        if (newKey === oldKey) return; // 未变化忽略

                        const val = nowMap[oldKey];
                        delete nowMap[oldKey];
                        nowMap[newKey] = val;
                        saveTitleMap(nowMap);

                        // 更新 DOM 关联数据 (避免刷新页面)
                        this.dataset.oldKey = newKey;
                        const img = this.closest('.gm-title-row').querySelector('.gm-favicon');
                        if(img) img.src = getFaviconUrl(newKey);
                        const nameInput = this.closest('.gm-title-row').querySelector('.gm-col-name');
                        if(nameInput) nameInput.dataset.key = newKey;
                        const delBtn = this.closest('.gm-title-row').querySelector('.gm-btn-danger');
                        if(delBtn) delBtn.dataset.key = newKey;

                    } else if (this.classList.contains('gm-col-name')) {
                        // --- 修改 名称 (Value) ---
                        const rowKey = this.closest('.gm-title-row').querySelector('.gm-col-url').dataset.oldKey;
                        const newVal = this.value.trim();
                        if (nowMap[rowKey] !== newVal) {
                            nowMap[rowKey] = newVal;
                            saveTitleMap(nowMap);
                        }
                    }
                };
            }
        });

        // 逻辑：删除按钮
        const deleteBtns = overlay.querySelectorAll('.gm-btn-danger:not(#gm-btn-reset)');
        deleteBtns.forEach(btn => {
            btn.onclick = function() {
                const rowKey = this.closest('.gm-title-row').querySelector('.gm-col-url').dataset.oldKey;
                const rowEl = this.closest('.gm-title-row');

                showConfirmDialog(CONFIG.title_confirm_remove, CONFIG.msg_confirm_remove, rowKey, () => {
                    const nowMap = getTitleMap();
                    delete nowMap[rowKey];
                    saveTitleMap(nowMap);
                    if (rowEl) rowEl.remove();
                    // 如果删完了，刷新界面显示“暂无数据”
                    if (Object.keys(nowMap).length === 0) { closeMgr(); showManagerUI(); }
                });
            };
        });

        // 逻辑：重置按钮 (恢复初始设置)
        document.getElementById('gm-btn-reset').onclick = () => {
            showConfirmDialog(CONFIG.title_confirm_reset, CONFIG.msg_confirm_reset, '', () => {
                saveTitleMap(defaultMap);
                closeMgr();
                setTimeout(showManagerUI, 100);
                // 重置后如果当前页面在默认列表中，刷新页面
                if (window.location.hostname in defaultMap) location.reload();
            });
        };
    }

})();