// ==UserScript==
// @name         🔥🔥网易，酷我，酷狗支持歌词和歌曲下载（包含大部分VIP歌曲）🔥🔥
// @namespace    https://www.softrr.cn/
// @version      1.4.2
// @author       hackhase
// @description  网易，酷我，酷狗支持当前页歌词下载，同时支持歌曲mp3下载（包含大部分VIP歌曲）。
// @license      MIT
// @icon         http://s1.music.126.net/style/favicon.ico?v20180823
// @match        *://music.163.com/*
// @match        *://*.kuwo.cn/play_detail/*
// @match        *://*.kugou.com/mixsong/*
// @match        *://*.kugou.com/song/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.11/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.5.5/dist/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.5.5/dist/index.css
// @connect      www.softrr.cn
// @connect      music.163.com
// @connect      music.163.com
// @connect      m.kuwo.cn
// @connect      wwwapi.kugou.com
// @connect      www.xmwav.com
// @connect      localhost
// @connect      api.softrr.cn
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/487488/%F0%9F%94%A5%F0%9F%94%A5%E7%BD%91%E6%98%93%EF%BC%8C%E9%85%B7%E6%88%91%EF%BC%8C%E9%85%B7%E7%8B%97%E6%94%AF%E6%8C%81%E6%AD%8C%E8%AF%8D%E5%92%8C%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD%EF%BC%88%E5%8C%85%E5%90%AB%E5%A4%A7%E9%83%A8%E5%88%86VIP%E6%AD%8C%E6%9B%B2%EF%BC%89%F0%9F%94%A5%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/487488/%F0%9F%94%A5%F0%9F%94%A5%E7%BD%91%E6%98%93%EF%BC%8C%E9%85%B7%E6%88%91%EF%BC%8C%E9%85%B7%E7%8B%97%E6%94%AF%E6%8C%81%E6%AD%8C%E8%AF%8D%E5%92%8C%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD%EF%BC%88%E5%8C%85%E5%90%AB%E5%A4%A7%E9%83%A8%E5%88%86VIP%E6%AD%8C%E6%9B%B2%EF%BC%89%F0%9F%94%A5%F0%9F%94%A5.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(' @charset "UTF-8";:root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}:root{--el-color-white:#ffffff;--el-color-black:#000000;--el-color-primary-rgb:64,158,255;--el-color-success-rgb:103,194,58;--el-color-warning-rgb:230,162,60;--el-color-danger-rgb:245,108,108;--el-color-error-rgb:245,108,108;--el-color-info-rgb:144,147,153;--el-font-size-extra-large:20px;--el-font-size-large:18px;--el-font-size-medium:16px;--el-font-size-base:14px;--el-font-size-small:13px;--el-font-size-extra-small:12px;--el-font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\u5FAE\u8F6F\u96C5\u9ED1",Arial,sans-serif;--el-font-weight-primary:500;--el-font-line-height-primary:24px;--el-index-normal:1;--el-index-top:1000;--el-index-popper:2000;--el-border-radius-base:4px;--el-border-radius-small:2px;--el-border-radius-round:20px;--el-border-radius-circle:100%;--el-transition-duration:.3s;--el-transition-duration-fast:.2s;--el-transition-function-ease-in-out-bezier:cubic-bezier(.645, .045, .355, 1);--el-transition-function-fast-bezier:cubic-bezier(.23, 1, .32, 1);--el-transition-all:all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);--el-transition-fade:opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-md-fade:transform var(--el-transition-duration) var(--el-transition-function-fast-bezier),opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-fade-linear:opacity var(--el-transition-duration-fast) linear;--el-transition-border:border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-box-shadow:box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-color:color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-component-size-large:40px;--el-component-size:32px;--el-component-size-small:24px}:root{color-scheme:light;--el-color-white:#ffffff;--el-color-black:#000000;--el-color-primary:#409eff;--el-color-primary-light-3:#79bbff;--el-color-primary-light-5:#a0cfff;--el-color-primary-light-7:#c6e2ff;--el-color-primary-light-8:#d9ecff;--el-color-primary-light-9:#ecf5ff;--el-color-primary-dark-2:#337ecc;--el-color-success:#67c23a;--el-color-success-light-3:#95d475;--el-color-success-light-5:#b3e19d;--el-color-success-light-7:#d1edc4;--el-color-success-light-8:#e1f3d8;--el-color-success-light-9:#f0f9eb;--el-color-success-dark-2:#529b2e;--el-color-warning:#e6a23c;--el-color-warning-light-3:#eebe77;--el-color-warning-light-5:#f3d19e;--el-color-warning-light-7:#f8e3c5;--el-color-warning-light-8:#faecd8;--el-color-warning-light-9:#fdf6ec;--el-color-warning-dark-2:#b88230;--el-color-danger:#f56c6c;--el-color-danger-light-3:#f89898;--el-color-danger-light-5:#fab6b6;--el-color-danger-light-7:#fcd3d3;--el-color-danger-light-8:#fde2e2;--el-color-danger-light-9:#fef0f0;--el-color-danger-dark-2:#c45656;--el-color-error:#f56c6c;--el-color-error-light-3:#f89898;--el-color-error-light-5:#fab6b6;--el-color-error-light-7:#fcd3d3;--el-color-error-light-8:#fde2e2;--el-color-error-light-9:#fef0f0;--el-color-error-dark-2:#c45656;--el-color-info:#909399;--el-color-info-light-3:#b1b3b8;--el-color-info-light-5:#c8c9cc;--el-color-info-light-7:#dedfe0;--el-color-info-light-8:#e9e9eb;--el-color-info-light-9:#f4f4f5;--el-color-info-dark-2:#73767a;--el-bg-color:#ffffff;--el-bg-color-page:#f2f3f5;--el-bg-color-overlay:#ffffff;--el-text-color-primary:#303133;--el-text-color-regular:#606266;--el-text-color-secondary:#909399;--el-text-color-placeholder:#a8abb2;--el-text-color-disabled:#c0c4cc;--el-border-color:#dcdfe6;--el-border-color-light:#e4e7ed;--el-border-color-lighter:#ebeef5;--el-border-color-extra-light:#f2f6fc;--el-border-color-dark:#d4d7de;--el-border-color-darker:#cdd0d6;--el-fill-color:#f0f2f5;--el-fill-color-light:#f5f7fa;--el-fill-color-lighter:#fafafa;--el-fill-color-extra-light:#fafcff;--el-fill-color-dark:#ebedf0;--el-fill-color-darker:#e6e8eb;--el-fill-color-blank:#ffffff;--el-box-shadow:0px 12px 32px 4px rgba(0, 0, 0, .04),0px 8px 20px rgba(0, 0, 0, .08);--el-box-shadow-light:0px 0px 12px rgba(0, 0, 0, .12);--el-box-shadow-lighter:0px 0px 6px rgba(0, 0, 0, .12);--el-box-shadow-dark:0px 16px 48px 16px rgba(0, 0, 0, .08),0px 12px 32px rgba(0, 0, 0, .12),0px 8px 16px -8px rgba(0, 0, 0, .16);--el-disabled-bg-color:var(--el-fill-color-light);--el-disabled-text-color:var(--el-text-color-placeholder);--el-disabled-border-color:var(--el-border-color-light);--el-overlay-color:rgba(0, 0, 0, .8);--el-overlay-color-light:rgba(0, 0, 0, .7);--el-overlay-color-lighter:rgba(0, 0, 0, .5);--el-mask-color:rgba(255, 255, 255, .9);--el-mask-color-extra-light:rgba(255, 255, 255, .3);--el-border-width:1px;--el-border-style:solid;--el-border-color-hover:var(--el-text-color-disabled);--el-border:var(--el-border-width) var(--el-border-style) var(--el-border-color);--el-svg-monochrome-grey:var(--el-border-color)}.fade-in-linear-enter-active,.fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.fade-in-linear-enter-from,.fade-in-linear-leave-to{opacity:0}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.el-fade-in-linear-enter-from,.el-fade-in-linear-leave-to{opacity:0}.el-fade-in-enter-active,.el-fade-in-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-fade-in-enter-from,.el-fade-in-leave-active{opacity:0}.el-zoom-in-center-enter-active,.el-zoom-in-center-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-zoom-in-center-enter-from,.el-zoom-in-center-leave-active{opacity:0;transform:scaleX(0)}.el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;transform:scaleY(1);transition:var(--el-transition-md-fade);transform-origin:center top}.el-zoom-in-top-enter-active[data-popper-placement^=top],.el-zoom-in-top-leave-active[data-popper-placement^=top]{transform-origin:center bottom}.el-zoom-in-top-enter-from,.el-zoom-in-top-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-bottom-enter-active,.el-zoom-in-bottom-leave-active{opacity:1;transform:scaleY(1);transition:var(--el-transition-md-fade);transform-origin:center bottom}.el-zoom-in-bottom-enter-from,.el-zoom-in-bottom-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-left-enter-active,.el-zoom-in-left-leave-active{opacity:1;transform:scale(1);transition:var(--el-transition-md-fade);transform-origin:top left}.el-zoom-in-left-enter-from,.el-zoom-in-left-leave-active{opacity:0;transform:scale(.45)}.collapse-transition{transition:var(--el-transition-duration) height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.el-collapse-transition-enter-active,.el-collapse-transition-leave-active{transition:var(--el-transition-duration) max-height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.horizontal-collapse-transition{transition:var(--el-transition-duration) width ease-in-out,var(--el-transition-duration) padding-left ease-in-out,var(--el-transition-duration) padding-right ease-in-out}.el-list-enter-active,.el-list-leave-active{transition:all 1s}.el-list-enter-from,.el-list-leave-to{opacity:0;transform:translateY(-30px)}.el-list-leave-active{position:absolute!important}.el-opacity-transition{transition:opacity var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-icon-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon--right{margin-left:5px}.el-icon--left{margin-right:5px}@-webkit-keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.el-icon{--color:inherit;height:1em;width:1em;line-height:1em;display:inline-flex;justify-content:center;align-items:center;position:relative;fill:currentColor;color:var(--color);font-size:inherit}.el-icon.is-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon svg{height:1em;width:1em}:root{--el-popup-modal-bg-color:var(--el-color-black);--el-popup-modal-opacity:.5}.v-modal-enter{-webkit-animation:v-modal-in var(--el-transition-duration-fast) ease;animation:v-modal-in var(--el-transition-duration-fast) ease}.v-modal-leave{-webkit-animation:v-modal-out var(--el-transition-duration-fast) ease forwards;animation:v-modal-out var(--el-transition-duration-fast) ease forwards}@-webkit-keyframes v-modal-in{0%{opacity:0}}@keyframes v-modal-in{0%{opacity:0}}@-webkit-keyframes v-modal-out{to{opacity:0}}@keyframes v-modal-out{to{opacity:0}}.v-modal{position:fixed;left:0;top:0;width:100%;height:100%;opacity:var(--el-popup-modal-opacity);background:var(--el-popup-modal-bg-color)}.el-popup-parent--hidden{overflow:hidden}.el-dialog{--el-dialog-width:50%;--el-dialog-margin-top:15vh;--el-dialog-bg-color:var(--el-bg-color);--el-dialog-box-shadow:var(--el-box-shadow);--el-dialog-title-font-size:var(--el-font-size-large);--el-dialog-content-font-size:14px;--el-dialog-font-line-height:var(--el-font-line-height-primary);--el-dialog-padding-primary:16px;--el-dialog-border-radius:var(--el-border-radius-small);position:relative;margin:var(--el-dialog-margin-top,15vh) auto 50px;background:var(--el-dialog-bg-color);border-radius:var(--el-dialog-border-radius);box-shadow:var(--el-dialog-box-shadow);box-sizing:border-box;padding:var(--el-dialog-padding-primary);width:var(--el-dialog-width,50%);overflow-wrap:break-word}.el-dialog:focus{outline:0!important}.el-dialog.is-align-center{margin:auto}.el-dialog.is-fullscreen{--el-dialog-width:100%;--el-dialog-margin-top:0;margin-bottom:0;height:100%;overflow:auto}.el-dialog__wrapper{position:fixed;top:0;right:0;bottom:0;left:0;overflow:auto;margin:0}.el-dialog.is-draggable .el-dialog__header{cursor:move;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.el-dialog__header{padding-bottom:var(--el-dialog-padding-primary)}.el-dialog__header.show-close{padding-right:calc(var(--el-dialog-padding-primary) + var(--el-message-close-size,16px))}.el-dialog__headerbtn{position:absolute;top:0;right:0;padding:0;width:48px;height:48px;background:0 0;border:none;outline:0;cursor:pointer;font-size:var(--el-message-close-size,16px)}.el-dialog__headerbtn .el-dialog__close{color:var(--el-color-info);font-size:inherit}.el-dialog__headerbtn:focus .el-dialog__close,.el-dialog__headerbtn:hover .el-dialog__close{color:var(--el-color-primary)}.el-dialog__title{line-height:var(--el-dialog-font-line-height);font-size:var(--el-dialog-title-font-size);color:var(--el-text-color-primary)}.el-dialog__body{color:var(--el-text-color-regular);font-size:var(--el-dialog-content-font-size)}.el-dialog__footer{padding-top:var(--el-dialog-padding-primary);text-align:right;box-sizing:border-box}.el-dialog--center{text-align:center}.el-dialog--center .el-dialog__body{text-align:initial}.el-dialog--center .el-dialog__footer{text-align:inherit}.el-overlay-dialog{position:fixed;top:0;right:0;bottom:0;left:0;overflow:auto}.dialog-fade-enter-active{-webkit-animation:modal-fade-in var(--el-transition-duration);animation:modal-fade-in var(--el-transition-duration)}.dialog-fade-enter-active .el-overlay-dialog{-webkit-animation:dialog-fade-in var(--el-transition-duration);animation:dialog-fade-in var(--el-transition-duration)}.dialog-fade-leave-active{-webkit-animation:modal-fade-out var(--el-transition-duration);animation:modal-fade-out var(--el-transition-duration)}.dialog-fade-leave-active .el-overlay-dialog{-webkit-animation:dialog-fade-out var(--el-transition-duration);animation:dialog-fade-out var(--el-transition-duration)}@-webkit-keyframes dialog-fade-in{0%{transform:translate3d(0,-20px,0);opacity:0}to{transform:translateZ(0);opacity:1}}@keyframes dialog-fade-in{0%{transform:translate3d(0,-20px,0);opacity:0}to{transform:translateZ(0);opacity:1}}@-webkit-keyframes dialog-fade-out{0%{transform:translateZ(0);opacity:1}to{transform:translate3d(0,-20px,0);opacity:0}}@keyframes dialog-fade-out{0%{transform:translateZ(0);opacity:1}to{transform:translate3d(0,-20px,0);opacity:0}}@-webkit-keyframes modal-fade-in{0%{opacity:0}to{opacity:1}}@keyframes modal-fade-in{0%{opacity:0}to{opacity:1}}@-webkit-keyframes modal-fade-out{0%{opacity:1}to{opacity:0}}@keyframes modal-fade-out{0%{opacity:1}to{opacity:0}}.el-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2000;height:100%;background-color:var(--el-overlay-color-lighter);overflow:auto}.el-overlay .el-overlay-root{height:0}.el-button{--el-button-font-weight:var(--el-font-weight-primary);--el-button-border-color:var(--el-border-color);--el-button-bg-color:var(--el-fill-color-blank);--el-button-text-color:var(--el-text-color-regular);--el-button-disabled-text-color:var(--el-disabled-text-color);--el-button-disabled-bg-color:var(--el-fill-color-blank);--el-button-disabled-border-color:var(--el-border-color-light);--el-button-divide-border-color:rgba(255, 255, 255, .5);--el-button-hover-text-color:var(--el-color-primary);--el-button-hover-bg-color:var(--el-color-primary-light-9);--el-button-hover-border-color:var(--el-color-primary-light-7);--el-button-active-text-color:var(--el-button-hover-text-color);--el-button-active-border-color:var(--el-color-primary);--el-button-active-bg-color:var(--el-button-hover-bg-color);--el-button-outline-color:var(--el-color-primary-light-5);--el-button-hover-link-text-color:var(--el-color-info);--el-button-active-color:var(--el-text-color-primary)}.el-button{display:inline-flex;justify-content:center;align-items:center;line-height:1;height:32px;white-space:nowrap;cursor:pointer;color:var(--el-button-text-color);text-align:center;box-sizing:border-box;outline:0;transition:.1s;font-weight:var(--el-button-font-weight);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;-webkit-appearance:none;background-color:var(--el-button-bg-color);border:var(--el-border);border-color:var(--el-button-border-color);padding:8px 15px;font-size:var(--el-font-size-base);border-radius:var(--el-border-radius-base)}.el-button:focus,.el-button:hover{color:var(--el-button-hover-text-color);border-color:var(--el-button-hover-border-color);background-color:var(--el-button-hover-bg-color);outline:0}.el-button:active{color:var(--el-button-active-text-color);border-color:var(--el-button-active-border-color);background-color:var(--el-button-active-bg-color);outline:0}.el-button:focus-visible{outline:2px solid var(--el-button-outline-color);outline-offset:1px}.el-button>span{display:inline-flex;align-items:center}.el-button+.el-button{margin-left:12px}.el-button.is-round{padding:8px 15px}.el-button::-moz-focus-inner{border:0}.el-button [class*=el-icon]+span{margin-left:6px}.el-button [class*=el-icon] svg{vertical-align:bottom}.el-button.is-plain{--el-button-hover-text-color:var(--el-color-primary);--el-button-hover-bg-color:var(--el-fill-color-blank);--el-button-hover-border-color:var(--el-color-primary)}.el-button.is-active{color:var(--el-button-active-text-color);border-color:var(--el-button-active-border-color);background-color:var(--el-button-active-bg-color);outline:0}.el-button.is-disabled,.el-button.is-disabled:focus,.el-button.is-disabled:hover{color:var(--el-button-disabled-text-color);cursor:not-allowed;background-image:none;background-color:var(--el-button-disabled-bg-color);border-color:var(--el-button-disabled-border-color)}.el-button.is-loading{position:relative;pointer-events:none}.el-button.is-loading:before{z-index:1;pointer-events:none;content:"";position:absolute;left:-1px;top:-1px;right:-1px;bottom:-1px;border-radius:inherit;background-color:var(--el-mask-color-extra-light)}.el-button.is-round{border-radius:var(--el-border-radius-round)}.el-button.is-circle{width:32px;border-radius:50%;padding:8px}.el-button.is-text{color:var(--el-button-text-color);border:0 solid transparent;background-color:transparent}.el-button.is-text.is-disabled{color:var(--el-button-disabled-text-color);background-color:transparent!important}.el-button.is-text:not(.is-disabled):focus,.el-button.is-text:not(.is-disabled):hover{background-color:var(--el-fill-color-light)}.el-button.is-text:not(.is-disabled):focus-visible{outline:2px solid var(--el-button-outline-color);outline-offset:1px}.el-button.is-text:not(.is-disabled):active{background-color:var(--el-fill-color)}.el-button.is-text:not(.is-disabled).is-has-bg{background-color:var(--el-fill-color-light)}.el-button.is-text:not(.is-disabled).is-has-bg:focus,.el-button.is-text:not(.is-disabled).is-has-bg:hover{background-color:var(--el-fill-color)}.el-button.is-text:not(.is-disabled).is-has-bg:active{background-color:var(--el-fill-color-dark)}.el-button__text--expand{letter-spacing:.3em;margin-right:-.3em}.el-button.is-link{border-color:transparent;color:var(--el-button-text-color);background:0 0;padding:2px;height:auto}.el-button.is-link:focus,.el-button.is-link:hover{color:var(--el-button-hover-link-text-color)}.el-button.is-link.is-disabled{color:var(--el-button-disabled-text-color);background-color:transparent!important;border-color:transparent!important}.el-button.is-link:not(.is-disabled):focus,.el-button.is-link:not(.is-disabled):hover{border-color:transparent;background-color:transparent}.el-button.is-link:not(.is-disabled):active{color:var(--el-button-active-color);border-color:transparent;background-color:transparent}.el-button--text{border-color:transparent;background:0 0;color:var(--el-color-primary);padding-left:0;padding-right:0}.el-button--text.is-disabled{color:var(--el-button-disabled-text-color);background-color:transparent!important;border-color:transparent!important}.el-button--text:not(.is-disabled):focus,.el-button--text:not(.is-disabled):hover{color:var(--el-color-primary-light-3);border-color:transparent;background-color:transparent}.el-button--text:not(.is-disabled):active{color:var(--el-color-primary-dark-2);border-color:transparent;background-color:transparent}.el-button__link--expand{letter-spacing:.3em;margin-right:-.3em}.el-button--primary{--el-button-text-color:var(--el-color-white);--el-button-bg-color:var(--el-color-primary);--el-button-border-color:var(--el-color-primary);--el-button-outline-color:var(--el-color-primary-light-5);--el-button-active-color:var(--el-color-primary-dark-2);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-link-text-color:var(--el-color-primary-light-5);--el-button-hover-bg-color:var(--el-color-primary-light-3);--el-button-hover-border-color:var(--el-color-primary-light-3);--el-button-active-bg-color:var(--el-color-primary-dark-2);--el-button-active-border-color:var(--el-color-primary-dark-2);--el-button-disabled-text-color:var(--el-color-white);--el-button-disabled-bg-color:var(--el-color-primary-light-5);--el-button-disabled-border-color:var(--el-color-primary-light-5)}.el-button--primary.is-link,.el-button--primary.is-plain,.el-button--primary.is-text{--el-button-text-color:var(--el-color-primary);--el-button-bg-color:var(--el-color-primary-light-9);--el-button-border-color:var(--el-color-primary-light-5);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-bg-color:var(--el-color-primary);--el-button-hover-border-color:var(--el-color-primary);--el-button-active-text-color:var(--el-color-white)}.el-button--primary.is-link.is-disabled,.el-button--primary.is-link.is-disabled:active,.el-button--primary.is-link.is-disabled:focus,.el-button--primary.is-link.is-disabled:hover,.el-button--primary.is-plain.is-disabled,.el-button--primary.is-plain.is-disabled:active,.el-button--primary.is-plain.is-disabled:focus,.el-button--primary.is-plain.is-disabled:hover,.el-button--primary.is-text.is-disabled,.el-button--primary.is-text.is-disabled:active,.el-button--primary.is-text.is-disabled:focus,.el-button--primary.is-text.is-disabled:hover{color:var(--el-color-primary-light-5);background-color:var(--el-color-primary-light-9);border-color:var(--el-color-primary-light-8)}.el-button--success{--el-button-text-color:var(--el-color-white);--el-button-bg-color:var(--el-color-success);--el-button-border-color:var(--el-color-success);--el-button-outline-color:var(--el-color-success-light-5);--el-button-active-color:var(--el-color-success-dark-2);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-link-text-color:var(--el-color-success-light-5);--el-button-hover-bg-color:var(--el-color-success-light-3);--el-button-hover-border-color:var(--el-color-success-light-3);--el-button-active-bg-color:var(--el-color-success-dark-2);--el-button-active-border-color:var(--el-color-success-dark-2);--el-button-disabled-text-color:var(--el-color-white);--el-button-disabled-bg-color:var(--el-color-success-light-5);--el-button-disabled-border-color:var(--el-color-success-light-5)}.el-button--success.is-link,.el-button--success.is-plain,.el-button--success.is-text{--el-button-text-color:var(--el-color-success);--el-button-bg-color:var(--el-color-success-light-9);--el-button-border-color:var(--el-color-success-light-5);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-bg-color:var(--el-color-success);--el-button-hover-border-color:var(--el-color-success);--el-button-active-text-color:var(--el-color-white)}.el-button--success.is-link.is-disabled,.el-button--success.is-link.is-disabled:active,.el-button--success.is-link.is-disabled:focus,.el-button--success.is-link.is-disabled:hover,.el-button--success.is-plain.is-disabled,.el-button--success.is-plain.is-disabled:active,.el-button--success.is-plain.is-disabled:focus,.el-button--success.is-plain.is-disabled:hover,.el-button--success.is-text.is-disabled,.el-button--success.is-text.is-disabled:active,.el-button--success.is-text.is-disabled:focus,.el-button--success.is-text.is-disabled:hover{color:var(--el-color-success-light-5);background-color:var(--el-color-success-light-9);border-color:var(--el-color-success-light-8)}.el-button--warning{--el-button-text-color:var(--el-color-white);--el-button-bg-color:var(--el-color-warning);--el-button-border-color:var(--el-color-warning);--el-button-outline-color:var(--el-color-warning-light-5);--el-button-active-color:var(--el-color-warning-dark-2);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-link-text-color:var(--el-color-warning-light-5);--el-button-hover-bg-color:var(--el-color-warning-light-3);--el-button-hover-border-color:var(--el-color-warning-light-3);--el-button-active-bg-color:var(--el-color-warning-dark-2);--el-button-active-border-color:var(--el-color-warning-dark-2);--el-button-disabled-text-color:var(--el-color-white);--el-button-disabled-bg-color:var(--el-color-warning-light-5);--el-button-disabled-border-color:var(--el-color-warning-light-5)}.el-button--warning.is-link,.el-button--warning.is-plain,.el-button--warning.is-text{--el-button-text-color:var(--el-color-warning);--el-button-bg-color:var(--el-color-warning-light-9);--el-button-border-color:var(--el-color-warning-light-5);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-bg-color:var(--el-color-warning);--el-button-hover-border-color:var(--el-color-warning);--el-button-active-text-color:var(--el-color-white)}.el-button--warning.is-link.is-disabled,.el-button--warning.is-link.is-disabled:active,.el-button--warning.is-link.is-disabled:focus,.el-button--warning.is-link.is-disabled:hover,.el-button--warning.is-plain.is-disabled,.el-button--warning.is-plain.is-disabled:active,.el-button--warning.is-plain.is-disabled:focus,.el-button--warning.is-plain.is-disabled:hover,.el-button--warning.is-text.is-disabled,.el-button--warning.is-text.is-disabled:active,.el-button--warning.is-text.is-disabled:focus,.el-button--warning.is-text.is-disabled:hover{color:var(--el-color-warning-light-5);background-color:var(--el-color-warning-light-9);border-color:var(--el-color-warning-light-8)}.el-button--danger{--el-button-text-color:var(--el-color-white);--el-button-bg-color:var(--el-color-danger);--el-button-border-color:var(--el-color-danger);--el-button-outline-color:var(--el-color-danger-light-5);--el-button-active-color:var(--el-color-danger-dark-2);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-link-text-color:var(--el-color-danger-light-5);--el-button-hover-bg-color:var(--el-color-danger-light-3);--el-button-hover-border-color:var(--el-color-danger-light-3);--el-button-active-bg-color:var(--el-color-danger-dark-2);--el-button-active-border-color:var(--el-color-danger-dark-2);--el-button-disabled-text-color:var(--el-color-white);--el-button-disabled-bg-color:var(--el-color-danger-light-5);--el-button-disabled-border-color:var(--el-color-danger-light-5)}.el-button--danger.is-link,.el-button--danger.is-plain,.el-button--danger.is-text{--el-button-text-color:var(--el-color-danger);--el-button-bg-color:var(--el-color-danger-light-9);--el-button-border-color:var(--el-color-danger-light-5);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-bg-color:var(--el-color-danger);--el-button-hover-border-color:var(--el-color-danger);--el-button-active-text-color:var(--el-color-white)}.el-button--danger.is-link.is-disabled,.el-button--danger.is-link.is-disabled:active,.el-button--danger.is-link.is-disabled:focus,.el-button--danger.is-link.is-disabled:hover,.el-button--danger.is-plain.is-disabled,.el-button--danger.is-plain.is-disabled:active,.el-button--danger.is-plain.is-disabled:focus,.el-button--danger.is-plain.is-disabled:hover,.el-button--danger.is-text.is-disabled,.el-button--danger.is-text.is-disabled:active,.el-button--danger.is-text.is-disabled:focus,.el-button--danger.is-text.is-disabled:hover{color:var(--el-color-danger-light-5);background-color:var(--el-color-danger-light-9);border-color:var(--el-color-danger-light-8)}.el-button--info{--el-button-text-color:var(--el-color-white);--el-button-bg-color:var(--el-color-info);--el-button-border-color:var(--el-color-info);--el-button-outline-color:var(--el-color-info-light-5);--el-button-active-color:var(--el-color-info-dark-2);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-link-text-color:var(--el-color-info-light-5);--el-button-hover-bg-color:var(--el-color-info-light-3);--el-button-hover-border-color:var(--el-color-info-light-3);--el-button-active-bg-color:var(--el-color-info-dark-2);--el-button-active-border-color:var(--el-color-info-dark-2);--el-button-disabled-text-color:var(--el-color-white);--el-button-disabled-bg-color:var(--el-color-info-light-5);--el-button-disabled-border-color:var(--el-color-info-light-5)}.el-button--info.is-link,.el-button--info.is-plain,.el-button--info.is-text{--el-button-text-color:var(--el-color-info);--el-button-bg-color:var(--el-color-info-light-9);--el-button-border-color:var(--el-color-info-light-5);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-bg-color:var(--el-color-info);--el-button-hover-border-color:var(--el-color-info);--el-button-active-text-color:var(--el-color-white)}.el-button--info.is-link.is-disabled,.el-button--info.is-link.is-disabled:active,.el-button--info.is-link.is-disabled:focus,.el-button--info.is-link.is-disabled:hover,.el-button--info.is-plain.is-disabled,.el-button--info.is-plain.is-disabled:active,.el-button--info.is-plain.is-disabled:focus,.el-button--info.is-plain.is-disabled:hover,.el-button--info.is-text.is-disabled,.el-button--info.is-text.is-disabled:active,.el-button--info.is-text.is-disabled:focus,.el-button--info.is-text.is-disabled:hover{color:var(--el-color-info-light-5);background-color:var(--el-color-info-light-9);border-color:var(--el-color-info-light-8)}.el-button--large{--el-button-size:40px;height:var(--el-button-size);padding:12px 19px;font-size:var(--el-font-size-base);border-radius:var(--el-border-radius-base)}.el-button--large [class*=el-icon]+span{margin-left:8px}.el-button--large.is-round{padding:12px 19px}.el-button--large.is-circle{width:var(--el-button-size);padding:12px}.el-button--small{--el-button-size:24px;height:var(--el-button-size);padding:5px 11px;font-size:12px;border-radius:calc(var(--el-border-radius-base) - 1px)}.el-button--small [class*=el-icon]+span{margin-left:4px}.el-button--small.is-round{padding:5px 11px}.el-button--small.is-circle{width:var(--el-button-size);padding:5px}.modal-wrapper[data-v-2d09cfa9]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000080;margin-top:0;display:flex;justify-content:center;align-items:center;z-index:999}.modal[data-v-2d09cfa9]{background-color:#fff;padding:20px;border-radius:5px}.header[data-v-2d09cfa9]{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.header h2[data-v-2d09cfa9]{margin:0;font-size:20px;font-weight:700}.header button[data-v-2d09cfa9]{border:none;background-color:transparent;font-size:20px;cursor:pointer}.contentBox[data-v-2d09cfa9]{max-height:400px;overflow:auto;font-size:16px;display:flex;justify-content:space-between}.contentBox .produce[data-v-2d09cfa9]{flex:60%}.contentBox .produce p[data-v-2d09cfa9]{margin-top:15px}.contentBox .produce .ipt[data-v-2d09cfa9]{margin-top:15px;height:30px;border-radius:5px;padding-left:10px}.contentBox .img[data-v-2d09cfa9]{flex:35%;height:180px;display:flex;align-items:center;justify-content:center}.contentBox .img img[data-v-2d09cfa9]{width:180px}input[data-v-2d09cfa9]::-webkit-input-placeholder{color:#aab2bd;font-size:14px;padding-left:5px}.el-badge{--el-badge-bg-color:var(--el-color-danger);--el-badge-radius:10px;--el-badge-font-size:12px;--el-badge-padding:6px;--el-badge-size:18px;position:relative;vertical-align:middle;display:inline-block;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content}.el-badge__content{background-color:var(--el-badge-bg-color);border-radius:var(--el-badge-radius);color:var(--el-color-white);display:inline-flex;justify-content:center;align-items:center;font-size:var(--el-badge-font-size);height:var(--el-badge-size);padding:0 var(--el-badge-padding);white-space:nowrap;border:1px solid var(--el-bg-color)}.el-badge__content.is-fixed{position:absolute;top:0;right:calc(1px + var(--el-badge-size)/ 2);transform:translateY(-50%) translate(100%);z-index:var(--el-index-normal)}.el-badge__content.is-fixed.is-dot{right:5px}.el-badge__content.is-dot{height:8px;width:8px;padding:0;right:0;border-radius:50%}.el-badge__content--primary{background-color:var(--el-color-primary)}.el-badge__content--success{background-color:var(--el-color-success)}.el-badge__content--warning{background-color:var(--el-color-warning)}.el-badge__content--info{background-color:var(--el-color-info)}.el-badge__content--danger{background-color:var(--el-color-danger)}.el-message{--el-message-bg-color:var(--el-color-info-light-9);--el-message-border-color:var(--el-border-color-lighter);--el-message-padding:15px 19px;--el-message-close-size:16px;--el-message-close-icon-color:var(--el-text-color-placeholder);--el-message-close-hover-color:var(--el-text-color-secondary)}.el-message{width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;max-width:calc(100% - 32px);box-sizing:border-box;border-radius:var(--el-border-radius-base);border-width:var(--el-border-width);border-style:var(--el-border-style);border-color:var(--el-message-border-color);position:fixed;left:50%;top:20px;transform:translate(-50%);background-color:var(--el-message-bg-color);transition:opacity var(--el-transition-duration),transform .4s,top .4s;padding:var(--el-message-padding);display:flex;align-items:center}.el-message.is-center{justify-content:center}.el-message.is-closable .el-message__content{padding-right:31px}.el-message p{margin:0}.el-message--success{--el-message-bg-color:var(--el-color-success-light-9);--el-message-border-color:var(--el-color-success-light-8);--el-message-text-color:var(--el-color-success)}.el-message--success .el-message__content{color:var(--el-message-text-color);overflow-wrap:break-word}.el-message .el-message-icon--success{color:var(--el-message-text-color)}.el-message--info{--el-message-bg-color:var(--el-color-info-light-9);--el-message-border-color:var(--el-color-info-light-8);--el-message-text-color:var(--el-color-info)}.el-message--info .el-message__content{color:var(--el-message-text-color);overflow-wrap:break-word}.el-message .el-message-icon--info{color:var(--el-message-text-color)}.el-message--warning{--el-message-bg-color:var(--el-color-warning-light-9);--el-message-border-color:var(--el-color-warning-light-8);--el-message-text-color:var(--el-color-warning)}.el-message--warning .el-message__content{color:var(--el-message-text-color);overflow-wrap:break-word}.el-message .el-message-icon--warning{color:var(--el-message-text-color)}.el-message--error{--el-message-bg-color:var(--el-color-error-light-9);--el-message-border-color:var(--el-color-error-light-8);--el-message-text-color:var(--el-color-error)}.el-message--error .el-message__content{color:var(--el-message-text-color);overflow-wrap:break-word}.el-message .el-message-icon--error{color:var(--el-message-text-color)}.el-message__icon{margin-right:10px}.el-message .el-message__badge{position:absolute;top:-8px;right:-8px}.el-message__content{padding:0;font-size:14px;line-height:1}.el-message__content:focus{outline-width:0}.el-message .el-message__closeBtn{position:absolute;top:50%;right:19px;transform:translateY(-50%);cursor:pointer;color:var(--el-message-close-icon-color);font-size:var(--el-message-close-size)}.el-message .el-message__closeBtn:focus{outline-width:0}.el-message .el-message__closeBtn:hover{color:var(--el-message-close-hover-color)}.el-message-fade-enter-from,.el-message-fade-leave-to{opacity:0;transform:translate(-50%,-100%)}.copy[data-v-b9578a54]{width:200px;height:200px;position:fixed;right:10px;top:120px}.copy .btngroup[data-v-b9578a54]{display:flex;flex-direction:column;justify-content:center;align-items:center}.copy .btngroup .lyric[data-v-b9578a54]{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;width:80px;height:40px;border-radius:10%;font-size:14px;color:#e4cf0e;background-color:#07031c;cursor:pointer;margin-bottom:10px}.copy .btngroup .down[data-v-b9578a54]{display:flex;align-items:center;justify-content:center;width:80px;height:40px;border-radius:10%;font-size:14px;color:#fff;background-color:red;cursor:pointer}.copy .btngroup .down[data-v-b9578a54]:hover{background-color:#00ff48}.copy .btngroup .lyric[data-v-b9578a54]:hover{background-color:#933814!important}.dialogList[data-v-b9578a54]{display:flex;justify-content:space-between;align-items:start}.dialogList .downContainer[data-v-b9578a54]{display:flex;flex-direction:column;justify-content:center;align-items:start}.dialogList .downContainer .down_list[data-v-b9578a54]{cursor:pointer;margin-top:10px}.dialogList .downContainer .down_list[data-v-b9578a54]:hover{color:#0ff}.dialogList .buttonContainer[data-v-b9578a54]{display:flex;flex-direction:column;justify-content:center;align-items:start}.dialogList .buttonContainer .btnClass[data-v-b9578a54]{margin-top:10px;margin-left:0} ');

