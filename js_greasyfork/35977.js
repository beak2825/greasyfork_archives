// ==UserScript==
// @name              网页限制解除(超级助手Plus优化版)
// @namespace         https://greasyfork.org/zh-CN/users/106222-qxin-i
// @version           4.5.3
// @description       【超级助手Plus项目优化】通杀大部分网站，解除禁止复制、剪切、选择文本、右键菜单的限制。本脚本基于 yuanjie221 版本 (原作者Cat73) 修改。为zcool.com.cn添加特定规则以修复链接点击问题。确保排除规则优先执行。
// @author            Cat73 & yuanjie221 (原作者) & 超级助手Plus (优化)
// @contributor       yuanjie221, 超级助手Plus
// @match             *://*/*
// @exclude           *www.bilibili.com/video*
// @exclude           *www.bilibili.com/v*
// @exclude           *www.bilibili.com/s/*
// @exclude           *www.bilibili.com/bangumi*
// @exclude           https://www.bilibili.com/medialist/play/*
// @exclude           *www.youtube.com/watch*
// @exclude           *www.panda.tv*
// @exclude           *www.github.com*
// @exclude           https://lanhuapp.com/*
// @exclude           https://www.douyu.com/*
// @exclude           *://www.doubao.com/*
// @exclude           https://www.zhihu.com/signin?*
// @exclude           https://tieba.baidu.com/*
// @exclude           https://v.qq.com/*
// @exclude           *.taobao.com/*
// @exclude           *tmall.com*
// @exclude           *signin*
// @exclude           *://jimeng.jianying.com/*
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_addStyle
// @grant             GM_deleteValue
// @grant             GM_setClipboard
// @grant             GM_registerMenuCommand
// @grant             GM_info
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/35977/%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%28%E8%B6%85%E7%BA%A7%E5%8A%A9%E6%89%8BPlus%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35977/%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%28%E8%B6%85%E7%BA%A7%E5%8A%A9%E6%89%8BPlus%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 检查当前页面是否被脚本的 @exclude 规则排除。
     * 必须在脚本非常早期调用此函数。
     * @returns {boolean} 如果被排除则返回 true，否则返回 false。
     */
    function 检查页面是否被排除提前执行() {
        const 当前链接检查 = window.location.href;
        try {
            const 脚本元信息 = GM_info.scriptMetaStr;
            if (!脚本元信息) {
                // console.warn('[网页限制解除] 无法获取脚本元信息，可能影响排除规则判断。');
                return false;
            }
            const 排除规则行 = 脚本元信息.match(/@exclude\s+(.*)/g) || [];

            for (const 行 of 排除规则行) {
                let 规则表达式 = 行.substring(行.indexOf(' ') + 1).trim();
                try {
                    规则表达式 = 规则表达式.replace(/\*/g, '.*?').replace(/\?/g, '.');
                    if (new RegExp(规则表达式).test(当前链接检查)) {
                        // console.log(`[网页限制解除] 提前检查：当前页面 ${当前链接检查} 被规则 "${行.substring(行.indexOf(' ') + 1).trim()}" 排除。脚本将不执行。`);
                        return true;
                    }
                } catch (e) {
                    // console.error(`[网页限制解除] 提前检查：解析排除规则 "${规则表达式}" 失败:`, e);
                }
            }
        } catch (err) {
            // console.error('[网页限制解除] 提前检查排除规则时发生错误:', err);
        }
        return false;
    }

    if (检查页面是否被排除提前执行()) {
        return;
    }

    const 脚本名称 = GM_info.script.name;
    const 日志前缀 = `[${脚本名称}]:`;

    // 默认配置数据
    const 默认配置 = {
        status: 1,
        version: 0.2,
        message: '网页限制解除脚本正在运行',
        positionTop: '0',
        positionLeft: '0',
        positionRight: 'auto',
        addBtn: true,
        shortcut: 3,
        rules: {
            rule_def: {
                name: '默认规则',
                hook_eventNames: 'contextmenu|select|selectstart|copy|cut|dragstart|mousemove|beforeunload',
                unhook_eventNames: 'mousedown|mouseup|keydown|keyup',
                dom0: true,
                hook_addEventListener: true,
                hook_preventDefault: true,
                hook_set_returnValue: true,
                add_css: true
            },
            rule_plus: {
                name: '增强规则',
                hook_eventNames: 'contextmenu|select|selectstart|copy|cut|dragstart|mousedown|mouseup|mousemove|beforeunload',
                unhook_eventNames: 'keydown|keyup',
                dom0: true,
                hook_addEventListener: true,
                hook_preventDefault: true,
                hook_set_returnValue: true,
                add_css: true
            },
            rule_zhihu: {
                name: '知乎专用规则',
                hook_eventNames: 'contextmenu|select|selectstart|copy|cut|dragstart|mousemove',
                unhook_eventNames: 'keydown|keyup',
                dom0: true,
                hook_addEventListener: true,
                hook_preventDefault: true,
                hook_set_returnValue: true,
                add_css: true
            },
            rule_zcool: {
                name: '站酷专用规则',
                hook_eventNames: 'contextmenu|select|selectstart|copy|cut',
                unhook_eventNames: 'keydown|keyup',
                dom0: false,
                hook_addEventListener: true,
                hook_preventDefault: true,
                hook_set_returnValue: true,
                add_css: true
            }
        },
        data: [
            'b.faloo.com', 'bbs.coocaa.com', 'book.hjsm.tom.com', 'book.zhulang.com',
            'book.zongheng.com', 'chokstick.com', 'chuangshi.qq.com', 'city.udn.com',
            'cutelisa55.pixnet.net', 'huayu.baidu.com', 'imac.hk', 'life.tw',
            'luxmuscles.com', 'news.missevan.com', 'read.qidian.com', 'www.15yan.com',
            'www.17k.com', 'www.18183.com', 'www.360doc.com', 'www.coco01.net',
            'www.eyu.com', 'www.hongshu.com', 'www.hongxiu.com', 'www.imooc.com',
            'www.jjwxc.net', 'www.readnovel.com', 'www.tadu.com', 'www.xxsy.net',
            'www.z3z4.com', 'www.zhihu.com', 'yuedu.163.com', 'www.ppkao.com',
            'movie.douban.com', 'www.ruiwen.com', 'vipreader.qidian.com', 'www.pigai.org',
            'www.shangc.net', 'www.myhtlmebook.com', 'www.yuque.com', 'www.longmabookcn.com',
            'www.alphapolis.co.jp', 'www.sdifen.com', 'votetw.com', 'boke112.com',
            'www.myhtebooks.com', 'www.xiegw.cn', 'www.uta-net.com', 'www.bimiacg.net',
            'www.dianyuan.com', 'origenapellido.com', '3g.163.com', 'www.lu-xu.com',
            'leetcode.cn', 'www.jianbiaoku.com', 'www.soyoung.com', 'doc.guandang.net',
            'www.51dongshi.com', 'm.haodf.com', 'www.daodoc.com', 'www.wcqjyw.com',
            'www.szxx.com.cn'
        ]
    };

    let 用户配置 = GM_getValue('rwl_userData_v2');
    if (!用户配置 || typeof 用户配置 !== 'object') {
        用户配置 = JSON.parse(JSON.stringify(默认配置));
    } else {
        用户配置 = 合并配置(JSON.parse(JSON.stringify(默认配置)), 用户配置);
    }
    GM_setValue('rwl_userData_v2', 用户配置);


    const 当前域名 = window.location.hostname;
    const 当前链接 = window.location.href;
    let 侧边按钮节点 = null;
    let 当前应用规则 = null;
    let 白名单列表 = [];

    const 事件名存储前缀 = 'iqxinEventData_';
    let 目标事件名列表, 非目标事件名列表, 所有相关事件名列表;

    const 原始EventTargetaddEventListener = EventTarget.prototype.addEventListener;
    const 原始DocumentEventListener = document.addEventListener;
    const 原始EventPreventDefault = Event.prototype.preventDefault;


    迁移旧版数据();
    白名单列表 = 获取当前白名单();

    document.addEventListener('DOMContentLoaded', function() {
        if (用户配置.addBtn) {
            初始化侧边按钮();
            const 按钮检查定时器 = setInterval(function() {
                const 复选框节点 = document.getElementById('rwl_iqxin_blacklist_checkbox');
                if (复选框节点) {
                    侧边按钮节点 = 复选框节点;
                    clearInterval(按钮检查定时器);
                    启动核心功能();
                } else {
                    if (!document.getElementById('rwl_iqxin_panel')) {
                       初始化侧边按钮();
                    }
                }
            }, 500);
        } else {
            if (检查域名是否在白名单(白名单列表, 当前域名)) {
                初始化解除限制逻辑();
            }
        }
    });

    window.addEventListener('load', function() {
        if (检查域名是否在白名单(白名单列表, 当前域名) || (侧边按钮节点 && 侧边按钮节点.checked)) {
            执行DOM0事件清理();
        }
    });

    GM_registerMenuCommand('网页限制解除 - 设置', 显示设置菜单);

    function 合并配置(target, source) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) &&
                    target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
                    合并配置(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }

    function 启动核心功能() {
        初始化拖拽功能();
        绑定设置按钮事件();

        if (检查域名是否在白名单(白名单列表, 当前域名)) {
            try {
                if (用户配置.addBtn && 侧边按钮节点) {
                    侧边按钮节点.checked = true;
                }
            } catch (错误) {
                console.error(`${日志前缀} 设置复选框状态出错:`, 错误);
            }
            初始化解除限制逻辑();
        } else if (用户配置.addBtn && 侧边按钮节点) {
            侧边按钮节点.checked = false;
        }
    }

    function 初始化侧边按钮() {
        if (!用户配置.addBtn || document.getElementById('rwl_iqxin_panel')) return;

        const 面板容器 = document.createElement('div');
        面板容器.id = 'rwl_iqxin_panel';
        面板容器.className = 'rwl-exempt';

        const 屏幕高度 = document.documentElement.clientHeight;
        let 顶部位置 = parseFloat(用户配置.positionTop);
        顶部位置 = 顶部位置 > 屏幕高度 ? 屏幕高度 - 40 : (顶部位置 < 0 ? 0 : 顶部位置);

        GM_addStyle(`
            #rwl_iqxin_panel.rwl-exempt {
                position: fixed !important; top: ${顶部位置}px !important;
                left: ${用户配置.positionLeft === 'auto' ? 'auto' : 用户配置.positionLeft + 'px'} !important;
                right: ${用户配置.positionRight === 'auto' ? 'auto' : 用户配置.positionRight + 'px'} !important;
                transform: ${用户配置.positionLeft !== 'auto' ? 'translate(-95%, 0)' : 'translate(95%, 0)'};
                width: auto !important; min-width: 85px !important; height: 25px !important;
                font-size: 12px !important; font-weight: 500 !important; font-family: Verdana, Arial, '宋体', sans-serif !important;
                color: #fff !important; background: #333 !important; z-index: 2147483647 !important;
                margin: 0 !important; opacity: 0.1 !important;
                transition: opacity 0.3s, transform 0.3s, height 0.3s, line-height 0.3s !important;
                overflow: hidden !important; user-select: none !important; -webkit-user-select: none !important; -moz-user-select: none !important;
                text-align: center !important; white-space: nowrap !important; line-height: 25px !important;
                padding: 0 10px !important; border: 1px solid #ccc !important;
                border-width: ${用户配置.positionLeft !== 'auto' ? '1px 1px 1px 0' : '1px 0 1px 1px'} !important;
                border-top-right-radius: ${用户配置.positionLeft !== 'auto' ? '5px' : '0'} !important;
                border-bottom-right-radius: ${用户配置.positionLeft !== 'auto' ? '5px' : '0'} !important;
                border-top-left-radius: ${用户配置.positionLeft === 'auto' ? '5px' : '0'} !important;
                border-bottom-left-radius: ${用户配置.positionLeft === 'auto' ? '5px' : '0'} !important;
                box-sizing: content-box !important; display: flex !important; align-items: center !important;
            }
            #rwl_iqxin_panel.rwl-exempt.rwl-active-iqxin {
                transform: translate(0, 0) !important; opacity: 0.9 !important;
                height: 32px !important; line-height: 32px !important;
            }
            #rwl_iqxin_panel.rwl-exempt input[type="checkbox"].rwl-exempt {
                margin: 0 0 0 5px !important; padding: 0 !important; vertical-align: middle !important;
                -webkit-appearance: checkbox !important; -moz-appearance: checkbox !important; appearance: checkbox !important;
                position: relative !important; top: -1px; opacity: 1 !important; cursor: pointer !important;
                width: auto !important; height: auto !important;
            }
            #rwl_iqxin_panel.rwl-exempt .rwl-drag-handle.rwl-exempt {
                cursor: move !important; font-size: 12px !important; padding: 0 5px;
                flex-grow: 1; text-align: left;
            }
            #rwl_iqxin_panel.rwl-exempt .rwl-setbtn.rwl-exempt {
                margin: 0 5px 0 0 !important; padding: 2px 4px !important; border: none !important;
                border-radius: 3px !important; cursor: pointer !important; background: #fff !important;
                color: #000 !important; line-height: normal !important; font-size: 11px !important;
            }
        `);

        window.addEventListener('resize', function() {
            const 当前屏幕高度 = document.documentElement.clientHeight;
            let 当前顶部位置 = parseFloat(用户配置.positionTop);
            当前顶部位置 = 当前顶部位置 > 当前屏幕高度 ? 当前屏幕高度 - 40 : (当前顶部位置 < 0 ? 0 : 当前顶部位置);
            const 已存在面板 = document.getElementById('rwl_iqxin_panel');
            if (已存在面板) {
                已存在面板.style.top = 当前顶部位置 + 'px';
            }
        });

        面板容器.innerHTML = `
            <button type="button" id="rwl_iqxin_setbtn" class="rwl-setbtn rwl-exempt">设置</button>
            <span class="rwl-drag-handle rwl-exempt">解除限制</span>
            <input type="checkbox" name="rwl_iqxin_blacklist_checkbox_name" id="rwl_iqxin_blacklist_checkbox" class="rwl-exempt">
        `;

        if (window.self === window.top) {
            const 父容器 = document.body || document.documentElement;
            if (父容器) {
                父容器.appendChild(面板容器);
                侧边按钮节点 = document.getElementById('rwl_iqxin_blacklist_checkbox');
                if (侧边按钮节点) {
                    侧边按钮节点.addEventListener('change', function() {
                        处理白名单切换(this.checked);
                    });
                }
            } else {
                console.error(`${日志前缀} 无法添加侧边按钮：document.body 和 document.documentElement 均不可用。`);
            }
        }

        面板容器.addEventListener('mouseover', function() { this.classList.add('rwl-active-iqxin'); });
        面板容器.addEventListener('mouseleave', function() { this.classList.remove('rwl-active-iqxin'); });
    }

    function 绑定设置按钮事件() {
        const 设置按钮 = document.getElementById('rwl_iqxin_setbtn');
        if (设置按钮) {
            设置按钮.addEventListener('click', 显示设置菜单);
        }
    }

    function 显示设置菜单() {
        const 旧菜单 = document.getElementById('rwl_iqxin_setMenu');
        if (旧菜单) {
            旧菜单.parentNode.removeChild(旧菜单);
            return;
        }

        const 当前用户配置 = GM_getValue('rwl_userData_v2') || 用户配置;
        const 按钮显示已选中 = 当前用户配置.addBtn ? 'checked' : '';

        const 菜单元素 = document.createElement('div');
        菜单元素.id = 'rwl_iqxin_setMenu';
        菜单元素.className = 'rwl-exempt';

        GM_addStyle(`
            #rwl_iqxin_setMenu.rwl-exempt {
                position: fixed !important; top: 50px !important; left: 50%; transform: translateX(-50%) !important;
                width: 500px !important; max-width: 90vw !important; padding: 20px !important;
                background: #f0f0f0 !important; border-radius: 8px !important; text-align: left !important;
                font-size: 14px !important; font-family: 'Microsoft YaHei', Arial, sans-serif !important;
                z-index: 2147483647 !important; border: 1px solid #bbb !important;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important; color: #333 !important; overflow-y: auto; max-height: 80vh;
            }
            #rwl_iqxin_setMenu.rwl-exempt p { margin: 10px 0 !important; line-height: 1.7 !important; }
            #rwl_iqxin_setMenu.rwl-exempt input[type="text"].rwl-exempt,
            #rwl_iqxin_setMenu.rwl-exempt select.rwl-exempt,
            #rwl_iqxin_setMenu.rwl-exempt textarea.rwl-exempt {
                border: 1px solid #ccc !important; padding: 8px 10px !important; border-radius: 4px !important;
                width: calc(100% - 22px) !important; box-sizing: border-box !important;
                font-family: inherit !important; font-size: 13px !important; margin-top: 3px;
            }
            #rwl_iqxin_setMenu.rwl-exempt input[type="checkbox"].rwl-exempt { margin-right: 8px !important; vertical-align: middle !important; }
            #rwl_iqxin_setMenu.rwl-exempt .rwl-menu-button.rwl-exempt {
                margin: 10px 8px 0 0 !important; padding: 8px 15px !important; border: 1px solid transparent !important;
                border-radius: 4px !important; cursor: pointer !important; font-size: 14px !important;
                background-color: #ddd !important; color: #333 !important; transition: all 0.2s ease !important;
            }
            #rwl_iqxin_setMenu.rwl-exempt .rwl-menu-button.rwl-exempt:hover { opacity: 0.85; }
            #rwl_iqxin_setMenu.rwl-exempt #rwl_reset_btn.rwl-exempt { border-color: #d9534f !important; color: #d9534f !important; background-color: white !important; }
            #rwl_iqxin_setMenu.rwl-exempt #rwl_reset_btn.rwl-exempt:hover { background-color: #d9534f !important; color:white !important; }
            #rwl_iqxin_setMenu.rwl-exempt #rwl_save_btn.rwl-exempt { border-color: #5cb85c !important; color: #5cb85c !important; background-color: white !important; }
            #rwl_iqxin_setMenu.rwl-exempt #rwl_save_btn.rwl-exempt:hover { background-color: #5cb85c !important; color:white !important; }
            #rwl_iqxin_setMenu.rwl-exempt #rwl_close_btn.rwl-exempt { border-color: #777 !important; color: #777 !important; background-color: white !important; }
            #rwl_iqxin_setMenu.rwl-exempt #rwl_close_btn.rwl-exempt:hover { background-color: #777 !important; color:white !important; }
            #rwl_iqxin_setMenu.rwl-exempt a { color: #007bff !important; text-decoration: none !important; }
            #rwl_iqxin_setMenu.rwl-exempt a:hover { text-decoration: underline !important; }
            #rwl_iqxin_setMenu.rwl-exempt textarea.rwl-exempt { min-height: 180px !important; resize: vertical !important; font-family: monospace !important; font-size: 12px !important;}
            #rwl_iqxin_setMenu.rwl-exempt .rwl-menu-title { font-size: 18px; font-weight: bold; margin-bottom:15px; color:#111; }
            #rwl_iqxin_setMenu.rwl-exempt .rwl-menu-footer { font-size:0.8em; color: #777; display: block; margin-top: 15px; border-top: 1px solid #ccc; padding-top:10px; }
        `);

        菜单元素.innerHTML = `
            <div class="rwl-menu-title rwl-exempt">网页限制解除 - 设置</div>
            <p class="rwl-exempt">侧边按钮距顶部距离 (像素): <input id='rwl_pos_top_input' type='text' value="${当前用户配置.positionTop}" class="rwl-exempt"></p>
            <p class="rwl-exempt" title='快捷键设置'>复制快捷键:
                <select id='rwl_shortcut_select' class="rwl-exempt">
                    <option value='0' ${当前用户配置.shortcut == 0 ? 'selected' : ''}>关闭快捷键</option>
                    <option value='1' ${当前用户配置.shortcut == 1 ? 'selected' : ''}>F1</option>
                    <option value='2' ${当前用户配置.shortcut == 2 ? 'selected' : ''}>Ctrl + F1</option>
                    <option value='3' ${当前用户配置.shortcut == 3 ? 'selected' : ''}>Ctrl + C / Ctrl + X (尝试增强复制)</option>
                </select>
            </p>
            <label class="rwl-exempt"><p class="rwl-exempt"><input id='rwl_show_btn_check' type='checkbox' ${按钮显示已选中} class="rwl-exempt"> 显示侧边按钮 (取消后需通过油猴扩展菜单重开设置)</p></label>
            <p class="rwl-exempt"><b>白名单列表</b> (JSON数组格式，每个域名用双引号包裹，逗号分隔):</p>
            <textarea id="rwl_whitelist_area" wrap='off' class="rwl-exempt">${JSON.stringify(当前用户配置.data, null, 2)}</textarea>
            <p class="rwl-exempt">
                <button id='rwl_save_btn' class="rwl-menu-button rwl-exempt">保存设置并刷新</button>
                <button id='rwl_reset_btn' class="rwl-menu-button rwl-exempt">恢复默认设置</button>
                <button id='rwl_close_btn' class="rwl-menu-button rwl-exempt" title='关闭设置面板'>关闭</button>
            </p>
            <div class="rwl-menu-footer rwl-exempt">
                问题反馈: <a target='_blank' href='https://greasyfork.org/zh-CN/scripts/35977/feedback'>GreasyFork反馈区</a> |
                原作者: Cat73, yuanjie221 | 当前版本: ${GM_info.script.version} (优化 by 超级助手Plus) <br>
                提示: 脚本尽力解除通用限制，但无法保证完美兼容所有网站。部分复杂网站可能需要手动排除或定制规则。
            </div>
        `;
        document.body.appendChild(菜单元素);

        document.getElementById('rwl_save_btn').addEventListener('click', 保存设置);
        document.getElementById('rwl_close_btn').addEventListener('click', 关闭设置菜单);
        document.getElementById('rwl_reset_btn').addEventListener('click', 重置设置);
    }

    function 保存设置() {
        const 顶部位置输入 = document.getElementById('rwl_pos_top_input').value;
        const 快捷键选择 = document.getElementById('rwl_shortcut_select').value;
        const 显示按钮已选中 = document.getElementById('rwl_show_btn_check').checked;
        const 白名单文本域 = document.getElementById('rwl_whitelist_area').value;

        try {
            const 解析后白名单 = JSON.parse(白名单文本域);
            if (!Array.isArray(解析后白名单)) {
                alert('白名单数据格式错误：必须是一个JSON数组。\n例如：["example.com", "another.com"]');
                return;
            }

            用户配置.addBtn = 显示按钮已选中;
            用户配置.data = 解析后白名单.map(item => String(item).trim()).filter(item => item.length > 0);
            用户配置.positionTop = String(parseInt(顶部位置输入, 10) || 0);
            用户配置.shortcut = parseInt(快捷键选择, 10);

            GM_setValue('rwl_userData_v2', 用户配置);
            alert('设置已保存！页面将自动刷新以应用更改。');
            setTimeout(() => window.location.reload(), 300);
        } catch (错误) {
            alert(`保存失败！白名单数据JSON格式无效，请检查。\n错误详情: ${错误.message}`);
        }
    }

    function 重置设置() {
        if (confirm('您确定要将所有设置恢复为默认状态吗？此操作不可撤销。')) {
            GM_deleteValue('rwl_userData_v2');
            用户配置 = JSON.parse(JSON.stringify(默认配置));
            alert('设置已恢复为默认值。页面将自动刷新。');
            setTimeout(() => window.location.reload(), 300);
        }
    }

    function 关闭设置菜单() {
        const 菜单 = document.getElementById('rwl_iqxin_setMenu');
        if (菜单) 菜单.parentNode.removeChild(菜单);
    }

    function 初始化拖拽功能() {
        setTimeout(function() {
            try {
                const 可拖动面板 = document.getElementById('rwl_iqxin_panel');
                if (!可拖动面板) return;

                const 拖动句柄 = 可拖动面板.querySelector('.rwl-drag-handle.rwl-exempt');
                const 实际拖动目标 = 拖动句柄 || 可拖动面板;

                实际拖动目标.addEventListener('mousedown', function(mouseDownEvent) {
                    if (mouseDownEvent.button !== 0) return;

                    可拖动面板.style.transition = 'none';
                    const 初始鼠标X = mouseDownEvent.clientX;
                    const 初始鼠标Y = mouseDownEvent.clientY;
                    const 面板初始左 = 可拖动面板.offsetLeft;
                    const 面板初始顶 = 可拖动面板.offsetTop;
                    const 面板宽度 = 可拖动面板.offsetWidth;

                    function 处理鼠标移动(mouseMoveEvent) {
                        let 新左侧位置 = 面板初始左 + (mouseMoveEvent.clientX - 初始鼠标X);
                        let 新顶部位置 = 面板初始顶 + (mouseMoveEvent.clientY - 初始鼠标Y);
                        新顶部位置 = Math.max(0, Math.min(新顶部位置, window.innerHeight - 可拖动面板.offsetHeight));
                        新左侧位置 = Math.max(0, Math.min(新左侧位置, window.innerWidth - 面板宽度));
                        可拖动面板.style.left = 新左侧位置 + 'px';
                        可拖动面板.style.top = 新顶部位置 + 'px';
                        可拖动面板.style.right = 'auto';
                    }

                    function 处理鼠标松开() {
                        document.removeEventListener('mousemove', 处理鼠标移动);
                        document.removeEventListener('mouseup', 处理鼠标松开);
                        可拖动面板.style.transition = 'opacity 0.3s, transform 0.3s, height 0.3s, line-height 0.3s';
                        if (可拖动面板.offsetLeft < (window.innerWidth - 面板宽度) / 2) {
                            用户配置.positionLeft = String(可拖动面板.offsetLeft);
                            用户配置.positionRight = 'auto';
                            可拖动面板.style.transform = 'translate(-95%, 0)';
                        } else {
                            用户配置.positionRight = String(window.innerWidth - (可拖动面板.offsetLeft + 面板宽度));
                            用户配置.positionLeft = 'auto';
                            可拖动面板.style.left = 'auto';
                            可拖动面板.style.right = 用户配置.positionRight + 'px';
                            可拖动面板.style.transform = 'translate(95%, 0)';
                        }
                        用户配置.positionTop = String(可拖动面板.offsetTop);
                        GM_setValue('rwl_userData_v2', 用户配置);
                    }
                    document.addEventListener('mousemove', 处理鼠标移动);
                    document.addEventListener('mouseup', 处理鼠标松开);
                    mouseDownEvent.preventDefault();
                });
            } catch (错误) {
                console.error(`${日志前缀} 初始化拖拽功能出错:`, 错误);
            }
        }, 1000);
    }

    function 初始化解除限制逻辑() {
        当前应用规则 = 获取当前网站规则();
        if (!当前应用规则) return;

        目标事件名列表 = 当前应用规则.hook_eventNames ? 当前应用规则.hook_eventNames.split('|') : [];
        非目标事件名列表 = 当前应用规则.unhook_eventNames ? 当前应用规则.unhook_eventNames.split('|') : [];
        所有相关事件名列表 = 目标事件名列表.concat(非目标事件名列表);

        if (当前应用规则.dom0) 执行DOM0事件清理();
        if (当前应用规则.hook_addEventListener) 代理AddEventListener();
        if (当前应用规则.hook_preventDefault) 代理PreventDefault();
        if (当前应用规则.hook_set_returnValue && typeof Event.prototype.__defineSetter__ === 'function') 代理EventReturnValue();
        if (当前应用规则.add_css) 注入强制CSS();
    }

    function 代理AddEventListener() {
        EventTarget.prototype.addEventListener = function (类型, 监听器, 选项) {
            if (非目标事件名列表.includes(类型)) {
                const 是否捕获阶段 = (typeof 选项 === 'boolean' ? 选项 : (选项 && 选项.capture));
                const 函数存储名 = 事件名存储前缀 + 类型 + (是否捕获阶段 ? '_t' : '_f');
                if (this[函数存储名] === undefined) {
                    this[函数存储名] = [];
                    原始EventTargetaddEventListener.call(this, 类型, (是否捕获阶段 ? unhook事件处理函数_捕获 : unhook事件处理函数_冒泡), 选项);
                }
                if (typeof 监听器 === 'function') this[函数存储名].push(监听器);
            } else {
                原始EventTargetaddEventListener.call(this, 类型, 监听器, 选项);
            }
        };
        document.addEventListener = function (类型, 监听器, 选项) {
            if (非目标事件名列表.includes(类型)) {
                const 是否捕获阶段 = (typeof 选项 === 'boolean' ? 选项 : (选项 && 选项.capture));
                const 函数存储名 = 事件名存储前缀 + 类型 + (是否捕获阶段 ? '_t' : '_f');
                if (this[函数存储名] === undefined) {
                    this[函数存储名] = [];
                    原始DocumentEventListener.call(this, 类型, (是否捕获阶段 ? unhook事件处理函数_捕获 : unhook事件处理函数_冒泡), 选项);
                }
                 if (typeof 监听器 === 'function') this[函数存储名].push(监听器);
            } else {
                原始DocumentEventListener.call(this, 类型, 监听器, 选项);
            }
        };
    }

    function 代理PreventDefault() {
        Event.prototype.preventDefault = function () {
            if (!目标事件名列表.includes(this.type)) {
                原始EventPreventDefault.apply(this, arguments);
            }
        };
    }

    function 代理EventReturnValue() {
        try {
            Object.defineProperty(Event.prototype, 'returnValue', {
                configurable: true,
                get: function() { return this._actualReturnValue === undefined ? true : this._actualReturnValue; },
                set: function(值) {
                    if (目标事件名列表.includes(this.type) && 值 === false) {
                        this._actualReturnValue = true;
                    } else {
                        this._actualReturnValue = 值;
                    }
                }
            });
        } catch (错误) {
            console.warn(`${日志前缀} 设置 Event.prototype.returnValue 代理失败:`, 错误);
        }
    }

    function 执行DOM0事件清理() {
        if (!当前应用规则 || !当前应用规则.dom0) return;
        const 页面所有元素 = 获取页面所有元素(true);
        for (const 当前元素 of 页面所有元素) {
            if (typeof 当前元素 !== 'object' || 当前元素 === null) continue;
            if (typeof 当前元素.closest === 'function' && 当前元素.closest('.rwl-exempt')) continue;

            for (const 事件名 of 所有相关事件名列表) {
                const on事件属性名 = 'on' + 事件名;
                try {
                    if (typeof 当前元素[on事件属性名] === 'function' && 当前元素[on事件属性名] !== onxxx事件替代函数) {
                        if (非目标事件名列表.includes(事件名)) {
                            当前元素[事件名存储前缀 + on事件属性名] = 当前元素[on事件属性名];
                            当前元素[on事件属性名] = onxxx事件替代函数;
                        } else if (目标事件名列表.includes(事件名)) {
                            当前元素[on事件属性名] = null;
                        }
                    }
                } catch (错误) { /* console.warn */ }
            }
        }
    }

    function unhook事件处理(事件对象, 目标元素, 回调存储属性名) {
        const 回调列表 = 目标元素[回调存储属性名];
        if (回调列表 && Array.isArray(回调列表)) {
            for (const 单个回调 of 回调列表) {
                try {
                    if (typeof 单个回调 === 'function') 单个回调.call(目标元素, 事件对象);
                    else if (typeof 单个回调.handleEvent === 'function') 单个回调.handleEvent.call(单个回调, 事件对象);
                } catch(e) { console.error(`${日志前缀} 执行unhook回调时出错:`, e, 单个回调); }
            }
        }
        if (事件对象) 事件对象.returnValue = true;
        return true;
    }
    function unhook事件处理函数_捕获(e) { return unhook事件处理(e, this, 事件名存储前缀 + e.type + '_t'); }
    function unhook事件处理函数_冒泡(e) { return unhook事件处理(e, this, 事件名存储前缀 + e.type + '_f'); }

    function onxxx事件替代函数(事件对象) {
        const 原始处理函数名 = 事件名存储前缀 + 'on' + 事件对象.type;
        if (typeof this[原始处理函数名] === 'function') {
            try { this[原始处理函数名](事件对象); }
            catch(e) { console.error(`${日志前缀} 执行onxxx替代回调时出错:`, e, this[原始处理函数名]); }
        }
        事件对象.returnValue = true;
        return true;
    }

    function 获取页面所有元素(includeFrames = true) {
        let 元素集合 = [];
        try {
            元素集合 = Array.from(document.querySelectorAll('*'));
            元素集合.push(document); 元素集合.push(window);
            if (includeFrames) {
                const frames = document.querySelectorAll('iframe, frame');
                for (const frame of frames) {
                    try {
                        if (frame.contentWindow && frame.contentWindow.document) {
                            const frameDocument = frame.contentWindow.document;
                            元素集合.push(frame.contentWindow); 元素集合.push(frameDocument);
                            元素集合 = 元素集合.concat(Array.from(frameDocument.querySelectorAll('*')));
                        }
                    } catch (错误) { /* console.warn */ }
                }
            }
        } catch (错误) { console.error(`${日志前缀} 获取页面元素时出错:`, 错误); }
        return 元素集合;
    }

    function 获取当前白名单() {
        return (用户配置.data || []).filter(item => typeof item === 'string' && item.trim().length > 1);
    }

    function 检查域名是否在白名单(检查用白名单, 待检查域名) {
        for (let i = 0; i < 检查用白名单.length; i++) {
            if (待检查域名.includes(检查用白名单[i])) return i + 1;
        }
        return false;
    }

    function 处理白名单切换(是否选中加入白名单) {
        const 最新用户配置 = GM_getValue('rwl_userData_v2') || 用户配置;
        let 当前生效白名单 = (最新用户配置.data || []).slice();
        const 检查结果 = 检查域名是否在白名单(当前生效白名单, 当前域名);
        let 配置已更改 = false;

        if (是否选中加入白名单 && !检查结果) {
            当前生效白名单.push(当前域名);
            配置已更改 = true;
            初始化解除限制逻辑();
            执行DOM0事件清理();
        } else if (!是否选中加入白名单 && 检查结果) {
            当前生效白名单.splice(检查结果 - 1, 1);
            配置已更改 = true;
            setTimeout(() => window.location.reload(true), 350);
        }

        if (配置已更改) {
            最新用户配置.data = 当前生效白名单.filter(item => typeof item === 'string' && item.trim().length > 0).filter((item, index, self) => self.indexOf(item) === index).sort();
            GM_setValue('rwl_userData_v2', 最新用户配置);
            用户配置 = 最新用户配置;
            白名单列表 = 获取当前白名单();
        }
    }

    function 复制到剪贴板() {
        try {
            const 选中文本 = window.getSelection().toString();
            if (选中文本 && 选中文本.length > 0) GM_setClipboard(选中文本);
        } catch (错误) {
            console.error(`${日志前缀} 复制到剪贴板失败:`, 错误);
            alert("复制到剪贴板失败。请检查浏览器控制台或油猴扩展权限。");
        }
    }

    function 处理快捷键(事件对象) {
        if (用户配置.shortcut == 0) return;
        const 键码 = 事件对象.keyCode;
        let 应阻止默认行为 = false;
        switch (用户配置.shortcut) {
            case 1: if (键码 === 112) { 复制到剪贴板(); 应阻止默认行为 = true; } break;
            case 2: if (事件对象.ctrlKey && 键码 === 112) { 复制到剪贴板(); 应阻止默认行为 = true; } break;
            case 3: if (事件对象.ctrlKey && (键码 === 67 || 键码 === 88 )) setTimeout(复制到剪贴板, 50); break;
        }
        if (应阻止默认行为) { 事件对象.preventDefault(); 事件对象.stopPropagation(); return false; }
    }
    document.addEventListener('keydown', 处理快捷键, true);

    function 获取当前网站规则() {
        switch (当前域名) {
            case 'www.zcool.com.cn': case 'zcool.com.cn': return 用户配置.rules.rule_zcool || 用户配置.rules.rule_def;
            case 'chuangshi.qq.com': 处理创世中文网内容(); return 用户配置.rules.rule_def;
            case 'votetw.com': 处理Votetw网站样式(); return 用户配置.rules.rule_def;
            case 'www.myhtebooks.com': case 'www.myhtlmebook.com': 移除页面覆盖元素('.fullimg'); return 用户配置.rules.rule_def;
            case 'www.z3z4.com': 移除页面覆盖元素('.moviedownaddiv'); return 用户配置.rules.rule_def;
            case 'huayu.baidu.com': 移除页面覆盖元素('#jqContextMenu'); return 用户配置.rules.rule_def;
            case 'www.szxx.com.cn': 移除页面覆盖元素('img#adCover'); return 用户配置.rules.rule_def;
            case 'zhihu.com': case 'www.zhihu.com': return 用户配置.rules.rule_zhihu;
            case 't.bilibili.com': 处理B站动态链接(); return 用户配置.rules.rule_def;
            case 'www.uslsoftware.com': 移除页面覆盖元素('.protect_contents-overlay'); 移除页面覆盖元素('.protect_alert'); return 用户配置.rules.rule_plus;
            case 'www.longmabookcn.com': 移除页面覆盖元素('.fullimg'); return 用户配置.rules.rule_plus;
            case 'boke112.com': return 用户配置.rules.rule_plus;
            case 'www.shangc.net': return 用户配置.rules.rule_plus;
            case 'www.daodoc.com': case 'www.wcqjyw.com': 隐藏水印标记('.marks'); return 用户配置.rules.rule_def;
            case 'www.jianbiaoku.com': 隐藏水印标记('.layui-layer-shade'); return 用户配置.rules.rule_def;
            default: return 用户配置.rules.rule_def;
        }
    }

    function 移除页面覆盖元素(选择器) {
        try {
            const 元素 = document.querySelector(选择器);
            if (元素 && 元素.parentNode) 元素.parentNode.removeChild(元素);
        } catch (错误) { console.warn(`${日志前缀} 移除覆盖元素 "${选择器}" 失败:`, 错误.message); }
    }

    function 处理B站动态链接() {
        try {
            const 描述容器 = document.querySelector('.description');
            if (描述容器) {
                const 内容省略节点 = 描述容器.querySelector('.content-ellipsis');
                if (内容省略节点) 描述容器.appendChild(内容省略节点);
            }
        } catch (错误) { console.warn(`${日志前缀} 处理B站动态链接失败:`, 错误.message); }
    }

    function 处理Votetw网站样式() {
        try {
            document.querySelectorAll('.mw-parser-output>div').forEach(元素 => {
                if (元素 && typeof 元素.setAttribute === 'function') 元素.setAttribute('style', '');
            });
        } catch (错误) { console.warn(`${日志前缀} 处理Votetw网站样式失败:`, 错误.message); }
    }

    function 隐藏水印标记(节点选择器) {
        GM_addStyle(`${节点选择器} { display: none !important; visibility: hidden !important; }`);
    }

    function 处理创世中文网内容() {
        try {
            function tounicode(data) { if(!data)return"";var str="";for(var i=0;i<data.length;i++){str+="\\u"+parseInt(data[i].charCodeAt(0),10).toString(16)}return str }
            function tohanzi(data) { if(!data)return"";data=data.split("\\u");var str="";for(var i=0;i<data.length;i++){if(data[i]){str+=String.fromCharCode(parseInt(data[i],16))}}return str }
            RegExp.escape=function(str){return new String(str).replace(/([.*+?^=!:${}()|[\]/\\])/g,'\\$1')};function properties(obj){var props=[];for(var p in obj)if(Object.prototype.hasOwnProperty.call(obj,p))props.push(p);return props}
            const 内容元素 = document.querySelector('.bookreadercontent');
            if (内容元素 && 内容元素.innerText) {
                let 原始文本 = 内容元素.innerText; let 文本Unicode = tounicode(原始文本);
                const 替换表 = {'e2af':'4e09','e2c9':'4e3b','e2d6':'4e48','e2b2':'4e4b','e2a6':'4e5f','e294':'4e8b','e2e9':'4e8c','e30a':'4e8e','e292':'4e94','e298':'4e9b','e2a2':'4ee3','e2f0':'4f46','e30e':'4f4d','e305':'4f53','e296':'4f5c','e2d3':'4f60','e2db':'4f7f','e29b':'516c','e2b0':'5176','e2ed':'51fa','e2eb':'5206','e2f1':'5229','e307':'5230','e2ce':'5236','e2e6':'524d','e2ea':'529b','e2a8':'52a0','e2a5':'5316','e2bd':'5341','e302':'539f','e2df':'53bb','e2c7':'53c8','e303':'53cd','e2ac':'53d1','e2f8':'53ea','e30b':'5404','e29c':'5408','e2d7':'540c','e2d8':'540e','e306':'5411','e2c5':'547d','e2b4':'56db','e2f9':'56e0','e2ca':'5730','e2ef':'5916','e2bc':'591a','e301':'5929','e29a':'597d','e2b7':'5b50','e2cc':'5b83','e2ee':'5b9a','e2ff':'5bb6','e2e8':'5c0f','e2d4':'5c31','e2d5':'5c55','e2a1':'5de5','e2a0':'5e73','e2fe':'5e74','e2c4':'5e76','e2c8':'5ea6','e2ae':'5efa','e304':'5f62','e291':'5f88','e2e2':'5f97','e2f2':'5fc3','e295':'6027','e2d9':'60c5','e2be':'60f3','e2c3':'610f','e30d':'6210','e2ba':'6216','e2fa':'6240','e29e':'628a','e2a7':'63d0','e2d2':'653f','e2ad':'6599','e2cd':'65b0','e2f3':'65b9'};
                const 正则表达式 = new RegExp(properties(替换表).map(RegExp.escape).join('|'),'g');
                文本Unicode = 文本Unicode.replace(正则表达式, (匹配项) => 替换表[匹配项]).replace(/\\u0(?=[0-9a-fA-F]{3})/g, '\\u');
                内容元素.innerText = tohanzi(文本Unicode);
            }
        } catch (错误) { console.error(`${日志前缀} 处理创世中文网内容解密失败:`, 错误); }
    }

    function 注入强制CSS() {
        if (!当前应用规则 || !当前应用规则.add_css) return;
        GM_addStyle(`
            html *:not(.rwl-exempt):not(.rwl-exempt *), body *:not(.rwl-exempt):not(.rwl-exempt *), *:not(.rwl-exempt):not(.rwl-exempt *) {
                -webkit-user-select: text !important; -moz-user-select: text !important;
                -ms-user-select: text !important; user-select: text !important;
            }
            ::selection { color: HighlightText !important; background-color: Highlight !important; }
            ::-moz-selection { color: HighlightText !important; background-color: Highlight !important; }
        `);
    }

    function 迁移旧版数据() {
        const 旧数据_black_list = GM_getValue('black_list');
        const 旧数据_rwl_userData = GM_getValue('rwl_userData');
        let 需要保存新配置 = false;

        if (旧数据_rwl_userData && typeof 旧数据_rwl_userData === 'object') {
            if (Array.isArray(旧数据_rwl_userData.data)) {
                const 合并后白名单 = Array.from(new Set([...(用户配置.data || []), ...旧数据_rwl_userData.data])).filter(item => typeof item === 'string' && item.trim().length > 0).sort();
                用户配置.data = 合并后白名单;
            }
            if (旧数据_rwl_userData.hasOwnProperty('positionTop')) 用户配置.positionTop = String(旧数据_rwl_userData.positionTop);
            if (旧数据_rwl_userData.hasOwnProperty('shortcut')) 用户配置.shortcut = parseInt(旧数据_rwl_userData.shortcut, 10);
            if (旧数据_rwl_userData.hasOwnProperty('addBtn')) 用户配置.addBtn = !!旧数据_rwl_userData.addBtn;
            GM_deleteValue('rwl_userData');
            需要保存新配置 = true;
        }

        if (旧数据_black_list && typeof 旧数据_black_list === 'object' && Array.isArray(旧数据_black_list.data)) {
            const 合并后白名单 = Array.from(new Set([...(用户配置.data || []), ...旧数据_black_list.data])).filter(item => typeof item === 'string' && item.trim().length > 0).sort();
            用户配置.data = 合并后白名单;
            GM_deleteValue('black_list'); GM_deleteValue('rwl_userdata');
            需要保存新配置 = true;
        }
        if (需要保存新配置) GM_setValue('rwl_userData_v2', 用户配置);
    }
})();
