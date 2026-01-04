// ==UserScript==
// @name         文生文试卷答题展开
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  企鹅标注文生文试卷答题展开
// @author       Jiyao
// @match        https://qlabel.tencent.com/*
// @license      AGPL-3.0
// @grant        GM_addStyle
// @grant        GM_addElement
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/523309/%E6%96%87%E7%94%9F%E6%96%87%E8%AF%95%E5%8D%B7%E7%AD%94%E9%A2%98%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/523309/%E6%96%87%E7%94%9F%E6%96%87%E8%AF%95%E5%8D%B7%E7%AD%94%E9%A2%98%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    GM_addStyle('.horizontal-layout .z-stage__annotation[data-v-3f4951cf]{width: 200%;!important;}');
})();