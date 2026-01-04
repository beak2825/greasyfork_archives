// ==UserScript==
// @name         🔥🔥火遍全网抖音视频一键无水印下载，优化页面🔥🔥
// @namespace    https://www.softrr.cn/
// @version      1.1.0
// @author       hackhase
// @description  PC版抖音视频下载，支持一键解析，无水印下载，优化页面！
// @license      MIT
// @icon         https://www.douyin.com/p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/favicon.png
// @match        *://www.douyin.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.11/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.6.1/dist/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.6.1/dist/index.css
// @connect      www.softrr.cn
// @connect      www.douyin.com
// @connect      ci.ak47.ink
// @connect      tiktokio.com
// @connect      dl.tiktokio.com
// @connect      api.softrr.cn
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/485644/%F0%9F%94%A5%F0%9F%94%A5%E7%81%AB%E9%81%8D%E5%85%A8%E7%BD%91%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD%EF%BC%8C%E4%BC%98%E5%8C%96%E9%A1%B5%E9%9D%A2%F0%9F%94%A5%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/485644/%F0%9F%94%A5%F0%9F%94%A5%E7%81%AB%E9%81%8D%E5%85%A8%E7%BD%91%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD%EF%BC%8C%E4%BC%98%E5%8C%96%E9%A1%B5%E9%9D%A2%F0%9F%94%A5%F0%9F%94%A5.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const r=document.createElement("style");r.textContent=e,document.head.append(r)})(' @charset "UTF-8";:root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}:root{--el-color-white:#ffffff;--el-color-black:#000000;--el-color-primary-rgb:64,158,255;--el-color-success-rgb:103,194,58;--el-color-warning-rgb:230,162,60;--el-color-danger-rgb:245,108,108;--el-color-error-rgb:245,108,108;--el-color-info-rgb:144,147,153;--el-font-size-extra-large:20px;--el-font-size-large:18px;--el-font-size-medium:16px;--el-font-size-base:14px;--el-font-size-small:13px;--el-font-size-extra-small:12px;--el-font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\u5FAE\u8F6F\u96C5\u9ED1",Arial,sans-serif;--el-font-weight-primary:500;--el-font-line-height-primary:24px;--el-index-normal:1;--el-index-top:1000;--el-index-popper:2000;--el-border-radius-base:4px;--el-border-radius-small:2px;--el-border-radius-round:20px;--el-border-radius-circle:100%;--el-transition-duration:.3s;--el-transition-duration-fast:.2s;--el-transition-function-ease-in-out-bezier:cubic-bezier(.645, .045, .355, 1);--el-transition-function-fast-bezier:cubic-bezier(.23, 1, .32, 1);--el-transition-all:all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);--el-transition-fade:opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-md-fade:transform var(--el-transition-duration) var(--el-transition-function-fast-bezier),opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-fade-linear:opacity var(--el-transition-duration-fast) linear;--el-transition-border:border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-box-shadow:box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-color:color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-component-size-large:40px;--el-component-size:32px;--el-component-size-small:24px}:root{color-scheme:light;--el-color-white:#ffffff;--el-color-black:#000000;--el-color-primary:#409eff;--el-color-primary-light-3:#79bbff;--el-color-primary-light-5:#a0cfff;--el-color-primary-light-7:#c6e2ff;--el-color-primary-light-8:#d9ecff;--el-color-primary-light-9:#ecf5ff;--el-color-primary-dark-2:#337ecc;--el-color-success:#67c23a;--el-color-success-light-3:#95d475;--el-color-success-light-5:#b3e19d;--el-color-success-light-7:#d1edc4;--el-color-success-light-8:#e1f3d8;--el-color-success-light-9:#f0f9eb;--el-color-success-dark-2:#529b2e;--el-color-warning:#e6a23c;--el-color-warning-light-3:#eebe77;--el-color-warning-light-5:#f3d19e;--el-color-warning-light-7:#f8e3c5;--el-color-warning-light-8:#faecd8;--el-color-warning-light-9:#fdf6ec;--el-color-warning-dark-2:#b88230;--el-color-danger:#f56c6c;--el-color-danger-light-3:#f89898;--el-color-danger-light-5:#fab6b6;--el-color-danger-light-7:#fcd3d3;--el-color-danger-light-8:#fde2e2;--el-color-danger-light-9:#fef0f0;--el-color-danger-dark-2:#c45656;--el-color-error:#f56c6c;--el-color-error-light-3:#f89898;--el-color-error-light-5:#fab6b6;--el-color-error-light-7:#fcd3d3;--el-color-error-light-8:#fde2e2;--el-color-error-light-9:#fef0f0;--el-color-error-dark-2:#c45656;--el-color-info:#909399;--el-color-info-light-3:#b1b3b8;--el-color-info-light-5:#c8c9cc;--el-color-info-light-7:#dedfe0;--el-color-info-light-8:#e9e9eb;--el-color-info-light-9:#f4f4f5;--el-color-info-dark-2:#73767a;--el-bg-color:#ffffff;--el-bg-color-page:#f2f3f5;--el-bg-color-overlay:#ffffff;--el-text-color-primary:#303133;--el-text-color-regular:#606266;--el-text-color-secondary:#909399;--el-text-color-placeholder:#a8abb2;--el-text-color-disabled:#c0c4cc;--el-border-color:#dcdfe6;--el-border-color-light:#e4e7ed;--el-border-color-lighter:#ebeef5;--el-border-color-extra-light:#f2f6fc;--el-border-color-dark:#d4d7de;--el-border-color-darker:#cdd0d6;--el-fill-color:#f0f2f5;--el-fill-color-light:#f5f7fa;--el-fill-color-lighter:#fafafa;--el-fill-color-extra-light:#fafcff;--el-fill-color-dark:#ebedf0;--el-fill-color-darker:#e6e8eb;--el-fill-color-blank:#ffffff;--el-box-shadow:0px 12px 32px 4px rgba(0, 0, 0, .04),0px 8px 20px rgba(0, 0, 0, .08);--el-box-shadow-light:0px 0px 12px rgba(0, 0, 0, .12);--el-box-shadow-lighter:0px 0px 6px rgba(0, 0, 0, .12);--el-box-shadow-dark:0px 16px 48px 16px rgba(0, 0, 0, .08),0px 12px 32px rgba(0, 0, 0, .12),0px 8px 16px -8px rgba(0, 0, 0, .16);--el-disabled-bg-color:var(--el-fill-color-light);--el-disabled-text-color:var(--el-text-color-placeholder);--el-disabled-border-color:var(--el-border-color-light);--el-overlay-color:rgba(0, 0, 0, .8);--el-overlay-color-light:rgba(0, 0, 0, .7);--el-overlay-color-lighter:rgba(0, 0, 0, .5);--el-mask-color:rgba(255, 255, 255, .9);--el-mask-color-extra-light:rgba(255, 255, 255, .3);--el-border-width:1px;--el-border-style:solid;--el-border-color-hover:var(--el-text-color-disabled);--el-border:var(--el-border-width) var(--el-border-style) var(--el-border-color);--el-svg-monochrome-grey:var(--el-border-color)}.fade-in-linear-enter-active,.fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.fade-in-linear-enter-from,.fade-in-linear-leave-to{opacity:0}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.el-fade-in-linear-enter-from,.el-fade-in-linear-leave-to{opacity:0}.el-fade-in-enter-active,.el-fade-in-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-fade-in-enter-from,.el-fade-in-leave-active{opacity:0}.el-zoom-in-center-enter-active,.el-zoom-in-center-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-zoom-in-center-enter-from,.el-zoom-in-center-leave-active{opacity:0;transform:scaleX(0)}.el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;transform:scaleY(1);transition:var(--el-transition-md-fade);transform-origin:center top}.el-zoom-in-top-enter-active[data-popper-placement^=top],.el-zoom-in-top-leave-active[data-popper-placement^=top]{transform-origin:center bottom}.el-zoom-in-top-enter-from,.el-zoom-in-top-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-bottom-enter-active,.el-zoom-in-bottom-leave-active{opacity:1;transform:scaleY(1);transition:var(--el-transition-md-fade);transform-origin:center bottom}.el-zoom-in-bottom-enter-from,.el-zoom-in-bottom-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-left-enter-active,.el-zoom-in-left-leave-active{opacity:1;transform:scale(1);transition:var(--el-transition-md-fade);transform-origin:top left}.el-zoom-in-left-enter-from,.el-zoom-in-left-leave-active{opacity:0;transform:scale(.45)}.collapse-transition{transition:var(--el-transition-duration) height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.el-collapse-transition-enter-active,.el-collapse-transition-leave-active{transition:var(--el-transition-duration) max-height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.horizontal-collapse-transition{transition:var(--el-transition-duration) width ease-in-out,var(--el-transition-duration) padding-left ease-in-out,var(--el-transition-duration) padding-right ease-in-out}.el-list-enter-active,.el-list-leave-active{transition:all 1s}.el-list-enter-from,.el-list-leave-to{opacity:0;transform:translateY(-30px)}.el-list-leave-active{position:absolute!important}.el-opacity-transition{transition:opacity var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-icon-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon--right{margin-left:5px}.el-icon--left{margin-right:5px}@-webkit-keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.el-icon{--color:inherit;height:1em;width:1em;line-height:1em;display:inline-flex;justify-content:center;align-items:center;position:relative;fill:currentColor;color:var(--color);font-size:inherit}.el-icon.is-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon svg{height:1em;width:1em}.el-progress{position:relative;line-height:1;display:flex;align-items:center}.el-progress__text{font-size:14px;color:var(--el-text-color-regular);margin-left:5px;min-width:50px;line-height:1}.el-progress__text i{vertical-align:middle;display:block}.el-progress--circle,.el-progress--dashboard{display:inline-block}.el-progress--circle .el-progress__text,.el-progress--dashboard .el-progress__text{position:absolute;top:50%;left:0;width:100%;text-align:center;margin:0;transform:translateY(-50%)}.el-progress--circle .el-progress__text i,.el-progress--dashboard .el-progress__text i{vertical-align:middle;display:inline-block}.el-progress--without-text .el-progress__text{display:none}.el-progress--without-text .el-progress-bar{padding-right:0;margin-right:0;display:block}.el-progress--text-inside .el-progress-bar{padding-right:0;margin-right:0}.el-progress.is-success .el-progress-bar__inner{background-color:var(--el-color-success)}.el-progress.is-success .el-progress__text{color:var(--el-color-success)}.el-progress.is-warning .el-progress-bar__inner{background-color:var(--el-color-warning)}.el-progress.is-warning .el-progress__text{color:var(--el-color-warning)}.el-progress.is-exception .el-progress-bar__inner{background-color:var(--el-color-danger)}.el-progress.is-exception .el-progress__text{color:var(--el-color-danger)}.el-progress-bar{flex-grow:1;box-sizing:border-box}.el-progress-bar__outer{height:6px;border-radius:100px;background-color:var(--el-border-color-lighter);overflow:hidden;position:relative;vertical-align:middle}.el-progress-bar__inner{position:absolute;left:0;top:0;height:100%;background-color:var(--el-color-primary);text-align:right;border-radius:100px;line-height:1;white-space:nowrap;transition:width .6s ease}.el-progress-bar__inner:after{display:inline-block;content:"";height:100%;vertical-align:middle}.el-progress-bar__inner--indeterminate{transform:translateZ(0);-webkit-animation:indeterminate 3s infinite;animation:indeterminate 3s infinite}.el-progress-bar__inner--striped{background-image:linear-gradient(45deg,rgba(0,0,0,.1) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.1) 75%,transparent 75%,transparent);background-size:1.25em 1.25em}.el-progress-bar__inner--striped.el-progress-bar__inner--striped-flow{-webkit-animation:striped-flow 3s linear infinite;animation:striped-flow 3s linear infinite}.el-progress-bar__innerText{display:inline-block;vertical-align:middle;color:#fff;font-size:12px;margin:0 5px}@-webkit-keyframes progress{0%{background-position:0 0}to{background-position:32px 0}}@keyframes progress{0%{background-position:0 0}to{background-position:32px 0}}@-webkit-keyframes indeterminate{0%{left:-100%}to{left:100%}}@keyframes indeterminate{0%{left:-100%}to{left:100%}}@-webkit-keyframes striped-flow{0%{background-position:-100%}to{background-position:100%}}@keyframes striped-flow{0%{background-position:-100%}to{background-position:100%}}.modal-wrapper[data-v-c870d347]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000080;display:flex;justify-content:center;align-items:center;z-index:9999}.modal[data-v-c870d347]{background-color:#fff;padding:20px;border-radius:5px}.header[data-v-c870d347]{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.header h2[data-v-c870d347]{margin:0;font-size:20px;font-weight:700}.header button[data-v-c870d347]{border:none;background-color:transparent;font-size:20px;cursor:pointer}.content[data-v-c870d347]{max-height:400px;overflow:auto;font-size:16px;display:flex;justify-content:space-between}.content .produce p[data-v-c870d347]{margin-top:15px}.content .produce .ipt[data-v-c870d347]{margin-top:15px;height:30px;border-radius:5px;padding-left:10px}.content .img[data-v-c870d347]{display:flex;align-items:center;justify-content:center}.content .img img[data-v-c870d347]{width:180px}input[data-v-c870d347]::-webkit-input-placeholder{color:#aab2bd;font-size:14px;padding-left:5px}.copy[data-v-758cdfc2]{width:160px;position:fixed;right:10px;top:80px;color:#111;z-index:999;display:flex;flex-direction:column}.copy .btn[data-v-758cdfc2]{width:120px;height:40px;background-color:red;color:#fff;border-radius:10%}.copy .btn[data-v-758cdfc2]:hover{background-color:#87ceeb;color:#fff}.copy .progressDown[data-v-758cdfc2]{margin-top:10px;max-width:120px}.demo-progress .el-progress--line[data-v-758cdfc2]{margin-bottom:15px;max-width:120px} ');

