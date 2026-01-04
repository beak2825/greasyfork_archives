// ==UserScript==
// @name         白嫖校园网
// @namespace    http://tampermonkey.net/
// @version      9.9.9.9.9
// @description  白嫖齐大校园网
// @author       You
// @match        http://172.20.124.10:8081/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=124.10
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453913/%E7%99%BD%E5%AB%96%E6%A0%A1%E5%9B%AD%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/453913/%E7%99%BD%E5%AB%96%E6%A0%A1%E5%9B%AD%E7%BD%91.meta.js
// ==/UserScript==
(function () {
	window.write = function creatCookie(name, value, days) { 			// 创建写Cookie函数
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 3600 * 1000))
			expires = ";expires=" + date.toGMTString();
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	};

	window.read = function readCookie(name) { 							// 创建读Cookie函数
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	};

	window.start = function () {											// 初始化函数
		if (window.read('xn') == null || window.read('xy') == null || window.read('xh') == null || window.read('hz') == null) {
			window.flash();
		} else {
			window.flash();
		}
	};

	window.Submit = function () {											// 提交表单函数
		window.write('xn', document.getElementById("xn").value, 7);
		window.write('xy', document.getElementById("xy").value, 7);
		window.write('hz', document.getElementById("hz").value, 7);
		window.flash();
		temp = parseInt(window.read('xh'))
		temp = temp + 1
		window.write('xh', temp, 7)											// 刷新账户密码
		document.querySelector('.btn ').onclick();							// 调用提交表单函数
		setTimeout("window.location.reload()", 1080) 						// 刷新延迟时间1080ms
	};
	window.flash = function () {											// 刷新账户密码
		xn = window.read('xn');
		xy = window.read('xy');
		xh = window.read('xh');
		hz = window.read('hz');
		document.getElementById("xn").value = xn;							// 更改xn文本框内容
		document.getElementById("xy").value = xy;							// 更改xy文本框内容
		document.getElementById("xh").value = xh;							// 更改xh文本框内容
		document.getElementById("hz").value = hz;							// 更改hz文本框内容
		var account = 'yd' + xn + xy + window.string(xh, 0) + hz;
		var password;
		document.getElementById("account").value = account;
		window.write('account', account, 7);
		if (window.read('selected') == null) {
			window.write('selected', 0, 7)
		}
		else if (window.read('selected') == 0) {
			password = window.string(account, 1);
			window.write('password', password, 7)
		}
		else if (window.read('selected') == 1) {
			password = 123456
			window.write('password', password, 7)
		}
		else if (window.read('selected') == 2) {
			password = 112233
			window.write('password', password, 7)
		}
		document.getElementById("password").value = password;
	};
	window.document.onkeydown = function hotkey() {							// 定义快捷键函数
		//console.log(window.event.keyCode);								// 控制台打印ASSCII码值
		if (window.event.shiftKey && window.event.keyCode == 81) {
			window.Submit();												// 调用重置函数
		}
		if (window.event.shiftKey && window.event.keyCode == 87) {
			window.RESET();													// 调用重置函数
		}
	};
	window.string = function (str, cla) {									// 字符串处理
		var length = String(str).length;
		if (length == 1 && cla == 0) {
			str = "00" + str
			return str
		}
		if (length == 2 && cla == 0) {
			str = "0" + str
			return str
		}
        if (length == 3 && cla == 0) {
			return str
		}
		if (length == 13) {
			str = str.substring(7, 13);
			return str
		}
		if (length == 14) {
			str = str.substring(8, 14);
			return str
		}
	};
	window.RESET = function () { 											// 重置序号
		window.write('xn', 2019, 7);										// 给xn赋初始值
		window.write('xy', 191, 7);											// 给xy赋初始值
		window.write('xh', 1, 7);											// 给xh赋初始值
		window.write('hz', 0, 7);											// 给hz赋初始值
		window.write('selected', 0, 7)										// 给selected赋值
		document.getElementById("xn").value = window.read('xn');			// 更改xn文本框内容
		document.getElementById("xy").value = window.read('xy');			// 更改xy文本框内容
		document.getElementById("xh").value = window.read('xh');			// 更改xh文本框内容
		document.getElementById("hz").value = window.read('hz');			// 更改hz文本框内容
		document.getElementById("select").selectedIndex = parseInt(window.read('selected'))

		var temp_num = window.string(window.read('xh'), 0);
		var temp = 'yd' + window.read('xn') + window.read('xy') + temp_num + window.read('hz');
		window.write('account', temp, 7);
		document.getElementById("account").value = window.read('account')	// 更改account文本框内容
		alert('重置成功');
	};
	window.save = function () {												// 写入cookie文本框内容
		window.write('xn', document.getElementById("xn").value, 7);
		window.write('xy', document.getElementById("xy").value, 7);
		window.write('xh', document.getElementById("xh").value, 7);
		window.write('hz', document.getElementById("hz").value, 7);
		window.write('selected', document.getElementById("select").selectedIndex, 7);
		window.flash();														// 刷新文本框内容
	};
	var xn; var xy; var xh; var hz; var account; var password; var temp		// 命名全局变量
	if (window.read('xn') == null) {										// 给xn赋初始值
		window.write('xn', 2019, 7);
		xn = window.read('xn')
	}
	else {
		xn = window.read('xn')

	}
	if (window.read('xy') == null) {										// 给xy赋初始值
		window.write('xy', 191, 7);
		xy = window.read('xy')
	}
	else {
		xy = window.read('xy')
	}
	if (window.read('xh') == null) {										// 给xh赋初始值
		window.write('xh', 1, 7);
		xh = window.read('xh')
	}
	else {
		xh = window.read('xh')
	}
	if (window.read('hz') == null) {										// 给hz赋初始值
		window.write('hz', 0, 7);
		hz = window.read('hz')
	}
	else {
		hz = window.read('hz')
	}
	if (window.read('account') == null) {									// 给hz赋初始值
		window.write('account', 'yd' + window.read('xn') + window.read('xy') + window.string(window.read('xh'), 0) + window.read('hz'), 7);
		account = window.read('account')
	}
	else {
		account = window.read('account')
	}

	if (window.read('selected') == null) {									// 给selected赋值
		window.write('selected', 0, 7)
		password = window.string(account, 1);
		window.write('password', password, 7)
	}
	else if (window.read('selected') == 0) {
		password = window.string(account, 1);
		window.write('password', password, 7)
	}
	else if (window.read('selected') == 1) {
		password = 123456
		window.write('password', password, 7)
	}
	else if (window.read('selected') == 2) {
		password = 112233
		window.write('password', password, 7)
	}


	var x = document.createElement("div");									// 创建div并写入html
	x.innerHTML = '<input type="button" onclick="Submit()" value="开嫖" style="display: flex;justify-content: center;align-items: center;width: 180px;height: 50px;color: #ffffff;font-size: 17px;box-shadow: 0px 0px 10px #93c5df;background-image: linear-gradient(80deg, #006dfe,#03a9f4);border-radius: 8px;margin-bottom: 15px;">快捷键Shift+Q<br></br><input type="button" onclick="RESET()" value="重置序号" style="display: flex;justify-content: center;align-items: center;width: 180px;height: 50px;color: #ffffff;font-size: 17px;box-shadow: 0px 0px 10px #93c5df;background-image: linear-gradient(80deg, #006dfe,#03a9f4);border-radius: 8px;margin-bottom: 15px;">快捷键Shift+W<br></br>密码选择:<select id="select" onchange="save()"><option>账号后六位</option><option>123456</option><option>112233</option></select><br></br>学年:<input id="xn" type="Number" value="2019" onchange="save()">学院号:<input id="xy" type="Number"  value="191" onchange="save()"><br></br>序号:<input id="xh" type="Number"  value="1" onchange="save()">后缀:<input id="hz" type="Number"  value="0" onchange="save()">';
	var z = document.getElementsByClassName("form-group")[0];
	z.insertBefore(x, z.childNodes[0]);
	document.getElementById("xn").value = xn
	document.getElementById("xy").value = xy
	document.getElementById("xh").value = xh
	document.getElementById("hz").value = hz
	document.getElementById("account").value = account
	document.getElementById("password").value = password
	document.getElementById("select").selectedIndex = parseInt(window.read('selected'))
	if (window.read('xh') >= 2) {
		window.Submit();
	}
})();
