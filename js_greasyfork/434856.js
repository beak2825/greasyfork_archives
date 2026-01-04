// ==UserScript==
// @namespace xavierror
// @name 琉璃神社脚本
// @description 不展示图片 高亮磁力链接
// @version 0.0.1
// @author xavierror
// @github github.com/xavierror
// @include *://*hacg.*/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/434856/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434856/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(() =>{
    window.document.querySelectorAll('img').forEach(i=>i.remove())

    document.querySelectorAll('p').forEach(p=>{
        if(/([a-z]|[0-9]){40}/g.test(p.innerText.trim())) {
            const idx = p.innerText.trim().search(/([a-z]|[0-9]){40}/g)
            p.innerHTML = `<a href=magnet:?xt=urn:btih:${p.innerText.trim().substr(idx,40)}>链接</a>`
        }
    })
})();
