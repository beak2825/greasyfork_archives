// ==UserScript==
// @name         人力-本機&測試機-後台整合會員管理-自動填入欄位
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  autocompletion
// @author       You
// @match        http://localhost:30942/IntegratedUserManage/Add
// @match        https://lcahr.lingcheng.tw/TalentMatchBox/IntegratedUserManage/Add
// @match        http://localhost:30942/IntegratedUserManage/Edit/*
// @match        https://lcahr.lingcheng.tw/TalentMatchBox/Edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446122/%E4%BA%BA%E5%8A%9B-%E6%9C%AC%E6%A9%9F%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E5%BE%8C%E5%8F%B0%E6%95%B4%E5%90%88%E6%9C%83%E5%93%A1%E7%AE%A1%E7%90%86-%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5%E6%AC%84%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/446122/%E4%BA%BA%E5%8A%9B-%E6%9C%AC%E6%A9%9F%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E5%BE%8C%E5%8F%B0%E6%95%B4%E5%90%88%E6%9C%83%E5%93%A1%E7%AE%A1%E7%90%86-%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5%E6%AC%84%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $testDataBtn = $("<div>", {
        html: "自動填入測資",
        class: "btn btn-success pull-right"
    });
    $("#editForm").prepend($testDataBtn);

    $testDataBtn.click(function() {
        let newidno = getid();
        $.blockUI();
        $("#Name").val(newidno);
        $("#IdentityNo").val(newidno);
        $("#Account").val(newidno);
        $("#Password").val(newidno);
        $("#ConfirmPwd").val(newidno);
        $("#tempBirthday").val("84/01/01").change();

        $("#Location").val(newidno);
        setTimeout(function() {
            $("#County").val("01").change();
            setTimeout(function() {
                $("#Township").val("0101").change();
                $.unblockUI();
            }, 500);
        }, 500);
    });

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