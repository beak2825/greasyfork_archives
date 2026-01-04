// ==UserScript==
// @name         ball-map
// @namespace    npm/vite-plugin-monkey
// @version      0.0.1
// @author       monkey
// @description  ball-map-description
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://www.google.com/maps*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535237/ball-map.user.js
// @updateURL https://update.greasyfork.org/scripts/535237/ball-map.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const r=document.createElement("style");r.textContent=e,document.head.append(r)})(' @charset "UTF-8";:root{--circle-w: 400px}@media (max-width: 500px){:root{--circle-w: 90vw}}:root{--el-color-white:#ffffff;--el-color-black:#000000;--el-color-primary-rgb:64,158,255;--el-color-success-rgb:103,194,58;--el-color-warning-rgb:230,162,60;--el-color-danger-rgb:245,108,108;--el-color-error-rgb:245,108,108;--el-color-info-rgb:144,147,153;--el-font-size-extra-large:20px;--el-font-size-large:18px;--el-font-size-medium:16px;--el-font-size-base:14px;--el-font-size-small:13px;--el-font-size-extra-small:12px;--el-font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\u5FAE\u8F6F\u96C5\u9ED1",Arial,sans-serif;--el-font-weight-primary:500;--el-font-line-height-primary:24px;--el-index-normal:1;--el-index-top:1000;--el-index-popper:2000;--el-border-radius-base:4px;--el-border-radius-small:2px;--el-border-radius-round:20px;--el-border-radius-circle:100%;--el-transition-duration:.3s;--el-transition-duration-fast:.2s;--el-transition-function-ease-in-out-bezier:cubic-bezier(.645,.045,.355,1);--el-transition-function-fast-bezier:cubic-bezier(.23,1,.32,1);--el-transition-all:all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);--el-transition-fade:opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-md-fade:transform var(--el-transition-duration) var(--el-transition-function-fast-bezier),opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-fade-linear:opacity var(--el-transition-duration-fast) linear;--el-transition-border:border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-box-shadow:box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-color:color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-component-size-large:40px;--el-component-size:32px;--el-component-size-small:24px;color-scheme:light;--el-color-primary:#409eff;--el-color-primary-light-3:rgb(121.3,187.1,255);--el-color-primary-light-5:rgb(159.5,206.5,255);--el-color-primary-light-7:rgb(197.7,225.9,255);--el-color-primary-light-8:rgb(216.8,235.6,255);--el-color-primary-light-9:rgb(235.9,245.3,255);--el-color-primary-dark-2:rgb(51.2,126.4,204);--el-color-success:#67c23a;--el-color-success-light-3:rgb(148.6,212.3,117.1);--el-color-success-light-5:rgb(179,224.5,156.5);--el-color-success-light-7:rgb(209.4,236.7,195.9);--el-color-success-light-8:rgb(224.6,242.8,215.6);--el-color-success-light-9:rgb(239.8,248.9,235.3);--el-color-success-dark-2:rgb(82.4,155.2,46.4);--el-color-warning:#e6a23c;--el-color-warning-light-3:rgb(237.5,189.9,118.5);--el-color-warning-light-5:rgb(242.5,208.5,157.5);--el-color-warning-light-7:rgb(247.5,227.1,196.5);--el-color-warning-light-8:rgb(250,236.4,216);--el-color-warning-light-9:rgb(252.5,245.7,235.5);--el-color-warning-dark-2:rgb(184,129.6,48);--el-color-danger:#f56c6c;--el-color-danger-light-3:rgb(248,152.1,152.1);--el-color-danger-light-5:rgb(250,181.5,181.5);--el-color-danger-light-7:rgb(252,210.9,210.9);--el-color-danger-light-8:rgb(253,225.6,225.6);--el-color-danger-light-9:rgb(254,240.3,240.3);--el-color-danger-dark-2:rgb(196,86.4,86.4);--el-color-error:#f56c6c;--el-color-error-light-3:rgb(248,152.1,152.1);--el-color-error-light-5:rgb(250,181.5,181.5);--el-color-error-light-7:rgb(252,210.9,210.9);--el-color-error-light-8:rgb(253,225.6,225.6);--el-color-error-light-9:rgb(254,240.3,240.3);--el-color-error-dark-2:rgb(196,86.4,86.4);--el-color-info:#909399;--el-color-info-light-3:rgb(177.3,179.4,183.6);--el-color-info-light-5:rgb(199.5,201,204);--el-color-info-light-7:rgb(221.7,222.6,224.4);--el-color-info-light-8:rgb(232.8,233.4,234.6);--el-color-info-light-9:rgb(243.9,244.2,244.8);--el-color-info-dark-2:rgb(115.2,117.6,122.4);--el-bg-color:#ffffff;--el-bg-color-page:#f2f3f5;--el-bg-color-overlay:#ffffff;--el-text-color-primary:#303133;--el-text-color-regular:#606266;--el-text-color-secondary:#909399;--el-text-color-placeholder:#a8abb2;--el-text-color-disabled:#c0c4cc;--el-border-color:#dcdfe6;--el-border-color-light:#e4e7ed;--el-border-color-lighter:#ebeef5;--el-border-color-extra-light:#f2f6fc;--el-border-color-dark:#d4d7de;--el-border-color-darker:#cdd0d6;--el-fill-color:#f0f2f5;--el-fill-color-light:#f5f7fa;--el-fill-color-lighter:#fafafa;--el-fill-color-extra-light:#fafcff;--el-fill-color-dark:#ebedf0;--el-fill-color-darker:#e6e8eb;--el-fill-color-blank:#ffffff;--el-box-shadow:0px 12px 32px 4px rgba(0,0,0,.04),0px 8px 20px rgba(0,0,0,.08);--el-box-shadow-light:0px 0px 12px rgba(0,0,0,.12);--el-box-shadow-lighter:0px 0px 6px rgba(0,0,0,.12);--el-box-shadow-dark:0px 16px 48px 16px rgba(0,0,0,.08),0px 12px 32px rgba(0,0,0,.12),0px 8px 16px -8px rgba(0,0,0,.16);--el-disabled-bg-color:var(--el-fill-color-light);--el-disabled-text-color:var(--el-text-color-placeholder);--el-disabled-border-color:var(--el-border-color-light);--el-overlay-color:rgba(0,0,0,.8);--el-overlay-color-light:rgba(0,0,0,.7);--el-overlay-color-lighter:rgba(0,0,0,.5);--el-mask-color:rgba(255,255,255,.9);--el-mask-color-extra-light:rgba(255,255,255,.3);--el-border-width:1px;--el-border-style:solid;--el-border-color-hover:var(--el-text-color-disabled);--el-border:var(--el-border-width) var(--el-border-style) var(--el-border-color);--el-svg-monochrome-grey:var(--el-border-color)}.fade-in-linear-enter-active,.fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.fade-in-linear-enter-from,.fade-in-linear-leave-to{opacity:0}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.el-fade-in-linear-enter-from,.el-fade-in-linear-leave-to{opacity:0}.el-fade-in-enter-active,.el-fade-in-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-fade-in-enter-from,.el-fade-in-leave-active{opacity:0}.el-zoom-in-center-enter-active,.el-zoom-in-center-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-zoom-in-center-enter-from,.el-zoom-in-center-leave-active{opacity:0;transform:scaleX(0)}.el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;transform:scaleY(1);transform-origin:center top;transition:var(--el-transition-md-fade)}.el-zoom-in-top-enter-active[data-popper-placement^=top],.el-zoom-in-top-leave-active[data-popper-placement^=top]{transform-origin:center bottom}.el-zoom-in-top-enter-from,.el-zoom-in-top-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-bottom-enter-active,.el-zoom-in-bottom-leave-active{opacity:1;transform:scaleY(1);transform-origin:center bottom;transition:var(--el-transition-md-fade)}.el-zoom-in-bottom-enter-from,.el-zoom-in-bottom-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-left-enter-active,.el-zoom-in-left-leave-active{opacity:1;transform:scale(1);transform-origin:top left;transition:var(--el-transition-md-fade)}.el-zoom-in-left-enter-from,.el-zoom-in-left-leave-active{opacity:0;transform:scale(.45)}.collapse-transition{transition:var(--el-transition-duration) height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.el-collapse-transition-enter-active,.el-collapse-transition-leave-active{transition:var(--el-transition-duration) max-height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.horizontal-collapse-transition{transition:var(--el-transition-duration) width ease-in-out,var(--el-transition-duration) padding-left ease-in-out,var(--el-transition-duration) padding-right ease-in-out}.el-list-enter-active,.el-list-leave-active{transition:all 1s}.el-list-enter-from,.el-list-leave-to{opacity:0;transform:translateY(-30px)}.el-list-leave-active{position:absolute!important}.el-opacity-transition{transition:opacity var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-icon-loading{animation:rotating 2s linear infinite}.el-icon--right{margin-left:5px}.el-icon--left{margin-right:5px}@keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(1turn)}}.el-icon{--color:inherit;align-items:center;display:inline-flex;height:1em;justify-content:center;line-height:1em;position:relative;width:1em;fill:currentColor;color:var(--color);font-size:inherit}.el-icon.is-loading{animation:rotating 2s linear infinite}.el-icon svg{height:1em;width:1em}.el-slider{--el-slider-main-bg-color:var(--el-color-primary);--el-slider-runway-bg-color:var(--el-border-color-light);--el-slider-stop-bg-color:var(--el-color-white);--el-slider-disabled-color:var(--el-text-color-placeholder);--el-slider-border-radius:3px;--el-slider-height:6px;--el-slider-button-size:20px;--el-slider-button-wrapper-size:36px;--el-slider-button-wrapper-offset:-15px;align-items:center;display:flex;height:32px;width:100%}.el-slider__runway{background-color:var(--el-slider-runway-bg-color);border-radius:var(--el-slider-border-radius);cursor:pointer;flex:1;height:var(--el-slider-height);position:relative}.el-slider__runway.show-input{margin-right:30px;width:auto}.el-slider__runway.is-disabled{cursor:default}.el-slider__runway.is-disabled .el-slider__bar{background-color:var(--el-slider-disabled-color)}.el-slider__runway.is-disabled .el-slider__button{border-color:var(--el-slider-disabled-color)}.el-slider__runway.is-disabled .el-slider__button-wrapper.dragging,.el-slider__runway.is-disabled .el-slider__button-wrapper.hover,.el-slider__runway.is-disabled .el-slider__button-wrapper:hover{cursor:not-allowed}.el-slider__runway.is-disabled .el-slider__button.dragging,.el-slider__runway.is-disabled .el-slider__button.hover,.el-slider__runway.is-disabled .el-slider__button:hover{transform:scale(1)}.el-slider__runway.is-disabled .el-slider__button.dragging,.el-slider__runway.is-disabled .el-slider__button.hover,.el-slider__runway.is-disabled .el-slider__button:hover{cursor:not-allowed}.el-slider__input{flex-shrink:0;width:130px}.el-slider__bar{background-color:var(--el-slider-main-bg-color);border-bottom-left-radius:var(--el-slider-border-radius);border-top-left-radius:var(--el-slider-border-radius);height:var(--el-slider-height);position:absolute}.el-slider__button-wrapper{background-color:transparent;height:var(--el-slider-button-wrapper-size);line-height:normal;outline:none;position:absolute;text-align:center;top:var(--el-slider-button-wrapper-offset);transform:translate(-50%);-webkit-user-select:none;-moz-user-select:none;user-select:none;width:var(--el-slider-button-wrapper-size);z-index:1}.el-slider__button-wrapper:after{content:"";display:inline-block;height:100%;vertical-align:middle}.el-slider__button-wrapper.hover,.el-slider__button-wrapper:hover{cursor:grab}.el-slider__button-wrapper.dragging{cursor:grabbing}.el-slider__button{background-color:var(--el-color-white);border:2px solid var(--el-slider-main-bg-color);border-radius:50%;box-sizing:border-box;display:inline-block;height:var(--el-slider-button-size);transition:var(--el-transition-duration-fast);-webkit-user-select:none;-moz-user-select:none;user-select:none;vertical-align:middle;width:var(--el-slider-button-size)}.el-slider__button.dragging,.el-slider__button.hover,.el-slider__button:hover{transform:scale(1.2)}.el-slider__button.hover,.el-slider__button:hover{cursor:grab}.el-slider__button.dragging{cursor:grabbing}.el-slider__stop{background-color:var(--el-slider-stop-bg-color);border-radius:var(--el-border-radius-circle);height:var(--el-slider-height);position:absolute;transform:translate(-50%);width:var(--el-slider-height)}.el-slider__marks{height:100%;left:12px;top:0;width:18px}.el-slider__marks-text{color:var(--el-color-info);font-size:14px;margin-top:15px;position:absolute;transform:translate(-50%);white-space:pre}.el-slider.is-vertical{display:inline-flex;flex:0;height:100%;position:relative;width:auto}.el-slider.is-vertical .el-slider__runway{height:100%;margin:0 16px;width:var(--el-slider-height)}.el-slider.is-vertical .el-slider__bar{border-radius:0 0 3px 3px;height:auto;width:var(--el-slider-height)}.el-slider.is-vertical .el-slider__button-wrapper{left:var(--el-slider-button-wrapper-offset);top:auto;transform:translateY(50%)}.el-slider.is-vertical .el-slider__stop{transform:translateY(50%)}.el-slider.is-vertical .el-slider__marks-text{left:15px;margin-top:0;transform:translateY(50%)}.el-slider--large{height:40px}.el-slider--small{height:24px}.el-textarea{--el-input-text-color:var(--el-text-color-regular);--el-input-border:var(--el-border);--el-input-hover-border:var(--el-border-color-hover);--el-input-focus-border:var(--el-color-primary);--el-input-transparent-border:0 0 0 1px transparent inset;--el-input-border-color:var(--el-border-color);--el-input-border-radius:var(--el-border-radius-base);--el-input-bg-color:var(--el-fill-color-blank);--el-input-icon-color:var(--el-text-color-placeholder);--el-input-placeholder-color:var(--el-text-color-placeholder);--el-input-hover-border-color:var(--el-border-color-hover);--el-input-clear-hover-color:var(--el-text-color-secondary);--el-input-focus-border-color:var(--el-color-primary);--el-input-width:100%;display:inline-block;font-size:var(--el-font-size-base);position:relative;vertical-align:bottom;width:100%}.el-textarea__inner{-webkit-appearance:none;background-color:var(--el-input-bg-color,var(--el-fill-color-blank));background-image:none;border:none;border-radius:var(--el-input-border-radius,var(--el-border-radius-base));box-shadow:0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;box-sizing:border-box;color:var(--el-input-text-color,var(--el-text-color-regular));display:block;font-family:inherit;font-size:inherit;line-height:1.5;padding:5px 11px;position:relative;resize:vertical;transition:var(--el-transition-box-shadow);width:100%}.el-textarea__inner::-moz-placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-textarea__inner::placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-textarea__inner:hover{box-shadow:0 0 0 1px var(--el-input-hover-border-color) inset}.el-textarea__inner:focus{box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset;outline:none}.el-textarea .el-input__count{background:var(--el-fill-color-blank);bottom:5px;color:var(--el-color-info);font-size:12px;line-height:14px;position:absolute;right:10px}.el-textarea.is-disabled .el-textarea__inner{background-color:var(--el-disabled-bg-color);box-shadow:0 0 0 1px var(--el-disabled-border-color) inset;color:var(--el-disabled-text-color);cursor:not-allowed}.el-textarea.is-disabled .el-textarea__inner::-moz-placeholder{color:var(--el-text-color-placeholder)}.el-textarea.is-disabled .el-textarea__inner::placeholder{color:var(--el-text-color-placeholder)}.el-textarea.is-exceed .el-textarea__inner{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-textarea.is-exceed .el-input__count{color:var(--el-color-danger)}.el-input{--el-input-text-color:var(--el-text-color-regular);--el-input-border:var(--el-border);--el-input-hover-border:var(--el-border-color-hover);--el-input-focus-border:var(--el-color-primary);--el-input-transparent-border:0 0 0 1px transparent inset;--el-input-border-color:var(--el-border-color);--el-input-border-radius:var(--el-border-radius-base);--el-input-bg-color:var(--el-fill-color-blank);--el-input-icon-color:var(--el-text-color-placeholder);--el-input-placeholder-color:var(--el-text-color-placeholder);--el-input-hover-border-color:var(--el-border-color-hover);--el-input-clear-hover-color:var(--el-text-color-secondary);--el-input-focus-border-color:var(--el-color-primary);--el-input-width:100%;--el-input-height:var(--el-component-size);box-sizing:border-box;display:inline-flex;font-size:var(--el-font-size-base);line-height:var(--el-input-height);position:relative;vertical-align:middle;width:var(--el-input-width)}.el-input::-webkit-scrollbar{width:6px;z-index:11}.el-input::-webkit-scrollbar:horizontal{height:6px}.el-input::-webkit-scrollbar-thumb{background:var(--el-text-color-disabled);border-radius:5px;width:6px}.el-input::-webkit-scrollbar-corner,.el-input::-webkit-scrollbar-track{background:var(--el-fill-color-blank)}.el-input::-webkit-scrollbar-track-piece{background:var(--el-fill-color-blank);width:6px}.el-input .el-input__clear,.el-input .el-input__password{color:var(--el-input-icon-color);cursor:pointer;font-size:14px}.el-input .el-input__clear:hover,.el-input .el-input__password:hover{color:var(--el-input-clear-hover-color)}.el-input .el-input__count{align-items:center;color:var(--el-color-info);display:inline-flex;font-size:12px;height:100%}.el-input .el-input__count .el-input__count-inner{background:var(--el-fill-color-blank);display:inline-block;line-height:normal;padding-left:8px}.el-input__wrapper{align-items:center;background-color:var(--el-input-bg-color,var(--el-fill-color-blank));background-image:none;border-radius:var(--el-input-border-radius,var(--el-border-radius-base));box-shadow:0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;cursor:text;display:inline-flex;flex-grow:1;justify-content:center;padding:1px 11px;transform:translateZ(0);transition:var(--el-transition-box-shadow)}.el-input__wrapper:hover{box-shadow:0 0 0 1px var(--el-input-hover-border-color) inset}.el-input__wrapper.is-focus{box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset}.el-input{--el-input-inner-height:calc(var(--el-input-height, 32px) - 2px)}.el-input__inner{-webkit-appearance:none;background:none;border:none;box-sizing:border-box;color:var(--el-input-text-color,var(--el-text-color-regular));flex-grow:1;font-size:inherit;height:var(--el-input-inner-height);line-height:var(--el-input-inner-height);outline:none;padding:0;width:100%}.el-input__inner:focus{outline:none}.el-input__inner::-moz-placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-input__inner::placeholder{color:var(--el-input-placeholder-color,var(--el-text-color-placeholder))}.el-input__inner[type=password]::-ms-reveal{display:none}.el-input__inner[type=number]{line-height:1}.el-input__prefix{color:var(--el-input-icon-color,var(--el-text-color-placeholder));display:inline-flex;flex-shrink:0;flex-wrap:nowrap;height:100%;line-height:var(--el-input-inner-height);pointer-events:none;text-align:center;transition:all var(--el-transition-duration);white-space:nowrap}.el-input__prefix-inner{align-items:center;display:inline-flex;justify-content:center;pointer-events:all}.el-input__prefix-inner>:last-child{margin-right:8px}.el-input__prefix-inner>:first-child,.el-input__prefix-inner>:first-child.el-input__icon{margin-left:0}.el-input__suffix{color:var(--el-input-icon-color,var(--el-text-color-placeholder));display:inline-flex;flex-shrink:0;flex-wrap:nowrap;height:100%;line-height:var(--el-input-inner-height);pointer-events:none;text-align:center;transition:all var(--el-transition-duration);white-space:nowrap}.el-input__suffix-inner{align-items:center;display:inline-flex;justify-content:center;pointer-events:all}.el-input__suffix-inner>:first-child{margin-left:8px}.el-input .el-input__icon{align-items:center;display:flex;height:inherit;justify-content:center;line-height:inherit;margin-left:8px;transition:all var(--el-transition-duration)}.el-input__validateIcon{pointer-events:none}.el-input.is-active .el-input__wrapper{box-shadow:0 0 0 1px var(--el-input-focus-color, ) inset}.el-input.is-disabled{cursor:not-allowed}.el-input.is-disabled .el-input__wrapper{background-color:var(--el-disabled-bg-color);box-shadow:0 0 0 1px var(--el-disabled-border-color) inset;cursor:not-allowed}.el-input.is-disabled .el-input__inner{color:var(--el-disabled-text-color);-webkit-text-fill-color:var(--el-disabled-text-color);cursor:not-allowed}.el-input.is-disabled .el-input__inner::-moz-placeholder{color:var(--el-text-color-placeholder)}.el-input.is-disabled .el-input__inner::placeholder{color:var(--el-text-color-placeholder)}.el-input.is-disabled .el-input__icon{cursor:not-allowed}.el-input.is-exceed .el-input__wrapper{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-input.is-exceed .el-input__suffix .el-input__count{color:var(--el-color-danger)}.el-input--large{--el-input-height:var(--el-component-size-large);font-size:14px}.el-input--large .el-input__wrapper{padding:1px 15px}.el-input--large{--el-input-inner-height:calc(var(--el-input-height, 40px) - 2px)}.el-input--small{--el-input-height:var(--el-component-size-small);font-size:12px}.el-input--small .el-input__wrapper{padding:1px 7px}.el-input--small{--el-input-inner-height:calc(var(--el-input-height, 24px) - 2px)}.el-input-group{align-items:stretch;display:inline-flex;width:100%}.el-input-group__append,.el-input-group__prepend{align-items:center;background-color:var(--el-fill-color-light);border-radius:var(--el-input-border-radius);color:var(--el-color-info);display:inline-flex;justify-content:center;min-height:100%;padding:0 20px;position:relative;white-space:nowrap}.el-input-group__append:focus,.el-input-group__prepend:focus{outline:none}.el-input-group__append .el-button,.el-input-group__append .el-select,.el-input-group__prepend .el-button,.el-input-group__prepend .el-select{display:inline-block;margin:0 -20px}.el-input-group__append button.el-button,.el-input-group__append button.el-button:hover,.el-input-group__append div.el-select .el-select__wrapper,.el-input-group__append div.el-select:hover .el-select__wrapper,.el-input-group__prepend button.el-button,.el-input-group__prepend button.el-button:hover,.el-input-group__prepend div.el-select .el-select__wrapper,.el-input-group__prepend div.el-select:hover .el-select__wrapper{background-color:transparent;border-color:transparent;color:inherit}.el-input-group__append .el-button,.el-input-group__append .el-input,.el-input-group__prepend .el-button,.el-input-group__prepend .el-input{font-size:inherit}.el-input-group__prepend{border-bottom-right-radius:0;border-right:0;border-top-right-radius:0;box-shadow:1px 0 0 0 var(--el-input-border-color) inset,0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset}.el-input-group__append{border-left:0;box-shadow:0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset,-1px 0 0 0 var(--el-input-border-color) inset}.el-input-group--prepend>.el-input__wrapper,.el-input-group__append{border-bottom-left-radius:0;border-top-left-radius:0}.el-input-group--prepend .el-input-group__prepend .el-select .el-select__wrapper{border-bottom-right-radius:0;border-top-right-radius:0;box-shadow:1px 0 0 0 var(--el-input-border-color) inset,0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset}.el-input-group--append>.el-input__wrapper{border-bottom-right-radius:0;border-top-right-radius:0}.el-input-group--append .el-input-group__append .el-select .el-select__wrapper{border-bottom-left-radius:0;border-top-left-radius:0;box-shadow:0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset,-1px 0 0 0 var(--el-input-border-color) inset}.el-input-hidden{display:none!important}.el-input-number{display:inline-flex;line-height:30px;position:relative;vertical-align:middle;width:150px}.el-input-number .el-input__wrapper{padding-left:42px;padding-right:42px}.el-input-number .el-input__inner{-webkit-appearance:none;-moz-appearance:textfield;line-height:1;text-align:center}.el-input-number .el-input__inner::-webkit-inner-spin-button,.el-input-number .el-input__inner::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.el-input-number__decrease,.el-input-number__increase{align-items:center;background:var(--el-fill-color-light);bottom:1px;color:var(--el-text-color-regular);cursor:pointer;display:flex;font-size:13px;height:auto;justify-content:center;position:absolute;top:1px;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:32px;z-index:1}.el-input-number__decrease:hover,.el-input-number__increase:hover{color:var(--el-color-primary)}.el-input-number__decrease:hover~.el-input:not(.is-disabled) .el-input__wrapper,.el-input-number__increase:hover~.el-input:not(.is-disabled) .el-input__wrapper{box-shadow:0 0 0 1px var(--el-input-focus-border-color,var(--el-color-primary)) inset}.el-input-number__decrease.is-disabled,.el-input-number__increase.is-disabled{color:var(--el-disabled-text-color);cursor:not-allowed}.el-input-number__increase{border-left:var(--el-border);border-radius:0 var(--el-border-radius-base) var(--el-border-radius-base) 0;right:1px}.el-input-number__decrease{border-radius:var(--el-border-radius-base) 0 0 var(--el-border-radius-base);border-right:var(--el-border);left:1px}.el-input-number.is-disabled .el-input-number__decrease,.el-input-number.is-disabled .el-input-number__increase{border-color:var(--el-disabled-border-color);color:var(--el-disabled-border-color)}.el-input-number.is-disabled .el-input-number__decrease:hover,.el-input-number.is-disabled .el-input-number__increase:hover{color:var(--el-disabled-border-color);cursor:not-allowed}.el-input-number--large{line-height:38px;width:180px}.el-input-number--large .el-input-number__decrease,.el-input-number--large .el-input-number__increase{font-size:14px;width:40px}.el-input-number--large.is-controls-right .el-input--large .el-input__wrapper{padding-right:47px}.el-input-number--large .el-input--large .el-input__wrapper{padding-left:47px;padding-right:47px}.el-input-number--small{line-height:22px;width:120px}.el-input-number--small .el-input-number__decrease,.el-input-number--small .el-input-number__increase{font-size:12px;width:24px}.el-input-number--small.is-controls-right .el-input--small .el-input__wrapper{padding-right:31px}.el-input-number--small .el-input--small .el-input__wrapper{padding-left:31px;padding-right:31px}.el-input-number--small .el-input-number__decrease [class*=el-icon],.el-input-number--small .el-input-number__increase [class*=el-icon]{transform:scale(.9)}.el-input-number.is-without-controls .el-input__wrapper{padding-left:15px;padding-right:15px}.el-input-number.is-controls-right .el-input__wrapper{padding-left:15px;padding-right:42px}.el-input-number.is-controls-right .el-input-number__decrease,.el-input-number.is-controls-right .el-input-number__increase{--el-input-number-controls-height:15px;height:var(--el-input-number-controls-height);line-height:var(--el-input-number-controls-height)}.el-input-number.is-controls-right .el-input-number__decrease [class*=el-icon],.el-input-number.is-controls-right .el-input-number__increase [class*=el-icon]{transform:scale(.8)}.el-input-number.is-controls-right .el-input-number__increase{border-bottom:var(--el-border);border-radius:0 var(--el-border-radius-base) 0 0;bottom:auto;left:auto}.el-input-number.is-controls-right .el-input-number__decrease{border-left:var(--el-border);border-radius:0 0 var(--el-border-radius-base) 0;border-right:none;left:auto;right:1px;top:auto}.el-input-number.is-controls-right[class*=large] [class*=decrease],.el-input-number.is-controls-right[class*=large] [class*=increase]{--el-input-number-controls-height:19px}.el-input-number.is-controls-right[class*=small] [class*=decrease],.el-input-number.is-controls-right[class*=small] [class*=increase]{--el-input-number-controls-height:11px}.el-popper{--el-popper-border-radius:var(--el-popover-border-radius,4px);border-radius:var(--el-popper-border-radius);font-size:12px;line-height:20px;min-width:10px;overflow-wrap:break-word;padding:5px 11px;position:absolute;visibility:visible;z-index:2000}.el-popper.is-dark{color:var(--el-bg-color)}.el-popper.is-dark,.el-popper.is-dark>.el-popper__arrow:before{background:var(--el-text-color-primary);border:1px solid var(--el-text-color-primary)}.el-popper.is-dark>.el-popper__arrow:before{right:0}.el-popper.is-light,.el-popper.is-light>.el-popper__arrow:before{background:var(--el-bg-color-overlay);border:1px solid var(--el-border-color-light)}.el-popper.is-light>.el-popper__arrow:before{right:0}.el-popper.is-pure{padding:0}.el-popper__arrow,.el-popper__arrow:before{height:10px;position:absolute;width:10px;z-index:-1}.el-popper__arrow:before{background:var(--el-text-color-primary);box-sizing:border-box;content:" ";transform:rotate(45deg)}.el-popper[data-popper-placement^=top]>.el-popper__arrow{bottom:-5px}.el-popper[data-popper-placement^=top]>.el-popper__arrow:before{border-bottom-right-radius:2px}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow{top:-5px}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow:before{border-top-left-radius:2px}.el-popper[data-popper-placement^=left]>.el-popper__arrow{right:-5px}.el-popper[data-popper-placement^=left]>.el-popper__arrow:before{border-top-right-radius:2px}.el-popper[data-popper-placement^=right]>.el-popper__arrow{left:-5px}.el-popper[data-popper-placement^=right]>.el-popper__arrow:before{border-bottom-left-radius:2px}.el-popper[data-popper-placement^=top]>.el-popper__arrow:before{border-left-color:transparent!important;border-top-color:transparent!important}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow:before{border-bottom-color:transparent!important;border-right-color:transparent!important}.el-popper[data-popper-placement^=left]>.el-popper__arrow:before{border-bottom-color:transparent!important;border-left-color:transparent!important}.el-popper[data-popper-placement^=right]>.el-popper__arrow:before{border-right-color:transparent!important;border-top-color:transparent!important}.toolbar[data-v-759e8fa0]{position:fixed;top:0;right:0;z-index:9999}.toolbar .btn[data-v-759e8fa0]{background:#fff;box-shadow:0 0 3px #888;padding:10px;position:fixed;bottom:210px;right:20px;border-radius:50%;height:36px;width:36px;display:flex;justify-content:center;align-items:center}.toolbar .list[data-v-759e8fa0]{pointer-events:none;position:fixed;left:50%;top:50%;border:1px solid #000;border-radius:50%;display:flex;width:var(--circle-w);height:var(--circle-w)}.toolbar .list .dian[data-v-759e8fa0],.toolbar .list .dian2[data-v-759e8fa0]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:red;height:calc(var(--circle-w) / 1.5);width:1px}.toolbar .list .dian2[data-v-759e8fa0]{width:calc(var(--circle-w) / 1.5);height:1px}.toolbar .list .inner-circle[data-v-759e8fa0]{position:absolute;top:50%;left:50%;border:1px solid #000;transform:translate(-50%,-50%);height:calc(var(--circle-w) - 70px);width:calc(var(--circle-w) - 70px);border-radius:50%}.toolbar .list .item[data-v-759e8fa0]{position:absolute;top:calc(50% - 15px);left:0;height:30px;width:100%;display:flex;justify-content:space-between;align-items:center;font-weight:700}.toolbar .list .item .left[data-v-759e8fa0],.toolbar .list .item .right[data-v-759e8fa0]{height:100%;width:35px;display:flex;justify-content:center;align-items:center}.toolbar .list .item .left span[data-v-759e8fa0],.toolbar .list .item .right span[data-v-759e8fa0]{transform:rotate(90deg)}.toolbar .list .item .left[data-v-759e8fa0]:before,.toolbar .list .item .right[data-v-759e8fa0]:before{content:" ";position:absolute;display:block;left:0;height:100%;width:34px;border-top:1px solid #000;transform:rotate(5deg)}.toolbar .list .item .left[data-v-759e8fa0]:after,.toolbar .list .item .right[data-v-759e8fa0]:after{content:" ";position:absolute;left:0;display:block;height:100%;width:34px;border-bottom:1px solid #000;transform:rotate(-5deg)}.toolbar .list .item .right span[data-v-759e8fa0]{transform:rotate(-90deg)}.toolbar .list .item .right[data-v-759e8fa0]:before{left:unset;right:0;transform:rotate(-5deg)}.toolbar .list .item .right[data-v-759e8fa0]:after{left:unset;right:0;transform:rotate(5deg)}.toolbar .r[data-v-759e8fa0]{position:fixed;bottom:200px;right:50%;width:var(--circle-w);transform:translate(50%);display:flex;align-items:center;gap:10px} ');

