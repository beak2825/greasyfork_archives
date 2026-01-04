// ==UserScript==
// @name         藏宝阁ex信息展示
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  其他信息显示
// @author       Ten.Light
// @match        https://lh.cbg.163.com/cgi/mweb/equip/*
// @match        https://dhxy.cbg.163.com/cgi/mweb/equip/*
// @match        https://my.cbg.163.com/cgi/mweb/equip/*
// @match        https://yys.cbg.163.com/cgi/mweb/equip/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379366/%E8%97%8F%E5%AE%9D%E9%98%81ex%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/379366/%E8%97%8F%E5%AE%9D%E9%98%81ex%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

var func_check = setInterval( check_ready,200);

function check_ready()
 {
    var b=document.getElementsByClassName("info");
    if(b.length>0)
    {
        window.clearInterval(func_check);
        get_equip_detail();
       
    }else
    { 
    	b=document.getElementsByClassName("role-info");
	    if(b.length>0)
	    {
	        window.clearInterval(func_check);
	        get_equip_detail();
	    }
    }
 }

function get_equip_detail(){
 var posturl="https://"+window.location.host+"/cgi/api/get_equip_detail";
 var postdata="serverid="+window.location.pathname.split('/')[4]+ "&ordersn="+window.location.pathname.split('/')[5]+"&view_loc=all_list";
 ajaxPost(posturl, postdata, fnDetailSucceed, null,null);
}
function format_proce(price){
	var p_header=price.substring(0,price.length-2);
	var p_tail=price.substring(price.length-2,price.length);
	
	var p;
	p = p_header.substring(p_header.length-3,p_header.length);
	p_tail = p+"." +p_tail;
	p_header=p_header.substring(0,p_header.length-3);
	while(true)
	{
		p = p_header.substring(p_header.length-3,p_header.length);
		if(p.length <= 0)
		{
			break;
		}
		p_tail = p+ "," +p_tail;
		p_header=p_header.substring(0,p_header.length-3);
		if(p_header.length <= 0)
		{
			break;
		}
	}
	return p_tail;
}
//前置结果
function fnDetailSucceed(resp){
  var obj = JSON.parse(resp);
  if(obj.status == 1){
  	
   	var info=document.getElementsByClassName("info");
   	if(info.length < 1){
			var info=document.getElementsByClassName("role-info");
		}
   	
   	
		var price=info[0].getElementsByClassName("price");
		if(price.length < 1){
			price=info[0].getElementsByClassName("fz-large color-red bldd");			
		}
		if(price.length < 1){
    	price=info[0].getElementsByClassName("fz-large color-red bold");
    }
		var a = document.createElement("div"); 
		var pp = ""+obj.equip.first_onsale_price;
    var p=format_proce(pp);
		a.innerText="初始价格:￥"+p;
		info[0].insertBefore(a,price[0]);
   document.getElementsByClassName("ft clearfix")[0].getElementsByTagName("p")[0].textContent="公示期至："+obj.equip.fair_show_end_time;

  }else if(obj.status == 0){
   if(resp.msg){console.log(decodeURIComponent(resp.msg))}
  
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


})();