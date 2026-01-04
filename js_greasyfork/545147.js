// ==UserScript==
// @name         [Bangumi]将问号电视(bgm125)替换为流汗电视(bgm102)
// @namespace    https://greasyfork.org/zh-CN/users/1386262-zintop
// @version      1.0
// @description  启用组件后，所有问号电视(bgm125)将被替换为流汗电视(bgm102)，包括贴贴和表情。
// @author       zin
// @license      MIT
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545147/%5BBangumi%5D%E5%B0%86%E9%97%AE%E5%8F%B7%E7%94%B5%E8%A7%86%28bgm125%29%E6%9B%BF%E6%8D%A2%E4%B8%BA%E6%B5%81%E6%B1%97%E7%94%B5%E8%A7%86%28bgm102%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545147/%5BBangumi%5D%E5%B0%86%E9%97%AE%E5%8F%B7%E7%94%B5%E8%A7%86%28bgm125%29%E6%9B%BF%E6%8D%A2%E4%B8%BA%E6%B5%81%E6%B1%97%E7%94%B5%E8%A7%86%28bgm102%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pattern = '/img/smiles/tv/102.gif';
    const replacer = 'https://bgm.tv/img/smiles/tv/79.gif';

    function replaceAll(node = document) {
        node.querySelectorAll(`img[src="${pattern}"]`).forEach(img => {
            img.src = replacer;
        });

        node.querySelectorAll(`span[style="background-image: url('${pattern}');"]`).forEach(span => {
            span.style = `background-image: url('${replacer}');`;
        });

        node.querySelectorAll('template').forEach(tpl => {
            tpl.innerHTML = tpl.innerHTML.replaceAll(pattern, replacer);
        });
    }

    replaceAll(document);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    replaceAll(node);
                }
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();