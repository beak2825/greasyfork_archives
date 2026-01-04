// ==UserScript==
// @name         视频下载
// @namespace    https://www.softrr.cn/
// @version      5.0
// @author       ahonker
// @antifeature  membership
// @description  全面解析，电脑打开抖音首页www.douyin.com可以对任意抖音视频进行下载！
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
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/498758/%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/498758/%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
 
(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const r=document.createElement("style");r.textContent=e,document.head.append(r)})(' @charset "UTF-8";:root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}:root{--el-color-white:#ffffff;--el-color-black:#000000;--el-color-primary-rgb:64,158,255;--el-color-success-rgb:103,194,58;--el-color-warning-rgb:230,162,60;--el-color-danger-rgb:245,108,108;--el-color-error-rgb:245,108,108;--el-color-info-rgb:144,147,153;--el-font-size-extra-large:20px;--el-font-size-large:18px;--el-font-size-medium:16px;--el-font-size-base:14px;--el-font-size-small:13px;--el-font-size-extra-small:12px;--el-font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\u5FAE\u8F6F\u96C5\u9ED1",Arial,sans-serif;--el-font-weight-primary:500;--el-font-line-height-primary:24px;--el-index-normal:1;--el-index-top:1000;--el-index-popper:2000;--el-border-radius-base:4px;--el-border-radius-small:2px;--el-border-radius-round:20px;--el-border-radius-circle:100%;--el-transition-duration:.3s;--el-transition-duration-fast:.2s;--el-transition-function-ease-in-out-bezier:cubic-bezier(.645, .045, .355, 1);--el-transition-function-fast-bezier:cubic-bezier(.23, 1, .32, 1);--el-transition-all:all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);--el-transition-fade:opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-md-fade:transform var(--el-transition-duration) var(--el-transition-function-fast-bezier),opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-fade-linear:opacity var(--el-transition-duration-fast) linear;--el-transition-border:border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-box-shadow:box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-color:color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-component-size-large:40px;--el-component-size:32px;--el-component-size-small:24px}:root{color-scheme:light;--el-color-white:#ffffff;--el-color-black:#000000;--el-color-primary:#409eff;--el-color-primary-light-3:#79bbff;--el-color-primary-light-5:#a0cfff;--el-color-primary-light-7:#c6e2ff;--el-color-primary-light-8:#d9ecff;--el-color-primary-light-9:#ecf5ff;--el-color-primary-dark-2:#337ecc;--el-color-success:#67c23a;--el-color-success-light-3:#95d475;--el-color-success-light-5:#b3e19d;--el-color-success-light-7:#d1edc4;--el-color-success-light-8:#e1f3d8;--el-color-success-light-9:#f0f9eb;--el-color-success-dark-2:#529b2e;--el-color-warning:#e6a23c;--el-color-warning-light-3:#eebe77;--el-color-warning-light-5:#f3d19e;--el-color-warning-light-7:#f8e3c5;--el-color-warning-light-8:#faecd8;--el-color-warning-light-9:#fdf6ec;--el-color-warning-dark-2:#b88230;--el-color-danger:#f56c6c;--el-color-danger-light-3:#f89898;--el-color-danger-light-5:#fab6b6;--el-color-danger-light-7:#fcd3d3;--el-color-danger-light-8:#fde2e2;--el-color-danger-light-9:#fef0f0;--el-color-danger-dark-2:#c45656;--el-color-error:#f56c6c;--el-color-error-light-3:#f89898;--el-color-error-light-5:#fab6b6;--el-color-error-light-7:#fcd3d3;--el-color-error-light-8:#fde2e2;--el-color-error-light-9:#fef0f0;--el-color-error-dark-2:#c45656;--el-color-info:#909399;--el-color-info-light-3:#b1b3b8;--el-color-info-light-5:#c8c9cc;--el-color-info-light-7:#dedfe0;--el-color-info-light-8:#e9e9eb;--el-color-info-light-9:#f4f4f5;--el-color-info-dark-2:#73767a;--el-bg-color:#ffffff;--el-bg-color-page:#f2f3f5;--el-bg-color-overlay:#ffffff;--el-text-color-primary:#303133;--el-text-color-regular:#606266;--el-text-color-secondary:#909399;--el-text-color-placeholder:#a8abb2;--el-text-color-disabled:#c0c4cc;--el-border-color:#dcdfe6;--el-border-color-light:#e4e7ed;--el-border-color-lighter:#ebeef5;--el-border-color-extra-light:#f2f6fc;--el-border-color-dark:#d4d7de;--el-border-color-darker:#cdd0d6;--el-fill-color:#f0f2f5;--el-fill-color-light:#f5f7fa;--el-fill-color-lighter:#fafafa;--el-fill-color-extra-light:#fafcff;--el-fill-color-dark:#ebedf0;--el-fill-color-darker:#e6e8eb;--el-fill-color-blank:#ffffff;--el-box-shadow:0px 12px 32px 4px rgba(0, 0, 0, .04),0px 8px 20px rgba(0, 0, 0, .08);--el-box-shadow-light:0px 0px 12px rgba(0, 0, 0, .12);--el-box-shadow-lighter:0px 0px 6px rgba(0, 0, 0, .12);--el-box-shadow-dark:0px 16px 48px 16px rgba(0, 0, 0, .08),0px 12px 32px rgba(0, 0, 0, .12),0px 8px 16px -8px rgba(0, 0, 0, .16);--el-disabled-bg-color:var(--el-fill-color-light);--el-disabled-text-color:var(--el-text-color-placeholder);--el-disabled-border-color:var(--el-border-color-light);--el-overlay-color:rgba(0, 0, 0, .8);--el-overlay-color-light:rgba(0, 0, 0, .7);--el-overlay-color-lighter:rgba(0, 0, 0, .5);--el-mask-color:rgba(255, 255, 255, .9);--el-mask-color-extra-light:rgba(255, 255, 255, .3);--el-border-width:1px;--el-border-style:solid;--el-border-color-hover:var(--el-text-color-disabled);--el-border:var(--el-border-width) var(--el-border-style) var(--el-border-color);--el-svg-monochrome-grey:var(--el-border-color)}.fade-in-linear-enter-active,.fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.fade-in-linear-enter-from,.fade-in-linear-leave-to{opacity:0}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.el-fade-in-linear-enter-from,.el-fade-in-linear-leave-to{opacity:0}.el-fade-in-enter-active,.el-fade-in-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-fade-in-enter-from,.el-fade-in-leave-active{opacity:0}.el-zoom-in-center-enter-active,.el-zoom-in-center-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-zoom-in-center-enter-from,.el-zoom-in-center-leave-active{opacity:0;transform:scaleX(0)}.el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;transform:scaleY(1);transition:var(--el-transition-md-fade);transform-origin:center top}.el-zoom-in-top-enter-active[data-popper-placement^=top],.el-zoom-in-top-leave-active[data-popper-placement^=top]{transform-origin:center bottom}.el-zoom-in-top-enter-from,.el-zoom-in-top-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-bottom-enter-active,.el-zoom-in-bottom-leave-active{opacity:1;transform:scaleY(1);transition:var(--el-transition-md-fade);transform-origin:center bottom}.el-zoom-in-bottom-enter-from,.el-zoom-in-bottom-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-left-enter-active,.el-zoom-in-left-leave-active{opacity:1;transform:scale(1);transition:var(--el-transition-md-fade);transform-origin:top left}.el-zoom-in-left-enter-from,.el-zoom-in-left-leave-active{opacity:0;transform:scale(.45)}.collapse-transition{transition:var(--el-transition-duration) height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.el-collapse-transition-enter-active,.el-collapse-transition-leave-active{transition:var(--el-transition-duration) max-height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.horizontal-collapse-transition{transition:var(--el-transition-duration) width ease-in-out,var(--el-transition-duration) padding-left ease-in-out,var(--el-transition-duration) padding-right ease-in-out}.el-list-enter-active,.el-list-leave-active{transition:all 1s}.el-list-enter-from,.el-list-leave-to{opacity:0;transform:translateY(-30px)}.el-list-leave-active{position:absolute!important}.el-opacity-transition{transition:opacity var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-icon-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon--right{margin-left:5px}.el-icon--left{margin-right:5px}@-webkit-keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.el-icon{--color:inherit;height:1em;width:1em;line-height:1em;display:inline-flex;justify-content:center;align-items:center;position:relative;fill:currentColor;color:var(--color);font-size:inherit}.el-icon.is-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon svg{height:1em;width:1em}.el-progress{position:relative;line-height:1;display:flex;align-items:center}.el-progress__text{font-size:14px;color:var(--el-text-color-regular);margin-left:5px;min-width:50px;line-height:1}.el-progress__text i{vertical-align:middle;display:block}.el-progress--circle,.el-progress--dashboard{display:inline-block}.el-progress--circle .el-progress__text,.el-progress--dashboard .el-progress__text{position:absolute;top:50%;left:0;width:100%;text-align:center;margin:0;transform:translateY(-50%)}.el-progress--circle .el-progress__text i,.el-progress--dashboard .el-progress__text i{vertical-align:middle;display:inline-block}.el-progress--without-text .el-progress__text{display:none}.el-progress--without-text .el-progress-bar{padding-right:0;margin-right:0;display:block}.el-progress--text-inside .el-progress-bar{padding-right:0;margin-right:0}.el-progress.is-success .el-progress-bar__inner{background-color:var(--el-color-success)}.el-progress.is-success .el-progress__text{color:var(--el-color-success)}.el-progress.is-warning .el-progress-bar__inner{background-color:var(--el-color-warning)}.el-progress.is-warning .el-progress__text{color:var(--el-color-warning)}.el-progress.is-exception .el-progress-bar__inner{background-color:var(--el-color-danger)}.el-progress.is-exception .el-progress__text{color:var(--el-color-danger)}.el-progress-bar{flex-grow:1;box-sizing:border-box}.el-progress-bar__outer{height:6px;border-radius:100px;background-color:var(--el-border-color-lighter);overflow:hidden;position:relative;vertical-align:middle}.el-progress-bar__inner{position:absolute;left:0;top:0;height:100%;background-color:var(--el-color-primary);text-align:right;border-radius:100px;line-height:1;white-space:nowrap;transition:width .6s ease}.el-progress-bar__inner:after{display:inline-block;content:"";height:100%;vertical-align:middle}.el-progress-bar__inner--indeterminate{transform:translateZ(0);-webkit-animation:indeterminate 3s infinite;animation:indeterminate 3s infinite}.el-progress-bar__inner--striped{background-image:linear-gradient(45deg,rgba(0,0,0,.1) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.1) 75%,transparent 75%,transparent);background-size:1.25em 1.25em}.el-progress-bar__inner--striped.el-progress-bar__inner--striped-flow{-webkit-animation:striped-flow 3s linear infinite;animation:striped-flow 3s linear infinite}.el-progress-bar__innerText{display:inline-block;vertical-align:middle;color:#fff;font-size:12px;margin:0 5px}@-webkit-keyframes progress{0%{background-position:0 0}to{background-position:32px 0}}@keyframes progress{0%{background-position:0 0}to{background-position:32px 0}}@-webkit-keyframes indeterminate{0%{left:-100%}to{left:100%}}@keyframes indeterminate{0%{left:-100%}to{left:100%}}@-webkit-keyframes striped-flow{0%{background-position:-100%}to{background-position:100%}}@keyframes striped-flow{0%{background-position:-100%}to{background-position:100%}}.modal-wrapper[data-v-c870d347]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000080;display:flex;justify-content:center;align-items:center;z-index:9999}.modal[data-v-c870d347]{background-color:#fff;padding:20px;border-radius:5px}.header[data-v-c870d347]{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.header h2[data-v-c870d347]{margin:0;font-size:20px;font-weight:700}.header button[data-v-c870d347]{border:none;background-color:transparent;font-size:20px;cursor:pointer}.content[data-v-c870d347]{max-height:400px;overflow:auto;font-size:16px;display:flex;justify-content:space-between}.content .produce p[data-v-c870d347]{margin-top:15px}.content .produce .ipt[data-v-c870d347]{margin-top:15px;height:30px;border-radius:5px;padding-left:10px}.content .img[data-v-c870d347]{display:flex;align-items:center;justify-content:center}.content .img img[data-v-c870d347]{width:180px}input[data-v-c870d347]::-webkit-input-placeholder{color:#aab2bd;font-size:14px;padding-left:5px}.copy[data-v-be265b41]{width:160px;position:fixed;right:10px;top:80px;color:#111;z-index:999;display:flex;flex-direction:column}.copy .btn[data-v-be265b41]{width:120px;height:40px;background-color:green;color:#fff;border-radius:10%}.copy .btn[data-v-be265b41]:hover{background-color:#87ceeb;color:#fff}.copy .progressDown[data-v-be265b41]{margin-top:10px;max-width:120px}.demo-progress .el-progress--line[data-v-be265b41]{margin-bottom:15px;max-width:120px} ');
 
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
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "1、扫描右侧微信号，点击好友！", -1));
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "2、通过好友后回复：抖音验证码", -1));
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
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.softrr.cn/crawler/getCode`,
        headers: {
          Referer: "https://www.softrr.cn/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36"
        },
        onload: function(res) {
          resolve(JSON.parse(res.response).data[0].code);
        }
      });
    });
  };
  const downloadFile = (url, linkDownload) => {
    console.log(url);
    fetch(url).then((response) => response.blob()).then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = linkDownload;
      link.click();
      URL.revokeObjectURL(link.href);
    }).catch((error) => {
      console.error("下载失败:", error);
    });
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
      vue.ref("");
      const flag = vue.ref(false);
      const percentage = vue.ref(0);
      const onDownload = async () => {
        let locaCode = localStorage.getItem("code") || "";
        code.value = await getCode();
        if (locaCode == code.value) {
          let downUrlList = document.getElementsByTagName("video");
          let downUrlReal = "";
          downUrlList.forEach((element) => {
            if (element.hasAttribute("autoplay")) {
              downUrlReal = element.children;
            }
          });
          let downUrl = downUrlReal[0].src;
          let videoTitle = document.querySelectorAll(".hVNC9qgC")[2].innerText;
          elementPlus.ElMessage({
            type: "warning",
            message: "请不要连续点击，如果文件较大，需要耐心等待几分钟！",
            duration: "5000"
          }), // GM_download({
          //   url: downUrl,
          //   name: videoTitle, //不填则自动获取文件名
          //   saveAs: true, //布尔值，显示"保存为"对话框
          //   onprogress: function () {        
          //     flag.value = true
          //     if (percentage.value < 100) {
          //       percentage.value++
          //     }
          //   },
          //   onload: function () {
          //     flag.value = false
          //     percentage.value = 100
          //     percentage.value = 0
          //   },
          //   onerror: function (error) {
          //     //如果下载最终出现错误，则要执行的回调
          //     console.log(error)
          //   },
          //   ontimeout: () => {
          //     //如果此下载由于超时而失败，则要执行的回调
          //     alert('下载超时，请稍后重试！')
          //   },
          // })
          // console.log(downUrl)
          // flag.value = true
          // percentage.value++
          downloadFile(downUrl, videoTitle);
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
          }, "抖音下载"),
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-be265b41"]]);
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