// ==UserScript==
// @name         修改logo为学生网上掉课系统
// @namespace    http://s.xmcp.ml/
// @version      0.2.1
// @description  修正掉课系统的说明文字
// @author       xmcp
// @match        *://elective.pku.edu.cn/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/389874/%E4%BF%AE%E6%94%B9logo%E4%B8%BA%E5%AD%A6%E7%94%9F%E7%BD%91%E4%B8%8A%E6%8E%89%E8%AF%BE%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/389874/%E4%BF%AE%E6%94%B9logo%E4%B8%BA%E5%AD%A6%E7%94%9F%E7%BD%91%E4%B8%8A%E6%8E%89%E8%AF%BE%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    var node = document.createElement('style');
    node.innerHTML='[background="/elective2008/resources/images/w.png"] {background-image: url("https://s.xmcp.ml/repo/pku_elective_w_chg.png") !important;}';
    document.documentElement.appendChild(node);
})();