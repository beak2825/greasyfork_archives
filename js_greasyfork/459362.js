// ==UserScript==
// @name         蓝湖密码自动输入
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description   蓝湖分享链接每次都要输入密码，写了个记住密码并自动登录跳转，妈妈再也不用担心忘记密码了
// @author       Libs
// @icon         https://lanhuapp.com/link/favicon.ico
// @match        *://*.lanhuapp.com/link/*
// @grant        unone
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459362/%E8%93%9D%E6%B9%96%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/459362/%E8%93%9D%E6%B9%96%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let params = getUrlParams(window.location.href);
    let short_id = params["sid"]
    let lanhu_key_history = localStorage.getItem("lanhu_key_history");
    setTimeout(function(){
        let p = $(".pass").find("ul").find("li").find("input")[0];
        let err = $(".pass").find(".err")[0];
        if(p!=undefined){
            let config = {};
            if(lanhu_key_history){
                $(".add_in").attr("disabled","true");
                $(".add_in").html("密码读取中...");
                config = JSON.parse(lanhu_key_history);
                if(config[short_id]){
                     $(".pass").find("ul").find("li").find("input")[0].value=config[short_id];
                     $(".pass").find("ul").find("li").find("input")[0].dispatchEvent(new Event('input'));
                     $(".add_in").html("跳转中...");
                     $(".add_in").removeAttr("disabled");
                     $(".add_in").click();
                }else{
                    $(".add_in").removeAttr("disabled");
                }
                $(".add_in").html("确定");
            }
            $(".add_in").on("click", function(){
                let pass = $(".pass").find("ul").find("li").find("input").val();
                if(pass && pass != ""){
                    config[short_id] = pass;
                    localStorage.setItem("lanhu_key_history", JSON.stringify(config));
                }
            });
        }
    }, 1500);
})();
function getUrlParams(url) {
    let urlStr = url.split('?')[1];
	let obj = {};
	let paramsArr = urlStr.split('&')
	for(let i = 0,len = paramsArr.length;i < len;i++){
		let arr = paramsArr[i].split('=')
		obj[arr[0]] = arr[1];
	}
	return obj
}