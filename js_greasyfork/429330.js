// ==UserScript==
		// @name         中国教研网
		// @namespace    https://gzxkc.zgjiaoyan.com/grain/course/
		// @version      0.1
		// @description  神仙不在
		// @author       You
		// @match        https://gzxkc.zgjiaoyan.com/grain/course/*
		// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429330/%E4%B8%AD%E5%9B%BD%E6%95%99%E7%A0%94%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/429330/%E4%B8%AD%E5%9B%BD%E6%95%99%E7%A0%94%E7%BD%91.meta.js
		// ==/UserScript==
		
		(function() {
		    'use strict';
		
		  //如果出现点击下一节，就点击
		  if(document.getElementsByClassName('next')[0]){
		  document.getElementsByClassName('next')[0].click()
		  }
		  
		  function xxx(){
		  	//如果出现点击下一节，就点击
		  	if(document.getElementsByClassName('ended-mask')[0].style.display==''){
		  	document.getElementsByClassName('next')[0].click();}
		  	
		      //点我继续计时
		  	if(document.getElementsByClassName('alarmClock-wrapper')[0].style.display==''){
		  	window.location.reload()}
		  	
		  	//过掉评价
		  	if(document.getElementsByClassName('questionnaire-wrapper')[0].style.display==''){
		  			document.getElementsByClassName('cancel ivu-btn ivu-btn-primary')[0].click();		
		  					}
		  }
		  
		  setInterval(xxx,3000)
		})();