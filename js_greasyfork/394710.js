// ==UserScript==
// @name         卡盟注册一键填写 - ByXiaoXie
// @namespace    https://byxiaoxie.com/
// @version      0.1
// @description  卡盟注册自动输入 - ByXiaoXie
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394710/%E5%8D%A1%E7%9B%9F%E6%B3%A8%E5%86%8C%E4%B8%80%E9%94%AE%E5%A1%AB%E5%86%99%20-%20ByXiaoXie.user.js
// @updateURL https://update.greasyfork.org/scripts/394710/%E5%8D%A1%E7%9B%9F%E6%B3%A8%E5%86%8C%E4%B8%80%E9%94%AE%E5%A1%AB%E5%86%99%20-%20ByXiaoXie.meta.js
// ==/UserScript==

window.onload=reg_index()

function reg_index(){
	try{
		var reg_dd = document.getElementsByClassName('th icon_ureg')[0].outerText

		if(reg_dd == "用户注册"){
			var reg_button = document.getElementsByClassName('zhuce')[0]
			var reg_button_div = reg_button.getElementsByTagName('div')

			for(i=0;i<reg_button_div.length;i++){
				if(reg_button_div[i].getAttribute('align') == "center"){
					reg_button_div[i].innerHTML = '<input type="hidden" name="Action" value="Reg"><input type="submit" name="Button1" value="确认注册" class="input_zhuce"><input type="button" value="JieCao" class="jiecao_reg input_zhuce"><input type="button" value="xiaoxie" class="xiaoxie_reg input_zhuce">'
				}
			}

			var jiecao = document.getElementsByClassName('jiecao_reg')[0]
			jiecao.addEventListener("click",reg_jiecao)

			var xiaoxie = document.getElementsByClassName('xiaoxie_reg')[0]
			xiaoxie.addEventListener("click",reg_xiaoxie)
		}
	}
	catch(e){
		console.log("Not Km Reg")
	}
}

function reg_jiecao(){
	var tab_list = document.getElementsByClassName('table1')[0]
	var tab_input = tab_list.getElementsByTagName('input')

	tab_input[0].value = "jiecao1023"
	tab_input[1].value = "caonima774"
	tab_input[2].value = "caonima774"
	tab_input[3].value = "1800000"
	tab_input[4].value = "13800138000"
}

function reg_xiaoxie(){
	var tab_list = document.getElementsByClassName('table1')[0]
	var tab_input = tab_list.getElementsByTagName('input')

	tab_input[0].value = "byxiaoxie"
	tab_input[1].value = "645993600"
	tab_input[2].value = "645993600"
	tab_input[3].value = "1800000"
	tab_input[4].value = "13800138000"
}