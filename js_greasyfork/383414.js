// ==UserScript==
// @name         信管网启用鼠标和复制
// @namespace    fartpig.org
// @version      0.1.0
// @description  启用鼠标右键和复制按钮
// @author       fartpig
// @match        *://*.cnitpm.com/*
// @connect      github.org
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383414/%E4%BF%A1%E7%AE%A1%E7%BD%91%E5%90%AF%E7%94%A8%E9%BC%A0%E6%A0%87%E5%92%8C%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/383414/%E4%BF%A1%E7%AE%A1%E7%BD%91%E5%90%AF%E7%94%A8%E9%BC%A0%E6%A0%87%E5%92%8C%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';

var scriptContent = '(function() { function R(a){ona = "on"+a; if(window.addEventListener) window.addEventListener(a, function (e) { for(var n=e.originalTarget; n; n=n.parentNode) n[ona]=null; }, true); window[ona]=null; document[ona]=null; if(document.body) document.body[ona]=null; } R("contextmenu"); R("click"); R("mousedown"); R("mouseup"); R("selectstart");})()';
var scriptE = document.createElement("script");
scriptE.setAttribute("type","text/javascript");
scriptE.innerHTML = scriptContent;
document.body.appendChild(scriptE);
})();