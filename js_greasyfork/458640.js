// ==UserScript==
// @name         拼题A(Pintia)反制防止粘贴
// @namespace    http://tampermonkey.net/
// @homepageURL  https://github.com/uf-hy/Pintia_ForceAllowPaste
// @version      1.01
// @description  随便瞎写的, 好好学习
// @author       uhfy
// @match        https://pintia.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://pintia.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458640/%E6%8B%BC%E9%A2%98A%28Pintia%29%E5%8F%8D%E5%88%B6%E9%98%B2%E6%AD%A2%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/458640/%E6%8B%BC%E9%A2%98A%28Pintia%29%E5%8F%8D%E5%88%B6%E9%98%B2%E6%AD%A2%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function () {
    var _addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, useCapture) {
        if (type === "paste") return;//我tm直接防止粘贴事件监听器注册,桀桀
        _addEventListener.apply(this, arguments);
    }
})();




