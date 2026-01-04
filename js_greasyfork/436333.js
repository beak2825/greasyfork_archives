// ==UserScript==
// @name         echarts 文档自动展开节点
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  echarts auto open document node
// @author       aries.zhou
// @match        https://echarts.apache.org/zh/opti**
// @match        https://echarts.apache.org/en/opt**
// @icon         https://www.google.com/s2/favicons?domain=apache.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436333/echarts%20%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E8%8A%82%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/436333/echarts%20%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E8%8A%82%E7%82%B9.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
window.addEventListener('load',async function () {
    for (let i = 0; i < 10; i++) {
        var nodes = document.getElementsByClassName('expand-toggle el-icon-circle-plus-outline');
        console.log(nodes.length)
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].click();
        }
        await sleep(500);
    }
})();
