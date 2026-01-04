
// ==UserScript==
// @name         alibabaClient
// @namespace    http://magaret.cn/
// @version      1.1
// @description  用于获取扣个页面的信息
// @author       You
// @match        https://alicrm.alibaba.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license      MIT
// @require 	 https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440750/alibabaClient.user.js
// @updateURL https://update.greasyfork.org/scripts/440750/alibabaClient.meta.js
// ==/UserScript==
(function() {
    $(document).ready(function(){
      		var but = `<button type="button" style="width: 50px;height: 30px;" class="add">按钮</button>`
      		$(".crm-app-main-header-title").append(but)
			$(".add").click(function(){
				// 接待时间；	   客户名称；	   注册时间 邮件 官网 手机号 座机
				var jtime,time="-",client,state="-",ztime,email,web,iphone,telephone;

                // 接待日期
				jtime = $(".time-line-content .time").text()
                // 客户名称
                client = $("#app > div > div > div.crm-app-main-container > div > div > div > div > div.customer-profile > div.section > div.section-content > div:nth-child(2) > div > div.content > div:nth-child(1) > div.value > div > span").text();
                // 注册时间
                ztime = $("#app > div > div > div.crm-app-main-container > div > div > div > div > div.customer-profile > div.section > div.section-content > div.show-details > div:nth-child(1) > div.show-details-item-content > div:nth-child(8) > div.value").text();
                // 邮件
                email = $("#app > div > div > div.crm-app-main-container > div > div > div > div > div.customer-profile > div.section > div.section-content > div:nth-child(2) > div > div.content > div:nth-child(2) > div.value > div > span").text();
                // 手机号
                iphone = $("#app > div > div > div.crm-app-main-container > div > div > div > div > div.customer-profile > div.section > div.section-content > div:nth-child(2) > div > div.content > div:nth-child(4) > div.value > div").text();
                // 座机
                telephone = $("#app > div > div > div.crm-app-main-container > div > div > div > div > div.customer-profile > div.section > div.section-content > div:nth-child(2) > div > div.content > div:nth-child(5) > div.value > div").text();
                // 官网
                web = $("#app > div > div > div.crm-app-main-container > div > div > div > div > div.customer-profile > div.section > div.section-content > div.show-details > div:nth-child(2) > div.show-details-item-content > div:nth-child(2) > div.value").text();
                //
                console.log(jtime+":"+time+":"+client+":"+state+":"+email+":"+web+":"+iphone+":"+telephone)
                var table = "<table><tr><td>"+jtime+"</td><td>"+time+"</td><td>"+client+"</td><td>"+state+"</td><td>"+ztime+"</td><td>"+email+"</td><td>"+web+"</td><td>"+iphone+"</td><td>"+telephone+"</td></tr></table>"
                alert(table)




			})
      	})

})();
