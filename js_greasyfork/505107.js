// ==UserScript==
// @name        隐藏题解
// @namespace   https://greasyfork.org/users/1357480
// @description 隐藏洛谷题目的题解
// @match       *://*.luogu.com.cn/problem/solution/*
// @version     hide.solution
// @grant       none
// @license     GPL3
// @downloadURL https://update.greasyfork.org/scripts/505107/%E9%9A%90%E8%97%8F%E9%A2%98%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/505107/%E9%9A%90%E8%97%8F%E9%A2%98%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideSolution() {
        const card = document.querySelector('div.card.padding-none');
        if (card) {
            card.innerHTML = `<div data-v-6b0deb92="" data-v-f9624136="" class="card-header"><b data-v-6b0deb92="" data-v-f9624136="">1 篇题解</b> <span data-v-6b0deb92="" data-v-f9624136="" style="float: right;"><div data-v-01f8a102="" data-v-6b0deb92="" class="selection" data-v-f9624136="" style="display: inline-flex;"><!----> <ul data-v-01f8a102=""><li data-v-01f8a102="" class="selected"><span data-v-01f8a102="">
        默认排序
      </span></li><li data-v-01f8a102="" class=""><span data-v-01f8a102="">
        按时间排序
      </span></li></ul></div></span></div><div data-v-6b0deb92="" data-v-f9624136="" class="card-body"><div data-v-b5709dda="" data-v-6b0deb92="" class="list" data-v-f9624136=""><div data-v-b5709dda="" class="block"><!----> <div data-v-b5709dda="" class="row-wrap"> <div data-v-6b0deb92="" data-v-b5709dda="" class="item-row"><div data-v-530f8b1f="" data-v-6b0deb92="" class="solution-article" data-v-b5709dda=""><div data-v-530f8b1f="" class="header"><div data-v-530f8b1f="" class="left"><span data-v-530f8b1f="" class="user"><img data-v-530f8b1f="" src="https://cdn.luogu.com.cn/upload/usericon/3.png" class="avatar"> <span data-v-79952194="" data-v-530f8b1f=""><span data-v-1f03983a="" data-v-79952194=""><span data-v-1f03983a=""><a data-v-0640126c="" data-v-79952194="" href="/user/3" target="_blank" colorscheme="none" class="color-none" data-v-1f03983a=""><span data-v-79952194="" data-v-0640126c="" style="font-weight: bold; color: rgb(157, 61, 207);" class="lg-fg-purple">
  洛谷
</span></a></span> </span> <!----> <!----></span></span> <span data-v-530f8b1f="" class="lfe-caption">创建时间：1970-01-01 00:00:00</span></div> <span data-v-530f8b1f="" class="right"><a data-v-0640126c="" data-v-530f8b1f="" href="/" colorscheme="default" class="color-default">
        返回主页
      </a></span></div> <div data-v-530f8b1f="" class="main" style="position: relative;"><div data-v-15e4f65b="" data-v-530f8b1f="" class="collapsed-wrapper"><div data-v-15e4f65b="" class="" style="--lcollapsed-height: 320px;"><div data-v-e5ad98f0="" data-v-530f8b1f="" class="marked" data-v-15e4f65b=""><p>题解功能已屏蔽。</p>








</div></div> <!----></div><div dir="ltr" class="resize-sensor" style="pointer-events: none; position: absolute; inset: 0px; overflow: hidden; z-index: -1; visibility: hidden; max-width: 100%;"><div class="resize-sensor-expand" style="pointer-events: none; position: absolute; inset: 0px; overflow: hidden; z-index: -1; visibility: hidden; max-width: 100%;"><div style="position: absolute; left: 0px; top: 0px; transition: all 0s ease 0s; width: 483px; height: 34px;"></div></div><div class="resize-sensor-shrink" style="pointer-events: none; position: absolute; inset: 0px; overflow: hidden; z-index: -1; visibility: hidden; max-width: 100%;"><div style="position: absolute; left: 0px; top: 0px; transition: all 0s ease 0s; width: 200%; height: 200%;"></div></div></div></div> <div data-v-530f8b1f="" class="operations" style=""><span data-v-530f8b1f="" class="button thumb-up"><svg data-v-530f8b1f="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="thumbs-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-thumbs-up"><path data-v-530f8b1f="" fill="currentColor" d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" class=""></path></svg>
      0
    </span> <span data-v-530f8b1f="" class="button thumb-down"><svg data-v-530f8b1f="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="thumbs-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-thumbs-down"><path data-v-530f8b1f="" fill="currentColor" d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z" class=""></path></svg></span> <span data-v-530f8b1f="" class="button reply"><svg data-v-530f8b1f="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-comment"><path data-v-530f8b1f="" fill="currentColor" d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" class=""></path></svg>
      0 条评论
    </span> <span data-v-530f8b1f="" class="button" style="float: right; font-size: 1rem;">
      收起&nbsp;<svg data-v-530f8b1f="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-chevron-up"><path data-v-530f8b1f="" fill="currentColor" d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" class=""></path></svg></span></div> <div data-v-14c11e75="" data-v-0ac204f4="" data-v-530f8b1f="" class="modal hide"><div data-v-14c11e75="" class="background"></div> <!----></div></div></div></div></div> <div data-v-b5709dda="" class="bottom"><div data-v-b5709dda="" class="bottom-inner"> <div data-v-b5709dda="" class="page-bar"><span data-v-b5709dda="" class="total">
          共 <strong data-v-b5709dda="">1</strong> 页
        </span> <div data-v-453d795e="" data-v-b5709dda=""><!----> <button data-v-453d795e="" class="selected"><span data-v-453d795e="" class="number">1</span></button> <!----></div></div></div></div></div></div>`;
            return true;
        }
        return false;
    }
    const observer = new MutationObserver((mutations, obs) => {
        if (hideSolution()) {
            obs.disconnect();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();