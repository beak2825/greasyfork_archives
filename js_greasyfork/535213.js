// ==UserScript==
// @name		 qingguo helper
// @description hi
// @namespace	 blog.sylingd.com
// @include		 http://newjw.neusoft.edu.cn/jwweb/*
// @include      https://vpn.neusoft.edu.cn/proxy/*
// @version		 1
// @downloadURL https://update.greasyfork.org/scripts/535213/qingguo%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/535213/qingguo%20helper.meta.js
// ==/UserScript==
(function () {
	var url = window.location.href;
	//VPN兼容
	if (url.includes('vpn.neusoft.edu.cn')) {
		if (!url.includes('newjw.neusoft.edu.cn')) {
			return;
		}
		url = 'http://' + url.substr(url.indexOf('newjw.neusoft.edu.cn'));
	}
	//var username = '';
	//var password = '';
	//辅助选课
	var xkList = [
		'算法',
		'javaScript'
	];
	//登录页面辅助
	function loginHelper() {
		//自动填充
		var userInput = document.getElementById('UID').parentElement.querySelector('input');
		var passwordInput = document.getElementById('PWD').parentElement.querySelector('input');
		var vcInput = document.getElementById('imgCode').parentElement.querySelector('input') || document.getElementById('imgCode').parentElement.parentElement.nextElementSibling.querySelector('input');
		unsafeWindow.showvc(vcInput);
		vcInput.addEventListener('keyup', function () {
			if (this.value.length == 4) {
				unsafeWindow.CkValue();
			}
		});
		setTimeout(function() {
			userInput.value = username;
			unsafeWindow.shtitblur(userInput);
			passwordInput.value = password;
			console.log(passwordInput);
			unsafeWindow.shtitcus(passwordInput.nextElementSibling);
			unsafeWindow.shtitblur(passwordInput);
			unsafeWindow.chkpwd(passwordInput);
			vcInput.focus();
		}, 300);
	}
	//主页面辅助
	function mainHelper() {
		//新增快捷入口
		var box = document.createElement('div');
		box.setAttribute('style', 'display: block; position: fixed; right: 0; bottom: 0; height: 40px; min-width: 100px;');
		document.getElementsByTagName('body') [0].appendChild(box);
		//封装
		function createButton(title, click) {
			var newEl = document.createElement('button');
			newEl.setAttribute('style', 'display: inline-block; height: 40px; min-width: 100px;');
			newEl.innerHTML = title;
			newEl.onclick = click;
			box.appendChild(newEl);
		}
		createButton('进入选课', function () {
			document.getElementById('frmMain').src = '../wsxk/stu_xszx.aspx';
		});
		createButton('查看课表', function () {
			document.getElementById('frmMain').src = '../znpk/Pri_StuSel.aspx';
		});
		createButton('任选列表', function () {
			document.getElementById('frmMain').src = '../znpk/KBFB_RXKBSel.aspx';
		});
		createButton('所有正选', function () {
			window.open('../wsxk/stu_zxjg_rxyl.aspx');
		});
		createButton('查看成绩', function () {
			document.getElementById('frmMain').src = '../xscj/Stu_MyScore.aspx';
		});
	}
	//查看课表的页面中，默认选择格式1
	function selHelper() {
		document.getElementById('rad_gs2').removeAttribute('checked');
		document.getElementById('rad_gs1').setAttribute('checked', 'checked');
		document.getElementById('rad_gs1').value = '0';
		unsafeWindow.ChkVal();
	}
	//选课辅助
	function xkHelper() {
		var xkListReg = new RegExp('(' + xkList.join('|') + ')');
		if (document.querySelectorAll('#pageRpt').length > 0) {
			document.querySelectorAll('tr').forEach(function (el) {
				if (el.children.length < 7) {
					return;
				}
				//移动匹配课程的元素到顶端
				if (xkListReg.test(el.children[1].innerHTML)) {
					var parentTbody = el.parentElement;
					//课程名称匹配
					el.style.backgroundColor = 'rgb(249, 255, 0)'; //高亮
					parentTbody.insertBefore(el, parentTbody.childNodes[1]);
				}
				//将选定事件绑定
				if (el.children[0].querySelector('input[type="checkbox"]') !== null) {
					el.children[0].querySelector('input[type="checkbox"]').addEventListener('click', function (e) {
						if (this.checked) {
							var evObj = document.createEvent('MouseEvents');
							evObj.initEvent('click', true, false);
							el.lastChild.querySelector('a').dispatchEvent(evObj);
						}
						e.stopPropagation();
					});
					el.children[0].addEventListener('click', function () {
						var checkbox = this.querySelector('input[type="checkbox"]');
						if (checkbox.getAttribute('disabled') !== null) {
							return;
						}
						if (checkbox.checked) {
							checkbox.checked = false;
						} else {
							checkbox.checked = true;
							var evObj = document.createEvent('MouseEvents');
							evObj.initEvent('click', true, false);
							el.lastChild.querySelector('a').dispatchEvent(evObj);
						}
					}, false);
				}
			});
		}
	}
	//成绩分布页面，可以自定义一些东西
	function cjfbHelper() {
		var submitButton = document.querySelector('input[type="submit"]');
		var newButton = document.createElement('input');
		newButton.type = 'button';
		newButton.className = 'but40';
		newButton.value = '添加学期';
		newButton.addEventListener('click', function() {
			for (var i = 0; i <= 2; i++) {
				if (document.querySelector('#sel_xq option[value="' + i + '"]') === null) {
					var newOption = document.createElement('option');
					newOption.value = i;
					newOption.innerHTML = '第' + (i + 1) + '学期';
					document.getElementById('sel_xq').appendChild(newOption);
				}
			}
		}, false);
		submitButton.parentElement.insertBefore(newButton, submitButton);
	}
	if (url.includes('_data/login_home.aspx') || url.includes('_data/index_login.aspx')) {
		loginHelper();
	} else if (document.getElementById('frmMain') !== null) {
		mainHelper();
	} else if (url.includes('wsxk/stu_xszx_rpt.aspx')) {
		xkHelper();
	} else if (url.includes('znpk/Pri_StuSel.aspx')) {
		selHelper();
	} else if (url.includes('xscj/Stu_cjfb.aspx')) {
		cjfbHelper();
	}
})();
