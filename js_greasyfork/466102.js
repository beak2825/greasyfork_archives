// ==UserScript==
// @name         airflow-helper2
// @namespace    npm/vite-plugin-monkey
// @version      1.0.0
// @author       monkey
// @description  Simplify operation for airflow
// @icon         https://www.yimian.com.cn/favicon.ico
// @match        http://airflow.onework.yimian.com.cn/*
// @match        http://airflow.yimian.com.cn/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.3.1/dist/index.full.min.js
// @require      https://cdn.jsdelivr.net/npm/@vueuse/core@9.13.0/index.iife.min.js
// @downloadURL https://update.greasyfork.org/scripts/466102/airflow-helper2.user.js
// @updateURL https://update.greasyfork.org/scripts/466102/airflow-helper2.meta.js
// ==/UserScript==

(o=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=o,document.head.append(e)})(` @charset "UTF-8";:root{--el-color-primary-rgb: 51, 143, 255;--el-color-success-rgb: 45, 178, 112;--el-color-warning-rgb: 245, 169, 5;--el-color-danger-rgb: 231, 75, 75;--el-color-error-rgb: 231, 75, 75;--el-color-info-rgb: 125, 137, 157;--el-font-size-extra-large: 20px;--el-font-size-large: 18px;--el-font-size-medium: 16px;--el-font-size-base: 14px;--el-font-size-small: 14px;--el-font-size-extra-small: 13px;--el-font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5fae\\8f6f\\96c5\\9ed1", Arial, sans-serif;--el-font-weight-primary: 500;--el-font-line-height-primary: 24px;--el-index-normal: 1;--el-index-top: 1000;--el-index-popper: 2000;--el-border-radius-base: 2px;--el-border-radius-small: 2px;--el-border-radius-round: 16px;--el-border-radius-circle: 100%;--el-transition-duration: .3s;--el-transition-duration-fast: .2s;--el-transition-function-ease-in-out-bezier: cubic-bezier(.645, .045, .355, 1);--el-transition-function-fast-bezier: cubic-bezier(.23, 1, .32, 1);--el-transition-all: all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);--el-transition-fade: opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-md-fade: transform var(--el-transition-duration) var(--el-transition-function-fast-bezier), opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-fade-linear: opacity var(--el-transition-duration-fast) linear;--el-transition-border: border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-box-shadow: box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-color: color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-component-size-large: 40px;--el-component-size: 32px;--el-component-size-small: 24px;color-scheme:light;--el-color-white: #ffffff;--el-color-black: #000000;--el-color-primary: #338fff;--el-color-primary-light-3: #70b1ff;--el-color-primary-light-5: #99c7ff;--el-color-primary-light-7: #c2ddff;--el-color-primary-light-8: #d6e9ff;--el-color-primary-light-9: #ebf4ff;--el-color-primary-dark-2: #2972cc;--el-color-success: #2DB270;--el-color-success-light-3: #6cc99b;--el-color-success-light-5: #96d9b8;--el-color-success-light-7: #c0e8d4;--el-color-success-light-8: #d5f0e2;--el-color-success-light-9: #eaf7f1;--el-color-success-dark-2: #248e5a;--el-color-warning: #F5A905;--el-color-warning-light-3: #f8c350;--el-color-warning-light-5: #fad482;--el-color-warning-light-7: #fce5b4;--el-color-warning-light-8: #fdeecd;--el-color-warning-light-9: #fef6e6;--el-color-warning-dark-2: #c48704;--el-color-danger: #E74B4B;--el-color-danger-light-3: #ee8181;--el-color-danger-light-5: #f3a5a5;--el-color-danger-light-7: #f8c9c9;--el-color-danger-light-8: #fadbdb;--el-color-danger-light-9: #fdeded;--el-color-danger-dark-2: #b93c3c;--el-color-error: #E74B4B;--el-color-error-light-3: #ee8181;--el-color-error-light-5: #f3a5a5;--el-color-error-light-7: #f8c9c9;--el-color-error-light-8: #fadbdb;--el-color-error-light-9: #fdeded;--el-color-error-dark-2: #b93c3c;--el-color-info: #7d899d;--el-color-info-light-3: #a4acba;--el-color-info-light-5: #bec4ce;--el-color-info-light-7: #d8dce2;--el-color-info-light-8: #e5e7eb;--el-color-info-light-9: #f2f3f5;--el-color-info-dark-2: #646e7e;--el-bg-color: #ffffff;--el-bg-color-page: #f2f3f5;--el-bg-color-overlay: #ffffff;--el-text-color-primary: #1D242F;--el-text-color-regular: #3D495C;--el-text-color-secondary: #8c97a9;--el-text-color-placeholder: #B1B9C9;--el-text-color-disabled: #c0c4cc;--el-border-color: #dcdfe6;--el-border-color-light: #ECEEF3;--el-border-color-lighter: #F5F6FA;--el-border-color-extra-light: #F5F6FA;--el-border-color-dark: #d4d7de;--el-border-color-darker: #cdd0d6;--el-border-color-base: #d1d5dc;--el-fill-color: #f0f2f5;--el-fill-color-light: #f5f7fa;--el-fill-color-lighter: #fafafa;--el-fill-color-extra-light: #fafcff;--el-fill-color-dark: #ebedf0;--el-fill-color-darker: #e6e8eb;--el-fill-color-blank: #ffffff;--el-box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08);--el-box-shadow-light: 0px 0px 12px rgba(0, 0, 0, .12);--el-box-shadow-lighter: 0px 0px 6px rgba(0, 0, 0, .12);--el-box-shadow-dark: 0px 16px 48px 16px rgba(0, 0, 0, .08), 0px 12px 32px rgba(0, 0, 0, .12), 0px 8px 16px -8px rgba(0, 0, 0, .16);--el-disabled-bg-color: var(--el-fill-color-light);--el-disabled-text-color: var(--el-text-color-placeholder);--el-disabled-border-color: var(--el-border-color-light);--el-overlay-color: rgba(0, 0, 0, .8);--el-overlay-color-light: rgba(0, 0, 0, .7);--el-overlay-color-lighter: rgba(0, 0, 0, .5);--el-mask-color: rgba(255, 255, 255, .9);--el-mask-color-extra-light: rgba(255, 255, 255, .3);--el-border-width: 1px;--el-border-style: solid;--el-border-color-hover: var(--el-text-color-disabled);--el-border: var(--el-border-width) var(--el-border-style) var(--el-border-color);--el-svg-monochrome-grey: var(--el-border-color)}.fade-in-linear-enter-active,.fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.fade-in-linear-enter-from,.fade-in-linear-leave-to{opacity:0}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.el-fade-in-linear-enter-from,.el-fade-in-linear-leave-to{opacity:0}.el-fade-in-enter-active,.el-fade-in-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-fade-in-enter-from,.el-fade-in-leave-active{opacity:0}.el-zoom-in-center-enter-active,.el-zoom-in-center-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-zoom-in-center-enter-from,.el-zoom-in-center-leave-active{opacity:0;transform:scaleX(0)}.el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;transform:scaleY(1);transition:var(--el-transition-md-fade);transform-origin:center top}.el-zoom-in-top-enter-active[data-popper-placement^=top],.el-zoom-in-top-leave-active[data-popper-placement^=top]{transform-origin:center bottom}.el-zoom-in-top-enter-from,.el-zoom-in-top-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-bottom-enter-active,.el-zoom-in-bottom-leave-active{opacity:1;transform:scaleY(1);transition:var(--el-transition-md-fade);transform-origin:center bottom}.el-zoom-in-bottom-enter-from,.el-zoom-in-bottom-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-left-enter-active,.el-zoom-in-left-leave-active{opacity:1;transform:scale(1);transition:var(--el-transition-md-fade);transform-origin:top left}.el-zoom-in-left-enter-from,.el-zoom-in-left-leave-active{opacity:0;transform:scale(.45)}.collapse-transition{transition:var(--el-transition-duration) height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.el-collapse-transition-leave-active,.el-collapse-transition-enter-active{transition:var(--el-transition-duration) max-height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.horizontal-collapse-transition{transition:var(--el-transition-duration) width ease-in-out,var(--el-transition-duration) padding-left ease-in-out,var(--el-transition-duration) padding-right ease-in-out}.el-list-enter-active,.el-list-leave-active{transition:all 1s}.el-list-enter-from,.el-list-leave-to{opacity:0;transform:translateY(-30px)}.el-list-leave-active{position:absolute!important}.el-opacity-transition{transition:opacity var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-icon-loading{animation:rotating 2s linear infinite}.el-icon--right{margin-left:5px}.el-icon--left{margin-right:5px}@keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.el-icon{--color: inherit;height:1em;width:1em;line-height:1em;display:inline-flex;justify-content:center;align-items:center;position:relative;fill:currentColor;color:var(--color);font-size:inherit}.el-icon.is-loading{animation:rotating 2s linear infinite}.el-icon svg{height:1em;width:1em}.el-button{--el-button-font-weight: var(--el-font-weight-primary);--el-button-border-color: var(--el-border-color);--el-button-bg-color: var(--el-fill-color-blank);--el-button-text-color: var(--el-text-color-regular);--el-button-disabled-text-color: var(--el-disabled-text-color);--el-button-disabled-bg-color: var(--el-fill-color-blank);--el-button-disabled-border-color: var(--el-border-color-light);--el-button-divide-border-color: rgba(255, 255, 255, .5);--el-button-hover-text-color: var(--el-color-primary);--el-button-hover-bg-color: var(--el-color-primary-light-9);--el-button-hover-border-color: var(--el-color-primary-light-7);--el-button-active-text-color: var(--el-button-hover-text-color);--el-button-active-border-color: var(--el-color-primary);--el-button-active-bg-color: var(--el-button-hover-bg-color);--el-button-outline-color: var(--el-color-primary-light-5);--el-button-hover-link-text-color: var(--el-color-info);--el-button-active-color: var(--el-text-color-primary);display:inline-flex;justify-content:center;align-items:center;line-height:1;height:32px;white-space:nowrap;cursor:pointer;color:var(--el-button-text-color);text-align:center;box-sizing:border-box;outline:none;transition:.1s;font-weight:var(--el-button-font-weight);-webkit-user-select:none;user-select:none;vertical-align:middle;-webkit-appearance:none;background-color:var(--el-button-bg-color);border:var(--el-border);border-color:var(--el-button-border-color);padding:8px 11px;font-size:var(--el-font-size-base);border-radius:.125rem}.el-button:hover,.el-button:focus{color:var(--el-button-hover-text-color);border-color:var(--el-button-hover-border-color);background-color:var(--el-button-hover-bg-color);outline:none}.el-button:active{color:var(--el-button-active-text-color);border-color:var(--el-button-active-border-color);background-color:var(--el-button-active-bg-color);outline:none}.el-button:focus-visible{outline:2px solid var(--el-button-outline-color);outline-offset:1px}.el-button>span{display:inline-flex;align-items:center}.el-button+.el-button{margin-left:12px}.el-button.is-round{padding:8px 11px}.el-button::-moz-focus-inner{border:0}.el-button [class*=el-icon]+span{margin-left:6px}.el-button [class*=el-icon] svg{vertical-align:bottom}.el-button.is-plain{--el-button-hover-text-color: var(--el-color-primary);--el-button-hover-bg-color: var(--el-fill-color-blank);--el-button-hover-border-color: var(--el-color-primary)}.el-button.is-active{color:var(--el-button-active-text-color);border-color:var(--el-button-active-border-color);background-color:var(--el-button-active-bg-color);outline:none}.el-button.is-disabled,.el-button.is-disabled:hover,.el-button.is-disabled:focus{color:var(--el-button-disabled-text-color);cursor:not-allowed;background-image:none;background-color:var(--el-button-disabled-bg-color);border-color:var(--el-button-disabled-border-color)}.el-button.is-loading{position:relative;pointer-events:none}.el-button.is-loading:before{z-index:1;pointer-events:none;content:"";position:absolute;left:-1px;top:-1px;right:-1px;bottom:-1px;border-radius:inherit;background-color:var(--el-mask-color-extra-light)}.el-button.is-round{border-radius:var(--el-border-radius-round)}.el-button.is-circle{border-radius:50%;padding:8px}.el-button.is-text{color:var(--el-button-text-color);border:0 solid transparent;background-color:transparent}.el-button.is-text.is-disabled{color:var(--el-button-disabled-text-color);background-color:transparent!important}.el-button.is-text:not(.is-disabled):hover,.el-button.is-text:not(.is-disabled):focus{background-color:var(--el-fill-color-light)}.el-button.is-text:not(.is-disabled):focus-visible{outline:2px solid var(--el-button-outline-color);outline-offset:1px}.el-button.is-text:not(.is-disabled):active{background-color:var(--el-fill-color)}.el-button.is-text:not(.is-disabled).is-has-bg{background-color:var(--el-fill-color-light)}.el-button.is-text:not(.is-disabled).is-has-bg:hover,.el-button.is-text:not(.is-disabled).is-has-bg:focus{background-color:var(--el-fill-color)}.el-button.is-text:not(.is-disabled).is-has-bg:active{background-color:var(--el-fill-color-dark)}.el-button__text--expand{letter-spacing:.3em;margin-right:-.3em}.el-button.is-link{border-color:transparent;color:var(--el-button-text-color);background:transparent;padding:2px;height:auto}.el-button.is-link:hover,.el-button.is-link:focus{color:var(--el-button-hover-link-text-color)}.el-button.is-link.is-disabled{color:var(--el-button-disabled-text-color);background-color:transparent!important;border-color:transparent!important}.el-button.is-link:not(.is-disabled):hover,.el-button.is-link:not(.is-disabled):focus{border-color:transparent;background-color:transparent}.el-button.is-link:not(.is-disabled):active{color:var(--el-button-active-color);border-color:transparent;background-color:transparent}.el-button--text{border-color:transparent;background:transparent;color:var(--el-color-primary);padding-left:0;padding-right:0}.el-button--text.is-disabled{color:var(--el-button-disabled-text-color);background-color:transparent!important;border-color:transparent!important}.el-button--text:not(.is-disabled):hover,.el-button--text:not(.is-disabled):focus{color:var(--el-color-primary-light-3);border-color:transparent;background-color:transparent}.el-button--text:not(.is-disabled):active{color:var(--el-color-primary-dark-2);border-color:transparent;background-color:transparent}.el-button__link--expand{letter-spacing:.3em;margin-right:-.3em}.el-button--primary{--el-button-text-color: var(--el-color-white);--el-button-bg-color: var(--el-color-primary);--el-button-border-color: var(--el-color-primary);--el-button-outline-color: var(--el-color-primary-light-5);--el-button-active-color: var(--el-color-primary-dark-2);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-link-text-color: var(--el-color-primary-light-5);--el-button-hover-bg-color: var(--el-color-primary-light-3);--el-button-hover-border-color: var(--el-color-primary-light-3);--el-button-active-bg-color: var(--el-color-primary-dark-2);--el-button-active-border-color: var(--el-color-primary-dark-2);--el-button-disabled-text-color: var(--el-color-white);--el-button-disabled-bg-color: var(--el-color-primary-light-5);--el-button-disabled-border-color: var(--el-color-primary-light-5)}.el-button--primary.is-plain,.el-button--primary.is-text,.el-button--primary.is-link{--el-button-text-color: var(--el-color-primary);--el-button-bg-color: var(--el-color-primary-light-9);--el-button-border-color: var(--el-color-primary-light-5);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-bg-color: var(--el-color-primary);--el-button-hover-border-color: var(--el-color-primary);--el-button-active-text-color: var(--el-color-white)}.el-button--primary.is-plain.is-disabled,.el-button--primary.is-plain.is-disabled:hover,.el-button--primary.is-plain.is-disabled:focus,.el-button--primary.is-plain.is-disabled:active,.el-button--primary.is-text.is-disabled,.el-button--primary.is-text.is-disabled:hover,.el-button--primary.is-text.is-disabled:focus,.el-button--primary.is-text.is-disabled:active,.el-button--primary.is-link.is-disabled,.el-button--primary.is-link.is-disabled:hover,.el-button--primary.is-link.is-disabled:focus,.el-button--primary.is-link.is-disabled:active{color:var(--el-color-primary-light-5);background-color:var(--el-color-primary-light-9);border-color:var(--el-color-primary-light-8)}.el-button--success{--el-button-text-color: var(--el-color-white);--el-button-bg-color: var(--el-color-success);--el-button-border-color: var(--el-color-success);--el-button-outline-color: var(--el-color-success-light-5);--el-button-active-color: var(--el-color-success-dark-2);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-link-text-color: var(--el-color-success-light-5);--el-button-hover-bg-color: var(--el-color-success-light-3);--el-button-hover-border-color: var(--el-color-success-light-3);--el-button-active-bg-color: var(--el-color-success-dark-2);--el-button-active-border-color: var(--el-color-success-dark-2);--el-button-disabled-text-color: var(--el-color-white);--el-button-disabled-bg-color: var(--el-color-success-light-5);--el-button-disabled-border-color: var(--el-color-success-light-5)}.el-button--success.is-plain,.el-button--success.is-text,.el-button--success.is-link{--el-button-text-color: var(--el-color-success);--el-button-bg-color: var(--el-color-success-light-9);--el-button-border-color: var(--el-color-success-light-5);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-bg-color: var(--el-color-success);--el-button-hover-border-color: var(--el-color-success);--el-button-active-text-color: var(--el-color-white)}.el-button--success.is-plain.is-disabled,.el-button--success.is-plain.is-disabled:hover,.el-button--success.is-plain.is-disabled:focus,.el-button--success.is-plain.is-disabled:active,.el-button--success.is-text.is-disabled,.el-button--success.is-text.is-disabled:hover,.el-button--success.is-text.is-disabled:focus,.el-button--success.is-text.is-disabled:active,.el-button--success.is-link.is-disabled,.el-button--success.is-link.is-disabled:hover,.el-button--success.is-link.is-disabled:focus,.el-button--success.is-link.is-disabled:active{color:var(--el-color-success-light-5);background-color:var(--el-color-success-light-9);border-color:var(--el-color-success-light-8)}.el-button--warning{--el-button-text-color: var(--el-color-white);--el-button-bg-color: var(--el-color-warning);--el-button-border-color: var(--el-color-warning);--el-button-outline-color: var(--el-color-warning-light-5);--el-button-active-color: var(--el-color-warning-dark-2);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-link-text-color: var(--el-color-warning-light-5);--el-button-hover-bg-color: var(--el-color-warning-light-3);--el-button-hover-border-color: var(--el-color-warning-light-3);--el-button-active-bg-color: var(--el-color-warning-dark-2);--el-button-active-border-color: var(--el-color-warning-dark-2);--el-button-disabled-text-color: var(--el-color-white);--el-button-disabled-bg-color: var(--el-color-warning-light-5);--el-button-disabled-border-color: var(--el-color-warning-light-5)}.el-button--warning.is-plain,.el-button--warning.is-text,.el-button--warning.is-link{--el-button-text-color: var(--el-color-warning);--el-button-bg-color: var(--el-color-warning-light-9);--el-button-border-color: var(--el-color-warning-light-5);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-bg-color: var(--el-color-warning);--el-button-hover-border-color: var(--el-color-warning);--el-button-active-text-color: var(--el-color-white)}.el-button--warning.is-plain.is-disabled,.el-button--warning.is-plain.is-disabled:hover,.el-button--warning.is-plain.is-disabled:focus,.el-button--warning.is-plain.is-disabled:active,.el-button--warning.is-text.is-disabled,.el-button--warning.is-text.is-disabled:hover,.el-button--warning.is-text.is-disabled:focus,.el-button--warning.is-text.is-disabled:active,.el-button--warning.is-link.is-disabled,.el-button--warning.is-link.is-disabled:hover,.el-button--warning.is-link.is-disabled:focus,.el-button--warning.is-link.is-disabled:active{color:var(--el-color-warning-light-5);background-color:var(--el-color-warning-light-9);border-color:var(--el-color-warning-light-8)}.el-button--danger{--el-button-text-color: var(--el-color-white);--el-button-bg-color: var(--el-color-danger);--el-button-border-color: var(--el-color-danger);--el-button-outline-color: var(--el-color-danger-light-5);--el-button-active-color: var(--el-color-danger-dark-2);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-link-text-color: var(--el-color-danger-light-5);--el-button-hover-bg-color: var(--el-color-danger-light-3);--el-button-hover-border-color: var(--el-color-danger-light-3);--el-button-active-bg-color: var(--el-color-danger-dark-2);--el-button-active-border-color: var(--el-color-danger-dark-2);--el-button-disabled-text-color: var(--el-color-white);--el-button-disabled-bg-color: var(--el-color-danger-light-5);--el-button-disabled-border-color: var(--el-color-danger-light-5)}.el-button--danger.is-plain,.el-button--danger.is-text,.el-button--danger.is-link{--el-button-text-color: var(--el-color-danger);--el-button-bg-color: var(--el-color-danger-light-9);--el-button-border-color: var(--el-color-danger-light-5);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-bg-color: var(--el-color-danger);--el-button-hover-border-color: var(--el-color-danger);--el-button-active-text-color: var(--el-color-white)}.el-button--danger.is-plain.is-disabled,.el-button--danger.is-plain.is-disabled:hover,.el-button--danger.is-plain.is-disabled:focus,.el-button--danger.is-plain.is-disabled:active,.el-button--danger.is-text.is-disabled,.el-button--danger.is-text.is-disabled:hover,.el-button--danger.is-text.is-disabled:focus,.el-button--danger.is-text.is-disabled:active,.el-button--danger.is-link.is-disabled,.el-button--danger.is-link.is-disabled:hover,.el-button--danger.is-link.is-disabled:focus,.el-button--danger.is-link.is-disabled:active{color:var(--el-color-danger-light-5);background-color:var(--el-color-danger-light-9);border-color:var(--el-color-danger-light-8)}.el-button--info{--el-button-text-color: var(--el-color-white);--el-button-bg-color: var(--el-color-info);--el-button-border-color: var(--el-color-info);--el-button-outline-color: var(--el-color-info-light-5);--el-button-active-color: var(--el-color-info-dark-2);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-link-text-color: var(--el-color-info-light-5);--el-button-hover-bg-color: var(--el-color-info-light-3);--el-button-hover-border-color: var(--el-color-info-light-3);--el-button-active-bg-color: var(--el-color-info-dark-2);--el-button-active-border-color: var(--el-color-info-dark-2);--el-button-disabled-text-color: var(--el-color-white);--el-button-disabled-bg-color: var(--el-color-info-light-5);--el-button-disabled-border-color: var(--el-color-info-light-5)}.el-button--info.is-plain,.el-button--info.is-text,.el-button--info.is-link{--el-button-text-color: var(--el-color-info);--el-button-bg-color: var(--el-color-info-light-9);--el-button-border-color: var(--el-color-info-light-5);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-bg-color: var(--el-color-info);--el-button-hover-border-color: var(--el-color-info);--el-button-active-text-color: var(--el-color-white)}.el-button--info.is-plain.is-disabled,.el-button--info.is-plain.is-disabled:hover,.el-button--info.is-plain.is-disabled:focus,.el-button--info.is-plain.is-disabled:active,.el-button--info.is-text.is-disabled,.el-button--info.is-text.is-disabled:hover,.el-button--info.is-text.is-disabled:focus,.el-button--info.is-text.is-disabled:active,.el-button--info.is-link.is-disabled,.el-button--info.is-link.is-disabled:hover,.el-button--info.is-link.is-disabled:focus,.el-button--info.is-link.is-disabled:active{color:var(--el-color-info-light-5);background-color:var(--el-color-info-light-9);border-color:var(--el-color-info-light-8)}.el-button--large{--el-button-size: 40px;height:var(--el-button-size);padding:12px 19px;font-size:var(--el-font-size-base);border-radius:var(--el-border-radius-base)}.el-button--large [class*=el-icon]+span{margin-left:8px}.el-button--large.is-round{padding:12px 19px}.el-button--large.is-circle{width:var(--el-button-size);padding:12px}.el-button--small{--el-button-size: 32px;height:var(--el-button-size);padding:4px 11px;font-size:14px;border-radius:.25rem}.el-button--small [class*=el-icon]+span{margin-left:4px}.el-button--small.is-round{padding:4px 11px}.el-button--small.is-circle{width:var(--el-button-size);padding:4px}.el-textarea{--el-input-text-color: var(--el-text-color-regular);--el-input-border: var(--el-border);--el-input-hover-border: var(--el-border-color-hover);--el-input-focus-border: var(--el-color-primary);--el-input-transparent-border: 0 0 0 1px transparent inset;--el-input-border-color: var(--el-border-color);--el-input-border-radius: .125rem;--el-input-bg-color: var(--el-fill-color-blank);--el-input-icon-color: var(--el-text-color-placeholder);--el-input-placeholder-color: var(--el-text-color-placeholder);--el-input-hover-border-color: var(--el-border-color-hover);--el-input-clear-hover-color: var(--el-text-color-secondary);--el-input-focus-border-color: var(--el-color-primary);position:relative;display:inline-block;width:100%;vertical-align:bottom;font-size:var(--el-font-size-base)}.el-textarea__inner{position:relative;display:block;resize:vertical;padding:5px 11px;line-height:1.5;box-sizing:border-box;width:100%;font-size:inherit;font-family:inherit;color:var(--el-input-text-color, var(--el-text-color-regular));background-color:var(--el-input-bg-color, var(--el-fill-color-blank));background-image:none;-webkit-appearance:none;box-shadow:0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;border-radius:var(--el-input-border-radius, .125rem);transition:var(--el-transition-box-shadow);border:none}.el-textarea__inner::placeholder{color:var(--el-input-placeholder-color, var(--el-text-color-placeholder))}.el-textarea__inner:hover{box-shadow:0 0 0 1px var(--el-input-hover-border-color) inset}.el-textarea__inner:focus{outline:none;box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset}.el-textarea .el-input__count{color:var(--el-color-info);background:var(--el-fill-color-blank);position:absolute;font-size:12px;line-height:14px;bottom:5px;right:10px}.el-textarea.is-disabled .el-textarea__inner{background-color:var(--el-disabled-bg-color);border-color:var(--el-disabled-border-color);color:var(--el-disabled-text-color);cursor:not-allowed}.el-textarea.is-disabled .el-textarea__inner::placeholder{color:var(--el-text-color-placeholder)}.el-textarea.is-exceed .el-textarea__inner{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-textarea.is-exceed .el-input__count{color:var(--el-color-danger)}.el-input{--el-input-text-color: var(--el-text-color-regular);--el-input-border: var(--el-border);--el-input-hover-border: var(--el-border-color-hover);--el-input-focus-border: var(--el-color-primary);--el-input-transparent-border: 0 0 0 1px transparent inset;--el-input-border-color: var(--el-border-color);--el-input-border-radius: .125rem;--el-input-bg-color: var(--el-fill-color-blank);--el-input-icon-color: var(--el-text-color-placeholder);--el-input-placeholder-color: var(--el-text-color-placeholder);--el-input-hover-border-color: var(--el-border-color-hover);--el-input-clear-hover-color: var(--el-text-color-secondary);--el-input-focus-border-color: var(--el-color-primary);--el-input-height: var(--el-component-size);position:relative;font-size:var(--el-font-size-base);display:inline-flex;width:100%;line-height:var(--el-input-height);box-sizing:border-box;vertical-align:middle}.el-input::-webkit-scrollbar{z-index:11;width:6px}.el-input::-webkit-scrollbar:horizontal{height:6px}.el-input::-webkit-scrollbar-thumb{border-radius:5px;width:6px;background:var(--el-text-color-disabled)}.el-input::-webkit-scrollbar-corner{background:var(--el-fill-color-blank)}.el-input::-webkit-scrollbar-track{background:var(--el-fill-color-blank)}.el-input::-webkit-scrollbar-track-piece{background:var(--el-fill-color-blank);width:6px}.el-input .el-input__clear,.el-input .el-input__password{color:var(--el-input-icon-color);font-size:14px;cursor:pointer}.el-input .el-input__clear:hover,.el-input .el-input__password:hover{color:var(--el-input-clear-hover-color)}.el-input .el-input__count{height:100%;display:inline-flex;align-items:center;color:var(--el-color-info);font-size:12px}.el-input .el-input__count .el-input__count-inner{background:var(--el-fill-color-blank);line-height:initial;display:inline-block;padding-left:8px}.el-input__wrapper{display:inline-flex;flex-grow:1;align-items:center;justify-content:center;padding:1px 11px;background-color:var(--el-input-bg-color, var(--el-fill-color-blank));background-image:none;border-radius:var(--el-input-border-radius, .125rem);transition:var(--el-transition-box-shadow);transform:translateZ(0);box-shadow:0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset}.el-input__wrapper:hover{box-shadow:0 0 0 1px var(--el-input-hover-border-color) inset}.el-input__wrapper.is-focus{box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset}.el-input__inner{--el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);width:100%;flex-grow:1;-webkit-appearance:none;color:var(--el-input-text-color, var(--el-text-color-regular));font-size:inherit;height:var(--el-input-inner-height);line-height:var(--el-input-inner-height);padding:0;outline:none;border:none;background:none;box-sizing:border-box}.el-input__inner:focus{outline:none}.el-input__inner::placeholder{color:var(--el-input-placeholder-color, var(--el-text-color-placeholder))}.el-input__inner[type=password]::-ms-reveal{display:none}.el-input__prefix{display:inline-flex;white-space:nowrap;flex-shrink:0;flex-wrap:nowrap;height:100%;text-align:center;color:var(--el-input-icon-color, var(--el-text-color-placeholder));transition:all var(--el-transition-duration);pointer-events:none}.el-input__prefix-inner{pointer-events:all;display:inline-flex;align-items:center;justify-content:center}.el-input__prefix-inner>:last-child{margin-right:8px}.el-input__prefix-inner>:first-child,.el-input__prefix-inner>:first-child.el-input__icon{margin-left:0}.el-input__suffix{display:inline-flex;white-space:nowrap;flex-shrink:0;flex-wrap:nowrap;height:100%;text-align:center;color:var(--el-input-icon-color, var(--el-text-color-placeholder));transition:all var(--el-transition-duration);pointer-events:none}.el-input__suffix-inner{pointer-events:all;display:inline-flex;align-items:center;justify-content:center}.el-input__suffix-inner>:first-child{margin-left:8px}.el-input .el-input__icon{height:inherit;line-height:inherit;display:flex;justify-content:center;align-items:center;transition:all var(--el-transition-duration);margin-left:8px}.el-input__validateIcon{pointer-events:none}.el-input.is-active .el-input__wrapper{box-shadow:0 0 0 1px var(--el-input-focus-color, ) inset}.el-input.is-disabled{cursor:not-allowed}.el-input.is-disabled .el-input__wrapper{background-color:var(--el-disabled-bg-color);box-shadow:0 0 0 1px var(--el-disabled-border-color) inset}.el-input.is-disabled .el-input__inner{color:var(--el-disabled-text-color);-webkit-text-fill-color:var(--el-disabled-text-color);cursor:not-allowed}.el-input.is-disabled .el-input__inner::placeholder{color:var(--el-text-color-placeholder)}.el-input.is-disabled .el-input__icon{cursor:not-allowed}.el-input.is-exceed .el-input__wrapper{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-input.is-exceed .el-input__suffix .el-input__count{color:var(--el-color-danger)}.el-input--large{--el-input-height: var(--el-component-size-large);font-size:14px}.el-input--large .el-input__wrapper{padding:1px 15px}.el-input--large .el-input__inner{--el-input-inner-height: calc(var(--el-input-height, 40px) - 2px)}.el-input--small{--el-input-height: var(--el-component-size-small);font-size:14px}.el-input--small .el-input__wrapper{padding:1px 7px}.el-input--small .el-input__inner{--el-input-inner-height: calc(var(--el-input-height, 32px) - 2px)}.el-input-group{display:inline-flex;width:100%;align-items:stretch}.el-input-group__append,.el-input-group__prepend{background-color:var(--el-fill-color-light);color:var(--el-color-info);position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:100%;border-radius:var(--el-input-border-radius);padding:0 20px;white-space:nowrap}.el-input-group__append:focus,.el-input-group__prepend:focus{outline:none}.el-input-group__append .el-select,.el-input-group__append .el-button,.el-input-group__prepend .el-select,.el-input-group__prepend .el-button{display:inline-block;margin:0 -20px}.el-input-group__append button.el-button,.el-input-group__append button.el-button:hover,.el-input-group__append div.el-select .el-input__wrapper,.el-input-group__append div.el-select:hover .el-input__wrapper,.el-input-group__prepend button.el-button,.el-input-group__prepend button.el-button:hover,.el-input-group__prepend div.el-select .el-input__wrapper,.el-input-group__prepend div.el-select:hover .el-input__wrapper{border-color:transparent;background-color:transparent;color:inherit}.el-input-group__append .el-button,.el-input-group__append .el-input,.el-input-group__prepend .el-button,.el-input-group__prepend .el-input{font-size:inherit}.el-input-group__prepend{border-right:0;border-top-right-radius:0;border-bottom-right-radius:0;box-shadow:1px 0 0 0 var(--el-input-border-color) inset,0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset}.el-input-group__append{border-left:0;border-top-left-radius:0;border-bottom-left-radius:0;box-shadow:0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset,-1px 0 0 0 var(--el-input-border-color) inset}.el-input-group--prepend>.el-input__wrapper{border-top-left-radius:0;border-bottom-left-radius:0}.el-input-group--prepend .el-input-group__prepend .el-select .el-input .el-input__inner{box-shadow:none!important}.el-input-group--prepend .el-input-group__prepend .el-select .el-input .el-input__wrapper{border-top-right-radius:0;border-bottom-right-radius:0;box-shadow:1px 0 0 0 var(--el-input-border-color) inset,0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset}.el-input-group--prepend .el-input-group__prepend .el-select .el-input.is-focus .el-input__inner{box-shadow:none!important}.el-input-group--prepend .el-input-group__prepend .el-select .el-input.is-focus .el-input__wrapper{box-shadow:1px 0 0 0 var(--el-input-focus-border-color) inset,1px 0 0 0 var(--el-input-focus-border-color),0 1px 0 0 var(--el-input-focus-border-color) inset,0 -1px 0 0 var(--el-input-focus-border-color) inset!important;z-index:2}.el-input-group--prepend .el-input-group__prepend .el-select .el-input.is-focus .el-input__wrapper:focus{outline:none;z-index:2;box-shadow:1px 0 0 0 var(--el-input-focus-border-color) inset,1px 0 0 0 var(--el-input-focus-border-color),0 1px 0 0 var(--el-input-focus-border-color) inset,0 -1px 0 0 var(--el-input-focus-border-color) inset!important}.el-input-group--prepend .el-input-group__prepend .el-select:hover .el-input__inner{box-shadow:none!important}.el-input-group--prepend .el-input-group__prepend .el-select:hover .el-input__wrapper{z-index:1;box-shadow:1px 0 0 0 var(--el-input-hover-border-color) inset,1px 0 0 0 var(--el-input-hover-border-color),0 1px 0 0 var(--el-input-hover-border-color) inset,0 -1px 0 0 var(--el-input-hover-border-color) inset!important}.el-input-group--append>.el-input__wrapper{border-top-right-radius:0;border-bottom-right-radius:0}.el-input-group--append .el-input-group__append .el-select .el-input .el-input__inner{box-shadow:none!important}.el-input-group--append .el-input-group__append .el-select .el-input .el-input__wrapper{border-top-left-radius:0;border-bottom-left-radius:0;box-shadow:0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset,-1px 0 0 0 var(--el-input-border-color) inset}.el-input-group--append .el-input-group__append .el-select .el-input.is-focus .el-input__inner{box-shadow:none!important}.el-input-group--append .el-input-group__append .el-select .el-input.is-focus .el-input__wrapper{z-index:2;box-shadow:-1px 0 0 0 var(--el-input-focus-border-color),-1px 0 0 0 var(--el-input-focus-border-color) inset,0 1px 0 0 var(--el-input-focus-border-color) inset,0 -1px 0 0 var(--el-input-focus-border-color) inset!important}.el-input-group--append .el-input-group__append .el-select:hover .el-input__inner{box-shadow:none!important}.el-input-group--append .el-input-group__append .el-select:hover .el-input__wrapper{z-index:1;box-shadow:-1px 0 0 0 var(--el-input-hover-border-color),-1px 0 0 0 var(--el-input-hover-border-color) inset,0 1px 0 0 var(--el-input-hover-border-color) inset,0 -1px 0 0 var(--el-input-hover-border-color) inset!important}.el-tag{--el-tag-font-size: 12px;--el-tag-border-radius: .125rem;--el-tag-border-radius-rounded: 9999px;--el-tag-bg-color: var(--el-color-primary-light-9);--el-tag-border-color: var(--el-color-primary-light-8);--el-tag-hover-color: var(--el-color-primary);--el-tag-text-color: var(--el-color-primary);background-color:var(--el-tag-bg-color);border-color:var(--el-tag-border-color);color:var(--el-tag-text-color);display:inline-flex;justify-content:center;align-items:center;height:24px;padding:0 9px;font-size:var(--el-tag-font-size);line-height:1;border-width:1px;border-style:solid;border-radius:var(--el-tag-border-radius);box-sizing:border-box;white-space:nowrap;--el-icon-size: 14px}.el-tag.el-tag--primary{--el-tag-bg-color: var(--el-color-primary-light-9);--el-tag-border-color: var(--el-color-primary-light-8);--el-tag-hover-color: var(--el-color-primary)}.el-tag.el-tag--success{--el-tag-bg-color: var(--el-color-success-light-9);--el-tag-border-color: var(--el-color-success-light-8);--el-tag-hover-color: var(--el-color-success)}.el-tag.el-tag--warning{--el-tag-bg-color: var(--el-color-warning-light-9);--el-tag-border-color: var(--el-color-warning-light-8);--el-tag-hover-color: var(--el-color-warning)}.el-tag.el-tag--danger{--el-tag-bg-color: var(--el-color-danger-light-9);--el-tag-border-color: var(--el-color-danger-light-8);--el-tag-hover-color: var(--el-color-danger)}.el-tag.el-tag--error{--el-tag-bg-color: var(--el-color-error-light-9);--el-tag-border-color: var(--el-color-error-light-8);--el-tag-hover-color: var(--el-color-error)}.el-tag.el-tag--info{--el-tag-bg-color: var(--el-color-info-light-9);--el-tag-border-color: var(--el-color-info-light-8);--el-tag-hover-color: var(--el-color-info)}.el-tag.el-tag--primary{--el-tag-text-color: var(--el-color-primary)}.el-tag.el-tag--success{--el-tag-text-color: var(--el-color-success)}.el-tag.el-tag--warning{--el-tag-text-color: var(--el-color-warning)}.el-tag.el-tag--danger{--el-tag-text-color: var(--el-color-danger)}.el-tag.el-tag--error{--el-tag-text-color: var(--el-color-error)}.el-tag.el-tag--info{--el-tag-text-color: var(--el-color-info)}.el-tag.is-hit{border-color:var(--el-color-primary)}.el-tag.is-round{border-radius:var(--el-tag-border-radius-rounded)}.el-tag .el-tag__close{color:var(--el-tag-text-color)}.el-tag .el-tag__close:hover{color:var(--el-color-white);background-color:var(--el-tag-hover-color)}.el-tag .el-icon{border-radius:50%;cursor:pointer;font-size:calc(var(--el-icon-size) - 2px);height:var(--el-icon-size);width:var(--el-icon-size)}.el-tag .el-tag__close{margin-left:6px}.el-tag--dark{--el-tag-bg-color: var(--el-color-primary);--el-tag-border-color: var(--el-color-primary);--el-tag-hover-color: var(--el-color-primary-light-3);--el-tag-text-color: var(--el-color-white)}.el-tag--dark.el-tag--primary{--el-tag-bg-color: var(--el-color-primary);--el-tag-border-color: var(--el-color-primary);--el-tag-hover-color: var(--el-color-primary-light-3)}.el-tag--dark.el-tag--success{--el-tag-bg-color: var(--el-color-success);--el-tag-border-color: var(--el-color-success);--el-tag-hover-color: var(--el-color-success-light-3)}.el-tag--dark.el-tag--warning{--el-tag-bg-color: var(--el-color-warning);--el-tag-border-color: var(--el-color-warning);--el-tag-hover-color: var(--el-color-warning-light-3)}.el-tag--dark.el-tag--danger{--el-tag-bg-color: var(--el-color-danger);--el-tag-border-color: var(--el-color-danger);--el-tag-hover-color: var(--el-color-danger-light-3)}.el-tag--dark.el-tag--error{--el-tag-bg-color: var(--el-color-error);--el-tag-border-color: var(--el-color-error);--el-tag-hover-color: var(--el-color-error-light-3)}.el-tag--dark.el-tag--info{--el-tag-bg-color: var(--el-color-info);--el-tag-border-color: var(--el-color-info);--el-tag-hover-color: var(--el-color-info-light-3)}.el-tag--dark.el-tag--primary,.el-tag--dark.el-tag--success,.el-tag--dark.el-tag--warning,.el-tag--dark.el-tag--danger,.el-tag--dark.el-tag--error,.el-tag--dark.el-tag--info{--el-tag-text-color: var(--el-color-white)}.el-tag--plain{--el-tag-border-color: var(--el-color-primary-light-5);--el-tag-hover-color: var(--el-color-primary);--el-tag-bg-color: var(--el-fill-color-blank)}.el-tag--plain.el-tag--primary{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-primary-light-5);--el-tag-hover-color: var(--el-color-primary)}.el-tag--plain.el-tag--success{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-success-light-5);--el-tag-hover-color: var(--el-color-success)}.el-tag--plain.el-tag--warning{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-warning-light-5);--el-tag-hover-color: var(--el-color-warning)}.el-tag--plain.el-tag--danger{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-danger-light-5);--el-tag-hover-color: var(--el-color-danger)}.el-tag--plain.el-tag--error{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-error-light-5);--el-tag-hover-color: var(--el-color-error)}.el-tag--plain.el-tag--info{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-info-light-5);--el-tag-hover-color: var(--el-color-info)}.el-tag.is-closable{padding-right:5px}.el-tag--large{padding:0 11px;height:32px;--el-icon-size: 16px}.el-tag--large .el-tag__close{margin-left:8px}.el-tag--large.is-closable{padding-right:7px}.el-tag--small{padding:0 7px;height:20px;--el-icon-size: 12px}.el-tag--small .el-tag__close{margin-left:4px}.el-tag--small.is-closable{padding-right:3px}.el-tag--small .el-icon-close{transform:scale(.8)}.el-tag.el-tag--primary.is-hit{border-color:var(--el-color-primary)}.el-tag.el-tag--success.is-hit{border-color:var(--el-color-success)}.el-tag.el-tag--warning.is-hit{border-color:var(--el-color-warning)}.el-tag.el-tag--danger.is-hit{border-color:var(--el-color-danger)}.el-tag.el-tag--error.is-hit{border-color:var(--el-color-error)}.el-tag.el-tag--info.is-hit{border-color:var(--el-color-info)}.el-select-dropdown__item{font-size:var(--el-font-size-base);padding:0 32px 0 20px;position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--el-text-color-regular);height:40px;line-height:40px;box-sizing:border-box;cursor:pointer}.el-select-dropdown__item.is-disabled{color:var(--el-text-color-placeholder);cursor:not-allowed}.el-select-dropdown__item.hover,.el-select-dropdown__item:hover{background-color:var(--el-fill-color-light)}.el-select-dropdown__item.selected{color:var(--el-color-primary);font-weight:700}.el-select-group{margin:0;padding:0}.el-select-group__wrap{position:relative;list-style:none;margin:0;padding:0}.el-select-group__wrap:not(:last-of-type){padding-bottom:24px}.el-select-group__wrap:not(:last-of-type):after{content:"";position:absolute;display:block;left:20px;right:20px;bottom:12px;height:1px;background:var(--el-border-color-light)}.el-select-group__split-dash{position:absolute;left:20px;right:20px;height:1px;background:var(--el-border-color-light)}.el-select-group__title{padding-left:20px;font-size:14px;color:var(--el-color-info);line-height:32px}.el-select-group .el-select-dropdown__item{padding-left:20px}.el-scrollbar{--el-scrollbar-opacity: .3;--el-scrollbar-bg-color: var(--el-text-color-secondary);--el-scrollbar-hover-opacity: .5;--el-scrollbar-hover-bg-color: var(--el-text-color-secondary);overflow:hidden;position:relative;height:100%}.el-scrollbar__wrap{overflow:auto;height:100%}.el-scrollbar__wrap--hidden-default{scrollbar-width:none}.el-scrollbar__wrap--hidden-default::-webkit-scrollbar{display:none}.el-scrollbar__thumb{position:relative;display:block;width:0;height:0;cursor:pointer;border-radius:inherit;background-color:var(--el-scrollbar-bg-color, var(--el-text-color-secondary));transition:var(--el-transition-duration) background-color;opacity:var(--el-scrollbar-opacity, .3)}.el-scrollbar__thumb:hover{background-color:var(--el-scrollbar-hover-bg-color, var(--el-text-color-secondary));opacity:var(--el-scrollbar-hover-opacity, .5)}.el-scrollbar__bar{position:absolute;right:2px;bottom:2px;z-index:1;border-radius:4px}.el-scrollbar__bar.is-vertical{width:6px;top:2px}.el-scrollbar__bar.is-vertical>div{width:100%}.el-scrollbar__bar.is-horizontal{height:6px;left:2px}.el-scrollbar__bar.is-horizontal>div{height:100%}.el-scrollbar-fade-enter-active{transition:opacity .34s ease-out}.el-scrollbar-fade-leave-active{transition:opacity .12s ease-out}.el-scrollbar-fade-enter-from,.el-scrollbar-fade-leave-active{opacity:0}.el-popper{--el-popper-border-radius: var(--el-popover-border-radius, 4px);position:absolute;border-radius:var(--el-popper-border-radius);padding:5px 11px;z-index:2000;font-size:12px;line-height:20px;min-width:10px;word-wrap:break-word;visibility:visible}.el-popper.is-dark{color:var(--el-bg-color);background:var(--el-text-color-primary);border:1px solid var(--el-text-color-primary)}.el-popper.is-dark .el-popper__arrow:before{border:1px solid var(--el-text-color-primary);background:var(--el-text-color-primary);right:0}.el-popper.is-light{background:var(--el-bg-color-overlay);border:1px solid var(--el-border-color-light)}.el-popper.is-light .el-popper__arrow:before{border:1px solid var(--el-border-color-light);background:var(--el-bg-color-overlay);right:0}.el-popper.is-pure{padding:0}.el-popper__arrow{position:absolute;width:10px;height:10px;z-index:-1}.el-popper__arrow:before{position:absolute;width:10px;height:10px;z-index:-1;content:" ";transform:rotate(45deg);background:var(--el-text-color-primary);box-sizing:border-box}.el-popper[data-popper-placement^=top]>.el-popper__arrow{bottom:-5px}.el-popper[data-popper-placement^=top]>.el-popper__arrow:before{border-bottom-right-radius:2px}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow{top:-5px}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow:before{border-top-left-radius:2px}.el-popper[data-popper-placement^=left]>.el-popper__arrow{right:-5px}.el-popper[data-popper-placement^=left]>.el-popper__arrow:before{border-top-right-radius:2px}.el-popper[data-popper-placement^=right]>.el-popper__arrow{left:-5px}.el-popper[data-popper-placement^=right]>.el-popper__arrow:before{border-bottom-left-radius:2px}.el-popper[data-popper-placement^=top] .el-popper__arrow:before{border-top-color:transparent!important;border-left-color:transparent!important}.el-popper[data-popper-placement^=bottom] .el-popper__arrow:before{border-bottom-color:transparent!important;border-right-color:transparent!important}.el-popper[data-popper-placement^=left] .el-popper__arrow:before{border-left-color:transparent!important;border-bottom-color:transparent!important}.el-popper[data-popper-placement^=right] .el-popper__arrow:before{border-right-color:transparent!important;border-top-color:transparent!important}.el-select-dropdown{z-index:calc(var(--el-index-top) + 1);border-radius:var(--el-border-radius-base);box-sizing:border-box}.el-select-dropdown.is-multiple .el-select-dropdown__item.selected{color:var(--el-color-primary);background-color:var(--el-bg-color-overlay)}.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover{background-color:var(--el-fill-color-light)}.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after{content:"";position:absolute;top:50%;right:20px;border-top:none;border-right:none;background-repeat:no-repeat;background-position:center;background-color:var(--el-color-primary);-webkit-mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;mask-size:100% 100%;-webkit-mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;-webkit-mask-size:100% 100%;transform:translateY(-50%);width:12px;height:12px}.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.is-disabled:after{background-color:var(--el-text-color-disabled)}.el-select-dropdown .el-select-dropdown__option-item.is-selected:after{content:"";position:absolute;top:50%;right:20px;border-top:none;border-right:none;background-repeat:no-repeat;background-position:center;background-color:var(--el-color-primary);-webkit-mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;mask-size:100% 100%;-webkit-mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;-webkit-mask-size:100% 100%;transform:translateY(-50%);width:12px;height:12px}.el-select-dropdown .el-scrollbar.is-empty .el-select-dropdown__list{padding:0}.el-select-dropdown .el-select-dropdown__item.is-disabled:hover{background-color:unset}.el-select-dropdown .el-select-dropdown__item.is-disabled.selected{color:var(--el-text-color-disabled)}.el-select-dropdown__empty{padding:10px 0;margin:0;text-align:center;color:var(--el-text-color-secondary);font-size:var(--el-select-font-size)}.el-select-dropdown__wrap{max-height:274px}.el-select-dropdown__list{list-style:none;padding:6px 0;margin:0;box-sizing:border-box}.el-select{--el-select-border-color-hover: var(--el-border-color-hover);--el-select-disabled-border: var(--el-disabled-border-color);--el-select-font-size: var(--el-font-size-base);--el-select-close-hover-color: var(--el-text-color-secondary);--el-select-input-color: var(--el-text-color-placeholder);--el-select-multiple-input-color: var(--el-text-color-regular);--el-select-input-focus-border-color: var(--el-color-primary);--el-select-input-font-size: 14px;display:inline-block;position:relative;vertical-align:middle;line-height:32px}.el-select__popper.el-popper{background:var(--el-bg-color-overlay);border:1px solid var(--el-border-color-light);box-shadow:var(--el-box-shadow-light)}.el-select__popper.el-popper .el-popper__arrow:before{border:1px solid var(--el-border-color-light)}.el-select__popper.el-popper[data-popper-placement^=top] .el-popper__arrow:before{border-top-color:transparent;border-left-color:transparent}.el-select__popper.el-popper[data-popper-placement^=bottom] .el-popper__arrow:before{border-bottom-color:transparent;border-right-color:transparent}.el-select__popper.el-popper[data-popper-placement^=left] .el-popper__arrow:before{border-left-color:transparent;border-bottom-color:transparent}.el-select__popper.el-popper[data-popper-placement^=right] .el-popper__arrow:before{border-right-color:transparent;border-top-color:transparent}.el-select .el-select-tags-wrapper.has-prefix{margin-left:6px}.el-select--large{line-height:40px}.el-select--large .el-select-tags-wrapper.has-prefix{margin-left:8px}.el-select--small{line-height:32px}.el-select--small .el-select-tags-wrapper.has-prefix{margin-left:4px}.el-select .el-select__tags>span{display:inline-block}.el-select:hover:not(.el-select--disabled) .el-input__wrapper{box-shadow:0 0 0 1px var(--el-select-border-color-hover) inset}.el-select .el-select__tags-text{display:inline-block;line-height:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.el-select .el-input__wrapper{cursor:pointer}.el-select .el-input__wrapper.is-focus{box-shadow:0 0 0 1px var(--el-select-input-focus-border-color) inset!important}.el-select .el-input__inner{cursor:pointer}.el-select .el-input{display:flex}.el-select .el-input .el-select__caret{color:var(--el-select-input-color);font-size:var(--el-select-input-font-size);transition:transform var(--el-transition-duration);transform:rotate(0);cursor:pointer}.el-select .el-input .el-select__caret.is-reverse{transform:rotate(-180deg)}.el-select .el-input .el-select__caret.is-show-close{font-size:var(--el-select-font-size);text-align:center;transform:rotate(0);border-radius:var(--el-border-radius-circle);color:var(--el-select-input-color);transition:var(--el-transition-color)}.el-select .el-input .el-select__caret.is-show-close:hover{color:var(--el-select-close-hover-color)}.el-select .el-input .el-select__caret.el-icon{position:relative;height:inherit;z-index:2}.el-select .el-input.is-disabled .el-input__wrapper{cursor:not-allowed}.el-select .el-input.is-disabled .el-input__wrapper:hover{box-shadow:0 0 0 1px var(--el-select-disabled-border) inset}.el-select .el-input.is-disabled .el-input__inner,.el-select .el-input.is-disabled .el-select__caret{cursor:not-allowed}.el-select .el-input.is-focus .el-input__wrapper{box-shadow:0 0 0 1px var(--el-select-input-focus-border-color) inset!important}.el-select__input{border:none;outline:none;padding:0;margin-left:15px;color:var(--el-select-multiple-input-color);font-size:var(--el-select-font-size);-webkit-appearance:none;appearance:none;height:28px;background-color:transparent}.el-select__input--iOS{position:absolute;left:0;top:0;z-index:6}.el-select__input.is-small{height:14px}.el-select__close{cursor:pointer;position:absolute;top:8px;z-index:var(--el-index-top);right:25px;color:var(--el-select-input-color);line-height:18px;font-size:var(--el-select-input-font-size)}.el-select__close:hover{color:var(--el-select-close-hover-color)}.el-select__tags{position:absolute;line-height:normal;top:50%;transform:translateY(-50%);white-space:normal;z-index:var(--el-index-normal);display:flex;align-items:center;flex-wrap:wrap;cursor:pointer}.el-select__tags .el-tag{box-sizing:border-box;border-color:transparent;margin:2px 6px 2px 0}.el-select__tags .el-tag:last-child{margin-right:0}.el-select__tags .el-tag .el-icon-close{background-color:var(--el-text-color-placeholder);right:-7px;top:0;color:#fff}.el-select__tags .el-tag .el-icon-close:hover{background-color:var(--el-text-color-secondary)}.el-select__tags .el-tag .el-icon-close:before{display:block;transform:translateY(.5px)}.el-select__tags .el-tag--info{background-color:var(--el-fill-color)}.el-select__collapse-tags{white-space:normal;z-index:var(--el-index-normal);display:flex;align-items:center;flex-wrap:wrap;cursor:pointer}.el-select__collapse-tags .el-tag{box-sizing:border-box;border-color:transparent;margin:2px 6px 2px 0}.el-select__collapse-tags .el-tag:last-child{margin-right:0}.el-select__collapse-tags .el-tag .el-icon-close{background-color:var(--el-text-color-placeholder);right:-7px;top:0;color:#fff}.el-select__collapse-tags .el-tag .el-icon-close:hover{background-color:var(--el-text-color-secondary)}.el-select__collapse-tags .el-tag .el-icon-close:before{display:block;transform:translateY(.5px)}.el-select__collapse-tags .el-tag--info{background-color:var(--el-fill-color)}.el-select__collapse-tag{line-height:inherit;height:inherit;display:flex}.el-checkbox-group{font-size:0;line-height:0}.el-checkbox-button{--el-checkbox-button-checked-bg-color: var(--el-color-primary);--el-checkbox-button-checked-text-color: var(--el-color-white);--el-checkbox-button-checked-border-color: var(--el-color-primary);position:relative;display:inline-block}.el-checkbox-button__inner{display:inline-block;line-height:1;font-weight:var(--el-checkbox-font-weight);white-space:nowrap;vertical-align:middle;cursor:pointer;background:var(--el-button-bg-color, var(--el-fill-color-blank));border:var(--el-border);border-left:0;color:var(--el-button-text-color, var(--el-text-color-regular));-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:none;margin:0;position:relative;transition:var(--el-transition-all);-webkit-user-select:none;user-select:none;padding:8px 11px;font-size:var(--el-font-size-base);border-radius:0}.el-checkbox-button__inner.is-round{padding:8px 11px}.el-checkbox-button__inner:hover{color:var(--el-color-primary)}.el-checkbox-button__inner [class*=el-icon-]{line-height:.9}.el-checkbox-button__inner [class*=el-icon-]+span{margin-left:5px}.el-checkbox-button__original{opacity:0;outline:none;position:absolute;margin:0;z-index:-1}.el-checkbox-button.is-checked .el-checkbox-button__inner{color:var(--el-checkbox-button-checked-text-color);background-color:var(--el-checkbox-button-checked-bg-color);border-color:var(--el-checkbox-button-checked-border-color);box-shadow:-1px 0 0 0 var(--el-color-primary-light-7)}.el-checkbox-button.is-checked:first-child .el-checkbox-button__inner{border-left-color:var(--el-checkbox-button-checked-border-color)}.el-checkbox-button.is-disabled .el-checkbox-button__inner{color:var(--el-disabled-text-color);cursor:not-allowed;background-image:none;background-color:var(--el-button-disabled-bg-color, var(--el-fill-color-blank));border-color:var(--el-button-disabled-border-color, var(--el-border-color-light));box-shadow:none}.el-checkbox-button.is-disabled:first-child .el-checkbox-button__inner{border-left-color:var(--el-button-disabled-border-color, var(--el-border-color-light))}.el-checkbox-button:first-child .el-checkbox-button__inner{border-left:var(--el-border);border-top-left-radius:var(--el-border-radius-base);border-bottom-left-radius:var(--el-border-radius-base);box-shadow:none!important}.el-checkbox-button.is-focus .el-checkbox-button__inner{border-color:var(--el-checkbox-button-checked-border-color)}.el-checkbox-button:last-child .el-checkbox-button__inner{border-top-right-radius:var(--el-border-radius-base);border-bottom-right-radius:var(--el-border-radius-base)}.el-checkbox-button--large .el-checkbox-button__inner{padding:12px 19px;font-size:var(--el-font-size-base);border-radius:0}.el-checkbox-button--large .el-checkbox-button__inner.is-round{padding:12px 19px}.el-checkbox-button--small .el-checkbox-button__inner{padding:4px 11px;font-size:14px;border-radius:0}.el-checkbox-button--small .el-checkbox-button__inner.is-round{padding:4px 11px}:root{--color-neutral-00: #F5F6FA;--color-neutral-10: #F5F6FA;--color-neutral-20: #ECEEF3;--color-neutral-30: #d1d5dc;--color-neutral-40: #bec4ce;--color-neutral-50: #B1B9C9;--color-neutral-60: #9ea7b6;--color-neutral-70: #8c97a9;--color-neutral-300: #7d899d;--color-neutral-400: #8894AA;--color-neutral-500: #55647c;--color-neutral-600: #3D495C;--color-neutral-700: #253753;--color-neutral-800: #1D242F;--color-neutral-900: #051123;--color-brand-100: #ebf4ff;--color-brand-200: #c2ddff;--color-brand-300: #90c2ff;--color-brand-400: #62a9ff;--color-brand-500: #338fff;--color-brand-600: #1c72e3;--color-brand-700: #0455c6;--color-brand-800: #084191;--color-brand-900: #0e2a58;--color-skyblue-100: #E1F4FE;--color-skyblue-200: #BDE7FD;--color-skyblue-300: #7ED2FB;--color-skyblue-400: #42BCFA;--color-skyblue-500: #19ACF5;--color-skyblue-600: #0091E5;--color-skyblue-700: #0071B8;--color-skyblue-800: #004E80;--color-skyblue-900: #003152;--color-teal-100: #eaf9fb;--color-teal-200: #bbecf3;--color-teal-300: #8bdfeb;--color-teal-400: #5cd1e3;--color-teal-500: #26c2d9;--color-teal-600: #24a4b7;--color-teal-700: #218897;--color-teal-800: #18646f;--color-teal-900: #103f46;--color-green-100: #DCF4E8;--color-green-200: #A7E4C6;--color-green-300: #7BD6A9;--color-green-400: #50C98D;--color-green-500: #2DB270;--color-green-600: #119C57;--color-green-700: #0E8147;--color-green-800: #0A5C34;--color-green-900: #08492A;--color-ascential-100: #f2f7e5;--color-ascential-200: #dbe9b6;--color-ascential-300: #c2db84;--color-ascential-400: #a8cb50;--color-ascential-500: #91be23;--color-ascential-600: #729c3b;--color-ascential-700: #486f59;--color-ascential-800: #255a4d;--color-ascential-900: #054641;--color-orange-100: #FEF3D7;--color-orange-200: #FDE19B;--color-orange-300: #FBD26A;--color-orange-400: #F9BF39;--color-orange-500: #F5A905;--color-orange-600: #E49101;--color-orange-700: #BD7100;--color-orange-800: #8F5100;--color-orange-900: #703C00;--color-red-100: #FCE3E3;--color-red-200: #F7BABA;--color-red-300: #F29898;--color-red-400: #EE7575;--color-red-500: #E74B4B;--color-red-600: #D24241;--color-red-700: #C13433;--color-red-800: #922120;--color-red-900: #7B1414;--color-pink-100: #fce8f5;--color-pink-200: #f7cce7;--color-pink-300: #f0abd6;--color-pink-400: #ea8dc6;--color-pink-500: #e16fb5;--color-pink-600: #c2599a;--color-pink-700: #a1457d;--color-pink-800: #7a335e;--color-pink-900: #4a1c38;--color-purple-100: #ede9fb;--color-purple-200: #dbd5f7;--color-purple-300: #c7bdf3;--color-purple-400: #b5a7ef;--color-purple-500: #a190ea;--color-purple-600: #8772de;--color-purple-700: #6d54d1;--color-purple-800: #4f3c9c;--color-purple-900: #33246b;--shadow-xs: 0 0 0 1px rgba(0, 0, 0, .04);--shadow-sm: 0 2px 10px 0 rgba(0, 0, 0, .04);--shadow-default: 0 1px 2px rgba(0, 0, 0, .03), 0 2px 3px rgba(0, 0, 0, .04);--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06);--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04);--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, .25);--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, .06);--shadow-outline: 0 0 0 3px rgba(51, 143, 255, .5);--shadow-none: none;--borderRadius-none: 0;--borderRadius-sm: .125rem;--borderRadius-default: .25rem;--borderRadius-md: .375rem;--borderRadius-lg: .5rem;--borderRadius-full: 9999px;--fontSize-xs: .75rem;--fontSize-sm: .875rem;--fontSize-base: 1rem;--fontSize-lg: 1.125rem;--fontSize-xl: 1.25rem;--fontSize-2xl: 1.5rem;--fontSize-3xl: 1.875rem;--fontSize-4xl: 2.25rem;--fontSize-5xl: 3rem;--fontSize-6xl: 4rem}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.container{width:100%}@media (min-width: 640px){.container{max-width:640px}}@media (min-width: 768px){.container{max-width:768px}}@media (min-width: 1024px){.container{max-width:1024px}}@media (min-width: 1280px){.container{max-width:1280px}}@media (min-width: 1440px){.container{max-width:1440px}}@media (min-width: 1536px){.container{max-width:1536px}}@media (min-width: 1720px){.container{max-width:1720px}}.fixed{position:fixed!important}.z-\\[999\\]{z-index:999!important}.mr-4{margin-right:1rem!important}.mt-2{margin-top:.5rem!important}.flex{display:flex!important}.table{display:table!important}.grid{display:grid!important}.w-\\[488px\\]{width:488px!important}.w-full{width:100%!important}.cursor-move{cursor:move!important}.justify-end{justify-content:flex-end!important}.bg-white{--tw-bg-opacity: 1 !important;background-color:rgb(255 255 255 / var(--tw-bg-opacity))!important}.p-3{padding:.75rem!important}.shadow-md{--tw-shadow: var(--shadow-md) !important;--tw-shadow-colored: var(--shadow-md) !important;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)!important}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)!important}*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:var(--color-gray-200)}:before,:after{--tw-content: ""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,Helvetica Neue,Pingfang SC,Microsoft Yahei,Souce Han Sans SC,WenQuanYi Micro Hei,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:var(--color-gray-400)}input::placeholder,textarea::placeholder{opacity:1;color:var(--color-gray-400)}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}body{font-size:.875rem;font-weight:400;line-height:1.25rem;color:var(--color-neutral-600);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}h1,h2,h3,h4,h5,h6{font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,Helvetica Neue,Pingfang SC,Microsoft Yahei,Souce Han Sans SC,WenQuanYi Micro Hei,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-weight:500;color:var(--color-neutral-800)}h1{font-size:2.25rem;line-height:2.5rem}h2{font-size:1.5rem;line-height:2rem}h3{font-size:1.25rem;line-height:1.75rem}h4{font-size:1.125rem;line-height:1.75rem}h5{font-size:1rem;line-height:1.5rem}h6{font-size:.875rem;line-height:1.25rem} `);

