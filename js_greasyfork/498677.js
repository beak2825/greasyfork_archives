// ==UserScript==
// @name         Wasm🎶音乐姬
// @namespace    https://github.com/Ocyss/wasm-music
// @version      0.3.0
// @author       Ocyss <git@ocyss.icu> (https://github.com/Ocyss)
// @description  仅帮助用户从视频页下载音乐(封面,Tags,歌词,字幕 写入支持)的油猴脚本
// @icon          https://static.hdslb.com/images/favicon.ico
// @homepage     https://github.com/Ocyss/wasm-music
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        *://www.bilibili.com
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.27/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/@arco-design/web-vue@2.55.3/dist/arco-vue.min.js
// @connect      api.bilibili.com
// @connect      bilibili.com
// @connect      hdslb.com
// @connect      mxnzp.com
// @connect      bilivideo.com
// @connect      www.hhlqilongzhu.cn
// @connect      api.52vmy.cn
// @grant        GM_addStyle
// @grant        GM_cookie
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/498677/Wasm%F0%9F%8E%B6%E9%9F%B3%E4%B9%90%E5%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/498677/Wasm%F0%9F%8E%B6%E9%9F%B3%E4%B9%90%E5%A7%AC.meta.js
// ==/UserScript==
// 更新日志[只显示最新的10条,🌟🤡 分别代表新功能和bug修复]
// v0.3.0 🌟 支持默认下载(感谢Super-Dian), 使用FFmpeg-wasm实现更快更准更小的音频嵌入生成
// v0.2.2 🌟 支持无音乐视频下载、支持列表页面歌曲下载、允许跳过歌词
// v0.2.1 🤡 暂时修复部分文件拖拽死循环的问题
// v0.2.0 🌟 支持拖拽音频文件打开视频，编辑歌词就完成剪辑
// v0.0.4 🌟 完成歌词编辑、音频剪辑

(r=>{if(typeof GM_addStyle=="function"){GM_addStyle(r);return}const o=document.createElement("style");o.textContent=r,document.head.append(o)})(' .tag .bgm-tag{display:flex;justify-content:center;align-items:center}.tag .bgm-tag .tag-link{border-top-right-radius:0;border-bottom-right-radius:0}.bilibili-music-root{display:flex;justify-content:center;align-items:center;padding:0 12px;height:100%;height:28px;border-top-right-radius:520px;border-bottom-right-radius:520px;border-left-style:solid;border-left-width:.2px;border-left-color:var(--text1);background:var(--graph_bg_regular)}.bilibili-music-root svg{fill:var(--brand_blue)}.bilibili-music-root:hover svg{fill:var(--success_green)}.custom-checkbox-card{padding:10px 16px;border:1px solid var(--color-border-2);border-radius:4px;width:250px;box-sizing:border-box}.custom-checkbox-card-mask{height:14px;width:14px;display:inline-flex;align-items:center;justify-content:center;border-radius:2px;border:1px solid var(--color-border-2);box-sizing:border-box}.custom-checkbox-card-mask-dot{width:8px;height:8px;border-radius:2px}.custom-checkbox-card-title{color:var(--color-text-1);font-size:14px;font-weight:700;margin-bottom:8px}.custom-checkbox-card:hover,.custom-checkbox-card-checked,.custom-checkbox-card:hover .custom-checkbox-card-mask,.custom-checkbox-card-checked .custom-checkbox-card-mask{border-color:rgb(var(--primary-6))}.custom-checkbox-card-checked{background-color:var(--color-primary-light-1)}.custom-checkbox-card:hover .custom-checkbox-card-title,.custom-checkbox-card-checked .custom-checkbox-card-title{color:rgb(var(--primary-6))}.custom-checkbox-card-checked .custom-checkbox-card-mask-dot{background-color:rgb(var(--primary-6))}.arco-steps-item-active .arco-steps-icon,.arco-btn.arco-btn-primary,.arco-steps-item:not(:last-child).arco-steps-item-finish .arco-steps-item-tail:after{background-color:var(--brand_blue)!important}.arco-btn.arco-btn-primary:hover{filter:brightness(.9)!important;transition:all .3s ease!important}.arco-btn.arco-btn-primary:disabled{filter:brightness(1.3)!important;transition:all .3s ease!important}.arco-modal-body{scrollbar-width:thin}/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}body{margin:0}main{display:block}h1{margin:.67em 0;font-size:2em}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-size:1em;font-family:monospace,monospace}a{background-color:transparent}abbr[title]{text-decoration:underline;text-decoration:underline dotted;border-bottom:none}b,strong{font-weight:bolder}code,kbd,samp{font-size:1em;font-family:monospace,monospace}small{font-size:80%}sub,sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{margin:0;font-size:100%;font-family:inherit;line-height:1.15}button,input{overflow:visible}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button}button::-moz-focus-inner,[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner{padding:0;border-style:none}button:-moz-focusring,[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{display:table;box-sizing:border-box;max-width:100%;padding:0;color:inherit;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{outline-offset:-2px;-webkit-appearance:textfield}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{font:inherit;-webkit-appearance:button}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}.arco-icon{display:inline-block;width:1em;height:1em;color:inherit;font-style:normal;vertical-align:-2px;outline:none;stroke:currentColor}.arco-icon-loading,.arco-icon-spin{animation:arco-loading-circle 1s infinite cubic-bezier(0,0,1,1)}@keyframes arco-loading-circle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.arco-icon-hover{position:relative;display:inline-block;cursor:pointer;line-height:12px}.arco-icon-hover .arco-icon{position:relative}.arco-icon-hover:before{position:absolute;display:block;box-sizing:border-box;background-color:transparent;border-radius:var(--border-radius-circle);transition:background-color .1s cubic-bezier(0,0,1,1);content:""}.arco-icon-hover:hover:before{background-color:var(--color-fill-2)}.arco-icon-hover.arco-icon-hover-disabled:before{opacity:0}.arco-icon-hover:before{top:50%;left:50%;width:20px;height:20px;transform:translate(-50%,-50%)}.arco-icon-hover-size-mini{line-height:12px}.arco-icon-hover-size-mini:before{top:50%;left:50%;width:20px;height:20px;transform:translate(-50%,-50%)}.arco-icon-hover-size-small{line-height:12px}.arco-icon-hover-size-small:before{top:50%;left:50%;width:20px;height:20px;transform:translate(-50%,-50%)}.arco-icon-hover-size-large{line-height:12px}.arco-icon-hover-size-large:before{top:50%;left:50%;width:24px;height:24px;transform:translate(-50%,-50%)}.arco-icon-hover-size-huge{line-height:12px}.arco-icon-hover-size-huge:before{top:50%;left:50%;width:24px;height:24px;transform:translate(-50%,-50%)}.fade-in-standard-enter-from,.fade-in-standard-appear-from{opacity:0}.fade-in-standard-enter-to,.fade-in-standard-appear-to{opacity:1}.fade-in-standard-enter-active,.fade-in-standard-appear-active{transition:opacity .3s cubic-bezier(.34,.69,.1,1)}.fade-in-standard-leave-from{opacity:1}.fade-in-standard-leave-to{opacity:0}.fade-in-standard-leave-active{transition:opacity .3s cubic-bezier(.34,.69,.1,1)}.fade-in-enter-from,.fade-in-appear-from{opacity:0}.fade-in-enter-to,.fade-in-appear-to{opacity:1}.fade-in-enter-active,.fade-in-appear-active{transition:opacity .1s cubic-bezier(0,0,1,1)}.fade-in-leave-from{opacity:1}.fade-in-leave-to{opacity:0}.fade-in-leave-active{transition:opacity .1s cubic-bezier(0,0,1,1)}.zoom-in-enter-from,.zoom-in-appear-from{transform:scale(.5);opacity:0}.zoom-in-enter-to,.zoom-in-appear-to{transform:scale(1);opacity:1}.zoom-in-enter-active,.zoom-in-appear-active{transition:opacity .3s cubic-bezier(.34,.69,.1,1),transform .3s cubic-bezier(.34,.69,.1,1)}.zoom-in-leave-from{transform:scale(1);opacity:1}.zoom-in-leave-to{transform:scale(.5);opacity:0}.zoom-in-leave-active{transition:opacity .3s cubic-bezier(.34,.69,.1,1),transform .3s cubic-bezier(.34,.69,.1,1)}.zoom-in-fade-out-enter-from,.zoom-in-fade-out-appear-from{transform:scale(.5);opacity:0}.zoom-in-fade-out-enter-to,.zoom-in-fade-out-appear-to{transform:scale(1);opacity:1}.zoom-in-fade-out-enter-active,.zoom-in-fade-out-appear-active{transition:opacity .3s cubic-bezier(.3,1.3,.3,1),transform .3s cubic-bezier(.3,1.3,.3,1)}.zoom-in-fade-out-leave-from{transform:scale(1);opacity:1}.zoom-in-fade-out-leave-to{transform:scale(.5);opacity:0}.zoom-in-fade-out-leave-active{transition:opacity .3s cubic-bezier(.3,1.3,.3,1),transform .3s cubic-bezier(.3,1.3,.3,1)}.zoom-in-big-enter-from,.zoom-in-big-appear-from{transform:scale(.5);opacity:0}.zoom-in-big-enter-to,.zoom-in-big-appear-to{transform:scale(1);opacity:1}.zoom-in-big-enter-active,.zoom-in-big-appear-active{transition:opacity .2s cubic-bezier(0,0,1,1),transform .2s cubic-bezier(0,0,1,1)}.zoom-in-big-leave-from{transform:scale(1);opacity:1}.zoom-in-big-leave-to{transform:scale(.2);opacity:0}.zoom-in-big-leave-active{transition:opacity .2s cubic-bezier(0,0,1,1),transform .2s cubic-bezier(0,0,1,1)}.zoom-in-left-enter-from,.zoom-in-left-appear-from{transform:scale(.1);opacity:.1}.zoom-in-left-enter-to,.zoom-in-left-appear-to{transform:scale(1);opacity:1}.zoom-in-left-enter-active,.zoom-in-left-appear-active{transform-origin:0 50%;transition:opacity .3s cubic-bezier(0,0,1,1),transform .3s cubic-bezier(.3,1.3,.3,1)}.zoom-in-left-leave-from{transform:scale(1);opacity:1}.zoom-in-left-leave-to{transform:scale(.1);opacity:.1}.zoom-in-left-leave-active{transform-origin:0 50%;transition:opacity .3s cubic-bezier(0,0,1,1),transform .3s cubic-bezier(.3,1.3,.3,1)}.zoom-in-top-enter-from,.zoom-in-top-appear-from{transform:scaleY(.8) translateZ(0);opacity:0}.zoom-in-top-enter-to,.zoom-in-top-appear-to{transform:scaleY(1) translateZ(0);opacity:1}.zoom-in-top-enter-active,.zoom-in-top-appear-active{transform-origin:0 0;transition:transform .3s cubic-bezier(.3,1.3,.3,1),opacity .3s cubic-bezier(.3,1.3,.3,1)}.zoom-in-top-leave-from{transform:scaleY(1) translateZ(0);opacity:1}.zoom-in-top-leave-to{transform:scaleY(.8) translateZ(0);opacity:0}.zoom-in-top-leave-active{transform-origin:0 0;transition:transform .3s cubic-bezier(.3,1.3,.3,1),opacity .3s cubic-bezier(.3,1.3,.3,1)}.zoom-in-bottom-enter-from,.zoom-in-bottom-appear-from{transform:scaleY(.8) translateZ(0);opacity:0}.zoom-in-bottom-enter-to,.zoom-in-bottom-appear-to{transform:scaleY(1) translateZ(0);opacity:1}.zoom-in-bottom-enter-active,.zoom-in-bottom-appear-active{transform-origin:100% 100%;transition:transform .3s cubic-bezier(.3,1.3,.3,1),opacity .3s cubic-bezier(.3,1.3,.3,1)}.zoom-in-bottom-leave-from{transform:scaleY(1) translateZ(0);opacity:1}.zoom-in-bottom-leave-to{transform:scaleY(.8) translateZ(0);opacity:0}.zoom-in-bottom-leave-active{transform-origin:100% 100%;transition:transform .3s cubic-bezier(.3,1.3,.3,1),opacity .3s cubic-bezier(.3,1.3,.3,1)}.slide-dynamic-origin-enter-from,.slide-dynamic-origin-appear-from{transform:scaleY(.9);transform-origin:0 0;opacity:0}.slide-dynamic-origin-enter-to,.slide-dynamic-origin-appear-to{transform:scaleY(1);transform-origin:0 0;opacity:1}.slide-dynamic-origin-enter-active,.slide-dynamic-origin-appear-active{transition:transform .2s cubic-bezier(.34,.69,.1,1),opacity .2s cubic-bezier(.34,.69,.1,1)}.slide-dynamic-origin-leave-from{transform:scaleY(1);transform-origin:0 0;opacity:1}.slide-dynamic-origin-leave-to{transform:scaleY(.9);transform-origin:0 0;opacity:0}.slide-dynamic-origin-leave-active{transition:transform .2s cubic-bezier(.34,.69,.1,1),opacity .2s cubic-bezier(.34,.69,.1,1)}.slide-left-enter-from,.slide-left-appear-from{transform:translate(-100%)}.slide-left-enter-to,.slide-left-appear-to{transform:translate(0)}.slide-left-enter-active,.slide-left-appear-active{transition:transform .3s cubic-bezier(.34,.69,.1,1)}.slide-left-leave-from{transform:translate(0)}.slide-left-leave-to{transform:translate(-100%)}.slide-left-leave-active{transition:transform .3s cubic-bezier(.34,.69,.1,1)}.slide-right-enter-from,.slide-right-appear-from{transform:translate(100%)}.slide-right-enter-to,.slide-right-appear-to{transform:translate(0)}.slide-right-enter-active,.slide-right-appear-active{transition:transform .3s cubic-bezier(.34,.69,.1,1)}.slide-right-leave-from{transform:translate(0)}.slide-right-leave-to{transform:translate(100%)}.slide-right-leave-active{transition:transform .3s cubic-bezier(.34,.69,.1,1)}.slide-top-enter-from,.slide-top-appear-from{transform:translateY(-100%)}.slide-top-enter-to,.slide-top-appear-to{transform:translateY(0)}.slide-top-enter-active,.slide-top-appear-active{transition:transform .3s cubic-bezier(.34,.69,.1,1)}.slide-top-leave-from{transform:translateY(0)}.slide-top-leave-to{transform:translateY(-100%)}.slide-top-leave-active{transition:transform .3s cubic-bezier(.34,.69,.1,1)}.slide-bottom-enter-from,.slide-bottom-appear-from{transform:translateY(100%)}.slide-bottom-enter-to,.slide-bottom-appear-to{transform:translateY(0)}.slide-bottom-enter-active,.slide-bottom-appear-active{transition:transform .3s cubic-bezier(.34,.69,.1,1)}.slide-bottom-leave-from{transform:translateY(0)}.slide-bottom-leave-to{transform:translateY(100%)}.slide-bottom-leave-active{transition:transform .3s cubic-bezier(.34,.69,.1,1)}body{--red-1: 255,236,232;--red-2: 253,205,197;--red-3: 251,172,163;--red-4: 249,137,129;--red-5: 247,101,96;--red-6: 245,63,63;--red-7: 203,39,45;--red-8: 161,21,30;--red-9: 119,8,19;--red-10: 77,0,10;--orangered-1: 255,243,232;--orangered-2: 253,221,195;--orangered-3: 252,197,159;--orangered-4: 250,172,123;--orangered-5: 249,144,87;--orangered-6: 247,114,52;--orangered-7: 204,81,32;--orangered-8: 162,53,17;--orangered-9: 119,31,6;--orangered-10: 77,14,0;--orange-1: 255,247,232;--orange-2: 255,228,186;--orange-3: 255,207,139;--orange-4: 255,182,93;--orange-5: 255,154,46;--orange-6: 255,125,0;--orange-7: 210,95,0;--orange-8: 166,69,0;--orange-9: 121,46,0;--orange-10: 77,27,0;--gold-1: 255,252,232;--gold-2: 253,244,191;--gold-3: 252,233,150;--gold-4: 250,220,109;--gold-5: 249,204,69;--gold-6: 247,186,30;--gold-7: 204,146,19;--gold-8: 162,109,10;--gold-9: 119,75,4;--gold-10: 77,45,0;--yellow-1: 254,255,232;--yellow-2: 254,254,190;--yellow-3: 253,250,148;--yellow-4: 252,242,107;--yellow-5: 251,232,66;--yellow-6: 250,220,25;--yellow-7: 207,175,15;--yellow-8: 163,132,8;--yellow-9: 120,93,3;--yellow-10: 77,56,0;--lime-1: 252,255,232;--lime-2: 237,248,187;--lime-3: 220,241,144;--lime-4: 201,233,104;--lime-5: 181,226,65;--lime-6: 159,219,29;--lime-7: 126,183,18;--lime-8: 95,148,10;--lime-9: 67,112,4;--lime-10: 42,77,0;--green-1: 232,255,234;--green-2: 175,240,181;--green-3: 123,225,136;--green-4: 76,210,99;--green-5: 35,195,67;--green-6: 0,180,42;--green-7: 0,154,41;--green-8: 0,128,38;--green-9: 0,102,34;--green-10: 0,77,28;--cyan-1: 232,255,251;--cyan-2: 183,244,236;--cyan-3: 137,233,224;--cyan-4: 94,223,214;--cyan-5: 55,212,207;--cyan-6: 20,201,201;--cyan-7: 13,165,170;--cyan-8: 7,130,139;--cyan-9: 3,97,108;--cyan-10: 0,66,77;--blue-1: 232,247,255;--blue-2: 195,231,254;--blue-3: 159,212,253;--blue-4: 123,192,252;--blue-5: 87,169,251;--blue-6: 52,145,250;--blue-7: 32,108,207;--blue-8: 17,75,163;--blue-9: 6,48,120;--blue-10: 0,26,77;--arcoblue-1: 232,243,255;--arcoblue-2: 190,218,255;--arcoblue-3: 148,191,255;--arcoblue-4: 106,161,255;--arcoblue-5: 64,128,255;--arcoblue-6: 22,93,255;--arcoblue-7: 14,66,210;--arcoblue-8: 7,44,166;--arcoblue-9: 3,26,121;--arcoblue-10: 0,13,77;--purple-1: 245,232,255;--purple-2: 221,190,246;--purple-3: 195,150,237;--purple-4: 168,113,227;--purple-5: 141,78,218;--purple-6: 114,46,209;--purple-7: 85,29,176;--purple-8: 60,16,143;--purple-9: 39,6,110;--purple-10: 22,0,77;--pinkpurple-1: 255,232,251;--pinkpurple-2: 247,186,239;--pinkpurple-3: 240,142,230;--pinkpurple-4: 232,101,223;--pinkpurple-5: 225,62,219;--pinkpurple-6: 217,26,217;--pinkpurple-7: 176,16,182;--pinkpurple-8: 138,9,147;--pinkpurple-9: 101,3,112;--pinkpurple-10: 66,0,77;--magenta-1: 255,232,241;--magenta-2: 253,194,219;--magenta-3: 251,157,199;--magenta-4: 249,121,183;--magenta-5: 247,84,168;--magenta-6: 245,49,157;--magenta-7: 203,30,131;--magenta-8: 161,16,105;--magenta-9: 119,6,79;--magenta-10: 77,0,52;--gray-1: 247,248,250;--gray-2: 242,243,245;--gray-3: 229,230,235;--gray-4: 201,205,212;--gray-5: 169,174,184;--gray-6: 134,144,156;--gray-7: 107,119,133;--gray-8: 78,89,105;--gray-9: 39,46,59;--gray-10: 29,33,41;--success-1: var(--green-1);--success-2: var(--green-2);--success-3: var(--green-3);--success-4: var(--green-4);--success-5: var(--green-5);--success-6: var(--green-6);--success-7: var(--green-7);--success-8: var(--green-8);--success-9: var(--green-9);--success-10: var(--green-10);--primary-1: var(--arcoblue-1);--primary-2: var(--arcoblue-2);--primary-3: var(--arcoblue-3);--primary-4: var(--arcoblue-4);--primary-5: var(--arcoblue-5);--primary-6: var(--arcoblue-6);--primary-7: var(--arcoblue-7);--primary-8: var(--arcoblue-8);--primary-9: var(--arcoblue-9);--primary-10: var(--arcoblue-10);--danger-1: var(--red-1);--danger-2: var(--red-2);--danger-3: var(--red-3);--danger-4: var(--red-4);--danger-5: var(--red-5);--danger-6: var(--red-6);--danger-7: var(--red-7);--danger-8: var(--red-8);--danger-9: var(--red-9);--danger-10: var(--red-10);--warning-1: var(--orange-1);--warning-2: var(--orange-2);--warning-3: var(--orange-3);--warning-4: var(--orange-4);--warning-5: var(--orange-5);--warning-6: var(--orange-6);--warning-7: var(--orange-7);--warning-8: var(--orange-8);--warning-9: var(--orange-9);--warning-10: var(--orange-10);--link-1: var(--arcoblue-1);--link-2: var(--arcoblue-2);--link-3: var(--arcoblue-3);--link-4: var(--arcoblue-4);--link-5: var(--arcoblue-5);--link-6: var(--arcoblue-6);--link-7: var(--arcoblue-7);--link-8: var(--arcoblue-8);--link-9: var(--arcoblue-9);--link-10: var(--arcoblue-10)}body[arco-theme=dark]{--red-1: 77,0,10;--red-2: 119,6,17;--red-3: 161,22,31;--red-4: 203,46,52;--red-5: 245,78,78;--red-6: 247,105,101;--red-7: 249,141,134;--red-8: 251,176,167;--red-9: 253,209,202;--red-10: 255,240,236;--orangered-1: 77,14,0;--orangered-2: 119,30,5;--orangered-3: 162,55,20;--orangered-4: 204,87,41;--orangered-5: 247,126,69;--orangered-6: 249,146,90;--orangered-7: 250,173,125;--orangered-8: 252,198,161;--orangered-9: 253,222,197;--orangered-10: 255,244,235;--orange-1: 77,27,0;--orange-2: 121,48,4;--orange-3: 166,75,10;--orange-4: 210,105,19;--orange-5: 255,141,31;--orange-6: 255,150,38;--orange-7: 255,179,87;--orange-8: 255,205,135;--orange-9: 255,227,184;--orange-10: 255,247,232;--gold-1: 77,45,0;--gold-2: 119,75,4;--gold-3: 162,111,15;--gold-4: 204,150,31;--gold-5: 247,192,52;--gold-6: 249,204,68;--gold-7: 250,220,108;--gold-8: 252,233,149;--gold-9: 253,244,190;--gold-10: 255,252,232;--yellow-1: 77,56,0;--yellow-2: 120,94,7;--yellow-3: 163,134,20;--yellow-4: 207,179,37;--yellow-5: 250,225,60;--yellow-6: 251,233,75;--yellow-7: 252,243,116;--yellow-8: 253,250,157;--yellow-9: 254,254,198;--yellow-10: 254,255,240;--lime-1: 42,77,0;--lime-2: 68,112,6;--lime-3: 98,148,18;--lime-4: 132,183,35;--lime-5: 168,219,57;--lime-6: 184,226,75;--lime-7: 203,233,112;--lime-8: 222,241,152;--lime-9: 238,248,194;--lime-10: 253,255,238;--green-1: 0,77,28;--green-2: 4,102,37;--green-3: 10,128,45;--green-4: 18,154,55;--green-5: 29,180,64;--green-6: 39,195,70;--green-7: 80,210,102;--green-8: 126,225,139;--green-9: 178,240,183;--green-10: 235,255,236;--cyan-1: 0,66,77;--cyan-2: 6,97,108;--cyan-3: 17,131,139;--cyan-4: 31,166,170;--cyan-5: 48,201,201;--cyan-6: 63,212,207;--cyan-7: 102,223,215;--cyan-8: 144,233,225;--cyan-9: 190,244,237;--cyan-10: 240,255,252;--blue-1: 0,26,77;--blue-2: 5,47,120;--blue-3: 19,76,163;--blue-4: 41,113,207;--blue-5: 70,154,250;--blue-6: 90,170,251;--blue-7: 125,193,252;--blue-8: 161,213,253;--blue-9: 198,232,254;--blue-10: 234,248,255;--arcoblue-1: 0,13,77;--arcoblue-2: 4,27,121;--arcoblue-3: 14,50,166;--arcoblue-4: 29,77,210;--arcoblue-5: 48,111,255;--arcoblue-6: 60,126,255;--arcoblue-7: 104,159,255;--arcoblue-8: 147,190,255;--arcoblue-9: 190,218,255;--arcoblue-10: 234,244,255;--purple-1: 22,0,77;--purple-2: 39,6,110;--purple-3: 62,19,143;--purple-4: 90,37,176;--purple-5: 123,61,209;--purple-6: 142,81,218;--purple-7: 169,116,227;--purple-8: 197,154,237;--purple-9: 223,194,246;--purple-10: 247,237,255;--pinkpurple-1: 66,0,77;--pinkpurple-2: 101,3,112;--pinkpurple-3: 138,13,147;--pinkpurple-4: 176,27,182;--pinkpurple-5: 217,46,217;--pinkpurple-6: 225,61,219;--pinkpurple-7: 232,102,223;--pinkpurple-8: 240,146,230;--pinkpurple-9: 247,193,240;--pinkpurple-10: 255,242,253;--magenta-1: 77,0,52;--magenta-2: 119,8,80;--magenta-3: 161,23,108;--magenta-4: 203,43,136;--magenta-5: 245,69,166;--magenta-6: 247,86,169;--magenta-7: 249,122,184;--magenta-8: 251,158,200;--magenta-9: 253,195,219;--magenta-10: 255,232,241;--gray-1: 23,23,26;--gray-2: 46,46,48;--gray-3: 72,72,73;--gray-4: 95,95,96;--gray-5: 120,120,122;--gray-6: 146,146,147;--gray-7: 171,171,172;--gray-8: 197,197,197;--gray-9: 223,223,223;--gray-10: 246,246,246;--primary-1: var(--arcoblue-1);--primary-2: var(--arcoblue-2);--primary-3: var(--arcoblue-3);--primary-4: var(--arcoblue-4);--primary-5: var(--arcoblue-5);--primary-6: var(--arcoblue-6);--primary-7: var(--arcoblue-7);--primary-8: var(--arcoblue-8);--primary-9: var(--arcoblue-9);--primary-10: var(--arcoblue-10);--success-1: var(--green-1);--success-2: var(--green-2);--success-3: var(--green-3);--success-4: var(--green-4);--success-5: var(--green-5);--success-6: var(--green-6);--success-7: var(--green-7);--success-8: var(--green-8);--success-9: var(--green-9);--success-10: var(--green-10);--danger-1: var(--red-1);--danger-2: var(--red-2);--danger-3: var(--red-3);--danger-4: var(--red-4);--danger-5: var(--red-5);--danger-6: var(--red-6);--danger-7: var(--red-7);--danger-8: var(--red-8);--danger-9: var(--red-9);--danger-10: var(--red-10);--warning-1: var(--orange-1);--warning-2: var(--orange-2);--warning-3: var(--orange-3);--warning-4: var(--orange-4);--warning-5: var(--orange-5);--warning-6: var(--orange-6);--warning-7: var(--orange-7);--warning-8: var(--orange-8);--warning-9: var(--orange-9);--warning-10: var(--orange-10);--link-1: var(--arcoblue-1);--link-2: var(--arcoblue-2);--link-3: var(--arcoblue-3);--link-4: var(--arcoblue-4);--link-5: var(--arcoblue-5);--link-6: var(--arcoblue-6);--link-7: var(--arcoblue-7);--link-8: var(--arcoblue-8);--link-9: var(--arcoblue-9);--link-10: var(--arcoblue-10)}body{--color-white: #ffffff;--color-black: #000000;--color-border: rgb(var(--gray-3));--color-bg-popup: var(--color-bg-5);--color-bg-1: #fff;--color-bg-2: #fff;--color-bg-3: #fff;--color-bg-4: #fff;--color-bg-5: #fff;--color-bg-white: #fff;--color-neutral-1: rgb(var(--gray-1));--color-neutral-2: rgb(var(--gray-2));--color-neutral-3: rgb(var(--gray-3));--color-neutral-4: rgb(var(--gray-4));--color-neutral-5: rgb(var(--gray-5));--color-neutral-6: rgb(var(--gray-6));--color-neutral-7: rgb(var(--gray-7));--color-neutral-8: rgb(var(--gray-8));--color-neutral-9: rgb(var(--gray-9));--color-neutral-10: rgb(var(--gray-10));--color-text-1: var(--color-neutral-10);--color-text-2: var(--color-neutral-8);--color-text-3: var(--color-neutral-6);--color-text-4: var(--color-neutral-4);--color-border-1: var(--color-neutral-2);--color-border-2: var(--color-neutral-3);--color-border-3: var(--color-neutral-4);--color-border-4: var(--color-neutral-6);--color-fill-1: var(--color-neutral-1);--color-fill-2: var(--color-neutral-2);--color-fill-3: var(--color-neutral-3);--color-fill-4: var(--color-neutral-4);--color-primary-light-1: rgb(var(--primary-1));--color-primary-light-2: rgb(var(--primary-2));--color-primary-light-3: rgb(var(--primary-3));--color-primary-light-4: rgb(var(--primary-4));--color-link-light-1: rgb(var(--link-1));--color-link-light-2: rgb(var(--link-2));--color-link-light-3: rgb(var(--link-3));--color-link-light-4: rgb(var(--link-4));--color-secondary: var(--color-neutral-2);--color-secondary-hover: var(--color-neutral-3);--color-secondary-active: var(--color-neutral-4);--color-secondary-disabled: var(--color-neutral-1);--color-danger-light-1: rgb(var(--danger-1));--color-danger-light-2: rgb(var(--danger-2));--color-danger-light-3: rgb(var(--danger-3));--color-danger-light-4: rgb(var(--danger-4));--color-success-light-1: rgb(var(--success-1));--color-success-light-2: rgb(var(--success-2));--color-success-light-3: rgb(var(--success-3));--color-success-light-4: rgb(var(--success-4));--color-warning-light-1: rgb(var(--warning-1));--color-warning-light-2: rgb(var(--warning-2));--color-warning-light-3: rgb(var(--warning-3));--color-warning-light-4: rgb(var(--warning-4));--border-radius-none: 0;--border-radius-small: 2px;--border-radius-medium: 4px;--border-radius-large: 8px;--border-radius-circle: 50%;--color-tooltip-bg: rgb(var(--gray-10));--color-spin-layer-bg: rgba(255, 255, 255, .6);--color-menu-dark-bg: #232324;--color-menu-light-bg: #ffffff;--color-menu-dark-hover: rgba(255, 255, 255, .04);--color-mask-bg: rgba(29, 33, 41, .6)}body[arco-theme=dark]{--color-white: rgba(255, 255, 255, .9);--color-black: #000000;--color-border: #333335;--color-bg-1: #17171a;--color-bg-2: #232324;--color-bg-3: #2a2a2b;--color-bg-4: #313132;--color-bg-5: #373739;--color-bg-white: #f6f6f6;--color-text-1: rgba(255, 255, 255, .9);--color-text-2: rgba(255, 255, 255, .7);--color-text-3: rgba(255, 255, 255, .5);--color-text-4: rgba(255, 255, 255, .3);--color-fill-1: rgba(255, 255, 255, .04);--color-fill-2: rgba(255, 255, 255, .08);--color-fill-3: rgba(255, 255, 255, .12);--color-fill-4: rgba(255, 255, 255, .16);--color-primary-light-1: rgba(var(--primary-6), .2);--color-primary-light-2: rgba(var(--primary-6), .35);--color-primary-light-3: rgba(var(--primary-6), .5);--color-primary-light-4: rgba(var(--primary-6), .65);--color-secondary: rgba(var(--gray-9), .08);--color-secondary-hover: rgba(var(--gray-8), .16);--color-secondary-active: rgba(var(--gray-7), .24);--color-secondary-disabled: rgba(var(--gray-9), .08);--color-danger-light-1: rgba(var(--danger-6), .2);--color-danger-light-2: rgba(var(--danger-6), .35);--color-danger-light-3: rgba(var(--danger-6), .5);--color-danger-light-4: rgba(var(--danger-6), .65);--color-success-light-1: rgb(var(--success-6), .2);--color-success-light-2: rgb(var(--success-6), .35);--color-success-light-3: rgb(var(--success-6), .5);--color-success-light-4: rgb(var(--success-6), .65);--color-warning-light-1: rgb(var(--warning-6), .2);--color-warning-light-2: rgb(var(--warning-6), .35);--color-warning-light-3: rgb(var(--warning-6), .5);--color-warning-light-4: rgb(var(--warning-6), .65);--color-link-light-1: rgb(var(--link-6), .2);--color-link-light-2: rgb(var(--link-6), .35);--color-link-light-3: rgb(var(--link-6), .5);--color-link-light-4: rgb(var(--link-6), .65);--color-tooltip-bg: #373739;--color-spin-layer-bg: rgba(51, 51, 51, .6);--color-menu-dark-bg: #232324;--color-menu-light-bg: #232324;--color-menu-dark-hover: var(--color-fill-2);--color-mask-bg: rgba(23, 23, 26, .6)}body{font-size:14px;font-family:Inter,-apple-system,BlinkMacSystemFont,PingFang SC,Hiragino Sans GB,noto sans,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif}.arco-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;font-weight:400;line-height:1.5715;white-space:nowrap;outline:none;cursor:pointer;transition:all .1s cubic-bezier(0,0,1,1);-webkit-appearance:none;-webkit-user-select:none;user-select:none}.arco-btn>a:only-child{color:currentColor}.arco-btn:active{transition:none}.arco-btn-long{display:flex;width:100%}.arco-btn-link{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}.arco-btn-link:not([href]){color:var(--color-text-4)}.arco-btn-link:hover{text-decoration:none}.arco-btn-link.arco-btn-only-icon{display:inline-flex;align-items:center;justify-content:center;vertical-align:top}.arco-btn.arco-btn-only-icon .arco-btn-icon{display:flex;justify-content:center}.arco-btn-loading{position:relative;cursor:default}.arco-btn-loading:before{position:absolute;top:-1px;right:-1px;bottom:-1px;left:-1px;z-index:1;display:block;background:#fff;border-radius:inherit;opacity:.4;transition:opacity .1s cubic-bezier(0,0,1,1);content:"";pointer-events:none}.arco-btn-loading-fixed-width{transition:none}.arco-btn-two-chinese-chars>*:not(svg){margin-right:-.3em;letter-spacing:.3em}.arco-btn-outline,.arco-btn-outline[type=button],.arco-btn-outline[type=submit]{color:rgb(var(--primary-6));background-color:transparent;border:1px solid rgb(var(--primary-6))}.arco-btn-outline:hover,.arco-btn-outline[type=button]:hover,.arco-btn-outline[type=submit]:hover{color:rgb(var(--primary-5));background-color:transparent;border-color:rgb(var(--primary-5))}.arco-btn-outline:focus-visible,.arco-btn-outline[type=button]:focus-visible,.arco-btn-outline[type=submit]:focus-visible{box-shadow:0 0 0 .25em rgb(var(--primary-3))}.arco-btn-outline:active,.arco-btn-outline[type=button]:active,.arco-btn-outline[type=submit]:active{color:rgb(var(--primary-7));background-color:transparent;border-color:rgb(var(--primary-7))}.arco-btn-outline.arco-btn-loading,.arco-btn-outline[type=button].arco-btn-loading,.arco-btn-outline[type=submit].arco-btn-loading{color:rgb(var(--primary-6));background-color:transparent;border:1px solid rgb(var(--primary-6))}.arco-btn-outline.arco-btn-disabled,.arco-btn-outline[type=button].arco-btn-disabled,.arco-btn-outline[type=submit].arco-btn-disabled{color:var(--color-primary-light-3);background-color:transparent;border:1px solid var(--color-primary-light-3);cursor:not-allowed}.arco-btn-outline.arco-btn-status-warning{color:rgb(var(--warning-6));background-color:transparent;border-color:rgb(var(--warning-6))}.arco-btn-outline.arco-btn-status-warning:hover{color:rgb(var(--warning-5));background-color:transparent;border-color:rgb(var(--warning-5))}.arco-btn-outline.arco-btn-status-warning:focus-visible{box-shadow:0 0 0 .25em rgb(var(--warning-3))}.arco-btn-outline.arco-btn-status-warning:active{color:rgb(var(--warning-7));background-color:transparent;border-color:rgb(var(--warning-7))}.arco-btn-outline.arco-btn-status-warning.arco-btn-loading{color:rgb(var(--warning-6));background-color:transparent;border-color:rgb(var(--warning-6))}.arco-btn-outline.arco-btn-status-warning.arco-btn-disabled{color:var(--color-warning-light-3);background-color:transparent;border:1px solid var(--color-warning-light-3)}.arco-btn-outline.arco-btn-status-danger{color:rgb(var(--danger-6));background-color:transparent;border-color:rgb(var(--danger-6))}.arco-btn-outline.arco-btn-status-danger:hover{color:rgb(var(--danger-5));background-color:transparent;border-color:rgb(var(--danger-5))}.arco-btn-outline.arco-btn-status-danger:focus-visible{box-shadow:0 0 0 .25em rgb(var(--danger-3))}.arco-btn-outline.arco-btn-status-danger:active{color:rgb(var(--danger-7));background-color:transparent;border-color:rgb(var(--danger-7))}.arco-btn-outline.arco-btn-status-danger.arco-btn-loading{color:rgb(var(--danger-6));background-color:transparent;border-color:rgb(var(--danger-6))}.arco-btn-outline.arco-btn-status-danger.arco-btn-disabled{color:var(--color-danger-light-3);background-color:transparent;border:1px solid var(--color-danger-light-3)}.arco-btn-outline.arco-btn-status-success{color:rgb(var(--success-6));background-color:transparent;border-color:rgb(var(--success-6))}.arco-btn-outline.arco-btn-status-success:hover{color:rgb(var(--success-5));background-color:transparent;border-color:rgb(var(--success-5))}.arco-btn-outline.arco-btn-status-success:focus-visible{box-shadow:0 0 0 .25em rgb(var(--success-3))}.arco-btn-outline.arco-btn-status-success:active{color:rgb(var(--success-7));background-color:transparent;border-color:rgb(var(--success-7))}.arco-btn-outline.arco-btn-status-success.arco-btn-loading{color:rgb(var(--success-6));background-color:transparent;border-color:rgb(var(--success-6))}.arco-btn-outline.arco-btn-status-success.arco-btn-disabled{color:var(--color-success-light-3);background-color:transparent;border:1px solid var(--color-success-light-3)}.arco-btn-primary,.arco-btn-primary[type=button],.arco-btn-primary[type=submit]{color:#fff;background-color:rgb(var(--primary-6));border:1px solid transparent}.arco-btn-primary:hover,.arco-btn-primary[type=button]:hover,.arco-btn-primary[type=submit]:hover{color:#fff;background-color:rgb(var(--primary-5));border-color:transparent}.arco-btn-primary:focus-visible,.arco-btn-primary[type=button]:focus-visible,.arco-btn-primary[type=submit]:focus-visible{box-shadow:0 0 0 .25em rgb(var(--primary-3))}.arco-btn-primary:active,.arco-btn-primary[type=button]:active,.arco-btn-primary[type=submit]:active{color:#fff;background-color:rgb(var(--primary-7));border-color:transparent}.arco-btn-primary.arco-btn-loading,.arco-btn-primary[type=button].arco-btn-loading,.arco-btn-primary[type=submit].arco-btn-loading{color:#fff;background-color:rgb(var(--primary-6));border:1px solid transparent}.arco-btn-primary.arco-btn-disabled,.arco-btn-primary[type=button].arco-btn-disabled,.arco-btn-primary[type=submit].arco-btn-disabled{color:#fff;background-color:var(--color-primary-light-3);border:1px solid transparent;cursor:not-allowed}.arco-btn-primary.arco-btn-status-warning{color:#fff;background-color:rgb(var(--warning-6));border-color:transparent}.arco-btn-primary.arco-btn-status-warning:hover{color:#fff;background-color:rgb(var(--warning-5));border-color:transparent}.arco-btn-primary.arco-btn-status-warning:focus-visible{box-shadow:0 0 0 .25em rgb(var(--warning-3))}.arco-btn-primary.arco-btn-status-warning:active{color:#fff;background-color:rgb(var(--warning-7));border-color:transparent}.arco-btn-primary.arco-btn-status-warning.arco-btn-loading{color:#fff;background-color:rgb(var(--warning-6));border-color:transparent}.arco-btn-primary.arco-btn-status-warning.arco-btn-disabled{color:#fff;background-color:var(--color-warning-light-3);border:1px solid transparent}.arco-btn-primary.arco-btn-status-danger{color:#fff;background-color:rgb(var(--danger-6));border-color:transparent}.arco-btn-primary.arco-btn-status-danger:hover{color:#fff;background-color:rgb(var(--danger-5));border-color:transparent}.arco-btn-primary.arco-btn-status-danger:focus-visible{box-shadow:0 0 0 .25em rgb(var(--danger-3))}.arco-btn-primary.arco-btn-status-danger:active{color:#fff;background-color:rgb(var(--danger-7));border-color:transparent}.arco-btn-primary.arco-btn-status-danger.arco-btn-loading{color:#fff;background-color:rgb(var(--danger-6));border-color:transparent}.arco-btn-primary.arco-btn-status-danger.arco-btn-disabled{color:#fff;background-color:var(--color-danger-light-3);border:1px solid transparent}.arco-btn-primary.arco-btn-status-success{color:#fff;background-color:rgb(var(--success-6));border-color:transparent}.arco-btn-primary.arco-btn-status-success:hover{color:#fff;background-color:rgb(var(--success-5));border-color:transparent}.arco-btn-primary.arco-btn-status-success:focus-visible{box-shadow:0 0 0 .25em rgb(var(--success-3))}.arco-btn-primary.arco-btn-status-success:active{color:#fff;background-color:rgb(var(--success-7));border-color:transparent}.arco-btn-primary.arco-btn-status-success.arco-btn-loading{color:#fff;background-color:rgb(var(--success-6));border-color:transparent}.arco-btn-primary.arco-btn-status-success.arco-btn-disabled{color:#fff;background-color:var(--color-success-light-3);border:1px solid transparent}.arco-btn-secondary,.arco-btn-secondary[type=button],.arco-btn-secondary[type=submit]{color:var(--color-text-2);background-color:var(--color-secondary);border:1px solid transparent}.arco-btn-secondary:hover,.arco-btn-secondary[type=button]:hover,.arco-btn-secondary[type=submit]:hover{color:var(--color-text-2);background-color:var(--color-secondary-hover);border-color:transparent}.arco-btn-secondary:focus-visible,.arco-btn-secondary[type=button]:focus-visible,.arco-btn-secondary[type=submit]:focus-visible{box-shadow:0 0 0 .25em var(--color-neutral-4)}.arco-btn-secondary:active,.arco-btn-secondary[type=button]:active,.arco-btn-secondary[type=submit]:active{color:var(--color-text-2);background-color:var(--color-secondary-active);border-color:transparent}.arco-btn-secondary.arco-btn-loading,.arco-btn-secondary[type=button].arco-btn-loading,.arco-btn-secondary[type=submit].arco-btn-loading{color:var(--color-text-2);background-color:var(--color-secondary);border:1px solid transparent}.arco-btn-secondary.arco-btn-disabled,.arco-btn-secondary[type=button].arco-btn-disabled,.arco-btn-secondary[type=submit].arco-btn-disabled{color:var(--color-text-4);background-color:var(--color-secondary-disabled);border:1px solid transparent;cursor:not-allowed}.arco-btn-secondary.arco-btn-status-warning{color:rgb(var(--warning-6));background-color:var(--color-warning-light-1);border-color:transparent}.arco-btn-secondary.arco-btn-status-warning:hover{color:rgb(var(--warning-6));background-color:var(--color-warning-light-2);border-color:transparent}.arco-btn-secondary.arco-btn-status-warning:focus-visible{box-shadow:0 0 0 .25em rgb(var(--warning-3))}.arco-btn-secondary.arco-btn-status-warning:active{color:rgb(var(--warning-6));background-color:var(--color-warning-light-3);border-color:transparent}.arco-btn-secondary.arco-btn-status-warning.arco-btn-loading{color:rgb(var(--warning-6));background-color:var(--color-warning-light-1);border-color:transparent}.arco-btn-secondary.arco-btn-status-warning.arco-btn-disabled{color:var(--color-warning-light-3);background-color:var(--color-warning-light-1);border:1px solid transparent}.arco-btn-secondary.arco-btn-status-danger{color:rgb(var(--danger-6));background-color:var(--color-danger-light-1);border-color:transparent}.arco-btn-secondary.arco-btn-status-danger:hover{color:rgb(var(--danger-6));background-color:var(--color-danger-light-2);border-color:transparent}.arco-btn-secondary.arco-btn-status-danger:focus-visible{box-shadow:0 0 0 .25em rgb(var(--danger-3))}.arco-btn-secondary.arco-btn-status-danger:active{color:rgb(var(--danger-6));background-color:var(--color-danger-light-3);border-color:transparent}.arco-btn-secondary.arco-btn-status-danger.arco-btn-loading{color:rgb(var(--danger-6));background-color:var(--color-danger-light-1);border-color:transparent}.arco-btn-secondary.arco-btn-status-danger.arco-btn-disabled{color:var(--color-danger-light-3);background-color:var(--color-danger-light-1);border:1px solid transparent}.arco-btn-secondary.arco-btn-status-success{color:rgb(var(--success-6));background-color:var(--color-success-light-1);border-color:transparent}.arco-btn-secondary.arco-btn-status-success:hover{color:rgb(var(--success-6));background-color:var(--color-success-light-2);border-color:transparent}.arco-btn-secondary.arco-btn-status-success:focus-visible{box-shadow:0 0 0 .25em rgb(var(--success-3))}.arco-btn-secondary.arco-btn-status-success:active{color:rgb(var(--success-6));background-color:var(--color-success-light-3);border-color:transparent}.arco-btn-secondary.arco-btn-status-success.arco-btn-loading{color:rgb(var(--success-6));background-color:var(--color-success-light-1);border-color:transparent}.arco-btn-secondary.arco-btn-status-success.arco-btn-disabled{color:var(--color-success-light-3);background-color:var(--color-success-light-1);border:1px solid transparent}.arco-btn-dashed,.arco-btn-dashed[type=button],.arco-btn-dashed[type=submit]{color:var(--color-text-2);background-color:var(--color-fill-2);border:1px dashed var(--color-neutral-3)}.arco-btn-dashed:hover,.arco-btn-dashed[type=button]:hover,.arco-btn-dashed[type=submit]:hover{color:var(--color-text-2);background-color:var(--color-fill-3);border-color:var(--color-neutral-4)}.arco-btn-dashed:focus-visible,.arco-btn-dashed[type=button]:focus-visible,.arco-btn-dashed[type=submit]:focus-visible{box-shadow:0 0 0 .25em var(--color-neutral-4)}.arco-btn-dashed:active,.arco-btn-dashed[type=button]:active,.arco-btn-dashed[type=submit]:active{color:var(--color-text-2);background-color:var(--color-fill-4);border-color:var(--color-neutral-5)}.arco-btn-dashed.arco-btn-loading,.arco-btn-dashed[type=button].arco-btn-loading,.arco-btn-dashed[type=submit].arco-btn-loading{color:var(--color-text-2);background-color:var(--color-fill-2);border:1px dashed var(--color-neutral-3)}.arco-btn-dashed.arco-btn-disabled,.arco-btn-dashed[type=button].arco-btn-disabled,.arco-btn-dashed[type=submit].arco-btn-disabled{color:var(--color-text-4);background-color:var(--color-fill-2);border:1px dashed var(--color-neutral-3);cursor:not-allowed}.arco-btn-dashed.arco-btn-status-warning{color:rgb(var(--warning-6));background-color:var(--color-warning-light-1);border-color:var(--color-warning-light-2)}.arco-btn-dashed.arco-btn-status-warning:hover{color:rgb(var(--warning-6));background-color:var(--color-warning-light-2);border-color:var(--color-warning-light-3)}.arco-btn-dashed.arco-btn-status-warning:focus-visible{box-shadow:0 0 0 .25em rgb(var(--warning-3))}.arco-btn-dashed.arco-btn-status-warning:active{color:rgb(var(--warning-6));background-color:var(--color-warning-light-3);border-color:var(--color-warning-light-4)}.arco-btn-dashed.arco-btn-status-warning.arco-btn-loading{color:rgb(var(--warning-6));background-color:var(--color-warning-light-1);border-color:var(--color-warning-light-2)}.arco-btn-dashed.arco-btn-status-warning.arco-btn-disabled{color:var(--color-warning-light-3);background-color:var(--color-warning-light-1);border:1px dashed var(--color-warning-light-2)}.arco-btn-dashed.arco-btn-status-danger{color:rgb(var(--danger-6));background-color:var(--color-danger-light-1);border-color:var(--color-danger-light-2)}.arco-btn-dashed.arco-btn-status-danger:hover{color:rgb(var(--danger-6));background-color:var(--color-danger-light-2);border-color:var(--color-danger-light-3)}.arco-btn-dashed.arco-btn-status-danger:focus-visible{box-shadow:0 0 0 .25em rgb(var(--danger-3))}.arco-btn-dashed.arco-btn-status-danger:active{color:rgb(var(--danger-6));background-color:var(--color-danger-light-3);border-color:var(--color-danger-light-4)}.arco-btn-dashed.arco-btn-status-danger.arco-btn-loading{color:rgb(var(--danger-6));background-color:var(--color-danger-light-1);border-color:var(--color-danger-light-2)}.arco-btn-dashed.arco-btn-status-danger.arco-btn-disabled{color:var(--color-danger-light-3);background-color:var(--color-danger-light-1);border:1px dashed var(--color-danger-light-2)}.arco-btn-dashed.arco-btn-status-success{color:rgb(var(--success-6));background-color:var(--color-success-light-1);border-color:var(--color-success-light-2)}.arco-btn-dashed.arco-btn-status-success:hover{color:rgb(var(--success-6));background-color:var(--color-success-light-2);border-color:var(--color-success-light-3)}.arco-btn-dashed.arco-btn-status-success:focus-visible{box-shadow:0 0 0 .25em rgb(var(--success-3))}.arco-btn-dashed.arco-btn-status-success:active{color:rgb(var(--success-6));background-color:var(--color-success-light-3);border-color:var(--color-success-light-4)}.arco-btn-dashed.arco-btn-status-success.arco-btn-loading{color:rgb(var(--success-6));background-color:var(--color-success-light-1);border-color:var(--color-success-light-2)}.arco-btn-dashed.arco-btn-status-success.arco-btn-disabled{color:var(--color-success-light-3);background-color:var(--color-success-light-1);border:1px dashed var(--color-success-light-2)}.arco-btn-text,.arco-btn-text[type=button],.arco-btn-text[type=submit]{color:rgb(var(--primary-6));background-color:transparent;border:1px solid transparent}.arco-btn-text:hover,.arco-btn-text[type=button]:hover,.arco-btn-text[type=submit]:hover{color:rgb(var(--primary-6));background-color:var(--color-fill-2);border-color:transparent}.arco-btn-text:focus-visible,.arco-btn-text[type=button]:focus-visible,.arco-btn-text[type=submit]:focus-visible{box-shadow:0 0 0 .25em var(--color-neutral-4)}.arco-btn-text:active,.arco-btn-text[type=button]:active,.arco-btn-text[type=submit]:active{color:rgb(var(--primary-6));background-color:var(--color-fill-3);border-color:transparent}.arco-btn-text.arco-btn-loading,.arco-btn-text[type=button].arco-btn-loading,.arco-btn-text[type=submit].arco-btn-loading{color:rgb(var(--primary-6));background-color:transparent;border:1px solid transparent}.arco-btn-text.arco-btn-disabled,.arco-btn-text[type=button].arco-btn-disabled,.arco-btn-text[type=submit].arco-btn-disabled{color:var(--color-primary-light-3);background-color:transparent;border:1px solid transparent;cursor:not-allowed}.arco-btn-text.arco-btn-status-warning{color:rgb(var(--warning-6));background-color:transparent;border-color:transparent}.arco-btn-text.arco-btn-status-warning:hover{color:rgb(var(--warning-6));background-color:var(--color-fill-2);border-color:transparent}.arco-btn-text.arco-btn-status-warning:focus-visible{box-shadow:0 0 0 .25em rgb(var(--warning-3))}.arco-btn-text.arco-btn-status-warning:active{color:rgb(var(--warning-6));background-color:var(--color-fill-3);border-color:transparent}.arco-btn-text.arco-btn-status-warning.arco-btn-loading{color:rgb(var(--warning-6));background-color:transparent;border-color:transparent}.arco-btn-text.arco-btn-status-warning.arco-btn-disabled{color:var(--color-warning-light-3);background-color:transparent;border:1px solid transparent}.arco-btn-text.arco-btn-status-danger{color:rgb(var(--danger-6));background-color:transparent;border-color:transparent}.arco-btn-text.arco-btn-status-danger:hover{color:rgb(var(--danger-6));background-color:var(--color-fill-2);border-color:transparent}.arco-btn-text.arco-btn-status-danger:focus-visible{box-shadow:0 0 0 .25em rgb(var(--danger-3))}.arco-btn-text.arco-btn-status-danger:active{color:rgb(var(--danger-6));background-color:var(--color-fill-3);border-color:transparent}.arco-btn-text.arco-btn-status-danger.arco-btn-loading{color:rgb(var(--danger-6));background-color:transparent;border-color:transparent}.arco-btn-text.arco-btn-status-danger.arco-btn-disabled{color:var(--color-danger-light-3);background-color:transparent;border:1px solid transparent}.arco-btn-text.arco-btn-status-success{color:rgb(var(--success-6));background-color:transparent;border-color:transparent}.arco-btn-text.arco-btn-status-success:hover{color:rgb(var(--success-6));background-color:var(--color-fill-2);border-color:transparent}.arco-btn-text.arco-btn-status-success:focus-visible{box-shadow:0 0 0 .25em rgb(var(--success-3))}.arco-btn-text.arco-btn-status-success:active{color:rgb(var(--success-6));background-color:var(--color-fill-3);border-color:transparent}.arco-btn-text.arco-btn-status-success.arco-btn-loading{color:rgb(var(--success-6));background-color:transparent;border-color:transparent}.arco-btn-text.arco-btn-status-success.arco-btn-disabled{color:var(--color-success-light-3);background-color:transparent;border:1px solid transparent}.arco-btn-size-mini{height:24px;padding:0 11px;font-size:12px;border-radius:var(--border-radius-small)}.arco-btn-size-mini:not(.arco-btn-only-icon) .arco-btn-icon{margin-right:4px}.arco-btn-size-mini svg{vertical-align:-1px}.arco-btn-size-mini.arco-btn-loading-fixed-width.arco-btn-loading{padding-right:3px;padding-left:3px}.arco-btn-size-mini.arco-btn-only-icon{width:24px;height:24px;padding:0}.arco-btn-size-mini.arco-btn-shape-circle{width:24px;height:24px;padding:0;text-align:center;border-radius:var(--border-radius-circle)}.arco-btn-size-mini.arco-btn-shape-round{border-radius:12px}.arco-btn-size-small{height:28px;padding:0 15px;font-size:14px;border-radius:var(--border-radius-small)}.arco-btn-size-small:not(.arco-btn-only-icon) .arco-btn-icon{margin-right:6px}.arco-btn-size-small svg{vertical-align:-2px}.arco-btn-size-small.arco-btn-loading-fixed-width.arco-btn-loading{padding-right:5px;padding-left:5px}.arco-btn-size-small.arco-btn-only-icon{width:28px;height:28px;padding:0}.arco-btn-size-small.arco-btn-shape-circle{width:28px;height:28px;padding:0;text-align:center;border-radius:var(--border-radius-circle)}.arco-btn-size-small.arco-btn-shape-round{border-radius:14px}.arco-btn-size-medium{height:32px;padding:0 15px;font-size:14px;border-radius:var(--border-radius-small)}.arco-btn-size-medium:not(.arco-btn-only-icon) .arco-btn-icon{margin-right:8px}.arco-btn-size-medium svg{vertical-align:-2px}.arco-btn-size-medium.arco-btn-loading-fixed-width.arco-btn-loading{padding-right:4px;padding-left:4px}.arco-btn-size-medium.arco-btn-only-icon{width:32px;height:32px;padding:0}.arco-btn-size-medium.arco-btn-shape-circle{width:32px;height:32px;padding:0;text-align:center;border-radius:var(--border-radius-circle)}.arco-btn-size-medium.arco-btn-shape-round{border-radius:16px}.arco-btn-size-large{height:36px;padding:0 19px;font-size:14px;border-radius:var(--border-radius-small)}.arco-btn-size-large:not(.arco-btn-only-icon) .arco-btn-icon{margin-right:8px}.arco-btn-size-large svg{vertical-align:-2px}.arco-btn-size-large.arco-btn-loading-fixed-width.arco-btn-loading{padding-right:8px;padding-left:8px}.arco-btn-size-large.arco-btn-only-icon{width:36px;height:36px;padding:0}.arco-btn-size-large.arco-btn-shape-circle{width:36px;height:36px;padding:0;text-align:center;border-radius:var(--border-radius-circle)}.arco-btn-size-large.arco-btn-shape-round{border-radius:18px}.arco-btn-group{display:inline-flex;align-items:center}.arco-btn-group .arco-btn-outline:not(:first-child),.arco-btn-group .arco-btn-dashed:not(:first-child){margin-left:-1px}.arco-btn-group .arco-btn-primary:not(:last-child){border-right:1px solid rgb(var(--primary-5))}.arco-btn-group .arco-btn-secondary:not(:last-child){border-right:1px solid var(--color-secondary-hover)}.arco-btn-group .arco-btn-status-warning:not(:last-child){border-right:1px solid rgb(var(--warning-5))}.arco-btn-group .arco-btn-status-danger:not(:last-child){border-right:1px solid rgb(var(--danger-5))}.arco-btn-group .arco-btn-status-success:not(:last-child){border-right:1px solid rgb(var(--success-5))}.arco-btn-group .arco-btn-outline:hover,.arco-btn-group .arco-btn-dashed:hover,.arco-btn-group .arco-btn-outline:active,.arco-btn-group .arco-btn-dashed:active{z-index:2}.arco-btn-group .arco-btn:first-child{border-top-right-radius:0;border-bottom-right-radius:0}.arco-btn-group .arco-btn:last-child{border-top-left-radius:0;border-bottom-left-radius:0}.arco-btn-group .arco-btn:not(:first-child):not(:last-child){border-radius:0}body[arco-theme=dark] .arco-btn-primary.arco-btn-disabled{color:#ffffff4d}.arco-modal-container{position:fixed;top:0;right:0;bottom:0;left:0}.arco-modal-mask{position:absolute;top:0;right:0;bottom:0;left:0;background-color:var(--color-mask-bg)}.arco-modal-wrapper{position:absolute;top:0;right:0;bottom:0;left:0;overflow:auto;text-align:center}.arco-modal-wrapper.arco-modal-wrapper-align-center{white-space:nowrap}.arco-modal-wrapper.arco-modal-wrapper-align-center:after{display:inline-block;width:0;height:100%;vertical-align:middle;content:""}.arco-modal-wrapper.arco-modal-wrapper-align-center .arco-modal{top:0;vertical-align:middle}.arco-modal-wrapper.arco-modal-wrapper-moved{text-align:left}.arco-modal-wrapper.arco-modal-wrapper-moved .arco-modal{top:0;vertical-align:top}.arco-modal{position:relative;top:100px;display:inline-block;width:520px;margin:0 auto;line-height:1.5715;white-space:initial;text-align:left;background-color:var(--color-bg-3);border-radius:var(--border-radius-medium)}.arco-modal-draggable .arco-modal-header{cursor:move}.arco-modal-header{display:flex;flex-shrink:0;align-items:center;box-sizing:border-box;width:100%;height:48px;padding:0 20px;border-bottom:1px solid var(--color-neutral-3)}.arco-modal-header .arco-modal-title{display:flex;flex:1;align-items:center;justify-content:center}.arco-modal-header .arco-modal-title-align-start{justify-content:flex-start}.arco-modal-header .arco-modal-title-align-center{justify-content:center}.arco-modal-body{position:relative;padding:24px 20px;overflow:auto;color:var(--color-text-1);font-size:14px}.arco-modal-footer{flex-shrink:0;box-sizing:border-box;width:100%;padding:16px 20px;text-align:right;border-top:1px solid var(--color-neutral-3)}.arco-modal-footer>.arco-btn:not(:nth-child(1)){margin-left:12px}.arco-modal-close-btn{margin-left:-12px;color:var(--color-text-1);font-size:12px;cursor:pointer}.arco-modal-title{color:var(--color-text-1);font-weight:500;font-size:16px}.arco-modal-title-icon{margin-right:10px;font-size:18px;vertical-align:-.15em}.arco-modal-title-icon .arco-icon-info-circle-fill{color:rgb(var(--primary-6))}.arco-modal-title-icon .arco-icon-check-circle-fill{color:rgb(var(--success-6))}.arco-modal-title-icon .arco-icon-exclamation-circle-fill{color:rgb(var(--warning-6))}.arco-modal-title-icon .arco-icon-close-circle-fill{color:rgb(var(--danger-6))}.arco-modal-simple{width:400px;padding:24px 32px 32px}.arco-modal-simple .arco-modal-header,.arco-modal-simple .arco-modal-footer{height:unset;padding:0;border:none}.arco-modal-simple .arco-modal-header{margin-bottom:24px}.arco-modal-simple .arco-modal-title{justify-content:center}.arco-modal-simple .arco-modal-title-align-start{justify-content:flex-start}.arco-modal-simple .arco-modal-title-align-center{justify-content:center}.arco-modal-simple .arco-modal-footer{margin-top:32px;text-align:center}.arco-modal-simple .arco-modal-body{padding:0}.arco-modal-fullscreen{top:0;display:inline-flex;flex-direction:column;box-sizing:border-box;width:100%;height:100%}.arco-modal-fullscreen .arco-modal-footer{margin-top:auto}.zoom-modal-enter-from,.zoom-modal-appear-from{transform:scale(.5);opacity:0}.zoom-modal-enter-to,.zoom-modal-appear-to{transform:scale(1);opacity:1}.zoom-modal-enter-active,.zoom-modal-appear-active{transition:opacity .4s cubic-bezier(.3,1.3,.3,1),transform .4s cubic-bezier(.3,1.3,.3,1)}.zoom-modal-leave-from{transform:scale(1);opacity:1}.zoom-modal-leave-to{transform:scale(.5);opacity:0}.zoom-modal-leave-active{transition:opacity .4s cubic-bezier(.3,1.3,.3,1),transform .4s cubic-bezier(.3,1.3,.3,1)}.fade-modal-enter-from,.fade-modal-appear-from{opacity:0}.fade-modal-enter-to,.fade-modal-appear-to{opacity:1}.fade-modal-enter-active,.fade-modal-appear-active{transition:opacity .4s cubic-bezier(.3,1.3,.3,1)}.fade-modal-leave-from{opacity:1}.fade-modal-leave-to{opacity:0}.fade-modal-leave-active{transition:opacity .4s cubic-bezier(.3,1.3,.3,1)}.arco-result{box-sizing:border-box;width:100%;padding:32px 32px 24px}.arco-result-icon{margin-bottom:16px;font-size:20px;text-align:center}.arco-result-icon-tip{display:flex;width:45px;height:45px;align-items:center;justify-content:center;border-radius:50%;margin:0 auto}.arco-result-icon-custom .arco-result-icon-tip{font-size:45px;color:inherit;width:unset;height:unset}.arco-result-icon-success .arco-result-icon-tip{color:rgb(var(--success-6));background-color:var(--color-success-light-1)}.arco-result-icon-error .arco-result-icon-tip{color:rgb(var(--danger-6));background-color:var(--color-danger-light-1)}.arco-result-icon-info .arco-result-icon-tip{color:rgb(var(--primary-6));background-color:var(--color-primary-light-1)}.arco-result-icon-warning .arco-result-icon-tip{color:rgb(var(--warning-6));background-color:var(--color-warning-light-1)}.arco-result-icon-404,.arco-result-icon-403,.arco-result-icon-500{padding-top:24px}.arco-result-icon-404 .arco-result-icon-tip,.arco-result-icon-403 .arco-result-icon-tip,.arco-result-icon-500 .arco-result-icon-tip{width:92px;height:92px;line-height:92px}.arco-result-title{color:var(--color-text-1);font-weight:500;font-size:14px;line-height:1.5715;text-align:center}.arco-result-subtitle{color:var(--color-text-2);font-size:14px;line-height:1.5715;text-align:center}.arco-result-extra{margin-top:20px;text-align:center}.arco-result-content{margin-top:20px}.arco-steps-item{position:relative;flex:1;margin-right:12px;overflow:hidden;white-space:nowrap;text-align:left}.arco-steps-item:last-child{flex:none;margin-right:0}.arco-steps-item-active .arco-steps-item-title{font-weight:500}.arco-steps-item-node{display:inline-block;margin-right:12px;font-weight:500;font-size:16px;vertical-align:top}.arco-steps-icon{box-sizing:border-box;width:28px;height:28px;line-height:26px;text-align:center;border-radius:var(--border-radius-circle);font-size:16px}.arco-steps-item-wait .arco-steps-icon{color:var(--color-text-2);background-color:var(--color-fill-2);border:1px solid transparent}.arco-steps-item-process .arco-steps-icon{color:var(--color-white);background-color:rgb(var(--primary-6));border:1px solid transparent}.arco-steps-item-finish .arco-steps-icon{color:rgb(var(--primary-6));background-color:var(--color-primary-light-1);border:1px solid transparent}.arco-steps-item-error .arco-steps-icon{color:var(--color-white);background-color:rgb(var(--danger-6));border:1px solid transparent}.arco-steps-item-title{position:relative;display:inline-block;padding-right:12px;color:var(--color-text-2);font-size:16px;line-height:28px;white-space:nowrap}.arco-steps-item-wait .arco-steps-item-title{color:var(--color-text-2)}.arco-steps-item-process .arco-steps-item-title,.arco-steps-item-finish .arco-steps-item-title,.arco-steps-item-error .arco-steps-item-title{color:var(--color-text-1)}.arco-steps-item-content{display:inline-block}.arco-steps-item-description{max-width:140px;margin-top:2px;color:var(--color-text-3);font-size:12px;white-space:normal}.arco-steps-item-wait .arco-steps-item-description,.arco-steps-item-process .arco-steps-item-description,.arco-steps-item-finish .arco-steps-item-description,.arco-steps-item-error .arco-steps-item-description{color:var(--color-text-3)}.arco-steps-label-horizontal .arco-steps-item:not(:last-child) .arco-steps-item-title:after{position:absolute;top:13.5px;left:100%;display:block;box-sizing:border-box;width:5000px;height:1px;background-color:var(--color-neutral-3);content:""}.arco-steps-label-horizontal .arco-steps-item.arco-steps-item-process .arco-steps-item-title:after{background-color:var(--color-neutral-3)}.arco-steps-label-horizontal .arco-steps-item.arco-steps-item-finish .arco-steps-item-title:after{background-color:rgb(var(--primary-6))}.arco-steps-label-horizontal .arco-steps-item.arco-steps-item-next-error .arco-steps-item-title:after{background-color:rgb(var(--danger-6))}.arco-steps-item:not(:last-child) .arco-steps-item-tail{position:absolute;top:13.5px;box-sizing:border-box;width:100%;height:1px}.arco-steps-item:not(:last-child) .arco-steps-item-tail:after{display:block;width:100%;height:100%;background-color:var(--color-neutral-3);content:""}.arco-steps-vertical .arco-steps-item:not(:last-child) .arco-steps-item-tail{position:absolute;top:0;left:13.5px;box-sizing:border-box;width:1px;height:100%;padding:34px 0 6px}.arco-steps-vertical .arco-steps-item:not(:last-child) .arco-steps-item-tail:after{display:block;width:100%;height:100%;background-color:var(--color-neutral-3);content:""}.arco-steps-size-small.arco-steps-vertical .arco-steps-item:not(:last-child) .arco-steps-item-tail{left:11.5px;padding:30px 0 6px}.arco-steps-item:not(:last-child).arco-steps-item-finish .arco-steps-item-tail:after{background-color:rgb(var(--primary-6))}.arco-steps-item:not(:last-child).arco-steps-item-next-error .arco-steps-item-tail:after{background-color:rgb(var(--danger-6))}.arco-steps-size-small:not(.arco-steps-vertical) .arco-steps-item:not(:last-child) .arco-steps-item-tail{top:11.5px}.arco-steps-size-small .arco-steps-item-node{font-size:14px}.arco-steps-size-small .arco-steps-item-title{font-size:14px;line-height:24px}.arco-steps-size-small .arco-steps-item-description{font-size:12px}.arco-steps-size-small .arco-steps-icon{width:24px;height:24px;font-size:14px;line-height:22px}.arco-steps-size-small.arco-steps-label-horizontal .arco-steps-item:not(:last-child) .arco-steps-item-title:after{top:11.5px}.arco-steps-label-vertical .arco-steps-item{overflow:visible}.arco-steps-label-vertical .arco-steps-item-title{margin-top:2px;padding-right:0}.arco-steps-label-vertical .arco-steps-item-node{margin-left:56px}.arco-steps-label-vertical .arco-steps-item-tail{left:96px;padding-right:40px}.arco-steps-label-vertical.arco-steps-size-small .arco-steps-item-node{margin-left:58px}.arco-steps-label-vertical.arco-steps-size-small .arco-steps-item-tail{left:94px;padding-right:36px}.arco-steps-mode-dot .arco-steps-item{position:relative;flex:1;margin-right:16px;overflow:visible;white-space:nowrap;text-align:left}.arco-steps-mode-dot .arco-steps-item:last-child{flex:none;margin-right:0}.arco-steps-mode-dot .arco-steps-item-active .arco-steps-item-title{font-weight:500}.arco-steps-mode-dot .arco-steps-item-node{display:inline-block;box-sizing:border-box;width:8px;height:8px;vertical-align:top;border-radius:var(--border-radius-circle)}.arco-steps-mode-dot .arco-steps-item-active .arco-steps-item-node{width:10px;height:10px}.arco-steps-mode-dot .arco-steps-item-wait .arco-steps-item-node{background-color:var(--color-fill-4);border-color:var(--color-fill-4)}.arco-steps-mode-dot .arco-steps-item-process .arco-steps-item-node,.arco-steps-mode-dot .arco-steps-item-finish .arco-steps-item-node{background-color:rgb(var(--primary-6));border-color:rgb(var(--primary-6))}.arco-steps-mode-dot .arco-steps-item-error .arco-steps-item-node{background-color:rgb(var(--danger-6));border-color:rgb(var(--danger-6))}.arco-steps-mode-dot.arco-steps-horizontal .arco-steps-item-node{margin-left:66px}.arco-steps-mode-dot.arco-steps-horizontal .arco-steps-item-active .arco-steps-item-node{margin-top:-1px;margin-left:65px}.arco-steps-mode-dot .arco-steps-item-content{display:inline-block}.arco-steps-mode-dot .arco-steps-item-title{position:relative;display:inline-block;margin-top:4px;font-size:16px}.arco-steps-mode-dot .arco-steps-item-wait .arco-steps-item-title{color:var(--color-text-2)}.arco-steps-mode-dot .arco-steps-item-process .arco-steps-item-title,.arco-steps-mode-dot .arco-steps-item-finish .arco-steps-item-title,.arco-steps-mode-dot .arco-steps-item-error .arco-steps-item-title{color:var(--color-text-1)}.arco-steps-mode-dot .arco-steps-item-description{margin-top:4px;font-size:12px;white-space:normal}.arco-steps-mode-dot .arco-steps-item-wait .arco-steps-item-description,.arco-steps-mode-dot .arco-steps-item-process .arco-steps-item-description,.arco-steps-mode-dot .arco-steps-item-finish .arco-steps-item-description,.arco-steps-mode-dot .arco-steps-item-error .arco-steps-item-description{color:var(--color-text-3)}.arco-steps-mode-dot .arco-steps-item:not(:last-child) .arco-steps-item-tail{position:absolute;top:3.5px;left:78px;box-sizing:border-box;width:100%;height:1px;background-color:var(--color-neutral-3)}.arco-steps-mode-dot .arco-steps-item:not(:last-child).arco-steps-item-process .arco-steps-item-tail{background-color:var(--color-neutral-3)}.arco-steps-mode-dot .arco-steps-item:not(:last-child).arco-steps-item-finish .arco-steps-item-tail{background-color:rgb(var(--primary-6))}.arco-steps-mode-dot .arco-steps-item:not(:last-child).arco-steps-item-next-error .arco-steps-item-tail{background-color:rgb(var(--danger-6))}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item-node{margin-right:16px}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item-content{overflow:hidden}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item-title{margin-top:-2px}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item-description{margin-top:4px}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item:not(:last-child) .arco-steps-item-tail{position:absolute;bottom:0;left:4px;box-sizing:border-box;width:1px;height:100%;padding-top:16px;padding-bottom:2px;background-color:transparent;transform:translate(-50%)}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item:not(:last-child) .arco-steps-item-tail:after{display:block;width:100%;height:100%;background-color:var(--color-neutral-3);content:""}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item:not(:last-child).arco-steps-item-process .arco-steps-item-tail:after{background-color:var(--color-neutral-3)}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item:not(:last-child).arco-steps-item-finish .arco-steps-item-tail:after{background-color:rgb(var(--primary-6))}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item:not(:last-child).arco-steps-item-next-error .arco-steps-item-tail:after{background-color:rgb(var(--danger-6))}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item .arco-steps-item-node{margin-top:8px}.arco-steps-mode-dot.arco-steps-vertical .arco-steps-item-active .arco-steps-item-node{margin-top:6px;margin-left:-1px}.arco-steps-mode-arrow .arco-steps-item{position:relative;display:flex;flex:1;align-items:center;height:72px;overflow:visible;white-space:nowrap}.arco-steps-mode-arrow .arco-steps-item:not(:last-child){margin-right:4px}.arco-steps-mode-arrow .arco-steps-item-wait{background-color:var(--color-fill-1)}.arco-steps-mode-arrow .arco-steps-item-process{background-color:rgb(var(--primary-6))}.arco-steps-mode-arrow .arco-steps-item-finish{background-color:var(--color-primary-light-1)}.arco-steps-mode-arrow .arco-steps-item-error{background-color:rgb(var(--danger-6))}.arco-steps-mode-arrow .arco-steps-item-content{display:inline-block;box-sizing:border-box}.arco-steps-mode-arrow .arco-steps-item:first-child .arco-steps-item-content{padding-left:16px}.arco-steps-mode-arrow .arco-steps-item:not(:first-child) .arco-steps-item-content{padding-left:52px}.arco-steps-mode-arrow .arco-steps-item-title{position:relative;display:inline-block;font-size:16px;white-space:nowrap}.arco-steps-mode-arrow .arco-steps-item-title:after{display:none!important}.arco-steps-mode-arrow .arco-steps-item-wait .arco-steps-item-title{color:var(--color-text-2)}.arco-steps-mode-arrow .arco-steps-item-process .arco-steps-item-title{color:var(--color-white)}.arco-steps-mode-arrow .arco-steps-item-finish .arco-steps-item-title{color:var(--color-text-1)}.arco-steps-mode-arrow .arco-steps-item-error .arco-steps-item-title{color:var(--color-white)}.arco-steps-mode-arrow .arco-steps-item-active .arco-steps-item-title{font-weight:500}.arco-steps-mode-arrow .arco-steps-item-description{max-width:none;margin-top:0;font-size:12px;white-space:nowrap}.arco-steps-mode-arrow .arco-steps-item-wait .arco-steps-item-description{color:var(--color-text-3)}.arco-steps-mode-arrow .arco-steps-item-process .arco-steps-item-description{color:var(--color-white)}.arco-steps-mode-arrow .arco-steps-item-finish .arco-steps-item-description{color:var(--color-text-3)}.arco-steps-mode-arrow .arco-steps-item-error .arco-steps-item-description{color:var(--color-white)}.arco-steps-mode-arrow .arco-steps-item:not(:first-child):before{position:absolute;top:0;left:0;z-index:1;display:block;width:0;height:0;border-top:36px solid transparent;border-bottom:36px solid transparent;border-left:36px solid var(--color-bg-2);content:""}.arco-steps-mode-arrow .arco-steps-item:not(:last-child):after{position:absolute;top:0;right:-36px;z-index:2;display:block;clear:both;width:0;height:0;border-top:36px solid transparent;border-bottom:36px solid transparent;content:""}.arco-steps-mode-arrow .arco-steps-item:not(:last-child).arco-steps-item-wait:after{border-left:36px solid var(--color-fill-1)}.arco-steps-mode-arrow .arco-steps-item:not(:last-child).arco-steps-item-process:after{border-left:36px solid rgb(var(--primary-6))}.arco-steps-mode-arrow .arco-steps-item:not(:last-child).arco-steps-item-error:after{border-left:36px solid rgb(var(--danger-6))}.arco-steps-mode-arrow .arco-steps-item:not(:last-child).arco-steps-item-finish:after{border-left:36px solid var(--color-primary-light-1)}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item{height:40px}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item-title{font-size:14px}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item-description{display:none}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item:not(:first-child):before{border-top:20px solid transparent;border-bottom:20px solid transparent;border-left:20px solid var(--color-bg-2)}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item:not(:last-child):after{right:-20px;border-top:20px solid transparent;border-bottom:20px solid transparent;border-left:20px solid var(--color-fill-1)}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item:first-child .arco-steps-item-content{padding-left:20px}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item:not(:first-child) .arco-steps-item-content{padding-left:40px}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item-error:not(:last-child):after{border-left:20px solid rgb(var(--danger-6))}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item:not(:last-child).arco-steps-item-wait:after{border-left:20px solid var(--color-fill-1)}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item:not(:last-child).arco-steps-item-process:after{border-left:20px solid rgb(var(--primary-6))}.arco-steps-mode-arrow.arco-steps-size-small .arco-steps-item:not(:last-child).arco-steps-item-finish:after{border-left:20px solid var(--color-primary-light-1)}.arco-steps-mode-navigation.arco-steps-label-horizontal .arco-steps-item:not(:last-child) .arco-steps-item-title:after{display:none}.arco-steps-mode-navigation .arco-steps-item{padding-left:20px;padding-right:10px;margin-right:32px}.arco-steps-mode-navigation .arco-steps-item:last-child{flex:1}.arco-steps-mode-navigation .arco-steps-item-content{margin-bottom:20px}.arco-steps-mode-navigation .arco-steps-item-description{padding-right:20px}.arco-steps-mode-navigation .arco-steps-item-active:after{content:"";position:absolute;display:block;height:2px;left:0;right:30px;bottom:0;background-color:rgb(var(--primary-6))}.arco-steps-mode-navigation .arco-steps-item-active:last-child:after{width:100%}.arco-steps-mode-navigation .arco-steps-item:not(:last-child) .arco-steps-item-content:after{position:absolute;top:10px;right:30px;display:inline-block;width:6px;height:6px;background-color:var(--color-bg-2);border:2px solid var(--color-text-4);border-bottom:none;border-left:none;-webkit-transform:rotate(45deg);transform:rotate(45deg);content:""}.arco-steps{display:flex}.arco-steps-changeable .arco-steps-item-title,.arco-steps-changeable .arco-steps-item-description{transition:all .1s cubic-bezier(0,0,1,1)}.arco-steps-changeable .arco-steps-item:not(.arco-steps-item-active):not(.arco-steps-item-disabled){cursor:pointer}.arco-steps-changeable .arco-steps-item:not(.arco-steps-item-active):not(.arco-steps-item-disabled):hover .arco-steps-item-content .arco-steps-item-title,.arco-steps-changeable .arco-steps-item:not(.arco-steps-item-active):not(.arco-steps-item-disabled):hover .arco-steps-item-content .arco-steps-item-description{color:rgb(var(--primary-6))}.arco-steps-line-less .arco-steps-item-title:after{display:none!important}.arco-steps-vertical{flex-direction:column}.arco-steps-vertical .arco-steps-item:not(:last-child){min-height:90px}.arco-steps-vertical .arco-steps-item-title:after{display:none!important}.arco-steps-vertical .arco-steps-item-description{max-width:none}.arco-steps-label-vertical .arco-steps-item-content{display:block;width:140px;text-align:center}.arco-steps-label-vertical .arco-steps-item-description{max-width:none}.arco-space{display:inline-flex}.arco-space-horizontal .arco-space-item{display:flex;align-items:center}.arco-space-vertical{flex-direction:column}.arco-space-align-baseline{align-items:baseline}.arco-space-align-start{align-items:flex-start}.arco-space-align-end{align-items:flex-end}.arco-space-align-center{align-items:center}.arco-space-wrap{flex-wrap:wrap}.arco-space-fill{display:flex}.arco-message-list{position:fixed;z-index:1003;display:flex;flex-direction:column;align-items:center;box-sizing:border-box;width:100%;margin:0;padding:0 10px;text-align:center;pointer-events:none}.arco-message-list-top{top:40px}.arco-message-list-bottom{bottom:40px}.arco-message{position:relative;display:inline-flex;align-items:center;margin-bottom:16px;padding:10px 16px;overflow:hidden;line-height:1;text-align:center;list-style:none;background-color:var(--color-bg-popup);border:1px solid var(--color-neutral-3);border-radius:var(--border-radius-small);box-shadow:0 4px 10px #0000001a;transition:all .1s cubic-bezier(0,0,1,1);pointer-events:auto}.arco-message-icon{display:inline-block;margin-right:8px;color:var(--color-text-1);font-size:20px;vertical-align:middle;animation:arco-msg-fade .1s cubic-bezier(0,0,1,1),arco-msg-fade .4s cubic-bezier(.3,1.3,.3,1)}.arco-message-content{font-size:14px;color:var(--color-text-1);vertical-align:middle}.arco-message-info{background-color:var(--color-bg-popup);border-color:var(--color-neutral-3)}.arco-message-info .arco-message-icon{color:rgb(var(--primary-6))}.arco-message-info .arco-message-content{color:var(--color-text-1)}.arco-message-success{background-color:var(--color-bg-popup);border-color:var(--color-neutral-3)}.arco-message-success .arco-message-icon{color:rgb(var(--success-6))}.arco-message-success .arco-message-content{color:var(--color-text-1)}.arco-message-warning{background-color:var(--color-bg-popup);border-color:var(--color-neutral-3)}.arco-message-warning .arco-message-icon{color:rgb(var(--warning-6))}.arco-message-warning .arco-message-content{color:var(--color-text-1)}.arco-message-error{background-color:var(--color-bg-popup);border-color:var(--color-neutral-3)}.arco-message-error .arco-message-icon{color:rgb(var(--danger-6))}.arco-message-error .arco-message-content{color:var(--color-text-1)}.arco-message-loading{background-color:var(--color-bg-popup);border-color:var(--color-neutral-3)}.arco-message-loading .arco-message-icon{color:rgb(var(--primary-6))}.arco-message-loading .arco-message-content{color:var(--color-text-1)}.arco-message-close-btn{margin-left:8px;color:var(--color-text-1);font-size:12px}.arco-message .arco-icon-hover.arco-message-icon-hover:before{width:20px;height:20px}.fade-message-enter-from,.fade-message-appear-from{opacity:0}.fade-message-enter-to,.fade-message-appear-to{opacity:1}.fade-message-enter-active,.fade-message-appear-active{transition:opacity .1s cubic-bezier(0,0,1,1)}.fade-message-leave-from{opacity:1}.fade-message-leave-to{opacity:0}.fade-message-leave-active{position:absolute}.flip-list-move{transition:transform .8s ease}@keyframes arco-msg-fade{0%{opacity:0}to{opacity:1}}@keyframes arco-msg-scale{0%{transform:scale(0)}to{transform:scale(1)}}.arco-trigger-wrapper{display:inline-block}.arco-trigger-popup{position:absolute;z-index:1000}.arco-trigger-arrow{position:absolute;z-index:-1;display:block;box-sizing:border-box;width:8px;height:8px;background-color:var(--color-bg-5);content:""}.arco-trigger-popup[trigger-placement=top] .arco-trigger-arrow,.arco-trigger-popup[trigger-placement=tl] .arco-trigger-arrow,.arco-trigger-popup[trigger-placement=tr] .arco-trigger-arrow{border-top:none;border-left:none;border-bottom-right-radius:var(--border-radius-small)}.arco-trigger-popup[trigger-placement=bottom] .arco-trigger-arrow,.arco-trigger-popup[trigger-placement=bl] .arco-trigger-arrow,.arco-trigger-popup[trigger-placement=br] .arco-trigger-arrow{border-right:none;border-bottom:none;border-top-left-radius:var(--border-radius-small)}.arco-trigger-popup[trigger-placement=left] .arco-trigger-arrow,.arco-trigger-popup[trigger-placement=lt] .arco-trigger-arrow,.arco-trigger-popup[trigger-placement=lb] .arco-trigger-arrow{border-bottom:none;border-left:none;border-top-right-radius:var(--border-radius-small)}.arco-trigger-popup[trigger-placement=right] .arco-trigger-arrow,.arco-trigger-popup[trigger-placement=rt] .arco-trigger-arrow,.arco-trigger-popup[trigger-placement=rb] .arco-trigger-arrow{border-top:none;border-right:none;border-bottom-left-radius:var(--border-radius-small)}.arco-tooltip-content{max-width:350px;padding:8px 12px;color:#fff;font-size:14px;line-height:1.5715;text-align:left;word-wrap:break-word;background-color:var(--color-tooltip-bg);border-radius:var(--border-radius-small)}.arco-tooltip-mini{padding:4px 12px;font-size:14px}.arco-tooltip-popup-arrow{background-color:var(--color-tooltip-bg)}[data-v-196f6236]{white-space:pre-wrap}.audio[data-v-196f6236]{display:flex;align-items:center;flex-direction:column}.loader[data-v-196f6236]{--front-color: var(--brand_blue);--back-color: #c3c8de;--text-color: #414856;width:100%;height:64px;border-radius:50px;position:relative;display:flex;justify-content:center;align-items:center;margin-bottom:15px}.loader svg[data-v-196f6236]{position:absolute;display:flex;justify-content:center;align-items:center}.loader svg circle[data-v-196f6236]{position:absolute;fill:none;stroke-width:6px;stroke-linecap:round;stroke-linejoin:round;transform:rotate(-100deg);transform-origin:center}.loader svg circle.back[data-v-196f6236]{stroke:var(--back-color)}.loader svg circle.front[data-v-196f6236]{stroke:var(--front-color)}.loader svg.circle-outer[data-v-196f6236]{height:86px;width:86px}.loader svg.circle-outer circle[data-v-196f6236]{stroke-dasharray:62.75 188.25}.loader svg.circle-outer circle.back[data-v-196f6236]{animation:circle-outer135-196f6236 1.8s ease infinite .3s}.loader svg.circle-outer circle.front[data-v-196f6236]{animation:circle-outer135-196f6236 1.8s ease infinite .15s}.loader svg.circle-middle[data-v-196f6236]{height:60px;width:60px}.loader svg.circle-middle circle[data-v-196f6236]{stroke-dasharray:42.5 127.5}.loader svg.circle-middle circle.back[data-v-196f6236]{animation:circle-middle6123-196f6236 1.8s ease infinite .25s}.loader svg.circle-middle circle.front[data-v-196f6236]{animation:circle-middle6123-196f6236 1.8s ease infinite .1s}.loader svg.circle-inner[data-v-196f6236]{height:34px;width:34px}.loader svg.circle-inner circle[data-v-196f6236]{stroke-dasharray:22 66}.loader svg.circle-inner circle.back[data-v-196f6236]{animation:circle-inner162-196f6236 1.8s ease infinite .2s}.loader svg.circle-inner circle.front[data-v-196f6236]{animation:circle-inner162-196f6236 1.8s ease infinite .05s}@keyframes circle-outer135-196f6236{0%{stroke-dashoffset:25}25%{stroke-dashoffset:0}65%{stroke-dashoffset:301}80%{stroke-dashoffset:276}to{stroke-dashoffset:276}}@keyframes circle-middle6123-196f6236{0%{stroke-dashoffset:17}25%{stroke-dashoffset:0}65%{stroke-dashoffset:204}80%{stroke-dashoffset:187}to{stroke-dashoffset:187}}@keyframes circle-inner162-196f6236{0%{stroke-dashoffset:9}25%{stroke-dashoffset:0}65%{stroke-dashoffset:106}80%{stroke-dashoffset:97}to{stroke-dashoffset:97}}.arco-row{display:flex;flex-flow:row wrap}.arco-row-nowrap{flex-wrap:nowrap}.arco-row-align-start{align-items:flex-start}.arco-row-align-center{align-items:center}.arco-row-align-end{align-items:flex-end}.arco-row-justify-start{justify-content:flex-start}.arco-row-justify-center{justify-content:center}.arco-row-justify-end{justify-content:flex-end}.arco-row-justify-space-around{justify-content:space-around}.arco-row-justify-space-between{justify-content:space-between}.arco-col{box-sizing:border-box}.arco-col-1{flex:0 0 4.16666667%;width:4.16666667%}.arco-col-2{flex:0 0 8.33333333%;width:8.33333333%}.arco-col-3{flex:0 0 12.5%;width:12.5%}.arco-col-4{flex:0 0 16.66666667%;width:16.66666667%}.arco-col-5{flex:0 0 20.83333333%;width:20.83333333%}.arco-col-6{flex:0 0 25%;width:25%}.arco-col-7{flex:0 0 29.16666667%;width:29.16666667%}.arco-col-8{flex:0 0 33.33333333%;width:33.33333333%}.arco-col-9{flex:0 0 37.5%;width:37.5%}.arco-col-10{flex:0 0 41.66666667%;width:41.66666667%}.arco-col-11{flex:0 0 45.83333333%;width:45.83333333%}.arco-col-12{flex:0 0 50%;width:50%}.arco-col-13{flex:0 0 54.16666667%;width:54.16666667%}.arco-col-14{flex:0 0 58.33333333%;width:58.33333333%}.arco-col-15{flex:0 0 62.5%;width:62.5%}.arco-col-16{flex:0 0 66.66666667%;width:66.66666667%}.arco-col-17{flex:0 0 70.83333333%;width:70.83333333%}.arco-col-18{flex:0 0 75%;width:75%}.arco-col-19{flex:0 0 79.16666667%;width:79.16666667%}.arco-col-20{flex:0 0 83.33333333%;width:83.33333333%}.arco-col-21{flex:0 0 87.5%;width:87.5%}.arco-col-22{flex:0 0 91.66666667%;width:91.66666667%}.arco-col-23{flex:0 0 95.83333333%;width:95.83333333%}.arco-col-24{flex:0 0 100%;width:100%}.arco-col-offset-1{margin-left:4.16666667%}.arco-col-offset-2{margin-left:8.33333333%}.arco-col-offset-3{margin-left:12.5%}.arco-col-offset-4{margin-left:16.66666667%}.arco-col-offset-5{margin-left:20.83333333%}.arco-col-offset-6{margin-left:25%}.arco-col-offset-7{margin-left:29.16666667%}.arco-col-offset-8{margin-left:33.33333333%}.arco-col-offset-9{margin-left:37.5%}.arco-col-offset-10{margin-left:41.66666667%}.arco-col-offset-11{margin-left:45.83333333%}.arco-col-offset-12{margin-left:50%}.arco-col-offset-13{margin-left:54.16666667%}.arco-col-offset-14{margin-left:58.33333333%}.arco-col-offset-15{margin-left:62.5%}.arco-col-offset-16{margin-left:66.66666667%}.arco-col-offset-17{margin-left:70.83333333%}.arco-col-offset-18{margin-left:75%}.arco-col-offset-19{margin-left:79.16666667%}.arco-col-offset-20{margin-left:83.33333333%}.arco-col-offset-21{margin-left:87.5%}.arco-col-offset-22{margin-left:91.66666667%}.arco-col-offset-23{margin-left:95.83333333%}.arco-col-order-1{order:1}.arco-col-order-2{order:2}.arco-col-order-3{order:3}.arco-col-order-4{order:4}.arco-col-order-5{order:5}.arco-col-order-6{order:6}.arco-col-order-7{order:7}.arco-col-order-8{order:8}.arco-col-order-9{order:9}.arco-col-order-10{order:10}.arco-col-order-11{order:11}.arco-col-order-12{order:12}.arco-col-order-13{order:13}.arco-col-order-14{order:14}.arco-col-order-15{order:15}.arco-col-order-16{order:16}.arco-col-order-17{order:17}.arco-col-order-18{order:18}.arco-col-order-19{order:19}.arco-col-order-20{order:20}.arco-col-order-21{order:21}.arco-col-order-22{order:22}.arco-col-order-23{order:23}.arco-col-order-24{order:24}.arco-col-xs-1{flex:0 0 4.16666667%;width:4.16666667%}.arco-col-xs-2{flex:0 0 8.33333333%;width:8.33333333%}.arco-col-xs-3{flex:0 0 12.5%;width:12.5%}.arco-col-xs-4{flex:0 0 16.66666667%;width:16.66666667%}.arco-col-xs-5{flex:0 0 20.83333333%;width:20.83333333%}.arco-col-xs-6{flex:0 0 25%;width:25%}.arco-col-xs-7{flex:0 0 29.16666667%;width:29.16666667%}.arco-col-xs-8{flex:0 0 33.33333333%;width:33.33333333%}.arco-col-xs-9{flex:0 0 37.5%;width:37.5%}.arco-col-xs-10{flex:0 0 41.66666667%;width:41.66666667%}.arco-col-xs-11{flex:0 0 45.83333333%;width:45.83333333%}.arco-col-xs-12{flex:0 0 50%;width:50%}.arco-col-xs-13{flex:0 0 54.16666667%;width:54.16666667%}.arco-col-xs-14{flex:0 0 58.33333333%;width:58.33333333%}.arco-col-xs-15{flex:0 0 62.5%;width:62.5%}.arco-col-xs-16{flex:0 0 66.66666667%;width:66.66666667%}.arco-col-xs-17{flex:0 0 70.83333333%;width:70.83333333%}.arco-col-xs-18{flex:0 0 75%;width:75%}.arco-col-xs-19{flex:0 0 79.16666667%;width:79.16666667%}.arco-col-xs-20{flex:0 0 83.33333333%;width:83.33333333%}.arco-col-xs-21{flex:0 0 87.5%;width:87.5%}.arco-col-xs-22{flex:0 0 91.66666667%;width:91.66666667%}.arco-col-xs-23{flex:0 0 95.83333333%;width:95.83333333%}.arco-col-xs-24{flex:0 0 100%;width:100%}.arco-col-xs-offset-1{margin-left:4.16666667%}.arco-col-xs-offset-2{margin-left:8.33333333%}.arco-col-xs-offset-3{margin-left:12.5%}.arco-col-xs-offset-4{margin-left:16.66666667%}.arco-col-xs-offset-5{margin-left:20.83333333%}.arco-col-xs-offset-6{margin-left:25%}.arco-col-xs-offset-7{margin-left:29.16666667%}.arco-col-xs-offset-8{margin-left:33.33333333%}.arco-col-xs-offset-9{margin-left:37.5%}.arco-col-xs-offset-10{margin-left:41.66666667%}.arco-col-xs-offset-11{margin-left:45.83333333%}.arco-col-xs-offset-12{margin-left:50%}.arco-col-xs-offset-13{margin-left:54.16666667%}.arco-col-xs-offset-14{margin-left:58.33333333%}.arco-col-xs-offset-15{margin-left:62.5%}.arco-col-xs-offset-16{margin-left:66.66666667%}.arco-col-xs-offset-17{margin-left:70.83333333%}.arco-col-xs-offset-18{margin-left:75%}.arco-col-xs-offset-19{margin-left:79.16666667%}.arco-col-xs-offset-20{margin-left:83.33333333%}.arco-col-xs-offset-21{margin-left:87.5%}.arco-col-xs-offset-22{margin-left:91.66666667%}.arco-col-xs-offset-23{margin-left:95.83333333%}.arco-col-xs-order-1{order:1}.arco-col-xs-order-2{order:2}.arco-col-xs-order-3{order:3}.arco-col-xs-order-4{order:4}.arco-col-xs-order-5{order:5}.arco-col-xs-order-6{order:6}.arco-col-xs-order-7{order:7}.arco-col-xs-order-8{order:8}.arco-col-xs-order-9{order:9}.arco-col-xs-order-10{order:10}.arco-col-xs-order-11{order:11}.arco-col-xs-order-12{order:12}.arco-col-xs-order-13{order:13}.arco-col-xs-order-14{order:14}.arco-col-xs-order-15{order:15}.arco-col-xs-order-16{order:16}.arco-col-xs-order-17{order:17}.arco-col-xs-order-18{order:18}.arco-col-xs-order-19{order:19}.arco-col-xs-order-20{order:20}.arco-col-xs-order-21{order:21}.arco-col-xs-order-22{order:22}.arco-col-xs-order-23{order:23}.arco-col-xs-order-24{order:24}@media (min-width: 576px){.arco-col-sm-1{flex:0 0 4.16666667%;width:4.16666667%}.arco-col-sm-2{flex:0 0 8.33333333%;width:8.33333333%}.arco-col-sm-3{flex:0 0 12.5%;width:12.5%}.arco-col-sm-4{flex:0 0 16.66666667%;width:16.66666667%}.arco-col-sm-5{flex:0 0 20.83333333%;width:20.83333333%}.arco-col-sm-6{flex:0 0 25%;width:25%}.arco-col-sm-7{flex:0 0 29.16666667%;width:29.16666667%}.arco-col-sm-8{flex:0 0 33.33333333%;width:33.33333333%}.arco-col-sm-9{flex:0 0 37.5%;width:37.5%}.arco-col-sm-10{flex:0 0 41.66666667%;width:41.66666667%}.arco-col-sm-11{flex:0 0 45.83333333%;width:45.83333333%}.arco-col-sm-12{flex:0 0 50%;width:50%}.arco-col-sm-13{flex:0 0 54.16666667%;width:54.16666667%}.arco-col-sm-14{flex:0 0 58.33333333%;width:58.33333333%}.arco-col-sm-15{flex:0 0 62.5%;width:62.5%}.arco-col-sm-16{flex:0 0 66.66666667%;width:66.66666667%}.arco-col-sm-17{flex:0 0 70.83333333%;width:70.83333333%}.arco-col-sm-18{flex:0 0 75%;width:75%}.arco-col-sm-19{flex:0 0 79.16666667%;width:79.16666667%}.arco-col-sm-20{flex:0 0 83.33333333%;width:83.33333333%}.arco-col-sm-21{flex:0 0 87.5%;width:87.5%}.arco-col-sm-22{flex:0 0 91.66666667%;width:91.66666667%}.arco-col-sm-23{flex:0 0 95.83333333%;width:95.83333333%}.arco-col-sm-24{flex:0 0 100%;width:100%}.arco-col-sm-offset-1{margin-left:4.16666667%}.arco-col-sm-offset-2{margin-left:8.33333333%}.arco-col-sm-offset-3{margin-left:12.5%}.arco-col-sm-offset-4{margin-left:16.66666667%}.arco-col-sm-offset-5{margin-left:20.83333333%}.arco-col-sm-offset-6{margin-left:25%}.arco-col-sm-offset-7{margin-left:29.16666667%}.arco-col-sm-offset-8{margin-left:33.33333333%}.arco-col-sm-offset-9{margin-left:37.5%}.arco-col-sm-offset-10{margin-left:41.66666667%}.arco-col-sm-offset-11{margin-left:45.83333333%}.arco-col-sm-offset-12{margin-left:50%}.arco-col-sm-offset-13{margin-left:54.16666667%}.arco-col-sm-offset-14{margin-left:58.33333333%}.arco-col-sm-offset-15{margin-left:62.5%}.arco-col-sm-offset-16{margin-left:66.66666667%}.arco-col-sm-offset-17{margin-left:70.83333333%}.arco-col-sm-offset-18{margin-left:75%}.arco-col-sm-offset-19{margin-left:79.16666667%}.arco-col-sm-offset-20{margin-left:83.33333333%}.arco-col-sm-offset-21{margin-left:87.5%}.arco-col-sm-offset-22{margin-left:91.66666667%}.arco-col-sm-offset-23{margin-left:95.83333333%}.arco-col-sm-order-1{order:1}.arco-col-sm-order-2{order:2}.arco-col-sm-order-3{order:3}.arco-col-sm-order-4{order:4}.arco-col-sm-order-5{order:5}.arco-col-sm-order-6{order:6}.arco-col-sm-order-7{order:7}.arco-col-sm-order-8{order:8}.arco-col-sm-order-9{order:9}.arco-col-sm-order-10{order:10}.arco-col-sm-order-11{order:11}.arco-col-sm-order-12{order:12}.arco-col-sm-order-13{order:13}.arco-col-sm-order-14{order:14}.arco-col-sm-order-15{order:15}.arco-col-sm-order-16{order:16}.arco-col-sm-order-17{order:17}.arco-col-sm-order-18{order:18}.arco-col-sm-order-19{order:19}.arco-col-sm-order-20{order:20}.arco-col-sm-order-21{order:21}.arco-col-sm-order-22{order:22}.arco-col-sm-order-23{order:23}.arco-col-sm-order-24{order:24}}@media (min-width: 768px){.arco-col-md-1{flex:0 0 4.16666667%;width:4.16666667%}.arco-col-md-2{flex:0 0 8.33333333%;width:8.33333333%}.arco-col-md-3{flex:0 0 12.5%;width:12.5%}.arco-col-md-4{flex:0 0 16.66666667%;width:16.66666667%}.arco-col-md-5{flex:0 0 20.83333333%;width:20.83333333%}.arco-col-md-6{flex:0 0 25%;width:25%}.arco-col-md-7{flex:0 0 29.16666667%;width:29.16666667%}.arco-col-md-8{flex:0 0 33.33333333%;width:33.33333333%}.arco-col-md-9{flex:0 0 37.5%;width:37.5%}.arco-col-md-10{flex:0 0 41.66666667%;width:41.66666667%}.arco-col-md-11{flex:0 0 45.83333333%;width:45.83333333%}.arco-col-md-12{flex:0 0 50%;width:50%}.arco-col-md-13{flex:0 0 54.16666667%;width:54.16666667%}.arco-col-md-14{flex:0 0 58.33333333%;width:58.33333333%}.arco-col-md-15{flex:0 0 62.5%;width:62.5%}.arco-col-md-16{flex:0 0 66.66666667%;width:66.66666667%}.arco-col-md-17{flex:0 0 70.83333333%;width:70.83333333%}.arco-col-md-18{flex:0 0 75%;width:75%}.arco-col-md-19{flex:0 0 79.16666667%;width:79.16666667%}.arco-col-md-20{flex:0 0 83.33333333%;width:83.33333333%}.arco-col-md-21{flex:0 0 87.5%;width:87.5%}.arco-col-md-22{flex:0 0 91.66666667%;width:91.66666667%}.arco-col-md-23{flex:0 0 95.83333333%;width:95.83333333%}.arco-col-md-24{flex:0 0 100%;width:100%}.arco-col-md-offset-1{margin-left:4.16666667%}.arco-col-md-offset-2{margin-left:8.33333333%}.arco-col-md-offset-3{margin-left:12.5%}.arco-col-md-offset-4{margin-left:16.66666667%}.arco-col-md-offset-5{margin-left:20.83333333%}.arco-col-md-offset-6{margin-left:25%}.arco-col-md-offset-7{margin-left:29.16666667%}.arco-col-md-offset-8{margin-left:33.33333333%}.arco-col-md-offset-9{margin-left:37.5%}.arco-col-md-offset-10{margin-left:41.66666667%}.arco-col-md-offset-11{margin-left:45.83333333%}.arco-col-md-offset-12{margin-left:50%}.arco-col-md-offset-13{margin-left:54.16666667%}.arco-col-md-offset-14{margin-left:58.33333333%}.arco-col-md-offset-15{margin-left:62.5%}.arco-col-md-offset-16{margin-left:66.66666667%}.arco-col-md-offset-17{margin-left:70.83333333%}.arco-col-md-offset-18{margin-left:75%}.arco-col-md-offset-19{margin-left:79.16666667%}.arco-col-md-offset-20{margin-left:83.33333333%}.arco-col-md-offset-21{margin-left:87.5%}.arco-col-md-offset-22{margin-left:91.66666667%}.arco-col-md-offset-23{margin-left:95.83333333%}.arco-col-md-order-1{order:1}.arco-col-md-order-2{order:2}.arco-col-md-order-3{order:3}.arco-col-md-order-4{order:4}.arco-col-md-order-5{order:5}.arco-col-md-order-6{order:6}.arco-col-md-order-7{order:7}.arco-col-md-order-8{order:8}.arco-col-md-order-9{order:9}.arco-col-md-order-10{order:10}.arco-col-md-order-11{order:11}.arco-col-md-order-12{order:12}.arco-col-md-order-13{order:13}.arco-col-md-order-14{order:14}.arco-col-md-order-15{order:15}.arco-col-md-order-16{order:16}.arco-col-md-order-17{order:17}.arco-col-md-order-18{order:18}.arco-col-md-order-19{order:19}.arco-col-md-order-20{order:20}.arco-col-md-order-21{order:21}.arco-col-md-order-22{order:22}.arco-col-md-order-23{order:23}.arco-col-md-order-24{order:24}}@media (min-width: 992px){.arco-col-lg-1{flex:0 0 4.16666667%;width:4.16666667%}.arco-col-lg-2{flex:0 0 8.33333333%;width:8.33333333%}.arco-col-lg-3{flex:0 0 12.5%;width:12.5%}.arco-col-lg-4{flex:0 0 16.66666667%;width:16.66666667%}.arco-col-lg-5{flex:0 0 20.83333333%;width:20.83333333%}.arco-col-lg-6{flex:0 0 25%;width:25%}.arco-col-lg-7{flex:0 0 29.16666667%;width:29.16666667%}.arco-col-lg-8{flex:0 0 33.33333333%;width:33.33333333%}.arco-col-lg-9{flex:0 0 37.5%;width:37.5%}.arco-col-lg-10{flex:0 0 41.66666667%;width:41.66666667%}.arco-col-lg-11{flex:0 0 45.83333333%;width:45.83333333%}.arco-col-lg-12{flex:0 0 50%;width:50%}.arco-col-lg-13{flex:0 0 54.16666667%;width:54.16666667%}.arco-col-lg-14{flex:0 0 58.33333333%;width:58.33333333%}.arco-col-lg-15{flex:0 0 62.5%;width:62.5%}.arco-col-lg-16{flex:0 0 66.66666667%;width:66.66666667%}.arco-col-lg-17{flex:0 0 70.83333333%;width:70.83333333%}.arco-col-lg-18{flex:0 0 75%;width:75%}.arco-col-lg-19{flex:0 0 79.16666667%;width:79.16666667%}.arco-col-lg-20{flex:0 0 83.33333333%;width:83.33333333%}.arco-col-lg-21{flex:0 0 87.5%;width:87.5%}.arco-col-lg-22{flex:0 0 91.66666667%;width:91.66666667%}.arco-col-lg-23{flex:0 0 95.83333333%;width:95.83333333%}.arco-col-lg-24{flex:0 0 100%;width:100%}.arco-col-lg-offset-1{margin-left:4.16666667%}.arco-col-lg-offset-2{margin-left:8.33333333%}.arco-col-lg-offset-3{margin-left:12.5%}.arco-col-lg-offset-4{margin-left:16.66666667%}.arco-col-lg-offset-5{margin-left:20.83333333%}.arco-col-lg-offset-6{margin-left:25%}.arco-col-lg-offset-7{margin-left:29.16666667%}.arco-col-lg-offset-8{margin-left:33.33333333%}.arco-col-lg-offset-9{margin-left:37.5%}.arco-col-lg-offset-10{margin-left:41.66666667%}.arco-col-lg-offset-11{margin-left:45.83333333%}.arco-col-lg-offset-12{margin-left:50%}.arco-col-lg-offset-13{margin-left:54.16666667%}.arco-col-lg-offset-14{margin-left:58.33333333%}.arco-col-lg-offset-15{margin-left:62.5%}.arco-col-lg-offset-16{margin-left:66.66666667%}.arco-col-lg-offset-17{margin-left:70.83333333%}.arco-col-lg-offset-18{margin-left:75%}.arco-col-lg-offset-19{margin-left:79.16666667%}.arco-col-lg-offset-20{margin-left:83.33333333%}.arco-col-lg-offset-21{margin-left:87.5%}.arco-col-lg-offset-22{margin-left:91.66666667%}.arco-col-lg-offset-23{margin-left:95.83333333%}.arco-col-lg-order-1{order:1}.arco-col-lg-order-2{order:2}.arco-col-lg-order-3{order:3}.arco-col-lg-order-4{order:4}.arco-col-lg-order-5{order:5}.arco-col-lg-order-6{order:6}.arco-col-lg-order-7{order:7}.arco-col-lg-order-8{order:8}.arco-col-lg-order-9{order:9}.arco-col-lg-order-10{order:10}.arco-col-lg-order-11{order:11}.arco-col-lg-order-12{order:12}.arco-col-lg-order-13{order:13}.arco-col-lg-order-14{order:14}.arco-col-lg-order-15{order:15}.arco-col-lg-order-16{order:16}.arco-col-lg-order-17{order:17}.arco-col-lg-order-18{order:18}.arco-col-lg-order-19{order:19}.arco-col-lg-order-20{order:20}.arco-col-lg-order-21{order:21}.arco-col-lg-order-22{order:22}.arco-col-lg-order-23{order:23}.arco-col-lg-order-24{order:24}}@media (min-width: 1200px){.arco-col-xl-1{flex:0 0 4.16666667%;width:4.16666667%}.arco-col-xl-2{flex:0 0 8.33333333%;width:8.33333333%}.arco-col-xl-3{flex:0 0 12.5%;width:12.5%}.arco-col-xl-4{flex:0 0 16.66666667%;width:16.66666667%}.arco-col-xl-5{flex:0 0 20.83333333%;width:20.83333333%}.arco-col-xl-6{flex:0 0 25%;width:25%}.arco-col-xl-7{flex:0 0 29.16666667%;width:29.16666667%}.arco-col-xl-8{flex:0 0 33.33333333%;width:33.33333333%}.arco-col-xl-9{flex:0 0 37.5%;width:37.5%}.arco-col-xl-10{flex:0 0 41.66666667%;width:41.66666667%}.arco-col-xl-11{flex:0 0 45.83333333%;width:45.83333333%}.arco-col-xl-12{flex:0 0 50%;width:50%}.arco-col-xl-13{flex:0 0 54.16666667%;width:54.16666667%}.arco-col-xl-14{flex:0 0 58.33333333%;width:58.33333333%}.arco-col-xl-15{flex:0 0 62.5%;width:62.5%}.arco-col-xl-16{flex:0 0 66.66666667%;width:66.66666667%}.arco-col-xl-17{flex:0 0 70.83333333%;width:70.83333333%}.arco-col-xl-18{flex:0 0 75%;width:75%}.arco-col-xl-19{flex:0 0 79.16666667%;width:79.16666667%}.arco-col-xl-20{flex:0 0 83.33333333%;width:83.33333333%}.arco-col-xl-21{flex:0 0 87.5%;width:87.5%}.arco-col-xl-22{flex:0 0 91.66666667%;width:91.66666667%}.arco-col-xl-23{flex:0 0 95.83333333%;width:95.83333333%}.arco-col-xl-24{flex:0 0 100%;width:100%}.arco-col-xl-offset-1{margin-left:4.16666667%}.arco-col-xl-offset-2{margin-left:8.33333333%}.arco-col-xl-offset-3{margin-left:12.5%}.arco-col-xl-offset-4{margin-left:16.66666667%}.arco-col-xl-offset-5{margin-left:20.83333333%}.arco-col-xl-offset-6{margin-left:25%}.arco-col-xl-offset-7{margin-left:29.16666667%}.arco-col-xl-offset-8{margin-left:33.33333333%}.arco-col-xl-offset-9{margin-left:37.5%}.arco-col-xl-offset-10{margin-left:41.66666667%}.arco-col-xl-offset-11{margin-left:45.83333333%}.arco-col-xl-offset-12{margin-left:50%}.arco-col-xl-offset-13{margin-left:54.16666667%}.arco-col-xl-offset-14{margin-left:58.33333333%}.arco-col-xl-offset-15{margin-left:62.5%}.arco-col-xl-offset-16{margin-left:66.66666667%}.arco-col-xl-offset-17{margin-left:70.83333333%}.arco-col-xl-offset-18{margin-left:75%}.arco-col-xl-offset-19{margin-left:79.16666667%}.arco-col-xl-offset-20{margin-left:83.33333333%}.arco-col-xl-offset-21{margin-left:87.5%}.arco-col-xl-offset-22{margin-left:91.66666667%}.arco-col-xl-offset-23{margin-left:95.83333333%}.arco-col-xl-order-1{order:1}.arco-col-xl-order-2{order:2}.arco-col-xl-order-3{order:3}.arco-col-xl-order-4{order:4}.arco-col-xl-order-5{order:5}.arco-col-xl-order-6{order:6}.arco-col-xl-order-7{order:7}.arco-col-xl-order-8{order:8}.arco-col-xl-order-9{order:9}.arco-col-xl-order-10{order:10}.arco-col-xl-order-11{order:11}.arco-col-xl-order-12{order:12}.arco-col-xl-order-13{order:13}.arco-col-xl-order-14{order:14}.arco-col-xl-order-15{order:15}.arco-col-xl-order-16{order:16}.arco-col-xl-order-17{order:17}.arco-col-xl-order-18{order:18}.arco-col-xl-order-19{order:19}.arco-col-xl-order-20{order:20}.arco-col-xl-order-21{order:21}.arco-col-xl-order-22{order:22}.arco-col-xl-order-23{order:23}.arco-col-xl-order-24{order:24}}@media (min-width: 1600px){.arco-col-xxl-1{flex:0 0 4.16666667%;width:4.16666667%}.arco-col-xxl-2{flex:0 0 8.33333333%;width:8.33333333%}.arco-col-xxl-3{flex:0 0 12.5%;width:12.5%}.arco-col-xxl-4{flex:0 0 16.66666667%;width:16.66666667%}.arco-col-xxl-5{flex:0 0 20.83333333%;width:20.83333333%}.arco-col-xxl-6{flex:0 0 25%;width:25%}.arco-col-xxl-7{flex:0 0 29.16666667%;width:29.16666667%}.arco-col-xxl-8{flex:0 0 33.33333333%;width:33.33333333%}.arco-col-xxl-9{flex:0 0 37.5%;width:37.5%}.arco-col-xxl-10{flex:0 0 41.66666667%;width:41.66666667%}.arco-col-xxl-11{flex:0 0 45.83333333%;width:45.83333333%}.arco-col-xxl-12{flex:0 0 50%;width:50%}.arco-col-xxl-13{flex:0 0 54.16666667%;width:54.16666667%}.arco-col-xxl-14{flex:0 0 58.33333333%;width:58.33333333%}.arco-col-xxl-15{flex:0 0 62.5%;width:62.5%}.arco-col-xxl-16{flex:0 0 66.66666667%;width:66.66666667%}.arco-col-xxl-17{flex:0 0 70.83333333%;width:70.83333333%}.arco-col-xxl-18{flex:0 0 75%;width:75%}.arco-col-xxl-19{flex:0 0 79.16666667%;width:79.16666667%}.arco-col-xxl-20{flex:0 0 83.33333333%;width:83.33333333%}.arco-col-xxl-21{flex:0 0 87.5%;width:87.5%}.arco-col-xxl-22{flex:0 0 91.66666667%;width:91.66666667%}.arco-col-xxl-23{flex:0 0 95.83333333%;width:95.83333333%}.arco-col-xxl-24{flex:0 0 100%;width:100%}.arco-col-xxl-offset-1{margin-left:4.16666667%}.arco-col-xxl-offset-2{margin-left:8.33333333%}.arco-col-xxl-offset-3{margin-left:12.5%}.arco-col-xxl-offset-4{margin-left:16.66666667%}.arco-col-xxl-offset-5{margin-left:20.83333333%}.arco-col-xxl-offset-6{margin-left:25%}.arco-col-xxl-offset-7{margin-left:29.16666667%}.arco-col-xxl-offset-8{margin-left:33.33333333%}.arco-col-xxl-offset-9{margin-left:37.5%}.arco-col-xxl-offset-10{margin-left:41.66666667%}.arco-col-xxl-offset-11{margin-left:45.83333333%}.arco-col-xxl-offset-12{margin-left:50%}.arco-col-xxl-offset-13{margin-left:54.16666667%}.arco-col-xxl-offset-14{margin-left:58.33333333%}.arco-col-xxl-offset-15{margin-left:62.5%}.arco-col-xxl-offset-16{margin-left:66.66666667%}.arco-col-xxl-offset-17{margin-left:70.83333333%}.arco-col-xxl-offset-18{margin-left:75%}.arco-col-xxl-offset-19{margin-left:79.16666667%}.arco-col-xxl-offset-20{margin-left:83.33333333%}.arco-col-xxl-offset-21{margin-left:87.5%}.arco-col-xxl-offset-22{margin-left:91.66666667%}.arco-col-xxl-offset-23{margin-left:95.83333333%}.arco-col-xxl-order-1{order:1}.arco-col-xxl-order-2{order:2}.arco-col-xxl-order-3{order:3}.arco-col-xxl-order-4{order:4}.arco-col-xxl-order-5{order:5}.arco-col-xxl-order-6{order:6}.arco-col-xxl-order-7{order:7}.arco-col-xxl-order-8{order:8}.arco-col-xxl-order-9{order:9}.arco-col-xxl-order-10{order:10}.arco-col-xxl-order-11{order:11}.arco-col-xxl-order-12{order:12}.arco-col-xxl-order-13{order:13}.arco-col-xxl-order-14{order:14}.arco-col-xxl-order-15{order:15}.arco-col-xxl-order-16{order:16}.arco-col-xxl-order-17{order:17}.arco-col-xxl-order-18{order:18}.arco-col-xxl-order-19{order:19}.arco-col-xxl-order-20{order:20}.arco-col-xxl-order-21{order:21}.arco-col-xxl-order-22{order:22}.arco-col-xxl-order-23{order:23}.arco-col-xxl-order-24{order:24}}.arco-grid{display:grid}.arco-form-item-status-validating .arco-input-wrapper:not(.arco-input-disabled),.arco-form-item-status-validating .arco-textarea-wrapper:not(.arco-textarea-disabled){background-color:var(--color-fill-2);border-color:transparent}.arco-form-item-status-validating .arco-input-wrapper:not(.arco-input-disabled):hover,.arco-form-item-status-validating .arco-textarea-wrapper:not(.arco-textarea-disabled):hover{background-color:var(--color-fill-3);border-color:transparent}.arco-form-item-status-validating .arco-input-wrapper:not(.arco-input-disabled).arco-input-focus,.arco-form-item-status-validating .arco-textarea-wrapper:not(.arco-textarea-disabled).arco-textarea-focus{background-color:var(--color-bg-2);border-color:rgb(var(--primary-6));box-shadow:0 0 0 0 var(--color-primary-light-2)}.arco-form-item-status-validating .arco-select-view:not(.arco-select-view-disabled),.arco-form-item-status-validating .arco-input-tag:not(.arco-input-tag-disabled){background-color:var(--color-fill-2);border-color:transparent}.arco-form-item-status-validating .arco-select-view:not(.arco-select-view-disabled):hover,.arco-form-item-status-validating .arco-input-tag:not(.arco-input-tag-disabled):hover{background-color:var(--color-fill-3);border-color:transparent}.arco-form-item-status-validating .arco-select-view:not(.arco-select-view-disabled).arco-select-view-focus,.arco-form-item-status-validating .arco-input-tag:not(.arco-input-tag-disabled).arco-input-tag-focus{background-color:var(--color-bg-2);border-color:rgb(var(--primary-6));box-shadow:0 0 0 0 var(--color-primary-light-2)}.arco-form-item-status-validating .arco-picker:not(.arco-picker-disabled){border-color:transparent;background-color:var(--color-fill-2)}.arco-form-item-status-validating .arco-picker:not(.arco-picker-disabled):hover{border-color:transparent;background-color:var(--color-fill-3)}.arco-form-item-status-validating .arco-picker-focused:not(.arco-picker-disabled),.arco-form-item-status-validating .arco-picker-focused:not(.arco-picker-disabled):hover{border-color:rgb(var(--primary-6));background-color:var(--color-bg-2);box-shadow:0 0 0 0 var(--color-primary-light-2)}.arco-form-item-status-validating .arco-form-item-message-help,.arco-form-item-status-validating .arco-form-item-feedback{color:rgb(var(--primary-6))}.arco-form-item-status-success .arco-input-wrapper:not(.arco-input-disabled),.arco-form-item-status-success .arco-textarea-wrapper:not(.arco-textarea-disabled){background-color:var(--color-fill-2);border-color:transparent}.arco-form-item-status-success .arco-input-wrapper:not(.arco-input-disabled):hover,.arco-form-item-status-success .arco-textarea-wrapper:not(.arco-textarea-disabled):hover{background-color:var(--color-fill-3);border-color:transparent}.arco-form-item-status-success .arco-input-wrapper:not(.arco-input-disabled).arco-input-focus,.arco-form-item-status-success .arco-textarea-wrapper:not(.arco-textarea-disabled).arco-textarea-focus{background-color:var(--color-bg-2);border-color:rgb(var(--success-6));box-shadow:0 0 0 0 var(--color-success-light-2)}.arco-form-item-status-success .arco-select-view:not(.arco-select-view-disabled),.arco-form-item-status-success .arco-input-tag:not(.arco-input-tag-disabled){background-color:var(--color-fill-2);border-color:transparent}.arco-form-item-status-success .arco-select-view:not(.arco-select-view-disabled):hover,.arco-form-item-status-success .arco-input-tag:not(.arco-input-tag-disabled):hover{background-color:var(--color-fill-3);border-color:transparent}.arco-form-item-status-success .arco-select-view:not(.arco-select-view-disabled).arco-select-view-focus,.arco-form-item-status-success .arco-input-tag:not(.arco-input-tag-disabled).arco-input-tag-focus{background-color:var(--color-bg-2);border-color:rgb(var(--success-6));box-shadow:0 0 0 0 var(--color-success-light-2)}.arco-form-item-status-success .arco-picker:not(.arco-picker-disabled){border-color:transparent;background-color:var(--color-fill-2)}.arco-form-item-status-success .arco-picker:not(.arco-picker-disabled):hover{border-color:transparent;background-color:var(--color-fill-3)}.arco-form-item-status-success .arco-picker-focused:not(.arco-picker-disabled),.arco-form-item-status-success .arco-picker-focused:not(.arco-picker-disabled):hover{border-color:rgb(var(--success-6));background-color:var(--color-bg-2);box-shadow:0 0 0 0 var(--color-success-light-2)}.arco-form-item-status-success .arco-form-item-message-help,.arco-form-item-status-success .arco-form-item-feedback{color:rgb(var(--success-6))}.arco-form-item-status-warning .arco-input-wrapper:not(.arco-input-disabled),.arco-form-item-status-warning .arco-textarea-wrapper:not(.arco-textarea-disabled){background-color:var(--color-warning-light-1);border-color:transparent}.arco-form-item-status-warning .arco-input-wrapper:not(.arco-input-disabled):hover,.arco-form-item-status-warning .arco-textarea-wrapper:not(.arco-textarea-disabled):hover{background-color:var(--color-warning-light-2);border-color:transparent}.arco-form-item-status-warning .arco-input-wrapper:not(.arco-input-disabled).arco-input-focus,.arco-form-item-status-warning .arco-textarea-wrapper:not(.arco-textarea-disabled).arco-textarea-focus{background-color:var(--color-bg-2);border-color:rgb(var(--warning-6));box-shadow:0 0 0 0 var(--color-warning-light-2)}.arco-form-item-status-warning .arco-select-view:not(.arco-select-view-disabled),.arco-form-item-status-warning .arco-input-tag:not(.arco-input-tag-disabled){background-color:var(--color-warning-light-1);border-color:transparent}.arco-form-item-status-warning .arco-select-view:not(.arco-select-view-disabled):hover,.arco-form-item-status-warning .arco-input-tag:not(.arco-input-tag-disabled):hover{background-color:var(--color-warning-light-2);border-color:transparent}.arco-form-item-status-warning .arco-select-view:not(.arco-select-view-disabled).arco-select-view-focus,.arco-form-item-status-warning .arco-input-tag:not(.arco-input-tag-disabled).arco-input-tag-focus{background-color:var(--color-bg-2);border-color:rgb(var(--warning-6));box-shadow:0 0 0 0 var(--color-warning-light-2)}.arco-form-item-status-warning .arco-picker:not(.arco-picker-disabled){border-color:transparent;background-color:var(--color-warning-light-1)}.arco-form-item-status-warning .arco-picker:not(.arco-picker-disabled):hover{border-color:transparent;background-color:var(--color-warning-light-2)}.arco-form-item-status-warning .arco-picker-focused:not(.arco-picker-disabled),.arco-form-item-status-warning .arco-picker-focused:not(.arco-picker-disabled):hover{border-color:rgb(var(--warning-6));background-color:var(--color-bg-2);box-shadow:0 0 0 0 var(--color-warning-light-2)}.arco-form-item-status-warning .arco-form-item-message-help,.arco-form-item-status-warning .arco-form-item-feedback{color:rgb(var(--warning-6))}.arco-form-item-status-error .arco-input-wrapper:not(.arco-input-disabled),.arco-form-item-status-error .arco-textarea-wrapper:not(.arco-textarea-disabled){background-color:var(--color-danger-light-1);border-color:transparent}.arco-form-item-status-error .arco-input-wrapper:not(.arco-input-disabled):hover,.arco-form-item-status-error .arco-textarea-wrapper:not(.arco-textarea-disabled):hover{background-color:var(--color-danger-light-2);border-color:transparent}.arco-form-item-status-error .arco-input-wrapper:not(.arco-input-disabled).arco-input-focus,.arco-form-item-status-error .arco-textarea-wrapper:not(.arco-textarea-disabled).arco-textarea-focus{background-color:var(--color-bg-2);border-color:rgb(var(--danger-6));box-shadow:0 0 0 0 var(--color-danger-light-2)}.arco-form-item-status-error .arco-select-view:not(.arco-select-view-disabled),.arco-form-item-status-error .arco-input-tag:not(.arco-input-tag-disabled){background-color:var(--color-danger-light-1);border-color:transparent}.arco-form-item-status-error .arco-select-view:not(.arco-select-view-disabled):hover,.arco-form-item-status-error .arco-input-tag:not(.arco-input-tag-disabled):hover{background-color:var(--color-danger-light-2);border-color:transparent}.arco-form-item-status-error .arco-select-view:not(.arco-select-view-disabled).arco-select-view-focus,.arco-form-item-status-error .arco-input-tag:not(.arco-input-tag-disabled).arco-input-tag-focus{background-color:var(--color-bg-2);border-color:rgb(var(--danger-6));box-shadow:0 0 0 0 var(--color-danger-light-2)}.arco-form-item-status-error .arco-picker:not(.arco-picker-disabled){border-color:transparent;background-color:var(--color-danger-light-1)}.arco-form-item-status-error .arco-picker:not(.arco-picker-disabled):hover{border-color:transparent;background-color:var(--color-danger-light-2)}.arco-form-item-status-error .arco-picker-focused:not(.arco-picker-disabled),.arco-form-item-status-error .arco-picker-focused:not(.arco-picker-disabled):hover{border-color:rgb(var(--danger-6));background-color:var(--color-bg-2);box-shadow:0 0 0 0 var(--color-danger-light-2)}.arco-form-item-status-error .arco-form-item-message-help,.arco-form-item-status-error .arco-form-item-feedback{color:rgb(var(--danger-6))}.arco-form-item-control-children{position:relative}.arco-form-item-feedback{position:absolute;top:50%;right:9px;font-size:14px;transform:translateY(-50%)}.arco-form-item-feedback .arco-icon-loading{font-size:12px}.arco-form-item-has-feedback .arco-input,.arco-form-item-has-feedback .arco-input-inner-wrapper,.arco-form-item-has-feedback .arco-textarea{padding-right:28px}.arco-form-item-has-feedback .arco-input-number-mode-embed .arco-input-number-step-layer{right:24px}.arco-form-item-has-feedback .arco-select.arco-select-multiple .arco-select-view,.arco-form-item-has-feedback .arco-select.arco-select-single .arco-select-view{padding-right:28px}.arco-form-item-has-feedback .arco-select.arco-select-multiple .arco-select-suffix{padding-right:0}.arco-form-item-has-feedback .arco-cascader.arco-cascader-multiple .arco-cascader-view,.arco-form-item-has-feedback .arco-cascader.arco-cascader-single .arco-cascader-view{padding-right:28px}.arco-form-item-has-feedback .arco-cascader.arco-cascader-multiple .arco-cascader-suffix{padding-right:0}.arco-form-item-has-feedback .arco-tree-select.arco-tree-select-multiple .arco-tree-select-view,.arco-form-item-has-feedback .arco-tree-select.arco-tree-select-single .arco-tree-select-view{padding-right:28px}.arco-form-item-has-feedback .arco-tree-select.arco-tree-select-multiple .arco-tree-select-suffix{padding-right:0}.arco-form-item-has-feedback .arco-picker{padding-right:28px}.arco-form-item-has-feedback .arco-picker-suffix .arco-picker-suffix-icon,.arco-form-item-has-feedback .arco-picker-suffix .arco-picker-clear-icon{margin-right:0;margin-left:0}.arco-form{display:flex;flex-direction:column;width:100%}.arco-form-layout-inline{flex-direction:row;flex-wrap:wrap}.arco-form-layout-inline .arco-form-item{width:auto;margin-bottom:8px}.arco-form-auto-label-width .arco-form-item-label-col>.arco-form-item-label{white-space:nowrap}.arco-form-item{display:flex;align-items:flex-start;justify-content:flex-start;width:100%;margin-bottom:20px}.arco-form-item-layout-vertical{display:block}.arco-form-item-layout-vertical>.arco-form-item-label-col{justify-content:flex-start;margin-bottom:8px;padding:0;line-height:1.5715;white-space:normal}.arco-form-item-layout-inline{margin-right:24px}.arco-form-item-label-col{padding-right:16px}.arco-form-item.arco-form-item-error,.arco-form-item.arco-form-item-has-help{margin-bottom:0}.arco-form-item-wrapper-flex.arco-col{flex:1}.arco-form-size-mini .arco-form-item-label-col{line-height:24px}.arco-form-size-mini .arco-form-item-label-col>.arco-form-item-label{font-size:12px}.arco-form-size-mini .arco-form-item-content,.arco-form-size-mini .arco-form-item-wrapper-col{min-height:24px}.arco-form-size-small .arco-form-item-label-col{line-height:28px}.arco-form-size-small .arco-form-item-label-col>.arco-form-item-label{font-size:14px}.arco-form-size-small .arco-form-item-content,.arco-form-size-small .arco-form-item-wrapper-col{min-height:28px}.arco-form-size-large .arco-form-item-label-col{line-height:36px}.arco-form-size-large .arco-form-item-label-col>.arco-form-item-label{font-size:14px}.arco-form-size-large .arco-form-item-content,.arco-form-size-large .arco-form-item-wrapper-col{min-height:36px}.arco-form-item-extra{margin-top:4px;color:var(--color-text-3);font-size:12px}.arco-form-item-message{min-height:20px;color:rgb(var(--danger-6));font-size:12px;line-height:20px}.arco-form-item-message-help{color:var(--color-text-3)}.arco-form-item-message+.arco-form-item-extra{margin-top:0;margin-bottom:4px}.arco-form-item-label-col{display:flex;flex-shrink:0;justify-content:flex-end;line-height:32px;white-space:nowrap}.arco-form-item-label-col-left{justify-content:flex-start}.arco-form-item-label-col>.arco-form-item-label{max-width:100%;color:var(--color-text-2);font-size:14px;white-space:normal}.arco-form-item-label-col.arco-form-item-label-col-flex{box-sizing:content-box}.arco-form-item-wrapper-col{display:flex;flex-direction:column;align-items:flex-start;width:100%;min-width:0;min-height:32px}.arco-form-item-content{flex:1;max-width:100%;min-height:32px}.arco-form-item-content-wrapper{display:flex;align-items:center;justify-content:flex-start;width:100%}.arco-form-item-content-flex{display:flex;align-items:center;justify-content:flex-start}.arco-form .arco-slider{display:block}.arco-form-item-label-required-symbol{color:rgb(var(--danger-6));font-size:12px;line-height:1}.arco-form-item-label-required-symbol svg{display:inline-block;transform:scale(.5)}.arco-form-item-label-tooltip{margin-left:4px;color:var(--color-text-4)}.form-blink-enter-from,.form-blink-appear-from{opacity:0}.form-blink-enter-to,.form-blink-appear-to{opacity:1}.form-blink-enter-active,.form-blink-appear-active{transition:opacity .3s cubic-bezier(0,0,1,1);animation:arco-form-blink .5s cubic-bezier(0,0,1,1)}@keyframes arco-form-blink{0%{opacity:1}50%{opacity:.2}to{opacity:1}}.arco-icon-hover.arco-checkbox-icon-hover:before{width:24px;height:24px}.arco-checkbox{position:relative;display:inline-flex;align-items:center;box-sizing:border-box;padding-left:5px;font-size:14px;line-height:unset;cursor:pointer}.arco-checkbox>input[type=checkbox]{position:absolute;top:0;left:0;width:0;height:0;opacity:0}.arco-checkbox>input[type=checkbox]:focus-visible+.arco-checkbox-icon-hover:before{background-color:var(--color-fill-2)}.arco-checkbox:hover .arco-checkbox-icon-hover:before{background-color:var(--color-fill-2)}.arco-checkbox-label{margin-left:8px;color:var(--color-text-1)}.arco-checkbox-icon{position:relative;box-sizing:border-box;width:14px;height:14px;background-color:var(--color-bg-2);border:2px solid var(--color-fill-3);border-radius:var(--border-radius-small);-webkit-user-select:none;user-select:none}.arco-checkbox-icon:after{position:absolute;top:50%;left:50%;display:block;width:6px;height:2px;background:var(--color-white);border-radius:.5px;transform:translate(-50%) translateY(-50%) scale(0);content:""}.arco-checkbox-icon-check{position:relative;display:block;width:8px;height:100%;margin:0 auto;color:var(--color-white);transform:scale(0);transform-origin:center 75%}.arco-checkbox:hover .arco-checkbox-icon{border-color:var(--color-fill-4);transition:border-color .1s cubic-bezier(0,0,1,1),transform .3s cubic-bezier(.3,1.3,.3,1)}.arco-checkbox-checked:hover .arco-checkbox-icon,.arco-checkbox-indeterminate:hover .arco-checkbox-icon{transition:transform .3s cubic-bezier(.3,1.3,.3,1)}.arco-checkbox-checked .arco-checkbox-icon{background-color:rgb(var(--primary-6));border-color:transparent}.arco-checkbox-checked .arco-checkbox-icon-check{transform:scale(1);transition:transform .3s cubic-bezier(.3,1.3,.3,1)}.arco-checkbox-indeterminate .arco-checkbox-icon{background-color:rgb(var(--primary-6));border-color:transparent}.arco-checkbox-indeterminate .arco-checkbox-icon svg{transform:scale(0)}.arco-checkbox-indeterminate .arco-checkbox-icon:after{transform:translate(-50%) translateY(-50%) scale(1);transition:transform .3s cubic-bezier(.3,1.3,.3,1)}.arco-checkbox.arco-checkbox-disabled,.arco-checkbox.arco-checkbox-disabled .arco-checkbox-icon-hover{cursor:not-allowed}.arco-checkbox.arco-checkbox-disabled:hover .arco-checkbox-mask{border-color:var(--color-fill-3)}.arco-checkbox-checked:hover .arco-checkbox-icon,.arco-checkbox-indeterminate:hover .arco-checkbox-icon{border-color:transparent}.arco-checkbox-disabled .arco-checkbox-icon{background-color:var(--color-fill-2);border-color:var(--color-fill-3)}.arco-checkbox-disabled.arco-checkbox-checked .arco-checkbox-icon,.arco-checkbox-disabled.arco-checkbox-checked:hover .arco-checkbox-icon{background-color:var(--color-primary-light-3);border-color:transparent}.arco-checkbox-disabled:hover .arco-checkbox-icon-hover:before,.arco-checkbox-checked:hover .arco-checkbox-icon-hover:before,.arco-checkbox-indeterminate:hover .arco-checkbox-icon-hover:before{background-color:transparent}.arco-checkbox-disabled:hover .arco-checkbox-icon{border-color:var(--color-fill-3)}.arco-checkbox-disabled .arco-checkbox-label{color:var(--color-text-4)}.arco-checkbox-disabled .arco-checkbox-icon-check{color:var(--color-fill-3)}.arco-checkbox-group{display:inline-block}.arco-checkbox-group .arco-checkbox{margin-right:16px}.arco-checkbox-group-direction-vertical .arco-checkbox{display:flex;margin-right:0;line-height:32px}.arco-image-trigger{padding:6px 4px;background:var(--color-bg-5);border:1px solid var(--color-neutral-3);border-radius:4px}.arco-image-trigger .arco-trigger-arrow{background-color:var(--color-bg-5);border:1px solid var(--color-neutral-3)}.arco-image{position:relative;display:inline-block;border-radius:var(--border-radius-small)}.arco-image-img{vertical-align:middle;border-radius:inherit}.arco-image-overlay{position:absolute;top:0;left:0;width:100%;height:100%}.arco-image-footer{display:flex;width:100%;max-width:100%}.arco-image-footer-caption{flex:1 1 auto}.arco-image-footer-caption-title{font-weight:500;font-size:16px}.arco-image-footer-caption-description{font-size:14px}.arco-image-footer-extra{flex:0 0 auto;padding-left:12px}.arco-image-with-footer-inner .arco-image-footer{position:absolute;bottom:0;left:0;align-items:center;box-sizing:border-box;padding:9px 16px;color:var(--color-white);background:linear-gradient(360deg,#0000004d,#0000);border-bottom-right-radius:var(--border-radius-small);border-bottom-left-radius:var(--border-radius-small)}.arco-image-with-footer-inner .arco-image-footer-caption-title,.arco-image-with-footer-inner .arco-image-footer-caption-description{color:var(--color-white)}.arco-image-with-footer-outer .arco-image-footer{margin-top:4px;color:var(--color-neutral-8)}.arco-image-with-footer-outer .arco-image-footer-caption-title{color:var(--color-text-1)}.arco-image-with-footer-outer .arco-image-footer-caption-description{color:var(--color-neutral-6)}.arco-image-error{display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;width:100%;height:100%;color:var(--color-neutral-4);background-color:var(--color-neutral-1)}.arco-image-error-icon{width:60px;max-width:100%;height:60px;max-height:100%}.arco-image-error-icon>svg{width:100%;height:100%}.arco-image-error-alt{padding:8px 16px;font-size:12px;line-height:1.6667;text-align:center}.arco-image-loader{position:absolute;top:0;left:0;width:100%;height:100%;background-color:var(--color-neutral-1)}.arco-image-loader-spin{position:absolute;top:50%;left:50%;color:rgb(var(--primary-6));font-size:32px;text-align:center;transform:translate(-50%,-50%)}.arco-image-loader-spin-text{color:var(--color-neutral-6);font-size:16px}.arco-image-simple.arco-image-with-footer-inner .arco-image-footer{padding:12px 16px}.arco-image-loading .arco-image-img,.arco-image-loading-error .arco-image-img{visibility:hidden}.arco-image-preview{position:fixed;top:0;left:0;z-index:1001;width:100%;height:100%}.arco-image-preview-hide{display:none}.arco-image-preview-mask,.arco-image-preview-wrapper{position:absolute;top:0;left:0;width:100%;height:100%}.arco-image-preview-mask{background-color:var(--color-mask-bg)}.arco-image-preview-img-container{width:100%;height:100%;text-align:center}.arco-image-preview-img-container:before{display:inline-block;width:0;height:100%;vertical-align:middle;content:""}.arco-image-preview-img-container .arco-image-preview-img{display:inline-block;max-width:100%;max-height:100%;vertical-align:middle;cursor:grab;-webkit-user-select:none;user-select:none}.arco-image-preview-img-container .arco-image-preview-img.arco-image-preview-img-moving{cursor:grabbing}.arco-image-preview-scale-value{box-sizing:border-box;padding:7px 10px;color:var(--color-white);font-size:12px;line-height:initial;background-color:#ffffff14;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.arco-image-preview-toolbar{position:absolute;bottom:46px;left:50%;display:flex;align-items:flex-start;padding:4px 16px;background-color:var(--color-bg-2);border-radius:var(--border-radius-medium);transform:translate(-50%)}.arco-image-preview-toolbar-action{display:flex;align-items:center;color:var(--color-neutral-8);font-size:14px;background-color:transparent;border-radius:var(--border-radius-small);cursor:pointer}.arco-image-preview-toolbar-action:not(:last-of-type){margin-right:0}.arco-image-preview-toolbar-action:hover{color:rgb(var(--primary-6));background-color:var(--color-neutral-2)}.arco-image-preview-toolbar-action-disabled,.arco-image-preview-toolbar-action-disabled:hover{color:var(--color-text-4);background-color:transparent;cursor:not-allowed}.arco-image-preview-toolbar-action-name{padding-right:12px;font-size:12px}.arco-image-preview-toolbar-action-content{padding:13px;line-height:1}.arco-image-preview-loading{display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:48px;height:48px;padding:10px;color:rgb(var(--primary-6));font-size:18px;background-color:#232324;border-radius:var(--border-radius-medium);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.arco-image-preview-close-btn{position:absolute;top:36px;right:36px;display:flex;align-items:center;justify-content:center;width:32px;height:32px;color:var(--color-white);font-size:14px;line-height:32px;text-align:center;background:#00000080;border-radius:50%;cursor:pointer}.arco-image-preview-arrow-left,.arco-image-preview-arrow-right{position:absolute;z-index:2;display:flex;align-items:center;justify-content:center;width:32px;height:32px;color:var(--color-white);background-color:#ffffff4d;border-radius:50%;cursor:pointer}.arco-image-preview-arrow-left>svg,.arco-image-preview-arrow-right>svg{color:var(--color-white);font-size:16px}.arco-image-preview-arrow-left:hover,.arco-image-preview-arrow-right:hover{background-color:#ffffff80}.arco-image-preview-arrow-left{top:50%;left:20px;transform:translateY(-50%)}.arco-image-preview-arrow-right{top:50%;right:20px;transform:translateY(-50%)}.arco-image-preview-arrow-disabled{color:#ffffff4d;background-color:#fff3;cursor:not-allowed}.arco-image-preview-arrow-disabled>svg{color:#ffffff4d}.arco-image-preview-arrow-disabled:hover{background-color:#fff3}.image-fade-enter-from,.image-fade-leave-to{opacity:0}.image-fade-enter-to,.image-fade-leave-from{opacity:1}.image-fade-enter-active,.image-fade-leave-active{transition:opacity .4s cubic-bezier(.3,1.3,.3,1)}.arco-scrollbar{position:relative}.arco-scrollbar-container{position:relative;scrollbar-width:none}.arco-scrollbar-container::-webkit-scrollbar{display:none}.arco-scrollbar-track{position:absolute;z-index:100}.arco-scrollbar-track-direction-horizontal{bottom:0;left:0;box-sizing:border-box;width:100%;height:15px}.arco-scrollbar-track-direction-vertical{top:0;right:0;box-sizing:border-box;width:15px;height:100%}.arco-scrollbar-thumb{position:absolute;display:block;box-sizing:border-box}.arco-scrollbar-thumb-bar{width:100%;height:100%;background-color:var(--color-neutral-4);border-radius:6px}.arco-scrollbar-thumb:hover .arco-scrollbar-thumb-bar,.arco-scrollbar-thumb-dragging .arco-scrollbar-thumb-bar{background-color:var(--color-neutral-6)}.arco-scrollbar-thumb-direction-horizontal .arco-scrollbar-thumb-bar{height:9px;margin:3px 0}.arco-scrollbar-thumb-direction-vertical .arco-scrollbar-thumb-bar{width:9px;margin:0 3px}.arco-scrollbar.arco-scrollbar-type-embed .arco-scrollbar-thumb{opacity:0;transition:opacity ease .2s}.arco-scrollbar.arco-scrollbar-type-embed .arco-scrollbar-thumb-dragging,.arco-scrollbar.arco-scrollbar-type-embed:hover .arco-scrollbar-thumb{opacity:.8}.arco-scrollbar.arco-scrollbar-type-track .arco-scrollbar-track{background-color:var(--color-neutral-1)}.arco-scrollbar.arco-scrollbar-type-track .arco-scrollbar-track-direction-horizontal{border-top:1px solid var(--color-neutral-3);border-bottom:1px solid var(--color-neutral-3)}.arco-scrollbar.arco-scrollbar-type-track .arco-scrollbar-track-direction-vertical{border-right:1px solid var(--color-neutral-3);border-left:1px solid var(--color-neutral-3)}.arco-scrollbar.arco-scrollbar-type-track .arco-scrollbar-thumb-direction-horizontal{margin:-1px 0}.arco-scrollbar.arco-scrollbar-type-track .arco-scrollbar-thumb-direction-vertical{margin:0 -1px}.arco-scrollbar.arco-scrollbar-type-track.arco-scrollbar-both .arco-scrollbar-track-direction-vertical:after{position:absolute;right:-1px;bottom:0;display:block;box-sizing:border-box;width:15px;height:15px;background-color:var(--color-neutral-1);border-right:1px solid var(--color-neutral-3);border-bottom:1px solid var(--color-neutral-3);content:""}.arco-dropdown{box-sizing:border-box;padding:4px 0;background-color:var(--color-bg-popup);border:1px solid var(--color-fill-3);border-radius:var(--border-radius-medium);box-shadow:0 4px 10px #0000001a}.arco-dropdown-list{margin-top:0;margin-bottom:0;padding-left:0;list-style:none}.arco-dropdown-list-wrapper{max-height:200px;overflow-y:auto}.arco-dropdown-option{position:relative;z-index:1;display:flex;align-items:center;box-sizing:border-box;width:100%;padding:0 12px;color:var(--color-text-1);font-size:14px;line-height:36px;text-align:left;background-color:transparent;cursor:pointer}.arco-dropdown-option-content{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.arco-dropdown-option-has-suffix{justify-content:space-between}.arco-dropdown-option-active,.arco-dropdown-option:not(.arco-dropdown-option-disabled):hover{color:var(--color-text-1);background-color:var(--color-fill-2);transition:all .1s cubic-bezier(0,0,1,1)}.arco-dropdown-option-disabled{color:var(--color-text-4);background-color:transparent;cursor:not-allowed}.arco-dropdown-option-icon{display:inline-flex;margin-right:8px}.arco-dropdown-option-suffix{margin-left:12px}.arco-dropdown-group:first-child .arco-dropdown-group-title{margin-top:8px}.arco-dropdown-group-title{box-sizing:border-box;width:100%;margin-top:8px;padding:0 12px;color:var(--color-text-3);font-size:12px;line-height:20px;cursor:default;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.arco-dropdown-submenu{margin-top:-4px}.arco-dropdown.arco-dropdown-has-footer{padding-bottom:0}.arco-dropdown-footer{border-top:1px solid var(--color-fill-3)}.arco-textarea-wrapper{display:inline-flex;box-sizing:border-box;color:var(--color-text-1);font-size:14px;background-color:var(--color-fill-2);border:1px solid transparent;border-radius:var(--border-radius-small);cursor:text;transition:color .1s cubic-bezier(0,0,1,1),border-color .1s cubic-bezier(0,0,1,1),background-color .1s cubic-bezier(0,0,1,1);position:relative;display:inline-block;width:100%;padding-right:0;padding-left:0;overflow:hidden}.arco-textarea-wrapper:hover{background-color:var(--color-fill-3);border-color:transparent}.arco-textarea-wrapper:focus-within,.arco-textarea-wrapper.arco-textarea-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--primary-6));box-shadow:0 0 0 0 var(--color-primary-light-2)}.arco-textarea-wrapper.arco-textarea-disabled{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent;cursor:not-allowed}.arco-textarea-wrapper.arco-textarea-disabled:hover{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent}.arco-textarea-wrapper.arco-textarea-disabled .arco-textarea-prefix,.arco-textarea-wrapper.arco-textarea-disabled .arco-textarea-suffix{color:inherit}.arco-textarea-wrapper.arco-textarea-error{background-color:var(--color-danger-light-1);border-color:transparent}.arco-textarea-wrapper.arco-textarea-error:hover{background-color:var(--color-danger-light-2);border-color:transparent}.arco-textarea-wrapper.arco-textarea-error:focus-within,.arco-textarea-wrapper.arco-textarea-error.arco-textarea-wrapper-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--danger-6));box-shadow:0 0 0 0 var(--color-danger-light-2)}.arco-textarea-wrapper .arco-textarea-prefix,.arco-textarea-wrapper .arco-textarea-suffix{display:inline-flex;flex-shrink:0;align-items:center;white-space:nowrap;-webkit-user-select:none;user-select:none}.arco-textarea-wrapper .arco-textarea-prefix>svg,.arco-textarea-wrapper .arco-textarea-suffix>svg{font-size:14px}.arco-textarea-wrapper .arco-textarea-prefix{padding-right:12px;color:var(--color-text-2)}.arco-textarea-wrapper .arco-textarea-suffix{padding-left:12px;color:var(--color-text-2)}.arco-textarea-wrapper .arco-textarea-suffix .arco-feedback-icon{display:inline-flex}.arco-textarea-wrapper .arco-textarea-suffix .arco-feedback-icon-status-validating{color:rgb(var(--primary-6))}.arco-textarea-wrapper .arco-textarea-suffix .arco-feedback-icon-status-success{color:rgb(var(--success-6))}.arco-textarea-wrapper .arco-textarea-suffix .arco-feedback-icon-status-warning{color:rgb(var(--warning-6))}.arco-textarea-wrapper .arco-textarea-suffix .arco-feedback-icon-status-error{color:rgb(var(--danger-6))}.arco-textarea-wrapper .arco-textarea-clear-btn{align-self:center;color:var(--color-text-2);font-size:12px;visibility:hidden;cursor:pointer}.arco-textarea-wrapper .arco-textarea-clear-btn>svg{position:relative;transition:color .1s cubic-bezier(0,0,1,1)}.arco-textarea-wrapper:hover .arco-textarea-clear-btn{visibility:visible}.arco-textarea-wrapper:not(.arco-textarea-focus) .arco-textarea-icon-hover:hover:before{background-color:var(--color-fill-4)}.arco-textarea-wrapper .arco-textarea-word-limit{position:absolute;right:10px;bottom:6px;color:var(--color-text-3);font-size:12px;-webkit-user-select:none;user-select:none}.arco-textarea-wrapper.arco-textarea-scroll .arco-textarea-word-limit{right:25px}.arco-textarea-wrapper .arco-textarea-clear-btn{position:absolute;top:50%;right:10px;transform:translateY(-50%)}.arco-textarea-wrapper.arco-textarea-scroll .arco-textarea-clear-btn{right:25px}.arco-textarea-wrapper:hover .arco-textarea-clear-btn{display:block}.arco-textarea-wrapper .arco-textarea-mirror{position:absolute;visibility:hidden}.arco-textarea{width:100%;color:inherit;background:none;border:none;border-radius:0;outline:none;cursor:inherit;-webkit-appearance:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:block;box-sizing:border-box;height:100%;min-height:32px;padding:4px 12px;font-size:14px;line-height:1.5715;vertical-align:top;resize:vertical}.arco-textarea::placeholder{color:var(--color-text-3)}.arco-textarea[disabled]::placeholder{color:var(--color-text-4)}.arco-textarea[disabled]{-webkit-text-fill-color:var(--color-text-4)}.arco-input-wrapper{display:inline-flex;box-sizing:border-box;width:100%;padding-right:12px;padding-left:12px;color:var(--color-text-1);font-size:14px;background-color:var(--color-fill-2);border:1px solid transparent;border-radius:var(--border-radius-small);cursor:text;transition:color .1s cubic-bezier(0,0,1,1),border-color .1s cubic-bezier(0,0,1,1),background-color .1s cubic-bezier(0,0,1,1)}.arco-input-wrapper:hover{background-color:var(--color-fill-3);border-color:transparent}.arco-input-wrapper:focus-within,.arco-input-wrapper.arco-input-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--primary-6));box-shadow:0 0 0 0 var(--color-primary-light-2)}.arco-input-wrapper.arco-input-disabled{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent;cursor:not-allowed}.arco-input-wrapper.arco-input-disabled:hover{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent}.arco-input-wrapper.arco-input-disabled .arco-input-prefix,.arco-input-wrapper.arco-input-disabled .arco-input-suffix{color:inherit}.arco-input-wrapper.arco-input-error{background-color:var(--color-danger-light-1);border-color:transparent}.arco-input-wrapper.arco-input-error:hover{background-color:var(--color-danger-light-2);border-color:transparent}.arco-input-wrapper.arco-input-error:focus-within,.arco-input-wrapper.arco-input-error.arco-input-wrapper-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--danger-6));box-shadow:0 0 0 0 var(--color-danger-light-2)}.arco-input-wrapper .arco-input-prefix,.arco-input-wrapper .arco-input-suffix{display:inline-flex;flex-shrink:0;align-items:center;white-space:nowrap;-webkit-user-select:none;user-select:none}.arco-input-wrapper .arco-input-prefix>svg,.arco-input-wrapper .arco-input-suffix>svg{font-size:14px}.arco-input-wrapper .arco-input-prefix{padding-right:12px;color:var(--color-text-2)}.arco-input-wrapper .arco-input-suffix{padding-left:12px;color:var(--color-text-2)}.arco-input-wrapper .arco-input-suffix .arco-feedback-icon{display:inline-flex}.arco-input-wrapper .arco-input-suffix .arco-feedback-icon-status-validating{color:rgb(var(--primary-6))}.arco-input-wrapper .arco-input-suffix .arco-feedback-icon-status-success{color:rgb(var(--success-6))}.arco-input-wrapper .arco-input-suffix .arco-feedback-icon-status-warning{color:rgb(var(--warning-6))}.arco-input-wrapper .arco-input-suffix .arco-feedback-icon-status-error{color:rgb(var(--danger-6))}.arco-input-wrapper .arco-input-clear-btn{align-self:center;color:var(--color-text-2);font-size:12px;visibility:hidden;cursor:pointer}.arco-input-wrapper .arco-input-clear-btn>svg{position:relative;transition:color .1s cubic-bezier(0,0,1,1)}.arco-input-wrapper:hover .arco-input-clear-btn{visibility:visible}.arco-input-wrapper:not(.arco-input-focus) .arco-input-icon-hover:hover:before{background-color:var(--color-fill-4)}.arco-input-wrapper .arco-input{width:100%;padding-right:0;padding-left:0;color:inherit;line-height:1.5715;background:none;border:none;border-radius:0;outline:none;cursor:inherit;-webkit-appearance:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.arco-input-wrapper .arco-input::placeholder{color:var(--color-text-3)}.arco-input-wrapper .arco-input[disabled]::placeholder{color:var(--color-text-4)}.arco-input-wrapper .arco-input[disabled]{-webkit-text-fill-color:var(--color-text-4)}.arco-input-wrapper .arco-input.arco-input-size-mini{padding-top:1px;padding-bottom:1px;font-size:12px;line-height:1.667}.arco-input-wrapper .arco-input.arco-input-size-small{padding-top:2px;padding-bottom:2px;font-size:14px;line-height:1.5715}.arco-input-wrapper .arco-input.arco-input-size-medium{padding-top:4px;padding-bottom:4px;font-size:14px;line-height:1.5715}.arco-input-wrapper .arco-input.arco-input-size-large{padding-top:6px;padding-bottom:6px;font-size:14px;line-height:1.5715}.arco-input-wrapper .arco-input-word-limit{color:var(--color-text-3);font-size:12px}.arco-input-outer{display:inline-flex;width:100%}.arco-input-outer>.arco-input-wrapper{border-radius:0}.arco-input-outer>:first-child{border-top-left-radius:var(--border-radius-small);border-bottom-left-radius:var(--border-radius-small)}.arco-input-outer>:last-child{border-top-right-radius:var(--border-radius-small);border-bottom-right-radius:var(--border-radius-small)}.arco-input-outer.arco-input-outer-size-mini .arco-input-outer,.arco-input-outer.arco-input-outer-size-mini .arco-input-wrapper .arco-input-prefix,.arco-input-outer.arco-input-outer-size-mini .arco-input-wrapper .arco-input-suffix{font-size:12px}.arco-input-outer.arco-input-outer-size-mini .arco-input-wrapper .arco-input-prefix>svg,.arco-input-outer.arco-input-outer-size-mini .arco-input-wrapper .arco-input-suffix>svg{font-size:12px}.arco-input-outer.arco-input-outer-size-mini .arco-input-prepend,.arco-input-outer.arco-input-outer-size-mini .arco-input-append{font-size:12px}.arco-input-outer.arco-input-outer-size-mini .arco-input-prepend>svg,.arco-input-outer.arco-input-outer-size-mini .arco-input-append>svg{font-size:12px}.arco-input-outer.arco-input-outer-size-mini .arco-input-prepend .arco-input{width:auto;height:100%;margin:-1px -13px -1px -12px;border-color:transparent;border-top-left-radius:0;border-bottom-left-radius:0}.arco-input-outer.arco-input-outer-size-mini .arco-input-prepend .arco-select{width:auto;height:100%;margin:-1px -13px -1px -12px}.arco-input-outer.arco-input-outer-size-mini .arco-input-prepend .arco-select .arco-select-view{background-color:inherit;border-color:transparent;border-radius:0}.arco-input-outer.arco-input-outer-size-mini .arco-input-prepend .arco-select.arco-select-single .arco-select-view{height:100%}.arco-input-outer.arco-input-outer-size-mini .arco-input-append .arco-input{width:auto;height:100%;margin:-1px -12px -1px -13px;border-color:transparent;border-top-right-radius:0;border-bottom-right-radius:0}.arco-input-outer.arco-input-outer-size-mini .arco-input-append .arco-select{width:auto;height:100%;margin:-1px -12px -1px -13px}.arco-input-outer.arco-input-outer-size-mini .arco-input-append .arco-select .arco-select-view{background-color:inherit;border-color:transparent;border-radius:0}.arco-input-outer.arco-input-outer-size-mini .arco-input-append .arco-select.arco-select-single .arco-select-view{height:100%}.arco-input-outer.arco-input-outer-size-small .arco-input-outer,.arco-input-outer.arco-input-outer-size-small .arco-input-wrapper .arco-input-prefix,.arco-input-outer.arco-input-outer-size-small .arco-input-wrapper .arco-input-suffix{font-size:14px}.arco-input-outer.arco-input-outer-size-small .arco-input-wrapper .arco-input-prefix>svg,.arco-input-outer.arco-input-outer-size-small .arco-input-wrapper .arco-input-suffix>svg{font-size:14px}.arco-input-outer.arco-input-outer-size-small .arco-input-prepend,.arco-input-outer.arco-input-outer-size-small .arco-input-append{font-size:14px}.arco-input-outer.arco-input-outer-size-small .arco-input-prepend>svg,.arco-input-outer.arco-input-outer-size-small .arco-input-append>svg{font-size:14px}.arco-input-outer.arco-input-outer-size-small .arco-input-prepend .arco-input{width:auto;height:100%;margin:-1px -13px -1px -12px;border-color:transparent;border-top-left-radius:0;border-bottom-left-radius:0}.arco-input-outer.arco-input-outer-size-small .arco-input-prepend .arco-select{width:auto;height:100%;margin:-1px -13px -1px -12px}.arco-input-outer.arco-input-outer-size-small .arco-input-prepend .arco-select .arco-select-view{background-color:inherit;border-color:transparent;border-radius:0}.arco-input-outer.arco-input-outer-size-small .arco-input-prepend .arco-select.arco-select-single .arco-select-view{height:100%}.arco-input-outer.arco-input-outer-size-small .arco-input-append .arco-input{width:auto;height:100%;margin:-1px -12px -1px -13px;border-color:transparent;border-top-right-radius:0;border-bottom-right-radius:0}.arco-input-outer.arco-input-outer-size-small .arco-input-append .arco-select{width:auto;height:100%;margin:-1px -12px -1px -13px}.arco-input-outer.arco-input-outer-size-small .arco-input-append .arco-select .arco-select-view{background-color:inherit;border-color:transparent;border-radius:0}.arco-input-outer.arco-input-outer-size-small .arco-input-append .arco-select.arco-select-single .arco-select-view{height:100%}.arco-input-outer.arco-input-outer-size-large .arco-input-outer,.arco-input-outer.arco-input-outer-size-large .arco-input-wrapper .arco-input-prefix,.arco-input-outer.arco-input-outer-size-large .arco-input-wrapper .arco-input-suffix{font-size:14px}.arco-input-outer.arco-input-outer-size-large .arco-input-wrapper .arco-input-prefix>svg,.arco-input-outer.arco-input-outer-size-large .arco-input-wrapper .arco-input-suffix>svg{font-size:14px}.arco-input-outer.arco-input-outer-size-large .arco-input-prepend,.arco-input-outer.arco-input-outer-size-large .arco-input-append{font-size:14px}.arco-input-outer.arco-input-outer-size-large .arco-input-prepend>svg,.arco-input-outer.arco-input-outer-size-large .arco-input-append>svg{font-size:14px}.arco-input-outer.arco-input-outer-size-large .arco-input-prepend .arco-input{width:auto;height:100%;margin:-1px -13px -1px -12px;border-color:transparent;border-top-left-radius:0;border-bottom-left-radius:0}.arco-input-outer.arco-input-outer-size-large .arco-input-prepend .arco-select{width:auto;height:100%;margin:-1px -13px -1px -12px}.arco-input-outer.arco-input-outer-size-large .arco-input-prepend .arco-select .arco-select-view{background-color:inherit;border-color:transparent;border-radius:0}.arco-input-outer.arco-input-outer-size-large .arco-input-prepend .arco-select.arco-select-single .arco-select-view{height:100%}.arco-input-outer.arco-input-outer-size-large .arco-input-append .arco-input{width:auto;height:100%;margin:-1px -12px -1px -13px;border-color:transparent;border-top-right-radius:0;border-bottom-right-radius:0}.arco-input-outer.arco-input-outer-size-large .arco-input-append .arco-select{width:auto;height:100%;margin:-1px -12px -1px -13px}.arco-input-outer.arco-input-outer-size-large .arco-input-append .arco-select .arco-select-view{background-color:inherit;border-color:transparent;border-radius:0}.arco-input-outer.arco-input-outer-size-large .arco-input-append .arco-select.arco-select-single .arco-select-view{height:100%}.arco-input-outer-disabled{cursor:not-allowed}.arco-input-prepend,.arco-input-append{display:inline-flex;flex-shrink:0;align-items:center;box-sizing:border-box;padding:0 12px;color:var(--color-text-1);white-space:nowrap;background-color:var(--color-fill-2);border:1px solid transparent}.arco-input-prepend>svg,.arco-input-append>svg{font-size:14px}.arco-input-prepend{border-right:1px solid var(--color-neutral-3)}.arco-input-prepend .arco-input{width:auto;height:100%;margin:-1px -12px -1px -13px;border-color:transparent;border-top-right-radius:0;border-bottom-right-radius:0}.arco-input-prepend .arco-select{width:auto;height:100%;margin:-1px -12px -1px -13px}.arco-input-prepend .arco-select .arco-select-view{background-color:inherit;border-color:transparent;border-radius:0}.arco-input-prepend .arco-select.arco-select-single .arco-select-view{height:100%}.arco-input-append{border-left:1px solid var(--color-neutral-3)}.arco-input-append .arco-input{width:auto;height:100%;margin:-1px -13px -1px -12px;border-color:transparent;border-top-left-radius:0;border-bottom-left-radius:0}.arco-input-append .arco-select{width:auto;height:100%;margin:-1px -13px -1px -12px}.arco-input-append .arco-select .arco-select-view{background-color:inherit;border-color:transparent;border-radius:0}.arco-input-append .arco-select.arco-select-single .arco-select-view{height:100%}.arco-input-group{display:inline-flex;align-items:center}.arco-input-group>*{border-radius:0}.arco-input-group>*.arco-input-outer>:last-child,.arco-input-group>*.arco-input-outer>:first-child{border-radius:0}.arco-input-group>*:not(:last-child){position:relative;box-sizing:border-box}.arco-input-group>*:first-child,.arco-input-group>*:first-child .arco-input-group>*:first-child{border-top-left-radius:var(--border-radius-small);border-bottom-left-radius:var(--border-radius-small)}.arco-input-group>*:first-child .arco-select-view,.arco-input-group>*:first-child .arco-input-group>*:first-child .arco-select-view{border-top-left-radius:var(--border-radius-small);border-bottom-left-radius:var(--border-radius-small)}.arco-input-group>*:last-child,.arco-input-group>*:last-child .arco-input-outer>*:last-child{border-top-right-radius:var(--border-radius-small);border-bottom-right-radius:var(--border-radius-small)}.arco-input-group>*:last-child .arco-select-view,.arco-input-group>*:last-child .arco-input-outer>*:last-child .arco-select-view{border-top-right-radius:var(--border-radius-small);border-bottom-right-radius:var(--border-radius-small)}.arco-input-group>.arco-input-wrapper:not(:last-child),.arco-input-group>.arco-input-outer:not(:last-child),.arco-input-group>.arco-input-tag:not(:last-child),.arco-input-group>.arco-select-view:not(:last-child){margin-right:-1px;border-right:1px solid var(--color-neutral-3)}.arco-input-group>.arco-input-wrapper:not(:last-child):focus-within,.arco-input-group>.arco-input-outer:not(:last-child):focus-within,.arco-input-group>.arco-input-tag:not(:last-child):focus-within,.arco-input-group>.arco-select-view:not(:last-child):focus-within{border-right-color:rgb(var(--primary-6))}.arco-input-group>.arco-input-wrapper.arco-input-error:not(:last-child):focus-within{border-right-color:rgb(var(--danger-6))}.size-height-size-mini{padding-top:1px;padding-bottom:1px;font-size:12px;line-height:1.667}.size-height-size-small{padding-top:2px;padding-bottom:2px;font-size:14px}.size-height-size-large{padding-top:6px;padding-bottom:6px;font-size:14px}.arco-textarea-wrapper{position:relative;display:inline-block;width:100%}.arco-textarea-clear-wrapper:hover .arco-textarea-clear-icon{display:inline-block}.arco-textarea-clear-wrapper .arco-textarea{padding-right:20px}.arco-textarea-word-limit{position:absolute;right:10px;bottom:6px;color:var(--color-text-3);font-size:12px;-webkit-user-select:none;user-select:none}.arco-textarea-clear-icon{position:absolute;top:10px;right:10px;display:none;font-size:12px}.arco-input-search .arco-input-append{padding:0;border:none}.arco-input-search .arco-input-suffix{color:var(--color-text-2);font-size:14px}.arco-input-search .arco-input-search-btn{border-top-left-radius:0;border-bottom-left-radius:0}.arco-input-wrapper.arco-input-password:not(.arco-input-disabled) .arco-input-suffix{color:var(--color-text-2);font-size:12px;cursor:pointer}.arco-dot-loading{position:relative;display:inline-block;width:56px;height:8px;transform-style:preserve-3d;perspective:200px}.arco-dot-loading-item{position:absolute;top:0;left:50%;width:8px;height:8px;background-color:rgb(var(--primary-6));border-radius:var(--border-radius-circle);transform:translate(-50%) scale(0);animation:arco-dot-loading 2s cubic-bezier(0,0,1,1) infinite forwards}.arco-dot-loading-item:nth-child(2){background-color:rgb(var(--primary-5));animation-delay:.4s}.arco-dot-loading-item:nth-child(3){background-color:rgb(var(--primary-4));animation-delay:.8s}.arco-dot-loading-item:nth-child(4){background-color:rgb(var(--primary-4));animation-delay:1.2s}.arco-dot-loading-item:nth-child(5){background-color:rgb(var(--primary-2));animation-delay:1.6s}@keyframes arco-dot-loading{0%{transform:translate3D(-48.621%,0,-.985px) scale(.511)}2.778%{transform:translate3D(-95.766%,0,-.94px) scale(.545)}5.556%{transform:translate3D(-140%,0,-.866px) scale(.6)}8.333%{transform:translate3D(-179.981%,0,-.766px) scale(.675)}11.111%{transform:translate3D(-214.492%,0,-.643px) scale(.768)}13.889%{transform:translate3D(-242.487%,0,-.5px) scale(.875)}16.667%{transform:translate3D(-263.114%,0,-.342px) scale(.993)}19.444%{transform:translate3D(-275.746%,0,-.174px) scale(1.12)}22.222%{transform:translate3D(-280%,0,0) scale(1.25)}25%{transform:translate3D(-275.746%,0,.174px) scale(1.38)}27.778%{transform:translate3D(-263.114%,0,.342px) scale(1.507)}30.556%{transform:translate3D(-242.487%,0,.5px) scale(1.625)}33.333%{transform:translate3D(-214.492%,0,.643px) scale(1.732)}36.111%{transform:translate3D(-179.981%,0,.766px) scale(1.825)}38.889%{transform:translate3D(-140%,0,.866px) scale(1.9)}41.667%{transform:translate3D(-95.766%,0,.94px) scale(1.955)}44.444%{transform:translate3D(-48.621%,0,.985px) scale(1.989)}47.222%{transform:translateZ(1px) scale(2)}50%{transform:translate3D(48.621%,0,.985px) scale(1.989)}52.778%{transform:translate3D(95.766%,0,.94px) scale(1.955)}55.556%{transform:translate3D(140%,0,.866px) scale(1.9)}58.333%{transform:translate3D(179.981%,0,.766px) scale(1.825)}61.111%{transform:translate3D(214.492%,0,.643px) scale(1.732)}63.889%{transform:translate3D(242.487%,0,.5px) scale(1.625)}66.667%{transform:translate3D(263.114%,0,.342px) scale(1.507)}69.444%{transform:translate3D(275.746%,0,.174px) scale(1.38)}72.222%{transform:translate3D(280%,0,0) scale(1.25)}75%{transform:translate3D(275.746%,0,-.174px) scale(1.12)}77.778%{transform:translate3D(263.114%,0,-.342px) scale(.993)}80.556%{transform:translate3D(242.487%,0,-.5px) scale(.875)}83.333%{transform:translate3D(214.492%,0,-.643px) scale(.768)}86.111%{transform:translate3D(179.981%,0,-.766px) scale(.675)}88.889%{transform:translate3D(140%,0,-.866px) scale(.6)}91.667%{transform:translate3D(95.766%,0,-.94px) scale(.545)}94.444%{transform:translate3D(48.621%,0,-.985px) scale(.511)}97.222%{transform:translateZ(-1px) scale(.5)}}.arco-spin{display:inline-block}.arco-spin-with-tip{text-align:center}.arco-spin-icon{color:rgb(var(--primary-6));font-size:20px}.arco-spin-tip{margin-top:6px;color:rgb(var(--primary-6));font-weight:500;font-size:14px}.arco-spin-mask{position:absolute;top:0;right:0;bottom:0;left:0;z-index:11;text-align:center;background-color:var(--color-spin-layer-bg);transition:opacity .1s cubic-bezier(0,0,1,1);-webkit-user-select:none;user-select:none}.arco-spin-loading{position:relative;-webkit-user-select:none;user-select:none}.arco-spin-loading .arco-spin-mask-icon{position:absolute;top:50%;left:50%;z-index:12;transform:translate(-50%,-50%)}.arco-spin-loading .arco-spin-children:after{opacity:1;pointer-events:auto}.arco-input-label{display:inline-flex;box-sizing:border-box;width:100%;padding-right:12px;padding-left:12px;color:var(--color-text-1);font-size:14px;background-color:var(--color-fill-2);border:1px solid transparent;border-radius:var(--border-radius-small);cursor:text;transition:color .1s cubic-bezier(0,0,1,1),border-color .1s cubic-bezier(0,0,1,1),background-color .1s cubic-bezier(0,0,1,1);cursor:pointer}.arco-input-label.arco-input-label-search{cursor:text}.arco-input-label.arco-input-label-search .arco-input-label-value{pointer-events:none}.arco-input-label:hover{background-color:var(--color-fill-3);border-color:transparent}.arco-input-label:focus-within,.arco-input-label.arco-input-label-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--primary-6));box-shadow:0 0 0 0 var(--color-primary-light-2)}.arco-input-label.arco-input-label-disabled{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent;cursor:not-allowed}.arco-input-label.arco-input-label-disabled:hover{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent}.arco-input-label.arco-input-label-disabled .arco-input-label-prefix,.arco-input-label.arco-input-label-disabled .arco-input-label-suffix{color:inherit}.arco-input-label.arco-input-label-error{background-color:var(--color-danger-light-1);border-color:transparent}.arco-input-label.arco-input-label-error:hover{background-color:var(--color-danger-light-2);border-color:transparent}.arco-input-label.arco-input-label-error:focus-within,.arco-input-label.arco-input-label-error.arco-input-label-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--danger-6));box-shadow:0 0 0 0 var(--color-danger-light-2)}.arco-input-label .arco-input-label-prefix,.arco-input-label .arco-input-label-suffix{display:inline-flex;flex-shrink:0;align-items:center;white-space:nowrap;-webkit-user-select:none;user-select:none}.arco-input-label .arco-input-label-prefix>svg,.arco-input-label .arco-input-label-suffix>svg{font-size:14px}.arco-input-label .arco-input-label-prefix{padding-right:12px;color:var(--color-text-2)}.arco-input-label .arco-input-label-suffix{padding-left:12px;color:var(--color-text-2)}.arco-input-label .arco-input-label-suffix .arco-feedback-icon{display:inline-flex}.arco-input-label .arco-input-label-suffix .arco-feedback-icon-status-validating{color:rgb(var(--primary-6))}.arco-input-label .arco-input-label-suffix .arco-feedback-icon-status-success{color:rgb(var(--success-6))}.arco-input-label .arco-input-label-suffix .arco-feedback-icon-status-warning{color:rgb(var(--warning-6))}.arco-input-label .arco-input-label-suffix .arco-feedback-icon-status-error{color:rgb(var(--danger-6))}.arco-input-label .arco-input-label-clear-btn{align-self:center;color:var(--color-text-2);font-size:12px;visibility:hidden;cursor:pointer}.arco-input-label .arco-input-label-clear-btn>svg{position:relative;transition:color .1s cubic-bezier(0,0,1,1)}.arco-input-label:hover .arco-input-label-clear-btn{visibility:visible}.arco-input-label:not(.arco-input-label-focus) .arco-input-label-icon-hover:hover:before{background-color:var(--color-fill-4)}.arco-input-label .arco-input-label-input{width:100%;padding-right:0;padding-left:0;color:inherit;line-height:1.5715;background:none;border:none;border-radius:0;outline:none;cursor:inherit;-webkit-appearance:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.arco-input-label .arco-input-label-input::placeholder{color:var(--color-text-3)}.arco-input-label .arco-input-label-input[disabled]::placeholder{color:var(--color-text-4)}.arco-input-label .arco-input-label-input[disabled]{-webkit-text-fill-color:var(--color-text-4)}.arco-input-label .arco-input-label-input-hidden{position:absolute;width:0!important}.arco-input-label .arco-input-label-value{display:flex;align-items:center;box-sizing:border-box;width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.arco-input-label .arco-input-label-value:after{font-size:0;line-height:0;visibility:hidden;content:"."}.arco-input-label .arco-input-label-value-hidden{display:none}.arco-input-label.arco-input-label-size-mini .arco-input-label-input,.arco-input-label.arco-input-label-size-mini .arco-input-label-value{padding-top:1px;padding-bottom:1px;font-size:12px;line-height:1.667}.arco-input-label.arco-input-label-size-mini .arco-input-label-value{min-height:22px}.arco-input-label.arco-input-label-size-medium .arco-input-label-input,.arco-input-label.arco-input-label-size-medium .arco-input-label-value{padding-top:4px;padding-bottom:4px;font-size:14px;line-height:1.5715}.arco-input-label.arco-input-label-size-medium .arco-input-label-value{min-height:30px}.arco-input-label.arco-input-label-size-small .arco-input-label-input,.arco-input-label.arco-input-label-size-small .arco-input-label-value{padding-top:2px;padding-bottom:2px;font-size:14px;line-height:1.5715}.arco-input-label.arco-input-label-size-small .arco-input-label-value{min-height:26px}.arco-input-label.arco-input-label-size-large .arco-input-label-input,.arco-input-label.arco-input-label-size-large .arco-input-label-value{padding-top:6px;padding-bottom:6px;font-size:14px;line-height:1.5715}.arco-input-label.arco-input-label-size-large .arco-input-label-value{min-height:34px}.arco-input-tag{display:inline-flex;box-sizing:border-box;width:100%;padding-right:12px;padding-left:12px;color:var(--color-text-1);font-size:14px;background-color:var(--color-fill-2);border:1px solid transparent;border-radius:var(--border-radius-small);cursor:text;transition:color .1s cubic-bezier(0,0,1,1),border-color .1s cubic-bezier(0,0,1,1),background-color .1s cubic-bezier(0,0,1,1)}.arco-input-tag:hover{background-color:var(--color-fill-3);border-color:transparent}.arco-input-tag:focus-within,.arco-input-tag.arco-input-tag-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--primary-6));box-shadow:0 0 0 0 var(--color-primary-light-2)}.arco-input-tag.arco-input-tag-disabled{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent;cursor:not-allowed}.arco-input-tag.arco-input-tag-disabled:hover{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent}.arco-input-tag.arco-input-tag-disabled .arco-input-tag-prefix,.arco-input-tag.arco-input-tag-disabled .arco-input-tag-suffix{color:inherit}.arco-input-tag.arco-input-tag-error{background-color:var(--color-danger-light-1);border-color:transparent}.arco-input-tag.arco-input-tag-error:hover{background-color:var(--color-danger-light-2);border-color:transparent}.arco-input-tag.arco-input-tag-error:focus-within,.arco-input-tag.arco-input-tag-error.arco-input-tag-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--danger-6));box-shadow:0 0 0 0 var(--color-danger-light-2)}.arco-input-tag .arco-input-tag-prefix,.arco-input-tag .arco-input-tag-suffix{display:inline-flex;flex-shrink:0;align-items:center;white-space:nowrap;-webkit-user-select:none;user-select:none}.arco-input-tag .arco-input-tag-prefix>svg,.arco-input-tag .arco-input-tag-suffix>svg{font-size:14px}.arco-input-tag .arco-input-tag-prefix{padding-right:12px;color:var(--color-text-2)}.arco-input-tag .arco-input-tag-suffix{padding-left:12px;color:var(--color-text-2)}.arco-input-tag .arco-input-tag-suffix .arco-feedback-icon{display:inline-flex}.arco-input-tag .arco-input-tag-suffix .arco-feedback-icon-status-validating{color:rgb(var(--primary-6))}.arco-input-tag .arco-input-tag-suffix .arco-feedback-icon-status-success{color:rgb(var(--success-6))}.arco-input-tag .arco-input-tag-suffix .arco-feedback-icon-status-warning{color:rgb(var(--warning-6))}.arco-input-tag .arco-input-tag-suffix .arco-feedback-icon-status-error{color:rgb(var(--danger-6))}.arco-input-tag .arco-input-tag-clear-btn{align-self:center;color:var(--color-text-2);font-size:12px;visibility:hidden;cursor:pointer}.arco-input-tag .arco-input-tag-clear-btn>svg{position:relative;transition:color .1s cubic-bezier(0,0,1,1)}.arco-input-tag:hover .arco-input-tag-clear-btn{visibility:visible}.arco-input-tag:not(.arco-input-tag-focus) .arco-input-tag-icon-hover:hover:before{background-color:var(--color-fill-4)}.arco-input-tag.arco-input-tag-has-tag{padding-right:4px;padding-left:4px}.arco-input-tag.arco-input-tag-has-prefix{padding-left:12px}.arco-input-tag.arco-input-tag-has-suffix{padding-right:12px}.arco-input-tag .arco-input-tag-inner{flex:1;overflow:hidden;line-height:0}.arco-input-tag .arco-input-tag-inner .arco-input-tag-tag{display:inline-flex;align-items:center;margin-right:4px;color:var(--color-text-1);font-size:12px;white-space:pre-wrap;word-break:break-word;background-color:var(--color-bg-2);border-color:var(--color-fill-3)}.arco-input-tag .arco-input-tag-inner .arco-input-tag-tag .arco-icon-hover:hover:before{background-color:var(--color-fill-2)}.arco-input-tag .arco-input-tag-inner .arco-input-tag-tag.arco-tag-custom-color{color:var(--color-white)}.arco-input-tag .arco-input-tag-inner .arco-input-tag-tag.arco-tag-custom-color .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:#fff3}.arco-input-tag .arco-input-tag-inner .arco-input-tag-input{width:100%;padding-right:0;padding-left:0;color:inherit;line-height:1.5715;background:none;border:none;border-radius:0;outline:none;cursor:inherit;-webkit-appearance:none;-webkit-tap-highlight-color:rgba(0,0,0,0);box-sizing:border-box}.arco-input-tag .arco-input-tag-inner .arco-input-tag-input::placeholder{color:var(--color-text-3)}.arco-input-tag .arco-input-tag-inner .arco-input-tag-input[disabled]::placeholder{color:var(--color-text-4)}.arco-input-tag .arco-input-tag-inner .arco-input-tag-input[disabled]{-webkit-text-fill-color:var(--color-text-4)}.arco-input-tag .arco-input-tag-mirror{position:absolute;top:0;left:0;white-space:pre;visibility:hidden;pointer-events:none}.arco-input-tag.arco-input-tag-focus .arco-input-tag-tag{background-color:var(--color-fill-2);border-color:var(--color-fill-2)}.arco-input-tag.arco-input-tag-focus .arco-input-tag-tag .arco-icon-hover:hover:before{background-color:var(--color-fill-3)}.arco-input-tag.arco-input-tag-disabled .arco-input-tag-tag{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:var(--color-fill-3)}.arco-input-tag.arco-input-tag-readonly,.arco-input-tag.arco-input-tag-disabled-input{cursor:default}.arco-input-tag.arco-input-tag-size-mini{font-size:12px}.arco-input-tag.arco-input-tag-size-mini .arco-input-tag-inner{padding-top:0;padding-bottom:0}.arco-input-tag.arco-input-tag-size-mini .arco-input-tag-tag,.arco-input-tag.arco-input-tag-size-mini .arco-input-tag-input{margin-top:1px;margin-bottom:1px;line-height:18px;vertical-align:middle}.arco-input-tag.arco-input-tag-size-mini .arco-input-tag-tag,.arco-input-tag.arco-input-tag-size-mini .arco-input-tag-input{height:auto;min-height:20px}.arco-input-tag.arco-input-tag-size-medium{font-size:14px}.arco-input-tag.arco-input-tag-size-medium .arco-input-tag-inner{padding-top:2px;padding-bottom:2px}.arco-input-tag.arco-input-tag-size-medium .arco-input-tag-tag,.arco-input-tag.arco-input-tag-size-medium .arco-input-tag-input{margin-top:1px;margin-bottom:1px;line-height:22px;vertical-align:middle}.arco-input-tag.arco-input-tag-size-medium .arco-input-tag-tag,.arco-input-tag.arco-input-tag-size-medium .arco-input-tag-input{height:auto;min-height:24px}.arco-input-tag.arco-input-tag-size-small{font-size:14px}.arco-input-tag.arco-input-tag-size-small .arco-input-tag-inner{padding-top:2px;padding-bottom:2px}.arco-input-tag.arco-input-tag-size-small .arco-input-tag-tag,.arco-input-tag.arco-input-tag-size-small .arco-input-tag-input{margin-top:1px;margin-bottom:1px;line-height:18px;vertical-align:middle}.arco-input-tag.arco-input-tag-size-small .arco-input-tag-tag,.arco-input-tag.arco-input-tag-size-small .arco-input-tag-input{height:auto;min-height:20px}.arco-input-tag.arco-input-tag-size-large{font-size:14px}.arco-input-tag.arco-input-tag-size-large .arco-input-tag-inner{padding-top:2px;padding-bottom:2px}.arco-input-tag.arco-input-tag-size-large .arco-input-tag-tag,.arco-input-tag.arco-input-tag-size-large .arco-input-tag-input{margin-top:1px;margin-bottom:1px;line-height:26px;vertical-align:middle}.arco-input-tag.arco-input-tag-size-large .arco-input-tag-tag,.arco-input-tag.arco-input-tag-size-large .arco-input-tag-input{height:auto;min-height:28px}.input-tag-zoom-enter-from{transform:scale(.5);opacity:0}.input-tag-zoom-enter-to{transform:scale(1);opacity:1}.input-tag-zoom-enter-active{transition:all .3s cubic-bezier(.34,.69,.1,1)}.input-tag-zoom-leave-from{transform:scale(1);opacity:1}.input-tag-zoom-leave-to{transform:scale(.5);opacity:0}.input-tag-zoom-leave-active{position:absolute;transition:all .3s cubic-bezier(.3,1.3,.3,1)}.input-tag-zoom-move{transition:all .3s cubic-bezier(.3,1.3,.3,1)}.arco-tag{display:inline-flex;align-items:center;box-sizing:border-box;height:24px;padding:0 8px;color:var(--color-text-1);font-weight:500;font-size:12px;line-height:22px;vertical-align:middle;border:1px solid transparent;border-radius:var(--border-radius-small);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.arco-tag .arco-icon-hover.arco-tag-icon-hover:before{width:16px;height:16px}.arco-tag .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:var(--color-fill-3)}.arco-tag-checkable{cursor:pointer;transition:all .1s cubic-bezier(0,0,1,1)}.arco-tag-checkable:hover{background-color:var(--color-fill-2)}.arco-tag-checked{background-color:var(--color-fill-2);border-color:transparent}.arco-tag-checkable.arco-tag-checked:hover{background-color:var(--color-fill-3);border-color:transparent}.arco-tag-bordered,.arco-tag-checkable.arco-tag-checked.arco-tag-bordered:hover{border-color:var(--color-border-2)}.arco-tag-size-small{height:20px;font-size:12px;line-height:18px}.arco-tag-size-medium{height:24px;font-size:12px;line-height:22px}.arco-tag-size-large{height:32px;font-size:14px;line-height:30px}.arco-tag-hide{display:none}.arco-tag-loading{cursor:default;opacity:.8}.arco-tag-icon{margin-right:4px;color:var(--color-text-2)}.arco-tag.arco-tag-checked.arco-tag-red{color:rgb(var(--red-6));background-color:rgb(var(--red-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-red .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--red-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-red.arco-tag:hover{background-color:rgb(var(--red-2));border-color:transparent}.arco-tag-checked.arco-tag-red.arco-tag-bordered,.arco-tag-checked.arco-tag-red.arco-tag-bordered:hover{border-color:rgb(var(--red-6))}.arco-tag.arco-tag-checked.arco-tag-red .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-red .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-red .arco-tag-loading-icon{color:rgb(var(--red-6))}.arco-tag.arco-tag-checked.arco-tag-orangered{color:rgb(var(--orangered-6));background-color:rgb(var(--orangered-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-orangered .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--orangered-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-orangered.arco-tag:hover{background-color:rgb(var(--orangered-2));border-color:transparent}.arco-tag-checked.arco-tag-orangered.arco-tag-bordered,.arco-tag-checked.arco-tag-orangered.arco-tag-bordered:hover{border-color:rgb(var(--orangered-6))}.arco-tag.arco-tag-checked.arco-tag-orangered .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-orangered .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-orangered .arco-tag-loading-icon{color:rgb(var(--orangered-6))}.arco-tag.arco-tag-checked.arco-tag-orange{color:rgb(var(--orange-6));background-color:rgb(var(--orange-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-orange .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--orange-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-orange.arco-tag:hover{background-color:rgb(var(--orange-2));border-color:transparent}.arco-tag-checked.arco-tag-orange.arco-tag-bordered,.arco-tag-checked.arco-tag-orange.arco-tag-bordered:hover{border-color:rgb(var(--orange-6))}.arco-tag.arco-tag-checked.arco-tag-orange .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-orange .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-orange .arco-tag-loading-icon{color:rgb(var(--orange-6))}.arco-tag.arco-tag-checked.arco-tag-gold{color:rgb(var(--gold-6));background-color:rgb(var(--gold-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-gold .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--gold-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-gold.arco-tag:hover{background-color:rgb(var(--gold-3));border-color:transparent}.arco-tag-checked.arco-tag-gold.arco-tag-bordered,.arco-tag-checked.arco-tag-gold.arco-tag-bordered:hover{border-color:rgb(var(--gold-6))}.arco-tag.arco-tag-checked.arco-tag-gold .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-gold .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-gold .arco-tag-loading-icon{color:rgb(var(--gold-6))}.arco-tag.arco-tag-checked.arco-tag-lime{color:rgb(var(--lime-6));background-color:rgb(var(--lime-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-lime .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--lime-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-lime.arco-tag:hover{background-color:rgb(var(--lime-2));border-color:transparent}.arco-tag-checked.arco-tag-lime.arco-tag-bordered,.arco-tag-checked.arco-tag-lime.arco-tag-bordered:hover{border-color:rgb(var(--lime-6))}.arco-tag.arco-tag-checked.arco-tag-lime .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-lime .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-lime .arco-tag-loading-icon{color:rgb(var(--lime-6))}.arco-tag.arco-tag-checked.arco-tag-green{color:rgb(var(--green-6));background-color:rgb(var(--green-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-green .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--green-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-green.arco-tag:hover{background-color:rgb(var(--green-2));border-color:transparent}.arco-tag-checked.arco-tag-green.arco-tag-bordered,.arco-tag-checked.arco-tag-green.arco-tag-bordered:hover{border-color:rgb(var(--green-6))}.arco-tag.arco-tag-checked.arco-tag-green .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-green .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-green .arco-tag-loading-icon{color:rgb(var(--green-6))}.arco-tag.arco-tag-checked.arco-tag-cyan{color:rgb(var(--cyan-6));background-color:rgb(var(--cyan-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-cyan .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--cyan-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-cyan.arco-tag:hover{background-color:rgb(var(--cyan-2));border-color:transparent}.arco-tag-checked.arco-tag-cyan.arco-tag-bordered,.arco-tag-checked.arco-tag-cyan.arco-tag-bordered:hover{border-color:rgb(var(--cyan-6))}.arco-tag.arco-tag-checked.arco-tag-cyan .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-cyan .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-cyan .arco-tag-loading-icon{color:rgb(var(--cyan-6))}.arco-tag.arco-tag-checked.arco-tag-blue{color:rgb(var(--blue-6));background-color:rgb(var(--blue-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-blue .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--blue-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-blue.arco-tag:hover{background-color:rgb(var(--blue-2));border-color:transparent}.arco-tag-checked.arco-tag-blue.arco-tag-bordered,.arco-tag-checked.arco-tag-blue.arco-tag-bordered:hover{border-color:rgb(var(--blue-6))}.arco-tag.arco-tag-checked.arco-tag-blue .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-blue .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-blue .arco-tag-loading-icon{color:rgb(var(--blue-6))}.arco-tag.arco-tag-checked.arco-tag-arcoblue{color:rgb(var(--arcoblue-6));background-color:rgb(var(--arcoblue-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-arcoblue .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--arcoblue-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-arcoblue.arco-tag:hover{background-color:rgb(var(--arcoblue-2));border-color:transparent}.arco-tag-checked.arco-tag-arcoblue.arco-tag-bordered,.arco-tag-checked.arco-tag-arcoblue.arco-tag-bordered:hover{border-color:rgb(var(--arcoblue-6))}.arco-tag.arco-tag-checked.arco-tag-arcoblue .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-arcoblue .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-arcoblue .arco-tag-loading-icon{color:rgb(var(--arcoblue-6))}.arco-tag.arco-tag-checked.arco-tag-purple{color:rgb(var(--purple-6));background-color:rgb(var(--purple-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-purple .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--purple-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-purple.arco-tag:hover{background-color:rgb(var(--purple-2));border-color:transparent}.arco-tag-checked.arco-tag-purple.arco-tag-bordered,.arco-tag-checked.arco-tag-purple.arco-tag-bordered:hover{border-color:rgb(var(--purple-6))}.arco-tag.arco-tag-checked.arco-tag-purple .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-purple .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-purple .arco-tag-loading-icon{color:rgb(var(--purple-6))}.arco-tag.arco-tag-checked.arco-tag-pinkpurple{color:rgb(var(--pinkpurple-6));background-color:rgb(var(--pinkpurple-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-pinkpurple .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--pinkpurple-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-pinkpurple.arco-tag:hover{background-color:rgb(var(--pinkpurple-2));border-color:transparent}.arco-tag-checked.arco-tag-pinkpurple.arco-tag-bordered,.arco-tag-checked.arco-tag-pinkpurple.arco-tag-bordered:hover{border-color:rgb(var(--pinkpurple-6))}.arco-tag.arco-tag-checked.arco-tag-pinkpurple .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-pinkpurple .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-pinkpurple .arco-tag-loading-icon{color:rgb(var(--pinkpurple-6))}.arco-tag.arco-tag-checked.arco-tag-magenta{color:rgb(var(--magenta-6));background-color:rgb(var(--magenta-1));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-magenta .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--magenta-2))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-magenta.arco-tag:hover{background-color:rgb(var(--magenta-2));border-color:transparent}.arco-tag-checked.arco-tag-magenta.arco-tag-bordered,.arco-tag-checked.arco-tag-magenta.arco-tag-bordered:hover{border-color:rgb(var(--magenta-6))}.arco-tag.arco-tag-checked.arco-tag-magenta .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-magenta .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-magenta .arco-tag-loading-icon{color:rgb(var(--magenta-6))}.arco-tag.arco-tag-checked.arco-tag-gray{color:rgb(var(--gray-6));background-color:rgb(var(--gray-2));border:1px solid transparent}.arco-tag.arco-tag-checked.arco-tag-gray .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgb(var(--gray-3))}.arco-tag.arco-tag-checkable.arco-tag-checked.arco-tag-gray.arco-tag:hover{background-color:rgb(var(--gray-3));border-color:transparent}.arco-tag-checked.arco-tag-gray.arco-tag-bordered,.arco-tag-checked.arco-tag-gray.arco-tag-bordered:hover{border-color:rgb(var(--gray-6))}.arco-tag.arco-tag-checked.arco-tag-gray .arco-tag-icon,.arco-tag.arco-tag-checked.arco-tag-gray .arco-tag-close-btn,.arco-tag.arco-tag-checked.arco-tag-gray .arco-tag-loading-icon{color:rgb(var(--gray-6))}.arco-tag.arco-tag-custom-color{color:var(--color-white)}.arco-tag.arco-tag-custom-color .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:#fff3}.arco-tag .arco-tag-close-btn{margin-left:4px;font-size:12px}.arco-tag .arco-tag-close-btn>svg{position:relative}.arco-tag .arco-tag-loading-icon{margin-left:4px;font-size:12px}body[arco-theme=dark] .arco-tag-checked{color:#ffffffe6}body[arco-theme=dark] .arco-tag-checked.arco-tag-red{background-color:rgba(var(--red-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-red .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--red-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-red:hover{background-color:rgba(var(--red-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-orangered{background-color:rgba(var(--orangered-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-orangered .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--orangered-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-orangered:hover{background-color:rgba(var(--orangered-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-orange{background-color:rgba(var(--orange-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-orange .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--orange-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-orange:hover{background-color:rgba(var(--orange-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-gold{background-color:rgba(var(--gold-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-gold .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--gold-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-gold:hover{background-color:rgba(var(--gold-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-lime{background-color:rgba(var(--lime-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-lime .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--lime-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-lime:hover{background-color:rgba(var(--lime-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-green{background-color:rgba(var(--green-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-green .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--green-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-green:hover{background-color:rgba(var(--green-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-cyan{background-color:rgba(var(--cyan-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-cyan .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--cyan-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-cyan:hover{background-color:rgba(var(--cyan-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-blue{background-color:rgba(var(--blue-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-blue .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--blue-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-blue:hover{background-color:rgba(var(--blue-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-arcoblue{background-color:rgba(var(--arcoblue-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-arcoblue .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--arcoblue-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-arcoblue:hover{background-color:rgba(var(--arcoblue-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-purple{background-color:rgba(var(--purple-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-purple .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--purple-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-purple:hover{background-color:rgba(var(--purple-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-pinkpurple{background-color:rgba(var(--pinkpurple-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-pinkpurple .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--pinkpurple-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-pinkpurple:hover{background-color:rgba(var(--pinkpurple-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-magenta{background-color:rgba(var(--magenta-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-magenta .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--magenta-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-magenta:hover{background-color:rgba(var(--magenta-6),.35)}body[arco-theme=dark] .arco-tag-checked.arco-tag-gray{background-color:rgba(var(--gray-6),.2)}body[arco-theme=dark] .arco-tag-checked.arco-tag-gray .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:rgba(var(--gray-6),.35)}body[arco-theme=dark] .arco-tag-checkable.arco-tag-checked.arco-tag-gray:hover{background-color:rgba(var(--gray-6),.35)}.arco-select-view-single{display:inline-flex;box-sizing:border-box;width:100%;padding-right:12px;padding-left:12px;color:var(--color-text-1);font-size:14px;background-color:var(--color-fill-2);border:1px solid transparent;border-radius:var(--border-radius-small);cursor:text;transition:color .1s cubic-bezier(0,0,1,1),border-color .1s cubic-bezier(0,0,1,1),background-color .1s cubic-bezier(0,0,1,1);cursor:pointer}.arco-select-view-single.arco-select-view-search{cursor:text}.arco-select-view-single.arco-select-view-search .arco-select-view-value{pointer-events:none}.arco-select-view-single:hover{background-color:var(--color-fill-3);border-color:transparent}.arco-select-view-single:focus-within,.arco-select-view-single.arco-select-view-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--primary-6));box-shadow:0 0 0 0 var(--color-primary-light-2)}.arco-select-view-single.arco-select-view-disabled{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent;cursor:not-allowed}.arco-select-view-single.arco-select-view-disabled:hover{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent}.arco-select-view-single.arco-select-view-disabled .arco-select-view-prefix,.arco-select-view-single.arco-select-view-disabled .arco-select-view-suffix{color:inherit}.arco-select-view-single.arco-select-view-error{background-color:var(--color-danger-light-1);border-color:transparent}.arco-select-view-single.arco-select-view-error:hover{background-color:var(--color-danger-light-2);border-color:transparent}.arco-select-view-single.arco-select-view-error:focus-within,.arco-select-view-single.arco-select-view-error.arco-select-view-single-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--danger-6));box-shadow:0 0 0 0 var(--color-danger-light-2)}.arco-select-view-single .arco-select-view-prefix,.arco-select-view-single .arco-select-view-suffix{display:inline-flex;flex-shrink:0;align-items:center;white-space:nowrap;-webkit-user-select:none;user-select:none}.arco-select-view-single .arco-select-view-prefix>svg,.arco-select-view-single .arco-select-view-suffix>svg{font-size:14px}.arco-select-view-single .arco-select-view-prefix{padding-right:12px;color:var(--color-text-2)}.arco-select-view-single .arco-select-view-suffix{padding-left:12px;color:var(--color-text-2)}.arco-select-view-single .arco-select-view-suffix .arco-feedback-icon{display:inline-flex}.arco-select-view-single .arco-select-view-suffix .arco-feedback-icon-status-validating{color:rgb(var(--primary-6))}.arco-select-view-single .arco-select-view-suffix .arco-feedback-icon-status-success{color:rgb(var(--success-6))}.arco-select-view-single .arco-select-view-suffix .arco-feedback-icon-status-warning{color:rgb(var(--warning-6))}.arco-select-view-single .arco-select-view-suffix .arco-feedback-icon-status-error{color:rgb(var(--danger-6))}.arco-select-view-single .arco-select-view-clear-btn{align-self:center;color:var(--color-text-2);font-size:12px;visibility:hidden;cursor:pointer}.arco-select-view-single .arco-select-view-clear-btn>svg{position:relative;transition:color .1s cubic-bezier(0,0,1,1)}.arco-select-view-single:hover .arco-select-view-clear-btn{visibility:visible}.arco-select-view-single:not(.arco-select-view-focus) .arco-select-view-icon-hover:hover:before{background-color:var(--color-fill-4)}.arco-select-view-single .arco-select-view-input{width:100%;padding-right:0;padding-left:0;color:inherit;line-height:1.5715;background:none;border:none;border-radius:0;outline:none;cursor:inherit;-webkit-appearance:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.arco-select-view-single .arco-select-view-input::placeholder{color:var(--color-text-3)}.arco-select-view-single .arco-select-view-input[disabled]::placeholder{color:var(--color-text-4)}.arco-select-view-single .arco-select-view-input[disabled]{-webkit-text-fill-color:var(--color-text-4)}.arco-select-view-single .arco-select-view-input-hidden{position:absolute;width:0!important}.arco-select-view-single .arco-select-view-value{display:flex;align-items:center;box-sizing:border-box;width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.arco-select-view-single .arco-select-view-value:after{font-size:0;line-height:0;visibility:hidden;content:"."}.arco-select-view-single .arco-select-view-value-hidden{display:none}.arco-select-view-single.arco-select-view-size-mini .arco-select-view-input,.arco-select-view-single.arco-select-view-size-mini .arco-select-view-value{padding-top:1px;padding-bottom:1px;font-size:12px;line-height:1.667}.arco-select-view-single.arco-select-view-size-mini .arco-select-view-value{min-height:22px}.arco-select-view-single.arco-select-view-size-medium .arco-select-view-input,.arco-select-view-single.arco-select-view-size-medium .arco-select-view-value{padding-top:4px;padding-bottom:4px;font-size:14px;line-height:1.5715}.arco-select-view-single.arco-select-view-size-medium .arco-select-view-value{min-height:30px}.arco-select-view-single.arco-select-view-size-small .arco-select-view-input,.arco-select-view-single.arco-select-view-size-small .arco-select-view-value{padding-top:2px;padding-bottom:2px;font-size:14px;line-height:1.5715}.arco-select-view-single.arco-select-view-size-small .arco-select-view-value{min-height:26px}.arco-select-view-single.arco-select-view-size-large .arco-select-view-input,.arco-select-view-single.arco-select-view-size-large .arco-select-view-value{padding-top:6px;padding-bottom:6px;font-size:14px;line-height:1.5715}.arco-select-view-single.arco-select-view-size-large .arco-select-view-value{min-height:34px}.arco-select-view-multiple{display:inline-flex;box-sizing:border-box;width:100%;padding-right:12px;padding-left:12px;color:var(--color-text-1);font-size:14px;background-color:var(--color-fill-2);border:1px solid transparent;border-radius:var(--border-radius-small);cursor:text;transition:color .1s cubic-bezier(0,0,1,1),border-color .1s cubic-bezier(0,0,1,1),background-color .1s cubic-bezier(0,0,1,1)}.arco-select-view-multiple:hover{background-color:var(--color-fill-3);border-color:transparent}.arco-select-view-multiple:focus-within,.arco-select-view-multiple.arco-select-view-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--primary-6));box-shadow:0 0 0 0 var(--color-primary-light-2)}.arco-select-view-multiple.arco-select-view-disabled{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent;cursor:not-allowed}.arco-select-view-multiple.arco-select-view-disabled:hover{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:transparent}.arco-select-view-multiple.arco-select-view-disabled .arco-select-view-prefix,.arco-select-view-multiple.arco-select-view-disabled .arco-select-view-suffix{color:inherit}.arco-select-view-multiple.arco-select-view-error{background-color:var(--color-danger-light-1);border-color:transparent}.arco-select-view-multiple.arco-select-view-error:hover{background-color:var(--color-danger-light-2);border-color:transparent}.arco-select-view-multiple.arco-select-view-error:focus-within,.arco-select-view-multiple.arco-select-view-error.arco-select-view-multiple-focus{z-index:1;background-color:var(--color-bg-2);border-color:rgb(var(--danger-6));box-shadow:0 0 0 0 var(--color-danger-light-2)}.arco-select-view-multiple .arco-select-view-prefix,.arco-select-view-multiple .arco-select-view-suffix{display:inline-flex;flex-shrink:0;align-items:center;white-space:nowrap;-webkit-user-select:none;user-select:none}.arco-select-view-multiple .arco-select-view-prefix>svg,.arco-select-view-multiple .arco-select-view-suffix>svg{font-size:14px}.arco-select-view-multiple .arco-select-view-prefix{padding-right:12px;color:var(--color-text-2)}.arco-select-view-multiple .arco-select-view-suffix{padding-left:12px;color:var(--color-text-2)}.arco-select-view-multiple .arco-select-view-suffix .arco-feedback-icon{display:inline-flex}.arco-select-view-multiple .arco-select-view-suffix .arco-feedback-icon-status-validating{color:rgb(var(--primary-6))}.arco-select-view-multiple .arco-select-view-suffix .arco-feedback-icon-status-success{color:rgb(var(--success-6))}.arco-select-view-multiple .arco-select-view-suffix .arco-feedback-icon-status-warning{color:rgb(var(--warning-6))}.arco-select-view-multiple .arco-select-view-suffix .arco-feedback-icon-status-error{color:rgb(var(--danger-6))}.arco-select-view-multiple .arco-select-view-clear-btn{align-self:center;color:var(--color-text-2);font-size:12px;visibility:hidden;cursor:pointer}.arco-select-view-multiple .arco-select-view-clear-btn>svg{position:relative;transition:color .1s cubic-bezier(0,0,1,1)}.arco-select-view-multiple:hover .arco-select-view-clear-btn{visibility:visible}.arco-select-view-multiple:not(.arco-select-view-focus) .arco-select-view-icon-hover:hover:before{background-color:var(--color-fill-4)}.arco-select-view-multiple.arco-select-view-has-tag{padding-right:4px;padding-left:4px}.arco-select-view-multiple.arco-select-view-has-prefix{padding-left:12px}.arco-select-view-multiple.arco-select-view-has-suffix{padding-right:12px}.arco-select-view-multiple .arco-select-view-inner{flex:1;overflow:hidden;line-height:0}.arco-select-view-multiple .arco-select-view-inner .arco-select-view-tag{display:inline-flex;align-items:center;margin-right:4px;color:var(--color-text-1);font-size:12px;white-space:pre-wrap;word-break:break-word;background-color:var(--color-bg-2);border-color:var(--color-fill-3)}.arco-select-view-multiple .arco-select-view-inner .arco-select-view-tag .arco-icon-hover:hover:before{background-color:var(--color-fill-2)}.arco-select-view-multiple .arco-select-view-inner .arco-select-view-tag.arco-tag-custom-color{color:var(--color-white)}.arco-select-view-multiple .arco-select-view-inner .arco-select-view-tag.arco-tag-custom-color .arco-icon-hover.arco-tag-icon-hover:hover:before{background-color:#fff3}.arco-select-view-multiple .arco-select-view-inner .arco-select-view-input{width:100%;padding-right:0;padding-left:0;color:inherit;line-height:1.5715;background:none;border:none;border-radius:0;outline:none;cursor:inherit;-webkit-appearance:none;-webkit-tap-highlight-color:rgba(0,0,0,0);box-sizing:border-box}.arco-select-view-multiple .arco-select-view-inner .arco-select-view-input::placeholder{color:var(--color-text-3)}.arco-select-view-multiple .arco-select-view-inner .arco-select-view-input[disabled]::placeholder{color:var(--color-text-4)}.arco-select-view-multiple .arco-select-view-inner .arco-select-view-input[disabled]{-webkit-text-fill-color:var(--color-text-4)}.arco-select-view-multiple .arco-select-view-mirror{position:absolute;top:0;left:0;white-space:pre;visibility:hidden;pointer-events:none}.arco-select-view-multiple.arco-select-view-focus .arco-select-view-tag{background-color:var(--color-fill-2);border-color:var(--color-fill-2)}.arco-select-view-multiple.arco-select-view-focus .arco-select-view-tag .arco-icon-hover:hover:before{background-color:var(--color-fill-3)}.arco-select-view-multiple.arco-select-view-disabled .arco-select-view-tag{color:var(--color-text-4);background-color:var(--color-fill-2);border-color:var(--color-fill-3)}.arco-select-view-multiple.arco-select-view-readonly,.arco-select-view-multiple.arco-select-view-disabled-input{cursor:default}.arco-select-view-multiple.arco-select-view-size-mini{font-size:12px}.arco-select-view-multiple.arco-select-view-size-mini .arco-select-view-inner{padding-top:0;padding-bottom:0}.arco-select-view-multiple.arco-select-view-size-mini .arco-select-view-tag,.arco-select-view-multiple.arco-select-view-size-mini .arco-select-view-input{margin-top:1px;margin-bottom:1px;line-height:18px;vertical-align:middle}.arco-select-view-multiple.arco-select-view-size-mini .arco-select-view-tag,.arco-select-view-multiple.arco-select-view-size-mini .arco-select-view-input{height:auto;min-height:20px}.arco-select-view-multiple.arco-select-view-size-medium{font-size:14px}.arco-select-view-multiple.arco-select-view-size-medium .arco-select-view-inner{padding-top:2px;padding-bottom:2px}.arco-select-view-multiple.arco-select-view-size-medium .arco-select-view-tag,.arco-select-view-multiple.arco-select-view-size-medium .arco-select-view-input{margin-top:1px;margin-bottom:1px;line-height:22px;vertical-align:middle}.arco-select-view-multiple.arco-select-view-size-medium .arco-select-view-tag,.arco-select-view-multiple.arco-select-view-size-medium .arco-select-view-input{height:auto;min-height:24px}.arco-select-view-multiple.arco-select-view-size-small{font-size:14px}.arco-select-view-multiple.arco-select-view-size-small .arco-select-view-inner{padding-top:2px;padding-bottom:2px}.arco-select-view-multiple.arco-select-view-size-small .arco-select-view-tag,.arco-select-view-multiple.arco-select-view-size-small .arco-select-view-input{margin-top:1px;margin-bottom:1px;line-height:18px;vertical-align:middle}.arco-select-view-multiple.arco-select-view-size-small .arco-select-view-tag,.arco-select-view-multiple.arco-select-view-size-small .arco-select-view-input{height:auto;min-height:20px}.arco-select-view-multiple.arco-select-view-size-large{font-size:14px}.arco-select-view-multiple.arco-select-view-size-large .arco-select-view-inner{padding-top:2px;padding-bottom:2px}.arco-select-view-multiple.arco-select-view-size-large .arco-select-view-tag,.arco-select-view-multiple.arco-select-view-size-large .arco-select-view-input{margin-top:1px;margin-bottom:1px;line-height:26px;vertical-align:middle}.arco-select-view-multiple.arco-select-view-size-large .arco-select-view-tag,.arco-select-view-multiple.arco-select-view-size-large .arco-select-view-input{height:auto;min-height:28px}.arco-select-view-multiple.arco-select-view-disabled-input{cursor:pointer}.arco-select-view.arco-select-view-borderless{background:none!important;border:none!important;box-shadow:none!important}.arco-select-view-suffix .arco-feedback-icon{margin-left:4px}.arco-select-view-clear-btn svg,.arco-select-view-icon svg{display:block;font-size:12px}.arco-select-view-opened .arco-select-view-arrow-icon{transform:rotate(180deg)}.arco-select-view-expand-icon{transform:rotate(-45deg)}.arco-select-view-clear-btn{display:none;cursor:pointer}.arco-select-view:hover .arco-select-view-clear-btn{display:block}.arco-select-view:hover .arco-select-view-clear-btn~*{display:none}.arco-empty{box-sizing:border-box;width:100%;padding:10px 0;text-align:center}.arco-empty-image{margin-bottom:4px;color:rgb(var(--gray-5));font-size:48px;line-height:1}.arco-empty-image img{height:80px}.arco-empty .arco-empty-description{color:rgb(var(--gray-5));font-size:14px}.arco-select-dropdown{box-sizing:border-box;padding:4px 0;background-color:var(--color-bg-popup);border:1px solid var(--color-fill-3);border-radius:var(--border-radius-medium);box-shadow:0 4px 10px #0000001a}.arco-select-dropdown .arco-select-dropdown-loading{display:flex;align-items:center;justify-content:center;min-height:50px}.arco-select-dropdown-list{margin-top:0;margin-bottom:0;padding-left:0;list-style:none}.arco-select-dropdown-list-wrapper{max-height:200px;overflow-y:auto}.arco-select-dropdown .arco-select-option{position:relative;z-index:1;display:flex;align-items:center;box-sizing:border-box;width:100%;padding:0 12px;color:var(--color-text-1);font-size:14px;line-height:36px;text-align:left;background-color:var(--color-bg-popup);cursor:pointer}.arco-select-dropdown .arco-select-option-content{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.arco-select-dropdown .arco-select-option-checkbox{overflow:hidden}.arco-select-dropdown .arco-select-option-checkbox .arco-checkbox-label{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.arco-select-dropdown .arco-select-option-has-suffix{justify-content:space-between}.arco-select-dropdown .arco-select-option-selected{color:var(--color-text-1);font-weight:500;background-color:var(--color-bg-popup)}.arco-select-dropdown .arco-select-option-active,.arco-select-dropdown .arco-select-option:not(.arco-select-dropdown .arco-select-option-disabled):hover{color:var(--color-text-1);background-color:var(--color-fill-2);transition:all .1s cubic-bezier(0,0,1,1)}.arco-select-dropdown .arco-select-option-disabled{color:var(--color-text-4);background-color:var(--color-bg-popup);cursor:not-allowed}.arco-select-dropdown .arco-select-option-icon{display:inline-flex;margin-right:8px}.arco-select-dropdown .arco-select-option-suffix{margin-left:12px}.arco-select-dropdown .arco-select-group:first-child .arco-select-dropdown .arco-select-group-title{margin-top:8px}.arco-select-dropdown .arco-select-group-title{box-sizing:border-box;width:100%;margin-top:8px;padding:0 12px;color:var(--color-text-3);font-size:12px;line-height:20px;cursor:default;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.arco-select-dropdown.arco-select-dropdown-has-header{padding-top:0}.arco-select-dropdown-header{border-bottom:1px solid var(--color-fill-3)}.arco-select-dropdown.arco-select-dropdown-has-footer{padding-bottom:0}.arco-select-dropdown-footer{border-top:1px solid var(--color-fill-3)}.arco-pagination{display:flex;align-items:center;font-size:14px}.arco-pagination-list{display:inline-block;margin:0;padding:0;white-space:nowrap;list-style:none}.arco-pagination-item{display:inline-block;box-sizing:border-box;padding:0 8px;color:var(--color-text-2);text-align:center;vertical-align:middle;list-style:none;background-color:transparent;border:0 solid transparent;border-radius:var(--border-radius-small);outline:0;cursor:pointer;-webkit-user-select:none;user-select:none;min-width:32px;height:32px;font-size:14px;line-height:32px}.arco-pagination-item-previous,.arco-pagination-item-next{font-size:12px}.arco-pagination-item:hover{color:var(--color-text-2);background-color:var(--color-fill-1);border-color:transparent}.arco-pagination-item-active,.arco-pagination-item-active:hover{color:rgb(var(--primary-6));background-color:var(--color-primary-light-1);border-color:transparent;transition:color .2s cubic-bezier(0,0,1,1),background-color .2s cubic-bezier(0,0,1,1)}.arco-pagination-item-disabled,.arco-pagination-item-disabled:hover{color:var(--color-text-4);background-color:transparent;border-color:transparent;cursor:not-allowed}.arco-pagination-item:not(:last-child){margin-right:8px}.arco-pagination-item-previous,.arco-pagination-item-next{color:var(--color-text-2);font-size:12px;background-color:transparent}.arco-pagination-item-previous:not(.arco-pagination-item-disabled):hover,.arco-pagination-item-next:not(.arco-pagination-item-disabled):hover{color:rgb(var(--primary-6));background-color:var(--color-fill-1)}.arco-pagination-item-previous:after,.arco-pagination-item-next:after{display:inline-block;font-size:0;vertical-align:middle;content:"."}.arco-pagination .arco-pagination-item-previous.arco-pagination-item-disabled,.arco-pagination .arco-pagination-item-next.arco-pagination-item-disabled{color:var(--color-text-4);background-color:transparent}.arco-pagination-item-jumper{font-size:16px}.arco-pagination-jumper{display:flex;align-items:center;margin-left:8px}.arco-pagination-jumper>span{font-size:14px}.arco-pagination-jumper-text-goto,.arco-pagination-jumper-prepend,.arco-pagination-jumper-append{color:var(--color-text-3);white-space:nowrap}.arco-pagination-jumper-prepend{margin-right:8px}.arco-pagination-jumper-append{margin-left:8px}.arco-pagination-jumper .arco-pagination-jumper-input{width:40px;padding-right:2px;padding-left:2px}.arco-pagination-jumper .arco-pagination-jumper-input input{text-align:center}.arco-pagination-options{position:relative;display:inline-block;flex:0 0 auto;min-width:0;margin-left:8px;text-align:center;vertical-align:middle}.arco-pagination-options .arco-select{width:auto}.arco-pagination-options .arco-select-view-value{padding-right:6px;overflow:inherit}.arco-pagination-total{display:inline-block;height:100%;margin-right:8px;color:var(--color-text-1);font-size:14px;line-height:32px;white-space:nowrap}.arco-pagination-jumper{flex:0 0 auto}.arco-pagination-jumper-separator{padding:0 12px}.arco-pagination-jumper-total-page{margin-right:8px}.arco-pagination-simple{display:flex;align-items:center}.arco-pagination-simple .arco-pagination-item{margin-right:0}.arco-pagination-simple .arco-pagination-jumper{margin:0 4px;color:var(--color-text-1)}.arco-pagination-simple .arco-pagination-jumper .arco-pagination-jumper-input{width:40px;margin-left:0}.arco-pagination-simple .arco-pagination-item-previous,.arco-pagination-simple .arco-pagination-item-next{color:var(--color-text-2);background-color:transparent}.arco-pagination-simple .arco-pagination-item-previous:not(.arco-pagination-item-disabled):hover,.arco-pagination-simple .arco-pagination-item-next:not(.arco-pagination-item-disabled):hover{color:rgb(var(--primary-6));background-color:var(--color-fill-1)}.arco-pagination-simple .arco-pagination-item-previous.arco-pagination-item-disabled,.arco-pagination-simple .arco-pagination-item-next.arco-pagination-item-disabled{color:var(--color-text-4);background-color:transparent}.arco-pagination-disabled{cursor:not-allowed}.arco-pagination-disabled .arco-pagination-item,.arco-pagination-disabled .arco-pagination-item:not(.arco-pagination-item-disabled):not(.arco-pagination-item-active):hover{color:var(--color-text-4);background-color:transparent;border-color:transparent;cursor:not-allowed}.arco-pagination.arco-pagination-disabled .arco-pagination-item-active{color:var(--color-primary-light-3);background-color:var(--color-fill-1);border-color:transparent}.arco-pagination-size-mini .arco-pagination-item{min-width:24px;height:24px;font-size:12px;line-height:24px}.arco-pagination-size-mini .arco-pagination-item-previous,.arco-pagination-size-mini .arco-pagination-item-next{font-size:12px}.arco-pagination-size-mini .arco-pagination-total{font-size:12px;line-height:24px}.arco-pagination-size-mini .arco-pagination-option{height:24px;font-size:12px;line-height:0}.arco-pagination-size-mini .arco-pagination-jumper>span{font-size:12px}.arco-pagination-size-small .arco-pagination-item{min-width:28px;height:28px;font-size:14px;line-height:28px}.arco-pagination-size-small .arco-pagination-item-previous,.arco-pagination-size-small .arco-pagination-item-next{font-size:12px}.arco-pagination-size-small .arco-pagination-total{font-size:14px;line-height:28px}.arco-pagination-size-small .arco-pagination-option{height:28px;font-size:14px;line-height:0}.arco-pagination-size-small .arco-pagination-jumper>span{font-size:14px}.arco-pagination-size-large .arco-pagination-item{min-width:36px;height:36px;font-size:14px;line-height:36px}.arco-pagination-size-large .arco-pagination-item-previous,.arco-pagination-size-large .arco-pagination-item-next{font-size:14px}.arco-pagination-size-large .arco-pagination-total{font-size:14px;line-height:36px}.arco-pagination-size-large .arco-pagination-option{height:36px;font-size:14px;line-height:0}.arco-pagination-size-large .arco-pagination-jumper>span{font-size:14px}.arco-list{display:flex;flex-direction:column;box-sizing:border-box;width:100%;overflow-y:auto;color:var(--color-text-1);font-size:14px;line-height:1.5715;border-radius:var(--border-radius-medium)}.arco-list-wrapper{overflow:hidden}.arco-list-wrapper .arco-list-spin{display:block;height:100%;overflow:hidden}.arco-list-content{overflow:hidden}.arco-list-small .arco-list-content-wrapper .arco-list-header{padding:8px 20px}.arco-list-small .arco-list-content-wrapper .arco-list-footer,.arco-list-small .arco-list-content-wrapper .arco-list-content>.arco-list-item,.arco-list-small .arco-list-content-wrapper .arco-list-content .arco-list-col>.arco-list-item,.arco-list-small .arco-list-content-wrapper .arco-list-content.arco-list-virtual .arco-list-item{padding:9px 20px}.arco-list-medium .arco-list-content-wrapper .arco-list-header{padding:12px 20px}.arco-list-medium .arco-list-content-wrapper .arco-list-footer,.arco-list-medium .arco-list-content-wrapper .arco-list-content>.arco-list-item,.arco-list-medium .arco-list-content-wrapper .arco-list-content .arco-list-col>.arco-list-item,.arco-list-medium .arco-list-content-wrapper .arco-list-content.arco-list-virtual .arco-list-item{padding:13px 20px}.arco-list-large .arco-list-content-wrapper .arco-list-header{padding:16px 20px}.arco-list-large .arco-list-content-wrapper .arco-list-footer,.arco-list-large .arco-list-content-wrapper .arco-list-content>.arco-list-item,.arco-list-large .arco-list-content-wrapper .arco-list-content .arco-list-col>.arco-list-item,.arco-list-large .arco-list-content-wrapper .arco-list-content.arco-list-virtual .arco-list-item{padding:17px 20px}.arco-list-bordered{border:1px solid var(--color-neutral-3)}.arco-list-split .arco-list-header,.arco-list-split .arco-list-item:not(:last-child){border-bottom:1px solid var(--color-neutral-3)}.arco-list-split .arco-list-footer{border-top:1px solid var(--color-neutral-3)}.arco-list-header{color:var(--color-text-1);font-weight:500;font-size:16px;line-height:1.5}.arco-list-item{display:flex;justify-content:space-between;box-sizing:border-box;width:100%;overflow:hidden}.arco-list-item-main{flex:1}.arco-list-item-main .arco-list-item-action:not(:first-child){margin-top:4px}.arco-list-item-meta{display:flex;align-items:center;padding:4px 0}.arco-list-item-meta-avatar{display:flex}.arco-list-item-meta-avatar:not(:last-child){margin-right:16px}.arco-list-item-meta-title{color:var(--color-text-1);font-weight:500}.arco-list-item-meta-title:not(:last-child){margin-bottom:2px}.arco-list-item-meta-description{color:var(--color-text-2)}.arco-list-item-action{display:flex;flex-wrap:nowrap;align-self:center;margin:0;padding:0;list-style:none}.arco-list-item-action>li{display:inline-block;cursor:pointer}.arco-list-item-action>li:not(:last-child){margin-right:20px}.arco-list-hover .arco-list-item:hover{background-color:var(--color-fill-1)}.arco-list-pagination{float:right;margin-top:24px}.arco-list-pagination:after{display:block;clear:both;height:0;overflow:hidden;visibility:hidden;content:""}.arco-list-scroll-loading{display:flex;align-items:center;justify-content:center}.arco-list-content{flex:auto}.arco-list-content .arco-empty{display:flex;align-items:center;justify-content:center;height:100%}.montage-container[data-v-d8965dd9]{padding:20px}.control-buttons[data-v-d8965dd9]{margin-bottom:20px;display:flex;gap:10px;flex-direction:column}.control-buttons>div[data-v-d8965dd9]{display:flex;justify-content:space-around}.timeline[data-v-d8965dd9]{height:30px;background:#52c41a;position:relative;margin:20px 0;cursor:pointer;-webkit-user-select:none;user-select:none}.timeline-inner[data-v-d8965dd9]{height:100%;position:relative}.deleted-segment[data-v-d8965dd9]{position:absolute;height:100%;background:#ff4d4f;opacity:.6}.current-time-marker[data-v-d8965dd9]{position:absolute;top:0;width:2px;height:100%;background:#1890ff;transform:translate(-50%)}.sections-list[data-v-d8965dd9]{margin-top:20px}.section-item[data-v-d8965dd9]{display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px solid #f0f0f0}.recording-segment[data-v-d8965dd9]{position:absolute;height:100%;background:#722ed1;opacity:.6}.time-tooltip[data-v-d8965dd9]{position:fixed;transform:translate(-50%);background:#000000bf;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;pointer-events:none;top:-30px;z-index:1}.arco-icon-hover.arco-tabs-icon-hover:before{width:16px;height:16px}.arco-tabs .arco-tabs-icon-hover{color:var(--color-text-2);font-size:12px;-webkit-user-select:none;user-select:none}.arco-tabs-dropdown-icon{margin-left:6px;font-size:12px;-webkit-user-select:none;user-select:none}.arco-tabs-tab-close-btn{margin-left:8px;-webkit-user-select:none;user-select:none}.arco-tabs-nav-add-btn{display:inline-flex;align-items:center;justify-content:center;padding:0 8px;font-size:12px;-webkit-user-select:none;user-select:none}.arco-tabs-add{position:relative}.arco-tabs-nav-button-left{margin-right:6px;margin-left:10px}.arco-tabs-nav-button-right{margin-right:10px;margin-left:6px}.arco-tabs-nav-button-up{margin-bottom:10px}.arco-tabs-nav-button-down{margin-top:10px}.arco-tabs-nav-button-disabled{color:var(--color-text-4);cursor:not-allowed}.arco-tabs{position:relative;overflow:hidden}.arco-tabs-nav{position:relative;flex-shrink:0}.arco-tabs-nav:before{position:absolute;right:0;bottom:0;left:0;display:block;clear:both;height:1px;background-color:var(--color-neutral-3);content:""}.arco-tabs-nav-tab{display:flex;flex:1;overflow:hidden}.arco-tabs-nav-tab-list{position:relative;display:inline-block;white-space:nowrap;transition:transform .2s cubic-bezier(.34,.69,.1,1)}.arco-tabs-nav-extra{display:flex;align-items:center;width:auto;line-height:32px}.arco-tabs-nav-extra .arco-tabs-nav-add-btn{padding-left:0}.arco-tabs-tab{display:inline-flex;align-items:center;box-sizing:border-box;padding:4px 0;color:var(--color-text-2);font-size:14px;line-height:1.5715;outline:none;cursor:pointer;transition:color .2s cubic-bezier(0,0,1,1)}.arco-tabs-tab-title{display:inline-block}.arco-tabs-tab:hover{color:var(--color-text-2);font-weight:400}.arco-tabs-tab-disabled,.arco-tabs-tab-disabled:hover{color:var(--color-text-4);cursor:not-allowed}.arco-tabs-tab-active,.arco-tabs-tab-active:hover{color:rgb(var(--primary-6));font-weight:500}.arco-tabs-tab-active.arco-tabs-tab-disabled,.arco-tabs-tab-active:hover.arco-tabs-tab-disabled{color:var(--color-primary-light-3)}.arco-tabs-nav-ink{position:absolute;top:initial;right:initial;bottom:0;height:2px;background-color:rgb(var(--primary-6));transition:left .2s cubic-bezier(.34,.69,.1,1),width .2s cubic-bezier(.34,.69,.1,1)}.arco-tabs-nav-ink.arco-tabs-header-ink-no-animation{transition:none}.arco-tabs-nav-ink-disabled{background-color:var(--color-primary-light-3)}.arco-tabs-nav-type-line .arco-tabs-nav-extra{line-height:40px}.arco-tabs-nav-type-line .arco-tabs-tab{margin:0 16px;padding:8px 0;line-height:1.5715}.arco-tabs-nav-type-line .arco-tabs-tab-title{position:relative;display:inline-block;padding:1px 0}.arco-tabs-nav-type-line .arco-tabs-tab-title:before{position:absolute;top:0;right:-8px;bottom:0;left:-8px;z-index:-1;background-color:transparent;border-radius:var(--border-radius-small);opacity:1;transition:background-color .2s cubic-bezier(0,0,1,1),opacity .2s cubic-bezier(0,0,1,1);content:""}.arco-tabs-nav-type-line .arco-tabs-tab:hover .arco-tabs-tab-title:before{background-color:var(--color-fill-2)}.arco-tabs-nav-type-line .arco-tabs-tab-active .arco-tabs-tab-title:before,.arco-tabs-nav-type-line .arco-tabs-tab-active:hover .arco-tabs-tab-title:before{background-color:transparent}.arco-tabs-nav-type-line .arco-tabs-tab-disabled .arco-tabs-tab-title:before,.arco-tabs-nav-type-line .arco-tabs-tab-disabled:hover .arco-tabs-tab-title:before{opacity:0}.arco-tabs-nav-type-line .arco-tabs-tab:focus-visible .arco-tabs-tab-title:before{border:2px solid rgb(var(--primary-6))}.arco-tabs-nav-type-line.arco-tabs-nav-horizontal>.arco-tabs-tab:first-of-type{margin-left:16px}.arco-tabs-nav-type-line.arco-tabs-nav-horizontal .arco-tabs-nav-tab-list-no-padding>.arco-tabs-tab:first-of-type,.arco-tabs-nav-text.arco-tabs-nav-horizontal .arco-tabs-nav-tab-list-no-padding>.arco-tabs-tab:first-of-type{margin-left:0}.arco-tabs-nav-type-card .arco-tabs-tab,.arco-tabs-nav-type-card-gutter .arco-tabs-tab{position:relative;padding:4px 16px;font-size:14px;border:1px solid var(--color-neutral-3);transition:padding .2s cubic-bezier(0,0,1,1),color .2s cubic-bezier(0,0,1,1)}.arco-tabs-nav-type-card .arco-tabs-tab-closable,.arco-tabs-nav-type-card-gutter .arco-tabs-tab-closable{padding-right:12px}.arco-tabs-nav-type-card .arco-tabs-tab-closable:not(.arco-tabs-tab-active):hover .arco-icon-hover:hover:before,.arco-tabs-nav-type-card-gutter .arco-tabs-tab-closable:not(.arco-tabs-tab-active):hover .arco-icon-hover:hover:before{background-color:var(--color-fill-4)}.arco-tabs-nav-type-card .arco-tabs-tab:focus-visible:before,.arco-tabs-nav-type-card-gutter .arco-tabs-tab:focus-visible:before{position:absolute;top:-1px;right:0;bottom:-1px;left:-1px;border:2px solid rgb(var(--primary-6));content:""}.arco-tabs-nav-type-card .arco-tabs-tab:last-child:focus-visible:before,.arco-tabs-nav-type-card-gutter .arco-tabs-tab:last-child:focus-visible:before{right:-1px}.arco-tabs-nav-type-card .arco-tabs-nav-add-btn,.arco-tabs-nav-type-card-gutter .arco-tabs-nav-add-btn{height:32px}.arco-tabs-nav-type-card .arco-tabs-tab{background-color:transparent;border-right:none}.arco-tabs-nav-type-card .arco-tabs-tab:last-child{border-right:1px solid var(--color-neutral-3);border-top-right-radius:var(--border-radius-small)}.arco-tabs-nav-type-card .arco-tabs-tab:first-child{border-top-left-radius:var(--border-radius-small)}.arco-tabs-nav-type-card .arco-tabs-tab:hover{background-color:var(--color-fill-3)}.arco-tabs-nav-type-card .arco-tabs-tab-disabled,.arco-tabs-nav-type-card .arco-tabs-tab-disabled:hover{background-color:transparent}.arco-tabs-nav-type-card .arco-tabs-tab-active,.arco-tabs-nav-type-card .arco-tabs-tab-active:hover{background-color:transparent;border-bottom-color:var(--color-bg-2)}.arco-tabs-nav-type-card-gutter .arco-tabs-tab{margin-left:4px;background-color:var(--color-fill-1);border-right:1px solid var(--color-neutral-3);border-radius:var(--border-radius-small) var(--border-radius-small) 0 0}.arco-tabs-nav-type-card-gutter .arco-tabs-tab:hover{background-color:var(--color-fill-3)}.arco-tabs-nav-type-card-gutter .arco-tabs-tab-disabled,.arco-tabs-nav-type-card-gutter .arco-tabs-tab-disabled:hover{background-color:var(--color-fill-1)}.arco-tabs-nav-type-card-gutter .arco-tabs-tab-active,.arco-tabs-nav-type-card-gutter .arco-tabs-tab-active:hover{background-color:transparent;border-bottom-color:var(--color-bg-2)}.arco-tabs-nav-type-card-gutter .arco-tabs-tab:first-child{margin-left:0}.arco-tabs-nav-type-text:before{display:none}.arco-tabs-nav-type-text .arco-tabs-tab{position:relative;margin:0 9px;padding:5px 0;font-size:14px;line-height:1.5715}.arco-tabs-nav-type-text .arco-tabs-tab:not(:first-of-type):before{position:absolute;top:50%;left:-9px;display:block;width:2px;height:12px;background-color:var(--color-fill-3);transform:translateY(-50%);content:""}.arco-tabs-nav-type-text .arco-tabs-tab-title{padding-right:8px;padding-left:8px;background-color:transparent}.arco-tabs-nav-type-text .arco-tabs-tab-title:hover{background-color:var(--color-fill-2)}.arco-tabs-nav-type-text .arco-tabs-tab-active .arco-tabs-tab-title,.arco-tabs-nav-type-text .arco-tabs-tab-active .arco-tabs-tab-title:hover,.arco-tabs-nav-type-text .arco-tabs-tab-disabled .arco-tabs-tab-title,.arco-tabs-nav-type-text .arco-tabs-tab-disabled .arco-tabs-tab-title:hover{background-color:transparent}.arco-tabs-nav-type-text .arco-tabs-tab-active.arco-tabs-nav-type-text .arco-tabs-tab-disabled .arco-tabs-tab-title,.arco-tabs-nav-type-text .arco-tabs-tab-active.arco-tabs-nav-type-text .arco-tabs-tab-disabled .arco-tabs-tab-title:hover{background-color:var(--color-primary-light-3)}.arco-tabs-nav-type-text .arco-tabs-tab:focus-visible .arco-tabs-tab-title{margin:-2px;border:2px solid rgb(var(--primary-6))}.arco-tabs-nav-type-rounded:before{display:none}.arco-tabs-nav-type-rounded .arco-tabs-tab{margin:0 6px;padding:5px 16px;font-size:14px;background-color:transparent;border-radius:32px}.arco-tabs-nav-type-rounded .arco-tabs-tab:hover{background-color:var(--color-fill-2)}.arco-tabs-nav-type-rounded .arco-tabs-tab-disabled:hover{background-color:transparent}.arco-tabs-nav-type-rounded .arco-tabs-tab-active,.arco-tabs-nav-type-rounded .arco-tabs-tab-active:hover{background-color:var(--color-fill-2)}.arco-tabs-nav-type-rounded .arco-tabs-tab:focus-visible{border-color:rgb(var(--primary-6))}.arco-tabs-nav-type-capsule:before{display:none}.arco-tabs-nav-type-capsule .arco-tabs-nav-tab:not(.arco-tabs-nav-tab-scroll){justify-content:flex-end}.arco-tabs-nav-type-capsule .arco-tabs-nav-tab-list{padding:3px;line-height:1;background-color:var(--color-fill-2);border-radius:var(--border-radius-small)}.arco-tabs-nav-type-capsule .arco-tabs-tab{position:relative;padding:0 10px;font-size:14px;line-height:26px;background-color:transparent}.arco-tabs-nav-type-capsule .arco-tabs-tab:hover{background-color:var(--color-bg-2)}.arco-tabs-nav-type-capsule .arco-tabs-tab-disabled:hover{background-color:unset}.arco-tabs-nav-type-capsule .arco-tabs-tab-active,.arco-tabs-nav-type-capsule .arco-tabs-tab-active:hover{background-color:var(--color-bg-2)}.arco-tabs-nav-type-capsule .arco-tabs-tab-active:before,.arco-tabs-nav-type-capsule .arco-tabs-tab-active:hover:before,.arco-tabs-nav-type-capsule .arco-tabs-tab-active+.arco-tabs-tab:before,.arco-tabs-nav-type-capsule .arco-tabs-tab-active:hover+.arco-tabs-tab:before{opacity:0}.arco-tabs-nav-type-capsule .arco-tabs-tab:focus-visible{border-color:rgb(var(--primary-6))}.arco-tabs-nav-type-capsule.arco-tabs-nav-horizontal .arco-tabs-tab:not(:first-of-type){margin-left:3px}.arco-tabs-nav-type-capsule.arco-tabs-nav-horizontal .arco-tabs-tab:not(:first-of-type):before{position:absolute;top:50%;left:-4px;display:block;width:1px;height:14px;background-color:var(--color-fill-3);transform:translateY(-50%);transition:all .2s cubic-bezier(0,0,1,1);content:""}.arco-tabs-nav{position:relative;display:flex;align-items:center;overflow:hidden}.arco-tabs-content{box-sizing:border-box;width:100%;padding-top:16px;overflow:hidden}.arco-tabs-content-hide{display:none}.arco-tabs-content .arco-tabs-content-list{display:flex;width:100%}.arco-tabs-content .arco-tabs-content-item{flex-shrink:0;width:100%;height:0;overflow:hidden}.arco-tabs-content .arco-tabs-content-item.arco-tabs-content-item-active{height:auto}.arco-tabs-type-card>.arco-tabs-content,.arco-tabs-type-card-gutter>.arco-tabs-content{border:1px solid var(--color-neutral-3);border-top:none}.arco-tabs-content-animation{transition:all .2s cubic-bezier(.34,.69,.1,1)}.arco-tabs-horizontal.arco-tabs-justify{display:flex;flex-direction:column;height:100%}.arco-tabs-horizontal.arco-tabs-justify .arco-tabs-content,.arco-tabs-horizontal.arco-tabs-justify .arco-tabs-content-list,.arco-tabs-horizontal.arco-tabs-justify .arco-tabs-pane{height:100%}.arco-tabs-nav-size-mini.arco-tabs-nav-type-line .arco-tabs-tab{padding-top:6px;padding-bottom:6px;font-size:12px}.arco-tabs-nav-size-mini.arco-tabs-nav-type-line .arco-tabs-nav-extra{font-size:12px;line-height:32px}.arco-tabs-nav-size-mini.arco-tabs-nav-type-card .arco-tabs-tab,.arco-tabs-nav-size-mini.arco-tabs-nav-type-card-gutter .arco-tabs-tab{padding-top:1px;padding-bottom:1px;font-size:12px}.arco-tabs-nav-size-mini.arco-tabs-nav-type-card .arco-tabs-nav-extra,.arco-tabs-nav-size-mini.arco-tabs-nav-type-card-gutter .arco-tabs-nav-extra{font-size:12px;line-height:24px}.arco-tabs-nav-size-mini.arco-tabs-nav-type-card .arco-tabs-nav-add-btn,.arco-tabs-nav-size-mini.arco-tabs-nav-type-card-gutter .arco-tabs-nav-add-btn{height:24px}.arco-tabs-nav-size-mini.arco-tabs-nav-type-capsule .arco-tabs-tab{font-size:12px;line-height:18px}.arco-tabs-nav-size-mini.arco-tabs-nav-type-capsule .arco-tabs-nav-extra{font-size:12px;line-height:24px}.arco-tabs-nav-size-mini.arco-tabs-nav-type-rounded .arco-tabs-tab{padding-top:3px;padding-bottom:3px;font-size:12px}.arco-tabs-nav-size-mini.arco-tabs-nav-type-rounded .arco-tabs-nav-extra{font-size:12px;line-height:24px}.arco-tabs-nav-size-small.arco-tabs-nav-type-line .arco-tabs-tab{padding-top:6px;padding-bottom:6px;font-size:14px}.arco-tabs-nav-size-small.arco-tabs-nav-type-line .arco-tabs-nav-extra{font-size:14px;line-height:36px}.arco-tabs-nav-size-small.arco-tabs-nav-type-card .arco-tabs-tab,.arco-tabs-nav-size-small.arco-tabs-nav-type-card-gutter .arco-tabs-tab{padding-top:1px;padding-bottom:1px;font-size:14px}.arco-tabs-nav-size-small.arco-tabs-nav-type-card .arco-tabs-nav-extra,.arco-tabs-nav-size-small.arco-tabs-nav-type-card-gutter .arco-tabs-nav-extra{font-size:14px;line-height:28px}.arco-tabs-nav-size-small.arco-tabs-nav-type-card .arco-tabs-nav-add-btn,.arco-tabs-nav-size-small.arco-tabs-nav-type-card-gutter .arco-tabs-nav-add-btn{height:28px}.arco-tabs-nav-size-small.arco-tabs-nav-type-capsule .arco-tabs-tab{font-size:14px;line-height:22px}.arco-tabs-nav-size-small.arco-tabs-nav-type-capsule .arco-tabs-nav-extra{font-size:14px;line-height:28px}.arco-tabs-nav-size-small.arco-tabs-nav-type-rounded .arco-tabs-tab{padding-top:3px;padding-bottom:3px;font-size:14px}.arco-tabs-nav-size-small.arco-tabs-nav-type-rounded .arco-tabs-nav-extra{font-size:14px;line-height:28px}.arco-tabs-nav-size-large.arco-tabs-nav-type-line .arco-tabs-tab{padding-top:10px;padding-bottom:10px;font-size:14px}.arco-tabs-nav-size-large.arco-tabs-nav-type-line .arco-tabs-nav-extra{font-size:14px;line-height:44px}.arco-tabs-nav-size-large.arco-tabs-nav-type-card .arco-tabs-tab,.arco-tabs-nav-size-large.arco-tabs-nav-type-card-gutter .arco-tabs-tab{padding-top:5px;padding-bottom:5px;font-size:14px}.arco-tabs-nav-size-large.arco-tabs-nav-type-card .arco-tabs-nav-extra,.arco-tabs-nav-size-large.arco-tabs-nav-type-card-gutter .arco-tabs-nav-extra{font-size:14px;line-height:36px}.arco-tabs-nav-size-large.arco-tabs-nav-type-card .arco-tabs-nav-add-btn,.arco-tabs-nav-size-large.arco-tabs-nav-type-card-gutter .arco-tabs-nav-add-btn{height:36px}.arco-tabs-nav-size-large.arco-tabs-nav-type-capsule .arco-tabs-tab{font-size:14px;line-height:30px}.arco-tabs-nav-size-large.arco-tabs-nav-type-capsule .arco-tabs-nav-extra{font-size:14px;line-height:36px}.arco-tabs-nav-size-large.arco-tabs-nav-type-rounded .arco-tabs-tab{padding-top:7px;padding-bottom:7px;font-size:14px}.arco-tabs-nav-size-large.arco-tabs-nav-type-rounded .arco-tabs-nav-extra{font-size:14px;line-height:36px}.arco-tabs-nav-vertical{float:left;height:100%}.arco-tabs-nav-vertical:before{position:absolute;top:0;right:0;bottom:0;left:initial;clear:both;width:1px;height:100%}.arco-tabs-nav-vertical .arco-tabs-nav-add-btn{height:auto;margin-top:8px;margin-left:0;padding:0 16px}.arco-tabs-nav-right{float:right}.arco-tabs-nav-vertical{flex-direction:column}.arco-tabs-nav-vertical .arco-tabs-nav-tab{flex-direction:column;height:100%}.arco-tabs-nav-vertical .arco-tabs-nav-ink{position:absolute;right:0;bottom:initial;left:initial;width:2px;transition:top .2s cubic-bezier(.34,.69,.1,1),height .2s cubic-bezier(.34,.69,.1,1)}.arco-tabs-nav-vertical .arco-tabs-nav-tab-list{height:auto}.arco-tabs-nav-vertical .arco-tabs-nav-tab-list-overflow-scroll{padding:6px 0}.arco-tabs-nav-vertical .arco-tabs-tab{display:block;margin:12px 0 0;white-space:nowrap}.arco-tabs-nav-vertical .arco-tabs-tab:first-of-type{margin-top:0}.arco-tabs-nav-right:before{right:unset;left:0}.arco-tabs-nav-right .arco-tabs-nav-ink{right:unset;left:0}.arco-tabs-nav-vertical{position:relative;box-sizing:border-box;height:100%}.arco-tabs-nav-vertical.arco-tabs-nav-type-line .arco-tabs-tab{padding:0 20px}.arco-tabs-nav-vertical.arco-tabs-nav-type-card .arco-tabs-tab{position:relative;margin:0;border:1px solid var(--color-neutral-3);border-bottom-color:transparent}.arco-tabs-nav-vertical.arco-tabs-nav-type-card .arco-tabs-tab:first-child{border-top-left-radius:var(--border-radius-small)}.arco-tabs-nav-vertical.arco-tabs-nav-type-card .arco-tabs-tab-active,.arco-tabs-nav-vertical.arco-tabs-nav-type-card .arco-tabs-tab-active:hover{border-right-color:var(--color-bg-2);border-bottom-color:transparent}.arco-tabs-nav-vertical.arco-tabs-nav-type-card .arco-tabs-tab:last-child{border-bottom:1px solid var(--color-neutral-3);border-bottom-left-radius:var(--border-radius-small)}.arco-tabs-nav-vertical.arco-tabs-nav-type-card-gutter .arco-tabs-tab{position:relative;margin-left:0;border-radius:var(--border-radius-small) 0 0 var(--border-radius-small)}.arco-tabs-nav-vertical.arco-tabs-nav-type-card-gutter .arco-tabs-tab:not(:first-of-type){margin-top:4px}.arco-tabs-nav-vertical.arco-tabs-nav-type-card-gutter .arco-tabs-tab-active,.arco-tabs-nav-vertical.arco-tabs-nav-type-card-gutter .arco-tabs-tab-active:hover{border-right-color:var(--color-bg-2);border-bottom-color:var(--color-neutral-3)}.arco-tabs-vertical .arco-tabs-content{width:auto;height:100%;padding:0}.arco-tabs-right.arco-tabs-vertical .arco-tabs-content{padding-right:16px}.arco-tabs-left.arco-tabs-vertical .arco-tabs-content{padding-left:16px}.arco-tabs-vertical.arco-tabs-type-card>.arco-tabs-content,.arco-tabs-vertical.arco-tabs-type-card-gutter>.arco-tabs-content{border:1px solid var(--color-neutral-3);border-left:none}body[arco-theme=dark] .arco-tabs-nav-type-capsule .arco-tabs-tab-active,body[arco-theme=dark] .arco-tabs-nav-type-capsule .arco-tabs-tab:hover{background-color:var(--color-fill-3)}.arco-icon-hover.arco-collapse-item-icon-hover:before{width:16px;height:16px}.arco-icon-hover.arco-collapse-item-icon-hover:hover:before{background-color:var(--color-fill-2)}.arco-collapse{overflow:hidden;line-height:1.5715;border:1px solid var(--color-neutral-3);border-radius:var(--border-radius-medium)}.arco-collapse-item{box-sizing:border-box;border-bottom:1px solid var(--color-border-2)}.arco-collapse-item-active>.arco-collapse-item-header{background-color:var(--color-bg-2);border-color:var(--color-neutral-3);transition:border-color 0s ease 0s}.arco-collapse-item-active>.arco-collapse-item-header .arco-collapse-item-header-title{font-weight:500}.arco-collapse-item-active>.arco-collapse-item-header .arco-collapse-item-expand-icon{transform:rotate(90deg)}.arco-collapse-item-active>.arco-collapse-item-header .arco-collapse-item-icon-right .arco-collapse-item-expand-icon{transform:rotate(-90deg)}.arco-collapse-item-header{position:relative;display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;padding-top:8px;padding-bottom:8px;overflow:hidden;color:var(--color-text-1);font-size:14px;line-height:24px;background-color:var(--color-bg-2);border-bottom:1px solid transparent;cursor:pointer;transition:border-color 0s ease .19s}.arco-collapse-item-header-left{padding-right:13px;padding-left:34px}.arco-collapse-item-header-right{padding-right:34px;padding-left:13px}.arco-collapse-item-header-right+.arco-collapse-item-content{padding-left:13px}.arco-collapse-item-header-disabled{color:var(--color-text-4);background-color:var(--color-bg-2);cursor:not-allowed}.arco-collapse-item-header-disabled .arco-collapse-item-header-icon{color:var(--color-text-4)}.arco-collapse-item-header-title{display:inline}.arco-collapse-item-header-extra{float:right}.arco-collapse-item .arco-collapse-item-icon-hover{position:absolute;top:50%;left:13px;text-align:center;transform:translateY(-50%)}.arco-collapse-item .arco-collapse-item-icon-right{right:13px;left:unset}.arco-collapse-item .arco-collapse-item-icon-right>.arco-collapse-item-header-icon-down{transform:rotate(-90deg)}.arco-collapse-item .arco-collapse-item-expand-icon{position:relative;display:block;color:var(--color-neutral-7);font-size:14px;vertical-align:middle;transition:transform .2s cubic-bezier(.34,.69,.1,1)}.arco-collapse-item-content{position:relative;padding-right:13px;padding-left:34px;overflow:hidden;color:var(--color-text-1);font-size:14px;background-color:var(--color-fill-1)}.arco-collapse-item-content-expanded{display:block;height:auto}.arco-collapse-item-content-box{padding:8px 0}.arco-collapse-item.arco-collapse-item-disabled>.arco-collapse-item-content{color:var(--color-text-4)}.arco-collapse-item-no-icon>.arco-collapse-item-header{padding-right:13px;padding-left:13px}.arco-collapse-item:last-of-type{border-bottom:none}.arco-collapse.arco-collapse-borderless{border:none}.arco-collapse:after{display:table;clear:both;content:""}.collapse-slider-enter-from,.collapse-slider-leave-to{height:0}.collapse-slider-enter-active,.collapse-slider-leave-active{transition:height .2s cubic-bezier(.34,.69,.1,1)}.arco-alert{display:flex;align-items:center;box-sizing:border-box;width:100%;padding:8px 15px;overflow:hidden;font-size:14px;line-height:1.5715;text-align:left;border-radius:var(--border-radius-small)}.arco-alert-with-title{align-items:flex-start;padding:15px}.arco-alert-center{justify-content:center}.arco-alert-center .arco-alert-body{flex:initial}.arco-alert-normal{background-color:var(--color-neutral-2);border:1px solid transparent}.arco-alert-info{background-color:var(--color-primary-light-1);border:1px solid transparent}.arco-alert-success{background-color:var(--color-success-light-1);border:1px solid transparent}.arco-alert-warning{background-color:var(--color-warning-light-1);border:1px solid transparent}.arco-alert-error{background-color:var(--color-danger-light-1);border:1px solid transparent}.arco-alert-banner{border:none;border-radius:0}.arco-alert-body{position:relative;flex:1}.arco-alert-title{margin-bottom:4px;font-weight:500;font-size:16px;line-height:1.5}.arco-alert-normal .arco-alert-title,.arco-alert-normal .arco-alert-content{color:var(--color-text-1)}.arco-alert-normal.arco-alert-with-title .arco-alert-content{color:var(--color-text-2)}.arco-alert-info .arco-alert-title,.arco-alert-info .arco-alert-content{color:var(--color-text-1)}.arco-alert-info.arco-alert-with-title .arco-alert-content{color:var(--color-text-2)}.arco-alert-success .arco-alert-title,.arco-alert-success .arco-alert-content{color:var(--color-text-1)}.arco-alert-success.arco-alert-with-title .arco-alert-content{color:var(--color-text-2)}.arco-alert-warning .arco-alert-title,.arco-alert-warning .arco-alert-content{color:var(--color-text-1)}.arco-alert-warning.arco-alert-with-title .arco-alert-content{color:var(--color-text-2)}.arco-alert-error .arco-alert-title,.arco-alert-error .arco-alert-content{color:var(--color-text-1)}.arco-alert-error.arco-alert-with-title .arco-alert-content{color:var(--color-text-2)}.arco-alert-icon{margin-right:8px}.arco-alert-icon svg{font-size:16px;vertical-align:-3px}.arco-alert-with-title .arco-alert-icon svg{font-size:18px;vertical-align:-5px}.arco-alert-normal .arco-alert-icon svg{color:var(--color-neutral-4)}.arco-alert-info .arco-alert-icon svg{color:rgb(var(--primary-6))}.arco-alert-success .arco-alert-icon svg{color:rgb(var(--success-6))}.arco-alert-warning .arco-alert-icon svg{color:rgb(var(--warning-6))}.arco-alert-error .arco-alert-icon svg{color:rgb(var(--danger-6))}.arco-alert-close-btn{top:4px;right:0;box-sizing:border-box;margin-left:8px;padding:0;color:var(--color-text-2);font-size:12px;background-color:transparent;border:none;outline:none;cursor:pointer;transition:color .1s cubic-bezier(0,0,1,1)}.arco-alert-close-btn:hover{color:var(--color-text-1)}.arco-alert-action+.arco-alert-close-btn{margin-left:8px}.arco-alert-action{margin-left:8px}.arco-alert-with-title .arco-alert-close-btn{margin-top:0;margin-right:0}.custom-checkbox-card-title{display:flex;justify-content:space-between;align-items:center}.arco-textarea{resize:none}.arco-tabs-pane{display:flex;flex-direction:column}.diff-container-textarea{overflow-y:scroll;flex:1;white-space:pre-wrap;font-family:monospace;background:#f5f5f5;width:100%;color:inherit;border:none;border-radius:0;outline:0;cursor:inherit;display:block;box-sizing:border-box;min-height:32px;padding:4px 12px;font-size:14px;line-height:1.5715;font-family:var(--bew-font-family, var(--bew-fonts-mandarin-cn))}.arco-modal-container,.arco-modal-wrapper{pointer-events:none}.arco-modal{pointer-events:auto;box-shadow:0 0 20px #0000001a}.step-content .arco-spin{width:100%} ');

(function (vue, webVue) {
  'use strict';

  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    member.set(obj, value);
    return value;
  };
  var _worker, _resolves, _rejects, _logEventCallbacks, _progressEventCallbacks, _registerHandlers, _send;
  var _GM_cookie = /* @__PURE__ */ (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
  var _GM_getResourceURL = /* @__PURE__ */ (() => typeof GM_getResourceURL != "undefined" ? GM_getResourceURL : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const configProviderInjectionKey = Symbol("ArcoConfigProvider");
  const CLASS_PREFIX = "arco";
  const GLOBAL_CONFIG_NAME = "$arco";
  const getPrefixCls = (componentName) => {
    var _a, _b, _c;
    const instance = vue.getCurrentInstance();
    const configProvider = vue.inject(configProviderInjectionKey, void 0);
    const prefix = (_c = (_b = configProvider == null ? void 0 : configProvider.prefixCls) != null ? _b : (_a = instance == null ? void 0 : instance.appContext.config.globalProperties[GLOBAL_CONFIG_NAME]) == null ? void 0 : _a.classPrefix) != null ? _c : CLASS_PREFIX;
    {
      return `${prefix}-${componentName}`;
    }
  };
  const opt = Object.prototype.toString;
  function isNumber(obj) {
    return opt.call(obj) === "[object Number]" && obj === obj;
  }
  var _export_sfc$1 = (sfc, props) => {
    for (const [key, val] of props) {
      sfc[key] = val;
    }
    return sfc;
  };
  const _sfc_main$d = vue.defineComponent({
    name: "IconExpand",
    props: {
      size: {
        type: [Number, String]
      },
      strokeWidth: {
        type: Number,
        default: 4
      },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (value) => {
          return ["butt", "round", "square"].includes(value);
        }
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (value) => {
          return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
        }
      },
      rotate: Number,
      spin: Boolean
    },
    emits: {
      click: (ev) => true
    },
    setup(props, {
      emit
    }) {
      const prefixCls = getPrefixCls("icon");
      const cls = vue.computed(() => [prefixCls, `${prefixCls}-expand`, {
        [`${prefixCls}-spin`]: props.spin
      }]);
      const innerStyle = vue.computed(() => {
        const styles = {};
        if (props.size) {
          styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
        }
        if (props.rotate) {
          styles.transform = `rotate(${props.rotate}deg)`;
        }
        return styles;
      });
      const onClick = (ev) => {
        emit("click", ev);
      };
      return {
        cls,
        innerStyle,
        onClick
      };
    }
  });
  const _hoisted_1$c = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  const _hoisted_2$9 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M7 26v14c0 .552.444 1 .996 1H22m19-19V8c0-.552-.444-1-.996-1H26"
  }, null, -1);
  const _hoisted_3$9 = [_hoisted_2$9];
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", {
      viewBox: "0 0 48 48",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      stroke: "currentColor",
      class: vue.normalizeClass(_ctx.cls),
      style: vue.normalizeStyle(_ctx.innerStyle),
      "stroke-width": _ctx.strokeWidth,
      "stroke-linecap": _ctx.strokeLinecap,
      "stroke-linejoin": _ctx.strokeLinejoin,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, _hoisted_3$9, 14, _hoisted_1$c);
  }
  var _IconExpand = /* @__PURE__ */ _export_sfc$1(_sfc_main$d, [["render", _sfc_render$6]]);
  const IconExpand = Object.assign(_IconExpand, {
    install: (app, options) => {
      var _a;
      const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
      app.component(iconPrefix + _IconExpand.name, _IconExpand);
    }
  });
  const _sfc_main$c = vue.defineComponent({
    name: "IconShrink",
    props: {
      size: {
        type: [Number, String]
      },
      strokeWidth: {
        type: Number,
        default: 4
      },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (value) => {
          return ["butt", "round", "square"].includes(value);
        }
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (value) => {
          return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
        }
      },
      rotate: Number,
      spin: Boolean
    },
    emits: {
      click: (ev) => true
    },
    setup(props, {
      emit
    }) {
      const prefixCls = getPrefixCls("icon");
      const cls = vue.computed(() => [prefixCls, `${prefixCls}-shrink`, {
        [`${prefixCls}-spin`]: props.spin
      }]);
      const innerStyle = vue.computed(() => {
        const styles = {};
        if (props.size) {
          styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
        }
        if (props.rotate) {
          styles.transform = `rotate(${props.rotate}deg)`;
        }
        return styles;
      });
      const onClick = (ev) => {
        emit("click", ev);
      };
      return {
        cls,
        innerStyle,
        onClick
      };
    }
  });
  const _hoisted_1$b = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  const _hoisted_2$8 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M20 44V29c0-.552-.444-1-.996-1H4M28 4v15c0 .552.444 1 .996 1H44"
  }, null, -1);
  const _hoisted_3$8 = [_hoisted_2$8];
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", {
      viewBox: "0 0 48 48",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      stroke: "currentColor",
      class: vue.normalizeClass(_ctx.cls),
      style: vue.normalizeStyle(_ctx.innerStyle),
      "stroke-width": _ctx.strokeWidth,
      "stroke-linecap": _ctx.strokeLinecap,
      "stroke-linejoin": _ctx.strokeLinejoin,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, _hoisted_3$8, 14, _hoisted_1$b);
  }
  var _IconShrink = /* @__PURE__ */ _export_sfc$1(_sfc_main$c, [["render", _sfc_render$5]]);
  const IconShrink = Object.assign(_IconShrink, {
    install: (app, options) => {
      var _a;
      const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
      app.component(iconPrefix + _IconShrink.name, _IconShrink);
    }
  });
  const _sfc_main$b = vue.defineComponent({
    name: "IconClose",
    props: {
      size: {
        type: [Number, String]
      },
      strokeWidth: {
        type: Number,
        default: 4
      },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (value) => {
          return ["butt", "round", "square"].includes(value);
        }
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (value) => {
          return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
        }
      },
      rotate: Number,
      spin: Boolean
    },
    emits: {
      click: (ev) => true
    },
    setup(props, {
      emit
    }) {
      const prefixCls = getPrefixCls("icon");
      const cls = vue.computed(() => [prefixCls, `${prefixCls}-close`, {
        [`${prefixCls}-spin`]: props.spin
      }]);
      const innerStyle = vue.computed(() => {
        const styles = {};
        if (props.size) {
          styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
        }
        if (props.rotate) {
          styles.transform = `rotate(${props.rotate}deg)`;
        }
        return styles;
      });
      const onClick = (ev) => {
        emit("click", ev);
      };
      return {
        cls,
        innerStyle,
        onClick
      };
    }
  });
  const _hoisted_1$a = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  const _hoisted_2$7 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M9.857 9.858 24 24m0 0 14.142 14.142M24 24 38.142 9.858M24 24 9.857 38.142"
  }, null, -1);
  const _hoisted_3$7 = [_hoisted_2$7];
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", {
      viewBox: "0 0 48 48",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      stroke: "currentColor",
      class: vue.normalizeClass(_ctx.cls),
      style: vue.normalizeStyle(_ctx.innerStyle),
      "stroke-width": _ctx.strokeWidth,
      "stroke-linecap": _ctx.strokeLinecap,
      "stroke-linejoin": _ctx.strokeLinejoin,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, _hoisted_3$7, 14, _hoisted_1$a);
  }
  var _IconClose = /* @__PURE__ */ _export_sfc$1(_sfc_main$b, [["render", _sfc_render$4]]);
  const IconClose = Object.assign(_IconClose, {
    install: (app, options) => {
      var _a;
      const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
      app.component(iconPrefix + _IconClose.name, _IconClose);
    }
  });
  const _sfc_main$a = vue.defineComponent({
    name: "IconSearch",
    props: {
      size: {
        type: [Number, String]
      },
      strokeWidth: {
        type: Number,
        default: 4
      },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (value) => {
          return ["butt", "round", "square"].includes(value);
        }
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (value) => {
          return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
        }
      },
      rotate: Number,
      spin: Boolean
    },
    emits: {
      click: (ev) => true
    },
    setup(props, {
      emit
    }) {
      const prefixCls = getPrefixCls("icon");
      const cls = vue.computed(() => [prefixCls, `${prefixCls}-search`, {
        [`${prefixCls}-spin`]: props.spin
      }]);
      const innerStyle = vue.computed(() => {
        const styles = {};
        if (props.size) {
          styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
        }
        if (props.rotate) {
          styles.transform = `rotate(${props.rotate}deg)`;
        }
        return styles;
      });
      const onClick = (ev) => {
        emit("click", ev);
      };
      return {
        cls,
        innerStyle,
        onClick
      };
    }
  });
  const _hoisted_1$9 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  const _hoisted_2$6 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M33.072 33.071c6.248-6.248 6.248-16.379 0-22.627-6.249-6.249-16.38-6.249-22.628 0-6.248 6.248-6.248 16.379 0 22.627 6.248 6.248 16.38 6.248 22.628 0Zm0 0 8.485 8.485"
  }, null, -1);
  const _hoisted_3$6 = [_hoisted_2$6];
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", {
      viewBox: "0 0 48 48",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      stroke: "currentColor",
      class: vue.normalizeClass(_ctx.cls),
      style: vue.normalizeStyle(_ctx.innerStyle),
      "stroke-width": _ctx.strokeWidth,
      "stroke-linecap": _ctx.strokeLinecap,
      "stroke-linejoin": _ctx.strokeLinejoin,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, _hoisted_3$6, 14, _hoisted_1$9);
  }
  var _IconSearch = /* @__PURE__ */ _export_sfc$1(_sfc_main$a, [["render", _sfc_render$3]]);
  const IconSearch = Object.assign(_IconSearch, {
    install: (app, options) => {
      var _a;
      const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
      app.component(iconPrefix + _IconSearch.name, _IconSearch);
    }
  });
  const _sfc_main$9 = vue.defineComponent({
    name: "IconSettings",
    props: {
      size: {
        type: [Number, String]
      },
      strokeWidth: {
        type: Number,
        default: 4
      },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (value) => {
          return ["butt", "round", "square"].includes(value);
        }
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (value) => {
          return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
        }
      },
      rotate: Number,
      spin: Boolean
    },
    emits: {
      click: (ev) => true
    },
    setup(props, {
      emit
    }) {
      const prefixCls = getPrefixCls("icon");
      const cls = vue.computed(() => [prefixCls, `${prefixCls}-settings`, {
        [`${prefixCls}-spin`]: props.spin
      }]);
      const innerStyle = vue.computed(() => {
        const styles = {};
        if (props.size) {
          styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
        }
        if (props.rotate) {
          styles.transform = `rotate(${props.rotate}deg)`;
        }
        return styles;
      });
      const onClick = (ev) => {
        emit("click", ev);
      };
      return {
        cls,
        innerStyle,
        onClick
      };
    }
  });
  const _hoisted_1$8 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  const _hoisted_2$5 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M18.797 6.732A1 1 0 0 1 19.76 6h8.48a1 1 0 0 1 .964.732l1.285 4.628a1 1 0 0 0 1.213.7l4.651-1.2a1 1 0 0 1 1.116.468l4.24 7.344a1 1 0 0 1-.153 1.2L38.193 23.3a1 1 0 0 0 0 1.402l3.364 3.427a1 1 0 0 1 .153 1.2l-4.24 7.344a1 1 0 0 1-1.116.468l-4.65-1.2a1 1 0 0 0-1.214.7l-1.285 4.628a1 1 0 0 1-.964.732h-8.48a1 1 0 0 1-.963-.732L17.51 36.64a1 1 0 0 0-1.213-.7l-4.65 1.2a1 1 0 0 1-1.116-.468l-4.24-7.344a1 1 0 0 1 .153-1.2L9.809 24.7a1 1 0 0 0 0-1.402l-3.364-3.427a1 1 0 0 1-.153-1.2l4.24-7.344a1 1 0 0 1 1.116-.468l4.65 1.2a1 1 0 0 0 1.213-.7l1.286-4.628Z"
  }, null, -1);
  const _hoisted_3$5 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M30 24a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
  }, null, -1);
  const _hoisted_4$2 = [_hoisted_2$5, _hoisted_3$5];
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", {
      viewBox: "0 0 48 48",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      stroke: "currentColor",
      class: vue.normalizeClass(_ctx.cls),
      style: vue.normalizeStyle(_ctx.innerStyle),
      "stroke-width": _ctx.strokeWidth,
      "stroke-linecap": _ctx.strokeLinecap,
      "stroke-linejoin": _ctx.strokeLinejoin,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, _hoisted_4$2, 14, _hoisted_1$8);
  }
  var _IconSettings = /* @__PURE__ */ _export_sfc$1(_sfc_main$9, [["render", _sfc_render$2]]);
  const IconSettings = Object.assign(_IconSettings, {
    install: (app, options) => {
      var _a;
      const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
      app.component(iconPrefix + _IconSettings.name, _IconSettings);
    }
  });
  const _sfc_main$8 = vue.defineComponent({
    name: "IconPauseCircleFill",
    props: {
      size: {
        type: [Number, String]
      },
      strokeWidth: {
        type: Number,
        default: 4
      },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (value) => {
          return ["butt", "round", "square"].includes(value);
        }
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (value) => {
          return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
        }
      },
      rotate: Number,
      spin: Boolean
    },
    emits: {
      click: (ev) => true
    },
    setup(props, {
      emit
    }) {
      const prefixCls = getPrefixCls("icon");
      const cls = vue.computed(() => [prefixCls, `${prefixCls}-pause-circle-fill`, {
        [`${prefixCls}-spin`]: props.spin
      }]);
      const innerStyle = vue.computed(() => {
        const styles = {};
        if (props.size) {
          styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
        }
        if (props.rotate) {
          styles.transform = `rotate(${props.rotate}deg)`;
        }
        return styles;
      });
      const onClick = (ev) => {
        emit("click", ev);
      };
      return {
        cls,
        innerStyle,
        onClick
      };
    }
  });
  const _hoisted_1$7 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  const _hoisted_2$4 = /* @__PURE__ */ vue.createElementVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm-6-27a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V18a1 1 0 0 0-1-1h-3Zm9 0a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V18a1 1 0 0 0-1-1h-3Z",
    fill: "currentColor",
    stroke: "none"
  }, null, -1);
  const _hoisted_3$4 = [_hoisted_2$4];
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", {
      viewBox: "0 0 48 48",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      stroke: "currentColor",
      class: vue.normalizeClass(_ctx.cls),
      style: vue.normalizeStyle(_ctx.innerStyle),
      "stroke-width": _ctx.strokeWidth,
      "stroke-linecap": _ctx.strokeLinecap,
      "stroke-linejoin": _ctx.strokeLinejoin,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, _hoisted_3$4, 14, _hoisted_1$7);
  }
  var _IconPauseCircleFill = /* @__PURE__ */ _export_sfc$1(_sfc_main$8, [["render", _sfc_render$1]]);
  const IconPauseCircleFill = Object.assign(_IconPauseCircleFill, {
    install: (app, options) => {
      var _a;
      const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
      app.component(iconPrefix + _IconPauseCircleFill.name, _IconPauseCircleFill);
    }
  });
  const _sfc_main$7 = vue.defineComponent({
    name: "IconPlayCircleFill",
    props: {
      size: {
        type: [Number, String]
      },
      strokeWidth: {
        type: Number,
        default: 4
      },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (value) => {
          return ["butt", "round", "square"].includes(value);
        }
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (value) => {
          return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
        }
      },
      rotate: Number,
      spin: Boolean
    },
    emits: {
      click: (ev) => true
    },
    setup(props, {
      emit
    }) {
      const prefixCls = getPrefixCls("icon");
      const cls = vue.computed(() => [prefixCls, `${prefixCls}-play-circle-fill`, {
        [`${prefixCls}-spin`]: props.spin
      }]);
      const innerStyle = vue.computed(() => {
        const styles = {};
        if (props.size) {
          styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
        }
        if (props.rotate) {
          styles.transform = `rotate(${props.rotate}deg)`;
        }
        return styles;
      });
      const onClick = (ev) => {
        emit("click", ev);
      };
      return {
        cls,
        innerStyle,
        onClick
      };
    }
  });
  const _hoisted_1$6 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  const _hoisted_2$3 = /* @__PURE__ */ vue.createElementVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M44 24c0 11.046-8.954 20-20 20S4 35.046 4 24 12.954 4 24 4s20 8.954 20 20Zm-23.662-7.783C19.302 15.605 18 16.36 18 17.575v12.85c0 1.214 1.302 1.97 2.338 1.358l10.89-6.425c1.03-.607 1.03-2.11 0-2.716l-10.89-6.425Z",
    fill: "currentColor",
    stroke: "none"
  }, null, -1);
  const _hoisted_3$3 = [_hoisted_2$3];
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", {
      viewBox: "0 0 48 48",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      stroke: "currentColor",
      class: vue.normalizeClass(_ctx.cls),
      style: vue.normalizeStyle(_ctx.innerStyle),
      "stroke-width": _ctx.strokeWidth,
      "stroke-linecap": _ctx.strokeLinecap,
      "stroke-linejoin": _ctx.strokeLinejoin,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, _hoisted_3$3, 14, _hoisted_1$6);
  }
  var _IconPlayCircleFill = /* @__PURE__ */ _export_sfc$1(_sfc_main$7, [["render", _sfc_render]]);
  const IconPlayCircleFill = Object.assign(_IconPlayCircleFill, {
    install: (app, options) => {
      var _a;
      const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
      app.component(iconPrefix + _IconPlayCircleFill.name, _IconPlayCircleFill);
    }
  });
  function isPlainObject(item) {
    if (typeof item !== "object" || item === null) {
      return false;
    }
    const prototype = Object.getPrototypeOf(item);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in item) && !(Symbol.iterator in item);
  }
  function deepClone(source) {
    if (!isPlainObject(source)) {
      return source;
    }
    const output = {};
    Object.keys(source).forEach((key) => {
      output[key] = deepClone(source[key]);
    });
    return output;
  }
  function deepmerge(target, source, options = {
    clone: true
  }) {
    const output = options.clone ? {
      ...target
    } : target;
    if (isPlainObject(target) && isPlainObject(source)) {
      Object.keys(source).forEach((key) => {
        if (key === "__proto__") {
          return;
        }
        if (isPlainObject(source[key]) && key in target && isPlainObject(target[key])) {
          output[key] = deepmerge(target[key], source[key], options);
        } else if (options.clone) {
          output[key] = isPlainObject(source[key]) ? deepClone(source[key]) : source[key];
        } else {
          output[key] = source[key];
        }
      });
    }
    return output;
  }
  function clone(source) {
    if (!source)
      return source;
    return JSON.parse(JSON.stringify(source));
  }
  const icons = {
    debug: "🐞",
    info: "ℹ️",
    warn: "⚠",
    error: "❌️"
  };
  const Color = {
    debug: "#42CA8C;",
    info: "#37C5D6;",
    warn: "#EFC441;",
    error: "#FF6257;"
  };
  function getCleanConsole() {
    var _a;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.head.appendChild(iframe);
    const cleanConsole = (_a = iframe.contentWindow) == null ? void 0 : _a.console;
    return cleanConsole;
  }
  function getLogLevel() {
    if ("localStorage" in window) {
      const temp = localStorage.getItem("__BH_LOG_LEVEL__");
      if (temp) {
        switch (temp.toLowerCase()) {
          case "debug":
            return 8;
          case "info":
            return 4;
          case "warn":
            return 2;
          case "error":
            return 1;
        }
      }
    }
    return 4;
  }
  const newConsole = getCleanConsole();
  const logLevel = getLogLevel();
  const logger = {
    log: newConsole.log.bind(newConsole, `%c${icons.info} log > `, `color:${Color.info}; padding-left:1.2em; line-height:1.5em;`),
    debug: logLevel >= 8 ? newConsole.log.bind(newConsole, `%c${icons.debug} debug > `, `color:${Color.debug}; padding-left:1.2em; line-height:1.5em;`) : () => {
    },
    info: logLevel >= 4 ? newConsole.info.bind(newConsole, `%c${icons.info} info > `, `color:${Color.info}; padding-left:1.2em; line-height:1.5em;`) : () => {
    },
    warn: logLevel >= 2 ? newConsole.warn.bind(newConsole, `%c${icons.warn} warn > `, `color:${Color.warn}; padding-left:1.2em; line-height:1.5em;`) : () => {
    },
    error: newConsole.error.bind(newConsole, `%c${icons.error} error > `, `color:${Color.error}; padding-left:1.2em; line-height:1.5em;`),
    group: newConsole.groupCollapsed,
    groupEnd: newConsole.groupEnd
  };
  const defaultUserConfig = {
    openai: {
      host: "https://api.openai.com/v1",
      key: "",
      modal: "gpt-4o-mini"
    }
  };
  const userConfig = vue.reactive(deepmerge(defaultUserConfig, _GM_getValue("userConfig", {}), {
    clone: false
  }));
  vue.watch(userConfig, (newVal) => {
    logger.debug("write userConfig", newVal);
    _GM_setValue("userConfig", clone(newVal));
  });
  const defaultRecordData = {
    format: {
      title: "",
      author: "",
      file: ""
    },
    cover: void 0,
    lyrics: void 0
  };
  const defaultData = {
    data: null,
    err: null,
    coverUrl: null,
    lyricsData: null,
    clipRanges: null,
    videoData: null,
    playerData: null,
    videoParse: null,
    title: "",
    author: "",
    file: "",
    // 下载/播放倍速
    speed: 1,
    record: defaultRecordData,
    usedefaultconfig: false
  };
  const fromData = vue.reactive(clone(defaultData));
  const reset = () => {
    deepmerge(fromData, defaultData, {
      clone: false
    });
  };
  _unsafeWindow._bilibili_music_fromData = fromData;
  _unsafeWindow._bilibili_music_userConfig = userConfig;
  class RequestError extends Error {
    constructor(message) {
      super(message);
      this.name = "请求错误";
    }
  }
  function request({
    method = "POST",
    url = "",
    data = void 0,
    headers = {},
    timeout = 5,
    responseType = "json",
    onStream = () => {
    },
    cookie = true
  }) {
    headers["Referer"] = window.location.href;
    headers["User-Agent"] = window.navigator.userAgent;
    return new Promise((resolve, reject) => {
      void (async () => {
        try {
          const ck = cookie ? await new Promise((resolve2, reject2) => _GM_cookie.list({}, (ck2, err) => {
            if (err) {
              reject2(err);
            }
            resolve2(ck2);
          })) : [];
          logger.debug("music-log/requests", {
            url,
            data,
            method,
            headers,
            ck
          });
          _GM_xmlhttpRequest({
            method,
            url,
            data,
            headers,
            timeout: timeout * 1e3,
            responseType,
            cookie: ck.map((c) => `${c.name}=${c.value}`).join("; "),
            ontimeout() {
              reject(new RequestError(`超时 ${Math.round(timeout / 1e3)}s`));
            },
            onabort() {
              reject(new RequestError("用户中止"));
            },
            onerror(e) {
              const msg = `${e.responseText} | ${e.error}`;
              reject(new RequestError(msg));
            },
            onloadend(e) {
              resolve(e.response);
            },
            onloadstart(e) {
              if (responseType === "stream") {
                const reader = e.response.getReader();
                onStream(reader);
              }
            }
          });
        } catch (err) {
          reject(err);
        }
      })();
    });
  }
  request.post = (args) => {
    return request({
      method: "POST",
      ...args
    });
  };
  request.get = (args) => {
    return request({
      method: "GET",
      ...args
    });
  };
  const _hoisted_1$5 = {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "20px 0"
    }
  };
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "btn",
    props: {
      prev: {},
      prevLabel: {
        default: "上一步"
      },
      next: {},
      nextLabel: {
        default: "下一步"
      }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_a_button = webVue.Button;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [vue.createVNode(_component_a_button, vue.mergeProps(__props.prev, {
          onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("prev")),
          style: {
            "margin-right": "10px"
          }
        }), {
          default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(__props.prevLabel), 1)]),
          _: 1
        }, 16), vue.createVNode(_component_a_button, vue.mergeProps(__props.next, {
          onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("next"))
        }), {
          default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(__props.nextLabel), 1)]),
          _: 1
        }, 16)]);
      };
    }
  });
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var FileSaver_min = { exports: {} };
  (function(module, exports) {
    (function(a, b) {
      b();
    })(commonjsGlobal, function() {
      function b(a2, b2) {
        return "undefined" == typeof b2 ? b2 = {
          autoBom: false
        } : "object" != typeof b2 && (console.warn("Deprecated: Expected third argument to be a object"), b2 = {
          autoBom: !b2
        }), b2.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a2.type) ? new Blob(["\uFEFF", a2], {
          type: a2.type
        }) : a2;
      }
      function c(a2, b2, c2) {
        var d2 = new XMLHttpRequest();
        d2.open("GET", a2), d2.responseType = "blob", d2.onload = function() {
          g(d2.response, b2, c2);
        }, d2.onerror = function() {
          console.error("could not download file");
        }, d2.send();
      }
      function d(a2) {
        var b2 = new XMLHttpRequest();
        b2.open("HEAD", a2, false);
        try {
          b2.send();
        } catch (a3) {
        }
        return 200 <= b2.status && 299 >= b2.status;
      }
      function e(a2) {
        try {
          a2.dispatchEvent(new MouseEvent("click"));
        } catch (c2) {
          var b2 = document.createEvent("MouseEvents");
          b2.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null), a2.dispatchEvent(b2);
        }
      }
      var f = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof commonjsGlobal && commonjsGlobal.global === commonjsGlobal ? commonjsGlobal : void 0, a = f.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent), g = f.saveAs || ("object" != typeof window || window !== f ? function() {
      } : "download" in HTMLAnchorElement.prototype && !a ? function(b2, g2, h) {
        var i = f.URL || f.webkitURL, j = document.createElement("a");
        g2 = g2 || b2.name || "download", j.download = g2, j.rel = "noopener", "string" == typeof b2 ? (j.href = b2, j.origin === location.origin ? e(j) : d(j.href) ? c(b2, g2, h) : e(j, j.target = "_blank")) : (j.href = i.createObjectURL(b2), setTimeout(function() {
          i.revokeObjectURL(j.href);
        }, 4e4), setTimeout(function() {
          e(j);
        }, 0));
      } : "msSaveOrOpenBlob" in navigator ? function(f2, g2, h) {
        if (g2 = g2 || f2.name || "download", "string" != typeof f2)
          navigator.msSaveOrOpenBlob(b(f2, h), g2);
        else if (d(f2))
          c(f2, g2, h);
        else {
          var i = document.createElement("a");
          i.href = f2, i.target = "_blank", setTimeout(function() {
            e(i);
          });
        }
      } : function(b2, d2, e2, g2) {
        if (g2 = g2 || open("", "_blank"), g2 && (g2.document.title = g2.document.body.innerText = "downloading..."), "string" == typeof b2)
          return c(b2, d2, e2);
        var h = "application/octet-stream" === b2.type, i = /constructor/i.test(f.HTMLElement) || f.safari, j = /CriOS\/[\d]+/.test(navigator.userAgent);
        if ((j || h && i || a) && "undefined" != typeof FileReader) {
          var k = new FileReader();
          k.onloadend = function() {
            var a2 = k.result;
            a2 = j ? a2 : a2.replace(/^data:[^;]*;/, "data:attachment/file;"), g2 ? g2.location.href = a2 : location = a2, g2 = null;
          }, k.readAsDataURL(b2);
        } else {
          var l = f.URL || f.webkitURL, m = l.createObjectURL(b2);
          g2 ? g2.location = m : location.href = m, g2 = null, setTimeout(function() {
            l.revokeObjectURL(m);
          }, 4e4);
        }
      });
      f.saveAs = g.saveAs = g, module.exports = g;
    });
  })(FileSaver_min);
  var FileSaver_minExports = FileSaver_min.exports;
  const FileSaver = /* @__PURE__ */ getDefaultExportFromCjs(FileSaver_minExports);
  const ERROR_RESPONSE_BODY_READER = new Error("failed to get response body reader");
  const ERROR_INCOMPLETED_DOWNLOAD = new Error("failed to complete download");
  const HeaderContentLength = "Content-Length";
  const readFromBlobOrFile = (blob2) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const {
        result
      } = fileReader;
      if (result instanceof ArrayBuffer) {
        resolve(new Uint8Array(result));
      } else {
        resolve(new Uint8Array());
      }
    };
    fileReader.onerror = (event) => {
      var _a, _b;
      reject(Error(`File could not be read! Code=${((_b = (_a = event == null ? void 0 : event.target) == null ? void 0 : _a.error) == null ? void 0 : _b.code) || -1}`));
    };
    fileReader.readAsArrayBuffer(blob2);
  });
  const fetchFile = async (file) => {
    let data;
    if (typeof file === "string") {
      if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
        data = atob(file.split(",")[1]).split("").map((c) => c.charCodeAt(0));
      } else {
        data = await (await fetch(file)).arrayBuffer();
      }
    } else if (file instanceof URL) {
      data = await (await fetch(file)).arrayBuffer();
    } else if (file instanceof File || file instanceof Blob) {
      data = await readFromBlobOrFile(file);
    } else {
      return new Uint8Array();
    }
    return new Uint8Array(data);
  };
  const downloadWithProgress = async (url, cb) => {
    var _a;
    const resp = await fetch(url);
    let buf;
    try {
      const total = parseInt(resp.headers.get(HeaderContentLength) || "-1");
      const reader = (_a = resp.body) == null ? void 0 : _a.getReader();
      if (!reader)
        throw ERROR_RESPONSE_BODY_READER;
      const chunks = [];
      let received = 0;
      for (; ; ) {
        const {
          done,
          value
        } = await reader.read();
        const delta = value ? value.length : 0;
        if (done) {
          if (total != -1 && total !== received)
            throw ERROR_INCOMPLETED_DOWNLOAD;
          cb && cb({
            url,
            total,
            received,
            delta,
            done
          });
          break;
        }
        chunks.push(value);
        received += delta;
        cb && cb({
          url,
          total,
          received,
          delta,
          done
        });
      }
      const data = new Uint8Array(received);
      let position = 0;
      for (const chunk of chunks) {
        data.set(chunk, position);
        position += chunk.length;
      }
      buf = data.buffer;
    } catch (e) {
      console.log(`failed to send download progress event: `, e);
      buf = await resp.arrayBuffer();
    }
    return buf;
  };
  const toBlobURL = async (url, mimeType, progress = false, cb) => {
    const buf = progress ? await downloadWithProgress(url, cb) : await (await fetch(url)).arrayBuffer();
    const blob2 = new Blob([buf], {
      type: mimeType
    });
    return URL.createObjectURL(blob2);
  };
  const encodedJs = "KGZ1bmN0aW9uKCkgewogICJ1c2Ugc3RyaWN0IjsKICBjb25zdCBDT1JFX1ZFUlNJT04gPSAiMC4xMi45IjsKICBjb25zdCBDT1JFX1VSTCA9IGBodHRwczovL3VucGtnLmNvbS9AZmZtcGVnL2NvcmVAJHtDT1JFX1ZFUlNJT059L2Rpc3QvdW1kL2ZmbXBlZy1jb3JlLmpzYDsKICB2YXIgRkZNZXNzYWdlVHlwZTsKICAoZnVuY3Rpb24oRkZNZXNzYWdlVHlwZTIpIHsKICAgIEZGTWVzc2FnZVR5cGUyWyJMT0FEIl0gPSAiTE9BRCI7CiAgICBGRk1lc3NhZ2VUeXBlMlsiRVhFQyJdID0gIkVYRUMiOwogICAgRkZNZXNzYWdlVHlwZTJbIkZGUFJPQkUiXSA9ICJGRlBST0JFIjsKICAgIEZGTWVzc2FnZVR5cGUyWyJXUklURV9GSUxFIl0gPSAiV1JJVEVfRklMRSI7CiAgICBGRk1lc3NhZ2VUeXBlMlsiUkVBRF9GSUxFIl0gPSAiUkVBRF9GSUxFIjsKICAgIEZGTWVzc2FnZVR5cGUyWyJERUxFVEVfRklMRSJdID0gIkRFTEVURV9GSUxFIjsKICAgIEZGTWVzc2FnZVR5cGUyWyJSRU5BTUUiXSA9ICJSRU5BTUUiOwogICAgRkZNZXNzYWdlVHlwZTJbIkNSRUFURV9ESVIiXSA9ICJDUkVBVEVfRElSIjsKICAgIEZGTWVzc2FnZVR5cGUyWyJMSVNUX0RJUiJdID0gIkxJU1RfRElSIjsKICAgIEZGTWVzc2FnZVR5cGUyWyJERUxFVEVfRElSIl0gPSAiREVMRVRFX0RJUiI7CiAgICBGRk1lc3NhZ2VUeXBlMlsiRVJST1IiXSA9ICJFUlJPUiI7CiAgICBGRk1lc3NhZ2VUeXBlMlsiRE9XTkxPQUQiXSA9ICJET1dOTE9BRCI7CiAgICBGRk1lc3NhZ2VUeXBlMlsiUFJPR1JFU1MiXSA9ICJQUk9HUkVTUyI7CiAgICBGRk1lc3NhZ2VUeXBlMlsiTE9HIl0gPSAiTE9HIjsKICAgIEZGTWVzc2FnZVR5cGUyWyJNT1VOVCJdID0gIk1PVU5UIjsKICAgIEZGTWVzc2FnZVR5cGUyWyJVTk1PVU5UIl0gPSAiVU5NT1VOVCI7CiAgfSkoRkZNZXNzYWdlVHlwZSB8fCAoRkZNZXNzYWdlVHlwZSA9IHt9KSk7CiAgY29uc3QgRVJST1JfVU5LTk9XTl9NRVNTQUdFX1RZUEUgPSBuZXcgRXJyb3IoInVua25vd24gbWVzc2FnZSB0eXBlIik7CiAgY29uc3QgRVJST1JfTk9UX0xPQURFRCA9IG5ldyBFcnJvcigiZmZtcGVnIGlzIG5vdCBsb2FkZWQsIGNhbGwgYGF3YWl0IGZmbXBlZy5sb2FkKClgIGZpcnN0Iik7CiAgY29uc3QgRVJST1JfSU1QT1JUX0ZBSUxVUkUgPSBuZXcgRXJyb3IoImZhaWxlZCB0byBpbXBvcnQgZmZtcGVnLWNvcmUuanMiKTsKICBsZXQgZmZtcGVnOwogIGNvbnN0IGxvYWQgPSBhc3luYyAoeyBjb3JlVVJMOiBfY29yZVVSTCwgd2FzbVVSTDogX3dhc21VUkwsIHdvcmtlclVSTDogX3dvcmtlclVSTCB9KSA9PiB7CiAgICBjb25zdCBmaXJzdCA9ICFmZm1wZWc7CiAgICB0cnkgewogICAgICBpZiAoIV9jb3JlVVJMKQogICAgICAgIF9jb3JlVVJMID0gQ09SRV9VUkw7CiAgICAgIGltcG9ydFNjcmlwdHMoX2NvcmVVUkwpOwogICAgfSBjYXRjaCB7CiAgICAgIGlmICghX2NvcmVVUkwgfHwgX2NvcmVVUkwgPT09IENPUkVfVVJMKQogICAgICAgIF9jb3JlVVJMID0gQ09SRV9VUkwucmVwbGFjZSgiL3VtZC8iLCAiL2VzbS8iKTsKICAgICAgc2VsZi5jcmVhdGVGRm1wZWdDb3JlID0gKGF3YWl0IGltcG9ydCgKICAgICAgICAvKiBAdml0ZS1pZ25vcmUgKi8KICAgICAgICBfY29yZVVSTAogICAgICApKS5kZWZhdWx0OwogICAgICBpZiAoIXNlbGYuY3JlYXRlRkZtcGVnQ29yZSkgewogICAgICAgIHRocm93IEVSUk9SX0lNUE9SVF9GQUlMVVJFOwogICAgICB9CiAgICB9CiAgICBjb25zdCBjb3JlVVJMID0gX2NvcmVVUkw7CiAgICBjb25zdCB3YXNtVVJMID0gX3dhc21VUkwgPyBfd2FzbVVSTCA6IF9jb3JlVVJMLnJlcGxhY2UoLy5qcyQvZywgIi53YXNtIik7CiAgICBjb25zdCB3b3JrZXJVUkwgPSBfd29ya2VyVVJMID8gX3dvcmtlclVSTCA6IF9jb3JlVVJMLnJlcGxhY2UoLy5qcyQvZywgIi53b3JrZXIuanMiKTsKICAgIGZmbXBlZyA9IGF3YWl0IHNlbGYuY3JlYXRlRkZtcGVnQ29yZSh7CiAgICAgIC8vIEZpeCBgT3ZlcmxvYWQgcmVzb2x1dGlvbiBmYWlsZWQuYCB3aGVuIHVzaW5nIG11bHRpLXRocmVhZGVkIGZmbXBlZy1jb3JlLgogICAgICAvLyBFbmNvZGVkIHdhc21VUkwgYW5kIHdvcmtlclVSTCBpbiB0aGUgVVJMIGFzIGEgaGFjayB0byBmaXggbG9jYXRlRmlsZSBpc3N1ZS4KICAgICAgbWFpblNjcmlwdFVybE9yQmxvYjogYCR7Y29yZVVSTH0jJHtidG9hKEpTT04uc3RyaW5naWZ5KHsgd2FzbVVSTCwgd29ya2VyVVJMIH0pKX1gCiAgICB9KTsKICAgIGZmbXBlZy5zZXRMb2dnZXIoKGRhdGEpID0+IHNlbGYucG9zdE1lc3NhZ2UoeyB0eXBlOiBGRk1lc3NhZ2VUeXBlLkxPRywgZGF0YSB9KSk7CiAgICBmZm1wZWcuc2V0UHJvZ3Jlc3MoKGRhdGEpID0+IHNlbGYucG9zdE1lc3NhZ2UoewogICAgICB0eXBlOiBGRk1lc3NhZ2VUeXBlLlBST0dSRVNTLAogICAgICBkYXRhCiAgICB9KSk7CiAgICByZXR1cm4gZmlyc3Q7CiAgfTsKICBjb25zdCBleGVjID0gKHsgYXJncywgdGltZW91dCA9IC0xIH0pID0+IHsKICAgIGZmbXBlZy5zZXRUaW1lb3V0KHRpbWVvdXQpOwogICAgZmZtcGVnLmV4ZWMoLi4uYXJncyk7CiAgICBjb25zdCByZXQgPSBmZm1wZWcucmV0OwogICAgZmZtcGVnLnJlc2V0KCk7CiAgICByZXR1cm4gcmV0OwogIH07CiAgY29uc3QgZmZwcm9iZSA9ICh7IGFyZ3MsIHRpbWVvdXQgPSAtMSB9KSA9PiB7CiAgICBmZm1wZWcuc2V0VGltZW91dCh0aW1lb3V0KTsKICAgIGZmbXBlZy5mZnByb2JlKC4uLmFyZ3MpOwogICAgY29uc3QgcmV0ID0gZmZtcGVnLnJldDsKICAgIGZmbXBlZy5yZXNldCgpOwogICAgcmV0dXJuIHJldDsKICB9OwogIGNvbnN0IHdyaXRlRmlsZSA9ICh7IHBhdGgsIGRhdGEgfSkgPT4gewogICAgZmZtcGVnLkZTLndyaXRlRmlsZShwYXRoLCBkYXRhKTsKICAgIHJldHVybiB0cnVlOwogIH07CiAgY29uc3QgcmVhZEZpbGUgPSAoeyBwYXRoLCBlbmNvZGluZyB9KSA9PiBmZm1wZWcuRlMucmVhZEZpbGUocGF0aCwgeyBlbmNvZGluZyB9KTsKICBjb25zdCBkZWxldGVGaWxlID0gKHsgcGF0aCB9KSA9PiB7CiAgICBmZm1wZWcuRlMudW5saW5rKHBhdGgpOwogICAgcmV0dXJuIHRydWU7CiAgfTsKICBjb25zdCByZW5hbWUgPSAoeyBvbGRQYXRoLCBuZXdQYXRoIH0pID0+IHsKICAgIGZmbXBlZy5GUy5yZW5hbWUob2xkUGF0aCwgbmV3UGF0aCk7CiAgICByZXR1cm4gdHJ1ZTsKICB9OwogIGNvbnN0IGNyZWF0ZURpciA9ICh7IHBhdGggfSkgPT4gewogICAgZmZtcGVnLkZTLm1rZGlyKHBhdGgpOwogICAgcmV0dXJuIHRydWU7CiAgfTsKICBjb25zdCBsaXN0RGlyID0gKHsgcGF0aCB9KSA9PiB7CiAgICBjb25zdCBuYW1lcyA9IGZmbXBlZy5GUy5yZWFkZGlyKHBhdGgpOwogICAgY29uc3Qgbm9kZXMgPSBbXTsKICAgIGZvciAoY29uc3QgbmFtZSBvZiBuYW1lcykgewogICAgICBjb25zdCBzdGF0ID0gZmZtcGVnLkZTLnN0YXQoYCR7cGF0aH0vJHtuYW1lfWApOwogICAgICBjb25zdCBpc0RpciA9IGZmbXBlZy5GUy5pc0RpcihzdGF0Lm1vZGUpOwogICAgICBub2Rlcy5wdXNoKHsgbmFtZSwgaXNEaXIgfSk7CiAgICB9CiAgICByZXR1cm4gbm9kZXM7CiAgfTsKICBjb25zdCBkZWxldGVEaXIgPSAoeyBwYXRoIH0pID0+IHsKICAgIGZmbXBlZy5GUy5ybWRpcihwYXRoKTsKICAgIHJldHVybiB0cnVlOwogIH07CiAgY29uc3QgbW91bnQgPSAoeyBmc1R5cGUsIG9wdGlvbnMsIG1vdW50UG9pbnQgfSkgPT4gewogICAgY29uc3Qgc3RyID0gZnNUeXBlOwogICAgY29uc3QgZnMgPSBmZm1wZWcuRlMuZmlsZXN5c3RlbXNbc3RyXTsKICAgIGlmICghZnMpCiAgICAgIHJldHVybiBmYWxzZTsKICAgIGZmbXBlZy5GUy5tb3VudChmcywgb3B0aW9ucywgbW91bnRQb2ludCk7CiAgICByZXR1cm4gdHJ1ZTsKICB9OwogIGNvbnN0IHVubW91bnQgPSAoeyBtb3VudFBvaW50IH0pID0+IHsKICAgIGZmbXBlZy5GUy51bm1vdW50KG1vdW50UG9pbnQpOwogICAgcmV0dXJuIHRydWU7CiAgfTsKICBzZWxmLm9ubWVzc2FnZSA9IGFzeW5jICh7IGRhdGE6IHsgaWQsIHR5cGUsIGRhdGE6IF9kYXRhIH0gfSkgPT4gewogICAgY29uc3QgdHJhbnMgPSBbXTsKICAgIGxldCBkYXRhOwogICAgdHJ5IHsKICAgICAgaWYgKHR5cGUgIT09IEZGTWVzc2FnZVR5cGUuTE9BRCAmJiAhZmZtcGVnKQogICAgICAgIHRocm93IEVSUk9SX05PVF9MT0FERUQ7CiAgICAgIHN3aXRjaCAodHlwZSkgewogICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5MT0FEOgogICAgICAgICAgZGF0YSA9IGF3YWl0IGxvYWQoX2RhdGEpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLkVYRUM6CiAgICAgICAgICBkYXRhID0gZXhlYyhfZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIEZGTWVzc2FnZVR5cGUuRkZQUk9CRToKICAgICAgICAgIGRhdGEgPSBmZnByb2JlKF9kYXRhKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5XUklURV9GSUxFOgogICAgICAgICAgZGF0YSA9IHdyaXRlRmlsZShfZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIEZGTWVzc2FnZVR5cGUuUkVBRF9GSUxFOgogICAgICAgICAgZGF0YSA9IHJlYWRGaWxlKF9kYXRhKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5ERUxFVEVfRklMRToKICAgICAgICAgIGRhdGEgPSBkZWxldGVGaWxlKF9kYXRhKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5SRU5BTUU6CiAgICAgICAgICBkYXRhID0gcmVuYW1lKF9kYXRhKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5DUkVBVEVfRElSOgogICAgICAgICAgZGF0YSA9IGNyZWF0ZURpcihfZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIEZGTWVzc2FnZVR5cGUuTElTVF9ESVI6CiAgICAgICAgICBkYXRhID0gbGlzdERpcihfZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIEZGTWVzc2FnZVR5cGUuREVMRVRFX0RJUjoKICAgICAgICAgIGRhdGEgPSBkZWxldGVEaXIoX2RhdGEpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLk1PVU5UOgogICAgICAgICAgZGF0YSA9IG1vdW50KF9kYXRhKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5VTk1PVU5UOgogICAgICAgICAgZGF0YSA9IHVubW91bnQoX2RhdGEpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgZGVmYXVsdDoKICAgICAgICAgIHRocm93IEVSUk9SX1VOS05PV05fTUVTU0FHRV9UWVBFOwogICAgICB9CiAgICB9IGNhdGNoIChlKSB7CiAgICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICAgIGlkLAogICAgICAgIHR5cGU6IEZGTWVzc2FnZVR5cGUuRVJST1IsCiAgICAgICAgZGF0YTogZS50b1N0cmluZygpCiAgICAgIH0pOwogICAgICByZXR1cm47CiAgICB9CiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHsKICAgICAgdHJhbnMucHVzaChkYXRhLmJ1ZmZlcik7CiAgICB9CiAgICBzZWxmLnBvc3RNZXNzYWdlKHsgaWQsIHR5cGUsIGRhdGEgfSwgdHJhbnMpOwogIH07Cn0pKCk7Cg==";
  const decodeBase64 = (base64) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = typeof window !== "undefined" && window.Blob && new Blob([decodeBase64(encodedJs)], { type: "text/javascript;charset=utf-8" });
  function WorkerWrapper(options) {
    let objURL;
    try {
      objURL = blob && (window.URL || window.webkitURL).createObjectURL(blob);
      if (!objURL)
        throw "";
      const worker = new Worker(objURL, {
        name: options == null ? void 0 : options.name
      });
      worker.addEventListener("error", () => {
        (window.URL || window.webkitURL).revokeObjectURL(objURL);
      });
      return worker;
    } catch (e) {
      return new Worker(
        "data:text/javascript;base64," + encodedJs,
        {
          name: options == null ? void 0 : options.name
        }
      );
    } finally {
      objURL && (window.URL || window.webkitURL).revokeObjectURL(objURL);
    }
  }
  var FFMessageType;
  (function(FFMessageType2) {
    FFMessageType2["LOAD"] = "LOAD";
    FFMessageType2["EXEC"] = "EXEC";
    FFMessageType2["FFPROBE"] = "FFPROBE";
    FFMessageType2["WRITE_FILE"] = "WRITE_FILE";
    FFMessageType2["READ_FILE"] = "READ_FILE";
    FFMessageType2["DELETE_FILE"] = "DELETE_FILE";
    FFMessageType2["RENAME"] = "RENAME";
    FFMessageType2["CREATE_DIR"] = "CREATE_DIR";
    FFMessageType2["LIST_DIR"] = "LIST_DIR";
    FFMessageType2["DELETE_DIR"] = "DELETE_DIR";
    FFMessageType2["ERROR"] = "ERROR";
    FFMessageType2["DOWNLOAD"] = "DOWNLOAD";
    FFMessageType2["PROGRESS"] = "PROGRESS";
    FFMessageType2["LOG"] = "LOG";
    FFMessageType2["MOUNT"] = "MOUNT";
    FFMessageType2["UNMOUNT"] = "UNMOUNT";
  })(FFMessageType || (FFMessageType = {}));
  const getMessageID = /* @__PURE__ */ (() => {
    let messageID = 0;
    return () => messageID++;
  })();
  const ERROR_NOT_LOADED = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first");
  const ERROR_TERMINATED = new Error("called FFmpeg.terminate()");
  class FFmpeg {
    constructor() {
      __privateAdd(this, _worker, null);
      /**
       * #resolves and #rejects tracks Promise resolves and rejects to
       * be called when we receive message from web worker.
       */
      __privateAdd(this, _resolves, {});
      __privateAdd(this, _rejects, {});
      __privateAdd(this, _logEventCallbacks, []);
      __privateAdd(this, _progressEventCallbacks, []);
      __publicField(this, "loaded", false);
      /**
       * register worker message event handlers.
       */
      __privateAdd(this, _registerHandlers, () => {
        if (__privateGet(this, _worker)) {
          __privateGet(this, _worker).onmessage = ({
            data: {
              id,
              type,
              data
            }
          }) => {
            switch (type) {
              case FFMessageType.LOAD:
                this.loaded = true;
                __privateGet(this, _resolves)[id](data);
                break;
              case FFMessageType.MOUNT:
              case FFMessageType.UNMOUNT:
              case FFMessageType.EXEC:
              case FFMessageType.FFPROBE:
              case FFMessageType.WRITE_FILE:
              case FFMessageType.READ_FILE:
              case FFMessageType.DELETE_FILE:
              case FFMessageType.RENAME:
              case FFMessageType.CREATE_DIR:
              case FFMessageType.LIST_DIR:
              case FFMessageType.DELETE_DIR:
                __privateGet(this, _resolves)[id](data);
                break;
              case FFMessageType.LOG:
                __privateGet(this, _logEventCallbacks).forEach((f) => f(data));
                break;
              case FFMessageType.PROGRESS:
                __privateGet(this, _progressEventCallbacks).forEach((f) => f(data));
                break;
              case FFMessageType.ERROR:
                __privateGet(this, _rejects)[id](data);
                break;
            }
            delete __privateGet(this, _resolves)[id];
            delete __privateGet(this, _rejects)[id];
          };
        }
      });
      /**
       * Generic function to send messages to web worker.
       */
      __privateAdd(this, _send, ({
        type,
        data
      }, trans = [], signal) => {
        if (!__privateGet(this, _worker)) {
          return Promise.reject(ERROR_NOT_LOADED);
        }
        return new Promise((resolve, reject) => {
          const id = getMessageID();
          __privateGet(this, _worker) && __privateGet(this, _worker).postMessage({
            id,
            type,
            data
          }, trans);
          __privateGet(this, _resolves)[id] = resolve;
          __privateGet(this, _rejects)[id] = reject;
          signal == null ? void 0 : signal.addEventListener("abort", () => {
            reject(new DOMException(`Message # ${id} was aborted`, "AbortError"));
          }, {
            once: true
          });
        });
      });
      /**
       * Loads ffmpeg-core inside web worker. It is required to call this method first
       * as it initializes WebAssembly and other essential variables.
       *
       * @category FFmpeg
       * @returns `true` if ffmpeg core is loaded for the first time.
       */
      __publicField(this, "load", ({
        classWorkerURL,
        ...config
      } = {}, {
        signal
      } = {}) => {
        if (!__privateGet(this, _worker)) {
          __privateSet(this, _worker, classWorkerURL ? new Worker(new URL(classWorkerURL, (_documentCurrentScript && _documentCurrentScript.src || new URL('__entry.js', document.baseURI).href)), {
            type: "module"
          }) : (
            // We need to duplicated the code here to enable webpack
            // to bundle worekr.js here.
            new WorkerWrapper({
              type: "module"
            })
          ));
          __privateGet(this, _registerHandlers).call(this);
        }
        return __privateGet(this, _send).call(this, {
          type: FFMessageType.LOAD,
          data: config
        }, void 0, signal);
      });
      /**
       * Execute ffmpeg command.
       *
       * @remarks
       * To avoid common I/O issues, ["-nostdin", "-y"] are prepended to the args
       * by default.
       *
       * @example
       * ```ts
       * const ffmpeg = new FFmpeg();
       * await ffmpeg.load();
       * await ffmpeg.writeFile("video.avi", ...);
       * // ffmpeg -i video.avi video.mp4
       * await ffmpeg.exec(["-i", "video.avi", "video.mp4"]);
       * const data = ffmpeg.readFile("video.mp4");
       * ```
       *
       * @returns `0` if no error, `!= 0` if timeout (1) or error.
       * @category FFmpeg
       */
      __publicField(this, "exec", (args, timeout = -1, {
        signal
      } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.EXEC,
        data: {
          args,
          timeout
        }
      }, void 0, signal));
      /**
       * Execute ffprobe command.
       *
       * @example
       * ```ts
       * const ffmpeg = new FFmpeg();
       * await ffmpeg.load();
       * await ffmpeg.writeFile("video.avi", ...);
       * // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt
       * await ffmpeg.ffprobe(["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "video.avi", "-o", "output.txt"]);
       * const data = ffmpeg.readFile("output.txt");
       * ```
       *
       * @returns `0` if no error, `!= 0` if timeout (1) or error.
       * @category FFmpeg
       */
      __publicField(this, "ffprobe", (args, timeout = -1, {
        signal
      } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.FFPROBE,
        data: {
          args,
          timeout
        }
      }, void 0, signal));
      /**
       * Terminate all ongoing API calls and terminate web worker.
       * `FFmpeg.load()` must be called again before calling any other APIs.
       *
       * @category FFmpeg
       */
      __publicField(this, "terminate", () => {
        const ids = Object.keys(__privateGet(this, _rejects));
        for (const id of ids) {
          __privateGet(this, _rejects)[id](ERROR_TERMINATED);
          delete __privateGet(this, _rejects)[id];
          delete __privateGet(this, _resolves)[id];
        }
        if (__privateGet(this, _worker)) {
          __privateGet(this, _worker).terminate();
          __privateSet(this, _worker, null);
          this.loaded = false;
        }
      });
      /**
       * Write data to ffmpeg.wasm.
       *
       * @example
       * ```ts
       * const ffmpeg = new FFmpeg();
       * await ffmpeg.load();
       * await ffmpeg.writeFile("video.avi", await fetchFile("../video.avi"));
       * await ffmpeg.writeFile("text.txt", "hello world");
       * ```
       *
       * @category File System
       */
      __publicField(this, "writeFile", (path, data, {
        signal
      } = {}) => {
        const trans = [];
        if (data instanceof Uint8Array) {
          trans.push(data.buffer);
        }
        return __privateGet(this, _send).call(this, {
          type: FFMessageType.WRITE_FILE,
          data: {
            path,
            data
          }
        }, trans, signal);
      });
      __publicField(this, "mount", (fsType, options, mountPoint) => {
        const trans = [];
        return __privateGet(this, _send).call(this, {
          type: FFMessageType.MOUNT,
          data: {
            fsType,
            options,
            mountPoint
          }
        }, trans);
      });
      __publicField(this, "unmount", (mountPoint) => {
        const trans = [];
        return __privateGet(this, _send).call(this, {
          type: FFMessageType.UNMOUNT,
          data: {
            mountPoint
          }
        }, trans);
      });
      /**
       * Read data from ffmpeg.wasm.
       *
       * @example
       * ```ts
       * const ffmpeg = new FFmpeg();
       * await ffmpeg.load();
       * const data = await ffmpeg.readFile("video.mp4");
       * ```
       *
       * @category File System
       */
      __publicField(this, "readFile", (path, encoding = "binary", {
        signal
      } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.READ_FILE,
        data: {
          path,
          encoding
        }
      }, void 0, signal));
      /**
       * Delete a file.
       *
       * @category File System
       */
      __publicField(this, "deleteFile", (path, {
        signal
      } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.DELETE_FILE,
        data: {
          path
        }
      }, void 0, signal));
      /**
       * Rename a file or directory.
       *
       * @category File System
       */
      __publicField(this, "rename", (oldPath, newPath, {
        signal
      } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.RENAME,
        data: {
          oldPath,
          newPath
        }
      }, void 0, signal));
      /**
       * Create a directory.
       *
       * @category File System
       */
      __publicField(this, "createDir", (path, {
        signal
      } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.CREATE_DIR,
        data: {
          path
        }
      }, void 0, signal));
      /**
       * List directory contents.
       *
       * @category File System
       */
      __publicField(this, "listDir", (path, {
        signal
      } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.LIST_DIR,
        data: {
          path
        }
      }, void 0, signal));
      /**
       * Delete an empty directory.
       *
       * @category File System
       */
      __publicField(this, "deleteDir", (path, {
        signal
      } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.DELETE_DIR,
        data: {
          path
        }
      }, void 0, signal));
    }
    on(event, callback) {
      if (event === "log") {
        __privateGet(this, _logEventCallbacks).push(callback);
      } else if (event === "progress") {
        __privateGet(this, _progressEventCallbacks).push(callback);
      }
    }
    off(event, callback) {
      if (event === "log") {
        __privateSet(this, _logEventCallbacks, __privateGet(this, _logEventCallbacks).filter((f) => f !== callback));
      } else if (event === "progress") {
        __privateSet(this, _progressEventCallbacks, __privateGet(this, _progressEventCallbacks).filter((f) => f !== callback));
      }
    }
  }
  _worker = new WeakMap();
  _resolves = new WeakMap();
  _rejects = new WeakMap();
  _logEventCallbacks = new WeakMap();
  _progressEventCallbacks = new WeakMap();
  _registerHandlers = new WeakMap();
  _send = new WeakMap();
  var FFFSType;
  (function(FFFSType2) {
    FFFSType2["MEMFS"] = "MEMFS";
    FFFSType2["NODEFS"] = "NODEFS";
    FFFSType2["NODERAWFS"] = "NODERAWFS";
    FFFSType2["IDBFS"] = "IDBFS";
    FFFSType2["WORKERFS"] = "WORKERFS";
    FFFSType2["PROXYFS"] = "PROXYFS";
  })(FFFSType || (FFFSType = {}));
  const ffmpeg = new FFmpeg();
  const ffmpegLoad = async () => {
    const baseCoreUrl = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    const baseCoreMTUrl = "https://unpkg.com/@ffmpeg/core-mt@0.12.10/dist/umd";
    ffmpeg.on("log", ({
      message
    }) => {
      logger.debug("[ffmpeg]", message);
    });
    if (window.crossOriginIsolated) {
      logger.info("[ffmpeg] 多线程模式");
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseCoreMTUrl}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseCoreMTUrl}/ffmpeg-core.wasm`, "application/wasm"),
        workerURL: await toBlobURL(`${baseCoreMTUrl}/ffmpeg-core.worker.js`, "application/javascript")
        // classWorkerURL:await toBlobURL(`${baseFFmpegUrl}/worker.js`, 'application/javascript'),
      });
    } else {
      logger.info("[ffmpeg] 单线程模式");
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseCoreUrl}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseCoreUrl}/ffmpeg-core.wasm`, "application/wasm")
        // classWorkerURL:await toBlobURL(`${baseFFmpegUrl}/worker.js`, 'application/javascript'),
      });
    }
    logger.info("[ffmpeg] load完成");
  };
  const _hoisted_1$4 = {
    class: "audio"
  };
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "audio",
    setup(__props) {
      const steps = ["获取音频", "下载音频", "解码音频\n可能出现假死,耐心等待解码耗时长", "下载封面", "开始内嵌", "准备下载"];
      const stepIndex = vue.ref(0);
      const error = vue.ref();
      const fileBlob = vue.ref();
      const status = vue.computed(() => error.value ? "error" : fileBlob.value ? "success" : null);
      function formatLrc(ms) {
        const m = Math.floor(ms / 6e4).toString().padStart(2, "0");
        const s = (ms % 6e4 / 1e3).toFixed(3).padStart(6, "0");
        return `[${m}:${s}]`;
      }
      function getKeepRanges(deleteRanges, totalDurationMs = Infinity) {
        const sorted = [...deleteRanges].sort((a, b) => a[0] - b[0]);
        const merged = [];
        if (sorted.length > 0) {
          let curr = sorted[0];
          for (let i = 1; i < sorted.length; i++) {
            if (sorted[i][0] <= curr[1])
              curr[1] = Math.max(curr[1], sorted[i][1]);
            else {
              merged.push(curr);
              curr = sorted[i];
            }
          }
          merged.push(curr);
        }
        const keep = [];
        let lastPos = 0;
        for (const [dStart, dEnd] of merged) {
          if (dStart > lastPos) {
            keep.push({
              start: lastPos / 1e3,
              end: dStart / 1e3
            });
          }
          lastPos = dEnd;
        }
        keep.push({
          start: lastPos / 1e3
        });
        return {
          keepRanges: keep,
          mergedDeleteRanges: merged
        };
      }
      function processLyrics(lyrics, deleteRanges, speed) {
        const {
          mergedDeleteRanges
        } = getKeepRanges(deleteRanges);
        return lyrics.reduce((acc, [ms, text]) => {
          let time = ms;
          const deletedBefore = mergedDeleteRanges.filter(([start]) => ms >= start).reduce((sum, [start, end]) => {
            const actualEnd = Math.min(ms, end);
            return sum + (actualEnd - start);
          }, 0);
          time -= deletedBefore;
          const isDeleted = mergedDeleteRanges.some(([start, end]) => ms >= start && ms < end);
          if (!isDeleted) {
            acc.push([time / speed, text]);
          }
          return acc;
        }, []);
      }
      function main2() {
        var _a, _b;
        stepIndex.value = 0;
        const avid = (_a = fromData.playerData) == null ? void 0 : _a.aid;
        const cid = (_b = fromData.playerData) == null ? void 0 : _b.cid;
        error.value = null;
        fileBlob.value = void 0;
        request.get({
          url: `https://api.bilibili.com/x/player/playurl?qn=120&otype=json&fourk=1&fnver=0&fnval=4048&avid=${avid}&cid=${cid}`
        }).then(async (res) => {
          var _a2, _b2, _c;
          await ffmpegLoad();
          let audioUrl = void 0;
          let dash = res.data.dash;
          if (!dash) {
            error.value = "未找到音频";
            return;
          }
          if (dash.flac && dash.flac.audio) {
            audioUrl = dash.flac.audio.base_url || dash.flac.audio.baseUrl;
          }
          if (!audioUrl && dash.dolby && dash.dolby.audio) {
            audioUrl = dash.dolby.audio[0].base_url;
          }
          if (!audioUrl && dash.audio) {
            const bestAudio = dash.audio.reduce((prev, current) => prev.bandwidth > current.bandwidth ? prev : current);
            audioUrl = bestAudio.base_url || bestAudio.baseUrl;
          }
          stepIndex.value++;
          await ffmpeg.writeFile("input.m4s", await fetchFile(audioUrl));
          const inputArgs = ["-i", "input.m4s"];
          const processArgs = [];
          let filterChains = [];
          let lastStreamLabel = "[0:a]";
          const {
            keepRanges
          } = getKeepRanges(fromData.clipRanges || []);
          if (keepRanges.length > 0) {
            const segmentLabels = [];
            keepRanges.forEach((r, i) => {
              const endStr = r.end ? `:end=${r.end}` : "";
              const label = `[a${i}]`;
              filterChains.push(`[0:a]atrim=start=${r.start}${endStr},asetpts=PTS-STARTPTS${label}`);
              segmentLabels.push(label);
            });
            if (segmentLabels.length > 1) {
              const concatLabel = "[out_clip]";
              filterChains.push(`${segmentLabels.join("")}concat=n=${segmentLabels.length}:v=0:a=1${concatLabel}`);
              lastStreamLabel = concatLabel;
            } else {
              lastStreamLabel = segmentLabels[0];
            }
          }
          if (fromData.speed !== 1) {
            const speedLabel = "[final_a]";
            filterChains.push(`${lastStreamLabel}atempo=${fromData.speed}${speedLabel}`);
            lastStreamLabel = speedLabel;
            processArgs.push("-c:a", "aac", "-q:a", "2");
          } else {
            if (filterChains.length > 0) {
              processArgs.push("-c:a", "aac", "-q:a", "2");
            } else {
              processArgs.push("-c:a", "copy");
            }
          }
          if (filterChains.length > 0) {
            processArgs.push("-filter_complex", filterChains.join(";"));
          }
          processArgs.push("-map", lastStreamLabel === "[0:a]" ? "0:a" : lastStreamLabel);
          const metadataArgs = ["-metadata", `title=${fromData.title}`, "-metadata", `artist=${fromData.author}`, "-metadata", `source_url=${location.href.split("?")[0]}`, "-metadata", `publisher=${location.href.split("?")[0]}`, "-metadata", `encoded_by=ocyss/wasm-music`, "-metadata", `comment=Wasm🎶音乐姬下载,仅供个人学习使用,严谨售卖和其他侵权行为`];
          if (fromData.coverUrl) {
            await ffmpeg.writeFile("cover.jpg", await fetchFile(fromData.coverUrl.replace("http://", "https://")));
            inputArgs.push("-i", "cover.jpg");
            processArgs.push("-map", "1:0");
            processArgs.push("-c:v", "mjpeg");
            processArgs.push("-disposition:v", "attached_pic");
          }
          if (fromData.lyricsData && fromData.lyricsData.length > 0) {
            const finalLyrics = processLyrics(fromData.lyricsData, fromData.clipRanges || [], fromData.speed || 1);
            const header = [
              `[ti:${fromData.title}]`,
              // 标题
              `[ar:${fromData.author}]`,
              // 艺术家
              `[al:${((_a2 = fromData.data) == null ? void 0 : _a2.album) || ""}]`,
              // 专辑
              `[re:ocyss/wasm-music]`,
              // 制作工具
              `[ve:1.0.0]`,
              // 版本
              `[url: ${location.href.split("?")[0]}]`
            ].filter((line) => !line.includes(": ]"));
            const lrcString = [...header, ...finalLyrics.map((item) => `${formatLrc(item[0])} ${item[1]}`)].join("\n");
            metadataArgs.push("-metadata", `lyrics=${lrcString}`);
          }
          if ((_b2 = fromData.data) == null ? void 0 : _b2.album) {
            metadataArgs.push("-metadata", `album=${fromData.data.album}`);
          }
          if ((_c = fromData.data) == null ? void 0 : _c.music_publish) {
            metadataArgs.push("-metadata", `date=${fromData.data.music_publish}`);
          }
          await ffmpeg.exec([...inputArgs, ...processArgs, ...metadataArgs, "output.m4a"]);
          const fileData = await ffmpeg.readFile("output.m4a");
          fileBlob.value = typeof fileData === "string" ? fileData : new Blob([fileData], {
            type: "audio/m4a"
          });
          stepIndex.value = steps.length - 1;
        });
      }
      const download = () => {
        if (!fileBlob.value) {
          error.value = "文件为空";
          return;
        }
        FileSaver.saveAs(fileBlob.value, fromData.file ?? "bilibili_music.m4a");
      };
      vue.onMounted(() => {
        main2();
      });
      const saveDefault = () => {
        _GM_setValue("default_rule", JSON.parse(JSON.stringify(fromData.record)));
      };
      return (_ctx, _cache) => {
        const _component_a_button = webVue.Button;
        const _component_a_tooltip = webVue.Tooltip;
        const _component_a_space = webVue.Space;
        const _component_a_result = webVue.Result;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [vue.createVNode(_component_a_result, {
          status: vue.unref(status),
          title: vue.unref(error) ?? `${vue.unref(stepIndex) + 1}/${steps.length}:${steps[vue.unref(stepIndex)]}`
        }, vue.createSlots({
          extra: vue.withCtx(() => [vue.unref(stepIndex) === steps.length - 1 ? (vue.openBlock(), vue.createBlock(_component_a_space, {
            key: 0
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_tooltip, {
              content: "点击无反应/卡死/闪退,可去油猴配置(初学,高级)下更换下载模式尝试",
              position: "top"
            }, {
              default: vue.withCtx(() => [vue.createVNode(_component_a_button, {
                onClick: download
              }, {
                default: vue.withCtx(() => [..._cache[2] || (_cache[2] = [vue.createTextVNode("开始下载", -1)])]),
                _: 1
              })]),
              _: 1
            })]),
            _: 1
          })) : vue.createCommentVNode("", true)]),
          _: 2
        }, [vue.unref(status) === null ? {
          name: "icon",
          fn: vue.withCtx(() => [_cache[1] || (_cache[1] = vue.createElementVNode("div", {
            class: "loader"
          }, [vue.createElementVNode("svg", {
            class: "circle-outer",
            viewBox: "0 0 86 86"
          }, [vue.createElementVNode("circle", {
            class: "back",
            cx: "43",
            cy: "43",
            r: "40"
          }), vue.createElementVNode("circle", {
            class: "front",
            cx: "43",
            cy: "43",
            r: "40"
          }), vue.createElementVNode("circle", {
            class: "new",
            cx: "43",
            cy: "43",
            r: "40"
          })]), vue.createElementVNode("svg", {
            class: "circle-middle",
            viewBox: "0 0 60 60"
          }, [vue.createElementVNode("circle", {
            class: "back",
            cx: "30",
            cy: "30",
            r: "27"
          }), vue.createElementVNode("circle", {
            class: "front",
            cx: "30",
            cy: "30",
            r: "27"
          })]), vue.createElementVNode("svg", {
            class: "circle-inner",
            viewBox: "0 0 34 34"
          }, [vue.createElementVNode("circle", {
            class: "back",
            cx: "17",
            cy: "17",
            r: "14"
          }), vue.createElementVNode("circle", {
            class: "front",
            cx: "17",
            cy: "17",
            r: "14"
          })])], -1))]),
          key: "0"
        } : void 0]), 1032, ["status", "title"]), vue.createVNode(_component_a_button, {
          onClick: saveDefault
        }, {
          default: vue.withCtx(() => [..._cache[3] || (_cache[3] = [vue.createTextVNode("保存为默认规则", -1)])]),
          _: 1
        }), vue.createVNode(_sfc_main$6, {
          onPrev: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("prev")),
          onNext: main2,
          next: {
            disabled: !vue.unref(fileBlob)
          },
          nextLabel: "重试"
        }, null, 8, ["next"])]);
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
  const StepAudio = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-196f6236"]]);
  const _hoisted_1$3 = {
    className: "custom-checkbox-card-title"
  };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "cover",
    emits: ["next", "prev"],
    setup(__props, {
      emit: __emit
    }) {
      const emits = __emit;
      const covers = vue.reactive([]);
      const cover = vue.ref([]);
      vue.onMounted(() => {
        var _a, _b, _c, _d, _e;
        covers.push({
          label: "视频封面",
          url: (_a = fromData.videoData) == null ? void 0 : _a.pic
        });
        if (fromData.data) {
          covers.push({
            label: "音乐封面",
            url: (_b = fromData.data) == null ? void 0 : _b.mv_cover
          });
        }
        covers.push({
          label: "Up主头像",
          url: (_c = fromData.videoData) == null ? void 0 : _c.owner.face
        });
        const url = (_d = covers == null ? void 0 : covers[0]) == null ? void 0 : _d.url;
        if (fromData.usedefaultconfig) {
          const defaultRule = _GM_getValue("default_rule");
          const coverLabel = defaultRule == null ? void 0 : defaultRule.cover;
          const coverItem = covers.find((item) => item.label === coverLabel);
          if (coverItem && coverItem.url) {
            fromData.coverUrl = coverItem.url;
            cover.value = [coverItem.url];
            coverRecord.label = coverItem.label;
            next();
            return;
          }
        }
        if (url) {
          fromData.coverUrl = url.toString();
          cover.value = [url];
          coverRecord.label = (_e = covers == null ? void 0 : covers[0]) == null ? void 0 : _e.label;
        }
      });
      const coverRecord = {
        label: void 0
      };
      function next() {
        fromData.record.cover = coverRecord.label;
        emits("next");
      }
      const onChange = (v) => {
        var _a;
        const val = v.pop();
        if (val) {
          fromData.coverUrl = val.toString();
          cover.value = [val.toString()];
          coverRecord.label = (_a = covers.find((item) => item.url === val.toString())) == null ? void 0 : _a.label;
        } else {
          fromData.coverUrl = null;
          cover.value = [];
          coverRecord.label = void 0;
        }
      };
      return (_ctx, _cache) => {
        const _component_a_image = webVue.Image;
        const _component_a_space = webVue.Space;
        const _component_a_checkbox = webVue.Checkbox;
        const _component_a_checkbox_group = webVue.CheckboxGroup;
        const _component_a_form = webVue.Form;
        return vue.openBlock(), vue.createBlock(_component_a_form, {
          "auto-label-width": "",
          model: {}
        }, {
          default: vue.withCtx(() => [vue.createVNode(_component_a_checkbox_group, {
            "model-value": vue.unref(cover),
            onChange
          }, {
            default: vue.withCtx(() => [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(covers, (item) => {
              return vue.openBlock(), vue.createBlock(_component_a_checkbox, {
                key: item.label,
                value: item.url
              }, {
                checkbox: vue.withCtx(({
                  checked
                }) => [vue.createVNode(_component_a_space, {
                  align: "start",
                  class: vue.normalizeClass(["custom-checkbox-card", {
                    "custom-checkbox-card-checked": checked
                  }])
                }, {
                  default: vue.withCtx(() => [_cache[1] || (_cache[1] = vue.createElementVNode("div", {
                    className: "custom-checkbox-card-mask"
                  }, [vue.createElementVNode("div", {
                    className: "custom-checkbox-card-mask-dot"
                  })], -1)), vue.createElementVNode("div", null, [vue.createElementVNode("div", _hoisted_1$3, vue.toDisplayString(item.label), 1), vue.createVNode(_component_a_image, {
                    width: "80",
                    src: item.url,
                    preview: false
                  }, null, 8, ["src"])])]),
                  _: 2
                }, 1032, ["class"])]),
                _: 2
              }, 1032, ["value"]);
            }), 128))]),
            _: 1
          }, 8, ["model-value"]), vue.createVNode(_sfc_main$6, {
            onNext: next,
            onPrev: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("prev"))
          })]),
          _: 1
        });
      };
    }
  });
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "info",
    emits: ["next", "prev"],
    setup(__props, {
      emit: __emit
    }) {
      const emits = __emit;
      const invalidFileNameRegex = /[<>:"/\\|?*]/g;
      const infoMaps = vue.computed(() => {
        var _a, _b, _c, _d, _e;
        return [((_a = fromData.videoData) == null ? void 0 : _a.title) || "", ((_b = fromData.videoData) == null ? void 0 : _b.desc) || "", ((_c = fromData.videoData) == null ? void 0 : _c.owner.name) || "", ((_d = fromData.data) == null ? void 0 : _d.music_title) || "", ((_e = fromData.data) == null ? void 0 : _e.origin_artist) || ""];
      });
      const titleSelects = fromData.data ? ["4-3", "4-5", "1-3", "4", "1"] : ["1-3", "1"];
      const authorSelects = fromData.data ? ["3(原:5)", "3-5", "3", "5"] : ["3"];
      const fileSelects = fromData.data ? ["4-3", "4-5", "1-3", "4", "1"] : ["1-3", "1"];
      const infoRecord = {
        title: "",
        author: "",
        file: ""
      };
      function next() {
        fromData.record.format = infoRecord;
        emits("next");
      }
      const handleSelect = (type, format) => {
        _GM_setValue(`${type}-format${!fromData.data ? "_no_music" : ""}`, format);
        infoRecord[type] = format;
        const maps = infoMaps.value;
        return format.replaceAll("1", maps[0]).replaceAll("2", maps[1]).replaceAll("3", maps[2]).replaceAll("4", maps[3]).replaceAll("5", maps[4]);
      };
      const handleTitleSelect = (value) => {
        if (!value || typeof value != "string")
          return;
        fromData.title = handleSelect("title", value);
      };
      const handleAuthorSelect = (value) => {
        if (!value || typeof value != "string")
          return;
        fromData.author = handleSelect("author", value);
      };
      const handleFileSelect = (value) => {
        if (!value || typeof value != "string")
          return;
        const title = handleSelect("file", value);
        fromData.file = `${title.replaceAll(invalidFileNameRegex, "")}.m4a`;
      };
      vue.onMounted(() => {
        const noMusic = !fromData.data ? "_no_music" : "";
        if (fromData.usedefaultconfig) {
          const defaultRule = _GM_getValue("default_rule");
          const format = defaultRule == null ? void 0 : defaultRule.format;
          if (format) {
            handleTitleSelect(format.title in titleSelects ? format.title : titleSelects[0]);
            handleAuthorSelect(format.author in authorSelects ? format.author : authorSelects[0]);
            handleFileSelect(format.file in fileSelects ? format.file : fileSelects[0]);
            next();
            return;
          }
        }
        const titleFormat = _GM_getValue(`title-format${noMusic}`, titleSelects[0]);
        const authorFormat = _GM_getValue(`author-format${noMusic}`, authorSelects[0]);
        const fileFormat = _GM_getValue(`file-format${noMusic}`, fileSelects[0]);
        handleTitleSelect(titleFormat);
        handleAuthorSelect(authorFormat);
        handleFileSelect(fileFormat);
      });
      return (_ctx, _cache) => {
        const _component_a_input = webVue.Input;
        const _component_a_form_item = webVue.FormItem;
        const _component_a_textarea = webVue.Textarea;
        const _component_icon_settings = IconSettings;
        const _component_a_button = webVue.Button;
        const _component_a_doption = webVue.Doption;
        const _component_a_dropdown = webVue.Dropdown;
        const _component_a_form = webVue.Form;
        return vue.openBlock(), vue.createBlock(_component_a_form, {
          "auto-label-width": "",
          model: {}
        }, {
          default: vue.withCtx(() => [vue.unref(fromData).videoData ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
            key: 0
          }, [vue.createVNode(_component_a_form_item, {
            label: "标题(1)"
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_input, {
              modelValue: vue.unref(fromData).videoData.title,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(fromData).videoData.title = $event)
            }, null, 8, ["modelValue"])]),
            _: 1
          }), vue.createVNode(_component_a_form_item, {
            label: "简介(2)"
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_textarea, {
              modelValue: vue.unref(fromData).videoData.desc,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(fromData).videoData.desc = $event),
              "auto-size": {
                minRows: 1,
                maxRows: 3
              }
            }, null, 8, ["modelValue"])]),
            _: 1
          }), vue.createVNode(_component_a_form_item, {
            label: "Up主(3)"
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_input, {
              modelValue: vue.unref(fromData).videoData.owner.name,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(fromData).videoData.owner.name = $event)
            }, null, 8, ["modelValue"])]),
            _: 1
          })], 64)) : vue.createCommentVNode("", true), vue.unref(fromData).data ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
            key: 1
          }, [vue.createVNode(_component_a_form_item, {
            label: "音乐名(4)"
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_input, {
              modelValue: vue.unref(fromData).data.music_title,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(fromData).data.music_title = $event)
            }, null, 8, ["modelValue"])]),
            _: 1
          }), vue.createVNode(_component_a_form_item, {
            label: "原唱(5)"
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_input, {
              modelValue: vue.unref(fromData).data.origin_artist,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(fromData).data.origin_artist = $event)
            }, null, 8, ["modelValue"])]),
            _: 1
          })], 64)) : vue.createCommentVNode("", true), vue.createVNode(_component_a_form_item, {
            label: "内嵌标题"
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_input, {
              modelValue: vue.unref(fromData).title,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(fromData).title = $event)
            }, null, 8, ["modelValue"]), vue.createVNode(_component_a_dropdown, {
              onSelect: handleTitleSelect
            }, {
              content: vue.withCtx(() => [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(titleSelects), (item) => {
                return vue.openBlock(), vue.createBlock(_component_a_doption, {
                  key: item
                }, {
                  default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(item), 1)]),
                  _: 2
                }, 1024);
              }), 128))]),
              default: vue.withCtx(() => [vue.createVNode(_component_a_button, {
                type: "primary"
              }, {
                icon: vue.withCtx(() => [vue.createVNode(_component_icon_settings)]),
                _: 1
              })]),
              _: 1
            })]),
            _: 1
          }), vue.createVNode(_component_a_form_item, {
            label: "内嵌作者"
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_input, {
              modelValue: vue.unref(fromData).author,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(fromData).author = $event)
            }, null, 8, ["modelValue"]), vue.createVNode(_component_a_dropdown, {
              onSelect: handleAuthorSelect
            }, {
              content: vue.withCtx(() => [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(authorSelects), (item) => {
                return vue.openBlock(), vue.createBlock(_component_a_doption, {
                  key: item
                }, {
                  default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(item), 1)]),
                  _: 2
                }, 1024);
              }), 128))]),
              default: vue.withCtx(() => [vue.createVNode(_component_a_button, {
                type: "primary"
              }, {
                icon: vue.withCtx(() => [vue.createVNode(_component_icon_settings)]),
                _: 1
              })]),
              _: 1
            })]),
            _: 1
          }), vue.createVNode(_component_a_form_item, {
            label: "下载文件名"
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_input, {
              modelValue: vue.unref(fromData).file,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vue.unref(fromData).file = $event)
            }, null, 8, ["modelValue"]), vue.createVNode(_component_a_dropdown, {
              onSelect: handleFileSelect
            }, {
              content: vue.withCtx(() => [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(fileSelects), (item) => {
                return vue.openBlock(), vue.createBlock(_component_a_doption, {
                  key: item
                }, {
                  default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(item), 1)]),
                  _: 2
                }, 1024);
              }), 128))]),
              default: vue.withCtx(() => [vue.createVNode(_component_a_button, {
                type: "primary"
              }, {
                icon: vue.withCtx(() => [vue.createVNode(_component_icon_settings)]),
                _: 1
              })]),
              _: 1
            })]),
            _: 1
          }), vue.createVNode(_sfc_main$6, {
            onNext: next,
            onPrev: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("prev"))
          })]),
          _: 1
        });
      };
    }
  });
  const _hoisted_1$2 = {
    class: "montage-container"
  };
  const _hoisted_2$2 = {
    style: {
      "margin-bottom": "12px",
      "display": "flex",
      "align-items": "center",
      "gap": "8px"
    }
  };
  const _hoisted_3$2 = ["value"];
  const _hoisted_4$1 = {
    class: "control-buttons"
  };
  const _hoisted_5$1 = {
    class: "timeline-inner"
  };
  const _hoisted_6$1 = {
    style: {
      "margin-right": "10px"
    }
  };
  const _hoisted_7$1 = ["onClick"];
  const _hoisted_8$1 = ["onClick"];
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "clip",
    emits: ["next"],
    setup(__props, {
      emit: __emit
    }) {
      let video = null;
      let ratechangeHandler = null;
      const currentTime = vue.ref(0);
      const duration = vue.ref(0);
      const deletedSections = vue.ref([]);
      const isRecording = vue.ref(false);
      const tempStart = vue.ref(0);
      const isAuditioning = vue.ref(false);
      const isPlaying = vue.ref(false);
      const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
      const selectedSpeed = vue.ref(1);
      const isDragging = vue.ref(false);
      const hoverTime = vue.ref(null);
      const tooltipStyle = vue.ref({
        left: "0px",
        display: "none"
      });
      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      };
      const calculateTimeFromEvent = (event, element) => {
        const rect = element.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        return offsetX / rect.width * duration.value;
      };
      const handleTimelineMouseMove = (event) => {
        const timeline = event.currentTarget;
        const time = calculateTimeFromEvent(event, timeline);
        hoverTime.value = time;
        tooltipStyle.value = {
          left: `${event.clientX}px`,
          display: "block"
        };
        if (isDragging.value && video) {
          video.currentTime = time;
        }
      };
      const handleTimelineMouseLeave = () => {
        if (!isDragging.value) {
          hoverTime.value = null;
          tooltipStyle.value.display = "none";
        }
      };
      const handleTimelineMouseDown = (event) => {
        isDragging.value = true;
        document.addEventListener("mousemove", handleDocumentMouseMove);
        document.addEventListener("mouseup", handleDocumentMouseUp);
      };
      const handleDocumentMouseMove = (event) => {
        if (isDragging.value) {
          const timeline = document.querySelector(".timeline");
          if (timeline) {
            handleTimelineMouseMove({
              ...event,
              currentTarget: timeline
            });
          }
        }
      };
      const handleDocumentMouseUp = () => {
        isDragging.value = false;
        hoverTime.value = null;
        tooltipStyle.value.display = "none";
        document.removeEventListener("mousemove", handleDocumentMouseMove);
        document.removeEventListener("mouseup", handleDocumentMouseUp);
      };
      const updateTime = () => {
        currentTime.value = (video == null ? void 0 : video.currentTime) ?? 0;
        duration.value = (video == null ? void 0 : video.duration) ?? 0;
      };
      const startFromCurrent = () => {
        deletedSections.value.push({
          start: currentTime.value,
          end: duration.value,
          id: Date.now()
        });
        sortSections();
        mergeSections();
      };
      const endAtCurrent = () => {
        deletedSections.value.push({
          start: 0,
          end: currentTime.value,
          id: Date.now()
        });
        sortSections();
        mergeSections();
      };
      const startRecording = () => {
        isRecording.value = true;
        tempStart.value = currentTime.value;
      };
      const endRecording = () => {
        if (currentTime.value === tempStart.value) {
          isRecording.value = false;
          return;
        }
        if (isRecording.value) {
          deletedSections.value.push({
            start: tempStart.value,
            end: currentTime.value,
            id: Date.now()
          });
          isRecording.value = false;
          sortSections();
          mergeSections();
        }
      };
      const removeSection = (id) => {
        deletedSections.value = deletedSections.value.filter((section) => section.id !== id);
      };
      const sortSections = () => {
        deletedSections.value.sort((a, b) => a.start - b.start);
      };
      const mergeSections = () => {
        if (deletedSections.value.length <= 1)
          return;
        const merged = [];
        let current = {
          ...deletedSections.value[0]
        };
        for (let i = 1; i < deletedSections.value.length; i++) {
          const section = deletedSections.value[i];
          if (section.start <= current.end) {
            current.end = Math.max(current.end, section.end);
          } else {
            merged.push(current);
            current = {
              ...section
            };
          }
        }
        merged.push(current);
        deletedSections.value = merged;
      };
      function seekTo(time) {
        if (video) {
          video.currentTime = time;
        }
      }
      const tempSection = vue.computed(() => {
        if (!isRecording.value)
          return null;
        return {
          start: tempStart.value,
          end: currentTime.value
        };
      });
      const startAudition = () => {
        if (isAuditioning.value) {
          if (video) {
            video.pause();
            isAuditioning.value = false;
          }
        } else {
          isAuditioning.value = true;
          if (video) {
            video.currentTime = 0;
            video.play().catch((error) => {
              console.error("视频播放失败:", error);
              isAuditioning.value = false;
            });
          }
        }
      };
      const handleTimeUpdate = () => {
        if (!video)
          return;
        updateTime();
        if (isAuditioning.value) {
          const currentVideoTime = video.currentTime;
          for (const section of deletedSections.value) {
            if (currentVideoTime >= section.start && currentVideoTime < section.end) {
              video.currentTime = section.end;
              break;
            }
          }
        }
      };
      const togglePlay = () => {
        if (!video)
          return;
        if (isPlaying.value) {
          video.pause();
        } else {
          video.play().catch((error) => {
            console.error("视频播放失败:", error);
          });
        }
      };
      const handlePlay = () => {
        isPlaying.value = true;
      };
      const handlePause = () => {
        isPlaying.value = false;
      };
      const handleEnded = () => {
        isAuditioning.value = false;
      };
      vue.onMounted(() => {
        video = document.querySelector(`.bpx-player-video-wrap video`);
        if (video) {
          video.addEventListener("timeupdate", handleTimeUpdate);
          video.addEventListener("ended", handleEnded);
          video.addEventListener("play", handlePlay);
          video.addEventListener("pause", handlePause);
          currentTime.value = video.currentTime;
          duration.value = video.duration;
          selectedSpeed.value = video.playbackRate || 1;
          fromData.speed = selectedSpeed.value;
          ratechangeHandler = () => {
            selectedSpeed.value = (video == null ? void 0 : video.playbackRate) ?? selectedSpeed.value;
            fromData.speed = selectedSpeed.value;
          };
          video.addEventListener("ratechange", ratechangeHandler);
        }
        if (fromData.usedefaultconfig) {
          next();
        }
      });
      vue.onUnmounted(() => {
        if (video) {
          video.removeEventListener("timeupdate", handleTimeUpdate);
          video.removeEventListener("ended", handleEnded);
          video.removeEventListener("play", handlePlay);
          video.removeEventListener("pause", handlePause);
          if (ratechangeHandler)
            video.removeEventListener("ratechange", ratechangeHandler);
        }
        document.removeEventListener("mousemove", handleDocumentMouseMove);
        document.removeEventListener("mouseup", handleDocumentMouseUp);
      });
      vue.watch(selectedSpeed, (val) => {
        if (video)
          video.playbackRate = val;
        fromData.speed = val;
      });
      const handleTimelineClick = (event) => {
        const timeline = event.currentTarget;
        const rect = timeline.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const percentage = offsetX / rect.width;
        const newTime = percentage * duration.value;
        if (video) {
          video.currentTime = newTime;
        }
      };
      const emits = __emit;
      function next() {
        fromData.clipRanges = deletedSections.value.map((section) => [Math.round(section.start * 1e3), Math.round(section.end * 1e3)]);
        fromData.speed = selectedSpeed.value;
        emits("next");
      }
      return (_ctx, _cache) => {
        const _component_a_button = webVue.Button;
        const _component_icon_play_circle_fill = IconPlayCircleFill;
        const _component_icon_pause_circle_fill = IconPauseCircleFill;
        const _component_icon_close = IconClose;
        const _component_a_list_item = webVue.ListItem;
        const _component_a_list = webVue.List;
        const _component_a_spin = webVue.Spin;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [vue.createVNode(_component_a_spin, {
          loading: isAuditioning.value
        }, {
          default: vue.withCtx(() => [vue.createElementVNode("div", _hoisted_2$2, [_cache[1] || (_cache[1] = vue.createElementVNode("label", {
            style: {
              "font-size": "13px"
            }
          }, "倍速：", -1)), vue.withDirectives(vue.createElementVNode("select", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedSpeed.value = $event)
          }, [(vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(speedOptions, (s) => {
            return vue.createElementVNode("option", {
              key: s,
              value: s
            }, vue.toDisplayString(s) + "x", 9, _hoisted_3$2);
          }), 64))], 512), [[vue.vModelSelect, selectedSpeed.value, void 0, {
            number: true
          }]])]), vue.createElementVNode("div", _hoisted_4$1, [vue.createElementVNode("div", null, [vue.createVNode(_component_a_button, {
            onClick: endAtCurrent
          }, {
            default: vue.withCtx(() => [..._cache[2] || (_cache[2] = [vue.createTextVNode("从这开头", -1)])]),
            _: 1
          }), vue.createVNode(_component_a_button, {
            onClick: startFromCurrent
          }, {
            default: vue.withCtx(() => [..._cache[3] || (_cache[3] = [vue.createTextVNode("从这结尾", -1)])]),
            _: 1
          })]), vue.createElementVNode("div", null, [vue.createVNode(_component_a_button, {
            type: "primary",
            onClick: startRecording,
            disabled: isRecording.value
          }, {
            icon: vue.withCtx(() => [!isPlaying.value ? (vue.openBlock(), vue.createBlock(_component_icon_play_circle_fill, {
              key: 0
            })) : (vue.openBlock(), vue.createBlock(_component_icon_pause_circle_fill, {
              key: 1
            }))]),
            default: vue.withCtx(() => [_cache[4] || (_cache[4] = vue.createTextVNode(" 开始记录 ", -1))]),
            _: 1
          }, 8, ["disabled"]), vue.createVNode(_component_a_button, {
            onClick: togglePlay
          }, {
            icon: vue.withCtx(() => [!isPlaying.value ? (vue.openBlock(), vue.createBlock(_component_icon_play_circle_fill, {
              key: 0
            })) : (vue.openBlock(), vue.createBlock(_component_icon_pause_circle_fill, {
              key: 1
            }))]),
            _: 1
          }), vue.createVNode(_component_a_button, {
            onClick: endRecording,
            disabled: !isRecording.value,
            type: "primary"
          }, {
            icon: vue.withCtx(() => [!isPlaying.value ? (vue.openBlock(), vue.createBlock(_component_icon_play_circle_fill, {
              key: 0
            })) : (vue.openBlock(), vue.createBlock(_component_icon_pause_circle_fill, {
              key: 1
            }))]),
            default: vue.withCtx(() => [_cache[5] || (_cache[5] = vue.createTextVNode(" 结束记录 ", -1))]),
            _: 1
          }, 8, ["disabled"])])]), duration.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "timeline",
            onMousemove: handleTimelineMouseMove,
            onMouseleave: handleTimelineMouseLeave,
            onMousedown: handleTimelineMouseDown,
            onClick: handleTimelineClick
          }, [vue.createElementVNode("div", _hoisted_5$1, [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(deletedSections.value, (section) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              key: section.id,
              class: "deleted-segment",
              style: vue.normalizeStyle({
                left: `${section.start / duration.value * 100}%`,
                width: `${(section.end - section.start) / duration.value * 100}%`
              })
            }, null, 4);
          }), 128)), tempSection.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "recording-segment",
            style: vue.normalizeStyle({
              left: `${tempSection.value.start / duration.value * 100}%`,
              width: `${(tempSection.value.end - tempSection.value.start) / duration.value * 100}%`
            })
          }, null, 4)) : vue.createCommentVNode("", true)]), vue.createElementVNode("div", {
            class: "current-time-marker",
            style: vue.normalizeStyle({
              left: `${currentTime.value / duration.value * 100}%`
            })
          }, null, 4), hoverTime.value !== null ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "time-tooltip",
            style: vue.normalizeStyle(tooltipStyle.value)
          }, vue.toDisplayString(formatTime(hoverTime.value)), 5)) : vue.createCommentVNode("", true)], 32)) : vue.createCommentVNode("", true), vue.createVNode(_component_a_list, {
            "max-height": 200
          }, {
            default: vue.withCtx(() => [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(deletedSections.value, (section) => {
              return vue.openBlock(), vue.createBlock(_component_a_list_item, {
                key: section.id
              }, {
                default: vue.withCtx(() => [vue.createElementVNode("span", _hoisted_6$1, [vue.createElementVNode("a", {
                  onClick: ($event) => seekTo(section.start)
                }, vue.toDisplayString(section.start.toFixed(2)) + "s", 9, _hoisted_7$1), _cache[6] || (_cache[6] = vue.createTextVNode(" - ", -1)), vue.createElementVNode("a", {
                  onClick: ($event) => seekTo(section.end)
                }, vue.toDisplayString(section.end.toFixed(2)) + "s", 9, _hoisted_8$1)]), vue.createVNode(_component_a_button, {
                  status: "danger",
                  onClick: ($event) => removeSection(section.id)
                }, {
                  icon: vue.withCtx(() => [vue.createVNode(_component_icon_close)]),
                  _: 1
                }, 8, ["onClick"])]),
                _: 2
              }, 1024);
            }), 128))]),
            _: 1
          })]),
          _: 1
        }, 8, ["loading"]), vue.createVNode(_sfc_main$6, {
          prevLabel: !isAuditioning.value ? "试听" : "暂停",
          onNext: next,
          onPrev: startAudition
        }, null, 8, ["prevLabel"])]);
      };
    }
  });
  const StepMontage = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-d8965dd9"]]);
  async function callOpenAI(prompt) {
    const {
      host,
      key,
      modal
    } = userConfig.openai;
    try {
      const response = await fetch(`${host}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          model: modal,
          messages: prompt,
          temperature: 0.7
        })
      });
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      webVue.Message.error(`AI 处理失败: ${error.message}`);
      return null;
    }
  }
  function Diff() {
  }
  Diff.prototype = {
    diff: function diff(oldString, newString) {
      var _options$timeout;
      var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var callback = options.callback;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      var self2 = this;
      function done(value) {
        value = self2.postProcess(value, options);
        if (callback) {
          setTimeout(function() {
            callback(value);
          }, 0);
          return true;
        } else {
          return value;
        }
      }
      oldString = this.castInput(oldString, options);
      newString = this.castInput(newString, options);
      oldString = this.removeEmpty(this.tokenize(oldString, options));
      newString = this.removeEmpty(this.tokenize(newString, options));
      var newLen = newString.length, oldLen = oldString.length;
      var editLength = 1;
      var maxEditLength = newLen + oldLen;
      if (options.maxEditLength != null) {
        maxEditLength = Math.min(maxEditLength, options.maxEditLength);
      }
      var maxExecutionTime = (_options$timeout = options.timeout) !== null && _options$timeout !== void 0 ? _options$timeout : Infinity;
      var abortAfterTimestamp = Date.now() + maxExecutionTime;
      var bestPath = [{
        oldPos: -1,
        lastComponent: void 0
      }];
      var newPos = this.extractCommon(bestPath[0], newString, oldString, 0, options);
      if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
        return done(buildValues(self2, bestPath[0].lastComponent, newString, oldString, self2.useLongestToken));
      }
      var minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
      function execEditLength() {
        for (var diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
          var basePath = void 0;
          var removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
          if (removePath) {
            bestPath[diagonalPath - 1] = void 0;
          }
          var canAdd = false;
          if (addPath) {
            var addPathNewPos = addPath.oldPos - diagonalPath;
            canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
          }
          var canRemove = removePath && removePath.oldPos + 1 < oldLen;
          if (!canAdd && !canRemove) {
            bestPath[diagonalPath] = void 0;
            continue;
          }
          if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos) {
            basePath = self2.addToPath(addPath, true, false, 0, options);
          } else {
            basePath = self2.addToPath(removePath, false, true, 1, options);
          }
          newPos = self2.extractCommon(basePath, newString, oldString, diagonalPath, options);
          if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
            return done(buildValues(self2, basePath.lastComponent, newString, oldString, self2.useLongestToken));
          } else {
            bestPath[diagonalPath] = basePath;
            if (basePath.oldPos + 1 >= oldLen) {
              maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
            }
            if (newPos + 1 >= newLen) {
              minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
            }
          }
        }
        editLength++;
      }
      if (callback) {
        (function exec() {
          setTimeout(function() {
            if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
              return callback();
            }
            if (!execEditLength()) {
              exec();
            }
          }, 0);
        })();
      } else {
        while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
          var ret = execEditLength();
          if (ret) {
            return ret;
          }
        }
      }
    },
    addToPath: function addToPath(path, added, removed, oldPosInc, options) {
      var last = path.lastComponent;
      if (last && !options.oneChangePerToken && last.added === added && last.removed === removed) {
        return {
          oldPos: path.oldPos + oldPosInc,
          lastComponent: {
            count: last.count + 1,
            added,
            removed,
            previousComponent: last.previousComponent
          }
        };
      } else {
        return {
          oldPos: path.oldPos + oldPosInc,
          lastComponent: {
            count: 1,
            added,
            removed,
            previousComponent: last
          }
        };
      }
    },
    extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath, options) {
      var newLen = newString.length, oldLen = oldString.length, oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldString[oldPos + 1], newString[newPos + 1], options)) {
        newPos++;
        oldPos++;
        commonCount++;
        if (options.oneChangePerToken) {
          basePath.lastComponent = {
            count: 1,
            previousComponent: basePath.lastComponent,
            added: false,
            removed: false
          };
        }
      }
      if (commonCount && !options.oneChangePerToken) {
        basePath.lastComponent = {
          count: commonCount,
          previousComponent: basePath.lastComponent,
          added: false,
          removed: false
        };
      }
      basePath.oldPos = oldPos;
      return newPos;
    },
    equals: function equals(left, right, options) {
      if (options.comparator) {
        return options.comparator(left, right);
      } else {
        return left === right || options.ignoreCase && left.toLowerCase() === right.toLowerCase();
      }
    },
    removeEmpty: function removeEmpty(array) {
      var ret = [];
      for (var i = 0; i < array.length; i++) {
        if (array[i]) {
          ret.push(array[i]);
        }
      }
      return ret;
    },
    castInput: function castInput(value) {
      return value;
    },
    tokenize: function tokenize(value) {
      return Array.from(value);
    },
    join: function join(chars) {
      return chars.join("");
    },
    postProcess: function postProcess(changeObjects) {
      return changeObjects;
    }
  };
  function buildValues(diff2, lastComponent, newString, oldString, useLongestToken) {
    var components = [];
    var nextComponent;
    while (lastComponent) {
      components.push(lastComponent);
      nextComponent = lastComponent.previousComponent;
      delete lastComponent.previousComponent;
      lastComponent = nextComponent;
    }
    components.reverse();
    var componentPos = 0, componentLen = components.length, newPos = 0, oldPos = 0;
    for (; componentPos < componentLen; componentPos++) {
      var component = components[componentPos];
      if (!component.removed) {
        if (!component.added && useLongestToken) {
          var value = newString.slice(newPos, newPos + component.count);
          value = value.map(function(value2, i) {
            var oldValue = oldString[oldPos + i];
            return oldValue.length > value2.length ? oldValue : value2;
          });
          component.value = diff2.join(value);
        } else {
          component.value = diff2.join(newString.slice(newPos, newPos + component.count));
        }
        newPos += component.count;
        if (!component.added) {
          oldPos += component.count;
        }
      } else {
        component.value = diff2.join(oldString.slice(oldPos, oldPos + component.count));
        oldPos += component.count;
      }
    }
    return components;
  }
  var characterDiff = new Diff();
  function diffChars(oldStr, newStr, options) {
    return characterDiff.diff(oldStr, newStr, options);
  }
  function longestCommonPrefix(str1, str2) {
    var i;
    for (i = 0; i < str1.length && i < str2.length; i++) {
      if (str1[i] != str2[i]) {
        return str1.slice(0, i);
      }
    }
    return str1.slice(0, i);
  }
  function longestCommonSuffix(str1, str2) {
    var i;
    if (!str1 || !str2 || str1[str1.length - 1] != str2[str2.length - 1]) {
      return "";
    }
    for (i = 0; i < str1.length && i < str2.length; i++) {
      if (str1[str1.length - (i + 1)] != str2[str2.length - (i + 1)]) {
        return str1.slice(-i);
      }
    }
    return str1.slice(-i);
  }
  function replacePrefix(string, oldPrefix, newPrefix) {
    if (string.slice(0, oldPrefix.length) != oldPrefix) {
      throw Error("string ".concat(JSON.stringify(string), " doesn't start with prefix ").concat(JSON.stringify(oldPrefix), "; this is a bug"));
    }
    return newPrefix + string.slice(oldPrefix.length);
  }
  function replaceSuffix(string, oldSuffix, newSuffix) {
    if (!oldSuffix) {
      return string + newSuffix;
    }
    if (string.slice(-oldSuffix.length) != oldSuffix) {
      throw Error("string ".concat(JSON.stringify(string), " doesn't end with suffix ").concat(JSON.stringify(oldSuffix), "; this is a bug"));
    }
    return string.slice(0, -oldSuffix.length) + newSuffix;
  }
  function removePrefix(string, oldPrefix) {
    return replacePrefix(string, oldPrefix, "");
  }
  function removeSuffix(string, oldSuffix) {
    return replaceSuffix(string, oldSuffix, "");
  }
  function maximumOverlap(string1, string2) {
    return string2.slice(0, overlapCount(string1, string2));
  }
  function overlapCount(a, b) {
    var startA = 0;
    if (a.length > b.length) {
      startA = a.length - b.length;
    }
    var endB = b.length;
    if (a.length < b.length) {
      endB = a.length;
    }
    var map = Array(endB);
    var k = 0;
    map[0] = 0;
    for (var j = 1; j < endB; j++) {
      if (b[j] == b[k]) {
        map[j] = map[k];
      } else {
        map[j] = k;
      }
      while (k > 0 && b[j] != b[k]) {
        k = map[k];
      }
      if (b[j] == b[k]) {
        k++;
      }
    }
    k = 0;
    for (var i = startA; i < a.length; i++) {
      while (k > 0 && a[i] != b[k]) {
        k = map[k];
      }
      if (a[i] == b[k]) {
        k++;
      }
    }
    return k;
  }
  var extendedWordChars = "a-zA-Z0-9_\\u{C0}-\\u{FF}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}";
  var tokenizeIncludingWhitespace = new RegExp("[".concat(extendedWordChars, "]+|\\s+|[^").concat(extendedWordChars, "]"), "ug");
  var wordDiff = new Diff();
  wordDiff.equals = function(left, right, options) {
    if (options.ignoreCase) {
      left = left.toLowerCase();
      right = right.toLowerCase();
    }
    return left.trim() === right.trim();
  };
  wordDiff.tokenize = function(value) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var parts;
    if (options.intlSegmenter) {
      if (options.intlSegmenter.resolvedOptions().granularity != "word") {
        throw new Error('The segmenter passed must have a granularity of "word"');
      }
      parts = Array.from(options.intlSegmenter.segment(value), function(segment) {
        return segment.segment;
      });
    } else {
      parts = value.match(tokenizeIncludingWhitespace) || [];
    }
    var tokens = [];
    var prevPart = null;
    parts.forEach(function(part) {
      if (/\s/.test(part)) {
        if (prevPart == null) {
          tokens.push(part);
        } else {
          tokens.push(tokens.pop() + part);
        }
      } else if (/\s/.test(prevPart)) {
        if (tokens[tokens.length - 1] == prevPart) {
          tokens.push(tokens.pop() + part);
        } else {
          tokens.push(prevPart + part);
        }
      } else {
        tokens.push(part);
      }
      prevPart = part;
    });
    return tokens;
  };
  wordDiff.join = function(tokens) {
    return tokens.map(function(token, i) {
      if (i == 0) {
        return token;
      } else {
        return token.replace(/^\s+/, "");
      }
    }).join("");
  };
  wordDiff.postProcess = function(changes, options) {
    if (!changes || options.oneChangePerToken) {
      return changes;
    }
    var lastKeep = null;
    var insertion = null;
    var deletion = null;
    changes.forEach(function(change) {
      if (change.added) {
        insertion = change;
      } else if (change.removed) {
        deletion = change;
      } else {
        if (insertion || deletion) {
          dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, change);
        }
        lastKeep = change;
        insertion = null;
        deletion = null;
      }
    });
    if (insertion || deletion) {
      dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, null);
    }
    return changes;
  };
  function diffWords(oldStr, newStr, options) {
    if ((options === null || options === void 0 ? void 0 : options.ignoreWhitespace) != null && !options.ignoreWhitespace) {
      return diffWordsWithSpace(oldStr, newStr, options);
    }
    return wordDiff.diff(oldStr, newStr, options);
  }
  function dedupeWhitespaceInChangeObjects(startKeep, deletion, insertion, endKeep) {
    if (deletion && insertion) {
      var oldWsPrefix = deletion.value.match(/^\s*/)[0];
      var oldWsSuffix = deletion.value.match(/\s*$/)[0];
      var newWsPrefix = insertion.value.match(/^\s*/)[0];
      var newWsSuffix = insertion.value.match(/\s*$/)[0];
      if (startKeep) {
        var commonWsPrefix = longestCommonPrefix(oldWsPrefix, newWsPrefix);
        startKeep.value = replaceSuffix(startKeep.value, newWsPrefix, commonWsPrefix);
        deletion.value = removePrefix(deletion.value, commonWsPrefix);
        insertion.value = removePrefix(insertion.value, commonWsPrefix);
      }
      if (endKeep) {
        var commonWsSuffix = longestCommonSuffix(oldWsSuffix, newWsSuffix);
        endKeep.value = replacePrefix(endKeep.value, newWsSuffix, commonWsSuffix);
        deletion.value = removeSuffix(deletion.value, commonWsSuffix);
        insertion.value = removeSuffix(insertion.value, commonWsSuffix);
      }
    } else if (insertion) {
      if (startKeep) {
        insertion.value = insertion.value.replace(/^\s*/, "");
      }
      if (endKeep) {
        endKeep.value = endKeep.value.replace(/^\s*/, "");
      }
    } else if (startKeep && endKeep) {
      var newWsFull = endKeep.value.match(/^\s*/)[0], delWsStart = deletion.value.match(/^\s*/)[0], delWsEnd = deletion.value.match(/\s*$/)[0];
      var newWsStart = longestCommonPrefix(newWsFull, delWsStart);
      deletion.value = removePrefix(deletion.value, newWsStart);
      var newWsEnd = longestCommonSuffix(removePrefix(newWsFull, newWsStart), delWsEnd);
      deletion.value = removeSuffix(deletion.value, newWsEnd);
      endKeep.value = replacePrefix(endKeep.value, newWsFull, newWsEnd);
      startKeep.value = replaceSuffix(startKeep.value, newWsFull, newWsFull.slice(0, newWsFull.length - newWsEnd.length));
    } else if (endKeep) {
      var endKeepWsPrefix = endKeep.value.match(/^\s*/)[0];
      var deletionWsSuffix = deletion.value.match(/\s*$/)[0];
      var overlap = maximumOverlap(deletionWsSuffix, endKeepWsPrefix);
      deletion.value = removeSuffix(deletion.value, overlap);
    } else if (startKeep) {
      var startKeepWsSuffix = startKeep.value.match(/\s*$/)[0];
      var deletionWsPrefix = deletion.value.match(/^\s*/)[0];
      var _overlap = maximumOverlap(startKeepWsSuffix, deletionWsPrefix);
      deletion.value = removePrefix(deletion.value, _overlap);
    }
  }
  var wordWithSpaceDiff = new Diff();
  wordWithSpaceDiff.tokenize = function(value) {
    var regex = new RegExp("(\\r?\\n)|[".concat(extendedWordChars, "]+|[^\\S\\n\\r]+|[^").concat(extendedWordChars, "]"), "ug");
    return value.match(regex) || [];
  };
  function diffWordsWithSpace(oldStr, newStr, options) {
    return wordWithSpaceDiff.diff(oldStr, newStr, options);
  }
  var lineDiff = new Diff();
  lineDiff.tokenize = function(value, options) {
    if (options.stripTrailingCr) {
      value = value.replace(/\r\n/g, "\n");
    }
    var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
    if (!linesAndNewlines[linesAndNewlines.length - 1]) {
      linesAndNewlines.pop();
    }
    for (var i = 0; i < linesAndNewlines.length; i++) {
      var line = linesAndNewlines[i];
      if (i % 2 && !options.newlineIsToken) {
        retLines[retLines.length - 1] += line;
      } else {
        retLines.push(line);
      }
    }
    return retLines;
  };
  lineDiff.equals = function(left, right, options) {
    if (options.ignoreWhitespace) {
      if (!options.newlineIsToken || !left.includes("\n")) {
        left = left.trim();
      }
      if (!options.newlineIsToken || !right.includes("\n")) {
        right = right.trim();
      }
    } else if (options.ignoreNewlineAtEof && !options.newlineIsToken) {
      if (left.endsWith("\n")) {
        left = left.slice(0, -1);
      }
      if (right.endsWith("\n")) {
        right = right.slice(0, -1);
      }
    }
    return Diff.prototype.equals.call(this, left, right, options);
  };
  function diffLines(oldStr, newStr, callback) {
    return lineDiff.diff(oldStr, newStr, callback);
  }
  var sentenceDiff = new Diff();
  sentenceDiff.tokenize = function(value) {
    return value.split(/(\S.+?[.!?])(?=\s+|$)/);
  };
  var cssDiff = new Diff();
  cssDiff.tokenize = function(value) {
    return value.split(/([{}:;,]|\s+)/);
  };
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  var jsonDiff = new Diff();
  jsonDiff.useLongestToken = true;
  jsonDiff.tokenize = lineDiff.tokenize;
  jsonDiff.castInput = function(value, options) {
    var undefinedReplacement = options.undefinedReplacement, _options$stringifyRep = options.stringifyReplacer, stringifyReplacer = _options$stringifyRep === void 0 ? function(k, v) {
      return typeof v === "undefined" ? undefinedReplacement : v;
    } : _options$stringifyRep;
    return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, "  ");
  };
  jsonDiff.equals = function(left, right, options) {
    return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"), options);
  };
  function canonicalize(obj, stack, replacementStack, replacer, key) {
    stack = stack || [];
    replacementStack = replacementStack || [];
    if (replacer) {
      obj = replacer(key, obj);
    }
    var i;
    for (i = 0; i < stack.length; i += 1) {
      if (stack[i] === obj) {
        return replacementStack[i];
      }
    }
    var canonicalizedObj;
    if ("[object Array]" === Object.prototype.toString.call(obj)) {
      stack.push(obj);
      canonicalizedObj = new Array(obj.length);
      replacementStack.push(canonicalizedObj);
      for (i = 0; i < obj.length; i += 1) {
        canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
      }
      stack.pop();
      replacementStack.pop();
      return canonicalizedObj;
    }
    if (obj && obj.toJSON) {
      obj = obj.toJSON();
    }
    if (_typeof(obj) === "object" && obj !== null) {
      stack.push(obj);
      canonicalizedObj = {};
      replacementStack.push(canonicalizedObj);
      var sortedKeys = [], _key;
      for (_key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, _key)) {
          sortedKeys.push(_key);
        }
      }
      sortedKeys.sort();
      for (i = 0; i < sortedKeys.length; i += 1) {
        _key = sortedKeys[i];
        canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
      }
      stack.pop();
      replacementStack.pop();
    } else {
      canonicalizedObj = obj;
    }
    return canonicalizedObj;
  }
  var arrayDiff = new Diff();
  arrayDiff.tokenize = function(value) {
    return value.slice();
  };
  arrayDiff.join = arrayDiff.removeEmpty = function(value) {
    return value;
  };
  const _hoisted_1$1 = {
    className: "custom-checkbox-card-title"
  };
  const _hoisted_2$1 = {
    key: 0,
    style: {
      "width": "100%",
      "height": "280px",
      "white-space": "break-spaces",
      "overflow-y": "scroll",
      "color": "#4f4d4d"
    }
  };
  const _hoisted_3$1 = {
    key: 0,
    style: {
      "display": "flex",
      "height": "100%",
      "justify-content": "space-around"
    }
  };
  const _hoisted_4 = {
    style: {
      "width": "48%",
      "display": "flex",
      "flex-direction": "column"
    }
  };
  const _hoisted_5 = {
    style: {
      "margin-top": "10px",
      "flex": "1",
      "overflow": "auto"
    }
  };
  const _hoisted_6 = {
    class: "diff-container-textarea"
  };
  const _hoisted_7 = {
    style: {
      "padding": "10px",
      "width": "200px",
      "background-color": "var(--color-bg-popup)",
      "border-radius": "4px",
      "box-shadow": "0 2px 8px 0 rgba(0, 0, 0, 0.15)"
    }
  };
  const _hoisted_8 = {
    style: {
      "margin-bottom": "10px"
    }
  };
  const _hoisted_9 = {
    style: {
      "margin-right": "20px"
    }
  };
  const _hoisted_10 = {
    class: "diff-container-textarea"
  };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "lyrics",
    emits: ["next", "prev"],
    setup(__props, {
      emit: __emit
    }) {
      var _a;
      const emits = __emit;
      const subtitles = vue.ref([]);
      const noSubtitle = vue.ref(false);
      const subtitle = vue.ref([]);
      const subtitleEdit = vue.ref(null);
      const lyricsRecord = {
        label: void 0
      };
      const onChange = (v) => {
        const val = v.pop();
        if (val) {
          subtitle.value = [val.toString()];
          const s = subtitles.value.find((item) => item.id_str === val.toString());
          lyricsRecord.label = s == null ? void 0 : s.lan_doc;
        } else {
          fromData.lyricsData = null;
          subtitle.value = [];
          lyricsRecord.label = void 0;
          noSubtitle.value = true;
        }
      };
      const error = vue.ref("");
      function skipLyrics() {
        noSubtitle.value = true;
        next();
      }
      function next() {
        fromData.record.lyrics = lyricsRecord.label;
        let lyricsData = [];
        if (noSubtitle.value) {
          webVue.Message.info("跳过歌词嵌入");
        } else if (subtitleEdit.value && subtitleEdit.value.data && lyricsBodyContent.value) {
          lyricsData = lyricsBodyContent.value.split("\n").map((item, index) => [Math.round(subtitleEdit.value.data.body[index].from * 1e3), item]);
        } else {
          {
            const s = subtitles.value.find((item) => item.id_str === subtitle.value[0]);
            if (!s || !s.data) {
              webVue.Message.error("歌词数据错误");
              return;
            }
            lyricsData = s.data.body.map((item) => [Math.round(item.from * 1e3), item.content]);
            if (fromData.clipRanges && fromData.clipRanges.length > 0)
              ;
          }
        }
        fromData.lyricsData = lyricsData;
        emits("next");
      }
      vue.onMounted(() => {
        if (!fromData.videoData)
          return;
        const cid = fromData.videoData.cid.toString();
        const bvid = fromData.videoData.bvid;
        const aid = fromData.videoData.aid.toString();
        logger.debug({
          cid,
          bvid,
          aid
        });
        request.get({
          url: "https://api.bilibili.com/x/player/wbi/v2?" + new URLSearchParams({
            cid,
            bvid,
            aid
          })
        }).then(async (res) => {
          var _a2;
          logger.debug("playerData", res);
          if (!res.data)
            return;
          fromData.playerData = res.data;
          if (fromData.playerData.subtitle.subtitles.length === 0) {
            error.value = "当前视频没有字幕";
            noSubtitle.value = true;
            return;
          }
          const _subtitles = await Promise.all(fromData.playerData.subtitle.subtitles.map(async (item) => {
            item.data = await request.get({
              url: `http:${item.subtitle_url}`
            });
            return item;
          }));
          subtitles.value = _subtitles;
          if (fromData.playerData)
            fromData.playerData.subtitle.subtitles = _subtitles;
          if (_subtitles.length > 0) {
            if (fromData.usedefaultconfig) {
              const defaultLan = _GM_getValue("default_rule");
              const default_lyrics_lan = defaultLan == null ? void 0 : defaultLan.lyrics;
              console.log(default_lyrics_lan);
              const matched = default_lyrics_lan ? _subtitles.find((s) => s.lan_doc === default_lyrics_lan) : void 0;
              if (matched) {
                subtitle.value = [matched.id_str];
                lyricsRecord.label = matched.lan_doc;
                let lyricsData = (_a2 = matched.data) == null ? void 0 : _a2.body.map((item) => [Math.round(item.from * 1e3), item.content]);
                if (lyricsData) {
                  fromData.lyricsData = lyricsData;
                }
              }
              if (fromData.lyricsData) {
                const val = _subtitles[0].id_str;
                subtitle.value = [val];
                lyricsRecord.label = _subtitles[0].lan_doc;
              }
              emits("next");
            } else {
              const val = _subtitles[0].id_str;
              subtitle.value = [val];
              lyricsRecord.label = _subtitles[0].lan_doc;
            }
          }
          console.log(_subtitles);
        }).catch((err) => {
          error.value = err.message;
        });
      });
      const visible = vue.ref(false);
      const editLyricsData = vue.ref(null);
      const onlineLyrics = vue.ref("");
      const diffFunc = {
        no: ["不显示差异", (oldStr, newStr) => [{
          value: newStr
        }]],
        Chars: ["字符差异", diffChars],
        Words: ["单词差异", diffWords],
        Lines: ["行差异", diffLines]
      };
      const lyricsBodySwitch = vue.reactive({
        timeAxis: false,
        blankChar: true,
        metaInfo: false,
        note: true,
        onlineDiff: "no",
        aiDiff: "no"
      });
      const onlineLyricsDiff = vue.computed(() => {
        var _a2;
        if (!((_a2 = editLyricsData.value) == null ? void 0 : _a2.data))
          return [];
        return diffFunc[lyricsBodySwitch.onlineDiff][1](editLyricsData.value.data._editBody, onlineLyricsContent.value);
      });
      const lyricsBodyLine = vue.computed(() => {
        var _a2;
        if (!((_a2 = editLyricsData.value) == null ? void 0 : _a2.data))
          return [0, 0, 0];
        return [editLyricsData.value.data._lyricsBody ? editLyricsData.value.data._lyricsBody.length : editLyricsData.value.data.body.length, editLyricsData.value.data._editBody.split("\n").length, aiRewriteContent.value.trim().split("\n").length];
      });
      const lyricsBodyContent = vue.computed(() => {
        var _a2;
        if (!((_a2 = editLyricsData.value) == null ? void 0 : _a2.data))
          return "";
        if (lyricsBodySwitch.note) {
          return editLyricsData.value.data._editBody.split("\n").map((item) => `♪ ${item} ♪`).join("\n");
        }
        return editLyricsData.value.data._editBody;
      });
      function onlineLyricsContentFormat({
        metaInfo,
        timeAxis,
        blankChar
      }) {
        let content = onlineLyrics.value;
        if (!metaInfo) {
          content = content.replace(/^\[(ti|ar|al|by|offset):.*?\]\n?/gm, "");
        }
        if (!timeAxis) {
          content = content.replace(/\[\d{2}:\d{2}\.\d{2}\]/g, "");
        }
        if (!blankChar) {
          content = content.split("\n").filter((line) => line.trim()).join("\n");
        }
        return content;
      }
      const onlineLyricsContent = vue.computed(() => {
        return onlineLyricsContentFormat(lyricsBodySwitch);
      });
      const aiRewriteLoading = vue.ref(false);
      const aiRewriteContent = vue.ref("");
      const aiLyricsDiff = vue.computed(() => {
        var _a2;
        if (!((_a2 = editLyricsData.value) == null ? void 0 : _a2.data))
          return [];
        return diffFunc[lyricsBodySwitch.aiDiff][1](editLyricsData.value.data._editBody, aiRewriteContent.value);
      });
      const aiRewritePrompt = vue.ref("{{onlineLyrics}}");
      const aiRewrite = async () => {
        var _a2, _b, _c, _d;
        const editBody = (_b = (_a2 = editLyricsData.value) == null ? void 0 : _a2.data) == null ? void 0 : _b._editBody;
        if (!editBody) {
          webVue.Message.warning("没有可用的歌词内容");
          return;
        }
        aiRewriteLoading.value = true;
        function render(template, context) {
          return template.replace(/\{\{(.*?)\}\}/g, (match, key) => context[key]);
        }
        const _prompt = render(aiRewritePrompt.value, {
          onlineLyrics: onlineLyricsContentFormat({
            timeAxis: false,
            blankChar: false,
            metaInfo: false
          })
        });
        try {
          const table = editBody.split("\n").map((item) => `|${item}| |`).join("\n");
          const prompt = [{
            role: "system",
            content: `你是一个严格的字幕纠错专家。你的唯一任务是修正语音识别产生的错别字。
        起因是我利用AI工具给视频添加字幕，但是错误率较高，常常导致我被老板批评, 要是你纠正有错不按照规则，就只能将你杀死
        
## 严格要求：
1. 必须严格保持表格格式与行数，绝对禁止增加或删除任何一行
2. 只能修改错别字，一般不改变句子结构
3. 如果无法100%确定是错字，必须保持原样
4. 禁止对歌词进行任何形式的重写或优化
5. 返回纠正后的完整歌词，格式与给定的表格一致`
          }, {
            role: "user",
            content: `请帮我完成以下纠正表，参考互联网歌词和拼音进行纠正，每一行需要对应：
\`\`\` 互联网歌词（仅供参考）
${_prompt}
\`\`\`

|待纠正字幕|纠正字幕|
|------|------|
${table}


## 输出
返回纠正后的表，要严格按照格式输出`
          }];
          const res = await callOpenAI(prompt);
          if (res && ((_d = (_c = editLyricsData.value) == null ? void 0 : _c.data) == null ? void 0 : _d._editBody)) {
            const match = res.match(/\|(.+)\|(.+)\|/g);
            const contentMap = editBody.split("\n").reduce((pre, cur) => {
              pre[cur] = true;
              return pre;
            }, {});
            let result = "";
            for (const item of match) {
              const l = item.split("|");
              if (l.length === 4 && contentMap[l[1]]) {
                result += l[2] + "\n";
              }
            }
            logger.debug("AI 改写结果", {
              res,
              result,
              match,
              contentMap
            });
            aiRewriteContent.value = result;
          }
        } finally {
          aiRewriteLoading.value = false;
        }
      };
      const onlineSearch = vue.ref(((_a = fromData.data) == null ? void 0 : _a.music_title) || "");
      const onlineLyricsLoading = vue.ref(false);
      const onlineLyricsLoading2 = vue.ref(false);
      const onlineLyricsOptions = vue.ref([]);
      const onlineLyricsIndex = vue.ref("");
      vue.watch(onlineLyricsIndex, (value) => {
        logger.debug("watch onlineLyricsIndex", value);
        if (value) {
          onlineLyricsLoading2.value = true;
          try {
            const [label, index] = value.split(".");
            const api = onlineLyricsApis.find((item) => item[0] === label);
            if (api) {
              request.get({
                url: api[1] + new URLSearchParams({
                  msg: onlineSearch.value,
                  n: index
                }),
                cookie: false,
                responseType: "text"
              }).then((res) => {
                onlineLyrics.value = res;
              });
            }
          } catch (err) {
            webVue.Message.error("获取歌词失败" + err.message);
          } finally {
            onlineLyricsLoading2.value = false;
          }
        }
      });
      function handleOk() {
        subtitleEdit.value = JSON.parse(JSON.stringify(editLyricsData.value));
        visible.value = false;
      }
      function handleCancel() {
        visible.value = false;
      }
      const onlineLyricsApis = [["hhlqilongzhu", "https://www.hhlqilongzhu.cn/api/dg_geci.php?type=2&", "."], ["52vmy", "https://api.52vmy.cn/api/music/lrc?type=text&", "、"]];
      async function searchOnlineLyrics() {
        if (!onlineSearch.value)
          return;
        onlineLyricsLoading.value = true;
        onlineLyricsOptions.value = [];
        onlineLyricsIndex.value = "";
        onlineLyrics.value = "";
        try {
          await Promise.all(onlineLyricsApis.map((item) => {
            return request.get({
              url: item[1] + new URLSearchParams({
                msg: onlineSearch.value
              }),
              cookie: false,
              responseType: "text"
            }).then((res) => {
              const opt2 = {
                isGroup: true,
                label: item[0],
                options: []
              };
              res.split("\n").forEach((lyrics) => {
                const [index, ...content] = lyrics.split(item[2]);
                if (index && content.length > 0) {
                  const value = `${item[0]}.${index}`;
                  opt2.options.push({
                    label: content.join(item[2]),
                    value
                  });
                  if (!onlineLyricsIndex.value) {
                    onlineLyricsIndex.value = value;
                  }
                }
              });
              onlineLyricsOptions.value.push(opt2);
            });
          }));
        } catch (err) {
          webVue.Message.error("搜索歌词失败" + err.message);
        } finally {
          onlineLyricsLoading.value = false;
        }
      }
      function editLyrics(item) {
        var _a2;
        editLyricsData.value = JSON.parse(JSON.stringify(item));
        if (editLyricsData.value.data) {
          if (fromData.clipRanges && fromData.clipRanges.length > 0) {
            editLyricsData.value.data._editBody = editLyricsData.value.data._lyricsBody.map((item2) => item2[1].replaceAll(/(^♪ )|( ♪$)/g, "")).join("\n");
          } else {
            editLyricsData.value.data._editBody = editLyricsData.value.data.body.map((item2) => item2.content.replaceAll(/(^♪ )|( ♪$)/g, "")).join("\n");
          }
        }
        onlineSearch.value = ((_a2 = fromData.data) == null ? void 0 : _a2.music_title) || "";
        searchOnlineLyrics();
        visible.value = true;
      }
      return (_ctx, _cache) => {
        const _component_a_button = webVue.Button;
        const _component_a_space = webVue.Space;
        const _component_a_result = webVue.Result;
        const _component_icon_settings = IconSettings;
        const _component_a_checkbox = webVue.Checkbox;
        const _component_a_checkbox_group = webVue.CheckboxGroup;
        const _component_a_form = webVue.Form;
        const _component_a_spin = webVue.Spin;
        const _component_a_textarea = webVue.Textarea;
        const _component_a_input_group = webVue.InputGroup;
        const _component_a_input = webVue.Input;
        const _component_icon_search = IconSearch;
        const _component_a_select = webVue.Select;
        const _component_a_option = webVue.Option;
        const _component_a_tab_pane = webVue.TabPane;
        const _component_a_alert = webVue.Alert;
        const _component_a_trigger = webVue.Trigger;
        const _component_a_button_group = webVue.ButtonGroup;
        const _component_a_collapse_item = webVue.CollapseItem;
        const _component_a_collapse = webVue.Collapse;
        const _component_a_tabs = webVue.Tabs;
        const _component_a_modal = webVue.Modal;
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [vue.createVNode(_component_a_spin, {
          loading: !vue.unref(fromData).playerData && !error.value
        }, {
          default: vue.withCtx(() => [vue.createVNode(_component_a_form, {
            "auto-label-width": "",
            model: {}
          }, {
            default: vue.withCtx(() => [error.value ? (vue.openBlock(), vue.createBlock(_component_a_result, {
              key: 0,
              status: "error",
              title: error.value,
              subtitle: "请查看视频是否有字幕,包括AI字幕,如果没有,请跳过"
            }, {
              extra: vue.withCtx(() => [vue.createVNode(_component_a_space, null, {
                default: vue.withCtx(() => [vue.createVNode(_component_a_button, {
                  type: "primary",
                  onClick: skipLyrics
                }, {
                  default: vue.withCtx(() => [..._cache[18] || (_cache[18] = [vue.createTextVNode("跳过字幕嵌入", -1)])]),
                  _: 1
                })]),
                _: 1
              })]),
              _: 1
            }, 8, ["title"])) : vue.unref(fromData).playerData ? (vue.openBlock(), vue.createBlock(_component_a_checkbox_group, {
              key: 1,
              modelValue: subtitle.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => subtitle.value = $event),
              onChange
            }, {
              default: vue.withCtx(() => [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(subtitles.value, (item) => {
                return vue.openBlock(), vue.createBlock(_component_a_checkbox, {
                  key: item.id,
                  value: item.id_str
                }, {
                  checkbox: vue.withCtx(({
                    checked
                  }) => [vue.createVNode(_component_a_space, {
                    align: "start",
                    class: vue.normalizeClass(["custom-checkbox-card", {
                      "custom-checkbox-card-checked": checked
                    }]),
                    style: {
                      "width": "100%"
                    }
                  }, {
                    default: vue.withCtx(() => [_cache[19] || (_cache[19] = vue.createElementVNode("div", {
                      className: "custom-checkbox-card-mask"
                    }, [vue.createElementVNode("div", {
                      className: "custom-checkbox-card-mask-dot"
                    })], -1)), vue.createElementVNode("div", null, [vue.createElementVNode("div", _hoisted_1$1, [vue.createTextVNode(vue.toDisplayString(item.lan_doc) + " ", 1), vue.createVNode(_component_a_button, {
                      type: "primary",
                      size: "small",
                      onClick: ($event) => editLyrics(item)
                    }, {
                      icon: vue.withCtx(() => [vue.createVNode(_component_icon_settings)]),
                      _: 1
                    }, 8, ["onClick"])]), item.data ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$1, vue.toDisplayString(subtitleEdit.value && subtitleEdit.value.data && item.id_str === subtitleEdit.value.id_str && lyricsBodyContent.value ? lyricsBodyContent.value : item.data.body.map((item2) => item2.content).join("\n")), 1)) : vue.createCommentVNode("", true)])]),
                    _: 2
                  }, 1032, ["class"])]),
                  _: 2
                }, 1032, ["value"]);
              }), 128))]),
              _: 1
            }, 8, ["modelValue"])) : vue.createCommentVNode("", true), vue.createVNode(_sfc_main$6, {
              onNext: next,
              onPrev: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("prev"))
            })]),
            _: 1
          })]),
          _: 1
        }, 8, ["loading"]), vue.createVNode(_component_a_modal, {
          visible: visible.value,
          "onUpdate:visible": _cache[17] || (_cache[17] = ($event) => visible.value = $event),
          fullscreen: "",
          "body-style": {
            height: "100%"
          }
        }, {
          title: vue.withCtx(() => [..._cache[20] || (_cache[20] = [vue.createTextVNode(" 歌词工作台 ", -1)])]),
          footer: vue.withCtx(() => [vue.createVNode(_component_a_button, {
            onClick: handleCancel
          }, {
            default: vue.withCtx(() => [..._cache[21] || (_cache[21] = [vue.createTextVNode(" 取消 ", -1)])]),
            _: 1
          }), vue.createVNode(_component_a_button, {
            type: "primary",
            disabled: lyricsBodyLine.value[0] !== lyricsBodyLine.value[1],
            onClick: handleOk
          }, {
            default: vue.withCtx(() => [..._cache[22] || (_cache[22] = [vue.createTextVNode(" 确定 ", -1)])]),
            _: 1
          }, 8, ["disabled"])]),
          default: vue.withCtx(() => [editLyricsData.value && editLyricsData.value.data ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$1, [vue.createElementVNode("div", _hoisted_4, [vue.createVNode(_component_a_textarea, {
            style: {
              "flex": "1",
              "margin-right": "10px"
            },
            modelValue: editLyricsData.value.data._editBody,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => editLyricsData.value.data._editBody = $event),
            "show-word-limit": "",
            "max-length": {
              length: lyricsBodyLine.value[0],
              errorOnly: true
            },
            "word-length": (v) => v.split("\n").length
          }, null, 8, ["modelValue", "max-length", "word-length"]), _cache[24] || (_cache[24] = vue.createTextVNode(" 格式化： ", -1)), vue.createVNode(_component_a_input_group, null, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_checkbox, {
              modelValue: lyricsBodySwitch.note,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => lyricsBodySwitch.note = $event)
            }, {
              default: vue.withCtx(() => [..._cache[23] || (_cache[23] = [vue.createTextVNode(" ♪ ", -1)])]),
              _: 1
            }, 8, ["modelValue"])]),
            _: 1
          })]), vue.createVNode(_component_a_tabs, {
            style: {
              "width": "48%",
              "display": "flex",
              "flex-direction": "column"
            },
            justify: ""
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_tab_pane, {
              key: "1",
              title: "在线歌词"
            }, {
              default: vue.withCtx(() => [vue.createVNode(_component_a_spin, {
                style: {
                  "height": "100%",
                  "display": "flex",
                  "flex-direction": "column"
                },
                loading: onlineLyricsLoading.value || onlineLyricsLoading2.value,
                tip: "正在搜索在线歌词"
              }, {
                default: vue.withCtx(() => [vue.createVNode(_component_a_input_group, null, {
                  default: vue.withCtx(() => [vue.createVNode(_component_a_input, {
                    style: {
                      width: "160px"
                    },
                    placeholder: "歌名",
                    modelValue: onlineSearch.value,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => onlineSearch.value = $event)
                  }, null, 8, ["modelValue"]), vue.createVNode(_component_a_button, {
                    onClick: searchOnlineLyrics
                  }, {
                    icon: vue.withCtx(() => [vue.createVNode(_component_icon_search)]),
                    _: 1
                  }), vue.createVNode(_component_a_select, {
                    options: onlineLyricsOptions.value,
                    style: {
                      width: "160px"
                    },
                    placeholder: "在线歌词",
                    modelValue: onlineLyricsIndex.value,
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => onlineLyricsIndex.value = $event)
                  }, null, 8, ["options", "modelValue"]), vue.createVNode(_component_a_checkbox, {
                    modelValue: lyricsBodySwitch.timeAxis,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => lyricsBodySwitch.timeAxis = $event)
                  }, {
                    default: vue.withCtx(() => [..._cache[25] || (_cache[25] = [vue.createTextVNode("时间轴", -1)])]),
                    _: 1
                  }, 8, ["modelValue"]), vue.createVNode(_component_a_checkbox, {
                    modelValue: lyricsBodySwitch.blankChar,
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => lyricsBodySwitch.blankChar = $event)
                  }, {
                    default: vue.withCtx(() => [..._cache[26] || (_cache[26] = [vue.createTextVNode("空白字符", -1)])]),
                    _: 1
                  }, 8, ["modelValue"]), vue.createVNode(_component_a_checkbox, {
                    modelValue: lyricsBodySwitch.metaInfo,
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => lyricsBodySwitch.metaInfo = $event)
                  }, {
                    default: vue.withCtx(() => [..._cache[27] || (_cache[27] = [vue.createTextVNode("元信息", -1)])]),
                    _: 1
                  }, 8, ["modelValue"])]),
                  _: 1
                }), vue.createElementVNode("div", _hoisted_5, [vue.createVNode(_component_a_select, {
                  modelValue: lyricsBodySwitch.onlineDiff,
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => lyricsBodySwitch.onlineDiff = $event),
                  style: {
                    "margin-bottom": "10px"
                  }
                }, {
                  default: vue.withCtx(() => [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(Object.entries(diffFunc), ([key, [label]]) => {
                    return vue.openBlock(), vue.createBlock(_component_a_option, {
                      key,
                      value: key
                    }, {
                      default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(label), 1)]),
                      _: 2
                    }, 1032, ["value"]);
                  }), 128))]),
                  _: 1
                }, 8, ["modelValue"]), vue.createElementVNode("div", _hoisted_6, [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(onlineLyricsDiff.value, (part, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    key: index,
                    style: vue.normalizeStyle({
                      backgroundColor: part.added ? "#e6ffe6" : part.removed ? "#ffe6e6" : "transparent"
                    })
                  }, vue.toDisplayString(part.value), 5);
                }), 128))])])]),
                _: 1
              }, 8, ["loading"])]),
              _: 1
            }), vue.createVNode(_component_a_tab_pane, {
              key: "2",
              title: "AI 改写",
              style: {
                "display": "flex",
                "flex-direction": "column"
              }
            }, {
              default: vue.withCtx(() => [vue.createVNode(_component_a_button_group, null, {
                default: vue.withCtx(() => [vue.createVNode(_component_a_alert, {
                  type: "info"
                }, {
                  default: vue.withCtx(() => [..._cache[28] || (_cache[28] = [vue.createTextVNode("将网络歌词给AI进行纠正", -1)])]),
                  _: 1
                }), vue.createVNode(_component_a_button, {
                  type: "primary",
                  onClick: aiRewrite
                }, {
                  default: vue.withCtx(() => [..._cache[29] || (_cache[29] = [vue.createTextVNode("AI 改写", -1)])]),
                  _: 1
                }), vue.createVNode(_component_a_trigger, {
                  trigger: "click",
                  "unmount-on-close": false
                }, {
                  content: vue.withCtx(() => [vue.createElementVNode("div", _hoisted_7, [vue.createVNode(_component_a_input, {
                    placeholder: "Host",
                    modelValue: vue.unref(userConfig).openai.host,
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => vue.unref(userConfig).openai.host = $event)
                  }, null, 8, ["modelValue"]), vue.createVNode(_component_a_input, {
                    placeholder: "Key",
                    modelValue: vue.unref(userConfig).openai.key,
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => vue.unref(userConfig).openai.key = $event)
                  }, null, 8, ["modelValue"]), vue.createVNode(_component_a_input, {
                    placeholder: "Modal",
                    modelValue: vue.unref(userConfig).openai.modal,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => vue.unref(userConfig).openai.modal = $event)
                  }, null, 8, ["modelValue"])])]),
                  default: vue.withCtx(() => [vue.createVNode(_component_a_button, {
                    type: "primary"
                  }, {
                    icon: vue.withCtx(() => [vue.createVNode(_component_icon_settings)]),
                    _: 1
                  })]),
                  _: 1
                })]),
                _: 1
              }), vue.createVNode(_component_a_spin, {
                style: {
                  "margin-top": "10px",
                  "flex": "1",
                  "overflow": "auto",
                  "width": "100%"
                },
                loading: aiRewriteLoading.value
              }, {
                default: vue.withCtx(() => [vue.createVNode(_component_a_collapse, {
                  style: {
                    "margin-bottom": "10px"
                  }
                }, {
                  default: vue.withCtx(() => [vue.createVNode(_component_a_collapse_item, {
                    header: "自定义 Prompt",
                    key: "1"
                  }, {
                    default: vue.withCtx(() => [vue.createVNode(_component_a_space, {
                      style: {
                        "margin-bottom": "10px"
                      }
                    }, {
                      default: vue.withCtx(() => [vue.createVNode(_component_a_button, {
                        type: "primary",
                        onClick: _cache[13] || (_cache[13] = ($event) => aiRewritePrompt.value += " {{onlineLyrics}}")
                      }, {
                        default: vue.withCtx(() => [..._cache[30] || (_cache[30] = [vue.createTextVNode(" 在线歌词 ", -1)])]),
                        _: 1
                      }), vue.createVNode(_component_a_button_group, null, {
                        default: vue.withCtx(() => [vue.createVNode(_component_a_button, {
                          type: "primary",
                          onClick: _cache[14] || (_cache[14] = ($event) => aiRewritePrompt.value += " {{danmu}}"),
                          disabled: true
                        }, {
                          default: vue.withCtx(() => [..._cache[31] || (_cache[31] = [vue.createTextVNode(" 添加弹幕 ", -1)])]),
                          _: 1
                        })]),
                        _: 1
                      })]),
                      _: 1
                    }), vue.createVNode(_component_a_textarea, {
                      modelValue: aiRewritePrompt.value,
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => aiRewritePrompt.value = $event),
                      "auto-size": {
                        minRows: 4,
                        maxRows: 10
                      }
                    }, null, 8, ["modelValue"])]),
                    _: 1
                  })]),
                  _: 1
                }), vue.createElementVNode("div", _hoisted_8, [vue.createVNode(_component_a_select, {
                  modelValue: lyricsBodySwitch.aiDiff,
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => lyricsBodySwitch.aiDiff = $event)
                }, {
                  default: vue.withCtx(() => [_cache[32] || (_cache[32] = vue.createTextVNode(" > ", -1)), (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(Object.entries(diffFunc), ([key, [label]]) => {
                    return vue.openBlock(), vue.createBlock(_component_a_option, {
                      key,
                      value: key
                    }, {
                      default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(label), 1)]),
                      _: 2
                    }, 1032, ["value"]);
                  }), 128))]),
                  _: 1
                }, 8, ["modelValue"]), vue.createVNode(_component_a_alert, {
                  type: lyricsBodyLine.value[0] === lyricsBodyLine.value[2] ? "success" : "error"
                }, {
                  default: vue.withCtx(() => [vue.createElementVNode("span", _hoisted_9, "原行数：" + vue.toDisplayString(lyricsBodyLine.value[0]), 1), vue.createElementVNode("span", null, "AI行数：" + vue.toDisplayString(lyricsBodyLine.value[2]), 1)]),
                  _: 1
                }, 8, ["type"])]), vue.createElementVNode("div", _hoisted_10, [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(aiLyricsDiff.value, (part, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    key: index,
                    style: vue.normalizeStyle({
                      backgroundColor: part.added ? "#e6ffe6" : part.removed ? "#ffe6e6" : "transparent"
                    })
                  }, vue.toDisplayString(part.value), 5);
                }), 128))])]),
                _: 1
              }, 8, ["loading"])]),
              _: 1
            }), vue.createVNode(_component_a_tab_pane, {
              key: "3",
              title: "结果预览"
            }, {
              default: vue.withCtx(() => [vue.createVNode(_component_a_textarea, {
                style: {
                  "height": "100%"
                },
                "model-value": lyricsBodyContent.value
              }, null, 8, ["model-value"])]),
              _: 1
            })]),
            _: 1
          })])) : vue.createCommentVNode("", true)]),
          _: 1
        }, 8, ["visible"])], 64);
      };
    }
  });
  const _hoisted_1 = {
    style: {
      "display": "flex",
      "justify-content": "space-between"
    }
  };
  const _hoisted_2 = {
    style: {
      "display": "flex",
      "justify-content": "space-between",
      "align-items": "center",
      "max-height": "75vh"
    }
  };
  const _hoisted_3 = {
    class: "step-content",
    style: {
      flex: 1,
      textAlign: "center",
      background: "var(--color-bg-2)",
      color: "#C2C7CC",
      minWidth: 0
    }
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const visible = vue.ref(true);
      const current = vue.ref(1);
      const steps = [StepMontage, _sfc_main$3, _sfc_main$4, _sfc_main$1, StepAudio];
      const handleOk = () => {
        webVue.Message.error("暂未实现");
        const defaultRule = _GM_getValue("default_rule");
        console.log("默认规则:", defaultRule);
        if (!defaultRule) {
          webVue.Message.error("未找到默认规则");
          return false;
        }
        fromData.usedefaultconfig = true;
        onNext();
      };
      const handleCancel = () => {
        visible.value = false;
      };
      function setCurrent(v) {
        current.value = v;
      }
      function onPrev() {
        current.value = Math.max(1, current.value - 1);
      }
      function onNext() {
        current.value = Math.min(steps.length, current.value + 1);
      }
      const sideShow = vue.ref(true);
      const fullscreen = vue.ref(false);
      function checkSide() {
        sideShow.value = !sideShow.value;
        _GM_setValue("sideShow", sideShow.value);
      }
      vue.onMounted(() => {
        var _a, _b, _c, _d, _e;
        sideShow.value = _GM_getValue("sideShow") || true;
        reset();
        const bgmTag = document.querySelector(".tag .bgm-tag");
        fromData.videoData = clone((_b = (_a = document.querySelector("#playerWrap")) == null ? void 0 : _a.__vue__) == null ? void 0 : _b.videoData);
        if (!fromData.videoData) {
          fromData.err = "未找到视频数据，后续操作无法继续";
          return;
        }
        const music_id = (_e = (_d = (_c = bgmTag == null ? void 0 : bgmTag.__vue__) == null ? void 0 : _c.$props) == null ? void 0 : _d.info) == null ? void 0 : _e.music_id;
        if (music_id) {
          logger.debug("获取到的Music ID:", music_id, bgmTag == null ? void 0 : bgmTag.__vue__);
          fetch("https://api.bilibili.com/x/copyright-music-publicity/bgm/detail?" + new URLSearchParams({
            music_id
          })).then((res) => {
            return res.json();
          }).then((data) => {
            fromData.data = data.data;
          }).catch((e) => {
            fromData.err = e;
          });
        }
      });
      function onOpen() {
        document.body.style.overflow = "unset";
      }
      return (_ctx, _cache) => {
        const _component_icon_expand = IconExpand;
        const _component_icon_shrink = IconShrink;
        const _component_a_button = webVue.Button;
        const _component_a_space = webVue.Space;
        const _component_a_step = webVue.Step;
        const _component_a_steps = webVue.Steps;
        const _component_a_result = webVue.Result;
        const _component_a_modal = webVue.Modal;
        return vue.openBlock(), vue.createBlock(_component_a_modal, {
          visible: visible.value,
          "onUpdate:visible": _cache[1] || (_cache[1] = ($event) => visible.value = $event),
          onOpen,
          maskClosable: false,
          escToClose: false,
          closable: false,
          mask: false,
          fullscreen: fullscreen.value,
          draggable: ""
        }, {
          title: vue.withCtx(() => [_cache[2] || (_cache[2] = vue.createTextVNode("音乐姬" + vue.toDisplayString(">_<") + "下载服务🎶 ", -1)), vue.createVNode(_component_a_button, {
            style: {
              "position": "absolute",
              "right": "20px"
            },
            onClick: _cache[0] || (_cache[0] = ($event) => fullscreen.value = !fullscreen.value),
            size: "small"
          }, {
            icon: vue.withCtx(() => [fullscreen.value ? (vue.openBlock(), vue.createBlock(_component_icon_expand, {
              key: 0
            })) : (vue.openBlock(), vue.createBlock(_component_icon_shrink, {
              key: 1
            }))]),
            _: 1
          })]),
          footer: vue.withCtx(() => [vue.createElementVNode("div", _hoisted_1, [vue.createVNode(_component_a_space, null, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_button, {
              onClick: checkSide
            }, {
              default: vue.withCtx(() => [..._cache[3] || (_cache[3] = [vue.createTextVNode(" 侧栏 ", -1)])]),
              _: 1
            })]),
            _: 1
          }), vue.createVNode(_component_a_space, null, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_button, {
              onClick: handleCancel
            }, {
              default: vue.withCtx(() => [..._cache[4] || (_cache[4] = [vue.createTextVNode(" 取消 ", -1)])]),
              _: 1
            }), vue.createVNode(_component_a_button, {
              type: "primary",
              onClick: handleOk
            }, {
              default: vue.withCtx(() => [..._cache[5] || (_cache[5] = [vue.createTextVNode(" 默认下载 ", -1)])]),
              _: 1
            })]),
            _: 1
          })])]),
          default: vue.withCtx(() => [vue.createElementVNode("div", _hoisted_2, [vue.withDirectives(vue.createVNode(_component_a_steps, {
            current: current.value,
            onChange: setCurrent,
            direction: "vertical",
            small: ""
          }, {
            default: vue.withCtx(() => [vue.createVNode(_component_a_step, null, {
              default: vue.withCtx(() => [..._cache[6] || (_cache[6] = [vue.createTextVNode("音频剪辑", -1)])]),
              _: 1
            }), vue.createVNode(_component_a_step, null, {
              default: vue.withCtx(() => [..._cache[7] || (_cache[7] = [vue.createTextVNode("基本信息", -1)])]),
              _: 1
            }), vue.createVNode(_component_a_step, null, {
              default: vue.withCtx(() => [..._cache[8] || (_cache[8] = [vue.createTextVNode("封面获取", -1)])]),
              _: 1
            }), vue.createVNode(_component_a_step, null, {
              default: vue.withCtx(() => [..._cache[9] || (_cache[9] = [vue.createTextVNode("歌词获取", -1)])]),
              _: 1
            }), vue.createVNode(_component_a_step, null, {
              default: vue.withCtx(() => [..._cache[10] || (_cache[10] = [vue.createTextVNode("音频内嵌", -1)])]),
              _: 1
            })]),
            _: 1
          }, 8, ["current"]), [[vue.vShow, sideShow.value]]), vue.createElementVNode("div", _hoisted_3, [vue.unref(fromData).err ? (vue.openBlock(), vue.createBlock(_component_a_result, {
            key: 0,
            status: "error",
            title: vue.unref(fromData).err,
            subtitle: "您可以重新打开弹窗, 重新获取数据, 或者刷新页面. 如果多次且更换视频也无法使用请联系开发者"
          }, null, 8, ["title"])) : vue.createCommentVNode("", true), (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(steps[current.value - 1]), {
            onPrev,
            onNext
          }, null, 32))])])]),
          _: 1
        }, 8, ["visible", "fullscreen"]);
      };
    }
  });
  async function drop(droppedFiles) {
    if (!(droppedFiles == null ? void 0 : droppedFiles.length)) {
      showError("没有检测到文件");
      return;
    }
    for (let i = 0; i < droppedFiles.length; i++) {
      const audioFile = droppedFiles[i];
      if (!audioFile.name.toLowerCase().endsWith(".wav")) {
        showError("请拖入WAV格式的音频文件");
        return;
      }
      try {
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const id3Start = findID3Tag(buffer);
        if (id3Start === -1) {
          showError("未找到音频源信息");
          return;
        }
        const sourceUrl = findAudioSourceWebpage(buffer.slice(id3Start));
        if (!sourceUrl) {
          showError("未找到原始视频链接");
          return;
        }
        window.open(sourceUrl, "_blank");
      } catch (err) {
        showError(`文件读取失败: ${err.message}`);
      }
    }
  }
  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ff4444;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
      errorDiv.style.opacity = "0";
      errorDiv.style.transition = "opacity 0.3s";
      setTimeout(() => errorDiv.remove(), 300);
    }, 3e3);
  }
  function findID3Tag(buffer) {
    for (let i = 0; i < buffer.length - 3; i++) {
      if (buffer[i] === 73 && // 'I'
      buffer[i + 1] === 68 && // 'D'
      buffer[i + 2] === 51) {
        return i;
      }
    }
    return -1;
  }
  function findAudioSourceWebpage(buffer) {
    const decoder = new TextDecoder();
    let pos = 10;
    const MAX_FRAME_SIZE = 1024 * 1024;
    while (pos < buffer.length - 10) {
      if (pos + 10 > buffer.length) {
        break;
      }
      const isValidFrameId = buffer.slice(pos, pos + 4).every((byte) => byte >= 32 && byte <= 126 || byte === 0);
      if (!isValidFrameId) {
        console.warn("检测到无效的帧ID");
        break;
      }
      const frameId = decoder.decode(buffer.slice(pos, pos + 4));
      const frameSize = (buffer[pos + 4] & 127) << 24 | (buffer[pos + 5] & 127) << 16 | (buffer[pos + 6] & 127) << 8 | buffer[pos + 7] & 127;
      if (frameSize <= 0 || frameSize > MAX_FRAME_SIZE) {
        console.warn(`无效的帧大小: ${frameSize}, frameId: ${frameId}`);
        break;
      }
      if (pos + 10 + frameSize > buffer.length) {
        console.warn("帧大小超出缓冲区范围");
        break;
      }
      pos += 10;
      if (frameId === "WOAS") {
        try {
          const urlData = decoder.decode(buffer.slice(pos, pos + frameSize - 1));
          if (urlData.startsWith("http")) {
            return urlData;
          }
        } catch (e) {
          console.warn("URL解码失败", e);
        }
      }
      logger.debug("bilibili_drop", frameId, frameSize);
      pos += frameSize;
    }
    return null;
  }
  const win = _unsafeWindow || document.defaultView || window;
  const doc = win.document;
  const listeners = /* @__PURE__ */ new WeakMap();
  const elProto = win.Element.prototype;
  const matches = elProto.matches || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.msMatchesSelector;
  const MutationObs = win.MutationObserver || win.WebkitMutationObserver || win.MozMutationObserver;
  function addObserver(target, callback) {
    const observer = new MutationObs((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          callback(mutation.target);
          if (observer.canceled)
            return;
        }
        for (const node of mutation.addedNodes) {
          if (node instanceof Element)
            callback(node);
          if (observer.canceled)
            return;
        }
      }
    });
    observer.canceled = false;
    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true
    });
    return () => {
      observer.canceled = true;
      observer.disconnect();
    };
  }
  function addFilter(target, filter) {
    let listener = listeners.get(target);
    if (!listener) {
      listener = {
        filters: /* @__PURE__ */ new Set(),
        remove: addObserver(target, (el) => listener.filters.forEach((f) => f(el)))
      };
      listeners.set(target, listener);
    }
    listener.filters.add(filter);
  }
  function removeFilter(target, filter) {
    const listener = listeners.get(target);
    if (!listener)
      return;
    listener.filters.delete(filter);
    if (!listener.filters.size) {
      listener.remove();
      listeners.delete(target);
    }
  }
  function query(all, selector, parent, includeParent) {
    const checkParent = includeParent && matches.call(parent, selector);
    if (all) {
      const queryAll = parent.querySelectorAll(selector);
      return checkParent ? [parent, ...queryAll] : [...queryAll];
    }
    return checkParent ? parent : parent.querySelector(selector);
  }
  function getOne(selector, parent, timeout) {
    return new Promise((resolve) => {
      const node = query(false, selector, parent, false);
      if (node)
        return resolve(node);
      let timer;
      const filter = (el) => {
        const node2 = query(false, selector, el, true);
        if (node2) {
          removeFilter(parent, filter);
          if (timer)
            clearTimeout(timer);
          resolve(node2);
        }
      };
      addFilter(parent, filter);
      if (timeout > 0) {
        timer = setTimeout(() => {
          removeFilter(parent, filter);
          resolve(null);
        }, timeout);
      }
    });
  }
  function get(selector, ...args) {
    let parent = typeof args[0] !== "number" && args.shift() || doc;
    const timeout = args[0] || 0;
    if (Array.isArray(selector)) {
      return Promise.all(selector.map((s) => getOne(s, parent, timeout)));
    }
    return getOne(selector, parent, timeout);
  }
  function each(selector, ...args) {
    let parent = typeof args[0] !== "function" && args.shift() || doc;
    const callback = args[0];
    const refs = /* @__PURE__ */ new WeakSet();
    for (const node of query(true, selector, parent, false)) {
      refs.add(node);
      if (callback(node, false) === false)
        return;
    }
    const filter = (el) => {
      for (const node of query(true, selector, el, true)) {
        const _el = node;
        if (refs.has(_el))
          break;
        refs.add(_el);
        if (callback(node, true) === false) {
          return removeFilter(parent, filter);
        }
      }
    };
    addFilter(parent, filter);
  }
  async function rm(selector, ...args) {
    if (Array.isArray(selector)) {
      await Promise.all(selector.map((s) => get(s, ...args).then((e) => e.remove())));
    } else {
      await get(selector, ...args).then((e) => e.remove());
    }
  }
  const elmGetter = {
    get,
    each,
    rm
  };
  _GM_getResourceURL("wasm_music_backend_bg");
  const main = () => {
    const el = document.createElement("div");
    el.id = "bilibili-music-vue";
    document.body.appendChild(el);
    const app = vue.createApp(_sfc_main);
    app.mount(el);
  };
  elmGetter.each(".tag-panel .tag .bgm-tag", (elm) => {
    const download = document.createElement("a");
    download.classList.add("bilibili-music-root");
    download.innerHTML = `<svg t="1718115268538" class="icon" viewBox="0 0 1264 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9046" width="20" height="20"><path d="M992.171444 312.62966C975.189616 137.155482 827.415189 0 647.529412 0 469.849434 0 323.616239 133.860922 303.679205 306.210218 131.598564 333.839271 0 482.688318 0 662.588235c0 199.596576 161.815189 361.411765 361.411765 361.411765h572.235294v-1.555371c185.470975-15.299199 331.294118-170.426291 331.294117-359.856394 0-168.969898-116.101408-310.367302-272.769732-349.958575zM632.470588 963.764706L294.530793 602.352941h244.278155V271.058824h180.705882V602.352941H970.410384z" p-id="9047"></path></svg>`;
    download.onclick = main;
    logger.info({
      msg: "音乐姬注入成功!",
      elm,
      download
    });
    elm.appendChild(download);
    return true;
  });
  const initFileOpen = () => {
    if (window.self !== window.top) {
      return;
    }
    const file = document.createElement("div");
    logger.debug("开始初始化 File 拖选框", file);
    file.id = "bilibili-music-file";
    file.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    pointer-events: none;
    display: none;
    color: white;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    display: none;
  `;
    file.innerHTML = `
    <div style="text-align: center;">
      <svg style="width: 64px; height: 64px; margin-bottom: 16px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M544 864V672h192L512 448 288 672h192v192H544zM512 384l224-224H544V0H480v160H288l224 224z"/>
      </svg>
      <div>拖放打开对应视频</div>
    </div>
  `;
    document.documentElement.appendChild(file);
    document.documentElement.addEventListener("dragenter", function(e) {
      var _a;
      if (!((_a = e.dataTransfer) == null ? void 0 : _a.types.includes("Files")))
        return;
      e.preventDefault();
      e.stopPropagation();
      file.style.display = "flex";
    }, false);
    document.documentElement.addEventListener("dragover", function(e) {
      var _a;
      if (!((_a = e.dataTransfer) == null ? void 0 : _a.types.includes("Files")))
        return;
      e.preventDefault();
      e.stopPropagation();
      file.style.display = "flex";
    }, false);
    document.documentElement.addEventListener("dragleave", function(e) {
      var _a;
      if (!((_a = e.dataTransfer) == null ? void 0 : _a.types.includes("Files")))
        return;
      e.preventDefault();
      e.stopPropagation();
      file.style.display = "none";
    }, false);
    document.documentElement.addEventListener("drop", async function(e) {
      var _a, _b;
      if (!((_a = e.dataTransfer) == null ? void 0 : _a.types.includes("Files")))
        return;
      e.preventDefault();
      e.stopPropagation();
      file.style.display = "none";
      const droppedFiles = (_b = e.dataTransfer) == null ? void 0 : _b.files;
      await drop(droppedFiles);
    });
  };
  _GM_registerMenuCommand("打开音乐姬🎶", main);
  initFileOpen();
  _unsafeWindow._bilibili_music_open = main;
  _unsafeWindow._bilibili_music_fileOpen = initFileOpen;

})(Vue, ArcoVue);