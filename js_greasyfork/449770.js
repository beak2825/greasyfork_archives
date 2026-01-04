// ==UserScript==
// @name         Remove Feishu announce
// @version      1.0.0
// @description  remove incompatible extension announce
// @icon         https://sf3-scmcdn2-cn.feishucdn.com/ccm/pc/web/resource/bear/src/common/assets/favicons/icon_global_feishu_nor_new-32x32.735ebd07c83b512067bd.png

// @author       bnourne7
// @namespace    http://tampermonkey.net/
// @license      MIT

// @match        https://*.feishu.cn/*
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/449770/Remove%20Feishu%20announce.user.js
// @updateURL https://update.greasyfork.org/scripts/449770/Remove%20Feishu%20announce.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除不兼容的提示
    console.log("------------------ start removing not-compatible__announce ------------------");
    function removeE(){
        var e=document.querySelectorAll(".not-compatible__announce")[0];
        console.log(e);
        if(e){
            e.parentNode.removeChild(e)
        }
    };

    setTimeout(function () {
        removeE();
    }, 10000);

    removeE();
})();

