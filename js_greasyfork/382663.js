// ==UserScript==
// @name         吾爱油猴签到助手
// @namespace    https://greasyfork.org/zh-CN/scripts/382663
// @version      0.1
// @icon         https://52youhou.com/wp-content/uploads/2018/03/80.png
// @description  try to take over the world!
// @author       Ryan
// @include      https://52youhou.com/
// @match        https://52youhou.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/382663/%E5%90%BE%E7%88%B1%E6%B2%B9%E7%8C%B4%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/382663/%E5%90%BE%E7%88%B1%E6%B2%B9%E7%8C%B4%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host_name="52youhou.com";
    var _url = window.location.href;
    var Sign_Url =" https://52youhou.com/wp-content/themes/LightSNS/module/action/sign.php";
    if(_url&&_url.indexOf(host_name)!=-1){
        if(jinsom){
         var timer_invl = setInterval(function(){
             var jin_som = JSON.stringify(jinsom);
             var isLogin =jin_som.substring(jin_som.indexOf("is_login")+10,1053);
             switch(parseInt(isLogin)){
                case 0:alert("please login!");console.log("no user login!");break;
                case 1:window.clearInterval(timer_invl);console.log("islogin=1");
                     ajax_method(Sign_Url,"sign=1","POST",remindU);break;
            }},5000);
        }
    }
    function ajax_method(url,data,method,success) {
        var ajax = new XMLHttpRequest();
        if (method=='GET') {
        if (data) {
            url+='?';//GET or POST
            url+=data;
        }else{}
            ajax.open(method,url);
            ajax.send();
        }else{
            ajax.open(method,url);
            ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            ajax.withCredentials =true;
            if (data) {
                ajax.send(data);
            }else{
                ajax.send();
            }
        }
        ajax.onreadystatechange = function () {
            if (ajax.readyState==4&&ajax.status==200) {
                console.log("Post 200 OK");
                success(ajax.responseText);
        }
    }
}
    function remindU(data){
    if(data){
        var res = JSON.parse(data);
        alert(res.msg+" signed "+res.day+" times!");
        console.log(res.msg+" signed "+res.day+" times!");
    }
}
})();