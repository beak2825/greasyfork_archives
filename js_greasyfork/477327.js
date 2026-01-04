// ==UserScript==
// @name         复制简历详情
// @version      0.8
// @namespace    http://tampermonkey.net/
// @description   复制简历详情 ，智联 猎聘 BOOS 前程无忧
// @author       qinhh
// @match        https://lpt.liepin.com/cvview/showresumedetail*
// @match        https://rd6.zhaopin.com/*
// @match        https://ehire.51job.com/Revision/talent/resume/*
// @match        https://www.zhipin.com/web/chat/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @include      http://10.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477327/%E5%A4%8D%E5%88%B6%E7%AE%80%E5%8E%86%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/477327/%E5%A4%8D%E5%88%B6%E7%AE%80%E5%8E%86%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==
(function() {
	'use strict';
	window.onload = function() {
		var currentHost = window.location.host;
		if (currentHost === 'lpt.liepin.com') {
			setTimeout(liepin, 1000); //猎聘
		}
		if (currentHost == 'rd6.zhaopin.com') {
			setTimeout(zhilian, 6000); //智联
		}
		if (currentHost == 'ehire.51job.com') {
			setTimeout(qcwy, 1000); //前程无忧
		}
		console.log(currentHost)

		if (currentHost == 'www.zhipin.com') {
			setTimeout(boss, 3000); //BOSS
		}
	};

	function boss() {
		var div1 = document.createElement("div");
		div1.style.zIndex = "9999";
		div1.style.left = "83%";
		div1.style.top = "26%";
		div1.style.position = "absolute";
		div1.innerHTML = '<div id="open" ><div id="textdiv"></div><button type="button"   style="transform: scale(0.9);top:100px;display: flex;flex-direction: column; position: fixed;right: 90px; z-index: 9999;width:140px;height: 28px; background-color:#00a6c1;border-color:red;border-radius: 5px;font-size:20px;color: #ffff;">复制简历文本♣</button></div>';
		document.body.appendChild(div1);
		div1.addEventListener("mousedown", function(e) {
			var iframe = document.getElementsByClassName("dialog-wrap active")[0];
			if (iframe) {
				var contenttext = iframe.innerText;
				if (contenttext) {
					contenttext = contenttext.replace(/^\s*\n/gm, "");
					var ipos = contenttext.indexOf("牛人沟通进度");
					contenttext = contenttext.substring(0, ipos);
					var aux = document.createElement("input");
					$("#textdiv")
						.empty();
					$("#textdiv")
						.append("<textarea  id='context' style='transform: scale(0);width:1px;height: 1px;' >" + contenttext + "</textarea>");
					const inputElement = document.querySelector('#context');
					inputElement.select();
					document.execCommand('copy');
					bendialert();
				}
			}
		});
	}

	function qcwy() {
		var parentDOM = document.getElementsByClassName('left_item resume_main_wrap');
		var div1 = document.createElement("div");
		var div2 = document.createElement("div");
		div1.style.zIndex = "99";
		div1.style.left = "83%";
		div1.style.top = "16%";
		div1.style.position = "absolute";
		div1.innerHTML = '<div id="open" ><button type="button"   style="transform: scale(0.9);top: 300px;display: flex;flex-direction: column; position: fixed;right: 90px; z-index: 999;width:140px;height: 28px; background-color:#00a6c1;border-color:red;border-radius: 5px;font-size:18px;color: #ffff;">复制简历文本♣</button></div>';
		document.body.appendChild(div1);
		div1.addEventListener("mousedown", function(e) {
			var contenttext = document.querySelector('.resume_main_wrap')
				.innerText.replace('在线人才信息', '')
				.replace('微信扫码分享', '')
				.replace('附件人才信息', '')
				.replace('给Ta打电话', '')
				.replace('添加', '')
				.replace('英文版', '')
				.replace('自定义标签：', '')
				.replace('举报', "")
				.replace(/曼德电子电器有限公司          /g, "");
			contenttext = contenttext.replace(/^\s*\n/gm, "");
			var aux = document.createElement("input");

			$("#open")
				.append("<textarea  id='context' style='transform: scale(0);width:1px;height: 1px;' >" + contenttext + "</textarea>");
			const inputElement = document.querySelector('#context');
			inputElement.select();
			document.execCommand('copy');
			bendialert();
		});
	}

	function zhilian() {
		var parentDOM = document.getElementsByClassName('km-modal__header');
		var div1 = document.createElement("div");
		div1.style.right = "10px";
		div1.style.top = "16%";
		div1.style.zIndex = "1962";
		div1.style.position = "fixed";
		div1.style.position = "absolute";
		div1.innerHTML = '<div id="open" ><button type="button"   style="transform: scale(0.9);top: 300px;display: flex;flex-direction: column; position: fixed;right: 90px; z-index: 999;width:140px;height: 28px; background-color:#00a6c1;border-color:red;border-radius: 5px;font-size:18px;color: #ffff;">复制简历文本♣</button></div>';
		document.body.appendChild(div1);
		div1.addEventListener("mousedown", function(e) {
			var contentdiv = document.querySelector('.resume-detail');
			if (contentdiv) {
				var contenttext = contentdiv.innerText.replace('查看大图', '')
					.replace('今天活跃', '')
					.replace('**', '先生');
				var aux = document.createElement("input");
				$("#open")
					.append("<textarea  id='context' style='transform: scale(0);width:1px;height: 1px;' >" + contenttext + "</textarea>");
				const inputElement = document.querySelector('#context');
				inputElement.select();
				document.execCommand('copy');
				bendialert();
			}
		});
	}

	function liepin() {
		var parentDOM = document.getElementsByClassName('u-divider');
		var div1 = document.createElement("div");
		var div2 = document.createElement("div");
		div1.style.zIndex = "99";
		div1.style.left = "83%";
		div1.style.top = "16%";
		div1.style.position = "absolute";
		div1.innerHTML = '<div id="open" ><button type="button"   style="transform: scale(0.9);width:110px;height: 29px; background-color:#00a6c1;border-color:red;border-radius: 5px;font-size:12px;color: #ffff;"  >复制简历文本♣</button></div>';
		document.body.appendChild(div1);
		div1.addEventListener("mousedown", function(e) {
			var contenttext = document.querySelector('.c-content')
				.innerText.replace('查看大图', '')
				.replace('今天活跃', '')
				.replace('**', '先生');
			var aux = document.createElement("input");
			$("#open")
				.append("<textarea  id='context' style='transform: scale(0);width:1px;height: 1px;' >" + contenttext + "</textarea>");
			const inputElement = document.querySelector('#context');
			inputElement.select();
			document.execCommand('copy');
			bendialert();

		});
	}

	function bendialert() {
		alert("已复制到剪切板!");
	}


	function adduserbyliepin() {
		var dto = new FormData();
		dto.append("namec", "亲哈辉");
		dto.append("sex", "亲哈辉");
		dto.append("telephone", '18');
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://10.6.5.68:8822/mind/personnel/adduserbyliepin',
			data: dto,
			onload: function(r) {
				let resultJson = JSON.parse(r.response);
				console.log(resultJson)
			}
		});
	}
     function loadJS(url, callback) {
        var script = document.createElement('script'),
            fn = callback || function() {};
        script.type = 'text/javascript';
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn()
                }
            }
        } else {
            script.onload = function() {
                fn()
            }
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script)
    }
    loadJS('http://10.44.142.73:8080/api/application/embed?protocol=http&host=10.44.142.73:8080&token=acdb03f9123b1b86', function() {})


})();