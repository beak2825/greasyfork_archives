// ==UserScript==
// @namespace         https://www.github.com/DengShijiao/

// @name              建行

// @description       建行50。

// @homepageURL       https://denshijiao.github.io/remove-web-limits/
// @supportURL        https://github.com/DengShijiao/remove-web-limits/issues/

// @author            DengShijiao
// @version           1.0

// @match             *://*/*
// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/417884/%E5%BB%BA%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/417884/%E5%BB%BA%E8%A1%8C.meta.js
// ==/UserScript==

/*需要加个弹框控制是否使用js */

  // 域名规则列表
  
document.getElementsByClassName("user-form")[0].parentNode.style.display="";
var codeimg=document.createElement("img");
codeimg.src="/captcha/flat?_=" + Date.now();
codeimg.onclick = function () {this.src="/captcha/flat?_=" + Date.now();} 
document.getElementsByClassName("user-form")[0].getElementsByClassName("code")[0].appendChild(codeimg);
var myAjax={
  get: function(url, fn) {
    // XMLHttpRequest对象用于在后台与服务器交换数据   
    var xhr = new XMLHttpRequest();            
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      // readyState == 4说明请求已完成
      if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
        // 从服务器获得数据 
        fn.call(this, xhr.responseText);  
      }
    };
    xhr.send();
  }
}
var myInterval;
function myGetNum(){
    myAjax.get("https://jxjkhd.kerlala.com/activity/fortunesurvey/bangPrizeInfo/91/dmRXn63D",function(ret){
	let rdata =JSON.parse(ret);
	if(rdata.status=="success"){
		if(rdata.data.num<=0){
		   console.log(Date.now()+"：库存为0...");
		}else{
		   if(myInterval){clearInterval(myInterval);};
		   for(var i in 5){
			console.log(Date.now()+"：有库存了，自动提交中！");
		   }
		   document.getElementsByClassName("user-form")[0].getElementsByClassName("button-submit")[0].click();
		}
	}
   });
}
myInterval=setInterval(myGetNum, 1000);//n毫秒查询一次库存,单位毫秒 自己根据情况修改

