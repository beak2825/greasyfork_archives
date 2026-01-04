// ==UserScript==
// @name         javbus 巴士司机 - 开得稳，不翻车，带你嗨
// @namespace    http://tampermonkey.net/
// @version      0.10.5
// @author       heybro
// @description  javbus 功能增强，增加稍后再看、已观看、收藏影片、收藏演员、去广告功能。更多功能持续更新中...
// @license      GPL
// @include      https://*bus*/*
// @include      https://*jav*/*
// @include      https://*dmm*/*
// @include      https://*see*/*
// @match        https://www.javbus.com/*
// @match        https://www.dmmsee.art/*
// @match        https://www.buscdn.art/*
// @match        https://www.cdnbus.shop/*
// @match        https://www.busfan.shop/*
// @match        https://www.cdnbus.art/*
// @match        https://www.busdmm.shop/*
// @match        https://www.seejav.art/*
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.4.21/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/470430/javbus%20%E5%B7%B4%E5%A3%AB%E5%8F%B8%E6%9C%BA%20-%20%E5%BC%80%E5%BE%97%E7%A8%B3%EF%BC%8C%E4%B8%8D%E7%BF%BB%E8%BD%A6%EF%BC%8C%E5%B8%A6%E4%BD%A0%E5%97%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/470430/javbus%20%E5%B7%B4%E5%A3%AB%E5%8F%B8%E6%9C%BA%20-%20%E5%BC%80%E5%BE%97%E7%A8%B3%EF%BC%8C%E4%B8%8D%E7%BF%BB%E8%BD%A6%EF%BC%8C%E5%B8%A6%E4%BD%A0%E5%97%A8.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const a=document.createElement("style");a.textContent=e,document.head.append(a)})(' @charset "UTF-8";:root{--el-color-white:#ffffff;--el-color-black:#000000;--el-color-primary-rgb:64,158,255;--el-color-success-rgb:103,194,58;--el-color-warning-rgb:230,162,60;--el-color-danger-rgb:245,108,108;--el-color-error-rgb:245,108,108;--el-color-info-rgb:144,147,153;--el-font-size-extra-large:20px;--el-font-size-large:18px;--el-font-size-medium:16px;--el-font-size-base:14px;--el-font-size-small:13px;--el-font-size-extra-small:12px;--el-font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\u5FAE\u8F6F\u96C5\u9ED1",Arial,sans-serif;--el-font-weight-primary:500;--el-font-line-height-primary:24px;--el-index-normal:1;--el-index-top:1000;--el-index-popper:2000;--el-border-radius-base:4px;--el-border-radius-small:2px;--el-border-radius-round:20px;--el-border-radius-circle:100%;--el-transition-duration:.3s;--el-transition-duration-fast:.2s;--el-transition-function-ease-in-out-bezier:cubic-bezier(.645,.045,.355,1);--el-transition-function-fast-bezier:cubic-bezier(.23,1,.32,1);--el-transition-all:all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);--el-transition-fade:opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-md-fade:transform var(--el-transition-duration) var(--el-transition-function-fast-bezier),opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-fade-linear:opacity var(--el-transition-duration-fast) linear;--el-transition-border:border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-box-shadow:box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-color:color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-component-size-large:40px;--el-component-size:32px;--el-component-size-small:24px}:root{color-scheme:light;--el-color-primary:#409eff;--el-color-primary-light-3:#79bbff;--el-color-primary-light-5:#a0cfff;--el-color-primary-light-7:#c6e2ff;--el-color-primary-light-8:#d9ecff;--el-color-primary-light-9:#ecf5ff;--el-color-primary-dark-2:#337ecc;--el-color-success:#67c23a;--el-color-success-light-3:#95d475;--el-color-success-light-5:#b3e19d;--el-color-success-light-7:#d1edc4;--el-color-success-light-8:#e1f3d8;--el-color-success-light-9:#f0f9eb;--el-color-success-dark-2:#529b2e;--el-color-warning:#e6a23c;--el-color-warning-light-3:#eebe77;--el-color-warning-light-5:#f3d19e;--el-color-warning-light-7:#f8e3c5;--el-color-warning-light-8:#faecd8;--el-color-warning-light-9:#fdf6ec;--el-color-warning-dark-2:#b88230;--el-color-danger:#f56c6c;--el-color-danger-light-3:#f89898;--el-color-danger-light-5:#fab6b6;--el-color-danger-light-7:#fcd3d3;--el-color-danger-light-8:#fde2e2;--el-color-danger-light-9:#fef0f0;--el-color-danger-dark-2:#c45656;--el-color-error:#f56c6c;--el-color-error-light-3:#f89898;--el-color-error-light-5:#fab6b6;--el-color-error-light-7:#fcd3d3;--el-color-error-light-8:#fde2e2;--el-color-error-light-9:#fef0f0;--el-color-error-dark-2:#c45656;--el-color-info:#909399;--el-color-info-light-3:#b1b3b8;--el-color-info-light-5:#c8c9cc;--el-color-info-light-7:#dedfe0;--el-color-info-light-8:#e9e9eb;--el-color-info-light-9:#f4f4f5;--el-color-info-dark-2:#73767a;--el-bg-color:#ffffff;--el-bg-color-page:#f2f3f5;--el-bg-color-overlay:#ffffff;--el-text-color-primary:#303133;--el-text-color-regular:#606266;--el-text-color-secondary:#909399;--el-text-color-placeholder:#a8abb2;--el-text-color-disabled:#c0c4cc;--el-border-color:#dcdfe6;--el-border-color-light:#e4e7ed;--el-border-color-lighter:#ebeef5;--el-border-color-extra-light:#f2f6fc;--el-border-color-dark:#d4d7de;--el-border-color-darker:#cdd0d6;--el-fill-color:#f0f2f5;--el-fill-color-light:#f5f7fa;--el-fill-color-lighter:#fafafa;--el-fill-color-extra-light:#fafcff;--el-fill-color-dark:#ebedf0;--el-fill-color-darker:#e6e8eb;--el-fill-color-blank:#ffffff;--el-box-shadow:0px 12px 32px 4px rgba(0,0,0,.04),0px 8px 20px rgba(0,0,0,.08);--el-box-shadow-light:0px 0px 12px rgba(0,0,0,.12);--el-box-shadow-lighter:0px 0px 6px rgba(0,0,0,.12);--el-box-shadow-dark:0px 16px 48px 16px rgba(0,0,0,.08),0px 12px 32px rgba(0,0,0,.12),0px 8px 16px -8px rgba(0,0,0,.16);--el-disabled-bg-color:var(--el-fill-color-light);--el-disabled-text-color:var(--el-text-color-placeholder);--el-disabled-border-color:var(--el-border-color-light);--el-overlay-color:rgba(0,0,0,.8);--el-overlay-color-light:rgba(0,0,0,.7);--el-overlay-color-lighter:rgba(0,0,0,.5);--el-mask-color:rgba(255,255,255,.9);--el-mask-color-extra-light:rgba(255,255,255,.3);--el-border-width:1px;--el-border-style:solid;--el-border-color-hover:var(--el-text-color-disabled);--el-border:var(--el-border-width) var(--el-border-style) var(--el-border-color);--el-svg-monochrome-grey:var(--el-border-color)}.fade-in-linear-enter-active,.fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.fade-in-linear-enter-from,.fade-in-linear-leave-to{opacity:0}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.el-fade-in-linear-enter-from,.el-fade-in-linear-leave-to{opacity:0}.el-fade-in-enter-active,.el-fade-in-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-fade-in-enter-from,.el-fade-in-leave-active{opacity:0}.el-zoom-in-center-enter-active,.el-zoom-in-center-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-zoom-in-center-enter-from,.el-zoom-in-center-leave-active{opacity:0;transform:scaleX(0)}.el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;transform:scaleY(1);transform-origin:center top;transition:var(--el-transition-md-fade)}.el-zoom-in-top-enter-active[data-popper-placement^=top],.el-zoom-in-top-leave-active[data-popper-placement^=top]{transform-origin:center bottom}.el-zoom-in-top-enter-from,.el-zoom-in-top-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-bottom-enter-active,.el-zoom-in-bottom-leave-active{opacity:1;transform:scaleY(1);transform-origin:center bottom;transition:var(--el-transition-md-fade)}.el-zoom-in-bottom-enter-from,.el-zoom-in-bottom-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-left-enter-active,.el-zoom-in-left-leave-active{opacity:1;transform:scale(1);transform-origin:top left;transition:var(--el-transition-md-fade)}.el-zoom-in-left-enter-from,.el-zoom-in-left-leave-active{opacity:0;transform:scale(.45)}.collapse-transition{transition:var(--el-transition-duration) height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.el-collapse-transition-enter-active,.el-collapse-transition-leave-active{transition:var(--el-transition-duration) max-height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.horizontal-collapse-transition{transition:var(--el-transition-duration) width ease-in-out,var(--el-transition-duration) padding-left ease-in-out,var(--el-transition-duration) padding-right ease-in-out}.el-list-enter-active,.el-list-leave-active{transition:all 1s}.el-list-enter-from,.el-list-leave-to{opacity:0;transform:translateY(-30px)}.el-list-leave-active{position:absolute!important}.el-opacity-transition{transition:opacity var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-icon-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon--right{margin-left:5px}.el-icon--left{margin-right:5px}@-webkit-keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(1turn)}}.el-icon{--color:inherit;align-items:center;display:inline-flex;height:1em;justify-content:center;line-height:1em;position:relative;width:1em;fill:currentColor;color:var(--color);font-size:inherit}.el-icon.is-loading{-webkit-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.el-icon svg{height:1em;width:1em}:root{--el-popup-modal-bg-color:var(--el-color-black);--el-popup-modal-opacity:.5}.v-modal-enter{-webkit-animation:v-modal-in var(--el-transition-duration-fast) ease;animation:v-modal-in var(--el-transition-duration-fast) ease}.v-modal-leave{-webkit-animation:v-modal-out var(--el-transition-duration-fast) ease forwards;animation:v-modal-out var(--el-transition-duration-fast) ease forwards}@-webkit-keyframes v-modal-in{0%{opacity:0}}@keyframes v-modal-in{0%{opacity:0}}@-webkit-keyframes v-modal-out{to{opacity:0}}@keyframes v-modal-out{to{opacity:0}}.v-modal{background:var(--el-popup-modal-bg-color);height:100%;left:0;opacity:var(--el-popup-modal-opacity);position:fixed;top:0;width:100%}.el-popup-parent--hidden{overflow:hidden}.el-dialog{--el-dialog-width:50%;--el-dialog-margin-top:15vh;--el-dialog-bg-color:var(--el-bg-color);--el-dialog-box-shadow:var(--el-box-shadow);--el-dialog-title-font-size:var(--el-font-size-large);--el-dialog-content-font-size:14px;--el-dialog-font-line-height:var(--el-font-line-height-primary);--el-dialog-padding-primary:16px;--el-dialog-border-radius:var(--el-border-radius-small);background:var(--el-dialog-bg-color);border-radius:var(--el-dialog-border-radius);box-shadow:var(--el-dialog-box-shadow);box-sizing:border-box;margin:var(--el-dialog-margin-top,15vh) auto 50px;overflow-wrap:break-word;padding:var(--el-dialog-padding-primary);position:relative;width:var(--el-dialog-width,50%)}.el-dialog:focus{outline:none!important}.el-dialog.is-align-center{margin:auto}.el-dialog.is-fullscreen{--el-dialog-width:100%;--el-dialog-margin-top:0;height:100%;margin-bottom:0;overflow:auto}.el-dialog__wrapper{bottom:0;left:0;margin:0;overflow:auto;position:fixed;right:0;top:0}.el-dialog.is-draggable .el-dialog__header{cursor:move;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.el-dialog__header{padding-bottom:var(--el-dialog-padding-primary)}.el-dialog__header.show-close{padding-right:calc(var(--el-dialog-padding-primary) + var(--el-message-close-size, 16px))}.el-dialog__headerbtn{background:transparent;border:none;cursor:pointer;font-size:var(--el-message-close-size,16px);height:48px;outline:none;padding:0;position:absolute;right:0;top:0;width:48px}.el-dialog__headerbtn .el-dialog__close{color:var(--el-color-info);font-size:inherit}.el-dialog__headerbtn:focus .el-dialog__close,.el-dialog__headerbtn:hover .el-dialog__close{color:var(--el-color-primary)}.el-dialog__title{color:var(--el-text-color-primary);font-size:var(--el-dialog-title-font-size);line-height:var(--el-dialog-font-line-height)}.el-dialog__body{color:var(--el-text-color-regular);font-size:var(--el-dialog-content-font-size)}.el-dialog__footer{box-sizing:border-box;padding-top:var(--el-dialog-padding-primary);text-align:right}.el-dialog--center{text-align:center}.el-dialog--center .el-dialog__body{text-align:initial}.el-dialog--center .el-dialog__footer{text-align:inherit}.el-overlay-dialog{bottom:0;left:0;overflow:auto;position:fixed;right:0;top:0}.dialog-fade-enter-active{-webkit-animation:modal-fade-in var(--el-transition-duration);animation:modal-fade-in var(--el-transition-duration)}.dialog-fade-enter-active .el-overlay-dialog{-webkit-animation:dialog-fade-in var(--el-transition-duration);animation:dialog-fade-in var(--el-transition-duration)}.dialog-fade-leave-active{-webkit-animation:modal-fade-out var(--el-transition-duration);animation:modal-fade-out var(--el-transition-duration)}.dialog-fade-leave-active .el-overlay-dialog{-webkit-animation:dialog-fade-out var(--el-transition-duration);animation:dialog-fade-out var(--el-transition-duration)}@-webkit-keyframes dialog-fade-in{0%{opacity:0;transform:translate3d(0,-20px,0)}to{opacity:1;transform:translateZ(0)}}@keyframes dialog-fade-in{0%{opacity:0;transform:translate3d(0,-20px,0)}to{opacity:1;transform:translateZ(0)}}@-webkit-keyframes dialog-fade-out{0%{opacity:1;transform:translateZ(0)}to{opacity:0;transform:translate3d(0,-20px,0)}}@keyframes dialog-fade-out{0%{opacity:1;transform:translateZ(0)}to{opacity:0;transform:translate3d(0,-20px,0)}}@-webkit-keyframes modal-fade-in{0%{opacity:0}to{opacity:1}}@keyframes modal-fade-in{0%{opacity:0}to{opacity:1}}@-webkit-keyframes modal-fade-out{0%{opacity:1}to{opacity:0}}@keyframes modal-fade-out{0%{opacity:1}to{opacity:0}}.el-overlay{background-color:var(--el-overlay-color-lighter);bottom:0;height:100%;left:0;overflow:auto;position:fixed;right:0;top:0;z-index:2000}.el-overlay .el-overlay-root{height:0}.infinite-list[data-v-5dbc0225]{height:800px;padding:0;margin:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(167px,1fr));gap:10px;overflow-y:auto;overflow-x:hidden}#div-container[data-v-f6013da5]{position:absolute;right:30px;top:128px;display:block}.like-actress[data-v-f6013da5]{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEf0lEQVR4nO1Y6U9UVxR//xF1ijIgwy6bwyaLQYLRFrC2tp8aPxiXuOOwCWljjNqiwRZKW62j0Lp0ZBEHBCSKS7T9IojKQFCIgGzH/G7y7sydeeC8N5MHQ+YkJ3kz953fPb93zj333CuFGIy0mlRabgeChAzBCBmXPW2Ca8gQLApGzWmQmraJHj1+Qv39jyl5Y2bgp5ztdivJgueAJpSXX0gLCwucEJ7zC7YFLqGbt2zkLjdu/huYhLJy8ml+ft6DEKKUk1cQeISa/77OSbx5M8xUFowFFKG0zFwhOqWWCjphqeS/MZa5aXPgELp6rZk77xgZoXXh0bTOGCVEyXq1KTAImdOzaW5ujjtuKaviY5byKiFK6Vl5K5/Q5b+sHtGRxxCl4WEHH7902bqyCSWlZtDMzIwzOuXO6MhaVnGSj8/OzrJOYkURWhMaQSnmLNqx8zuy2VqE6IRFxHi8j/8wxrsHWwuzBQawdCNkitnAdvnvd++hU6fP0vUbt1iPNjk5SUpSXlm9KFZFZY2iDaI7MDhIdnsXXfy1gQ4dKaWSnd/SxrRs+uzzcN8IJSSZ6bfGP1lTOT4+QWrE4XAoRkeIksO5lryR8fEJ5gt8ik80qyd0xdqkasKpqSl6+vQZNTX/w3q4T33Jzflb2buwga0auWK9pp5QfUOjBxBK7YuBQWpr76C6i/V09JiFSr7aRUkpGV6nhJLCFhjAAiawMceLgUHF9gm+qSa0PiqBHjzsF4DQ/oeGmXxeuN5qaJhJOH5A4BN801QUjOtj6V53jwCIL4f9RBcyNmfVhPT1PaAIU7xvVQ6kOrvuCcAdd+3ChulvXWs0UUtruzBn7/0+ioiM80/ZRlWyd4qkunvuU3hkrN/JsLnsXcJcPb3ezyWpmeiuvVPTV/NWlbKhu7tX1YeT1KbC7ZY21XntjcJp9/V6p0N9aqtufUCqta3do/IstZF6E333ioo51hpN+vRySuX0WGmZZkLHT5T7bXuQtDqBCd++e8edgFP+IARMX/Y6yZecd72i+rL4a81OFJV8w3GA6UuhkbQaFhR+IaRJTHyyZiei45IFrC2F2/UntO/AYe4AzjdacWQdGR3leHv3H9KfUO35Ou4ANt2l3o2KSWS61DuuGzewdSfU1n6HO1D3S73iO4kp6fT7H5fYpQm6ZhwKFzty40DnWrJ1JzQ09Io7cPDwcTEisUn0088XaHp6mpROpSAZl5Aq2OB0KsvLl0P6Egp3q3CF24p463Ky5keamPj0Cff9+0lGWj4KbN1e7JdKJ2kxQhVynTw2IYXd5oyNjXk4jn2lqvoHpq77liywgS0wXD+S1kon+VrhkEKvXr/2cBSXJ2fO1VJktPMwhmf8p3SxAgzXKzDMEaIXodoLzgrnLrhrwxpZ6iID+w5bYx8+LIqjtdJJvlY4WeQqZs7IUXUxCfJK9wZaK52kxQhnFPdmMjt3iyYHoLB1b3ZxlAjRi1Dxjl30/L//2VeUK5w/FFjABDb6uxC9CK1klZbbgSAhQzBCxmVPm+AaMqziovARGMODVG/9m4UAAAAASUVORK5CYII=);background-position:50%;background-repeat:no-repeat;background-size:cover;border-radius:4px;box-sizing:border-box;opacity:.9;height:28px;width:28px;display:block;margin:0 2px}.like-actress.active[data-v-f6013da5]{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAACXBIWXMAAAsTAAALEwEAmpwYAAADMUlEQVR4nO2Zy08TURSH+28AFvpCImkzZWY6MxTxAWKVRy1ETU1cGQkL3JmQqAsx6kYWFYVqFaJC4ttFiRIEi+WhMcbHAhMXboxuXJmgMSqSHHPGFKF07Mw4c6dDZvFLJuncO+frOffcc8+1UbQAa0k2ow2wgGjLQ4LhYWOtIdpKCoLqMGioC0A64YLHCTds2xowf8ilLrhgcbZI1ETcbW6gPWEafs38gUHh8+4WxrxAE3H3EkxGY+fd5gRqbWJgYXolzJKXmhnzAY31eVbBZDR6zm0uoNbG3N7JCH9ra6LNA/Sgd/Xaydb9Xo85gFpCLCzMFOcFwnciO5nCBxqJSa+dbCVjnsIGag6x8HM6v3eWeym8gy0sID8jQKguAAejfpi8+LcqkCscg2NxDpyLGFDtRg6iu2g4fMAH/cc2iGl57kYZfEmVKIaQ0vd0EbxP2uHpoBOGT6+HE4e80L7PD00NrGxYSaBQPQt3e8rhzc0ymNfQaLWaT5WIttzpKRdtUwz0sC9/6jVKY30e5UDoHaMNX5QQekkxEK6Zuetlhhu/mCW0CW1TlRRqajh4PewoKJhN/4CRleUEgYdnV5yGw7wYckAwyGmTtnmBF1OpUTDPrzohWM1puw8FOF7sC5CGmR1wAsfz2m+sKJYTIBVXXg2o1dQlF3CcfBjFQBmo8X79PYWdooBCGFVAqCqGV1RVq9k4mYByGOp/ilOa5eHT6DrNYXBOnFutXTa1AzG25RzklArnVJIEKK2A9oZp3UIO+3nEgY52+HQDOtLhIw800F2hG9Dl7gryQOmEfvsRbuDEgT6O2HUD+pC0kwWqruZWNOG1Fs4tt3ajtADa31Yl27jP4yVwtqtSFD7LHYffoEgBdXd68xr0dbJYTBzLD2P4r8e6KmH+UX6w451eckBDp6Qz3I+pYrh9phzqt0jf1m2u5UTYb2npjfnayQpyQLnORtiAxxqsebv89i724hA+V3PyyaCTHNCrIceKBYyXWJFG9X1qHItdpuWJ5uWwgxxQe9QPb2+Vijd02HxUC5KtaIQWz1vv7pWK36BIARWybEYbYAHRlocEw8PGWkP0Gk4KvwFxSX3f7xMBpgAAAABJRU5ErkJggg==)}#div-container[data-v-60269620]{position:absolute;right:20px;bottom:10px;display:block}.watchlater[data-v-60269620]{background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuNyIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIgNC45MjlBNy4wNzEgNy4wNzEgMCAxMDE3IDE3YS42NDMuNjQzIDAgMDEuOTA4LjkxIDguMzU3IDguMzU3IDAgMTEyLjQ0NS02LjE3MmwuNjIxLS42MjJhLjY0My42NDMgMCAxMS45MS45MWwtMS43MTUgMS43MTRhLjY0My42NDMgMCAwMS0uOTEgMGwtMS43MTQtMS43MTVhLjY0My42NDMgMCAxMS45MS0uOTA5bC42MTEuNjEyQTcuMDcyIDcuMDcyIDAgMDAxMiA0LjkyOXptMi41NzEgNy44MTNhLjg1Ny44NTcgMCAwMDAtMS40ODVsLTMuMjE1LTEuODU2YS44NTcuODU3IDAgMDAtMS4yODYuNzQydjMuNzEzYS44NTcuODU3IDAgMDAxLjI4Ni43NDJsMy4yMTUtMS44NTZ6IiBmaWxsPSIjZmZmIi8+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzMzMyIgZmlsbC1vcGFjaXR5PSIuOCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIgNC45MjlBNy4wNzEgNy4wNzEgMCAxMDE3IDE3YS42NDMuNjQzIDAgMDEuOTA4LjkxIDguMzU3IDguMzU3IDAgMTEyLjQ0NS02LjE3MmwuNjIxLS42MjJhLjY0My42NDMgMCAxMS45MS45MWwtMS43MTUgMS43MTRhLjY0My42NDMgMCAwMS0uOTEgMGwtMS43MTQtMS43MTVhLjY0My42NDMgMCAxMS45MS0uOTA5bC42MTEuNjEyQTcuMDcyIDcuMDcyIDAgMDAxMiA0LjkyOXptMi41NzEgNy44MTNhLjg1Ny44NTcgMCAwMDAtMS40ODVsLTMuMjE1LTEuODU2YS44NTcuODU3IDAgMDAtMS4yODYuNzQydjMuNzEzYS44NTcuODU3IDAgMDAxLjI4Ni43NDJsMy4yMTUtMS44NTZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+);background-position:50%;background-repeat:no-repeat;background-size:cover;opacity:.9;height:28px;width:28px;display:inline-block;vertical-align:bottom;margin:0 2px}.watchlater_tip[data-v-60269620]{background:#2f3238;border-radius:4px;box-sizing:border-box;color:#fff;font-size:12px;line-height:12px;opacity:.9;padding:6px 8px;position:absolute;right:-2px;top:32px;white-space:nowrap}.watchlater.active[data-v-60269620]{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAChElEQVR4nO2Y70tTURjH73906qbrzrH5a5ZbTZq2Qq0wISKGiGIiZUGiFfUmXJuroKAi+4mRmi8Kox8vVknvNqUfNHOwKVhbtA03tm+cA/UiDNa9g3NP3gNfuBv3judzvs9zz7NHIrKC/0ES7wAMENlwROGePsSoEZn/ThPDEXkDOjJy5jxq6hvFBjl+4hToun3nnrggnr37kM1m8Tm6iCprvZgg1poGfFmK4Uc6DffuVu4ApFSQ3r4B1Nmd7HpzRRVevHyFYrHIvl/v/nBkHuVe4ci8NpBtjiasreWwFIuhyb0HY8Er7IevXrv+12d8/iDuP5goq3z+oHZHunuOsnpIpb6jUCgg9Potc4Z3KhE1NdK+vxOrq18RTyR087olakCoXLs8aG3v4B4w0Qqid0m8A9AFSEfnYciVFrFBDhw8hFwuh1vjd8UFqbM7sby8gmQqBaerWUwQudKCubl37Ew54u3mDkBKBWn2tKFiq/X35xs3x9npPuoLrHv/1PQMaynKqanpGW0gDY0udqKHQm9Yl9s/MMggZp89x6YtZnFAiKwgMHaZNYkfPn5COp1BNLoIi83OPZWImhoZPDmEfD6PTCaDFk8b96CJWhAqb1cP+vqPcQ+YaAXRuyTeAegCpNbuEB/EsdONb8kkLgYuiQtiUmwIhyPsTUYbR2FBJh5OsoNx5PQ57gCkVJA/51ZDw2cZxKPJx+IMH2y129kQjvZXdOBA/7vTqcrCwnuYzNXijINM5mrWV9H15Oks4vEE6712uFq4pxL519SiTtD5Ll20dfd29XIPmqgB+aULo37WQPIOmGgF0bsk3gEYILLhiMI9fYhRIzL/nSaGIzL/3SUb2ZGfrhAUx4/9ESkAAAAASUVORK5CYII=)}.add_watched[data-v-60269620]{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABkElEQVR4nO2Z0UoCQRSGfaOJCUvZ2gIlJFdN20AJAhGqB2jXjbqpXiDB3bu9yVJ8hApfQMSb1JuddzkxQREUUrlnh81z8d3/3z/nzDKaYDwFcSahOgAjAa6+RUYjxNU3yWiJ+RJco5qegYpZW5ji3gHwpBadgKZnodvrgxAiNKbTKTTPL6MR6IUc/jP1ximuwIaehSAI0AQ6911cgfJ+FS28EAIen55xBeTSkYD4xycwHA7h6vrmA8t2oGJW4yMwHo/B87wv1BvH8RZot9uwltbjK+B5HuTypXgLGMUKCQCdgKARAlpiQbeQoGuULe2HzCiZqAKj0QhXQP568DKZoAkMBgNcAYntXKCEn81m4Ps+voCk3jiBu87D2wvqHfkYkTP8W+TYyOb9OeFDF/gO+YKaF2BRDBLgak9gt1DGHaEzq4kW3nVdSKY2cQUKJRNNwLKdaP7kqx0ewW2rFWrzlu3AenorGgHJymoatjM5yO7kFyb5g7EJXUAlCdUBGAlw9S0yGiGuvklGS8zVt/kXXgGUPel8iSBFFQAAAABJRU5ErkJggg==);background-position:50%;background-repeat:no-repeat;background-size:cover;opacity:.9;height:28px;width:28px;display:inline-block;vertical-align:bottom;margin:0 2px}.add_watched.active[data-v-60269620]{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACGklEQVR4nO3ZPS9DURgH8H6j0x4lSGlQyoIUEQ0hwd5B43WwYEMTBteg6OAMJk3EgBgk4iVRgn4Em2q8NaGPPKVF2ty22qfn0jv8ly73/zvnOTc5twbGy+EvxyC7ANMBXP4qMn2EuPyVZPoh5kXwGi2vtkNjW1/OsTU7wVRqKRygsqYJpjcOQQQhb/FdPMPA6GxhAPku/z0dg25aAI4NVXkRBJhc3aUF2B29pID57RtaAB46HRD8JzswcRCBhbPXH795jh6BT50kYhrxg8nh0h5gbD8CZiUEVSv3PxCe01coUUJJMfXOaAcwjuWXP4rVrIZBOX9LCyhZvAVmtsgHqJUXagAlBEZbp1xAuvIiHcDeQwfAOe7afATfdVR15rFI7VoYlEByeSELsBx4ix1GfEireEhCZFpeyAJsBAEG/U+JB7WIB1i/imY8NtIB4hPRv/WFwJ1w775kvPLSASLFTsSTycprAiBSILIpL7QA+I7ItrzQCiCOWLlM/Ur9EwDxy3ioAXXNTlLA3DExgJdVgS/wRAYY3ovQAjD49YCivPcyClZvmB6AaR8Yil3A8QYVD15GcIazDY4NrrxVpXzeASnHa+pEtUCuMeoALnkHGrppRwgv4GSApTtgFQ3EAIeLDMDHdgrzJx9+PcALeN7LV9oLA4jFbIldwPGtkXMq6rN6tv43K5Mcg+wCTAdw+avI9BHi8leSFeshfgfgH5I3Zmn8CAAAAABJRU5ErkJggg==)}.star[data-v-60269620]{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEf0lEQVR4nO1Y6U9UVxR//xF1ijIgwy6bwyaLQYLRFrC2tp8aPxiXuOOwCWljjNqiwRZKW62j0Lp0ZBEHBCSKS7T9IojKQFCIgGzH/G7y7sydeeC8N5MHQ+YkJ3kz953fPb93zj333CuFGIy0mlRabgeChAzBCBmXPW2Ca8gQLApGzWmQmraJHj1+Qv39jyl5Y2bgp5ztdivJgueAJpSXX0gLCwucEJ7zC7YFLqGbt2zkLjdu/huYhLJy8ml+ft6DEKKUk1cQeISa/77OSbx5M8xUFowFFKG0zFwhOqWWCjphqeS/MZa5aXPgELp6rZk77xgZoXXh0bTOGCVEyXq1KTAImdOzaW5ujjtuKaviY5byKiFK6Vl5K5/Q5b+sHtGRxxCl4WEHH7902bqyCSWlZtDMzIwzOuXO6MhaVnGSj8/OzrJOYkURWhMaQSnmLNqx8zuy2VqE6IRFxHi8j/8wxrsHWwuzBQawdCNkitnAdvnvd++hU6fP0vUbt1iPNjk5SUpSXlm9KFZFZY2iDaI7MDhIdnsXXfy1gQ4dKaWSnd/SxrRs+uzzcN8IJSSZ6bfGP1lTOT4+QWrE4XAoRkeIksO5lryR8fEJ5gt8ik80qyd0xdqkasKpqSl6+vQZNTX/w3q4T33Jzflb2buwga0auWK9pp5QfUOjBxBK7YuBQWpr76C6i/V09JiFSr7aRUkpGV6nhJLCFhjAAiawMceLgUHF9gm+qSa0PiqBHjzsF4DQ/oeGmXxeuN5qaJhJOH5A4BN801QUjOtj6V53jwCIL4f9RBcyNmfVhPT1PaAIU7xvVQ6kOrvuCcAdd+3ChulvXWs0UUtruzBn7/0+ioiM80/ZRlWyd4qkunvuU3hkrN/JsLnsXcJcPb3ezyWpmeiuvVPTV/NWlbKhu7tX1YeT1KbC7ZY21XntjcJp9/V6p0N9aqtufUCqta3do/IstZF6E333ioo51hpN+vRySuX0WGmZZkLHT5T7bXuQtDqBCd++e8edgFP+IARMX/Y6yZecd72i+rL4a81OFJV8w3GA6UuhkbQaFhR+IaRJTHyyZiei45IFrC2F2/UntO/AYe4AzjdacWQdGR3leHv3H9KfUO35Ou4ANt2l3o2KSWS61DuuGzewdSfU1n6HO1D3S73iO4kp6fT7H5fYpQm6ZhwKFzty40DnWrJ1JzQ09Io7cPDwcTEisUn0088XaHp6mpROpSAZl5Aq2OB0KsvLl0P6Egp3q3CF24p463Ky5keamPj0Cff9+0lGWj4KbN1e7JdKJ2kxQhVynTw2IYXd5oyNjXk4jn2lqvoHpq77liywgS0wXD+S1kon+VrhkEKvXr/2cBSXJ2fO1VJktPMwhmf8p3SxAgzXKzDMEaIXodoLzgrnLrhrwxpZ6iID+w5bYx8+LIqjtdJJvlY4WeQqZs7IUXUxCfJK9wZaK52kxQhnFPdmMjt3iyYHoLB1b3ZxlAjRi1Dxjl30/L//2VeUK5w/FFjABDb6uxC9CK1klZbbgSAhQzBCxmVPm+AaMqziovARGMODVG/9m4UAAAAASUVORK5CYII=);background-position:50%;background-repeat:no-repeat;background-size:cover;border-radius:4px;box-sizing:border-box;opacity:.9;height:28px;width:28px;display:inline-block;vertical-align:bottom;margin:0 2px}.star.active[data-v-60269620]{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAACXBIWXMAAAsTAAALEwEAmpwYAAADMUlEQVR4nO2Zy08TURSH+28AFvpCImkzZWY6MxTxAWKVRy1ETU1cGQkL3JmQqAsx6kYWFYVqFaJC4ttFiRIEi+WhMcbHAhMXboxuXJmgMSqSHHPGFKF07Mw4c6dDZvFLJuncO+frOffcc8+1UbQAa0k2ow2wgGjLQ4LhYWOtIdpKCoLqMGioC0A64YLHCTds2xowf8ilLrhgcbZI1ETcbW6gPWEafs38gUHh8+4WxrxAE3H3EkxGY+fd5gRqbWJgYXolzJKXmhnzAY31eVbBZDR6zm0uoNbG3N7JCH9ra6LNA/Sgd/Xaydb9Xo85gFpCLCzMFOcFwnciO5nCBxqJSa+dbCVjnsIGag6x8HM6v3eWeym8gy0sID8jQKguAAejfpi8+LcqkCscg2NxDpyLGFDtRg6iu2g4fMAH/cc2iGl57kYZfEmVKIaQ0vd0EbxP2uHpoBOGT6+HE4e80L7PD00NrGxYSaBQPQt3e8rhzc0ymNfQaLWaT5WIttzpKRdtUwz0sC9/6jVKY30e5UDoHaMNX5QQekkxEK6Zuetlhhu/mCW0CW1TlRRqajh4PewoKJhN/4CRleUEgYdnV5yGw7wYckAwyGmTtnmBF1OpUTDPrzohWM1puw8FOF7sC5CGmR1wAsfz2m+sKJYTIBVXXg2o1dQlF3CcfBjFQBmo8X79PYWdooBCGFVAqCqGV1RVq9k4mYByGOp/ilOa5eHT6DrNYXBOnFutXTa1AzG25RzklArnVJIEKK2A9oZp3UIO+3nEgY52+HQDOtLhIw800F2hG9Dl7gryQOmEfvsRbuDEgT6O2HUD+pC0kwWqruZWNOG1Fs4tt3ajtADa31Yl27jP4yVwtqtSFD7LHYffoEgBdXd68xr0dbJYTBzLD2P4r8e6KmH+UX6w451eckBDp6Qz3I+pYrh9phzqt0jf1m2u5UTYb2npjfnayQpyQLnORtiAxxqsebv89i724hA+V3PyyaCTHNCrIceKBYyXWJFG9X1qHItdpuWJ5uWwgxxQe9QPb2+Vijd02HxUC5KtaIQWz1vv7pWK36BIARWybEYbYAHRlocEw8PGWkP0Gk4KvwFxSX3f7xMBpgAAAABJRU5ErkJggg==)}.watchlater[data-v-5cbfd23f]{background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuNyIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIgNC45MjlBNy4wNzEgNy4wNzEgMCAxMDE3IDE3YS42NDMuNjQzIDAgMDEuOTA4LjkxIDguMzU3IDguMzU3IDAgMTEyLjQ0NS02LjE3MmwuNjIxLS42MjJhLjY0My42NDMgMCAxMS45MS45MWwtMS43MTUgMS43MTRhLjY0My42NDMgMCAwMS0uOTEgMGwtMS43MTQtMS43MTVhLjY0My42NDMgMCAxMS45MS0uOTA5bC42MTEuNjEyQTcuMDcyIDcuMDcyIDAgMDAxMiA0LjkyOXptMi41NzEgNy44MTNhLjg1Ny44NTcgMCAwMDAtMS40ODVsLTMuMjE1LTEuODU2YS44NTcuODU3IDAgMDAtMS4yODYuNzQydjMuNzEzYS44NTcuODU3IDAgMDAxLjI4Ni43NDJsMy4yMTUtMS44NTZ6IiBmaWxsPSIjZmZmIi8+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzMzMyIgZmlsbC1vcGFjaXR5PSIuOCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIgNC45MjlBNy4wNzEgNy4wNzEgMCAxMDE3IDE3YS42NDMuNjQzIDAgMDEuOTA4LjkxIDguMzU3IDguMzU3IDAgMTEyLjQ0NS02LjE3MmwuNjIxLS42MjJhLjY0My42NDMgMCAxMS45MS45MWwtMS43MTUgMS43MTRhLjY0My42NDMgMCAwMS0uOTEgMGwtMS43MTQtMS43MTVhLjY0My42NDMgMCAxMS45MS0uOTA5bC42MTEuNjEyQTcuMDcyIDcuMDcyIDAgMDAxMiA0LjkyOXptMi41NzEgNy44MTNhLjg1Ny44NTcgMCAwMDAtMS40ODVsLTMuMjE1LTEuODU2YS44NTcuODU3IDAgMDAtMS4yODYuNzQydjMuNzEzYS44NTcuODU3IDAgMDAxLjI4Ni43NDJsMy4yMTUtMS44NTZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+);background-position:50%;background-repeat:no-repeat;background-size:cover;opacity:.9;height:28px;width:28px;position:absolute;right:25px;top:22px;display:none}.watchlater_tip[data-v-5cbfd23f]{background:#2f3238;border-radius:4px;box-sizing:border-box;color:#fff;font-size:12px;line-height:12px;opacity:.9;padding:6px 8px;position:absolute;right:-2px;top:32px;white-space:nowrap;display:none}.watchlater.active[data-v-5cbfd23f]{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAChElEQVR4nO2Y70tTURjH73906qbrzrH5a5ZbTZq2Qq0wISKGiGIiZUGiFfUmXJuroKAi+4mRmi8Kox8vVknvNqUfNHOwKVhbtA03tm+cA/UiDNa9g3NP3gNfuBv3judzvs9zz7NHIrKC/0ES7wAMENlwROGePsSoEZn/ThPDEXkDOjJy5jxq6hvFBjl+4hToun3nnrggnr37kM1m8Tm6iCprvZgg1poGfFmK4Uc6DffuVu4ApFSQ3r4B1Nmd7HpzRRVevHyFYrHIvl/v/nBkHuVe4ci8NpBtjiasreWwFIuhyb0HY8Er7IevXrv+12d8/iDuP5goq3z+oHZHunuOsnpIpb6jUCgg9Potc4Z3KhE1NdK+vxOrq18RTyR087olakCoXLs8aG3v4B4w0Qqid0m8A9AFSEfnYciVFrFBDhw8hFwuh1vjd8UFqbM7sby8gmQqBaerWUwQudKCubl37Ew54u3mDkBKBWn2tKFiq/X35xs3x9npPuoLrHv/1PQMaynKqanpGW0gDY0udqKHQm9Yl9s/MMggZp89x6YtZnFAiKwgMHaZNYkfPn5COp1BNLoIi83OPZWImhoZPDmEfD6PTCaDFk8b96CJWhAqb1cP+vqPcQ+YaAXRuyTeAegCpNbuEB/EsdONb8kkLgYuiQtiUmwIhyPsTUYbR2FBJh5OsoNx5PQ57gCkVJA/51ZDw2cZxKPJx+IMH2y129kQjvZXdOBA/7vTqcrCwnuYzNXijINM5mrWV9H15Oks4vEE6712uFq4pxL519SiTtD5Ll20dfd29XIPmqgB+aULo37WQPIOmGgF0bsk3gEYILLhiMI9fYhRIzL/nSaGIzL/3SUb2ZGfrhAUx4/9ESkAAAAASUVORK5CYII=)}.add_watched[data-v-5cbfd23f]{background:#2f3238;border-radius:4px;box-sizing:border-box;color:#fff;font-size:12px;line-height:12px;opacity:.9;padding:6px 8px;position:absolute;right:25px;top:195px;white-space:nowrap;display:none}.watched[data-v-5cbfd23f]{background:#2f3238;border-radius:4px;box-sizing:border-box;color:#fff;font-size:12px;line-height:12px;opacity:.9;padding:6px 8px;position:absolute;left:25px;top:195px;white-space:nowrap;display:none}.star[data-v-5cbfd23f]{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEf0lEQVR4nO1Y6U9UVxR//xF1ijIgwy6bwyaLQYLRFrC2tp8aPxiXuOOwCWljjNqiwRZKW62j0Lp0ZBEHBCSKS7T9IojKQFCIgGzH/G7y7sydeeC8N5MHQ+YkJ3kz953fPb93zj333CuFGIy0mlRabgeChAzBCBmXPW2Ca8gQLApGzWmQmraJHj1+Qv39jyl5Y2bgp5ztdivJgueAJpSXX0gLCwucEJ7zC7YFLqGbt2zkLjdu/huYhLJy8ml+ft6DEKKUk1cQeISa/77OSbx5M8xUFowFFKG0zFwhOqWWCjphqeS/MZa5aXPgELp6rZk77xgZoXXh0bTOGCVEyXq1KTAImdOzaW5ujjtuKaviY5byKiFK6Vl5K5/Q5b+sHtGRxxCl4WEHH7902bqyCSWlZtDMzIwzOuXO6MhaVnGSj8/OzrJOYkURWhMaQSnmLNqx8zuy2VqE6IRFxHi8j/8wxrsHWwuzBQawdCNkitnAdvnvd++hU6fP0vUbt1iPNjk5SUpSXlm9KFZFZY2iDaI7MDhIdnsXXfy1gQ4dKaWSnd/SxrRs+uzzcN8IJSSZ6bfGP1lTOT4+QWrE4XAoRkeIksO5lryR8fEJ5gt8ik80qyd0xdqkasKpqSl6+vQZNTX/w3q4T33Jzflb2buwga0auWK9pp5QfUOjBxBK7YuBQWpr76C6i/V09JiFSr7aRUkpGV6nhJLCFhjAAiawMceLgUHF9gm+qSa0PiqBHjzsF4DQ/oeGmXxeuN5qaJhJOH5A4BN801QUjOtj6V53jwCIL4f9RBcyNmfVhPT1PaAIU7xvVQ6kOrvuCcAdd+3ChulvXWs0UUtruzBn7/0+ioiM80/ZRlWyd4qkunvuU3hkrN/JsLnsXcJcPb3ezyWpmeiuvVPTV/NWlbKhu7tX1YeT1KbC7ZY21XntjcJp9/V6p0N9aqtufUCqta3do/IstZF6E333ioo51hpN+vRySuX0WGmZZkLHT5T7bXuQtDqBCd++e8edgFP+IARMX/Y6yZecd72i+rL4a81OFJV8w3GA6UuhkbQaFhR+IaRJTHyyZiei45IFrC2F2/UntO/AYe4AzjdacWQdGR3leHv3H9KfUO35Ou4ANt2l3o2KSWS61DuuGzewdSfU1n6HO1D3S73iO4kp6fT7H5fYpQm6ZhwKFzty40DnWrJ1JzQ09Io7cPDwcTEisUn0088XaHp6mpROpSAZl5Aq2OB0KsvLl0P6Egp3q3CF24p463Ky5keamPj0Cff9+0lGWj4KbN1e7JdKJ2kxQhVynTw2IYXd5oyNjXk4jn2lqvoHpq77liywgS0wXD+S1kon+VrhkEKvXr/2cBSXJ2fO1VJktPMwhmf8p3SxAgzXKzDMEaIXodoLzgrnLrhrwxpZ6iID+w5bYx8+LIqjtdJJvlY4WeQqZs7IUXUxCfJK9wZaK52kxQhnFPdmMjt3iyYHoLB1b3ZxlAjRi1Dxjl30/L//2VeUK5w/FFjABDb6uxC9CK1klZbbgSAhQzBCxmVPm+AaMqziovARGMODVG/9m4UAAAAASUVORK5CYII=);background-position:50%;background-repeat:no-repeat;background-size:cover;border-radius:4px;box-sizing:border-box;opacity:.9;height:28px;width:28px;position:absolute;left:25px;top:22px;display:none}.star.active[data-v-5cbfd23f]{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAACXBIWXMAAAsTAAALEwEAmpwYAAADMUlEQVR4nO2Zy08TURSH+28AFvpCImkzZWY6MxTxAWKVRy1ETU1cGQkL3JmQqAsx6kYWFYVqFaJC4ttFiRIEi+WhMcbHAhMXboxuXJmgMSqSHHPGFKF07Mw4c6dDZvFLJuncO+frOffcc8+1UbQAa0k2ow2wgGjLQ4LhYWOtIdpKCoLqMGioC0A64YLHCTds2xowf8ilLrhgcbZI1ETcbW6gPWEafs38gUHh8+4WxrxAE3H3EkxGY+fd5gRqbWJgYXolzJKXmhnzAY31eVbBZDR6zm0uoNbG3N7JCH9ra6LNA/Sgd/Xaydb9Xo85gFpCLCzMFOcFwnciO5nCBxqJSa+dbCVjnsIGag6x8HM6v3eWeym8gy0sID8jQKguAAejfpi8+LcqkCscg2NxDpyLGFDtRg6iu2g4fMAH/cc2iGl57kYZfEmVKIaQ0vd0EbxP2uHpoBOGT6+HE4e80L7PD00NrGxYSaBQPQt3e8rhzc0ymNfQaLWaT5WIttzpKRdtUwz0sC9/6jVKY30e5UDoHaMNX5QQekkxEK6Zuetlhhu/mCW0CW1TlRRqajh4PewoKJhN/4CRleUEgYdnV5yGw7wYckAwyGmTtnmBF1OpUTDPrzohWM1puw8FOF7sC5CGmR1wAsfz2m+sKJYTIBVXXg2o1dQlF3CcfBjFQBmo8X79PYWdooBCGFVAqCqGV1RVq9k4mYByGOp/ilOa5eHT6DrNYXBOnFutXTa1AzG25RzklArnVJIEKK2A9oZp3UIO+3nEgY52+HQDOtLhIw800F2hG9Dl7gryQOmEfvsRbuDEgT6O2HUD+pC0kwWqruZWNOG1Fs4tt3ajtADa31Yl27jP4yVwtqtSFD7LHYffoEgBdXd68xr0dbJYTBzLD2P4r8e6KmH+UX6w451eckBDp6Qz3I+pYrh9phzqt0jf1m2u5UTYb2npjfnayQpyQLnORtiAxxqsebv89i724hA+V3PyyaCTHNCrIceKBYyXWJFG9X1qHItdpuWJ5uWwgxxQe9QPb2+Vijd02HxUC5KtaIQWz1vv7pWK36BIARWybEYbYAHRlocEw8PGWkP0Gk4KvwFxSX3f7xMBpgAAAABJRU5ErkJggg==)} ');

