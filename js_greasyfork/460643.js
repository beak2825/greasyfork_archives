// ==UserScript==
// @name         Jinxin Util Download
// @namespace    https://gitee.com/jinxin11112/tampermonkey
// @version      0.1.0
// @description  文件下载工具类
// @author       jinxin
// @icon         https://picss.sunbangyan.cn/2024/02/11/a19cea286d366718e1358c1060c7c04e.jpeg
// @grant        none
// @license MIT
// ==/UserScript==

function downloadFile(fileContent, title) {
    const blob = new Blob(fileContent, {type: "text/plain;charset=utf-8"});
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    if (!title) title = Date.now();
    tempLink.download = decodeURI(title + '.txt')
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
}
