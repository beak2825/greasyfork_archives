// ==UserScript==
// @name         问卷星辅助脚本
// @version      0.27
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// @description  （新增--答题次数统计功能）
// @author      LuCli
// @include     https://www.wjx.cn/*
// @grant        none
// @namespace https://github.com/tignioj/test_login/tree/master/wjx
// @downloadURL https://update.greasyfork.org/scripts/398492/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/398492/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

$(function(){

    // 屏蔽弹窗
    window.alert = function() {
        return false;
    }

    $('body').prepend('<p id="New_ids" style="font-size:20px;color:red;position:fixed";></P>')
    function ck(){
        if($("#submit_tip").css("display") == "block"){
            $.cookie("Stata_data",parseInt($.cookie("Stata_data"))+1)
            console.log($.cookie("Stata_data"))
        }else{
            $("#yucinput").val("")
        }
    }

    function ml(){
        if($.cookie("Stata_data") == undefined){
            $("#New_ids").html("共答题次数：0")
            $(".submitbutton").click(function(){
                $.cookie("Stata_data","0")
            })
        }
    }
    setTimeout(ml,500)

    $(document).keydown(function(event){
        if (event.keyCode == "13") {

            $(".submitbutton").click()
            ck()
        }
    })
    function Get_focus(){

        $("#yucinput").focus()
        $("#yucinput").click()
    }

    if ($("#loadprogress").html() == "&nbsp;&nbsp;100%"){
        Get_focus()
    }

    $("#yucinput").bind("input propertychange",function(event){

        console.log($("#yucinput").val().length)
        if ($("#yucinput").val().length == 4){
            $(".submitbutton").click()
            ck()
        }
    })
    if($.cookie("Stata_data") != undefined){
        $("#New_ids").html("共答题次数："+ $.cookie("Stata_data"))
    }

})