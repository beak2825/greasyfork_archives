// ==UserScript==
// @name         智慧刷课
// @namespace    npm/vite-plugin-monkey
// @version      1.0.2
// @author       李少驾到
// @description  智慧刷课,根据职教云，浙江高等教育数学定制打造
// @license      MIT
// @icon         https://zjy2.icve.com.cn/favicon.ico
// @match        https://zjy2.icve.com.cn/*
// @match        https://www.zjooc.cn/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.27/dist/vue.global.prod.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497341/%E6%99%BA%E6%85%A7%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/497341/%E6%99%BA%E6%85%A7%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const o=document.createElement("style");o.textContent=e,document.head.append(o)})(' @charset "UTF-8";.nested-vertical-menu[data-v-366b16be]{width:100%;font-size:16px}.nested-vertical-menu ul[data-v-366b16be]{list-style-type:none;padding:0;margin:0;display:flex;justify-content:center;align-items:center}.nested-vertical-menu>ul>li[data-v-366b16be]{color:#fff;position:relative;padding:12px 16px;cursor:pointer;text-align:center;white-space:nowrap}.nested-vertical-menu>ul>li:hover ul[data-v-366b16be]{display:block}.nested-vertical-menu>ul>li span[data-v-366b16be]{display:block}.nested-vertical-menu>ul>li ul[data-v-366b16be]{color:#000;display:none;position:absolute;top:100%;left:25%;right:0;background-color:#fff;border:1px solid #ccc;padding:5px;width:100px;box-shadow:0 8px 16px #0000001a;z-index:1000}.nested-vertical-menu>ul>li ul li[data-v-366b16be]{padding:8px;cursor:pointer;text-align:left}.nested-vertical-menu>ul>li ul li[data-v-366b16be]:hover{background-color:#e0e0e0}#root[data-v-8757632a]{display:flex;justify-content:space-evenly;align-items:center;width:100%;height:100%}#root .close[data-v-8757632a]{width:15px;height:15px;background:red;border-radius:50%}#root .close[data-v-8757632a]:hover{opacity:.5}#root .hide[data-v-8757632a]{width:15px;height:15px;background:#32cd32;border-radius:50%}#root .hide[data-v-8757632a]:hover{opacity:.5}#root[data-v-06f4e12a]{display:flex;align-items:center;width:100%;height:100%}#root .title[data-v-06f4e12a]{font-size:20px;color:#fff}.header[data-v-a0289096]{width:100%;background:#4f77d3;height:40px;border-radius:10px 10px 0 0;cursor:move;display:flex;justify-content:space-between}.header .left[data-v-a0289096]{height:100%;cursor:pointer;align-items:center;display:flex;flex:0 0 70px;justify-content:flex-start}.header .left .close-menu[data-v-a0289096]{flex:0 0 70px;height:100%}.header .left .head-title[data-v-a0289096]{flex:0 0 80px;height:100%}.header .menuToggle[data-v-a0289096]{width:auto;height:100%;flex:0 0 auto}#basic-div[data-v-a3df5a87]{background:#ffffffe6;box-shadow:0 8px 32px #1f26875e;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);border-radius:10px;position:fixed;width:650px;height:380px;left:0;top:0;z-index:8888;display:flex;flex-direction:column}.content[data-v-a3df5a87]{width:100%;height:100%;padding-top:10px;overflow:hidden}:root{--el-color-white:#ffffff;--el-color-black:#000000;--el-color-primary-rgb:64,158,255;--el-color-success-rgb:103,194,58;--el-color-warning-rgb:230,162,60;--el-color-danger-rgb:245,108,108;--el-color-error-rgb:245,108,108;--el-color-info-rgb:144,147,153;--el-font-size-extra-large:20px;--el-font-size-large:18px;--el-font-size-medium:16px;--el-font-size-base:14px;--el-font-size-small:13px;--el-font-size-extra-small:12px;--el-font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\u5FAE\u8F6F\u96C5\u9ED1",Arial,sans-serif;--el-font-weight-primary:500;--el-font-line-height-primary:24px;--el-index-normal:1;--el-index-top:1000;--el-index-popper:2000;--el-border-radius-base:4px;--el-border-radius-small:2px;--el-border-radius-round:20px;--el-border-radius-circle:100%;--el-transition-duration:.3s;--el-transition-duration-fast:.2s;--el-transition-function-ease-in-out-bezier:cubic-bezier(.645,.045,.355,1);--el-transition-function-fast-bezier:cubic-bezier(.23,1,.32,1);--el-transition-all:all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);--el-transition-fade:opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-md-fade:transform var(--el-transition-duration) var(--el-transition-function-fast-bezier),opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-fade-linear:opacity var(--el-transition-duration-fast) linear;--el-transition-border:border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-box-shadow:box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-color:color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-component-size-large:40px;--el-component-size:32px;--el-component-size-small:24px}:root{color-scheme:light;--el-color-primary:#409eff;--el-color-primary-light-3:#79bbff;--el-color-primary-light-5:#a0cfff;--el-color-primary-light-7:#c6e2ff;--el-color-primary-light-8:#d9ecff;--el-color-primary-light-9:#ecf5ff;--el-color-primary-dark-2:#337ecc;--el-color-success:#67c23a;--el-color-success-light-3:#95d475;--el-color-success-light-5:#b3e19d;--el-color-success-light-7:#d1edc4;--el-color-success-light-8:#e1f3d8;--el-color-success-light-9:#f0f9eb;--el-color-success-dark-2:#529b2e;--el-color-warning:#e6a23c;--el-color-warning-light-3:#eebe77;--el-color-warning-light-5:#f3d19e;--el-color-warning-light-7:#f8e3c5;--el-color-warning-light-8:#faecd8;--el-color-warning-light-9:#fdf6ec;--el-color-warning-dark-2:#b88230;--el-color-danger:#f56c6c;--el-color-danger-light-3:#f89898;--el-color-danger-light-5:#fab6b6;--el-color-danger-light-7:#fcd3d3;--el-color-danger-light-8:#fde2e2;--el-color-danger-light-9:#fef0f0;--el-color-danger-dark-2:#c45656;--el-color-error:#f56c6c;--el-color-error-light-3:#f89898;--el-color-error-light-5:#fab6b6;--el-color-error-light-7:#fcd3d3;--el-color-error-light-8:#fde2e2;--el-color-error-light-9:#fef0f0;--el-color-error-dark-2:#c45656;--el-color-info:#909399;--el-color-info-light-3:#b1b3b8;--el-color-info-light-5:#c8c9cc;--el-color-info-light-7:#dedfe0;--el-color-info-light-8:#e9e9eb;--el-color-info-light-9:#f4f4f5;--el-color-info-dark-2:#73767a;--el-bg-color:#ffffff;--el-bg-color-page:#f2f3f5;--el-bg-color-overlay:#ffffff;--el-text-color-primary:#303133;--el-text-color-regular:#606266;--el-text-color-secondary:#909399;--el-text-color-placeholder:#a8abb2;--el-text-color-disabled:#c0c4cc;--el-border-color:#dcdfe6;--el-border-color-light:#e4e7ed;--el-border-color-lighter:#ebeef5;--el-border-color-extra-light:#f2f6fc;--el-border-color-dark:#d4d7de;--el-border-color-darker:#cdd0d6;--el-fill-color:#f0f2f5;--el-fill-color-light:#f5f7fa;--el-fill-color-lighter:#fafafa;--el-fill-color-extra-light:#fafcff;--el-fill-color-dark:#ebedf0;--el-fill-color-darker:#e6e8eb;--el-fill-color-blank:#ffffff;--el-box-shadow:0px 12px 32px 4px rgba(0,0,0,.04),0px 8px 20px rgba(0,0,0,.08);--el-box-shadow-light:0px 0px 12px rgba(0,0,0,.12);--el-box-shadow-lighter:0px 0px 6px rgba(0,0,0,.12);--el-box-shadow-dark:0px 16px 48px 16px rgba(0,0,0,.08),0px 12px 32px rgba(0,0,0,.12),0px 8px 16px -8px rgba(0,0,0,.16);--el-disabled-bg-color:var(--el-fill-color-light);--el-disabled-text-color:var(--el-text-color-placeholder);--el-disabled-border-color:var(--el-border-color-light);--el-overlay-color:rgba(0,0,0,.8);--el-overlay-color-light:rgba(0,0,0,.7);--el-overlay-color-lighter:rgba(0,0,0,.5);--el-mask-color:rgba(255,255,255,.9);--el-mask-color-extra-light:rgba(255,255,255,.3);--el-border-width:1px;--el-border-style:solid;--el-border-color-hover:var(--el-text-color-disabled);--el-border:var(--el-border-width) var(--el-border-style) var(--el-border-color);--el-svg-monochrome-grey:var(--el-border-color)}.fade-in-linear-enter-active,.fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.fade-in-linear-enter-from,.fade-in-linear-leave-to{opacity:0}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.el-fade-in-linear-enter-from,.el-fade-in-linear-leave-to{opacity:0}.el-fade-in-enter-active,.el-fade-in-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-fade-in-enter-from,.el-fade-in-leave-active{opacity:0}.el-zoom-in-center-enter-active,.el-zoom-in-center-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-zoom-in-center-enter-from,.el-zoom-in-center-leave-active{opacity:0;transform:scaleX(0)}.el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;transform:scaleY(1);transform-origin:center top;transition:var(--el-transition-md-fade)}.el-zoom-in-top-enter-active[data-popper-placement^=top],.el-zoom-in-top-leave-active[data-popper-placement^=top]{transform-origin:center bottom}.el-zoom-in-top-enter-from,.el-zoom-in-top-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-bottom-enter-active,.el-zoom-in-bottom-leave-active{opacity:1;transform:scaleY(1);transform-origin:center bottom;transition:var(--el-transition-md-fade)}.el-zoom-in-bottom-enter-from,.el-zoom-in-bottom-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-left-enter-active,.el-zoom-in-left-leave-active{opacity:1;transform:scale(1);transform-origin:top left;transition:var(--el-transition-md-fade)}.el-zoom-in-left-enter-from,.el-zoom-in-left-leave-active{opacity:0;transform:scale(.45)}.collapse-transition{transition:var(--el-transition-duration) height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.el-collapse-transition-enter-active,.el-collapse-transition-leave-active{transition:var(--el-transition-duration) max-height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.horizontal-collapse-transition{transition:var(--el-transition-duration) width ease-in-out,var(--el-transition-duration) padding-left ease-in-out,var(--el-transition-duration) padding-right ease-in-out}.el-list-enter-active,.el-list-leave-active{transition:all 1s}.el-list-enter-from,.el-list-leave-to{opacity:0;transform:translateY(-30px)}.el-list-leave-active{position:absolute!important}.el-opacity-transition{transition:opacity var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-icon-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon--right{margin-left:5px}.el-icon--left{margin-right:5px}@-webkit-keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(1turn)}}.el-icon{--color:inherit;align-items:center;display:inline-flex;height:1em;justify-content:center;line-height:1em;position:relative;width:1em;fill:currentColor;color:var(--color);font-size:inherit}.el-icon.is-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon svg{height:1em;width:1em}:root{--el-popup-modal-bg-color:var(--el-color-black);--el-popup-modal-opacity:.5}.v-modal-enter{-webkit-animation:v-modal-in var(--el-transition-duration-fast) ease;animation:v-modal-in var(--el-transition-duration-fast) ease}.v-modal-leave{-webkit-animation:v-modal-out var(--el-transition-duration-fast) ease forwards;animation:v-modal-out var(--el-transition-duration-fast) ease forwards}@-webkit-keyframes v-modal-in{0%{opacity:0}}@keyframes v-modal-in{0%{opacity:0}}@-webkit-keyframes v-modal-out{to{opacity:0}}@keyframes v-modal-out{to{opacity:0}}.v-modal{background:var(--el-popup-modal-bg-color);height:100%;left:0;opacity:var(--el-popup-modal-opacity);position:fixed;top:0;width:100%}.el-popup-parent--hidden{overflow:hidden}.el-dialog{--el-dialog-width:50%;--el-dialog-margin-top:15vh;--el-dialog-bg-color:var(--el-bg-color);--el-dialog-box-shadow:var(--el-box-shadow);--el-dialog-title-font-size:var(--el-font-size-large);--el-dialog-content-font-size:14px;--el-dialog-font-line-height:var(--el-font-line-height-primary);--el-dialog-padding-primary:16px;--el-dialog-border-radius:var(--el-border-radius-small);background:var(--el-dialog-bg-color);border-radius:var(--el-dialog-border-radius);box-shadow:var(--el-dialog-box-shadow);box-sizing:border-box;margin:var(--el-dialog-margin-top,15vh) auto 50px;overflow-wrap:break-word;padding:var(--el-dialog-padding-primary);position:relative;width:var(--el-dialog-width,50%)}.el-dialog:focus{outline:none!important}.el-dialog.is-align-center{margin:auto}.el-dialog.is-fullscreen{--el-dialog-width:100%;--el-dialog-margin-top:0;height:100%;margin-bottom:0;overflow:auto}.el-dialog__wrapper{bottom:0;left:0;margin:0;overflow:auto;position:fixed;right:0;top:0}.el-dialog.is-draggable .el-dialog__header{cursor:move;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.el-dialog__header{padding-bottom:var(--el-dialog-padding-primary)}.el-dialog__header.show-close{padding-right:calc(var(--el-dialog-padding-primary) + var(--el-message-close-size, 16px))}.el-dialog__headerbtn{background:transparent;border:none;cursor:pointer;font-size:var(--el-message-close-size,16px);height:48px;outline:none;padding:0;position:absolute;right:0;top:0;width:48px}.el-dialog__headerbtn .el-dialog__close{color:var(--el-color-info);font-size:inherit}.el-dialog__headerbtn:focus .el-dialog__close,.el-dialog__headerbtn:hover .el-dialog__close{color:var(--el-color-primary)}.el-dialog__title{color:var(--el-text-color-primary);font-size:var(--el-dialog-title-font-size);line-height:var(--el-dialog-font-line-height)}.el-dialog__body{color:var(--el-text-color-regular);font-size:var(--el-dialog-content-font-size)}.el-dialog__footer{box-sizing:border-box;padding-top:var(--el-dialog-padding-primary);text-align:right}.el-dialog--center{text-align:center}.el-dialog--center .el-dialog__body{text-align:initial}.el-dialog--center .el-dialog__footer{text-align:inherit}.el-overlay-dialog{bottom:0;left:0;overflow:auto;position:fixed;right:0;top:0}.dialog-fade-enter-active{-webkit-animation:modal-fade-in var(--el-transition-duration);animation:modal-fade-in var(--el-transition-duration)}.dialog-fade-enter-active .el-overlay-dialog{-webkit-animation:dialog-fade-in var(--el-transition-duration);animation:dialog-fade-in var(--el-transition-duration)}.dialog-fade-leave-active{-webkit-animation:modal-fade-out var(--el-transition-duration);animation:modal-fade-out var(--el-transition-duration)}.dialog-fade-leave-active .el-overlay-dialog{-webkit-animation:dialog-fade-out var(--el-transition-duration);animation:dialog-fade-out var(--el-transition-duration)}@-webkit-keyframes dialog-fade-in{0%{opacity:0;transform:translate3d(0,-20px,0)}to{opacity:1;transform:translateZ(0)}}@keyframes dialog-fade-in{0%{opacity:0;transform:translate3d(0,-20px,0)}to{opacity:1;transform:translateZ(0)}}@-webkit-keyframes dialog-fade-out{0%{opacity:1;transform:translateZ(0)}to{opacity:0;transform:translate3d(0,-20px,0)}}@keyframes dialog-fade-out{0%{opacity:1;transform:translateZ(0)}to{opacity:0;transform:translate3d(0,-20px,0)}}@-webkit-keyframes modal-fade-in{0%{opacity:0}to{opacity:1}}@keyframes modal-fade-in{0%{opacity:0}to{opacity:1}}@-webkit-keyframes modal-fade-out{0%{opacity:1}to{opacity:0}}@keyframes modal-fade-out{0%{opacity:1}to{opacity:0}}.el-overlay{background-color:var(--el-overlay-color-lighter);bottom:0;height:100%;left:0;overflow:auto;position:fixed;right:0;top:0;z-index:2000}.el-overlay .el-overlay-root{height:0}.el-form{--el-form-label-font-size:var(--el-font-size-base);--el-form-inline-content-width:220px}.el-form--label-left .el-form-item__label{justify-content:flex-start}.el-form--label-top .el-form-item{display:block}.el-form--label-top .el-form-item .el-form-item__label{display:block;height:auto;line-height:22px;margin-bottom:8px;text-align:left}.el-form--inline .el-form-item{display:inline-flex;margin-right:32px;vertical-align:middle}.el-form--inline.el-form--label-top{display:flex;flex-wrap:wrap}.el-form--inline.el-form--label-top .el-form-item{display:block}.el-form--large.el-form--label-top .el-form-item .el-form-item__label{line-height:22px;margin-bottom:12px}.el-form--default.el-form--label-top .el-form-item .el-form-item__label{line-height:22px;margin-bottom:8px}.el-form--small.el-form--label-top .el-form-item .el-form-item__label{line-height:20px;margin-bottom:4px}.el-form-item{display:flex;--font-size:14px;margin-bottom:18px}.el-form-item .el-form-item{margin-bottom:0}.el-form-item .el-input__validateIcon{display:none}.el-form-item--large{--font-size:14px;--el-form-label-font-size:var(--font-size);margin-bottom:22px}.el-form-item--large .el-form-item__label{height:40px;line-height:40px}.el-form-item--large .el-form-item__content{line-height:40px}.el-form-item--large .el-form-item__error{padding-top:4px}.el-form-item--default{--font-size:14px;--el-form-label-font-size:var(--font-size);margin-bottom:18px}.el-form-item--default .el-form-item__label{height:32px;line-height:32px}.el-form-item--default .el-form-item__content{line-height:32px}.el-form-item--default .el-form-item__error{padding-top:2px}.el-form-item--small{--font-size:12px;--el-form-label-font-size:var(--font-size);margin-bottom:18px}.el-form-item--small .el-form-item__label{height:24px;line-height:24px}.el-form-item--small .el-form-item__content{line-height:24px}.el-form-item--small .el-form-item__error{padding-top:2px}.el-form-item__label-wrap{display:flex}.el-form-item__label{align-items:flex-start;box-sizing:border-box;color:var(--el-text-color-regular);display:inline-flex;flex:0 0 auto;font-size:var(--el-form-label-font-size);height:32px;justify-content:flex-end;line-height:32px;padding:0 12px 0 0}.el-form-item__content{align-items:center;display:flex;flex:1;flex-wrap:wrap;font-size:var(--font-size);line-height:32px;min-width:0;position:relative}.el-form-item__content .el-input-group{vertical-align:top}.el-form-item__error{color:var(--el-color-danger);font-size:12px;left:0;line-height:1;padding-top:2px;position:absolute;top:100%}.el-form-item__error--inline{display:inline-block;left:auto;margin-left:10px;position:relative;top:auto}.el-form-item.is-required:not(.is-no-asterisk).asterisk-left>.el-form-item__label-wrap>.el-form-item__label:before,.el-form-item.is-required:not(.is-no-asterisk).asterisk-left>.el-form-item__label:before{color:var(--el-color-danger);content:"*";margin-right:4px}.el-form-item.is-required:not(.is-no-asterisk).asterisk-right>.el-form-item__label-wrap>.el-form-item__label:after,.el-form-item.is-required:not(.is-no-asterisk).asterisk-right>.el-form-item__label:after{color:var(--el-color-danger);content:"*";margin-left:4px}.el-form-item.is-error .el-input__wrapper,.el-form-item.is-error .el-input__wrapper.is-focus,.el-form-item.is-error .el-input__wrapper:focus,.el-form-item.is-error .el-input__wrapper:hover,.el-form-item.is-error .el-select__wrapper,.el-form-item.is-error .el-select__wrapper.is-focus,.el-form-item.is-error .el-select__wrapper:focus,.el-form-item.is-error .el-select__wrapper:hover,.el-form-item.is-error .el-textarea__inner,.el-form-item.is-error .el-textarea__inner.is-focus,.el-form-item.is-error .el-textarea__inner:focus,.el-form-item.is-error .el-textarea__inner:hover{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-form-item.is-error .el-input-group__append .el-input__wrapper,.el-form-item.is-error .el-input-group__prepend .el-input__wrapper{box-shadow:inset 0 0 0 1px transparent}.el-form-item.is-error .el-input__validateIcon{color:var(--el-color-danger)}.el-form-item--feedback .el-input__validateIcon{display:inline-flex}.el-textarea{--el-input-text-color:var(--el-text-color-regular);--el-input-border:var(--el-border);--el-input-hover-border:var(--el-border-color-hover);--el-input-focus-border:var(--el-color-primary);--el-input-transparent-border:0 0 0 1px transparent inset;--el-input-border-color:var(--el-border-color);--el-input-border-radius:var(--el-border-radius-base);--el-input-bg-color:var(--el-fill-color-blank);--el-input-icon-color:var(--el-text-color-placeholder);--el-input-placeholder-color:var(--el-text-color-placeholder);--el-input-hover-border-color:var(--el-border-color-hover);--el-input-clear-hover-color:var(--el-text-color-secondary);--el-input-focus-border-color:var(--el-color-primary);--el-input-width:100%;display:inline-block;font-size:var(--el-font-size-base);position:relative;vertical-align:bottom;width:100%}.el-textarea__inner{-webkit-appearance:none;background-color:var(--el-input-bg-color,var(--el-fill-color-blank));background-image:none;border:none;border-radius:var(--el-input-border-radius,var(--el-border-radius-base));box-shadow:0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;box-sizing:border-box;color:var(--el-input-text-color,var(--el-text-color-regular));display:block;font-family:inherit;font-size:inherit;line-height:1.5;padding:5px 11px;position:relative;resize:vertical;transition:var(--el-transition-box-shadow);width:100%}.el-textarea__inner::-moz-placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-textarea__inner:-ms-input-placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-textarea__inner::placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-textarea__inner:hover{box-shadow:0 0 0 1px var(--el-input-hover-border-color) inset}.el-textarea__inner:focus{box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset;outline:none}.el-textarea .el-input__count{background:var(--el-fill-color-blank);bottom:5px;color:var(--el-color-info);font-size:12px;line-height:14px;position:absolute;right:10px}.el-textarea.is-disabled .el-textarea__inner{background-color:var(--el-disabled-bg-color);box-shadow:0 0 0 1px var(--el-disabled-border-color) inset;color:var(--el-disabled-text-color);cursor:not-allowed}.el-textarea.is-disabled .el-textarea__inner::-moz-placeholder{color:var(--el-text-color-placeholder)}.el-textarea.is-disabled .el-textarea__inner:-ms-input-placeholder{color:var(--el-text-color-placeholder)}.el-textarea.is-disabled .el-textarea__inner::placeholder{color:var(--el-text-color-placeholder)}.el-textarea.is-exceed .el-textarea__inner{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-textarea.is-exceed .el-input__count{color:var(--el-color-danger)}.el-input{--el-input-text-color:var(--el-text-color-regular);--el-input-border:var(--el-border);--el-input-hover-border:var(--el-border-color-hover);--el-input-focus-border:var(--el-color-primary);--el-input-transparent-border:0 0 0 1px transparent inset;--el-input-border-color:var(--el-border-color);--el-input-border-radius:var(--el-border-radius-base);--el-input-bg-color:var(--el-fill-color-blank);--el-input-icon-color:var(--el-text-color-placeholder);--el-input-placeholder-color:var(--el-text-color-placeholder);--el-input-hover-border-color:var(--el-border-color-hover);--el-input-clear-hover-color:var(--el-text-color-secondary);--el-input-focus-border-color:var(--el-color-primary);--el-input-width:100%;--el-input-height:var(--el-component-size);box-sizing:border-box;display:inline-flex;font-size:var(--el-font-size-base);line-height:var(--el-input-height);position:relative;vertical-align:middle;width:var(--el-input-width)}.el-input::-webkit-scrollbar{width:6px;z-index:11}.el-input::-webkit-scrollbar:horizontal{height:6px}.el-input::-webkit-scrollbar-thumb{background:var(--el-text-color-disabled);border-radius:5px;width:6px}.el-input::-webkit-scrollbar-corner,.el-input::-webkit-scrollbar-track{background:var(--el-fill-color-blank)}.el-input::-webkit-scrollbar-track-piece{background:var(--el-fill-color-blank);width:6px}.el-input .el-input__clear,.el-input .el-input__password{color:var(--el-input-icon-color);cursor:pointer;font-size:14px}.el-input .el-input__clear:hover,.el-input .el-input__password:hover{color:var(--el-input-clear-hover-color)}.el-input .el-input__count{align-items:center;color:var(--el-color-info);display:inline-flex;font-size:12px;height:100%}.el-input .el-input__count .el-input__count-inner{background:var(--el-fill-color-blank);display:inline-block;line-height:normal;padding-left:8px}.el-input__wrapper{align-items:center;background-color:var(--el-input-bg-color,var(--el-fill-color-blank));background-image:none;border-radius:var(--el-input-border-radius,var(--el-border-radius-base));box-shadow:0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;cursor:text;display:inline-flex;flex-grow:1;justify-content:center;padding:1px 11px;transform:translateZ(0);transition:var(--el-transition-box-shadow)}.el-input__wrapper:hover{box-shadow:0 0 0 1px var(--el-input-hover-border-color) inset}.el-input__wrapper.is-focus{box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset}.el-input__inner{--el-input-inner-height:calc(var(--el-input-height, 32px) - 2px);-webkit-appearance:none;background:none;border:none;box-sizing:border-box;color:var(--el-input-text-color,var(--el-text-color-regular));flex-grow:1;font-size:inherit;height:var(--el-input-inner-height);line-height:var(--el-input-inner-height);outline:none;padding:0;width:100%}.el-input__inner:focus{outline:none}.el-input__inner::-moz-placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-input__inner:-ms-input-placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-input__inner::placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-input__inner[type=password]::-ms-reveal{display:none}.el-input__inner[type=number]{line-height:1}.el-input__prefix{color:var(--el-input-icon-color,var(--el-text-color-placeholder));display:inline-flex;flex-shrink:0;flex-wrap:nowrap;height:100%;pointer-events:none;text-align:center;transition:all var(--el-transition-duration);white-space:nowrap}.el-input__prefix-inner{align-items:center;display:inline-flex;justify-content:center;pointer-events:all}.el-input__prefix-inner>:last-child{margin-right:8px}.el-input__prefix-inner>:first-child,.el-input__prefix-inner>:first-child.el-input__icon{margin-left:0}.el-input__suffix{color:var(--el-input-icon-color,var(--el-text-color-placeholder));display:inline-flex;flex-shrink:0;flex-wrap:nowrap;height:100%;pointer-events:none;text-align:center;transition:all var(--el-transition-duration);white-space:nowrap}.el-input__suffix-inner{align-items:center;display:inline-flex;justify-content:center;pointer-events:all}.el-input__suffix-inner>:first-child{margin-left:8px}.el-input .el-input__icon{align-items:center;display:flex;height:inherit;justify-content:center;line-height:inherit;margin-left:8px;transition:all var(--el-transition-duration)}.el-input__validateIcon{pointer-events:none}.el-input.is-active .el-input__wrapper{box-shadow:0 0 0 1px var(--el-input-focus-color, ) inset}.el-input.is-disabled{cursor:not-allowed}.el-input.is-disabled .el-input__wrapper{background-color:var(--el-disabled-bg-color);box-shadow:0 0 0 1px var(--el-disabled-border-color) inset}.el-input.is-disabled .el-input__inner{color:var(--el-disabled-text-color);-webkit-text-fill-color:var(--el-disabled-text-color);cursor:not-allowed}.el-input.is-disabled .el-input__inner::-moz-placeholder{color:var(--el-text-color-placeholder)}.el-input.is-disabled .el-input__inner:-ms-input-placeholder{color:var(--el-text-color-placeholder)}.el-input.is-disabled .el-input__inner::placeholder{color:var(--el-text-color-placeholder)}.el-input.is-disabled .el-input__icon{cursor:not-allowed}.el-input.is-exceed .el-input__wrapper{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-input.is-exceed .el-input__suffix .el-input__count{color:var(--el-color-danger)}.el-input--large{--el-input-height:var(--el-component-size-large);font-size:14px}.el-input--large .el-input__wrapper{padding:1px 15px}.el-input--large .el-input__inner{--el-input-inner-height:calc(var(--el-input-height, 40px) - 2px)}.el-input--small{--el-input-height:var(--el-component-size-small);font-size:12px}.el-input--small .el-input__wrapper{padding:1px 7px}.el-input--small .el-input__inner{--el-input-inner-height:calc(var(--el-input-height, 24px) - 2px)}.el-input-group{align-items:stretch;display:inline-flex;width:100%}.el-input-group__append,.el-input-group__prepend{align-items:center;background-color:var(--el-fill-color-light);border-radius:var(--el-input-border-radius);color:var(--el-color-info);display:inline-flex;justify-content:center;min-height:100%;padding:0 20px;position:relative;white-space:nowrap}.el-input-group__append:focus,.el-input-group__prepend:focus{outline:none}.el-input-group__append .el-button,.el-input-group__append .el-select,.el-input-group__prepend .el-button,.el-input-group__prepend .el-select{display:inline-block;margin:0 -20px}.el-input-group__append button.el-button,.el-input-group__append button.el-button:hover,.el-input-group__append div.el-select .el-select__wrapper,.el-input-group__append div.el-select:hover .el-select__wrapper,.el-input-group__prepend button.el-button,.el-input-group__prepend button.el-button:hover,.el-input-group__prepend div.el-select .el-select__wrapper,.el-input-group__prepend div.el-select:hover .el-select__wrapper{background-color:transparent;border-color:transparent;color:inherit}.el-input-group__append .el-button,.el-input-group__append .el-input,.el-input-group__prepend .el-button,.el-input-group__prepend .el-input{font-size:inherit}.el-input-group__prepend{border-bottom-right-radius:0;border-right:0;border-top-right-radius:0;box-shadow:1px 0 0 0 var(--el-input-border-color) inset,0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset}.el-input-group__append{border-bottom-left-radius:0;border-left:0;border-top-left-radius:0;box-shadow:0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset,-1px 0 0 0 var(--el-input-border-color) inset}.el-input-group--prepend>.el-input__wrapper{border-bottom-left-radius:0;border-top-left-radius:0}.el-input-group--prepend .el-input-group__prepend .el-select .el-select__wrapper{border-bottom-right-radius:0;border-top-right-radius:0;box-shadow:1px 0 0 0 var(--el-input-border-color) inset,0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset}.el-input-group--append>.el-input__wrapper{border-bottom-right-radius:0;border-top-right-radius:0}.el-input-group--append .el-input-group__append .el-select .el-select__wrapper{border-bottom-left-radius:0;border-top-left-radius:0;box-shadow:0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset,-1px 0 0 0 var(--el-input-border-color) inset}.el-input-hidden{display:none!important}.el-timeline{--el-timeline-node-size-normal:12px;--el-timeline-node-size-large:14px;--el-timeline-node-color:var(--el-border-color-light);font-size:var(--el-font-size-base);list-style:none;margin:0}.el-timeline .el-timeline-item:last-child .el-timeline-item__tail{display:none}.el-timeline .el-timeline-item__center{align-items:center;display:flex}.el-timeline .el-timeline-item__center .el-timeline-item__wrapper{width:100%}.el-timeline .el-timeline-item__center .el-timeline-item__tail{top:0}.el-timeline .el-timeline-item__center:first-child .el-timeline-item__tail{height:calc(50% + 10px);top:calc(50% - 10px)}.el-timeline .el-timeline-item__center:last-child .el-timeline-item__tail{display:block;height:calc(50% - 10px)}.el-timeline-item{padding-bottom:20px;position:relative}.el-timeline-item__wrapper{padding-left:28px;position:relative;top:-3px}.el-timeline-item__tail{border-left:2px solid var(--el-timeline-node-color);height:100%;left:4px;position:absolute}.el-timeline-item .el-timeline-item__icon{color:var(--el-color-white);font-size:var(--el-font-size-small)}.el-timeline-item__node{align-items:center;background-color:var(--el-timeline-node-color);border-color:var(--el-timeline-node-color);border-radius:50%;box-sizing:border-box;display:flex;justify-content:center;position:absolute}.el-timeline-item__node--normal{height:var(--el-timeline-node-size-normal);left:-1px;width:var(--el-timeline-node-size-normal)}.el-timeline-item__node--large{height:var(--el-timeline-node-size-large);left:-2px;width:var(--el-timeline-node-size-large)}.el-timeline-item__node.is-hollow{background:var(--el-color-white);border-style:solid;border-width:2px}.el-timeline-item__node--primary{background-color:var(--el-color-primary);border-color:var(--el-color-primary)}.el-timeline-item__node--success{background-color:var(--el-color-success);border-color:var(--el-color-success)}.el-timeline-item__node--warning{background-color:var(--el-color-warning);border-color:var(--el-color-warning)}.el-timeline-item__node--danger{background-color:var(--el-color-danger);border-color:var(--el-color-danger)}.el-timeline-item__node--info{background-color:var(--el-color-info);border-color:var(--el-color-info)}.el-timeline-item__dot{align-items:center;display:flex;justify-content:center;position:absolute}.el-timeline-item__content{color:var(--el-text-color-primary)}.el-timeline-item__timestamp{color:var(--el-text-color-secondary);font-size:var(--el-font-size-small);line-height:1}.el-timeline-item__timestamp.is-top{margin-bottom:8px;padding-top:4px}.el-timeline-item__timestamp.is-bottom{margin-top:8px}.el-card{--el-card-border-color:var(--el-border-color-light);--el-card-border-radius:4px;--el-card-padding:20px;--el-card-bg-color:var(--el-fill-color-blank);background-color:var(--el-card-bg-color);border:1px solid var(--el-card-border-color);border-radius:var(--el-card-border-radius);color:var(--el-text-color-primary);overflow:hidden;transition:var(--el-transition-duration)}.el-card.is-always-shadow{box-shadow:var(--el-box-shadow-light)}.el-card.is-hover-shadow:focus,.el-card.is-hover-shadow:hover{box-shadow:var(--el-box-shadow-light)}.el-card__header{border-bottom:1px solid var(--el-card-border-color);box-sizing:border-box;padding:calc(var(--el-card-padding) - 2px) var(--el-card-padding)}.el-card__body{padding:var(--el-card-padding)}.el-card__footer{border-top:1px solid var(--el-card-border-color);box-sizing:border-box;padding:calc(var(--el-card-padding) - 2px) var(--el-card-padding)}.el-button{--el-button-font-weight:var(--el-font-weight-primary);--el-button-border-color:var(--el-border-color);--el-button-bg-color:var(--el-fill-color-blank);--el-button-text-color:var(--el-text-color-regular);--el-button-disabled-text-color:var(--el-disabled-text-color);--el-button-disabled-bg-color:var(--el-fill-color-blank);--el-button-disabled-border-color:var(--el-border-color-light);--el-button-divide-border-color:rgba(255,255,255,.5);--el-button-hover-text-color:var(--el-color-primary);--el-button-hover-bg-color:var(--el-color-primary-light-9);--el-button-hover-border-color:var(--el-color-primary-light-7);--el-button-active-text-color:var(--el-button-hover-text-color);--el-button-active-border-color:var(--el-color-primary);--el-button-active-bg-color:var(--el-button-hover-bg-color);--el-button-outline-color:var(--el-color-primary-light-5);--el-button-hover-link-text-color:var(--el-color-info);--el-button-active-color:var(--el-text-color-primary);align-items:center;-webkit-appearance:none;background-color:var(--el-button-bg-color);border:var(--el-border);border-color:var(--el-button-border-color);border-radius:var(--el-border-radius-base);box-sizing:border-box;color:var(--el-button-text-color);cursor:pointer;display:inline-flex;font-size:var(--el-font-size-base);font-weight:var(--el-button-font-weight);height:32px;justify-content:center;line-height:1;outline:none;padding:8px 15px;text-align:center;transition:.1s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;white-space:nowrap}.el-button:hover{background-color:var(--el-button-hover-bg-color);border-color:var(--el-button-hover-border-color);color:var(--el-button-hover-text-color);outline:none}.el-button:active{background-color:var(--el-button-active-bg-color);border-color:var(--el-button-active-border-color);color:var(--el-button-active-text-color);outline:none}.el-button:focus-visible{outline:2px solid var(--el-button-outline-color);outline-offset:1px;transition:outline-offset 0s,outline 0s}.el-button>span{align-items:center;display:inline-flex}.el-button+.el-button{margin-left:12px}.el-button.is-round{padding:8px 15px}.el-button::-moz-focus-inner{border:0}.el-button [class*=el-icon]+span{margin-left:6px}.el-button [class*=el-icon] svg{vertical-align:bottom}.el-button.is-plain{--el-button-hover-text-color:var(--el-color-primary);--el-button-hover-bg-color:var(--el-fill-color-blank);--el-button-hover-border-color:var(--el-color-primary)}.el-button.is-active{background-color:var(--el-button-active-bg-color);border-color:var(--el-button-active-border-color);color:var(--el-button-active-text-color);outline:none}.el-button.is-disabled,.el-button.is-disabled:hover{background-color:var(--el-button-disabled-bg-color);background-image:none;border-color:var(--el-button-disabled-border-color);color:var(--el-button-disabled-text-color);cursor:not-allowed}.el-button.is-loading{pointer-events:none;position:relative}.el-button.is-loading:before{background-color:var(--el-mask-color-extra-light);border-radius:inherit;bottom:-1px;content:"";left:-1px;pointer-events:none;position:absolute;right:-1px;top:-1px;z-index:1}.el-button.is-round{border-radius:var(--el-border-radius-round)}.el-button.is-circle{border-radius:50%;padding:8px;width:32px}.el-button.is-text{background-color:transparent;border:0 solid transparent;color:var(--el-button-text-color)}.el-button.is-text.is-disabled{background-color:transparent!important;color:var(--el-button-disabled-text-color)}.el-button.is-text:not(.is-disabled):hover{background-color:var(--el-fill-color-light)}.el-button.is-text:not(.is-disabled):focus-visible{outline:2px solid var(--el-button-outline-color);outline-offset:1px;transition:outline-offset 0s,outline 0s}.el-button.is-text:not(.is-disabled):active{background-color:var(--el-fill-color)}.el-button.is-text:not(.is-disabled).is-has-bg{background-color:var(--el-fill-color-light)}.el-button.is-text:not(.is-disabled).is-has-bg:hover{background-color:var(--el-fill-color)}.el-button.is-text:not(.is-disabled).is-has-bg:active{background-color:var(--el-fill-color-dark)}.el-button__text--expand{letter-spacing:.3em;margin-right:-.3em}.el-button.is-link{background:transparent;border-color:transparent;color:var(--el-button-text-color);height:auto;padding:2px}.el-button.is-link:hover{color:var(--el-button-hover-link-text-color)}.el-button.is-link.is-disabled{background-color:transparent!important;border-color:transparent!important;color:var(--el-button-disabled-text-color)}.el-button.is-link:not(.is-disabled):hover{background-color:transparent;border-color:transparent}.el-button.is-link:not(.is-disabled):active{background-color:transparent;border-color:transparent;color:var(--el-button-active-color)}.el-button--text{background:transparent;border-color:transparent;color:var(--el-color-primary);padding-left:0;padding-right:0}.el-button--text.is-disabled{background-color:transparent!important;border-color:transparent!important;color:var(--el-button-disabled-text-color)}.el-button--text:not(.is-disabled):hover{background-color:transparent;border-color:transparent;color:var(--el-color-primary-light-3)}.el-button--text:not(.is-disabled):active{background-color:transparent;border-color:transparent;color:var(--el-color-primary-dark-2)}.el-button__link--expand{letter-spacing:.3em;margin-right:-.3em}.el-button--primary{--el-button-text-color:var(--el-color-white);--el-button-bg-color:var(--el-color-primary);--el-button-border-color:var(--el-color-primary);--el-button-outline-color:var(--el-color-primary-light-5);--el-button-active-color:var(--el-color-primary-dark-2);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-link-text-color:var(--el-color-primary-light-5);--el-button-hover-bg-color:var(--el-color-primary-light-3);--el-button-hover-border-color:var(--el-color-primary-light-3);--el-button-active-bg-color:var(--el-color-primary-dark-2);--el-button-active-border-color:var(--el-color-primary-dark-2);--el-button-disabled-text-color:var(--el-color-white);--el-button-disabled-bg-color:var(--el-color-primary-light-5);--el-button-disabled-border-color:var(--el-color-primary-light-5)}.el-button--primary.is-link,.el-button--primary.is-plain,.el-button--primary.is-text{--el-button-text-color:var(--el-color-primary);--el-button-bg-color:var(--el-color-primary-light-9);--el-button-border-color:var(--el-color-primary-light-5);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-bg-color:var(--el-color-primary);--el-button-hover-border-color:var(--el-color-primary);--el-button-active-text-color:var(--el-color-white)}.el-button--primary.is-link.is-disabled,.el-button--primary.is-link.is-disabled:active,.el-button--primary.is-link.is-disabled:focus,.el-button--primary.is-link.is-disabled:hover,.el-button--primary.is-plain.is-disabled,.el-button--primary.is-plain.is-disabled:active,.el-button--primary.is-plain.is-disabled:focus,.el-button--primary.is-plain.is-disabled:hover,.el-button--primary.is-text.is-disabled,.el-button--primary.is-text.is-disabled:active,.el-button--primary.is-text.is-disabled:focus,.el-button--primary.is-text.is-disabled:hover{background-color:var(--el-color-primary-light-9);border-color:var(--el-color-primary-light-8);color:var(--el-color-primary-light-5)}.el-button--success{--el-button-text-color:var(--el-color-white);--el-button-bg-color:var(--el-color-success);--el-button-border-color:var(--el-color-success);--el-button-outline-color:var(--el-color-success-light-5);--el-button-active-color:var(--el-color-success-dark-2);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-link-text-color:var(--el-color-success-light-5);--el-button-hover-bg-color:var(--el-color-success-light-3);--el-button-hover-border-color:var(--el-color-success-light-3);--el-button-active-bg-color:var(--el-color-success-dark-2);--el-button-active-border-color:var(--el-color-success-dark-2);--el-button-disabled-text-color:var(--el-color-white);--el-button-disabled-bg-color:var(--el-color-success-light-5);--el-button-disabled-border-color:var(--el-color-success-light-5)}.el-button--success.is-link,.el-button--success.is-plain,.el-button--success.is-text{--el-button-text-color:var(--el-color-success);--el-button-bg-color:var(--el-color-success-light-9);--el-button-border-color:var(--el-color-success-light-5);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-bg-color:var(--el-color-success);--el-button-hover-border-color:var(--el-color-success);--el-button-active-text-color:var(--el-color-white)}.el-button--success.is-link.is-disabled,.el-button--success.is-link.is-disabled:active,.el-button--success.is-link.is-disabled:focus,.el-button--success.is-link.is-disabled:hover,.el-button--success.is-plain.is-disabled,.el-button--success.is-plain.is-disabled:active,.el-button--success.is-plain.is-disabled:focus,.el-button--success.is-plain.is-disabled:hover,.el-button--success.is-text.is-disabled,.el-button--success.is-text.is-disabled:active,.el-button--success.is-text.is-disabled:focus,.el-button--success.is-text.is-disabled:hover{background-color:var(--el-color-success-light-9);border-color:var(--el-color-success-light-8);color:var(--el-color-success-light-5)}.el-button--warning{--el-button-text-color:var(--el-color-white);--el-button-bg-color:var(--el-color-warning);--el-button-border-color:var(--el-color-warning);--el-button-outline-color:var(--el-color-warning-light-5);--el-button-active-color:var(--el-color-warning-dark-2);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-link-text-color:var(--el-color-warning-light-5);--el-button-hover-bg-color:var(--el-color-warning-light-3);--el-button-hover-border-color:var(--el-color-warning-light-3);--el-button-active-bg-color:var(--el-color-warning-dark-2);--el-button-active-border-color:var(--el-color-warning-dark-2);--el-button-disabled-text-color:var(--el-color-white);--el-button-disabled-bg-color:var(--el-color-warning-light-5);--el-button-disabled-border-color:var(--el-color-warning-light-5)}.el-button--warning.is-link,.el-button--warning.is-plain,.el-button--warning.is-text{--el-button-text-color:var(--el-color-warning);--el-button-bg-color:var(--el-color-warning-light-9);--el-button-border-color:var(--el-color-warning-light-5);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-bg-color:var(--el-color-warning);--el-button-hover-border-color:var(--el-color-warning);--el-button-active-text-color:var(--el-color-white)}.el-button--warning.is-link.is-disabled,.el-button--warning.is-link.is-disabled:active,.el-button--warning.is-link.is-disabled:focus,.el-button--warning.is-link.is-disabled:hover,.el-button--warning.is-plain.is-disabled,.el-button--warning.is-plain.is-disabled:active,.el-button--warning.is-plain.is-disabled:focus,.el-button--warning.is-plain.is-disabled:hover,.el-button--warning.is-text.is-disabled,.el-button--warning.is-text.is-disabled:active,.el-button--warning.is-text.is-disabled:focus,.el-button--warning.is-text.is-disabled:hover{background-color:var(--el-color-warning-light-9);border-color:var(--el-color-warning-light-8);color:var(--el-color-warning-light-5)}.el-button--danger{--el-button-text-color:var(--el-color-white);--el-button-bg-color:var(--el-color-danger);--el-button-border-color:var(--el-color-danger);--el-button-outline-color:var(--el-color-danger-light-5);--el-button-active-color:var(--el-color-danger-dark-2);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-link-text-color:var(--el-color-danger-light-5);--el-button-hover-bg-color:var(--el-color-danger-light-3);--el-button-hover-border-color:var(--el-color-danger-light-3);--el-button-active-bg-color:var(--el-color-danger-dark-2);--el-button-active-border-color:var(--el-color-danger-dark-2);--el-button-disabled-text-color:var(--el-color-white);--el-button-disabled-bg-color:var(--el-color-danger-light-5);--el-button-disabled-border-color:var(--el-color-danger-light-5)}.el-button--danger.is-link,.el-button--danger.is-plain,.el-button--danger.is-text{--el-button-text-color:var(--el-color-danger);--el-button-bg-color:var(--el-color-danger-light-9);--el-button-border-color:var(--el-color-danger-light-5);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-bg-color:var(--el-color-danger);--el-button-hover-border-color:var(--el-color-danger);--el-button-active-text-color:var(--el-color-white)}.el-button--danger.is-link.is-disabled,.el-button--danger.is-link.is-disabled:active,.el-button--danger.is-link.is-disabled:focus,.el-button--danger.is-link.is-disabled:hover,.el-button--danger.is-plain.is-disabled,.el-button--danger.is-plain.is-disabled:active,.el-button--danger.is-plain.is-disabled:focus,.el-button--danger.is-plain.is-disabled:hover,.el-button--danger.is-text.is-disabled,.el-button--danger.is-text.is-disabled:active,.el-button--danger.is-text.is-disabled:focus,.el-button--danger.is-text.is-disabled:hover{background-color:var(--el-color-danger-light-9);border-color:var(--el-color-danger-light-8);color:var(--el-color-danger-light-5)}.el-button--info{--el-button-text-color:var(--el-color-white);--el-button-bg-color:var(--el-color-info);--el-button-border-color:var(--el-color-info);--el-button-outline-color:var(--el-color-info-light-5);--el-button-active-color:var(--el-color-info-dark-2);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-link-text-color:var(--el-color-info-light-5);--el-button-hover-bg-color:var(--el-color-info-light-3);--el-button-hover-border-color:var(--el-color-info-light-3);--el-button-active-bg-color:var(--el-color-info-dark-2);--el-button-active-border-color:var(--el-color-info-dark-2);--el-button-disabled-text-color:var(--el-color-white);--el-button-disabled-bg-color:var(--el-color-info-light-5);--el-button-disabled-border-color:var(--el-color-info-light-5)}.el-button--info.is-link,.el-button--info.is-plain,.el-button--info.is-text{--el-button-text-color:var(--el-color-info);--el-button-bg-color:var(--el-color-info-light-9);--el-button-border-color:var(--el-color-info-light-5);--el-button-hover-text-color:var(--el-color-white);--el-button-hover-bg-color:var(--el-color-info);--el-button-hover-border-color:var(--el-color-info);--el-button-active-text-color:var(--el-color-white)}.el-button--info.is-link.is-disabled,.el-button--info.is-link.is-disabled:active,.el-button--info.is-link.is-disabled:focus,.el-button--info.is-link.is-disabled:hover,.el-button--info.is-plain.is-disabled,.el-button--info.is-plain.is-disabled:active,.el-button--info.is-plain.is-disabled:focus,.el-button--info.is-plain.is-disabled:hover,.el-button--info.is-text.is-disabled,.el-button--info.is-text.is-disabled:active,.el-button--info.is-text.is-disabled:focus,.el-button--info.is-text.is-disabled:hover{background-color:var(--el-color-info-light-9);border-color:var(--el-color-info-light-8);color:var(--el-color-info-light-5)}.el-button--large{--el-button-size:40px;border-radius:var(--el-border-radius-base);font-size:var(--el-font-size-base);height:var(--el-button-size);padding:12px 19px}.el-button--large [class*=el-icon]+span{margin-left:8px}.el-button--large.is-round{padding:12px 19px}.el-button--large.is-circle{padding:12px;width:var(--el-button-size)}.el-button--small{--el-button-size:24px;border-radius:calc(var(--el-border-radius-base) - 1px);font-size:12px;height:var(--el-button-size);padding:5px 11px}.el-button--small [class*=el-icon]+span{margin-left:4px}.el-button--small.is-round{padding:5px 11px}.el-button--small.is-circle{padding:5px;width:var(--el-button-size)}.el-tag{--el-tag-font-size:12px;--el-tag-border-radius:4px;--el-tag-border-radius-rounded:9999px;--el-tag-bg-color:var(--el-color-primary-light-9);--el-tag-border-color:var(--el-color-primary-light-8);--el-tag-hover-color:var(--el-color-primary);align-items:center;background-color:var(--el-tag-bg-color);border-color:var(--el-tag-border-color);border-radius:var(--el-tag-border-radius);border-style:solid;border-width:1px;box-sizing:border-box;color:var(--el-tag-text-color);display:inline-flex;font-size:var(--el-tag-font-size);height:24px;justify-content:center;line-height:1;padding:0 9px;vertical-align:middle;white-space:nowrap;--el-icon-size:14px}.el-tag.el-tag--primary{--el-tag-bg-color:var(--el-color-primary-light-9);--el-tag-border-color:var(--el-color-primary-light-8);--el-tag-hover-color:var(--el-color-primary)}.el-tag.el-tag--success{--el-tag-bg-color:var(--el-color-success-light-9);--el-tag-border-color:var(--el-color-success-light-8);--el-tag-hover-color:var(--el-color-success)}.el-tag.el-tag--warning{--el-tag-bg-color:var(--el-color-warning-light-9);--el-tag-border-color:var(--el-color-warning-light-8);--el-tag-hover-color:var(--el-color-warning)}.el-tag.el-tag--danger{--el-tag-bg-color:var(--el-color-danger-light-9);--el-tag-border-color:var(--el-color-danger-light-8);--el-tag-hover-color:var(--el-color-danger)}.el-tag.el-tag--error{--el-tag-bg-color:var(--el-color-error-light-9);--el-tag-border-color:var(--el-color-error-light-8);--el-tag-hover-color:var(--el-color-error)}.el-tag.el-tag--info{--el-tag-bg-color:var(--el-color-info-light-9);--el-tag-border-color:var(--el-color-info-light-8);--el-tag-hover-color:var(--el-color-info)}.el-tag.el-tag--primary{--el-tag-text-color:var(--el-color-primary)}.el-tag.el-tag--success{--el-tag-text-color:var(--el-color-success)}.el-tag.el-tag--warning{--el-tag-text-color:var(--el-color-warning)}.el-tag.el-tag--danger{--el-tag-text-color:var(--el-color-danger)}.el-tag.el-tag--error{--el-tag-text-color:var(--el-color-error)}.el-tag.el-tag--info{--el-tag-text-color:var(--el-color-info)}.el-tag.is-hit{border-color:var(--el-color-primary)}.el-tag.is-round{border-radius:var(--el-tag-border-radius-rounded)}.el-tag .el-tag__close{color:var(--el-tag-text-color);flex-shrink:0}.el-tag .el-tag__close:hover{background-color:var(--el-tag-hover-color);color:var(--el-color-white)}.el-tag .el-icon{border-radius:50%;cursor:pointer;font-size:calc(var(--el-icon-size) - 2px);height:var(--el-icon-size);width:var(--el-icon-size)}.el-tag .el-tag__close{margin-left:6px}.el-tag--dark{--el-tag-bg-color:var(--el-color-primary);--el-tag-border-color:var(--el-color-primary);--el-tag-hover-color:var(--el-color-primary-light-3);--el-tag-text-color:var(--el-color-white)}.el-tag--dark.el-tag--primary{--el-tag-bg-color:var(--el-color-primary);--el-tag-border-color:var(--el-color-primary);--el-tag-hover-color:var(--el-color-primary-light-3)}.el-tag--dark.el-tag--success{--el-tag-bg-color:var(--el-color-success);--el-tag-border-color:var(--el-color-success);--el-tag-hover-color:var(--el-color-success-light-3)}.el-tag--dark.el-tag--warning{--el-tag-bg-color:var(--el-color-warning);--el-tag-border-color:var(--el-color-warning);--el-tag-hover-color:var(--el-color-warning-light-3)}.el-tag--dark.el-tag--danger{--el-tag-bg-color:var(--el-color-danger);--el-tag-border-color:var(--el-color-danger);--el-tag-hover-color:var(--el-color-danger-light-3)}.el-tag--dark.el-tag--error{--el-tag-bg-color:var(--el-color-error);--el-tag-border-color:var(--el-color-error);--el-tag-hover-color:var(--el-color-error-light-3)}.el-tag--dark.el-tag--info{--el-tag-bg-color:var(--el-color-info);--el-tag-border-color:var(--el-color-info);--el-tag-hover-color:var(--el-color-info-light-3)}.el-tag--dark.el-tag--danger,.el-tag--dark.el-tag--error,.el-tag--dark.el-tag--info,.el-tag--dark.el-tag--primary,.el-tag--dark.el-tag--success,.el-tag--dark.el-tag--warning{--el-tag-text-color:var(--el-color-white)}.el-tag--plain{--el-tag-border-color:var(--el-color-primary-light-5);--el-tag-hover-color:var(--el-color-primary);--el-tag-bg-color:var(--el-fill-color-blank)}.el-tag--plain.el-tag--primary{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-primary-light-5);--el-tag-hover-color:var(--el-color-primary)}.el-tag--plain.el-tag--success{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-success-light-5);--el-tag-hover-color:var(--el-color-success)}.el-tag--plain.el-tag--warning{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-warning-light-5);--el-tag-hover-color:var(--el-color-warning)}.el-tag--plain.el-tag--danger{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-danger-light-5);--el-tag-hover-color:var(--el-color-danger)}.el-tag--plain.el-tag--error{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-error-light-5);--el-tag-hover-color:var(--el-color-error)}.el-tag--plain.el-tag--info{--el-tag-bg-color:var(--el-fill-color-blank);--el-tag-border-color:var(--el-color-info-light-5);--el-tag-hover-color:var(--el-color-info)}.el-tag.is-closable{padding-right:5px}.el-tag--large{height:32px;padding:0 11px;--el-icon-size:16px}.el-tag--large .el-tag__close{margin-left:8px}.el-tag--large.is-closable{padding-right:7px}.el-tag--small{height:20px;padding:0 7px;--el-icon-size:12px}.el-tag--small .el-tag__close{margin-left:4px}.el-tag--small.is-closable{padding-right:3px}.el-tag--small .el-icon-close{transform:scale(.8)}.el-tag.el-tag--primary.is-hit{border-color:var(--el-color-primary)}.el-tag.el-tag--success.is-hit{border-color:var(--el-color-success)}.el-tag.el-tag--warning.is-hit{border-color:var(--el-color-warning)}.el-tag.el-tag--danger.is-hit{border-color:var(--el-color-danger)}.el-tag.el-tag--error.is-hit{border-color:var(--el-color-error)}.el-tag.el-tag--info.is-hit{border-color:var(--el-color-info)}#cardList[data-v-a9d83084]{height:100%;padding:0 5px 15px 7px;overflow-y:auto;width:100%}.card[data-v-a9d83084]{padding:0;width:100%;max-width:100%;height:80px;margin-bottom:10px;box-shadow:0 8px 32px #01010112;border-radius:5px;border:1px solid rgba(0,0,0,.31)}.card[data-v-a9d83084]:hover{box-shadow:0 18px 50px #0101012b;border:1px solid rgba(0,0,0,.51);transform:scale(1.005);transition:all .3s;cursor:pointer}.card h4[data-v-a9d83084]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:16px;margin:0 0 5px;padding:10px;border-bottom:1px solid rgba(0,0,0,.31)}.card p[data-v-a9d83084]{font-size:12px;margin:0;padding:0 10px}#mao-gai-content[data-v-c534c5c4]{width:100%;height:100%;display:flex;margin-top:10px}#mao-gai-content .left[data-v-c534c5c4]{flex:4}#mao-gai-content .right[data-v-c534c5c4]{flex:6;padding:0 7px}.card[data-v-c534c5c4]{padding-right:7px;height:100%;overflow-y:scroll;width:100%}.card-header .header-title[data-v-c534c5c4]{font-size:28px;font-weight:700;color:#636466;padding:0;margin:0 0 5px}.card-header .header-body[data-v-c534c5c4]{margin:0;font-size:14px}.card-header .header-body .el-tag[data-v-c534c5c4]{margin-top:5px;max-width:100px;overflow:hidden}.el-switch{--el-switch-on-color:var(--el-color-primary);--el-switch-off-color:var(--el-border-color);align-items:center;display:inline-flex;font-size:14px;height:32px;line-height:20px;position:relative;vertical-align:middle}.el-switch.is-disabled .el-switch__core,.el-switch.is-disabled .el-switch__label{cursor:not-allowed}.el-switch__label{color:var(--el-text-color-primary);cursor:pointer;display:inline-block;font-size:14px;font-weight:500;height:20px;transition:var(--el-transition-duration-fast);vertical-align:middle}.el-switch__label.is-active{color:var(--el-color-primary)}.el-switch__label--left{margin-right:10px}.el-switch__label--right{margin-left:10px}.el-switch__label *{display:inline-block;font-size:14px;line-height:1}.el-switch__label .el-icon{height:inherit}.el-switch__label .el-icon svg{vertical-align:middle}.el-switch__input{height:0;margin:0;opacity:0;position:absolute;width:0}.el-switch__input:focus-visible~.el-switch__core{outline:2px solid var(--el-switch-on-color);outline-offset:1px}.el-switch__core{align-items:center;background:var(--el-switch-off-color);border:1px solid var(--el-switch-border-color,var(--el-switch-off-color));border-radius:10px;box-sizing:border-box;cursor:pointer;display:inline-flex;height:20px;min-width:40px;outline:none;position:relative;transition:border-color var(--el-transition-duration),background-color var(--el-transition-duration)}.el-switch__core .el-switch__inner{align-items:center;display:flex;height:16px;justify-content:center;overflow:hidden;padding:0 4px 0 18px;transition:all var(--el-transition-duration);width:100%}.el-switch__core .el-switch__inner .is-icon,.el-switch__core .el-switch__inner .is-text{color:var(--el-color-white);font-size:12px;overflow:hidden;text-overflow:ellipsis;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap}.el-switch__core .el-switch__action{align-items:center;background-color:var(--el-color-white);border-radius:var(--el-border-radius-circle);color:var(--el-switch-off-color);display:flex;height:16px;justify-content:center;left:1px;position:absolute;transition:all var(--el-transition-duration);width:16px}.el-switch.is-checked .el-switch__core{background-color:var(--el-switch-on-color);border-color:var(--el-switch-border-color,var(--el-switch-on-color))}.el-switch.is-checked .el-switch__core .el-switch__action{color:var(--el-switch-on-color);left:calc(100% - 17px)}.el-switch.is-checked .el-switch__core .el-switch__inner{padding:0 18px 0 4px}.el-switch.is-disabled{opacity:.6}.el-switch--wide .el-switch__label.el-switch__label--left span{left:10px}.el-switch--wide .el-switch__label.el-switch__label--right span{right:10px}.el-switch .label-fade-enter-from,.el-switch .label-fade-leave-active{opacity:0}.el-switch--large{font-size:14px;height:40px;line-height:24px}.el-switch--large .el-switch__label{font-size:14px;height:24px}.el-switch--large .el-switch__label *{font-size:14px}.el-switch--large .el-switch__core{border-radius:12px;height:24px;min-width:50px}.el-switch--large .el-switch__core .el-switch__inner{height:20px;padding:0 6px 0 22px}.el-switch--large .el-switch__core .el-switch__action{height:20px;width:20px}.el-switch--large.is-checked .el-switch__core .el-switch__action{left:calc(100% - 21px)}.el-switch--large.is-checked .el-switch__core .el-switch__inner{padding:0 22px 0 6px}.el-switch--small{font-size:12px;height:24px;line-height:16px}.el-switch--small .el-switch__label{font-size:12px;height:16px}.el-switch--small .el-switch__label *{font-size:12px}.el-switch--small .el-switch__core{border-radius:8px;height:16px;min-width:30px}.el-switch--small .el-switch__core .el-switch__inner{height:12px;padding:0 2px 0 14px}.el-switch--small .el-switch__core .el-switch__action{height:12px;width:12px}.el-switch--small.is-checked .el-switch__core .el-switch__action{left:calc(100% - 13px)}.el-switch--small.is-checked .el-switch__core .el-switch__inner{padding:0 14px 0 2px}#root[data-v-64c380f9]{display:flex;height:100%}.left-menu[data-v-64c380f9]{width:100px;background-color:#f1f1f1}.left-menu .menu-option[data-v-64c380f9]{padding:5px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.left-menu .menu-option[data-v-64c380f9]:hover{background-color:#e0e0e0}.right-content[data-v-64c380f9]{flex:1;overflow-y:auto;padding:20px}.right-content .content-item[data-v-64c380f9]{border-top:1px dashed #ccc;margin-bottom:20px}.right-content .content-item .item-top[data-v-64c380f9]{display:flex;align-items:center;justify-content:space-between}.right-content .content-item p[data-v-64c380f9]{margin:0;padding:0} ');

