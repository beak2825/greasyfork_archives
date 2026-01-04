// ==UserScript==
// @name         有谱么·纯净看谱插件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  这是一个自用的油猴脚本，用于解决看谱不能充分利用屏幕空间的缺点，请注意，此插件移除了除谱本身内容以外的所有功能和内容，如果有需要（比如播放）请勿启用。此脚本仅供学习和参考JavaScript使用，请使用者在下载后24小时内删除，本人不负一切因此脚本而产生的法律责任。
// @author       AnnSir
// @match        *://yopu.co/view/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/466783/%E6%9C%89%E8%B0%B1%E4%B9%88%C2%B7%E7%BA%AF%E5%87%80%E7%9C%8B%E8%B0%B1%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/466783/%E6%9C%89%E8%B0%B1%E4%B9%88%C2%B7%E7%BA%AF%E5%87%80%E7%9C%8B%E8%B0%B1%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {

})();
(function() {
    'use strict';

    setTimeout(() => {
    // 移除无用元素
    const headerElems = document.querySelectorAll('header.svelte-19k88m6');
    headerElems.forEach(headerElem => {
        headerElem.remove();
    });

    const sideElems = document.querySelectorAll('div.side.svelte-dbj6vu');
    sideElems.forEach(sideElem => {
        sideElem.remove();
    });
    const selectedElems = document.querySelectorAll('div.at-cursor-bar');
    selectedElems.forEach(selectedElem => {
        selectedElem.remove();
    });
    const beatElems = document.querySelectorAll('div.at-cursor-beat');
    beatElems.forEach(beatElem => {
        beatElem.remove();
    });
    //修改打印设置为允许打印，去除打印提示页
    const doNotPrintElem = document.querySelector('.no-print');
    if (doNotPrintElem) {
        doNotPrintElem.setAttribute("class","allow-print");
    }

    const printElems = document.querySelectorAll('div.print-sheet.svelte-10d563p');
    printElems.forEach(printElem => {
        printElem.remove();
    });

    const playerPanelElems = document.querySelectorAll('div.player-panel.svelte-8wqidh');
    playerPanelElems.forEach(playerPanelElem => {
        playerPanelElem.remove();
    });

    // 修改特定元素宽高，适应打印
    const layoutElem = document.querySelector('.layout.svelte-dbj6vu.nier');
    if (layoutElem) {
        layoutElem.style.width = '100%';
        layoutElem.style.margin = '0';
    }


    const mainElem = document.querySelector('div.main.svelte-dbj6vu');
    if (mainElem) {
        mainElem.style.marginRight = 'unset';
        mainElem.style.height = 'calc(105vh - 67px)';
    }
    }, 200);
})();