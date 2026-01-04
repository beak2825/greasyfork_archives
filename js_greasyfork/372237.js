// ==UserScript==
// @name        熊猫TV/去除网络检测/自动最清晰/屏蔽送礼物和某些广告
// @namespace   https://greasyfork.org/
// @description 干掉低清晰度通道，强制播放高画质
// @include     http://www.panda.tv/*
// @include     https://www.panda.tv/*
// @version     1
// @grant       none
// @QQ          215913940
// @downloadURL https://update.greasyfork.org/scripts/372237/%E7%86%8A%E7%8C%ABTV%E5%8E%BB%E9%99%A4%E7%BD%91%E7%BB%9C%E6%A3%80%E6%B5%8B%E8%87%AA%E5%8A%A8%E6%9C%80%E6%B8%85%E6%99%B0%E5%B1%8F%E8%94%BD%E9%80%81%E7%A4%BC%E7%89%A9%E5%92%8C%E6%9F%90%E4%BA%9B%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/372237/%E7%86%8A%E7%8C%ABTV%E5%8E%BB%E9%99%A4%E7%BD%91%E7%BB%9C%E6%A3%80%E6%B5%8B%E8%87%AA%E5%8A%A8%E6%9C%80%E6%B8%85%E6%99%B0%E5%B1%8F%E8%94%BD%E9%80%81%E7%A4%BC%E7%89%A9%E5%92%8C%E6%9F%90%E4%BA%9B%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
   $(document).ready(function(){
	   var delLoginPopItvl = setInterval(function(){
		   //屏蔽检测网络情况
		   var arr = document.getElementsByClassName("h5player-control-bar-stream-autoswitch-panel");
		   for(i=0; i<arr.length; i++){
			   if (arr[i] !== null)
				   arr[i].parentNode.removeChild(arr[i]);
		   }
		   //屏蔽送礼物和推广
		   var arr2 = document.getElementsByClassName("h5player-send-gift-slider");
		   for(i=0; i<arr2.length; i++){
			   if (arr2[i] !== null)
				   arr2[i].parentNode.removeChild(arr2[i]);
		   }
		   var arr3 = document.getElementsByClassName("room-foot-box sk-img-foot sk-bg-headfoot  clearfix");
		   for(i=0; i<arr3.length; i++){
			   if (arr3[i] !== null)
				   arr3[i].parentNode.removeChild(arr3[i]);
		   }
		   var arr4 = document.getElementsByClassName("sec-block__side");
		   for(i=0; i<arr4.length; i++){
			   if (arr4[i] !== null)
				   arr4[i].parentNode.removeChild(arr4[i]);
		   }
		   //循环检测画质是否最高
		   var arr1 = document.getElementsByClassName("h5player-control-bar-kbps-change");
		   var hight = arr1[0].innerHTML;//最高画质
		   while (typeof(hight) == "undefined"){//如果获取值为空，循环获取
			   arr1 = document.getElementsByClassName("h5player-control-bar-kbps-change");
			   hight = arr1[0].innerHTML;
		   }
           var x = document.getElementsByClassName("h5player-control-circlebar-btn h5player-control-circlebar-stream")[0].innerHTML.replace(/\s+/g,"");//获取当前载入画质
		   if(hight !== x){
			   arr1[0].click();
		   }
		   //等待更新
	   }, 1000);
    });
})();