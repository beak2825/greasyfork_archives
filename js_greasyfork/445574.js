// ==UserScript==
// @name         人力-本機&測試機-車機廠商註冊-自動填入欄位
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  車機廠商註冊-自動填入欄位
// @author       hander
// @match        http://localhost:30942/FrontRegisterNew/AGMCompanyRegister
// @match        https://lcahr.lingcheng.tw/TalentMatchBox/FrontRegisterNew/AGMCompanyRegister
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445574/%E4%BA%BA%E5%8A%9B-%E6%9C%AC%E6%A9%9F%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E8%BB%8A%E6%A9%9F%E5%BB%A0%E5%95%86%E8%A8%BB%E5%86%8A-%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5%E6%AC%84%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/445574/%E4%BA%BA%E5%8A%9B-%E6%9C%AC%E6%A9%9F%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E8%BB%8A%E6%A9%9F%E5%BB%A0%E5%95%86%E8%A8%BB%E5%86%8A-%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5%E6%AC%84%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $autoFillBtn = $("<button>", {html: "腳本自動填入測資", class:"float-right btn btn-success", type: "button"});
    $autoFillBtn.on("click", autoFillColumns);
    $("#editForm").find("h5:first").append($autoFillBtn);

    function autoFillColumns() {
        let newCode = makeNewCode(4);
        let newAcc = newCode + "01";
        editForm.Account.value = newAcc;
        editForm.Code.value = newCode;

        editForm.Name.value = newAcc;
        editForm.TaxNum.value = "28143514";
        editForm.Email.value = "handertest@gmail.com";
        editForm.Contact.value = "測試連絡人";
        editForm.AreaNumber.value = "07";
        editForm.Telephone.value = "7123456";
        editForm.Cellphone.value = "0912345678";
        editForm.Password.value = "ab1234567890";
        editForm.ConfirmPwd.value = "ab1234567890";
        editForm.Location.value = "123";
        if (!$("[name=TempAgree]").is(":checked")) $("[name=TempAgree]").click()

        setTimeout(function() {
            $("#County").val("01").change();
            setTimeout(function() {
                $("#Township").val("0101").change();
            }, 500);
        }, 500);
    }

    function makeNewCode(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                                                   charactersLength));
        }
        return result;
    }
})();