// ==UserScript==
// @name         卡盟登陆按钮 - ByXiaoXie
// @namespace    https://byxiaoxie.com/
// @version      0.1
// @description  卡盟账号密码自动输入 - ByXiaoXie
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394709/%E5%8D%A1%E7%9B%9F%E7%99%BB%E9%99%86%E6%8C%89%E9%92%AE%20-%20ByXiaoXie.user.js
// @updateURL https://update.greasyfork.org/scripts/394709/%E5%8D%A1%E7%9B%9F%E7%99%BB%E9%99%86%E6%8C%89%E9%92%AE%20-%20ByXiaoXie.meta.js
// ==/UserScript==

window.onload=km_login()

function km_login(){
	try{
		var dx_class = document.getElementsByClassName('dxsite')
		var dx_a = dx_class[0].getElementsByTagName('a')[0].text

		if(dx_a == "电信站"){
			var login_div = document.getElementsByClassName('login_other')[0]
			login_div.innerHTML='<dt>您也可以用合作网站帐号登录</dt><dd><a class="login_qq" href="/OAuth/OAuthAccountLogin.asp?OAuthType=qq" target="_blank">QQ</a></dd><dd><a class="jiecao login_qq" href="#">JieCao</a></dd><dd><a class="xiaoxie login_qq" href="#">XiaoXie</a></dd>'

			var jiecao = document.getElementsByClassName('jiecao')[0]
			jiecao.addEventListener("click",login_jiecao)

			var xiaoxie = document.getElementsByClassName('xiaoxie')[0]
			xiaoxie.addEventListener("click",login_xiaoxie)
		}
	}
	catch(e){
		console.log("Not Km 1")
		km_login_2()
	}
}

function km_login_2(){
	try{
		var login_div = document.getElementsByClassName('login_other')[0]
		login_div.innerHTML='<dt>您也可以用合作网站帐号登录</dt><dd><a class="login_qq" href="/front/otherLogin.htm?type=qq" target="_blank">QQ</a></dd><dd><a class="jiecao login_qq" href="#">JieCao</a></dd><dd><a class="xiaoxie login_qq" href="#">XiaoXie</a></dd>'

		var jiecao = document.getElementsByClassName('jiecao')[0]
		jiecao.addEventListener("click",login_jiecao_2)

		var xiaoxie = document.getElementsByClassName('xiaoxie')[0]
		xiaoxie.addEventListener("click",login_xiaoxie_2)
	}
	catch(e){
		console.log("Not Km 2")
		km_login_3()
	}
}

function km_login_3(){
	try{
		var login_div = document.getElementsByClassName('key-lg')[0]
		login_div.innerHTML='<a href="/front/otherLogin.htm?type=qq" target="_blank" class="k-qq"></a><a class="jiecao login_qq" href="#">JieCao</a><a class="xiaoxie login_qq" href="#">XiaoXie</a>'

		var jiecao = document.getElementsByClassName('jiecao')[0]
		jiecao.addEventListener("click",login_jiecao_2)

		var xiaoxie = document.getElementsByClassName('xiaoxie')[0]
		xiaoxie.addEventListener("click",login_xiaoxie_2)
	}
	catch(e){
		console.log("Not Km 3")
		km_login_4()
	}
}

function km_login_4(){
	try{
		var login_div = document.getElementsByClassName('hezuo')[0]
		login_div.innerHTML='<a href="/front/otherLogin.htm?type=qq" target="_blank" class="hz_qq"></a><a class="jiecao hz_qq" href="#">JieCao</a><a class="xiaoxie hz_qq" href="#">XiaoXie</a>'

		var jiecao = document.getElementsByClassName('jiecao')[0]
		jiecao.addEventListener("click",login_jiecao_2)

		var xiaoxie = document.getElementsByClassName('xiaoxie')[0]
		xiaoxie.addEventListener("click",login_xiaoxie_2)
	}
	catch(e){
		console.log("Not Km 4")
	}
}

function login_jiecao(){
	var span_user = document.getElementsByClassName('login_box1')[0]
	span_user = span_user.getElementsByTagName('span')
	span_user[0].style.display = "none"

	var user = document.getElementsByClassName('login_box1')[0]
	user = user.getElementsByTagName('input')
	user[0].value = "jiecao1023"

	var span_pass = document.getElementsByClassName('login_box2')[0]
	span_pass = span_pass.getElementsByTagName('span')
	span_pass[0].style.display = "none"

	var pass = document.getElementsByClassName('login_box2')[0]
	pass = pass.getElementsByTagName('input')
	pass[0].value = "caonima774"
}

function login_xiaoxie(){
	var span_user = document.getElementsByClassName('login_box1')[0]
	span_user = span_user.getElementsByTagName('span')
	span_user[0].style.display = "none"

	var user = document.getElementsByClassName('login_box1')[0]
	user = user.getElementsByTagName('input')
	user[0].value = "byxiaoxie"

	var span_pass = document.getElementsByClassName('login_box2')[0]
	span_pass = span_pass.getElementsByTagName('span')
	span_pass[0].style.display = "none"

	var pass = document.getElementsByClassName('login_box2')[0]
	pass = pass.getElementsByTagName('input')
	pass[0].value = "645993600"
}

function login_jiecao_2(){
	var user = document.getElementById('userName')
	user.value = "jiecao1023"

	var pass = document.getElementById('Password2')
	pass.value = "caonima774"
}

function login_xiaoxie_2(){
	var user = document.getElementById('userName')
	user.value = "byxiaoxie"

	var pass = document.getElementById('Password2')
	pass.value = "qq645993600"
}