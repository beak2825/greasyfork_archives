// ==UserScript==
// @name         kbstep5
// @namespace    dragonboy
// @version      0.1
// @description  step5
// @author       dragonboy
// @match        https://www.kbchachacha.com/secured/car/regist/step5.kbc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390473/kbstep5.user.js
// @updateURL https://update.greasyfork.org/scripts/390473/kbstep5.meta.js
// ==/UserScript==

(function() {
    $("#n_checkNo").val(0);
    $("#ulViewType > li:nth-child(3) > a").click();
    $("#checkLinkUrl").val("http://url.com");
    $("#btnNext").click()
    $("#layerConfirmBtnOk").click();
})();