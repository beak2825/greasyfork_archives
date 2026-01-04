// ==UserScript==
// @name         MT论坛美化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为MT论坛添加圆角、夜间模式和动画效果，提升浏览体验
// @author       Raymondman
// @match        https://bbs.binmt.cc/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @supportURL   https://bbs.binmt.cc/space-uid-142569.html
// @downloadURL https://update.greasyfork.org/scripts/521426/MT%E8%AE%BA%E5%9D%9B%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/521426/MT%E8%AE%BA%E5%9D%9B%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

/*
MT论坛美化脚本说明：

功能特性：
1. 圆角美化 - 为论坛各个模块添加现代化的圆角效果
2. 夜间模式 - 提供护眼的深色主题，减少夜间浏览的视觉疲劳
3. 动画效果 - 添加平滑的过渡动画，提升交互体验
4. 设置面板 - 可随时开关各项功能，自定义浏览体验

使用说明：
1. 安装脚本后，页面右下角会出现设置图标
2. 点击设置图标可打开设置面板
3. 可以通过开关分别控制：
   - 启用脚本：总开关，控制所有功能
   - 圆角效果：开启/关闭圆角样式
   - 夜间模式：切换明暗主题
   - 动画效果：控制过渡动画

更新记录：
v1.0 (2024-12-22)
- 首次发布
- 实现基础功能：圆角、夜间模式、动画效果
- 添加设置面板
- 优化样式和交互

注意事项：
1. 设置会自动保存在浏览器中
2. 如遇到样式异常，可以尝试刷新页面
3. 可以通过总开关快速关闭所有效果

本脚本由 Cursor AI 辅助开发
https://cursor.sh/

问题反馈：
如有问题或建议，欢迎通过以下方式反馈：
- MT论坛私信：@Raymondman
- 在脚本页面评论区留言
*/

