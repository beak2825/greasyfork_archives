// ==UserScript==
// @name         藏宝阁确认页面
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  藏宝阁抢号,确认页面开始,刷新确认页面。
// @author       Ten.Light
// @match        https://epay.163.com/*
// @match        https://lh.cbg.163.com/cgi/mweb/equip/*
// @match        https://lh.cbg.163.com/cgi/mweb/order/confirm/*
// @match        https://my.cbg.163.com/cgi/mweb/equip/*
// @match        https://my.cbg.163.com/cgi/mweb/order/confirm/*
// @match        https://dhxy.cbg.163.com/cgi/mweb/equip/*
// @match        https://dhxy.cbg.163.com/cgi/mweb/order/confirm/*
// @match        https://yys.cbg.163.com/cgi/mweb/equip/*
// @match        https://yys.cbg.163.com/cgi/mweb/order/confirm/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375606/%E8%97%8F%E5%AE%9D%E9%98%81%E7%A1%AE%E8%AE%A4%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/375606/%E8%97%8F%E5%AE%9D%E9%98%81%E7%A1%AE%E8%AE%A4%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

//v1.01
//1.01 在经典下单脚本的基础上修改循环查询为循环下单。
//1.02 在1.01基础上 添加多笔下单交易同时发送
//1.03 在1.02基础上 添加获取token 和 金额 组装成cookie s_ttk 传递给 支付
 
  
 //var passwd="96e79218965eb72c92a549dd5a330112";
 
 var expireMinutes=2;
 var intval_time=1000;
 var intval=2000;
 var nThread=3;

 var sTime;
 var amount;
 var loop = 0;
 var func_time;
 var add_flag=0;
 
 var func_init;
	
 get_time();

 loadPayJs("tooljs","https://acstatic-dun.126.net/tool.min.js");
 loadPayJs("watchjs","https://acstatic-dun.126.net/2.5.2_d3a14258/watchman.min.js");
 


 
 function checkTime()
 {
  var ret= 0;
  var now = new Date().getTime();
  console.log("checkTime1 now:"+now+" St:"+sTime+ " Intev:"+(sTime - now)+ " loop:"+loop);  
  if(sTime - now <= intval){
   window.clearInterval(func_time);
   tofight();
  }  
  loop += 1;
 }
 function tofight() {
 	for(var i=0;i<nThread;i++){
 		add_order(amount);
 	}
   
   
 }
 
 var orderId; 
 var orderid_to_epay;
 var username;




function loadPayJs(id,newJS)
{
	var scriptObj = document.createElement("script");
	scriptObj.src = newJS;
	scriptObj.type = "text/javascript";
	scriptObj.id = id;
	document.getElementsByTagName("head")[0].appendChild(scriptObj);
}

function initPayJs()
{
    try {
      initWatchman({
        productNumber: 'YD00000595128763', // 产品编号
        onload: function (instance) {
          window.clearInterval(func_init);  
          window.antiSpam = instance;
          
          window.antiSpam.getToken('1e334e244f2b46aa9acf4f707686cc23', function (token){
          	console.log(token);
          	console.log(sTime);
          	alert(token);
          	var ttk=amount.substr(0, amount.length-2) + "|"+ token;         	
          	setCookie("s_ttk", ttk, expireMinutes);
						func_time = setInterval(checkTime,intval_time);
          })

        },
        onerror: function (e) {
        }
      })

    } catch (e) {
        console.log(111);
        
    }
}




//查询时间 https://lh.cbg.163.com/cgi/api/get_equip_detail
function get_time(){
 var posturl="https://"+window.location.host+"/cgi/api/get_equip_detail";
 var postdata="serverid="+window.location.pathname.split('/')[5]+ "&ordersn="+window.location.pathname.split('/')[6]+"&view_loc=all_list";
 ajaxPost(posturl, postdata, fnGetTimeSucceed, null,null);
}
//查询时间结果
function fnGetTimeSucceed(resp){
  var obj = JSON.parse(resp);
  if(obj.status == 1){
   	sTime= Date.parse(obj.equip.fair_show_end_time .replace(/-/g,"/"));   	
 		
 func_init = setInterval(initPayJs,5000);
  	amount= ""+obj.equip.price;
  	alert("时间:"+obj.equip.fair_show_end_time+ "金额:"+amount);
  }
} 
 
//前置
function pre_order(){
 var posturl="https://"+window.location.host+"/cgi/api/preview_order";
 var postdata="serverid="+window.location.pathname.split('/')[5]+ "&ordersn="+window.location.pathname.split('/')[6]+"&view_loc=all_list";
 ajaxPost(posturl, postdata, fnPreSucceed, null,null);
}

//前置结果
function fnPreSucceed(resp){
  var obj = JSON.parse(resp);
  //console.log(resp);
  if(obj.status == 1){
   if(obj.order){//存在订单
    	//orderId = obj.order.orderid_from_epay;
    	orderid_to_epay = obj.order.orderid_to_epay;
    	//跳到支付
    	alert("存在未支付的订单"); 
    	username=CBG_CONFIG.urs;
  		//post_topay(username,orderId,passwd);
   }
   else{
    add_order(amount);
   } 
  }else if(obj.status == 0){
   if(resp.msg){console.log(decodeURIComponent(resp.msg))}
   pre_order();
  }

} 

//添加订单
function add_order(add_amt){
	if(add_flag == 1)
	{
		console.log("已下单，此进程停止");
		return;
	}
 var posturl="https://"+window.location.host+"/cgi/api/add_order";
 var postdata="serverid="+window.location.pathname.split('/')[5]+ "&ordersn="+window.location.pathname.split('/')[6]+"&confirm_price_total="+add_amt+"&view_loc=all_list";
 ajaxPost(posturl, postdata, fnAddSucceed, null,null);
}

