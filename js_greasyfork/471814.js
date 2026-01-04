// ==UserScript==
// @name         Wechat MP Font Customizer
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  A Script to Overwrite WeChat Official Account Post Font
// @author       Vizards Swift
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471814/Wechat%20MP%20Font%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/471814/Wechat%20MP%20Font%20Customizer.meta.js
// ==/UserScript==

const getUeEditorIframeBody = () => {
    const iframes = document.querySelectorAll('iframe')
    const editor = Array.from(iframes).find(iframe => iframe.id.startsWith('ueditor'))
    return editor.contentWindow.document.body
}

const initMutationObserver = (node, cb) => {
    const observer = new MutationObserver(cb);
    if (node) {
        observer.observe(node, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true
        });
    }
}

const callback = (nodeIterator) => {
    // 节点迭代器转为数组并返回
    const arrNodes = [];
    let node = nodeIterator.nextNode();
    while (node) {
        arrNodes.push(node);
        node = nodeIterator.nextNode();
    }

    arrNodes.forEach(node => {
       nodeModifiler(node)
    })
};

const nodeModifiler = (node) => {
    // 全量修改字体
    node.parentNode.style.fontFamily = 'Optima-Regular, PingFangTC-light, "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif'
}

(function() {
    'use strict';
    const editor = getUeEditorIframeBody()
    const nodeIterator = document.createNodeIterator(editor, NodeFilter.SHOW_TEXT, (node) => {
        return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    });
    initMutationObserver(editor, () => callback(nodeIterator))
})();