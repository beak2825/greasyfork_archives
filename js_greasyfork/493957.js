// ==UserScript==
// @name         萌娘百科节操模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让所有图片模糊，防止你查资料时因为不慎看到太涩的图而有损节操。（单击图片，仍然可以查看图片内容。）
// @author       firetree
// @match        https://*.moegirl.org.cn/*
// @match        https://moegirl.uk/*
// @icon         https://img.moegirl.org.cn/favicon.ico
// @grant        none
// @run-at       document-start
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/493957/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E8%8A%82%E6%93%8D%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/493957/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E8%8A%82%E6%93%8D%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style')
    style.id = 'userscript-no-image-style'
    style.innerHTML = `
a.image > img {
    filter: blur(10px);
}
`
    document.head.appendChild(style)
})();