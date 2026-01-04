// ==UserScript==
// @name         知识星球评论提取（转图片）
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  提取知识星球的完整评论并转为图片下载
// @author       Cozak
// @icon         https://favicon.yandex.net/favicon/zsxq.com
// @license      GPL version 3
// @grant        none
// @match        https://wx.zsxq.com/dweb2/index/group/*
// @require-need      https://html2canvas.hertzen.com/dist/html2canvas.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/487546/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E8%AF%84%E8%AE%BA%E6%8F%90%E5%8F%96%EF%BC%88%E8%BD%AC%E5%9B%BE%E7%89%87%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/487546/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E8%AF%84%E8%AE%BA%E6%8F%90%E5%8F%96%EF%BC%88%E8%BD%AC%E5%9B%BE%E7%89%87%EF%BC%89.meta.js
// ==/UserScript==

/* 导出评论节点为图片并下载 */
function downloadComments2Img(dcm) {
    const cmtNodes = dcm.getElementsByClassName('comment-container');
    if (0 == cmtNodes.length) {
        return;
    }
    let mergeNode = document.createElement('div'), oA;
    for (let nd of cmtNodes) {
        mergeNode.appendChild(nd.cloneNode(true));
    }
    // 在评论位置插入临时合成节点，确保生成的节点样式一致
    let pointCut = cmtNodes[0];
    pointCut.parentElement.insertBefore(mergeNode, pointCut);
    html2canvas(mergeNode, {
        allowTaint: true,
        useCORS: true,
        height: mergeNode.offsetHeight,
        width: mergeNode.offsetWidth,
        x: -10,
        y: 10,
        scrollY: 0,
        scrollX: 0
    }).then(async (canvas) => {
        oA = document.createElement('a');
        oA.href = canvas.toDataURL(); // 导出图片
        oA.download = '评论截图';
        oA.click();
    }).then(async () => {
        mergeNode.remove();
        oA.remove();
    }).catch((err) => {
        console.error(err);
    });
}

/* 添加下载按钮 */
function addDownloadButton(dcm) {
    let buttonPad = dcm.getElementsByClassName('like-user')[0];
    let downBut = document.createElement('button');
    downBut.type = 'button';
    downBut.innerHTML = '提取评论';
    downBut.addEventListener('click', function(){downloadComments2Img(dcm)});
    buttonPad.appendChild(downBut);
}

/* 初始化 */
(function() {
    'use strict';
    // 兼容 page cache 开启的情况，待窗口完成加载再执行
    window.onload = function() {
        // 添加 DOM 变更监听，捕获目标节点变更动作
        const mct = document.getElementsByClassName('main-content-container')[0];
        let mctObs = new MutationObserver(mutations => {
            let curDcm = mutations[0].addedNodes[0];
            if (curDcm instanceof HTMLElement
                && 'APP-TOPIC-DETAIL' == curDcm.tagName) {
                addDownloadButton(curDcm);
            }
        });
        mctObs.observe(mct, {'childList':true});
    }
})();