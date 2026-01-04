// ==UserScript==
// @name         人力-本機&測試機-前台整合會員註冊-自動填入欄位
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  車機廠商註冊-自動填入欄位
// @author       hander
// @match        http://localhost:30942/FrontRegisterNew/IntegratedRegister*
// @match        https://lcahr.lingcheng.tw/TalentMatch/FrontRegisterNew/IntegratedRegister*
// @match        https://lcahr.lingcheng.tw/TalentMatchBox/FrontRegisterNew/IntegratedRegister*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446502/%E4%BA%BA%E5%8A%9B-%E6%9C%AC%E6%A9%9F%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E5%89%8D%E5%8F%B0%E6%95%B4%E5%90%88%E6%9C%83%E5%93%A1%E8%A8%BB%E5%86%8A-%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5%E6%AC%84%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/446502/%E4%BA%BA%E5%8A%9B-%E6%9C%AC%E6%A9%9F%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E5%89%8D%E5%8F%B0%E6%95%B4%E5%90%88%E6%9C%83%E5%93%A1%E8%A8%BB%E5%86%8A-%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5%E6%AC%84%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $autoFillBtn = $("<button>", {html: "腳本自動填入測資", class:"float-right btn btn-success", type: "button"});
    $autoFillBtn.on("click", autoFillColumns);
    $("#editForm").find("h5:first").append($autoFillBtn);

    function autoFillColumns() {
        let newCode = makeNewCode(4);
        let newAcc = newCode + "01";

        if (editForm.Account != undefined) {
            editForm.Account.value = newAcc;
            editForm.Password.value = "a123456789";
            editForm.ConfirmPwd.value = "a123456789";
        }

        if (editForm.Name != undefined) {
            editForm.Name.value = newAcc;
            editForm.IdentityNo.value = getid();
            $("#tempBirthday").val("84/03/24").change();
            editForm.AreaNumber.value = "07";
            editForm.Telephone.value = "7123456";
            editForm.Cellphone.value = "0976562436";
            editForm.Email.value = "handertest@gmail.com";
            editForm.Location.value = "123";
            if (!$("[name=TempAgree]").is(":checked")) $("[name=TempAgree]").click()

            setTimeout(function() {
                $("#County").val("01").change();
                setTimeout(function() {
                    $("#Township").val("0101").change();
                }, 500);
            }, 500);
        }
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





    //最小(包含)與最大(包含)值間的亂數
    function getRandom(min,max){
        return Math.floor(Math.random()*(max-min+1))+min;
    };
    //取得身份證字號
    function getid(){
        var a=[];
        var b=[10,11,12,13,14,15,16,17,34,18,19,20,21,22,35,23,24,25,26,27,28,29,32,30,31,33];
        var value="";
        for(let i = 65; i < 91; i++){
            a.push(String.fromCharCode(i));
        }
        value=a[getRandom(0,25)]+getRandom(1,2);
        for(let i=0;i<7;i++){
            value+=getRandom(1,9);
        }
        return value+=getchknum(value);
    }
    //取得身份證字號最後一個檢查碼
    function getchknum(x){
        try{
            var a=[];
            var b=[10,11,12,13,14,15,16,17,34,18,19,20,21,22,35,23,24,25,26,27,28,29,32,30,31,33];

            for(var i = 65; i < 91; i++){
                a.push(String.fromCharCode(i));
            }

            var num=a.indexOf(x.substr(0,1));
            var b1=parseInt(b[num].toString().substr(0,1));
            var b2=parseInt(b[num].toString().substr(1,1));

            var fnum=b1+(b2*9); //英文字母算出的數字
            var ff=1;
            for(let i=8;i>0;i--){
                fnum+=x.substr(i,1)*ff;
                ff++;
            }
            var final=(fnum%10==0)?0:10-(fnum%10); //檢查碼
            return final;
        }catch{
            return null;
        }
    };
})();