//添加订单结果
function fnAddSucceed(resp){
  var obj = JSON.parse(resp);
  console.log(resp);
  if(obj.status == 1){    
  	//pre_order();
  	if(add_flag == 1)
  	{
  		console.log("已下单，此进程停止2");
  		return;
  	}
      add_flag = 1;
  	orderid_to_epay = obj.order.orderid_to_epay;
  	if(orderid_to_epay){pay_order(orderid_to_epay);}
    
  }else if(obj.status == 0){
   //alert();
   if(add_flag == 1)
  	{
  		console.log("已下单，此进程停止");
  		return;
  	}
   console.log(decodeURIComponent(obj.msg));
   add_order(amount);
  }

} 



//订单跳转

function pay_order(orderid_to_epay){
	//https://dhxy.cbg.163.com/cgi/pay_order?orderid_to_epay=
 var geturl="https://"+window.location.host+"/cgi/pay_order?orderid_to_epay="+orderid_to_epay;   
//  ajaxGet(geturl,fnPaySucceed, null,null);
window.location.href= geturl;

}

//订单跳转结果

function fnPaySucceed(head){
  console.log(head);
} 

//通知支付
function post_topay(username,orderid,passwd){
	var posturl="http://127.0.0.1:8000";
	//var postdata="%7b%22username%22%3a%22"+username+"%22%2c%22cookie%22%3a%22" +cookie+ "%22%7d";
	var postdata='{"code":"pay","username":"'+username+'","orderid":"' +orderid+ '","passwd":"' +passwd+ '"}';
	postdata = encodeURI(postdata);
	ajaxPostServer(posturl, postdata, fnPostCookieSucceed, null,null);

}
//通知支付结果
function fnPostCookieSucceed(resp){
    alert(resp);
}


//支付

function pay_passwd(orderId,pass_val){
 var posturl="https://epay.163.com/cashier/m/security/verifyPayItems?v="+new Date().getTime();
 var postdata="securityValid=%7B%22shortPayPassword%22%3A%22"+pass_val+"%22%7D&orderId=" +orderId+ "&envData=%7B%22term%22%3A%22wap%22%7D";
 ajaxPostPay(posturl, postdata, fnPassSucceed, null,null);



}

//支付结果

function fnPassSucceed(resp){
 var obj = JSON.parse(resp);
  console.log(resp);
  if(obj.result == 'error'){
    alert(obj.errorMsg);
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

// ajax post请求：

function ajaxPost (url, data, fnSucceed,fnFail, fnLoading ) {
  var ajax = ajaxObject();

  ajax.open( "post" , url , true );
  ajax.setRequestHeader( "Accept" , "application/json, text/javascript, */*; q=0.01" );
  ajax.setRequestHeader( "Accept-Language" , "zh-CN,zh;q=0.9" );
  ajax.setRequestHeader( "cbg-safe-code" , CBG_CONFIG.safeCode );
  ajax.setRequestHeader( "Content-Type" , "application/x-www-form-urlencoded; charset=UTF-8" );
  ajax.setRequestHeader( "X-Requested-With" , "XMLHttpRequest");   
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

// ajax get请求：

function ajaxGet (url, fnSucceed, fnFail, fnLoading ) {
  var ajax = ajaxObject();
  ajax.withCredentials=true;
  ajax.open( "get" , url , true );
  ajax.setRequestHeader( "Accept" , "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8" );
  ajax.setRequestHeader( "Accept-Language" , "zh-CN,zh;q=0.9" );
  ajax.setRequestHeader( "Upgrade-Insecure-Requests" , "1");   


  ajax.onreadystatechange = function () {
    if( ajax.readyState == 4 ) {
      if( ajax.status == 200 || ajax.status == 302) {
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
  ajax.send(null);
}

// ajax ajaxPostPay：
function ajaxPostPay (url, data, fnSucceed,fnFail, fnLoading ) {
  var ajax = ajaxObject();
  ajax.open( "post" , url , true );
  ajax.setRequestHeader( "Accept" , "application/json, text/javascript, */*; q=0.01" );
  ajax.setRequestHeader( "Accept-Language" , "zh-CN,zh;q=0.9" );
  ajax.setRequestHeader( "Content-Type" , "application/x-www-form-urlencoded; charset=UTF-8" );
  ajax.setRequestHeader( "X-Requested-With" , "XMLHttpRequest");   
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

// ajaxPostServer请求：
function ajaxPostServer(url, data, fnSucceed,fnFail, fnLoading ) {
    var ajax = ajaxObject();
    ajax.open( "post" , url , true );
    ajax.setRequestHeader( "Content-Type" , "application/x-www-form-urlencoded" ); 
    //ajax.setRequestHeader( "Origin" , "https://epay.163.com" ); 
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


function setCookie(c_name,value,expireMinutes){
    var cookieStr = "";
    var exdate=new Date();
    exdate.setMinutes(exdate.getMinutes()+expireMinutes);
    console.log(exdate);
    document.cookie = c_name+ "=" +escape(value)+
    ((expireMinutes==null) ? "" : "; expires="+exdate.toGMTString())+";path=/;domain=.163.com";
}
function setCookieWithTimes(c_name,value,destTime){
    var cookieStr = "";
    var exdate=new Date();
    exdate.setTime(destTime);
    console.log(exdate.toGMTString());
    document.cookie = c_name+ "=" +escape(value)+
    ((expireMinutes==null) ? "" : "; expires="+exdate.toGMTString())+";path=/;domain=.163.com";
}


})();