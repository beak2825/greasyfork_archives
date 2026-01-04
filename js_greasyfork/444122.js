// ==UserScript==
// @name         上财教学网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  可以自动登录上财教学网，需要在运行前在下面代码里的“学号”“密码”里手动填写学号与密码，新版主页不能用
// @author       DM
// @match        https://bb.shufe.edu.cn/portal
// @match        http://bb.shufe.edu.cn/portal
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/444122/%E4%B8%8A%E8%B4%A2%E6%95%99%E5%AD%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/444122/%E4%B8%8A%E8%B4%A2%E6%95%99%E5%AD%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ID = '学号'
    var password = 'NetID密码'
    function autologin(){
        if (document.getElementById("portal").ownerDocument.body.contains(document.getElementById("portal"))){
		var backurl=$("#refer").val();
       var dataurl = "userid=" + encodeURIComponent(ID) + "&password=" + encodeURIComponent(password) + "&backurl="+encodeURIComponent(backurl);
		console.log(dataurl);
		$.ajax({
			type:'Get',
			async: false,
			url:'/sso/sufemooc',
			cache:false,
			data:dataurl,
			success:function(data){
				data=eval('(' + data + ')');
				if(data.re!=0){
				alert("登录失败，请确认使用NetID帐号密码登录！");
				$(".w_login_item .w_load").click();
				}else{
				location.href = data.msg;
				}
			}
		});}
        else { ;}

}

autologin();


})();