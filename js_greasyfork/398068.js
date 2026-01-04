// ==UserScript==
// @name         鼎傲助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  提取考试答案
// @author       lodge
// @match        http://soeasy.chinadingao.com/
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/398068/%E9%BC%8E%E5%82%B2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/398068/%E9%BC%8E%E5%82%B2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    console.log("work");
    //等待动态加载完毕，延迟5秒
    setTimeout(() => {
        // alert("脚本加载成功，到达考试页面后按 F5 刷新，看到红色按钮即可");
        $(".header-center").css("color","red");
        $(".header-center").html("脚本加载成功，到达考试页面后按 F5 刷新，看到红色按钮即可");
        $(".big-box:eq(0)").find(".el-textarea.el-input--small").css("border", '10px solid red');
        $(".big-box:eq(0)").find(".el-textarea.el-input--small").find(".el-textarea__inner").css({ "font-size": "20px" });
        $(".big-box:eq(0)").find(".el-textarea.el-input--small").find(".el-textarea__inner").val("请点击按钮来开始");
        $(".button-box").append($("<button type=button id='ga'>提取答案</button>"));
        $("#ga").css("backgroundColor", "red");
        $("#ga").click(function (e) {
            e.preventDefault();
            $("span:contains('交卷')").parent().click();
            $(".big-box:eq(0)").find(".el-textarea.el-input--small").find(".el-textarea__inner").val("正在开始自动交卷");
            setTimeout(() => {
                $("span:contains('您确定提交试卷吗？')").parent().next().find("span:contains('确 定')").parent().click();
            }, 2000);
            $(".big-box:eq(0)").find(".el-textarea.el-input--small").find(".el-textarea__inner").val("等待答案加载…请勿刷新页面");
            console.log("等待答案加载...");
            setTimeout(() => {
                $(".big-box:eq(0)").find(".el-textarea.el-input--small").find(".el-textarea__inner").val(get_duanwen() + get_xuanci() + get_xinwen() + get_changpian() + get_zixi() + get_changduihua() + get_zuowen() + get_fanyi());
                console.log("执行完毕");
            }, 15000);
        });
        //$("#ga").click();
    }, 5000);
})();


function get_zuowen() {
    //作文
    console.log("作文：" + $("p:contains('参考译文'):first+p").text());

    return "作文：" + $("p:contains('参考译文'):first+p").text() +"\n\n";
}
function get_fanyi() {
    //篇章翻译
    console.log("篇章翻译：" + $("p:contains('参考译文'):last+p").text());

    return "篇章翻译：" + $("p:contains('参考译文'):last+p").text() +"\n\n";
}
function get_duanwen() {
    //听短文理解
    var key = '';
    // $(".big-box:eq(1)").find(".duanwen-box").find(".el-radio.red").css("border", "10px solid red");
    // $(".big-box:eq(1)").find(".duanwen-box").css("border", "10px solid red");
    var $answer_list = $(".big-box:eq(1)").find(".duanwen-box").find(".el-radio.red")
    $.each($answer_list, function (indexInArray, valueOfElement) {
        // key = key + $(this).text().charAt(0);
        key = key + $(this).text()+"\n";

    });
    console.log("听短文理解：" + key);
    return "听短文理解：" + key + "\n";
}
function get_xuanci() {
    //选词填空
    var key;
    key = $(".big-box:eq(2)").find(".xuancutiankong-box").next().text();
    console.log("选词填空：" + key);
    return "选词填空：" + key + "\n"
}
function get_xinwen() {
    //新闻报道
    var key = "";
    // $(".big-box:eq(3)").find(".duanwen-box").find(".el-radio.red").css("border", "10px solid red");
    // $(".big-box:eq(3)").find(".duanwen-box").css("border", "10px solid red");
    var $answer_list = $(".big-box:eq(3)").find(".duanwen-box").find(".el-radio.red")
    $.each($answer_list, function (indexInArray, valueOfElement) {
        // key = key + $(this).text().charAt(0);
        key = key + $(this).text()+"\n";
    });
    console.log("新闻报道：" + key);
    return "新闻报道：" + key + "\n";
}
function get_changpian() {
    //长篇阅读
    var key = "";
    var $answer_list = $(".big-box:eq(4)").find("div[style='margin-top: 10px; padding: 10px; margin-left: 10px;']");
    $.each($answer_list, function (indexInArray, valueOfElement) {
        // key = key + $(this).text().charAt(3);
        key = key + $(this).text()+"\n";
    });
    console.log("长篇阅读：" + key);
    return "长篇阅读：" + key + "\n";
}
function get_zixi() {
    //仔细阅读
    var key = "";
    var $answer_list = $(".big-box:eq(5)").find(".duanwen-box").find(".el-radio.red");
    $.each($answer_list, function (indexInArray, valueOfElement) {
        // key = key + $(this).text().charAt(0);
        key = key + $(this).text()+"\n";
    });
    console.log("仔细阅读：" + key);
    return "仔细阅读：" + key + "\n";
}
function get_changduihua() {
    //听长对话
    var key = "";
    var $answer_list = $(".big-box:eq(6)").find(".duanwen-box").find(".el-radio.red");
    $.each($answer_list, function (indexInArray, valueOfElement) {
        // key = key + $(this).text().charAt(0);
        key = key + $(this).text()+"\n";
    });
    console.log("听长对话：" + key);
    return "听长对话：" + key + "\n";
}