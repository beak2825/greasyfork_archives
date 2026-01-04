// ==UserScript==
// @name         content-script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  账号登录
// @author       hzane
// @grant        none
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function()//当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载
{
    
	var ZHtemp='';
	var MMtemp='';
	var jsonData;
	var len;
	
	
	function drzh() {
		jsonData = JSON.parse(GM_getValue('zhPass'));//JSON.parse() 方法用于将一个 JSON 字符串转换为对象
		len = jsonData.length;
		console.log(jsonData);
		var localUrl = window.location.href;
		if(localUrl == "https://www.2-class.com/"){
			function writeZH(){
				document.getElementById('account').setAttribute('value',ZHtemp);
				document.getElementById('account').value=ZHtemp;
				console.log(ZHtemp);
				
			}
			function writeMM(){
				console.log(MMtemp);
				document.getElementById('password').setAttribute('value',MMtemp);
				document.getElementById('password').value=MMtemp;	
			}
			for(var i=0; i<len;i++){
				
				if(!jsonData[i]['成绩'] || jsonData[i]['成绩'] == ' '){
					ZHtemp = jsonData[i]['账号'];
					//console.log("账号"+jsonData[i]['账号']);
					MMtemp = jsonData[i]['密码'];
					
					break;
					
				}
			}
			if(i== len){
				alert("所有学生已完成知识竞赛，请登录班主任或管理员账号查看！")
			}
			document.onclick = function(){
				if(event.srcElement.getAttribute('id') == 'account'){
					writeZH();
					
				}
				else if(event.srcElement.getAttribute('id') == 'password'){
					writeMM();
					
				}else if(event.srcElement.getAttribute('type') == 'submit'){
					for(var i=0; i<len;i++){
						if(jsonData[i]['账号'] == ZHtemp){
							jsonData[i]['成绩'] = '100';
							GM_setValue('zhPass', JSON.stringify(jsonData));
						
							
						}
					}
					
				}
				
			}
		}
		
		
	};
	
	
});
