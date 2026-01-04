// ==UserScript==
// @name         b站视频加速
// @namespace    ningbnii/monkey_video_speed
// @version      0.0.1
// @author       ningbnii
// @description  这个油猴脚本为B站视频播放器添加了一个便捷控制视频播放速度的功能
// @license      GPLv3
// @icon         https://www.wxbuluo.com/favicon.ico
// @match        https://www.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.7.27/dist/sweetalert2.all.min.js
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/475082/b%E7%AB%99%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/475082/b%E7%AB%99%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const o=document.createElement("style");o.textContent=t,document.head.append(o)})(" .swal2-modal{display:flex!important;flex-direction:column!important}.swal2-modal input{margin:20px auto 0;width:80%!important}.monkey-box[data-v-dea10d07]{box-shadow:2px 2px 4px #000;background:#fff;position:fixed;bottom:0;z-index:1000;display:flex;flex-direction:column;max-width:300px;padding:10px} ");

(function (vue) {
    'use strict';

    const m={__name:"HelloWorld",setup(n){let e=vue.ref(1);const t=document.querySelector("video");t.played&&(t.playbackRate=e.value),t.addEventListener("play",()=>{t.playbackRate=e.value;}),document.addEventListener("keydown",a=>{a.key==="-"&&e.value>.5?e.value-=.5:a.key==="="&&e.value<16&&(e.value+=.5),t.playbackRate=e.value;});function o(){Swal.fire({title:"使用说明",html:`
      <div class="read-the-docs">
        <p>按"-"键减速，按"+"键加速</p>
        <p>当前播放速度：${e.value}</p>
      </div>
    `,showConfirmButton:!0});}return (a,s)=>(vue.openBlock(),vue.createElementBlock("span",{onClick:s[0]||(s[0]=r=>o())},"播放速度："+vue.toDisplayString(vue.unref(e)),1))}};var v=(()=>typeof GM_info<"u"?GM_info:void 0)(),y=(()=>typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0)();const h=(n,e)=>{const t=n.__vccOpts||n;for(const[o,a]of e)t[o]=a;return t},w={class:"monkey-box"},c="https://greasyfork.org/en/scripts/475082",k={__name:"App",setup(n){y("作者博客",function(){location.href="https://www.wxbuluo.com";}),e();async function e(){const t=v.script.version;try{const a=await(await fetch(c)).text(),s=/<dd class="script-show-version".*?>\s*<span[^>]*>([\d.]+)<\/span>/,r=a.match(s);r&&r[1]&&t!==r[1]&&(await Swal.fire({title:"脚本有更新",html:`
          <div >
            <p>当前版本：${t}</p>
            <p>最新版本：${r[1]}</p>
          </div>
        `,showConfirmButton:!0,showCancelButton:!0,confirmButtonText:"立即更新",cancelButtonText:"稍后更新"})).isConfirmed&&window.open(c,"_blank");}catch(o){console.error("检查更新时出错：",o);}}return (t,o)=>(vue.openBlock(),vue.createElementBlock("div",w,[vue.createVNode(m)]))}},g=h(k,[["__scopeId","data-v-dea10d07"]]);vue.createApp(g).mount((()=>{const n=document.createElement("div");return document.body.append(n),n})());

})(Vue);