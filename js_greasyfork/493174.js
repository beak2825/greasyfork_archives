// ==UserScript==
// @name         🔥🔥小说下载器，支持部分VIP网站🔥🔥
// @namespace    https://www.softrr.cn/
// @version      1.1.2
// @author       hackhase
// @description  小说一键下载，点击一键下载后，会自动抓取小说章节目录，完成后会打包成zip，小说格式为txt
// @license      MIT
// @icon         https://p1-tt.byteimg.com/origin/novel-static/a3621391ca2e537045168afda6722ee9
// @match        *://fanqienovel.com/page/*
// @match        *://*.dushuge.com/*
// @match        *://*.b5200.net/*
// @match        *://*.bxfanqizha.com/*
// @match        *://*.qimao.com/shuku/*
// @match        *://*.chatgptzw.com/*
// @match        *://*.anshuge.com/files/*
// @match        *://*.biquxs.com/book/*
// @match        *://*.69shuba.pro/book/*
// @match        *://*.rsltxt.me/book/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.js
// @require      data:application/javascript,%3Bwindow.CryptoJS%3DCryptoJS%3B
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.11/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.7.1/dist/index.full.min.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/index.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.7.1/dist/index.css
// @connect      www.softrr.cn
// @connect      fanqienovel.com
// @connect      www.dushuge.com
// @connect      www.b5200.net
// @connect      www.bxfanqizha.com
// @connect      www.qimao.com
// @connect      api-ks.wtzw.com
// @connect      www.chatgptzw.com
// @connect      www.anshuge.com
// @connect      www.biquxs.com
// @connect      www.69shuba.pro
// @connect      www.rsltxt.me
// @connect      fanqie.utuyyt.site
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/493174/%F0%9F%94%A5%F0%9F%94%A5%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%8C%E6%94%AF%E6%8C%81%E9%83%A8%E5%88%86VIP%E7%BD%91%E7%AB%99%F0%9F%94%A5%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/493174/%F0%9F%94%A5%F0%9F%94%A5%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%8C%E6%94%AF%E6%8C%81%E9%83%A8%E5%88%86VIP%E7%BD%91%E7%AB%99%F0%9F%94%A5%F0%9F%94%A5.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const r=document.createElement("style");r.textContent=e,document.head.append(r)})(` @charset "UTF-8";:root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}#app{height:100px}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}:root{--el-color-white:#ffffff;--el-color-black:#000000;--el-color-primary-rgb:64,158,255;--el-color-success-rgb:103,194,58;--el-color-warning-rgb:230,162,60;--el-color-danger-rgb:245,108,108;--el-color-error-rgb:245,108,108;--el-color-info-rgb:144,147,153;--el-font-size-extra-large:20px;--el-font-size-large:18px;--el-font-size-medium:16px;--el-font-size-base:14px;--el-font-size-small:13px;--el-font-size-extra-small:12px;--el-font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\u5FAE\u8F6F\u96C5\u9ED1",Arial,sans-serif;--el-font-weight-primary:500;--el-font-line-height-primary:24px;--el-index-normal:1;--el-index-top:1000;--el-index-popper:2000;--el-border-radius-base:4px;--el-border-radius-small:2px;--el-border-radius-round:20px;--el-border-radius-circle:100%;--el-transition-duration:.3s;--el-transition-duration-fast:.2s;--el-transition-function-ease-in-out-bezier:cubic-bezier(.645,.045,.355,1);--el-transition-function-fast-bezier:cubic-bezier(.23,1,.32,1);--el-transition-all:all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);--el-transition-fade:opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-md-fade:transform var(--el-transition-duration) var(--el-transition-function-fast-bezier),opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-fade-linear:opacity var(--el-transition-duration-fast) linear;--el-transition-border:border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-box-shadow:box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-color:color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-component-size-large:40px;--el-component-size:32px;--el-component-size-small:24px}:root{color-scheme:light;--el-color-primary:#409eff;--el-color-primary-light-3:#79bbff;--el-color-primary-light-5:#a0cfff;--el-color-primary-light-7:#c6e2ff;--el-color-primary-light-8:#d9ecff;--el-color-primary-light-9:#ecf5ff;--el-color-primary-dark-2:#337ecc;--el-color-success:#67c23a;--el-color-success-light-3:#95d475;--el-color-success-light-5:#b3e19d;--el-color-success-light-7:#d1edc4;--el-color-success-light-8:#e1f3d8;--el-color-success-light-9:#f0f9eb;--el-color-success-dark-2:#529b2e;--el-color-warning:#e6a23c;--el-color-warning-light-3:#eebe77;--el-color-warning-light-5:#f3d19e;--el-color-warning-light-7:#f8e3c5;--el-color-warning-light-8:#faecd8;--el-color-warning-light-9:#fdf6ec;--el-color-warning-dark-2:#b88230;--el-color-danger:#f56c6c;--el-color-danger-light-3:#f89898;--el-color-danger-light-5:#fab6b6;--el-color-danger-light-7:#fcd3d3;--el-color-danger-light-8:#fde2e2;--el-color-danger-light-9:#fef0f0;--el-color-danger-dark-2:#c45656;--el-color-error:#f56c6c;--el-color-error-light-3:#f89898;--el-color-error-light-5:#fab6b6;--el-color-error-light-7:#fcd3d3;--el-color-error-light-8:#fde2e2;--el-color-error-light-9:#fef0f0;--el-color-error-dark-2:#c45656;--el-color-info:#909399;--el-color-info-light-3:#b1b3b8;--el-color-info-light-5:#c8c9cc;--el-color-info-light-7:#dedfe0;--el-color-info-light-8:#e9e9eb;--el-color-info-light-9:#f4f4f5;--el-color-info-dark-2:#73767a;--el-bg-color:#ffffff;--el-bg-color-page:#f2f3f5;--el-bg-color-overlay:#ffffff;--el-text-color-primary:#303133;--el-text-color-regular:#606266;--el-text-color-secondary:#909399;--el-text-color-placeholder:#a8abb2;--el-text-color-disabled:#c0c4cc;--el-border-color:#dcdfe6;--el-border-color-light:#e4e7ed;--el-border-color-lighter:#ebeef5;--el-border-color-extra-light:#f2f6fc;--el-border-color-dark:#d4d7de;--el-border-color-darker:#cdd0d6;--el-fill-color:#f0f2f5;--el-fill-color-light:#f5f7fa;--el-fill-color-lighter:#fafafa;--el-fill-color-extra-light:#fafcff;--el-fill-color-dark:#ebedf0;--el-fill-color-darker:#e6e8eb;--el-fill-color-blank:#ffffff;--el-box-shadow:0px 12px 32px 4px rgba(0,0,0,.04),0px 8px 20px rgba(0,0,0,.08);--el-box-shadow-light:0px 0px 12px rgba(0,0,0,.12);--el-box-shadow-lighter:0px 0px 6px rgba(0,0,0,.12);--el-box-shadow-dark:0px 16px 48px 16px rgba(0,0,0,.08),0px 12px 32px rgba(0,0,0,.12),0px 8px 16px -8px rgba(0,0,0,.16);--el-disabled-bg-color:var(--el-fill-color-light);--el-disabled-text-color:var(--el-text-color-placeholder);--el-disabled-border-color:var(--el-border-color-light);--el-overlay-color:rgba(0,0,0,.8);--el-overlay-color-light:rgba(0,0,0,.7);--el-overlay-color-lighter:rgba(0,0,0,.5);--el-mask-color:rgba(255,255,255,.9);--el-mask-color-extra-light:rgba(255,255,255,.3);--el-border-width:1px;--el-border-style:solid;--el-border-color-hover:var(--el-text-color-disabled);--el-border:var(--el-border-width) var(--el-border-style) var(--el-border-color);--el-svg-monochrome-grey:var(--el-border-color)}.fade-in-linear-enter-active,.fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.fade-in-linear-enter-from,.fade-in-linear-leave-to{opacity:0}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.el-fade-in-linear-enter-from,.el-fade-in-linear-leave-to{opacity:0}.el-fade-in-enter-active,.el-fade-in-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-fade-in-enter-from,.el-fade-in-leave-active{opacity:0}.el-zoom-in-center-enter-active,.el-zoom-in-center-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-zoom-in-center-enter-from,.el-zoom-in-center-leave-active{opacity:0;transform:scaleX(0)}.el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;transform:scaleY(1);transform-origin:center top;transition:var(--el-transition-md-fade)}.el-zoom-in-top-enter-active[data-popper-placement^=top],.el-zoom-in-top-leave-active[data-popper-placement^=top]{transform-origin:center bottom}.el-zoom-in-top-enter-from,.el-zoom-in-top-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-bottom-enter-active,.el-zoom-in-bottom-leave-active{opacity:1;transform:scaleY(1);transform-origin:center bottom;transition:var(--el-transition-md-fade)}.el-zoom-in-bottom-enter-from,.el-zoom-in-bottom-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-left-enter-active,.el-zoom-in-left-leave-active{opacity:1;transform:scale(1);transform-origin:top left;transition:var(--el-transition-md-fade)}.el-zoom-in-left-enter-from,.el-zoom-in-left-leave-active{opacity:0;transform:scale(.45)}.collapse-transition{transition:var(--el-transition-duration) height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.el-collapse-transition-enter-active,.el-collapse-transition-leave-active{transition:var(--el-transition-duration) max-height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.horizontal-collapse-transition{transition:var(--el-transition-duration) width ease-in-out,var(--el-transition-duration) padding-left ease-in-out,var(--el-transition-duration) padding-right ease-in-out}.el-list-enter-active,.el-list-leave-active{transition:all 1s}.el-list-enter-from,.el-list-leave-to{opacity:0;transform:translateY(-30px)}.el-list-leave-active{position:absolute!important}.el-opacity-transition{transition:opacity var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-icon-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon--right{margin-left:5px}.el-icon--left{margin-right:5px}@-webkit-keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(1turn)}}.el-icon{--color:inherit;align-items:center;display:inline-flex;height:1em;justify-content:center;line-height:1em;position:relative;width:1em;fill:currentColor;color:var(--color);font-size:inherit}.el-icon.is-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon svg{height:1em;width:1em}.el-progress{align-items:center;display:flex;line-height:1;position:relative}.el-progress__text{color:var(--el-text-color-regular);font-size:14px;line-height:1;margin-left:5px;min-width:50px}.el-progress__text i{display:block;vertical-align:middle}.el-progress--circle,.el-progress--dashboard{display:inline-block}.el-progress--circle .el-progress__text,.el-progress--dashboard .el-progress__text{left:0;margin:0;position:absolute;text-align:center;top:50%;transform:translateY(-50%);width:100%}.el-progress--circle .el-progress__text i,.el-progress--dashboard .el-progress__text i{display:inline-block;vertical-align:middle}.el-progress--without-text .el-progress__text{display:none}.el-progress--without-text .el-progress-bar{display:block;margin-right:0;padding-right:0}.el-progress--text-inside .el-progress-bar{margin-right:0;padding-right:0}.el-progress.is-success .el-progress-bar__inner{background-color:var(--el-color-success)}.el-progress.is-success .el-progress__text{color:var(--el-color-success)}.el-progress.is-warning .el-progress-bar__inner{background-color:var(--el-color-warning)}.el-progress.is-warning .el-progress__text{color:var(--el-color-warning)}.el-progress.is-exception .el-progress-bar__inner{background-color:var(--el-color-danger)}.el-progress.is-exception .el-progress__text{color:var(--el-color-danger)}.el-progress-bar{box-sizing:border-box;flex-grow:1}.el-progress-bar__outer{background-color:var(--el-border-color-lighter);border-radius:100px;height:6px;overflow:hidden;position:relative;vertical-align:middle}.el-progress-bar__inner{background-color:var(--el-color-primary);border-radius:100px;height:100%;left:0;line-height:1;position:absolute;text-align:right;top:0;transition:width .6s ease;white-space:nowrap}.el-progress-bar__inner:after{content:"";display:inline-block;height:100%;vertical-align:middle}.el-progress-bar__inner--indeterminate{-webkit-animation:indeterminate 3s infinite;animation:indeterminate 3s infinite;transform:translateZ(0)}.el-progress-bar__inner--striped{background-image:linear-gradient(45deg,rgba(0,0,0,.1) 25%,transparent 0,transparent 50%,rgba(0,0,0,.1) 0,rgba(0,0,0,.1) 75%,transparent 0,transparent);background-size:1.25em 1.25em}.el-progress-bar__inner--striped.el-progress-bar__inner--striped-flow{-webkit-animation:striped-flow 3s linear infinite;animation:striped-flow 3s linear infinite}.el-progress-bar__innerText{color:#fff;display:inline-block;font-size:12px;margin:0 5px;vertical-align:middle}@-webkit-keyframes progress{0%{background-position:0 0}to{background-position:32px 0}}@keyframes progress{0%{background-position:0 0}to{background-position:32px 0}}@-webkit-keyframes indeterminate{0%{left:-100%}to{left:100%}}@keyframes indeterminate{0%{left:-100%}to{left:100%}}@-webkit-keyframes striped-flow{0%{background-position:-100%}to{background-position:100%}}@keyframes striped-flow{0%{background-position:-100%}to{background-position:100%}}.el-textarea{--el-input-text-color:var(--el-text-color-regular);--el-input-border:var(--el-border);--el-input-hover-border:var(--el-border-color-hover);--el-input-focus-border:var(--el-color-primary);--el-input-transparent-border:0 0 0 1px transparent inset;--el-input-border-color:var(--el-border-color);--el-input-border-radius:var(--el-border-radius-base);--el-input-bg-color:var(--el-fill-color-blank);--el-input-icon-color:var(--el-text-color-placeholder);--el-input-placeholder-color:var(--el-text-color-placeholder);--el-input-hover-border-color:var(--el-border-color-hover);--el-input-clear-hover-color:var(--el-text-color-secondary);--el-input-focus-border-color:var(--el-color-primary);--el-input-width:100%;display:inline-block;font-size:var(--el-font-size-base);position:relative;vertical-align:bottom;width:100%}.el-textarea__inner{-webkit-appearance:none;background-color:var(--el-input-bg-color,var(--el-fill-color-blank));background-image:none;border:none;border-radius:var(--el-input-border-radius,var(--el-border-radius-base));box-shadow:0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;box-sizing:border-box;color:var(--el-input-text-color,var(--el-text-color-regular));display:block;font-family:inherit;font-size:inherit;line-height:1.5;padding:5px 11px;position:relative;resize:vertical;transition:var(--el-transition-box-shadow);width:100%}.el-textarea__inner::-moz-placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-textarea__inner:-ms-input-placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-textarea__inner::placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-textarea__inner:hover{box-shadow:0 0 0 1px var(--el-input-hover-border-color) inset}.el-textarea__inner:focus{box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset;outline:none}.el-textarea .el-input__count{background:var(--el-fill-color-blank);bottom:5px;color:var(--el-color-info);font-size:12px;line-height:14px;position:absolute;right:10px}.el-textarea.is-disabled .el-textarea__inner{background-color:var(--el-disabled-bg-color);box-shadow:0 0 0 1px var(--el-disabled-border-color) inset;color:var(--el-disabled-text-color);cursor:not-allowed}.el-textarea.is-disabled .el-textarea__inner::-moz-placeholder{color:var(--el-text-color-placeholder)}.el-textarea.is-disabled .el-textarea__inner:-ms-input-placeholder{color:var(--el-text-color-placeholder)}.el-textarea.is-disabled .el-textarea__inner::placeholder{color:var(--el-text-color-placeholder)}.el-textarea.is-exceed .el-textarea__inner{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-textarea.is-exceed .el-input__count{color:var(--el-color-danger)}.el-input{--el-input-text-color:var(--el-text-color-regular);--el-input-border:var(--el-border);--el-input-hover-border:var(--el-border-color-hover);--el-input-focus-border:var(--el-color-primary);--el-input-transparent-border:0 0 0 1px transparent inset;--el-input-border-color:var(--el-border-color);--el-input-border-radius:var(--el-border-radius-base);--el-input-bg-color:var(--el-fill-color-blank);--el-input-icon-color:var(--el-text-color-placeholder);--el-input-placeholder-color:var(--el-text-color-placeholder);--el-input-hover-border-color:var(--el-border-color-hover);--el-input-clear-hover-color:var(--el-text-color-secondary);--el-input-focus-border-color:var(--el-color-primary);--el-input-width:100%;--el-input-height:var(--el-component-size);box-sizing:border-box;display:inline-flex;font-size:var(--el-font-size-base);line-height:var(--el-input-height);position:relative;vertical-align:middle;width:var(--el-input-width)}.el-input::-webkit-scrollbar{width:6px;z-index:11}.el-input::-webkit-scrollbar:horizontal{height:6px}.el-input::-webkit-scrollbar-thumb{background:var(--el-text-color-disabled);border-radius:5px;width:6px}.el-input::-webkit-scrollbar-corner,.el-input::-webkit-scrollbar-track{background:var(--el-fill-color-blank)}.el-input::-webkit-scrollbar-track-piece{background:var(--el-fill-color-blank);width:6px}.el-input .el-input__clear,.el-input .el-input__password{color:var(--el-input-icon-color);cursor:pointer;font-size:14px}.el-input .el-input__clear:hover,.el-input .el-input__password:hover{color:var(--el-input-clear-hover-color)}.el-input .el-input__count{align-items:center;color:var(--el-color-info);display:inline-flex;font-size:12px;height:100%}.el-input .el-input__count .el-input__count-inner{background:var(--el-fill-color-blank);display:inline-block;line-height:normal;padding-left:8px}.el-input__wrapper{align-items:center;background-color:var(--el-input-bg-color,var(--el-fill-color-blank));background-image:none;border-radius:var(--el-input-border-radius,var(--el-border-radius-base));box-shadow:0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;cursor:text;display:inline-flex;flex-grow:1;justify-content:center;padding:1px 11px;transform:translateZ(0);transition:var(--el-transition-box-shadow)}.el-input__wrapper:hover{box-shadow:0 0 0 1px var(--el-input-hover-border-color) inset}.el-input__wrapper.is-focus{box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset}.el-input__inner{--el-input-inner-height:calc(var(--el-input-height, 32px) - 2px);-webkit-appearance:none;background:none;border:none;box-sizing:border-box;color:var(--el-input-text-color,var(--el-text-color-regular));flex-grow:1;font-size:inherit;height:var(--el-input-inner-height);line-height:var(--el-input-inner-height);outline:none;padding:0;width:100%}.el-input__inner:focus{outline:none}.el-input__inner::-moz-placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-input__inner:-ms-input-placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-input__inner::placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-input__inner[type=password]::-ms-reveal{display:none}.el-input__inner[type=number]{line-height:1}.el-input__prefix{color:var(--el-input-icon-color,var(--el-text-color-placeholder));display:inline-flex;flex-shrink:0;flex-wrap:nowrap;height:100%;pointer-events:none;text-align:center;transition:all var(--el-transition-duration);white-space:nowrap}.el-input__prefix-inner{align-items:center;display:inline-flex;justify-content:center;pointer-events:all}.el-input__prefix-inner>:last-child{margin-right:8px}.el-input__prefix-inner>:first-child,.el-input__prefix-inner>:first-child.el-input__icon{margin-left:0}.el-input__suffix{color:var(--el-input-icon-color,var(--el-text-color-placeholder));display:inline-flex;flex-shrink:0;flex-wrap:nowrap;height:100%;pointer-events:none;text-align:center;transition:all var(--el-transition-duration);white-space:nowrap}.el-input__suffix-inner{align-items:center;display:inline-flex;justify-content:center;pointer-events:all}.el-input__suffix-inner>:first-child{margin-left:8px}.el-input .el-input__icon{align-items:center;display:flex;height:inherit;justify-content:center;line-height:inherit;margin-left:8px;transition:all var(--el-transition-duration)}.el-input__validateIcon{pointer-events:none}.el-input.is-active .el-input__wrapper{box-shadow:0 0 0 1px var(--el-input-focus-color, ) inset}.el-input.is-disabled{cursor:not-allowed}.el-input.is-disabled .el-input__wrapper{background-color:var(--el-disabled-bg-color);box-shadow:0 0 0 1px var(--el-disabled-border-color) inset}.el-input.is-disabled .el-input__inner{color:var(--el-disabled-text-color);-webkit-text-fill-color:var(--el-disabled-text-color);cursor:not-allowed}.el-input.is-disabled .el-input__inner::-moz-placeholder{color:var(--el-text-color-placeholder)}.el-input.is-disabled .el-input__inner:-ms-input-placeholder{color:var(--el-text-color-placeholder)}.el-input.is-disabled .el-input__inner::placeholder{color:var(--el-text-color-placeholder)}.el-input.is-disabled .el-input__icon{cursor:not-allowed}.el-input.is-exceed .el-input__wrapper{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-input.is-exceed .el-input__suffix .el-input__count{color:var(--el-color-danger)}.el-input--large{--el-input-height:var(--el-component-size-large);font-size:14px}.el-input--large .el-input__wrapper{padding:1px 15px}.el-input--large .el-input__inner{--el-input-inner-height:calc(var(--el-input-height, 40px) - 2px)}.el-input--small{--el-input-height:var(--el-component-size-small);font-size:12px}.el-input--small .el-input__wrapper{padding:1px 7px}.el-input--small .el-input__inner{--el-input-inner-height:calc(var(--el-input-height, 24px) - 2px)}.el-input-group{align-items:stretch;display:inline-flex;width:100%}.el-input-group__append,.el-input-group__prepend{align-items:center;background-color:var(--el-fill-color-light);border-radius:var(--el-input-border-radius);color:var(--el-color-info);display:inline-flex;justify-content:center;min-height:100%;padding:0 20px;position:relative;white-space:nowrap}.el-input-group__append:focus,.el-input-group__prepend:focus{outline:none}.el-input-group__append .el-button,.el-input-group__append .el-select,.el-input-group__prepend .el-button,.el-input-group__prepend .el-select{display:inline-block;margin:0 -20px}.el-input-group__append button.el-button,.el-input-group__append button.el-button:hover,.el-input-group__append div.el-select .el-select__wrapper,.el-input-group__append div.el-select:hover .el-select__wrapper,.el-input-group__prepend button.el-button,.el-input-group__prepend button.el-button:hover,.el-input-group__prepend div.el-select .el-select__wrapper,.el-input-group__prepend div.el-select:hover .el-select__wrapper{background-color:transparent;border-color:transparent;color:inherit}.el-input-group__append .el-button,.el-input-group__append .el-input,.el-input-group__prepend .el-button,.el-input-group__prepend .el-input{font-size:inherit}.el-input-group__prepend{border-bottom-right-radius:0;border-right:0;border-top-right-radius:0;box-shadow:1px 0 0 0 var(--el-input-border-color) inset,0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset}.el-input-group__append{border-bottom-left-radius:0;border-left:0;border-top-left-radius:0;box-shadow:0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset,-1px 0 0 0 var(--el-input-border-color) inset}.el-input-group--prepend>.el-input__wrapper{border-bottom-left-radius:0;border-top-left-radius:0}.el-input-group--prepend .el-input-group__prepend .el-select .el-select__wrapper{border-bottom-right-radius:0;border-top-right-radius:0;box-shadow:1px 0 0 0 var(--el-input-border-color) inset,0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset}.el-input-group--append>.el-input__wrapper{border-bottom-right-radius:0;border-top-right-radius:0}.el-input-group--append .el-input-group__append .el-select .el-select__wrapper{border-bottom-left-radius:0;border-top-left-radius:0;box-shadow:0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset,-1px 0 0 0 var(--el-input-border-color) inset}.el-input-hidden{display:none!important}.el-tag{--el-tag-font-size:12px;--el-tag-border-radius:4px;--el-tag-border-radius-rounded:9999px;--el-tag-bg-color:var(--el-color-primary-light-9);--el-tag-border-color:var(--el-color-primary-light-8);--el-tag-hover-color:var(--el-color-primary);align-items:center;background-color:var(--el-tag-bg-color);border-color:var(--el-tag-border-color);border-radius:var(--el-tag-border-radius);border-style:solid;border-width:1px;box-sizing:border-box;color:var(--el-tag-text-color);display:inline-flex;font-size:var(--el-tag-font-size);height:24px;justify-content:center;line-height:1;padding:0 9px;vertical-align:middle;white-space:nowrap;--el-icon-size:14px}.el-tag.el-tag--primary{--el-tag-bg-color:var(--el-color-primary-light-9);--el-tag-border-color:var(--el-color-primary-light-8);--el-tag-hover-color:var(--el-color-primary)}.el-tag.el-tag--success{--el-tag-bg-color:var(--el-color-success-light-9);--el-tag-border-color:var(--el-color-success-light-8);--el-tag-hover-color:var(--el-color-success)}.el-tag.el-tag--warning{--el-tag-bg-color:var(--el-color-warning-light-9);--el-tag-border-color:var(--el-color-warning-light-8);--el-tag-hover-color:var(--el-color-warning)}.el-tag.el-tag--danger{--el-tag-bg-color:var(--el-color-danger-light-9);--el-tag-border-color:var(--el-color-danger-light-8);--el-tag-hover-color:var(--el-color-danger)}.el-tag.el-tag--error{--el-tag-bg-color:var(--el-color-error-light-9);--el-tag-border-color:var(--el-color-error-light-8);--el-tag-hover-color:var(--el-color-error)}.el-tag.el-tag--info{--el-tag-bg-color:var(--el-color-info-light-9);--el-tag-border-color:var(--el-color-info-light-8);--el-tag-hover-color:var(--el-color-info)}.el-tag.el-tag--primary{--el-tag-text-color:var(--el-color-primary)}.el-tag.el-tag--success{--el-tag-text-color:var(--el-color-success)}.el-tag.el-tag--warning{--el-tag-text-color:var(--el-color-warning)}.el-tag.el-tag--danger{--el-tag-text-color:var(--el-color-danger)}.el-tag.el-tag--error{--el-tag-text-color:var(--el-color-error)}.el-tag.el-tag--info{--el-tag-text-color:var(--el-color-info)}.el-tag.is-hit{border-color:var(--el-color-primary)}.el-tag.is-round{border-radius:var(--el-tag-border-radius-rounded)}.el-tag .el-tag__close{color:var(--el-tag-text-color);flex-shrink:0}.el-tag .el-tag__close:hover{background-color:var(--el-tag-hover-color);color:var(--el-color-white)}.el-tag .el-icon{border-radius:50%;cursor:pointer;font-size:calc(var(--el-icon-size) - 2px);height:var(--el-icon-size);width:var(--el-icon-size)}.el-tag .el-tag__close{margin-left:6px}.el-tag--dark{--el-tag-bg-color:var(--el-color-primary);--el-tag-border-color:var(--el-color-primary);--el-tag-hover-color:var(--el-color-primary-light-3);--el-tag-text-color:var(--el-color-white)}.el-tag--dark.el-tag--primary{--el-tag-bg-color:var(--el-color-primary);--el-tag-border-color:var(--el-color-primary);--el-tag-hover-color:var(--el-color-primary-light-3)}.el-tag--dark.el-tag--success{--el-tag-bg-color:var(--el-color-success);--el-tag-border-color:var(--el-color-success);--el-tag-hover-color:var(--el-color-success-light-3)}.el-tag--dark.el-tag--warning{--el-tag-bg-color:var(--el-color-warning);--el-tag-border-color:var(--el-color-warning);--el-tag-hover-color:var(--el-color-warning-light-3)}.el-tag--dark.el-tag--danger{--el-tag-bg-color:var(--el-color-danger);--el-tag-border-color:var(--el-color-danger);--el-tag-hover-color:var(--el-color-danger-light-3)}.el-tag--dark.el-tag--error{--el-tag-bg-color:var(--el-color-error);--el-tag-border-color:var(--el-color-error);--el-tag-hover-color:var(--el-color-error-light-3)}.el-tag--dark.el-tag--info{--el-tag-bg-color:var(--el-color-info);--el-tag-border-color:var(--el-color-info);--el-tag-hover-color:var(--el-color-info-light-3)}.el-tag--dark.el-tag--danger,.el-tag--dark.el-tag--error,.el-tag--dark.el-tag--info,.el-tag--dark.el-tag--primary,.el-tag--dark.el-tag--success,.el-tag--dark.el-tag--warning{--el-tag-text-color:var(--el-color-white)}.el-tag--plain{--el-tag-border-color:var(--el-color-primary-light-5);--el-tag-hover-color:var(--el-color-primary);--el-tag-bg-color:var(--el-fill-color-blank)}.el-tag--plain.el-tag--primary{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-primary-light-5);--el-tag-hover-color:var(--el-color-primary)}.el-tag--plain.el-tag--success{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-success-light-5);--el-tag-hover-color:var(--el-color-success)}.el-tag--plain.el-tag--warning{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-warning-light-5);--el-tag-hover-color:var(--el-color-warning)}.el-tag--plain.el-tag--danger{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-danger-light-5);--el-tag-hover-color:var(--el-color-danger)}.el-tag--plain.el-tag--error{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-error-light-5);--el-tag-hover-color:var(--el-color-error)}.el-tag--plain.el-tag--info{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-info-light-5);--el-tag-hover-color:var(--el-color-info)}.el-tag.is-closable{padding-right:5px}.el-tag--large{height:32px;padding:0 11px;--el-icon-size:16px}.el-tag--large .el-tag__close{margin-left:8px}.el-tag--large.is-closable{padding-right:7px}.el-tag--small{height:20px;padding:0 7px;--el-icon-size:12px}.el-tag--small .el-tag__close{margin-left:4px}.el-tag--small.is-closable{padding-right:3px}.el-tag--small .el-icon-close{transform:scale(.8)}.el-tag.el-tag--primary.is-hit{border-color:var(--el-color-primary)}.el-tag.el-tag--success.is-hit{border-color:var(--el-color-success)}.el-tag.el-tag--warning.is-hit{border-color:var(--el-color-warning)}.el-tag.el-tag--danger.is-hit{border-color:var(--el-color-danger)}.el-tag.el-tag--error.is-hit{border-color:var(--el-color-error)}.el-tag.el-tag--info.is-hit{border-color:var(--el-color-info)}.el-select-dropdown.is-multiple .el-select-dropdown__item.is-selected:after{background-color:var(--el-color-primary);background-position:50%;background-repeat:no-repeat;border-right:none;border-top:none;content:"";height:12px;mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;mask-size:100% 100%;-webkit-mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;-webkit-mask-size:100% 100%;position:absolute;right:20px;top:50%;transform:translateY(-50%);width:12px}.el-scrollbar{--el-scrollbar-opacity:.3;--el-scrollbar-bg-color:var(--el-text-color-secondary);--el-scrollbar-hover-opacity:.5;--el-scrollbar-hover-bg-color:var(--el-text-color-secondary);height:100%;overflow:hidden;position:relative}.el-scrollbar__wrap{height:100%;overflow:auto}.el-scrollbar__wrap--hidden-default{scrollbar-width:none}.el-scrollbar__wrap--hidden-default::-webkit-scrollbar{display:none}.el-scrollbar__thumb{background-color:var(--el-scrollbar-bg-color,var(--el-text-color-secondary));border-radius:inherit;cursor:pointer;display:block;height:0;opacity:var(--el-scrollbar-opacity,.3);position:relative;transition:var(--el-transition-duration) background-color;width:0}.el-scrollbar__thumb:hover{background-color:var(--el-scrollbar-hover-bg-color,var(--el-text-color-secondary));opacity:var(--el-scrollbar-hover-opacity,.5)}.el-scrollbar__bar{border-radius:4px;bottom:2px;position:absolute;right:2px;z-index:1}.el-scrollbar__bar.is-vertical{top:2px;width:6px}.el-scrollbar__bar.is-vertical>div{width:100%}.el-scrollbar__bar.is-horizontal{height:6px;left:2px}.el-scrollbar__bar.is-horizontal>div{height:100%}.el-scrollbar-fade-enter-active{transition:opacity .34s ease-out}.el-scrollbar-fade-leave-active{transition:opacity .12s ease-out}.el-scrollbar-fade-enter-from,.el-scrollbar-fade-leave-active{opacity:0}.el-popper{--el-popper-border-radius:var(--el-popover-border-radius,4px);border-radius:var(--el-popper-border-radius);font-size:12px;line-height:20px;min-width:10px;overflow-wrap:break-word;padding:5px 11px;position:absolute;visibility:visible;z-index:2000}.el-popper.is-dark{background:var(--el-text-color-primary);border:1px solid var(--el-text-color-primary);color:var(--el-bg-color)}.el-popper.is-dark .el-popper__arrow:before{background:var(--el-text-color-primary);border:1px solid var(--el-text-color-primary);right:0}.el-popper.is-light{background:var(--el-bg-color-overlay);border:1px solid var(--el-border-color-light)}.el-popper.is-light .el-popper__arrow:before{background:var(--el-bg-color-overlay);border:1px solid var(--el-border-color-light);right:0}.el-popper.is-pure{padding:0}.el-popper__arrow{height:10px;position:absolute;width:10px;z-index:-1}.el-popper__arrow:before{background:var(--el-text-color-primary);box-sizing:border-box;content:" ";height:10px;position:absolute;transform:rotate(45deg);width:10px;z-index:-1}.el-popper[data-popper-placement^=top]>.el-popper__arrow{bottom:-5px}.el-popper[data-popper-placement^=top]>.el-popper__arrow:before{border-bottom-right-radius:2px}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow{top:-5px}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow:before{border-top-left-radius:2px}.el-popper[data-popper-placement^=left]>.el-popper__arrow{right:-5px}.el-popper[data-popper-placement^=left]>.el-popper__arrow:before{border-top-right-radius:2px}.el-popper[data-popper-placement^=right]>.el-popper__arrow{left:-5px}.el-popper[data-popper-placement^=right]>.el-popper__arrow:before{border-bottom-left-radius:2px}.el-popper[data-popper-placement^=top] .el-popper__arrow:before{border-left-color:transparent!important;border-top-color:transparent!important}.el-popper[data-popper-placement^=bottom] .el-popper__arrow:before{border-bottom-color:transparent!important;border-right-color:transparent!important}.el-popper[data-popper-placement^=left] .el-popper__arrow:before{border-bottom-color:transparent!important;border-left-color:transparent!important}.el-popper[data-popper-placement^=right] .el-popper__arrow:before{border-right-color:transparent!important;border-top-color:transparent!important}.el-select-dropdown{border-radius:var(--el-border-radius-base);box-sizing:border-box;z-index:calc(var(--el-index-top) + 1)}.el-select-dropdown .el-scrollbar.is-empty .el-select-dropdown__list{padding:0}.el-select-dropdown__empty,.el-select-dropdown__loading{color:var(--el-text-color-secondary);font-size:var(--el-select-font-size);margin:0;padding:10px 0;text-align:center}.el-select-dropdown__wrap{max-height:274px}.el-select-dropdown__list{box-sizing:border-box;list-style:none;margin:0;padding:6px 0}.el-select-dropdown__list.el-vl__window{margin:6px 0;padding:0}.el-select-dropdown__header{border-bottom:1px solid var(--el-border-color-light);padding:10px}.el-select-dropdown__footer{border-top:1px solid var(--el-border-color-light);padding:10px}.el-select-dropdown__item{box-sizing:border-box;color:var(--el-text-color-regular);cursor:pointer;font-size:var(--el-font-size-base);height:34px;line-height:34px;overflow:hidden;padding:0 32px 0 20px;position:relative;text-overflow:ellipsis;white-space:nowrap}.el-select-dropdown__item.is-hovering{background-color:var(--el-fill-color-light)}.el-select-dropdown__item.is-selected{color:var(--el-color-primary);font-weight:700}.el-select-dropdown__item.is-disabled{background-color:unset;color:var(--el-text-color-placeholder);cursor:not-allowed}.el-select-dropdown.is-multiple .el-select-dropdown__item.is-selected:after{background-color:var(--el-color-primary);background-position:50%;background-repeat:no-repeat;border-right:none;border-top:none;content:"";height:12px;mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;mask-size:100% 100%;-webkit-mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;-webkit-mask-size:100% 100%;position:absolute;right:20px;top:50%;transform:translateY(-50%);width:12px}.el-select-dropdown.is-multiple .el-select-dropdown__item.is-disabled:after{background-color:var(--el-text-color-placeholder)}.el-select-group{margin:0;padding:0}.el-select-group__wrap{list-style:none;margin:0;padding:0;position:relative}.el-select-group__wrap:not(:last-of-type){padding-bottom:24px}.el-select-group__wrap:not(:last-of-type):after{background:var(--el-border-color-light);bottom:12px;content:"";display:block;height:1px;left:20px;position:absolute;right:20px}.el-select-group__split-dash{background:var(--el-border-color-light);height:1px;left:20px;position:absolute;right:20px}.el-select-group__title{color:var(--el-color-info);font-size:12px;line-height:30px;padding-left:20px}.el-select-group .el-select-dropdown__item{padding-left:20px}.el-select{--el-select-border-color-hover:var(--el-border-color-hover);--el-select-disabled-color:var(--el-disabled-text-color);--el-select-disabled-border:var(--el-disabled-border-color);--el-select-font-size:var(--el-font-size-base);--el-select-close-hover-color:var(--el-text-color-secondary);--el-select-input-color:var(--el-text-color-placeholder);--el-select-multiple-input-color:var(--el-text-color-regular);--el-select-input-focus-border-color:var(--el-color-primary);--el-select-input-font-size:14px;--el-select-width:100%;display:inline-block;position:relative;vertical-align:middle;width:var(--el-select-width)}.el-select__wrapper{align-items:center;background-color:var(--el-fill-color-blank);border-radius:var(--el-border-radius-base);box-shadow:0 0 0 1px var(--el-border-color) inset;box-sizing:border-box;cursor:pointer;display:flex;font-size:14px;gap:6px;line-height:24px;min-height:32px;padding:4px 12px;position:relative;text-align:left;transition:var(--el-transition-duration)}.el-select__wrapper:hover{box-shadow:0 0 0 1px var(--el-text-color) inset}.el-select__wrapper.is-filterable{cursor:text}.el-select__wrapper.is-focused{box-shadow:0 0 0 1px var(--el-color-primary) inset}.el-select__wrapper.is-hovering:not(.is-focused){box-shadow:0 0 0 1px var(--el-border-color-hover) inset}.el-select__wrapper.is-disabled{background-color:var(--el-fill-color-light);box-shadow:0 0 0 1px var(--el-select-disabled-border) inset;color:var(--el-text-color-placeholder);cursor:not-allowed}.el-select__wrapper.is-disabled:hover{box-shadow:0 0 0 1px var(--el-select-disabled-border) inset}.el-select__wrapper.is-disabled.is-focus{box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset}.el-select__wrapper.is-disabled .el-select__selected-item{color:var(--el-select-disabled-color)}.el-select__wrapper.is-disabled .el-select__caret,.el-select__wrapper.is-disabled .el-tag{cursor:not-allowed}.el-select__prefix,.el-select__suffix{align-items:center;color:var(--el-input-icon-color,var(--el-text-color-placeholder));display:flex;flex-shrink:0;gap:6px}.el-select__caret{color:var(--el-select-input-color);cursor:pointer;font-size:var(--el-select-input-font-size);transform:rotate(0);transition:var(--el-transition-duration)}.el-select__caret.is-reverse{transform:rotate(180deg)}.el-select__selection{align-items:center;display:flex;flex:1;flex-wrap:wrap;gap:6px;min-width:0;position:relative}.el-select__selection.is-near{margin-left:-8px}.el-select__selection .el-tag{border-color:transparent;cursor:pointer}.el-select__selection .el-tag .el-tag__content{min-width:0}.el-select__selected-item{display:flex;flex-wrap:wrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.el-select__tags-text{line-height:normal}.el-select__placeholder,.el-select__tags-text{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.el-select__placeholder{color:var(--el-input-text-color,var(--el-text-color-regular));position:absolute;top:50%;transform:translateY(-50%);width:100%}.el-select__placeholder.is-transparent{color:var(--el-text-color-placeholder);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.el-select__popper.el-popper{background:var(--el-bg-color-overlay);border:1px solid var(--el-border-color-light);box-shadow:var(--el-box-shadow-light)}.el-select__popper.el-popper .el-popper__arrow:before{border:1px solid var(--el-border-color-light)}.el-select__popper.el-popper[data-popper-placement^=top] .el-popper__arrow:before{border-left-color:transparent;border-top-color:transparent}.el-select__popper.el-popper[data-popper-placement^=bottom] .el-popper__arrow:before{border-bottom-color:transparent;border-right-color:transparent}.el-select__popper.el-popper[data-popper-placement^=left] .el-popper__arrow:before{border-bottom-color:transparent;border-left-color:transparent}.el-select__popper.el-popper[data-popper-placement^=right] .el-popper__arrow:before{border-right-color:transparent;border-top-color:transparent}.el-select__input-wrapper{max-width:100%}.el-select__input-wrapper.is-hidden{opacity:0;position:absolute}.el-select__input{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border:none;color:var(--el-select-multiple-input-color);font-family:inherit;font-size:inherit;height:24px;max-width:100%;outline:none;padding:0}.el-select__input.is-disabled{cursor:not-allowed}.el-select__input-calculator{left:0;max-width:100%;overflow:hidden;position:absolute;top:0;visibility:hidden;white-space:pre}.el-select--large .el-select__wrapper{font-size:14px;gap:6px;line-height:24px;min-height:40px;padding:8px 16px}.el-select--large .el-select__selection{gap:6px}.el-select--large .el-select__selection.is-near{margin-left:-8px}.el-select--large .el-select__prefix,.el-select--large .el-select__suffix{gap:6px}.el-select--large .el-select__input{height:24px}.el-select--small .el-select__wrapper{font-size:12px;gap:4px;line-height:20px;min-height:24px;padding:2px 8px}.el-select--small .el-select__selection{gap:4px}.el-select--small .el-select__selection.is-near{margin-left:-6px}.el-select--small .el-select__prefix,.el-select--small .el-select__suffix{gap:4px}.el-select--small .el-select__input{height:20px}.modal-wrapper[data-v-b425a440]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000080;display:flex;justify-content:center;align-items:center;z-index:9999}.modal_code[data-v-b425a440]{background-color:#fff;padding:20px;border-radius:5px}.header[data-v-b425a440]{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.header h2[data-v-b425a440]{margin:0;font-size:20px;font-weight:700}.header button[data-v-b425a440]{border:none;background-color:transparent;font-size:20px;cursor:pointer}.content[data-v-b425a440]{max-height:400px;overflow:auto;font-size:16px;display:flex;justify-content:space-between}.content .produce p[data-v-b425a440]{margin-top:15px}.content .produce .ipt[data-v-b425a440]{margin-top:15px;height:30px;border-radius:5px;padding-left:10px}.content .img[data-v-b425a440]{display:flex;align-items:center;justify-content:center}.content .img img[data-v-b425a440]{width:180px}input[data-v-b425a440]::-webkit-input-placeholder{color:#aab2bd;font-size:14px;padding-left:5px}.downLoad_container[data-v-2ccb0a6f]{width:160px;position:fixed;right:10px;top:80px;color:#111;z-index:999;display:flex;flex-direction:column;justify-content:center;align-items:center}.downLoad_container .down[data-v-2ccb0a6f]{margin-top:10px;margin-bottom:10px;width:100px;height:30px;font-size:14px;background-color:red;color:#fff;border-radius:10%;z-index:999;display:flex;justify-content:center;align-content:center}.downLoad_container .down[data-v-2ccb0a6f]:hover{background-color:#87ceeb;color:#fff} `);

