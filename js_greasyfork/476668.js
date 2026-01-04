// ==UserScript==
// @name         172商品详情界面清晰度优化
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  让商品详情页更清晰
// @author       aotmd
// @match        https://haokawx.lot-ml.com/h5order/index*
// @match        https://172.lot-ml.com/h5orderEn/index*
// @noframes
// @license MIT
// @run-at document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476668/172%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E7%95%8C%E9%9D%A2%E6%B8%85%E6%99%B0%E5%BA%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/476668/172%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E7%95%8C%E9%9D%A2%E6%B8%85%E6%99%B0%E5%BA%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {

    addStyle(`
body, body > * {
    max-width: 810px!important;
}
.view_bottom {
    max-width: calc(800px - 6%)!important;
}
.wjcen {
    display: none!important;
}
    `);

    //添加css样式
    function addStyle(rules) {
        let styleElement = document.createElement('style');
        styleElement["type"] = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
})();