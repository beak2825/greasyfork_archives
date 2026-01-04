// ==UserScript==
// @name         云盘批量重命名
// @namespace    vite-plugin-monkey
// @version      1.4.4
// @author       a1mersnow
// @description  批量重命名云盘里的文件，支持123云盘、阿里云盘、百度网盘、移动云盘、天翼云盘、夸克云盘
// @license      GPL
// @icon         data:image/jpeg;base64,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
// @source       https://github.com/a1mersnow/drive-rename
// @match        https://www.123pan.com/*
// @match        https://www.aliyundrive.com/*
// @match        https://www.alipan.com/*
// @match        https://pan.baidu.com/disk/*
// @match        https://yun.139.com/*
// @match        https://cloud.189.cn/*
// @match        https://pan.quark.cn/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/js-md5@0.8.3/build/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479295/%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/479295/%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const a=document.createElement("style");a.textContent=t,document.head.append(a)})(` .custom-scrollbar[data-v-b66f0371]::-webkit-scrollbar{width:6px}.custom-scrollbar[data-v-b66f0371]::-webkit-scrollbar-track{--un-bg-opacity:1;background-color:rgb(222 232 255 / var(--un-bg-opacity))}.custom-scrollbar[data-v-b66f0371]::-webkit-scrollbar-thumb{border-radius:9999px;--un-bg-opacity:1;background-color:rgb(112 136 255 / var(--un-bg-opacity));transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.custom-scrollbar[data-v-b66f0371]::-webkit-scrollbar-thumb:hover{--un-bg-opacity:1;background-color:rgb(61 64 238 / var(--un-bg-opacity))}.clip-enter-from,.clip-leave-to{clip-path:inset(0 100% 100% 0 round 8px)}.clip-enter-to,.clip-leave-from{clip-path:inset(0 0 0 0 round 8px)}.clip-enter-active,.clip-leave-active{transition:clip-path .3s ease}.fade-left-enter-from,.fade-left-leave-to{opacity:0;transform:translate(10%)}.fade-left-enter-to,.fade-left-leave-from{opacity:1;transform:none}.fade-left-enter-active,.fade-left-leave-active{transition:opacity .3s,transform .3s ease}.fade-enter-from,.fade-leave-to{opacity:0}.fade-enter-to,.fade-leave-from{opacity:1}.fade-enter-active,.fade-leave-active{transition:opacity .3s}:where(.drive-rename-root) :is(*,*:before,*:after){box-sizing:border-box;border-width:0;border-style:solid;border-color:var(--un-default-border-color, #e5e7eb)}:where(.drive-rename-root) :is(*:before,*:after){--un-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}:where(.drive-rename-root) hr{height:0;color:inherit;border-top-width:1px}:where(.drive-rename-root) abbr:where([title]){text-decoration:underline dotted}:where(.drive-rename-root) :is(h1,h2,h3,h4,h5,h6){font-size:inherit;font-weight:inherit}:where(.drive-rename-root) a{color:inherit;text-decoration:inherit}:where(.drive-rename-root) :is(b,strong){font-weight:bolder}:where(.drive-rename-root) :is(code,kbd,samp,pre){font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}:where(.drive-rename-root) small{font-size:80%}:where(.drive-rename-root) :is(sub,sup){font-size:75%;line-height:0;position:relative;vertical-align:baseline}:where(.drive-rename-root) sub{bottom:-.25em}:where(.drive-rename-root) sup{top:-.5em}:where(.drive-rename-root) table{text-indent:0;border-color:inherit;border-collapse:collapse}:where(.drive-rename-root) :is(button,input,optgroup,select,textarea){font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}:where(.drive-rename-root) :is(button,select){text-transform:none}:where(.drive-rename-root) :is(button,[type=button],[type=reset],[type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:where(.drive-rename-root) :-moz-focusring{outline:auto}:where(.drive-rename-root) :-moz-ui-invalid{box-shadow:none}:where(.drive-rename-root) progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}:where(.drive-rename-root) [type=search]{-webkit-appearance:textfield;outline-offset:-2px}:where(.drive-rename-root) ::-webkit-search-decoration{-webkit-appearance:none}:where(.drive-rename-root) ::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}:where(.drive-rename-root) summary{display:list-item}:where(.drive-rename-root) :is(blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre){margin:0}:where(.drive-rename-root) fieldset{margin:0;padding:0}:where(.drive-rename-root) legend{padding:0}:where(.drive-rename-root) :is(ol,ul,menu){list-style:none;margin:0;padding:0}:where(.drive-rename-root) dialog{padding:0}:where(.drive-rename-root) textarea{resize:vertical}:where(.drive-rename-root) :is(input::placeholder,textarea::placeholder){opacity:1;color:#9ca3af}:where(.drive-rename-root) :is(button,[role=button]){cursor:pointer}:where(.drive-rename-root) :disabled{cursor:default}:where(.drive-rename-root) :is(img,svg,video,canvas,audio,iframe,embed,object){display:block;vertical-align:middle}:where(.drive-rename-root) :is(img,video){max-width:100%;height:auto}:where(.drive-rename-root) [hidden]:where(:not([hidden=until-found])){display:none}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }@font-face{font-family:DM Mono;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/dmmono/v16/aFTU7PB1QTsUX8KYthSQBK6PYK3EXw.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:DM Mono;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/dmmono/v16/aFTU7PB1QTsUX8KYthqQBK6PYK0.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:DM Sans;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxRR232RmYJp8I5zzw.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:DM Sans;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxRSW32RmYJp8I5.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:"DM Serif Display";font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/dmserifdisplay/v17/-nFnOHM81r4j6k0gjAW3mujVU2B2G_5x0vrx52jJ3Q.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:"DM Serif Display";font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/dmserifdisplay/v17/-nFnOHM81r4j6k0gjAW3mujVU2B2G_Bx0vrx52g.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}.i-carbon\\:arrow-right{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m18 6l-1.43 1.393L24.15 15H4v2h20.15l-7.58 7.573L18 26l10-10z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon\\:arrows-horizontal{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M11.41 26.59L7.83 23H28v-2H7.83l3.58-3.59L10 16l-6 6l6 6zM28 10l-6-6l-1.41 1.41L24.17 9H4v2h20.17l-3.58 3.59L22 16z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon\\:batch-job{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M32 26v-2h-2.101a5 5 0 0 0-.732-1.753l1.49-1.49l-1.414-1.414l-1.49 1.49A5 5 0 0 0 26 20.101V18h-2v2.101a5 5 0 0 0-1.753.732l-1.49-1.49l-1.414 1.414l1.49 1.49A5 5 0 0 0 20.101 24H18v2h2.101c.13.637.384 1.229.732 1.753l-1.49 1.49l1.414 1.414l1.49-1.49a5 5 0 0 0 1.753.732V32h2v-2.101a5 5 0 0 0 1.753-.732l1.49 1.49l1.414-1.414l-1.49-1.49A5 5 0 0 0 29.899 26zm-7 2c-1.654 0-3-1.346-3-3s1.346-3 3-3s3 1.346 3 3s-1.346 3-3 3m-5-11h-8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2m-8-2h8V4h-8z'/%3E%3Cpath fill='currentColor' d='M17 21H8a2 2 0 0 1-2-2V7h2v12h9z'/%3E%3Cpath fill='currentColor' d='M13 25H4c-1.103 0-2-.897-2-2V11h2v12h9z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon\\:checkbox{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M6 26V6h20v20Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon\\:checkbox-checked-filled{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M14 21.5l-5-4.957L10.59 15L14 18.346L21.409 11L23 12.577Z'/%3E%3Cpath fill='none' d='m14 21.5l-5-4.957L10.59 15L14 18.346L21.409 11L23 12.577Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon\\:circle-packing{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m7.5 7a3.5 3.5 0 1 1-3.5 3.5A3.504 3.504 0 0 1 23.5 9m.435-1.978A6 6 0 0 0 23.5 7a5.48 5.48 0 0 0-4.132 1.878A8.01 8.01 0 0 0 13.8 4.211a11.86 11.86 0 0 1 10.134 2.811M16 28a4 4 0 1 1 4-4a4.005 4.005 0 0 1-4 4m-4-10a6 6 0 1 1 6-6a6.007 6.007 0 0 1-6 6m-8-2a12 12 0 0 1 .211-2.199a7.99 7.99 0 0 0 7.346 6.176a5.96 5.96 0 0 0-.89 6.757A12 12 0 0 1 4 16m17.333 10.734a5.983 5.983 0 0 0-4.179-8.62a8 8 0 0 0 1.913-2.368a5.488 5.488 0 0 0 8.917-.068c.003.108.016.214.016.322a12 12 0 0 1-6.667 10.734'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon\\:contour-finding{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cdefs/%3E%3Cpath d='M7.7 4.7a14.703 14.703 0 0 0-3 3.1L6.3 9a13.263 13.263 0 0 1 2.6-2.7z' fill='currentColor'/%3E%3Cpath d='M4.6 12.3l-1.9-.6A12.511 12.511 0 0 0 2 16h2a11.476 11.476 0 0 1 .6-3.7z' fill='currentColor'/%3E%3Cpath d='M2.7 20.4a14.403 14.403 0 0 0 2 3.9l1.6-1.2a12.887 12.887 0 0 1-1.7-3.3z' fill='currentColor'/%3E%3Cpath d='M7.8 27.3a14.403 14.403 0 0 0 3.9 2l.6-1.9A12.887 12.887 0 0 1 9 25.7z' fill='currentColor'/%3E%3Cpath d='M11.7 2.7l.6 1.9A11.476 11.476 0 0 1 16 4V2a12.511 12.511 0 0 0-4.3.7z' fill='currentColor'/%3E%3Cpath d='M24.2 27.3a15.18 15.18 0 0 0 3.1-3.1L25.7 23a11.526 11.526 0 0 1-2.7 2.7z' fill='currentColor'/%3E%3Cpath d='M27.4 19.7l1.9.6A15.475 15.475 0 0 0 30 16h-2a11.476 11.476 0 0 1-.6 3.7z' fill='currentColor'/%3E%3Cpath d='M29.2 11.6a14.403 14.403 0 0 0-2-3.9l-1.6 1.2a12.887 12.887 0 0 1 1.7 3.3z' fill='currentColor'/%3E%3Cpath d='M24.1 4.6a14.403 14.403 0 0 0-3.9-2l-.6 1.9a12.887 12.887 0 0 1 3.3 1.7z' fill='currentColor'/%3E%3Cpath d='M20.3 29.3l-.6-1.9a11.476 11.476 0 0 1-3.7.6v2a21.42 21.42 0 0 0 4.3-.7z' fill='currentColor'/%3E%3Cpath d='M16 26a10 10 0 1 1 10-10a10.011 10.011 0 0 1-10 10zm0-18a8 8 0 1 0 8 8a8.01 8.01 0 0 0-8-8z' fill='currentColor'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-carbon\\:pointer-text{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M13.71 12.29L7.41 6H13V4H4v9h2V7.41l6.29 6.3l1.42-1.42z' fill='currentColor'/%3E%3Cpath d='M28 30H12a2 2 0 0 1-2-2V18h2v10h16V12H18v-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2z' fill='currentColor'/%3E%3Cpath d='M22 15h-5v2h5v2h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h6v-8a2 2 0 0 0-2-2zm0 8h-4v-2h4z' fill='currentColor'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.i-ion\\:dice{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 512 512' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M440.88 129.37L288.16 40.62a64.14 64.14 0 0 0-64.33 0L71.12 129.37a4 4 0 0 0 0 6.9L254 243.85a4 4 0 0 0 4.06 0L440.9 136.27a4 4 0 0 0-.02-6.9M256 152c-13.25 0-24-7.16-24-16s10.75-16 24-16s24 7.16 24 16s-10.75 16-24 16m-18 118.81L54 163.48a4 4 0 0 0-6 3.46v173.92a48 48 0 0 0 23.84 41.39L234 479.48a4 4 0 0 0 6-3.46V274.27a4 4 0 0 0-2-3.46M96 368c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24m96-32c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24m266-172.49L274 271.56a4 4 0 0 0-2 3.45V476a4 4 0 0 0 6 3.46l162.15-97.23A48 48 0 0 0 464 340.86V167a4 4 0 0 0-6-3.49M320 424c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24m0-88c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24m96 32c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24m0-88c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1.2em;height:1.2em}.z-app{z-index:100000}.btn{display:inline-block;border-width:1px;border-color:currentColor;border-radius:4px;padding:4px;--un-text-opacity:1;color:rgb(61 64 238 / var(--un-text-opacity));transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.btn:hover{--un-bg-opacity:1;background-color:rgb(61 64 238 / var(--un-bg-opacity));--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity))}.btn:disabled{opacity:.5}.\\[vertical-align\\:-0\\.2em\\]{vertical-align:-.2em}.absolute{position:absolute}.fixed{position:fixed}.inset-0{top:0;right:0;bottom:0;left:0}.bottom-2{bottom:8px}.right-0{right:0}.top-2{top:8px}.z-2{z-index:2}.z-99{z-index:99}.grid{display:grid}.grid-cols-\\[20px_auto_30px_minmax\\(200px\\,1fr\\)\\]{grid-template-columns:20px auto 30px minmax(200px,1fr)}.cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.my5{margin-top:20px;margin-bottom:20px}.mb-1{margin-bottom:4px}.mb-3{margin-bottom:12px}.ml-4{margin-left:16px}.ml-auto{margin-left:auto}.mr-22px,[mr-22px=""]{margin-right:22px}.mr-3,.mr3,[mr-3=""]{margin-right:12px}.mt-2{margin-top:8px}.block{display:block}.inline-block,[inline-block=""]{display:inline-block}.contents{display:contents}.h-30px{height:30px}.h-38px{height:38px}.h-8,.h8{height:32px}.h-9,.h9{height:36px}.min-h-40px{min-height:40px}.min-h-61px{min-height:61px}.min-w-66px{min-width:66px}.w-\\[max\\(500px\\,50vw\\)\\]{width:max(500px,50vw)}.w-300px{width:300px}.w-5em,[w-5em=""]{width:5em}.w-60px{width:60px}.w-fit{width:fit-content}.w-full{width:100%}.flex{display:flex}.inline-flex{display:inline-flex}.shrink-0{flex-shrink:0}.flex-col{flex-direction:column}.transform{transform:translate(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}.cursor-pointer{cursor:pointer}.cursor-not-allowed{cursor:not-allowed}.select-none{-webkit-user-select:none;user-select:none}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.justify-self-center{justify-self:center}.gap-x-1{column-gap:4px}.gap-x-1px{column-gap:1px}.gap-x-2{column-gap:8px}.gap-x-3{column-gap:12px}.gap-x-4{column-gap:16px}.gap-y-1{row-gap:4px}.gap-y-3{row-gap:12px}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.whitespace-pre{white-space:pre}.ws-nowrap{white-space:nowrap}.b,.border,.border-1px,[border~="~"]{border-width:1px}.border-y-3px{border-top-width:3px;border-bottom-width:3px}.border-l-3px{border-left-width:3px}[border~=b]{border-bottom-width:1px}.border-\\#1874d3{--un-border-opacity:1;border-color:rgb(24 116 211 / var(--un-border-opacity))}.border-current{border-color:currentColor}.border-primary-600{--un-border-opacity:1;border-color:rgb(61 64 238 / var(--un-border-opacity))}[border~="#ddd"]{--un-border-opacity:1;border-color:rgb(221 221 221 / var(--un-border-opacity))}.rd-full,.rounded-full{border-radius:9999px}.rd-sm{border-radius:2px}.rounded{border-radius:4px}.rounded-lg{border-radius:8px}.rounded-l-lg{border-top-left-radius:8px;border-bottom-left-radius:8px}.border-solid,[border~=solid]{border-style:solid}.bg-\\#06a7ff{--un-bg-opacity:1;background-color:rgb(6 167 255 / var(--un-bg-opacity))}.bg-\\#2b89ea{--un-bg-opacity:1;background-color:rgb(43 137 234 / var(--un-bg-opacity))}.bg-\\#597dfc{--un-bg-opacity:1;background-color:rgb(89 125 252 / var(--un-bg-opacity))}.bg-primary,.bg-primary-400{--un-bg-opacity:1;background-color:rgb(112 136 255 / var(--un-bg-opacity))}.bg-primary-100{--un-bg-opacity:1;background-color:rgb(222 232 255 / var(--un-bg-opacity))}.bg-primary-600{--un-bg-opacity:1;background-color:rgb(61 64 238 / var(--un-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255 / var(--un-bg-opacity))}.bg-white\\/80{background-color:#fffc}.hover\\:bg-\\#0d53ff:hover{--un-bg-opacity:1;background-color:rgb(13 83 255 / var(--un-bg-opacity))}.hover\\:bg-\\#3181f9\\/50:hover{background-color:#3181f980}.hover\\:bg-primary-500\\/50:hover{background-color:#5b6af980}.p-3{padding:12px}.px-1{padding-left:4px;padding-right:4px}.px-2{padding-left:8px;padding-right:8px}.px-2px{padding-left:2px;padding-right:2px}.px-3{padding-left:12px;padding-right:12px}.px-4{padding-left:16px;padding-right:16px}.px5{padding-left:20px;padding-right:20px}.py-1{padding-top:4px;padding-bottom:4px}.py-2{padding-top:8px;padding-bottom:8px}.py-3{padding-top:12px;padding-bottom:12px}.py-6px{padding-top:6px;padding-bottom:6px}.py-8{padding-top:32px;padding-bottom:32px}.pb-2{padding-bottom:8px}.pb-3{padding-bottom:12px}.text-center{text-align:center}.text-right{text-align:right}.text-14px{font-size:14px}.text-16px{font-size:16px}.text-4xl{font-size:36px;line-height:40px}.text-sm{font-size:14px;line-height:20px}.text-xl{font-size:20px;line-height:28px}.text-xs,[text-xs=""]{font-size:12px;line-height:16px}.text-\\#1e754f{--un-text-opacity:1;color:rgb(30 117 79 / var(--un-text-opacity))}.text-\\#2993a3{--un-text-opacity:1;color:rgb(41 147 163 / var(--un-text-opacity))}.text-\\#3181f9{--un-text-opacity:1;color:rgb(49 129 249 / var(--un-text-opacity))}.text-\\#52565e{--un-text-opacity:1;color:rgb(82 86 94 / var(--un-text-opacity))}.text-\\#59873a{--un-text-opacity:1;color:rgb(89 135 58 / var(--un-text-opacity))}.text-\\#999{--un-text-opacity:1;color:rgb(153 153 153 / var(--un-text-opacity))}.text-\\#ab5959{--un-text-opacity:1;color:rgb(171 89 89 / var(--un-text-opacity))}.text-\\#b07d48{--un-text-opacity:1;color:rgb(176 125 72 / var(--un-text-opacity))}.text-gray{--un-text-opacity:1;color:rgb(156 163 175 / var(--un-text-opacity))}.text-gray-600{--un-text-opacity:1;color:rgb(75 85 99 / var(--un-text-opacity))}.text-green-500{--un-text-opacity:1;color:rgb(34 197 94 / var(--un-text-opacity))}.text-green-700{--un-text-opacity:1;color:rgb(21 128 61 / var(--un-text-opacity))}.text-primary{--un-text-opacity:1;color:rgb(112 136 255 / var(--un-text-opacity))}.text-primary-500{--un-text-opacity:1;color:rgb(91 106 249 / var(--un-text-opacity))}.text-primary-600{--un-text-opacity:1;color:rgb(61 64 238 / var(--un-text-opacity))}.text-primary-700{--un-text-opacity:1;color:rgb(48 47 211 / var(--un-text-opacity))}.text-red{--un-text-opacity:1;color:rgb(248 113 113 / var(--un-text-opacity))}.text-red-500{--un-text-opacity:1;color:rgb(239 68 68 / var(--un-text-opacity))}.text-red-600{--un-text-opacity:1;color:rgb(220 38 38 / var(--un-text-opacity))}.text-white{--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity))}.hover\\:text-red-600:hover{--un-text-opacity:1;color:rgb(220 38 38 / var(--un-text-opacity))}.hover\\:text-white:hover{--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity))}.font-bold{font-weight:700}.font-medium{font-weight:500}.lh-9{line-height:36px}.font-mono,[font-mono=""]{font-family:DM Mono,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.font-sans{font-family:DM Sans,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}.underline,.hover\\:underline:hover{text-decoration-line:underline}.underline-dashed,.hover\\:underline-dashed:hover{text-decoration-style:dashed}.op-80{opacity:.8}.op50,.opacity-50{opacity:.5}[hover~=op-80]:hover{opacity:.8}.shadow{--un-shadow:var(--un-shadow-inset) 0 1px 3px 0 var(--un-shadow-color, rgb(0 0 0 / .1)),var(--un-shadow-inset) 0 1px 2px -1px var(--un-shadow-color, rgb(0 0 0 / .1));box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.backdrop-blur-5{--un-backdrop-blur:blur(5px);-webkit-backdrop-filter:var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia);backdrop-filter:var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.ease{transition-timing-function:cubic-bezier(.4,0,.2,1)}.animated{--une-animated-duration:1s;animation-duration:var(--une-animated-duration);animation-fill-mode:both}@keyframes uneBackInDown{0%{transform:translateY(-1200px) scale(.7)}0%,80%{opacity:.7}80%{transform:translateY(0) scale(.7)}to{opacity:1;transform:scale(1)}}@keyframes uneBackInLeft{0%{transform:translate(-2000px) scale(.7)}0%,80%{opacity:.7}80%{transform:translate(0) scale(.7)}to{opacity:1;transform:scale(1)}}@keyframes uneBackInRight{0%{transform:translate(2000px) scale(.7)}0%,80%{opacity:.7}80%{transform:translate(0) scale(.7)}to{opacity:1;transform:scale(1)}}@keyframes uneBackInUp{0%{transform:translateY(1200px) scale(.7)}0%,80%{opacity:.7}80%{transform:translateY(0) scale(.7)}to{opacity:1;transform:scale(1)}}@keyframes uneBackOutDown{0%{opacity:1;transform:scale(1)}20%{transform:translateY(0) scale(.7)}20%,to{opacity:.7}to{transform:translateY(700px) scale(.7)}}@keyframes uneBackOutLeft{0%{opacity:1;transform:scale(1)}20%{transform:translate(0) scale(.7)}20%,to{opacity:.7}to{transform:translate(-2000px) scale(.7)}}@keyframes uneBackOutRight{0%{opacity:1;transform:scale(1)}20%{transform:translate(0) scale(.7)}20%,to{opacity:.7}to{transform:translate(2000px) scale(.7)}}@keyframes uneBackOutUp{0%{opacity:1;transform:scale(1)}20%{transform:translateY(0) scale(.7)}20%,to{opacity:.7}to{transform:translateY(-700px) scale(.7)}}@keyframes uneBounce{0%,20%,53%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1);transform:translateZ(0)}40%,43%{transform:translate3d(0,-30px,0) scaleY(1.1)}40%,43%,70%{animation-timing-function:cubic-bezier(.755,.05,.855,.06)}70%{transform:translate3d(0,-15px,0) scaleY(1.05)}80%{transform:translateZ(0) scaleY(.95);transition-timing-function:cubic-bezier(.215,.61,.355,1)}90%{transform:translate3d(0,-4px,0) scaleY(1.02)}}@keyframes uneBounceIn{0%,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:scale3d(.3,.3,.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(.9,.9,.9)}60%{opacity:1;transform:scale3d(1.03,1.03,1.03)}80%{transform:scale3d(.97,.97,.97)}to{opacity:1;transform:scaleX(1)}}@keyframes uneBounceInDown{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,-3000px,0) scaleY(3)}60%{opacity:1;transform:translate3d(0,25px,0) scaleY(.9)}75%{transform:translate3d(0,-10px,0) scaleY(.95)}90%{transform:translate3d(0,5px,0) scaleY(.985)}to{transform:translateZ(0)}}@keyframes uneBounceInLeft{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(-3000px,0,0) scaleX(3)}60%{opacity:1;transform:translate3d(25px,0,0) scaleX(1)}75%{transform:translate3d(-10px,0,0) scaleX(.98)}90%{transform:translate3d(5px,0,0) scaleX(.995)}to{transform:translateZ(0)}}@keyframes uneBounceInRight{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(3000px,0,0) scaleX(3)}60%{opacity:1;transform:translate3d(-25px,0,0) scaleX(1)}75%{transform:translate3d(10px,0,0) scaleX(.98)}90%{transform:translate3d(-5px,0,0) scaleX(.995)}to{transform:translateZ(0)}}@keyframes uneBounceInUp{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,3000px,0) scaleY(5)}60%{opacity:1;transform:translate3d(0,-20px,0) scaleY(.9)}75%{transform:translate3d(0,10px,0) scaleY(.95)}90%{transform:translate3d(0,-5px,0) scaleY(.985)}to{transform:translateZ(0)}}@keyframes uneBounceOut{20%{transform:scale3d(.9,.9,.9)}50%,55%{opacity:1;transform:scale3d(1.1,1.1,1.1)}to{opacity:0;transform:scale3d(.3,.3,.3)}}@keyframes uneBounceOutDown{20%{transform:translate3d(0,10px,0) scaleY(.985)}40%,45%{opacity:1;transform:translate3d(0,-20px,0) scaleY(.9)}to{opacity:0;transform:translate3d(0,2000px,0) scaleY(3)}}@keyframes uneBounceOutLeft{20%{opacity:1;transform:translate3d(20px,0,0) scaleX(.9)}to{opacity:0;transform:translate3d(-2000px,0,0) scaleX(2)}}@keyframes uneBounceOutRight{20%{opacity:1;transform:translate3d(-20px,0,0) scaleX(.9)}to{opacity:0;transform:translate3d(2000px,0,0) scaleX(2)}}@keyframes uneBounceOutUp{20%{transform:translate3d(0,-10px,0) scaleY(.985)}40%,45%{opacity:1;transform:translate3d(0,20px,0) scaleY(.9)}to{opacity:0;transform:translate3d(0,-2000px,0) scaleY(3)}}@keyframes uneFadeIn{0%{opacity:0}to{opacity:1}}@keyframes uneFadeInBottomLeft{0%{opacity:0;transform:translate3d(-100%,100%,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInBottomRight{0%{opacity:0;transform:translate3d(100%,100%,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInDown{0%{opacity:0;transform:translate3d(0,-100%,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInDownBig{0%{opacity:0;transform:translate3d(0,-2000px,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInLeft{0%{opacity:0;transform:translate3d(-100%,0,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInLeftBig{0%{opacity:0;transform:translate3d(-2000px,0,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInRight{0%{opacity:0;transform:translate3d(100%,0,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInRightBig{0%{opacity:0;transform:translate3d(2000px,0,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInTopLeft{0%{opacity:0;transform:translate3d(-100%,-100%,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInTopRight{0%{opacity:0;transform:translate3d(100%,-100%,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInUp{0%{opacity:0;transform:translate3d(0,100%,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeInUpBig{0%{opacity:0;transform:translate3d(0,2000px,0)}to{opacity:1;transform:translateZ(0)}}@keyframes uneFadeOut{0%{opacity:1}to{opacity:0}}@keyframes uneFadeOutBottomLeft{0%{opacity:1;transform:translateZ(0)}to{opacity:0;transform:translate3d(-100%,100%,0)}}@keyframes uneFadeOutBottomRight{0%{opacity:1;transform:translateZ(0)}to{opacity:0;transform:translate3d(100%,100%,0)}}@keyframes uneFadeOutDown{0%{opacity:1}to{opacity:0;transform:translate3d(0,100%,0)}}@keyframes uneFadeOutDownBig{0%{opacity:1}to{opacity:0;transform:translate3d(0,2000px,0)}}@keyframes uneFadeOutLeft{0%{opacity:1}to{opacity:0;transform:translate3d(-100%,0,0)}}@keyframes uneFadeOutLeftBig{0%{opacity:1}to{opacity:0;transform:translate3d(-2000px,0,0)}}@keyframes uneFadeOutRight{0%{opacity:1}to{opacity:0;transform:translate3d(100%,0,0)}}@keyframes uneFadeOutRightBig{0%{opacity:1}to{opacity:0;transform:translate3d(2000px,0,0)}}@keyframes uneFadeOutTopLeft{0%{opacity:1;transform:translateZ(0)}to{opacity:0;transform:translate3d(-100%,-100%,0)}}@keyframes uneFadeOutTopRight{0%{opacity:1;transform:translateZ(0)}to{opacity:0;transform:translate3d(100%,-100%,0)}}@keyframes uneFadeOutUp{0%{opacity:1}to{opacity:0;transform:translate3d(0,-100%,0)}}@keyframes uneFadeOutUpBig{0%{opacity:1}to{opacity:0;transform:translate3d(0,-2000px,0)}}@keyframes uneFlash{0%,50%,to{opacity:1}25%,75%{opacity:0}}@keyframes uneFlip{0%{transform:perspective(400px) scaleX(1) translateZ(0) rotateY(-1turn)}0%,40%{animation-timing-function:ease-out}40%{transform:perspective(400px) scaleX(1) translateZ(150px) rotateY(-190deg)}50%{transform:perspective(400px) scaleX(1) translateZ(150px) rotateY(-170deg)}50%,80%{animation-timing-function:ease-in}80%{transform:perspective(400px) scale3d(.95,.95,.95) translateZ(0) rotateY(0)}to{animation-timing-function:ease-in;transform:perspective(400px) scaleX(1) translateZ(0) rotateY(0)}}@keyframes uneFlipInX{0%{opacity:0;transform:perspective(400px) rotateX(90deg)}0%,40%{animation-timing-function:ease-in}40%{transform:perspective(400px) rotateX(-20deg)}60%{opacity:1;transform:perspective(400px) rotateX(10deg)}80%{transform:perspective(400px) rotateX(-5deg)}to{transform:perspective(400px)}}@keyframes uneFlipInY{0%{opacity:0;transform:perspective(400px) rotateY(90deg)}0%,40%{animation-timing-function:ease-in}40%{transform:perspective(400px) rotateY(-20deg)}60%{opacity:1;transform:perspective(400px) rotateY(10deg)}80%{transform:perspective(400px) rotateY(-5deg)}to{transform:perspective(400px)}}@keyframes uneFlipOutX{0%{transform:perspective(400px)}30%{opacity:1;transform:perspective(400px) rotateX(-20deg)}to{opacity:0;transform:perspective(400px) rotateX(90deg)}}@keyframes uneFlipOutY{0%{transform:perspective(400px)}30%{opacity:1;transform:perspective(400px) rotateY(-15deg)}to{opacity:0;transform:perspective(400px) rotateY(90deg)}}@keyframes uneHeadShake{0%{transform:translate(0)}6.5%{transform:translate(-6px) rotateY(-9deg)}18.5%{transform:translate(5px) rotateY(7deg)}31.5%{transform:translate(-3px) rotateY(-5deg)}43.5%{transform:translate(2px) rotateY(3deg)}50%{transform:translate(0)}}@keyframes uneHeartBeat{0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}}@keyframes uneHinge{0%,20%,60%{animation-timing-function:ease-in-out}20%,60%{transform:rotate(80deg)}40%,80%{animation-timing-function:ease-in-out;opacity:1;transform:rotate(60deg)}to{opacity:0;transform:translate3d(0,700px,0)}}@keyframes uneJackInTheBox{0%{opacity:0;transform:scale(.1) rotate(30deg);transform-origin:center bottom}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}to{opacity:1;transform:scale(1)}}@keyframes uneJello{0%,11.1%,to{transform:translateZ(0)}22.2%{transform:skew(-12.5deg) skewY(-12.5deg)}33.3%{transform:skew(6.25deg) skewY(6.25deg)}44.4%{transform:skew(-3.125deg) skewY(-3.125deg)}55.5%{transform:skew(1.5625deg) skewY(1.5625deg)}66.6%{transform:skew(-.78125deg) skewY(-.78125deg)}77.7%{transform:skew(.390625deg) skewY(.390625deg)}88.8%{transform:skew(-.1953125deg) skewY(-.1953125deg)}}@keyframes uneLightSpeedInLeft{0%{opacity:0;transform:translate3d(-100%,0,0) skew(30deg)}60%{opacity:1;transform:skew(-20deg)}80%{transform:skew(5deg)}to{transform:translateZ(0)}}@keyframes uneLightSpeedInRight{0%{opacity:0;transform:translate3d(100%,0,0) skew(-30deg)}60%{opacity:1;transform:skew(20deg)}80%{transform:skew(-5deg)}to{transform:translateZ(0)}}@keyframes uneLightSpeedOutLeft{0%{opacity:1}to{opacity:0;transform:translate3d(-100%,0,0) skew(-30deg)}}@keyframes uneLightSpeedOutRight{0%{opacity:1}to{opacity:0;transform:translate3d(100%,0,0) skew(30deg)}}@keyframes unePulse{0%{transform:scaleX(1)}50%{transform:scale3d(1.05,1.05,1.05)}to{transform:scaleX(1)}}@keyframes uneRollIn{0%{opacity:0;transform:translate3d(-100%,0,0) rotate(-120deg)}to{opacity:1;transform:translateZ(0)}}@keyframes uneRollOut{0%{opacity:1}to{opacity:0;transform:translate3d(100%,0,0) rotate(120deg)}}@keyframes uneRotateIn{0%{opacity:0;transform:rotate(-200deg)}to{opacity:1;transform:translateZ(0)}}@keyframes uneRotateInDownLeft{0%{opacity:0;transform:rotate(-45deg)}to{opacity:1;transform:translateZ(0)}}@keyframes uneRotateInDownRight{0%{opacity:0;transform:rotate(45deg)}to{opacity:1;transform:translateZ(0)}}@keyframes uneRotateInUpLeft{0%{opacity:0;transform:rotate(45deg)}to{opacity:1;transform:translateZ(0)}}@keyframes uneRotateInUpRight{0%{opacity:0;transform:rotate(-90deg)}to{opacity:1;transform:translateZ(0)}}@keyframes uneRotateOut{0%{opacity:1}to{opacity:0;transform:rotate(200deg)}}@keyframes uneRotateOutDownLeft{0%{opacity:1}to{opacity:0;transform:rotate(45deg)}}@keyframes uneRotateOutDownRight{0%{opacity:1}to{opacity:0;transform:rotate(-45deg)}}@keyframes uneRotateOutUpLeft{0%{opacity:1}to{opacity:0;transform:rotate(-45deg)}}@keyframes uneRotateOutUpRight{0%{opacity:1}to{opacity:0;transform:rotate(90deg)}}@keyframes uneRubberBand{0%{transform:scaleX(1)}30%{transform:scale3d(1.25,.75,1)}40%{transform:scale3d(.75,1.25,1)}50%{transform:scale3d(1.15,.85,1)}65%{transform:scale3d(.95,1.05,1)}75%{transform:scale3d(1.05,.95,1)}to{transform:scaleX(1)}}@keyframes uneShake{0%,to{transform:translateZ(0)}10%,30%,50%,70%,90%{transform:translate3d(-10px,0,0)}20%,40%,60%,80%{transform:translate3d(10px,0,0)}}@keyframes uneShakeX{0%,to{transform:translateZ(0)}10%,30%,50%,70%,90%{transform:translate3d(-10px,0,0)}20%,40%,60%,80%{transform:translate3d(10px,0,0)}}@keyframes uneShakeY{0%,to{transform:translateZ(0)}10%,30%,50%,70%,90%{transform:translate3d(0,-10px,0)}20%,40%,60%,80%{transform:translate3d(0,10px,0)}}@keyframes uneSlideInDown{0%{transform:translate3d(0,-100%,0);visibility:visible}to{transform:translateZ(0)}}@keyframes uneSlideInLeft{0%{transform:translate3d(-100%,0,0);visibility:visible}to{transform:translateZ(0)}}@keyframes uneSlideInRight{0%{transform:translate3d(100%,0,0);visibility:visible}to{transform:translateZ(0)}}@keyframes uneSlideInUp{0%{transform:translate3d(0,100%,0);visibility:visible}to{transform:translateZ(0)}}@keyframes uneSlideOutDown{0%{transform:translateZ(0)}to{transform:translate3d(0,100%,0);visibility:hidden}}@keyframes uneSlideOutLeft{0%{transform:translateZ(0)}to{transform:translate3d(-100%,0,0);visibility:hidden}}@keyframes uneSlideOutRight{0%{transform:translateZ(0)}to{transform:translate3d(100%,0,0);visibility:hidden}}@keyframes uneSlideOutUp{0%{transform:translateZ(0)}to{transform:translate3d(0,-100%,0);visibility:hidden}}@keyframes uneSwing{20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}to{transform:rotate(0)}}@keyframes uneTada{0%{transform:scaleX(1)}10%,20%{transform:scale3d(.9,.9,.9) rotate(-3deg)}30%,50%,70%,90%{transform:scale3d(1.1,1.1,1.1) rotate(3deg)}40%,60%,80%{transform:scale3d(1.1,1.1,1.1) rotate(-3deg)}to{transform:scaleX(1)}}@keyframes uneWobble{0%{transform:translateZ(0)}15%{transform:translate3d(-25%,0,0) rotate(-5deg)}30%{transform:translate3d(20%,0,0) rotate(3deg)}45%{transform:translate3d(-15%,0,0) rotate(-3deg)}60%{transform:translate3d(10%,0,0) rotate(2deg)}75%{transform:translate3d(-5%,0,0) rotate(-1deg)}to{transform:translateZ(0)}}@keyframes uneZoomIn{0%{opacity:0;transform:scale3d(.3,.3,.3)}50%{opacity:1}}@keyframes uneZoomInDown{0%{animation-timing-function:cubic-bezier(.55,.055,.675,.19);opacity:0;transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0)}60%{animation-timing-function:cubic-bezier(.175,.885,.32,1);opacity:1;transform:scale3d(.475,.475,.475) translate3d(0,60px,0)}}@keyframes uneZoomInLeft{0%{animation-timing-function:cubic-bezier(.55,.055,.675,.19);opacity:0;transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0)}60%{animation-timing-function:cubic-bezier(.175,.885,.32,1);opacity:1;transform:scale3d(.475,.475,.475) translate3d(10px,0,0)}}@keyframes uneZoomInRight{0%{animation-timing-function:cubic-bezier(.55,.055,.675,.19);opacity:0;transform:scale3d(.1,.1,.1) translate3d(1000px,0,0)}60%{animation-timing-function:cubic-bezier(.175,.885,.32,1);opacity:1;transform:scale3d(.475,.475,.475) translate3d(-10px,0,0)}}@keyframes uneZoomInUp{0%{animation-timing-function:cubic-bezier(.55,.055,.675,.19);opacity:0;transform:scale3d(.1,.1,.1) translate3d(0,1000px,0)}60%{animation-timing-function:cubic-bezier(.175,.885,.32,1);opacity:1;transform:scale3d(.475,.475,.475) translate3d(0,-60px,0)}}@keyframes uneZoomOut{0%{opacity:1}50%{transform:scale3d(.3,.3,.3)}50%,to{opacity:0}}@keyframes uneZoomOutDown{40%{animation-timing-function:cubic-bezier(.55,.055,.675,.19);opacity:1;transform:scale3d(.475,.475,.475) translate3d(0,-60px,0)}to{animation-timing-function:cubic-bezier(.175,.885,.32,1);opacity:0;transform:scale3d(.1,.1,.1) translate3d(0,2000px,0)}}@keyframes uneZoomOutLeft{40%{opacity:1;transform:scale3d(.475,.475,.475) translate3d(42px,0,0)}to{opacity:0;transform:scale(.1) translate3d(-2000px,0,0)}}@keyframes uneZoomOutRight{40%{opacity:1;transform:scale3d(.475,.475,.475) translate3d(-42px,0,0)}to{opacity:0;transform:scale(.1) translate3d(2000px,0,0)}}@keyframes uneZoomOutUp{40%{animation-timing-function:cubic-bezier(.55,.055,.675,.19);opacity:1;transform:scale3d(.475,.475,.475) translate3d(0,60px,0)}to{animation-timing-function:cubic-bezier(.175,.885,.32,1);opacity:0;transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0)}}.animated-back-in-down{animation-name:uneBackInDown}.animated-back-in-left{animation-name:uneBackInLeft}.animated-back-in-right{animation-name:uneBackInRight}.animated-back-in-up{animation-name:uneBackInUp}.animated-back-out-down{animation-name:uneBackOutDown}.animated-back-out-left{animation-name:uneBackOutLeft}.animated-back-out-right{animation-name:uneBackOutRight}.animated-back-out-up{animation-name:uneBackOutUp}.animated-bounce{animation-name:uneBounce;transform-origin:center bottom}.animated-bounce-in{animation-duration:calc(var(--une-animated-duration) * .75);animation-name:uneBounceIn}.animated-bounce-in-down{animation-name:uneBounceInDown}.animated-bounce-in-left{animation-name:uneBounceInLeft}.animated-bounce-in-right{animation-name:uneBounceInRight}.animated-bounce-in-up{animation-name:uneBounceInUp}.animated-bounce-out{animation-duration:calc(var(--une-animated-duration) * .75);animation-name:uneBounceOut}.animated-bounce-out-down{animation-name:uneBounceOutDown}.animated-bounce-out-left{animation-name:uneBounceOutLeft}.animated-bounce-out-right{animation-name:uneBounceOutRight}.animated-bounce-out-up{animation-name:uneBounceOutUp}.animated-fade-in{animation-name:uneFadeIn}.animated-fade-in-bottom-left{animation-name:uneFadeInBottomLeft}.animated-fade-in-bottom-right{animation-name:uneFadeInBottomRight}.animated-fade-in-down{animation-name:uneFadeInDown}.animated-fade-in-down-big{animation-name:uneFadeInDownBig}.animated-fade-in-left{animation-name:uneFadeInLeft}.animated-fade-in-left-big{animation-name:uneFadeInLeftBig}.animated-fade-in-right{animation-name:uneFadeInRight}.animated-fade-in-right-big{animation-name:uneFadeInRightBig}.animated-fade-in-top-left{animation-name:uneFadeInTopLeft}.animated-fade-in-top-right{animation-name:uneFadeInTopRight}.animated-fade-in-up{animation-name:uneFadeInUp}.animated-fade-in-up-big{animation-name:uneFadeInUpBig}.animated-fade-out{animation-name:uneFadeOut}.animated-fade-out-bottom-left{animation-name:uneFadeOutBottomLeft}.animated-fade-out-bottom-right{animation-name:uneFadeOutBottomRight}.animated-fade-out-down{animation-name:uneFadeOutDown}.animated-fade-out-down-big{animation-name:uneFadeOutDownBig}.animated-fade-out-left{animation-name:uneFadeOutLeft}.animated-fade-out-left-big{animation-name:uneFadeOutLeftBig}.animated-fade-out-right{animation-name:uneFadeOutRight}.animated-fade-out-right-big{animation-name:uneFadeOutRightBig}.animated-fade-out-top-left{animation-name:uneFadeOutTopLeft}.animated-fade-out-top-right{animation-name:uneFadeOutTopRight}.animated-fade-out-up{animation-name:uneFadeOutUp}.animated-fade-out-up-big{animation-name:uneFadeOutUpBig}.animated-flash{animation-name:uneFlash}.animated-flip{backface-visibility:visible;animation-name:uneFlip}.animated-flip-in-x{backface-visibility:visible!important;animation-name:uneFlipInX}.animated-flip-in-y{backface-visibility:visible!important;animation-name:uneFlipInY}.animated-flip-out-x{animation-duration:calc(var(--une-animated-duration) * .75);animation-name:uneFlipOutX;backface-visibility:visible!important}.animated-flip-out-y{animation-duration:calc(var(--une-animated-duration) * .75);backface-visibility:visible!important;animation-name:uneFlipOutY}.animated-head-shake{animation-timing-function:ease-in-out;animation-name:uneHeadShake}.animated-heart-beat{animation-name:uneHeartBeat;animation-duration:calc(var(--une-animated-duration) * 1.3);animation-timing-function:ease-in-out}.animated-hinge{animation-duration:calc(var(--une-animated-duration) * 2);animation-name:uneHinge;transform-origin:top left}.animated-jack-in-the-box{animation-name:uneJackInTheBox}.animated-jello{animation-name:uneJello;transform-origin:center}.animated-light-speed-in-left{animation-name:uneLightSpeedInLeft;animation-timing-function:ease-out}.animated-light-speed-in-right{animation-name:uneLightSpeedInRight;animation-timing-function:ease-out}.animated-light-speed-out-left{animation-name:uneLightSpeedOutLeft;animation-timing-function:ease-in}.animated-light-speed-out-right{animation-name:uneLightSpeedOutRight;animation-timing-function:ease-in}.animated-pulse{animation-name:unePulse;animation-timing-function:ease-in-out}.animated-roll-in{animation-name:uneRollIn}.animated-roll-out{animation-name:uneRollOut}.animated-rotate-in{animation-name:uneRotateIn;transform-origin:center}.animated-rotate-in-down-left{animation-name:uneRotateInDownLeft;transform-origin:left bottom}.animated-rotate-in-down-right{animation-name:uneRotateInDownRight;transform-origin:right bottom}.animated-rotate-in-up-left{animation-name:uneRotateInUpLeft;transform-origin:left bottom}.animated-rotate-in-up-right{animation-name:uneRotateInUpRight;transform-origin:right bottom}.animated-rotate-out{animation-name:uneRotateOut;transform-origin:center}.animated-rotate-out-down-left{animation-name:uneRotateOutDownLeft;transform-origin:left bottom}.animated-rotate-out-down-right{animation-name:uneRotateOutDownRight;transform-origin:right bottom}.animated-rotate-out-up-left{animation-name:uneRotateOutUpLeft;transform-origin:left bottom}.animated-rotate-out-up-right{animation-name:uneRotateOutUpRight;transform-origin:right bottom}.animated-rubber-band{animation-name:uneRubberBand}.animated-shake{animation-name:uneShake}.animated-shake-x{animation-name:uneShakeX}.animated-shake-y{animation-name:uneShakeY}.animated-slide-in-down{animation-name:uneSlideInDown}.animated-slide-in-left{animation-name:uneSlideInLeft}.animated-slide-in-right{animation-name:uneSlideInRight}.animated-slide-in-up{animation-name:uneSlideInUp}.animated-slide-out-down{animation-name:uneSlideOutDown}.animated-slide-out-left{animation-name:uneSlideOutLeft}.animated-slide-out-right{animation-name:uneSlideOutRight}.animated-slide-out-up{animation-name:uneSlideOutUp}.animated-swing{transform-origin:top center;animation-name:uneSwing}.animated-tada{animation-name:uneTada}.animated-wobble{animation-name:uneWobble}.animated-zoom-in{animation-name:uneZoomIn}.animated-zoom-in-down{animation-name:uneZoomInDown}.animated-zoom-in-left{animation-name:uneZoomInLeft}.animated-zoom-in-right{animation-name:uneZoomInRight}.animated-zoom-in-up{animation-name:uneZoomInUp}.animated-zoom-out{animation-name:uneZoomOut}.animated-zoom-out-down{animation-name:uneZoomOutDown;transform-origin:center bottom}.animated-zoom-out-left{animation-name:uneZoomOutLeft;transform-origin:left center}.animated-zoom-out-right{animation-name:uneZoomOutRight;transform-origin:right center}.animated-zoom-out-up{animation-name:uneZoomOutUp;transform-origin:center bottom}.animated-duration-1s{animation-duration:1s}.animated-duration-800{animation-duration:.8s} `);