(async function (vue, elementPlus, CryptoJS) {
  'use strict';

  const composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
    const handleEvent = (event) => {
      const shouldPrevent = theirsHandler == null ? void 0 : theirsHandler(event);
      if (checkForDefaultPrevented === false || !shouldPrevent) {
        return oursHandler == null ? void 0 : oursHandler(event);
      }
    };
    return handleEvent;
  };
  var _a;
  const isClient = typeof window !== "undefined";
  const isString$1 = (val) => typeof val === "string";
  const noop = () => {
  };
  const isIOS = isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function resolveUnref(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  function identity$1(arg) {
    return arg;
  }
  function tryOnScopeDispose(fn2) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn2);
      return true;
    }
    return false;
  }
  function tryOnMounted(fn2, sync = true) {
    if (vue.getCurrentInstance())
      vue.onMounted(fn2);
    else if (sync)
      fn2();
    else
      vue.nextTick(fn2);
  }
  function unrefElement(elRef) {
    var _a2;
    const plain = resolveUnref(elRef);
    return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  function useEventListener(...args) {
    let target;
    let events;
    let listeners;
    let options;
    if (isString$1(args[0]) || Array.isArray(args[0])) {
      [events, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events, listeners, options] = args;
    }
    if (!target)
      return noop;
    if (!Array.isArray(events))
      events = [events];
    if (!Array.isArray(listeners))
      listeners = [listeners];
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn2) => fn2());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options2) => {
      el.addEventListener(event, listener, options2);
      return () => el.removeEventListener(event, listener, options2);
    };
    const stopWatch = vue.watch(() => [unrefElement(target), resolveUnref(options)], ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      cleanups.push(...events.flatMap((event) => {
        return listeners.map((listener) => register(el, event, listener, options2));
      }));
    }, { immediate: true, flush: "post" });
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return stop;
  }
  let _iOSWorkaround = false;
  function onClickOutside(target, handler, options = {}) {
    const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
    if (!window2)
      return;
    if (isIOS && !_iOSWorkaround) {
      _iOSWorkaround = true;
      Array.from(window2.document.body.children).forEach((el) => el.addEventListener("click", noop));
    }
    let shouldListen = true;
    const shouldIgnore = (event) => {
      return ignore.some((target2) => {
        if (typeof target2 === "string") {
          return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
        } else {
          const el = unrefElement(target2);
          return el && (event.target === el || event.composedPath().includes(el));
        }
      });
    };
    const listener = (event) => {
      const el = unrefElement(target);
      if (!el || el === event.target || event.composedPath().includes(el))
        return;
      if (event.detail === 0)
        shouldListen = !shouldIgnore(event);
      if (!shouldListen) {
        shouldListen = true;
        return;
      }
      handler(event);
    };
    const cleanup = [
      useEventListener(window2, "click", listener, { passive: true, capture }),
      useEventListener(window2, "pointerdown", (e) => {
        const el = unrefElement(target);
        if (el)
          shouldListen = !e.composedPath().includes(el) && !shouldIgnore(e);
      }, { passive: true }),
      detectIframe && useEventListener(window2, "blur", (event) => {
        var _a2;
        const el = unrefElement(target);
        if (((_a2 = window2.document.activeElement) == null ? void 0 : _a2.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement)))
          handler(event);
      })
    ].filter(Boolean);
    const stop = () => cleanup.forEach((fn2) => fn2());
    return stop;
  }
  function useSupported(callback, sync = false) {
    const isSupported = vue.ref();
    const update = () => isSupported.value = Boolean(callback());
    update();
    tryOnMounted(update, sync);
    return isSupported;
  }
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  _global[globalKey] = _global[globalKey] || {};
  var __getOwnPropSymbols$g = Object.getOwnPropertySymbols;
  var __hasOwnProp$g = Object.prototype.hasOwnProperty;
  var __propIsEnum$g = Object.prototype.propertyIsEnumerable;
  var __objRest$2 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$g.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$g)
      for (var prop of __getOwnPropSymbols$g(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$g.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function useResizeObserver(target, callback, options = {}) {
    const _a2 = options, { window: window2 = defaultWindow } = _a2, observerOptions = __objRest$2(_a2, ["window"]);
    let observer;
    const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = vue.watch(() => unrefElement(target), (el) => {
      cleanup();
      if (isSupported.value && window2 && el) {
        observer = new ResizeObserver(callback);
        observer.observe(el, observerOptions);
      }
    }, { immediate: true, flush: "post" });
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop
    };
  }
  var __getOwnPropSymbols$8 = Object.getOwnPropertySymbols;
  var __hasOwnProp$8 = Object.prototype.hasOwnProperty;
  var __propIsEnum$8 = Object.prototype.propertyIsEnumerable;
  var __objRest$1 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$8.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$8)
      for (var prop of __getOwnPropSymbols$8(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$8.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function useMutationObserver(target, callback, options = {}) {
    const _a2 = options, { window: window2 = defaultWindow } = _a2, mutationOptions = __objRest$1(_a2, ["window"]);
    let observer;
    const isSupported = useSupported(() => window2 && "MutationObserver" in window2);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = vue.watch(() => unrefElement(target), (el) => {
      cleanup();
      if (isSupported.value && window2 && el) {
        observer = new MutationObserver(callback);
        observer.observe(el, mutationOptions);
      }
    }, { immediate: true });
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop
    };
  }
  var SwipeDirection;
  (function(SwipeDirection2) {
    SwipeDirection2["UP"] = "UP";
    SwipeDirection2["RIGHT"] = "RIGHT";
    SwipeDirection2["DOWN"] = "DOWN";
    SwipeDirection2["LEFT"] = "LEFT";
    SwipeDirection2["NONE"] = "NONE";
  })(SwipeDirection || (SwipeDirection = {}));
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  const _TransitionPresets = {
    easeInSine: [0.12, 0, 0.39, 0],
    easeOutSine: [0.61, 1, 0.88, 1],
    easeInOutSine: [0.37, 0, 0.63, 1],
    easeInQuad: [0.11, 0, 0.5, 0],
    easeOutQuad: [0.5, 1, 0.89, 1],
    easeInOutQuad: [0.45, 0, 0.55, 1],
    easeInCubic: [0.32, 0, 0.67, 0],
    easeOutCubic: [0.33, 1, 0.68, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
    easeInQuart: [0.5, 0, 0.75, 0],
    easeOutQuart: [0.25, 1, 0.5, 1],
    easeInOutQuart: [0.76, 0, 0.24, 1],
    easeInQuint: [0.64, 0, 0.78, 0],
    easeOutQuint: [0.22, 1, 0.36, 1],
    easeInOutQuint: [0.83, 0, 0.17, 1],
    easeInExpo: [0.7, 0, 0.84, 0],
    easeOutExpo: [0.16, 1, 0.3, 1],
    easeInOutExpo: [0.87, 0, 0.13, 1],
    easeInCirc: [0.55, 0, 1, 0.45],
    easeOutCirc: [0, 0.55, 0.45, 1],
    easeInOutCirc: [0.85, 0, 0.15, 1],
    easeInBack: [0.36, 0, 0.66, -0.56],
    easeOutBack: [0.34, 1.56, 0.64, 1],
    easeInOutBack: [0.68, -0.6, 0.32, 1.6]
  };
  __spreadValues({
    linear: identity$1
  }, _TransitionPresets);
  const isFirefox = () => isClient && /firefox/i.test(window.navigator.userAgent);
  const NOOP = () => {
  };
  const hasOwnProperty$9 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$9.call(val, key);
  const isArray$2 = Array.isArray;
  const isFunction$1 = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isObject$1 = (val) => val !== null && typeof val === "object";
  const objectToString$1 = Object.prototype.toString;
  const toTypeString = (value) => objectToString$1.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  const freeGlobal$1 = freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal$1 || freeSelf || Function("return this")();
  const root$1 = root;
  var Symbol$1 = root$1.Symbol;
  const Symbol$2 = Symbol$1;
  var objectProto$b = Object.prototype;
  var hasOwnProperty$8 = objectProto$b.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$b.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty$8.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var objectProto$a = Object.prototype;
  var nativeObjectToString = objectProto$a.toString;
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var symbolTag$1 = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$1;
  }
  function arrayMap(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length, result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  var isArray = Array.isArray;
  const isArray$1 = isArray;
  var INFINITY$2 = 1 / 0;
  var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolToString = symbolProto$1 ? symbolProto$1.toString : void 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray$1(value)) {
      return arrayMap(value, baseToString) + "";
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY$2 ? "-0" : result;
  }
  var reWhitespace = /\s/;
  function trimmedEndIndex(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }
  var reTrimStart = /^\s+/;
  function baseTrim(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var INFINITY$1 = 1 / 0, MAX_INTEGER = 17976931348623157e292;
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY$1 || value === -INFINITY$1) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }
  function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
  }
  function identity(value) {
    return value;
  }
  var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  var coreJsData = root$1["__core-js_shared__"];
  const coreJsData$1 = coreJsData;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var funcProto$1 = Function.prototype;
  var funcToString$1 = funcProto$1.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto = Function.prototype, objectProto$9 = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty$7).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  var WeakMap = getNative(root$1, "WeakMap");
  const WeakMap$1 = WeakMap;
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var MAX_SAFE_INTEGER = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  var objectProto$8 = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$8;
    return value === proto;
  }
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  var argsTag$2 = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag$2;
  }
  var objectProto$7 = Object.prototype;
  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
  var propertyIsEnumerable$1 = objectProto$7.propertyIsEnumerable;
  var isArguments = baseIsArguments(function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$6.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
  };
  const isArguments$1 = isArguments;
  function stubFalse() {
    return false;
  }
  var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
  var Buffer = moduleExports$1 ? root$1.Buffer : void 0;
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse;
  const isBuffer$1 = isBuffer;
  var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", objectTag$2 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", weakMapTag$1 = "[object WeakMap]";
  var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] = typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag] = typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] = typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$1] = typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag$1] = false;
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal$1.process;
  var nodeUtil = function() {
    try {
      var types = freeModule && freeModule.require && freeModule.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  const nodeUtil$1 = nodeUtil;
  var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  const isTypedArray$1 = isTypedArray;
  var objectProto$6 = Object.prototype;
  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray$1(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty$5.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  var nativeKeys = overArg(Object.keys, Object);
  const nativeKeys$1 = nativeKeys;
  var objectProto$5 = Object.prototype;
  var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys$1(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$4.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray$1(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  var nativeCreate = getNative(Object, "create");
  const nativeCreate$1 = nativeCreate;
  function hashClear() {
    this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
    this.size = 0;
  }
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate$1) {
      var result = data[key];
      return result === HASH_UNDEFINED$2 ? void 0 : result;
    }
    return hasOwnProperty$3.call(data, key) ? data[key] : void 0;
  }
  var objectProto$3 = Object.prototype;
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty$2.call(data, key);
  }
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate$1 && value === void 0 ? HASH_UNDEFINED$1 : value;
    return this;
  }
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  var Map$1 = getNative(root$1, "Map");
  const Map$2 = Map$1;
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map$2 || ListCache)(),
      "string": new Hash()
    };
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  var FUNC_ERROR_TEXT$1 = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });
    var cache = result.cache;
    return result;
  }
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  const stringToPath$1 = stringToPath;
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function castPath(value, object) {
    if (isArray$1(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath$1(toString(value));
  }
  var INFINITY = 1 / 0;
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function baseGet(object, path) {
    path = castPath(path, object);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : void 0;
  }
  function get(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path);
    return result === void 0 ? defaultValue : result;
  }
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  var LARGE_ARRAY_SIZE = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  function stubArray() {
    return [];
  }
  var objectProto$2 = Object.prototype;
  var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  const getSymbols$1 = getSymbols;
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols$1);
  }
  var DataView = getNative(root$1, "DataView");
  const DataView$1 = DataView;
  var Promise$1 = getNative(root$1, "Promise");
  const Promise$2 = Promise$1;
  var Set$1 = getNative(root$1, "Set");
  const Set$2 = Set$1;
  var mapTag$1 = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag$1 = "[object Set]", weakMapTag = "[object WeakMap]";
  var dataViewTag$1 = "[object DataView]";
  var dataViewCtorString = toSource(DataView$1), mapCtorString = toSource(Map$2), promiseCtorString = toSource(Promise$2), setCtorString = toSource(Set$2), weakMapCtorString = toSource(WeakMap$1);
  var getTag = baseGetTag;
  if (DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$1 || Map$2 && getTag(new Map$2()) != mapTag$1 || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$2 && getTag(new Set$2()) != setTag$1 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag$1 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag$1;
          case mapCtorString:
            return mapTag$1;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag$1;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  const getTag$1 = getTag;
  var Uint8Array$1 = root$1.Uint8Array;
  const Uint8Array$2 = Uint8Array$1;
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
  var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
  var symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$2(object), new Uint8Array$2(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$2;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  var COMPARE_PARTIAL_FLAG$3 = 1;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  var COMPARE_PARTIAL_FLAG$2 = 1;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray$1(object), othIsArr = isArray$1(other), objTag = objIsArr ? arrayTag : getTag$1(object), othTag = othIsArr ? arrayTag : getTag$1(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer$1(object)) {
      if (!isBuffer$1(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }
  function getMatchData(object) {
    var result = keys(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);
    var index = -1, length = path.length, result = false;
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) && (isArray$1(object) || isArguments$1(object));
  }
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }
  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray$1(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  var now = function() {
    return root$1.Date.now();
  };
  const now$1 = now;
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax$1 = Math.max, nativeMin$1 = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax$1(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin$1(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now$1();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now$1());
    }
    function debounced() {
      var time = now$1(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  var nativeMax = Math.max, nativeMin = Math.min;
  function findLastIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = length - 1;
    if (fromIndex !== void 0) {
      index = toInteger(fromIndex);
      index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
    }
    return baseFindIndex(array, baseIteratee(predicate), index, true);
  }
  function fromPairs(pairs) {
    var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
    while (++index < length) {
      var pair = pairs[index];
      result[pair[0]] = pair[1];
    }
    return result;
  }
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }
  function isNil(value) {
    return value == null;
  }
  function isUndefined$1(value) {
    return value === void 0;
  }
  const isUndefined = (val) => val === void 0;
  const isBoolean = (val) => typeof val === "boolean";
  const isNumber = (val) => typeof val === "number";
  const isElement = (e) => {
    if (typeof Element === "undefined")
      return false;
    return e instanceof Element;
  };
  const isStringNumber = (val) => {
    if (!isString(val)) {
      return false;
    }
    return !Number.isNaN(Number(val));
  };
  const escapeStringRegexp = (string = "") => string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
  class ElementPlusError extends Error {
    constructor(m) {
      super(m);
      this.name = "ElementPlusError";
    }
  }
  function throwError(scope, m) {
    throw new ElementPlusError(`[${scope}] ${m}`);
  }
  function debugWarn(scope, message) {
  }
  function addUnit(value, defaultUnit = "px") {
    if (!value)
      return "";
    if (isNumber(value) || isStringNumber(value)) {
      return `${value}${defaultUnit}`;
    } else if (isString(value)) {
      return value;
    }
  }
  function scrollIntoView(container, selected) {
    if (!isClient)
      return;
    if (!selected) {
      container.scrollTop = 0;
      return;
    }
    const offsetParents = [];
    let pointer = selected.offsetParent;
    while (pointer !== null && container !== pointer && container.contains(pointer)) {
      offsetParents.push(pointer);
      pointer = pointer.offsetParent;
    }
    const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
    const bottom = top + selected.offsetHeight;
    const viewRectTop = container.scrollTop;
    const viewRectBottom = viewRectTop + container.clientHeight;
    if (top < viewRectTop) {
      container.scrollTop = top;
    } else if (bottom > viewRectBottom) {
      container.scrollTop = bottom - container.clientHeight;
    }
  }
  /*! Element Plus Icons Vue v2.3.1 */
  var arrow_down_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowDown",
    __name: "arrow-down",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
        })
      ]));
    }
  });
  var arrow_down_default = arrow_down_vue_vue_type_script_setup_true_lang_default;
  var check_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Check",
    __name: "check",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"
        })
      ]));
    }
  });
  var check_default = check_vue_vue_type_script_setup_true_lang_default;
  var circle_check_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleCheck",
    __name: "circle-check",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M745.344 361.344a32 32 0 0 1 45.312 45.312l-288 288a32 32 0 0 1-45.312 0l-160-160a32 32 0 1 1 45.312-45.312L480 626.752l265.344-265.408z"
        })
      ]));
    }
  });
  var circle_check_default = circle_check_vue_vue_type_script_setup_true_lang_default;
  var circle_close_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleClose",
    __name: "circle-close",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248z"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
        })
      ]));
    }
  });
  var circle_close_default = circle_close_vue_vue_type_script_setup_true_lang_default;
  var close_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Close",
    __name: "close",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
        })
      ]));
    }
  });
  var close_default = close_vue_vue_type_script_setup_true_lang_default;
  var hide_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Hide",
    __name: "hide",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2zM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z"
        })
      ]));
    }
  });
  var hide_default = hide_vue_vue_type_script_setup_true_lang_default;
  var loading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Loading",
    __name: "loading",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
        })
      ]));
    }
  });
  var loading_default = loading_vue_vue_type_script_setup_true_lang_default;
  var view_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "View",
    __name: "view",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352m0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448m0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160"
        })
      ]));
    }
  });
  var view_default = view_vue_vue_type_script_setup_true_lang_default;
  var warning_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "WarningFilled",
    __name: "warning-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"
        })
      ]));
    }
  });
  var warning_filled_default = warning_filled_vue_vue_type_script_setup_true_lang_default;
  const epPropKey = "__epPropKey";
  const definePropType = (val) => val;
  const isEpProp = (val) => isObject$1(val) && !!val[epPropKey];
  const buildProp = (prop, key) => {
    if (!isObject$1(prop) || isEpProp(prop))
      return prop;
    const { values, required, default: defaultValue, type, validator } = prop;
    const _validator = values || validator ? (val) => {
      let valid = false;
      let allowedValues = [];
      if (values) {
        allowedValues = Array.from(values);
        if (hasOwn(prop, "default")) {
          allowedValues.push(defaultValue);
        }
        valid || (valid = allowedValues.includes(val));
      }
      if (validator)
        valid || (valid = validator(val));
      if (!valid && allowedValues.length > 0) {
        const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(", ");
        vue.warn(`Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`);
      }
      return valid;
    } : void 0;
    const epProp = {
      type,
      required: !!required,
      validator: _validator,
      [epPropKey]: true
    };
    if (hasOwn(prop, "default"))
      epProp.default = defaultValue;
    return epProp;
  };
  const buildProps = (props) => fromPairs(Object.entries(props).map(([key, option]) => [
    key,
    buildProp(option, key)
  ]));
  const iconPropType = definePropType([
    String,
    Object,
    Function
  ]);
  const ValidateComponentsMap = {
    validating: loading_default,
    success: circle_check_default,
    error: circle_close_default
  };
  const withInstall = (main, extra) => {
    main.install = (app2) => {
      for (const comp of [main, ...Object.values(extra != null ? extra : {})]) {
        app2.component(comp.name, comp);
      }
    };
    if (extra) {
      for (const [key, comp] of Object.entries(extra)) {
        main[key] = comp;
      }
    }
    return main;
  };
  const withNoopInstall = (component) => {
    component.install = NOOP;
    return component;
  };
  const EVENT_CODE = {
    tab: "Tab",
    enter: "Enter",
    space: "Space",
    left: "ArrowLeft",
    up: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    esc: "Escape",
    delete: "Delete",
    backspace: "Backspace",
    numpadEnter: "NumpadEnter",
    pageUp: "PageUp",
    pageDown: "PageDown",
    home: "Home",
    end: "End"
  };
  const UPDATE_MODEL_EVENT = "update:modelValue";
  const CHANGE_EVENT = "change";
  const componentSizes = ["", "default", "small", "large"];
  const isKorean = (text) => /([\uAC00-\uD7AF\u3130-\u318F])+/gi.test(text);
  const mutable = (val) => val;
  const DEFAULT_EXCLUDE_KEYS = ["class", "style"];
  const LISTENER_PREFIX = /^on[A-Z]/;
  const useAttrs = (params = {}) => {
    const { excludeListeners = false, excludeKeys } = params;
    const allExcludeKeys = vue.computed(() => {
      return ((excludeKeys == null ? void 0 : excludeKeys.value) || []).concat(DEFAULT_EXCLUDE_KEYS);
    });
    const instance = vue.getCurrentInstance();
    if (!instance) {
      return vue.computed(() => ({}));
    }
    return vue.computed(() => {
      var _a2;
      return fromPairs(Object.entries((_a2 = instance.proxy) == null ? void 0 : _a2.$attrs).filter(([key]) => !allExcludeKeys.value.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))));
    });
  };
  var English = {
    name: "en",
    el: {
      breadcrumb: {
        label: "Breadcrumb"
      },
      colorpicker: {
        confirm: "OK",
        clear: "Clear",
        defaultLabel: "color picker",
        description: "current color is {color}. press enter to select a new color."
      },
      datepicker: {
        now: "Now",
        today: "Today",
        cancel: "Cancel",
        clear: "Clear",
        confirm: "OK",
        dateTablePrompt: "Use the arrow keys and enter to select the day of the month",
        monthTablePrompt: "Use the arrow keys and enter to select the month",
        yearTablePrompt: "Use the arrow keys and enter to select the year",
        selectedDate: "Selected date",
        selectDate: "Select date",
        selectTime: "Select time",
        startDate: "Start Date",
        startTime: "Start Time",
        endDate: "End Date",
        endTime: "End Time",
        prevYear: "Previous Year",
        nextYear: "Next Year",
        prevMonth: "Previous Month",
        nextMonth: "Next Month",
        year: "",
        month1: "January",
        month2: "February",
        month3: "March",
        month4: "April",
        month5: "May",
        month6: "June",
        month7: "July",
        month8: "August",
        month9: "September",
        month10: "October",
        month11: "November",
        month12: "December",
        week: "week",
        weeks: {
          sun: "Sun",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat"
        },
        weeksFull: {
          sun: "Sunday",
          mon: "Monday",
          tue: "Tuesday",
          wed: "Wednesday",
          thu: "Thursday",
          fri: "Friday",
          sat: "Saturday"
        },
        months: {
          jan: "Jan",
          feb: "Feb",
          mar: "Mar",
          apr: "Apr",
          may: "May",
          jun: "Jun",
          jul: "Jul",
          aug: "Aug",
          sep: "Sep",
          oct: "Oct",
          nov: "Nov",
          dec: "Dec"
        }
      },
      inputNumber: {
        decrease: "decrease number",
        increase: "increase number"
      },
      select: {
        loading: "Loading",
        noMatch: "No matching data",
        noData: "No data",
        placeholder: "Select"
      },
      dropdown: {
        toggleDropdown: "Toggle Dropdown"
      },
      cascader: {
        noMatch: "No matching data",
        loading: "Loading",
        placeholder: "Select",
        noData: "No data"
      },
      pagination: {
        goto: "Go to",
        pagesize: "/page",
        total: "Total {total}",
        pageClassifier: "",
        page: "Page",
        prev: "Go to previous page",
        next: "Go to next page",
        currentPage: "page {pager}",
        prevPages: "Previous {pager} pages",
        nextPages: "Next {pager} pages",
        deprecationWarning: "Deprecated usages detected, please refer to the el-pagination documentation for more details"
      },
      dialog: {
        close: "Close this dialog"
      },
      drawer: {
        close: "Close this dialog"
      },
      messagebox: {
        title: "Message",
        confirm: "OK",
        cancel: "Cancel",
        error: "Illegal input",
        close: "Close this dialog"
      },
      upload: {
        deleteTip: "press delete to remove",
        delete: "Delete",
        preview: "Preview",
        continue: "Continue"
      },
      slider: {
        defaultLabel: "slider between {min} and {max}",
        defaultRangeStartLabel: "pick start value",
        defaultRangeEndLabel: "pick end value"
      },
      table: {
        emptyText: "No Data",
        confirmFilter: "Confirm",
        resetFilter: "Reset",
        clearFilter: "All",
        sumText: "Sum"
      },
      tour: {
        next: "Next",
        previous: "Previous",
        finish: "Finish"
      },
      tree: {
        emptyText: "No Data"
      },
      transfer: {
        noMatch: "No matching data",
        noData: "No data",
        titles: ["List 1", "List 2"],
        filterPlaceholder: "Enter keyword",
        noCheckedFormat: "{total} items",
        hasCheckedFormat: "{checked}/{total} checked"
      },
      image: {
        error: "FAILED"
      },
      pageHeader: {
        title: "Back"
      },
      popconfirm: {
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      },
      carousel: {
        leftArrow: "Carousel arrow left",
        rightArrow: "Carousel arrow right",
        indicator: "Carousel switch to index {index}"
      }
    }
  };
  const buildTranslator = (locale) => (path, option) => translate(path, option, vue.unref(locale));
  const translate = (path, option, locale) => get(locale, path, path).replace(/\{(\w+)\}/g, (_, key) => {
    var _a2;
    return `${(_a2 = option == null ? void 0 : option[key]) != null ? _a2 : `{${key}}`}`;
  });
  const buildLocaleContext = (locale) => {
    const lang = vue.computed(() => vue.unref(locale).name);
    const localeRef = vue.isRef(locale) ? locale : vue.ref(locale);
    return {
      lang,
      locale: localeRef,
      t: buildTranslator(locale)
    };
  };
  const localeContextKey = Symbol("localeContextKey");
  const useLocale = (localeOverrides) => {
    const locale = localeOverrides || vue.inject(localeContextKey, vue.ref());
    return buildLocaleContext(vue.computed(() => locale.value || English));
  };
  const defaultNamespace = "el";
  const statePrefix = "is-";
  const _bem = (namespace, block, blockSuffix, element, modifier) => {
    let cls = `${namespace}-${block}`;
    if (blockSuffix) {
      cls += `-${blockSuffix}`;
    }
    if (element) {
      cls += `__${element}`;
    }
    if (modifier) {
      cls += `--${modifier}`;
    }
    return cls;
  };
  const namespaceContextKey = Symbol("namespaceContextKey");
  const useGetDerivedNamespace = (namespaceOverrides) => {
    const derivedNamespace = namespaceOverrides || (vue.getCurrentInstance() ? vue.inject(namespaceContextKey, vue.ref(defaultNamespace)) : vue.ref(defaultNamespace));
    const namespace = vue.computed(() => {
      return vue.unref(derivedNamespace) || defaultNamespace;
    });
    return namespace;
  };
  const useNamespace = (block, namespaceOverrides) => {
    const namespace = useGetDerivedNamespace(namespaceOverrides);
    const b = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
    const e = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
    const m = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
    const be2 = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
    const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
    const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
    const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
    const is = (name, ...args) => {
      const state = args.length >= 1 ? args[0] : true;
      return name && state ? `${statePrefix}${name}` : "";
    };
    const cssVar = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarBlock = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${block}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarName = (name) => `--${namespace.value}-${name}`;
    const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
    return {
      namespace,
      b,
      e,
      m,
      be: be2,
      em,
      bm,
      bem,
      is,
      cssVar,
      cssVarName,
      cssVarBlock,
      cssVarBlockName
    };
  };
  const _prop = buildProp({
    type: definePropType(Boolean),
    default: null
  });
  const _event = buildProp({
    type: definePropType(Function)
  });
  const createModelToggleComposable = (name) => {
    const updateEventKey = `update:${name}`;
    const updateEventKeyRaw = `onUpdate:${name}`;
    const useModelToggleEmits2 = [updateEventKey];
    const useModelToggleProps2 = {
      [name]: _prop,
      [updateEventKeyRaw]: _event
    };
    const useModelToggle2 = ({
      indicator,
      toggleReason,
      shouldHideWhenRouteChanges,
      shouldProceed,
      onShow,
      onHide
    }) => {
      const instance = vue.getCurrentInstance();
      const { emit } = instance;
      const props = instance.props;
      const hasUpdateHandler = vue.computed(() => isFunction$1(props[updateEventKeyRaw]));
      const isModelBindingAbsent = vue.computed(() => props[name] === null);
      const doShow = (event) => {
        if (indicator.value === true) {
          return;
        }
        indicator.value = true;
        if (toggleReason) {
          toggleReason.value = event;
        }
        if (isFunction$1(onShow)) {
          onShow(event);
        }
      };
      const doHide = (event) => {
        if (indicator.value === false) {
          return;
        }
        indicator.value = false;
        if (toggleReason) {
          toggleReason.value = event;
        }
        if (isFunction$1(onHide)) {
          onHide(event);
        }
      };
      const show = (event) => {
        if (props.disabled === true || isFunction$1(shouldProceed) && !shouldProceed())
          return;
        const shouldEmit = hasUpdateHandler.value && isClient;
        if (shouldEmit) {
          emit(updateEventKey, true);
        }
        if (isModelBindingAbsent.value || !shouldEmit) {
          doShow(event);
        }
      };
      const hide = (event) => {
        if (props.disabled === true || !isClient)
          return;
        const shouldEmit = hasUpdateHandler.value && isClient;
        if (shouldEmit) {
          emit(updateEventKey, false);
        }
        if (isModelBindingAbsent.value || !shouldEmit) {
          doHide(event);
        }
      };
      const onChange = (val) => {
        if (!isBoolean(val))
          return;
        if (props.disabled && val) {
          if (hasUpdateHandler.value) {
            emit(updateEventKey, false);
          }
        } else if (indicator.value !== val) {
          if (val) {
            doShow();
          } else {
            doHide();
          }
        }
      };
      const toggle = () => {
        if (indicator.value) {
          hide();
        } else {
          show();
        }
      };
      vue.watch(() => props[name], onChange);
      if (shouldHideWhenRouteChanges && instance.appContext.config.globalProperties.$route !== void 0) {
        vue.watch(() => ({
          ...instance.proxy.$route
        }), () => {
          if (shouldHideWhenRouteChanges.value && indicator.value) {
            hide();
          }
        });
      }
      vue.onMounted(() => {
        onChange(props[name]);
      });
      return {
        hide,
        show,
        toggle,
        hasUpdateHandler
      };
    };
    return {
      useModelToggle: useModelToggle2,
      useModelToggleProps: useModelToggleProps2,
      useModelToggleEmits: useModelToggleEmits2
    };
  };
  const useProp = (name) => {
    const vm = vue.getCurrentInstance();
    return vue.computed(() => {
      var _a2, _b;
      return (_b = (_a2 = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a2.$props) == null ? void 0 : _b[name];
    });
  };
  var E = "top", R = "bottom", W = "right", P = "left", me = "auto", G = [E, R, W, P], U = "start", J = "end", Xe = "clippingParents", je = "viewport", K = "popper", Ye = "reference", De = G.reduce(function(t, e) {
    return t.concat([e + "-" + U, e + "-" + J]);
  }, []), Ee = [].concat(G, [me]).reduce(function(t, e) {
    return t.concat([e, e + "-" + U, e + "-" + J]);
  }, []), Ge = "beforeRead", Je = "read", Ke = "afterRead", Qe = "beforeMain", Ze = "main", et = "afterMain", tt = "beforeWrite", nt = "write", rt = "afterWrite", ot = [Ge, Je, Ke, Qe, Ze, et, tt, nt, rt];
  function C(t) {
    return t ? (t.nodeName || "").toLowerCase() : null;
  }
  function H(t) {
    if (t == null)
      return window;
    if (t.toString() !== "[object Window]") {
      var e = t.ownerDocument;
      return e && e.defaultView || window;
    }
    return t;
  }
  function Q(t) {
    var e = H(t).Element;
    return t instanceof e || t instanceof Element;
  }
  function B(t) {
    var e = H(t).HTMLElement;
    return t instanceof e || t instanceof HTMLElement;
  }
  function Pe(t) {
    if (typeof ShadowRoot == "undefined")
      return false;
    var e = H(t).ShadowRoot;
    return t instanceof e || t instanceof ShadowRoot;
  }
  function Mt(t) {
    var e = t.state;
    Object.keys(e.elements).forEach(function(n) {
      var r = e.styles[n] || {}, o = e.attributes[n] || {}, i = e.elements[n];
      !B(i) || !C(i) || (Object.assign(i.style, r), Object.keys(o).forEach(function(a) {
        var s = o[a];
        s === false ? i.removeAttribute(a) : i.setAttribute(a, s === true ? "" : s);
      }));
    });
  }
  function Rt(t) {
    var e = t.state, n = { popper: { position: e.options.strategy, left: "0", top: "0", margin: "0" }, arrow: { position: "absolute" }, reference: {} };
    return Object.assign(e.elements.popper.style, n.popper), e.styles = n, e.elements.arrow && Object.assign(e.elements.arrow.style, n.arrow), function() {
      Object.keys(e.elements).forEach(function(r) {
        var o = e.elements[r], i = e.attributes[r] || {}, a = Object.keys(e.styles.hasOwnProperty(r) ? e.styles[r] : n[r]), s = a.reduce(function(f, c) {
          return f[c] = "", f;
        }, {});
        !B(o) || !C(o) || (Object.assign(o.style, s), Object.keys(i).forEach(function(f) {
          o.removeAttribute(f);
        }));
      });
    };
  }
  var Ae = { name: "applyStyles", enabled: true, phase: "write", fn: Mt, effect: Rt, requires: ["computeStyles"] };
  function q(t) {
    return t.split("-")[0];
  }
  var X = Math.max, ve = Math.min, Z = Math.round;
  function ee(t, e) {
    e === void 0 && (e = false);
    var n = t.getBoundingClientRect(), r = 1, o = 1;
    if (B(t) && e) {
      var i = t.offsetHeight, a = t.offsetWidth;
      a > 0 && (r = Z(n.width) / a || 1), i > 0 && (o = Z(n.height) / i || 1);
    }
    return { width: n.width / r, height: n.height / o, top: n.top / o, right: n.right / r, bottom: n.bottom / o, left: n.left / r, x: n.left / r, y: n.top / o };
  }
  function ke(t) {
    var e = ee(t), n = t.offsetWidth, r = t.offsetHeight;
    return Math.abs(e.width - n) <= 1 && (n = e.width), Math.abs(e.height - r) <= 1 && (r = e.height), { x: t.offsetLeft, y: t.offsetTop, width: n, height: r };
  }
  function it(t, e) {
    var n = e.getRootNode && e.getRootNode();
    if (t.contains(e))
      return true;
    if (n && Pe(n)) {
      var r = e;
      do {
        if (r && t.isSameNode(r))
          return true;
        r = r.parentNode || r.host;
      } while (r);
    }
    return false;
  }
  function N(t) {
    return H(t).getComputedStyle(t);
  }
  function Wt(t) {
    return ["table", "td", "th"].indexOf(C(t)) >= 0;
  }
  function I(t) {
    return ((Q(t) ? t.ownerDocument : t.document) || window.document).documentElement;
  }
  function ge(t) {
    return C(t) === "html" ? t : t.assignedSlot || t.parentNode || (Pe(t) ? t.host : null) || I(t);
  }
  function at(t) {
    return !B(t) || N(t).position === "fixed" ? null : t.offsetParent;
  }
  function Bt(t) {
    var e = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1, n = navigator.userAgent.indexOf("Trident") !== -1;
    if (n && B(t)) {
      var r = N(t);
      if (r.position === "fixed")
        return null;
    }
    var o = ge(t);
    for (Pe(o) && (o = o.host); B(o) && ["html", "body"].indexOf(C(o)) < 0; ) {
      var i = N(o);
      if (i.transform !== "none" || i.perspective !== "none" || i.contain === "paint" || ["transform", "perspective"].indexOf(i.willChange) !== -1 || e && i.willChange === "filter" || e && i.filter && i.filter !== "none")
        return o;
      o = o.parentNode;
    }
    return null;
  }
  function se(t) {
    for (var e = H(t), n = at(t); n && Wt(n) && N(n).position === "static"; )
      n = at(n);
    return n && (C(n) === "html" || C(n) === "body" && N(n).position === "static") ? e : n || Bt(t) || e;
  }
  function Le(t) {
    return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y";
  }
  function fe(t, e, n) {
    return X(t, ve(e, n));
  }
  function St(t, e, n) {
    var r = fe(t, e, n);
    return r > n ? n : r;
  }
  function st() {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  function ft(t) {
    return Object.assign({}, st(), t);
  }
  function ct(t, e) {
    return e.reduce(function(n, r) {
      return n[r] = t, n;
    }, {});
  }
  var Tt = function(t, e) {
    return t = typeof t == "function" ? t(Object.assign({}, e.rects, { placement: e.placement })) : t, ft(typeof t != "number" ? t : ct(t, G));
  };
  function Ht(t) {
    var e, n = t.state, r = t.name, o = t.options, i = n.elements.arrow, a = n.modifiersData.popperOffsets, s = q(n.placement), f = Le(s), c = [P, W].indexOf(s) >= 0, u = c ? "height" : "width";
    if (!(!i || !a)) {
      var m = Tt(o.padding, n), v = ke(i), l = f === "y" ? E : P, h2 = f === "y" ? R : W, p = n.rects.reference[u] + n.rects.reference[f] - a[f] - n.rects.popper[u], g = a[f] - n.rects.reference[f], x = se(i), y = x ? f === "y" ? x.clientHeight || 0 : x.clientWidth || 0 : 0, $ = p / 2 - g / 2, d = m[l], b = y - v[u] - m[h2], w = y / 2 - v[u] / 2 + $, O = fe(d, w, b), j = f;
      n.modifiersData[r] = (e = {}, e[j] = O, e.centerOffset = O - w, e);
    }
  }
  function Ct(t) {
    var e = t.state, n = t.options, r = n.element, o = r === void 0 ? "[data-popper-arrow]" : r;
    o != null && (typeof o == "string" && (o = e.elements.popper.querySelector(o), !o) || !it(e.elements.popper, o) || (e.elements.arrow = o));
  }
  var pt = { name: "arrow", enabled: true, phase: "main", fn: Ht, effect: Ct, requires: ["popperOffsets"], requiresIfExists: ["preventOverflow"] };
  function te(t) {
    return t.split("-")[1];
  }
  var qt = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
  function Vt(t) {
    var e = t.x, n = t.y, r = window, o = r.devicePixelRatio || 1;
    return { x: Z(e * o) / o || 0, y: Z(n * o) / o || 0 };
  }
  function ut(t) {
    var e, n = t.popper, r = t.popperRect, o = t.placement, i = t.variation, a = t.offsets, s = t.position, f = t.gpuAcceleration, c = t.adaptive, u = t.roundOffsets, m = t.isFixed, v = a.x, l = v === void 0 ? 0 : v, h2 = a.y, p = h2 === void 0 ? 0 : h2, g = typeof u == "function" ? u({ x: l, y: p }) : { x: l, y: p };
    l = g.x, p = g.y;
    var x = a.hasOwnProperty("x"), y = a.hasOwnProperty("y"), $ = P, d = E, b = window;
    if (c) {
      var w = se(n), O = "clientHeight", j = "clientWidth";
      if (w === H(n) && (w = I(n), N(w).position !== "static" && s === "absolute" && (O = "scrollHeight", j = "scrollWidth")), w = w, o === E || (o === P || o === W) && i === J) {
        d = R;
        var A = m && w === b && b.visualViewport ? b.visualViewport.height : w[O];
        p -= A - r.height, p *= f ? 1 : -1;
      }
      if (o === P || (o === E || o === R) && i === J) {
        $ = W;
        var k = m && w === b && b.visualViewport ? b.visualViewport.width : w[j];
        l -= k - r.width, l *= f ? 1 : -1;
      }
    }
    var D = Object.assign({ position: s }, c && qt), S = u === true ? Vt({ x: l, y: p }) : { x: l, y: p };
    if (l = S.x, p = S.y, f) {
      var L;
      return Object.assign({}, D, (L = {}, L[d] = y ? "0" : "", L[$] = x ? "0" : "", L.transform = (b.devicePixelRatio || 1) <= 1 ? "translate(" + l + "px, " + p + "px)" : "translate3d(" + l + "px, " + p + "px, 0)", L));
    }
    return Object.assign({}, D, (e = {}, e[d] = y ? p + "px" : "", e[$] = x ? l + "px" : "", e.transform = "", e));
  }
  function Nt(t) {
    var e = t.state, n = t.options, r = n.gpuAcceleration, o = r === void 0 ? true : r, i = n.adaptive, a = i === void 0 ? true : i, s = n.roundOffsets, f = s === void 0 ? true : s, c = { placement: q(e.placement), variation: te(e.placement), popper: e.elements.popper, popperRect: e.rects.popper, gpuAcceleration: o, isFixed: e.options.strategy === "fixed" };
    e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, ut(Object.assign({}, c, { offsets: e.modifiersData.popperOffsets, position: e.options.strategy, adaptive: a, roundOffsets: f })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, ut(Object.assign({}, c, { offsets: e.modifiersData.arrow, position: "absolute", adaptive: false, roundOffsets: f })))), e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-placement": e.placement });
  }
  var Me = { name: "computeStyles", enabled: true, phase: "beforeWrite", fn: Nt, data: {} }, ye = { passive: true };
  function It(t) {
    var e = t.state, n = t.instance, r = t.options, o = r.scroll, i = o === void 0 ? true : o, a = r.resize, s = a === void 0 ? true : a, f = H(e.elements.popper), c = [].concat(e.scrollParents.reference, e.scrollParents.popper);
    return i && c.forEach(function(u) {
      u.addEventListener("scroll", n.update, ye);
    }), s && f.addEventListener("resize", n.update, ye), function() {
      i && c.forEach(function(u) {
        u.removeEventListener("scroll", n.update, ye);
      }), s && f.removeEventListener("resize", n.update, ye);
    };
  }
  var Re = { name: "eventListeners", enabled: true, phase: "write", fn: function() {
  }, effect: It, data: {} }, _t = { left: "right", right: "left", bottom: "top", top: "bottom" };
  function be(t) {
    return t.replace(/left|right|bottom|top/g, function(e) {
      return _t[e];
    });
  }
  var zt = { start: "end", end: "start" };
  function lt(t) {
    return t.replace(/start|end/g, function(e) {
      return zt[e];
    });
  }
  function We(t) {
    var e = H(t), n = e.pageXOffset, r = e.pageYOffset;
    return { scrollLeft: n, scrollTop: r };
  }
  function Be(t) {
    return ee(I(t)).left + We(t).scrollLeft;
  }
  function Ft(t) {
    var e = H(t), n = I(t), r = e.visualViewport, o = n.clientWidth, i = n.clientHeight, a = 0, s = 0;
    return r && (o = r.width, i = r.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (a = r.offsetLeft, s = r.offsetTop)), { width: o, height: i, x: a + Be(t), y: s };
  }
  function Ut(t) {
    var e, n = I(t), r = We(t), o = (e = t.ownerDocument) == null ? void 0 : e.body, i = X(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0), a = X(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0), s = -r.scrollLeft + Be(t), f = -r.scrollTop;
    return N(o || n).direction === "rtl" && (s += X(n.clientWidth, o ? o.clientWidth : 0) - i), { width: i, height: a, x: s, y: f };
  }
  function Se(t) {
    var e = N(t), n = e.overflow, r = e.overflowX, o = e.overflowY;
    return /auto|scroll|overlay|hidden/.test(n + o + r);
  }
  function dt(t) {
    return ["html", "body", "#document"].indexOf(C(t)) >= 0 ? t.ownerDocument.body : B(t) && Se(t) ? t : dt(ge(t));
  }
  function ce(t, e) {
    var n;
    e === void 0 && (e = []);
    var r = dt(t), o = r === ((n = t.ownerDocument) == null ? void 0 : n.body), i = H(r), a = o ? [i].concat(i.visualViewport || [], Se(r) ? r : []) : r, s = e.concat(a);
    return o ? s : s.concat(ce(ge(a)));
  }
  function Te(t) {
    return Object.assign({}, t, { left: t.x, top: t.y, right: t.x + t.width, bottom: t.y + t.height });
  }
  function Xt(t) {
    var e = ee(t);
    return e.top = e.top + t.clientTop, e.left = e.left + t.clientLeft, e.bottom = e.top + t.clientHeight, e.right = e.left + t.clientWidth, e.width = t.clientWidth, e.height = t.clientHeight, e.x = e.left, e.y = e.top, e;
  }
  function ht(t, e) {
    return e === je ? Te(Ft(t)) : Q(e) ? Xt(e) : Te(Ut(I(t)));
  }
  function Yt(t) {
    var e = ce(ge(t)), n = ["absolute", "fixed"].indexOf(N(t).position) >= 0, r = n && B(t) ? se(t) : t;
    return Q(r) ? e.filter(function(o) {
      return Q(o) && it(o, r) && C(o) !== "body";
    }) : [];
  }
  function Gt(t, e, n) {
    var r = e === "clippingParents" ? Yt(t) : [].concat(e), o = [].concat(r, [n]), i = o[0], a = o.reduce(function(s, f) {
      var c = ht(t, f);
      return s.top = X(c.top, s.top), s.right = ve(c.right, s.right), s.bottom = ve(c.bottom, s.bottom), s.left = X(c.left, s.left), s;
    }, ht(t, i));
    return a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
  }
  function mt(t) {
    var e = t.reference, n = t.element, r = t.placement, o = r ? q(r) : null, i = r ? te(r) : null, a = e.x + e.width / 2 - n.width / 2, s = e.y + e.height / 2 - n.height / 2, f;
    switch (o) {
      case E:
        f = { x: a, y: e.y - n.height };
        break;
      case R:
        f = { x: a, y: e.y + e.height };
        break;
      case W:
        f = { x: e.x + e.width, y: s };
        break;
      case P:
        f = { x: e.x - n.width, y: s };
        break;
      default:
        f = { x: e.x, y: e.y };
    }
    var c = o ? Le(o) : null;
    if (c != null) {
      var u = c === "y" ? "height" : "width";
      switch (i) {
        case U:
          f[c] = f[c] - (e[u] / 2 - n[u] / 2);
          break;
        case J:
          f[c] = f[c] + (e[u] / 2 - n[u] / 2);
          break;
      }
    }
    return f;
  }
  function ne(t, e) {
    e === void 0 && (e = {});
    var n = e, r = n.placement, o = r === void 0 ? t.placement : r, i = n.boundary, a = i === void 0 ? Xe : i, s = n.rootBoundary, f = s === void 0 ? je : s, c = n.elementContext, u = c === void 0 ? K : c, m = n.altBoundary, v = m === void 0 ? false : m, l = n.padding, h2 = l === void 0 ? 0 : l, p = ft(typeof h2 != "number" ? h2 : ct(h2, G)), g = u === K ? Ye : K, x = t.rects.popper, y = t.elements[v ? g : u], $ = Gt(Q(y) ? y : y.contextElement || I(t.elements.popper), a, f), d = ee(t.elements.reference), b = mt({ reference: d, element: x, strategy: "absolute", placement: o }), w = Te(Object.assign({}, x, b)), O = u === K ? w : d, j = { top: $.top - O.top + p.top, bottom: O.bottom - $.bottom + p.bottom, left: $.left - O.left + p.left, right: O.right - $.right + p.right }, A = t.modifiersData.offset;
    if (u === K && A) {
      var k = A[o];
      Object.keys(j).forEach(function(D) {
        var S = [W, R].indexOf(D) >= 0 ? 1 : -1, L = [E, R].indexOf(D) >= 0 ? "y" : "x";
        j[D] += k[L] * S;
      });
    }
    return j;
  }
  function Jt(t, e) {
    e === void 0 && (e = {});
    var n = e, r = n.placement, o = n.boundary, i = n.rootBoundary, a = n.padding, s = n.flipVariations, f = n.allowedAutoPlacements, c = f === void 0 ? Ee : f, u = te(r), m = u ? s ? De : De.filter(function(h2) {
      return te(h2) === u;
    }) : G, v = m.filter(function(h2) {
      return c.indexOf(h2) >= 0;
    });
    v.length === 0 && (v = m);
    var l = v.reduce(function(h2, p) {
      return h2[p] = ne(t, { placement: p, boundary: o, rootBoundary: i, padding: a })[q(p)], h2;
    }, {});
    return Object.keys(l).sort(function(h2, p) {
      return l[h2] - l[p];
    });
  }
  function Kt(t) {
    if (q(t) === me)
      return [];
    var e = be(t);
    return [lt(t), e, lt(e)];
  }
  function Qt(t) {
    var e = t.state, n = t.options, r = t.name;
    if (!e.modifiersData[r]._skip) {
      for (var o = n.mainAxis, i = o === void 0 ? true : o, a = n.altAxis, s = a === void 0 ? true : a, f = n.fallbackPlacements, c = n.padding, u = n.boundary, m = n.rootBoundary, v = n.altBoundary, l = n.flipVariations, h2 = l === void 0 ? true : l, p = n.allowedAutoPlacements, g = e.options.placement, x = q(g), y = x === g, $ = f || (y || !h2 ? [be(g)] : Kt(g)), d = [g].concat($).reduce(function(z, V) {
        return z.concat(q(V) === me ? Jt(e, { placement: V, boundary: u, rootBoundary: m, padding: c, flipVariations: h2, allowedAutoPlacements: p }) : V);
      }, []), b = e.rects.reference, w = e.rects.popper, O = /* @__PURE__ */ new Map(), j = true, A = d[0], k = 0; k < d.length; k++) {
        var D = d[k], S = q(D), L = te(D) === U, re = [E, R].indexOf(S) >= 0, oe = re ? "width" : "height", M = ne(e, { placement: D, boundary: u, rootBoundary: m, altBoundary: v, padding: c }), T = re ? L ? W : P : L ? R : E;
        b[oe] > w[oe] && (T = be(T));
        var pe = be(T), _ = [];
        if (i && _.push(M[S] <= 0), s && _.push(M[T] <= 0, M[pe] <= 0), _.every(function(z) {
          return z;
        })) {
          A = D, j = false;
          break;
        }
        O.set(D, _);
      }
      if (j)
        for (var ue = h2 ? 3 : 1, xe = function(z) {
          var V = d.find(function(de) {
            var ae = O.get(de);
            if (ae)
              return ae.slice(0, z).every(function(Y) {
                return Y;
              });
          });
          if (V)
            return A = V, "break";
        }, ie = ue; ie > 0; ie--) {
          var le = xe(ie);
          if (le === "break")
            break;
        }
      e.placement !== A && (e.modifiersData[r]._skip = true, e.placement = A, e.reset = true);
    }
  }
  var vt = { name: "flip", enabled: true, phase: "main", fn: Qt, requiresIfExists: ["offset"], data: { _skip: false } };
  function gt(t, e, n) {
    return n === void 0 && (n = { x: 0, y: 0 }), { top: t.top - e.height - n.y, right: t.right - e.width + n.x, bottom: t.bottom - e.height + n.y, left: t.left - e.width - n.x };
  }
  function yt(t) {
    return [E, W, R, P].some(function(e) {
      return t[e] >= 0;
    });
  }
  function Zt(t) {
    var e = t.state, n = t.name, r = e.rects.reference, o = e.rects.popper, i = e.modifiersData.preventOverflow, a = ne(e, { elementContext: "reference" }), s = ne(e, { altBoundary: true }), f = gt(a, r), c = gt(s, o, i), u = yt(f), m = yt(c);
    e.modifiersData[n] = { referenceClippingOffsets: f, popperEscapeOffsets: c, isReferenceHidden: u, hasPopperEscaped: m }, e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-reference-hidden": u, "data-popper-escaped": m });
  }
  var bt = { name: "hide", enabled: true, phase: "main", requiresIfExists: ["preventOverflow"], fn: Zt };
  function en(t, e, n) {
    var r = q(t), o = [P, E].indexOf(r) >= 0 ? -1 : 1, i = typeof n == "function" ? n(Object.assign({}, e, { placement: t })) : n, a = i[0], s = i[1];
    return a = a || 0, s = (s || 0) * o, [P, W].indexOf(r) >= 0 ? { x: s, y: a } : { x: a, y: s };
  }
  function tn(t) {
    var e = t.state, n = t.options, r = t.name, o = n.offset, i = o === void 0 ? [0, 0] : o, a = Ee.reduce(function(u, m) {
      return u[m] = en(m, e.rects, i), u;
    }, {}), s = a[e.placement], f = s.x, c = s.y;
    e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += f, e.modifiersData.popperOffsets.y += c), e.modifiersData[r] = a;
  }
  var wt = { name: "offset", enabled: true, phase: "main", requires: ["popperOffsets"], fn: tn };
  function nn(t) {
    var e = t.state, n = t.name;
    e.modifiersData[n] = mt({ reference: e.rects.reference, element: e.rects.popper, strategy: "absolute", placement: e.placement });
  }
  var He = { name: "popperOffsets", enabled: true, phase: "read", fn: nn, data: {} };
  function rn(t) {
    return t === "x" ? "y" : "x";
  }
  function on(t) {
    var e = t.state, n = t.options, r = t.name, o = n.mainAxis, i = o === void 0 ? true : o, a = n.altAxis, s = a === void 0 ? false : a, f = n.boundary, c = n.rootBoundary, u = n.altBoundary, m = n.padding, v = n.tether, l = v === void 0 ? true : v, h2 = n.tetherOffset, p = h2 === void 0 ? 0 : h2, g = ne(e, { boundary: f, rootBoundary: c, padding: m, altBoundary: u }), x = q(e.placement), y = te(e.placement), $ = !y, d = Le(x), b = rn(d), w = e.modifiersData.popperOffsets, O = e.rects.reference, j = e.rects.popper, A = typeof p == "function" ? p(Object.assign({}, e.rects, { placement: e.placement })) : p, k = typeof A == "number" ? { mainAxis: A, altAxis: A } : Object.assign({ mainAxis: 0, altAxis: 0 }, A), D = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, S = { x: 0, y: 0 };
    if (w) {
      if (i) {
        var L, re = d === "y" ? E : P, oe = d === "y" ? R : W, M = d === "y" ? "height" : "width", T = w[d], pe = T + g[re], _ = T - g[oe], ue = l ? -j[M] / 2 : 0, xe = y === U ? O[M] : j[M], ie = y === U ? -j[M] : -O[M], le = e.elements.arrow, z = l && le ? ke(le) : { width: 0, height: 0 }, V = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : st(), de = V[re], ae = V[oe], Y = fe(0, O[M], z[M]), jt = $ ? O[M] / 2 - ue - Y - de - k.mainAxis : xe - Y - de - k.mainAxis, Dt = $ ? -O[M] / 2 + ue + Y + ae + k.mainAxis : ie + Y + ae + k.mainAxis, Oe = e.elements.arrow && se(e.elements.arrow), Et = Oe ? d === "y" ? Oe.clientTop || 0 : Oe.clientLeft || 0 : 0, Ce = (L = D == null ? void 0 : D[d]) != null ? L : 0, Pt = T + jt - Ce - Et, At = T + Dt - Ce, qe = fe(l ? ve(pe, Pt) : pe, T, l ? X(_, At) : _);
        w[d] = qe, S[d] = qe - T;
      }
      if (s) {
        var Ve, kt = d === "x" ? E : P, Lt = d === "x" ? R : W, F = w[b], he = b === "y" ? "height" : "width", Ne = F + g[kt], Ie = F - g[Lt], $e = [E, P].indexOf(x) !== -1, _e = (Ve = D == null ? void 0 : D[b]) != null ? Ve : 0, ze = $e ? Ne : F - O[he] - j[he] - _e + k.altAxis, Fe = $e ? F + O[he] + j[he] - _e - k.altAxis : Ie, Ue = l && $e ? St(ze, F, Fe) : fe(l ? ze : Ne, F, l ? Fe : Ie);
        w[b] = Ue, S[b] = Ue - F;
      }
      e.modifiersData[r] = S;
    }
  }
  var xt = { name: "preventOverflow", enabled: true, phase: "main", fn: on, requiresIfExists: ["offset"] };
  function an(t) {
    return { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop };
  }
  function sn(t) {
    return t === H(t) || !B(t) ? We(t) : an(t);
  }
  function fn(t) {
    var e = t.getBoundingClientRect(), n = Z(e.width) / t.offsetWidth || 1, r = Z(e.height) / t.offsetHeight || 1;
    return n !== 1 || r !== 1;
  }
  function cn(t, e, n) {
    n === void 0 && (n = false);
    var r = B(e), o = B(e) && fn(e), i = I(e), a = ee(t, o), s = { scrollLeft: 0, scrollTop: 0 }, f = { x: 0, y: 0 };
    return (r || !r && !n) && ((C(e) !== "body" || Se(i)) && (s = sn(e)), B(e) ? (f = ee(e, true), f.x += e.clientLeft, f.y += e.clientTop) : i && (f.x = Be(i))), { x: a.left + s.scrollLeft - f.x, y: a.top + s.scrollTop - f.y, width: a.width, height: a.height };
  }
  function pn(t) {
    var e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), r = [];
    t.forEach(function(i) {
      e.set(i.name, i);
    });
    function o(i) {
      n.add(i.name);
      var a = [].concat(i.requires || [], i.requiresIfExists || []);
      a.forEach(function(s) {
        if (!n.has(s)) {
          var f = e.get(s);
          f && o(f);
        }
      }), r.push(i);
    }
    return t.forEach(function(i) {
      n.has(i.name) || o(i);
    }), r;
  }
  function un(t) {
    var e = pn(t);
    return ot.reduce(function(n, r) {
      return n.concat(e.filter(function(o) {
        return o.phase === r;
      }));
    }, []);
  }
  function ln(t) {
    var e;
    return function() {
      return e || (e = new Promise(function(n) {
        Promise.resolve().then(function() {
          e = void 0, n(t());
        });
      })), e;
    };
  }
  function dn(t) {
    var e = t.reduce(function(n, r) {
      var o = n[r.name];
      return n[r.name] = o ? Object.assign({}, o, r, { options: Object.assign({}, o.options, r.options), data: Object.assign({}, o.data, r.data) }) : r, n;
    }, {});
    return Object.keys(e).map(function(n) {
      return e[n];
    });
  }
  var Ot = { placement: "bottom", modifiers: [], strategy: "absolute" };
  function $t() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    return !e.some(function(r) {
      return !(r && typeof r.getBoundingClientRect == "function");
    });
  }
  function we(t) {
    t === void 0 && (t = {});
    var e = t, n = e.defaultModifiers, r = n === void 0 ? [] : n, o = e.defaultOptions, i = o === void 0 ? Ot : o;
    return function(a, s, f) {
      f === void 0 && (f = i);
      var c = { placement: "bottom", orderedModifiers: [], options: Object.assign({}, Ot, i), modifiersData: {}, elements: { reference: a, popper: s }, attributes: {}, styles: {} }, u = [], m = false, v = { state: c, setOptions: function(p) {
        var g = typeof p == "function" ? p(c.options) : p;
        h2(), c.options = Object.assign({}, i, c.options, g), c.scrollParents = { reference: Q(a) ? ce(a) : a.contextElement ? ce(a.contextElement) : [], popper: ce(s) };
        var x = un(dn([].concat(r, c.options.modifiers)));
        return c.orderedModifiers = x.filter(function(y) {
          return y.enabled;
        }), l(), v.update();
      }, forceUpdate: function() {
        if (!m) {
          var p = c.elements, g = p.reference, x = p.popper;
          if ($t(g, x)) {
            c.rects = { reference: cn(g, se(x), c.options.strategy === "fixed"), popper: ke(x) }, c.reset = false, c.placement = c.options.placement, c.orderedModifiers.forEach(function(j) {
              return c.modifiersData[j.name] = Object.assign({}, j.data);
            });
            for (var y = 0; y < c.orderedModifiers.length; y++) {
              if (c.reset === true) {
                c.reset = false, y = -1;
                continue;
              }
              var $ = c.orderedModifiers[y], d = $.fn, b = $.options, w = b === void 0 ? {} : b, O = $.name;
              typeof d == "function" && (c = d({ state: c, options: w, name: O, instance: v }) || c);
            }
          }
        }
      }, update: ln(function() {
        return new Promise(function(p) {
          v.forceUpdate(), p(c);
        });
      }), destroy: function() {
        h2(), m = true;
      } };
      if (!$t(a, s))
        return v;
      v.setOptions(f).then(function(p) {
        !m && f.onFirstUpdate && f.onFirstUpdate(p);
      });
      function l() {
        c.orderedModifiers.forEach(function(p) {
          var g = p.name, x = p.options, y = x === void 0 ? {} : x, $ = p.effect;
          if (typeof $ == "function") {
            var d = $({ state: c, name: g, instance: v, options: y }), b = function() {
            };
            u.push(d || b);
          }
        });
      }
      function h2() {
        u.forEach(function(p) {
          return p();
        }), u = [];
      }
      return v;
    };
  }
  we();
  var mn = [Re, He, Me, Ae];
  we({ defaultModifiers: mn });
  var gn = [Re, He, Me, Ae, wt, vt, xt, pt, bt], yn = we({ defaultModifiers: gn });
  const usePopper = (referenceElementRef, popperElementRef, opts = {}) => {
    const stateUpdater = {
      name: "updateState",
      enabled: true,
      phase: "write",
      fn: ({ state }) => {
        const derivedState = deriveState(state);
        Object.assign(states.value, derivedState);
      },
      requires: ["computeStyles"]
    };
    const options = vue.computed(() => {
      const { onFirstUpdate, placement, strategy, modifiers } = vue.unref(opts);
      return {
        onFirstUpdate,
        placement: placement || "bottom",
        strategy: strategy || "absolute",
        modifiers: [
          ...modifiers || [],
          stateUpdater,
          { name: "applyStyles", enabled: false }
        ]
      };
    });
    const instanceRef = vue.shallowRef();
    const states = vue.ref({
      styles: {
        popper: {
          position: vue.unref(options).strategy,
          left: "0",
          top: "0"
        },
        arrow: {
          position: "absolute"
        }
      },
      attributes: {}
    });
    const destroy = () => {
      if (!instanceRef.value)
        return;
      instanceRef.value.destroy();
      instanceRef.value = void 0;
    };
    vue.watch(options, (newOptions) => {
      const instance = vue.unref(instanceRef);
      if (instance) {
        instance.setOptions(newOptions);
      }
    }, {
      deep: true
    });
    vue.watch([referenceElementRef, popperElementRef], ([referenceElement, popperElement]) => {
      destroy();
      if (!referenceElement || !popperElement)
        return;
      instanceRef.value = yn(referenceElement, popperElement, vue.unref(options));
    });
    vue.onBeforeUnmount(() => {
      destroy();
    });
    return {
      state: vue.computed(() => {
        var _a2;
        return { ...((_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.state) || {} };
      }),
      styles: vue.computed(() => vue.unref(states).styles),
      attributes: vue.computed(() => vue.unref(states).attributes),
      update: () => {
        var _a2;
        return (_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.update();
      },
      forceUpdate: () => {
        var _a2;
        return (_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.forceUpdate();
      },
      instanceRef: vue.computed(() => vue.unref(instanceRef))
    };
  };
  function deriveState(state) {
    const elements = Object.keys(state.elements);
    const styles = fromPairs(elements.map((element) => [element, state.styles[element] || {}]));
    const attributes = fromPairs(elements.map((element) => [element, state.attributes[element]]));
    return {
      styles,
      attributes
    };
  }
  function useTimeout() {
    let timeoutHandle;
    const registerTimeout = (fn2, delay) => {
      cancelTimeout();
      timeoutHandle = window.setTimeout(fn2, delay);
    };
    const cancelTimeout = () => window.clearTimeout(timeoutHandle);
    tryOnScopeDispose(() => cancelTimeout());
    return {
      registerTimeout,
      cancelTimeout
    };
  }
  const defaultIdInjection = {
    prefix: Math.floor(Math.random() * 1e4),
    current: 0
  };
  const ID_INJECTION_KEY = Symbol("elIdInjection");
  const useIdInjection = () => {
    return vue.getCurrentInstance() ? vue.inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection;
  };
  const useId = (deterministicId) => {
    const idInjection = useIdInjection();
    const namespace = useGetDerivedNamespace();
    const idRef = vue.computed(() => vue.unref(deterministicId) || `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`);
    return idRef;
  };
  let registeredEscapeHandlers = [];
  const cachedHandler = (e) => {
    const event = e;
    if (event.key === EVENT_CODE.esc) {
      registeredEscapeHandlers.forEach((registeredHandler) => registeredHandler(event));
    }
  };
  const useEscapeKeydown = (handler) => {
    vue.onMounted(() => {
      if (registeredEscapeHandlers.length === 0) {
        document.addEventListener("keydown", cachedHandler);
      }
      if (isClient)
        registeredEscapeHandlers.push(handler);
    });
    vue.onBeforeUnmount(() => {
      registeredEscapeHandlers = registeredEscapeHandlers.filter((registeredHandler) => registeredHandler !== handler);
      if (registeredEscapeHandlers.length === 0) {
        if (isClient)
          document.removeEventListener("keydown", cachedHandler);
      }
    });
  };
  let cachedContainer;
  const usePopperContainerId = () => {
    const namespace = useGetDerivedNamespace();
    const idInjection = useIdInjection();
    const id = vue.computed(() => {
      return `${namespace.value}-popper-container-${idInjection.prefix}`;
    });
    const selector = vue.computed(() => `#${id.value}`);
    return {
      id,
      selector
    };
  };
  const createContainer = (id) => {
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
  };
  const usePopperContainer = () => {
    const { id, selector } = usePopperContainerId();
    vue.onBeforeMount(() => {
      if (!isClient)
        return;
      if (!cachedContainer && !document.body.querySelector(selector.value)) {
        cachedContainer = createContainer(id.value);
      }
    });
    return {
      id,
      selector
    };
  };
  const useDelayedToggleProps = buildProps({
    showAfter: {
      type: Number,
      default: 0
    },
    hideAfter: {
      type: Number,
      default: 200
    },
    autoClose: {
      type: Number,
      default: 0
    }
  });
  const useDelayedToggle = ({
    showAfter,
    hideAfter,
    autoClose,
    open,
    close
  }) => {
    const { registerTimeout } = useTimeout();
    const {
      registerTimeout: registerTimeoutForAutoClose,
      cancelTimeout: cancelTimeoutForAutoClose
    } = useTimeout();
    const onOpen = (event) => {
      registerTimeout(() => {
        open(event);
        const _autoClose = vue.unref(autoClose);
        if (isNumber(_autoClose) && _autoClose > 0) {
          registerTimeoutForAutoClose(() => {
            close(event);
          }, _autoClose);
        }
      }, vue.unref(showAfter));
    };
    const onClose = (event) => {
      cancelTimeoutForAutoClose();
      registerTimeout(() => {
        close(event);
      }, vue.unref(hideAfter));
    };
    return {
      onOpen,
      onClose
    };
  };
  const FORWARD_REF_INJECTION_KEY = Symbol("elForwardRef");
  const useForwardRef = (forwardRef) => {
    const setForwardRef = (el) => {
      forwardRef.value = el;
    };
    vue.provide(FORWARD_REF_INJECTION_KEY, {
      setForwardRef
    });
  };
  const useForwardRefDirective = (setForwardRef) => {
    return {
      mounted(el) {
        setForwardRef(el);
      },
      updated(el) {
        setForwardRef(el);
      },
      unmounted() {
        setForwardRef(null);
      }
    };
  };
  const initial = {
    current: 0
  };
  const zIndex = vue.ref(0);
  const defaultInitialZIndex = 2e3;
  const ZINDEX_INJECTION_KEY = Symbol("elZIndexContextKey");
  const zIndexContextKey = Symbol("zIndexContextKey");
  const useZIndex = (zIndexOverrides) => {
    const increasingInjection = vue.getCurrentInstance() ? vue.inject(ZINDEX_INJECTION_KEY, initial) : initial;
    const zIndexInjection = zIndexOverrides || (vue.getCurrentInstance() ? vue.inject(zIndexContextKey, void 0) : void 0);
    const initialZIndex = vue.computed(() => {
      const zIndexFromInjection = vue.unref(zIndexInjection);
      return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
    });
    const currentZIndex = vue.computed(() => initialZIndex.value + zIndex.value);
    const nextZIndex = () => {
      increasingInjection.current++;
      zIndex.value = increasingInjection.current;
      return currentZIndex.value;
    };
    if (!isClient && !vue.inject(ZINDEX_INJECTION_KEY))
      ;
    return {
      initialZIndex,
      currentZIndex,
      nextZIndex
    };
  };
  function useCursor(input) {
    const selectionRef = vue.ref();
    function recordCursor() {
      if (input.value == void 0)
        return;
      const { selectionStart, selectionEnd, value } = input.value;
      if (selectionStart == null || selectionEnd == null)
        return;
      const beforeTxt = value.slice(0, Math.max(0, selectionStart));
      const afterTxt = value.slice(Math.max(0, selectionEnd));
      selectionRef.value = {
        selectionStart,
        selectionEnd,
        value,
        beforeTxt,
        afterTxt
      };
    }
    function setCursor() {
      if (input.value == void 0 || selectionRef.value == void 0)
        return;
      const { value } = input.value;
      const { beforeTxt, afterTxt, selectionStart } = selectionRef.value;
      if (beforeTxt == void 0 || afterTxt == void 0 || selectionStart == void 0)
        return;
      let startPos = value.length;
      if (value.endsWith(afterTxt)) {
        startPos = value.length - afterTxt.length;
      } else if (value.startsWith(beforeTxt)) {
        startPos = beforeTxt.length;
      } else {
        const beforeLastChar = beforeTxt[selectionStart - 1];
        const newIndex = value.indexOf(beforeLastChar, selectionStart - 1);
        if (newIndex !== -1) {
          startPos = newIndex + 1;
        }
      }
      input.value.setSelectionRange(startPos, startPos);
    }
    return [recordCursor, setCursor];
  }
  const useSizeProp = buildProp({
    type: String,
    values: componentSizes,
    required: false
  });
  const SIZE_INJECTION_KEY = Symbol("size");
  const useGlobalSize = () => {
    const injectedSize = vue.inject(SIZE_INJECTION_KEY, {});
    return vue.computed(() => {
      return vue.unref(injectedSize.size) || "";
    });
  };
  function useFocusController(target, { afterFocus, beforeBlur, afterBlur } = {}) {
    const instance = vue.getCurrentInstance();
    const { emit } = instance;
    const wrapperRef = vue.shallowRef();
    const isFocused = vue.ref(false);
    const handleFocus = (event) => {
      if (isFocused.value)
        return;
      isFocused.value = true;
      emit("focus", event);
      afterFocus == null ? void 0 : afterFocus();
    };
    const handleBlur = (event) => {
      var _a2;
      const cancelBlur = isFunction$1(beforeBlur) ? beforeBlur(event) : false;
      if (cancelBlur || event.relatedTarget && ((_a2 = wrapperRef.value) == null ? void 0 : _a2.contains(event.relatedTarget)))
        return;
      isFocused.value = false;
      emit("blur", event);
      afterBlur == null ? void 0 : afterBlur();
    };
    const handleClick = () => {
      var _a2;
      (_a2 = target.value) == null ? void 0 : _a2.focus();
    };
    vue.watch(wrapperRef, (el) => {
      if (el) {
        el.setAttribute("tabindex", "-1");
      }
    });
    useEventListener(wrapperRef, "click", handleClick);
    return {
      wrapperRef,
      isFocused,
      handleFocus,
      handleBlur
    };
  }
  const DEFAULT_EMPTY_VALUES = ["", void 0, null];
  const DEFAULT_VALUE_ON_CLEAR = void 0;
  const useEmptyValuesProps = buildProps({
    emptyValues: Array,
    valueOnClear: {
      type: [String, Number, Boolean, Function],
      default: void 0,
      validator: (val) => isFunction$1(val) ? !val() : !val
    }
  });
  const useEmptyValues = (props, defaultValue) => {
    let config = useGlobalConfig();
    if (!config.value) {
      config = vue.ref({});
    }
    const emptyValues = vue.computed(() => props.emptyValues || config.value.emptyValues || DEFAULT_EMPTY_VALUES);
    const valueOnClear = vue.computed(() => {
      if (isFunction$1(props.valueOnClear)) {
        return props.valueOnClear();
      } else if (props.valueOnClear !== void 0) {
        return props.valueOnClear;
      } else if (isFunction$1(config.value.valueOnClear)) {
        return config.value.valueOnClear();
      } else if (config.value.valueOnClear !== void 0) {
        return config.value.valueOnClear;
      }
      return defaultValue !== void 0 ? defaultValue : DEFAULT_VALUE_ON_CLEAR;
    });
    const isEmptyValue = (value) => {
      return emptyValues.value.includes(value);
    };
    if (!emptyValues.value.includes(valueOnClear.value))
      ;
    return {
      emptyValues,
      valueOnClear,
      isEmptyValue
    };
  };
  const configProviderContextKey = Symbol();
  const globalConfig = vue.ref();
  function useGlobalConfig(key, defaultValue = void 0) {
    const config = vue.getCurrentInstance() ? vue.inject(configProviderContextKey, globalConfig) : globalConfig;
    if (key) {
      return vue.computed(() => {
        var _a2, _b;
        return (_b = (_a2 = config.value) == null ? void 0 : _a2[key]) != null ? _b : defaultValue;
      });
    } else {
      return config;
    }
  }
  var _export_sfc$1 = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const iconProps = buildProps({
    size: {
      type: definePropType([Number, String])
    },
    color: {
      type: String
    }
  });
  const __default__$b = vue.defineComponent({
    name: "ElIcon",
    inheritAttrs: false
  });
  const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
    ...__default__$b,
    props: iconProps,
    setup(__props) {
      const props = __props;
      const ns = useNamespace("icon");
      const style2 = vue.computed(() => {
        const { size, color } = props;
        if (!size && !color)
          return {};
        return {
          fontSize: isUndefined(size) ? void 0 : addUnit(size),
          "--color": color
        };
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("i", vue.mergeProps({
          class: vue.unref(ns).b(),
          style: vue.unref(style2)
        }, _ctx.$attrs), [
          vue.renderSlot(_ctx.$slots, "default")
        ], 16);
      };
    }
  });
  var Icon = /* @__PURE__ */ _export_sfc$1(_sfc_main$k, [["__file", "icon.vue"]]);
  const ElIcon = withInstall(Icon);
  const formContextKey = Symbol("formContextKey");
  const formItemContextKey = Symbol("formItemContextKey");
  const useFormSize = (fallback, ignore = {}) => {
    const emptyRef = vue.ref(void 0);
    const size = ignore.prop ? emptyRef : useProp("size");
    const globalConfig2 = ignore.global ? emptyRef : useGlobalSize();
    const form = ignore.form ? { size: void 0 } : vue.inject(formContextKey, void 0);
    const formItem = ignore.formItem ? { size: void 0 } : vue.inject(formItemContextKey, void 0);
    return vue.computed(() => size.value || vue.unref(fallback) || (formItem == null ? void 0 : formItem.size) || (form == null ? void 0 : form.size) || globalConfig2.value || "");
  };
  const useFormDisabled = (fallback) => {
    const disabled = useProp("disabled");
    const form = vue.inject(formContextKey, void 0);
    return vue.computed(() => disabled.value || vue.unref(fallback) || (form == null ? void 0 : form.disabled) || false);
  };
  const useFormItem = () => {
    const form = vue.inject(formContextKey, void 0);
    const formItem = vue.inject(formItemContextKey, void 0);
    return {
      form,
      formItem
    };
  };
  const useFormItemInputId = (props, {
    formItemContext,
    disableIdGeneration,
    disableIdManagement
  }) => {
    if (!disableIdGeneration) {
      disableIdGeneration = vue.ref(false);
    }
    if (!disableIdManagement) {
      disableIdManagement = vue.ref(false);
    }
    const inputId = vue.ref();
    let idUnwatch = void 0;
    const isLabeledByFormItem = vue.computed(() => {
      var _a2;
      return !!(!props.label && formItemContext && formItemContext.inputIds && ((_a2 = formItemContext.inputIds) == null ? void 0 : _a2.length) <= 1);
    });
    vue.onMounted(() => {
      idUnwatch = vue.watch([vue.toRef(props, "id"), disableIdGeneration], ([id, disableIdGeneration2]) => {
        const newId = id != null ? id : !disableIdGeneration2 ? useId().value : void 0;
        if (newId !== inputId.value) {
          if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
            inputId.value && formItemContext.removeInputId(inputId.value);
            if (!(disableIdManagement == null ? void 0 : disableIdManagement.value) && !disableIdGeneration2 && newId) {
              formItemContext.addInputId(newId);
            }
          }
          inputId.value = newId;
        }
      }, { immediate: true });
    });
    vue.onUnmounted(() => {
      idUnwatch && idUnwatch();
      if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
        inputId.value && formItemContext.removeInputId(inputId.value);
      }
    });
    return {
      isLabeledByFormItem,
      inputId
    };
  };
  let hiddenTextarea = void 0;
  const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  ${isFirefox() ? "" : "overflow:hidden !important;"}
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
`;
  const CONTEXT_STYLE = [
    "letter-spacing",
    "line-height",
    "padding-top",
    "padding-bottom",
    "font-family",
    "font-weight",
    "font-size",
    "text-rendering",
    "text-transform",
    "width",
    "text-indent",
    "padding-left",
    "padding-right",
    "border-width",
    "box-sizing"
  ];
  function calculateNodeStyling(targetElement) {
    const style2 = window.getComputedStyle(targetElement);
    const boxSizing = style2.getPropertyValue("box-sizing");
    const paddingSize = Number.parseFloat(style2.getPropertyValue("padding-bottom")) + Number.parseFloat(style2.getPropertyValue("padding-top"));
    const borderSize = Number.parseFloat(style2.getPropertyValue("border-bottom-width")) + Number.parseFloat(style2.getPropertyValue("border-top-width"));
    const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style2.getPropertyValue(name)}`).join(";");
    return { contextStyle, paddingSize, borderSize, boxSizing };
  }
  function calcTextareaHeight(targetElement, minRows = 1, maxRows) {
    var _a2;
    if (!hiddenTextarea) {
      hiddenTextarea = document.createElement("textarea");
      document.body.appendChild(hiddenTextarea);
    }
    const { paddingSize, borderSize, boxSizing, contextStyle } = calculateNodeStyling(targetElement);
    hiddenTextarea.setAttribute("style", `${contextStyle};${HIDDEN_STYLE}`);
    hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";
    let height = hiddenTextarea.scrollHeight;
    const result = {};
    if (boxSizing === "border-box") {
      height = height + borderSize;
    } else if (boxSizing === "content-box") {
      height = height - paddingSize;
    }
    hiddenTextarea.value = "";
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (isNumber(minRows)) {
      let minHeight = singleRowHeight * minRows;
      if (boxSizing === "border-box") {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
      result.minHeight = `${minHeight}px`;
    }
    if (isNumber(maxRows)) {
      let maxHeight = singleRowHeight * maxRows;
      if (boxSizing === "border-box") {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      height = Math.min(maxHeight, height);
    }
    result.height = `${height}px`;
    (_a2 = hiddenTextarea.parentNode) == null ? void 0 : _a2.removeChild(hiddenTextarea);
    hiddenTextarea = void 0;
    return result;
  }
  const inputProps = buildProps({
    id: {
      type: String,
      default: void 0
    },
    size: useSizeProp,
    disabled: Boolean,
    modelValue: {
      type: definePropType([
        String,
        Number,
        Object
      ]),
      default: ""
    },
    maxlength: {
      type: [String, Number]
    },
    minlength: {
      type: [String, Number]
    },
    type: {
      type: String,
      default: "text"
    },
    resize: {
      type: String,
      values: ["none", "both", "horizontal", "vertical"]
    },
    autosize: {
      type: definePropType([Boolean, Object]),
      default: false
    },
    autocomplete: {
      type: String,
      default: "off"
    },
    formatter: {
      type: Function
    },
    parser: {
      type: Function
    },
    placeholder: {
      type: String
    },
    form: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    suffixIcon: {
      type: iconPropType
    },
    prefixIcon: {
      type: iconPropType
    },
    containerRole: {
      type: String,
      default: void 0
    },
    label: {
      type: String,
      default: void 0
    },
    tabindex: {
      type: [String, Number],
      default: 0
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    inputStyle: {
      type: definePropType([Object, Array, String]),
      default: () => mutable({})
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  });
  const inputEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isString(value),
    input: (value) => isString(value),
    change: (value) => isString(value),
    focus: (evt) => evt instanceof FocusEvent,
    blur: (evt) => evt instanceof FocusEvent,
    clear: () => true,
    mouseleave: (evt) => evt instanceof MouseEvent,
    mouseenter: (evt) => evt instanceof MouseEvent,
    keydown: (evt) => evt instanceof Event,
    compositionstart: (evt) => evt instanceof CompositionEvent,
    compositionupdate: (evt) => evt instanceof CompositionEvent,
    compositionend: (evt) => evt instanceof CompositionEvent
  };
  const _hoisted_1$6 = ["role"];
  const _hoisted_2$4 = ["id", "minlength", "maxlength", "type", "disabled", "readonly", "autocomplete", "tabindex", "aria-label", "placeholder", "form", "autofocus"];
  const _hoisted_3$2 = ["id", "minlength", "maxlength", "tabindex", "disabled", "readonly", "autocomplete", "aria-label", "placeholder", "form", "autofocus"];
  const __default__$a = vue.defineComponent({
    name: "ElInput",
    inheritAttrs: false
  });
  const _sfc_main$j = /* @__PURE__ */ vue.defineComponent({
    ...__default__$a,
    props: inputProps,
    emits: inputEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const rawAttrs = vue.useAttrs();
      const slots = vue.useSlots();
      const containerAttrs = vue.computed(() => {
        const comboBoxAttrs = {};
        if (props.containerRole === "combobox") {
          comboBoxAttrs["aria-haspopup"] = rawAttrs["aria-haspopup"];
          comboBoxAttrs["aria-owns"] = rawAttrs["aria-owns"];
          comboBoxAttrs["aria-expanded"] = rawAttrs["aria-expanded"];
        }
        return comboBoxAttrs;
      });
      const containerKls = vue.computed(() => [
        props.type === "textarea" ? nsTextarea.b() : nsInput.b(),
        nsInput.m(inputSize.value),
        nsInput.is("disabled", inputDisabled.value),
        nsInput.is("exceed", inputExceed.value),
        {
          [nsInput.b("group")]: slots.prepend || slots.append,
          [nsInput.bm("group", "append")]: slots.append,
          [nsInput.bm("group", "prepend")]: slots.prepend,
          [nsInput.m("prefix")]: slots.prefix || props.prefixIcon,
          [nsInput.m("suffix")]: slots.suffix || props.suffixIcon || props.clearable || props.showPassword,
          [nsInput.bm("suffix", "password-clear")]: showClear.value && showPwdVisible.value,
          [nsInput.b("hidden")]: props.type === "hidden"
        },
        rawAttrs.class
      ]);
      const wrapperKls = vue.computed(() => [
        nsInput.e("wrapper"),
        nsInput.is("focus", isFocused.value)
      ]);
      const attrs = useAttrs({
        excludeKeys: vue.computed(() => {
          return Object.keys(containerAttrs.value);
        })
      });
      const { form: elForm, formItem: elFormItem } = useFormItem();
      const { inputId } = useFormItemInputId(props, {
        formItemContext: elFormItem
      });
      const inputSize = useFormSize();
      const inputDisabled = useFormDisabled();
      const nsInput = useNamespace("input");
      const nsTextarea = useNamespace("textarea");
      const input = vue.shallowRef();
      const textarea = vue.shallowRef();
      const hovering = vue.ref(false);
      const isComposing = vue.ref(false);
      const passwordVisible = vue.ref(false);
      const countStyle = vue.ref();
      const textareaCalcStyle = vue.shallowRef(props.inputStyle);
      const _ref = vue.computed(() => input.value || textarea.value);
      const { wrapperRef, isFocused, handleFocus, handleBlur } = useFocusController(_ref, {
        afterBlur() {
          var _a2;
          if (props.validateEvent) {
            (_a2 = elFormItem == null ? void 0 : elFormItem.validate) == null ? void 0 : _a2.call(elFormItem, "blur").catch((err) => debugWarn());
          }
        }
      });
      const needStatusIcon = vue.computed(() => {
        var _a2;
        return (_a2 = elForm == null ? void 0 : elForm.statusIcon) != null ? _a2 : false;
      });
      const validateState = vue.computed(() => (elFormItem == null ? void 0 : elFormItem.validateState) || "");
      const validateIcon = vue.computed(() => validateState.value && ValidateComponentsMap[validateState.value]);
      const passwordIcon = vue.computed(() => passwordVisible.value ? view_default : hide_default);
      const containerStyle = vue.computed(() => [
        rawAttrs.style
      ]);
      const textareaStyle = vue.computed(() => [
        props.inputStyle,
        textareaCalcStyle.value,
        { resize: props.resize }
      ]);
      const nativeInputValue = vue.computed(() => isNil(props.modelValue) ? "" : String(props.modelValue));
      const showClear = vue.computed(() => props.clearable && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (isFocused.value || hovering.value));
      const showPwdVisible = vue.computed(() => props.showPassword && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (!!nativeInputValue.value || isFocused.value));
      const isWordLimitVisible = vue.computed(() => props.showWordLimit && !!props.maxlength && (props.type === "text" || props.type === "textarea") && !inputDisabled.value && !props.readonly && !props.showPassword);
      const textLength = vue.computed(() => nativeInputValue.value.length);
      const inputExceed = vue.computed(() => !!isWordLimitVisible.value && textLength.value > Number(props.maxlength));
      const suffixVisible = vue.computed(() => !!slots.suffix || !!props.suffixIcon || showClear.value || props.showPassword || isWordLimitVisible.value || !!validateState.value && needStatusIcon.value);
      const [recordCursor, setCursor] = useCursor(input);
      useResizeObserver(textarea, (entries) => {
        onceInitSizeTextarea();
        if (!isWordLimitVisible.value || props.resize !== "both")
          return;
        const entry = entries[0];
        const { width } = entry.contentRect;
        countStyle.value = {
          right: `calc(100% - ${width + 15 + 6}px)`
        };
      });
      const resizeTextarea = () => {
        const { type, autosize } = props;
        if (!isClient || type !== "textarea" || !textarea.value)
          return;
        if (autosize) {
          const minRows = isObject$1(autosize) ? autosize.minRows : void 0;
          const maxRows = isObject$1(autosize) ? autosize.maxRows : void 0;
          const textareaStyle2 = calcTextareaHeight(textarea.value, minRows, maxRows);
          textareaCalcStyle.value = {
            overflowY: "hidden",
            ...textareaStyle2
          };
          vue.nextTick(() => {
            textarea.value.offsetHeight;
            textareaCalcStyle.value = textareaStyle2;
          });
        } else {
          textareaCalcStyle.value = {
            minHeight: calcTextareaHeight(textarea.value).minHeight
          };
        }
      };
      const createOnceInitResize = (resizeTextarea2) => {
        let isInit = false;
        return () => {
          var _a2;
          if (isInit || !props.autosize)
            return;
          const isElHidden = ((_a2 = textarea.value) == null ? void 0 : _a2.offsetParent) === null;
          if (!isElHidden) {
            resizeTextarea2();
            isInit = true;
          }
        };
      };
      const onceInitSizeTextarea = createOnceInitResize(resizeTextarea);
      const setNativeInputValue = () => {
        const input2 = _ref.value;
        const formatterValue = props.formatter ? props.formatter(nativeInputValue.value) : nativeInputValue.value;
        if (!input2 || input2.value === formatterValue)
          return;
        input2.value = formatterValue;
      };
      const handleInput = async (event) => {
        recordCursor();
        let { value } = event.target;
        if (props.formatter) {
          value = props.parser ? props.parser(value) : value;
        }
        if (isComposing.value)
          return;
        if (value === nativeInputValue.value) {
          setNativeInputValue();
          return;
        }
        emit(UPDATE_MODEL_EVENT, value);
        emit("input", value);
        await vue.nextTick();
        setNativeInputValue();
        setCursor();
      };
      const handleChange = (event) => {
        emit("change", event.target.value);
      };
      const handleCompositionStart = (event) => {
        emit("compositionstart", event);
        isComposing.value = true;
      };
      const handleCompositionUpdate = (event) => {
        var _a2;
        emit("compositionupdate", event);
        const text = (_a2 = event.target) == null ? void 0 : _a2.value;
        const lastCharacter = text[text.length - 1] || "";
        isComposing.value = !isKorean(lastCharacter);
      };
      const handleCompositionEnd = (event) => {
        emit("compositionend", event);
        if (isComposing.value) {
          isComposing.value = false;
          handleInput(event);
        }
      };
      const handlePasswordVisible = () => {
        passwordVisible.value = !passwordVisible.value;
        focus();
      };
      const focus = async () => {
        var _a2;
        await vue.nextTick();
        (_a2 = _ref.value) == null ? void 0 : _a2.focus();
      };
      const blur = () => {
        var _a2;
        return (_a2 = _ref.value) == null ? void 0 : _a2.blur();
      };
      const handleMouseLeave = (evt) => {
        hovering.value = false;
        emit("mouseleave", evt);
      };
      const handleMouseEnter = (evt) => {
        hovering.value = true;
        emit("mouseenter", evt);
      };
      const handleKeydown = (evt) => {
        emit("keydown", evt);
      };
      const select = () => {
        var _a2;
        (_a2 = _ref.value) == null ? void 0 : _a2.select();
      };
      const clear = () => {
        emit(UPDATE_MODEL_EVENT, "");
        emit("change", "");
        emit("clear");
        emit("input", "");
      };
      vue.watch(() => props.modelValue, () => {
        var _a2;
        vue.nextTick(() => resizeTextarea());
        if (props.validateEvent) {
          (_a2 = elFormItem == null ? void 0 : elFormItem.validate) == null ? void 0 : _a2.call(elFormItem, "change").catch((err) => debugWarn());
        }
      });
      vue.watch(nativeInputValue, () => setNativeInputValue());
      vue.watch(() => props.type, async () => {
        await vue.nextTick();
        setNativeInputValue();
        resizeTextarea();
      });
      vue.onMounted(() => {
        if (!props.formatter && props.parser)
          ;
        setNativeInputValue();
        vue.nextTick(resizeTextarea);
      });
      expose({
        input,
        textarea,
        ref: _ref,
        textareaStyle,
        autosize: vue.toRef(props, "autosize"),
        focus,
        blur,
        select,
        clear,
        resizeTextarea
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(vue.unref(containerAttrs), {
          class: vue.unref(containerKls),
          style: vue.unref(containerStyle),
          role: _ctx.containerRole,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave
        }), [
          vue.createCommentVNode(" input "),
          _ctx.type !== "textarea" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            vue.createCommentVNode(" prepend slot "),
            _ctx.$slots.prepend ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: vue.normalizeClass(vue.unref(nsInput).be("group", "prepend"))
            }, [
              vue.renderSlot(_ctx.$slots, "prepend")
            ], 2)) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("div", {
              ref_key: "wrapperRef",
              ref: wrapperRef,
              class: vue.normalizeClass(vue.unref(wrapperKls))
            }, [
              vue.createCommentVNode(" prefix slot "),
              _ctx.$slots.prefix || _ctx.prefixIcon ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(vue.unref(nsInput).e("prefix"))
              }, [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(nsInput).e("prefix-inner"))
                }, [
                  vue.renderSlot(_ctx.$slots, "prefix"),
                  _ctx.prefixIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(nsInput).e("icon"))
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.prefixIcon)))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                ], 2)
              ], 2)) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("input", vue.mergeProps({
                id: vue.unref(inputId),
                ref_key: "input",
                ref: input,
                class: vue.unref(nsInput).e("inner")
              }, vue.unref(attrs), {
                minlength: _ctx.minlength,
                maxlength: _ctx.maxlength,
                type: _ctx.showPassword ? passwordVisible.value ? "text" : "password" : _ctx.type,
                disabled: vue.unref(inputDisabled),
                readonly: _ctx.readonly,
                autocomplete: _ctx.autocomplete,
                tabindex: _ctx.tabindex,
                "aria-label": _ctx.label,
                placeholder: _ctx.placeholder,
                style: _ctx.inputStyle,
                form: _ctx.form,
                autofocus: _ctx.autofocus,
                onCompositionstart: handleCompositionStart,
                onCompositionupdate: handleCompositionUpdate,
                onCompositionend: handleCompositionEnd,
                onInput: handleInput,
                onFocus: _cache[0] || (_cache[0] = (...args) => vue.unref(handleFocus) && vue.unref(handleFocus)(...args)),
                onBlur: _cache[1] || (_cache[1] = (...args) => vue.unref(handleBlur) && vue.unref(handleBlur)(...args)),
                onChange: handleChange,
                onKeydown: handleKeydown
              }), null, 16, _hoisted_2$4),
              vue.createCommentVNode(" suffix slot "),
              vue.unref(suffixVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 1,
                class: vue.normalizeClass(vue.unref(nsInput).e("suffix"))
              }, [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(nsInput).e("suffix-inner"))
                }, [
                  !vue.unref(showClear) || !vue.unref(showPwdVisible) || !vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    vue.renderSlot(_ctx.$slots, "suffix"),
                    _ctx.suffixIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                      key: 0,
                      class: vue.normalizeClass(vue.unref(nsInput).e("icon"))
                    }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.suffixIcon)))
                      ]),
                      _: 1
                    }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                  ], 64)) : vue.createCommentVNode("v-if", true),
                  vue.unref(showClear) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 1,
                    class: vue.normalizeClass([vue.unref(nsInput).e("icon"), vue.unref(nsInput).e("clear")]),
                    onMousedown: vue.withModifiers(vue.unref(NOOP), ["prevent"]),
                    onClick: clear
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(circle_close_default))
                    ]),
                    _: 1
                  }, 8, ["class", "onMousedown"])) : vue.createCommentVNode("v-if", true),
                  vue.unref(showPwdVisible) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 2,
                    class: vue.normalizeClass([vue.unref(nsInput).e("icon"), vue.unref(nsInput).e("password")]),
                    onClick: handlePasswordVisible
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(passwordIcon))))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
                  vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 3,
                    class: vue.normalizeClass(vue.unref(nsInput).e("count"))
                  }, [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(vue.unref(nsInput).e("count-inner"))
                    }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(_ctx.maxlength), 3)
                  ], 2)) : vue.createCommentVNode("v-if", true),
                  vue.unref(validateState) && vue.unref(validateIcon) && vue.unref(needStatusIcon) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 4,
                    class: vue.normalizeClass([
                      vue.unref(nsInput).e("icon"),
                      vue.unref(nsInput).e("validateIcon"),
                      vue.unref(nsInput).is("loading", vue.unref(validateState) === "validating")
                    ])
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(validateIcon))))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                ], 2)
              ], 2)) : vue.createCommentVNode("v-if", true)
            ], 2),
            vue.createCommentVNode(" append slot "),
            _ctx.$slots.append ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              class: vue.normalizeClass(vue.unref(nsInput).be("group", "append"))
            }, [
              vue.renderSlot(_ctx.$slots, "append")
            ], 2)) : vue.createCommentVNode("v-if", true)
          ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createCommentVNode(" textarea "),
            vue.createElementVNode("textarea", vue.mergeProps({
              id: vue.unref(inputId),
              ref_key: "textarea",
              ref: textarea,
              class: vue.unref(nsTextarea).e("inner")
            }, vue.unref(attrs), {
              minlength: _ctx.minlength,
              maxlength: _ctx.maxlength,
              tabindex: _ctx.tabindex,
              disabled: vue.unref(inputDisabled),
              readonly: _ctx.readonly,
              autocomplete: _ctx.autocomplete,
              style: vue.unref(textareaStyle),
              "aria-label": _ctx.label,
              placeholder: _ctx.placeholder,
              form: _ctx.form,
              autofocus: _ctx.autofocus,
              onCompositionstart: handleCompositionStart,
              onCompositionupdate: handleCompositionUpdate,
              onCompositionend: handleCompositionEnd,
              onInput: handleInput,
              onFocus: _cache[2] || (_cache[2] = (...args) => vue.unref(handleFocus) && vue.unref(handleFocus)(...args)),
              onBlur: _cache[3] || (_cache[3] = (...args) => vue.unref(handleBlur) && vue.unref(handleBlur)(...args)),
              onChange: handleChange,
              onKeydown: handleKeydown
            }), null, 16, _hoisted_3$2),
            vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              style: vue.normalizeStyle(countStyle.value),
              class: vue.normalizeClass(vue.unref(nsInput).e("count"))
            }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(_ctx.maxlength), 7)) : vue.createCommentVNode("v-if", true)
          ], 64))
        ], 16, _hoisted_1$6);
      };
    }
  });
  var Input = /* @__PURE__ */ _export_sfc$1(_sfc_main$j, [["__file", "input.vue"]]);
  const ElInput = withInstall(Input);
  const GAP = 4;
  const BAR_MAP = {
    vertical: {
      offset: "offsetHeight",
      scroll: "scrollTop",
      scrollSize: "scrollHeight",
      size: "height",
      key: "vertical",
      axis: "Y",
      client: "clientY",
      direction: "top"
    },
    horizontal: {
      offset: "offsetWidth",
      scroll: "scrollLeft",
      scrollSize: "scrollWidth",
      size: "width",
      key: "horizontal",
      axis: "X",
      client: "clientX",
      direction: "left"
    }
  };
  const renderThumbStyle = ({
    move,
    size,
    bar
  }) => ({
    [bar.size]: size,
    transform: `translate${bar.axis}(${move}%)`
  });
  const scrollbarContextKey = Symbol("scrollbarContextKey");
  const thumbProps = buildProps({
    vertical: Boolean,
    size: String,
    move: Number,
    ratio: {
      type: Number,
      required: true
    },
    always: Boolean
  });
  const COMPONENT_NAME$2 = "Thumb";
  const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
    __name: "thumb",
    props: thumbProps,
    setup(__props) {
      const props = __props;
      const scrollbar = vue.inject(scrollbarContextKey);
      const ns = useNamespace("scrollbar");
      if (!scrollbar)
        throwError(COMPONENT_NAME$2, "can not inject scrollbar context");
      const instance = vue.ref();
      const thumb = vue.ref();
      const thumbState = vue.ref({});
      const visible = vue.ref(false);
      let cursorDown = false;
      let cursorLeave = false;
      let originalOnSelectStart = isClient ? document.onselectstart : null;
      const bar = vue.computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"]);
      const thumbStyle = vue.computed(() => renderThumbStyle({
        size: props.size,
        move: props.move,
        bar: bar.value
      }));
      const offsetRatio = vue.computed(() => instance.value[bar.value.offset] ** 2 / scrollbar.wrapElement[bar.value.scrollSize] / props.ratio / thumb.value[bar.value.offset]);
      const clickThumbHandler = (e) => {
        var _a2;
        e.stopPropagation();
        if (e.ctrlKey || [1, 2].includes(e.button))
          return;
        (_a2 = window.getSelection()) == null ? void 0 : _a2.removeAllRanges();
        startDrag(e);
        const el = e.currentTarget;
        if (!el)
          return;
        thumbState.value[bar.value.axis] = el[bar.value.offset] - (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction]);
      };
      const clickTrackHandler = (e) => {
        if (!thumb.value || !instance.value || !scrollbar.wrapElement)
          return;
        const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
        const thumbHalf = thumb.value[bar.value.offset] / 2;
        const thumbPositionPercentage = (offset - thumbHalf) * 100 * offsetRatio.value / instance.value[bar.value.offset];
        scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
      };
      const startDrag = (e) => {
        e.stopImmediatePropagation();
        cursorDown = true;
        document.addEventListener("mousemove", mouseMoveDocumentHandler);
        document.addEventListener("mouseup", mouseUpDocumentHandler);
        originalOnSelectStart = document.onselectstart;
        document.onselectstart = () => false;
      };
      const mouseMoveDocumentHandler = (e) => {
        if (!instance.value || !thumb.value)
          return;
        if (cursorDown === false)
          return;
        const prevPage = thumbState.value[bar.value.axis];
        if (!prevPage)
          return;
        const offset = (instance.value.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1;
        const thumbClickPosition = thumb.value[bar.value.offset] - prevPage;
        const thumbPositionPercentage = (offset - thumbClickPosition) * 100 * offsetRatio.value / instance.value[bar.value.offset];
        scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
      };
      const mouseUpDocumentHandler = () => {
        cursorDown = false;
        thumbState.value[bar.value.axis] = 0;
        document.removeEventListener("mousemove", mouseMoveDocumentHandler);
        document.removeEventListener("mouseup", mouseUpDocumentHandler);
        restoreOnselectstart();
        if (cursorLeave)
          visible.value = false;
      };
      const mouseMoveScrollbarHandler = () => {
        cursorLeave = false;
        visible.value = !!props.size;
      };
      const mouseLeaveScrollbarHandler = () => {
        cursorLeave = true;
        visible.value = cursorDown;
      };
      vue.onBeforeUnmount(() => {
        restoreOnselectstart();
        document.removeEventListener("mouseup", mouseUpDocumentHandler);
      });
      const restoreOnselectstart = () => {
        if (document.onselectstart !== originalOnSelectStart)
          document.onselectstart = originalOnSelectStart;
      };
      useEventListener(vue.toRef(scrollbar, "scrollbarElement"), "mousemove", mouseMoveScrollbarHandler);
      useEventListener(vue.toRef(scrollbar, "scrollbarElement"), "mouseleave", mouseLeaveScrollbarHandler);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, {
          name: vue.unref(ns).b("fade"),
          persisted: ""
        }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", {
              ref_key: "instance",
              ref: instance,
              class: vue.normalizeClass([vue.unref(ns).e("bar"), vue.unref(ns).is(vue.unref(bar).key)]),
              onMousedown: clickTrackHandler
            }, [
              vue.createElementVNode("div", {
                ref_key: "thumb",
                ref: thumb,
                class: vue.normalizeClass(vue.unref(ns).e("thumb")),
                style: vue.normalizeStyle(vue.unref(thumbStyle)),
                onMousedown: clickThumbHandler
              }, null, 38)
            ], 34), [
              [vue.vShow, _ctx.always || visible.value]
            ])
          ]),
          _: 1
        }, 8, ["name"]);
      };
    }
  });
  var Thumb = /* @__PURE__ */ _export_sfc$1(_sfc_main$i, [["__file", "thumb.vue"]]);
  const barProps = buildProps({
    always: {
      type: Boolean,
      default: true
    },
    minSize: {
      type: Number,
      required: true
    }
  });
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
    __name: "bar",
    props: barProps,
    setup(__props, { expose }) {
      const props = __props;
      const scrollbar = vue.inject(scrollbarContextKey);
      const moveX = vue.ref(0);
      const moveY = vue.ref(0);
      const sizeWidth = vue.ref("");
      const sizeHeight = vue.ref("");
      const ratioY = vue.ref(1);
      const ratioX = vue.ref(1);
      const handleScroll = (wrap) => {
        if (wrap) {
          const offsetHeight = wrap.offsetHeight - GAP;
          const offsetWidth = wrap.offsetWidth - GAP;
          moveY.value = wrap.scrollTop * 100 / offsetHeight * ratioY.value;
          moveX.value = wrap.scrollLeft * 100 / offsetWidth * ratioX.value;
        }
      };
      const update = () => {
        const wrap = scrollbar == null ? void 0 : scrollbar.wrapElement;
        if (!wrap)
          return;
        const offsetHeight = wrap.offsetHeight - GAP;
        const offsetWidth = wrap.offsetWidth - GAP;
        const originalHeight = offsetHeight ** 2 / wrap.scrollHeight;
        const originalWidth = offsetWidth ** 2 / wrap.scrollWidth;
        const height = Math.max(originalHeight, props.minSize);
        const width = Math.max(originalWidth, props.minSize);
        ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
        ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));
        sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : "";
        sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : "";
      };
      expose({
        handleScroll,
        update
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(Thumb, {
            move: moveX.value,
            ratio: ratioX.value,
            size: sizeWidth.value,
            always: _ctx.always
          }, null, 8, ["move", "ratio", "size", "always"]),
          vue.createVNode(Thumb, {
            move: moveY.value,
            ratio: ratioY.value,
            size: sizeHeight.value,
            vertical: "",
            always: _ctx.always
          }, null, 8, ["move", "ratio", "size", "always"])
        ], 64);
      };
    }
  });
  var Bar = /* @__PURE__ */ _export_sfc$1(_sfc_main$h, [["__file", "bar.vue"]]);
  const scrollbarProps = buildProps({
    height: {
      type: [String, Number],
      default: ""
    },
    maxHeight: {
      type: [String, Number],
      default: ""
    },
    native: {
      type: Boolean,
      default: false
    },
    wrapStyle: {
      type: definePropType([String, Object, Array]),
      default: ""
    },
    wrapClass: {
      type: [String, Array],
      default: ""
    },
    viewClass: {
      type: [String, Array],
      default: ""
    },
    viewStyle: {
      type: [String, Array, Object],
      default: ""
    },
    noresize: Boolean,
    tag: {
      type: String,
      default: "div"
    },
    always: Boolean,
    minSize: {
      type: Number,
      default: 20
    },
    id: String,
    role: String,
    ariaLabel: String,
    ariaOrientation: {
      type: String,
      values: ["horizontal", "vertical"]
    }
  });
  const scrollbarEmits = {
    scroll: ({
      scrollTop,
      scrollLeft
    }) => [scrollTop, scrollLeft].every(isNumber)
  };
  const COMPONENT_NAME$1 = "ElScrollbar";
  const __default__$9 = vue.defineComponent({
    name: COMPONENT_NAME$1
  });
  const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
    ...__default__$9,
    props: scrollbarProps,
    emits: scrollbarEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const ns = useNamespace("scrollbar");
      let stopResizeObserver = void 0;
      let stopResizeListener = void 0;
      const scrollbarRef = vue.ref();
      const wrapRef = vue.ref();
      const resizeRef = vue.ref();
      const barRef = vue.ref();
      const wrapStyle = vue.computed(() => {
        const style2 = {};
        if (props.height)
          style2.height = addUnit(props.height);
        if (props.maxHeight)
          style2.maxHeight = addUnit(props.maxHeight);
        return [props.wrapStyle, style2];
      });
      const wrapKls = vue.computed(() => {
        return [
          props.wrapClass,
          ns.e("wrap"),
          { [ns.em("wrap", "hidden-default")]: !props.native }
        ];
      });
      const resizeKls = vue.computed(() => {
        return [ns.e("view"), props.viewClass];
      });
      const handleScroll = () => {
        var _a2;
        if (wrapRef.value) {
          (_a2 = barRef.value) == null ? void 0 : _a2.handleScroll(wrapRef.value);
          emit("scroll", {
            scrollTop: wrapRef.value.scrollTop,
            scrollLeft: wrapRef.value.scrollLeft
          });
        }
      };
      function scrollTo(arg1, arg2) {
        if (isObject$1(arg1)) {
          wrapRef.value.scrollTo(arg1);
        } else if (isNumber(arg1) && isNumber(arg2)) {
          wrapRef.value.scrollTo(arg1, arg2);
        }
      }
      const setScrollTop = (value) => {
        if (!isNumber(value)) {
          return;
        }
        wrapRef.value.scrollTop = value;
      };
      const setScrollLeft = (value) => {
        if (!isNumber(value)) {
          return;
        }
        wrapRef.value.scrollLeft = value;
      };
      const update = () => {
        var _a2;
        (_a2 = barRef.value) == null ? void 0 : _a2.update();
      };
      vue.watch(() => props.noresize, (noresize) => {
        if (noresize) {
          stopResizeObserver == null ? void 0 : stopResizeObserver();
          stopResizeListener == null ? void 0 : stopResizeListener();
        } else {
          ({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update));
          stopResizeListener = useEventListener("resize", update);
        }
      }, { immediate: true });
      vue.watch(() => [props.maxHeight, props.height], () => {
        if (!props.native)
          vue.nextTick(() => {
            var _a2;
            update();
            if (wrapRef.value) {
              (_a2 = barRef.value) == null ? void 0 : _a2.handleScroll(wrapRef.value);
            }
          });
      });
      vue.provide(scrollbarContextKey, vue.reactive({
        scrollbarElement: scrollbarRef,
        wrapElement: wrapRef
      }));
      vue.onMounted(() => {
        if (!props.native)
          vue.nextTick(() => {
            update();
          });
      });
      vue.onUpdated(() => update());
      expose({
        wrapRef,
        update,
        scrollTo,
        setScrollTop,
        setScrollLeft,
        handleScroll
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "scrollbarRef",
          ref: scrollbarRef,
          class: vue.normalizeClass(vue.unref(ns).b())
        }, [
          vue.createElementVNode("div", {
            ref_key: "wrapRef",
            ref: wrapRef,
            class: vue.normalizeClass(vue.unref(wrapKls)),
            style: vue.normalizeStyle(vue.unref(wrapStyle)),
            onScroll: handleScroll
          }, [
            (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
              id: _ctx.id,
              ref_key: "resizeRef",
              ref: resizeRef,
              class: vue.normalizeClass(vue.unref(resizeKls)),
              style: vue.normalizeStyle(_ctx.viewStyle),
              role: _ctx.role,
              "aria-label": _ctx.ariaLabel,
              "aria-orientation": _ctx.ariaOrientation
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["id", "class", "style", "role", "aria-label", "aria-orientation"]))
          ], 38),
          !_ctx.native ? (vue.openBlock(), vue.createBlock(Bar, {
            key: 0,
            ref_key: "barRef",
            ref: barRef,
            always: _ctx.always,
            "min-size": _ctx.minSize
          }, null, 8, ["always", "min-size"])) : vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  });
  var Scrollbar = /* @__PURE__ */ _export_sfc$1(_sfc_main$g, [["__file", "scrollbar.vue"]]);
  const ElScrollbar = withInstall(Scrollbar);
  const POPPER_INJECTION_KEY = Symbol("popper");
  const POPPER_CONTENT_INJECTION_KEY = Symbol("popperContent");
  const roleTypes = [
    "dialog",
    "grid",
    "group",
    "listbox",
    "menu",
    "navigation",
    "tooltip",
    "tree"
  ];
  const popperProps = buildProps({
    role: {
      type: String,
      values: roleTypes,
      default: "tooltip"
    }
  });
  const __default__$8 = vue.defineComponent({
    name: "ElPopper",
    inheritAttrs: false
  });
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    ...__default__$8,
    props: popperProps,
    setup(__props, { expose }) {
      const props = __props;
      const triggerRef = vue.ref();
      const popperInstanceRef = vue.ref();
      const contentRef = vue.ref();
      const referenceRef = vue.ref();
      const role = vue.computed(() => props.role);
      const popperProvides = {
        triggerRef,
        popperInstanceRef,
        contentRef,
        referenceRef,
        role
      };
      expose(popperProvides);
      vue.provide(POPPER_INJECTION_KEY, popperProvides);
      return (_ctx, _cache) => {
        return vue.renderSlot(_ctx.$slots, "default");
      };
    }
  });
  var Popper = /* @__PURE__ */ _export_sfc$1(_sfc_main$f, [["__file", "popper.vue"]]);
  const popperArrowProps = buildProps({
    arrowOffset: {
      type: Number,
      default: 5
    }
  });
  const __default__$7 = vue.defineComponent({
    name: "ElPopperArrow",
    inheritAttrs: false
  });
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    ...__default__$7,
    props: popperArrowProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("popper");
      const { arrowOffset, arrowRef, arrowStyle } = vue.inject(POPPER_CONTENT_INJECTION_KEY, void 0);
      vue.watch(() => props.arrowOffset, (val) => {
        arrowOffset.value = val;
      });
      vue.onBeforeUnmount(() => {
        arrowRef.value = void 0;
      });
      expose({
        arrowRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("span", {
          ref_key: "arrowRef",
          ref: arrowRef,
          class: vue.normalizeClass(vue.unref(ns).e("arrow")),
          style: vue.normalizeStyle(vue.unref(arrowStyle)),
          "data-popper-arrow": ""
        }, null, 6);
      };
    }
  });
  var ElPopperArrow = /* @__PURE__ */ _export_sfc$1(_sfc_main$e, [["__file", "arrow.vue"]]);
  const NAME = "ElOnlyChild";
  const OnlyChild = vue.defineComponent({
    name: NAME,
    setup(_, {
      slots,
      attrs
    }) {
      var _a2;
      const forwardRefInjection = vue.inject(FORWARD_REF_INJECTION_KEY);
      const forwardRefDirective = useForwardRefDirective((_a2 = forwardRefInjection == null ? void 0 : forwardRefInjection.setForwardRef) != null ? _a2 : NOOP);
      return () => {
        var _a22;
        const defaultSlot = (_a22 = slots.default) == null ? void 0 : _a22.call(slots, attrs);
        if (!defaultSlot)
          return null;
        if (defaultSlot.length > 1) {
          return null;
        }
        const firstLegitNode = findFirstLegitChild(defaultSlot);
        if (!firstLegitNode) {
          return null;
        }
        return vue.withDirectives(vue.cloneVNode(firstLegitNode, attrs), [[forwardRefDirective]]);
      };
    }
  });
  function findFirstLegitChild(node) {
    if (!node)
      return null;
    const children = node;
    for (const child of children) {
      if (isObject$1(child)) {
        switch (child.type) {
          case vue.Comment:
            continue;
          case vue.Text:
          case "svg":
            return wrapTextContent(child);
          case vue.Fragment:
            return findFirstLegitChild(child.children);
          default:
            return child;
        }
      }
      return wrapTextContent(child);
    }
    return null;
  }
  function wrapTextContent(s) {
    const ns = useNamespace("only-child");
    return vue.createVNode("span", {
      "class": ns.e("content")
    }, [s]);
  }
  const popperTriggerProps = buildProps({
    virtualRef: {
      type: definePropType(Object)
    },
    virtualTriggering: Boolean,
    onMouseenter: {
      type: definePropType(Function)
    },
    onMouseleave: {
      type: definePropType(Function)
    },
    onClick: {
      type: definePropType(Function)
    },
    onKeydown: {
      type: definePropType(Function)
    },
    onFocus: {
      type: definePropType(Function)
    },
    onBlur: {
      type: definePropType(Function)
    },
    onContextmenu: {
      type: definePropType(Function)
    },
    id: String,
    open: Boolean
  });
  const __default__$6 = vue.defineComponent({
    name: "ElPopperTrigger",
    inheritAttrs: false
  });
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    ...__default__$6,
    props: popperTriggerProps,
    setup(__props, { expose }) {
      const props = __props;
      const { role, triggerRef } = vue.inject(POPPER_INJECTION_KEY, void 0);
      useForwardRef(triggerRef);
      const ariaControls = vue.computed(() => {
        return ariaHaspopup.value ? props.id : void 0;
      });
      const ariaDescribedby = vue.computed(() => {
        if (role && role.value === "tooltip") {
          return props.open && props.id ? props.id : void 0;
        }
        return void 0;
      });
      const ariaHaspopup = vue.computed(() => {
        if (role && role.value !== "tooltip") {
          return role.value;
        }
        return void 0;
      });
      const ariaExpanded = vue.computed(() => {
        return ariaHaspopup.value ? `${props.open}` : void 0;
      });
      let virtualTriggerAriaStopWatch = void 0;
      vue.onMounted(() => {
        vue.watch(() => props.virtualRef, (virtualEl) => {
          if (virtualEl) {
            triggerRef.value = unrefElement(virtualEl);
          }
        }, {
          immediate: true
        });
        vue.watch(triggerRef, (el, prevEl) => {
          virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
          virtualTriggerAriaStopWatch = void 0;
          if (isElement(el)) {
            [
              "onMouseenter",
              "onMouseleave",
              "onClick",
              "onKeydown",
              "onFocus",
              "onBlur",
              "onContextmenu"
            ].forEach((eventName) => {
              var _a2;
              const handler = props[eventName];
              if (handler) {
                el.addEventListener(eventName.slice(2).toLowerCase(), handler);
                (_a2 = prevEl == null ? void 0 : prevEl.removeEventListener) == null ? void 0 : _a2.call(prevEl, eventName.slice(2).toLowerCase(), handler);
              }
            });
            virtualTriggerAriaStopWatch = vue.watch([ariaControls, ariaDescribedby, ariaHaspopup, ariaExpanded], (watches) => {
              [
                "aria-controls",
                "aria-describedby",
                "aria-haspopup",
                "aria-expanded"
              ].forEach((key, idx) => {
                isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
              });
            }, { immediate: true });
          }
          if (isElement(prevEl)) {
            [
              "aria-controls",
              "aria-describedby",
              "aria-haspopup",
              "aria-expanded"
            ].forEach((key) => prevEl.removeAttribute(key));
          }
        }, {
          immediate: true
        });
      });
      vue.onBeforeUnmount(() => {
        virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
        virtualTriggerAriaStopWatch = void 0;
      });
      expose({
        triggerRef
      });
      return (_ctx, _cache) => {
        return !_ctx.virtualTriggering ? (vue.openBlock(), vue.createBlock(vue.unref(OnlyChild), vue.mergeProps({ key: 0 }, _ctx.$attrs, {
          "aria-controls": vue.unref(ariaControls),
          "aria-describedby": vue.unref(ariaDescribedby),
          "aria-expanded": vue.unref(ariaExpanded),
          "aria-haspopup": vue.unref(ariaHaspopup)
        }), {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 16, ["aria-controls", "aria-describedby", "aria-expanded", "aria-haspopup"])) : vue.createCommentVNode("v-if", true);
      };
    }
  });
  var ElPopperTrigger = /* @__PURE__ */ _export_sfc$1(_sfc_main$d, [["__file", "trigger.vue"]]);
  const FOCUS_AFTER_TRAPPED = "focus-trap.focus-after-trapped";
  const FOCUS_AFTER_RELEASED = "focus-trap.focus-after-released";
  const FOCUSOUT_PREVENTED = "focus-trap.focusout-prevented";
  const FOCUS_AFTER_TRAPPED_OPTS = {
    cancelable: true,
    bubbles: false
  };
  const FOCUSOUT_PREVENTED_OPTS = {
    cancelable: true,
    bubbles: false
  };
  const ON_TRAP_FOCUS_EVT = "focusAfterTrapped";
  const ON_RELEASE_FOCUS_EVT = "focusAfterReleased";
  const FOCUS_TRAP_INJECTION_KEY = Symbol("elFocusTrap");
  const focusReason = vue.ref();
  const lastUserFocusTimestamp = vue.ref(0);
  const lastAutomatedFocusTimestamp = vue.ref(0);
  let focusReasonUserCount = 0;
  const obtainAllFocusableElements = (element) => {
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
        if (node.disabled || node.hidden || isHiddenInput)
          return NodeFilter.FILTER_SKIP;
        return node.tabIndex >= 0 || node === document.activeElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode())
      nodes.push(walker.currentNode);
    return nodes;
  };
  const getVisibleElement = (elements, container) => {
    for (const element of elements) {
      if (!isHidden(element, container))
        return element;
    }
  };
  const isHidden = (element, container) => {
    if (getComputedStyle(element).visibility === "hidden")
      return true;
    while (element) {
      if (container && element === container)
        return false;
      if (getComputedStyle(element).display === "none")
        return true;
      element = element.parentElement;
    }
    return false;
  };
  const getEdges = (container) => {
    const focusable = obtainAllFocusableElements(container);
    const first = getVisibleElement(focusable, container);
    const last = getVisibleElement(focusable.reverse(), container);
    return [first, last];
  };
  const isSelectable = (element) => {
    return element instanceof HTMLInputElement && "select" in element;
  };
  const tryFocus = (element, shouldSelect) => {
    if (element && element.focus) {
      const prevFocusedElement = document.activeElement;
      element.focus({ preventScroll: true });
      lastAutomatedFocusTimestamp.value = window.performance.now();
      if (element !== prevFocusedElement && isSelectable(element) && shouldSelect) {
        element.select();
      }
    }
  };
  function removeFromStack(list, item) {
    const copy = [...list];
    const idx = list.indexOf(item);
    if (idx !== -1) {
      copy.splice(idx, 1);
    }
    return copy;
  }
  const createFocusableStack = () => {
    let stack = [];
    const push = (layer) => {
      const currentLayer = stack[0];
      if (currentLayer && layer !== currentLayer) {
        currentLayer.pause();
      }
      stack = removeFromStack(stack, layer);
      stack.unshift(layer);
    };
    const remove = (layer) => {
      var _a2, _b;
      stack = removeFromStack(stack, layer);
      (_b = (_a2 = stack[0]) == null ? void 0 : _a2.resume) == null ? void 0 : _b.call(_a2);
    };
    return {
      push,
      remove
    };
  };
  const focusFirstDescendant = (elements, shouldSelect = false) => {
    const prevFocusedElement = document.activeElement;
    for (const element of elements) {
      tryFocus(element, shouldSelect);
      if (document.activeElement !== prevFocusedElement)
        return;
    }
  };
  const focusableStack = createFocusableStack();
  const isFocusCausedByUserEvent = () => {
    return lastUserFocusTimestamp.value > lastAutomatedFocusTimestamp.value;
  };
  const notifyFocusReasonPointer = () => {
    focusReason.value = "pointer";
    lastUserFocusTimestamp.value = window.performance.now();
  };
  const notifyFocusReasonKeydown = () => {
    focusReason.value = "keyboard";
    lastUserFocusTimestamp.value = window.performance.now();
  };
  const useFocusReason = () => {
    vue.onMounted(() => {
      if (focusReasonUserCount === 0) {
        document.addEventListener("mousedown", notifyFocusReasonPointer);
        document.addEventListener("touchstart", notifyFocusReasonPointer);
        document.addEventListener("keydown", notifyFocusReasonKeydown);
      }
      focusReasonUserCount++;
    });
    vue.onBeforeUnmount(() => {
      focusReasonUserCount--;
      if (focusReasonUserCount <= 0) {
        document.removeEventListener("mousedown", notifyFocusReasonPointer);
        document.removeEventListener("touchstart", notifyFocusReasonPointer);
        document.removeEventListener("keydown", notifyFocusReasonKeydown);
      }
    });
    return {
      focusReason,
      lastUserFocusTimestamp,
      lastAutomatedFocusTimestamp
    };
  };
  const createFocusOutPreventedEvent = (detail) => {
    return new CustomEvent(FOCUSOUT_PREVENTED, {
      ...FOCUSOUT_PREVENTED_OPTS,
      detail
    });
  };
  const _sfc_main$c = vue.defineComponent({
    name: "ElFocusTrap",
    inheritAttrs: false,
    props: {
      loop: Boolean,
      trapped: Boolean,
      focusTrapEl: Object,
      focusStartEl: {
        type: [Object, String],
        default: "first"
      }
    },
    emits: [
      ON_TRAP_FOCUS_EVT,
      ON_RELEASE_FOCUS_EVT,
      "focusin",
      "focusout",
      "focusout-prevented",
      "release-requested"
    ],
    setup(props, { emit }) {
      const forwardRef = vue.ref();
      let lastFocusBeforeTrapped;
      let lastFocusAfterTrapped;
      const { focusReason: focusReason2 } = useFocusReason();
      useEscapeKeydown((event) => {
        if (props.trapped && !focusLayer.paused) {
          emit("release-requested", event);
        }
      });
      const focusLayer = {
        paused: false,
        pause() {
          this.paused = true;
        },
        resume() {
          this.paused = false;
        }
      };
      const onKeydown = (e) => {
        if (!props.loop && !props.trapped)
          return;
        if (focusLayer.paused)
          return;
        const { key, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e;
        const { loop } = props;
        const isTabbing = key === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;
        const currentFocusingEl = document.activeElement;
        if (isTabbing && currentFocusingEl) {
          const container = currentTarget;
          const [first, last] = getEdges(container);
          const isTabbable = first && last;
          if (!isTabbable) {
            if (currentFocusingEl === container) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
              }
            }
          } else {
            if (!shiftKey && currentFocusingEl === last) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
                if (loop)
                  tryFocus(first, true);
              }
            } else if (shiftKey && [first, container].includes(currentFocusingEl)) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
                if (loop)
                  tryFocus(last, true);
              }
            }
          }
        }
      };
      vue.provide(FOCUS_TRAP_INJECTION_KEY, {
        focusTrapRef: forwardRef,
        onKeydown
      });
      vue.watch(() => props.focusTrapEl, (focusTrapEl) => {
        if (focusTrapEl) {
          forwardRef.value = focusTrapEl;
        }
      }, { immediate: true });
      vue.watch([forwardRef], ([forwardRef2], [oldForwardRef]) => {
        if (forwardRef2) {
          forwardRef2.addEventListener("keydown", onKeydown);
          forwardRef2.addEventListener("focusin", onFocusIn);
          forwardRef2.addEventListener("focusout", onFocusOut);
        }
        if (oldForwardRef) {
          oldForwardRef.removeEventListener("keydown", onKeydown);
          oldForwardRef.removeEventListener("focusin", onFocusIn);
          oldForwardRef.removeEventListener("focusout", onFocusOut);
        }
      });
      const trapOnFocus = (e) => {
        emit(ON_TRAP_FOCUS_EVT, e);
      };
      const releaseOnFocus = (e) => emit(ON_RELEASE_FOCUS_EVT, e);
      const onFocusIn = (e) => {
        const trapContainer = vue.unref(forwardRef);
        if (!trapContainer)
          return;
        const target = e.target;
        const relatedTarget = e.relatedTarget;
        const isFocusedInTrap = target && trapContainer.contains(target);
        if (!props.trapped) {
          const isPrevFocusedInTrap = relatedTarget && trapContainer.contains(relatedTarget);
          if (!isPrevFocusedInTrap) {
            lastFocusBeforeTrapped = relatedTarget;
          }
        }
        if (isFocusedInTrap)
          emit("focusin", e);
        if (focusLayer.paused)
          return;
        if (props.trapped) {
          if (isFocusedInTrap) {
            lastFocusAfterTrapped = target;
          } else {
            tryFocus(lastFocusAfterTrapped, true);
          }
        }
      };
      const onFocusOut = (e) => {
        const trapContainer = vue.unref(forwardRef);
        if (focusLayer.paused || !trapContainer)
          return;
        if (props.trapped) {
          const relatedTarget = e.relatedTarget;
          if (!isNil(relatedTarget) && !trapContainer.contains(relatedTarget)) {
            setTimeout(() => {
              if (!focusLayer.paused && props.trapped) {
                const focusoutPreventedEvent = createFocusOutPreventedEvent({
                  focusReason: focusReason2.value
                });
                emit("focusout-prevented", focusoutPreventedEvent);
                if (!focusoutPreventedEvent.defaultPrevented) {
                  tryFocus(lastFocusAfterTrapped, true);
                }
              }
            }, 0);
          }
        } else {
          const target = e.target;
          const isFocusedInTrap = target && trapContainer.contains(target);
          if (!isFocusedInTrap)
            emit("focusout", e);
        }
      };
      async function startTrap() {
        await vue.nextTick();
        const trapContainer = vue.unref(forwardRef);
        if (trapContainer) {
          focusableStack.push(focusLayer);
          const prevFocusedElement = trapContainer.contains(document.activeElement) ? lastFocusBeforeTrapped : document.activeElement;
          lastFocusBeforeTrapped = prevFocusedElement;
          const isPrevFocusContained = trapContainer.contains(prevFocusedElement);
          if (!isPrevFocusContained) {
            const focusEvent = new Event(FOCUS_AFTER_TRAPPED, FOCUS_AFTER_TRAPPED_OPTS);
            trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
            trapContainer.dispatchEvent(focusEvent);
            if (!focusEvent.defaultPrevented) {
              vue.nextTick(() => {
                let focusStartEl = props.focusStartEl;
                if (!isString(focusStartEl)) {
                  tryFocus(focusStartEl);
                  if (document.activeElement !== focusStartEl) {
                    focusStartEl = "first";
                  }
                }
                if (focusStartEl === "first") {
                  focusFirstDescendant(obtainAllFocusableElements(trapContainer), true);
                }
                if (document.activeElement === prevFocusedElement || focusStartEl === "container") {
                  tryFocus(trapContainer);
                }
              });
            }
          }
        }
      }
      function stopTrap() {
        const trapContainer = vue.unref(forwardRef);
        if (trapContainer) {
          trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
          const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, {
            ...FOCUS_AFTER_TRAPPED_OPTS,
            detail: {
              focusReason: focusReason2.value
            }
          });
          trapContainer.addEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
          trapContainer.dispatchEvent(releasedEvent);
          if (!releasedEvent.defaultPrevented && (focusReason2.value == "keyboard" || !isFocusCausedByUserEvent() || trapContainer.contains(document.activeElement))) {
            tryFocus(lastFocusBeforeTrapped != null ? lastFocusBeforeTrapped : document.body);
          }
          trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
          focusableStack.remove(focusLayer);
        }
      }
      vue.onMounted(() => {
        if (props.trapped) {
          startTrap();
        }
        vue.watch(() => props.trapped, (trapped) => {
          if (trapped) {
            startTrap();
          } else {
            stopTrap();
          }
        });
      });
      vue.onBeforeUnmount(() => {
        if (props.trapped) {
          stopTrap();
        }
      });
      return {
        onKeydown
      };
    }
  });
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
  }
  var ElFocusTrap = /* @__PURE__ */ _export_sfc$1(_sfc_main$c, [["render", _sfc_render$4], ["__file", "focus-trap.vue"]]);
  const POSITIONING_STRATEGIES = ["fixed", "absolute"];
  const popperCoreConfigProps = buildProps({
    boundariesPadding: {
      type: Number,
      default: 0
    },
    fallbackPlacements: {
      type: definePropType(Array),
      default: void 0
    },
    gpuAcceleration: {
      type: Boolean,
      default: true
    },
    offset: {
      type: Number,
      default: 12
    },
    placement: {
      type: String,
      values: Ee,
      default: "bottom"
    },
    popperOptions: {
      type: definePropType(Object),
      default: () => ({})
    },
    strategy: {
      type: String,
      values: POSITIONING_STRATEGIES,
      default: "absolute"
    }
  });
  const popperContentProps = buildProps({
    ...popperCoreConfigProps,
    id: String,
    style: {
      type: definePropType([String, Array, Object])
    },
    className: {
      type: definePropType([String, Array, Object])
    },
    effect: {
      type: String,
      default: "dark"
    },
    visible: Boolean,
    enterable: {
      type: Boolean,
      default: true
    },
    pure: Boolean,
    focusOnShow: {
      type: Boolean,
      default: false
    },
    trapping: {
      type: Boolean,
      default: false
    },
    popperClass: {
      type: definePropType([String, Array, Object])
    },
    popperStyle: {
      type: definePropType([String, Array, Object])
    },
    referenceEl: {
      type: definePropType(Object)
    },
    triggerTargetEl: {
      type: definePropType(Object)
    },
    stopPopperMouseEvent: {
      type: Boolean,
      default: true
    },
    ariaLabel: {
      type: String,
      default: void 0
    },
    virtualTriggering: Boolean,
    zIndex: Number
  });
  const popperContentEmits = {
    mouseenter: (evt) => evt instanceof MouseEvent,
    mouseleave: (evt) => evt instanceof MouseEvent,
    focus: () => true,
    blur: () => true,
    close: () => true
  };
  const buildPopperOptions = (props, modifiers = []) => {
    const { placement, strategy, popperOptions } = props;
    const options = {
      placement,
      strategy,
      ...popperOptions,
      modifiers: [...genModifiers(props), ...modifiers]
    };
    deriveExtraModifiers(options, popperOptions == null ? void 0 : popperOptions.modifiers);
    return options;
  };
  const unwrapMeasurableEl = ($el) => {
    if (!isClient)
      return;
    return unrefElement($el);
  };
  function genModifiers(options) {
    const { offset, gpuAcceleration, fallbackPlacements } = options;
    return [
      {
        name: "offset",
        options: {
          offset: [0, offset != null ? offset : 12]
        }
      },
      {
        name: "preventOverflow",
        options: {
          padding: {
            top: 2,
            bottom: 2,
            left: 5,
            right: 5
          }
        }
      },
      {
        name: "flip",
        options: {
          padding: 5,
          fallbackPlacements
        }
      },
      {
        name: "computeStyles",
        options: {
          gpuAcceleration
        }
      }
    ];
  }
  function deriveExtraModifiers(options, modifiers) {
    if (modifiers) {
      options.modifiers = [...options.modifiers, ...modifiers != null ? modifiers : []];
    }
  }
  const DEFAULT_ARROW_OFFSET = 0;
  const usePopperContent = (props) => {
    const { popperInstanceRef, contentRef, triggerRef, role } = vue.inject(POPPER_INJECTION_KEY, void 0);
    const arrowRef = vue.ref();
    const arrowOffset = vue.ref();
    const eventListenerModifier = vue.computed(() => {
      return {
        name: "eventListeners",
        enabled: !!props.visible
      };
    });
    const arrowModifier = vue.computed(() => {
      var _a2;
      const arrowEl = vue.unref(arrowRef);
      const offset = (_a2 = vue.unref(arrowOffset)) != null ? _a2 : DEFAULT_ARROW_OFFSET;
      return {
        name: "arrow",
        enabled: !isUndefined$1(arrowEl),
        options: {
          element: arrowEl,
          padding: offset
        }
      };
    });
    const options = vue.computed(() => {
      return {
        onFirstUpdate: () => {
          update();
        },
        ...buildPopperOptions(props, [
          vue.unref(arrowModifier),
          vue.unref(eventListenerModifier)
        ])
      };
    });
    const computedReference = vue.computed(() => unwrapMeasurableEl(props.referenceEl) || vue.unref(triggerRef));
    const { attributes, state, styles, update, forceUpdate, instanceRef } = usePopper(computedReference, contentRef, options);
    vue.watch(instanceRef, (instance) => popperInstanceRef.value = instance);
    vue.onMounted(() => {
      vue.watch(() => {
        var _a2;
        return (_a2 = vue.unref(computedReference)) == null ? void 0 : _a2.getBoundingClientRect();
      }, () => {
        update();
      });
    });
    return {
      attributes,
      arrowRef,
      contentRef,
      instanceRef,
      state,
      styles,
      role,
      forceUpdate,
      update
    };
  };
  const usePopperContentDOM = (props, {
    attributes,
    styles,
    role
  }) => {
    const { nextZIndex } = useZIndex();
    const ns = useNamespace("popper");
    const contentAttrs = vue.computed(() => vue.unref(attributes).popper);
    const contentZIndex = vue.ref(isNumber(props.zIndex) ? props.zIndex : nextZIndex());
    const contentClass = vue.computed(() => [
      ns.b(),
      ns.is("pure", props.pure),
      ns.is(props.effect),
      props.popperClass
    ]);
    const contentStyle = vue.computed(() => {
      return [
        { zIndex: vue.unref(contentZIndex) },
        vue.unref(styles).popper,
        props.popperStyle || {}
      ];
    });
    const ariaModal = vue.computed(() => role.value === "dialog" ? "false" : void 0);
    const arrowStyle = vue.computed(() => vue.unref(styles).arrow || {});
    const updateZIndex = () => {
      contentZIndex.value = isNumber(props.zIndex) ? props.zIndex : nextZIndex();
    };
    return {
      ariaModal,
      arrowStyle,
      contentAttrs,
      contentClass,
      contentStyle,
      contentZIndex,
      updateZIndex
    };
  };
  const usePopperContentFocusTrap = (props, emit) => {
    const trapped = vue.ref(false);
    const focusStartRef = vue.ref();
    const onFocusAfterTrapped = () => {
      emit("focus");
    };
    const onFocusAfterReleased = (event) => {
      var _a2;
      if (((_a2 = event.detail) == null ? void 0 : _a2.focusReason) !== "pointer") {
        focusStartRef.value = "first";
        emit("blur");
      }
    };
    const onFocusInTrap = (event) => {
      if (props.visible && !trapped.value) {
        if (event.target) {
          focusStartRef.value = event.target;
        }
        trapped.value = true;
      }
    };
    const onFocusoutPrevented = (event) => {
      if (!props.trapping) {
        if (event.detail.focusReason === "pointer") {
          event.preventDefault();
        }
        trapped.value = false;
      }
    };
    const onReleaseRequested = () => {
      trapped.value = false;
      emit("close");
    };
    return {
      focusStartRef,
      trapped,
      onFocusAfterReleased,
      onFocusAfterTrapped,
      onFocusInTrap,
      onFocusoutPrevented,
      onReleaseRequested
    };
  };
  const __default__$5 = vue.defineComponent({
    name: "ElPopperContent"
  });
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    ...__default__$5,
    props: popperContentProps,
    emits: popperContentEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const {
        focusStartRef,
        trapped,
        onFocusAfterReleased,
        onFocusAfterTrapped,
        onFocusInTrap,
        onFocusoutPrevented,
        onReleaseRequested
      } = usePopperContentFocusTrap(props, emit);
      const { attributes, arrowRef, contentRef, styles, instanceRef, role, update } = usePopperContent(props);
      const {
        ariaModal,
        arrowStyle,
        contentAttrs,
        contentClass,
        contentStyle,
        updateZIndex
      } = usePopperContentDOM(props, {
        styles,
        attributes,
        role
      });
      const formItemContext = vue.inject(formItemContextKey, void 0);
      const arrowOffset = vue.ref();
      vue.provide(POPPER_CONTENT_INJECTION_KEY, {
        arrowStyle,
        arrowRef,
        arrowOffset
      });
      if (formItemContext && (formItemContext.addInputId || formItemContext.removeInputId)) {
        vue.provide(formItemContextKey, {
          ...formItemContext,
          addInputId: NOOP,
          removeInputId: NOOP
        });
      }
      let triggerTargetAriaStopWatch = void 0;
      const updatePopper = (shouldUpdateZIndex = true) => {
        update();
        shouldUpdateZIndex && updateZIndex();
      };
      const togglePopperAlive = () => {
        updatePopper(false);
        if (props.visible && props.focusOnShow) {
          trapped.value = true;
        } else if (props.visible === false) {
          trapped.value = false;
        }
      };
      vue.onMounted(() => {
        vue.watch(() => props.triggerTargetEl, (triggerTargetEl, prevTriggerTargetEl) => {
          triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
          triggerTargetAriaStopWatch = void 0;
          const el = vue.unref(triggerTargetEl || contentRef.value);
          const prevEl = vue.unref(prevTriggerTargetEl || contentRef.value);
          if (isElement(el)) {
            triggerTargetAriaStopWatch = vue.watch([role, () => props.ariaLabel, ariaModal, () => props.id], (watches) => {
              ["role", "aria-label", "aria-modal", "id"].forEach((key, idx) => {
                isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
              });
            }, { immediate: true });
          }
          if (prevEl !== el && isElement(prevEl)) {
            ["role", "aria-label", "aria-modal", "id"].forEach((key) => {
              prevEl.removeAttribute(key);
            });
          }
        }, { immediate: true });
        vue.watch(() => props.visible, togglePopperAlive, { immediate: true });
      });
      vue.onBeforeUnmount(() => {
        triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
        triggerTargetAriaStopWatch = void 0;
      });
      expose({
        popperContentRef: contentRef,
        popperInstanceRef: instanceRef,
        updatePopper,
        contentStyle
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
          ref_key: "contentRef",
          ref: contentRef
        }, vue.unref(contentAttrs), {
          style: vue.unref(contentStyle),
          class: vue.unref(contentClass),
          tabindex: "-1",
          onMouseenter: _cache[0] || (_cache[0] = (e) => _ctx.$emit("mouseenter", e)),
          onMouseleave: _cache[1] || (_cache[1] = (e) => _ctx.$emit("mouseleave", e))
        }), [
          vue.createVNode(vue.unref(ElFocusTrap), {
            trapped: vue.unref(trapped),
            "trap-on-focus-in": true,
            "focus-trap-el": vue.unref(contentRef),
            "focus-start-el": vue.unref(focusStartRef),
            onFocusAfterTrapped: vue.unref(onFocusAfterTrapped),
            onFocusAfterReleased: vue.unref(onFocusAfterReleased),
            onFocusin: vue.unref(onFocusInTrap),
            onFocusoutPrevented: vue.unref(onFocusoutPrevented),
            onReleaseRequested: vue.unref(onReleaseRequested)
          }, {
            default: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["trapped", "focus-trap-el", "focus-start-el", "onFocusAfterTrapped", "onFocusAfterReleased", "onFocusin", "onFocusoutPrevented", "onReleaseRequested"])
        ], 16);
      };
    }
  });
  var ElPopperContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$b, [["__file", "content.vue"]]);
  const ElPopper = withInstall(Popper);
  const TOOLTIP_INJECTION_KEY = Symbol("elTooltip");
  const useTooltipContentProps = buildProps({
    ...useDelayedToggleProps,
    ...popperContentProps,
    appendTo: {
      type: definePropType([String, Object])
    },
    content: {
      type: String,
      default: ""
    },
    rawContent: {
      type: Boolean,
      default: false
    },
    persistent: Boolean,
    ariaLabel: String,
    visible: {
      type: definePropType(Boolean),
      default: null
    },
    transition: String,
    teleported: {
      type: Boolean,
      default: true
    },
    disabled: Boolean
  });
  const useTooltipTriggerProps = buildProps({
    ...popperTriggerProps,
    disabled: Boolean,
    trigger: {
      type: definePropType([String, Array]),
      default: "hover"
    },
    triggerKeys: {
      type: definePropType(Array),
      default: () => [EVENT_CODE.enter, EVENT_CODE.space]
    }
  });
  const {
    useModelToggleProps: useTooltipModelToggleProps,
    useModelToggleEmits: useTooltipModelToggleEmits,
    useModelToggle: useTooltipModelToggle
  } = createModelToggleComposable("visible");
  const useTooltipProps = buildProps({
    ...popperProps,
    ...useTooltipModelToggleProps,
    ...useTooltipContentProps,
    ...useTooltipTriggerProps,
    ...popperArrowProps,
    showArrow: {
      type: Boolean,
      default: true
    }
  });
  const tooltipEmits = [
    ...useTooltipModelToggleEmits,
    "before-show",
    "before-hide",
    "show",
    "hide",
    "open",
    "close"
  ];
  const isTriggerType = (trigger, type) => {
    if (isArray$2(trigger)) {
      return trigger.includes(type);
    }
    return trigger === type;
  };
  const whenTrigger = (trigger, type, handler) => {
    return (e) => {
      isTriggerType(vue.unref(trigger), type) && handler(e);
    };
  };
  const __default__$4 = vue.defineComponent({
    name: "ElTooltipTrigger"
  });
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
    props: useTooltipTriggerProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("tooltip");
      const { controlled, id, open, onOpen, onClose, onToggle } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
      const triggerRef = vue.ref(null);
      const stopWhenControlledOrDisabled = () => {
        if (vue.unref(controlled) || props.disabled) {
          return true;
        }
      };
      const trigger = vue.toRef(props, "trigger");
      const onMouseenter = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onOpen));
      const onMouseleave = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onClose));
      const onClick = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "click", (e) => {
        if (e.button === 0) {
          onToggle(e);
        }
      }));
      const onFocus = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onOpen));
      const onBlur = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onClose));
      const onContextMenu = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "contextmenu", (e) => {
        e.preventDefault();
        onToggle(e);
      }));
      const onKeydown = composeEventHandlers(stopWhenControlledOrDisabled, (e) => {
        const { code } = e;
        if (props.triggerKeys.includes(code)) {
          e.preventDefault();
          onToggle(e);
        }
      });
      expose({
        triggerRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElPopperTrigger), {
          id: vue.unref(id),
          "virtual-ref": _ctx.virtualRef,
          open: vue.unref(open),
          "virtual-triggering": _ctx.virtualTriggering,
          class: vue.normalizeClass(vue.unref(ns).e("trigger")),
          onBlur: vue.unref(onBlur),
          onClick: vue.unref(onClick),
          onContextmenu: vue.unref(onContextMenu),
          onFocus: vue.unref(onFocus),
          onMouseenter: vue.unref(onMouseenter),
          onMouseleave: vue.unref(onMouseleave),
          onKeydown: vue.unref(onKeydown)
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["id", "virtual-ref", "open", "virtual-triggering", "class", "onBlur", "onClick", "onContextmenu", "onFocus", "onMouseenter", "onMouseleave", "onKeydown"]);
      };
    }
  });
  var ElTooltipTrigger = /* @__PURE__ */ _export_sfc$1(_sfc_main$a, [["__file", "trigger.vue"]]);
  const __default__$3 = vue.defineComponent({
    name: "ElTooltipContent",
    inheritAttrs: false
  });
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: useTooltipContentProps,
    setup(__props, { expose }) {
      const props = __props;
      const { selector } = usePopperContainerId();
      const ns = useNamespace("tooltip");
      const contentRef = vue.ref(null);
      const destroyed = vue.ref(false);
      const {
        controlled,
        id,
        open,
        trigger,
        onClose,
        onOpen,
        onShow,
        onHide,
        onBeforeShow,
        onBeforeHide
      } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
      const transitionClass = vue.computed(() => {
        return props.transition || `${ns.namespace.value}-fade-in-linear`;
      });
      const persistentRef = vue.computed(() => {
        return props.persistent;
      });
      vue.onBeforeUnmount(() => {
        destroyed.value = true;
      });
      const shouldRender = vue.computed(() => {
        return vue.unref(persistentRef) ? true : vue.unref(open);
      });
      const shouldShow = vue.computed(() => {
        return props.disabled ? false : vue.unref(open);
      });
      const appendTo = vue.computed(() => {
        return props.appendTo || selector.value;
      });
      const contentStyle = vue.computed(() => {
        var _a2;
        return (_a2 = props.style) != null ? _a2 : {};
      });
      const ariaHidden = vue.computed(() => !vue.unref(open));
      const onTransitionLeave = () => {
        onHide();
      };
      const stopWhenControlled = () => {
        if (vue.unref(controlled))
          return true;
      };
      const onContentEnter = composeEventHandlers(stopWhenControlled, () => {
        if (props.enterable && vue.unref(trigger) === "hover") {
          onOpen();
        }
      });
      const onContentLeave = composeEventHandlers(stopWhenControlled, () => {
        if (vue.unref(trigger) === "hover") {
          onClose();
        }
      });
      const onBeforeEnter = () => {
        var _a2, _b;
        (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
        onBeforeShow == null ? void 0 : onBeforeShow();
      };
      const onBeforeLeave = () => {
        onBeforeHide == null ? void 0 : onBeforeHide();
      };
      const onAfterShow = () => {
        onShow();
        stopHandle = onClickOutside(vue.computed(() => {
          var _a2;
          return (_a2 = contentRef.value) == null ? void 0 : _a2.popperContentRef;
        }), () => {
          if (vue.unref(controlled))
            return;
          const $trigger = vue.unref(trigger);
          if ($trigger !== "hover") {
            onClose();
          }
        });
      };
      const onBlur = () => {
        if (!props.virtualTriggering) {
          onClose();
        }
      };
      let stopHandle;
      vue.watch(() => vue.unref(open), (val) => {
        if (!val) {
          stopHandle == null ? void 0 : stopHandle();
        }
      }, {
        flush: "post"
      });
      vue.watch(() => props.content, () => {
        var _a2, _b;
        (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
      });
      expose({
        contentRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, {
          disabled: !_ctx.teleported,
          to: vue.unref(appendTo)
        }, [
          vue.createVNode(vue.Transition, {
            name: vue.unref(transitionClass),
            onAfterLeave: onTransitionLeave,
            onBeforeEnter,
            onAfterEnter: onAfterShow,
            onBeforeLeave
          }, {
            default: vue.withCtx(() => [
              vue.unref(shouldRender) ? vue.withDirectives((vue.openBlock(), vue.createBlock(vue.unref(ElPopperContent), vue.mergeProps({
                key: 0,
                id: vue.unref(id),
                ref_key: "contentRef",
                ref: contentRef
              }, _ctx.$attrs, {
                "aria-label": _ctx.ariaLabel,
                "aria-hidden": vue.unref(ariaHidden),
                "boundaries-padding": _ctx.boundariesPadding,
                "fallback-placements": _ctx.fallbackPlacements,
                "gpu-acceleration": _ctx.gpuAcceleration,
                offset: _ctx.offset,
                placement: _ctx.placement,
                "popper-options": _ctx.popperOptions,
                strategy: _ctx.strategy,
                effect: _ctx.effect,
                enterable: _ctx.enterable,
                pure: _ctx.pure,
                "popper-class": _ctx.popperClass,
                "popper-style": [_ctx.popperStyle, vue.unref(contentStyle)],
                "reference-el": _ctx.referenceEl,
                "trigger-target-el": _ctx.triggerTargetEl,
                visible: vue.unref(shouldShow),
                "z-index": _ctx.zIndex,
                onMouseenter: vue.unref(onContentEnter),
                onMouseleave: vue.unref(onContentLeave),
                onBlur,
                onClose: vue.unref(onClose)
              }), {
                default: vue.withCtx(() => [
                  !destroyed.value ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
                ]),
                _: 3
              }, 16, ["id", "aria-label", "aria-hidden", "boundaries-padding", "fallback-placements", "gpu-acceleration", "offset", "placement", "popper-options", "strategy", "effect", "enterable", "pure", "popper-class", "popper-style", "reference-el", "trigger-target-el", "visible", "z-index", "onMouseenter", "onMouseleave", "onClose"])), [
                [vue.vShow, vue.unref(shouldShow)]
              ]) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, ["name"])
        ], 8, ["disabled", "to"]);
      };
    }
  });
  var ElTooltipContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$9, [["__file", "content.vue"]]);
  const _hoisted_1$5 = ["innerHTML"];
  const _hoisted_2$3 = { key: 1 };
  const __default__$2 = vue.defineComponent({
    name: "ElTooltip"
  });
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: useTooltipProps,
    emits: tooltipEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      usePopperContainer();
      const id = useId();
      const popperRef = vue.ref();
      const contentRef = vue.ref();
      const updatePopper = () => {
        var _a2;
        const popperComponent = vue.unref(popperRef);
        if (popperComponent) {
          (_a2 = popperComponent.popperInstanceRef) == null ? void 0 : _a2.update();
        }
      };
      const open = vue.ref(false);
      const toggleReason = vue.ref();
      const { show, hide, hasUpdateHandler } = useTooltipModelToggle({
        indicator: open,
        toggleReason
      });
      const { onOpen, onClose } = useDelayedToggle({
        showAfter: vue.toRef(props, "showAfter"),
        hideAfter: vue.toRef(props, "hideAfter"),
        autoClose: vue.toRef(props, "autoClose"),
        open: show,
        close: hide
      });
      const controlled = vue.computed(() => isBoolean(props.visible) && !hasUpdateHandler.value);
      vue.provide(TOOLTIP_INJECTION_KEY, {
        controlled,
        id,
        open: vue.readonly(open),
        trigger: vue.toRef(props, "trigger"),
        onOpen: (event) => {
          onOpen(event);
        },
        onClose: (event) => {
          onClose(event);
        },
        onToggle: (event) => {
          if (vue.unref(open)) {
            onClose(event);
          } else {
            onOpen(event);
          }
        },
        onShow: () => {
          emit("show", toggleReason.value);
        },
        onHide: () => {
          emit("hide", toggleReason.value);
        },
        onBeforeShow: () => {
          emit("before-show", toggleReason.value);
        },
        onBeforeHide: () => {
          emit("before-hide", toggleReason.value);
        },
        updatePopper
      });
      vue.watch(() => props.disabled, (disabled) => {
        if (disabled && open.value) {
          open.value = false;
        }
      });
      const isFocusInsideContent = (event) => {
        var _a2, _b;
        const popperContent = (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.contentRef) == null ? void 0 : _b.popperContentRef;
        const activeElement = (event == null ? void 0 : event.relatedTarget) || document.activeElement;
        return popperContent && popperContent.contains(activeElement);
      };
      vue.onDeactivated(() => open.value && hide());
      expose({
        popperRef,
        contentRef,
        isFocusInsideContent,
        updatePopper,
        onOpen,
        onClose,
        hide
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElPopper), {
          ref_key: "popperRef",
          ref: popperRef,
          role: _ctx.role
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(ElTooltipTrigger, {
              disabled: _ctx.disabled,
              trigger: _ctx.trigger,
              "trigger-keys": _ctx.triggerKeys,
              "virtual-ref": _ctx.virtualRef,
              "virtual-triggering": _ctx.virtualTriggering
            }, {
              default: vue.withCtx(() => [
                _ctx.$slots.default ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["disabled", "trigger", "trigger-keys", "virtual-ref", "virtual-triggering"]),
            vue.createVNode(ElTooltipContent, {
              ref_key: "contentRef",
              ref: contentRef,
              "aria-label": _ctx.ariaLabel,
              "boundaries-padding": _ctx.boundariesPadding,
              content: _ctx.content,
              disabled: _ctx.disabled,
              effect: _ctx.effect,
              enterable: _ctx.enterable,
              "fallback-placements": _ctx.fallbackPlacements,
              "hide-after": _ctx.hideAfter,
              "gpu-acceleration": _ctx.gpuAcceleration,
              offset: _ctx.offset,
              persistent: _ctx.persistent,
              "popper-class": _ctx.popperClass,
              "popper-style": _ctx.popperStyle,
              placement: _ctx.placement,
              "popper-options": _ctx.popperOptions,
              pure: _ctx.pure,
              "raw-content": _ctx.rawContent,
              "reference-el": _ctx.referenceEl,
              "trigger-target-el": _ctx.triggerTargetEl,
              "show-after": _ctx.showAfter,
              strategy: _ctx.strategy,
              teleported: _ctx.teleported,
              transition: _ctx.transition,
              "virtual-triggering": _ctx.virtualTriggering,
              "z-index": _ctx.zIndex,
              "append-to": _ctx.appendTo
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "content", {}, () => [
                  _ctx.rawContent ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    innerHTML: _ctx.content
                  }, null, 8, _hoisted_1$5)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$3, vue.toDisplayString(_ctx.content), 1))
                ]),
                _ctx.showArrow ? (vue.openBlock(), vue.createBlock(vue.unref(ElPopperArrow), {
                  key: 0,
                  "arrow-offset": _ctx.arrowOffset
                }, null, 8, ["arrow-offset"])) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["aria-label", "boundaries-padding", "content", "disabled", "effect", "enterable", "fallback-placements", "hide-after", "gpu-acceleration", "offset", "persistent", "popper-class", "popper-style", "placement", "popper-options", "pure", "raw-content", "reference-el", "trigger-target-el", "show-after", "strategy", "teleported", "transition", "virtual-triggering", "z-index", "append-to"])
          ]),
          _: 3
        }, 8, ["role"]);
      };
    }
  });
  var Tooltip = /* @__PURE__ */ _export_sfc$1(_sfc_main$8, [["__file", "tooltip.vue"]]);
  const ElTooltip = withInstall(Tooltip);
  const nodeList = /* @__PURE__ */ new Map();
  let startClick;
  if (isClient) {
    document.addEventListener("mousedown", (e) => startClick = e);
    document.addEventListener("mouseup", (e) => {
      for (const handlers of nodeList.values()) {
        for (const { documentHandler } of handlers) {
          documentHandler(e, startClick);
        }
      }
    });
  }
  function createDocumentHandler(el, binding) {
    let excludes = [];
    if (Array.isArray(binding.arg)) {
      excludes = binding.arg;
    } else if (isElement(binding.arg)) {
      excludes.push(binding.arg);
    }
    return function(mouseup, mousedown) {
      const popperRef = binding.instance.popperRef;
      const mouseUpTarget = mouseup.target;
      const mouseDownTarget = mousedown == null ? void 0 : mousedown.target;
      const isBound = !binding || !binding.instance;
      const isTargetExists = !mouseUpTarget || !mouseDownTarget;
      const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
      const isSelf = el === mouseUpTarget;
      const isTargetExcluded = excludes.length && excludes.some((item) => item == null ? void 0 : item.contains(mouseUpTarget)) || excludes.length && excludes.includes(mouseDownTarget);
      const isContainedByPopper = popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget));
      if (isBound || isTargetExists || isContainedByEl || isSelf || isTargetExcluded || isContainedByPopper) {
        return;
      }
      binding.value(mouseup, mousedown);
    };
  }
  const ClickOutside = {
    beforeMount(el, binding) {
      if (!nodeList.has(el)) {
        nodeList.set(el, []);
      }
      nodeList.get(el).push({
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value
      });
    },
    updated(el, binding) {
      if (!nodeList.has(el)) {
        nodeList.set(el, []);
      }
      const handlers = nodeList.get(el);
      const oldHandlerIndex = handlers.findIndex((item) => item.bindingFn === binding.oldValue);
      const newHandler = {
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value
      };
      if (oldHandlerIndex >= 0) {
        handlers.splice(oldHandlerIndex, 1, newHandler);
      } else {
        handlers.push(newHandler);
      }
    },
    unmounted(el) {
      nodeList.delete(el);
    }
  };
  const tagProps = buildProps({
    type: {
      type: String,
      values: ["primary", "success", "info", "warning", "danger"],
      default: "primary"
    },
    closable: Boolean,
    disableTransitions: Boolean,
    hit: Boolean,
    color: String,
    size: {
      type: String,
      values: componentSizes
    },
    effect: {
      type: String,
      values: ["dark", "light", "plain"],
      default: "light"
    },
    round: Boolean
  });
  const tagEmits = {
    close: (evt) => evt instanceof MouseEvent,
    click: (evt) => evt instanceof MouseEvent
  };
  const __default__$1 = vue.defineComponent({
    name: "ElTag"
  });
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    props: tagProps,
    emits: tagEmits,
    setup(__props, { emit }) {
      const props = __props;
      const tagSize = useFormSize();
      const ns = useNamespace("tag");
      const containerKls = vue.computed(() => {
        const { type, hit, effect, closable, round } = props;
        return [
          ns.b(),
          ns.is("closable", closable),
          ns.m(type || "primary"),
          ns.m(tagSize.value),
          ns.m(effect),
          ns.is("hit", hit),
          ns.is("round", round)
        ];
      });
      const handleClose = (event) => {
        emit("close", event);
      };
      const handleClick = (event) => {
        emit("click", event);
      };
      return (_ctx, _cache) => {
        return _ctx.disableTransitions ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(vue.unref(containerKls)),
          style: vue.normalizeStyle({ backgroundColor: _ctx.color }),
          onClick: handleClick
        }, [
          vue.createElementVNode("span", {
            class: vue.normalizeClass(vue.unref(ns).e("content"))
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 2),
          _ctx.closable ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
            key: 0,
            class: vue.normalizeClass(vue.unref(ns).e("close")),
            onClick: vue.withModifiers(handleClose, ["stop"])
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(close_default))
            ]),
            _: 1
          }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
        ], 6)) : (vue.openBlock(), vue.createBlock(vue.Transition, {
          key: 1,
          name: `${vue.unref(ns).namespace.value}-zoom-in-center`,
          appear: ""
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(vue.unref(containerKls)),
              style: vue.normalizeStyle({ backgroundColor: _ctx.color }),
              onClick: handleClick
            }, [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(vue.unref(ns).e("content"))
              }, [
                vue.renderSlot(_ctx.$slots, "default")
              ], 2),
              _ctx.closable ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 0,
                class: vue.normalizeClass(vue.unref(ns).e("close")),
                onClick: vue.withModifiers(handleClose, ["stop"])
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(close_default))
                ]),
                _: 1
              }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
            ], 6)
          ]),
          _: 3
        }, 8, ["name"]));
      };
    }
  });
  var Tag = /* @__PURE__ */ _export_sfc$1(_sfc_main$7, [["__file", "tag.vue"]]);
  const ElTag = withInstall(Tag);
  const selectGroupKey = Symbol("ElSelectGroup");
  const selectKey = Symbol("ElSelect");
  function useOption(props, states) {
    const select = vue.inject(selectKey);
    const selectGroup = vue.inject(selectGroupKey, { disabled: false });
    const itemSelected = vue.computed(() => {
      if (select.props.multiple) {
        return contains(select.props.modelValue, props.value);
      } else {
        return contains([select.props.modelValue], props.value);
      }
    });
    const limitReached = vue.computed(() => {
      if (select.props.multiple) {
        const modelValue = select.props.modelValue || [];
        return !itemSelected.value && modelValue.length >= select.props.multipleLimit && select.props.multipleLimit > 0;
      } else {
        return false;
      }
    });
    const currentLabel = vue.computed(() => {
      return props.label || (isObject$1(props.value) ? "" : props.value);
    });
    const currentValue = vue.computed(() => {
      return props.value || props.label || "";
    });
    const isDisabled = vue.computed(() => {
      return props.disabled || states.groupDisabled || limitReached.value;
    });
    const instance = vue.getCurrentInstance();
    const contains = (arr = [], target) => {
      if (!isObject$1(props.value)) {
        return arr && arr.includes(target);
      } else {
        const valueKey = select.props.valueKey;
        return arr && arr.some((item) => {
          return vue.toRaw(get(item, valueKey)) === get(target, valueKey);
        });
      }
    };
    const hoverItem = () => {
      if (!props.disabled && !selectGroup.disabled) {
        select.states.hoveringIndex = select.optionsArray.indexOf(instance.proxy);
      }
    };
    const updateOption = (query) => {
      const regexp = new RegExp(escapeStringRegexp(query), "i");
      states.visible = regexp.test(currentLabel.value) || props.created;
    };
    vue.watch(() => currentLabel.value, () => {
      if (!props.created && !select.props.remote)
        select.setSelected();
    });
    vue.watch(() => props.value, (val, oldVal) => {
      const { remote, valueKey } = select.props;
      if (!isEqual(val, oldVal)) {
        select.onOptionDestroy(oldVal, instance.proxy);
        select.onOptionCreate(instance.proxy);
      }
      if (!props.created && !remote) {
        if (valueKey && isObject$1(val) && isObject$1(oldVal) && val[valueKey] === oldVal[valueKey]) {
          return;
        }
        select.setSelected();
      }
    });
    vue.watch(() => selectGroup.disabled, () => {
      states.groupDisabled = selectGroup.disabled;
    }, { immediate: true });
    return {
      select,
      currentLabel,
      currentValue,
      itemSelected,
      isDisabled,
      hoverItem,
      updateOption
    };
  }
  const _sfc_main$6 = vue.defineComponent({
    name: "ElOption",
    componentName: "ElOption",
    props: {
      value: {
        required: true,
        type: [String, Number, Boolean, Object]
      },
      label: [String, Number],
      created: Boolean,
      disabled: Boolean
    },
    setup(props) {
      const ns = useNamespace("select");
      const id = useId();
      const containerKls = vue.computed(() => [
        ns.be("dropdown", "item"),
        ns.is("disabled", vue.unref(isDisabled)),
        ns.is("selected", vue.unref(itemSelected)),
        ns.is("hovering", vue.unref(hover))
      ]);
      const states = vue.reactive({
        index: -1,
        groupDisabled: false,
        visible: true,
        hover: false
      });
      const {
        currentLabel,
        itemSelected,
        isDisabled,
        select,
        hoverItem,
        updateOption
      } = useOption(props, states);
      const { visible, hover } = vue.toRefs(states);
      const vm = vue.getCurrentInstance().proxy;
      select.onOptionCreate(vm);
      vue.onBeforeUnmount(() => {
        const key = vm.value;
        const { selected } = select.states;
        const selectedOptions = select.props.multiple ? selected : [selected];
        const doesSelected = selectedOptions.some((item) => {
          return item.value === vm.value;
        });
        vue.nextTick(() => {
          if (select.states.cachedOptions.get(key) === vm && !doesSelected) {
            select.states.cachedOptions.delete(key);
          }
        });
        select.onOptionDestroy(key, vm);
      });
      function selectOptionClick() {
        if (props.disabled !== true && states.groupDisabled !== true) {
          select.handleOptionSelect(vm);
        }
      }
      return {
        ns,
        id,
        containerKls,
        currentLabel,
        itemSelected,
        isDisabled,
        select,
        hoverItem,
        updateOption,
        visible,
        hover,
        selectOptionClick,
        states
      };
    }
  });
  const _hoisted_1$4 = ["id", "aria-disabled", "aria-selected"];
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("li", {
      id: _ctx.id,
      class: vue.normalizeClass(_ctx.containerKls),
      role: "option",
      "aria-disabled": _ctx.isDisabled || void 0,
      "aria-selected": _ctx.itemSelected,
      onMouseenter: _cache[0] || (_cache[0] = (...args) => _ctx.hoverItem && _ctx.hoverItem(...args)),
      onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => _ctx.selectOptionClick && _ctx.selectOptionClick(...args), ["stop"]))
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, () => [
        vue.createElementVNode("span", null, vue.toDisplayString(_ctx.currentLabel), 1)
      ])
    ], 42, _hoisted_1$4)), [
      [vue.vShow, _ctx.visible]
    ]);
  }
  var Option = /* @__PURE__ */ _export_sfc$1(_sfc_main$6, [["render", _sfc_render$3], ["__file", "option.vue"]]);
  const _sfc_main$5 = vue.defineComponent({
    name: "ElSelectDropdown",
    componentName: "ElSelectDropdown",
    setup() {
      const select = vue.inject(selectKey);
      const ns = useNamespace("select");
      const popperClass = vue.computed(() => select.props.popperClass);
      const isMultiple = vue.computed(() => select.props.multiple);
      const isFitInputWidth = vue.computed(() => select.props.fitInputWidth);
      const minWidth = vue.ref("");
      function updateMinWidth() {
        var _a2;
        minWidth.value = `${(_a2 = select.selectRef) == null ? void 0 : _a2.offsetWidth}px`;
      }
      vue.onMounted(() => {
        updateMinWidth();
        useResizeObserver(select.selectRef, updateMinWidth);
      });
      return {
        ns,
        minWidth,
        popperClass,
        isMultiple,
        isFitInputWidth
      };
    }
  });
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass([_ctx.ns.b("dropdown"), _ctx.ns.is("multiple", _ctx.isMultiple), _ctx.popperClass]),
      style: vue.normalizeStyle({ [_ctx.isFitInputWidth ? "width" : "minWidth"]: _ctx.minWidth })
    }, [
      _ctx.$slots.header ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(_ctx.ns.be("dropdown", "header"))
      }, [
        vue.renderSlot(_ctx.$slots, "header")
      ], 2)) : vue.createCommentVNode("v-if", true),
      vue.renderSlot(_ctx.$slots, "default"),
      _ctx.$slots.footer ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass(_ctx.ns.be("dropdown", "footer"))
      }, [
        vue.renderSlot(_ctx.$slots, "footer")
      ], 2)) : vue.createCommentVNode("v-if", true)
    ], 6);
  }
  var ElSelectMenu = /* @__PURE__ */ _export_sfc$1(_sfc_main$5, [["render", _sfc_render$2], ["__file", "select-dropdown.vue"]]);
  function useInput(handleInput) {
    const isComposing = vue.ref(false);
    const handleCompositionStart = () => {
      isComposing.value = true;
    };
    const handleCompositionUpdate = (event) => {
      const text = event.target.value;
      const lastCharacter = text[text.length - 1] || "";
      isComposing.value = !isKorean(lastCharacter);
    };
    const handleCompositionEnd = (event) => {
      if (isComposing.value) {
        isComposing.value = false;
        if (isFunction$1(handleInput)) {
          handleInput(event);
        }
      }
    };
    return {
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd
    };
  }
  const MINIMUM_INPUT_WIDTH = 11;
  const useSelect = (props, emit) => {
    const { t } = useLocale();
    const contentId = useId();
    const nsSelect = useNamespace("select");
    const nsInput = useNamespace("input");
    const states = vue.reactive({
      inputValue: "",
      options: /* @__PURE__ */ new Map(),
      cachedOptions: /* @__PURE__ */ new Map(),
      disabledOptions: /* @__PURE__ */ new Map(),
      optionValues: [],
      selected: props.multiple ? [] : {},
      selectionWidth: 0,
      calculatorWidth: 0,
      collapseItemWidth: 0,
      selectedLabel: "",
      hoveringIndex: -1,
      previousQuery: null,
      inputHovering: false,
      menuVisibleOnFocus: false,
      isBeforeHide: false
    });
    const selectRef = vue.ref(null);
    const selectionRef = vue.ref(null);
    const tooltipRef = vue.ref(null);
    const tagTooltipRef = vue.ref(null);
    const inputRef = vue.ref(null);
    const calculatorRef = vue.ref(null);
    const prefixRef = vue.ref(null);
    const suffixRef = vue.ref(null);
    const menuRef = vue.ref(null);
    const tagMenuRef = vue.ref(null);
    const collapseItemRef = vue.ref(null);
    const scrollbarRef = vue.ref(null);
    const { wrapperRef, isFocused, handleFocus, handleBlur } = useFocusController(inputRef, {
      afterFocus() {
        if (props.automaticDropdown && !expanded.value) {
          expanded.value = true;
          states.menuVisibleOnFocus = true;
        }
      },
      beforeBlur(event) {
        var _a2, _b;
        return ((_a2 = tooltipRef.value) == null ? void 0 : _a2.isFocusInsideContent(event)) || ((_b = tagTooltipRef.value) == null ? void 0 : _b.isFocusInsideContent(event));
      },
      afterBlur() {
        expanded.value = false;
        states.menuVisibleOnFocus = false;
      }
    });
    const expanded = vue.ref(false);
    const hoverOption = vue.ref();
    const { form, formItem } = useFormItem();
    const { inputId } = useFormItemInputId(props, {
      formItemContext: formItem
    });
    const { valueOnClear, isEmptyValue } = useEmptyValues(props);
    const selectDisabled = vue.computed(() => props.disabled || (form == null ? void 0 : form.disabled));
    const hasModelValue = vue.computed(() => {
      return props.multiple ? isArray$2(props.modelValue) && props.modelValue.length > 0 : !isEmptyValue(props.modelValue);
    });
    const showClose = vue.computed(() => {
      return props.clearable && !selectDisabled.value && states.inputHovering && hasModelValue.value;
    });
    const iconComponent = vue.computed(() => props.remote && props.filterable && !props.remoteShowSuffix ? "" : props.suffixIcon);
    const iconReverse = vue.computed(() => nsSelect.is("reverse", iconComponent.value && expanded.value));
    const validateState = vue.computed(() => (formItem == null ? void 0 : formItem.validateState) || "");
    const validateIcon = vue.computed(() => ValidateComponentsMap[validateState.value]);
    const debounce$1 = vue.computed(() => props.remote ? 300 : 0);
    const emptyText = vue.computed(() => {
      if (props.loading) {
        return props.loadingText || t("el.select.loading");
      } else {
        if (props.remote && !states.inputValue && states.options.size === 0)
          return false;
        if (props.filterable && states.inputValue && states.options.size > 0 && filteredOptionsCount.value === 0) {
          return props.noMatchText || t("el.select.noMatch");
        }
        if (states.options.size === 0) {
          return props.noDataText || t("el.select.noData");
        }
      }
      return null;
    });
    const filteredOptionsCount = vue.computed(() => optionsArray.value.filter((option) => option.visible).length);
    const optionsArray = vue.computed(() => {
      const list = Array.from(states.options.values());
      const newList = [];
      states.optionValues.forEach((item) => {
        const index = list.findIndex((i) => i.value === item);
        if (index > -1) {
          newList.push(list[index]);
        }
      });
      return newList.length >= list.length ? newList : list;
    });
    const cachedOptionsArray = vue.computed(() => Array.from(states.cachedOptions.values()));
    const showNewOption = vue.computed(() => {
      const hasExistingOption = optionsArray.value.filter((option) => {
        return !option.created;
      }).some((option) => {
        return option.currentLabel === states.inputValue;
      });
      return props.filterable && props.allowCreate && states.inputValue !== "" && !hasExistingOption;
    });
    const updateOptions = () => {
      if (props.filterable && isFunction$1(props.filterMethod))
        return;
      if (props.filterable && props.remote && isFunction$1(props.remoteMethod))
        return;
      optionsArray.value.forEach((option) => {
        var _a2;
        (_a2 = option.updateOption) == null ? void 0 : _a2.call(option, states.inputValue);
      });
    };
    const selectSize = useFormSize();
    const collapseTagSize = vue.computed(() => ["small"].includes(selectSize.value) ? "small" : "default");
    const dropdownMenuVisible = vue.computed({
      get() {
        return expanded.value && emptyText.value !== false;
      },
      set(val) {
        expanded.value = val;
      }
    });
    const shouldShowPlaceholder = vue.computed(() => {
      if (isArray$2(props.modelValue)) {
        return props.modelValue.length === 0 && !states.inputValue;
      }
      return props.filterable ? !states.inputValue : true;
    });
    const currentPlaceholder = vue.computed(() => {
      var _a2;
      const _placeholder = (_a2 = props.placeholder) != null ? _a2 : t("el.select.placeholder");
      return props.multiple || !hasModelValue.value ? _placeholder : states.selectedLabel;
    });
    vue.watch(() => props.modelValue, (val, oldVal) => {
      if (props.multiple) {
        if (props.filterable && !props.reserveKeyword) {
          states.inputValue = "";
          handleQueryChange("");
        }
      }
      setSelected();
      if (!isEqual(val, oldVal) && props.validateEvent) {
        formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
      }
    }, {
      flush: "post",
      deep: true
    });
    vue.watch(() => expanded.value, (val) => {
      if (val) {
        handleQueryChange(states.inputValue);
      } else {
        states.inputValue = "";
        states.previousQuery = null;
        states.isBeforeHide = true;
      }
      emit("visible-change", val);
    });
    vue.watch(() => states.options.entries(), () => {
      var _a2;
      if (!isClient)
        return;
      const inputs = ((_a2 = selectRef.value) == null ? void 0 : _a2.querySelectorAll("input")) || [];
      if (!props.filterable && !props.defaultFirstOption && !isUndefined(props.modelValue) || !Array.from(inputs).includes(document.activeElement)) {
        setSelected();
      }
      if (props.defaultFirstOption && (props.filterable || props.remote) && filteredOptionsCount.value) {
        checkDefaultFirstOption();
      }
    }, {
      flush: "post"
    });
    vue.watch(() => states.hoveringIndex, (val) => {
      if (isNumber(val) && val > -1) {
        hoverOption.value = optionsArray.value[val] || {};
      } else {
        hoverOption.value = {};
      }
      optionsArray.value.forEach((option) => {
        option.hover = hoverOption.value === option;
      });
    });
    vue.watchEffect(() => {
      if (states.isBeforeHide)
        return;
      updateOptions();
    });
    const handleQueryChange = (val) => {
      if (states.previousQuery === val) {
        return;
      }
      states.previousQuery = val;
      if (props.filterable && isFunction$1(props.filterMethod)) {
        props.filterMethod(val);
      } else if (props.filterable && props.remote && isFunction$1(props.remoteMethod)) {
        props.remoteMethod(val);
      }
      if (props.defaultFirstOption && (props.filterable || props.remote) && filteredOptionsCount.value) {
        vue.nextTick(checkDefaultFirstOption);
      } else {
        vue.nextTick(updateHoveringIndex);
      }
    };
    const checkDefaultFirstOption = () => {
      const optionsInDropdown = optionsArray.value.filter((n) => n.visible && !n.disabled && !n.states.groupDisabled);
      const userCreatedOption = optionsInDropdown.find((n) => n.created);
      const firstOriginOption = optionsInDropdown[0];
      states.hoveringIndex = getValueIndex(optionsArray.value, userCreatedOption || firstOriginOption);
    };
    const setSelected = () => {
      if (!props.multiple) {
        const option = getOption(props.modelValue);
        states.selectedLabel = option.currentLabel;
        states.selected = option;
        return;
      } else {
        states.selectedLabel = "";
      }
      const result = [];
      if (isArray$2(props.modelValue)) {
        props.modelValue.forEach((value) => {
          result.push(getOption(value));
        });
      }
      states.selected = result;
    };
    const getOption = (value) => {
      let option;
      const isObjectValue = toRawType(value).toLowerCase() === "object";
      const isNull = toRawType(value).toLowerCase() === "null";
      const isUndefined2 = toRawType(value).toLowerCase() === "undefined";
      for (let i = states.cachedOptions.size - 1; i >= 0; i--) {
        const cachedOption = cachedOptionsArray.value[i];
        const isEqualValue = isObjectValue ? get(cachedOption.value, props.valueKey) === get(value, props.valueKey) : cachedOption.value === value;
        if (isEqualValue) {
          option = {
            value,
            currentLabel: cachedOption.currentLabel,
            isDisabled: cachedOption.isDisabled
          };
          break;
        }
      }
      if (option)
        return option;
      const label = isObjectValue ? value.label : !isNull && !isUndefined2 ? value : "";
      const newOption = {
        value,
        currentLabel: label
      };
      return newOption;
    };
    const updateHoveringIndex = () => {
      if (!props.multiple) {
        states.hoveringIndex = optionsArray.value.findIndex((item) => {
          return getValueKey(item) === getValueKey(states.selected);
        });
      } else {
        states.hoveringIndex = optionsArray.value.findIndex((item) => states.selected.some((selected) => getValueKey(selected) === getValueKey(item)));
      }
    };
    const resetSelectionWidth = () => {
      states.selectionWidth = selectionRef.value.getBoundingClientRect().width;
    };
    const resetCalculatorWidth = () => {
      states.calculatorWidth = calculatorRef.value.getBoundingClientRect().width;
    };
    const resetCollapseItemWidth = () => {
      states.collapseItemWidth = collapseItemRef.value.getBoundingClientRect().width;
    };
    const updateTooltip = () => {
      var _a2, _b;
      (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
    };
    const updateTagTooltip = () => {
      var _a2, _b;
      (_b = (_a2 = tagTooltipRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
    };
    const onInputChange = () => {
      if (states.inputValue.length > 0 && !expanded.value) {
        expanded.value = true;
      }
      handleQueryChange(states.inputValue);
    };
    const onInput = (event) => {
      states.inputValue = event.target.value;
      if (props.remote) {
        debouncedOnInputChange();
      } else {
        return onInputChange();
      }
    };
    const debouncedOnInputChange = debounce(() => {
      onInputChange();
    }, debounce$1.value);
    const emitChange = (val) => {
      if (!isEqual(props.modelValue, val)) {
        emit(CHANGE_EVENT, val);
      }
    };
    const getLastNotDisabledIndex = (value) => findLastIndex(value, (it2) => !states.disabledOptions.has(it2));
    const deletePrevTag = (e) => {
      if (!props.multiple)
        return;
      if (e.code === EVENT_CODE.delete)
        return;
      if (e.target.value.length <= 0) {
        const value = props.modelValue.slice();
        const lastNotDisabledIndex = getLastNotDisabledIndex(value);
        if (lastNotDisabledIndex < 0)
          return;
        value.splice(lastNotDisabledIndex, 1);
        emit(UPDATE_MODEL_EVENT, value);
        emitChange(value);
      }
    };
    const deleteTag = (event, tag) => {
      const index = states.selected.indexOf(tag);
      if (index > -1 && !selectDisabled.value) {
        const value = props.modelValue.slice();
        value.splice(index, 1);
        emit(UPDATE_MODEL_EVENT, value);
        emitChange(value);
        emit("remove-tag", tag.value);
      }
      event.stopPropagation();
      focus();
    };
    const deleteSelected = (event) => {
      event.stopPropagation();
      const value = props.multiple ? [] : valueOnClear.value;
      if (props.multiple) {
        for (const item of states.selected) {
          if (item.isDisabled)
            value.push(item.value);
        }
      }
      emit(UPDATE_MODEL_EVENT, value);
      emitChange(value);
      states.hoveringIndex = -1;
      expanded.value = false;
      emit("clear");
      focus();
    };
    const handleOptionSelect = (option) => {
      if (props.multiple) {
        const value = (props.modelValue || []).slice();
        const optionIndex = getValueIndex(value, option.value);
        if (optionIndex > -1) {
          value.splice(optionIndex, 1);
        } else if (props.multipleLimit <= 0 || value.length < props.multipleLimit) {
          value.push(option.value);
        }
        emit(UPDATE_MODEL_EVENT, value);
        emitChange(value);
        if (option.created) {
          handleQueryChange("");
        }
        if (props.filterable && !props.reserveKeyword) {
          states.inputValue = "";
        }
      } else {
        emit(UPDATE_MODEL_EVENT, option.value);
        emitChange(option.value);
        expanded.value = false;
      }
      focus();
      if (expanded.value)
        return;
      vue.nextTick(() => {
        scrollToOption(option);
      });
    };
    const getValueIndex = (arr = [], value) => {
      if (!isObject$1(value))
        return arr.indexOf(value);
      const valueKey = props.valueKey;
      let index = -1;
      arr.some((item, i) => {
        if (vue.toRaw(get(item, valueKey)) === get(value, valueKey)) {
          index = i;
          return true;
        }
        return false;
      });
      return index;
    };
    const scrollToOption = (option) => {
      var _a2, _b, _c, _d, _e;
      const targetOption = isArray$2(option) ? option[0] : option;
      let target = null;
      if (targetOption == null ? void 0 : targetOption.value) {
        const options = optionsArray.value.filter((item) => item.value === targetOption.value);
        if (options.length > 0) {
          target = options[0].$el;
        }
      }
      if (tooltipRef.value && target) {
        const menu = (_d = (_c = (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.popperRef) == null ? void 0 : _b.contentRef) == null ? void 0 : _c.querySelector) == null ? void 0 : _d.call(_c, `.${nsSelect.be("dropdown", "wrap")}`);
        if (menu) {
          scrollIntoView(menu, target);
        }
      }
      (_e = scrollbarRef.value) == null ? void 0 : _e.handleScroll();
    };
    const onOptionCreate = (vm) => {
      states.options.set(vm.value, vm);
      states.cachedOptions.set(vm.value, vm);
      vm.disabled && states.disabledOptions.set(vm.value, vm);
    };
    const onOptionDestroy = (key, vm) => {
      if (states.options.get(key) === vm) {
        states.options.delete(key);
      }
    };
    const {
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd
    } = useInput((e) => onInput(e));
    const popperRef = vue.computed(() => {
      var _a2, _b;
      return (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.popperRef) == null ? void 0 : _b.contentRef;
    });
    const handleMenuEnter = () => {
      states.isBeforeHide = false;
      vue.nextTick(() => scrollToOption(states.selected));
    };
    const focus = () => {
      var _a2;
      (_a2 = inputRef.value) == null ? void 0 : _a2.focus();
    };
    const blur = () => {
      handleClickOutside();
    };
    const handleClearClick = (event) => {
      deleteSelected(event);
    };
    const handleClickOutside = (event) => {
      expanded.value = false;
      if (isFocused.value) {
        const _event2 = new FocusEvent("focus", event);
        vue.nextTick(() => handleBlur(_event2));
      }
    };
    const handleEsc = () => {
      if (states.inputValue.length > 0) {
        states.inputValue = "";
      } else {
        expanded.value = false;
      }
    };
    const toggleMenu = () => {
      if (selectDisabled.value)
        return;
      if (states.menuVisibleOnFocus) {
        states.menuVisibleOnFocus = false;
      } else {
        expanded.value = !expanded.value;
      }
    };
    const selectOption = () => {
      if (!expanded.value) {
        toggleMenu();
      } else {
        if (optionsArray.value[states.hoveringIndex]) {
          handleOptionSelect(optionsArray.value[states.hoveringIndex]);
        }
      }
    };
    const getValueKey = (item) => {
      return isObject$1(item.value) ? get(item.value, props.valueKey) : item.value;
    };
    const optionsAllDisabled = vue.computed(() => optionsArray.value.filter((option) => option.visible).every((option) => option.disabled));
    const showTagList = vue.computed(() => {
      if (!props.multiple) {
        return [];
      }
      return props.collapseTags ? states.selected.slice(0, props.maxCollapseTags) : states.selected;
    });
    const collapseTagList = vue.computed(() => {
      if (!props.multiple) {
        return [];
      }
      return props.collapseTags ? states.selected.slice(props.maxCollapseTags) : [];
    });
    const navigateOptions = (direction) => {
      if (!expanded.value) {
        expanded.value = true;
        return;
      }
      if (states.options.size === 0 || filteredOptionsCount.value === 0)
        return;
      if (!optionsAllDisabled.value) {
        if (direction === "next") {
          states.hoveringIndex++;
          if (states.hoveringIndex === states.options.size) {
            states.hoveringIndex = 0;
          }
        } else if (direction === "prev") {
          states.hoveringIndex--;
          if (states.hoveringIndex < 0) {
            states.hoveringIndex = states.options.size - 1;
          }
        }
        const option = optionsArray.value[states.hoveringIndex];
        if (option.disabled === true || option.states.groupDisabled === true || !option.visible) {
          navigateOptions(direction);
        }
        vue.nextTick(() => scrollToOption(hoverOption.value));
      }
    };
    const getGapWidth = () => {
      if (!selectionRef.value)
        return 0;
      const style2 = window.getComputedStyle(selectionRef.value);
      return Number.parseFloat(style2.gap || "6px");
    };
    const tagStyle = vue.computed(() => {
      const gapWidth = getGapWidth();
      const maxWidth = collapseItemRef.value && props.maxCollapseTags === 1 ? states.selectionWidth - states.collapseItemWidth - gapWidth : states.selectionWidth;
      return { maxWidth: `${maxWidth}px` };
    });
    const collapseTagStyle = vue.computed(() => {
      return { maxWidth: `${states.selectionWidth}px` };
    });
    const inputStyle = vue.computed(() => ({
      width: `${Math.max(states.calculatorWidth, MINIMUM_INPUT_WIDTH)}px`
    }));
    if (props.multiple && !isArray$2(props.modelValue)) {
      emit(UPDATE_MODEL_EVENT, []);
    }
    if (!props.multiple && isArray$2(props.modelValue)) {
      emit(UPDATE_MODEL_EVENT, "");
    }
    useResizeObserver(selectionRef, resetSelectionWidth);
    useResizeObserver(calculatorRef, resetCalculatorWidth);
    useResizeObserver(menuRef, updateTooltip);
    useResizeObserver(wrapperRef, updateTooltip);
    useResizeObserver(tagMenuRef, updateTagTooltip);
    useResizeObserver(collapseItemRef, resetCollapseItemWidth);
    vue.onMounted(() => {
      setSelected();
    });
    return {
      inputId,
      contentId,
      nsSelect,
      nsInput,
      states,
      isFocused,
      expanded,
      optionsArray,
      hoverOption,
      selectSize,
      filteredOptionsCount,
      resetCalculatorWidth,
      updateTooltip,
      updateTagTooltip,
      debouncedOnInputChange,
      onInput,
      deletePrevTag,
      deleteTag,
      deleteSelected,
      handleOptionSelect,
      scrollToOption,
      hasModelValue,
      shouldShowPlaceholder,
      currentPlaceholder,
      showClose,
      iconComponent,
      iconReverse,
      validateState,
      validateIcon,
      showNewOption,
      updateOptions,
      collapseTagSize,
      setSelected,
      selectDisabled,
      emptyText,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd,
      onOptionCreate,
      onOptionDestroy,
      handleMenuEnter,
      handleFocus,
      focus,
      blur,
      handleBlur,
      handleClearClick,
      handleClickOutside,
      handleEsc,
      toggleMenu,
      selectOption,
      getValueKey,
      navigateOptions,
      dropdownMenuVisible,
      showTagList,
      collapseTagList,
      tagStyle,
      collapseTagStyle,
      inputStyle,
      popperRef,
      inputRef,
      tooltipRef,
      tagTooltipRef,
      calculatorRef,
      prefixRef,
      suffixRef,
      selectRef,
      wrapperRef,
      selectionRef,
      scrollbarRef,
      menuRef,
      tagMenuRef,
      collapseItemRef
    };
  };
  var ElOptions = vue.defineComponent({
    name: "ElOptions",
    setup(_, { slots }) {
      const select = vue.inject(selectKey);
      let cachedValueList = [];
      return () => {
        var _a2, _b;
        const children = (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
        const valueList = [];
        function filterOptions(children2) {
          if (!isArray$2(children2))
            return;
          children2.forEach((item) => {
            var _a22, _b2, _c, _d;
            const name = (_a22 = (item == null ? void 0 : item.type) || {}) == null ? void 0 : _a22.name;
            if (name === "ElOptionGroup") {
              filterOptions(!isString(item.children) && !isArray$2(item.children) && isFunction$1((_b2 = item.children) == null ? void 0 : _b2.default) ? (_c = item.children) == null ? void 0 : _c.default() : item.children);
            } else if (name === "ElOption") {
              valueList.push((_d = item.props) == null ? void 0 : _d.value);
            } else if (isArray$2(item.children)) {
              filterOptions(item.children);
            }
          });
        }
        if (children.length) {
          filterOptions((_b = children[0]) == null ? void 0 : _b.children);
        }
        if (!isEqual(valueList, cachedValueList)) {
          cachedValueList = valueList;
          if (select) {
            select.states.optionValues = valueList;
          }
        }
        return children;
      };
    }
  });
  const SelectProps = buildProps({
    name: String,
    id: String,
    modelValue: {
      type: [Array, String, Number, Boolean, Object],
      default: void 0
    },
    autocomplete: {
      type: String,
      default: "off"
    },
    automaticDropdown: Boolean,
    size: useSizeProp,
    effect: {
      type: definePropType(String),
      default: "light"
    },
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    loading: Boolean,
    popperClass: {
      type: String,
      default: ""
    },
    popperOptions: {
      type: definePropType(Object),
      default: () => ({})
    },
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String
    },
    defaultFirstOption: Boolean,
    reserveKeyword: {
      type: Boolean,
      default: true
    },
    valueKey: {
      type: String,
      default: "value"
    },
    collapseTags: Boolean,
    collapseTagsTooltip: Boolean,
    maxCollapseTags: {
      type: Number,
      default: 1
    },
    teleported: useTooltipContentProps.teleported,
    persistent: {
      type: Boolean,
      default: true
    },
    clearIcon: {
      type: iconPropType,
      default: circle_close_default
    },
    fitInputWidth: Boolean,
    suffixIcon: {
      type: iconPropType,
      default: arrow_down_default
    },
    tagType: { ...tagProps.type, default: "info" },
    validateEvent: {
      type: Boolean,
      default: true
    },
    remoteShowSuffix: Boolean,
    placement: {
      type: definePropType(String),
      values: Ee,
      default: "bottom-start"
    },
    fallbackPlacements: {
      type: definePropType(Array),
      default: ["bottom-start", "top-start", "right", "left"]
    },
    ariaLabel: {
      type: String,
      default: void 0
    },
    ...useEmptyValuesProps
  });
  const COMPONENT_NAME = "ElSelect";
  const _sfc_main$4 = vue.defineComponent({
    name: COMPONENT_NAME,
    componentName: COMPONENT_NAME,
    components: {
      ElInput,
      ElSelectMenu,
      ElOption: Option,
      ElOptions,
      ElTag,
      ElScrollbar,
      ElTooltip,
      ElIcon
    },
    directives: { ClickOutside },
    props: SelectProps,
    emits: [
      UPDATE_MODEL_EVENT,
      CHANGE_EVENT,
      "remove-tag",
      "clear",
      "visible-change",
      "focus",
      "blur"
    ],
    setup(props, { emit }) {
      const API = useSelect(props, emit);
      vue.provide(selectKey, vue.reactive({
        props,
        states: API.states,
        optionsArray: API.optionsArray,
        handleOptionSelect: API.handleOptionSelect,
        onOptionCreate: API.onOptionCreate,
        onOptionDestroy: API.onOptionDestroy,
        selectRef: API.selectRef,
        setSelected: API.setSelected
      }));
      return {
        ...API
      };
    }
  });
  const _hoisted_1$3 = ["id", "disabled", "autocomplete", "readonly", "aria-activedescendant", "aria-controls", "aria-expanded", "aria-label"];
  const _hoisted_2$2 = ["textContent"];
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_tag = vue.resolveComponent("el-tag");
    const _component_el_tooltip = vue.resolveComponent("el-tooltip");
    const _component_el_icon = vue.resolveComponent("el-icon");
    const _component_el_option = vue.resolveComponent("el-option");
    const _component_el_options = vue.resolveComponent("el-options");
    const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
    const _component_el_select_menu = vue.resolveComponent("el-select-menu");
    const _directive_click_outside = vue.resolveDirective("click-outside");
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
      ref: "selectRef",
      class: vue.normalizeClass([_ctx.nsSelect.b(), _ctx.nsSelect.m(_ctx.selectSize)]),
      onMouseenter: _cache[16] || (_cache[16] = ($event) => _ctx.states.inputHovering = true),
      onMouseleave: _cache[17] || (_cache[17] = ($event) => _ctx.states.inputHovering = false),
      onClick: _cache[18] || (_cache[18] = vue.withModifiers((...args) => _ctx.toggleMenu && _ctx.toggleMenu(...args), ["prevent", "stop"]))
    }, [
      vue.createVNode(_component_el_tooltip, {
        ref: "tooltipRef",
        visible: _ctx.dropdownMenuVisible,
        placement: _ctx.placement,
        teleported: _ctx.teleported,
        "popper-class": [_ctx.nsSelect.e("popper"), _ctx.popperClass],
        "popper-options": _ctx.popperOptions,
        "fallback-placements": _ctx.fallbackPlacements,
        effect: _ctx.effect,
        pure: "",
        trigger: "click",
        transition: `${_ctx.nsSelect.namespace.value}-zoom-in-top`,
        "stop-popper-mouse-event": false,
        "gpu-acceleration": false,
        persistent: _ctx.persistent,
        onBeforeShow: _ctx.handleMenuEnter,
        onHide: _cache[15] || (_cache[15] = ($event) => _ctx.states.isBeforeHide = false)
      }, {
        default: vue.withCtx(() => {
          var _a2;
          return [
            vue.createElementVNode("div", {
              ref: "wrapperRef",
              class: vue.normalizeClass([
                _ctx.nsSelect.e("wrapper"),
                _ctx.nsSelect.is("focused", _ctx.isFocused),
                _ctx.nsSelect.is("hovering", _ctx.states.inputHovering),
                _ctx.nsSelect.is("filterable", _ctx.filterable),
                _ctx.nsSelect.is("disabled", _ctx.selectDisabled)
              ])
            }, [
              _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                ref: "prefixRef",
                class: vue.normalizeClass(_ctx.nsSelect.e("prefix"))
              }, [
                vue.renderSlot(_ctx.$slots, "prefix")
              ], 2)) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("div", {
                ref: "selectionRef",
                class: vue.normalizeClass([
                  _ctx.nsSelect.e("selection"),
                  _ctx.nsSelect.is("near", _ctx.multiple && !_ctx.$slots.prefix && !!_ctx.states.selected.length)
                ])
              }, [
                _ctx.multiple ? vue.renderSlot(_ctx.$slots, "tag", { key: 0 }, () => [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.showTagList, (item) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      key: _ctx.getValueKey(item),
                      class: vue.normalizeClass(_ctx.nsSelect.e("selected-item"))
                    }, [
                      vue.createVNode(_component_el_tag, {
                        closable: !_ctx.selectDisabled && !item.isDisabled,
                        size: _ctx.collapseTagSize,
                        type: _ctx.tagType,
                        "disable-transitions": "",
                        style: vue.normalizeStyle(_ctx.tagStyle),
                        onClose: ($event) => _ctx.deleteTag($event, item)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createElementVNode("span", {
                            class: vue.normalizeClass(_ctx.nsSelect.e("tags-text"))
                          }, vue.toDisplayString(item.currentLabel), 3)
                        ]),
                        _: 2
                      }, 1032, ["closable", "size", "type", "style", "onClose"])
                    ], 2);
                  }), 128)),
                  _ctx.collapseTags && _ctx.states.selected.length > _ctx.maxCollapseTags ? (vue.openBlock(), vue.createBlock(_component_el_tooltip, {
                    key: 0,
                    ref: "tagTooltipRef",
                    disabled: _ctx.dropdownMenuVisible || !_ctx.collapseTagsTooltip,
                    "fallback-placements": ["bottom", "top", "right", "left"],
                    effect: _ctx.effect,
                    placement: "bottom",
                    teleported: _ctx.teleported
                  }, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("div", {
                        ref: "collapseItemRef",
                        class: vue.normalizeClass(_ctx.nsSelect.e("selected-item"))
                      }, [
                        vue.createVNode(_component_el_tag, {
                          closable: false,
                          size: _ctx.collapseTagSize,
                          type: _ctx.tagType,
                          "disable-transitions": "",
                          style: vue.normalizeStyle(_ctx.collapseTagStyle)
                        }, {
                          default: vue.withCtx(() => [
                            vue.createElementVNode("span", {
                              class: vue.normalizeClass(_ctx.nsSelect.e("tags-text"))
                            }, " + " + vue.toDisplayString(_ctx.states.selected.length - _ctx.maxCollapseTags), 3)
                          ]),
                          _: 1
                        }, 8, ["size", "type", "style"])
                      ], 2)
                    ]),
                    content: vue.withCtx(() => [
                      vue.createElementVNode("div", {
                        ref: "tagMenuRef",
                        class: vue.normalizeClass(_ctx.nsSelect.e("selection"))
                      }, [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.collapseTagList, (item) => {
                          return vue.openBlock(), vue.createElementBlock("div", {
                            key: _ctx.getValueKey(item),
                            class: vue.normalizeClass(_ctx.nsSelect.e("selected-item"))
                          }, [
                            vue.createVNode(_component_el_tag, {
                              class: "in-tooltip",
                              closable: !_ctx.selectDisabled && !item.isDisabled,
                              size: _ctx.collapseTagSize,
                              type: _ctx.tagType,
                              "disable-transitions": "",
                              onClose: ($event) => _ctx.deleteTag($event, item)
                            }, {
                              default: vue.withCtx(() => [
                                vue.createElementVNode("span", {
                                  class: vue.normalizeClass(_ctx.nsSelect.e("tags-text"))
                                }, vue.toDisplayString(item.currentLabel), 3)
                              ]),
                              _: 2
                            }, 1032, ["closable", "size", "type", "onClose"])
                          ], 2);
                        }), 128))
                      ], 2)
                    ]),
                    _: 1
                  }, 8, ["disabled", "effect", "teleported"])) : vue.createCommentVNode("v-if", true)
                ]) : vue.createCommentVNode("v-if", true),
                !_ctx.selectDisabled ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 1,
                  class: vue.normalizeClass([
                    _ctx.nsSelect.e("selected-item"),
                    _ctx.nsSelect.e("input-wrapper"),
                    _ctx.nsSelect.is("hidden", !_ctx.filterable)
                  ])
                }, [
                  vue.withDirectives(vue.createElementVNode("input", {
                    id: _ctx.inputId,
                    ref: "inputRef",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.states.inputValue = $event),
                    type: "text",
                    class: vue.normalizeClass([_ctx.nsSelect.e("input"), _ctx.nsSelect.is(_ctx.selectSize)]),
                    disabled: _ctx.selectDisabled,
                    autocomplete: _ctx.autocomplete,
                    style: vue.normalizeStyle(_ctx.inputStyle),
                    role: "combobox",
                    readonly: !_ctx.filterable,
                    spellcheck: "false",
                    "aria-activedescendant": ((_a2 = _ctx.hoverOption) == null ? void 0 : _a2.id) || "",
                    "aria-controls": _ctx.contentId,
                    "aria-expanded": _ctx.dropdownMenuVisible,
                    "aria-label": _ctx.ariaLabel,
                    "aria-autocomplete": "none",
                    "aria-haspopup": "listbox",
                    onFocus: _cache[1] || (_cache[1] = (...args) => _ctx.handleFocus && _ctx.handleFocus(...args)),
                    onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.handleBlur && _ctx.handleBlur(...args)),
                    onKeydown: [
                      _cache[3] || (_cache[3] = vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("next"), ["stop", "prevent"]), ["down"])),
                      _cache[4] || (_cache[4] = vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("prev"), ["stop", "prevent"]), ["up"])),
                      _cache[5] || (_cache[5] = vue.withKeys(vue.withModifiers((...args) => _ctx.handleEsc && _ctx.handleEsc(...args), ["stop", "prevent"]), ["esc"])),
                      _cache[6] || (_cache[6] = vue.withKeys(vue.withModifiers((...args) => _ctx.selectOption && _ctx.selectOption(...args), ["stop", "prevent"]), ["enter"])),
                      _cache[7] || (_cache[7] = vue.withKeys(vue.withModifiers((...args) => _ctx.deletePrevTag && _ctx.deletePrevTag(...args), ["stop"]), ["delete"]))
                    ],
                    onCompositionstart: _cache[8] || (_cache[8] = (...args) => _ctx.handleCompositionStart && _ctx.handleCompositionStart(...args)),
                    onCompositionupdate: _cache[9] || (_cache[9] = (...args) => _ctx.handleCompositionUpdate && _ctx.handleCompositionUpdate(...args)),
                    onCompositionend: _cache[10] || (_cache[10] = (...args) => _ctx.handleCompositionEnd && _ctx.handleCompositionEnd(...args)),
                    onInput: _cache[11] || (_cache[11] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
                    onClick: _cache[12] || (_cache[12] = vue.withModifiers((...args) => _ctx.toggleMenu && _ctx.toggleMenu(...args), ["stop"]))
                  }, null, 46, _hoisted_1$3), [
                    [vue.vModelText, _ctx.states.inputValue]
                  ]),
                  _ctx.filterable ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    ref: "calculatorRef",
                    "aria-hidden": "true",
                    class: vue.normalizeClass(_ctx.nsSelect.e("input-calculator")),
                    textContent: vue.toDisplayString(_ctx.states.inputValue)
                  }, null, 10, _hoisted_2$2)) : vue.createCommentVNode("v-if", true)
                ], 2)) : vue.createCommentVNode("v-if", true),
                _ctx.shouldShowPlaceholder ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 2,
                  class: vue.normalizeClass([
                    _ctx.nsSelect.e("selected-item"),
                    _ctx.nsSelect.e("placeholder"),
                    _ctx.nsSelect.is("transparent", !_ctx.hasModelValue || _ctx.expanded && !_ctx.states.inputValue)
                  ])
                }, [
                  vue.createElementVNode("span", null, vue.toDisplayString(_ctx.currentPlaceholder), 1)
                ], 2)) : vue.createCommentVNode("v-if", true)
              ], 2),
              vue.createElementVNode("div", {
                ref: "suffixRef",
                class: vue.normalizeClass(_ctx.nsSelect.e("suffix"))
              }, [
                _ctx.iconComponent && !_ctx.showClose ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                  key: 0,
                  class: vue.normalizeClass([_ctx.nsSelect.e("caret"), _ctx.nsSelect.e("icon"), _ctx.iconReverse])
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.iconComponent)))
                  ]),
                  _: 1
                }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
                _ctx.showClose && _ctx.clearIcon ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                  key: 1,
                  class: vue.normalizeClass([_ctx.nsSelect.e("caret"), _ctx.nsSelect.e("icon")]),
                  onClick: _ctx.handleClearClick
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.clearIcon)))
                  ]),
                  _: 1
                }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true),
                _ctx.validateState && _ctx.validateIcon ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                  key: 2,
                  class: vue.normalizeClass([_ctx.nsInput.e("icon"), _ctx.nsInput.e("validateIcon")])
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.validateIcon)))
                  ]),
                  _: 1
                }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
              ], 2)
            ], 2)
          ];
        }),
        content: vue.withCtx(() => [
          vue.createVNode(_component_el_select_menu, { ref: "menuRef" }, {
            default: vue.withCtx(() => [
              _ctx.$slots.header ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(_ctx.nsSelect.be("dropdown", "header")),
                onClick: _cache[13] || (_cache[13] = vue.withModifiers(() => {
                }, ["stop"]))
              }, [
                vue.renderSlot(_ctx.$slots, "header")
              ], 2)) : vue.createCommentVNode("v-if", true),
              vue.withDirectives(vue.createVNode(_component_el_scrollbar, {
                id: _ctx.contentId,
                ref: "scrollbarRef",
                tag: "ul",
                "wrap-class": _ctx.nsSelect.be("dropdown", "wrap"),
                "view-class": _ctx.nsSelect.be("dropdown", "list"),
                class: vue.normalizeClass([_ctx.nsSelect.is("empty", _ctx.filteredOptionsCount === 0)]),
                role: "listbox",
                "aria-label": _ctx.ariaLabel,
                "aria-orientation": "vertical"
              }, {
                default: vue.withCtx(() => [
                  _ctx.showNewOption ? (vue.openBlock(), vue.createBlock(_component_el_option, {
                    key: 0,
                    value: _ctx.states.inputValue,
                    created: true
                  }, null, 8, ["value"])) : vue.createCommentVNode("v-if", true),
                  vue.createVNode(_component_el_options, null, {
                    default: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "default")
                    ]),
                    _: 3
                  })
                ]),
                _: 3
              }, 8, ["id", "wrap-class", "view-class", "class", "aria-label"]), [
                [vue.vShow, _ctx.states.options.size > 0 && !_ctx.loading]
              ]),
              _ctx.$slots.loading && _ctx.loading ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 1,
                class: vue.normalizeClass(_ctx.nsSelect.be("dropdown", "loading"))
              }, [
                vue.renderSlot(_ctx.$slots, "loading")
              ], 2)) : _ctx.loading || _ctx.filteredOptionsCount === 0 ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 2,
                class: vue.normalizeClass(_ctx.nsSelect.be("dropdown", "empty"))
              }, [
                vue.renderSlot(_ctx.$slots, "empty", {}, () => [
                  vue.createElementVNode("span", null, vue.toDisplayString(_ctx.emptyText), 1)
                ])
              ], 2)) : vue.createCommentVNode("v-if", true),
              _ctx.$slots.footer ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 3,
                class: vue.normalizeClass(_ctx.nsSelect.be("dropdown", "footer")),
                onClick: _cache[14] || (_cache[14] = vue.withModifiers(() => {
                }, ["stop"]))
              }, [
                vue.renderSlot(_ctx.$slots, "footer")
              ], 2)) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 512)
        ]),
        _: 3
      }, 8, ["visible", "placement", "teleported", "popper-class", "popper-options", "fallback-placements", "effect", "transition", "persistent", "onBeforeShow"])
    ], 34)), [
      [_directive_click_outside, _ctx.handleClickOutside, _ctx.popperRef]
    ]);
  }
  var Select = /* @__PURE__ */ _export_sfc$1(_sfc_main$4, [["render", _sfc_render$1], ["__file", "select.vue"]]);
  const _sfc_main$3 = vue.defineComponent({
    name: "ElOptionGroup",
    componentName: "ElOptionGroup",
    props: {
      label: String,
      disabled: Boolean
    },
    setup(props) {
      const ns = useNamespace("select");
      const groupRef = vue.ref(null);
      const instance = vue.getCurrentInstance();
      const children = vue.ref([]);
      vue.provide(selectGroupKey, vue.reactive({
        ...vue.toRefs(props)
      }));
      const visible = vue.computed(() => children.value.some((option) => option.visible === true));
      const flattedChildren = (node) => {
        const children2 = [];
        if (isArray$2(node.children)) {
          node.children.forEach((child) => {
            var _a2, _b;
            if (child.type && child.type.name === "ElOption" && child.component && child.component.proxy) {
              children2.push(child.component.proxy);
            } else if ((_a2 = child.children) == null ? void 0 : _a2.length) {
              children2.push(...flattedChildren(child));
            } else if ((_b = child.component) == null ? void 0 : _b.subTree) {
              children2.push(...flattedChildren(child.component.subTree));
            }
          });
        }
        return children2;
      };
      const updateChildren = () => {
        children.value = flattedChildren(instance.subTree);
      };
      vue.onMounted(() => {
        updateChildren();
      });
      useMutationObserver(groupRef, updateChildren, {
        attributes: true,
        subtree: true,
        childList: true
      });
      return {
        groupRef,
        visible,
        ns
      };
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("ul", {
      ref: "groupRef",
      class: vue.normalizeClass(_ctx.ns.be("group", "wrap"))
    }, [
      vue.createElementVNode("li", {
        class: vue.normalizeClass(_ctx.ns.be("group", "title"))
      }, vue.toDisplayString(_ctx.label), 3),
      vue.createElementVNode("li", null, [
        vue.createElementVNode("ul", {
          class: vue.normalizeClass(_ctx.ns.b("group"))
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2)
      ])
    ], 2)), [
      [vue.vShow, _ctx.visible]
    ]);
  }
  var OptionGroup = /* @__PURE__ */ _export_sfc$1(_sfc_main$3, [["render", _sfc_render], ["__file", "option-group.vue"]]);
  const ElSelect = withInstall(Select, {
    Option,
    OptionGroup
  });
  const ElOption = withNoopInstall(Option);
  withNoopInstall(OptionGroup);
  const progressProps = buildProps({
    type: {
      type: String,
      default: "line",
      values: ["line", "circle", "dashboard"]
    },
    percentage: {
      type: Number,
      default: 0,
      validator: (val) => val >= 0 && val <= 100
    },
    status: {
      type: String,
      default: "",
      values: ["", "success", "exception", "warning"]
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 3
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    strokeLinecap: {
      type: definePropType(String),
      default: "round"
    },
    textInside: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 126
    },
    showText: {
      type: Boolean,
      default: true
    },
    color: {
      type: definePropType([
        String,
        Array,
        Function
      ]),
      default: ""
    },
    striped: Boolean,
    stripedFlow: Boolean,
    format: {
      type: definePropType(Function),
      default: (percentage) => `${percentage}%`
    }
  });
  const _hoisted_1$2 = ["aria-valuenow"];
  const _hoisted_2$1 = { viewBox: "0 0 100 100" };
  const _hoisted_3$1 = ["d", "stroke", "stroke-linecap", "stroke-width"];
  const _hoisted_4$1 = ["d", "stroke", "opacity", "stroke-linecap", "stroke-width"];
  const _hoisted_5$1 = { key: 0 };
  const __default__ = vue.defineComponent({
    name: "ElProgress"
  });
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: progressProps,
    setup(__props) {
      const props = __props;
      const STATUS_COLOR_MAP = {
        success: "#13ce66",
        exception: "#ff4949",
        warning: "#e6a23c",
        default: "#20a0ff"
      };
      const ns = useNamespace("progress");
      const barStyle = vue.computed(() => ({
        width: `${props.percentage}%`,
        animationDuration: `${props.duration}s`,
        backgroundColor: getCurrentColor(props.percentage)
      }));
      const relativeStrokeWidth = vue.computed(() => (props.strokeWidth / props.width * 100).toFixed(1));
      const radius = vue.computed(() => {
        if (["circle", "dashboard"].includes(props.type)) {
          return Number.parseInt(`${50 - Number.parseFloat(relativeStrokeWidth.value) / 2}`, 10);
        }
        return 0;
      });
      const trackPath = vue.computed(() => {
        const r = radius.value;
        const isDashboard = props.type === "dashboard";
        return `
          M 50 50
          m 0 ${isDashboard ? "" : "-"}${r}
          a ${r} ${r} 0 1 1 0 ${isDashboard ? "-" : ""}${r * 2}
          a ${r} ${r} 0 1 1 0 ${isDashboard ? "" : "-"}${r * 2}
          `;
      });
      const perimeter = vue.computed(() => 2 * Math.PI * radius.value);
      const rate = vue.computed(() => props.type === "dashboard" ? 0.75 : 1);
      const strokeDashoffset = vue.computed(() => {
        const offset = -1 * perimeter.value * (1 - rate.value) / 2;
        return `${offset}px`;
      });
      const trailPathStyle = vue.computed(() => ({
        strokeDasharray: `${perimeter.value * rate.value}px, ${perimeter.value}px`,
        strokeDashoffset: strokeDashoffset.value
      }));
      const circlePathStyle = vue.computed(() => ({
        strokeDasharray: `${perimeter.value * rate.value * (props.percentage / 100)}px, ${perimeter.value}px`,
        strokeDashoffset: strokeDashoffset.value,
        transition: "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease, opacity ease 0.6s"
      }));
      const stroke = vue.computed(() => {
        let ret;
        if (props.color) {
          ret = getCurrentColor(props.percentage);
        } else {
          ret = STATUS_COLOR_MAP[props.status] || STATUS_COLOR_MAP.default;
        }
        return ret;
      });
      const statusIcon = vue.computed(() => {
        if (props.status === "warning") {
          return warning_filled_default;
        }
        if (props.type === "line") {
          return props.status === "success" ? circle_check_default : circle_close_default;
        } else {
          return props.status === "success" ? check_default : close_default;
        }
      });
      const progressTextSize = vue.computed(() => {
        return props.type === "line" ? 12 + props.strokeWidth * 0.4 : props.width * 0.111111 + 2;
      });
      const content = vue.computed(() => props.format(props.percentage));
      function getColors(color) {
        const span = 100 / color.length;
        const seriesColors = color.map((seriesColor, index) => {
          if (isString(seriesColor)) {
            return {
              color: seriesColor,
              percentage: (index + 1) * span
            };
          }
          return seriesColor;
        });
        return seriesColors.sort((a, b) => a.percentage - b.percentage);
      }
      const getCurrentColor = (percentage) => {
        var _a2;
        const { color } = props;
        if (isFunction$1(color)) {
          return color(percentage);
        } else if (isString(color)) {
          return color;
        } else {
          const colors = getColors(color);
          for (const color2 of colors) {
            if (color2.percentage > percentage)
              return color2.color;
          }
          return (_a2 = colors[colors.length - 1]) == null ? void 0 : _a2.color;
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass([
            vue.unref(ns).b(),
            vue.unref(ns).m(_ctx.type),
            vue.unref(ns).is(_ctx.status),
            {
              [vue.unref(ns).m("without-text")]: !_ctx.showText,
              [vue.unref(ns).m("text-inside")]: _ctx.textInside
            }
          ]),
          role: "progressbar",
          "aria-valuenow": _ctx.percentage,
          "aria-valuemin": "0",
          "aria-valuemax": "100"
        }, [
          _ctx.type === "line" ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(vue.unref(ns).b("bar"))
          }, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(vue.unref(ns).be("bar", "outer")),
              style: vue.normalizeStyle({ height: `${_ctx.strokeWidth}px` })
            }, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass([
                  vue.unref(ns).be("bar", "inner"),
                  { [vue.unref(ns).bem("bar", "inner", "indeterminate")]: _ctx.indeterminate },
                  { [vue.unref(ns).bem("bar", "inner", "striped")]: _ctx.striped },
                  { [vue.unref(ns).bem("bar", "inner", "striped-flow")]: _ctx.stripedFlow }
                ]),
                style: vue.normalizeStyle(vue.unref(barStyle))
              }, [
                (_ctx.showText || _ctx.$slots.default) && _ctx.textInside ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: vue.normalizeClass(vue.unref(ns).be("bar", "innerText"))
                }, [
                  vue.renderSlot(_ctx.$slots, "default", { percentage: _ctx.percentage }, () => [
                    vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(content)), 1)
                  ])
                ], 2)) : vue.createCommentVNode("v-if", true)
              ], 6)
            ], 6)
          ], 2)) : (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: vue.normalizeClass(vue.unref(ns).b("circle")),
            style: vue.normalizeStyle({ height: `${_ctx.width}px`, width: `${_ctx.width}px` })
          }, [
            (vue.openBlock(), vue.createElementBlock("svg", _hoisted_2$1, [
              vue.createElementVNode("path", {
                class: vue.normalizeClass(vue.unref(ns).be("circle", "track")),
                d: vue.unref(trackPath),
                stroke: `var(${vue.unref(ns).cssVarName("fill-color-light")}, #e5e9f2)`,
                "stroke-linecap": _ctx.strokeLinecap,
                "stroke-width": vue.unref(relativeStrokeWidth),
                fill: "none",
                style: vue.normalizeStyle(vue.unref(trailPathStyle))
              }, null, 14, _hoisted_3$1),
              vue.createElementVNode("path", {
                class: vue.normalizeClass(vue.unref(ns).be("circle", "path")),
                d: vue.unref(trackPath),
                stroke: vue.unref(stroke),
                fill: "none",
                opacity: _ctx.percentage ? 1 : 0,
                "stroke-linecap": _ctx.strokeLinecap,
                "stroke-width": vue.unref(relativeStrokeWidth),
                style: vue.normalizeStyle(vue.unref(circlePathStyle))
              }, null, 14, _hoisted_4$1)
            ]))
          ], 6)),
          (_ctx.showText || _ctx.$slots.default) && !_ctx.textInside ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 2,
            class: vue.normalizeClass(vue.unref(ns).e("text")),
            style: vue.normalizeStyle({ fontSize: `${vue.unref(progressTextSize)}px` })
          }, [
            vue.renderSlot(_ctx.$slots, "default", { percentage: _ctx.percentage }, () => [
              !_ctx.status ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5$1, vue.toDisplayString(vue.unref(content)), 1)) : (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 1 }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(statusIcon))))
                ]),
                _: 1
              }))
            ])
          ], 6)) : vue.createCommentVNode("v-if", true)
        ], 10, _hoisted_1$2);
      };
    }
  });
  var Progress = /* @__PURE__ */ _export_sfc$1(_sfc_main$2, [["__file", "progress.vue"]]);
  const ElProgress = withInstall(Progress);
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-b425a440"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "modal_code" };
  const _hoisted_2 = { class: "header" };
  const _hoisted_3 = { class: "content" };
  const _hoisted_4 = { class: "produce" };
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "1、扫描右侧公众号，点击关注！", -1));
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "2、在情感棱镜后台回复：验证码", -1));
  const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "3、在下方输入框输入获取的验证码后回车", -1));
  const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "img" }, [
    /* @__PURE__ */ vue.createElementVNode("img", {
      src: "data:image/jpeg;base64,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",
      alt: ""
    })
  ], -1));
  const _sfc_main$1 = {
    __name: "Model",
    props: {
      title: {
        type: String,
        required: true
      },
      code: {
        type: Number || String
      }
    },
    setup(__props, { expose: __expose }) {
      const props = __props;
      const visible = vue.ref(false);
      const openModal = () => {
        visible.value = true;
      };
      const closeModal = () => {
        visible.value = false;
      };
      __expose({
        visible,
        openModal,
        closeModal
      });
      const codeValue = vue.ref();
      const enterCode = () => {
        if (codeValue.value == props.code) {
          localStorage.setItem("fcode", codeValue.value);
          visible.value = false;
          alert("验证成功，请再次点击解析！");
          codeValue.value = "";
        } else {
          alert("验证码错误，请重新输入！");
          codeValue.value = "";
        }
      };
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          class: "modal-wrapper",
          onClick: vue.withModifiers(closeModal, ["self"])
        }, [
          vue.createElementVNode("div", _hoisted_1$1, [
            vue.createElementVNode("div", _hoisted_2, [
              vue.createElementVNode("h2", null, vue.toDisplayString(__props.title), 1),
              vue.createElementVNode("button", { onClick: closeModal }, "X")
            ]),
            vue.createElementVNode("div", _hoisted_3, [
              vue.createElementVNode("div", _hoisted_4, [
                _hoisted_5,
                _hoisted_6,
                _hoisted_7,
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "ipt",
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => codeValue.value = $event),
                  onKeydown: vue.withKeys(enterCode, ["enter"]),
                  placeholder: "请输入验证码后按回车"
                }, null, 544), [
                  [vue.vModelText, codeValue.value]
                ])
              ]),
              _hoisted_8
            ])
          ])
        ], 512)), [
          [vue.vShow, visible.value]
        ]);
      };
    }
  };
  const Model = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b425a440"]]);
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const importScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.addEventListener("load", () => {
        var _a2;
        resolve();
        (_a2 = script.parentElement) == null ? void 0 : _a2.removeChild(script);
      });
      script.addEventListener("error", (e) => {
        var _a2;
        reject(e);
        (_a2 = script.parentElement) == null ? void 0 : _a2.removeChild(script);
      });
      document.body.appendChild(script);
    });
  };
  await( importScript(
    "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"
  ));
  const JSZip = _unsafeWindow == null ? void 0 : _unsafeWindow.JSZip;
  const headers$1 = {
    // Referer: 'http://www.b5200.net/',
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Accept-Encoding": "gzip, deflate",
    // 指定服务器返回的编码格式
    "Accept-Charset": "GBK,utf-8;q=0.7,*;q=0.3"
  };
  const getDuShuGe = (url) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: headers$1,
        encoding: "gb2312",
        // responseType:'arraybuffer',
        onload: function(res) {
          if (res.status == 200) {
            if (res.response !== void 0) {
              resolve(res.response);
            } else {
              resolve("无法解析");
            }
          } else {
            resolve("无法解析");
          }
        },
        onerror: function(error) {
          reject("解析失败", error);
        }
      });
    });
  };
  const getDuShuGeList = async () => {
    let chapterList = document.querySelectorAll(".listmain > dl>dd");
    let Idlist = [];
    const regId = /href="([^"]*)"/;
    const regContent = /<a.*?>(.*?)<\/a>/;
    for (var i = 0; i < chapterList.length; i++) {
      let aTag = chapterList[i].innerHTML;
      let url = "http://www.dushuge.com/" + aTag.match(regId)[1];
      let chapter = aTag.match(regContent)[1];
      Idlist.push({ url, chapter });
    }
    return Idlist;
  };
  const getDuShuGeContent = async (url) => {
    let contentdata = await getDuShuGe(url);
    contentdata = contentdata.split('<div id="content" class="showtxt">')[1].split("<br /><br /></div>")[0];
    contentdata = contentdata.replace(/&nbsp;/gi, "");
    contentdata = contentdata.replace(/<br \/>/g, "\n");
    return contentdata;
  };
  const getBiQuGeList = async () => {
    let chapterList = document.querySelectorAll("#list > dl> dd");
    let Idlist = [];
    const regId = /href="([^"]*)"/;
    const regContent = /<a.*?>(.*?)<\/a>/;
    for (var i = 9; i < chapterList.length; i++) {
      let aTag = chapterList[i].innerHTML;
      let url = "http://www.b5200.net/" + aTag.match(regId)[1];
      let chapter = aTag.match(regContent)[1];
      Idlist.push({ url, chapter });
    }
    return Idlist;
  };
  const getBiQuGeContent = async (url) => {
    let contentdata = await getDuShuGe(url);
    contentdata = contentdata.replace(/<div id='gc1' class='gcontent1'>(.*?)<\/div>/, "");
    if (contentdata.includes('<div id="content" class="c1"><p>')) {
      contentdata = contentdata.split('<div id="content" class="c1"><p>')[1];
    }
    if (contentdata.includes("</p></div>")) {
      contentdata = contentdata.split("</p></div>")[0];
    }
    contentdata = contentdata.replace(/<\/p><p>/g, "\n");
    contentdata = contentdata.replace("<p>", "");
    contentdata = contentdata.replace("</p></div>", "");
    return contentdata;
  };
  const getBxfanqizhaList = async () => {
    let chapterList = document.querySelectorAll("#newlist > dd");
    let Idlist = [];
    const regId = /href="([^"]*)"/;
    const regContent = /<a.*?>(.*?)<\/a>/;
    for (var i = 0; i < chapterList.length; i++) {
      let aTag = chapterList[i].innerHTML;
      let url = "https://www.bxfanqizha.com" + aTag.match(regId)[1];
      let chapter = aTag.match(regContent)[1];
      Idlist.push({ url, chapter });
    }
    return Idlist;
  };
  const getBxfanqizhaContent = async (url) => {
    let contentdata = await getDuShuGe(url);
    contentdata = contentdata.trim();
    const regex = /<div class="panel-body" id="rtext">([\s\S]*)<\/div>/;
    contentdata = contentdata.match(regex)[1];
    contentdata = contentdata.split("</div>")[0].replace('<div id="booktxt">', "").replace("&lt;b&gt;&lt;/b&gt;", "").replace(/<\/p><p>/g, "\n").replace(/<\/p>/g, "\n").split("<p>")[3];
    return contentdata;
  };
  const getQiMaoIdList = () => {
    let chapterList = document.querySelectorAll(".qm-book-catalog-list-content>li");
    let Idlist = [];
    for (var i = 0; i < chapterList.length; i++) {
      let iDList = chapterList[i].children[0].href.split("/")[4];
      let id = iDList.split("-")[0];
      let chapterId = iDList.split("-")[1];
      let chapter = chapterList[i].innerText;
      Idlist.push({ id, chapterId, chapter });
    }
    return Idlist;
  };
  const headers = {
    "app-version": "51110",
    platform: "android",
    reg: "0",
    AUTHORIZATION: "",
    "application-id": "com.****.reader",
    "net-env": "1",
    channel: "unknown",
    "qm-params": "",
    sign: "fc697243ab534ebaf51d2fa80f251cb4"
  };
  const sign_key = "d3dGiJc651gSQ8w1";
  function decode(response) {
    let txt = CryptoJS.enc.Base64.parse(response).toString();
    let iv = txt.slice(0, 32);
    let _content = decrypt(txt.slice(32), iv).trim();
    return _content;
  }
  const decrypt = function(data, iv) {
    let key = CryptoJS.enc.Hex.parse("32343263636238323330643730396531");
    iv = CryptoJS.enc.Hex.parse(iv);
    let HexStr = CryptoJS.enc.Hex.parse(data);
    let Base64Str = CryptoJS.enc.Base64.stringify(HexStr);
    let decrypted = CryptoJS.AES.decrypt(Base64Str, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  };
  const getQiMaoContent = (id, chapterId) => {
    return new Promise(function(resolve, reject) {
      const params = {
        id,
        chapterId
      };
      const sign = CryptoJS.MD5(
        Object.keys(params).sort().reduce((pre, n) => pre + n + "=" + params[n], "") + sign_key
      ).toString();
      let url = `https://api-ks.wtzw.com/api/v1/chapter/content?id=${id}&chapterId=${chapterId}&sign=${sign}`;
      _GM_xmlhttpRequest({
        method: "GET",
        // url: `https://novel.snssdk.com/api/novel/book/reader/full/v1/?device_platform=android&parent_enterfrom=novel_channel_search.tab.&aid=2329&platform_id=1&group_id=0&item_id=${ID}`,
        url,
        headers,
        onload: function(res) {
          if (res.response !== void 0) {
            let result = JSON.parse(res.response).data.content;
            let content = decode(result);
            resolve(content);
          } else {
            resolve("无法解析");
          }
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  };
  const getChatgptzwIdList = () => {
    let chapterList = document.querySelectorAll(".section-list")[1].querySelectorAll("li");
    let Idlist = [];
    const regId = /href="([^"]*)"/;
    for (var i = 0; i < chapterList.length; i++) {
      let aTag = chapterList[i].innerHTML;
      let url = "https://www.chatgptzw.com" + aTag.match(regId)[1];
      let chapter = chapterList[i].innerText;
      Idlist.push({ url, chapter });
    }
    return Idlist;
  };
  const getChatgptzwContent = async (url) => {
    let contentdata = await getDuShuGe(url);
    contentdata = contentdata.split('<div class="content" id="content">')[1].trim().split("</div>")[0].trim();
    contentdata = contentdata.replace(/<\/p><p>/gi, "\n");
    contentdata = contentdata.replace(/<p>/g, "");
    contentdata = contentdata.replace(/<\/p>/g, "");
    return contentdata;
  };
  const getAnshugeIdList = () => {
    let chapterList = document.querySelectorAll(".L");
    let Idlist = [];
    const regId = /href="([^"]*)"/;
    for (var i = 0; i < chapterList.length; i++) {
      let aTag = chapterList[i].innerHTML;
      let url = aTag.match(regId)[1];
      let chapter = chapterList[i].innerText;
      Idlist.push({ url, chapter });
    }
    return Idlist;
  };
  const getAnshugeContent = async (url) => {
    let contentdata = await getDuShuGe(url);
    const regex = /<div id="center_tip">([\s\S]*)<\/div>/;
    contentdata = contentdata.match(regex)[1];
    contentdata = contentdata.split('id="contents">')[1].split("</dd>")[0].trim();
    contentdata = contentdata.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/gi, "");
    contentdata = contentdata.replace(/<br \/>/g, "");
    return contentdata;
  };
  const getBiquxsIdList = () => {
    let chapterList = document.querySelectorAll(".listmain>dl>dd");
    let Idlist = [];
    const regId = /href="([^"]*)"/;
    for (var i = 5; i < chapterList.length; i++) {
      let aTag = chapterList[i].innerHTML;
      let url = "http://www.biquxs.com" + aTag.match(regId)[1];
      let chapter = chapterList[i].innerText;
      Idlist.push({ url, chapter });
    }
    return Idlist;
  };
  const getBiquxsContent = async (url) => {
    let contentdata = await getDuShuGe(url);
    const regex = /<div id="content".*?class="showtxt">([\s\S]*)<\/div>/;
    contentdata = contentdata.match(regex)[1].trim();
    contentdata = contentdata.replace(
      /&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p class="content_detail">/gi,
      ""
    );
    contentdata = contentdata.split("</div>")[0];
    contentdata = contentdata.replace(/\n/g, "");
    contentdata = contentdata.replace(/<br\/>/g, "");
    contentdata = contentdata.replace(/\s+/g, "");
    contentdata = contentdata.replace(/<\/p>/g, "\n");
    return contentdata;
  };
  const get69ShubaIdList = () => {
    let chapterList = document.querySelectorAll("#catalog>ul>li");
    let Idlist = [];
    const regId = /href="([^"]*)"/;
    for (var i = 0; i < chapterList.length; i++) {
      let aTag = chapterList[i].innerHTML;
      let url = aTag.match(regId)[1];
      let chapter = chapterList[i].innerText;
      Idlist.push({ url, chapter });
    }
    return Idlist;
  };
  const getRequest = (url) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        encoding: "gb2312",
        responseType: "arraybuffer",
        onload: function(res) {
          if (res.status == 200) {
            if (res.response !== void 0) {
              resolve(res.response);
            } else {
              resolve("无法解析");
            }
          } else {
            resolve("无法解析");
          }
        },
        onerror: function(error) {
          reject("解析失败", error);
        }
      });
    });
  };
  function decodeGBK(uint8Array) {
    if ("TextDecoder" in window) {
      const decoder = new TextDecoder("GBK");
      return decoder.decode(uint8Array);
    } else {
      console.error("Your environment does not support TextDecoder.");
      return "";
    }
  }
  const get69ShubaContent = async (url) => {
    let contentdata = await getRequest(url);
    contentdata = decodeGBK(new Uint8Array(contentdata));
    const regex = /<div id="txtright">([\s\S]*)<\/div>/;
    contentdata = contentdata.match(regex)[1].trim();
    contentdata = contentdata.split("</div>")[1].trim().split("<div")[0].trim();
    contentdata = contentdata.replace(/&emsp;&emsp;/gi, "");
    contentdata = contentdata.replace(/\s+/g, "");
    contentdata = contentdata.replace(/<br\/><br\/>/g, "\n");
    return contentdata;
  };
  const getRsiluIdList = () => {
    let chapterList = document.querySelectorAll(".section-list")[1].children;
    let Idlist = [];
    const regId = /href="([^"]*)"/;
    for (var i = 0; i < chapterList.length; i++) {
      let aTag = chapterList[i].innerHTML;
      let url = "https://www.rsltxt.me" + aTag.match(regId)[1];
      let chapter = chapterList[i].innerText;
      Idlist.push({ url, chapter });
    }
    return Idlist;
  };
  const getRsiluContent = async (url) => {
    let contentdata = await getDuShuGe(url);
    const regex = /<div class="content".*?id="content">([\s\S]*)<\/div>/;
    contentdata = contentdata.match(regex)[1].trim();
    contentdata = contentdata.split("</div>")[1].trim();
    contentdata = contentdata.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/gi, "");
    contentdata = contentdata.replace(/<br\/><br\/>/g, "\n");
    contentdata = contentdata.replace(/<br\/>/g, "");
    return contentdata;
  };
  const getCode = () => {
    return new Promise(function(resolve, reject) {
      _GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.softrr.cn/crawler/getCode?id=2`,
        headers: {
          Referer: "https://www.softrr.cn/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36"
        },
        onload: function(res) {
          resolve(JSON.parse(res.response).data[0].code);
        },
        onerror: function(error) {
          console.log(error);
        }
      });
    });
  };
  const downComFileTxt = async (IDList, chapterTitle, ms, key) => {
    let href = window.location.href;
    if (key == "onDown") {
      const zip = new JSZip();
      const cache = {};
      const promises = [];
      let i = 0;
      let n = IDList.length;
      let timer;
      async function tick() {
        (function(i2) {
          if (href.includes("dushuge")) {
            if (i2 < n) {
              let promise = getDuShuGeContent(IDList[i2].url).then((data) => {
                let blob = new Blob([data], { type: "text/plain" });
                zip.file(IDList[i2].chapter + ".txt", blob, { binary: true });
                cache[IDList[i2].chapter] = data;
              });
              promises.push(promise);
            }
          }
          if (href.includes("b5200")) {
            if (i2 < n) {
              let promise = getBiQuGeContent(IDList[i2].url).then((data) => {
                let blob = new Blob([data], { type: "text/plain" });
                zip.file(IDList[i2].chapter + ".txt", blob, { binary: true });
                cache[IDList[i2].chapter] = data;
              });
              promises.push(promise);
            }
          }
          if (href.includes("bxfanqizha")) {
            if (i2 < n) {
              let promise = getBxfanqizhaContent(IDList[i2].url).then((data) => {
                let blob = new Blob([data], { type: "text/plain" });
                zip.file(IDList[i2].chapter + ".txt", blob, { binary: true });
                cache[IDList[i2].chapter] = data;
              });
              promises.push(promise);
            }
          }
          if (href.includes("qimao")) {
            if (i2 < n) {
              let promise = getQiMaoContent(IDList[i2].id, IDList[i2].chapterId).then((data) => {
                let blob = new Blob([data], { type: "text/plain" });
                zip.file(IDList[i2].chapter + ".txt", blob, { binary: true });
                cache[IDList[i2].chapter] = data;
              });
              promises.push(promise);
            }
          }
          if (href.includes("chatgptzw")) {
            if (i2 < n) {
              let promise = getChatgptzwContent(IDList[i2].url).then((data) => {
                let blob = new Blob([data], { type: "text/plain" });
                zip.file(IDList[i2].chapter + ".txt", blob, { binary: true });
                cache[IDList[i2].chapter] = data;
              });
              promises.push(promise);
            }
          }
          if (href.includes("anshuge")) {
            if (i2 < n) {
              let promise = getAnshugeContent(IDList[i2].url).then((data) => {
                let blob = new Blob([data], { type: "text/plain" });
                zip.file(IDList[i2].chapter + ".txt", blob, { binary: true });
                cache[IDList[i2].chapter] = data;
              });
              promises.push(promise);
            }
          }
          if (href.includes("biquxs")) {
            if (i2 < n) {
              let promise = getBiquxsContent(IDList[i2].url).then((data) => {
                let blob = new Blob([data], { type: "text/plain" });
                zip.file(IDList[i2].chapter + ".txt", blob, { binary: true });
                cache[IDList[i2].chapter] = data;
              });
              promises.push(promise);
            }
          }
          if (href.includes("69shuba")) {
            if (i2 < n) {
              let promise = get69ShubaContent(IDList[i2].url).then((data) => {
                let blob = new Blob([data], { type: "text/plain" });
                zip.file(IDList[i2].chapter + ".txt", blob, { binary: true });
                cache[IDList[i2].chapter] = data;
              });
              promises.push(promise);
            }
          }
          if (href.includes("rsltxt")) {
            if (i2 < n) {
              let promise = getRsiluContent(IDList[i2].url).then((data) => {
                let blob = new Blob([data], { type: "text/plain" });
                zip.file(IDList[i2].chapter + ".txt", blob, { binary: true });
                cache[IDList[i2].chapter] = data;
              });
              promises.push(promise);
            }
          }
        })(i);
        i++;
        if (i == n) {
          Promise.all(promises).then(() => {
            zip.generateAsync({ type: "blob" }).then((content) => {
              downLoad(content, chapterTitle, "zip");
            });
          }).catch((err) => {
            elementPlus.ElMessage.error("网站存在网络问题，请稍后重试！");
          });
          clearTimeout(timer);
        }
        timer = setTimeout(tick, ms);
      }
      tick();
    } else {
      let i = 0;
      let n = IDList.length;
      let txtContent = "";
      let timer;
      let txtData = "";
      async function tick() {
        if (href.includes("dushuge")) {
          txtData = await getDuShuGeContent(IDList[i].url);
        }
        if (href.includes("b5200")) {
          txtData = await getBiQuGeContent(IDList[i].url);
        }
        if (href.includes("bxfanqizha")) {
          txtData = await getBxfanqizhaContent(IDList[i].url);
        }
        if (href.includes("qimao")) {
          txtData = await getQiMaoContent(IDList[i].id, IDList[i].chapterId);
        }
        if (href.includes("chatgptzw")) {
          txtData = await getChatgptzwContent(IDList[i].url);
        }
        if (href.includes("anshuge")) {
          txtData = await getAnshugeContent(IDList[i].url);
        }
        if (href.includes("biquxs")) {
          txtData = await getBiquxsContent(IDList[i].url);
        }
        if (href.includes("69shuba")) {
          txtData = await get69ShubaContent(IDList[i].url);
        }
        if (href.includes("rsltxt")) {
          txtData = await getRsiluContent(IDList[i].url);
        }
        txtData = IDList[i].chapter + "\n\n" + txtData + "\n\n";
        txtContent += txtData;
        i++;
        if (i == n) {
          let blob = new Blob([txtContent], { type: "text/plain" });
          downLoad(blob, chapterTitle, "txt");
          clearTimeout(timer);
        }
        timer = setTimeout(tick, ms);
      }
      tick();
    }
  };
  const downLoad = (blob, name, type) => {
    if (!blob || !type)
      return;
    const url = window.URL || window.webkitURL || window.moxURL;
    const downloadHref = url.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadHref;
    link.download = `${name || "导出文件"}.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    url.revokeObjectURL(downloadHref);
  };
  const getIdList = () => {
    let chapterList = document.querySelectorAll(".chapter-item");
    let Idlist = [];
    const regId = /\/reader\/(\d+)/;
    const regContent = /<a.*?>(.*?)<\/a>/;
    for (var i = 0; i < chapterList.length; i++) {
      let aTag = chapterList[i].innerHTML;
      let ID = aTag.match(regId)[1];
      let chapter = aTag.match(regContent)[1];
      Idlist.push({ ID, chapter });
    }
    return Idlist;
  };
  const cookie = "novel_web_id=7357767624615331362;";
  const getContent = (ID) => {
    return new Promise(function(resolve, reject) {
      _GM_xmlhttpRequest({
        method: "GET",
        // url: `https://novel.snssdk.com/api/novel/book/reader/full/v1/?device_platform=android&parent_enterfrom=novel_channel_search.tab.&aid=2329&platform_id=1&group_id=0&item_id=${ID}`,
        // url: `http://fq.travacocro.com/content?item_id=${ID}`,
        url: `https://fanqie.utuyyt.site/content/${ID}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*"
        },
        cookie,
        anonymous: true,
        onload: function(res) {
          if (res.response !== void 0) {
            resolve(JSON.parse(res.responseText).data.data.content);
          } else {
            resolve("无法解析");
          }
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  };
  const CODE_ST = 58344;
  const CODE_ED = 58715;
  const charset = [
    "D",
    "在",
    "主",
    "特",
    "家",
    "军",
    "然",
    "表",
    "场",
    "4",
    "要",
    "只",
    "v",
    "和",
    "?",
    "6",
    "别",
    "还",
    "g",
    "现",
    "儿",
    "岁",
    "?",
    "?",
    "此",
    "象",
    "月",
    "3",
    "出",
    "战",
    "工",
    "相",
    "o",
    "男",
    "直",
    "失",
    "世",
    "F",
    "都",
    "平",
    "文",
    "什",
    "V",
    "O",
    "将",
    "真",
    "T",
    "那",
    "当",
    "?",
    "会",
    "立",
    "些",
    "u",
    "是",
    "十",
    "张",
    "学",
    "气",
    "大",
    "爱",
    "两",
    "命",
    "全",
    "后",
    "东",
    "性",
    "通",
    "被",
    "1",
    "它",
    "乐",
    "接",
    "而",
    "感",
    "车",
    "山",
    "公",
    "了",
    "常",
    "以",
    "何",
    "可",
    "话",
    "先",
    "p",
    "i",
    "叫",
    "轻",
    "M",
    "士",
    "w",
    "着",
    "变",
    "尔",
    "快",
    "l",
    "个",
    "说",
    "少",
    "色",
    "里",
    "安",
    "花",
    "远",
    "7",
    "难",
    "师",
    "放",
    "t",
    "报",
    "认",
    "面",
    "道",
    "S",
    "?",
    "克",
    "地",
    "度",
    "I",
    "好",
    "机",
    "U",
    "民",
    "写",
    "把",
    "万",
    "同",
    "水",
    "新",
    "没",
    "书",
    "电",
    "吃",
    "像",
    "斯",
    "5",
    "为",
    "y",
    "白",
    "几",
    "日",
    "教",
    "看",
    "但",
    "第",
    "加",
    "候",
    "作",
    "上",
    "拉",
    "住",
    "有",
    "法",
    "r",
    "事",
    "应",
    "位",
    "利",
    "你",
    "声",
    "身",
    "国",
    "问",
    "马",
    "女",
    "他",
    "Y",
    "比",
    "父",
    "x",
    "A",
    "H",
    "N",
    "s",
    "X",
    "边",
    "美",
    "对",
    "所",
    "金",
    "活",
    "回",
    "意",
    "到",
    "z",
    "从",
    "j",
    "知",
    "又",
    "内",
    "因",
    "点",
    "Q",
    "三",
    "定",
    "8",
    "R",
    "b",
    "正",
    "或",
    "夫",
    "向",
    "德",
    "听",
    "更",
    "?",
    "得",
    "告",
    "并",
    "本",
    "q",
    "过",
    "记",
    "L",
    "让",
    "打",
    "f",
    "人",
    "就",
    "者",
    "去",
    "原",
    "满",
    "体",
    "做",
    "经",
    "K",
    "走",
    "如",
    "孩",
    "c",
    "G",
    "给",
    "使",
    "物",
    "?",
    "最",
    "笑",
    "部",
    "?",
    "员",
    "等",
    "受",
    "k",
    "行",
    "一",
    "条",
    "果",
    "动",
    "光",
    "门",
    "头",
    "见",
    "往",
    "自",
    "解",
    "成",
    "处",
    "天",
    "能",
    "于",
    "名",
    "其",
    "发",
    "总",
    "母",
    "的",
    "死",
    "手",
    "入",
    "路",
    "进",
    "心",
    "来",
    "h",
    "时",
    "力",
    "多",
    "开",
    "已",
    "许",
    "d",
    "至",
    "由",
    "很",
    "界",
    "n",
    "小",
    "与",
    "Z",
    "想",
    "代",
    "么",
    "分",
    "生",
    "口",
    "再",
    "妈",
    "望",
    "次",
    "西",
    "风",
    "种",
    "带",
    "J",
    "?",
    "实",
    "情",
    "才",
    "这",
    "?",
    "E",
    "我",
    "神",
    "格",
    "长",
    "觉",
    "间",
    "年",
    "眼",
    "无",
    "不",
    "亲",
    "关",
    "结",
    "0",
    "友",
    "信",
    "下",
    "却",
    "重",
    "己",
    "老",
    "2",
    "音",
    "字",
    "m",
    "呢",
    "明",
    "之",
    "前",
    "高",
    "P",
    "B",
    "目",
    "太",
    "e",
    "9",
    "起",
    "稜",
    "她",
    "也",
    "W",
    "用",
    "方",
    "子",
    "英",
    "每",
    "理",
    "便",
    "四",
    "数",
    "期",
    "中",
    "C",
    "外",
    "样",
    "a",
    "海",
    "们",
    "任"
  ];
  function interpreter(cc) {
    let bias = cc - CODE_ST;
    if (bias < 0 || bias >= charset.length || charset[bias] === "?") {
      return String.fromCharCode(cc);
    }
    return charset[bias];
  }
  function r_content(content) {
    let newText = "";
    try {
      for (var text of content) {
        let len = text.length;
        for (var ind = 0; ind < len; ind++) {
          let cc = text.charCodeAt(ind);
          var ch = text.charAt(ind);
          if (cc >= CODE_ST && cc <= CODE_ED) {
            ch = interpreter(cc);
          }
          newText += ch;
        }
      }
    } catch (err) {
      console.log(err);
    }
    return newText;
  }
  const downFanQieFileTxt = async (IDList, chapterTitle, ms, key) => {
    if (key == "onDown") {
      let tick = function() {
        let promise = getContent(IDList[i].ID).then((data) => {
          data = r_content(data);
          data = data.replace(/<\/p><p>/g, "\n").replace("<p>", "").replace("</p>", "");
          let blob = new Blob([data], { type: "text/plain" });
          zip.file(`第${i}章.txt`, blob, { binary: true });
        });
        promises.push(promise);
        i++;
        if (i == IDList.length) {
          Promise.all(promises).then(() => {
            console.log(1);
            zip.generateAsync({ type: "blob" }).then((content) => {
              downLoad(content, chapterTitle, "zip");
            });
          }).catch((err) => {
            console.log(err);
          });
          clearTimeout(timer);
        }
        const timer = setTimeout(tick, ms);
      };
      const zip = new JSZip();
      const promises = [];
      let i = 0;
      tick();
    } else {
      let i = 0;
      let n = IDList.length;
      let txtContent = "";
      let timer;
      async function tick1() {
        let txtData = await getContent(IDList[i].ID);
        txtData = r_content(txtData);
        txtData = txtData.replace(/<\/p><p>/g, "\n").replace("<p>", "").replace("</p>", "");
        txtData = IDList[i].chapter + "\n\n" + txtData + "\n\n";
        txtContent += txtData;
        i++;
        if (i == n) {
          let blob = new Blob([txtContent], { type: "text/plain" });
          downLoad(blob, chapterTitle, "txt");
          clearTimeout(timer);
        }
        timer = setTimeout(tick1, ms);
      }
      tick1();
    }
  };
  const _hoisted_1 = { class: "downLoad_container" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const flag = vue.ref(false);
      const percentage2 = vue.ref();
      const ms = vue.ref();
      const code = vue.ref();
      const model = vue.ref("");
      const titleList = vue.ref([]);
      const chapterTitle = vue.ref("");
      const containShow = vue.ref(true);
      const colors = [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 }
      ];
      let url = window.location.href;
      if (url.includes("html")) {
        containShow.value = false;
      }
      if (url.includes("dushuge")) {
        containShow.value = true;
        if (url.includes(".html")) {
          containShow.value = false;
        }
      }
      if (url.includes("chatgptzw") && url.includes("index")) {
        containShow.value = true;
      }
      if (url.includes("rsltxt")) {
        let list = document.querySelector(".section-list").children;
        if (list.length > 1) {
          containShow.value = true;
        }
      }
      if (url.includes("anshuge.com/files/article")) {
        containShow.value = true;
        document.querySelector("#apprecom2").style.display = "none";
      }
      if (url.includes("qimao") && url.includes("-")) {
        containShow.value = false;
      }
      if (url.includes("anshuge") && !url.includes("index")) {
        containShow.value = false;
      }
      const onDown = () => {
        downTxtFile("onDown");
      };
      const onTxtDown = async () => {
        downTxtFile("downTxtFile");
      };
      const downTxtFile = async (key) => {
        if (!ms.value)
          return elementPlus.ElMessage.error("请选择请求间隔时间！");
        code.value = await getCode();
        let locaCode = localStorage.getItem("fcode") || "";
        if (locaCode == code.value) {
          flag.value = true;
          if (url.includes("fanqienovel")) {
            titleList.value = getIdList();
            let i = 0;
            const timer2 = setInterval(() => {
              i++;
              percentage2.value = Math.round(i * 100 / titleList.value.length);
              if (i == titleList.value.length) {
                flag.value = false;
                elementPlus.ElMessageBox({
                  title: "警告",
                  message: vue.h("p", null, [
                    vue.h("span", null, "请耐心等待系统处理，可能需要几秒到几分钟不等！"),
                    vue.h("i", { style: "color: teal" }, "")
                  ])
                });
                clearInterval(timer2);
              }
            }, ms.value);
            chapterTitle.value = document.querySelector(".info-name").innerText;
            downFanQieFileTxt(titleList.value, chapterTitle.value, ms.value, key);
          }
          if (url.includes("dushuge")) {
            titleList.value = await getDuShuGeList();
            let i = 0;
            const timer2 = setInterval(() => {
              i++;
              percentage2.value = Math.round(i * 100 / titleList.value.length);
              if (i == titleList.value.length) {
                flag.value = false;
                clearInterval(timer2);
              }
            }, ms.value);
            chapterTitle.value = document.querySelector("#info > h1").innerText;
            dowloadFile(titleList.value, chapterTitle.value, key);
          }
          if (url.includes("b5200")) {
            titleList.value = await getBiQuGeList();
            let i = 0;
            const timer2 = setInterval(() => {
              i++;
              percentage2.value = Math.round(i * 100 / titleList.value.length);
              if (i == titleList.value.length) {
                flag.value = false;
                clearInterval(timer2);
              }
            }, ms.value);
            chapterTitle.value = document.querySelector("#info > h1").innerText;
            dowloadFile(titleList.value, chapterTitle.value, key);
          }
          if (url.includes("bxfanqizha")) {
            titleList.value = await getBxfanqizhaList();
            let i = 0;
            const timer2 = setInterval(() => {
              i++;
              percentage2.value = Math.round(i * 100 / titleList.value.length);
              if (i == titleList.value.length) {
                flag.value = false;
                clearInterval(timer2);
              }
            }, ms.value);
            chapterTitle.value = document.querySelector(".pl0 > h1").innerText;
            dowloadFile(titleList.value, chapterTitle.value, key);
          }
          if (url.includes("qimao")) {
            titleList.value = getQiMaoIdList();
            let i = 0;
            const timer2 = setInterval(() => {
              i++;
              percentage2.value = Math.round(i * 100 / titleList.value.length);
              if (i == titleList.value.length) {
                flag.value = false;
                clearInterval(timer2);
              }
            }, ms.value);
            chapterTitle.value = document.querySelector(".title  > .txt").innerText;
            dowloadFile(titleList.value, chapterTitle.value, key);
          }
          if (url.includes("chatgptzw")) {
            titleList.value = getChatgptzwIdList();
            let i = 0;
            const timer2 = setInterval(() => {
              i++;
              percentage2.value = Math.round(i * 100 / titleList.value.length);
              if (i == titleList.value.length) {
                flag.value = false;
                clearInterval(timer2);
              }
            }, ms.value);
            chapterTitle.value = document.querySelector(".top  > h1").innerText;
            dowloadFile(titleList.value, chapterTitle.value, key);
          }
          if (url.includes("anshuge")) {
            titleList.value = getAnshugeIdList();
            let i = 0;
            const timer2 = setInterval(() => {
              i++;
              percentage2.value = Math.round(i * 100 / titleList.value.length);
              if (i == titleList.value.length) {
                flag.value = false;
                clearInterval(timer2);
              }
            }, ms.value);
            chapterTitle.value = document.querySelectorAll(".bdsub > dl > dt > a")[2].innerText;
            dowloadFile(titleList.value, chapterTitle.value, key);
          }
          if (url.includes("biquxs")) {
            titleList.value = getBiquxsIdList();
            let i = 0;
            const timer2 = setInterval(() => {
              i++;
              percentage2.value = Math.round(i * 100 / titleList.value.length);
              if (i == titleList.value.length) {
                flag.value = false;
                clearInterval(timer2);
              }
            }, ms.value);
            chapterTitle.value = document.querySelector("#info>h1").innerText;
            dowloadFile(titleList.value, chapterTitle.value, key);
          }
          if (url.includes("69shuba")) {
            titleList.value = get69ShubaIdList();
            let i = 0;
            const timer2 = setInterval(() => {
              i++;
              percentage2.value = Math.round(i * 100 / titleList.value.length);
              if (i == titleList.value.length) {
                flag.value = false;
                clearInterval(timer2);
              }
            }, ms.value);
            chapterTitle.value = document.querySelector("#catalog>h1").innerText.split("目")[0];
            dowloadFile(titleList.value, chapterTitle.value, key);
          }
          if (url.includes("rsltxt")) {
            titleList.value = getRsiluIdList();
            console.log(titleList.value);
            let i = 0;
            const timer2 = setInterval(() => {
              i++;
              percentage2.value = Math.round(i * 100 / titleList.value.length);
              if (i == titleList.value.length) {
                flag.value = false;
                clearInterval(timer2);
              }
            }, ms.value);
            chapterTitle.value = document.querySelector(".info>.top>h1").innerText;
            dowloadFile(titleList.value, chapterTitle.value, key);
          }
        } else {
          model.value.openModal();
        }
      };
      const dowloadFile = (list, title2, key) => {
        let i = 0;
        const timer2 = setInterval(() => {
          i++;
          percentage2.value = Math.round(i * 100 / list.length);
          if (i == list.length) {
            flag.value = false;
            elementPlus.ElMessageBox({
              title: "警告",
              message: vue.h("p", null, [
                vue.h(
                  "span",
                  null,
                  "请耐心等待系统处理，可能需要几秒到几分钟不等！如果没有跳出下载界面，请调大时间间隔！"
                ),
                vue.h("i", { style: "color: teal" }, "")
              ])
            });
            clearInterval(timer2);
          }
        }, ms.value);
        downComFileTxt(list, title2, ms.value, key);
      };
      const options = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1e3, 1200, 1400, 1600, 1800, 2e3];
      const title = vue.ref("为了减少端口压力，防止滥用，采取必要的验证手段。");
      return (_ctx, _cache) => {
        const _component_el_option = ElOption;
        const _component_el_select = ElSelect;
        const _component_el_progress = ElProgress;
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createVNode(_component_el_select, {
            modelValue: ms.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => ms.value = $event),
            placeholder: "请求间隔",
            style: { "width": "120px" }
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(options, (item) => {
                return vue.createVNode(_component_el_option, {
                  key: item,
                  label: item,
                  value: item
                }, null, 8, ["label", "value"]);
              }), 64))
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createElementVNode("button", {
            onClick: onDown,
            class: "down"
          }, "ZIP下载"),
          vue.createElementVNode("button", {
            onClick: onTxtDown,
            class: "down"
          }, "TXT下载"),
          vue.withDirectives(vue.createVNode(_component_el_progress, {
            type: "dashboard",
            percentage: percentage2.value,
            color: colors
          }, null, 8, ["percentage"]), [
            [vue.vShow, flag.value]
          ]),
          vue.createVNode(Model, {
            title: title.value,
            code: code.value,
            ref_key: "model",
            ref: model
          }, null, 8, ["title", "code"])
        ], 512)), [
          [vue.vShow, containShow.value]
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2ccb0a6f"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  const app = vue.createApp(App);
  app.mount(
    (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  );

})(Vue, ElementPlus, CryptoJS);