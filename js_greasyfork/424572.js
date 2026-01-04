// ==UserScript==
// @name                        网易企业邮箱自用脚本
// @description         1.自动登录帐号,2.登录后自动打开账户列表。
// @namespace   ny1jlnkq1nz09y5cux4jlh2g42rd8ztr
// @author                      me
// @match        https://qy.163.com/login/*
// @match        https://mail.qiye.163.com/static/*
// @version                     2022.06.13.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424572/%E7%BD%91%E6%98%93%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/424572/%E7%BD%91%E6%98%93%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 2022.06.13 更新帐号信息
// 2022.01.22 网易登录域名由qiye.163.com变为qy.163.com
// 2021.04.26 帐号属性自动选择自定义安全等级，和下次登录不需要修改密码
// 2021.04.12 登录后自动打开账号登录界面
// 2021.04.06 初版
(function() {
    if (location.href.indexOf("login=auto") != -1) {
		//https://qy.163.com/login/?p=admin&login=auto
        setTimeout(function (){
        adminname.value="admin@cmk-world.com";
        adminpwd.value="CMKmail2021pw";
        document.getElementsByClassName("js-privateRule")[1].checked=true;
        document.getElementsByClassName("w-button w-button-admin js-loginbtn")[0].click();
		}
		,100)
	}

	if (location.href.indexOf("static/new/index.html") != -1) {
		//https://mail.qiye.163.com/static/new/index.html#/home
        setTimeout(function (){
			//document.getElementsByTagName("tab-heading")[2].click()
            location.href="#/account/list"
		}
		,100)
		
		setInterval(function (){
			//下次登录不强制修改密码
			//if (location.href.indexOf("account/editAccount") != -1 || location.href.indexOf("account/createAccount")) {
			if (location.href.indexOf("account/createAccount")) {
				if (document.getElementsByName("passchange_req").length > 0){
					if (document.getElementsByName("passchange_req")[0].value > 0 ){
						//document.getElementsByName("passchange_req")[0].value=0; 虽然改了值下拉菜单也变了，但是保存不了，改为标记黄色。
                        document.getElementsByName("passchange_req")[0].style.background="yellow"
					}
				}
				if (document.getElementsByName("modeRadios").length > 0){
					if (document.getElementsByName("modeRadios")[2].checked != true ){
						document.getElementsByName("modeRadios")[2].click();//自定义安全模式
                        document.getElementsByName("modeRadios")[2].parentNode.style.background="GreenYellow"
					}
				}
			}
			
		}
		,2000)
	}
})();