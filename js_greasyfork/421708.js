// ==UserScript==
// @name              【鼠标美化】可自定义鼠标指针特效、点击特效、动态文字特效等显示效果，兼容大部分网站。自带40多个效果还可自行添加，超多种组合。定义属于你自己的专属鼠标效果网页美化效果
// @namespace http://gongju.dadiyouhui03.cn/app/tool/youhou/index.html
// @version           1.2020020115
// @description      可自定义鼠标特效等显示效果，兼容大部分网站。自带40多个效果，几百种组合。定义属于你自己的专属鼠标效果。更多功能有时间再更新，
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_info
// @grant             GM_notification
// @grant             GM_getResourceText
// @grant             GM_openInTab
// @grant             GM_download
// @noframes
// @connect     zhihu.com
// @connect     weixin.qq.com
// @connect     dadiyouhui02.cn

// @connect *
// @downloadURL https://update.greasyfork.org/scripts/421708/%E3%80%90%E9%BC%A0%E6%A0%87%E7%BE%8E%E5%8C%96%E3%80%91%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E9%BC%A0%E6%A0%87%E6%8C%87%E9%92%88%E7%89%B9%E6%95%88%E3%80%81%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88%E3%80%81%E5%8A%A8%E6%80%81%E6%96%87%E5%AD%97%E7%89%B9%E6%95%88%E7%AD%89%E6%98%BE%E7%A4%BA%E6%95%88%E6%9E%9C%EF%BC%8C%E5%85%BC%E5%AE%B9%E5%A4%A7%E9%83%A8%E5%88%86%E7%BD%91%E7%AB%99%E3%80%82%E8%87%AA%E5%B8%A640%E5%A4%9A%E4%B8%AA%E6%95%88%E6%9E%9C%E8%BF%98%E5%8F%AF%E8%87%AA%E8%A1%8C%E6%B7%BB%E5%8A%A0%EF%BC%8C%E8%B6%85%E5%A4%9A%E7%A7%8D%E7%BB%84%E5%90%88%E3%80%82%E5%AE%9A%E4%B9%89%E5%B1%9E%E4%BA%8E%E4%BD%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E4%B8%93%E5%B1%9E%E9%BC%A0%E6%A0%87%E6%95%88%E6%9E%9C%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/421708/%E3%80%90%E9%BC%A0%E6%A0%87%E7%BE%8E%E5%8C%96%E3%80%91%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E9%BC%A0%E6%A0%87%E6%8C%87%E9%92%88%E7%89%B9%E6%95%88%E3%80%81%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88%E3%80%81%E5%8A%A8%E6%80%81%E6%96%87%E5%AD%97%E7%89%B9%E6%95%88%E7%AD%89%E6%98%BE%E7%A4%BA%E6%95%88%E6%9E%9C%EF%BC%8C%E5%85%BC%E5%AE%B9%E5%A4%A7%E9%83%A8%E5%88%86%E7%BD%91%E7%AB%99%E3%80%82%E8%87%AA%E5%B8%A640%E5%A4%9A%E4%B8%AA%E6%95%88%E6%9E%9C%E8%BF%98%E5%8F%AF%E8%87%AA%E8%A1%8C%E6%B7%BB%E5%8A%A0%EF%BC%8C%E8%B6%85%E5%A4%9A%E7%A7%8D%E7%BB%84%E5%90%88%E3%80%82%E5%AE%9A%E4%B9%89%E5%B1%9E%E4%BA%8E%E4%BD%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E4%B8%93%E5%B1%9E%E9%BC%A0%E6%A0%87%E6%95%88%E6%9E%9C%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

//      
if (GM_getValue('shubiaokg')){

}else{
   GM_setValue('shubiaokg', 0)
   
}
var shubdz='http://gongju.dadiyouhui.cn/tampermonkey/shubiaoshezhi.php'
var tp1='https://www.dadiyouhui02.cn/img/menghuan.ico'	
var tp2='https://ae01.alicdn.com/kf/H88647b1696564b9d880fdf741d728ec3a.png'	
var tp3='https://ae01.alicdn.com/kf/H88647b1696564b9d880fdf741d728ec3a.png'		
	var sm='设置成功'
	
	if (GM_getValue('tpa1')){
tp1=GM_getValue('tpa1')	
}
	if (GM_getValue('tpa2')){
tp2=GM_getValue('tpa2')	
}
	if (GM_getValue('tpa3')){
tp3=GM_getValue('tpa3')	
}
 GM_registerMenuCommand("【🌺  点击设置鼠标效果】", function(){
GM_openInTab(shubdz+'?kg='+GM_getValue('shubiaokg'), {active: !0});
    });  

