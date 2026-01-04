// ==UserScript==
// @name         易搭保存纯 HTML
// @version      1.0.0
// @namespace    https://g.hz.netease.com/zhuning1
// @description  访问易搭页面增加保存纯 HTML 按钮
// @author       zhuning1@corp.netease.com
// @match        https://*/g/yida/*
// @icon         https://s1.music.126.net/style/favicon.ico
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/494466/%E6%98%93%E6%90%AD%E4%BF%9D%E5%AD%98%E7%BA%AF%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/494466/%E6%98%93%E6%90%AD%E4%BF%9D%E5%AD%98%E7%BA%AF%20HTML.meta.js
// ==/UserScript==

(() => {
    const id = 'pure-html';

    const remove = (node) => {
        try {
            node.parentNode.removeChild(node);
        } catch (e) {}
    };

    const save = async () => {
        const root = document.documentElement.cloneNode(true);
        remove(root.querySelector('#' + id));

        const scriptList = root.querySelectorAll('script');
        for (let script of scriptList) {
            remove(script);
        }

        const linkList = root.querySelectorAll('link');
        for (let link of linkList) {
            if (link.rel === 'stylesheet') {
                const css = await fetch(link.href).then(_ => _.text());
                const style = document.createElement('style');
                style.innerHTML = css;
                root.querySelector('head').appendChild(style);
            }
            remove(link);
        }

        const a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(root.outerHTML));
        a.setAttribute('download', 'pure.html');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        remove(a);
    };

    const button = document.documentElement.appendChild(document.createElement('button'));
    button.id = id;
    button.innerHTML = '保存为纯 HTML';
    button.style.cssText = `
        position: fixed;
        bottom: 16px;
        right: 16px;
        font-size: 16px;
        padding: 8px;
        background: #f0f0f0;
        border: 1px solid #999;
        color: #333;
        z-index: 1000;
    `;

    button.onclick = save;
})();

