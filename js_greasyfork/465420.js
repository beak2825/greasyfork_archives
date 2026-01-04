// ==UserScript==
// @name         公文写作宝 - 免会员下载文档全文图片
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  公文写作宝 - 免会员下载文档全文图片脚本
// @author       Bakapiano
// @match        https://gwxzb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465420/%E5%85%AC%E6%96%87%E5%86%99%E4%BD%9C%E5%AE%9D%20-%20%E5%85%8D%E4%BC%9A%E5%91%98%E4%B8%8B%E8%BD%BD%E6%96%87%E6%A1%A3%E5%85%A8%E6%96%87%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/465420/%E5%85%AC%E6%96%87%E5%86%99%E4%BD%9C%E5%AE%9D%20-%20%E5%85%8D%E4%BC%9A%E5%91%98%E4%B8%8B%E8%BD%BD%E6%96%87%E6%A1%A3%E5%85%A8%E6%96%87%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
 
(function() {
    const button = document.createElement("button");
    button.style.fontSize = "24px"
    button.style.position = "fixed"
    button.style.top = "0"
    button.style.left = "0"
    button.style.zIndex = 999999999999999999
    button.style.backgroundColor = "red"
    button.textContent = "Download"
    button.onclick = () => {
        const img = document.querySelector("#pageNo1 > img")
        const src = img.src.split("?")[0]
        const maxPageNum = Number(document.querySelector("#fullscreen1 > div.viewleft > div.pageinfo > div > div.goto-page > span:nth-child(3)").innerText)
        for (let i=1; i<=maxPageNum; ++i) {
            const temp = src.split("/")
            temp[temp.length - 1] = temp[temp.length - 1].replace("1", String(i))
            const newSrc = temp.join("/")
            const name = temp[temp.length - 1]
            window.open(newSrc)
        }
    }
    document.body.append(button);
})();