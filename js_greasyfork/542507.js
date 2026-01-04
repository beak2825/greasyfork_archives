// ==UserScript==
// @name         SNI 插件 - 仅在全屏模式显示
// @namespace    ckyl-bili-sni-fullscreenonly
// @version      2025-07-14
// @description  仅在全屏状态下显示SNI栏，非全屏下隐藏
// @author       CKylinMC
// @match        https://*.bilibili.com/*
// @exclude      https://www.bilibili.com/bangumi/play*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/542507/SNI%20%E6%8F%92%E4%BB%B6%20-%20%E4%BB%85%E5%9C%A8%E5%85%A8%E5%B1%8F%E6%A8%A1%E5%BC%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/542507/SNI%20%E6%8F%92%E4%BB%B6%20-%20%E4%BB%85%E5%9C%A8%E5%85%A8%E5%B1%8F%E6%A8%A1%E5%BC%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function toggleSNI(show=true){
        const id = "sni-plugin-fullscreenonly";
        let css = document.querySelector("style#"+id);
        if(!css) {
            css = document.createElement("style");
            css.id = id;
            document.head.appendChild(css);
        }
        css.innerHTML = '';
        css.appendChild(document.createTextNode(`
        #ck-sni-container{
            display: ${show?"block":"none"} !important;
        }
        `));
    }

    function applyState(){
        const element = document.fullscreenElement ||
                  document.webkitFullscreenElement ||
                  document.mozFullScreenElement ||
                  document.msFullscreenElement;
        return toggleSNI(!!element);
    }

    function hookEvents(){
        ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
            .forEach(event => {
            try{document.removeEventListener(event, applyState);}catch(_){/*ignored*/}
            document.addEventListener(event, applyState);
        });
        applyState();
    }

    hookEvents();
})();