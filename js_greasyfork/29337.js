// ==UserScript==
// @name        优酷频道主助手
// @author      HY清风
// @description 高级设置默认勾选
// @namespace   http://www.tvjun.com  
// @icon        
// @license     GPL-3.0
// @encoding    utf-8
// @include     *//newvideos.youku.com/u/videos/setbullet/*
// @include     http://newvideos.youku.com/u/videos/save
// @grant       none
// @run-at      document-start
// @version     1.1
// @date        29/04/2017
// @modified    27/08/2018
// @downloadURL https://update.greasyfork.org/scripts/29337/%E4%BC%98%E9%85%B7%E9%A2%91%E9%81%93%E4%B8%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/29337/%E4%BC%98%E9%85%B7%E9%A2%91%E9%81%93%E4%B8%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
 * === 说明 ===
 *@作者:HY清风
 *@官网:http://www.tvjun.com
 *@Email:1232521@qq.com
 *@密码可见 privacy-password
 *@订阅可见 privacy-friend
 *@订阅时间 privacy-follower
 *@自己可见 privacy-private
 
 *@私用禁止转载
 * */

var wait = 1500;

if(isURL("newvideos.youku.com")){
    setTimeout(function(){
		document.getElementById('privacy-friend').click();
	},wait);   
}



if(isURL("newvideos.youku.com")){
    setTimeout(function(){
    document.getElementsByClassName("form_btn_text")[0].click();        
	},wait);   
}


if(isURL("newvideos.youku.com/u/videos/save")){
    setTimeout(function(){
		javascript:mg.cancelok();
	},wait);   
}

function isURL(x){
    if(window.location.href.indexOf(x)!=-1){
        return true;
    }else{
        return false;
    }
}