(function (vue, dayjs, jsMd5) {
  'use strict';

  var isVue2 = false;
  /*!
   * pinia v2.3.0
   * (c) 2024 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = vue.markRaw({
      install(app) {
        setActivePinia(pinia);
        {
          pinia._a = app;
          app.provide(piniaSymbol, pinia);
          app.config.globalProperties.$pinia = pinia;
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia;
  }
  const noop$1 = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  const ACTION_MARKER = Symbol();
  const ACTION_NAME = Symbol();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    } else if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && true) {
        {
          pinia.state.value[id] = state ? state() : {};
        }
      }
      const localState = vue.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name2) => {
        computedGetters[name2] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name2].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    const $subscribeOptions = { deep: true };
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      {
        pinia.state.value[$id] = {};
      }
    }
    vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      noop$1
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    const action = (fn, name2 = "") => {
      if (ACTION_MARKER in fn) {
        fn[ACTION_NAME] = name2;
        return fn;
      }
      const wrappedAction = function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name: wrappedAction[ACTION_NAME],
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = fn.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
      wrappedAction[ACTION_MARKER] = true;
      wrappedAction[ACTION_NAME] = name2;
      return wrappedAction;
    };
    const partialStore = {
      _p: pinia,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(partialStore);
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = vue.effectScope()).run(() => setup({ action }))));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia.state.value[$id][key] = prop;
          }
        }
      } else if (typeof prop === "function") {
        const actionValue = action(prop, key);
        {
          setupStore[key] = actionValue;
        }
        optionsForPlugin.actions[key] = prop;
      } else ;
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => pinia.state.value[$id],
      set: (state) => {
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    pinia._p.forEach((extender) => {
      {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    }
    function useStore(pinia, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
      }
      const store = pinia._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "AppCheckbox",
    props: /* @__PURE__ */ vue.mergeModels({
      disabled: { type: Boolean, default: false }
    }, {
      "modelValue": { type: Boolean, ...{ required: true } },
      "modelModifiers": {}
    }),
    emits: ["update:modelValue"],
    setup(__props) {
      const checked = vue.useModel(__props, "modelValue");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("span", {
          class: vue.normalizeClass([[
            checked.value ? "i-carbon:checkbox-checked-filled" : "i-carbon:checkbox",
            _ctx.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          ], "text-sm text-primary-600"]),
          onClick: _cache[0] || (_cache[0] = ($event) => !_ctx.disabled && (checked.value = !checked.value))
        }, null, 2);
      };
    }
  });
  const _hoisted_1$7 = { class: "contents" };
  const _hoisted_2$2 = ["title"];
  const _hoisted_3$2 = {
    key: 0,
    class: "i-carbon:arrow-right justify-self-center text-primary-600"
  };
  const _hoisted_4$2 = {
    key: 1,
    class: "i-carbon:arrows-horizontal justify-self-center text-green-500"
  };
  const _hoisted_5$2 = ["title"];
  const _hoisted_6$2 = { key: 0 };
  const _hoisted_7$2 = { key: 1 };
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "PreviewEntry",
    props: /* @__PURE__ */ vue.mergeModels({
      oldName: {},
      id: {},
      newName: {},
      done: { type: Boolean },
      error: { type: Boolean },
      conflict: { type: Boolean }
    }, {
      "modelValue": { type: Boolean, ...{ required: true } },
      "modelModifiers": {}
    }),
    emits: /* @__PURE__ */ vue.mergeModels(["pick"], ["update:modelValue"]),
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const isSame = vue.toRef(() => props.oldName === props.newName);
      const disabled = vue.toRef(() => isSame.value || !props.newName);
      const checked = vue.useModel(__props, "modelValue");
      return (_ctx, _cache) => {
        const _component_AppCheckbox = _sfc_main$a;
        return vue.openBlock(), vue.createElementBlock("li", _hoisted_1$7, [
          vue.createVNode(_component_AppCheckbox, {
            "model-value": Boolean(checked.value && _ctx.newName && !vue.unref(isSame)),
            disabled: vue.unref(disabled),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => checked.value = $event)
          }, null, 8, ["model-value", "disabled"]),
          vue.createElementVNode("span", {
            title: _ctx.oldName,
            class: "truncate whitespace-pre"
          }, [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(vue.unref(disabled) ? "opacity-50" : "")
            }, vue.toDisplayString(_ctx.oldName), 3),
            vue.createElementVNode("i", {
              class: "i-carbon:pointer-text [vertical-align:-0.2em] inline-block cursor-pointer text-xs text-green-700",
              title: "填充到剧名",
              onClick: _cache[1] || (_cache[1] = ($event) => emit("pick", _ctx.id))
            })
          ], 8, _hoisted_2$2),
          !vue.unref(isSame) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3$2)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_4$2)),
          vue.createElementVNode("span", {
            class: vue.normalizeClass([[vue.unref(disabled) ? "opacity-50" : "", _ctx.conflict ? "text-red-500 font-bold" : ""], "truncate whitespace-pre"]),
            title: _ctx.newName
          }, [
            vue.createTextVNode(vue.toDisplayString(_ctx.newName) + " ", 1),
            _ctx.error ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6$2, "❌")) : _ctx.done ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7$2, "✅")) : vue.createCommentVNode("", true)
          ], 10, _hoisted_5$2)
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$8 = {};
  const _hoisted_1$6 = {
    class: "inline-block h-38px flex items-center justify-center gap-x-1 ws-nowrap rd-full bg-#597dfc px-4 py-2 text-white transition",
    "mr-22px": "",
    hover: "op-80"
  };
  function _sfc_render$4(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("button", _hoisted_1$6, _cache[0] || (_cache[0] = [
      vue.createElementVNode("i", { class: "i-carbon:batch-job text-16px" }, null, -1),
      vue.createElementVNode("span", { class: "text-14px font-medium" }, "重命名", -1)
    ]));
  }
  const ButtonComponent$4 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$4]]);
  function random(n) {
    return Math.floor(Math.random() * n);
  }
  function getExtFromName(fileName) {
    const i = fileName.lastIndexOf(".");
    return i > -1 ? fileName.slice(i + 1) : "";
  }
  function getParentId$2() {
    const u = new URLSearchParams(location.search);
    const path = u.get("homeFilePath") || "0";
    const groups = path.split(",");
    const lastGroup = groups[groups.length - 1];
    return lastGroup;
  }
  async function getFileListOfCurrentDir$6(parentId = getParentId$2()) {
    const listApi = new URL("https://www.123pan.com/b/api/file/list/new?driveId=0&limit=100&next=0&orderBy=file_name&orderDirection=asc&trashed=false&SearchData=&OnlyLookAbnormalFile=0&event=homeListFile&operateType=4&inDirectSpace=false");
    listApi.searchParams.set("parentFileId", parentId);
    const result = [];
    let page = 1;
    let next = true;
    while (next) {
      listApi.searchParams.set("Page", String(page++));
      const { data: { InfoList, Next, Total, Len } } = await get$3(listApi);
      result.push(...InfoList.map((x) => ({
        drive_id: "whocare",
        file_id: x.FileId,
        name: x.FileName,
        parent_file_id: x.ParentFileId,
        file_extension: getExtFromName(x.FileName),
        mime_type: "whocare",
        type: x.type === 1 ? "folder" : "file"
      })));
      next = Next !== "-1" && Total !== 0 && Len !== 0;
    }
    return result;
  }
  const headers$3 = {};
  function setRequestHeader$6(key, value) {
    if (key.toLowerCase() === "authorization")
      headers$3.authorization = value;
  }
  function post$5(api, payload) {
    return fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers$3
      },
      credentials: "include",
      body: JSON.stringify(payload)
    }).then((res) => {
      if (res.ok)
        return res.json();
      else
        return Promise.reject(new Error("network error"));
    });
  }
  function get$3(api) {
    return fetch(api, {
      method: "GET",
      headers: {
        ...headers$3
      },
      credentials: "include"
    }).then((res) => {
      if (res.ok)
        return res.json();
      else
        return Promise.reject(new Error("network error"));
    });
  }
  async function renameOne$6(resource, newName) {
    return post$5("https://www.123pan.com/b/api/file/rename", {
      driveId: 0,
      fileId: resource.file_id,
      fileName: newName,
      duplicate: 1,
      event: "fileRename",
      operatePlace: 2,
      RequestSource: null
    });
  }
  function shouldShowEntry$6(url) {
    return new URL(url).pathname === "/";
  }
  function getContainer$6() {
    return {
      el: document.querySelector("#app .homeClass > div:nth-child(1)"),
      style: "",
      front: true
    };
  }
  const provider$5 = {
    DRIVE_NAME: "123云盘",
    HOSTS: ["www.123pan.com"],
    getApiDelay(size) {
      if (size > 100) {
        return 3e3;
      } else {
        return 200;
      }
    },
    ButtonComponent: ButtonComponent$4,
    shouldShowEntry: shouldShowEntry$6,
    getContainer: getContainer$6,
    renameOne: renameOne$6,
    setRequestHeader: setRequestHeader$6,
    getFileListOfCurrentDir: getFileListOfCurrentDir$6
  };
  const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: provider$5
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$7 = {};
  const _hoisted_1$5 = { class: "mt-2 min-h-61px w-60px flex flex-col items-center justify-center gap-y-1 rounded-lg px-2px py-6px text-primary-500 transition hover:bg-primary-500/50 hover:text-white" };
  function _sfc_render$3(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("button", _hoisted_1$5, _cache[0] || (_cache[0] = [
      vue.createElementVNode("i", { class: "i-carbon:batch-job text-xl" }, null, -1),
      vue.createElementVNode("span", { class: "text-xs font-medium" }, "重命名", -1)
    ]));
  }
  const ButtonComponent$3 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$3]]);
  function getToken$1() {
    const raw = window.localStorage.getItem("token");
    if (!raw)
      throw new Error("no token found");
    return JSON.parse(raw).access_token;
  }
  async function getDriveId() {
    const res = await post$4("https://user.aliyundrive.com/v2/user/get", {});
    return location.pathname.startsWith("/drive/file/all/backup") ? res.backup_drive_id : res.resource_drive_id;
  }
  const INITIAL_MARKER = "INITIAL";
  const PAGE_SIZE = 100;
  const listJsonMask = "next_marker,items(name,file_id,drive_id,type,file_extension,parent_file_id,mime_type,trashed,sync_device_flag,punish_flag)";
  async function getFileListOfCurrentDir$5(parentId = getParentId$1()) {
    const listApi = new URL("https://api.aliyundrive.com/adrive/v3/file/list");
    listApi.searchParams.append("jsonmask", listJsonMask);
    const driveId = await getDriveId();
    const result = [];
    let marker = INITIAL_MARKER;
    while (marker) {
      const { items, next_marker } = await post$4(listApi.toString().replace("%28", "(").replace("%29", ")"), {
        all: true,
        limit: PAGE_SIZE,
        drive_id: driveId,
        fields: "*",
        order_by: "name",
        order_direction: "ASC",
        parent_file_id: parentId,
        url_expire_sec: 14400,
        marker: marker === INITIAL_MARKER ? "" : marker
      });
      result.push(...items);
      marker = next_marker;
    }
    return result.filter((x) => !x.sync_device_flag);
  }
  async function rename$2(driveId, fileId, newName) {
    return post$4("https://api.aliyundrive.com/v3/file/update", {
      check_name_mode: "refuse",
      drive_id: driveId,
      file_id: fileId,
      name: newName
    });
  }
  function getParentId$1() {
    const p = location.pathname;
    const i = p.lastIndexOf("/");
    const lastSegment = p.slice(i + 1);
    return /[a-z0-9]{32,}/.test(lastSegment) ? lastSegment : "root";
  }
  const headers$2 = {};
  function setRequestHeader$5(key, value) {
    if (key.toLowerCase() === "x-signature")
      headers$2["X-Signature"] = value;
  }
  function post$4(api, payload) {
    var _a;
    return fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken$1()}`,
        "X-Device-Id": ((_a = document.cookie.match(/cna=(.+?);/)) == null ? void 0 : _a[1]) || "",
        ...headers$2
      },
      body: JSON.stringify(payload)
    }).then((res) => {
      if (res.ok)
        return res.json();
      else
        return Promise.reject(new Error("network error"));
    });
  }
  async function renameOne$5(resource, newName) {
    await rename$2(resource.drive_id, resource.file_id, newName);
  }
  function shouldShowEntry$5(url) {
    return [
      /^\/drive\/file\/all\/.+$/
    ].some((re) => re.test(new URL(url).pathname));
  }
  function getContainer$5() {
    return {
      el: document.querySelector('[class^="nav-tab-content--"]'),
      style: "",
      front: false
    };
  }
  const provider$4 = {
    DRIVE_NAME: "阿里云盘",
    HOSTS: ["www.aliyundrive.com", "www.alipan.com"],
    ButtonComponent: ButtonComponent$3,
    shouldShowEntry: shouldShowEntry$5,
    getContainer: getContainer$5,
    renameOne: renameOne$5,
    setRequestHeader: setRequestHeader$5,
    getFileListOfCurrentDir: getFileListOfCurrentDir$5
  };
  const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: provider$4
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$6 = {};
  const _hoisted_1$4 = { class: "mr3 inline-block h8 flex items-center justify-center gap-x-1 ws-nowrap rd-full bg-#06a7ff px-4 py-2 text-white transition" };
  function _sfc_render$2(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("button", _hoisted_1$4, _cache[0] || (_cache[0] = [
      vue.createElementVNode("i", { class: "i-carbon:batch-job shrink-0 text-sm" }, null, -1),
      vue.createElementVNode("span", { class: "text-sm font-bold" }, "重命名", -1)
    ]));
  }
  const ButtonComponent$2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$2]]);
  let bdstoken = "";
  function getDir$1() {
    const u = getURL(location.href);
    return u.searchParams.get("path") || "/";
  }
  async function getFileListOfCurrentDir$4(parentId = getDir$1()) {
    if (!bdstoken)
      initToken();
    const listApi = new URL("https://pan.baidu.com/api/list?clienttype=0&app_id=250528&web=1&order=name&desc=0&num=100");
    listApi.searchParams.set("dir", parentId);
    const result = [];
    let page = 1;
    let next = true;
    while (next) {
      listApi.searchParams.set("page", String(page++));
      const { list } = await get$2(listApi);
      result.push(...list.map((x) => ({
        drive_id: "whocare",
        file_id: String(x.fs_id),
        name: x.server_filename,
        parent_file_id: x.path,
        file_extension: getExtFromName(x.server_filename),
        mime_type: "whocare",
        type: x.isdir === 1 ? "folder" : "file"
      })));
      next = list.length === 100;
    }
    return result;
  }
  function setRequestHeader$4() {
  }
  function post$3(api, payload) {
    return fetch(api, {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest"
      },
      credentials: "include",
      body: new URLSearchParams(payload).toString()
    }).then((res) => {
      if (res.ok)
        return res.json();
      else
        return Promise.reject(new Error("network error"));
    });
  }
  function get$2(api) {
    return fetch(api, {
      method: "GET",
      credentials: "include"
    }).then((res) => {
      if (res.ok)
        return res.json();
      else
        return Promise.reject(new Error("network error"));
    });
  }
  function createControledPromise() {
    let _resolve;
    const promise = new Promise((resolve) => {
      _resolve = resolve;
    });
    return {
      promise,
      done: () => {
        _resolve();
      }
    };
  }
  let cache = [];
  let timer;
  const BATCH_SIZE = 10;
  async function renameOne$4(resource, newName) {
    const { promise, done } = createControledPromise();
    cache.push({
      id: resource.file_id,
      path: resource.parent_file_id,
      newName,
      done
    });
    if (timer) {
      window.clearTimeout(timer);
      timer = void 0;
    }
    if (cache.length >= BATCH_SIZE) {
      triggerRename(cache);
      cache = [];
    } else {
      timer = window.setTimeout(() => {
        triggerRename(cache);
        cache = [];
      }, 100);
    }
    return promise;
  }
  async function triggerRename(list) {
    if (list.length === 0)
      return;
    await post$3(`https://pan.baidu.com/api/filemanager?async=2&onnest=fail&opera=rename&bdstoken=${bdstoken}&clienttype=0&app_id=250528&web=1`, {
      filelist: JSON.stringify(list.map((x) => ({
        id: +x.id,
        path: x.path,
        newname: x.newName
      })))
    });
    list.forEach((x) => x.done());
  }
  async function initToken() {
    const { result } = await get$2("https://pan.baidu.com/api/gettemplatevariable?clienttype=0&app_id=250528&web=1&fields=[%22bdstoken%22]");
    bdstoken = result.bdstoken;
  }
  function getURL(url) {
    const old = new URL(url);
    const hash = old.hash;
    return new URL(old.origin + hash.replace(/^#/, ""));
  }
  function shouldShowEntry$4(url) {
    const fresh = getURL(url);
    return fresh.pathname === "/index" && fresh.searchParams.get("category") === "all";
  }
  function getContainer$4() {
    return {
      el: document.querySelector(".wp-s-agile-tool-bar__header.is-header-tool"),
      style: "",
      front: true
    };
  }
  const provider$3 = {
    DRIVE_NAME: "百度网盘",
    HOSTS: ["pan.baidu.com/disk"],
    MAX_CONCURRENT: Infinity,
    shouldShowEntry: shouldShowEntry$4,
    getContainer: getContainer$4,
    getApiDelay: () => 0,
    getReloadingDelay: () => 4e3,
    renameOne: renameOne$4,
    setRequestHeader: setRequestHeader$4,
    ButtonComponent: ButtonComponent$2,
    getFileListOfCurrentDir: getFileListOfCurrentDir$4
  };
  const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: provider$3
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "ButtonCmcc",
    setup(__props) {
      const button = vue.ref();
      vue.onMounted(() => {
        const el = button.value.parentElement;
        el.style.cssText = `float: left; margin-right: 24px;`;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("button", {
          ref_key: "button",
          ref: button,
          class: "my5 h9 flex items-center justify-center gap-x-2 border border-current rd-sm border-solid px5 text-#3181f9 lh-9 transition hover:bg-#3181f9/50 hover:text-white"
        }, _cache[0] || (_cache[0] = [
          vue.createElementVNode("i", { class: "i-carbon:batch-job text-sm" }, null, -1),
          vue.createElementVNode("span", { class: "text-xs font-medium" }, "重命名", -1)
        ]), 512);
      };
    }
  });
  async function getFileListOfCurrentDir$3() {
    const result = [];
    let cursor = { type: "initial", value: null };
    while (cursor.type === "initial" || cursor.value) {
      const { data: { items, nextPageCursor } } = await post$2("https://personal-kd-njs.yun.139.com/hcy/file/list", {
        pageInfo: { pageSize: 100, pageCursor: cursor.value },
        orderBy: "updated_at",
        orderDirection: "DESC",
        parentFileId: localStorage.getItem("currentCatalogID"),
        imageThumbnailStyleList: ["Small", "Large"]
      }, {
        commonAccountInfo: {
          account: atob(getToken("ORCHES-I-ACCOUNT-ENCRYPT")),
          accountType: 1
        },
        catalogID: localStorage.getItem("currentCatalogID"),
        catalogSortType: 0,
        contentSortType: 0,
        endNumber: 100,
        filterType: 0,
        sortDirection: 1,
        startNumber: cursor.type === "initial" ? 1 : cursor.value
      });
      cursor = { type: "normal", value: nextPageCursor };
      result.push(...items.map((x) => ({
        drive_id: "whocare",
        file_id: x.fileId,
        name: x.name,
        parent_file_id: x.parentFileId,
        file_extension: x.fileExtension,
        mime_type: "whocare",
        type: x.type
      })));
    }
    return result;
  }
  async function rename$1(driveId, fileId, newName) {
    return post$2("https://personal-kd-njs.yun.139.com/hcy/file/update", {
      fileId,
      name: newName,
      description: ""
    }, {
      commonAccountInfo: {
        account: atob(getToken("ORCHES-I-ACCOUNT-ENCRYPT")),
        accountType: 1
      },
      contentID: fileId,
      contentName: newName
    });
  }
  const headers$1 = {};
  function setRequestHeader$3(key, value) {
    const l = [
      "caller",
      "Cms-Device",
      "Mcloud-Channel",
      "Mcloud-Client",
      "Mcloud-Route",
      "Mcloud-version",
      "X-Deviceinfo",
      "x-huawei-channelSrc",
      "x-m4c-src",
      "x-inner-ntwk",
      "x-m4c-caller",
      "x-inner-ntwk",
      "INNER-HCY-ROUTER-HTTPS",
      "hcy-cool-flag",
      "X-Svctype",
      "x-yun-Api-Version",
      "x-yun-channel-source",
      "x-yun-app-channel",
      "x-yun-client-info",
      "x-yun-module-type",
      "x-yun-svc-type"
    ];
    if (l.some((x) => x.toLowerCase() === key.toLowerCase()))
      headers$1[key] = value;
  }
  function getToken(key) {
    var _a;
    return ((_a = document.cookie.split("; ").map((x) => x.split("=", 2)).find((x) => x[0] === key)) == null ? void 0 : _a[1]) || "";
  }
  function createMD5(s) {
    const hash = jsMd5.md5.create();
    hash.update(s);
    return hash.hex();
  }
  function getNewSign(e, t, a, n) {
    let r = "";
    if (t) {
      let s = Object.assign({}, t);
      r = JSON.stringify(s);
      r = encodeURIComponent(r);
      s = r;
      const c = r.split("");
      const l = c.sort();
      r = l.join("");
    }
    const d = createMD5(window.btoa(r));
    const f = createMD5(`${a}:${n}`);
    return createMD5(d + f).toUpperCase();
  }
  function getSign(params) {
    const { time, random: random2, signPayload } = params;
    return getNewSign(void 0, signPayload, time, random2);
  }
  function post$2(api, payload, signPayload) {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const random2 = "FO6ezlJ9BkwfHVZd";
    return fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": getToken("authorization"),
        "Mcloud-Sign": `${time},${random2},${getSign({ time, random: random2, signPayload })}`,
        ...headers$1
      },
      credentials: "include",
      body: JSON.stringify(payload)
    }).then((res) => {
      if (res.ok)
        return res.json();
      else
        return Promise.reject(new Error("network error"));
    });
  }
  async function renameOne$3(resource, newName) {
    await rename$1(resource.drive_id, resource.file_id, newName);
  }
  function shouldShowEntry$3(url) {
    return ["/w/#/main", "/w/#/main", "/w/#/index"].some((x) => url.includes(x));
  }
  function getContainer$3() {
    return {
      el: document.querySelector(".top_button"),
      style: "",
      front: true
    };
  }
  const provider$2 = {
    DRIVE_NAME: "移动云盘",
    HOSTS: ["yun.139.com"],
    FETCH_MODE: "manual-trigger",
    ButtonComponent: _sfc_main$5,
    shouldShowEntry: shouldShowEntry$3,
    getContainer: getContainer$3,
    renameOne: renameOne$3,
    setRequestHeader: setRequestHeader$3,
    getFileListOfCurrentDir: getFileListOfCurrentDir$3
  };
  const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: provider$2
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$4 = {};
  const _hoisted_1$3 = {
    class: "h-30px min-w-66px flex items-center justify-center ws-nowrap border-1px border-#1874d3 rd-sm bg-#2b89ea px-4 text-white",
    "mr-3": "",
    hover: "op-80"
  };
  function _sfc_render$1(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("button", _hoisted_1$3, _cache[0] || (_cache[0] = [
      vue.createElementVNode("span", { class: "text-xs font-medium" }, "批量重命名", -1)
    ]));
  }
  const ButtonComponent$1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$1]]);
  function getDir() {
    const u = new URL(location.href);
    const m = u.pathname.match(/\/web\/main\/file\/folder\/([^/]+)/);
    return m[1];
  }
  async function getFileListOfCurrentDir$2(parentId = getDir()) {
    const listApi = new URL("https://cloud.189.cn/api/open/file/listFiles.action?pageSize=60&mediaType=0&iconOption=5&orderBy=filename&descending=false");
    listApi.searchParams.set("folderId", parentId);
    const result = [];
    let page = 1;
    let next = true;
    while (next) {
      listApi.searchParams.set("pageNum", String(page++));
      const { fileListAO: { fileList: list } } = await get$1(listApi);
      result.push(...list.map((x) => ({
        drive_id: "whocare",
        file_id: x.id,
        name: x.name,
        parent_file_id: "whocare",
        file_extension: getExtFromName(x.name),
        mime_type: "whocare",
        // this api only return files
        type: "file"
      })));
      next = list.length === 60;
    }
    return result;
  }
  function setRequestHeader$2() {
  }
  function post$1(api, payload) {
    return fetch(api, {
      method: "POST",
      headers: {
        "Accept": "application/json;charset=UTF-8",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "include",
      body: new URLSearchParams(payload).toString()
    }).then((res) => {
      if (res.ok)
        return res.json();
      else
        return Promise.reject(new Error("network error"));
    });
  }
  function get$1(api) {
    return fetch(api, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json;charset=UTF-8",
        "sign-type": "1"
      }
    }).then((res) => {
      if (res.ok)
        return res.json();
      else
        return Promise.reject(new Error("network error"));
    });
  }
  async function renameOne$2(resource, newName) {
    await post$1(`https://cloud.189.cn/api/open/file/renameFile.action`, {
      fileId: resource.file_id,
      destFileName: newName
    });
  }
  function shouldShowEntry$2(url) {
    const u = new URL(url);
    return u.pathname.startsWith("/web/main/file");
  }
  function getContainer$2() {
    return {
      el: document.querySelector('[class^="FileHead_file-head-left_"]'),
      style: "",
      front: true
    };
  }
  const provider$1 = {
    DRIVE_NAME: "天翼云盘",
    HOSTS: ["cloud.189.cn"],
    shouldShowEntry: shouldShowEntry$2,
    getContainer: getContainer$2,
    renameOne: renameOne$2,
    setRequestHeader: setRequestHeader$2,
    ButtonComponent: ButtonComponent$1,
    getFileListOfCurrentDir: getFileListOfCurrentDir$2
  };
  const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: provider$1
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$3 = {};
  const _hoisted_1$2 = {
    class: "inline-block h-9 flex items-center justify-center gap-x-1 rounded-lg px-4 py-2 text-#52565e transition hover:bg-#0d53ff hover:text-white",
    border: "~ #ddd solid",
    "mr-3": ""
  };
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("button", _hoisted_1$2, _cache[0] || (_cache[0] = [
      vue.createElementVNode("i", { class: "i-carbon:batch-job text-16px" }, null, -1),
      vue.createElementVNode("span", { class: "text-14px font-medium" }, "重命名", -1)
    ]));
  }
  const ButtonComponent = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render]]);
  function getParentId() {
    const hash = location.hash.replace("#/list/all", "").replace(/^\//, "").replace(/\/$/, "");
    const groups = hash.split("/");
    const lastGroup = groups[groups.length - 1];
    return lastGroup ? lastGroup.replace(/-.*$/, "") : "0";
  }
  async function getFileListOfCurrentDir$1(parentId = getParentId()) {
    const listApi = new URL("https://drive-pc.quark.cn/1/clouddrive/file/sort?pr=ucpro&fr=pc&uc_param_str=&pdir_fid=0&_page=1&_size=50&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc");
    listApi.searchParams.set("pdir_fid", parentId);
    const result = [];
    let page = 1;
    let total = -1;
    while (total === -1 || result.length < total) {
      listApi.searchParams.set("_page", String(page++));
      const { data, metadata } = await get(listApi);
      result.push(...data.list.map((x) => ({
        drive_id: "whocare",
        file_id: x.fid,
        name: x.file_name,
        parent_file_id: x.pdir_fid,
        file_extension: getExtFromName(x.file_name),
        mime_type: x.format_type,
        type: x.file ? "file" : "folder"
      })));
      total = metadata._total;
    }
    return result;
  }
  async function rename(driveId, fileId, newName) {
    return post("https://drive-pc.quark.cn/1/clouddrive/file/rename?pr=ucpro&fr=pc&uc_param_str=", {
      fid: fileId,
      file_name: newName
    });
  }
  const headers = {};
  function setRequestHeader$1(key, value) {
  }
  function post(api, payload) {
    return fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      credentials: "include",
      body: JSON.stringify(payload)
    }).then((res) => {
      if (res.ok)
        return res.json();
      else
        return Promise.reject(new Error("network error"));
    });
  }
  function get(api) {
    return fetch(api, {
      method: "GET",
      headers: {
        ...headers
      },
      credentials: "include"
    }).then((res) => {
      if (res.ok)
        return res.json();
      else
        return Promise.reject(new Error("network error"));
    });
  }
  async function renameOne$1(resource, newName) {
    await rename(resource.drive_id, resource.file_id, newName);
  }
  function shouldShowEntry$1(url) {
    return ["#/list/all"].some((x) => new URL(url).hash.startsWith(x));
  }
  function getContainer$1() {
    return {
      el: document.querySelector("#ice-container .ant-layout .section-header .btn-operate .btn-main"),
      style: "display: flex; align-items: center;",
      front: true
    };
  }
  const provider = {
    DRIVE_NAME: "夸克云盘",
    HOSTS: ["pan.quark.cn"],
    ButtonComponent,
    shouldShowEntry: shouldShowEntry$1,
    getContainer: getContainer$1,
    renameOne: renameOne$1,
    setRequestHeader: setRequestHeader$1,
    getFileListOfCurrentDir: getFileListOfCurrentDir$1
  };
  const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: provider
  }, Symbol.toStringTag, { value: "Module" }));
  const providers = /* @__PURE__ */ Object.assign({ "/src/providers/123.ts": __vite_glob_0_0, "/src/providers/aliyun.ts": __vite_glob_0_1, "/src/providers/baidu.ts": __vite_glob_0_2, "/src/providers/cmcc.ts": __vite_glob_0_3, "/src/providers/esurfing.ts": __vite_glob_0_4, "/src/providers/quark.ts": __vite_glob_0_5 });
  function resolveProvider() {
    for (const path in providers) {
      const provider2 = providers[path].default;
      if (provider2.HOSTS.some((h) => h.includes(location.host)))
        return provider2;
    }
    throw new Error("unimplemented provider");
  }
  function getApiDelay(size) {
    const p = resolveProvider();
    return p.getApiDelay ? p.getApiDelay(size) : 200;
  }
  function getApiMaxConcurrent() {
    return resolveProvider().MAX_CONCURRENT ?? 3;
  }
  function getReloadingDelay() {
    const p = resolveProvider();
    return p.getReloadingDelay ? p.getReloadingDelay() : 1e3;
  }
  function getFetchMode() {
    return resolveProvider().FETCH_MODE || "listen-url";
  }
  function shouldShowEntry(url) {
    return resolveProvider().shouldShowEntry(url);
  }
  function getFileListOfCurrentDir() {
    return resolveProvider().getFileListOfCurrentDir();
  }
  function renameOne(resource, newName) {
    return resolveProvider().renameOne(resource, newName);
  }
  function setRequestHeader(key, value) {
    return resolveProvider().setRequestHeader(key, value);
  }
  function getComponent() {
    return resolveProvider().ButtonComponent;
  }
  function getContainer() {
    return resolveProvider().getContainer();
  }
  function getNewNameByExp(oldName, from, to) {
    try {
      return oldName.replace(new RegExp(from), to);
    } catch {
      return "";
    }
  }
  const SeasonEpisodeExtract = /S(?:eason)?[._\- ]?(\d{1,3})(?:[._\- ]?E|[._\- ])(\d{1,3})(?!\d)/i;
  const EpisodeExtract1 = /EP?(\d{1,3})(?!\d)/i;
  const EpisodeExtract2 = new RegExp("(?<![0-9h\\u4E00-\\u9FA5])(\\d{1,3})(?!\\d)(?![PK季])", "i");
  const EpisodeExtract3 = new RegExp("(?<![0-9h])(\\d{1,3})(?!\\d)(?![PK季])", "i");
  function getNewNameByExtract(oldName, prefix, season, epHelpers, refName, offset, leadingZeroCount) {
    let episode;
    if (epHelpers.pre || epHelpers.post)
      episode = getEpisodeByHelpers(oldName, epHelpers, leadingZeroCount);
    if (!episode && refName)
      episode = getEpisodeByCompare(oldName, refName, leadingZeroCount);
    if (!episode)
      episode = getEpisode(oldName, leadingZeroCount);
    season || (season = "1");
    const seasonNumber = Number.parseInt(season);
    const seasonNumberIsValid = !Number.isNaN(seasonNumber) && seasonNumber < 100;
    season = String(seasonNumberIsValid ? seasonNumber : 1).padStart(2, "0");
    if (!episode || !season)
      return "";
    const m = oldName.match(/(\.[a-z0-9]+)$/i);
    episode = offsetEpisode(episode, offset, leadingZeroCount);
    return `${prefix}${prefix.endsWith(".") ? "" : "."}S${season}E${episode}${m ? m[1] : ""}`;
  }
  function offsetEpisode(episodeStr, offset, leadingZeroCount) {
    const n = Number.parseInt(episodeStr);
    return normalizeEpisode(String(n + (offset ? Number.parseInt(offset) : 0)), leadingZeroCount);
  }
  function getEpisodeByCompare(oldName, refName, leadingZeroCount) {
    const matchesO = [...oldName.matchAll(/\d+/g)].map((x) => x[0]);
    const matchesR = [...refName.matchAll(/\d+/g)].map((x) => x[0]);
    if (matchesO.length === 0 || matchesO.length !== matchesR.length)
      return;
    const diff = [];
    for (let i = 0; i < matchesO.length; ++i) {
      if (matchesO[i] !== matchesR[i])
        diff.push(matchesO[i]);
    }
    const filtered = diff.filter((x) => {
      const n = Number.parseInt(x);
      return !Number.isNaN(n) && n !== 0 && n < 1e3;
    });
    return filtered.length === 1 ? normalizeEpisode(filtered[0], leadingZeroCount) : void 0;
  }
  function normalizeEpisode(x, leadingZeroCount = 3) {
    return String(+x).padStart(leadingZeroCount, "0");
  }
  function getEpisodeByHelpers(oldName, epHelpers, leadingZeroCount) {
    const { pre, post: post2 } = epHelpers;
    if (!pre && !post2)
      return;
    const preIndex = pre ? oldName.indexOf(pre) : 0;
    const postIndex = post2 ? oldName.lastIndexOf(post2) : oldName.length;
    if (preIndex === -1 && postIndex === -1)
      return;
    const shorted = oldName.slice(preIndex + pre.length, postIndex);
    const parsed = Number.parseInt(getEpisode(shorted, leadingZeroCount));
    if (Number.isInteger(parsed))
      return normalizeEpisode(String(parsed), leadingZeroCount);
  }
  function getEpisode(oldName, leadingZeroCount) {
    oldName = oldName.replace(/\.[a-z0-9]+$/i, "");
    {
      const [_, _s, episode] = oldName.match(SeasonEpisodeExtract) || [];
      if (episode)
        return normalizeEpisode(episode, leadingZeroCount);
    }
    {
      const [_, episode] = oldName.match(EpisodeExtract1) || [];
      if (episode)
        return normalizeEpisode(episode, leadingZeroCount);
    }
    {
      const [_, episode] = oldName.match(EpisodeExtract2) || [];
      if (episode)
        return normalizeEpisode(episode, leadingZeroCount);
    }
    {
      const [_, episode] = oldName.match(EpisodeExtract3) || [];
      if (episode)
        return normalizeEpisode(episode, leadingZeroCount);
    }
    return "001";
  }
  function getSeason(oldName) {
    const [_, s] = oldName.match(SeasonEpisodeExtract) || [];
    return s;
  }
  function getLcstr(a, b) {
    if (!a || !b)
      return "";
    const lenA = a.length;
    const lenB = b.length;
    let cache2 = [[], []];
    let maxLen = 0;
    let maxBEnd;
    for (let i = 0; i < lenA; i++)
      cache2[0][i] = a[0] === b[i] ? 1 : 0;
    for (let i = 1; i < lenA; i++) {
      cache2[1][0] = a[i] === b[0] ? 1 : 0;
      for (let j = 1; j < lenB; j++) {
        cache2[1][j] = a[i] === b[j] ? cache2[0][j - 1] + 1 : 0;
        if (cache2[1][j] > maxLen) {
          maxLen = cache2[1][j];
          maxBEnd = j;
        }
      }
      cache2 = [cache2[1], []];
    }
    return b.slice(maxBEnd - maxLen + 1, maxBEnd + 1);
  }
  function guessSeason(list) {
    let currentSeason = "1";
    list.forEach((v) => {
      const temp = getSeason(v.name);
      if (temp)
        currentSeason = temp;
    });
    return currentSeason;
  }
  const Chinese = /([\u4E00-\u9FA5]+)/;
  function guessPrefix(list) {
    if (list.length === 0)
      return "";
    const m = list[0].name.match(Chinese);
    if (m == null ? void 0 : m[1])
      return m[1];
    if (list.length < 2) {
      const s = list[0];
      return s.name.replace(`.${s.file_extension}`, "").replace(/\s*S\d+E\d*|\s*E\d+/i, "").trim();
    }
    const [a, b] = list.slice(-2).map((x) => x.name.replace(`.${x.file_extension}`, ""));
    const lcs = getLcstr(a, b);
    if (lcs)
      return lcs.replace(/\s*S\d+E\d*|\s*E\d+/i, "").trim();
    return "";
  }
  const VideoExts = [
    "mp4",
    "flv",
    "f4v",
    "webm",
    "m4v",
    "mov",
    "cpk",
    "dirac",
    "3gp",
    "3g2",
    "rm",
    "rmvb",
    "wmv",
    "avi",
    "asf",
    "mpg",
    "mpeg",
    "mpe",
    "vob",
    "mkv",
    "ram",
    "qt",
    "fli",
    "flc",
    "mod",
    "iso",
    "ts"
  ];
  const SubTitleExts = [
    "srt",
    "ass",
    "ssa",
    "sub",
    "idx",
    "vtt",
    "ttml",
    "dfxp",
    "lrc",
    "smi",
    "sami",
    "txt",
    "xml",
    "usf",
    "psb",
    "rt",
    "sbv",
    "mpl",
    "aqt",
    "jss",
    "dks",
    "pjs",
    "mks",
    "cap"
  ];
  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }
  function createSharedComposable(composable) {
    let subscribers = 0;
    let state;
    let scope;
    const dispose = () => {
      subscribers -= 1;
      if (scope && subscribers <= 0) {
        scope.stop();
        state = void 0;
        scope = void 0;
      }
    };
    return (...args) => {
      subscribers += 1;
      if (!scope) {
        scope = vue.effectScope(true);
        state = scope.run(() => composable(...args));
      }
      tryOnScopeDispose(dispose);
      return state;
    };
  }
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const toString = Object.prototype.toString;
  const isObject = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  function createFilterWrapper(filter, fn) {
    function wrapper(...args) {
      return new Promise((resolve, reject) => {
        Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
      });
    }
    return wrapper;
  }
  function debounceFilter(ms, options = {}) {
    let timer2;
    let maxTimer;
    let lastRejector = noop;
    const _clearTimeout = (timer22) => {
      clearTimeout(timer22);
      lastRejector();
      lastRejector = noop;
    };
    const filter = (invoke) => {
      const duration = vue.toValue(ms);
      const maxDuration = vue.toValue(options.maxWait);
      if (timer2)
        _clearTimeout(timer2);
      if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
        if (maxTimer) {
          _clearTimeout(maxTimer);
          maxTimer = null;
        }
        return Promise.resolve(invoke());
      }
      return new Promise((resolve, reject) => {
        lastRejector = options.rejectOnCancel ? reject : resolve;
        if (maxDuration && !maxTimer) {
          maxTimer = setTimeout(() => {
            if (timer2)
              _clearTimeout(timer2);
            maxTimer = null;
            resolve(invoke());
          }, maxDuration);
        }
        timer2 = setTimeout(() => {
          if (maxTimer)
            _clearTimeout(maxTimer);
          maxTimer = null;
          resolve(invoke());
        }, duration);
      });
    };
    return filter;
  }
  function toArray(value) {
    return Array.isArray(value) ? value : [value];
  }
  function useDebounceFn(fn, ms = 200, options = {}) {
    return createFilterWrapper(
      debounceFilter(ms, options),
      fn
    );
  }
  const defaultWindow = isClient ? window : void 0;
  function unrefElement(elRef) {
    var _a;
    const plain = vue.toValue(elRef);
    return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
  }
  function useEventListener(...args) {
    let target;
    let events2;
    let listeners;
    let options;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      [events2, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events2, listeners, options] = args;
    }
    if (!target)
      return noop;
    events2 = toArray(events2);
    listeners = toArray(listeners);
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options2) => {
      el.addEventListener(event, listener, options2);
      return () => el.removeEventListener(event, listener, options2);
    };
    const stopWatch = vue.watch(
      () => [unrefElement(target), vue.toValue(options)],
      ([el, options2]) => {
        cleanup();
        if (!el)
          return;
        const optionsClone = isObject(options2) ? { ...options2 } : options2;
        cleanups.push(
          ...events2.flatMap((event) => {
            return listeners.map((listener) => register(el, event, listener, optionsClone));
          })
        );
      },
      { immediate: true, flush: "post" }
    );
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return stop;
  }
  function _useUrl() {
    const url = vue.ref(location.href);
    let timer2 = window.setInterval(() => {
      url.value = location.href;
    }, 1e3);
    vue.onScopeDispose(() => {
      if (timer2) {
        window.clearInterval(timer2);
        timer2 = void 0;
      }
    });
    return url;
  }
  const useUrl = createSharedComposable(_useUrl);
  const RetryMax = 3;
  function useFileList() {
    let remainRetryCount = RetryMax;
    let hash = 0;
    const list = vue.ref([]);
    const loading = vue.ref(false);
    async function fetch2(h) {
      try {
        const res = await getFileListOfCurrentDir();
        if (h !== hash)
          return;
        list.value = res;
      } catch {
        if (h !== hash)
          return;
        setTimeout(() => {
          if (h !== hash)
            return;
          if (--remainRetryCount)
            return fetch2(hash);
        }, 1e3);
      }
    }
    async function refetch() {
      hash++;
      remainRetryCount = RetryMax;
      loading.value = true;
      await fetch2(hash);
      loading.value = false;
    }
    return {
      list,
      refetch,
      loading
    };
  }
  const useMainStore = /* @__PURE__ */ defineStore("main", () => {
    const uncheckList = vue.reactive(/* @__PURE__ */ new Set());
    const doneList = vue.reactive(/* @__PURE__ */ new Set());
    const errorList = vue.reactive(/* @__PURE__ */ new Set());
    const newNameMap = vue.reactive(/* @__PURE__ */ new Map());
    const running = vue.ref(false);
    const activeMode = vue.ref("extract");
    const extractIncludeSubTitleFlag = vue.ref(false);
    const from = vue.ref("");
    const to = vue.ref("");
    const prefix = vue.ref("");
    const season = vue.ref("");
    const offset = vue.ref("");
    const leadingZeroCount = vue.ref(3);
    const epHelperPre = vue.ref("");
    const epHelperPost = vue.ref("");
    const error = vue.ref("");
    const warning = vue.ref("");
    const processData = vue.ref({
      total: 0,
      skip: 0,
      done: 0
    });
    const url = useUrl();
    const shouldShowEntry$12 = vue.computed(() => shouldShowEntry(url.value));
    const { list, loading: listLoading, refetch } = useFileList();
    const videoList = vue.computed(() => {
      return list.value.filter((x) => x.type === "file" && (VideoExts.includes(x.file_extension.toLowerCase()) || extractIncludeSubTitleFlag.value && SubTitleExts.includes(x.file_extension.toLowerCase())));
    });
    const displayList = vue.computed(() => activeMode.value === "extract" ? videoList.value : list.value);
    const selectedList = vue.computed(() => displayList.value.filter((x) => !uncheckList.has(x.file_id) && newNameMap.has(x.file_id) && x.name !== newNameMap.get(x.file_id)));
    const conflictFileIds = vue.computed(() => {
      const l = selectedList.value.map((x) => [x.file_id, newNameMap.get(x.file_id)]);
      const m = /* @__PURE__ */ new Map();
      const r = /* @__PURE__ */ new Set();
      for (const [id, newName] of l) {
        if (m.has(newName)) {
          r.add(m.get(newName));
          r.add(id);
        } else {
          m.set(newName, id);
        }
      }
      return r;
    });
    const hasConflict = vue.computed(() => {
      return conflictFileIds.value.size > 0;
    });
    const disabled = vue.computed(() => activeMode.value === "regexp" && (!from.value || !to.value) || activeMode.value === "extract" && (!prefix.value || !season.value) || listLoading.value || !selectedList.value.length || hasConflict.value);
    const fetchMode = getFetchMode();
    if (fetchMode === "listen-url") {
      vue.watch(url, (v, ov) => {
        if (v && v !== ov && shouldShowEntry$12.value) {
          refetch();
        }
      }, { immediate: true });
    } else if (fetchMode === "manual-trigger") ;
    else {
      const exhaustedCheck = fetchMode;
      throw new Error(`fetchMode '${exhaustedCheck}' not implemented!`);
    }
    vue.watch(list, () => {
      uncheckList.clear();
      doneList.clear();
      errorList.clear();
      newNameMap.clear();
      guessPrefixAndSeason();
    });
    const debouncedNameGenerator = useDebounceFn(() => {
      if (list.value.length) {
        newNameMap.clear();
        if (activeMode.value === "extract" && prefix.value || activeMode.value === "regexp" && from.value && to.value) {
          for (let i = 0; i < list.value.length; ++i) {
            const item = list.value[i];
            const otherItem = list.value[i === 0 ? 1 : 0];
            newNameMap.set(item.file_id, getNewName(item.name, season.value.trim(), otherItem == null ? void 0 : otherItem.name));
          }
        }
      }
    }, 300);
    vue.watch([list, activeMode, prefix, season, offset, from, to, leadingZeroCount, epHelperPre, epHelperPost], debouncedNameGenerator, { immediate: true });
    function guessPrefixAndSeason() {
      prefix.value = guessPrefix(videoList.value);
      season.value = guessSeason(videoList.value);
    }
    function initRunState() {
      running.value = false;
      error.value = "";
      processData.value = {
        total: 0,
        skip: 0,
        done: 0
      };
    }
    const MaxConcurrent = getApiMaxConcurrent();
    async function run() {
      if (disabled.value || running.value)
        return;
      initRunState();
      running.value = true;
      processData.value.total = displayList.value.length;
      processData.value.skip = displayList.value.length - selectedList.value.length;
      const queue = selectedList.value.slice();
      const totalTodoSize = queue.length;
      while (queue.length) {
        const subQueue = [];
        for (let i = 0; i < MaxConcurrent; i++) {
          const x = queue.shift();
          if (x)
            subQueue.push(x);
          else
            break;
        }
        await Promise.all(subQueue.map(async (item) => {
          const newName = newNameMap.get(item.file_id);
          if (!newName)
            return;
          await renameOne(item, newName).then(() => {
            doneList.add(item.file_id);
          }).catch(() => {
            errorList.add(item.file_id);
          });
          processData.value.done++;
        }));
        await new Promise((r) => setTimeout(r, getApiDelay(totalTodoSize)));
      }
      running.value = false;
      {
        const delay = getReloadingDelay();
        const seconds = Math.floor(delay / 1e3);
        warning.value = `即将刷新页面(${seconds}s后)...`;
        setTimeout(() => {
          location.reload();
        }, delay);
      }
    }
    function clampLeadingZeroCount(n) {
      if (typeof n === "string") {
        n = Number.parseInt(n);
      } else {
        n = Math.trunc(n);
      }
      if (Number.isNaN(n)) {
        n = 3;
      }
      if (n < 1 || n > 10) {
        n = 3;
      }
      return n;
    }
    function getNewName(oldName, season2, refName) {
      if (activeMode.value === "extract") {
        return getNewNameByExtract(
          oldName,
          prefix.value.trim(),
          season2,
          { pre: epHelperPre.value, post: epHelperPost.value },
          refName,
          offset.value,
          clampLeadingZeroCount(leadingZeroCount.value)
        );
      } else {
        return getNewNameByExp(oldName, from.value, to.value);
      }
    }
    function clearHelper() {
      epHelperPre.value = "";
      epHelperPost.value = "";
    }
    return {
      list,
      listLoading,
      refetch,
      shouldShowEntry: shouldShowEntry$12,
      uncheckList,
      videoList,
      displayList,
      selectedList,
      newNameMap,
      errorList,
      doneList,
      hasConflict,
      conflictFileIds,
      disabled,
      activeMode,
      extractIncludeSubTitleFlag,
      from,
      to,
      prefix,
      season,
      offset,
      leadingZeroCount,
      clampLeadingZeroCount,
      error,
      warning,
      processData,
      run,
      running,
      extractHelperPre: epHelperPre,
      extractHelperPost: epHelperPost,
      clearHelper,
      fetchMode
    };
  });
  function useLoadingDots() {
    const loadingDotsIndex = vue.ref(0);
    const loadingDotsList = [".", "..", "..."];
    const loadingDots = vue.toRef(() => loadingDotsList[loadingDotsIndex.value]);
    let loadingDotsTimer;
    vue.onMounted(() => {
      loadingDotsTimer = window.setInterval(() => {
        loadingDotsIndex.value = (loadingDotsIndex.value + 1) % loadingDotsList.length;
      }, 200);
    });
    vue.onUnmounted(() => {
      window.clearInterval(loadingDotsTimer);
    });
    return { loadingDots };
  }
  const _hoisted_1$1 = { class: "custom-scrollbar fixed bottom-2 right-0 top-2 z-app w-[max(500px,50vw)] overflow-y-auto border-y-3px border-l-3px border-primary-600 rounded-l-lg border-solid bg-white px-4 py-3 font-mono shadow" };
  const _hoisted_2$1 = {
    key: 0,
    class: "absolute inset-0 z-2 flex flex-col items-center justify-center bg-white/80 text-primary-600"
  };
  const _hoisted_3$1 = { class: "py-3 text-sm" };
  const _hoisted_4$1 = { class: "absolute" };
  const _hoisted_5$1 = { class: "py-1 pb-3 text-xs text-gray" };
  const _hoisted_6$1 = { class: "flex items-center justify-between" };
  const _hoisted_7$1 = {
    key: 0,
    class: "animated animated-shake-x animated-duration-800"
  };
  const _hoisted_8$1 = { key: 1 };
  const _hoisted_9$1 = { key: 2 };
  const _hoisted_10$1 = { class: "flex items-center gap-x-3 pb-2" };
  const _hoisted_11$1 = {
    key: 0,
    class: "ml-4 text-sm text-gray-600"
  };
  const _hoisted_12$1 = {
    key: 1,
    class: "ml-auto text-xs text-gray-600 font-sans"
  };
  const _hoisted_13$1 = { class: "text-primary-600 font-bold" };
  const _hoisted_14$1 = {
    key: 1,
    class: "grid grid-cols-[20px_auto_30px_minmax(200px,1fr)] items-center gap-x-2 gap-y-1 text-xs"
  };
  const _hoisted_15$1 = {
    key: 2,
    class: "py-8 text-center text-xs text-primary-600"
  };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "PreviewPanel",
    setup(__props) {
      const main = useMainStore();
      function handleCheckChange(fileId, checked) {
        if (!checked)
          main.uncheckList.add(fileId);
        else
          main.uncheckList.delete(fileId);
      }
      function manualPickName(id) {
        if (id) {
          const found = main.videoList.find((x) => x.file_id === id);
          if (found) {
            if (main.activeMode === "extract")
              main.prefix = found.name.replace(`.${found.file_extension}`, "");
            else
              main.from = found.name;
          }
        }
      }
      const { loadingDots } = useLoadingDots();
      const helperTipAnimationClass = vue.ref("");
      vue.watch(() => main.hasConflict, (hasConflict) => {
        const timers = [];
        if (hasConflict) {
          helperTipAnimationClass.value = "";
          timers.push(window.setTimeout(() => {
            helperTipAnimationClass.value = "animated animated-flash animated-duration-1s";
            timers.push(window.setTimeout(() => {
              helperTipAnimationClass.value = "";
            }, 1e3));
          }, 1e3));
        } else {
          while (timers.length)
            window.clearInterval(timers.pop());
        }
      });
      return (_ctx, _cache) => {
        const _component_PreviewEntry = _sfc_main$9;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.unref(main).listLoading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$1, [
            _cache[5] || (_cache[5] = vue.createElementVNode("div", { class: "i-carbon:circle-packing animate-spin text-4xl" }, null, -1)),
            vue.createElementVNode("p", _hoisted_3$1, [
              _cache[4] || (_cache[4] = vue.createTextVNode(" 正在获取文件列表")),
              vue.createElementVNode("span", _hoisted_4$1, vue.toDisplayString(vue.unref(loadingDots)), 1)
            ])
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_5$1, [
            vue.createElementVNode("span", _hoisted_6$1, [
              vue.unref(main).hasConflict ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7$1, "❌ 文件名有冲突！")) : vue.unref(main).selectedList.length ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_8$1, "✅ 准备就绪")) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_9$1, "⌛ 暂无改动")),
              vue.unref(main).activeMode === "extract" ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 3,
                class: vue.normalizeClass(["inline-flex items-center gap-x-1", vue.unref(helperTipAnimationClass)])
              }, [
                _cache[6] || (_cache[6] = vue.createElementVNode("span", null, "帮助定位集数：", -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(main).extractHelperPre = $event),
                  class: "bg-transparent px-1 text-right text-xs outline-none",
                  border: "b",
                  "inline-block": "",
                  "w-5em": "",
                  type: "text"
                }, null, 512), [
                  [vue.vModelText, vue.unref(main).extractHelperPre]
                ]),
                _cache[7] || (_cache[7] = vue.createElementVNode("span", { class: "text-primary" }, "[集数]", -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(main).extractHelperPost = $event),
                  class: "bg-transparent px-1 text-xs outline-none",
                  border: "b",
                  "inline-block": "",
                  "w-5em": "",
                  type: "text"
                }, null, 512), [
                  [vue.vModelText, vue.unref(main).extractHelperPost]
                ])
              ], 2)) : vue.createCommentVNode("", true)
            ])
          ]),
          vue.createElementVNode("div", _hoisted_10$1, [
            vue.createElementVNode("button", {
              class: "text-sm text-primary-600",
              onClick: _cache[2] || (_cache[2] = ($event) => vue.unref(main).uncheckList.clear())
            }, " 全选 "),
            vue.createElementVNode("button", {
              class: "text-sm text-primary-600",
              onClick: _cache[3] || (_cache[3] = ($event) => vue.unref(main).displayList.forEach((x) => vue.unref(main).uncheckList.add(x.file_id)))
            }, " 全不选 "),
            vue.unref(main).displayList.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11$1, [
              _cache[8] || (_cache[8] = vue.createTextVNode(" 点击 ")),
              _cache[9] || (_cache[9] = vue.createElementVNode("i", { class: "i-carbon:pointer-text [vertical-align:-0.2em] inline-block text-sm text-green-700" }, null, -1)),
              vue.createTextVNode(" 可将其填充到“" + vue.toDisplayString(vue.unref(main).activeMode === "extract" ? "剧名" : "From") + "” ", 1)
            ])) : vue.createCommentVNode("", true),
            vue.unref(main).displayList.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12$1, [
              _cache[10] || (_cache[10] = vue.createTextVNode(" 共 ")),
              vue.createElementVNode("span", _hoisted_13$1, vue.toDisplayString(vue.unref(main).displayList.length), 1),
              _cache[11] || (_cache[11] = vue.createTextVNode(" 个文件 "))
            ])) : vue.createCommentVNode("", true)
          ]),
          vue.unref(main).displayList.length ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_14$1, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(main).displayList, (item) => {
              return vue.openBlock(), vue.createBlock(_component_PreviewEntry, {
                id: item.file_id,
                key: item.file_id,
                "old-name": item.name,
                "new-name": vue.unref(main).newNameMap.get(item.file_id) || "",
                "model-value": !vue.unref(main).uncheckList.has(item.file_id),
                done: vue.unref(main).doneList.has(item.file_id),
                error: vue.unref(main).errorList.has(item.file_id),
                conflict: vue.unref(main).conflictFileIds.has(item.file_id),
                "onUpdate:modelValue": ($event) => handleCheckChange(item.file_id, $event),
                onPick: manualPickName
              }, null, 8, ["id", "old-name", "new-name", "model-value", "done", "error", "conflict", "onUpdate:modelValue"]);
            }), 128))
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_15$1, _cache[12] || (_cache[12] = [
            vue.createTextVNode(" 当前"),
            vue.createElementVNode("span", { class: "font-bold" }, "目录", -1),
            vue.createTextVNode("和"),
            vue.createElementVNode("span", { class: "font-bold" }, "模式", -1),
            vue.createTextVNode("下，没有满足要求的条目~ ")
          ])))
        ]);
      };
    }
  });
  const __unplugin_components_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-b66f0371"]]);
  const name = "drive-rename";
  const type = "module";
  const version = "1.4.4";
  const packageManager = "pnpm@9.15.4";
  const description = "Batch rename files, supporting various cloud drives.";
  const author = "a1mersnow";
  const repository = "https://github.com/a1mersnow/drive-rename";
  const engines = { "node": ">=22.0.0" };
  const scripts = { "build": "vite build", "dev": "vite --port 3333 --open", "lint": "eslint .", "typecheck": "vue-tsc --noEmit", "preview": "vite preview", "test": "vitest", "up": "taze major -I", "postinstall": "npx simple-git-hooks", "release": "bumpp" };
  const dependencies = { "@vueuse/core": "^12.4.0", "dayjs": "^1.11.13", "js-md5": "^0.8.3", "pinia": "^2.3.0", "vue": "^3.5.13" };
  const devDependencies = { "@antfu/eslint-config": "^3.14.0", "@iconify-json/carbon": "^1.2.5", "@iconify-json/ion": "^1.2.2", "@types/node": "^22.10.7", "@unocss/eslint-config": "^65.4.2", "@unocss/preset-rem-to-px": "^65.4.2", "@unocss/reset": "^65.4.2", "@vitejs/plugin-vue": "^5.2.1", "@vue/test-utils": "^2.4.6", "animated-unocss": "^0.0.6", "bumpp": "^9.10.1", "eslint": "^9.18.0", "eslint-define-config": "^2.1.0", "execa": "^9.5.2", "jsdom": "^26.0.0", "lint-staged": "^15.4.1", "pnpm": "^9.15.4", "simple-git-hooks": "^2.11.1", "taze": "^18.2.0", "typescript": "^5.7.3", "unocss": "^65.4.2", "unplugin-auto-import": "^19.0.0", "unplugin-vue-components": "^28.0.0", "vite": "^6.0.7", "vite-plugin-monkey": "^5.0.5", "vitest": "^3.0.2", "vue-tsc": "^2.2.0" };
  const pkg = {
    name,
    type,
    version,
    "private": true,
    packageManager,
    description,
    author,
    repository,
    engines,
    scripts,
    dependencies,
    devDependencies,
    "simple-git-hooks": { "pre-commit": "pnpm lint-staged" },
    "lint-staged": { "*": "eslint --fix" }
  };
  function useUpdate() {
    const currentVersion = vue.ref(pkg.version);
    const newVersion = vue.ref("");
    vue.onMounted(async () => {
      const res = await fetch(`https://update.greasyfork.org/scripts/479295/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D.meta.js?t=${Date.now()}`);
      if (res.ok) {
        const raw = await res.text();
        const regular = /@version\s+(\d\.\d\.\d)/;
        const m = regular.exec(raw);
        if (m)
          newVersion.value = m[1];
      }
    });
    const hasNew = vue.computed(() => newVersion.value && newVersion.value !== currentVersion.value);
    return { currentVersion, newVersion, hasNew };
  }
  const _hoisted_1 = { class: "absolute z-app mt-2 w-300px rounded-lg bg-primary-100 p-3 shadow" };
  const _hoisted_2 = { class: "pb-2" };
  const _hoisted_3 = {
    key: 0,
    class: "text-xs text-red-600 underline underline-dashed hover:text-red-600 hover:underline hover:underline-dashed",
    href: "https://update.greasyfork.org/scripts/479295/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D.user.js",
    target: "_blank"
  };
  const _hoisted_4 = {
    key: 1,
    class: "text-xs text-primary"
  };
  const _hoisted_5 = { class: "mb-3 flex items-center gap-x-4" };
  const _hoisted_6 = { class: "w-fit flex gap-x-1px overflow-hidden rounded text-xs text-white" };
  const _hoisted_7 = ["onClick"];
  const _hoisted_8 = { class: "grid gap-y-3 text-sm" };
  const _hoisted_9 = ["disabled"];
  const _hoisted_10 = ["disabled"];
  const _hoisted_11 = { class: "mb-1 block flex items-center gap-x-2" };
  const _hoisted_12 = ["disabled"];
  const _hoisted_13 = ["disabled"];
  const _hoisted_14 = { class: "grid cols-2 gap-x-3" };
  const _hoisted_15 = ["disabled"];
  const _hoisted_16 = ["disabled"];
  const _hoisted_17 = { class: "min-h-40px" };
  const _hoisted_18 = {
    key: 0,
    class: "text-xs text-red"
  };
  const _hoisted_19 = {
    key: 1,
    class: "text-xs text-gray"
  };
  const _hoisted_20 = {
    key: 2,
    class: "text-xs text-primary"
  };
  const _hoisted_21 = { class: "flex" };
  const _hoisted_22 = ["disabled"];
  const _hoisted_23 = {
    key: 0,
    class: "i-carbon:contour-finding block animate-spin"
  };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "ControlPanel",
    setup(__props) {
      const { newVersion, currentVersion, hasNew } = useUpdate();
      const main = useMainStore();
      function fillRandomPrefix() {
        const len = main.videoList.length;
        if (!len)
          return;
        const found = main.videoList[random(len)];
        if (found)
          main.prefix = found.name.replace(`.${found.file_extension}`, "");
      }
      const modes = [
        { title: "剧集模式", value: "extract" },
        { title: "正则模式", value: "regexp" }
      ];
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("p", _hoisted_2, [
            _cache[9] || (_cache[9] = vue.createTextVNode(" 批量重命名当前目录下的所有文件。")),
            _cache[10] || (_cache[10] = vue.createElementVNode("br", null, null, -1)),
            vue.unref(hasNew) ? (vue.openBlock(), vue.createElementBlock("a", _hoisted_3, "有新版本(" + vue.toDisplayString(vue.unref(newVersion)) + ")啦！点击更新～", 1)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, "当前版本：" + vue.toDisplayString(vue.unref(currentVersion)), 1))
          ]),
          vue.createElementVNode("div", _hoisted_5, [
            vue.createElementVNode("div", _hoisted_6, [
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(modes, (m) => {
                return vue.createElementVNode("div", {
                  key: m.value,
                  class: vue.normalizeClass(["bg-primary px-2 py-1", [
                    vue.unref(main).activeMode === m.value ? "bg-primary-600" : "",
                    vue.unref(main).running ? "cursor-not-allowed op50" : "cursor-pointer"
                  ]]),
                  onClick: ($event) => !vue.unref(main).running && (vue.unref(main).activeMode = m.value)
                }, vue.toDisplayString(m.title), 11, _hoisted_7);
              }), 64))
            ]),
            vue.unref(main).activeMode === "regexp" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              _cache[11] || (_cache[11] = vue.createElementVNode("a", {
                class: "text-xs text-primary-600 font-medium underline",
                href: "https://regex101.com/",
                target: "_blank"
              }, " 正则可视化 ", -1)),
              _cache[12] || (_cache[12] = vue.createElementVNode("a", {
                class: "text-xs text-primary-600 font-medium underline",
                href: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace",
                target: "_blank"
              }, " 文档 ", -1))
            ], 64)) : vue.createCommentVNode("", true)
          ]),
          vue.createElementVNode("div", _hoisted_8, [
            vue.unref(main).activeMode === "regexp" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              vue.createElementVNode("div", null, [
                _cache[13] || (_cache[13] = vue.createElementVNode("label", { class: "mb-1 block" }, "From", -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(main).from = $event),
                  disabled: vue.unref(main).running,
                  autofocus: "",
                  placeholder: "正则表达式",
                  class: "h-8 w-full rounded bg-white px-3 outline-none"
                }, null, 8, _hoisted_9), [
                  [vue.vModelText, vue.unref(main).from]
                ])
              ]),
              vue.createElementVNode("div", null, [
                _cache[14] || (_cache[14] = vue.createElementVNode("label", { class: "mb-1 block" }, "To", -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(main).to = $event),
                  disabled: vue.unref(main).running,
                  placeholder: "替换表达式",
                  class: "h-8 w-full rounded bg-white px-3 outline-none"
                }, null, 8, _hoisted_10), [
                  [vue.vModelText, vue.unref(main).to]
                ])
              ]),
              _cache[15] || (_cache[15] = vue.createStaticVNode('<div class="text-xs font-mono"><span class="text-#b07d48">原文件名</span><span class="text-#999">.</span><span class="text-#59873a">replace</span><span class="text-#2993a3">(</span><span class="text-#ab5959">new</span> <span class="text-#59873a">RegExp</span><span class="text-#1e754f">(</span><span class="text-#b07d48">From</span><span class="text-#1e754f">)</span><span class="text-#999">,</span> <span class="text-#b07d48">To</span><span class="text-#2993a3">)</span></div>', 1))
            ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              vue.createElementVNode("div", {
                class: "flex cursor-pointer select-none items-center gap-x-1 text-xs text-gray",
                onClick: _cache[2] || (_cache[2] = ($event) => vue.unref(main).extractIncludeSubTitleFlag = !vue.unref(main).extractIncludeSubTitleFlag)
              }, [
                vue.createVNode(_sfc_main$a, {
                  "model-value": vue.unref(main).extractIncludeSubTitleFlag,
                  class: "text-xs"
                }, null, 8, ["model-value"]),
                _cache[16] || (_cache[16] = vue.createTextVNode(" 是否包含字幕文件 "))
              ]),
              vue.createElementVNode("div", null, [
                vue.createElementVNode("label", _hoisted_11, [
                  _cache[17] || (_cache[17] = vue.createTextVNode(" 剧名 ")),
                  vue.createElementVNode("i", {
                    class: vue.normalizeClass(["i-ion:dice block text-sm text-primary-700", vue.unref(main).videoList.length ? "cursor-pointer" : "cursor-not-allowed opacity-50"]),
                    title: "随机填充原文件名",
                    onClick: fillRandomPrefix
                  }, null, 2)
                ]),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(main).prefix = $event),
                  disabled: vue.unref(main).running,
                  autofocus: "",
                  placeholder: "请输入",
                  class: "h-8 w-full rounded bg-white px-3 outline-none"
                }, null, 8, _hoisted_12), [
                  [vue.vModelText, vue.unref(main).prefix]
                ])
              ]),
              vue.createElementVNode("div", null, [
                _cache[18] || (_cache[18] = vue.createElementVNode("label", { class: "mb-1 block" }, "季", -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(main).season = $event),
                  disabled: vue.unref(main).running,
                  placeholder: "0~99",
                  class: "h-8 w-full rounded bg-white px-3 outline-none"
                }, null, 8, _hoisted_13), [
                  [vue.vModelText, vue.unref(main).season]
                ])
              ]),
              vue.createElementVNode("div", _hoisted_14, [
                vue.createElementVNode("div", null, [
                  _cache[19] || (_cache[19] = vue.createElementVNode("label", { class: "mb-1 block" }, "集数偏移", -1)),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(main).offset = $event),
                    disabled: vue.unref(main).running,
                    placeholder: "1~∞",
                    class: "h-8 w-full rounded bg-white px-3 outline-none"
                  }, null, 8, _hoisted_15), [
                    [vue.vModelText, vue.unref(main).offset]
                  ])
                ]),
                vue.createElementVNode("div", null, [
                  _cache[20] || (_cache[20] = vue.createElementVNode("label", { class: "mb-1 block" }, "集数前缀0个数", -1)),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(main).leadingZeroCount = $event),
                    type: "number",
                    disabled: vue.unref(main).running,
                    placeholder: "1~10",
                    class: "h-8 w-full rounded bg-white px-3 outline-none",
                    onBlur: _cache[7] || (_cache[7] = ($event) => vue.unref(main).leadingZeroCount = vue.unref(main).clampLeadingZeroCount(vue.unref(main).leadingZeroCount))
                  }, null, 40, _hoisted_16), [
                    [
                      vue.vModelText,
                      vue.unref(main).leadingZeroCount,
                      void 0,
                      { number: true }
                    ]
                  ])
                ])
              ])
            ], 64)),
            vue.createElementVNode("div", _hoisted_17, [
              vue.unref(main).error ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_18, vue.toDisplayString(vue.unref(main).error), 1)) : vue.unref(main).processData.total ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_19, [
                vue.createTextVNode(" 总共 " + vue.toDisplayString(vue.unref(main).processData.total) + " | 跳过 " + vue.toDisplayString(vue.unref(main).processData.skip) + " | 完成 " + vue.toDisplayString(vue.unref(main).processData.done) + " ", 1),
                vue.unref(main).errorList.size ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                  vue.createTextVNode(" (失败 " + vue.toDisplayString(vue.unref(main).errorList.size) + ") ", 1)
                ], 64)) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              vue.unref(main).warning ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_20, vue.toDisplayString(vue.unref(main).warning), 1)) : vue.createCommentVNode("", true)
            ]),
            vue.createElementVNode("div", _hoisted_21, [
              vue.createElementVNode("button", {
                class: "flex items-center justify-center gap-x-1 bg-primary-600 px-3 py-2 text-xs text-white btn",
                disabled: vue.unref(main).disabled || vue.unref(main).running,
                onClick: _cache[8] || (_cache[8] = //@ts-ignore
                (...args) => vue.unref(main).run && vue.unref(main).run(...args))
              }, [
                vue.unref(main).running ? (vue.openBlock(), vue.createElementBlock("i", _hoisted_23)) : vue.createCommentVNode("", true),
                _cache[21] || (_cache[21] = vue.createTextVNode(" Run It! "))
              ], 8, _hoisted_22)
            ])
          ])
        ]);
      };
    }
  });
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const main = useMainStore();
      const popupVisible = vue.ref(false);
      useEventListener("keydown", (e) => {
        if (e.key === "Escape")
          close();
      });
      if (main.fetchMode === "manual-trigger") {
        vue.watch(popupVisible, (visible) => {
          if (visible) {
            main.refetch();
          }
        });
      }
      function close() {
        if (main.running)
          return;
        popupVisible.value = false;
        main.clearHelper();
      }
      return (_ctx, _cache) => {
        const _component_ControlPanel = _sfc_main$1;
        const _component_PreviewPanel = __unplugin_components_1;
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.unref(main).shouldShowEntry ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(getComponent)()), {
            key: 0,
            onClick: _cache[0] || (_cache[0] = ($event) => popupVisible.value = true)
          })) : vue.createCommentVNode("", true),
          vue.createVNode(vue.Transition, { name: "clip" }, {
            default: vue.withCtx(() => [
              vue.unref(popupVisible) ? (vue.openBlock(), vue.createBlock(_component_ControlPanel, {
                key: 0,
                class: "drive-rename-root"
              })) : vue.createCommentVNode("", true)
            ]),
            _: 1
          }),
          (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
            vue.createVNode(vue.Transition, { name: "fade-left" }, {
              default: vue.withCtx(() => [
                vue.unref(popupVisible) ? (vue.openBlock(), vue.createBlock(_component_PreviewPanel, {
                  key: 0,
                  class: "drive-rename-root"
                })) : vue.createCommentVNode("", true)
              ]),
              _: 1
            })
          ])),
          vue.createVNode(vue.Transition, { name: "fade" }, {
            default: vue.withCtx(() => [
              vue.unref(popupVisible) ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: "fixed inset-0 z-99 backdrop-blur-5",
                onClick: close
              })) : vue.createCommentVNode("", true)
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const ENTRY_ID = "a1mersnow_webdrive_rename";
  const ENTRY_CLASS = "drive-rename-root";
  const oldSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
    setRequestHeader(key, value);
    oldSetHeader.apply(this, [key, value]);
  };
  window.setInterval(() => {
    const { el, front, style } = getContainer();
    if (el)
      init(el, front, style);
  }, 300);
  function init(parentEl, front, style) {
    if (!parentEl.querySelector(`#${ENTRY_ID}`)) {
      const app = vue.createApp(_sfc_main);
      const pinia = createPinia();
      app.use(pinia);
      app.mount(
        (() => {
          if (parentEl && parentEl instanceof HTMLElement)
            parentEl.style.cssText = parentEl.style.cssText + style;
          const appRoot = document.createElement("div");
          appRoot.style.cssText = "display: inline-block;";
          appRoot.setAttribute("id", ENTRY_ID);
          appRoot.classList.add(ENTRY_CLASS);
          if (front)
            parentEl.insertBefore(appRoot, parentEl.firstElementChild);
          else
            parentEl.append(appRoot);
          return appRoot;
        })()
      );
    }
  }

})(Vue, dayjs, md5);