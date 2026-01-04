// ==UserScript==
// @name         BiliBili 連結復原
// @namespace    Anong0u0
// @version      0.1.5
// @description  新版bilibili把連結嵌入屬性，導致無法右/中鍵直接開啟😡
// @author       Anong0u0
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @grant        none
// @run-at       document-start
// @license      beerware
// @downloadURL https://update.greasyfork.org/scripts/463170/BiliBili%20%E9%80%A3%E7%B5%90%E5%BE%A9%E5%8E%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/463170/BiliBili%20%E9%80%A3%E7%B5%90%E5%BE%A9%E5%8E%9F.meta.js
// ==/UserScript==

Node.prototype.changeTag = function (tag)
{
  const clone = document.createElement(tag)
  for (const attr of this.attributes) clone.setAttributeNS(null, attr.name, attr.value)
  while (this.firstChild) clone.appendChild(this.firstChild)
  this.replaceWith(clone)
  return clone
}

document.arrive("a[data-url]", (e) =>
{
    const link = e.getAttribute("data-url").match(/(?<=keyword=)[^&]+/)
    e.href = link ? `https://search.bilibili.com/all?keyword=${link}` : e.getAttribute("data-url")
    e.target = "_blank"
})

document.arrive("a[data-user-id]", (e) =>
{
    e.href = `https://space.bilibili.com/${e.getAttribute("data-user-id")}`
    e.target = "_blank"
})

document.arrive("div[data-user-id]", (e) =>
{
    e.changeTag("a")
    e.href = `https://space.bilibili.com/${e.getAttribute("data-user-id")}`
    e.target = "_blank"
})