(function() {
    'use strict';

    // 获取保存的设置，默认开启
    let isScriptEnabled = GM_getValue('isScriptEnabled', true);
    let isRoundedEnabled = GM_getValue('isRoundedEnabled', true);
    let isDarkMode = GM_getValue('isDarkMode', false);
    let isAnimationEnabled = GM_getValue('isAnimationEnabled', true);

    // 添加CSS样式
    const style = document.createElement('style');
    style.id = 'roundedCornerStyle';
    document.head.appendChild(style);

    // 创建设置图标
    const settingsIcon = document.createElement('div');
    settingsIcon.id = 'settingsIcon';
    settingsIcon.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
    `;

    // 创建设置面板
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'settingsPanel';

    // 更新设置面板内容
    settingsPanel.innerHTML = `
        <div class="setting-item">
            <span>启用脚本</span>
            <label class="switch">
                <input type="checkbox" id="scriptToggle" ${isScriptEnabled ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        </div>
        <div class="setting-item ${!isScriptEnabled ? 'disabled' : ''}">
            <span>圆角效果</span>
            <label class="switch">
                <input type="checkbox" id="roundedToggle" ${isRoundedEnabled ? 'checked' : ''} ${!isScriptEnabled ? 'disabled' : ''}>
                <span class="slider"></span>
            </label>
        </div>
        <div class="setting-item ${!isScriptEnabled ? 'disabled' : ''}">
            <span>夜间模式</span>
            <label class="switch">
                <input type="checkbox" id="darkModeToggle" ${isDarkMode ? 'checked' : ''} ${!isScriptEnabled ? 'disabled' : ''}>
                <span class="slider"></span>
            </label>
        </div>
        <div class="setting-item ${!isScriptEnabled ? 'disabled' : ''}">
            <span>动画效果</span>
            <label class="switch">
                <input type="checkbox" id="animationToggle" ${isAnimationEnabled ? 'checked' : ''} ${!isScriptEnabled ? 'disabled' : ''}>
                <span class="slider"></span>
            </label>
        </div>
        <a href="https://bbs.binmt.cc/space-uid-142569.html" target="_blank" class="setting-author">
            <img src="https://bbs.binmt.cc/uc_server/avatar.php?uid=142569&size=small" alt="作者头像">
            作者 Raymondman
        </a>
        <a href="https://cursor.sh/" target="_blank" class="setting-cursor">
            <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M13.325 3.05L8.667 20.432l1.932.518 4.658-17.382-1.932-.518zM7.612 18.36l1.36-1.448-.001-.019-5.094-4.78 4.79-5.105-1.447-1.358-6.16 6.563 6.552 6.147zM16.388 18.36l-1.36-1.448.001-.019 5.094-4.78-4.79-5.105 1.447-1.358 6.16 6.563-6.552 6.147z"/>
            </svg>
            本脚本由 Cursor 辅助开发
        </a>
    `;

    document.body.appendChild(settingsIcon);
    document.body.appendChild(settingsPanel);

    // 更新样式函数
    function updateStyles() {
        if (!isScriptEnabled) {
            style.textContent = `
                /* 设置图标基础样式 */
                #settingsIcon {
                    position: fixed !important;
                    right: 20px !important;
                    bottom: 80px !important;
                    width: 40px !important;
                    height: 40px !important;
                    background: #fff !important;
                    border-radius: 50% !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                    cursor: pointer !important;
                    z-index: 999 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }

                #settingsIcon svg {
                    width: 24px !important;
                    height: 24px !important;
                }

                /* 设置面板基础样式 */
                #settingsPanel {
                    position: fixed !important;
                    right: 20px !important;
                    bottom: 140px !important;
                    width: 200px !important;
                    background: #fff !important;
                    border-radius: 12px !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                    z-index: 999 !important;
                    padding: 15px !important;
                    display: none !important;
                }

                #settingsPanel.show {
                    display: block !important;
                }

                /* 设置项基础样式 */
                .setting-item {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-bottom: 10px !important;
                }

                .setting-item.disabled {
                    opacity: 0.5 !important;
                    pointer-events: none !important;
                }

                /* 开关基础样式 */
                .switch {
                    position: relative !important;
                    display: inline-block !important;
                    width: 40px !important;
                    height: 20px !important;
                }

                .switch input {
                    opacity: 0 !important;
                    width: 0 !important;
                    height: 0 !important;
                }

                .slider {
                    position: absolute !important;
                    cursor: pointer !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    background-color: #ccc !important;
                    transition: .4s !important;
                    border-radius: 20px !important;
                }

                .slider:before {
                    position: absolute !important;
                    content: "" !important;
                    height: 16px !important;
                    width: 16px !important;
                    left: 2px !important;
                    bottom: 2px !important;
                    background-color: white !important;
                    transition: .4s !important;
                    border-radius: 50% !important;
                }

                input:checked + .slider {
                    background-color: #2196F3 !important;
                }

                input:checked + .slider:before {
                    transform: translateX(20px) !important;
                }

                /* 作者链接基础样式 */
                .setting-author {
                    display: flex !important;
                    align-items: center !important;
                    color: #666 !important;
                    font-size: 13px !important;
                    padding: 10px 0 0 !important;
                    text-decoration: none !important;
                    border-top: 1px solid #eee !important;
                    margin-top: 10px !important;
                }

                .setting-author img {
                    width: 20px !important;
                    height: 20px !important;
                    border-radius: 50% !important;
                    margin-right: 8px !important;
                    border: 1px solid #eee !important;
                }
            `;
            return;
        }

        style.textContent = `
            /* 圆角相关样式 */
            ${isRoundedEnabled ? `
                /* 主要内容框 */
                .bm.bmw.cl.widthauto,
                .bm_h,
                .bbda,
                .comiis_bkbox,
                #settingsPanel,
                .midaben_signpanel,
                .comiis_fl_g,
                .fl_tb,
                .bm,
                .fl_g,
                .toplist_7ree,
                .boxbg_7ree,
                .tipinfo_7ree {
                    border-radius: 12px !important;
                    overflow: hidden !important;
                }

                /* 版块图标和小图片 */
                .fl_icn_g,
                .fl_icn_g img,
                .bbda .ec,
                .bbda .tn,
                .threadline_7ree img {
                    border-radius: 8px !important;
                }

                /* 按钮和标签 */
                .tbmu a,
                .bbda .o,
                .xl.xl2.cl em,
                .pn,
                .pnc,
                button,
                input[type="submit"] {
                    border-radius: 4px !important;
                }

                /* 头像和圆形元素 */
                .bbda .m.avt img,
                .setting-author img,
                .kmuser img,
                #settingsIcon,
                .avatar,
                .avt img {
                    border-radius: 50% !important;
                }

                /* 搜索框和输入框 */
                input[type="text"],
                textarea,
                .comiis_search_div {
                    border-radius: 8px !important;
                }

                /* 导航菜单 */
                .comiis_nvdiv,
                #comiis_nv {
                    border-radius: 12px !important;
                    overflow: hidden !important;
                }

                /* 帖子列表项 */
                .threadline_7ree {
                    border-radius: 8px !important;
                    margin: 5px 0 !important;
                    padding: 8px 12px !important;
                }

                /* 版块卡片 */
                .comiis_fl_g {
                    margin: 5px !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                }

                /* 提示框 */
                .tipinfo_7ree {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                }

                /* 设置面板相关 */
                #settingsPanel {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                }

                #settingsIcon {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                }

                /* 开关圆角 */
                .slider {
                    border-radius: 20px !important;
                }

                .slider:before {
                    border-radius: 50% !important;
                }
            ` : ''}

            /* 动画相关样式 */
            ${isAnimationEnabled ? `
                /* 基础过渡动画 */
                .bm.bmw.cl.widthauto,
                .bm_h,
                .bbda,
                .comiis_bkbox,
                .midaben_signpanel,
                .comiis_fl_g,
                .fl_icn_g,
                .bbda .ec,
                .bbda .tn,
                .tbmu a,
                .bbda .o,
                .xl.xl2.cl em,
                .threadline_7ree,
                .setting-author,
                #settingsPanel,
                .slider,
                .slider:before,
                a,
                input[type="text"],
                textarea,
                button,
                .pn,
                .pnc {
                    transition-property: all !important;
                    transition-duration: 0.3s !important;
                    transition-timing-function: ease !important;
                }

                /* 悬停效果 */
                .threadline_7ree:hover {
                    transform: translateX(5px) !important;
                    background: ${isDarkMode ? '#252525' : '#f5f5f5'} !important;
                }

                .comiis_fl_g:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.15'}) !important;
                }

                .setting-author:hover {
                    transform: translateY(-1px) !important;
                    opacity: 0.8 !important;
                }

                /* 按钮悬停效果 */
                .pn:hover,
                .pnc:hover,
                button:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2) !important;
                }

                /* 链接悬停效果 */
                a:hover {
                    color: #2196F3 !important;
                }

                /* 设置面板动画 */
                #settingsPanel {
                    transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease !important;
                }

                #settingsPanel.show {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                    pointer-events: auto !important;
                }

                #settingsPanel:not(.show) {
                    opacity: 0 !important;
                    transform: translateY(10px) !important;
                    pointer-events: none !important;
                }

                /* 开关动画 */
                .slider {
                    transition: background-color 0.3s ease !important;
                }

                .slider:before {
                    transition: transform 0.3s ease !important;
                }

                /* 输入框动画 */
                input[type="text"]:focus,
                textarea:focus {
                    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2) !important;
                }

                /* 版块卡片动画 */
                .fl_g:hover {
                    background: ${isDarkMode ? '#252525' : '#f5f5f5'} !important;
                }

                /* 设置图标动画 */
                #settingsIcon:hover {
                    transform: rotate(30deg) !important;
                }

                /* 导航菜单动画 */
                .comiis_nv li:hover {
                    background: ${isDarkMode ? '#252525' : '#f5f5f5'} !important;
                }
            ` : ''}

            /* 夜间模式样式 */
            ${isDarkMode ? `
                /* 基础背景色 */
                body, #wp, #ct, .mn, .appl, .wp, .ct2_a, .ct2_a_r, 
                .bm, .bm_h, .tbn, #pt, .comiis_bkbox {
                    background-color: #1a1a1a !important;
                    color: #e0e0e0 !important;
                }

                /* 所有卡片背景 */
                .bm_c > div,
                .xl.xl2.cl,
                .bbda,
                .comiis_bkbox,
                #settingsPanel,
                .comiis_user_info,
                .midaben_signpanel .fblock,
                .tbn,
                .bm,
                .ct2_a,
                .comiis_forumlist,
                .comiis_wzpost,
                .comiis_search_div,
                .comiis_forum_threadlist,
                .comiis_forum_threadlist .comiis_forum_threadlist_list,
                .comiis_notip {
                    background: #2d2d2d !important;
                    border-color: #3d3d3d !important;
                }

                /* 导读表格背景 */
                .toplist_7ree {
                    background: #2d2d2d !important;
                }

                /* 表格标题行 */
                .toptitle_7ree {
                    background: #2d2d2d !important;
                }

                .toptitle_7ree td {
                    border-color: #3d3d3d !important;
                    color: #e0e0e0 !important;
                }

                /* 表格链接 */
                .toptitle_7ree a,
                .threadline_7ree a,
                .fl_g dt a, 
                .fl_g dd.kmlineheight em,
                .fl_g dd a.xi2,
                .bm_h h2 a,
                .bm_h .y a {
                    color: #e0e0e0 !important;
                }

                /* 链接悬停 */
                a:hover {
                    color: #2196F3 !important;
                }

                /* 设置面板夜间模式 */
                #settingsPanel {
                    background: #2d2d2d !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
                }

                #settingsPanel .setting-item span {
                    color: #e0e0e0 !important;
                }

                #settingsPanel .setting-author {
                    color: #999 !important;
                    border-top-color: #3d3d3d !important;
                }

                /* 版块图标背景 */
                .fl_icn_g {
                    background: #252525 !important;
                    border-color: #3d3d3d !important;
                }

                /* 统计数字 */
                .xi1, .xi2 {
                    color: #2196F3 !important;
                }

                /* 分隔线 */
                .pipe,
                .setting-item,
                .bbda,
                .tbn li,
                .fl_tb td {
                    border-color: #3d3d3d !important;
                }

                /* 帖子内容 */
                .t_fsz {
                    color: #e0e0e0 !important;
                }

                /* 引用块 */
                .quote {
                    background: #252525 !important;
                    border-color: #3d3d3d !important;
                }

                /* 代码块 */
                .blockcode {
                    background: #252525 !important;
                    border-color: #3d3d3d !important;
                }

                /* 顶部导航栏 */
                .comiis_nvdiv {
                    background: #2d2d2d !important;
                    border-color: #3d3d3d !important;
                }

                /* 搜索框 */
                input[type="text"],
                textarea {
                    background: #252525 !important;
                    border-color: #3d3d3d !important;
                    color: #e0e0e0 !important;
                }

                /* 按钮 */
                .pn, .pnc {
                    background: #2196F3 !important;
                    border-color: #2196F3 !important;
                    color: white !important;
                }

                /* 设置图标 */
                #settingsIcon {
                    background: #2d2d2d !important;
                }

                #settingsIcon svg path {
                    fill: #e0e0e0 !important;
                }

                /* 表格悬停效果 */
                .fl_g:hover {
                    background: #252525 !important;
                }

                /* 版主列表 */
                .bm_h .y {
                    color: #999 !important;
                }

                /* 帖子数量统计 */
                .fl_i {
                    color: #999 !important;
                }

                /* 最后发表 */
                .fl_by {
                    color: #999 !important;
                }

                .fl_by cite {
                    color: #666 !important;
                }
            ` : ''}

            /* 设置图标和面板基础样式 */
            #settingsIcon {
                position: fixed !important;
                right: 20px !important;
                bottom: 80px !important;
                width: 40px !important;
                height: 40px !important;
                background: #fff !important;
                border-radius: 50% !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                cursor: pointer !important;
                z-index: 999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            #settingsIcon svg {
                width: 24px !important;
                height: 24px !important;
            }

            #settingsPanel {
                position: fixed !important;
                right: 20px !important;
                bottom: 140px !important;
                width: 200px !important;
                background: #fff !important;
                border-radius: 12px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                z-index: 999 !important;
                padding: 15px !important;
                display: none !important;
            }

            #settingsPanel.show {
                display: block !important;
            }

            .setting-item {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 10px !important;
            }

            .setting-item.disabled {
                opacity: 0.5 !important;
                pointer-events: none !important;
            }

            .switch {
                position: relative !important;
                display: inline-block !important;
                width: 40px !important;
                height: 20px !important;
            }

            .switch input {
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
            }

            .slider {
                position: absolute !important;
                cursor: pointer !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background-color: #ccc !important;
                transition: .4s !important;
                border-radius: 20px !important;
            }

            .slider:before {
                position: absolute !important;
                content: "" !important;
                height: 16px !important;
                width: 16px !important;
                left: 2px !important;
                bottom: 2px !important;
                background-color: white !important;
                transition: .4s !important;
                border-radius: 50% !important;
            }

            input:checked + .slider {
                background-color: #2196F3 !important;
            }

            input:checked + .slider:before {
                transform: translateX(20px) !important;
            }

            .setting-author {
                display: flex !important;
                align-items: center !important;
                color: #666 !important;
                font-size: 13px !important;
                padding: 10px 0 0 !important;
                text-decoration: none !important;
                border-top: 1px solid #eee !important;
                margin-top: 10px !important;
            }

            .setting-author img {
                width: 20px !important;
                height: 20px !important;
                border-radius: 50% !important;
                margin-right: 8px !important;
                border: 1px solid #eee !important;
            }

            /* 分区版主样式 */
            .bm_h .y {
                display: flex !important;
                flex-wrap: wrap !important;
                align-items: center !important;
                gap: 5px !important;
            }

            .bm_h .y a {
                color: ${isDarkMode ? '#999' : '#666'} !important;
                text-decoration: none !important;
                padding: 2px 5px !important;
                border-radius: ${isRoundedEnabled ? '4px' : '0'} !important;
                transition: ${isAnimationEnabled ? 'all 0.3s ease' : 'none'} !important;
            }

            .bm_h .y a:hover {
                color: #2196F3 !important;
                background: ${isDarkMode ? '#252525' : '#f5f5f5'} !important;
            }

            .bm_h .y .pipe {
                color: ${isDarkMode ? '#3d3d3d' : '#ddd'} !important;
                margin: 0 2px !important;
            }

            /* 分区标题样式 */
            .bm_h h2 {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
            }

            .bm_h h2 a {
                color: ${isDarkMode ? '#e0e0e0' : '#333'} !important;
                font-weight: bold !important;
                text-decoration: none !important;
                transition: ${isAnimationEnabled ? 'color 0.3s ease' : 'none'} !important;
            }

            .bm_h h2 a:hover {
                color: #2196F3 !important;
            }

            /* Cursor链接样式 */
            .setting-cursor {
                display: flex !important;
                align-items: center !important;
                color: #666 !important;
                font-size: 13px !important;
                padding: 10px 0 0 !important;
                text-decoration: none !important;
                border-top: 1px solid #eee !important;
                margin-top: 10px !important;
                transition: ${isAnimationEnabled ? 'all 0.3s ease' : 'none'} !important;
            }

            .setting-cursor svg {
                margin-right: 8px !important;
                transition: ${isAnimationEnabled ? 'transform 0.3s ease' : 'none'} !important;
            }

            .setting-cursor:hover {
                color: #2196F3 !important;
            }

            .setting-cursor:hover svg {
                transform: scale(1.1) !important;
            }

            /* 夜间模式样式 */
            ${isDarkMode ? `
                .setting-cursor {
                    color: #999 !important;
                    border-top-color: #3d3d3d !important;
                }
            ` : ''}
        `;
    }

    // 事件监听器
    settingsIcon.addEventListener('click', function() {
        settingsPanel.classList.toggle('show');
    });

    document.getElementById('roundedToggle').addEventListener('change', function(e) {
        isRoundedEnabled = e.target.checked;
        GM_setValue('isRoundedEnabled', isRoundedEnabled);
        updateStyles();
    });

    document.getElementById('darkModeToggle').addEventListener('change', function() {
        isDarkMode = this.checked;
        GM_setValue('isDarkMode', isDarkMode);
        updateStyles();
    });

    document.getElementById('animationToggle').addEventListener('change', function() {
        isAnimationEnabled = this.checked;
        GM_setValue('isAnimationEnabled', isAnimationEnabled);
        updateStyles();
    });

    document.getElementById('scriptToggle').addEventListener('change', function() {
        isScriptEnabled = this.checked;
        GM_setValue('isScriptEnabled', isScriptEnabled);
        
        const toggles = ['roundedToggle', 'darkModeToggle', 'animationToggle'];
        toggles.forEach(id => {
            const toggle = document.getElementById(id);
            toggle.disabled = !isScriptEnabled;
            toggle.parentElement.parentElement.classList.toggle('disabled', !isScriptEnabled);
        });
        
        updateStyles();
    });

    // 初始化
    updateStyles();
})(); 