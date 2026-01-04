// ==UserScript==
// @name               公众号文本地址转超链接
// @name:zh-CN         公众号文本地址转超链接
// @name:en            Wechat Text Link to Hyperlink
// @description        公众号文本地址转超链接，让链接变得可点击。
// @description:zh-CN  公众号文本地址转超链接，让链接变得可点击。
// @description:en     Wechat Text Link to Hyperlink，Make links Clickable.
// @namespace          https://www.runningcheese.com
// @version            0.3
// @author             RunningCheese
// @match              https://mp.weixin.qq.com/s/*
// @match              https://mp.weixin.qq.com/s?__biz=*
// @run-at             document-start
// @icon               https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mp.weixin.qq.com
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/461343/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E6%9C%AC%E5%9C%B0%E5%9D%80%E8%BD%AC%E8%B6%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/461343/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E6%9C%AC%E5%9C%B0%E5%9D%80%E8%BD%AC%E8%B6%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


const formatLimit = 5;
const formatList = new WeakMap();
const reg = /\b((?:https?:\/\/)?(?![\d-]+\.[\d-]+)([\w-]+(\.[\w-]+)+[\S^\"\'\[\]\{\}\>\<]*))/gi;
const ignore = ['SCRIPT', 'STYLE', 'A', 'TEXTAREA', 'NOSCRIPT', 'CODE', 'TITLE'];

QueryElement(document);
let obs = new MutationObserver(m => {
    m.forEach(mm => {
        FormatHref(mm.target, mm.addedNodes)
        mm.addedNodes.forEach(i => QueryElement(i))
    })
});
obs.observe(document, { subtree: true, childList: true });
function QueryElement(element) {
[...(element.querySelectorAll?.("*") ?? [])].forEach(i => FormatHref(i, i.childNodes))}
function FormatHref(target, childNodes) {
    if (ignore.find(n => n == target.nodeName) || target.translate == false) return
    let formatTimes = formatList.get(target) || 0
    if (formatTimes > formatLimit) return
    let mark = false;
    [...childNodes].forEach(c => {
        if (c.nodeName == '#text' && c.textContent.match(reg)) {
            console.log(target, c.textContent)
            c.textContent = c.textContent.replace(reg, (m) => { return `<a href='${m}' target='_blank'>${m}</a>` })
            mark = true
        }
    })
    if (mark) {
        //console.log(target,target.nodeName, formatTimes)
        formatList.set(target, formatTimes + 1)
        target.innerHTML = target.innerHTML.replace(/&lt;a /g, "<a ").replace(/&lt;\/a&gt;/g, "</a>").replace(/' target='_blank'&gt;/g, "' target='_blank'>")
    }
}