(function (vue, core, elementPlus) {
  'use strict';

  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_main_001 = __commonJS({
    "main-b04e901c.js"(exports, module) {
      const composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
        const handleEvent = (event) => {
          const shouldPrevent = theirsHandler == null ? void 0 : theirsHandler(event);
          if (checkForDefaultPrevented === false || !shouldPrevent) {
            return oursHandler == null ? void 0 : oursHandler(event);
          }
        };
        return handleEvent;
      };
      const NOOP = () => {
      };
      const hasOwnProperty$a = Object.prototype.hasOwnProperty;
      const hasOwn$2 = (val, key) => hasOwnProperty$a.call(val, key);
      const isArray$6 = Array.isArray;
      const isFunction$1 = (val) => typeof val === "function";
      const isString$1 = (val) => typeof val === "string";
      const isObject$1 = (val) => val !== null && typeof val === "object";
      const objectToString$2 = Object.prototype.toString;
      const toTypeString = (value) => objectToString$2.call(value);
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
      var objectProto$c = Object.prototype;
      var hasOwnProperty$9 = objectProto$c.hasOwnProperty;
      var nativeObjectToString$1 = objectProto$c.toString;
      var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty$9.call(value, symToStringTag$1), tag2 = value[symToStringTag$1];
        try {
          value[symToStringTag$1] = void 0;
          var unmasked = true;
        } catch (e) {
        }
        var result = nativeObjectToString$1.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag$1] = tag2;
          } else {
            delete value[symToStringTag$1];
          }
        }
        return result;
      }
      var objectProto$b = Object.prototype;
      var nativeObjectToString = objectProto$b.toString;
      function objectToString$1(value) {
        return nativeObjectToString.call(value);
      }
      var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
      var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString$1(value);
      }
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      var symbolTag$1 = "[object Symbol]";
      function isSymbol$1(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$1;
      }
      function arrayMap(array, iteratee) {
        var index2 = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index2 < length) {
          result[index2] = iteratee(array[index2], index2, array);
        }
        return result;
      }
      var isArray$4 = Array.isArray;
      const isArray$5 = isArray$4;
      var INFINITY$1 = 1 / 0;
      var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolToString = symbolProto$1 ? symbolProto$1.toString : void 0;
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray$5(value)) {
          return arrayMap(value, baseToString) + "";
        }
        if (isSymbol$1(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
      }
      var reWhitespace = /\s/;
      function trimmedEndIndex(string) {
        var index2 = string.length;
        while (index2-- && reWhitespace.test(string.charAt(index2))) {
        }
        return index2;
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
        if (isSymbol$1(value)) {
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
      function identity(value) {
        return value;
      }
      var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        var tag2 = baseGetTag(value);
        return tag2 == funcTag$1 || tag2 == genTag || tag2 == asyncTag || tag2 == proxyTag;
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
      var funcProto = Function.prototype, objectProto$a = Object.prototype;
      var funcToString = funcProto.toString;
      var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
      var reIsNative = RegExp(
        "^" + funcToString.call(hasOwnProperty$8).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
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
      var WeakMap$1 = getNative(root$1, "WeakMap");
      const WeakMap$2 = WeakMap$1;
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
      const defineProperty$1 = defineProperty;
      var baseSetToString = !defineProperty$1 ? identity : function(func, string) {
        return defineProperty$1(func, "toString", {
          "configurable": true,
          "enumerable": false,
          "value": constant(string),
          "writable": true
        });
      };
      const baseSetToString$1 = baseSetToString;
      var setToString = shortOut(baseSetToString$1);
      const setToString$1 = setToString;
      var MAX_SAFE_INTEGER$1 = 9007199254740991;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER$1 : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      function baseAssignValue(object, key, value) {
        if (key == "__proto__" && defineProperty$1) {
          defineProperty$1(object, key, {
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
      var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
      function assignValue(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty$7.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      var nativeMax$1 = Math.max;
      function overRest(func, start, transform) {
        start = nativeMax$1(start === void 0 ? func.length - 1 : start, 0);
        return function() {
          var args = arguments, index2 = -1, length = nativeMax$1(args.length - start, 0), array = Array(length);
          while (++index2 < length) {
            array[index2] = args[start + index2];
          }
          index2 = -1;
          var otherArgs = Array(start + 1);
          while (++index2 < start) {
            otherArgs[index2] = args[index2];
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
        return value != null && isLength(value.length) && !isFunction(value);
      }
      var objectProto$8 = Object.prototype;
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$8;
        return value === proto;
      }
      function baseTimes(n, iteratee) {
        var index2 = -1, result = Array(n);
        while (++index2 < n) {
          result[index2] = iteratee(index2);
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
      var Buffer2 = moduleExports$1 ? root$1.Buffer : void 0;
      var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
      var isBuffer$1 = nativeIsBuffer || stubFalse;
      const isBuffer$2 = isBuffer$1;
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
        var isArr = isArray$5(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$2(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
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
        if (isArray$5(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol$1(value)) {
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
        var index2 = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length) {
          var entry = entries[index2];
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
        var data = this.__data__, index2 = assocIndexOf(data, key);
        if (index2 < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index2 == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index2, 1);
        }
        --this.size;
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index2 = assocIndexOf(data, key);
        return index2 < 0 ? void 0 : data[index2][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__, index2 = assocIndexOf(data, key);
        if (index2 < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index2][1] = value;
        }
        return this;
      }
      function ListCache(entries) {
        var index2 = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length) {
          var entry = entries[index2];
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
        var index2 = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length) {
          var entry = entries[index2];
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
      var rePropName$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reEscapeChar$1 = /\\(\\)?/g;
      var stringToPath$1 = memoizeCapped(function(string) {
        var result = [];
        if (string.charCodeAt(0) === 46) {
          result.push("");
        }
        string.replace(rePropName$1, function(match, number, quote2, subString) {
          result.push(quote2 ? subString.replace(reEscapeChar$1, "$1") : number || match);
        });
        return result;
      });
      const stringToPath$2 = stringToPath$1;
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      function castPath(value, object) {
        if (isArray$5(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath$2(toString(value));
      }
      var INFINITY = 1 / 0;
      function toKey(value) {
        if (typeof value == "string" || isSymbol$1(value)) {
          return value;
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      function baseGet(object, path) {
        path = castPath(path, object);
        var index2 = 0, length = path.length;
        while (object != null && index2 < length) {
          object = object[toKey(path[index2++])];
        }
        return index2 && index2 == length ? object : void 0;
      }
      function get(object, path, defaultValue) {
        var result = object == null ? void 0 : baseGet(object, path);
        return result === void 0 ? defaultValue : result;
      }
      function arrayPush(array, values) {
        var index2 = -1, length = values.length, offset = array.length;
        while (++index2 < length) {
          array[offset + index2] = values[index2];
        }
        return array;
      }
      var spreadableSymbol = Symbol$2 ? Symbol$2.isConcatSpreadable : void 0;
      function isFlattenable(value) {
        return isArray$5(value) || isArguments$1(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
      }
      function baseFlatten(array, depth, predicate, isStrict, result) {
        var index2 = -1, length = array.length;
        predicate || (predicate = isFlattenable);
        result || (result = []);
        while (++index2 < length) {
          var value = array[index2];
          if (depth > 0 && predicate(value)) {
            if (depth > 1) {
              baseFlatten(value, depth - 1, predicate, isStrict, result);
            } else {
              arrayPush(result, value);
            }
          } else if (!isStrict) {
            result[result.length] = value;
          }
        }
        return result;
      }
      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, 1) : [];
      }
      function flatRest(func) {
        return setToString$1(overRest(func, void 0, flatten), func + "");
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
        var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index2 < length) {
          var value = array[index2];
          if (predicate(value, index2, array)) {
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
        return isArray$5(object) ? result : arrayPush(result, symbolsFunc(object));
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols$1);
      }
      var DataView$1 = getNative(root$1, "DataView");
      const DataView$2 = DataView$1;
      var Promise$1 = getNative(root$1, "Promise");
      const Promise$2 = Promise$1;
      var Set$1 = getNative(root$1, "Set");
      const Set$2 = Set$1;
      var mapTag$1 = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag$1 = "[object Set]", weakMapTag = "[object WeakMap]";
      var dataViewTag$1 = "[object DataView]";
      var dataViewCtorString = toSource(DataView$2), mapCtorString = toSource(Map$2), promiseCtorString = toSource(Promise$2), setCtorString = toSource(Set$2), weakMapCtorString = toSource(WeakMap$2);
      var getTag = baseGetTag;
      if (DataView$2 && getTag(new DataView$2(new ArrayBuffer(1))) != dataViewTag$1 || Map$2 && getTag(new Map$2()) != mapTag$1 || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$2 && getTag(new Set$2()) != setTag$1 || WeakMap$2 && getTag(new WeakMap$2()) != weakMapTag) {
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
        var index2 = -1, length = values == null ? 0 : values.length;
        this.__data__ = new MapCache();
        while (++index2 < length) {
          this.add(values[index2]);
        }
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function arraySome(array, predicate) {
        var index2 = -1, length = array == null ? 0 : array.length;
        while (++index2 < length) {
          if (predicate(array[index2], index2, array)) {
            return true;
          }
        }
        return false;
      }
      function cacheHas(cache, key) {
        return cache.has(key);
      }
      var COMPARE_PARTIAL_FLAG$3 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
      function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var arrStacked = stack.get(array);
        var othStacked = stack.get(other);
        if (arrStacked && othStacked) {
          return arrStacked == other && othStacked == array;
        }
        var index2 = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$1 ? new SetCache() : void 0;
        stack.set(array, other);
        stack.set(other, array);
        while (++index2 < arrLength) {
          var arrValue = array[index2], othValue = other[index2];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
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
        var index2 = -1, result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index2] = [key, value];
        });
        return result;
      }
      function setToArray(set) {
        var index2 = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index2] = value;
        });
        return result;
      }
      var COMPARE_PARTIAL_FLAG$2 = 1, COMPARE_UNORDERED_FLAG = 2;
      var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
      var symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
      function equalByTag(object, other, tag2, bitmask, customizer, equalFunc, stack) {
        switch (tag2) {
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
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2;
            convert || (convert = setToArray);
            if (object.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG;
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
      var COMPARE_PARTIAL_FLAG$1 = 1;
      var objectProto$1 = Object.prototype;
      var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index2 = objLength;
        while (index2--) {
          var key = objProps[index2];
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
        while (++index2 < objLength) {
          key = objProps[index2];
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
      var COMPARE_PARTIAL_FLAG = 1;
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray$5(object), othIsArr = isArray$5(other), objTag = objIsArr ? arrayTag : getTag$1(object), othTag = othIsArr ? arrayTag : getTag$1(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer$2(object)) {
          if (!isBuffer$2(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
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
      function baseHasIn(object, key) {
        return object != null && key in Object(object);
      }
      function hasPath(object, path, hasFunc) {
        path = castPath(path, object);
        var index2 = -1, length = path.length, result = false;
        while (++index2 < length) {
          var key = toKey(path[index2]);
          if (!(result = object != null && hasFunc(object, key))) {
            break;
          }
          object = object[key];
        }
        if (result || ++index2 != length) {
          return result;
        }
        length = object == null ? 0 : object.length;
        return !!length && isLength(length) && isIndex(key, length) && (isArray$5(object) || isArguments$1(object));
      }
      function hasIn(object, path) {
        return object != null && hasPath(object, path, baseHasIn);
      }
      var now = function() {
        return root$1.Date.now();
      };
      const now$1 = now;
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
      function fromPairs(pairs) {
        var index2 = -1, length = pairs == null ? 0 : pairs.length, result = {};
        while (++index2 < length) {
          var pair = pairs[index2];
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
      function baseSet(object, path, value, customizer) {
        if (!isObject(object)) {
          return object;
        }
        path = castPath(path, object);
        var index2 = -1, length = path.length, lastIndex = length - 1, nested = object;
        while (nested != null && ++index2 < length) {
          var key = toKey(path[index2]), newValue = value;
          if (key === "__proto__" || key === "constructor" || key === "prototype") {
            return object;
          }
          if (index2 != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : void 0;
            if (newValue === void 0) {
              newValue = isObject(objValue) ? objValue : isIndex(path[index2 + 1]) ? [] : {};
            }
          }
          assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object;
      }
      function basePickBy(object, paths, predicate) {
        var index2 = -1, length = paths.length, result = {};
        while (++index2 < length) {
          var path = paths[index2], value = baseGet(object, path);
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
      const pick$1 = pick;
      const isUndefined = (val) => val === void 0;
      const isElement$1 = (e) => {
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
      const escapeStringRegexp = (string = "") => string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
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
      function debugWarn(scope, message) {
      }
      function addUnit(value, defaultUnit = "px") {
        if (!value)
          return "";
        if (core.isNumber(value) || isStringNumber(value)) {
          return `${value}${defaultUnit}`;
        } else if (isString$1(value)) {
          return value;
        }
      }
      function scrollIntoView(container2, selected) {
        if (!core.isClient)
          return;
        if (!selected) {
          container2.scrollTop = 0;
          return;
        }
        const offsetParents = [];
        let pointer = selected.offsetParent;
        while (pointer !== null && container2 !== pointer && container2.contains(pointer)) {
          offsetParents.push(pointer);
          pointer = pointer.offsetParent;
        }
        const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
        const bottom = top + selected.offsetHeight;
        const viewRectTop = container2.scrollTop;
        const viewRectBottom = viewRectTop + container2.clientHeight;
        if (top < viewRectTop) {
          container2.scrollTop = top;
        } else if (bottom > viewRectBottom) {
          container2.scrollTop = bottom - container2.clientHeight;
        }
      }
      /*! Element Plus Icons Vue v2.1.0 */
      var export_helper_default = (sfc, props) => {
        let target = sfc.__vccOpts || sfc;
        for (let [key, val] of props)
          target[key] = val;
        return target;
      };
      var arrow_down_vue_vue_type_script_lang_default = {
        name: "ArrowDown"
      };
      var _hoisted_16 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, _hoisted_26 = /* @__PURE__ */ vue.createElementVNode(
        "path",
        {
          fill: "currentColor",
          d: "M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
        },
        null,
        -1
        /* HOISTED */
      ), _hoisted_36 = [
        _hoisted_26
      ];
      function _sfc_render6(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock("svg", _hoisted_16, _hoisted_36);
      }
      var arrow_down_default = /* @__PURE__ */ export_helper_default(arrow_down_vue_vue_type_script_lang_default, [["render", _sfc_render6], ["__file", "arrow-down.vue"]]);
      var circle_check_vue_vue_type_script_lang_default = {
        name: "CircleCheck"
      };
      var _hoisted_149 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, _hoisted_249 = /* @__PURE__ */ vue.createElementVNode(
        "path",
        {
          fill: "currentColor",
          d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"
        },
        null,
        -1
        /* HOISTED */
      ), _hoisted_348 = /* @__PURE__ */ vue.createElementVNode(
        "path",
        {
          fill: "currentColor",
          d: "M745.344 361.344a32 32 0 0 1 45.312 45.312l-288 288a32 32 0 0 1-45.312 0l-160-160a32 32 0 1 1 45.312-45.312L480 626.752l265.344-265.408z"
        },
        null,
        -1
        /* HOISTED */
      ), _hoisted_415 = [
        _hoisted_249,
        _hoisted_348
      ];
      function _sfc_render49(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock("svg", _hoisted_149, _hoisted_415);
      }
      var circle_check_default = /* @__PURE__ */ export_helper_default(circle_check_vue_vue_type_script_lang_default, [["render", _sfc_render49], ["__file", "circle-check.vue"]]);
      var circle_close_vue_vue_type_script_lang_default = {
        name: "CircleClose"
      };
      var _hoisted_151 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, _hoisted_251 = /* @__PURE__ */ vue.createElementVNode(
        "path",
        {
          fill: "currentColor",
          d: "m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248L466.752 512z"
        },
        null,
        -1
        /* HOISTED */
      ), _hoisted_350 = /* @__PURE__ */ vue.createElementVNode(
        "path",
        {
          fill: "currentColor",
          d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"
        },
        null,
        -1
        /* HOISTED */
      ), _hoisted_416 = [
        _hoisted_251,
        _hoisted_350
      ];
      function _sfc_render51(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock("svg", _hoisted_151, _hoisted_416);
      }
      var circle_close_default = /* @__PURE__ */ export_helper_default(circle_close_vue_vue_type_script_lang_default, [["render", _sfc_render51], ["__file", "circle-close.vue"]]);
      var close_vue_vue_type_script_lang_default = {
        name: "Close"
      };
      var _hoisted_156 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, _hoisted_256 = /* @__PURE__ */ vue.createElementVNode(
        "path",
        {
          fill: "currentColor",
          d: "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
        },
        null,
        -1
        /* HOISTED */
      ), _hoisted_355 = [
        _hoisted_256
      ];
      function _sfc_render56(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock("svg", _hoisted_156, _hoisted_355);
      }
      var close_default = /* @__PURE__ */ export_helper_default(close_vue_vue_type_script_lang_default, [["render", _sfc_render56], ["__file", "close.vue"]]);
      var hide_vue_vue_type_script_lang_default = {
        name: "Hide"
      };
      var _hoisted_1133 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, _hoisted_2133 = /* @__PURE__ */ vue.createElementVNode(
        "path",
        {
          fill: "currentColor",
          d: "M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2L371.2 588.8ZM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z"
        },
        null,
        -1
        /* HOISTED */
      ), _hoisted_3132 = /* @__PURE__ */ vue.createElementVNode(
        "path",
        {
          fill: "currentColor",
          d: "M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z"
        },
        null,
        -1
        /* HOISTED */
      ), _hoisted_438 = [
        _hoisted_2133,
        _hoisted_3132
      ];
      function _sfc_render133(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1133, _hoisted_438);
      }
      var hide_default = /* @__PURE__ */ export_helper_default(hide_vue_vue_type_script_lang_default, [["render", _sfc_render133], ["__file", "hide.vue"]]);
      var loading_vue_vue_type_script_lang_default = {
        name: "Loading"
      };
      var _hoisted_1150 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, _hoisted_2150 = /* @__PURE__ */ vue.createElementVNode(
        "path",
        {
          fill: "currentColor",
          d: "M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
        },
        null,
        -1
        /* HOISTED */
      ), _hoisted_3149 = [
        _hoisted_2150
      ];
      function _sfc_render150(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1150, _hoisted_3149);
      }
      var loading_default = /* @__PURE__ */ export_helper_default(loading_vue_vue_type_script_lang_default, [["render", _sfc_render150], ["__file", "loading.vue"]]);
      var view_vue_vue_type_script_lang_default = {
        name: "View"
      };
      var _hoisted_1283 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, _hoisted_2283 = /* @__PURE__ */ vue.createElementVNode(
        "path",
        {
          fill: "currentColor",
          d: "M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"
        },
        null,
        -1
        /* HOISTED */
      ), _hoisted_3282 = [
        _hoisted_2283
      ];
      function _sfc_render283(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1283, _hoisted_3282);
      }
      var view_default = /* @__PURE__ */ export_helper_default(view_vue_vue_type_script_lang_default, [["render", _sfc_render283], ["__file", "view.vue"]]);
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
            if (hasOwn$2(prop, "default")) {
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
        if (hasOwn$2(prop, "default"))
          epProp.default = defaultValue;
        return epProp;
      };
      const buildProps = (props) => fromPairs(Object.entries(props).map(([key, option2]) => [
        key,
        buildProp(option2, key)
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
      const componentSizeMap = {
        large: 40,
        default: 32,
        small: 24
      };
      const getComponentSize = (size) => {
        return componentSizeMap[size || "default"];
      };
      const isValidComponentSize = (val) => ["", ...componentSizes].includes(val);
      const isFirefox = () => core.isClient && /firefox/i.test(window.navigator.userAgent);
      const isKorean = (text) => /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi.test(text);
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
          var _a;
          return fromPairs(Object.entries((_a = instance.proxy) == null ? void 0 : _a.$attrs).filter(([key]) => !allExcludeKeys.value.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))));
        });
      };
      const useDeprecated = ({ from, replacement, scope, version, ref: ref2, type = "API" }, condition) => {
        vue.watch(() => vue.unref(condition), (val) => {
        }, {
          immediate: true
        });
      };
      const useFocus = (el) => {
        return {
          focus: () => {
            var _a, _b;
            (_b = (_a = el.value) == null ? void 0 : _a.focus) == null ? void 0 : _b.call(_a);
          }
        };
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
      const buildTranslator = (locale) => (path, option2) => translate(path, option2, vue.unref(locale));
      const translate = (path, option2, locale) => get(locale, path, path).replace(/\{(\w+)\}/g, (_, key) => {
        var _a;
        return `${(_a = option2 == null ? void 0 : option2[key]) != null ? _a : `{${key}}`}`;
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
        const derivedNamespace = namespaceOverrides || vue.inject(namespaceContextKey, vue.ref(defaultNamespace));
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
            const shouldEmit = hasUpdateHandler.value && core.isClient;
            if (shouldEmit) {
              emit(updateEventKey, true);
            }
            if (isModelBindingAbsent.value || !shouldEmit) {
              doShow(event);
            }
          };
          const hide = (event) => {
            if (props.disabled === true || !core.isClient)
              return;
            const shouldEmit = hasUpdateHandler.value && core.isClient;
            if (shouldEmit) {
              emit(updateEventKey, false);
            }
            if (isModelBindingAbsent.value || !shouldEmit) {
              doHide(event);
            }
          };
          const onChange = (val) => {
            if (!core.isBoolean(val))
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
          var _a, _b;
          return (_b = (_a = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a.$props) == null ? void 0 : _b[name];
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
          var m = Tt(o.padding, n), v = ke(i), l = f === "y" ? E : P, h = f === "y" ? R : W, p = n.rects.reference[u] + n.rects.reference[f] - a[f] - n.rects.popper[u], g = a[f] - n.rects.reference[f], x = se(i), y = x ? f === "y" ? x.clientHeight || 0 : x.clientWidth || 0 : 0, $ = p / 2 - g / 2, d = m[l], b = y - v[u] - m[h], w = y / 2 - v[u] / 2 + $, O = fe(d, w, b), j = f;
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
        var e, n = t.popper, r = t.popperRect, o = t.placement, i = t.variation, a = t.offsets, s = t.position, f = t.gpuAcceleration, c = t.adaptive, u = t.roundOffsets, m = t.isFixed, v = a.x, l = v === void 0 ? 0 : v, h = a.y, p = h === void 0 ? 0 : h, g = typeof u == "function" ? u({ x: l, y: p }) : { x: l, y: p };
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
        var n = e, r = n.placement, o = r === void 0 ? t.placement : r, i = n.boundary, a = i === void 0 ? Xe : i, s = n.rootBoundary, f = s === void 0 ? je : s, c = n.elementContext, u = c === void 0 ? K : c, m = n.altBoundary, v = m === void 0 ? false : m, l = n.padding, h = l === void 0 ? 0 : l, p = ft(typeof h != "number" ? h : ct(h, G)), g = u === K ? Ye : K, x = t.rects.popper, y = t.elements[v ? g : u], $ = Gt(Q(y) ? y : y.contextElement || I(t.elements.popper), a, f), d = ee(t.elements.reference), b = mt({ reference: d, element: x, strategy: "absolute", placement: o }), w = Te(Object.assign({}, x, b)), O = u === K ? w : d, j = { top: $.top - O.top + p.top, bottom: O.bottom - $.bottom + p.bottom, left: $.left - O.left + p.left, right: O.right - $.right + p.right }, A = t.modifiersData.offset;
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
        var n = e, r = n.placement, o = n.boundary, i = n.rootBoundary, a = n.padding, s = n.flipVariations, f = n.allowedAutoPlacements, c = f === void 0 ? Ee : f, u = te(r), m = u ? s ? De : De.filter(function(h) {
          return te(h) === u;
        }) : G, v = m.filter(function(h) {
          return c.indexOf(h) >= 0;
        });
        v.length === 0 && (v = m);
        var l = v.reduce(function(h, p) {
          return h[p] = ne(t, { placement: p, boundary: o, rootBoundary: i, padding: a })[q(p)], h;
        }, {});
        return Object.keys(l).sort(function(h, p) {
          return l[h] - l[p];
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
          for (var o = n.mainAxis, i = o === void 0 ? true : o, a = n.altAxis, s = a === void 0 ? true : a, f = n.fallbackPlacements, c = n.padding, u = n.boundary, m = n.rootBoundary, v = n.altBoundary, l = n.flipVariations, h = l === void 0 ? true : l, p = n.allowedAutoPlacements, g = e.options.placement, x = q(g), y = x === g, $ = f || (y || !h ? [be(g)] : Kt(g)), d = [g].concat($).reduce(function(z, V) {
            return z.concat(q(V) === me ? Jt(e, { placement: V, boundary: u, rootBoundary: m, padding: c, flipVariations: h, allowedAutoPlacements: p }) : V);
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
            for (var ue = h ? 3 : 1, xe = function(z) {
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
        var e = t.state, n = t.options, r = t.name, o = n.mainAxis, i = o === void 0 ? true : o, a = n.altAxis, s = a === void 0 ? false : a, f = n.boundary, c = n.rootBoundary, u = n.altBoundary, m = n.padding, v = n.tether, l = v === void 0 ? true : v, h = n.tetherOffset, p = h === void 0 ? 0 : h, g = ne(e, { boundary: f, rootBoundary: c, padding: m, altBoundary: u }), x = q(e.placement), y = te(e.placement), $ = !y, d = Le(x), b = rn(d), w = e.modifiersData.popperOffsets, O = e.rects.reference, j = e.rects.popper, A = typeof p == "function" ? p(Object.assign({}, e.rects, { placement: e.placement })) : p, k = typeof A == "number" ? { mainAxis: A, altAxis: A } : Object.assign({ mainAxis: 0, altAxis: 0 }, A), D = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, S = { x: 0, y: 0 };
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
            h(), c.options = Object.assign({}, i, c.options, g), c.scrollParents = { reference: Q(a) ? ce(a) : a.contextElement ? ce(a.contextElement) : [], popper: ce(s) };
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
            h(), m = true;
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
          function h() {
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
            var _a;
            return { ...((_a = vue.unref(instanceRef)) == null ? void 0 : _a.state) || {} };
          }),
          styles: vue.computed(() => vue.unref(states).styles),
          attributes: vue.computed(() => vue.unref(states).attributes),
          update: () => {
            var _a;
            return (_a = vue.unref(instanceRef)) == null ? void 0 : _a.update();
          },
          forceUpdate: () => {
            var _a;
            return (_a = vue.unref(instanceRef)) == null ? void 0 : _a.forceUpdate();
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
        core.tryOnScopeDispose(() => cancelTimeout());
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
          if (core.isClient)
            registeredEscapeHandlers.push(handler);
        });
        vue.onBeforeUnmount(() => {
          registeredEscapeHandlers = registeredEscapeHandlers.filter((registeredHandler) => registeredHandler !== handler);
          if (registeredEscapeHandlers.length === 0) {
            if (core.isClient)
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
        const container2 = document.createElement("div");
        container2.id = id;
        document.body.appendChild(container2);
        return container2;
      };
      const usePopperContainer = () => {
        const { id, selector } = usePopperContainerId();
        vue.onBeforeMount(() => {
          if (!core.isClient)
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
            if (core.isNumber(_autoClose) && _autoClose > 0) {
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
      const zIndex = vue.ref(0);
      const defaultInitialZIndex = 2e3;
      const zIndexContextKey = Symbol("zIndexContextKey");
      const useZIndex = (zIndexOverrides) => {
        const zIndexInjection = zIndexOverrides || vue.inject(zIndexContextKey, void 0);
        const initialZIndex = vue.computed(() => {
          const zIndexFromInjection = vue.unref(zIndexInjection);
          return core.isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
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
      function useCursor(input2) {
        const selectionRef = vue.ref();
        function recordCursor() {
          if (input2.value == void 0)
            return;
          const { selectionStart, selectionEnd, value } = input2.value;
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
          if (input2.value == void 0 || selectionRef.value == void 0)
            return;
          const { value } = input2.value;
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
          input2.value.setSelectionRange(startPos, startPos);
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
      const configProviderContextKey = Symbol();
      const globalConfig = vue.ref();
      function useGlobalConfig(key, defaultValue = void 0) {
        const config = vue.getCurrentInstance() ? vue.inject(configProviderContextKey, globalConfig) : globalConfig;
        if (key) {
          return vue.computed(() => {
            var _a, _b;
            return (_b = (_a = config.value) == null ? void 0 : _a[key]) != null ? _b : defaultValue;
          });
        } else {
          return config;
        }
      }
      const provideGlobalConfig = (config, app2, global2 = false) => {
        var _a;
        const inSetup = !!vue.getCurrentInstance();
        const oldConfig = inSetup ? useGlobalConfig() : void 0;
        const provideFn = (_a = app2 == null ? void 0 : app2.provide) != null ? _a : inSetup ? vue.provide : void 0;
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
        var _a;
        const keys2 = [.../* @__PURE__ */ new Set([...keysOf(a), ...keysOf(b)])];
        const obj = {};
        for (const key of keys2) {
          obj[key] = (_a = b[key]) != null ? _a : a[key];
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
      const ConfigProvider = vue.defineComponent({
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
      const ElConfigProvider = withInstall(ConfigProvider);
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
      const __default__$f = vue.defineComponent({
        name: "ElIcon",
        inheritAttrs: false
      });
      const _sfc_main$p = /* @__PURE__ */ vue.defineComponent({
        ...__default__$f,
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
      var Icon = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/icon/src/icon.vue"]]);
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
          var _a;
          return !!(!props.label && formItemContext && formItemContext.inputIds && ((_a = formItemContext.inputIds) == null ? void 0 : _a.length) <= 1);
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
        const style = window.getComputedStyle(targetElement);
        const boxSizing = style.getPropertyValue("box-sizing");
        const paddingSize = Number.parseFloat(style.getPropertyValue("padding-bottom")) + Number.parseFloat(style.getPropertyValue("padding-top"));
        const borderSize = Number.parseFloat(style.getPropertyValue("border-bottom-width")) + Number.parseFloat(style.getPropertyValue("border-top-width"));
        const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style.getPropertyValue(name)}`).join(";");
        return { contextStyle, paddingSize, borderSize, boxSizing };
      }
      function calcTextareaHeight(targetElement, minRows = 1, maxRows) {
        var _a;
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
        if (core.isNumber(minRows)) {
          let minHeight = singleRowHeight * minRows;
          if (boxSizing === "border-box") {
            minHeight = minHeight + paddingSize + borderSize;
          }
          height = Math.max(minHeight, height);
          result.minHeight = `${minHeight}px`;
        }
        if (core.isNumber(maxRows)) {
          let maxHeight = singleRowHeight * maxRows;
          if (boxSizing === "border-box") {
            maxHeight = maxHeight + paddingSize + borderSize;
          }
          height = Math.min(maxHeight, height);
        }
        result.height = `${height}px`;
        (_a = hiddenTextarea.parentNode) == null ? void 0 : _a.removeChild(hiddenTextarea);
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
        }
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
      const _hoisted_2$4 = ["id", "type", "disabled", "formatter", "parser", "readonly", "autocomplete", "tabindex", "aria-label", "placeholder", "form"];
      const _hoisted_3$2 = ["id", "tabindex", "disabled", "readonly", "autocomplete", "aria-label", "placeholder", "form"];
      const __default__$e = vue.defineComponent({
        name: "ElInput",
        inheritAttrs: false
      });
      const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
        ...__default__$e,
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
              [nsInput.bm("suffix", "password-clear")]: showClear.value && showPwdVisible.value
            },
            rawAttrs.class
          ]);
          const wrapperKls = vue.computed(() => [
            nsInput.e("wrapper"),
            nsInput.is("focus", focused.value)
          ]);
          const attrs = useAttrs({
            excludeKeys: vue.computed(() => {
              return Object.keys(containerAttrs.value);
            })
          });
          const { form, formItem } = useFormItem();
          const { inputId } = useFormItemInputId(props, {
            formItemContext: formItem
          });
          const inputSize = useFormSize();
          const inputDisabled = useFormDisabled();
          const nsInput = useNamespace("input");
          const nsTextarea = useNamespace("textarea");
          const input2 = vue.shallowRef();
          const textarea = vue.shallowRef();
          const focused = vue.ref(false);
          const hovering = vue.ref(false);
          const isComposing = vue.ref(false);
          const passwordVisible = vue.ref(false);
          const countStyle = vue.ref();
          const textareaCalcStyle = vue.shallowRef(props.inputStyle);
          const _ref = vue.computed(() => input2.value || textarea.value);
          const needStatusIcon = vue.computed(() => {
            var _a;
            return (_a = form == null ? void 0 : form.statusIcon) != null ? _a : false;
          });
          const validateState = vue.computed(() => (formItem == null ? void 0 : formItem.validateState) || "");
          const validateIcon = vue.computed(() => validateState.value && ValidateComponentsMap[validateState.value]);
          const passwordIcon = vue.computed(() => passwordVisible.value ? view_default : hide_default);
          const containerStyle = vue.computed(() => [
            rawAttrs.style,
            props.inputStyle
          ]);
          const textareaStyle = vue.computed(() => [
            props.inputStyle,
            textareaCalcStyle.value,
            { resize: props.resize }
          ]);
          const nativeInputValue = vue.computed(() => isNil(props.modelValue) ? "" : String(props.modelValue));
          const showClear = vue.computed(() => props.clearable && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (focused.value || hovering.value));
          const showPwdVisible = vue.computed(() => props.showPassword && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (!!nativeInputValue.value || focused.value));
          const isWordLimitVisible = vue.computed(() => props.showWordLimit && !!attrs.value.maxlength && (props.type === "text" || props.type === "textarea") && !inputDisabled.value && !props.readonly && !props.showPassword);
          const textLength = vue.computed(() => nativeInputValue.value.length);
          const inputExceed = vue.computed(() => !!isWordLimitVisible.value && textLength.value > Number(attrs.value.maxlength));
          const suffixVisible = vue.computed(() => !!slots.suffix || !!props.suffixIcon || showClear.value || props.showPassword || isWordLimitVisible.value || !!validateState.value && needStatusIcon.value);
          const [recordCursor, setCursor] = useCursor(input2);
          core.useResizeObserver(textarea, (entries) => {
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
            if (!core.isClient || type !== "textarea" || !textarea.value)
              return;
            if (autosize) {
              const minRows = isObject$1(autosize) ? autosize.minRows : void 0;
              const maxRows = isObject$1(autosize) ? autosize.maxRows : void 0;
              textareaCalcStyle.value = {
                ...calcTextareaHeight(textarea.value, minRows, maxRows)
              };
            } else {
              textareaCalcStyle.value = {
                minHeight: calcTextareaHeight(textarea.value).minHeight
              };
            }
          };
          const setNativeInputValue = () => {
            const input22 = _ref.value;
            if (!input22 || input22.value === nativeInputValue.value)
              return;
            input22.value = nativeInputValue.value;
          };
          const handleInput = async (event) => {
            recordCursor();
            let { value } = event.target;
            if (props.formatter) {
              value = props.parser ? props.parser(value) : value;
              value = props.formatter(value);
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
            var _a;
            emit("compositionupdate", event);
            const text = (_a = event.target) == null ? void 0 : _a.value;
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
            var _a;
            await vue.nextTick();
            (_a = _ref.value) == null ? void 0 : _a.focus();
          };
          const blur = () => {
            var _a;
            return (_a = _ref.value) == null ? void 0 : _a.blur();
          };
          const handleFocus = (event) => {
            focused.value = true;
            emit("focus", event);
          };
          const handleBlur = (event) => {
            var _a;
            focused.value = false;
            emit("blur", event);
            if (props.validateEvent) {
              (_a = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a.call(formItem, "blur").catch((err) => debugWarn());
            }
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
          const select2 = () => {
            var _a;
            (_a = _ref.value) == null ? void 0 : _a.select();
          };
          const clear = () => {
            emit(UPDATE_MODEL_EVENT, "");
            emit("change", "");
            emit("clear");
            emit("input", "");
          };
          vue.watch(() => props.modelValue, () => {
            var _a;
            vue.nextTick(() => resizeTextarea());
            if (props.validateEvent) {
              (_a = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a.call(formItem, "change").catch((err) => debugWarn());
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
            input: input2,
            textarea,
            ref: _ref,
            textareaStyle,
            autosize: vue.toRef(props, "autosize"),
            focus,
            blur,
            select: select2,
            clear,
            resizeTextarea
          });
          return (_ctx, _cache) => {
            return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(vue.unref(containerAttrs), {
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
                  class: vue.normalizeClass(vue.unref(wrapperKls))
                }, [
                  vue.createCommentVNode(" prefix slot "),
                  _ctx.$slots.prefix || _ctx.prefixIcon ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(nsInput).e("prefix"))
                  }, [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(vue.unref(nsInput).e("prefix-inner")),
                      onClick: focus
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
                    ref: input2,
                    class: vue.unref(nsInput).e("inner")
                  }, vue.unref(attrs), {
                    type: _ctx.showPassword ? passwordVisible.value ? "text" : "password" : _ctx.type,
                    disabled: vue.unref(inputDisabled),
                    formatter: _ctx.formatter,
                    parser: _ctx.parser,
                    readonly: _ctx.readonly,
                    autocomplete: _ctx.autocomplete,
                    tabindex: _ctx.tabindex,
                    "aria-label": _ctx.label,
                    placeholder: _ctx.placeholder,
                    style: _ctx.inputStyle,
                    form: props.form,
                    onCompositionstart: handleCompositionStart,
                    onCompositionupdate: handleCompositionUpdate,
                    onCompositionend: handleCompositionEnd,
                    onInput: handleInput,
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                    onChange: handleChange,
                    onKeydown: handleKeydown
                  }), null, 16, _hoisted_2$4),
                  vue.createCommentVNode(" suffix slot "),
                  vue.unref(suffixVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 1,
                    class: vue.normalizeClass(vue.unref(nsInput).e("suffix"))
                  }, [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(vue.unref(nsInput).e("suffix-inner")),
                      onClick: focus
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
                        }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(vue.unref(attrs).maxlength), 3)
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
                  tabindex: _ctx.tabindex,
                  disabled: vue.unref(inputDisabled),
                  readonly: _ctx.readonly,
                  autocomplete: _ctx.autocomplete,
                  style: vue.unref(textareaStyle),
                  "aria-label": _ctx.label,
                  placeholder: _ctx.placeholder,
                  form: props.form,
                  onCompositionstart: handleCompositionStart,
                  onCompositionupdate: handleCompositionUpdate,
                  onCompositionend: handleCompositionEnd,
                  onInput: handleInput,
                  onFocus: handleFocus,
                  onBlur: handleBlur,
                  onChange: handleChange,
                  onKeydown: handleKeydown
                }), null, 16, _hoisted_3$2),
                vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  style: vue.normalizeStyle(countStyle.value),
                  class: vue.normalizeClass(vue.unref(nsInput).e("count"))
                }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(vue.unref(attrs).maxlength), 7)) : vue.createCommentVNode("v-if", true)
              ], 64))
            ], 16, _hoisted_1$6)), [
              [vue.vShow, _ctx.type !== "hidden"]
            ]);
          };
        }
      });
      var Input = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/input/src/input.vue"]]);
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
      const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
        __name: "thumb",
        props: thumbProps,
        setup(__props) {
          const props = __props;
          const scrollbar2 = vue.inject(scrollbarContextKey);
          const ns = useNamespace("scrollbar");
          if (!scrollbar2)
            throwError(COMPONENT_NAME$2, "can not inject scrollbar context");
          const instance = vue.ref();
          const thumb = vue.ref();
          const thumbState = vue.ref({});
          const visible = vue.ref(false);
          let cursorDown = false;
          let cursorLeave = false;
          let originalOnSelectStart = core.isClient ? document.onselectstart : null;
          const bar = vue.computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"]);
          const thumbStyle = vue.computed(() => renderThumbStyle({
            size: props.size,
            move: props.move,
            bar: bar.value
          }));
          const offsetRatio = vue.computed(() => instance.value[bar.value.offset] ** 2 / scrollbar2.wrapElement[bar.value.scrollSize] / props.ratio / thumb.value[bar.value.offset]);
          const clickThumbHandler = (e) => {
            var _a;
            e.stopPropagation();
            if (e.ctrlKey || [1, 2].includes(e.button))
              return;
            (_a = window.getSelection()) == null ? void 0 : _a.removeAllRanges();
            startDrag(e);
            const el = e.currentTarget;
            if (!el)
              return;
            thumbState.value[bar.value.axis] = el[bar.value.offset] - (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction]);
          };
          const clickTrackHandler = (e) => {
            if (!thumb.value || !instance.value || !scrollbar2.wrapElement)
              return;
            const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
            const thumbHalf = thumb.value[bar.value.offset] / 2;
            const thumbPositionPercentage = (offset - thumbHalf) * 100 * offsetRatio.value / instance.value[bar.value.offset];
            scrollbar2.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar2.wrapElement[bar.value.scrollSize] / 100;
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
            scrollbar2.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar2.wrapElement[bar.value.scrollSize] / 100;
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
          core.useEventListener(vue.toRef(scrollbar2, "scrollbarElement"), "mousemove", mouseMoveScrollbarHandler);
          core.useEventListener(vue.toRef(scrollbar2, "scrollbarElement"), "mouseleave", mouseLeaveScrollbarHandler);
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
      var Thumb = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/thumb.vue"]]);
      const barProps = buildProps({
        always: {
          type: Boolean,
          default: true
        },
        width: String,
        height: String,
        ratioX: {
          type: Number,
          default: 1
        },
        ratioY: {
          type: Number,
          default: 1
        }
      });
      const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
        __name: "bar",
        props: barProps,
        setup(__props, { expose }) {
          const props = __props;
          const moveX = vue.ref(0);
          const moveY = vue.ref(0);
          const handleScroll = (wrap) => {
            if (wrap) {
              const offsetHeight = wrap.offsetHeight - GAP;
              const offsetWidth = wrap.offsetWidth - GAP;
              moveY.value = wrap.scrollTop * 100 / offsetHeight * props.ratioY;
              moveX.value = wrap.scrollLeft * 100 / offsetWidth * props.ratioX;
            }
          };
          expose({
            handleScroll
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
              vue.createVNode(Thumb, {
                move: moveX.value,
                ratio: _ctx.ratioX,
                size: _ctx.width,
                always: _ctx.always
              }, null, 8, ["move", "ratio", "size", "always"]),
              vue.createVNode(Thumb, {
                move: moveY.value,
                ratio: _ctx.ratioY,
                size: _ctx.height,
                vertical: "",
                always: _ctx.always
              }, null, 8, ["move", "ratio", "size", "always"])
            ], 64);
          };
        }
      });
      var Bar = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/bar.vue"]]);
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
        }
      });
      const scrollbarEmits = {
        scroll: ({
          scrollTop,
          scrollLeft
        }) => [scrollTop, scrollLeft].every(core.isNumber)
      };
      const COMPONENT_NAME$1 = "ElScrollbar";
      const __default__$d = vue.defineComponent({
        name: COMPONENT_NAME$1
      });
      const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
        ...__default__$d,
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
          const sizeWidth = vue.ref("0");
          const sizeHeight = vue.ref("0");
          const barRef = vue.ref();
          const ratioY = vue.ref(1);
          const ratioX = vue.ref(1);
          const style = vue.computed(() => {
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
            var _a;
            if (wrapRef.value) {
              (_a = barRef.value) == null ? void 0 : _a.handleScroll(wrapRef.value);
              emit("scroll", {
                scrollTop: wrapRef.value.scrollTop,
                scrollLeft: wrapRef.value.scrollLeft
              });
            }
          };
          function scrollTo(arg1, arg2) {
            if (isObject$1(arg1)) {
              wrapRef.value.scrollTo(arg1);
            } else if (core.isNumber(arg1) && core.isNumber(arg2)) {
              wrapRef.value.scrollTo(arg1, arg2);
            }
          }
          const setScrollTop = (value) => {
            if (!core.isNumber(value)) {
              return;
            }
            wrapRef.value.scrollTop = value;
          };
          const setScrollLeft = (value) => {
            if (!core.isNumber(value)) {
              return;
            }
            wrapRef.value.scrollLeft = value;
          };
          const update = () => {
            if (!wrapRef.value)
              return;
            const offsetHeight = wrapRef.value.offsetHeight - GAP;
            const offsetWidth = wrapRef.value.offsetWidth - GAP;
            const originalHeight = offsetHeight ** 2 / wrapRef.value.scrollHeight;
            const originalWidth = offsetWidth ** 2 / wrapRef.value.scrollWidth;
            const height = Math.max(originalHeight, props.minSize);
            const width = Math.max(originalWidth, props.minSize);
            ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
            ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));
            sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : "";
            sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : "";
          };
          vue.watch(() => props.noresize, (noresize) => {
            if (noresize) {
              stopResizeObserver == null ? void 0 : stopResizeObserver();
              stopResizeListener == null ? void 0 : stopResizeListener();
            } else {
              ({ stop: stopResizeObserver } = core.useResizeObserver(resizeRef, update));
              stopResizeListener = core.useEventListener("resize", update);
            }
          }, { immediate: true });
          vue.watch(() => [props.maxHeight, props.height], () => {
            if (!props.native)
              vue.nextTick(() => {
                var _a;
                update();
                if (wrapRef.value) {
                  (_a = barRef.value) == null ? void 0 : _a.handleScroll(wrapRef.value);
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
                style: vue.normalizeStyle(vue.unref(style)),
                onScroll: handleScroll
              }, [
                (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
                  ref_key: "resizeRef",
                  ref: resizeRef,
                  class: vue.normalizeClass(vue.unref(resizeKls)),
                  style: vue.normalizeStyle(_ctx.viewStyle)
                }, {
                  default: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "default")
                  ]),
                  _: 3
                }, 8, ["class", "style"]))
              ], 38),
              !_ctx.native ? (vue.openBlock(), vue.createBlock(Bar, {
                key: 0,
                ref_key: "barRef",
                ref: barRef,
                height: sizeHeight.value,
                width: sizeWidth.value,
                always: _ctx.always,
                "ratio-x": ratioX.value,
                "ratio-y": ratioY.value
              }, null, 8, ["height", "width", "always", "ratio-x", "ratio-y"])) : vue.createCommentVNode("v-if", true)
            ], 2);
          };
        }
      });
      var Scrollbar = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/scrollbar.vue"]]);
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
      const __default__$c = vue.defineComponent({
        name: "ElPopper",
        inheritAttrs: false
      });
      const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
        ...__default__$c,
        props: popperProps,
        setup(__props, { expose }) {
          const props = __props;
          const triggerRef2 = vue.ref();
          const popperInstanceRef = vue.ref();
          const contentRef = vue.ref();
          const referenceRef = vue.ref();
          const role = vue.computed(() => props.role);
          const popperProvides = {
            triggerRef: triggerRef2,
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
      var Popper = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/popper/src/popper.vue"]]);
      const popperArrowProps = buildProps({
        arrowOffset: {
          type: Number,
          default: 5
        }
      });
      const __default__$b = vue.defineComponent({
        name: "ElPopperArrow",
        inheritAttrs: false
      });
      const _sfc_main$j = /* @__PURE__ */ vue.defineComponent({
        ...__default__$b,
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
      var ElPopperArrow = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/popper/src/arrow.vue"]]);
      const NAME = "ElOnlyChild";
      const OnlyChild = vue.defineComponent({
        name: NAME,
        setup(_, {
          slots,
          attrs
        }) {
          var _a;
          const forwardRefInjection = vue.inject(FORWARD_REF_INJECTION_KEY);
          const forwardRefDirective = useForwardRefDirective((_a = forwardRefInjection == null ? void 0 : forwardRefInjection.setForwardRef) != null ? _a : NOOP);
          return () => {
            var _a2;
            const defaultSlot = (_a2 = slots.default) == null ? void 0 : _a2.call(slots, attrs);
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
      const __default__$a = vue.defineComponent({
        name: "ElPopperTrigger",
        inheritAttrs: false
      });
      const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
        ...__default__$a,
        props: popperTriggerProps,
        setup(__props, { expose }) {
          const props = __props;
          const { role, triggerRef: triggerRef2 } = vue.inject(POPPER_INJECTION_KEY, void 0);
          useForwardRef(triggerRef2);
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
                triggerRef2.value = core.unrefElement(virtualEl);
              }
            }, {
              immediate: true
            });
            vue.watch(triggerRef2, (el, prevEl) => {
              virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
              virtualTriggerAriaStopWatch = void 0;
              if (isElement$1(el)) {
                [
                  "onMouseenter",
                  "onMouseleave",
                  "onClick",
                  "onKeydown",
                  "onFocus",
                  "onBlur",
                  "onContextmenu"
                ].forEach((eventName) => {
                  var _a;
                  const handler = props[eventName];
                  if (handler) {
                    el.addEventListener(eventName.slice(2).toLowerCase(), handler);
                    (_a = prevEl == null ? void 0 : prevEl.removeEventListener) == null ? void 0 : _a.call(prevEl, eventName.slice(2).toLowerCase(), handler);
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
              if (isElement$1(prevEl)) {
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
            triggerRef: triggerRef2
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
      var ElPopperTrigger = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/popper/src/trigger.vue"]]);
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
      const getVisibleElement = (elements, container2) => {
        for (const element of elements) {
          if (!isHidden(element, container2))
            return element;
        }
      };
      const isHidden = (element, container2) => {
        if (getComputedStyle(element).visibility === "hidden")
          return true;
        while (element) {
          if (container2 && element === container2)
            return false;
          if (getComputedStyle(element).display === "none")
            return true;
          element = element.parentElement;
        }
        return false;
      };
      const getEdges = (container2) => {
        const focusable = obtainAllFocusableElements(container2);
        const first = getVisibleElement(focusable, container2);
        const last = getVisibleElement(focusable.reverse(), container2);
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
        const push2 = (layer) => {
          const currentLayer = stack[0];
          if (currentLayer && layer !== currentLayer) {
            currentLayer.pause();
          }
          stack = removeFromStack(stack, layer);
          stack.unshift(layer);
        };
        const remove = (layer) => {
          var _a, _b;
          stack = removeFromStack(stack, layer);
          (_b = (_a = stack[0]) == null ? void 0 : _a.resume) == null ? void 0 : _b.call(_a);
        };
        return {
          push: push2,
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
      const _sfc_main$h = vue.defineComponent({
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
              const container2 = currentTarget;
              const [first, last] = getEdges(container2);
              const isTabbable = first && last;
              if (!isTabbable) {
                if (currentFocusingEl === container2) {
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
                } else if (shiftKey && [first, container2].includes(currentFocusingEl)) {
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
              trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, trapOnFocus);
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
      var ElFocusTrap = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$4], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/focus-trap/src/focus-trap.vue"]]);
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
        if (!core.isClient)
          return;
        return core.unrefElement($el);
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
        const { popperInstanceRef, contentRef, triggerRef: triggerRef2, role } = vue.inject(POPPER_INJECTION_KEY, void 0);
        const arrowRef = vue.ref();
        const arrowOffset = vue.ref();
        const eventListenerModifier = vue.computed(() => {
          return {
            name: "eventListeners",
            enabled: !!props.visible
          };
        });
        const arrowModifier = vue.computed(() => {
          var _a;
          const arrowEl = vue.unref(arrowRef);
          const offset = (_a = vue.unref(arrowOffset)) != null ? _a : DEFAULT_ARROW_OFFSET;
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
        const computedReference = vue.computed(() => unwrapMeasurableEl(props.referenceEl) || vue.unref(triggerRef2));
        const { attributes, state, styles, update, forceUpdate, instanceRef } = usePopper(computedReference, contentRef, options);
        vue.watch(instanceRef, (instance) => popperInstanceRef.value = instance);
        vue.onMounted(() => {
          vue.watch(() => {
            var _a;
            return (_a = vue.unref(computedReference)) == null ? void 0 : _a.getBoundingClientRect();
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
        const contentZIndex = vue.ref(props.zIndex || nextZIndex());
        const contentClass = vue.computed(() => [
          ns.b(),
          ns.is("pure", props.pure),
          ns.is(props.effect),
          props.popperClass
        ]);
        const contentStyle = vue.computed(() => {
          return [
            { zIndex: vue.unref(contentZIndex) },
            props.popperStyle || {},
            vue.unref(styles).popper
          ];
        });
        const ariaModal = vue.computed(() => role.value === "dialog" ? "false" : void 0);
        const arrowStyle = vue.computed(() => vue.unref(styles).arrow || {});
        const updateZIndex = () => {
          contentZIndex.value = props.zIndex || nextZIndex();
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
          var _a;
          if (((_a = event.detail) == null ? void 0 : _a.focusReason) !== "pointer") {
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
      const __default__$9 = vue.defineComponent({
        name: "ElPopperContent"
      });
      const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
        ...__default__$9,
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
              if (isElement$1(el)) {
                triggerTargetAriaStopWatch = vue.watch([role, () => props.ariaLabel, ariaModal, () => props.id], (watches) => {
                  ["role", "aria-label", "aria-modal", "id"].forEach((key, idx) => {
                    isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
                  });
                }, { immediate: true });
              }
              if (prevEl !== el && isElement$1(prevEl)) {
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
      var ElPopperContent = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/popper/src/content.vue"]]);
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
        if (isArray$6(trigger)) {
          return trigger.includes(type);
        }
        return trigger === type;
      };
      const whenTrigger = (trigger, type, handler) => {
        return (e) => {
          isTriggerType(vue.unref(trigger), type) && handler(e);
        };
      };
      const __default__$8 = vue.defineComponent({
        name: "ElTooltipTrigger"
      });
      const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
        ...__default__$8,
        props: useTooltipTriggerProps,
        setup(__props, { expose }) {
          const props = __props;
          const ns = useNamespace("tooltip");
          const { controlled, id, open, onOpen, onClose, onToggle } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
          const triggerRef2 = vue.ref(null);
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
            triggerRef: triggerRef2
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
      var ElTooltipTrigger = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/tooltip/src/trigger.vue"]]);
      const __default__$7 = vue.defineComponent({
        name: "ElTooltipContent",
        inheritAttrs: false
      });
      const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
        ...__default__$7,
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
            var _a;
            return (_a = props.style) != null ? _a : {};
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
            var _a, _b;
            (_b = (_a = contentRef.value) == null ? void 0 : _a.updatePopper) == null ? void 0 : _b.call(_a);
            onBeforeShow == null ? void 0 : onBeforeShow();
          };
          const onBeforeLeave = () => {
            onBeforeHide == null ? void 0 : onBeforeHide();
          };
          const onAfterShow = () => {
            onShow();
            stopHandle = core.onClickOutside(vue.computed(() => {
              var _a;
              return (_a = contentRef.value) == null ? void 0 : _a.popperContentRef;
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
            var _a, _b;
            (_b = (_a = contentRef.value) == null ? void 0 : _a.updatePopper) == null ? void 0 : _b.call(_a);
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
      var ElTooltipContent = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/tooltip/src/content.vue"]]);
      const _hoisted_1$5 = ["innerHTML"];
      const _hoisted_2$3 = { key: 1 };
      const __default__$6 = vue.defineComponent({
        name: "ElTooltip"
      });
      const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
        ...__default__$6,
        props: useTooltipProps,
        emits: tooltipEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          usePopperContainer();
          const id = useId();
          const popperRef = vue.ref();
          const contentRef = vue.ref();
          const updatePopper = () => {
            var _a;
            const popperComponent = vue.unref(popperRef);
            if (popperComponent) {
              (_a = popperComponent.popperInstanceRef) == null ? void 0 : _a.update();
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
          const controlled = vue.computed(() => core.isBoolean(props.visible) && !hasUpdateHandler.value);
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
          const isFocusInsideContent = () => {
            var _a, _b;
            const popperContent = (_b = (_a = contentRef.value) == null ? void 0 : _a.contentRef) == null ? void 0 : _b.popperContentRef;
            return popperContent && popperContent.contains(document.activeElement);
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
      var Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/tooltip/src/tooltip.vue"]]);
      const ElTooltip = withInstall(Tooltip);
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
          var _a, _b, _c;
          return (_c = (_b = props.autoInsertSpace) != null ? _b : (_a = globalConfig2.value) == null ? void 0 : _a.autoInsertSpace) != null ? _c : false;
        });
        const shouldAddSpace = vue.computed(() => {
          var _a;
          const defaultSlot = (_a = slots.default) == null ? void 0 : _a.call(slots);
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
        var h = 0;
        var s = 0;
        var l = (max + min) / 2;
        if (max === min) {
          s = 0;
          h = 0;
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }
        return { h, s, l };
      }
      function hue2rgb(p, q2, t) {
        if (t < 0) {
          t += 1;
        }
        if (t > 1) {
          t -= 1;
        }
        if (t < 1 / 6) {
          return p + (q2 - p) * (6 * t);
        }
        if (t < 1 / 2) {
          return q2;
        }
        if (t < 2 / 3) {
          return p + (q2 - p) * (2 / 3 - t) * 6;
        }
        return p;
      }
      function hslToRgb(h, s, l) {
        var r;
        var g;
        var b;
        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);
        if (s === 0) {
          g = l;
          b = l;
          r = l;
        } else {
          var q2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q2;
          r = hue2rgb(p, q2, h + 1 / 3);
          g = hue2rgb(p, q2, h);
          b = hue2rgb(p, q2, h - 1 / 3);
        }
        return { r: r * 255, g: g * 255, b: b * 255 };
      }
      function rgbToHsv(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h = 0;
        var v = max;
        var d = max - min;
        var s = max === 0 ? 0 : d / max;
        if (max === min) {
          h = 0;
        } else {
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }
        return { h, s, v };
      }
      function hsvToRgb(h, s, v) {
        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);
        var i = Math.floor(h);
        var f = h - i;
        var p = v * (1 - s);
        var q2 = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        var mod = i % 6;
        var r = [v, q2, p, p, t, v][mod];
        var g = [t, v, v, q2, p, p][mod];
        var b = [p, p, t, v, v, q2][mod];
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
      function convertHexToDecimal(h) {
        return parseIntFromHex(h) / 255;
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
            var _a;
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
            this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
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
            var R2;
            var G2;
            var B2;
            var RsRGB = rgb.r / 255;
            var GsRGB = rgb.g / 255;
            var BsRGB = rgb.b / 255;
            if (RsRGB <= 0.03928) {
              R2 = RsRGB / 12.92;
            } else {
              R2 = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
            }
            if (GsRGB <= 0.03928) {
              G2 = GsRGB / 12.92;
            } else {
              G2 = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
            }
            if (BsRGB <= 0.03928) {
              B2 = BsRGB / 12.92;
            } else {
              B2 = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
            }
            return 0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2;
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
            var h = Math.round(hsv.h * 360);
            var s = Math.round(hsv.s * 100);
            var v = Math.round(hsv.v * 100);
            return this.a === 1 ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
          };
          TinyColor2.prototype.toHsl = function() {
            var hsl = rgbToHsl(this.r, this.g, this.b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
          };
          TinyColor2.prototype.toHslString = function() {
            var hsl = rgbToHsl(this.r, this.g, this.b);
            var h = Math.round(hsl.h * 360);
            var s = Math.round(hsl.s * 100);
            var l = Math.round(hsl.l * 100);
            return this.a === 1 ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
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
            for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
              var _b = _a[_i], key = _b[0], value = _b[1];
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
            var h = hsv.h;
            var s = hsv.s;
            var v = hsv.v;
            var res = [];
            var modification = 1 / results;
            while (results--) {
              res.push(new TinyColor2({ h, s, v }));
              v = (v + modification) % 1;
            }
            return res;
          };
          TinyColor2.prototype.splitcomplement = function() {
            var hsl = this.toHsl();
            var h = hsl.h;
            return [
              this,
              new TinyColor2({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
              new TinyColor2({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })
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
            var h = hsl.h;
            var result = [this];
            var increment = 360 / n;
            for (var i = 1; i < n; i++) {
              result.push(new TinyColor2({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
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
      const _hoisted_1$4 = ["aria-disabled", "disabled", "autofocus", "type"];
      const __default__$5 = vue.defineComponent({
        name: "ElButton"
      });
      const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
        ...__default__$5,
        props: buttonProps,
        emits: buttonEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const buttonStyle = useButtonCustomStyle(props);
          const ns = useNamespace("button");
          const { _ref, _size, _type, _disabled, shouldAddSpace, handleClick } = useButton(props, emit);
          expose({
            ref: _ref,
            size: _size,
            type: _type,
            disabled: _disabled,
            shouldAddSpace
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("button", {
              ref_key: "_ref",
              ref: _ref,
              class: vue.normalizeClass([
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
              ]),
              "aria-disabled": vue.unref(_disabled) || _ctx.loading,
              disabled: vue.unref(_disabled) || _ctx.loading,
              autofocus: _ctx.autofocus,
              type: _ctx.nativeType,
              style: vue.normalizeStyle(vue.unref(buttonStyle)),
              onClick: _cache[0] || (_cache[0] = (...args) => vue.unref(handleClick) && vue.unref(handleClick)(...args))
            }, [
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
            ], 14, _hoisted_1$4);
          };
        }
      });
      var Button = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/button/src/button.vue"]]);
      const buttonGroupProps = {
        size: buttonProps.size,
        type: buttonProps.type
      };
      const __default__$4 = vue.defineComponent({
        name: "ElButtonGroup"
      });
      const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
        ...__default__$4,
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
      var ButtonGroup = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/button/src/button-group.vue"]]);
      const ElButton = withInstall(Button, {
        ButtonGroup
      });
      withNoopInstall(ButtonGroup);
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
              var args = [null];
              args.push.apply(args, arguments);
              var Ctor = Function.bind.apply(f, args);
              return new Ctor();
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
      const nodeList = /* @__PURE__ */ new Map();
      let startClick;
      if (core.isClient) {
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
        } else if (isElement$1(binding.arg)) {
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
      const checkboxProps = {
        modelValue: {
          type: [Number, String, Boolean],
          default: void 0
        },
        label: {
          type: [String, Boolean, Number, Object]
        },
        indeterminate: Boolean,
        disabled: Boolean,
        checked: Boolean,
        name: {
          type: String,
          default: void 0
        },
        trueLabel: {
          type: [String, Number],
          default: void 0
        },
        falseLabel: {
          type: [String, Number],
          default: void 0
        },
        id: {
          type: String,
          default: void 0
        },
        controls: {
          type: String,
          default: void 0
        },
        border: Boolean,
        size: useSizeProp,
        tabindex: [String, Number],
        validateEvent: {
          type: Boolean,
          default: true
        }
      };
      const checkboxEmits = {
        [UPDATE_MODEL_EVENT]: (val) => isString$1(val) || core.isNumber(val) || core.isBoolean(val),
        change: (val) => isString$1(val) || core.isNumber(val) || core.isBoolean(val)
      };
      const checkboxGroupContextKey = Symbol("checkboxGroupContextKey");
      const useCheckboxDisabled = ({
        model,
        isChecked
      }) => {
        const checkboxGroup2 = vue.inject(checkboxGroupContextKey, void 0);
        const isLimitDisabled = vue.computed(() => {
          var _a, _b;
          const max = (_a = checkboxGroup2 == null ? void 0 : checkboxGroup2.max) == null ? void 0 : _a.value;
          const min = (_b = checkboxGroup2 == null ? void 0 : checkboxGroup2.min) == null ? void 0 : _b.value;
          return !isUndefined(max) && model.value.length >= max && !isChecked.value || !isUndefined(min) && model.value.length <= min && isChecked.value;
        });
        const isDisabled = useFormDisabled(vue.computed(() => (checkboxGroup2 == null ? void 0 : checkboxGroup2.disabled.value) || isLimitDisabled.value));
        return {
          isDisabled,
          isLimitDisabled
        };
      };
      const useCheckboxEvent = (props, {
        model,
        isLimitExceeded,
        hasOwnLabel,
        isDisabled,
        isLabeledByFormItem
      }) => {
        const checkboxGroup2 = vue.inject(checkboxGroupContextKey, void 0);
        const { formItem } = useFormItem();
        const { emit } = vue.getCurrentInstance();
        function getLabeledValue(value) {
          var _a, _b;
          return value === props.trueLabel || value === true ? (_a = props.trueLabel) != null ? _a : true : (_b = props.falseLabel) != null ? _b : false;
        }
        function emitChangeEvent(checked, e) {
          emit("change", getLabeledValue(checked), e);
        }
        function handleChange(e) {
          if (isLimitExceeded.value)
            return;
          const target = e.target;
          emit("change", getLabeledValue(target.checked), e);
        }
        async function onClickRoot(e) {
          if (isLimitExceeded.value)
            return;
          if (!hasOwnLabel.value && !isDisabled.value && isLabeledByFormItem.value) {
            const eventTargets = e.composedPath();
            const hasLabel = eventTargets.some((item) => item.tagName === "LABEL");
            if (!hasLabel) {
              model.value = getLabeledValue([false, props.falseLabel].includes(model.value));
              await vue.nextTick();
              emitChangeEvent(model.value, e);
            }
          }
        }
        const validateEvent = vue.computed(() => (checkboxGroup2 == null ? void 0 : checkboxGroup2.validateEvent) || props.validateEvent);
        vue.watch(() => props.modelValue, () => {
          if (validateEvent.value) {
            formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
          }
        });
        return {
          handleChange,
          onClickRoot
        };
      };
      const useCheckboxModel = (props) => {
        const selfModel = vue.ref(false);
        const { emit } = vue.getCurrentInstance();
        const checkboxGroup2 = vue.inject(checkboxGroupContextKey, void 0);
        const isGroup = vue.computed(() => isUndefined(checkboxGroup2) === false);
        const isLimitExceeded = vue.ref(false);
        const model = vue.computed({
          get() {
            var _a, _b;
            return isGroup.value ? (_a = checkboxGroup2 == null ? void 0 : checkboxGroup2.modelValue) == null ? void 0 : _a.value : (_b = props.modelValue) != null ? _b : selfModel.value;
          },
          set(val) {
            var _a, _b;
            if (isGroup.value && isArray$6(val)) {
              isLimitExceeded.value = ((_a = checkboxGroup2 == null ? void 0 : checkboxGroup2.max) == null ? void 0 : _a.value) !== void 0 && val.length > (checkboxGroup2 == null ? void 0 : checkboxGroup2.max.value);
              isLimitExceeded.value === false && ((_b = checkboxGroup2 == null ? void 0 : checkboxGroup2.changeEvent) == null ? void 0 : _b.call(checkboxGroup2, val));
            } else {
              emit(UPDATE_MODEL_EVENT, val);
              selfModel.value = val;
            }
          }
        });
        return {
          model,
          isGroup,
          isLimitExceeded
        };
      };
      const useCheckboxStatus = (props, slots, { model }) => {
        const checkboxGroup2 = vue.inject(checkboxGroupContextKey, void 0);
        const isFocused = vue.ref(false);
        const isChecked = vue.computed(() => {
          const value = model.value;
          if (core.isBoolean(value)) {
            return value;
          } else if (isArray$6(value)) {
            if (isObject$1(props.label)) {
              return value.map(vue.toRaw).some((o) => isEqual(o, props.label));
            } else {
              return value.map(vue.toRaw).includes(props.label);
            }
          } else if (value !== null && value !== void 0) {
            return value === props.trueLabel;
          } else {
            return !!value;
          }
        });
        const checkboxButtonSize = useFormSize(vue.computed(() => {
          var _a;
          return (_a = checkboxGroup2 == null ? void 0 : checkboxGroup2.size) == null ? void 0 : _a.value;
        }), {
          prop: true
        });
        const checkboxSize = useFormSize(vue.computed(() => {
          var _a;
          return (_a = checkboxGroup2 == null ? void 0 : checkboxGroup2.size) == null ? void 0 : _a.value;
        }));
        const hasOwnLabel = vue.computed(() => {
          return !!(slots.default || props.label);
        });
        return {
          checkboxButtonSize,
          isChecked,
          isFocused,
          checkboxSize,
          hasOwnLabel
        };
      };
      const setStoreValue = (props, { model }) => {
        function addToStore() {
          if (isArray$6(model.value) && !model.value.includes(props.label)) {
            model.value.push(props.label);
          } else {
            model.value = props.trueLabel || true;
          }
        }
        props.checked && addToStore();
      };
      const useCheckbox = (props, slots) => {
        const { formItem: elFormItem } = useFormItem();
        const { model, isGroup, isLimitExceeded } = useCheckboxModel(props);
        const {
          isFocused,
          isChecked,
          checkboxButtonSize,
          checkboxSize,
          hasOwnLabel
        } = useCheckboxStatus(props, slots, { model });
        const { isDisabled } = useCheckboxDisabled({ model, isChecked });
        const { inputId, isLabeledByFormItem } = useFormItemInputId(props, {
          formItemContext: elFormItem,
          disableIdGeneration: hasOwnLabel,
          disableIdManagement: isGroup
        });
        const { handleChange, onClickRoot } = useCheckboxEvent(props, {
          model,
          isLimitExceeded,
          hasOwnLabel,
          isDisabled,
          isLabeledByFormItem
        });
        setStoreValue(props, { model });
        return {
          inputId,
          isLabeledByFormItem,
          isChecked,
          isDisabled,
          isFocused,
          checkboxButtonSize,
          checkboxSize,
          hasOwnLabel,
          model,
          handleChange,
          onClickRoot
        };
      };
      const _hoisted_1$3 = ["tabindex", "role", "aria-checked"];
      const _hoisted_2$2 = ["id", "aria-hidden", "name", "tabindex", "disabled", "true-value", "false-value"];
      const _hoisted_3$1 = ["id", "aria-hidden", "disabled", "value", "name", "tabindex"];
      const __default__$3 = vue.defineComponent({
        name: "ElCheckbox"
      });
      const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
        ...__default__$3,
        props: checkboxProps,
        emits: checkboxEmits,
        setup(__props) {
          const props = __props;
          const slots = vue.useSlots();
          const {
            inputId,
            isLabeledByFormItem,
            isChecked,
            isDisabled,
            isFocused,
            checkboxSize,
            hasOwnLabel,
            model,
            handleChange,
            onClickRoot
          } = useCheckbox(props, slots);
          const ns = useNamespace("checkbox");
          const compKls = vue.computed(() => {
            return [
              ns.b(),
              ns.m(checkboxSize.value),
              ns.is("disabled", isDisabled.value),
              ns.is("bordered", props.border),
              ns.is("checked", isChecked.value)
            ];
          });
          const spanKls = vue.computed(() => {
            return [
              ns.e("input"),
              ns.is("disabled", isDisabled.value),
              ns.is("checked", isChecked.value),
              ns.is("indeterminate", props.indeterminate),
              ns.is("focus", isFocused.value)
            ];
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(!vue.unref(hasOwnLabel) && vue.unref(isLabeledByFormItem) ? "span" : "label"), {
              class: vue.normalizeClass(vue.unref(compKls)),
              "aria-controls": _ctx.indeterminate ? _ctx.controls : null,
              onClick: vue.unref(onClickRoot)
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(spanKls)),
                  tabindex: _ctx.indeterminate ? 0 : void 0,
                  role: _ctx.indeterminate ? "checkbox" : void 0,
                  "aria-checked": _ctx.indeterminate ? "mixed" : void 0
                }, [
                  _ctx.trueLabel || _ctx.falseLabel ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                    key: 0,
                    id: vue.unref(inputId),
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(model) ? model.value = $event : null),
                    class: vue.normalizeClass(vue.unref(ns).e("original")),
                    type: "checkbox",
                    "aria-hidden": _ctx.indeterminate ? "true" : "false",
                    name: _ctx.name,
                    tabindex: _ctx.tabindex,
                    disabled: vue.unref(isDisabled),
                    "true-value": _ctx.trueLabel,
                    "false-value": _ctx.falseLabel,
                    onChange: _cache[1] || (_cache[1] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
                    onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
                    onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false)
                  }, null, 42, _hoisted_2$2)), [
                    [vue.vModelCheckbox, vue.unref(model)]
                  ]) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                    key: 1,
                    id: vue.unref(inputId),
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.isRef(model) ? model.value = $event : null),
                    class: vue.normalizeClass(vue.unref(ns).e("original")),
                    type: "checkbox",
                    "aria-hidden": _ctx.indeterminate ? "true" : "false",
                    disabled: vue.unref(isDisabled),
                    value: _ctx.label,
                    name: _ctx.name,
                    tabindex: _ctx.tabindex,
                    onChange: _cache[5] || (_cache[5] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
                    onFocus: _cache[6] || (_cache[6] = ($event) => isFocused.value = true),
                    onBlur: _cache[7] || (_cache[7] = ($event) => isFocused.value = false)
                  }, null, 42, _hoisted_3$1)), [
                    [vue.vModelCheckbox, vue.unref(model)]
                  ]),
                  vue.createElementVNode("span", {
                    class: vue.normalizeClass(vue.unref(ns).e("inner"))
                  }, null, 2)
                ], 10, _hoisted_1$3),
                vue.unref(hasOwnLabel) ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  class: vue.normalizeClass(vue.unref(ns).e("label"))
                }, [
                  vue.renderSlot(_ctx.$slots, "default"),
                  !_ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
                  ], 64)) : vue.createCommentVNode("v-if", true)
                ], 2)) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["class", "aria-controls", "onClick"]);
          };
        }
      });
      var Checkbox = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox.vue"]]);
      const _hoisted_1$2 = ["name", "tabindex", "disabled", "true-value", "false-value"];
      const _hoisted_2$1 = ["name", "tabindex", "disabled", "value"];
      const __default__$2 = vue.defineComponent({
        name: "ElCheckboxButton"
      });
      const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
        ...__default__$2,
        props: checkboxProps,
        emits: checkboxEmits,
        setup(__props) {
          const props = __props;
          const slots = vue.useSlots();
          const {
            isFocused,
            isChecked,
            isDisabled,
            checkboxButtonSize,
            model,
            handleChange
          } = useCheckbox(props, slots);
          const checkboxGroup2 = vue.inject(checkboxGroupContextKey, void 0);
          const ns = useNamespace("checkbox");
          const activeStyle = vue.computed(() => {
            var _a, _b, _c, _d;
            const fillValue = (_b = (_a = checkboxGroup2 == null ? void 0 : checkboxGroup2.fill) == null ? void 0 : _a.value) != null ? _b : "";
            return {
              backgroundColor: fillValue,
              borderColor: fillValue,
              color: (_d = (_c = checkboxGroup2 == null ? void 0 : checkboxGroup2.textColor) == null ? void 0 : _c.value) != null ? _d : "",
              boxShadow: fillValue ? `-1px 0 0 0 ${fillValue}` : void 0
            };
          });
          const labelKls = vue.computed(() => {
            return [
              ns.b("button"),
              ns.bm("button", checkboxButtonSize.value),
              ns.is("disabled", isDisabled.value),
              ns.is("checked", isChecked.value),
              ns.is("focus", isFocused.value)
            ];
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("label", {
              class: vue.normalizeClass(vue.unref(labelKls))
            }, [
              _ctx.trueLabel || _ctx.falseLabel ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 0,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(model) ? model.value = $event : null),
                class: vue.normalizeClass(vue.unref(ns).be("button", "original")),
                type: "checkbox",
                name: _ctx.name,
                tabindex: _ctx.tabindex,
                disabled: vue.unref(isDisabled),
                "true-value": _ctx.trueLabel,
                "false-value": _ctx.falseLabel,
                onChange: _cache[1] || (_cache[1] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
                onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
                onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false)
              }, null, 42, _hoisted_1$2)), [
                [vue.vModelCheckbox, vue.unref(model)]
              ]) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 1,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.isRef(model) ? model.value = $event : null),
                class: vue.normalizeClass(vue.unref(ns).be("button", "original")),
                type: "checkbox",
                name: _ctx.name,
                tabindex: _ctx.tabindex,
                disabled: vue.unref(isDisabled),
                value: _ctx.label,
                onChange: _cache[5] || (_cache[5] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
                onFocus: _cache[6] || (_cache[6] = ($event) => isFocused.value = true),
                onBlur: _cache[7] || (_cache[7] = ($event) => isFocused.value = false)
              }, null, 42, _hoisted_2$1)), [
                [vue.vModelCheckbox, vue.unref(model)]
              ]),
              _ctx.$slots.default || _ctx.label ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 2,
                class: vue.normalizeClass(vue.unref(ns).be("button", "inner")),
                style: vue.normalizeStyle(vue.unref(isChecked) ? vue.unref(activeStyle) : void 0)
              }, [
                vue.renderSlot(_ctx.$slots, "default", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
                ])
              ], 6)) : vue.createCommentVNode("v-if", true)
            ], 2);
          };
        }
      });
      var CheckboxButton = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox-button.vue"]]);
      const checkboxGroupProps = buildProps({
        modelValue: {
          type: definePropType(Array),
          default: () => []
        },
        disabled: Boolean,
        min: Number,
        max: Number,
        size: useSizeProp,
        label: String,
        fill: String,
        textColor: String,
        tag: {
          type: String,
          default: "div"
        },
        validateEvent: {
          type: Boolean,
          default: true
        }
      });
      const checkboxGroupEmits = {
        [UPDATE_MODEL_EVENT]: (val) => isArray$6(val),
        change: (val) => isArray$6(val)
      };
      const __default__$1 = vue.defineComponent({
        name: "ElCheckboxGroup"
      });
      const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
        ...__default__$1,
        props: checkboxGroupProps,
        emits: checkboxGroupEmits,
        setup(__props, { emit }) {
          const props = __props;
          const ns = useNamespace("checkbox");
          const { formItem } = useFormItem();
          const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
            formItemContext: formItem
          });
          const changeEvent = async (value) => {
            emit(UPDATE_MODEL_EVENT, value);
            await vue.nextTick();
            emit("change", value);
          };
          const modelValue = vue.computed({
            get() {
              return props.modelValue;
            },
            set(val) {
              changeEvent(val);
            }
          });
          vue.provide(checkboxGroupContextKey, {
            ...pick$1(vue.toRefs(props), [
              "size",
              "min",
              "max",
              "disabled",
              "validateEvent",
              "fill",
              "textColor"
            ]),
            modelValue,
            changeEvent
          });
          vue.watch(() => props.modelValue, () => {
            if (props.validateEvent) {
              formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
            }
          });
          return (_ctx, _cache) => {
            var _a;
            return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
              id: vue.unref(groupId),
              class: vue.normalizeClass(vue.unref(ns).b("group")),
              role: "group",
              "aria-label": !vue.unref(isLabeledByFormItem) ? _ctx.label || "checkbox-group" : void 0,
              "aria-labelledby": vue.unref(isLabeledByFormItem) ? (_a = vue.unref(formItem)) == null ? void 0 : _a.labelId : void 0
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["id", "class", "aria-label", "aria-labelledby"]);
          };
        }
      });
      var CheckboxGroup = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox-group.vue"]]);
      withInstall(Checkbox, {
        CheckboxButton,
        CheckboxGroup
      });
      const ElCheckboxButton = withNoopInstall(CheckboxButton);
      const ElCheckboxGroup = withNoopInstall(CheckboxGroup);
      const tagProps = buildProps({
        closable: Boolean,
        type: {
          type: String,
          values: ["success", "info", "warning", "danger", ""],
          default: ""
        },
        hit: Boolean,
        disableTransitions: Boolean,
        color: {
          type: String,
          default: ""
        },
        size: {
          type: String,
          values: componentSizes,
          default: ""
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
      const __default__ = vue.defineComponent({
        name: "ElTag"
      });
      const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
        ...__default__,
        props: tagProps,
        emits: tagEmits,
        setup(__props, { emit }) {
          const props = __props;
          const tagSize = useFormSize();
          const ns = useNamespace("tag");
          const classes = vue.computed(() => {
            const { type, hit, effect, closable, round } = props;
            return [
              ns.b(),
              ns.is("closable", closable),
              ns.m(type),
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
              class: vue.normalizeClass(vue.unref(classes)),
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
                  class: vue.normalizeClass(vue.unref(classes)),
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
      var Tag = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/tag/src/tag.vue"]]);
      const ElTag = withInstall(Tag);
      const selectGroupKey = Symbol("ElSelectGroup");
      const selectKey = Symbol("ElSelect");
      function useOption(props, states) {
        const select2 = vue.inject(selectKey);
        const selectGroup = vue.inject(selectGroupKey, { disabled: false });
        const isObject2 = vue.computed(() => {
          return Object.prototype.toString.call(props.value).toLowerCase() === "[object object]";
        });
        const itemSelected = vue.computed(() => {
          if (!select2.props.multiple) {
            return isEqual2(props.value, select2.props.modelValue);
          } else {
            return contains(select2.props.modelValue, props.value);
          }
        });
        const limitReached = vue.computed(() => {
          if (select2.props.multiple) {
            const modelValue = select2.props.modelValue || [];
            return !itemSelected.value && modelValue.length >= select2.props.multipleLimit && select2.props.multipleLimit > 0;
          } else {
            return false;
          }
        });
        const currentLabel = vue.computed(() => {
          return props.label || (isObject2.value ? "" : props.value);
        });
        const currentValue = vue.computed(() => {
          return props.value || props.label || "";
        });
        const isDisabled = vue.computed(() => {
          return props.disabled || states.groupDisabled || limitReached.value;
        });
        const instance = vue.getCurrentInstance();
        const contains = (arr = [], target) => {
          if (!isObject2.value) {
            return arr && arr.includes(target);
          } else {
            const valueKey = select2.props.valueKey;
            return arr && arr.some((item) => {
              return vue.toRaw(get(item, valueKey)) === get(target, valueKey);
            });
          }
        };
        const isEqual2 = (a, b) => {
          if (!isObject2.value) {
            return a === b;
          } else {
            const { valueKey } = select2.props;
            return get(a, valueKey) === get(b, valueKey);
          }
        };
        const hoverItem = () => {
          if (!props.disabled && !selectGroup.disabled) {
            select2.hoverIndex = select2.optionsArray.indexOf(instance.proxy);
          }
        };
        vue.watch(() => currentLabel.value, () => {
          if (!props.created && !select2.props.remote)
            select2.setSelected();
        });
        vue.watch(() => props.value, (val, oldVal) => {
          const { remote, valueKey } = select2.props;
          if (!Object.is(val, oldVal)) {
            select2.onOptionDestroy(oldVal, instance.proxy);
            select2.onOptionCreate(instance.proxy);
          }
          if (!props.created && !remote) {
            if (valueKey && typeof val === "object" && typeof oldVal === "object" && val[valueKey] === oldVal[valueKey]) {
              return;
            }
            select2.setSelected();
          }
        });
        vue.watch(() => selectGroup.disabled, () => {
          states.groupDisabled = selectGroup.disabled;
        }, { immediate: true });
        const { queryChange } = vue.toRaw(select2);
        vue.watch(queryChange, (changes) => {
          const { query } = vue.unref(changes);
          const regexp = new RegExp(escapeStringRegexp(query), "i");
          states.visible = regexp.test(currentLabel.value) || props.created;
          if (!states.visible) {
            select2.filteredOptionsCount--;
          }
        }, { immediate: true });
        return {
          select: select2,
          currentLabel,
          currentValue,
          itemSelected,
          isDisabled,
          hoverItem
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
          disabled: {
            type: Boolean,
            default: false
          }
        },
        setup(props) {
          const ns = useNamespace("select");
          const states = vue.reactive({
            index: -1,
            groupDisabled: false,
            visible: true,
            hitState: false,
            hover: false
          });
          const { currentLabel, itemSelected, isDisabled, select: select2, hoverItem } = useOption(props, states);
          const { visible, hover } = vue.toRefs(states);
          const vm = vue.getCurrentInstance().proxy;
          select2.onOptionCreate(vm);
          vue.onBeforeUnmount(() => {
            const key = vm.value;
            const { selected } = select2;
            const selectedOptions = select2.props.multiple ? selected : [selected];
            const doesSelected = selectedOptions.some((item) => {
              return item.value === vm.value;
            });
            vue.nextTick(() => {
              if (select2.cachedOptions.get(key) === vm && !doesSelected) {
                select2.cachedOptions.delete(key);
              }
            });
            select2.onOptionDestroy(key, vm);
          });
          function selectOptionClick() {
            if (props.disabled !== true && states.groupDisabled !== true) {
              select2.handleOptionSelect(vm, true);
            }
          }
          return {
            ns,
            currentLabel,
            itemSelected,
            isDisabled,
            select: select2,
            hoverItem,
            visible,
            hover,
            selectOptionClick,
            states
          };
        }
      });
      function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("li", {
          class: vue.normalizeClass([
            _ctx.ns.be("dropdown", "item"),
            _ctx.ns.is("disabled", _ctx.isDisabled),
            {
              selected: _ctx.itemSelected,
              hover: _ctx.hover
            }
          ]),
          onMouseenter: _cache[0] || (_cache[0] = (...args) => _ctx.hoverItem && _ctx.hoverItem(...args)),
          onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => _ctx.selectOptionClick && _ctx.selectOptionClick(...args), ["stop"]))
        }, [
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createElementVNode("span", null, vue.toDisplayString(_ctx.currentLabel), 1)
          ])
        ], 34)), [
          [vue.vShow, _ctx.visible]
        ]);
      }
      var Option = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$3], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/select/src/option.vue"]]);
      const _sfc_main$5 = vue.defineComponent({
        name: "ElSelectDropdown",
        componentName: "ElSelectDropdown",
        setup() {
          const select2 = vue.inject(selectKey);
          const ns = useNamespace("select");
          const popperClass = vue.computed(() => select2.props.popperClass);
          const isMultiple = vue.computed(() => select2.props.multiple);
          const isFitInputWidth = vue.computed(() => select2.props.fitInputWidth);
          const minWidth = vue.ref("");
          function updateMinWidth() {
            var _a;
            minWidth.value = `${(_a = select2.selectWrapper) == null ? void 0 : _a.offsetWidth}px`;
          }
          vue.onMounted(() => {
            updateMinWidth();
            core.useResizeObserver(select2.selectWrapper, updateMinWidth);
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
          vue.renderSlot(_ctx.$slots, "default")
        ], 6);
      }
      var ElSelectMenu = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$2], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/select/src/select-dropdown.vue"]]);
      function useSelectStates(props) {
        const { t } = useLocale();
        return vue.reactive({
          options: /* @__PURE__ */ new Map(),
          cachedOptions: /* @__PURE__ */ new Map(),
          createdLabel: null,
          createdSelected: false,
          selected: props.multiple ? [] : {},
          inputLength: 20,
          inputWidth: 0,
          optionsCount: 0,
          filteredOptionsCount: 0,
          visible: false,
          softFocus: false,
          selectedLabel: "",
          hoverIndex: -1,
          query: "",
          previousQuery: null,
          inputHovering: false,
          cachedPlaceHolder: "",
          currentPlaceholder: t("el.select.placeholder"),
          menuVisibleOnFocus: false,
          isOnComposition: false,
          isSilentBlur: false,
          prefixWidth: 11,
          tagInMultiLine: false,
          mouseEnter: false
        });
      }
      const useSelect = (props, states, ctx) => {
        const { t } = useLocale();
        const ns = useNamespace("select");
        useDeprecated({
          from: "suffixTransition",
          replacement: "override style scheme",
          version: "2.3.0",
          scope: "props",
          ref: "https://element-plus.org/en-US/component/select.html#select-attributes"
        }, vue.computed(() => props.suffixTransition === false));
        const reference = vue.ref(null);
        const input2 = vue.ref(null);
        const iOSInput = vue.ref(null);
        const tooltipRef = vue.ref(null);
        const tags = vue.ref(null);
        const selectWrapper = vue.ref(null);
        const scrollbar2 = vue.ref(null);
        const hoverOption = vue.ref(-1);
        const queryChange = vue.shallowRef({ query: "" });
        const groupQueryChange = vue.shallowRef("");
        const optionList = vue.ref([]);
        let originClientHeight = 0;
        const { form, formItem } = useFormItem();
        const readonly2 = vue.computed(() => !props.filterable || props.multiple || !states.visible);
        const selectDisabled = vue.computed(() => props.disabled || (form == null ? void 0 : form.disabled));
        const showClose = vue.computed(() => {
          const hasValue = props.multiple ? Array.isArray(props.modelValue) && props.modelValue.length > 0 : props.modelValue !== void 0 && props.modelValue !== null && props.modelValue !== "";
          const criteria = props.clearable && !selectDisabled.value && states.inputHovering && hasValue;
          return criteria;
        });
        const iconComponent = vue.computed(() => props.remote && props.filterable && !props.remoteShowSuffix ? "" : props.suffixIcon);
        const iconReverse = vue.computed(() => ns.is("reverse", iconComponent.value && states.visible && props.suffixTransition));
        const debounce$1 = vue.computed(() => props.remote ? 300 : 0);
        const emptyText = vue.computed(() => {
          if (props.loading) {
            return props.loadingText || t("el.select.loading");
          } else {
            if (props.remote && states.query === "" && states.options.size === 0)
              return false;
            if (props.filterable && states.query && states.options.size > 0 && states.filteredOptionsCount === 0) {
              return props.noMatchText || t("el.select.noMatch");
            }
            if (states.options.size === 0) {
              return props.noDataText || t("el.select.noData");
            }
          }
          return null;
        });
        const optionsArray = vue.computed(() => {
          const list = Array.from(states.options.values());
          const newList = [];
          optionList.value.forEach((item) => {
            const index2 = list.findIndex((i) => i.currentLabel === item);
            if (index2 > -1) {
              newList.push(list[index2]);
            }
          });
          return newList.length ? newList : list;
        });
        const cachedOptionsArray = vue.computed(() => Array.from(states.cachedOptions.values()));
        const showNewOption = vue.computed(() => {
          const hasExistingOption = optionsArray.value.filter((option2) => {
            return !option2.created;
          }).some((option2) => {
            return option2.currentLabel === states.query;
          });
          return props.filterable && props.allowCreate && states.query !== "" && !hasExistingOption;
        });
        const selectSize = useFormSize();
        const collapseTagSize = vue.computed(() => ["small"].includes(selectSize.value) ? "small" : "default");
        const dropMenuVisible = vue.computed({
          get() {
            return states.visible && emptyText.value !== false;
          },
          set(val) {
            states.visible = val;
          }
        });
        vue.watch([() => selectDisabled.value, () => selectSize.value, () => form == null ? void 0 : form.size], () => {
          vue.nextTick(() => {
            resetInputHeight();
          });
        });
        vue.watch(() => props.placeholder, (val) => {
          states.cachedPlaceHolder = states.currentPlaceholder = val;
        });
        vue.watch(() => props.modelValue, (val, oldVal) => {
          if (props.multiple) {
            resetInputHeight();
            if (val && val.length > 0 || input2.value && states.query !== "") {
              states.currentPlaceholder = "";
            } else {
              states.currentPlaceholder = states.cachedPlaceHolder;
            }
            if (props.filterable && !props.reserveKeyword) {
              states.query = "";
              handleQueryChange(states.query);
            }
          }
          setSelected();
          if (props.filterable && !props.multiple) {
            states.inputLength = 20;
          }
          if (!isEqual(val, oldVal) && props.validateEvent) {
            formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
          }
        }, {
          flush: "post",
          deep: true
        });
        vue.watch(() => states.visible, (val) => {
          var _a, _b, _c, _d, _e;
          if (!val) {
            if (props.filterable) {
              if (isFunction$1(props.filterMethod)) {
                props.filterMethod("");
              }
              if (isFunction$1(props.remoteMethod)) {
                props.remoteMethod("");
              }
            }
            input2.value && input2.value.blur();
            states.query = "";
            states.previousQuery = null;
            states.selectedLabel = "";
            states.inputLength = 20;
            states.menuVisibleOnFocus = false;
            resetHoverIndex();
            vue.nextTick(() => {
              if (input2.value && input2.value.value === "" && states.selected.length === 0) {
                states.currentPlaceholder = states.cachedPlaceHolder;
              }
            });
            if (!props.multiple) {
              if (states.selected) {
                if (props.filterable && props.allowCreate && states.createdSelected && states.createdLabel) {
                  states.selectedLabel = states.createdLabel;
                } else {
                  states.selectedLabel = states.selected.currentLabel;
                }
                if (props.filterable)
                  states.query = states.selectedLabel;
              }
              if (props.filterable) {
                states.currentPlaceholder = states.cachedPlaceHolder;
              }
            }
          } else {
            (_b = (_a = tooltipRef.value) == null ? void 0 : _a.updatePopper) == null ? void 0 : _b.call(_a);
            if (props.filterable) {
              states.filteredOptionsCount = states.optionsCount;
              states.query = props.remote ? "" : states.selectedLabel;
              (_d = (_c = iOSInput.value) == null ? void 0 : _c.focus) == null ? void 0 : _d.call(_c);
              if (props.multiple) {
                (_e = input2.value) == null ? void 0 : _e.focus();
              } else {
                if (states.selectedLabel) {
                  states.currentPlaceholder = `${states.selectedLabel}`;
                  states.selectedLabel = "";
                }
              }
              handleQueryChange(states.query);
              if (!props.multiple && !props.remote) {
                queryChange.value.query = "";
                vue.triggerRef(queryChange);
                vue.triggerRef(groupQueryChange);
              }
            }
          }
          ctx.emit("visible-change", val);
        });
        vue.watch(() => states.options.entries(), () => {
          var _a, _b, _c;
          if (!core.isClient)
            return;
          (_b = (_a = tooltipRef.value) == null ? void 0 : _a.updatePopper) == null ? void 0 : _b.call(_a);
          if (props.multiple) {
            resetInputHeight();
          }
          const inputs = ((_c = selectWrapper.value) == null ? void 0 : _c.querySelectorAll("input")) || [];
          if (!Array.from(inputs).includes(document.activeElement)) {
            setSelected();
          }
          if (props.defaultFirstOption && (props.filterable || props.remote) && states.filteredOptionsCount) {
            checkDefaultFirstOption();
          }
        }, {
          flush: "post"
        });
        vue.watch(() => states.hoverIndex, (val) => {
          if (core.isNumber(val) && val > -1) {
            hoverOption.value = optionsArray.value[val] || {};
          } else {
            hoverOption.value = {};
          }
          optionsArray.value.forEach((option2) => {
            option2.hover = hoverOption.value === option2;
          });
        });
        const resetInputHeight = () => {
          vue.nextTick(() => {
            var _a, _b;
            if (!reference.value)
              return;
            const input22 = reference.value.$el.querySelector("input");
            originClientHeight = originClientHeight || (input22.clientHeight > 0 ? input22.clientHeight + 2 : 0);
            const _tags = tags.value;
            const gotSize = getComponentSize(selectSize.value || (form == null ? void 0 : form.size));
            const sizeInMap = gotSize === originClientHeight || originClientHeight <= 0 ? gotSize : originClientHeight;
            const isElHidden = input22.offsetParent === null;
            !isElHidden && (input22.style.height = `${(states.selected.length === 0 ? sizeInMap : Math.max(_tags ? _tags.clientHeight + (_tags.clientHeight > sizeInMap ? 6 : 0) : 0, sizeInMap)) - 2}px`);
            states.tagInMultiLine = Number.parseFloat(input22.style.height) >= sizeInMap;
            if (states.visible && emptyText.value !== false) {
              (_b = (_a = tooltipRef.value) == null ? void 0 : _a.updatePopper) == null ? void 0 : _b.call(_a);
            }
          });
        };
        const handleQueryChange = async (val) => {
          if (states.previousQuery === val || states.isOnComposition)
            return;
          if (states.previousQuery === null && (isFunction$1(props.filterMethod) || isFunction$1(props.remoteMethod))) {
            states.previousQuery = val;
            return;
          }
          states.previousQuery = val;
          vue.nextTick(() => {
            var _a, _b;
            if (states.visible)
              (_b = (_a = tooltipRef.value) == null ? void 0 : _a.updatePopper) == null ? void 0 : _b.call(_a);
          });
          states.hoverIndex = -1;
          if (props.multiple && props.filterable) {
            vue.nextTick(() => {
              const length = input2.value.value.length * 15 + 20;
              states.inputLength = props.collapseTags ? Math.min(50, length) : length;
              managePlaceholder();
              resetInputHeight();
            });
          }
          if (props.remote && isFunction$1(props.remoteMethod)) {
            states.hoverIndex = -1;
            props.remoteMethod(val);
          } else if (isFunction$1(props.filterMethod)) {
            props.filterMethod(val);
            vue.triggerRef(groupQueryChange);
          } else {
            states.filteredOptionsCount = states.optionsCount;
            queryChange.value.query = val;
            vue.triggerRef(queryChange);
            vue.triggerRef(groupQueryChange);
          }
          if (props.defaultFirstOption && (props.filterable || props.remote) && states.filteredOptionsCount) {
            await vue.nextTick();
            checkDefaultFirstOption();
          }
        };
        const managePlaceholder = () => {
          if (states.currentPlaceholder !== "") {
            states.currentPlaceholder = input2.value.value ? "" : states.cachedPlaceHolder;
          }
        };
        const checkDefaultFirstOption = () => {
          const optionsInDropdown = optionsArray.value.filter((n) => n.visible && !n.disabled && !n.states.groupDisabled);
          const userCreatedOption = optionsInDropdown.find((n) => n.created);
          const firstOriginOption = optionsInDropdown[0];
          states.hoverIndex = getValueIndex(optionsArray.value, userCreatedOption || firstOriginOption);
        };
        const setSelected = () => {
          var _a;
          if (!props.multiple) {
            const option2 = getOption(props.modelValue);
            if ((_a = option2.props) == null ? void 0 : _a.created) {
              states.createdLabel = option2.props.value;
              states.createdSelected = true;
            } else {
              states.createdSelected = false;
            }
            states.selectedLabel = option2.currentLabel;
            states.selected = option2;
            if (props.filterable)
              states.query = states.selectedLabel;
            return;
          } else {
            states.selectedLabel = "";
          }
          const result = [];
          if (Array.isArray(props.modelValue)) {
            props.modelValue.forEach((value) => {
              result.push(getOption(value));
            });
          }
          states.selected = result;
          vue.nextTick(() => {
            resetInputHeight();
          });
        };
        const getOption = (value) => {
          let option2;
          const isObjectValue = toRawType(value).toLowerCase() === "object";
          const isNull = toRawType(value).toLowerCase() === "null";
          const isUndefined2 = toRawType(value).toLowerCase() === "undefined";
          for (let i = states.cachedOptions.size - 1; i >= 0; i--) {
            const cachedOption = cachedOptionsArray.value[i];
            const isEqualValue = isObjectValue ? get(cachedOption.value, props.valueKey) === get(value, props.valueKey) : cachedOption.value === value;
            if (isEqualValue) {
              option2 = {
                value,
                currentLabel: cachedOption.currentLabel,
                isDisabled: cachedOption.isDisabled
              };
              break;
            }
          }
          if (option2)
            return option2;
          const label = isObjectValue ? value.label : !isNull && !isUndefined2 ? value : "";
          const newOption = {
            value,
            currentLabel: label
          };
          if (props.multiple) {
            newOption.hitState = false;
          }
          return newOption;
        };
        const resetHoverIndex = () => {
          setTimeout(() => {
            const valueKey = props.valueKey;
            if (!props.multiple) {
              states.hoverIndex = optionsArray.value.findIndex((item) => {
                return getValueKey(item) === getValueKey(states.selected);
              });
            } else {
              if (states.selected.length > 0) {
                states.hoverIndex = Math.min.apply(null, states.selected.map((selected) => {
                  return optionsArray.value.findIndex((item) => {
                    return get(item, valueKey) === get(selected, valueKey);
                  });
                }));
              } else {
                states.hoverIndex = -1;
              }
            }
          }, 300);
        };
        const handleResize = () => {
          var _a, _b;
          resetInputWidth();
          (_b = (_a = tooltipRef.value) == null ? void 0 : _a.updatePopper) == null ? void 0 : _b.call(_a);
          if (props.multiple)
            resetInputHeight();
        };
        const resetInputWidth = () => {
          var _a;
          states.inputWidth = (_a = reference.value) == null ? void 0 : _a.$el.offsetWidth;
        };
        const onInputChange = () => {
          if (props.filterable && states.query !== states.selectedLabel) {
            states.query = states.selectedLabel;
            handleQueryChange(states.query);
          }
        };
        const debouncedOnInputChange = debounce(() => {
          onInputChange();
        }, debounce$1.value);
        const debouncedQueryChange = debounce((e) => {
          handleQueryChange(e.target.value);
        }, debounce$1.value);
        const emitChange = (val) => {
          if (!isEqual(props.modelValue, val)) {
            ctx.emit(CHANGE_EVENT, val);
          }
        };
        const deletePrevTag = (e) => {
          if (e.target.value.length <= 0 && !toggleLastOptionHitState()) {
            const value = props.modelValue.slice();
            value.pop();
            ctx.emit(UPDATE_MODEL_EVENT, value);
            emitChange(value);
          }
          if (e.target.value.length === 1 && props.modelValue.length === 0) {
            states.currentPlaceholder = states.cachedPlaceHolder;
          }
        };
        const deleteTag = (event, tag2) => {
          const index2 = states.selected.indexOf(tag2);
          if (index2 > -1 && !selectDisabled.value) {
            const value = props.modelValue.slice();
            value.splice(index2, 1);
            ctx.emit(UPDATE_MODEL_EVENT, value);
            emitChange(value);
            ctx.emit("remove-tag", tag2.value);
          }
          event.stopPropagation();
        };
        const deleteSelected = (event) => {
          event.stopPropagation();
          const value = props.multiple ? [] : "";
          if (!isString$1(value)) {
            for (const item of states.selected) {
              if (item.isDisabled)
                value.push(item.value);
            }
          }
          ctx.emit(UPDATE_MODEL_EVENT, value);
          emitChange(value);
          states.hoverIndex = -1;
          states.visible = false;
          ctx.emit("clear");
        };
        const handleOptionSelect = (option2, byClick) => {
          var _a;
          if (props.multiple) {
            const value = (props.modelValue || []).slice();
            const optionIndex = getValueIndex(value, option2.value);
            if (optionIndex > -1) {
              value.splice(optionIndex, 1);
            } else if (props.multipleLimit <= 0 || value.length < props.multipleLimit) {
              value.push(option2.value);
            }
            ctx.emit(UPDATE_MODEL_EVENT, value);
            emitChange(value);
            if (option2.created) {
              states.query = "";
              handleQueryChange("");
              states.inputLength = 20;
            }
            if (props.filterable)
              (_a = input2.value) == null ? void 0 : _a.focus();
          } else {
            ctx.emit(UPDATE_MODEL_EVENT, option2.value);
            emitChange(option2.value);
            states.visible = false;
          }
          states.isSilentBlur = byClick;
          setSoftFocus();
          if (states.visible)
            return;
          vue.nextTick(() => {
            scrollToOption(option2);
          });
        };
        const getValueIndex = (arr = [], value) => {
          if (!isObject$1(value))
            return arr.indexOf(value);
          const valueKey = props.valueKey;
          let index2 = -1;
          arr.some((item, i) => {
            if (vue.toRaw(get(item, valueKey)) === get(value, valueKey)) {
              index2 = i;
              return true;
            }
            return false;
          });
          return index2;
        };
        const setSoftFocus = () => {
          states.softFocus = true;
          const _input = input2.value || reference.value;
          if (_input) {
            _input == null ? void 0 : _input.focus();
          }
        };
        const scrollToOption = (option2) => {
          var _a, _b, _c, _d, _e;
          const targetOption = Array.isArray(option2) ? option2[0] : option2;
          let target = null;
          if (targetOption == null ? void 0 : targetOption.value) {
            const options = optionsArray.value.filter((item) => item.value === targetOption.value);
            if (options.length > 0) {
              target = options[0].$el;
            }
          }
          if (tooltipRef.value && target) {
            const menu = (_d = (_c = (_b = (_a = tooltipRef.value) == null ? void 0 : _a.popperRef) == null ? void 0 : _b.contentRef) == null ? void 0 : _c.querySelector) == null ? void 0 : _d.call(_c, `.${ns.be("dropdown", "wrap")}`);
            if (menu) {
              scrollIntoView(menu, target);
            }
          }
          (_e = scrollbar2.value) == null ? void 0 : _e.handleScroll();
        };
        const onOptionCreate = (vm) => {
          states.optionsCount++;
          states.filteredOptionsCount++;
          states.options.set(vm.value, vm);
          states.cachedOptions.set(vm.value, vm);
        };
        const onOptionDestroy = (key, vm) => {
          if (states.options.get(key) === vm) {
            states.optionsCount--;
            states.filteredOptionsCount--;
            states.options.delete(key);
          }
        };
        const resetInputState = (e) => {
          if (e.code !== EVENT_CODE.backspace)
            toggleLastOptionHitState(false);
          states.inputLength = input2.value.value.length * 15 + 20;
          resetInputHeight();
        };
        const toggleLastOptionHitState = (hit) => {
          if (!Array.isArray(states.selected))
            return;
          const option2 = states.selected[states.selected.length - 1];
          if (!option2)
            return;
          if (hit === true || hit === false) {
            option2.hitState = hit;
            return hit;
          }
          option2.hitState = !option2.hitState;
          return option2.hitState;
        };
        const handleComposition = (event) => {
          const text = event.target.value;
          if (event.type === "compositionend") {
            states.isOnComposition = false;
            vue.nextTick(() => handleQueryChange(text));
          } else {
            const lastCharacter = text[text.length - 1] || "";
            states.isOnComposition = !isKorean(lastCharacter);
          }
        };
        const handleMenuEnter = () => {
          vue.nextTick(() => scrollToOption(states.selected));
        };
        const handleFocus = (event) => {
          if (!states.softFocus) {
            if (props.automaticDropdown || props.filterable) {
              if (props.filterable && !states.visible) {
                states.menuVisibleOnFocus = true;
              }
              states.visible = true;
            }
            ctx.emit("focus", event);
          } else {
            states.softFocus = false;
          }
        };
        const blur = () => {
          var _a, _b, _c;
          states.visible = false;
          (_a = reference.value) == null ? void 0 : _a.blur();
          (_c = (_b = iOSInput.value) == null ? void 0 : _b.blur) == null ? void 0 : _c.call(_b);
        };
        const handleBlur = (event) => {
          vue.nextTick(() => {
            if (states.isSilentBlur) {
              states.isSilentBlur = false;
            } else {
              ctx.emit("blur", event);
            }
          });
          states.softFocus = false;
        };
        const handleClearClick = (event) => {
          deleteSelected(event);
        };
        const handleClose = () => {
          states.visible = false;
        };
        const handleKeydownEscape = (event) => {
          if (states.visible) {
            event.preventDefault();
            event.stopPropagation();
            states.visible = false;
          }
        };
        const toggleMenu = (e) => {
          var _a;
          if (e && !states.mouseEnter) {
            return;
          }
          if (!selectDisabled.value) {
            if (states.menuVisibleOnFocus) {
              states.menuVisibleOnFocus = false;
            } else {
              if (!tooltipRef.value || !tooltipRef.value.isFocusInsideContent()) {
                states.visible = !states.visible;
              }
            }
            if (states.visible) {
              (_a = input2.value || reference.value) == null ? void 0 : _a.focus();
            }
          }
        };
        const selectOption = () => {
          if (!states.visible) {
            toggleMenu();
          } else {
            if (optionsArray.value[states.hoverIndex]) {
              handleOptionSelect(optionsArray.value[states.hoverIndex], void 0);
            }
          }
        };
        const getValueKey = (item) => {
          return isObject$1(item.value) ? get(item.value, props.valueKey) : item.value;
        };
        const optionsAllDisabled = vue.computed(() => optionsArray.value.filter((option2) => option2.visible).every((option2) => option2.disabled));
        const showTagList = vue.computed(() => states.selected.slice(0, props.maxCollapseTags));
        const collapseTagList = vue.computed(() => states.selected.slice(props.maxCollapseTags));
        const navigateOptions = (direction) => {
          if (!states.visible) {
            states.visible = true;
            return;
          }
          if (states.options.size === 0 || states.filteredOptionsCount === 0)
            return;
          if (states.isOnComposition)
            return;
          if (!optionsAllDisabled.value) {
            if (direction === "next") {
              states.hoverIndex++;
              if (states.hoverIndex === states.options.size) {
                states.hoverIndex = 0;
              }
            } else if (direction === "prev") {
              states.hoverIndex--;
              if (states.hoverIndex < 0) {
                states.hoverIndex = states.options.size - 1;
              }
            }
            const option2 = optionsArray.value[states.hoverIndex];
            if (option2.disabled === true || option2.states.groupDisabled === true || !option2.visible) {
              navigateOptions(direction);
            }
            vue.nextTick(() => scrollToOption(hoverOption.value));
          }
        };
        const handleMouseEnter = () => {
          states.mouseEnter = true;
        };
        const handleMouseLeave = () => {
          states.mouseEnter = false;
        };
        return {
          optionList,
          optionsArray,
          selectSize,
          handleResize,
          debouncedOnInputChange,
          debouncedQueryChange,
          deletePrevTag,
          deleteTag,
          deleteSelected,
          handleOptionSelect,
          scrollToOption,
          readonly: readonly2,
          resetInputHeight,
          showClose,
          iconComponent,
          iconReverse,
          showNewOption,
          collapseTagSize,
          setSelected,
          managePlaceholder,
          selectDisabled,
          emptyText,
          toggleLastOptionHitState,
          resetInputState,
          handleComposition,
          onOptionCreate,
          onOptionDestroy,
          handleMenuEnter,
          handleFocus,
          blur,
          handleBlur,
          handleClearClick,
          handleClose,
          handleKeydownEscape,
          toggleMenu,
          selectOption,
          getValueKey,
          navigateOptions,
          dropMenuVisible,
          queryChange,
          groupQueryChange,
          showTagList,
          collapseTagList,
          reference,
          input: input2,
          iOSInput,
          tooltipRef,
          tags,
          selectWrapper,
          scrollbar: scrollbar2,
          handleMouseEnter,
          handleMouseLeave
        };
      };
      var ElOptions = vue.defineComponent({
        name: "ElOptions",
        emits: ["update-options"],
        setup(_, { slots, emit }) {
          let cachedOptions = [];
          function isSameOptions(a, b) {
            if (a.length !== b.length)
              return false;
            for (const [index2] of a.entries()) {
              if (a[index2] != b[index2]) {
                return false;
              }
            }
            return true;
          }
          return () => {
            var _a, _b;
            const children = (_a = slots.default) == null ? void 0 : _a.call(slots);
            const filteredOptions = [];
            function filterOptions(children2) {
              if (!Array.isArray(children2))
                return;
              children2.forEach((item) => {
                var _a2, _b2, _c, _d;
                const name = (_a2 = (item == null ? void 0 : item.type) || {}) == null ? void 0 : _a2.name;
                if (name === "ElOptionGroup") {
                  filterOptions(!isString$1(item.children) && !Array.isArray(item.children) && isFunction$1((_b2 = item.children) == null ? void 0 : _b2.default) ? (_c = item.children) == null ? void 0 : _c.default() : item.children);
                } else if (name === "ElOption") {
                  filteredOptions.push((_d = item.props) == null ? void 0 : _d.label);
                } else if (Array.isArray(item.children)) {
                  filterOptions(item.children);
                }
              });
            }
            if (children.length) {
              filterOptions((_b = children[0]) == null ? void 0 : _b.children);
            }
            if (!isSameOptions(filteredOptions, cachedOptions)) {
              cachedOptions = filteredOptions;
              emit("update-options", filteredOptions);
            }
            return children;
          };
        }
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
        props: {
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
          size: {
            type: String,
            validator: isValidComponentSize
          },
          effect: {
            type: String,
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
            type: Object,
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
          collapseTagsTooltip: {
            type: Boolean,
            default: false
          },
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
          fitInputWidth: {
            type: Boolean,
            default: false
          },
          suffixIcon: {
            type: iconPropType,
            default: arrow_down_default
          },
          tagType: { ...tagProps.type, default: "info" },
          validateEvent: {
            type: Boolean,
            default: true
          },
          remoteShowSuffix: {
            type: Boolean,
            default: false
          },
          suffixTransition: {
            type: Boolean,
            default: true
          },
          placement: {
            type: String,
            values: Ee,
            default: "bottom-start"
          }
        },
        emits: [
          UPDATE_MODEL_EVENT,
          CHANGE_EVENT,
          "remove-tag",
          "clear",
          "visible-change",
          "focus",
          "blur"
        ],
        setup(props, ctx) {
          const nsSelect = useNamespace("select");
          const nsInput = useNamespace("input");
          const { t } = useLocale();
          const states = useSelectStates(props);
          const {
            optionList,
            optionsArray,
            selectSize,
            readonly: readonly2,
            handleResize,
            collapseTagSize,
            debouncedOnInputChange,
            debouncedQueryChange,
            deletePrevTag,
            deleteTag,
            deleteSelected,
            handleOptionSelect,
            scrollToOption,
            setSelected,
            resetInputHeight,
            managePlaceholder,
            showClose,
            selectDisabled,
            iconComponent,
            iconReverse,
            showNewOption,
            emptyText,
            toggleLastOptionHitState,
            resetInputState,
            handleComposition,
            onOptionCreate,
            onOptionDestroy,
            handleMenuEnter,
            handleFocus,
            blur,
            handleBlur,
            handleClearClick,
            handleClose,
            handleKeydownEscape,
            toggleMenu,
            selectOption,
            getValueKey,
            navigateOptions,
            dropMenuVisible,
            reference,
            input: input2,
            iOSInput,
            tooltipRef,
            tags,
            selectWrapper,
            scrollbar: scrollbar2,
            queryChange,
            groupQueryChange,
            handleMouseEnter,
            handleMouseLeave,
            showTagList,
            collapseTagList
          } = useSelect(props, states, ctx);
          const { focus } = useFocus(reference);
          const {
            inputWidth,
            selected,
            inputLength,
            filteredOptionsCount,
            visible,
            softFocus,
            selectedLabel,
            hoverIndex,
            query,
            inputHovering,
            currentPlaceholder,
            menuVisibleOnFocus,
            isOnComposition,
            isSilentBlur,
            options,
            cachedOptions,
            optionsCount,
            prefixWidth,
            tagInMultiLine
          } = vue.toRefs(states);
          const wrapperKls = vue.computed(() => {
            const classList = [nsSelect.b()];
            const _selectSize = vue.unref(selectSize);
            if (_selectSize) {
              classList.push(nsSelect.m(_selectSize));
            }
            if (props.disabled) {
              classList.push(nsSelect.m("disabled"));
            }
            return classList;
          });
          const selectTagsStyle = vue.computed(() => ({
            maxWidth: `${vue.unref(inputWidth) - 32}px`,
            width: "100%"
          }));
          const tagTextStyle = vue.computed(() => {
            const maxWidth = vue.unref(inputWidth) > 123 ? vue.unref(inputWidth) - 123 : vue.unref(inputWidth) - 75;
            return { maxWidth: `${maxWidth}px` };
          });
          vue.provide(selectKey, vue.reactive({
            props,
            options,
            optionsArray,
            cachedOptions,
            optionsCount,
            filteredOptionsCount,
            hoverIndex,
            handleOptionSelect,
            onOptionCreate,
            onOptionDestroy,
            selectWrapper,
            selected,
            setSelected,
            queryChange,
            groupQueryChange
          }));
          vue.onMounted(() => {
            states.cachedPlaceHolder = currentPlaceholder.value = props.placeholder || (() => t("el.select.placeholder"));
            if (props.multiple && Array.isArray(props.modelValue) && props.modelValue.length > 0) {
              currentPlaceholder.value = "";
            }
            core.useResizeObserver(selectWrapper, handleResize);
            if (props.remote && props.multiple) {
              resetInputHeight();
            }
            vue.nextTick(() => {
              const refEl = reference.value && reference.value.$el;
              if (!refEl)
                return;
              inputWidth.value = refEl.getBoundingClientRect().width;
              if (ctx.slots.prefix) {
                const prefix = refEl.querySelector(`.${nsInput.e("prefix")}`);
                prefixWidth.value = Math.max(prefix.getBoundingClientRect().width + 5, 30);
              }
            });
            setSelected();
          });
          if (props.multiple && !Array.isArray(props.modelValue)) {
            ctx.emit(UPDATE_MODEL_EVENT, []);
          }
          if (!props.multiple && Array.isArray(props.modelValue)) {
            ctx.emit(UPDATE_MODEL_EVENT, "");
          }
          const popperPaneRef = vue.computed(() => {
            var _a, _b;
            return (_b = (_a = tooltipRef.value) == null ? void 0 : _a.popperRef) == null ? void 0 : _b.contentRef;
          });
          const onOptionsRendered = (v) => {
            optionList.value = v;
          };
          return {
            isIOS: core.isIOS,
            onOptionsRendered,
            tagInMultiLine,
            prefixWidth,
            selectSize,
            readonly: readonly2,
            handleResize,
            collapseTagSize,
            debouncedOnInputChange,
            debouncedQueryChange,
            deletePrevTag,
            deleteTag,
            deleteSelected,
            handleOptionSelect,
            scrollToOption,
            inputWidth,
            selected,
            inputLength,
            filteredOptionsCount,
            visible,
            softFocus,
            selectedLabel,
            hoverIndex,
            query,
            inputHovering,
            currentPlaceholder,
            menuVisibleOnFocus,
            isOnComposition,
            isSilentBlur,
            options,
            resetInputHeight,
            managePlaceholder,
            showClose,
            selectDisabled,
            iconComponent,
            iconReverse,
            showNewOption,
            emptyText,
            toggleLastOptionHitState,
            resetInputState,
            handleComposition,
            handleMenuEnter,
            handleFocus,
            blur,
            handleBlur,
            handleClearClick,
            handleClose,
            handleKeydownEscape,
            toggleMenu,
            selectOption,
            getValueKey,
            navigateOptions,
            dropMenuVisible,
            focus,
            reference,
            input: input2,
            iOSInput,
            tooltipRef,
            popperPaneRef,
            tags,
            selectWrapper,
            scrollbar: scrollbar2,
            wrapperKls,
            selectTagsStyle,
            nsSelect,
            tagTextStyle,
            handleMouseEnter,
            handleMouseLeave,
            showTagList,
            collapseTagList
          };
        }
      });
      const _hoisted_1$1 = ["disabled", "autocomplete"];
      const _hoisted_2 = ["disabled"];
      const _hoisted_3 = { style: { "height": "100%", "display": "flex", "justify-content": "center", "align-items": "center" } };
      function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_el_tag = vue.resolveComponent("el-tag");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_options = vue.resolveComponent("el-options");
        const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
        const _component_el_select_menu = vue.resolveComponent("el-select-menu");
        const _directive_click_outside = vue.resolveDirective("click-outside");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          ref: "selectWrapper",
          class: vue.normalizeClass(_ctx.wrapperKls),
          onMouseenter: _cache[21] || (_cache[21] = (...args) => _ctx.handleMouseEnter && _ctx.handleMouseEnter(...args)),
          onMouseleave: _cache[22] || (_cache[22] = (...args) => _ctx.handleMouseLeave && _ctx.handleMouseLeave(...args)),
          onClick: _cache[23] || (_cache[23] = vue.withModifiers((...args) => _ctx.toggleMenu && _ctx.toggleMenu(...args), ["stop"]))
        }, [
          vue.createVNode(_component_el_tooltip, {
            ref: "tooltipRef",
            visible: _ctx.dropMenuVisible,
            placement: _ctx.placement,
            teleported: _ctx.teleported,
            "popper-class": [_ctx.nsSelect.e("popper"), _ctx.popperClass],
            "popper-options": _ctx.popperOptions,
            "fallback-placements": ["bottom-start", "top-start", "right", "left"],
            effect: _ctx.effect,
            pure: "",
            trigger: "click",
            transition: `${_ctx.nsSelect.namespace.value}-zoom-in-top`,
            "stop-popper-mouse-event": false,
            "gpu-acceleration": false,
            persistent: _ctx.persistent,
            onShow: _ctx.handleMenuEnter
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", {
                class: "select-trigger",
                onMouseenter: _cache[19] || (_cache[19] = ($event) => _ctx.inputHovering = true),
                onMouseleave: _cache[20] || (_cache[20] = ($event) => _ctx.inputHovering = false)
              }, [
                _ctx.multiple ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  ref: "tags",
                  class: vue.normalizeClass(_ctx.nsSelect.e("tags")),
                  style: vue.normalizeStyle(_ctx.selectTagsStyle)
                }, [
                  _ctx.collapseTags && _ctx.selected.length ? (vue.openBlock(), vue.createBlock(vue.Transition, {
                    key: 0,
                    onAfterLeave: _ctx.resetInputHeight
                  }, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("span", {
                        class: vue.normalizeClass([
                          _ctx.nsSelect.b("tags-wrapper"),
                          { "has-prefix": _ctx.prefixWidth && _ctx.selected.length }
                        ])
                      }, [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.showTagList, (item) => {
                          return vue.openBlock(), vue.createBlock(_component_el_tag, {
                            key: _ctx.getValueKey(item),
                            closable: !_ctx.selectDisabled && !item.isDisabled,
                            size: _ctx.collapseTagSize,
                            hit: item.hitState,
                            type: _ctx.tagType,
                            "disable-transitions": "",
                            onClose: ($event) => _ctx.deleteTag($event, item)
                          }, {
                            default: vue.withCtx(() => [
                              vue.createElementVNode("span", {
                                class: vue.normalizeClass(_ctx.nsSelect.e("tags-text")),
                                style: vue.normalizeStyle(_ctx.tagTextStyle)
                              }, vue.toDisplayString(item.currentLabel), 7)
                            ]),
                            _: 2
                          }, 1032, ["closable", "size", "hit", "type", "onClose"]);
                        }), 128)),
                        _ctx.selected.length > _ctx.maxCollapseTags ? (vue.openBlock(), vue.createBlock(_component_el_tag, {
                          key: 0,
                          closable: false,
                          size: _ctx.collapseTagSize,
                          type: _ctx.tagType,
                          "disable-transitions": ""
                        }, {
                          default: vue.withCtx(() => [
                            _ctx.collapseTagsTooltip ? (vue.openBlock(), vue.createBlock(_component_el_tooltip, {
                              key: 0,
                              disabled: _ctx.dropMenuVisible,
                              "fallback-placements": ["bottom", "top", "right", "left"],
                              effect: _ctx.effect,
                              placement: "bottom",
                              teleported: _ctx.teleported
                            }, {
                              default: vue.withCtx(() => [
                                vue.createElementVNode("span", {
                                  class: vue.normalizeClass(_ctx.nsSelect.e("tags-text"))
                                }, "+ " + vue.toDisplayString(_ctx.selected.length - _ctx.maxCollapseTags), 3)
                              ]),
                              content: vue.withCtx(() => [
                                vue.createElementVNode("div", {
                                  class: vue.normalizeClass(_ctx.nsSelect.e("collapse-tags"))
                                }, [
                                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.collapseTagList, (item) => {
                                    return vue.openBlock(), vue.createElementBlock("div", {
                                      key: _ctx.getValueKey(item),
                                      class: vue.normalizeClass(_ctx.nsSelect.e("collapse-tag"))
                                    }, [
                                      vue.createVNode(_component_el_tag, {
                                        class: "in-tooltip",
                                        closable: !_ctx.selectDisabled && !item.isDisabled,
                                        size: _ctx.collapseTagSize,
                                        hit: item.hitState,
                                        type: _ctx.tagType,
                                        "disable-transitions": "",
                                        style: { margin: "2px" },
                                        onClose: ($event) => _ctx.deleteTag($event, item)
                                      }, {
                                        default: vue.withCtx(() => [
                                          vue.createElementVNode("span", {
                                            class: vue.normalizeClass(_ctx.nsSelect.e("tags-text")),
                                            style: vue.normalizeStyle({
                                              maxWidth: _ctx.inputWidth - 75 + "px"
                                            })
                                          }, vue.toDisplayString(item.currentLabel), 7)
                                        ]),
                                        _: 2
                                      }, 1032, ["closable", "size", "hit", "type", "onClose"])
                                    ], 2);
                                  }), 128))
                                ], 2)
                              ]),
                              _: 1
                            }, 8, ["disabled", "effect", "teleported"])) : (vue.openBlock(), vue.createElementBlock("span", {
                              key: 1,
                              class: vue.normalizeClass(_ctx.nsSelect.e("tags-text"))
                            }, "+ " + vue.toDisplayString(_ctx.selected.length - _ctx.maxCollapseTags), 3))
                          ]),
                          _: 1
                        }, 8, ["size", "type"])) : vue.createCommentVNode("v-if", true)
                      ], 2)
                    ]),
                    _: 1
                  }, 8, ["onAfterLeave"])) : vue.createCommentVNode("v-if", true),
                  !_ctx.collapseTags ? (vue.openBlock(), vue.createBlock(vue.Transition, {
                    key: 1,
                    onAfterLeave: _ctx.resetInputHeight
                  }, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("span", {
                        class: vue.normalizeClass([
                          _ctx.nsSelect.b("tags-wrapper"),
                          { "has-prefix": _ctx.prefixWidth && _ctx.selected.length }
                        ])
                      }, [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.selected, (item) => {
                          return vue.openBlock(), vue.createBlock(_component_el_tag, {
                            key: _ctx.getValueKey(item),
                            closable: !_ctx.selectDisabled && !item.isDisabled,
                            size: _ctx.collapseTagSize,
                            hit: item.hitState,
                            type: _ctx.tagType,
                            "disable-transitions": "",
                            onClose: ($event) => _ctx.deleteTag($event, item)
                          }, {
                            default: vue.withCtx(() => [
                              vue.createElementVNode("span", {
                                class: vue.normalizeClass(_ctx.nsSelect.e("tags-text")),
                                style: vue.normalizeStyle({ maxWidth: _ctx.inputWidth - 75 + "px" })
                              }, vue.toDisplayString(item.currentLabel), 7)
                            ]),
                            _: 2
                          }, 1032, ["closable", "size", "hit", "type", "onClose"]);
                        }), 128))
                      ], 2)
                    ]),
                    _: 1
                  }, 8, ["onAfterLeave"])) : vue.createCommentVNode("v-if", true),
                  _ctx.filterable ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                    key: 2,
                    ref: "input",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.query = $event),
                    type: "text",
                    class: vue.normalizeClass([_ctx.nsSelect.e("input"), _ctx.nsSelect.is(_ctx.selectSize)]),
                    disabled: _ctx.selectDisabled,
                    autocomplete: _ctx.autocomplete,
                    style: vue.normalizeStyle({
                      marginLeft: _ctx.prefixWidth && !_ctx.selected.length || _ctx.tagInMultiLine ? `${_ctx.prefixWidth}px` : "",
                      flexGrow: 1,
                      width: `${_ctx.inputLength / (_ctx.inputWidth - 32)}%`,
                      maxWidth: `${_ctx.inputWidth - 42}px`
                    }),
                    onFocus: _cache[1] || (_cache[1] = (...args) => _ctx.handleFocus && _ctx.handleFocus(...args)),
                    onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.handleBlur && _ctx.handleBlur(...args)),
                    onKeyup: _cache[3] || (_cache[3] = (...args) => _ctx.managePlaceholder && _ctx.managePlaceholder(...args)),
                    onKeydown: [
                      _cache[4] || (_cache[4] = (...args) => _ctx.resetInputState && _ctx.resetInputState(...args)),
                      _cache[5] || (_cache[5] = vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("next"), ["prevent"]), ["down"])),
                      _cache[6] || (_cache[6] = vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("prev"), ["prevent"]), ["up"])),
                      _cache[7] || (_cache[7] = vue.withKeys((...args) => _ctx.handleKeydownEscape && _ctx.handleKeydownEscape(...args), ["esc"])),
                      _cache[8] || (_cache[8] = vue.withKeys(vue.withModifiers((...args) => _ctx.selectOption && _ctx.selectOption(...args), ["stop", "prevent"]), ["enter"])),
                      _cache[9] || (_cache[9] = vue.withKeys((...args) => _ctx.deletePrevTag && _ctx.deletePrevTag(...args), ["delete"])),
                      _cache[10] || (_cache[10] = vue.withKeys(($event) => _ctx.visible = false, ["tab"]))
                    ],
                    onCompositionstart: _cache[11] || (_cache[11] = (...args) => _ctx.handleComposition && _ctx.handleComposition(...args)),
                    onCompositionupdate: _cache[12] || (_cache[12] = (...args) => _ctx.handleComposition && _ctx.handleComposition(...args)),
                    onCompositionend: _cache[13] || (_cache[13] = (...args) => _ctx.handleComposition && _ctx.handleComposition(...args)),
                    onInput: _cache[14] || (_cache[14] = (...args) => _ctx.debouncedQueryChange && _ctx.debouncedQueryChange(...args))
                  }, null, 46, _hoisted_1$1)), [
                    [vue.vModelText, _ctx.query]
                  ]) : vue.createCommentVNode("v-if", true)
                ], 6)) : vue.createCommentVNode("v-if", true),
                vue.createCommentVNode(" fix: https://github.com/element-plus/element-plus/issues/11415 "),
                _ctx.isIOS && !_ctx.multiple && _ctx.filterable && _ctx.readonly ? (vue.openBlock(), vue.createElementBlock("input", {
                  key: 1,
                  ref: "iOSInput",
                  class: vue.normalizeClass([
                    _ctx.nsSelect.e("input"),
                    _ctx.nsSelect.is(_ctx.selectSize),
                    _ctx.nsSelect.em("input", "iOS")
                  ]),
                  disabled: _ctx.selectDisabled,
                  type: "text"
                }, null, 10, _hoisted_2)) : vue.createCommentVNode("v-if", true),
                vue.createVNode(_component_el_input, {
                  id: _ctx.id,
                  ref: "reference",
                  modelValue: _ctx.selectedLabel,
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => _ctx.selectedLabel = $event),
                  type: "text",
                  placeholder: typeof _ctx.currentPlaceholder === "function" ? _ctx.currentPlaceholder() : _ctx.currentPlaceholder,
                  name: _ctx.name,
                  autocomplete: _ctx.autocomplete,
                  size: _ctx.selectSize,
                  disabled: _ctx.selectDisabled,
                  readonly: _ctx.readonly,
                  "validate-event": false,
                  class: vue.normalizeClass([_ctx.nsSelect.is("focus", _ctx.visible)]),
                  tabindex: _ctx.multiple && _ctx.filterable ? -1 : void 0,
                  onFocus: _ctx.handleFocus,
                  onBlur: _ctx.handleBlur,
                  onInput: _ctx.debouncedOnInputChange,
                  onPaste: _ctx.debouncedOnInputChange,
                  onCompositionstart: _ctx.handleComposition,
                  onCompositionupdate: _ctx.handleComposition,
                  onCompositionend: _ctx.handleComposition,
                  onKeydown: [
                    _cache[16] || (_cache[16] = vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("next"), ["stop", "prevent"]), ["down"])),
                    _cache[17] || (_cache[17] = vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("prev"), ["stop", "prevent"]), ["up"])),
                    vue.withKeys(vue.withModifiers(_ctx.selectOption, ["stop", "prevent"]), ["enter"]),
                    vue.withKeys(_ctx.handleKeydownEscape, ["esc"]),
                    _cache[18] || (_cache[18] = vue.withKeys(($event) => _ctx.visible = false, ["tab"]))
                  ]
                }, vue.createSlots({
                  suffix: vue.withCtx(() => [
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
                    }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
                  ]),
                  _: 2
                }, [
                  _ctx.$slots.prefix ? {
                    name: "prefix",
                    fn: vue.withCtx(() => [
                      vue.createElementVNode("div", _hoisted_3, [
                        vue.renderSlot(_ctx.$slots, "prefix")
                      ])
                    ])
                  } : void 0
                ]), 1032, ["id", "modelValue", "placeholder", "name", "autocomplete", "size", "disabled", "readonly", "class", "tabindex", "onFocus", "onBlur", "onInput", "onPaste", "onCompositionstart", "onCompositionupdate", "onCompositionend", "onKeydown"])
              ], 32)
            ]),
            content: vue.withCtx(() => [
              vue.createVNode(_component_el_select_menu, null, {
                default: vue.withCtx(() => [
                  vue.withDirectives(vue.createVNode(_component_el_scrollbar, {
                    ref: "scrollbar",
                    tag: "ul",
                    "wrap-class": _ctx.nsSelect.be("dropdown", "wrap"),
                    "view-class": _ctx.nsSelect.be("dropdown", "list"),
                    class: vue.normalizeClass([
                      _ctx.nsSelect.is("empty", !_ctx.allowCreate && Boolean(_ctx.query) && _ctx.filteredOptionsCount === 0)
                    ])
                  }, {
                    default: vue.withCtx(() => [
                      _ctx.showNewOption ? (vue.openBlock(), vue.createBlock(_component_el_option, {
                        key: 0,
                        value: _ctx.query,
                        created: true
                      }, null, 8, ["value"])) : vue.createCommentVNode("v-if", true),
                      vue.createVNode(_component_el_options, { onUpdateOptions: _ctx.onOptionsRendered }, {
                        default: vue.withCtx(() => [
                          vue.renderSlot(_ctx.$slots, "default")
                        ]),
                        _: 3
                      }, 8, ["onUpdateOptions"])
                    ]),
                    _: 3
                  }, 8, ["wrap-class", "view-class", "class"]), [
                    [vue.vShow, _ctx.options.size > 0 && !_ctx.loading]
                  ]),
                  _ctx.emptyText && (!_ctx.allowCreate || _ctx.loading || _ctx.allowCreate && _ctx.options.size === 0) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    _ctx.$slots.empty ? vue.renderSlot(_ctx.$slots, "empty", { key: 0 }) : (vue.openBlock(), vue.createElementBlock("p", {
                      key: 1,
                      class: vue.normalizeClass(_ctx.nsSelect.be("dropdown", "empty"))
                    }, vue.toDisplayString(_ctx.emptyText), 3))
                  ], 64)) : vue.createCommentVNode("v-if", true)
                ]),
                _: 3
              })
            ]),
            _: 3
          }, 8, ["visible", "placement", "teleported", "popper-class", "popper-options", "effect", "transition", "persistent", "onShow"])
        ], 34)), [
          [_directive_click_outside, _ctx.handleClose, _ctx.popperPaneRef]
        ]);
      }
      var Select = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$1], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/select/src/select.vue"]]);
      const _sfc_main$3 = vue.defineComponent({
        name: "ElOptionGroup",
        componentName: "ElOptionGroup",
        props: {
          label: String,
          disabled: {
            type: Boolean,
            default: false
          }
        },
        setup(props) {
          const ns = useNamespace("select");
          const visible = vue.ref(true);
          const instance = vue.getCurrentInstance();
          const children = vue.ref([]);
          vue.provide(selectGroupKey, vue.reactive({
            ...vue.toRefs(props)
          }));
          const select2 = vue.inject(selectKey);
          vue.onMounted(() => {
            children.value = flattedChildren(instance.subTree);
          });
          const flattedChildren = (node) => {
            const children2 = [];
            if (Array.isArray(node.children)) {
              node.children.forEach((child) => {
                var _a;
                if (child.type && child.type.name === "ElOption" && child.component && child.component.proxy) {
                  children2.push(child.component.proxy);
                } else if ((_a = child.children) == null ? void 0 : _a.length) {
                  children2.push(...flattedChildren(child));
                }
              });
            }
            return children2;
          };
          const { groupQueryChange } = vue.toRaw(select2);
          vue.watch(groupQueryChange, () => {
            visible.value = children.value.some((option2) => option2.visible === true);
          }, { flush: "post" });
          return {
            visible,
            ns
          };
        }
      });
      function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("ul", {
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
      var OptionGroup = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/select/src/option-group.vue"]]);
      const ElSelect = withInstall(Select, {
        Option,
        OptionGroup
      });
      const ElOption = withNoopInstall(Option);
      withNoopInstall(OptionGroup);
      function getQueryVariable(variable) {
        const query = window.location.search.substring(1);
        const vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
          const pair = vars[i].split("=");
          if (pair[0] === variable) {
            return pair[1];
          }
        }
        return "";
      }
      function isChromium() {
        return !!navigator.userAgent.toLowerCase().match(/chrome\/([\d.]+)/);
      }
      const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
        __name: "HightlightLog",
        setup(__props) {
          const STYLE_COLOR = ["#FFFF80", "#99ccff", "#ff99cc", "#66cc66", "#cc99ff", "#ffcc66", "#66aaaa", "#dd9966", "#aaaaaa", "#dd6699"];
          const BORDER_COLOR = ["#aaaa20", "#4477aa", "#aa4477", "#117711", "#7744aa", "#aa7711", "#115555", "#884411", "#555555", "#881144"];
          const but_c = "#99cc99", but_ca = "#FFD000", but_cd = "#999999", but_cb = "#669966";
          const PRE = "wordhighlight", ID_PRE = PRE + "_id";
          const STYLE_CLASS = "0123456789".split("").map((a, i) => PRE + "_word" + i);
          var keyword = "AnalysisException|ValueError|TypeError|ProgrammingError|JSONDecodeError|AnalysisException|NameError|IndentationError|KeyError|IndexError|AttributeError|FileNotFoundError|ConnectionError|HTTPError|Received SIGTERM|SyntaxError|OutOfMemory|Container killed by YARN for exceeding memory limits|Failed to get minimum memory|Permission denied|Memory limit exceeded|Could not resolve table reference|Could not resolve column/field reference|File does not exist|RemoteException|TExecuteStatementResp|object has no attribute|InternalError|NullPointerException|ConnectionError|Failed to close HDFS|cannot be null|IntegrityError|ArrayIndexOutOfBoundsException|has more columns|Unknown column|No such file or directory|Out Of Memory|RuntimeError|Traceback|AirflowTaskTimeout|AssertionError|Check 'stl_load_errors' system table for details|OperationalError|Lost connection to MySQL server during query|AirflowTaskTimeout|files cols number not match target file cols number, check it|Data too long for column|DataError|Initial job has not accepted any resources|/tmp/oneflow_|http://oneflow.yimian.com.cn/dag|num_dumped_rows|com.yimian.etl";
          var words = [];
          var words_off = [];
          var sheet;
          const observer1 = new MutationObserver(setup);
          const observer2 = new MutationObserver(setup);
          function setup() {
            addsheet();
            highlight(document.body);
            observer2.disconnect();
          }
          vue.onMounted(() => {
            init_keyword();
            observeTargetDOM();
          });
          function observeTargetDOM() {
            var _a, _b;
            const logMenu = document.querySelectorAll(".nav.nav-pills")[3];
            const logContent = (_b = (_a = document.querySelector(".tab-content")) == null ? void 0 : _a.lastChild) == null ? void 0 : _b.previousSibling;
            const config = { childList: true, subtree: true, attributes: true };
            if (logMenu) {
              observer1.observe(logMenu, config);
            }
            if (logContent) {
              observer2.observe(logContent, config);
            }
          }
          function init_keyword() {
            keyword = trim(keyword);
            window.name = PRE + "::" + encodeURIComponent(keyword);
            words = init_words(keyword);
          }
          function init_words(word) {
            const erg = word.match(new RegExp("^ ?/(.+)/([gim]+)?$"));
            let word_s;
            if (erg) {
              const ew = erg[1], flag = erg[2] || "";
              word_s = [{ exp: new RegExp("(" + ew + ")(?!##)", flag), text: ew, toString: function() {
                return ew;
              } }];
            } else if (word) {
              const ret = [], eword = word.replace(/"([^"]+)"/g, function($0, $1) {
                $1 && ret.push($1);
                return "";
              });
              word_s = eword.split(/[\+\|#]/).filter(function(w) {
                return !!w;
              }).concat(ret);
              word_s = Array.from(new Set(word_s));
              word_s.forEach((v, i) => {
                words_off[i] = /^[a-z0-9]$/i.test(word_s[i]);
              });
            }
            return word_s;
          }
          function highlight(doc) {
            const _words = words.filter((w, i) => !words_off[i]);
            if (_words.length <= 0)
              return;
            let exd_words, xw;
            if (_words.length === 1 && _words[0].exp) {
              exd_words = _words.map((e) => e.exp);
              xw = "";
            } else {
              exd_words = _words.map(function(w) {
                return w.test ? w : new RegExp("(" + w.replace(/\W/g, "\\$&") + ")(?!##)", "ig");
              });
              xw = " and (" + _words.map(function(w) {
                return ' contains(translate(self::text(),"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ"),' + escapeXPathExpr(w.toUpperCase()) + ") ";
              }).join(" or ") + ") ";
            }
            $X("descendant::text()[string-length(normalize-space(self::text())) > 0 " + xw + " and not(ancestor::textarea or ancestor::script or ancestor::style or ancestor::aside)]", doc).forEach(function(text_node) {
              let parent = text_node.parentNode;
              if (parent.tagName.toUpperCase() === "SPAN")
                return;
              let df, text = text_node.nodeValue, id_index = 0, range = document.createRange(), replace_strings = [];
              function recuder(text2, ew, i) {
                return text2.replace(ew, ($0, $1) => {
                  replace_strings[id_index] = '<span id="' + ID_PRE + id_index + '" class="' + STYLE_CLASS[i % 10] + '" name="' + PRE + "_word" + i + '">' + $1 + "</span>";
                  return "##" + id_index++ + "##";
                });
              }
              let new_text = reduce(exd_words, recuder, text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/##(\d+)##/g, ($0, $1) => replace_strings[$1] || "");
              if (replace_strings.length) {
                try {
                  if (isChromium()) {
                    const htmlDoc = document.implementation.createHTMLDocument("hogehoge");
                    range.selectNodeContents(htmlDoc.documentElement);
                  } else {
                    range.selectNode(text_node);
                  }
                  df = range.createContextualFragment(new_text);
                  if (df.firstChild)
                    parent.replaceChild(df, text_node);
                  range.detach();
                } catch (e) {
                  console.error(e);
                }
              }
            });
          }
          function addsheet() {
            const hilistyles = STYLE_COLOR.map((rgb, i) => {
              return "span." + PRE + "_word" + i + ",." + PRE + "_item" + i + "{background:" + rgb + "!important;}";
            });
            const borderstyles = BORDER_COLOR.map((rgb, i) => {
              return "li." + PRE + "_item" + i + "{outline:1px solid " + rgb + "!important;}";
            });
            const panel_pos_arr = ["right:-1px;", "bottom:-1px;"];
            sheet = addCSS([
              // Additional Style
              'span[class^="' + PRE + '_word"]{color:black!important;font:inherit!important;display:inline!important;margin:0!important;padding:0!important;text-align:inherit!important;float:none!important;position:static!important;}',
              "#" + PRE + "_words, #" + PRE + "_words *{font-family: Arial ;}",
              "#" + PRE + "_words{line-height:1;position:fixed;z-index:60000;opacity:0.8;list-style-type:none;margin:0;padding:0;width:auto;max-width:100%;" + panel_pos_arr[0] + panel_pos_arr[1] + "}",
              "#" + PRE + "_words > section{clear:right;line-height:1;border:1px solid #666;/*border-left-width:10px;*/background:#fff;display:block;position:relative;}",
              "#" + PRE + "_words * {margin:0;padding:0;width:auto;height:auto;}",
              "#" + PRE + "_words:hover{opacity:1;}",
              "#" + PRE + "_words:hover > section{opacity:1;border-color:#333;}",
              "#" + PRE + "_words #_ewh_handle{background:#666;width:10px;cursor:move;}",
              "#" + PRE + "_words:hover #_ewh_handle{background:#333;}",
              "#" + PRE + "_words.ewh_hide #_ewh_handle{cursor:pointer;}",
              // '#' + PRE + '_words.ewh_hide:hover #_ewh_handle{width:10px;}',
              // '#' + PRE + '_words.ewh_hide > section form.' + PRE + '_ctrl > input.c_b{display:none;}',
              "#" + PRE + "_words > nav{display:none;width:100%;padding:3px;position:relative;}",
              "#" + PRE + "_words > nav > canvas.backport{background:rgba(0,0,0,0.5);cursor:pointer;position:absolute;right:6px;z-index:3;}",
              "#" + PRE + "_words > nav > canvas.viewport{background:rgba(79,168,255,0.7);cursor:default;position:absolute;bottom:0px;right:6px;}",
              "#" + PRE + "_words:hover > nav{display:block;}",
              "#" + PRE + "_words > nav._locked{display:block;}",
              "#" + PRE + "_words:hover > nav > canvas.backport{bottom:0px;}",
              "#" + PRE + "_words > nav._locked > canvas.backport{bottom:0px;}",
              "#" + PRE + "_words.ewh_edit{opacity:1;}",
              "#" + PRE + "_words.ewh_edit #" + PRE + "_word_inputs_list{display:none;}",
              "#" + PRE + "_words form." + PRE + "_editor{display:none;}",
              "#" + PRE + "_words.ewh_edit form." + PRE + "_editor{display:inline-block;}",
              "#" + PRE + "_words.ewh_edit form." + PRE + "_editor input{min-width:80px;}",
              "#" + PRE + "_words li{display:inline-block;margin:0.1em 0.2em;line-height:1.3em;font-size:medium;}",
              "#" + PRE + "_words > section > * {vertical-align:middle;}",
              "#" + PRE + "_words > section td {border:none;}",
              "#" + PRE + "_words > section > h3." + PRE + "_title{display:inline-block;background:#333;color:#fff;padding:0.1em 0.3em;border:none;margin:0 0.2em;}",
              "#" + PRE + "_words > section  form." + PRE + "_ctrl{display:inline-block;}",
              "#" + PRE + "_words > section  form." + PRE + "_ctrl > input{display:inline;width:1.3em;margin:0.1em 0.1em;background:" + but_c + ";border:1px solid " + but_cb + ";cursor:pointer;font-size:10pt;color:black;}",
              "#" + PRE + "_words > section  form." + PRE + "_ctrl > input._active{background:" + but_ca + ";}",
              "#" + PRE + "_words > section  form." + PRE + "_ctrl > input._disable{background:" + but_cd + " !important;cursor:default;}",
              "#" + PRE + "_words > section  form." + PRE + "_ctrl > input:hover{outline:1px solid " + but_cb + "!important;}",
              "#" + PRE + "_word_inputs_list {padding:0!important;margin:0.2em!important;display:inline-block;border:none!important;}",
              "#" + PRE + "_word_inputs_list > li{position:relative;padding:0 4px;}",
              "#" + PRE + "_word_inputs_list > li.ewh_disable{background:white!important;outline:1px solid #999!important;}",
              "#" + PRE + "_word_inputs_list > li > label{cursor:pointer;color:black!important;}",
              "#" + PRE + "_word_inputs_list > li > input{cursor:pointer;}",
              // '#' + PRE + '_word_inputs_list > li > label > input[type=image]{vertical-align:top;padding:0;height:12px;}',
              "#" + PRE + "_word_inputs_list > li > input[type=checkbox]{display:none;position:absolute;right:0px;top:0px;opacity:0.7;}",
              "#" + PRE + "_word_inputs_list > li:hover{outline-width:2px!important;}",
              "#" + PRE + "_word_inputs_list > li:hover > input[type=checkbox]{display:block;}",
              "#" + PRE + "_word_inputs_list > li > input[type=checkbox]:hover{opacity:1;}",
              "#" + PRE + "_words > section td+td+td > input {display:inline;width:1.3em;margin:0.1em 0.1em;background:#FAFAFA;border:1px solid #aaaaaa;cursor:pointer;font-size:10pt;color:black;}"
            ].concat(hilistyles, borderstyles).join("\n"));
          }
          function addCSS(css) {
            sheet = document.createElement("style");
            sheet.type = "text/css";
            sheet.textContent = css;
            document.body.appendChild(sheet).sheet;
          }
          function trim(str) {
            return str.replace(/[\n\r]+/g, " ").replace(/^\s+|\s+$/g, "").replace(/\.+\s|\.+$/g, "");
          }
          function escapeXPathExpr(text) {
            var matches = text.match(/[^"]+|"/g);
            function esc(t) {
              return t == '"' ? "'" + t + "'" : '"' + t + '"';
            }
            if (matches) {
              if (matches.length == 1) {
                return esc(matches[0]);
              } else {
                var results = [];
                for (var i = 0, len = matches.length; i < len; i++) {
                  results.push(esc(matches[i]));
                }
                return "concat(" + results.join(", ") + ")";
              }
            } else {
              return '""';
            }
          }
          function $X(exp, context, resolver, result_type) {
            context || (context = document);
            const Doc = context.ownerDocument || context;
            const result = Doc.evaluate(exp, context, resolver, result_type || XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if (result_type)
              return result;
            for (var i = 0, len = result.snapshotLength, res = new Array(len); i < len; i++) {
              res[i] = result.snapshotItem(i);
            }
            return res;
          }
          function reduce(arr, fun, text) {
            var len = arr.length, i = 0, rv;
            if (arguments.length >= 3)
              rv = arguments[2];
            else {
              do {
                if (i in arr) {
                  rv = arr[i++];
                  break;
                }
                if (++i >= len)
                  throw new TypeError();
              } while (true);
            }
            for (; i < len; i++)
              if (i in arr)
                rv = fun.call(null, rv, arr[i], i, arr);
            return rv;
          }
          return () => {
          };
        }
      });
      var shams = function hasSymbols2() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (sym in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = shams;
      var hasSymbols$1 = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var slice = Array.prototype.slice;
      var toStr$1 = Object.prototype.toString;
      var funcType = "[object Function]";
      var implementation$1 = function bind2(that) {
        var target = this;
        if (typeof target !== "function" || toStr$1.call(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice.call(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          } else {
            return target.apply(
              that,
              args.concat(slice.call(arguments))
            );
          }
        };
        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs.push("$" + i);
        }
        bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
      var implementation = implementation$1;
      var functionBind = Function.prototype.bind || implementation;
      var bind$1 = functionBind;
      var src = bind$1.call(Function.call, Object.prototype.hasOwnProperty);
      var undefined$1;
      var $SyntaxError = SyntaxError;
      var $Function = Function;
      var $TypeError$1 = TypeError;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = Object.getOwnPropertyDescriptor;
      if ($gOPD) {
        try {
          $gOPD({}, "");
        } catch (e) {
          $gOPD = null;
        }
      }
      var throwTypeError = function() {
        throw new $TypeError$1();
      };
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = hasSymbols$1();
      var getProto = Object.getPrototypeOf || function(x) {
        return x.__proto__;
      };
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" ? undefined$1 : getProto(Uint8Array);
      var INTRINSICS = {
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols ? getProto([][Symbol.iterator]()) : undefined$1,
        "%AsyncFromSyncIteratorPrototype%": undefined$1,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
        "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined$1 : BigInt64Array,
        "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined$1 : BigUint64Array,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": Error,
        "%eval%": eval,
        // eslint-disable-line no-eval
        "%EvalError%": EvalError,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
        "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
        "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols ? undefined$1 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": Object,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
        "%RangeError%": RangeError,
        "%ReferenceError%": ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols ? undefined$1 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols ? getProto(""[Symbol.iterator]()) : undefined$1,
        "%Symbol%": hasSymbols ? Symbol : undefined$1,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError$1,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
        "%URIError%": URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet
      };
      try {
        null.error;
      } catch (e) {
        var errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn2 = doEval2("%AsyncGeneratorFunction%");
          if (fn2) {
            value = fn2.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = functionBind;
      var hasOwn$1 = src;
      var $concat$1 = bind.call(Function.call, Array.prototype.concat);
      var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
      var $replace$1 = bind.call(Function.call, String.prototype.replace);
      var $strSlice = bind.call(Function.call, String.prototype.slice);
      var $exec = bind.call(Function.call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace$1(string, rePropName, function(match, number, quote2, subString) {
          result[result.length] = quote2 ? $replace$1(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn$1(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn$1(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError$1("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      var getIntrinsic = function GetIntrinsic2(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError$1("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError$1('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat$1([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn$1(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError$1("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn$1(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
      var callBindExports = {};
      var callBind$1 = {
        get exports() {
          return callBindExports;
        },
        set exports(v) {
          callBindExports = v;
        }
      };
      (function(module2) {
        var bind2 = functionBind;
        var GetIntrinsic2 = getIntrinsic;
        var $apply = GetIntrinsic2("%Function.prototype.apply%");
        var $call = GetIntrinsic2("%Function.prototype.call%");
        var $reflectApply = GetIntrinsic2("%Reflect.apply%", true) || bind2.call($call, $apply);
        var $gOPD2 = GetIntrinsic2("%Object.getOwnPropertyDescriptor%", true);
        var $defineProperty = GetIntrinsic2("%Object.defineProperty%", true);
        var $max = GetIntrinsic2("%Math.max%");
        if ($defineProperty) {
          try {
            $defineProperty({}, "a", { value: 1 });
          } catch (e) {
            $defineProperty = null;
          }
        }
        module2.exports = function callBind2(originalFunction) {
          var func = $reflectApply(bind2, $call, arguments);
          if ($gOPD2 && $defineProperty) {
            var desc = $gOPD2(func, "length");
            if (desc.configurable) {
              $defineProperty(
                func,
                "length",
                { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
              );
            }
          }
          return func;
        };
        var applyBind = function applyBind2() {
          return $reflectApply(bind2, $apply, arguments);
        };
        if ($defineProperty) {
          $defineProperty(module2.exports, "apply", { value: applyBind });
        } else {
          module2.exports.apply = applyBind;
        }
      })(callBind$1);
      var GetIntrinsic$1 = getIntrinsic;
      var callBind = callBindExports;
      var $indexOf = callBind(GetIntrinsic$1("String.prototype.indexOf"));
      var callBound$1 = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic$1(name, !!allowMissing);
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBind(intrinsic);
        }
        return intrinsic;
      };
      const __viteBrowserExternal = {};
      const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
        __proto__: null,
        default: __viteBrowserExternal
      }, Symbol.toStringTag, { value: "Module" }));
      const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
      var hasMap = typeof Map === "function" && Map.prototype;
      var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
      var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
      var mapForEach = hasMap && Map.prototype.forEach;
      var hasSet = typeof Set === "function" && Set.prototype;
      var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
      var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
      var setForEach = hasSet && Set.prototype.forEach;
      var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
      var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
      var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
      var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
      var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
      var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
      var booleanValueOf = Boolean.prototype.valueOf;
      var objectToString = Object.prototype.toString;
      var functionToString = Function.prototype.toString;
      var $match = String.prototype.match;
      var $slice = String.prototype.slice;
      var $replace = String.prototype.replace;
      var $toUpperCase = String.prototype.toUpperCase;
      var $toLowerCase = String.prototype.toLowerCase;
      var $test = RegExp.prototype.test;
      var $concat = Array.prototype.concat;
      var $join = Array.prototype.join;
      var $arrSlice = Array.prototype.slice;
      var $floor = Math.floor;
      var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
      var gOPS = Object.getOwnPropertySymbols;
      var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
      var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
      var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
      var isEnumerable = Object.prototype.propertyIsEnumerable;
      var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
        return O.__proto__;
      } : null);
      function addNumericSeparator(num, str) {
        if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
          return str;
        }
        var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
        if (typeof num === "number") {
          var int = num < 0 ? -$floor(-num) : $floor(num);
          if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
          }
        }
        return $replace.call(str, sepRegex, "$&_");
      }
      var utilInspect = require$$0;
      var inspectCustom = utilInspect.custom;
      var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
      var objectInspect = function inspect_(obj, options, depth, seen) {
        var opts = options || {};
        if (has$3(opts, "quoteStyle") && (opts.quoteStyle !== "single" && opts.quoteStyle !== "double")) {
          throw new TypeError('option "quoteStyle" must be "single" or "double"');
        }
        if (has$3(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
          throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
        }
        var customInspect = has$3(opts, "customInspect") ? opts.customInspect : true;
        if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
          throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
        }
        if (has$3(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
          throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
        }
        if (has$3(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
          throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
        }
        var numericSeparator = opts.numericSeparator;
        if (typeof obj === "undefined") {
          return "undefined";
        }
        if (obj === null) {
          return "null";
        }
        if (typeof obj === "boolean") {
          return obj ? "true" : "false";
        }
        if (typeof obj === "string") {
          return inspectString(obj, opts);
        }
        if (typeof obj === "number") {
          if (obj === 0) {
            return Infinity / obj > 0 ? "0" : "-0";
          }
          var str = String(obj);
          return numericSeparator ? addNumericSeparator(obj, str) : str;
        }
        if (typeof obj === "bigint") {
          var bigIntStr = String(obj) + "n";
          return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
        }
        var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
        if (typeof depth === "undefined") {
          depth = 0;
        }
        if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
          return isArray$3(obj) ? "[Array]" : "[Object]";
        }
        var indent = getIndent(opts, depth);
        if (typeof seen === "undefined") {
          seen = [];
        } else if (indexOf(seen, obj) >= 0) {
          return "[Circular]";
        }
        function inspect2(value, from, noIndent) {
          if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
          }
          if (noIndent) {
            var newOpts = {
              depth: opts.depth
            };
            if (has$3(opts, "quoteStyle")) {
              newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
          }
          return inspect_(value, opts, depth + 1, seen);
        }
        if (typeof obj === "function" && !isRegExp$1(obj)) {
          var name = nameOf(obj);
          var keys2 = arrObjKeys(obj, inspect2);
          return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys2.length > 0 ? " { " + $join.call(keys2, ", ") + " }" : "");
        }
        if (isSymbol(obj)) {
          var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
          return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
        }
        if (isElement(obj)) {
          var s = "<" + $toLowerCase.call(String(obj.nodeName));
          var attrs = obj.attributes || [];
          for (var i = 0; i < attrs.length; i++) {
            s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
          }
          s += ">";
          if (obj.childNodes && obj.childNodes.length) {
            s += "...";
          }
          s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
          return s;
        }
        if (isArray$3(obj)) {
          if (obj.length === 0) {
            return "[]";
          }
          var xs = arrObjKeys(obj, inspect2);
          if (indent && !singleLineValues(xs)) {
            return "[" + indentedJoin(xs, indent) + "]";
          }
          return "[ " + $join.call(xs, ", ") + " ]";
        }
        if (isError(obj)) {
          var parts = arrObjKeys(obj, inspect2);
          if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
            return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect2(obj.cause), parts), ", ") + " }";
          }
          if (parts.length === 0) {
            return "[" + String(obj) + "]";
          }
          return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
        }
        if (typeof obj === "object" && customInspect) {
          if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
          } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
            return obj.inspect();
          }
        }
        if (isMap(obj)) {
          var mapParts = [];
          if (mapForEach) {
            mapForEach.call(obj, function(value, key) {
              mapParts.push(inspect2(key, obj, true) + " => " + inspect2(value, obj));
            });
          }
          return collectionOf("Map", mapSize.call(obj), mapParts, indent);
        }
        if (isSet(obj)) {
          var setParts = [];
          if (setForEach) {
            setForEach.call(obj, function(value) {
              setParts.push(inspect2(value, obj));
            });
          }
          return collectionOf("Set", setSize.call(obj), setParts, indent);
        }
        if (isWeakMap(obj)) {
          return weakCollectionOf("WeakMap");
        }
        if (isWeakSet(obj)) {
          return weakCollectionOf("WeakSet");
        }
        if (isWeakRef(obj)) {
          return weakCollectionOf("WeakRef");
        }
        if (isNumber(obj)) {
          return markBoxed(inspect2(Number(obj)));
        }
        if (isBigInt(obj)) {
          return markBoxed(inspect2(bigIntValueOf.call(obj)));
        }
        if (isBoolean(obj)) {
          return markBoxed(booleanValueOf.call(obj));
        }
        if (isString(obj)) {
          return markBoxed(inspect2(String(obj)));
        }
        if (!isDate(obj) && !isRegExp$1(obj)) {
          var ys = arrObjKeys(obj, inspect2);
          var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
          var protoTag = obj instanceof Object ? "" : "null prototype";
          var stringTag2 = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
          var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
          var tag2 = constructorTag + (stringTag2 || protoTag ? "[" + $join.call($concat.call([], stringTag2 || [], protoTag || []), ": ") + "] " : "");
          if (ys.length === 0) {
            return tag2 + "{}";
          }
          if (indent) {
            return tag2 + "{" + indentedJoin(ys, indent) + "}";
          }
          return tag2 + "{ " + $join.call(ys, ", ") + " }";
        }
        return String(obj);
      };
      function wrapQuotes(s, defaultStyle, opts) {
        var quoteChar = (opts.quoteStyle || defaultStyle) === "double" ? '"' : "'";
        return quoteChar + s + quoteChar;
      }
      function quote(s) {
        return $replace.call(String(s), /"/g, "&quot;");
      }
      function isArray$3(obj) {
        return toStr(obj) === "[object Array]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isDate(obj) {
        return toStr(obj) === "[object Date]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isRegExp$1(obj) {
        return toStr(obj) === "[object RegExp]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isError(obj) {
        return toStr(obj) === "[object Error]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isString(obj) {
        return toStr(obj) === "[object String]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isNumber(obj) {
        return toStr(obj) === "[object Number]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isBoolean(obj) {
        return toStr(obj) === "[object Boolean]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isSymbol(obj) {
        if (hasShammedSymbols) {
          return obj && typeof obj === "object" && obj instanceof Symbol;
        }
        if (typeof obj === "symbol") {
          return true;
        }
        if (!obj || typeof obj !== "object" || !symToString) {
          return false;
        }
        try {
          symToString.call(obj);
          return true;
        } catch (e) {
        }
        return false;
      }
      function isBigInt(obj) {
        if (!obj || typeof obj !== "object" || !bigIntValueOf) {
          return false;
        }
        try {
          bigIntValueOf.call(obj);
          return true;
        } catch (e) {
        }
        return false;
      }
      var hasOwn = Object.prototype.hasOwnProperty || function(key) {
        return key in this;
      };
      function has$3(obj, key) {
        return hasOwn.call(obj, key);
      }
      function toStr(obj) {
        return objectToString.call(obj);
      }
      function nameOf(f) {
        if (f.name) {
          return f.name;
        }
        var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
        if (m) {
          return m[1];
        }
        return null;
      }
      function indexOf(xs, x) {
        if (xs.indexOf) {
          return xs.indexOf(x);
        }
        for (var i = 0, l = xs.length; i < l; i++) {
          if (xs[i] === x) {
            return i;
          }
        }
        return -1;
      }
      function isMap(x) {
        if (!mapSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          mapSize.call(x);
          try {
            setSize.call(x);
          } catch (s) {
            return true;
          }
          return x instanceof Map;
        } catch (e) {
        }
        return false;
      }
      function isWeakMap(x) {
        if (!weakMapHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakMapHas.call(x, weakMapHas);
          try {
            weakSetHas.call(x, weakSetHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakMap;
        } catch (e) {
        }
        return false;
      }
      function isWeakRef(x) {
        if (!weakRefDeref || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakRefDeref.call(x);
          return true;
        } catch (e) {
        }
        return false;
      }
      function isSet(x) {
        if (!setSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          setSize.call(x);
          try {
            mapSize.call(x);
          } catch (m) {
            return true;
          }
          return x instanceof Set;
        } catch (e) {
        }
        return false;
      }
      function isWeakSet(x) {
        if (!weakSetHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakSetHas.call(x, weakSetHas);
          try {
            weakMapHas.call(x, weakMapHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakSet;
        } catch (e) {
        }
        return false;
      }
      function isElement(x) {
        if (!x || typeof x !== "object") {
          return false;
        }
        if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
          return true;
        }
        return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
      }
      function inspectString(str, opts) {
        if (str.length > opts.maxStringLength) {
          var remaining = str.length - opts.maxStringLength;
          var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
          return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
        }
        var s = $replace.call($replace.call(str, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, lowbyte);
        return wrapQuotes(s, "single", opts);
      }
      function lowbyte(c) {
        var n = c.charCodeAt(0);
        var x = {
          8: "b",
          9: "t",
          10: "n",
          12: "f",
          13: "r"
        }[n];
        if (x) {
          return "\\" + x;
        }
        return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
      }
      function markBoxed(str) {
        return "Object(" + str + ")";
      }
      function weakCollectionOf(type) {
        return type + " { ? }";
      }
      function collectionOf(type, size, entries, indent) {
        var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
        return type + " (" + size + ") {" + joinedEntries + "}";
      }
      function singleLineValues(xs) {
        for (var i = 0; i < xs.length; i++) {
          if (indexOf(xs[i], "\n") >= 0) {
            return false;
          }
        }
        return true;
      }
      function getIndent(opts, depth) {
        var baseIndent;
        if (opts.indent === "	") {
          baseIndent = "	";
        } else if (typeof opts.indent === "number" && opts.indent > 0) {
          baseIndent = $join.call(Array(opts.indent + 1), " ");
        } else {
          return null;
        }
        return {
          base: baseIndent,
          prev: $join.call(Array(depth + 1), baseIndent)
        };
      }
      function indentedJoin(xs, indent) {
        if (xs.length === 0) {
          return "";
        }
        var lineJoiner = "\n" + indent.prev + indent.base;
        return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
      }
      function arrObjKeys(obj, inspect2) {
        var isArr = isArray$3(obj);
        var xs = [];
        if (isArr) {
          xs.length = obj.length;
          for (var i = 0; i < obj.length; i++) {
            xs[i] = has$3(obj, i) ? inspect2(obj[i], obj) : "";
          }
        }
        var syms = typeof gOPS === "function" ? gOPS(obj) : [];
        var symMap;
        if (hasShammedSymbols) {
          symMap = {};
          for (var k = 0; k < syms.length; k++) {
            symMap["$" + syms[k]] = syms[k];
          }
        }
        for (var key in obj) {
          if (!has$3(obj, key)) {
            continue;
          }
          if (isArr && String(Number(key)) === key && key < obj.length) {
            continue;
          }
          if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
            continue;
          } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect2(key, obj) + ": " + inspect2(obj[key], obj));
          } else {
            xs.push(key + ": " + inspect2(obj[key], obj));
          }
        }
        if (typeof gOPS === "function") {
          for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
              xs.push("[" + inspect2(syms[j]) + "]: " + inspect2(obj[syms[j]], obj));
            }
          }
        }
        return xs;
      }
      var GetIntrinsic = getIntrinsic;
      var callBound = callBound$1;
      var inspect = objectInspect;
      var $TypeError = GetIntrinsic("%TypeError%");
      var $WeakMap = GetIntrinsic("%WeakMap%", true);
      var $Map = GetIntrinsic("%Map%", true);
      var $weakMapGet = callBound("WeakMap.prototype.get", true);
      var $weakMapSet = callBound("WeakMap.prototype.set", true);
      var $weakMapHas = callBound("WeakMap.prototype.has", true);
      var $mapGet = callBound("Map.prototype.get", true);
      var $mapSet = callBound("Map.prototype.set", true);
      var $mapHas = callBound("Map.prototype.has", true);
      var listGetNode = function(list, key) {
        for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
          if (curr.key === key) {
            prev.next = curr.next;
            curr.next = list.next;
            list.next = curr;
            return curr;
          }
        }
      };
      var listGet = function(objects, key) {
        var node = listGetNode(objects, key);
        return node && node.value;
      };
      var listSet = function(objects, key, value) {
        var node = listGetNode(objects, key);
        if (node) {
          node.value = value;
        } else {
          objects.next = {
            // eslint-disable-line no-param-reassign
            key,
            next: objects.next,
            value
          };
        }
      };
      var listHas = function(objects, key) {
        return !!listGetNode(objects, key);
      };
      var sideChannel = function getSideChannel2() {
        var $wm;
        var $m;
        var $o;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          get: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            } else if ($Map) {
              if ($m) {
                return $mapGet($m, key);
              }
            } else {
              if ($o) {
                return listGet($o, key);
              }
            }
          },
          has: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            } else if ($Map) {
              if ($m) {
                return $mapHas($m, key);
              }
            } else {
              if ($o) {
                return listHas($o, key);
              }
            }
            return false;
          },
          set: function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if ($Map) {
              if (!$m) {
                $m = new $Map();
              }
              $mapSet($m, key, value);
            } else {
              if (!$o) {
                $o = { key: {}, next: null };
              }
              listSet($o, key, value);
            }
          }
        };
        return channel;
      };
      var replace = String.prototype.replace;
      var percentTwenties = /%20/g;
      var Format = {
        RFC1738: "RFC1738",
        RFC3986: "RFC3986"
      };
      var formats$3 = {
        "default": Format.RFC3986,
        formatters: {
          RFC1738: function(value) {
            return replace.call(value, percentTwenties, "+");
          },
          RFC3986: function(value) {
            return String(value);
          }
        },
        RFC1738: Format.RFC1738,
        RFC3986: Format.RFC3986
      };
      var formats$2 = formats$3;
      var has$2 = Object.prototype.hasOwnProperty;
      var isArray$2 = Array.isArray;
      var hexTable = function() {
        var array = [];
        for (var i = 0; i < 256; ++i) {
          array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
        }
        return array;
      }();
      var compactQueue = function compactQueue2(queue) {
        while (queue.length > 1) {
          var item = queue.pop();
          var obj = item.obj[item.prop];
          if (isArray$2(obj)) {
            var compacted = [];
            for (var j = 0; j < obj.length; ++j) {
              if (typeof obj[j] !== "undefined") {
                compacted.push(obj[j]);
              }
            }
            item.obj[item.prop] = compacted;
          }
        }
      };
      var arrayToObject = function arrayToObject2(source, options) {
        var obj = options && options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        for (var i = 0; i < source.length; ++i) {
          if (typeof source[i] !== "undefined") {
            obj[i] = source[i];
          }
        }
        return obj;
      };
      var merge = function merge2(target, source, options) {
        if (!source) {
          return target;
        }
        if (typeof source !== "object") {
          if (isArray$2(target)) {
            target.push(source);
          } else if (target && typeof target === "object") {
            if (options && (options.plainObjects || options.allowPrototypes) || !has$2.call(Object.prototype, source)) {
              target[source] = true;
            }
          } else {
            return [target, source];
          }
          return target;
        }
        if (!target || typeof target !== "object") {
          return [target].concat(source);
        }
        var mergeTarget = target;
        if (isArray$2(target) && !isArray$2(source)) {
          mergeTarget = arrayToObject(target, options);
        }
        if (isArray$2(target) && isArray$2(source)) {
          source.forEach(function(item, i) {
            if (has$2.call(target, i)) {
              var targetItem = target[i];
              if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
                target[i] = merge2(targetItem, item, options);
              } else {
                target.push(item);
              }
            } else {
              target[i] = item;
            }
          });
          return target;
        }
        return Object.keys(source).reduce(function(acc, key) {
          var value = source[key];
          if (has$2.call(acc, key)) {
            acc[key] = merge2(acc[key], value, options);
          } else {
            acc[key] = value;
          }
          return acc;
        }, mergeTarget);
      };
      var assign = function assignSingleSource(target, source) {
        return Object.keys(source).reduce(function(acc, key) {
          acc[key] = source[key];
          return acc;
        }, target);
      };
      var decode = function(str, decoder, charset) {
        var strWithoutPlus = str.replace(/\+/g, " ");
        if (charset === "iso-8859-1") {
          return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
        }
        try {
          return decodeURIComponent(strWithoutPlus);
        } catch (e) {
          return strWithoutPlus;
        }
      };
      var encode = function encode2(str, defaultEncoder, charset, kind, format) {
        if (str.length === 0) {
          return str;
        }
        var string = str;
        if (typeof str === "symbol") {
          string = Symbol.prototype.toString.call(str);
        } else if (typeof str !== "string") {
          string = String(str);
        }
        if (charset === "iso-8859-1") {
          return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
            return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
          });
        }
        var out = "";
        for (var i = 0; i < string.length; ++i) {
          var c = string.charCodeAt(i);
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats$2.RFC1738 && (c === 40 || c === 41)) {
            out += string.charAt(i);
            continue;
          }
          if (c < 128) {
            out = out + hexTable[c];
            continue;
          }
          if (c < 2048) {
            out = out + (hexTable[192 | c >> 6] + hexTable[128 | c & 63]);
            continue;
          }
          if (c < 55296 || c >= 57344) {
            out = out + (hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63]);
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | string.charCodeAt(i) & 1023);
          out += hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
        }
        return out;
      };
      var compact = function compact2(value) {
        var queue = [{ obj: { o: value }, prop: "o" }];
        var refs = [];
        for (var i = 0; i < queue.length; ++i) {
          var item = queue[i];
          var obj = item.obj[item.prop];
          var keys2 = Object.keys(obj);
          for (var j = 0; j < keys2.length; ++j) {
            var key = keys2[j];
            var val = obj[key];
            if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
              queue.push({ obj, prop: key });
              refs.push(val);
            }
          }
        }
        compactQueue(queue);
        return value;
      };
      var isRegExp = function isRegExp2(obj) {
        return Object.prototype.toString.call(obj) === "[object RegExp]";
      };
      var isBuffer = function isBuffer2(obj) {
        if (!obj || typeof obj !== "object") {
          return false;
        }
        return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
      };
      var combine = function combine2(a, b) {
        return [].concat(a, b);
      };
      var maybeMap = function maybeMap2(val, fn2) {
        if (isArray$2(val)) {
          var mapped = [];
          for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn2(val[i]));
          }
          return mapped;
        }
        return fn2(val);
      };
      var utils$2 = {
        arrayToObject,
        assign,
        combine,
        compact,
        decode,
        encode,
        isBuffer,
        isRegExp,
        maybeMap,
        merge
      };
      var getSideChannel = sideChannel;
      var utils$1 = utils$2;
      var formats$1 = formats$3;
      var has$1 = Object.prototype.hasOwnProperty;
      var arrayPrefixGenerators = {
        brackets: function brackets(prefix) {
          return prefix + "[]";
        },
        comma: "comma",
        indices: function indices(prefix, key) {
          return prefix + "[" + key + "]";
        },
        repeat: function repeat(prefix) {
          return prefix;
        }
      };
      var isArray$1 = Array.isArray;
      var push = Array.prototype.push;
      var pushToArray = function(arr, valueOrArray) {
        push.apply(arr, isArray$1(valueOrArray) ? valueOrArray : [valueOrArray]);
      };
      var toISO = Date.prototype.toISOString;
      var defaultFormat = formats$1["default"];
      var defaults$1 = {
        addQueryPrefix: false,
        allowDots: false,
        charset: "utf-8",
        charsetSentinel: false,
        delimiter: "&",
        encode: true,
        encoder: utils$1.encode,
        encodeValuesOnly: false,
        format: defaultFormat,
        formatter: formats$1.formatters[defaultFormat],
        // deprecated
        indices: false,
        serializeDate: function serializeDate(date) {
          return toISO.call(date);
        },
        skipNulls: false,
        strictNullHandling: false
      };
      var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
        return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
      };
      var sentinel = {};
      var stringify$1 = function stringify2(object, prefix, generateArrayPrefix, commaRoundTrip, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel2) {
        var obj = object;
        var tmpSc = sideChannel2;
        var step = 0;
        var findFlag = false;
        while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
          var pos = tmpSc.get(object);
          step += 1;
          if (typeof pos !== "undefined") {
            if (pos === step) {
              throw new RangeError("Cyclic object value");
            } else {
              findFlag = true;
            }
          }
          if (typeof tmpSc.get(sentinel) === "undefined") {
            step = 0;
          }
        }
        if (typeof filter === "function") {
          obj = filter(prefix, obj);
        } else if (obj instanceof Date) {
          obj = serializeDate(obj);
        } else if (generateArrayPrefix === "comma" && isArray$1(obj)) {
          obj = utils$1.maybeMap(obj, function(value2) {
            if (value2 instanceof Date) {
              return serializeDate(value2);
            }
            return value2;
          });
        }
        if (obj === null) {
          if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults$1.encoder, charset, "key", format) : prefix;
          }
          obj = "";
        }
        if (isNonNullishPrimitive(obj) || utils$1.isBuffer(obj)) {
          if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults$1.encoder, charset, "key", format);
            return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults$1.encoder, charset, "value", format))];
          }
          return [formatter(prefix) + "=" + formatter(String(obj))];
        }
        var values = [];
        if (typeof obj === "undefined") {
          return values;
        }
        var objKeys;
        if (generateArrayPrefix === "comma" && isArray$1(obj)) {
          if (encodeValuesOnly && encoder) {
            obj = utils$1.maybeMap(obj, encoder);
          }
          objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
        } else if (isArray$1(filter)) {
          objKeys = filter;
        } else {
          var keys2 = Object.keys(obj);
          objKeys = sort ? keys2.sort(sort) : keys2;
        }
        var adjustedPrefix = commaRoundTrip && isArray$1(obj) && obj.length === 1 ? prefix + "[]" : prefix;
        for (var j = 0; j < objKeys.length; ++j) {
          var key = objKeys[j];
          var value = typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key];
          if (skipNulls && value === null) {
            continue;
          }
          var keyPrefix = isArray$1(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + key : "[" + key + "]");
          sideChannel2.set(object, step);
          var valueSideChannel = getSideChannel();
          valueSideChannel.set(sentinel, sideChannel2);
          pushToArray(values, stringify2(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            strictNullHandling,
            skipNulls,
            generateArrayPrefix === "comma" && encodeValuesOnly && isArray$1(obj) ? null : encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
          ));
        }
        return values;
      };
      var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
        if (!opts) {
          return defaults$1;
        }
        if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
          throw new TypeError("Encoder has to be a function.");
        }
        var charset = opts.charset || defaults$1.charset;
        if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
          throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        }
        var format = formats$1["default"];
        if (typeof opts.format !== "undefined") {
          if (!has$1.call(formats$1.formatters, opts.format)) {
            throw new TypeError("Unknown format option provided.");
          }
          format = opts.format;
        }
        var formatter = formats$1.formatters[format];
        var filter = defaults$1.filter;
        if (typeof opts.filter === "function" || isArray$1(opts.filter)) {
          filter = opts.filter;
        }
        return {
          addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults$1.addQueryPrefix,
          allowDots: typeof opts.allowDots === "undefined" ? defaults$1.allowDots : !!opts.allowDots,
          charset,
          charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults$1.charsetSentinel,
          delimiter: typeof opts.delimiter === "undefined" ? defaults$1.delimiter : opts.delimiter,
          encode: typeof opts.encode === "boolean" ? opts.encode : defaults$1.encode,
          encoder: typeof opts.encoder === "function" ? opts.encoder : defaults$1.encoder,
          encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults$1.encodeValuesOnly,
          filter,
          format,
          formatter,
          serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults$1.serializeDate,
          skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults$1.skipNulls,
          sort: typeof opts.sort === "function" ? opts.sort : null,
          strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults$1.strictNullHandling
        };
      };
      var stringify_1 = function(object, opts) {
        var obj = object;
        var options = normalizeStringifyOptions(opts);
        var objKeys;
        var filter;
        if (typeof options.filter === "function") {
          filter = options.filter;
          obj = filter("", obj);
        } else if (isArray$1(options.filter)) {
          filter = options.filter;
          objKeys = filter;
        }
        var keys2 = [];
        if (typeof obj !== "object" || obj === null) {
          return "";
        }
        var arrayFormat;
        if (opts && opts.arrayFormat in arrayPrefixGenerators) {
          arrayFormat = opts.arrayFormat;
        } else if (opts && "indices" in opts) {
          arrayFormat = opts.indices ? "indices" : "repeat";
        } else {
          arrayFormat = "indices";
        }
        var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
        if (opts && "commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
          throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
        }
        var commaRoundTrip = generateArrayPrefix === "comma" && opts && opts.commaRoundTrip;
        if (!objKeys) {
          objKeys = Object.keys(obj);
        }
        if (options.sort) {
          objKeys.sort(options.sort);
        }
        var sideChannel2 = getSideChannel();
        for (var i = 0; i < objKeys.length; ++i) {
          var key = objKeys[i];
          if (options.skipNulls && obj[key] === null) {
            continue;
          }
          pushToArray(keys2, stringify$1(
            obj[key],
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel2
          ));
        }
        var joined = keys2.join(options.delimiter);
        var prefix = options.addQueryPrefix === true ? "?" : "";
        if (options.charsetSentinel) {
          if (options.charset === "iso-8859-1") {
            prefix += "utf8=%26%2310003%3B&";
          } else {
            prefix += "utf8=%E2%9C%93&";
          }
        }
        return joined.length > 0 ? prefix + joined : "";
      };
      var utils = utils$2;
      var has = Object.prototype.hasOwnProperty;
      var isArray = Array.isArray;
      var defaults = {
        allowDots: false,
        allowPrototypes: false,
        allowSparse: false,
        arrayLimit: 20,
        charset: "utf-8",
        charsetSentinel: false,
        comma: false,
        decoder: utils.decode,
        delimiter: "&",
        depth: 5,
        ignoreQueryPrefix: false,
        interpretNumericEntities: false,
        parameterLimit: 1e3,
        parseArrays: true,
        plainObjects: false,
        strictNullHandling: false
      };
      var interpretNumericEntities = function(str) {
        return str.replace(/&#(\d+);/g, function($0, numberStr) {
          return String.fromCharCode(parseInt(numberStr, 10));
        });
      };
      var parseArrayValue = function(val, options) {
        if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
          return val.split(",");
        }
        return val;
      };
      var isoSentinel = "utf8=%26%2310003%3B";
      var charsetSentinel = "utf8=%E2%9C%93";
      var parseValues = function parseQueryStringValues(str, options) {
        var obj = {};
        var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
        var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
        var parts = cleanStr.split(options.delimiter, limit);
        var skipIndex = -1;
        var i;
        var charset = options.charset;
        if (options.charsetSentinel) {
          for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf("utf8=") === 0) {
              if (parts[i] === charsetSentinel) {
                charset = "utf-8";
              } else if (parts[i] === isoSentinel) {
                charset = "iso-8859-1";
              }
              skipIndex = i;
              i = parts.length;
            }
          }
        }
        for (i = 0; i < parts.length; ++i) {
          if (i === skipIndex) {
            continue;
          }
          var part = parts[i];
          var bracketEqualsPos = part.indexOf("]=");
          var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
          var key, val;
          if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, "key");
            val = options.strictNullHandling ? null : "";
          } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
            val = utils.maybeMap(
              parseArrayValue(part.slice(pos + 1), options),
              function(encodedVal) {
                return options.decoder(encodedVal, defaults.decoder, charset, "value");
              }
            );
          }
          if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
            val = interpretNumericEntities(val);
          }
          if (part.indexOf("[]=") > -1) {
            val = isArray(val) ? [val] : val;
          }
          if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
          } else {
            obj[key] = val;
          }
        }
        return obj;
      };
      var parseObject = function(chain, val, options, valuesParsed) {
        var leaf = valuesParsed ? val : parseArrayValue(val, options);
        for (var i = chain.length - 1; i >= 0; --i) {
          var obj;
          var root2 = chain[i];
          if (root2 === "[]" && options.parseArrays) {
            obj = [].concat(leaf);
          } else {
            obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
            var cleanRoot = root2.charAt(0) === "[" && root2.charAt(root2.length - 1) === "]" ? root2.slice(1, -1) : root2;
            var index2 = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === "") {
              obj = { 0: leaf };
            } else if (!isNaN(index2) && root2 !== cleanRoot && String(index2) === cleanRoot && index2 >= 0 && (options.parseArrays && index2 <= options.arrayLimit)) {
              obj = [];
              obj[index2] = leaf;
            } else if (cleanRoot !== "__proto__") {
              obj[cleanRoot] = leaf;
            }
          }
          leaf = obj;
        }
        return leaf;
      };
      var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
        if (!givenKey) {
          return;
        }
        var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
        var brackets = /(\[[^[\]]*])/;
        var child = /(\[[^[\]]*])/g;
        var segment = options.depth > 0 && brackets.exec(key);
        var parent = segment ? key.slice(0, segment.index) : key;
        var keys2 = [];
        if (parent) {
          if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
              return;
            }
          }
          keys2.push(parent);
        }
        var i = 0;
        while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
          i += 1;
          if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
              return;
            }
          }
          keys2.push(segment[1]);
        }
        if (segment) {
          keys2.push("[" + key.slice(segment.index) + "]");
        }
        return parseObject(keys2, val, options, valuesParsed);
      };
      var normalizeParseOptions = function normalizeParseOptions2(opts) {
        if (!opts) {
          return defaults;
        }
        if (opts.decoder !== null && opts.decoder !== void 0 && typeof opts.decoder !== "function") {
          throw new TypeError("Decoder has to be a function.");
        }
        if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
          throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        }
        var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
        return {
          allowDots: typeof opts.allowDots === "undefined" ? defaults.allowDots : !!opts.allowDots,
          allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
          allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
          arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
          charset,
          charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
          comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
          decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
          delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
          // eslint-disable-next-line no-implicit-coercion, no-extra-parens
          depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
          ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
          interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
          parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
          parseArrays: opts.parseArrays !== false,
          plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
          strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
        };
      };
      var parse$1 = function(str, opts) {
        var options = normalizeParseOptions(opts);
        if (str === "" || str === null || typeof str === "undefined") {
          return options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        }
        var tempObj = typeof str === "string" ? parseValues(str, options) : str;
        var obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        var keys2 = Object.keys(tempObj);
        for (var i = 0; i < keys2.length; ++i) {
          var key = keys2[i];
          var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
          obj = utils.merge(obj, newObj, options);
        }
        if (options.allowSparse === true) {
          return obj;
        }
        return utils.compact(obj);
      };
      var stringify = stringify_1;
      var parse = parse$1;
      var formats = formats$3;
      var lib = {
        formats,
        parse,
        stringify
      };
      const _hoisted_1 = { class: "flex justify-end mt-2" };
      const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
        __name: "MarkDagStatus",
        setup(__props) {
          const markRef = vue.ref();
          const { width, height } = core.useWindowSize();
          const { style } = core.useDraggable(markRef, {
            initialValue: { x: 20, y: height.value - 150 },
            onMove: (position) => {
              var _a, _b;
              position.x = position.x < 0 ? 0 : Math.min(position.x, width.value - ((_a = markRef.value) == null ? void 0 : _a.clientWidth));
              position.y = position.y < 0 ? 0 : Math.min(position.y, height.value - ((_b = markRef.value) == null ? void 0 : _b.clientHeight));
            }
          });
          const loading = vue.reactive({
            clear: false,
            failed: false,
            success: false
          });
          const state = vue.reactive({
            activeNodes: [],
            options: [],
            activeActions: [],
            actions: ["Past", "Future", "Upstream", "Downstream", "Recursive", "Failed"]
          });
          function getNodes() {
            const dag_id = document.title.split(" ")[0];
            const num_runs = getQueryVariable("num_runs") ?? 25;
            fetch(`${origin}/object/grid_data?dag_id=${dag_id}&num_runs=${num_runs}`).then((response) => response.json()).then((res) => {
              state.options = res.groups.children.map((v) => v.id);
            });
          }
          async function mark(type) {
            loading[type] = true;
            try {
              const promises = state.activeNodes.map((node) => getNodeInfo(type, node));
              await Promise.all(promises);
              console.log("operation successed");
              elementPlus.ElMessage.success("操作成功");
            } catch (error) {
              console.error(error);
            }
            loading[type] = false;
          }
          function getNodeInfo(type, taskId) {
            var _a, _b;
            const dag_id = document.title.split(" ")[0];
            const task_replace_id = taskId.includes("latest_only") ? taskId.split("latest_only")[0] + "latest_only" : taskId;
            const num_runs = (_b = (_a = document.querySelector("#root")) == null ? void 0 : _a.shadowRoot) == null ? void 0 : _b.querySelector(".chakra-select.c-s4irmj");
            console.log("num_runs", num_runs);
            const { origin: origin2 } = window.location;
            fetch(`${origin2}/object/grid_data?dag_id=${dag_id}&num_runs=${num_runs}`).then((response) => response.json()).then((res) => {
              const promises = res.dag_runs.map((row) => markItem(type, task_replace_id, row.run_id, row.execution_date));
              Promise.all(promises).then(() => {
                console.log("all promises are success");
                state.activeNodes = [];
                state.activeActions = [];
              });
            }).catch((error) => {
              console.error("Error:", error);
            });
          }
          function markItem(type, task_id, run_id, execution_date) {
            const dag_id = document.title.split(" ")[0];
            const body = {
              csrf_token: window.csrfToken,
              dag_id,
              dag_run_id: run_id,
              task_id,
              confirmed: true,
              past: state.activeActions.includes("Past"),
              future: state.activeActions.includes("Future"),
              upstream: state.activeActions.includes("Upstream"),
              downstream: state.activeActions.includes("Downstream"),
              recursive: state.activeActions.includes("Recursive"),
              only_failed: state.activeActions.includes("Failed")
            };
            if (type === "clear") {
              body.execution_date = execution_date;
            }
            const { origin: origin2, href } = window.location;
            const post_dict = {
              headers: {
                accept: "application/json,text/html,application/xml",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
                "upgrade-insecure-requests": "1"
              },
              referrer: href,
              referrerPolicy: "strict-origin-when-cross-origin",
              method: "POST",
              redirect: "manual",
              mode: "cors",
              credentials: "include",
              body: lib.stringify(body)
            };
            return fetch(`${origin2}/${type}`, post_dict).then((response) => console.log(response.status)).catch((error) => {
              console.error("Error:", error);
            });
          }
          vue.onMounted(() => {
            getNodes();
          });
          return (_ctx, _cache) => {
            const _component_el_checkbox_button = ElCheckboxButton;
            const _component_el_checkbox_group = ElCheckboxGroup;
            const _component_el_option = ElOption;
            const _component_el_select = ElSelect;
            const _component_el_button = ElButton;
            return vue.openBlock(), vue.createElementBlock("div", {
              ref_key: "markRef",
              ref: markRef,
              style: vue.normalizeStyle(vue.unref(style)),
              class: "w-[488px] bg-white shadow-md p-3 cursor-move fixed z-[999]"
            }, [
              vue.createVNode(_component_el_checkbox_group, {
                modelValue: vue.unref(state).activeActions,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(state).activeActions = $event)
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(state).actions, (action) => {
                    return vue.openBlock(), vue.createBlock(_component_el_checkbox_button, {
                      key: action,
                      label: action
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(action), 1)
                      ]),
                      _: 2
                    }, 1032, ["label"]);
                  }), 128))
                ]),
                _: 1
              }, 8, ["modelValue"]),
              vue.createVNode(_component_el_select, {
                modelValue: vue.unref(state).activeNodes,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(state).activeNodes = $event),
                multiple: "",
                filterable: "",
                clearable: "",
                placeholder: "Select task id",
                class: "w-full mr-4"
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(state).options, (item) => {
                    return vue.openBlock(), vue.createBlock(_component_el_option, {
                      key: item,
                      label: item,
                      value: item
                    }, null, 8, ["label", "value"]);
                  }), 128))
                ]),
                _: 1
              }, 8, ["modelValue"]),
              vue.createElementVNode("div", _hoisted_1, [
                vue.createVNode(_component_el_button, {
                  type: "primary",
                  disabled: !vue.unref(state).activeNodes.length,
                  loading: vue.unref(loading).clear,
                  onClick: _cache[2] || (_cache[2] = ($event) => mark("clear"))
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" Clear ")
                  ]),
                  _: 1
                }, 8, ["disabled", "loading"]),
                vue.createVNode(_component_el_button, {
                  type: "danger",
                  disabled: !vue.unref(state).activeNodes.length,
                  loading: vue.unref(loading).failed,
                  onClick: _cache[3] || (_cache[3] = ($event) => mark("failed"))
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" Mark Failed ")
                  ]),
                  _: 1
                }, 8, ["disabled", "loading"]),
                vue.createVNode(_component_el_button, {
                  type: "success",
                  disabled: !vue.unref(state).activeNodes.length,
                  loading: vue.unref(loading).failed,
                  onClick: _cache[4] || (_cache[4] = ($event) => mark("success"))
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" Mark Success ")
                  ]),
                  _: 1
                }, 8, ["disabled", "loading"])
              ])
            ], 4);
          };
        }
      });
      var zhCn$1 = {};
      (function(exports2) {
        Object.defineProperty(exports2, "__esModule", { value: true });
        var zhCn2 = {
          name: "zh-cn",
          el: {
            colorpicker: {
              confirm: "确定",
              clear: "清空"
            },
            datepicker: {
              now: "此刻",
              today: "今天",
              cancel: "取消",
              clear: "清空",
              confirm: "确定",
              selectDate: "选择日期",
              selectTime: "选择时间",
              startDate: "开始日期",
              startTime: "开始时间",
              endDate: "结束日期",
              endTime: "结束时间",
              prevYear: "前一年",
              nextYear: "后一年",
              prevMonth: "上个月",
              nextMonth: "下个月",
              year: "年",
              month1: "1 月",
              month2: "2 月",
              month3: "3 月",
              month4: "4 月",
              month5: "5 月",
              month6: "6 月",
              month7: "7 月",
              month8: "8 月",
              month9: "9 月",
              month10: "10 月",
              month11: "11 月",
              month12: "12 月",
              weeks: {
                sun: "日",
                mon: "一",
                tue: "二",
                wed: "三",
                thu: "四",
                fri: "五",
                sat: "六"
              },
              months: {
                jan: "一月",
                feb: "二月",
                mar: "三月",
                apr: "四月",
                may: "五月",
                jun: "六月",
                jul: "七月",
                aug: "八月",
                sep: "九月",
                oct: "十月",
                nov: "十一月",
                dec: "十二月"
              }
            },
            select: {
              loading: "加载中",
              noMatch: "无匹配数据",
              noData: "无数据",
              placeholder: "请选择"
            },
            cascader: {
              noMatch: "无匹配数据",
              loading: "加载中",
              placeholder: "请选择",
              noData: "暂无数据"
            },
            pagination: {
              goto: "前往",
              pagesize: "条/页",
              total: "共 {total} 条",
              pageClassifier: "页",
              page: "页",
              prev: "上一页",
              next: "下一页",
              currentPage: "第 {pager} 页",
              prevPages: "向前 {pager} 页",
              nextPages: "向后 {pager} 页",
              deprecationWarning: "你使用了一些已被废弃的用法，请参考 el-pagination 的官方文档"
            },
            messagebox: {
              title: "提示",
              confirm: "确定",
              cancel: "取消",
              error: "输入的数据不合法!"
            },
            upload: {
              deleteTip: "按 delete 键可删除",
              delete: "删除",
              preview: "查看图片",
              continue: "继续上传"
            },
            table: {
              emptyText: "暂无数据",
              confirmFilter: "筛选",
              resetFilter: "重置",
              clearFilter: "全部",
              sumText: "合计"
            },
            tree: {
              emptyText: "暂无数据"
            },
            transfer: {
              noMatch: "无匹配数据",
              noData: "无数据",
              titles: ["列表 1", "列表 2"],
              filterPlaceholder: "请输入搜索内容",
              noCheckedFormat: "共 {total} 项",
              hasCheckedFormat: "已选 {checked}/{total} 项"
            },
            image: {
              error: "加载失败"
            },
            pageHeader: {
              title: "返回"
            },
            popconfirm: {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          }
        };
        exports2["default"] = zhCn2;
      })(zhCn$1);
      const zhCn = /* @__PURE__ */ getDefaultExportFromCjs(zhCn$1);
      const _sfc_main = /* @__PURE__ */ vue.defineComponent({
        __name: "App",
        setup(__props) {
          const isRenderMarkDag = vue.computed(() => {
            const { href } = window.location;
            return href.indexOf("/grid") > -1 || href.indexOf("/graph") > -1;
          });
          const isRenderHightlight = vue.computed(() => {
            const { href } = window.location;
            return href.indexOf("/log") > -1;
          });
          return (_ctx, _cache) => {
            const _component_MarkDagStatus = _sfc_main$1;
            const _component_HightlightLog = _sfc_main$2;
            const _component_el_config_provider = ElConfigProvider;
            return vue.openBlock(), vue.createBlock(_component_el_config_provider, { locale: vue.unref(zhCn) }, {
              default: vue.withCtx(() => [
                vue.unref(isRenderMarkDag) ? (vue.openBlock(), vue.createBlock(_component_MarkDagStatus, { key: 0 })) : vue.createCommentVNode("", true),
                vue.unref(isRenderHightlight) ? (vue.openBlock(), vue.createBlock(_component_HightlightLog, { key: 1 })) : vue.createCommentVNode("", true)
              ]),
              _: 1
            }, 8, ["locale"]);
          };
        }
      });
      const app = vue.createApp(_sfc_main);
      const container = () => {
        const div = document.createElement("div");
        document.body.appendChild(div);
        return div;
      };
      app.mount(container());
    }
  });
  require_main_001();

})(Vue, VueUse, ElementPlus);
