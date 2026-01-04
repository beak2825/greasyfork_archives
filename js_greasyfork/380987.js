// ==UserScript==
// @name         支付
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  try to take over the world!
// @author       You
// @match        https://epay.163.com/cashier/m/standardCashier?orderId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380987/%E6%94%AF%E4%BB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/380987/%E6%94%AF%E4%BB%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var amount="265";
    var pay_token="9ca17ae2e6ffcda170e2e6eed3c13aa3b7bf88cc6eb68a8ba7c55b979f8fbbb874f8aea59bd73491bdababf32af0feaec3b92ab288a7d7d43ea98fa28df75a968f8fa6c85aa1aca4d9f563938c8696dc3dae95ee9e";
	var pay_pass="62b96ea23ebf14eac4998ed26c3bdd3a";

	var orderId = window.location.search.substr(9,20);
	console.log(orderId);
	pay_verify(orderId, pay_pass);




	function pay_verify(orderId,pay_pass){
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
	    alert(obj.result);
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

})();