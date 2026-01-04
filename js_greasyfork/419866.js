// ==UserScript==
// @name         tmall to maotai
// @name:zh-CN   天猫抢茅台
// @namespace    com.tmall.maotai
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @version      3.0
// @description  go tmall to maotai
// @description:zh-cn   去天猫抢茅台
// @author       ylfs
// @include      https://chaoshi.detail.tmall.com/*
// @include      https://detail.tmall.com/*
// @include      https://buy.tmall.com/order/*
// @include      https://cart.tmall.com/*
// @grant        GM_xmlhttpRequest
// @require      http://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419866/tmall%20to%20maotai.user.js
// @updateURL https://update.greasyfork.org/scripts/419866/tmall%20to%20maotai.meta.js
// ==/UserScript==
var targetTime="20:00";
var startTime="19:59";
var curTime="";
(function () {
    'use strict';
    var btn = document.createElement("input");
    btn.setAttribute("id", "cj_btn");
    btn.setAttribute("type", "button");
    btn.setAttribute("value", "开始");
    btn.setAttribute("style", "position: fixed;z-index:99999;top: 40%;right: 20px; width: 100px;height: 68px;line-height: 68px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    document.body.appendChild(btn);
    $('#cj_btn').on('mouseover', function () {
        $('#cj_btn').css("background-color","#48a9f5");
    });
    $('#cj_btn').on('mouseout', function () {
        $('#cj_btn').css("background-color","#1E9FFF");
    });
    var flag=true;
    $('#cj_btn').on('click', function () {
        $('#time_div').css("display","block");
        setInterval(setTime,100);
    });

    var div = document.createElement("div");
    div.setAttribute("id", "time_div");
    div.setAttribute("style", "position: fixed;z-index:99999;top: 20%;right: 20px; width: 200px;height:58px;line-height: 58px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;display:none;");
    document.body.appendChild(div);

    setInterval(toCart,500);
    setInterval(getOrder,100);
})();
var isCart=true;
function toCart(){
   var curUrl = window.location.href;
   if(curUrl.indexOf("https://cart.tmall.com/cart.htm?from=bmini&tpId=725677994")>=0&&isCart){
      document.getElementById("J_Go").click();
      isCart=false;
   }
}
var isOrder=true;
function getOrder(){
   var curUrl = window.location.href;
   if(curUrl.indexOf("https://buy.tmall.com/order/confirm_order.htm")>=0&&isOrder){
      document.getElementsByClassName("go-btn")[0].click();
      isOrder=false;
   }
}
var isClick=true;
function setTime(){
	var date = new Date();
	var y = date.getFullYear();
	var m =date.getMonth()+1;
	var d = date.getDate();
	var w = date.getDay();
	var ww = ' 星期'+'日一二三四五六'.charAt(new Date().getDay()) ;
	var h = date.getHours();
	var minute = date.getMinutes();
	var s = date.getSeconds();
	var sss = date.getMilliseconds();
	if(m<10){
		m = "0"+m;
	}
	if(d<10){
		d = "0"+d;
	}
	if(h<10){
		h = "0"+h;
	}
	if(minute<10){
		minute = "0"+minute;
	}
	if(s<10){
		s = "0"+s;
	}
	if(sss<10){
		sss = "00"+sss;
	}else if(sss<100){
		sss = "0"+sss;
	}
    curTime= h+":"+minute;

	document.getElementById("time_div").innerHTML = y+"-"+m+"-"+d+"   "+h+":"+minute+":"+s+"."+sss+"  "+ww;
	//document.write(y+"-"+m+"-"+d+"   "+h+":"+minute+":"+s);

    if((curTime==targetTime||startTime==curTime)&&isClick){
        if(document.getElementsByClassName("tb-btn-wait").length==0){
            isClick = false;
            document.getElementById("J_LinkBasket").click();
            setTimeout(function(){
                var url="https://cart.tmall.com/cart.htm?from=bmini&tpId=725677994";
                window.location.href=url;
            }, 500);
        }
        
    }
}
function getTime(){
     GM_xmlhttpRequest({
           method: "POST",
           url:"http://api.m.taobao.com/res/api3.do?api=mtop.common.getTimestamp",
           dataType: "json",
           headers:  {
               "Accept":"application/json",
               "Content-Type": "application/json"
            },
           onload: function(xhr) {
                if(xhr.readyState==4&&xhr.status==200){
                   var responseHeaders = xhr.responseHeaders;
                    console.log(xhr);
                    //res.data.t为String类型的时间戳，所以需要先转换成Integer类型，再转换为Date类型
                    var time = new Date(parseInt(xhr.response));
                    console.log(time);
                }
            }
        });
}