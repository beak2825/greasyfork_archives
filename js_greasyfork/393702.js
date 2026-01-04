// ==UserScript==
// @name         CCFCSP自动确认
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  FUCKCCF
// @author       JerryZhao
// @match        http://118.190.20.162/view.page?gpid=T*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393702/CCFCSP%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/393702/CCFCSP%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var inputs = document.getElementsByTagName("input");
    
    for (var i = 0; i < inputs.length; ++i) {
        var obj = inputs[i];
        if (obj.type == "checkbox") {
            obj.checked = "true";
        }
    }

})();