(function (vue, elementPlus) {
  'use strict';

  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isObject = (val) => val !== null && typeof val === "object";
  function fromPairs(pairs) {
    var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
    while (++index < length) {
      var pair = pairs[index];
      result[pair[0]] = pair[1];
    }
    return result;
  }
  const isUndefined = (val) => val === void 0;
  const isNumber = (val) => typeof val === "number";
  const isStringNumber = (val) => {
    if (!isString(val)) {
      return false;
    }
    return !Number.isNaN(Number(val));
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
  /*! Element Plus Icons Vue v2.3.1 */
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
  const isEpProp = (val) => isObject(val) && !!val[epPropKey];
  const buildProp = (prop, key) => {
    if (!isObject(prop) || isEpProp(prop))
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
  const __default__$1 = vue.defineComponent({
    name: "ElIcon",
    inheritAttrs: false
  });
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
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
  var Icon = /* @__PURE__ */ _export_sfc$1(_sfc_main$3, [["__file", "icon.vue"]]);
  const ElIcon = withInstall(Icon);
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
        var _a;
        const { color } = props;
        if (isFunction(color)) {
          return color(percentage);
        } else if (isString(color)) {
          return color;
        } else {
          const colors = getColors(color);
          for (const color2 of colors) {
            if (color2.percentage > percentage)
              return color2.color;
          }
          return (_a = colors[colors.length - 1]) == null ? void 0 : _a.color;
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
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-c870d347"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "modal" };
  const _hoisted_2 = { class: "header" };
  const _hoisted_3 = { class: "content" };
  const _hoisted_4 = { class: "produce" };
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "1、扫描右侧公众号，点击关注！", -1));
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "2、在软件爬取者后台回复：验证码", -1));
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
  const Model = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c870d347"]]);
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
  const getDownLoad = (douyinurl) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "POST",
        url: `https://tiktokio.com/api/v1/tk-htmx`,
        headers: {
          authority: "tiktokio.com",
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/x-www-form-urlencoded",
          "hx-current-url": "https://tiktokio.com/zh/douyin-downloader/",
          "hx-request": "true",
          "hx-target": "tiktok-parse-result",
          "hx-trigger": "search-btn",
          origin: "https://tiktokio.com",
          referer: "https://tiktokio.com/zh/douyin-downloader/",
          "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Safari/537.36"
        },
        // data: JSON.stringify({
        //   'prefix': 'dtGslxrcdcG9raW8uY29t',
        //   'vid': douyinurl,
        // }),
        data: `prefix=dtGslxrcdcG9raW8uY29t&vid=${douyinurl}`,
        onload: function(res) {
          resolve(res.response);
        }
      });
    });
  };
  const downloadFile = (url, fileName) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    if ("download" in a) {
      a.download = fileName || "导出文件";
    } else {
      console.log("您的浏览器可能不支持自动设置文件名，下载后请手动重命名");
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const _hoisted_1 = { class: "copy" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      window.onload = () => {
        if (document.getElementsByClassName("ezAK2PYX").length > 0) {
          document.getElementsByClassName("ezAK2PYX")[0].style.display = "none";
        }
        if (document.getElementsByClassName("box-align-center").length > 0) {
          document.getElementsByClassName("box-align-center").style.display = "none";
        }
        if (document.querySelector(".xg-switch") !== null) {
          document.querySelector(".xg-switch").classList.add("xg-switch-checked");
        }
      };
      const code = vue.ref();
      const model = vue.ref("");
      const flag = vue.ref(false);
      const percentage = vue.ref(0);
      const onDownload = async () => {
        let locaCode = localStorage.getItem("code") || "";
        code.value = await getCode();
        if (locaCode == code.value) {
          let downUrlReal = window.location.href;
          let result = await getDownLoad(downUrlReal);
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = result;
          let downList = tempDiv.querySelectorAll(".tk-down-link");
          let realDown = downList[0].children[0].href;
          let url = location.href;
          let videoTitle = "";
          if (url.includes("video")) {
            videoTitle = document.querySelector(".arnSiSbK").innerText;
          } else {
            videoTitle = document.querySelector(".title").innerText;
          }
          videoTitle = videoTitle.split("#")[0].trim();
          elementPlus.ElMessage({
            type: "warning",
            message: "请不要连续点击，如果文件较大，需要耐心等待几分钟！",
            duration: "5000"
          });
          downloadFile(realDown, videoTitle);
        } else {
          model.value.openModal();
        }
      };
      const title = vue.ref("为了减少端口压力，防止滥用，采取必要的验证手段。");
      return (_ctx, _cache) => {
        const _component_el_progress = ElProgress;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("button", {
            onClick: onDownload,
            class: "btn"
          }, "一键下载"),
          vue.createVNode(Model, {
            title: title.value,
            code: code.value,
            ref_key: "model",
            ref: model
          }, null, 8, ["title", "code"]),
          vue.withDirectives(vue.createVNode(_component_el_progress, {
            class: "progressDown",
            "text-inside": true,
            "stroke-width": 26,
            percentage: percentage.value
          }, null, 8, ["percentage"]), [
            [vue.vShow, flag.value]
          ])
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-758cdfc2"]]);
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