// ==UserScript==
// @name         usascript
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动获取页面原生并自动点击
// @author       ll
// @match        https://accounts.google.com/*
// @match        https://getuba.uba.finance/*
// @match        https://fireflyfoundation.typeform.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/js-cookie/3.0.1/js.cookie.js
// @grant        GM_xmlhttpRequest
// @connect      weleader5.oss-cn-shenzhen.aliyuncs.com
// @connect      pv.sohu.com
// @connect      clcode.getpx.cn
// @connect      2captcha.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @license		 lly
// @downloadURL https://update.greasyfork.org/scripts/440774/usascript.user.js
// @updateURL https://update.greasyfork.org/scripts/440774/usascript.meta.js
// ==/UserScript==

(function () {
	'use strict';	
    var email="";
    var password="";
    $(function () {     
         //开始获取账号
         var ipUrl = "http://clcode.getpx.cn:3001/api/UBA_UserAccount/GetAccount";
         console.info(ipUrl);         
          GM_xmlhttpRequest({
             url: ipUrl,
             method: "GET",
             data: "",
             headers: {
                 "Content-type": "application/x-www-form-urlencoded"
             },
             onload: function (xhr) {
                 console.info('ip地址：', xhr.responseText) 
                 if(xhr.status==200)    {
                   var ipdata = JSON.parse(xhr.responseText);                
                  if (ipdata && ipdata.success) {
                    email=ipdata.response.Email;
                    password=ipdata.response.Password;
                     //开始功能操作
                     Cookies.set('email', email);
                     Cookies.set('password', password);
                     pageOperate();

                   }                 
                 }
             },
             onerror : function(err){
                email=Cookies.get('email');
                password=Cookies.get('password');
            }          
         });
	})
    

	function pageOperate() {
		var pageurl = window.location.href.split('//')[1].split('?')[0];		
		console.info(pageurl)
		switch (pageurl) {
	case 'getuba.uba.finance/login':                           
         var  event = document.createEvent('HTMLEvents')
         event.initEvent('input', false, true)
         setTimeout(function () {
            document.querySelector('.email-box input').value=email;
            document.querySelector('.email-box input').dispatchEvent(event);
            document.querySelector('.email-box .reg-btn').click();
        }, 2000) 
        setTimeout(function () {
            document.querySelector('.email-box input').value=password;
            document.querySelector('.email-box input').dispatchEvent(event);
            document.querySelector('.email-box .reg-btn').click();
        }, 4000) 

        break;  
        case 'getuba.uba.finance/mine':       
        document.querySelector('.mineBox-btn').click();          
            var isstart_Interval = setInterval(function () {
                console.log("监控是否停止");
            if($(".mineBox-btn").html().indexOf("Start")>-1){  
                document.querySelector('.mineBox-btn').click();   
                }
            },3000); 
            setTimeout(function () {
                $(".popWindow-box-btnBox").find("div")[0].click()
            }, 1000) 
            break;
        case 'fireflyfoundation.typeform.com/testnet':
            var  event1 = document.createEvent('HTMLEvents')
            event1.initEvent('input', false, true)
            document.querySelector('input').value=email;  
            document.querySelector('input').dispatchEvent(event1);          
            document.querySelector('button').click();
         break;
	     default:                 
				console.info('default验证___grecaptcha_cfg', unsafeWindow.___grecaptcha_cfg)
				setTimeout(function () {
					if (unsafeWindow.___grecaptcha_cfg) {
						//queueRecaptchasel();
					}
				}, 3000)
				break;
		}
	}
})();