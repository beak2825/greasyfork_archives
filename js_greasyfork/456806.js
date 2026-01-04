// ==UserScript==
// @icon            http://passport.ouchn.cn/assets/images/logo.png
// @name            GKS验证码助手工具
// @namespace       [url=mailto:1152673513@qq.com]1152673513@qq.com[/url]
// @author          沈华
// @description     GKS自动输入验证码
// @match           *://*.ouchn.cn/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         1.6.5
// @grant           GM_addStyle
// @run-at          document-end
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @connect         *
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_setClipboard
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/456806/GKS%E9%AA%8C%E8%AF%81%E7%A0%81%E5%8A%A9%E6%89%8B%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/456806/GKS%E9%AA%8C%E8%AF%81%E7%A0%81%E5%8A%A9%E6%89%8B%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function () {
    'use strict';
var user="";//账号
var pwd ="";//密码
var zbtn = "on";//on//打开自动登录 off//关闭自动登录
var time = "";//审批间隔时间:默认60秒
function kaptch(user,pwd,zbtn,time){
 var kph = $("#kaptchaImage");
 function getKaptch(user,pwd,zbtn){
    let img = document.getElementById('kaptchaImage')
    let src = img.getAttribute('src')
    var cnv = document.createElement('canvas')
    var cxt = cnv.getContext('2d')
    var imgSrc = document.getElementById('kaptchaImage').src
    const image = new Image()
    image.src = imgSrc
    image.onload = () => {
    cxt.drawImage(image, 0, 0, image.width, image.height)
    var base64 = cnv.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, "");
    setTimeout(function(){
     GM_xmlhttpRequest({
        method: "post",
        url: "http://vlt.shen668.cn:8089/api/tr-run/",
        data: "img=" + encodeURIComponent (base64),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        onload: function(r) {
        console.log(r.responseText);
        var json = JSON.parse(r.responseText);
        var doValidate = json.data.raw_out['0']['1'];
        var validate = JSON.parse(JSON.stringify(doValidate).replace(/\s*/g,""));
        //填入验证码
        console.log("当前验证码识别结果为：（"+validate+"）,若识别有误请点击切换验证码图片或刷新页面并自动重新识别！");
        $("#validateCode").val(validate);
        $('#loginName').empty();
        $('#loginName').val(user);
        $('#password').empty();
        $('#password').val(pwd);
        setTimeout(function(){
            if($("#button")!=undefined && $("#button")!=null && $("#button")!="" && $("#button").text().replace(/\s*/g,"")=="登录" && zbtn=="on" && zbtn!="off"){
                if($('#loginName').val()!=null && $('#password').val()!=null && $('#loginName').val()!="" && $('#password').val()!=""){
                    $("#button").click();
                }else{
                    console.log("请保证账号密码已输入且正确！");
                }
            }
        },3000)
                     },
                 });
     },888)
   }
  }
if($("#button")!=undefined && $("#button")!=null && $("#button")!="" && $("#button").text().replace(/\s*/g,"")=="登录"){
   getKaptch(user,pwd,zbtn);
}

 kph.on("click",function(){
    getKaptch(user,pwd,zbtn);
 });

$(document).keydown(function (event) {
    if (event.keyCode == 36) {
         if($(".ant-tabs-tab-active").text().replace(/\s*/g,"")!=""&&$(".ant-tabs-tab-active").text().replace(/\s*/g,"")=="预约审批"){
             sp();
         }else if($(".ant-tabs-tab-active").text().replace(/\s*/g,"")!="" && $(".ant-tabs-tab-active").text().replace(/\s*/g,"")=="预约撤销审批"){
             sp();
         }else{
             console.log("请在预约审批界面进行操作！"+$(".ant-menu-item").eq(9).children().children().text().replace(/\s*/g,""));
             if($(".ant-menu-item").eq(9).children().children().text().replace(/\s*/g,"")=="考生预约审批"){
                 $(".ant-menu-item").eq(9).children().children().click();
             }
         }
    }
});
console.log($(".ant-tabs-tab-active").text().replace(/\s*/g,""));
if(time==""){
   time = "60000";
}
setInterval(function(){
    if($(".ant-tabs-tab-active").text().replace(/\s*/g,"")!=""&&$(".ant-tabs-tab-active").text().replace(/\s*/g,"")=="预约审批"){
        sp();
    }else if($(".ant-tabs-tab-active").text().replace(/\s*/g,"")!="" && $(".ant-tabs-tab-active").text().replace(/\s*/g,"")=="预约撤销审批"){
       sp();
    }else{
        console.log("请在预约审批界面进行操作！");
    }
},time)

function sp(){
    $(".ant-select-selection-selected-value").click();//2022年秋季学期期末统一考试展开列表
    $(".ant-select-dropdown-menu-item").eq(1).focus();//2022年秋季学期期末统一考试聚焦
    if($(".ant-select-dropdown-menu-item").eq(1).text().replace(/\s*/g,"")=="2022年秋季学期期末统一考试"){
        console.log("2022年秋季学期期末统一考试选择:"+$(".ant-select-dropdown-menu-item").eq(1).text().replace(/\s*/g,""));
        $(".ant-select-dropdown-menu-item").eq(1).click();//2022年秋季学期期末统一考试选择
    }
    $(".ant-select-selection__rendered").eq(2).click();//四川广播电视大学教学中心学习中心展开列表
    if($(".ant-select-dropdown-menu-item").eq(53).text().replace(/\s*/g,"")=="四川广播电视大学教学中心学习中心"){
        console.log("四川广播电视大学教学中心学习中心选择:"+$(".ant-select-dropdown-menu-item").eq(53).text().replace(/\s*/g,""));
        $(".ant-select-dropdown-menu-item").eq(53).click();//四川广播电视大学教学中心学习中心选择
    }
    $(".ant-select-selection__rendered").eq(4).click();//待审批展开列表
    if($(".ant-select-dropdown-menu-item").eq(55).text().replace(/\s*/g,"")=="待审批"){
        console.log("待审批选择:"+$(".ant-select-dropdown-menu-item").eq(55).text().replace(/\s*/g,""));
        $(".ant-select-dropdown-menu-item").eq(55).click();//待审批选择
    }
    setTimeout(function(){
        if($(".ant-btn-primary").eq(0).text().replace(/\s*/g,"")=="查询"){
            console.log("点击查询:"+$(".ant-btn-primary").eq(0).text().replace(/\s*/g,""));
            $(".ant-btn-primary").eq(0).click();//点击查询
        }
    },2000)
    //$("input.ant-checkbox-input")[0].click();
    setTimeout(function(){//全选
           console.log("--全选--");
           $("input.ant-checkbox-input")[0].click();
    },3000)
    setTimeout(function(){
        if($(".ant-btn-primary").eq(1).text().replace(/\s*/g,"")=="批量同意"){
           console.log("点击批量同意:"+$(".ant-btn-primary").eq(1).text().replace(/\s*/g,""));
           $(".ant-btn-primary").eq(1).click();//点击批量同意
        }
    },3000)
    setTimeout(function(){
        if($(".ant-btn-primary").eq(2).text().replace(/\s*/g,"")=="确定"){
            console.log("点击确定:"+$(".ant-btn-primary").eq(2).text().replace(/\s*/g,""));
            $(".ant-btn-primary").eq(2).click()//点击确定
        }
    },3000)
}

}
kaptch(user,pwd,zbtn,time);
})();

