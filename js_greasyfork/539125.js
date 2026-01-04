// ==UserScript==


// @name                      全局定制 Global.Custom
// @description               顶部加载条 => 进度条 | 个性化滚动条 | favicon 替换 | 自定义字体 | 百度 / Google / Bing / 语雀 / ComfyUI / DeepSeek / ChatGPT ... 等多站点 个性化/优化/增强
// @version                   5.5.9
// @author                    YMN
// @icon                      https://greasyfork.org/vite/assets/blacklogo96-CxYTSM_T.png
// @sourceXXX                 https://greasyfork.org/scripts/539125

// @match                     *://**/*
// @include                   *://baidu.com/*
// @include                   *://google.com/*
// @include                   *://bing.com/*
// @include                   *://youtube.com/*
// @include                   *://bilibili.com/*
// @include                   *://chat.deepseek.com/*
// @include                   *://deepseek.com/*
// @include                   *://chatgpt.com/*
// @include                   *://zhihu.com/*
// @include                   *://localhost:*/*
// @include                   *://127.0.0.1:*/*
// @exclude                   *://*bilibili.com/cheese/*
// @run-at                    document-start
// @grant                     GM_addStyle
// @grant                     GM_registerMenuCommand
// @grant                     GM_getValue
// @grant                     GM_setValue
// @grant                     GM_deleteValue
// @connectXXX                XXXXX
// @requireXXX                XXXXX
// @resourceXXX               XXXXX

// @namespace                 https://github.com/rvnymnnn
// @homepageURL               https://github.com/rvnymnnn/XXXXX
// @compatible                Chrome
// @license                   MIT
// @copyright                 2025 YMN
// @contact                   kuxmoil@Gmail.com
// @supportURL                https://greasyfork.org/zh-CN/scripts/539125/feedback
// @contributionURL           https://buymeacoffee.com/rvnymnnn

// @LOG                       20.02.02 - Ver.0.1.0
// @LOG                       25.03.14 - Ver.1.0.0
// @LOG                       25.04.05 - Ver.2.0.0
// @LOG                       25.04.24 - Ver.3.0.0
// @LOG                       25.05.12 - Ver.4.0.0
// @LOG                       25.06.05 - Ver.5.0.0
// @LOG                       25.06.12 - Ver.5.2.4
// @LOG                       25.07.16 - Ver.5.3.0
// @LOG                       25.07.21 - Ver.5.4.0
// @LOG                       25.08.01 - Ver.5.5.0


// @downloadURL https://update.greasyfork.org/scripts/539125/%E5%85%A8%E5%B1%80%E5%AE%9A%E5%88%B6%20GlobalCustom.user.js
// @updateURL https://update.greasyfork.org/scripts/539125/%E5%85%A8%E5%B1%80%E5%AE%9A%E5%88%B6%20GlobalCustom.meta.js
// ==/UserScript==


/**
 * & NEXT
 * 
 * ? ========== ↓ ERROR
 * ? 
 * ? 
 * ! ========== ↓ WARN
 * ! 
 * ! 某些网站动态更新页面内容后 需要手动刷新才可正确应用样式
 * ! 当站点出现在 exclude  matchSubjoin > exclude 中时 状态灯为橙色
 * ! 
 * # ========== ↓ OPTIMIZE
 * # 
 * # VBN_VALUE_STORE 各模块状态同步  结合 VBN_GLOBAL_BUTTON 封装
 * # VBN_OBSERVER_CENTER 可暴露 debugListObservers() debug开启时输出当前所有活跃的目标和监听函数数量
 * # 
 * # 
 * + ========== ↓ NEW
 * + 
 * + 挂载 悬浮/面板按钮 点击呼出弹窗 可输入多行下载链接 进行 单独/批量下载 「调用浏览器原生方式」
 * + 
 * + 
 * 
 */

if (window.VBN_GLOBAL_CUSTOM || window.top !== window.self) return;
    window.VBN_GLOBAL_CUSTOM = true;
    
(function VBN_GlobalVariable() {
    
    'use strict';
    
    GM_addStyle( /* css */ `
    
        :root, [vbnGlobalColor] {
        
            --vbnBase09HEX: #F9F9F9;
            --vbnBase08HEX: #F4F4F4;
            --vbnBase07HEX: #BEC2CA;
            --vbnBase06HEX: #ABB0BA;
            --vbnBase05HEX: #757C8A;
            --vbnBase04HEX: #454A54;
            --vbnBase03HEX: #353941;
            --vbnBase02HEX: #2C2F35;
            --vbnBase01HEX: #1F2228;
            --vbnBase00HEX: #1C1E22;
            
            --vbnBase00HSL: var(--vbnBase00HSL-H), var(--vbnBase00HSL-S), var(--vbnBase00HSL-L);
            --vbnBase01HSL: var(--vbnBase00HSL-H), var(--vbnBase01HSL-S), var(--vbnBase01HSL-L);
            --vbnBase02HSL: var(--vbnBase00HSL-H), var(--vbnBase02HSL-S), var(--vbnBase02HSL-L);
            --vbnBase03HSL: var(--vbnBase00HSL-H), var(--vbnBase03HSL-S), var(--vbnBase03HSL-L);
            --vbnBase04HSL: var(--vbnBase00HSL-H), var(--vbnBase04HSL-S), var(--vbnBase04HSL-L);
            --vbnBase05HSL: var(--vbnBase00HSL-H), var(--vbnBase05HSL-S), var(--vbnBase05HSL-L);
            --vbnBase06HSL: var(--vbnBase00HSL-H), var(--vbnBase06HSL-S), var(--vbnBase06HSL-L);
            --vbnBase07HSL: var(--vbnBase00HSL-H), var(--vbnBase07HSL-S), var(--vbnBase07HSL-L);
            --vbnBase08HSL: var(--vbnBase00HSL-H), var(--vbnBase08HSL-S), var(--vbnBase08HSL-L);
            --vbnBase09HSL: var(--vbnBase00HSL-H), var(--vbnBase09HSL-S), var(--vbnBase09HSL-L);
            
            --vbnBase00HSL-H: 220;
            --vbnBase00HSL-S: 10%;    --vbnBase00HSL-L: 12%;
            --vbnBase01HSL-S: 13%;    --vbnBase01HSL-L: 34%;
            --vbnBase02HSL-S: 09%;    --vbnBase02HSL-L: 19%;
            --vbnBase03HSL-S: 10%;    --vbnBase03HSL-L: 23%;
            --vbnBase04HSL-S: 10%;    --vbnBase04HSL-L: 30%;
            --vbnBase05HSL-S: 08%;    --vbnBase05HSL-L: 50%;
            --vbnBase06HSL-S: 10%;    --vbnBase06HSL-L: 70%;
            --vbnBase07HSL-S: 10%;    --vbnBase07HSL-L: 77%;
            --vbnBase08HSL-S: 00%;    --vbnBase08HSL-L: 96%;
            --vbnBase09HSL-S: 00%;    --vbnBase09HSL-L: 98%;
            
            --vbnBase02AltXXX: var(--vbnBase00HSL-H), calc(var(--vbnBase02HSL-S) - 000%), calc(var(--vbnBase02HSL-L) - 000%);
            --vbnBase02PickXX: var(--vbnBase00HSL-H), calc(var(--vbnBase02HSL-S) - 000%), calc(var(--vbnBase02HSL-L) - 000%);
            --vbnBase02Border: var(--vbnBase00HSL-H), calc(var(--vbnBase02HSL-S) - 000%), calc(var(--vbnBase02HSL-L) + 020%);
            --vbnBase02Shadow: var(--vbnBase00HSL-H), calc(var(--vbnBase04HSL-S) - 000%), calc(var(--vbnBase04HSL-L) - 000%);
            --vbnBase04AltXXX: var(--vbnBase00HSL-H), calc(var(--vbnBase04HSL-S) - 000%), calc(var(--vbnBase04HSL-L) - 000%);
            --vbnBase04PickXX: var(--vbnBase00HSL-H), calc(var(--vbnBase04HSL-S) - 000%), calc(var(--vbnBase04HSL-L) - 010%);
            --vbnBase04Border: var(--vbnBase00HSL-H), calc(var(--vbnBase04HSL-S) - 000%), calc(var(--vbnBase04HSL-L) + 020%);
            --vbnBase04Shadow: var(--vbnBase00HSL-H), calc(var(--vbnBase04HSL-S) - 000%), calc(var(--vbnBase04HSL-L) - 000%);
            
            --vbnGlow09HEX: #85E0D7;
            --vbnGlow02HEX: #9087F8;
            --vbnGlow06HEX: #CEF4FD;
            --vbnGlow00HEX: #D9B9F9;
            --vbnGlow08HEX: #BCF5F4;
            --vbnGlow07HEX: #F7F0B7;
            --vbnGlow05HEX: #79ECD9;
            --vbnGlow04HEX: #13EC99;
            --vbnGlow03HEX: #25F493;
            --vbnGlow01HEX: #708BC2;
            --vbnGlow09HSL: 174, 059%, 070%;
            --vbnGlow02HSL: 245, 089%, 075%;
            --vbnGlow06HSL: 191, 092%, 090%;
            --vbnGlow00HSL: 270, 084%, 085%;
            --vbnGlow08HSL: 179, 074%, 085%;
            --vbnGlow07HSL: 053, 080%, 084%;
            --vbnGlow05HSL: 170, 075%, 070%;
            --vbnGlow04HSL: 157, 085%, 050%;
            --vbnGlow03HSL: 152, 090%, 055%;
            --vbnGlow01HSL: 220, 040%, 060%;
            
            --vbnMarkdownH1: #494F4D;
            --vbnMarkdownH2: #515463;
            --vbnMarkdownH3: #40465D;
            --vbnMarkdownH4: #4D5B66;
            --vbnMarkdownH5: #4F5E68;
            --vbnMarkdownH6: #5B7481;
            
            --vbnRed00000: #E93F3F;
            --vbnOrange00: #F55F3A;
            --vbnYellow00: var(--vbnGlow07HEX);
            --vbnGreen000: #11D080;
            --vbnCyan0000: #00B3B3;
            --vbnBlue0000: #478BE5;
            --vbnPurple00: var(--vbnGlow02HEX);
            
            --vbnRed00001: #000;
            --vbnOrange01: #FF5242;
            --vbnYellow01: #000;
            --vbnGreen001: #29F9A9;
            --vbnCyan0001: #000;
            --vbnBlue0001: #2BC2FF;
            --vbnPurple01: #000;
            
            --vbnRed00002: #EF4444;
            --vbnOrange02: #EE5C2A;
            --vbnYellow02: #000;
            --vbnGreen002: #10B981;
            --vbnCyan0002: #000;
            --vbnBlue0002: #2BC2FF;
            --vbnPurple02: #000;
            
            --vbnStateCorrectHEX: #25F49D;
            --vbnStateCorrectHSL: 155, 090%, 055%;
            --vbnStateWarnHEX: #FF7424;
            --vbnStateWarnHSL: 022, 100%, 057%;
            --vbnStateErrorHEX: #FC5E4F;
            --vbnStateErrorHSL: 005, 097%, 065%;
            --vbnLink: var(--vbnBlue0000);
            --vbnStateVisited: var(--vbnCyan0000);
            --vbnStateMatch: var(--vbnOrange01);
            
            --vbnBackdrop: ;
            --vbnForeground: ;
            --vbnBackground: ;
            --vbnGlassDark: hsla(var(--vbnPrimaryHSL), .526);
            --vbnGlassLight: hsla(var(--vbnBase09HSL), .526);
            
            --vbnBaidu: #4E6EF2;
            --vbnGoogleBlue: #4285F4;
            --vbnGoogleRad: #ea4335;
            --vbnGoogleYellow: #FBBC05;
            --vbnGoogleGreen: #34a853;
            --vbnBing: #174AE4;
            --vbn115: #2777F8;
            --vbnIQIYI: #00F48E;
            --vbnBiliPink: #FB7299;
            --vbnBiliBlue: #00AEEC;
            
        }
        
        :root, [vbnGlobalFont] {
            
            --vbnBaseFont: Emoji, "Public Sans", "Inter", "PingFang SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif, system-ui;
            --vbnBaseSize: 14px;
            --vbnBaseWeight: 400;
            --vbnBaseLineHeight: 1.5;
            --vbnBaseColor: var(--vbnBase04HEX);
            
            --vbnTitleSize: 24px;
            --vbnTitleWeight: 700;
            --vbnTitleLineHeight: 1.5;
            --vbnTitleColor: var(--vbnBase02HEX);
            
            --vbnCodeFont: Emoji, "JetBrains Mono", "Fira Code", "PingFang SC", "Source Han Sans SC", "Microsoft YaHei", monospace, system-ui;
            --vbnCodeSize: 12px;
            --vbnCodeWeight: 400;
            --vbnCodeLineHeight: 1.5;
            --vbnCodeColor: var(--vbnAccentHEX);
            
            --vbnOftenFontBase: var(--vbnBaseWeight) var(--vbnBaseSize)/var(--vbnBaseLineHeight) var(--vbnBaseFont);
            --vbnOftenFontTitle: var(--vbnTitleWeight) var(--vbnTitleSize)/var(--vbnTitleLineHeight) var(--vbnBaseFont);
            
        }
        
        @font-face {  font-family: Emoji; src: local("Apple Color Emoji"), local("Segoe UI Emoji"), local("Segoe UI Symbol"), local("Noto Color Emoji"); unicode-range: U+1F000-1F9FF; }
        
        :root, [vbnGlobalSpace] {
            
            --vbnPriority00: 9999;
            --vbnPriority02: 999999;
            --vbnPriority09: 999999999;
            --vbnPriorityHead: ;
            --vbnPrioritySidebar: ;
            --vbnPriorityFooter: ;
            --vbnPriorityBase: ;
            
            --vbnSpace2X: 20px;
            --vbnSpace4X: 60px;
            --vbnSpace2Y: 260px;
            --vbnSpace4Y: 292.6px;
            --vbnSpaceAxialX: 1.26%;
            --vbnSpaceAxialY: ;
            --vbnSpaceWidth00: 80%;
            --vbnSpaceWidth02: 40vw;
            --vbnSpaceWidthVW: 60vw;
            --vbnSpaceWidthPX: calc(260px + 920px + 220px);
            --vbnSpaceHead: ;
            --vbnSpacePadding: 10px 20px;
            --vbnSpaceMargin: 15px 0;
            
            --vbnButtonWidth: 92px;
            --vbnButtonHeight: 40px;
            --vbnButtonPadding: ;
            --vbnButtonAxialX: ;
            --vbnButtonAxialY: ;
            --vbnButtonBase: ;
            
            --vbnTransitionSmooth:  cubic-bezier(.260, .920, .60, 0.926);
            --vbnTransitionSoft:    cubic-bezier(.250, .460, .45, 0.940);
            --vbnTransitionDrop:    cubic-bezier(.240, .920, .92, 0.240);
            --vbnTransitionZoom:    cubic-bezier(.526, .260, .92, 0.920);
            --vbnTransitionFlow:    cubic-bezier(.240, .926, .60, 0.920);
            --vbnTransitionElastic: cubic-bezier(.175, .885, .32, 1.260);
            --vbnOftenTransition: all .526s var(--vbnTransitionSoft);
            
        }
        
        :root, [vbnGlobalStyle] {
            
            --vbnBaseRadius: 4px;
            --vbnBaseBorder: 1px solid;
            --vbnBaseShadow: 0 0 10px 0;
            --vbnBaseFilter: blur(5.26px);
            --vbnBaseZoomIn: ;
            --vbnOftenBaseBorderBase: var();
            --vbnOftenBaseBorderHover: var();
            --vbnOftenBaseShadowBase: var();
            --vbnOftenBaseShadowHover: var();
            
            --vbnUIRadius: 6px;
            --vbnUIBorder: 2px solid;
            --vbnUIShadow: 10px 10px 20px 0;
            --vbnUIFilter: blur(9.26px) saturate(1.52);
            --vbnUIZoomIn: scale(1.26);
            --vbnOftenUIBorderBase: var(--vbnUIBorder) hsla(var(--vbnAccentHSL), .4);
            --vbnOftenUIBorderHover: var();
            --vbnOftenUIShadowBase: var();
            --vbnOftenUIShadowHover: var();
            
            --vbnPanelRadius: 12.6px;
            --vbnPanelBorder: 3px solid;
            --vbnPanelShadow: 0px 10px 20px 0;
            --vbnPanelFilter: blur(12.6px);
            --vbnPanelZoomIn: ;
            --vbnOftenPanelBorderBase: var(--vbnPanelBorder) hsla(var(--vbnAccentHSL), .4);
            --vbnOftenPanelBorderHover: var(--vbnPanelBorder) hsla(var(--vbnAccentHSL), .6);
            --vbnOftenPanelShadowBase: var(--vbnPanelShadow) hsla(var(--vbnAccentShadow), .4);
            --vbnOftenPanelShadowHover: var(--vbnPanelShadow) hsla(var(--vbnAccentShadow), .6);
            
            --vbnSurfaceRadius: 20.6px;
            --vbnSurfaceBorder: 2px solid;
            --vbnSurfaceShadow: 0px 20px 30px 0;
            --vbnSurfaceFilter: blur(20.6px);
            --vbnSurfaceZoomIn: scale(1.026);
            --vbnOftenSurfaceBorderBase: var();
            --vbnOftenSurfaceBorderHover: var();
            --vbnOftenSurfaceShadowBase: var(--vbnSurfaceShadow) hsla(var(--vbnBase04HSL), .05);
            --vbnOftenSurfaceShadowHover: var(--vbnSurfaceShadow) hsla(var(--vbnAccentHSL), .126);
            
            --vbnGlassShadow: 
                inset 0px -1px 4px hsla(var(--vbnBase09HSL), .26),
                var(--vbnPanelShadow) hsla(var(--vbnBase04HSL), .0526);
                
            --vbnTipsShadow-S: inset 0 0 0 2px;
            --vbnTipsShadow-M: 10px 10px 20px;
            --vbnTipsShadow-L: 10px 10px 40px;
            
        }
        
        :root, [vbnGlobalURL] {
            
            --vbnICON-URL-Deepseek: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAuMDAwMDAwIiBoZWlnaHQ9IjUwLjAwMDAwMCIgdmlld0JveD0iMCAwIDUwIDUwIiBmaWxsPSJub25lIiB2Ym5HbG9iYWxWYXJpYWJsZT0idHJ1ZSI+Cgk8cGF0aCBpZD0icGF0aCIgZD0iTTQ4LjgzNTQgMTAuMDQ3OUM0OC4zMjMyIDkuNzkxOTkgNDguMTAyNSAxMC4yNzk4IDQ3LjgwMzIgMTAuNTI3OEM0Ny43MDA3IDEwLjYwNzkgNDcuNjE0MyAxMC43MTE5IDQ3LjUyNzMgMTAuODA3NkM0Ni43NzkzIDExLjYyNCA0NS45MDQ4IDEyLjE1OTcgNDQuNzYyMiAxMi4wOTU3QzQzLjA5MjMgMTIgNDEuNjY2IDEyLjUzNTYgNDAuNDA1OCAxMy44Mzk4QzQwLjEzNzcgMTIuMjMxOSAzOS4yNDc2IDExLjI3MiAzNy44OTI2IDEwLjY1NThDMzcuMTgzNiAxMC4zMzU5IDM2LjQ2NjggMTAuMDE1NiAzNS45NzAyIDkuMzE5ODJDMzUuNjIzNSA4LjgyMzczIDM1LjUyOTMgOC4yNzE5NyAzNS4zNTYgNy43Mjc1NEMzNS4yNDU2IDcuMzk5OSAzNS4xMzUzIDcuMDYzOTYgMzQuNzY1MSA3LjAwNzgxQzM0LjM2MzMgNi45NDM4NSAzNC4yMDU2IDcuMjg3NiAzNC4wNDc5IDcuNTc1NjhDMzMuNDE4IDguNzUxOTUgMzMuMTczMyAxMC4wNDc5IDMzLjE5NzMgMTEuMzU5OUMzMy4yNTI0IDE0LjMxMiAzNC40NzM2IDE2LjY2NDEgMzYuODk5OSAxOC4zMzU5QzM3LjE3NTggMTguNTI3OCAzNy4yNDY2IDE4LjcxOTcgMzcuMTU5NyAxOUMzNi45OTQ2IDE5LjU3NTcgMzYuNzk3NCAyMC4xMzU3IDM2LjYyNCAyMC43MTE5QzM2LjUxMzcgMjEuMDgwMSAzNi4zNDg2IDIxLjE1OTcgMzUuOTYyNCAyMUMzNC42MzA5IDIwLjQzMjEgMzMuNDgxIDE5LjU5MTggMzIuNDY0NCAxOC41NzU3QzMwLjczOTMgMTYuODcyMSAyOS4xNzkyIDE0Ljk5MTcgMjcuMjMzNCAxMy41MkMyNi43NzY0IDEzLjE3NTggMjYuMzE5MyAxMi44NTYgMjUuODQ2NyAxMi41NTE4QzIzLjg2MTggMTAuNTg0IDI2LjEwNjkgOC45Njc3NyAyNi42MjcgOC43NzU4OEMyNy4xNzA0IDguNTc1NjggMjYuODE1OSA3Ljg4NzcgMjUuMDU5MSA3Ljg5NkMyMy4zMDIyIDcuOTAzODEgMjEuNjk1MyA4LjUwMzkxIDE5LjY0NyA5LjMwMzcxQzE5LjM0NzcgOS40MjM4MyAxOS4wMzIyIDkuNTExNzIgMTguNzA5NSA5LjU4Mzk4QzE2Ljg1MDEgOS4yMjM2MyAxNC45MTk5IDkuMTQzNTUgMTIuOTAzMyA5LjM3NTk4QzkuMTA1OTYgOS44MDc2MiA2LjA3Mjc1IDExLjYzOTYgMy44NDMyNiAxNC43NjgxQzEuMTY0NTUgMTguNTI3OCAwLjUzNDE4IDIyLjc5OTggMS4zMDY2NCAyNy4yNTU5QzIuMTE3NjggMzEuOTUyMSA0LjQ2NTgyIDM1LjgzOTggOC4wNzM3MyAzOC44Nzk5QzExLjgxNTkgNDIuMDMyMiAxNi4xMjU1IDQzLjU3NjIgMjEuMDQxIDQzLjI4MDNDMjQuMDI2OSA0My4xMDQgMjcuMzUxNiA0Mi42OTYzIDMxLjEwMTYgMzkuNDU2MUMzMi4wNDY5IDM5LjkzNiAzMy4wMzk2IDQwLjEyNzkgMzQuNjg2IDQwLjI3MkMzNS45NTQ2IDQwLjM5MjEgMzcuMTc1OCA0MC4yMDggMzguMTIxMSA0MC4wMDc4QzM5LjYwMjEgMzkuNjg4IDM5LjQ5OTUgMzguMjg4MSAzOC45NjM5IDM4LjAzMjJDMzQuNjIzIDM1Ljk2NzggMzUuNTc2MiAzNi44MDgxIDM0LjcxIDM2LjEyNzlDMzYuOTE1NSAzMy40NjM5IDQwLjI0MDIgMzAuNjk1OCA0MS41NCAyMS43MjhDNDEuNjQyNiAyMS4wMTYxIDQxLjU1NTcgMjAuNTY3OSA0MS41NCAxOS45OTE3QzQxLjUzMjIgMTkuNjM5NiA0MS42MTA4IDE5LjUwMzkgNDIuMDA0OSAxOS40NjM5QzQzLjA5MjMgMTkuMzM1OSA0NC4xNDc5IDE5LjAzMTcgNDUuMTE2NyAxOC40ODc4QzQ3LjkyOTIgMTYuOTE5OSA0OS4wNjQgMTQuMzQzOCA0OS4zMzE1IDExLjI1NTlDNDkuMzcxMSAxMC43ODM3IDQ5LjMyMzcgMTAuMjk1OSA0OC44MzU0IDEwLjA0NzlaTTI0LjMyNjIgMzcuODM5OEMyMC4xMTk2IDM0LjQ2MzkgMTguMDc5MSAzMy4zNTIxIDE3LjIzNTggMzMuMzk5OUMxNi40NDgyIDMzLjQ0ODIgMTYuNTg5OCAzNC4zNjgyIDE2Ljc2MzIgMzQuOTY3OEMxNi45NDQzIDM1LjU2MDEgMTcuMTgxMiAzNS45NjgzIDE3LjUxMTcgMzYuNDg3OEMxNy43NDAyIDM2LjgzMiAxNy44OTc5IDM3LjM0NDIgMTcuMjgzMiAzNy43MjhDMTUuOTI4MiAzOC41ODQgMTMuNTcyOCAzNy40Mzk5IDEzLjQ2MjQgMzcuMzgzOEMxMC43MjA3IDM1LjczNTggOC40MjgyMiAzMy41NjAxIDYuODEzNDggMzAuNTg0QzUuMjUzNDIgMjcuNzE5NyA0LjM0NzY2IDI0LjY0NzkgNC4xOTc3NSAyMS4zNjc3QzQuMTU4MiAyMC41NzU3IDQuMzg2NzIgMjAuMjk1OSA1LjE1ODY5IDIwLjE1MTlDNi4xNzUyOSAxOS45NiA3LjIyMzE0IDE5LjkxOTkgOC4yMzkyNiAyMC4wNzE4QzEyLjUzMjcgMjAuNzExOSAxNi4xODg1IDIyLjY3MTkgMTkuMjUyOSAyNS43NzU5QzIxLjAwMiAyNy41NDM5IDIyLjMyNTIgMjkuNjU1OCAyMy42ODg1IDMxLjcyMDJDMjUuMTM3NyAzMy45MTIxIDI2LjY5NzggMzYgMjguNjgzMSAzNy43MTE5QzI5LjM4NDMgMzguMzEyIDI5Ljk0MzQgMzguNzY4MSAzMC40NzkgMzkuMTA0QzI4Ljg2NDMgMzkuMjg4MSAyNi4xNjk5IDM5LjMyODEgMjQuMzI2MiAzNy44Mzk4Wk0yNi4zNDMzIDI0LjYwMDFDMjYuMzQzMyAyNC4yNDggMjYuNjE5MSAyMy45Njc4IDI2Ljk2NTggMjMuOTY3OEMyNy4wNDQ0IDIzLjk2NzggMjcuMTE1MiAyMy45ODM5IDI3LjE3ODIgMjQuMDA3OEMyNy4yNjUxIDI0LjA0IDI3LjM0MzggMjQuMDg3OSAyNy40MDY3IDI0LjE2MDJDMjcuNTE3MSAyNC4yNzIgMjcuNTgwMSAyNC40MzIxIDI3LjU4MDEgMjQuNjAwMUMyNy41ODAxIDI0Ljk1MjEgMjcuMzA0MiAyNS4yMzE5IDI2Ljk1NzUgMjUuMjMxOUMyNi42MTA4IDI1LjIzMTkgMjYuMzQzMyAyNC45NTIxIDI2LjM0MzMgMjQuNjAwMVpNMzIuNjA2NCAyNy44Nzk5QzMyLjIwNDYgMjguMDQ3OSAzMS44MDI3IDI4LjE5MTkgMzEuNDE2NSAyOC4yMDhDMzAuODE3OSAyOC4yMzk3IDMwLjE2NDEgMjcuOTkyMiAyOS44MDk2IDI3LjY4OEMyOS4yNTgzIDI3LjIxNTggMjguODY0MyAyNi45NTIxIDI4LjY5ODcgMjYuMTI3OUMyOC42Mjc5IDI1Ljc3NTkgMjguNjY3NSAyNS4yMzE5IDI4LjczMDUgMjQuOTE5OUMyOC44NzIxIDI0LjI0OCAyOC43MTQ0IDIzLjgxNTkgMjguMjQ5NSAyMy40MjM4QzI3Ljg3MTYgMjMuMTA0IDI3LjM5MTEgMjMuMDE2MSAyNi44NjMzIDIzLjAxNjFDMjYuNjY2IDIzLjAxNjEgMjYuNDg0OSAyMi45Mjc3IDI2LjM1MTEgMjIuODU2QzI2LjEzMDQgMjIuNzQ0MSAyNS45NDkyIDIyLjQ2MzkgMjYuMTIyNiAyMi4xMjAxQzI2LjE3NzcgMjIuMDA3OCAyNi40NDU4IDIxLjczNTggMjYuNTA4OCAyMS42ODhDMjcuMjI1NiAyMS4yNzIgMjguMDUyNyAyMS40MDc3IDI4LjgxNjkgMjEuNzE5N0MyOS41MjU5IDIyLjAxNjEgMzAuMDYxNSAyMi41NjAxIDMwLjgzNCAyMy4zMjgxQzMxLjYyMTYgMjQuMjU1OSAzMS43NjMyIDI0LjUxMTcgMzIuMjEyNCAyNS4yMDhDMzIuNTY2OSAyNS43NTIgMzIuODkwMSAyNi4zMTIgMzMuMTEwNCAyNi45NTIxQzMzLjI0NDYgMjcuMzUyMSAzMy4wNzEzIDI3LjY4MDIgMzIuNjA2NCAyNy44Nzk5WiIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIxLjAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIi8+Cjwvc3ZnPg==");
            --vbnICON-URL-OpenAI: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NyIgaGVpZ2h0PSI4NyIgdmlld0JveD0iMCAwIDg3IDg3IiBmaWxsPSJub25lIj4KICAgIDxzdHlsZT4KICAgICAgICBAbWVkaWEgKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKSB7CiAgICAgICAgICAgICNjaXJjbGUgeyBmaWxsOiBibGFjayB9CiAgICAgICAgICAgICNtYXJrIHsgZmlsbDogd2hpdGUgfQogICAgICAgIH0KICAgIDwvc3R5bGU+CgogICAgPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzQyMzdfNDQ2NzUpIj4KICAgICAgICA8cmVjdCBpZD0iY2lyY2xlIiB4PSIwLjM2MTMyOCIgeT0iMC4wNDk4MDQ3IiB3aWR0aD0iODYuNjM4NyIgaGVpZ2h0PSI4Ni42Mzg3IiByeD0iNDMuMzE5MyIgZmlsbD0id2hpdGUiLz4KICAgICAgICA8cGF0aCBpZD0ibWFyayIgZD0iTTM2LjM2MyAzNS40OTlWMjkuNDU4MUMzNi4zNjMgMjkuMDUxNSAzNi40NzkyIDI4Ljc2MTEgMzYuODg1OCAyOC41Mjg3TDQ4LjA5NjIgMjIuMDIzMkM0OS42MDY1IDIxLjE1MTkgNTEuNTIzMyAyMC43NDUzIDUzLjM4MiAyMC43NDUzQzYwLjQ2ODQgMjAuNzQ1MyA2NC45NDEgMjYuMjA1MyA2NC45NDEgMzIuMDcyQzY0Ljk0MSAzMi41MzY2IDY0Ljk0MSAzMy4xNzU2IDY0LjgyNDkgMzMuNjk4NEw1My4wOTE2IDI2Ljg0NDNDNTIuNTEwNyAyNi40OTU4IDUxLjg3MTggMjYuNDM3NyA1MS4xNzQ4IDI2Ljg0NDNMMzYuMzYzIDM1LjQ5OVpNNjIuMjY5MSA1Ni45MzI1VjQzLjUxNDhDNjIuMjY5MSA0Mi43NTk3IDYxLjk3ODcgNDIuMjM2OSA2MS4yODE2IDQxLjgzMDNMNDYuNDExOCAzMy4xNzU2TDUxLjYzOTUgMzAuMTU1MUM1MS45Mjk5IDI5Ljk4MDkgNTIuMzk0NiAyOS45ODA5IDUyLjY4NSAzMC4xNTUxTDYzLjk1MzYgMzYuNjYwN0M2Ny4xNDgzIDM4LjUxOTQgNjkuMzU1NSA0Mi41ODU0IDY5LjM1NTUgNDYuNDc3MkM2OS4zNTU1IDUxLjA2NTkgNjYuNTY3NCA1NS4zMDYxIDYyLjI2OTEgNTYuOTMyNVpNMzMuMjg0NSA0NS4zNzM1TDI4LjExNDggNDIuMjk1QzI3LjcwODIgNDIuMDYyNyAyNy41OTIxIDQxLjc3MjIgMjcuNTkyMSA0MS4zNjU2VjI4LjQxMjZDMjcuNTkyMSAyMi4wODEzIDMyLjQxMzIgMTcuMzE4MyAzOC45NzY4IDE3LjMxODNDNDEuNTMyNiAxNy4zMTgzIDQzLjk3MjIgMTguMTg5NSA0NS45NDcxIDE5Ljc1NzhMMzQuMjcxOSAyNi41NTM4QzMzLjU3NDkgMjYuOTYwNCAzMy4yODQ1IDI3LjQ4MzIgMzMuMjg0NSAyOC4yMzgzVjQ1LjM3MzVaTTQzLjM5MTMgNTEuMTgyMUwzNi4zNjMgNDcuMjMyM1YzOC44NjhMNDMuMzkxMyAzNC45MTgxTDUwLjM2MTYgMzguODY4VjQ3LjIzMjNMNDMuMzkxMyA1MS4xODIxWk00Ny43NDc3IDY4Ljc4MkM0NS4xOTIgNjguNzgyIDQyLjc1MjQgNjcuOTEwNyA0MC43Nzc1IDY2LjM0MjRMNTIuNDUyNyA1OS41NDY0QzUzLjE0OTcgNTkuMTM5OCA1My40NDAxIDU4LjYxNyA1My40NDAxIDU3Ljg2MTlWNDAuNzI2N0w1OC42Njc4IDQzLjgwNTJDNTkuMDc0NCA0NC4wMzc2IDU5LjE5MDYgNDQuMzI4IDU5LjE5MDYgNDQuNzM0NlY1Ny42ODc3QzU5LjE5MDYgNjQuMDE5IDU0LjMxMTQgNjguNzgyIDQ3Ljc0NzcgNjguNzgyWk0zNC4wMzk2IDU1Ljk0NTFMMjIuNzcxIDQ5LjQzOTVDMTkuNTc2MyA0Ny41ODA4IDE3LjM2OSA0My41MTQ4IDE3LjM2OSAzOS42MjMxQzE3LjM2OSAzNC45NzYyIDIwLjIxNTIgMzAuNzk0MSAyNC41MTM1IDI5LjE2NzdWNDIuNjQzNUMyNC41MTM1IDQzLjM5ODYgMjQuODA0IDQzLjkyMTQgMjUuNTAxIDQ0LjMyOEw0MC4zMTI4IDUyLjkyNDZMMzUuMDg1MSA1NS45NDUxQzM0Ljc5NDcgNTYuMTE5MyAzNC4zMyA1Ni4xMTkzIDM0LjAzOTYgNTUuOTQ1MVpNMzMuMzQyNSA2NS4zNTQ5QzI2LjY2MjcgNjUuMzU0OSAyMS43ODM1IDYwLjM1OTYgMjEuNzgzNSA1NC4xNDQ0QzIxLjc4MzUgNTMuNTYzNiAyMS44NDE2IDUyLjk4MjcgMjEuODk5NyA1Mi40NkwzMy41NzQ5IDU5LjE5NzlDMzQuMjcxOSA1OS42MDQ1IDM0Ljg1MjggNTkuNjA0NSAzNS41NDk4IDU5LjE5NzlMNTAuMzYxNiA1MC42MDEyVjU2LjY0MjFDNTAuMzYxNiA1Ny4wNDg3IDUwLjI0NTQgNTcuMzM5MSA0OS44Mzg4IDU3LjU3MTVMMzguNjI4MyA2NC4wNzcxQzM3LjExODEgNjQuOTQ4MyAzNS4yMDEzIDY1LjM1NDkgMzMuMzQyNSA2NS4zNTQ5Wk00Ny43NDc3IDcxLjkxODZDNTQuNzE4IDcxLjkxODYgNjAuNTI2NSA2Ni45MjMyIDYxLjgwNDQgNjAuMzAxNUM2OC4zMSA1OC42NzUxIDcyLjQ5MjEgNTIuNjM0MiA3Mi40OTIxIDQ2LjQ3NzJDNzIuNDkyMSA0Mi40MTEyIDcwLjc0OTYgMzguNTE5NCA2Ny41NTQ5IDM1LjY3MzNDNjcuODQ1MyAzNC40NTM1IDY4LjA3NzYgMzMuMTc1NiA2OC4wNzc2IDMxLjk1NThDNjguMDc3NiAyMy43NjU3IDYxLjM5NzggMTcuNjA4NyA1My43MzA1IDE3LjYwODdDNTIuMTYyMiAxNy42MDg3IDUwLjU5MzkgMTcuODk5MSA0OS4wODM3IDE4LjQyMTlDNDYuNDY5OSAxNS44MDggNDIuOTI2NiAxNC4xODE2IDM4Ljk3NjggMTQuMTgxNkMzMi4wMDY2IDE0LjE4MTYgMjYuMTk4IDE5LjE3NyAyNC45MjAxIDI1Ljc5ODdDMTguNDE0NiAyNy40MjUxIDE0LjIzMjQgMzMuNDY2IDE0LjIzMjQgMzkuNjIzMUMxNC4yMzI0IDQzLjY4OTEgMTUuOTc1IDQ3LjU4MDggMTkuMTY5NyA1MC40MjdDMTguODc5MyA1MS42NDY4IDE4LjY0NjkgNTIuOTI0NiAxOC42NDY5IDU0LjE0NDRDMTguNjQ2OSA2Mi4zMzQ1IDI1LjMyNjcgNjguNDkxNSAzMi45OTQgNjguNDkxNUMzNC41NjIzIDY4LjQ5MTUgMzYuMTMwNiA2OC4yMDExIDM3LjY0MDkgNjcuNjc4M0M0MC4yNTQ3IDcwLjI5MjIgNDMuNzk3OSA3MS45MTg2IDQ3Ljc0NzcgNzEuOTE4NloiIGZpbGw9ImJsYWNrIi8+CiAgICA8L2c+CiAgICA8ZGVmcz4KICAgICAgICA8Y2xpcFBhdGggaWQ9ImNsaXAwXzQyMzdfNDQ2NzUiPgogICAgICAgICAgICA8cmVjdCB4PSIwLjM2MTMyOCIgeT0iMC4wNDk4MDQ3IiB3aWR0aD0iODYuNjM4NyIgaGVpZ2h0PSI4Ni42Mzg3IiByeD0iNDMuMzE5MyIgZmlsbD0id2hpdGUiLz4KICAgICAgICA8L2NsaXBQYXRoPgogICAgPC9kZWZzPgo8L3N2Zz4=");
            --vbnICON-URL-OpenAI-Dark: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0iTTMwNy4yIDBoNDA5LjZRMTAyNCAwIDEwMjQgMzA3LjJ2NDA5LjZxMCAzMDcuMi0zMDcuMiAzMDcuMkgzMDcuMlEwIDEwMjQgMCA3MTYuOFYzMDcuMlEwIDAgMzA3LjIgMCIvPjxwYXRoIGQ9Ik04NDkuNzE1IDQ5NC40MzhhMTgwLjY5IDE4MC42OSAwIDAgMS04LjcwNCAxNjQuMjUgMTc4LjYgMTc4LjYgMCAwIDEtMTE5LjI5NiA4Ni41MjggMTc5LjUgMTc5LjUgMCAwIDEtNjUuNjkgOTAuNjI0IDE4MC40MyAxODAuNDMgMCAwIDEtMTA2LjQ5NSAzNC41MDkgMTgzIDE4MyAwIDAgMS0zNy43MzUtMy44NCAxODAuNyAxODAuNyAwIDAgMS02OC43NjEtMzAuNzIgMTc3LjUgMTc3LjUgMCAwIDEtMjcuOTU2LTI1LjYgMTgwLjc4NyAxODAuNzg3IDAgMCAxLTIxMC4xNzYtMTIxLjI0MiAxNzguOTQgMTc4Ljk0IDAgMCAxIC4yNTYtMTExLjg3MiAxODEuMjUgMTgxLjI1IDAgMCAxLTIyLjE3LTIxMS43MTIgMTc5LjUgMTc5LjUgMCAwIDEgNTAuMjI4LTU2LjIxNyAxNzUuMiAxNzUuMiAwIDAgMSA2OS4wMTgtMzAuMzYyQTE4MC4yMiAxODAuMjIgMCAwIDEgNDc0LjQ3IDE1My43MDJhMTc4LjA3IDE3OC4wNyAwIDAgMSAxMzQuNTU0IDYwLjAwNyAxODIuNDMgMTgyLjQzIDAgMCAxIDExMS4zNiAxMS42NzMgMTgxLjI1IDE4MS4yNSAwIDAgMSA4My4wOTggNzQuOTU3IDE3OS44NyAxNzkuODcgMCAwIDEgMjMuMzk4IDEwOS41NjhjLTEuMzMxIDEyLjY0Ny00LjA5NiAyNS4wMzctOC4wOSAzNy4wNjkgMTIuOCAxNC4wOCAyMy4xOTQgMzAuMDU0IDMwLjkyNSA0Ny40NjJNNjAwLjg4MyA4MTMuMjYxYTEzMy45NCAxMzMuOTQgMCAwIDAgNzIuNzA0LTcyLjcwNGM2LjY1Ni0xNi4zMzMgMTAuMjQtMzMuNzkyIDEwLjI0LTUxLjQwNVY1MjIuNTk4YTcgNyAwIDAgMS0uMjA1LS41MTIgMS44IDEuOCAwIDAgMC0uMjA0LS40NiAxLjQgMS40IDAgMCAwLS4zNTktLjM1OSAxLjIgMS4yIDAgMCAwLS41MTItLjMwN2wtNjAuMjExLTM0LjgxNlY2ODcuMzZhMjMuNjUgMjMuNjUgMCAwIDEtMTEuNzc2IDIwLjMyNmwtMTQyLjY0MyA4Mi4zM2MtMS4xNzguNzE3LTMuMTc1IDEuNzkyLTQuMjUgMi4zNTUgNS44ODggNS4wMTggMTIuMjg4IDkuNDIxIDE5LjA0NyAxMy4zMTIgNi44MSAzLjg5MSAxMy44MjQgNy4xNjggMjEuMTQ1IDkuODNhMTM4LjEgMTM4LjEgMCAwIDAgNDUuNzIyIDcuOTg4YzE3LjYxMyAwIDM1LjA3Mi0zLjQ4MiA1MS4zNTMtMTAuMjR6TTI2MS4wMTggNzAwLjIxYTEzNS4zMiAxMzUuMzIgMCAwIDAgODEuNTYxIDYyLjQ2NCAxMzQuMTQgMTM0LjE0IDAgMCAwIDEwMS44ODgtMTMuMzEybDE0NC4yMy04My4zMDIuNDEtLjM1OWEuOS45IDAgMCAwIC4yMDUtLjQ2IDEuOCAxLjggMCAwIDAgLjIwNS0uNDYxdi03MC4xNDRsLTE3NC4xMzEgMTAwLjY2YTI2LjUgMjYuNSAwIDAgMS01LjYzMiAyLjQwNiAyNC4xNyAyNC4xNyAwIDAgMS0xNy44MTgtMi40MDZMMjQ5LjE5IDYxMi44NjRhMTU4IDE1OCAwIDAgMS00LjE0Ny0yLjU2IDEzNC45IDEzNC45IDAgMCAwIC4wNTEgNDYuNDM4IDEzNS4yIDEzNS4yIDAgMCAwIDE1Ljg3MiA0My41MnYtLjEwMnptLTM3LjQ3OS0zMTEuNDVhMTM1LjA3IDEzNS4wNyAwIDAgMC0xMy4zNjMgMTAxLjk0IDEzNC4xNCAxMzQuMTQgMCAwIDAgNjIuNDY0IDgxLjUxbDE0NC4yMyA4My4zNTQuNTEyLjEwMmguNTEyYS45LjkgMCAwIDAgLjUxMi0uMTAyIDIgMiAwIDAgMCAuNTEyLS4yNTZsNjAuNDE2LTM0LjkxOS0xNzQuMDgtMTAwLjU1NmEyNCAyNCAwIDAgMS0xMC45MDUtMTQuMjg1IDIwLjQgMjAuNCAwIDAgMS0uNzY4LTYuMDQyVjMyOS45MzNhMTM2IDEzNiAwIDAgMC0yMS4xNDYgOS44MyAxMzcuMiAxMzcuMiAwIDAgMC00OC43NDIgNDguOTk5ek03MTguOSA1MDQuMDY1YTIzLjcgMjMuNyAwIDAgMSA4LjY1MyA4LjYwMiAyNi43IDI2LjcgMCAwIDEgMi4zMDQgNS42ODMgMjQgMjQgMCAwIDEgLjY2NiA2LjE0NHYxNjkuNTc0YTEzMy44IDEzMy44IDAgMCAwIDYwLjM2NC00NC41NDRBMTM0LjQ1IDEzNC40NSAwIDAgMCA3NTEuMzEgNDUxLjg0bC0xNDQuMjMtODMuMzU0YTcgNyAwIDAgMC0uNTEzLS4xNTNoLS41MTJhOSA5IDAgMCAxLS41MTIuMTUzIDEuOCAxLjggMCAwIDAtLjUxMi4yMDVsLTYwLjE2IDM0LjgxNiAxNzQuMTgzIDEwMC41NTd6bTYwLjEwOS05MC4zMTdoLS4xMDJ2LjA1MWwuMTAyLS4xMDJ6bS0uMTAyLS4xMDJhMTM0LjI5OCAxMzQuMjk4IDAgMCAwLTE5OS40MjQtMTM5LjA2bC0xNDQuMTI4IDgzLjMwM2ExLjMgMS4zIDAgMCAwLS4zNTkuNDFsLS4zMDcuNDFhNyA3IDAgMCAwLS4yMDUgMS4wMjN2NjkuNjMybDE3NC4xMzEtMTAwLjU1N2EyNyAyNyAwIDAgMSA1LjY4NC0yLjQwNiAyMy45NiAyMy45NiAwIDAgMSAxNy43NjYgMi40MDZsMTQyLjc0NiA4Mi40MzIgNC4xOTggMi40NTh6TTQwMS41NjMgMzM2LjU5YTI0LjA2IDI0LjA2IDAgMCAxIDYuODYtMTYuNTg5IDIxLjMgMjEuMyAwIDAgMSA0Ljg2NC0zLjY4NmwxNDIuNzQ2LTgyLjMzYzEuMzMxLS44MiAzLjE3NC0xLjg5NCA0LjI1LTIuNDA2YTEzMy44NCAxMzMuODQgMCAwIDAtMTQyLjg0OC0xOC40MzIgMTM0LjI1IDEzNC4yNSAwIDAgMC03Ny4zMTIgMTIxLjY1djE2Ni40NTJhNyA3IDAgMCAwIC4xMDIuNTEyIDEuOSAxLjkgMCAwIDAgLjI1Ni41MTIgMyAzIDAgMCAwIC4zNTguNDEgMS43IDEuNyAwIDAgMCAuNDYxLjMwN2w2MC4yNjMgMzQuODE2em0zMi43MTYgMjIwLjA1NyA3Ny41NjggNDQuODUyIDc3LjYyLTQ0Ljg1MnYtODkuNTQ4bC03Ny41MTctNDQuOC03Ny42MiA0NC44LS4wNSA4OS42eiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==");
            
            --vbnICON-URL-Google: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZ29vZ2xlIiB2aWV3Qm94PSIwIDAgMjU2MCAyNTYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj48cGF0aCBkPSJNMjQwNi40IDEzMDYuNjRjMC04My4yLTcuNDQtMTYzLjItMjEuMzYtMjQwSDEyODB2NDU0LjRoNjMxLjQ0Yy0yNy42OCAxNDYuMTYtMTEwLjg4IDI2OS44NC0yMzUuNjggMzUzLjA0djI5NS41MmgzODAuOGMyMjEuODQtMjA0LjggMzQ5Ljg0LTUwNS42IDM0OS44NC04NjIuOTYiIGZpbGw9IiM0Mjg1RjQiLz48cGF0aCBkPSJNMTI4MCAyNDUzLjI4YzMxNi44IDAgNTgyLjQtMTA0LjQ4IDc3Ni40OC0yODMuNjhsLTM4MC44LTI5NS41MmMtMTA0LjQ4IDcwLjQtMjM3Ljg0IDExMy4xMi0zOTUuNjggMTEzLjEyLTMwNS4xMiAwLTU2NC4zMi0yMDUuODQtNjU3LjEyLTQ4My4yaC0zOTAuNHYzMDIuOTZjMTkzLjEyIDM4Mi44OCA1ODguOCA2NDYuNCAxMDQ3LjUyIDY0Ni40eiIgZmlsbD0iIzM0QTg1MyIvPjxwYXRoIGQ9Ik02MjIuODggMTUwMi45NkE3MDMuMyA3MDMuMyAwIDAgMSA1ODUuNiAxMjgwYzAtNzcuODQgMTMuODQtMTUyLjU2IDM3LjI4LTIyMi45NlY3NTQuMTZoLTM5MC40Yy04MCAxNTcuODQtMTI1Ljg0IDMzNi0xMjUuODQgNTI1Ljg0czQ1Ljg0IDM2OCAxMjUuODQgNTI1Ljg0bDMwNC0yMzYuOHoiIGZpbGw9IiNGQkJDMDUiLz48cGF0aCBkPSJNMTI4MCA1NzMuODRjMTcyLjggMCAzMjYuNCA1OS43NiA0NDkuMDQgMTc0Ljk2bDMzNi0zMzZDMTg2MS4yOCAyMjIuODggMTU5Ni44IDEwNi42NCAxMjgwIDEwNi42NGMtNDU4LjcyIDAtODU0LjQgMjYzLjQ0LTEwNDcuNTIgNjQ3LjQ0bDM5MC40IDMwMi45NmM5Mi44LTI3Ny4zNiAzNTItNDgzLjIgNjU3LjEyLTQ4My4yIiBmaWxsPSIjRUE0MzM1Ii8+PC9zdmc+");
            --vbnICON-URL-Microsoft: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDI1NjAgMjU2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0iTTAgMGgxMjE2LjQ4djEyMTYuNDhIMHoiIGZpbGw9IiNGMjUwMjIiLz48cGF0aCBkPSJNMTM0My41MiAwSDI1NjB2MTIxNi40OEgxMzQzLjUyeiIgZmlsbD0iIzdGQkEwMCIvPjxwYXRoIGQ9Ik0wIDEzNDMuNTJoMTIxNi40OFYyNTYwSDB6IiBmaWxsPSIjMDBBNEVGIi8+PHBhdGggZD0iTTEzNDMuNTIgMTM0My41MkgyNTYwVjI1NjBIMTM0My41MnoiIGZpbGw9IiNGRkI5MDAiLz48L3N2Zz4=");
            --vbnICON-URL-MicrosoftCopilot: url("https://studiostaticassetsprod.azureedge.net/bundle-cmc/favicon.svg");
            --vbnICON-URL-Twitter: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMTMzLjc2IDI0MCAyMzAxLjEyIDIwODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiPjxwYXRoIGQ9Ik0xOTQ2LjAyNSAyNDBoMzUyLjg1NUwxNTI4IDExMjEuMDY4IDI0MzQuODggMjMyMEgxNzI0LjhsLTU1Ni4xNi03MjcuMTQ4TDUzMi4yNjUgMjMyMEgxNzkuMmw4MjQuNTMzLTk0Mi40TDEzMy43NiAyNDBoNzI4LjEwN2w1MDIuNzIgNjY0LjY0em0tMTIzLjgzNyAxODY4LjhoMTk1LjUyTDc1NS42MjUgNDQwLjEwOEg1NDUuODF6Ii8+PC9zdmc+");
            
            --vbnICON-URL-Gemini-Vint: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iLTAuMDMyIDAgMTAxNi4wNTMgMTAyMC43MzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiPjxwYXRoIGQ9Im00NDMuNzA2IDc3OS4wMTEgNDAuNzY4LTkzLjMxYTM1OS41NSAzNTkuNTUgMCAwIDEgMTgyLjk3NC0xODUuMzQybDExMi4xOS00OS43OTJjMzUuNjQ4LTE1Ljg3MiAzNS42NDgtNjcuNzc1IDAtODMuNTgzbC0xMDguNjctNDguMjU1YTM1OS44IDM1OS44IDAgMCAxLTE4NS42NjItMTkxLjU1bC00MS4yOC05OS41MTlhNDMuOTY3IDQzLjk2NyAwIDAgMC04MS42NjMgMGwtNDEuMjc5IDk5LjUyYTM1OS43NCAzNTkuNzQgMCAwIDEtMTg1LjY2MiAxOTEuNTQ5bC0xMDguNjcgNDguMjU1Yy0zNS43MTIgMTUuODA4LTM1LjcxMiA2Ny43MTEgMCA4My41ODNsMTEyLjE5IDQ5Ljc5MkEzNTkuNTUgMzU5LjU1IDAgMCAxIDMyMS45OCA2ODUuN2w0MC43MDMgOTMuMzExYTQzLjkwMyA0My45MDMgMCAwIDAgODEuMDIzIDBtNDA4LjEyMyAyMjcuMzI1IDExLjM5Mi0yNi4yNGEyMDIuNyAyMDIuNyAwIDAgMSAxMDMuMTY3LTEwNC41NzRsMzUuMzI3LTE1LjY4YTI0LjY0IDI0LjY0IDAgMCAwIDAtNDQuNzM1bC0zMy4yOC0xNC43ODRhMjAyLjg4IDIwMi44OCAwIDAgMS0xMDQuNzAyLTEwOC4wM2wtMTEuNzc2LTI4LjQxNmEyMy41NTIgMjMuNTUyIDAgMCAwLTQzLjc3NSAwbC0xMS43NzYgMjguNDE1YTIwMi44OCAyMDIuODggMCAwIDEtMTA0LjYzOSAxMDguMDNsLTMzLjI4IDE0Ljc4NWEyNC42NCAyNC42NCAwIDAgMCAwIDQ0LjhsMzUuMjY0IDE1LjYxNWEyMDIuNjIgMjAyLjYyIDAgMCAxIDEwMy4xNjcgMTA0LjU3NWwxMS41MiAyNi4yNGM4LjMyIDE5LjE5OSAzNC45NDMgMTkuMTk5IDQzLjMyNyAweiIgZmlsbD0iIzAyMDIwMiIvPjwvc3ZnPg==");
            --vbnICON-URL-Gemini-Fill: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9IkdlbWluaSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCI+PHBhdGggZGF0YS1uYW1lPSItIiBkPSJNNDQ1LjgyIDIyMy41MmMtMzguNTItMTYuNTktNzIuMjItMzkuMzItMTAxLjE0LTY4LjIxLTI4Ljg5LTI4Ljg5LTUxLjY1LTYyLjYxLTY4LjIxLTEwMS4xNGEzMDEgMzAxIDAgMCAxLTE1LjQtNDUuNTFDMjU5Ljc5IDMuNTcgMjU1LjI1IDAgMjQ5Ljk5IDBzLTkuOCAzLjU4LTExLjA4IDguNjZhMzAwIDMwMCAwIDAgMS0xNS40IDQ1LjUxYy0xNi41OSAzOC41Mi0zOS4zMiA3Mi4yNC02OC4yMSAxMDEuMTQtMjguODkgMjguODYtNjIuNjEgNTEuNjItMTAxLjE0IDY4LjIxYTMwMSAzMDEgMCAwIDEtNDUuNTEgMTUuNEMzLjU2IDI0MC4yLS4wMSAyNDQuNzQtLjAxIDI1MHMzLjU4IDkuOCA4LjY2IDExLjA4YTMwMCAzMDAgMCAwIDEgNDUuNTEgMTUuNGMzOC41MiAxNi41OSA3Mi4yMiAzOS4zMiAxMDEuMTQgNjguMjEgMjguODkgMjguODkgNTEuNjUgNjIuNjEgNjguMjEgMTAxLjE0YTMwMCAzMDAgMCAwIDEgMTUuNCA0NS41MWMxLjI3IDUuMDggNS44NCA4LjY1IDExLjA4IDguNjYgNS4yNiAwIDkuOC0zLjU4IDExLjA4LTguNjZhMzAwIDMwMCAwIDAgMSAxNS40LTQ1LjUxYzE2LjU5LTM4LjUyIDM5LjMyLTcyLjIyIDY4LjIxLTEwMS4xNCAyOC44OS0yOC44OSA2Mi42MS01MS42NSAxMDEuMTQtNjguMjFhMzAwIDMwMCAwIDAgMSA0NS41MS0xNS40YzUuMDgtMS4yNyA4LjY1LTUuODQgOC42Ni0xMS4wOCAwLTUuMjYtMy41OC05LjgtOC42Ni0xMS4wOGEzMDAgMzAwIDAgMCAxLTQ1LjUxLTE1LjQiLz48L3N2Zz4=");
            --vbnICON-URL-Gemini-Line: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iNDYuNDY0IDQ2LjUyOCA5MzAuOTQ0IDkzMC45NDQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiPjxwYXRoIGQ9Ik00NzQuNjI0IDQ2LjUyOGg3NC42ODhsMi4xNzYgMzYuNDhhNDE1LjY4IDQxNS42OCAwIDAgMCAzODkuNDQgMzg5LjQ0bDM2LjQ4IDIuMTc2djc0Ljc1MmwtMzYuNDggMi4xNzZhNDE1LjY4IDQxNS42OCAwIDAgMC0zODkuNDQgMzg5LjQ0bC0yLjE3NiAzNi40OGgtNzQuNjg4bC0yLjI0LTM2LjQ4YTQxNS42OCA0MTUuNjggMCAwIDAtMzg5LjQ0LTM4OS40NGwtMzYuNDgtMi4xNzZ2LTc0Ljc1MmwzNi40OC0yLjE3NmE0MTUuNjggNDE1LjY4IDAgMCAwIDM4OS40NC0zODkuNDR6TTUxMS45MzYgMjQ5LjZBNDk0LjkgNDk0LjkgMCAwIDEgMjQ5LjYgNTEyIDQ5NC45IDQ5NC45IDAgMCAxIDUxMiA3NzQuNCA0OTQuOSA0OTQuOSAwIDAgMSA3NzQuNCA1MTIgNDk0Ljg1IDQ5NC44NSAwIDAgMSA1MTIgMjQ5LjZ6Ii8+PC9zdmc+");
            --vbnICON-URL-DOUBAO: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMTQwLjc0OCAwLjU2IDIyNzguMDIzIDI1NTguNjYxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guc2VhcmNoX2luZGV4LjAuaTEwLjU3N2IzYTgxMktNME5MIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0iTTIzOTcuNDQgMTA5OS41MmMtMzg1LjI4LTI1Ny4yOC03OTEuMDQtMjk1LjY4LTc5MS4wNC0yOTUuNjhzMjAuNDggNTg3LjUyLTI2Ljg4IDc2NS40NGMtMS4yOCAyNC4zMi0yOS40NCAxODguMTYtMTA3LjUyIDM5NC4yNGExMzU1IDEzNTUgMCAwIDEtOTguNTYgMjAzLjUyYy0xMDIuNCAxODUuNi0yMjQgMzE4LjcyLTIyNCAzMTguNzIgMjk5LjUyLTEyMS42IDUxMy4yOC0yMzEuNjggNzc0LjQtNDM5LjA0IDMwNy4yLTI0MS45MiA1NzMuNDQtNjM2LjE2IDQ3My42LTk0Ny4yIiBmaWxsPSIjMTIxMjEyIiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4LnNlYXJjaF9pbmRleC4wLmk5LjU3N2IzYTgxMktNME5MIi8+PHBhdGggZD0iTTgyNC4xNiA5ODkuNDRjMzk1LjUyLTI1Mi4xNiA3NzEuODQtMTk3LjEyIDc4MC44LTE4Ni44OCAxLjI4IDEuMjggMi41NiAxLjI4IDIuNTYgMS4yOCAwLTM1Ljg0LTE2LjY0LTE1Mi4zMi0zMy4yOC0yNjYuMjQtMjkuNDQtMTUyLjMyLTU2LjMyLTMxMi4zMi01Ny42LTMzNC4wOC00MjYuMjQtMzQ4LjE2LTg5Mi4xNi0xOTUuODQtMTEyMCA2NEMyNDMuMiA0NDIuODggMTM4LjA4IDY5Mi40OCAxNDAuOCA4MjguMTZWMTkwNy4yYzEuMjgtMzIgMy44NC01MS4yIDUuMTItNTEuMiA0NC44LTQ5Mi44IDY3OC40LTg2Ni41NiA2NzguNC04NjYuNTZ6IiBmaWxsPSIjMTIxMjEyIiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4LnNlYXJjaF9pbmRleC4wLmk1LjU3N2IzYTgxMktNME5MIi8+PHBhdGggZD0iTTE5ODAuMTYgNjgwLjk2Yy0xMDQuOTYtMTA4LjgtMjE4Ljg4LTIyMS40NC0zMDUuOTItMzEzLjYtODMuMi04Ny4wNC0xNDguNDgtMTUyLjMyLTE1Ny40NC0xNjMuODQgMS4yOCAyMS43NiAyOC4xNiAxODEuNzYgNTcuNiAzMzQuMDggMTYuNjQgMTEzLjkyIDMyIDIzMS42OCAzMy4yOCAyNjYuMjQgMCAwIDQwNS43NiAzOC40IDc5MS4wNCAyOTUuNjgtMS4yOCAwLTIwOC42NC0yMDAuOTYtNDE4LjU2LTQxOC41Nm0tNjA1LjQ0IDE0ODYuMDhjLTYuNCAyLjU2LTQ5Ni42NCAyNjcuNTItNzMwLjg4LTc2LjgtNTIuNDgtNzYuOC03OS4zNi0xNzAuMjQtODMuMi0yNjYuMjQtNy42OC0xODYuODggMTIuOC01NjkuNiAyNjMuNjgtODM0LjU2IDAgMC02MzMuNiAzNzMuNzYtNjc3LjEyIDg2Ni41NmExNzMuMyAxNzMuMyAwIDAgMC01LjEyIDUxLjJjLTIuNTYgODEuOTIgMTEuNTIgMjQ1Ljc2IDEwNy41MiAzODcuODQgMTMwLjU2IDE5NS44NCA0ODIuNTYgMzQ2Ljg4IDgyMC40OCAyMTMuNzZsODMuMi0yNC4zMmMtMi41NiAxLjI4IDExOS4wNC0xMzAuNTYgMjIxLjQ0LTMxNy40NCIgZmlsbD0iIzAyMDIwMiIgZGF0YS1zcG0tYW5jaG9yLWlkPSJhMzEzeC5zZWFyY2hfaW5kZXguMC5pNy41NzdiM2E4MTJLTTBOTCIvPjwvc3ZnPg==");
            --vbnICON-URL-Liblib: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDI1NjAgMjU2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0iTTIxNjQuNSAyNTYwaC0xNzY5QzE3NyAyNTYwIDAgMjM4MyAwIDIxNjQuNXYtMTc2OUMwIDE3NyAxNzcgMCAzOTUuNSAwaDE3NjlDMjM4MyAwIDI1NjAgMTc3IDI1NjAgMzk1LjV2MTc2OWMwIDIxOC41LTE3NyAzOTUuNS0zOTUuNSAzOTUuNSIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iLjE1Ii8+PHBhdGggZD0iTTQyOS41IDE4OWMxNDYgMTU4LjUgMzAyIDMwOSA0NTQuNSA0NjEuNSAxMi41IDI0NC41LTEuNSA0OTAgNy41IDczNSAzIDM4IDQ3IDQ3LjUgNzguNSA0Ni41cTM0OCAuNzUgNjk2IDBjMTU2IDE1My41IDMwNyAzMTIgNDY0LjUgNDYzLTQ3NC04LTk0OC0xLTE0MjIuNS0zLjUtNjguNS0yLjUtMTM4IDYtMjA2LTQuNS00Mi03LjUtNzEuNS00Ny41LTcwLTg5LjUtMi01MzUuNSAyLjUtMTA3Mi0yLjUtMTYwOC41IiBmaWxsPSIjMjY1QkZGIi8+PHBhdGggZD0iTTQyOS41IDIwMDAuNWMyMCAyMS41IDQwIDQzIDYxIDYzLjUgNC41IDczLjUgMCAxNDcgMiAyMjEgLjUgMTQuNSAxNC41IDIyLjUgMjcuNSAyMy41IDIzIDEgNDUuNS0xIDY4LjUgMSAyMS41IDE3LjUgMzkuNSA0MCA2MC41IDU4LjUtNjItMS0xMjQgMC0xODYuNS0uNS0xNy41LjUtMzQtMTUtMzMtMzMgMC0xMTIgMS0yMjMgMC0zMzRtMzk5LjUgMzY2YzE4LS41IDM3LjUgMi41IDU0LTYgMi02IDQtMTEuNSA1LjUtMTcuNSAyLjUgMSA3IDIuNSA5LjUgMyAxNS41IDE5IDQyIDIyIDY0LjUgMjUgMjctMSA1NS05IDczLjUtMjkuNSAzNy00Mi41IDQwLjUtMTA0IDI4LTE1Ni41LTgtMzIuNS0zMC02MC41LTYwLTc1LTM5LTE0LTg2LTYtMTE1IDI0LjUtMi00NCAuNS04OC41LTEuNS0xMzIuNS0xOS41LTEtMzkuNS0xLTU5IC41LjUgMTIwLjUuNSAyNDIgLjUgMzY0bTE2MC0xOTNjMTggMTcgMjAuNSA0My41IDIxIDY3LS41IDIyLjUtNS41IDQ5LTI1LjUgNjIuNS0zMS41IDIyLjUtODQuNSA4LjUtOTQuNS0zMS0xMy0zOS41LTUuNS05Ny41IDQwLjUtMTExIDE5LjUtNSA0My41LTMuNSA1OC41IDEyLjVtNTM5LjUgMTkzYzE3LjUtMS41IDM4IDQuNSA1My03IDUtNCA0LjUtMTEgNi41LTE3IDIuNSAxIDcuNSAyLjUgMTAgMy41IDE1LjUgMTkgNDIgMjIgNjQuNSAyNSAyNy0xIDU1LTkgNzMuNS0yOS41IDM3LTQyLjUgNDAuNS0xMDQgMjgtMTU2LjUtNy41LTMyLjUtMzAtNjAuNS02MC03NS41LTM5LjUtMTQuNS04NS01LTExNiAyNC0uNS00NCAuNS04OC0uNS0xMzItMTkuNS0xLTM5LjUtMi01OS41IDEgMSAxMjEgLjUgMjQyLjUuNSAzNjRtMTU4LTE5NS41YzE3LjUgMTQgMjIgMzggMjMgNTkgMSAyMi41LTIgNDgtMTcuNSA2NS41LTI5LjUgMzEuNS05MS41IDE5LTEwMi41LTI0LTEzLTM5LjUtNS41LTk4IDQwLjUtMTExLjUgMTktMy41IDQxLjUtMyA1Ni41IDExbTE2MS0xM2MtOC41IDE5LjUtMTguNSAzOS0yNS41IDU5LjVoNTdjMTItMzIgMjQuNS02NCAzNi41LTk2IDExLTIwLjUgMTIuNS00NyAyOS02My41IDMuNSAxNSA5LjUgMjkuNSAxNS41IDQ0IDEzIDM0LjUgMjYgNjguNSAzOS41IDEwMyAxIDMgMy41IDkuNSA0LjUgMTMgMTkuNSAwIDM5LS41IDU4LjUgMC0zLjUtNy03LTEzLjUtMTAtMjAuNUMyMDI1IDIxMzIgMTk5NSAyMDY3IDE5NjggMjAwMWMtMTcuNS41LTM1IC41LTUyIDAtMjMgNTIuNS00NiAxMDUtNjguNSAxNTdtMjI2IDYwcTI4LjUtLjc1IDU3IDBjMC03Mi41LS41LTE0NC41IDAtMjE3LTE5IC41LTM4LjUuNS01Ny41IDAgMSA3Mi41LjUgMTQ0LjUuNSAyMTdtLTk0MiAxMDUuNWMwIDcuNSAxIDE1LjUgMiAyMyA2IDEyLjUgMTkuNSAxOSAzMy41IDE5LjUgNjAuNS41IDEyMS41LS41IDE4Mi41LjUtMTkuNS0xOC41LTM4LjUtMzcuNS01Ni41LTU3LTI5LTUuNS01OSAxLjUtODgtNS0zLTMuNS02LTctOS0xMC01LTc2LjUgMS0xNTQtMy0yMzAuNS0xOS41LTIxLjUtNDEuNS00MS02MS02Mi41IDAgMTA3LjUtMSAyMTUtLjUgMzIyTTY5MiAyMzY2aDYwcS0uNzUtMTMyIDAtMjY0aC02MHptNzAwIDBoNjBxLS43NS0xMzIgMC0yNjRoLTU5LjVjLS41IDg4LS41IDE3Ni0uNSAyNjQiLz48L3N2Zz4=");
            --vbnICON-URL-Prompt: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJpY29uIiB2aWV3Qm94PSIxNzAuNjY3IDIzOC45MzMgNjgyLjY2MSA1NDYuMTMzIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0iTTY1OC41MzQgMjM4LjkzM2MxMi44IDAgMjMuOTk2IDExLjUzNyAyMy45OTYgMjQuNzQ3djE4MS40ODdoMTQ3LjE1YzQuODEzIDAgOS42MjYgMS42NzIgMTIuOCA0Ljk1IDExLjE5NiA4LjI2IDE0LjQwNCAyMy4xMDggNi40MTcgMzQuNjQ1TDY2MS43NDMgNzczLjUzYTIyLjA4IDIyLjA4IDAgMCAxLTE5LjE4MyAxMS41MzdjLTEyLjggMC0yMy45OTYtMTEuNTM3LTIzLjk5Ni0yNC43NDdWNTc4LjgzM0g0NzEuMzgxYTE3Ljg1IDE3Ljg1IDAgMCAxLTEyLjgtNC45NWMtMTEuMTk1LTguMjYtMTQuMzctMjMuMTA4LTYuMzgzLTM0LjY0NUw2MzkuMzUxIDI1MC40N2EyMi4wOCAyMi4wOCAwIDAgMSAxOS4xODMtMTEuNTM3TTQ0Mi42MDcgNjc2LjE4MWMyNy4xNyAwIDQ3Ljk5MSAyMS40MzYgNDcuOTkxIDQ5LjQ5NHMtMjAuODIgNDkuNDkzLTQ3Ljk5MSA0OS40OTNIMjgyLjYyNGMtMjcuMTcgMC00Ny45NTctMjEuNDM2LTQ3Ljk1Ny00OS40OTNzMjAuNzg3LTQ5LjQ5NCA0Ny45NTctNDkuNDk0em0tOTUuOTgzLTE5Ny45NzNjMjcuMjA0IDAgNDcuOTkxIDIxLjQwMiA0Ny45OTEgNDkuNDkzIDAgMjguMDI0LTIwLjgyIDQ5LjQ5NC00Ny45OTEgNDkuNDk0aC0xMjhjLTI3LjEzNiAwLTQ3Ljk1Ny0yMS41MDQtNDcuOTU3LTQ5LjQ5NCAwLTI4LjA5MSAyMC44MjEtNDkuNDkzIDQ3Ljk5MS00OS40OTN6bTk1Ljk4My0xOTguMDQyYzI3LjE3IDAgNDcuOTkxIDIxLjQ3IDQ3Ljk5MSA0OS40OTQgMCAyOC4wNTctMjAuODIgNDkuNDkzLTQ3Ljk5MSA0OS40OTNIMjgyLjYyNGMtMjcuMTcgMC00Ny45NTctMjEuNDM2LTQ3Ljk1Ny00OS40OTMgMC0yOC4wMjQgMjAuNzg3LTQ5LjQ5NCA0Ny45NTctNDkuNDk0eiIgZmlsbD0iIzExNzRFRiIvPjwvc3ZnPg==");
            --vbnICON-URL-ComfyUI: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iNDA5LjU4NyAzMDcuMiAxODQzLjIyMyAxODQzLjIwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0ibTIwMzguMjczIDMwNy4yIDIzLjk2IDEuMDI1YzU1LjYwNSA1LjEyIDEwOC44NSAyOC4yNjIgMTQ2Ljk0NSA3NS4xNiA0MC4yNDMgNDkuMzU3IDUwLjY4OCAxMTEuNDEyIDM5LjMyMiAxNjkuMzdsLTYuMTQ1IDI0LjU3NS03Ny44MjUgMjUxLjQ5NWMtMTkuOTY4IDY0LjMwOC02NC4xIDExNy41NTUtMTE0Ljg5MiAxNTQuMTEzLTUwLjc5IDM2LjU1Ny0xMTUuMDk3IDYxLjQ0LTE4Mi4yNyA2MS40NGwtMzcyLjEyNS44MmgtMTQwLjlsLTExNC4yNzggMzY3LjQxIDE4Mi4zNzUtLjMwN2gyNzEuMzU4YzY0LjEwMiAwIDEyNy40OSAyMi42MyAxNzEuMDEgNzYuMjkgNDUuOTc1IDU2LjQyIDUyLjk0IDEyOS41MzUgMzMuMDc1IDE5My45NDVsLTc3LjgyNSAyNTEuMzkzYy0xOS45NjggNjQuNDA3LTY0LjEgMTE3LjY1Ny0xMTQuNzkgMTU0LjIxMy01MC44OTIgMzYuNjYtMTE1LjIgNjEuNDQtMTgyLjQ3NSA2MS40NHYuMTAzbC0zNzIuMDIyLjcxN0g4NzkuNDFjLTY0LjMwNSAwLTEyNy4zODUtMjIuODM1LTE3MC45MDUtNzYuMTg1LTQ1Ljg3NS01Ni41MjUtNTIuOTQtMTI5LjY0LTMzLjA3NS0xOTQuMDVsMzAuNjE3LTk4LjgxNWgtODEuOTJjLTY0LjMwOCAwLTEyNy40ODctMjIuODM1LTE3MS4wMDgtNzYuMTg1di0uMjA1Yy00NS44NzUtNTYuNDIyLTUyLjk0LTEyOS4zMy0zMy4wNzUtMTkzLjc0di0uMjA1TDU5My42MTIgOTUyLjYzbDE5LjE1LTYxLjQ0YzE5Ljk2OC02NC4zMDggNjQtMTE3LjM1IDExNC42ODgtMTU0LjAxIDUwLjg5Mi0zNi42NiAxMTUuMi02MS43NDggMTgyLjQ3NS02MS43NDhoMTQwLjhsNDYuOS0xNTEuODZjMTkuODY1LTY0LjMwNSA2NC0xMTcuNTU1IDExNC43OS0xNTQuMjEzIDUwLjg5NS0zNi42NiAxMTUuMzAzLTYxLjQ0IDE4Mi40NzctNjEuNDRsMzcxLjUwOC0uNzE3aDI3MS45NzV6TTEzOTUuMiA0OTIuMDMyaC0uMjA1YTEzMy4xMyAxMzMuMTMgMCAwIDAtNzQuNzUgMjYuODI4Yy0yMS44MTMgMTUuNzctMzYuNTU3IDM0LjgxNy00My44MyA1MS45MTdsLTIuNjYyIDcuMTY4TDEyMTYuNDEgNzYzLjdjLTE4Ljg0MyA2MC45MjUtNzUuNzc1IDk2LjA1LTEzMi43MSA5Ni4wNUg5MDkuOTI1Yy0yMi4zMjMgMC00OS43NjUgOC45MS03NC41NDUgMjYuODMtMjQuOTg3IDE4LjAyMy00MC43NTUgNDAuMzQ1LTQ2LjU5MyA1OS4yOXYuMWwtMTkuMjUgNjEuMjM4LTE3My40NjggNTU4LjI4M2E0MSA0MSAwIDAgMC0xLjk0NSAxNy45MiAxMS4yNSAxMS4yNSAwIDAgMCAyLjA1IDUuNDI3bDIuMDQ1IDEuOTQ4YzMuMDc1IDIuNTYgMTAuMjQgNi4xNDMgMjUuOTA3IDYuMTQzaDE0NS4xYzE1LjM2MiAwIDMwLjUxOCAyLjQ1OCA0NS4wNTcgNy4zNzVsMTQuMzM1IDUuNzMyIDEzLjcyMyA3LjE2OGExMzguOCAxMzguOCAwIDAgMSAyNC42NzggMTkuMTVsMTAuNzUzIDExLjU3LjEwMy4zMDdhMTMyLjMgMTMyLjMgMCAwIDEgMjMuMjQ1IDQyLjI5M2w0LjIgMTUuODcgMi4yNSAxNi4zODVjLjcxNyAxMC44NTUuMjA1IDIxLjgxMy0xLjc0IDMyLjU2M2wtMy44OSAxNS45NzUtNTAuMzgyIDE2My4yMjVhNDEuMjUgNDEuMjUgMCAwIDAtMi4wNDcgMTcuODE3IDExLjUgMTEuNSAwIDAgMCAxLjg0MyA1LjQyN2MxLjQzNSAxLjg0NSA3LjE3IDguMTkzIDI4LjA1OCA4LjE5M2gyNzAuOTVsMzcyLjIyNS0uNjE1YzIyLjUyNyAwIDUwLjA3NS04LjkwOCA3NC45NTctMjYuODI4IDI0Ljg4My0xOC4wMjUgNDAuNTUtNDAuMTQyIDQ2LjM4OC01OC45ODNsNzcuODI1LTI1MS40OTVhNDEuMjUgNDEuMjUgMCAwIDAgMi4wNDctMTcuODE3IDE0IDE0IDAgMCAwLTEuMDI1LTMuNjg4bC0xLjAyNS0xLjc0Yy0xLjQzMi0xLjc0LTYuOTYzLTguMTkzLTI4LjA1OC04LjE5M0gxNDIyLjg1bC0yNDYuMDY4LjUxMmMtNDAuOTYgMC04MS40MDctMTcuOTItMTA4LjU0My01MC44OTJsLS4yMDUtLjMwN2ExMzMuNzUgMTMzLjc1IDAgMCAxLTI0LjA2NS0xMjMuMzkybDE0NC43OTUtNDY1LjgxNy4yMDUtLjUxMmM5LjIxNS0yOS4wOCAyNy45NTUtNTMuNDUgNTEuOTE1LTcwLjI0NWw5LjIxNy01LjgzOGMyMS44MS0xMi44IDQ2LjQ5LTE5LjI1IDcxLjM3My0xOS4yNWgxNzMuNDY1bDM3Mi4xMjItLjcxN2guMjA1bDguNi0uNDFjMjAuNTgzLTIuMDQ3IDQ0LjM0LTEwLjc1IDY2LjA1LTI2LjQyIDI1LjA4Ny0xOC4wMiA0MC43NTUtNDAuMjQzIDQ2LjU5LTU4Ljk4bDc3LjYyLTI1MS40OTVhNDEuMjUgNDEuMjUgMCAwIDAgMi4wNS0xNy44MTcgMTEgMTEgMCAwIDAtMS45NS01LjQyN2wtMi4wNDUtMi4wNWEyOCAyOCAwIDAgMC0xMi44LTQuOTEzbC0xMy4xMDgtMS4xMjdIMTc2Ni40bC0zNzEuMzAyLjUxMnoiIGZpbGw9IiMxMjJCRDUiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guc2VhcmNoX2luZGV4LjAuaTQuNmU2MzNhODFubGl0SjAiLz48L3N2Zz4=");
            --vbnICON-URL-Workflow: url("data:image/svg+xml;base64,PHN2ZyB0PSIxNzUzNTM2MDE3MjEyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMjIuMzY1NDQ3OTk4MDQ2ODc1IDAuMTczMzc3OTkwNzIyNjU2MjUgOTc5LjMwNTI5Nzg1MTU2MjUgMTAyMy44MjY2NTI1MjY4NTU1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iNDU0NCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiPjxwYXRoIGQ9Ik05MzkuNDU5ODIxIDY1Ni4zODA5MTdjLTQ5LjQ1NDkzMy0yOC45NTYyODYtMTExLjc1MjEyNC0xOS41ODYxMTItMTUxLjAxMzM3NSAyMi43NDY1OTktMzkuMjYxMjUyIDQyLjMzMjcxLTQ1LjM4MTkxMiAxMDYuNjk5Nzk3LTE0LjgwMDg2OSAxNTYuMDIxMTg4LTEyMi4zOTA5NDQgMTE4LjUxODIzNS0zMDUuOTIxNzE3IDE0MC43MDg0MS00NTEuNzQ5MjI0IDU0LjU3NDAzMWEzOS4zMDU3NjYgMzkuMzA1NzY2IDAgMCAwLTU0LjQ4NTAwMyAxNS4wMDExODFjLTEwLjk5NDkzMSAxOS41ODYxMTItNC40NTEzODkgNDQuNjQ3NDMzIDE0LjYyMjgxMyA1NS45NTM5NjFhNDU4LjUxNTMzNiA0NTguNTE1MzM2IDAgMCAwIDg3LjQyNTI4MiA0MC4xMjkyNzNBNDQ0LjU2MDIzMSA0NDQuNTYwMjMxIDAgMCAwIDUxMS4zNjk3MyAxMDIzLjk5ODg4N2MxMjIuMDU3MDkgMC4yNjcwODMgMjM5LjM1MTE5My00OC43NDI3MTEgMzI2LjU3NjE2My0xMzYuNDU3MzMzIDYwLjI0OTU1MiAyMC44MzI1MDEgMTI2LjA2MzM0LTguNDU3NjM5IDE1Mi40ODIzMzQtNjcuODM5MTcgMjYuNDE4OTk0LTU5LjM4MTUzMSA0Ljg3NDI3MS0xMjkuNjQ2NzA4LTQ5LjkyMjMyOS0xNjIuNzY1MDQzbC0xLjA0NjA3Ny0wLjU1NjQyNHogbS0yMy42NTkxMzMgMTMzLjE4NTU2MmE0NC40NDcxMiA0NC40NDcxMiAwIDAgMS0zOC41MjY3NzMgMjIuOTI0NjU0IDQyLjcxMTA3OSA0Mi43MTEwNzkgMCAwIDEtMjIuMDU2NjMzLTYuMDA5Mzc1IDQ2LjA3MTg3NyA0Ni4wNzE4NzcgMCAwIDEtMjAuODMyNTAxLTUxLjQxMzU0NGM1LjIzMDM4Mi0yMC4wMzEyNTEgMjIuOTY5MTY4LTMzLjg3NTA3MSA0My4xNTYyMTgtMzMuNzQxNTMgNy43NDU0MTctMC4wNDQ1MTQgMTUuMzU3MjkyIDIuMDI1MzgyIDIyLjAzNDM3NiA2LjAwOTM3NiAyMS4yMTA4NjkgMTIuNTk3NDMxIDI4LjQ2NjYzMyA0MC40NDA4NyAxNi4yNDc1NyA2Mi4yMzA0MTl6IG0tNjYxLjkyMTU2MS04Ni41MTI3NDdjLTIyLjE2NzkxOC0zOS41MjgzMzUtNjMuMjA5NzI1LTYzLjg3NzQzNC0xMDcuNjM0NTg5LTYzLjg3NzQzNGgtNi4zODc3NDNDMTAxLjM3NDUzNiA0NzAuODQ3MDE5IDE3NC44ODkyMjcgMjk2LjQ2Mzg1IDMyMC44MjgwMTkgMjEwLjE5NTkyOWMxOS4wNzQyMDItMTEuMzA2NTI4IDI1LjYxNzc0NC0zNi4zNjc4NDkgMTQuNjIyODEzLTU1Ljk1Mzk2MWEzOS4zMDU3NjYgMzkuMzA1NzY2IDAgMCAwLTU0LjQ4NTAwMi0xNS4wMDExODFjLTE4MC44MTU0MjYgMTA2Ljg1NTU5Ni0yNjkuMzA5MDQxIDMyNS4wODQ5NDctMjE1Ljc1ODgzMSA1MzIuMTYzNTY4LTQ5LjQ5OTQ0NyA0NC4wNjg3NTItNTcuMTU1ODM2IDEyMC4wMzE3MDctMTcuNDcxNzAyIDE3My41NTk2NjIgMzkuNjg0MTM0IDUzLjUwNTY5NyAxMTMuMDQzMDI3IDY2LjEyNTM4NSAxNjcuNTUwMjg2IDI4LjgyMjc0NSA1NC40ODUwMDMtMzcuMzAyNjQxIDcxLjQwMDI4MS0xMTEuNjg1MzUzIDM4LjU3MTI4Ny0xNjkuODg3MjY2di0wLjgyMzUwN3ogbS04NS4zMTA4NzIgMTAzLjE2MDk0M2MtMjEuMjEwODY5IDEyLjU3NTE3NC00OC4zMTk4MjkgNS4xMTkwOTctNjAuNTgzNDA2LTE2LjY0ODE5NmE0Ni42MjgzMDEgNDYuNjI4MzAxIDAgMCAxLTUuMDk2ODQxLTM1LjM0NDAyOSA0NS40MDQxNjkgNDUuNDA0MTY5IDAgMCAxIDIxLjI5OTg5Ny0yOC4yNjYzMjFjMjEuMjEwODY5LTEyLjU1MjkxNyA0OC4zMTk4MjktNS4xMTkwOTcgNjAuNTgzNDA2IDE2LjY3MDQ1MiA2LjM4Nzc0MyAxMC41OTQzMDYgOC4yNzk1ODQgMjMuNDM2NTY0IDUuMjMwMzgyIDM1LjQ5OTgyOGE0NS40MDQxNjkgNDUuNDA0MTY5IDAgMCAxLTIxLjQzMzQzOCAyOC4zNTUzNDl2LTAuMjY3MDgzeiIgZmlsbD0iIzM1M0E1MyIgcC1pZD0iNDU0NSIvPjxwYXRoIGQ9Ik01MjMuNDMyOTk1IDI1NC42MjA3OTNjNDUuOTYwNTkzLTAuMTU1Nzk5IDg3LjkzNzE5Mi0yNy4xMDg5NiAxMDguNjEzODk0LTY5LjczMTAxMSAxNTkuNzE1ODQxIDQ5LjU2NjIxOCAyNjkuMDE5NzAxIDIwMi4yOTMzNzggMjY4LjY0MTMzMyAzNzUuMzYzMzg3IDAgMjIuNTY4NTQzIDE3LjYyNzUwMSA0MC44NjM3NTIgMzkuMzcyNTM3IDQwLjg2Mzc1MiAyMS43MjI3NzkgMCAzOS4zNTAyOC0xOC4yOTUyMDkgMzkuMzUwMjgtNDAuODYzNzUyIDAuMjIyNTY5LTIxMy41MzMxMzYtMTM3LjM5MjEyNS00MDAuNzM2MzA1LTMzNS44MzUwNTItNDU2LjgyMzgwOC0xMi4xNzQ1NDktNjUuOTQ3MzMtNzEuNjY3MzY1LTExMC43MDYwNDctMTM1LjgxMTg4Mi0xMDIuMjI2MTUxLTY0LjE2Njc3NCA4LjUwMjE1My0xMTAuOTI4NjE3IDY3LjMyNzI2LTEwNi43ODg4MjUgMTM0LjM0MjkyNCA0LjE2MjA0OSA2Ny4wMzc5MiA1Ny43NTY3NzQgMTE5LjE2MzY4NyAxMjIuNDU3NzE1IDExOS4wNzQ2NTl6IiBmaWxsPSIjMjU1Q0ZGIiBwLWlkPSI0NTQ2IiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4LnNlYXJjaF9pbmRleC4wLmkxLjcxZGYzYTgxSUR2Y3RBIiBjbGFzcz0ic2VsZWN0ZWQiLz48cGF0aCBkPSJNNTEyLjAxNTE4MiA4OS4yMDcxNzNhNDQuNTEzODkxIDQ0LjUxMzg5MSAwIDEgMSAwIDg5LjAyNzc4MyA0NC41MTM4OTEgNDQuNTEzODkxIDAgMCAxIDAtODkuMDI3NzgzeiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iNDU0NyIvPjwvc3ZnPg==");
            
            --vbnICON-URL-Tick: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIxOS41MzE5OTk1ODgwMTI2OTUgMTkuNTMxOTk5NTg4MDEyNjk1IDg3LjUxOTAwNDgyMTc3NzM0IDg3LjUxOTAwNDgyMTc3NzM0IiBjbGFzcz0icHJvZHVjdExvZ29fXzFMUkgiPjxwYXRoIGQ9Im01MC4xMTcgNTIuNjQyIC03LjI5NyA4Ljg4NiAxNy4yODggMTQuMTc3YTUuNzU5IDUuNzU5IDAgMCAwIDguMTM2IC0wLjg1MWwzMS4wMDkgLTM4LjcxOCAtOC45NzggLTcuMTg3IC0yNy4zNjcgMzQuMTc0eiIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjRkZCMDAwIi8+PHBhdGggZD0iTTYzLjI5MSA5Ny4yMDZjLTE4LjcwMyAwIC0zMy45MTUgLTE1LjIxNSAtMzMuOTE1IC0zMy45MTVTNDQuNTkyIDI5LjM3NyA2My4yOTEgMjkuMzc3VjE5LjUzMkMzOS4xNjEgMTkuNTMyIDE5LjUzMiAzOS4xNjEgMTkuNTMyIDYzLjI5MVMzOS4xNjEgMTA3LjA1MSA2My4yOTEgMTA3LjA1MSAxMDcuMDUxIDg3LjQyMSAxMDcuMDUxIDYzLjI5MWgtOS44NDVjMCAxOC43MDMgLTE1LjIxNSAzMy45MTUgLTMzLjkxNSAzMy45MTUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzQ3NzJGQSIvPjwvc3ZnPg==");
            --vbnICON-URL-Tick-Vint: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSI3Ny4xNTAwMDE1MjU4Nzg5IDc3LjE1MDAwMTUyNTg3ODkgMzQ1LjcwMDAxMjIwNzAzMTI1IDM0NS43MDAwMTIyMDcwMzEyNSIgY2xhc3M9InByb2R1Y3RMb2dvX18xTFJIIj48cGF0aCBkPSJtMTk3Ljk2MyAyMDcuOTM4IC0yOC44MjUgMzUuMSA2OC4yODcgNTZhMjIuNzUgMjIuNzUgMCAwIDAgMzIuMTM4IC0zLjM2M2wxMjIuNDg3IC0xNTIuOTM4IC0zNS40NjMgLTI4LjM4NyAtMTA4LjEgMTM0Ljk4N3oiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzM1Q0M3QiIvPjxwYXRoIGQ9Ik0yNTAgMzgzLjk2MmMtNzMuODc1IDAgLTEzMy45NjMgLTYwLjEgLTEzMy45NjMgLTEzMy45NjNTMTc2LjEzNyAxMTYuMDM3IDI1MCAxMTYuMDM3Vjc3LjE1QzE1NC42ODggNzcuMTUgNzcuMTUgMTU0LjY4OCA3Ny4xNSAyNTBTMTU0LjY4OCA0MjIuODUgMjUwIDQyMi44NSA0MjIuODUgMzQ1LjMxMyA0MjIuODUgMjUwaC0zOC44ODhjMCA3My44NzUgLTYwLjEgMTMzLjk2MyAtMTMzLjk2MyAxMzMuOTYzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiM0NzcyRkEiLz48L3N2Zz4=");
            --vbnICON-URL-YUQUE: url("data:image/svg+xml;base64,PHN2ZyB0PSIxNzQzOTQ5MDMzNTU4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iOC43NzgxMjU3NjI5Mzk0NTMgOC43Nzg5NTI1OTg1NzE3NzcgMTA5OS4yNDAwMzIxOTYwNDUgMTAwNi4xNjUzODMzMzg5MjgyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iNjAyMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiPjxwYXRoIGQ9Ik0xMTA4LjAxODE1MDE5IDE1Mi4yMzM3MDgzOGwtODkuNzI2ODE5MDQtNC44OTA2ODc1OVM5ODQuMzU1MzA2MDEgMjUuODU0MjUyMzYgODI4LjYwNTE4NzM0IDE0Ljk1NDM4Nzk0QzY3Mi44NTYwNTE1NSA0LjA1NzQ3MjA4IDU3MC45NDc3MjQ4NyAxMC44OTkxMjcyOCA1NzAuOTQ3NzI0ODcgMTAuODk5MTI3MjhzMTE1LjUzMjY2NTc4IDc1LjA0Njg5MzQyIDY5LjIzMjMyMTkyIDIwOC45NjE5MDA0NWMtMzQuNDAxODk4NTIgNzIuMjI3MDgxNzktODguODI4NDg5MzYgMTMxLjI0MDY1Nzk1LTE0Ni44NTgyMjc0NSAxOTkuMDYzNTY1NDlsLTM4My43MTY1MDc3IDQ0Ni44MzU0NzAxM2MzNTcuMTk2MTI1MjEtNS4zNDM3ODM4NSA1NjcuNzg0NjUxMDQtOC4wMTcxNTAwNiA2MzEuNzY4NTI2MDctOC4wMTcxNTAwNiAxNzkuNDMzOTgwOTcgMCAzMzEuMDc3NzMwNTEtMTU4Ljc3NzMxMjc0IDMyNC44NzI5NjU0OS0zMzUuNDM3Njc2MjctNC4yNjY1NzQ1Mi0xMjEuNDEzMDg4NTgtNDIuMTQ5NzQ2MjUtMTQ4Ljg0NTU2MDcyLTU1LjE3MTU5NTEtMjAyLjAxOTk5NDAxLTEzLjAxNjkzNDU3LTUzLjE3NTQxNjE1IDEzLjA0MjQ4ODgyLTEzNy45NzQxOTkwOSA5Ni45NDI5NDIwOS0xNjguMDUxNTM0NjN6IiBmaWxsPSIjMzFDQzc5IiBwLWlkPSI2MDIxIi8+PHBhdGggZD0iTTQ5MS43NTUxNDgxMSA0MjAuMzY4NDA3NTRDMzAzLjk0MTM0MzUgNjM2Ljc5ODA0MTk3IDguNzc4MTI1NzEgOTgxLjE1MTE5Nzk3IDguNzc4MTI1NzEgOTgxLjE1MTE5Nzk3YzUzMS4wMDMyNjAwMyAxNDIuMjA4MzM5MzkgNzc1LjY1NjU2NTA1LTIwMi45MzExMDA3OSA4MTMuOTY3Mjc4OC0zMjIuNDE1ODI3NDIgNTEuMzYyMDQ4MjUtMTYwLjE5ODUyMTQtMjEuMjEwMDE1NzItMjM4LjM2ODkyODcyLTYyLjI4MzUzNTUtMjYzLjg2MjIyNzUxLTEzOS4yNjI3MjIyOS04Ni40MzgxODU0Ny0yNDIuNTg5MzA5MDUtNC42MDM2OTM4Ny0yNjguNzA2NzIwOSAyNS40OTMyOTg3OXoiIGZpbGw9IiM5M0U2NUMiIHAtaWQ9IjYwMjIiLz48cGF0aCBkPSJNNDk0LjM2MjY2MzAyIDQxNS4zNzM1MzczYzI5Ljc5MzI5MDM4LTMyLjE0OTE5NDM1IDEzMS4wNzg0ODY4NC0xMDYuOTI4NzUxMTUgMjY2LjE3ODgxNzI3LTIyLjc0MTMwNDE3IDQxLjA3NzQ1MTE5IDI1LjU5MzU1MDAxIDExMy42NTM0NDY1OSAxMDQuMDc5NDUzODYgNjIuMjg3NDY2OTEgMjY0LjkzMTU3NC0xNC44ODA0MjgwOCA0Ni42MDUwMjg5OC02MC45MDI2MjM5IDEyNy4zOTQ3NDU0Ny0xNDIuNzUyODQxMTkgMjAwLjQwNzEyODU3LTg0Ljg3NDQ2MjggMC41ODI4MzMxNC0yNzUuMzY2NTQ3ODkgMy4wOTAwOTY4MS01NzEuNDg1MTAwOTYgNy41MzE2MTk1OEw0NzQuNjEyMTg3MzEgNDM4LjMxNzMwOTYyYTg0MDUuNzMzNjYyNTYgODQwNS43MzM2NjI1NiAwIDAgMSAxOC45MzQ3MDU4OC0yMi4wNjIxNTExOXoiIGZpbGw9IiM2MERCNjkiIHAtaWQ9IjYwMjMiLz48L3N2Zz4=");
            --vbnICON-URL-YUQUE-Line: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0iTTUxMS40MDcgMjEuMTU1aDEwLjAxMmw5LjkwNS4wNiAxNC41MzQuMTE3IDE0LjEwNC4xMTkgOS4yMDQuMTE4IDkuMDQ0LjExOCAxMy4yOTYuMjM2IDEyLjkyLjI5NiAxMi41OTUuMjk1IDEyLjIyLjQxNCAxMS44NDIuNDE0IDcuNjk4LjI5NSA3LjUzNi4zNTUgMTEuMDM1LjU5MSA3LjE2LjM1NSA2Ljk5Ny40MTMgNi44MzcuNDE0IDYuNjc1LjQ3MyA2LjU2Ny40NzMgOS40NzQuNzY4IDYuMTkuNTkxIDUuOTc2LjU5MSA1Ljg2Ny41OTEgNS43MDYuNTkxIDUuNTQ0LjU5MSA1LjM4My43MSAyLjY5Mi4zNTQgNy42NDQgMS4wNjQgNy4zNzQgMS4wNjQgNC43MzguODI3IDQuNTc1Ljc2OSA0LjQ2OC44MjcgNC4zMDYuODg3IDQuMDkxLjgyNyA0LjAzOC45NDYgMy44MjIuOTQ1IDMuNzY4Ljk0NmM5LjY4OSAyLjU0MSAxNy43NjMgNS40MzggMjQuNDkyIDguNjMgMzcuNDY2IDE3LjczIDY4LjA0MSA1MC43MSA5Mi4wNSA5Ny40MDFsLjY0NSAxLjM2aDM2LjkyOGM0MS42MSAwIDU3LjcwNSA1OS4xMDMgMjMuNjg1IDg0LjM0bC0zLjUgMi40ODNjLTEyLjkxOCA5LjQ1Ni0yNS44MzggMjEuNjktMzguNTk1IDM2Ljg4bC0xLjQgMS42NTVjLTcuMzIgOS4xNjEtMTEuMDM1IDE4LjMyMi0xMi43NTggMzMuNTdsLS4yNjkgMi44MzgtLjI2OSAyLjk1NS0uMTA3IDEuNTk2LS4xNjIgMy4yNS0uMTYxIDMuMzd2MS43NzJsLS4xNjIgMy42NjV2My44NDFsLS4wNTQgNC4wMnYyLjcxOGwuMTA4LjU5MS4yMTUuODg3LjQzIDEuNDE4LjY0NyAxLjg5Mi45NjkgMi40MjMgMS41MDcgMy42NjQgMi4wNDYgNC43MjggNC4wOSA5LjI4IDcuMzc1IDE2LjE5NGMyMi4wNyA0OC43NiAzMy4wNTIgODguMzYgMzMuMDUyIDEzOS45NTcgMCA5OC4xNy0yNS42MjMgMTc1LjM2LTc2LjAwOCAyNDIuMDg3LTUxLjY3NyA2OC41Ni0xNDcuMjI1IDEyMi42NC0yMjkuMzY5IDEyMi42NGgtNzIuMjRjLTM5LjE4OCAyOC45Ni04MS44NzUgNTMuOTYtMTI2LjMzOCA3My4xNy0xMTAuNDYgNDcuNjk2LTI0MC42MiA1My4xOTItMzg5Ljg5IDE3LjczQTU4Ljg5IDY0LjY2IDAgMCAxIDQyLjQ0IDg2Ny44MWw0NS4wMDItNTYuMzg0YTQ0LjM1NiA0OC43MDEgMCAwIDEgMy43NjgtNS40MzhsMTI1LjkxLTE1Ni42ODMgNjkuMTcyLTg2LjUyN0wzODkuNTkgNDMzLjkzM2wzMS41OTgtMzkuMzA0IDE1LjA3My0xOC44NTQgMTMuNDU3LTE3LjAyMiAyMi45ODUtMjkuMzE1IDUuMTY4LTYuNzM4IDMuMzM3LTQuMzE0IDMuMjMtNC4yNTYgMy4wNjktNC4xMzcgMy4wMTQtNC4wNzggMi45MDctMy45NiAyLjc5OS0zLjkgMi42OTItMy44NDMgMS4yOTEtMS44OSAzLjIzLTQuNjEgMi45Ni00LjU1MiAyLjMxNi0zLjU0NiAyLjIwNy0zLjQ4NyAxLjA3Ni0xLjcxNCAyLjA0Ni0zLjM3IDEuOTkxLTMuMzY4IDEuODg0LTMuMjUgMS43NzctMy4yNTFhMTQ1IDE0NSAwIDAgMCA0Ljg0NS05LjQ1N2wxLjUwNy0yLjk1NSAxLjM0NS0zLjA3My42NDYtMS40NzggMS4yMzktMi45NTVhMTAyLjI3NyAxMTIuMjk2IDAgMCAwIDkuNDc0LTQ3LjA0NmMwLTMxLjY4LTE1LjI4OC02MC4xNjgtNDkuOS04Ny43NjlsLTIuOC0yLjI0NmMtMzIuMDI5LTI2LjQxOS0xNS4xOC04My4wNCAyNS4zNTQtODMuMDRtMTAzLjY3NiAzNzQuNTk3Yy00MS4wNzItOC42ODgtODIuNjI4Ljk0Ni05OC4yOTMgMTkuOGwtMS44ODQgMi4yNDYtMTYuNTI2IDIwLjM5LTI5LjQ0NSAzNi41ODUtNDUuOTE3IDU3LjIxMkwyNjQuMjIgNzMwLjI3NyAxMzQuNzA2IDg5Mi4zMzhsMy4xMjIuNTkxYzExMi45MzUgMjAuNDUgMjEwLjMxMyAxMy4wMDMgMjkyLjU2NS0yMS43NWwyLjk2LTEuMjRDNTg3LjA5MyA4MDMuNTA1IDcxNS44IDY1NS45MjQgNzE1LjggNTUxLjA3NWMwLTQ4LjQ2NS0xMy40NTctODYuMjMyLTM2LjkyNy0xMTQuMDctMTguNjI1LTIyLjE2NC00My4wMS0zNi44OC02My43MzUtNDEuMjU0em0tOS40Mi0yODEuMDk1LjUzOCAxLjA2M2MxMC45ODIgMjQuMzUxIDE2LjY4OCA1MC41OTMgMTYuNjg4IDc4LjQ5IDAgMzYuODIxLTkuNDIgNzEuNTE1LTI2LjgwOCAxMDYuMjA4YTIzNCAyMzQgMCAwIDEgMzQuODgyIDQuNjFjMzguMjIgOC4wOTggNzguNzUzIDMyLjUwNyAxMDkuNjUyIDY5LjI3IDM3Ljc4OCA0NC45MTggNTkuMjEyIDEwNS4wMjYgNTkuMjEyIDE3Ni43NzggMCA3Ny4xODktNDAuNTMzIDE2MS4xNzQtMTA0LjY5OSAyMzUuMjkgNDguMzQtMTEuMjMgMTAwLjk4NS00NC45MTkgMTMwLjg2LTgzLjUxM2wxLjI5My0xLjcxNGMzNy45NS01MC4yMzggNTYuNjgzLTEwNi42MjIgNTYuNjgzLTE4My4yMiAwLTM0Ljc1My03LjUzNy02MS43MDQtMjQuMjI0LTk4LjcwM2wtMS42NjktMy42NjQtNC41NzUtOS44Ny00LjE5OS05LjI4LTEuODMtNC4xMzdhMjk0Ljg4IDMyMy43NjggMCAwIDEtMS42NjktNC4wMmwtMS41Ni0zLjcyM2EyMDUuMDkyIDIyNS4xODQgMCAwIDEtMS40NTQtMy42NjQgMTAyLjQzOCAxMTIuNDc0IDAgMCAxLTkuMzEzLTQ0LjU2NHYtMi43NzhsLjA1NC01LjQzNy4wNTQtMi43Mi4xNjEtNS4yNmMxLjE4NC0zOC45NDggNy4zNzUtNjYuNjY4IDIzLjg0Ny05Mi42NzNsLjc1My0xLjE4Mi0uNTM4LS41MzJhNDEuOTg3IDQ2LjEgMCAwIDEtNi45OTgtMTEuMjNsLS41MzgtMS4xODJjLTE3LjYwMi00Mi41NTQtMzguNDM0LTY4LjIwNS02MS45MDQtNzkuMzE3bC0xLjYxNS0uNzY4LTEuODg0LS43MS0xLjYxNS0uNTktLjgwOC0uMjk2LTEuNzc2LS41OS0xLjgzLS41OTItMS45OTItLjQ3My0yLjA0NS0uNTktMi4xNTQtLjUzMy0zLjQ5OS0uNzY4LTMuNjYtLjgyNy0zLjkzLS43MS00LjE5OC0uNzY4LTQuMzYtLjcxLTQuNjMtLjcwOS00Ljg0NS0uNjUtMy4zOS0uNDczLTYuOTk5LS44ODYtNy40MjgtLjgyOC03Ljg2LS43NjgtNi4xMzYtLjU5LTQuMTk5LS4zNTUtOC43NzQtLjcxLTYuNzgzLS40NzMtOS40Mi0uNjUtOS44NS0uNTktNy42NDUtLjQxNC0xMy4xODgtLjY1LTEwLjk4MS0uNDczLTE0LjI2NS0uNTkxLTExLjg0My0uMzU1eiIvPjwvc3ZnPg==");

            --vbnICON-URL-Dict: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJpY29uIiB2aWV3Qm94PSIwIDAuMDA1IDEwMjMuOTk2IDEwMjMuODY3IiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0iTTkzNC4xODMgMTc5Ljg4Nkg1NjEuMDIybDc4LjAzNyA2MjUuMTA3YTkzLjg3IDkzLjg3IDAgMCAxLTIyLjUyOCA2OC4yNjZsLTEzMS40NTYgMTUwLjYxM0g5MzQuMTRhOTAuMjQgOTAuMjQgMCAwIDAgODkuODU2LTg5Ljk0MVYyNzIuNDcyYTkyLjU4NiA5Mi41ODYgMCAwIDAtODkuNi05MC40NTJ2LTIuMTc2eiIgZmlsbD0iIzMxMzU0MyIgZGF0YS1zcG0tYW5jaG9yLWlkPSJhMzEzeC5zZWFyY2hfaW5kZXguMC5pMjcuM2Y5ODNhODFxa1RqcEkiLz48cGF0aCBkPSJNNDg4LjE0NyA3OS4xNUE5MC40OTYgOTAuNDk2IDAgMCAwIDM5OC4yOTIuMDA1SDkwLjMyNUE5MC4yOCA5MC4yOCAwIDAgMCAwIDkwLjIwMXY2NjguNTQxYTkwLjQ5NiA5MC40OTYgMCAwIDAgOTAuMzI1IDg5Ljk0MWg0NzMuM2M4LjUzMy05LjcyOCAxNi4zODMtMTYuNDI2IDE2LjM4My0yOS4yNjl6IiBmaWxsPSIjNEI4QkY1IiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4LnNlYXJjaF9pbmRleC4wLmkyMy4zZjk4M2E4MXFrVGpwSSIvPjxwYXRoIGQ9Im0zNTAuMDc5IDkwNi4yODMgNS4xMiA0MS4xM2E5MC41OCA5MC41OCAwIDAgMCA1MS4yIDY5Ljg4OGwxMDIuNjU1LTExMC45MzNIMzUwLjA3OXoiIGZpbGw9IiMzMTM1NDMiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guc2VhcmNoX2luZGV4LjAuaTI4LjNmOTgzYTgxcWtUanBJIi8+PHBhdGggZD0iTTMzMS4wOTIgMjM5LjAyMmEzMC4yMSAzMC4yMSAwIDAgMC0yOS44NjctMjQuMTkyaC02MS45OTRhMjkuMjcgMjkuMjcgMCAwIDAtMjkuMjcgMjQuMTkyTDE0OS44NDYgNTM5LjgyYTMwLjI5MyAzMC4yOTMgMCAxIDAgNTkuMDkzIDExLjc3NmwxOC45NDQtOTYuMTI4aDg0Ljc3OGwxOS40NTYgOTYuMTI4YTMwLjI1IDMwLjI1IDAgMCAwIDM1LjQxMyAyMy42Mzd2LTIuNTZhMzAuOTMgMzAuOTMgMCAwIDAgMjMuNjM3LTMyLjkzOXptLTkxLjg2MSAxNTMuNiAyNC42MTktMTIwLjMyaDEyLjhsMjMuNjM3IDEyMC4zMnptNjk2LjQ4OCA2MC4yNDRoLTkyLjQxNnYtMzAuMjkzYTMwLjI5MyAzMC4yOTMgMCAwIDAtNjAuMDMyIDB2MzAuMjkzaC04OS42YTI5Ljg3IDI5Ljg3IDAgMCAwLTIxLjMzMiA4LjUzNCAzMC4yMDggMzAuMjA4IDAgMCAwIDIxLjMzMyA1MS41ODNoNy42OGEzODguMyAzODguMyAwIDAgMCA3MC4zNTcgMTMxLjU4NGMtMjIuMDU5IDIwLjA1My00My42MDUgMzYuNTIyLTY2Ljc3MyA1NS40NjZhMjkuNCAyOS40IDAgMCAwLTExLjMwNyAyMC4wNTQgMzAuMjA4IDMwLjIwOCAwIDAgMCA0OC43NjggMjYuNjY2YzI1LjIxNi0yMC4wMSA0Ny4yMzItMzYuOTkyIDcxLjM4LTU5LjA5M2E3NjYgNzY2IDAgMCAwIDczLjM0NSA1OS4wOTMgMzAuMDM3IDMwLjAzNyAwIDAgMCAzNy40Ni00Ni45MzNjLTIzLjU5NC0xOS4wMy00Ny4yMzEtMzUuNDk5LTY5LjI5LTU1LjQ2NmEzODIuMyAzODIuMyAwIDAgMCA3MC44Ny0xMzEuNTg0aDguMTkxYTMwLjM4IDMwLjM4IDAgMCAwIDI4Ljg4Ni0xOC40NzQgMjkuMSAyOS4xIDAgMCAwIDIuNDc0LTExLjk5IDI5Ljg2NyAyOS44NjcgMCAwIDAtMjkuODY2LTI5Ljg2Nk04MTQuMjA1IDU5OS41MWEzMTIuMyAzMTIuMyAwIDAgMS01MS4yLTg2LjkxMkg4NjUuNjZhMzI4LjggMzI4LjggMCAwIDEtNTEuMiA4Ni45MTIiIGZpbGw9IiNGRkYiIG9wYWNpdHk9Ii42Ii8+PC9zdmc+");
            --vbnICON-URL-Markdown-Line: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDI1NjAgMjU2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0iTTIyOS45NzUgNDgwQzEwNS42IDQ4MCAwIDU4MC4yNjggMCA3MDUuMDY3djExNDkuODY1QzAgMTk3OS43MzMgMTA1LjYgMjA4MCAyMjkuOTc1IDIwODBoMjEwMC4wNUMyNDU0LjQgMjA4MCAyNTYwIDE5NzkuNzMzIDI1NjAgMTg1NC45MzNWNzA1LjA2N0MyNTYwIDU4MC4yNjcgMjQ1NC40IDQ4MCAyMzMwLjAyNSA0ODB6bTAgMTYwaDIxMDAuMDVjNDEuMTc1IDAgNjkuOTc1IDMwLjYxMiA2OS45NzUgNjUuMDY3djExNDkuODY1YzAgMzQuNDU2LTI4LjggNjUuMDY4LTY5Ljk3NSA2NS4wNjhIMjI5Ljk3NUMxODguOCAxOTIwIDE2MCAxODg5LjM4OCAxNjAgMTg1NC45MzJWNzA1LjA2N0MxNjAgNjcwLjYxMiAxODguOCA2NDAgMjI5Ljk3NSA2NDBNNDAwIDg4MHY4MDBoMjQwdi01MzIuNDhsMjQwIDMxNy40NCAyNDAtMzE3LjQ0VjE2ODBoMjQwVjg4MGgtMjQwbC0yNDAgMzIwLTI0MC0zMjB6bTEzNjAgMHY0MDBoLTI0MGwzNjAgNDAwIDM2MC00MDBoLTI0MFY4ODB6Ii8+PC9zdmc+");
            --vbnICON-URL-Markdown-Fill: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzQzNzU3Mzg3OTY3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEyODAgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyMDE2IiB3aWR0aD0iNjI1IiBoZWlnaHQ9IjUwMCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0xMTg3LjcgOTA1Ljg0SDkyLjNDNDEuNCA5MDUuODQgMCA4NjQuNDQgMCA4MTMuNTRWMjEwLjQ2YzAtNTAuOSA0MS40LTkyLjMgOTIuMy05Mi4zaDEwOTUuMzhjNTAuOSAwIDkyLjMgNDEuNCA5Mi4zIDkyLjN2NjAzLjA4YzAuMDIgNTAuOS00MS4zOCA5Mi4zLTkyLjI4IDkyLjN6IG0tODgwLTE4NC42di0yNDBsMTIzLjA4IDE1My44NCAxMjMuMDgtMTUzLjg0djI0MGgxMjMuMDhWMzAyLjc2aC0xMjMuMDhsLTEyMy4wOCAxNTMuODQtMTIzLjA4LTE1My44NEgxODQuNjJ2NDE4LjQ2aDEyMy4wOHpNMTEzMi4zIDUxMmgtMTIzLjA4VjMwMi43NmgtMTIzLjA4VjUxMmgtMTIzLjA4bDE4NC42MiAyMTUuMzhMMTEzMi4zIDUxMnoiIGZpbGw9IiMwMDAwMDAiIHAtaWQ9IjEyMDE3Ij48L3BhdGg+PC9zdmc+");
            
            --vbnICON-URL-AIGC: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjQuMDAwMiA0NUMyNy4yMjA4IDQ1IDMyLjcyNzYgNDAuOCAzMi43Mjc2IDI0QzMyLjcyNzYgNy4yIDI3LjIyMDggMyAyNC4wMDAyIDNDMjAuNzc5NyAzIDE1LjI3MjkgNy40ODMwMiAxNS4yNzI5IDI0QzE1LjI3MjkgNDAuNTE3IDIwLjc3OTcgNDUgMjQuMDAwMiA0NVoiIHN0cm9rZT0iIzFmYWNhZiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTUuMTA1MTUgMzUuMDAwMUM2LjcxNTQ1IDM3LjgxMjQgMTMuMjQ3OSA0MC40MjExIDI4LjM2NCAzMS42MjExQzQzLjQ4IDIyLjgyMTEgNDQuNTA1NyAxNS44MTI0IDQyLjg5NTQgMTMuMDAwMUM0MS4yODUxIDEwLjE4NzggMzQuNDk4MSA3LjcyNzI4IDE5LjYzNjcgMTYuMzc5MUM0Ljc3NTIxIDI1LjAzMDggMy40OTQ4OSAzMi4xODc4IDUuMTA1MTUgMzUuMDAwMVoiIHN0cm9rZT0iIzFmYWNhZiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTUuMTA1MDYgMTMuMDAwMUMzLjQ5NDggMTUuODEyNCA0LjUyMDQ2IDIyLjgyMTEgMTkuNjM2NiAzMS42MjExQzM0Ljc1MjcgNDAuNDIxMSA0MS4yODUgMzcuODEyNCA0Mi44OTUzIDM1LjAwMDFDNDQuNTA1NiAzMi4xODc4IDQzLjIyNTMgMjUuMDMwOCAyOC4zNjM4IDE2LjM3OTFDMTMuNTAyNCA3LjcyNzI4IDYuNzE1MzcgMTAuMTg3OCA1LjEwNTA2IDEzLjAwMDFaIiBzdHJva2U9IiMxZmFjYWYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+");
            --vbnICON-URL-Character: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwLjA3OSAxMTM4LjM5NiAxMDIzLjkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guc2VhcmNoX2luZGV4LjAuaTQzLjNmOTgzYTgxcWtUanBJIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0iTTU2OS4wMTcgODAwLjU3Yy01Ljc5My4xODItMTEuNDA2LTEuMDg2LTE2LjY1Ni0zLjQ0TDIxNC4zNTQgNjU1LjE5NGE0My41MSA0My41MSAwIDAgMS0yNy4xNTYtNDAuMzcyVjQzLjk5M2MwLTE0LjY2NCA3LjI0Mi0yOC40MjMgMTkuMTktMzYuNzUxIDEyLjMxMi04LjE0NyAyNy43LTkuNDE1IDQxLjA5Ny0zLjQ0bDE4NS41NjkgNzguMDNhNDMuNjEzIDQzLjYxMyAwIDEgMS0zMy4zMTIgODAuNTYzbC0xMjUuMS01Mi41MDJ2NDc1LjU5OWwyNTAuMzgyIDEwNS4wMDVWMTg1Ljc1YTQzLjUxIDQzLjUxIDAgMCAxIDI3LjE1Ni00MC4zNzNMODkwLjM2OCAzLjYyMWMxMy41NzgtNS40MzEgMjguNzg1LTQuMTY0IDQxLjA5NiAzLjQ0IDEyLjMxMSA4LjE0NyAxOS41NTMgMjIuMDg3IDE5LjE5IDM2Ljc1MVY2MTQuNjRhNDMuNTEgNDMuNTEgMCAwIDEtMjcuMTU1IDQwLjM3MmwtMTg0Ljg0NSA3Ny4xMjRjLTIxLjkwNiA4LjE0Ny00Ni4zNDctMi43MTUtNTUuNC0yNC4yNi04Ljg3LTIxLjcyNC43MjUtNDYuNTI3IDIyLjA4OC01Ni4zMDRMODYzLjAzIDU4NC45NVYxMDkuNTNMNjEyLjQ2NyAyMTQuNTM2djU0MS4xMzZjMCAxNC42NjQtNy4yNDEgMjguNDI0LTE5LjE5IDM2Ljc1Mi03LjA2IDUuMjUtMTUuNzUxIDcuOTY2LTI0LjQ0MSA3Ljk2NnoiIGZpbGw9IiMzQTgzOUIiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guc2VhcmNoX2luZGV4LjAuaTM3LjNmOTgzYTgxcWtUanBJIiBjbGFzcz0ic2VsZWN0ZWQiLz48cGF0aCBkPSJNNTY5LjAxNyAxMDIzLjk3N2MtNS4yNSAwLTEwLjMyLS45MDUtMTUuMjA4LTIuNTM0TDI3LjE1NiA4MTcuNDA4QzEwLjY4MiA4MTAuODkgMCA3OTQuNzc4IDAgNzc2Ljg1NFYyNjUuNTljMC0yMy41MzYgMTkuMDEtNDIuNTQ1IDQyLjU0NS00Mi41NDVTODUuMDkgMjQyLjA1NCA4NS4wOSAyNjUuNTlWNzQ2LjhsNDg0LjEwOCAxODcuNzQyIDQ4NC4xMDgtMTg3Ljc0MVYyOTkuOTg4YzAtMjMuNTM2IDE5LjAxLTQyLjU0NSA0Mi41NDUtNDIuNTQ1czQyLjU0NSAxOS4wMSA0Mi41NDUgNDIuNTQ1djQ3Ni44NjZjMCAxNy43NDItMTAuODYyIDMzLjY3NC0yNy4xNTYgNDAuNTU0bC01MjYuNDcyIDIwNC4wMzVjLTQuODg4IDEuODEtMTAuMTM5IDIuNzE1LTE1LjIwOCAyLjUzNHoiIGZpbGw9IiMzQTgzOUIiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guc2VhcmNoX2luZGV4LjAuaTM4LjNmOTgzYTgxcWtUanBJIiBjbGFzcz0ic2VsZWN0ZWQiLz48L3N2Zz4=");
            --vbnICON-URL-Network: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOCAxMkMxMC4yMDkxIDEyIDEyIDEwLjIwOTEgMTIgOEMxMiA1Ljc5MDg2IDEwLjIwOTEgNCA4IDRDNS43OTA4NiA0IDQgNS43OTA4NiA0IDhDNCAxMC4yMDkxIDUuNzkwODYgMTIgOCAxMloiIGZpbGw9IiMxM0VDOTkiIHN0cm9rZT0iIzJDMkYzNSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwIDQyQzEzLjMxMzcgNDIgMTYgMzkuMzEzNyAxNiAzNkMxNiAzMi42ODYzIDEzLjMxMzcgMzAgMTAgMzBDNi42ODYyOSAzMCA0IDMyLjY4NjMgNCAzNkM0IDM5LjMxMzcgNi42ODYyOSA0MiAxMCA0MloiIGZpbGw9IiMxM0VDOTkiIHN0cm9rZT0iIzJDMkYzNSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTM4IDQ0QzQxLjMxMzcgNDQgNDQgNDEuMzEzNyA0NCAzOEM0NCAzNC42ODYzIDQxLjMxMzcgMzIgMzggMzJDMzQuNjg2MyAzMiAzMiAzNC42ODYzIDMyIDM4QzMyIDQxLjMxMzcgMzQuNjg2MyA0NCAzOCA0NFoiIGZpbGw9IiMxM0VDOTkiIHN0cm9rZT0iIzJDMkYzNSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIyIDI4QzI2LjQxODMgMjggMzAgMjQuNDE4MyAzMCAyMEMzMCAxNS41ODE3IDI2LjQxODMgMTIgMjIgMTJDMTcuNTgxNyAxMiAxNCAxNS41ODE3IDE0IDIwQzE0IDI0LjQxODMgMTcuNTgxNyAyOCAyMiAyOFoiIGZpbGw9IiMxM0VDOTkiIHN0cm9rZT0iIzJDMkYzNSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTM0IDEyQzM2LjIwOTEgMTIgMzggMTAuMjA5MSAzOCA4QzM4IDUuNzkwODYgMzYuMjA5MSA0IDM0IDRDMzEuNzkwOSA0IDMwIDUuNzkwODYgMzAgOEMzMCAxMC4yMDkxIDMxLjc5MDkgMTIgMzQgMTJaIiBmaWxsPSIjMTNFQzk5IiBzdHJva2U9IiMyQzJGMzUiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTExIDExTDE1IDE1IiBzdHJva2U9IiMyQzJGMzUiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTMwIDEyTDI4IDE0IiBzdHJva2U9IiMyQzJGMzUiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTM0IDMzLjVMMjggMjYiIHN0cm9rZT0iIzJDMkYzNSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTQgMzFMMTggMjciIHN0cm9rZT0iIzJDMkYzNSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=");
            --vbnICON-URL-SVG: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNjAwIDYwMCIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTE5My43NSAxMTIuNSA4Ny41IDE3NXYyNTBsMTA2LjI1IDYyLjVMMzAwIDU1MGwxMDYuMjUtNjIuNUw1MTIuNSA0MjVWMTc1bC0xMDYuMjUtNjIuNUwzMDAgNTB6TTMwMCA1MHYyNTBtMjEyLjUgMTI1TDMwMCAzMDBNODcuNSA0MjUgMzAwIDMwMG0wIDI1MFY0MjVtMjEyLjUtMjUwLTEwMCA2Mi41TTg3LjUgMTc1bDEwMCA2Mi41IiBzdHJva2U9IiMwOEUwQUQiIHN0cm9rZS13aWR0aD0iNTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==");
            --vbnICON-URL-Mecha: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00MSAxMy45OTk3TDI0IDRMNyAxMy45OTk3VjMzLjk5OThMMjQgNDRMNDEgMzMuOTk5OFYxMy45OTk3WiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTYgMTguOTk3NkwyMy45OTMyIDI0LjAwMDJMMzEuOTk1MSAxOC45OTc2IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTI0IDI0VjMzIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+");
            
            --vbnICON-URL-Music: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMjQyLjUgNjI0LjUgMjA3NC43NSAxMzExLjI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj48cGF0aCBkPSJNNDg3LjI1IDE5MzUuNzVIMjA3Mi41YzEzNC43NSAwIDI0NC43NS0xMTAuMjUgMjQ0Ljc1LTI0NC43NVY4NjkuMjVjMC0xMzQuNzUtMTEwLjI1LTI0NC43NS0yNDQuNzUtMjQ0Ljc1SDQ4Ny4yNWMtMTM0Ljc1IDAtMjQ0Ljc1IDExMC4yNS0yNDQuNzUgMjQ0Ljc1VjE2OTFjMCAxMzQuNSAxMTAuMjUgMjQ0Ljc1IDI0NC43NSAyNDQuNzUiIGZpbGw9IiMyNDIyMkQiLz48cGF0aCBkPSJNNDgzLjc1IDE5MzUuNzVIMjA2OWMxMy43NSAwIDI3LjUtMSA0MC43NS0yLjc1LTQxLTEyNy41LTE1Ny41LTIxOS41LTM0Mi0yMTkuNUg4NTEuNWMtMTg0Ljc1IDAtMzQzIDkyLjI1LTQwMS4yNSAyMjAuMjUgMTEgMS4yNSAyMi4yNSAyIDMzLjUgMm0zLjUtMzc5SDIwNzIuNWM2NS4yNSAwIDExOS01My43NSAxMTktMTE5di01NjguNWMwLTY1LjI1LTUzLjc1LTExOS0xMTktMTE5SDQ4Ny4yNWMtNjUuMjUgMC0xMTkgNTMuNzUtMTE5IDExOVYxNDM4Yy4yNSA2NSA1NCAxMTguNzUgMTE5IDExOC43NSIgZmlsbD0iI0Y2NiIvPjxwYXRoIGQ9Ik04NTEuNSAxMDQxLjVoODU3Yzk3LjI1IDAgMTc2Ljc1IDc5LjUgMTc2Ljc1IDE3Ni43NXMtNzkuNSAxNzYuNS0xNzYuNzUgMTc2LjVoLTg1N2MtOTcuMjUgMC0xNzYuNS03OS41LTE3Ni41LTE3Ni41IDAtOTcuMjUgNzkuNS0xNzYuNzUgMTc2LjUtMTc2Ljc1IiBmaWxsPSIjMjQyMjJEIi8+PHBhdGggZD0iTTE3MDguNSAxMDk2YzY3LjUgMCAxMjIgNTQuNzUgMTIyIDEyMiAwIDY3LjUtNTQuNzUgMTIyLTEyMiAxMjItNjcuNSAwLTEyMi01NC43NS0xMjItMTIyIDAtNjcuNSA1NC41LTEyMiAxMjItMTIybS04NTcgMGM2Ny41IDAgMTIyIDU0Ljc1IDEyMiAxMjIgMCA2Ny41LTU0Ljc1IDEyMi0xMjIgMTIyLTY3LjUgMC0xMjItNTQuNzUtMTIyLTEyMiAwLTY3LjUgNTQuNzUtMTIyIDEyMi0xMjJNNDczLjI1IDgxMWMyNCAwIDQzLjUgMTkuNSA0My41IDQzLjVzLTE5LjUgNDMuNS00My41IDQzLjUtNDMuNS0xOS41LTQzLjUtNDMuNSAxOS41LTQzLjUgNDMuNS00My41bTE2MTMuNS0yLjc1YzI0IDAgNDMuNSAxOS41IDQzLjUgNDMuNXMtMTkuNSA0My41LTQzLjUgNDMuNS00My41LTE5LjUtNDMuNS00My41IDE5LjUtNDMuNSA0My41LTQzLjVtNzcuNSA5MDUuMjVjMjYuMjUgMCA0Ny43NSAyMS41IDQ3Ljc1IDQ3Ljc1cy0yMS4yNSA0Ny43NS00Ny43NSA0Ny43NWMtMjYuMjUgMC00Ny43NS0yMS41LTQ3Ljc1LTQ3Ljc1czIxLjI1LTQ3Ljc1IDQ3Ljc1LTQ3Ljc1bS0xNzY4LjUgMGMyNi4yNSAwIDQ3Ljc1IDIxLjUgNDcuNzUgNDcuNzVTNDIyLjI1IDE4MDkgMzk1Ljc1IDE4MDljLTI2LjI1IDAtNDcuNzUtMjEuNS00Ny43NS00Ny43NS4yNS0yNi4yNSAyMS41LTQ3Ljc1IDQ3Ljc1LTQ3Ljc1IiBmaWxsPSIjRkZGIi8+PC9zdmc+");
            --vbnICON-URL-VideoPlay: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9InZpZGVvUGxheSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiPjxwYXRoIGQ9Ik0yNTAgMGM3Ny42OS43IDE0NCAyMC4xOSAxODYuNTUgNjMuNDVDNDc5LjgxIDEwNS45OSA0OTkuMyAxNzIuMzEgNTAwIDI1MGMtLjcgNzcuNjktMjAuMTkgMTQ0LTYzLjQ1IDE4Ni41NUMzOTQgNDc5LjgxIDMyNy42OSA0OTkuMyAyNTAgNTAwYy03Ny42OS0uNy0xNDQtMjAuMTktMTg2LjU1LTYzLjQ1QzIwLjE5IDM5NCAuNyAzMjcuNjkgMCAyNTBjLjctNzcuNjkgMjAuMTktMTQ0IDYzLjQ1LTE4Ni41NUMxMDYgMjAuMTkgMTcyLjMxLjcgMjUwIDAiIGZpbGw9IiM1MzVkZjciLz48cGF0aCBkPSJNMTkwLjk3IDE3OC4zMmMzLjE5LTIxLjY5IDE4LjgzLTM1LjAxIDM1LjczLTI0LjE1IDI5LjkxIDE5LjAyIDY0LjkyIDQ3LjI4IDEwMC4xIDcxLjg2IDIwLjU3IDE0LjQxIDIwLjU3IDMzLjU0IDAgNDcuOTUtMzUuMTggMjQuNTgtNzAuMTkgNTIuODMtMTAwLjEgNzEuODYtMTYuOTEgMTAuODYtMzIuNTQtMi40Ny0zNS43My0yNC4xNWE1ODYuNyA1ODYuNyAwIDAgMSAwLTE0My4zNiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjgiLz48L3N2Zz4=");
            --vbnICON-URL-VideoStop: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9InZpZGVvU3RvcCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiPjxwYXRoIGQ9Ik0yNTAgMGM3Ny42OS43IDE0NCAyMC4xOSAxODYuNTUgNjMuNDVDNDc5LjgxIDEwNS45OSA0OTkuMyAxNzIuMzEgNTAwIDI1MGMtLjcgNzcuNjktMjAuMTkgMTQ0LTYzLjQ1IDE4Ni41NUMzOTQgNDc5LjgxIDMyNy42OSA0OTkuMyAyNTAgNTAwYy03Ny42OS0uNy0xNDQtMjAuMTktMTg2LjU1LTYzLjQ1QzIwLjE5IDM5NCAuNyAzMjcuNjkgMCAyNTBjLjctNzcuNjkgMjAuMTktMTQ0IDYzLjQ1LTE4Ni41NUMxMDYgMjAuMTkgMTcyLjMxLjcgMjUwIDAiIGZpbGw9IiNmZjZiNmIiLz48cGF0aCBkPSJNMjQyLjMxIDM0Ni4xOGMtNTguOTkgMC04OC40OC0yOS40OS04OC40OC04OC40OHYtMTUuMzljMC01OC45OSAyOS40OS04OC40OCA4OC40OC04OC40OGgxNS4zOWM1OC45OSAwIDg4LjQ4IDI5LjQ5IDg4LjQ4IDg4LjQ4djE1LjM5YzAgNTguOTktMjkuNDkgODguNDgtODguNDggODguNDh6IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIuOCIvPjwvc3ZnPg==");
            --vbnICON-URL-Transition: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iVHJhbnNpdGlvbiIgdmlld0JveD0iMCAwIDUwMCA1MDAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj4KICA8cGF0aCBkPSJNMjUwIDBjNzcuNjkuNyAxNDQgMjAuMTkgMTg2LjU1IDYzLjQ1QzQ3OS44MSAxMDUuOTkgNDk5LjMgMTcyLjMxIDUwMCAyNTBjLS43IDc3LjY5LTIwLjE5IDE0NC02My40NSAxODYuNTVDMzk0IDQ3OS44MSAzMjcuNjkgNDk5LjMgMjUwIDUwMGMtNzcuNjktLjctMTQ0LTIwLjE5LTE4Ni41NS02My40NUMyMC4xOSAzOTQgLjcgMzI3LjY5IDAgMjUwYy43LTc3LjY5IDIwLjE5LTE0NCA2My40NS0xODYuNTVDMTA2IDIwLjE5IDE3Mi4zMS43IDI1MCAwIiBmaWxsPSIjNzM3ZGY0Ii8+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjUwIDI1MCkgc2NhbGUoMS4zKSB0cmFuc2xhdGUoLTI1MCAtMjUwKSI+CiAgICA8cGF0aCBkPSJNMjUwIDE0Ni42M2MyMi4yOSAwIDQzLjUgNi45OCA2MS4zNyAyMC4xOCAzLjExLTYuOTggMTAuMS0xMS44NCAxOC4yMy0xMS44NCAxMS4wMiAwIDE5Ljk1IDguOTMgMTkuOTUgMTkuOTV2NTAuMDVjMCA5Ljg1LTcuMTkgMTguMjItMTYuOTIgMTkuNzItOS43MyAxLjQ5LTE5LjEtNC4zNC0yMi4wNS0xMy43NC04LjM1LTI2LjU3LTMyLjY5LTQ0LjQzLTYwLjU3LTQ0LjQzcy01Mi4yMyAxNy44NS02MC41NyA0NC40M2MtMy4zIDEwLjUxLTE0LjUgMTYuMzUtMjUuMDEgMTMuMDVzLTE2LjM1LTE0LjUtMTMuMDUtMjUuMDFjNi41NS0yMC44NCAxOS4zLTM4Ljc5IDM2Ljg5LTUxLjkgMTcuOTUtMTMuMzkgMzkuMy0yMC40NiA2MS43NS0yMC40NlptNzkuNiAxMDguNDVjMS45OCAwIDMuOTkuMyA1Ljk4LjkyIDEwLjUxIDMuMyAxNi4zNSAxNC41IDEzLjA1IDI1LjAxLTYuNTUgMjAuODQtMTkuMyAzOC43OS0zNi44OSA1MS45LTE3Ljk1IDEzLjM5LTM5LjMgMjAuNDYtNjEuNzUgMjAuNDZzLTQzLjUtNi45OC02MS4zNy0yMC4xOGMtMy4xMSA2Ljk4LTEwLjEgMTEuODQtMTguMjMgMTEuODQtMTEuMDIgMC0xOS45NS04LjkzLTE5Ljk1LTE5Ljk1di01MC4wNWMwLTkuODUgNy4xOS0xOC4yMiAxNi45Mi0xOS43MiA5Ljc0LTEuNDkgMTkuMSA0LjM0IDIyLjA1IDEzLjc0IDguMzUgMjYuNTcgMzIuNjkgNDQuNDMgNjAuNTcgNDQuNDNzNTIuMjMtMTcuODUgNjAuNTctNDQuNDNjMi42OC04LjUyIDEwLjU0LTEzLjk3IDE5LjAyLTEzLjk3WiIgZmlsbD0iI2Y1ZjRmZiIgb3BhY2l0eT0iLjgiLz4KICA8L2c+Cjwvc3ZnPgo=");
            --vbnICON-URL-Info: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iSW5mbyIgdmlld0JveD0iMCAwIDUwMCA1MDAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj48cGF0aCBkPSJNMjUwIDBjNzcuNjkuNyAxNDQgMjAuMTkgMTg2LjU1IDYzLjQ1QzQ3OS44MSAxMDUuOTkgNDk5LjMgMTcyLjMxIDUwMCAyNTBjLS43IDc3LjY5LTIwLjE5IDE0NC02My40NSAxODYuNTVDMzk0IDQ3OS44MSAzMjcuNjkgNDk5LjMgMjUwIDUwMGMtNzcuNjktLjctMTQ0LTIwLjE5LTE4Ni41NS02My40NUMyMC4xOSAzOTQgLjcgMzI3LjY5IDAgMjUwYy43LTc3LjY5IDIwLjE5LTE0NCA2My40NS0xODYuNTVDMTA2IDIwLjE5IDE3Mi4zMS43IDI1MCAwIiBmaWxsPSIjM2Q5NmE2Ii8+PHBhdGggZD0iTTI0Ny4wMDggMTA5LjIxMmMxNi4xMjggMCAyOS4xOTYgMTMuMDY4IDI5LjE5NiAyOS4xOTZzLTEzLjA2OCAyOS4xOTYtMjkuMTk2IDI5LjE5Ni0yOS4xOTYtMTMuMDY4LTI5LjE5Ni0yOS4xOTYgMTMuMDY4LTI5LjE5NiAyOS4xOTYtMjkuMTk2bTQ0LjcxMiAyMzIuMjk2aC0xNS40OFYyMDguNjhjMC0xMy4wNTYtMTAuNTg0LTIzLjY0LTIzLjY0LTIzLjY0aC0yMi4zNTZjLTEzLjA1NiAwLTIzLjY0IDEwLjU4NC0yMy42NCAyMy42NHM5LjkgMjIuOTMyIDIyLjM1NiAyMy42MDR2MTA5LjIyNGgtMTUuNDhjLTEzLjA1NiAwLTIzLjY0IDEwLjU4NC0yMy42NCAyMy42NHMxMC41ODQgMjMuNjQgMjMuNjQgMjMuNjRoNzguMjI4YzEzLjA1NiAwIDIzLjY0LTEwLjU4NCAyMy42NC0yMy42NHMtMTAuNTg0LTIzLjY0LTIzLjY0LTIzLjY0WiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjgiLz48L3N2Zz4=");
            --vbnICON-URL-Safety: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iU2FmZXR5IiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiPgogIDxwYXRoIGQ9Ik0yNTAgMGM3Ny42OS43IDE0NCAyMC4xOSAxODYuNTUgNjMuNDVDNDc5LjgxIDEwNS45OSA0OTkuMyAxNzIuMzEgNTAwIDI1MGMtLjcgNzcuNjktMjAuMTkgMTQ0LTYzLjQ1IDE4Ni41NUMzOTQgNDc5LjgxIDMyNy42OSA0OTkuMyAyNTAgNTAwYy03Ny42OS0uNy0xNDQtMjAuMTktMTg2LjU1LTYzLjQ1QzIwLjE5IDM5NCAuNyAzMjcuNjkgMCAyNTBjLjctNzcuNjkgMjAuMTktMTQ0IDYzLjQ1LTE4Ni41NUMxMDYgMjAuMTkgMTcyLjMxLjcgMjUwIDAiIGZpbGw9IiMzZDk2YTYiLz4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNTAgMjUwKSBzY2FsZSgxLjMpIHRyYW5zbGF0ZSgtMjUwIC0yNTApIj4KICA8cGF0aCBkPSJtMzMyLjY2IDE2NC4zOS03My41My0yMS43NWgtLjAzYTMyLjI0IDMyLjI0IDAgMCAwLTE4LjExIDBoLS4wM2wtNzMuNjIgMjEuNzZjLTguNTQgMi41MS0xNC41MSAxMC40Ny0xNC41MSAxOS4zOHY0NC40OWMwIDI4LjM2IDguNTkgNTUuNjMgMjQuODUgNzguODcgMTYuMjMgMjMuMTkgMzguODQgNDAuNTkgNjUuNCA1MC4zMmEyMC4yIDIwLjIgMCAwIDAgMTMuODggMGMyNi41NS05LjczIDQ5LjE2LTI3LjEzIDY1LjM4LTUwLjMyIDE2LjI1LTIzLjIzIDI0Ljg0LTUwLjUgMjQuODQtNzguODV2LTQ0LjUxYzAtOC45MS01Ljk2LTE2Ljg3LTE0LjUxLTE5LjM4Wm0tMTkuNTkgNTcuODgtNjMuMjggNjMuMjhjLTIuMDYgMi4wNi00Ljc2IDMuMDktNy40NiAzLjA5cy01LjQtMS4wMy03LjQ2LTMuMDlsLTM2LjQ2LTM2LjQ2Yy00LjEyLTQuMTItNC4xMi0xMC44IDAtMTQuOTEgNC4xMi00LjEyIDEwLjgtNC4xMiAxNC45MSAwbDI5LjAxIDI5LjAxIDU1LjgyLTU1LjgyYzQuMTItNC4xMiAxMC44LTQuMTIgMTQuOTEgMCA0LjEyIDQuMTIgNC4xMiAxMC44IDAgMTQuOTFaIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIuOCIvPgogIDwvZz4KPC9zdmc+Cg==");
            
            --vbnICON-URL-Correct: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iQ29ycmVjdCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj48cGF0aCBkPSJNMjUwIDBjNzcuNjkuNyAxNDQgMjAuMTkgMTg2LjU1IDYzLjQ1QzQ3OS44MSAxMDUuOTkgNDk5LjMgMTcyLjMxIDUwMCAyNTBjLS43IDc3LjY5LTIwLjE5IDE0NC02My40NSAxODYuNTVDMzk0IDQ3OS44MSAzMjcuNjkgNDk5LjMgMjUwIDUwMGMtNzcuNjktLjctMTQ0LTIwLjE5LTE4Ni41NS02My40NUMyMC4xOSAzOTQgLjcgMzI3LjY5IDAgMjUwYy43LTc3LjY5IDIwLjE5LTE0NCA2My40NS0xODYuNTVDMTA2IDIwLjE5IDE3Mi4zMS43IDI1MCAwIiBmaWxsPSIjMWZlNDdlIi8+PHBhdGggZD0iTTIyNy4xMzEgMzQ4LjM3M2EyMy45OCAyMy45OCAwIDAgMS0xNy4wMDYtNy4wNGwtODMuMTI3LTgzLjEyN2MtOS4zOTQtOS4zOTQtOS4zOTQtMjQuNjE4IDAtMzQuMDAxIDkuMzk0LTkuMzk0IDI0LjYxOC05LjM5NCAzNC4wMDEgMGw2Ni4xMzIgNjYuMTMyTDM1NC4zOSAxNjMuMDc4YzkuMzk0LTkuMzk0IDI0LjYxOC05LjM5NCAzNC4wMDEgMCA5LjM5NCA5LjM5NCA5LjM5NCAyNC42MTggMCAzNC4wMDFMMjQ0LjEyNiAzNDEuMzQ0Yy00LjY5NyA0LjY5Ny0xMC44NDYgNy4wNC0xNy4wMDYgNy4wNFoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii44Ii8+PC9zdmc+");
            --vbnICON-URL-Warn: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iV2FybiIgdmlld0JveD0iMCAwIDUwMCA1MDAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj48cGF0aCBkPSJNMjUwIDBjNzcuNjkuNyAxNDQgMjAuMTkgMTg2LjU1IDYzLjQ1QzQ3OS44MSAxMDUuOTkgNDk5LjMgMTcyLjMxIDUwMCAyNTBjLS43IDc3LjY5LTIwLjE5IDE0NC02My40NSAxODYuNTVDMzk0IDQ3OS44MSAzMjcuNjkgNDk5LjMgMjUwIDUwMGMtNzcuNjktLjctMTQ0LTIwLjE5LTE4Ni41NS02My40NUMyMC4xOSAzOTQgLjcgMzI3LjY5IDAgMjUwYy43LTc3LjY5IDIwLjE5LTE0NCA2My40NS0xODYuNTVDMTA2IDIwLjE5IDE3Mi4zMS43IDI1MCAwIiBmaWxsPSIjRkY3QjI5Ii8+PHBhdGggZD0iTTIyMy4xIDM0OC4xYzAgMTQuODQgMTIuMDIgMjYuOSAyNi43OCAyNi45aC4yNGMxNC44MS0uMDIgMjYuOC0xMi4wNSAyNi43OC0yNi44NnYtLjA0Yy4wMi0xNC44MS0xMS45Ny0yNi44NC0yNi43OC0yNi44NmgtLjI0Yy0xNC44MS4wMi0yNi44IDEyLjA1LTI2Ljc4IDI2Ljg2bTAtODEuNTVjLS4wMSAxNC44NiAxMi4wMiAyNi45MSAyNi44OCAyNi45MnMyNi45MS0xMi4wMiAyNi45Mi0yNi44OHYtMTE0LjdjMC0xNC44Ni0xMi4wNC0yNi45LTI2LjktMjYuOXMtMjYuOSAxMi4wNC0yNi45IDI2Ljl2MTE0LjY1WiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjgiLz48L3N2Zz4=");
            --vbnICON-URL-Error: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iRXJyb3IiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+PHBhdGggZD0iTTI1MCAwYzc3LjY5LjcgMTQ0IDIwLjE5IDE4Ni41NSA2My40NUM0NzkuODEgMTA1Ljk5IDQ5OS4zIDE3Mi4zMSA1MDAgMjUwYy0uNyA3Ny42OS0yMC4xOSAxNDQtNjMuNDUgMTg2LjU1QzM5NCA0NzkuODEgMzI3LjY5IDQ5OS4zIDI1MCA1MDBjLTc3LjY5LS43LTE0NC0yMC4xOS0xODYuNTUtNjMuNDVDMjAuMTkgMzk0IC43IDMyNy42OSAwIDI1MGMuNy03Ny42OSAyMC4xOS0xNDQgNjMuNDUtMTg2LjU1QzEwNiAyMC4xOSAxNzIuMzEuNyAyNTAgMCIgZmlsbD0iI2ZmNzE0ZCIvPjxwYXRoIGQ9Ik0zNDcuNDI3IDMxMi42MzQgMjg0Ljc5MyAyNTBsNjIuNjIzLTYyLjYyM2M5LjYxNC05LjYwMyA5LjYxNC0yNS4xOSAwLTM0Ljc5My05LjYxNC05LjYxNC0yNS4xOS05LjYxNC0zNC43OTMgMEwyNTAgMjE1LjIwN2wtNjIuNjIzLTYyLjYyM2MtOS42MTQtOS42MTQtMjUuMTktOS42MTQtMzQuNzkzIDAtOS42MTQgOS42MDMtOS42MTQgMjUuMTkgMCAzNC43OTNMMjE1LjIwNyAyNTBsLTYyLjYzNCA2Mi42MzRjLTkuNjE0IDkuNjAzLTkuNjE0IDI1LjE5IDAgMzQuNzkzIDQuODA3IDQuODA3IDExLjA5OSA3LjIwNSAxNy40MDIgNy4yMDVzMTIuNTk1LTIuMzk4IDE3LjQwMi03LjIwNWw2Mi42MzQtNjIuNjM0IDYyLjYzNCA2Mi42MzRjNC44MDcgNC44MDcgMTEuMDk5IDcuMjA1IDE3LjQwMiA3LjIwNXMxMi41OTUtMi4zOTggMTcuNDAyLTcuMjA1YzkuNjE0LTkuNjAzIDkuNjE0LTI1LjE5IDAtMzQuNzkzWiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjgiLz48L3N2Zz4=");
            --vbnICON-URL-Correct-Empty: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9IkNvcnJlY3QtRW1wdHkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDUwMCA1MDAiPjxwYXRoIGQ9Ik00MzYuNTUgNjMuNDVDMzk0IDIwLjE5IDMyNy42OS43IDI1MCAwIDE3Mi4zMS43IDEwNiAyMC4xOSA2My40NSA2My40NSAyMC4xOSAxMDYgLjcgMTcyLjMxIDAgMjUwYy43IDc3LjY5IDIwLjE5IDE0NCA2My40NSAxODYuNTVDMTA2IDQ3OS44MSAxNzIuMzEgNDk5LjMgMjUwIDUwMGM3Ny42OS0uNyAxNDQtMjAuMTkgMTg2LjU1LTYzLjQ1QzQ3OS44MSAzOTQgNDk5LjMgMzI3LjY5IDUwMCAyNTBjLS43LTc3LjY5LTIwLjE5LTE0NC4wMS02My40NS0xODYuNTVtLTQ4LjE2IDEzMy42M0wyNDQuMTIgMzQxLjM1Yy00LjcgNC43LTEwLjg1IDcuMDQtMTcuMDEgNy4wNGguMDFjLTYuMzggMC0xMi41LTIuNTQtMTcuMDEtNy4wNWwtODMuMTMtODMuMTNjLTkuMzktOS4zOS05LjM5LTI0LjYyIDAtMzQgOS4zOS05LjM5IDI0LjYyLTkuMzkgMzQgMGw2Ni4xMyA2Ni4xMyAxMjcuMjYtMTI3LjI2YzkuMzktOS4zOSAyNC42Mi05LjM5IDM0IDAgOS4zOSA5LjM5IDkuMzkgMjQuNjIgMCAzNFoiIHN0eWxlPSJmaWxsOiMyNWY0OWQiLz48L3N2Zz4=");
            --vbnICON-URL-Warn-Empty: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9Ildhcm4tRW1wdHkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDUwMCA1MDAiPjxwYXRoIGQ9Ik00MzYuNTUgNjMuNDVDMzk0IDIwLjE5IDMyNy42OS43IDI1MCAwIDE3Mi4zMS43IDEwNiAyMC4xOSA2My40NSA2My40NSAyMC4xOSAxMDYgLjcgMTcyLjMxIDAgMjUwYy43IDc3LjY5IDIwLjE5IDE0NCA2My40NSAxODYuNTVDMTA2IDQ3OS44MSAxNzIuMzEgNDk5LjMgMjUwIDUwMGM3Ny42OS0uNyAxNDQtMjAuMTkgMTg2LjU1LTYzLjQ1QzQ3OS44MSAzOTQgNDk5LjMgMzI3LjY5IDUwMCAyNTBjLS43LTc3LjY5LTIwLjE5LTE0NC4wMS02My40NS0xODYuNTVNMjUwIDEyNWMxNC44NiAwIDI2LjkgMTIuMDQgMjYuOSAyNi45djExNC43Yy0uMDEgMTQuODYtMTIuMDcgMjYuODktMjYuOTIgMjYuODgtMTQuODYtLjAxLTI2Ljg5LTEyLjA3LTI2Ljg4LTI2LjkyVjE1MS45MWMwLTE0Ljg2IDEyLjA0LTI2LjkgMjYuOS0yNi45Wm0uMTIgMjUwaC0uMjRjLTE0Ljc2IDAtMjYuNzgtMTIuMDYtMjYuNzgtMjYuOS0uMDItMTQuODEgMTEuOTctMjYuODQgMjYuNzgtMjYuODZoLjI0YzE0LjgxLjAyIDI2LjggMTIuMDUgMjYuNzggMjYuODZ2LjA0Yy4wMiAxNC44MS0xMS45NyAyNi44NC0yNi43OCAyNi44NiIgc3R5bGU9ImZpbGw6I2ZmN2IyOSIvPjwvc3ZnPg==");
            --vbnICON-URL-Error-Empty: url("data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9IkVycm9yLUVtcHR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48cGF0aCBkPSJNNDM2LjU1IDYzLjQ1QzM5NCAyMC4xOSAzMjcuNjkuNyAyNTAgMCAxNzIuMzEuNyAxMDYgMjAuMTkgNjMuNDUgNjMuNDUgMjAuMTkgMTA2IC43IDE3Mi4zMSAwIDI1MGMuNyA3Ny42OSAyMC4xOSAxNDQgNjMuNDUgMTg2LjU1QzEwNiA0NzkuODEgMTcyLjMxIDQ5OS4zIDI1MCA1MDBjNzcuNjktLjcgMTQ0LTIwLjE5IDE4Ni41NS02My40NUM0NzkuODEgMzk0IDQ5OS4zIDMyNy42OSA1MDAgMjUwYy0uNy03Ny42OS0yMC4xOS0xNDQuMDEtNjMuNDUtMTg2LjU1bS04OS4xIDI4My45OGMtNC44MSA0LjgxLTExLjEgNy4yMS0xNy40IDcuMjFzLTEyLjU5LTIuNC0xNy40LTcuMjFsLTYyLjYzLTYyLjYzLTYyLjYzIDYyLjYzYy00LjgxIDQuODEtMTEuMSA3LjIxLTE3LjQgNy4yMXMtMTIuNTktMi40LTE3LjQtNy4yMWMtOS42MS05LjYtOS42MS0yNS4xOSAwLTM0Ljc5bDYyLjYzLTYyLjYzLTYyLjYyLTYyLjYyYy05LjYxLTkuNi05LjYxLTI1LjE5IDAtMzQuNzkgOS42LTkuNjEgMjUuMTgtOS42MSAzNC43OSAwbDYyLjYyIDYyLjYyIDYyLjYyLTYyLjYyYzkuNi05LjYxIDI1LjE4LTkuNjEgMzQuNzkgMCA5LjYxIDkuNiA5LjYxIDI1LjE5IDAgMzQuNzlsLTYyLjYyIDYyLjYyIDYyLjYzIDYyLjYzaC4wMmM5LjYxIDkuNiA5LjYxIDI1LjE5IDAgMzQuNzkiIHN0eWxlPSJmaWxsOiNmYzVlNGYiLz48L3N2Zz4=");
            
        }
        
            .vbnThemeDark {
                
                --vbnAccentHEX: #4C525E;
                --vbnAccentHSL: 220, 011%, 033%;
                --vbnAccentHSL-H: 220;
                --vbnAccentHSL-S: 11%;
                --vbnAccentHSL-L: 33%;
                --vbnAccentAltXXX: var(--vbnAccentHSL-H), calc(var(--vbnAccentHSL-S) - 000%), calc(var(--vbnAccentHSL-L) - 000%);
                --vbnAccentPickXX: var(--vbnAccentHSL-H), calc(var(--vbnAccentHSL-S) - 002%), calc(var(--vbnAccentHSL-L) - 010%);
                --vbnAccentBorder: var(--vbnAccentHSL-H), calc(var(--vbnAccentHSL-S) - 000%), calc(var(--vbnAccentHSL-L) + 020%);
                --vbnAccentShadow: var(--vbnAccentHSL-H), calc(var(--vbnAccentHSL-S) - 000%), calc(var(--vbnAccentHSL-L) - 000%);
                --vbnSecondaryHEX: #2D3139;
                --vbnSecondaryHSL: 220, 012%, 020%;
                --vbnSecondaryHSL-H: 220;
                --vbnSecondaryHSL-S: 12%;
                --vbnSecondaryHSL-L: 20%;
                --vbnSecondaryAltXXX: var(--vbnSecondaryHSL-H), calc(var(--vbnSecondaryHSL-S) - 000%), calc(var(--vbnSecondaryHSL-L) - 000%);
                --vbnSecondaryPickXX: var(--vbnSecondaryHSL-H), calc(var(--vbnSecondaryHSL-S) - 000%), calc(var(--vbnSecondaryHSL-L) - 010%);
                --vbnSecondaryBorder: var(--vbnSecondaryHSL-H), calc(var(--vbnSecondaryHSL-S) - 000%), calc(var(--vbnSecondaryHSL-L) + 020%);
                --vbnSecondaryShadow: var(--vbnSecondaryHSL-H), calc(var(--vbnSecondaryHSL-S) - 000%), calc(var(--vbnSecondaryHSL-L) - 000%);
                --vbnPrimaryHEX: #1D1E20;
                --vbnPrimaryHSL: 220, 005%, 012%;
                --vbnPrimaryHSL-H: 220;
                --vbnPrimaryHSL-S: 05%;
                --vbnPrimaryHSL-L: 12%;
                --vbnPrimaryAltXXX: var(--vbnPrimaryHSL-H), calc(var(--vbnPrimaryHSL-S) - 000%), calc(var(--vbnPrimaryHSL-L) - 000%);
                --vbnPrimaryPickXX: var(--vbnPrimaryHSL-H), calc(var(--vbnPrimaryHSL-S) - 000%), calc(var(--vbnPrimaryHSL-L) - 010%);
                --vbnPrimaryBorder: var(--vbnPrimaryHSL-H), calc(var(--vbnPrimaryHSL-S) - 000%), calc(var(--vbnPrimaryHSL-L) + 020%);
                --vbnPrimaryShadow: var(--vbnPrimaryHSL-H), calc(var(--vbnPrimaryHSL-S) - 000%), calc(var(--vbnPrimaryHSL-L) - 010%);
                
                --vbnGrid-S: hsla(0, 0%, 50%, 0.07);
                --vbnGrid-L: hsla(0, 0%, 50%, 0.09);
                --vbnGrid-D: hsla(0, 0%, 50%, 0.09);
                
                --vbnGlassBase: hsla(0, 0%, 98%, .6);
                
            }
            
            .vbnThemeLight {
            
                --vbnAccentHEX: #75839F;
                --vbnAccentHSL: 220, 018%, 054%;
                --vbnAccentHSL-H: 220;
                --vbnAccentHSL-S: 18%;
                --vbnAccentHSL-L: 54%;
                --vbnAccentAltXXX: var(--vbnAccentHSL-H), calc(var(--vbnAccentHSL-S) - 000%), calc(var(--vbnAccentHSL-L) - 000%);
                --vbnAccentPickXX: var(--vbnAccentHSL-H), calc(var(--vbnAccentHSL-S) - 002%), calc(var(--vbnAccentHSL-L) - 010%);
                --vbnAccentBorder: var(--vbnAccentHSL-H), calc(var(--vbnAccentHSL-S) - 000%), calc(var(--vbnAccentHSL-L) + 020%);
                --vbnAccentShadow: var(--vbnAccentHSL-H), calc(var(--vbnAccentHSL-S) - 000%), calc(var(--vbnAccentHSL-L) - 000%);
                --vbnSecondaryHEX: #454A54;
                --vbnSecondaryHSL: 220, 010%, 030%;
                --vbnSecondaryHSL-H: 220;
                --vbnSecondaryHSL-S: 10%;
                --vbnSecondaryHSL-L: 30%;
                --vbnSecondaryAltXXX: var(--vbnSecondaryHSL-H), calc(var(--vbnSecondaryHSL-S) - 000%), calc(var(--vbnSecondaryHSL-L) - 000%);
                --vbnSecondaryPickXX: var(--vbnSecondaryHSL-H), calc(var(--vbnSecondaryHSL-S) - 000%), calc(var(--vbnSecondaryHSL-L) - 010%);
                --vbnSecondaryBorder: var(--vbnSecondaryHSL-H), calc(var(--vbnSecondaryHSL-S) - 000%), calc(var(--vbnSecondaryHSL-L) + 020%);
                --vbnSecondaryShadow: var(--vbnSecondaryHSL-H), calc(var(--vbnSecondaryHSL-S) - 000%), calc(var(--vbnSecondaryHSL-L) - 000%);
                --vbnPrimaryHEX: #2C2F35;
                --vbnPrimaryHSL: 220, 009%, 019%;
                --vbnPrimaryHSL-H: 220;
                --vbnPrimaryHSL-S: 09%;
                --vbnPrimaryHSL-L: 19%;
                --vbnPrimaryAltXXX: var(--vbnPrimaryHSL-H), calc(var(--vbnPrimaryHSL-S) - 000%), calc(var(--vbnPrimaryHSL-L) - 000%);
                --vbnPrimaryPickXX: var(--vbnPrimaryHSL-H), calc(var(--vbnPrimaryHSL-S) - 000%), calc(var(--vbnPrimaryHSL-L) - 010%);
                --vbnPrimaryBorder: var(--vbnPrimaryHSL-H), calc(var(--vbnPrimaryHSL-S) - 000%), calc(var(--vbnPrimaryHSL-L) + 020%);
                --vbnPrimaryShadow: var(--vbnPrimaryHSL-H), calc(var(--vbnPrimaryHSL-S) - 000%), calc(var(--vbnPrimaryHSL-L) - 010%);
                
                --vbnGrid-S: hsla(0, 0%, 50%, 0.05);
                --vbnGrid-L: hsla(0, 0%, 50%, 0.07);
                --vbnGrid-D: hsla(0, 0%, 50%, 0.07);
                
                --vbnGlassBase: hsla(0, 0%, 98%, .6);
                
            }
            
            
        #vbnDOM { z-index: var(--vbnPriority09); pointer-events: none; padding: 0; margin: 0; font-size: var(--vbnBaseSize); }
        
        #vbnDOM, #vbnDOM *, #vbnDOM ::before, #vbnDOM ::after { box-sizing: border-box; outline: none; }
        
        /* ================================================== ↓ VBN */
        
            /* div { transition: all .5s var(--vbnTransitionSmooth); } */
            
            /* ============================== ↓ Animation */
            
                @keyframes vbnLoader {
                    000% { left: -10%; width: 10%; }
                    020% { left: 010%; width: 30%; }
                    040% { left: 040%; width: 50%; }
                    060% { left: 070%; width: 30%; }
                    100% { left: 100%; width: 10%; }
                }
                @keyframes vbnSlideTop {
                    000% { transform: translate(-50%, -150%) scale(0.90); opacity: 0; }
                    015% { transform: translate(-50%, 010px) scale(1.05); opacity: 1; }
                    030% { transform: translate(-50%, 000px) scale(1.00); opacity: 1; }
                    080% { transform: translate(-50%, 000px) scale(1.00); opacity: 1; }
                    100% { transform: translate(-50%, -050%) scale(0.95); opacity: 0; }
                }
                @keyframes vbnSlideLeft {
                    000% { transform: translate(-200%, 0) scale(0.90); opacity: 0; }
                    020% { transform: translate(010px, 0) scale(1.02); opacity: 1; }
                    030% { transform: translate(000px, 0) scale(1.00); opacity: 1; }
                    085% { transform: translate(000px, 0) scale(1.00); opacity: 1; }
                    100% { transform: translate(-100%, 0) scale(0.95); opacity: 0; }
                }
                @keyframes vbnZoomIn {
                    000% { transform: scale(0.00); opacity: 0; }
                    020% { transform: scale(0.40); opacity: 0.5; }
                    030% { transform: scale(0.80); opacity: 1.0; }
                    085% { transform: scale(1.03); opacity: 1.0; }
                    100% { transform: scale(1.00); opacity: 1.0; }
                }
                
            /* ============================== ↓ LoaderBar */
            
                #vbnLoaderBar {
                    
                    opacity: .92;
                    z-index: var(--vbnPriority09);
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 0%;
                    height: 2px;
                    
                    background: linear-gradient(
                        90deg,
                        hsla(var(--vbnGlow05HSL), 1),
                        hsla(var(--vbnGlow05HSL), 1),
                        hsla(var(--vbnGlow03HSL), 1));
                    box-shadow:
                        0 2px 05px 0px hsla(var(--vbnGlow05HSL), .6),
                        0 2px 15px 0px hsla(var(--vbnGlow05HSL), .6),
                        0 2px 25px 2px hsla(var(--vbnGlow03HSL), .6);
                        
                    border-radius: 100vmax;
                    will-change: left, width;
                    transition: width .4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity .26s ease-out;
                    
                }
                #vbnLoaderBar[data-state="loading"] {
                    animation: vbnLoader 2.4s infinite cubic-bezier(0.4, 0.0, 0.6, 1);
                }
                
                
            /* ============================== ↓ Panel */
            
                #vbnOptionsPanel {
                    
                    --vbnHeightHead: 35px;
                    --vbnHeightRow: 32px;
                    --vbnRowPadding: 15px;
                    --vbnGap: 12px;
                    
                }
                
                .vbnPanelBase {
                    pointer-events: auto;
                    opacity: 0;
                    will-change: opacity, transform;
                    padding: 20px;
                    border: var(--vbnOftenPanelBorderBase);
                    font-family: var(--vbnBaseFont);
                    color: var(--vbnBase05HEX);
                    background: hsla(var(--vbnBase00HSL-H), 60%, 6%, .8);
                    box-shadow: var(--vbnSurfaceShadow) hsla(var(--vbnAccentShadow), .8);
                    border-radius: var(--vbnSurfaceRadius);
                    backdrop-filter: var(--vbnPanelFilter);
                    transition: all .526s var(--vbnTransitionElastic), opacity .26s ease;
                }
                .vbnPanelBase.vbnShow { opacity: 1; transform: translate(0, -50%); }
                .vbnPanelBase.vbnHide { opacity: 0; transform: translate(120%, -50%); }
                
                .vbnOptionBase {
                    z-index: var(--vbnPriority09);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: var(--vbnGap);
                    width: calc(260px + 40px);
                }
                .vbnFixed {
                    position: fixed;
                    top: 50%;
                    right: var(--vbnSpaceAxialX);
                    transform: translate(120%, -50%);
                }
                .vbnRelative {
                    position: relative;
                    top: 20px;
                    right: 20px;
                }
                
                    .vbnOptionBase h2 {
                        margin-top: 0;
                        margin: calc(var(--vbnGap) / 2) 0 calc(var(--vbnGap) / 2 + 5px) 0;
                        color: var(--vbnGlow04HEX);
                        font-size: 1.7em;
                        font-weight: var(--vbnTitleWeight);
                        text-align: center;
                        text-shadow: 0 0 5px var(--vbnGlow04HEX);
                    }
                    
                    .vbnPanelGroup {
                        display: flex;
                        flex-direction: column;
                        gap: 0;
                        width: 100%;
                    }
                    
                    /* ========== ↓ A */
                    
                        .vbnPanelGroup:not(.Sub) > .vbnGroupHeader { color: hsla(var(--vbnBase06HSL), .6); }
                        
                    /* ========== ↓ B */
                    
                        .vbnPanelGroup > .vbnGroupBody { color: hsla(var(--vbnBase05HSL), .9); }
                        
                    /* ========== ↓ C */
                    
                    
                    
                    
                    
            /* ============================== ↓ Panel */
            
            
                /* ========== ↓ Header */
                
                    .vbnGroupHeader {
                        display: flex;
                        align-items: center;
                        width: 100%;
                    }
                    
                    .vbnHeaderRow, .vbnFoldBox {
                        background: hsla(var(--vbnBase00HSL), .6);
                        box-shadow: 0 10px 20px hsla(var(--vbnBase00HSL), .4);
                        transition: background-color .26s;
                    }
                    .vbnHeaderRow:hover, .vbnFoldBox:hover { background: hsla(var(--vbnBase00HSL), .8); }
                    
                    .vbnHeaderRow {
                        cursor: pointer;
                        padding: 5px var(--vbnRowPadding) 5px 5px;
                        height: var(--vbnHeightHead);
                        display: flex;
                        flex: 1 1 auto;
                        align-items: center;
                        justify-content: flex-start;
                        gap: 0;
                        font-size: .85em;
                        font-weight: var(--vbnTitleWeight);
                        border-radius: 0 var(--vbnUIRadius) var(--vbnUIRadius) 0;
                    }
                    
                    .vbnHeaderRow > span {
                        flex-grow: 0;
                        margin-right: auto;
                        user-select: none;
                    }
                    
                    .vbnFoldBox {
                        cursor: pointer;
                        flex: 0 0 auto;
                        width: calc(var(--vbnHeightHead) - 5px);
                        height: var(--vbnHeightHead);
                        font-size: 18px;
                        user-select: none;
                        transition: transform 0.4s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: var(--vbnUIRadius) 0 0 var(--vbnUIRadius);
                    }
                    
                    .vbnArrow {
                        margin: -1px -4px 0 0;
                        font-size: 16px;
                        transform: rotate(0deg);
                        transition: transform .4s ease;
                    }
                    .vbnArrow.vbnRotated { transform: rotate(90deg); }
                    
                    
                /* ========== ↓ Body */
                
                    .vbnGroupBody {
                        display: flex;
                        flex-direction: column;
                        gap: calc(var(--vbnGap) / 2 - 1px);
                        opacity: 1;
                        height: auto;
                        transition: all .526s var(--vbnTransitionSmooth);
                    }
                    .vbnGroupBody.vbnOpen { overflow: hidden; }
                    .vbnGroupBody.vbnClose { overflow: hidden; opacity: 0; height: 0 !important; }
                    
                    .vbnBodyRow {
                        cursor: pointer;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 9px var(--vbnRowPadding);
                        margin: 0 0 0 calc(var(--vbnGap) - 2px);
                        border-radius: var(--vbnUIRadius);
                    }
                    .vbnGroupBody > :first-child { margin: calc(var(--vbnGap) / 2) 0 0 calc(var(--vbnGap) - 2px); }
                    .vbnBodyRow > :last-child { margin: 0 0 calc(var(--vbnGap) / 4) calc(var(--vbnGap) - 2px); }
                    
                    
                /* ========== ↓ 功能模块 > 子功能样式 */
                
                    .vbnBodyRow, .vbnPanelGroup.Sub .vbnHeaderRow {
                        font-size: .82em;
                        font-weight: normal;
                    }
                    
                    .vbnGroupBody > .vbnPanelGroup.Sub:first-child { margin-left: 0; }
                    
                    .vbnBodyRow, .vbnPanelGroup.Sub .vbnHeaderRow, .vbnPanelGroup.Sub .vbnFoldBox {
                        height: var(--vbnHeightRow);
                        background: hsla(var(--vbnBase00HSL), .4);
                        transition: background-color .26s, opacity 0.26s;
                    }
                    .vbnBodyRow:hover, .vbnPanelGroup.Sub .vbnHeaderRow:hover {
                        background: hsla(var(--vbnBase00HSL), .8);
                    }
                    
                    .vbnPanelGroup.Sub { vbn { top: var(); }
                        
                        .vbnGroupBody { margin: 0 0 0 calc(var(--vbnGap) - 2px); }
                        
                        .vbnFoldBox {
                            opacity: .4;
                            width: calc(var(--vbnHeightRow) - 5px);
                            color: hsla(var(--vbnBase00HSL), .8);
                            background: transparent;
                            box-shadow: none;
                            margin: 0 0 0 calc(var(--vbnGap) - 28px);
                        }
                        .vbnHeaderRow { padding: 9px var(--vbnRowPadding); }
                        .vbnHeaderRow, .vbnFoldBox {
                            border-radius: var(--vbnUIRadius);
                            box-shadow: 0 10px 20px hsla(var(--vbnBase00HSL), .2);
                        }
                        .vbnBodyRow { color: hsla(var(--vbnBase05HSL), .8); }
                        
                    }
                    
                    
                /* ========== ↓ Other */
                
                    :where(.vbnOptionBase) label {
                        margin: 0;
                        padding: 0;
                        color: inherit;
                    }
                    
                    .vbnOptionBase input[type="checkbox"] {
                        cursor: pointer;
                        position: relative;
                        appearance: none;
                        width: .6em;
                        height: .6em;
                        margin: 0;
                        background: var(--vbnBase04HEX);
                        border: none;
                        border-radius: 50%;
                        transition: background-color .26s ease;
                        box-shadow: 0 0 2px hsla(0, 0%, 0%, .3);
                    }
                    .vbnOptionBase input[type="checkbox"].correct:checked {
                        background: var(--vbnGreen000);
                        box-shadow: 0 0 10px var(--vbnGreen000);
                    }
                    .vbnOptionBase input[type="checkbox"].warn:checked {
                        background: var(--vbnOrange00);
                        box-shadow: 0 0 10px var(--vbnOrange00);
                    }
                    .vbnOptionBase input[type="checkbox"].error:checked {
                        background: var(--vbnRed00000);
                        box-shadow: 0 0 10px var(--vbnRed00000);
                    }
                    
                    
            /* ========== ↓ ItemBlock */
            
                .vbnItemBlock {
                    box-sizing: border-box;
                    position: relative;
                    padding: var(--vbnSpacePadding);
                    margin: var(--vbnSpaceMargin);
                    border: none;
                    width: 100%;
                    font-size: 12px;
                    background: #FFFFFF;
                    box-shadow: var(--vbnOftenSurfaceShadowBase);
                    border-radius: var(--vbnSurfaceRadius);
                    transition: var(--vbnOftenTransition);
                }
                .vbnItemBlock:hover {
                    z-index: var(--vbnPriority00);
                    box-shadow: inset 0 0 2px hsla(0, 0%, 92%, .6), var(--vbnOftenSurfaceShadowHover);
                    transform: var(--vbnSurfaceZoomIn);
                }
                
                
            /* ========== ↓ Button */
            
                .vbnButtonBase {
                    cursor: pointer;
                    user-select: none;
                    border: var(--vbnUIBorder) var(--vbnAccentBorder);
                    font-size: 1em;
                    font-weight: var(--vbnTitleWeight);
                    color: var(--vbnBase00HEX);
                    background: var(--vbnAccentHEX);
                    box-shadow: var(--vbnUIShadow) var(--vbnAccentShadow);
                    border-radius: var(--vbnPanelRadius);
                    transition: transform .26s var(--vbnTransitionSoft);
                }
                .vbnButtonBase:hover { transform: var(--vbnSurfaceZoomIn); }
                .vbnButtonBase:first-of-type { margin-top: calc(var(--vbnGap) - 2px); }
                
                .vbnButtonBase.fill { cursor: pointer; }
                .vbnButtonBase.outline { cursor: pointer; }
                .vbnButtonBase.text { cursor: pointer; }
                .vbnButtonBase.ICON { cursor: pointer; }
                
                .vbnButtonBase.vbnOpen {
                    border: none;
                    background: linear-gradient( 90deg, var(--vbnGreen001), var(--vbnBlue0001) );
                    box-shadow:
                        inset 0 0 20px hsla(var(--vbnGlow06HSL), .6),
                        0 0 10px hsla(var(--vbnGlow04HSL), .4);
                }
                .vbnButtonBase.vbnClose {
                    border: none;
                    background: linear-gradient( 90deg, var(--vbnGreen001), var(--vbnBlue0001) );
                    box-shadow:
                        inset 0 0 20px hsla(var(--vbnGlow06HSL), .6),
                        0 0 10px hsla(var(--vbnGlow04HSL), .4);
                }
                .vbnButtonFixed {
                    padding: 5px 10px;
                    width: var(--vbnButtonWidth);
                    height: var(--vbnButtonHeight);
                }
                .vbnButtonAdapt {
                    padding: 10px 0;
                    width: 100%;
                }
                
                
            /* ========== ↓ vbnTips */
            
                .vbnTips {
                    
                    --gap: .6em;
                    
                    z-index: var(--vbnPriority09);
                    position: fixed;
                    display: flex;
                    align-items: center;
                    gap: var(--gap);
                    padding: .6em 1.26em;
                    border: .1em solid hsla(var(--vbnBase09HSL), .126);
                    
                    text-align: justify;
                    font-size: 14px;
                    font-weight: 526;
                    background: hsla(var(--vbnBase02HSL), .926);
                    color: var(--vbnGlow04HEX);
                    box-shadow:
                        var(--vbnTipsShadow-M) hsla(var(--vbnAccentHSL), .120),
                        var(--vbnTipsShadow-L) hsla(var(--vbnAccentHSL), .092);
                    border-radius: .92em;
                    transition: var(--vbnOftenTransition);
                    
                }
                .vbnTips.fade { opacity: 0; transition: opacity .26s ease; }
                .vbnTips.top {
                    top: 2em;
                    left: 50%;
                    transform: translateX(-50%);
                    animation: vbnSlideTop 2s cubic-bezier(.25, .8, .25, 1) forwards;
                }
                .vbnTips.left {
                    top: 2.26em;
                    left: 2em;
                    animation: vbnSlideLeft 2s cubic-bezier(.25, 1.4, .5, 1) forwards;
                }
                .vbnTips.inside {
                    position: absolute;
                    top: 2em;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .vbnTips.hover {
                    opacity: 0;
                    z-index: calc(var(--vbnPriority09) + 1);
                    pointer-events: none;
                    gap: 0;
                    border: var(--vbnUIBorder) hsla(var(--vbnAccentHSL), .2);
                 /* max-width: 260px; */
                    min-height: 12px;
                    font-size: 12px;
                    background: hsla(var(--vbnBase00HSL), .8);
                    box-shadow: var(--vbnUIShadow) hsla(var(--vbnBase00HSL), .4);
                    transition: opacity .26s ease;
                }
                .vbnTips.hover.show { opacity: 1; }
                
                
                .vbnTips:has(::before) {
                    padding: var(--gap) calc(var(--gap) + var(--gap) / 1.5);
                }
                .vbnTips.remind::before, .vbnTips.correct::before, .vbnTips.warn::before, .vbnTips.error::before {
                    content: "";
                    display: inline-block;
                    width: 1em;
                    height: 1em;
                    background: center / contain no-repeat;
                }
                .vbnTips.remind::before { background-image: var(--vbnICON-URL-Correct-Empty); }
                .vbnTips.correct::before { background-image: var(--vbnICON-URL-Correct-Empty); }
                .vbnTips.warn::before { background-image: var(--vbnICON-URL-Warn-Empty); }
                .vbnTips.error::before { background-image: var(--vbnICON-URL-Error-Empty); }
                
                .vbnTips.remind {
                    box-shadow:
                        var(--vbnTipsShadow-M) hsla(var(--vbnAccentHSL), .126),
                        var(--vbnTipsShadow-L) hsla(var(--vbnAccentHSL), .092);
                }
                .vbnTips.correct {
                    border-color: hsla(var(--vbnStateCorrectHSL), .26);
                    color: hsla(var(--vbnStateCorrectHSL), 1);
                    box-shadow:
                        var(--vbnTipsShadow-M) hsla(var(--vbnStateCorrectHSL), .126),
                        var(--vbnTipsShadow-L) hsla(var(--vbnStateCorrectHSL), .092);
                }
                .vbnTips.warn {
                    border-color: hsla(var(--vbnStateWarnHSL), .26);
                    color: hsla(var(--vbnStateWarnHSL), 1);
                    box-shadow:
                        var(--vbnTipsShadow-M) hsla(var(--vbnStateWarnHSL), .126),
                        var(--vbnTipsShadow-L) hsla(var(--vbnStateWarnHSL), .092);
                }
                .vbnTips.error {
                    border-color: hsla(var(--vbnStateErrorHSL), .26);
                    color: hsla(var(--vbnStateErrorHSL), 1);
                    box-shadow:
                        var(--vbnTipsShadow-M) hsla(var(--vbnStateErrorHSL), .126),
                        var(--vbnTipsShadow-L) hsla(var(--vbnStateErrorHSL), .092);
                }
                
                
            /* ========== ↓ Focal */
            
                .vbnFocal {
                    
                    --height: 2px;
                    --time: .526s;
                    --offset: 0px;
                    --base: var(--vbnAccentHEX);
                    --radius: var(--vbnBaseRadius);
                    --bezier: var(--vbnTransitionSoft);
                    
                    position: relative;
                    text-decoration: none;
                    
                    vbn { top: var(); }
                    
                    &::after {
                        content: "";
                        position: absolute;
                        bottom: calc(var(--height) * -1 + var(--offset));
                        width: 100%; /*  width: max-content; */
                        height: var(--height);
                        background: var(--base);
                        border-radius: var(--radius);
                        transition: transform var(--time) var(--bezier);
                    }
                    
                    &.vbnCT::after {
                        left: 50%;
                        transform: translateX(-50%) scaleX(0);
                        transform-origin: center;
                    }
                    &.vbnCT:hover::after { transform: translateX(-50%) scaleX(1);}
                    
                    &.vbnLR::after {
                        left: 0;
                        transform: scaleX(0);
                        transform-origin: left;
                    }
                    &.vbnLR:hover::after { transform: scaleX(1); }
                    
                }
                
                
            /* ========== ↓ Grid */
            
                .vbnGrid {
                    
                    --top: #FFF;
                    --centre: #FFF;
                    --bottom: #FFF;
                    --base: transparent;
                    
                    z-index: 1;
                    position: relative;
                    
                    vbn { top: var(); }
                    
                    &::after {
                        pointer-events: none;
                        z-index: -1;
                        content: "";
                        position: fixed;
                        inset: 0;
                        background-color: var(--base);
                        mask-image: linear-gradient(to bottom, var(--top), var(--centre), var(--bottom));
                    }
                    
                    &.vbnSolid::after {
                        
                        --line: 1px;
                        --sizeS: 20px;
                        --sizeL: 100px;
                        --lineS: var(--vbnGrid-S);
                        --lineL: var(--vbnGrid-L);
                        
                        background-image:
                            linear-gradient(00deg, var(--lineS) var(--line), transparent 0),
                            linear-gradient(90deg, var(--lineS) var(--line), transparent 0),
                            linear-gradient(00deg, var(--lineL) var(--line), transparent 0),
                            linear-gradient(90deg, var(--lineL) var(--line), transparent 0);
                        background-size: 
                            var(--sizeS) var(--sizeS), var(--sizeS) var(--sizeS),
                            var(--sizeL) var(--sizeL), var(--sizeL) var(--sizeL);
                            
                    }
                    &.vbnDot::after {
                        
                        --size: 2px;
                        --gap: 20px;
                        --dot: var(--vbnGrid-D);
                        
                        background-image:
                            radial-gradient(circle, var(--dot) var(--size), transparent var(--size));
                        background-size: var(--gap) var(--gap);
                        background-repeat: repeat;
                        background-position: 0 0;
                        
                    }
                    
                }
                
                
            /* ========== ↓ Link */
            
                .vbnLink {
                    
                    position: relative !important;
                    text-decoration: none !important;
                    
                    vbn { top: var(); }
                    
                    &::before, &::after {
                        content: "" !important;
                        position: absolute !important;
                        top: calc(100% + 0px) !important;
                        left: 0 !important;
                        width: 100% !important;
                        border-bottom: dashed .0926em currentColor !important;
                    }
                    &:hover::before, &:hover::after { border-bottom-style: solid !important; }
                    
                }
                
            /* ========== ↓ Table */
            
                .vbnTable {
                    
                    overflow: hidden !important;
                    border-collapse: collapse !important;
                    background: transparent !important;
                    box-shadow: 
                        0 0 0 1px hsla(0, 0%, 5%, .02),
                        0 2px 10px hsla(0, 0%, 0%, .04),
                        0 10px 10px hsla(0, 0%, 0%, .02) !important;
                    border-radius: var(--vbnSurfaceRadius) !important;
                    
                    vbn { top: var(); }
                    
                    thead {
                        font-weight: var(--vbnTitleWeight) !important;
                        background: #FFF !important;
                    }
                    
                    th, td {
                        border-style: solid !important;
                        border-width: 0 0 1px 0 !important;
                        border-color: #F9F9F9 !important;
                        /* text-align: left !important; */
                    }
                    th { color: #4D4D4D !important;}
                    td { color: #444444 !important;}
                    
                    code {
                        padding: 2px 5px !important;
                        font-family: var(--vbnCodeFont) !important;
                        color: var(--vbnCodeColor) !important;
                        background: #F2F2F2 !important;
                        border-radius: var(--vbnBaseRadius) !important;
                    }
                    
                    tr:hover { background: #FAFAFA !important; }
                    tbody tr:last-child td { border-bottom: none !important;}
                    /* tbody tr:nth-of-type(odd) { background: #FCFCFC !important; } */
                    
                    tr:first-child td:not(:first-child, :last-child) {
                        border-left: 1px solid #00000006 !important;
                        border-right: 1px solid #00000006 !important;
                    }
                    
                    th[style*="padding: 0px"], td:not([style*="padding"]) {
                        padding: 5px 10px !important;
                    }
                    
                }
                
            /* ========== ↓ Other */
            
                .vbnCurrentRow::before {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 1.2%;
                    transform: translateY(-50%);
                    height: 1.2em;
                    width: .26rem;
                    background: var(--vbnGlow01HEX);
                    box-shadow: 4px 0 14px 1px hsla(var(--vbnGlow01HSL), .92);
                    border-radius: 1em;
                }
                
                .vbnCardShadow {
                    box-shadow:
                        0 04px 06px -4px hsla(var(--vbnBase00HSL), .20),
                        0 10px 15px -2px hsla(var(--vbnBase00HSL), .04),
                        0 10px 20px -2px hsla(var(--vbnBase00HSL), .06);
                }
                
                .vbnFadeInLoad {
                    opacity: 0;
                    transform: translateY(100px);
                    transition: opacity .5s var(--vbnTransitionSmooth), transform .9s var(--vbnTransitionSmooth);
                }
                .vbnFadeInLoad.vbnLoaded {
                    opacity: 1;
                    transform: translateY(0);
                }
                
    `)
    
})();


(function VBN_GlobalCustom() {
    
    'use strict';
    
    // $ ================================================== ↓ Global
    
        const vbnMatchURL = window.location.href;
        const vbnMatchHost = window.location.host;
        
        document.documentElement.classList.add('vbn');
        
        // #region Config
        
            const VBN_SITE_GROUP = {
                
                AIGC: [
                    
                    "*127.0.0.1:8188/*",
                    "*localhost:8188/*",
                    "*127.0.0.1:7860/*",
                    "*localhost:7860/*",
                    "*127.0.0.1:9222/*",
                    "*localhost:9222/*",
                    
                ],
                
                Chat: [ "*deepseek.com/*", "*chatgpt.com/*", ],
                
                ProgDev: [ "*github.com/*", "*huggingface.co/*", ],
                
                Manage: [ "*yuque.com/*", "*ticktick.com/*", "*dida365.com/*", "*workona.com/*", ],
                
                Search: [ "*google.com/*", "*baidu.com/*", "*bing.com/*", ],
                
                Media: [ "*youtube.com/*", "*bilibili.com/*", "*weibo.com/*", ],
                
                Font: [ "*fonts.google.com/*", "*cp.baidu.com/*", "*fonts.*.com/*", "*fonts.com/*", ],
                
            };
            
            
            /**
             * @type {Object}
             * @property {boolean} debug       - 全局调试 | 开启后控制台将输出 当前站点各功能的运行状态
             * @property {Object} siteBlock    - 站点阻塞 | 功能若与原始站点产生冲突 可在相应功能组内添加站点 进行屏蔽 紧急阻塞
             */
            const VBN_GLOBAL_CONFIG = {
                
                debug: false,
                
                siteBlock: {
                    Global: [ ],
                    Assign: [ ],
                    Micro: [ ],
                },
                
            };
            
        // #endregion
        
        
        // #region Modules
        
            const VBN_GLOBAL_MODULES = {
                
                Global: {
                    
                    fold: false,
                    
                    ScrollBar: {
                        feature: "原生滚动条样式 个性化",
                        match: { include: [ "*" ], exclude: [ ] },
                    },
                    LoaderBar: {
                        name: "顶部加载条",
                        feature: "全局顶部植入 加载状态条 => 进度条",
                        state: true,
                        default: true,
                        debug: false,
                        match: { include: [ "*" ], exclude: [ ] },
                    },
                    CustomICON: {
                        feature: "站点 ICO 替换 | 书签栏 > DeepSeek > HUA! 黑鲸",
                    },
                    FontStyle: {
                        feature: "字体样式 | 可去 FontStyle 重定义所需站点/变更应用已安装的某款字体",
                    },
                    Selection: {
                        feature: "原生鼠标选取样式 个性化",
                        match: { include: [ "*" ], exclude: [ "*yuque.com/*" ] },
                    },
                    
                },
                
                Assign: {
                    
                    fold: false,
                    
                    Search: {
                        
                        fold: true,
                        
                        Baidu: { feature: " ", },
                        Google: { feature: " ", },
                        Bing: { feature: " ", },
                        QuickRead: { feature: "快速阅读 | ↑↓←→ / WSAD 翻页", },
                        
                    },
                    Chat: {
                        
                        fold: true,
                        
                        DeepSeek: { feature: " ", },
                        ChatGPT: { feature: " ", },
                        DOUBAO: { feature: " ", },
                        
                    },
                    ComfyUI: {
                        
                        feature: "YOYOYO",
                        fold: true,
                        
                        manager: { },
                        crystools: { },
                        rgthree: { },
                        
                    },
                    YUQUE: {
                        
                        fold: true,
                        
                        vbnTable: { feature: "表格样式", },
                        vbnGrid: { feature: "背景网格", }
                        
                    },
                    TickTick: { feature: " ",},
                    Youtube: { feature: " ",},
                    Bilibili: { feature: " ",},
                    
                },
                
                Micro: {
                    
                    fold: true,
                    
                    Eagle: {
                        feature: " ",
                        match: { include: [ "*" ], exclude: [ ] },
                    },
                    NetDisk_Check: {
                        feature: " ",
                        match: { include: [ "*" ], exclude: [ ] },
                    },
                    Other: { feature: "炸七炸八", },
                        
                },
                
            };
            
        // #endregion
        
        
        // #region Basics
        
            const VBN_VALUE_STORE = (() => {
                
                const regex = new Map();
                const group = new Map();
                const chain = new Map();
                const match = new Map();
                
                const persist = prefix => {
                    const cache = new Map();
                    return {
                        has: key => cache.has(key),
                        get: key => {
                            if (cache.has(key)) return cache.get(key);
                            const val = GM_getValue(`${prefix}:${key}`, undefined);
                            if (val !== undefined) cache.set(key, val);
                            return val;
                        },
                        set: (key, val) => {
                            cache.set(key, val);
                            GM_setValue(`${prefix}:${key}`, val);
                        },
                        delete: key => {
                            cache.delete(key);
                            GM_deleteValue(`${prefix}:${key}`);
                        },
                        clear: () => cache.clear(),
                        keys: () => cache.keys(),
                    };
                };
                const prefs = persist("prefs");
                const hover = persist("hover");
                
                const clear = () => {
                    regex.clear();
                    group.clear();
                    chain.clear();
                    match.clear();
                    prefs.clear();
                    hover.clear();
                };
                
                const reset = () => {
                    regex.clear();
                    group.clear();
                    chain.clear();
                    match.clear();
                    
                    for (const k of prefs.keys()) { GM_deleteValue(`prefs:${k}`); }
                    for (const k of hover.keys()) { GM_deleteValue(`hover:${k}`); }
                    
                    prefs.clear();
                    hover.clear();
                };
                
                return {
                    regex, group, chain, match,
                    prefs, hover,
                    clear, reset,
                };
                
            })();
            
            
            const VBN_GLOBAL_INFORM = (function () {
                
                const informTime = 3000;
                const hoverStateMap = new WeakMap();
                
                function show({ message, type = "", method = "left", timeout = informTime }) {
                    const tip = document.createElement("div");
                    const classList = ["vbnTips", method];
                    if (type) classList.push(type);
                    tip.className = classList.join(" ");
                    
                    tip.textContent = message;
                    
                    VBN_GLOBAL_DOM.load(dom => {
                        dom.appendChild(tip);
                        setTimeout(() => tip.classList.add("show"), 10);
                        if (timeout > 0) {
                            setTimeout(() => {
                                tip.classList.add("fade");
                                setTimeout(() => tip.remove(), 300);
                            }, timeout);
                        }
                    });
                }
                
                const top = (message, type = "", timeout = informTime) =>
                    show({ message, type, method: "top", timeout });
                    
                const left = (message, type = "", timeout = informTime) =>
                    show({ message, type, method: "left", timeout });
                    
                function hover(element, message, times, callback, delay = 926) {
                    
                    if (!element) return;
                    const node = typeof element === "string" ? document.querySelector(element) : element;
                    if (!node) return;
                    
                    const key = "hover::" + message;
                    const shownCount = GM_getValue(key, 0);
                    
                    if (typeof times === "number" && shownCount >= times) return;
                    const oldState = hoverStateMap.get(node);
                    if (oldState) {
                        node.removeEventListener("mouseenter", oldState.onEnter);
                        node.removeEventListener("mouseleave", oldState.onLeave);
                        if (oldState.timerId) clearTimeout(oldState.timerId);
                        if (oldState.hoverElement) oldState.hoverElement.remove();
                        hoverStateMap.delete(node);
                    }
                    
                    let hoverTimer = null;
                    let hoverElement = null;
                    
                    const onEnter = (e) => {
                        hoverTimer = setTimeout(() => {
                            hoverElement = document.createElement("div");
                            hoverElement.className = "vbnTips hover";
                            hoverElement.textContent = message;
                            document.body.appendChild(hoverElement);
                            
                            const { clientX: x, clientY: y } = e;
                            const { offsetWidth: w, offsetHeight: h } = hoverElement;
                            const topPos = y - 40;
                            const leftPos = Math.max(10, Math.min(x - w / 2, window.innerWidth - w - 10));
                            
                            hoverElement.style.left = `${leftPos}px`;
                            hoverElement.style.top = `${Math.max(10, topPos)}px`;
                            
                            setTimeout(() => hoverElement.classList.add("show"), 10);
                            
                            if (typeof times === "number") {
                                const newCount = shownCount + 1;
                                GM_setValue(key, newCount);
                                VBN_VALUE_STORE.hover.set(key, newCount);
                            }
                            if (typeof callback === "function") callback();
                            if (times === 1) {
                                node.removeEventListener("mouseenter", onEnter);
                                node.removeEventListener("mouseleave", onLeave);
                                hoverStateMap.delete(node);
                            }
                        }, delay);
                        
                        hoverStateMap.set(node, { timerId: hoverTimer, hoverElement, onEnter, onLeave });
                    };
                    const onLeave = () => {
                        if (hoverTimer) {
                            clearTimeout(hoverTimer);
                            hoverTimer = null;
                        }
                        if (hoverElement) {
                            hoverElement.classList.add("fade");
                            setTimeout(() => {
                                hoverElement?.remove();
                                hoverElement = null;
                            }, 300);
                        }
                        const state = hoverStateMap.get(node);
                        if (state) {
                            state.timerId = null;
                            state.hoverElement = null;
                        }
                    };
                    
                    node.addEventListener("mouseenter", onEnter);
                    node.addEventListener("mouseleave", onLeave);
                    
                    hoverStateMap.set(node, { timerId: hoverTimer, hoverElement, onEnter, onLeave });
                }
                
                return { top, left, hover };
                
            })();
            
            
            const VBN_GLOBAL_DEBUG = (() => {
                
                const VBN = "[==👽VBN==]";
                const logRecord = Object.create(null);
                
                const mapError = Object.create(null);
                const mapTime = Object.create(null);
                
                function logFormat({ icon, key, time, msg }) {
                    return `${VBN}[${icon}][${time?.toFixed?.(1) || "-"}ms][${key}] | ${msg}`;
                }
                function logStore(key, msg) {
                    if (!logRecord[key]) logRecord[key] = [];
                    logRecord[key].push({ msg, time: Date.now() });
                }
                
                function log(key, msg = "DONE", time = 0, detail) {
                    const icon = "🚀";
                    const text = logFormat({ icon, key, time, msg });
                    console.log(text);
                    if (detail !== undefined) console.log(detail);
                    logStore(key, text);
                }
                function warn(key, msg = "DEBUG", time = 0, detail) {
                    const icon = "🛠️";
                    const text = logFormat({ icon, key, time, msg });
                    console.warn(text);
                    if (detail !== undefined) console.warn(detail);
                    logStore(key, text);
                    errorMark(key, msg, false);
                }
                function error(key, msg = "ERROR", time = 0, detail) {
                    const icon = "👾";
                    const text = logFormat({ icon, key, time, msg });
                    console.error(text);
                    if (detail !== undefined) console.error(detail);
                    logStore(key, text);
                    errorMark(key, msg, true);
                }
                function errorMark(key, msg = "Unknown", isFatal = true) {
                    const mod = VBN_GLOBAL_LOGIC.get(key);
                    if (!mod) return;
                    mod.error = isFatal;
                    mod.errorMSG = msg;
                }
                
                function infoTotal() {
                    const all = VBN_GLOBAL_LOGIC.getAllModules?.() || {};
                    for (const [key, mod] of Object.entries(all)) {
                        const icon = mod.error      ? "👾" :
                                    mod.debug      ? "🛠️" :
                                    mod.state      ? "🚀" : "🏁";
                        const msg = mod.errorMSG || (mod.error ? "ERROR" : "DONE");
                        const time = mod.timeCost || 0;
                        console.log(logFormat({ icon, key, time, msg }));
                    }
                    if (VBN_GLOBAL_CONFIG.debug) {
                        const stats = VBN_OBSERVER_CENTER.getActiveCount();
                        console.log(`${VBN}[👁️][observer] | Anonymous - ${stats.anonymous}`);
                        console.log(`${VBN}[👁️][observer] | Keyed - ${stats.keyed}`);
                        console.log(`${VBN}[👁️][observer] | Total - ${stats.byTarget}`);
                    }
                }
                
                return {
                    log,
                    warn,
                    error,
                    errorMark,
                    infoTotal
                };
                
            })();
            
            
            const VBN_MATCH_RULE = (() => {
                
                function toRegex(pattern) {
                    if (VBN_VALUE_STORE.regex.has(pattern)) return VBN_VALUE_STORE.regex.get(pattern);
                    const escaped = pattern
                        .replace(/([.+^${}()|[\]\\])/g, '\\$1')
                        .replace(/\*/g, '.*')
                        .replace(/^https?:/, 'https?:');
                    const regex = new RegExp('^' + escaped + '$', 'i');
                    VBN_VALUE_STORE.regex.set(pattern, regex);
                    return regex;
                }
                
                function check(pattern, target) {
                    return toRegex(pattern).test(target);
                }
                
                function match({ include = [], exclude = [], url = vbnMatchURL } = {}) {
                    if (include.length === 1 && include[0] === "*" && exclude.length === 0) {
                        return true;
                    }
                    return (
                        include.some(rule => check(rule, url)) &&
                        !exclude.some(rule => check(rule, url))
                    );
                }
                
                return { toRegex, check, match };
                
            })();
            
            
            const VBN_MODULE_STORE = (() => {
                
                const flat = {};
                const tree = {};
                
                function moduleBase(key, raw, parentKey = null) {
                    return {
                        key,
                        parent: parentKey ?? null,
                        fold: raw.fold ?? false,
                        name: " ",
                        feature: " ",
                        state: true,
                        default: true,
                        debug: false,
                        match: raw.match ?? {},
                        ...raw,
                    };
                }
                
                for (const [groupName, groupData] of Object.entries(VBN_GLOBAL_MODULES)) {
                    const groupNode = {};
                    const groupFold = groupData.fold ?? false;
                    
                    for (const [modKey, modRaw] of Object.entries(groupData)) {
                        if (modKey === "fold") continue;
                        const mod = moduleBase(modKey, modRaw);
                        flat[modKey] = mod;
                        groupNode[modKey] = mod;
                        
                        for (const [subKey, subRaw] of Object.entries(modRaw)) {
                            if (
                                ["match", "state", "default", "feature", "debug", "name", "fold"].includes(subKey)
                                || typeof subRaw !== "object"
                            ) continue;
                            const subMod = moduleBase(subKey, subRaw, modKey);
                            flat[subKey] = subMod;
                            if (!groupNode[modKey].subs) groupNode[modKey].subs = {};
                            groupNode[modKey].subs[subKey] = subMod;
                        }
                    }
                    tree[groupName] = {
                        ...groupNode,
                        fold: groupFold,
                    };
                }
                
                function getGroup(key) {
                    if (VBN_VALUE_STORE.group.has(key)) return VBN_VALUE_STORE.group.get(key);
                    for (const [groupName, modules] of Object.entries(tree)) {
                        if (key in modules) {
                            VBN_VALUE_STORE.group.set(key, groupName);
                            return groupName;
                        }
                        for (const mod of Object.values(modules)) {
                            if (mod && mod.subs && key in mod.subs) {
                                VBN_VALUE_STORE.group.set(key, groupName);
                                return groupName;
                            }
                        }
                    }
                    VBN_VALUE_STORE.group.set(key, null);
                    return null;
                }
                
                function getChain(key, { includeGroup = false } = {}) {
                    if (VBN_VALUE_STORE.chain.has(key)) return VBN_VALUE_STORE.chain.get(key);
                    const chain = [];
                    let current = flat[key];
                    while (current) {
                        chain.unshift(current.key);
                        current = current.parent ? flat[current.parent] : null;
                    }
                    if (includeGroup) {
                        const group = getGroup(key);
                        if (group) chain.unshift(group);
                    }
                    VBN_VALUE_STORE.chain.set(key, chain);
                    return chain;
                }
                
                return {
                    get: key => flat[key],
                    getFlat: () => flat,
                    getTree: () => tree,
                    getGroup,
                    getChain,
                };
                
            })();
            
            
            const VBN_ACTIVATION = (() => {
                
                const defaultMatch = { include: ["*"], exclude: [] };
                
                function findMatch(mod) {
                    if (!mod) return defaultMatch;
                    if (VBN_VALUE_STORE.match.has(mod.key)) return VBN_VALUE_STORE.match.get(mod.key);
                    
                    let result;
                    if (mod.match?.include?.length || mod.match?.exclude?.length) {
                        result = mod.match;
                    } else if (mod.parent) {
                        result = findMatch(VBN_MODULE_STORE.get(mod.parent));
                    } else {
                        result = defaultMatch;
                    }
                    VBN_VALUE_STORE.match.set(mod.key, result);
                    return result;
                }
                
                function getValue(key, fallback = true) {
                    if (VBN_VALUE_STORE.prefs.has(key)) return VBN_VALUE_STORE.prefs.get(key);
                    const val = GM_getValue(key, fallback);
                    VBN_VALUE_STORE.prefs.set(key, val);
                    return val;
                }
                
                function clearCache(key) {
                    if (key) {
                        VBN_VALUE_STORE.prefs.delete(key);
                        VBN_VALUE_STORE.match.delete(key);
                    } else {
                        VBN_VALUE_STORE.prefs.clear();
                        VBN_VALUE_STORE.match.clear();
                    }
                }
                
                function isBlocked(module, url = vbnMatchURL) {
                    const blockList = VBN_GLOBAL_CONFIG.siteBlock?.[module.group];
                    if (!blockList?.length) return false;
                    return blockList.some(pattern => VBN_MATCH_RULE.check(pattern, url));
                }
                
                function isActive(module, options = {}) {
                    const url = options.url ?? vbnMatchURL;
                    const matchRule = options.matchSubjoin || findMatch(module);
                    const matched = VBN_MATCH_RULE.match({
                        include: matchRule.include,
                        exclude: matchRule.exclude,
                        url
                    });
                    if (!matched) return false;
                    const keyChain = VBN_MODULE_STORE.getChain(module.key, { includeGroup: true });
                    return keyChain.every(key => getValue(key, true));
                }
                
                return {
                    isActive,
                    isBlocked,
                    clearCache
                };
                
            })();
            
            
            const VBN_GLOBAL_LOGIC = (() => {
                
                let hasPreheated = false;
                
                function preheat() {
                    if (hasPreheated) return;
                    hasPreheated = true;
                    
                    const all = VBN_MODULE_STORE.getFlat();
                    for (const key in all) {
                        const mod = all[key];
                        VBN_MODULE_STORE.getGroup(key);
                        VBN_MODULE_STORE.getChain(key, { includeGroup: true });
                        VBN_ACTIVATION.isActive(mod);
                    }
                }
                
                function activate(key, rule, logic) {
                    let options = {};
                    if (typeof rule === "function") {
                        logic = rule;
                    } else if (typeof rule === "object") {
                        options = rule;
                    }
                    
                    const mod = VBN_MODULE_STORE.get(key);
                    if (!mod || mod.state === false) return false;
                    
                    if (VBN_ACTIVATION.isBlocked(mod, options.url)) {
                        if (VBN_GLOBAL_CONFIG.debug)
                            VBN_GLOBAL_DEBUG.warn(key, `siteBlock - ${VBN_MODULE_STORE.getGroup(key)}`);
                        return false;
                    }
                    
                    const active = VBN_ACTIVATION.isActive(mod, options);
                    if (typeof logic !== "function") return active;
                    
                    if (active) {
                        const start = performance.now();
                        try {
                            logic();
                            mod.timeCost = performance.now() - start;
                            if (VBN_GLOBAL_CONFIG.debug || mod.debug)
                                VBN_GLOBAL_DEBUG.log(key, "DONE", mod.timeCost);
                        } catch (e) {
                            mod.timeCost = performance.now() - start;
                            VBN_GLOBAL_DEBUG.error(key, e?.message || "ERROR", mod.timeCost);
                        }
                    }
                    
                    return active;
                }
                
                return {
                    get: VBN_MODULE_STORE.get,
                    getAllModules: VBN_MODULE_STORE.getFlat,
                    activate,
                    preheat,
                };
                
            })();
            
            
            // const VBN_GLOBAL_LOGIC = (() => {
                
            //     let hasPreheated = false;
            //     const waitQueue = [];
            //     let waitTimer = null;
            //     let lastURL = location.href;
                
            //     function preheat() {
            //         if (hasPreheated) return;
            //         hasPreheated = true;
                    
            //         const all = VBN_MODULE_STORE.getFlat();
            //         for (const key in all) {
            //             const mod = all[key];
            //             VBN_MODULE_STORE.getGroup(key);
            //             VBN_MODULE_STORE.getChain(key, { includeGroup: true });
            //             VBN_ACTIVATION.isActive(mod);
            //         }
            //     }
                
            //     function logicNow(logic, mod, key) {
            //         const start = performance.now();
            //         try {
            //             logic();
            //             mod.timeCost = performance.now() - start;
            //             if (VBN_GLOBAL_CONFIG.debug || mod.debug) {
            //                 VBN_GLOBAL_DEBUG.log(key, "DONE", mod.timeCost);
            //             }
            //         } catch (e) {
            //             mod.timeCost = performance.now() - start;
            //             VBN_GLOBAL_DEBUG.error(key, e?.message || "ERROR", mod.timeCost);
            //         }
            //     }
                
            //     function logicSchedule(logic, mod, key) {
            //         waitQueue.push({ logic, mod, key, waited: 0 });
                    
            //         if (!waitTimer) {
            //             waitTimer = setInterval(() => {
            //                 const interval = 100;
            //                 for (let i = waitQueue.length - 1; i >= 0; i--) {
            //                     const task = waitQueue[i];
            //                     task.waited += interval;
                                
            //                     const ready = document.readyState === "complete" && document.body && document.head;
                                
            //                     if (ready) {
            //                         logicNow(task.logic, task.mod, task.key);
            //                         waitQueue.splice(i, 1);
            //                     } else if (task.waited > 12000) { // 最长等待 12 秒
            //                         if (VBN_GLOBAL_CONFIG.debug || task.mod.debug) {
            //                             VBN_GLOBAL_DEBUG.warn(task.key, "页面元素未完全就绪 逻辑执行跳过");
            //                         }
            //                         waitQueue.splice(i, 1);
            //                     }
            //                 }
            //                 if (waitQueue.length === 0) {
            //                     clearInterval(waitTimer);
            //                     waitTimer = null;
            //                 }
            //             }, 92);
            //         }
            //     }
                
            //     function activate(key, rule, logic) {
                    
            //         let options = {};
            //         if (typeof rule === "function") {
            //             logic = rule;
            //         } else if (typeof rule === "object") {
            //             options = rule;
            //         }
                    
            //         const mod = VBN_MODULE_STORE.get(key);
            //         if (!mod || mod.state === false) return false;
                    
            //         if (VBN_ACTIVATION.isBlocked(mod, options.url)) {
            //             if (VBN_GLOBAL_CONFIG.debug)
            //                 VBN_GLOBAL_DEBUG.warn(key, `siteBlock - ${VBN_MODULE_STORE.getGroup(key)}`);
            //             return false;
            //         }
                    
            //         const active = VBN_ACTIVATION.isActive(mod, options);
            //         if (typeof logic !== "function") return active;
                    
            //         if (active) {
                        
            //             logicNow(logic, mod, key);
                        
            //             if (!(document.body && document.head && document.readyState === "complete")) {
            //                 logicSchedule(logic, mod, key);
            //             }
            //         }
                    
            //         return active;
            //     }
                
            //     setInterval(() => {
            //         const currentURL = location.href;
            //         if (currentURL !== lastURL) {
            //             lastURL = currentURL;
            //             hasPreheated = false;
            //             preheat();
            //             const all = VBN_MODULE_STORE.getFlat();
            //             for (const key in all) {
            //                 const mod = all[key];
            //                 if (mod && mod.default !== false) {
            //                     activate(key, () => {});
            //                 }
            //             }
            //         }
            //     }, 500);
                
            //     return {
            //         get: VBN_MODULE_STORE.get,
            //         getAllModules: VBN_MODULE_STORE.getFlat,
            //         activate,
            //         preheat,
            //     };
                
            // })();
            
        // #endregion
        
        
        // #region Manager
        
            const VBN_OBSERVER_CENTER = (() => {
                
                const observerAnonym = new Set();
                const observerKey = new Map();
                let observerTarget = new WeakMap();
                
                function observe(target, options = { childList: true, subtree: true }, callback, config = {}) {
                    if (!(target instanceof Node)) return null;
                    if (config.preventDuplicate && observerTarget.has(target)) return null;
                    
                    const observerBase = new MutationObserver((mutations, observerInstance) => {
                        try {
                            callback(mutations, observerInstance);
                        } catch (err) {
                            document.documentElement.classList.add("vbnTips", "correct");
                        }
                        if (config.autoDisconnect || (typeof config.onceWhen === "function" && config.onceWhen(mutations))) {
                            disconnectTarget(target, observerBase);
                        }
                    });
                    
                    observerBase.observe(target, options);
                    observerAnonym.add(observerBase);
                    _addToTargetMap(target, observerBase);
                    return observerBase;
                }
                
                function observeWithKey(key, target, options = { childList: true, subtree: true }, callback, config = {}) {
                    if (!key || typeof key !== "string" || !(target instanceof Node)) return null;
                    
                    if (observerKey.has(key)) {
                        observerKey.get(key).disconnect();
                        observerKey.delete(key);
                    }
                    const observerBase = new MutationObserver((mutations, observerInstance) => {
                        try {
                            callback(mutations, observerInstance);
                        } catch (err) {
                            document.documentElement.classList.add("vbnTips", "error");
                        }
                        if (config.autoDisconnect || (typeof config.onceWhen === "function" && config.onceWhen(mutations))) {
                            disconnectKey(key);
                            _removeFromTargetMap(target, observerBase);
                        }
                    });
                    
                    observerBase.observe(target, options);
                    observerKey.set(key, observerBase);
                    _addToTargetMap(target, observerBase);
                    return observerBase;
                }
                
                function disconnect(target) {
                    const observerSet = observerTarget.get(target);
                    if (observerSet) {
                        observerSet.forEach(observerBase => {
                            observerBase.disconnect();
                            observerAnonym.delete(observerBase);
                        });
                        observerTarget.delete(target);
                    }
                }
                function disconnectTarget(target, observerBase) {
                    observerBase.disconnect();
                    observerAnonym.delete(observerBase);
                    _removeFromTargetMap(target, observerBase);
                }
                function disconnectKey(key) {
                    const observerBase = observerKey.get(key);
                    if (observerBase) {
                        observerBase.disconnect();
                        observerKey.delete(key);
                    }
                }
                
                function disconnectAll() {
                    observerAnonym.forEach(observerBase => observerBase.disconnect());
                    observerKey.forEach(observerBase => observerBase.disconnect());
                    observerAnonym.clear();
                    observerKey.clear();
                    observerTarget = new WeakMap();
                }
                function hasKey(key) {
                    return observerKey.has(key);
                }
                function getActiveCount() {
                    let totalTargeted = 0;
                    observerTarget.forEach(set => totalTargeted += set.size);
                    return {
                        anonymous: observerAnonym.size,
                        keyed: observerKey.size,
                        byTarget: totalTargeted
                    };
                }
                function _addToTargetMap(target, observerBase) {
                    if (!observerTarget.has(target)) {
                        observerTarget.set(target, new Set());
                    }
                    observerTarget.get(target).add(observerBase);
                }
                function _removeFromTargetMap(target, observerBase) {
                    const set = observerTarget.get(target);
                    if (set) {
                        set.delete(observerBase);
                        if (set.size === 0) observerTarget.delete(target);
                    }
                }
                
                return {
                    observe,
                    observeWithKey,
                    disconnect,
                    disconnectKey,
                    disconnectAll,
                    hasKey,
                    getActiveCount
                };
                
            })();
            
        // #endregion
        
        
        // #region Builder
        
            const VBN_GLOBAL_DOM = (() => {
                
                let instance = null;
                const callbacks = [];
                
                function init() {
                    if (instance) return;
                    const div = document.createElement('div');
                    div.id = 'vbnDOM';
                    document.body.insertBefore(div, document.body.firstChild);
                    instance = div;
                }
                function ensureReady(callback) {
                    if (callback) callbacks.push(callback);
                    if (instance) {
                        while (callbacks.length) {
                            try { callbacks.shift()(instance); }
                            catch (e) { console.error(e); }
                        }
                        return instance;
                    }
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', () => {
                            init();
                            ensureReady();
                        });
                    } else {
                        init();
                        ensureReady();
                    }
                }
                
                return {
                    load(callback) {
                        if (callback) {
                            ensureReady(callback);
                        } else {
                            return new Promise(resolve => ensureReady(resolve));
                        }
                    },
                    get() {
                        return instance || document.querySelector('#vbnDOM');
                    }
                };
                
            })();
            
        // #endregion
        
        
        // #region Utils
        
            // const VBN_REMOVE_LIMITS = (() => {
            
                // 启用各类事件
                // 取消css阻止鼠标行为
                // 取消 前缀 尾缀
                
            // })();
            
            
            // const VBN_REMOVE_LOGIN = (() => {
            
            // })();
            
            
            /**
             * 类名添加 | 在定位的 DOM 结构上 添加自定义类名 「支持检测链接已访问后添加」
             * @param {Object} options
             * @param {number} [options.delay=0]                        - 进入页面后 延迟多久执行 「毫秒」
             * @param {string|string[]} options.target                  - 需添加类名的目标DOM 「选择器」 「支持多个」
             * @param {string|string[]} options.subjoin                 - 需添加的类名 「支持多个」
             * @param {boolean} [options.trace=false]                   - 是否启用 已访问的链接痕迹
             * @param {string} [options.traceQuery="a[href]"]           - 需查询的链接类型 「选择器」
             * @param {string[]|function} [options.traceJudge]          - 增强判定 检测链接中需包含的关键词
             */
            const VBN_ADD_CLASS = (() => {
                
                const storageKey = 'vbnVisitedLinks';
                const attrMark = 'data-vbn-trace';
                
                function apply({
                    delay = 260,
                    target,
                    subjoin,
                    trace = false,
                    traceQuery = "a[href]",
                    traceJudge,
                }) {
                    const packSelector = Array.isArray(target) ? target : [target];
                    const packClass = Array.isArray(subjoin) ? subjoin : [subjoin];
                    const visitedSet = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'));
                    const observerKey = `subjoin_${packSelector.join('_')}_${packClass.join('_')}`;
                    
                    function defaultShouldApply(el) {
                        const links = el.querySelectorAll(traceQuery);
                        return [...links].some(link => {
                            const href = link.getAttribute("href");
                            if (!href) return false;
                            
                            const isTraceTarget =
                                typeof traceJudge === "function"
                                    ? traceJudge(href)
                                    : Array.isArray(traceJudge)
                                        ? traceJudge.every(keyword => href.includes(keyword))
                                        : true;
                                        
                            return isTraceTarget && visitedSet.has(href);
                        });
                    }
                    
                    function applyClass(el) {
                        packClass.forEach(cls => {
                            if (!el.classList.contains(cls)) {
                                el.classList.add(cls);
                            }
                        });
                        el.setAttribute(attrMark, "true");
                    }
                    
                    function processDOM() {
                        packSelector.forEach(sel => {
                            document.querySelectorAll(sel).forEach(el => {
                                if (el.hasAttribute(attrMark)) return;
                                
                                if (trace) {
                                    if (defaultShouldApply(el)) applyClass(el);
                                } else {
                                    applyClass(el);
                                }
                            });
                        });
                    }
                    
                    function setupClickTracking() {
                        if (!trace || window._VBN_CLICK_TRACK_INITED) return;
                        window._VBN_CLICK_TRACK_INITED = true;
                        
                        document.body.addEventListener("click", e => {
                            const anchor = e.target.closest(traceQuery);
                            if (!anchor) return;
                            
                            const href = anchor.getAttribute("href");
                            if (!href) return;
                            
                            const isTraceTarget =
                                typeof traceJudge === "function"
                                    ? traceJudge(href)
                                    : Array.isArray(traceJudge)
                                        ? traceJudge.every(keyword => href.includes(keyword))
                                        : true;
                                        
                            if (!isTraceTarget) return;
                            
                            visitedSet.add(href);
                            localStorage.setItem(storageKey, JSON.stringify([...visitedSet]));
                            
                            packSelector.forEach(sel => {
                                const el = anchor.closest(sel);
                                if (el) applyClass(el);
                            });
                        });
                    }
                    
                    function startObserve() {
                        processDOM();
                        setupClickTracking();
                        
                        VBN_OBSERVER_CENTER.observeWithKey(
                            observerKey,
                            document.body,
                            { childList: true, subtree: true },
                            processDOM,
                            { preventDuplicate: true, autoDisconnect: false }
                        );
                    }
                    
                    if (delay > 0) setTimeout(startObserve, delay);
                    else startObserve();
                }
                
                return { apply };
                
            })();
            
            
            /**
             * 自动执行 | 进入页面后 自动执行一系列操作 「最多可支持10个步骤」
             * @param {Object} options
             * @param {number} [options.delay=200]                 - 延迟 起始执行 「毫秒」
             * @param {number} [options.delayStep=20]              - 延迟 每个执行步骤间 「毫秒」
             * @param {boolean} [options.backstage=false]          - 后台执行 页面未激活/未在前台时 是否执行
             * @param {boolean} [options.strict=false]             - 严格模式 若某步骤执行失败 是否中断后续步骤
             * @param {boolean} [options.debug=false]              - 调试输出
             * @param {Object} [options.step1.step10]              - 定义每个步骤的目标及操作类型
             *      - target：目标选择器
             *      - action：执行类型 "click" | "focus" | "hover"
             */
            const VBN_AUTO_EXECUTE = (() => {
                
                const maxAutoStep = 10;
                const moduleMark = "AUTO_EXECUTE";
                
                function runAction(el, action = "click") {
                    if (!el) return false;
                    switch (action) {
                        case "click": el.click(); break;
                        case "focus": el.focus(); break;
                        case "hover":
                            const event = new MouseEvent("mouseover", { bubbles: true });
                            el.dispatchEvent(event);
                            break;
                    }
                    return true;
                }
                function apply(options = {}) {
                    const {
                        delay = 200,
                        delayStep = 20,
                        backstage = false,
                        strict = false,
                        debug = false
                    } = options;
                    
                    const steps = [];
                    for (let i = 1; i <= maxAutoStep; i++) {
                        const key = `step${i}`;
                        if (options[key]) steps.push(options[key]);
                    }
                    
                    if (!steps.length) return;
                    let executed = false;
                    
                    const run = () => {
                        if (executed) return;
                        executed = true;
                        let shouldBreak = false;
                        setTimeout(() => {
                            steps.forEach((step, i) => {
                                const { target, action = "click" } = step;
                                const delayEach = delayStep * i;
                                setTimeout(() => {
                                    if (shouldBreak) return;
                                    try {
                                        const el = document.querySelector(target);
                                        if (el) {
                                            runAction(el, action);
                                            VBN_GLOBAL_DEBUG.log(moduleMark, `Step${i + 1} ✅ ${action} - ${target}`, { debug });
                                        } else {
                                            VBN_GLOBAL_DEBUG.warn(moduleMark, `Step${i + 1} ❓ None - ${target}`, { debug });
                                            if (strict) {
                                                shouldBreak = true;
                                                VBN_GLOBAL_DEBUG.error(moduleMark, `Step${i + 1} ❌ Break`, { debug });
                                            }
                                        }
                                    } catch (e) {
                                        VBN_GLOBAL_DEBUG.error(moduleMark, `Step${i + 1} ❌ Error - ${e.message}`, { debug });
                                    }
                                }, delayEach);
                            });
                        }, delay);
                    };
                    const tryRun = () => {
                        if (executed) return;
                        if (!backstage && document.visibilityState !== "visible") return;
                        run();
                    };
                    
                    document.addEventListener("DOMContentLoaded", tryRun);
                    document.addEventListener("visibilitychange", tryRun);
                }
                
                return { apply };
                
            })();
            
            
            /**
             * 自动加载 - smart | loadInfinite | multipage
             * @param {Object} options
             * @param {'smart'|'loadInfinite'|'multipage'} [options.mode='smart']      - 加载模式 智能滚动加载 | 无限滚动加载 | 一次加载多页 
             * @param {number} [options.loadPage=9]                                    - 加载页数 「仅在 multipage 模式下生效」
             * @param {string} [options.itemTarget="#container .c-container"]          - 内容所在容器 「父选择器」
             * @param {string|HTMLElement} [options.itemWrapper="#container"]          - 将新加载内容插入至何处 「选择器」
             * @param {string} [options.buttonPrev=".page-prev"]                       - 上一页按钮 「选择器」
             * @param {string} [options.buttonNext=".page-next"]                       - 下一页按钮 「选择器」
             * @param {boolean} [options.fragment=false]                               - 统一加载 是否启用 「加载每页的完整内容后统一插入」
             * @param {boolean} [options.throttle=true]                                - 动态加载 是否启用 「可防止性能及其他问题」
             * @param {number} [options.throttleBase=10]                               - 动态加载 延迟 基础
             * @param {number} [options.throttleJitter=50]                             - 动态加载 延迟 随机波动
             */
            const VBN_AUTO_LOAD = (() => {
                
                function apply({
                    mode = "smart",
                    loadPage = 9,
                    itemTarget = "#container .c-container",
                    itemWrapper = "#container",
                    buttonPrev = ".page-prev",
                    buttonNext = ".page-next",
                    fragment = false,
                    throttle = true,
                    throttleBase = 30,
                    throttleJitter = 70,
                } = {}) {
                    const currentPage = getCurrentPage();
                    const wrapperEl = typeof itemWrapper === "string"
                        ? document.querySelector(itemWrapper)
                        : itemWrapper;
                    if (!wrapperEl) return;
                    
                    let loading = false;
                    let loadedPage = currentPage;
                    
                    
                    // (() => {
                    //     const nextBtnSelector = "#ct .pg .nxt";
                    //     const nextBtn = document.querySelector(nextBtnSelector);
                    //     if (!nextBtn) return;

                    //     const nextPageUrl = nextBtn.href || nextBtn.getAttribute("href");

                    //     fetch(nextPageUrl, { credentials: 'same-origin' })
                    //         .then(res => res.text())
                    //         .then(html => {
                    //             const temp = document.createElement("div");
                    //             temp.innerHTML = html;

                    //             const newItems = temp.querySelectorAll("#threadlist > ul > li");

                    //             const wrapper = document.querySelector("#threadlist > ul");
                    //             if (!wrapper) return;

                    //             newItems.forEach((el, i) => {
                    //                 el.style.display = "";
                    //                 wrapper.appendChild(el.cloneNode(true));
                    //             });

                    //         })
                    //         .catch(err);
                    // })();
                    
                    
                    function loadSinglePage(pageNum) {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                $.get(buildPageUrl(pageNum), html => {
                                    const temp = document.createElement("div");
                                    temp.innerHTML = html;
                                    const items = temp.querySelectorAll(itemTarget);
                                    const mount = fragment ? document.createDocumentFragment() : wrapperEl;
                                    items.forEach(el => {
                                        el.classList.add("vbnFadeInLoad");
                                        mount.appendChild(el);
                                    });
                                    if (fragment) wrapperEl.appendChild(mount);
                                    requestAnimationFrame(() => {
                                        wrapperEl.querySelectorAll(".vbnFadeInLoad:not(.vbnLoaded)").forEach(el => {
                                            el.classList.add("vbnLoaded");
                                        });
                                    });
                                    resolve();
                                });
                            }, throttle ? (pageNum * throttleBase + Math.random() * throttleJitter) : 0);
                        });
                    }
                    
                    if (mode === "multipage") {
                        const nextBtn = document.querySelector(buttonNext);
                        if (nextBtn) {
                            nextBtn.href = buildPageUrl(currentPage + loadPage + 1);
                            nextBtn.textContent = `Next ${loadPage + 1}`;
                        }
                        const promises = [];
                        for (let i = 1; i <= loadPage; i++) {
                            const pageNum = currentPage + i;
                            promises.push(loadSinglePage(pageNum));
                        }
                        return Promise.all(promises);
                    }
                    
                    if (mode === "smart") {
                        let inPreloadZone = false;
                        let hasScrolledUp = false;
                        let lastScrollTop = window.pageYOffset;
                        let accumulatedScrollUp = 0;
                        const threshold = 50;
                        let observer = null;
                        
                        const tryLoadNext = () => {
                            if (inPreloadZone && hasScrolledUp && !loading) {
                                loading = true;
                                loadedPage += 1;
                                observer.disconnect();
                                loadSinglePage(loadedPage).then(() => {
                                    const url = new URL(location.href);
                                    url.searchParams.set("page", loadedPage);
                                    history.replaceState(null, "", url.toString());
                                    hasScrolledUp = false;
                                    accumulatedScrollUp = 0;
                                    observeLastItem();
                                }).finally(() => {
                                    loading = false;
                                });
                            }
                        };
                        
                        const observerCallback = entries => {
                            const entry = entries[0];
                            inPreloadZone = entry.isIntersecting;
                            tryLoadNext();
                        };
                        
                        observer = new IntersectionObserver(observerCallback, {
                            rootMargin: "500px"
                        });
                        
                        function observeLastItem() {
                            const items = wrapperEl.querySelectorAll(itemTarget);
                            const lastItem = items[items.length - 1];
                            if (lastItem) observer.observe(lastItem);
                        }
                        
                        observeLastItem();
                        
                        window.addEventListener("scroll", () => {
                            const scrollTop = window.pageYOffset;
                            const diff = lastScrollTop - scrollTop;
                            if (diff > 0) {
                                accumulatedScrollUp += diff;
                                if (accumulatedScrollUp >= threshold) {
                                    hasScrolledUp = true;
                                }
                            } else if (diff < 0) {
                                tryLoadNext();
                            }
                            lastScrollTop = scrollTop;
                        });
                        
                        return;
                    }
                    
                    if (mode === "loadInfinite") {
                        const observer = new IntersectionObserver(entries => {
                            const entry = entries[0];
                            if (!entry.isIntersecting || loading) return;
                            loading = true;
                            loadedPage += 1;
                            observer.unobserve(entry.target);
                            loadSinglePage(loadedPage).then(() => {
                                const url = new URL(location.href);
                                url.searchParams.set("page", loadedPage);
                                history.replaceState(null, "", url.toString());
                                observeLastItem();
                            }).finally(() => {
                                loading = false;
                            });
                        }, {
                            rootMargin: "500px"
                        });
                        
                        function observeLastItem() {
                            const items = wrapperEl.querySelectorAll(itemTarget);
                            const lastItem = items[items.length - 1];
                            if (lastItem) observer.observe(lastItem);
                        }
                        observeLastItem();
                    }
                }
                
                function getCurrentPage() {
                    const match = location.href.match(/page=(\d+)/);
                    return match ? parseInt(match[1]) : 1;
                }
                
                function buildPageUrl(page) {
                    const url = new URL(location.href);
                    url.searchParams.set("page", page);
                    return url.toString();
                }
                
                return { apply };
                
            })();
            
            
            // const VBN_QUICK_READ = (() => {
                
            //     function apply({
            //         scroll = true,
            //         smooth = true,
            //         ratio = .8,
            //         buttonPrev = "#page-prev",
            //         buttonNext = "#page-next",
            //     } = {}) {
                    
            //         const doScroll = (y) => window.scrollBy({ top: y, left: 0, behavior: smooth ? "smooth" : "auto" });
                    
            //         document.addEventListener('keydown', function(e) {
            //             const tag = e.target.tagName.toLowerCase();
            //             if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
                        
            //             switch (e.key) {
            //                 case "ArrowLeft": {
            //                     const prevBtn = document.querySelector(buttonPrev);
            //                     if (prevBtn) prevBtn.click();
            //                     e.preventDefault();
            //                     break;
            //                 }
            //                 case "ArrowRight": {
            //                     const nextBtn = document.querySelector(buttonNext);
            //                     if (nextBtn) nextBtn.click();
            //                     e.preventDefault();
            //                     break;
            //                 }
            //                 case "ArrowUp":
            //                     if (scroll) {
            //                         doScroll(-window.innerHeight * ratio);
            //                         e.preventDefault();
            //                     }
            //                     break;
            //                 case "ArrowDown":
            //                     if (scroll) {
            //                         doScroll(window.innerHeight * ratio);
            //                         e.preventDefault();
            //                     }
            //                     break;
            //             }
            //         });
                    
            //     }
                
            //     return { apply };
                
            // })();
            
            const VBN_QUICK_READ = (() => {
                
                function apply({
                    scroll = true,
                    smooth = true,
                    ratio = .8,
                    letterKey = true,
                    buttonPrev = "#page-prev",
                    buttonNext = "#page-next",
                } = {}) {
                    const doScroll = (y) => window.scrollBy({
                        top: y,
                        left: 0,
                        behavior: smooth ? "smooth" : "auto"
                    });
                    
                    const keyMap = {
                        ArrowLeft: () => document.querySelector(buttonPrev)?.click(),
                        ArrowRight: () => document.querySelector(buttonNext)?.click(),
                        ArrowUp: () => scroll && doScroll(-window.innerHeight * ratio),
                        ArrowDown: () => scroll && doScroll(window.innerHeight * ratio),
                    };
                    if (letterKey) Object.assign(keyMap, {
                        a: keyMap.ArrowLeft,
                        d: keyMap.ArrowRight,
                        w: keyMap.ArrowUp,
                        s: keyMap.ArrowDown,
                    });
                    
                    document.addEventListener("keydown", (e) => {
                        const tag = e.target.tagName.toLowerCase();
                        if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
                        
                        const action = keyMap[e.key] || keyMap[e.key.toLowerCase()];
                        if (action) {
                            action();
                            e.preventDefault();
                        }
                    });
                }
                
                return { apply };
                
            })();
            
            
        // #endregion
        
        
        // #region Derive
        
            const VBN = {
                SITE: VBN_SITE_GROUP,
                CONFIG: VBN_GLOBAL_CONFIG,
                MODULE: VBN_GLOBAL_MODULES,
                
                VALUE: VBN_VALUE_STORE,
                INFORM: VBN_GLOBAL_INFORM,
                DEBUG: VBN_GLOBAL_DEBUG,
                
                MATCH: VBN_MATCH_RULE,
                STORE: VBN_MODULE_STORE,
                ACTIVATION: VBN_ACTIVATION,
                LOGIC: VBN_GLOBAL_LOGIC,
                
                OBSERVER: VBN_OBSERVER_CENTER,
                DOM: VBN_GLOBAL_DOM,
                
                CLASS: VBN_ADD_CLASS,
                EXECUTE: VBN_AUTO_EXECUTE,
                LOAD: VBN_AUTO_LOAD,
            };
            
            VBN.LOGIC.preheat();
            
        // #endregion
        
        
        // #region Options
        
            (function VBN_Options() {
                
                const pendingChanges = {};
                const easterEggAttachedSet = new WeakSet();
                
                function setToggleClass(toggle, meta, checked) {
                    toggle.classList.toggle("error", !!meta.error);
                    toggle.classList.toggle("warn", !meta.error && !!meta.debug);
                    toggle.classList.toggle("correct", !meta.error && !meta.debug && checked);
                }
                function updateOpacity(elem, enabled, checked) {
                    elem.style.opacity = enabled && checked ? 0.9 : 0.4;
                }
                
                function initFold(container, body, arrow, foldKey, initiallyFolded) {
                    
                    let folded = initiallyFolded;
                    
                    const toggleFold = () => {
                        const isCollapsed = folded;
                        body.classList.add("vbnOpen");
                        
                        if (isCollapsed) {
                            body.classList.remove("vbnClose");
                            const scrollHeight = body.scrollHeight + "px";
                            body.style.height = "0px";
                            requestAnimationFrame(() => body.style.height = scrollHeight);
                            body.addEventListener("transitionend", function onEnd() {
                                body.style.height = "auto";
                                body.classList.remove("vbnOpen");
                                body.removeEventListener("transitionend", onEnd);
                            }, { once: true });
                            arrow.classList.add("vbnRotated");
                            GM_setValue(foldKey, false);
                            folded = false;
                        } else {
                            const height = body.scrollHeight + "px";
                            body.style.height = height;
                            requestAnimationFrame(() => body.style.height = "0px");
                            setTimeout(() => {
                                body.classList.add("vbnClose");
                                body.classList.remove("vbnOpen");
                                body.style.height = "auto";
                            }, 226);
                            arrow.classList.remove("vbnRotated");
                            GM_setValue(foldKey, true);
                            folded = true;
                        }
                    };
                    
                    if (folded) {
                        body.classList.add("vbnClose");
                        body.style.height = "0px";
                        arrow.classList.remove("vbnRotated");
                    } else {
                        body.style.height = "auto";
                        arrow.classList.add("vbnRotated");
                    }
                    
                    container.addEventListener("click", e => {
                        e.stopPropagation();
                        toggleFold();
                    });
                }
                
                function buildSwitch(key, value, enabled, meta) {
                    
                    const row = document.createElement("label");
                    row.className = "vbnBodyRow";
                    updateOpacity(row, enabled, value);
                    
                    const span = document.createElement("span");
                    span.textContent = key;
                    span.style.userSelect = "none";
                    
                    const toggle = document.createElement("input");
                    toggle.type = "checkbox";
                    toggle.checked = value;
                    toggle.id = `vbnChild_${key}`;
                    toggle.disabled = !enabled;
                    toggle.classList.add("vbnStatusDot");
                    setToggleClass(toggle, meta, toggle.checked);
                    
                    toggle.addEventListener("change", () => {
                        pendingChanges[key] = toggle.checked;
                        toggle.classList.toggle("correct", toggle.checked);
                        updateOpacity(row, enabled, toggle.checked);
                    });
                    
                    row.append(span, toggle);
                    
                    const hoverText = meta?.errorMSG || meta?.feature || "";
                    if (hoverText) VBN_GLOBAL_INFORM.hover(row, hoverText);
                    
                    return { row, toggle };
                    
                }
                
                function syncSwitch(groupKey, groupData, groupToggle) {
                    pendingChanges[groupKey] = groupToggle.checked;
                    groupToggle.classList.toggle("correct", groupToggle.checked);
                    
                    for (const [modKey, mod] of Object.entries(groupData)) {
                        if (modKey === "fold") continue;
                        
                        const allKeys = [modKey];
                        if (mod.subs) allKeys.push(...Object.keys(mod.subs));
                        
                        allKeys.forEach(k => {
                            const checkbox = document.querySelector(`#vbnChild_${k}`);
                            if (!checkbox) return;
                            checkbox.disabled = !groupToggle.checked;
                            const parent = checkbox.closest(".vbnBodyRow, .vbnHeaderRow");
                            if (!parent) return;
                            updateOpacity(parent, groupToggle.checked, checkbox.checked);
                        });
                    }
                }
                
                function renderMod(modKey, mod, groupBody, groupEnabled) {
                    
                    if (modKey === "fold" || typeof mod.state !== "boolean") return;
                    
                    const currentVal = Boolean(GM_getValue(modKey, mod.default ?? true));
                    const foldedKey = `vbnFold_${modKey}`;
                    const foldedRaw = GM_getValue(foldedKey, null);
                    const folded = foldedRaw ?? mod.fold;
                    
                    if (mod.subs || mod.fold) {
                        const container = document.createElement("div");
                        container.className = "vbnPanelGroup Sub";
                        
                        const header = document.createElement("div");
                        header.className = "vbnGroupHeader";
                        
                        const toggleSubs = document.createElement("div");
                        toggleSubs.className = "vbnFoldBox";
                        toggleSubs.style.cursor = "pointer";
                        if (!easterEggAttachedSet.has(toggleSubs)) {
                            VBN_GLOBAL_INFORM.hover(toggleSubs, "HEIHEI 彩蛋 | ClickClick", 2);
                            easterEggAttachedSet.add(toggleSubs);
                        }
                        
                        const arrow = document.createElement("div");
                        arrow.className = "vbnArrow";
                        arrow.textContent = "›";
                        if (!folded) arrow.classList.add("vbnRotated");
                        toggleSubs.appendChild(arrow);
                        
                        const label = document.createElement("label");
                        label.className = "vbnHeaderRow";
                        
                        const span = document.createElement("span");
                        span.textContent = modKey;
                        span.style.marginRight = "auto";
                        span.style.userSelect = "none";
                        
                        const toggle = document.createElement("input");
                        toggle.type = "checkbox";
                        toggle.checked = currentVal;
                        toggle.id = `vbnChild_${modKey}`;
                        toggle.disabled = !groupEnabled;
                        toggle.classList.add("vbnStatusDot");
                        setToggleClass(toggle, mod, toggle.checked);
                        updateOpacity(label, groupEnabled, toggle.checked);
                        
                        toggle.addEventListener("change", () => {
                            pendingChanges[modKey] = toggle.checked;
                            toggle.classList.toggle("correct", toggle.checked);
                            updateOpacity(label, groupEnabled, toggle.checked);
                            
                            if (mod.subs) {
                                for (const [subKey] of Object.entries(mod.subs)) {
                                    const subCheckbox = document.querySelector(`#vbnChild_${subKey}`);
                                    if (subCheckbox) {
                                        subCheckbox.disabled = !toggle.checked;
                                        const parent = subCheckbox.closest(".vbnBodyRow");
                                        if (parent) {
                                            updateOpacity(parent, toggle.checked, subCheckbox.checked);
                                        }
                                    }
                                }
                            }
                        });
                        
                        label.append(span, toggle);
                        header.append(toggleSubs, label);
                        
                        const hoverText = mod.error ? mod.errorMSG : (mod.feature || "");
                        if (hoverText) VBN_GLOBAL_INFORM.hover(label, hoverText);
                        
                        const body = document.createElement("div");
                        body.className = "vbnGroupBody";
                        container.append(header, body);
                        
                        initFold(toggleSubs, body, arrow, foldedKey, folded);
                        
                        if (mod.subs) {
                            for (const [subKey, subMod] of Object.entries(mod.subs)) {
                                if (typeof subMod.state !== "boolean") continue;
                                const curVal = Boolean(GM_getValue(subKey, subMod.default ?? true));
                                const enabled = groupEnabled && currentVal;
                                const { row } = buildSwitch(subKey, curVal, enabled, subMod);
                                updateOpacity(row, enabled, curVal);
                                body.appendChild(row);
                            }
                        }
                        
                        groupBody.appendChild(container);
                    } else {
                        const { row } = buildSwitch(modKey, currentVal, groupEnabled, mod);
                        groupBody.appendChild(row);
                    }
                }
                
                function buildPanel() {
                    
                    if (document.querySelector("#vbnOptionsPanel")) return;
                    
                    const panel = document.createElement("div");
                    panel.id = "vbnOptionsPanel";
                    panel.className = "vbnPanelBase vbnOptionBase vbnFixed";
                    
                    const title = document.createElement("h2");
                    title.textContent = "Options";
                    panel.appendChild(title);
                    
                    const allModules = VBN_MODULE_STORE.getTree();
                    
                    for (const [groupName, groupData] of Object.entries(allModules)) {
                        const groupKey = groupName;
                        const groupEnabled = GM_getValue(groupKey, true);
                        
                        const groupContainer = document.createElement("div");
                        groupContainer.className = "vbnPanelGroup";
                        
                        const groupHeaderWrapper = document.createElement("div");
                        groupHeaderWrapper.className = "vbnGroupHeader";
                        
                        const arrowBox = document.createElement("div");
                        arrowBox.className = "vbnFoldBox";
                        
                        const toggleIcon = document.createElement("div");
                        toggleIcon.textContent = "›";
                        toggleIcon.className = "vbnArrow";
                        
                        const foldedRaw = GM_getValue(`vbnFold_${groupKey}`, null);
                        const folded = foldedRaw === null ? !!groupData.fold : (foldedRaw === true || foldedRaw === "true");
                        arrowBox.appendChild(toggleIcon);
                        
                        const groupHeader = document.createElement("label");
                        groupHeader.className = "vbnHeaderRow";
                        
                        const groupTitle = document.createElement("span");
                        groupTitle.textContent = groupName;
                        groupTitle.style.marginRight = "auto";
                        
                        const groupToggle = document.createElement("input");
                        groupToggle.type = "checkbox";
                        groupToggle.checked = groupEnabled;
                        groupToggle.classList.toggle("correct", groupEnabled);
                        
                        groupHeader.append(groupTitle, groupToggle);
                        groupHeaderWrapper.append(arrowBox, groupHeader);
                        groupContainer.appendChild(groupHeaderWrapper);
                        
                        const groupBody = document.createElement("div");
                        groupBody.className = "vbnGroupBody";
                        groupContainer.appendChild(groupBody);
                        
                        initFold(arrowBox, groupBody, toggleIcon, `vbnFold_${groupKey}`, folded);
                        
                        groupToggle.addEventListener("change", () => syncSwitch(groupKey, groupData, groupToggle));
                        
                        for (const [modKey, mod] of Object.entries(groupData)) {
                            if (modKey === "fold") continue;
                            renderMod(modKey, mod, groupBody, groupEnabled);
                        }
                        
                        panel.appendChild(groupContainer);
                    }
                    
                    const createButton = (text, className, onClick) => {
                        const btn = document.createElement("button");
                        btn.textContent = text;
                        btn.className = className;
                        btn.addEventListener("click", onClick);
                        return btn;
                    };
                    
                    const applyBtn = createButton("Apply", "vbnButtonBase vbnButtonAdapt vbnOpen", () => {
                        for (const [key, value] of Object.entries(pendingChanges)) {
                            GM_setValue(key, !!value);
                        }
                        VBN_GLOBAL_INFORM.top("已应用 即将刷新", "correct");
                        setTimeout(() => location.reload(), 1260);
                    });
                    const resetBtn = createButton("Reset", "vbnButtonBase vbnButtonAdapt vbnClose", () => {
                        const allModules = VBN_MODULE_STORE.getTree();
                        for (const [groupKey, groupData] of Object.entries(allModules)) {
                            GM_setValue(groupKey, true); // 模块组默认开启
                            for (const [modKey, mod] of Object.entries(groupData)) {
                                if (modKey === "fold") continue;
                                GM_setValue(modKey, mod.default ?? true); // 功能模块 采用默认值
                                if (mod.subs) {
                                    for (const [subKey, subMod] of Object.entries(mod.subs)) {
                                        GM_setValue(subKey, subMod.default ?? true); // 子功能 采用默认值
                                    }
                                }
                            }
                        }   
                        for (const [groupKey, groupData] of Object.entries(allModules)) {
                            GM_deleteValue(`vbnFold_${groupKey}`);
                            for (const [modKey, mod] of Object.entries(groupData)) {
                                GM_deleteValue(`vbnFold_${modKey}`);
                                if (mod.subs) {
                                    for (const subKey of Object.keys(mod.subs)) {
                                        GM_deleteValue(`vbnFold_${subKey}`);
                                    }
                                }
                            }
                        }
                        if (typeof VBN_VALUE_STORE?.reset === "function") {
                            VBN_VALUE_STORE.reset();
                        }
                        VBN_GLOBAL_INFORM.top("已重置 即将刷新", "correct");
                        setTimeout(() => location.reload(), 1260);
                    });
                    
                    panel.append(applyBtn, resetBtn);
                    
                    VBN_GLOBAL_DOM.load(dom => dom.appendChild(panel));
                    setTimeout(() => panel.classList.add("vbnShow"), 20);
                    setTimeout(() => {
                        const handleClickOutside = e => {
                            if (!panel.contains(e.target)) {
                                panel.classList.add("vbnHide");
                                setTimeout(() => {
                                    panel.remove();
                                    document.removeEventListener("click", handleClickOutside);
                                }, 526);
                            }
                        };
                        document.addEventListener("click", handleClickOutside);
                    }, 100);
                    
                }
                
                GM_registerMenuCommand("👽 Options Panel", buildPanel);
                
                document.addEventListener("keydown", e => {
                    const isComboWinLinux = e.ctrlKey && e.shiftKey && e.altKey;
                    const isComboMac = e.metaKey && e.shiftKey && e.altKey;
                    if ((isComboWinLinux || isComboMac) && e.key.toLowerCase() === 'x') {
                        e.preventDefault();
                        buildPanel();
                    }
                });
                
            })();
            
            
        // #endregion
        
        
        // #region Theme
        
            (function VBN_Theme() {
                
                const rule = {
                    light: [ 
                        "light", "light-theme", "theme-light",
                    ],
                    dark: [
                        "dark", "dark-theme", "theme-dark", "nb-theme-dark", "dark-mode",
                        "[data-kumuhana=pouli]", "[data-theme=dark]", "[data-color-mode=dark]",
                    ]
                };
                const antonym = {
                    light: [ "darker-dark-theme-deprecate", ],
                    dark: [ ]
                };
                
                let currentTheme = null;
                
                function themeSystem() {
                    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                    const light = window.matchMedia("(prefers-color-scheme: light)").matches;
                    return dark ? "dark" : light ? "light" : null;
                }
                
                function matchCount(target, keywords) {
                    if (!target) return 0;
                    const items = [
                        ...target.classList,
                        ...target.getAttributeNames?.().flatMap(name => {
                            const value = target.getAttribute(name);
                            return [name, `${name}=${value}`, `[${name}=${value}]`];
                        }) || []
                    ].map(s => s.toLowerCase());
                    return keywords.filter(k => items.includes(k.toLowerCase())).length;
                }
                
                function themeWebsite() {
                    const html = document.documentElement, body = document.body;
                    
                    let score = 0;
                    score += matchCount(html, antonym.dark) - matchCount(html, antonym.light);
                    score += matchCount(body, antonym.dark) - matchCount(body, antonym.light);
                    if (score !== 0) return score > 0 ? "dark" : "light";
                    
                    score = 0;
                    score += matchCount(html, rule.dark) - matchCount(html, rule.light);
                    score += matchCount(body, rule.dark) - matchCount(body, rule.light);
                    if (score !== 0) return score > 0 ? "dark" : "light";
                    
                    return null;
                }
                
                function subjoinClass() {
                    const html = document.documentElement;
                    
                    let newTheme = themeWebsite() || themeSystem();
                    if (!newTheme) newTheme = "light";
                    if (newTheme === currentTheme) return;
                    
                    html.classList.remove("vbnThemeLight", "vbnThemeDark");
                    html.classList.add(newTheme === "light" ? "vbnThemeLight" : "vbnThemeDark");
                    currentTheme = newTheme;
                }
                
                function debounce(fn, delay = 20) {
                    let timer;
                    return () => {
                        clearTimeout(timer);
                        timer = setTimeout(fn, delay);
                    };
                }
                
                function observeTargets() {
                    const targets = [document.documentElement];
                    if (document.body) targets.push(document.body);
                    
                    const observerOptions = { attributes: true };
                    const handler = debounce(subjoinClass, 20);
                    
                    targets.forEach((target, i) => {
                        VBN_OBSERVER_CENTER.observeWithKey(
                            `vbnTheme_${i}`,
                            target,
                            observerOptions,
                            handler,
                            { preventDuplicate: true, autoDisconnect: false }
                        );
                    });
                }
                
                function init() {
                    const start = () => {
                        subjoinClass();
                        observeTargets();
                        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", subjoinClass);
                        window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", subjoinClass);
                    };
                    if (document.readyState === "loading") {
                        document.addEventListener("DOMContentLoaded", start);
                    } else {
                        start();
                    }
                }
                
                init();
                
            })();
            
            
        // #endregion
        
        
        // #region LoaderBar
        
            VBN_GLOBAL_LOGIC.activate("LoaderBar", () => {
                
                (function VBN_LoaderBar() {
                    
                    function progressBarCreate() {
                        
                        let loaderBar = document.createElement('div');
                        loaderBar.id = 'vbnLoaderBar';
                        VBN_GLOBAL_DOM.load(dom => dom.appendChild(loaderBar));
                        
                        function loaderBarUpdate() {
                            let progress = (document.readyState === 'interactive') ? 80 : (document.readyState === 'complete' ? 100 : 0);
                            
                            loaderBar.style.width = progress + '%';
                            
                            if (progress === 100) {
                                setTimeout(() => {
                                    loaderBar.dataset.state = "vbnScrollBar";
                                    loaderBar.style.animation = "none";
                                    scrollBarUpdate();
                                    
                                    if (document.documentElement.scrollHeight > window.innerHeight) {
                                    window.addEventListener('scroll', scrollBarUpdate);
                                        loaderBar.style.display = 'block';
                                    } else {
                                        loaderBar.style.display = 'none';
                                    }
                                }, 260);
                            }
                        }
                        function scrollBarUpdate() {
                            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                            let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                            let scrollProgress = (scrollTop / scrollHeight) * 100;
                            loaderBar.style.width = scrollProgress + '%';
                        }
                        
                        document.addEventListener('readystatechange', loaderBarUpdate);
                        
                    }
                    
                    if (document.body) {
                        progressBarCreate();
                    } else {
                        VBN_OBSERVER_CENTER.observe(
                            document.documentElement,
                            { childList: true, subtree: true },
                            (mutations, observer) => {
                                if (document.body) {
                                    observer.disconnect();
                                    progressBarCreate();
                                }
                            },
                            { onceWhen: () => document.body !== null }
                        );
                    }
                    
                })();
                
            });
            
        // #endregion
        
        
        // #region ICON
        
            (function VBN_CustomICON() {
                
                // 配置映射关系 "网址" => "图标网址" / "变量" 「支持格式 SVG JPG PNG WEBP AVIF base64...」
                const vbnICON_Map = {
                    
                    "chat.deepseek.com": "--vbnICON-URL-Deepseek",
                    "chatgpt.com": "--vbnICON-URL-OpenAI",
                    "gemini.google.com": "--vbnICON-URL-Gemini-Vint",
                    "doubao.com": "--vbnICON-URL-DOUBAO",
                    "liblib.art": "--vbnICON-URL-Liblib",
                    "prompts.chat": "--vbnICON-URL-Prompt",
                    "127.0.0.1:8188": "--vbnICON-URL-ComfyUI",
                    "127.0.0.1:9222": "--vbnICON-URL-ComfyUI",
                    "localhost:9222": "--vbnICON-URL-ComfyUI",
                    "comfyworkflows.com": "--vbnICON-URL-Workflow",
                    
                    "ticktick.com": "--vbnICON-URL-Tick-Vint",
                    "dida365.com": "--vbnICON-URL-Tick-Vint",
                    "yuque.com": "--vbnICON-URL-YUQUE",
                    "bing.com": "--vbnICON-URL-MicrosoftCopilot",
                    "dillinger.io": "--vbnICON-URL-Markdown-Line",
                    
                    "m.ssone.io": "--vbnICON-URL-Network",
                    "my.ssonegames.com": "--vbnICON-URL-Network",
                    "ip.skk.moe": "--vbnICON-URL-Mecha",
                    "convertio.co": "--vbnICON-URL-Transition",
                    "bigjpg.com": "--vbnICON-URL-AIGC",
                    "acronymfinder.com": "--vbnICON-URL-Character",
                    "dict.cn": "--vbnICON-URL-Dict",
                    "svgviewer.dev": "--vbnICON-URL-SVG",
                    
                    "2yu7z0.smartapps.baidu.com": "--vbnICON-URL-Music",
                    
                };
                
                const matchedKey = Object.keys(vbnICON_Map).find(site =>
                    vbnMatchHost === site || vbnMatchHost.endsWith(`.${site}`)
                );
                
                const key = "CustomICON";
                const delay = 126;
                
                const stubborn = [
                    
                ];
                
                if (!VBN_GLOBAL_LOGIC.activate(key) || !matchedKey) return;
                
                let iconURL = vbnICON_Map[matchedKey];
                if (iconURL.startsWith("--")) {
                    iconURL = getComputedStyle(document.documentElement)
                        .getPropertyValue(iconURL)
                        .trim()
                        .replace(/^url\(["']?(.*?)["']?\)$/i, '$1')
                        .replace(/["']/g, '');
                }
                if (!iconURL) return;
                
                function applyFavicon(url) {
                    let link = document.querySelector("link[rel*='icon'][vbn-ICON]") || document.createElement('link');
                    link.setAttribute('vbn-ICON', 'true');
                    link.rel = 'icon';
                    link.href = url;
                    
                    if (!link.parentNode || link.parentNode !== document.head || document.head.lastChild !== link) {
                        document.head.appendChild(link);
                    }
                    const matchers = [
                        { type: 'image/svg+xml', match: v => v.endsWith('.svg') || v.startsWith('data:image/svg+xml') },
                        { type: 'image/png', match: v => v.endsWith('.png') || v.startsWith('data:image/png') },
                        { type: 'image/jpeg', match: v => /\.(jpe?g)$/i.test(v) || v.startsWith('data:image/jpeg') },
                        { type: 'image/webp', match: v => v.endsWith('.webp') || v.startsWith('data:image/webp') },
                        { type: 'image/avif', match: v => v.endsWith('.avif') || v.startsWith('data:image/avif') },
                    ];
                    link.type = matchers.find(t => t.match(url))?.type || 'image/x-icon';
                }
                
                if (document.head) applyFavicon(iconURL);
                else document.addEventListener('DOMContentLoaded', () => applyFavicon(iconURL));
                
                function init() {
                    applyFavicon(iconURL);
                    
                    VBN_OBSERVER_CENTER.observeWithKey(
                        key,
                        document.head,
                        { childList: true, subtree: true },
                        () => {
                            const icon = document.querySelector("link[rel*='icon'][vbn-ICON]");
                            if (!icon || icon.href !== iconURL) applyFavicon(iconURL);
                        },
                        { autoDisconnect: true }
                    );
                    
                    if (stubborn.some(site => vbnMatchHost.endsWith(site))) {
                        const observer = new MutationObserver(() => {
                            const siteIcon = document.querySelector("link[rel*='icon']:not([vbn-ICON])");
                            if (siteIcon) {
                                siteIcon.remove();
                                applyFavicon(iconURL);
                            }
                        });
                        observer.observe(document.head, { childList: true, subtree: true, attributes: true });
                    }
                }
                
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => setTimeout(init, delay));
                } else {
                    setTimeout(init, delay);
                }
                
            })();
            
        // #endregion
        
        
        // #region FontStyle
        
            VBN_GLOBAL_LOGIC.activate("FontStyle", {
                
                matchSubjoin: {
                    include: [
                        
                        "file:///*",
                        "*iconfont.cn/*",
                        "*emojiall.com/*",
                        "*greasyfork.org/*",
                        "*juejin.cn/*",
                        
                        "*wikipedia.org/*",
                        
                        "*prompts.chat/*",
                        
                        ...VBN_SITE_GROUP.Chat,
                        ...VBN_SITE_GROUP.ProgDev,
                        ...VBN_SITE_GROUP.Manage,
                        ...VBN_SITE_GROUP.Search,
                        ...VBN_SITE_GROUP.Media,
                        
                    ],
                    exclude: [
                        
                        "*youtube.com/*",
                        
                        ...VBN_SITE_GROUP.Font,
                        
                    ]
                } }, () => {
                
                GM_addStyle( /* css */ `
                
                    body *:not(:where(
                        .icon, .icon-wrap, .fa, .DPvwYc, path, svg, i, .google-symbols, .clear-btn_2_I2l, .block-pagination ul *,
                        .code, .pre, .inline-code, .md-code, .blob-code, .blob-code-inner, .js-file-line, .code-block, .code-container, .language-css,
                        .cm-line, .cm-line span, ne-code, ne-text, .Box-sc-g0xbh4-0.iJOeCH *,
                        code, code *, pre, pre *, kbd, samp, [class*="language-"], [class*="-language"], [class*="code-"], [class*="-code"], [class*="editor"], [class*="icon"], [class*="emoji"]
                    )) {
                        font-family: var(--vbnBaseFont) !important;
                    }
                    
                    .code, .pre, .inline-code, .md-code, .blob-code, .blob-code-inner, .js-file-line, .code-block, .code-container, .language-css,
                    .cm-line, .cm-line span, ne-code, ne-text, .Box-sc-g0xbh4-0.iJOeCH *,
                    code, code *, pre, pre *, kbd, samp, [class*="language-"], [class*="-language"], [class*="code-"], [class*="-code"] {
                        font-family: var(--vbnCodeFont) !important;
                    }
                    
                    .inline-code, .ds-markdown code, .prose :where(code):not(:where([class~=not-prose] *), pre *) {
                        padding: .126em .4em !important;
                        font-weight: 526 !important;
                        text-shadow: 0 0 .126em currentColor !important;
                    }
                    
                `);
                
                (function VBN_FontStyle_fixCursor() {
                    
                    const fixCodeCursor = [
                        ".kVleBO", // GitHub 构建光标
                    ];
                    
                    GM_addStyle(fixCodeCursor.map(sel => `${sel} { display: none; }`).join("\n"));
                    
                })();
                
            });
            
        // #endregion
        
        
        // #region Selection
        
            VBN_GLOBAL_LOGIC.activate("Selection", () => {
                
                GM_addStyle(`
                
                    ::selection {
                        color: #E2E2E2 !important;
                        background: var(--vbnBase04HEX) !important;
                    }
                    
                `);
                
            });
                
            
        // #endregion
        
        
        // #region ScrollBar
        
            VBN_GLOBAL_LOGIC.activate("ScrollBar", () => {
                
                GM_addStyle( /* css */ `
                
                    ::-webkit-scrollbar {
                        width: 5px !important;
                        height: 5px !important;
                        scroll-behavior: smooth !important;
                        border-radius: 100vmax !important;
                    }
                    
                    /* ========== 滑块 */
                    
                        ::-webkit-scrollbar-thumb {
                            background: hsla(var(--vbnBase05HSL), .4) !important;
                            border-radius: 100vmax !important;
                        }
                        ::-webkit-scrollbar-thumb:vertical { background-image: "" !important;}
                        ::-webkit-scrollbar-thumb:horizontal { background-image: "" !important;}
                        
                        ::-webkit-scrollbar-thumb:hover {
                            background: linear-gradient(
                                90deg,
                                hsla(var(--vbnGlow05HSL), 1),
                                hsla(var(--vbnGlow05HSL), 1),
                                hsla(var(--vbnGlow03HSL), 1)) !important;
                        }
                        
                    /* ========== 背景 */
                    ::-webkit-scrollbar-track {
                        background: transparent !important;
                        border-radius: 100vmax !important;
                    }
                    
                    /* ========== 上下按钮 */
                    ::-webkit-scrollbar-button { display: none !important;}
                    
                    /* ========== 滑块以外 */
                    ::-webkit-scrollbar-track-piece { display: none !important;}
                    
                    /* ========== 滚动条交界处角落区域 */
                    ::-webkit-scrollbar-corner { display: none !important;}
                    ::-webkit-resizer { display: none !important;}
                    
                `);
                
            });
            
        // #endregion
        
        
    // $ ================================================== ↓ Assign
    
        // #region Baidu
        
            VBN_GLOBAL_LOGIC.activate("Search", {
                
                matchSubjoin: {
                    include: [ "*baidu.com/*" ],
                    exclude: []
                } }, () => {
                
                if (!VBN_GLOBAL_LOGIC.activate("Baidu")) return;
                
                GM_addStyle( /* css */ `
                
                    /* ================================================== ↓ Global */
                    
                        /* html #wrapper #wrapper_wrapper #container #content_left .c-container[tpl="XXXXX"] */
                        
                        html #wrapper {
                            
                            --vbnBase: #FFF;
                            --vbnTitle: #FBFBFB;
                            --vbnKeyWord: #3978d0;
                            --vbnSearchWidth: calc(var(--vbnSpaceWidthVW) / 2 );
                            --vbnRepair: -6px;
                            
                        }
                        html .wrapper_new { background: var(--vbnBase09HEX);}
                        
                        /* ========== ↓ 隐藏模块 */
                        
                            html #searchTag,                                                                   /* 顶部 - 搜索关联词 */
                            html #rs_new .c-color-t.rs-label_ihUhK,                                            /* 底部 - 相关搜索 标题 */
                            html #wrapper #container #content_right,                                           /* 内容区 - 右侧板块 */
                            html #wrapper #container .c-container[tpl="note_lead"],                            /* 内容区 - 模块 精选笔记 */
                            html #wrapper #container .c-container[tpl="yl_vd_generic_new"],                    /* 内容区 - 模块 电影 */
                            html #wrapper #container .c-container[tpl="recommend_list"] .c-color-t.title_Zinx- /* 内容区 - 大家还搜索了 标题 */ {
                                display: none;
                            }
                            
                        /* ========== ↓ 移除下划线 */
                        
                            html .doc-title_3Jos6 a:hover,
                            html .doc-title_3Jos6 a:hover em {
                                text-decoration: none !important;
                            }
                            
                            html a, html em, html :link, html a:hover, html em:hover, a:hover em, html a.cos-link:hover,
                            html #wrapper #container .c-container .t *,
                            html #wrapper #container .c-container .c-title *,
                            html #wrapper #container .c-container .cosc-title-a :hover,
                            html #wrapper #container .c-container .cosc-title-a :hover em,
                            html #wrapper #container .c-container .cosc-title-slot,
                            html #wrapper #container .c-container .cosc-title-slot *,
                            html #wrapper #container .c-container .cosc-title-slot:hover,
                            html #wrapper #container .c-container .cosc-title-slot:hover *,
                            html #wrapper #container .c-container .title_7Iz74 .cos-link,
                            html #wrapper #container .c-container ._sc-title_1g9za_66 *,
                            html #wrapper #container .c-container ._sc-title_1g9za_66 :hover,
                            html #wrapper #container .c-container ._sc-title_1g9za_66 :hover *,
                            html #wrapper #container .c-container .video-main-title_S_LlQ:hover .title-default_518ig,
                            html #wrapper #container .c-container .site-link_1JEbM .custom-underline a .cosc-title-slot:hover,
                            html #wrapper #container .c-container ._head-title_1ml43_142 ._link_1ml43_146:hover ._paragraph_1ml43_156 {
                                text-decoration: none;
                            }
                            
                        /* ========== ↓ 内容区图片尺寸 */
                        
                            html .c-container[tpl="ai_ecology"] .cos-row-col-12 > .cos-col-6,                           /* 轻秒图片转换器 */
                            html .c-container .cos-swiper-list .cos-swiper-item[style*="width: calc(33% - 5px)"],       /* 百度有驾 */
                            html .c-container .video-wrap_7yrJ0 .cos-swiper-list .cos-swiper-item[style*="width: 34%;"] /* 百度翻译 */ {
                                width: 15% !important;
                            }
                            html .c-container .cos-row > .cos-col[style*="width:25%"],                                      /* 百度百科 */
                            html #wrapper #container .c-container[tpl="sg_kg_entity_san"] .cos-row.cos-gutter > .cos-col-3, /* 百度百科 */
                            html .c-container[tpl="nvl_bookstore_san"] .cos-row-col-12 > .cos-col-3,                        /* 在线阅读 */
                            html .c-container .cos-row.bottom-gap_2aWpR.single-image_6zdhC > .cos-col[style*="width:24.5%"] /* 电影 封面 */ {
                                width: 10% !important;
                            }
                            
                            html .c-container[tpl="rel_baikan_index"] .cos-row-col-12 > .cos-col-6:has(.poster_2AaVN) { width: 20%; margin-right: 20px; }
                            
                        /* ========== ↓ 原生模块边框 */
                        
                            html .pc-fresh-smooth .c-group-wrapper::after,
                            html .pc-fresh-smooth .cosc-card-shadow:after,
                            html .pc-fresh-smooth .new-pmd .c-border::after,
                            html .pc-fresh-smooth .cu-border._content-border_1ml43_4:after {
                                border: transparent;
                            }
                            
                            html .pc-fresh-smooth .jr-exrate-pc-wrapper_476iT {
                                outline: transparent;
                            }
                            
                        /* ========== ↓ 原生模块阴影 */
                        
                            html .cu-border,
                            html .new-pmd .c-border,
                            html .cosc-card-shadow,
                            html .re-box-shadow_3l74t,
                            html .re-box-shadow_1FfgR,
                            html .pc-first-style_4Jcx0 {
                                box-shadow: none;
                            }
                            
                        /* ========== ↓ 修正标题间隙 */
                        
                            html .pc-fresh-smooth .new-pmd .c-border /* 初始生效 全网热卖 */ {
                                padding-top: 0;
                            }
                            
                        /* ========== ↓ 修正标题动画 */
                        
                            html .pc-fresh-title-con .custom-underline > .cosc-title-a {
                                display: inline-block;
                            }
                            
                            
                    /* ================================================== ↓ Head */
                    
                        html .wrapper_new #head { 
                            top: 0;
                            width: 100%;
                            background: var(--vbnGlassBase);
                            backdrop-filter: var(--vbnPanelFilter);
                            transition: var(--vbnOftenTransition);
                        }
                        html .wrapper_new #head.peak-down { background: transparent; }
                        html .wrapper_new #head.s_down { box-shadow: var(--vbnGlassShadow); }
                        
                        html #wrapper #head:not(.s-manhattan-index div, .s_form_nologin div) { vbn { top: var(); }
                        
                            .head_wrapper {
                                display: flex;
                                justify-content: space-around;
                                transform: translate3d(-15px, 0 , 1px);
                                width: 100%;
                            }
                            
                            /* ========== ↓ 用户中心 */
                            
                                .head_wrapper #u {
                                    position: fixed;
                                    right: 40px;
                                    padding: 0;
                                }
                                
                            /* ========== ↓ 搜索框 */
                            
                                .s_form {
                                    display: flex;
                                    justify-content: center;
                                    padding: 0;
                                    width: auto;
                                }
                                .s_ipt_wr { width: var(--vbnSearchWidth); }
                                .s_form_fresh { width: inherit; padding: 0; }
                                .bdsug-new { width: var(--vbnSearchWidth); }
                                .soutu-env-new .soutu-layer .soutu-url-wrap, .soutu-env-new .soutu-layer #soutu-url-kw { width: var(--vbnSearchWidth); }
                                
                                #kw.s_ipt { width: 87%; }
                                
                        }
                        
                        /* ========== ↓ 分类 */
                        
                            html .result-molecule.new-pmd:has(#s_tab) {
                                --container-left-gap: auto;
                                display: flex;
                                justify-content: center;
                            }
                            
                            html #wrapper .new-pmd[tpl="app/head-tab"] { vbn { top: var(); }
                            
                                #s_tab {
                                    display: flex;
                                    justify-content: center;
                                    border: none;
                                    padding-top: 70px;
                                    padding-left: 0;
                                }
                                
                                #s_tab .s_tab_inner {
                                    display: flex;
                                    justify-content: space-between;
                                    width: calc(var(--vbnSpaceWidthVW) / 2 + 260px);
                                    min-width: 920px;
                                    padding-left: 0;
                                }
                                
                            }
                            
                        /* ========== ↓ 检索信息 搜索框下 */
                        
                            html #rs_top_new, html .hit-toptip, html .hit_top_new {
                                opacity: .6;
                                display: flex;
                                justify-content: center;
                                margin: 20px 0 10px;
                                width: auto;
                            }
                            
                            html #wrapper .new-pmd[tpl="app/search-tool"] { vbn { top: var(); }
                            
                                br { display: none; }
                                
                                /* ========== ↓ 筛选信息 */
                                .outer_wqJjM { margin-top: 10px;}
                                .options_2Vntk { opacity: .8; width: 90%; margin: 0 auto;}
                                
                            }
                            
                            html #wrapper .new-pmd[tpl="app/toptip"] { vbn { top: var(); }
                            
                                br { display: none; }
                                .c-gap-bottom-large { margin-bottom: 0px; }
                                
                            }
                            
                            html #wrapper .new-pmd[tpl="app/hit-top-new"] { vbn { top: var(); }
                            
                                br { display: none; }
                                .c-icon-bear-circle { transform: scale(.8); }
                                
                            }
                            
                            /* ========== ↓ 以商家官网为准 */
                            html #content_left > .k8vt8hp {
                                opacity: .5;
                                margin: 0 auto; /* margin-top: -1.2em; */
                                margin-top: 10px;
                                width: max-content;
                            }
                            
                            
                    /* ================================================== ↓ Content */
                    
                        html #wrapper #wrapper_wrapper { margin: 0 auto; width: var(--vbnSpaceWidthVW); }
                        
                        html #wrapper #container {
                            width: 100%;
                            padding: 0;
                            margin: 0 auto;
                        }
                        html #wrapper #container #content_left {
                            width: 100%;
                            padding: 0 !important;
                            margin: 0 auto !important;
                        }
                        
                        /* ========== ↓ 模块 通用 */
                        
                            html #wrapper #container .new-pmd.c-container,
                            html #wrapper #container .new-pmd[tpl="app/rs"] {
                                box-sizing: border-box;
                                position: relative;
                                padding: var(--vbnSpacePadding);
                                margin: var(--vbnSpaceMargin);
                                width: 100%;
                                font-size: 12px;
                                background: #FFFFFF;
                                box-shadow: var(--vbnOftenSurfaceShadowBase);
                                border-radius: var(--vbnSurfaceRadius);
                                transition: var(--vbnOftenTransition);
                            }
                            html #wrapper #container .new-pmd.c-container:hover,
                            html #wrapper #container .new-pmd[tpl="app/rs"]:hover {
                                z-index: 2;
                                box-shadow: inset 0 0 2px hsla(0, 0%, 92%, .6), var(--vbnOftenSurfaceShadowHover);
                                transform: var(--vbnSurfaceZoomIn);
                            }
                            
                            html #wrapper #container #content_left > :first-of-type:hover,                     /* 内容区 首个 */
                            html #wrapper #container .new-pmd[tpl="app/rs"]:hover,                             /* 相关搜索 */
                            html #wrapper #container .new-pmd.c-container[tpl="recommend_list"]:hover,         /* 相关搜索 */
                            html #wrapper #container .new-pmd.c-container[tpl="wenda_generate"]:hover,         /* AI 问答生成 */
                            html #wrapper #container .new-pmd.c-container[tpl="ai_ask"]:hover,                 /* AI 提问 */
                            html #wrapper #container .new-pmd.c-container[tpl="image_grid_san"]:hover,         /* 百度图片 */
                            html #wrapper #container .new-pmd.c-container[tpl="sg_kg_entity_san"]:hover,       /* 百度百科 */
                            html #wrapper #container .new-pmd.c-container[tpl*="jr_stock"]:hover,              /* 百度股市通 */
                            html #wrapper #container .new-pmd.c-container[tpl="jr_exchange_rate"]:hover,       /* 百度股市通 */
                            html #wrapper #container .new-pmd.c-container[tpl="ai_agent_qa_recommend"]:hover,  /* 聊一下更多精彩 */ 
                            html #wrapper #container .new-pmd.c-container[tpl="yl_rw_figure_sample_san"]:hover /* 作品成就 */ {
                                transform: none;
                            }
                            
                        /* ========== ↓ 模块 标题 */
                        
                            html #wrapper #container h3:not( 
                                .cos-space-mt-md h3,
                                .card-title_2GtKe h3,
                                .exta-links-pc_2sXPl h3,
                                .exta-link-pc_3aUAb h3,
                                .c-container[tpl="jr_stock_comment_san"] h3,
                                .c-container[tpl="world_time_san"] h3,
                                .c-container[tpl="wenda_generate"] h3
                            ) {
                                padding: var(--vbnSpacePadding);
                                margin: -10px -20px 10px -20px;
                                width: 100%;
                                background: var(--vbnBase09HEX);
                                border-radius: var(--vbnSurfaceRadius) var(--vbnSurfaceRadius) 5px 5px;
                            }
                            html .cos-pc .title-box_4YBsj { width: 100%; }
                            html .cos-pc .title-wrapper_6E6PV { margin-top: -10px; }
                            html .cos-pc .title-wrapper_6E6PV .pre-text_6ulGP { z-index: 1; }
                            html ._link_1iyz5_2 { margin-bottom: 0; }
                            
                            /* ========== ↓ 标题字号 */
                            
                                html a, html a:hover,
                                html a.cos-link, html a.cos-link:hover { color: var(--vbnKeyWord); }
                            
                                html ._paragraph_1g9za_2.md,
                                html .cosc-title-md,
                                html #wrapper #container.sam_newgrid .c-group-title a,
                                html #wrapper #container.sam_newgrid .c-container .t,
                                html #wrapper #container.sam_newgrid .c-container .c-title,
                                html #wrapper #container.sam_newgrid .c-container ._paragraph_1g9za_2.lg {
                                    color: var(--vbnKeyWord);
                                    font-size: 15px;
                                    font-weight: bold;
                                    line-height: 1.5;
                                }
                                
                            /* ========== ↓ 官方标 */
                            
                                html .cos-pc .title-wrapper_6E6PV .suffix-icon_3Ox2w { position: absolute; right: calc(20px - 25px); /* 减去模块内边距 */ }
                                html .cos-pc .title-wrapper_6E6PV .suffix-icon_3Ox2w .www-tag-fill-blue_3n0y3 { border-radius: var(--vbnUIRadius); }
                                
                                html #wrapper #container .c-container[tpl="vmp_offical_website"] { vbn { top: var(); }
                                
                                    .header_CIV6C:has(h3.t) { margin-top: -10px; }
                                    
                                    .header_CIV6C a.official-label_26SUN { position: absolute; right: calc(20px - 20px); }
                                    
                                }
                                
                            /* ========== ↓ 标题 icon */
                            
                            html .front-icon_7wpfB { z-index: 999;}
                            
                            
                        /* ========== ↓ 组件 计算器 */
                        
                            html #wrapper #container .c-container[tpl="ms_new_calc"] { vbn { top: var(); }
                            
                                .new-pmd { width: 60%; margin: 20px auto; }
                                .calc-oprate_24c8k { display: flex; justify-content: space-evenly; }
                                .calc-oprate_24c8k .func-calc_3t0OK { width: 60%;}
                                
                                .calc-box_1qoea {
                                    box-shadow: 
                                        inset 1px 1px 1px 0px rgba(255, 255, 255, 0.8),
                                        inset -1px -1px 1px 0px rgba(40, 49, 85, 0.3),
                                        1px 1px 3px 0px rgba(40, 49, 85, 0.1);
                                }
                                
                            }
                            
                        /* ========== ↓ 组件 日历 */
                        
                            html #wrapper #container .c-container[tpl="ms_calendar_san"] { vbn { top: var(); }
                            
                                &.new-pmd { width: 60%; min-width: 600px; margin: 20px auto; }
                                ._bg-header_1ml43_46 { width: 99%; top: -5px; left: 5px; }
                                
                            }
                            
                        /* ========== ↓ 组件 百度时间 */
                        
                            html #wrapper #container .c-container[tpl="world_time_san"] { vbn { top: var(); }
                            
                                .source_4yrHg { position: absolute; bottom: 5px; }
                                ._paragraph_1g9za_2.md, .sc-source-text { color: #FFF; }
                                
                            }
                            
                        /* ========== ↓ 组件 汇率换算 */
                        
                            html #wrapper #container .c-container[tpl="jr_exrate_san"] { vbn { top: var(); }
                            
                                .aladdin_3Tvaz .bg-header_G63NE { top: calc(-10px + var(--vbnRepair)); }
                                
                            }
                            
                        /* ========== ↓ 组件 单位换算 */
                        
                            html #wrapper #container .c-container[tpl="ms_measures_san"] { vbn { top: var(); }
                            
                                .cosc-card-light-bg { top: -18px; }
                                .cosc-card-horizontal-gradient { width: 110%; background-position: center; }
                                
                            }
                                
                        /* ========== ↓ 模块 百度AI */
                        
                            html #wrapper .c-group-wrapper {
                                padding: 0;
                                margin: 0;
                                background: transparent;
                                box-shadow: none;
                            }
                            html #wrapper .c-group-wrapper .result-op { width: 100% !important; }
                            
                            /* ========== ↓ 问答生成 */
                            
                                html #wrapper #container .c-container[tpl="ai_index"],
                                html #wrapper #container .c-container[tpl="wenda_generate"],
                                html #wrapper #container .c-container[tpl="new_baikan_index"] {
                                    
                                    overflow: auto;
                                    max-height: 526px;
                                    
                                    &::-webkit-scrollbar { display: none; }
                                    
                                    /* .cosc-card-content { margin-top: var(--vbnRepair); } */
                                    .cosc-card-light-bg:not([tpl="wenda_generate"] div) { top: var(--vbnRepair); }
                                    .cosd-markdown .marklang .marklang-paragraph { line-height: 1.5; }
                                    
                                    .cosc-card-shadow { padding: 10px var(--cos-space-md) 10px; }
                                    
                                }
                                
                                html #wrapper #container .c-container[tpl="ai_index"] { vbn { top: var(); }
                                
                                    div[class*="_aladdin"] {
                                        width: 97%;
                                        margin: 0 auto;
                                        padding: 0;
                                    }
                                    
                                    .swiper-box_33dzT {
                                        width: 102.6%;
                                        margin: -10px auto;
                                        margin-left: -20px;
                                        box-shadow: none;
                                        border-radius: var(--vbnPanelRadius);
                                    }
                                    ._bg-header_1ml43_46 { overflow: visible; }
                                    ._horizontal-gradient_1ml43_56 {
                                        width: 102.6%;
                                        margin: 3px auto;
                                        margin-left: -20px;
                                        background-size: 110% 100% !important;
                                        background-position: top center !important;
                                        border-radius: var(--vbnPanelRadius);
                                    }
                                    
                                }
                                
                                html #wrapper #container .c-container[tpl="wenda_generate"] { vbn { top: var(); }
                                
                                    padding-top: 20px;
                                    
                                    .cos-dqa-group-bg_3Z91P .cosc-card-light-bg {
                                        top: -15px;
                                        left: -15px;
                                        right: -15px;
                                    }
                                    /* ---------- ↓ ICON 听 */
                                    .audio_63a7U { margin-top: 0; }
                                    
                                }
                                
                                html #wrapper #container .c-container[tpl="new_baikan_index"] { vbn { top: var(); }
                                
                                }
                                
                                
                                html #wrapper #container .c-container[tpl="ai_ask"] { vbn { top: var(); }
                                
                                }
                                
                                /* ========== ↓ 模块 百度健康 */
                                html #wrapper #container .c-container[tpl="med_aigc_guru_san"] { vbn { top: var(); }
                                
                                    .medAigcPcCard_29xxv { margin-top: -5px; }
                                    
                                }
                                
                        /* ========== ↓ 模块 百度翻译 */
                        
                            html #wrapper #container .c-container[tpl="fy_fanyi_ai_san"],
                            html #wrapper #container .c-container[tpl="fy_sg_dictwisenew_san"] { vbn { top: var(); }
                            
                                h3.cosc-title { background: transparent; }
                                .dict-card_Pbfer .cosc-card { padding-top: 0 !important; }
                                
                                .daoliu-con_3mmBo { margin-top: 15px; }
                                .footer_6VBOp { margin-top: -5px; }
                                
                                .cosc-card-content { margin-top: var(--vbnRepair); }
                                .cosc-card-light-bg:not([tpl="wenda_generate"] div) { top: var(--vbnRepair); }
                                
                            }
                            
                            html #wrapper #container .c-container[tpl="fy_sg_dict_new_san"],
                            html #wrapper #container .c-container[tpl="fy_sg_dictwisenew_san"] { vbn { top: var(); }
                            
                                h3.cosc-title, h3.cosc-title.pc-title_5Frt2 { background: transparent; margin-bottom: -5px; }
                                .cosc-card-shadow { padding-top: 10px; }
                                
                                .cos-swiper-item { max-width: 15%; }
                                
                                .video-wrap_312kw .vbnFocal { display: none; }
                                
                            }
                            
                        /* ========== ↓ 模块 百度贴吧 */
                        
                            html #wrapper #container .c-container[tpl="tieba_general"] { vbn { top: var(); }
                            
                                .cos-space-mt-md { width: 96%; }
                                
                            }
                            
                        /* ========== ↓ 模块 百度百科 图片 */
                        
                            html #wrapper #container .c-container[tpl="yl_ps_main"] { vbn { top: var(); }
                            
                                .matting-container_OCDhm { width: 3rem; }
                                
                            }
                            
                        /* ========== ↓ 模块 百度图片 */
                        
                            html #wrapper #container .c-container[tpl="image_grid_san"] { vbn { top: var(); }
                            
                                h3.cosc-title { margin: 0px -20px; background: transparent; }
                                
                                h3.cosc-title > a.vbnFocal.vbnLR { display: inline-block; }
                                
                                .image-container_7qr7Y.image-container-pc_57ELg { display: flex; gap: 40px; }
                                .image-container_7qr7Y .row-border-list_50f1g { gap: 20px; }
                                
                                .cos-image-background { border-radius: var(--vbnPanelRadius); }
                                
                            }
                            
                        /* ========== ↓ 模块 百度百科 */
                        
                            html #wrapper #container .c-container[tpl="bk_polysemy"] { vbn { top: var(); }
                                
                                .c-span9 { width: calc(100% - 150px - 20px); }
                                .c-span12 { width: 100%; }
                                
                            }
                            
                            html #wrapper #container .c-container[tpl="sg_kg_entity_san"] { vbn { top: var(); }
                                
                                .button_sx9Ei .content_7L4g2 { color: var(--vbnKeyWord); }
                                .c-span9 { width: 85%; }
                                
                                /* ========== ↓ 演员列表 */
                                .cos-swiper-list { justify-content: space-around; }
                                
                            }
                            
                        /* ========== ↓ 模块 百度文库 */
                        
                            html #wrapper #wrapper_wrapper #container .c-container[tpl="jy_wenku_wenshu"] { vbn { top: var(); }
                            
                                h3 { padding: 10px 45px; margin: -20px -20px 10px -43px; }
                                
                                .title-wrapper_6E6PV .front-icon_7wpfB { z-index: 1; font-size: 15px; }
                                
                                /* ========== ↓ 修复标题 */
                                .doc-title_3Jos6 { background: transparent; }
                                
                            }
                            
                            html #wrapper #container .c-container[tpl="www_index"][mu*="https://wenku.baidu.com/"] { vbn { top: var(); }
                            
                                /* ========== ↓ ICON */
                                
                                    .title-wrapper_6E6PV .front-icon_7wpfB { position: absolute; transform: scale(.8); }
                                    .title-box_4YBsj:has(.front-icon_7wpfB) .t { padding-left: 50px; }
                                    
                            }
                            
                        /* ========== ↓ 模块 百度汉语 */
                        
                            html #wrapper #container .c-container[tpl="jy_hy_zi_broad_san"],
                            html #wrapper #container .c-container[tpl="jy_hy_zi_attr_san"],
                            html #wrapper #container .c-container[tpl="jy_hy_zi_accu_san"] { vbn { top: var(); }
                            
                                h3.t { background: transparent; }
                                
                                /* ========== ↓ 修复标题背景 */
                                
                                    .bg-header_2y46S._bg-header_1ml43_46, .bg-header_5SZvD { width: 102%; top: -6px; left: -15px; }
                                    ._bg-header_1ml43_46.bg-header_3oVmj { width: 99.26%; top: -15px; left: 6PX; }
                                    
                                    .bg-header_3oVmj .radial-gradient-right_46YsI { opacity: .6; left: 40%; width: 60%; }
                                    
                            }
                            
                        /* ========== ↓ 模块 百度天气 */
                        
                            html #wrapper #container .c-container[tpl="weather_forecast_san"] { vbn { top: var(); }
                                
                                --width: 10px;
                                
                                .content-border_2OSp3 { box-shadow: none; }
                                
                                /* ========== ↓ 按钮 左右翻页 */
                                
                                    .load_4cwYw.back_5ndVv { left: var(--width); }
                                    .load_4cwYw.more_3kyUW { right: var(--width); }
                                    
                            }
                            
                        /* ========== ↓ 模块 百度有驾 */
                        
                            html #wrapper #container .c-container[tpl="car_kg2_san"] { vbn { top: var(); }
                            
                            }
                            
                        /* ========== ↓ 模块 聚合搜索 */
                        
                            html #wrapper #container .c-container[tpl="rel-baike"] { vbn { top: var(); }
                            
                                .rel-baike_2iWln .default-baike_3Iqd0.scroll-bar_qANq3 { display: flex; margin: 15px 0 5px 0; }
                                .rel-baike_2iWln .lemma-item_1MZZu { margin: 0; }
                                
                            }
                            
                        /* ========== ↓ 模块 AI 工具箱 */
                        
                            html #wrapper #container .c-container[tpl="ai_ecology"] { vbn { top: var(); }
                                
                                --width: 12%;
                                
                                .cos-row-col-12 > .cos-col-3 { width: var(--width); }
                                .card-footer-normal_nPWGd { left: calc(var(--width) - 15px/4); }
                                
                            }
                            
                        /* ========== ↓ 模块 作品成就 */
                        
                            html #wrapper #container .c-container[tpl="yl_rw_figure_sample_san"] { vbn { top: var(); }
                            
                                .movie_2e2fW.single_OLsoA .cosc-image-with-tags_2bivA { width: 10%; }
                                .list_1rXEa .movie-item_6O1ib, .list_1rXEa .music-item_5dvGu { width: calc(10% - var(--space-between)) !important; }
                                
                            }
                            
                        /* ========== ↓ 模块 音乐 */
                        
                            html #wrapper #container .c-container[tpl="yl_music_song"] { vbn { top: var(); }
                            
                                --width: 1260px;
                                
                                .table-container_39X6k .table-thead_2yUCX .th-num_390pb,
                                .table-container_39X6k .table-tbody_3exJd .td-num_evVor {
                                    width: var(--width);
                                }
                                
                            }
                            
                        /* ========== ↓ 模块 游戏 */
                        
                            html #wrapper #container .c-container[tpl="game-page-pandemand"] { vbn { top: var(); }
                            
                                .c-container > .content.content-info_2LiPq {
                                    display: grid;
                                    justify-items: center;
                                }
                                .content.content-info_2LiPq > .tab-wrapper_3YYym {
                                    grid-column: 1 / 3;
                                    text-align: center;
                                }
                                .content.content-info_2LiPq > .c-row.c-gap-top-large:last-of-type { display: none; }
                                .c-row.c-gap-top-large > .c-span2 { margin-right: 35px; }
                                
                            }
                            
                        /* ========== ↓ 模块 百家号 */
                        
                            
                        /* ========== ↓ 模块 全网热卖 */
                        
                            html #wrapper #container .c-container[tpl="sp_purc_pc"] { vbn { top: var(); }
                            
                                h3 { margin: -22px -20px 10px -20px; } 
                                .content-wrap_2UG9e > div[style*="display: block"] {
                                    display: flex !important;
                                    justify-content: space-evenly;
                                }
                                .row_IIB9a { margin: 0; }
                                .sp_purc_pc-sku-item_3KDHq { margin: 15px 40px 15px 0; }
                                
                            }
                            
                        /* ========== ↓ 模块 在线阅读 */
                        
                        
                        /* ========== ↓ 模块 在线观看 */
                        
                            html #wrapper #container .c-container[tpl="yl-vd-basis"] { vbn { top: var(); }
                            
                                .c-span9 { width: max-content; }
                                
                            }
                            
                        /* ========== ↓ 模块 高清在线观看 */
                        
                            html #wrapper #container .c-container[tpl="short_video"] { vbn { top: var(); }
                            
                                .content_LHXYt > div { display: flex; gap: 20px; }
                                .content_LHXYt .c-row { display: flex; gap: 20px; }
                                .c-gap-top-large, .c-span4 { margin: 0; }
                                
                            }
                            
                        /* ========== ↓ 模块 聊一下更多精彩 */
                        
                            html #wrapper #container .c-container[tpl="ai_agent_distribute"] { vbn { top: var(); }
                            
                                .card-title_6qPL6 { width: 100%; }
                                .content_EbWw1 .common-content_4dXMi { width: 95%; }
                                
                            }
                            
                        /* ========== ↓ 模块 实时智能回复 */
                        
                            html #wrapper #container .c-container[tpl="ai_agent_qa_recommend"] { vbn { top: var(); } 
                            
                                /* ========== ↓ 标题 */
                                
                                    .cos-space-mt-lg { margin-top: 0; }
                                    .agent-qa-card_3V5cX .card-title_2GtKe { margin: 10px 0; }
                                    
                            }
                            
                        /* ========== ↓ 模块 最新信息 */
                        
                            html #wrapper #container .c-container[tpl="news-realtime"] { vbn { top: var(); }
                            
                                .single-card-wrapper_2nlg9 {
                                    display: flex;
                                    justify-content: flex-start;
                                    border-radius: var(--vbnSurfaceRadius);
                                    box-shadow: none;
                                }
                                .single-card-wrapper_2nlg9 > .c-row { display: flex; }
                                .single-card-wrapper_2nlg9 > .c-row:last-of-type { display: none; }
                                
                            }
                            
                        /* ========== ↓ 模块 最新相关信息 */
                        
                            html #wrapper #container .c-container[tpl="rel_base_realtime"] { vbn { top: var(); }
                            
                                img { border-radius: var(--vbnBaseRadius); }
                                .cos-image-3-2 { padding-bottom: 25%; mask-image: linear-gradient(to bottom, #000 95%, transparent 100%); }
                                .cos-image-fit-cover .cos-image-background { background-size: contain; }
                                
                                .cos-row.cos-gutter:not(:has(.cos-col-3)) { margin-left: calc(var(--cos-grid-gutter) * -.5 + 25%); }
                                .cos-space-mt-md:not(:has(.cos-col-3)) .cos-row.cos-gutter { margin-left: 0; }
                                
                            }
                            
                        /* ========== ↓ 模块 最新相关信息 */
                        
                            html #wrapper #container .c-container[mu*="https://wenku.baidu.com/"] { vbn { top: var(); }
                            
                                ._image_14uts_1 {
                                    background-size: contain !important;
                                    padding-bottom: 25% !important;
                                }
                                
                            }
                            
                        /* ========== ↓ 模块 相关搜索 */
                        
                            html #wrapper #container .c-container[tpl="recommend_list"] { vbn { top: var(); }
                                
                                .pc-rg-upgrade_2X3zi .item_3WKCf { margin: 5px !important; color: var(--vbnKeyWord); }
                                
                            }
                            
                            html #wrapper .new-pmd[tpl="app/rs"] { vbn { top: var(); }
                            
                                padding: var(--vbnSpacePadding) !important;
                                margin: var(--vbnSpaceMargin) !important;
                                
                                #rs_new { margin: 0; width: 100%; }
                                #rs_new table { margin: 20px auto; }
                                #rs_new table tr { display: flex; gap: 40px; }
                                #rs_new table tr .rs-link_2DE3Q { color: var(--vbnBaseColor);}
                                
                            }
                            
                        /* ========== ↓ Other */
                        
                            html #wrapper #container .c-container { vbn { top: var(); }
                            
                                .recommend-none-border { display: flex; gap: 20px; }
                                .c-gap-top-middle { margin-top: 0; }
                                
                            }
                            
                    /* ================================================== ↓ Bottom */
                    
                        html #wrapper .new-pmd[tpl="app/page"] { vbn { top: var(); }
                        
                            #page {
                                margin-top: 40px;
                                width: 100%;
                                background: transparent !important; /* 覆盖内联 */
                            }
                            
                            .page_2muyV a { color: var(--vbnKeyWord); }
                            
                            #page a:hover .pc, #page .n:hover, .page_2muyV a:hover {
                                filter: none;
                                color: var(--vbnKeyWord);
                                background: transparent;
                                box-shadow: var(--vbnSurfaceShadow) hsla(var(--vbnAccentHSL), .200);
                            }
                            
                            .page_2muyV .page-inner_2jZi2 {
                                padding: 0 !important;
                                margin: 10px auto !important;
                                width: max-content !important;
                            }
                            
                        }
                        
                        html #wrapper .new-pmd[tpl="app/footer"] { vbn { top: var(); }
                        
                            .foot-container_2X1Nt { visibility: hidden;}
                            
                        }
                        
                        
                    /* ================================================== ↓ Other */
                    
                            /* ---------- ↓ 内容块 -> 内容 距离 */
                            html ._content-border_1ml43_4:not([tpl="jy_hy_zi_accu_san"] ._content-border_1ml43_4) {
                                padding: 0 20px;
                                margin: 10px -20px;
                                /* padding: var(--vbnSpacePadding);
                                margin: 0 -20px; */
                            }
                            
                            /* ---------- ↓ 内容块 -> 内容 宽度 */
                            html #wrapper #container .c-container[tpl="www_index"] { vbn { top: var(); }
                            
                                .cos-row .cos-col.content-space-between_44mGk[style*="width:75%;"] {
                                    width: 89% !important;
                                }
                                
                            }
                            
                        /* ========== ↓ Markdown AI 问答区 「预计更改」 */
                        
                            html .cosd-markdown .marklang h3 { font-size: 14px; }
                            
                            html .cosd-markdown .marklang,
                            html .cosd-markdown .marklang .marklang-paragraph {
                                font-size: 14px;
                            }
                            
                `);
                
                /* ========== vbnFocal */
                
                    (function VBN_Baidu_vbnFocal() {
                        
                        VBN_ADD_CLASS.apply({
                            target: [
                                ".c-container [data-module='title']",
                                ".c-container [class^='title_']",
                                ".c-container h3[class*='title'] a",
                            ],
                            subjoin: [ "vbnFocal", "vbnLR", ],
                        });
                        
                    })();
                    
            });
            
            VBN_GLOBAL_LOGIC.activate("Search", {
                
                matchSubjoin: {
                    include: [ "*baike.baidu.com/*" ],
                    exclude: []
                } }, () => {
                
                if (!VBN_GLOBAL_LOGIC.activate("Baidu")) return;
                
                GM_addStyle( /* css */ `
                
                    html {
                        
                        &.vbn body {
                            --vbnWidth: calc(var(--vbnSpaceWidthVW) - 05vw);
                        }
                        
                        @media (width >= 2160px) {
                            
                            /* ================================================== ↓ head */
                            
                                .index-module_navBarWrapper__X0DND .index-module_navBarList__iL2jR, 
                                .secondContainer_gkFgZ .secondContent_qd184 {
                                    width: var(--vbnWidth);
                                }
                                
                                .videoListWrap_kQdph.show_c8fQR {
                                    opacity: 1;
                                    visibility: visible;
                                    z-index: 2;
                                    max-width: 1120px !important;
                                }
                                .videoListWrap_kQdph .videoListBox_ylJPb {
                                    width: 100% !important;
                                    max-width: 100%;
                                }
                                .swiper-slide { flex-shrink: revert; }
                                
                            /* ================================================== ↓ XXX */
                            
                                .pageWrapper_P6xcA .contentBox_cyrt9 { width: var(--vbnWidth); }
                                .pageWrapper_P6xcA .mainContent_Zy94E { width: 75%; }
                                
                        }
                        
                    }
                    
                `);
                
            });
            
        // #endregion
        
        
        // #region Google
        
            VBN_GLOBAL_LOGIC.activate("Search", {
                
                matchSubjoin: {
                    include: [ "*Google.com/*" ],
                    exclude: []
                } }, () => {
                    
                if (!VBN_GLOBAL_LOGIC.activate("Google")) return;
                
                GM_addStyle( /* css */ `
                
                    #tsf { transition: transform .526s var(--vbnTransitionSoft); }
                    
                    @media (width >= 1920px) { body { --vbnWidth: calc(var(--vbnSpaceWidthVW) - 05vw); } }
                    @media (width <= 1920px) { body { --vbnWidth: calc(var(--vbnSpaceWidthVW) + 05vw); } }
                    
                    /* ========== ↓ 仅在 "分类 => 全部" 页激活才应用 */
                    html:has(body [role="listitem"]:nth-child(1) a[aria-disabled="true"]) {
                        
                        &.vbn body {
                            --vbnSearch: calc(var(--vbnWidth) / 1.5);
                            --vbnICON: 50px;
                            --vbnLine: #00000009;
                        }
                        
                        /* ================================================== ↓ Global */
                        
                            /* #main { background: var(--vbnBase09HEX); } */
                            .sfbg, .Fgyi2e, .appbar { background: transparent; }
                            
                            /* ========== ↓ 隐藏模块
                            
                                #rhs  {
                                    display: none;
                                } */
                            
                            /* ========== ↓ 移除下划线 */
                            
                                #b_results > li.b_algo h2 a {
                                    text-decoration: none !important;
                                }
                                
                                a:hover,
                                a:hover h3.LC20lb,
                                .b2Rnsc:hover,
                                .ngTNl:hover .ZhosBf,
                                .V5XKdd:hover .ZxS7Db,
                                .c30Ztd:hover~.T3Fozb .CvgGZ {
                                    text-decoration: none;
                                }
                                
                        /* ================================================== ↓ Head */
                        
                            .NDnoQ {
                                display: grid;
                                grid-template-columns: 1fr auto 1fr;
                            }
                            .tsf {
                                grid-column: 2;
                                justify-self: center;
                                width: var(--vbnSearch);
                                max-width: var(--vbnSearch);
                                transform: translateX(-40px);
                            }
                            .Efnghe {
                                grid-column: 3;
                                justify-self: end;
                            }
                            .wZQcA .BO2cCe { border-color: var(--vbnLine); }
                            
                            /* ========== ↓ 粘性定位 */
                            
                                .minidiv .sfbg {
                                    min-height: calc(var(--vbnSpace4X) + 20px);
                                    background: hsla(0, 0%, 100%, 0.8);
                                    box-shadow: var(--vbnGlassShadow);
                                    backdrop-filter: var(--vbnPanelFilter);
                                }
                                #searchform { top: 20px !important; }
                                .minidiv .logo { top: 12px; }
                                
                                .minidiv .RNNXgb { border-radius: 26px; }
                                .minidiv .emcav .RNNXgb {
                                    border-bottom-left-radius: 0;
                                    border-bottom-right-radius: 0;
                                }
                                .WzNHm { margin-top: -40px; margin-right: 5px; }
                                
                                .minidiv > .NDnoQ.P3mIxe { vbn { top: var(); }
                                
                                    margin-top: -10px;
                                
                                    .RNNXgb {
                                        margin: 5px 0 0;
                                        min-height: var(--vbnICON);
                                    }
                                    .iblpc, .vOY7J, .XDyW0e, .nDcEnd, .Tg7LZd { min-height: var(--vbnICON); }
                                    
                                    .BKRPef { margin-top: 20px; }
                                    .Tg7LZd { line-height: 40px; }
                                    .gLFyf { padding-top: 14px; }
                                    
                                    .aajZCb { border-radius: 0 0 26px 26px; }
                                    
                                }
                                
                            /* ========== ↓ 搜索框 */
                            
                                .A8SBwf { min-width: 426px; }
                            
                                .RNNXgb {
                                    border: none;
                                    box-shadow:
                                        0px 0px 00px 1px hsla(0, 0%, 0%, .04),
                                        2px 5px 10px 1px hsla(0, 0%, 0%, .06);
                                }
                                .emcav .RNNXgb, .BgPPrc .RNNXgb {
                                    box-shadow:
                                        0px 0px 00px 1px hsla(0, 0%, 0%, .04),
                                        2px 5px 10px 1px hsla(0, 0%, 0%, .06);
                                }
                                .aajZCb {
                                    box-shadow:
                                        0px 00px 00px 1px hsla(0, 0%, 0%, .04),
                                        0px 05px 10px 0 hsla(0, 0%, 0%, .02),
                                        0px 20px 25px 0 hsla(0, 0%, 0%, .06);
                                }
                                .xtSCL { border-top: none; }
                                
                                #Alh6id { vbn { top: var(); }
                                    .sbct { min-height: 2.6em; }
                                }
                                
                            /* ========== ↓ 分类 */
                            
                                .GG4mbd {
                                    display: flex;
                                    justify-content: center;
                                    grid-column: 1/-1;
                                    max-width: none;
                                }
                                .rQTE8b { max-width: var(--vbnSearch); margin-left: 5.26vw; }
                                .mXwfNd { padding: 0 20px; }
                                
                                
                        /* ================================================== ↓ Content */
                        
                            #rcnt {
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                            }
                            #center_col { width: var(--vbnWidth); }
                            .UFQ0Gb { grid-template-columns: none; column-gap: 0; }
                            
                            #taw { vbn { top: var(); }
                            
                                #oFNiHe .vt6azd { width: 80%; margin: 0 auto; }
                                #oFNiHe .Pqkn2e { font-size: 14px; letter-spacing: .05em; }
                                
                            }
                            
                            /* ========== ↓ 模块 通用 */
                            
                                /* .MjjYud .A6K0A */
                                #rso .MjjYud .A6K0A:has(h3, [aria-level="2"]) {
                                    box-sizing: border-box;
                                    position: relative;
                                    padding: var(--vbnSpacePadding);
                                    margin: var(--vbnSpaceMargin);
                                    width: 100%;
                                    font-size: 12px;
                                    background: #FFFFFF;
                                    box-shadow: var(--vbnOftenSurfaceShadowBase);
                                    border-radius: var(--vbnSurfaceRadius);
                                    transition: var(--vbnOftenTransition);
                                }
                                #rso .MjjYud .A6K0A:has(h3, [aria-level="2"]):hover {
                                    z-index: 2;
                                    box-shadow: inset 0 0 2px hsla(0, 0%, 92%, .6), var(--vbnOftenSurfaceShadowHover);
                                    transform: var(--vbnSurfaceZoomIn);
                                }
                                
                                #rso .MjjYud .A6K0A:has(.cUnQKe):hover, /* 模块 图片 | 相关问题 */
                                #rso .ULSxyf > .MjjYud .A6K0A:hover /* 模块 特殊 */{
                                    transform: none;
                                }
                                
                                /* ========== ↓ 带 "源" 的模块 */
                                
                                    #rso .MjjYud .A6K0A:has(.wHYlTd.Ww4FFb.vt6azd.tF2Cxc.asEBEc, .PmEWq.wHYlTd.vt6azd.Ww4FFb, .jmjoTe.wHYlTd) {
                                        padding-right: 0px;
                                    }
                                    
                                    .jmjoTe { padding: 0 calc(36px/2 + 0px); }
                                    
                                /* ========== ↓ 特殊情况 */
                                
                                    .ULSxyf > .MjjYud .Jb0Zif .yWNJXb { margin: 0; }
                                    .ULSxyf > .MjjYud .Jb0Zif .yWNJXb.tQtKhb { margin: 0; }
                                    
                                /* ========== ↓ 通用模块 含图片 */
                                
                                    .srKDX > .kb0PBd.ieodic.jGGQ5e { width: calc(var(--vbnWidth) - 20px); }
                                    .srKDX > .kb0PBd.LnCrMe {
                                        position: absolute;
                                        right: 20px;
                                        bottom: -10%;
                                    }
                                    
                                    .A6K0A > .wHYlTd.Ww4FFb.vt6azd.tF2Cxc.asEBEc[style*="max-width:652px"] { max-width: inherit !important; }
                                    .A6K0A > .wHYlTd.Ww4FFb.vt6azd.tF2Cxc.asEBEc:has(.kb0PBd.LnCrMe) { vbn { top: var(); }
                                    
                                        height: 150px;
                                        
                                        .srKDX > .kb0PBd.ieodic.jGGQ5e { width: calc(var(--vbnWidth) - 20px); }
                                        .srKDX > .kb0PBd.LnCrMe { bottom: -45px; }
                                        
                                    }
                                    
                                /* ========== ↓ 通用模块 含展开内容 */
                                .A6K0A .kb0PBd > div[style*="max-width:600px"] { max-width: 99% !important; }
                                
                                /* ========== ↓ 通用模块 内容块内部 底距 */
                                
                                    --vbnSpaceC: 20px;
                                    
                                    .tF2Cxc.asEBEc { margin-bottom: var(--vbnSpaceC); }
                                    .vt6azd { margin: 0px 0px var(--vbnSpaceC); }
                                    
                                    
                            /* ========== ↓ 模块 带源 */
                            
                                .notranslate.ESMNde.HGLrXd.ojE3Fb {
                                    opacity: .6;
                                    padding: var(--vbnSpacePadding);
                                    margin: 10px -20px -10px -20px;
                                    width: 100%;
                                    background: var(--vbnBase09HEX);
                                    border-radius: var(--vbnSurfaceRadius) var(--vbnSurfaceRadius) 5px 5px;
                                }
                                
                                .b8lM7 > .B6fmyf.byrV5b.Mg1HEd { opacity: .6; position: absolute; right: 20px; }
                                .b8lM7 > .B6fmyf.byrV5b.Mg1HEd .byrV5b { justify-content: flex-end; }
                                .eFM0qc.BCF2pd { background: transparent; }
                                .dEEN8c { width: max-content; }
                                
                                /* ========== ↓ 标题 */
                                    
                                    .MBeuO,
                                    [aria-level="2"][role="heading"] span {
                                        font-size: 16px;
                                        font-weight: bold;
                                        color: var(--vbnGoogleBlue);
                                    }
                                    
                                /* ========== ↓ 正文 */
                                
                                    a { color: var(--vbnGoogleBlue); }
                                    .p4wth { font-size: 13px; padding-right: 20px; }
                                    
                                /* ========== ↓ 匹配 */
                                
                                    .aCOpRe em, .aCOpRe a em, .yXK7lf em, .yXK7lf a em, .p4wth em, .p4wth a em {
                                        color: var(--vbnGoogleRad);
                                    }
                                    
                                    
                            /* ========== ↓ Aside */
                            
                                #rhs {
                                    --right: -5%;
                                    opacity: 0;
                                    z-index: 9;
                                    position: fixed;
                                    top: 50%;
                                    right: var(--right);
                                    transform: translateY(-50%);
                                    padding: 20px 20px 0 20px;
                                    width: max-content;
                                    max-width: 526px;
                                    background: var(--vbnGlassBase);
                                    backdrop-filter: var(--vbnPanelFilter);
                                    border-radius: var(--vbnSurfaceRadius);
                                    box-shadow:
                                        0px 05px 10px 0 hsla(0, 0%, 0%, .02),
                                        0px 20px 25px 0 hsla(0, 0%, 0%, .04);
                                    transition: opacity .26s ease, transform .26s ease;
                                }
                                #rhs:hover { opacity: 1; transform: translate(calc(20% + -50%), -50%); }
                                
                                @media (width <= 1920px), (height <= 1260px) { #rhs { display: none; } }
                                
                                #rhs .u7yw9, #jOAHU, .CeIyHb.WY0eLb { border: none; }
                                .FalWJb { background: transparent; }
                                
                            /* ========== ↓ 模块 详情弹窗 */
                                
                                /* #sZmt3b .PG8i1e.Ooz8t.PyLEff */
                                #Sva75c {
                                    position: fixed;
                                    top: 50% !important;
                                    left: 50% !important;
                                    transform: translate(-50%, -50%);
                                    border-radius: var(--vbnSurfaceRadius);
                                    width: calc(var(--vbnSpaceWidthVW) - 20vw) !important;
                                    height: max-content !important;
                                }
                                /* #sZmt3b .Z7HyUd */
                                .VuvQze .RfPPs {
                                    padding: 10px 20px;
                                    width: 40vw;
                                    background: var(--vbnGlassBase);
                                    backdrop-filter: var(--vbnPanelFilter);
                                }
                                .k4o2Hc, .dzz8Xc { background: transparent; }
                                .LrPjRb[role="dialog"] iframe.P0rd4 {
                                    border-radius: var(--vbnSurfaceRadius);
                                    margin-bottom: 14px;
                                }
                                .Dgr5Hb { border-top: none; }
                                .VuvQze .RfPPs {
                                    box-shadow:
                                        0px 05px 10px 0 hsla(0, 0%, 0%, .02),
                                        0px 20px 25px 0 hsla(0, 0%, 0%, .06);
                                }
                                
                            /* ========== ↓ 模块 精选摘要 */
                            
                                .fm06If .ILfuVd, .c2xzTb .ILfuVd, .Jb0Zif .c2xzTb .ILfuVd { font-size: 16px; }
                                
                            /* ========== ↓ 模块 官方词条 */
                            
                                .SLPe5b { grid-column: 1 / -2; }
                                .e8Ck0d { padding: 20px 0 40px 0; }
                                
                                .GCSyeb { margin: 0 auto; width: calc(var(--vbnWidth) - 260px); background: var(--vbnLine); }
                                
                            /* ========== ↓ 模块 AI 概览 */
                            
                                .LT6XE, .zNsLfb { max-width: 100%; }
                                .in7vHe:not(.BgrTif) { display: block; margin: 0 auto; }
                                .omFXYd, .KMCbD { border-bottom: none; }
                                .zocjMe { border-bottom: 1px solid #e6effb; }
                                
                                #eKIzJc .YzCcne[data-mg-cp="YzCcne"] > div { margin-bottom: 0 !important; }
                                .F0OfWd { max-width: 100%; }
                                .WAUd4 { padding: 15px 0; }
                                
                                #eKIzJc { vbn { top: var(); }
                                
                                    --fontS: 14px;
                                    --fontM: 15px;
                                    --fontL: 16px;
                                    
                                    .jloFI { font-size: var(--fontL); }
                                    .rPeykc.pyPiTc, .rPeykc.uP58nb { font-size: var(--fontL); }
                                    .f5cPye ul, .f5cPye ol { font-size: var(--fontS); }
                                    .vM0jzc ul, .vM0jzc ol { font-size: var(--fontS) !important; }
                                    
                                }
                                
                            /* ========== ↓ 模块 图片 */
                            
                                #iur .cakeVe { display: flex; justify-content: space-evenly; }
                                .Lv2Cle .eA0Zlc.mkpRId, .cakeVe .m3LIae {
                                    width: calc(var(--vbnWidth) / 5);
                                    max-width: 126px;
                                }
                                .Bi9oQd { background: var(--vbnLine); }
                                .ZFiwCf { margin: 20px auto; }
                                .ULSxyf { margin-bottom: 0; }
                                
                            /* ========== ↓ 模块 影片 */
                            
                                .Ea5p3b > [data-hveid="CCQQAw"][jsname="wRSfy"] { display: flex; gap: 32px; }
                                .sHEJob { border-top: none; /* max-width: calc(var(--vbnWidth) / 3 - 52px); */ }
                                
                            /* ========== ↓ 模块 相关问题 */
                            
                                .cUnQKe { margin-bottom: 20px; }
                                
                                .XVdSCb.KFFQ0c.xKf9F { margin-top: 20px !important; }
                                
                                .akqY6 { background: var(--vbnLine); }
                                .iRPzcb { border-color: var(--vbnLine); }
                                
                                
                        /* ================================================== ↓ Bottom */
                        
                            #botstuff { --vbnSpace: 20px; --vbnGap: 60px; }
                            
                            /* ========== ↓ 模块 用户还搜索了 */
                            
                                .ULSxyf .M6HR1c.PJI6ge.adDDi { display:none; }
                                .ULSxyf { padding: var(--vbnSpace) 60px; }
                                
                                .vIifob:hover { background: #f0f1f3; }
                                
                            /* ========== ↓ DMCA 投诉 */
                            
                                #botstuff .Pqkn2e { opacity: .26; padding: 0 60px; font-size: 12px; }
                                
                            /* ========== ↓ 翻页 */
                            
                                #bres ~ [role="navigation"] {
                                    height: 40px;
                                    overflow: hidden;
                                    margin: calc(var(--vbnGap) - var(--vbnSpace)) auto var(--vbnGap) auto;
                                }
                                .AaVjTc { margin: 0 auto; }
                                
                            /* ========== ↓ 底部 */
                            
                                #fbarcnt { width: var(--vbnWidth); margin: 0 auto; }
                                #fbar {
                                    opacity: .6;
                                    padding: 20px 40px 10px;
                                    background: var(--vbnBase09HEX);
                                    border-radius: var(--vbnSurfaceRadius) var(--vbnSurfaceRadius) 0 0;
                                }
                                .b2hzT { border-bottom: none; }
                                .g0F6u, .KwU3F, .xSQxL { color: var(--vbnGoogleBlue); }
                            
                    }
                    
                `);
                
                /* ========== vbnFocal */
                
                    (function VBN_Google_vbnFocal() {
                        
                        VBN_ADD_CLASS.apply({
                            target: [
                                ".V9tjod h3.LC20lb",
                            ],
                            subjoin: [ "vbnFocal", "vbnLR", ],
                        });
                        
                    })();
                    
                /* ========== QuickRead */
                
                    (function VBN_Google_QuickRead() {
                        
                        if (!VBN_GLOBAL_LOGIC.activate("QuickRead")) return;
                        
                        VBN_QUICK_READ.apply({
                            buttonPrev: '#pnprev',
                            buttonNext: '#pnnext',
                        });
                        
                    })();
                    
            });
            
            VBN_GLOBAL_LOGIC.activate("Google", {
                
                matchSubjoin: {
                    include: [ "*mail.google.com/*" ],
                    exclude: [ ]
                } }, () => {
                
                GM_addStyle( /* css */ `
                
                    html { vbn { top: var(); }
                        
                        .mt-actions-container .ms-quick-actions-button.new-logo { display: none; }
                        .mt-tool .mt-tool-button .mt-tool-icon { background: transparent; }
                        #mailtrack-menu-opener .mt-logo > svg.mt-svg-icon { display: none; }
                        
                    }
                    
                `);
                
            });
            
            if (
                VBN_MATCH_RULE.match({
                    include: [ "*google.com/search/about-this-result*", ],
                    exclude: [ ]
                })
            ) {
                GM_addStyle( /* css */ `
                
                    html .gs3qud, html .dzz8Xc { background: transparent; }
                    
                `);
            }
                
        // #endregion
        
        
        // #region Bing
        
            VBN_GLOBAL_LOGIC.activate("Search", {
                
                matchSubjoin: {
                    include: [ "*bing.com/*" ],
                    exclude: [ ],
                } }, () => {
                
                if (!VBN_GLOBAL_LOGIC.activate("Bing")) return;
                
                GM_addStyle( /* css */ `
                
                    /* ================================================== ↓ Global */
                    
                        html {
                            --vbnColorBase: var(--vbnBase09HEX);
                            --vbnSearchWidth: calc(var(--vbnSpaceWidthVW) / 1.5);
                            --vbnLine: #00000009;
                        }
                        
                        /* ========== ↓ 隐藏模块 */
                            
                            html #b_footer,
                            html #b_results > li.b_ans #brsv3 h2,     /* 相关搜索 标题 */
                            html #b_results > li.b_ans.b_mop.b_vidAns /* 模块 视频 */ {
                                display: none;
                            }
                            
                        /* ========== ↓ 移除下划线 */
                        
                            html .b_rc_gb_sub .b_rc_gb_sub_title,
                            html #b_results > li.b_algo h2 a,
                            html #b_topw .b_wpt_container .b_wpt_bl:hover h2 a {
                                text-decoration: none !important;
                            }
                            
                            html a:hover,
                            html .b_algoheader a h2:hover,
                            html .b_algo:first-child:hover h2 a,
                            html .b_algo .b_underline a,
                            html .sb_add .b_underline a,
                            html #b_results>.b_ad li:first-child .sb_adTA:hover h2 a,
                            html #b_topw>.b_ad li:first-child .sb_adTA:hover h2 a,
                            html #b_header:hover~#b_content #b_results li:first-child.b_ad li:first-child div.sb_adTA h2 a,
                            html #b_header:hover~#b_content #b_topw li:first-child.b_ad li:first-child div.sb_adTA h2 a,
                            html #b_header:hover~#b_content #b_results li:first-child.b_algo h2 a,
                            html #b_results li.b_msg.b_canvas a:focus-visible,
                            html #b_content .acfImgAns .iaheader .iacf_head:hover span,
                            html #b_results #brsv3 .b_vList li a:hover,
                            html #relatedQnAListDisplay .slide:hover .df_ansatb .b_algo,
                            html #relatedQnAListDisplay .slide:hover .df_ansatb .b_algo a {
                                text-decoration: none;
                            }
                            
                        /* ========== ↓ 文本着重色 */
                        
                            html a,
                            html #b_tween a:visited,
                            html #b_results .b_no a,
                            html .b_tranthis,                               /* 翻译此结果 */
                            html #b_results > li a,                         /* 其他 */
                            html #b_results > li .b_richcard a,             /* 更多咨询 */
                            html #b_results > li.b_algo h2 a,               /* 标题 */
                            html #b_results > li.b_algo h2:not(.sa_uc h2) a /* 标题 */ {
                                color: var(--vbnBing);
                            }
                            
                            
                    /* ================================================== ↓ Head */
                    
                        html #b_header {
                            min-height: calc(var(--vbnSpace4X) + 20px);
                            background: var(--vbnColorBase);
                            transition: var(--vbnOftenTransition);
                        }
                        html #b_header::after {
                            pointer-events: none;
                            z-index: -1;
                            content: "";
                            position: absolute;
                            inset: 0;
                            backdrop-filter: var(--vbnPanelFilter);
                        }
                        html .b_pinhead:not(.b_dark) #b_header {
                            background: hsla(0, 0%, 100%, 0.6) !important;
                            box-shadow: var(--vbnGlassShadow);
                        }
                        
                        /* ========== ↓ 版本切换按钮 */
                        html #b_header > #est_switch {
                            display: flex;
                            margin: 0 auto;
                            justify-content: center;
                        }
                        
                        @media (width <= 1500px) {
                            html body #b_header #sb_form, html body #b_header .b_scopebar { width: var(--vbnSpaceWidthVW); }
                        }
                        
                        /* ========== ↓ 搜索框 */
                        
                            html { vbn { top: var(); }
                            
                                #b_header #sb_form {
                                    z-index: 999;
                                    display: flex;
                                    justify-content: space-between;
                                    margin: 12px auto;
                                    width: var(--vbnSearchWidth);
                                }
                                
                                    .b_logoArea { flex: 0 0 auto; margin: 0; width: 80px; }
                                    
                                    .b_searchboxForm {
                                        position: relative;
                                        display: flex;
                                        align-items: center;
                                        flex: 1 1 auto;
                                    }
                                    
                                        #b_header #sb_form .b_searchbox {
                                            flex: 1 1 auto;
                                            width: auto;
                                            min-width: 300px;
                                        }
                                        #b_header .b_searchboxForm.as_shadow #sw_as {
                                            position: absolute;
                                            top: 100%;
                                            left: 0;
                                            right: 0;
                                            z-index: 1000;
                                            display: none;
                                        }
                                        #b_header .b_searchboxForm.as_rsform #sw_as #sa_ul { width: 50%; }
                                        #b_header #sa_requery { width: 40%; padding-bottom: 10px; }
                                        #sw_as .paa_tx, #sw_as .rs_tx, #sw_as .pasf_tx { width: auto; }
                                        #sw_as .pasf_rich_drw { flex-wrap: wrap; gap: 10px; }
                                        
                                        #sw_as .sa_sg_corner_icon { transform: scale(.8); }
                                        #sa_hs_block > ul, #sa_sug_block > ul { padding: 0 10px; }
                                        #b_header .b_searchboxForm #sb_search { padding-left: 5px; }
                                        #sb_form #sw_as .sa_as #sa_ul li, #sw_as .sa_prnt { border-radius: var(--vbnPanelRadius); }
                                        #sw_as .sa_tm_paa, #sw_as .sa_tm_rs, #sa_ul, .pp_title { font-size: 14px; }
                                        
                                .b_searchboxForm {
                                    box-shadow:
                                        0px 0px 00px 1px hsla(0, 0%, 0%, .02),
                                        2px 5px 10px 1px hsla(0, 0%, 0%, .06);
                                }
                                .b_searchboxForm:hover, .b_focus .b_searchboxForm {
                                    box-shadow:
                                        0px 0px 00px 1px hsla(0, 0%, 0%, .04),
                                        2px 5px 10px 1px hsla(0, 0%, 0%, .09);
                                }
                                .b_searchboxForm.as_shadow.as_show, .as_on .b_searchboxForm.as_shadow {
                                    box-shadow:
                                        0px 02px 09px 0 hsla(0, 0%, 0%, .09),
                                        0px 10px 20px 0 hsla(0, 0%, 0%, .06);
                                }
                                .b_searchboxForm.as_rsform.as_shadow #sw_as .sa_as, .b_searchboxForm.as_shadow #sw_as .sa_as {
                                    box-shadow:
                                        0px 05px 10px 0 hsla(0, 0%, 0%, .02),
                                        0px 20px 25px 0 hsla(0, 0%, 0%, .06);
                                }
                                
                            }
                            
                        /* ========== ↓ 分类 */
                        
                            html #b_header .b_scopebar {
                                margin: 0 auto;
                                margin-top: 10px;
                                width: var(--vbnSearchWidth);
                            }
                            html .b_scopebar:not(:has(> #fltIdtCon)) > ul { display: flex; justify-content: space-evenly; }
                            html #b_header .b_scopebar #fltIdtCon { background: transparent; }
                            
                            @media (width >= 1200px) {
                                html .b_scopebar:not(:has(> #fltIdtCon)) > ul {
                                    margin: auto 24px;
                                    transform: translateX(45px);
                                }
                            }
                            
                            
                        /* ========== ↓ 用户中心 */
                        
                            html #b_header #id_h {
                                z-index: 999;
                                position: fixed;
                                top: 20px;
                                right: 20px;
                            }
                            html #id_a { border-radius: var(--vbnUIRadius); }
                            
                            
                    /* ================================================== ↓ Content */
                        
                        html { background: var(--vbnColorBase); }
                        
                        html #b_content {
                            background: var(--vbnColorBase);
                            max-width: 100%;
                            padding: 40px 0 0 0;
                        }
                        html #b_content > main {
                            display: block;
                            width: var(--vbnSpaceWidthVW);
                            max-width: 100%;
                            margin: 0 auto;
                        }
                        html #b_results, html #b_mcw, html #b_topw { width: 100%; }
                        
                        /* ========== ↓ 模块 通用 */
                        
                            html #b_content #b_results > li:not(.b_top, .b_pag) {
                                box-sizing: border-box;
                                position: relative;
                                padding: var(--vbnSpacePadding);
                                margin: var(--vbnSpaceMargin);
                                width: 100%;
                                font-size: 12px;
                                background: #FFFFFF;
                                box-shadow: var(--vbnOftenSurfaceShadowBase);
                                border-radius: var(--vbnSurfaceRadius);
                                transition: var(--vbnOftenTransition);
                            }
                            html #b_content #b_results > li:not(.b_top, .b_pag):hover {
                                z-index: 2;
                                box-shadow: inset 0 0 2px hsla(0, 0%, 92%, .6), var(--vbnOftenSurfaceShadowHover);
                                transform: var(--vbnSurfaceZoomIn);
                            }
                            
                            html #b_content #b_results > li.b_ans:hover,           /* 相关搜索 */
                            html #b_content #b_results > li.b_msg:hover,           /* 相关搜索 */
                            html #b_content #b_results > li.b_pag:hover,           /* 底部翻页 */
                            html #b_content #b_results > li.b_algoBigWiki:hover,   /* Wiki */ 
                            html #b_content #b_results > li.b_rc_gb_template:hover {
                                transform: none;
                            }
                            
                            /* ========== ↓ 搜索结果 相关 */
                            
                                /* html #b_content #b_results > li.b_ans[data-bm="6"], */
                                html #b_content #b_results > li.b_msg.b_canvas {
                                    opacity: .6;
                                    display: flex;
                                    gap: 20px;
                                    margin: 0;
                                    background: transparent;
                                    box-shadow: none;
                                }
                                html #b_results .b_promtxt { font-size: 14px; }
                                html .b_deepdesk { padding-left: 0; }
                                
                            /* ========== ↓ 标题 */
                                
                                html .b_algo .b_deepdesk h3,
                                html .b_algo .b_deep h3.deeplink_title,
                                html .b_algo .b_deep h3 .deeplink_title,
                                html #b_topw .b_wpt_container .b_wpt_bl h2,
                                html #b_results > li.b_algo h2 a,
                                html #b_results .b_ans #brsv3 h2,
                                html #b_content .b_wpt_container .b_crtrm_wrapper .b_cnt_resp h3 {
                                    font-size: 15px;
                                    font-weight: bold;
                                }
                                
                            /* ========== ↓ 正文 */
                                
                                html .b_cnt_resp,
                                html .b_cus_fields .b_field_title,
                                html #b_results #brsv3 .b_vList li a,
                                html #b_results .b_algo .b_lineclamp1, html #b_results .b_algo .b_lineclamp2,
                                html #b_results .b_algo .b_lineclamp3, html #b_results .b_algo .b_lineclamp4,
                                html #b_results .b_rc_gb_sub.b_rc_gb_sub_hero .b_rc_gb_sub_column .b_rc_gb_sub_cell p {
                                    font-size: 13px;
                                }
                                
                            /* ========== ↓ 源 */
                            
                                html #b_content #b_results .b_algo > .b_tpcn,
                                html #b_content #b_results .b_algo_group > .b_tpcn {
                                    opacity: .6;
                                    padding: var(--vbnSpacePadding);
                                    margin: -10px -20px 10px -20px;
                                    width: 100%;
                                    background: var(--vbnBase09HEX);
                                    border-radius: var(--vbnSurfaceRadius) var(--vbnSurfaceRadius) 5px 5px;
                                }
                                html .b_algo .b_tpcn > .tilk, html .b_algo .b_tpcn strong > .tilk { padding-bottom: 0; }
                                
                                /* html .b_tpcn > .tilk { width: 100%; }
                                html .b_tpcn > .tilk > .tptxt {
                                    display: flex;
                                    justify-content: space-between;
                                    width: 100%;
                                    align-items: center;
                                } */
                               
                            /* ========== ↓ 图片 */
                            
                                html .b_imagePair > .inner { padding-bottom: 0; }
                                
                            /* ========== ↓ Other */
                            
                                html .b_rcGbMod { width: 100%; }
                                
                                
                        /* ========== ↓ Copilot */
                        
                            html #b_bop_cs_sb_place.b_pinbop {
                                position: fixed;
                                width: 50%;
                                left: 50%;
                                bottom: 0;
                                transform: translateX(-50%);
                                padding: 0;
                            }
                            html .b_bop_cs_sb.b_collapsed_co .b_bop_cs_sb_l .composer_container {
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                margin: 20px 0;
                            }
                            html .b_bop_cs_sb.b_collapsed_co .composer_wrapper { max-width: 50%; }
                            
                        /* ========== ↓ Aside */
                        
                            html #b_content #b_context {
                                /* --top: 10px; */
                                z-index: 999;
                                opacity: 0;
                                overflow-y: auto;
                                overflow-x: hidden;
                                position: fixed; /* position: absolute; */
                                top: 50%; /* var(--top) */
                                right: 20px;
                                max-height: 80vh;
                                background: var(--vbnGlassBase);
                                backdrop-filter: var(--vbnPanelFilter);
                                border-radius: var(--vbnPanelRadius);
                                transform: translateY(-50%); /* translateY(calc(var(--top) - 20px)) */
                                transition: opacity .26s ease, transform .26s ease;
                            }
                            html #b_content #b_context:hover { opacity: 1; transform: translateY(calc(-50% - 20px)); /* translateY(var(--top)); */ }
                            
                            @media (width <= 2160px), (height <= 1260px) { #b_content #b_context { display: none; } }
                            
                            /* ========== ↓ 官方词条 */
                                
                                html #b_content #b_context .lite-entcard-main { border-radius: var(--vbnPanelRadius); }
                                html #b_content #b_context .spl_logobg, html #b_content #b_context .bsimg {
                                    border-radius: var(--vbnPanelRadius) var(--vbnPanelRadius) 0 0;
                                }
                                
                            /* ========== ↓ 相关搜索 */
                                
                                html #b_context .richrsrailtitle { display: none; }
                                html #b_context .b_ans, #b_rrat_cont .b_ans { border-radius: var(--vbnPanelRadius); }
                                
                                html #b_context .b_ans { padding: 20px; }
                                
                                
                        /* ========== ↓ 模块 特殊 「首个模块」 */
                        
                            html body #b_pole .b_poleContent { width: 80%; margin: 0 auto; }
                            html #uaanswer { width: auto; }
                            html #b_pole #ent-car-exp.carousel .carousel-controls { margin: 0; }
                            html #b_tween:not(.b_hidetoggletween) ~ #b_pole { padding-left: 0; }
                            
                            html #b_topw .b_wpTabsWrapper {
                                width: 80%;
                                margin: 10px auto -20px auto;
                                background: transparent;
                            }
                            
                            html #b_pole #ent-car-exp.carousel {
                                padding: 0 var(--smtc-gap-between-content-medium);
                                padding-bottom: 30px;
                                border-radius: var(--vbnPanelRadius);
                            }
                            
                            html #b_tween { width: 80%; padding-left: 8px; margin: 0 auto; }
                            
                            html #b_content #b_results li.b_ans.b_top {
                                opacity: 1;
                                box-shadow: none;
                                min-height: 200px;
                            }
                            html #b_content #b_results li.b_ans .qna_tlgacont { width: 80%; margin: 0 auto; }
                            html #fbtop:not(.fbstatic) { bottom: 0; }
                            
                            html #b_results > li { background: transparent; }
                            
                            html .rwrl_fontexp:not(.rwrl_resetFont) {
                                font-size: 15px;
                                line-height: 2;
                            }
                            
                            
                        /* ========== ↓ 模块 官方词条 */
                        
                            html #b_pole { width: 100%; padding: 0; margin: 0; }
                            html #b_pole .b_wpTabsWrapper {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 92px;
                                margin: 0;
                                padding: 0;
                                border-radius: var(--vbnSurfaceRadius);
                            }
                            html #b_pole .b_wpTabsWrapper .ent-dtab-content > div { padding: 0; margin: 0; }
                            
                        /* ========== ↓ 模块 Copilot Search */
                        
                            html #copans_container { width: 90%; margin: 0 auto; margin-bottom: 20px; }
                            html #b_topw .b_ans .b_wpt_container { margin: 10px auto 20px; max-width: 100%; }
                            
                            @media (width >= 1405px) {
                                html #copans_container { display: flex; justify-content: center; }
                                
                            }
                            
                        /* ========== ↓ 模块 Wiki */
                        
                            html #b_content #b_results .b_algo.b_algoBigWiki.b_algoBorder { margin-bottom: 40px; }
                            html #b_results .b_algo:has(.b_wiki_bottom_cover) { min-height: 480px; }
                            html #b_results .b_wiki_bottom_cover { border-radius: inherit; }
                            
                            /* 
                            html .b_rc_gb_sub.b_rc_gb_scroll { height: 260px; }
                            html .b_rc_gb_sub_column {
                                display: flex;
                                align-items: flex-start;
                                gap: 20px;
                            } */
                            html .b_rc_gb_sub.b_rc_gb_scroll { width: 80%; margin: 0 auto; }
                            html #b_rc_gb_origin.b_rc_gb_sub .b_rc_gb_sub_column { max-width: 50%; }
                            html .b_wiki_license { opacity: .5; z-index: 9; margin-top: 10px }
                            
                            html .b_rc_gb_sub_section .b_rc_gb_sub_cell:hover { box-shadow: none !important; }
                            html .b_rc_gb_text_cell_wrapper { min-width: calc(var(--vbnSpaceWidthVW) / 6); }
                            
                        /* ========== ↓ 模块 查看更多 */
                        
                            html #b_results .b_wpt_container { margin: 0; }
                            html #b_results .b_wpt_container .grid { max-width: 100%; justify-items: center; }
                            
                            html #b_content #b_results > li.b_rc_gb_template { margin-bottom: 40px; }
                            
                        /* ========== ↓ 模块 影像 */
                        
                            html #b_content .iacfic.mmkiaacf .iacf_crsl[data-wptds-carousel] {
                                display: flex;
                                justify-content: center;
                            }
                            
                        /* ========== ↓ 模块 图像 */
                        
                            html #b_content .acfImgAns .salink::before,
                            html #b_content .acfImgAns .iasalink::before {
                                border-color: var(--vbnLine);
                            }
                            
                            
                        /* ========== ↓ 模块 表单轮播 */
                        
                            html [id^="tabcontrol"] .tab-menu { width: 80% !important; }
                            
                            
                        /* ========== ↓ 模块 分类标题 */
                        
                            html #b_results .b_algo .b_vlist2col.b_deep, html #b_results .b_algo .b_deep.b_moreLink { padding-left: 0; }
                            html #b_results .b_algo .b_vlist2col.b_deep ul, html #b_results .b_algo .b_vlist2col.b_deep h3 { width: 50%; }
                            
                            
                        /* ========== ↓ 模块 其他人问了以下问题 */
                        
                            html .rqnaacfacc .df_hdr { display: none; }
                            html #df_listaa .df_hd .b_primtxt { font-size: 15px; }
                            html .rqnaContainerwithfeedback { margin: 10px 20px 20px 20px; padding: 0; }
                            
                            
                    /* ================================================== ↓ Bottom */
                    
                        html #b_results .b_ans #brsv3 {
                            display: flex;
                            align-items: center;
                            width: calc(var(--vbnSpaceWidthVW) - 100px);
                            margin: 10px auto;
                        }
                        html #b_results #brsv3 .b_vList li {
                            width: 260px;
                            margin: 5px !important;
                            transform: none !important;
                        }
                        html #b_results #brsv3 .b_vList a .b_suggestionText { overflow: visible; flex: none; }
                        
                        /* ========== ↓ 翻页 */
                        
                            html #b_results .b_pag, html #b_PagAboveFooter {
                                display: flex;
                                justify-content: center;
                                padding: 0;
                                margin: 50px auto;
                                background: transparent;
                            }
                            html #b_results .b_pag a:not(.sb_pagS_bp):hover {
                                border-radius: var(--vbnUIRadius);
                            }
                            
                            /* ========== ↓ 不同版本 修正 */
                            
                                html .b_pag_above_footer_list .b_pag {
                                    width: max-content;
                                    padding: 0;
                                    margin: 20px auto;
                                }
                            
                        html .b_bop_cs_sb:not(.b_above_footer),
                        html .b_bop_cs_sb:not(.b_bop_nobg),
                        html #b_bop_pin_placehold:not(.b_bop_nobg) {
                            background: var(--vbnColorBase);
                        }
                        
                    /* ================================================== ↓ Other */
                    
                        .b_factRowContainer { margin-left: 0; margin-bottom: 10px; }
                        
                `);
                
                /* ========== vbnFocal */
                
                    (function VBN_Bing_vbnFocal() {
                        
                        VBN_ADD_CLASS.apply({
                            target: [
                                "#b_results > li.b_algo h2 > a",
                                "#b_results .b_vList a .b_suggestionText",
                            ],
                            subjoin: [ "vbnFocal", "vbnLR", ],
                        });
                        
                    })();
                    
                /* ========== QuickRead */
                
                    (function VBN_Bing_QuickRead() {
                        
                        if (!VBN_GLOBAL_LOGIC.activate("QuickRead")) return;
                        
                        VBN_QUICK_READ.apply({
                            letterKey: false,
                            buttonPrev: 'nav[role="navigation"] .b_widePag > .sw_prev',
                            buttonNext: 'nav[role="navigation"] .b_widePag > .sw_next',
                        });
                        
                    })();
                    
            });
            
        // #endregion
        
        
        // #region ComfyUI
        
            VBN_GLOBAL_LOGIC.activate("ComfyUI", {
                
                matchSubjoin: {
                    include: [ ...VBN_SITE_GROUP.AIGC ],
                    exclude: []
                } }, () => {
                    
                GM_addStyle( /* css */ `
                
                    :root {
                        --themeColor: 220, 90%, 60%;
                        --navHeight: 50px;
                        --rgHeight: 10px;
                    }
                    #vue-app {
                        --bar-shadow: 0 0 1.5rem #00000060;
                    }
                    
                    html .comfyui-menu[data-v-1545ebd4] { height: var(--navHeight); }
                    html .comfyui-body-left[data-v-0e9641c8] { z-index: 999; }
                    
                    html .side-tool-bar-container[data-v-44002598], html .comfyui-menu[data-v-1545ebd4] {
                        background: var(--vbnGlassShadow);
                        backdrop-filter: var(--vbnSurfaceFilter);
                    }
                    
                    /* ========== ↓ 右键菜单 */
                    
                        html .litegraph.litecontextmenu {
                            padding: 5px;
                            width: max-content;
                            min-width: 150px;
                            max-width: 260px;
                            border-radius: var(--vbnUIRadius);
                            box-shadow: var(--vbnUIShadow) #00000060 !important;
                        }
                        
                        /* ========== ↓ 菜单选项 */
                        html .litegraph.litecontextmenu .litemenu-entry:not(.separator) {
                            display: flex;
                            align-items: center;
                            padding: 2px;
                            margin: 4px 0px;
                            height: 25px;
                        }
                        html .litegraph.litecontextmenu .litemenu-entry.submenu:not(.separator),
                        html .litegraph.litecontextmenu.dark .litemenu-entry.submenu {
                            padding: 0 8px;
                            line-height: 1.92;
                            border-radius: var(--vbnUIRadius);
                        }
                        html .litegraph .litemenu-entry.separator {
                            border-bottom: .1em dashed #00000040;
                        }
                        
                        /* ========== ↓ 箭头图标 */
                        html .litemenu-entry.has_submenu::after {
                            content: "";
                            position: absolute;
                            top: 50%;
                            right: 5px;
                            transform: translateY(-50%);
                            height: 1.2em;
                            width: .2rem;
                            background: hsla(var(--themeColor), 1);
                            box-shadow: 2px 0 6px 0px hsla(var(--themeColor), .6);
                            border-radius: 1em;
                        }
                        html .litegraph .litemenu-entry.has_submenu { border-right: none;}
                        
                        /* ========== ↓ 取值输入框 */
                        
                            html .litegraph .graphdialog {
                                padding: 7px 10px 7px 15px;
                                border: var(--vbnUIBorder) var(--border-color);
                                border-radius: var(--vbnPanelRadius);
                            }
                            html .graphdialog {
                                box-shadow: var(--bar-shadow);
                            }
                            
                            html .graphdialog input, html .graphdialog textarea, html .graphdialog select {
                                border-radius: var(--vbnUIRadius);
                            }
                            
                `);
                
                (function VBN_ComfyUI_manager() {
                    
                    if (!VBN_GLOBAL_LOGIC.activate("manager")) return;
                    
                    GM_addStyle( /* css */ `
                    
                        html #cm-manager-dialog {
                            
                            --vbnColumnH: 40px;
                            --vbnRadiusS: var(--vbnUIRadius);
                            --vbnRadiusM: var(--vbnPanelRadius);
                            --vbnRadiusL: var(--vbnSurfaceRadius);
                            --vbnFont: var(--vbnCodeFont);
                            --vbnMappingText: var(--p-text-muted-color, #FFFFFFCC);
                            --vbnMappingBase: var(--p-dialog-background, #00000040);
                            --vbnMappingButtonBase: var(--p-listbox-option-focus-background, #00000050);
                            --vbnMappingInputBase: var(--p-inputtext-background, #00000050);
                            --vbnMappingBorder: 1px solid var(--p-select-border-color, #FFFFFF20);
                            --vbnMappingBorderColor: var(--p-dialog-border-color, #FFFFFF20);
                            
                            width: 50vw;
                            height: 50vh;
                            
                        }
                        
                        html .comfy-modal {
                            padding: 40px 20px;
                            padding-bottom: 20px;
                            border: 2px solid var(--p-dialog-border-color, #FFFFFF20);
                            background-color: var(--p-dialog-background, #00000040);
                            box-shadow: none;
                            border-radius: var(--vbnSurfaceRadius);
                            font-family: var(--vbnCodeFont);
                        }
                        
                        html .comfy-modal-content {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        }
                        
                        html .cm-title, html #cm-close-button {
                            width: calc(100% - 40px);
                            height: calc(var(--vbnColumnH) * 2);
                            background-color: var(--vbnMappingButtonBase);
                            border-radius: var(--vbnRadiusM);
                        }
                        html body #cm-close-button {
                            position: sticky;
                            bottom: 0;
                            overflow: visible;
                            flex-shrink: 0;
                            height: calc(var(--vbnColumnH) + 20px);
                            box-shadow: 0 10px 25px 0 #00000020;
                            border-radius: var(--vbnRadiusM);
                        }
                        
                        html .cm-title > font { color: var(--vbnMappingText); }
                        
                        html .cm-menu-container {
                            display: flex;
                            justify-content: space-around;
                            gap: 20px;
                            width: calc(100% - 40px);
                            padding: 10px 0;
                        }
                        
                        html .cm-menu-column {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: space-between;
                            width: auto;
                        }
                        html .cm-menu-column > br:first-of-type { display: none; }
                        
                        html .comfy-modal input, html .comfy-modal select {
                            height: var(--vbnColumnH);
                            padding-left: 8px;
                            border: var(--vbnMappingBorder);
                            font-family: var(--vbnFont);
                            font-size: .9em;
                            color: var(--vbnMappingText);
                            background-color: var(--vbnMappingInputBase);
                            border-radius: var(--vbnRadiusS);
                        }
                        
                        html .comfy-btn,
                        html .comfy-menu > button,
                        html .comfy-menu-btns button,
                        html .comfy-menu .comfy-list button,
                        html .comfy-modal button {
                            margin-top: 4px;
                            height: var(--vbnColumnH);
                            border: var(--vbnMappingBorder);
                            color: var(--vbnMappingText);
                            font-family: var(--vbnFont);
                            background-color: var(--vbnMappingButtonBase);
                            border-radius: var(--vbnRadiusS);
                        }
                        html .comfy-btn:hover:not(:disabled),
                        html .comfy-menu > button:hover,
                        html .comfy-menu-btns button:hover,
                        html .comfy-menu .comfy-list button:hover,
                        html .comfy-modal button:hover,
                        html .comfy-menu-actions button:hover {
                            border: var(--vbnMappingBorder);
                            background-color: var(--vbnMappingButtonBase);
                            will-change: auto;
                        }
                        
                        html #cm-manual-button, html #cm-nodeinfo-button { height: var(--vbnColumnH); }
                        html #workflowgallery-button {height: calc(var(--vbnColumnH) + 20px); }
                        
                        html .cm-notice-board {
                            border: var(--vbnMappingBorder);
                            color: #626262;
                            font-size: 14px;
                            border-radius: var(--vbnRadiusM);
                        }
                        
                        html .cm-experimental { border: var(--vbnMappingBorder); }
                        html .cm-experimental-legend { line-height: 1.7;}
                        html .cm-experimental-legend, html .cm-button-red { background-color: #B52121 !important;}
                        
                        html .comfy-modal p { color: var(--vbnMappingText) !important; }
                        html .comfy-modal p, html .cm-experimental-button, html .cm-button, html #cm-nodeinfo-button {
                            font-size: .9em !important;
                        }
                        
                    `);
                    
                })();
                
                (function VBN_ComfyUI_crystools() {
                    
                    if (!VBN_GLOBAL_LOGIC.activate("crystools")) return;
                    
                    GM_addStyle( /* css */ `
                    
                        /* 
                        html .comfyui-menu-right > .flex > .comfyui-button-group:nth-child(2) { order: 1; flex-shrink: 0; }
                        html .comfyui-menu-right > .flex > .comfyui-button-group { order: 2; flex-shrink: 0; }
                        
                        html .comfyui-menu #crystools-monitors-root { vbn { top: var(); }
                        
                            --vbnRadiusS: var(--vbnBaseRadius);
                            
                            order: 0;
                            margin: 0 auto;
                            flex: 0 1 auto;
                            */
                                
                        html .comfyui-menu #crystools-monitors-root {
                        
                            --vbnFontSize: 8px;
                            --vbnRadiusS: 3px;
                            
                            position: fixed;
                            top: calc( var(--navHeight) + var(--rgHeight) + 5px );
                            left: 50%;
                            transform: translateX(-50%);
                            width: max-content;
                            
                            vbn { top: var(); }
                            
                            .crystools-monitor {
                                /* display: flex !important; */
                                align-content: center;
                                justify-content: center;
                                border-radius: var(--vbnRadiusS);
                                background: transparent;
                            }
                            
                            .crystools-monitor[class*="Crystools.ShowRam"] { 
                                order: 1 !important; .crystools-slider { background: #ef5f19 !important; }
                            }
                            .crystools-monitor[class*="Crystools.ShowCpu"] { 
                                order: 2 !important; .crystools-slider { background: #b5e70d !important; } /* #ff3cac */
                            }
                            .crystools-monitor[class*="Crystools.ShowGpuUsageZero"] { 
                                order: 3 !important; .crystools-slider { background: #45d911 !important; }
                            }
                            .crystools-monitor[class*="Crystools.ShowGpuVramZero"] { 
                                order: 4 !important; .crystools-slider { background: #00F29C !important; }
                            }
                            .crystools-monitor[class*="Crystools.ShowGpuTemperatureZero"] { 
                                order: 5 !important; .crystools-slider { background: #8576f7 !important; }
                            }
                            .crystools-monitor[class*="Crystools.ShowHdd"] { 
                                order: 6 !important; .crystools-slider { background: #475295 !important; }
                            }
                            
                            .crystools-slider {
                                border-radius: var(--vbnRadiusS);
                            }
                            
                            /* .crystools-monitor .crystools-content {
                                display: flex;
                                width: 8vw;
                                max-width: 260px;
                                height: 12px;
                            } */
                            .crystools-monitor .crystools-content {
                                display: flex;
                                width: calc( 100vw / 5 - 126px);
                                height: var(--vbnFontSize);
                                background: #0d0f1499 !important;
                            }
                            
                            .crystools-monitor .crystools-text {
                                bottom: auto;
                                margin-left: 0;
                                color: #FFF;
                                font-size: var(--vbnFontSize);
                                font-weight: 700;
                            }
                            
                            .crystools-label {
                                top: 0;
                                right: 10px;
                                font-size: var(--vbnFontSize);
                                font-weight: 700;
                            }
                            
                        }
                    
                    `);
                    
                })();
                
                (function VBN_ComfyUI_rgthree() {
                    
                    if (!VBN_GLOBAL_LOGIC.activate("rgthree")) return;
                    
                    GM_addStyle( /* css */ `
                    
                        html rgthree-progress-bar { height: var(--rgHeight) !important; }
                        
                        html rgthree-progress-bar {
                            --rgthree-progress-bg-color: #171717cc;
                            --rgthree-progress-nodes-bg-color: #524AF7cc;
                            --rgthree-progress-steps-bg-color: #1dffb7cc;
                            --rgthree-progress-error-bg-color: #e3520ccc;
                        }
                        
                    `);
                    
                })();
                
            });
            
        // #endregion
        
        
        // #region DeepSeek
        
            VBN_GLOBAL_LOGIC.activate("Chat", {
                
                matchSubjoin: {
                    include: [ "*deepseek.com/*" ],
                    exclude: []
                } }, () => {
                
                if (!VBN_GLOBAL_LOGIC.activate("DeepSeek")) return;
                
                GM_addStyle( /* css */ `
                
                    html { vbn { top: var(); }
                    
                        body {
                            --dsw-alias-border-l2-darkmode-thin: hsla(0, 0%, 0%, .05);
                        }
                        body, body[data-ds-dark-theme] {
                            --dsw-static-neutral-bluish-1000: #3c3c3d;
                        }
                        
                        .md-code-block > pre, .md-code-block > pre * { font-family: var(--ds-font-family-code) !important; }
                        
                        .e37a04e4, /* 会话标题 */
                        .fbb737a4, /* 聊天信息框 */
                        ._090c426, /* 新对话 按钮 */
                        ._70150b8, /* 深度思考 & 联网搜索 */
                        ._546d736, /* 右侧列表 对话 */ 
                        ._5a8ac7a  /* 右侧列表 新对话 */ {
                            border-radius: var(--vbnPanelRadius);
                        }
                        
                        .fbb737a4 { min-width: 35%; }
                        
                        /* ========== ↓ 返回底部 */
                        ._0e98de6 { right: 50%; transform: translateX(calc(-50% + 35px)); }
                        
                        ._9a2f8e4, ._8f60047 * { transition: all .526s var(--vbnTransitionSoft); }
                        
                        /* ========== ↓ 聊天容器 */
                        ._8f60047 { --message-list-max-width: calc(var(--vbnSpaceWidth02) + 5vw); }
                        
                        /* ========== ↓ 搜索框 */
                        ._9a2f8e4 { max-width: calc(var(--vbnSpaceWidth02) + 5vw); }
                        
                        @media (width <= 1920px) {
                            ._8f60047 { --message-list-max-width: calc(var(--vbnSpaceWidth02) + 20vw); }
                            ._9a2f8e4 { max-width: calc(var(--vbnSpaceWidth02) + 20vw); }
                        }
                        @media (width <= 1260px) {
                            ._8f60047 { --message-list-max-width: calc(var(--vbnSpaceWidth02) + 40vw); }
                            ._9a2f8e4 { max-width: calc(var(--vbnSpaceWidth02) + 40vw); }
                        }
                        
                    }
                    
                `);
                
            });
            
        // #endregion
        
        
        // #region ChatGPT
        
            VBN_GLOBAL_LOGIC.activate("Chat", {
                
                matchSubjoin: {
                    include: [ "*chatgpt.com/*" ],
                    exclude: []
                } }, () => {
                
                if (!VBN_GLOBAL_LOGIC.activate("ChatGPT")) return;
                
                GM_addStyle( /* css */ `
                
                    /* html [class*="--thread-content-max-width"] { transition: max-width .26s var(--vbnTransitionSmooth); } */
                    @media (width >= 1080px) { html [class*="--thread-content-max-width"] { --thread-content-max-width: calc(var(--vbnSpaceWidth02) + 20vw); } }
                    @media (width >= 1600px) { html [class*="--thread-content-max-width"] { --thread-content-max-width: calc(var(--vbnSpaceWidth02) + 15vw); } }
                    @media (width >= 1920px) { html [class*="--thread-content-max-width"] { --thread-content-max-width: calc(var(--vbnSpaceWidth02) + 05vw); } }
                    
                    /* ========== ↓ 首页 聊天框 */
                    @media (width >= 1920px) { html main:has(#thread .mb-7 .text-page-header) [class*="--thread-content-max-width"] {
                        --thread-content-max-width: calc(var(--vbnSpaceWidth02) + 02vw);
                    } }
                    
                    html.vbn [class*="rounded-[18px]"] { border-radius: 14px; }
                    
                    html .shadow-xs, html .shadow-xxs {
                        --tw-shadow:
                            0px 0px 00px 1px var(--tw-shadow-color, var(--shadow-color-2, #0000000F)),
                            0px 5px 10px 0px var(--tw-shadow-color, var(--shadow-color-1, #00000009));
                        border: none;
                    }
                    html [dir=ltr] code[class*=language-] { font-weight: 500; }
                    
                    /* ========== ↓ 聊天框 */
                    
                        html form[data-type="unified-composer"] { vbn { top: var(); }
                        
                            .min-h-14 { min-height: calc(var(--spacing) * 14 + 20px); }
                            
                            .shadow-short {
                                --tw-shadow:
                                    0px 0px 00px 1px var(--tw-shadow-color, var(--shadow-color-2, #0000000D)),
                                    0px 5px 10px 0px var(--tw-shadow-color, var(--shadow-color-1, #00000012));
                            }
                        
                            ._prosemirror-parent_ebv8s_2 p.placeholder { opacity: .4; }
                            [class*="[grid-area:leading]"] { display: flex; align-items: center; } 
                            
                            /* ========== ↓ 展开时 */
                            &[data-expanded] { vbn { top: var(); }
                                /* ._prosemirror-parent_ebv8s_2 .ProseMirror { margin-top: auto; } */
                            }
                            
                        }
                        
                        /* 
                            侧边栏展开 var(--sidebar-width) 侧边栏关闭 var(--sidebar-rail-width)
                            transform: translateX(calc(-1 * (var(--sidebar-width) - var(--sidebar-rail-width)) / 2));
                            
                        html body:has([data-testid="close-sidebar-button"][aria-expanded="true"]) :is(.mx-auto, .mt-auto, button.border-token-border-default) {
                            transform: translateX(calc(-52px)); 
                        } */
                       
                `);
                
            });
            
        // #endregion
        
        // #region DOUBAO
        
            VBN_GLOBAL_LOGIC.activate("Chat", {
                
                matchSubjoin: {
                    include: [ "*doubao.com/*" ],
                    exclude: []
                } }, () => {
                
                if (!VBN_GLOBAL_LOGIC.activate("DOUBAO")) return;
                
                GM_addStyle( /* css */ `
                
                    html .container-arOxqB {
                        --center-content-max-width: calc(var(--vbnSpaceWidth02) + 100px) !important;
                    }
                    
                    html .chat-input-container-FpHqTd { max-width: 100%; }
                    html .chat-footer-action-wrapper-Y8Gz6b { max-width: 100%; }
                    
                    /* ========== ↓ 聊天框悬浮 */
                    
                        html .footer-Wl2Pj7 > .container-arOxqB.chrome70-container {
                            position: absolute;
                            bottom: 0;
                            background: transparent;
                            --center-content-max-width: var(--vbnSpaceWidth02) !important;
                        }
                        /* ========== ↓ 回到底部 */
                        html .message-list-V8qfyv .to-bottom-button-Bs3jaG { bottom: calc(20px + 130px); }
                        
                `);
                
            });
            
        // #endregion
        
        
        // #region YUQUE
        
            VBN_GLOBAL_LOGIC.activate("YUQUE", {
                
                matchSubjoin: {
                    include: [ "*yuque.com/*" ],
                    exclude: []
                } }, () => {
                
                GM_addStyle( /* css */ `
                
                    /* ================================================== ↓ Global */
                    
                        html {
                            
                            &.vbn body {
                                --vbnRS: var(--vbnUIRadius);
                                --vbnRM: var(--vbnPanelRadius);
                                --vbnWidth: 260px;                                    /* 实际内容宽度为 原 750px + 设置的宽度 */
                                --vbnOffset: -60px;                                   /* 因原有左右侧边栏宽度不一 可设置向右偏移 调整至视觉居中 */
                                --vbnMargin: var(--vbnWidth) / 2 + var(--vbnOffset);  /* 官方值 XXX + 宽度的一半 + 偏移值 */
                            }
                            
                            @media (width <= 2460px) { &.vbn body { --vbnWidth: 260px; --vbnOffset: 0px; } }
                            @media (width <= 1920px) { &.vbn body { --vbnWidth: 100px; --vbnOffset: 0px; } }
                            @media (width <= 1202px) { &.vbn body { --vbnWidth: 000px; --vbnOffset: 0px; } }
                            
                            /* ========== ↓ 代码块 语言 & 按钮 */
                            
                                .ne-code-viewer .ne-codeblock-copy,
                                .ne-code-viewer .ne-codeblock-explain,
                                .ne-code-viewer .ne-codeblock-mode-name,
                                .ne-code-viewer .ne-codeblock-run-button {
                                    font-size: 12px;
                                }
                                
                            /* ========== ↓ 行内代码 */
                            
                                ne-code ne-code-content {
                                    padding: .126em .4em !important;
                                    text-shadow: 0 0 .092em currentColor !important;
                                }
                                
                            /* ========== ↓ 着重点 */
                            
                                ne-uli-i .ne-list-symbol { color: var(--vbnAccentHEX); }
                                ne-uli-i .ne-list-symbol > span { transform: scale(.35); }
                                
                            /* ========== ↓ Card */
                            
                                :is(.ne-viewer, .ne-editor)ne-card[data-card-type=block], ne-card[data-card-type=block] .ne-card-container {
                                    border-radius: var(--vbnRS);
                                }
                                
                            /* ========== ↓ 快捷键/客服中心 */
                            .side-tip-container.side-tip-container-visible { bottom: 30px !important; }
                                
                            /* ========== ↓ 疑似 表格/数据表全宽 / 侧边栏 开启时 */
                            
                                .DocReader-module_wrapper_t3Z8X[data-doc-layout="fixed"]:is( [data-doc-sidebar="true"], [data-doc-toc="true"] )
                                    .article-content .ne-doc-major-viewer .ne-viewer-layout-mode-fixed .ne-viewer-body > :is(
                                        ne-alert-hole,
                                        ne-container-hole,
                                        ne-hole,
                                        ne-root-card-hole,
                                        ne-table-hole
                                    ).ne-full-width {
                                    width: calc(100% - 305px + var(--vbnWidth));
                                }
                                
                            /* ============================== ↓ 预览模式 */
                            
                            
                            /* ============================== ↓ 编辑模式 */
                            
                        }
                        
                    /* ================================================== ↓ 首页 */
                    /* ================================================== ↓ 搜索页 */
                    /* ================================================== ↓ Other */
                    
                    
                    /* ========== ↓ 内容宽度 */
                    
                        
                        html .ne-viewer-body > *, html .DocReader-module_header_xAOtU { transition: all .92s var(--vbnTransitionSoft) }
                        
                        /* ========== ↓ 阅读模式 */
                        
                            /* ========== ↓ 标题 */
                            html .DocReader-module_comment_eDglS, html .DocReader-module_header_xAOtU, html .DocReader-module_info_yXA4e {
                                max-width: calc(850px + var(--vbnMargin));
                            }
                            
                            /* ========== ↓ 内容 */
                            html .ne-doc-major-viewer .ne-viewer-layout-mode-fixed .ne-viewer-body > * {
                                max-width: calc(750px + var(--vbnWidth));
                            }
                            
                            html .article-content .ne-doc-major-viewer .ne-viewer-layout-mode-adapt .ne-viewer-body > *,
                            html .article-content .ne-doc-major-viewer .ne-viewer-layout-mode-fixed .ne-viewer-body > * {
                                margin-right: calc(var(--viewer-center-align-right) - var(--vbnMargin)) !important;
                            }
                            /* ========== ↓ 代码块 */
                            html .article-content .ne-doc-major-viewer .ne-viewer-layout-mode-fixed .ne-viewer-body > ne-alert-hole,
                            html .article-content .ne-doc-major-viewer .ne-viewer-layout-mode-fixed .ne-viewer-body > ne-container-hole,
                            html .article-content .ne-doc-major-viewer .ne-viewer-layout-mode-fixed .ne-viewer-body > ne-hole {
                                width: calc(100% - var(--viewer-center-align-value) + var(--vbnWidth));
                            }
                            
                        /* ========== ↓ 编辑模式 */
                        
                            /* ========== ↓ 标题 */
                            html .ne-doc-major-editor .ne-editor.layout-read-write:not(.ne-layout-mode-adapt) .ne-editor-extra-box {
                                max-width: calc(890px + var(--vbnMargin));
                            }
                            
                            /* ========== ↓ 内容 */
                            html .ne-doc-major-editor .ne-editor.layout-read-write:not(.ne-layout-mode-adapt) .ne-engine>:not(.ne-full-width) {
                                margin-right: calc(var(--center-editor-margin-right) - var(--vbnMargin)) !important;
                                max-width: calc(750px + var(--vbnWidth));
                            }
                            html .ne-layout-mode-adapt .ne-editor-wrap-box, html .ne-layout-mode-fixed .ne-editor-wrap-box { background-color: transparent; }
                            
                            /* ========== ↓ 表格 */
                            html .ne-doc-major-editor .ne-layout-mode-fixed.ne-normal-toc:not(.ne-ui-sidebar-visible).ne-viewport-size-toc-XXL .ne-engine ne-table-hole {
                                max-width: calc(752px + var(--vbnWidth));
                            }
                            
                            
                    /* ========== ↓ 编辑器 标题 激活 */
                    
                        html .lake-title-editor .ant-input, .lake-title-editor .ant-input:focus { background-color: transparent; }
                        
                    /* ========== ↓ 右侧边栏 文档导航 */
                    
                        html .ne-toc-sidebar, html .sidePanel-module_panel_Vr-DC {
                            background: var(--vbnGlassBase);
                            backdrop-filter: var(--vbnPanelFilter);
                        }
                        
                        /* html .sidePanel-module_panel_Vr-DC, html .ne-toc-sidebar .ne-toc-view { background-color: transparent; } */
                        
                        @media (width >= 1260px) {
                            html .ne-toc-sidebar, html .sidePanel-module_panel_Vr-DC {
                                background: transparent;
                                backdrop-filter: none;
                            }
                        }
                        
                    /* ========== ↓ Picture */
                    
                        html .ne-image-wrap .ne-image-box {
                            overflow: visible;
                            background: transparent;
                        }
                        html .ne-image-wrap,
                        html .ne-viewer ne-card[data-card-type=inline][data-card-name=image], /* 预览模式 */
                        html .ne-editor ne-card[data-card-type=inline][data-card-name=image] /* 编辑模式 */ {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        
                        html .ne-paragraph-spacing-relax.ne-typography-classic ne-card[data-card-name=image] img {
                            border-radius: var(--vbnPanelRadius);
                            filter: drop-shadow(0 20px 30px hsla(var(--vbnBase04HSL), 0.050));
                            transition: all .526s var(--vbnTransitionSoft);
                        }
                        html .ne-paragraph-spacing-relax.ne-typography-classic ne-card[data-card-name=image] img:hover {
                            filter: drop-shadow(0 20px 30px hsla(var(--vbnAccentHSL), 0.260));
                            transform: var(--vbnSurfaceZoomIn);
                        }
                        
                        /* ---------- ↓ 默认样式 */
                        
                            /* ---------- ↓ Hover */
                            html .ne-editor ne-card[data-card-type=inline][data-card-name=image].ne-card-hovered .ne-image-wrap,
                            html .ne-editor ne-card[data-card-type=inline][data-card-name=image].ne-focused .ne-image-wrap {
                                border-color: transparent;
                            }
                            /* ---------- ↓ 选中图片的默认边框 */
                            html .ne-active .ne-ui-image-resizer-box { display: none; }
                            
                            
                    /* ========== ↓ Table 「下方功能添加 vbnTable样式 此处仅作修复显示」 */
                    
                        html ne-table-wrap.ne-ui-table-right-shadow:after { display: none; }
                    
                        /* ---------- ↓ table 外层容器 */
                        html .ne-table-hole > ne-table-wrap > ne-table-inner-wrap {
                            overflow: visible !important;
                        }
                        
                        /* ---------- ↓ 标题 */
                        html table[ne-table-row-head=true]:not([ne-table-head-text-gradient=true]) tr:first-child td .ne-td-content>.ne-b-filler,
                        html table[ne-table-row-head=true]:not([ne-table-head-text-gradient=true]) tr:first-child td ne-text {
                            font-weight: 700 !important;
                            color: #4D4D4D !important;
                        }
                        
                        /* ---------- ↓ 标题 背景及边框 */
                        html table[ne-table-row-head=true]:not([ne-table-head-text-gradient=true]) tr:first-child td {
                            background-color: #FAFAFA !important;
                            border-color: #00000000 !important;
                        }
                        html table[ne-table-row-head=true]:not([ne-table-head-text-gradient=true]) tr:first-child td:not(:first-child, :last-child) {
                            border-left: 1px solid #00000010 !important;
                            border-right: 1px solid #00000010 !important;
                        }
                        
                        /* ---------- ↓ Sticky */
                        html ne-table-hole[class="ne-table-hole"] > ne-table-wrap > div[style*="top: 0px"] {
                            top: -27px !important;
                        }
                        
                        html tr.ne-tr.ne-tr-sticky {
                            top: calc(79px - 27px) !important;
                            border-radius: 0 0 var(--vbnSurfaceRadius) var(--vbnSurfaceRadius);
                        }
                        
                        
                    /* ========== ↓ 标题 */
                    
                        html #article-title,
                        html ant-input lake-title,
                        html .ne-viewer ne-h1 ne-text, html .ne-engine ne-h1 ne-text { color: var(--vbnMarkdownH1);}
                        html .ne-viewer ne-h2 ne-text, html .ne-engine ne-h2 ne-text { color: var(--vbnMarkdownH2);}
                        html .ne-viewer ne-h3 ne-text, html .ne-engine ne-h3 ne-text { color: var(--vbnMarkdownH3);}
                        html .ne-viewer ne-h4 ne-text, html .ne-engine ne-h4 ne-text { color: var(--vbnMarkdownH4);}
                        html .ne-viewer ne-h5 ne-text, html .ne-engine ne-h5 ne-text { color: var(--vbnMarkdownH5);}
                        html .ne-viewer ne-h6 ne-text, html .ne-engine ne-h6 ne-text { color: var(--vbnMarkdownH6);}
                        
                        html .lake-title-editor .lake-title { background-color: transparent; }
                        
                    /* ========== ↓ 工具栏 */
                    
                        /* ---------- ↓ 选中图片 */
                        html .ne-card-toolbar {
                            magic: 10px 0 0;
                            border-radius: var(--vbnPanelRadius);
                        }
                        
                `);
                
                (function VBN_YUQUE_vbnTable() {
                    
                    if (!VBN_GLOBAL_LOGIC.activate("vbnTable")) return;
                    
                    VBN_ADD_CLASS.apply({
                        target: [ "#main.BookReader-module_content_BGKYX table", ],
                        subjoin: [ "vbnTable", ],
                    });
                    
                })();
                
                (function VBN_YUQUE_vbnGrid() {
                    
                    if (!VBN_GLOBAL_LOGIC.activate("vbnGrid")) return;
                    
                    VBN_ADD_CLASS.apply({
                        target: [
                            ".BookReader-module_wrapper_s6Jdt",
                            ".ne-layout-mode-adapt .ne-editor-wrap-box",
                            ".ne-editor-wrap-content",
                            // ".ne-layout-mode-fixed .ne-editor-wrap-box",
                        ],
                        subjoin: [ "vbnGrid", "vbnSolid", ],
                    });
                    
                })();
                    
            });
            
        // #endregion
        
        
        // #region TickTick
        
            VBN_GLOBAL_LOGIC.activate("TickTick", {
                
                matchSubjoin: {
                    include: [
                        
                        "*dida365.com/*",
                        "*ticktick.com/*",
                        
                    ],
                    exclude: [ ]
                } }, () => {
                
                GM_addStyle( /* css */ `
                
                    html { vbn { top: var(); }
                        
                        /* ---------- ↓ 默认阴影 */
                        .shadow-default, .shadow-md {
                            box-shadow: var(--vbnUIShadow) hsla(var(--vbnBase04HSL), .12);
                        }
                        /* ---------- ↓ 左下角 小日历 */
                        .bg-sidebar-bg-color { background: transparent; }
                        
                        /* ---------- ↓ 看板 各列 */
                        #column-list-inner > article { width: var(--vbnSpace4Y) !important; }
                        
                    }
                    
                `);
                
            });
            
        // #endregion
        
        
        // #region Youtube
        
            VBN_GLOBAL_LOGIC.activate("Youtube", {
                
                matchSubjoin: {
                    include: [ "*youtube.com/*" ],
                    exclude: [ ]
                } }, () => {
                
                GM_addStyle( /* css */ `
                
                    html {
                        
                        &.vbn body {
                            --vbnRS: var(--vbnBaseRadius);
                            --vbnRM: var(--vbnPanelRadius);
                        }
                        
                        @media (width >= 1500px) {
                            
                            /* ========== ↓ Video */
                            ytd-rich-grid-renderer[is-default-grid] ytd-rich-item-renderer[rendered-from-rich-grid] {
                                --ytd-rich-grid-items-per-row: 6 !important;
                            }
                            
                            /* ========== ↓ Shots */
                            ytd-rich-shelf-renderer[is-shorts] ytd-rich-item-renderer[items-per-row][is-slim-media] {
                                --ytd-rich-grid-items-per-row: 8 !important;
                            }
                            
                            /* ========== ↓ News */
                            ytd-rich-shelf-renderer[elements-per-row] ytd-rich-item-renderer[is-shelf-item] {
                                --ytd-rich-grid-items-per-row: 6 !important;
                            }
                            
                        }
                        
                        /* ========== ↓ 字幕 */
                        .html5-video-player .caption-visual-line .ytp-caption-segment:last-child {
                            padding: 2px 10px;
                            margin: 2px 0;
                            font-size: 32px !important;
                            background: hsla(var(--vbnBase00HSL), .6) !important;
                            border-radius: var(--vbnRS);
                            backdrop-filter: var(--vbnPanelFilter);
                        }
                        
                    }
                    
                `);
                
            });
            
        // #endregion
        
        
        // #region Bilibili
        
            VBN_GLOBAL_LOGIC.activate("Bilibili", {
                
                matchSubjoin: {
                    include: [ "*Bilibili.com/*" ],
                    exclude: [ ]
                } }, () => {
                
                GM_addStyle( /* css */ `
                
                    html { vbn { top: var(); }
                    
                        .mini-header, .header-channel,
                        &.vbn .search-input-container .search-fixed-header {
                            box-shadow: var(--vbnGlassShadow);
                        }
                        
                        /* #vbnDOM .edu-link { display: none; }
                        
                        /* ========== ↓ 播放器 */
                        
                            #playerWrap { border-radius: var(--vbnUIRadius); }
                            
                            .bpx-docker-major,
                            .bpx-player-container,
                            .bpx-player-primary-area,
                            .bpx-player-video-area,
                            .bpx-player-video-perch,
                            .bpx-player-video-wrap,
                            .bpx-player-sending-bar {
                                background: var(--bpx-dmsend-main-bg, #FFF);
                            }
                            
                            .bpx-player-video-area {
                                border-radius: var(--vbnUIRadius);
                                box-shadow: 0 0 10px hsla(0, 0%, 0%, .02);
                            }
                            
                            #bilibili-player-placeholder, .bpx-player-container { box-shadow: none; }
                            .bpx-player-video-wrap video { background: var(--vbnPrimaryHEX); }
                            
                            /* ========== ↓ 弹幕输入 */
                            .bpx-player-sending-bar .bpx-player-video-inputbar { backdrop-filter: var(--vbnPanelFilter); }
                            
                        /* ========== ↓ 播放列表 */
                        
                            .simple-base-item .title { font-size: 14px; justify-content: space-between; }
                            .simple-base-item .title .title-txt { order: 1; }
                            .simple-base-item .title .playing-gif { order: 2; margin: 0 4px; }
                            .simple-base-item.normal.active { border-radius: var(--vbnBaseRadius); }
                            
                            /* ========== ↓ 默认小按钮 */
                            &.vbn .video-pod .video-pod__header .header-bottom .right .subscribe-btn {
                                border-radius: var(--vbnBaseRadius);
                            }
                            
                            /* ========== ↓ 播放列表高度 */
                            &.vbn .video-container-v1 .video-pod .video-pod__body {
                                max-height: calc(40vh + 2vh + 1vh);
                            }
                            
                    }
                    
                `);
                
            });
            
        // #endregion
        
        
    // $ ================================================== ↓ Micro
    
        // #region Micro
        
            VBN_GLOBAL_LOGIC.activate("Eagle", () => {
                
                GM_addStyle( /* css */ `
                
                    html .eagle-drop-area .eagle-drop-area-content .title[eagle-extension][eagle-extension-theme="dark"],
                    html [eagle-extension][eagle-extension-theme="dark"] .eagle-drop-area .eagle-drop-area-content .title {
                        border: none;
                    }
                    
                `);
                
            });
            
            
            VBN_GLOBAL_LOGIC.activate("NetDisk_Check", () => {
                
                GM_addStyle( /* css */ `
                
                    /* ========== 连接正确 */
                    
                        html .one-pan-tip { text-decoration: none;}
                        html .one-pan-tip::before {
                            height: .95em;
                            width: .95em;
                            margin: 0 .15em .15em;
                            background-image: var(--vbnICON-URL-Correct);
                        }
                        
                    /* ========== 连接错误 */
                    
                        html .one-pan-tip-error { text-decoration: none;}
                        html .one-pan-tip-error::before {
                            background-image: var(--vbnICON-URL-Error);
                        }
                        
                    /* ========== 带提取码 */
                    html .one-pan-tip-lock::before { background-image: var(--vbnICON-URL-Safety); }
                    
                    /* ========== 夸克 */
                    html .one-pan-tip-partial::before { background-image: var(--vbnICON-URL-Info); }
                    
                `);
                
            });
            
        // #endregion
        
        
        // #region Other
        
            /* ========== Github */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*github.com/*" ],
                        exclude: []
                    } }, () => {
                        
                    GM_addStyle( /* css */ `
                    
                        html { vbn { top: var(); }
                            .markdown-body .highlight pre, .markdown-body pre { font-size: 75%; line-height: 1.7; }
                        }
                        
                    `);
                    
                });
                
            /* ========== MDN */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*developer.mozilla.org/*" ],
                        exclude: []
                    } }, () => {
                        
                    GM_addStyle( /* css */ `
                    
                        @media (width >= 1920px) {
                            
                            html:root {
                                
                                --font-line-content: 1.5;
                                
                                --layout-side-padding: max(var(--layout-side-padding-min),calc(45vw - 720px + 1rem));
                                --layout-content-max: 59rem;
                                
                            }
                            
                        }
                        
                    `);
                    
                });
                
            /* ========== Greasyfork */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [
                            
                            "*greasyfork.org/*",
                            
                        ],
                        exclude: []
                    } }, () => {
                    
                    GM_addStyle( /* css */ `
                    
                        html { vbn { top: var(); }
                        
                            p, li { line-height: 1.5; }
                            
                            code {
                                padding: .126em .4em;
                                text-shadow: 0 0 .126em currentColor;
                                border-radius: var(--vbnBaseRadius);
                            }
                            ul:not(.block-list) code { background: #e9eaed; }
                            
                            .user-content { background: none; border-color: transparent; }
                            #additional-info img { border-radius: var(--vbnBaseRadius); }
                            #additional-info hr { opacity: .4; }
                            
                            .install-link, .install-link:visited, .install-link:active, .install-link:hover, .install-help-link { display: inline; }
                            
                            .form-control textarea:not([rows]), #ace-editor {
                                padding: 20px 10px;
                                margin: 10px 0;
                                height: 24em;
                                border-color: #00000012;
                                border-radius: 12px;
                            }
                            
                            .inline-script-stats dt, .inline-script-stats dd { line-height: 22px; }
                            #script-stats .block-list.expandable.collapsed { width: max-content; max-width: 620px; }
                            
                        }
                        
                    `);
                    
                    /* ========== vbnLink */
                    
                        (function VBN_Greasyfork_vbnLink() {
                            
                            VBN_ADD_CLASS.apply({
                                target: [
                                    "body a[href]:not(#script-links [href], #install-area [href], #script-list-option-groups [href], #main-header [href]):not(:has(img))",
                                    "#main-header a[href]:not(#site-name [href])",
                                    ".browser-list-selector:not(.browser-list-selector-active)",
                                ],
                                subjoin: [ "vbnLink", ],
                            });
                            
                        })();
                        
                });
                
            /* ========== Workona */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*workona.com/*" ],
                        exclude: []
                    } }, () => {
                    
                    GM_addStyle( /* css */ `
                    
                        html { vbn { top: var(); }
                        
                            :is(.style_draggableItem__m8Jpw .style_content__AHpFv, .style_list__v0p3N .style_root__ybLxR )
                            :not(.material-icons) {
                                font-family: var(--vbnCodeFont) !important;
                            }
                            
                        }
                        
                    `);
                    
                });
                
            /* ========== OpenUserJS */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*openuserjs.org/*" ],
                        exclude: []
                    } }, () => {
                    
                    GM_addStyle( /* css */ `
                    
                        html body  { max-width: var(--vbnSpaceWidthVW); margin: 0 auto; }
                        
                    `);
                    
                });
                
            /* ========== Wikipedia */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*wikipedia.org/*" ],
                        exclude: []
                    } }, () => {
                    
                    GM_addStyle( /* css */ `
                    
                        html .mw-page-container {
                            --vbnLine: #00000020;
                        }
                        
                        html .mp-2012-column-right-block,
                        html .mw-parser-output #mp-2012-links table {
                            border-radius: var(--vbnUIRadius);
                        }
                        
                        html .infobox {
                            border-radius: var(--vbnUIRadius);
                            border-color: var(--vbnLine);
                        }
                        
                        html .wikitable {
                            overflow: hidden;
                            border-radius: var(--vbnUIRadius);
                            box-shadow: 0 0 0 1px var(--vbnLine);
                        }
                        html .wikitable > tr > th,
                        html .wikitable > tr > td,
                        html .wikitable > * > tr > th,
                        html .wikitable > * > tr > td {
                            border-color: var(--vbnLine);
                        }
                        
                    `);
                    
                });
                
            /* ========== Dillinger */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*dillinger.io/*" ],
                        exclude: []
                    } }, () => {
                    
                    GM_addStyle( /* css */ `
                        
                        html, body { font-family: var(--vbnBaseFont); }
                        html .ace_editor { font-family: var(--vbnCodeFont) !important;}
                        
                    `);
                    
                });
                
            /* ========== AcronymFinder */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*acronymfinder.com/*" ],
                        exclude: []
                    } }, () => {
                    
                    GM_addStyle( /* css */ `
                    
                        html { vbn { top: var(); }
                        
                            /* [id*="vw"], [id*="xj"]  */
                            [id^="wl"], [id^="te"] /* 不知名白色块 疑似AD */{
                                display: none;
                            }
                            
                            .container { max-width: var(--vbnSpaceWidthVW); padding: 0; margin: 0 auto; }
                            .search-main .form-control { width: 500px; }
                            .search-results .tabs .no-link { width: max-content; }
                            
                            .r0, .r1, .r2, .r3, .r4, .r5 {
                                display: flex;
                                justify-content: space-between;
                                font-weight: bold;
                            }
                            
                        }
                        
                    `);
                    
                });
                
            /* ========== Abbreviations */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*abbreviations.com/*" ],
                        exclude: []
                    } }, () => {
                    
                    GM_addStyle( /* css */ `
                    
                        html {
                            
                            &.vbn body {
                                --vbnWidth: 1260px;
                                --vbnAside: 330px;
                                --vbnShadow: 0 .5em 2em 0 hsla(184, 22%, 14%, .12);
                            }
                            
                            #main, .content-top, #header-int, .page-top-search { max-width: var(--vbnWidth); }
                            
                            .page-word-search { width: calc(100% - var(--vbnAside)); }
                            #content-aside { max-width: var(--vbnAside); }
                            
                            .cblocks .cblock,
                            .category-header,
                            .translate .well,
                            .biblio .well,
                            #content-main .callout,
                            #content-main .siteprop,
                            #content-body > div > section.split > .row > div > div,
                            #content-body > section.split > div {
                                box-shadow: var(--vbnShadow);
                            }
                            
                            @media (width >= 768px) {
                                
                                #main , #header, #footer { min-width: var(--vbnWidth); }
                                
                                .col-sm-8 { width: calc(100% - var(--vbnAside) ); }
                                .col-sm-push-4 { left: calc(var(--vbnAside)); }
                                .col-sm-pull-8 { right: calc(100% - var(--vbnAside)); }
                                
                            }
                            
                        }
                        
                    `);
                    
                });
                
            /* ========== Bigjpg */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*bigjpg.com/*" ],
                        exclude: []
                    } }, () => {
                        
                    GM_addStyle( /* css */ `
                    
                        @media (width >= 768px) {
                            
                            html .container { max-width: none; }
                            html .jumbotron { padding-top: 80px; padding-bottom: 80px; }
                            
                        }
                        
                    `);
                    
                });
                
            /* ========== DOU */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*douyin.com/*" ],
                        exclude: []
                    } }, () => {
                        
                    GM_addStyle( /* css */ `
                    
                        html.vbn, html body, html body > div:first-child { height: auto; }
                        
                    `);
                    
                });
                
            /* ========== 115 */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*://115.com/*" ],
                        exclude: []
                    } }, () => {
                        
                    GM_addStyle( /* css */ `
                        
                        /* ========== 云下载 弹窗 */
                        
                            html .offline-box {
                                position: fixed !important;
                                top: 50% !important;
                                left: 50% !important;
                                transform: translate(-50%, -50%);
                                width: 43vw !important;
                                height: 50vh;
                                border-radius: var(--vbnSurfaceRadius);
                                transition: all .43s var(--vbnTransitionSoft);
                            }
                            
                            /* ---------- 云下载 输入框 */
                            html .dialog-input.input-offline textarea {
                                height: 32vh;
                                border-radius: var(--vbnSurfaceRadius);
                            }
                            
                            @media (width <= 1200px) {
                                html .offline-box { width: 59vw !important; height: 92vh;}
                                html .dialog-input.input-offline textarea { height: 70vh;}
                            }
                            
                    `);
                    
                });
                
            /* ========== weixin */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*mp.weixin.qq.com/*" ],
                        exclude: []
                    } }, () => {
                        
                    GM_addStyle( /* css */ `
                    
                        html .pages_skin_pc.wx_wap_desktop_fontsize_2 .rich_media_area_primary_inner {
                            max-width: var(--vbnSpaceWidth02);
                        }
                        
                    `);
                    
                });
                
            /* ========== emmet */
            
                VBN_GLOBAL_LOGIC.activate("Other", {
                    
                    matchSubjoin: {
                        include: [ "*docs.emmet.io/*" ],
                        exclude: []
                    } }, () => {
                        
                    GM_addStyle( /* css */ `
                    
                        html .wrapper { width: 60vw; }
                        
                    `);
                    
                });
                
            /* ========== XXXXX */
            
                if (
                    VBN_MATCH_RULE.match({
                        include: [ "*periodic-table-tags-mu-six.vercel.app/*" ],
                        exclude: [ ]
                    })
                ) {
                    GM_addStyle( /* css */ `
                    
                        html {
                            
                            &.vbn body {
                                --w: 260px;
                            }
                            
                            .title h1 { display: none; }
                            .star { margin: 100px 0; }
                            .intro { margin: 24vh 0 14vh 20vw; }
                            .elements[data-v-ff33deea] {
                                width: 5rem;
                                font-family: var(--vbnCodeFont);
                                font-size: var(--vbnCodeSize);
                                border-radius: var(--vbnUIRadius);
                                transition: all .526s var(--vbnTransitionSoft);
                            }
                            .elements:hover {
                                z-index: var(--vbnPriority00);
                                box-shadow:
                                    0 0 0 2px #00000080,
                                    var(--vbnPanelShadow) hsla(var(--vbnBase02HSL), .8) !important;
                                transform: var(--vbnUIZoomIn);
                            }
                            .elements[data-v-ff33deea]:has(.info) { z-index: var(--vbnPriority00); }
                            .elements .info[data-v-ff33deea] { border-radius: var(--vbnPanelRadius);}
                            
                        }
                        
                    `);
                }
                
        // #endregion
        
})();