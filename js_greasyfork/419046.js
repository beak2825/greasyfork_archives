// ==UserScript==
// @name         xtu满意度调查
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  xtu评教满意度调查
// @author       D15h35
// @match        http://jwxt.xtu.edu.cn/jsxsd/mydgl/*
// @grant        none
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/419046/xtu%E6%BB%A1%E6%84%8F%E5%BA%A6%E8%B0%83%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/419046/xtu%E6%BB%A1%E6%84%8F%E5%BA%A6%E8%B0%83%E6%9F%A5.meta.js
// ==/UserScript==
var $ = window.jQuery;

if (location.pathname == "/jsxsd/mydgl/mydgl_listNew") {
    window.confirm = function () { return true; }
    window.alert = function () { return true; }
    console.log("test:" + location.pathname)
    var investigation = $("td:contains('未参与调查')");
    if (investigation != null) {
        var wjdc = $("a:contains('问卷调查')");
        wjdc.click();
    }
}
else if (location.pathname === "/jsxsd/mydgl/ps_queryNew") {
    var radioList = $("input[id^='hiddenj1'][id$='radio1']");
    var inputLList = $("input[id^='L1']");
    var checkboxList = $("input[id^='hiddenN1'][id$='checkbox1']");
    var inputRList = $("input[id^=R1]");
    var edittextareaList = $("textarea[id^=T1]");

    radioList.each(function (index, radio) {
        $(radio).attr("checked", true);
    });

    inputLList.each(function (index, inputL) {
        $(inputL).attr("value", "无");
    });

    checkboxList.each(function (index, checkbox) {
        $(checkbox).attr("checked", true);
        index=index+1;
        $("#hiddenN1" + index + "checkbox2").attr("checked", true);
    });

    inputRList.each(function (index, inputR) {
        $(inputR).attr("value", "无");
    });

    edittextareaList.each(function (index, edittextarea) {
        $(edittextarea).val("无");
    });
    var h = $(document).height() - $(window).height();
    $(document).scrollTop(h);
}