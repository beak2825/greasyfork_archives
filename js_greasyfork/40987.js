// ==UserScript==
// @name         购房登记自动填写-刚需
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://171.221.172.13:8888/lottery/accept/personInfo?type=2&projectUuid=*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/40987/%E8%B4%AD%E6%88%BF%E7%99%BB%E8%AE%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99-%E5%88%9A%E9%9C%80.user.js
// @updateURL https://update.greasyfork.org/scripts/40987/%E8%B4%AD%E6%88%BF%E7%99%BB%E8%AE%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99-%E5%88%9A%E9%9C%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("familyType").value = 2;
    $(".lotteryPersonType").val(1);
    $("input[name='username']").val("主购房人姓名");
    $("input[name='certificateNo']").val("主购房人身份证号");

    var obj = $("select[name='nativePlace']");
    obj.val(3);
    var nativeType = 3;
    //项目区域
    var regioncode = $('#regioncode').val();
    var acceptPersonVoList = obj.parents("form[name='acceptPersonVoList']");

    var personType = $(acceptPersonVoList).find(".lotteryPersonType").val();

    $(acceptPersonVoList).find("input[name='socialNo']").val("");
    $(acceptPersonVoList).find("input[name='workArea']").val("");
    $(acceptPersonVoList).find("select[name='socialArea']").val("1");

    //人员类型
    if("1" == personType || "2" == personType){
        nativeTypeView(acceptPersonVoList,regioncode,nativeType);
    }

    $("input[name='ifOwnHouse']").eq(0).attr("checked",'checked');
    $("input[name='ifBuyhouse']").eq(1).attr("checked",'checked');

    $("div.add-person").click();
    $("div.add-person").click();

    // 人员1
    $(".lotteryPersonType").eq(1).val(2);
    $("input[name='username']").eq(1).val("人员1姓名");
    $("input[name='certificateNo']").eq(1).val("人员1身份证号");
    $("input[name='personStyle']").eq(2).attr("checked",'checked');
    var obj = $("input[name='personStyle']").eq(2);
    var acceptPersonVoList = obj.parents("form[name='acceptPersonVoList']");
    var personType = $(acceptPersonVoList).find("select[name='personType']").val();
    personTypeView5(acceptPersonVoList);
    acceptPersonVoList.find("table[name='_lottery_levy']").hide();

    // 人员2
    $(".lotteryPersonType").eq(2).val(2);
    $("input[name='username']").eq(2).val("人员2姓名");
    $("input[name='certificateNo']").eq(2).val("人员2身份证号");
    $("input[name='personStyle']").eq(4).attr("checked",'checked');
    obj = $("input[name='personStyle']").eq(4);
    var acceptPersonVoList = obj.parents("form[name='acceptPersonVoList']");
    var personType = $(acceptPersonVoList).find("select[name='personType']").val();
    personTypeView5(acceptPersonVoList);
    acceptPersonVoList.find("table[name='_lottery_levy']").hide();

    $("select[name='familyRelation']").eq(1).val(3);


})();