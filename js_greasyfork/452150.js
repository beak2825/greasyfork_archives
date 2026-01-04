// ==UserScript==
// @name               Textlink to Hyperlink
// @name:zh-CN         文本链接自动识别为超链接
// @version            0.1.6
// @description        Recognize links in text by regular expression, and convert to hyperlinks
// @description:zh-CN  通过正则表达式识别文本中的链接，并转换为超链接
// @author             DreamNya
// @match              *://*/*
// @grant              none
// @run-at             document-start
// @license            MIT
// @namespace https://greasyfork.org/users/809466
// @downloadURL https://update.greasyfork.org/scripts/452150/Textlink%20to%20Hyperlink.user.js
// @updateURL https://update.greasyfork.org/scripts/452150/Textlink%20to%20Hyperlink.meta.js
// ==/UserScript==

//最大识别次数，默认5次，可修改，每个节点识别次数超过限制后自动忽略（针对一些冲突节点）
const formatLimit = 5;
const formatList = new WeakMap();

//文本链接识别正则
const reg = /https?:\/\/[\w\.-]+\.\w+(:\d{1,5})?(\/[#%\w?&.=\-@]+)*/g;
//忽略标签类型
const ignore = ['SCRIPT', 'STYLE', 'A', 'TEXTAREA', 'NOSCRIPT', 'CODE', 'TITLE'];

//脚本运行时遍历所有节点
QueryElement(document);

//后续通过观察器监视
let obs = new MutationObserver(m => {
    m.forEach(mm => {
        FormatHref(mm.target, mm.addedNodes)
        mm.addedNodes.forEach(i => QueryElement(i))
    })
});
obs.observe(document, { subtree: true, childList: true });

function QueryElement(element) {
    //用了点语法糖
    [...(element.querySelectorAll?.("*") ?? [])].forEach(i => FormatHref(i, i.childNodes))
}

function FormatHref(target, childNodes) {
    //忽略标签
    if (ignore.find(n => n == target.nodeName) || target.translate == false) return

    //超过次数限制忽略
    let formatTimes = formatList.get(target) || 0
    if (formatTimes > formatLimit) return

    let mark = false;

    //文本链接构造为a标签
    [...childNodes].forEach(c => {
        if (c.nodeName == '#text' && c.textContent.match(reg)) {
            console.log(target, c.textContent)
            c.textContent = c.textContent.replace(reg, (m) => { return `<a href='${m}' target='_blank'>${m}</a>` })
            mark = true
        }
    })

    //格式化标签
    if (mark) {
        //console.log(target,target.nodeName, formatTimes)
        formatList.set(target, formatTimes + 1)
        target.innerHTML = target.innerHTML.replace(/&lt;a /g, "<a ").replace(/&lt;\/a&gt;/g, "</a>").replace(/' target='_blank'&gt;/g, "' target='_blank'>")
    }
}