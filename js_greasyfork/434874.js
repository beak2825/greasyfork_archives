// ==UserScript==
// @name         操你妈百度
// @namespace    https://greasyfork.org/zh-CN/scripts/434874-%E6%93%8D%E4%BD%A0%E5%A6%88%E7%99%BE%E5%BA%A6
// @version      0.3
// @description  操你妈李彦宏
// @author       You
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434874/%E6%93%8D%E4%BD%A0%E5%A6%88%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/434874/%E6%93%8D%E4%BD%A0%E5%A6%88%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 屏蔽九游
    Array.from(document.getElementsByClassName('c-showurl c-color-gray')).forEach((ele, index) => {
        if (ele.innerText.indexOf('9game') !== -1) {
            Array.from(document.getElementsByClassName('result c-container new-pmd'))[index].style.display = 'none'
        }
    })
    // 提示好看视频
    let detail_dom = document.evaluate('//*[text()="详细 >"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0)
    if (detail_dom.parentNode.href.indexOf('haokan.baidu.com') != -1) {
        detail_dom.innerText = '好看视频 >'
    }
    // Your code here...
})();