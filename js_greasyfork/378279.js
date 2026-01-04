// ==UserScript==
// @name         EPAY支付
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  支付。
// @author       Ten.Light
// @match        https://epay.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378279/EPAY%E6%94%AF%E4%BB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/378279/EPAY%E6%94%AF%E4%BB%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

//v1.01 添加可以自动发送报文支付，需要手动配置token 和 价格
//v1.02 添加通过 cookie传递 token和价格 

	var amount="";
	var pay_token="";
	var pay_pass="62b96ea23ebf14eac4998ed26c3bdd3a";

	var orderId = window.location.search.substr(9,20);
		
	console.log(orderId);
	//alert(orderId);

	var ttk = getCookie("s_ttk");
	if(ttk == "")
	{
		alert("获取token错误");
		throw SyntaxError();

	}
	
	console.log(ttk);
	var tval = ttk.split("|");
	amount = tval[0];
	pay_token =  tval[1];
	console.log("orderId"+orderId+" amount"+amount+" pay_token"+pay_token);
	//alert("orderId"+orderId+" amount"+amount+" pay_token"+pay_token);

	pay_verify(orderId, pay_pass);

	function pay_verify(orderId, pay_pass){
		var posturl="https://epay.163.com/cashier/m/security/verifyPayItems?v="+new Date().getTime();
		var postdata="securityValid=%7B%22shortPayPassword%22%3A%22"+pay_pass+"%22%7D&orderId=" +orderId+ "&envData=%7B%22term%22%3A%22wap%22%7D";
		ajaxPostPay(posturl, postdata, fnVerifySucceed, null,null);

	}
	function fnVerifySucceed(resp){
		var obj = JSON.parse(resp);
	    console.log(resp);
	    if(obj.result == "success"){
	      pay_confirm(orderId,amount, pay_token);
	    }else{
	    	console.log(decodeURIComponent(obj.errorMsg));
	    	alert(decodeURIComponent(obj.errorMsg));
	    }
	}


	function pay_confirm(orderid, amount, pay_token){
		var posturl="https://epay.163.com/cashier/m/ajaxPay?v="+new Date().getTime();
		var postdata="proposal=%7B%22orderId%22%3A%22"+orderid+"%22%2C%22balance%22%3A%7B%22payAmount%22%3A"+amount+"%7D%7D&securityValid=%7B%7D&envData=%7B%22term%22%3A%22wap%22%7D&yidunToken="+pay_token;
		ajaxPostPay(posturl, postdata, fnConfirmSucceed, null,null);

	}
	function fnConfirmSucceed(resp){
		var obj = JSON.parse(resp);
	    console.log(resp);
	    ///alert(obj.result);
	    if(obj.result == "success"){
	       window.location.href = obj.data.returnUrl;
	    }else{
	    	console.log(decodeURIComponent(obj.errorMsg));
	    	alert(decodeURIComponent(obj.errorMsg));

	    }
	}




	// ajax 对象
	function ajaxObject() {
	    var xmlHttp;
	    try{
	        xmlHttp = new XMLHttpRequest(); // Firefox, Opera 8.0+, Safari
	    }
	    catch (e) {
	        try {// Internet Explorer
	                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	            } catch (e) {
	            try {
	                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	            } catch (e) {
	                alert("浏览器不支持AJAX！");
	                return false;
	            }
	        }
	    }
	    return xmlHttp;
	}
	// ajax ajaxPostPay：
	function ajaxPostPay (url, data, fnSucceed,fnFail, fnLoading ) {
	    var ajax = ajaxObject();
	    ajax.open( "post" , url , true );
	    ajax.setRequestHeader( "Accept" , "application/json, text/javascript, */*; q=0.01" );
	    ajax.setRequestHeader( "Accept-Language" , "zh-CN,zh;q=0.9" );
	    ajax.setRequestHeader( "Content-Type" , "application/x-www-form-urlencoded; charset=UTF-8" );
	    ajax.setRequestHeader( "X-Requested-With" ,  "XMLHttpRequest");
	    ajax.onreadystatechange = function () {
	        if( ajax.readyState == 4 ) {
	            if( ajax.status == 200 ) {
	                fnSucceed( ajax.responseText );
	            }
	            else {
	                //fnFail( "HTTP请求错误！错误码："+ajax.status );
	            }
	        }
	        else {
	            //fnLoading();
	        }
	    }
	    ajax.send(data);
	}
	
function getCookie(c_name){
    if (document.cookie.length>0){ 
        //console.log(document.cookie);
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){ 
            c_start=c_start + c_name.length+1; 
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        } 
    }
    return "";
}


})();