(function (vue) {
  'use strict';

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
  /**
  * @vue/shared v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const NOOP = () => {
  };
  const hasOwnProperty$6 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$6.call(val, key);
  const isArray$1 = Array.isArray;
  const isFunction$1 = (val) => typeof val === "function";
  const isString$1 = (val) => typeof val === "string";
  const isObject$1 = (val) => val !== null && typeof val === "object";
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var Symbol$1 = root.Symbol;
  var objectProto$6 = Object.prototype;
  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$6.toString;
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty$5.call(value, symToStringTag$1), tag = value[symToStringTag$1];
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
  var objectProto$5 = Object.prototype;
  var nativeObjectToString = objectProto$5.toString;
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
  var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray(value)) {
      return arrayMap(value, baseToString) + "";
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -Infinity ? "-0" : result;
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
  function identity$1(value) {
    return value;
  }
  var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
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
  var funcProto = Function.prototype, objectProto$4 = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty$4).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
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
  var baseSetToString = !defineProperty ? identity$1 : function(func, string) {
    return defineProperty(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant(string),
      "writable": true
    });
  };
  var setToString = shortOut(baseSetToString);
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
  var objectProto$3 = Object.prototype;
  var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$3.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }
  var nativeMax$1 = Math.max;
  function overRest(func, start, transform) {
    start = nativeMax$1(start === void 0 ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax$1(args.length - start, 0), array = Array(length);
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
  var argsTag = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }
  var objectProto$2 = Object.prototype;
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
  var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;
  var isArguments = baseIsArguments(/* @__PURE__ */ function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$2.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray(value)) {
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
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED$1 ? void 0 : result;
    }
    return hasOwnProperty$1.call(data, key) ? data[key] : void 0;
  }
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
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
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function castPath(value, object) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -Infinity ? "-0" : result;
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
  var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
  function isFlattenable(value) {
    return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
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
    return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
  }
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  var now = function() {
    return root.Date.now();
  };
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
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
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
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
      return timerId === void 0 ? result : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
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
  function baseSet(object, path, value, customizer) {
    if (!isObject(object)) {
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
          newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
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
  const isUndefined = (val) => val === void 0;
  const isBoolean = (val) => typeof val === "boolean";
  const isNumber = (val) => typeof val === "number";
  const isElement = (e) => {
    if (typeof Element === "undefined")
      return false;
    return e instanceof Element;
  };
  const isStringNumber = (val) => {
    if (!isString$1(val)) {
      return false;
    }
    return !Number.isNaN(Number(val));
  };
  var __defProp$9 = Object.defineProperty;
  var __defProps$6 = Object.defineProperties;
  var __getOwnPropDescs$6 = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols$b = Object.getOwnPropertySymbols;
  var __hasOwnProp$b = Object.prototype.hasOwnProperty;
  var __propIsEnum$b = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$9 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$b.call(b, prop))
        __defNormalProp$9(a, prop, b[prop]);
    if (__getOwnPropSymbols$b)
      for (var prop of __getOwnPropSymbols$b(b)) {
        if (__propIsEnum$b.call(b, prop))
          __defNormalProp$9(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps$6 = (a, b) => __defProps$6(a, __getOwnPropDescs$6(b));
  function computedEager(fn2, options) {
    var _a2;
    const result = vue.shallowRef();
    vue.watchEffect(() => {
      result.value = fn2();
    }, __spreadProps$6(__spreadValues$9({}, options), {
      flush: (_a2 = void 0) != null ? _a2 : "sync"
    }));
    return vue.readonly(result);
  }
  var _a;
  const isClient = typeof window !== "undefined";
  const isString = (val) => typeof val === "string";
  const noop = () => {
  };
  const isIOS = isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function resolveUnref(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  function identity(arg) {
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
    if (isString(args[0]) || Array.isArray(args[0])) {
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
      return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
    });
    const currentZIndex = vue.computed(() => initialZIndex.value + zIndex.value);
    const nextZIndex = () => {
      increasingInjection.current++;
      zIndex.value = increasingInjection.current;
      return currentZIndex.value;
    };
    if (!isClient && !vue.inject(ZINDEX_INJECTION_KEY)) ;
    return {
      initialZIndex,
      currentZIndex,
      nextZIndex
    };
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
        description: "current color is {color}. press enter to select a new color.",
        alphaLabel: "pick alpha value"
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
      mention: {
        loading: "Loading"
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
    const locale = vue.inject(localeContextKey, vue.ref());
    return buildLocaleContext(vue.computed(() => locale.value || English));
  };
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
  const componentSizes = ["", "default", "small", "large"];
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
  const UPDATE_MODEL_EVENT = "update:modelValue";
  const CHANGE_EVENT = "change";
  const INPUT_EVENT = "input";
  var _export_sfc$1 = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  function addUnit(value, defaultUnit = "px") {
    if (!value)
      return "";
    if (isNumber(value) || isStringNumber(value)) {
      return `${value}${defaultUnit}`;
    } else if (isString$1(value)) {
      return value;
    }
  }
  const withInstall = (main, extra) => {
    main.install = (app) => {
      for (const comp of [main, ...Object.values({})]) {
        app.component(comp.name, comp);
      }
    };
    return main;
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
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
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
          fontSize: isUndefined(size) ? void 0 : addUnit(size),
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
  var Icon = /* @__PURE__ */ _export_sfc$1(_sfc_main$e, [["__file", "icon.vue"]]);
  const ElIcon = withInstall(Icon);
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
  var arrow_up_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowUp",
    __name: "arrow-up",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m488.832 344.32-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"
        })
      ]));
    }
  });
  var arrow_up_default = arrow_up_vue_vue_type_script_setup_true_lang_default;
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
  var minus_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Minus",
    __name: "minus",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64"
        })
      ]));
    }
  });
  var minus_default = minus_vue_vue_type_script_setup_true_lang_default;
  var plus_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Plus",
    __name: "plus",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"
        })
      ]));
    }
  });
  var plus_default = plus_vue_vue_type_script_setup_true_lang_default;
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
  const isFirefox = () => isClient && /firefox/i.test(window.navigator.userAgent);
  let hiddenTextarea = void 0;
  const HIDDEN_STYLE = {
    height: "0",
    visibility: "hidden",
    overflow: isFirefox() ? "" : "hidden",
    position: "absolute",
    "z-index": "-1000",
    top: "0",
    right: "0"
  };
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
    const contextStyle = CONTEXT_STYLE.map((name) => [
      name,
      style.getPropertyValue(name)
    ]);
    return { contextStyle, paddingSize, borderSize, boxSizing };
  }
  function calcTextareaHeight(targetElement, minRows = 1, maxRows) {
    var _a2;
    if (!hiddenTextarea) {
      hiddenTextarea = document.createElement("textarea");
      document.body.appendChild(hiddenTextarea);
    }
    const { paddingSize, borderSize, boxSizing, contextStyle } = calculateNodeStyling(targetElement);
    contextStyle.forEach(([key, value]) => hiddenTextarea == null ? void 0 : hiddenTextarea.style.setProperty(key, value));
    Object.entries(HIDDEN_STYLE).forEach(([key, value]) => hiddenTextarea == null ? void 0 : hiddenTextarea.style.setProperty(key, value, "important"));
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
  const mutable = (val) => val;
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
    readonly: Boolean,
    clearable: Boolean,
    showPassword: Boolean,
    showWordLimit: Boolean,
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
    autofocus: Boolean,
    rows: {
      type: Number,
      default: 2
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
  const formContextKey = Symbol("formContextKey");
  const formItemContextKey = Symbol("formItemContextKey");
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
    const idRef = computedEager(() => vue.unref(deterministicId) || `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`);
    return idRef;
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
  const useProp = (name) => {
    const vm = vue.getCurrentInstance();
    return vue.computed(() => {
      var _a2, _b;
      return (_b = (_a2 = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a2.$props) == null ? void 0 : _b[name];
    });
  };
  const useFormSize = (fallback, ignore = {}) => {
    const emptyRef = vue.ref(void 0);
    const size = ignore.prop ? emptyRef : useProp("size");
    const globalConfig = ignore.global ? emptyRef : useGlobalSize();
    const form = ignore.form ? { size: void 0 } : vue.inject(formContextKey, void 0);
    const formItem = ignore.formItem ? { size: void 0 } : vue.inject(formItemContextKey, void 0);
    return vue.computed(() => size.value || vue.unref(fallback) || (formItem == null ? void 0 : formItem.size) || (form == null ? void 0 : form.size) || globalConfig.value || "");
  };
  const useFormDisabled = (fallback) => {
    const disabled = useProp("disabled");
    const form = vue.inject(formContextKey, void 0);
    return vue.computed(() => disabled.value || vue.unref(fallback) || (form == null ? void 0 : form.disabled) || false);
  };
  function useFocusController(target, {
    beforeFocus,
    afterFocus,
    beforeBlur,
    afterBlur
  } = {}) {
    const instance = vue.getCurrentInstance();
    const { emit } = instance;
    const wrapperRef = vue.shallowRef();
    const disabled = useProp("disabled");
    const isFocused = vue.ref(false);
    const handleFocus = (event) => {
      const cancelFocus = isFunction$1(beforeFocus) ? beforeFocus(event) : false;
      if (cancelFocus || isFocused.value)
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
      var _a2, _b;
      if (((_a2 = wrapperRef.value) == null ? void 0 : _a2.contains(document.activeElement)) && wrapperRef.value !== document.activeElement || disabled.value)
        return;
      (_b = target.value) == null ? void 0 : _b.focus();
    };
    vue.watch([wrapperRef, disabled], ([el, disabled2]) => {
      if (!el)
        return;
      if (disabled2) {
        el.removeAttribute("tabindex");
      } else {
        el.setAttribute("tabindex", "-1");
      }
    });
    useEventListener(wrapperRef, "focus", handleFocus, true);
    useEventListener(wrapperRef, "blur", handleBlur, true);
    useEventListener(wrapperRef, "click", handleClick, true);
    return {
      isFocused,
      wrapperRef,
      handleFocus,
      handleBlur
    };
  }
  const isKorean = (text) => /([\uAC00-\uD7AF\u3130-\u318F])+/gi.test(text);
  function useComposition({
    afterComposition,
    emit
  }) {
    const isComposing = vue.ref(false);
    const handleCompositionStart = (event) => {
      emit == null ? void 0 : emit("compositionstart", event);
      isComposing.value = true;
    };
    const handleCompositionUpdate = (event) => {
      var _a2;
      emit == null ? void 0 : emit("compositionupdate", event);
      const text = (_a2 = event.target) == null ? void 0 : _a2.value;
      const lastCharacter = text[text.length - 1] || "";
      isComposing.value = !isKorean(lastCharacter);
    };
    const handleCompositionEnd = (event) => {
      emit == null ? void 0 : emit("compositionend", event);
      if (isComposing.value) {
        isComposing.value = false;
        vue.nextTick(() => afterComposition(event));
      }
    };
    const handleComposition = (event) => {
      event.type === "compositionend" ? handleCompositionEnd(event) : handleCompositionUpdate(event);
    };
    return {
      isComposing,
      handleComposition,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd
    };
  }
  function useCursor(input) {
    let selectionInfo;
    function recordCursor() {
      if (input.value == void 0)
        return;
      const { selectionStart, selectionEnd, value } = input.value;
      if (selectionStart == null || selectionEnd == null)
        return;
      const beforeTxt = value.slice(0, Math.max(0, selectionStart));
      const afterTxt = value.slice(Math.max(0, selectionEnd));
      selectionInfo = {
        selectionStart,
        selectionEnd,
        value,
        beforeTxt,
        afterTxt
      };
    }
    function setCursor() {
      if (input.value == void 0 || selectionInfo == void 0)
        return;
      const { value } = input.value;
      const { beforeTxt, afterTxt, selectionStart } = selectionInfo;
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
  const COMPONENT_NAME = "ElInput";
  const __default__$a = vue.defineComponent({
    name: COMPONENT_NAME,
    inheritAttrs: false
  });
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    ...__default__$a,
    props: inputProps,
    emits: inputEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const rawAttrs = vue.useAttrs();
      const attrs = useAttrs();
      const slots = vue.useSlots();
      const containerKls = vue.computed(() => [
        props.type === "textarea" ? nsTextarea.b() : nsInput.b(),
        nsInput.m(inputSize.value),
        nsInput.is("disabled", inputDisabled.value),
        nsInput.is("exceed", inputExceed.value),
        {
          [nsInput.b("group")]: slots.prepend || slots.append,
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
      const passwordVisible = vue.ref(false);
      const countStyle = vue.ref();
      const textareaCalcStyle = vue.shallowRef(props.inputStyle);
      const _ref = vue.computed(() => input.value || textarea.value);
      const { wrapperRef, isFocused, handleFocus, handleBlur } = useFocusController(_ref, {
        beforeFocus() {
          return inputDisabled.value;
        },
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
      const showPwdVisible = vue.computed(() => props.showPassword && !inputDisabled.value && !!nativeInputValue.value && (!!nativeInputValue.value || isFocused.value));
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
        if (props.formatter && props.parser) {
          value = props.parser(value);
        }
        if (isComposing.value)
          return;
        if (value === nativeInputValue.value) {
          setNativeInputValue();
          return;
        }
        emit(UPDATE_MODEL_EVENT, value);
        emit(INPUT_EVENT, value);
        await vue.nextTick();
        setNativeInputValue();
        setCursor();
      };
      const handleChange = (event) => {
        let { value } = event.target;
        if (props.formatter && props.parser) {
          value = props.parser(value);
        }
        emit(CHANGE_EVENT, value);
      };
      const {
        isComposing,
        handleCompositionStart,
        handleCompositionUpdate,
        handleCompositionEnd
      } = useComposition({ emit, afterComposition: handleInput });
      const handlePasswordVisible = () => {
        recordCursor();
        passwordVisible.value = !passwordVisible.value;
        setTimeout(setCursor);
      };
      const focus = () => {
        var _a2;
        return (_a2 = _ref.value) == null ? void 0 : _a2.focus();
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
        emit(CHANGE_EVENT, "");
        emit("clear");
        emit(INPUT_EVENT, "");
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
        if (!props.formatter && props.parser) ;
        setNativeInputValue();
        vue.nextTick(resizeTextarea);
      });
      expose({
        input,
        textarea,
        ref: _ref,
        textareaStyle,
        autosize: vue.toRef(props, "autosize"),
        isComposing,
        focus,
        blur,
        select,
        clear,
        resizeTextarea
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass([
            vue.unref(containerKls),
            {
              [vue.unref(nsInput).bm("group", "append")]: _ctx.$slots.append,
              [vue.unref(nsInput).bm("group", "prepend")]: _ctx.$slots.prepend
            }
          ]),
          style: vue.normalizeStyle(vue.unref(containerStyle)),
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave
        }, [
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
                "aria-label": _ctx.ariaLabel,
                placeholder: _ctx.placeholder,
                style: _ctx.inputStyle,
                form: _ctx.form,
                autofocus: _ctx.autofocus,
                role: _ctx.containerRole,
                onCompositionstart: vue.unref(handleCompositionStart),
                onCompositionupdate: vue.unref(handleCompositionUpdate),
                onCompositionend: vue.unref(handleCompositionEnd),
                onInput: handleInput,
                onChange: handleChange,
                onKeydown: handleKeydown
              }), null, 16, ["id", "minlength", "maxlength", "type", "disabled", "readonly", "autocomplete", "tabindex", "aria-label", "placeholder", "form", "autofocus", "role", "onCompositionstart", "onCompositionupdate", "onCompositionend"]),
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
              class: [vue.unref(nsTextarea).e("inner"), vue.unref(nsInput).is("focus", vue.unref(isFocused))]
            }, vue.unref(attrs), {
              minlength: _ctx.minlength,
              maxlength: _ctx.maxlength,
              tabindex: _ctx.tabindex,
              disabled: vue.unref(inputDisabled),
              readonly: _ctx.readonly,
              autocomplete: _ctx.autocomplete,
              style: vue.unref(textareaStyle),
              "aria-label": _ctx.ariaLabel,
              placeholder: _ctx.placeholder,
              form: _ctx.form,
              autofocus: _ctx.autofocus,
              rows: _ctx.rows,
              role: _ctx.containerRole,
              onCompositionstart: vue.unref(handleCompositionStart),
              onCompositionupdate: vue.unref(handleCompositionUpdate),
              onCompositionend: vue.unref(handleCompositionEnd),
              onInput: handleInput,
              onFocus: vue.unref(handleFocus),
              onBlur: vue.unref(handleBlur),
              onChange: handleChange,
              onKeydown: handleKeydown
            }), null, 16, ["id", "minlength", "maxlength", "tabindex", "disabled", "readonly", "autocomplete", "aria-label", "placeholder", "form", "autofocus", "rows", "role", "onCompositionstart", "onCompositionupdate", "onCompositionend", "onFocus", "onBlur"]),
            vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              style: vue.normalizeStyle(countStyle.value),
              class: vue.normalizeClass(vue.unref(nsInput).e("count"))
            }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(_ctx.maxlength), 7)) : vue.createCommentVNode("v-if", true)
          ], 64))
        ], 38);
      };
    }
  });
  var Input = /* @__PURE__ */ _export_sfc$1(_sfc_main$d, [["__file", "input.vue"]]);
  const ElInput = withInstall(Input);
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
  const __default__$9 = vue.defineComponent({
    name: "ElPopper",
    inheritAttrs: false
  });
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    ...__default__$9,
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
  var Popper = /* @__PURE__ */ _export_sfc$1(_sfc_main$c, [["__file", "popper.vue"]]);
  const popperArrowProps = buildProps({
    arrowOffset: {
      type: Number,
      default: 5
    }
  });
  const __default__$8 = vue.defineComponent({
    name: "ElPopperArrow",
    inheritAttrs: false
  });
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    ...__default__$8,
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
  var ElPopperArrow = /* @__PURE__ */ _export_sfc$1(_sfc_main$b, [["__file", "arrow.vue"]]);
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
  const isFocusable = (element) => {
    if (element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute("tabIndex") !== null) {
      return true;
    }
    if (element.tabIndex < 0 || element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true") {
      return false;
    }
    switch (element.nodeName) {
      case "A": {
        return !!element.href && element.rel !== "ignore";
      }
      case "INPUT": {
        return !(element.type === "hidden" || element.type === "file");
      }
      case "BUTTON":
      case "SELECT":
      case "TEXTAREA": {
        return true;
      }
      default: {
        return false;
      }
    }
  };
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
  const __default__$7 = vue.defineComponent({
    name: "ElPopperTrigger",
    inheritAttrs: false
  });
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    ...__default__$7,
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
      const TRIGGER_ELE_EVENTS = [
        "onMouseenter",
        "onMouseleave",
        "onClick",
        "onKeydown",
        "onFocus",
        "onBlur",
        "onContextmenu"
      ];
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
            TRIGGER_ELE_EVENTS.forEach((eventName) => {
              var _a2;
              const handler = props[eventName];
              if (handler) {
                el.addEventListener(eventName.slice(2).toLowerCase(), handler);
                (_a2 = prevEl == null ? void 0 : prevEl.removeEventListener) == null ? void 0 : _a2.call(prevEl, eventName.slice(2).toLowerCase(), handler);
              }
            });
            if (isFocusable(el)) {
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
          }
          if (isElement(prevEl) && isFocusable(prevEl)) {
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
        if (triggerRef.value && isElement(triggerRef.value)) {
          const el = triggerRef.value;
          TRIGGER_ELE_EVENTS.forEach((eventName) => {
            const handler = props[eventName];
            if (handler) {
              el.removeEventListener(eventName.slice(2).toLowerCase(), handler);
            }
          });
          triggerRef.value = void 0;
        }
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
  var ElPopperTrigger = /* @__PURE__ */ _export_sfc$1(_sfc_main$a, [["__file", "trigger.vue"]]);
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
      let cleanup = false;
      if (isElement(element) && !isFocusable(element) && !element.getAttribute("tabindex")) {
        element.setAttribute("tabindex", "-1");
        cleanup = true;
      }
      element.focus({ preventScroll: true });
      lastAutomatedFocusTimestamp.value = window.performance.now();
      if (element !== prevFocusedElement && isSelectable(element) && shouldSelect) {
        element.select();
      }
      if (isElement(element) && cleanup) {
        element.removeAttribute("tabindex");
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
  const EVENT_CODE = {
    tab: "Tab",
    enter: "Enter",
    space: "Space",
    left: "ArrowLeft",
    up: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    esc: "Escape",
    numpadEnter: "NumpadEnter",
    pageUp: "PageUp",
    pageDown: "PageDown",
    home: "Home",
    end: "End"
  };
  let registeredEscapeHandlers = [];
  const cachedHandler = (event) => {
    if (event.code === EVENT_CODE.esc) {
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
  const _sfc_main$9 = vue.defineComponent({
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
        const { code, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e;
        const { loop } = props;
        const isTabbing = code === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;
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
        if (forwardRef.value) {
          forwardRef.value.removeEventListener("keydown", onKeydown);
          forwardRef.value.removeEventListener("focusin", onFocusIn);
          forwardRef.value.removeEventListener("focusout", onFocusOut);
          forwardRef.value = void 0;
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
  var ElFocusTrap = /* @__PURE__ */ _export_sfc$1(_sfc_main$9, [["render", _sfc_render], ["__file", "focus-trap.vue"]]);
  var E = "top", R = "bottom", W = "right", P = "left", me = "auto", G = [E, R, W, P], U = "start", J = "end", Xe = "clippingParents", je = "viewport", K = "popper", Ye = "reference", De = G.reduce(function(t, e) {
    return t.concat([e + "-" + U, e + "-" + J]);
  }, []), Ee = [].concat(G, [me]).reduce(function(t, e) {
    return t.concat([e, e + "-" + U, e + "-" + J]);
  }, []), Ge = "beforeRead", Je = "read", Ke = "afterRead", Qe = "beforeMain", Ze = "main", et = "afterMain", tt = "beforeWrite", nt = "write", rt = "afterWrite", ot = [Ge, Je, Ke, Qe, Ze, et, tt, nt, rt];
  function C(t) {
    return t ? (t.nodeName || "").toLowerCase() : null;
  }
  function H(t) {
    if (t == null) return window;
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
    if (typeof ShadowRoot == "undefined") return false;
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
    if (t.contains(e)) return true;
    if (n && Pe(n)) {
      var r = e;
      do {
        if (r && t.isSameNode(r)) return true;
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
      if (r.position === "fixed") return null;
    }
    var o = ge(t);
    for (Pe(o) && (o = o.host); B(o) && ["html", "body"].indexOf(C(o)) < 0; ) {
      var i = N(o);
      if (i.transform !== "none" || i.perspective !== "none" || i.contain === "paint" || ["transform", "perspective"].indexOf(i.willChange) !== -1 || e && i.willChange === "filter" || e && i.filter && i.filter !== "none") return o;
      o = o.parentNode;
    }
    return null;
  }
  function se(t) {
    for (var e = H(t), n = at(t); n && Wt(n) && N(n).position === "static"; ) n = at(n);
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
    var n = e, r = n.placement, o = r === void 0 ? t.placement : r, i = n.boundary, a = i === void 0 ? Xe : i, s = n.rootBoundary, f = s === void 0 ? je : s, c = n.elementContext, u = c === void 0 ? K : c, m = n.altBoundary, v = m === void 0 ? false : m, l = n.padding, h2 = l === void 0 ? 0 : l, p = ft(typeof h2 != "number" ? h2 : ct(h2, G)), g = u === K ? Ye : K, x = t.rects.popper, y = t.elements[v ? g : u], $ = Gt(Q(y) ? y : y.contextElement || I(t.elements.popper), a, f), d = ee(t.elements.reference), b = mt({ reference: d, element: x, placement: o }), w = Te(Object.assign({}, x, b)), O = u === K ? w : d, j = { top: $.top - O.top + p.top, bottom: O.bottom - $.bottom + p.bottom, left: $.left - O.left + p.left, right: O.right - $.right + p.right }, A = t.modifiersData.offset;
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
    if (q(t) === me) return [];
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
      if (j) for (var ue = h2 ? 3 : 1, xe = function(z) {
        var V = d.find(function(de) {
          var ae = O.get(de);
          if (ae) return ae.slice(0, z).every(function(Y) {
            return Y;
          });
        });
        if (V) return A = V, "break";
      }, ie = ue; ie > 0; ie--) {
        var le = xe(ie);
        if (le === "break") break;
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
    e.modifiersData[n] = mt({ reference: e.rects.reference, element: e.rects.popper, placement: e.placement });
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
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
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
      if (!$t(a, s)) return v;
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
      type: definePropType(String),
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
    virtualTriggering: Boolean,
    zIndex: Number,
    ...useAriaProps(["ariaLabel"])
  });
  const popperContentEmits = {
    mouseenter: (evt) => evt instanceof MouseEvent,
    mouseleave: (evt) => evt instanceof MouseEvent,
    focus: () => true,
    blur: () => true,
    close: () => true
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
    vue.watch(instanceRef, (instance) => popperInstanceRef.value = instance, {
      flush: "sync"
    });
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
  const __default__$6 = vue.defineComponent({
    name: "ElPopperContent"
  });
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$6,
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
      if (formItemContext) {
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
          onMouseenter: (e) => _ctx.$emit("mouseenter", e),
          onMouseleave: (e) => _ctx.$emit("mouseleave", e)
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
        ], 16, ["onMouseenter", "onMouseleave"]);
      };
    }
  });
  var ElPopperContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$8, [["__file", "content.vue"]]);
  const ElPopper = withInstall(Popper);
  const TOOLTIP_INJECTION_KEY = Symbol("elTooltip");
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
  const teleportProps = buildProps({
    to: {
      type: definePropType([String, Object]),
      required: true
    },
    disabled: Boolean
  });
  const useTooltipContentProps = buildProps({
    ...useDelayedToggleProps,
    ...popperContentProps,
    appendTo: {
      type: teleportProps.to.type
    },
    content: {
      type: String,
      default: ""
    },
    rawContent: Boolean,
    persistent: Boolean,
    visible: {
      type: definePropType(Boolean),
      default: null
    },
    transition: String,
    teleported: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    ...useAriaProps(["ariaLabel"])
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
      default: () => [EVENT_CODE.enter, EVENT_CODE.numpadEnter, EVENT_CODE.space]
    }
  });
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
    if (isArray$1(trigger)) {
      return trigger.includes(type);
    }
    return trigger === type;
  };
  const whenTrigger = (trigger, type, handler) => {
    return (e) => {
      isTriggerType(vue.unref(trigger), type) && handler(e);
    };
  };
  const composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
    const handleEvent = (event) => {
      const shouldPrevent = theirsHandler == null ? void 0 : theirsHandler(event);
      if (checkForDefaultPrevented === false || !shouldPrevent) {
        return oursHandler == null ? void 0 : oursHandler(event);
      }
    };
    return handleEvent;
  };
  const __default__$5 = vue.defineComponent({
    name: "ElTooltipTrigger"
  });
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$5,
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
  var ElTooltipTrigger = /* @__PURE__ */ _export_sfc$1(_sfc_main$7, [["__file", "trigger.vue"]]);
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "teleport",
    props: teleportProps,
    setup(__props) {
      return (_ctx, _cache) => {
        return _ctx.disabled ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : (vue.openBlock(), vue.createBlock(vue.Teleport, {
          key: 1,
          to: _ctx.to
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 8, ["to"]));
      };
    }
  });
  var Teleport = /* @__PURE__ */ _export_sfc$1(_sfc_main$6, [["__file", "teleport.vue"]]);
  const ElTeleport = withInstall(Teleport);
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
      if (!document.body.querySelector(selector.value)) {
        createContainer(id.value);
      }
    });
    return {
      id,
      selector
    };
  };
  const __default__$4 = vue.defineComponent({
    name: "ElTooltipContent",
    inheritAttrs: false
  });
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
    props: useTooltipContentProps,
    setup(__props, { expose }) {
      const props = __props;
      const { selector } = usePopperContainerId();
      const ns = useNamespace("tooltip");
      const contentRef = vue.ref();
      const popperContentRef = computedEager(() => {
        var _a2;
        return (_a2 = contentRef.value) == null ? void 0 : _a2.popperContentRef;
      });
      let stopHandle;
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
        stopHandle == null ? void 0 : stopHandle();
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
      const ariaHidden = vue.ref(true);
      const onTransitionLeave = () => {
        onHide();
        isFocusInsideContent() && tryFocus(document.body);
        ariaHidden.value = true;
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
        stopHandle = onClickOutside(popperContentRef, () => {
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
      const isFocusInsideContent = (event) => {
        var _a2;
        const popperContent = (_a2 = contentRef.value) == null ? void 0 : _a2.popperContentRef;
        const activeElement = (event == null ? void 0 : event.relatedTarget) || document.activeElement;
        return popperContent == null ? void 0 : popperContent.contains(activeElement);
      };
      vue.watch(() => vue.unref(open), (val) => {
        if (!val) {
          stopHandle == null ? void 0 : stopHandle();
        } else {
          ariaHidden.value = false;
        }
      }, {
        flush: "post"
      });
      vue.watch(() => props.content, () => {
        var _a2, _b;
        (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
      });
      expose({
        contentRef,
        isFocusInsideContent
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElTeleport), {
          disabled: !_ctx.teleported,
          to: vue.unref(appendTo)
        }, {
          default: vue.withCtx(() => [
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
                  "aria-hidden": ariaHidden.value,
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
                    vue.renderSlot(_ctx.$slots, "default")
                  ]),
                  _: 3
                }, 16, ["id", "aria-label", "aria-hidden", "boundaries-padding", "fallback-placements", "gpu-acceleration", "offset", "placement", "popper-options", "strategy", "effect", "enterable", "pure", "popper-class", "popper-style", "reference-el", "trigger-target-el", "visible", "z-index", "onMouseenter", "onMouseleave", "onClose"])), [
                  [vue.vShow, vue.unref(shouldShow)]
                ]) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["name"])
          ]),
          _: 3
        }, 8, ["disabled", "to"]);
      };
    }
  });
  var ElTooltipContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$5, [["__file", "content.vue"]]);
  const __default__$3 = vue.defineComponent({
    name: "ElTooltip"
  });
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: useTooltipProps,
    emits: tooltipEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      usePopperContainer();
      const ns = useNamespace("tooltip");
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
      const kls = vue.computed(() => {
        return [ns.b(), props.popperClass];
      });
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
        var _a2;
        return (_a2 = contentRef.value) == null ? void 0 : _a2.isFocusInsideContent(event);
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
              "popper-class": vue.unref(kls),
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
                  }, null, 8, ["innerHTML"])) : (vue.openBlock(), vue.createElementBlock("span", { key: 1 }, vue.toDisplayString(_ctx.content), 1))
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
  var Tooltip = /* @__PURE__ */ _export_sfc$1(_sfc_main$4, [["__file", "tooltip.vue"]]);
  const ElTooltip = withInstall(Tooltip);
  const REPEAT_INTERVAL = 100;
  const REPEAT_DELAY = 600;
  const vRepeatClick = {
    beforeMount(el, binding) {
      const value = binding.value;
      const { interval = REPEAT_INTERVAL, delay = REPEAT_DELAY } = isFunction$1(value) ? {} : value;
      let intervalId;
      let delayId;
      const handler = () => isFunction$1(value) ? value() : value.handler();
      const clear = () => {
        if (delayId) {
          clearTimeout(delayId);
          delayId = void 0;
        }
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = void 0;
        }
      };
      el.addEventListener("mousedown", (evt) => {
        if (evt.button !== 0)
          return;
        clear();
        handler();
        document.addEventListener("mouseup", () => clear(), {
          once: true
        });
        delayId = setTimeout(() => {
          intervalId = setInterval(() => {
            handler();
          }, interval);
        }, delay);
      });
    }
  };
  const inputNumberProps = buildProps({
    id: {
      type: String,
      default: void 0
    },
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: Boolean,
    max: {
      type: Number,
      default: Number.POSITIVE_INFINITY
    },
    min: {
      type: Number,
      default: Number.NEGATIVE_INFINITY
    },
    modelValue: Number,
    readonly: Boolean,
    disabled: Boolean,
    size: useSizeProp,
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: "",
      values: ["", "right"]
    },
    valueOnClear: {
      type: [String, Number, null],
      validator: (val) => val === null || isNumber(val) || ["min", "max"].includes(val),
      default: null
    },
    name: String,
    placeholder: String,
    precision: {
      type: Number,
      validator: (val) => val >= 0 && val === Number.parseInt(`${val}`, 10)
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    ...useAriaProps(["ariaLabel"])
  });
  const inputNumberEmits = {
    [CHANGE_EVENT]: (cur, prev) => prev !== cur,
    blur: (e) => e instanceof FocusEvent,
    focus: (e) => e instanceof FocusEvent,
    [INPUT_EVENT]: (val) => isNumber(val) || isNil(val),
    [UPDATE_MODEL_EVENT]: (val) => isNumber(val) || isNil(val)
  };
  const __default__$2 = vue.defineComponent({
    name: "ElInputNumber"
  });
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: inputNumberProps,
    emits: inputNumberEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const { t } = useLocale();
      const ns = useNamespace("input-number");
      const input = vue.ref();
      const data = vue.reactive({
        currentValue: props.modelValue,
        userInput: null
      });
      const { formItem } = useFormItem();
      const minDisabled = vue.computed(() => isNumber(props.modelValue) && props.modelValue <= props.min);
      const maxDisabled = vue.computed(() => isNumber(props.modelValue) && props.modelValue >= props.max);
      const numPrecision = vue.computed(() => {
        const stepPrecision = getPrecision(props.step);
        if (!isUndefined(props.precision)) {
          if (stepPrecision > props.precision) ;
          return props.precision;
        } else {
          return Math.max(getPrecision(props.modelValue), stepPrecision);
        }
      });
      const controlsAtRight = vue.computed(() => {
        return props.controls && props.controlsPosition === "right";
      });
      const inputNumberSize = useFormSize();
      const inputNumberDisabled = useFormDisabled();
      const displayValue = vue.computed(() => {
        if (data.userInput !== null) {
          return data.userInput;
        }
        let currentValue = data.currentValue;
        if (isNil(currentValue))
          return "";
        if (isNumber(currentValue)) {
          if (Number.isNaN(currentValue))
            return "";
          if (!isUndefined(props.precision)) {
            currentValue = currentValue.toFixed(props.precision);
          }
        }
        return currentValue;
      });
      const toPrecision = (num, pre) => {
        if (isUndefined(pre))
          pre = numPrecision.value;
        if (pre === 0)
          return Math.round(num);
        let snum = String(num);
        const pointPos = snum.indexOf(".");
        if (pointPos === -1)
          return num;
        const nums = snum.replace(".", "").split("");
        const datum = nums[pointPos + pre];
        if (!datum)
          return num;
        const length = snum.length;
        if (snum.charAt(length - 1) === "5") {
          snum = `${snum.slice(0, Math.max(0, length - 1))}6`;
        }
        return Number.parseFloat(Number(snum).toFixed(pre));
      };
      const getPrecision = (value) => {
        if (isNil(value))
          return 0;
        const valueString = value.toString();
        const dotPosition = valueString.indexOf(".");
        let precision = 0;
        if (dotPosition !== -1) {
          precision = valueString.length - dotPosition - 1;
        }
        return precision;
      };
      const ensurePrecision = (val, coefficient = 1) => {
        if (!isNumber(val))
          return data.currentValue;
        return toPrecision(val + props.step * coefficient);
      };
      const increase = () => {
        if (props.readonly || inputNumberDisabled.value || maxDisabled.value)
          return;
        const value = Number(displayValue.value) || 0;
        const newVal = ensurePrecision(value);
        setCurrentValue(newVal);
        emit(INPUT_EVENT, data.currentValue);
        setCurrentValueToModelValue();
      };
      const decrease = () => {
        if (props.readonly || inputNumberDisabled.value || minDisabled.value)
          return;
        const value = Number(displayValue.value) || 0;
        const newVal = ensurePrecision(value, -1);
        setCurrentValue(newVal);
        emit(INPUT_EVENT, data.currentValue);
        setCurrentValueToModelValue();
      };
      const verifyValue = (value, update) => {
        const { max, min, step, precision, stepStrictly, valueOnClear } = props;
        if (max < min) {
          throwError("InputNumber", "min should not be greater than max.");
        }
        let newVal = Number(value);
        if (isNil(value) || Number.isNaN(newVal)) {
          return null;
        }
        if (value === "") {
          if (valueOnClear === null) {
            return null;
          }
          newVal = isString$1(valueOnClear) ? { min, max }[valueOnClear] : valueOnClear;
        }
        if (stepStrictly) {
          newVal = toPrecision(Math.round(newVal / step) * step, precision);
          if (newVal !== value) {
            update && emit(UPDATE_MODEL_EVENT, newVal);
          }
        }
        if (!isUndefined(precision)) {
          newVal = toPrecision(newVal, precision);
        }
        if (newVal > max || newVal < min) {
          newVal = newVal > max ? max : min;
          update && emit(UPDATE_MODEL_EVENT, newVal);
        }
        return newVal;
      };
      const setCurrentValue = (value, emitChange = true) => {
        var _a2;
        const oldVal = data.currentValue;
        const newVal = verifyValue(value);
        if (!emitChange) {
          emit(UPDATE_MODEL_EVENT, newVal);
          return;
        }
        if (oldVal === newVal && value)
          return;
        data.userInput = null;
        emit(UPDATE_MODEL_EVENT, newVal);
        if (oldVal !== newVal) {
          emit(CHANGE_EVENT, newVal, oldVal);
        }
        if (props.validateEvent) {
          (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => debugWarn());
        }
        data.currentValue = newVal;
      };
      const handleInput = (value) => {
        data.userInput = value;
        const newVal = value === "" ? null : Number(value);
        emit(INPUT_EVENT, newVal);
        setCurrentValue(newVal, false);
      };
      const handleInputChange = (value) => {
        const newVal = value !== "" ? Number(value) : "";
        if (isNumber(newVal) && !Number.isNaN(newVal) || value === "") {
          setCurrentValue(newVal);
        }
        setCurrentValueToModelValue();
        data.userInput = null;
      };
      const focus = () => {
        var _a2, _b;
        (_b = (_a2 = input.value) == null ? void 0 : _a2.focus) == null ? void 0 : _b.call(_a2);
      };
      const blur = () => {
        var _a2, _b;
        (_b = (_a2 = input.value) == null ? void 0 : _a2.blur) == null ? void 0 : _b.call(_a2);
      };
      const handleFocus = (event) => {
        emit("focus", event);
      };
      const handleBlur = (event) => {
        var _a2, _b;
        data.userInput = null;
        if (isFirefox() && data.currentValue === null && ((_a2 = input.value) == null ? void 0 : _a2.input)) {
          input.value.input.value = "";
        }
        emit("blur", event);
        if (props.validateEvent) {
          (_b = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _b.call(formItem, "blur").catch((err) => debugWarn());
        }
      };
      const setCurrentValueToModelValue = () => {
        if (data.currentValue !== props.modelValue) {
          data.currentValue = props.modelValue;
        }
      };
      const handleWheel = (e) => {
        if (document.activeElement === e.target)
          e.preventDefault();
      };
      vue.watch(() => props.modelValue, (value, oldValue) => {
        const newValue = verifyValue(value, true);
        if (data.userInput === null && newValue !== oldValue) {
          data.currentValue = newValue;
        }
      }, { immediate: true });
      vue.onMounted(() => {
        var _a2;
        const { min, max, modelValue } = props;
        const innerInput = (_a2 = input.value) == null ? void 0 : _a2.input;
        innerInput.setAttribute("role", "spinbutton");
        if (Number.isFinite(max)) {
          innerInput.setAttribute("aria-valuemax", String(max));
        } else {
          innerInput.removeAttribute("aria-valuemax");
        }
        if (Number.isFinite(min)) {
          innerInput.setAttribute("aria-valuemin", String(min));
        } else {
          innerInput.removeAttribute("aria-valuemin");
        }
        innerInput.setAttribute("aria-valuenow", data.currentValue || data.currentValue === 0 ? String(data.currentValue) : "");
        innerInput.setAttribute("aria-disabled", String(inputNumberDisabled.value));
        if (!isNumber(modelValue) && modelValue != null) {
          let val = Number(modelValue);
          if (Number.isNaN(val)) {
            val = null;
          }
          emit(UPDATE_MODEL_EVENT, val);
        }
        innerInput.addEventListener("wheel", handleWheel, { passive: false });
      });
      vue.onUpdated(() => {
        var _a2, _b;
        const innerInput = (_a2 = input.value) == null ? void 0 : _a2.input;
        innerInput == null ? void 0 : innerInput.setAttribute("aria-valuenow", `${(_b = data.currentValue) != null ? _b : ""}`);
      });
      expose({
        focus,
        blur
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass([
            vue.unref(ns).b(),
            vue.unref(ns).m(vue.unref(inputNumberSize)),
            vue.unref(ns).is("disabled", vue.unref(inputNumberDisabled)),
            vue.unref(ns).is("without-controls", !_ctx.controls),
            vue.unref(ns).is("controls-right", vue.unref(controlsAtRight))
          ]),
          onDragstart: vue.withModifiers(() => {
          }, ["prevent"])
        }, [
          _ctx.controls ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            role: "button",
            "aria-label": vue.unref(t)("el.inputNumber.decrease"),
            class: vue.normalizeClass([vue.unref(ns).e("decrease"), vue.unref(ns).is("disabled", vue.unref(minDisabled))]),
            onKeydown: vue.withKeys(decrease, ["enter"])
          }, [
            vue.renderSlot(_ctx.$slots, "decrease-icon", {}, () => [
              vue.createVNode(vue.unref(ElIcon), null, {
                default: vue.withCtx(() => [
                  vue.unref(controlsAtRight) ? (vue.openBlock(), vue.createBlock(vue.unref(arrow_down_default), { key: 0 })) : (vue.openBlock(), vue.createBlock(vue.unref(minus_default), { key: 1 }))
                ]),
                _: 1
              })
            ])
          ], 42, ["aria-label", "onKeydown"])), [
            [vue.unref(vRepeatClick), decrease]
          ]) : vue.createCommentVNode("v-if", true),
          _ctx.controls ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            role: "button",
            "aria-label": vue.unref(t)("el.inputNumber.increase"),
            class: vue.normalizeClass([vue.unref(ns).e("increase"), vue.unref(ns).is("disabled", vue.unref(maxDisabled))]),
            onKeydown: vue.withKeys(increase, ["enter"])
          }, [
            vue.renderSlot(_ctx.$slots, "increase-icon", {}, () => [
              vue.createVNode(vue.unref(ElIcon), null, {
                default: vue.withCtx(() => [
                  vue.unref(controlsAtRight) ? (vue.openBlock(), vue.createBlock(vue.unref(arrow_up_default), { key: 0 })) : (vue.openBlock(), vue.createBlock(vue.unref(plus_default), { key: 1 }))
                ]),
                _: 1
              })
            ])
          ], 42, ["aria-label", "onKeydown"])), [
            [vue.unref(vRepeatClick), increase]
          ]) : vue.createCommentVNode("v-if", true),
          vue.createVNode(vue.unref(ElInput), {
            id: _ctx.id,
            ref_key: "input",
            ref: input,
            type: "number",
            step: _ctx.step,
            "model-value": vue.unref(displayValue),
            placeholder: _ctx.placeholder,
            readonly: _ctx.readonly,
            disabled: vue.unref(inputNumberDisabled),
            size: vue.unref(inputNumberSize),
            max: _ctx.max,
            min: _ctx.min,
            name: _ctx.name,
            "aria-label": _ctx.ariaLabel,
            "validate-event": false,
            onKeydown: [
              vue.withKeys(vue.withModifiers(increase, ["prevent"]), ["up"]),
              vue.withKeys(vue.withModifiers(decrease, ["prevent"]), ["down"])
            ],
            onBlur: handleBlur,
            onFocus: handleFocus,
            onInput: handleInput,
            onChange: handleInputChange
          }, vue.createSlots({
            _: 2
          }, [
            _ctx.$slots.prefix ? {
              name: "prefix",
              fn: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "prefix")
              ])
            } : void 0,
            _ctx.$slots.suffix ? {
              name: "suffix",
              fn: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "suffix")
              ])
            } : void 0
          ]), 1032, ["id", "step", "model-value", "placeholder", "readonly", "disabled", "size", "max", "min", "name", "aria-label", "onKeydown"])
        ], 42, ["onDragstart"]);
      };
    }
  });
  var InputNumber = /* @__PURE__ */ _export_sfc$1(_sfc_main$3, [["__file", "input-number.vue"]]);
  const ElInputNumber = withInstall(InputNumber);
  const sliderContextKey = Symbol("sliderContextKey");
  const sliderProps = buildProps({
    modelValue: {
      type: definePropType([Number, Array]),
      default: 0
    },
    id: {
      type: String,
      default: void 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    showInput: Boolean,
    showInputControls: {
      type: Boolean,
      default: true
    },
    size: useSizeProp,
    inputSize: useSizeProp,
    showStops: Boolean,
    showTooltip: {
      type: Boolean,
      default: true
    },
    formatTooltip: {
      type: definePropType(Function),
      default: void 0
    },
    disabled: Boolean,
    range: Boolean,
    vertical: Boolean,
    height: String,
    debounce: {
      type: Number,
      default: 300
    },
    rangeStartLabel: {
      type: String,
      default: void 0
    },
    rangeEndLabel: {
      type: String,
      default: void 0
    },
    formatValueText: {
      type: definePropType(Function),
      default: void 0
    },
    tooltipClass: {
      type: String,
      default: void 0
    },
    placement: {
      type: String,
      values: Ee,
      default: "top"
    },
    marks: {
      type: definePropType(Object)
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    persistent: {
      type: Boolean,
      default: true
    },
    ...useAriaProps(["ariaLabel"])
  });
  const isValidValue = (value) => isNumber(value) || isArray$1(value) && value.every(isNumber);
  const sliderEmits = {
    [UPDATE_MODEL_EVENT]: isValidValue,
    [INPUT_EVENT]: isValidValue,
    [CHANGE_EVENT]: isValidValue
  };
  const sliderButtonProps = buildProps({
    modelValue: {
      type: Number,
      default: 0
    },
    vertical: Boolean,
    tooltipClass: String,
    placement: {
      type: String,
      values: Ee,
      default: "top"
    }
  });
  const sliderButtonEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isNumber(value)
  };
  const useTooltip = (props, formatTooltip, showTooltip) => {
    const tooltip = vue.ref();
    const tooltipVisible = vue.ref(false);
    const enableFormat = vue.computed(() => {
      return formatTooltip.value instanceof Function;
    });
    const formatValue = vue.computed(() => {
      return enableFormat.value && formatTooltip.value(props.modelValue) || props.modelValue;
    });
    const displayTooltip = debounce(() => {
      showTooltip.value && (tooltipVisible.value = true);
    }, 50);
    const hideTooltip = debounce(() => {
      showTooltip.value && (tooltipVisible.value = false);
    }, 50);
    return {
      tooltip,
      tooltipVisible,
      formatValue,
      displayTooltip,
      hideTooltip
    };
  };
  const useSliderButton = (props, initData, emit) => {
    const {
      disabled,
      min,
      max,
      step,
      showTooltip,
      persistent,
      precision,
      sliderSize,
      formatTooltip,
      emitChange,
      resetSize,
      updateDragging
    } = vue.inject(sliderContextKey);
    const { tooltip, tooltipVisible, formatValue, displayTooltip, hideTooltip } = useTooltip(props, formatTooltip, showTooltip);
    const button = vue.ref();
    const currentPosition = vue.computed(() => {
      return `${(props.modelValue - min.value) / (max.value - min.value) * 100}%`;
    });
    const wrapperStyle = vue.computed(() => {
      return props.vertical ? { bottom: currentPosition.value } : { left: currentPosition.value };
    });
    const handleMouseEnter = () => {
      initData.hovering = true;
      displayTooltip();
    };
    const handleMouseLeave = () => {
      initData.hovering = false;
      if (!initData.dragging) {
        hideTooltip();
      }
    };
    const onButtonDown = (event) => {
      if (disabled.value)
        return;
      event.preventDefault();
      onDragStart(event);
      window.addEventListener("mousemove", onDragging);
      window.addEventListener("touchmove", onDragging);
      window.addEventListener("mouseup", onDragEnd);
      window.addEventListener("touchend", onDragEnd);
      window.addEventListener("contextmenu", onDragEnd);
      button.value.focus();
    };
    const incrementPosition = (amount) => {
      if (disabled.value)
        return;
      initData.newPosition = Number.parseFloat(currentPosition.value) + amount / (max.value - min.value) * 100;
      setPosition(initData.newPosition);
      emitChange();
    };
    const onLeftKeyDown = () => {
      incrementPosition(-step.value);
    };
    const onRightKeyDown = () => {
      incrementPosition(step.value);
    };
    const onPageDownKeyDown = () => {
      incrementPosition(-step.value * 4);
    };
    const onPageUpKeyDown = () => {
      incrementPosition(step.value * 4);
    };
    const onHomeKeyDown = () => {
      if (disabled.value)
        return;
      setPosition(0);
      emitChange();
    };
    const onEndKeyDown = () => {
      if (disabled.value)
        return;
      setPosition(100);
      emitChange();
    };
    const onKeyDown = (event) => {
      let isPreventDefault = true;
      switch (event.code) {
        case EVENT_CODE.left:
        case EVENT_CODE.down:
          onLeftKeyDown();
          break;
        case EVENT_CODE.right:
        case EVENT_CODE.up:
          onRightKeyDown();
          break;
        case EVENT_CODE.home:
          onHomeKeyDown();
          break;
        case EVENT_CODE.end:
          onEndKeyDown();
          break;
        case EVENT_CODE.pageDown:
          onPageDownKeyDown();
          break;
        case EVENT_CODE.pageUp:
          onPageUpKeyDown();
          break;
        default:
          isPreventDefault = false;
          break;
      }
      isPreventDefault && event.preventDefault();
    };
    const getClientXY = (event) => {
      let clientX;
      let clientY;
      if (event.type.startsWith("touch")) {
        clientY = event.touches[0].clientY;
        clientX = event.touches[0].clientX;
      } else {
        clientY = event.clientY;
        clientX = event.clientX;
      }
      return {
        clientX,
        clientY
      };
    };
    const onDragStart = (event) => {
      initData.dragging = true;
      initData.isClick = true;
      const { clientX, clientY } = getClientXY(event);
      if (props.vertical) {
        initData.startY = clientY;
      } else {
        initData.startX = clientX;
      }
      initData.startPosition = Number.parseFloat(currentPosition.value);
      initData.newPosition = initData.startPosition;
    };
    const onDragging = (event) => {
      if (initData.dragging) {
        initData.isClick = false;
        displayTooltip();
        resetSize();
        let diff;
        const { clientX, clientY } = getClientXY(event);
        if (props.vertical) {
          initData.currentY = clientY;
          diff = (initData.startY - initData.currentY) / sliderSize.value * 100;
        } else {
          initData.currentX = clientX;
          diff = (initData.currentX - initData.startX) / sliderSize.value * 100;
        }
        initData.newPosition = initData.startPosition + diff;
        setPosition(initData.newPosition);
      }
    };
    const onDragEnd = () => {
      if (initData.dragging) {
        setTimeout(() => {
          initData.dragging = false;
          if (!initData.hovering) {
            hideTooltip();
          }
          if (!initData.isClick) {
            setPosition(initData.newPosition);
          }
          emitChange();
        }, 0);
        window.removeEventListener("mousemove", onDragging);
        window.removeEventListener("touchmove", onDragging);
        window.removeEventListener("mouseup", onDragEnd);
        window.removeEventListener("touchend", onDragEnd);
        window.removeEventListener("contextmenu", onDragEnd);
      }
    };
    const setPosition = async (newPosition) => {
      if (newPosition === null || Number.isNaN(+newPosition))
        return;
      if (newPosition < 0) {
        newPosition = 0;
      } else if (newPosition > 100) {
        newPosition = 100;
      }
      const lengthPerStep = 100 / ((max.value - min.value) / step.value);
      const steps = Math.round(newPosition / lengthPerStep);
      let value = steps * lengthPerStep * (max.value - min.value) * 0.01 + min.value;
      value = Number.parseFloat(value.toFixed(precision.value));
      if (value !== props.modelValue) {
        emit(UPDATE_MODEL_EVENT, value);
      }
      if (!initData.dragging && props.modelValue !== initData.oldValue) {
        initData.oldValue = props.modelValue;
      }
      await vue.nextTick();
      initData.dragging && displayTooltip();
      tooltip.value.updatePopper();
    };
    vue.watch(() => initData.dragging, (val) => {
      updateDragging(val);
    });
    useEventListener(button, "touchstart", onButtonDown, { passive: false });
    return {
      disabled,
      button,
      tooltip,
      tooltipVisible,
      showTooltip,
      persistent,
      wrapperStyle,
      formatValue,
      handleMouseEnter,
      handleMouseLeave,
      onButtonDown,
      onKeyDown,
      setPosition
    };
  };
  const __default__$1 = vue.defineComponent({
    name: "ElSliderButton"
  });
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    props: sliderButtonProps,
    emits: sliderButtonEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const ns = useNamespace("slider");
      const initData = vue.reactive({
        hovering: false,
        dragging: false,
        isClick: false,
        startX: 0,
        currentX: 0,
        startY: 0,
        currentY: 0,
        startPosition: 0,
        newPosition: 0,
        oldValue: props.modelValue
      });
      const tooltipPersistent = vue.computed(() => !showTooltip.value ? false : persistent.value);
      const {
        disabled,
        button,
        tooltip,
        showTooltip,
        persistent,
        tooltipVisible,
        wrapperStyle,
        formatValue,
        handleMouseEnter,
        handleMouseLeave,
        onButtonDown,
        onKeyDown,
        setPosition
      } = useSliderButton(props, initData, emit);
      const { hovering, dragging } = vue.toRefs(initData);
      expose({
        onButtonDown,
        onKeyDown,
        setPosition,
        hovering,
        dragging
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "button",
          ref: button,
          class: vue.normalizeClass([vue.unref(ns).e("button-wrapper"), { hover: vue.unref(hovering), dragging: vue.unref(dragging) }]),
          style: vue.normalizeStyle(vue.unref(wrapperStyle)),
          tabindex: vue.unref(disabled) ? -1 : 0,
          onMouseenter: vue.unref(handleMouseEnter),
          onMouseleave: vue.unref(handleMouseLeave),
          onMousedown: vue.unref(onButtonDown),
          onFocus: vue.unref(handleMouseEnter),
          onBlur: vue.unref(handleMouseLeave),
          onKeydown: vue.unref(onKeyDown)
        }, [
          vue.createVNode(vue.unref(ElTooltip), {
            ref_key: "tooltip",
            ref: tooltip,
            visible: vue.unref(tooltipVisible),
            placement: _ctx.placement,
            "fallback-placements": ["top", "bottom", "right", "left"],
            "stop-popper-mouse-event": false,
            "popper-class": _ctx.tooltipClass,
            disabled: !vue.unref(showTooltip),
            persistent: vue.unref(tooltipPersistent)
          }, {
            content: vue.withCtx(() => [
              vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(formatValue)), 1)
            ]),
            default: vue.withCtx(() => [
              vue.createElementVNode("div", {
                class: vue.normalizeClass([vue.unref(ns).e("button"), { hover: vue.unref(hovering), dragging: vue.unref(dragging) }])
              }, null, 2)
            ]),
            _: 1
          }, 8, ["visible", "placement", "popper-class", "disabled", "persistent"])
        ], 46, ["tabindex", "onMouseenter", "onMouseleave", "onMousedown", "onFocus", "onBlur", "onKeydown"]);
      };
    }
  });
  var SliderButton = /* @__PURE__ */ _export_sfc$1(_sfc_main$2, [["__file", "button.vue"]]);
  const sliderMarkerProps = buildProps({
    mark: {
      type: definePropType([String, Object]),
      default: void 0
    }
  });
  var SliderMarker = vue.defineComponent({
    name: "ElSliderMarker",
    props: sliderMarkerProps,
    setup(props) {
      const ns = useNamespace("slider");
      const label = vue.computed(() => {
        return isString$1(props.mark) ? props.mark : props.mark.label;
      });
      const style = vue.computed(() => isString$1(props.mark) ? void 0 : props.mark.style);
      return () => vue.h("div", {
        class: ns.e("marks-text"),
        style: style.value
      }, label.value);
    }
  });
  const useSlide = (props, initData, emit) => {
    const { form: elForm, formItem: elFormItem } = useFormItem();
    const slider = vue.shallowRef();
    const firstButton = vue.ref();
    const secondButton = vue.ref();
    const buttonRefs = {
      firstButton,
      secondButton
    };
    const sliderDisabled = vue.computed(() => {
      return props.disabled || (elForm == null ? void 0 : elForm.disabled) || false;
    });
    const minValue = vue.computed(() => {
      return Math.min(initData.firstValue, initData.secondValue);
    });
    const maxValue = vue.computed(() => {
      return Math.max(initData.firstValue, initData.secondValue);
    });
    const barSize = vue.computed(() => {
      return props.range ? `${100 * (maxValue.value - minValue.value) / (props.max - props.min)}%` : `${100 * (initData.firstValue - props.min) / (props.max - props.min)}%`;
    });
    const barStart = vue.computed(() => {
      return props.range ? `${100 * (minValue.value - props.min) / (props.max - props.min)}%` : "0%";
    });
    const runwayStyle = vue.computed(() => {
      return props.vertical ? { height: props.height } : {};
    });
    const barStyle = vue.computed(() => {
      return props.vertical ? {
        height: barSize.value,
        bottom: barStart.value
      } : {
        width: barSize.value,
        left: barStart.value
      };
    });
    const resetSize = () => {
      if (slider.value) {
        initData.sliderSize = slider.value[`client${props.vertical ? "Height" : "Width"}`];
      }
    };
    const getButtonRefByPercent = (percent) => {
      const targetValue = props.min + percent * (props.max - props.min) / 100;
      if (!props.range) {
        return firstButton;
      }
      let buttonRefName;
      if (Math.abs(minValue.value - targetValue) < Math.abs(maxValue.value - targetValue)) {
        buttonRefName = initData.firstValue < initData.secondValue ? "firstButton" : "secondButton";
      } else {
        buttonRefName = initData.firstValue > initData.secondValue ? "firstButton" : "secondButton";
      }
      return buttonRefs[buttonRefName];
    };
    const setPosition = (percent) => {
      const buttonRef = getButtonRefByPercent(percent);
      buttonRef.value.setPosition(percent);
      return buttonRef;
    };
    const setFirstValue = (firstValue) => {
      initData.firstValue = firstValue != null ? firstValue : props.min;
      _emit(props.range ? [minValue.value, maxValue.value] : firstValue != null ? firstValue : props.min);
    };
    const setSecondValue = (secondValue) => {
      initData.secondValue = secondValue;
      if (props.range) {
        _emit([minValue.value, maxValue.value]);
      }
    };
    const _emit = (val) => {
      emit(UPDATE_MODEL_EVENT, val);
      emit(INPUT_EVENT, val);
    };
    const emitChange = async () => {
      await vue.nextTick();
      emit(CHANGE_EVENT, props.range ? [minValue.value, maxValue.value] : props.modelValue);
    };
    const handleSliderPointerEvent = (event) => {
      var _a2, _b, _c, _d, _e, _f;
      if (sliderDisabled.value || initData.dragging)
        return;
      resetSize();
      let newPercent = 0;
      if (props.vertical) {
        const clientY = (_c = (_b = (_a2 = event.touches) == null ? void 0 : _a2.item(0)) == null ? void 0 : _b.clientY) != null ? _c : event.clientY;
        const sliderOffsetBottom = slider.value.getBoundingClientRect().bottom;
        newPercent = (sliderOffsetBottom - clientY) / initData.sliderSize * 100;
      } else {
        const clientX = (_f = (_e = (_d = event.touches) == null ? void 0 : _d.item(0)) == null ? void 0 : _e.clientX) != null ? _f : event.clientX;
        const sliderOffsetLeft = slider.value.getBoundingClientRect().left;
        newPercent = (clientX - sliderOffsetLeft) / initData.sliderSize * 100;
      }
      if (newPercent < 0 || newPercent > 100)
        return;
      return setPosition(newPercent);
    };
    const onSliderWrapperPrevent = (event) => {
      var _a2, _b;
      if (((_a2 = buttonRefs["firstButton"].value) == null ? void 0 : _a2.dragging) || ((_b = buttonRefs["secondButton"].value) == null ? void 0 : _b.dragging)) {
        event.preventDefault();
      }
    };
    const onSliderDown = async (event) => {
      const buttonRef = handleSliderPointerEvent(event);
      if (buttonRef) {
        await vue.nextTick();
        buttonRef.value.onButtonDown(event);
      }
    };
    const onSliderClick = (event) => {
      const buttonRef = handleSliderPointerEvent(event);
      if (buttonRef) {
        emitChange();
      }
    };
    const onSliderMarkerDown = (position) => {
      if (sliderDisabled.value || initData.dragging)
        return;
      const buttonRef = setPosition(position);
      if (buttonRef) {
        emitChange();
      }
    };
    return {
      elFormItem,
      slider,
      firstButton,
      secondButton,
      sliderDisabled,
      minValue,
      maxValue,
      runwayStyle,
      barStyle,
      resetSize,
      setPosition,
      emitChange,
      onSliderWrapperPrevent,
      onSliderClick,
      onSliderDown,
      onSliderMarkerDown,
      setFirstValue,
      setSecondValue
    };
  };
  const useStops = (props, initData, minValue, maxValue) => {
    const stops = vue.computed(() => {
      if (!props.showStops || props.min > props.max)
        return [];
      if (props.step === 0) {
        return [];
      }
      const stopCount = (props.max - props.min) / props.step;
      const stepWidth = 100 * props.step / (props.max - props.min);
      const result = Array.from({ length: stopCount - 1 }).map((_, index) => (index + 1) * stepWidth);
      if (props.range) {
        return result.filter((step) => {
          return step < 100 * (minValue.value - props.min) / (props.max - props.min) || step > 100 * (maxValue.value - props.min) / (props.max - props.min);
        });
      } else {
        return result.filter((step) => step > 100 * (initData.firstValue - props.min) / (props.max - props.min));
      }
    });
    const getStopStyle = (position) => {
      return props.vertical ? { bottom: `${position}%` } : { left: `${position}%` };
    };
    return {
      stops,
      getStopStyle
    };
  };
  const useMarks = (props) => {
    return vue.computed(() => {
      if (!props.marks) {
        return [];
      }
      const marksKeys = Object.keys(props.marks);
      return marksKeys.map(Number.parseFloat).sort((a, b) => a - b).filter((point) => point <= props.max && point >= props.min).map((point) => ({
        point,
        position: (point - props.min) * 100 / (props.max - props.min),
        mark: props.marks[point]
      }));
    });
  };
  const useWatch = (props, initData, minValue, maxValue, emit, elFormItem) => {
    const _emit = (val) => {
      emit(UPDATE_MODEL_EVENT, val);
      emit(INPUT_EVENT, val);
    };
    const valueChanged = () => {
      if (props.range) {
        return ![minValue.value, maxValue.value].every((item, index) => item === initData.oldValue[index]);
      } else {
        return props.modelValue !== initData.oldValue;
      }
    };
    const setValues = () => {
      var _a2, _b;
      if (props.min > props.max) {
        throwError("Slider", "min should not be greater than max.");
      }
      const val = props.modelValue;
      if (props.range && isArray$1(val)) {
        if (val[1] < props.min) {
          _emit([props.min, props.min]);
        } else if (val[0] > props.max) {
          _emit([props.max, props.max]);
        } else if (val[0] < props.min) {
          _emit([props.min, val[1]]);
        } else if (val[1] > props.max) {
          _emit([val[0], props.max]);
        } else {
          initData.firstValue = val[0];
          initData.secondValue = val[1];
          if (valueChanged()) {
            if (props.validateEvent) {
              (_a2 = elFormItem == null ? void 0 : elFormItem.validate) == null ? void 0 : _a2.call(elFormItem, "change").catch((err) => debugWarn());
            }
            initData.oldValue = val.slice();
          }
        }
      } else if (!props.range && isNumber(val) && !Number.isNaN(val)) {
        if (val < props.min) {
          _emit(props.min);
        } else if (val > props.max) {
          _emit(props.max);
        } else {
          initData.firstValue = val;
          if (valueChanged()) {
            if (props.validateEvent) {
              (_b = elFormItem == null ? void 0 : elFormItem.validate) == null ? void 0 : _b.call(elFormItem, "change").catch((err) => debugWarn());
            }
            initData.oldValue = val;
          }
        }
      }
    };
    setValues();
    vue.watch(() => initData.dragging, (val) => {
      if (!val) {
        setValues();
      }
    });
    vue.watch(() => props.modelValue, (val, oldVal) => {
      if (initData.dragging || isArray$1(val) && isArray$1(oldVal) && val.every((item, index) => item === oldVal[index]) && initData.firstValue === val[0] && initData.secondValue === val[1]) {
        return;
      }
      setValues();
    }, {
      deep: true
    });
    vue.watch(() => [props.min, props.max], () => {
      setValues();
    });
  };
  const useLifecycle = (props, initData, resetSize) => {
    const sliderWrapper = vue.ref();
    vue.onMounted(async () => {
      if (props.range) {
        if (isArray$1(props.modelValue)) {
          initData.firstValue = Math.max(props.min, props.modelValue[0]);
          initData.secondValue = Math.min(props.max, props.modelValue[1]);
        } else {
          initData.firstValue = props.min;
          initData.secondValue = props.max;
        }
        initData.oldValue = [initData.firstValue, initData.secondValue];
      } else {
        if (!isNumber(props.modelValue) || Number.isNaN(props.modelValue)) {
          initData.firstValue = props.min;
        } else {
          initData.firstValue = Math.min(props.max, Math.max(props.min, props.modelValue));
        }
        initData.oldValue = initData.firstValue;
      }
      useEventListener(window, "resize", resetSize);
      await vue.nextTick();
      resetSize();
    });
    return {
      sliderWrapper
    };
  };
  const __default__ = vue.defineComponent({
    name: "ElSlider"
  });
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: sliderProps,
    emits: sliderEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const ns = useNamespace("slider");
      const { t } = useLocale();
      const initData = vue.reactive({
        firstValue: 0,
        secondValue: 0,
        oldValue: 0,
        dragging: false,
        sliderSize: 1
      });
      const {
        elFormItem,
        slider,
        firstButton,
        secondButton,
        sliderDisabled,
        minValue,
        maxValue,
        runwayStyle,
        barStyle,
        resetSize,
        emitChange,
        onSliderWrapperPrevent,
        onSliderClick,
        onSliderDown,
        onSliderMarkerDown,
        setFirstValue,
        setSecondValue
      } = useSlide(props, initData, emit);
      const { stops, getStopStyle } = useStops(props, initData, minValue, maxValue);
      const { inputId, isLabeledByFormItem } = useFormItemInputId(props, {
        formItemContext: elFormItem
      });
      const sliderWrapperSize = useFormSize();
      const sliderInputSize = vue.computed(() => props.inputSize || sliderWrapperSize.value);
      const groupLabel = vue.computed(() => {
        return props.ariaLabel || t("el.slider.defaultLabel", {
          min: props.min,
          max: props.max
        });
      });
      const firstButtonLabel = vue.computed(() => {
        if (props.range) {
          return props.rangeStartLabel || t("el.slider.defaultRangeStartLabel");
        } else {
          return groupLabel.value;
        }
      });
      const firstValueText = vue.computed(() => {
        return props.formatValueText ? props.formatValueText(firstValue.value) : `${firstValue.value}`;
      });
      const secondButtonLabel = vue.computed(() => {
        return props.rangeEndLabel || t("el.slider.defaultRangeEndLabel");
      });
      const secondValueText = vue.computed(() => {
        return props.formatValueText ? props.formatValueText(secondValue.value) : `${secondValue.value}`;
      });
      const sliderKls = vue.computed(() => [
        ns.b(),
        ns.m(sliderWrapperSize.value),
        ns.is("vertical", props.vertical),
        { [ns.m("with-input")]: props.showInput }
      ]);
      const markList = useMarks(props);
      useWatch(props, initData, minValue, maxValue, emit, elFormItem);
      const precision = vue.computed(() => {
        const precisions = [props.min, props.max, props.step].map((item) => {
          const decimal = `${item}`.split(".")[1];
          return decimal ? decimal.length : 0;
        });
        return Math.max.apply(null, precisions);
      });
      const { sliderWrapper } = useLifecycle(props, initData, resetSize);
      const { firstValue, secondValue, sliderSize } = vue.toRefs(initData);
      const updateDragging = (val) => {
        initData.dragging = val;
      };
      useEventListener(sliderWrapper, "touchstart", onSliderWrapperPrevent, {
        passive: false
      });
      useEventListener(sliderWrapper, "touchmove", onSliderWrapperPrevent, {
        passive: false
      });
      vue.provide(sliderContextKey, {
        ...vue.toRefs(props),
        sliderSize,
        disabled: sliderDisabled,
        precision,
        emitChange,
        resetSize,
        updateDragging
      });
      expose({
        onSliderClick
      });
      return (_ctx, _cache) => {
        var _a2, _b;
        return vue.openBlock(), vue.createElementBlock("div", {
          id: _ctx.range ? vue.unref(inputId) : void 0,
          ref_key: "sliderWrapper",
          ref: sliderWrapper,
          class: vue.normalizeClass(vue.unref(sliderKls)),
          role: _ctx.range ? "group" : void 0,
          "aria-label": _ctx.range && !vue.unref(isLabeledByFormItem) ? vue.unref(groupLabel) : void 0,
          "aria-labelledby": _ctx.range && vue.unref(isLabeledByFormItem) ? (_a2 = vue.unref(elFormItem)) == null ? void 0 : _a2.labelId : void 0
        }, [
          vue.createElementVNode("div", {
            ref_key: "slider",
            ref: slider,
            class: vue.normalizeClass([
              vue.unref(ns).e("runway"),
              { "show-input": _ctx.showInput && !_ctx.range },
              vue.unref(ns).is("disabled", vue.unref(sliderDisabled))
            ]),
            style: vue.normalizeStyle(vue.unref(runwayStyle)),
            onMousedown: vue.unref(onSliderDown),
            onTouchstartPassive: vue.unref(onSliderDown)
          }, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(vue.unref(ns).e("bar")),
              style: vue.normalizeStyle(vue.unref(barStyle))
            }, null, 6),
            vue.createVNode(SliderButton, {
              id: !_ctx.range ? vue.unref(inputId) : void 0,
              ref_key: "firstButton",
              ref: firstButton,
              "model-value": vue.unref(firstValue),
              vertical: _ctx.vertical,
              "tooltip-class": _ctx.tooltipClass,
              placement: _ctx.placement,
              role: "slider",
              "aria-label": _ctx.range || !vue.unref(isLabeledByFormItem) ? vue.unref(firstButtonLabel) : void 0,
              "aria-labelledby": !_ctx.range && vue.unref(isLabeledByFormItem) ? (_b = vue.unref(elFormItem)) == null ? void 0 : _b.labelId : void 0,
              "aria-valuemin": _ctx.min,
              "aria-valuemax": _ctx.range ? vue.unref(secondValue) : _ctx.max,
              "aria-valuenow": vue.unref(firstValue),
              "aria-valuetext": vue.unref(firstValueText),
              "aria-orientation": _ctx.vertical ? "vertical" : "horizontal",
              "aria-disabled": vue.unref(sliderDisabled),
              "onUpdate:modelValue": vue.unref(setFirstValue)
            }, null, 8, ["id", "model-value", "vertical", "tooltip-class", "placement", "aria-label", "aria-labelledby", "aria-valuemin", "aria-valuemax", "aria-valuenow", "aria-valuetext", "aria-orientation", "aria-disabled", "onUpdate:modelValue"]),
            _ctx.range ? (vue.openBlock(), vue.createBlock(SliderButton, {
              key: 0,
              ref_key: "secondButton",
              ref: secondButton,
              "model-value": vue.unref(secondValue),
              vertical: _ctx.vertical,
              "tooltip-class": _ctx.tooltipClass,
              placement: _ctx.placement,
              role: "slider",
              "aria-label": vue.unref(secondButtonLabel),
              "aria-valuemin": vue.unref(firstValue),
              "aria-valuemax": _ctx.max,
              "aria-valuenow": vue.unref(secondValue),
              "aria-valuetext": vue.unref(secondValueText),
              "aria-orientation": _ctx.vertical ? "vertical" : "horizontal",
              "aria-disabled": vue.unref(sliderDisabled),
              "onUpdate:modelValue": vue.unref(setSecondValue)
            }, null, 8, ["model-value", "vertical", "tooltip-class", "placement", "aria-label", "aria-valuemin", "aria-valuemax", "aria-valuenow", "aria-valuetext", "aria-orientation", "aria-disabled", "onUpdate:modelValue"])) : vue.createCommentVNode("v-if", true),
            _ctx.showStops ? (vue.openBlock(), vue.createElementBlock("div", { key: 1 }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(stops), (item, key) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key,
                  class: vue.normalizeClass(vue.unref(ns).e("stop")),
                  style: vue.normalizeStyle(vue.unref(getStopStyle)(item))
                }, null, 6);
              }), 128))
            ])) : vue.createCommentVNode("v-if", true),
            vue.unref(markList).length > 0 ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
              vue.createElementVNode("div", null, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(markList), (item, key) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key,
                    style: vue.normalizeStyle(vue.unref(getStopStyle)(item.position)),
                    class: vue.normalizeClass([vue.unref(ns).e("stop"), vue.unref(ns).e("marks-stop")])
                  }, null, 6);
                }), 128))
              ]),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(ns).e("marks"))
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(markList), (item, key) => {
                  return vue.openBlock(), vue.createBlock(vue.unref(SliderMarker), {
                    key,
                    mark: item.mark,
                    style: vue.normalizeStyle(vue.unref(getStopStyle)(item.position)),
                    onMousedown: vue.withModifiers(($event) => vue.unref(onSliderMarkerDown)(item.position), ["stop"])
                  }, null, 8, ["mark", "style", "onMousedown"]);
                }), 128))
              ], 2)
            ], 64)) : vue.createCommentVNode("v-if", true)
          ], 46, ["onMousedown", "onTouchstartPassive"]),
          _ctx.showInput && !_ctx.range ? (vue.openBlock(), vue.createBlock(vue.unref(ElInputNumber), {
            key: 0,
            ref: "input",
            "model-value": vue.unref(firstValue),
            class: vue.normalizeClass(vue.unref(ns).e("input")),
            step: _ctx.step,
            disabled: vue.unref(sliderDisabled),
            controls: _ctx.showInputControls,
            min: _ctx.min,
            max: _ctx.max,
            precision: vue.unref(precision),
            debounce: _ctx.debounce,
            size: vue.unref(sliderInputSize),
            "onUpdate:modelValue": vue.unref(setFirstValue),
            onChange: vue.unref(emitChange)
          }, null, 8, ["model-value", "class", "step", "disabled", "controls", "min", "max", "precision", "debounce", "size", "onUpdate:modelValue", "onChange"])) : vue.createCommentVNode("v-if", true)
        ], 10, ["id", "role", "aria-label", "aria-labelledby"]);
      };
    }
  });
  var Slider = /* @__PURE__ */ _export_sfc$1(_sfc_main$1, [["__file", "slider.vue"]]);
  const ElSlider = withInstall(Slider);
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "toolbar" };
  const _hoisted_2 = { class: "left" };
  const _hoisted_3 = { class: "right" };
  const _hoisted_4 = { class: "r" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      let show = vue.ref(true);
      let d = vue.ref(0);
      let list = vue.ref([
        ["辛", "乙"],
        ["戌", "辰"],
        ["乾", "癸"],
        ["亥", "巳"],
        ["壬", "丙"],
        ["子", "午"],
        ["癸", "丁"],
        ["丑", "未"],
        ["艮", "坤"],
        ["寅", "申"],
        ["甲", "庚"],
        ["卯", "酉"]
      ]);
      return (_ctx, _cache) => {
        const _component_el_slider = ElSlider;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", {
            class: "btn",
            onClick: _cache[0] || (_cache[0] = ($event) => vue.isRef(show) ? show.value = !vue.unref(show) : show = !vue.unref(show))
          }, "切换"),
          vue.unref(show) ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "list",
            style: vue.normalizeStyle({ transform: `translate(-50%, -50%) rotate(${vue.unref(d)}deg) ` })
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(list), (i, j) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                class: "item",
                style: vue.normalizeStyle({ transform: `rotate(${360 / (vue.unref(list).length * 2) * j}deg)` })
              }, [
                vue.createElementVNode("div", _hoisted_2, [
                  vue.createElementVNode("span", null, vue.toDisplayString(i[0]), 1)
                ]),
                vue.createElementVNode("div", _hoisted_3, [
                  vue.createElementVNode("span", null, vue.toDisplayString(i[1]), 1)
                ])
              ], 4);
            }), 256)),
            _cache[2] || (_cache[2] = vue.createElementVNode("div", { class: "dian" }, null, -1)),
            _cache[3] || (_cache[3] = vue.createElementVNode("div", { class: "dian2" }, null, -1)),
            _cache[4] || (_cache[4] = vue.createElementVNode("div", { class: "inner-circle" }, null, -1))
          ], 4)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_4, [
            vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(d)) + ":", 1),
            vue.createVNode(_component_el_slider, {
              class: "range",
              modelValue: vue.unref(d),
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.isRef(d) ? d.value = $event : d = $event),
              max: 360,
              step: 0.5
            }, null, 8, ["modelValue"])
          ])
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-759e8fa0"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);