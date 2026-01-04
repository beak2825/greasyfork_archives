// ==UserScript==
// @name         运行被屏蔽的脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  运行被知识库屏蔽的脚本
// @author       RYZENX
// @match        https://ku.baidu-int.com/knowledge/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503699/%E8%BF%90%E8%A1%8C%E8%A2%AB%E5%B1%8F%E8%94%BD%E7%9A%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/503699/%E8%BF%90%E8%A1%8C%E8%A2%AB%E5%B1%8F%E8%94%BD%E7%9A%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function $(s, p) {
        return (p || document).querySelector(s);
    }
    function $$(s, p) {
        return (p || document).querySelectorAll(s);
    }
    const append = function (e, p) {
        const container = document.querySelector(p);
        container.appendChild(e);
    };
    const inject = function (s, html, place) {
        const e = document.createElement(s);
        e.innerHTML = html;
        if (place) {
            append(e, place);
        }
        return e;
    };

    function main() {
        const allEmbedNodes = $$('div[data-slate-card-node-type="embed"]');
        allEmbedNodes.forEach((node) => {
            const containerNode = $('.mp-embed-wrapper', node);
            const scriptContent = containerNode.getAttribute('data-morpho-embed-source');
            if (scriptContent && scriptContent.toLowerCase().startsWith('javascript:')) {
                const scripts = scriptContent.replace(/javascript:/i, '');
                inject('script', `${scripts}`, 'body');
            }
        })
    }

    setTimeout(() => main(), 1000);
})();
