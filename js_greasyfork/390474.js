// ==UserScript==
// @name         kbstep6
// @namespace    dragonboy
// @version      0.1
// @description  step6
// @author       dragonboy
// @match        https://www.kbchachacha.com/secured/car/regist/step6.kbc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390474/kbstep6.user.js
// @updateURL https://update.greasyfork.org/scripts/390474/kbstep6.meta.js
// ==/UserScript==

(function() {
       $("#rdCarDesc3").click();
        $("#selCarDesc").val(document.getElementById("selCarDesc")[1].value).trigger('change');
        $("#btnNext").click()
        $("#layerConfirmBtnOk").click();
})();