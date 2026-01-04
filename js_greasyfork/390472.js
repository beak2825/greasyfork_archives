// ==UserScript==
// @name         kbstep3
// @namespace    dragonboy
// @version      0.1
// @description  step3
// @author       dragonboy
// @match        https://www.kbchachacha.com/secured/car/regist/step3.kbc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390472/kbstep3.user.js
// @updateURL https://update.greasyfork.org/scripts/390472/kbstep3.meta.js
// ==/UserScript==

(function() {
        $("#sellAmt").val(10);
        $("#btnNext").click()
        $("#layerConfirmBtnOk").click();
})();