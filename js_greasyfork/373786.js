// ==UserScript==
// @name         IB
// @namespace    https://www.ksgin.com/
// @version      0.2.1
// @description  show import button
// @author       KsGin
// @match        http://10.5.11.8/dirMemberEdit.action*
// @downloadURL https://update.greasyfork.org/scripts/373786/IB.user.js
// @updateURL https://update.greasyfork.org/scripts/373786/IB.meta.js
// ==/UserScript==

(function() {
   'use strict';
    var exc = document.getElementById('index');
    var imc = document.createElement('a');
    imc.setAttribute("class" , "btn_ys1");
    imc.href = "javascript:businessInfoExpTab.dyInfoCollectionImport();";
    imc.innerHTML = "<span>导入采集表</span>"
    exc.parentNode.appendChild(imc);
})();