(function (vue) {
  'use strict';

  var isVue2 = false;
  /*!
   * pinia v2.1.7
   * (c) 2023 Eduardo San Martin Morote
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
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
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
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
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
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name].call(store2, store2);
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
    const $subscribeOptions = {
      deep: true
      // flush: 'post',
    };
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
      noop
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
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
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
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
    }
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
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = vue.effectScope()).run(setup)));
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
  function storeToRefs(store) {
    {
      store = vue.toRaw(store);
      const refs = {};
      for (const key in store) {
        const value = store[key];
        if (vue.isRef(value) || vue.isReactive(value)) {
          refs[key] = // ---
          vue.toRef(store, key);
        }
      }
      return refs;
    }
  }
  var _a;
  const isClient = typeof window !== "undefined";
  isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function resolveUnref(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
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
  const getOffsetTop = (el) => {
    let offset = 0;
    let parent = el;
    while (parent) {
      offset += parent.offsetTop;
      parent = parent.offsetParent;
    }
    return offset;
  };
  const getOffsetTopDistance = (el, containerEl) => {
    return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl));
  };
  /**
  * @vue/shared v3.4.21
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const NOOP = () => {
  };
  const hasOwnProperty$4 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$4.call(val, key);
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
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var Symbol$1 = root.Symbol;
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$4.toString;
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
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
  var INFINITY$1 = 1 / 0;
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
    return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
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
  var FUNC_ERROR_TEXT$2 = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$2);
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
  var now = function() {
    return root.Date.now();
  };
  var FUNC_ERROR_TEXT$1 = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$1);
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
  var FUNC_ERROR_TEXT = "Expected a function";
  function throttle(func, wait, options) {
    var leading = true, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (isObject(options)) {
      leading = "leading" in options ? !!options.leading : leading;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
      "leading": leading,
      "maxWait": wait,
      "trailing": trailing
    });
  }
  const isUndefined = (val) => val === void 0;
  const isBoolean = (val) => typeof val === "boolean";
  const isNumber = (val) => typeof val === "number";
  const isStringNumber = (val) => {
    if (!isString(val)) {
      return false;
    }
    return !Number.isNaN(Number(val));
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
    if (isNumber(value) || isStringNumber(value)) {
      return `${value}${defaultUnit}`;
    } else if (isString(value)) {
      return value;
    }
  }
  const isScroll = (el, isVertical) => {
    if (!isClient)
      return false;
    const key = {
      undefined: "overflow",
      true: "overflow-y",
      false: "overflow-x"
    }[String(isVertical)];
    const overflow = getStyle(el, key);
    return ["scroll", "auto", "overlay"].some((s) => overflow.includes(s));
  };
  const getScrollContainer = (el, isVertical) => {
    if (!isClient)
      return;
    let parent = el;
    while (parent) {
      if ([window, document, document.documentElement].includes(parent))
        return window;
      if (isScroll(parent, isVertical))
        return parent;
      parent = parent.parentNode;
    }
    return parent;
  };
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
  /**
  * @vue/reactivity v3.4.21
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let activeEffectScope;
  function recordEffectScope(effect2, scope = activeEffectScope) {
    if (scope && scope.active) {
      scope.effects.push(effect2);
    }
  }
  let activeEffect;
  class ReactiveEffect {
    constructor(fn, trigger2, scheduler, scope) {
      this.fn = fn;
      this.trigger = trigger2;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      this._dirtyLevel = 4;
      this._trackId = 0;
      this._runnings = 0;
      this._shouldSchedule = false;
      this._depsLength = 0;
      recordEffectScope(this, scope);
    }
    get dirty() {
      if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
        this._dirtyLevel = 1;
        pauseTracking();
        for (let i = 0; i < this._depsLength; i++) {
          const dep = this.deps[i];
          if (dep.computed) {
            triggerComputed(dep.computed);
            if (this._dirtyLevel >= 4) {
              break;
            }
          }
        }
        if (this._dirtyLevel === 1) {
          this._dirtyLevel = 0;
        }
        resetTracking();
      }
      return this._dirtyLevel >= 4;
    }
    set dirty(v) {
      this._dirtyLevel = v ? 4 : 0;
    }
    run() {
      this._dirtyLevel = 0;
      if (!this.active) {
        return this.fn();
      }
      let lastShouldTrack = shouldTrack;
      let lastEffect = activeEffect;
      try {
        shouldTrack = true;
        activeEffect = this;
        this._runnings++;
        preCleanupEffect(this);
        return this.fn();
      } finally {
        postCleanupEffect(this);
        this._runnings--;
        activeEffect = lastEffect;
        shouldTrack = lastShouldTrack;
      }
    }
    stop() {
      var _a2;
      if (this.active) {
        preCleanupEffect(this);
        postCleanupEffect(this);
        (_a2 = this.onStop) == null ? void 0 : _a2.call(this);
        this.active = false;
      }
    }
  }
  function triggerComputed(computed2) {
    return computed2.value;
  }
  function preCleanupEffect(effect2) {
    effect2._trackId++;
    effect2._depsLength = 0;
  }
  function postCleanupEffect(effect2) {
    if (effect2.deps.length > effect2._depsLength) {
      for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
        cleanupDepEffect(effect2.deps[i], effect2);
      }
      effect2.deps.length = effect2._depsLength;
    }
  }
  function cleanupDepEffect(dep, effect2) {
    const trackId = dep.get(effect2);
    if (trackId !== void 0 && effect2._trackId !== trackId) {
      dep.delete(effect2);
      if (dep.size === 0) {
        dep.cleanup();
      }
    }
  }
  let shouldTrack = true;
  let pauseScheduleStack = 0;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function pauseScheduling() {
    pauseScheduleStack++;
  }
  function resetScheduling() {
    pauseScheduleStack--;
    while (!pauseScheduleStack && queueEffectSchedulers.length) {
      queueEffectSchedulers.shift()();
    }
  }
  function trackEffect(effect2, dep, debuggerEventExtraInfo) {
    if (dep.get(effect2) !== effect2._trackId) {
      dep.set(effect2, effect2._trackId);
      const oldDep = effect2.deps[effect2._depsLength];
      if (oldDep !== dep) {
        if (oldDep) {
          cleanupDepEffect(oldDep, effect2);
        }
        effect2.deps[effect2._depsLength++] = dep;
      } else {
        effect2._depsLength++;
      }
    }
  }
  const queueEffectSchedulers = [];
  function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
    pauseScheduling();
    for (const effect2 of dep.keys()) {
      let tracking;
      if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
        effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
        effect2._dirtyLevel = dirtyLevel;
      }
      if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
        effect2.trigger();
        if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
          effect2._shouldSchedule = false;
          if (effect2.scheduler) {
            queueEffectSchedulers.push(effect2.scheduler);
          }
        }
      }
    }
    resetScheduling();
  }
  const createDep = (cleanup, computed2) => {
    const dep = /* @__PURE__ */ new Map();
    dep.cleanup = cleanup;
    dep.computed = computed2;
    return dep;
  };
  new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol$1)
  );
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly2, isSSR) {
      this.getter = getter;
      this._setter = _setter;
      this.dep = void 0;
      this.__v_isRef = true;
      this["__v_isReadonly"] = false;
      this.effect = new ReactiveEffect(
        () => getter(this._value),
        () => triggerRefValue(
          this,
          this.effect._dirtyLevel === 2 ? 2 : 3
        )
      );
      this.effect.computed = this;
      this.effect.active = this._cacheable = !isSSR;
      this["__v_isReadonly"] = isReadonly2;
    }
    get value() {
      const self2 = toRaw(this);
      if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
        triggerRefValue(self2, 4);
      }
      trackRefValue(self2);
      if (self2.effect._dirtyLevel >= 2) {
        triggerRefValue(self2, 2);
      }
      return self2._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
    // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
    get _dirty() {
      return this.effect.dirty;
    }
    set _dirty(v) {
      this.effect.dirty = v;
    }
    // #endregion
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
  function trackRefValue(ref2) {
    var _a2;
    if (shouldTrack && activeEffect) {
      ref2 = toRaw(ref2);
      trackEffect(
        activeEffect,
        (_a2 = ref2.dep) != null ? _a2 : ref2.dep = createDep(
          () => ref2.dep = void 0,
          ref2 instanceof ComputedRefImpl ? ref2 : void 0
        )
      );
    }
  }
  function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
    ref2 = toRaw(ref2);
    const dep = ref2.dep;
    if (dep) {
      triggerEffects(
        dep,
        dirtyLevel
      );
    }
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
  const __default__$2 = vue.defineComponent({
    name: "ElIcon",
    inheritAttrs: false
  });
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
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
  var Icon = /* @__PURE__ */ _export_sfc$1(_sfc_main$9, [["__file", "icon.vue"]]);
  const ElIcon = withInstall(Icon);
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
  const _hoisted_1$6 = ["aria-level"];
  const _hoisted_2$3 = ["aria-label"];
  const _hoisted_3$3 = ["id"];
  const __default__$1 = vue.defineComponent({ name: "ElDialogContent" });
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
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
              }, vue.toDisplayString(_ctx.title), 11, _hoisted_1$6)
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
  var ElDialogContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$7, [["__file", "dialog-content.vue"]]);
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
      style,
      overlayDialogStyle,
      rendered,
      visible,
      zIndex: zIndex2
    };
  };
  const _hoisted_1$5 = ["aria-label", "aria-labelledby", "aria-describedby"];
  const __default__ = vue.defineComponent({
    name: "ElDialog",
    inheritAttrs: false
  });
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
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
                  ], 46, _hoisted_1$5)
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
  var Dialog = /* @__PURE__ */ _export_sfc$1(_sfc_main$6, [["__file", "dialog.vue"]]);
  const ElDialog = withInstall(Dialog);
  const SCOPE = "ElInfiniteScroll";
  const CHECK_INTERVAL = 50;
  const DEFAULT_DELAY = 200;
  const DEFAULT_DISTANCE = 0;
  const attributes = {
    delay: {
      type: Number,
      default: DEFAULT_DELAY
    },
    distance: {
      type: Number,
      default: DEFAULT_DISTANCE
    },
    disabled: {
      type: Boolean,
      default: false
    },
    immediate: {
      type: Boolean,
      default: true
    }
  };
  const getScrollOptions = (el, instance) => {
    return Object.entries(attributes).reduce((acm, [name, option]) => {
      var _a2, _b;
      const { type, default: defaultValue } = option;
      const attrVal = el.getAttribute(`infinite-scroll-${name}`);
      let value = (_b = (_a2 = instance[attrVal]) != null ? _a2 : attrVal) != null ? _b : defaultValue;
      value = value === "false" ? false : value;
      value = type(value);
      acm[name] = Number.isNaN(value) ? defaultValue : value;
      return acm;
    }, {});
  };
  const destroyObserver = (el) => {
    const { observer } = el[SCOPE];
    if (observer) {
      observer.disconnect();
      delete el[SCOPE].observer;
    }
  };
  const handleScroll = (el, cb) => {
    const { container, containerEl, instance, observer, lastScrollTop } = el[SCOPE];
    const { disabled, distance } = getScrollOptions(el, instance);
    const { clientHeight, scrollHeight, scrollTop } = containerEl;
    const delta = scrollTop - lastScrollTop;
    el[SCOPE].lastScrollTop = scrollTop;
    if (observer || disabled || delta < 0)
      return;
    let shouldTrigger = false;
    if (container === el) {
      shouldTrigger = scrollHeight - (clientHeight + scrollTop) <= distance;
    } else {
      const { clientTop, scrollHeight: height } = el;
      const offsetTop = getOffsetTopDistance(el, containerEl);
      shouldTrigger = scrollTop + clientHeight >= offsetTop + clientTop + height - distance;
    }
    if (shouldTrigger) {
      cb.call(instance);
    }
  };
  function checkFull(el, cb) {
    const { containerEl, instance } = el[SCOPE];
    const { disabled } = getScrollOptions(el, instance);
    if (disabled || containerEl.clientHeight === 0)
      return;
    if (containerEl.scrollHeight <= containerEl.clientHeight) {
      cb.call(instance);
    } else {
      destroyObserver(el);
    }
  }
  const InfiniteScroll = {
    async mounted(el, binding) {
      const { instance, value: cb } = binding;
      if (!isFunction$1(cb)) {
        throwError(SCOPE, "'v-infinite-scroll' binding value must be a function");
      }
      await vue.nextTick();
      const { delay, immediate } = getScrollOptions(el, instance);
      const container = getScrollContainer(el, true);
      const containerEl = container === window ? document.documentElement : container;
      const onScroll = throttle(handleScroll.bind(null, el, cb), delay);
      if (!container)
        return;
      el[SCOPE] = {
        instance,
        container,
        containerEl,
        delay,
        cb,
        onScroll,
        lastScrollTop: containerEl.scrollTop
      };
      if (immediate) {
        const observer = new MutationObserver(throttle(checkFull.bind(null, el, cb), CHECK_INTERVAL));
        el[SCOPE].observer = observer;
        observer.observe(el, { childList: true, subtree: true });
        checkFull(el, cb);
      }
      container.addEventListener("scroll", onScroll);
    },
    unmounted(el) {
      const { container, onScroll } = el[SCOPE];
      container == null ? void 0 : container.removeEventListener("scroll", onScroll);
      destroyObserver(el);
    },
    async updated(el) {
      if (!el[SCOPE]) {
        await vue.nextTick();
      } else {
        const { containerEl, cb, observer } = el[SCOPE];
        if (containerEl.clientHeight && observer) {
          checkFull(el, cb);
        }
      }
    }
  };
  const _InfiniteScroll = InfiniteScroll;
  _InfiniteScroll.install = (app) => {
    app.directive("InfiniteScroll", _InfiniteScroll);
  };
  const ElInfiniteScroll = _InfiniteScroll;
  const useModalStore = defineStore("modal", () => {
    const modalDialogVisible = vue.ref(false);
    const modalTitle = vue.ref("");
    return {
      modalDialogVisible,
      modalTitle
    };
  });
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$4 = ["infinite-scroll-disabled"];
  const _hoisted_2$2 = ["innerHTML"];
  const _hoisted_3$2 = { key: 0 };
  const _hoisted_4$2 = ["infinite-scroll-disabled"];
  const _hoisted_5$2 = ["innerHTML"];
  const _hoisted_6$1 = { key: 0 };
  const _hoisted_7$1 = ["infinite-scroll-disabled"];
  const _hoisted_8$1 = ["innerHTML"];
  const _hoisted_9 = { key: 0 };
  const _hoisted_10 = ["infinite-scroll-disabled"];
  const _hoisted_11 = ["innerHTML"];
  const _hoisted_12 = { key: 0 };
  const _sfc_main$5 = {
    __name: "ModalDialog",
    setup(__props) {
      const modalStore = useModalStore();
      const { modalDialogVisible, modalTitle } = storeToRefs(modalStore);
      const watchLaterNodes = vue.ref([]);
      const watchLaterFanHaoList = vue.ref(_GM_getValue("watch_later"));
      const watchLaterPageNum = vue.ref(0);
      const watchLaterNoMore = vue.ref(false);
      const starNodes = vue.ref([]);
      const starFanHaoList = vue.ref(_GM_getValue("star").toReversed());
      const starPageNum = vue.ref(0);
      const starNoMore = vue.ref(false);
      const watchedNodes = vue.ref([]);
      const watchedFanHaoList = vue.ref(_GM_getValue("watched").toReversed());
      const watchedPageNum = vue.ref(0);
      const watchedNoMore = vue.ref(false);
      const actressNodes = vue.ref([]);
      const actressFanHaoList = vue.ref(_GM_getValue("actress").toReversed());
      const actressPageNum = vue.ref(0);
      const actressNoMore = vue.ref(false);
      const stepSize = vue.ref(20);
      const watchLaterMaxPage = vue.computed(() => {
        return Math.ceil(watchLaterFanHaoList.value.length / stepSize.value);
      });
      const starMaxPage = vue.computed(() => {
        return Math.ceil(starFanHaoList.value.length / stepSize.value);
      });
      const watchedMaxPage = vue.computed(() => {
        return Math.ceil(watchedFanHaoList.value.length / stepSize.value);
      });
      const actressMaxPage = vue.computed(() => {
        return Math.ceil(actressFanHaoList.value.length / stepSize.value);
      });
      async function loadWatchLater() {
        if (watchLaterPageNum.value <= watchLaterMaxPage.value) {
          watchLaterPageNum.value++;
          console.log(watchLaterPageNum.value);
          const fanHaoList = stepArray(watchLaterFanHaoList.value, stepSize.value, watchLaterPageNum.value).map((item) => item);
          const nodes = await fetchData(fanHaoList);
          if (nodes.length === 0) {
            watchLaterNoMore.value = true;
          }
          watchLaterNodes.value.push(...nodes);
        }
      }
      async function loadStar() {
        if (starPageNum.value <= starMaxPage.value) {
          starPageNum.value++;
          const fanHaoList = stepArray(starFanHaoList.value, stepSize.value, starPageNum.value).map((item) => item);
          const nodes = await fetchData(fanHaoList);
          if (nodes.length === 0) {
            starNoMore.value = true;
          }
          starNodes.value.push(...nodes);
        }
      }
      async function loadWatched() {
        if (watchedPageNum.value <= watchedMaxPage.value) {
          watchedPageNum.value++;
          const fanHaoList = stepArray(watchedFanHaoList.value, stepSize.value, watchedPageNum.value).map((item) => item);
          const nodes = await fetchData(fanHaoList);
          if (nodes.length === 0) {
            watchedNoMore.value = true;
          }
          watchedNodes.value.push(...nodes);
        }
      }
      async function loadActress() {
        if (actressPageNum.value <= actressMaxPage.value) {
          actressPageNum.value++;
          const fanHaoList = stepArray(actressFanHaoList.value, stepSize.value, actressPageNum.value).map((item) => item);
          const nodes = await fetchData(fanHaoList);
          if (nodes.length === 0) {
            actressNoMore.value = true;
          }
          actressNodes.value.push(...nodes);
        }
      }
      function stepArray(arr, stepSize2, stepRound) {
        let startIndex = stepRound * stepSize2 - stepSize2;
        let endIndex = stepRound * stepSize2;
        return arr.slice(startIndex, endIndex);
      }
      async function fetchData(fanHaoList) {
        const result = await Promise.allSettled(fanHaoList.map((item) => {
          let keyword = "";
          modalTitle.value === "喜欢的女优" ? keyword = "star" : keyword = "search";
          const url = `/${keyword}/${item}`;
          return fetch(url);
        }));
        let nodes = [];
        for (const item of result) {
          if (item.status !== "fulfilled") {
            console.error(item.status);
          } else {
            const html = await item.value.text();
            const domparser = new DOMParser();
            let doc = domparser.parseFromString(html, "text/html");
            let selector;
            modalTitle.value === "喜欢的女优" ? selector = ".avatar-box" : selector = ".movie-box";
            if (doc.querySelector(selector) && doc.querySelector(selector).parentNode && doc.querySelector(selector).parentNode.cloneNode) {
              const node = doc.querySelector(selector).cloneNode(true);
              node.setAttribute("style", "margin:8px;");
              node.setAttribute("target", "_blank");
              if (modalTitle.value === "喜欢的女优" && doc.querySelector("body > nav > div > div.navbar-header.mh50 > div:nth-child(3) > ul > li:nth-child(4) > a")) {
                const url = doc.querySelector("body > nav > div > div.navbar-header.mh50 > div:nth-child(3) > ul > li:nth-child(4) > a").getAttribute("href");
                const pathname = new URL(url).pathname;
                nodes.push(`<a href="${pathname}" target="_blank">${node.outerHTML}</a>`);
              } else {
                nodes.push(node.outerHTML);
              }
            }
          }
        }
        return nodes;
      }
      return (_ctx, _cache) => {
        const _component_el_dialog = ElDialog;
        const _directive_infinite_scroll = ElInfiniteScroll;
        return vue.openBlock(), vue.createBlock(_component_el_dialog, {
          modelValue: vue.unref(modalDialogVisible),
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(modalDialogVisible) ? modalDialogVisible.value = $event : null),
          title: vue.unref(modalTitle),
          fullscreen: true,
          center: ""
        }, {
          default: vue.withCtx(() => [
            vue.unref(modalTitle) === "稍后观看" ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              "infinite-scroll-disabled": watchLaterNoMore.value,
              class: "infinite-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(watchLaterNodes.value, (node, index) => {
                return vue.openBlock(), vue.createElementBlock("div", { key: index }, [
                  vue.createElementVNode("div", { innerHTML: node }, null, 8, _hoisted_2$2)
                ]);
              }), 128)),
              watchLaterNoMore.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$2, "没有更多了...")) : vue.createCommentVNode("", true)
            ], 8, _hoisted_1$4)), [
              [_directive_infinite_scroll, loadWatchLater]
            ]) : vue.unref(modalTitle) === "已观看的影片" ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              "infinite-scroll-disabled": watchedNoMore.value,
              class: "infinite-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(watchedNodes.value, (node, index) => {
                return vue.openBlock(), vue.createElementBlock("div", { key: index }, [
                  vue.createElementVNode("div", { innerHTML: node }, null, 8, _hoisted_5$2)
                ]);
              }), 128)),
              watchedNoMore.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6$1, "没有更多了...")) : vue.createCommentVNode("", true)
            ], 8, _hoisted_4$2)), [
              [_directive_infinite_scroll, loadWatched]
            ]) : vue.unref(modalTitle) === "喜欢的影片" ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
              key: 2,
              "infinite-scroll-disabled": starNoMore.value,
              class: "infinite-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(starNodes.value, (node, index) => {
                return vue.openBlock(), vue.createElementBlock("div", { key: index }, [
                  vue.createElementVNode("div", { innerHTML: node }, null, 8, _hoisted_8$1)
                ]);
              }), 128)),
              starNoMore.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9, "没有更多了...")) : vue.createCommentVNode("", true)
            ], 8, _hoisted_7$1)), [
              [_directive_infinite_scroll, loadStar]
            ]) : vue.unref(modalTitle) === "喜欢的女优" ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
              key: 3,
              "infinite-scroll-disabled": actressNoMore.value,
              class: "infinite-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(actressNodes.value, (node, index) => {
                return vue.openBlock(), vue.createElementBlock("div", { key: index }, [
                  vue.createElementVNode("div", { innerHTML: node }, null, 8, _hoisted_11)
                ]);
              }), 128)),
              actressNoMore.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12, "没有更多了...")) : vue.createCommentVNode("", true)
            ], 8, _hoisted_10)), [
              [_directive_infinite_scroll, loadActress]
            ]) : vue.createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["modelValue", "title"]);
      };
    }
  };
  const __unplugin_components_4 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-5dbc0225"]]);
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-f6013da5"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$3 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("div", { id: "div-container" }, [
    /* @__PURE__ */ vue.createElementVNode("div", { class: "like-actress" })
  ], -1));
  const _sfc_main$4 = {
    __name: "Actress",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, { to: ".avatar-box > .photo-frame" }, [
          _hoisted_1$3
        ]);
      };
    }
  };
  const __unplugin_components_3 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-f6013da5"]]);
  const _withScopeId = (n) => (vue.pushScopeId("data-v-60269620"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { id: "div-container" }, [
    /* @__PURE__ */ vue.createElementVNode("div", { class: "star" }),
    /* @__PURE__ */ vue.createElementVNode("div", { class: "watchlater" }, [
      /* @__PURE__ */ vue.createElementVNode("div", {
        class: "watchlater_tip",
        style: { "display": "none" }
      })
    ]),
    /* @__PURE__ */ vue.createElementVNode("div", { class: "add_watched" })
  ], -1));
  const _sfc_main$3 = {
    __name: "SingleMoviePage",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, { to: ".bigImage" }, [
          _hoisted_1$2
        ]);
      };
    }
  };
  const __unplugin_components_2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-60269620"]]);
  const _hoisted_1$1 = ["id"];
  const _hoisted_2$1 = ["id"];
  const _hoisted_3$1 = ["id"];
  const _hoisted_4$1 = ["id"];
  const _hoisted_5$1 = ["id"];
  const _sfc_main$2 = {
    __name: "MoiveBoxes",
    setup(__props) {
      const movieBoxes = document.querySelectorAll(".movie-box");
      return (_ctx, _cache) => {
        return vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(movieBoxes), (element, index) => {
          return vue.openBlock(), vue.createBlock(vue.Teleport, { to: element }, [
            vue.createElementVNode("div", {
              id: `javbus-icon-star-${index + 1}`,
              class: "star"
            }, null, 8, _hoisted_1$1),
            vue.createElementVNode("div", {
              id: `javbus-icon-watched-${index + 1}`,
              class: "watched"
            }, "已观看", 8, _hoisted_2$1),
            vue.createElementVNode("div", {
              id: `javbus-icon-watch-later-${index + 1}`,
              class: "watchlater"
            }, [
              vue.createElementVNode("div", {
                id: `javbus-icon-watch-later-tip-${index + 1}`,
                class: "watchlater_tip"
              }, null, 8, _hoisted_4$1)
            ], 8, _hoisted_3$1),
            vue.createElementVNode("div", {
              id: `javbus-icon-add-watched-${index + 1}`,
              class: "add_watched"
            }, "添加已观看", 8, _hoisted_5$1)
          ], 8, ["to"]);
        }), 256);
      };
    }
  };
  const __unplugin_components_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-5cbfd23f"]]);
  const _hoisted_1 = /* @__PURE__ */ vue.createElementVNode("b", null, "稍后观看", -1);
  const _hoisted_2 = [
    _hoisted_1
  ];
  const _hoisted_3 = /* @__PURE__ */ vue.createElementVNode("b", null, "已观看", -1);
  const _hoisted_4 = [
    _hoisted_3
  ];
  const _hoisted_5 = /* @__PURE__ */ vue.createElementVNode("b", null, "喜欢的影片", -1);
  const _hoisted_6 = [
    _hoisted_5
  ];
  const _hoisted_7 = /* @__PURE__ */ vue.createElementVNode("b", null, "喜欢的女优", -1);
  const _hoisted_8 = [
    _hoisted_7
  ];
  const _sfc_main$1 = {
    __name: "MenuBar",
    setup(__props) {
      const modalStore = useModalStore();
      const { modalDialogVisible, modalTitle } = storeToRefs(modalStore);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, { to: "#navbar > ul:nth-child(2)" }, [
          vue.createElementVNode("li", null, [
            vue.createElementVNode("a", {
              href: "#",
              id: "javbus-btn-watch-later",
              onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => {
                modalTitle.value = "稍后观看";
                modalDialogVisible.value = true;
              }, ["stop", "prevent"]))
            }, _hoisted_2)
          ]),
          vue.createElementVNode("li", null, [
            vue.createElementVNode("a", {
              href: "#",
              id: "javbus-btn-jav-watched",
              onClick: _cache[1] || (_cache[1] = vue.withModifiers(($event) => {
                modalTitle.value = "已观看的影片";
                modalDialogVisible.value = true;
              }, ["stop", "prevent"]))
            }, _hoisted_4)
          ]),
          vue.createElementVNode("li", null, [
            vue.createElementVNode("a", {
              href: "#",
              id: "javbus-btn-jav-stared",
              onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => {
                modalTitle.value = "喜欢的影片";
                modalDialogVisible.value = true;
              }, ["stop", "prevent"]))
            }, _hoisted_6)
          ]),
          vue.createElementVNode("li", null, [
            vue.createElementVNode("a", {
              href: "#",
              id: "javbus-btn-jav-liked-actress",
              onClick: _cache[3] || (_cache[3] = vue.withModifiers(($event) => {
                modalTitle.value = "喜欢的女优";
                modalDialogVisible.value = true;
              }, ["stop", "prevent"]))
            }, _hoisted_8)
          ])
        ]);
      };
    }
  };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const showOnIndexPage = /\/#?$/.test(location.href) || /page|genre|search|star|studio|series|label|director|uncensored/.test(location.href);
      const showOnSingleMoviePage = /\/\w+\-\d+#?$/.test(location.href);
      const showOnActressPage = /[^search]star/.test(location.href);
      return (_ctx, _cache) => {
        const _component_MenuBar = _sfc_main$1;
        const _component_MoiveBoxes = __unplugin_components_1;
        const _component_SingleMoviePage = __unplugin_components_2;
        const _component_Actress = __unplugin_components_3;
        const _component_ModalDialog = __unplugin_components_4;
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_MenuBar),
          vue.unref(showOnIndexPage) ? (vue.openBlock(), vue.createBlock(_component_MoiveBoxes, { key: 0 })) : vue.createCommentVNode("", true),
          vue.unref(showOnSingleMoviePage) ? (vue.openBlock(), vue.createBlock(_component_SingleMoviePage, { key: 1 })) : vue.createCommentVNode("", true),
          vue.unref(showOnActressPage) ? (vue.openBlock(), vue.createBlock(_component_Actress, { key: 2 })) : vue.createCommentVNode("", true),
          vue.createVNode(_component_ModalDialog)
        ], 64);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3ba6e7bc"]]);
  function getFanhao(divMoviebox) {
    const fanhao = divMoviebox.getAttribute("href").split("/").at(-1);
    return fanhao;
  }
  function isWatched(fanhao) {
    if (_GM_getValue("watched")) {
      const result = _GM_getValue("watched").includes(fanhao);
      if (result) {
        console.log(`${fanhao} is watched.`);
      }
      return result;
    }
    return false;
  }
  function addWatched(fanhao) {
    let watched = _GM_getValue("watched");
    watched.push(fanhao);
    watched = [...new Set(watched)];
    _GM_setValue("watched", watched);
    console.log(`added ${fanhao} into watched.`);
  }
  function delWatched(fanhao) {
    let watched = _GM_getValue("watched");
    watched = [...new Set(watched)];
    const index = watched.indexOf(fanhao);
    if (index === -1) {
      return;
    }
    watched.splice(index, 1);
    _GM_setValue("watched", watched);
    console.log(`delete ${fanhao} from watched.`);
  }
  function isWatchlater(fanhao) {
    if (_GM_getValue("watch_later")) {
      const result = _GM_getValue("watch_later").includes(fanhao);
      if (result) {
        console.log(`${fanhao} is watch_later.`);
      }
      return result;
    }
    return false;
  }
  function addWatchlater(fanhao) {
    let watch_later = _GM_getValue("watch_later");
    watch_later.push(fanhao);
    watch_later = [...new Set(watch_later)];
    _GM_setValue("watch_later", watch_later);
    console.log(`added ${fanhao} into watch_later.`);
  }
  function delWatchlater(fanhao) {
    let watch_later = _GM_getValue("watch_later");
    watch_later = [...new Set(watch_later)];
    const index = watch_later.indexOf(fanhao);
    if (index === -1) {
      return;
    }
    watch_later.splice(index, 1);
    _GM_setValue("watch_later", watch_later);
    console.log(`delete ${fanhao} from watch_later.`);
  }
  function isStar(fanhao) {
    if (_GM_getValue("star")) {
      const result = _GM_getValue("star").includes(fanhao);
      if (result) {
        console.log(`${fanhao} is star.`);
      }
      return result;
    }
    return false;
  }
  function addStar(fanhao) {
    let star = _GM_getValue("star");
    star.push(fanhao);
    star = [...new Set(star)];
    _GM_setValue("star", star);
    console.log(`added ${fanhao} into star.`);
  }
  function delStar(fanhao) {
    let star = _GM_getValue("star");
    star = [...new Set(star)];
    const index = star.indexOf(fanhao);
    if (index === -1) {
      return;
    }
    star.splice(index, 1);
    _GM_setValue("star", star);
    console.log(`delete ${fanhao} from star.`);
  }
  function isLikeActress(id) {
    if (_GM_getValue("actress")) {
      const result = _GM_getValue("actress").includes(id);
      if (result) {
        console.log(`${id} is actress.`);
      }
      return result;
    }
    return false;
  }
  function addLikeActress(id) {
    let actress = _GM_getValue("actress");
    actress.push(id);
    actress = [...new Set(actress)];
    _GM_setValue("actress", actress);
    console.log(`added ${id} into actress.`);
  }
  function delLikeActress(id) {
    let actress = _GM_getValue("actress");
    actress = [...new Set(actress)];
    const index = actress.indexOf(id);
    if (index === -1) {
      return;
    }
    actress.splice(index, 1);
    _GM_setValue("actress", actress);
    console.log(`delete ${id} from actress.`);
  }
  function initLevelDB() {
    if (!_GM_getValue("watched")) {
      _GM_setValue("watched", []);
    }
    if (!_GM_getValue("watch_later")) {
      _GM_setValue("watch_later", []);
    }
    if (!_GM_getValue("star")) {
      _GM_setValue("star", []);
    }
    if (!_GM_getValue("actress")) {
      _GM_setValue("actress", []);
    }
  }
  function runInSinglePage() {
    const divWatchlater = document.querySelector("#div-container > div.watchlater");
    const divAddWatched = document.querySelector("#div-container > div.add_watched");
    const divStar = document.querySelector("#div-container > div.star");
    document.querySelector("#div-container > div.watchlater > div");
    divStar.addEventListener("click", function(event) {
      const divWatchlater2 = this.parentNode.querySelector(".watchlater");
      const divAddWatched2 = this.parentNode.querySelector(".add_watched");
      const fanhao2 = getFanhao2();
      if (isStar(fanhao2)) {
        delStar(fanhao2);
        this.setAttribute("class", "star");
      } else {
        addStar(fanhao2);
        this.setAttribute("class", "star active");
        delWatchlater(fanhao2);
        divWatchlater2.setAttribute("class", "watchlater");
        delWatched(fanhao2);
        divAddWatched2.setAttribute("class", "add_watched");
      }
      event.stopPropagation();
      event.preventDefault();
    });
    divAddWatched.addEventListener("click", function(event) {
      const divWatchlater2 = this.parentNode.querySelector(".watchlater");
      const divStar2 = this.parentNode.querySelector(".star");
      const fanhao2 = getFanhao2();
      if (isWatched(fanhao2)) {
        delWatched(fanhao2);
        this.setAttribute("class", "add_watched");
      } else {
        addWatched(fanhao2);
        this.setAttribute("class", "add_watched active");
        delWatchlater(fanhao2);
        divWatchlater2.setAttribute("class", "watchlater");
        delStar(fanhao2);
        divStar2.setAttribute("class", "star");
      }
      event.stopPropagation();
      event.preventDefault();
    });
    divWatchlater.addEventListener("mouseenter", function(event) {
      let div = this.querySelector(".watchlater_tip");
      const fanhao2 = getFanhao2();
      if (isWatchlater(fanhao2)) {
        div.textContent = "移除";
      } else {
        div.textContent = "稍后再看";
      }
      div.setAttribute("style", "display:block;");
      console.log("out divWatchlater mouseenter");
    });
    divWatchlater.addEventListener("mouseleave", function(event) {
      let div = this.querySelector(".watchlater_tip");
      div.setAttribute("style", "display:none;");
      const fanhao2 = getFanhao2();
      if (isWatchlater(fanhao2)) {
        this.setAttribute("class", "watchlater active");
      } else {
        this.setAttribute("class", "watchlater");
      }
    });
    divWatchlater.addEventListener("click", function(event) {
      const divTip = this.querySelector(".watchlater_tip");
      const divAddWatched2 = this.parentNode.querySelector(".add_watched");
      const divStar2 = this.parentNode.querySelector(".star");
      const fanhao2 = getFanhao2();
      if (isWatchlater(fanhao2)) {
        delWatchlater(fanhao2);
        divTip.textContent = "已从稍后再看中移除";
        this.setAttribute("class", "watchlater");
      } else {
        divTip.textContent = "已添加至稍后再看";
        this.setAttribute("class", "watchlater active");
        addWatchlater(fanhao2);
        delWatched(fanhao2);
        divAddWatched2.setAttribute("class", "add_watched");
        delStar(fanhao2);
        divStar2.setAttribute("class", "star");
      }
      event.stopPropagation();
      event.preventDefault();
    });
    function getFanhao2() {
      const span = document.querySelector("div.col-md-3.info > p:nth-child(1) > span:nth-child(2)");
      const fanhao2 = span.textContent;
      return fanhao2;
    }
    const fanhao = getFanhao2();
    if (isWatched(fanhao)) {
      divAddWatched.setAttribute("class", "add_watched active");
    } else {
      divAddWatched.setAttribute("class", "add_watched");
    }
    if (isWatchlater(fanhao)) {
      divWatchlater.setAttribute("class", "watchlater active");
    } else {
      divWatchlater.setAttribute("class", "watchlater");
    }
    if (isStar(fanhao)) {
      divStar.setAttribute("class", "star active");
    } else {
      divStar.setAttribute("class", "star");
    }
  }
  function runInListPage() {
    document.querySelectorAll(".movie-box").forEach((movieBox) => {
      movieBox.setAttribute("target", "_blank");
      const divWatchlater = movieBox.querySelector(".watchlater");
      movieBox.querySelector("watchlater_tip");
      const divAddWatched = movieBox.querySelector(".add_watched");
      movieBox.querySelector(".watched");
      const divStar = movieBox.querySelector(".star");
      divStar.addEventListener("click", function(event) {
        const divWatchlater2 = this.parentNode.querySelector(".watchlater");
        const divAddWatched2 = this.parentNode.querySelector(".add_watched");
        const fanhao2 = getFanhao(this.parentNode);
        if (isStar(fanhao2)) {
          delStar(fanhao2);
          this.setAttribute("class", "star");
        } else {
          addStar(fanhao2);
          this.setAttribute("class", "star active");
          delWatchlater(fanhao2);
          divWatchlater2.setAttribute("class", "watchlater");
          delWatched(fanhao2);
          divAddWatched2.textContent = "添加已观看";
        }
        event.preventDefault();
      });
      divAddWatched.addEventListener("click", function(event) {
        const divWatchlater2 = this.parentNode.querySelector(".watchlater");
        const divStar2 = this.parentNode.querySelector(".star");
        const fanhao2 = getFanhao(this.parentNode);
        if (isWatched(fanhao2)) {
          delWatched(fanhao2);
          this.textContent = "添加已观看";
        } else {
          addWatched(fanhao2);
          this.textContent = "取消已观看";
          delWatchlater(fanhao2);
          divWatchlater2.setAttribute("class", "watchlater");
          delStar(fanhao2);
          divStar2.setAttribute("class", "star");
        }
        event.preventDefault();
        event.stopPropagation();
      });
      divWatchlater.addEventListener("mouseenter", function(event) {
        let div = this.querySelector(".watchlater_tip");
        const fanhao2 = getFanhao(this.parentNode);
        if (isWatchlater(fanhao2)) {
          div.textContent = "移除";
        } else {
          div.textContent = "稍后再看";
        }
        div.setAttribute("style", "display:block;");
      });
      divWatchlater.addEventListener("mouseleave", function(event) {
        let div = this.querySelector(".watchlater_tip");
        div.setAttribute("style", "display:none;");
        const fanhao2 = getFanhao(this.parentNode);
        if (isWatchlater(fanhao2)) {
          this.setAttribute("class", "watchlater active");
        } else {
          this.setAttribute("class", "watchlater");
        }
      });
      divWatchlater.addEventListener("click", function(event) {
        const divTip = this.querySelector(".watchlater_tip");
        const divAddWatched2 = this.parentNode.querySelector(".add_watched");
        const divStar2 = this.parentNode.querySelector(".star");
        const fanhao2 = getFanhao(this.parentNode);
        if (isWatchlater(fanhao2)) {
          delWatchlater(fanhao2);
          divTip.textContent = "已从稍后再看中移除";
          this.setAttribute("class", "watchlater");
        } else {
          divTip.textContent = "已添加至稍后再看";
          this.setAttribute("class", "watchlater active");
          addWatchlater(fanhao2);
          delWatched(fanhao2);
          divAddWatched2.textContent = "添加已观看";
          delStar(fanhao2);
          divStar2.setAttribute("class", "star");
        }
        event.preventDefault();
      });
      movieBox.addEventListener("mouseenter", function(event) {
        const watchlater = this.querySelector(".watchlater");
        const addWatched2 = this.querySelector(".add_watched");
        const watched = this.querySelector(".watched");
        const star = this.querySelector(".star");
        const fanhao2 = getFanhao(this);
        if (!isWatched(fanhao2)) {
          addWatched2.textContent = "添加已观看";
        } else {
          addWatched2.textContent = "取消已观看";
        }
        if (isWatchlater(fanhao2)) {
          watchlater.setAttribute("class", "watchlater active");
        } else {
          watchlater.setAttribute("class", "watchlater");
        }
        if (isStar(fanhao2)) {
          star.setAttribute("style", "display:block;");
          star.setAttribute("class", "star active");
        } else {
          star.setAttribute("style", "display:none;");
        }
        watchlater.setAttribute("style", "display:block;");
        addWatched2.setAttribute("style", "display:block;");
        watched.setAttribute("style", "display:none;");
        star.setAttribute("style", "display:block;");
      });
      movieBox.addEventListener("mouseleave", function(event) {
        const watchlater = this.querySelector(".watchlater");
        const addWatched2 = this.querySelector(".add_watched");
        const watched = this.querySelector(".watched");
        const star = this.querySelector(".star");
        addWatched2.setAttribute("style", "display:none;");
        const fanhao2 = getFanhao(this);
        if (isWatchlater(fanhao2)) {
          watchlater.setAttribute("class", "watchlater active");
          watchlater.setAttribute("style", "display:block;");
        } else {
          watchlater.setAttribute("style", "display:none;");
        }
        if (isWatched(fanhao2)) {
          watched.setAttribute("style", "display:block;");
        } else {
          watched.setAttribute("style", "display:none;");
        }
        if (isStar(fanhao2)) {
          star.setAttribute("style", "display:block;");
        } else {
          star.setAttribute("style", "display:none;");
        }
      });
      const fanhao = getFanhao(movieBox);
      if (isWatched(fanhao)) {
        const watched = movieBox.querySelector(".watched");
        watched.setAttribute("style", "display:block;");
      }
      if (isWatchlater(fanhao)) {
        const watchlater = movieBox.querySelector(".watchlater");
        watchlater.setAttribute("class", "watchlater active");
        watchlater.setAttribute("style", "display:block;");
      }
      if (isStar(fanhao)) {
        const star = movieBox.querySelector(".star");
        star.setAttribute("class", "star active");
        star.setAttribute("style", "display:block;");
      }
    });
  }
  function runInActressPage() {
    const photoFrame = document.querySelector(".avatar-box > .photo-frame");
    const divLikeActress = photoFrame.querySelector(".like-actress");
    divLikeActress.addEventListener("click", function() {
      const actressId2 = location.href.split("/").at(-1);
      if (isLikeActress(actressId2)) {
        delLikeActress(actressId2);
        this.setAttribute("class", "like-actress");
      } else {
        addLikeActress(actressId2);
        this.setAttribute("class", "like-actress active");
      }
    });
    const actressId = location.href.split("/").at(-1);
    if (isLikeActress(actressId)) {
      document.querySelector(".like-actress").setAttribute("class", "like-actress active");
    } else {
      document.querySelector(".like-actress").setAttribute("class", "like-actress");
    }
  }
  initLevelDB();
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".ad-box").forEach((ad) => {
      ad.parentNode.removeChild(ad);
    });
    const pinia = createPinia();
    const app = vue.createApp(App);
    app.use(pinia);
    app.mount(
      (() => {
        const app2 = document.createElement("div");
        app2.id = "mount-point";
        document.body.append(app2);
        return app2;
      })()
    );
    if (/\/#?$/.test(location.href) || /page|genre|search|star|studio|series|label|director|uncensored/.test(location.href)) {
      runInListPage();
    }
    if (/\/\w+\-\d+#?$/.test(location.href)) {
      runInSinglePage();
    }
    if (/[^search]star/.test(location.href)) {
      runInActressPage();
    }
  });

})(Vue);