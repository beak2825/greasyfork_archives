// ==UserScript==
// @name         MWI VSCode dark color modified
// @namespace    http://tampermonkey.net/
// @version      0.0.21
// @description  在MWI VSCode dark color基础上修改
// @author       MagnoliaCoco
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544754/MWI%20VSCode%20dark%20color%20modified.user.js
// @updateURL https://update.greasyfork.org/scripts/544754/MWI%20VSCode%20dark%20color%20modified.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义要注入的 CSS 规则
    // 使用 !important 强制覆盖现有样式
    const css = `
        /* 选取所有元素及它们的伪元素 */
        *:not(.CharacterName_name__1amXp) , *::before, *::after {
            /* 将常用的颜色属性重置为默认值（initial）或透明 */
            /* initial 会尝试使用该属性的初始值（通常是黑色文本、透明背景等） */
            //color: #d4d4d4 !important; /* 文本颜色 */
            background-color: transparent !important; /* 背景颜色设为透明 */
            border-color: #d4d4d4 !important; /* 边框颜色 */
            outline-color: #d4d4d4 !important; /* 轮廓颜色 */
            caret-color: #d4d4d4 !important; /* 光标颜色 */
            scrollbar-color:#4f4f4f #333 !important

            /* 移除可能包含颜色的阴影 */
            text-shadow: none !important;
            box-shadow: none !important;

            /* 注意：background-image 没有设为 none，这会移除所有背景图片，包括非颜色相关的。
                如果主要是想移除渐变背景图，可以取消注释下面的行：
            */
        }
        /* 大背景 */
        .App_app__3vFLV{
         background-color: #1e1e1e!important;
        }

        /* 特别针对 SVG 元素的颜色属性 */
        /* SVG 使用 fill 和 stroke 定义填充色和描边色 */
        svg, svg *, path, circle, rect, polygon, line, polyline, ellipse, g {
            fill: #1e1e1e !important; /* SVG 填充色 */
            //stroke: #d4d4d4 !important; /* SVG 描边色 */
            /* 有时 SVG 或其子元素可能继承 color/background-color */
            color: #d4d4d4 !important;
            background-color: transparent !important;
        }
        /* 大背景图片 */
        .App_app__3vFLV,
        .GamePage_gamePage__ixiPl,
        .Header_header__1DxsV {
            background: none !important;
        }

        /* === 特殊处理：战斗单位背景透明 === */
        .CombatUnit_combatUnit__1m3XT,
        .CombatUnit_model__2qQML,
        .CombatUnit_splatsContainer__2xcc0>*,
        .CombatUnit_splat__1dcLj>*,
        .CombatUnit_mana__2gi_u {
            background-color: transparent !important;
            color: transparent !important;
        }
        /* === 各种背景半透明 === */
        .mwc-settings-content,
        .Toolkit_Calculator_Container > div > div > div > div > div,
        #inventoryHistoryPopup,
        #netWorthPopup,
        #playerNumberPopup,
        #tradeHistoryPopup,
        #analysis-panel,
        .marketHistoryData,
        .skill-selector-content,
        .edibletoolsdiv1,
        .edibletoolsdiv2,
        #market-history-container,
        #market-history-panel,
        .alchemy-simulator-modal,
        .lll_popup_root,
        #cart-tab,
        .lll_plainPopup_containerRoot,
        div:has(#closeSettingsBtn),
        .muip-window,
        #chatp-settings-window,
        #house-calculator,
        #deltaNetworthChartModal,
        .QuestModal_questModalContent__15Lbn,
        div:has(#mooket_chart),
        .visualization-window,
        .Notification_text__3fYCr,
        .SharableProfile_modal__2OmCQ,
        .modal-content,
        .Modal_modal__1Jiep,
        .OfflineProgressModal_modal__2W5xv,
        .MuiPaper-root,
        .MuiList-root,
        .Party_buttonsContainer__34UMd,
        .css-1spb1s5{
        backdrop-filter: blur(8px)!important;
        background-color: rgba(30,30,30,0.5) !important;
        }

        .Button_button__1Fe9z{
        background-color: rgba(51,51,51,0.8) !important;
        color: #d4d4d4 !important;
        }

        /* 各种字体颜色 */
        .marketHistoryData,                                                  /* 市场挂单弹窗 */
        #script_sortByAsk_btn,#script_sortByBid_btn,#script_sortByNone_btn,  /* 库存物品排序 */
        .modal-dialog,                                                       /* 收益面板设置 */
        .Toolkit_Calculator_Container *,                                     /* mwi calc */
        .css-55b9xc .MuiTooltip-tooltip,                                     /* 提示框 */
        .NavigationBar_level__3C7eR,                                         /* 技能等级 */
        .CombatUnit_name__1SlO1,                                             /* 战斗中名字 */
        .CombatUnit_status__3bH7W,                                           /* 战斗中buff */
        .HitpointsBar_hpValue__xNp7m,.ManapointsBar_mpValue__3dij7,          /* 血量蓝量 */
        .ProgressBar_text__102Yn,                                            /* 技能 */
        .dps-info,                                                           /* dps */
        .CommunityBuff_level__1JCTU,                                         /* 社区buff等级 */
        .Input_input__2-t98,.MuiSelect-select,.MuiList-root,                 /* 输入框 */
        div:has(div#showMarketDataPage),                                     /* 食用工具字体 */
        #quickInputButtons>button,                                           /* 职业动作次数字体 */
        .NavigationBar_badge__3I_xZ{
        color: #e7e7e7 !important;
        }

        option {
        color: rgba(0, 0, 0, 0.87) !important;
        }

        /*  */
        .lll_tab_btnSettings,
        .lll_tab_btnClose {
        background-color: #4f4f4f !important;
        }

        /* 设置图标名字颜色边框 */
        .SettingsPanel_chatIcon__jMPha,
        .SettingsPanel_nameColor__2inVZ {
            border: none !important;
        }

        /* 市场取消按钮颜色 */
        .Button_warning__1-AMI {
        background-color: var(--color-warning) !important;
        }
        
        /* 市场收藏 */
        .Item_itemContainer__x7kH1.favorit {
            box-shadow: 0 0 0 2px var(--color-orange-300) !important;
            border-radius: 4px !important;
        }
        .Item_itemContainer__x7kH1.favorit .Item_item__2De2O {
        background: var(--color-orange-800) !important;
        }
        
        /* 市场挂单边框 */
        #market-history-container {
        border: 2px solid #4f4f4f !important;
        }

        /* 任务商店物品边框 */
        .TasksPanel_upgrade__3jp5v,
        .TasksPanel_item__DWSpv {
        border: 2px solid #4f4f4f !important;
        }

        /* 食物cd背景 */
        .CountdownOverlay_countdownOverlay__2QRmL,
        .ConsumableSlot_cooldownOverlay__1x5ci {
        background-color: rgba(30,30,30,0.5) !important;
        }

        /* 额外等级字体颜色 */
        .NavigationBar_boost__2YbEa {
        color: var(--color-success) !important;
        }

        /* 强化框宽度 */
        .EnhancingPanel_enhancingPanel__ysWpV .EnhancingPanel_enhancingAction__2GJtD {
        max-width: 900px !important;
        }

        /* 库存物品排序按钮背景边框 */
        div:has(#script_sortByAsk_btn) > button {
        border: 1px solid #4f4f4f !important;
        background-color:transparent !important;
        }
        div:has(#script_sortByAsk_btn) > button:active,
        div:has(#script_sortByAsk_btn) > button:hover {
        background-color:#4f4f4f !important;
        }

        /* 库存物品价值背景 */
        #script_stack_price {
            border-radius:4px;
            background:var(--color-orange-300) !important;
            color:var(--color-orange-800);
            cursor:pointer;
            left:0!important;
            top:0!important;
            padding:0 2px
        }

        /* 掉落记录边框 */
        .LootLogPanel_actionLoot__32gl_ {
        border: 2px solid #4f4f4f !important;
        }

        /* 职业动作边框 */
        .SkillAction_skillAction__1esCp {
        border: 2px solid #4f4f4f !important;
        }

        /* 职业动作溢出 */
        .SkillAction_skillAction__1esCp .SkillAction_iconContainer__1ZFYB.SkillAction_milking__105OG,
        .SkillAction_skillAction__1esCp .SkillAction_iconContainer__1ZFYB.SkillAction_woodcutting__2JdAS {
        margin: 25% auto auto !important;
        }

        /* 配装缺失边框和字体颜色 */
        .LoadoutsPanel_characterLoadouts__B6V9b .LoadoutsPanel_missing__QaJRE {
        color: var(--color-warning) !important;
        }
        .LoadoutsPanel_playerModel__k_nnW .LoadoutsPanel_missing__QaJRE,
        .LoadoutsPanel_consumables__2u-5q .LoadoutsPanel_missing__QaJRE {
        border: 1px solid var(--color-warning) !important;
        }

        /* 队伍高亮 */
        .FindParty_highlighted__3AqVc {
        box-shadow: 0 0 0 2px var(--color-space-400) !important;
        }

        /* 组队等级不满足字体颜色 */
        .FindParty_notMet__1MRuX {
        color: var(--color-warning) !important;
        }

        /* 怪物血条蓝条颜色 */
        .HitpointsBar_currentHp__5exLr {
        background-color: var(--color-hitpoints) !important;
        }
        .HitTracker_hpDrop {
        background-color: var(--color-warning) !important;
        }
        .ManapointsBar_currentMp__3xpqC {
        background-color: var(--color-manapoints) !important;
        }

        /* 技能垂直居中 */
        .ProgressBar_progressBar__Os8fm {
        line-height: 16px !important;
        }

        /* 牛牛UI增强设置 */
        .muip-switch-container {
        border: 2px solid #4f4f4f !important;
        border-radius: 26px !important;
        }
        .muip-switch-label:after {
        background-color: var(--color-text-dark-mode) !important;
        }
        .muip-switch-input:checked+.muip-switch-label {
        background-color: #4f4f4f !important;
        }
        .TasksPanel_progressBar__2Vjlv {
        background-color: transparent !important;
        }
        .NavigationBar_active__3R-QS {
        background-color: #4f4f4f !important;
        }
        .NavigationBar_boost__2YbEa {
        color: var(--color-success) !important;
        }
        .TasksPanel_purplesGift__DMW4u,
        .TasksPanel_unreadTasks__sVdle,
        .RandomTask_randomTask__3B9fA {
        border: 2px solid #4f4f4f !important;
        }

        /* 在线离线颜色 */
        .SocialPanel_online__2vdLY,
        .GuildPanel_online__1s6m5 {
        color: var(--color-jade-500) !important;
        }
        .SocialPanel_offline__4BJxg,
        .GuildPanel_offline__fEUHh {
        color: var(--color-scarlet-500) !important;
        }

        /* 经验条显示 */
        .NavigationBar_currentExperience__3GDeX {
        background-color:#4f4f4f !important;
        }
        .NavigationBar_active__3R-QS>.NavigationBar_nav__3uuUl .NavigationBar_currentExperience__3GDeX {
        background-color: var(--color-orange-400) !important;
        }
        .NavigationBar_active__3R-QS>.NavigationBar_subSkills__37qWb>.NavigationBar_nav__3uuUl .NavigationBar_currentExperience__3GDeX {
        background-color: var(--color-orange-400) !important;
        }

        /* 工作进度条显示 */
        .ProgressBar_progressBar__Os8fm {
        border: 2px solid #4f4f4f !important;
        }
        .ProgressBar_active__Do7AF {
        background-color: #4f4f4f !important;
        }
        /* 战斗中buff边框 */
        .CombatUnit_status__3bH7W {
        border: 2px solid #4f4f4f !important;
        }
        /* 小队未准备红条保留 */
        .FindParty_ready__2nOPK,
        .Party_ready__9HSCr {
        border-top:4px solid var(--color-jade-500) !important;
        }
        .FindParty_notReady__1yjP_,
        .Party_notReady__3p-vN {
        border-top:4px solid var(--color-scarlet-500) !important;
        }
        /* ================================== */

        /* 可恶的 body 滚动条颜色 */
        body {
            scrollbar-color: #4f4f4f #1e1e1e !important; /* Firefox */
        }

        /*Webkit 内核浏览器（Chrome, Edge, Safari）的滚动条 */
        body::-webkit-scrollbar {
            width: 12px !important;
        }

        body::-webkit-scrollbar-thumb {
            background-color: #4f4f4f !important;
            border-radius: 6px !important;
        }
    `;

    // 创建一个新的 <style> 元素
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';

    // 将 CSS 规则添加到 style 元素中
    // textContent 通常比 innerHTML 更安全
    styleElement.textContent = css;

    // 将 style 元素添加到页面的 <head> 中
    // 确保 head 元素可用，通常在 document_idle 时运行脚本 head 已存在
    // 如果head不存在，可以备选添加到 documentElement
    const head = document.head || document.documentElement;
    if (head) {
        head.appendChild(styleElement);
    } else {
        // 回退方案，虽然这种情况很少见
        document.documentElement.appendChild(styleElement);
    }

})();