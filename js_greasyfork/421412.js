// ==UserScript==
// @name        一键开启github1s页面
// @namespace   github
// @author      伟大鱼塘
// @description 需配合https://github.com/conwnet/github1s使用
// @include     https://github.com/
// @match       https://github.com/*
// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/421412/%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AFgithub1s%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/421412/%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AFgithub1s%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

{
    setTimeout(() => {
        const href = `https://github1s.com${location.pathname}`
        const btn =
              `<a class="btn ml-2 d-none d-md-block" style="background: #8c7ae6; color: #fff;" target="_blank" href="${href}">` +
              '使用 github1s 打开' +
              '</a>'
        document.querySelector('.btn.ml-2.d-none.d-md-block').insertAdjacentHTML('beforeBegin', btn)
    }, 1000)
}
