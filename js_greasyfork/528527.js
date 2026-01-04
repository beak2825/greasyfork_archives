// ==UserScript==
// @name         こめID表示
// @namespace    ID
// @version      2.0
// @description  おんjでkomeにIDを表示。
// @author       Wai
// @match        *://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528527/%E3%81%93%E3%82%81ID%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/528527/%E3%81%93%E3%82%81ID%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addIDsToComments(targetNode = document) {
        targetNode.querySelectorAll('klog > div').forEach(div => {
            const uidElement = div.querySelector('.kkick[uid]');
            if (uidElement) {
                const uid = uidElement.getAttribute('uid');

                // すでにIDが表示されていたらスキップ
                if (div.querySelector('.kome-id')) return;

                // ID表示用の要素を作成
                const idSpan = document.createElement('span');
                idSpan.textContent = `[ID:${uid}] `;
                idSpan.className = 'kome-id';
                idSpan.style.color = 'white';   // 白色
                idSpan.style.fontSize = '8px';  // 大きさ
                idSpan.style.fontWeight = 'bold';
                idSpan.style.marginRight = '5px';

                // コメントの前に追加（TEXT_NODEを探してその前に挿入）
                const commentNode = Array.from(div.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                if (commentNode) {
                    div.insertBefore(idSpan, commentNode);
                } else {
                    div.appendChild(idSpan); // 念のため、テキストノードがない場合は末尾に追加
                }
            }
        });
    }

    // Komeの更新を監視（新規コメントが追加されたらIDも追加）
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    addIDsToComments(node); // 追加されたコメントにも適用
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初回実行
    addIDsToComments();
})();