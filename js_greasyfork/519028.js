// ==UserScript==
// @name          修改左侧评测状态
// @namespace     https://www.luogu.com.cn/user/542457
// @description   修改题目列表左侧评测状态为 √
// @author        cff_0102
// @run-at        document-start
// @version       1.2
// @license       MIT
// @match         https://www.luogu.com/*
// @match         https://www.luogu.com.cn/*
// @icon          https://www.luogu.com.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/519028/%E4%BF%AE%E6%94%B9%E5%B7%A6%E4%BE%A7%E8%AF%84%E6%B5%8B%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/519028/%E4%BF%AE%E6%94%B9%E5%B7%A6%E4%BE%A7%E8%AF%84%E6%B5%8B%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function() {

    'use strict';

    function f() {
        var ele = document.querySelectorAll('span.status');
        for(let e of ele){
            if(e.innerHTML.includes('M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'))e.innerHTML=`<button data-v-0640126c="" data-v-beeebc6e="" cff colorscheme="default" class="color-default" data-v-b5709dda="" style="border:none; background:none; color: inherit;"><svg data-v-1b44b3e6="" data-v-beeebc6e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon svg-inline--fa fa-check" data-v-0640126c="" style="color: rgb(82, 196, 26);"><path data-v-1b44b3e6="" fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" class=""></path></svg></button>`;
            else e.innerHTML=`<button data-v-0640126c="" data-v-beeebc6e="" cff colorscheme="default" class="color-default" data-v-b5709dda="" style="border:none; background:none; color: inherit;"><svg data-v-1b44b3e6="" data-v-beeebc6e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon svg-inline--fa fa-minus" data-v-0640126c="" style="opacity: 0.7;"><path data-v-1b44b3e6="" fill="currentColor" d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" class=""></path></svg></button>`;
        }
        ele=document.querySelectorAll('button[cff]');
        for(let e of ele){
            e.addEventListener("click", function() {
                if(!e.innerHTML.includes('M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'))e.innerHTML=`<button data-v-0640126c="" data-v-beeebc6e="" cff colorscheme="default" class="color-default" data-v-b5709dda="" style="border:none; background:none; color: inherit;"><svg data-v-1b44b3e6="" data-v-beeebc6e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon svg-inline--fa fa-check" data-v-0640126c="" style="color: rgb(82, 196, 26);"><path data-v-1b44b3e6="" fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" class=""></path></svg></button>`;
                else e.innerHTML=`<button data-v-0640126c="" data-v-beeebc6e="" cff colorscheme="default" class="color-default" data-v-b5709dda="" style="border:none; background:none; color: inherit;"><svg data-v-1b44b3e6="" data-v-beeebc6e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon svg-inline--fa fa-minus" data-v-0640126c="" style="opacity: 0.7;"><path data-v-1b44b3e6="" fill="currentColor" d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" class=""></path></svg></button>`;
            });
        }
    }
    f();



})();