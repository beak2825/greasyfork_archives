// ==UserScript==
// @name         藏宝阁商品页面
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  藏宝阁抢号,商品页面开始,刷新商品详情页面。
// @author       wang.zhao
// @match        https://epay.163.com/*
// @match        https://lh.cbg.163.com/cgi/mweb/equip/*
// @match        https://lh.cbg.163.com/cgi/mweb/order/confirm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375607/%E8%97%8F%E5%AE%9D%E9%98%81%E5%95%86%E5%93%81%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/375607/%E8%97%8F%E5%AE%9D%E9%98%81%E5%95%86%E5%93%81%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==


(function() {
  'use strict';

//  https://lh.cbg.163.com/cgi/mweb/equip/2/201812100702616-2-TF4WZFRDN6SAD4?view_loc=all_list
	var sTime="2018/12/17 15:00:16";
	var pass_val="111111";
	var amount="870.10";
	
	var intval_time=1000;
	var intval=5;
	
	var Yamount="¥"+amount;
	
	sTime = Date.parse(sTime);
	var loop = 0;
	checkTime();
	
	var func_time = setInterval(checkTime,intval_time);
	var func_step;

	function checkTime()
	{
		var now = new Date().getTime();
		console.log("checkTime1 now:"+now+" St:"+sTime+ " Intev:"+(sTime - now)+ " loop:"+loop);
		
		if(sTime - now <= intval*1000){
			window.clearInterval(func_time);
			func_step = setInterval(checkStep,100);
		}
		
		if(loop > 60){
			location.reload();
			loop = 0;
		}
		loop += 1;
	}

	function checkStep() {
		var b0=document.getElementsByClassName("btn btn-large disabled btn-fairshow");
		if(b0.length > 0){
		   window.clearInterval(func_step);
		   location.reload();
		}

		var b1=document.getElementsByClassName("btn btn-large bold");
		if(b1.length > 0){
		   window.clearInterval(func_step);
		   console.log("开始时间:"+new Date().getTime());
		   b1[0].click();
		}

		var b2=document.getElementsByClassName("btn btn-large");
		if(b2.length > 0){
		    window.clearInterval(func_step);
		    	    
		    var price=document.getElementsByClassName("price");
		    if(price[0].textContent == Yamount)
		    {
		     	console.log("开始时间:"+new Date().getTime());
		    	b2[b2.length-1].click();
		    }else{
		       console.log("价格变更");
		    }		
		    
		    
		}
		
		var b3=document.getElementsByClassName("modal-button");
		if(b3.length > 1){
		    window.clearInterval(func_step);
		    b3[1].click();
		}
		
		var pass=document.getElementById("shortPassword");
		var passbtn=document.getElementById("shortPasswordBtn");
		if(pass)
		{
		    window.clearInterval(func_step);
		    console.log("amount:"+amount+" needAmount:"+needAmount.textContent);
		    if(needAmount.textContent == amount)
		    {
		        console.log("结束时间:"+new Date().getTime());
		        pass.value = pass_val;
		        passbtn.click();
		    }else{
		        console.log("价格变更");
		    }		
		}

	}
})();