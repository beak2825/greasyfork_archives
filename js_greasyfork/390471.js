// ==UserScript==
// @name         kbstep1
// @namespace    dragonboy
// @version      0.1
// @description  step1
// @author       dragonboy
// @match        https://www.kbchachacha.com/secured/car/regist/step1.kbc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390471/kbstep1.user.js
// @updateURL https://update.greasyfork.org/scripts/390471/kbstep1.meta.js
// ==/UserScript==

(function() {
            $("#autoGbn").val(document.getElementById("autoGbn")[1].value).trigger('change');
            $("#gas").val(document.getElementById("gas")[1].value).trigger('change');
            $("#jesiNo").val(0);
            $("#ulColorList").first().children("li")[0].click();
})();