// ==UserScript==
// @name        睿投- UD授权插件
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取cookie提交给睿投
// @author       ECHO
// @match        https://unidesk.taobao.com/*/*
// @match        https://unidesk.taobao.com/*
// @icon         https://ruitou.riddlemedia.cn/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/444825/%E7%9D%BF%E6%8A%95-%20UD%E6%8E%88%E6%9D%83%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/444825/%E7%9D%BF%E6%8A%95-%20UD%E6%8E%88%E6%9D%83%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==



(function() {
    'use strict';


    var sigin=function(data){

        GM_xmlhttpRequest({
            url:"http://miao.datacenter.cn/ucenter/signin?email="+data.username+"&password="+data.password,
            method :"POST",
            data:"&email="+data.username+"&password="+data.password,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            onload:function(xhr){
                if(xhr.status=200){
                    console.log(xhr.responseText);
                    var result=eval("("+ xhr.responseText+")");
                    if(result.code=200){
                        sessionStorage.ruitou_token=result.data.token;
                        pushCookie();
                        setInterval(pushCookie,10000);
                        console.log('授权成功， 请不要在ud平台操作，不要刷新页面。')
                    }else{
                        alert(result.msg)
                    }
                }
            }
        });

    }
    var  pushCookie=function(){
        var cookie=JSON.stringify(getCookie());
        //console.log(cookie)
        cookie = cookie.replaceAll('&', '-_-') //得到newStr1的结果为"#home1#home"
        var token=sessionStorage.ruitou_token;
        GM_xmlhttpRequest({
            url:"http://miao.datacenter.cn/ud/setCookie?cookie="+cookie,
            method :"GET",
            data:"&cookie="+cookie,
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                "authorization": "Bearer "+token,
            },
            onload:function(xhr){
                if(xhr.status=200){
                    console.log(xhr.responseText);
                    var result=eval("("+ xhr.responseText+")");
                    if(result.code=200){
                        var d = new Date();
                        var n = d.toLocaleTimeString();
                        var up_time=document.getElementById('up_time');

                        up_time.innerHTML= "最后更新时间："+d.toLocaleTimeString();
                        //alert('授权成功， 请不要在ud平台操作，不要刷新页面。')

                    }else{
                        alert(result.msg)
                    }
                }
            }
        });
    }

    //获取cookie
    var getCookie = function () {
        //获取当前所有cookie
        var strCookies = document.cookie;
        return strCookies;
        //截取变成cookie数
        var array = strCookies.split(';');
        console.log(array);
        //循环每个cookie
        //for (var i = 0; i < array.length; i++) {
        //将cookie截取成两部分
        //  var item = array[i].split("=");
        //判断cookie的name 是否相等
        // if (item[0] == name) {
        //    return item[1];
        //}
        // }
        return null;
    }

    var login=function(){
        var data= new Object();
        var rt_login=document.getElementById('rt_login');
        for(var j=0;j<rt_login.childNodes.length;j++){
            if(rt_login.childNodes[j].childNodes[0].tagName=="INPUT"){
                if(rt_login.childNodes[j].childNodes[0].name=='username'){
                    data.username=rt_login.childNodes[j].childNodes[0].value;
                }
                if(rt_login.childNodes[j].childNodes[0].name=='password'){
                    data.password=rt_login.childNodes[j].childNodes[0].value;
                }
            }
        }
        return sigin(data);
    }



    var rt_iframe =document.createElement("div");
    rt_iframe.setAttribute('id','rt_iframe');
    rt_iframe.innerHTML="<div id='rt_login'><div><input name='username'/></div>"+
        "<div><input name='password'  type='password' /></div>"+
        "<div><span id='sign' >登陆并授权</span></div></div>"+
        "<div id='up_time'>未授权---</div>";

    document.body.appendChild(rt_iframe);
    var signObj=document.getElementById('sign')
    signObj.onclick=login;
    //样式
    GM_addStyle('#rt_iframe{padding: 10px;position: fixed;right: 0px;top: 50px;z-index: 100; background-color: #ffffff;border:  solid 1px #9095a1;/* transition: right 0.5s; */}; #rt_iframe input{padding:5px}');
    GM_addStyle('#rt_iframe input{padding:5px;}');
    GM_addStyle('#rt_iframe div{padding:5px;margin:5px;}');
    GM_addStyle('#rt_iframe #sign{border:1px solid #ccc;padding: 5px 10px;text-align: center;display:block;}');

    GM_addStyle('#rt_iframe #up_time{color: green;font-size: 15px;}');

    //start.onclick=OauthFun;

    // Your code here...

})();