function getQueryString(name) {
var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
var r = window.location.search.substr(1).match(reg);
if (r != null) {
return unescape(r[2]);
}
return null;
}
var baiduurljaSurl=window.location.href 
if (GM_getValue('tp1')){

}else{
   GM_setValue('tp1', tp1)
   
}
if (GM_getValue('tp2')){

}else{
   GM_setValue('tp2', tp2)
   
}
if (GM_getValue('tp3')){

}else{
   GM_setValue('tp3', tp3)
   
}

		
	if (baiduurljaSurl.search(shubdz)>=0){

	 	 if (getQueryString('kg')==1){
   GM_setValue('shubiaokg', 1)
	
}
	 	 if (getQueryString('kg')==0){
   GM_setValue('shubiaokg', 0)
	 GM_setValue('wenzikg', 1)
}

if (getQueryString("tp1")){

   	 if (getQueryString('tp1')==0){
	GM_setValue('tp1', tp1)
	   GM_setValue('shubiaokg', 0)
}else{

   GM_setValue('tp1', decodeURIComponent(getQueryString("tp1")))
	   GM_setValue('shubiaokg', 0)
}
	alert(sm);   
   }
if (getQueryString("tp2")){

   	 if (getQueryString('tp2')==0){
	GM_setValue('tp2', tp2)
	   GM_setValue('shubiaokg', 0)
}else{
   GM_setValue('tp2', decodeURIComponent(getQueryString("tp2")))
	   GM_setValue('shubiaokg', 0)
}
	alert(sm);   
   }
   
   if (getQueryString("tp3")){

   	 if (getQueryString('tp3')==0){
	GM_setValue('tp3', tp3)
	   GM_setValue('shubiaokg', 0)
}else{
   GM_setValue('tp3', decodeURIComponent(getQueryString("tp3")))
	   GM_setValue('shubiaokg', 0)
}
	alert(sm);   
   }
   
      if (getQueryString("wenzi")){

   	 if (getQueryString('wenzi')==0){
 GM_setValue('wenzikg', 1)
}else{

   GM_setValue('wenzi', localStorage.getItem("wenzi"))
   
  	   GM_setValue('wenzikg', 0)

}
	alert(sm);   
   }
} 
   
        
(function() {
    'use strict';
     if (window.top == window.self){
$(document).ready(function(){

	if (GM_getValue('wenzikg')==0){

			var a_idx = 0;
			window.onclick = function(event){
		
				 var a =  GM_getValue('wenzi').split(",");

				var heart = document.createElement("b");
				heart.onselectstart = new Function('event.returnValue=false');	

				document.body.appendChild(heart).innerHTML = a[a_idx];		
				
				a_idx = (a_idx + 1) % a.length;
				heart.style.cssText = "position: fixed;left:-100%;";

				var f = 16, 
	                x = event.clientX - f / 2,
	                y = event.clientY - f, 
	                c = randomColor(), 
	                a = 1, 			
	                s = 1.2; 		

				var timer = setInterval(function(){	
					if(a <= 0){
						document.body.removeChild(heart);
						clearInterval(timer);
					}else{
						heart.style.cssText = "font-size:16px;cursor: default;position: fixed;z-index:999999999999;color:" + c + ";left:" + x + "px;top:" + y + "px;opacity:" + a + ";transform:scale(" + s + ");";

	                    y--;
	                    a -= 0.016;
	                    s += 0.002;
					}
				},15)

			}
		
	        function randomColor() {

	            return "rgb(" + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + ")";

	        }

}

if (GM_getValue('shubiaokg')){
if (GM_getValue('shubiaokg')==1){
	return false
}
}else{
   GM_setValue('shubiaokg', 0)
   
}

	if($("#shubiaodiy").length>0){}else{
	  var siddenav = '<style>  html,body {     cursor: url('+GM_getValue('tp1')+'), default; } input[type=button],button,a:hover{cursor:url('+GM_getValue('tp2')+'), pointer;}</style>';
  
    $("head").append(siddenav);
    $("body").append('<div id="shubiaodiy"></div>');
   $("html").click(function(){
    	 	$("body").css("cursor", "url("+GM_getValue('tp3')+"), auto");
    	$("html").css("cursor", "url("+GM_getValue('tp3')+"), auto");
   window.setTimeout(copy_success, 100);
   function copy_success() {
   	$("html").css("cursor", "url("+GM_getValue('tp1')+"), auto");
   	   	$("body").css("cursor", "url("+GM_getValue('tp1')+"), auto");
} 	
})

}
		})
			}
})();


