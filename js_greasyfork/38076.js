// ==UserScript==
// @name     remove AD
// @version  1
// @grant    none
// @namespace https://greasyfork.org/zh-CN/users/169070-crane1
// @description 去除广告
// @include * 
// @downloadURL https://update.greasyfork.org/scripts/38076/remove%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/38076/remove%20AD.meta.js
// ==/UserScript==

window.setTimeout(function(){
  	//1.class 选择器广告
    var adSelecter = new Array("wangmeng-ad"); //广告选择器class
  	
    // 移除每个广告div
    for(x in adSelecter){
        var adChild = document.getElementsByClassName(adSelecter[x]);
        for(var i = 0; i < adChild.length; i++){
            adChild[i].parentNode.removeChild(adChild[i]);
        }
    }
  
    //2. id 选择器广告
    adSelecter = new Array("ad_head","ad");  //广告选择器id
    
  	for(x in adSelecter){
        var adChild = document.getElementsByClassName(adSelecter[x]);
        adChild[i].parentNode.removeChild(adChild[i]);
    }
},60
)