(function (vue) {
  'use strict';

  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_main_001 = __commonJS({
    "main-Csl3FMdW.js"(exports, module) {
      /*!
        * vue-router v4.3.2
        * (c) 2024 Eduardo San Martin Morote
        * @license MIT
        */
      const isBrowser = typeof document !== "undefined";
      function isESModule(obj) {
        return obj.__esModule || obj[Symbol.toStringTag] === "Module";
      }
      const assign$1 = Object.assign;
      function applyToParams(fn, params) {
        const newParams = {};
        for (const key in params) {
          const value = params[key];
          newParams[key] = isArray$3(value) ? value.map(fn) : fn(value);
        }
        return newParams;
      }
      const noop$3 = () => {
      };
      const isArray$3 = Array.isArray;
      const HASH_RE = /#/g;
      const AMPERSAND_RE = /&/g;
      const SLASH_RE = /\//g;
      const EQUAL_RE = /=/g;
      const IM_RE = /\?/g;
      const PLUS_RE = /\+/g;
      const ENC_BRACKET_OPEN_RE = /%5B/g;
      const ENC_BRACKET_CLOSE_RE = /%5D/g;
      const ENC_CARET_RE = /%5E/g;
      const ENC_BACKTICK_RE = /%60/g;
      const ENC_CURLY_OPEN_RE = /%7B/g;
      const ENC_PIPE_RE = /%7C/g;
      const ENC_CURLY_CLOSE_RE = /%7D/g;
      const ENC_SPACE_RE = /%20/g;
      function commonEncode(text) {
        return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
      }
      function encodeHash(text) {
        return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
      }
      function encodeQueryValue(text) {
        return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
      }
      function encodeQueryKey(text) {
        return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
      }
      function encodePath(text) {
        return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
      }
      function encodeParam(text) {
        return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
      }
      function decode(text) {
        try {
          return decodeURIComponent("" + text);
        } catch (err) {
        }
        return "" + text;
      }
      const TRAILING_SLASH_RE = /\/$/;
      const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
      function parseURL(parseQuery2, location2, currentLocation = "/") {
        let path, query = {}, searchString = "", hash = "";
        const hashPos = location2.indexOf("#");
        let searchPos = location2.indexOf("?");
        if (hashPos < searchPos && hashPos >= 0) {
          searchPos = -1;
        }
        if (searchPos > -1) {
          path = location2.slice(0, searchPos);
          searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
          query = parseQuery2(searchString);
        }
        if (hashPos > -1) {
          path = path || location2.slice(0, hashPos);
          hash = location2.slice(hashPos, location2.length);
        }
        path = resolveRelativePath(path != null ? path : location2, currentLocation);
        return {
          fullPath: path + (searchString && "?") + searchString + hash,
          path,
          query,
          hash: decode(hash)
        };
      }
      function stringifyURL(stringifyQuery2, location2) {
        const query = location2.query ? stringifyQuery2(location2.query) : "";
        return location2.path + (query && "?") + query + (location2.hash || "");
      }
      function isSameRouteLocation(stringifyQuery2, a, b) {
        const aLastIndex = a.matched.length - 1;
        const bLastIndex = b.matched.length - 1;
        return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
      }
      function isSameRouteRecord(a, b) {
        return (a.aliasOf || a) === (b.aliasOf || b);
      }
      function isSameRouteLocationParams(a, b) {
        if (Object.keys(a).length !== Object.keys(b).length)
          return false;
        for (const key in a) {
          if (!isSameRouteLocationParamsValue(a[key], b[key]))
            return false;
        }
        return true;
      }
      function isSameRouteLocationParamsValue(a, b) {
        return isArray$3(a) ? isEquivalentArray(a, b) : isArray$3(b) ? isEquivalentArray(b, a) : a === b;
      }
      function isEquivalentArray(a, b) {
        return isArray$3(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
      }
      function resolveRelativePath(to, from) {
        if (to.startsWith("/"))
          return to;
        if (!to)
          return from;
        const fromSegments = from.split("/");
        const toSegments = to.split("/");
        const lastToSegment = toSegments[toSegments.length - 1];
        if (lastToSegment === ".." || lastToSegment === ".") {
          toSegments.push("");
        }
        let position = fromSegments.length - 1;
        let toPosition;
        let segment;
        for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
          segment = toSegments[toPosition];
          if (segment === ".")
            continue;
          if (segment === "..") {
            if (position > 1)
              position--;
          } else
            break;
        }
        return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition).join("/");
      }
      var NavigationType;
      (function(NavigationType2) {
        NavigationType2["pop"] = "pop";
        NavigationType2["push"] = "push";
      })(NavigationType || (NavigationType = {}));
      var NavigationDirection;
      (function(NavigationDirection2) {
        NavigationDirection2["back"] = "back";
        NavigationDirection2["forward"] = "forward";
        NavigationDirection2["unknown"] = "";
      })(NavigationDirection || (NavigationDirection = {}));
      const START = "";
      function normalizeBase(base) {
        if (!base) {
          if (isBrowser) {
            const baseEl = document.querySelector("base");
            base = baseEl && baseEl.getAttribute("href") || "/";
            base = base.replace(/^\w+:\/\/[^\/]+/, "");
          } else {
            base = "/";
          }
        }
        if (base[0] !== "/" && base[0] !== "#")
          base = "/" + base;
        return removeTrailingSlash(base);
      }
      const BEFORE_HASH_RE = /^[^#]+#/;
      function createHref(base, location2) {
        return base.replace(BEFORE_HASH_RE, "#") + location2;
      }
      function getElementPosition(el, offset) {
        const docRect = document.documentElement.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        return {
          behavior: offset.behavior,
          left: elRect.left - docRect.left - (offset.left || 0),
          top: elRect.top - docRect.top - (offset.top || 0)
        };
      }
      const computeScrollPosition = () => ({
        left: window.scrollX,
        top: window.scrollY
      });
      function scrollToPosition(position) {
        let scrollToOptions;
        if ("el" in position) {
          const positionEl = position.el;
          const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
          const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
          if (!el) {
            return;
          }
          scrollToOptions = getElementPosition(el, position);
        } else {
          scrollToOptions = position;
        }
        if ("scrollBehavior" in document.documentElement.style)
          window.scrollTo(scrollToOptions);
        else {
          window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.scrollX, scrollToOptions.top != null ? scrollToOptions.top : window.scrollY);
        }
      }
      function getScrollKey(path, delta) {
        const position = history.state ? history.state.position - delta : -1;
        return position + path;
      }
      const scrollPositions = /* @__PURE__ */ new Map();
      function saveScrollPosition(key, scrollPosition) {
        scrollPositions.set(key, scrollPosition);
      }
      function getSavedScrollPosition(key) {
        const scroll = scrollPositions.get(key);
        scrollPositions.delete(key);
        return scroll;
      }
      function createMemoryHistory(base = "") {
        let listeners = [];
        let queue = [START];
        let position = 0;
        base = normalizeBase(base);
        function setLocation(location2) {
          position++;
          if (position !== queue.length) {
            queue.splice(position);
          }
          queue.push(location2);
        }
        function triggerListeners(to, from, { direction, delta }) {
          const info = {
            direction,
            delta,
            type: NavigationType.pop
          };
          for (const callback of listeners) {
            callback(to, from, info);
          }
        }
        const routerHistory = {
          // rewritten by Object.defineProperty
          location: START,
          // TODO: should be kept in queue
          state: {},
          base,
          createHref: createHref.bind(null, base),
          replace(to) {
            queue.splice(position--, 1);
            setLocation(to);
          },
          push(to, data) {
            setLocation(to);
          },
          listen(callback) {
            listeners.push(callback);
            return () => {
              const index = listeners.indexOf(callback);
              if (index > -1)
                listeners.splice(index, 1);
            };
          },
          destroy() {
            listeners = [];
            queue = [START];
            position = 0;
          },
          go(delta, shouldTrigger = true) {
            const from = this.location;
            const direction = (
              // we are considering delta === 0 going forward, but in abstract mode
              // using 0 for the delta doesn't make sense like it does in html5 where
              // it reloads the page
              delta < 0 ? NavigationDirection.back : NavigationDirection.forward
            );
            position = Math.max(0, Math.min(position + delta, queue.length - 1));
            if (shouldTrigger) {
              triggerListeners(this.location, from, {
                direction,
                delta
              });
            }
          }
        };
        Object.defineProperty(routerHistory, "location", {
          enumerable: true,
          get: () => queue[position]
        });
        return routerHistory;
      }
      function isRouteLocation(route) {
        return typeof route === "string" || route && typeof route === "object";
      }
      function isRouteName(name) {
        return typeof name === "string" || typeof name === "symbol";
      }
      const START_LOCATION_NORMALIZED = {
        path: "/",
        name: void 0,
        params: {},
        query: {},
        hash: "",
        fullPath: "/",
        matched: [],
        meta: {},
        redirectedFrom: void 0
      };
      const NavigationFailureSymbol = Symbol("");
      var NavigationFailureType;
      (function(NavigationFailureType2) {
        NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
        NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
        NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
      })(NavigationFailureType || (NavigationFailureType = {}));
      function createRouterError(type, params) {
        {
          return assign$1(new Error(), {
            type,
            [NavigationFailureSymbol]: true
          }, params);
        }
      }
      function isNavigationFailure(error, type) {
        return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
      }
      const BASE_PARAM_PATTERN = "[^/]+?";
      const BASE_PATH_PARSER_OPTIONS = {
        sensitive: false,
        strict: false,
        start: true,
        end: true
      };
      const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
      function tokensToParser(segments, extraOptions) {
        const options = assign$1({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
        const score = [];
        let pattern = options.start ? "^" : "";
        const keys2 = [];
        for (const segment of segments) {
          const segmentScores = segment.length ? [] : [
            90
            /* PathScore.Root */
          ];
          if (options.strict && !segment.length)
            pattern += "/";
          for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
            const token = segment[tokenIndex];
            let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
            if (token.type === 0) {
              if (!tokenIndex)
                pattern += "/";
              pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
              subSegmentScore += 40;
            } else if (token.type === 1) {
              const { value, repeatable, optional, regexp } = token;
              keys2.push({
                name: value,
                repeatable,
                optional
              });
              const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
              if (re2 !== BASE_PARAM_PATTERN) {
                subSegmentScore += 10;
                try {
                  new RegExp(`(${re2})`);
                } catch (err) {
                  throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
                }
              }
              let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
              if (!tokenIndex)
                subPattern = // avoid an optional / if there are more segments e.g. /:p?-static
                // or /:p?-:p2
                optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
              if (optional)
                subPattern += "?";
              pattern += subPattern;
              subSegmentScore += 20;
              if (optional)
                subSegmentScore += -8;
              if (repeatable)
                subSegmentScore += -20;
              if (re2 === ".*")
                subSegmentScore += -50;
            }
            segmentScores.push(subSegmentScore);
          }
          score.push(segmentScores);
        }
        if (options.strict && options.end) {
          const i = score.length - 1;
          score[i][score[i].length - 1] += 0.7000000000000001;
        }
        if (!options.strict)
          pattern += "/?";
        if (options.end)
          pattern += "$";
        else if (options.strict)
          pattern += "(?:/|$)";
        const re = new RegExp(pattern, options.sensitive ? "" : "i");
        function parse(path) {
          const match = path.match(re);
          const params = {};
          if (!match)
            return null;
          for (let i = 1; i < match.length; i++) {
            const value = match[i] || "";
            const key = keys2[i - 1];
            params[key.name] = value && key.repeatable ? value.split("/") : value;
          }
          return params;
        }
        function stringify(params) {
          let path = "";
          let avoidDuplicatedSlash = false;
          for (const segment of segments) {
            if (!avoidDuplicatedSlash || !path.endsWith("/"))
              path += "/";
            avoidDuplicatedSlash = false;
            for (const token of segment) {
              if (token.type === 0) {
                path += token.value;
              } else if (token.type === 1) {
                const { value, repeatable, optional } = token;
                const param = value in params ? params[value] : "";
                if (isArray$3(param) && !repeatable) {
                  throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
                }
                const text = isArray$3(param) ? param.join("/") : param;
                if (!text) {
                  if (optional) {
                    if (segment.length < 2) {
                      if (path.endsWith("/"))
                        path = path.slice(0, -1);
                      else
                        avoidDuplicatedSlash = true;
                    }
                  } else
                    throw new Error(`Missing required param "${value}"`);
                }
                path += text;
              }
            }
          }
          return path || "/";
        }
        return {
          re,
          score,
          keys: keys2,
          parse,
          stringify
        };
      }
      function compareScoreArray(a, b) {
        let i = 0;
        while (i < a.length && i < b.length) {
          const diff = b[i] - a[i];
          if (diff)
            return diff;
          i++;
        }
        if (a.length < b.length) {
          return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
        } else if (a.length > b.length) {
          return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
        }
        return 0;
      }
      function comparePathParserScore(a, b) {
        let i = 0;
        const aScore = a.score;
        const bScore = b.score;
        while (i < aScore.length && i < bScore.length) {
          const comp = compareScoreArray(aScore[i], bScore[i]);
          if (comp)
            return comp;
          i++;
        }
        if (Math.abs(bScore.length - aScore.length) === 1) {
          if (isLastScoreNegative(aScore))
            return 1;
          if (isLastScoreNegative(bScore))
            return -1;
        }
        return bScore.length - aScore.length;
      }
      function isLastScoreNegative(score) {
        const last = score[score.length - 1];
        return score.length > 0 && last[last.length - 1] < 0;
      }
      const ROOT_TOKEN = {
        type: 0,
        value: ""
      };
      const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
      function tokenizePath(path) {
        if (!path)
          return [[]];
        if (path === "/")
          return [[ROOT_TOKEN]];
        if (!path.startsWith("/")) {
          throw new Error(`Invalid path "${path}"`);
        }
        function crash(message) {
          throw new Error(`ERR (${state})/"${buffer}": ${message}`);
        }
        let state = 0;
        let previousState = state;
        const tokens = [];
        let segment;
        function finalizeSegment() {
          if (segment)
            tokens.push(segment);
          segment = [];
        }
        let i = 0;
        let char;
        let buffer = "";
        let customRe = "";
        function consumeBuffer() {
          if (!buffer)
            return;
          if (state === 0) {
            segment.push({
              type: 0,
              value: buffer
            });
          } else if (state === 1 || state === 2 || state === 3) {
            if (segment.length > 1 && (char === "*" || char === "+"))
              crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
            segment.push({
              type: 1,
              value: buffer,
              regexp: customRe,
              repeatable: char === "*" || char === "+",
              optional: char === "*" || char === "?"
            });
          } else {
            crash("Invalid state to consume buffer");
          }
          buffer = "";
        }
        function addCharToBuffer() {
          buffer += char;
        }
        while (i < path.length) {
          char = path[i++];
          if (char === "\\" && state !== 2) {
            previousState = state;
            state = 4;
            continue;
          }
          switch (state) {
            case 0:
              if (char === "/") {
                if (buffer) {
                  consumeBuffer();
                }
                finalizeSegment();
              } else if (char === ":") {
                consumeBuffer();
                state = 1;
              } else {
                addCharToBuffer();
              }
              break;
            case 4:
              addCharToBuffer();
              state = previousState;
              break;
            case 1:
              if (char === "(") {
                state = 2;
              } else if (VALID_PARAM_RE.test(char)) {
                addCharToBuffer();
              } else {
                consumeBuffer();
                state = 0;
                if (char !== "*" && char !== "?" && char !== "+")
                  i--;
              }
              break;
            case 2:
              if (char === ")") {
                if (customRe[customRe.length - 1] == "\\")
                  customRe = customRe.slice(0, -1) + char;
                else
                  state = 3;
              } else {
                customRe += char;
              }
              break;
            case 3:
              consumeBuffer();
              state = 0;
              if (char !== "*" && char !== "?" && char !== "+")
                i--;
              customRe = "";
              break;
            default:
              crash("Unknown state");
              break;
          }
        }
        if (state === 2)
          crash(`Unfinished custom RegExp for param "${buffer}"`);
        consumeBuffer();
        finalizeSegment();
        return tokens;
      }
      function createRouteRecordMatcher(record, parent, options) {
        const parser = tokensToParser(tokenizePath(record.path), options);
        const matcher = assign$1(parser, {
          record,
          parent,
          // these needs to be populated by the parent
          children: [],
          alias: []
        });
        if (parent) {
          if (!matcher.record.aliasOf === !parent.record.aliasOf)
            parent.children.push(matcher);
        }
        return matcher;
      }
      function createRouterMatcher(routes2, globalOptions) {
        const matchers2 = [];
        const matcherMap = /* @__PURE__ */ new Map();
        globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
        function getRecordMatcher(name) {
          return matcherMap.get(name);
        }
        function addRoute(record, parent, originalRecord) {
          const isRootAdd = !originalRecord;
          const mainNormalizedRecord = normalizeRouteRecord(record);
          mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
          const options = mergeOptions(globalOptions, record);
          const normalizedRecords = [
            mainNormalizedRecord
          ];
          if ("alias" in record) {
            const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
            for (const alias of aliases) {
              normalizedRecords.push(assign$1({}, mainNormalizedRecord, {
                // this allows us to hold a copy of the `components` option
                // so that async components cache is hold on the original record
                components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
                path: alias,
                // we might be the child of an alias
                aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
                // the aliases are always of the same kind as the original since they
                // are defined on the same record
              }));
            }
          }
          let matcher;
          let originalMatcher;
          for (const normalizedRecord of normalizedRecords) {
            const { path } = normalizedRecord;
            if (parent && path[0] !== "/") {
              const parentPath = parent.record.path;
              const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
              normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
            }
            matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
            if (originalRecord) {
              originalRecord.alias.push(matcher);
            } else {
              originalMatcher = originalMatcher || matcher;
              if (originalMatcher !== matcher)
                originalMatcher.alias.push(matcher);
              if (isRootAdd && record.name && !isAliasRecord(matcher))
                removeRoute(record.name);
            }
            if (mainNormalizedRecord.children) {
              const children = mainNormalizedRecord.children;
              for (let i = 0; i < children.length; i++) {
                addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
              }
            }
            originalRecord = originalRecord || matcher;
            if (matcher.record.components && Object.keys(matcher.record.components).length || matcher.record.name || matcher.record.redirect) {
              insertMatcher(matcher);
            }
          }
          return originalMatcher ? () => {
            removeRoute(originalMatcher);
          } : noop$3;
        }
        function removeRoute(matcherRef) {
          if (isRouteName(matcherRef)) {
            const matcher = matcherMap.get(matcherRef);
            if (matcher) {
              matcherMap.delete(matcherRef);
              matchers2.splice(matchers2.indexOf(matcher), 1);
              matcher.children.forEach(removeRoute);
              matcher.alias.forEach(removeRoute);
            }
          } else {
            const index = matchers2.indexOf(matcherRef);
            if (index > -1) {
              matchers2.splice(index, 1);
              if (matcherRef.record.name)
                matcherMap.delete(matcherRef.record.name);
              matcherRef.children.forEach(removeRoute);
              matcherRef.alias.forEach(removeRoute);
            }
          }
        }
        function getRoutes() {
          return matchers2;
        }
        function insertMatcher(matcher) {
          let i = 0;
          while (i < matchers2.length && comparePathParserScore(matcher, matchers2[i]) >= 0 && // Adding children with empty path should still appear before the parent
          // https://github.com/vuejs/router/issues/1124
          (matcher.record.path !== matchers2[i].record.path || !isRecordChildOf(matcher, matchers2[i])))
            i++;
          matchers2.splice(i, 0, matcher);
          if (matcher.record.name && !isAliasRecord(matcher))
            matcherMap.set(matcher.record.name, matcher);
        }
        function resolve(location2, currentLocation) {
          let matcher;
          let params = {};
          let path;
          let name;
          if ("name" in location2 && location2.name) {
            matcher = matcherMap.get(location2.name);
            if (!matcher)
              throw createRouterError(1, {
                location: location2
              });
            name = matcher.record.name;
            params = assign$1(
              // paramsFromLocation is a new object
              paramsFromLocation(
                currentLocation.params,
                // only keep params that exist in the resolved location
                // only keep optional params coming from a parent record
                matcher.keys.filter((k) => !k.optional).concat(matcher.parent ? matcher.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)
              ),
              // discard any existing params in the current location that do not exist here
              // #1497 this ensures better active/exact matching
              location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name))
            );
            path = matcher.stringify(params);
          } else if (location2.path != null) {
            path = location2.path;
            matcher = matchers2.find((m) => m.re.test(path));
            if (matcher) {
              params = matcher.parse(path);
              name = matcher.record.name;
            }
          } else {
            matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers2.find((m) => m.re.test(currentLocation.path));
            if (!matcher)
              throw createRouterError(1, {
                location: location2,
                currentLocation
              });
            name = matcher.record.name;
            params = assign$1({}, currentLocation.params, location2.params);
            path = matcher.stringify(params);
          }
          const matched = [];
          let parentMatcher = matcher;
          while (parentMatcher) {
            matched.unshift(parentMatcher.record);
            parentMatcher = parentMatcher.parent;
          }
          return {
            name,
            path,
            params,
            matched,
            meta: mergeMetaFields(matched)
          };
        }
        routes2.forEach((route) => addRoute(route));
        return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
      }
      function paramsFromLocation(params, keys2) {
        const newParams = {};
        for (const key of keys2) {
          if (key in params)
            newParams[key] = params[key];
        }
        return newParams;
      }
      function normalizeRouteRecord(record) {
        return {
          path: record.path,
          redirect: record.redirect,
          name: record.name,
          meta: record.meta || {},
          aliasOf: void 0,
          beforeEnter: record.beforeEnter,
          props: normalizeRecordProps(record),
          children: record.children || [],
          instances: {},
          leaveGuards: /* @__PURE__ */ new Set(),
          updateGuards: /* @__PURE__ */ new Set(),
          enterCallbacks: {},
          components: "components" in record ? record.components || null : record.component && { default: record.component }
        };
      }
      function normalizeRecordProps(record) {
        const propsObject = {};
        const props = record.props || false;
        if ("component" in record) {
          propsObject.default = props;
        } else {
          for (const name in record.components)
            propsObject[name] = typeof props === "object" ? props[name] : props;
        }
        return propsObject;
      }
      function isAliasRecord(record) {
        while (record) {
          if (record.record.aliasOf)
            return true;
          record = record.parent;
        }
        return false;
      }
      function mergeMetaFields(matched) {
        return matched.reduce((meta, record) => assign$1(meta, record.meta), {});
      }
      function mergeOptions(defaults2, partialOptions) {
        const options = {};
        for (const key in defaults2) {
          options[key] = key in partialOptions ? partialOptions[key] : defaults2[key];
        }
        return options;
      }
      function isRecordChildOf(record, parent) {
        return parent.children.some((child) => child === record || isRecordChildOf(record, child));
      }
      function parseQuery(search) {
        const query = {};
        if (search === "" || search === "?")
          return query;
        const hasLeadingIM = search[0] === "?";
        const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
        for (let i = 0; i < searchParams.length; ++i) {
          const searchParam = searchParams[i].replace(PLUS_RE, " ");
          const eqPos = searchParam.indexOf("=");
          const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
          const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
          if (key in query) {
            let currentValue = query[key];
            if (!isArray$3(currentValue)) {
              currentValue = query[key] = [currentValue];
            }
            currentValue.push(value);
          } else {
            query[key] = value;
          }
        }
        return query;
      }
      function stringifyQuery(query) {
        let search = "";
        for (let key in query) {
          const value = query[key];
          key = encodeQueryKey(key);
          if (value == null) {
            if (value !== void 0) {
              search += (search.length ? "&" : "") + key;
            }
            continue;
          }
          const values = isArray$3(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
          values.forEach((value2) => {
            if (value2 !== void 0) {
              search += (search.length ? "&" : "") + key;
              if (value2 != null)
                search += "=" + value2;
            }
          });
        }
        return search;
      }
      function normalizeQuery(query) {
        const normalizedQuery = {};
        for (const key in query) {
          const value = query[key];
          if (value !== void 0) {
            normalizedQuery[key] = isArray$3(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
          }
        }
        return normalizedQuery;
      }
      const matchedRouteKey = Symbol("");
      const viewDepthKey = Symbol("");
      const routerKey = Symbol("");
      const routeLocationKey = Symbol("");
      const routerViewLocationKey = Symbol("");
      function useCallbacks() {
        let handlers = [];
        function add(handler) {
          handlers.push(handler);
          return () => {
            const i = handlers.indexOf(handler);
            if (i > -1)
              handlers.splice(i, 1);
          };
        }
        function reset() {
          handlers = [];
        }
        return {
          add,
          list: () => handlers.slice(),
          reset
        };
      }
      function guardToPromiseFn(guard, to, from, record, name, runWithContext = (fn) => fn()) {
        const enterCallbackArray = record && // name is defined if record is because of the function overload
        (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
        return () => new Promise((resolve, reject) => {
          const next = (valid) => {
            if (valid === false) {
              reject(createRouterError(4, {
                from,
                to
              }));
            } else if (valid instanceof Error) {
              reject(valid);
            } else if (isRouteLocation(valid)) {
              reject(createRouterError(2, {
                from: to,
                to: valid
              }));
            } else {
              if (enterCallbackArray && // since enterCallbackArray is truthy, both record and name also are
              record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
                enterCallbackArray.push(valid);
              }
              resolve();
            }
          };
          const guardReturn = runWithContext(() => guard.call(record && record.instances[name], to, from, next));
          let guardCall = Promise.resolve(guardReturn);
          if (guard.length < 3)
            guardCall = guardCall.then(next);
          guardCall.catch((err) => reject(err));
        });
      }
      function extractComponentsGuards(matched, guardType, to, from, runWithContext = (fn) => fn()) {
        const guards = [];
        for (const record of matched) {
          for (const name in record.components) {
            let rawComponent = record.components[name];
            if (guardType !== "beforeRouteEnter" && !record.instances[name])
              continue;
            if (isRouteComponent(rawComponent)) {
              const options = rawComponent.__vccOpts || rawComponent;
              const guard = options[guardType];
              guard && guards.push(guardToPromiseFn(guard, to, from, record, name, runWithContext));
            } else {
              let componentPromise = rawComponent();
              guards.push(() => componentPromise.then((resolved) => {
                if (!resolved)
                  return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
                const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
                record.components[name] = resolvedComponent;
                const options = resolvedComponent.__vccOpts || resolvedComponent;
                const guard = options[guardType];
                return guard && guardToPromiseFn(guard, to, from, record, name, runWithContext)();
              }));
            }
          }
        }
        return guards;
      }
      function isRouteComponent(component) {
        return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
      }
      function useLink(props) {
        const router2 = vue.inject(routerKey);
        const currentRoute = vue.inject(routeLocationKey);
        const route = vue.computed(() => {
          const to = vue.unref(props.to);
          return router2.resolve(to);
        });
        const activeRecordIndex = vue.computed(() => {
          const { matched } = route.value;
          const { length } = matched;
          const routeMatched = matched[length - 1];
          const currentMatched = currentRoute.matched;
          if (!routeMatched || !currentMatched.length)
            return -1;
          const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
          if (index > -1)
            return index;
          const parentRecordPath = getOriginalPath(matched[length - 2]);
          return (
            // we are dealing with nested routes
            length > 1 && // if the parent and matched route have the same path, this link is
            // referring to the empty child. Or we currently are on a different
            // child of the same parent
            getOriginalPath(routeMatched) === parentRecordPath && // avoid comparing the child with its parent
            currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index
          );
        });
        const isActive = vue.computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
        const isExactActive = vue.computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
        function navigate(e = {}) {
          if (guardEvent(e)) {
            return router2[vue.unref(props.replace) ? "replace" : "push"](
              vue.unref(props.to)
              // avoid uncaught errors are they are logged anyway
            ).catch(noop$3);
          }
          return Promise.resolve();
        }
        return {
          route,
          href: vue.computed(() => route.value.href),
          isActive,
          isExactActive,
          navigate
        };
      }
      const RouterLinkImpl = /* @__PURE__ */ vue.defineComponent({
        name: "RouterLink",
        compatConfig: { MODE: 3 },
        props: {
          to: {
            type: [String, Object],
            required: true
          },
          replace: Boolean,
          activeClass: String,
          // inactiveClass: String,
          exactActiveClass: String,
          custom: Boolean,
          ariaCurrentValue: {
            type: String,
            default: "page"
          }
        },
        useLink,
        setup(props, { slots }) {
          const link = vue.reactive(useLink(props));
          const { options } = vue.inject(routerKey);
          const elClass = vue.computed(() => ({
            [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
            // [getLinkClass(
            //   props.inactiveClass,
            //   options.linkInactiveClass,
            //   'router-link-inactive'
            // )]: !link.isExactActive,
            [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
          }));
          return () => {
            const children = slots.default && slots.default(link);
            return props.custom ? children : vue.h("a", {
              "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
              href: link.href,
              // this would override user added attrs but Vue will still add
              // the listener, so we end up triggering both
              onClick: link.navigate,
              class: elClass.value
            }, children);
          };
        }
      });
      const RouterLink = RouterLinkImpl;
      function guardEvent(e) {
        if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
          return;
        if (e.defaultPrevented)
          return;
        if (e.button !== void 0 && e.button !== 0)
          return;
        if (e.currentTarget && e.currentTarget.getAttribute) {
          const target = e.currentTarget.getAttribute("target");
          if (/\b_blank\b/i.test(target))
            return;
        }
        if (e.preventDefault)
          e.preventDefault();
        return true;
      }
      function includesParams(outer, inner) {
        for (const key in inner) {
          const innerValue = inner[key];
          const outerValue = outer[key];
          if (typeof innerValue === "string") {
            if (innerValue !== outerValue)
              return false;
          } else {
            if (!isArray$3(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
              return false;
          }
        }
        return true;
      }
      function getOriginalPath(record) {
        return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
      }
      const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
      const RouterViewImpl = /* @__PURE__ */ vue.defineComponent({
        name: "RouterView",
        // #674 we manually inherit them
        inheritAttrs: false,
        props: {
          name: {
            type: String,
            default: "default"
          },
          route: Object
        },
        // Better compat for @vue/compat users
        // https://github.com/vuejs/router/issues/1315
        compatConfig: { MODE: 3 },
        setup(props, { attrs, slots }) {
          const injectedRoute = vue.inject(routerViewLocationKey);
          const routeToDisplay = vue.computed(() => props.route || injectedRoute.value);
          const injectedDepth = vue.inject(viewDepthKey, 0);
          const depth = vue.computed(() => {
            let initialDepth = vue.unref(injectedDepth);
            const { matched } = routeToDisplay.value;
            let matchedRoute;
            while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
              initialDepth++;
            }
            return initialDepth;
          });
          const matchedRouteRef = vue.computed(() => routeToDisplay.value.matched[depth.value]);
          vue.provide(viewDepthKey, vue.computed(() => depth.value + 1));
          vue.provide(matchedRouteKey, matchedRouteRef);
          vue.provide(routerViewLocationKey, routeToDisplay);
          const viewRef = vue.ref();
          vue.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
            if (to) {
              to.instances[name] = instance;
              if (from && from !== to && instance && instance === oldInstance) {
                if (!to.leaveGuards.size) {
                  to.leaveGuards = from.leaveGuards;
                }
                if (!to.updateGuards.size) {
                  to.updateGuards = from.updateGuards;
                }
              }
            }
            if (instance && to && // if there is no instance but to and from are the same this might be
            // the first visit
            (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
              (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
            }
          }, { flush: "post" });
          return () => {
            const route = routeToDisplay.value;
            const currentName = props.name;
            const matchedRoute = matchedRouteRef.value;
            const ViewComponent = matchedRoute && matchedRoute.components[currentName];
            if (!ViewComponent) {
              return normalizeSlot(slots.default, { Component: ViewComponent, route });
            }
            const routePropsOption = matchedRoute.props[currentName];
            const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
            const onVnodeUnmounted = (vnode) => {
              if (vnode.component.isUnmounted) {
                matchedRoute.instances[currentName] = null;
              }
            };
            const component = vue.h(ViewComponent, assign$1({}, routeProps, attrs, {
              onVnodeUnmounted,
              ref: viewRef
            }));
            return (
              // pass the vnode to the slot as a prop.
              // h and <component :is="..."> both accept vnodes
              normalizeSlot(slots.default, { Component: component, route }) || component
            );
          };
        }
      });
      function normalizeSlot(slot, data) {
        if (!slot)
          return null;
        const slotContent = slot(data);
        return slotContent.length === 1 ? slotContent[0] : slotContent;
      }
      const RouterView = RouterViewImpl;
      function createRouter(options) {
        const matcher = createRouterMatcher(options.routes, options);
        const parseQuery$1 = options.parseQuery || parseQuery;
        const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
        const routerHistory = options.history;
        const beforeGuards = useCallbacks();
        const beforeResolveGuards = useCallbacks();
        const afterGuards = useCallbacks();
        const currentRoute = vue.shallowRef(START_LOCATION_NORMALIZED);
        let pendingLocation = START_LOCATION_NORMALIZED;
        if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
          history.scrollRestoration = "manual";
        }
        const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
        const encodeParams = applyToParams.bind(null, encodeParam);
        const decodeParams = (
          // @ts-expect-error: intentionally avoid the type check
          applyToParams.bind(null, decode)
        );
        function addRoute(parentOrRoute, route) {
          let parent;
          let record;
          if (isRouteName(parentOrRoute)) {
            parent = matcher.getRecordMatcher(parentOrRoute);
            record = route;
          } else {
            record = parentOrRoute;
          }
          return matcher.addRoute(record, parent);
        }
        function removeRoute(name) {
          const recordMatcher = matcher.getRecordMatcher(name);
          if (recordMatcher) {
            matcher.removeRoute(recordMatcher);
          }
        }
        function getRoutes() {
          return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
        }
        function hasRoute(name) {
          return !!matcher.getRecordMatcher(name);
        }
        function resolve(rawLocation, currentLocation) {
          currentLocation = assign$1({}, currentLocation || currentRoute.value);
          if (typeof rawLocation === "string") {
            const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
            const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
            const href2 = routerHistory.createHref(locationNormalized.fullPath);
            return assign$1(locationNormalized, matchedRoute2, {
              params: decodeParams(matchedRoute2.params),
              hash: decode(locationNormalized.hash),
              redirectedFrom: void 0,
              href: href2
            });
          }
          let matcherLocation;
          if (rawLocation.path != null) {
            matcherLocation = assign$1({}, rawLocation, {
              path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
            });
          } else {
            const targetParams = assign$1({}, rawLocation.params);
            for (const key in targetParams) {
              if (targetParams[key] == null) {
                delete targetParams[key];
              }
            }
            matcherLocation = assign$1({}, rawLocation, {
              params: encodeParams(targetParams)
            });
            currentLocation.params = encodeParams(currentLocation.params);
          }
          const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
          const hash = rawLocation.hash || "";
          matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
          const fullPath = stringifyURL(stringifyQuery$1, assign$1({}, rawLocation, {
            hash: encodeHash(hash),
            path: matchedRoute.path
          }));
          const href = routerHistory.createHref(fullPath);
          return assign$1({
            fullPath,
            // keep the hash encoded so fullPath is effectively path + encodedQuery +
            // hash
            hash,
            query: (
              // if the user is using a custom query lib like qs, we might have
              // nested objects, so we keep the query as is, meaning it can contain
              // numbers at `$route.query`, but at the point, the user will have to
              // use their own type anyway.
              // https://github.com/vuejs/router/issues/328#issuecomment-649481567
              stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
            )
          }, matchedRoute, {
            redirectedFrom: void 0,
            href
          });
        }
        function locationAsObject(to) {
          return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign$1({}, to);
        }
        function checkCanceledNavigation(to, from) {
          if (pendingLocation !== to) {
            return createRouterError(8, {
              from,
              to
            });
          }
        }
        function push(to) {
          return pushWithRedirect(to);
        }
        function replace(to) {
          return push(assign$1(locationAsObject(to), { replace: true }));
        }
        function handleRedirectRecord(to) {
          const lastMatched = to.matched[to.matched.length - 1];
          if (lastMatched && lastMatched.redirect) {
            const { redirect } = lastMatched;
            let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
            if (typeof newTargetLocation === "string") {
              newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : (
                // force empty params
                { path: newTargetLocation }
              );
              newTargetLocation.params = {};
            }
            return assign$1({
              query: to.query,
              hash: to.hash,
              // avoid transferring params if the redirect has a path
              params: newTargetLocation.path != null ? {} : to.params
            }, newTargetLocation);
          }
        }
        function pushWithRedirect(to, redirectedFrom) {
          const targetLocation = pendingLocation = resolve(to);
          const from = currentRoute.value;
          const data = to.state;
          const force = to.force;
          const replace2 = to.replace === true;
          const shouldRedirect = handleRedirectRecord(targetLocation);
          if (shouldRedirect)
            return pushWithRedirect(
              assign$1(locationAsObject(shouldRedirect), {
                state: typeof shouldRedirect === "object" ? assign$1({}, data, shouldRedirect.state) : data,
                force,
                replace: replace2
              }),
              // keep original redirectedFrom if it exists
              redirectedFrom || targetLocation
            );
          const toLocation = targetLocation;
          toLocation.redirectedFrom = redirectedFrom;
          let failure;
          if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
            failure = createRouterError(16, { to: toLocation, from });
            handleScroll(
              from,
              from,
              // this is a push, the only way for it to be triggered from a
              // history.listen is with a redirect, which makes it become a push
              true,
              // This cannot be the first navigation because the initial location
              // cannot be manually navigated to
              false
            );
          }
          return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? (
            // navigation redirects still mark the router as ready
            isNavigationFailure(
              error,
              2
              /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
            ) ? error : markAsReady(error)
          ) : (
            // reject any unknown error
            triggerError(error, toLocation, from)
          )).then((failure2) => {
            if (failure2) {
              if (isNavigationFailure(
                failure2,
                2
                /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
              )) {
                return pushWithRedirect(
                  // keep options
                  assign$1({
                    // preserve an existing replacement but allow the redirect to override it
                    replace: replace2
                  }, locationAsObject(failure2.to), {
                    state: typeof failure2.to === "object" ? assign$1({}, data, failure2.to.state) : data,
                    force
                  }),
                  // preserve the original redirectedFrom if any
                  redirectedFrom || toLocation
                );
              }
            } else {
              failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
            }
            triggerAfterEach(toLocation, from, failure2);
            return failure2;
          });
        }
        function checkCanceledNavigationAndReject(to, from) {
          const error = checkCanceledNavigation(to, from);
          return error ? Promise.reject(error) : Promise.resolve();
        }
        function runWithContext(fn) {
          const app = installedApps.values().next().value;
          return app && typeof app.runWithContext === "function" ? app.runWithContext(fn) : fn();
        }
        function navigate(to, from) {
          let guards;
          const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
          guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
          for (const record of leavingRecords) {
            record.leaveGuards.forEach((guard) => {
              guards.push(guardToPromiseFn(guard, to, from));
            });
          }
          const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
          guards.push(canceledNavigationCheck);
          return runGuardQueue(guards).then(() => {
            guards = [];
            for (const guard of beforeGuards.list()) {
              guards.push(guardToPromiseFn(guard, to, from));
            }
            guards.push(canceledNavigationCheck);
            return runGuardQueue(guards);
          }).then(() => {
            guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
            for (const record of updatingRecords) {
              record.updateGuards.forEach((guard) => {
                guards.push(guardToPromiseFn(guard, to, from));
              });
            }
            guards.push(canceledNavigationCheck);
            return runGuardQueue(guards);
          }).then(() => {
            guards = [];
            for (const record of enteringRecords) {
              if (record.beforeEnter) {
                if (isArray$3(record.beforeEnter)) {
                  for (const beforeEnter of record.beforeEnter)
                    guards.push(guardToPromiseFn(beforeEnter, to, from));
                } else {
                  guards.push(guardToPromiseFn(record.beforeEnter, to, from));
                }
              }
            }
            guards.push(canceledNavigationCheck);
            return runGuardQueue(guards);
          }).then(() => {
            to.matched.forEach((record) => record.enterCallbacks = {});
            guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from, runWithContext);
            guards.push(canceledNavigationCheck);
            return runGuardQueue(guards);
          }).then(() => {
            guards = [];
            for (const guard of beforeResolveGuards.list()) {
              guards.push(guardToPromiseFn(guard, to, from));
            }
            guards.push(canceledNavigationCheck);
            return runGuardQueue(guards);
          }).catch((err) => isNavigationFailure(
            err,
            8
            /* ErrorTypes.NAVIGATION_CANCELLED */
          ) ? err : Promise.reject(err));
        }
        function triggerAfterEach(to, from, failure) {
          afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
        }
        function finalizeNavigation(toLocation, from, isPush, replace2, data) {
          const error = checkCanceledNavigation(toLocation, from);
          if (error)
            return error;
          const isFirstNavigation = from === START_LOCATION_NORMALIZED;
          const state = !isBrowser ? {} : history.state;
          if (isPush) {
            if (replace2 || isFirstNavigation)
              routerHistory.replace(toLocation.fullPath, assign$1({
                scroll: isFirstNavigation && state && state.scroll
              }, data));
            else
              routerHistory.push(toLocation.fullPath, data);
          }
          currentRoute.value = toLocation;
          handleScroll(toLocation, from, isPush, isFirstNavigation);
          markAsReady();
        }
        let removeHistoryListener;
        function setupListeners() {
          if (removeHistoryListener)
            return;
          removeHistoryListener = routerHistory.listen((to, _from, info) => {
            if (!router2.listening)
              return;
            const toLocation = resolve(to);
            const shouldRedirect = handleRedirectRecord(toLocation);
            if (shouldRedirect) {
              pushWithRedirect(assign$1(shouldRedirect, { replace: true }), toLocation).catch(noop$3);
              return;
            }
            pendingLocation = toLocation;
            const from = currentRoute.value;
            if (isBrowser) {
              saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
            }
            navigate(toLocation, from).catch((error) => {
              if (isNavigationFailure(
                error,
                4 | 8
                /* ErrorTypes.NAVIGATION_CANCELLED */
              )) {
                return error;
              }
              if (isNavigationFailure(
                error,
                2
                /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
              )) {
                pushWithRedirect(
                  error.to,
                  toLocation
                  // avoid an uncaught rejection, let push call triggerError
                ).then((failure) => {
                  if (isNavigationFailure(
                    failure,
                    4 | 16
                    /* ErrorTypes.NAVIGATION_DUPLICATED */
                  ) && !info.delta && info.type === NavigationType.pop) {
                    routerHistory.go(-1, false);
                  }
                }).catch(noop$3);
                return Promise.reject();
              }
              if (info.delta) {
                routerHistory.go(-info.delta, false);
              }
              return triggerError(error, toLocation, from);
            }).then((failure) => {
              failure = failure || finalizeNavigation(
                // after navigation, all matched components are resolved
                toLocation,
                from,
                false
              );
              if (failure) {
                if (info.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
                // entry while a different route is displayed
                !isNavigationFailure(
                  failure,
                  8
                  /* ErrorTypes.NAVIGATION_CANCELLED */
                )) {
                  routerHistory.go(-info.delta, false);
                } else if (info.type === NavigationType.pop && isNavigationFailure(
                  failure,
                  4 | 16
                  /* ErrorTypes.NAVIGATION_DUPLICATED */
                )) {
                  routerHistory.go(-1, false);
                }
              }
              triggerAfterEach(toLocation, from, failure);
            }).catch(noop$3);
          });
        }
        let readyHandlers = useCallbacks();
        let errorListeners = useCallbacks();
        let ready;
        function triggerError(error, to, from) {
          markAsReady(error);
          const list = errorListeners.list();
          if (list.length) {
            list.forEach((handler) => handler(error, to, from));
          } else {
            console.error(error);
          }
          return Promise.reject(error);
        }
        function isReady() {
          if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
            return Promise.resolve();
          return new Promise((resolve2, reject) => {
            readyHandlers.add([resolve2, reject]);
          });
        }
        function markAsReady(err) {
          if (!ready) {
            ready = !err;
            setupListeners();
            readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
            readyHandlers.reset();
          }
          return err;
        }
        function handleScroll(to, from, isPush, isFirstNavigation) {
          const { scrollBehavior } = options;
          if (!isBrowser || !scrollBehavior)
            return Promise.resolve();
          const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
          return vue.nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
        }
        const go = (delta) => routerHistory.go(delta);
        let started;
        const installedApps = /* @__PURE__ */ new Set();
        const router2 = {
          currentRoute,
          listening: true,
          addRoute,
          removeRoute,
          hasRoute,
          getRoutes,
          resolve,
          options,
          push,
          replace,
          go,
          back: () => go(-1),
          forward: () => go(1),
          beforeEach: beforeGuards.add,
          beforeResolve: beforeResolveGuards.add,
          afterEach: afterGuards.add,
          onError: errorListeners.add,
          isReady,
          install(app) {
            const router22 = this;
            app.component("RouterLink", RouterLink);
            app.component("RouterView", RouterView);
            app.config.globalProperties.$router = router22;
            Object.defineProperty(app.config.globalProperties, "$route", {
              enumerable: true,
              get: () => vue.unref(currentRoute)
            });
            if (isBrowser && // used for the initial navigation client side to avoid pushing
            // multiple times when the router is used in multiple apps
            !started && currentRoute.value === START_LOCATION_NORMALIZED) {
              started = true;
              push(routerHistory.location).catch((err) => {
              });
            }
            const reactiveRoute = {};
            for (const key in START_LOCATION_NORMALIZED) {
              Object.defineProperty(reactiveRoute, key, {
                get: () => currentRoute.value[key],
                enumerable: true
              });
            }
            app.provide(routerKey, router22);
            app.provide(routeLocationKey, vue.shallowReactive(reactiveRoute));
            app.provide(routerViewLocationKey, currentRoute);
            const unmountApp = app.unmount;
            installedApps.add(app);
            app.unmount = function() {
              installedApps.delete(app);
              if (installedApps.size < 1) {
                pendingLocation = START_LOCATION_NORMALIZED;
                removeHistoryListener && removeHistoryListener();
                removeHistoryListener = null;
                currentRoute.value = START_LOCATION_NORMALIZED;
                started = false;
                ready = false;
              }
              unmountApp();
            };
          }
        };
        function runGuardQueue(guards) {
          return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
        }
        return router2;
      }
      function extractChangingRecords(to, from) {
        const leavingRecords = [];
        const updatingRecords = [];
        const enteringRecords = [];
        const len = Math.max(from.matched.length, to.matched.length);
        for (let i = 0; i < len; i++) {
          const recordFrom = from.matched[i];
          if (recordFrom) {
            if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
              updatingRecords.push(recordFrom);
            else
              leavingRecords.push(recordFrom);
          }
          const recordTo = to.matched[i];
          if (recordTo) {
            if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
              enteringRecords.push(recordTo);
            }
          }
        }
        return [leavingRecords, updatingRecords, enteringRecords];
      }
      function useRouter() {
        return vue.inject(routerKey);
      }
      const _export_sfc$1 = (sfc, props) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key, val] of props) {
          target[key] = val;
        }
        return target;
      };
      const _hoisted_1$b = { class: "nested-vertical-menu" };
      const _hoisted_2$7 = ["onMouseleave", "onMouseover"];
      const _hoisted_3$5 = ["onClick"];
      const _hoisted_4$3 = { key: 0 };
      const _hoisted_5$3 = ["onClick"];
      const _sfc_main$k = {
        __name: "menu",
        setup(__props) {
          const menuItems = vue.ref([
            { title: "设置", name: "setting" },
            {
              title: "刷课",
              children: [
                { title: "毛概", name: "maoGaiContent" }
              ]
            },
            { title: "首页", name: "index" }
          ]);
          const router2 = useRouter();
          const navigate = (name) => {
            router2.push({ name });
          };
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$b, [
              vue.createElementVNode("ul", null, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(menuItems.value, (item) => {
                  return vue.openBlock(), vue.createElementBlock("li", {
                    key: item.title,
                    onMouseleave: ($event) => item.showChildren = false,
                    onMouseover: ($event) => item.showChildren = true
                  }, [
                    vue.createElementVNode("span", {
                      onClick: ($event) => navigate(item.name)
                    }, vue.toDisplayString(item.title), 9, _hoisted_3$5),
                    item.children && item.showChildren ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_4$3, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item.children, (child) => {
                        return vue.openBlock(), vue.createElementBlock("li", {
                          key: child.title,
                          onClick: ($event) => navigate(child.name)
                        }, vue.toDisplayString(child.title), 9, _hoisted_5$3);
                      }), 128))
                    ])) : vue.createCommentVNode("", true)
                  ], 40, _hoisted_2$7);
                }), 128))
              ])
            ]);
          };
        }
      };
      const Menu = /* @__PURE__ */ _export_sfc$1(_sfc_main$k, [["__scopeId", "data-v-366b16be"]]);
      const _hoisted_1$a = { id: "root" };
      const _sfc_main$j = {
        __name: "closeMenu",
        setup(__props) {
          const hideApp = vue.inject("hideApp");
          const showApp = vue.inject("showApp");
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$a, [
              vue.createElementVNode("div", {
                class: "close",
                onClick: _cache[0] || (_cache[0] = (...args) => vue.unref(hideApp) && vue.unref(hideApp)(...args))
              }),
              vue.createElementVNode("div", {
                class: "hide",
                onClick: _cache[1] || (_cache[1] = (...args) => vue.unref(showApp) && vue.unref(showApp)(...args))
              })
            ]);
          };
        }
      };
      const CloseMenu = /* @__PURE__ */ _export_sfc$1(_sfc_main$j, [["__scopeId", "data-v-8757632a"]]);
      const _hoisted_1$9 = { class: "header" };
      const _hoisted_2$6 = { class: "left" };
      const _sfc_main$i = {
        __name: "header",
        setup(__props) {
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$9, [
              vue.createElementVNode("div", _hoisted_2$6, [
                vue.createVNode(CloseMenu, { class: "close-menu" })
              ]),
              vue.createVNode(Menu, { class: "menuToggle" })
            ]);
          };
        }
      };
      const Header = /* @__PURE__ */ _export_sfc$1(_sfc_main$i, [["__scopeId", "data-v-a0289096"]]);
      const vDraggable = {
        mounted(el, binding) {
          let isDragging = false;
          let currentX;
          let currentY;
          let initialX;
          let initialY;
          let xOffset = 0;
          let yOffset = 0;
          let dragTarget = null;
          el.addEventListener("mousedown", dragStart);
          el.addEventListener("mouseup", dragEnd);
          el.addEventListener("mousemove", drag);
          function dragStart(e) {
            if (e.target.classList.contains("draggable")) {
              dragTarget = e.target;
              initialX = e.clientX - xOffset;
              initialY = e.clientY - yOffset;
              if (e.target === dragTarget) {
                isDragging = true;
              }
            }
          }
          function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            dragTarget = null;
          }
          function drag(e) {
            if (isDragging) {
              e.preventDefault();
              if (e.target === dragTarget) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, el);
              }
            }
          }
          function setTranslate(xPos, yPos, el2) {
            el2.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
          }
        }
      };
      var isVue2 = false;
      /*!
        * pinia v2.0.0-rc.10
        * (c) 2021 Eduardo San Martin Morote
        * @license MIT
        */
      let activePinia;
      const setActivePinia = (pinia2) => activePinia = pinia2;
      const piniaSymbol = (
        /* istanbul ignore next */
        Symbol()
      );
      function isPlainObject$1(o) {
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
        const toBeInstalled = [];
        const pinia2 = vue.markRaw({
          install(app) {
            setActivePinia(pinia2);
            {
              pinia2._a = app;
              app.provide(piniaSymbol, pinia2);
              app.config.globalProperties.$pinia = pinia2;
              toBeInstalled.forEach((plugin) => _p.push(plugin));
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
        return pinia2;
      }
      function addSubscription(subscriptions, callback, detached) {
        subscriptions.push(callback);
        const removeSubscription = () => {
          const idx = subscriptions.indexOf(callback);
          if (idx > -1) {
            subscriptions.splice(idx, 1);
          }
        };
        if (!detached && vue.getCurrentInstance()) {
          vue.onUnmounted(removeSubscription);
        }
        return removeSubscription;
      }
      function triggerSubscriptions(subscriptions, ...args) {
        subscriptions.forEach((callback) => {
          callback(...args);
        });
      }
      function innerPatch(target, patchToApply) {
        for (const key in patchToApply) {
          const subPatch = patchToApply[key];
          const targetValue = target[key];
          if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
            target[key] = innerPatch(targetValue, subPatch);
          } else {
            target[key] = subPatch;
          }
        }
        return target;
      }
      const { assign } = Object;
      function isComputed(o) {
        return o && o.effect;
      }
      function createOptionsStore(id, options, pinia2, hot) {
        const { state, actions, getters } = options;
        const initialState = pinia2.state.value[id];
        let store;
        function setup() {
          if (!initialState && true) {
            {
              pinia2.state.value[id] = state ? state() : {};
            }
          }
          const localState = vue.toRefs(pinia2.state.value[id]);
          return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
            computedGetters[name] = vue.markRaw(vue.computed(() => {
              setActivePinia(pinia2);
              const store2 = pinia2._s.get(id);
              return getters[name].call(store2, store2);
            }));
            return computedGetters;
          }, {}));
        }
        store = createSetupStore(id, setup, options, pinia2);
        store.$reset = function $reset() {
          const newState = state ? state() : {};
          this.$patch(($state) => {
            assign($state, newState);
          });
        };
        return store;
      }
      const noop$2 = () => {
      };
      function createSetupStore($id, setup, options = {}, pinia2, hot) {
        let scope;
        const buildState = options.state;
        const optionsForPlugin = {
          actions: {},
          ...options
        };
        const $subscribeOptions = {
          deep: true
          // flush: 'post',
        };
        let isListening;
        let subscriptions = vue.markRaw([]);
        let actionSubscriptions = vue.markRaw([]);
        let debuggerEvents;
        const initialState = pinia2.state.value[$id];
        if (!initialState && true) {
          {
            pinia2.state.value[$id] = {};
          }
        }
        vue.ref({});
        function $patch(partialStateOrMutator) {
          let subscriptionMutation;
          isListening = false;
          if (typeof partialStateOrMutator === "function") {
            partialStateOrMutator(pinia2.state.value[$id]);
            subscriptionMutation = {
              type: MutationType.patchFunction,
              storeId: $id,
              events: debuggerEvents
            };
          } else {
            innerPatch(pinia2.state.value[$id], partialStateOrMutator);
            subscriptionMutation = {
              type: MutationType.patchObject,
              payload: partialStateOrMutator,
              storeId: $id,
              events: debuggerEvents
            };
          }
          isListening = true;
          triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
        }
        const $reset = noop$2;
        function $dispose() {
          scope.stop();
          subscriptions = [];
          actionSubscriptions = [];
          pinia2._s.delete($id);
        }
        function wrapAction(name, action) {
          return function() {
            setActivePinia(pinia2);
            const args = Array.from(arguments);
            let afterCallback = noop$2;
            let onErrorCallback = noop$2;
            function after(callback) {
              afterCallback = callback;
            }
            function onError(callback) {
              onErrorCallback = callback;
            }
            triggerSubscriptions(actionSubscriptions, {
              args,
              name,
              store,
              after,
              onError
            });
            let ret;
            try {
              ret = action.apply(this && this.$id === $id ? this : store, args);
            } catch (error) {
              if (onErrorCallback(error) !== false) {
                throw error;
              }
            }
            if (ret instanceof Promise) {
              return ret.then((value) => {
                const newRet2 = afterCallback(value);
                return newRet2 === void 0 ? value : newRet2;
              }).catch((error) => {
                if (onErrorCallback(error) !== false) {
                  return Promise.reject(error);
                }
              });
            }
            const newRet = afterCallback(ret);
            return newRet === void 0 ? ret : newRet;
          };
        }
        const partialStore = {
          _p: pinia2,
          // _s: scope,
          $id,
          $onAction: addSubscription.bind(null, actionSubscriptions),
          $patch,
          $reset,
          $subscribe(callback, options2 = {}) {
            const _removeSubscription = addSubscription(
              subscriptions,
              callback,
              // @ts-expect-error: until the deprecation is removed
              options2.detached
            );
            const stopWatcher = scope.run(() => vue.watch(() => pinia2.state.value[$id], (state, oldState) => {
              if (isListening) {
                callback({
                  storeId: $id,
                  type: MutationType.direct,
                  events: debuggerEvents
                }, state);
              }
            }, assign({}, $subscribeOptions, options2)));
            const removeSubscription = () => {
              stopWatcher();
              _removeSubscription();
            };
            return removeSubscription;
          },
          $dispose
        };
        const store = vue.reactive(assign(
          {},
          partialStore
          // must be added later
          // setupStore
        ));
        pinia2._s.set($id, store);
        const setupStore = pinia2._e.run(() => {
          scope = vue.effectScope();
          return scope.run(() => setup());
        });
        for (const key in setupStore) {
          const prop = setupStore[key];
          if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
            if (!buildState) {
              if (initialState) {
                if (vue.isRef(prop)) {
                  prop.value = initialState[key];
                } else {
                  innerPatch(prop, initialState[key]);
                }
              }
              {
                pinia2.state.value[$id][key] = prop;
              }
            }
          } else if (typeof prop === "function") {
            const actionValue = wrapAction(key, prop);
            {
              setupStore[key] = actionValue;
            }
            optionsForPlugin.actions[key] = prop;
          } else
            ;
        }
        {
          assign(store, setupStore);
        }
        Object.defineProperty(store, "$state", {
          get: () => pinia2.state.value[$id],
          set: (state) => {
            $patch(($state) => {
              assign($state, state);
            });
          }
        });
        pinia2._p.forEach((extender) => {
          {
            assign(store, scope.run(() => extender({
              store,
              app: pinia2._a,
              pinia: pinia2,
              // @ts-expect-error
              options: optionsForPlugin
            })));
          }
        });
        if (initialState && buildState) {
          (options.hydrate || innerPatch)(store, initialState);
        }
        isListening = true;
        return store;
      }
      function defineStore(idOrOptions, setup, setupOptions) {
        let id;
        let options;
        const isSetupStore = typeof setup === "function";
        if (typeof idOrOptions === "string") {
          id = idOrOptions;
          options = isSetupStore ? setupOptions : setup;
        } else {
          options = idOrOptions;
          id = idOrOptions.id;
        }
        function useStore(pinia2, hot) {
          const currentInstance = vue.getCurrentInstance();
          pinia2 = // in test mode, ignore the argument provided as we can always retrieve a
          // pinia instance with getActivePinia()
          pinia2 || currentInstance && vue.inject(piniaSymbol);
          if (pinia2)
            setActivePinia(pinia2);
          pinia2 = activePinia;
          if (!pinia2._s.has(id)) {
            if (isSetupStore) {
              createSetupStore(id, setup, options, pinia2);
            } else {
              createOptionsStore(id, options, pinia2);
            }
          }
          const store = pinia2._s.get(id);
          return store;
        }
        useStore.$id = id;
        return useStore;
      }
      const useUserInfoStore = defineStore("userUserInfoStore", () => {
        const courseInfo = vue.ref(JSON.parse(localStorage.getItem("courseInfo")) || {});
        const Token = vue.ref(`Bearer ` + document.cookie.split("Token=")[1].split(";")[0] || "");
        const getCourseInfo = vue.computed(() => {
          return courseInfo.value;
        });
        const getToken = vue.computed(() => {
          return Token.value;
        });
        function refreshCourseInfo() {
          courseInfo.value = JSON.parse(localStorage.getItem("courseInfo")) || {};
        }
        function refreshToken() {
          Token.value = `Bearer ` + document.cookie.split("Token=")[1].split(";")[0] || "";
        }
        function setToken(Token2) {
          document.cookie = `Token=${Token2}`;
        }
        return {
          courseInfo,
          Token,
          getCourseInfo,
          getToken,
          refreshCourseInfo,
          refreshToken,
          setToken
        };
      });
      const _hoisted_1$8 = { class: "content" };
      const _sfc_main$h = {
        __name: "App",
        setup(__props) {
          useRouter();
          const basicRef = vue.ref(null);
          const hideApp = () => {
            if (basicRef.value) {
              basicRef.value.style.height = "40px";
              basicRef.value.style.width = "300px";
            }
          };
          const showApp = () => {
            if (basicRef.value) {
              basicRef.value.style.height = "380px";
              basicRef.value.style.width = "650px";
            }
          };
          vue.provide("hideApp", hideApp);
          vue.provide("showApp", showApp);
          vue.onMounted(() => {
            const UserInfoStore = useUserInfoStore();
            UserInfoStore.refreshToken();
            UserInfoStore.refreshCourseInfo();
          });
          return (_ctx, _cache) => {
            const _component_router_view = vue.resolveComponent("router-view");
            return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
              id: "basic-div",
              ref_key: "basicRef",
              ref: basicRef
            }, [
              vue.createVNode(Header, { class: "draggable" }),
              vue.createElementVNode("div", _hoisted_1$8, [
                vue.createVNode(_component_router_view)
              ])
            ])), [
              [vue.unref(vDraggable)]
            ]);
          };
        }
      };
      const App = /* @__PURE__ */ _export_sfc$1(_sfc_main$h, [["__scopeId", "data-v-a3df5a87"]]);
      var _a;
      const isClient = typeof window !== "undefined";
      const isString$2 = (val) => typeof val === "string";
      const noop$1 = () => {
      };
      isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
      function resolveUnref(r) {
        return typeof r === "function" ? r() : vue.unref(r);
      }
      function createFilterWrapper(filter, fn) {
        function wrapper(...args) {
          return new Promise((resolve, reject) => {
            Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
          });
        }
        return wrapper;
      }
      function debounceFilter(ms, options = {}) {
        let timer;
        let maxTimer;
        let lastRejector = noop$1;
        const _clearTimeout = (timer2) => {
          clearTimeout(timer2);
          lastRejector();
          lastRejector = noop$1;
        };
        const filter = (invoke) => {
          const duration = resolveUnref(ms);
          const maxDuration = resolveUnref(options.maxWait);
          if (timer)
            _clearTimeout(timer);
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
                if (timer)
                  _clearTimeout(timer);
                maxTimer = null;
                resolve(invoke());
              }, maxDuration);
            }
            timer = setTimeout(() => {
              if (maxTimer)
                _clearTimeout(maxTimer);
              maxTimer = null;
              resolve(invoke());
            }, duration);
          });
        };
        return filter;
      }
      function identity$1(arg) {
        return arg;
      }
      function tryOnScopeDispose(fn) {
        if (vue.getCurrentScope()) {
          vue.onScopeDispose(fn);
          return true;
        }
        return false;
      }
      function useDebounceFn(fn, ms = 200, options = {}) {
        return createFilterWrapper(debounceFilter(ms, options), fn);
      }
      function refDebounced(value, ms = 200, options = {}) {
        const debounced = vue.ref(value.value);
        const updater = useDebounceFn(() => {
          debounced.value = value.value;
        }, ms, options);
        vue.watch(value, () => updater());
        return debounced;
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
        if (isString$2(args[0]) || Array.isArray(args[0])) {
          [events, listeners, options] = args;
          target = defaultWindow;
        } else {
          [target, events, listeners, options] = args;
        }
        if (!target)
          return noop$1;
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
      const _global$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      const globalKey = "__vueuse_ssr_handlers__";
      _global$1[globalKey] = _global$1[globalKey] || {};
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
        linear: identity$1
      }, _TransitionPresets);
      const isFirefox = () => isClient && /firefox/i.test(window.navigator.userAgent);
      /**
      * @vue/shared v3.4.27
      * (c) 2018-present Yuxi (Evan) You and Vue contributors
      * @license MIT
      **/
      const NOOP = () => {
      };
      const hasOwnProperty$b = Object.prototype.hasOwnProperty;
      const hasOwn = (val, key) => hasOwnProperty$b.call(val, key);
      const isArray$2 = Array.isArray;
      const isFunction$2 = (val) => typeof val === "function";
      const isString$1 = (val) => typeof val === "string";
      const isObject$2 = (val) => val !== null && typeof val === "object";
      const isPromise = (val) => {
        return (isObject$2(val) || isFunction$2(val)) && isFunction$2(val.then) && isFunction$2(val.catch);
      };
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
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var Symbol$1 = root.Symbol;
      var objectProto$c = Object.prototype;
      var hasOwnProperty$a = objectProto$c.hasOwnProperty;
      var nativeObjectToString$1 = objectProto$c.toString;
      var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty$a.call(value, symToStringTag$1), tag = value[symToStringTag$1];
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
      var objectProto$b = Object.prototype;
      var nativeObjectToString = objectProto$b.toString;
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
      var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      var symbolTag$2 = "[object Symbol]";
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$2;
      }
      function arrayMap(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      var isArray$1 = Array.isArray;
      var INFINITY$1 = 1 / 0;
      var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto$1 ? symbolProto$1.toString : void 0;
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
      function isObject$1(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      function identity(value) {
        return value;
      }
      var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
      function isFunction$1(value) {
        if (!isObject$1(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
      }
      var coreJsData = root["__core-js_shared__"];
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
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
      var funcProto = Function.prototype, objectProto$a = Object.prototype;
      var funcToString = funcProto.toString;
      var hasOwnProperty$9 = objectProto$a.hasOwnProperty;
      var reIsNative = RegExp(
        "^" + funcToString.call(hasOwnProperty$9).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      function baseIsNative(value) {
        if (!isObject$1(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function getValue$1(object, key) {
        return object == null ? void 0 : object[key];
      }
      function getNative(object, key) {
        var value = getValue$1(object, key);
        return baseIsNative(value) ? value : void 0;
      }
      var WeakMap = getNative(root, "WeakMap");
      var objectCreate = Object.create;
      var baseCreate = /* @__PURE__ */ function() {
        function object() {
        }
        return function(proto) {
          if (!isObject$1(proto)) {
            return {};
          }
          if (objectCreate) {
            return objectCreate(proto);
          }
          object.prototype = proto;
          var result = new object();
          object.prototype = void 0;
          return result;
        };
      }();
      function apply(func, thisArg, args) {
        switch (args.length) {
          case 0:
            return func.call(thisArg);
          case 1:
            return func.call(thisArg, args[0]);
          case 2:
            return func.call(thisArg, args[0], args[1]);
          case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
      }
      function copyArray(source, array) {
        var index = -1, length = source.length;
        array || (array = Array(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }
      var HOT_COUNT = 800, HOT_SPAN = 16;
      var nativeNow = Date.now;
      function shortOut(func) {
        var count = 0, lastCalled = 0;
        return function() {
          var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
          lastCalled = stamp;
          if (remaining > 0) {
            if (++count >= HOT_COUNT) {
              return arguments[0];
            }
          } else {
            count = 0;
          }
          return func.apply(void 0, arguments);
        };
      }
      function constant(value) {
        return function() {
          return value;
        };
      }
      var defineProperty = function() {
        try {
          var func = getNative(Object, "defineProperty");
          func({}, "", {});
          return func;
        } catch (e) {
        }
      }();
      var baseSetToString = !defineProperty ? identity : function(func, string2) {
        return defineProperty(func, "toString", {
          "configurable": true,
          "enumerable": false,
          "value": constant(string2),
          "writable": true
        });
      };
      var setToString = shortOut(baseSetToString);
      function arrayEach(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
      var MAX_SAFE_INTEGER$1 = 9007199254740991;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER$1 : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      function baseAssignValue(object, key, value) {
        if (key == "__proto__" && defineProperty) {
          defineProperty(object, key, {
            "configurable": true,
            "enumerable": true,
            "value": value,
            "writable": true
          });
        } else {
          object[key] = value;
        }
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var objectProto$9 = Object.prototype;
      var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
      function assignValue(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty$8.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      function copyObject(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});
        var index = -1, length = props.length;
        while (++index < length) {
          var key = props[index];
          var newValue = void 0;
          if (newValue === void 0) {
            newValue = source[key];
          }
          if (isNew) {
            baseAssignValue(object, key, newValue);
          } else {
            assignValue(object, key, newValue);
          }
        }
        return object;
      }
      var nativeMax = Math.max;
      function overRest(func, start, transform) {
        start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
        return function() {
          var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
          while (++index < length) {
            array[index] = args[start + index];
          }
          index = -1;
          var otherArgs = Array(start + 1);
          while (++index < start) {
            otherArgs[index] = args[index];
          }
          otherArgs[start] = transform(array);
          return apply(func, this, otherArgs);
        };
      }
      var MAX_SAFE_INTEGER = 9007199254740991;
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction$1(value);
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
      var hasOwnProperty$7 = objectProto$7.hasOwnProperty;
      var propertyIsEnumerable$1 = objectProto$7.propertyIsEnumerable;
      var isArguments = baseIsArguments(/* @__PURE__ */ function() {
        return arguments;
      }()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty$7.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
      };
      function stubFalse() {
        return false;
      }
      var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
      var Buffer$2 = moduleExports$2 ? root.Buffer : void 0;
      var nativeIsBuffer = Buffer$2 ? Buffer$2.isBuffer : void 0;
      var isBuffer$1 = nativeIsBuffer || stubFalse;
      var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", errorTag$1 = "[object Error]", funcTag$1 = "[object Function]", mapTag$4 = "[object Map]", numberTag$2 = "[object Number]", objectTag$2 = "[object Object]", regexpTag$2 = "[object RegExp]", setTag$4 = "[object Set]", stringTag$2 = "[object String]", weakMapTag$2 = "[object WeakMap]";
      var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$3 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
      var typedArrayTags = {};
      typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
      typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$2] = typedArrayTags[boolTag$2] = typedArrayTags[dataViewTag$3] = typedArrayTags[dateTag$2] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$4] = typedArrayTags[numberTag$2] = typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$2] = typedArrayTags[setTag$4] = typedArrayTags[stringTag$2] = typedArrayTags[weakMapTag$2] = false;
      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
      var freeProcess = moduleExports$1 && freeGlobal.process;
      var nodeUtil = function() {
        try {
          var types2 = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
          if (types2) {
            return types2;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e) {
        }
      }();
      var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      var isTypedArray$1 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      var objectProto$6 = Object.prototype;
      var hasOwnProperty$6 = objectProto$6.hasOwnProperty;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray$1(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty$6.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
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
      var objectProto$5 = Object.prototype;
      var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (hasOwnProperty$5.call(object, key) && key != "constructor") {
            result.push(key);
          }
        }
        return result;
      }
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function nativeKeysIn(object) {
        var result = [];
        if (object != null) {
          for (var key in Object(object)) {
            result.push(key);
          }
        }
        return result;
      }
      var objectProto$4 = Object.prototype;
      var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
      function baseKeysIn(object) {
        if (!isObject$1(object)) {
          return nativeKeysIn(object);
        }
        var isProto = isPrototype(object), result = [];
        for (var key in object) {
          if (!(key == "constructor" && (isProto || !hasOwnProperty$4.call(object, key)))) {
            result.push(key);
          }
        }
        return result;
      }
      function keysIn(object) {
        return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
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
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }
      var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
      var objectProto$3 = Object.prototype;
      var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED$1 ? void 0 : result;
        }
        return hasOwnProperty$3.call(data, key) ? data[key] : void 0;
      }
      var objectProto$2 = Object.prototype;
      var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty$2.call(data, key);
      }
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
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
      var Map$1 = getNative(root, "Map");
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
      var stringToPath = memoizeCapped(function(string2) {
        var result = [];
        if (string2.charCodeAt(0) === 46) {
          result.push("");
        }
        string2.replace(rePropName, function(match, number, quote, subString) {
          result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
        });
        return result;
      });
      function toString$1(value) {
        return value == null ? "" : baseToString(value);
      }
      function castPath(value, object) {
        if (isArray$1(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString$1(value));
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
      function get$1(object, path, defaultValue) {
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
      var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
      function isFlattenable(value) {
        return isArray$1(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
      }
      function baseFlatten(array, depth, predicate, isStrict, result) {
        var index = -1, length = array.length;
        predicate || (predicate = isFlattenable);
        result || (result = []);
        while (++index < length) {
          var value = array[index];
          if (predicate(value)) {
            {
              arrayPush(result, value);
            }
          } else {
            result[result.length] = value;
          }
        }
        return result;
      }
      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array) : [];
      }
      function flatRest(func) {
        return setToString(overRest(func, void 0, flatten), func + "");
      }
      var getPrototype = overArg(Object.getPrototypeOf, Object);
      function castArray() {
        if (!arguments.length) {
          return [];
        }
        var value = arguments[0];
        return isArray$1(value) ? value : [value];
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
          if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
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
      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }
      function baseAssignIn(object, source) {
        return object && copyObject(source, keysIn(source), object);
      }
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var Buffer$1 = moduleExports ? root.Buffer : void 0, allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : void 0;
      function cloneBuffer(buffer, isDeep) {
        var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result);
        return result;
      }
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
      var objectProto$1 = Object.prototype;
      var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;
      var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
      var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object) {
        if (object == null) {
          return [];
        }
        object = Object(object);
        return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };
      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }
      var nativeGetSymbols = Object.getOwnPropertySymbols;
      var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
        var result = [];
        while (object) {
          arrayPush(result, getSymbols(object));
          object = getPrototype(object);
        }
        return result;
      };
      function copySymbolsIn(source, object) {
        return copyObject(source, getSymbolsIn(source), object);
      }
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }
      var DataView = getNative(root, "DataView");
      var Promise$1 = getNative(root, "Promise");
      var Set$1 = getNative(root, "Set");
      var mapTag$3 = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag$3 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
      var dataViewTag$2 = "[object DataView]";
      var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap);
      var getTag = baseGetTag;
      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$2 || Map$1 && getTag(new Map$1()) != mapTag$3 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$3 || WeakMap && getTag(new WeakMap()) != weakMapTag$1) {
        getTag = function(value) {
          var result = baseGetTag(value), Ctor = result == objectTag$1 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag$2;
              case mapCtorString:
                return mapTag$3;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag$3;
              case weakMapCtorString:
                return weakMapTag$1;
            }
          }
          return result;
        };
      }
      var objectProto = Object.prototype;
      var hasOwnProperty$1 = objectProto.hasOwnProperty;
      function initCloneArray(array) {
        var length = array.length, result = new array.constructor(length);
        if (length && typeof array[0] == "string" && hasOwnProperty$1.call(array, "index")) {
          result.index = array.index;
          result.input = array.input;
        }
        return result;
      }
      var Uint8Array$1 = root.Uint8Array;
      function cloneArrayBuffer(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
        return result;
      }
      function cloneDataView(dataView, isDeep) {
        var buffer = dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      var reFlags = /\w*$/;
      function cloneRegExp(regexp) {
        var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result.lastIndex = regexp.lastIndex;
        return result;
      }
      var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
      function cloneSymbol(symbol) {
        return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      var boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]";
      var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
      function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag$1:
            return cloneArrayBuffer(object);
          case boolTag$1:
          case dateTag$1:
            return new Ctor(+object);
          case dataViewTag$1:
            return cloneDataView(object);
          case float32Tag$1:
          case float64Tag$1:
          case int8Tag$1:
          case int16Tag$1:
          case int32Tag$1:
          case uint8Tag$1:
          case uint8ClampedTag$1:
          case uint16Tag$1:
          case uint32Tag$1:
            return cloneTypedArray(object);
          case mapTag$2:
            return new Ctor();
          case numberTag$1:
          case stringTag$1:
            return new Ctor(object);
          case regexpTag$1:
            return cloneRegExp(object);
          case setTag$2:
            return new Ctor();
          case symbolTag$1:
            return cloneSymbol(object);
        }
      }
      function initCloneObject(object) {
        return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
      }
      var mapTag$1 = "[object Map]";
      function baseIsMap(value) {
        return isObjectLike(value) && getTag(value) == mapTag$1;
      }
      var nodeIsMap = nodeUtil && nodeUtil.isMap;
      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
      var setTag$1 = "[object Set]";
      function baseIsSet(value) {
        return isObjectLike(value) && getTag(value) == setTag$1;
      }
      var nodeIsSet = nodeUtil && nodeUtil.isSet;
      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
      var CLONE_FLAT_FLAG = 2;
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var cloneableTags = {};
      cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      function baseClone(value, bitmask, customizer, key, object, stack) {
        var result, isFlat = bitmask & CLONE_FLAT_FLAG;
        if (result !== void 0) {
          return result;
        }
        if (!isObject$1(value)) {
          return value;
        }
        var isArr = isArray$1(value);
        if (isArr) {
          result = initCloneArray(value);
          {
            return copyArray(value, result);
          }
        } else {
          var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
          if (isBuffer$1(value)) {
            return cloneBuffer(value);
          }
          if (tag == objectTag || tag == argsTag || isFunc && !object) {
            result = isFunc ? {} : initCloneObject(value);
            {
              return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }
            result = initCloneByTag(value, tag);
          }
        }
        stack || (stack = new Stack());
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result);
        if (isSet(value)) {
          value.forEach(function(subValue) {
            result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
          });
        } else if (isMap(value)) {
          value.forEach(function(subValue, key2) {
            result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
          });
        }
        var keysFunc = getAllKeys ;
        var props = isArr ? void 0 : keysFunc(value);
        arrayEach(props || value, function(subValue, key2) {
          if (props) {
            key2 = subValue;
            subValue = value[key2];
          }
          assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
        });
        return result;
      }
      var CLONE_SYMBOLS_FLAG = 4;
      function clone(value) {
        return baseClone(value, CLONE_SYMBOLS_FLAG);
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
        return !!length && isLength(length) && isIndex(key, length) && (isArray$1(object) || isArguments(object));
      }
      function hasIn(object, path) {
        return object != null && hasPath(object, path, baseHasIn);
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
      function isUndefined$2(value) {
        return value === void 0;
      }
      function baseSet(object, path, value, customizer) {
        if (!isObject$1(object)) {
          return object;
        }
        path = castPath(path, object);
        var index = -1, length = path.length, lastIndex = length - 1, nested = object;
        while (nested != null && ++index < length) {
          var key = toKey(path[index]), newValue = value;
          if (key === "__proto__" || key === "constructor" || key === "prototype") {
            return object;
          }
          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = void 0;
            if (newValue === void 0) {
              newValue = isObject$1(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
            }
          }
          assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object;
      }
      function basePickBy(object, paths, predicate) {
        var index = -1, length = paths.length, result = {};
        while (++index < length) {
          var path = paths[index], value = baseGet(object, path);
          if (predicate(value, path)) {
            baseSet(result, castPath(path, object), value);
          }
        }
        return result;
      }
      function basePick(object, paths) {
        return basePickBy(object, paths, function(value, path) {
          return hasIn(object, path);
        });
      }
      var pick = flatRest(function(object, paths) {
        return object == null ? {} : basePick(object, paths);
      });
      function set(object, path, value) {
        return object == null ? object : baseSet(object, path, value);
      }
      const isUndefined$1 = (val) => val === void 0;
      const isBoolean$1 = (val) => typeof val === "boolean";
      const isNumber$1 = (val) => typeof val === "number";
      const isStringNumber = (val) => {
        if (!isString$1(val)) {
          return false;
        }
        return !Number.isNaN(Number(val));
      };
      const getProp = (obj, path, defaultValue) => {
        return {
          get value() {
            return get$1(obj, path, defaultValue);
          },
          set value(val) {
            set(obj, path, val);
          }
        };
      };
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
          const style = element.style[key];
          if (style)
            return style;
          const computed2 = (_a2 = document.defaultView) == null ? void 0 : _a2.getComputedStyle(element, "");
          return computed2 ? computed2[key] : "";
        } catch (e) {
          return element.style[key];
        }
      };
      function addUnit(value, defaultUnit = "px") {
        if (!value)
          return "";
        if (isNumber$1(value) || isStringNumber(value)) {
          return `${value}${defaultUnit}`;
        } else if (isString$1(value)) {
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
      const epPropKey = "__epPropKey";
      const definePropType = (val) => val;
      const isEpProp = (val) => isObject$2(val) && !!val[epPropKey];
      const buildProp = (prop, key) => {
        if (!isObject$2(prop) || isEpProp(prop))
          return prop;
        const { values, required, default: defaultValue, type, validator: validator2 } = prop;
        const _validator = values || validator2 ? (val) => {
          let valid = false;
          let allowedValues = [];
          if (values) {
            allowedValues = Array.from(values);
            if (hasOwn(prop, "default")) {
              allowedValues.push(defaultValue);
            }
            valid || (valid = allowedValues.includes(val));
          }
          if (validator2)
            valid || (valid = validator2(val));
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
      const ValidateComponentsMap = {
        validating: loading_default,
        success: circle_check_default,
        error: circle_close_default
      };
      const withInstall = (main, extra) => {
        main.install = (app) => {
          for (const comp of [main, ...Object.values(extra != null ? extra : {})]) {
            app.component(comp.name, comp);
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
      const composeRefs = (...refs) => {
        return (el) => {
          refs.forEach((ref2) => {
            if (isFunction$2(ref2)) {
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
      const CHANGE_EVENT = "change";
      const INPUT_EVENT = "input";
      const componentSizes = ["", "default", "small", "large"];
      const isValidComponentSize = (val) => ["", ...componentSizes].includes(val);
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
      const translate = (path, option, locale) => get$1(locale, path, path).replace(/\{(\w+)\}/g, (_, key) => {
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
        const locale = vue.inject(localeContextKey, vue.ref());
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
        const derivedNamespace = vue.getCurrentInstance() ? vue.inject(namespaceContextKey, vue.ref(defaultNamespace)) : vue.ref(defaultNamespace);
        const namespace = vue.computed(() => {
          return vue.unref(derivedNamespace) || defaultNamespace;
        });
        return namespace;
      };
      const useNamespace = (block, namespaceOverrides) => {
        const namespace = useGetDerivedNamespace();
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
        const hiddenCls = vue.computed(() => ns.bm("parent", "hidden"));
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
      const initial = {
        current: 0
      };
      const zIndex = vue.ref(0);
      const defaultInitialZIndex = 2e3;
      const ZINDEX_INJECTION_KEY = Symbol("elZIndexContextKey");
      const zIndexContextKey = Symbol("zIndexContextKey");
      const useZIndex = (zIndexOverrides) => {
        const increasingInjection = vue.getCurrentInstance() ? vue.inject(ZINDEX_INJECTION_KEY, initial) : initial;
        const zIndexInjection = vue.getCurrentInstance() ? vue.inject(zIndexContextKey, void 0) : void 0;
        const initialZIndex = vue.computed(() => {
          const zIndexFromInjection = vue.unref(zIndexInjection);
          return isNumber$1(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
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
          const cancelBlur = isFunction$2(beforeBlur) ? beforeBlur(event) : false;
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
      const ariaProps = buildProps({
        ariaLabel: String,
        ariaOrientation: {
          type: String,
          values: ["horizontal", "vertical", "undefined"]
        },
        ariaControls: String
      });
      const useAriaProps = (arias) => {
        return pick(ariaProps, arias);
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
      var _export_sfc = (sfc, props) => {
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
      const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
        ...__default__$b,
        props: iconProps,
        setup(__props) {
          const props = __props;
          const ns = useNamespace("icon");
          const style = vue.computed(() => {
            const { size, color } = props;
            if (!size && !color)
              return {};
            return {
              fontSize: isUndefined$1(size) ? void 0 : addUnit(size),
              "--color": color
            };
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("i", vue.mergeProps({
              class: vue.unref(ns).b(),
              style: vue.unref(style)
            }, _ctx.$attrs), [
              vue.renderSlot(_ctx.$slots, "default")
            ], 16);
          };
        }
      });
      var Icon = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__file", "icon.vue"]]);
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
          return !!(!(props.label || props.ariaLabel) && formItemContext && formItemContext.inputIds && ((_a2 = formItemContext.inputIds) == null ? void 0 : _a2.length) <= 1);
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
      const formMetaProps = buildProps({
        size: {
          type: String,
          values: componentSizes
        },
        disabled: Boolean
      });
      const formProps = buildProps({
        ...formMetaProps,
        model: Object,
        rules: {
          type: definePropType(Object)
        },
        labelPosition: {
          type: String,
          values: ["left", "right", "top"],
          default: "right"
        },
        requireAsteriskPosition: {
          type: String,
          values: ["left", "right"],
          default: "left"
        },
        labelWidth: {
          type: [String, Number],
          default: ""
        },
        labelSuffix: {
          type: String,
          default: ""
        },
        inline: Boolean,
        inlineMessage: Boolean,
        statusIcon: Boolean,
        showMessage: {
          type: Boolean,
          default: true
        },
        validateOnRuleChange: {
          type: Boolean,
          default: true
        },
        hideRequiredAsterisk: Boolean,
        scrollToError: Boolean,
        scrollIntoViewOptions: {
          type: [Object, Boolean]
        }
      });
      const formEmits = {
        validate: (prop, isValid, message) => (isArray$2(prop) || isString$1(prop)) && isBoolean$1(isValid) && isString$1(message)
      };
      function useFormLabelWidth() {
        const potentialLabelWidthArr = vue.ref([]);
        const autoLabelWidth = vue.computed(() => {
          if (!potentialLabelWidthArr.value.length)
            return "0";
          const max = Math.max(...potentialLabelWidthArr.value);
          return max ? `${max}px` : "";
        });
        function getLabelWidthIndex(width) {
          const index = potentialLabelWidthArr.value.indexOf(width);
          if (index === -1 && autoLabelWidth.value === "0")
            ;
          return index;
        }
        function registerLabelWidth(val, oldVal) {
          if (val && oldVal) {
            const index = getLabelWidthIndex(oldVal);
            potentialLabelWidthArr.value.splice(index, 1, val);
          } else if (val) {
            potentialLabelWidthArr.value.push(val);
          }
        }
        function deregisterLabelWidth(val) {
          const index = getLabelWidthIndex(val);
          if (index > -1) {
            potentialLabelWidthArr.value.splice(index, 1);
          }
        }
        return {
          autoLabelWidth,
          registerLabelWidth,
          deregisterLabelWidth
        };
      }
      const filterFields = (fields, props) => {
        const normalized = castArray(props);
        return normalized.length > 0 ? fields.filter((field) => field.prop && normalized.includes(field.prop)) : fields;
      };
      const COMPONENT_NAME$2 = "ElForm";
      const __default__$a = vue.defineComponent({
        name: COMPONENT_NAME$2
      });
      const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
        ...__default__$a,
        props: formProps,
        emits: formEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const fields = [];
          const formSize = useFormSize();
          const ns = useNamespace("form");
          const formClasses = vue.computed(() => {
            const { labelPosition, inline } = props;
            return [
              ns.b(),
              ns.m(formSize.value || "default"),
              {
                [ns.m(`label-${labelPosition}`)]: labelPosition,
                [ns.m("inline")]: inline
              }
            ];
          });
          const getField = (prop) => {
            return fields.find((field) => field.prop === prop);
          };
          const addField = (field) => {
            fields.push(field);
          };
          const removeField = (field) => {
            if (field.prop) {
              fields.splice(fields.indexOf(field), 1);
            }
          };
          const resetFields = (properties = []) => {
            if (!props.model) {
              return;
            }
            filterFields(fields, properties).forEach((field) => field.resetField());
          };
          const clearValidate = (props2 = []) => {
            filterFields(fields, props2).forEach((field) => field.clearValidate());
          };
          const isValidatable = vue.computed(() => {
            const hasModel = !!props.model;
            return hasModel;
          });
          const obtainValidateFields = (props2) => {
            if (fields.length === 0)
              return [];
            const filteredFields = filterFields(fields, props2);
            if (!filteredFields.length) {
              return [];
            }
            return filteredFields;
          };
          const validate = async (callback) => validateField(void 0, callback);
          const doValidateField = async (props2 = []) => {
            if (!isValidatable.value)
              return false;
            const fields2 = obtainValidateFields(props2);
            if (fields2.length === 0)
              return true;
            let validationErrors = {};
            for (const field of fields2) {
              try {
                await field.validate("");
              } catch (fields3) {
                validationErrors = {
                  ...validationErrors,
                  ...fields3
                };
              }
            }
            if (Object.keys(validationErrors).length === 0)
              return true;
            return Promise.reject(validationErrors);
          };
          const validateField = async (modelProps = [], callback) => {
            const shouldThrow = !isFunction$2(callback);
            try {
              const result = await doValidateField(modelProps);
              if (result === true) {
                await (callback == null ? void 0 : callback(result));
              }
              return result;
            } catch (e) {
              if (e instanceof Error)
                throw e;
              const invalidFields = e;
              if (props.scrollToError) {
                scrollToField(Object.keys(invalidFields)[0]);
              }
              await (callback == null ? void 0 : callback(false, invalidFields));
              return shouldThrow && Promise.reject(invalidFields);
            }
          };
          const scrollToField = (prop) => {
            var _a2;
            const field = filterFields(fields, prop)[0];
            if (field) {
              (_a2 = field.$el) == null ? void 0 : _a2.scrollIntoView(props.scrollIntoViewOptions);
            }
          };
          vue.watch(() => props.rules, () => {
            if (props.validateOnRuleChange) {
              validate().catch((err) => debugWarn());
            }
          }, { deep: true });
          vue.provide(formContextKey, vue.reactive({
            ...vue.toRefs(props),
            emit,
            resetFields,
            clearValidate,
            validateField,
            getField,
            addField,
            removeField,
            ...useFormLabelWidth()
          }));
          expose({
            validate,
            validateField,
            resetFields,
            clearValidate,
            scrollToField,
            fields
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("form", {
              class: vue.normalizeClass(vue.unref(formClasses))
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 2);
          };
        }
      });
      var Form = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__file", "form.vue"]]);
      var define_process_env_default = {};
      function _extends() {
        _extends = Object.assign ? Object.assign.bind() : function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };
        return _extends.apply(this, arguments);
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct)
          return false;
        if (Reflect.construct.sham)
          return false;
        if (typeof Proxy === "function")
          return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e) {
          return false;
        }
      }
      function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) {
          _construct = Reflect.construct.bind();
        } else {
          _construct = function _construct2(Parent2, args2, Class2) {
            var a = [null];
            a.push.apply(a, args2);
            var Constructor = Function.bind.apply(Parent2, a);
            var instance = new Constructor();
            if (Class2)
              _setPrototypeOf(instance, Class2.prototype);
            return instance;
          };
        }
        return _construct.apply(null, arguments);
      }
      function _isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
      }
      function _wrapNativeSuper(Class) {
        var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
        _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
          if (Class2 === null || !_isNativeFunction(Class2))
            return Class2;
          if (typeof Class2 !== "function") {
            throw new TypeError("Super expression must either be null or a function");
          }
          if (typeof _cache !== "undefined") {
            if (_cache.has(Class2))
              return _cache.get(Class2);
            _cache.set(Class2, Wrapper);
          }
          function Wrapper() {
            return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
          }
          Wrapper.prototype = Object.create(Class2.prototype, {
            constructor: {
              value: Wrapper,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
          return _setPrototypeOf(Wrapper, Class2);
        };
        return _wrapNativeSuper(Class);
      }
      var formatRegExp = /%[sdj%]/g;
      var warning = function warning2() {
      };
      if (typeof process !== "undefined" && define_process_env_default && false) {
        warning = function warning3(type4, errors) {
          if (typeof console !== "undefined" && console.warn && typeof ASYNC_VALIDATOR_NO_WARNING === "undefined") {
            if (errors.every(function(e) {
              return typeof e === "string";
            })) {
              console.warn(type4, errors);
            }
          }
        };
      }
      function convertFieldsError(errors) {
        if (!errors || !errors.length)
          return null;
        var fields = {};
        errors.forEach(function(error) {
          var field = error.field;
          fields[field] = fields[field] || [];
          fields[field].push(error);
        });
        return fields;
      }
      function format(template) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var i = 0;
        var len = args.length;
        if (typeof template === "function") {
          return template.apply(null, args);
        }
        if (typeof template === "string") {
          var str = template.replace(formatRegExp, function(x) {
            if (x === "%%") {
              return "%";
            }
            if (i >= len) {
              return x;
            }
            switch (x) {
              case "%s":
                return String(args[i++]);
              case "%d":
                return Number(args[i++]);
              case "%j":
                try {
                  return JSON.stringify(args[i++]);
                } catch (_) {
                  return "[Circular]";
                }
                break;
              default:
                return x;
            }
          });
          return str;
        }
        return template;
      }
      function isNativeStringType(type4) {
        return type4 === "string" || type4 === "url" || type4 === "hex" || type4 === "email" || type4 === "date" || type4 === "pattern";
      }
      function isEmptyValue(value, type4) {
        if (value === void 0 || value === null) {
          return true;
        }
        if (type4 === "array" && Array.isArray(value) && !value.length) {
          return true;
        }
        if (isNativeStringType(type4) && typeof value === "string" && !value) {
          return true;
        }
        return false;
      }
      function asyncParallelArray(arr, func, callback) {
        var results = [];
        var total = 0;
        var arrLength = arr.length;
        function count(errors) {
          results.push.apply(results, errors || []);
          total++;
          if (total === arrLength) {
            callback(results);
          }
        }
        arr.forEach(function(a) {
          func(a, count);
        });
      }
      function asyncSerialArray(arr, func, callback) {
        var index = 0;
        var arrLength = arr.length;
        function next(errors) {
          if (errors && errors.length) {
            callback(errors);
            return;
          }
          var original = index;
          index = index + 1;
          if (original < arrLength) {
            func(arr[original], next);
          } else {
            callback([]);
          }
        }
        next([]);
      }
      function flattenObjArr(objArr) {
        var ret = [];
        Object.keys(objArr).forEach(function(k) {
          ret.push.apply(ret, objArr[k] || []);
        });
        return ret;
      }
      var AsyncValidationError = /* @__PURE__ */ function(_Error) {
        _inheritsLoose(AsyncValidationError2, _Error);
        function AsyncValidationError2(errors, fields) {
          var _this;
          _this = _Error.call(this, "Async Validation Error") || this;
          _this.errors = errors;
          _this.fields = fields;
          return _this;
        }
        return AsyncValidationError2;
      }(/* @__PURE__ */ _wrapNativeSuper(Error));
      function asyncMap(objArr, option, func, callback, source) {
        if (option.first) {
          var _pending = new Promise(function(resolve, reject) {
            var next = function next2(errors) {
              callback(errors);
              return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve(source);
            };
            var flattenArr = flattenObjArr(objArr);
            asyncSerialArray(flattenArr, func, next);
          });
          _pending["catch"](function(e) {
            return e;
          });
          return _pending;
        }
        var firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
        var objArrKeys = Object.keys(objArr);
        var objArrLength = objArrKeys.length;
        var total = 0;
        var results = [];
        var pending = new Promise(function(resolve, reject) {
          var next = function next2(errors) {
            results.push.apply(results, errors);
            total++;
            if (total === objArrLength) {
              callback(results);
              return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve(source);
            }
          };
          if (!objArrKeys.length) {
            callback(results);
            resolve(source);
          }
          objArrKeys.forEach(function(key) {
            var arr = objArr[key];
            if (firstFields.indexOf(key) !== -1) {
              asyncSerialArray(arr, func, next);
            } else {
              asyncParallelArray(arr, func, next);
            }
          });
        });
        pending["catch"](function(e) {
          return e;
        });
        return pending;
      }
      function isErrorObj(obj) {
        return !!(obj && obj.message !== void 0);
      }
      function getValue(value, path) {
        var v = value;
        for (var i = 0; i < path.length; i++) {
          if (v == void 0) {
            return v;
          }
          v = v[path[i]];
        }
        return v;
      }
      function complementError(rule, source) {
        return function(oe) {
          var fieldValue;
          if (rule.fullFields) {
            fieldValue = getValue(source, rule.fullFields);
          } else {
            fieldValue = source[oe.field || rule.fullField];
          }
          if (isErrorObj(oe)) {
            oe.field = oe.field || rule.fullField;
            oe.fieldValue = fieldValue;
            return oe;
          }
          return {
            message: typeof oe === "function" ? oe() : oe,
            fieldValue,
            field: oe.field || rule.fullField
          };
        };
      }
      function deepMerge(target, source) {
        if (source) {
          for (var s in source) {
            if (source.hasOwnProperty(s)) {
              var value = source[s];
              if (typeof value === "object" && typeof target[s] === "object") {
                target[s] = _extends({}, target[s], value);
              } else {
                target[s] = value;
              }
            }
          }
        }
        return target;
      }
      var required$1 = function required(rule, value, source, errors, options, type4) {
        if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type4 || rule.type))) {
          errors.push(format(options.messages.required, rule.fullField));
        }
      };
      var whitespace = function whitespace2(rule, value, source, errors, options) {
        if (/^\s+$/.test(value) || value === "") {
          errors.push(format(options.messages.whitespace, rule.fullField));
        }
      };
      var urlReg;
      var getUrlRegex = function() {
        if (urlReg) {
          return urlReg;
        }
        var word = "[a-fA-F\\d:]";
        var b = function b2(options) {
          return options && options.includeBoundaries ? "(?:(?<=\\s|^)(?=" + word + ")|(?<=" + word + ")(?=\\s|$))" : "";
        };
        var v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
        var v6seg = "[a-fA-F\\d]{1,4}";
        var v6 = ("\n(?:\n(?:" + v6seg + ":){7}(?:" + v6seg + "|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:" + v6seg + ":){6}(?:" + v4 + "|:" + v6seg + "|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:" + v6seg + ":){5}(?::" + v4 + "|(?::" + v6seg + "){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:" + v6seg + ":){4}(?:(?::" + v6seg + "){0,1}:" + v4 + "|(?::" + v6seg + "){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:" + v6seg + ":){3}(?:(?::" + v6seg + "){0,2}:" + v4 + "|(?::" + v6seg + "){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:" + v6seg + ":){2}(?:(?::" + v6seg + "){0,3}:" + v4 + "|(?::" + v6seg + "){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:" + v6seg + ":){1}(?:(?::" + v6seg + "){0,4}:" + v4 + "|(?::" + v6seg + "){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::" + v6seg + "){0,5}:" + v4 + "|(?::" + v6seg + "){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n").replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
        var v46Exact = new RegExp("(?:^" + v4 + "$)|(?:^" + v6 + "$)");
        var v4exact = new RegExp("^" + v4 + "$");
        var v6exact = new RegExp("^" + v6 + "$");
        var ip = function ip2(options) {
          return options && options.exact ? v46Exact : new RegExp("(?:" + b(options) + v4 + b(options) + ")|(?:" + b(options) + v6 + b(options) + ")", "g");
        };
        ip.v4 = function(options) {
          return options && options.exact ? v4exact : new RegExp("" + b(options) + v4 + b(options), "g");
        };
        ip.v6 = function(options) {
          return options && options.exact ? v6exact : new RegExp("" + b(options) + v6 + b(options), "g");
        };
        var protocol = "(?:(?:[a-z]+:)?//)";
        var auth = "(?:\\S+(?::\\S*)?@)?";
        var ipv4 = ip.v4().source;
        var ipv6 = ip.v6().source;
        var host = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
        var domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
        var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
        var port = "(?::\\d{2,5})?";
        var path = '(?:[/?#][^\\s"]*)?';
        var regex = "(?:" + protocol + "|www\\.)" + auth + "(?:localhost|" + ipv4 + "|" + ipv6 + "|" + host + domain + tld + ")" + port + path;
        urlReg = new RegExp("(?:^" + regex + "$)", "i");
        return urlReg;
      };
      var pattern$2 = {
        // http://emailregex.com/
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
        // url: new RegExp(
        //   '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
        //   'i',
        // ),
        hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
      };
      var types = {
        integer: function integer(value) {
          return types.number(value) && parseInt(value, 10) === value;
        },
        "float": function float(value) {
          return types.number(value) && !types.integer(value);
        },
        array: function array(value) {
          return Array.isArray(value);
        },
        regexp: function regexp(value) {
          if (value instanceof RegExp) {
            return true;
          }
          try {
            return !!new RegExp(value);
          } catch (e) {
            return false;
          }
        },
        date: function date(value) {
          return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
        },
        number: function number(value) {
          if (isNaN(value)) {
            return false;
          }
          return typeof value === "number";
        },
        object: function object(value) {
          return typeof value === "object" && !types.array(value);
        },
        method: function method(value) {
          return typeof value === "function";
        },
        email: function email(value) {
          return typeof value === "string" && value.length <= 320 && !!value.match(pattern$2.email);
        },
        url: function url(value) {
          return typeof value === "string" && value.length <= 2048 && !!value.match(getUrlRegex());
        },
        hex: function hex(value) {
          return typeof value === "string" && !!value.match(pattern$2.hex);
        }
      };
      var type$1 = function type(rule, value, source, errors, options) {
        if (rule.required && value === void 0) {
          required$1(rule, value, source, errors, options);
          return;
        }
        var custom = ["integer", "float", "array", "regexp", "object", "method", "email", "number", "date", "url", "hex"];
        var ruleType = rule.type;
        if (custom.indexOf(ruleType) > -1) {
          if (!types[ruleType](value)) {
            errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
          }
        } else if (ruleType && typeof value !== rule.type) {
          errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
        }
      };
      var range = function range2(rule, value, source, errors, options) {
        var len = typeof rule.len === "number";
        var min = typeof rule.min === "number";
        var max = typeof rule.max === "number";
        var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
        var val = value;
        var key = null;
        var num = typeof value === "number";
        var str = typeof value === "string";
        var arr = Array.isArray(value);
        if (num) {
          key = "number";
        } else if (str) {
          key = "string";
        } else if (arr) {
          key = "array";
        }
        if (!key) {
          return false;
        }
        if (arr) {
          val = value.length;
        }
        if (str) {
          val = value.replace(spRegexp, "_").length;
        }
        if (len) {
          if (val !== rule.len) {
            errors.push(format(options.messages[key].len, rule.fullField, rule.len));
          }
        } else if (min && !max && val < rule.min) {
          errors.push(format(options.messages[key].min, rule.fullField, rule.min));
        } else if (max && !min && val > rule.max) {
          errors.push(format(options.messages[key].max, rule.fullField, rule.max));
        } else if (min && max && (val < rule.min || val > rule.max)) {
          errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
        }
      };
      var ENUM$1 = "enum";
      var enumerable$1 = function enumerable(rule, value, source, errors, options) {
        rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
        if (rule[ENUM$1].indexOf(value) === -1) {
          errors.push(format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", ")));
        }
      };
      var pattern$1 = function pattern(rule, value, source, errors, options) {
        if (rule.pattern) {
          if (rule.pattern instanceof RegExp) {
            rule.pattern.lastIndex = 0;
            if (!rule.pattern.test(value)) {
              errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
            }
          } else if (typeof rule.pattern === "string") {
            var _pattern = new RegExp(rule.pattern);
            if (!_pattern.test(value)) {
              errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
            }
          }
        }
      };
      var rules = {
        required: required$1,
        whitespace,
        type: type$1,
        range,
        "enum": enumerable$1,
        pattern: pattern$1
      };
      var string = function string2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, "string") && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options, "string");
          if (!isEmptyValue(value, "string")) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
            rules.pattern(rule, value, source, errors, options);
            if (rule.whitespace === true) {
              rules.whitespace(rule, value, source, errors, options);
            }
          }
        }
        callback(errors);
      };
      var method2 = function method3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var number2 = function number3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (value === "") {
            value = void 0;
          }
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var _boolean = function _boolean2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var regexp2 = function regexp3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (!isEmptyValue(value)) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var integer2 = function integer3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var floatFn = function floatFn2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var array2 = function array3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if ((value === void 0 || value === null) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options, "array");
          if (value !== void 0 && value !== null) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var object2 = function object3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var ENUM = "enum";
      var enumerable2 = function enumerable3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules[ENUM](rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var pattern2 = function pattern3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, "string") && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (!isEmptyValue(value, "string")) {
            rules.pattern(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var date2 = function date3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, "date") && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (!isEmptyValue(value, "date")) {
            var dateObject;
            if (value instanceof Date) {
              dateObject = value;
            } else {
              dateObject = new Date(value);
            }
            rules.type(rule, dateObject, source, errors, options);
            if (dateObject) {
              rules.range(rule, dateObject.getTime(), source, errors, options);
            }
          }
        }
        callback(errors);
      };
      var required2 = function required3(rule, value, callback, source, options) {
        var errors = [];
        var type4 = Array.isArray(value) ? "array" : typeof value;
        rules.required(rule, value, source, errors, options, type4);
        callback(errors);
      };
      var type2 = function type3(rule, value, callback, source, options) {
        var ruleType = rule.type;
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, ruleType) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options, ruleType);
          if (!isEmptyValue(value, ruleType)) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var any = function any2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
        }
        callback(errors);
      };
      var validators$2 = {
        string,
        method: method2,
        number: number2,
        "boolean": _boolean,
        regexp: regexp2,
        integer: integer2,
        "float": floatFn,
        array: array2,
        object: object2,
        "enum": enumerable2,
        pattern: pattern2,
        date: date2,
        url: type2,
        hex: type2,
        email: type2,
        required: required2,
        any
      };
      function newMessages() {
        return {
          "default": "Validation error on field %s",
          required: "%s is required",
          "enum": "%s must be one of %s",
          whitespace: "%s cannot be empty",
          date: {
            format: "%s date %s is invalid for format %s",
            parse: "%s date could not be parsed, %s is invalid ",
            invalid: "%s date %s is invalid"
          },
          types: {
            string: "%s is not a %s",
            method: "%s is not a %s (function)",
            array: "%s is not an %s",
            object: "%s is not an %s",
            number: "%s is not a %s",
            date: "%s is not a %s",
            "boolean": "%s is not a %s",
            integer: "%s is not an %s",
            "float": "%s is not a %s",
            regexp: "%s is not a valid %s",
            email: "%s is not a valid %s",
            url: "%s is not a valid %s",
            hex: "%s is not a valid %s"
          },
          string: {
            len: "%s must be exactly %s characters",
            min: "%s must be at least %s characters",
            max: "%s cannot be longer than %s characters",
            range: "%s must be between %s and %s characters"
          },
          number: {
            len: "%s must equal %s",
            min: "%s cannot be less than %s",
            max: "%s cannot be greater than %s",
            range: "%s must be between %s and %s"
          },
          array: {
            len: "%s must be exactly %s in length",
            min: "%s cannot be less than %s in length",
            max: "%s cannot be greater than %s in length",
            range: "%s must be between %s and %s in length"
          },
          pattern: {
            mismatch: "%s value %s does not match pattern %s"
          },
          clone: function clone2() {
            var cloned = JSON.parse(JSON.stringify(this));
            cloned.clone = this.clone;
            return cloned;
          }
        };
      }
      var messages = newMessages();
      var Schema = /* @__PURE__ */ function() {
        function Schema2(descriptor) {
          this.rules = null;
          this._messages = messages;
          this.define(descriptor);
        }
        var _proto = Schema2.prototype;
        _proto.define = function define(rules2) {
          var _this = this;
          if (!rules2) {
            throw new Error("Cannot configure a schema with no rules");
          }
          if (typeof rules2 !== "object" || Array.isArray(rules2)) {
            throw new Error("Rules must be an object");
          }
          this.rules = {};
          Object.keys(rules2).forEach(function(name) {
            var item = rules2[name];
            _this.rules[name] = Array.isArray(item) ? item : [item];
          });
        };
        _proto.messages = function messages2(_messages) {
          if (_messages) {
            this._messages = deepMerge(newMessages(), _messages);
          }
          return this._messages;
        };
        _proto.validate = function validate(source_, o, oc) {
          var _this2 = this;
          if (o === void 0) {
            o = {};
          }
          if (oc === void 0) {
            oc = function oc2() {
            };
          }
          var source = source_;
          var options = o;
          var callback = oc;
          if (typeof options === "function") {
            callback = options;
            options = {};
          }
          if (!this.rules || Object.keys(this.rules).length === 0) {
            if (callback) {
              callback(null, source);
            }
            return Promise.resolve(source);
          }
          function complete(results) {
            var errors = [];
            var fields = {};
            function add(e) {
              if (Array.isArray(e)) {
                var _errors;
                errors = (_errors = errors).concat.apply(_errors, e);
              } else {
                errors.push(e);
              }
            }
            for (var i = 0; i < results.length; i++) {
              add(results[i]);
            }
            if (!errors.length) {
              callback(null, source);
            } else {
              fields = convertFieldsError(errors);
              callback(errors, fields);
            }
          }
          if (options.messages) {
            var messages$1 = this.messages();
            if (messages$1 === messages) {
              messages$1 = newMessages();
            }
            deepMerge(messages$1, options.messages);
            options.messages = messages$1;
          } else {
            options.messages = this.messages();
          }
          var series = {};
          var keys2 = options.keys || Object.keys(this.rules);
          keys2.forEach(function(z) {
            var arr = _this2.rules[z];
            var value = source[z];
            arr.forEach(function(r) {
              var rule = r;
              if (typeof rule.transform === "function") {
                if (source === source_) {
                  source = _extends({}, source);
                }
                value = source[z] = rule.transform(value);
              }
              if (typeof rule === "function") {
                rule = {
                  validator: rule
                };
              } else {
                rule = _extends({}, rule);
              }
              rule.validator = _this2.getValidationMethod(rule);
              if (!rule.validator) {
                return;
              }
              rule.field = z;
              rule.fullField = rule.fullField || z;
              rule.type = _this2.getType(rule);
              series[z] = series[z] || [];
              series[z].push({
                rule,
                value,
                source,
                field: z
              });
            });
          });
          var errorFields = {};
          return asyncMap(series, options, function(data, doIt) {
            var rule = data.rule;
            var deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
            deep = deep && (rule.required || !rule.required && data.value);
            rule.field = data.field;
            function addFullField(key, schema) {
              return _extends({}, schema, {
                fullField: rule.fullField + "." + key,
                fullFields: rule.fullFields ? [].concat(rule.fullFields, [key]) : [key]
              });
            }
            function cb(e) {
              if (e === void 0) {
                e = [];
              }
              var errorList = Array.isArray(e) ? e : [e];
              if (!options.suppressWarning && errorList.length) {
                Schema2.warning("async-validator:", errorList);
              }
              if (errorList.length && rule.message !== void 0) {
                errorList = [].concat(rule.message);
              }
              var filledErrors = errorList.map(complementError(rule, source));
              if (options.first && filledErrors.length) {
                errorFields[rule.field] = 1;
                return doIt(filledErrors);
              }
              if (!deep) {
                doIt(filledErrors);
              } else {
                if (rule.required && !data.value) {
                  if (rule.message !== void 0) {
                    filledErrors = [].concat(rule.message).map(complementError(rule, source));
                  } else if (options.error) {
                    filledErrors = [options.error(rule, format(options.messages.required, rule.field))];
                  }
                  return doIt(filledErrors);
                }
                var fieldsSchema = {};
                if (rule.defaultField) {
                  Object.keys(data.value).map(function(key) {
                    fieldsSchema[key] = rule.defaultField;
                  });
                }
                fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
                var paredFieldsSchema = {};
                Object.keys(fieldsSchema).forEach(function(field) {
                  var fieldSchema = fieldsSchema[field];
                  var fieldSchemaList = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
                  paredFieldsSchema[field] = fieldSchemaList.map(addFullField.bind(null, field));
                });
                var schema = new Schema2(paredFieldsSchema);
                schema.messages(options.messages);
                if (data.rule.options) {
                  data.rule.options.messages = options.messages;
                  data.rule.options.error = options.error;
                }
                schema.validate(data.value, data.rule.options || options, function(errs) {
                  var finalErrors = [];
                  if (filledErrors && filledErrors.length) {
                    finalErrors.push.apply(finalErrors, filledErrors);
                  }
                  if (errs && errs.length) {
                    finalErrors.push.apply(finalErrors, errs);
                  }
                  doIt(finalErrors.length ? finalErrors : null);
                });
              }
            }
            var res;
            if (rule.asyncValidator) {
              res = rule.asyncValidator(rule, data.value, cb, data.source, options);
            } else if (rule.validator) {
              try {
                res = rule.validator(rule, data.value, cb, data.source, options);
              } catch (error) {
                console.error == null ? void 0 : console.error(error);
                if (!options.suppressValidatorError) {
                  setTimeout(function() {
                    throw error;
                  }, 0);
                }
                cb(error.message);
              }
              if (res === true) {
                cb();
              } else if (res === false) {
                cb(typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || (rule.fullField || rule.field) + " fails");
              } else if (res instanceof Array) {
                cb(res);
              } else if (res instanceof Error) {
                cb(res.message);
              }
            }
            if (res && res.then) {
              res.then(function() {
                return cb();
              }, function(e) {
                return cb(e);
              });
            }
          }, function(results) {
            complete(results);
          }, source);
        };
        _proto.getType = function getType(rule) {
          if (rule.type === void 0 && rule.pattern instanceof RegExp) {
            rule.type = "pattern";
          }
          if (typeof rule.validator !== "function" && rule.type && !validators$2.hasOwnProperty(rule.type)) {
            throw new Error(format("Unknown rule type %s", rule.type));
          }
          return rule.type || "string";
        };
        _proto.getValidationMethod = function getValidationMethod(rule) {
          if (typeof rule.validator === "function") {
            return rule.validator;
          }
          var keys2 = Object.keys(rule);
          var messageIndex = keys2.indexOf("message");
          if (messageIndex !== -1) {
            keys2.splice(messageIndex, 1);
          }
          if (keys2.length === 1 && keys2[0] === "required") {
            return validators$2.required;
          }
          return validators$2[this.getType(rule)] || void 0;
        };
        return Schema2;
      }();
      Schema.register = function register(type4, validator2) {
        if (typeof validator2 !== "function") {
          throw new Error("Cannot register a validator by type, validator is not a function");
        }
        validators$2[type4] = validator2;
      };
      Schema.warning = warning;
      Schema.messages = messages;
      Schema.validators = validators$2;
      const formItemValidateStates = [
        "",
        "error",
        "validating",
        "success"
      ];
      const formItemProps = buildProps({
        label: String,
        labelWidth: {
          type: [String, Number],
          default: ""
        },
        prop: {
          type: definePropType([String, Array])
        },
        required: {
          type: Boolean,
          default: void 0
        },
        rules: {
          type: definePropType([Object, Array])
        },
        error: String,
        validateStatus: {
          type: String,
          values: formItemValidateStates
        },
        for: String,
        inlineMessage: {
          type: [String, Boolean],
          default: ""
        },
        showMessage: {
          type: Boolean,
          default: true
        },
        size: {
          type: String,
          values: componentSizes
        }
      });
      const COMPONENT_NAME$1 = "ElLabelWrap";
      var FormLabelWrap = vue.defineComponent({
        name: COMPONENT_NAME$1,
        props: {
          isAutoWidth: Boolean,
          updateAll: Boolean
        },
        setup(props, {
          slots
        }) {
          const formContext = vue.inject(formContextKey, void 0);
          const formItemContext = vue.inject(formItemContextKey);
          if (!formItemContext)
            throwError(COMPONENT_NAME$1, "usage: <el-form-item><label-wrap /></el-form-item>");
          const ns = useNamespace("form");
          const el = vue.ref();
          const computedWidth = vue.ref(0);
          const getLabelWidth = () => {
            var _a2;
            if ((_a2 = el.value) == null ? void 0 : _a2.firstElementChild) {
              const width = window.getComputedStyle(el.value.firstElementChild).width;
              return Math.ceil(Number.parseFloat(width));
            } else {
              return 0;
            }
          };
          const updateLabelWidth = (action = "update") => {
            vue.nextTick(() => {
              if (slots.default && props.isAutoWidth) {
                if (action === "update") {
                  computedWidth.value = getLabelWidth();
                } else if (action === "remove") {
                  formContext == null ? void 0 : formContext.deregisterLabelWidth(computedWidth.value);
                }
              }
            });
          };
          const updateLabelWidthFn = () => updateLabelWidth("update");
          vue.onMounted(() => {
            updateLabelWidthFn();
          });
          vue.onBeforeUnmount(() => {
            updateLabelWidth("remove");
          });
          vue.onUpdated(() => updateLabelWidthFn());
          vue.watch(computedWidth, (val, oldVal) => {
            if (props.updateAll) {
              formContext == null ? void 0 : formContext.registerLabelWidth(val, oldVal);
            }
          });
          useResizeObserver(vue.computed(() => {
            var _a2, _b;
            return (_b = (_a2 = el.value) == null ? void 0 : _a2.firstElementChild) != null ? _b : null;
          }), updateLabelWidthFn);
          return () => {
            var _a2, _b;
            if (!slots)
              return null;
            const {
              isAutoWidth
            } = props;
            if (isAutoWidth) {
              const autoLabelWidth = formContext == null ? void 0 : formContext.autoLabelWidth;
              const hasLabel = formItemContext == null ? void 0 : formItemContext.hasLabel;
              const style = {};
              if (hasLabel && autoLabelWidth && autoLabelWidth !== "auto") {
                const marginWidth = Math.max(0, Number.parseInt(autoLabelWidth, 10) - computedWidth.value);
                const marginPosition = formContext.labelPosition === "left" ? "marginRight" : "marginLeft";
                if (marginWidth) {
                  style[marginPosition] = `${marginWidth}px`;
                }
              }
              return vue.createVNode("div", {
                "ref": el,
                "class": [ns.be("item", "label-wrap")],
                "style": style
              }, [(_a2 = slots.default) == null ? void 0 : _a2.call(slots)]);
            } else {
              return vue.createVNode(vue.Fragment, {
                "ref": el
              }, [(_b = slots.default) == null ? void 0 : _b.call(slots)]);
            }
          };
        }
      });
      const _hoisted_1$7 = ["role", "aria-labelledby"];
      const __default__$9 = vue.defineComponent({
        name: "ElFormItem"
      });
      const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
        ...__default__$9,
        props: formItemProps,
        setup(__props, { expose }) {
          const props = __props;
          const slots = vue.useSlots();
          const formContext = vue.inject(formContextKey, void 0);
          const parentFormItemContext = vue.inject(formItemContextKey, void 0);
          const _size = useFormSize(void 0, { formItem: false });
          const ns = useNamespace("form-item");
          const labelId = useId().value;
          const inputIds = vue.ref([]);
          const validateState = vue.ref("");
          const validateStateDebounced = refDebounced(validateState, 100);
          const validateMessage = vue.ref("");
          const formItemRef = vue.ref();
          let initialValue = void 0;
          let isResettingField = false;
          const labelStyle = vue.computed(() => {
            if ((formContext == null ? void 0 : formContext.labelPosition) === "top") {
              return {};
            }
            const labelWidth = addUnit(props.labelWidth || (formContext == null ? void 0 : formContext.labelWidth) || "");
            if (labelWidth)
              return { width: labelWidth };
            return {};
          });
          const contentStyle = vue.computed(() => {
            if ((formContext == null ? void 0 : formContext.labelPosition) === "top" || (formContext == null ? void 0 : formContext.inline)) {
              return {};
            }
            if (!props.label && !props.labelWidth && isNested) {
              return {};
            }
            const labelWidth = addUnit(props.labelWidth || (formContext == null ? void 0 : formContext.labelWidth) || "");
            if (!props.label && !slots.label) {
              return { marginLeft: labelWidth };
            }
            return {};
          });
          const formItemClasses = vue.computed(() => [
            ns.b(),
            ns.m(_size.value),
            ns.is("error", validateState.value === "error"),
            ns.is("validating", validateState.value === "validating"),
            ns.is("success", validateState.value === "success"),
            ns.is("required", isRequired.value || props.required),
            ns.is("no-asterisk", formContext == null ? void 0 : formContext.hideRequiredAsterisk),
            (formContext == null ? void 0 : formContext.requireAsteriskPosition) === "right" ? "asterisk-right" : "asterisk-left",
            { [ns.m("feedback")]: formContext == null ? void 0 : formContext.statusIcon }
          ]);
          const _inlineMessage = vue.computed(() => isBoolean$1(props.inlineMessage) ? props.inlineMessage : (formContext == null ? void 0 : formContext.inlineMessage) || false);
          const validateClasses = vue.computed(() => [
            ns.e("error"),
            { [ns.em("error", "inline")]: _inlineMessage.value }
          ]);
          const propString = vue.computed(() => {
            if (!props.prop)
              return "";
            return isString$1(props.prop) ? props.prop : props.prop.join(".");
          });
          const hasLabel = vue.computed(() => {
            return !!(props.label || slots.label);
          });
          const labelFor = vue.computed(() => {
            return props.for || (inputIds.value.length === 1 ? inputIds.value[0] : void 0);
          });
          const isGroup = vue.computed(() => {
            return !labelFor.value && hasLabel.value;
          });
          const isNested = !!parentFormItemContext;
          const fieldValue = vue.computed(() => {
            const model = formContext == null ? void 0 : formContext.model;
            if (!model || !props.prop) {
              return;
            }
            return getProp(model, props.prop).value;
          });
          const normalizedRules = vue.computed(() => {
            const { required } = props;
            const rules2 = [];
            if (props.rules) {
              rules2.push(...castArray(props.rules));
            }
            const formRules = formContext == null ? void 0 : formContext.rules;
            if (formRules && props.prop) {
              const _rules = getProp(formRules, props.prop).value;
              if (_rules) {
                rules2.push(...castArray(_rules));
              }
            }
            if (required !== void 0) {
              const requiredRules = rules2.map((rule, i) => [rule, i]).filter(([rule]) => Object.keys(rule).includes("required"));
              if (requiredRules.length > 0) {
                for (const [rule, i] of requiredRules) {
                  if (rule.required === required)
                    continue;
                  rules2[i] = { ...rule, required };
                }
              } else {
                rules2.push({ required });
              }
            }
            return rules2;
          });
          const validateEnabled = vue.computed(() => normalizedRules.value.length > 0);
          const getFilteredRule = (trigger) => {
            const rules2 = normalizedRules.value;
            return rules2.filter((rule) => {
              if (!rule.trigger || !trigger)
                return true;
              if (Array.isArray(rule.trigger)) {
                return rule.trigger.includes(trigger);
              } else {
                return rule.trigger === trigger;
              }
            }).map(({ trigger: trigger2, ...rule }) => rule);
          };
          const isRequired = vue.computed(() => normalizedRules.value.some((rule) => rule.required));
          const shouldShowError = vue.computed(() => {
            var _a2;
            return validateStateDebounced.value === "error" && props.showMessage && ((_a2 = formContext == null ? void 0 : formContext.showMessage) != null ? _a2 : true);
          });
          const currentLabel = vue.computed(() => `${props.label || ""}${(formContext == null ? void 0 : formContext.labelSuffix) || ""}`);
          const setValidationState = (state) => {
            validateState.value = state;
          };
          const onValidationFailed = (error) => {
            var _a2, _b;
            const { errors, fields } = error;
            if (!errors || !fields) {
              console.error(error);
            }
            setValidationState("error");
            validateMessage.value = errors ? (_b = (_a2 = errors == null ? void 0 : errors[0]) == null ? void 0 : _a2.message) != null ? _b : `${props.prop} is required` : "";
            formContext == null ? void 0 : formContext.emit("validate", props.prop, false, validateMessage.value);
          };
          const onValidationSucceeded = () => {
            setValidationState("success");
            formContext == null ? void 0 : formContext.emit("validate", props.prop, true, "");
          };
          const doValidate = async (rules2) => {
            const modelName = propString.value;
            const validator2 = new Schema({
              [modelName]: rules2
            });
            return validator2.validate({ [modelName]: fieldValue.value }, { firstFields: true }).then(() => {
              onValidationSucceeded();
              return true;
            }).catch((err) => {
              onValidationFailed(err);
              return Promise.reject(err);
            });
          };
          const validate = async (trigger, callback) => {
            if (isResettingField || !props.prop) {
              return false;
            }
            const hasCallback = isFunction$2(callback);
            if (!validateEnabled.value) {
              callback == null ? void 0 : callback(false);
              return false;
            }
            const rules2 = getFilteredRule(trigger);
            if (rules2.length === 0) {
              callback == null ? void 0 : callback(true);
              return true;
            }
            setValidationState("validating");
            return doValidate(rules2).then(() => {
              callback == null ? void 0 : callback(true);
              return true;
            }).catch((err) => {
              const { fields } = err;
              callback == null ? void 0 : callback(false, fields);
              return hasCallback ? false : Promise.reject(fields);
            });
          };
          const clearValidate = () => {
            setValidationState("");
            validateMessage.value = "";
            isResettingField = false;
          };
          const resetField = async () => {
            const model = formContext == null ? void 0 : formContext.model;
            if (!model || !props.prop)
              return;
            const computedValue = getProp(model, props.prop);
            isResettingField = true;
            computedValue.value = clone(initialValue);
            await vue.nextTick();
            clearValidate();
            isResettingField = false;
          };
          const addInputId = (id) => {
            if (!inputIds.value.includes(id)) {
              inputIds.value.push(id);
            }
          };
          const removeInputId = (id) => {
            inputIds.value = inputIds.value.filter((listId) => listId !== id);
          };
          vue.watch(() => props.error, (val) => {
            validateMessage.value = val || "";
            setValidationState(val ? "error" : "");
          }, { immediate: true });
          vue.watch(() => props.validateStatus, (val) => setValidationState(val || ""));
          const context = vue.reactive({
            ...vue.toRefs(props),
            $el: formItemRef,
            size: _size,
            validateState,
            labelId,
            inputIds,
            isGroup,
            hasLabel,
            fieldValue,
            addInputId,
            removeInputId,
            resetField,
            clearValidate,
            validate
          });
          vue.provide(formItemContextKey, context);
          vue.onMounted(() => {
            if (props.prop) {
              formContext == null ? void 0 : formContext.addField(context);
              initialValue = clone(fieldValue.value);
            }
          });
          vue.onBeforeUnmount(() => {
            formContext == null ? void 0 : formContext.removeField(context);
          });
          expose({
            size: _size,
            validateMessage,
            validateState,
            validate,
            clearValidate,
            resetField
          });
          return (_ctx, _cache) => {
            var _a2;
            return vue.openBlock(), vue.createElementBlock("div", {
              ref_key: "formItemRef",
              ref: formItemRef,
              class: vue.normalizeClass(vue.unref(formItemClasses)),
              role: vue.unref(isGroup) ? "group" : void 0,
              "aria-labelledby": vue.unref(isGroup) ? vue.unref(labelId) : void 0
            }, [
              vue.createVNode(vue.unref(FormLabelWrap), {
                "is-auto-width": vue.unref(labelStyle).width === "auto",
                "update-all": ((_a2 = vue.unref(formContext)) == null ? void 0 : _a2.labelWidth) === "auto"
              }, {
                default: vue.withCtx(() => [
                  vue.unref(hasLabel) ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(labelFor) ? "label" : "div"), {
                    key: 0,
                    id: vue.unref(labelId),
                    for: vue.unref(labelFor),
                    class: vue.normalizeClass(vue.unref(ns).e("label")),
                    style: vue.normalizeStyle(vue.unref(labelStyle))
                  }, {
                    default: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "label", { label: vue.unref(currentLabel) }, () => [
                        vue.createTextVNode(vue.toDisplayString(vue.unref(currentLabel)), 1)
                      ])
                    ]),
                    _: 3
                  }, 8, ["id", "for", "class", "style"])) : vue.createCommentVNode("v-if", true)
                ]),
                _: 3
              }, 8, ["is-auto-width", "update-all"]),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(ns).e("content")),
                style: vue.normalizeStyle(vue.unref(contentStyle))
              }, [
                vue.renderSlot(_ctx.$slots, "default"),
                vue.createVNode(vue.TransitionGroup, {
                  name: `${vue.unref(ns).namespace.value}-zoom-in-top`
                }, {
                  default: vue.withCtx(() => [
                    vue.unref(shouldShowError) ? vue.renderSlot(_ctx.$slots, "error", {
                      key: 0,
                      error: validateMessage.value
                    }, () => [
                      vue.createElementVNode("div", {
                        class: vue.normalizeClass(vue.unref(validateClasses))
                      }, vue.toDisplayString(validateMessage.value), 3)
                    ]) : vue.createCommentVNode("v-if", true)
                  ]),
                  _: 3
                }, 8, ["name"])
              ], 6)
            ], 10, _hoisted_1$7);
          };
        }
      });
      var FormItem = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__file", "form-item.vue"]]);
      const ElForm = withInstall(Form, {
        FormItem
      });
      const ElFormItem = withNoopInstall(FormItem);
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
        const style = window.getComputedStyle(targetElement);
        const boxSizing = style.getPropertyValue("box-sizing");
        const paddingSize = Number.parseFloat(style.getPropertyValue("padding-bottom")) + Number.parseFloat(style.getPropertyValue("padding-top"));
        const borderSize = Number.parseFloat(style.getPropertyValue("border-bottom-width")) + Number.parseFloat(style.getPropertyValue("border-top-width"));
        const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style.getPropertyValue(name)}`).join(";");
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
        if (isNumber$1(minRows)) {
          let minHeight = singleRowHeight * minRows;
          if (boxSizing === "border-box") {
            minHeight = minHeight + paddingSize + borderSize;
          }
          height = Math.max(minHeight, height);
          result.minHeight = `${minHeight}px`;
        }
        if (isNumber$1(maxRows)) {
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
        },
        ...useAriaProps(["ariaLabel"])
      });
      const inputEmits = {
        [UPDATE_MODEL_EVENT]: (value) => isString$1(value),
        input: (value) => isString$1(value),
        change: (value) => isString$1(value),
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
      const _hoisted_2$5 = ["id", "minlength", "maxlength", "type", "disabled", "readonly", "autocomplete", "tabindex", "aria-label", "placeholder", "form", "autofocus"];
      const _hoisted_3$4 = ["id", "minlength", "maxlength", "tabindex", "disabled", "readonly", "autocomplete", "aria-label", "placeholder", "form", "autofocus"];
      const __default__$8 = vue.defineComponent({
        name: "ElInput",
        inheritAttrs: false
      });
      const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
        ...__default__$8,
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
              const minRows = isObject$2(autosize) ? autosize.minRows : void 0;
              const maxRows = isObject$2(autosize) ? autosize.maxRows : void 0;
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
          useDeprecated({
            from: "label",
            replacement: "aria-label",
            version: "2.8.0",
            scope: "el-input",
            ref: "https://element-plus.org/en-US/component/input.html"
          }, vue.computed(() => !!props.label));
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
                    "aria-label": _ctx.label || _ctx.ariaLabel,
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
                  }), null, 16, _hoisted_2$5),
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
                  "aria-label": _ctx.label || _ctx.ariaLabel,
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
                }), null, 16, _hoisted_3$4),
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
      var Input = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__file", "input.vue"]]);
      const ElInput = withInstall(Input);
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
                    if (!isString$1(focusStartEl)) {
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
      function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
      }
      var ElFocusTrap = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$1], ["__file", "focus-trap.vue"]]);
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
              return new RegExp("^\\p{Unified_Ideograph}{2}$", "u").test(text.trim());
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
        var format2 = false;
        if (typeof color === "string") {
          color = stringInputToObject(color);
        }
        if (typeof color === "object") {
          if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format2 = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
          } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format2 = "hsv";
          } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format2 = "hsl";
          }
          if (Object.prototype.hasOwnProperty.call(color, "a")) {
            a = color.a;
          }
        }
        a = boundAlpha(a);
        return {
          ok,
          format: color.format || format2,
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
          TinyColor2.prototype.toString = function(format2) {
            var formatSet = Boolean(format2);
            format2 = format2 !== null && format2 !== void 0 ? format2 : this.format;
            var formattedString = false;
            var hasAlpha = this.a < 1 && this.a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format2.startsWith("hex") || format2 === "name");
            if (needsAlphaFormat) {
              if (format2 === "name" && this.a === 0) {
                return this.toName();
              }
              return this.toRgbString();
            }
            if (format2 === "rgb") {
              formattedString = this.toRgbString();
            }
            if (format2 === "prgb") {
              formattedString = this.toPercentageRgbString();
            }
            if (format2 === "hex" || format2 === "hex6") {
              formattedString = this.toHexString();
            }
            if (format2 === "hex3") {
              formattedString = this.toHexString(true);
            }
            if (format2 === "hex4") {
              formattedString = this.toHex8String(true);
            }
            if (format2 === "hex8") {
              formattedString = this.toHex8String();
            }
            if (format2 === "name") {
              formattedString = this.toName();
            }
            if (format2 === "hsl") {
              formattedString = this.toHslString();
            }
            if (format2 === "hsv") {
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
      const __default__$7 = vue.defineComponent({
        name: "ElButton"
      });
      const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
        ...__default__$7,
        props: buttonProps,
        emits: buttonEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const buttonStyle = useButtonCustomStyle(props);
          const ns = useNamespace("button");
          const { _ref, _size, _type, _disabled, _props, shouldAddSpace, handleClick } = useButton(props, emit);
          const buttonKls = vue.computed(() => [
            ns.b(),
            ns.m(_type.value),
            ns.m(_size.value),
            ns.is("disabled", _disabled.value),
            ns.is("loading", props.loading),
            ns.is("plain", props.plain),
            ns.is("round", props.round),
            ns.is("circle", props.circle),
            ns.is("text", props.text),
            ns.is("link", props.link),
            ns.is("has-bg", props.bg)
          ]);
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
              class: vue.unref(buttonKls),
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
      var Button = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__file", "button.vue"]]);
      const buttonGroupProps = {
        size: buttonProps.size,
        type: buttonProps.type
      };
      const __default__$6 = vue.defineComponent({
        name: "ElButtonGroup"
      });
      const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
        ...__default__$6,
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
      var ButtonGroup = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__file", "button-group.vue"]]);
      const ElButton = withInstall(Button, {
        ButtonGroup
      });
      withNoopInstall(ButtonGroup);
      const cardProps = buildProps({
        header: {
          type: String,
          default: ""
        },
        footer: {
          type: String,
          default: ""
        },
        bodyStyle: {
          type: definePropType([String, Object, Array]),
          default: ""
        },
        bodyClass: String,
        shadow: {
          type: String,
          values: ["always", "hover", "never"],
          default: "always"
        }
      });
      const __default__$5 = vue.defineComponent({
        name: "ElCard"
      });
      const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
        ...__default__$5,
        props: cardProps,
        setup(__props) {
          const ns = useNamespace("card");
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass([vue.unref(ns).b(), vue.unref(ns).is(`${_ctx.shadow}-shadow`)])
            }, [
              _ctx.$slots.header || _ctx.header ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(vue.unref(ns).e("header"))
              }, [
                vue.renderSlot(_ctx.$slots, "header", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.header), 1)
                ])
              ], 2)) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("div", {
                class: vue.normalizeClass([vue.unref(ns).e("body"), _ctx.bodyClass]),
                style: vue.normalizeStyle(_ctx.bodyStyle)
              }, [
                vue.renderSlot(_ctx.$slots, "default")
              ], 6),
              _ctx.$slots.footer || _ctx.footer ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 1,
                class: vue.normalizeClass(vue.unref(ns).e("footer"))
              }, [
                vue.renderSlot(_ctx.$slots, "footer", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.footer), 1)
                ])
              ], 2)) : vue.createCommentVNode("v-if", true)
            ], 2);
          };
        }
      });
      var Card = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__file", "card.vue"]]);
      const ElCard = withInstall(Card);
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
      const __default__$4 = vue.defineComponent({
        name: "ElTag"
      });
      const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
        ...__default__$4,
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
      var Tag = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__file", "tag.vue"]]);
      const ElTag = withInstall(Tag);
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
      const _hoisted_1$5 = ["aria-level"];
      const _hoisted_2$4 = ["aria-label"];
      const _hoisted_3$3 = ["id"];
      const __default__$3 = vue.defineComponent({ name: "ElDialogContent" });
      const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
        ...__default__$3,
        props: dialogContentProps,
        emits: dialogContentEmits,
        setup(__props) {
          const props = __props;
          const { t } = useLocale();
          const { Close } = CloseComponents;
          const { dialogRef, headerRef, bodyId, ns, style } = vue.inject(dialogInjectionKey);
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
              style: vue.normalizeStyle(vue.unref(style)),
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
                  }, vue.toDisplayString(_ctx.title), 11, _hoisted_1$5)
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
                ], 10, _hoisted_2$4)) : vue.createCommentVNode("v-if", true)
              ], 2),
              vue.createElementVNode("div", {
                id: vue.unref(bodyId),
                class: vue.normalizeClass(vue.unref(ns).e("body"))
              }, [
                vue.renderSlot(_ctx.$slots, "default")
              ], 10, _hoisted_3$3),
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
      var ElDialogContent = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__file", "dialog-content.vue"]]);
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
        [UPDATE_MODEL_EVENT]: (value) => isBoolean$1(value),
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
        const style = vue.computed(() => {
          const style2 = {};
          const varPrefix = `--${namespace.value}-dialog`;
          if (!props.fullscreen) {
            if (props.top) {
              style2[`${varPrefix}-margin-top`] = props.top;
            }
            if (props.width) {
              style2[`${varPrefix}-width`] = addUnit(props.width);
            }
          }
          return style2;
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
            zIndex2.value = isUndefined$2(props.zIndex) ? nextZIndex() : zIndex2.value++;
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
          style,
          overlayDialogStyle,
          rendered,
          visible,
          zIndex: zIndex2
        };
      };
      const _hoisted_1$4 = ["aria-label", "aria-labelledby", "aria-describedby"];
      const __default__$2 = vue.defineComponent({
        name: "ElDialog",
        inheritAttrs: false
      });
      const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
        ...__default__$2,
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
            style,
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
            style
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
                      ], 46, _hoisted_1$4)
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
      var Dialog = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__file", "dialog.vue"]]);
      const ElDialog = withInstall(Dialog);
      const switchProps = buildProps({
        modelValue: {
          type: [Boolean, String, Number],
          default: false
        },
        disabled: {
          type: Boolean,
          default: false
        },
        loading: {
          type: Boolean,
          default: false
        },
        size: {
          type: String,
          validator: isValidComponentSize
        },
        width: {
          type: [String, Number],
          default: ""
        },
        inlinePrompt: {
          type: Boolean,
          default: false
        },
        inactiveActionIcon: {
          type: iconPropType
        },
        activeActionIcon: {
          type: iconPropType
        },
        activeIcon: {
          type: iconPropType
        },
        inactiveIcon: {
          type: iconPropType
        },
        activeText: {
          type: String,
          default: ""
        },
        inactiveText: {
          type: String,
          default: ""
        },
        activeValue: {
          type: [Boolean, String, Number],
          default: true
        },
        inactiveValue: {
          type: [Boolean, String, Number],
          default: false
        },
        name: {
          type: String,
          default: ""
        },
        validateEvent: {
          type: Boolean,
          default: true
        },
        beforeChange: {
          type: definePropType(Function)
        },
        id: String,
        tabindex: {
          type: [String, Number]
        },
        label: {
          type: String,
          default: void 0
        },
        ...useAriaProps(["ariaLabel"])
      });
      const switchEmits = {
        [UPDATE_MODEL_EVENT]: (val) => isBoolean$1(val) || isString$1(val) || isNumber$1(val),
        [CHANGE_EVENT]: (val) => isBoolean$1(val) || isString$1(val) || isNumber$1(val),
        [INPUT_EVENT]: (val) => isBoolean$1(val) || isString$1(val) || isNumber$1(val)
      };
      const _hoisted_1$3 = ["onClick"];
      const _hoisted_2$3 = ["id", "aria-checked", "aria-disabled", "aria-label", "name", "true-value", "false-value", "disabled", "tabindex", "onKeydown"];
      const _hoisted_3$2 = ["aria-hidden"];
      const _hoisted_4$2 = ["aria-hidden"];
      const _hoisted_5$2 = ["aria-hidden"];
      const COMPONENT_NAME = "ElSwitch";
      const __default__$1 = vue.defineComponent({
        name: COMPONENT_NAME
      });
      const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
        ...__default__$1,
        props: switchProps,
        emits: switchEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const { formItem } = useFormItem();
          const switchSize = useFormSize();
          const ns = useNamespace("switch");
          const { inputId } = useFormItemInputId(props, {
            formItemContext: formItem
          });
          const switchDisabled = useFormDisabled(vue.computed(() => props.loading));
          const isControlled = vue.ref(props.modelValue !== false);
          const input = vue.ref();
          const core = vue.ref();
          const switchKls = vue.computed(() => [
            ns.b(),
            ns.m(switchSize.value),
            ns.is("disabled", switchDisabled.value),
            ns.is("checked", checked.value)
          ]);
          const labelLeftKls = vue.computed(() => [
            ns.e("label"),
            ns.em("label", "left"),
            ns.is("active", !checked.value)
          ]);
          const labelRightKls = vue.computed(() => [
            ns.e("label"),
            ns.em("label", "right"),
            ns.is("active", checked.value)
          ]);
          const coreStyle = vue.computed(() => ({
            width: addUnit(props.width)
          }));
          vue.watch(() => props.modelValue, () => {
            isControlled.value = true;
          });
          const actualValue = vue.computed(() => {
            return isControlled.value ? props.modelValue : false;
          });
          const checked = vue.computed(() => actualValue.value === props.activeValue);
          if (![props.activeValue, props.inactiveValue].includes(actualValue.value)) {
            emit(UPDATE_MODEL_EVENT, props.inactiveValue);
            emit(CHANGE_EVENT, props.inactiveValue);
            emit(INPUT_EVENT, props.inactiveValue);
          }
          vue.watch(checked, (val) => {
            var _a2;
            input.value.checked = val;
            if (props.validateEvent) {
              (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => debugWarn());
            }
          });
          const handleChange = () => {
            const val = checked.value ? props.inactiveValue : props.activeValue;
            emit(UPDATE_MODEL_EVENT, val);
            emit(CHANGE_EVENT, val);
            emit(INPUT_EVENT, val);
            vue.nextTick(() => {
              input.value.checked = checked.value;
            });
          };
          const switchValue = () => {
            if (switchDisabled.value)
              return;
            const { beforeChange } = props;
            if (!beforeChange) {
              handleChange();
              return;
            }
            const shouldChange = beforeChange();
            const isPromiseOrBool = [
              isPromise(shouldChange),
              isBoolean$1(shouldChange)
            ].includes(true);
            if (!isPromiseOrBool) {
              throwError(COMPONENT_NAME, "beforeChange must return type `Promise<boolean>` or `boolean`");
            }
            if (isPromise(shouldChange)) {
              shouldChange.then((result) => {
                if (result) {
                  handleChange();
                }
              }).catch((e) => {
              });
            } else if (shouldChange) {
              handleChange();
            }
          };
          const focus = () => {
            var _a2, _b;
            (_b = (_a2 = input.value) == null ? void 0 : _a2.focus) == null ? void 0 : _b.call(_a2);
          };
          vue.onMounted(() => {
            input.value.checked = checked.value;
          });
          useDeprecated({
            from: "label",
            replacement: "aria-label",
            version: "2.8.0",
            scope: "el-switch",
            ref: "https://element-plus.org/en-US/component/switch.html"
          }, vue.computed(() => !!props.label));
          expose({
            focus,
            checked
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass(vue.unref(switchKls)),
              onClick: vue.withModifiers(switchValue, ["prevent"])
            }, [
              vue.createElementVNode("input", {
                id: vue.unref(inputId),
                ref_key: "input",
                ref: input,
                class: vue.normalizeClass(vue.unref(ns).e("input")),
                type: "checkbox",
                role: "switch",
                "aria-checked": vue.unref(checked),
                "aria-disabled": vue.unref(switchDisabled),
                "aria-label": _ctx.label || _ctx.ariaLabel,
                name: _ctx.name,
                "true-value": _ctx.activeValue,
                "false-value": _ctx.inactiveValue,
                disabled: vue.unref(switchDisabled),
                tabindex: _ctx.tabindex,
                onChange: handleChange,
                onKeydown: vue.withKeys(switchValue, ["enter"])
              }, null, 42, _hoisted_2$3),
              !_ctx.inlinePrompt && (_ctx.inactiveIcon || _ctx.inactiveText) ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(vue.unref(labelLeftKls))
              }, [
                _ctx.inactiveIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 0 }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.inactiveIcon)))
                  ]),
                  _: 1
                })) : vue.createCommentVNode("v-if", true),
                !_ctx.inactiveIcon && _ctx.inactiveText ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 1,
                  "aria-hidden": vue.unref(checked)
                }, vue.toDisplayString(_ctx.inactiveText), 9, _hoisted_3$2)) : vue.createCommentVNode("v-if", true)
              ], 2)) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("span", {
                ref_key: "core",
                ref: core,
                class: vue.normalizeClass(vue.unref(ns).e("core")),
                style: vue.normalizeStyle(vue.unref(coreStyle))
              }, [
                _ctx.inlinePrompt ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: vue.normalizeClass(vue.unref(ns).e("inner"))
                }, [
                  _ctx.activeIcon || _ctx.inactiveIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(ns).is("icon"))
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(checked) ? _ctx.activeIcon : _ctx.inactiveIcon)))
                    ]),
                    _: 1
                  }, 8, ["class"])) : _ctx.activeText || _ctx.inactiveText ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 1,
                    class: vue.normalizeClass(vue.unref(ns).is("text")),
                    "aria-hidden": !vue.unref(checked)
                  }, vue.toDisplayString(vue.unref(checked) ? _ctx.activeText : _ctx.inactiveText), 11, _hoisted_4$2)) : vue.createCommentVNode("v-if", true)
                ], 2)) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(vue.unref(ns).e("action"))
                }, [
                  _ctx.loading ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(ns).is("loading"))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(loading_default))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.unref(checked) ? vue.renderSlot(_ctx.$slots, "active-action", { key: 1 }, () => [
                    _ctx.activeActionIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 0 }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.activeActionIcon)))
                      ]),
                      _: 1
                    })) : vue.createCommentVNode("v-if", true)
                  ]) : !vue.unref(checked) ? vue.renderSlot(_ctx.$slots, "inactive-action", { key: 2 }, () => [
                    _ctx.inactiveActionIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 0 }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.inactiveActionIcon)))
                      ]),
                      _: 1
                    })) : vue.createCommentVNode("v-if", true)
                  ]) : vue.createCommentVNode("v-if", true)
                ], 2)
              ], 6),
              !_ctx.inlinePrompt && (_ctx.activeIcon || _ctx.activeText) ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 1,
                class: vue.normalizeClass(vue.unref(labelRightKls))
              }, [
                _ctx.activeIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 0 }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.activeIcon)))
                  ]),
                  _: 1
                })) : vue.createCommentVNode("v-if", true),
                !_ctx.activeIcon && _ctx.activeText ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 1,
                  "aria-hidden": !vue.unref(checked)
                }, vue.toDisplayString(_ctx.activeText), 9, _hoisted_5$2)) : vue.createCommentVNode("v-if", true)
              ], 2)) : vue.createCommentVNode("v-if", true)
            ], 10, _hoisted_1$3);
          };
        }
      });
      var Switch = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__file", "switch.vue"]]);
      const ElSwitch = withInstall(Switch);
      const Timeline = vue.defineComponent({
        name: "ElTimeline",
        setup(_, { slots }) {
          const ns = useNamespace("timeline");
          vue.provide("timeline", slots);
          return () => {
            return vue.h("ul", { class: [ns.b()] }, [vue.renderSlot(slots, "default")]);
          };
        }
      });
      const timelineItemProps = buildProps({
        timestamp: {
          type: String,
          default: ""
        },
        hideTimestamp: {
          type: Boolean,
          default: false
        },
        center: {
          type: Boolean,
          default: false
        },
        placement: {
          type: String,
          values: ["top", "bottom"],
          default: "bottom"
        },
        type: {
          type: String,
          values: ["primary", "success", "warning", "danger", "info"],
          default: ""
        },
        color: {
          type: String,
          default: ""
        },
        size: {
          type: String,
          values: ["normal", "large"],
          default: "normal"
        },
        icon: {
          type: iconPropType
        },
        hollow: {
          type: Boolean,
          default: false
        }
      });
      const __default__ = vue.defineComponent({
        name: "ElTimelineItem"
      });
      const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
        ...__default__,
        props: timelineItemProps,
        setup(__props) {
          const props = __props;
          const ns = useNamespace("timeline-item");
          const defaultNodeKls = vue.computed(() => [
            ns.e("node"),
            ns.em("node", props.size || ""),
            ns.em("node", props.type || ""),
            ns.is("hollow", props.hollow)
          ]);
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("li", {
              class: vue.normalizeClass([vue.unref(ns).b(), { [vue.unref(ns).e("center")]: _ctx.center }])
            }, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(ns).e("tail"))
              }, null, 2),
              !_ctx.$slots.dot ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(vue.unref(defaultNodeKls)),
                style: vue.normalizeStyle({
                  backgroundColor: _ctx.color
                })
              }, [
                _ctx.icon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                  key: 0,
                  class: vue.normalizeClass(vue.unref(ns).e("icon"))
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.icon)))
                  ]),
                  _: 1
                }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
              ], 6)) : vue.createCommentVNode("v-if", true),
              _ctx.$slots.dot ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 1,
                class: vue.normalizeClass(vue.unref(ns).e("dot"))
              }, [
                vue.renderSlot(_ctx.$slots, "dot")
              ], 2)) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(ns).e("wrapper"))
              }, [
                !_ctx.hideTimestamp && _ctx.placement === "top" ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: vue.normalizeClass([vue.unref(ns).e("timestamp"), vue.unref(ns).is("top")])
                }, vue.toDisplayString(_ctx.timestamp), 3)) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(vue.unref(ns).e("content"))
                }, [
                  vue.renderSlot(_ctx.$slots, "default")
                ], 2),
                !_ctx.hideTimestamp && _ctx.placement === "bottom" ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 1,
                  class: vue.normalizeClass([vue.unref(ns).e("timestamp"), vue.unref(ns).is("bottom")])
                }, vue.toDisplayString(_ctx.timestamp), 3)) : vue.createCommentVNode("v-if", true)
              ], 2)
            ], 2);
          };
        }
      });
      var TimelineItem = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__file", "timeline-item.vue"]]);
      const ElTimeline = withInstall(Timeline, {
        TimelineItem
      });
      const ElTimelineItem = withNoopInstall(TimelineItem);
      const _hoisted_1$2 = { id: "cardList" };
      const _hoisted_2$2 = ["onClick"];
      const _sfc_main$3 = {
        __name: "CardList",
        props: {
          cardList: {
            type: Array,
            required: true
          }
        },
        emits: ["clicked"],
        setup(__props, { emit: __emit }) {
          const props = __props;
          const emit = __emit;
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(props.cardList, (card) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: card.id,
                  class: "card",
                  onClick: ($event) => emit("clicked", card.id)
                }, [
                  vue.createElementVNode("h4", null, vue.toDisplayString(card.name), 1),
                  vue.createElementVNode("p", null, "截止日期：" + vue.toDisplayString(String(card.endTime).split(" ")[0]), 1),
                  vue.createElementVNode("p", {
                    style: vue.normalizeStyle([{ color: card.score ? "black" : "red" }, { "float": "right" }])
                  }, vue.toDisplayString(card.score ? card.score + "分" : "未做"), 5)
                ], 8, _hoisted_2$2);
              }), 128))
            ]);
          };
        }
      };
      const CardList = /* @__PURE__ */ _export_sfc$1(_sfc_main$3, [["__scopeId", "data-v-a9d83084"]]);
      function secondToTime(second) {
        let h2 = Math.floor(second / 3600);
        let m = Math.floor(second % 3600 / 60);
        let s = Math.floor(second % 60);
        return `${h2}时${m}分${s}秒`;
      }
      function bind(fn, thisArg) {
        return function wrap() {
          return fn.apply(thisArg, arguments);
        };
      }
      const { toString } = Object.prototype;
      const { getPrototypeOf } = Object;
      const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
        const str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      })(/* @__PURE__ */ Object.create(null));
      const kindOfTest = (type) => {
        type = type.toLowerCase();
        return (thing) => kindOf(thing) === type;
      };
      const typeOfTest = (type) => (thing) => typeof thing === type;
      const { isArray } = Array;
      const isUndefined = typeOfTest("undefined");
      function isBuffer(val) {
        return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
      }
      const isArrayBuffer = kindOfTest("ArrayBuffer");
      function isArrayBufferView(val) {
        let result;
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          result = ArrayBuffer.isView(val);
        } else {
          result = val && val.buffer && isArrayBuffer(val.buffer);
        }
        return result;
      }
      const isString = typeOfTest("string");
      const isFunction = typeOfTest("function");
      const isNumber = typeOfTest("number");
      const isObject = (thing) => thing !== null && typeof thing === "object";
      const isBoolean = (thing) => thing === true || thing === false;
      const isPlainObject = (val) => {
        if (kindOf(val) !== "object") {
          return false;
        }
        const prototype2 = getPrototypeOf(val);
        return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
      };
      const isDate = kindOfTest("Date");
      const isFile = kindOfTest("File");
      const isBlob = kindOfTest("Blob");
      const isFileList = kindOfTest("FileList");
      const isStream = (val) => isObject(val) && isFunction(val.pipe);
      const isFormData = (thing) => {
        let kind;
        return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
        kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
      };
      const isURLSearchParams = kindOfTest("URLSearchParams");
      const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
      const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
      function forEach(obj, fn, { allOwnKeys = false } = {}) {
        if (obj === null || typeof obj === "undefined") {
          return;
        }
        let i;
        let l;
        if (typeof obj !== "object") {
          obj = [obj];
        }
        if (isArray(obj)) {
          for (i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
          }
        } else {
          const keys2 = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
          const len = keys2.length;
          let key;
          for (i = 0; i < len; i++) {
            key = keys2[i];
            fn.call(null, obj[key], key, obj);
          }
        }
      }
      function findKey(obj, key) {
        key = key.toLowerCase();
        const keys2 = Object.keys(obj);
        let i = keys2.length;
        let _key;
        while (i-- > 0) {
          _key = keys2[i];
          if (key === _key.toLowerCase()) {
            return _key;
          }
        }
        return null;
      }
      const _global = (() => {
        if (typeof globalThis !== "undefined")
          return globalThis;
        return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
      })();
      const isContextDefined = (context) => !isUndefined(context) && context !== _global;
      function merge() {
        const { caseless } = isContextDefined(this) && this || {};
        const result = {};
        const assignValue2 = (val, key) => {
          const targetKey = caseless && findKey(result, key) || key;
          if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
            result[targetKey] = merge(result[targetKey], val);
          } else if (isPlainObject(val)) {
            result[targetKey] = merge({}, val);
          } else if (isArray(val)) {
            result[targetKey] = val.slice();
          } else {
            result[targetKey] = val;
          }
        };
        for (let i = 0, l = arguments.length; i < l; i++) {
          arguments[i] && forEach(arguments[i], assignValue2);
        }
        return result;
      }
      const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
        forEach(b, (val, key) => {
          if (thisArg && isFunction(val)) {
            a[key] = bind(val, thisArg);
          } else {
            a[key] = val;
          }
        }, { allOwnKeys });
        return a;
      };
      const stripBOM = (content) => {
        if (content.charCodeAt(0) === 65279) {
          content = content.slice(1);
        }
        return content;
      };
      const inherits = (constructor, superConstructor, props, descriptors2) => {
        constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
        constructor.prototype.constructor = constructor;
        Object.defineProperty(constructor, "super", {
          value: superConstructor.prototype
        });
        props && Object.assign(constructor.prototype, props);
      };
      const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
        let props;
        let i;
        let prop;
        const merged = {};
        destObj = destObj || {};
        if (sourceObj == null)
          return destObj;
        do {
          props = Object.getOwnPropertyNames(sourceObj);
          i = props.length;
          while (i-- > 0) {
            prop = props[i];
            if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
              destObj[prop] = sourceObj[prop];
              merged[prop] = true;
            }
          }
          sourceObj = filter !== false && getPrototypeOf(sourceObj);
        } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
        return destObj;
      };
      const endsWith = (str, searchString, position) => {
        str = String(str);
        if (position === void 0 || position > str.length) {
          position = str.length;
        }
        position -= searchString.length;
        const lastIndex = str.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
      };
      const toArray = (thing) => {
        if (!thing)
          return null;
        if (isArray(thing))
          return thing;
        let i = thing.length;
        if (!isNumber(i))
          return null;
        const arr = new Array(i);
        while (i-- > 0) {
          arr[i] = thing[i];
        }
        return arr;
      };
      const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
        return (thing) => {
          return TypedArray && thing instanceof TypedArray;
        };
      })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
      const forEachEntry = (obj, fn) => {
        const generator = obj && obj[Symbol.iterator];
        const iterator = generator.call(obj);
        let result;
        while ((result = iterator.next()) && !result.done) {
          const pair = result.value;
          fn.call(obj, pair[0], pair[1]);
        }
      };
      const matchAll = (regExp, str) => {
        let matches;
        const arr = [];
        while ((matches = regExp.exec(str)) !== null) {
          arr.push(matches);
        }
        return arr;
      };
      const isHTMLForm = kindOfTest("HTMLFormElement");
      const toCamelCase = (str) => {
        return str.toLowerCase().replace(
          /[-_\s]([a-z\d])(\w*)/g,
          function replacer(m, p1, p2) {
            return p1.toUpperCase() + p2;
          }
        );
      };
      const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
      const isRegExp = kindOfTest("RegExp");
      const reduceDescriptors = (obj, reducer) => {
        const descriptors2 = Object.getOwnPropertyDescriptors(obj);
        const reducedDescriptors = {};
        forEach(descriptors2, (descriptor, name) => {
          let ret;
          if ((ret = reducer(descriptor, name, obj)) !== false) {
            reducedDescriptors[name] = ret || descriptor;
          }
        });
        Object.defineProperties(obj, reducedDescriptors);
      };
      const freezeMethods = (obj) => {
        reduceDescriptors(obj, (descriptor, name) => {
          if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
            return false;
          }
          const value = obj[name];
          if (!isFunction(value))
            return;
          descriptor.enumerable = false;
          if ("writable" in descriptor) {
            descriptor.writable = false;
            return;
          }
          if (!descriptor.set) {
            descriptor.set = () => {
              throw Error("Can not rewrite read-only method '" + name + "'");
            };
          }
        });
      };
      const toObjectSet = (arrayOrString, delimiter) => {
        const obj = {};
        const define = (arr) => {
          arr.forEach((value) => {
            obj[value] = true;
          });
        };
        isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
        return obj;
      };
      const noop = () => {
      };
      const toFiniteNumber = (value, defaultValue) => {
        return value != null && Number.isFinite(value = +value) ? value : defaultValue;
      };
      const ALPHA = "abcdefghijklmnopqrstuvwxyz";
      const DIGIT = "0123456789";
      const ALPHABET = {
        DIGIT,
        ALPHA,
        ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
      };
      const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
        let str = "";
        const { length } = alphabet;
        while (size--) {
          str += alphabet[Math.random() * length | 0];
        }
        return str;
      };
      function isSpecCompliantForm(thing) {
        return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
      }
      const toJSONObject = (obj) => {
        const stack = new Array(10);
        const visit = (source, i) => {
          if (isObject(source)) {
            if (stack.indexOf(source) >= 0) {
              return;
            }
            if (!("toJSON" in source)) {
              stack[i] = source;
              const target = isArray(source) ? [] : {};
              forEach(source, (value, key) => {
                const reducedValue = visit(value, i + 1);
                !isUndefined(reducedValue) && (target[key] = reducedValue);
              });
              stack[i] = void 0;
              return target;
            }
          }
          return source;
        };
        return visit(obj, 0);
      };
      const isAsyncFn = kindOfTest("AsyncFunction");
      const isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
      const utils$1 = {
        isArray,
        isArrayBuffer,
        isBuffer,
        isFormData,
        isArrayBufferView,
        isString,
        isNumber,
        isBoolean,
        isObject,
        isPlainObject,
        isReadableStream,
        isRequest,
        isResponse,
        isHeaders,
        isUndefined,
        isDate,
        isFile,
        isBlob,
        isRegExp,
        isFunction,
        isStream,
        isURLSearchParams,
        isTypedArray,
        isFileList,
        forEach,
        merge,
        extend,
        trim,
        stripBOM,
        inherits,
        toFlatObject,
        kindOf,
        kindOfTest,
        endsWith,
        toArray,
        forEachEntry,
        matchAll,
        isHTMLForm,
        hasOwnProperty,
        hasOwnProp: hasOwnProperty,
        // an alias to avoid ESLint no-prototype-builtins detection
        reduceDescriptors,
        freezeMethods,
        toObjectSet,
        toCamelCase,
        noop,
        toFiniteNumber,
        findKey,
        global: _global,
        isContextDefined,
        ALPHABET,
        generateString,
        isSpecCompliantForm,
        toJSONObject,
        isAsyncFn,
        isThenable
      };
      function AxiosError(message, code, config, request, response) {
        Error.call(this);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        } else {
          this.stack = new Error().stack;
        }
        this.message = message;
        this.name = "AxiosError";
        code && (this.code = code);
        config && (this.config = config);
        request && (this.request = request);
        response && (this.response = response);
      }
      utils$1.inherits(AxiosError, Error, {
        toJSON: function toJSON() {
          return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: utils$1.toJSONObject(this.config),
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null
          };
        }
      });
      const prototype$1 = AxiosError.prototype;
      const descriptors = {};
      [
        "ERR_BAD_OPTION_VALUE",
        "ERR_BAD_OPTION",
        "ECONNABORTED",
        "ETIMEDOUT",
        "ERR_NETWORK",
        "ERR_FR_TOO_MANY_REDIRECTS",
        "ERR_DEPRECATED",
        "ERR_BAD_RESPONSE",
        "ERR_BAD_REQUEST",
        "ERR_CANCELED",
        "ERR_NOT_SUPPORT",
        "ERR_INVALID_URL"
        // eslint-disable-next-line func-names
      ].forEach((code) => {
        descriptors[code] = { value: code };
      });
      Object.defineProperties(AxiosError, descriptors);
      Object.defineProperty(prototype$1, "isAxiosError", { value: true });
      AxiosError.from = (error, code, config, request, response, customProps) => {
        const axiosError = Object.create(prototype$1);
        utils$1.toFlatObject(error, axiosError, function filter(obj) {
          return obj !== Error.prototype;
        }, (prop) => {
          return prop !== "isAxiosError";
        });
        AxiosError.call(axiosError, error.message, code, config, request, response);
        axiosError.cause = error;
        axiosError.name = error.name;
        customProps && Object.assign(axiosError, customProps);
        return axiosError;
      };
      const httpAdapter = null;
      function isVisitable(thing) {
        return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
      }
      function removeBrackets(key) {
        return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
      }
      function renderKey(path, key, dots) {
        if (!path)
          return key;
        return path.concat(key).map(function each(token, i) {
          token = removeBrackets(token);
          return !dots && i ? "[" + token + "]" : token;
        }).join(dots ? "." : "");
      }
      function isFlatArray(arr) {
        return utils$1.isArray(arr) && !arr.some(isVisitable);
      }
      const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
        return /^is[A-Z]/.test(prop);
      });
      function toFormData(obj, formData, options) {
        if (!utils$1.isObject(obj)) {
          throw new TypeError("target must be an object");
        }
        formData = formData || new FormData();
        options = utils$1.toFlatObject(options, {
          metaTokens: true,
          dots: false,
          indexes: false
        }, false, function defined(option, source) {
          return !utils$1.isUndefined(source[option]);
        });
        const metaTokens = options.metaTokens;
        const visitor = options.visitor || defaultVisitor;
        const dots = options.dots;
        const indexes = options.indexes;
        const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
        const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
        if (!utils$1.isFunction(visitor)) {
          throw new TypeError("visitor must be a function");
        }
        function convertValue(value) {
          if (value === null)
            return "";
          if (utils$1.isDate(value)) {
            return value.toISOString();
          }
          if (!useBlob && utils$1.isBlob(value)) {
            throw new AxiosError("Blob is not supported. Use a Buffer instead.");
          }
          if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
            return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
          }
          return value;
        }
        function defaultVisitor(value, key, path) {
          let arr = value;
          if (value && !path && typeof value === "object") {
            if (utils$1.endsWith(key, "{}")) {
              key = metaTokens ? key : key.slice(0, -2);
              value = JSON.stringify(value);
            } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
              key = removeBrackets(key);
              arr.forEach(function each(el, index) {
                !(utils$1.isUndefined(el) || el === null) && formData.append(
                  // eslint-disable-next-line no-nested-ternary
                  indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
                  convertValue(el)
                );
              });
              return false;
            }
          }
          if (isVisitable(value)) {
            return true;
          }
          formData.append(renderKey(path, key, dots), convertValue(value));
          return false;
        }
        const stack = [];
        const exposedHelpers = Object.assign(predicates, {
          defaultVisitor,
          convertValue,
          isVisitable
        });
        function build(value, path) {
          if (utils$1.isUndefined(value))
            return;
          if (stack.indexOf(value) !== -1) {
            throw Error("Circular reference detected in " + path.join("."));
          }
          stack.push(value);
          utils$1.forEach(value, function each(el, key) {
            const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
              formData,
              el,
              utils$1.isString(key) ? key.trim() : key,
              path,
              exposedHelpers
            );
            if (result === true) {
              build(el, path ? path.concat(key) : [key]);
            }
          });
          stack.pop();
        }
        if (!utils$1.isObject(obj)) {
          throw new TypeError("data must be an object");
        }
        build(obj);
        return formData;
      }
      function encode$1(str) {
        const charMap = {
          "!": "%21",
          "'": "%27",
          "(": "%28",
          ")": "%29",
          "~": "%7E",
          "%20": "+",
          "%00": "\0"
        };
        return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
          return charMap[match];
        });
      }
      function AxiosURLSearchParams(params, options) {
        this._pairs = [];
        params && toFormData(params, this, options);
      }
      const prototype = AxiosURLSearchParams.prototype;
      prototype.append = function append(name, value) {
        this._pairs.push([name, value]);
      };
      prototype.toString = function toString2(encoder) {
        const _encode = encoder ? function(value) {
          return encoder.call(this, value, encode$1);
        } : encode$1;
        return this._pairs.map(function each(pair) {
          return _encode(pair[0]) + "=" + _encode(pair[1]);
        }, "").join("&");
      };
      function encode(val) {
        return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      function buildURL(url, params, options) {
        if (!params) {
          return url;
        }
        const _encode = options && options.encode || encode;
        const serializeFn = options && options.serialize;
        let serializedParams;
        if (serializeFn) {
          serializedParams = serializeFn(params, options);
        } else {
          serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
        }
        if (serializedParams) {
          const hashmarkIndex = url.indexOf("#");
          if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
          }
          url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
        }
        return url;
      }
      class InterceptorManager {
        constructor() {
          this.handlers = [];
        }
        /**
         * Add a new interceptor to the stack
         *
         * @param {Function} fulfilled The function to handle `then` for a `Promise`
         * @param {Function} rejected The function to handle `reject` for a `Promise`
         *
         * @return {Number} An ID used to remove interceptor later
         */
        use(fulfilled, rejected, options) {
          this.handlers.push({
            fulfilled,
            rejected,
            synchronous: options ? options.synchronous : false,
            runWhen: options ? options.runWhen : null
          });
          return this.handlers.length - 1;
        }
        /**
         * Remove an interceptor from the stack
         *
         * @param {Number} id The ID that was returned by `use`
         *
         * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
         */
        eject(id) {
          if (this.handlers[id]) {
            this.handlers[id] = null;
          }
        }
        /**
         * Clear all interceptors from the stack
         *
         * @returns {void}
         */
        clear() {
          if (this.handlers) {
            this.handlers = [];
          }
        }
        /**
         * Iterate over all the registered interceptors
         *
         * This method is particularly useful for skipping over any
         * interceptors that may have become `null` calling `eject`.
         *
         * @param {Function} fn The function to call for each interceptor
         *
         * @returns {void}
         */
        forEach(fn) {
          utils$1.forEach(this.handlers, function forEachHandler(h2) {
            if (h2 !== null) {
              fn(h2);
            }
          });
        }
      }
      const transitionalDefaults = {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
      };
      const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
      const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
      const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
      const platform$1 = {
        isBrowser: true,
        classes: {
          URLSearchParams: URLSearchParams$1,
          FormData: FormData$1,
          Blob: Blob$1
        },
        protocols: ["http", "https", "file", "blob", "url", "data"]
      };
      const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
      const hasStandardBrowserEnv = ((product) => {
        return hasBrowserEnv && ["ReactNative", "NativeScript", "NS"].indexOf(product) < 0;
      })(typeof navigator !== "undefined" && navigator.product);
      const hasStandardBrowserWebWorkerEnv = (() => {
        return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
        self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
      })();
      const origin = hasBrowserEnv && window.location.href || "http://localhost";
      const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
        __proto__: null,
        hasBrowserEnv,
        hasStandardBrowserEnv,
        hasStandardBrowserWebWorkerEnv,
        origin
      }, Symbol.toStringTag, { value: "Module" }));
      const platform = {
        ...utils,
        ...platform$1
      };
      function toURLEncodedForm(data, options) {
        return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
          visitor: function(value, key, path, helpers) {
            if (platform.isNode && utils$1.isBuffer(value)) {
              this.append(key, value.toString("base64"));
              return false;
            }
            return helpers.defaultVisitor.apply(this, arguments);
          }
        }, options));
      }
      function parsePropPath(name) {
        return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
          return match[0] === "[]" ? "" : match[1] || match[0];
        });
      }
      function arrayToObject(arr) {
        const obj = {};
        const keys2 = Object.keys(arr);
        let i;
        const len = keys2.length;
        let key;
        for (i = 0; i < len; i++) {
          key = keys2[i];
          obj[key] = arr[key];
        }
        return obj;
      }
      function formDataToJSON(formData) {
        function buildPath(path, value, target, index) {
          let name = path[index++];
          if (name === "__proto__")
            return true;
          const isNumericKey = Number.isFinite(+name);
          const isLast = index >= path.length;
          name = !name && utils$1.isArray(target) ? target.length : name;
          if (isLast) {
            if (utils$1.hasOwnProp(target, name)) {
              target[name] = [target[name], value];
            } else {
              target[name] = value;
            }
            return !isNumericKey;
          }
          if (!target[name] || !utils$1.isObject(target[name])) {
            target[name] = [];
          }
          const result = buildPath(path, value, target[name], index);
          if (result && utils$1.isArray(target[name])) {
            target[name] = arrayToObject(target[name]);
          }
          return !isNumericKey;
        }
        if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
          const obj = {};
          utils$1.forEachEntry(formData, (name, value) => {
            buildPath(parsePropPath(name), value, obj, 0);
          });
          return obj;
        }
        return null;
      }
      function stringifySafely(rawValue, parser, encoder) {
        if (utils$1.isString(rawValue)) {
          try {
            (parser || JSON.parse)(rawValue);
            return utils$1.trim(rawValue);
          } catch (e) {
            if (e.name !== "SyntaxError") {
              throw e;
            }
          }
        }
        return (0, JSON.stringify)(rawValue);
      }
      const defaults = {
        transitional: transitionalDefaults,
        adapter: ["xhr", "http", "fetch"],
        transformRequest: [function transformRequest(data, headers) {
          const contentType = headers.getContentType() || "";
          const hasJSONContentType = contentType.indexOf("application/json") > -1;
          const isObjectPayload = utils$1.isObject(data);
          if (isObjectPayload && utils$1.isHTMLForm(data)) {
            data = new FormData(data);
          }
          const isFormData2 = utils$1.isFormData(data);
          if (isFormData2) {
            return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
          }
          if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
            return data;
          }
          if (utils$1.isArrayBufferView(data)) {
            return data.buffer;
          }
          if (utils$1.isURLSearchParams(data)) {
            headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
            return data.toString();
          }
          let isFileList2;
          if (isObjectPayload) {
            if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
              return toURLEncodedForm(data, this.formSerializer).toString();
            }
            if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
              const _FormData = this.env && this.env.FormData;
              return toFormData(
                isFileList2 ? { "files[]": data } : data,
                _FormData && new _FormData(),
                this.formSerializer
              );
            }
          }
          if (isObjectPayload || hasJSONContentType) {
            headers.setContentType("application/json", false);
            return stringifySafely(data);
          }
          return data;
        }],
        transformResponse: [function transformResponse(data) {
          const transitional = this.transitional || defaults.transitional;
          const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
          const JSONRequested = this.responseType === "json";
          if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
            return data;
          }
          if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
            const silentJSONParsing = transitional && transitional.silentJSONParsing;
            const strictJSONParsing = !silentJSONParsing && JSONRequested;
            try {
              return JSON.parse(data);
            } catch (e) {
              if (strictJSONParsing) {
                if (e.name === "SyntaxError") {
                  throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
                }
                throw e;
              }
            }
          }
          return data;
        }],
        /**
         * A timeout in milliseconds to abort a request. If set to 0 (default) a
         * timeout is not created.
         */
        timeout: 0,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: -1,
        env: {
          FormData: platform.classes.FormData,
          Blob: platform.classes.Blob
        },
        validateStatus: function validateStatus(status) {
          return status >= 200 && status < 300;
        },
        headers: {
          common: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": void 0
          }
        }
      };
      utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
        defaults.headers[method] = {};
      });
      const ignoreDuplicateOf = utils$1.toObjectSet([
        "age",
        "authorization",
        "content-length",
        "content-type",
        "etag",
        "expires",
        "from",
        "host",
        "if-modified-since",
        "if-unmodified-since",
        "last-modified",
        "location",
        "max-forwards",
        "proxy-authorization",
        "referer",
        "retry-after",
        "user-agent"
      ]);
      const parseHeaders = (rawHeaders) => {
        const parsed = {};
        let key;
        let val;
        let i;
        rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
          i = line.indexOf(":");
          key = line.substring(0, i).trim().toLowerCase();
          val = line.substring(i + 1).trim();
          if (!key || parsed[key] && ignoreDuplicateOf[key]) {
            return;
          }
          if (key === "set-cookie") {
            if (parsed[key]) {
              parsed[key].push(val);
            } else {
              parsed[key] = [val];
            }
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        });
        return parsed;
      };
      const $internals = Symbol("internals");
      function normalizeHeader(header) {
        return header && String(header).trim().toLowerCase();
      }
      function normalizeValue(value) {
        if (value === false || value == null) {
          return value;
        }
        return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
      }
      function parseTokens(str) {
        const tokens = /* @__PURE__ */ Object.create(null);
        const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
        let match;
        while (match = tokensRE.exec(str)) {
          tokens[match[1]] = match[2];
        }
        return tokens;
      }
      const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
      function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
        if (utils$1.isFunction(filter)) {
          return filter.call(this, value, header);
        }
        if (isHeaderNameFilter) {
          value = header;
        }
        if (!utils$1.isString(value))
          return;
        if (utils$1.isString(filter)) {
          return value.indexOf(filter) !== -1;
        }
        if (utils$1.isRegExp(filter)) {
          return filter.test(value);
        }
      }
      function formatHeader(header) {
        return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
          return char.toUpperCase() + str;
        });
      }
      function buildAccessors(obj, header) {
        const accessorName = utils$1.toCamelCase(" " + header);
        ["get", "set", "has"].forEach((methodName) => {
          Object.defineProperty(obj, methodName + accessorName, {
            value: function(arg1, arg2, arg3) {
              return this[methodName].call(this, header, arg1, arg2, arg3);
            },
            configurable: true
          });
        });
      }
      class AxiosHeaders {
        constructor(headers) {
          headers && this.set(headers);
        }
        set(header, valueOrRewrite, rewrite) {
          const self2 = this;
          function setHeader(_value, _header, _rewrite) {
            const lHeader = normalizeHeader(_header);
            if (!lHeader) {
              throw new Error("header name must be a non-empty string");
            }
            const key = utils$1.findKey(self2, lHeader);
            if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
              self2[key || _header] = normalizeValue(_value);
            }
          }
          const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
          if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
            setHeaders(header, valueOrRewrite);
          } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
            setHeaders(parseHeaders(header), valueOrRewrite);
          } else if (utils$1.isHeaders(header)) {
            for (const [key, value] of header.entries()) {
              setHeader(value, key, rewrite);
            }
          } else {
            header != null && setHeader(valueOrRewrite, header, rewrite);
          }
          return this;
        }
        get(header, parser) {
          header = normalizeHeader(header);
          if (header) {
            const key = utils$1.findKey(this, header);
            if (key) {
              const value = this[key];
              if (!parser) {
                return value;
              }
              if (parser === true) {
                return parseTokens(value);
              }
              if (utils$1.isFunction(parser)) {
                return parser.call(this, value, key);
              }
              if (utils$1.isRegExp(parser)) {
                return parser.exec(value);
              }
              throw new TypeError("parser must be boolean|regexp|function");
            }
          }
        }
        has(header, matcher) {
          header = normalizeHeader(header);
          if (header) {
            const key = utils$1.findKey(this, header);
            return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
          }
          return false;
        }
        delete(header, matcher) {
          const self2 = this;
          let deleted = false;
          function deleteHeader(_header) {
            _header = normalizeHeader(_header);
            if (_header) {
              const key = utils$1.findKey(self2, _header);
              if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
                delete self2[key];
                deleted = true;
              }
            }
          }
          if (utils$1.isArray(header)) {
            header.forEach(deleteHeader);
          } else {
            deleteHeader(header);
          }
          return deleted;
        }
        clear(matcher) {
          const keys2 = Object.keys(this);
          let i = keys2.length;
          let deleted = false;
          while (i--) {
            const key = keys2[i];
            if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
              delete this[key];
              deleted = true;
            }
          }
          return deleted;
        }
        normalize(format2) {
          const self2 = this;
          const headers = {};
          utils$1.forEach(this, (value, header) => {
            const key = utils$1.findKey(headers, header);
            if (key) {
              self2[key] = normalizeValue(value);
              delete self2[header];
              return;
            }
            const normalized = format2 ? formatHeader(header) : String(header).trim();
            if (normalized !== header) {
              delete self2[header];
            }
            self2[normalized] = normalizeValue(value);
            headers[normalized] = true;
          });
          return this;
        }
        concat(...targets) {
          return this.constructor.concat(this, ...targets);
        }
        toJSON(asStrings) {
          const obj = /* @__PURE__ */ Object.create(null);
          utils$1.forEach(this, (value, header) => {
            value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
          });
          return obj;
        }
        [Symbol.iterator]() {
          return Object.entries(this.toJSON())[Symbol.iterator]();
        }
        toString() {
          return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
        }
        get [Symbol.toStringTag]() {
          return "AxiosHeaders";
        }
        static from(thing) {
          return thing instanceof this ? thing : new this(thing);
        }
        static concat(first, ...targets) {
          const computed2 = new this(first);
          targets.forEach((target) => computed2.set(target));
          return computed2;
        }
        static accessor(header) {
          const internals = this[$internals] = this[$internals] = {
            accessors: {}
          };
          const accessors = internals.accessors;
          const prototype2 = this.prototype;
          function defineAccessor(_header) {
            const lHeader = normalizeHeader(_header);
            if (!accessors[lHeader]) {
              buildAccessors(prototype2, _header);
              accessors[lHeader] = true;
            }
          }
          utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
          return this;
        }
      }
      AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
      utils$1.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
        let mapped = key[0].toUpperCase() + key.slice(1);
        return {
          get: () => value,
          set(headerValue) {
            this[mapped] = headerValue;
          }
        };
      });
      utils$1.freezeMethods(AxiosHeaders);
      function transformData(fns, response) {
        const config = this || defaults;
        const context = response || config;
        const headers = AxiosHeaders.from(context.headers);
        let data = context.data;
        utils$1.forEach(fns, function transform(fn) {
          data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
        });
        headers.normalize();
        return data;
      }
      function isCancel(value) {
        return !!(value && value.__CANCEL__);
      }
      function CanceledError(message, config, request) {
        AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
        this.name = "CanceledError";
      }
      utils$1.inherits(CanceledError, AxiosError, {
        __CANCEL__: true
      });
      function settle(resolve, reject, response) {
        const validateStatus = response.config.validateStatus;
        if (!response.status || !validateStatus || validateStatus(response.status)) {
          resolve(response);
        } else {
          reject(new AxiosError(
            "Request failed with status code " + response.status,
            [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
            response.config,
            response.request,
            response
          ));
        }
      }
      function parseProtocol(url) {
        const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
        return match && match[1] || "";
      }
      function speedometer(samplesCount, min) {
        samplesCount = samplesCount || 10;
        const bytes = new Array(samplesCount);
        const timestamps = new Array(samplesCount);
        let head = 0;
        let tail = 0;
        let firstSampleTS;
        min = min !== void 0 ? min : 1e3;
        return function push(chunkLength) {
          const now = Date.now();
          const startedAt = timestamps[tail];
          if (!firstSampleTS) {
            firstSampleTS = now;
          }
          bytes[head] = chunkLength;
          timestamps[head] = now;
          let i = tail;
          let bytesCount = 0;
          while (i !== head) {
            bytesCount += bytes[i++];
            i = i % samplesCount;
          }
          head = (head + 1) % samplesCount;
          if (head === tail) {
            tail = (tail + 1) % samplesCount;
          }
          if (now - firstSampleTS < min) {
            return;
          }
          const passed = startedAt && now - startedAt;
          return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
        };
      }
      function throttle(fn, freq) {
        let timestamp = 0;
        const threshold = 1e3 / freq;
        let timer = null;
        return function throttled() {
          const force = this === true;
          const now = Date.now();
          if (force || now - timestamp > threshold) {
            if (timer) {
              clearTimeout(timer);
              timer = null;
            }
            timestamp = now;
            return fn.apply(null, arguments);
          }
          if (!timer) {
            timer = setTimeout(() => {
              timer = null;
              timestamp = Date.now();
              return fn.apply(null, arguments);
            }, threshold - (now - timestamp));
          }
        };
      }
      const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
        let bytesNotified = 0;
        const _speedometer = speedometer(50, 250);
        return throttle((e) => {
          const loaded = e.loaded;
          const total = e.lengthComputable ? e.total : void 0;
          const progressBytes = loaded - bytesNotified;
          const rate = _speedometer(progressBytes);
          const inRange = loaded <= total;
          bytesNotified = loaded;
          const data = {
            loaded,
            total,
            progress: total ? loaded / total : void 0,
            bytes: progressBytes,
            rate: rate ? rate : void 0,
            estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
            event: e,
            lengthComputable: total != null
          };
          data[isDownloadStream ? "download" : "upload"] = true;
          listener(data);
        }, freq);
      };
      const isURLSameOrigin = platform.hasStandardBrowserEnv ? (
        // Standard browser envs have full support of the APIs needed to test
        // whether the request URL is of the same origin as current location.
        function standardBrowserEnv() {
          const msie = /(msie|trident)/i.test(navigator.userAgent);
          const urlParsingNode = document.createElement("a");
          let originURL;
          function resolveURL(url) {
            let href = url;
            if (msie) {
              urlParsingNode.setAttribute("href", href);
              href = urlParsingNode.href;
            }
            urlParsingNode.setAttribute("href", href);
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
            };
          }
          originURL = resolveURL(window.location.href);
          return function isURLSameOrigin2(requestURL) {
            const parsed = utils$1.isString(requestURL) ? resolveURL(requestURL) : requestURL;
            return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
          };
        }()
      ) : (
        // Non standard browser envs (web workers, react-native) lack needed support.
        /* @__PURE__ */ function nonStandardBrowserEnv() {
          return function isURLSameOrigin2() {
            return true;
          };
        }()
      );
      const cookies = platform.hasStandardBrowserEnv ? (
        // Standard browser envs support document.cookie
        {
          write(name, value, expires, path, domain, secure) {
            const cookie = [name + "=" + encodeURIComponent(value)];
            utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
            utils$1.isString(path) && cookie.push("path=" + path);
            utils$1.isString(domain) && cookie.push("domain=" + domain);
            secure === true && cookie.push("secure");
            document.cookie = cookie.join("; ");
          },
          read(name) {
            const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
            return match ? decodeURIComponent(match[3]) : null;
          },
          remove(name) {
            this.write(name, "", Date.now() - 864e5);
          }
        }
      ) : (
        // Non-standard browser env (web workers, react-native) lack needed support.
        {
          write() {
          },
          read() {
            return null;
          },
          remove() {
          }
        }
      );
      function isAbsoluteURL(url) {
        return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
      }
      function combineURLs(baseURL, relativeURL) {
        return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
      }
      function buildFullPath(baseURL, requestedURL) {
        if (baseURL && !isAbsoluteURL(requestedURL)) {
          return combineURLs(baseURL, requestedURL);
        }
        return requestedURL;
      }
      const headersToObject = (thing) => thing instanceof AxiosHeaders ? { ...thing } : thing;
      function mergeConfig(config1, config2) {
        config2 = config2 || {};
        const config = {};
        function getMergedValue(target, source, caseless) {
          if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
            return utils$1.merge.call({ caseless }, target, source);
          } else if (utils$1.isPlainObject(source)) {
            return utils$1.merge({}, source);
          } else if (utils$1.isArray(source)) {
            return source.slice();
          }
          return source;
        }
        function mergeDeepProperties(a, b, caseless) {
          if (!utils$1.isUndefined(b)) {
            return getMergedValue(a, b, caseless);
          } else if (!utils$1.isUndefined(a)) {
            return getMergedValue(void 0, a, caseless);
          }
        }
        function valueFromConfig2(a, b) {
          if (!utils$1.isUndefined(b)) {
            return getMergedValue(void 0, b);
          }
        }
        function defaultToConfig2(a, b) {
          if (!utils$1.isUndefined(b)) {
            return getMergedValue(void 0, b);
          } else if (!utils$1.isUndefined(a)) {
            return getMergedValue(void 0, a);
          }
        }
        function mergeDirectKeys(a, b, prop) {
          if (prop in config2) {
            return getMergedValue(a, b);
          } else if (prop in config1) {
            return getMergedValue(void 0, a);
          }
        }
        const mergeMap = {
          url: valueFromConfig2,
          method: valueFromConfig2,
          data: valueFromConfig2,
          baseURL: defaultToConfig2,
          transformRequest: defaultToConfig2,
          transformResponse: defaultToConfig2,
          paramsSerializer: defaultToConfig2,
          timeout: defaultToConfig2,
          timeoutMessage: defaultToConfig2,
          withCredentials: defaultToConfig2,
          withXSRFToken: defaultToConfig2,
          adapter: defaultToConfig2,
          responseType: defaultToConfig2,
          xsrfCookieName: defaultToConfig2,
          xsrfHeaderName: defaultToConfig2,
          onUploadProgress: defaultToConfig2,
          onDownloadProgress: defaultToConfig2,
          decompress: defaultToConfig2,
          maxContentLength: defaultToConfig2,
          maxBodyLength: defaultToConfig2,
          beforeRedirect: defaultToConfig2,
          transport: defaultToConfig2,
          httpAgent: defaultToConfig2,
          httpsAgent: defaultToConfig2,
          cancelToken: defaultToConfig2,
          socketPath: defaultToConfig2,
          responseEncoding: defaultToConfig2,
          validateStatus: mergeDirectKeys,
          headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
        };
        utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
          const merge2 = mergeMap[prop] || mergeDeepProperties;
          const configValue = merge2(config1[prop], config2[prop], prop);
          utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
        });
        return config;
      }
      const resolveConfig = (config) => {
        const newConfig = mergeConfig({}, config);
        let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
        newConfig.headers = headers = AxiosHeaders.from(headers);
        newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);
        if (auth) {
          headers.set(
            "Authorization",
            "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
          );
        }
        let contentType;
        if (utils$1.isFormData(data)) {
          if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
            headers.setContentType(void 0);
          } else if ((contentType = headers.getContentType()) !== false) {
            const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
            headers.setContentType([type || "multipart/form-data", ...tokens].join("; "));
          }
        }
        if (platform.hasStandardBrowserEnv) {
          withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
          if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
            const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
            if (xsrfValue) {
              headers.set(xsrfHeaderName, xsrfValue);
            }
          }
        }
        return newConfig;
      };
      const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
      const xhrAdapter = isXHRAdapterSupported && function(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject) {
          const _config = resolveConfig(config);
          let requestData = _config.data;
          const requestHeaders = AxiosHeaders.from(_config.headers).normalize();
          let { responseType } = _config;
          let onCanceled;
          function done() {
            if (_config.cancelToken) {
              _config.cancelToken.unsubscribe(onCanceled);
            }
            if (_config.signal) {
              _config.signal.removeEventListener("abort", onCanceled);
            }
          }
          let request = new XMLHttpRequest();
          request.open(_config.method.toUpperCase(), _config.url, true);
          request.timeout = _config.timeout;
          function onloadend() {
            if (!request) {
              return;
            }
            const responseHeaders = AxiosHeaders.from(
              "getAllResponseHeaders" in request && request.getAllResponseHeaders()
            );
            const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
            const response = {
              data: responseData,
              status: request.status,
              statusText: request.statusText,
              headers: responseHeaders,
              config,
              request
            };
            settle(function _resolve(value) {
              resolve(value);
              done();
            }, function _reject(err) {
              reject(err);
              done();
            }, response);
            request = null;
          }
          if ("onloadend" in request) {
            request.onloadend = onloadend;
          } else {
            request.onreadystatechange = function handleLoad() {
              if (!request || request.readyState !== 4) {
                return;
              }
              if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
                return;
              }
              setTimeout(onloadend);
            };
          }
          request.onabort = function handleAbort() {
            if (!request) {
              return;
            }
            reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, _config, request));
            request = null;
          };
          request.onerror = function handleError() {
            reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, _config, request));
            request = null;
          };
          request.ontimeout = function handleTimeout() {
            let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
            const transitional = _config.transitional || transitionalDefaults;
            if (_config.timeoutErrorMessage) {
              timeoutErrorMessage = _config.timeoutErrorMessage;
            }
            reject(new AxiosError(
              timeoutErrorMessage,
              transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
              _config,
              request
            ));
            request = null;
          };
          requestData === void 0 && requestHeaders.setContentType(null);
          if ("setRequestHeader" in request) {
            utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
              request.setRequestHeader(key, val);
            });
          }
          if (!utils$1.isUndefined(_config.withCredentials)) {
            request.withCredentials = !!_config.withCredentials;
          }
          if (responseType && responseType !== "json") {
            request.responseType = _config.responseType;
          }
          if (typeof _config.onDownloadProgress === "function") {
            request.addEventListener("progress", progressEventReducer(_config.onDownloadProgress, true));
          }
          if (typeof _config.onUploadProgress === "function" && request.upload) {
            request.upload.addEventListener("progress", progressEventReducer(_config.onUploadProgress));
          }
          if (_config.cancelToken || _config.signal) {
            onCanceled = (cancel) => {
              if (!request) {
                return;
              }
              reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
              request.abort();
              request = null;
            };
            _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
            if (_config.signal) {
              _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
            }
          }
          const protocol = parseProtocol(_config.url);
          if (protocol && platform.protocols.indexOf(protocol) === -1) {
            reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
            return;
          }
          request.send(requestData || null);
        });
      };
      const composeSignals = (signals, timeout) => {
        let controller = new AbortController();
        let aborted;
        const onabort = function(cancel) {
          if (!aborted) {
            aborted = true;
            unsubscribe();
            const err = cancel instanceof Error ? cancel : this.reason;
            controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
          }
        };
        let timer = timeout && setTimeout(() => {
          onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
        }, timeout);
        const unsubscribe = () => {
          if (signals) {
            timer && clearTimeout(timer);
            timer = null;
            signals.forEach((signal2) => {
              signal2 && (signal2.removeEventListener ? signal2.removeEventListener("abort", onabort) : signal2.unsubscribe(onabort));
            });
            signals = null;
          }
        };
        signals.forEach((signal2) => signal2 && signal2.addEventListener && signal2.addEventListener("abort", onabort));
        const { signal } = controller;
        signal.unsubscribe = unsubscribe;
        return [signal, () => {
          timer && clearTimeout(timer);
          timer = null;
        }];
      };
      const streamChunk = function* (chunk, chunkSize) {
        let len = chunk.byteLength;
        if (len < chunkSize) {
          yield chunk;
          return;
        }
        let pos = 0;
        let end;
        while (pos < len) {
          end = pos + chunkSize;
          yield chunk.slice(pos, end);
          pos = end;
        }
      };
      const readBytes = async function* (iterable, chunkSize, encode2) {
        for await (const chunk of iterable) {
          yield* streamChunk(ArrayBuffer.isView(chunk) ? chunk : await encode2(String(chunk)), chunkSize);
        }
      };
      const trackStream = (stream, chunkSize, onProgress, onFinish, encode2) => {
        const iterator = readBytes(stream, chunkSize, encode2);
        let bytes = 0;
        return new ReadableStream({
          type: "bytes",
          async pull(controller) {
            const { done, value } = await iterator.next();
            if (done) {
              controller.close();
              onFinish();
              return;
            }
            let len = value.byteLength;
            onProgress && onProgress(bytes += len);
            controller.enqueue(new Uint8Array(value));
          },
          cancel(reason) {
            onFinish(reason);
            return iterator.return();
          }
        }, {
          highWaterMark: 2
        });
      };
      const fetchProgressDecorator = (total, fn) => {
        const lengthComputable = total != null;
        return (loaded) => setTimeout(() => fn({
          lengthComputable,
          total,
          loaded
        }));
      };
      const isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
      const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
      const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
      const supportsRequestStream = isReadableStreamSupported && (() => {
        let duplexAccessed = false;
        const hasContentType = new Request(platform.origin, {
          body: new ReadableStream(),
          method: "POST",
          get duplex() {
            duplexAccessed = true;
            return "half";
          }
        }).headers.has("Content-Type");
        return duplexAccessed && !hasContentType;
      })();
      const DEFAULT_CHUNK_SIZE = 64 * 1024;
      const supportsResponseStream = isReadableStreamSupported && !!(() => {
        try {
          return utils$1.isReadableStream(new Response("").body);
        } catch (err) {
        }
      })();
      const resolvers = {
        stream: supportsResponseStream && ((res) => res.body)
      };
      isFetchSupported && ((res) => {
        ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
          !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res2) => res2[type]() : (_, config) => {
            throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
          });
        });
      })(new Response());
      const getBodyLength = async (body) => {
        if (body == null) {
          return 0;
        }
        if (utils$1.isBlob(body)) {
          return body.size;
        }
        if (utils$1.isSpecCompliantForm(body)) {
          return (await new Request(body).arrayBuffer()).byteLength;
        }
        if (utils$1.isArrayBufferView(body)) {
          return body.byteLength;
        }
        if (utils$1.isURLSearchParams(body)) {
          body = body + "";
        }
        if (utils$1.isString(body)) {
          return (await encodeText(body)).byteLength;
        }
      };
      const resolveBodyLength = async (headers, body) => {
        const length = utils$1.toFiniteNumber(headers.getContentLength());
        return length == null ? getBodyLength(body) : length;
      };
      const fetchAdapter = isFetchSupported && (async (config) => {
        let {
          url,
          method,
          data,
          signal,
          cancelToken,
          timeout,
          onDownloadProgress,
          onUploadProgress,
          responseType,
          headers,
          withCredentials = "same-origin",
          fetchOptions
        } = resolveConfig(config);
        responseType = responseType ? (responseType + "").toLowerCase() : "text";
        let [composedSignal, stopTimeout] = signal || cancelToken || timeout ? composeSignals([signal, cancelToken], timeout) : [];
        let finished, request;
        const onFinish = () => {
          !finished && setTimeout(() => {
            composedSignal && composedSignal.unsubscribe();
          });
          finished = true;
        };
        let requestContentLength;
        try {
          if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
            let _request = new Request(url, {
              method: "POST",
              body: data,
              duplex: "half"
            });
            let contentTypeHeader;
            if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
              headers.setContentType(contentTypeHeader);
            }
            if (_request.body) {
              data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, fetchProgressDecorator(
                requestContentLength,
                progressEventReducer(onUploadProgress)
              ), null, encodeText);
            }
          }
          if (!utils$1.isString(withCredentials)) {
            withCredentials = withCredentials ? "cors" : "omit";
          }
          request = new Request(url, {
            ...fetchOptions,
            signal: composedSignal,
            method: method.toUpperCase(),
            headers: headers.normalize().toJSON(),
            body: data,
            duplex: "half",
            withCredentials
          });
          let response = await fetch(request);
          const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
          if (supportsResponseStream && (onDownloadProgress || isStreamResponse)) {
            const options = {};
            ["status", "statusText", "headers"].forEach((prop) => {
              options[prop] = response[prop];
            });
            const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
            response = new Response(
              trackStream(response.body, DEFAULT_CHUNK_SIZE, onDownloadProgress && fetchProgressDecorator(
                responseContentLength,
                progressEventReducer(onDownloadProgress, true)
              ), isStreamResponse && onFinish, encodeText),
              options
            );
          }
          responseType = responseType || "text";
          let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
          !isStreamResponse && onFinish();
          stopTimeout && stopTimeout();
          return await new Promise((resolve, reject) => {
            settle(resolve, reject, {
              data: responseData,
              headers: AxiosHeaders.from(response.headers),
              status: response.status,
              statusText: response.statusText,
              config,
              request
            });
          });
        } catch (err) {
          onFinish();
          if (err && err.name === "TypeError" && /fetch/i.test(err.message)) {
            throw Object.assign(
              new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request),
              {
                cause: err.cause || err
              }
            );
          }
          throw AxiosError.from(err, err && err.code, config, request);
        }
      });
      const knownAdapters = {
        http: httpAdapter,
        xhr: xhrAdapter,
        fetch: fetchAdapter
      };
      utils$1.forEach(knownAdapters, (fn, value) => {
        if (fn) {
          try {
            Object.defineProperty(fn, "name", { value });
          } catch (e) {
          }
          Object.defineProperty(fn, "adapterName", { value });
        }
      });
      const renderReason = (reason) => `- ${reason}`;
      const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
      const adapters = {
        getAdapter: (adapters2) => {
          adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
          const { length } = adapters2;
          let nameOrAdapter;
          let adapter;
          const rejectedReasons = {};
          for (let i = 0; i < length; i++) {
            nameOrAdapter = adapters2[i];
            let id;
            adapter = nameOrAdapter;
            if (!isResolvedHandle(nameOrAdapter)) {
              adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
              if (adapter === void 0) {
                throw new AxiosError(`Unknown adapter '${id}'`);
              }
            }
            if (adapter) {
              break;
            }
            rejectedReasons[id || "#" + i] = adapter;
          }
          if (!adapter) {
            const reasons = Object.entries(rejectedReasons).map(
              ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
            );
            let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
            throw new AxiosError(
              `There is no suitable adapter to dispatch the request ` + s,
              "ERR_NOT_SUPPORT"
            );
          }
          return adapter;
        },
        adapters: knownAdapters
      };
      function throwIfCancellationRequested(config) {
        if (config.cancelToken) {
          config.cancelToken.throwIfRequested();
        }
        if (config.signal && config.signal.aborted) {
          throw new CanceledError(null, config);
        }
      }
      function dispatchRequest(config) {
        throwIfCancellationRequested(config);
        config.headers = AxiosHeaders.from(config.headers);
        config.data = transformData.call(
          config,
          config.transformRequest
        );
        if (["post", "put", "patch"].indexOf(config.method) !== -1) {
          config.headers.setContentType("application/x-www-form-urlencoded", false);
        }
        const adapter = adapters.getAdapter(config.adapter || defaults.adapter);
        return adapter(config).then(function onAdapterResolution(response) {
          throwIfCancellationRequested(config);
          response.data = transformData.call(
            config,
            config.transformResponse,
            response
          );
          response.headers = AxiosHeaders.from(response.headers);
          return response;
        }, function onAdapterRejection(reason) {
          if (!isCancel(reason)) {
            throwIfCancellationRequested(config);
            if (reason && reason.response) {
              reason.response.data = transformData.call(
                config,
                config.transformResponse,
                reason.response
              );
              reason.response.headers = AxiosHeaders.from(reason.response.headers);
            }
          }
          return Promise.reject(reason);
        });
      }
      const VERSION = "1.7.2";
      const validators$1 = {};
      ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
        validators$1[type] = function validator2(thing) {
          return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
        };
      });
      const deprecatedWarnings = {};
      validators$1.transitional = function transitional(validator2, version, message) {
        function formatMessage(opt, desc) {
          return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
        }
        return (value, opt, opts) => {
          if (validator2 === false) {
            throw new AxiosError(
              formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
              AxiosError.ERR_DEPRECATED
            );
          }
          if (version && !deprecatedWarnings[opt]) {
            deprecatedWarnings[opt] = true;
            console.warn(
              formatMessage(
                opt,
                " has been deprecated since v" + version + " and will be removed in the near future"
              )
            );
          }
          return validator2 ? validator2(value, opt, opts) : true;
        };
      };
      function assertOptions(options, schema, allowUnknown) {
        if (typeof options !== "object") {
          throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
        }
        const keys2 = Object.keys(options);
        let i = keys2.length;
        while (i-- > 0) {
          const opt = keys2[i];
          const validator2 = schema[opt];
          if (validator2) {
            const value = options[opt];
            const result = value === void 0 || validator2(value, opt, options);
            if (result !== true) {
              throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
            }
            continue;
          }
          if (allowUnknown !== true) {
            throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
          }
        }
      }
      const validator = {
        assertOptions,
        validators: validators$1
      };
      const validators = validator.validators;
      class Axios {
        constructor(instanceConfig) {
          this.defaults = instanceConfig;
          this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
          };
        }
        /**
         * Dispatch a request
         *
         * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
         * @param {?Object} config
         *
         * @returns {Promise} The Promise to be fulfilled
         */
        async request(configOrUrl, config) {
          try {
            return await this._request(configOrUrl, config);
          } catch (err) {
            if (err instanceof Error) {
              let dummy;
              Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : dummy = new Error();
              const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
              try {
                if (!err.stack) {
                  err.stack = stack;
                } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
                  err.stack += "\n" + stack;
                }
              } catch (e) {
              }
            }
            throw err;
          }
        }
        _request(configOrUrl, config) {
          if (typeof configOrUrl === "string") {
            config = config || {};
            config.url = configOrUrl;
          } else {
            config = configOrUrl || {};
          }
          config = mergeConfig(this.defaults, config);
          const { transitional, paramsSerializer, headers } = config;
          if (transitional !== void 0) {
            validator.assertOptions(transitional, {
              silentJSONParsing: validators.transitional(validators.boolean),
              forcedJSONParsing: validators.transitional(validators.boolean),
              clarifyTimeoutError: validators.transitional(validators.boolean)
            }, false);
          }
          if (paramsSerializer != null) {
            if (utils$1.isFunction(paramsSerializer)) {
              config.paramsSerializer = {
                serialize: paramsSerializer
              };
            } else {
              validator.assertOptions(paramsSerializer, {
                encode: validators.function,
                serialize: validators.function
              }, true);
            }
          }
          config.method = (config.method || this.defaults.method || "get").toLowerCase();
          let contextHeaders = headers && utils$1.merge(
            headers.common,
            headers[config.method]
          );
          headers && utils$1.forEach(
            ["delete", "get", "head", "post", "put", "patch", "common"],
            (method) => {
              delete headers[method];
            }
          );
          config.headers = AxiosHeaders.concat(contextHeaders, headers);
          const requestInterceptorChain = [];
          let synchronousRequestInterceptors = true;
          this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
              return;
            }
            synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
            requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
          });
          const responseInterceptorChain = [];
          this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
          });
          let promise;
          let i = 0;
          let len;
          if (!synchronousRequestInterceptors) {
            const chain = [dispatchRequest.bind(this), void 0];
            chain.unshift.apply(chain, requestInterceptorChain);
            chain.push.apply(chain, responseInterceptorChain);
            len = chain.length;
            promise = Promise.resolve(config);
            while (i < len) {
              promise = promise.then(chain[i++], chain[i++]);
            }
            return promise;
          }
          len = requestInterceptorChain.length;
          let newConfig = config;
          i = 0;
          while (i < len) {
            const onFulfilled = requestInterceptorChain[i++];
            const onRejected = requestInterceptorChain[i++];
            try {
              newConfig = onFulfilled(newConfig);
            } catch (error) {
              onRejected.call(this, error);
              break;
            }
          }
          try {
            promise = dispatchRequest.call(this, newConfig);
          } catch (error) {
            return Promise.reject(error);
          }
          i = 0;
          len = responseInterceptorChain.length;
          while (i < len) {
            promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
          }
          return promise;
        }
        getUri(config) {
          config = mergeConfig(this.defaults, config);
          const fullPath = buildFullPath(config.baseURL, config.url);
          return buildURL(fullPath, config.params, config.paramsSerializer);
        }
      }
      utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
        Axios.prototype[method] = function(url, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            url,
            data: (config || {}).data
          }));
        };
      });
      utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
        function generateHTTPMethod(isForm) {
          return function httpMethod(url, data, config) {
            return this.request(mergeConfig(config || {}, {
              method,
              headers: isForm ? {
                "Content-Type": "multipart/form-data"
              } : {},
              url,
              data
            }));
          };
        }
        Axios.prototype[method] = generateHTTPMethod();
        Axios.prototype[method + "Form"] = generateHTTPMethod(true);
      });
      class CancelToken {
        constructor(executor) {
          if (typeof executor !== "function") {
            throw new TypeError("executor must be a function.");
          }
          let resolvePromise;
          this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
          });
          const token = this;
          this.promise.then((cancel) => {
            if (!token._listeners)
              return;
            let i = token._listeners.length;
            while (i-- > 0) {
              token._listeners[i](cancel);
            }
            token._listeners = null;
          });
          this.promise.then = (onfulfilled) => {
            let _resolve;
            const promise = new Promise((resolve) => {
              token.subscribe(resolve);
              _resolve = resolve;
            }).then(onfulfilled);
            promise.cancel = function reject() {
              token.unsubscribe(_resolve);
            };
            return promise;
          };
          executor(function cancel(message, config, request) {
            if (token.reason) {
              return;
            }
            token.reason = new CanceledError(message, config, request);
            resolvePromise(token.reason);
          });
        }
        /**
         * Throws a `CanceledError` if cancellation has been requested.
         */
        throwIfRequested() {
          if (this.reason) {
            throw this.reason;
          }
        }
        /**
         * Subscribe to the cancel signal
         */
        subscribe(listener) {
          if (this.reason) {
            listener(this.reason);
            return;
          }
          if (this._listeners) {
            this._listeners.push(listener);
          } else {
            this._listeners = [listener];
          }
        }
        /**
         * Unsubscribe from the cancel signal
         */
        unsubscribe(listener) {
          if (!this._listeners) {
            return;
          }
          const index = this._listeners.indexOf(listener);
          if (index !== -1) {
            this._listeners.splice(index, 1);
          }
        }
        /**
         * Returns an object that contains a new `CancelToken` and a function that, when called,
         * cancels the `CancelToken`.
         */
        static source() {
          let cancel;
          const token = new CancelToken(function executor(c) {
            cancel = c;
          });
          return {
            token,
            cancel
          };
        }
      }
      function spread(callback) {
        return function wrap(arr) {
          return callback.apply(null, arr);
        };
      }
      function isAxiosError(payload) {
        return utils$1.isObject(payload) && payload.isAxiosError === true;
      }
      const HttpStatusCode = {
        Continue: 100,
        SwitchingProtocols: 101,
        Processing: 102,
        EarlyHints: 103,
        Ok: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206,
        MultiStatus: 207,
        AlreadyReported: 208,
        ImUsed: 226,
        MultipleChoices: 300,
        MovedPermanently: 301,
        Found: 302,
        SeeOther: 303,
        NotModified: 304,
        UseProxy: 305,
        Unused: 306,
        TemporaryRedirect: 307,
        PermanentRedirect: 308,
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        PayloadTooLarge: 413,
        UriTooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        ImATeapot: 418,
        MisdirectedRequest: 421,
        UnprocessableEntity: 422,
        Locked: 423,
        FailedDependency: 424,
        TooEarly: 425,
        UpgradeRequired: 426,
        PreconditionRequired: 428,
        TooManyRequests: 429,
        RequestHeaderFieldsTooLarge: 431,
        UnavailableForLegalReasons: 451,
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HttpVersionNotSupported: 505,
        VariantAlsoNegotiates: 506,
        InsufficientStorage: 507,
        LoopDetected: 508,
        NotExtended: 510,
        NetworkAuthenticationRequired: 511
      };
      Object.entries(HttpStatusCode).forEach(([key, value]) => {
        HttpStatusCode[value] = key;
      });
      function createInstance(defaultConfig) {
        const context = new Axios(defaultConfig);
        const instance = bind(Axios.prototype.request, context);
        utils$1.extend(instance, Axios.prototype, context, { allOwnKeys: true });
        utils$1.extend(instance, context, null, { allOwnKeys: true });
        instance.create = function create(instanceConfig) {
          return createInstance(mergeConfig(defaultConfig, instanceConfig));
        };
        return instance;
      }
      const axios = createInstance(defaults);
      axios.Axios = Axios;
      axios.CanceledError = CanceledError;
      axios.CancelToken = CancelToken;
      axios.isCancel = isCancel;
      axios.VERSION = VERSION;
      axios.toFormData = toFormData;
      axios.AxiosError = AxiosError;
      axios.Cancel = axios.CanceledError;
      axios.all = function all(promises) {
        return Promise.all(promises);
      };
      axios.spread = spread;
      axios.isAxiosError = isAxiosError;
      axios.mergeConfig = mergeConfig;
      axios.AxiosHeaders = AxiosHeaders;
      axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
      axios.getAdapter = adapters.getAdapter;
      axios.HttpStatusCode = HttpStatusCode;
      axios.default = axios;
      axios.defaults.baseURL = "https://zjy2.icve.com.cn/prod-api";
      axios.interceptors.request.use(function(config) {
        const UserInfoStore = useUserInfoStore();
        config.headers.Authorization = UserInfoStore.Token;
        return config;
      });
      function get(url, params = {}) {
        return new Promise((resolve, reject) => {
          axios.get(url, {
            params
          }).then((response) => {
            resolve(response.data);
          }).catch(async (err) => {
            const UserInfoStore = useUserInfoStore();
            await UserInfoStore.refreshToken();
            await UserInfoStore.refreshCourseInfo();
            reject(err);
          });
        });
      }
      function post(url, data = {}) {
        return new Promise((resolve, reject) => {
          axios.post(url, data).then((response) => {
            resolve(response.data);
          }, (err) => {
            const UserInfoStore = useUserInfoStore();
            UserInfoStore.refreshToken();
            UserInfoStore.refreshCourseInfo();
            reject(err);
          });
        });
      }
      function getAnsweredExamList() {
        const courseInfo = useUserInfoStore().courseInfo;
        return get("/spoc/exam/answeredExamList", {
          "categoryId": 1,
          "courseInfoId": courseInfo.courseInfoId,
          "classId": courseInfo.classId,
          "id": courseInfo.id,
          "flag": 1,
          "typeId": 1
        });
      }
      function getExamInfo(id) {
        const courseInfo = useUserInfoStore().courseInfo;
        return get("/spoc/exam/info", {
          "id": id,
          "classId": courseInfo.classId
        });
      }
      function getExamRecordList(id) {
        const courseInfo = useUserInfoStore().courseInfo;
        return get("/spoc/exam/record/list", {
          "examId": id,
          "classId": courseInfo.classId,
          "pageNum": 1,
          "pageSize": 1e4
        });
      }
      function getExamPaper(id) {
        const courseInfo = useUserInfoStore().courseInfo;
        return get("/spoc/exam/paper", {
          "id": id,
          "classId": courseInfo.classId,
          "device": 1
        });
      }
      function handelQuestions(questions, minScore) {
        const resultList = [];
        let score = 0;
        questions.forEach((question, index) => {
          let i = {
            "questionNo": index,
            "optionSort": question.dataJson,
            "answer": "",
            "paperId": question.id,
            "knowledgePointsId": ""
          };
          const dataJson = JSON.parse(question.dataJson);
          if (score >= minScore) {
            i.answer += "0,";
          } else {
            dataJson.forEach((item) => {
              if (item.IsAnswer === "true" || item.IsAnswer === true) {
                i.answer += item.SortOrder + ",";
              }
            });
          }
          i.answer = i.answer.slice(0, -1);
          score += parseFloat(question.score);
          resultList.push(i);
        });
        return resultList;
      }
      function submitExamAnswer(data) {
        return post("/spoc/exam/record", data);
      }
      const _hoisted_1$1 = { id: "mao-gai-content" };
      const _hoisted_2$1 = { class: "right" };
      const _hoisted_3$1 = { key: 0 };
      const _hoisted_4$1 = {
        key: 1,
        class: "card"
      };
      const _hoisted_5$1 = { class: "card-header" };
      const _hoisted_6$1 = { class: "header-title" };
      const _hoisted_7$1 = { class: "header-body" };
      const _hoisted_8$1 = { slot: "content" };
      const _sfc_main$2 = {
        __name: "mao-gai-content",
        setup(__props) {
          vue.onMounted(() => {
            console.log("毛概，启动！");
            getAnsweredExamList().then((res) => {
              console.log(res);
              cardList.value = res.rows;
            });
          });
          const cardList = vue.ref([]);
          const examInfo = vue.ref(null);
          const examRecordList = vue.ref([]);
          const currentExamId = vue.ref(null);
          const ExamInfo = (id) => {
            currentExamId.value = id;
            getExamInfo(id).then((res) => {
              examInfo.value = res.data;
            });
            getExamRecordList(id).then((res) => {
              examRecordList.value = res.rows;
            });
          };
          const setExamOption = () => {
            dialogVisible.value = true;
          };
          const dialogVisible = vue.ref(false);
          const examOptions = vue.ref({
            time: 200,
            minScore: 60
          });
          const startExam = () => {
            const courseInfo = useUserInfoStore().getCourseInfo;
            const examInfo2 = {
              "classId": courseInfo.classId,
              "categoryId": 1,
              "courseId": courseInfo.courseId,
              "courseInfoId": courseInfo.courseInfoId,
              "examId": currentExamId.value,
              "examTime": examOptions.value.time,
              "groupId": null,
              "isLast": true,
              "status": "",
              "taskExamProblemRecordList": [],
              "updateBy": "",
              "updateTime": "",
              "userId": "",
              "examName": null,
              "resitId": "",
              "device": "1"
            };
            getExamPaper(currentExamId.value).then((res) => {
              console.log(res);
              examInfo2.groupId = res.groupId;
              examInfo2.examName = res.name;
              examInfo2.taskExamProblemRecordList = handelQuestions(res.questions, examOptions.value.minScore);
              submitExamAnswer(examInfo2).then((res2) => {
                console.log(res2);
                dialogVisible.value = false;
                getExamRecordList(currentExamId.value).then((res3) => {
                  examRecordList.value = res3.rows;
                });
              });
            });
          };
          return (_ctx, _cache) => {
            const _component_el_tag = ElTag;
            const _component_el_button = ElButton;
            const _component_el_card = ElCard;
            const _component_el_timeline_item = ElTimelineItem;
            const _component_el_timeline = ElTimeline;
            const _component_el_input = ElInput;
            const _component_el_form_item = ElFormItem;
            const _component_el_form = ElForm;
            const _component_el_dialog = ElDialog;
            return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
              vue.createElementVNode("div", _hoisted_1$1, [
                vue.createVNode(CardList, {
                  "card-list": cardList.value,
                  class: "left",
                  onClicked: ExamInfo
                }, null, 8, ["card-list"]),
                vue.createElementVNode("div", _hoisted_2$1, [
                  !examInfo.value ? (vue.openBlock(), vue.createElementBlock("h2", _hoisted_3$1, "请选择左侧章节内容")) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$1, [
                    vue.createVNode(_component_el_card, null, {
                      header: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_5$1, [
                          vue.createElementVNode("h4", _hoisted_6$1, vue.toDisplayString(examInfo.value.name), 1),
                          vue.createElementVNode("div", _hoisted_7$1, [
                            vue.createElementVNode("div", null, "截止日期：" + vue.toDisplayString(examInfo.value.endTime), 1),
                            vue.createVNode(_component_el_tag, {
                              type: examInfo.value.allSubmitCount === 0 ? "danger" : "warning"
                            }, {
                              default: vue.withCtx(() => [
                                vue.createTextVNode(vue.toDisplayString(examInfo.value.allSubmitCount === 0 ? "未作答" : `已作答${examInfo.value.allSubmitCount}次`), 1)
                              ]),
                              _: 1
                            }, 8, ["type"]),
                            vue.createVNode(_component_el_button, {
                              style: { "float": "right" },
                              type: "danger",
                              onClick: setExamOption
                            }, {
                              default: vue.withCtx(() => [
                                vue.createTextVNode("自动考试")
                              ]),
                              _: 1
                            })
                          ])
                        ])
                      ]),
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_timeline, null, {
                          default: vue.withCtx(() => [
                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(examRecordList.value, (record) => {
                              return vue.openBlock(), vue.createBlock(_component_el_timeline_item, {
                                timestamp: record.submitTime,
                                placement: "top"
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_card, null, {
                                    default: vue.withCtx(() => [
                                      vue.createElementVNode("div", _hoisted_8$1, [
                                        vue.createElementVNode("p", null, "得分：" + vue.toDisplayString(record.score), 1),
                                        vue.createElementVNode("p", null, "用时：" + vue.toDisplayString(vue.unref(secondToTime)(record.examTime)), 1)
                                      ])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1032, ["timestamp"]);
                            }), 256))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]))
                ])
              ]),
              vue.createElementVNode("div", null, [
                vue.createVNode(_component_el_dialog, {
                  modelValue: dialogVisible.value,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => dialogVisible.value = $event),
                  "align-center": "",
                  "append-to-body": "",
                  draggable: "",
                  overflow: "",
                  title: "设置答题信息",
                  width: "400"
                }, {
                  footer: vue.withCtx(() => [
                    vue.createVNode(_component_el_button, {
                      onClick: _cache[2] || (_cache[2] = ($event) => dialogVisible.value = false)
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("取 消")
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_button, {
                      type: "primary",
                      onClick: startExam
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("开始考试")
                      ]),
                      _: 1
                    })
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_form, { model: examOptions.value }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_form_item, { label: "考试时长（秒）" }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_input, {
                              modelValue: examOptions.value.time,
                              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => examOptions.value.time = $event),
                              placeholder: "请输入考试时长"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_el_form_item, { label: "最低分数" }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_input, {
                              modelValue: examOptions.value.minScore,
                              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => examOptions.value.minScore = $event),
                              placeholder: "请设置最低分数"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["model"])
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ], 64);
          };
        }
      };
      const MaoGaiContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$2, [["__scopeId", "data-v-c534c5c4"]]);
      const _sfc_main$1 = {};
      function _sfc_render(_ctx, _cache) {
        return vue.openBlock(), vue.createElementBlock("div");
      }
      const IndexContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$1, [["render", _sfc_render]]);
      const useSettingStore = defineStore("setting", () => {
        const hiddenExam = vue.ref(true);
        return {
          hiddenExam
        };
      });
      const _withScopeId = (n) => (vue.pushScopeId("data-v-64c380f9"), n = n(), vue.popScopeId(), n);
      const _hoisted_1 = { id: "root" };
      const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "left-menu" }, [
        /* @__PURE__ */ vue.createElementVNode("div", { class: "menu-option" }, "隐式考试")
      ], -1));
      const _hoisted_3 = { class: "right-content" };
      const _hoisted_4 = { class: "content-item" };
      const _hoisted_5 = { class: "item-top" };
      const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("h2", null, "隐式考试模式", -1));
      const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "隐式考试模式是一种特殊的考试模式。开启之后，每一题正确的选项都将会使用不明显的加粗样式显示", -1));
      const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "隐式模式开启之后，页面左上角会显示一个“隐”字样", -1));
      const _sfc_main = {
        __name: "setting",
        setup(__props) {
          const setting2 = useSettingStore();
          return (_ctx, _cache) => {
            const _component_el_switch = ElSwitch;
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
              _hoisted_2,
              vue.createElementVNode("div", _hoisted_3, [
                vue.createElementVNode("div", _hoisted_4, [
                  vue.createElementVNode("div", _hoisted_5, [
                    _hoisted_6,
                    vue.createVNode(_component_el_switch, {
                      modelValue: vue.unref(setting2).hiddenExam,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(setting2).hiddenExam = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _hoisted_7,
                  _hoisted_8
                ])
              ])
            ]);
          };
        }
      };
      const setting = /* @__PURE__ */ _export_sfc$1(_sfc_main, [["__scopeId", "data-v-64c380f9"]]);
      const routes = [
        { path: "/", name: "index", component: IndexContent },
        { path: "/maoGaiContent", name: "maoGaiContent", component: MaoGaiContent },
        { path: "/setting", name: "setting", component: setting }
      ];
      const router = createRouter({
        history: createMemoryHistory(),
        routes
      });
      const interceptors = [];
      function addInterceptor(urlPart, modifyRequest, modifyResponse) {
        interceptors.push({ urlPart, modifyRequest, modifyResponse });
      }
      function shouldIntercept(url) {
        return interceptors.find((interceptor) => url.includes(interceptor.urlPart));
      }
      function handleRequest(config) {
        const interceptor = shouldIntercept(config.url);
        if (interceptor && interceptor.modifyRequest) {
          return interceptor.modifyRequest(config);
        }
        return config;
      }
      function handleResponse(url, response) {
        const interceptor = shouldIntercept(url);
        if (interceptor && interceptor.modifyResponse) {
          return interceptor.modifyResponse(response);
        }
        return response;
      }
      const originalXhrOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._url = url;
        this._method = method;
        return originalXhrOpen.apply(this, arguments);
      };
      const originalXhrSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        const modifiedConfig = handleRequest({
          method: xhr._method,
          url: xhr._url,
          body,
          headers: xhr._headers || {}
        });
        xhr._headers = modifiedConfig.headers;
        body = modifiedConfig.body;
        for (const key in xhr._headers) {
          if (xhr._headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, xhr._headers[key]);
          }
        }
        this.addEventListener("readystatechange", function() {
          if (xhr.readyState === 4) {
            const modifiedResponse = handleResponse(xhr._url, xhr.responseText);
            Object.defineProperty(xhr, "responseText", { value: modifiedResponse });
          }
        });
        return originalXhrSend.apply(this, [body]);
      };
      const originalFetch = window.fetch;
      window.fetch = function(input, init = {}) {
        let url;
        if (typeof input === "string") {
          url = input;
        } else if (input instanceof Request) {
          url = input.url;
        }
        const modifiedConfig = handleRequest({
          method: init.method || "GET",
          url,
          body: init.body,
          headers: new Headers(init.headers || {})
        });
        init.method = modifiedConfig.method;
        init.body = modifiedConfig.body;
        init.headers = modifiedConfig.headers;
        return originalFetch(input, init).then((response) => {
          if (shouldIntercept(url)) {
            return response.text().then((text) => {
              const modifiedResponse = handleResponse(url, text);
              return new Response(modifiedResponse, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
              });
            });
          }
          return response;
        });
      };
      addInterceptor("/exam", (config) => {
        return config;
      }, (response) => {
        if (useSettingStore().hiddenExam) {
          let res = JSON.parse(response);
          if (res.questions) {
            res.questions.forEach((question) => {
              let json = JSON.parse(question.dataJson);
              json.forEach((item) => {
                if (item.IsAnswer == "true") {
                  if (item.Content.includes("<p>")) {
                    item.Content = item.Content.replace("<p>", '<p style="color:red; font-weight:bold;">');
                  } else {
                    item.Content = `${item.Content}----✅</p>`;
                  }
                }
              });
              question.dataJson = JSON.stringify(json);
            });
          }
          return JSON.stringify(res);
        }
        return response;
      });
      addInterceptor("/ajax", (config) => {
        console.log(config);
        return config;
      }, (response) => {
        console.log(JSON.parse(response));
        let res = JSON.parse(response);
        if (useSettingStore().hiddenExam) {
          if (res.data.paperSubjectList) {
            res.data.paperSubjectList.forEach((question) => {
              if (question.answer == "yes" || question.answer == "no") {
                question.subjectName = question.subjectName.replace("（   ）", `（正确答案：${question.answer == "yes" ? "✅" : "❌"}）`);
              } else {
                question.subjectOptions.forEach((option) => {
                  if (option.optionHead == question.rightAnswer) {
                    option.optionContent = option.optionContent.replace("<p>", '<p style="color:red; font-weight:bold;border: 1px solid red">');
                  }
                });
              }
            });
          }
          return JSON.stringify(res);
        }
        return response;
      });
      const pinia = createPinia();
      vue.createApp(App).use(router).use(pinia).mount(
        (() => {
          const app = document.createElement("div");
          document.body.append(app);
          return app;
        })()
      );
    }
  });
  require_main_001();

})(Vue);