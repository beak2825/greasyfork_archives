// ==UserScript==
// @name         重庆工商职业学院校园网定时/自动登陆
// @namespace    https://blog.ayano.top
// @version      0.4
// @description  重庆工商职业学院校园网自动登陆
// @author       Cypas_Nya
// @match        http://10.34.2.9/webauth.do*
// @match        http://10.34.2.9/webdisconn.do*
// @icon         https://s0.ayano.top/usr/uploads/favicon.ico
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/433095/%E9%87%8D%E5%BA%86%E5%B7%A5%E5%95%86%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E5%AE%9A%E6%97%B6%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/433095/%E9%87%8D%E5%BA%86%E5%B7%A5%E5%95%86%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E5%AE%9A%E6%97%B6%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

/*↓↓↓↓↓这里填写相关配置↓↓↓↓↓↓↓*/
var user_no = "";//自己的账号，记住是以大写X开头
var user_psw = "";//自己的密码
var is_auto_now = false;//是否立刻登录，为true时进入网页1s后登陆，为false时在指定时间后才登录，如设置为7:31后自动登陆
var login_time = "7:31:00";//按照 时:分:秒 的格式，如7:31:00
/*↑↑↑↑↑这里填写相关配置↑↑↑↑↑↑↑*/


(function() {
    'use strict';
    debugger;
    if(isExit()){
        window.no_auto_login=true;//标记跳转回登陆页面后不自动登陆
        window.history.go(-2);

    }else if("undefined" == typeof no_auto_login || !no_auto_login){//no_auto_login参数设置为window全局变量也无法跨页面传递过去，暂无很好的解决办法
        init();//初始化date.format
        if(!user_no || !user_psw|| !login_time){
            alert("请打开脚本管理器，编辑一下此脚本14,15行的账号密码");
        }else{
        if(is_auto_now){
            setTimeout(autologin, 2000,user_no,user_psw);
        }else{
            window.auto_login_id = setInterval(autologin, 1000,user_no,user_psw);//启动监视线程，每秒刷新一次
        }
    }
    }

})();
function isExit(){
    /*校验是否是退出页面 */
    var reg=/webdisconn/;   //定义验证表达式
    return reg.test(window.location.href);    //进行验证
}

function init(){
    //通过原型函数为date添加.format方便后续变化
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    var now = new Date().format("yyyy-MM-dd");//取日期部分字符串
    login_time = Math.floor(+new Date(now + " "+login_time)/1000);//拼接为完整时间字符串，并转化为时间戳
}
//自动登陆函数
function autologin(user_no,user_psw) {
    //debugger;
    var now_time = Math.floor(+new Date()/1000);
    if(is_auto_now){
        $("#userId").val(user_no);
        $("#passwd").val(user_psw);
        $('#submitForm').trigger("click");
    }else if(now_time >= login_time){
        $("#userId").val(user_no);
        $("#passwd").val(user_psw);
        $('#submitForm').trigger("click");
        clearInterval(auto_login_id);
    }

}

