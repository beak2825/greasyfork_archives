// ==UserScript==
// @name         自动填写企业微信的疫情上报脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填写企业微信的疫情上报的脚本
// @author       hewro
// @match        https://lexiangla.com/*
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/397342/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E7%9A%84%E7%96%AB%E6%83%85%E4%B8%8A%E6%8A%A5%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/397342/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E7%9A%84%E7%96%AB%E6%83%85%E4%B8%8A%E6%8A%A5%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setTimeout(function () {

        fuck()
    }, 3000);

})();

function fuck() {
    var url = $("#app-vue .container .container .col-xs-8 ul li:first a:first").attr("href");
    if (url === undefined){
        // alert("表单页面");
        if ($(".address-select.ml-m").length > 0){
            fuckForm()
        }
    }else{
        // alert("跳转到表单页面："+url);
        location.href= url
    }
}

function fuckForm() {
    var list = $(".item-list")
    console.log(list.length)

    //1. 填写工号
    $(list[0]).find("textarea").text("2408");
    $(list[0]).find("textarea").focus();
    $(list[0]).find("textarea").blur();

    //2. 填写身份，选中第0项
    $(list[1]).find('input:radio:first').attr('checked', 'checked');
    $(list[1]).find('input:radio:first').click();
    //3. 填写体温，选中第1项
    $(list[2]).find('input:radio').eq(1).attr('checked', 'checked');
    $(list[2]).find('input:radio').eq(1).click();
    //4. 今天位置的情况
    $(list[3]).find('input:radio').eq(3).attr('checked', 'checked');
    $(list[3]).find('input:radio').eq(3).click();
    //5. 明天位置的情况
    $(list[4]).find('input:radio').eq(3).attr('checked', 'checked');
    $(list[4]).find('input:radio').eq(3).click();
    //6. 回到工作地后，已经隔离天数
    $(list[5]).find("textarea").text("-1");
    $(list[5]).find("textarea").focus();
    $(list[5]).find("textarea").blur();

    //9.复工温馨提醒
    $(list[8]).find('input:radio').eq(1).attr('checked', 'checked');
    $(list[8]).find('input:radio').eq(1).click();

    //10. 当前位置
    fuck1();
    fuck1();
    setTimeout(function () {
        //选择
        fuck2();
        fuck2();
        setTimeout(function () {
            $(list[0]).find("textarea").focus();
            $(list[0]).find("textarea").blur();
            setTimeout(function () {
                $(".center button").click()
            },100)
        },2000)
    },2000);

    //11.
    $(list[10]).find('input:checkbox:first').attr('checked', 'checked');
    $(list[10]).find('input:checkbox:first').click();

    //12.
    $(list[11]).find('input:radio').eq(12).attr('checked', 'checked');
    $(list[11]).find('input:radio').eq(12).click()


}

function fuck1() {
    console.log("修改了");
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, true);
    document.getElementsByClassName("address-select ml-m")[0].dispatchEvent(evt);
    document.getElementsByClassName("address-select ml-m")[0].value = "北京市";
}

function fuck2() {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, true);
    document.getElementsByClassName("address-select ml-s")[0].dispatchEvent(evt);
    document.getElementsByClassName("address-select ml-s")[0].value = "房山区";
}