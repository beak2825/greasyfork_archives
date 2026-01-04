// ==UserScript==
// @name         kbstep7
// @namespace    dragonboy
// @version      0.2
// @description  step7
// @author       dragonboy
// @match        https://www.kbchachacha.com/secured/car/regist/step7.kbc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390475/kbstep7.user.js
// @updateURL https://update.greasyfork.org/scripts/390475/kbstep7.meta.js
// ==/UserScript==

(function() {
    var btnWaitSaveClick2 = function(cnt) {
        
        $("#autoUpdateYn").val("N");
        $("#carSpecialYn").val("N");
        $("#hotMarkYn").val("N");
        $("#hotMarkCode").val("");
    
    
        var $form = $("#frmCarRegist");
        var url = "/secured/car/regist/step7/save.json";
        $("#adState").val("030130");
    
        Jq.ajaxForm(url, $form, function(data) {
    
            var errCode = data.errCode;
            var errMsg = data.errMsg;
            var errMsg2 = errMsg + "";
    
            if (errCode == "0") {
                layerAlert("등록 되었습니다.", function() {});
            } else {
                if ( (cnt < 10) && (errMsg2.indexOf("오류") >= 0)) {
                    btnWaitSaveClick2(cnt + 1);
                } else {
                    layerAlert(errMsg);
                }
            }
    
        });
    
    };
    btnWaitSaveClick2(0);
})();