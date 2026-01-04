// ==UserScript==
// @name         cdnjs国内镜像
// @namespace    ningbnii/cdnjs-mirror
// @version      0.0.4
// @author       ningbnii
// @description  cdnjs国内镜像，加速前端开发
// @license      GPLv3
// @icon         https://www.wxbuluo.com/favicon.ico
// @match        https://cdnjs.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.global.prod.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.10.6/sweetalert2.min.js
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/489606/cdnjs%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/489606/cdnjs%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F.meta.js
// ==/UserScript==

(function (vue) {
  'use strict';

  const m={__name:"HelloWorld",setup(r){const c=t=>{let n=t.closest(".asset").querySelector(".url").innerText;return n=n.replace("cdnjs.cloudflare.com","s4.zstatic.net"),()=>{navigator.clipboard.writeText(n);}};let o="";return setInterval(()=>{let t=window.location.href;if(o!==t)o=t;else return;document.querySelectorAll(".asset").forEach(s=>{const e=document.createElement("button");s.querySelector(".library-asset-buttons").appendChild(e);const a=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" class="icon">
  <defs>
    <linearGradient id="myGradient">
      <stop offset="0%" stop-color="#FF0000" /> <stop offset="100%" stop-color="#FFFF00" />
    </linearGradient>
  </defs>
  <path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z" style="fill: url(#myGradient);"></path></svg>`;e.innerHTML=a,e.onclick=c(e);});},1e3),(t,n)=>null}};var f=(()=>typeof GM_info<"u"?GM_info:void 0)(),_=(()=>typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0)();const h={class:"monkey-box"},i="https://greasyfork.org/en/scripts/489606",w={__name:"App",setup(r){_("脚本官网",function(){location.href="https://www.wxbuluo.com";}),c();async function c(){const o=f.script.version;try{const n=await(await fetch(i)).text(),s=/<dd class="script-show-version".*?>\s*<span[^>]*>([\d.]+)<\/span>/,e=n.match(s);e&&e[1]&&o!==e[1]&&(await Swal.fire({title:"脚本有更新",html:`
          <div >
            <p>当前版本：${o}</p>
            <p>最新版本：${e[1]}</p>
          </div>
        `,showConfirmButton:!0,showCancelButton:!0,confirmButtonText:"立即更新",cancelButtonText:"稍后更新"})).isConfirmed&&window.open(i,"_blank");}catch(t){console.error("检查更新时出错：",t);}}return (o,t)=>(vue.openBlock(),vue.createElementBlock("div",h,[vue.createVNode(m)]))}};vue.createApp(w).mount((()=>{const r=document.createElement("div");return document.body.append(r),r})());

})(Vue);