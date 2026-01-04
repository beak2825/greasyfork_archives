// ==UserScript==
// @name         🫧404小站 — 🎬VIP追剧神器 | 完全免费 | 支持多平台
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  ▶在线VIP视频解析工具 |free| 支持多平台<在不看VIP电影时关闭脚本>【爱奇艺】【腾讯视频】【优酷土豆】【芒果TV】【乐视视频】【哔哩哔哩】【搜狐视频】等常见视频平台。提供多种解析接口，支持内嵌播放和弹窗播放模式，可自动解析VIP视频。制作不易，熬穿了不知道多少个夜晚，您的赞赏会是刺破黑暗苍穹的亮照照亮我前行的路❗❗❗有问题可加微信咨询：Why15236444193[学长也还有学业在身，如果加微信未能及时回复，请多多包涵哈！
// @author       伏黑甚而
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @run-at       document-start
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE2IDMuNWMtNi45IDAtMTIuNSA1LjYtMTIuNSAxMi41UzkuMSAyOC41IDE2IDI4LjUgMjguNSAyMi45IDI4LjUgMTYgMjIuOSAzLjUgMTYgMy41eiIgZmlsbD0iI2ZmNjliNCIvPjxwYXRoIGQ9Ik0xNiA2LjVjLTUuMiAwLTkuNSA0LjMtOS41IDkuNXM0LjMgOS41IDkuNSA5LjUgOS41LTQuMyA5LjUtOS41LTQuMy05LjUtOS41LTkuNXptMCAxNmMtMy42IDAtNi41LTIuOS02LjUtNi41czIuOS02LjUgNi41LTYuNSA2LjUgMi45IDYuNSA2LjUtMi45IDYuNS02LjUgNi41eiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMiAxNWgydjJoLTJ6bTQtMmgzdjJoLTN6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE0IDIyaC0ydjJoMnoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTggMjJoLTJ2MmgyeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xNSAyN2gydjJoLTJ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/531324/%F0%9F%AB%A7404%E5%B0%8F%E7%AB%99%20%E2%80%94%20%F0%9F%8E%ACVIP%E8%BF%BD%E5%89%A7%E7%A5%9E%E5%99%A8%20%7C%20%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%20%7C%20%E6%94%AF%E6%8C%81%E5%A4%9A%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/531324/%F0%9F%AB%A7404%E5%B0%8F%E7%AB%99%20%E2%80%94%20%F0%9F%8E%ACVIP%E8%BF%BD%E5%89%A7%E7%A5%9E%E5%99%A8%20%7C%20%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%20%7C%20%E6%94%AF%E6%8C%81%E5%A4%9A%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析接口配置 - 去重整合后的完整列表
    const parseApis = [
        // 类型1: 内嵌播放 + 弹窗无选集
        {"name": "七哥", "type": "1,3", "url": "https://jx.nnxv.cn/tv.php?url=", "recommended": true},
        {"name": "虾米", "type": "1,3", "url": "https://jx.xmflv.cc/?url=", "recommended": true},
        {"name": "纯净1", "type": "1,2,3", "url": "https://im1907.top/?jx="},
        {"name": "B站1", "type": "1,3", "url": "https://jx.jsonplayer.com/player/?url="},
        {"name": "爱豆", "type": "1,3", "url": "https://jx.aidouer.net/?url="},
        {"name": "BL", "type": "1,3", "url": "https://vip.bljiex.com/?v="},
        {"name": "冰豆", "type": "1,3", "url": "https://api.qianqi.net/vip/?url="},
        {"name": "百域", "type": "1,3", "url": "https://jx.618g.com/?url="},
        {"name": "CK", "type": "1,3", "url": "https://www.ckplayer.vip/jiexi/?url="},
        {"name": "CHok", "type": "1,3", "url": "https://www.gai4.com/?url="},
        {"name": "ckmov", "type": "1,3", "url": "https://www.ckmov.vip/api.php?url="},
        {"name": "H8", "type": "1,3", "url": "https://www.h8jx.com/jiexi.php?url="},
        {"name": "JY", "type": "1,3", "url": "https://jx.playerjy.com/?url="},
        {"name": "解析", "type": "1,3", "url": "https://ckmov.ccyjjd.com/ckmov/?url="},
        {"name": "解析la", "type": "1,3", "url": "https://api.jiexi.la/?url="},
        {"name": "老板", "type": "1,3", "url": "https://vip.laobandq.com/jiexi.php?url="},
        {"name": "MAO", "type": "1,3", "url": "https://www.mtosz.com/m3u8.php?url="},
        {"name": "M3U8", "type": "1,3", "url": "https://jx.m3u8.tv/jiexi/?url="},
        {"name": "诺讯", "type": "1,3", "url": "https://www.nxflv.com/?url="},
        {"name": "OK", "type": "1,3", "url": "https://okjx.cc/?url="},
        {"name": "PM", "type": "1,3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
        {"name": "盘古", "type": "1,3", "url": "https://www.pangujiexi.cc/jiexi.php?url="},
        {"name": "RDHK", "type": "1,3", "url": "https://jx.rdhk.net/?v="},
        {"name": "人人迷", "type": "1,3", "url": "https://jx.blbo.cc:4433/?url="},
        {"name": "思云", "type": "1,3", "url": "https://jx.ap2p.cn/?url="},
        {"name": "思古3", "type": "1,3", "url": "https://jsap.attakids.com/?url="},
        {"name": "听乐", "type": "1,3", "url": "https://jx.dj6u.com/?url="},
        {"name": "维多", "type": "1,3", "url": "https://jx.ivito.cn/?url="},
        {"name": "YT", "type": "1,3", "url": "https://jx.yangtu.top/?url="},
        {"name": "云端", "type": "1,3", "url": "https://sb.5gseo.net/?url="},
        {"name": "0523", "type": "1,3", "url": "https://go.yh0523.cn/y.cy?url="},
        {"name": "17云", "type": "1,3", "url": "https://www.1717yun.com/jx/ty.php?url="},
        {"name": "180", "type": "1,3", "url": "https://jx.000180.top/jx/?url="},
        {"name": "4K", "type": "1,3", "url": "https://jx.4kdv.com/?url="},
        {"name": "8090", "type": "1,3", "url": "https://www.8090g.cn/?url="},
        {"name": "剖元", "type": "1,3", "url": "https://www.pouyun.com/?url="},
        {"name": "全民", "type": "1,3", "url": "https://43.240.74.102:4433?url="},
        {"name": "夜幕", "type": "1,3", "url": "https://www.yemu.xyz/?url="},
        {"name": "M3U8TV", "type": "1,3", "url": "https://jx.m3u8.tv/jiexi/?url="},
        {"name": "playm3u8", "type": "1,3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
        {"name": "综合", "type": "1,3", "url": "https://jx.jsonplayer.com/player/?url="},

        // 类型2: 弹窗播放带选集（仅保留正确的接口）
        {"name": "im1907", "type": "2", "url": "https://im1907.top/?jx="},
        {"name": "云析(带选集)", "type": "2", "url": "https://jx.yparse.com/index.php?url="},
    ];

    // 去重处理 - 确保URL唯一的接口
    const uniqueApis = [];
    const seenUrls = new Set();

    parseApis.forEach(api => {
        if (!seenUrls.has(api.url)) {
            seenUrls.add(api.url);
            uniqueApis.push(api);
        }
    });

    // 获取用户自定义接口
    const customApis = GM_getValue("custom_parse_apis", []);
    // 合并内置接口和自定义接口
    const allApis = [...uniqueApis, ...customApis];

    const CONFIG = {
        vipBoxId: 'vip_jx_box_' + Math.ceil(Math.random() * 100000000),
        autoPlayerKey: "auto_player_key_" + window.location.host,
        autoPlayerVal: "auto_player_value_" + window.location.host,
        flag: "flag_vip",
        // 添加当前选中的类型存储键
        currentTypeKey: "current_type_key_" + window.location.host
    };

    // 添加样式
    GM_addStyle(`
        #${CONFIG.vipBoxId} {
            cursor: pointer;
            position: fixed;
            top: 120px;
            left: 0px; /* 修改为0px */
            z-index: 9999999;
            text-align: left;
            transition: left 0.3s ease; /* 添加平滑过渡效果 */
        }

        #${CONFIG.vipBoxId}.visible {
            left: 0px; /* 鼠标悬停时完全显示 */
        }

        #${CONFIG.vipBoxId} .img_box {
            width: 32px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background-color: lightgreen; /* 修改为浅绿色背景 */
            margin: 10px 0px;
            color: white;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
        }

        #${CONFIG.vipBoxId} .vip_list {
            display: none;
            position: absolute;
            border-radius: 5px;
            left: 32px;
            top: 0;
            text-align: center;
            background-color: #3f4149;
            border: 1px solid white;
            padding: 10px 0px;
            width: 380px;
            max-height: 400px;
            overflow-y: auto;
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        #${CONFIG.vipBoxId} .vip_list.visible {
            display: block;
            opacity: 1;
            transform: translateX(0);
        }

        #${CONFIG.vipBoxId} .vip_list ul {
            padding-left: 10px;
        }

        #${CONFIG.vipBoxId} .vip_list li {
            border-radius: 2px;
            font-size: 12px;
            color: #DCDCDC;
            text-align: center;
            width: calc(25% - 14px); /* 每行显示4个 */
            line-height: 21px;
            float: left;
            border: 1px solid gray;
            padding: 0 4px;
            margin: 4px 2px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            opacity: 0;
            transform: translateY(10px);
        }

        #${CONFIG.vipBoxId} .vip_list.visible li {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0.1s;
        }

        /* 弹窗带选集接口每行显示2个 */
        #${CONFIG.vipBoxId} .complex-api-list li {
            width: calc(50% - 14px);
        }

        #${CONFIG.vipBoxId} .vip_list li:hover {
            color: #1c84c6;
            border: 1px solid #1c84c6;
        }

        #${CONFIG.vipBoxId} .vip_list::-webkit-scrollbar {
            width: 5px;
            height: 1px;
        }

        #${CONFIG.vipBoxId} .vip_list::-webkit-scrollbar-thumb {
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: #A8A8A8;
        }

        #${CONFIG.vipBoxId} .vip_list::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: #F1F1F1;
        }

        #${CONFIG.vipBoxId} li.selected {
            color: #1c84c6;
            border: 1px solid #1c84c6;
        }

        #${CONFIG.vipBoxId} #vip_auto {
            background-color: #ff69b4; /* 粉色背景 */
        }

        #${CONFIG.vipBoxId} #add_api_btn {
            background-color: #36383f;
            color: #ccc;
            border: 1px solid #5a5a5a;
            font-size: 12px;
            width: auto;
            padding: 6px 12px;
            margin-top: 5px;
            border-radius: 3px;
        }

        #${CONFIG.vipBoxId} #add_api_btn:hover {
            background-color: #42444a;
        }

        /* 新增样式：用于区分接口名称和播放模式 */
        .mode-toggle {
            color: #1c84c6;
            cursor: pointer;
            margin-left: 2px;
        }

        .section-title {
            color: #1c84c6;
            font-weight: bold;
            font-size: 14px;
            padding: 5px 0px;
            clear: both;
            opacity: 0;
            transform: translateY(10px);
        }

        #${CONFIG.vipBoxId} .vip_list.visible .section-title {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0.05s;
        }

        /* 赞赏码相关样式 */
        #${CONFIG.vipBoxId} #donate_section {
            clear: both;
            margin-top: 10px;
            padding: 10px;
            text-align: center;
            border-top: 1px solid #555;
            opacity: 0;
            transform: translateY(10px);
        }

        #${CONFIG.vipBoxId} .vip_list.visible #donate_section {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0.15s;
        }

        #${CONFIG.vipBoxId} #donate_section .donate-title {
            color: #f8ac59;
            font-size: 12px;
            margin-bottom: 5px;
        }

        #${CONFIG.vipBoxId} #qr-code-img {
            max-width: 100px;
            max-height: 100px;
            margin-top: 5px;
            border: 1px solid #ddd;
            background: white;
        }

        /* 选项卡样式 */
        #${CONFIG.vipBoxId} .tab-header {
            display: flex;
            background-color: #3f4149;
        }

        #${CONFIG.vipBoxId} .tab-button {
            flex: 1;
            padding: 5px 0;
            border: none;
            cursor: pointer;
            outline: none;
            font-size: 12px;
            background: none;
            color: #ccc;
        }

        #${CONFIG.vipBoxId} .tab-button.active {
            color: #1c84c6;
            font-weight: bold;
        }

        #${CONFIG.vipBoxId} .tab-divider {
            width: 1px;
            background-color: #5a5a5a;
            margin: 5px 0;
        }

        #${CONFIG.vipBoxId} .tab-content {
            display: none;
        }

        #${CONFIG.vipBoxId} .tab-content.active {
            display: block;
        }

        #${CONFIG.vipBoxId} .add-api-form {
            padding: 10px;
            background-color: #3f4149;
            border-radius: 4px;
            margin: 10px;
            display: none;
        }

        #${CONFIG.vipBoxId} .add-api-form input,
        #${CONFIG.vipBoxId} .add-api-form select {
            width: 100%;
            padding: 6px;
            margin: 5px 0;
            border-radius: 3px;
            border: 1px solid #5a5a5a;
            background-color: #2c2e34;
            color: #ccc;
        }

        #${CONFIG.vipBoxId} .add-api-form button {
            padding: 6px 12px;
            margin: 5px 2px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            background-color: #1c84c6;
            color: white;
        }

        #${CONFIG.vipBoxId} .add-api-form .cancel-btn {
            background-color: #72747a;
        }

        #${CONFIG.vipBoxId} #add_api_btn {
            background-color: #36383f;
            color: #ccc;
            border: 1px solid #5a5a5a;
            font-size: 12px;
            width: auto;
            padding: 6px 12px;
            margin-top: 5px;
            border-radius: 3px;
        }

        #${CONFIG.vipBoxId} #add_api_btn:hover {
            background-color: #42444a;
        }

    `);

    // 查找目标元素的工具函数
    function findTargetElement(targetContainer) {
        const body = window.document;
        let tabContainer;
        let tryTime = 0;
        const maxTryTime = 120;
        let startTimestamp;
        return new Promise((resolve, reject) => {
            function tryFindElement(timestamp) {
                if (!startTimestamp) {
                    startTimestamp = timestamp;
                }
                const elapsedTime = timestamp - startTimestamp;

                if (elapsedTime >= 500) {
                    //console.log("查找元素：" + targetContainer + "，第" + tryTime + "次");
                    tabContainer = body.querySelector(targetContainer);
                    if (tabContainer) {
                        resolve(tabContainer);
                    } else if (++tryTime === maxTryTime) {
                        reject();
                    } else {
                        startTimestamp = timestamp;
                    }
                }
                if (!tabContainer && tryTime < maxTryTime) {
                    requestAnimationFrame(tryFindElement);
                }
            }

            requestAnimationFrame(tryFindElement);
        });
    }

    // 创建VIP解析按钮
    function createVipButton() {
        // 检查是否已经创建过
        if (document.getElementById(CONFIG.vipBoxId)) return;

        // 获取用户上次选择的类型，默认为"1"（内嵌播放）
        let currentType = GM_getValue(CONFIG.currentTypeKey, "1");

        // 分离接口到两个区域
        let simpleApisHtml = "<div class='section-title'>[内嵌播放+弹窗无选集]</div><ul class='simple-api-list'>";
        let complexApisHtml = "<div class='section-title'>[弹窗带选集]</div><ul class='complex-api-list'>";

        allApis.forEach((item, index) => {
            const types = item.type.split(',');
            const name = item.name;

            // 处理简单播放模式（内嵌和弹窗无选集）
            if (types.includes("1") || types.includes("3")) {
                // 只有同时支持1和3或者只支持其中一种的接口才属于此类
                if ((types.includes("1") || types.includes("3")) && !types.includes("2")) {
                    if (types.includes("1") && types.includes("3")) {
                        // 同时支持内嵌和弹窗无选集
                        simpleApisHtml += `<li class="api-item combined-simple" data-index="${index}" data-modes="1,3" data-current-mode="1" title="${name}">${name} | <span class="mode-toggle">内嵌</span></li>`;
                    } else if (types.includes("1")) {
                        // 仅支持内嵌
                        simpleApisHtml += `<li class="api-item" data-index="${index}" data-mode="1" title="${name}">${name} | 内嵌</li>`;
                    } else if (types.includes("3")) {
                        // 仅支持弹窗无选集
                        simpleApisHtml += `<li class="api-item" data-index="${index}" data-mode="3" title="${name}">${name} | 弹窗</li>`;
                    }
                }
                // 特殊处理同时支持三种类型的接口，将其分别归类
                if (types.includes("1") && types.includes("2") && types.includes("3")) {
                    // 在简单播放模式中只显示内嵌和弹窗无选集部分
                    simpleApisHtml += `<li class="api-item combined-simple" data-index="${index}" data-modes="1,3" data-current-mode="1" title="${name}">${name} | <span class="mode-toggle">内嵌</span></li>`;
                }
            }

            // 处理复杂播放模式（弹窗带选集）
            if (types.includes("2")) {
                // 专门处理弹窗带选集的接口，不支持模式切换
                complexApisHtml += `<li class="api-item" data-index="${index}" data-mode="2" title="${name}">${name}</li>`;
            }
        });

        simpleApisHtml += "<div style='clear:both;'></div></ul>";
        complexApisHtml += "<div style='clear:both;'></div></ul>";

        // 添加自定义接口和赞赏功能分支
        let customAndDonateHtml = `
            <div style="padding: 10px; text-align: center;">
                <div id="donate_section" style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #555;">
                   <div style="color: #ffffff; font-size: 12px; margin-bottom: 5px;">如果觉得好用，欢迎打赏支持</div>
                    <img id="qr-code-img" src="data:image/jpeg;base64,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" alt="赞赏码" style="max-width: 100px; max-height: 100px; border: 1px solid #ddd; background: white;">
                </div>
                <button id="add_api_btn">添加自定义接口</button>

                <div class="add-api-form" id="add-api-form">
                    <input type="text" id="api-name" placeholder="接口名称">
                    <input type="text" id="api-url" placeholder="接口地址 (例: https://jx.example.com/?url=)">
                    <select id="api-type">
                        <option value="1">内嵌播放</option>
                        <option value="2">弹窗播放带选集</option>
                        <option value="3">弹窗播放不带选集</option>
                    </select>
                    <button id="save-api-btn">添加</button>
                    <button class="cancel-btn" id="cancel-api-btn">取消</button>
                </div>
            </div>

        `;

        let autoPlay = !!GM_getValue(CONFIG.autoPlayerKey, null) ? "开" : "关";

        const vipBox = document.createElement('div');
        vipBox.id = CONFIG.vipBoxId;
        vipBox.innerHTML = `
            <div class="vip_icon">
                <div class="img_box" title="选择解析源" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;">
                    <span style="color: white;">V</span>I<span style="color: white;">P</span>
                </div>
                <div class="vip_list">
                    <!-- 选项卡头部 -->
                    <div class="tab-header">
                        <button class="tab-button active" data-tab="vip" style="background-color: #3f4149;">VIP视频解析</button>
                        <div class="tab-divider"></div>
                        <button class="tab-button" data-tab="donate" style="background-color: #3f4149;">赞赏与自定义接口</button>
                    </div>

                    <!-- 选项卡内容 -->
                    <div class="tab-content active" id="vip-tab">
                        ${simpleApisHtml}
                        ${complexApisHtml}

                        <div style="text-align:left;color:#FFF;font-size:10px;padding:0px 10px;margin-top:10px;">
                            <b>自动解析功能说明：</b>
                            <br>&nbsp;&nbsp;1、自动解析功能默认关闭（自动解析只支持内嵌播放源）
                            <br>&nbsp;&nbsp;2、开启自动解析，网页打开后脚本将根据当前选中的解析源自动解析视频。如解析失败，请手动选择不同的解析源尝试
                            <br>&nbsp;&nbsp;3、没有选中解析源将随机选取一个
                            <br>&nbsp;&nbsp;4、如某些网站有会员可以关闭自动解析功能
                            <br>&nbsp;&nbsp;5、点击接口名称后的模式标签可以切换播放模式
                        </div>
                    </div>

                    <div class="tab-content" id="donate-tab">
                        ${customAndDonateHtml}
                    </div>
                </div>
            </div>
            <div class="img_box" id="vip_auto" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;background-color: lightgreen;" title="是否打开自动解析。若自动解析失败，请手动选择其它接口尝试！！">
                ${autoPlay}
            </div>
        `;

        // 使用与第一个脚本相同的查找机制来确定按钮插入位置
        findTargetElement('body')
            .then((container) => {
                container.appendChild(vipBox);
                // 绑定事件
                bindEvents();

                // 自动播放功能
                if (!!GM_getValue(CONFIG.autoPlayerKey, null)) {
                    setTimeout(() => {
                        autoPlayVideo();
                    }, 2500);
                }
            })
            .catch(() => {
                // 如果找不到body，则直接添加到document
                document.body.appendChild(vipBox);
                bindEvents();

                if (!!GM_getValue(CONFIG.autoPlayerKey, null)) {
                    setTimeout(() => {
                        autoPlayVideo();
                    }, 2500);
                }
            });
    }

    // 切换播放模式
    function togglePlayMode(element) {
        const listItem = element.closest('.api-item');
        const modes = listItem.dataset.modes.split(',');
        const currentMode = listItem.dataset.currentMode;

        // 找到下一个模式
        let nextModeIndex = modes.indexOf(currentMode) + 1;
        if (nextModeIndex >= modes.length) nextModeIndex = 0;
        const nextMode = modes[nextModeIndex];

        // 更新显示文本
        let modeText = "";
        switch(nextMode) {
            case "1": modeText = "内嵌"; break;
            case "3": modeText = "弹窗"; break;
            default: modeText = "未知";
        }
        element.textContent = modeText;

        // 更新数据属性
        listItem.dataset.currentMode = nextMode;
    }

    // 绑定解析接口面板事件
    function bindEvents() {
        const vipBox = document.getElementById(CONFIG.vipBoxId);

        // 鼠标悬停显示/隐藏
        vipBox.querySelector(".vip_icon").addEventListener("mouseover", () => {
            vipBox.classList.add("visible");
            const vipList = vipBox.querySelector(".vip_list");
            vipList.classList.add("visible");

            // 延迟显示子元素以创建级联效果
            setTimeout(() => {
                const items = vipList.querySelectorAll('li, .section-title, #donate_section');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transitionDelay = '0ms';
                    }, index * 30);
                });
            }, 50);
        });

        vipBox.querySelector(".vip_icon").addEventListener("mouseout", () => {
            const vipList = vipBox.querySelector(".vip_list");
            vipList.classList.remove("visible");
            vipBox.classList.remove("visible");

            // 重置子元素的过渡延迟
            const items = vipList.querySelectorAll('li, .section-title, #donate_section');
            items.forEach(item => {
                item.style.transitionDelay = '';
            });
        });

        // 选项卡切换功能
        const tabButtons = vipBox.querySelectorAll(".tab-button");
        tabButtons.forEach(button => {
            button.addEventListener("click", function() {
                // 移除所有活动状态
                tabButtons.forEach(btn => btn.classList.remove("active"));
                vipBox.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

                // 添加活动状态到当前选项卡
                this.classList.add("active");
                const tabId = this.getAttribute("data-tab");
                vipBox.querySelector(`#${tabId}-tab`).classList.add("active");
            });
        });

        // 添加自定义接口按钮事件绑定
        const addApiBtn = vipBox.querySelector("#add_api_btn");
        if (addApiBtn) {
            addApiBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                const form = vipBox.querySelector("#add-api-form");
                form.style.display = form.style.display === "block" ? "none" : "block";
            });
        }

        // 添加保存接口事件
        const saveApiBtn = vipBox.querySelector("#save-api-btn");
        if (saveApiBtn) {
            saveApiBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                const nameInput = vipBox.querySelector("#api-name");
                const urlInput = vipBox.querySelector("#api-url");
                const typeSelect = vipBox.querySelector("#api-type");

                const name = nameInput.value.trim();
                const url = urlInput.value.trim();
                const type = typeSelect.value;

                if (!name || !url) {
                    alert('请填写完整信息');
                    return;
                }

                if (!url.includes('?url=') && !url.includes('&url=')) {
                    alert('接口地址必须包含 "?url=" 或 "&url=" 参数占位符');
                    return;
                }

                const newApi = {
                    name: name,
                    type: type,
                    url: url
                };

                // 保存到自定义接口列表
                const customApis = GM_getValue("custom_parse_apis", []);
                customApis.push(newApi);
                GM_setValue("custom_parse_apis", customApis);

                // 清空表单
                nameInput.value = '';
                urlInput.value = '';

                // 隐藏表单
                vipBox.querySelector("#add-api-form").style.display = "none";

                alert('自定义接口已添加，刷新页面后即可使用');
            });
        }

        // 添加取消按钮事件
        const cancelApiBtn = vipBox.querySelector("#cancel-api-btn");
        if (cancelApiBtn) {
            cancelApiBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                vipBox.querySelector("#add-api-form").style.display = "none";
            });
        }

        // 解析接口点击事件（统一处理）
        vipBox.querySelectorAll(".api-item").forEach(item => {
            item.addEventListener("click", (e) => {
                // 检查是否点击了模式切换区域
                if (e.target.classList.contains('mode-toggle')) {
                    togglePlayMode(e.target);
                    return;
                }

                const index = parseInt(item.getAttribute("data-index"));
                const videoObj = allApis[index];

                // 获取播放模式
                let apiType;
                if (item.classList.contains('combined-simple')) {
                    // 组合接口，使用当前选中的模式
                    apiType = item.dataset.currentMode;
                } else {
                    // 普通接口
                    apiType = item.getAttribute("data-mode");
                }

                // 根据类型执行不同操作
                if (apiType === "1") {
                    // 内嵌播放
                    GM_setValue(CONFIG.autoPlayerVal, index);
                    GM_setValue(CONFIG.flag, "true");
                    playVideo(videoObj, true);

                    // 更新选中状态
                    vipBox.querySelectorAll(".api-item").forEach(li => {
                        li.classList.remove("selected");
                    });
                    item.classList.add("selected");
                } else {
                    // 弹窗播放（2和3类型）
                    const url = videoObj.url + window.location.href;
                    GM_openInTab(url, {active: true, insert: true, setParent: true});
                }
            });
        });

        // 自动播放开关
        vipBox.querySelector("#vip_auto").addEventListener("click", function() {
            if (!!GM_getValue(CONFIG.autoPlayerKey, null)) {
                GM_setValue(CONFIG.autoPlayerKey, null);
                this.innerHTML = "关";
                this.title = "是否打开自动解析。若自动解析失败，请手动选择其它接口尝试！！";
            } else {
                GM_setValue(CONFIG.autoPlayerKey, "true");
                this.innerHTML = "开";
            }
            setTimeout(() => {
                window.location.reload();
            }, 200);
        });

        // 左键拖拽移动位置（仅在点击 VIP 图标或开关图标时生效，避免影响列表内点击）
        vipBox.addEventListener("mousedown", function(e) {
            // 只响应左键
            if (e.button !== 0) return;

            const target = e.target;
            const vipIcon = vipBox.querySelector(".vip_icon");
            const autoBtn = vipBox.querySelector("#vip_auto");

            // 在接口列表区域内点击不触发拖拽，保证正常点接口
            if (vipBox.querySelector(".vip_list").contains(target)) return;
            // 只有点击 VIP 图标区域或开关按钮时才允许拖动
            if (!vipIcon.contains(target) && target !== autoBtn) return;

            e.preventDefault();
            vipBox.style.cursor = "move";

            // 拖拽时关闭 left 的过渡动画，避免跟随鼠标时“迟滞”
            const oldTransition = vipBox.style.transition;
            vipBox.style.transition = "none";

            const positionDiv = vipBox.getBoundingClientRect();
            let distenceX = e.clientX - positionDiv.left;
            let distenceY = e.clientY - positionDiv.top;

            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler);

            function moveHandler(e) {
                let x = e.clientX - distenceX;
                let y = e.clientY - distenceY;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                if (x < 0) x = 0;
                else if (x > windowWidth - vipBox.offsetWidth - 100) {
                    x = windowWidth - vipBox.offsetWidth - 100;
                }

                if (y < 0) y = 0;
                else if (y > windowHeight - vipBox.offsetHeight) {
                    y = windowHeight - vipBox.offsetHeight;
                }

                vipBox.style.left = x + "px";
                vipBox.style.top = y + "px";
            }

            function upHandler() {
                document.removeEventListener("mousemove", moveHandler);
                document.removeEventListener("mouseup", upHandler);
                vipBox.style.cursor = "pointer";
                // 还原原来的过渡效果（用于鼠标悬浮滑出动画）
                vipBox.style.transition = oldTransition;
            }
        });
    }

    // 添加自定义解析接口
    function addCustomApi() {
        Swal.fire({
            title: '添加自定义解析接口',
            html: `
                <input type="text" id="api-name" class="swal2-input" placeholder="接口名称">
                <input type="text" id="api-url" class="swal2-input" placeholder="接口地址 (例: https://jx.example.com/?url=)">
                <select id="api-type" class="swal2-select">
                    <option value="1">内嵌播放</option>
                    <option value="2">弹窗播放带选集</option>
                    <option value="3">弹窗播放不带选集</option>
                </select>
            `,
            confirmButtonText: '添加',
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById('api-name').value;
                const url = document.getElementById('api-url').value;
                const type = document.getElementById('api-type').value;

                if (!name || !url) {
                    Swal.showValidationMessage('请填写完整信息');
                    return false;
                }

                if (!url.includes('?url=') && !url.includes('&url=')) {
                    Swal.showValidationMessage('接口地址必须包含 "?url=" 或 "&url=" 参数占位符');
                    return false;
                }

                return { name, url, type };
            }
        }).then(result => {
            if (result.isConfirmed) {
                const newApi = {
                    name: result.value.name,
                    type: result.value.type, // 根据选择的类型设置
                    url: result.value.url
                };

                // 保存到自定义接口列表
                const customApis = GM_getValue("custom_parse_apis", []);
                customApis.push(newApi);
                GM_setValue("custom_parse_apis", customApis);

                Swal.fire('添加成功', '自定义接口已添加，刷新页面后即可使用', 'success');
            }
        });
    }

    // 播放视频
    function playVideo(videoObj, isEmbed) {
        if (!isEmbed) return;

        // 移除页面上的所有视频元素
        const videos = document.getElementsByTagName("video");
        for (let video of videos) {
            if (video.src) {
                video.removeAttribute("src");
                video.muted = true;
                video.load();
                video.pause();
            }
        }

        // 查找合适的容器并替换内容
        const containers = [
            "#player",
            "#mod_player",
            "#player-container",
            ".container-player",
            "#mgtv-player-wrap",
            "#player_module",
            "#bilibiliPlayer",
            "#bilibili-player",
            "#flashbox",
            ".m-video-player-wrap",
            ".intl-video-wrap",
            ".td-playbox",
            "#pptv_playpage_box",
            ".w-video",
            "#flashContent",
            "#vodPlayer"
        ];

        let containerFound = false;
        for (let selector of containers) {
            const container = document.querySelector(selector);
            if (container) {
                containerFound = true;
                // 清空容器
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }

                // 创建iframe播放器
                const iframe = document.createElement("iframe");
                iframe.src = videoObj.url + window.location.href;
                iframe.style.border = "none";
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.allowFullscreen = true;

                // 设置容器样式
                container.style.position = "relative";
                container.style.width = "100%";
                container.style.height = "100%";
                container.style.zIndex = "999999";

                container.appendChild(iframe);
                break;
            }
        }

        if (!containerFound) {
            // 如果没找到容器，创建一个新容器
            const container = document.createElement("div");
            container.id = "vip-video-container";
            container.style.position = "fixed";
            container.style.top = "0";
            container.style.left = "0";
            container.style.width = "100%";
            container.style.height = "100%";
            container.style.zIndex = "9999999";
            container.style.backgroundColor = "black";

            const iframe = document.createElement("iframe");
            iframe.src = videoObj.url + window.location.href;
            iframe.style.border = "none";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.allowFullscreen = true;

            container.appendChild(iframe);
            document.body.appendChild(container);
        }
    }

    // 自动播放视频
    function autoPlayVideo() {
        let index = GM_getValue(CONFIG.autoPlayerVal, 0);
        let autoObj = allApis[index];

        // 检查是否是内嵌播放类型
        if (autoObj.type.includes("1")) {
            playVideo(autoObj, true);

            const vipBox = document.getElementById(CONFIG.vipBoxId);
            if (vipBox) {
                const selectedItem = vipBox.querySelector(`.api-item[data-index="${index}"]`);
                if (selectedItem) {
                    selectedItem.classList.add("selected");
                }
                vipBox.querySelector("#vip_auto").title = `自动解析源：${autoObj.name}`;
            }
        }
    }

    // 页面加载完成后创建按钮
    // 修改为使用requestAnimationFrame循环检测，确保body元素存在
    function waitForBody() {
        if (document.body) {
            createVipButton();
        } else {
            requestAnimationFrame(waitForBody);
        }
    }

    // 修改为与第一个脚本一致的初始化方式
    const util = {
        findTargetEle: (targetEle) => findTargetElement(targetEle)
    };

    // 只在支持的视频网站上自动挂载图标，其它页面不自动创建（但仍可通过右键菜单手动呼出）
    const SUPPORT_HOSTS = [
        "iqiyi.com",     // 爱奇艺
        "youku.com",     // 优酷
        "v.qq.com",      // 腾讯视频
        "mgtv.com",      // 芒果TV
        "bilibili.com",  // 哔哩哔哩
        "le.com",        // 乐视
        "sohu.com",      // 搜狐视频
        "pptv.com",      // PPTV
        "1905.com",       // 1905 电影网
        "iq.com" ,
        "qq.com",
        "tudou.com"





    ];

    const host = window.location.hostname;
    const isSupportSite = SUPPORT_HOSTS.some(h => host.includes(h));

    if (isSupportSite) {
        util.findTargetEle('body')
            .then(() => {
                createVipButton();
            })
            .catch(() => {
                if (document.readyState === "loading") {
                    document.addEventListener("DOMContentLoaded", waitForBody);
                } else {
                    waitForBody();
                }
            });
    }

    // 菜单注册模块
    (function registerMenu() {
        GM_registerMenuCommand('🎬 VIP解析窗口', function() {
            // 确保按钮可见
            const vipBox = document.getElementById(CONFIG.vipBoxId);
            if (vipBox) {
                vipBox.style.display = "block";
                // 展示解析列表
                vipBox.querySelector(".vip_list").style.display = "block";
            } else {
                createVipButton();
            }
        }, 'v');

        GM_registerMenuCommand('📊 脚本状态', function() {
            // 直接获取当前脚本版本，不添加回退
            const version = GM_info.script.version;
            alert('当前版本：' + version + '\\n解析工具已启动，支持多平台VIP视频解析\\n共整合 '+ allApis.length +' 个解析接口\\n新增：多接口选择功能！');
        });

        GM_registerMenuCommand('➕ 添加自定义接口', function() {
            addCustomApi();
        });
    })();
})();