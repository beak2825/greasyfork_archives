// ==UserScript==
// @name        微信文件传输助手网页版修复工具
// @namespace   kazutoiris
// @match       https://szfilehelper.weixin.qq.com/*
// @match       https://filehelper.weixin.qq.com/*
// @grant       none
// @version     1.0
// @author      kazutoiris
// @license     Anti-996 License
// @run-at      document-start
// @description 修复了微信文件传输助手网页版中的一些问题
// @downloadURL https://update.greasyfork.org/scripts/505110/%E5%BE%AE%E4%BF%A1%E6%96%87%E4%BB%B6%E4%BC%A0%E8%BE%93%E5%8A%A9%E6%89%8B%E7%BD%91%E9%A1%B5%E7%89%88%E4%BF%AE%E5%A4%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/505110/%E5%BE%AE%E4%BF%A1%E6%96%87%E4%BB%B6%E4%BC%A0%E8%BE%93%E5%8A%A9%E6%89%8B%E7%BD%91%E9%A1%B5%E7%89%88%E4%BF%AE%E5%A4%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 移除 HTML 转义
    let defineProperty = Object.defineProperty;
    Object.defineProperty = (obj, prop, descriptor) => {
        if (prop === "encodeHtml") {
            descriptor.get = () => (_) => _;
        }
        return defineProperty(obj, prop, descriptor);
    }

    // 登出后禁用关闭页面弹窗
    let e = setInterval((() => {
        let t = document.querySelectorAll("#app")[0].__vue_app__._component.components["v-qrcode"];
        if (t) {
            let setup = t.setup;
            t.setup = (e, t) => {
                window.onbeforeunload = null;
                return setup(e, t);
            }
            clearInterval(e);
        }
    }
    ), 300);
})();
