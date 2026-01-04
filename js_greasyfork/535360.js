// ==UserScript==
// @name         MWI HBuilderX green color
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  将银河奶牛改成HBuilderX绿色配色,方便摸鱼
// @author       Greenwaln
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/535360/MWI%20HBuilderX%20green%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/535360/MWI%20HBuilderX%20green%20color.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义要注入的 CSS 规则
    // 使用 !important 强制覆盖现有样式
    const css = `
        /* 选取所有元素及它们的伪元素 */
        * , *::before, *::after {
            /* 将常用的颜色属性重置为默认值（initial）或透明 */
            /* initial 会尝试使用该属性的初始值（通常是黑色文本、透明背景等） */
            color: #3e4b53 !important; /* 文本颜色 */
            background-color: transparent !important; /* 背景颜色设为透明 */
            border-color: #41a863 !important; /* 边框颜色 */
            outline-color: #41a863 !important; /* 轮廓颜色 */
            caret-color: #657ba7 !important; /* 光标颜色 */


            /* 移除可能包含颜色的阴影 */
            text-shadow: none !important;
            box-shadow: none !important;

            /* 注意：background-image 没有设为 none，这会移除所有背景图片，包括非颜色相关的。
                如果主要是想移除渐变背景图，可以取消注释下面的行：
            */
                background-image: none !important;
        }
        /* 大背景 */
        .App_app__3vFLV{
         background-color: #fffae8!important;
        }
        /* 特别针对 SVG 元素的颜色属性 */
        /* SVG 使用 fill 和 stroke 定义填充色和描边色 */
        svg, svg *, path, circle, rect, polygon, line, polyline, ellipse, g {
            fill: #fffae8 !important; /* SVG 填充色 */
            stroke: #3e4b53 !important; /* SVG 描边色 */
            /* 有时 SVG 或其子元素可能继承 color/background-color */
            color: #3e4b53 !important;
            background-color: transparent !important;
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
        .Modal_modal__1Jiep,
        .OfflineProgressModal_modal__2W5xv,
        .MuiPaper-root,
        .MuiList-root,
        .Party_buttonsContainer__34UMd,
        .css-1spb1s5{
        backdrop-filter: blur(8px)!important;
        background-color: rgba(232,223,196,0.3) !important;
        }
        .Button_button__1Fe9z{
        background-color: rgba(232,223,196,0.5) !important;
        }
        /* 经验条显示 */
        .NavigationBar_currentExperience__3GDeX {
        background-color:#41a863 !important;
        }

        /* 小队未准备红条保留 */
        .Party_party__1AxcO .Party_partyInfo__3eK97 .Party_partySlots__3zGeH .Party_partySlot__1xuiq.Party_notReady__3p-vN {
        border-top:4px solid var(--color-scarlet-500) !important;
        }
        /* ================================== */

        /* 可恶的 body 滚动条颜色 */
        body {
            scrollbar-color: #41a863 #fffae8 !important; /* Firefox */
        }

        /*Webkit 内核浏览器（Chrome, Edge, Safari）的滚动条 */
        body::-webkit-scrollbar {
            width: 12px !important;
        }

        body::-webkit-scrollbar-thumb {
            background-color: #41a863 !important;
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