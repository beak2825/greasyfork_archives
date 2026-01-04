// ==UserScript==
// @name         新标签页打开Bing搜索结果
// @version      1.0.0
// @author       vertexz
// @description  将Bing搜索结果改为新标签页打开
// @match        *://*.bing.com/search*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuklEQVRYhe2WsXXCMBCG/xMNpbIBmSB0aa0wQDJBkgmINrDZwDgLQCZIBuDJKdN5gzCCShrrUhiwCNiI95wq/quz/XP3cZLOBnr1+u+iUKPUJoIrHwBxD2C0vV2AuACJmU3V+k8ApDYSjBjMuj0Tp1sQ2xmA1EbCuRygm8B8BQSpSyBE61NGfFCckUOQgqArm90RBCkAS+8XY7CLQ4sDLR2Q2ozg+Nujmdlskpz0TlcJQHXhqgt5CEBzB1xZFyNaNBUHAJtNEjDqgs49hBRvB4CoW08HbT6tAc3qC7rvAADjXRDYzsKLR10A7CW1kec8lx6/EIC1F4+bTDtJbSLvsmjyXQDAH/uw5PNHy5XP+5ioAwAh3uuEiOTUNEJUz8ST5581eX+rfRJOVylAL7WbFyCxtKnKt/tijJJjEKK9h5Hb1zvVDYA2Eo4NAvbAr7SJzVRQF1pPgU2VrcYtz89m8gcROGlbsmCAHYTNJhqCrlHNfX+DrQGeQ5Cq2s7evw6DCP4eCNXRe+HMcgy6Bth8veXD20cCKNreioa3z9h8LT9P+YMm4aWqXlyHy9Hk/ROAYwgOngu9ev0//QDmCZ48wX3K8AAAAABJRU5ErkJggg==
// @grant        none
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://github.com/zhj9709
// @downloadURL https://update.greasyfork.org/scripts/491181/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80Bing%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/491181/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80Bing%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    targetBlank(); //  修改为新标签页打开

    // 修改为新标签页打开
    function targetBlank() {
        document.head.appendChild(document.createElement('base')).target = '_blank'; // 让所有链接默认以新标签页打开
        Array.from(document.links).forEach(function (_this) { // 排除特殊链接
            if (_this.onclick || _this.href.slice(0,4) != 'http' || _this.getAttribute('href').slice(0,1) === '#') {
                _this.target = '_self'
            }
        })
        document.querySelectorAll('form').forEach(function (_this) { // 排除 form 标签
            if (!_this.target) {_this.target = '_self'}
        });
    }
})();