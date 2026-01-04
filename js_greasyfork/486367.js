// ==UserScript==
// @name         Tieba Remix: 贴吧网页端重塑
// @namespace    https://github.com/HacksawBlade/Tieba-Remix
// @version      0.4.7-beta
// @author       锯条
// @description  贴吧网页端重塑
// @license      MIT
// @icon         https://gitee.com/HacksawBlade/Tieba-Remix/raw/master/assets/images/main/icon16.png
// @icon64       https://gitee.com/HacksawBlade/Tieba-Remix/raw/master/assets/images/main/icon64.png
// @match        *://tieba.baidu.com/
// @match        *://tieba.baidu.com/index.*
// @match        *://tieba.baidu.com/?*
// @match        *://tieba.baidu.com/p/*
// @match        *://tieba.baidu.com/f?*
// @match        *://jump.bdimg.com/safecheck/*
// @match        *://jump2.bdimg.com/safecheck/*
// @require      https://fastly.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://fastly.jsdelivr.net/npm/marked@9.1.6/lib/marked.umd.min.js
// @require      https://fastly.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://fastly.jsdelivr.net/npm/libelemental@1.0.7/build/index.min.js
// @require      https://fastly.jsdelivr.net/npm/user-view@0.0.11/build/index.min.js
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/486367/Tieba%20Remix%3A%20%E8%B4%B4%E5%90%A7%E7%BD%91%E9%A1%B5%E7%AB%AF%E9%87%8D%E5%A1%91.user.js
// @updateURL https://update.greasyfork.org/scripts/486367/Tieba%20Remix%3A%20%E8%B4%B4%E5%90%A7%E7%BD%91%E9%A1%B5%E7%AB%AF%E9%87%8D%E5%A1%91.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const e=document.createElement("style");e.textContent=n,document.head.append(e)})(` @charset "UTF-8";@keyframes kf-fade-in{0%{opacity:0}to{opacity:1}}@keyframes kf-fade-out{0%{opacity:1}to{opacity:0}}@keyframes kf-slide-in{0%{opacity:0;transform:translateY(20%)}}@keyframes kf-slide-out{to{opacity:0;transform:translateY(20%)}}@keyframes kf-slide-zoom-in{0%{opacity:0;transform:translateY(20%) scale(.85)}}@keyframes kf-slide-zoom-out{to{opacity:0;transform:translateY(20%) scale(.85)}}@keyframes kf-dialog-in{0%{opacity:0;transform:scale(1.2)}to{opacity:1;transform:scale(1)}}@keyframes kf-dialog-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(1.2)}}@keyframes kf-zoom-in{0%{transform:scale(.72)}to{transform:scale(1)}}@keyframes kf-fade-zoom-in{0%{opacity:0;transform:scale(.72)}to{opacity:1;transform:scale(1)}}.user-icon,.user-icon-outline{font-family:Material Symbols,monospace!important}.user-icon,.user-icon-outline{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 40;font-weight:400;-webkit-user-select:none;-moz-user-select:none;user-select:none}.user-icon-filled{font-family:Material Symbols,monospace!important}.user-icon-filled{font-variation-settings:"FILL" 1,"wght" 400,"GRAD" 0,"opsz" 40;font-weight:400;-webkit-user-select:none;-moz-user-select:none;user-select:none}.user-view-common{font-family:sans-serif;font-family:var(--user-font);font-size:16px;line-height:normal}body[no-scrollbar]{overflow:hidden}@font-face{font-family:Material Symbols;font-style:normal;font-weight:200 400;src:url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v110/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2) format("woff2")}.material-symbols-outlined{display:inline-block;direction:ltr;font-family:Material Symbols;font-size:24px;-webkit-font-smoothing:antialiased;font-style:normal;font-weight:400;letter-spacing:normal;line-height:1;text-transform:none;white-space:nowrap;word-wrap:normal}.dark-theme{--user-back: rgb(32, 32, 32);--user-hover: rgb(42, 42, 42);--user-active: rgb(54, 54, 54);--user-back-transp: rgba(32, 32, 32, .6);--user-back-deep: rgb(26, 26, 26);--user-back-deep-transp: rgba(20, 20, 20, .6);--user-back-light: rgb(60, 60, 60);--user-back-light-transp: rgba(60, 60, 60, .6);--user-fore: rgb(230, 230, 230);--user-fore-light: rgb(180, 180, 180);--user-fore-minimal: rgb(144, 144, 144);--user-fore-highlight: rgb(255, 255, 255);--user-border: rgba(96, 96, 96, .6);--user-border-light: rgba(96, 96, 96, .2);--user-theme: rgb(113, 97, 193);--user-theme-transp: rgba(113, 97, 193, .6);--user-theme-hover: rgb(149, 128, 254);--user-theme-active: rgb(172, 156, 253);--user-theme-back: rgba(113, 97, 193, .2);--user-theme-fore: rgb(150, 128, 255);--user-check-color: rgb(124, 252, 0);--user-error-color: rgb(255, 99, 71);--user-warn-color: rgb(255, 165, 0)}:root{--user-back: rgb(255, 255, 255);--user-hover: rgb(240, 240, 240);--user-active: rgb(224, 224, 224);--user-back-transp: rgba(255, 255, 255, .6);--user-back-deep: rgb(228, 228, 228);--user-back-deep-transp: rgba(200, 200, 200, .6);--user-back-light: rgb(235, 235, 235);--user-back-light-transp: rgba(228, 228, 228, .6);--user-fore: rgb(16, 16, 16);--user-fore-light: rgb(86, 86, 86);--user-fore-minimal: rgb(118, 118, 118);--user-fore-highlight: rgb(0, 0, 0);--user-border: rgba(185, 185, 185, .6);--user-border-light: rgba(185, 185, 185, .2);--user-theme: rgb(97, 78, 194);--user-theme-transp: rgba(97, 78, 194, .6);--user-theme-hover: rgb(119, 105, 194);--user-theme-active: rgb(150, 134, 232);--user-theme-back: rgba(97, 78, 194, .2);--user-theme-fore: rgb(58, 46, 116);--user-check-color: rgb(0, 128, 0);--user-error-color: rgb(139, 0, 0);--user-warn-color: rgb(255, 140, 0)}:root{--user-font: sans-serif;--user-font-mono: monospace;--xfast-duration: .1s;--fast-duration: .2s;--default-duration: .4s;--slow-duration: .6s;--xslow-duration: .8s}.user-anchor.underline[data-v-eda7432d],.user-anchor.default[data-v-eda7432d]{color:rgb(58, 46, 116);color:var(--user-theme-fore);cursor:pointer;-webkit-text-decoration:none;-webkit-text-decoration:none;text-decoration:none;transition:.4s;transition:var(--default-duration)}.user-anchor.underline[data-v-eda7432d]{-webkit-text-decoration:underline;text-decoration:underline;-webkit-text-decoration:underline solid currentColor;text-decoration:underline;text-decoration:underline solid currentColor;text-decoration-thickness:1.2px;-webkit-text-decoration:underline 1.2px;text-decoration:underline;text-decoration:underline solid currentColor;text-decoration-thickness:1.2px;text-decoration:underline 1.2px}.user-anchor.hover-type[data-v-eda7432d]{cursor:pointer;-webkit-text-decoration:none;-webkit-text-decoration:none;text-decoration:none;transition:.4s;transition:var(--default-duration)}.user-anchor.default[data-v-eda7432d]:hover,.user-anchor.underline[data-v-eda7432d]:hover{background-color:rgb(240, 240, 240);background-color:var(--user-hover)}.user-anchor.underline[data-v-eda7432d]:hover{-webkit-text-decoration:underline;text-decoration:underline;-webkit-text-decoration:underline solid rgba(0,0,0,0);text-decoration:underline;text-decoration:underline solid rgba(0,0,0,0);text-decoration-thickness:1.2px;-webkit-text-decoration:underline 1.2px rgba(0,0,0,0);text-decoration:underline;text-decoration:underline solid rgba(0,0,0,0);text-decoration-thickness:1.2px;text-decoration:underline 1.2px rgba(0,0,0,0)}.user-anchor.hover-type[data-v-eda7432d]:hover{color:rgb(58, 46, 116);color:var(--user-theme-fore)}.user-anchor.default[data-v-eda7432d]:active,.user-anchor.underline[data-v-eda7432d]:active{background-color:rgb(224, 224, 224);background-color:var(--user-active)}.user-anchor.hover-type[data-v-eda7432d]:active{color:rgb(150, 134, 232);color:var(--user-theme-active)}.user-button{box-sizing:border-box;padding:4px 12px;border:none;border-radius:6px;background:none;background-color:rgb(255, 255, 255);background-color:var(--user-back);box-shadow:0 0 0 1px rgba(185, 185, 185, .6);box-shadow:0 0 0 1px var(--user-border);color:rgb(16, 16, 16);color:var(--user-fore);cursor:pointer;transition:.4s;transition:var(--default-duration)}.user-button:hover:not([disabled]){background-color:rgb(240, 240, 240);background-color:var(--user-hover)}.user-button:active:not([disabled]){background-color:rgb(224, 224, 224);background-color:var(--user-active)}.user-button:focus:not([disabled]){border-color:rgb(97, 78, 194);border-color:var(--user-theme);box-shadow:0 0 0 2px rgb(97, 78, 194);box-shadow:0 0 0 2px var(--user-theme)}.theme-style.user-button{color:rgb(255, 255, 255)!important;color:var(--user-back)!important}.theme-style.user-button{background-color:rgb(97, 78, 194);background-color:var(--user-theme)}.theme-style.user-button:hover{background-color:rgb(119, 105, 194);background-color:var(--user-theme-hover)}.theme-style.user-button:active{background-color:rgb(150, 134, 232);background-color:var(--user-theme-active)}.unset-background.user-button{background-color:transparent;background-color:initial}.no-border.user-button,.no-border-all.user-button{box-shadow:none}.no-border-all.user-button:hover,.no-border-all.user-button:focus{box-shadow:none}.toggle-button[data-v-d9ec2dab]{color:rgb(16, 16, 16);color:var(--user-fore)}.toggle-button .user-icon[data-v-d9ec2dab],.toggle-button .user-icon-outline[data-v-d9ec2dab]{color:rgb(118, 118, 118);color:var(--user-fore-minimal)}.toggle-button.toggle-on[data-v-d9ec2dab]{background-color:rgb(97, 78, 194);background-color:var(--user-theme);color:rgb(255, 255, 255);color:var(--user-back)}.user-check[data-v-0c59d2d9]{display:flex;align-items:center}.user-check .check-button[data-v-0c59d2d9]{width:16px;min-width:16px;height:16px;min-height:16px;padding:0;border-radius:4px;color:rgb(97, 78, 194);color:var(--user-theme);font-size:14px;font-weight:700}.user-check .check-label[data-v-0c59d2d9]{display:flex;align-items:center;color:rgb(86, 86, 86);color:var(--user-fore-light);cursor:pointer;font-size:16px}.user-check .label-text[data-v-0c59d2d9]{padding-left:6px}.user-color-picker[data-v-d3a455db]{display:flex;align-items:center;gap:8px}.user-color-picker .color-input[data-v-d3a455db]{width:24px;height:24px}.user-dialog-modal[data-v-b6f65c55]{position:fixed;z-index:var(--6be7c052);display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;background-color:rgba(0,0,0,0.50196);top:0;right:0;bottom:0;left:0}.user-dialog-modal.no-modal[data-v-b6f65c55]{width:0;height:0;background:none}.user-dialog-modal.no-modal .user-dialog.shadow[data-v-b6f65c55]{width:0;height:0}.user-dialog-modal.no-modal .user-dialog.shadow .dialog-content[data-v-b6f65c55]{padding:0}.user-dialog-modal .user-dialog.default[data-v-b6f65c55]{box-shadow:0 0 10px rgba(0,0,0,0.2);display:flex;max-height:calc(100% - 32px);box-sizing:border-box;flex-direction:column;border:1px solid rgba(185, 185, 185, .2);border:1px solid var(--user-border-light);border-radius:12px;margin:16px;background-color:rgb(255, 255, 255);background-color:var(--user-back);font-size:16px;outline:none;transition:.4s;transition:var(--default-duration)}html.dark-theme .user-dialog-modal .user-dialog.default[data-v-b6f65c55]{box-shadow:0 0 16px rgba(0,0,0,0.4)}.user-dialog-modal .user-dialog.animation.dialog-enter-active[data-v-b6f65c55]{animation:var(--4221cbf4)}.user-dialog-modal .user-dialog.animation.dialog-leave-active[data-v-b6f65c55]{animation:var(--088534ab)}.user-dialog-modal .user-dialog.default.force-alert[data-v-b6f65c55]{outline:3px solid rgb(139, 0, 0);outline:3px solid var(--user-error-color)}.user-dialog-modal .user-dialog .dialog-title[data-v-b6f65c55]{padding:16px 16px 0;color:rgb(0, 0, 0);color:var(--user-fore-highlight);font-size:22px;font-weight:var(--font-weight-bold)}.user-dialog-modal .user-dialog .dialog-content[data-v-b6f65c55]{flex-grow:1;padding:16px;overflow-y:auto}.user-dialog-modal .user-dialog .dialog-button-panel[data-v-b6f65c55]{display:flex;padding:16px;border-radius:0 0 12px 12px;background-color:rgb(228, 228, 228);background-color:var(--user-back-deep);gap:8px}.user-dialog-modal .user-dialog .dialog-button-panel .dialog-button[data-v-b6f65c55]{flex-grow:1;padding:6px 16px;font-size:14px}.user-image[data-v-325b901c]{-o-object-fit:cover;object-fit:cover}.user-textbox[data-v-94e658f6]{box-sizing:border-box;padding:4px;border:2px solid rgba(185, 185, 185, .6);border:2px solid var(--user-border);border-radius:6px;background-color:rgb(255, 255, 255);background-color:var(--user-back);outline:none;transition:all .4s, width 0s, height 0s;transition:all var(--default-duration), width 0s, height 0s}.user-textbox[data-v-94e658f6]:hover{border-color:rgb(235, 235, 235);border-color:var(--user-back-light)}.user-textbox[data-v-94e658f6]:focus{border-color:rgb(97, 78, 194);border-color:var(--user-theme)}.lodash-style.user-textbox[data-v-94e658f6]{padding:0;border:none;border-radius:0;border-bottom:2px solid rgba(185, 185, 185, .6);border-bottom:2px solid var(--user-border)}.pager-wrapper .pager-button-container .pager-button.user-icon[data-v-34c5d5c5]{font-family:Material Symbols,monospace!important}.pager-wrapper .pager-button-container .pager-button.user-icon[data-v-34c5d5c5]{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 40;font-weight:400;-webkit-user-select:none;-moz-user-select:none;user-select:none}.pager-wrapper[data-v-34c5d5c5]{display:flex;width:-moz-fit-content;width:fit-content;box-sizing:border-box;align-items:center;padding:4px;font-size:16px;gap:6px}.pager-wrapper .pager-button-container[data-v-34c5d5c5]{display:flex;align-items:center}.pager-wrapper .pager-button-container .pager-button[data-v-34c5d5c5]{padding:4px 10px;color:rgb(16, 16, 16);color:var(--user-fore);font-family:sans-serif;font-family:var(--user-font)}.pager-wrapper .pager-button-container .pager-button[data-v-34c5d5c5]:not(:hover):not(:active):not(:focus){background-color:transparent}.pager-wrapper .pager-button-container .pager-button.fill[data-v-34c5d5c5]:not(:hover):not(:active):not(:focus){background-color:rgb(255, 255, 255);background-color:var(--user-back)}.pager-wrapper .pager-button-container .pager-button.curr-pager-button[data-v-34c5d5c5]{border-radius:0;box-shadow:0 3px 0 rgb(97, 78, 194);box-shadow:0 3px 0 var(--user-theme);color:rgb(97, 78, 194);color:var(--user-theme)}.pager-wrapper .pager-separactor[data-v-34c5d5c5]{color:rgb(118, 118, 118);color:var(--user-fore-minimal);font-family:monospace;font-family:var(--user-font-mono)}.pager-wrapper .jumper-container[data-v-34c5d5c5]{display:flex;align-items:center;color:rgb(86, 86, 86);color:var(--user-fore-light);gap:6px}.pager-wrapper .jumper-container .jumper[data-v-34c5d5c5]{width:36px;width:3em;padding:2px 4px;color:rgb(16, 16, 16);color:var(--user-fore);font-family:monospace;font-family:var(--user-font-mono)}.pager-wrapper .tail-slot[data-v-34c5d5c5]{margin-left:auto;color:rgb(118, 118, 118);color:var(--user-fore-minimal)}@keyframes select-arrow-down-e636ff80{0%{transform:translateY(0)}70%{transform:translateY(10%)}to{transform:translateY(0)}}.user-select[data-v-e636ff80]{position:relative}.user-select .select-toggle[data-v-e636ff80]{display:flex;width:100%;align-items:center;justify-content:space-between;gap:8px;text-align:justify}.user-select .select-toggle.toggle-on[data-v-e636ff80]{background-color:rgb(255, 255, 255);background-color:var(--user-back);box-shadow:0 0 0 1px rgb(97, 78, 194);box-shadow:0 0 0 1px var(--user-theme);color:rgb(16, 16, 16);color:var(--user-fore)}.user-select .select-toggle.toggle-on .user-icon[data-v-e636ff80]{animation:select-arrow-down-e636ff80 .2s cubic-bezier(.18,.89,.32,1.6);animation:select-arrow-down-e636ff80 var(--fast-duration) cubic-bezier(.18,.89,.32,1.6);color:rgb(97, 78, 194);color:var(--user-theme);font-weight:var(--font-weight-bold)}.user-select .select-toggle.toggle-off[data-v-e636ff80]{box-shadow:0 0 0 1px rgba(185, 185, 185, .6);box-shadow:0 0 0 1px var(--user-border)}.user-select .select-container[data-v-e636ff80]{position:absolute;z-index:2025;top:calc(100% + 4px);left:0;display:flex;overflow:hidden;width:100%;flex-direction:column;border:1px solid rgba(185, 185, 185, .6);border:1px solid var(--user-border);border-radius:6px;background-color:rgb(255, 255, 255);background-color:var(--user-back);box-shadow:0 0 10px rgba(0,0,0,0.2);transform-origin:top}.user-select .select-container.select-enter-active[data-v-e636ff80],.user-select .select-container.select-leave-active[data-v-e636ff80]{transition:transform .2s, opacity .2s;transition:transform var(--fast-duration), opacity var(--fast-duration)}.user-select .select-container.select-enter-from[data-v-e636ff80],.user-select .select-container.select-leave-to[data-v-e636ff80]{opacity:0;transform:scale(.95) translateY(-4px)}.user-select .select-container .select-button[data-v-e636ff80]{border-radius:0;box-shadow:none;text-align:justify}.user-select .select-container .select-desc[data-v-e636ff80]{padding:4px 14px;border-top:1px solid rgba(185, 185, 185, .6);border-top:1px solid var(--user-border);color:rgb(86, 86, 86);color:var(--user-fore-light);font-size:14px}.float-message{box-shadow:0 0 10px rgba(0,0,0,0.2);position:absolute;z-index:99999;overflow:hidden;box-sizing:border-box;padding:4px 6px;border:1px solid rgba(185, 185, 185, .6);border:1px solid var(--user-border);border-radius:6px;background-color:rgb(255, 255, 255);background-color:var(--user-back);font-size:14px}html.dark-theme .float-message{box-shadow:0 0 16px rgba(0,0,0,0.4)}.float-message.float-message-enter-active{animation:kf-fade-in .2s;animation:kf-fade-in var(--fast-duration)}.float-message.float-message-leave-active{animation:kf-fade-out .2s;animation:kf-fade-out var(--fast-duration)}#user-header-progress[data-v-1ffe8ff6]{position:fixed;z-index:99999;top:0;max-width:100vw;height:4px;background-color:rgb(97, 78, 194);background-color:var(--user-theme);transition:.4s}#user-header-progress.complete[data-v-1ffe8ff6]{animation:kf-fade-out .8s forwards;animation:kf-fade-out var(--xslow-duration) forwards}.message-wrapper[data-v-edcaf171]{display:flex;overflow-x:hidden;overflow-y:auto;overflow-x:hidden;overflow-y:auto;overflow:hidden auto;flex-direction:column}@keyframes toast-render-896ce94b{0%{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}@keyframes toast-unload-896ce94b{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.9)}}.check[data-v-896ce94b]{color:rgb(0, 128, 0);color:var(--user-check-color)}.warning[data-v-896ce94b]{color:rgb(255, 140, 0);color:var(--user-warn-color)}.error[data-v-896ce94b]{color:rgb(139, 0, 0);color:var(--user-error-color)}.toast-wrapper[data-v-896ce94b]{position:fixed;z-index:999;bottom:64px;left:50%;transform:translate(-50%)}.toast-wrapper .toast-container[data-v-896ce94b]{display:flex;max-height:60vh;align-items:center;padding:8px 12px;border:1px solid rgba(185, 185, 185, .6);border:1px solid var(--user-border);border-radius:16px;animation:toast-render-896ce94b .4s;animation:toast-render-896ce94b var(--default-duration);background-color:rgb(255, 255, 255);background-color:var(--user-back);box-shadow:0 10px 16px rgba(0,0,0,0.16078);gap:6px;text-overflow:ellipsis;transition:.4s;transition:var(--default-duration)}.toast-wrapper .toast-container.unloading[data-v-896ce94b]{animation:toast-unload-896ce94b .4s forwards;animation:toast-unload-896ce94b var(--default-duration) forwards}.toast-wrapper .toast-container .toast-icon[data-v-896ce94b]{font-size:18px}.toast-wrapper .toast-container .toast-content[data-v-896ce94b]{overflow:hidden;max-width:80vw;max-height:60vh;padding:0 6px;text-align:left;text-overflow:ellipsis;white-space:pre-wrap}.toast-wrapper .toast-container span[data-v-896ce94b]{color:rgb(118, 118, 118);color:var(--user-fore-minimal);font-size:12px}.toast-wrapper .toast-container .toast-controls .close-button[data-v-896ce94b]{padding:6px;color:rgb(139, 0, 0);color:var(--user-error-color);font-weight:var(--font-weight-bold);line-height:100%}.toast-wrapper .toast-container .toast-controls .close-button[data-v-896ce94b]:not(:active):not(:focus){box-shadow:none}.blur-effect[data-v-896ce94b]{background-color:rgba(255, 255, 255, .6);background-color:var(--user-back-transp)}html:not([perf-saver]) .blur-effect[data-v-896ce94b]{-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px)}html.dark-theme .blur-effect[data-v-896ce94b]{-webkit-backdrop-filter:blur(24px) brightness(.8);backdrop-filter:blur(24px) brightness(.8)}.blur-effect .close-button[data-v-896ce94b]:not(:hover):not(:active):not(:focus){background-color:transparent}.user-toggle-panel .toggle-container .panel-button.toggle-off[data-v-8d3c6357]{font-family:Material Symbols,monospace!important}.user-toggle-panel .toggle-container .panel-button.toggle-off[data-v-8d3c6357]{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 40;font-weight:400;-webkit-user-select:none;-moz-user-select:none;user-select:none}.user-toggle-panel .toggle-container .panel-button.toggle-on[data-v-8d3c6357]{font-family:Material Symbols,monospace!important}.user-toggle-panel .toggle-container .panel-button.toggle-on[data-v-8d3c6357]{font-variation-settings:"FILL" 1,"wght" 400,"GRAD" 0,"opsz" 40;font-weight:400;-webkit-user-select:none;-moz-user-select:none;user-select:none}.user-toggle-panel[data-v-8d3c6357]{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.user-toggle-panel .toggle-container[data-v-8d3c6357]{display:flex;flex-direction:column;align-items:center;gap:4px}.user-toggle-panel .toggle-container .panel-button[data-v-8d3c6357]{width:58px;height:58px;border-radius:12px;font-size:24px}.user-toggle-panel .toggle-container .panel-button.toggle-off[data-v-8d3c6357]{color:rgb(118, 118, 118);color:var(--user-fore-minimal)}.user-toggle-panel .toggle-container .panel-button.toggle-on[data-v-8d3c6357]:focus{box-shadow:0 0 0 1px rgb(97, 78, 194);box-shadow:0 0 0 1px var(--user-theme)}.user-toggle-panel .toggle-container .toggle-name[data-v-8d3c6357]{color:rgb(86, 86, 86);color:var(--user-fore-light);font-size:12px}
@keyframes kf-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes kf-fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes kf-slide-in {
  0% {
    opacity: 0;
    transform: translateY(20%);
  }
}
@keyframes kf-slide-out {
  100% {
    opacity: 0;
    transform: translateY(20%);
  }
}
@keyframes kf-slide-zoom-in {
  0% {
    opacity: 0;
    transform: translateY(20%) scale(0.85);
  }
}
@keyframes kf-slide-zoom-out {
  100% {
    opacity: 0;
    transform: translateY(20%) scale(0.85);
  }
}
@keyframes kf-dialog-in {
  0% {
    opacity: 0;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes kf-dialog-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}
@keyframes kf-zoom-in {
  0% {
    transform: scale(0.72);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes kf-fade-zoom-in {
  0% {
    opacity: 0;
    transform: scale(0.72);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}/* stylelint-disable font-family-no-missing-generic-family-keyword */\r
/* https: //fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,200..400,0..1,-50..100 */\r
\r
/* fallback */\r
@font-face {\r
    font-family: "Material Symbols";\r
    font-style: normal;\r
    font-weight: 200 400;\r
    src: url("https://fonts.gstatic.com/s/materialsymbolsoutlined/v110/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2") format("woff2");\r
}\r
\r
.material-symbols-outlined {\r
    display: inline-block;\r
    direction: ltr;\r
    font-family: "Material Symbols";\r
    font-size: 24px;\r
    -webkit-font-smoothing: antialiased;\r
    font-style: normal;\r
    font-weight: normal;\r
    letter-spacing: normal;\r
    line-height: 1;\r
    text-transform: none;\r
    white-space: nowrap;\r
    word-wrap: normal;\r
}\r
:root {
  --img-tieba-icon: url("https://gitee.com/HacksawBlade/Tieba-Remix/raw/master/assets/images/main/icon.png");
}

.dark-theme {
  --default-background: rgb(32, 32, 32);
  --default-hover: rgb(42, 42, 42);
  --default-active: rgb(54, 54, 54);
  --page-background: rgb(26, 26, 26);
  --trans-page-background: rgba(26, 26, 26, 0.6);
  --trans-default-background: rgba(32, 32, 32, 0.6);
  --deep-background: rgb(26, 26, 26);
  --trans-deep-background: rgba(20, 20, 20, 0.6);
  --light-background: rgb(60, 60, 60);
  --trans-light-background: rgba(60, 60, 60, 0.6);
  --very-light-background: rgb(60, 60, 60);
  --elem-color: rgb(26, 26, 26);
  --default-fore: rgb(230, 230, 230);
  --light-fore: rgb(180, 180, 180);
  --minimal-fore: rgb(144, 144, 144);
  --highlight-fore: rgb(255, 255, 255);
  --border-color: rgba(96, 96, 96, 0.6);
  --light-border-color: rgba(96, 96, 96, 0.2);
  --tieba-theme-color: rgb(113, 97, 193);
  --trans-tieba-theme-color: rgba(113, 97, 193, 0.6);
  --tieba-theme-hover: rgb(149, 128, 254);
  --tieba-theme-active: rgb(172, 156, 253);
  --tieba-theme-background: rgba(113, 97, 193, 0.2);
  --tieba-theme-fore: rgb(150, 128, 255);
  --level-green-background: rgba(96, 153, 59, 0.1);
  --level-green-fore: rgb(133, 206, 84);
  --level-blue-background: rgba(0, 165, 227, 0.1);
  --level-blue-fore: rgb(0, 169, 255);
  --level-yellow-background: rgba(229, 193, 90, 0.1);
  --level-yellow-fore: rgb(242, 205, 96);
  --level-orange-background: rgba(204, 122, 0, 0.1);
  --level-orange-fore: rgb(255, 170, 0);
  --check-color: lawngreen;
  --error-color: tomato;
  --warning-color: orange;
  color-scheme: dark;
}

.light-theme {
  --default-background: rgb(255, 255, 255);
  --default-hover: rgb(240, 240, 240);
  --default-active: rgb(224, 224, 224);
  --page-background: rgb(245, 245, 245);
  --trans-page-background: rgba(245, 245, 245, 0.6);
  --trans-default-background: rgba(255, 255, 255, 0.6);
  --deep-background: rgb(228, 228, 228);
  --trans-deep-background: rgba(200, 200, 200, 0.6);
  --light-background: rgb(235, 235, 235);
  --trans-light-background: rgba(228, 228, 228, 0.6);
  --very-light-background: rgb(245, 245, 245);
  --elem-color: rgb(240, 240, 240);
  --default-fore: rgb(16, 16, 16);
  --light-fore: rgb(86, 86, 86);
  --minimal-fore: rgb(118, 118, 118);
  --highlight-fore: rgb(0, 0, 0);
  --border-color: rgba(185, 185, 185, 0.6);
  --light-border-color: rgba(185, 185, 185, 0.2);
  --tieba-theme-color: rgb(97, 78, 194);
  --trans-tieba-theme-color: rgba(97, 78, 194, 0.6);
  --tieba-theme-hover: rgb(119, 105, 194);
  --tieba-theme-active: rgb(150, 134, 232);
  --tieba-theme-background: rgba(97, 78, 194, 0.2);
  --tieba-theme-fore: rgb(58, 46, 116);
  --level-green-background: rgba(84, 130, 53, 0.1);
  --level-green-fore: rgb(51, 78, 32);
  --level-blue-background: rgba(0, 153, 213, 0.1);
  --level-blue-fore: rgb(0, 81, 111);
  --level-yellow-background: rgba(164, 139, 63, 0.1);
  --level-yellow-fore: rgb(124, 105, 46);
  --level-orange-background: rgba(255, 153, 0, 0.1);
  --level-orange-fore: rgb(178, 104, 0);
  --check-color: green;
  --error-color: darkred;
  --warning-color: darkorange;
  color-scheme: "light";
}:root {
  --xfast-duration: 0.1s;
  --fast-duration: 0.2s;
  --default-duration: 0.4s;
  --slow-duration: 0.6s;
  --xslow-duration: 0.8s;
}.about-wrapper[data-v-9147564a] {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  margin: auto;
  gap: 12px;
}
.about-wrapper .main-title[data-v-9147564a] {
  display: flex;
  align-items: center;
  gap: 12px;
}
.about-wrapper .main-title .main-icon[data-v-9147564a] {
  width: 64px;
  height: 64px;
}
.about-wrapper .main-title .title[data-v-9147564a] {
  color: var(--highlight-fore);
  font-size: 32px;
  font-style: italic;
  font-weight: var(--font-weight-bold);
}
.about-wrapper .script-info[data-v-9147564a] {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--minimal-fore);
  gap: 8px;
}
.about-wrapper .script-info .author-info[data-v-9147564a] {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.about-wrapper .about-controls[data-v-9147564a] {
  display: flex;
  margin-top: 16px;
  gap: 8px;
}
.about-wrapper .about-controls .about-button[data-v-9147564a] {
  padding: 6px 10px;
  font-size: 14px;
}.update-wrapper[data-v-10bab499] {
  display: flex;
  max-width: 100%;
  flex-direction: column;
  gap: 8px;
}
.update-wrapper .latest-info[data-v-10bab499] {
  display: flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 16px;
  margin: auto;
  margin-bottom: 12px;
  background-color: var(--level-blue-background);
  color: var(--level-blue-fore);
  gap: 6px;
}
.update-wrapper .latest-info.is-latest[data-v-10bab499] {
  background-color: var(--level-green-background);
  color: var(--level-green-fore);
}
.update-wrapper .title-container[data-v-10bab499] {
  display: flex;
  align-items: center;
  gap: 10px;
}
.update-wrapper .title-container .title[data-v-10bab499] {
  flex-shrink: 1;
  font-size: 20px;
  font-weight: var(--font-weight-bold);
}
.update-wrapper .title-container .is-pre-release[data-v-10bab499] {
  min-width: -moz-max-content;
  min-width: max-content;
  padding: 2px 8px;
  border-radius: 16px;
  background-color: var(--level-orange-background);
  color: var(--level-orange-fore);
  font-size: 14px;
}
.update-wrapper .main-info[data-v-10bab499] {
  display: flex;
  align-items: center;
  gap: 8px;
}
.update-wrapper .main-info .avatar[data-v-10bab499] {
  width: 32px;
  height: 32px;
  border-radius: 32px;
}
.update-wrapper .main-info .release-time[data-v-10bab499] {
  margin-left: auto;
}
.update-wrapper .update-controls[data-v-10bab499] {
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 8px;
}
.update-wrapper .update-controls .up-button[data-v-10bab499] {
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: var(--font-weight-bold);
}
.update-wrapper .update-controls .up-name[data-v-10bab499] {
  font-family: var(--code-monospace);
}
.forbidden-wrapper[data-v-10bab499] {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
}
.forbidden-wrapper .icon[data-v-10bab499] {
  font-size: 64px;
}.layout-custom-back[data-v-1b12e597] {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
}
.layout-custom-back .custom-image[data-v-1b12e597] {
  max-width: 100%;
  max-height: 320px;
  border-radius: 8px;
  margin: 0 auto;
}
.layout-custom-back .custom-back-buttons[data-v-1b12e597] {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}
.layout-custom-back .adjust-controls[data-v-1b12e597] {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.layout-custom-back .adjust-controls .control-set[data-v-1b12e597] {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.layout-custom-back .adjust-controls .control-set .editor[data-v-1b12e597] {
  width: auto;
  font-family: var(--code-zh);
}.color-picker[data-v-faec1870] {
  display: flex;
  align-items: center;
  gap: 8px;
}
.color-picker .color-input[data-v-faec1870] {
  width: 24px;
  height: 24px;
}.theme-color-component[data-v-aa418cd2] {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.theme-color-component .reset-button[data-v-aa418cd2] {
  margin-left: auto;
}.theme-picker {
  z-index: 9999 !important;
}@keyframes content-in-ceae965b {
0% {
    opacity: 0;
    transform: translateY(20px);
}
100% {
    opacity: 1;
}
}
.key-button[data-v-ceae965b] {
  display: flex;
  overflow: hidden;
  min-width: 120px;
  align-items: center;
  padding: 12px;
  border-radius: 0;
  font-size: 16px;
  gap: 12px;
  text-align: justify;
  transition: var(--default-duration);
  white-space: nowrap;
}
.key-button .icon[data-v-ceae965b] {
  font-size: 20px;
  font-variation-settings: "FILL" 0, "wght" 300;
  transition: all var(--default-duration), margin-left var(--fast-duration) ease-out;
}
.key-button .key-info[data-v-ceae965b] {
  display: flex;
  width: calc(100% - 32px);
  flex-direction: column;
}
.key-button .key-title[data-v-ceae965b],
.key-button .key-desc[data-v-ceae965b] {
  overflow: hidden;
  text-overflow: ellipsis;
}
.key-button .key-desc[data-v-ceae965b] {
  color: var(--minimal-fore);
  font-size: 14px;
}
.key-button.main-key[data-v-ceae965b] {
  box-sizing: content-box;
}
.key-button.main-key .main-key-selected[data-v-ceae965b] {
  position: relative;
  width: 0;
  height: 100%;
  border-radius: 24px;
  margin-left: -12px;
  background-color: var(--tieba-theme-color);
}
.key-button.main-key .main-key-selected[data-v-ceae965b]::after {
  position: absolute;
  top: 0;
  width: 0;
  height: 100%;
  border-radius: 24px;
  background-color: var(--tieba-theme-color);
  content: "";
}
.key-button.main-key.selected[data-v-ceae965b] {
  color: var(--tieba-theme-fore) !important;
}
.key-button.main-key.selected .main-key-selected[data-v-ceae965b] {
  padding-right: 4px;
}
.key-button.main-key.selected .main-key-selected[data-v-ceae965b]::after {
  width: 4px;
}
.key-button.main-key.selected .icon[data-v-ceae965b] {
  margin-left: 4px;
  font-variation-settings: "FILL" 1, "GRAD" 48, "wght" 300;
  font-weight: var(--font-weight-normal);
}
.key-button.main-key.selected .key-desc[data-v-ceae965b] {
  color: var(--tieba-theme-color);
}
.key-button.sub-key[data-v-ceae965b] {
  -webkit-text-decoration: none;
  text-decoration: none;
  transition: var(--default-duration);
}
.key-button.sub-key.selected[data-v-ceae965b] {
  color: var(--tieba-theme-fore);
  -webkit-text-decoration: underline var(--tieba-theme-color) 2px;
          text-decoration: underline var(--tieba-theme-color) 2px;
}
.settings-wrapper[data-v-ceae965b] {
  display: flex;
  width: 100%;
  max-width: var(--content-max);
  height: 100%;
  box-sizing: border-box;
}
.settings-wrapper .left-container[data-v-ceae965b] {
  display: flex;
  width: 30%;
  max-width: 280px;
  flex-direction: column;
  border-right: 2px solid var(--light-border-color);
}
.settings-wrapper .left-container .search-controls[data-v-ceae965b] {
  display: flex;
  flex-direction: column;
  padding: 0 16px 16px 0;
  gap: 8px;
}
.settings-wrapper .left-container .search-controls .title[data-v-ceae965b] {
  color: var(--default-fore) !important;
}
.settings-wrapper .left-container .search-controls .title[data-v-ceae965b] {
  margin-top: 8px;
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  line-height: normal;
}
.settings-wrapper .left-container .search-controls .search-box[data-v-ceae965b] {
  padding: 6px;
  font-size: 14px;
}
.settings-wrapper .left-container .left-panel[data-v-ceae965b] {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
}
.settings-wrapper .middle-container[data-v-ceae965b] {
  display: flex;
  width: 20%;
  max-width: 220px;
  flex-direction: column;
  padding: 0 6px;
  border-right: 2px solid var(--light-border-color);
  gap: 6px;
}
.settings-wrapper .middle-container .sub-key[data-v-ceae965b] {
  display: flex;
  padding: 8px 16px;
  border-radius: 12px;
  gap: 4px;
}
.settings-wrapper .middle-container .sub-key .key-title[data-v-ceae965b] {
  font-size: 14px;
}
.settings-wrapper .middle-container .sub-key[data-v-ceae965b]:not(:hover):not(:active):not(:focus) {
  background-color: transparent;
  background-color: initial;
}
.settings-wrapper .right-container[data-v-ceae965b] {
  display: flex;
  overflow: auto;
  width: 50%;
  flex-direction: column;
  flex-grow: 1;
  padding: 16px;
  margin: -16px -16px -16px 0;
  font-size: 16px;
  gap: 32px;
}
.settings-wrapper .right-container .setting-content[data-v-ceae965b] {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.settings-wrapper .right-container .setting-content .content-title[data-v-ceae965b] {
  margin: 8px 0 0;
  color: var(--highlight-fore);
  font-size: 18px;
  font-weight: var(--font-weight-bold);
}
.settings-wrapper .right-container .setting-content .content-sub-title[data-v-ceae965b] {
  margin: 4px 0 0;
  color: var(--default-fore);
  font-size: 16px;
  font-weight: var(--font-weight-bold);
}
.settings-wrapper .right-container .setting-content .content-desc[data-v-ceae965b] {
  display: flex;
  flex-direction: column;
  color: var(--light-fore);
  gap: 6px;
}
.settings-wrapper .right-container .setting-content .content-textbox[data-v-ceae965b] {
  box-sizing: content-box;
}
.settings-wrapper .right-container .setting-content .content-textbox.textarea[data-v-ceae965b] {
  width: 100%;
  height: 6em;
  resize: none;
}
.settings-wrapper .right-container .setting-content .content-image[data-v-ceae965b] {
  max-width: 100%;
  max-height: 320px;
  border-radius: 8px;
  margin: 0 auto;
}
.settings-wrapper .right-container .setting-content .setting-control[data-v-ceae965b] {
  display: flex;
}
.settings-wrapper .right-container .setting-content .setting-control .settings-toggle[data-v-ceae965b] {
  background: none;
  font-size: 36px;
}
.settings-wrapper .right-container .setting-content .setting-control .settings-toggle.toggle-on[data-v-ceae965b] {
  color: var(--tieba-theme-color);
}
.settings-wrapper .right-container .setting-content .setting-control .settings-toggle.toggle-on[data-v-ceae965b]:hover {
  color: var(--tieba-theme-fore);
}
.settings-wrapper .right-container .setting-content .setting-control .icon-component[data-v-ceae965b] {
  margin-left: auto;
  font-size: 64px;
  font-variation-settings: "FILL" 1;
}
.settings-wrapper .right-container .setting-content .setting-control .settings-select[data-v-ceae965b] {
  width: min(100%, 280px);
}
.settings-wrapper .empty-container[data-v-ceae965b] {
  margin: auto;
  color: var(--minimal-fore);
  font-size: 72px;
}.block-panel {
  display: flex;
  min-width: 30px;
  height: 26px;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 24px;
  background-color: var(--trans-light-background);
  font-size: 14px;
  text-align: center;
}
.block-panel .icon {
  color: var(--light-fore);
  font-size: 18px;
}
.block-panel .panel-button {
  border: none !important;
}
.block-panel .panel-button {
  width: 30px;
  height: 30px;
  padding: 4px;
  border-radius: 48px;
}
.block-panel.left-align {
  margin-left: 0;
}#header-progress[data-v-782eb887] {
  position: fixed;
  z-index: 99999;
  top: 0;
  max-width: 100vw;
  height: 4px;
  background-color: var(--tieba-theme-color);
  transition: 0.4s;
}
#header-progress.complete[data-v-782eb887] {
  animation: kf-fade-out var(--xslow-duration) forwards;
}#shield-editor[data-v-5a7329f8] {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
#shield-editor #shield-editor-rule-control[data-v-5a7329f8] {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}
#shield-editor #shield-editor-rule-control #shield-editor-rule[data-v-5a7329f8] {
  flex: 1;
  font-size: 16px;
}
#shield-editor #shield-editor-rule-control label[data-v-5a7329f8] {
  color: var(--light-fore);
}
#shield-editor #shield-editor-toggle-control[data-v-5a7329f8] {
  display: flex;
  align-items: center;
  gap: 16px;
}
#shield-editor #shield-editor-delete[data-v-5a7329f8] {
  padding: 6px 8px;
  background-color: var(--error-color);
  color: var(--default-background);
}.shield-container[data-v-a0433092] {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 16px;
}
.shield-container .words-container[data-v-a0433092] {
  display: flex;
  flex-wrap: wrap;
  padding: 12px;
  border-radius: 12px;
  background-color: var(--trans-light-background);
  gap: 4px;
}
.shield-container .words-container .shield-elem[data-v-a0433092] {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  gap: 4px;
}
.shield-container .words-container .shield-elem.disabled[data-v-a0433092] {
  opacity: 0.5;
}
.shield-container .words-container .shield-elem.disabled .content[data-v-a0433092] {
  -webkit-text-decoration: line-through;
  text-decoration: line-through;
}
.shield-container .words-container .shield-elem .icon[data-v-a0433092] {
  color: var(--light-fore);
}
.shield-container .words-container .remove-all[data-v-a0433092] {
  background-color: var(--error-color);
  color: var(--default-background);
  font-variation-settings: "FILL" 0;
}
.shield-container .empty-list-container[data-v-a0433092] {
  color: var(--minimal-fore);
}
.shield-container .shield-controls[data-v-a0433092] {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.shield-container .shield-controls .shield-input[data-v-a0433092] {
  width: 100%;
  height: auto;
  max-height: 6em;
  box-sizing: border-box;
  padding: 6px;
  font-size: 16px;
  resize: none;
}
.shield-container .shield-controls .submit-controls[data-v-a0433092] {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
.shield-container .shield-controls .submit-controls .submit-button[data-v-a0433092] {
  padding: 4px 12px;
  font-size: 14px;
  font-weight: var(--font-weight-bold);
}@keyframes rotate-a73ee99e {
100% {
    transform: rotate(360deg);
}
}
@keyframes loading-a73ee99e {
25% {
    stroke-dashoffset: 140;
}
75% {
    stroke-dashoffset: 280;
}
}
.loading-svg[data-v-a73ee99e] {
  width: 64px;
  height: 64px;
}
.loading-svg .loading-circle[data-v-a73ee99e] {
  animation: loading-a73ee99e 2.8s ease-in-out infinite,rotate-a73ee99e 1s linear infinite;
  stroke: var(--tieba-theme-color);
  stroke-dasharray: 314;
  stroke-dashoffset: 314;
  stroke-linecap: round;
  transform-origin: center;
}.images-viewer .head-controls .head-btn.toggle-on[data-v-1afc9eaf] {
  font-family: "Material Symbols", monospace !important;
}
.images-viewer .head-controls .head-btn.toggle-on[data-v-1afc9eaf] {
  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 40;
  font-weight: normal;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.images-viewer[data-v-1afc9eaf] {
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: var(--default-duration);
}
.images-viewer .icon[data-v-1afc9eaf] {
  color: var(--light-fore);
}
.images-viewer .control-panel[data-v-1afc9eaf] {
  position: absolute;
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--light-border-color);
  border-radius: 18px;
  background-color: var(--trans-default-background);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.4);
}
html:not([perf-saver]) .images-viewer .control-panel[data-v-1afc9eaf] {
  -webkit-backdrop-filter: blur(24px);
          backdrop-filter: blur(24px);
}
html.dark-theme .images-viewer .control-panel[data-v-1afc9eaf] {
  -webkit-backdrop-filter: blur(24px) brightness(0.8);
          backdrop-filter: blur(24px) brightness(0.8);
}
.images-viewer .head-controls[data-v-1afc9eaf] {
  top: 16px;
  margin-bottom: auto;
  transition: var(--default-duration);
}
.images-viewer .head-controls.hide[data-v-1afc9eaf] {
  box-shadow: none;
  transform: translateY(calc(-100% - 16px)) scale(0.85);
}
.images-viewer .head-controls .head-btn[data-v-1afc9eaf] {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 12px;
  background-color: transparent;
  background-color: initial;
  box-shadow: none;
  font-size: 16px;
}
.images-viewer .head-controls .head-btn[data-v-1afc9eaf]:hover {
  background-color: var(--default-background);
  color: var(--tieba-theme-color);
}
.images-viewer .head-controls .head-btn.toggle-on[data-v-1afc9eaf] {
  background-color: var(--tieba-theme-color);
  color: var(--default-background);
}
.images-viewer .head-controls .head-btn.toggle-on[data-v-1afc9eaf]:hover {
  filter: brightness(1.2);
}
.images-viewer .head-controls .close[data-v-1afc9eaf]:hover {
  color: var(--error-color);
}
.images-viewer .head-controls span[data-v-1afc9eaf] {
  color: var(--minimal-fore);
  font-family: var(--code-monospace);
}
.images-viewer .head-controls .zoom-size[data-v-1afc9eaf] {
  padding: 10px;
}
.images-viewer .back[data-v-1afc9eaf],
.images-viewer .forward[data-v-1afc9eaf] {
  width: -moz-min-content;
  width: min-content;
  height: 60px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  font-size: large;
}
.images-viewer .back[data-v-1afc9eaf] {
  left: 32px;
}
.images-viewer .back.hide[data-v-1afc9eaf] {
  box-shadow: none;
  transform: translateX(calc(-100% - 32px)) scale(0.85);
}
.images-viewer .forward[data-v-1afc9eaf] {
  right: 32px;
}
.images-viewer .forward.hide[data-v-1afc9eaf] {
  box-shadow: none;
  transform: translateX(calc(100% + 32px)) scale(0.85);
}
.images-viewer .back[data-v-1afc9eaf]:hover,
.images-viewer .forward[data-v-1afc9eaf]:hover {
  background-color: var(--default-background);
}
.images-viewer .back[data-v-1afc9eaf]:focus,
.images-viewer .forward[data-v-1afc9eaf]:focus {
  box-shadow: 0 0 0 2px var(--tieba-theme-color);
}
.images-viewer .image-container[data-v-1afc9eaf] {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.images-viewer .image-container .curr-image[data-v-1afc9eaf] {
  position: absolute;
  -o-object-fit: contain;
     object-fit: contain;
}
.images-viewer .image-container .curr-image.changing[data-v-1afc9eaf] {
  display: none;
  transition: none;
}
.images-viewer .bottom-controls-wrapper[data-v-1afc9eaf] {
  bottom: 16px;
  max-width: calc(100% - 48px);
  padding: 0;
  margin-top: auto;
  overflow-x: hidden;
  transition: var(--default-duration);
}
.images-viewer .bottom-controls-wrapper.hide[data-v-1afc9eaf] {
  box-shadow: none;
  transform: translateY(calc(100% + 16px)) scale(0.85);
}
.images-viewer .bottom-controls-wrapper:hover .bottom-panel-scroll-bar[data-v-1afc9eaf] {
  opacity: 1;
}
.images-viewer .bottom-controls-wrapper .bottom-controls-container[data-v-1afc9eaf] {
  display: flex;
  overflow: hidden;
  padding: 10px;
}
.images-viewer .bottom-controls-wrapper .bottom-controls-container img[src=""][data-v-1afc9eaf],
.images-viewer .bottom-controls-wrapper .bottom-controls-container img[data-v-1afc9eaf]:not([src]) {
  opacity: 0;
}
.images-viewer .bottom-controls-wrapper .bottom-controls-container .thumb-container[data-v-1afc9eaf] {
  display: flex;
  gap: 4px;
}
.images-viewer .bottom-controls-wrapper .bottom-controls-container .thumb-container .bottom-btn[data-v-1afc9eaf] {
  overflow: hidden;
  width: 100px;
  height: 75px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background-color: var(--trans-default-background);
  transition: linear var(--xfast-duration);
}
.images-viewer .bottom-controls-wrapper .bottom-controls-container .thumb-container .bottom-btn .image-list[data-v-1afc9eaf] {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
     object-fit: cover;
}
.images-viewer .bottom-controls-wrapper .bottom-controls-container .thumb-container .bottom-btn.selected[data-v-1afc9eaf] {
  border: 3px solid var(--tieba-theme-color);
}
.images-viewer .bottom-controls-wrapper .bottom-panel-scroll-bar[data-v-1afc9eaf] {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background-color: var(--minimal-fore);
  opacity: 0;
  transition: opacity var(--default-duration);
}.post-container .bottom-controls .replies[data-v-3551b9d3]::before {
  font-family: "Material Symbols", monospace !important;
}
.post-container .bottom-controls .replies[data-v-3551b9d3]::before {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 40;
  font-weight: normal;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
a[data-v-3551b9d3] {
  color: inherit;
  -webkit-text-decoration: none;
  text-decoration: none;
}
p[data-v-3551b9d3] {
  margin: 0;
}
img[data-v-3551b9d3]::before {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--light-background);
  content: "";
}
.dynamic .img-button[data-v-3551b9d3] {
  min-width: 30% !important;
  flex: initial !important;
  flex-grow: 1 !important;
}
.post-container[data-v-3551b9d3] {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  padding: 16px;
  border-radius: 16px;
  background-color: var(--default-background);
  cursor: pointer;
  gap: 20px;
  text-align: justify;
}
.post-container .forum-btn[data-v-3551b9d3] {
  border-radius: 24px;
  font-size: 14px;
}
.post-container .forum-btn[data-v-3551b9d3]:not(:hover):not(:active):not(:focus) {
  background-color: var(--light-background);
  box-shadow: none;
}
.post-container .main-content[data-v-3551b9d3] {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.post-container .main-content .title[data-v-3551b9d3] {
  margin: 0;
  color: var(--highlight-fore);
  font-weight: var(--font-weight-bold);
}
.post-container .main-content .content[data-v-3551b9d3] {
  overflow: hidden;
  color: var(--light-fore);
  font-size: 14px;
  text-overflow: ellipsis;
}
.post-container .img-container[data-v-3551b9d3] {
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  border-radius: 16px;
  gap: 6px;
}
.post-container .img-container .img-button[data-v-3551b9d3] {
  overflow: hidden;
  min-width: 40%;
  height: 144px;
  flex: 1;
  padding: 0;
  border: none;
  border-radius: 0;
}
.post-container .img-container .img-button .post-img[data-v-3551b9d3] {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
     object-fit: cover;
  transition: 0.4s cubic-bezier(0, 0, 0.2, 1);
}
.post-container .img-container .img-button .post-img[data-v-3551b9d3]:hover {
  scale: 1.2;
}
.post-container .bottom-controls[data-v-3551b9d3] {
  display: flex;
  align-items: center;
  gap: 12px;
}
.post-container .bottom-controls .author[data-v-3551b9d3] {
  display: flex;
  align-items: center;
  padding: 0;
  border-radius: 24px;
  background-color: transparent;
  background-color: initial;
}
.post-container .bottom-controls .author .author-portrait[data-v-3551b9d3] {
  width: 32px;
  height: 32px;
  border-radius: 24px;
  -o-object-fit: cover;
     object-fit: cover;
}
.post-container .bottom-controls .author .author-info[data-v-3551b9d3] {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  text-align: left;
}
.post-container .bottom-controls .author .author-info .author-name[data-v-3551b9d3] {
  font-size: 14px;
  font-weight: var(--font-weight-bold);
}
.post-container .bottom-controls .author .author-info .post-time[data-v-3551b9d3] {
  color: var(--minimal-fore);
  font-size: 12px;
}
.post-container .bottom-controls .author[data-v-3551b9d3]:not(:hover):not(:active):not(:focus) {
  box-shadow: none;
}
.post-container .bottom-controls .replies[data-v-3551b9d3] {
  display: flex;
  min-width: 16px;
  align-items: center;
  border-radius: 24px;
  margin-left: auto;
  color: var(--light-fore);
  font-family: var(--code-zh);
  font-size: 13px;
  font-weight: var(--font-weight-bold);
}
.post-container .bottom-controls .replies[data-v-3551b9d3]::before {
  margin-right: 6px;
  content: "forum";
  font-size: 16px;
  font-weight: var(--font-weight-normal);
}.masonry-wrapper[data-v-d3bb286a] {
  display: flex;
  width: 100%;
  max-width: var(--content-max);
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.masonry-wrapper .masonry-container[data-v-d3bb286a] {
  width: 100%;
  margin: auto;
}
@keyframes feeds-in-d3bb286a {
0% {
    transform: scale(0.72);
}
100% {
    transform: scale(1);
}
}
.masonry-wrapper .masonry-container .post-elem[data-v-d3bb286a] {
  animation: feeds-in-d3bb286a 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.2);
}
.masonry-wrapper .masonry-container .post-elem[data-v-d3bb286a]:not(:hover):not(:active):not(:focus) {
  box-shadow: none;
}
.masonry-wrapper > .post-elem[data-v-d3bb286a] {
  position: absolute !important;
  visibility: hidden !important;
}.index-wrapper .grid-container .profile-menu-container .curr-user .user-profile[data-v-36c4a869] {
  -o-object-fit: contain;
     object-fit: contain;
}
a[data-v-36c4a869] {
  color: inherit;
  -webkit-text-decoration: none;
  text-decoration: none;
}
.block-wrapper[data-v-36c4a869] {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.block-controls[data-v-36c4a869] {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
}
.block-controls .block-title[data-v-36c4a869] {
  margin: 0;
  font-size: 24px;
  font-weight: var(--font-weight-bold);
}
.block-container[data-v-36c4a869] {
  padding: 8px;
  border-radius: 12px;
  background-color: var(--trans-light-background);
}
html:not([perf-saver]) body.custom-background .block-container[data-v-36c4a869] {
  -webkit-backdrop-filter: blur(24px);
          backdrop-filter: blur(24px);
}
html.dark-theme body.custom-background .block-container[data-v-36c4a869] {
  -webkit-backdrop-filter: blur(24px) brightness(0.8);
          backdrop-filter: blur(24px) brightness(0.8);
}
.block-panel[data-v-36c4a869] {
  display: flex;
  min-width: 30px;
  height: 26px;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 24px;
  margin-left: auto;
  background-color: var(--trans-light-background);
  font-size: 14px;
  text-align: center;
}
.block-panel .icon[data-v-36c4a869] {
  color: var(--light-fore);
  font-size: 18px;
}
.block-panel .panel-btn[data-v-36c4a869] {
  width: 30px;
  height: 30px;
  padding: 4px;
  border: none;
  border-radius: 48px;
}
.block-panel.left-align[data-v-36c4a869] {
  margin-left: 0;
}
.index-wrapper[data-v-36c4a869] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.index-wrapper .grid-container[data-v-36c4a869] {
  display: grid;
  max-width: var(--content-max);
  margin: 16px;
  grid-gap: 36px;
  gap: 36px;
  grid-template-rows: repeat(1, 1fr);
}
.index-wrapper .grid-container .head-controls[data-v-36c4a869] {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  margin-top: 24px;
  gap: 24px;
}
.index-wrapper .grid-container .head-controls .main-title[data-v-36c4a869] {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.index-wrapper .grid-container .head-controls .main-title .main-icon[data-v-36c4a869] {
  height: 64px;
}
.index-wrapper .grid-container .head-controls .main-title .title[data-v-36c4a869] {
  font-size: 36px;
  font-style: italic;
  font-weight: var(--font-weight-bold);
}
.index-wrapper .grid-container .head-controls .search-controls[data-v-36c4a869] {
  position: relative;
  display: grid;
  width: 100%;
  max-width: 420px;
  justify-content: center;
  grid-template-columns: 1fr 72px;
}
.index-wrapper .grid-container .head-controls .search-controls .search-box[data-v-36c4a869] {
  width: 100%;
  padding: 8px;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  font-size: 16px;
}
.index-wrapper .grid-container .head-controls .search-controls .search-button[data-v-36c4a869] {
  border: none;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  font-size: 16px;
  font-weight: var(--font-weight-bold);
}
.index-wrapper .grid-container .head-controls .search-controls .search-suggestions[data-v-36c4a869] {
  position: absolute;
  z-index: 1;
  top: 100%;
  display: flex;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin-top: 4px;
  background-color: var(--default-background);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  animation: kf-fade-in 0.2s;
}
.index-wrapper .grid-container .head-controls .search-controls .search-suggestions .search-elem[data-v-36c4a869] {
  display: flex;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0;
  padding: 8px;
  border: none;
  border-radius: 0;
  animation: stretch-36c4a869 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
  gap: 8px;
  text-align: justify;
}
@keyframes stretch-36c4a869 {
0% {
    padding: 4px 8px;
}
100% {
    padding: 8px;
}
}
.index-wrapper .grid-container .head-controls .search-controls .search-suggestions .search-elem .sugg-img[data-v-36c4a869] {
  width: 42px;
  height: 42px;
  border-radius: 8px;
}
.index-wrapper .grid-container .head-controls .search-controls .search-suggestions .search-elem .sugg-content[data-v-36c4a869] {
  position: relative;
  display: flex;
  width: calc(100% - 42px - 8px);
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.index-wrapper .grid-container .head-controls .search-controls .search-suggestions .search-elem .sugg-content .sugg-title[data-v-36c4a869] {
  overflow: hidden;
  margin: 0;
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.index-wrapper .grid-container .head-controls .search-controls .search-suggestions .search-elem .sugg-content .sugg-desc[data-v-36c4a869] {
  overflow: hidden;
  margin: 0;
  color: var(--light-fore);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.index-wrapper .grid-container .profile-menu-container[data-v-36c4a869] {
  position: absolute;
  z-index: 1;
}
.index-wrapper .grid-container .profile-menu-container .curr-user[data-v-36c4a869] {
  position: fixed;
  top: 24px;
  left: 24px;
  overflow: hidden;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 3px solid var(--border-color);
  border-radius: 36px;
}
.index-wrapper .grid-container .profile-menu-container .curr-user .user-profile[data-v-36c4a869] {
  width: 100%;
}
.index-wrapper .grid-container .profile-menu-container .profile-menu[data-v-36c4a869] {
  top: 64px;
  left: 24px;
}
.index-wrapper .grid-container .config-menu-container[data-v-36c4a869] {
  position: absolute;
  z-index: 1;
  display: flex;
}
.index-wrapper .grid-container .config-menu-container .config-menu-btn[data-v-36c4a869] {
  position: fixed;
  top: 24px;
  right: 24px;
  height: 32px;
  border: none;
  border-radius: 36px;
  background-color: var(--page-background);
  font-size: 24px;
}
.index-wrapper .grid-container .config-menu-container .config-menu-btn[data-v-36c4a869]:hover {
  background-color: var(--default-background);
}
.index-wrapper .grid-container .config-menu-container .config-menu-btn[data-v-36c4a869]:active {
  background-color: var(--default-hover);
}
.index-wrapper .grid-container .config-menu-container .config-menu[data-v-36c4a869] {
  top: 64px;
  right: 24px;
  opacity: 1;
}
.index-wrapper .grid-container .signed-count[data-v-36c4a869] {
  font-weight: var(--font-weight-bold);
}
.index-wrapper .grid-container .block-panel.followed[data-v-36c4a869] {
  margin-left: auto;
}
.index-wrapper .grid-container .followed-container[data-v-36c4a869] {
  margin-top: -16px;
}
.index-wrapper .grid-container .followed-container .followed-list[data-v-36c4a869] {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
  border-radius: 12px;
  background-color: var(--trans-light-background);
  gap: 4px;
}
.index-wrapper .grid-container .followed-container .followed-list .followed-btn[data-v-36c4a869] {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 12px;
  font-size: 14px;
  gap: 6px;
}
.index-wrapper .grid-container .followed-container .followed-list .followed-btn .signed[data-v-36c4a869] {
  color: green;
  font-weight: var(--font-weight-bold);
}
.index-wrapper .grid-container .followed-container .followed-list .followed-btn .forum-level[data-v-36c4a869] {
  min-width: 24px;
  padding: 0 2px;
  border-radius: 24px;
  font-weight: var(--font-weight-bold);
  text-align: center;
}
.index-wrapper .grid-container .topic-list[data-v-36c4a869] {
  display: grid;
  grid-gap: 4px;
  gap: 4px;
  grid-auto-rows: max-content;
  grid-template-columns: repeat(2, 1fr);
}
.index-wrapper .grid-container .topic-list .topic-btn[data-v-36c4a869] {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  gap: 8px;
}
.index-wrapper .grid-container .topic-list .topic-btn .topic-img[data-v-36c4a869] {
  width: 72px;
  border-radius: 12px;
}
.index-wrapper .grid-container .topic-list .topic-btn .topic-content[data-v-36c4a869] {
  display: flex;
  flex-flow: column wrap;
  gap: 4px;
  text-align: justify;
}
.index-wrapper .grid-container .topic-list .topic-btn .topic-content .topic-title[data-v-36c4a869] {
  display: flex;
  align-items: center;
  gap: 6px;
}
.index-wrapper .grid-container .topic-list .topic-btn .topic-content .topic-title [class^=topic-rank][data-v-36c4a869] {
  padding: 0 4px;
  border-radius: 4px;
  background-color: orange;
  color: var(--default-background);
  font-weight: var(--font-weight-bold);
  text-align: center;
}
.index-wrapper .grid-container .topic-list .topic-btn .topic-content .topic-title .topic-name[data-v-36c4a869] {
  font-size: 16px;
  font-weight: var(--font-weight-bold);
}
.index-wrapper .grid-container .topic-list .topic-btn .topic-content .topic-desc[data-v-36c4a869] {
  color: var(--light-fore);
  font-size: 14px;
}
.index-wrapper .masonry-container[data-v-36c4a869] {
  display: flex;
  width: calc(100% - 32px);
  max-width: var(--content-max);
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.index-wrapper .masonry-container .feeds-container[data-v-36c4a869] {
  width: 100%;
  margin: auto;
}
@keyframes feeds-in-36c4a869 {
0% {
    transform: scale(0.72);
}
100% {
    transform: scale(1);
}
}
@keyframes refresh-btn-in-36c4a869 {
0% {
    padding: 0 18px;
    opacity: 0;
}
100% {
    padding: 8px 18px;
    opacity: 1;
}
}
.index-wrapper .masonry-container .feeds-container .feeds-refresh-btn[data-v-36c4a869] {
  position: fixed;
  z-index: 1;
  bottom: 24px;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  border-width: 2px;
  border-radius: 16px;
  animation: refresh-btn-in-36c4a869 0.4s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  gap: 6px;
  transform: translateX(-50%);
}
.index-wrapper .masonry-container .feeds-container .feeds-refresh-btn .icon[data-v-36c4a869] {
  font-size: 18px;
}
.index-wrapper .masonry-container .post-elem[data-v-36c4a869] {
  animation: feeds-in-36c4a869 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.2);
}
.index-wrapper .masonry-container .post-elem[data-v-36c4a869]:not(:hover):not(:active):not(:focus) {
  box-shadow: none;
}
.index-wrapper .masonry-container .empty-container .no-feed-content[data-v-36c4a869] {
  color: var(--minimal-fore);
  font-size: small;
  text-align: center;
}.pager-wrapper .pager-button-container .pager-button.icon[data-v-706b517f] {
  font-family: "Material Symbols", monospace !important;
}
.pager-wrapper .pager-button-container .pager-button.icon[data-v-706b517f] {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 40;
  font-weight: normal;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.pager-wrapper[data-v-706b517f] {
  display: flex;
  width: -moz-fit-content;
  width: fit-content;
  box-sizing: border-box;
  align-items: center;
  padding: 4px;
  font-size: 16px;
  gap: 6px;
}
.pager-wrapper .pager-button-container[data-v-706b517f] {
  display: flex;
  align-items: center;
}
.pager-wrapper .pager-button-container .pager-button[data-v-706b517f] {
  padding: 4px 10px;
  color: var(--default-fore);
  font-family: var(--code-zh);
}
.pager-wrapper .pager-button-container .pager-button[data-v-706b517f]:not(:hover):not(:active):not(:focus) {
  background-color: transparent;
}
.pager-wrapper .pager-button-container .pager-button.fill[data-v-706b517f]:not(:hover):not(:active):not(:focus) {
  background-color: var(--default-background);
}
.pager-wrapper .pager-button-container .pager-button.curr-pager-button[data-v-706b517f] {
  border-radius: 0;
  box-shadow: 0 3px 0 var(--tieba-theme-color);
  color: var(--tieba-theme-color);
}
.pager-wrapper .pager-separactor[data-v-706b517f] {
  color: var(--minimal-fore);
  font-family: var(--code-monospace);
}
.pager-wrapper .jumper-container[data-v-706b517f] {
  display: flex;
  align-items: center;
  color: var(--light-fore);
  gap: 6px;
}
.pager-wrapper .jumper-container .jumper[data-v-706b517f] {
  width: 36px;
  width: 3em;
  padding: 2px 4px;
  color: var(--default-fore);
  font-family: var(--code-monospace);
}
.pager-wrapper .tail-slot[data-v-706b517f] {
  margin-left: auto;
  color: var(--minimal-fore);
}#thread-editor[data-v-dbefc831] {
  display: flex;
  width: 100%;
  max-width: var(--content-max);
  max-height: 100vh;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  margin: auto auto 0;
  background-color: var(--default-background);
  font-size: 12px;
  gap: 8px;
  transition: 0.4s;
}
#thread-editor #thread-editor-exit[data-v-dbefc831] {
  margin-left: auto;
  font-size: 18px;
}
#thread-editor #thread-editor-exit[data-v-dbefc831]:not(:hover):not(:active):not(:focus) {
  box-shadow: none;
}
#thread-editor .title-editor[data-v-dbefc831] {
  width: 100%;
  flex-grow: 1;
  border-width: 3px;
  background-color: transparent;
  font-size: 24px;
  font-weight: var(--font-weight-bold);
}
#thread-editor h1[data-v-dbefc831] {
  margin-right: auto;
}
#thread-editor #thread-editor-slot[data-v-dbefc831] {
  width: 100%;
  flex-shrink: 2;
}
#thread-editor #thread-editor-toolbar[data-v-dbefc831] {
  display: flex;
  width: 100%;
  align-items: center;
}
#thread-editor #thread-editor-toolbar #thread-editor-submit[data-v-dbefc831] {
  padding: 4px 12px;
  margin-left: auto;
  font-size: 16px;
  font-weight: var(--font-weight-bold);
}#thread-editor .edui-container .edui-toolbar .edui-btn-toolbar .edui-btn .edui-icon::before {
  font-family: "Material Symbols", monospace !important;
}
#thread-editor .edui-container .edui-toolbar .edui-btn-toolbar .edui-btn .edui-icon::before {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 40;
  font-weight: normal;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
body {
  overflow-x: hidden;
  overflow-y: scroll;
  overflow: hidden scroll;
}
#thread-editor #ueditor_replace {
  font-size: 16px;
}
#thread-editor .edui-container {
  width: 100% !important;
}
#thread-editor .edui-container .edui-toolbar {
  height: auto;
  align-items: center;
  background-color: transparent;
}
#thread-editor .edui-container .edui-toolbar .edui-btn-toolbar {
  display: flex;
  background-color: transparent;
  gap: 8px;
}
#thread-editor .edui-container .edui-toolbar .edui-btn-toolbar .edui-btn {
  padding: 1px;
  border-radius: 4px;
  margin-right: 0;
  background: none;
  background-color: var(--light-background);
  box-shadow: 0 0 0 1px var(--border-color);
  cursor: pointer;
  transition: 0.4s;
}
#thread-editor .edui-container .edui-toolbar .edui-btn-toolbar .edui-btn .edui-icon {
  display: flex;
  width: -moz-max-content;
  width: max-content;
  align-items: center;
  padding: 2px 4px;
  background: none;
  gap: 4px;
}
#thread-editor .edui-container .edui-toolbar .edui-btn-toolbar .edui-btn .edui-icon::before {
  font-size: 16px;
}
#thread-editor .edui-container .edui-toolbar .edui-dialog-container .edui-dropdown-menu {
  overflow: hidden;
  width: -moz-max-content;
  width: max-content;
  padding: 0;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background: none;
}
#thread-editor .edui-container .edui-toolbar .edui-dialog-container .edui-dropdown-menu .edui-popup-body {
  padding: 0;
  border: none;
  background-color: var(--default-background);
}
#thread-editor .edui-container .edui-toolbar .edui-dialog-container .edui-dropdown-menu .edui-popup-caret {
  display: none;
}
#thread-editor .edui-container .edui-editor-body {
  border: none;
  border-radius: 0;
  border-bottom: 3px solid var(--tieba-theme-color);
  transition: 0.4s;
}
#thread-editor .edui-container .edui-editor-body:hover {
  border-color: var(--light-background);
}
#thread-editor .edui-container .edui-editor-body:focus {
  border-color: var(--tieba-theme-color);
}
#thread-editor .edui-container .edui-body-container {
  min-height: 18px !important;
}
#thread-editor .edui-container .edui-body-container {
  max-height: 50vh;
  padding: 0;
  border-radius: 0;
  background-color: transparent;
}
.edui-btn-topic {
  display: none !important;
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-medal::before {
  content: "diamond";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-medal::after {
  content: "\u7279\u6743";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-image::before {
  content: "photo";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-image::after {
  content: "\u63D2\u5165\u56FE\u7247";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-video::before {
  content: "video_file";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-video::after {
  content: "\u63D2\u5165\u89C6\u9891";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-emotion::before {
  content: "face";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-emotion::after {
  content: "\u63D2\u5165\u8868\u60C5";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-scrawl::before {
  content: "format_paint";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-scrawl::after {
  content: "\u6D82\u9E26";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-topic::before {
  content: "grid_3x3";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-topic::after {
  content: "\u8BDD\u9898";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-quick-reply::before {
  content: "rocket_launch";
}
#thread-editor .edui-btn-toolbar .edui-icon.edui-icon-quick-reply::after {
  content: "\u5FEB\u901F\u56DE\u5E16";
}
.edui-popup-body .layer_medal_list li a::before,
.edui-popup-body .layer_btn_list li a::before {
  font-family: "Material Symbols", monospace !important;
}
.edui-popup-body .layer_medal_list li a::before,
.edui-popup-body .layer_btn_list li a::before {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 40;
  font-weight: normal;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.edui-dialog-container .upload_container .next_step, .edui-popup-body .layer_medal_list li a,
.edui-popup-body .layer_btn_list li a {
  box-sizing: border-box;
  padding: 4px 12px;
  border: none;
  border-radius: 6px;
  background: none;
  background-color: var(--default-background);
  box-shadow: 0 0 0 1px var(--border-color);
  color: var(--default-fore);
  cursor: pointer;
  transition: var(--default-duration);
}
.edui-dialog-container .upload_container .next_step:hover:not([disabled]), .edui-popup-body .layer_medal_list li a:hover:not([disabled]),
.edui-popup-body .layer_btn_list li a:hover:not([disabled]) {
  background-color: var(--default-hover);
}
.edui-dialog-container .upload_container .next_step:active:not([disabled]), .edui-popup-body .layer_medal_list li a:active:not([disabled]),
.edui-popup-body .layer_btn_list li a:active:not([disabled]) {
  background-color: var(--default-active);
}
.edui-dialog-container .upload_container .next_step:focus:not([disabled]), .edui-popup-body .layer_medal_list li a:focus:not([disabled]),
.edui-popup-body .layer_btn_list li a:focus:not([disabled]) {
  border-color: var(--tieba-theme-color);
  box-shadow: 0 0 0 2px var(--tieba-theme-color);
}
.edui-dialog-container .upload_container .theme-style.next_step, .edui-popup-body .layer_medal_list li a.theme-style,
.edui-popup-body .layer_btn_list li a.theme-style {
  color: var(--default-background) !important;
}
.edui-dialog-container .upload_container .theme-style.next_step, .edui-popup-body .layer_medal_list li a.theme-style,
.edui-popup-body .layer_btn_list li a.theme-style {
  background-color: var(--tieba-theme-color);
}
.edui-dialog-container .upload_container .theme-style.next_step:hover, .edui-popup-body .layer_medal_list li a.theme-style:hover,
.edui-popup-body .layer_btn_list li a.theme-style:hover {
  background-color: var(--tieba-theme-hover);
}
.edui-dialog-container .upload_container .theme-style.next_step:active, .edui-popup-body .layer_medal_list li a.theme-style:active,
.edui-popup-body .layer_btn_list li a.theme-style:active {
  background-color: var(--tieba-theme-active);
}
.edui-dialog-container .upload_container .unset-background.next_step, .edui-popup-body .layer_medal_list li a.unset-background,
.edui-popup-body .layer_btn_list li a.unset-background {
  background-color: transparent;
  background-color: initial;
}
.edui-dialog-container .upload_container .no-border.next_step, .edui-popup-body .layer_medal_list li a.no-border,
.edui-popup-body .layer_btn_list li a.no-border {
  box-shadow: none;
}
.edui-dialog-container .upload_container .no-border-all.next_step, .edui-popup-body .layer_medal_list li a.no-border-all,
.edui-popup-body .layer_btn_list li a.no-border-all {
  box-shadow: none;
}
.edui-dialog-container .upload_container .no-border-all.next_step:hover, .edui-popup-body .layer_medal_list li a.no-border-all:hover,
.edui-popup-body .layer_btn_list li a.no-border-all:hover, .edui-dialog-container .upload_container .no-border-all.next_step:focus, .edui-popup-body .layer_medal_list li a.no-border-all:focus,
.edui-popup-body .layer_btn_list li a.no-border-all:focus {
  box-shadow: none;
}
.edui-dialog-container .edui-popup {
  position: static !important;
}
.edui-dialog-container .upload_container {
  padding: 0 20px 20px 0;
}
.edui-dialog-container .upload_container .slide_item_img {
  border-color: var(--tieba-theme-color) !important;
}
.edui-dialog-container .upload_container .slide_item_img {
  overflow: hidden;
}
.edui-dialog-container .upload_container .watermark_options {
  position: static;
  margin-left: 20px;
}
.edui-dialog-container .upload_container .next_step {
  position: static;
  width: -moz-max-content;
  width: max-content;
  height: -moz-max-content;
  height: max-content;
  padding: 4px 8px;
  margin-left: auto;
  line-height: normal;
}
.edui-popup-body {
  position: static;
}
.edui-popup-body .layer_medal_list,
.edui-popup-body .layer_btn_list {
  width: -moz-max-content;
  width: max-content;
  height: -moz-max-content;
  height: max-content;
}
.edui-popup-body .layer_medal_list li,
.edui-popup-body .layer_btn_list li {
  display: flex;
  overflow: hidden;
  align-items: center;
  padding: 0;
  background: none;
}
.edui-popup-body .layer_medal_list li a,
.edui-popup-body .layer_btn_list li a {
  display: flex;
  width: -moz-max-content;
  width: max-content;
  height: -moz-max-content;
  height: max-content;
  align-items: center;
  padding: 4px 8px;
  border-radius: 0;
  box-shadow: none;
  gap: 4px;
}
.edui-popup-body .layer_medal_list li a::before,
.edui-popup-body .layer_btn_list li a::before {
  font-size: 16px;
}
.layer_medal_list li.post_bubble a::before {
  content: "bubble_chart";
}
.layer_medal_list li.post_bubble a::after {
  content: "\u53D1\u5E16\u6C14\u6CE1";
}
.layer_medal_list li.colorful_font a::before {
  content: "format_color_text";
}
.layer_medal_list li.colorful_font a::after {
  content: "\u5F69\u8272\u5B57\u4F53";
}
.layer_btn_list {
  padding: 0 !important;
}
.layer_btn_list li {
  border: none !important;
}
.layer_btn_list li.from_upload a::before {
  content: "upload_file";
}
.layer_btn_list li.from_upload a::after {
  content: "\u4E0A\u4F20\u6587\u4EF6";
}
.layer_btn_list li.from_web a::before {
  content: "web";
}
.layer_btn_list li.from_web a::after {
  content: "\u7F51\u7EDC\u56FE\u7247";
}#thread-editor .emotion_container .ueditor_emotion_tab .s_prev::before,
#thread-editor .emotion_container .ueditor_emotion_tab .s_next::before {
  font-family: "Material Symbols", monospace !important;
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_prev::before,
#thread-editor .emotion_container .ueditor_emotion_tab .s_next::before {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 40;
  font-weight: normal;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_prev,
#thread-editor .emotion_container .ueditor_emotion_tab .s_next {
  box-sizing: border-box;
  padding: 4px 12px;
  border: none;
  border-radius: 6px;
  background: none;
  background-color: var(--default-background);
  box-shadow: 0 0 0 1px var(--border-color);
  color: var(--default-fore);
  cursor: pointer;
  transition: var(--default-duration);
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_prev:hover:not([disabled]),
#thread-editor .emotion_container .ueditor_emotion_tab .s_next:hover:not([disabled]) {
  background-color: var(--default-hover);
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_prev:active:not([disabled]),
#thread-editor .emotion_container .ueditor_emotion_tab .s_next:active:not([disabled]) {
  background-color: var(--default-active);
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_prev:focus:not([disabled]),
#thread-editor .emotion_container .ueditor_emotion_tab .s_next:focus:not([disabled]) {
  border-color: var(--tieba-theme-color);
  box-shadow: 0 0 0 2px var(--tieba-theme-color);
}
#thread-editor .emotion_container .ueditor_emotion_tab .theme-style.s_prev,
#thread-editor .emotion_container .ueditor_emotion_tab .theme-style.s_next {
  color: var(--default-background) !important;
}
#thread-editor .emotion_container .ueditor_emotion_tab .theme-style.s_prev,
#thread-editor .emotion_container .ueditor_emotion_tab .theme-style.s_next {
  background-color: var(--tieba-theme-color);
}
#thread-editor .emotion_container .ueditor_emotion_tab .theme-style.s_prev:hover,
#thread-editor .emotion_container .ueditor_emotion_tab .theme-style.s_next:hover {
  background-color: var(--tieba-theme-hover);
}
#thread-editor .emotion_container .ueditor_emotion_tab .theme-style.s_prev:active,
#thread-editor .emotion_container .ueditor_emotion_tab .theme-style.s_next:active {
  background-color: var(--tieba-theme-active);
}
#thread-editor .emotion_container .ueditor_emotion_tab .unset-background.s_prev,
#thread-editor .emotion_container .ueditor_emotion_tab .unset-background.s_next {
  background-color: transparent;
  background-color: initial;
}
#thread-editor .emotion_container .ueditor_emotion_tab .no-border.s_prev,
#thread-editor .emotion_container .ueditor_emotion_tab .no-border.s_next {
  box-shadow: none;
}
#thread-editor .emotion_container .ueditor_emotion_tab .no-border-all.s_prev,
#thread-editor .emotion_container .ueditor_emotion_tab .no-border-all.s_next {
  box-shadow: none;
}
#thread-editor .emotion_container .ueditor_emotion_tab .no-border-all.s_prev:hover,
#thread-editor .emotion_container .ueditor_emotion_tab .no-border-all.s_next:hover, #thread-editor .emotion_container .ueditor_emotion_tab .no-border-all.s_prev:focus,
#thread-editor .emotion_container .ueditor_emotion_tab .no-border-all.s_next:focus {
  box-shadow: none;
}
#thread-editor .emotion_container .tbui_scroll_panel {
  overflow: hidden;
  border-radius: 4px 4px 0 0;
}
html.dark-theme #thread-editor .emotion_container td, html.dark-theme #thread-editor .emotion_container .emotion_preview {
  filter: brightness(0.8);
}
#thread-editor .emotion_container .emotion_preview {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
html.dark-theme #thread-editor .emotion_container .emotion_preview {
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.4);
}
#thread-editor .emotion_container .ueditor_emotion_tab {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-top: 2px solid var(--border-color);
  background: none;
  background-color: var(--default-background);
  color: var(--default-fore);
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_prev,
#thread-editor .emotion_container .ueditor_emotion_tab .s_next {
  width: -moz-max-content !important;
  width: max-content !important;
  height: -moz-max-content !important;
  height: max-content !important;
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_prev,
#thread-editor .emotion_container .ueditor_emotion_tab .s_next {
  position: static;
  padding: 0 2px;
  background: none;
  box-shadow: none;
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_prev::before,
#thread-editor .emotion_container .ueditor_emotion_tab .s_next::before {
  font-size: 10px;
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_prev::before {
  content: "arrow_back_ios";
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_next::before {
  content: "arrow_forward_ios";
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_tab_con_wrapper {
  position: static;
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_tab_con_wrapper .s_tab_btn {
  border-radius: 4px;
  background: none;
  background-color: var(--default-background);
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_tab_con_wrapper .s_tab_btn .s_tab_btnbg {
  border-radius: 4px;
  background: none;
  transition: var(--default-duration);
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_tab_con_wrapper .s_hover {
  filter: brightness(1.2);
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_tab_con_wrapper .s_hover .s_tab_btnbg {
  filter: brightness(1.4);
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_tab_con_wrapper .selected {
  background: none;
}
#thread-editor .emotion_container .ueditor_emotion_tab .s_tab_con_wrapper .selected .s_tab_btnbg {
  background-color: var(--tieba-theme-color);
  color: var(--default-background);
  font-weight: var(--font-weight-bold);
}.toggle-panel .toggle-container .panel-button.toggle-off[data-v-ae42008f] {
  font-family: "Material Symbols", monospace !important;
}
.toggle-panel .toggle-container .panel-button.toggle-off[data-v-ae42008f] {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 40;
  font-weight: normal;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.toggle-panel .toggle-container .panel-button.toggle-on[data-v-ae42008f] {
  font-family: "Material Symbols", monospace !important;
}
.toggle-panel .toggle-container .panel-button.toggle-on[data-v-ae42008f] {
  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 40;
  font-weight: normal;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.toggle-panel[data-v-ae42008f] {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.toggle-panel .toggle-container[data-v-ae42008f] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.toggle-panel .toggle-container .panel-button[data-v-ae42008f] {
  width: 58px;
  height: 58px;
  border-radius: 12px;
  font-size: 24px;
}
.toggle-panel .toggle-container .panel-button.toggle-off[data-v-ae42008f] {
  color: var(--minimal-fore);
}
.toggle-panel .toggle-container .panel-button.toggle-on[data-v-ae42008f]:focus {
  box-shadow: 0 0 0 1px var(--tieba-theme-color);
}
.toggle-panel .toggle-container .toggle-name[data-v-ae42008f] {
  color: var(--light-fore);
  font-size: 12px;
}@keyframes stretch-465a0f6d {
0% {
    padding: 2px 14px;
}
100% {
    padding: 4px 14px;
}
}
a[data-v-465a0f6d] {
  color: inherit;
}
.dropdown-menu[data-v-465a0f6d] {
  position: fixed;
  z-index: 1;
  display: flex;
  overflow: hidden;
  width: -moz-max-content;
  width: max-content;
  min-width: 120px;
  flex-direction: column;
  padding: 4px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--default-background);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  animation: kf-fade-in var(--fast-duration);
  font-size: 14px;
}
.dropdown-menu .menu-item[data-v-465a0f6d] {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 4px 14px;
  border: none;
  border-radius: 6px;
  animation: stretch-465a0f6d var(--fast-duration) cubic-bezier(0.22, 0.61, 0.36, 1);
  background: none;
  color: var(--default-fore);
  font-size: 14px;
  gap: 6px;
  transition: 0.2s;
}
.dropdown-menu .menu-item .menu-title[data-v-465a0f6d] {
  display: flex;
  width: 100%;
  gap: 12px;
  text-align: justify;
}
.dropdown-menu .menu-item .menu-title .menu-inner[data-v-465a0f6d] {
  margin-left: auto;
  color: var(--minimal-fore);
}
.dropdown-menu .menu-item[data-v-465a0f6d]:hover {
  background-color: var(--default-hover);
}
.dropdown-menu .menu-item[data-v-465a0f6d]:active {
  background-color: var(--default-active);
}
.dropdown-menu .menu-separator[data-v-465a0f6d] {
  width: calc(100% + 8px);
  height: 1px;
  margin: 6px 0 6px -4px;
  background-color: var(--border-color);
}
.blur-effect[data-v-465a0f6d] {
  background-color: var(--trans-default-background);
}
html:not([perf-saver]) .blur-effect[data-v-465a0f6d] {
  -webkit-backdrop-filter: blur(24px);
          backdrop-filter: blur(24px);
}
html.dark-theme .blur-effect[data-v-465a0f6d] {
  -webkit-backdrop-filter: blur(24px) brightness(0.8);
          backdrop-filter: blur(24px) brightness(0.8);
}#nav-bar[data-v-29297739] {
  position: fixed;
  z-index: 1200;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--trans-page-background);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all var(--default-duration), width 0s;
}
html.dark-theme #nav-bar[data-v-29297739] {
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.6);
}
#nav-bar.fold[data-v-29297739] {
  transform: translateY(-32px);
}
#nav-bar.fold[data-v-29297739]::after {
  position: absolute;
  top: 48px;
  width: 100%;
  height: 32px;
  content: "";
}
#nav-bar.fold[data-v-29297739]:hover {
  transform: translateY(0);
}
#nav-bar.fold:hover #nav-container[data-v-29297739] {
  display: flex;
}
#nav-bar.fold:hover #fold-bar[data-v-29297739] {
  display: none;
}
#nav-bar.fold #fold-bar[data-v-29297739] {
  position: absolute;
  bottom: 6.5px;
  width: 60px;
  height: 3px;
  border-radius: 3px;
  margin: 0 auto;
  background-color: var(--border-color);
}
#nav-bar.fold #nav-container[data-v-29297739] {
  display: none;
}
#nav-bar.hide[data-v-29297739] {
  box-shadow: none !important;
}
#nav-bar.hide[data-v-29297739] {
  transform: translateY(-100%);
}
#nav-bar.fixed-on-top[data-v-29297739] {
  position: absolute;
}
[no-scrollbar] #nav-bar[data-v-29297739] {
  width: calc(100% - var(--scrollbar-width));
}
#nav-bar #nav-container[data-v-29297739] {
  display: flex;
  width: 100%;
  max-width: var(--content-max);
  height: 100%;
  justify-content: space-between;
}
.shrink-view #nav-bar #nav-container[data-v-29297739] {
  justify-content: space-around;
}
#nav-bar #nav-container .left-container .nav-title-container[data-v-29297739] {
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  gap: 8px;
  -webkit-text-decoration: underline 3px var(--tieba-theme-color);
          text-decoration: underline 3px var(--tieba-theme-color);
}
#nav-bar #nav-container .left-container .nav-title-container .nav-icon[data-v-29297739] {
  width: 36px;
}
#nav-bar #nav-container .left-container .nav-title-container .nav-title[data-v-29297739] {
  color: var(--default-fore);
  font-size: 20px;
  font-style: italic;
  font-weight: var(--font-weight-bold);
  transition: 0.2s;
}
#nav-bar #nav-container .left-container .nav-title-container:hover .nav-title[data-v-29297739], #nav-bar #nav-container .left-container .nav-title-container:active .nav-title[data-v-29297739], #nav-bar #nav-container .left-container .nav-title-container:focus .nav-title[data-v-29297739] {
  color: var(--highlight-fore);
}
#nav-bar #nav-container .middle-container[data-v-29297739] {
  display: flex;
  height: 100%;
  justify-content: center;
}
#nav-bar #nav-container .middle-container .middle-menu-trigger[data-v-29297739] {
  height: 100%;
  padding: 0 10px;
  border: none;
  color: var(--default-fore);
  font-size: 15px;
  font-weight: var(--font-weight-bold);
  text-decoration: underline;
  -webkit-text-decoration: underline solid rgba(0, 0, 0, 0);
          text-decoration: underline solid rgba(0, 0, 0, 0);
  text-decoration-thickness: 2px;
  -webkit-text-decoration: underline 2px rgba(0, 0, 0, 0);
          text-decoration: underline 2px rgba(0, 0, 0, 0);
}
#nav-bar #nav-container .middle-container .middle-menu-trigger[data-v-29297739]:hover {
  -webkit-text-decoration: underline 2px var(--tieba-theme-color);
          text-decoration: underline 2px var(--tieba-theme-color);
}
#nav-bar #nav-container .right-container[data-v-29297739] {
  display: flex;
  gap: 6px;
}
#nav-bar #nav-container .right-container .avatar-button[data-v-29297739] {
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0;
  padding: 0 2px;
  border: 4px;
}
#nav-bar #nav-container .right-container .avatar-button .nav-avatar[data-v-29297739] {
  width: 32px;
  height: 32px;
  border-radius: 24px;
  box-shadow: 0 0 0 1px var(--border-color);
  transition: 0.4s;
}
#nav-bar #nav-container .right-container .avatar-button:hover > .nav-avatar[data-v-29297739] {
  box-shadow: 0 0 0 2px var(--tieba-theme-color);
}
#nav-bar #nav-container .right-container .menu-button[data-v-29297739] {
  padding: 2px 8px;
  border: none;
  color: var(--highlight-fore);
  font-size: 26px;
}
#nav-bar #nav-container .right-container .menu-button[data-v-29297739]:hover {
  color: var(--tieba-theme-color);
}
.menu-trigger[data-v-29297739] {
  border-radius: 0;
  background-color: transparent;
}
.menu-trigger[data-v-29297739]:hover {
  background-color: var(--default-hover);
}
.menu-trigger:hover > .nav-menu[data-v-29297739], .menu-trigger:active > .nav-menu[data-v-29297739] {
  display: block;
}
.nav-menu[data-v-29297739] {
  position: absolute;
  z-index: 1201;
  display: none;
  cursor: default;
  font-weight: var(--font-weight-normal);
}
.nav-menu[data-v-29297739]:hover {
  display: block;
}:root {\r
    --myself-theme-background: rgba(25, 110, 153, 0.2);\r
    --myself-theme-fore: rgb(16, 73, 101);\r
    --cengzhu-theme-background: rgba(255, 89, 107, 0.2);\r
    --cengzhu-theme-fore: rgb(178, 62, 90);\r
}\r
\r
@media (prefers-color-scheme: dark) {\r
    :root {\r
        --myself-theme-background: rgba(34, 135, 204, 0.2);\r
        --myself-theme-fore: rgb(40, 160, 242);\r
        --cengzhu-theme-background: rgba(204, 71, 103, 0.2);\r
        --cengzhu-theme-fore: rgb(255, 89, 118);\r
    }\r
}\r
\r
.tag-elem {\r
    display: inline-block;\r
}\r
\r
.tag-elem::after {\r
    padding: 2px 6px;\r
    border-radius: 4px;\r
    margin: 0 4px;\r
    background-color: var(--trans-light-background);\r
    color: var(--light-fore);\r
    font-size: 12px;\r
    font-weight: var(--font-weight-normal);\r
}\r
\r
.tieba-tags-me::after {\r
    /* background-color: var(--myself-theme-background);\r
    color: var(--myself-theme-fore); */\r
    content: "\u6211";\r
}\r
\r
.tieba-tags-lz::after {\r
    /* background-color: var(--tieba-theme-background);\r
    color: var(--tieba-theme-fore); */\r
    content: "\u697C\u4E3B";\r
}\r
\r
.tieba-tags-cz::after {\r
    /* background-color: var(--cengzhu-theme-background);\r
    color: var(--cengzhu-theme-fore); */\r
    content: "\u5C42\u4E3B";\r
} `);

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  (function(_2, vue, userView, libelemental2, marked2) {
    var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : undefined)();
    var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : undefined)();
    var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : undefined)();
    var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : undefined)();
    var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : undefined)();
    var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : undefined)();
    var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : undefined)();
    var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : undefined)();
    async function requestInstance(api) {
      try {
        const response = await api;
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        userView.toast({
          message: errorMessage(error),
          type: "error",
          duration: 6e3
        });
      }
    }
    const modules = [];
    function AllModules() {
      return modules;
    }
    function errorMessage(error) {
      const errBody = error.stack ? error.stack : error.message;
      return `${_GM_info.script.name} ${_GM_info.script.version}
${errBody}`;
    }
    function spawnOffsetTS(year = 0, month = 0, day = 0, hours = 0, minutes = 0, seconds = 0) {
      const now = /* @__PURE__ */ new Date();
      const offset = new Date(
        now.getFullYear() + year,
        now.getMonth() + month,
        now.getDate() + day,
        now.getHours() + hours,
        now.getMinutes() + minutes,
        now.getSeconds() + seconds,
        0
      );
      return offset.getTime();
    }
    function requestBody(body) {
      let reqBody = "";
      _2.forOwn(body, (value, key) => {
        if (value === null || value === undefined) value = "";
        reqBody += `${key}=${value}&`;
      });
      return reqBody.slice(0, -1);
    }
    function waitUntil(pred, timeout = Infinity) {
      return new Promise((resolve, reject) => {
        const startTime = performance.now();
        let id = -1;
        function tick() {
          if (pred()) {
            cancelAnimationFrame(id);
            resolve();
          } else if (performance.now() - startTime >= timeout) {
            cancelAnimationFrame(id);
            reject(new Error("等待超时"));
            if (_GM_info.script.version === "developer-only") {
              console.error(`等待超时，该函数未在指定时间内得到期望值：${pred}`);
              console.trace("发生错误的调用者：");
            }
          } else {
            id = requestAnimationFrame(tick);
          }
        }
        id = requestAnimationFrame(tick);
      });
    }
    function isLiteralObject(obj) {
      return obj && typeof obj === "object" && !Array.isArray(obj);
    }
    function outputFile(filename, content) {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
    async function selectLocalFile(mode = "text") {
      return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.addEventListener("change", function() {
          if (!input.files) return;
          const file = input.files[0];
          const reader = new FileReader();
          reader.addEventListener("loadend", function() {
            const base64String = reader.result;
            resolve(base64String);
          });
          reader.addEventListener("error", function() {
            reject(new Error());
          });
          switch (mode) {
            case "text": {
              reader.readAsText(file);
              break;
            }
            case "base64": {
              reader.readAsDataURL(file);
              break;
            }
          }
        });
        input.click();
      });
    }
    const fadeInElems = [];
    const fadeInClass = "fade-in-elem";
    function dom(selector, arg1, arg2) {
      if (!arg1) {
        return document.querySelector(selector) ?? undefined;
      }
      if (Array.isArray(arg1)) {
        return Array.from(document.querySelectorAll(selector));
      }
      if (!arg2) {
        return arg1.querySelector(selector) ?? undefined;
      }
      return Array.from(arg1.querySelectorAll(selector));
    }
    async function asyncdom(selector, parent, timeout = Infinity) {
      return waitUntil(() => !_2.isNil(dom(selector, parent)), timeout).then(() => dom(selector, parent));
    }
    function afterHead(callbackfn) {
      callbackfn();
    }
    function mergeNodeAttrs(node, attrs) {
      _2.forOwn(attrs, (value, key) => {
        if (value !== node.getAttribute(key)) {
          if (isLiteralObject(value)) {
            node.setAttribute(key, JSON.stringify(attrs[key]));
          } else {
            node.setAttribute(key, attrs[key]);
          }
        }
      });
    }
    function domrd(tag, attrs, children = [], doc) {
      const DOC = document;
      const elem = DOC.createElement(tag);
      if (attrs) {
        mergeNodeAttrs(elem, attrs);
      }
      if (typeof children === "string") {
        elem.appendChild(document.createTextNode(children));
      } else {
        _2.forEach(children, (child) => {
          if (typeof child === "string") {
            elem.appendChild(document.createTextNode(child));
          } else {
            elem.appendChild(child);
          }
        });
      }
      return elem;
    }
    function findParent(el, trait, mode = "className") {
      const verifier = (() => {
        switch (mode) {
          case "selector": {
            const allValid = new Set(dom(trait, []));
            return (parent) => {
              return allValid.has(parent);
            };
          }
          case "className": {
            return (parent) => parent.classList.contains(trait) ?? false;
          }
          case "id": {
            return (parent) => parent.id === trait;
          }
          case "tagName": {
            return (parent) => parent.tagName.toLowerCase() === trait.toLowerCase();
          }
        }
      })();
      while (el.parentElement && !verifier(el.parentElement)) {
        el = el.parentElement;
      }
      return el.parentElement ? el.parentElement : undefined;
    }
    function fadeInLoad(selector) {
      dom(selector, []).forEach((elem) => {
        elem.classList.add(fadeInClass);
        elem.addEventListener("animationend", () => {
          elem.style.opacity = "1";
          elem.classList.remove(fadeInClass);
        });
      });
    }
    class TbObserver {
      constructor(selector, options, initEvent) {
        __publicField(this, "selector");
        __publicField(this, "options");
        __publicField(this, "initEvent");
        __publicField(this, "events", []);
        this.selector = selector;
        this.options = options;
        this.initEvent = initEvent;
      }
      observe() {
        const eventFuncs = () => {
          this.events.forEach((func) => {
            func();
          });
        };
        if (typeof this.initEvent === "undefined") {
          eventFuncs();
        } else {
          window.addEventListener(this.initEvent, eventFuncs);
        }
        const observer = new MutationObserver(eventFuncs);
        const obsElem = dom(this.selector);
        if (obsElem) observer.observe(obsElem, this.options);
      }
      addEvent(...events) {
        _2.forEach(events, (event) => {
          if (this.events.includes(event)) return;
          if (typeof this.initEvent === "undefined") {
            event();
          } else {
            window.addEventListener(this.initEvent, event);
          }
          this.events.push(event);
        });
      }
    }
    const threadFloorsObserver = new TbObserver("#j_p_postlist", { childList: true });
    const threadCommentsObserver = new TbObserver("#j_p_postlist", { childList: true, subtree: true });
    const legacyIndexFeedsObserver = new TbObserver("#new_list", { childList: true });
    const forumThreadsObserver = new TbObserver("#pagelet_frs-list\\/pagelet\\/thread", { attributes: true }, "load");
    function loadPerf() {
      setPerfAttr();
      setThreadLazyload();
    }
    function setPerfAttr() {
      const perfAttr = {
        default: "perf-default",
        saver: "perf-saver",
        performance: "perf-performance"
      };
      _2.forEach(document.documentElement.attributes, (attr) => {
        if (_2.startsWith(attr.name, "perf-")) {
          document.documentElement.removeAttribute(attr.name);
        }
      });
      document.documentElement.toggleAttribute(perfAttr[perfProfile.get()]);
    }
    async function setThreadLazyload() {
      if (currentPageType() !== "thread") return;
      const lazyloadDiff = {
        default: 1e3,
        saver: 500,
        performance: 9999
      };
      await waitUntil(() => typeof datalazyload !== "undefined");
      threadFloorsObserver.addEvent(setDiff);
      function setDiff() {
        setTimeout(() => {
          datalazyload.userConfig.diff = lazyloadDiff[perfProfile.get()];
        }, 500);
      }
    }
    const baseStyle = "html {\n  padding: 0;\n  margin: 0;\n  text-align: justify;\n}\n\nbody {\n  overflow-x: hidden;\n  overflow-y: scroll;\n  overflow: hidden scroll;\n  padding: 0;\n  margin: 0;\n  font-family: var(--code-zh);\n  font-weight: var(--font-weight-normal);\n}\nbody[no-scrollbar] {\n  padding-right: var(--scrollbar-width) !important;\n}\nbody[no-scrollbar] {\n  overflow: hidden;\n}\n\ndiv,\np {\n  margin: 0;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-weight: var(--font-weight-bold);\n}\n\nselect {\n  padding: 1px 8px;\n  border: 1px solid var(--border-color);\n  border-radius: 8px;\n  cursor: pointer;\n}\n\noption {\n  cursor: pointer;\n}\n\noption:checked {\n  background-color: var(--tieba-theme-color);\n  color: var(--default-background);\n}\n\na {\n  color: inherit;\n  -webkit-text-decoration: none;\n  text-decoration: none;\n  word-break: break-all;\n}\n\n.dialogJ {\n  position: fixed !important;\n  top: 50% !important;\n  left: 50% !important;\n}\n\n.dialogJ {\n  transform: translate(-50%, -50%);\n}";
    const universalStyle = '.icon,\n.outline-icon {\n  font-family: "Material Symbols", monospace !important;\n}\n\n.icon,\n.outline-icon {\n  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 40;\n  font-weight: normal;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n\n.filled-icon {\n  font-family: "Material Symbols", monospace !important;\n}\n\n.filled-icon {\n  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 40;\n  font-weight: normal;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n\n.anchor, .anchor-underline {\n  color: var(--tieba-theme-fore);\n  cursor: pointer;\n  -webkit-text-decoration: none;\n  text-decoration: none;\n  transition: var(--default-duration);\n}\n\n.anchor-underline {\n  text-decoration: underline;\n  -webkit-text-decoration: underline solid currentColor;\n          text-decoration: underline solid currentColor;\n  text-decoration-thickness: 1.2px;\n  -webkit-text-decoration: underline 1.2px;\n          text-decoration: underline 1.2px;\n}\n\n.anchor-noback {\n  cursor: pointer;\n  -webkit-text-decoration: none;\n  text-decoration: none;\n  transition: var(--default-duration);\n}\n\n.anchor:hover, .anchor-underline:hover {\n  background-color: var(--default-hover);\n}\n\n.anchor-underline:hover {\n  text-decoration: underline;\n  -webkit-text-decoration: underline solid rgba(0, 0, 0, 0);\n          text-decoration: underline solid rgba(0, 0, 0, 0);\n  text-decoration-thickness: 1.2px;\n  -webkit-text-decoration: underline 1.2px rgba(0, 0, 0, 0);\n          text-decoration: underline 1.2px rgba(0, 0, 0, 0);\n}\n\n.anchor-noback:hover {\n  color: var(--tieba-theme-fore);\n}\n\n.anchor:active, .anchor-underline:active {\n  background-color: var(--default-active);\n}\n\n.anchor-noback:active {\n  color: var(--tieba-theme-active);\n}\n\n.markdown {\n  font-family: var(--code-zh);\n  font-size: 16px;\n}\n.markdown code {\n  padding: 2px 6px;\n  border-radius: 8px;\n  background-color: var(--light-border-color);\n  font-family: var(--code-monospace);\n  word-wrap: break-word;\n}\n.markdown a {\n  color: var(--tieba-theme-fore);\n}\n.markdown a:hover {\n  -webkit-text-decoration: underline;\n  text-decoration: underline;\n}\n.markdown h2 {\n  margin: 20px 0 8px;\n  font-size: 24px;\n}\n.markdown h3 {\n  margin: 16px 0 6px;\n  font-size: 18px;\n}\n.markdown ul {\n  padding: 0;\n  margin: 6px 0;\n}\n.markdown li {\n  margin: 6px 0 6px 22px;\n  list-style: disc;\n}\n.markdown li::marker {\n  color: var(--minimal-fore);\n}\n.markdown blockquote {\n  margin: 20px 16px;\n  color: var(--minimal-fore);\n}\n.markdown hr {\n  border: 2px solid var(--border-color);\n  margin: 10px 0;\n}\n\n.settings-toggle-button {\n  border: none !important;\n  background-color: transparent !important;\n  background-color: initial !important;\n}\n\n.settings-toggle-button {\n  border-radius: 36px;\n}\n\n.settings-toggle-button.toggle-off {\n  color: var(--minimal-fore);\n  font-variation-settings: "FILL" 0;\n}\n\n.settings-toggle-button.toggle-off::after {\n  content: "toggle_off";\n}\n\n.settings-toggle-button.toggle-on::after {\n  content: "toggle_on";\n}\n\n.settings-toggle-button.toggle-on {\n  color: var(--tieba-theme-color);\n  font-variation-settings: "FILL" 1;\n}\n\n.settings-toggle-button.toggle-off:hover {\n  color: var(--default-hover);\n}\n\n.settings-toggle-button.toggle-off:active {\n  color: var(--default-active);\n}\n\n.settings-toggle-button.toggle-on:hover {\n  color: var(tieba-theme-hover);\n}\n\n.settings-toggle-button.toggle-on:active {\n  color: var(--tieba-theme-active);\n}\n\n.level-green {\n  background-color: var(--level-green-background) !important;\n  color: var(--level-green-fore) !important;\n}\n\n.level-blue {\n  background-color: var(--level-blue-background) !important;\n  color: var(--level-blue-fore) !important;\n}\n\n.level-yellow {\n  background-color: var(--level-yellow-background) !important;\n  color: var(--level-yellow-fore) !important;\n}\n\n.level-orange {\n  background-color: var(--level-orange-background) !important;\n  color: var(--level-orange-fore) !important;\n}\n\n.remove-default {\n  line-height: normal !important;\n}\n\n.remove-default {\n  font-size: 16px;\n}\n.remove-default button,\n.remove-default input,\n.remove-default optgroup,\n.remove-default select,\n.remove-default textarea {\n  font-family: var(--code-zh);\n  font-size: 16px;\n}\n.remove-default .content {\n  min-height: 0;\n  min-height: initial;\n  background: transparent none repeat 0 0 / auto auto padding-box border-box scroll;\n  background: initial;\n}\n.remove-default code {\n  display: inline;\n  display: initial;\n  width: auto;\n  width: initial;\n  height: auto;\n  height: initial;\n}\n.remove-default .content,\n.remove-default .foot {\n  width: auto;\n  width: initial;\n}\n.remove-default button {\n  color: inherit;\n}\n.remove-default h4 {\n  font-family: var(--code-zh);\n}\n\nhtml:not([perf-saver]) body.custom-background .blur-if-custom-background {\n  -webkit-backdrop-filter: blur(24px);\n          backdrop-filter: blur(24px);\n}\nhtml.dark-theme body.custom-background .blur-if-custom-background {\n  -webkit-backdrop-filter: blur(24px) brightness(0.8);\n          backdrop-filter: blur(24px) brightness(0.8);\n}\n\nhtml:not([perf-saver]) .blur-effect {\n  -webkit-backdrop-filter: blur(24px);\n          backdrop-filter: blur(24px);\n}\nhtml.dark-theme .blur-effect {\n  -webkit-backdrop-filter: blur(24px) brightness(0.8);\n          backdrop-filter: blur(24px) brightness(0.8);\n}\n\nhtml:not([perf-saver]) .raster-effect {\n  -webkit-backdrop-filter: saturate(0.8) blur(4px);\n          backdrop-filter: saturate(0.8) blur(4px);\n  background-color: var(--trans-page-background);\n  background-image: radial-gradient(transparent 1px, var(--page-background) 1px);\n  background-size: 4px 4px;\n}';
    const tiebaErrorStyle = '@charset "UTF-8";\n/* 搜索栏 */\n.search-form {\n  background-color: var(--default-background);\n}\n\n.search-form p {\n  display: none;\n}\n\n.page404 {\n  background-color: var(--default-background);\n}\n\n.main-title {\n  color: var(--default-fore);\n}\n\n.main-title a {\n  color: var(--tieba-theme-fore);\n}\n\n.app_download_box {\n  display: none;\n}\n\n#error_404_iframe {\n  display: none;\n}';
    const tiebaForumStyle = '@charset "UTF-8";\n.search_internal_btn::after, .icon_author::after, .icon_replyer::after {\n  font-family: "Material Symbols", monospace !important;\n}\n.search_internal_btn::after, .icon_author::after, .icon_replyer::after {\n  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 40;\n  font-weight: normal;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n\n.search_bright .search_btn_enter_ba {\n  box-sizing: border-box;\n  padding: 4px 12px;\n  border: none;\n  border-radius: 6px;\n  background: none;\n  background-color: var(--default-background);\n  box-shadow: 0 0 0 1px var(--border-color);\n  color: var(--default-fore);\n  cursor: pointer;\n  transition: var(--default-duration);\n}\n.search_bright .search_btn_enter_ba:hover:not([disabled]) {\n  background-color: var(--default-hover);\n}\n.search_bright .search_btn_enter_ba:active:not([disabled]) {\n  background-color: var(--default-active);\n}\n.search_bright .search_btn_enter_ba:focus:not([disabled]) {\n  border-color: var(--tieba-theme-color);\n  box-shadow: 0 0 0 2px var(--tieba-theme-color);\n}\n.search_bright .theme-style.search_btn_enter_ba {\n  color: var(--default-background) !important;\n}\n.search_bright .theme-style.search_btn_enter_ba {\n  background-color: var(--tieba-theme-color);\n}\n.search_bright .theme-style.search_btn_enter_ba:hover {\n  background-color: var(--tieba-theme-hover);\n}\n.search_bright .theme-style.search_btn_enter_ba:active {\n  background-color: var(--tieba-theme-active);\n}\n.search_bright .unset-background.search_btn_enter_ba {\n  background-color: transparent;\n  background-color: initial;\n}\n.search_bright .no-border.search_btn_enter_ba {\n  box-shadow: none;\n}\n.search_bright .no-border-all.search_btn_enter_ba {\n  box-shadow: none;\n}\n.search_bright .no-border-all.search_btn_enter_ba:hover, .search_bright .no-border-all.search_btn_enter_ba:focus {\n  box-shadow: none;\n}\n\n#head {\n  background: transparent none repeat 0 0 / auto auto padding-box border-box scroll !important;\n  background: initial !important;\n  background-color: var(--page-background) !important;\n}\n#head .head_inner {\n  background-color: var(--page-background);\n}\n\n.threadlist_title a,\n.threadlist_title a:hover,\n.threadlist_title a:visited {\n  color: var(--tieba-theme-fore) !important;\n}\n\n.u_menu_item a {\n  color: inherit !important;\n}\n\n.u_menu_item a {\n  /* 顶部菜单 */\n}\n\n.card_banner,\n.plat_recom_carousel {\n  display: none !important;\n}\n\n.card_banner,\n.plat_recom_carousel {\n  /* 大卡 */\n}\n\n.search_main {\n  /* 固定搜索栏 */\n  padding-bottom: 0;\n  padding-bottom: initial;\n}\n\n.search_bright .search_logo_fixed {\n  width: 36px !important;\n  height: 36px !important;\n  margin-left: 56px !important;\n  background-color: rgba(0, 0, 0, 0) !important;\n  background-image: var(--img-tieba-icon) !important;\n  background-repeat: no-repeat !important;\n}\n\n.search_bright .search_logo_fixed {\n  /* 固定搜索栏 icon */\n}\n\n.head_inner .search_logo {\n  display: none !important;\n}\n\n.search_form {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.search_form form {\n  margin-left: 0 !important;\n}\n\n.search_bright .search_inp_border,\n.search_bright .search_ipt {\n  height: 40px !important;\n  border: 2px solid var(--border-color) !important;\n  background-color: var(--default-background) !important;\n  color: var(--default-fore) !important;\n}\n\n.search_bright .search_inp_border,\n.search_bright .search_ipt {\n  box-sizing: border-box;\n  transition: var(--default-duration);\n}\n.search_bright .search_inp_border:hover,\n.search_bright .search_ipt:hover {\n  border-color: var(--light-background) !important;\n}\n.search_bright .search_inp_border:focus,\n.search_bright .search_ipt:focus {\n  border-color: var(--tieba-theme-color) !important;\n}\n\n.search_bright .search_btn {\n  height: 40px !important;\n  border: 1px solid var(--border-color) !important;\n  background-color: var(--default-background) !important;\n  box-shadow: none !important;\n  color: var(--default-fore) !important;\n  line-height: 40px !important;\n}\n\n.search_bright .search_btn {\n  box-sizing: border-box;\n  transition: var(--default-duration);\n}\n.search_bright .search_btn:hover {\n  filter: brightness(1.1);\n}\n.search_bright .search_btn:active {\n  filter: brightness(1.2);\n}\n\n.search_bright .search_btn_enter_ba {\n  border: none !important;\n  background-color: var(--tieba-theme-color) !important;\n  color: var(--default-background) !important;\n}\n\n.search_bright .search_btn_enter_ba {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n\n.search_main_fixed {\n  display: none !important;\n}\n\n.search_main_fixed {\n  border-color: var(--border-color);\n  -webkit-backdrop-filter: blur(24px);\n          backdrop-filter: blur(24px);\n  background-color: var(--trans-default-background);\n  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);\n}\n\n.card_top_theme {\n  border: none !important;\n}\n\n#content {\n  /* 容器 */\n  width: 982px;\n}\n\n.card_top_theme .card_top {\n  padding-left: 120px !important;\n}\n\n.card_top_theme .card_top {\n  /* 吧标题容器 */\n}\n\n.card_title_fname {\n  color: var(--tieba-theme-fore) !important;\n}\n\n.card_title_fname {\n  /* 吧标题 */\n  font-weight: var(--font-weight-bold);\n}\n\n.card_slogan {\n  color: var(--light-fore) !important;\n}\n\n.card_slogan {\n  /* 吧 slogan */\n}\n\n.islike_focus {\n  background-color: var(--tieba-theme-color) !important;\n  background-image: none !important;\n}\n\n.islike_focus {\n  /* 关注吧按钮 */\n}\n\n.cancel_focus {\n  background: none !important;\n  background-color: var(--tieba-theme-background) !important;\n}\n\n.cancel_focus {\n  /* 取关吧按钮 */\n}\n\n.sign_box_bright,\n.sign_box_bright_hover {\n  background: none !important;\n  background-color: var(--tieba-theme-color) !important;\n}\n\n.sign_box_bright,\n.sign_box_bright_hover {\n  /* 签到按钮 */\n}\n\n.sign_box_bright_signed,\n.sign_box_bright_noclass_hover {\n  background: none !important;\n  background-color: var(--tieba-theme-background) !important;\n}\n\n.sign_box_bright_signed,\n.sign_box_bright_noclass_hover {\n  /* 签到按钮：已签到 */\n}\n\n.sign_mod_bright .sign_keep_span {\n  margin: 0 !important;\n  margin: initial !important;\n  text-align: center !important;\n}\n\n.forum_content {\n  border-color: var(--border-color) !important;\n  border-right: none !important;\n  background: none !important;\n  background-color: var(--elem-color) !important;\n}\n\n.forum_content {\n  /* 容器 */\n}\n\n.nav_wrap {\n  border-color: var(--border-color) !important;\n}\n\n.nav_wrap {\n  /* tab */\n}\n\n.nav_list li.focus {\n  background: none !important;\n}\n\n.nav_list li.focus {\n  /* 焦点 tab */\n}\n\n.nav_list a {\n  color: inherit !important;\n}\n\n.j_tabnav_tab:hover {\n  background: none;\n}\n\n.nav_list a:hover,\n.nav_list a:focus {\n  background-color: var(--elem-color) !important;\n}\n\n.nav_list a:hover,\n.nav_list a:focus {\n  /* tab hover */\n}\n\n.search_internal_input {\n  height: 24px !important;\n  border-color: var(--border-color) !important;\n  color: var(--default-fore) !important;\n}\n\n.search_internal_input {\n  /* 吧内搜索 */\n  border-radius: 8px 0 0 8px;\n}\n\n.search_internal_btn {\n  height: 26px !important;\n  background-color: var(--tieba-theme-color) !important;\n  background-image: none !important;\n  vertical-align: middle !important;\n}\n\n.search_internal_btn {\n  /* 吧内搜索按钮 */\n  border-radius: 0 8px 8px 0;\n  /* background-image: var(--svg-search) !important;\n  background-size: 16px !important;\n  background-repeat: no-repeat !important;\n  background-position: center !important; */\n}\n\n.search_internal_btn::after {\n  color: var(--default-background);\n  content: "search";\n  font-size: 18px;\n  font-weight: var(--font-weight-bold);\n  line-height: 26px;\n  text-align: center;\n}\n\n.aside_region {\n  border-bottom: none !important;\n}\n\n.aside_region {\n  /* 右侧内容 */\n}\n\n.aside_region .region_header {\n  color: var(--default-fore) !important;\n}\n\n.my_tieba .media_left,\n.my_tieba .media-left {\n  border: none !important;\n}\n\n.my_tieba .media_left,\n.my_tieba .media-left {\n  /* 我的头像 */\n}\n\n.my_current_forum .badge {\n  border: 1px solid var(--border-color) !important;\n  background-color: var(--light-background) !important;\n  color: var(--default-fore) !important;\n}\n\n.my_current_forum .badge {\n  /* 我的等级 */\n}\n\n.my_current_forum .badge_name {\n  color: var(--default-fore) !important;\n}\n\n.media_top img,\n.media-top img {\n  /* 右侧图片 */\n  border-radius: 16px;\n}\n\n.aside_media_horizontal a,\n.aside-media-horizontal a {\n  color: var(--tieba-theme-fore) !important;\n}\n\n.aside_media_horizontal a,\n.aside-media-horizontal a {\n  /* 右侧超链接 */\n}\n\n.threadlist_bright li.thread_top_list_folder,\n.threadlist_bright li.thread_top_list_folder:hover {\n  background-color: var(--very-light-background) !important;\n}\n\n.threadlist_bright li.thread_top_list_folder,\n.threadlist_bright li.thread_top_list_folder:hover {\n  /* 置顶贴 */\n}\n\n.threadlist_bright > li {\n  border: none !important;\n  background-color: var(--default-background) !important;\n}\n\n.threadlist_bright > li {\n  /* 贴子 */\n}\n\n.threadlist_bright > li:hover {\n  background-color: var(--trans-light-background) !important;\n}\n\n.j_th_tit {\n  /* 帖子标题 */\n  color: var(--tieba-theme-fore);\n  font-weight: var(--font-weight-bold);\n}\n\n.threadlist_bright .threadlist_abs_onlyline,\n.threadlist_bright .threadlist_abs {\n  color: var(--default-fore) !important;\n}\n\n.threadlist_bright .threadlist_abs_onlyline,\n.threadlist_bright .threadlist_abs {\n  /* 帖子摘要 */\n}\n\n/* 隐藏未加载完成的图片 */\n.vpic_wrap img:not([style]) {\n  opacity: 0;\n}\n\n.threadlist_bright .threadlist_media li {\n  border-radius: 8px !important;\n}\n\n.threadlist_bright .threadlist_media li {\n  /* 贴子图片 hover */\n}\n\n.threadlist_media li:hover .threadlist_pic_highlight {\n  display: none !important;\n}\n\n.threadlist_media li:hover .threadlist_pic_highlight {\n  border-radius: 8px;\n}\n\n.vpic_wrap img {\n  border-radius: 8px;\n}\n\n.threadlist_bright .media_disp {\n  border: none !important;\n  background: none !important;\n}\n\n.threadlist_bright .threadlist_video {\n  /* 视频预览 */\n  border-radius: 8px;\n}\n\n.threadlist_rep_num {\n  height: auto !important;\n  height: initial !important;\n  background: none !important;\n  background-color: var(--tieba-theme-background) !important;\n}\n\n.threadlist_rep_num {\n  /* 回贴数 */\n  border-radius: 24px;\n  color: var(--tieba-theme-fore);\n  font-weight: var(--font-weight-bold);\n}\n\n.pagination-default .pagination-item {\n  border: none !important;\n  background-color: var(--light-background) !important;\n  color: var(--light-fore) !important;\n}\n\n.pagination-default .pagination-item {\n  border-radius: 8px;\n  /* 跳页按钮 */\n}\n\n.pagination-default .pagination-current {\n  border: none !important;\n  background-color: var(--tieba-theme-color) !important;\n  color: var(--default-background) !important;\n}\n\n.pagination-default .pagination-current {\n  /* 跳页按钮：当前 */\n}\n\n.pagination-default .pagination-item:not(.pagination-current):hover {\n  border: none !important;\n  background-color: var(--trans-light-background) !important;\n}\n\n.pagination-default .pagination-item:not(.pagination-current):hover {\n  /* 跳页按钮：hover */\n}\n\n/* 底部 */\n#tb_rich_poster_container {\n  width: 982px !important;\n  background-color: var(--very-light-background) !important;\n}\n#tb_rich_poster_container {\n  border-radius: 0 0 24px 24px;\n  margin-left: -1px;\n}\n\n.tb_rich_poster .poster_body .editor_textfield {\n  border-color: var(--border-color) !important;\n  background-color: var(--default-background) !important;\n  color: var(--default-fore) !important;\n}\n\n.tb_rich_poster .poster_body .editor_textfield {\n  border-radius: 8px;\n  /* 标题文本框 */\n}\n\n.tb_rich_poster .poster_body .editor_textfield:focus {\n  border-color: var(--tieba-theme-color) !important;\n}\n\n.old_style_wrapper {\n  border-color: var(--border-color) !important;\n  background-color: var(--elem-color) !important;\n}\n\n.old_style_wrapper {\n  /* 编辑器容器 */\n}\n\n.old_style_wrapper .edui-editor-body {\n  background: none !important;\n}\n\n.edui-container .edui-toolbar {\n  background: none !important;\n}\n\n.edui-container .edui-toolbar {\n  /* 编辑器工具栏 */\n}\n\n.edui-editor-body .edui-body-container {\n  border-color: var(--border-color) !important;\n  background-color: var(--default-background) !important;\n}\n\n.edui-editor-body .edui-body-container {\n  /* 编辑器 */\n}\n\n.frs_content_footer_pagelet {\n  background: none !important;\n}\n\n.footer {\n  display: none !important;\n}\n\n.icon_author {\n  background-image: none !important;\n}\n\n.icon_author {\n  /* 用户图标 */\n}\n\n.icon_author::after {\n  content: "person";\n  font-style: normal;\n}\n\n.icon_replyer {\n  background-image: none !important;\n}\n\n.icon_replyer {\n  /* 回贴图标 */\n}\n\n.icon_replyer::after {\n  content: "comment";\n  font-style: normal;\n}';
    const tiebaHomeStyle = '@charset "UTF-8";\nbody {\n  background-color: var(--page-background);\n  color: var(--default-fore);\n}\n\n/* 导航栏 */\n.head_inner {\n  /* 导航栏额头 */\n  background-color: var(--default-background);\n}\n\n.u_menu_item a {\n  /* 顶部超链接 */\n  color: var(--default-fore);\n}\n\n.head_inner .search_logo {\n  left: 72px;\n  width: 60px;\n  height: 60px;\n  /* logo */\n  background-image: var(--img-tieba-icon);\n}\n\n.search_top {\n  border: none;\n}\n\n.search_nav a:link,\n.search_nav a:hover,\n.search_nav a:visited {\n  /* 导航栏超链接 */\n  color: var(--default-fore);\n}\n\n.u_menu_item a:hover,\n.u_menu_item a:visited {\n  color: var(--default-fore);\n}\n\n/* 搜索 */\n.search_main {\n  padding-bottom: 96px;\n}\n\n.search_bright .search_inp_border {\n  /* 搜索框 */\n  border-color: var(--border-color);\n  border-bottom-left-radius: 8px;\n  border-top-left-radius: 8px;\n  color: var(--default-fore);\n}\n\n.search_bright .search_inp_border:focus {\n  border-color: var(--tieba-theme-color);\n}\n\n.search_bright .search_btn {\n  border-color: var(--trans-tieba-theme-color);\n  /* 搜索相关按钮 */\n  border-radius: 8px;\n  background-color: var(--tieba-theme-background);\n  color: var(--tieba-theme-fore);\n}\n\n.search_bright .search_btn_enter_ba {\n  /* “进入贴吧”按钮 */\n  background-color: var(--tieba-theme-color);\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n  color: var(--default-background);\n}\n\n.search_bright .search_btn:visited {\n  color: var(--tieba-theme-fore);\n}\n\n.search_bright .search_btn_enter_ba:visited {\n  background-color: var(--tieba-theme-color);\n  color: var(--default-background);\n}\n\n.search_bright .search_btn_enter_ba:hover {\n  background-color: var(--tieba-theme-color);\n  color: var(--default-background);\n}\n\n.suggestion {\n  border-color: var(--border-color) !important;\n  border-radius: 6px !important;\n  background-color: var(--elem-color) !important;\n  box-shadow: none !important;\n  color: var(--default-fore) !important;\n}\n\n.suggestion {\n  transform: translateY(4px);\n}\n\n.suggestion .break_tip {\n  background-color: var(--default-background) !important;\n}\n\n.suggestion .highlight {\n  color: var(--tieba-theme-color) !important;\n}\n\n.suggestion .highlight {\n  /* 高亮文本 */\n}\n\n.suggestion .operation_title {\n  color: var(--default-fore) !important;\n}\n\n.suggestion .operation_title {\n  /* 热议文字 */\n}\n\n.suggestion .forum_image {\n  /* 推荐图标 */\n  border-radius: 8px;\n}\n\n.suggestion .forum_name {\n  color: var(--default-fore) !important;\n}\n\n.suggestion .forum_name {\n  /* 推荐标题 */\n}\n\n.suggestion .on {\n  background-color: var(--light-background) !important;\n}\n\n.suggestion .on {\n  /* 搜索推荐：选中 */\n}\n\n/* 首页横幅 */\n.page-container .top-sec {\n  display: none;\n}\n\n/* 内容 */\n.page-container .content-sec {\n  background: none;\n}\n\n/* 左侧悬停 */\n.page-container .left-sec {\n  border-radius: 24px;\n  border-top: none;\n  background: none;\n  background-color: var(--elem-color);\n}\n\n.f-d-w {\n  border-radius: 24px;\n  /* 左侧悬停 2 */\n  background-color: var(--elem-color);\n}\n\n.f-d-w .f-d-item {\n  background: none;\n}\n\n.aggregate_entrance_wrap {\n  /* 专题 */\n  display: none;\n}\n\n.u-f-t .gap {\n  border: none;\n  /* “贴吧分类”分隔符 */\n  background: none;\n}\n\n.f-d-w .all {\n  /* “查看全部”按钮 */\n  background: none;\n}\n\n.forum_rcmd {\n  /* 热门吧卡片 */\n  border: 0;\n  border-radius: 24px;\n  background-color: var(--elem-color);\n}\n\n.region_bright .region_header {\n  /* “我在贴吧”标题 */\n  color: var(--default-fore);\n}\n\n.page-container .left-sec .region_bright {\n  border-radius: 24px;\n}\n\n.my_tieba_mod .media_left,\n.my_tieba_mod .media-left {\n  /* 头像边框 */\n  border: none;\n}\n\n.media_left img,\n.media-left img {\n  /* 头像 */\n  border-radius: 16px;\n}\n\n#nameValue {\n  /* 我的用户名 */\n  color: var(--default-fore);\n}\n\n#j_tcharge_dialog {\n  /* “获取”超链接 */\n  color: var(--default-fore);\n}\n\n#onekey_sign .onekey_btn,\n#onekey_sign a.onekey_btn {\n  /* 签到按钮 */\n  border-radius: 8px;\n  margin-right: -5px;\n  background: none;\n  background-color: var(--tieba-theme-color);\n  color: var(--elem-color);\n  text-align: center;\n}\n\n#onekey_sign .onekey_btn::after {\n  content: "一键签到";\n}\n\n#onekey_sign a.signed_btn .icon_signed {\n  /* 已签到标记 */\n  margin-top: 2px;\n  background: var(--svg-checkmark);\n  background-repeat: no-repeat;\n  background-size: 20px;\n  filter: drop-shadow(var(--elem-color) 0 9999px);\n  transform: translateY(-9999px);\n}\n\n#onekey_sign .onekey_btn:hover {\n  box-shadow: 0 0 10px var(--tieba-theme-color);\n}\n\n.u-f-w {\n  /* 进吧 div */\n  padding-bottom: 20px;\n}\n\n.left-cont-fixed {\n  /* 进吧 div 固定 */\n  position: relative;\n  bottom: 0;\n}\n\n.u-f-w .sign,\n.u-f-w .unsign,\n.always-forum-item .sign,\n.always-forum-item .unsign {\n  /* 进吧按钮 */\n  border-radius: 8px;\n  background: none;\n  background-color: var(--light-background);\n  color: var(--default-fore);\n}\n\n.u-f-w .sign,\n.always-forum-item .sign {\n  /* 已签到 */\n  background-color: var(--tieba-theme-background);\n  color: var(--tieba-theme-fore);\n}\n\n.u-f-w .sign,\n.u-f-w .unsign {\n  margin-bottom: 8px;\n}\n\n.u-f-w .sign:hover,\n.u-f-w .unsign:hover,\n.always-forum-item .sign:hover,\n.always-forum-item .unsign:hover {\n  background: none;\n  background-color: var(--tieba-theme-color);\n  box-shadow: 0 0 10px var(--tieba-theme-color);\n  color: var(--elem-color);\n  -webkit-text-decoration: none;\n  text-decoration: none;\n}\n\n.u-f-w .more {\n  /* “查看更多”按钮 */\n  border: none;\n  border-radius: 8px;\n  background: none;\n  background-color: var(--elem-color);\n  box-shadow: none;\n  color: var(--default-fore);\n}\n\n.more-txt {\n  /* “查看更多”按钮文字 */\n  color: var(--default-fore);\n}\n\n.u-f-w .more-hover {\n  width: 188px;\n  margin: auto;\n  background-color: var(--tieba-theme-color);\n  box-shadow: 0 0 10px var(--tieba-theme-color);\n  color: var(--elem-color);\n}\n\n.u-f-w .more-hover .more-txt,\n.u-f-w .more:hover .more-txt {\n  margin-left: 60px;\n  color: var(--elem-color);\n}\n\n.always-forum-title {\n  /* 展开标题 */\n  border: none;\n  margin-top: 10px;\n}\n\n#alwayforum-wraper {\n  /* 关注吧展开 */\n  background-color: var(--elem-color);\n}\n\n.pop-up-frame {\n  /* 展开页面 */\n  border: none;\n  border-radius: 24px;\n  background-color: var(--elem-color);\n  border-bottom-left-radius: 0;\n  box-shadow: none;\n}\n\n.always-forum-close {\n  /* 展开叉号 */\n  display: none;\n}\n\n.always-forum-item .addnewforumbtn {\n  /* “添加爱逛的吧”按钮 */\n  width: 110px;\n  padding-left: 0;\n  border-radius: 8px;\n  background: none;\n  background-color: var(--tieba-theme-background);\n  color: var(--tieba-theme-fore);\n  font-size: 20px;\n  text-align: center;\n}\n\n.always-forum-item .addnewforumbtn::after {\n  content: "+";\n}\n\n.always-forum-item .addnewforumbtn:hover {\n  background-color: var(--tieba-theme-color);\n  box-shadow: 0 0 10px var(--tieba-theme-color);\n  color: var(--elem-color);\n}\n\n.tbui_scroll_panel .tbui_scroll_button {\n  /* 展开滚动条 */\n  width: 6px;\n  border: none;\n  border-radius: 24px;\n  background-color: var(--very-light-background);\n}\n\n.tbui_scroll_panel .tbui_scroll_bar {\n  width: 6px;\n  /* 滚动条背景 */\n  background: none;\n}\n\n.forum_rcmd .class_title > div {\n  /* 热门吧 icon */\n  color: var(--default-fore);\n}\n\n.rcmd_forum_item .forum_name {\n  /* 热门吧标题 */\n  color: var(--default-fore);\n}\n\n.rcmd_forum_item .rcmd_forum_logo {\n  /* 热门吧图片 */\n  border: none;\n  border-radius: 16px;\n  background: none;\n}\n\n/* 动态 */\n.page-container .r-left-sec,\n.sub_nav_wrap,\n.title-tag-wraper,\n.thread-name-wraper,\n.n_reply {\n  width: 780px;\n}\n\n.n_txt {\n  /* 动态正文 */\n  width: 720px;\n  color: var(--light-fore);\n}\n\n.sub_nav_wrap {\n  /* 动态切换 */\n  background: none;\n  background-color: var(--default-background);\n  box-shadow: none;\n}\n\n.sub_nav_list a.cur {\n  /* 当前标签 */\n  border: none;\n  color: var(--tieba-theme-color);\n}\n\n.sub_nav_list .nav_hover {\n  width: 56px !important;\n}\n\n.sub_nav_list .nav_hover {\n  /* 标签色块 */\n  border-bottom: 3px solid var(--tieba-theme-color);\n}\n\n.sub_nav_list li.sub_nav_line {\n  /* 标签分隔符 */\n  background: none;\n}\n\n/* 右侧悬停 */\n.page-container .r-right-sec {\n  display: none;\n}\n\n.item_hd {\n  /* “贴吧热议榜”标题 */\n  border: none;\n  border-radius: 24px;\n  background-color: var(--default-background);\n  color: var(--default-fore);\n}\n\n.item_hd .title {\n  color: var(--default-fore);\n}\n\n.topic_list .topic_item .topic_flag_hot {\n  /* 热点数字编号 */\n  border-radius: 4px;\n}\n\n.item .item_hd {\n  /* 公告板标题 */\n  border: none;\n  background-color: var(--default-background);\n  color: var(--default-fore);\n}\n\n.item .item_hd .title {\n  color: var(--default-fore);\n}\n\n.notice-wrap-fixed {\n  /* 公告板悬停 */\n  background-color: var(--default-color);\n  border-bottom-left-radius: 24px;\n  border-bottom-right-radius: 24px;\n}\n\n.notice,\n.notice img {\n  /* 公告板图片 */\n  border-radius: 24px;\n}\n\n/* 动态内容 */\n.new_list .title {\n  /* 贴子标题 */\n  color: var(--tieba-theme-color);\n}\n\n.new_list .title:hover {\n  color: var(--tieba-theme-color);\n  -webkit-text-decoration: underline;\n  text-decoration: underline;\n}\n\n.title-tag-wraper a {\n  /* 动态贴吧名 */\n  padding: 4px 10px;\n  border-radius: 24px;\n  background-color: var(--light-background);\n  color: var(--light-fore);\n  font-size: 12px;\n}\n\n.title-tag-wraper a:hover {\n  color: var(--light-fore);\n  -webkit-text-decoration: none;\n  text-decoration: none;\n}\n\n.list-post-num {\n  /* 贴子回复数 */\n  top: 0;\n  padding: 4px 10px;\n  border: none;\n  border-radius: 16px;\n  background-color: var(--tieba-theme-background);\n  color: var(--tieba-theme-fore);\n}\n\n.list-triangle-border,\n.list-triangle-body {\n  /* 贴子回复数三角 */\n  display: none;\n}\n\n.new_list .post_author {\n  /* 作者 */\n  padding: 0;\n  margin-bottom: 24px;\n  background: none;\n  color: var(--default-fore);\n  -webkit-text-decoration: none;\n  text-decoration: none;\n}\n\n.new_list .time {\n  /* 时间 */\n  padding: 0;\n  background: none;\n}\n\n.topic-tag {\n  /* 动态话题 */\n  display: none;\n}\n\n.n_img img {\n  /* 动态图片 */\n  border: none;\n  border-radius: 16px;\n  cursor: pointer;\n}\n\n.n_img li {\n  border-radius: 16px;\n}\n\n.n_img li .feed_highlight {\n  /* 图片放大 */\n  background: none;\n  cursor: pointer;\n}\n\n.media_box {\n  /* 图片控件 */\n  border: none;\n  border-radius: 16px;\n  background-color: var(--light-background);\n}\n\n.media_box img {\n  border-radius: 16px;\n  cursor: pointer;\n}\n\n.ui_btn {\n  /* “进入贴子”按钮 */\n  border: none;\n  border-radius: 24px;\n  background: none;\n  background-color: var(--tieba-theme-color);\n  color: var(--default-background);\n}\n\n.ui_btn:hover {\n  -webkit-text-decoration: none !important;\n  text-decoration: none !important;\n}\n\n.ui_btn:hover {\n  background: none;\n  background-color: var(--tieba-theme-color);\n  box-shadow: 0 0 10px var(--tieba-theme-color);\n  color: var(--default-background);\n}\n\n.btn_more {\n  /* 更多按钮 */\n  width: 200px;\n  height: auto;\n  height: initial;\n  border-radius: 24px;\n  background: none;\n  background-color: var(--tieba-theme-background);\n}\n\n.btn_more:hover,\n.data_error_bar a:hover,\n.btn_more a:hover {\n  background: none !important;\n  background-color: var(--tieba-theme-color) !important;\n  color: var(--default-background) !important;\n}\n\n.data_error_bar a,\n.btn_more a {\n  border: none;\n  color: var(--tieba-theme-fore);\n}\n\n/* 页脚 */\n.bottom-bg {\n  background: none;\n}\n\n.footer {\n  border-top: 1px solid var(--light-background);\n  background-color: var(--light-background);\n}\n\n/* 无关内容 */\n.f-d-w,\n.left-cont-wraper .ufw-gap {\n  display: none;\n}\n\n/* 底部加载 gif */\n#data_loading img {\n  display: none;\n}';
    const tiebaMainStyle = '@charset "UTF-8";\n.tbui_aside_float_bar li a {\n  font-family: "Material Symbols", monospace !important;\n}\n.tbui_aside_float_bar li a {\n  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 40;\n  font-weight: normal;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n\n/* 动画 */\n/* 淡入动画 */\n@keyframes animation-fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n.fade-in-elem {\n  animation: animation-fade-in ease 0.3s forwards;\n}\n\n#com_userbar {\n  display: none;\n}\n\n/* 功能按钮 */\n.tbui_aside_float_bar {\n  border: none !important;\n  background: none !important;\n}\n\n.tbui_aside_float_bar li {\n  width: 40px;\n  height: 40px;\n  border-radius: 24px;\n  margin: 8px 0;\n  background-color: var(--light-background);\n}\n\n.tbui_aside_float_bar li:hover {\n  background-color: var(--default-hover);\n}\n\n.tbui_aside_float_bar li:active {\n  background-color: var(--default-active);\n}\n\n.tbui_aside_float_bar li a {\n  width: 40px !important;\n  height: 40px !important;\n  background: none !important;\n}\n\n.tbui_aside_float_bar li a {\n  border-radius: 24px;\n}\n\n.tbui_aside_float_bar a {\n  width: 40px !important;\n  height: 40px !important;\n}\n\n.tbui_aside_float_bar a {\n  /* 功能按钮 svg 容器 */\n  color: var(--minimal-fore);\n  font-size: 24px;\n  line-height: 40px;\n  text-align: center;\n  /* background-size: 20px;\n  background-repeat: no-repeat;\n  background-position: center;\n  filter: drop-shadow(var(--minimal-fore) 0 -9999px);\n  transform: translateY(9999px); */\n}\n\n/* .tbui_aside_float_bar a:hover {\n    color: var(--default-background);\n    filter: drop-shadow(var(--default-fore) 0 -9999px);\n} */\n.tbui_aside_float_bar .tbui_fbar_auxiliaryCare a {\n  height: 40px !important;\n  background: none !important;\n}\n.tbui_aside_float_bar .tbui_fbar_auxiliaryCare a {\n  /* 无障碍模式 */\n}\n\n.tbui_fbar_auxiliaryCare a::after {\n  content: "accessibility_new";\n  /* background-image: var(--svg-accessibility); */\n}\n\n.tbui_fbar_top a::after {\n  /* 回到顶部 */\n  /* color: var(--tieba-theme-fore); */\n  content: "arrow_upward";\n  /* background-image: var(--svg-arrow-up);\n  filter: drop-shadow(var(--tieba-theme-fore) 0 -9999px); */\n}\n\n/* .tbui_aside_float_bar .tbui_fbar_top a {\n    background-color: var(--tieba-theme-background) !important;\n} */\n/* .tbui_fbar_top a:hover::after {\n    color: var(--default-background);\n} */\n.tbui_fbar_post a::after {\n  /* 回贴 */\n  /* color: var(--default-background); */\n  content: "chat";\n  font-size: 22px;\n  /* vertical-align: bottom; */\n  /* background-image: var(--svg-message);\n  filter: drop-shadow(var(--default-background) 0 -9999px); */\n}\n\n/* .tbui_aside_float_bar .tbui_fbar_post a,\n.tbui_aside_float_bar .tbui_fbar_post a:hover {\n    background-color: var(--tieba-theme-color) !important;\n} */\n.tbui_fbar_feedback a::after {\n  /* 反馈 */\n  content: "report";\n  font-size: 26px;\n  /* background-image: var(--svg-infomation-outline);\n  background-size: 24px; */\n}\n\n.tbui_aside_float_bar li.tbui_fbar_feedback a {\n  background: none !important;\n}\n\n.tbui_aside_float_bar li.tbui_fbar_feedback a {\n  /* 部分吧反馈 */\n}\n\n.tbui_aside_float_bar .tbui_fbar_feedback a,\n.tbui_aside_float_bar .tbui_fbar_feedback a:hover {\n  background: none !important;\n}\n\n.tbui_aside_float_bar .tbui_fbar_down,\n.tbui_aside_float_bar .tbui_fbar_props,\n.tbui_aside_float_bar .tbui_fbar_tsukkomi,\n.tbui_aside_float_bar .tbui_fbar_share,\n.tbui_aside_float_bar .tbui_fbar_favor,\n.tbui_aside_float_bar .tbui_fbar_refresh {\n  display: none;\n}\n\n/* 图片缩放控件 */\n.p_tools a {\n  padding: 0 10px;\n  background: none;\n  vertical-align: bottom;\n}\n\n.p_tools span {\n  /* 分隔线 */\n  display: none;\n}\n\n.p_tools .p_putup::before,\n.p_tools .tb_icon_ypic::before,\n.p_tools .tb_icon_turnleft::before,\n.p_tools .tb_icon_turnright::before {\n  margin-right: 4px;\n  font-family: "Material Symbols", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;\n  font-size: 14px;\n  vertical-align: bottom;\n}\n\n.p_tools .p_putup::before {\n  /* 收起 */\n  content: "zoom_out";\n}\n\n.p_tools .tb_icon_ypic::before {\n  /* 查看大图 */\n  content: "zoom_out_map";\n}\n\n.p_tools .tb_icon_turnleft::before {\n  /* 左转 */\n  content: "turn_left";\n}\n\n.p_tools .tb_icon_turnright::before {\n  /* 右转 */\n  content: "turn_right";\n}';
    const tiebaThreadStyle = '@charset "UTF-8";\n.d_name a:hover,\n#container .content a.at:hover {\n  -webkit-text-decoration: none;\n  text-decoration: none;\n}\n\n.l_reply_num {\n  color: inherit !important;\n}\n\n.l_reply_num {\n  /* 回帖信息 */\n}\n\n#j_navtab_game,\n.nav_list .more-config-navtab {\n  /* 游戏 tab */\n  display: none;\n}\n\n#j_navtab_wanle {\n  /* 玩乐 tab */\n  display: none;\n}\n\n.nav_wrap_add_border {\n  border: none;\n}\n\n#head {\n  /* 背景 */\n  background: none;\n  background-color: transparent;\n}\n\n/* 内容 */\n#container .content {\n  border-radius: 24px;\n  background: transparent none repeat 0 0 / auto auto padding-box border-box scroll;\n  background: initial;\n}\n\n.card_top_wrap {\n  background: none !important;\n  background-color: var(--elem-color) !important;\n}\n\n.card_top_wrap {\n  border-radius: 24px 24px 0 0;\n}\n\n.card_top_theme2 {\n  border: none;\n  margin-right: 0;\n}\n\n/* 去除无关内容 */\n#novel-ranking .novel-ranking-frs-body,\n.novel-award-aside {\n  /* 小说人气榜相关 */\n  display: none;\n}\n\n/* 吧图标 */\n.card_head,\n.plat_head_theme2 .plat_picbox {\n  top: -32px !important;\n  width: 64px !important;\n  height: 64px !important;\n  padding: 0 !important;\n  padding: initial !important;\n  border: 4px solid var(--border-color) !important;\n  border-radius: 24px !important;\n  background: none !important;\n}\n.card_head,\n.plat_head_theme2 .plat_picbox {\n  overflow: hidden;\n}\n\n.card_head_img,\n.plat_head_theme2 .plat_picbox img {\n  width: 64px !important;\n  height: 64px !important;\n}\n\n/* 吧名 */\n.card_title,\n.plat_title_h3 {\n  margin: 5px 20px 0;\n}\n\n.card_top_theme2 .card_title_fname,\n.plat_title_h3,\n.plat_title_h3:hover,\n.plat_title_h3:visited {\n  color: var(--highlight-fore);\n}\n\n.islike_focus {\n  margin-top: 4px !important;\n}\n\n.islike_focus {\n  /* 关注吧按钮 */\n  border-radius: 24px;\n  background: none;\n  background-color: var(--tieba-theme-color);\n  color: var(--elem-color);\n  font-size: 14px;\n  line-height: 28px;\n  text-align: center;\n}\n\n.islike_focus::after {\n  content: "关注";\n}\n\n.cancel_focus {\n  /* 取关吧按钮 */\n  width: 72px;\n  border: 2px solid var(--trans-tieba-theme-color);\n  border-radius: 24px;\n  background: none;\n  background-color: var(--tieba-theme-background);\n  color: var(--tieba-theme-fore);\n  font-size: 14px;\n  line-height: 28px;\n  text-align: center;\n}\n\n.cancel_focus::after {\n  content: "已关注";\n}\n\n.card_top_right {\n  /* 签到按钮 container */\n  margin-top: 20px;\n}\n\n.sign_box_bright {\n  width: 140px !important;\n  height: 40px !important;\n}\n\n.sign_box_bright {\n  /* 签到按钮 */\n  border: 2px solid var(--trans-tieba-theme-color);\n  border-radius: 24px;\n  background: none;\n  background-color: var(--tieba-theme-color);\n  color: var(--default-background);\n  font-size: 18px;\n  line-height: 40px;\n  text-align: center;\n}\n\n.sign_btn_bright::before {\n  color: var(--elem-color);\n  content: "签到";\n}\n\n.sign_box_bright_signed {\n  /* 签到按钮：已签到 */\n  background-color: var(--tieba-theme-background);\n  text-align: inherit;\n}\n\n.sign_today_date,\n.sign_month_lack_days {\n  /* 签到日期等 */\n  display: none;\n}\n\n.sign_keep_span {\n  width: 140px !important;\n}\n\n.sign_keep_span {\n  height: 40px;\n}\n\n.sign_keep_span,\n.sign_mod_bright .sign_keep_span {\n  /* 已签到按钮文本 */\n  margin: 0;\n  margin: initial;\n  color: var(--tieba-theme-fore);\n  font-size: 12px;\n  text-align: center;\n}\n\n.sign_box_bright_signed::before {\n  content: none !important;\n}\n\n.sign_mod_bright .sign_keep_span::before {\n  content: "已签到 | ";\n}\n\n.jump_input_bright {\n  padding: 0 10px;\n  /* 跳页文本框 */\n  border-color: var(--border-color);\n  border-radius: 16px;\n}\n\n/* 标题 */\n.left_section {\n  background: none;\n}\n\n.core_title_wrap_bright {\n  /* 标题栏 */\n  border-color: var(--border-color);\n  -webkit-backdrop-filter: blur(24px);\n          backdrop-filter: blur(24px);\n  background-color: var(--trans-default-background);\n}\n\n.core_title_theme_bright,\n.core_title_absolute_bright .core_title_theme_bright {\n  /* 部分吧标题栏 */\n  border-color: var(--border-color);\n  background: none;\n}\n\n.left_section .core_title_absolute_bright {\n  -webkit-backdrop-filter: blur(24px);\n          backdrop-filter: blur(24px);\n  background-color: var(--trans-default-background);\n}\n\n.core_title_txt {\n  /* 标题文字 */\n  margin-left: 24px;\n  background: none;\n}\n\n.tittle_fill_dom.filled {\n  background-color: var(--default-background);\n}\n\n.core_title h1 {\n  /* 部分吧标题 */\n  margin-left: 0;\n  color: var(--highlight-fore);\n}\n\n.nav_wrap {\n  background-image: none !important;\n}\n\n.nav_wrap {\n  border-color: var(--border-color);\n  background-color: var(--light-background);\n  /* 导航 */\n}\n\n.nav_list a.nav_icon,\n.nav_list .tbnav_arrow {\n  /* 部分吧导航栏 */\n  padding-left: 22px;\n  background: transparent none repeat 0 0 / auto auto padding-box border-box scroll;\n  background: initial;\n}\n\n.nav_wrap,\n.nav_list .space,\n.nav_list .focus,\n.nav_list li:hover,\n.nav_list li:hover .tbnav_tab_inner,\n.nav_list .focus .tbnav_tab_inner {\n  background: transparent none repeat 0 0 / auto auto padding-box border-box scroll;\n  background: initial;\n}\n\n.nav_list a {\n  color: var(--default-fore);\n}\n\nspan.tP {\n  /* 强调字 */\n  color: var(--tieba-theme-fore);\n}\n\n.thread_theme_5 {\n  /* 跳页 */\n  width: auto;\n  width: initial;\n  border-color: var(--border-color);\n  border-right: none;\n  border-left: none;\n  background-color: var(--light-background);\n}\n\n.btn_sub,\n.btn-sub,\n.btn-sub-b,\n.core_title_btns li a,\n.p_favthr_main {\n  border: none;\n  border-radius: 8px;\n  /* 部分按钮 */\n  background: none;\n  background-color: var(--tieba-theme-background);\n  color: var(--tieba-theme-fore);\n}\n\n.btn_sub:hover,\n.btn-sub:hover,\n.btn-sub-b:hover,\n.btn_sub:active,\n.btn-sub:active,\n.btn-sub-b:active,\n.btn_sub:focus,\n.btn-sub:focus,\n.btn-sub-b:focus {\n  background-color: var(--tieba-theme-color);\n  color: var(--default-background);\n}\n\n.l_lzonly:hover,\n.p_favthr_main:hover {\n  background-color: var(--tieba-theme-color) !important;\n  color: var(--default-background) !important;\n}\n\n.l_lzonly:hover,\n.p_favthr_main:hover {\n  /* 部分吧按钮 hover */\n}\n\n#quick_reply {\n  /* 回复按钮 */\n  display: none;\n}\n\n.d_lzonly_bdaside,\n.p_favthr_main p,\n.j_quick_reply,\n.j_lzl_p a {\n  /* 部分吧按钮字体 */\n  color: inherit;\n}\n\n.j_quick_reply {\n  /* 部分吧额头 */\n  padding-left: 0;\n  padding-left: initial;\n}\n\n/* 左侧用户信息 */\n.l_post_bright {\n  width: auto !important;\n  width: initial !important;\n  border-color: var(--border-color) !important;\n  background: none !important;\n}\n\n.p_author_face {\n  border: none !important;\n  background: none !important;\n}\n\n.icon_relative img {\n  /* 层主头像 */\n  border-radius: 16px;\n}\n\n.d_name .p_author_name {\n  /* 层主名 */\n  color: var(--tieba-theme-fore);\n}\n\n.novel-level-icon {\n  /* 小说等级图标 */\n  display: none;\n}\n\n.d_badge_bright,\n.user_level .badge {\n  /* 等级头衔 */\n  border: 1px solid var(--border-color);\n  border-radius: 24px;\n  background-color: var(--light-background);\n}\n\n.user_level .badge_name {\n  /* 等级头衔文本 */\n  color: inherit;\n}\n\n.d_badge_bright .d_badge_title {\n  padding-left: 4px;\n  color: var(--default-fore);\n}\n\n.d_badge_bright .d_badge_lv,\n.user_level .badge_index {\n  background-image: none !important;\n}\n\n.d_badge_bright .d_badge_lv,\n.user_level .badge_index {\n  /* 等级图标 */\n  background-color: var(--tieba-theme-background);\n  color: var(--tieba-theme-fore);\n}\n\n.d_badge_lv,\n.user_level .badge_index {\n  top: auto !important;\n  top: initial !important;\n  left: 60px !important;\n  width: auto !important;\n  width: initial !important;\n  height: 8px !important;\n  padding: 0 4px !important;\n  margin: 12px 4px !important;\n  font-family: inherit !important;\n  line-height: 2px !important;\n}\n\n.d_badge_lv,\n.user_level .badge_index {\n  border-radius: 16px;\n  font-size: 14px;\n  font-style: italic;\n}\n\n.d_badge_icon1 .d_badge_lv,\n.tieba-lvl-green {\n  background-color: var(--level-green-background) !important;\n  color: var(--level-green-fore) !important;\n}\n\n.d_badge_icon1 .d_badge_lv,\n.tieba-lvl-green {\n  /* 绿牌 */\n}\n\n.d_badge_icon2 .d_badge_lv,\n.d_badge_icon2_1 .d_badge_lv,\n.d_badge_icon2_2 .d_badge_lv,\n.tieba-lvl-blue {\n  background-color: var(--level-blue-background) !important;\n  color: var(--level-blue-fore) !important;\n}\n\n.d_badge_icon2 .d_badge_lv,\n.d_badge_icon2_1 .d_badge_lv,\n.d_badge_icon2_2 .d_badge_lv,\n.tieba-lvl-blue {\n  /* 蓝牌 */\n}\n\n.d_badge_icon3 .d_badge_lv,\n.d_badge_icon3_1 .d_badge_lv,\n.d_badge_icon3_2 .d_badge_lv,\n.tieba-lvl-yellow {\n  background-color: var(--level-yellow-background) !important;\n  color: var(--level-yellow-fore) !important;\n}\n\n.d_badge_icon3 .d_badge_lv,\n.d_badge_icon3_1 .d_badge_lv,\n.d_badge_icon3_2 .d_badge_lv,\n.tieba-lvl-yellow {\n  /* 黄牌 */\n}\n\n.d_badge_icon4 .d_badge_lv,\n.d_badge_icon4_1 .d_badge_lv,\n.d_badge_icon4_2 .d_badge_lv,\n.tieba-lvl-orange {\n  background-color: var(--level-orange-background) !important;\n  color: var(--level-orange-fore) !important;\n}\n\n.d_badge_icon4 .d_badge_lv,\n.d_badge_icon4_1 .d_badge_lv,\n.d_badge_icon4_2 .d_badge_lv,\n.tieba-lvl-orange {\n  /* 橙牌 */\n}\n\n.d_badge_bawu1 .d_badge_lv,\n.d_badge_bawu2 .d_badge_lv {\n  text-indent: inherit !important;\n}\n\n.d_badge_bawu1 .d_badge_lv,\n.d_badge_bawu2 .d_badge_lv {\n  /* 吧务 */\n}\n\n.d_author .d_pb_icons {\n  /* 印记 */\n  display: none;\n}\n\n.icon_book_link_icon {\n  /* 查看我的印记 */\n  display: none;\n}\n\n.region_bright {\n  /* 右侧信息 */\n  border: none;\n  margin-top: 12px;\n  background: none;\n  background-color: var(--elem-color);\n}\n\n.region_bright .region_title {\n  color: var(--default-fore) !important;\n}\n\n#celebrity {\n  display: none;\n}\n\n.balv_mod .media_left,\n.balv_mod .media-left {\n  /* 我的头像 */\n  border: none;\n}\n\n.right_section .tieba_notice {\n  /* 右侧反馈 */\n  background: none;\n}\n\n.topic_list_box {\n  /* 右侧贴吧热议榜 */\n  display: none;\n  background-color: var(--default-background);\n}\n\n.pb_content {\n  /* 容器：右侧剩余部分 */\n  border: none;\n  background: none;\n  background-color: var(--elem-color);\n}\n\n.notice-icon,\n.right_section .tieba_notice {\n  padding-left: 0 !important;\n  padding-left: initial !important;\n  background: none !important;\n}\n\n.notice-icon,\n.right_section .tieba_notice {\n  /* 右侧反馈 */\n}\n\n.tieba_notice li {\n  background: none;\n}\n\n/* 正文 */\n.p_content {\n  border: none;\n  background-color: var(--default-background);\n}\n\n.forbid-speech-banner {\n  /* 楼主屏蔽 */\n  border-top: none;\n}\n\n.BDE_Image {\n  /* 正文图片 */\n  border-radius: 24px;\n}\n\n.BDE_Image:first-child {\n  margin-top: 8px;\n}\n\n.share_btn_wrapper {\n  /* 分享控件 */\n  display: none;\n}\n\n.post-tail-wrap .icon-jubao {\n  /* 楼层举报 */\n  display: none;\n}\n\n.post-tail-wrap .icon-jubao::after {\n  content: "举报";\n}\n\n.post-tail-wrap .tail-info {\n  /* 楼层超链接 */\n  color: var(--light-fore);\n}\n\n.complaint {\n  /* 部分吧楼层举报 */\n  padding-right: 4px;\n  background: none;\n}\n\n.complaint::after {\n  content: "举报";\n}\n\n.post-tail-wrap .question-image:hover::before {\n  /* IP属地说明 */\n  border-color: var(--border-color);\n  border-radius: 8px;\n  background-color: var(--light-background);\n  color: var(--default-fore);\n}\n\n.post_bubble_top,\n.post_bubble_bottom {\n  /* 特殊气泡 */\n  display: none;\n}\n\n.post_bubble_middle {\n  background: none !important;\n}\n\n.post_bubble_middle {\n  width: auto;\n  width: initial;\n  padding: 0;\n  padding: initial;\n}\n\n.save_face_bg_2 {\n  /* 会员右上角标记 */\n  display: none;\n}\n\n.replace_div .replace_tip {\n  /* 展开图片 */\n  border-color: var(--border-color);\n  background-color: var(--elem-color);\n}\n\n.achievement_medal_section {\n  /* 成就徽章 */\n  display: none;\n}\n\n.l_post_bright .d_post_content_main .d_sign_split {\n  /* 签名档分割线 */\n  border-bottom: 1px solid var(--border-color);\n}\n\n/* 回复 */\n.d_post_content_main {\n  background-color: var(--default-background) !important;\n}\n\n.lzl_p_p {\n  /* 回复头像边框 */\n  border: none;\n}\n\n.lzl_p_p img {\n  /* 回复头像 */\n  border-radius: 8px;\n}\n\n.core_reply_wrapper {\n  border: 1px solid var(--border-color) !important;\n  border-radius: 16px !important;\n  margin-bottom: 16px !important;\n  background: none !important;\n  background-color: var(--very-light-background) !important;\n  color: var(--default-fore) !important;\n}\n\n.core_reply_wrapper {\n  /* 回复 */\n  /* border-top-right-radius: 0 !important; */\n}\n\n.core_reply_content li {\n  border-top: 0;\n  border-top: initial;\n}\n\n.lzl_content_main {\n  /* 回复文字 */\n  color: var(--default-fore);\n}\n\n.l_post_bright .core_reply_wrapper .core_reply_border_top,\n.core_reply_border_bottom,\n.l_post_bright .core_reply_wrapper .core_reply_content {\n  border: none;\n  background: none;\n}\n\n/* 收起回复 */\n.lzl_link_fold {\n  width: auto;\n  height: auto;\n  border: none;\n  background: none;\n  color: var(--minimal-fore);\n}\n\n.core_reply div.hideLzl {\n  /* 加载回复 */\n  background: none;\n  background-color: var(--very-light-background);\n}\n\n.core_reply_wrapper .loading_reply {\n  /* 加载动画 */\n  display: none;\n}\n\n.lzl_cnt .lzl_s_r {\n  /* 回复超链接 */\n  color: var(--tieba-theme-fore);\n}\n\n.j_lzl_container .lzl_li_pager_s {\n  overflow: visible;\n}\n\n.lzl_li_pager_s .lzl_more,\n.lzl_more span {\n  /* 还有x条回复 */\n  color: var(--light-fore);\n}\n\n.j_lzl_m {\n  /* 点击查看 */\n  color: var(--tieba-theme-fore);\n}\n\n.lzl_cnt .lzl_time {\n  color: var(--light-fore);\n}\n\n/* 楼中楼举报 */\n.lzl_jb_in,\n.user-jubao-button {\n  background: none;\n}\n\n.lzl_jb_in::after,\n.user-jubao-button::after {\n  content: "举报";\n}\n\n.lzl_cnt .lzl_content_main {\n  display: block;\n}\n\n/* .core_reply .hideLzl {\n    opacity: 0;\n    height: 0;\n}\n\n.core_reply div:not(.hideLzl) {\n    opacity: 1;\n    height: unset;\n} */\n/* 贴子内容超链接 */\n.d_post_content a,\n.lzl_cnt .lzl_content_main a:not(.at) {\n  margin: auto 2px;\n  color: var(--tieba-theme-fore);\n  /* text-decoration: underline 1.2px; */\n  transition: 0.4s;\n}\n\n/* .d_post_content a:hover,\n.d_post_content a:focus,\n.lzl_cnt .lzl_content_main a:not(.at):hover,\n.lzl_cnt .lzl_content_main a:not(.at):focus {\n    background-color: var(--trans-light-background);\n    text-decoration: none;\n} */\n.pager_theme_5 a,\n.pager_theme_5 span,\n.jump_btn_bright {\n  /* 跳页按钮 */\n  border-color: var(--default-background);\n  border-radius: 8px;\n  background: none;\n  background-color: var(--default-background);\n  color: var(--minimal-fore);\n}\n\n.pager_theme_5 a:hover,\n.jump_btn_bright:hover {\n  border-color: var(--tieba-theme-color);\n  background-color: var(--tieba-theme-color);\n  color: var(--default-background);\n}\n\n/* 底部 */\n.thread_theme_7 {\n  /* 顶栏 */\n  width: auto;\n  width: initial;\n  border-color: var(--border-color);\n  background-color: var(--light-background);\n}\n\n#pb-footer-header {\n  background-color: var(--default-background);\n}\n\n#tb_rich_poster_container {\n  /* 内容 */\n  width: auto;\n  width: initial;\n  border-radius: 24px;\n  background-color: var(--default-background);\n}\n\n.poster_head_text a.cur {\n  color: var(--highlight-fore) !important;\n}\n\n.edui-editor-body {\n  border-color: var(--border-color) !important;\n}\n\n.edui-editor-body {\n  /* 文本框 */\n  border-radius: 16px;\n  background: none;\n}\n\n.edui-container .edui-editor-body.body-container-focus,\n.edui-container .edui-editor-body.body-container-focus .edui-body-container {\n  border-color: var(--tieba-theme-color) !important;\n}\n\n.old_style_wrapper {\n  border-color: var(--border-color);\n  border-radius: 24px;\n  background-color: var(--elem-color);\n}\n\n.edui-editor-body .edui-body-container {\n  width: auto !important;\n  width: initial !important;\n}\n\n.edui-editor-body .edui-body-container {\n  /* 全部文本框 */\n  border-radius: 16px;\n  background: var(--default-background);\n}\n\n.edui-toolbar .edui-btn-toolbar,\n.edui-container .edui-toolbar {\n  margin-top: 4px;\n  /* 工具栏 */\n  background-color: var(--elem-color);\n}\n\n.pb_footer {\n  width: auto;\n  width: initial;\n  border: none;\n  border-color: var(--border-color);\n  background: none;\n}\n\n.save-to-quick-reply-btn {\n  /* “保存至快速回贴”按钮 */\n  border-color: var(--border-color);\n  background: none;\n  background-color: var(--light-background);\n  color: inherit;\n}\n\n.save-to-quick-reply-btn span {\n  color: var(--tieba-theme-fore);\n}\n\n.footer {\n  display: none;\n}\n\n.skin_normal .wrap2 {\n  background: none;\n  background-color: var(--page-background);\n}\n\n#lcsas-container {\n  display: none;\n}\n\n/* TODO: 隐藏用户3天 */\n.user-hide-post-down,\n.user-hide-post-up {\n  display: none !important;\n}\n.user-hide-post-down,\n.user-hide-post-up {\n  background-color: var(--light-fore);\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: 16px;\n  opacity: 0;\n}\n\n/* 选择搜索 */\n#selectsearch-icon {\n  display: none;\n}\n\n/* TODO: 用户卡片 */\n.ui_card_wrap {\n  background: none;\n}\n\n.ui_card_content {\n  border-color: var(--border-color);\n  border-radius: 16px;\n  background: none;\n  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);\n}\n\n.card_userinfo_wrap {\n  background: none;\n  background-color: var(--default-background);\n}\n\n.card_userinfo_left .userinfo_head {\n  /* 头像边框 */\n  background: none;\n}\n\n.j_avatar img {\n  width: 92px;\n  height: 92px;\n  border: 4px solid var(--border-color);\n  border-radius: 24px;\n  -webkit-backdrop-filter: blur(24px);\n          backdrop-filter: blur(24px);\n}\n\n.card_userinfo_middle .userinfo_sex {\n  background: none;\n}\n\n.userinfo_sex_male::after {\n  content: "♂";\n}\n\n.userinfo_sex_female::after {\n  content: "♀";\n}\n\n.ui_card_wrap .ui_white_down,\n.ui_card_wrap .ui_white_up {\n  /* 三角 */\n  display: none;\n}\n\n.card_userinfo_guide {\n  /* 右上角 */\n  display: none;\n}\n\n.user_card_loading {\n  /* 加载 */\n  background-color: var(--default-background);\n}\n\n.user_card_loading img {\n  display: none;\n}\n\n/* TODO: 第三方内容吧适配 */\n/* 由第三方提供的吧 */\n/* 进吧导航 */\n.plat_head_theme2,\n.plat_header {\n  border: none;\n  background-color: transparent;\n  background-color: initial;\n}\n\n.ylh-ad-wrap {\n  display: none;\n}';
    function parseMultiCSS(cssObject) {
      return _2.flatMapDeep(cssObject, (value, key) => {
        return [
          `${key} {`,
          ..._2.flatMapDeep(value, (v, k) => `${_2.startsWith(k, "--") ? k : _2.kebabCase(k)}: ${v};`),
          "}",
          ""
        ];
      }).join("\n");
    }
    function parseCSSRule(cssRule) {
      let css = "";
      _2.forOwn(cssRule, (value, key) => {
        css += `${_2.kebabCase(key)}:${value};`;
      });
      return css;
    }
    function injectCSSRule(selector, cssRule) {
      return _GM_addStyle(`${selector}{${parseCSSRule(cssRule)}}`);
    }
    function insertCSS(style) {
      return _GM_addStyle(style);
    }
    function overwriteCSS(...style) {
      const styles = [];
      _2.forEach(style, (styleElement) => {
        styles.push(insertCSS(styleElement));
      });
      waitUntil(() => !_2.isNil(document.body)).then(() => {
        _2.forEach(styles, (styleElement) => {
          document.head.appendChild(styleElement);
        });
      });
      return styles;
    }
    function _isSlot(s) {
      return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
    }
    function renderComponent(root, container, rootProps) {
      const app = vue.createApp(root, rootProps);
      return {
        app,
        instance: app.mount(container)
      };
    }
    const scrollbarWidth = _2.once(function() {
      return window.innerWidth - document.documentElement.clientWidth;
    });
    function renderPage(root, rootProps) {
      if (document.getElementsByTagName("body").length === 0) {
        document.documentElement.appendChild(domrd("body"));
      }
      removeDefault();
      const page = domrd("div", {
        id: "remixed-page"
      });
      document.body.insertBefore(page, document.body.firstChild);
      document.body.appendChild(domrd("div", {
        "id": "carousel_wrap"
      }));
      injectCSSRule("#spage-tbshare-container, .tbui_aside_float_bar", {
        display: "none !important"
      });
      return renderComponent(root, page, rootProps);
    }
    function renderDialog(content, opts, events) {
      var _a, _b;
      (_a = events == null ? undefined : events.beforeRender) == null ? undefined : _a.call(events);
      const dialogWrapper = document.body.appendChild(domrd("div", {
        class: "dialog-wrapper"
      }));
      const dialogApp = vue.createApp(content, {
        ...opts,
        onUnload(payload) {
          var _a2, _b2;
          (_a2 = events == null ? undefined : events.beforeUnload) == null ? undefined : _a2.call(events, rendered);
          _unload();
          (_b2 = events == null ? undefined : events.unloaded) == null ? undefined : _b2.call(events, payload);
        },
        onAbnormalUnload(abnormal) {
          var _a2;
          _unload();
          (_a2 = events == null ? undefined : events.abnormalUnload) == null ? undefined : _a2.call(events, abnormal);
        }
      });
      const rendered = {
        app: dialogApp,
        instance: dialogApp.mount(dialogWrapper)
      };
      (_b = events == null ? undefined : events.rendered) == null ? undefined : _b.call(events, rendered);
      return rendered;
      function _unload() {
        dialogApp.unmount();
        if (dom("[aria-modal]", []).length === 0) {
          document.body.removeAttribute("no-scrollbar");
          document.body.style.paddingRight = "";
        }
        dialogWrapper.remove();
      }
    }
    function userDialog(content, dialogOpts, opts) {
      let _slot;
      return renderDialog(vue.createVNode(userView.UserDialog, dialogOpts, _isSlot(_slot = vue.h(content, opts)) ? _slot : {
        default: () => [_slot]
      }));
    }
    function removeDefault() {
      _2.forEach(document.head.children, (el) => {
        if (el && el.tagName.toUpperCase() === "LINK" && _2.includes(el.getAttribute("href"), "static-common/style")) {
          el.remove();
        }
        if (el && el.tagName.toUpperCase() === "SCRIPT" && _2.includes(el.getAttribute("src"), "static-common/lib")) {
          el.remove();
        }
      });
      _2.forEach(document.body.children, (el) => {
        if (el && el.tagName.toUpperCase() === "STYLE") {
          el.remove();
        }
        if (el && el.tagName.toUpperCase() === "SCRIPT") {
          el.remove();
        }
        if (el && el.tagName.toUpperCase() === "IFRAME") {
          el.remove();
        }
        if (el && _2.includes(el.className, "translatorExtension")) {
          el.remove();
        }
        if (el && _2.includes(el.className, "dialogJ")) {
          el.remove();
        }
      });
    }
    function hexToRGBA(hex) {
      const hexValue = _2.startsWith(hex, "#") ? _2.trimStart(hex, "#") : hex;
      const tokenConverter = hexValue.length <= 4 ? (chunk) => parseInt(_2.repeat(chunk[0], 2), 16) : (chunk) => parseInt(_2.join(chunk, ""), 16);
      const chunkSize = hexValue.length <= 4 ? 1 : 2;
      const chunks = _2.chunk(hexValue, chunkSize);
      return {
        r: tokenConverter(chunks[0]),
        g: tokenConverter(chunks[1]),
        b: tokenConverter(chunks[2]),
        a: chunks.length === 4 ? tokenConverter(chunks[3]) : 1
      };
    }
    function rgbaToHSLA(rgba) {
      const normalizedR = rgba.r / 255;
      const normalizedG = rgba.g / 255;
      const normalizedB = rgba.b / 255;
      const minValue = Math.min(normalizedR, normalizedG, normalizedB);
      const maxValue = Math.max(normalizedR, normalizedG, normalizedB);
      const lightness = (maxValue + minValue) / 2;
      let saturation;
      if (lightness <= 0.5) {
        saturation = (maxValue - minValue) / (maxValue + minValue);
      } else {
        saturation = (maxValue - minValue) / (2 - maxValue - minValue);
      }
      let hue;
      if (maxValue === minValue) {
        hue = 0;
      } else if (maxValue === normalizedR) {
        hue = (normalizedG - normalizedB) / (maxValue - minValue);
      } else if (maxValue === normalizedG) {
        hue = 2 + (normalizedB - normalizedR) / (maxValue - minValue);
      } else {
        hue = 4 + (normalizedR - normalizedG) / (maxValue - minValue);
      }
      hue *= 60;
      if (hue < 0) {
        hue += 360;
      }
      return {
        h: _2.round(hue, 2),
        s: `${_2.round(saturation * 100)}%`,
        l: `${_2.round(lightness * 100)}%`,
        a: rgba.a
      };
    }
    const darkPrefers = matchMedia("(prefers-color-scheme: dark)");
    async function loadDynamicCSS() {
      const theme = themeColor.get();
      const darkRGBA = hexToRGBA(theme.dark);
      const lightRGBA = hexToRGBA(theme.light);
      const darkHSLA = rgbaToHSLA(darkRGBA);
      const lightHSLA = rgbaToHSLA(lightRGBA);
      const dynCSS = parseMultiCSS({
        ":root": {
          "--content-max": wideScreen.get().noLimit ? "100vw" : `${wideScreen.get().maxWidth}px`,
          "--code-zh": `${_2.join(userFonts.get(), ",")}`,
          "--code-monospace": `${_2.join(monospaceFonts.get(), ",")}`,
          "--font-weight-normal": `${fontWeights.get().normal}`,
          "--font-weight-bold": `${fontWeights.get().bold}`
        },
        "html.dark-theme": {
          "--tieba-theme-color": theme.dark,
          "--trans-tieba-theme-color": `rgb(${darkRGBA.r} ${darkRGBA.g} ${darkRGBA.b} / 80%)`,
          "--tieba-theme-hover": `hsl(${darkHSLA.h}deg ${parseInt(darkHSLA.s) + 40}% ${parseInt(darkHSLA.l) + 10}%)`,
          "--tieba-theme-active": `hsl(${darkHSLA.h}deg ${parseInt(darkHSLA.s) + 50}% ${parseInt(darkHSLA.l) + 20}%)`,
          "--tieba-theme-background": `rgb(${darkRGBA.r} ${darkRGBA.g} ${darkRGBA.b} / 24%)`,
          "--tieba-theme-fore": `hsl(${darkHSLA.h}deg 100% 75%)`
        },
        "html.light-theme": {
          "--tieba-theme-color": theme.light,
          "--trans-tieba-theme-color": `rgb(${lightRGBA.r} ${lightRGBA.g} ${lightRGBA.b} / 80%)`,
          "--tieba-theme-hover": `hsl(${lightHSLA.h}deg ${parseInt(lightHSLA.s) - 40}% ${parseInt(lightHSLA.l) - 10}%)`,
          "--tieba-theme-active": `hsl(${lightHSLA.h}deg ${parseInt(lightHSLA.s) - 50}% ${parseInt(lightHSLA.l) - 20}%)`,
          "--tieba-theme-background": `rgb(${lightRGBA.r} ${lightRGBA.g} ${lightRGBA.b} / 24%)`,
          "--tieba-theme-fore": `hsl(${lightHSLA.h}deg 60% 32%)`
        }
      });
      _GM_addStyle(dynCSS);
      window.addEventListener("load", function() {
        _GM_addStyle(
          parseMultiCSS({
            ":root": {
              "--scrollbar-width": `${scrollbarWidth()}px`
            }
          })
        );
      }, { once: true });
      const customCSS = customStyle.get();
      if (customCSS !== "") _GM_addStyle(customCSS);
    }
    async function loadMainCSS() {
      overwriteCSS(
        baseStyle,
        universalStyle,
        tiebaErrorStyle,
        tiebaForumStyle,
        tiebaHomeStyle,
        tiebaMainStyle,
        tiebaThreadStyle
      );
      document.addEventListener("DOMContentLoaded", function() {
        document.head.appendChild(domrd("link", {
          type: "image/icon",
          rel: "shortcut icon",
          href: getResource("/assets/images/main/favicon32.ico")
        }));
      }, { once: true });
    }
    let customBackgroundElement = undefined;
    async function setCustomBackground() {
      if (customBackgroundElement) {
        document.head.removeChild(customBackgroundElement);
      }
      customBackgroundElement = injectCSSRule("body.custom-background", {
        backgroundImage: `url('${customBackground.get()}') !important`,
        backgroundRepeat: "no-repeat !important",
        backgroundAttachment: "fixed !important",
        backgroundSize: "cover !important"
      });
      waitUntil(() => !_2.isNil(document.body)).then(function() {
        if (customBackground.get()) {
          document.body.classList.add("custom-background");
        } else {
          document.body.classList.remove("custom-background");
        }
      });
    }
    const MainTitle = "Tieba Remix";
    const Owner = "HacksawBlade";
    const RepoName = "Tieba-Remix";
    const GithubRepo = `https://github.com/${Owner}/${RepoName}`;
    const GiteeRepo = `https://gitee.com/${Owner}/${RepoName}`;
    const BaiduPassport = "https://passport.baidu.com/";
    const REMIXED = "\n██████╗ ███████╗███╗   ███╗██╗██╗  ██╗███████╗██████╗ \n██╔══██╗██╔════╝████╗ ████║██║╚██╗██╔╝██╔════╝██╔══██╗\n██████╔╝█████╗  ██╔████╔██║██║ ╚███╔╝ █████╗  ██║  ██║\n██╔══██╗██╔══╝  ██║╚██╔╝██║██║ ██╔██╗ ██╔══╝  ██║  ██║\n██║  ██║███████╗██║ ╚═╝ ██║██║██╔╝ ██╗███████╗██████╔╝\n╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚═════╝ \n";
    class UserKey {
      constructor(key, defaultValue, listeners, migration) {
        __publicField(this, "key");
        __publicField(this, "defaultValue");
        __publicField(this, "listeners");
        __publicField(this, "migration");
        this.key = key;
        this.defaultValue = defaultValue;
        this.listeners = {
          getter: (listeners == null ? undefined : listeners.getter) ? [listeners.getter] : [],
          setter: (listeners == null ? undefined : listeners.setter) ? [listeners.setter] : []
        };
        this.migration = migration;
      }
      dispatchEvent(event, value) {
        _2.forEach(this.listeners[event], (listener) => listener(value));
      }
      get() {
        let value = _GM_getValue(this.key, this.defaultValue);
        if (isLiteralObject(value) && _2.keys(value).length < _2.keys(this.defaultValue).length) {
          value = _2.merge(this.defaultValue, value);
        }
        if (this.migration) {
          value = this.migration(value);
          _GM_setValue(this.key, value);
        }
        this.dispatchEvent("getter", value);
        return value;
      }
      set(value) {
        _GM_setValue(this.key, value);
        this.dispatchEvent("setter", value);
      }
      remove() {
        _GM_deleteValue(this.key);
      }
      merge(value) {
        if (isLiteralObject(value)) {
          const merged = { ...this.get(), ...value };
          this.set(merged);
          this.dispatchEvent("setter", merged);
        }
      }
      mergeDeeply(value) {
        if (isLiteralObject(value)) {
          const merged = _2.merge(this.get(), value);
          this.set(merged);
          this.dispatchEvent("setter", merged);
        }
      }
    }
    class UserKeyTS extends UserKey {
      constructor(key, defaultValue, invalidfn, listeners, migration) {
        super(key, defaultValue, listeners, migration);
        __publicField(this, "defaultInvalid", () => spawnOffsetTS(0, 0, 0, 12));
        this.defaultInvalid = invalidfn ? invalidfn : this.defaultInvalid;
      }
      get() {
        let value = getUserValueTS(this.key, this.defaultValue);
        if (isLiteralObject(value) && _2.keys(value).length < _2.keys(this.defaultValue).length) {
          value = _2.merge(this.defaultValue, value);
        }
        if (this.migration) value = this.migration(value);
        this.dispatchEvent("getter", value);
        return value;
      }
      /**
       * 设置时间敏感的用户 key
       * @param value 需要设置的值
       * @param invalidTime 失效时间，默认为函数执行 12 小时后
       */
      set(value, invalidTime) {
        setUserValueTS(this.key, value, invalidTime ? invalidTime : this.defaultInvalid());
        this.dispatchEvent("setter", value);
      }
      merge(value, invalidTime) {
        if (isLiteralObject(value)) {
          const merged = { ...this.get(), ...value };
          this.set(merged, invalidTime ? invalidTime : this.defaultInvalid());
          this.dispatchEvent("setter", merged);
        }
      }
      mergeDeeply(value, invalidTime) {
        if (isLiteralObject(value)) {
          const merged = _2.merge(this.get(), value);
          this.set(merged, invalidTime ? invalidTime : this.defaultInvalid());
          this.dispatchEvent("setter", merged);
        }
      }
    }
    const perfProfile = new UserKey("perfProfile", "default", {
      setter() {
        setPerfAttr();
      }
    });
    const disabledModules = new UserKey("disabledModules", []);
    const unreadFeeds = new UserKeyTS("unreadFeeds", []);
    const experimental = new UserKey("experimental", {
      moreBlurEffect: false,
      rasterEffect: false
    });
    const latestRelease = new UserKeyTS("latestRelease", undefined);
    const updateConfig = new UserKey("updateConfig", {
      time: "6h",
      notify: true
    });
    const showUpdateToday = new UserKeyTS("showUpdateToday", true, () => (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1e3);
    const ignoredTag = new UserKey("ignoredTag", "");
    const themeType = new UserKey(
      "themeType",
      "auto",
      {
        setter(value) {
          setTheme(value);
        }
      }
    );
    const compactLayout = new UserKey("compactLayout", false);
    const wideScreen = new UserKey("wideScreen", {
      maxWidth: 1080,
      noLimit: false
    });
    const themeColor = new UserKey("themeColor", {
      light: "#614ec2",
      dark: "#7161c1"
    });
    const customBackground = new UserKey(
      "customBackground",
      undefined,
      {
        setter() {
          setCustomBackground();
        }
      }
    );
    const pageExtension = new UserKey("pageExtension", {
      index: true,
      thread: true
    });
    const userFonts = new UserKey("userFonts", []);
    const monospaceFonts = new UserKey("monospaceFonts", [
      "Consolas",
      "JetBrains Mono",
      "Fira Code",
      "Menlo",
      "monospace"
    ]);
    const navBarHideMode = new UserKey("navBarHideMode", "fold");
    const customStyle = new UserKey("customStyle", "");
    const fontWeights = new UserKey("fontWeights", {
      "normal": 400,
      "bold": 700
    });
    const highQualityImage = new UserKey("highQualityImage", true);
    const currentStorageBase = /* @__PURE__ */ new Map();
    const HOME_FEED_IMAGES = ["home_feed_images", {}];
    const THREAD_IMAGES = ["thread_images", []];
    const currentStorage = {
      get(entry) {
        return currentStorageBase.get(entry[0]);
      },
      set(entry, value) {
        currentStorageBase.set(entry[0], value);
      },
      has(entry) {
        return currentStorageBase.has(entry[0]);
      },
      delete(entry) {
        currentStorageBase.delete(entry[0]);
      },
      clear() {
        currentStorageBase.clear();
      },
      entries() {
        return currentStorageBase.entries();
      },
      keys() {
        return currentStorageBase.keys();
      },
      values() {
        return currentStorageBase.values();
      },
      forEach(callback) {
        currentStorageBase.forEach(callback);
      },
      size() {
        return currentStorageBase.size;
      }
    };
    function getUserValueTS(key, def) {
      try {
        const valueTS = _GM_getValue(key, {
          value: def,
          invalidTime: 0
        });
        const timeStamp = Date.now();
        if (valueTS.invalidTime >= timeStamp) {
          return valueTS.value;
        } else {
          return def;
        }
      } catch (error) {
        return def;
      }
    }
    function setUserValueTS(key, value, invalidTime) {
      try {
        if (invalidTime) {
          _GM_setValue(key, {
            value,
            invalidTime
          });
        } else {
          _GM_setValue(key, value);
        }
      } catch (error) {
        console.warn("setUserValueTS", error);
      }
    }
    marked2.marked.setOptions({});
    function currentPageType() {
      if (location.hostname.toLowerCase() !== "tieba.baidu.com") return "unhandled";
      const pathname = location.pathname.toLocaleLowerCase();
      if (_2.includes(["/", "/index.html"], pathname)) return "index";
      if (/\/p\/\d+/.test(pathname)) return "thread";
      if (pathname === "/f") return "forum";
      if (pathname === "/home/main") return "user";
      return "unhandled";
    }
    async function getLatestReleaseFromGitee(forceUpdate = false) {
      if (latestRelease.get() && !forceUpdate) {
        return latestRelease.get();
      } else {
        const TTL = function() {
          switch (updateConfig.get().time) {
            case "1h":
              return 1;
            case "3h":
              return 3;
            case "6h":
              return 6;
            case "never":
              return -1;
          }
        }();
        if (TTL < 0) return;
        const updateUrl = `https://gitee.com/api/v5/repos/${Owner}/${RepoName}/releases/latest/`;
        const response = await fetch(updateUrl);
        if (response.ok) {
          const result = await response.json();
          if (result.message) return;
          latestRelease.set(result, spawnOffsetTS(0, 0, 0, TTL));
          return result;
        } else {
          return;
        }
      }
    }
    function checkUpdateAndNotify(showLatest = false) {
      if (updateConfig.get().time === "never") return;
      if (!updateConfig.get().notify) return;
      if (!showUpdateToday.get()) return;
      if (_GM_info.script.version === "developer-only") return;
      getLatestReleaseFromGitee().then((latestRelease2) => {
        if (latestRelease2 && latestRelease2.tag_name.slice(1) !== _GM_info.script.version) {
          if (ignoredTag.get() === latestRelease2.tag_name) return;
          userDialog(vue.createVNode("div", {
            "class": "markdown",
            "innerHTML": marked2.marked(latestRelease2.body),
            "style": parseCSSRule({
              maxWidth: "600px"
            })
          }, null), {
            title: latestRelease2.name,
            dialogButtons: [{
              text: "安装",
              event() {
                installFromRelease(latestRelease2);
                return true;
              },
              style: "themed"
            }, {
              text: "今日不再提醒",
              event() {
                showUpdateToday.set(false);
                return true;
              }
            }, {
              text: "跳过该版本",
              event() {
                ignoredTag.set(latestRelease2.tag_name);
                return true;
              }
            }]
          });
        } else {
          if (showLatest) userView.messageBox({
            title: "检查更新",
            content: "当前已是最新版本",
            type: "okCancel"
          });
        }
      });
    }
    function installFromRelease(release) {
      function notFound() {
        userView.toast({
          message: "安装失败：未找到可用的资源",
          type: "error",
          duration: 6e3,
          blurEffect: true
        });
      }
      if (!release.assets || release.assets.length <= 0) {
        notFound();
        return;
      }
      const asset = function() {
        for (const asset2 of release.assets) {
          if (asset2.name && asset2.name.endsWith(".user.js")) {
            return asset2.browser_download_url;
          }
        }
      }();
      if (asset) {
        _GM_openInTab(asset, {
          active: true
        });
      } else {
        notFound();
        return;
      }
    }
    function getResource(path) {
      return `${GiteeRepo}/raw/beta/${path}`;
    }
    function setTheme(theme) {
      switch (theme) {
        case "dark":
          darkTheme();
          break;
        case "light":
          lightTheme();
          break;
        case "auto":
        default:
          darkPrefers.matches ? darkTheme() : lightTheme();
          break;
      }
      function lightTheme() {
        document.documentElement.classList.add("light-theme");
        document.documentElement.classList.remove("dark-theme");
        document.documentElement.classList.remove("dark");
        waitUntil(() => !_2.isNil(document.body)).then(function() {
          document.body.classList.remove("dark-theme");
        });
      }
      function darkTheme() {
        document.documentElement.classList.add("dark-theme");
        document.documentElement.classList.remove("light-theme");
        document.documentElement.classList.add("dark");
        waitUntil(() => !_2.isNil(document.body)).then(function() {
          document.body.classList.add("dark-theme");
        });
      }
    }
    function backupUserConfigs() {
      const excluded = ["unreadFeeds", "latestRelease", "showUpdateToday"];
      const userKeys = _2.filter(_GM_listValues(), (key) => !_2.includes(excluded, key));
      const userValues = _2.map(userKeys, (key) => {
        return _GM_getValue(key);
      });
      const configs = _2.zipObject(userKeys, userValues);
      outputFile(`tieba-remix-backup@${(/* @__PURE__ */ new Date()).getTime()}.json`, JSON.stringify(configs));
    }
    async function restoreUserConfigs() {
      const backupData = JSON.parse(await selectLocalFile());
      _2.forEach(Object.entries(backupData), ([key, value]) => {
        _GM_setValue(key, value);
      });
    }
    const _hoisted_1$g = { class: "about-wrapper" };
    const _hoisted_2$e = { class: "main-title" };
    const _hoisted_3$c = ["src"];
    const _hoisted_4$9 = { class: "title" };
    const _hoisted_5$7 = { class: "script-info" };
    const _hoisted_6$6 = { class: "author-info" };
    const _hoisted_7$5 = { class: "version" };
    const _hoisted_8$4 = { class: "author" };
    const _hoisted_9$4 = { class: "about-desc" };
    const _hoisted_10$4 = { class: "line" };
    const _hoisted_11$4 = { class: "about-controls" };
    const _sfc_main$j = /* @__PURE__ */ vue.defineComponent({
      __name: "about.detail",
      emits: ["changeView"],
      setup(__props, { emit: __emit }) {
        const scriptInfo = _GM_info;
        const emit = __emit;
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$g, [
            vue.createElementVNode("div", _hoisted_2$e, [
              vue.createElementVNode("img", {
                src: vue.unref(getResource)("/assets/images/main/icon.png"),
                alt: "icon",
                class: "main-icon"
              }, null, 8, _hoisted_3$c),
              vue.createElementVNode("div", _hoisted_4$9, vue.toDisplayString(vue.unref(MainTitle)), 1)
            ]),
            vue.createElementVNode("div", _hoisted_5$7, [
              vue.createElementVNode("div", _hoisted_6$6, [
                vue.createElementVNode("div", _hoisted_7$5, vue.toDisplayString(vue.unref(scriptInfo).script.version), 1),
                vue.createElementVNode("div", _hoisted_8$4, "@" + vue.toDisplayString(vue.unref(scriptInfo).script.author), 1)
              ]),
              vue.createElementVNode("div", _hoisted_9$4, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(`本开源项目使用 MIT 协议`.split("\n"), (line) => {
                  return vue.openBlock(), vue.createElementBlock("div", _hoisted_10$4, vue.toDisplayString(line), 1);
                }), 256))
              ])
            ]),
            vue.createElementVNode("div", _hoisted_11$4, [
              vue.createVNode(vue.unref(userView.UserButton), {
                class: "about-button github",
                "is-anchor": true,
                href: vue.unref(GithubRepo),
                "shadow-border": true,
                target: "_balnk"
              }, {
                default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                  vue.createTextVNode("开放源代码 ")
                ])),
                _: 1
              }, 8, ["href"]),
              vue.createVNode(vue.unref(userView.UserButton), {
                class: "about-button update",
                "shadow-border": true,
                onClick: _cache[0] || (_cache[0] = ($event) => emit("changeView", "about", "update"))
              }, {
                default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                  vue.createTextVNode(" 检查更新 ")
                ])),
                _: 1
              })
            ]),
            _cache[3] || (_cache[3] = vue.createElementVNode("div", { class: "about-desc" }, null, -1))
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
    const AboutDetail = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-9147564a"]]);
    const _hoisted_1$f = {
      key: 0,
      class: "update-wrapper"
    };
    const _hoisted_2$d = { class: "icon" };
    const _hoisted_3$b = { class: "content" };
    const _hoisted_4$8 = { class: "title-container" };
    const _hoisted_5$6 = { class: "title" };
    const _hoisted_6$5 = {
      key: 0,
      class: "is-pre-release"
    };
    const _hoisted_7$4 = { class: "main-info" };
    const _hoisted_8$3 = ["src"];
    const _hoisted_9$3 = { class: "owner" };
    const _hoisted_10$3 = ["innerHTML"];
    const _hoisted_11$3 = { class: "update-controls" };
    const _hoisted_12$2 = {
      key: 1,
      class: "forbidden-wrapper"
    };
    const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
      __name: "about.update",
      setup(__props) {
        const release = vue.ref();
        const forbidden = vue.ref(false);
        const isLatest = vue.ref();
        const scriptInfo = _GM_info;
        vue.onMounted(async () => {
          const latest = await getLatestReleaseFromGitee();
          if (latest) {
            forbidden.value = false;
            release.value = latest;
            isLatest.value = `v${scriptInfo.script.version}` >= release.value.tag_name;
          } else {
            forbidden.value = true;
          }
        });
        return (_ctx, _cache) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          return !forbidden.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$f, [
            isLatest.value !== undefined ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: vue.normalizeClass(["latest-info", { "is-latest": isLatest.value }])
            }, [
              vue.createElementVNode("div", _hoisted_2$d, vue.toDisplayString(isLatest.value ? "check" : "warning"), 1),
              vue.createElementVNode("div", _hoisted_3$b, vue.toDisplayString(isLatest.value ? "当前是最新版本" : "检测到新版本"), 1)
            ], 2)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_4$8, [
              vue.createElementVNode("h2", _hoisted_5$6, vue.toDisplayString((_a = release.value) == null ? undefined : _a.name), 1),
              ((_b = release.value) == null ? undefined : _b.prerelease) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6$5, "预览版")) : vue.createCommentVNode("", true)
            ]),
            vue.createElementVNode("div", _hoisted_7$4, [
              ((_c = release.value) == null ? undefined : _c.author.avatar_url) ? (vue.openBlock(), vue.createElementBlock("img", {
                key: 0,
                src: (_d = release.value) == null ? undefined : _d.author.avatar_url,
                alt: "",
                class: "avatar"
              }, null, 8, _hoisted_8$3)) : vue.createCommentVNode("", true),
              vue.createElementVNode("div", _hoisted_9$3, vue.toDisplayString((_e = release.value) == null ? undefined : _e.author.name), 1)
            ]),
            vue.createElementVNode("div", {
              class: "release-body markdown",
              innerHTML: ((_f = release.value) == null ? undefined : _f.body) ? vue.unref(marked2.marked)((_g = release.value) == null ? undefined : _g.body) : ""
            }, null, 8, _hoisted_10$3),
            vue.createElementVNode("div", _hoisted_11$3, [
              vue.createVNode(vue.unref(userView.UserButton), {
                class: "up-button download-button",
                "shadow-border": "",
                "theme-style": "",
                "is-anchor": "",
                href: (_h = release.value) == null ? undefined : _h.assets[0].browser_download_url
              }, {
                default: vue.withCtx(() => _cache[0] || (_cache[0] = [
                  vue.createTextVNode("安装更新 ")
                ])),
                _: 1
              }, 8, ["href"])
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_12$2, _cache[1] || (_cache[1] = [
            vue.createElementVNode("div", { class: "icon" }, "warning", -1),
            vue.createElementVNode("div", { class: "forbidden-text" }, "请求过于频繁，请稍后重试", -1)
          ])));
        };
      }
    });
    const AboutUpdate = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-10bab499"]]);
    const _hoisted_1$e = { class: "layout-custom-back" };
    const _hoisted_2$c = ["src"];
    const _hoisted_3$a = { class: "custom-back-buttons" };
    const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
      __name: "layout.custom-back",
      setup(__props) {
        const imageData = vue.ref(customBackground.get());
        const alphaValue = vue.ref("100");
        const imageAlphaInput = vue.ref();
        vue.watch(imageData, (newValue) => {
          customBackground.set(newValue);
        });
        vue.watch(alphaValue, (newValue) => {
          var _a;
          const inputElement = (_a = imageAlphaInput.value) == null ? undefined : _a.$el;
          if (newValue === "" || +newValue < 0) alphaValue.value = "0", inputElement.value = "0";
          if (+newValue > 100) alphaValue.value = "100", inputElement.value = "100";
        });
        vue.onMounted(async function() {
          imageData.value = customBackground.get();
        });
        async function clearImage() {
          imageData.value = undefined;
        }
        async function selectImageFile() {
          imageData.value = await selectLocalFile("base64");
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$e, [
            vue.withDirectives(vue.createElementVNode("img", {
              class: "custom-image",
              src: imageData.value ?? "",
              title: "自定义背景",
              alt: "自定义背景",
              style: vue.normalizeStyle(`opacity: ${+alphaValue.value / 100}`)
            }, null, 12, _hoisted_2$c), [
              [vue.vShow, imageData.value]
            ]),
            vue.createElementVNode("div", _hoisted_3$a, [
              vue.createVNode(vue.unref(userView.UserButton), { onClick: clearImage }, {
                default: vue.withCtx(() => _cache[0] || (_cache[0] = [
                  vue.createTextVNode("清除")
                ])),
                _: 1
              }),
              vue.createVNode(vue.unref(userView.UserButton), { onClick: selectImageFile }, {
                default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                  vue.createTextVNode("上传图片")
                ])),
                _: 1
              })
            ])
          ]);
        };
      }
    });
    const LayoutCustomBack = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-1b12e597"]]);
    const _hoisted_1$d = { class: "color-picker" };
    const _hoisted_2$b = { key: 0 };
    const DEBOUNCE_TIME = 500;
    const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
      __name: "color-picker",
      props: /* @__PURE__ */ vue.mergeModels({
        text: { default: "" }
      }, {
        "modelValue": { required: true },
        "modelModifiers": {}
      }),
      emits: /* @__PURE__ */ vue.mergeModels(["change"], ["update:modelValue"]),
      setup(__props, { emit: __emit }) {
        const model = vue.useModel(__props, "modelValue");
        const emit = __emit;
        const debouncedUpdate = _2.debounce(() => {
          emit("change", model.value);
        }, DEBOUNCE_TIME);
        vue.onBeforeUnmount(function() {
          debouncedUpdate.cancel();
        });
        vue.watch(model, function() {
          debouncedUpdate();
        });
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("label", _hoisted_1$d, [
            vue.withDirectives(vue.createElementVNode("input", {
              class: "color-input",
              type: "color",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event)
            }, null, 512), [
              [vue.vModelText, model.value]
            ]),
            _ctx.text ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_2$b, vue.toDisplayString(_ctx.text), 1)) : vue.createCommentVNode("", true)
          ]);
        };
      }
    });
    const ColorPicker = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-faec1870"]]);
    const _hoisted_1$c = { class: "theme-color-component" };
    const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
      __name: "theme.color",
      setup(__props) {
        const lightTheme = vue.ref(themeColor.get().light);
        const darkTheme = vue.ref(themeColor.get().dark);
        function changeThemeColor() {
          themeColor.set({
            dark: darkTheme.value,
            light: lightTheme.value
          });
        }
        function resetThemeColor() {
          themeColor.remove();
          lightTheme.value = themeColor.get().light;
          darkTheme.value = themeColor.get().dark;
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$c, [
            vue.createVNode(ColorPicker, {
              text: "浅色主题",
              modelValue: lightTheme.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => lightTheme.value = $event),
              onChange: changeThemeColor
            }, null, 8, ["modelValue"]),
            vue.createVNode(ColorPicker, {
              text: "深色主题",
              modelValue: darkTheme.value,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => darkTheme.value = $event),
              onChange: changeThemeColor
            }, null, 8, ["modelValue"]),
            vue.createVNode(vue.unref(userView.UserButton), {
              class: "reset-button",
              onClick: resetThemeColor
            }, {
              default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                vue.createTextVNode("重置")
              ])),
              _: 1
            })
          ]);
        };
      }
    });
    const ThemeColor = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-aa418cd2"]]);
    const getUserSettings = _2.once(() => ({
      "visibility": {
        name: "显示",
        icon: "visibility",
        description: "主题、显示设置",
        sub: {
          "theme": {
            name: "主题",
            content: {
              "switch-theme": {
                title: "主题偏好设置",
                description: `在自动模式下，将根据当前系统设置自动选择合适的主题。你也可以手动应用某一种主题。`,
                widgets: [{
                  type: "select",
                  content: [{
                    value: "auto",
                    text: "自动",
                    desc: "根据系统设置自动切换主题。"
                  }, {
                    value: "dark",
                    text: "深色",
                    desc: "使用深色主题。"
                  }, {
                    value: "light",
                    text: "浅色",
                    desc: "使用浅色主题。"
                  }],
                  init() {
                    return themeType.get();
                  },
                  event(theme) {
                    themeType.set(theme);
                  }
                }]
              },
              "color": {
                title: "主题颜色",
                description: `自定义主题色。由于存在深浅两种主题，需要设置两种主题色。`,
                widgets: [{
                  type: "component",
                  component: vue.markRaw(ThemeColor)
                }]
              }
            }
          },
          "layout": {
            name: "页面布局",
            content: {
              "compact-layout": {
                title: "紧凑布局",
                widgets: [{
                  type: "toggle",
                  content: `在尽量保证视觉观感的请款下，针对部分页面应用更加紧凑的布局，以提高信息密度。当前会受到影响的页面有：新版看贴页面。`,
                  init() {
                    return compactLayout.get();
                  },
                  event() {
                    compactLayout.set(!compactLayout.get());
                    document.body.toggleAttribute("compact-layout");
                    return compactLayout.get();
                  }
                }]
              },
              "custom-background": {
                title: "自定义背景图",
                description: `上传图片作为页面背景图`,
                widgets: [{
                  type: "component",
                  component: vue.markRaw(LayoutCustomBack)
                }]
              },
              "wide-screen-title": {
                title: "宽屏设置",
                description: `针对宽屏设备进行配置`,
                widgets: [{
                  type: "subTitle",
                  content: "强制拉伸画幅"
                }, {
                  type: "toggle",
                  content: `对于宽屏设备，不一定需要页面内容宽度始终等于屏幕宽度。如果你想应用强制宽屏，可以开启此项。`,
                  init() {
                    return wideScreen.get().noLimit;
                  },
                  event() {
                    const value = wideScreen.get().noLimit;
                    wideScreen.merge({
                      noLimit: !value
                    });
                    return !value;
                  }
                }, {
                  type: "subTitle",
                  content: "最大宽度"
                }, {
                  type: "desc",
                  content: `配置页面元素跟随屏幕拉伸的最大宽度，若开启了 “强制拉伸画幅” 则此项失效`
                }, {
                  type: "textbox",
                  placeHolder: "输入最大宽度像素值",
                  init() {
                    return String(wideScreen.get().maxWidth);
                  },
                  event(e) {
                    const newValue = e.target.value;
                    if (!isNaN(+newValue)) {
                      wideScreen.merge({
                        maxWidth: +newValue
                      });
                    }
                  }
                }]
              }
            }
          },
          "page-extension": {
            name: "页面扩展",
            content: {
              "index": {
                title: "首页扩展",
                widgets: [{
                  type: "toggle",
                  content: `首页扩展旨在提供更纯粹的浏览体验，提供管理关注的吧、贴吧热议、瀑布流推送等功能。`,
                  init() {
                    return pageExtension.get().index;
                  },
                  event() {
                    pageExtension.merge({
                      index: !pageExtension.get().index
                    });
                    return pageExtension.get().index;
                  }
                }]
              },
              "thread": {
                title: "帖子浏览页面扩展",
                widgets: [{
                  type: "toggle",
                  content: `使用全新的 UI 简化帖子浏览，并改进屏幕空间利用率。`,
                  init() {
                    return pageExtension.get().thread;
                  },
                  event() {
                    pageExtension.merge({
                      thread: !pageExtension.get().thread
                    });
                    return pageExtension.get().thread;
                  }
                }]
              }
            }
          },
          "fonts": {
            name: "字体",
            content: {
              "code-zh": {
                title: "主要字体组合",
                description: `应用在贴吧绝大多数场景的字体组合。`,
                widgets: [{
                  type: "textarea",
                  placeHolder: "写入字体名，以换行分隔。若需要中英文混排，需将英文字体写在中文字体之前。",
                  init() {
                    return _2.join(userFonts.get(), "\n");
                  },
                  event(e) {
                    userFonts.set(_2.split(e.target.value, "\n"));
                    return _2.join(userFonts.get(), "\n");
                  }
                }]
              },
              "code-monospace": {
                title: "等宽字体组合",
                description: `应用在数据显示等场景的等宽字体组合。`,
                widgets: [{
                  type: "textarea",
                  placeHolder: "写入字体名，以换行分隔。建议在此处写入等宽字体。",
                  init() {
                    return _2.join(monospaceFonts.get(), "\n");
                  },
                  event(e) {
                    monospaceFonts.set(_2.split(e.target.value, "\n"));
                    return _2.join(monospaceFonts.get(), "\n");
                  }
                }]
              },
              "font-weights": {
                title: "字重调整",
                description: `设置字体的字重。`,
                widgets: [{
                  type: "subTitle",
                  content: "默认字重"
                }, {
                  type: "textbox",
                  placeHolder: "默认字重",
                  init() {
                    return fontWeights.get().normal;
                  },
                  event(e) {
                    const newValue = e.target.value;
                    fontWeights.merge({
                      normal: +newValue
                    });
                  }
                }, {
                  type: "subTitle",
                  content: "粗体字重"
                }, {
                  type: "textbox",
                  placeHolder: "粗体字重",
                  init() {
                    return fontWeights.get().bold;
                  },
                  event(e) {
                    const newValue = e.target.value;
                    fontWeights.merge({
                      bold: +newValue
                    });
                  }
                }]
              }
            }
          },
          "nav-bar": {
            name: "导航栏",
            content: {
              "nav-bar-mode": {
                title: "导航栏隐藏模式",
                description: `设置导航栏的隐藏模式。`,
                widgets: [{
                  type: "select",
                  content: [{
                    value: "fold",
                    text: "滚动折叠",
                    desc: "当页面以一定速度向下滚动时，会将导航栏折叠，只会占据很小的屏幕空间，但能更方便地重新访问导航栏。"
                  }, {
                    value: "alwaysFold",
                    text: "始终折叠",
                    desc: "导航栏始终保持折叠状态。"
                  }, {
                    value: "hideWhenScroll",
                    text: "滚动隐藏",
                    desc: "当页面以一定速度向下滚动时，彻底隐藏导航栏，重新访问导航栏则需要以一定速度向上滚动页面。"
                  }, {
                    value: "fixedOnTop",
                    text: "顶部固定",
                    desc: "导航栏不会在视图上跟随移动，仅在页面最顶部固定。"
                  }, {
                    value: "never",
                    text: "始终显示",
                    desc: "始终显示完整的导航栏。"
                  }],
                  init() {
                    return navBarHideMode.get();
                  },
                  event(hideMode) {
                    navBarHideMode.set(hideMode);
                  }
                }]
              }
            }
          }
        }
      },
      "modules": {
        name: "模块",
        icon: "deployed_code",
        description: "用户模块管理及部署",
        sub: AllModules().reduce((accu, curr, index2) => {
          function toSubSettingKey(module) {
            return {
              name: module.name,
              description: module.brief,
              content: {
                "module-info": {
                  title: module.name,
                  description: `${module.id} ${module.version}`,
                  widgets: [{
                    type: "toggle",
                    content: module.description,
                    init() {
                      return _2.includes(disabledModules.get(), module.id) ? false : true;
                    },
                    event() {
                      if (_2.includes(disabledModules.get(), module.id)) {
                        const newSet = new Set(disabledModules.get());
                        newSet.delete(module.id);
                        disabledModules.set([...newSet]);
                        return true;
                      } else {
                        disabledModules.set([module.id, ...disabledModules.get()]);
                        return false;
                      }
                    }
                  }]
                },
                ...module.settings
              }
            };
          }
          if (index2 === 1) {
            const accuObject = toSubSettingKey(accu);
            accu = {};
            accu[accuObject.name] = accuObject;
          }
          accu[curr.name] = toSubSettingKey(curr);
          return accu;
        })
      },
      "performance": {
        name: "性能",
        icon: "speed",
        description: "硬件性能与流量相关",
        sub: {
          "perfPresets": {
            name: "性能预设",
            content: {
              "persets": {
                title: "性能预设",
                description: "从以下预设性能等级选择其一，将会自动对相关场景进行行为调整。",
                widgets: [{
                  type: "select",
                  content: [{
                    value: "default",
                    text: "默认"
                  }, {
                    value: "saver",
                    text: "节能"
                  }, {
                    value: "performance",
                    text: "高性能"
                  }],
                  init() {
                    return perfProfile.get();
                  },
                  event(perf) {
                    perfProfile.set(perf);
                  }
                }]
              }
            }
          }
          // "network": {
          //     name: "网络",
          //     content: {
          //         "high-definition": {
          //             title: "高清图像",
          //             widgets: [{
          //                 type: "toggle",
          //                 content: `部分场景下展示最高品质的原始尺寸图像。需要较高的网络速度和设备性能，可能造成更多的流量消耗。`,
          //                 init() {
          //                     return highQualityImage.get();
          //                 },
          //                 event() {
          //                     highQualityImage.set(!highQualityImage.get());
          //                 },
          //             }],
          //         },
          //     },
          // },
        }
      },
      "enhanced": {
        name: "高级",
        icon: "labs",
        description: "提前测试一些尚不稳定的新功能",
        sub: {
          "experimental": {
            name: "实验性功能",
            content: {
              "title": {
                title: "实验室",
                description: `本版块列举了一些实验性功能，这些功能正处于开发阶段，它们当中的大部分都是默认关闭的。
                            这些功能可能会产生已知、未知的错误或性能问题，如果这些问题能被更及时全面地反馈，将有助于整个项目的发展。
                            需要注意的是，这些特性并不保证会保留到后续版本中。`,
                widgets: [{
                  type: "icon",
                  content: "lab_research"
                }]
              },
              "moreBlurEffect": {
                title: "更多模糊效果",
                widgets: [{
                  type: "toggle",
                  content: `优先考虑提供更多的模糊效果。仅当性能预设为“高性能”时，才会生效。`,
                  init() {
                    return experimental.get().moreBlurEffect;
                  },
                  event() {
                    experimental.merge({
                      moreBlurEffect: !experimental.get().moreBlurEffect
                    });
                  }
                }]
              },
              "rasterEffect": {
                title: "栅格特效",
                widgets: [{
                  type: "toggle",
                  content: `将部分场景的模糊效果替换为栅格特效。可能会使文字可见度降低。存在性能问题。`,
                  init() {
                    return experimental.get().rasterEffect;
                  },
                  event() {
                    experimental.merge({
                      rasterEffect: !experimental.get().rasterEffect
                    });
                  }
                }]
              }
            }
          },
          "backup-recover": {
            name: "备份与恢复",
            content: {
              "data-backup": {
                title: "数据备份",
                description: `备份脚本所有自定义配置`,
                widgets: [{
                  type: "button",
                  content: "备份",
                  event() {
                    backupUserConfigs();
                  }
                }]
              },
              "recover-backup": {
                title: "数据恢复",
                description: `从备份文件中恢复脚本所有自定义配置`,
                widgets: [{
                  type: "button",
                  content: "恢复",
                  event() {
                    restoreUserConfigs();
                  }
                }]
              }
            }
          },
          "custom-style": {
            name: "自定义样式",
            content: {
              "content": {
                title: "自定义样式",
                description: `你可以在这里添加一些自定义的CSS代码，用以覆盖脚本内置的一些样式。`,
                widgets: [{
                  type: "textarea",
                  init() {
                    return customStyle.get();
                  },
                  event(e) {
                    customStyle.set(e.target.value);
                  }
                }]
              }
            }
          },
          "factory-reset": {
            name: "重置所有配置",
            content: {
              "title": {
                title: "重置所有配置",
                description: `如果你需要将脚本的一切配置恢复默认，请使用此功能。`
              },
              "reset": {
                widgets: [{
                  type: "button",
                  content: "重置",
                  async event() {
                    if (await userView.messageBox({
                      title: "重置所有配置",
                      content: "该操作是不可逆的，请做最后一次确认。",
                      type: "forceTrueFalse"
                    }) === "positive") {
                      _2.forEach(_GM_listValues(), (key) => {
                        _GM_deleteValue(key);
                      });
                      location.reload();
                    }
                  }
                }]
              }
            }
          }
        }
      },
      "about": {
        name: "关于",
        icon: "person",
        description: "开发信息与检查更新",
        sub: {
          "update": {
            name: "检查更新",
            content: {
              "update-time": {
                title: "检查更新设置",
                description: `发行信息追踪频率`,
                widgets: [{
                  type: "select",
                  content: [{
                    value: "1h",
                    text: "1 小时"
                  }, {
                    value: "3h",
                    text: "3 小时"
                  }, {
                    value: "6h",
                    text: "6 小时"
                  }, {
                    value: "never",
                    text: "从不"
                  }],
                  init() {
                    return updateConfig.get().time;
                  },
                  event(updateTime) {
                    updateConfig.merge({
                      time: updateTime
                    });
                  }
                }]
              },
              "update-notify": {
                widgets: [{
                  type: "toggle",
                  content: `启用一个对话框提示用户更新。该对话框可以立即安装更新，也可以推迟更新操作。`,
                  init() {
                    return updateConfig.get().notify;
                  },
                  event() {
                    updateConfig.merge({
                      notify: !updateConfig.get().notify
                    });
                  }
                }]
              },
              "update-component": {
                widgets: [{
                  type: "component",
                  component: vue.markRaw(AboutUpdate)
                }]
              }
            }
          },
          "about": {
            name: "关于项目",
            content: {
              "about-component": {
                widgets: [{
                  type: "component",
                  component: vue.markRaw(AboutDetail)
                }]
              }
            }
          }
        }
      }
    }));
    const _hoisted_1$b = {
      class: "settings-wrapper remove-default"
    };
    const _hoisted_2$a = {
      class: "left-container"
    };
    const _hoisted_3$9 = {
      class: "search-controls"
    };
    const _hoisted_4$7 = {
      class: "left-panel"
    };
    const _hoisted_5$5 = {
      class: "icon"
    };
    const _hoisted_6$4 = {
      class: "key-info"
    };
    const _hoisted_7$3 = {
      class: "key-title"
    };
    const _hoisted_8$2 = {
      class: "key-desc"
    };
    const _hoisted_9$2 = {
      class: "middle-container"
    };
    const _hoisted_10$2 = {
      class: "key-title"
    };
    const _hoisted_11$2 = {
      class: "right-container"
    };
    const _hoisted_12$1 = {
      key: 0,
      class: "content-title"
    };
    const _hoisted_13$1 = {
      key: 1,
      class: "content-desc"
    };
    const _hoisted_14$1 = {
      class: "line"
    };
    const _hoisted_15$1 = {
      class: "setting-control"
    };
    const _hoisted_16$1 = {
      key: 1,
      class: "icon-component icon"
    };
    const _hoisted_17$1 = {
      key: 4,
      class: "content-sub-title"
    };
    const _hoisted_18$1 = {
      key: 5,
      class: "content-desc"
    };
    const _hoisted_19$1 = {
      class: "line"
    };
    const _hoisted_20$1 = ["src", "alt", "title", "onLoad"];
    const _hoisted_21$1 = {
      key: 1,
      class: "empty-container filled-icon"
    };
    const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
      __name: "settings",
      setup(__props, {
        expose: __expose
      }) {
        const userSettings = getUserSettings();
        const dialogOpts = {
          uniqueName: "settings",
          animation: true,
          modal: true,
          lockScroll: true,
          modalStyle: {
            justifyContent: "flex-start"
          },
          containerStyle: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "max-content",
            maxWidth: "var(--content-max)",
            overflow: "hidden"
          }
        };
        const searchText = vue.ref("");
        const selectedKey = vue.ref();
        const selectedSubKey = vue.ref();
        function selectMainKey(key) {
          selectedKey.value = key;
          selectedSubKey.value = undefined;
        }
        function selectSubKey(key) {
          selectedSubKey.value = key;
        }
        function changeView(key, sub) {
          selectedKey.value = userSettings[key];
          selectedSubKey.value = userSettings[key].sub[sub];
        }
        function clearSelections() {
          selectedKey.value = undefined;
          selectedSubKey.value = undefined;
        }
        function searchKey() {
          if (searchText.value.length <= 0) {
            clearSelections();
            return;
          }
          if (!_2.find(userSettings, (mainKey) => {
            if (_2.find(mainKey.sub, (subKey) => {
              if (subKey.name.toLowerCase().includes(searchText.value.toLowerCase())) {
                selectedKey.value = mainKey;
                selectedSubKey.value = subKey;
                return true;
              } else {
                return false;
              }
            })) return true;
            else return false;
          })) clearSelections();
        }
        const debSearchKey = _2.debounce(searchKey, 500);
        __expose({
          dialogOpts
        });
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createBlock(vue.unref(userView.UserDialog), vue.normalizeProps(vue.guardReactiveProps(dialogOpts)), {
            default: vue.withCtx(() => {
              var _a, _b;
              return [vue.createElementVNode("div", _hoisted_1$b, [vue.createElementVNode("div", _hoisted_2$a, [vue.createElementVNode("div", _hoisted_3$9, [_cache[1] || (_cache[1] = vue.createElementVNode("div", {
                class: "title"
              }, "设置", -1)), vue.createVNode(vue.unref(userView.UserTextbox), {
                modelValue: searchText.value,
                "onUpdate:modelValue": [_cache[0] || (_cache[0] = ($event) => searchText.value = $event), vue.unref(debSearchKey)],
                class: "search-box",
                placeholder: "输入需要搜索的设置"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])]), vue.createElementVNode("div", _hoisted_4$7, [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(userSettings), (setting) => {
                var _a2;
                return vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                  class: vue.normalizeClass(["key-button main-key", {
                    "selected": ((_a2 = selectedKey.value) == null ? undefined : _a2.name) === setting.name
                  }]),
                  onClick: ($event) => selectMainKey(setting),
                  "no-border": "all"
                }, {
                  default: vue.withCtx(() => [_cache[2] || (_cache[2] = vue.createElementVNode("div", {
                    class: "main-key-selected"
                  }, null, -1)), vue.createElementVNode("div", _hoisted_5$5, vue.toDisplayString(setting.icon), 1), vue.createElementVNode("div", _hoisted_6$4, [vue.createElementVNode("div", _hoisted_7$3, vue.toDisplayString(setting.name), 1), vue.createElementVNode("div", _hoisted_8$2, vue.toDisplayString(setting.description), 1)])]),
                  _: 2
                }, 1032, ["class", "onClick"]);
              }), 256))])]), vue.withDirectives(vue.createElementVNode("div", _hoisted_9$2, [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList((_a = selectedKey.value) == null ? undefined : _a.sub, (setting) => {
                var _a2;
                return vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                  class: vue.normalizeClass(["key-button sub-key", {
                    "selected": ((_a2 = selectedSubKey.value) == null ? undefined : _a2.name) === setting.name
                  }]),
                  onClick: ($event) => selectSubKey(setting),
                  "no-border": "all"
                }, {
                  default: vue.withCtx(() => [vue.createElementVNode("div", _hoisted_10$2, vue.toDisplayString(setting.name), 1)]),
                  _: 2
                }, 1032, ["class", "onClick"]);
              }), 256))], 512), [[vue.vShow, selectedKey.value]]), vue.createElementVNode("div", _hoisted_11$2, [((_b = selectedSubKey.value) == null ? undefined : _b.name) ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, {
                key: 0
              }, vue.renderList(selectedSubKey.value.content, (content) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: Math.random(),
                  class: "setting-content"
                }, [(content == null ? undefined : content.title) ? (vue.openBlock(), vue.createElementBlock("h3", _hoisted_12$1, vue.toDisplayString(content == null ? undefined : content.title), 1)) : vue.createCommentVNode("", true), (content == null ? undefined : content.description) ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_13$1, [(content == null ? undefined : content.description) ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, {
                  key: 0
                }, vue.renderList(content.description.split("\n"), (line) => {
                  return vue.openBlock(), vue.createElementBlock("p", _hoisted_14$1, vue.toDisplayString(line), 1);
                }), 256)) : vue.createCommentVNode("", true)])) : vue.createCommentVNode("", true), (content == null ? undefined : content.widgets) ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, {
                  key: 2
                }, vue.renderList(content.widgets, (widget) => {
                  var _a2, _b2;
                  return vue.openBlock(), vue.createElementBlock("div", _hoisted_15$1, [widget.type === "toggle" ? (vue.openBlock(), vue.createBlock(vue.unref(userView.UserCheck), {
                    key: 0,
                    class: "settings-toggle",
                    "model-value": widget.init ? widget.init() : undefined,
                    text: typeof widget.content === "string" ? widget.content : undefined,
                    onChange: widget.event
                  }, null, 8, ["model-value", "text", "onChange"])) : vue.createCommentVNode("", true), widget.type === "icon" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_16$1, vue.toDisplayString(widget.content), 1)) : vue.createCommentVNode("", true), widget.type === "button" ? (vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                    key: 2,
                    onClick: widget.event,
                    "shadow-border": ""
                  }, {
                    default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(widget.content), 1)]),
                    _: 2
                  }, 1032, ["onClick"])) : vue.createCommentVNode("", true), widget.type === "select" && Array.isArray(widget.content) ? (vue.openBlock(), vue.createBlock(vue.unref(userView.UserSelect), {
                    key: 3,
                    class: "settings-select",
                    data: widget.content,
                    "default-value": (_a2 = widget.init) == null ? undefined : _a2.call(widget),
                    onChange: widget.event
                  }, null, 8, ["data", "default-value", "onChange"])) : vue.createCommentVNode("", true), widget.type === "subTitle" ? (vue.openBlock(), vue.createElementBlock("h4", _hoisted_17$1, vue.toDisplayString(widget.content), 1)) : vue.createCommentVNode("", true), widget.type === "desc" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_18$1, [widget.content && typeof widget.content === "string" ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, {
                    key: 0
                  }, vue.renderList(widget.content.split("\n"), (line) => {
                    return vue.openBlock(), vue.createElementBlock("div", _hoisted_19$1, vue.toDisplayString(line), 1);
                  }), 256)) : vue.createCommentVNode("", true)])) : vue.createCommentVNode("", true), vue.unref(_2).includes(["textbox", "textarea"], widget.type) ? (vue.openBlock(), vue.createBlock(vue.unref(userView.UserTextbox), {
                    key: 6,
                    class: vue.normalizeClass(["content-textbox", {
                      "textarea": widget.type === "textarea"
                    }]),
                    value: widget.init ? widget.init() : "",
                    "muti-lines": widget.type === "textarea",
                    placeholder: widget.placeHolder,
                    onChange: widget.event
                  }, null, 8, ["class", "value", "muti-lines", "placeholder", "onChange"])) : vue.createCommentVNode("", true), widget.type === "image" ? (vue.openBlock(), vue.createElementBlock("img", {
                    key: 7,
                    class: "content-image",
                    src: (_b2 = widget.content) == null ? undefined : _b2.toString(),
                    alt: widget.altContent,
                    title: widget.altContent,
                    onLoad: widget.init
                  }, null, 40, _hoisted_20$1)) : vue.createCommentVNode("", true), widget.component ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(widget == null ? undefined : widget.component), {
                    key: 8,
                    onChangeView: changeView
                  }, null, 32)) : vue.createCommentVNode("", true)]);
                }), 256)) : vue.createCommentVNode("", true)]);
              }), 128)) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_21$1, "settings"))])])];
            }),
            _: 1
          }, 16);
        };
      }
    });
    const Settings = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-ceae965b"]]);
    function parseUserModules(glob, callbackfn) {
      const modules2 = [];
      _2.forEach(glob, async (moduleExport) => {
        const currentModule = (await moduleExport()).default;
        const disabledSet = new Set(disabledModules.get());
        const runnable = (() => {
          if (currentModule.switch || currentModule.switch === undefined) {
            if (disabledSet.has(currentModule.id)) {
              return false;
            }
            if (currentModule.scope === true) {
              return true;
            }
            if (Array.isArray(currentModule.scope)) {
              for (let i = 0; i < currentModule.scope.length; i++) {
                const scope = currentModule.scope[i];
                if (currentPageType() === scope) {
                  return true;
                }
              }
            }
            if (currentModule.scope instanceof RegExp) {
              if (currentModule.scope.test(location.href)) {
                return true;
              }
            }
          }
          return false;
        })();
        const runModule = {
          "immediately": () => {
            currentModule.entry();
          },
          "afterHead": () => {
            afterHead(() => {
              currentModule.entry();
            });
          },
          "DOMLoaded": () => {
            document.addEventListener("DOMContentLoaded", () => {
              currentModule.entry();
            });
          },
          "loaded": () => {
            window.addEventListener("load", () => {
              currentModule.entry();
            });
          }
        };
        currentModule.runnable = runnable;
        if (runnable) {
          runModule[currentModule.runAt]();
        }
        modules2.push(currentModule);
        callbackfn(currentModule);
      });
      return modules2;
    }
    const tiebaAPI = {
      /** 首页推荐 */
      feedlist: () => fetch(`/f/index/feedlist?${requestBody({
      "is_new": 1,
      "tag_id": "like"
    })}`),
      /** 用户头像 */
      URL_profile: (portrait) => `https://gss0.baidu.com/7Ls0a8Sm2Q5IlBGlnYG/sys/portrait/item/${portrait}`,
      /** 当前登录用户信息 */
      userInfo: (serverTime) => fetch(`/f/user/json_userinfo?${requestBody({
      "_": serverTime
    })}`),
      /** 用户主页 */
      URL_userHome: (portrait) => `/home/main?id=${portrait}&fr=index`,
      /** 搜索建议 */
      suggestions: (query, encoding = "UTF-8", serverTime) => fetch(`/suggestion?${requestBody({
      "query": query,
      "ie": encoding,
      "_": serverTime
    })}`),
      /** 贴吧热议 */
      topicList: () => fetch("/hottopic/browse/topicList"),
      /** 吧跳转 */
      URL_forum: (keywords, encoding = "utf-8") => `/f?ie=${encoding}&kw=${keywords}`,
      /** 未读消息 */
      unreadMessages: (serverTime) => fetch(`/im/pcmsg/query/getAllUnread?${requestBody({
      "_": serverTime
    })}`),
      /** 收藏更新 */
      favUpdateNum: () => fetch("/sysmsg/userpost/queryStoreUpdateNum"),
      /** 获取 tbs */
      tbs: () => fetch("/dc/common/tbs"),
      /** imgtbs */
      imgtbs: () => fetch("/dc/common/imgtbs"),
      /** 获取已关注的吧 */
      followedForums: () => fetch("/mo/q/newmoindex"),
      /** 更详细的用户信息 */
      userInfoAll: (un, encoding = "UTF-8") => fetch(`/home/get/panel?${requestBody({
      "ie": encoding,
      "un": un
    })}`),
      /** 关注吧 */
      followForum: (tbs, forumId, forumName) => fetch(`/mo/q/favolike?${requestBody({
      "itb_tbs": tbs,
      "fid": forumId,
      "kw": forumName
    })}`),
      /** 取消关注吧 */
      unfollowForum: (tbs, forumName) => fetch(`/mo/q/delmylike?${requestBody({
      "itb_tbs": tbs,
      "forum_name": forumName
    })}`),
      /** 通过 `uid` 查找用户 */
      getUserFromUID: (uid) => fetch(`/im/pcmsg/query/getUserInfo?${requestBody({
      "chatUid": uid
    })}`),
      /** 一键签到（Web 端） */
      oneKeySign: () => fetch("/tbmall/onekeySignin1"),
      /** 热门动态 */
      hotFeeds: (un, pn, encoding = "utf-8", serverTime) => fetch(`/mo/q/newmoindex?${requestBody({
      "un": un,
      "pn": pn,
      "ie": encoding,
      "_": serverTime
    })}`),
      /** 获取当前页所有楼中楼数据 */
      totalComments: (timeStamp, tid, fid, pn, lzOnly = false) => fetch(`/p/totalComment?${requestBody({
      "t": timeStamp,
      "tid": tid,
      "fid": fid,
      "pn": pn,
      "see_lz": Number(lzOnly)
    })}`),
      /** 获取热门话题相关贴 */
      topicRelatedThreads: (topicName, page, lastId, topicId, sortType = 1) => fetch(`/hottopic/browse/getTopicRelateThread?${requestBody({
      "topic_name": topicName,
      "page_no": page,
      "last_id": lastId,
      "topic_id": topicId,
      "sort_type": sortType
    })}`),
      /** 将贴子添加到收藏 */
      addFavoritePost: (tbs, tid, fid, encoding = "utf-8") => fetch("/i/submit/open_storethread", {
        method: "POST",
        body: JSON.stringify({ tbs, tid, fid, encoding })
      }),
      forumSignInfo: (forumName, encoding = "utf-8") => fetch(`/sign/info?${requestBody({
      "kw": forumName,
      "ie": encoding
    })}`),
      forumLoadMonth: (forumName, encoding = "utf-8") => fetch(`/sign/loadmonth?${requestBody({
      "kw": forumName,
      "ie": encoding
    })}`),
      addFloor: (tbs, forum, forumId, threadId, content, floorNum, richText, ev = "comment", __type__ = "reply") => fetch("/f/commit/post/add", {
        method: "POST",
        body: JSON.stringify({
          "ie": "utf-8",
          "kw": forum,
          "fid": forumId,
          "tid": threadId,
          "floor_num": floorNum,
          "rich_text": Number(richText),
          "tbs": tbs,
          "content": content,
          "basilisk": 1,
          "nick_name": PageData.user.user_nickname,
          "ev": ev,
          "biz[po]": PageData.user.portrait.split("?")[0],
          "__type__": __type__,
          "geetest_success": 0
        })
      }),
      getThreadImages(threadId, lzOnly = false, prev = 15, next = 15, picId, fromPage = 0) {
        return fetch(`/photo/bw/picture/guide?${requestBody({
        tid: threadId,
        see_lz: +lzOnly,
        pic_id: picId ?? "",
        from_page: fromPage,
        prev,
        next
      })}`);
      }
    };
    function parsePostFromElement(elem) {
      const titleTagWrapperAnch = dom(".title-tag-wraper a", elem);
      const threadNameWrapper = elem.getElementsByClassName("thread-name-wraper")[0];
      const threadNameWrapperAnch = threadNameWrapper.getElementsByTagName("a")[0];
      const listPostNum = dom(".list-post-num em", threadNameWrapper);
      const imgs = dom("img:not(.nicknameEmoji)", elem, []);
      const nReply = elem.getElementsByClassName("n_reply")[0];
      const nReplyAnch = nReply.getElementsByTagName("a")[0];
      const imgArray = [];
      if (imgs.length > 0) {
        _2.forEach(imgs, (img) => {
          imgArray.push({
            thumb: img.src,
            original: img.getAttribute("original") ?? img.src
          });
        });
      }
      return {
        id: _2.defaultTo(elem.getAttribute("data-thread-id"), ""),
        forum: {
          id: _2.defaultTo(elem.getAttribute("data-forum-id"), ""),
          name: (titleTagWrapperAnch == null ? undefined : titleTagWrapperAnch.title) ?? "",
          href: (titleTagWrapperAnch == null ? undefined : titleTagWrapperAnch.href) ?? ""
        },
        author: {
          portrait: _2.split(nReplyAnch.href, /(\?id=)|&/)[2],
          name: transEmojiFromDOMString(nReplyAnch.innerHTML),
          href: nReplyAnch.href
        },
        time: _2.defaultTo(elem.getElementsByClassName("time")[0].textContent, ""),
        title: threadNameWrapperAnch.title,
        content: _2.defaultTo(elem.getElementsByClassName("n_txt")[0].textContent, ""),
        replies: _2.defaultTo(listPostNum == null ? undefined : listPostNum.getAttribute("data-num"), 0),
        images: imgArray
      };
    }
    function parsePostsFromString(responseString, callbackfn) {
      const feedList = [];
      const dom2 = new DOMParser().parseFromString(responseString, "text/html");
      const threads = dom2.getElementsByClassName("j_feed_li");
      const undesired = "home-place-item";
      _2.forEach(threads, (thread2) => {
        if (thread2.classList.contains(undesired)) return;
        const post = parsePostFromElement(thread2);
        feedList.push(post);
      });
      return feedList;
    }
    function transEmojiFromDOMString(str) {
      const indexRegex = new RegExp("(?<=nickemoji\\/).*?(?=.png)", "gi");
      if (!str.match(indexRegex)) return str;
      const emojis = [
        "º",
        "◎",
        "▫",
        "◆",
        "♤",
        "♀",
        "♂",
        "ლ",
        "♬",
        "☞",
        "☜",
        "✆",
        "☎",
        "♋",
        "Ω",
        "℃",
        "℉",
        "😄",
        "😍",
        "😘",
        "😚",
        "😜",
        "😳",
        "😁",
        "😞",
        "😢",
        "😂",
        "😫",
        "😨",
        "😱",
        "😡",
        "😷",
        "😲",
        "😈",
        "🐷",
        "🐶",
        "🐑",
        "🐵",
        "🐨",
        "🐴",
        "🐼",
        "🐯",
        "🍪",
        "🍺",
        "🍦",
        "🍭",
        "🍗",
        "🍼",
        "🔯",
        "🍒",
        "👀",
        "🐭",
        "😇",
        "😺",
        "😻",
        "🙀",
        "😿",
        "😹",
        "😾",
        "👹",
        "👺",
        "🌞",
        "🌝",
        "🌚",
        "🌜",
        "🌛",
        "👦",
        "👧",
        "🎎",
        "🌸",
        "🍀",
        "🌹",
        "🌻",
        "🌺",
        "🍁",
        "🌿",
        "🍄",
        "🌵",
        "🌴",
        "🌳",
        "🌰",
        "🌱",
        "🌼",
        "🌐",
        "🌙",
        "🌋",
        "🌌",
        "⛅",
        "⚡",
        "☔",
        "⛄",
        "🌀",
        "🌈",
        "🌊",
        "🔥",
        "✨",
        "🌟",
        "💥",
        "💫",
        "💢",
        "💦",
        "💧",
        "💤",
        "💨",
        "🎀",
        "🌂",
        "💄",
        "💕",
        "💖",
        "💞",
        "💘",
        "💌",
        "💋",
        "💝",
        "🎒",
        "🎓",
        "🎏",
        "🎃",
        "👻",
        "🎅",
        "🎄",
        "🎁",
        "🙈",
        "🐒",
        "💯",
        "👯",
        "💍"
      ];
      const transformed = [
        "1-1.png",
        "1-2.png",
        "1-4.png",
        "1-5.png",
        "1-6.png",
        "1-7.png",
        "1-8.png",
        "1-9.png",
        "1-10.png",
        "1-11.png",
        "1-12.png",
        "1-13.png",
        "1-14.png",
        "1-15.png",
        "1-16.png",
        "1-17.png",
        "1-18.png",
        "1-19.png",
        "1-20.png",
        "1-21.png",
        "1-22.png",
        "1-23.png",
        "1-24.png",
        "1-25.png",
        "1-26.png",
        "1-27.png",
        "1-28.png",
        "1-29.png",
        "1-30.png",
        "1-31.png",
        "1-32.png",
        "1-33.png",
        "1-34.png",
        "1-35.png",
        "2-1.png",
        "2-2.png",
        "2-3.png",
        "2-4.png",
        "2-5.png",
        "2-6.png",
        "2-7.png",
        "2-8.png",
        "2-9.png",
        "2-10.png",
        "2-11.png",
        "2-12.png",
        "2-13.png",
        "2-14.png",
        "2-15.png",
        "2-16.png",
        "2-17.png",
        "2-18.png",
        "2-19.png",
        "2-20.png",
        "2-21.png",
        "2-22.png",
        "2-23.png",
        "2-24.png",
        "2-25.png",
        "2-26.png",
        "2-27.png",
        "2-28.png",
        "2-29.png",
        "2-30.png",
        "2-31.png",
        "2-32.png",
        "2-33.png",
        "2-34.png",
        "2-35.png",
        "3-1.png",
        "3-2.png",
        "3-3.png",
        "3-4.png",
        "3-5.png",
        "3-6.png",
        "3-7.png",
        "3-8.png",
        "3-9.png",
        "3-10.png",
        "3-11.png",
        "3-12.png",
        "3-13.png",
        "3-14.png",
        "3-15.png",
        "3-16.png",
        "3-17.png",
        "3-18.png",
        "3-19.png",
        "3-20.png",
        "3-21.png",
        "3-22.png",
        "3-23.png",
        "3-24.png",
        "3-25.png",
        "3-26.png",
        "3-27.png",
        "3-28.png",
        "3-29.png",
        "3-30.png",
        "3-31.png",
        "3-32.png",
        "3-33.png",
        "3-34.png",
        "3-35.png",
        "4-1.png",
        "4-2.png",
        "4-3.png",
        "4-4.png",
        "4-5.png",
        "4-6.png",
        "4-7.png",
        "4-8.png",
        "4-9.png",
        "4-10.png",
        "4-11.png",
        "4-12.png",
        "4-13.png",
        "4-14.png",
        "4-15.png",
        "4-16.png",
        "4-17.png",
        "4-18.png",
        "4-19.png",
        "4-20.png",
        "4-21.png",
        "4-22.png",
        "4-23.png"
      ];
      const arrIndex = str.match(indexRegex);
      arrIndex == null ? undefined : arrIndex.forEach((index2) => {
        const emoji = emojis[transformed.indexOf(`${index2}.png`)];
        const arrInner = _2.split(str, RegExp(
          `<img[^>]*?${index2}.png(?:[^>]*?)*>`,
          "g"
        ));
        str = _2.join(arrInner, decodeURIComponent(emoji));
      });
      return str;
    }
    function levelToClass(level) {
      if (level < 0) return;
      if (level >= 1 && level <= 3) return "green";
      if (level >= 4 && level <= 9) return "blue";
      if (level >= 9 && level <= 15) return "yellow";
      if (level >= 16) return "orange";
    }
    async function getAllThreadImages(opts) {
      var _a, _b, _c, _d;
      const TIMEOUT = 3e3;
      if (currentStorage.has(THREAD_IMAGES)) {
        return currentStorage.get(THREAD_IMAGES);
      }
      const firstResponse = await requestInstance(tiebaAPI.getThreadImages(
        opts.threadId,
        opts.lzOnly
      ));
      const pictureList = picListConv(firstResponse.data.pic_list);
      const startTime = Date.now();
      if (pictureList.length < firstResponse.data.pic_amount) {
        let lastPicId = ((_a = _2(pictureList).last()) == null ? undefined : _a.pictureId) ?? "";
        let lastPostId = ((_b = _2(pictureList).last()) == null ? undefined : _b.postId) ?? 0;
        while (pictureList.length < firstResponse.data.pic_amount) {
          if (Date.now() - startTime > TIMEOUT) {
            userView.toast({
              type: "error",
              message: "获取贴子图片超时，请刷新后再试。"
            });
            return writeCurrent();
          }
          const response = await requestInstance(tiebaAPI.getThreadImages(
            opts.threadId,
            opts.lzOnly,
            0,
            firstResponse.data.pic_amount,
            lastPicId
          ));
          const newList = picListConv(response.data.pic_list);
          pictureList.push(..._2.slice(newList, _2.findLastIndex(newList, { pictureId: lastPicId, postId: lastPostId }) + 1));
          lastPicId = ((_c = _2(picListConv(response.data.pic_list)).last()) == null ? undefined : _c.pictureId) ?? "";
          lastPostId = ((_d = _2(picListConv(response.data.pic_list)).last()) == null ? undefined : _d.postId) ?? 0;
        }
      }
      return writeCurrent();
      function picListConv(picList) {
        return _2(picList).keys().sortBy((key) => parseInt(key.slice(1))).map((key) => {
          const value = picList[key];
          return {
            original: highQualityImage.get() ? value.img.original.waterurl : value.img.screen.waterurl,
            thumbnail: value.img.medium.url,
            pictureId: value.img.original.id,
            postId: value.post_id
          };
        }).value();
      }
      function writeCurrent() {
        currentStorage.set(THREAD_IMAGES, pictureList);
        return pictureList;
      }
    }
    const _sfc_main$d = {};
    const _hoisted_1$a = { class: "block-panel blur-if-custom-background" };
    function _sfc_render(_ctx, _cache) {
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$a, [
        vue.renderSlot(_ctx.$slots, "default")
      ]);
    }
    const BlockPanel = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render]]);
    /**
     * Flex Masonry
     * @author @HacksawBlade
     * @version 1.1
     * @license MIT
     */
    class FlexMasonry {
      constructor(options) {
        __publicField(this, "container");
        __publicField(this, "items");
        __publicField(this, "columnContainers", []);
        __publicField(this, "columnWidth");
        __publicField(this, "gap");
        __publicField(this, "options");
        __publicField(this, "containerSelector");
        __publicField(this, "itemsSelector");
        __publicField(this, "columnSelector", ".masonry-column");
        __publicField(this, "columnsHeight", []);
        __publicField(this, "fragment");
        /** 当前布局的列数 */
        __publicField(this, "_columns");
        options = parseOptions(options);
        this.container = (() => {
          if (typeof options.container === "string") {
            this.containerSelector = options.container;
            const _container = document.querySelector(options.container);
            if (_container) {
              return _container;
            } else {
              throw new Error("Can't find container element.");
            }
          } else {
            return options.container;
          }
        })();
        if (options.items) {
          this.items = (() => {
            if (typeof options.items === "string") {
              this.itemsSelector = options.items;
              const _items = document.querySelectorAll(options.items);
              if (_items) {
                return Array.from(_items);
              } else {
                return [];
              }
            } else {
              return options.items;
            }
          })().map((el) => {
            el.style.visibility = "hidden";
            return { element: el, cachedHeight: el.clientHeight };
          });
        } else {
          this.items = [];
        }
        this.columnWidth = options.columnWidth;
        if (options.gap) {
          if (Array.isArray(options.gap)) {
            this.gap = options.gap;
          } else {
            this.gap = [options.gap, options.gap];
          }
        } else {
          this.gap = [0, 0];
        }
        this._columns = 0;
        this.options = options;
        this.initStyle();
        if (options.autoExec) this.exec();
      }
      initStyle() {
        this.container.style.display = "flex";
        this.container.style.alignItems = "flex-start";
        this.container.style.justifyContent = "center";
        this.container.style.gap = `${this.gap[0]}px`;
      }
      get columns() {
        return this._columns;
      }
      /** 执行布局 */
      exec() {
        this.calcColumns();
        const originalPosition = window.scrollY;
        this.calc();
        this.layout();
        if (this.options.fixScrollOffset) window.scrollTo(0, originalPosition);
      }
      adjustWidth() {
        const elColumns = this.container.querySelectorAll(this.columnSelector);
        const width = (this.container.clientWidth - this.gap[0] * (this._columns - 1)) / this._columns;
        elColumns.forEach((el) => {
          el.style.width = `${width}px`;
        });
      }
      /** 仅计算布局 */
      calc() {
        this.columnsHeight = Array(this.calcColumns()).fill(0);
        const fragment = document.createDocumentFragment();
        const _col = this.container.querySelectorAll(this.columnSelector);
        _col.forEach((col) => {
          col.remove();
        });
        this.columnContainers.length = 0;
        for (let i = 0; i < this._columns; i++) {
          this.columnContainers.push(
            fragment.appendChild(createNewElement("div", {
              class: this.columnSelector.substring(1),
              style: `width: ${(this.container.clientWidth - this.gap[0] * (this._columns - 1)) / this._columns}px;`
            }))
          );
        }
        this.columnContainers.forEach((ccontainer) => {
          ccontainer.style.display = "flex";
          ccontainer.style.flexDirection = "column";
          ccontainer.style.gap = `${this.gap[1]}px`;
        });
        this.items.forEach((el) => {
          this._appendElement(el);
        });
        this.fragment = fragment;
      }
      /**
       * 仅应用布局
       * 
       * 调用该函数前需要已经至少计算过一次布局
       */
      layout() {
        if (this.fragment) {
          this.container.appendChild(this.fragment);
        } else {
          throw Error("Never conducted layout calculations before. You should use exec() or calc() first.");
        }
      }
      removeUnusedColumns() {
        const _col = this.container.querySelectorAll(this.columnSelector);
        _col.forEach((col) => {
          if (col.children.length === 0) col.remove();
        });
      }
      /** 
       * 清空布局中的所有 `items`
       *  
       * 该操作并不会将元素从文档中移除
       */
      clear() {
        this.items.length = 0;
        this.columnsHeight = Array(this.calcColumns()).fill(0);
      }
      /** 仅计算当前需要的列数 */
      calcColumns() {
        this._columns = Math.ceil((this.container.clientWidth - this.columnWidth) / (this.columnWidth + this.gap[0]));
        return this._columns;
      }
      /**
       * 向布局中加入元素
       * @param el 要添加的元素
       */
      appendElement(...elems) {
        const masonryElements = elems.map((el) => {
          return {
            element: el,
            cachedHeight: el.clientHeight
          };
        });
        this._appendElement(...masonryElements);
        this.items.push(...masonryElements);
      }
      _appendElement(...elems) {
        elems.forEach((el) => {
          const minIndex = this.columnsHeight.indexOf(Math.min(...this.columnsHeight));
          this.columnsHeight[minIndex] += el.cachedHeight;
          this.columnContainers[minIndex].appendChild(el.element);
          el.element.style.visibility = "visible";
          const clientHeight = this.columnContainers[minIndex].clientHeight;
          if (clientHeight !== 0) {
            this.columnsHeight[minIndex] = this.columnContainers[minIndex].clientHeight;
          }
        });
      }
      /**
       * 在原有子项的基础上追加子项
       * @param newItems 要添加的新元素，接受 CSS选择器
       * @param interval 插入每个元素间的时间间隔
       */
      append(newItems, interval) {
        const appended = (() => {
          if (newItems) {
            if (typeof newItems === "string") {
              const _items = document.querySelectorAll(newItems);
              return Array.from(_items);
            } else {
              return newItems;
            }
          } else {
            if (this.itemsSelector) {
              const _items = Array.from(document.querySelectorAll(this.itemsSelector));
              const appendCount = _items.length - this.items.length;
              if (appendCount > 0) {
                const _appended = _items.slice(-appendCount);
                return _appended;
              }
            }
          }
        })();
        if (appended) {
          if (!interval || interval <= 0) {
            appended.forEach((el) => {
              this.appendElement(el);
            });
          } else {
            appended.forEach((el, index2) => {
              setTimeout(() => {
                this.appendElement(el);
              }, interval * index2);
            });
          }
        }
      }
      refreshContainer() {
        if (this.containerSelector) {
          const newContainer = document.querySelector(this.containerSelector);
          if (newContainer) {
            this.container = newContainer;
          }
        }
      }
    }
    function parseOptions(options) {
      options.gap = options.gap || 0;
      options.autoExec = options.autoExec === undefined ? true : options.autoExec;
      options.fixScrollOffset = options.fixScrollOffset === undefined ? false : options.fixScrollOffset;
      return options;
    }
    function createNewElement(tag, attrs) {
      const el = document.createElement(tag);
      for (const key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
      return el;
    }
    class FrameInterval {
      constructor(callback) {
        __publicField(this, "id");
        __publicField(this, "callback");
        __publicField(this, "thenfn", () => undefined);
        __publicField(this, "stopCondition");
        this.callback = callback ?? (() => undefined);
        this.stopCondition = () => false;
        this.id = requestAnimationFrame(this.tick.bind(this));
      }
      tick() {
        if (this.stopCondition()) {
          this.cancel();
          return;
        }
        this.callback();
        this.id = requestAnimationFrame(this.tick.bind(this));
      }
      cancel() {
        if (this.id) {
          cancelAnimationFrame(this.id);
          this.id = undefined;
        }
        this.thenfn();
      }
      until(stopCondition) {
        this.stopCondition = stopCondition;
        return this;
      }
      then(thenfn) {
        this.thenfn = thenfn;
      }
    }
    const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
      __name: "header-progress",
      props: {
        calc: { type: Function }
      },
      setup(__props) {
        const props = __props;
        const headerProgress2 = vue.ref();
        const valueRef = vue.ref(0);
        vue.onMounted(function() {
          if (headerProgress2.value) {
            new FrameInterval(calcValue).until(() => valueRef.value >= 100);
          }
        });
        function calcValue() {
          valueRef.value = props.calc();
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            ref_key: "headerProgress",
            ref: headerProgress2,
            id: "header-progress",
            class: vue.normalizeClass({ "complete": valueRef.value >= 100 }),
            style: vue.normalizeStyle(`width: ${valueRef.value}vw;`)
          }, null, 6);
        };
      }
    });
    const HeaderProgress = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-782eb887"]]);
    function renderJSX(jsxel, parent) {
      vue.render(jsxel, parent);
      const root = parent.firstChild;
      return {
        root,
        vnode: jsxel,
        remove() {
          vue.render(null, parent);
          if (root.parentNode) root.remove();
        }
      };
    }
    function createJSXWrapper() {
      return domrd("div", {
        class: "jsx-wrapper"
      });
    }
    function insertJSX(jsxel, parent, position) {
      const jsxWrapper = createJSXWrapper();
      return renderJSX(jsxel, parent.insertBefore(jsxWrapper, position ?? null));
    }
    function appendJSX(jsxel, parent) {
      const jsxWrapper = createJSXWrapper();
      return renderJSX(jsxel, parent.appendChild(jsxWrapper));
    }
    function headerProgress(props, delay = 2e3, timeout = 1e4) {
      const progressBar = vue.createVNode(HeaderProgress, {
        "calc": props.calc
      }, null);
      const rendered = insertJSX(progressBar, document.body, document.body.firstChild ?? undefined);
      const timeoutTimer = setTimeout(() => {
        rendered.root.remove();
      }, timeout);
      waitUntil(() => rendered.root.style.width === "100vw", timeout).then(function() {
        setTimeout(() => {
          rendered.root.remove();
          clearTimeout(timeoutTimer);
        }, delay);
      });
      return rendered;
    }
    const shieldList = new UserKey(
      "shieldList",
      [],
      undefined,
      (maybeLegacy) => _2.map(maybeLegacy, shieldRuleMigration)
    );
    function matchShield(rule, str, scope) {
      if (!rule.toggle) return false;
      if (rule.scope !== scope) return false;
      if (rule.ignoreCase === undefined) rule.ignoreCase = true;
      if (rule.type === "text") {
        if (rule.ignoreCase) {
          rule.content = rule.content.toLowerCase();
          str = str.toLowerCase();
        }
        if (str.indexOf(rule.content) !== -1) {
          return true;
        }
      }
      if (rule.type === "regex") {
        let regex;
        if (rule.ignoreCase) {
          regex = new RegExp(rule.content, "i");
        } else {
          regex = new RegExp(rule.content);
        }
        if (regex.test(str)) {
          return true;
        }
      }
      return false;
    }
    function shieldRuleMigration(rule) {
      if (!_2.has(rule, "rule")) return rule;
      rule = rule;
      const newRule = {
        content: rule.rule,
        type: "text",
        scope: "content",
        toggle: rule.switch,
        ignoreCase: rule.ignoreCase,
        matchHTML: rule.matchHTML
      };
      if (rule.type === "string") newRule.type = "text";
      if (rule.scope === "posts") newRule.scope = "content";
      if (rule.scope === "users") newRule.scope = "username";
      return newRule;
    }
    const _hoisted_1$9 = {
      id: "shield-editor"
    };
    const _hoisted_2$9 = {
      id: "shield-editor-rule-control"
    };
    const _hoisted_3$8 = {
      id: "shield-editor-toggle-control"
    };
    const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
      __name: "shield-editor",
      props: {
        rule: {}
      },
      setup(__props) {
        const props = __props;
        const dialog = vue.ref();
        const useRegex = vue.ref(props.rule.type === "regex");
        const userScope = vue.ref(props.rule.scope === "username");
        const ruleRef = vue.ref({
          ...props.rule
        });
        function keyPressHandler(e) {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }
        function submit() {
          var _a;
          const newRule = {
            ...ruleRef.value,
            type: useRegex.value ? "regex" : "text",
            scope: userScope.value ? "username" : "content"
          };
          (_a = dialog.value) == null ? undefined : _a.unload(newRule);
        }
        function unload() {
          var _a;
          (_a = dialog.value) == null ? undefined : _a.unload({
            ...props.rule
          });
        }
        function deleteRule() {
          var _a;
          (_a = dialog.value) == null ? undefined : _a.unload();
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createBlock(vue.unref(userView.UserDialog), {
            ref_key: "dialog",
            ref: dialog,
            title: "编辑",
            "dialog-buttons": [{
              text: "确定",
              event: submit,
              style: "themed"
            }, {
              text: "取消",
              event: unload
            }],
            "default-payload": {
              ...props.rule
            }
          }, {
            default: vue.withCtx(() => [vue.createElementVNode("div", _hoisted_1$9, [vue.createElementVNode("div", _hoisted_2$9, [_cache[4] || (_cache[4] = vue.createElementVNode("label", {
              for: "shield-editor-rule"
            }, "规则", -1)), vue.createVNode(vue.unref(userView.UserTextbox), {
              modelValue: ruleRef.value.content,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => ruleRef.value.content = $event),
              id: "shield-editor-rule",
              "muti-lines": "",
              onKeypress: keyPressHandler
            }, null, 8, ["modelValue"])]), vue.createElementVNode("div", _hoisted_3$8, [vue.createVNode(vue.unref(userView.UserCheck), {
              modelValue: ruleRef.value.toggle,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => ruleRef.value.toggle = $event),
              id: "shield-editor-toggle",
              text: "启用"
            }, null, 8, ["modelValue"]), vue.createVNode(vue.unref(userView.UserCheck), {
              modelValue: useRegex.value,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => useRegex.value = $event),
              id: "shield-editor-regex",
              text: "正则表达式"
            }, null, 8, ["modelValue"]), vue.createVNode(vue.unref(userView.UserCheck), {
              modelValue: userScope.value,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => userScope.value = $event),
              id: "shield-editor-user",
              text: "屏蔽用户名"
            }, null, 8, ["modelValue"])]), vue.createVNode(vue.unref(userView.UserButton), {
              id: "shield-editor-delete",
              onClick: deleteRule
            }, {
              default: vue.withCtx(() => _cache[5] || (_cache[5] = [vue.createTextVNode("删除规则")])),
              _: 1
            })])]),
            _: 1
          }, 8, ["dialog-buttons", "default-payload"]);
        };
      }
    });
    const ShieldEditor = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-5a7329f8"]]);
    const _hoisted_1$8 = {
      class: "shield-container"
    };
    const _hoisted_2$8 = {
      key: 0,
      class: "words-container"
    };
    const _hoisted_3$7 = {
      class: "icon"
    };
    const _hoisted_4$6 = {
      class: "content"
    };
    const _hoisted_5$4 = {
      key: 1,
      class: "empty-list-container"
    };
    const _hoisted_6$3 = {
      class: "shield-controls"
    };
    const _hoisted_7$2 = {
      class: "submit-controls"
    };
    const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
      __name: "module.shield",
      setup(__props) {
        const shieldListRef = vue.ref(shieldList.get());
        const inputRule = vue.ref("");
        const useRegex = vue.ref(false);
        const userScope = vue.ref(false);
        function inputKeyPress(e) {
          if (e.key === "Enter") {
            e.preventDefault();
            updateShieldList();
          }
        }
        function editRule(rule, index2) {
          renderDialog(ShieldEditor, {
            rule
          }, {
            unloaded(rule2) {
              if (!rule2) {
                shieldListRef.value.splice(index2, 1);
                shieldList.set(shieldListRef.value);
                return;
              }
              shieldListRef.value[index2] = rule2;
              shieldList.set(shieldListRef.value);
            }
          });
        }
        function removeAll() {
          shieldListRef.value.length = 0;
          shieldList.remove();
        }
        async function removeAllWithConfirm() {
          if (await userView.messageBox({
            content: "该操作将无法恢复，确定要删除所有屏蔽规则吗？",
            type: "forceTrueFalse"
          }) === "positive") {
            removeAll();
          }
        }
        function updateShieldList() {
          if (inputRule.value.length <= 0) return;
          const rule = {
            content: inputRule.value,
            type: useRegex.value ? "regex" : "text",
            scope: userScope.value ? "username" : "content",
            toggle: true
          };
          shieldListRef.value.push(rule);
          inputRule.value = "";
          shieldList.set(shieldListRef.value);
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$8, [shieldListRef.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$8, [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(shieldListRef.value, (sh, index2) => {
            return vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
              class: vue.normalizeClass(["shield-elem", {
                "content-scope": sh.scope === "content",
                "user-scope": sh.scope === "username",
                "disabled": !sh.toggle
              }]),
              onClick: ($event) => editRule(sh, index2)
            }, {
              default: vue.withCtx(() => [vue.createElementVNode("div", _hoisted_3$7, vue.toDisplayString(sh.scope === "content" ? "chat" : "account_circle"), 1), vue.createElementVNode("p", _hoisted_4$6, vue.toDisplayString(sh.content), 1)]),
              _: 2
            }, 1032, ["class", "onClick"]);
          }), 256)), vue.createVNode(vue.unref(userView.UserButton), {
            class: "remove-all shield-elem icon",
            onClick: removeAllWithConfirm
          }, {
            default: vue.withCtx(() => _cache[3] || (_cache[3] = [vue.createTextVNode("delete")])),
            _: 1
          })])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$4, "当前没有记录屏蔽规则")), vue.createElementVNode("div", _hoisted_6$3, [vue.createVNode(vue.unref(userView.UserTextbox), {
            modelValue: inputRule.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => inputRule.value = $event),
            "muti-lines": "",
            class: "shield-input",
            placeholder: "输入屏蔽规则，按下 [ENTER] 提交。",
            onKeypress: inputKeyPress
          }, null, 8, ["modelValue"]), vue.createElementVNode("div", _hoisted_7$2, [vue.createVNode(vue.unref(userView.UserCheck), {
            modelValue: useRegex.value,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => useRegex.value = $event),
            id: "use-regex",
            text: "正则表达式"
          }, null, 8, ["modelValue"]), vue.createVNode(vue.unref(userView.UserCheck), {
            modelValue: userScope.value,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => userScope.value = $event),
            id: "user-scope",
            text: "屏蔽用户名"
          }, null, 8, ["modelValue"]), vue.createVNode(vue.unref(userView.UserButton), {
            class: "submit-button",
            "shadow-border": true,
            "theme-style": true,
            onClick: updateShieldList
          }, {
            default: vue.withCtx(() => _cache[4] || (_cache[4] = [vue.createTextVNode("确定 ")])),
            _: 1
          })])])]);
        };
      }
    });
    const moduleShieldVue = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-a0433092"]]);
    const index$f = {
      id: "shield",
      name: "贴吧屏蔽",
      author: "锯条",
      version: "1.2",
      brief: "眼不见为净",
      description: `用户自定义屏蔽规则，符合规则的贴子和楼层将不会显示在首页、看贴页面和进吧页面。支持正则匹配`,
      scope: true,
      runAt: "immediately",
      settings: {
        "shield-controls": {
          title: "管理屏蔽规则",
          description: `这些屏蔽规则将会在首页、看贴页面生效，会自动隐藏所有符合匹配规则的贴子和楼层。`,
          widgets: [{
            type: "component",
            component: vue.markRaw(moduleShieldVue)
          }]
        }
      },
      entry: main$6
    };
    function shieldBySelector(observer, scope, parentSelector, subSelector) {
      observer.addEvent(() => {
        dom(parentSelector, []).forEach((elem) => {
          let isMatch = false;
          const content = _2.join(_2.map(dom(subSelector, elem, []), (el) => el.textContent ?? ""), "\n");
          for (const rule of shieldList.get()) {
            if (matchShield(rule, content, scope)) {
              isMatch = true;
              break;
            }
          }
          if (isMatch) {
            elem.style.display = "none";
          }
        });
      });
    }
    function main$6() {
      shieldBySelector(threadFloorsObserver, "content", ".l_post_bright", ".d_post_content");
      shieldBySelector(threadFloorsObserver, "username", ".l_post_bright", ".p_author_name");
      shieldBySelector(threadCommentsObserver, "content", ".lzl_single_post", ".lzl_content_main");
      shieldBySelector(threadCommentsObserver, "username", ".lzl_single_post", ".lzl_cnt .j_user_card");
      shieldBySelector(legacyIndexFeedsObserver, "content", ".j_feed_li", ".title, .n_txt");
      shieldBySelector(legacyIndexFeedsObserver, "username", ".j_feed_li", ".post_author");
      shieldBySelector(forumThreadsObserver, "content", ".j_thread_list", ".threadlist_title a");
      shieldBySelector(forumThreadsObserver, "username", ".j_thread_list", ".frs-author-name-wrap");
    }
    const index$g = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: index$f,
      matchShield,
      shieldList,
      shieldRuleMigration
    }, Symbol.toStringTag, { value: "Module" }));
    const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
      __name: "await-dialog",
      props: {
        unloadPred: { type: Function, default: () => false },
        timeout: { default: Infinity },
        unloadAfterTimeout: { type: Boolean, default: true }
      },
      emits: ["timeout"],
      setup(__props, { emit: __emit }) {
        const props = __props;
        const emit = __emit;
        const dialogOpts = {
          animation: false,
          force: true,
          uniqueName: "await-dialog"
        };
        const dialog = vue.ref();
        vue.onMounted(() => {
          if (props.unloadPred) {
            waitUntil(props.unloadPred, props.timeout).then(() => {
              var _a;
              (_a = dialog.value) == null ? undefined : _a.unload();
            }).catch(() => {
              var _a;
              emit("timeout");
              if (props.unloadAfterTimeout) {
                (_a = dialog.value) == null ? undefined : _a.unload();
              }
            });
          }
        });
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createBlock(vue.unref(userView.UserDialog), vue.mergeProps({
            ref_key: "dialog",
            ref: dialog
          }, dialogOpts), {
            default: vue.withCtx(() => _cache[0] || (_cache[0] = [
              vue.createElementVNode("svg", {
                class: "loading-svg",
                viewBox: "0 0 100 100"
              }, [
                vue.createElementVNode("circle", {
                  class: "loading-circle",
                  cx: "50",
                  cy: "50",
                  r: "40",
                  fill: "none",
                  "stroke-width": "8"
                })
              ], -1)
            ])),
            _: 1
          }, 16);
        };
      }
    });
    const AwaitDialog = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-a73ee99e"]]);
    class EventProxy {
      constructor() {
        __publicField(this, "records", []);
      }
      /**
       * 注册事件
       * @param target 事件目标
       * @param type 事件类型
       * @param callback 事件回调函数
       * @param options 选项
       */
      on(target, type, callback, options) {
        if (!target) return;
        target.addEventListener(type, callback, options);
        this.records.push({ target, type, callback, options });
      }
      /** 销毁通过该代理注册的所有事件 */
      release() {
        _2.forEach(this.records, ({ target, type, callback, options }) => {
          target.removeEventListener(type, callback, options);
        });
        this.records = [];
      }
    }
    const _hoisted_1$7 = ["src"];
    const _hoisted_2$7 = { class: "zoom-size" };
    const _hoisted_3$6 = { class: "bottom-controls-container" };
    const _hoisted_4$5 = ["data-lazyload", "onClick"];
    const MIN_SIZE = 0.1;
    const MAX_SIZE = 8;
    const VLI_THRESHOLD = 5;
    const VLI_WIDTH_SCALE = 2;
    const DEFAULT_HIDE_CONTROLS_DELAY = 1e3;
    const SHOW_CONTROLS_THRESHOLD_X = 180;
    const SHOW_CONTROLS_THRESHOLD_Y = 140;
    const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
      __name: "images-viewer",
      props: {
        content: {},
        defaultIndex: { default: 0 }
      },
      setup(__props) {
        const props = __props;
        const imageArray = [];
        const thumbArray = [];
        if (typeof props.content === "string") {
          imageArray.push(props.content);
          thumbArray.push(props.content);
        } else if (Array.isArray(props.content)) {
          if (typeof props.content[0] === "string") {
            imageArray.push(...props.content);
            thumbArray.push(...props.content);
          } else {
            _2.forEach(props.content, (value) => {
              imageArray.push(value.original);
              thumbArray.push(value.thumbnail);
            });
          }
        } else {
          _2.forEach(props.content.images, (value) => {
            imageArray.push(value.original);
            thumbArray.push(value.thumb);
          });
        }
        const dialog = vue.ref();
        const imagesViewer2 = vue.ref();
        const imageContainer = vue.ref();
        const currImage = vue.ref();
        const bottomPanel = vue.ref();
        const thumbContainer = vue.ref();
        const curr = vue.ref(props.defaultIndex);
        const scale = vue.ref(1);
        const deg = vue.ref(0);
        const imageLeft = vue.ref(undefined);
        const imageTop = vue.ref(undefined);
        const showControls = vue.ref({
          left: false,
          right: false,
          top: false,
          bottom: false
        });
        const lockControls = vue.ref({
          left: false,
          right: false,
          top: false,
          bottom: false
        });
        const vliMode = vue.ref(false);
        const imageStyle = vue.computed(() => {
          return {
            transform: `scale(${scale.value}) rotate(${deg.value}deg)`,
            left: `${imageLeft.value}px`,
            top: `${imageTop.value}px`,
            transition: vliMode.value ? "all 0.4s ease, left 0s, top 0.1s ease-out" : "all 0.4s ease, left 0s, top 0s"
          };
        });
        const imageProps = vue.computed(function() {
          var _a;
          const naturalHeight = ((_a = currImage.value) == null ? undefined : _a.naturalHeight) ?? 0;
          return {
            naturalHeight: naturalHeight ?? 0,
            scaledHeight: naturalHeight ?? 0 * scale.value,
            vliMaxTop: -(naturalHeight * (1 - scale.value) / 2) + window.innerHeight / 2,
            vliMinTop: -(naturalHeight * scale.value) - naturalHeight * (1 - scale.value) / 2 + window.innerHeight / 2
          };
        });
        const dialogOpts = {
          blurEffect: false,
          shadowMode: true,
          contentStyle: {
            width: "100%",
            height: "100%"
          },
          renderAnimation: "kf-fade-in var(--fast-duration)",
          unloadAnimation: "kf-fade-out var(--fast-duration)",
          uniqueName: "images-viewer"
        };
        const evproxy = new EventProxy();
        let lastMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let lastControlTimeout = {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        };
        let thumbLazyloadObserver;
        vue.onMounted(async () => {
          await vue.nextTick();
          const currentBottom = dom(".bottom-btn", thumbContainer.value, [])[props.defaultIndex];
          currentBottom.scrollIntoView({
            inline: "center"
          });
          let offsetX = 0, offsetY = 0;
          evproxy.on(window, "mousemove", _2.throttle(function(e) {
            const { clientX, clientY } = e;
            lastMousePos = { x: clientX, y: clientY };
            showControls.value = verifyPos();
          }, 100, { leading: true }));
          lockControlsTemporarily("all", DEFAULT_HIDE_CONTROLS_DELAY);
          evproxy.on(imagesViewer2.value, "wheel", imageWheel, { passive: true });
          evproxy.on(currImage.value, "mousedown", (e) => {
            if (!currImage.value) return;
            e.preventDefault();
            if (vliMode.value) return;
            offsetX = e.clientX - currImage.value.offsetLeft;
            offsetY = e.clientY - currImage.value.offsetTop;
            document.addEventListener("mousemove", moveHandler);
          });
          evproxy.on(document, "mouseup", (e) => {
            e.preventDefault();
            document.removeEventListener("mousemove", moveHandler);
          });
          evproxy.on(currImage.value, "load", function() {
            if (!currImage.value) return;
            vliMode.value = false;
            (() => {
              if (currImage.value.naturalHeight < window.innerHeight && currImage.value.naturalWidth < window.innerWidth) {
                scale.value = 1;
                return;
              }
              if (currImage.value.naturalHeight / currImage.value.naturalWidth >= VLI_THRESHOLD) {
                vliMode.value = true;
                scale.value = window.innerWidth / VLI_WIDTH_SCALE / currImage.value.naturalWidth;
                imageLeft.value = undefined;
                return;
              }
              vliMode.value = false;
              scale.value = Math.min(
                window.innerWidth / currImage.value.naturalWidth,
                window.innerHeight / currImage.value.naturalHeight
              );
            })();
            currImage.value.classList.remove("changing");
          });
          evproxy.on(currImage.value, "transitionend", function() {
            var _a, _b, _c;
            if (Math.abs(deg.value) >= 360) {
              (_a = currImage.value) == null ? undefined : _a.classList.add("changing");
              deg.value = Math.abs(deg.value) % 360;
              (_b = currImage.value) == null ? undefined : _b.offsetHeight;
              (_c = currImage.value) == null ? undefined : _c.classList.remove("changing");
            }
          });
          thumbLazyloadObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.lazyload ?? "";
                thumbLazyloadObserver.unobserve(entry.target);
              }
            });
          });
          const bottomPanelScrollBar = dom(".bottom-panel-scroll-bar", bottomPanel.value);
          const bottomContainer = dom(".bottom-controls-container", bottomPanel.value);
          if (bottomPanel.value) {
            dom("img", bottomPanel.value, []).forEach((img) => {
              thumbLazyloadObserver.observe(img);
            });
            if (bottomPanelScrollBar && bottomContainer) {
              const scrollBarScale = bottomContainer.clientWidth / bottomContainer.scrollWidth;
              if (scrollBarScale >= 1) {
                bottomPanelScrollBar.style.display = "none";
              }
              bottomPanelScrollBar.style.width = `${scrollBarScale * 100}%`;
            }
          }
          evproxy.on(bottomPanel.value, "wheel", (e) => {
            e.stopPropagation();
            if (!bottomContainer) return;
            if (e.deltaX === 0 && e.deltaY !== 0) {
              bottomContainer.scrollBy({
                left: e.deltaY
              });
            } else if (e.deltaX !== 0 && e.deltaY === 0) {
              bottomContainer.scrollBy({
                left: e.deltaX
              });
            }
            if (bottomPanelScrollBar) {
              bottomPanelScrollBar.style.left = `${bottomContainer.scrollLeft / bottomContainer.scrollWidth * 100}%`;
            }
          }, { passive: false });
          function moveHandler(e) {
            if (!currImage.value) return;
            imageLeft.value = e.clientX - offsetX;
            imageTop.value = e.clientY - offsetY;
          }
        });
        vue.onUnmounted(function() {
          evproxy.release();
          thumbLazyloadObserver.disconnect();
        });
        vue.watch(curr, function() {
          var _a;
          (_a = currImage.value) == null ? undefined : _a.classList.add("changing");
          deg.value = 0;
          imageLeft.value = undefined;
          imageTop.value = undefined;
        });
        vue.watch(imageTop, function(newTop) {
          if (vliMode.value) {
            if (!currImage.value || !imageTop.value || !newTop) return;
            if (newTop > imageProps.value.vliMaxTop) {
              imageTop.value = imageProps.value.vliMaxTop;
            }
            if (newTop < imageProps.value.vliMinTop) {
              imageTop.value = imageProps.value.vliMinTop;
            }
          }
        });
        vue.watch(vliMode, function(newMode) {
          lockControlsTemporarily("top", DEFAULT_HIDE_CONTROLS_DELAY);
          if (newMode && currImage.value && !imageTop.value) {
            imageTop.value = Math.max(
              imageProps.value.vliMinTop,
              -(currImage.value.naturalHeight * (1 - scale.value) / 2)
            );
          }
        });
        function unload() {
          var _a;
          (_a = dialog.value) == null ? undefined : _a.unload();
        }
        function listBack() {
          if (curr.value > 0) curr.value--;
        }
        function listForward() {
          if (curr.value < imageArray.length - 1) curr.value++;
        }
        function zoomImage(delta) {
          scale.value += delta;
          if (scale.value < MIN_SIZE) {
            scale.value = MIN_SIZE;
          }
          if (scale.value > MAX_SIZE) {
            scale.value = MAX_SIZE;
          }
        }
        function rotateImage(delta) {
          deg.value += delta;
        }
        function imageWheel(e) {
          if (!currImage.value) return;
          if (!vliMode.value) {
            zoomImage(-e.deltaY / 1e3);
          } else {
            if (!imageTop.value) imageTop.value = 0;
            imageTop.value += -e.deltaY / 1e3 * window.innerHeight;
          }
        }
        function clickModal(e) {
          if (e.target === imageContainer.value) {
            unload();
          }
        }
        function lockControlsTemporarily(direction, timeout) {
          if (direction !== "all") {
            lock(direction);
          } else {
            lock("left");
            lock("right");
            lock("top");
            lock("bottom");
          }
          function lock(direction2) {
            lockControls.value[direction2] = true;
            if (lastControlTimeout[direction2]) {
              clearTimeout(lastControlTimeout[direction2]);
            }
            showControls.value[direction2] = true;
            lastControlTimeout[direction2] = setTimeout(() => {
              lockControls.value[direction2] = false;
              showControls.value = verifyPos();
            }, timeout);
          }
        }
        function verifyPos(pos = lastMousePos) {
          const distanceToLeft = pos.x;
          const distanceToRight = window.innerWidth - pos.x;
          const distanceToTop = pos.y;
          const distanceToBottom = window.innerHeight - pos.y;
          const calcValue = {
            left: false,
            right: false,
            top: false,
            bottom: false
          };
          distanceToLeft <= SHOW_CONTROLS_THRESHOLD_X || lockControls.value.left ? calcValue.left = true : calcValue.left = false;
          distanceToRight <= SHOW_CONTROLS_THRESHOLD_X || lockControls.value.right ? calcValue.right = true : calcValue.right = false;
          distanceToTop <= SHOW_CONTROLS_THRESHOLD_Y || lockControls.value.top ? calcValue.top = true : calcValue.top = false;
          distanceToBottom <= SHOW_CONTROLS_THRESHOLD_Y || lockControls.value.bottom ? calcValue.bottom = true : calcValue.bottom = false;
          return calcValue;
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createBlock(vue.unref(userView.UserDialog), vue.mergeProps({
            ref_key: "dialog",
            ref: dialog
          }, dialogOpts), {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", {
                ref_key: "imagesViewer",
                ref: imagesViewer2,
                class: "images-viewer",
                onClick: clickModal
              }, [
                vue.createElementVNode("div", {
                  ref_key: "imageContainer",
                  ref: imageContainer,
                  class: "image-container dialog-toggle"
                }, [
                  vue.createElementVNode("img", {
                    ref_key: "currImage",
                    ref: currImage,
                    class: "curr-image changing",
                    src: imageArray[curr.value],
                    style: vue.normalizeStyle(vue.unref(parseCSSRule)(imageStyle.value))
                  }, null, 12, _hoisted_1$7)
                ], 512),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(["control-panel head-controls", { "hide": !showControls.value.top }])
                }, [
                  vue.createVNode(vue.unref(userView.UserToggle), {
                    class: "vli-mode head-btn icon",
                    title: "长图模式",
                    modelValue: vliMode.value,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vliMode.value = $event)
                  }, {
                    default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                      vue.createTextVNode("chrome_reader_mode ")
                    ])),
                    _: 1
                  }, 8, ["modelValue"]),
                  _cache[11] || (_cache[11] = vue.createElementVNode("span", null, "|", -1)),
                  vue.createVNode(vue.unref(userView.UserButton), {
                    class: "zoom-in head-btn icon",
                    title: "缩小",
                    onClick: _cache[1] || (_cache[1] = ($event) => zoomImage(0.5))
                  }, {
                    default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                      vue.createTextVNode(" zoom_in ")
                    ])),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(userView.UserButton), {
                    class: "zoom-out head-btn icon",
                    title: "放大",
                    onClick: _cache[2] || (_cache[2] = ($event) => zoomImage(-0.5))
                  }, {
                    default: vue.withCtx(() => _cache[7] || (_cache[7] = [
                      vue.createTextVNode(" zoom_out ")
                    ])),
                    _: 1
                  }),
                  vue.createElementVNode("span", _hoisted_2$7, vue.toDisplayString(vue.unref(_2).round(scale.value * 100) + "%"), 1),
                  _cache[12] || (_cache[12] = vue.createElementVNode("span", null, "|", -1)),
                  vue.createVNode(vue.unref(userView.UserButton), {
                    class: "turn-left head-btn icon",
                    title: "逆时针旋转",
                    onClick: _cache[3] || (_cache[3] = ($event) => rotateImage(-90))
                  }, {
                    default: vue.withCtx(() => _cache[8] || (_cache[8] = [
                      vue.createTextVNode(" undo ")
                    ])),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(userView.UserButton), {
                    class: "turn-right head-btn icon",
                    title: "顺时针旋转",
                    onClick: _cache[4] || (_cache[4] = ($event) => rotateImage(90))
                  }, {
                    default: vue.withCtx(() => _cache[9] || (_cache[9] = [
                      vue.createTextVNode(" redo ")
                    ])),
                    _: 1
                  }),
                  _cache[13] || (_cache[13] = vue.createElementVNode("span", null, "|", -1)),
                  vue.createVNode(vue.unref(userView.UserButton), {
                    class: "close head-btn icon",
                    title: "关闭",
                    onClick: unload
                  }, {
                    default: vue.withCtx(() => _cache[10] || (_cache[10] = [
                      vue.createTextVNode(" close ")
                    ])),
                    _: 1
                  })
                ], 2),
                imageArray.length > 1 ? (vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                  key: 0,
                  class: vue.normalizeClass(["control-panel back icon", { "hide": !showControls.value.left }]),
                  title: "上一张",
                  onClick: listBack
                }, {
                  default: vue.withCtx(() => _cache[14] || (_cache[14] = [
                    vue.createTextVNode(" chevron_left ")
                  ])),
                  _: 1
                }, 8, ["class"])) : vue.createCommentVNode("", true),
                imageArray.length > 1 ? (vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                  key: 1,
                  class: vue.normalizeClass(["control-panel forward icon", { "hide": !showControls.value.right }]),
                  title: "下一张",
                  onClick: listForward
                }, {
                  default: vue.withCtx(() => _cache[15] || (_cache[15] = [
                    vue.createTextVNode(" chevron_right ")
                  ])),
                  _: 1
                }, 8, ["class"])) : vue.createCommentVNode("", true),
                vue.createElementVNode("div", {
                  ref_key: "bottomPanel",
                  ref: bottomPanel,
                  class: vue.normalizeClass(["control-panel bottom-controls-wrapper", { "hide": !showControls.value.bottom }])
                }, [
                  vue.createElementVNode("div", _hoisted_3$6, [
                    vue.createElementVNode("div", {
                      ref_key: "thumbContainer",
                      ref: thumbContainer,
                      class: "thumb-container"
                    }, [
                      (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(thumbArray, (thumb, index2) => {
                        return vue.createVNode(vue.unref(userView.UserButton), {
                          class: vue.normalizeClass(["bottom-btn", { "selected": index2 === curr.value }]),
                          "no-border": "all"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createElementVNode("img", {
                              class: "image-list",
                              alt: "",
                              "data-lazyload": thumb,
                              onClick: ($event) => curr.value = index2
                            }, null, 8, _hoisted_4$5)
                          ]),
                          _: 2
                        }, 1032, ["class"]);
                      }), 64))
                    ], 512)
                  ]),
                  _cache[16] || (_cache[16] = vue.createElementVNode("div", { class: "bottom-panel-scroll-bar" }, null, -1))
                ], 2)
              ], 512)
            ]),
            _: 1
          }, 16);
        };
      }
    });
    const ImagesViewer = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-1afc9eaf"]]);
    function imagesViewer(opts) {
      renderDialog(vue.createVNode(ImagesViewer, opts, null));
    }
    const _hoisted_1$6 = { class: "main-content" };
    const _hoisted_2$6 = { class: "title" };
    const _hoisted_3$5 = {
      key: 0,
      class: "content"
    };
    const _hoisted_4$4 = {
      key: 0,
      class: "img-container"
    };
    const _hoisted_5$3 = ["src"];
    const _hoisted_6$2 = { class: "bottom-controls" };
    const _hoisted_7$1 = ["src"];
    const _hoisted_8$1 = { class: "author-info" };
    const _hoisted_9$1 = { class: "author-name" };
    const _hoisted_10$1 = { class: "post-time" };
    const _hoisted_11$1 = { class: "replies" };
    const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
      __name: "post-container",
      props: {
        post: {},
        lazyLoad: { type: Boolean, default: false },
        dynamic: { type: Boolean, default: false }
      },
      emits: ["assetsLoaded"],
      setup(__props, { emit: __emit }) {
        const props = __props;
        const emit = __emit;
        const postContainer = vue.ref();
        const isIntersecting = vue.ref(!props.lazyLoad);
        const loadedAssets = vue.ref(0);
        vue.onMounted(() => {
          if (!postContainer.value) return;
          if (props.post.images.length === 0) {
            emit("assetsLoaded", postContainer.value);
          }
          if (!props.lazyLoad) return;
          const iObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                isIntersecting.value = true;
                iObs.disconnect();
              }
            });
          });
          iObs.observe(postContainer.value.$el);
        });
        async function showImage(e, index2) {
          e.preventDefault();
          if (!_2.isNil(currentStorage.get(HOME_FEED_IMAGES)) && !_2.isNil(currentStorage.get(HOME_FEED_IMAGES)[+props.post.id])) {
            imagesViewer({
              content: currentStorage.get(HOME_FEED_IMAGES)[+props.post.id],
              defaultIndex: index2
            });
          } else {
            renderDialog(AwaitDialog, {
              unloadPred: () => !_2.isNil(currentStorage.get(HOME_FEED_IMAGES)) && !_2.isNil(currentStorage.get(HOME_FEED_IMAGES)[+props.post.id])
            }, {
              unloaded() {
                imagesViewer({
                  content: pictureList,
                  defaultIndex: index2
                });
              }
            });
            const response = await (await tiebaAPI.getThreadImages(+props.post.id, true)).json();
            const pictureList = _2(response.data.pic_list).keys().sortBy((key) => parseInt(key.slice(1))).map((key) => {
              const value = response.data.pic_list[key];
              return {
                original: highQualityImage.get() ? value.img.original.waterurl : value.img.screen.waterurl,
                thumbnail: value.img.medium.url
              };
            }).value();
            currentStorage.set(HOME_FEED_IMAGES, {
              ...currentStorage.get(HOME_FEED_IMAGES),
              [+props.post.id]: pictureList
            });
          }
        }
        function addLoadedPost() {
          loadedAssets.value += 1;
          if (loadedAssets.value === props.post.images.length) {
            emit("assetsLoaded", postContainer.value);
          }
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
            ref_key: "postContainer",
            ref: postContainer,
            "is-anchor": true,
            class: vue.normalizeClass(["post-container", { "dynamic": props.dynamic, "assets-loaded": loadedAssets.value === props.post.images.length }]),
            href: "/p/" + props.post.id,
            target: "_blank"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", null, [
                vue.createVNode(vue.unref(userView.UserButton), {
                  "is-anchor": true,
                  class: "forum-btn",
                  "shadow-border": true,
                  href: props.post.forum.href,
                  target: "_blank"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(props.post.forum.name + " 吧"), 1)
                  ]),
                  _: 1
                }, 8, ["href"])
              ]),
              vue.createElementVNode("div", _hoisted_1$6, [
                vue.createElementVNode("p", _hoisted_2$6, vue.toDisplayString(props.post.title), 1),
                props.post.content && props.post.content !== " " ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_3$5, vue.toDisplayString(props.post.content), 1)) : vue.createCommentVNode("", true)
              ]),
              props.post.images.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$4, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(props.post.images, (image, index2) => {
                  return vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                    class: "img-button",
                    onClick: ($event) => showImage($event, index2),
                    "no-border": "all"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("img", {
                        class: "post-img",
                        src: isIntersecting.value ? image.original : image.thumb,
                        onLoad: addLoadedPost
                      }, null, 40, _hoisted_5$3)
                    ]),
                    _: 2
                  }, 1032, ["onClick"]);
                }), 256))
              ])) : vue.createCommentVNode("", true),
              vue.createElementVNode("div", _hoisted_6$2, [
                vue.createVNode(vue.unref(userView.UserButton), {
                  class: "author",
                  "is-anchor": true,
                  href: props.post.author.href,
                  target: "_blank",
                  "shadow-border": true
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("img", {
                      class: "author-portrait",
                      src: isIntersecting.value ? vue.unref(tiebaAPI).URL_profile(props.post.author.portrait) : ""
                    }, null, 8, _hoisted_7$1),
                    vue.createElementVNode("div", _hoisted_8$1, [
                      vue.createElementVNode("div", _hoisted_9$1, vue.toDisplayString(props.post.author.name), 1),
                      vue.createElementVNode("div", _hoisted_10$1, vue.toDisplayString(props.post.time), 1)
                    ])
                  ]),
                  _: 1
                }, 8, ["href"]),
                vue.createElementVNode("div", _hoisted_11$1, vue.toDisplayString(props.post.replies), 1)
              ])
            ]),
            _: 1
          }, 8, ["href", "class"]);
        };
      }
    });
    const PostContainer = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-3551b9d3"]]);
    const maxFeeds = 1e3;
    const nextFeedsMargin = 320;
    const unreadTTL = 2;
    const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
      __name: "feeds-masonry",
      props: {
        initFeeds: { default: () => [] },
        showProgress: { type: Boolean, default: false }
      },
      setup(__props, { expose: __expose }) {
        const props = __props;
        const feeds = vue.ref([]);
        const masonryWrapper = vue.ref();
        const masonryContainer = vue.ref();
        const hasMoreFeeds = vue.ref(true);
        let currentLoadedFeeds = [];
        let isFetchingFeeds = false;
        const debAddFeeds = _2.debounce(addFeeds, 2e3, { leading: true });
        let flexMasonry;
        window.addEventListener("resize", _2.throttle(function() {
          flexMasonry.adjustWidth();
          if (flexMasonry.columns !== flexMasonry.calcColumns()) flexMasonry.exec();
        }, 100), { passive: true });
        vue.onMounted(() => {
          if (!masonryWrapper.value) return;
          if (!masonryContainer.value) return;
          debAddFeeds(props.initFeeds);
          renderMasonry();
          window.addEventListener("scroll", () => {
            if (isFetchingFeeds) return;
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const clientHeight = document.documentElement.clientHeight;
            if (scrollTop + clientHeight >= scrollHeight - nextFeedsMargin) {
              if (feeds.value.length < maxFeeds) {
                debAddFeeds();
              }
            }
          });
        });
        vue.watch(hasMoreFeeds, (newVal) => {
          if (!newVal) {
            userView.toast({
              message: "没有更多推送了",
              type: "warning"
            });
          }
        });
        async function addFeeds(newFeeds) {
          if (!newFeeds) newFeeds = [];
          if (isFetchingFeeds) return;
          isFetchingFeeds = true;
          if (newFeeds.length <= 0) {
            const response = await requestInstance(tiebaAPI.feedlist());
            if (response) {
              newFeeds = parsePostsFromString(response.data.html);
              hasMoreFeeds.value = !!response.data.has_more;
              const ruleList = shieldList.get();
              newFeeds = _2.filter(newFeeds, (feed) => {
                for (const rule of ruleList) {
                  if (matchShield(rule, feed.author.name, "username") || matchShield(rule, feed.title, "content") || matchShield(rule, feed.content, "content")) {
                    return false;
                  }
                }
                return true;
              });
              if (props.showProgress) {
                headerProgress({ calc: () => currentLoadedFeeds.length / ((newFeeds == null ? undefined : newFeeds.length) ?? 0) * 100 });
              }
            }
          }
          feeds.value.push(...newFeeds);
          await waitUntil(() => currentLoadedFeeds.length >= (newFeeds ?? []).length);
          renderMasonry().then(function() {
            unreadFeeds.set(newFeeds ? newFeeds : [], spawnOffsetTS(0, 0, 0, unreadTTL));
            currentLoadedFeeds.length = 0;
            isFetchingFeeds = false;
          });
        }
        async function renderMasonry() {
          await vue.nextTick();
          if (!masonryContainer.value) return;
          if (!flexMasonry) {
            flexMasonry = new FlexMasonry({
              container: masonryContainer.value,
              // items: ".post-elem.assets-loaded",
              columnWidth: 280,
              gap: 12,
              fixScrollOffset: true
            });
          } else {
            flexMasonry.append(".masonry-wrapper > .post-elem.assets-loaded", 60);
          }
        }
        function addToLoaded(payload) {
          currentLoadedFeeds.push(payload.$el);
        }
        function refresh() {
          if (!isFetchingFeeds) {
            feeds.value.length = 0;
            flexMasonry.clear();
            debAddFeeds();
          }
        }
        function refreshAndMove() {
          var _a;
          window.scrollTo({ top: (_a = masonryContainer.value) == null ? undefined : _a.offsetTop, behavior: "smooth" });
          refresh();
        }
        __expose({
          feeds,
          isFetchingFeeds,
          refresh,
          refreshAndMove
        });
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            ref_key: "masonryWrapper",
            ref: masonryWrapper,
            class: "masonry-wrapper"
          }, [
            vue.createElementVNode("div", {
              ref_key: "masonryContainer",
              ref: masonryContainer,
              class: "masonry-container"
            }, null, 512),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(feeds.value, (post) => {
              return vue.openBlock(), vue.createBlock(PostContainer, {
                key: post.id,
                post,
                class: "post-elem",
                dynamic: "",
                "shadow-border": "",
                onAssetsLoaded: addToLoaded
              }, null, 8, ["post"]);
            }), 128))
          ], 512);
        };
      }
    });
    const FeedsMasonry = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-d3bb286a"]]);
    const _hoisted_1$5 = { class: "index-wrapper" };
    const _hoisted_2$5 = { class: "grid-container" };
    const _hoisted_3$4 = { class: "head-controls" };
    const _hoisted_4$3 = { class: "search-controls" };
    const _hoisted_5$2 = { class: "search-suggestions" };
    const _hoisted_6$1 = ["src"];
    const _hoisted_7 = { class: "sugg-content" };
    const _hoisted_8 = { class: "sugg-title" };
    const _hoisted_9 = { class: "sugg-desc" };
    const _hoisted_10 = {
      key: 0,
      class: "block-wrapper followed-container"
    };
    const _hoisted_11 = { class: "block-controls followed" };
    const _hoisted_12 = { class: "block-container followed-list" };
    const _hoisted_13 = {
      key: 0,
      class: "icon signed"
    };
    const _hoisted_14 = { class: "forum-title" };
    const _hoisted_15 = {
      key: 1,
      class: "block-wrapper topic-container"
    };
    const _hoisted_16 = { class: "block-controls topics" };
    const _hoisted_17 = { class: "block-container topic-list" };
    const _hoisted_18 = ["src"];
    const _hoisted_19 = { class: "topic-content" };
    const _hoisted_20 = { class: "topic-title" };
    const _hoisted_21 = { class: "topic-name" };
    const _hoisted_22 = { class: "topic-desc" };
    const _hoisted_23 = { class: "block-controls feeds" };
    const _hoisted_24 = {
      key: 0,
      class: "empty-container"
    };
    const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
      __name: "index",
      setup(__props) {
        const initFeeds = vue.ref([]);
        const userInfo = vue.ref();
        const followed = vue.ref();
        const masonryContainer = vue.ref();
        const feedsContainer = vue.ref();
        const searchText = vue.ref("");
        const suggToggle = vue.ref(false);
        const suggestions = vue.ref([]);
        vue.ref(false);
        const configMenu = vue.ref();
        vue.ref(false);
        const profileMenu = vue.ref();
        const topicList = vue.ref([]);
        const feedsIntersecting = vue.ref(false);
        const feedsMasonry = vue.ref({});
        let signedForums = 0;
        initFeeds.value = unreadFeeds.get();
        vue.onMounted(async () => {
          init().then(() => {
            if (masonryContainer.value) {
              const iObs = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                  feedsIntersecting.value = true;
                } else {
                  feedsIntersecting.value = false;
                }
              });
              iObs.observe(masonryContainer.value);
            }
          });
        });
        window.addEventListener("focusin", (ev) => toggleSuggControls(ev));
        window.addEventListener("mousedown", (ev) => toggleSuggControls(ev));
        async function init() {
          userInfo.value = await (async () => {
            try {
              const userInfoResp = await (await tiebaAPI.userInfo()).json();
              if (userInfoResp) {
                return userInfoResp.data;
              }
            } catch (error) {
              userView.toast({
                message: errorMessage(error),
                type: "error",
                duration: 6e3
              });
            }
          })();
          configMenu.value = [
            {
              title: "设置",
              click() {
                renderDialog(Settings);
              }
            },
            "separator",
            {
              title: "源代码 (GitHub)",
              href: GithubRepo
            },
            {
              title: "源代码 (Gitee)",
              href: GiteeRepo
            }
          ];
          profileMenu.value = [
            {
              title: "登录",
              icon: "login",
              href: BaiduPassport
            }
          ];
          if (userInfo.value) {
            profileMenu.value = [
              {
                title: "我的收藏",
                icon: "star"
              },
              "separator",
              {
                title: "主页",
                icon: "home",
                href: tiebaAPI.URL_userHome(userInfo.value.user_portrait)
              },
              {
                title: "修改",
                icon: "settings"
              },
              "separator",
              {
                title: "退出登录",
                icon: "logout"
              }
            ];
          }
          if (userInfo.value) {
            getFollowedInstance();
          }
          requestInstance(tiebaAPI.topicList()).then((response) => {
            if (response) {
              topicList.value.push(...response.data.bang_topic.topic_list);
            }
          });
          if (!feedsContainer.value) return;
        }
        function toggleSuggControls(e) {
          const el = e.target;
          const pt = findParent(el, "search-controls");
          if (pt) {
            suggToggle.value = true;
          } else {
            suggToggle.value = false;
          }
        }
        async function loadSuggestions(query) {
          const response = await tiebaAPI.suggestions(query);
          if (response.ok) {
            response.json().then((value) => {
              if (!query || query === "") {
                const topicList2 = value.hottopic_list.search_data;
                if (topicList2)
                  suggestions.value = _2.map(topicList2, (topic) => ({
                    image: topic.topic_pic,
                    title: topic.topic_name,
                    desc: topic.topic_desc,
                    href: topic.topic_url
                  }));
              } else {
                const matchList = value.query_match.search_data;
                if (matchList)
                  suggestions.value = _2.map(matchList, (match) => ({
                    image: match.fpic,
                    title: match.fname,
                    desc: match.forum_desc,
                    href: tiebaAPI.URL_forum(match.fname)
                  }));
              }
            });
          }
        }
        function searchBoxFocus() {
          if (suggestions.value.length <= 0) {
            loadSuggestions().then(() => {
              suggToggle.value = true;
            });
          } else {
            suggToggle.value = true;
          }
        }
        function searchTextChange() {
          loadSuggestions(searchText.value);
        }
        const searchMatch = _2.debounce(searchTextChange, 500);
        function getFollowedInstance() {
          requestInstance(tiebaAPI.followedForums()).then((response) => {
            if (response) {
              signedForums = 0;
              followed.value = response.data;
              _2.forEach(followed.value.like_forum, (forum) => {
                if (forum.is_sign === 1) signedForums++;
              });
              followed.value.like_forum.sort((a, b) => parseInt(b.user_exp) - parseInt(a.user_exp));
            }
          });
        }
        async function oneKeySignInstance() {
          userView.messageBox({
            title: "一键签到",
            content: "需要注意，Web端签到获取到的经验远少于移动端，建议使用其他设备进行签到。",
            type: "okCancel"
          }).then((tag) => {
            if (tag === "positive") {
              requestInstance(tiebaAPI.oneKeySign()).then((response) => {
                userView.toast({
                  message: `本次共签到成功 ${response.data.signedForumAmount} 个吧，未签到 ${response.data.unsignedForumAmount} 个吧，签到失败 ${response.data.signedForumAmountFail} 个吧，共获得 ${response.data.gradeNoVip} 经验。`,
                  type: "check",
                  blurEffect: true
                });
                getFollowedInstance();
              });
            }
          });
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [
            vue.createElementVNode("div", _hoisted_2$5, [
              vue.createElementVNode("div", _hoisted_3$4, [
                vue.createElementVNode("div", _hoisted_4$3, [
                  vue.createVNode(vue.unref(userView.UserTextbox), {
                    modelValue: searchText.value,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchText.value = $event),
                    class: "search-box",
                    placeholder: "搜索 贴吧",
                    autocomplete: "none",
                    onFocus: searchBoxFocus,
                    onInput: vue.unref(searchMatch)
                  }, null, 8, ["modelValue", "onInput"]),
                  vue.createVNode(vue.unref(userView.UserButton), {
                    class: "search-button",
                    "theme-style": true,
                    "no-border": ""
                  }, {
                    default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                      vue.createTextVNode("搜索")
                    ])),
                    _: 1
                  }),
                  vue.withDirectives(vue.createElementVNode("div", _hoisted_5$2, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(suggestions.value, (sugg) => {
                      return vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                        "is-anchor": true,
                        class: "search-elem",
                        href: sugg.href,
                        target: "_blank",
                        "no-border": ""
                      }, {
                        default: vue.withCtx(() => [
                          vue.createElementVNode("img", {
                            class: "sugg-img",
                            src: sugg.image,
                            alt: ""
                          }, null, 8, _hoisted_6$1),
                          vue.createElementVNode("div", _hoisted_7, [
                            vue.createElementVNode("p", _hoisted_8, vue.toDisplayString(sugg.title), 1),
                            vue.createElementVNode("p", _hoisted_9, vue.toDisplayString(sugg.desc), 1)
                          ])
                        ]),
                        _: 2
                      }, 1032, ["href"]);
                    }), 256))
                  ], 512), [
                    [vue.vShow, suggToggle.value && suggestions.value.length > 0]
                  ])
                ])
              ]),
              followed.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10, [
                vue.createElementVNode("div", _hoisted_11, [
                  _cache[4] || (_cache[4] = vue.createElementVNode("p", { class: "block-title" }, "关注的吧", -1)),
                  vue.createVNode(BlockPanel, { class: "signed-count left-align" }, {
                    default: vue.withCtx(() => {
                      var _a;
                      return [
                        vue.createTextVNode(vue.toDisplayString(vue.unref(signedForums)) + " / " + vue.toDisplayString((_a = followed.value) == null ? undefined : _a.like_forum.length), 1)
                      ];
                    }),
                    _: 1
                  }),
                  vue.createVNode(BlockPanel, { class: "followed" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(userView.UserButton), {
                        class: "panel-btn icon sign-btn",
                        onClick: oneKeySignInstance,
                        "unset-background": "",
                        "no-border": ""
                      }, {
                        default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                          vue.createTextVNode(" task_alt")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(vue.unref(userView.UserButton), {
                        class: "panel-btn icon settings",
                        "unset-background": "",
                        "no-border": ""
                      }, {
                        default: vue.withCtx(() => _cache[3] || (_cache[3] = [
                          vue.createTextVNode("settings")
                        ])),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                vue.createElementVNode("div", _hoisted_12, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(followed.value.like_forum, (forum) => {
                    return vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                      "is-anchor": true,
                      class: "followed-btn",
                      "shadow-border": true,
                      href: vue.unref(tiebaAPI).URL_forum(forum.forum_name),
                      target: "_blank",
                      "no-border": ""
                    }, {
                      default: vue.withCtx(() => [
                        forum.is_sign === 1 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, "check")) : vue.createCommentVNode("", true),
                        vue.createElementVNode("div", _hoisted_14, vue.toDisplayString(forum.forum_name), 1),
                        vue.createElementVNode("div", {
                          class: vue.normalizeClass(["forum-level", "level-" + vue.unref(levelToClass)(forum.user_level)])
                        }, vue.toDisplayString(forum.user_level), 3)
                      ]),
                      _: 2
                    }, 1032, ["href"]);
                  }), 256))
                ])
              ])) : vue.createCommentVNode("", true),
              topicList.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_15, [
                vue.createElementVNode("div", _hoisted_16, [
                  _cache[8] || (_cache[8] = vue.createElementVNode("p", { class: "block-title" }, "贴吧热议", -1)),
                  vue.createVNode(BlockPanel, { class: "topics" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(userView.UserButton), {
                        class: "panel-btn icon switch",
                        "unset-background": true,
                        "no-border": ""
                      }, {
                        default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                          vue.createTextVNode("tune")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(vue.unref(userView.UserButton), {
                        class: "panel-btn icon more",
                        "unset-background": true,
                        "no-border": ""
                      }, {
                        default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                          vue.createTextVNode("more_horiz ")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(vue.unref(userView.UserButton), {
                        class: "panel-btn icon settings",
                        "unset-background": true,
                        "no-border": ""
                      }, {
                        default: vue.withCtx(() => _cache[7] || (_cache[7] = [
                          vue.createTextVNode("settings ")
                        ])),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                vue.createElementVNode("div", _hoisted_17, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(_2).take(topicList.value, 10), (topic) => {
                    return vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                      "is-anchor": true,
                      class: "topic-btn",
                      "shadow-border": true,
                      href: topic.topic_url,
                      target: "_blank"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("img", {
                          class: "topic-img",
                          src: topic.topic_pic
                        }, null, 8, _hoisted_18),
                        vue.createElementVNode("div", _hoisted_19, [
                          vue.createElementVNode("div", _hoisted_20, [
                            vue.createElementVNode("div", {
                              class: vue.normalizeClass("topic-rank-" + topic.idx_num)
                            }, vue.toDisplayString(topic.idx_num), 3),
                            vue.createElementVNode("div", _hoisted_21, vue.toDisplayString(vue.unref(_2).unescape(topic.topic_name)), 1)
                          ]),
                          vue.createElementVNode("div", _hoisted_22, vue.toDisplayString(vue.unref(_2).unescape(topic.topic_desc)), 1)
                        ])
                      ]),
                      _: 2
                    }, 1032, ["href"]);
                  }), 256))
                ])
              ])) : vue.createCommentVNode("", true),
              _cache[9] || (_cache[9] = vue.createElementVNode("div", { id: "carousel_wrap" }, null, -1))
            ]),
            vue.createElementVNode("div", {
              ref_key: "masonryContainer",
              ref: masonryContainer,
              class: "masonry-container"
            }, [
              vue.createElementVNode("div", _hoisted_23, [
                _cache[12] || (_cache[12] = vue.createElementVNode("p", { class: "block-title" }, "推送", -1)),
                feedsMasonry.value && feedsMasonry.value.feeds && (feedsMasonry.value.feeds.length > 0 || feedsMasonry.value.isFetchingFeeds) ? (vue.openBlock(), vue.createBlock(BlockPanel, { key: 0 }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(userView.UserButton), {
                      class: "panel-button icon refresh",
                      "unset-background": "",
                      onClick: feedsMasonry.value.refreshAndMove,
                      "no-border": ""
                    }, {
                      default: vue.withCtx(() => _cache[10] || (_cache[10] = [
                        vue.createTextVNode("refresh ")
                      ])),
                      _: 1
                    }, 8, ["onClick"]),
                    vue.createVNode(vue.unref(userView.UserButton), {
                      class: "panel-button icon settings",
                      "unset-background": "",
                      "no-border": ""
                    }, {
                      default: vue.withCtx(() => _cache[11] || (_cache[11] = [
                        vue.createTextVNode("settings")
                      ])),
                      _: 1
                    })
                  ]),
                  _: 1
                })) : vue.createCommentVNode("", true)
              ]),
              vue.createVNode(FeedsMasonry, {
                ref_key: "feedsMasonry",
                ref: feedsMasonry,
                "init-feeds": initFeeds.value,
                "show-progress": ""
              }, null, 8, ["init-feeds"]),
              initFeeds.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_24, _cache[13] || (_cache[13] = [
                vue.createElementVNode("p", { class: "no-feed-content" }, "没有更多了", -1)
              ]))) : vue.createCommentVNode("", true)
            ], 512)
          ]);
        };
      }
    });
    const Home = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-36c4a869"]]);
    async function index$e() {
      if (currentPageType() !== "index") return;
      if (!pageExtension.get().index) return;
      const bodyMask = _GM_addStyle(parseMultiCSS({
        "body": {
          display: "none"
        }
      }));
      const wrap = await asyncdom(".wrap1");
      renderPage(Home);
      wrap.remove();
      bodyMask.remove();
    }
    const _hoisted_1$4 = { class: "pager-wrapper" };
    const _hoisted_2$4 = {
      key: 0,
      class: "pager-button-container"
    };
    const _hoisted_3$3 = {
      key: 1,
      class: "pager-separactor"
    };
    const _hoisted_4$2 = {
      key: 2,
      class: "jumper-container"
    };
    const _hoisted_5$1 = { class: "tail-slot" };
    const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
      __name: "pager",
      props: {
        total: {},
        current: {},
        jumperValue: {},
        maxDisplay: { default: 9 },
        fill: { type: Boolean, default: false },
        showPagers: { type: Boolean, default: true },
        head: { type: Boolean, default: true },
        tail: { type: Boolean, default: true },
        jumper: { type: Boolean, default: true },
        pagerClick: {},
        headClick: {},
        tailClick: {},
        prevClick: {},
        nextClick: {},
        pagerChange: {},
        jumperEnter: {}
      },
      emits: [
        "update:current",
        "update:jumperValue"
      ],
      setup(__props, { expose: __expose, emit: __emit }) {
        const props = __props;
        const current = vue.ref(props.current);
        const jumperValue = vue.ref(props.jumperValue ?? "");
        const emit = __emit;
        const pagerCount = Math.min(props.maxDisplay, props.total);
        const pagerStart = vue.computed(
          () => current.value + pagerCount / 2 > props.total ? props.total - pagerCount + 1 : Math.max(1, current.value - Math.floor(props.maxDisplay / 2))
        );
        const pagerEnd = vue.computed(() => Math.min(props.total, pagerStart.value + props.maxDisplay - 1) + 1);
        __expose({
          current,
          jumperValue
        });
        function pagerChange(type, page) {
          if (props.pagerChange && page !== current.value)
            props.pagerChange(page);
          current.value = page;
          emit("update:current", page);
          switch (type) {
            case "page":
              if (props.pagerClick) props.pagerClick(page);
              break;
            case "head":
              if (props.headClick) props.headClick();
              break;
            case "tail":
              if (props.tailClick) props.tailClick();
              break;
            case "prev":
              if (props.prevClick) props.prevClick(page);
              break;
            case "next":
              if (props.nextClick) props.nextClick(page);
              break;
          }
        }
        function handleJumperEnter() {
          if (!jumperValue.value) return;
          const page = +jumperValue.value;
          if (page < 1 || page > props.total) return;
          pagerChange(null, page);
          if (props.jumperEnter) props.jumperEnter(page);
          jumperValue.value = "";
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
            _ctx.showPagers ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$4, [
              vue.withDirectives(vue.createVNode(vue.unref(userView.UserButton), {
                class: "pager-button pager-head-button",
                "no-border": "",
                onClick: _cache[0] || (_cache[0] = ($event) => pagerChange("head", 1))
              }, {
                default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                  vue.createTextVNode("1")
                ])),
                _: 1
              }, 512), [
                [vue.vShow, current.value > Math.ceil(vue.unref(pagerCount) / 2) && current.value > 1 && _ctx.total > vue.unref(pagerCount)]
              ]),
              vue.withDirectives(vue.createVNode(vue.unref(userView.UserButton), {
                class: "pager-button pager-back-button icon",
                "no-border": "",
                onClick: _cache[1] || (_cache[1] = ($event) => pagerChange("prev", Math.max(1, current.value - vue.unref(pagerCount))))
              }, {
                default: vue.withCtx(() => _cache[7] || (_cache[7] = [
                  vue.createTextVNode(" keyboard_double_arrow_left ")
                ])),
                _: 1
              }, 512), [
                [vue.vShow, current.value > Math.ceil(vue.unref(pagerCount) / 2) && current.value > 1 && _ctx.total > vue.unref(pagerCount)]
              ]),
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(_2).range(pagerStart.value, pagerEnd.value), (displayNumber, i) => {
                return vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                  key: i,
                  class: vue.normalizeClass(["pager-button", { "fill": _ctx.fill, "curr-pager-button": displayNumber === current.value }]),
                  onClick: ($event) => pagerChange("page", displayNumber),
                  "no-border": "all",
                  disabled: displayNumber === current.value
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(displayNumber), 1)
                  ]),
                  _: 2
                }, 1032, ["class", "onClick", "disabled"]);
              }), 128)),
              vue.withDirectives(vue.createVNode(vue.unref(userView.UserButton), {
                class: "pager-button pager-forward-button icon",
                "no-border": "",
                onClick: _cache[2] || (_cache[2] = ($event) => pagerChange("next", Math.min(_ctx.total, current.value + vue.unref(pagerCount))))
              }, {
                default: vue.withCtx(() => _cache[8] || (_cache[8] = [
                  vue.createTextVNode(" keyboard_double_arrow_right ")
                ])),
                _: 1
              }, 512), [
                [vue.vShow, _ctx.total - vue.unref(pagerCount) > 1 && _ctx.total - current.value > vue.unref(pagerCount) / 2]
              ]),
              vue.withDirectives(vue.createVNode(vue.unref(userView.UserButton), {
                class: "pager-button pager-tail-button",
                "no-border": "",
                onClick: _cache[3] || (_cache[3] = ($event) => pagerChange("tail", _ctx.total))
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.total), 1)
                ]),
                _: 1
              }, 512), [
                [vue.vShow, _ctx.tail && _ctx.total - vue.unref(pagerCount) > 1 && _ctx.total - current.value > vue.unref(pagerCount) / 2]
              ])
            ])) : vue.createCommentVNode("", true),
            _ctx.showPagers && _ctx.jumper ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$3, "|")) : vue.createCommentVNode("", true),
            _ctx.showPagers && _ctx.jumper ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$2, [
              _cache[9] || (_cache[9] = vue.createTextVNode(" 转到 ")),
              vue.createVNode(vue.unref(userView.UserTextbox), {
                modelValue: jumperValue.value,
                "onUpdate:modelValue": [
                  _cache[4] || (_cache[4] = ($event) => jumperValue.value = $event),
                  _cache[5] || (_cache[5] = ($event) => emit("update:jumperValue", jumperValue.value))
                ],
                class: "jumper",
                onKeydown: vue.withKeys(handleJumperEnter, ["enter"])
              }, null, 8, ["modelValue"]),
              _cache[10] || (_cache[10] = vue.createTextVNode(" 页 "))
            ])) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_5$1, [
              vue.renderSlot(_ctx.$slots, "tailSlot", {}, undefined, true)
            ])
          ]);
        };
      }
    });
    const Pager$1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-706b517f"]]);
    const _hoisted_1$3 = {
      id: "thread-editor"
    };
    const _hoisted_2$3 = {
      id: "thread-editor-toolbar"
    };
    const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
      __name: "thread-editor",
      props: {
        ueditor: {},
        type: {
          default: "thread"
        }
      },
      setup(__props) {
        const props = __props;
        const dialogOpts = {
          modal: true,
          force: true,
          blurEffect: false,
          animation: true,
          lockScroll: true,
          containerStyle: {
            position: "fixed",
            width: "100%",
            maxWidth: "var(--content-max)",
            bottom: "0",
            marginBottom: "0",
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "0"
          },
          renderAnimation: "kf-slide-in var(--default-duration)",
          unloadAnimation: "kf-slide-out var(--default-duration)"
        };
        const dialog = vue.ref();
        const editorSlot = vue.ref();
        const originParent = vue.ref();
        vue.onMounted(async function() {
          var _a;
          await vue.nextTick();
          if (!editorSlot.value) return;
          originParent.value = props.ueditor.parentElement;
          editorSlot.value.appendChild(props.ueditor);
          const toolbar = await asyncdom(".edui-toolbar");
          const editorBody = await asyncdom(".edui-editor-body");
          if (toolbar.compareDocumentPosition(editorBody) & Node.DOCUMENT_POSITION_FOLLOWING) {
            (_a = toolbar.parentNode) == null ? undefined : _a.insertBefore(editorBody, toolbar);
          }
          (await asyncdom("#ueditor_replace")).focus();
        });
        async function submit() {
          (await asyncdom(".j_submit")).click();
          unload();
        }
        async function unload() {
          var _a;
          if (!originParent.value) return;
          if (!editorSlot.value) return;
          originParent.value.appendChild(await asyncdom(".edui-container"));
          (_a = dialog.value) == null ? undefined : _a.unload();
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createBlock(vue.unref(userView.UserDialog), vue.mergeProps({
            ref_key: "dialog",
            ref: dialog
          }, dialogOpts), {
            default: vue.withCtx(() => [vue.createElementVNode("div", _hoisted_1$3, [vue.createVNode(vue.unref(userView.UserButton), {
              "aria-label": "关闭",
              id: "thread-editor-exit",
              class: "icon",
              "shadow-border": "",
              onClick: unload
            }, {
              default: vue.withCtx(() => _cache[0] || (_cache[0] = [vue.createTextVNode("close ")])),
              _: 1
            }), _ctx.type === "thread" ? (vue.openBlock(), vue.createBlock(vue.unref(userView.UserTextbox), {
              key: 0,
              class: "title-editor",
              placeholder: "输入标题",
              "lodash-style": ""
            })) : vue.createCommentVNode("", true), vue.createElementVNode("div", {
              ref_key: "editorSlot",
              ref: editorSlot,
              id: "thread-editor-slot"
            }, null, 512), vue.createElementVNode("div", _hoisted_2$3, [vue.createVNode(vue.unref(userView.UserButton), {
              id: "thread-editor-submit",
              "shadow-border": "",
              "theme-style": "",
              onClick: submit
            }, {
              default: vue.withCtx(() => _cache[1] || (_cache[1] = [vue.createTextVNode("发表")])),
              _: 1
            })])])]),
            _: 1
          }, 16);
        };
      }
    });
    const ThreadEditor = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-dbefc831"]]);
    const _hoisted_1$2 = { class: "toggle-panel" };
    const _hoisted_2$2 = { class: "toggle-container" };
    const _hoisted_3$2 = { class: "toggle-name" };
    const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
      __name: "toggle-panel",
      props: {
        toggles: {}
      },
      setup(__props) {
        const props = __props;
        const dialogOpts = {
          contentStyle: {
            maxWidth: "60vh",
            maxHeight: "60vh"
          }
        };
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createBlock(vue.unref(userView.UserDialog), vue.normalizeProps(vue.guardReactiveProps(dialogOpts)), {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1$2, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(props.toggles, (toggle) => {
                  return vue.openBlock(), vue.createElementBlock("div", _hoisted_2$2, [
                    vue.createVNode(vue.unref(userView.UserToggle), {
                      class: "panel-button",
                      "model-value": toggle.defaultValue ?? false,
                      "icon-type": "",
                      "shadow-border": "",
                      onClick: toggle.event
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(toggle.icon), 1)
                      ]),
                      _: 2
                    }, 1032, ["model-value", "onClick"]),
                    vue.createElementVNode("div", _hoisted_3$2, vue.toDisplayString(toggle.name), 1)
                  ]);
                }), 256))
              ])
            ]),
            _: 1
          }, 16);
        };
      }
    });
    const TogglePanel = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-ae42008f"]]);
    class TiebaComponent {
      constructor(selector, parent) {
        __publicField(this, "selector");
        __publicField(this, "parent");
        this.selector = selector;
        this.parent = parent;
      }
      get() {
        if (!this.parent) {
          return dom(this.selector, [])[0];
        }
        return dom(this.selector, this.parent, [])[0];
      }
    }
    const floatButtonMap = {
      "auxiliary": "tbui_fbar_auxiliaryCare",
      "down": "tbui_fbar_down",
      "post": "tbui_fbar_post",
      "props": "tbui_fbar_props",
      "tsukkomi": "tbui_fbar_tsukkomi",
      "share": "tbui_fbar_share",
      "favor": "tbui_fbar_favor",
      "feedback": "tbui_fbar_feedback",
      "top": "tbui_fbar_top",
      "other": "*"
    };
    class FloatBar extends TiebaComponent {
      /**
       * 获取当前页面的 float buttons
       * @returns FloatBarButton[]
       */
      buttons() {
        if (!this.get()) return [];
        return Array.from(dom(".tbui_aside_fbar_button", floatBar.get(), [])).map((el) => ({
          el,
          type: function() {
            for (let i = 0; i < el.classList.length; i++) {
              const cls = el.classList[i];
              if (!cls.includes("tbui_fbar_")) continue;
              const key = _2.findKey(floatButtonMap, (value) => value === cls);
              if (key) {
                return key;
              }
            }
            return "other";
          }()
        }));
      }
      add(type, event, className, icon, index2 = 0) {
        const anchor = domrd("a", {
          href: "javascript:;"
        });
        const el = domrd("li", {
          class: "tbui_aside_fbar_button"
        }, [anchor]);
        el.addEventListener("click", event);
        if (type !== "other") {
          el.classList.add(floatButtonMap[type]);
        }
        if (className) el.classList.add(className);
        floatBar.get().insertBefore(el, floatBar.get().children[index2]);
        setFloatButtonIcon(anchor, icon);
        return {
          el,
          type
        };
        function setFloatButtonIcon(el2, icon2) {
          el2.classList.add("icon");
          el2.classList.add("tbui_aside_fbar_button");
          el2.innerHTML = icon2 ? icon2 : "";
        }
      }
      remove(param) {
        switch (typeof param) {
          case "string": {
            const el = dom(param, floatBar.get());
            el == null ? undefined : el.remove();
            break;
          }
          case "number": {
            const el = floatBar.get().children[param];
            el.remove();
            break;
          }
        }
      }
    }
    const floatBar = new FloatBar(".tbui_aside_float_bar");
    class Pager extends TiebaComponent {
      allPagerButtons() {
        return dom("a, .tP", this.get(), []);
      }
      getPagerButton(pagerType, index2 = 0) {
        const allButtons = this.allPagerButtons();
        switch (pagerType) {
          case "prev": {
            return this.findMatchingButton(allButtons, "上一页");
          }
          case "next": {
            return this.findMatchingButton(allButtons, "下一页", true);
          }
          case "head": {
            return this.findMatchingButton(allButtons, "首页");
          }
          case "tail": {
            return this.findMatchingButton(allButtons, "尾页", true);
          }
          case "page": {
            let count = 0;
            for (const el of allButtons) {
              if (/^\d+$/.test(el.innerText)) {
                if (count === index2 && el instanceof HTMLAnchorElement) {
                  return el;
                }
                count++;
              }
            }
            return null;
          }
          default:
            return null;
        }
      }
      getByPage(page) {
        return this.findMatchingButton(this.allPagerButtons(), page.toString());
      }
      jumpTo(page) {
        const permKeys = ["pn", "see_lz"];
        const params = new URLSearchParams(location.search);
        const newParams = new URLSearchParams();
        for (const [key, value] of params) {
          if (_2.includes(permKeys, key)) {
            newParams.set(key, value);
          }
        }
        const url = new URL(location.href);
        url.search = newParams.toString();
        history.pushState({}, "", url);
        const jumperBox = dom("#jumpPage4, #jumpPage6");
        const jumperButton = dom("#pager_go4, #pager_go6");
        if (jumperBox) jumperBox.value = page.toString();
        jumperButton == null ? undefined : jumperButton.click();
      }
      findMatchingButton(buttons, text, reverse = false) {
        const iterator = reverse ? Array.from(buttons).reverse() : buttons;
        for (const el of iterator) {
          if (el.innerText === text) {
            return el;
          }
        }
        return null;
      }
    }
    const pager = new Pager(".l_pager");
    const commentsStyle = '@charset "UTF-8";\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .at, .core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_main a, .core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .lzl_more a, .core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .j_pager a, .core_reply .core_reply_wrapper .core_reply_content .btn-sub, .core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper .lzl_insertsmiley_holder,\n.core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper .lzl_panel_submit {\n  color: var(--tieba-theme-fore);\n  cursor: pointer;\n  -webkit-text-decoration: none;\n  text-decoration: none;\n  transition: var(--default-duration);\n}\n\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_op_list a, .core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_jb .lzl_jb_in, .core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_s_r {\n  cursor: pointer;\n  -webkit-text-decoration: none;\n  text-decoration: none;\n  transition: var(--default-duration);\n}\n\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .at:hover, .core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_main a:hover, .core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .lzl_more a:hover, .core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .j_pager a:hover, .core_reply .core_reply_wrapper .core_reply_content .btn-sub:hover, .core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper .lzl_insertsmiley_holder:hover,\n.core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper .lzl_panel_submit:hover {\n  background-color: var(--default-hover);\n}\n\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_op_list a:hover, .core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_jb .lzl_jb_in:hover, .core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_s_r:hover {\n  color: var(--tieba-theme-fore);\n}\n\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .at:active, .core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_main a:active, .core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .lzl_more a:active, .core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .j_pager a:active, .core_reply .core_reply_wrapper .core_reply_content .btn-sub:active, .core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper .lzl_insertsmiley_holder:active,\n.core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper .lzl_panel_submit:active {\n  background-color: var(--default-active);\n}\n\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_op_list a:active, .core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_jb .lzl_jb_in:active, .core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_s_r:active {\n  color: var(--tieba-theme-active);\n}\n\n.core_reply {\n  margin-right: 0;\n  margin-right: initial;\n}\n.core_reply .core_reply_wrapper {\n  border: none !important;\n  background-color: transparent !important;\n  background-color: initial !important;\n}\n.core_reply .core_reply_wrapper {\n  width: auto;\n  max-width: 840px;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post {\n  margin-bottom: 12px;\n  animation: kf-slide-in var(--default-duration);\n  transform-origin: bottom;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post:not(.first_no_border) {\n  padding-top: 0;\n  margin-top: 0;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .at {\n  padding: 2px 0;\n  color: var(--default-fore);\n  font-size: 14px;\n  font-weight: var(--font-weight-bold);\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_main {\n  font-size: 15px;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_main img {\n  vertical-align: text-bottom;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply {\n  display: flex;\n  align-items: center;\n  font-size: 13px;\n  line-height: 28px;\n  text-align: justify;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_op_list {\n  color: var(--light-fore);\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_op_list a {\n  color: var(--light-fore);\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_jb {\n  order: 1;\n  margin-left: auto;\n  color: var(--light-fore);\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_jb .lzl_jb_in {\n  padding: 0;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_single_post .lzl_cnt .lzl_content_reply .lzl_s_r {\n  padding: 0;\n  margin-left: 8px;\n  color: var(--light-fore);\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager {\n  padding: 0;\n  margin-top: -12px;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .lzl_more {\n  font-size: 13px;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .j_pager {\n  display: flex;\n  align-items: center;\n  font-family: var(--code-zh);\n  font-size: 13px;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .j_pager .tP {\n  width: auto;\n  color: var(--tieba-theme-fore);\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .j_pager a {\n  color: var(--light-fore);\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_li_pager .j_pager a:hover {\n  color: var(--tieba-theme-fore);\n}\n.core_reply .core_reply_wrapper .core_reply_content .btn-sub {\n  padding: 4px 0;\n  border-radius: 0;\n  background: none;\n  font-size: 13px;\n}\n.core_reply .core_reply_wrapper .core_reply_content .edui-container {\n  width: auto !important;\n}\n.core_reply .core_reply_wrapper .core_reply_content .edui-container {\n  max-height: 64px;\n}\n.core_reply .core_reply_wrapper .core_reply_content .edui-container .edui-editor-body {\n  height: -moz-max-content !important;\n  height: max-content !important;\n}\n.core_reply .core_reply_wrapper .core_reply_content .edui-container .edui-editor-body {\n  overflow: hidden;\n  max-height: 72px;\n  padding: 6px;\n  border-radius: 6px;\n}\n.core_reply .core_reply_wrapper .core_reply_content .edui-container .edui-editor-body .edui-body-container {\n  min-height: 16px !important;\n}\n.core_reply .core_reply_wrapper .core_reply_content .edui-container .edui-editor-body .edui-body-container {\n  max-height: 64px;\n  padding-left: 0;\n  border-radius: 6px;\n  font-size: 14px;\n  overflow-y: auto;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_panel_error {\n  color: var(--error-color);\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper {\n  width: 100%;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper .lzl_insertsmiley_holder,\n.core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper .lzl_panel_submit {\n  width: -moz-max-content;\n  width: max-content;\n  height: -moz-max-content;\n  height: max-content;\n  padding: 0 8px;\n  background: none;\n  font-size: 12px;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper .lzl_panel_smile {\n  width: -moz-max-content;\n  width: max-content;\n  height: -moz-max-content;\n  height: max-content;\n  margin: 0;\n}\n.core_reply .core_reply_wrapper .core_reply_content .lzl_panel_wrapper .lzl_panel_smile .lzl_insertsmiley_holder::after {\n  content: "😊表情";\n}';
    const compactStyle = "body[compact-layout] #j_p_postlist {\n  gap: 0;\n}\nbody[compact-layout] .core_reply_content li.first_no_border {\n  margin-top: -4px;\n}\nbody[compact-layout] .core_reply .core_reply_wrapper .core_reply_content .lzl_single_post {\n  margin-bottom: 0;\n}";
    function threadParser() {
      var _a;
      const postWrappers = dom(".l_post", []);
      const contents = dom(".d_post_content", []);
      const dAuthors = dom(".d_author", []);
      const avatars = dom(".p_author_face", []);
      const nameAnchors = dom(".p_author_name", []);
      const levels = dom(".d_badge_lv", []);
      const badgeTitles = dom(".d_badge_title", []);
      const replyButtons = dom(".lzl_link_unfold", []);
      const locations = _2.map(dom(".post-tail-wrap span:first-child, .ip-location", []), (el) => el.innerText);
      const platforms = _2.map(dom(".tail-info a, .p_tail_wap", []), (el) => el.innerText);
      const floors = _2.map(dom(".j_jb_ele + .tail-info + .tail-info, .p_tail li:first-child span", []), (el) => el.innerText);
      const times = _2.map(dom(".post-tail-wrap span:nth-last-child(2), .p_tail li:last-child span", []), (el) => el.innerText);
      const threadContents = [];
      for (let i = 0; i < contents.length; i++) {
        contents[i].classList.add("floor-content");
        avatars[i].classList.add("floor-avatar");
        nameAnchors[i].classList.add("floor-name");
        threadContents.push({
          post: contents[i],
          replyButton: replyButtons[i],
          dataField: _2.defaults(postWrappers[i].getAttribute("data-field"), ""),
          isLouzhu: !!dom(".louzhubiaoshi_wrap", dAuthors[i]),
          profile: {
            avatar: avatars[i],
            nameAnchor: nameAnchors[i],
            level: parseInt(levels[i].innerText),
            badgeTitle: badgeTitles[i].innerText
          },
          tail: {
            location: locations[i],
            platform: platforms[i],
            floor: floors[i],
            time: times[i]
          }
        });
      }
      const thread2 = {
        displayWrapper: dom(".wrap2", [])[0],
        title: PageData.thread.title,
        reply: +(((_a = dom(".l_reply_num span:nth-child(1)")) == null ? undefined : _a.innerText) ?? 0),
        pages: PageData.pager.total_page,
        lzOnlyButton: dom("#lzonly_cntn", [])[0],
        favorButton: dom(".j_favor", [])[0],
        cotents: threadContents,
        forum: {
          info: {
            name: PageData.forum.forum_name
            // followersDisplay: DOMS(true, ".card_menNum", "span").innerText,
            // postsDisplay: DOMS(true, ".card_infoNum", "span").innerText,
          },
          components: {
            nameAnchor: dom(".card_title_fname", [])[0],
            iconContainer: dom(".card_head a, .plat_picbox", [])[0],
            followButton: dom(".card_head .focus_btn", [])[0],
            signButton: dom(".j_sign_box", [])[0]
          }
        },
        pager: {
          listPager: dom(".pb_list_pager", [])[0],
          jumper: {
            textbox: dom(".jump_input_bright", [])[0],
            submitButton: dom(".jump_btn_bright", [])[0]
          }
        }
      };
      return thread2;
    }
    const threadStyle = '.post-tail-wrap .p_reply,\n.core_reply_tail:not(.clearfix) .p_reply, .post-tail-wrap .p_reply .lzl_link_fold,\n.core_reply_tail:not(.clearfix) .p_reply .lzl_link_fold, .content-wrapper .author-container .floor-name, .d_post_content a,\n.lzl_cnt .lzl_content_main a:not(.at) {\n  color: var(--tieba-theme-fore);\n  cursor: pointer;\n  -webkit-text-decoration: none;\n  text-decoration: none;\n  transition: var(--default-duration);\n}\n\n.d_post_content a,\n.lzl_cnt .lzl_content_main a:not(.at) {\n  text-decoration: underline;\n  -webkit-text-decoration: underline solid currentColor;\n          text-decoration: underline solid currentColor;\n  text-decoration-thickness: 1.2px;\n  -webkit-text-decoration: underline 1.2px;\n          text-decoration: underline 1.2px;\n}\n\n.post-tail-wrap a, .core_reply_tail:not(.clearfix) .p_mtail a,\n.core_reply_tail:not(.clearfix) .p_mtail .j_jb_ele::after {\n  cursor: pointer;\n  -webkit-text-decoration: none;\n  text-decoration: none;\n  transition: var(--default-duration);\n}\n\n.post-tail-wrap .p_reply:hover,\n.core_reply_tail:not(.clearfix) .p_reply:hover, .post-tail-wrap .p_reply .lzl_link_fold:hover,\n.core_reply_tail:not(.clearfix) .p_reply .lzl_link_fold:hover, .content-wrapper .author-container .floor-name:hover, .d_post_content a:hover,\n.lzl_cnt .lzl_content_main a:hover:not(.at) {\n  background-color: var(--default-hover);\n}\n\n.d_post_content a:hover,\n.lzl_cnt .lzl_content_main a:hover:not(.at) {\n  text-decoration: underline;\n  -webkit-text-decoration: underline solid rgba(0, 0, 0, 0);\n          text-decoration: underline solid rgba(0, 0, 0, 0);\n  text-decoration-thickness: 1.2px;\n  -webkit-text-decoration: underline 1.2px rgba(0, 0, 0, 0);\n          text-decoration: underline 1.2px rgba(0, 0, 0, 0);\n}\n\n.post-tail-wrap a:hover, .core_reply_tail:not(.clearfix) .p_mtail a:hover,\n.core_reply_tail:not(.clearfix) .p_mtail .j_jb_ele:hover::after {\n  color: var(--tieba-theme-fore);\n}\n\n.post-tail-wrap .p_reply:active,\n.core_reply_tail:not(.clearfix) .p_reply:active, .post-tail-wrap .p_reply .lzl_link_fold:active,\n.core_reply_tail:not(.clearfix) .p_reply .lzl_link_fold:active, .content-wrapper .author-container .floor-name:active, .d_post_content a:active,\n.lzl_cnt .lzl_content_main a:active:not(.at) {\n  background-color: var(--default-active);\n}\n\n.post-tail-wrap a:active, .core_reply_tail:not(.clearfix) .p_mtail a:active,\n.core_reply_tail:not(.clearfix) .p_mtail .j_jb_ele:active::after {\n  color: var(--tieba-theme-active);\n}\n\n.lzl_p_p img, .content-wrapper .author-container .floor-avatar img {\n  -o-object-fit: contain;\n     object-fit: contain;\n}\n\nbody {\n  background-color: var(--page-background);\n  overflow-x: hidden;\n}\n\nbody.special_conf_skin {\n  background: var(--page-background);\n}\n\n.wrap1 {\n  background: none !important;\n  background-color: transparent !important;\n}\n.wrap1 .wrap2 {\n  background: none !important;\n  background-color: transparent !important;\n}\n\n.head_inner {\n  display: none;\n}\n\n#container {\n  width: 100%;\n  max-width: 100%;\n  max-width: var(--content-max);\n  box-sizing: border-box;\n  margin-top: 86px;\n}\n#container .content {\n  width: 100%;\n}\n#container .content .pb_content {\n  position: relative;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 24px 48px;\n  border-radius: 6px 6px 0 0;\n  border-top: 6px solid var(--tieba-theme-color);\n  background-color: var(--default-background);\n  box-shadow: 0 12px 80px -32px rgba(0, 0, 0, 0.4);\n}\n#container .tittle_fill_dom {\n  display: none;\n}\n\n.card_top_wrap,\n.nav_wrap,\n.p_thread {\n  display: none;\n}\n\n.core_title_wrap_bright {\n  display: none !important;\n}\n\n#j_p_postlist {\n  display: flex;\n  box-sizing: border-box;\n  flex-direction: column;\n  gap: 16px;\n}\n#j_p_postlist .save_face_bg {\n  display: none;\n}\n#j_p_postlist .l_post_bright {\n  border: none;\n}\n#j_p_postlist .l_post_bright .d_post_content_main {\n  background-color: transparent !important;\n  background-color: initial !important;\n}\n#j_p_postlist .l_post_bright .d_post_content_main {\n  width: 100%;\n  padding: 0;\n}\n#j_p_postlist .l_post_bright .d_post_content_main .p_content {\n  min-height: 0;\n  min-height: initial;\n  padding: 0;\n  margin-bottom: -42px;\n  background-color: transparent;\n  background-color: initial;\n}\n#j_p_postlist .l_post_bright .d_post_content_main .p_content .shield-tip {\n  background: none;\n}\n#j_p_postlist .l_post_bright .d_post_content_main .p_content .d_post_content {\n  background-color: transparent !important;\n  background-color: initial !important;\n}\n#j_p_postlist .l_post_bright .d_post_content_main .p_content .d_post_content {\n  padding: 0;\n  font-size: 16px;\n  grid-area: content;\n}\n#j_p_postlist .l_post_bright .d_post_content_main .p_content .replace_div {\n  width: auto !important;\n}\n#j_p_postlist .l_post_bright .d_post_content_main .p_content .BDE_Smiley {\n  width: 24px;\n  height: 24px;\n  vertical-align: text-bottom;\n}\n#j_p_postlist .l_post_bright .d_post_content_main .p_content .BDE_Image {\n  display: flex;\n  width: -moz-max-content;\n  width: max-content;\n  max-width: 100%;\n  height: auto;\n  border-radius: 12px;\n  margin: 6px auto;\n}\n#j_p_postlist div[data-po] {\n  display: none;\n}\n\n.main-wrapper {\n  display: flex;\n  max-width: 80%;\n  flex-direction: column;\n  padding: 8px;\n  margin: auto;\n  margin-top: 48px;\n}\n@media (min-width: 1200px) {\n  .main-wrapper {\n    max-width: 60%;\n  }\n}\n\n.left_section {\n  width: 100%;\n}\n\n.core_reply_wrapper {\n  padding-left: 42px;\n}\n\n.post-tail-wrap,\n.core_reply_tail:not(.clearfix) {\n  display: flex;\n  align-items: center;\n  margin-top: 0;\n  color: var(--light-fore);\n  float: none;\n  font-size: 13px;\n  gap: 12px;\n}\n.post-tail-wrap .question-image,\n.core_reply_tail:not(.clearfix) .question-image {\n  display: none;\n}\n.post-tail-wrap .p_reply,\n.core_reply_tail:not(.clearfix) .p_reply {\n  margin: 0;\n}\n.post-tail-wrap .p_reply .lzl_link_fold,\n.core_reply_tail:not(.clearfix) .p_reply .lzl_link_fold {\n  border: none;\n  background: none;\n}\n\n.post-tail-wrap .tail-info {\n  margin: 0;\n}\n.post-tail-wrap .tail-info:hover {\n  color: var(--light-fore);\n}\n.post-tail-wrap .tail-info a:hover,\n.post-tail-wrap a.tail-info:hover,\n.post-tail-wrap .j_jb_ele a:hover {\n  color: var(--tieba-theme-fore);\n}\n.post-tail-wrap .tail-info a:active,\n.post-tail-wrap a.tail-info:active,\n.post-tail-wrap .j_jb_ele a:active {\n  color: var(--tieba-theme-active);\n}\n\n.core_reply_tail:not(.clearfix) {\n  flex-direction: row-reverse;\n  justify-content: flex-end;\n}\n.core_reply_tail:not(.clearfix) .p_tail li,\n.core_reply_tail:not(.clearfix) .p_tail_txt,\n.core_reply_tail:not(.clearfix) .p_mtail a,\n.core_reply_tail:not(.clearfix) .ip-location {\n  color: var(--light-fore);\n}\n.core_reply_tail:not(.clearfix) .p_tail {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.core_reply_tail:not(.clearfix) .p_tail li {\n  margin: 0;\n}\n.core_reply_tail:not(.clearfix) .p_mtail {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.core_reply_tail:not(.clearfix) .p_mtail li {\n  margin: 0;\n}\n.core_reply_tail:not(.clearfix) .p_mtail a,\n.core_reply_tail:not(.clearfix) .p_mtail .j_jb_ele::after {\n  color: var(--light-fore);\n}\n.core_reply_tail:not(.clearfix) .p_mtail .j_jb_ele {\n  padding: 0;\n}\n.core_reply_tail:not(.clearfix) .p_props_tail.props_appraise_wrap {\n  display: none;\n}\n\n.right_section {\n  display: none;\n}\n\n#title-wrapper {\n  display: flex;\n  box-sizing: border-box;\n  align-items: flex-end;\n  justify-content: space-between;\n  margin: 16px 0;\n  gap: 8px;\n}\n.shrink-view #title-wrapper {\n  padding: 0 48px;\n}\n#title-wrapper .thread-title {\n  max-width: 60%;\n  font-size: 32px;\n  line-height: 36px;\n  text-align: left;\n}\n#title-wrapper .forum-wrapper-button {\n  background-color: var(--trans-light-background) !important;\n}\n#title-wrapper .forum-wrapper-button {\n  display: flex;\n  overflow: hidden;\n  width: -moz-max-content;\n  width: max-content;\n  height: -moz-max-content;\n  height: max-content;\n  align-items: center;\n  padding: 0;\n  border-radius: 8px;\n  gap: 8px;\n}\nhtml:not([perf-saver]) body.custom-background #title-wrapper .forum-wrapper-button {\n  -webkit-backdrop-filter: blur(24px);\n          backdrop-filter: blur(24px);\n}\nhtml.dark-theme body.custom-background #title-wrapper .forum-wrapper-button {\n  -webkit-backdrop-filter: blur(24px) brightness(0.8);\n          backdrop-filter: blur(24px) brightness(0.8);\n}\n#title-wrapper .forum-wrapper-button:last-child {\n  padding-right: 8px;\n}\n#title-wrapper .forum-wrapper-button .forum-icon {\n  width: 36px;\n  height: 36px;\n}\n#title-wrapper .forum-wrapper-button .forum-name {\n  font-size: 14px;\n  font-weight: var(--font-weight-bold);\n}\n#title-wrapper .forum-wrapper-button .forum-info {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n#title-wrapper .forum-wrapper-button .forum-info .forum-members {\n  display: flex;\n  gap: 8px;\n}\n#title-wrapper .forum-wrapper-button .button-container {\n  display: flex;\n  align-items: center;\n}\n#title-wrapper .forum-wrapper-button .button-container .forum-button {\n  padding: 0 4px;\n  color: var(--tieba-theme-color);\n  font-size: 16px;\n  font-weight: var(--font-weight-bold);\n}\n#title-wrapper .forum-wrapper-button .button-container .forum-button:not(:hover):not(:active):not(:focus) {\n  background-color: transparent;\n}\n\n.forum-mask-wrapper {\n  position: relative;\n  z-index: -1;\n  display: flex;\n  justify-content: center;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n@keyframes mask-fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 0.1;\n  }\n}\n.forum-mask-wrapper .forum-mask {\n  position: absolute;\n  top: -320px;\n  width: 480px;\n  height: 480px;\n  border-radius: 480px;\n  animation: mask-fade-in 1s ease-in-out;\n  filter: blur(60px);\n  opacity: 0.1;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n\n.core_reply_content {\n  padding: 0;\n}\n\n.content-wrapper {\n  display: flex;\n  width: 100%;\n  flex-direction: column;\n  gap: 16px;\n}\n.content-wrapper .author-container {\n  display: grid;\n  margin-bottom: 8px;\n  grid-gap: 6px;\n  gap: 6px;\n  grid-template: "avatar name" auto "avatar tags" auto/36px 1fr;\n}\n.content-wrapper .author-container .floor-avatar {\n  width: -moz-max-content !important;\n  width: max-content !important;\n  height: -moz-max-content !important;\n  height: max-content !important;\n  padding: 0 !important;\n}\n.content-wrapper .author-container .floor-avatar {\n  overflow: hidden;\n  grid-area: avatar;\n}\n.content-wrapper .author-container .floor-avatar img {\n  width: 36px;\n  height: 36px;\n  border-radius: 8px;\n}\n.content-wrapper .author-container .floor-name {\n  width: -moz-fit-content;\n  width: fit-content;\n  color: var(--highlight-fore);\n  font-size: 14px;\n  font-weight: var(--font-weight-bold);\n  grid-area: name;\n}\n.content-wrapper .author-container .badge-container {\n  display: flex;\n  margin-top: -4px;\n  gap: 4px;\n  grid-area: tags;\n}\n.content-wrapper .author-container .badge-container .floor-badge {\n  display: flex;\n  width: -moz-fit-content;\n  width: fit-content;\n  padding: 0 6px;\n  border-radius: 6px;\n  background-color: var(--trans-light-background);\n  color: var(--light-fore);\n  gap: 6px;\n}\n.content-wrapper .author-container .badge-container .floor-badge .badge-level {\n  font-weight: var(--font-weight-bold);\n}\n.content-wrapper .floor-wrapper {\n  display: grid;\n  grid-template: "avatar name" auto "avatar tags" auto "content content" 1fr "footer footer" auto "comments comments" auto/36px 1fr;\n}\n.content-wrapper .floor-wrapper .floor-avatar {\n  width: -moz-max-content !important;\n  width: max-content !important;\n  height: -moz-max-content !important;\n  height: max-content !important;\n  padding: 0 !important;\n}\n.content-wrapper .floor-wrapper .floor-avatar {\n  overflow: hidden;\n  grid-area: avatar;\n}\n.content-wrapper .floor-wrapper .floor-avatar img {\n  width: 36px;\n  border-radius: 8px;\n}\n.content-wrapper .floor-wrapper .floor-name {\n  width: -moz-fit-content;\n  width: fit-content;\n  margin: 0 8px 4px;\n  font-size: 14px;\n  grid-area: name;\n}\n.content-wrapper .floor-wrapper .floor-badge {\n  display: flex;\n  width: -moz-fit-content;\n  width: fit-content;\n  padding: 0 6px;\n  border-radius: 6px;\n  margin: 0 8px 8px;\n  background-color: var(--trans-light-background);\n  color: var(--light-fore);\n  gap: 6px;\n  grid-area: tags;\n}\n.content-wrapper .floor-wrapper .floor-badge .badge-level {\n  font-weight: var(--font-weight-bold);\n}\n.content-wrapper .floor-wrapper .floor-content {\n  padding: 8px 0;\n  font-size: 16px;\n  grid-area: content;\n}\n.content-wrapper .floor-wrapper .floor-content .BDE_Smiley {\n  width: 24px;\n  height: 24px;\n  vertical-align: sub;\n}\n.content-wrapper .floor-wrapper .floor-info {\n  display: flex;\n  justify-content: flex-end;\n  color: var(--light-fore);\n  gap: 12px;\n  grid-area: footer;\n}\n.content-wrapper .floor-wrapper .floor-comments {\n  width: 100%;\n  grid-area: comments;\n}\n.content-wrapper .floor-wrapper .floor-comments .core_reply_wrapper {\n  width: 100%;\n}\n\n#ueditor_replace {\n  overflow: hidden;\n}\n\n#thread-jsx-components {\n  display: flex;\n  box-sizing: border-box;\n  flex-direction: column;\n  gap: 12px;\n}\n#thread-jsx-components .dummy-button {\n  width: 100%;\n  padding: 8px 0 0;\n  border: none;\n  border-radius: 0;\n  border-bottom: 3px solid var(--border-color);\n  margin-top: 8px;\n  background-color: transparent;\n  box-shadow: none;\n  color: var(--minimal-fore);\n  cursor: text;\n  font-size: 16px;\n  text-align: justify;\n}\n#thread-jsx-components .dummy-button:hover {\n  border-color: var(--light-background);\n}\n#thread-jsx-components .dummy-button:focus {\n  border-color: var(--tieba-theme-color);\n}\n\n.pb_footer {\n  display: none;\n}\n\n.svelte-zmnt4x {\n  display: none;\n}\n\n.wrap2 {\n  padding-bottom: 0 !important;\n}\n\n.head_ad_pop {\n  display: none !important;\n}\n\n.plat_head,\n.star_nav_wrap {\n  display: none;\n}\n\n.error {\n  background: none;\n}';
    async function thread() {
      if (!pageExtension.get().thread) return;
      if (currentPageType() !== "thread") return;
      overwriteCSS(threadStyle, compactStyle, commentsStyle);
      await waitUntil(() => !_2.isNil(document.body)).then(function() {
        if (compactLayout.get()) {
          document.body.toggleAttribute("compact-layout");
        }
      });
      waitUntil(() => !_2.isNil(floatBar.get())).then(function() {
        floatBar.add("other", function() {
          renderDialog(TogglePanel, {
            toggles: [{
              icon: "favorite",
              name: "收藏",
              defaultValue: function() {
                var _a;
                return ((_a = dom(".j_favor, #j_favthread .p_favthr_main")) == null ? undefined : _a.innerText) === "收藏" ? false : true;
              }(),
              event() {
                var _a;
                (_a = dom(".j_favor, #j_favthread .p_favthr_main")) == null ? undefined : _a.click();
              }
            }, {
              icon: "face_6",
              name: "只看楼主",
              defaultValue: function() {
                var _a;
                return ((_a = dom("#lzonly_cntn")) == null ? undefined : _a.innerText) === "只看楼主" ? false : true;
              }(),
              event() {
                var _a;
                (_a = dom("#lzonly_cntn")) == null ? undefined : _a.click();
              }
            }, {
              icon: "compare_arrows",
              name: "紧凑布局",
              defaultValue: (() => compactLayout.get())(),
              event() {
                document.body.toggleAttribute("compact-layout");
                compactLayout.set(!compactLayout.get());
              }
            }]
          });
        }, "module-settings", "menu");
        document.body.insertBefore(domrd("div", {
          class: "vue-module-control",
          style: "display: none;"
        }), document.body.firstChild);
      });
      const content = await asyncdom(".content");
      const pbContent = await asyncdom("#pb_content");
      if (perfProfile.get() === "performance" && experimental.get().moreBlurEffect) {
        pbContent.classList.add("blur-effect");
        pbContent.style.backgroundColor = "var(--trans-default-background)";
      }
      createContents();
      async function createContents() {
        var _a;
        const threadList = await asyncdom("#j_p_postlist");
        threadList.classList.add("content-wrapper");
        let thread2 = threadParser();
        const forumIconLink = thread2.forum.components.iconContainer.children[0].src;
        insertJSX(vue.createVNode("div", {
          "id": "title-wrapper"
        }, [vue.createVNode("h3", {
          "class": "thread-title"
        }, [_2.unescape(_2(PageData.thread.title).split("回复：").last()).replace(/&#039;/g, "'").replace(/&quot;/g, '"')]), vue.createVNode("div", {
          "class": "forum-wrapper-button"
        }, [vue.createVNode("img", {
          "class": "forum-icon",
          "src": forumIconLink,
          "alt": "吧头像"
        }, null), vue.createVNode("a", {
          "class": "forum-name anchor-noback",
          "href": `/f?kw=${PageData.forum.name_url}`,
          "target": "_blank"
        }, [PageData.forum.forum_name, vue.createTextVNode(" 吧")]), vue.createVNode("div", {
          "class": "button-container"
        }, [vue.createVNode(userView.UserButton, {
          "class": "icon forum-button add-forum-button",
          "noBorder": true,
          "onClick": () => {
            var _a2;
            return (_a2 = dom("#j_head_focus_btn")) == null ? undefined : _a2.click();
          }
        }, {
          default: () => [PageData.user.is_like ? "check" : "add"]
        })])])]), content, pbContent);
        userView.floatMessage({
          target: await asyncdom(".forum-wrapper-button"),
          content: `关注 ${PageData.forum.member_count}, 帖子 ${PageData.forum.post_num}`
        });
        (_a = dom(".sign-in-button")) == null ? undefined : _a.addEventListener("click", function() {
          var _a2;
          (_a2 = dom(".j_signbtn")) == null ? undefined : _a2.click();
        });
        document.addEventListener("DOMContentLoaded", function() {
          threadFloorsObserver.addEvent(function() {
            _2.forEach(dom(".j_jb_ele a", []), (el) => {
              var _a2;
              if (((_a2 = el.lastChild) == null ? undefined : _a2.nodeType) !== Node.TEXT_NODE) {
                el.appendChild(new Text("举报"));
              }
            });
          });
          if (PageData.pager.cur_page === 1 && PageData.thread.reply_num > 1) {
            const firstFloor = dom(".l_post", threadList);
            if (firstFloor) firstFloor.style.borderBottom = "2px solid var(--tieba-theme-fore) !important";
          }
        }, {
          once: true
        });
        threadFloorsObserver.addEvent(function() {
          if (dom(".d_author", []).length === 0) return;
          thread2 = threadParser();
          _2.forEach(dom(".d_post_content_main", threadList, []), (floor, i) => {
            const authorContainer = createAuthorContainer(i);
            floor.insertBefore(authorContainer, floor.firstChild);
          });
          _2.forEach(dom(".d_author", []), (el) => el.remove());
        });
        function createAuthorContainer(index2) {
          const authorContainer = domrd("div", {
            class: "author-container"
          });
          thread2.cotents[index2].profile.nameAnchor.classList.add("anchor");
          authorContainer.appendChild(thread2.cotents[index2].profile.avatar);
          authorContainer.appendChild(thread2.cotents[index2].profile.nameAnchor);
          const badgeContainer = appendJSX(vue.createVNode("div", {
            "class": "badge-container"
          }, null), authorContainer);
          appendJSX(vue.createVNode("div", {
            "class": `floor-badge level-${levelToClass(thread2.cotents[index2].profile.level)}`
          }, [vue.createVNode("div", {
            "class": "badge-level"
          }, [thread2.cotents[index2].profile.level]), vue.createVNode("div", {
            "class": "badge-title"
          }, [thread2.cotents[index2].profile.badgeTitle])]), badgeContainer.root);
          if (thread2.cotents[index2].isLouzhu) appendJSX(vue.createVNode("div", {
            "class": "floor-badge"
          }, [vue.createTextVNode("楼主")]), badgeContainer.root);
          return authorContainer;
        }
        const avatarObserver = new IntersectionObserver(function(entries, observer) {
          _2.forEach(entries, function(entry) {
            if (entry.isIntersecting) {
              const avatar = entry.target.children[0];
              const lazyLink = avatar.getAttribute("data-tb-lazyload");
              if (avatar.src !== lazyLink) {
                if (lazyLink) avatar.src = lazyLink;
                else observer.unobserve(entry.target);
              } else {
                observer.unobserve(entry.target);
              }
            }
          });
        }, {
          root: null,
          rootMargin: "0px",
          threshold: 0.5
        });
        _2.forEach(thread2.cotents, (content2) => {
          avatarObserver.observe(content2.profile.avatar);
        });
        threadFloorsObserver.addEvent(async () => {
          await waitUntil(() => !!PageData.thread.thread_id);
          _2.forEach(dom(".BDE_Image", threadList, []), (el) => {
            const newEl = el.cloneNode(false);
            const postContent = findParent(el, "d_post_content");
            newEl.dataset.pid = _2(postContent == null ? undefined : postContent.id).split("_").last();
            newEl.addEventListener("click", async function() {
              if (!_2.isNil(currentStorage.get(THREAD_IMAGES))) {
                showImage();
              } else {
                renderDialog(AwaitDialog, {
                  unloadPred: () => !_2.isNil(currentStorage.get(THREAD_IMAGES))
                }, {
                  unloaded() {
                    showImage();
                  }
                });
              }
              getAllThreadImages({
                threadId: PageData.thread.thread_id,
                lzOnly: false
              });
              async function showImage() {
                if (_2.isNil(newEl.dataset.index)) {
                  newEl.dataset.index = `${_2.findIndex(await getAllThreadImages({
                  threadId: PageData.thread.thread_id,
                  lzOnly: false
                }), {
                  postId: +(newEl.dataset.pid ?? 0)
                }) + _2.findIndex(dom(".BDE_Image", postContent, []), (img) => img === newEl)}`;
                }
                imagesViewer({
                  content: await getAllThreadImages({
                    threadId: PageData.thread.thread_id,
                    lzOnly: false
                  }),
                  defaultIndex: parseInt(newEl.dataset.index ?? "0", 10)
                });
              }
            });
            el.replaceWith(newEl);
          });
        });
        threadCommentsObserver.addEvent(() => {
          _2.forEach(dom(".lzl_cnt", []), (el) => {
            _2.forEach(el.childNodes, (node) => {
              if (node) node.nodeType === 3 ? node.remove() : undefined;
            });
          });
        });
      }
      const pagerVNodes = [];
      const insertPager = (parent, position, additionalStyles) => {
        const {
          vnode: pagerVNode
        } = insertJSX(createPager(additionalStyles), parent, position ?? undefined);
        pagerVNodes.push(pagerVNode);
        function createPager(additionalStyles2) {
          const pagerComponent = vue.createVNode(Pager$1, {
            "total": PageData.pager.total_page,
            "current": PageData.pager.cur_page,
            "showPagers": PageData.pager.total_page > 1,
            "pagerChange": function(page) {
              pager.jumpTo(page);
              _2.forEach(pagerVNodes, (pagerVNode2) => {
                pagerVNode2.component.exposeProxy.current = page;
              });
            },
            "style": parseCSSRule({
              width: "100%",
              padding: "0",
              ...additionalStyles2
            })
          }, {
            tailSlot: () => `回帖 ${PageData.thread.reply_num - 1}`
          });
          return pagerComponent;
        }
      };
      insertPager(pbContent, pbContent.firstChild, {
        marginBottom: "24px",
        position: PageData.pager.total_page <= 1 ? "absolute" : "",
        right: PageData.pager.total_page <= 1 ? "48px" : ""
      });
      createTextbox();
      async function createTextbox() {
        await waitUntil(() => !_2.isNil(floatBar.get()));
        await waitUntil(() => !_2.isNil(dom("#ueditor_replace")));
        if (!_2.some(floatBar.buttons(), {
          type: "post"
        })) {
          floatBar.add("post", showEditor, undefined, undefined, 2);
        }
        const postButton = _2.find(floatBar.buttons(), (button) => {
          return button.type === "post";
        });
        postButton == null ? undefined : postButton.el.addEventListener("click", showEditor);
        insertPager(pbContent, pbContent.lastChild, {
          paddingTop: "24px"
        });
        appendJSX(vue.createVNode("div", {
          "id": "thread-jsx-components"
        }, [vue.createVNode(userView.UserButton, {
          "class": "dummy-button",
          "noBorder": true,
          "onClick": showEditor
        }, {
          default: () => [vue.createTextVNode("回复帖子")]
        })]), pbContent);
        function showEditor() {
          const ueditor = function() {
            if (dom(".edui-container", []).length > 0) return dom(".edui-container");
            return dom("#ueditor_replace");
          }();
          if (ueditor) {
            renderDialog(vue.createVNode(ThreadEditor, {
              "ueditor": ueditor,
              "type": "reply"
            }, null));
          }
        }
      }
    }
    setTheme(themeType.get());
    darkPrefers.addEventListener("change", () => setTheme(themeType.get()));
    Promise.all([
      loadDynamicCSS(),
      loadMainCSS(),
      index$e(),
      thread(),
      parseUserModules(
        /* @__PURE__ */ Object.assign({ "./modules/easy-jump/index.ts": () => Promise.resolve().then(() => index$d), "./modules/no-login/index.ts": () => Promise.resolve().then(() => index$b), "./modules/notrans-emojis/index.ts": () => Promise.resolve().then(() => index$9), "./modules/portal/index.ts": () => Promise.resolve().then(() => index$7), "./modules/remixed-theme/index.ts": () => Promise.resolve().then(() => index$5), "./modules/shield/index.ts": () => Promise.resolve().then(() => index$g), "./modules/tieba-tags/index.ts": () => Promise.resolve().then(() => index$3), "./modules/toolkit/index.ts": () => Promise.resolve().then(() => index$1) }),
        (module) => {
          AllModules().push(module);
        }
      ),
      document.addEventListener("DOMContentLoaded", function() {
        if (currentPageType() === "thread") {
          threadFloorsObserver.observe();
          threadCommentsObserver.observe();
        }
        if (currentPageType() === "index") {
          if (!pageExtension.get().index)
            legacyIndexFeedsObserver.observe();
        }
        if (currentPageType() === "forum") {
          forumThreadsObserver.observe();
        }
      })
    ]);
    window.addEventListener("load", function() {
      checkUpdateAndNotify();
    });
    waitUntil(() => !_2.isNil(document.body)).then(function() {
      if (wideScreen.get().noLimit) {
        document.body.classList.add("shrink-view");
      } else {
        const shrinkListener = _2.throttle(function() {
          if (window.innerWidth <= wideScreen.get().maxWidth) {
            document.body.classList.add("shrink-view");
          } else {
            document.body.classList.remove("shrink-view");
          }
        }, 200);
        shrinkListener();
        window.addEventListener("resize", shrinkListener);
      }
    });
    loadPerf();
    _GM_registerMenuCommand("设置", () => renderDialog(Settings));
    console.info(REMIXED);
    const index$c = {
      id: "easy-jump",
      name: "直链跳转",
      author: "锯条",
      version: "1.0.2",
      brief: "链接跳转避免二次确认",
      description: `自动跳转至分享链接的原始地址，不再进行中转（不处理被严重警告的链接）`,
      scope: /jump2?.bdimg.com\/safecheck\//,
      runAt: "immediately",
      entry: main$5
    };
    async function main$5() {
      afterHead(function() {
        injectCSSRule("html", {
          backgroundColor: "var(--page-background)"
        });
        injectCSSRule("body", {
          display: "none"
        });
      });
      location.href = (await asyncdom(".link")).innerText;
    }
    const index$d = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: index$c
    }, Symbol.toStringTag, { value: "Module" }));
    const index$a = {
      id: "nologin-tieba",
      name: "免登录浏览",
      author: "锯条",
      version: "1.0",
      brief: "免登录浏览贴吧",
      description: `始终伪装为已登录状态，让免登录浏览和已登录基本一致`,
      scope: ["thread"],
      runAt: "DOMLoaded",
      entry: main$4
    };
    function main$4() {
      if (PageData.user.is_login) return;
      PageData.user.is_login = 1;
    }
    const index$b = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: index$a
    }, Symbol.toStringTag, { value: "Module" }));
    const index$8 = {
      id: "notrans-emojis",
      name: "别动我的 emoji😠",
      author: "锯条",
      version: "1.0",
      brief: "拒绝替换我的 emoji",
      description: "原版贴吧会将部分emoji表情替换为旧版，该模块会让这些emoji重新跟随系统样式",
      scope: true,
      runAt: "afterHead",
      entry: main$3
    };
    function main$3() {
      const indexRegExp = new RegExp("(?<=nickemoji\\/).*?(?=.png)", "gi");
      const emojis = [
        "º",
        "◎",
        "▫",
        "◆",
        "♤",
        "♀",
        "♂",
        "ლ",
        "♬",
        "☞",
        "☜",
        "✆",
        "☎",
        "♋",
        "Ω",
        "℃",
        "℉",
        "😄",
        "😍",
        "😘",
        "😚",
        "😜",
        "😳",
        "😁",
        "😞",
        "😢",
        "😂",
        "😫",
        "😨",
        "😱",
        "😡",
        "😷",
        "😲",
        "😈",
        "🐷",
        "🐶",
        "🐑",
        "🐵",
        "🐨",
        "🐴",
        "🐼",
        "🐯",
        "🍪",
        "🍺",
        "🍦",
        "🍭",
        "🍗",
        "🍼",
        "🔯",
        "🍒",
        "👀",
        "🐭",
        "😇",
        "😺",
        "😻",
        "🙀",
        "😿",
        "😹",
        "😾",
        "👹",
        "👺",
        "🌞",
        "🌝",
        "🌚",
        "🌜",
        "🌛",
        "👦",
        "👧",
        "🎎",
        "🌸",
        "🍀",
        "🌹",
        "🌻",
        "🌺",
        "🍁",
        "🌿",
        "🍄",
        "🌵",
        "🌴",
        "🌳",
        "🌰",
        "🌱",
        "🌼",
        "🌐",
        "🌙",
        "🌋",
        "🌌",
        "⛅",
        "⚡",
        "☔",
        "⛄",
        "🌀",
        "🌈",
        "🌊",
        "🔥",
        "✨",
        "🌟",
        "💥",
        "💫",
        "💢",
        "💦",
        "💧",
        "💤",
        "💨",
        "🎀",
        "🌂",
        "💄",
        "💕",
        "💖",
        "💞",
        "💘",
        "💌",
        "💋",
        "💝",
        "🎒",
        "🎓",
        "🎏",
        "🎃",
        "👻",
        "🎅",
        "🎄",
        "🎁",
        "🙈",
        "🐒",
        "💯",
        "👯",
        "💍"
      ];
      const transformed = [
        "1-1.png",
        "1-2.png",
        "1-4.png",
        "1-5.png",
        "1-6.png",
        "1-7.png",
        "1-8.png",
        "1-9.png",
        "1-10.png",
        "1-11.png",
        "1-12.png",
        "1-13.png",
        "1-14.png",
        "1-15.png",
        "1-16.png",
        "1-17.png",
        "1-18.png",
        "1-19.png",
        "1-20.png",
        "1-21.png",
        "1-22.png",
        "1-23.png",
        "1-24.png",
        "1-25.png",
        "1-26.png",
        "1-27.png",
        "1-28.png",
        "1-29.png",
        "1-30.png",
        "1-31.png",
        "1-32.png",
        "1-33.png",
        "1-34.png",
        "1-35.png",
        "2-1.png",
        "2-2.png",
        "2-3.png",
        "2-4.png",
        "2-5.png",
        "2-6.png",
        "2-7.png",
        "2-8.png",
        "2-9.png",
        "2-10.png",
        "2-11.png",
        "2-12.png",
        "2-13.png",
        "2-14.png",
        "2-15.png",
        "2-16.png",
        "2-17.png",
        "2-18.png",
        "2-19.png",
        "2-20.png",
        "2-21.png",
        "2-22.png",
        "2-23.png",
        "2-24.png",
        "2-25.png",
        "2-26.png",
        "2-27.png",
        "2-28.png",
        "2-29.png",
        "2-30.png",
        "2-31.png",
        "2-32.png",
        "2-33.png",
        "2-34.png",
        "2-35.png",
        "3-1.png",
        "3-2.png",
        "3-3.png",
        "3-4.png",
        "3-5.png",
        "3-6.png",
        "3-7.png",
        "3-8.png",
        "3-9.png",
        "3-10.png",
        "3-11.png",
        "3-12.png",
        "3-13.png",
        "3-14.png",
        "3-15.png",
        "3-16.png",
        "3-17.png",
        "3-18.png",
        "3-19.png",
        "3-20.png",
        "3-21.png",
        "3-22.png",
        "3-23.png",
        "3-24.png",
        "3-25.png",
        "3-26.png",
        "3-27.png",
        "3-28.png",
        "3-29.png",
        "3-30.png",
        "3-31.png",
        "3-32.png",
        "3-33.png",
        "3-34.png",
        "3-35.png",
        "4-1.png",
        "4-2.png",
        "4-3.png",
        "4-4.png",
        "4-5.png",
        "4-6.png",
        "4-7.png",
        "4-8.png",
        "4-9.png",
        "4-10.png",
        "4-11.png",
        "4-12.png",
        "4-13.png",
        "4-14.png",
        "4-15.png",
        "4-16.png",
        "4-17.png",
        "4-18.png",
        "4-19.png",
        "4-20.png",
        "4-21.png",
        "4-22.png",
        "4-23.png"
      ];
      threadCommentsObserver.addEvent(() => {
        try {
          _2.forEach(dom(`
                .p_author_name:has(.nicknameEmoji),
                .at:has(.nicknameEmoji),
                .lzl_content_main:has(.nicknameEmoji)
            `, []), (el) => {
            updateEmojis(el);
          });
        } catch (error) {
          _2.forEach(dom(".p_author_name, .at, .lzl_content_main", []), (el) => {
            if (_2.includes(el.classList, "nicknameEmoji")) {
              updateEmojis(el);
            }
          });
        }
      });
      legacyIndexFeedsObserver.addEvent(() => {
        try {
          _2.forEach(dom(`
                .new_list .post_author:has(.nicknameEmoji),
                .userinfo_username:has(.nicknameEmoji)
            `, []), (el) => {
            updateEmojis(el);
          });
        } catch (error) {
          _2.forEach(dom(".newlist .post_author, .userinfo_username", []), (el) => {
            if (_2.includes(el.classList, "nicknameEmoji")) {
              updateEmojis(el);
            }
          });
        }
      });
      forumThreadsObserver.addEvent(() => {
        try {
          _2.forEach(dom(".threadlist_author a:has(.nicknameEmoji)", []), (el) => {
            updateEmojis(el);
          });
        } catch (error) {
          _2.forEach(dom(".threadlist_author a", []), (el) => {
            if (_2.includes(el.classList, "nicknameEmoji")) {
              updateEmojis(el);
            }
          });
        }
      });
      function updateEmojis(elem) {
        const arrIndex = elem.innerHTML.match(indexRegExp);
        arrIndex == null ? undefined : arrIndex.forEach((index2) => {
          const emoji = emojis[transformed.indexOf(`${index2}.png`)];
          const arrInner = elem.innerHTML.split(RegExp(
            `<img[^>]*?${index2}.png(?:[^>]*?)*>`,
            "g"
          ));
          elem.innerHTML = arrInner.join(decodeURIComponent(emoji));
        });
      }
    }
    const index$9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: index$8
    }, Symbol.toStringTag, { value: "Module" }));
    const index$6 = {
      id: "portal",
      name: "传送门",
      author: "锯条",
      version: "1.1.1",
      brief: "为贴子中的b站番号添加跳转链接",
      description: `该模块可以识别贴子中的 av/BV 号并将其转换为超链接`,
      scope: ["thread"],
      runAt: "immediately",
      entry: main$2
    };
    function main$2() {
      const LINKED_CLASS = "linked";
      const avRegExp = new RegExp("(?<!:\\/\\/www.bilibili.com\\/video\\/)av[1-9]\\d*", "gi");
      const BVRegExp = new RegExp("(?<!:\\/\\/www.bilibili.com\\/video\\/)BV[A-Za-z0-9]{10}", "g");
      document.addEventListener("DOMContentLoaded", () => {
        threadCommentsObserver.addEvent(biliPortal);
      });
      function biliPortal() {
        addBiliLinks(".d_post_content");
        addBiliLinks(".lzl_cnt .lzl_content_main");
        function addBiliLinks(selector) {
          _2.forEach(dom(selector, []), (elem) => {
            var _a, _b, _c, _d;
            if (elem.classList.contains(LINKED_CLASS)) return;
            elem.classList.add(LINKED_CLASS);
            if (((_a = elem.textContent) == null ? undefined : _a.toLowerCase().indexOf("av")) !== -1) {
              const avs = (_b = elem.textContent) == null ? undefined : _b.match(avRegExp);
              bindingLinks(avs ?? undefined, true);
            }
            if (((_c = elem.textContent) == null ? undefined : _c.indexOf("BV")) !== -1) {
              const BVs = (_d = elem.textContent) == null ? undefined : _d.match(BVRegExp);
              bindingLinks(BVs ?? undefined);
            }
            function bindingLinks(array, lowerCase = false) {
              if (!array) return;
              const hadHyperLink = [];
              _2.forEach(array, (videoID) => {
                if (hadHyperLink.indexOf(videoID) === -1) {
                  hadHyperLink.push(videoID);
                  const htmlArray = elem.innerHTML.split(
                    RegExp(`(?<!://www.bilibili.com/video/)${videoID}`, "g")
                  );
                  if (lowerCase) videoID = videoID.toLowerCase();
                  const linkedID = `<a href='https://www.bilibili.com/video/${videoID}' target='_blank'>${videoID}</a>`;
                  elem.innerHTML = htmlArray.join(linkedID);
                }
              });
            }
          });
        }
      }
    }
    const index$7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: index$6
    }, Symbol.toStringTag, { value: "Module" }));
    const floatBarStyle = '.tbui_aside_float_bar {\n  background-color: var(--very-light-background) !important;\n}\n.tbui_aside_float_bar {\n  bottom: 20px;\n  left: calc(50% + var(--content-max) / 2 + 20px);\n  display: flex;\n  overflow: hidden;\n  width: -moz-max-content;\n  width: max-content;\n  flex-direction: column;\n  border-radius: 8px;\n  margin-left: 0;\n  gap: 4px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n}\nhtml.dark-theme .tbui_aside_float_bar {\n  box-shadow: 0 0 16px rgba(0, 0, 0, 0.4);\n}\n[no-scrollbar] .tbui_aside_float_bar {\n  left: calc(50% + var(--content-max) / 2 + 20px - var(--scrollbar-width) / 2);\n}\n.shrink-view .tbui_aside_float_bar {\n  bottom: 0;\n  left: calc(100% - 40px);\n}\n[no-scrollbar].shrink-view .tbui_aside_float_bar {\n  left: calc(100% - 40px - var(--scrollbar-width));\n}\n.tbui_aside_float_bar .tbui_aside_fbar_button {\n  margin: 0 !important;\n}\n.tbui_aside_float_bar .tbui_aside_fbar_button {\n  border-radius: 0;\n  background-color: var(--default-background);\n  transition: var(--default-duration);\n}\n.tbui_aside_float_bar .tbui_aside_fbar_button a {\n  border-radius: 0;\n}\n.tbui_aside_float_bar .tbui_aside_fbar_button a:hover {\n  color: var(--tieba-theme-color);\n}\n.tbui_aside_float_bar .tbui_aside_fbar_button a:active {\n  color: var(--tieba-theme-fore);\n}\n.tbui_aside_float_bar .tbui_aside_fbar_button[style*="visibility: hidden"] {\n  margin-top: -4px !important;\n}\n.tbui_aside_float_bar .tbui_aside_fbar_button[style*="visibility: hidden"] {\n  height: 0;\n}';
    function getFloatCoord(...args) {
      if (args[0] instanceof HTMLElement)
        return getFloatCoord1(args[0], args[1], args[2]);
      if (typeof args[0] === "number" && typeof args[1] === "number")
        return getFloatCoord2(args[0], args[1], args[2], args[3]);
      return { x: 0, y: 0 };
    }
    function getFloatCoord1(el, coord, mode) {
      const clientRect = el.getBoundingClientRect();
      return getFloatCoord2(clientRect.width, clientRect.height, coord, mode);
    }
    function getFloatCoord2(width, height, coord, mode) {
      const offsetX = (() => {
        switch (mode) {
          case "baseline":
            return 0;
          case "middle":
            return width / 2;
        }
      })();
      const x = Math.min(
        coord.x - offsetX,
        window.innerWidth - scrollbarWidth() - Math.ceil(width)
        // 修正误差
      );
      const y = Math.ceil(coord.y + height) > window.innerHeight ? coord.y - height : coord.y;
      return { x, y };
    }
    const _hoisted_1$1 = {
      key: 0,
      class: "menu-separator"
    };
    const _hoisted_2$1 = {
      key: 0,
      class: "icon"
    };
    const _hoisted_3$1 = { class: "menu-title" };
    const _hoisted_4$1 = {
      key: 0,
      class: "menu-inner"
    };
    const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
      __name: "dropdown-menu",
      props: {
        menuItems: {},
        blurEffect: { type: Boolean }
      },
      emits: ["RequestClose"],
      setup(__props, { emit: __emit }) {
        const props = __props;
        const emit = __emit;
        vue.onMounted(() => {
          setTimeout(() => {
            window.addEventListener("click", () => {
              setTimeout(() => {
                emit("RequestClose");
              }, 100);
            });
            window.addEventListener("focusin", (ev) => {
              if (!libelemental2.findParent(ev.target, "dropdown-menu")) {
                emit("RequestClose");
              }
            });
          }, 100);
        });
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            class: vue.normalizeClass(["dropdown-menu", _ctx.blurEffect ? "blur-effect" : ""])
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(props.menuItems, (menuItem) => {
              return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
                typeof menuItem === "string" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1)) : (vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                  key: 1,
                  class: "menu-item",
                  "is-anchor": menuItem.href !== undefined,
                  href: menuItem.href ? menuItem.href : "javascript:;",
                  onClick: menuItem.click,
                  target: menuItem.href ? "_blank" : "",
                  "no-border": ""
                }, {
                  default: vue.withCtx(() => [
                    menuItem.icon ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$1, vue.toDisplayString(menuItem.icon), 1)) : vue.createCommentVNode("", true),
                    vue.createElementVNode("div", _hoisted_3$1, [
                      vue.createTextVNode(vue.toDisplayString(menuItem.title) + " ", 1),
                      menuItem.innerText ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4$1, vue.toDisplayString(menuItem.innerText), 1)) : vue.createCommentVNode("", true)
                    ])
                  ]),
                  _: 2
                }, 1032, ["is-anchor", "href", "onClick", "target"]))
              ], 64);
            }), 256))
          ], 2);
        };
      }
    });
    const DropdownMenu = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-465a0f6d"]]);
    const _hoisted_1 = { id: "fold-bar" };
    const _hoisted_2 = { id: "nav-container" };
    const _hoisted_3 = { class: "left-container" };
    const _hoisted_4 = ["src"];
    const _hoisted_5 = { class: "right-container" };
    const _hoisted_6 = { class: "middle-container" };
    const _sfc_main = /* @__PURE__ */ vue.defineComponent({
      __name: "nav-bar",
      props: {
        hideMode: { default: navBarHideMode.get() }
      },
      setup(__props) {
        const props = __props;
        const navBar = vue.ref();
        const teiggerHide = vue.ref(false);
        const navAvatar = vue.ref();
        const userPortrait = vue.ref("");
        const middleMenu = vue.ref({});
        const userMenu = vue.ref([]);
        const extendMenu = vue.ref([]);
        init();
        vue.onMounted(async function() {
          {
            waitUntil(() => userPortrait.value !== "").then(function() {
              if (navAvatar.value)
                navAvatar.value.src = tiebaAPI.URL_profile(userPortrait.value);
            });
          }
        });
        async function init() {
          await waitUntil(() => PageData !== undefined).then(() => {
            userPortrait.value = PageData.user.portrait;
            loadNavMenuContent();
          });
          const navBarElement = dom("#nav-bar");
          if (navBarElement) {
            _2.forEach(dom(".menu-trigger", navBarElement, []), (el) => {
              el.addEventListener("mousemove", function(e) {
                e.stopPropagation();
                const menu = el.lastElementChild;
                const elRect = el.getBoundingClientRect();
                const menuCoord = getFloatCoord(menu, { x: elRect.left + elRect.width / 2, y: 0 }, "middle");
                menu.style.left = `${menuCoord.x}px`;
                menu.style.top = "48px";
              });
            });
          }
          switch (props.hideMode) {
            case "alwaysFold":
              teiggerHide.value = true;
              break;
            case "fold":
            case "hideWhenScroll": {
              const modeClass = props.hideMode === "fold" ? "fold" : "hide";
              const threshold = 50, timeout = 1e3;
              let lastScrollY = window.scrollY;
              let timer = -1;
              const handle = _2.throttle(function() {
                var _a, _b;
                if (window.scrollY > lastScrollY + threshold) {
                  (_a = navBar.value) == null ? undefined : _a.classList.add(modeClass);
                  teiggerHide.value = true;
                  clearTimeout(timer);
                } else if (window.scrollY < lastScrollY - threshold) {
                  (_b = navBar.value) == null ? undefined : _b.classList.remove(modeClass);
                  teiggerHide.value = false;
                  clearTimeout(timer);
                } else {
                  clearTimeout(timer);
                  timer = setTimeout(handle, timeout);
                }
                lastScrollY = window.scrollY;
              });
              window.addEventListener("scroll", handle);
              break;
            }
          }
        }
        async function login() {
          const loginButton = dom(".u_login");
          const directLoginButton = dom("#TANGRAM__PSP_24__submit");
          if (directLoginButton) {
            const confirmDirect = await userView.messageBox({
              title: "快速登录",
              content: "检测到快速登录入口，是否尝试直接登录？",
              type: "okCancel"
            });
            if (confirmDirect === "positive") {
              directLoginButton.click();
            } else {
              regularLogin();
            }
          } else {
            regularLogin();
          }
          function regularLogin() {
            var _a;
            loginButton ? (_a = dom("a", loginButton)) == null ? undefined : _a.click() : cannotLogin();
          }
          function cannotLogin() {
            userView.toast({ message: "未检测到可用的登录入口，请刷新重试", type: "warning" });
          }
        }
        function loadNavMenuContent() {
          middleMenu.value = {
            "消息": [
              {
                title: "查看私信",
                href: "/im/pcmsg"
              },
              {
                title: "查看回复",
                href: `/i/sys/jump?u=${userPortrait.value}&type=replyme`
              },
              {
                title: "查看 @",
                href: `/i/sys/jump?u=${userPortrait.value}&type=atme`
              },
              "separator",
              {
                title: "查看好友申请",
                href: `/i/sys/jump?u=${userPortrait.value}&type=friendapply`
              },
              {
                title: "查看新粉丝",
                href: `/i/sys/jump?u=${userPortrait.value}&type=fans`
              },
              "separator",
              {
                title: "我的收藏",
                href: `/i/sys/jump?u=${userPortrait.value}&type=storethread`
              },
              {
                title: "我的通知",
                href: "/sysmsg/index?type=notity"
              }
            ],
            "更多": [
              {
                title: "账号设置",
                href: "//passport.baidu.com/?center&tpl=tb&aid=6&default_tab=3#3,0"
              },
              {
                title: "贴吧设置",
                href: `/home/profile?un=${PageData.user.name_url}`
              },
              "separator",
              {
                title: "服务中心",
                href: "//tieba.baidu.com/pmc"
              },
              {
                title: "问题反馈",
                href: "//tieba.baidu.com/hermes/feedback"
              }
            ]
          };
          userMenu.value = [
            {
              title: "我的贴吧",
              href: `/home/main?id=${userPortrait.value}&fr=userbar`
            },
            {
              title: "我的收藏",
              href: `/i/sys/jump?un=${PageData.user.user_name}${PageData.user.name_url}&type=storethread&st_mod=userbar&fr=tb0_pb`
            }
          ];
          PageData.user.is_login ? userMenu.value.push("separator", {
            title: "退出登录",
            click() {
              var _a;
              const logoutButton = dom(".u_logout");
              if (logoutButton) {
                (_a = dom("a", logoutButton)) == null ? undefined : _a.click();
              } else {
                userView.toast({ message: "未检测到退出登录入口，请刷新重试。", type: "warning" });
              }
            }
          }) : userMenu.value.push("separator", {
            title: "登录",
            click() {
              login();
            }
          });
          extendMenu.value = [
            {
              title: "脚本设置",
              click() {
                renderDialog(Settings);
              }
            },
            {
              title: "检查更新",
              click() {
                checkUpdateAndNotify(true);
              }
            },
            "separator",
            {
              title: "源代码仓库",
              innerText: "GitHub",
              href: GithubRepo
            },
            {
              title: "源代码仓库",
              innerText: "Gitee",
              href: GiteeRepo
            },
            {
              title: "切换至 GreasyFork",
              href: "https://greasyfork.org/zh-CN/scripts/486367"
            }
          ];
        }
        return (_ctx, _cache) => {
          return vue.openBlock(), vue.createElementBlock("nav", {
            ref_key: "navBar",
            ref: navBar,
            id: "nav-bar",
            class: vue.normalizeClass(["nav-bar remove-default", { "fold": _ctx.hideMode === "alwaysFold", "blur-effect": !vue.unref(experimental).get().rasterEffect, "raster-effect": vue.unref(experimental).get().rasterEffect, "fixed-on-top": _ctx.hideMode === "fixedOnTop" }])
          }, [
            vue.withDirectives(vue.createElementVNode("div", _hoisted_1, null, 512), [
              [vue.vShow, teiggerHide.value]
            ]),
            vue.createElementVNode("div", _hoisted_2, [
              vue.createElementVNode("div", _hoisted_3, [
                vue.createVNode(vue.unref(userView.UserButton), {
                  class: "nav-button nav-title-container",
                  "is-anchor": "",
                  href: "/",
                  "no-border": "all"
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("img", {
                      src: vue.unref(getResource)("/assets/images/main/icon64.png"),
                      alt: "",
                      class: "nav-icon"
                    }, null, 8, _hoisted_4),
                    _cache[0] || (_cache[0] = vue.createElementVNode("p", { class: "nav-title" }, "贴吧", -1))
                  ]),
                  _: 1
                })
              ]),
              vue.createElementVNode("div", _hoisted_5, [
                vue.createElementVNode("div", _hoisted_6, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(middleMenu.value, (menu, key) => {
                    return vue.openBlock(), vue.createBlock(vue.unref(userView.UserButton), {
                      key,
                      class: "menu-trigger middle-menu-trigger",
                      "no-border": "all"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(key) + " ", 1),
                        vue.createVNode(DropdownMenu, {
                          class: "nav-menu",
                          "menu-items": menu
                        }, null, 8, ["menu-items"])
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                vue.createVNode(vue.unref(userView.UserButton), {
                  class: "nav-button menu-trigger avatar-button",
                  "no-border": "all"
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("img", {
                      ref_key: "navAvatar",
                      ref: navAvatar,
                      class: "nav-avatar"
                    }, null, 512),
                    vue.createVNode(DropdownMenu, {
                      class: "nav-menu",
                      "menu-items": userMenu.value
                    }, null, 8, ["menu-items"])
                  ]),
                  _: 1
                }),
                vue.createVNode(vue.unref(userView.UserButton), {
                  class: "nav-button menu-trigger menu-button",
                  "shadow-border": "",
                  "no-border": "all"
                }, {
                  default: vue.withCtx(() => [
                    _cache[1] || (_cache[1] = vue.createElementVNode("div", { class: "icon" }, "menu", -1)),
                    vue.createVNode(DropdownMenu, {
                      class: "nav-menu",
                      "menu-items": extendMenu.value
                    }, null, 8, ["menu-items"])
                  ]),
                  _: 1
                })
              ])
            ])
          ], 2);
        };
      }
    });
    const navBarVue = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-29297739"]]);
    const navBarCSS = "#com_userbar {\n  display: none;\n}";
    async function _navBar() {
      _GM_addStyle(navBarCSS);
      const elder = await asyncdom("#com_userbar");
      const navWrapper = vue.createVNode("div", {
        "id": "nav-wrapper",
        "class": "nav-wrapper"
      }, null);
      insertJSX(navWrapper, document.body, elder);
      renderComponent(navBarVue, await asyncdom("#nav-wrapper"));
    }
    const index$4 = {
      id: "remixed-theme",
      name: "Tieba Remix 主题",
      author: "锯条",
      version: "0.3",
      brief: "更现代的主题样式",
      description: `包含新的样式、昼夜主题及其自动切换等功能`,
      scope: true,
      runAt: "immediately",
      entry: main$1
    };
    function main$1() {
      _navBar();
      overwriteCSS(floatBarStyle);
      fadeInElems.push(".tbui_aside_float_bar .svg-container");
      fadeInElems.push(".d_badge_bright .d_badge_lv, .user_level .badge_index");
      fadeInElems.forEach((selector) => {
        injectCSSRule(selector, {
          opacity: "0"
        });
      });
      setCustomBackground();
      document.addEventListener("DOMContentLoaded", () => {
        dom(".post-tail-wrap .icon-jubao", []).forEach((elem) => {
          elem.removeAttribute("src");
          elem.after("举报");
        });
        threadFloorsObserver.addEvent(() => {
          dom(".d_badge_lv", []).forEach((elem) => {
            if (elem.textContent === "") {
              let parent = elem;
              while (!parent.classList.contains("l_badge")) {
                if (parent.parentElement)
                  parent = parent.parentElement;
              }
              parent.style.display = "none";
            }
          });
        });
      });
      window.addEventListener("load", () => {
        fadeInLoad(".tbui_aside_float_bar .svg-container");
        threadFloorsObserver.addEvent(() => {
          const lvlClassHead = "tieba-lvl-";
          const lvlGreen = `${lvlClassHead}green`;
          const lvlBlue = `${lvlClassHead}blue`;
          const lvlYellow = `${lvlClassHead}yellow`;
          const lvlOrange = `${lvlClassHead}orange`;
          dom(
            ".d_badge_bawu1 .d_badge_lv, .d_badge_bawu2 .d_badge_lv, .badge_index",
            []
          ).forEach((elem) => {
            if (elem.className.indexOf(lvlClassHead) !== -1) return;
            const lvl = parseInt(_2.defaults(elem.textContent, "0"));
            if (lvl >= 1 && lvl <= 3) {
              elem.classList.add(lvlGreen);
            } else if (lvl >= 4 && lvl <= 9) {
              elem.classList.add(lvlBlue);
            } else if (lvl >= 10 && lvl <= 15) {
              elem.classList.add(lvlYellow);
            } else if (lvl >= 16) {
              elem.classList.add(lvlOrange);
            }
          });
          fadeInLoad(".d_badge_bright .d_badge_lv, .user_level .badge_index");
        });
      });
    }
    const index$5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: index$4
    }, Symbol.toStringTag, { value: "Module" }));
    const index$2 = {
      id: "tieba-tags",
      name: "楼中楼标签",
      author: "锯条",
      version: "2.0.1",
      brief: "优化楼中楼浏览体验",
      description: `为楼中楼的楼主、层主等用户添加特殊标签`,
      scope: ["thread"],
      runAt: "loaded",
      entry: main
    };
    function main() {
      const TAGGED = "is-tagged";
      const TB_TAG = "tag-elem";
      const MY_TAG = "tieba-tags-me";
      const LZ_TAG = "tieba-tags-lz";
      const CZ_TAG = "tieba-tags-cz";
      const louzhu = PageData.thread.author;
      const myPortrait = PageData.user.portrait;
      const myUserName = PageData.user.user_name;
      let louzhuPortrait = getLouzhuPortrait(document);
      (async () => {
        if (!louzhuPortrait) {
          const response = await fetch(location.href.split("?")[0], {
            mode: "cors",
            credentials: "include"
          });
          if (response.ok) {
            await response.text().then((value) => {
              const fpDOC = new DOMParser().parseFromString(value, "text/html");
              louzhuPortrait = getLouzhuPortrait(fpDOC);
            });
          }
        }
      })().then(() => {
        threadCommentsObserver.addEvent(createTagsAll);
      });
      function getLouzhuPortrait(doc) {
        const j_tags = doc.getElementsByClassName("j_louzhubiaoshi");
        if (j_tags.length > 0) {
          const targetFloor = findParent(j_tags[0], "l_post_bright");
          if (targetFloor) {
            const dataAttr = targetFloor.getAttribute("data-field");
            if (dataAttr) {
              const dataField = JSON.parse(dataAttr);
              return _2.split(dataField.author.portrait, "?")[0];
            }
          }
        }
        return undefined;
      }
      function createTagsAll() {
        _2.forEach(dom(".lzl_cnt .at", []), (elem) => {
          if (elem.classList.contains(TAGGED)) return;
          elem.classList.add(TAGGED);
          let isLouzhu = false;
          let isMe = false;
          const username = elem.getAttribute("username");
          if (userClassify(myUserName, myPortrait)) {
            isMe = true;
            addTag(elem, MY_TAG);
          }
          if (!isMe) {
            if (userClassify(louzhu, louzhuPortrait)) {
              isLouzhu = true;
              addTag(elem, LZ_TAG);
            }
          }
          if (!isMe && !isLouzhu) {
            const floor = findParent(elem, "l_post_bright");
            if (floor) {
              const cengzhuCard = floor.getElementsByClassName("p_author_name")[0];
              const cengzhu = cengzhuCard.textContent;
              if (cengzhu) {
                if (elem.textContent === cengzhu) {
                  addTag(elem, CZ_TAG);
                }
              }
            }
          }
          function userClassify(un, portrait) {
            if (username === un && un !== "") {
              return true;
            } else if (_2.indexOf(["", " "], username) !== -1) {
              const targetPortrait = elem.getAttribute("portrait");
              if (targetPortrait && portrait) {
                if (targetPortrait === portrait) {
                  return true;
                }
              } else {
                return dataClassify();
              }
            } else if (!username) {
              return dataClassify();
            }
            return false;
            function dataClassify() {
              const dataAttr = elem.getAttribute("data-field");
              if (dataAttr) {
                const dataField = JSON.parse(dataAttr.replace(/'/g, '"'));
                if (portrait) {
                  if (dataField.id === portrait) {
                    return true;
                  }
                } else {
                  if (dataField.un === un) {
                    return true;
                  }
                }
              }
              return false;
            }
          }
        });
        function addTag(elem, className) {
          elem.appendChild(
            domrd("div", {
              class: `${TB_TAG} ${className}`
            })
          );
        }
      }
    }
    const index$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: index$2
    }, Symbol.toStringTag, { value: "Module" }));
    const index = {
      id: "toolkit",
      name: "实用工具库",
      author: "锯条",
      version: "1.1",
      brief: "优化原版贴吧体验的一组功能",
      description: "这是一个轻量级的工具库，包含了诸如自动展开长图等实用功能。",
      scope: true,
      runAt: "immediately",
      settings: {
        autoExpand: {
          title: "自动展开长图",
          widgets: [{
            type: "toggle",
            content: `该功能会自动将帖子中所有的长图片自动展开，无需手动操作`,
            init: () => toolkitToggles.get().autoExpand,
            event() {
              toolkitToggles.merge({ autoExpand: !toolkitToggles.get().autoExpand });
            }
          }]
        },
        reloadAvatars: {
          title: "重新加载错误头像",
          widgets: [{
            type: "toggle",
            content: `原版贴吧的帖子页面时常会出现加载失败的头像，本功能可以将这些无法正常显示的头像资源链接到正常的 URL`,
            init: () => toolkitToggles.get().reloadAvatars,
            event() {
              toolkitToggles.merge({ reloadAvatars: !toolkitToggles.get().reloadAvatars });
            }
          }]
        }
      },
      entry: function() {
        for (const key in toolkitFeatures) {
          const k = key;
          if (toolkitToggles.get()[k]) toolkitFeatures[k]();
        }
      }
    };
    const toolkitFeatures = {
      /** 自动展开长图 */
      autoExpand() {
        threadFloorsObserver.addEvent(() => {
          _2.forEach(dom(".replace_tip", []), (el) => {
            el.click();
          });
        });
      },
      /** 重新加载错误头像 */
      reloadAvatars() {
        const observer = new IntersectionObserver(function(entries) {
          _2.forEach(entries, (entry) => {
            if (entry.isIntersecting) {
              const avatar = entry.target;
              if (!avatar.complete) return;
              if (avatar.naturalWidth > 0) {
                avatar.setAttribute("data-loaded", "");
              } else {
                const userCard = findParent(avatar, "j_user_card");
                if (!userCard) return;
                const dataField = userCard.getAttribute("data-field");
                if (!dataField) return;
                const portarit = JSON.parse(dataField.replaceAll(/'/g, '"')).id;
                avatar.src = tiebaAPI.URL_profile(portarit);
                avatar.setAttribute("data-loaded", "");
              }
            }
          });
        }, { threshold: 0 });
        threadCommentsObserver.addEvent(function() {
          const avatars = dom(".lzl_single_post img:not(.BDE_Smiley, [data-loaded])", []);
          avatars.forEach((avatar) => observer.observe(avatar));
        });
      }
    };
    const toolkitToggles = new UserKey("toolkitToggles", {
      autoExpand: true,
      reloadAvatars: true
    });
    const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: index
    }, Symbol.toStringTag, { value: "Module" }));
  })(_, Vue, UserView, libelemental, marked);

})();