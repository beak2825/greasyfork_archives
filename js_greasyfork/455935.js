// ==UserScript==
// @name         网课助手
// @namespace    https://enncy.cn
// @homepage     https://enncy.github.io/online-course-script/
// @source       https://github.com/enncy/online-course-script/
// @icon         https://cdn.ocs.enncy.cn/logo.ico
// @license      MIT
// @version      3.9.8
// @description  网课助手，支持超星学习通。
// @author       zcy-could
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.org.cn/*
// @match        *://*.zhihuishu.com/*
// @require      https://cdn.jsdelivr.net/npm/ocsjs@3.9.6/dist/index.min.js
// @resource     OCS_STYLE https://cdn.jsdelivr.net/npm/ocsjs@3.9.6/dist/style.css
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/455935/%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/455935/%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/* eslint no-undef: 0 */

(function () {
    "use strict";

    if(typeof OCS === 'undefined'){
        var href = prompt('检测到 OCS网课助手 加载失败，请尝试安装以下脚本：','https://scriptcat.org/script-show-page/367');
        window.open(href,'_blank');
    }else{
        // 将OCS对象加入到全局属性
        unsafeWindow.OCS = OCS;
        // 运行脚本
        OCS.start({
            // 加载样式
            style: GM_getResourceText("OCS_STYLE"),
            // 支持拖动
            draggable: true,
            // 加载默认脚本列表，默认 OCS.definedScripts
            scripts: OCS.definedScripts,
        });
    }
})();