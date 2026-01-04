// ==UserScript==
// @name         diskgirl 图片批量下载
// @namespace    https://github.com/SIKll
// @version      1.0.0
// @description  diskgirl 图片批量下载,解放双手
// @author       SIKll
// @match        *://*.jike.info/*
// @match        *://*.diskgirl.com/image/*
// @connect      jike.info
// @connect      diskgirl.com
// @include      *://*.jike.info/*
// @include      *://*.diskgirl.com/image/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3.4.0/dist/jszip.min.js
// @note         20-05-11 v1.0.0 初版
// @downloadURL https://update.greasyfork.org/scripts/403088/diskgirl%20%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/403088/diskgirl%20%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

'use strict';
const version = "1.0.0";
// TODO: 直接文件 zip 打包下载
// TODO: 修改样式
(function () {
    if (["diskgirl.com", "jike.info"].indexOf(new URL(window.location.href).hostname) === -1) {
        return null;
    }
    let container = document.createElement("div");
    let directLink = document.createElement("button");
    let sh = document.createElement("button");
    directLink.onclick = () => download(1);
    directLink.innerText = "保存为直链";
    sh.onclick = () => download(2);
    sh.innerText = "保存为Shell脚本";
    container.appendChild(directLink);
    container.appendChild(sh);
    container.setAttribute('style', 'right: 2%;position: absolute;margin: auto;top: 10%;z-index: 999999;');
    document.body.appendChild(container);
})();
/**
 * 获取图片基本信息
 * @returns [图片数量, 图片基本链接, 后缀名]
 */
function getImgInfo(className) {
    let tmp = document.getElementsByClassName(className)[0].getElementsByTagName("img");
    let tmpSrc = tmp[0].currentSrc.trim();
    let prefix = "";
    let reg = new RegExp("\\d+\\.(jpe?g|png)$", "gi");
    if (tmpSrc.match(reg) !== null) {
        prefix = tmpSrc.split("/").pop().split(".").pop();
        tmpSrc = tmpSrc.replace(reg, "");
    } else {
        return null;
    }
    return [tmp.length, tmpSrc, prefix];
}
/**
 * 获取图片链接
 */
function getImgLink() {
    let imgList = [];
    let currentURL = window.location.href;
    let className = "";
    if (currentURL.match("diskgirl.com") !== null) {
        className = "waterfall";
    } else if (currentURL.match("jike.info") !== null) {
        className = "content";
    } else {
        return null;
    }
    let tmp = getImgInfo(className);
    if (tmp === null) {
        return;
    }
    for (let i = 0; i < tmp[0]; i++) {
        imgList.push(tmp[1] + i + "." + tmp[2]);
    }
    return imgList;
}
/**
 * 保存到文件
 * @param {String} content 内容
 * @param {String} filename 文件名
 */
function toFile(content, filename) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};
/**
 * 生成下载文件
 * @param {int} type 1：保存为直链文本文件，2：保存为shell 脚本文件
 */
function download(type) {
    let imgList = getImgLink();
    let downloadInfo = [];
    let date = new Date();
    switch (type) {
        case 1:
            downloadInfo[0] = '';
            imgList.forEach(value => {
                downloadInfo[0] += `${value}\n`
            })
            downloadInfo[1] = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.txt`;
            break;
        case 2:
            downloadInfo[0] = '#!/bin/bash\n';
            imgList.forEach(value => {
                downloadInfo[0] += `wget ${value} -q --show-progress\n`
            })
            downloadInfo[1] = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.txt`;
            break;
    }
    toFile(downloadInfo[0], downloadInfo[1]);
}