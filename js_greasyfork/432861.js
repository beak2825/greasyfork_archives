// ==UserScript==
// @name         得实e学签到打卡自动化
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  得实e学签到打卡自动化，搭配第三方插件识别验证码，实现掉线自动登录。解放脑子，脚本持续更新  欢迎访问程序员阿鑫博客 http://www.cxyax.com
// @author       程序员阿鑫
// @match        http://123.132.239.130:8888/suite/person/personView.do?feature=person&action=practiceing&practiceKey=*
// @match        http://123.132.239.130:8888/suite/login.*
// @match        http://123.132.239.130:8888/suite/person/personView.*
// @match        http://123.132.239.130:8888/suite/portal/portalView.do?siteKey=0
// @require      https://cdn.bootcss.com/jquery/3.6.0/jquery.min.js
// @icon         https://z3.ax1x.com/2021/09/21/4JLL7R.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432861/%E5%BE%97%E5%AE%9Ee%E5%AD%A6%E7%AD%BE%E5%88%B0%E6%89%93%E5%8D%A1%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/432861/%E5%BE%97%E5%AE%9Ee%E5%AD%A6%E7%AD%BE%E5%88%B0%E6%89%93%E5%8D%A1%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function() {
	//存入你的账号密码，帮你填
	var uname = "";
	var upwd = ""

	//如果当前页面在“实习”界面，需要登录进去把网址粘过来
	if((window.location.href) == "你的实习地址"){
		//获取当前时间
		var time = new Date();
		//如果当前时间在这个区间，就上班
		if(time.getHours() >= 6 && time.getHours() <= 10){
			signInData('上班','true');
			//如果执行成功，就休眠2小时，2小时之后重新请求
			sleep_reload("h",3);
		//如果时间在这个区间，就下班
		}else if(time.getHours() >= 18 && time.getHours() <= 21){
			signInData('下班','true');
			//如果执行成功，就休眠2小时，2小时之后重新请求
			sleep_reload("h",3);
		}else{
			//如果还没到时间，就1小时刷新一次
			sleep_reload("h",1);
		}
	}
	//如果当前页面在登录界面
	if((window.location.href)=="http://123.132.239.130:8888/suite/login.do" || (window.location.href)=="http://123.132.239.130:8888/suite/login.do?"){
		//60秒执行一次，等待验证码识别
		var looper = setInterval(function(){
			//获取输入框中内容
			var username = $("#loginName").val();
			var password = $("#password").val();
			//判断不为空
			if((username != null && username != "") && (password != null && password != "")){
				//获取验证码框中内容
				var checkCode = $("#checkCode").val();
				//验证码框不为空
				if(checkCode!=null&&checkCode!="" && checkCode.length>=4){
					console.log("正在提交登录");
					//不为空就提交登录
					setTimeout($(".sbMit").click(),sleep_reload('s',20));
					//登录之后清除循环
					clearInterval(looper);
				}else{
					//如果为空就刷新一遍验证码
					// refreshCode();
				}
			}else{
				// 为空就填入
				console.log("填入值执行成功");
				$("#loginName").val(uname)
				$("#password").val(upwd);
			}
		},sleep_reload("m",1));
	}

	//登录进来后跳转实习界面
	if((window.location.href)=="http://123.132.239.130:8888/suite/person/personView.do"){
		setInterval(function(){
			window.location.href = "http://123.132.239.130:8888/suite/person/personView.do?menuKey=myPractice"
		},sleep_reload("m",1));
	}
	
	//手动退出登录会到一个界面，让他自动跳转到登录界面
	if((window.location.href)=="http://123.132.239.130:8888/suite/portal/portalView.do?siteKey=0"){
		window.location.href = "http://123.132.239.130:8888/suite/person/personView.do"
	}
	
	
	/**
	 * @param {String} sort 类型（h小时、m分钟、s秒）
	 * @param {int} stime 十进制时间（比如一秒传入的时候就写 1 不用写 1000）
	 */
	function sleep_reload(sort,stime){
		if(sort == 'h'){
			stime *= 60 * 60 * 1000;
		}else if(sort == 'm'){
			stime *= 60 * 1000;
		}else if(sort == 's'){
			stime *= 1000;
		}
		setTimeout(function(){
			window.location.reload()
		},stime);
	}
})();