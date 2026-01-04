// ==UserScript==
// @name        一键开启github1s页面
// @namespace   github
// @author      伟大鱼塘, PinkD
// @description 需配合 https://github.com/conwnet/github1s 使用
// @include     https://github.com/
// @match       https://github.com/*
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/427714/%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AFgithub1s%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/427714/%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AFgithub1s%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getElement() {
    let e = null
    // 100*100ms = 10s
    let count = 100
    while (e == null && count > 0) {
        await sleep(100)
        e = document.querySelector('.btn.ml-2.d-none.d-md-block')
        count--
    }
    return e
}

{
    const href = `https://github1s.com${location.pathname}`
    const btn =
        `<a class="btn ml-2 d-none d-md-block" style="background: #8c7ae6; color: #fff;" target="_blank" href="${href}">` +
        'github+1s' +
        '</a>'
    getElement().then(function(e) {
        e.insertAdjacentHTML('beforeBegin', btn)
    })
}
