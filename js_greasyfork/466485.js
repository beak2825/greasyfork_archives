// ==UserScript==
// @name         通义千问助手
// @name:zh      通义千问助手
// @name:zh-CN   通义千问助手
// @name:en      通义千问助手
// @namespace    http://tampermonkey.net/
// @author       麦丽素
// @version      0.2
// @description  通义千问去水印
// @description:en  通义千问去水印
// @match        https://tongyi.aliyun.com/chat
// @icon         https://img.alicdn.com/imgextra/i4/O1CN01c26iB51UyR3MKMFvk_!!6000000002586-2-tps-124-122.png
// @grant        none
// @run-at document-start
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/466485/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/466485/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

Object.defineProperty(window, 'MutationObserver', {
    writable: false,
    configurable: false
})

MutationObserver.prototype.observe = function(target, options) {
    console.log("Hook MutationObserver observe")
    this.disconnect();
    remove_water_mask();
}

Element.prototype._attachShadow = Element.prototype.attachShadow;
Element.prototype.attachShadow = function () {
    return this._attachShadow( { mode: "open" } );
};


function remove_water_mask() {
    let x = document.getElementsByTagName("div");
    let flag = false;
    for (var i = 0; i < x.length; i++) {
        if(x[i].shadowRoot){
            x[i].remove();
            flag = true;
        }
    }
    if (!flag) {
        setTimeout(remove_water_mask, 1000);
    }
}

(function () {
    "use strict";
    remove_water_mask();
    //loader();
})();