(function (vue, elementPlus) {
  'use strict';

  var _a;
  const isClient = typeof window !== "undefined";
  const isString$1 = (val) => typeof val === "string";
  const noop = () => {
  };
  isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function resolveUnref(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  function identity(arg) {
    return arg;
  }
  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }
  function tryOnMounted(fn, sync = true) {
    if (vue.getCurrentInstance())
      vue.onMounted(fn);
    else if (sync)
      fn();
    else
      vue.nextTick(fn);
  }
  function useTimeoutFn(cb, interval, options = {}) {
    const {
      immediate = true
    } = options;
    const isPending = vue.ref(false);
    let timer = null;
    function clear() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function stop() {
      isPending.value = false;
      clear();
    }
    function start(...args) {
      clear();
      isPending.value = true;
      timer = setTimeout(() => {
        isPending.value = false;
        timer = null;
        cb(...args);
      }, resolveUnref(interval));
    }
    if (immediate) {
      isPending.value = true;
      if (isClient)
        start();
    }
    tryOnScopeDispose(stop);
    return {
      isPending: vue.readonly(isPending),
      start,
      stop
    };
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
      cleanups.forEach((fn) => fn());
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
    linear: identity
  }, _TransitionPresets);
  const NOOP = () => {
  };
  const hasOwnProperty$4 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$4.call(val, key);
  const isArray$2 = Array.isArray;
  const isFunction$1 = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol$1 = (val) => typeof val === "symbol";
  const isObject$1 = (val) => val !== null && typeof val === "object";
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  });
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  const freeGlobal$1 = freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal$1 || freeSelf || Function("return this")();
  const root$1 = root;
  var Symbol$1 = root$1.Symbol;
  const Symbol$2 = Symbol$1;
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$4.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty$3.call(value, symToStringTag$1), tag = value[symToStringTag$1];
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
  var objectProto$3 = Object.prototype;
  var nativeObjectToString = objectProto$3.toString;
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
  var symbolTag = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
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
  var INFINITY$1 = 1 / 0;
  var symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
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
    return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
  }
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
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
  var funcProto = Function.prototype, objectProto$2 = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty$2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
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
  function eq(value, other) {
    return value === other || value !== value && other !== other;
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
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate$1) {
      var result = data[key];
      return result === HASH_UNDEFINED$1 ? void 0 : result;
    }
    return hasOwnProperty$1.call(data, key) ? data[key] : void 0;
  }
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate$1 && value === void 0 ? HASH_UNDEFINED : value;
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
  var Map = getNative(root$1, "Map");
  const Map$1 = Map;
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map$1 || ListCache)(),
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
  var FUNC_ERROR_TEXT = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
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
  function fromPairs(pairs) {
    var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
    while (++index < length) {
      var pair = pairs[index];
      result[pair[0]] = pair[1];
    }
    return result;
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
  const keysOf = (arr) => Object.keys(arr);
  class ElementPlusError extends Error {
    constructor(m) {
      super(m);
      this.name = "ElementPlusError";
    }
  }
  function throwError(scope, m) {
    throw new ElementPlusError(`[${scope}] ${m}`);
  }
  const classNameToArray = (cls = "") => cls.split(" ").filter((item) => !!item.trim());
  const hasClass = (el, cls) => {
    if (!el || !cls)
      return false;
    if (cls.includes(" "))
      throw new Error("className should not contain space.");
    return el.classList.contains(cls);
  };
  const addClass = (el, cls) => {
    if (!el || !cls.trim())
      return;
    el.classList.add(...classNameToArray(cls));
  };
  const removeClass = (el, cls) => {
    if (!el || !cls.trim())
      return;
    el.classList.remove(...classNameToArray(cls));
  };
  const getStyle = (element, styleName) => {
    var _a2;
    if (!isClient || !element || !styleName)
      return "";
    let key = camelize(styleName);
    if (key === "float")
      key = "cssFloat";
    try {
      const style2 = element.style[key];
      if (style2)
        return style2;
      const computed2 = (_a2 = document.defaultView) == null ? void 0 : _a2.getComputedStyle(element, "");
      return computed2 ? computed2[key] : "";
    } catch (e) {
      return element.style[key];
    }
  };
  function addUnit(value, defaultUnit = "px") {
    if (!value)
      return "";
    if (isNumber(value) || isStringNumber(value)) {
      return `${value}${defaultUnit}`;
    } else if (isString(value)) {
      return value;
    }
  }
  let scrollBarWidth;
  const getScrollBarWidth = (namespace) => {
    var _a2;
    if (!isClient)
      return 0;
    if (scrollBarWidth !== void 0)
      return scrollBarWidth;
    const outer = document.createElement("div");
    outer.className = `${namespace}-scrollbar__wrap`;
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.position = "absolute";
    outer.style.top = "-9999px";
    document.body.appendChild(outer);
    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll";
    const inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;
    (_a2 = outer.parentNode) == null ? void 0 : _a2.removeChild(outer);
    scrollBarWidth = widthNoScroll - widthWithScroll;
    return scrollBarWidth;
  };
  /*! Element Plus Icons Vue v2.3.1 */
  var circle_close_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleCloseFilled",
    __name: "circle-close-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"
        })
      ]));
    }
  });
  var circle_close_filled_default = circle_close_filled_vue_vue_type_script_setup_true_lang_default;
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
  var info_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "InfoFilled",
    __name: "info-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64m67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344M590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"
        })
      ]));
    }
  });
  var info_filled_default = info_filled_vue_vue_type_script_setup_true_lang_default;
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
  var success_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "SuccessFilled",
    __name: "success-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
        })
      ]));
    }
  });
  var success_filled_default = success_filled_vue_vue_type_script_setup_true_lang_default;
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
  const CloseComponents = {
    Close: close_default
  };
  const TypeComponents = {
    Close: close_default,
    SuccessFilled: success_filled_default,
    InfoFilled: info_filled_default,
    WarningFilled: warning_filled_default,
    CircleCloseFilled: circle_close_filled_default
  };
  const TypeComponentsMap = {
    success: success_filled_default,
    warning: warning_filled_default,
    error: circle_close_filled_default,
    info: info_filled_default
  };
  const withInstall = (main2, extra) => {
    main2.install = (app) => {
      for (const comp of [main2, ...Object.values(extra != null ? extra : {})]) {
        app.component(comp.name, comp);
      }
    };
    if (extra) {
      for (const [key, comp] of Object.entries(extra)) {
        main2[key] = comp;
      }
    }
    return main2;
  };
  const withInstallFunction = (fn, name) => {
    fn.install = (app) => {
      fn._context = app._context;
      app.config.globalProperties[name] = fn;
    };
    return fn;
  };
  const withNoopInstall = (component) => {
    component.install = NOOP;
    return component;
  };
  const composeRefs = (...refs) => {
    return (el) => {
      refs.forEach((ref2) => {
        if (isFunction$1(ref2)) {
          ref2(el);
        } else {
          ref2.value = el;
        }
      });
    };
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
  const componentSizes = ["", "default", "small", "large"];
  var PatchFlags = /* @__PURE__ */ ((PatchFlags2) => {
    PatchFlags2[PatchFlags2["TEXT"] = 1] = "TEXT";
    PatchFlags2[PatchFlags2["CLASS"] = 2] = "CLASS";
    PatchFlags2[PatchFlags2["STYLE"] = 4] = "STYLE";
    PatchFlags2[PatchFlags2["PROPS"] = 8] = "PROPS";
    PatchFlags2[PatchFlags2["FULL_PROPS"] = 16] = "FULL_PROPS";
    PatchFlags2[PatchFlags2["HYDRATE_EVENTS"] = 32] = "HYDRATE_EVENTS";
    PatchFlags2[PatchFlags2["STABLE_FRAGMENT"] = 64] = "STABLE_FRAGMENT";
    PatchFlags2[PatchFlags2["KEYED_FRAGMENT"] = 128] = "KEYED_FRAGMENT";
    PatchFlags2[PatchFlags2["UNKEYED_FRAGMENT"] = 256] = "UNKEYED_FRAGMENT";
    PatchFlags2[PatchFlags2["NEED_PATCH"] = 512] = "NEED_PATCH";
    PatchFlags2[PatchFlags2["DYNAMIC_SLOTS"] = 1024] = "DYNAMIC_SLOTS";
    PatchFlags2[PatchFlags2["HOISTED"] = -1] = "HOISTED";
    PatchFlags2[PatchFlags2["BAIL"] = -2] = "BAIL";
    return PatchFlags2;
  })(PatchFlags || {});
  const mutable = (val) => val;
  const useDeprecated = ({ from, replacement, scope, version, ref: ref2, type = "API" }, condition) => {
    vue.watch(() => vue.unref(condition), (val) => {
    }, {
      immediate: true
    });
  };
  const useDraggable = (targetRef, dragRef, draggable, overflow) => {
    let transform = {
      offsetX: 0,
      offsetY: 0
    };
    const onMousedown = (e) => {
      const downX = e.clientX;
      const downY = e.clientY;
      const { offsetX, offsetY } = transform;
      const targetRect = targetRef.value.getBoundingClientRect();
      const targetLeft = targetRect.left;
      const targetTop = targetRect.top;
      const targetWidth = targetRect.width;
      const targetHeight = targetRect.height;
      const clientWidth = document.documentElement.clientWidth;
      const clientHeight = document.documentElement.clientHeight;
      const minLeft = -targetLeft + offsetX;
      const minTop = -targetTop + offsetY;
      const maxLeft = clientWidth - targetLeft - targetWidth + offsetX;
      const maxTop = clientHeight - targetTop - targetHeight + offsetY;
      const onMousemove = (e2) => {
        let moveX = offsetX + e2.clientX - downX;
        let moveY = offsetY + e2.clientY - downY;
        if (!(overflow == null ? void 0 : overflow.value)) {
          moveX = Math.min(Math.max(moveX, minLeft), maxLeft);
          moveY = Math.min(Math.max(moveY, minTop), maxTop);
        }
        transform = {
          offsetX: moveX,
          offsetY: moveY
        };
        if (targetRef.value) {
          targetRef.value.style.transform = `translate(${addUnit(moveX)}, ${addUnit(moveY)})`;
        }
      };
      const onMouseup = () => {
        document.removeEventListener("mousemove", onMousemove);
        document.removeEventListener("mouseup", onMouseup);
      };
      document.addEventListener("mousemove", onMousemove);
      document.addEventListener("mouseup", onMouseup);
    };
    const onDraggable = () => {
      if (dragRef.value && targetRef.value) {
        dragRef.value.addEventListener("mousedown", onMousedown);
      }
    };
    const offDraggable = () => {
      if (dragRef.value && targetRef.value) {
        dragRef.value.removeEventListener("mousedown", onMousedown);
      }
    };
    vue.onMounted(() => {
      vue.watchEffect(() => {
        if (draggable.value) {
          onDraggable();
        } else {
          offDraggable();
        }
      });
    });
    vue.onBeforeUnmount(() => {
      offDraggable();
    });
  };
  var English = {
    name: "en",
    el: {
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
  let activeEffectScope;
  function recordEffectScope(effect, scope = activeEffectScope) {
    if (scope && scope.active) {
      scope.effects.push(effect);
    }
  }
  const createDep = (effects) => {
    const dep = new Set(effects);
    dep.w = 0;
    dep.n = 0;
    return dep;
  };
  const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
  const newTracked = (dep) => (dep.n & trackOpBit) > 0;
  const initDepMarkers = ({ deps }) => {
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].w |= trackOpBit;
      }
    }
  };
  const finalizeDepMarkers = (effect) => {
    const { deps } = effect;
    if (deps.length) {
      let ptr = 0;
      for (let i = 0; i < deps.length; i++) {
        const dep = deps[i];
        if (wasTracked(dep) && !newTracked(dep)) {
          dep.delete(effect);
        } else {
          deps[ptr++] = dep;
        }
        dep.w &= ~trackOpBit;
        dep.n &= ~trackOpBit;
      }
      deps.length = ptr;
    }
  };
  let effectTrackDepth = 0;
  let trackOpBit = 1;
  const maxMarkerBits = 30;
  let activeEffect;
  class ReactiveEffect {
    constructor(fn, scheduler = null, scope) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      this.parent = void 0;
      recordEffectScope(this, scope);
    }
    run() {
      if (!this.active) {
        return this.fn();
      }
      let parent = activeEffect;
      let lastShouldTrack = shouldTrack;
      while (parent) {
        if (parent === this) {
          return;
        }
        parent = parent.parent;
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        shouldTrack = true;
        trackOpBit = 1 << ++effectTrackDepth;
        if (effectTrackDepth <= maxMarkerBits) {
          initDepMarkers(this);
        } else {
          cleanupEffect(this);
        }
        return this.fn();
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          finalizeDepMarkers(this);
        }
        trackOpBit = 1 << --effectTrackDepth;
        activeEffect = this.parent;
        shouldTrack = lastShouldTrack;
        this.parent = void 0;
        if (this.deferStop) {
          this.stop();
        }
      }
    }
    stop() {
      if (activeEffect === this) {
        this.deferStop = true;
      } else if (this.active) {
        cleanupEffect(this);
        if (this.onStop) {
          this.onStop();
        }
        this.active = false;
      }
    }
  }
  function cleanupEffect(effect2) {
    const { deps } = effect2;
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect2);
      }
      deps.length = 0;
    }
  }
  let shouldTrack = true;
  function trackEffects(dep, debuggerEventExtraInfo) {
    let shouldTrack2 = false;
    if (effectTrackDepth <= maxMarkerBits) {
      if (!newTracked(dep)) {
        dep.n |= trackOpBit;
        shouldTrack2 = !wasTracked(dep);
      }
    } else {
      shouldTrack2 = !dep.has(activeEffect);
    }
    if (shouldTrack2) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
  function triggerEffects(dep, debuggerEventExtraInfo) {
    const effects = isArray$2(dep) ? dep : [...dep];
    for (const effect2 of effects) {
      if (effect2.computed) {
        triggerEffect(effect2);
      }
    }
    for (const effect2 of effects) {
      if (!effect2.computed) {
        triggerEffect(effect2);
      }
    }
  }
  function triggerEffect(effect2, debuggerEventExtraInfo) {
    if (effect2 !== activeEffect || effect2.allowRecurse) {
      if (effect2.scheduler) {
        effect2.scheduler();
      } else {
        effect2.run();
      }
    }
  }
  new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol$1)
  );
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function trackRefValue(ref2) {
    if (shouldTrack && activeEffect) {
      ref2 = toRaw(ref2);
      {
        trackEffects(ref2.dep || (ref2.dep = createDep()));
      }
    }
  }
  function triggerRefValue(ref2, newVal) {
    ref2 = toRaw(ref2);
    const dep = ref2.dep;
    if (dep) {
      {
        triggerEffects(dep);
      }
    }
  }
  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly, isSSR) {
      this._setter = _setter;
      this.dep = void 0;
      this.__v_isRef = true;
      this["__v_isReadonly"] = false;
      this._dirty = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerRefValue(this);
        }
      });
      this.effect.computed = this;
      this.effect.active = this._cacheable = !isSSR;
      this["__v_isReadonly"] = isReadonly;
    }
    get value() {
      const self2 = toRaw(this);
      trackRefValue(self2);
      if (self2._dirty || !self2._cacheable) {
        self2._dirty = false;
        self2._value = self2.effect.run();
      }
      return self2._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
  }
  function computed(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    const onlyGetter = isFunction$1(getterOrOptions);
    if (onlyGetter) {
      getter = getterOrOptions;
      setter = NOOP;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
    return cRef;
  }
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
    const be = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
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
      be,
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
  const useLockscreen = (trigger, options = {}) => {
    if (!vue.isRef(trigger)) {
      throwError("[useLockscreen]", "You need to pass a ref param to this function");
    }
    const ns = options.ns || useNamespace("popup");
    const hiddenCls = computed(() => ns.bm("parent", "hidden"));
    if (!isClient || hasClass(document.body, hiddenCls.value)) {
      return;
    }
    let scrollBarWidth2 = 0;
    let withoutHiddenClass = false;
    let bodyWidth = "0";
    const cleanup = () => {
      setTimeout(() => {
        removeClass(document == null ? void 0 : document.body, hiddenCls.value);
        if (withoutHiddenClass && document) {
          document.body.style.width = bodyWidth;
        }
      }, 200);
    };
    vue.watch(trigger, (val) => {
      if (!val) {
        cleanup();
        return;
      }
      withoutHiddenClass = !hasClass(document.body, hiddenCls.value);
      if (withoutHiddenClass) {
        bodyWidth = document.body.style.width;
      }
      scrollBarWidth2 = getScrollBarWidth(ns.namespace.value);
      const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
      const bodyOverflowY = getStyle(document.body, "overflowY");
      if (scrollBarWidth2 > 0 && (bodyHasOverflow || bodyOverflowY === "scroll") && withoutHiddenClass) {
        document.body.style.width = `calc(100% - ${scrollBarWidth2}px)`;
      }
      addClass(document.body, hiddenCls.value);
    });
    vue.onScopeDispose(() => cleanup());
  };
  const useProp = (name) => {
    const vm = vue.getCurrentInstance();
    return vue.computed(() => {
      var _a2, _b;
      return (_b = (_a2 = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a2.$props) == null ? void 0 : _b[name];
    });
  };
  const useSameTarget = (handleClick) => {
    if (!handleClick) {
      return { onClick: NOOP, onMousedown: NOOP, onMouseup: NOOP };
    }
    let mousedownTarget = false;
    let mouseupTarget = false;
    const onClick = (e) => {
      if (mousedownTarget && mouseupTarget) {
        handleClick(e);
      }
      mousedownTarget = mouseupTarget = false;
    };
    const onMousedown = (e) => {
      mousedownTarget = e.target === e.currentTarget;
    };
    const onMouseup = (e) => {
      mouseupTarget = e.target === e.currentTarget;
    };
    return { onClick, onMousedown, onMouseup };
  };
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
  const zIndex = vue.ref(0);
  const defaultInitialZIndex = 2e3;
  const zIndexContextKey = Symbol("zIndexContextKey");
  const useZIndex = (zIndexOverrides) => {
    const zIndexInjection = zIndexOverrides || (vue.getCurrentInstance() ? vue.inject(zIndexContextKey, void 0) : void 0);
    const initialZIndex = vue.computed(() => {
      const zIndexFromInjection = vue.unref(zIndexInjection);
      return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
    });
    const currentZIndex = vue.computed(() => initialZIndex.value + zIndex.value);
    const nextZIndex = () => {
      zIndex.value++;
      return currentZIndex.value;
    };
    return {
      initialZIndex,
      currentZIndex,
      nextZIndex
    };
  };
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
  function useGlobalComponentSettings(block, sizeFallback) {
    const config = useGlobalConfig();
    const ns = useNamespace(block, vue.computed(() => {
      var _a2;
      return ((_a2 = config.value) == null ? void 0 : _a2.namespace) || defaultNamespace;
    }));
    const locale = useLocale(vue.computed(() => {
      var _a2;
      return (_a2 = config.value) == null ? void 0 : _a2.locale;
    }));
    const zIndex2 = useZIndex(vue.computed(() => {
      var _a2;
      return ((_a2 = config.value) == null ? void 0 : _a2.zIndex) || defaultInitialZIndex;
    }));
    const size = vue.computed(() => {
      var _a2;
      return vue.unref(sizeFallback) || ((_a2 = config.value) == null ? void 0 : _a2.size) || "";
    });
    provideGlobalConfig(vue.computed(() => vue.unref(config) || {}));
    return {
      ns,
      locale,
      zIndex: zIndex2,
      size
    };
  }
  const provideGlobalConfig = (config, app, global2 = false) => {
    var _a2;
    const inSetup = !!vue.getCurrentInstance();
    const oldConfig = inSetup ? useGlobalConfig() : void 0;
    const provideFn = (_a2 = app == null ? void 0 : app.provide) != null ? _a2 : inSetup ? vue.provide : void 0;
    if (!provideFn) {
      return;
    }
    const context = vue.computed(() => {
      const cfg = vue.unref(config);
      if (!(oldConfig == null ? void 0 : oldConfig.value))
        return cfg;
      return mergeConfig(oldConfig.value, cfg);
    });
    provideFn(configProviderContextKey, context);
    provideFn(localeContextKey, vue.computed(() => context.value.locale));
    provideFn(namespaceContextKey, vue.computed(() => context.value.namespace));
    provideFn(zIndexContextKey, vue.computed(() => context.value.zIndex));
    provideFn(SIZE_INJECTION_KEY, {
      size: vue.computed(() => context.value.size || "")
    });
    if (global2 || !globalConfig.value) {
      globalConfig.value = context.value;
    }
    return context;
  };
  const mergeConfig = (a, b) => {
    var _a2;
    const keys = [.../* @__PURE__ */ new Set([...keysOf(a), ...keysOf(b)])];
    const obj = {};
    for (const key of keys) {
      obj[key] = (_a2 = b[key]) != null ? _a2 : a[key];
    }
    return obj;
  };
  const configProviderProps = buildProps({
    a11y: {
      type: Boolean,
      default: true
    },
    locale: {
      type: definePropType(Object)
    },
    size: useSizeProp,
    button: {
      type: definePropType(Object)
    },
    experimentalFeatures: {
      type: definePropType(Object)
    },
    keyboardNavigation: {
      type: Boolean,
      default: true
    },
    message: {
      type: definePropType(Object)
    },
    zIndex: Number,
    namespace: {
      type: String,
      default: "el"
    }
  });
  const messageConfig = {};
  vue.defineComponent({
    name: "ElConfigProvider",
    props: configProviderProps,
    setup(props, { slots }) {
      vue.watch(() => props.message, (val) => {
        Object.assign(messageConfig, val != null ? val : {});
      }, { immediate: true, deep: true });
      const config = provideGlobalConfig(props);
      return () => vue.renderSlot(slots, "default", { config: config == null ? void 0 : config.value });
    }
  });
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
  const __default__$6 = vue.defineComponent({
    name: "ElIcon",
    inheritAttrs: false
  });
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$6,
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
  var Icon = /* @__PURE__ */ _export_sfc$1(_sfc_main$9, [["__file", "icon.vue"]]);
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
  const _sfc_main$8 = vue.defineComponent({
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
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
  }
  var ElFocusTrap = /* @__PURE__ */ _export_sfc$1(_sfc_main$8, [["render", _sfc_render], ["__file", "focus-trap.vue"]]);
  const badgeProps = buildProps({
    value: {
      type: [String, Number],
      default: ""
    },
    max: {
      type: Number,
      default: 99
    },
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      values: ["primary", "success", "warning", "info", "danger"],
      default: "danger"
    }
  });
  const _hoisted_1$5 = ["textContent"];
  const __default__$5 = vue.defineComponent({
    name: "ElBadge"
  });
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$5,
    props: badgeProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("badge");
      const content = vue.computed(() => {
        if (props.isDot)
          return "";
        if (isNumber(props.value) && isNumber(props.max)) {
          return props.max < props.value ? `${props.max}+` : `${props.value}`;
        }
        return `${props.value}`;
      });
      expose({
        content
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(vue.unref(ns).b())
        }, [
          vue.renderSlot(_ctx.$slots, "default"),
          vue.createVNode(vue.Transition, {
            name: `${vue.unref(ns).namespace.value}-zoom-in-center`,
            persisted: ""
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createElementVNode("sup", {
                class: vue.normalizeClass([
                  vue.unref(ns).e("content"),
                  vue.unref(ns).em("content", _ctx.type),
                  vue.unref(ns).is("fixed", !!_ctx.$slots.default),
                  vue.unref(ns).is("dot", _ctx.isDot)
                ]),
                textContent: vue.toDisplayString(vue.unref(content))
              }, null, 10, _hoisted_1$5), [
                [vue.vShow, !_ctx.hidden && (vue.unref(content) || _ctx.isDot)]
              ])
            ]),
            _: 1
          }, 8, ["name"])
        ], 2);
      };
    }
  });
  var Badge = /* @__PURE__ */ _export_sfc$1(_sfc_main$7, [["__file", "badge.vue"]]);
  const ElBadge = withInstall(Badge);
  const buttonGroupContextKey = Symbol("buttonGroupContextKey");
  const useButton = (props, emit) => {
    useDeprecated({
      from: "type.text",
      replacement: "link",
      version: "3.0.0",
      scope: "props",
      ref: "https://element-plus.org/en-US/component/button.html#button-attributes"
    }, vue.computed(() => props.type === "text"));
    const buttonGroupContext = vue.inject(buttonGroupContextKey, void 0);
    const globalConfig2 = useGlobalConfig("button");
    const { form } = useFormItem();
    const _size = useFormSize(vue.computed(() => buttonGroupContext == null ? void 0 : buttonGroupContext.size));
    const _disabled = useFormDisabled();
    const _ref = vue.ref();
    const slots = vue.useSlots();
    const _type = vue.computed(() => props.type || (buttonGroupContext == null ? void 0 : buttonGroupContext.type) || "");
    const autoInsertSpace = vue.computed(() => {
      var _a2, _b, _c;
      return (_c = (_b = props.autoInsertSpace) != null ? _b : (_a2 = globalConfig2.value) == null ? void 0 : _a2.autoInsertSpace) != null ? _c : false;
    });
    const _props = vue.computed(() => {
      if (props.tag === "button") {
        return {
          ariaDisabled: _disabled.value || props.loading,
          disabled: _disabled.value || props.loading,
          autofocus: props.autofocus,
          type: props.nativeType
        };
      }
      return {};
    });
    const shouldAddSpace = vue.computed(() => {
      var _a2;
      const defaultSlot = (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
      if (autoInsertSpace.value && (defaultSlot == null ? void 0 : defaultSlot.length) === 1) {
        const slot = defaultSlot[0];
        if ((slot == null ? void 0 : slot.type) === vue.Text) {
          const text = slot.children;
          return /^\p{Unified_Ideograph}{2}$/u.test(text.trim());
        }
      }
      return false;
    });
    const handleClick = (evt) => {
      if (props.nativeType === "reset") {
        form == null ? void 0 : form.resetFields();
      }
      emit("click", evt);
    };
    return {
      _disabled,
      _size,
      _type,
      _ref,
      _props,
      shouldAddSpace,
      handleClick
    };
  };
  const buttonTypes = [
    "default",
    "primary",
    "success",
    "warning",
    "info",
    "danger",
    "text",
    ""
  ];
  const buttonNativeTypes = ["button", "submit", "reset"];
  const buttonProps = buildProps({
    size: useSizeProp,
    disabled: Boolean,
    type: {
      type: String,
      values: buttonTypes,
      default: ""
    },
    icon: {
      type: iconPropType
    },
    nativeType: {
      type: String,
      values: buttonNativeTypes,
      default: "button"
    },
    loading: Boolean,
    loadingIcon: {
      type: iconPropType,
      default: () => loading_default
    },
    plain: Boolean,
    text: Boolean,
    link: Boolean,
    bg: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
    color: String,
    dark: Boolean,
    autoInsertSpace: {
      type: Boolean,
      default: void 0
    },
    tag: {
      type: definePropType([String, Object]),
      default: "button"
    }
  });
  const buttonEmits = {
    click: (evt) => evt instanceof MouseEvent
  };
  function bound01(n, max) {
    if (isOnePointZero(n)) {
      n = "100%";
    }
    var isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    if (isPercent) {
      n = parseInt(String(n * max), 10) / 100;
    }
    if (Math.abs(n - max) < 1e-6) {
      return 1;
    }
    if (max === 360) {
      n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
    } else {
      n = n % max / parseFloat(String(max));
    }
    return n;
  }
  function clamp01(val) {
    return Math.min(1, Math.max(0, val));
  }
  function isOnePointZero(n) {
    return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
  }
  function isPercentage(n) {
    return typeof n === "string" && n.indexOf("%") !== -1;
  }
  function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
      a = 1;
    }
    return a;
  }
  function convertToPercentage(n) {
    if (n <= 1) {
      return "".concat(Number(n) * 100, "%");
    }
    return n;
  }
  function pad2(c) {
    return c.length === 1 ? "0" + c : String(c);
  }
  function rgbToRgb(r, g, b) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b, 255) * 255
    };
  }
  function rgbToHsl(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h2 = 0;
    var s = 0;
    var l = (max + min) / 2;
    if (max === min) {
      s = 0;
      h2 = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h2 = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h2 = (b - r) / d + 2;
          break;
        case b:
          h2 = (r - g) / d + 4;
          break;
      }
      h2 /= 6;
    }
    return { h: h2, s, l };
  }
  function hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * (6 * t);
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  }
  function hslToRgb(h2, s, l) {
    var r;
    var g;
    var b;
    h2 = bound01(h2, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    if (s === 0) {
      g = l;
      b = l;
      r = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h2 + 1 / 3);
      g = hue2rgb(p, q, h2);
      b = hue2rgb(p, q, h2 - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h2 = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
      h2 = 0;
    } else {
      switch (max) {
        case r:
          h2 = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h2 = (b - r) / d + 2;
          break;
        case b:
          h2 = (r - g) / d + 4;
          break;
      }
      h2 /= 6;
    }
    return { h: h2, s, v };
  }
  function hsvToRgb(h2, s, v) {
    h2 = bound01(h2, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h2);
    var f = h2 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHex(r, g, b, allow3Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16))
    ];
    if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join("");
  }
  function rgbaToHex(r, g, b, a, allow4Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16)),
      pad2(convertDecimalToHex(a))
    ];
    if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join("");
  }
  function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
  }
  function convertHexToDecimal(h2) {
    return parseIntFromHex(h2) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  function numberInputToObject(color) {
    return {
      r: color >> 16,
      g: (color & 65280) >> 8,
      b: color & 255
    };
  }
  var names = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  };
  function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;
    if (typeof color === "string") {
      color = stringInputToObject(color);
    }
    if (typeof color === "object") {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s);
        v = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v);
        ok = true;
        format = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l);
        ok = true;
        format = "hsl";
      }
      if (Object.prototype.hasOwnProperty.call(color, "a")) {
        a = color.a;
      }
    }
    a = boundAlpha(a);
    return {
      ok,
      format: color.format || format,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a
    };
  }
  var CSS_INTEGER = "[-\\+]?\\d+%?";
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
  function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
      return false;
    }
    var named = false;
    if (names[color]) {
      color = names[color];
      named = true;
    } else if (color === "transparent") {
      return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex6.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
      };
    }
    match = matchers.hex4.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        a: convertHexToDecimal(match[4] + match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex3.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        format: named ? "name" : "hex"
      };
    }
    return false;
  }
  function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
  }
  var TinyColor = (
    /** @class */
    function() {
      function TinyColor2(color, opts) {
        if (color === void 0) {
          color = "";
        }
        if (opts === void 0) {
          opts = {};
        }
        var _a2;
        if (color instanceof TinyColor2) {
          return color;
        }
        if (typeof color === "number") {
          color = numberInputToObject(color);
        }
        this.originalInput = color;
        var rgb = inputToRGB(color);
        this.originalInput = color;
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        this.a = rgb.a;
        this.roundA = Math.round(100 * this.a) / 100;
        this.format = (_a2 = opts.format) !== null && _a2 !== void 0 ? _a2 : rgb.format;
        this.gradientType = opts.gradientType;
        if (this.r < 1) {
          this.r = Math.round(this.r);
        }
        if (this.g < 1) {
          this.g = Math.round(this.g);
        }
        if (this.b < 1) {
          this.b = Math.round(this.b);
        }
        this.isValid = rgb.ok;
      }
      TinyColor2.prototype.isDark = function() {
        return this.getBrightness() < 128;
      };
      TinyColor2.prototype.isLight = function() {
        return !this.isDark();
      };
      TinyColor2.prototype.getBrightness = function() {
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
      };
      TinyColor2.prototype.getLuminance = function() {
        var rgb = this.toRgb();
        var R;
        var G;
        var B;
        var RsRGB = rgb.r / 255;
        var GsRGB = rgb.g / 255;
        var BsRGB = rgb.b / 255;
        if (RsRGB <= 0.03928) {
          R = RsRGB / 12.92;
        } else {
          R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        }
        if (GsRGB <= 0.03928) {
          G = GsRGB / 12.92;
        } else {
          G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        }
        if (BsRGB <= 0.03928) {
          B = BsRGB / 12.92;
        } else {
          B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
      };
      TinyColor2.prototype.getAlpha = function() {
        return this.a;
      };
      TinyColor2.prototype.setAlpha = function(alpha) {
        this.a = boundAlpha(alpha);
        this.roundA = Math.round(100 * this.a) / 100;
        return this;
      };
      TinyColor2.prototype.isMonochrome = function() {
        var s = this.toHsl().s;
        return s === 0;
      };
      TinyColor2.prototype.toHsv = function() {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
      };
      TinyColor2.prototype.toHsvString = function() {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        var h2 = Math.round(hsv.h * 360);
        var s = Math.round(hsv.s * 100);
        var v = Math.round(hsv.v * 100);
        return this.a === 1 ? "hsv(".concat(h2, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h2, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toHsl = function() {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
      };
      TinyColor2.prototype.toHslString = function() {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        var h2 = Math.round(hsl.h * 360);
        var s = Math.round(hsl.s * 100);
        var l = Math.round(hsl.l * 100);
        return this.a === 1 ? "hsl(".concat(h2, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h2, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toHex = function(allow3Char) {
        if (allow3Char === void 0) {
          allow3Char = false;
        }
        return rgbToHex(this.r, this.g, this.b, allow3Char);
      };
      TinyColor2.prototype.toHexString = function(allow3Char) {
        if (allow3Char === void 0) {
          allow3Char = false;
        }
        return "#" + this.toHex(allow3Char);
      };
      TinyColor2.prototype.toHex8 = function(allow4Char) {
        if (allow4Char === void 0) {
          allow4Char = false;
        }
        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
      };
      TinyColor2.prototype.toHex8String = function(allow4Char) {
        if (allow4Char === void 0) {
          allow4Char = false;
        }
        return "#" + this.toHex8(allow4Char);
      };
      TinyColor2.prototype.toHexShortString = function(allowShortChar) {
        if (allowShortChar === void 0) {
          allowShortChar = false;
        }
        return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
      };
      TinyColor2.prototype.toRgb = function() {
        return {
          r: Math.round(this.r),
          g: Math.round(this.g),
          b: Math.round(this.b),
          a: this.a
        };
      };
      TinyColor2.prototype.toRgbString = function() {
        var r = Math.round(this.r);
        var g = Math.round(this.g);
        var b = Math.round(this.b);
        return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toPercentageRgb = function() {
        var fmt = function(x) {
          return "".concat(Math.round(bound01(x, 255) * 100), "%");
        };
        return {
          r: fmt(this.r),
          g: fmt(this.g),
          b: fmt(this.b),
          a: this.a
        };
      };
      TinyColor2.prototype.toPercentageRgbString = function() {
        var rnd = function(x) {
          return Math.round(bound01(x, 255) * 100);
        };
        return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toName = function() {
        if (this.a === 0) {
          return "transparent";
        }
        if (this.a < 1) {
          return false;
        }
        var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
        for (var _i = 0, _a2 = Object.entries(names); _i < _a2.length; _i++) {
          var _b = _a2[_i], key = _b[0], value = _b[1];
          if (hex === value) {
            return key;
          }
        }
        return false;
      };
      TinyColor2.prototype.toString = function(format) {
        var formatSet = Boolean(format);
        format = format !== null && format !== void 0 ? format : this.format;
        var formattedString = false;
        var hasAlpha = this.a < 1 && this.a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith("hex") || format === "name");
        if (needsAlphaFormat) {
          if (format === "name" && this.a === 0) {
            return this.toName();
          }
          return this.toRgbString();
        }
        if (format === "rgb") {
          formattedString = this.toRgbString();
        }
        if (format === "prgb") {
          formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
          formattedString = this.toHexString();
        }
        if (format === "hex3") {
          formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
          formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
          formattedString = this.toHex8String();
        }
        if (format === "name") {
          formattedString = this.toName();
        }
        if (format === "hsl") {
          formattedString = this.toHslString();
        }
        if (format === "hsv") {
          formattedString = this.toHsvString();
        }
        return formattedString || this.toHexString();
      };
      TinyColor2.prototype.toNumber = function() {
        return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
      };
      TinyColor2.prototype.clone = function() {
        return new TinyColor2(this.toString());
      };
      TinyColor2.prototype.lighten = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.brighten = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var rgb = this.toRgb();
        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
        return new TinyColor2(rgb);
      };
      TinyColor2.prototype.darken = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.tint = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        return this.mix("white", amount);
      };
      TinyColor2.prototype.shade = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        return this.mix("black", amount);
      };
      TinyColor2.prototype.desaturate = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.saturate = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.greyscale = function() {
        return this.desaturate(100);
      };
      TinyColor2.prototype.spin = function(amount) {
        var hsl = this.toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.mix = function(color, amount) {
        if (amount === void 0) {
          amount = 50;
        }
        var rgb1 = this.toRgb();
        var rgb2 = new TinyColor2(color).toRgb();
        var p = amount / 100;
        var rgba = {
          r: (rgb2.r - rgb1.r) * p + rgb1.r,
          g: (rgb2.g - rgb1.g) * p + rgb1.g,
          b: (rgb2.b - rgb1.b) * p + rgb1.b,
          a: (rgb2.a - rgb1.a) * p + rgb1.a
        };
        return new TinyColor2(rgba);
      };
      TinyColor2.prototype.analogous = function(results, slices) {
        if (results === void 0) {
          results = 6;
        }
        if (slices === void 0) {
          slices = 30;
        }
        var hsl = this.toHsl();
        var part = 360 / slices;
        var ret = [this];
        for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
          hsl.h = (hsl.h + part) % 360;
          ret.push(new TinyColor2(hsl));
        }
        return ret;
      };
      TinyColor2.prototype.complement = function() {
        var hsl = this.toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.monochromatic = function(results) {
        if (results === void 0) {
          results = 6;
        }
        var hsv = this.toHsv();
        var h2 = hsv.h;
        var s = hsv.s;
        var v = hsv.v;
        var res = [];
        var modification = 1 / results;
        while (results--) {
          res.push(new TinyColor2({ h: h2, s, v }));
          v = (v + modification) % 1;
        }
        return res;
      };
      TinyColor2.prototype.splitcomplement = function() {
        var hsl = this.toHsl();
        var h2 = hsl.h;
        return [
          this,
          new TinyColor2({ h: (h2 + 72) % 360, s: hsl.s, l: hsl.l }),
          new TinyColor2({ h: (h2 + 216) % 360, s: hsl.s, l: hsl.l })
        ];
      };
      TinyColor2.prototype.onBackground = function(background) {
        var fg = this.toRgb();
        var bg = new TinyColor2(background).toRgb();
        var alpha = fg.a + bg.a * (1 - fg.a);
        return new TinyColor2({
          r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
          g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
          b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
          a: alpha
        });
      };
      TinyColor2.prototype.triad = function() {
        return this.polyad(3);
      };
      TinyColor2.prototype.tetrad = function() {
        return this.polyad(4);
      };
      TinyColor2.prototype.polyad = function(n) {
        var hsl = this.toHsl();
        var h2 = hsl.h;
        var result = [this];
        var increment = 360 / n;
        for (var i = 1; i < n; i++) {
          result.push(new TinyColor2({ h: (h2 + i * increment) % 360, s: hsl.s, l: hsl.l }));
        }
        return result;
      };
      TinyColor2.prototype.equals = function(color) {
        return this.toRgbString() === new TinyColor2(color).toRgbString();
      };
      return TinyColor2;
    }()
  );
  function darken(color, amount = 20) {
    return color.mix("#141414", amount).toString();
  }
  function useButtonCustomStyle(props) {
    const _disabled = useFormDisabled();
    const ns = useNamespace("button");
    return vue.computed(() => {
      let styles = {};
      const buttonColor = props.color;
      if (buttonColor) {
        const color = new TinyColor(buttonColor);
        const activeBgColor = props.dark ? color.tint(20).toString() : darken(color, 20);
        if (props.plain) {
          styles = ns.cssVarBlock({
            "bg-color": props.dark ? darken(color, 90) : color.tint(90).toString(),
            "text-color": buttonColor,
            "border-color": props.dark ? darken(color, 50) : color.tint(50).toString(),
            "hover-text-color": `var(${ns.cssVarName("color-white")})`,
            "hover-bg-color": buttonColor,
            "hover-border-color": buttonColor,
            "active-bg-color": activeBgColor,
            "active-text-color": `var(${ns.cssVarName("color-white")})`,
            "active-border-color": activeBgColor
          });
          if (_disabled.value) {
            styles[ns.cssVarBlockName("disabled-bg-color")] = props.dark ? darken(color, 90) : color.tint(90).toString();
            styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? darken(color, 50) : color.tint(50).toString();
            styles[ns.cssVarBlockName("disabled-border-color")] = props.dark ? darken(color, 80) : color.tint(80).toString();
          }
        } else {
          const hoverBgColor = props.dark ? darken(color, 30) : color.tint(30).toString();
          const textColor = color.isDark() ? `var(${ns.cssVarName("color-white")})` : `var(${ns.cssVarName("color-black")})`;
          styles = ns.cssVarBlock({
            "bg-color": buttonColor,
            "text-color": textColor,
            "border-color": buttonColor,
            "hover-bg-color": hoverBgColor,
            "hover-text-color": textColor,
            "hover-border-color": hoverBgColor,
            "active-bg-color": activeBgColor,
            "active-border-color": activeBgColor
          });
          if (_disabled.value) {
            const disabledButtonColor = props.dark ? darken(color, 50) : color.tint(50).toString();
            styles[ns.cssVarBlockName("disabled-bg-color")] = disabledButtonColor;
            styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? "rgba(255, 255, 255, 0.5)" : `var(${ns.cssVarName("color-white")})`;
            styles[ns.cssVarBlockName("disabled-border-color")] = disabledButtonColor;
          }
        }
      }
      return styles;
    });
  }
  const __default__$4 = vue.defineComponent({
    name: "ElButton"
  });
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
    props: buttonProps,
    emits: buttonEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const buttonStyle = useButtonCustomStyle(props);
      const ns = useNamespace("button");
      const { _ref, _size, _type, _disabled, _props, shouldAddSpace, handleClick } = useButton(props, emit);
      expose({
        ref: _ref,
        size: _size,
        type: _type,
        disabled: _disabled,
        shouldAddSpace
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), vue.mergeProps({
          ref_key: "_ref",
          ref: _ref
        }, vue.unref(_props), {
          class: [
            vue.unref(ns).b(),
            vue.unref(ns).m(vue.unref(_type)),
            vue.unref(ns).m(vue.unref(_size)),
            vue.unref(ns).is("disabled", vue.unref(_disabled)),
            vue.unref(ns).is("loading", _ctx.loading),
            vue.unref(ns).is("plain", _ctx.plain),
            vue.unref(ns).is("round", _ctx.round),
            vue.unref(ns).is("circle", _ctx.circle),
            vue.unref(ns).is("text", _ctx.text),
            vue.unref(ns).is("link", _ctx.link),
            vue.unref(ns).is("has-bg", _ctx.bg)
          ],
          style: vue.unref(buttonStyle),
          onClick: vue.unref(handleClick)
        }), {
          default: vue.withCtx(() => [
            _ctx.loading ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              _ctx.$slots.loading ? vue.renderSlot(_ctx.$slots, "loading", { key: 0 }) : (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 1,
                class: vue.normalizeClass(vue.unref(ns).is("loading"))
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.loadingIcon)))
                ]),
                _: 1
              }, 8, ["class"]))
            ], 64)) : _ctx.icon || _ctx.$slots.icon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 1 }, {
              default: vue.withCtx(() => [
                _ctx.icon ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.icon), { key: 0 })) : vue.renderSlot(_ctx.$slots, "icon", { key: 1 })
              ]),
              _: 3
            })) : vue.createCommentVNode("v-if", true),
            _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 2,
              class: vue.normalizeClass({ [vue.unref(ns).em("text", "expand")]: vue.unref(shouldAddSpace) })
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 2)) : vue.createCommentVNode("v-if", true)
          ]),
          _: 3
        }, 16, ["class", "style", "onClick"]);
      };
    }
  });
  var Button = /* @__PURE__ */ _export_sfc$1(_sfc_main$6, [["__file", "button.vue"]]);
  const buttonGroupProps = {
    size: buttonProps.size,
    type: buttonProps.type
  };
  const __default__$3 = vue.defineComponent({
    name: "ElButtonGroup"
  });
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: buttonGroupProps,
    setup(__props) {
      const props = __props;
      vue.provide(buttonGroupContextKey, vue.reactive({
        size: vue.toRef(props, "size"),
        type: vue.toRef(props, "type")
      }));
      const ns = useNamespace("button");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(`${vue.unref(ns).b("group")}`)
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2);
      };
    }
  });
  var ButtonGroup = /* @__PURE__ */ _export_sfc$1(_sfc_main$5, [["__file", "button-group.vue"]]);
  const ElButton = withInstall(Button, {
    ButtonGroup
  });
  withNoopInstall(ButtonGroup);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  function getAugmentedNamespace(n) {
    if (n.__esModule)
      return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f, arguments, this.constructor);
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else
      a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  const overlayProps = buildProps({
    mask: {
      type: Boolean,
      default: true
    },
    customMaskEvent: {
      type: Boolean,
      default: false
    },
    overlayClass: {
      type: definePropType([
        String,
        Array,
        Object
      ])
    },
    zIndex: {
      type: definePropType([String, Number])
    }
  });
  const overlayEmits = {
    click: (evt) => evt instanceof MouseEvent
  };
  const BLOCK = "overlay";
  var Overlay = vue.defineComponent({
    name: "ElOverlay",
    props: overlayProps,
    emits: overlayEmits,
    setup(props, { slots, emit }) {
      const ns = useNamespace(BLOCK);
      const onMaskClick = (e) => {
        emit("click", e);
      };
      const { onClick, onMousedown, onMouseup } = useSameTarget(props.customMaskEvent ? void 0 : onMaskClick);
      return () => {
        return props.mask ? vue.createVNode("div", {
          class: [ns.b(), props.overlayClass],
          style: {
            zIndex: props.zIndex
          },
          onClick,
          onMousedown,
          onMouseup
        }, [vue.renderSlot(slots, "default")], PatchFlags.STYLE | PatchFlags.CLASS | PatchFlags.PROPS, ["onClick", "onMouseup", "onMousedown"]) : vue.h("div", {
          class: props.overlayClass,
          style: {
            zIndex: props.zIndex,
            position: "fixed",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px"
          }
        }, [vue.renderSlot(slots, "default")]);
      };
    }
  });
  const ElOverlay = Overlay;
  const dialogInjectionKey = Symbol("dialogInjectionKey");
  const dialogContentProps = buildProps({
    center: Boolean,
    alignCenter: Boolean,
    closeIcon: {
      type: iconPropType
    },
    draggable: Boolean,
    overflow: Boolean,
    fullscreen: Boolean,
    showClose: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ""
    },
    ariaLevel: {
      type: String,
      default: "2"
    }
  });
  const dialogContentEmits = {
    close: () => true
  };
  const _hoisted_1$4 = ["aria-level"];
  const _hoisted_2$3 = ["aria-label"];
  const _hoisted_3$2 = ["id"];
  const __default__$2 = vue.defineComponent({ name: "ElDialogContent" });
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: dialogContentProps,
    emits: dialogContentEmits,
    setup(__props) {
      const props = __props;
      const { t } = useLocale();
      const { Close } = CloseComponents;
      const { dialogRef, headerRef, bodyId, ns, style: style2 } = vue.inject(dialogInjectionKey);
      const { focusTrapRef } = vue.inject(FOCUS_TRAP_INJECTION_KEY);
      const dialogKls = vue.computed(() => [
        ns.b(),
        ns.is("fullscreen", props.fullscreen),
        ns.is("draggable", props.draggable),
        ns.is("align-center", props.alignCenter),
        { [ns.m("center")]: props.center }
      ]);
      const composedDialogRef = composeRefs(focusTrapRef, dialogRef);
      const draggable = vue.computed(() => props.draggable);
      const overflow = vue.computed(() => props.overflow);
      useDraggable(dialogRef, headerRef, draggable, overflow);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref: vue.unref(composedDialogRef),
          class: vue.normalizeClass(vue.unref(dialogKls)),
          style: vue.normalizeStyle(vue.unref(style2)),
          tabindex: "-1"
        }, [
          vue.createElementVNode("header", {
            ref_key: "headerRef",
            ref: headerRef,
            class: vue.normalizeClass([vue.unref(ns).e("header"), { "show-close": _ctx.showClose }])
          }, [
            vue.renderSlot(_ctx.$slots, "header", {}, () => [
              vue.createElementVNode("span", {
                role: "heading",
                "aria-level": _ctx.ariaLevel,
                class: vue.normalizeClass(vue.unref(ns).e("title"))
              }, vue.toDisplayString(_ctx.title), 11, _hoisted_1$4)
            ]),
            _ctx.showClose ? (vue.openBlock(), vue.createElementBlock("button", {
              key: 0,
              "aria-label": vue.unref(t)("el.dialog.close"),
              class: vue.normalizeClass(vue.unref(ns).e("headerbtn")),
              type: "button",
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
            }, [
              vue.createVNode(vue.unref(ElIcon), {
                class: vue.normalizeClass(vue.unref(ns).e("close"))
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.closeIcon || vue.unref(Close))))
                ]),
                _: 1
              }, 8, ["class"])
            ], 10, _hoisted_2$3)) : vue.createCommentVNode("v-if", true)
          ], 2),
          vue.createElementVNode("div", {
            id: vue.unref(bodyId),
            class: vue.normalizeClass(vue.unref(ns).e("body"))
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 10, _hoisted_3$2),
          _ctx.$slots.footer ? (vue.openBlock(), vue.createElementBlock("footer", {
            key: 0,
            class: vue.normalizeClass(vue.unref(ns).e("footer"))
          }, [
            vue.renderSlot(_ctx.$slots, "footer")
          ], 2)) : vue.createCommentVNode("v-if", true)
        ], 6);
      };
    }
  });
  var ElDialogContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$4, [["__file", "dialog-content.vue"]]);
  const dialogProps = buildProps({
    ...dialogContentProps,
    appendToBody: Boolean,
    appendTo: {
      type: definePropType(String),
      default: "body"
    },
    beforeClose: {
      type: definePropType(Function)
    },
    destroyOnClose: Boolean,
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    modal: {
      type: Boolean,
      default: true
    },
    openDelay: {
      type: Number,
      default: 0
    },
    closeDelay: {
      type: Number,
      default: 0
    },
    top: {
      type: String
    },
    modelValue: Boolean,
    modalClass: String,
    width: {
      type: [String, Number]
    },
    zIndex: {
      type: Number
    },
    trapFocus: {
      type: Boolean,
      default: false
    },
    headerAriaLevel: {
      type: String,
      default: "2"
    }
  });
  const dialogEmits = {
    open: () => true,
    opened: () => true,
    close: () => true,
    closed: () => true,
    [UPDATE_MODEL_EVENT]: (value) => isBoolean(value),
    openAutoFocus: () => true,
    closeAutoFocus: () => true
  };
  const useDialog = (props, targetRef) => {
    var _a2;
    const instance = vue.getCurrentInstance();
    const emit = instance.emit;
    const { nextZIndex } = useZIndex();
    let lastPosition = "";
    const titleId = useId();
    const bodyId = useId();
    const visible = vue.ref(false);
    const closed = vue.ref(false);
    const rendered = vue.ref(false);
    const zIndex2 = vue.ref((_a2 = props.zIndex) != null ? _a2 : nextZIndex());
    let openTimer = void 0;
    let closeTimer = void 0;
    const namespace = useGlobalConfig("namespace", defaultNamespace);
    const style2 = vue.computed(() => {
      const style22 = {};
      const varPrefix = `--${namespace.value}-dialog`;
      if (!props.fullscreen) {
        if (props.top) {
          style22[`${varPrefix}-margin-top`] = props.top;
        }
        if (props.width) {
          style22[`${varPrefix}-width`] = addUnit(props.width);
        }
      }
      return style22;
    });
    const overlayDialogStyle = vue.computed(() => {
      if (props.alignCenter) {
        return { display: "flex" };
      }
      return {};
    });
    function afterEnter() {
      emit("opened");
    }
    function afterLeave() {
      emit("closed");
      emit(UPDATE_MODEL_EVENT, false);
      if (props.destroyOnClose) {
        rendered.value = false;
      }
    }
    function beforeLeave() {
      emit("close");
    }
    function open() {
      closeTimer == null ? void 0 : closeTimer();
      openTimer == null ? void 0 : openTimer();
      if (props.openDelay && props.openDelay > 0) {
        ({ stop: openTimer } = useTimeoutFn(() => doOpen(), props.openDelay));
      } else {
        doOpen();
      }
    }
    function close() {
      openTimer == null ? void 0 : openTimer();
      closeTimer == null ? void 0 : closeTimer();
      if (props.closeDelay && props.closeDelay > 0) {
        ({ stop: closeTimer } = useTimeoutFn(() => doClose(), props.closeDelay));
      } else {
        doClose();
      }
    }
    function handleClose() {
      function hide(shouldCancel) {
        if (shouldCancel)
          return;
        closed.value = true;
        visible.value = false;
      }
      if (props.beforeClose) {
        props.beforeClose(hide);
      } else {
        close();
      }
    }
    function onModalClick() {
      if (props.closeOnClickModal) {
        handleClose();
      }
    }
    function doOpen() {
      if (!isClient)
        return;
      visible.value = true;
    }
    function doClose() {
      visible.value = false;
    }
    function onOpenAutoFocus() {
      emit("openAutoFocus");
    }
    function onCloseAutoFocus() {
      emit("closeAutoFocus");
    }
    function onFocusoutPrevented(event) {
      var _a22;
      if (((_a22 = event.detail) == null ? void 0 : _a22.focusReason) === "pointer") {
        event.preventDefault();
      }
    }
    if (props.lockScroll) {
      useLockscreen(visible);
    }
    function onCloseRequested() {
      if (props.closeOnPressEscape) {
        handleClose();
      }
    }
    vue.watch(() => props.modelValue, (val) => {
      if (val) {
        closed.value = false;
        open();
        rendered.value = true;
        zIndex2.value = isUndefined$1(props.zIndex) ? nextZIndex() : zIndex2.value++;
        vue.nextTick(() => {
          emit("open");
          if (targetRef.value) {
            targetRef.value.scrollTop = 0;
          }
        });
      } else {
        if (visible.value) {
          close();
        }
      }
    });
    vue.watch(() => props.fullscreen, (val) => {
      if (!targetRef.value)
        return;
      if (val) {
        lastPosition = targetRef.value.style.transform;
        targetRef.value.style.transform = "";
      } else {
        targetRef.value.style.transform = lastPosition;
      }
    });
    vue.onMounted(() => {
      if (props.modelValue) {
        visible.value = true;
        rendered.value = true;
        open();
      }
    });
    return {
      afterEnter,
      afterLeave,
      beforeLeave,
      handleClose,
      onModalClick,
      close,
      doClose,
      onOpenAutoFocus,
      onCloseAutoFocus,
      onCloseRequested,
      onFocusoutPrevented,
      titleId,
      bodyId,
      closed,
      style: style2,
      overlayDialogStyle,
      rendered,
      visible,
      zIndex: zIndex2
    };
  };
  const _hoisted_1$3 = ["aria-label", "aria-labelledby", "aria-describedby"];
  const __default__$1 = vue.defineComponent({
    name: "ElDialog",
    inheritAttrs: false
  });
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    props: dialogProps,
    emits: dialogEmits,
    setup(__props, { expose }) {
      const props = __props;
      const slots = vue.useSlots();
      useDeprecated({
        scope: "el-dialog",
        from: "the title slot",
        replacement: "the header slot",
        version: "3.0.0",
        ref: "https://element-plus.org/en-US/component/dialog.html#slots"
      }, vue.computed(() => !!slots.title));
      const ns = useNamespace("dialog");
      const dialogRef = vue.ref();
      const headerRef = vue.ref();
      const dialogContentRef = vue.ref();
      const {
        visible,
        titleId,
        bodyId,
        style: style2,
        overlayDialogStyle,
        rendered,
        zIndex: zIndex2,
        afterEnter,
        afterLeave,
        beforeLeave,
        handleClose,
        onModalClick,
        onOpenAutoFocus,
        onCloseAutoFocus,
        onCloseRequested,
        onFocusoutPrevented
      } = useDialog(props, dialogRef);
      vue.provide(dialogInjectionKey, {
        dialogRef,
        headerRef,
        bodyId,
        ns,
        rendered,
        style: style2
      });
      const overlayEvent = useSameTarget(onModalClick);
      const draggable = vue.computed(() => props.draggable && !props.fullscreen);
      expose({
        visible,
        dialogContentRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, {
          to: _ctx.appendTo,
          disabled: _ctx.appendTo !== "body" ? false : !_ctx.appendToBody
        }, [
          vue.createVNode(vue.Transition, {
            name: "dialog-fade",
            onAfterEnter: vue.unref(afterEnter),
            onAfterLeave: vue.unref(afterLeave),
            onBeforeLeave: vue.unref(beforeLeave),
            persisted: ""
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createVNode(vue.unref(ElOverlay), {
                "custom-mask-event": "",
                mask: _ctx.modal,
                "overlay-class": _ctx.modalClass,
                "z-index": vue.unref(zIndex2)
              }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("div", {
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-label": _ctx.title || void 0,
                    "aria-labelledby": !_ctx.title ? vue.unref(titleId) : void 0,
                    "aria-describedby": vue.unref(bodyId),
                    class: vue.normalizeClass(`${vue.unref(ns).namespace.value}-overlay-dialog`),
                    style: vue.normalizeStyle(vue.unref(overlayDialogStyle)),
                    onClick: _cache[0] || (_cache[0] = (...args) => vue.unref(overlayEvent).onClick && vue.unref(overlayEvent).onClick(...args)),
                    onMousedown: _cache[1] || (_cache[1] = (...args) => vue.unref(overlayEvent).onMousedown && vue.unref(overlayEvent).onMousedown(...args)),
                    onMouseup: _cache[2] || (_cache[2] = (...args) => vue.unref(overlayEvent).onMouseup && vue.unref(overlayEvent).onMouseup(...args))
                  }, [
                    vue.createVNode(vue.unref(ElFocusTrap), {
                      loop: "",
                      trapped: vue.unref(visible),
                      "focus-start-el": "container",
                      onFocusAfterTrapped: vue.unref(onOpenAutoFocus),
                      onFocusAfterReleased: vue.unref(onCloseAutoFocus),
                      onFocusoutPrevented: vue.unref(onFocusoutPrevented),
                      onReleaseRequested: vue.unref(onCloseRequested)
                    }, {
                      default: vue.withCtx(() => [
                        vue.unref(rendered) ? (vue.openBlock(), vue.createBlock(ElDialogContent, vue.mergeProps({
                          key: 0,
                          ref_key: "dialogContentRef",
                          ref: dialogContentRef
                        }, _ctx.$attrs, {
                          center: _ctx.center,
                          "align-center": _ctx.alignCenter,
                          "close-icon": _ctx.closeIcon,
                          draggable: vue.unref(draggable),
                          overflow: _ctx.overflow,
                          fullscreen: _ctx.fullscreen,
                          "show-close": _ctx.showClose,
                          title: _ctx.title,
                          "aria-level": _ctx.headerAriaLevel,
                          onClose: vue.unref(handleClose)
                        }), vue.createSlots({
                          header: vue.withCtx(() => [
                            !_ctx.$slots.title ? vue.renderSlot(_ctx.$slots, "header", {
                              key: 0,
                              close: vue.unref(handleClose),
                              titleId: vue.unref(titleId),
                              titleClass: vue.unref(ns).e("title")
                            }) : vue.renderSlot(_ctx.$slots, "title", { key: 1 })
                          ]),
                          default: vue.withCtx(() => [
                            vue.renderSlot(_ctx.$slots, "default")
                          ]),
                          _: 2
                        }, [
                          _ctx.$slots.footer ? {
                            name: "footer",
                            fn: vue.withCtx(() => [
                              vue.renderSlot(_ctx.$slots, "footer")
                            ])
                          } : void 0
                        ]), 1040, ["center", "align-center", "close-icon", "draggable", "overflow", "fullscreen", "show-close", "title", "aria-level", "onClose"])) : vue.createCommentVNode("v-if", true)
                      ]),
                      _: 3
                    }, 8, ["trapped", "onFocusAfterTrapped", "onFocusAfterReleased", "onFocusoutPrevented", "onReleaseRequested"])
                  ], 46, _hoisted_1$3)
                ]),
                _: 3
              }, 8, ["mask", "overlay-class", "z-index"]), [
                [vue.vShow, vue.unref(visible)]
              ])
            ]),
            _: 3
          }, 8, ["onAfterEnter", "onAfterLeave", "onBeforeLeave"])
        ], 8, ["to", "disabled"]);
      };
    }
  });
  var Dialog = /* @__PURE__ */ _export_sfc$1(_sfc_main$3, [["__file", "dialog.vue"]]);
  const ElDialog = withInstall(Dialog);
  const messageTypes = ["success", "info", "warning", "error"];
  const messageDefaults = mutable({
    customClass: "",
    center: false,
    dangerouslyUseHTMLString: false,
    duration: 3e3,
    icon: void 0,
    id: "",
    message: "",
    onClose: void 0,
    showClose: false,
    type: "info",
    offset: 16,
    zIndex: 0,
    grouping: false,
    repeatNum: 1,
    appendTo: isClient ? document.body : void 0
  });
  const messageProps = buildProps({
    customClass: {
      type: String,
      default: messageDefaults.customClass
    },
    center: {
      type: Boolean,
      default: messageDefaults.center
    },
    dangerouslyUseHTMLString: {
      type: Boolean,
      default: messageDefaults.dangerouslyUseHTMLString
    },
    duration: {
      type: Number,
      default: messageDefaults.duration
    },
    icon: {
      type: iconPropType,
      default: messageDefaults.icon
    },
    id: {
      type: String,
      default: messageDefaults.id
    },
    message: {
      type: definePropType([
        String,
        Object,
        Function
      ]),
      default: messageDefaults.message
    },
    onClose: {
      type: definePropType(Function),
      required: false
    },
    showClose: {
      type: Boolean,
      default: messageDefaults.showClose
    },
    type: {
      type: String,
      values: messageTypes,
      default: messageDefaults.type
    },
    offset: {
      type: Number,
      default: messageDefaults.offset
    },
    zIndex: {
      type: Number,
      default: messageDefaults.zIndex
    },
    grouping: {
      type: Boolean,
      default: messageDefaults.grouping
    },
    repeatNum: {
      type: Number,
      default: messageDefaults.repeatNum
    }
  });
  const messageEmits = {
    destroy: () => true
  };
  const instances = vue.shallowReactive([]);
  const getInstance = (id) => {
    const idx = instances.findIndex((instance) => instance.id === id);
    const current = instances[idx];
    let prev;
    if (idx > 0) {
      prev = instances[idx - 1];
    }
    return { current, prev };
  };
  const getLastOffset = (id) => {
    const { prev } = getInstance(id);
    if (!prev)
      return 0;
    return prev.vm.exposed.bottom.value;
  };
  const getOffsetOrSpace = (id, offset) => {
    const idx = instances.findIndex((instance) => instance.id === id);
    return idx > 0 ? 20 : offset;
  };
  const _hoisted_1$2 = ["id"];
  const _hoisted_2$2 = ["innerHTML"];
  const __default__ = vue.defineComponent({
    name: "ElMessage"
  });
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: messageProps,
    emits: messageEmits,
    setup(__props, { expose }) {
      const props = __props;
      const { Close } = TypeComponents;
      const { ns, zIndex: zIndex2 } = useGlobalComponentSettings("message");
      const { currentZIndex, nextZIndex } = zIndex2;
      const messageRef = vue.ref();
      const visible = vue.ref(false);
      const height = vue.ref(0);
      let stopTimer = void 0;
      const badgeType = vue.computed(() => props.type ? props.type === "error" ? "danger" : props.type : "info");
      const typeClass = vue.computed(() => {
        const type = props.type;
        return { [ns.bm("icon", type)]: type && TypeComponentsMap[type] };
      });
      const iconComponent = vue.computed(() => props.icon || TypeComponentsMap[props.type] || "");
      const lastOffset = vue.computed(() => getLastOffset(props.id));
      const offset = vue.computed(() => getOffsetOrSpace(props.id, props.offset) + lastOffset.value);
      const bottom = vue.computed(() => height.value + offset.value);
      const customStyle = vue.computed(() => ({
        top: `${offset.value}px`,
        zIndex: currentZIndex.value
      }));
      function startTimer() {
        if (props.duration === 0)
          return;
        ({ stop: stopTimer } = useTimeoutFn(() => {
          close();
        }, props.duration));
      }
      function clearTimer() {
        stopTimer == null ? void 0 : stopTimer();
      }
      function close() {
        visible.value = false;
      }
      function keydown({ code }) {
        if (code === EVENT_CODE.esc) {
          close();
        }
      }
      vue.onMounted(() => {
        startTimer();
        nextZIndex();
        visible.value = true;
      });
      vue.watch(() => props.repeatNum, () => {
        clearTimer();
        startTimer();
      });
      useEventListener(document, "keydown", keydown);
      useResizeObserver(messageRef, () => {
        height.value = messageRef.value.getBoundingClientRect().height;
      });
      expose({
        visible,
        bottom,
        close
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, {
          name: vue.unref(ns).b("fade"),
          onBeforeLeave: _ctx.onClose,
          onAfterLeave: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("destroy")),
          persisted: ""
        }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", {
              id: _ctx.id,
              ref_key: "messageRef",
              ref: messageRef,
              class: vue.normalizeClass([
                vue.unref(ns).b(),
                { [vue.unref(ns).m(_ctx.type)]: _ctx.type },
                vue.unref(ns).is("center", _ctx.center),
                vue.unref(ns).is("closable", _ctx.showClose),
                _ctx.customClass
              ]),
              style: vue.normalizeStyle(vue.unref(customStyle)),
              role: "alert",
              onMouseenter: clearTimer,
              onMouseleave: startTimer
            }, [
              _ctx.repeatNum > 1 ? (vue.openBlock(), vue.createBlock(vue.unref(ElBadge), {
                key: 0,
                value: _ctx.repeatNum,
                type: vue.unref(badgeType),
                class: vue.normalizeClass(vue.unref(ns).e("badge"))
              }, null, 8, ["value", "type", "class"])) : vue.createCommentVNode("v-if", true),
              vue.unref(iconComponent) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 1,
                class: vue.normalizeClass([vue.unref(ns).e("icon"), vue.unref(typeClass)])
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(iconComponent))))
                ]),
                _: 1
              }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
              vue.renderSlot(_ctx.$slots, "default", {}, () => [
                !_ctx.dangerouslyUseHTMLString ? (vue.openBlock(), vue.createElementBlock("p", {
                  key: 0,
                  class: vue.normalizeClass(vue.unref(ns).e("content"))
                }, vue.toDisplayString(_ctx.message), 3)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                  vue.createCommentVNode(" Caution here, message could've been compromised, never use user's input as message "),
                  vue.createElementVNode("p", {
                    class: vue.normalizeClass(vue.unref(ns).e("content")),
                    innerHTML: _ctx.message
                  }, null, 10, _hoisted_2$2)
                ], 2112))
              ]),
              _ctx.showClose ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 2,
                class: vue.normalizeClass(vue.unref(ns).e("closeBtn")),
                onClick: vue.withModifiers(close, ["stop"])
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(Close))
                ]),
                _: 1
              }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
            ], 46, _hoisted_1$2), [
              [vue.vShow, visible.value]
            ])
          ]),
          _: 3
        }, 8, ["name", "onBeforeLeave"]);
      };
    }
  });
  var MessageConstructor = /* @__PURE__ */ _export_sfc$1(_sfc_main$2, [["__file", "message.vue"]]);
  let seed = 1;
  const normalizeOptions = (params) => {
    const options = !params || isString(params) || vue.isVNode(params) || isFunction$1(params) ? { message: params } : params;
    const normalized = {
      ...messageDefaults,
      ...options
    };
    if (!normalized.appendTo) {
      normalized.appendTo = document.body;
    } else if (isString(normalized.appendTo)) {
      let appendTo = document.querySelector(normalized.appendTo);
      if (!isElement(appendTo)) {
        appendTo = document.body;
      }
      normalized.appendTo = appendTo;
    }
    return normalized;
  };
  const closeMessage = (instance) => {
    const idx = instances.indexOf(instance);
    if (idx === -1)
      return;
    instances.splice(idx, 1);
    const { handler } = instance;
    handler.close();
  };
  const createMessage = ({ appendTo, ...options }, context) => {
    const id = `message_${seed++}`;
    const userOnClose = options.onClose;
    const container = document.createElement("div");
    const props = {
      ...options,
      id,
      onClose: () => {
        userOnClose == null ? void 0 : userOnClose();
        closeMessage(instance);
      },
      onDestroy: () => {
        vue.render(null, container);
      }
    };
    const vnode = vue.createVNode(MessageConstructor, props, isFunction$1(props.message) || vue.isVNode(props.message) ? {
      default: isFunction$1(props.message) ? props.message : () => props.message
    } : null);
    vnode.appContext = context || message._context;
    vue.render(vnode, container);
    appendTo.appendChild(container.firstElementChild);
    const vm = vnode.component;
    const handler = {
      close: () => {
        vm.exposed.visible.value = false;
      }
    };
    const instance = {
      id,
      vnode,
      vm,
      handler,
      props: vnode.component.props
    };
    return instance;
  };
  const message = (options = {}, context) => {
    if (!isClient)
      return { close: () => void 0 };
    if (isNumber(messageConfig.max) && instances.length >= messageConfig.max) {
      return { close: () => void 0 };
    }
    const normalized = normalizeOptions(options);
    if (normalized.grouping && instances.length) {
      const instance2 = instances.find(({ vnode: vm }) => {
        var _a2;
        return ((_a2 = vm.props) == null ? void 0 : _a2.message) === normalized.message;
      });
      if (instance2) {
        instance2.props.repeatNum += 1;
        instance2.props.type = normalized.type;
        return instance2.handler;
      }
    }
    const instance = createMessage(normalized, context);
    instances.push(instance);
    return instance.handler;
  };
  messageTypes.forEach((type) => {
    message[type] = (options = {}, appContext) => {
      const normalized = normalizeOptions(options);
      return message({ ...normalized, type }, appContext);
    };
  });
  function closeAll(type) {
    for (const instance of instances) {
      if (!type || type === instance.props.type) {
        instance.handler.close();
      }
    }
  }
  message.closeAll = closeAll;
  message._context = null;
  const ElMessage = withInstallFunction(message, "$message");
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-2d09cfa9"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "modal" };
  const _hoisted_2$1 = { class: "header" };
  const _hoisted_3$1 = { class: "contentBox" };
  const _hoisted_4$1 = { class: "produce" };
  const _hoisted_5$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "1、扫描右侧公众号，点击关注！", -1));
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "2、在软件爬取者后台回复：验证码", -1));
  const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "3、在下方输入框输入获取的验证码后回车", -1));
  const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "img" }, [
    /* @__PURE__ */ vue.createElementVNode("img", {
      src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4AAQSkZJRgABAQAAAQABAAD/2wEEEAANAA0ADQANAA4ADQAOABAAEAAOABQAFgATABYAFAAeABsAGQAZABsAHgAtACAAIgAgACIAIAAtAEQAKgAyACoAKgAyACoARAA8AEkAOwA3ADsASQA8AGwAVQBLAEsAVQBsAH0AaQBjAGkAfQCXAIcAhwCXAL4AtQC+APkA+QFOEQANAA0ADQANAA4ADQAOABAAEAAOABQAFgATABYAFAAeABsAGQAZABsAHgAtACAAIgAgACIAIAAtAEQAKgAyACoAKgAyACoARAA8AEkAOwA3ADsASQA8AGwAVQBLAEsAVQBsAH0AaQBjAGkAfQCXAIcAhwCXAL4AtQC+APkA+QFO/8IAEQgBAgECAwEiAAIRAQMRAf/EADQAAAMBAQADAQAAAAAAAAAAAAAGBwUEAQMIAgEBAAMBAQEAAAAAAAAAAAAAAAQFBgMBAv/aAAwDAQACEAMQAAAApwAAAAAAAAAAAAAAAAAAAAAAAAAAAAASnC/VnIsVEJc96yqcwBuItgmZ1VVGDCq2LOivkgfRiFxWKZiybTMysTphGSTVNVFYrXMS4sUgLiAAAAEOpsyqBAwC+KbYpmo8w78FQWFbBN+5/NtZPLROgwafpzEVrF2YA8x/MVTz4Avim2KYsKzYplQW2RbLiAAAAEOp2VnDMK3sPfx+1iJppM+oaUg/OUX6fM8wHudcjQajkmLJqU3NmBWY5yXgg/La8410GnoI1i1+Bokjh+ylgAAAAGLgBvYOGPWFq6JpejMkxpoVk3yN7tHiJ1YF8l4zOWBJT6LwpeHL1VpDMGs7eKbSM3+gju9VZAMyKzTo+kgAAAAheXrqZeMvNciIPk56g+iPmL6dBHeJSUNGzKYI+kj7hVUd4lJQ0dqgZUtONNhS1nymltyeySj3m6SOUqZXSHFxAAAACHXGF2E08VQQBpfFUGpD18c09XKWD90RlnMmDQM9N73HMdl7O+fqjT70M3T2Hb7nLYljUdTKWBznD/8Agcp1rPAhzqjeSlgAAABjRqyRswD6LkA8iwFfQJDXDjc4jUBonzinT6fo3sbozN/7sNlyolhwtaq07bDp7mm4NXobB6V9HPyzy6oDVL96blSoMqwC/AAAABC9XN0TMacnCLaiOMlMs5bwceb43hF8uiTZU3fp5H6z11s5vD7eUv17WMwaXMYNMW+quu9pHQw1cupQMqWWg/SxEst90h5AAAACVYbwDP1zrNF+tRvVLZMOevBi8a0P80qivMr1f9d+j2iqHu19HlJXXLC3XkrruBL4Vl9EYvJMDVfPEvKjgzh/PWt0uYl0AAAACHbj3tEz6+kDLoU+Ey/I+CUX3qEmPpKZJ1aMFdruKILskvhgTlp0hZVeu4kYp+ZzDpGKeiGD9JI8aLIZa2XEAAAAEcwUMta2hWc0URxTRDf2bDNuX5fKOiD9KyYfEN/gZ5fPIU/J7JKGom28WKVmTwTX2WhUhM6ymzHy9DyAAAAGLzS5sGUWgZdKY6hyoX0lNDRxPf8AsWWTU1DFZFKkEzouFokfGoFWsdXgjuDbZgWr0GUTSzxWniIhNLSUsAAAAIdV5RUCWCsF8VmlUKZ6JjSyUoX0ZzCJuPIQwrKGYQ9hqkkcjMKLKCvSGv5xLjeqx82uebUBUcYlyn0kAAAAEOsEe8DQK4U9WT3MpUfsHzEVDVyqaTdkkriLDTpTocP3lP4qssxC6Q6rSkZJf9FxMvyzMmc8mXRTizvCKXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/xAAtEAACAQMCBAcAAwADAQAAAAAEBQYAAQIDFhEUFTYHEBITFyAxISUmMDRgRf/aAAgBAQABCAD/AMJJpM7XPDhBd6SWt6SWt6SWt6SWoS7ZtbM+ek0mdrnhwgsZlDs94EKVNXLNT0y4W9JLUZlDs94EKVUmkztc8OEF+0mJKXojSx96yao2YSeiBJJkxJS9EaWPvSS1vSS1vSS1vSS1vSS/ab90MqMNGAG1CSbTKLW/d4RiplhbazK9eG1+HWak0XdnvDShYzGXa54CWUxcrFXs886SsnzMlmrcuVj1YQsWQpOzUdSsaXJUQBOoKWlTM0DMZmzmzlW1ss5GG522sttW8IxUjtuuwnRNlyWkqZmgZjM2c2crWtlvIxiTol6MEYqZYW2syvXhpe1ruKLkqIAnUFL3hGKXOFjX3uRm/dDL7TfuhlUy7XY385lhbazK9eG/45pxNukMyQr1I45i+sHW5bxK/RKhXcy3ydQmzVkSdTlZZqrIDqSxqyDk+EN7XXUlW9VZDhVHI5ZDznCnM2s1WEA+cywttZlevDf8c1NO5mXl4b/jmpv3Qy+037oZVMsLbWZX85lhbazK9eG/45qb90Mq3pJa3pJaNNJPJ1CSgjSQCtMoWEumbWzOx0mkztc8OEFjModnvAhSmKZW0x0eedOWaBmSsWCRpEATplCTZwzUdN5Lekl+kywttZlevDf8c1N+6GXl4b/jmpv3Qy+037oZVvCMVvCMVvCMVJpMiPRGjC+G/wCOam/dDKkqZmgZjM2a1wsa+9cKb90MqMNGAG1CSZLa0q5PoaZyuQrR1TQ2MPABcyivDb/7FFyVEATqClpUzNAzGZs1rlY1964RclRAE6gpZsYeAC5lFLUrNr73ImhEgFagpUywttZleoQ5VqrM+e3hGK3hGK3lGKk5gp7wwkX6uoTZqyJOr4xzrPw29H78Y518Y51HI5ZDznB1CbNWRJ1TLDjGGWVRqS9A5zi6ZdVZEG1Mu12N6jUl6BznF0y6qyINpzNrNVhANeG/45qa9zMqmWHGMMsqjUlshsbxdMuqsiDadLLNFhIVRyOWQ83wdQmzVmSbTlZZorJDr44r4xzr41r44r41/wCCauGamy24UbMJPRAkkyYkpeiNLHhLtm1sy52iwRjhNUcubplqrpvI0bJ3h4uYpUJTLWvUuek4QoDwwUWvDX8c0bGkR5GoUSWCMcJqjl3h0ZqThCgPDBRd6SWt6SWo2YSeiBJJqbOGanplwt6SWozKHZ7wIUqauWanplwt6SX7FyVEATqCluXKx6sIWLIUmZqep2Nk0XdnvDShd4RilrlY09+4RclRAE6gpey5LUJTs1HUudLkqIAnUFLkgZJ6I4YZklZKvZubDc7bWW2qEd0LamyVm1ssuEaESAVqClbLktbLktRkYpeiCEIjMZdrngJZVFyVEATqClmGjADahJK1ysae9cKkqZmgZjM2ck/1Vg+iGhEgFagpX1mnczKkrPpLMc6o3JMH3OU4mvSGRIN0q3qrIcKuwqdMuqsiDfN1CbNWRJ1OWPSlhB1d+VaTbT4JKTwnpDMY21OoTZqyJOpyx6UsJOr5Kr5KpLNrNWQwNSOR9BsHx23aV/3dOVlmqsgOo5HLIec4OJt0hkSFfctpX/R1HI50HnKmvczL7Tfuhl5eGv45o2NIjyNQokI0kArTKFZOmTX2bG+cmkztc8OEFSumT5mMsaLkyxV73IzfuhlUZlDs94EKVUmkztc8OEFmWFtrMr+cI7oW14lenimoKTvABcBRZMSUvRGlj7zktJkyx6sHZs4R3Qt8pv3Qy+037oZeZclRAE6gpaVMzQMxmbPeEYreEYpKmZoGYzNnI7bqsH0RM5XIVo6pphCpHfPG10KgaN4E+51NfTbJW0W64WezktKclatfoBYaZ4Op/GHiNhe+ko1cajBooDwMoqR23XYKyRM5XIVo6ppJpMiPRGjCrUrJt73IxkYpeiCEISpmaBmMzZyT/VWD6IaESAVqClfWadzMqcselLCTq+S/49N3TLqrIg2ty2lXBJb44r4xzpzNrNVhANeG/wCOamnDczGitX2R9bUrW1tTX1MtTO1qHAz1cbZ5kAX0sMs8eFsrcbfzje17YaHXUhQerbw3t5eG/wCOamnDczGvjHOuwq+Ts6crOqqyQ67DrbVpX/eW+psaRHkahRJsneHi5ileTlMuQrSGquEu2bWzOx1SeMIl6M4kXw3/ABzRsaRHkahRLP8A6BdY2rHHjqaOFD6+nr6ds8Ne+tnYnTtjlw/m1+F7WvaO/wDWJqSyZ2vdmiibPjFLkyxV73ImxpEeRqFE70ktRy+67F9b2fGK3pJajl912Mu7DCGAG0xhvqXJUQBOoKXGDRQHgZRS1ysa+/cKb90MqSpmaBmMzZzdyra2WWBqTSZEeiNGFWpWTX3uSTOVyFaOqaZtl7RafmFjnbjQuHvF42ux0tK1tP16GpbO3po0X287Z4en0Y8Lx3+Riak0YeHuzShdlyWoSnZqLM7Gzfuhl5eG/wCOak0XdnvDShahDpcp6lzsnMFPeGEi/WadzMqdQiylYQdUaktkHOcbxvdvF7TlZZqrIDq3htb0+q7pZ0lmQDSVb1VkOFUcjlkPOcHUJs1ZEm1D+PQ3lY2te9aPDSx9eOeto6uGPu217WtnfDPPVy1NT3tS9LjenpmRdfJNvN1CbNWRJ1OoR0laSdUaktkFzK+SqdQfpC0g6o3G7Puc4ulvSWRAP2m/dDKkrpk+ZjLGk2TLFVlnIhSd4ALgKLJiSl6I0sfeklo00k8nUJKEjSIAnTKEmzhkpst5KNmEnogSSc1ICtWxxCxvWl68vV6Oc1tDhnWoz0NHSyvoX18ycLZVradsNPSypINoFrTh9fZkY9Fr1JiSl6I0sfeklreklqZYW2syv5lgjHCao5cl/wAncPoiZMserB2bP6yaLuz3hpQsI7oW0wcrFfs88IcMcJpECRg0UB4GUVaYxmhDhjhNIgSMxl2ueAllUXJUQBOoKWfp5aoZOGN7Xte9r6epnp5Wywy1fXle9E6GWeVs9PSxzwx431NTPVytfKPaWWAWrleZdyMKCkqI8jTFGouSogCdQUtKmZoGYzNnvCMVvCMVJpMiPRGjC+G/45qb90Mvs4m3SGZIV08J6QzGNt4kfiaks4soWDg0lW9VZDhVJY10Dk6SzjpCwcHykcjsh5Pjtq0r/vLZ34fzTbSRaeeGZX+WrXVKRtLLW1r3i9aClSTpY62hp6sU08rZZKXITTWK0QXUIs1ZEnUlZdJZDnVHJJi+sZU04bmY1Mu12NRuN2fc5xdLeksyQa+Mc6jkc6DznCadzMvtN+6GVRmUOz3gQpXiTa1ujVGYyiPRBElOUy5CtIaq45fddjbu5OEKA8MFFpkmWNPZsaGEMANpjDV4kYei6eo1GUR6IMopI0OetBlrKbpVinpvIw/R0rxtde8mjCMBGYWItdMlXu8lvSS+S10yU+9yKZMserB2bOZYW2syvS10yVe9YI00k8nUJKqauWSnptwkyZY9WDs2f1LkqIAnUFLqbJGbWyy4KZyuQrR1TQw0YAbUJJktrSrk+hpnK5CtHVNIzGXa54CWVNkrNrZZcE0IkArUFKjBooDwMoq0xjNCHDHCaRAkywttZleoQ5VqrM+e3hGKSpmaBmMzZyT/AFVg+iGhEgFagpUywttZlevDa/DrNSaLuz3hpQrlyserCFizZUnpM5XIVo6ppXhv+Oam/dDL7OoTZqyJOpLNrNWQwV5HI7IeT47atK/7ynKyzVWQHXYN6dMuqsiDa+Ts6jkkwfWMqa9zMqdQfpCwg7yhva661OZtZqtIC8k0Js1WDnU5WWaqyA6jkcsh5zhNe5mVOZtZqsIBrw0z9F3HklZ9JZjnV8k29HprbVpXbrlvjWo5HLIec4TTuZl9pNJna54cIKEaSAVplCsnTJr7NjYbnbay21SYkpeiNLHjd91WM63s+MVJ4wiXoziRVrpkq96wRppJ5OoSUWCMcJqjlzdMsVdN5GG522stt5QhMra2Z3OdOWaBmSsWSYkpeiNLH3pJaNNJPJ1CStnxilyZYq97kZNJna54cIL5BSd4ALgKLvSS1vSS0mTLHqwdmz+pclRAE6gpe8IxW8IxW8IxW8IxS5yraW1uRk0XdnvDShQgiTydMYWFJmamzLnZNF3Z7w0oWEd0La8SPxNUYk6JejBGKkgZJ6I4YaNcIrzfWxDhjhNIgTZclrZclrZclqSBknojhhtlyWjQiQCtQUow0YAbUJJXOFjT3+Sm/dDKjDRgBtQkmbOVjXpvI/aadzMq+Mc6+NcK+Mc6dQfpCwg6vDT9ceV41tK93dvkevkqk8J6QzGNtI43Z9ydfGOflJI3i+sFSZd0pYMDXydnXyVhSZn1VWMZTlj0pYQdUckeL6xfCa9zMqcrOqqyQ6jkcsh5zhNe5mVTLtljUbjdn3OcfjX7TfuhlUmJKXojSx96SWt6SWplhbazK9eGd7Wu48iwRjhNUcubplqrpvI1GZQ7PeBClTVyzU9MuFvSS1vSS1vSS1vSS1s+MVs+MU6cs0DMlYsSumT5mMsaLky1V73JTfuhlW9JLW9JLRppJ5OoSUldMnzMZY0kn+UsFdJGzCT0QJJP1m/dDKplhbazK/nMsLbWZXrw2vw6zUmi7s94aUKYaMANqEkrnKtp71wS5KiAJ1BS/IuSogCdQUuMxl2ueAllTZIza2WcimcrkK0dU0jBooDwMoqS8JVYPokZGKXoghCIR3Qtpg5WK/ZsdvCMVGYy7XPASyqm/dDKplhbazK9LUrJr71wjQiQCtQUr6zfuhlTlZ1VWSHXxrXxrUyx4xdjevDf8c+TmbWarCAa8N/xzTqE2asiTq+Ts6jkkwfWMqacNzMa+Sq+R621aV/3lfGtRyOWQ85wqEd0La8SPxN5yOR9BsHW2rSv+8rctpX/AEd45HOg85wdQizVkSd9pv3Qyreklreklreklo2TvDxcxSvDS9rXcefhv+OfKMBinvAxipHfanJ3SJkyx6sHZs4wGKe8DGKmyZaqst5KG522sttW9JLW9JLUbMJPRAkkwjuhbTJMsa+xY2ThCgPDBRd6SWo5fddjOtunLNAzJWLBI0iAJ0yhJs4ZqOm8lvSS/wDp/wD/xAA3EAAABQMDAgUDAwIFBQAAAAAAAQISEwMEEQUiMWOzEDJDk6MUIHMhJFGD4iNCU2BhMEFiseH/2gAIAQEACT8A/wBiXrKKGYKNB8oGoF7NIagXs0hqBezSGoF7NIXEscLNqUi9ZRQzBRoPlAvX0VyZKNBcIFxFLM/alQ1AvZpC9fRXJko0FwjwvWUUMwUaD5R9646yI2Hgj5WRDUfhpCo+suRysEXCzILjrIjYeCPlZENQ+GkNQL2aQ1AvZpDUC9mkNQL2aX3dHtJFRlFGHKwZ8njghqPxVRqnw1R0u6Q6Asn0Vx4ORBcIFkyih+TkQfKBcRSuZsUrLefKRi3ns6zI6ryRliWcLFxPeV2RoapGWKfysW8U0TN6VcOF6ysjDkRrMW8FpQfJVeS8PSzhAuJYpn7FJ5aOr3TGqfDVBldfSyTek2T8rRp5e9SFvBaUHyVXkvD0s4QLmWKV+xSeWi9jrIe5LFnysdLukOgL1lZGHIjWY1T4aouZYmv2qTh3HmIh0e0n7uj2kj+aXcLx6XdIdAaZLEzfK3lLvC8ggf6b3PFl9Sdr6z4nSf4o6vbPw1OKRuyF3CWitFKze13lU4Xs87/TY1g6vcMVopX72uw1JqF5POz02YZ4aZFKzfM7g3ePS7pDoDpdsvDoDo9pP3dHtJHS7pePS7pDoDo9pI1AvZpDUfhpCo+svDlYIuCwXAqMrIy1WCPGSwfIuJY4WbSSL1lFDMFGg+UC9fRXJko0FwgW8sTmb1Jw7nymLiC0oMjpMJeHpfysWTKyMtXIsxXillfsSryDUC9ml9nS7pDoDo9pPh0B0e0n7uj2kjVPhqjVPhqjVPhqi8fWWxqWLLhZGOgOj2ki3gtKD5KryXh6WcIFzLE1+1ScP48xEOj2kioyijDlYM+TxwQ/dfSyTek1/wCUXMF3QfLTYtbXrfygWbKKOVSIMdAXrKyMORGsxbwWlB8lV5Lw9LOEC5lia/YpOH8eYhesrIw5EazFmyijlUiDFvLFh+9KcO48ximysjDk5I8ZLJcDpd0hcxSws2qPLHDVPhqjVPhqjUD9qoKj6K42qwZcIIvu1KKRmyJ3CRrBewNY+AawXsDWC9gXk87PTZhg1KKRmyJ3CR0u4kWU87PUY1goxSs2OdhqSSP5pdwhZTzs9RjWCjFKzY52GpJI0yKVm+Z3BuHQHS7ZDpdxIs552eoxrBRilZsc7DUkkVo5Wb2u8qnC8nnZ6bMMGpxSt2Qu4SK0UrN7XeVThrHwDWC9ga0XsjV/g/vGtJ9n/oXEU0z9qVCo+suRysEXCzILjrIjYeCPlZELiWKFm1JeFJ9GpjKcmWcHnkhbRSyv3qPLW+F4+ivlMaCFtLFEzepPLhTZRRG1OTPlBH4dAWT6y+TkWQpPo1MZTkyzg88kNN+aoKbKKI2pyZ8oIxqBezSGofDSFR9ZcjlYIuFmXhcRSyu2JUNQL2aQvX0VyZKNBcIFxFLM/alQ1AvZpfdesrIw5EazFxPeV2RoapGWKfysW8UsLNyVCyfRXHg5EFwgap8NUXMsTX7VJw/jzEL1lZGHIjWY08vepChFLEzelXkF6ysjDkRrMU31lxtTki4WRi3ilczelWW8+Ux1e6Y63aULeWOZ+4kimysjDk5I8ZLJcDTy96kNP+akER1kSPLJHyszFkyih+TkQfKPC9ZWRhyI1mKjKKMOVgz5PHBC5lia/apOHceYvC3gtKD5KryXh6WcIH7r6WSb02yfkFNlZGHJyR4yWS4+7pdshRlifsczLkmkWUEDPUfl40yWJm+VvKXCtFK/e12GpNQxfle/0WQijFKzY52GpJPjqcUjdkLuEtFGWJmxzcvU0Ysfof6z5hZ/VfS+s+J0v+KNTlifsibylvhqUUjNkTuEijLEzY5uXqaNFT7w0VPvDTYpH75XcJFlPO/1GYYLz6X6n0WSsj2CtFKze13lU4Xk88fpswwaZLEzfK3lLhZFa/Veu+Vse8Xk87PTZhg6fbL7uj2k+HQFk+svk5FkKjKyMtVgjxksHyLiWJzNiU4dz5S+y9ZRQzBRoPlAuJ7Os+SkwkZYl/KBbxSNfvUrLePMZjo9pIvX0VyZKNBcI8L1lFDMFGg+UDpd0vHrdpQ64vGUUcJjQYXHWRGw8EfKyIah8NIW895XfItykZYpnCB1u0rw6PaT93R7SfG9ZWRhyI1mLeC0oPkqvJeHpZwgap8NUap8NUW8FpQfJVeS8PSzhA/dfSyTemyT8guYLug+Wmxa2vW/lAsiQRn5zqoF+laq7HZJuGC7QL8kStysv1w1RKGtmNQStNJ2FH/5qNQuEKUPIUxGfhUZRRI5WDPlBkP3R20k3ptk484uYLug+Wmxa2vW/lAvH1lsaliy4WRi3lia/elOHceYwiOsiR5ZI+VmYt4LSg+Sq8l4elnCB+6+lkm9Nsn5BTZWRhyckeMlkuPu6XbIUZYmbHNy5TRo3zijFKzY52GpJIsitfqfXfK2PeNY+AawXsDTIpWb5XcKcOgOl2yH+VBmFZM/A2JPgsfqYqEZJLJkf6eB4MhUaozST8OwZHnI1n4P7/DoDpdshrBewMX5Xv8ARZCNHL3xWilZhbXeVThi/K9/oshF4VqVz6DJWR7Pusn1l8nIshePor5TGgvG2gu6DIqj1ra9bOFi4ljiZsSjl3hZR1kMap6z5WOgLJ9ZfJyLIf6Z+GNyyzn+C5CyUXBmQomSMfos18qL+C/gfqR+H+oQvWUURtKNB8oGl/NVFvFK1+5Sst48xmLJ9ZfJyLIagXs0gRXX0rIfSbJ+Jo0v5qo1AvZpAiujtY4fSbJ+Jopsooy1OTPk88n916ysjDkRrMVGUUSOVgz5QZC5lia/apOH8eYh0e0kW8FpQfJVeS8PSzhAuZYpn7FJ5b4Xj6y2NSxZcLIxbyxNfvSjDuPMZC5gu6D5abFra9b+UCvKSEYUbVJBkX/rILBU0mYrrR/wRGbhTWkkknD+THCz8v8ABjn9R/qELJ9FcbTkQXCBp5e9SFvFNEzelXDh0e0nw6Asn0Vx4ORBcI8LmKWJmxSuHCo+iuNqsGXCCL7ul2yGpyxM2Qt5U0WU87PUY1gvStfqvRZKyPYK0UrN7XeVThrPwf3itLEze1mXJJQrRSv3tdhqTULyednpswwanFK3ZC7hLfGocqP0STf0Uk+c4IIUWFEaVETiz/JYBGsy5NWC/X+McgicX6Fj9UkX/ci8Kb4jJTctyNF+fx1KKRmyJ3CRqUsTNkTcvMWc87PUZhg0VPvDU5YmbIm+cxeQQM9N+XitLEze1uXJJX3dHtJFxPZ1nyUmEjLEv5QLaKWZ+5Ri8ZRRwmNBhcdZEbDwR8rIhqBezSFR9ZeHKwRcFguBZMrIy1cizFzFLM8mJV5Gio+suRysEXCzIW8SVoysnKV4GRGlLuP+SIU1Gkj3Gktv/wAMIKVRmZH+m0jCcKp/oZFkyafKv1BnlZq5/gsBDqVRZEpOTIWHyrC46yI2Hgj5WRDUPhpDUC9mkOl3S8aT6NTGU5Ms4PPJAvpTupJvVcz8ot57yu+RblIyxTOEfdZPorjwciC4QOt2lC5ilczYpWW8+UjFV9GpnCsGWcHjgxUZRRI5WDPlBkNS+GoKr6NTOFYMs4PHBiyZRQ/JyIPlHhesrIw5EazHKqZkQ5IHgyBERHykstDSP+ArcfOOAecERF/BEQLzryQ6XbIXr6y+CjWXhesrIw5EazFvBaUHyVXkvD0s4QNU+GqNU+GqLx9ZbGpYsuFkY6A6PaT92mSxM3yt5S4anLE/ZE3lLR1xpksT98rfOYrRSv3tdhqTULyed/8AkY1g0yWJ++VvnPws553+ozDBeFalc+gyVkewFkheFbqXx/KhrqRqKkU08qMhriRqKl01cGRDV0LBKOlbx5qGWHmsalFIzZE7hIoyxP2OblyTSLOCBnqPc8dLtkOl3CF5BAz03ueK0sTN7WZcklDWC9gXs87PTZhg6XbL7uj2ki9fRXJko0FwgdcWb6y3uU9ZcLMhbQXdBkVR61tetnCx+6O2jh9NsnPkFNlFEbU5M+UEfhbSxOZuUnDufKYpsooy1OTPk88n4dcWj6635ORZcLMhWmtKz5ENSjLEmvlAt4ppn7zUOTl7hi0ZVQxpyLPlZELiKRr9iVZbx5iMagXs0vC4ila/YleW8eYjFvPeV3yLcpGWKZwgdLukLiKVr9iVZbx5iFR9ZeHKwRcFguPC4illfsSryNFvPeV3yLcpGWKZwj7r1lZGHIjWfhbyxyv3pRy0XMF3QfLTYtbXrfygVGUUYcrBnyeOCH7r6WSb0mv/ACi5gu6D5abFra9b+UCyZRQ/JyIPlAt5Y5n7iSKbKyMOTkjxkslwKjKKJHKwZ8oMhqXw1BVfRqZwrBlnB44MdLukLmKWFm1R5Y4ap8NUW8FpQfJVeS8PSzhA/dfSyTem2T8gpsrIw5OSPGSyXA6XdIdAWT6K48HIguEC4nvK7I0NUjLFP5WNNP3EC5gu6D5abFra9b+UeHQHR7Sfu1OKRuyF3CWjTYpX75ncJcLOed/qMwwXpWv1XoMlbHsFaKVm9rvKpw/f/W/0WQijFKzY52GpJI0cvfFnBAz1HueOn2yGpyxM2RN85+H81e4Y02KVm+Z3CneGpxSv2RO4U0VopWb2u8qnC8nnZ6bMMHT7ZDTIpWb5XcKcOh4UZYn7HMy5JpGjfP8A2C8K1K59BkrI9g1pPsi8nnZ6bMMHS7ZfdesooZgo0HygVGVkZarBHjJYPkXEsTmbEpw7nykQ6vdMLjrIjYeCPlZECK6+ljh9Jsn4mjS/mqiyjrIY1T1nysXEUrX7Eqy3jzEKj6y8OVgi4LBcCk+jUxlOTLODzyQtopZX71HlrR1e6fhbSxQs3qTy4XEFpQZHSYS8PS/lYXHWRGw8EfKyIagXs0hUfWXhysEXBYLgaX81UW8UrX71Ky3jzGYvWUUMwUaD5R43jKKOExoMagXs0hqBezSFvPeV3yLcpGWKZwj7r1lZGHIjWY1T4ao1T4ao1T4ao1T4aouJY2v2KTh3HmIWT6K48HIguECm+svLU5IuCyfIt4pYWbiMWT6K48HIguEDrdpQ64vY6yHuSxZ8rFN9ZcbU5IuFkYP6X6qOH1XR/icKr6NTOFYMs4PHBjTy96kNPL3qQ08vepCm+suNqckXCyMaeXvUhTZWRhyckeMlkuBUZRRhysGfJ44IXMsTX7FIw7jzEQ6PaSKjKKMOVgz5PHBC4lilfsUnlv39LtkNYL2Brfwf3jWC9ganLEzZE3zmOh4Xv1X0vosidJ/hDSPn/sGip94anLE/ZE3lLReQQP8ATe541gvY8LyCCT035eK0sT97W5epw0cvfGifP/YKMUr8oc7yqaKMsTNjm5epos4IGeo9zx0+2QrRSswtrvKpwvJ54/TZhg6fbIdLuJF7BAz03ueNaT7P3dHtJC46yI2Hgj5WRDUPhpDUC9mkOl3SHQ8KT6NTGU5Ms4PPJC2illfvUeWt8L19FcmSjQXCBcRSzP2pUNQL2aQ1AvZpDUC9mkNQL2aQ0v5qo0v5qouILSgyOkwl4el/KxcT2dZ8lJhIyxL+UC3ila/epWW8eYzHR7SRqBezSGo/DSFR9ZeHKwRcFguBcT2dZ8lJhIyxL+UD9r9VJN6ro/yCo+suRysEXCzL7uj2kjpd0vHpd0h0BZPorjwciC4QKjKKMOVgz5PHBC5lia/YpOHceYiF6ysjDkRrPxvWVkYciNZiyZRQ/JyIPlAt5Y5n7kpFzBd0Hy02LW1638oFRlFEjlYM+UGQxdfSyTek2T8oRHWRI8skfKzMdbtKFzFK5mxSst58pGNU+GqLJlFD8nIg+UeHR7SR0u6Qt5Ymv3pTh3HmMU2VkYcnJHjJZLj7uj2kitFKzC2u8qnDWk+yNaT7I6XcIdDw0yKVm+V3CnDoDU4pW7In8JaNHL3xZwQM9R7njpdshoqfeGj/ADi9K1+q9BkrY9g1pPsi8nnj9NmGeHW7Sh1/Gznnf6jMMF6Vr9V6DJWx7BZlalc+u+Vke8Xk87PTZhg1KKRmyJ3Cfu6PaSNQL2aQ1AvZpDUC9mkLx9FfKY0EOh49DwpvorkcnJlwgzH7U7mSb1HR8ecW895XfItykZYpnCBTfRXI5OTLhBmLaKWV+9SstaOr3TGoF7NIah8NIVH1lyOVgi4WZDrdpQtpYnM3KTh/PlMU2UURtTkz5QRjUC9mkCK6+lZD6TZPxNFxBaUGR0mEvD0v5WLJlZGWrkWYrxSyv2JV5BqBezS/3P8A/8QAIhEAAgICAQQDAQAAAAAAAAAAAQIDBAARIRITMUEFMGAU/9oACAECAQE/AP1leuZiedAZaWrUUNLMRlX+O2D2pjx6yer2gGB2PuqyrFC7OeN58vOtm3oEkDxlWWaGde0CH34HvJyzVFLDTcEj7qaK8TqygjefI0oI5m6JCH89OUSsFgTOvA89XnJJ1sUxIoIBP3VbCxbDeDjyUpHDum2HsjCKBcsVJ361xk88ZjWOJdL+/wD/xAAiEQACAgIBBAMBAAAAAAAAAAACAwEEABEFEiEwMRNBYBT/2gAIAQMBAT8A/WXLkVoHtspyrbt2ymFJidZasXampaiNT95Uv/0F0EMROvNfrOs2FLUOy6ZziKZVqoCY6YU7LHLrMQ1VnXxzHufrKIgN4xWWwjep83ItYpyzWciWvcZxlu69KzNWw9de++cjTdaqGAe5mMrVDp3pSZRMjH15r1Qn9JBrcYtHIqWSwPQF7jeQzloQKYPQjPvffKtVwuJzi2X7/wD/2Q==",
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
        type: Number
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
          localStorage.setItem("code", codeValue.value);
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
            vue.createElementVNode("div", _hoisted_2$1, [
              vue.createElementVNode("h2", null, vue.toDisplayString(__props.title), 1),
              vue.createElementVNode("button", { onClick: closeModal }, "X")
            ]),
            vue.createElementVNode("div", _hoisted_3$1, [
              vue.createElementVNode("div", _hoisted_4$1, [
                _hoisted_5$1,
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
  const Model = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2d09cfa9"]]);
  var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const baseUrl = "https://api.softrr.cn/api/xmwav";
  const getCode = () => {
    return new Promise(function(resolve, reject) {
      _GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.softrr.cn/api/verification?id=1`,
        headers: {
          Referer: "https://api.softrr.cn/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36"
        },
        onload: function(res) {
          resolve(JSON.parse(res.response).code);
        },
        onerror: function(error) {
          console.log(error);
        }
      });
    });
  };
  const getXmwav = (name) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url: baseUrl + "?name=" + name,
        // headers: {
        //   referer: 'https://www.xmwav.com/index/search/',
        //   'content-type': 'application/x-www-form-urlencoded',
        //   'User-Agent':
        //     'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36',
        // },
        onload: function(res) {
          return resolve(JSON.parse(res.response));
        },
        onerror: function(error) {
          reject("解析失败", error);
        }
      });
    });
  };
  const wyLyricApi = () => {
    let iframe = document.getElementsByTagName("iframe")[0];
    let doc = iframe.contentWindow.document;
    var lyric = doc.getElementById("lyric-content").innerHTML;
    let name = doc.getElementsByClassName("tit")[0].innerText;
    lyric = lyric.split("</div>")[0].replace(/<br>/g, "\n");
    let blob = new Blob([lyric], { type: "text/plain" });
    let blobUrl = window.URL.createObjectURL(blob);
    _GM_download(blobUrl, name + ".txt");
  };
  const wyMusicApi = async () => {
    let iframe = document.getElementsByTagName("iframe")[0];
    let doc = iframe.contentWindow.document;
    let name = doc.querySelector(".tit>.f-ff2").innerText.toLowerCase();
    if (name.indexOf("，") != -1) {
      name = name.replace(/，/g, "");
    }
    if (name.includes("(")) {
      name = name.split("(")[0];
    }
    let pageUrl = window.location.href;
    let musicId = pageUrl.split("=")[pageUrl.split("=").length - 1];
    let resList = await getUrl(musicId);
    let linkList = await getXmwav(name);
    if (resList.status == 0) {
      let downUrl = resList.data.url;
      if (downUrl) {
        linkList["data"][0]["url"].unshift([downUrl, "直链下载"]);
      }
      return linkList;
    } else if (resList.status == 1) {
      return linkList;
    } else {
      return elementPlus.ElMessage.error("无法下载歌曲！");
    }
  };
  const getUrl = (id) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.softrr.cn/crawler/getvideourl?id=` + id,
        headers: {
          Referer: "https://www.softrr.cn/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36"
        },
        onload: function(res) {
          resolve(JSON.parse(res.response));
        }
      });
    });
  };
  function main$1() {
    var t, e, n;
    var r = [47, 172, 107, 53, 5, 9];
    var o, d = 0, h2 = 0;
    var i = 0, b = e || [], f = (t = t || {}).node || r, v = void 0 !== t.clockseq ? t.clockseq : o;
    var y = void 0 !== t.msecs ? t.msecs : (/* @__PURE__ */ new Date()).getTime(), w = void 0 !== t.nsecs ? t.nsecs : h2 + 1, dt = y - d + (w - h2) / 1e4;
    if (dt < 0 && void 0 === t.clockseq && (v = v + 1 & 16383), (dt < 0 || y > d) && void 0 === t.nsecs && (w = 0), w >= 1e4)
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    var x = (1e4 * (268435455 & (y += 122192928e5)) + w) % 4294967296;
    b[i++] = x >>> 24 & 255, b[i++] = x >>> 16 & 255, b[i++] = x >>> 8 & 255, b[i++] = 255 & x;
    var A = y / 4294967296 * 1e4 & 268435455;
    b[i++] = A >>> 8 & 255, b[i++] = 255 & A, b[i++] = A >>> 24 & 15 | 16, b[i++] = A >>> 16 & 255, b[i++] = v >>> 8 | 128, b[i++] = 255 & v;
    for (var _ = 0; _ < 6; ++_)
      b[i + _] = f[_];
    var t = b;
    for (var n = [], i = 0; i < 256; ++i)
      n[i] = (i + 256).toString(16).substr(1);
    var i = 0, r = n;
    return [r[t[i++]], r[t[i++]], r[t[i++]], r[t[i++]], "-", r[t[i++]], r[t[i++]], "-", r[t[i++]], r[t[i++]], "-", r[t[i++]], r[t[i++]], "-", r[t[i++]], r[t[i++]], r[t[i++]], r[t[i++]], r[t[i++]], r[t[i++]]].join("");
  }
  function h(t, e) {
    if (null == e || e.length <= 0)
      return null;
    for (var n = "", i = 0; i < e.length; i++)
      n += e.charCodeAt(i).toString();
    var r = Math.floor(n.length / 5), o = parseInt(n.charAt(r) + n.charAt(2 * r) + n.charAt(3 * r) + n.charAt(4 * r) + n.charAt(5 * r)), l = Math.ceil(e.length / 2), c = Math.pow(2, 31) - 1;
    if (o < 2)
      return null;
    var d = Math.round(1e9 * Math.random()) % 1e8;
    for (n += d; n.length > 10; )
      n = (parseInt(n.substring(0, 10)) + parseInt(n.substring(10, n.length))).toString();
    n = (o * n + l) % c;
    var h2 = "", f = "";
    for (i = 0; i < t.length; i++)
      f += (h2 = parseInt(t.charCodeAt(i) ^ Math.floor(n / c * 255))) < 16 ? "0" + h2.toString(16) : h2.toString(16), n = (o * n + l) % c;
    for (d = d.toString(16); d.length < 8; )
      d = "0" + d;
    return f += d;
  }
  function getSecret(e) {
    let f = "Hm_Iuvt_cdb524f42f23cer9b268564v7y735ewrq2324";
    let Secret = h(e, f);
    return Secret;
  }
  const headers$1 = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36",
    Referer: "http://www.kuwo.cn"
  };
  const getRes = async (reqId) => {
    let url = window.location.href;
    let musicId = url.split("/")[url.split("/").length - 1];
    let searchUrl = `http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${musicId}&httpsStatus=1&reqId=` + reqId;
    let searchList = await getFile(searchUrl, headers$1);
    return searchList;
  };
  const kwLyricApi = async () => {
    let reqId = main$1();
    let searchList = await getRes(reqId);
    if (searchList.status == 200) {
      let lrcList = searchList.data.lrclist;
      let lrcline = "";
      lrcList.forEach((item) => {
        lrcline += item.lineLyric + "\n";
      });
      let name = document.querySelector(".name");
      name = name.innerText;
      let blob = new Blob([lrcline], { type: "text/plain" });
      let blobUrl = window.URL.createObjectURL(blob);
      _GM_download(blobUrl, name + ".txt");
    } else {
      elementPlus.ElMessage.error("无法获取歌词！");
    }
  };
  const kwMusicApi = async () => {
    let nameList = document.querySelectorAll(".name");
    let name = nameList[0].innerText.trim();
    nameList[1].innerText;
    let url = window.location.href;
    let musicId = url.split("/")[url.split("/").length - 1];
    let reqId = main$1();
    const surl = `http://www.kuwo.cn/api/v1/www/music/playUrl?mid=${musicId}&type=music&httpsStatus=1&format=128&reqId=` + reqId;
    let coo = await getCoo(headers$1);
    headers$1["Secret"] = getSecret(coo);
    headers$1["Cookie"] = "_ga=GA1.2.43034837.1705499543; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1708051710,1708144653,1708235545,1708864196; _gid=GA1.2.371636606.1708864196; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1708870287; _ga_ETPBRPM9ML=GS1.2.1708864196.13.1.1708870287.60.0.0; Hm_Iuvt_cdb524f42f23cer9b268564v7y735ewrq2324=" + coo;
    let result = await getDown$1(surl, headers$1);
    let downUrl = "";
    let linkList = await getXmwav(name);
    if (result.code == 200) {
      downUrl = result.data.url;
      if (downUrl) {
        linkList["data"][0]["url"].unshift([downUrl, "直链下载"]);
      }
      return linkList;
    } else if (result.code == -1) {
      return linkList;
    } else {
      return elementPlus.ElMessage.error("无法下载歌曲！");
    }
  };
  const getFile = (url, headers2) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: headers2,
        // responseType: 'blob',
        onload: function(res) {
          resolve(JSON.parse(res.response));
        }
      });
    });
  };
  const getCoo = (headers2) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url: "http://www.kuwo.cn/rankList",
        headers: headers2,
        // responseType: 'blob',
        onload: function(res) {
          var cookies = res.responseHeaders;
          cookies = cookies.split(";")[0].split(":")[1].split("=")[1];
          resolve(cookies);
        }
      });
    });
  };
  const getDown$1 = (url, headers2) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: headers2,
        // responseType: 'blob',
        onload: function(res) {
          resolve(JSON.parse(res.response));
        }
      });
    });
  };
  var md5$1 = { exports: {} };
  const __viteBrowserExternal = {};
  const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$1 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  /**
   * [js-md5]{@link https://github.com/emn178/js-md5}
   *
   * @namespace md5
   * @version 0.8.3
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2023
   * @license MIT
   */
  (function(module) {
    (function() {
      var INPUT_ERROR = "input is invalid type";
      var FINALIZE_ERROR = "finalize already called";
      var WINDOW = typeof window === "object";
      var root2 = WINDOW ? window : {};
      if (root2.JS_MD5_NO_WINDOW) {
        WINDOW = false;
      }
      var WEB_WORKER = !WINDOW && typeof self === "object";
      var NODE_JS = !root2.JS_MD5_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
      if (NODE_JS) {
        root2 = commonjsGlobal;
      } else if (WEB_WORKER) {
        root2 = self;
      }
      var COMMON_JS = !root2.JS_MD5_NO_COMMON_JS && true && module.exports;
      var ARRAY_BUFFER = !root2.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
      var HEX_CHARS = "0123456789abcdef".split("");
      var EXTRA = [128, 32768, 8388608, -2147483648];
      var SHIFT = [0, 8, 16, 24];
      var OUTPUT_TYPES = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"];
      var BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
      var blocks = [], buffer8;
      if (ARRAY_BUFFER) {
        var buffer = new ArrayBuffer(68);
        buffer8 = new Uint8Array(buffer);
        blocks = new Uint32Array(buffer);
      }
      var isArray2 = Array.isArray;
      if (root2.JS_MD5_NO_NODE_JS || !isArray2) {
        isArray2 = function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
      }
      var isView = ArrayBuffer.isView;
      if (ARRAY_BUFFER && (root2.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !isView)) {
        isView = function(obj) {
          return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
      }
      var formatMessage = function(message2) {
        var type = typeof message2;
        if (type === "string") {
          return [message2, true];
        }
        if (type !== "object" || message2 === null) {
          throw new Error(INPUT_ERROR);
        }
        if (ARRAY_BUFFER && message2.constructor === ArrayBuffer) {
          return [new Uint8Array(message2), false];
        }
        if (!isArray2(message2) && !isView(message2)) {
          throw new Error(INPUT_ERROR);
        }
        return [message2, false];
      };
      var createOutputMethod = function(outputType) {
        return function(message2) {
          return new Md5(true).update(message2)[outputType]();
        };
      };
      var createMethod = function() {
        var method = createOutputMethod("hex");
        if (NODE_JS) {
          method = nodeWrap(method);
        }
        method.create = function() {
          return new Md5();
        };
        method.update = function(message2) {
          return method.create().update(message2);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createOutputMethod(type);
        }
        return method;
      };
      var nodeWrap = function(method) {
        var crypto = require$$1;
        var Buffer = require$$1.Buffer;
        var bufferFrom;
        if (Buffer.from && !root2.JS_MD5_NO_BUFFER_FROM) {
          bufferFrom = Buffer.from;
        } else {
          bufferFrom = function(message2) {
            return new Buffer(message2);
          };
        }
        var nodeMethod = function(message2) {
          if (typeof message2 === "string") {
            return crypto.createHash("md5").update(message2, "utf8").digest("hex");
          } else {
            if (message2 === null || message2 === void 0) {
              throw new Error(INPUT_ERROR);
            } else if (message2.constructor === ArrayBuffer) {
              message2 = new Uint8Array(message2);
            }
          }
          if (isArray2(message2) || isView(message2) || message2.constructor === Buffer) {
            return crypto.createHash("md5").update(bufferFrom(message2)).digest("hex");
          } else {
            return method(message2);
          }
        };
        return nodeMethod;
      };
      var createHmacOutputMethod = function(outputType) {
        return function(key, message2) {
          return new HmacMd5(key, true).update(message2)[outputType]();
        };
      };
      var createHmacMethod = function() {
        var method = createHmacOutputMethod("hex");
        method.create = function(key) {
          return new HmacMd5(key);
        };
        method.update = function(key, message2) {
          return method.create(key).update(message2);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createHmacOutputMethod(type);
        }
        return method;
      };
      function Md5(sharedMemory) {
        if (sharedMemory) {
          blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          this.blocks = blocks;
          this.buffer8 = buffer8;
        } else {
          if (ARRAY_BUFFER) {
            var buffer2 = new ArrayBuffer(68);
            this.buffer8 = new Uint8Array(buffer2);
            this.blocks = new Uint32Array(buffer2);
          } else {
            this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          }
        }
        this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
      }
      Md5.prototype.update = function(message2) {
        if (this.finalized) {
          throw new Error(FINALIZE_ERROR);
        }
        var result = formatMessage(message2);
        message2 = result[0];
        var isString2 = result[1];
        var code, index = 0, i, length = message2.length, blocks2 = this.blocks;
        var buffer82 = this.buffer8;
        while (index < length) {
          if (this.hashed) {
            this.hashed = false;
            blocks2[0] = blocks2[16];
            blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          if (isString2) {
            if (ARRAY_BUFFER) {
              for (i = this.start; index < length && i < 64; ++index) {
                code = message2.charCodeAt(index);
                if (code < 128) {
                  buffer82[i++] = code;
                } else if (code < 2048) {
                  buffer82[i++] = 192 | code >>> 6;
                  buffer82[i++] = 128 | code & 63;
                } else if (code < 55296 || code >= 57344) {
                  buffer82[i++] = 224 | code >>> 12;
                  buffer82[i++] = 128 | code >>> 6 & 63;
                  buffer82[i++] = 128 | code & 63;
                } else {
                  code = 65536 + ((code & 1023) << 10 | message2.charCodeAt(++index) & 1023);
                  buffer82[i++] = 240 | code >>> 18;
                  buffer82[i++] = 128 | code >>> 12 & 63;
                  buffer82[i++] = 128 | code >>> 6 & 63;
                  buffer82[i++] = 128 | code & 63;
                }
              }
            } else {
              for (i = this.start; index < length && i < 64; ++index) {
                code = message2.charCodeAt(index);
                if (code < 128) {
                  blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
                } else if (code < 2048) {
                  blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else if (code < 55296 || code >= 57344) {
                  blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else {
                  code = 65536 + ((code & 1023) << 10 | message2.charCodeAt(++index) & 1023);
                  blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                }
              }
            }
          } else {
            if (ARRAY_BUFFER) {
              for (i = this.start; index < length && i < 64; ++index) {
                buffer82[i++] = message2[index];
              }
            } else {
              for (i = this.start; index < length && i < 64; ++index) {
                blocks2[i >>> 2] |= message2[index] << SHIFT[i++ & 3];
              }
            }
          }
          this.lastByteIndex = i;
          this.bytes += i - this.start;
          if (i >= 64) {
            this.start = i - 64;
            this.hash();
            this.hashed = true;
          } else {
            this.start = i;
          }
        }
        if (this.bytes > 4294967295) {
          this.hBytes += this.bytes / 4294967296 << 0;
          this.bytes = this.bytes % 4294967296;
        }
        return this;
      };
      Md5.prototype.finalize = function() {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        var blocks2 = this.blocks, i = this.lastByteIndex;
        blocks2[i >>> 2] |= EXTRA[i & 3];
        if (i >= 56) {
          if (!this.hashed) {
            this.hash();
          }
          blocks2[0] = blocks2[16];
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        blocks2[14] = this.bytes << 3;
        blocks2[15] = this.hBytes << 3 | this.bytes >>> 29;
        this.hash();
      };
      Md5.prototype.hash = function() {
        var a, b, c, d, bc, da, blocks2 = this.blocks;
        if (this.first) {
          a = blocks2[0] - 680876937;
          a = (a << 7 | a >>> 25) - 271733879 << 0;
          d = (-1732584194 ^ a & 2004318071) + blocks2[1] - 117830708;
          d = (d << 12 | d >>> 20) + a << 0;
          c = (-271733879 ^ d & (a ^ -271733879)) + blocks2[2] - 1126478375;
          c = (c << 17 | c >>> 15) + d << 0;
          b = (a ^ c & (d ^ a)) + blocks2[3] - 1316259209;
          b = (b << 22 | b >>> 10) + c << 0;
        } else {
          a = this.h0;
          b = this.h1;
          c = this.h2;
          d = this.h3;
          a += (d ^ b & (c ^ d)) + blocks2[0] - 680876936;
          a = (a << 7 | a >>> 25) + b << 0;
          d += (c ^ a & (b ^ c)) + blocks2[1] - 389564586;
          d = (d << 12 | d >>> 20) + a << 0;
          c += (b ^ d & (a ^ b)) + blocks2[2] + 606105819;
          c = (c << 17 | c >>> 15) + d << 0;
          b += (a ^ c & (d ^ a)) + blocks2[3] - 1044525330;
          b = (b << 22 | b >>> 10) + c << 0;
        }
        a += (d ^ b & (c ^ d)) + blocks2[4] - 176418897;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[5] + 1200080426;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[6] - 1473231341;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[7] - 45705983;
        b = (b << 22 | b >>> 10) + c << 0;
        a += (d ^ b & (c ^ d)) + blocks2[8] + 1770035416;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[9] - 1958414417;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[10] - 42063;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[11] - 1990404162;
        b = (b << 22 | b >>> 10) + c << 0;
        a += (d ^ b & (c ^ d)) + blocks2[12] + 1804603682;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[13] - 40341101;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[14] - 1502002290;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[15] + 1236535329;
        b = (b << 22 | b >>> 10) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[1] - 165796510;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[6] - 1069501632;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[11] + 643717713;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[0] - 373897302;
        b = (b << 20 | b >>> 12) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[5] - 701558691;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[10] + 38016083;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[15] - 660478335;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[4] - 405537848;
        b = (b << 20 | b >>> 12) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[9] + 568446438;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[14] - 1019803690;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[3] - 187363961;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[8] + 1163531501;
        b = (b << 20 | b >>> 12) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[13] - 1444681467;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[2] - 51403784;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[7] + 1735328473;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[12] - 1926607734;
        b = (b << 20 | b >>> 12) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[5] - 378558;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[8] - 2022574463;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[11] + 1839030562;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[14] - 35309556;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[1] - 1530992060;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[4] + 1272893353;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[7] - 155497632;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[10] - 1094730640;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[13] + 681279174;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[0] - 358537222;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[3] - 722521979;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[6] + 76029189;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[9] - 640364487;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[12] - 421815835;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[15] + 530742520;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[2] - 995338651;
        b = (b << 23 | b >>> 9) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[0] - 198630844;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[7] + 1126891415;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[14] - 1416354905;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[5] - 57434055;
        b = (b << 21 | b >>> 11) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[12] + 1700485571;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[3] - 1894986606;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[10] - 1051523;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[1] - 2054922799;
        b = (b << 21 | b >>> 11) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[8] + 1873313359;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[15] - 30611744;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[6] - 1560198380;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[13] + 1309151649;
        b = (b << 21 | b >>> 11) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[4] - 145523070;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[11] - 1120210379;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[2] + 718787259;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[9] - 343485551;
        b = (b << 21 | b >>> 11) + c << 0;
        if (this.first) {
          this.h0 = a + 1732584193 << 0;
          this.h1 = b - 271733879 << 0;
          this.h2 = c - 1732584194 << 0;
          this.h3 = d + 271733878 << 0;
          this.first = false;
        } else {
          this.h0 = this.h0 + a << 0;
          this.h1 = this.h1 + b << 0;
          this.h2 = this.h2 + c << 0;
          this.h3 = this.h3 + d << 0;
        }
      };
      Md5.prototype.hex = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
        return HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15];
      };
      Md5.prototype.toString = Md5.prototype.hex;
      Md5.prototype.digest = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
        return [
          h0 & 255,
          h0 >>> 8 & 255,
          h0 >>> 16 & 255,
          h0 >>> 24 & 255,
          h1 & 255,
          h1 >>> 8 & 255,
          h1 >>> 16 & 255,
          h1 >>> 24 & 255,
          h2 & 255,
          h2 >>> 8 & 255,
          h2 >>> 16 & 255,
          h2 >>> 24 & 255,
          h3 & 255,
          h3 >>> 8 & 255,
          h3 >>> 16 & 255,
          h3 >>> 24 & 255
        ];
      };
      Md5.prototype.array = Md5.prototype.digest;
      Md5.prototype.arrayBuffer = function() {
        this.finalize();
        var buffer2 = new ArrayBuffer(16);
        var blocks2 = new Uint32Array(buffer2);
        blocks2[0] = this.h0;
        blocks2[1] = this.h1;
        blocks2[2] = this.h2;
        blocks2[3] = this.h3;
        return buffer2;
      };
      Md5.prototype.buffer = Md5.prototype.arrayBuffer;
      Md5.prototype.base64 = function() {
        var v1, v2, v3, base64Str = "", bytes = this.array();
        for (var i = 0; i < 15; ) {
          v1 = bytes[i++];
          v2 = bytes[i++];
          v3 = bytes[i++];
          base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] + BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] + BASE64_ENCODE_CHAR[v3 & 63];
        }
        v1 = bytes[i];
        base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[v1 << 4 & 63] + "==";
        return base64Str;
      };
      function HmacMd5(key, sharedMemory) {
        var i, result = formatMessage(key);
        key = result[0];
        if (result[1]) {
          var bytes = [], length = key.length, index = 0, code;
          for (i = 0; i < length; ++i) {
            code = key.charCodeAt(i);
            if (code < 128) {
              bytes[index++] = code;
            } else if (code < 2048) {
              bytes[index++] = 192 | code >>> 6;
              bytes[index++] = 128 | code & 63;
            } else if (code < 55296 || code >= 57344) {
              bytes[index++] = 224 | code >>> 12;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            } else {
              code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
              bytes[index++] = 240 | code >>> 18;
              bytes[index++] = 128 | code >>> 12 & 63;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            }
          }
          key = bytes;
        }
        if (key.length > 64) {
          key = new Md5(true).update(key).array();
        }
        var oKeyPad = [], iKeyPad = [];
        for (i = 0; i < 64; ++i) {
          var b = key[i] || 0;
          oKeyPad[i] = 92 ^ b;
          iKeyPad[i] = 54 ^ b;
        }
        Md5.call(this, sharedMemory);
        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
      }
      HmacMd5.prototype = new Md5();
      HmacMd5.prototype.finalize = function() {
        Md5.prototype.finalize.call(this);
        if (this.inner) {
          this.inner = false;
          var innerHash = this.array();
          Md5.call(this, this.sharedMemory);
          this.update(this.oKeyPad);
          this.update(innerHash);
          Md5.prototype.finalize.call(this);
        }
      };
      var exports = createMethod();
      exports.md5 = exports;
      exports.md5.hmac = createHmacMethod();
      if (COMMON_JS) {
        module.exports = exports;
      } else {
        root2.md5 = exports;
      }
    })();
  })(md5$1);
  var md5Exports = md5$1.exports;
  const md5 = /* @__PURE__ */ getDefaultExportFromCjs(md5Exports);
  function main(time, id) {
    let text = ["NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt", "appid=1014", "clienttime=" + time, "clientver=20000", "dfid=4FHcdO39MvA22PXpyh2y0ng0", "encode_album_audio_id=" + id, "mid=269522b7f00c30ccbadd4fb48996beac", "platid=4", "srcappid=2919", "token=", "userid=0", "uuid=269522b7f00c30ccbadd4fb48996beac", "NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt"];
    let sign = md5(text.join("")).toString();
    return sign;
  }
  const kgLyricApi = async () => {
    let content = document.querySelector(".jspPane").innerText;
    let name = document.querySelector(".audioName").innerText;
    let blob = new Blob([content], { type: "text/plain" });
    let blobUrl = window.URL.createObjectURL(blob);
    _GM_download(blobUrl, name + ".txt");
  };
  const headers = {
    cookie: "",
    authority: "complexsearch.kugou.com",
    referer: "https://www.kugou.com/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
  };
  const kgMusicApi = async () => {
    let nameList = document.querySelector(".audioName").innerText;
    if (nameList.indexOf("，") != -1) {
      nameList = nameList.replace(/，/g, "");
    }
    let nameCount = nameList.split("-");
    let name = nameList.split("-")[nameCount.length - 1].trim();
    if (name.includes("(")) {
      name = name.split("(")[0];
    }
    let author = "";
    for (let i = 0; i < nameCount.length - 1; i++) {
      author += nameCount[i].trim();
    }
    let url = window.location.href;
    let ID = url.split("/")[4].split(".")[0];
    let timer = Date.now();
    let datafrom = main(timer, ID);
    const surl = `https://wwwapi.kugou.com/play/songinfo?srcappid=2919&clientver=20000&clienttime=${timer}&mid=269522b7f00c30ccbadd4fb48996beac&uuid=269522b7f00c30ccbadd4fb48996beac&dfid=4FHcdO39MvA22PXpyh2y0ng0&appid=1014&platid=4&encode_album_audio_id=${ID}&token=&userid=0&signature=${datafrom}`;
    let response = await getDown(surl);
    console.log(response);
    let linkList = await getXmwav(name);
    if (response.status == 1) {
      let downUrl = response.data.play_backup_url;
      if (downUrl) {
        linkList["data"][0]["url"].unshift([downUrl, "直链下载"]);
      }
      return linkList;
    } else if (response.status == 0) {
      return linkList;
    } else {
      return ElMessage.error("无法下载歌曲！");
    }
  };
  const getDown = (url) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        headers,
        // responseType: 'blob',
        onload: function(res) {
          resolve(JSON.parse(res.response));
        }
      });
    });
  };
  const _hoisted_1 = { class: "dialogList" };
  const _hoisted_2 = { class: "downContainer" };
  const _hoisted_3 = ["onClick"];
  const _hoisted_4 = { class: "buttonContainer" };
  const _hoisted_5 = { class: "dialog-footer" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const code = vue.ref();
      const title = vue.ref("为了减少端口压力，防止滥用，采取必要的验证手段。");
      const model = vue.ref("");
      const locoCode = vue.ref();
      const dialogVisible = vue.ref(false);
      const downloadList = vue.ref([]);
      const btnGroupRef = vue.ref("");
      const onLyric = async () => {
        locoCode.value = localStorage.getItem("code");
        code.value = await getCode();
        if (locoCode.value == code.value) {
          let url = window.location.href;
          if (url.includes("163.com")) {
            wyLyricApi();
          } else if (url.includes("kuwo.cn")) {
            kwLyricApi();
          } else if (url.includes("kugou.com")) {
            kgLyricApi();
          }
        } else {
          model.value.openModal();
        }
      };
      const onMusic = async () => {
        locoCode.value = localStorage.getItem("code");
        activeIndex.value = null;
        downShow.value = false;
        code.value = await getCode();
        elementPlus.ElMessage.warning("由于从服务器提取数据，可能需要等待几分钟！");
        if (locoCode.value == code.value) {
          let url = window.location.href;
          if (url.includes("163.com")) {
            downloadList.value = await wyMusicApi();
            dialogVisible.value = true;
            let iframe = document.getElementsByTagName("iframe")[0];
            let doc = iframe.contentWindow.document;
            let name = doc.querySelector(".tit>.f-ff2").innerText.toLowerCase();
            dialogTitle.value = name;
          } else if (url.includes("kuwo.cn")) {
            downloadList.value = await kwMusicApi();
            dialogVisible.value = true;
            let nameList = document.querySelectorAll(".name");
            dialogTitle.value = nameList[0].innerText;
          } else if (url.includes("kugou.com")) {
            downloadList.value = await kgMusicApi();
            dialogVisible.value = true;
            let nameList = document.querySelector(".audioName").innerText;
            dialogTitle.value = nameList.split("-")[1].trim();
          }
          if (downloadList.value.code == "503") {
            dialogVisible.value = false;
            elementPlus.ElMessage.error("无法下载歌曲！");
          }
        } else {
          model.value.openModal();
        }
      };
      const dialogTitle = vue.ref("");
      const downList = vue.ref([]);
      const downShow = vue.ref(false);
      const activeIndex = vue.ref();
      const downloadClick = async (url, index, title2) => {
        downShow.value = true;
        activeIndex.value = index;
        localStorage.setItem("title", title2);
        downList.value = url;
      };
      const downClick = (url, info) => {
        if (url.includes("kugou") || url.includes("kuwo") || url.includes("126.net")) {
          if (info == "直链下载") {
            elementPlus.ElMessage.warning("直链：请确认是否是试听版本！");
          }
          let title2 = localStorage.getItem("title");
          _GM_download(url, title2);
        } else {
          if (url == "") {
            elementPlus.ElMessage.warning("没有高品质音乐下载！");
          }
          window.open(url);
        }
      };
      const handleClose = () => {
        elementPlus.ElMessageBox.confirm("确认关闭？").then(() => {
          dialogVisible.value = false;
        }).catch(() => {
        });
      };
      vue.onMounted(() => {
        let url = window.location.href;
        if (url.includes("kugou.com")) {
          document.querySelector(".content").style.zIndex = 0;
          document.querySelector(".cmhead2").style.zIndex = 0;
          document.querySelector(".lyric").style.backgroundColor = "#e4cf0e";
          document.querySelector(".lyric").style.color = "#222";
        }
      });
      return (_ctx, _cache) => {
        const _component_el_button = ElButton;
        const _component_el_dialog = ElDialog;
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "copy",
          ref_key: "btnGroupRef",
          ref: btnGroupRef
        }, [
          vue.createElementVNode("div", { class: "btngroup" }, [
            vue.createElementVNode("a", {
              onClick: onLyric,
              class: "lyric"
            }, "歌词下载"),
            vue.createElementVNode("a", {
              onClick: onMusic,
              class: "down"
            }, "音乐下载")
          ]),
          vue.createVNode(_component_el_dialog, {
            class: "dialogContainer",
            modelValue: dialogVisible.value,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => dialogVisible.value = $event),
            title: dialogTitle.value + "  下载",
            width: "600",
            "before-close": handleClose
          }, {
            footer: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_5, [
                vue.createVNode(_component_el_button, {
                  onClick: _cache[0] || (_cache[0] = ($event) => dialogVisible.value = false)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("取消")
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_button, {
                  type: "primary",
                  onClick: _cache[1] || (_cache[1] = ($event) => dialogVisible.value = false)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 确认 ")
                  ]),
                  _: 1
                })
              ])
            ]),
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1, [
                vue.createElementVNode("ul", _hoisted_2, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(downloadList.value.data, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("li", {
                      class: "down_list",
                      onClick: ($event) => downloadClick(item.url, index, item.title),
                      style: vue.normalizeStyle({ backgroundColor: activeIndex.value === index ? "#80ffff" : "white" }),
                      key: item.link
                    }, vue.toDisplayString(item.title), 13, _hoisted_3);
                  }), 128))
                ]),
                vue.createElementVNode("div", _hoisted_4, [
                  downShow.value ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(downList.value, (item) => {
                    return vue.openBlock(), vue.createBlock(_component_el_button, {
                      class: "btnClass",
                      type: "primary",
                      onClick: vue.withModifiers(($event) => downClick(item[0], item[1]), ["prevent"]),
                      key: "https://www.xmwav.com" + item[0]
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(item[1]), 1)
                      ]),
                      _: 2
                    }, 1032, ["onClick"]);
                  }), 128)) : vue.createCommentVNode("", true)
                ])
              ])
            ]),
            _: 1
          }, 8, ["modelValue", "title"]),
          vue.createVNode(Model, {
            title: title.value,
            code: code.value,
            ref_key: "model",
            ref: model
          }, null, 8, ["title", "code"])
        ], 512);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b9578a54"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue, ElementPlus);