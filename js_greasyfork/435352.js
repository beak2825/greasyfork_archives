// ==UserScript==
// @name         掘金知乎Url净化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  清除掘金网站和知乎网站在点击链接的时候，需要跳转到确认页面，然后才能跳转
// @author       zsj
// @match        *://juejin.cn/*
// @match        *://www.zhihu.com/*
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435352/%E6%8E%98%E9%87%91%E7%9F%A5%E4%B9%8EUrl%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/435352/%E6%8E%98%E9%87%91%E7%9F%A5%E4%B9%8EUrl%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.onload = function(event) {
        const aArr = document.querySelectorAll("a");
      for (let i = 0; i < aArr.length; i++) {
        const href = decodeURIComponent(aArr[i].getAttribute("href"));
        const index = href.indexOf("target");
        let newHref = href;
        if (index > -1) {
          newHref = href.substring(index + 7);
        }
        aArr[i].setAttribute("href", newHref);
      }
    };
})();