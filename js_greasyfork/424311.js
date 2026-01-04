// ==UserScript==
// @name         自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @include      *://admin.cstnet.cn/webadmin/*
// @include      *://vmt.cstcloud.cn/*
// @include      *://passport.escience.cn/oauth2/*
// @include      *://vpn.cstnet.cn/por/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424311/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/424311/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
     function getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return "";
    }
    var depart = decodeURIComponent(getQueryVariable("depart"));
    var name = decodeURIComponent(getQueryVariable("name"));
    var username = getQueryVariable("username");
    var password = getQueryVariable("password");
    if(location.href.startsWith("https://admin.cstnet.cn/webadmin/~")){
        alert(1);
    }else if(location.href.startsWith("https://admin.cstnet.cn")){
       $("#uid").val("admin@sinap.ac.cn");
       $("input[name='password']").val("5881@S1nap");
       $("input[name='submit']").click();
     }else if(location.href.startsWith("https://vmt.cstcloud.cn/user/index")){
       setTimeout(function(){
           if($(".hcolumnLiSpan:contains('"+depart+"')").length > 0){
           $(".hcolumnLiSpan:contains('"+depart+"')")[0].click();
               setTimeout(function(){
                   $("a[tmplid='registCoreMail']")[0].click();
                   setTimeout(function(){
                       $("#email").val(username);
                       $("input[name='name']").val(name)
                       $("#password").val(password);
                       $("#repassword").val(password);
                       $("select[name='cosId']").val("9");
                   },1000)
               },1000);
           }else{
              alert("部门"+depart+"不存在！")
           }
       },3000);
     }else if(location.href.startsWith("https://vmt.cstcloud.cn")){
       $("#loginVmt")[0].click()
     }else if(location.href.startsWith("https://vpn.cstnet.cn")){
         document.getElementById("svpn_name").value = "xuzhengtao@sinap.ac.cn";
         document.getElementById("svpn_password").value = "901706xX";
     }else{
       $("#userName").val("xuzhengtao@sinap.ac.cn");
       $("#password").val("901706xX@@");
       setTimeout(function(){
           $("#loginBtn").click();
       },1000);
     }
    // Your code here...
})();