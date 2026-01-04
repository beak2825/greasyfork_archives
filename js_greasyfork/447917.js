// ==UserScript==
// @name         京东免密cookie登录获取CK插件1.2
// @version      1.0.2
// @namespace     yutou
// @description  免账户密码登录获取CK插件，功能在右下角登录按钮以及提CK按钮，没什么功能，方便登录而已,请勿滥用，如侵犯贵司权益我便停用，有问题想要学习更多功能加群：700048544
// @author       by 鱼头
// @match        *://*.jd.com/*
// @match        *://*.baidu.com/*
// @match        *://*.jingxi.com/*
// @match        *://*.infinityfreeapp.com/*
// @downloadURL https://update.greasyfork.org/scripts/447917/%E4%BA%AC%E4%B8%9C%E5%85%8D%E5%AF%86cookie%E7%99%BB%E5%BD%95%E8%8E%B7%E5%8F%96CK%E6%8F%92%E4%BB%B612.user.js
// @updateURL https://update.greasyfork.org/scripts/447917/%E4%BA%AC%E4%B8%9C%E5%85%8D%E5%AF%86cookie%E7%99%BB%E5%BD%95%E8%8E%B7%E5%8F%96CK%E6%8F%92%E4%BB%B612.meta.js
// ==/UserScript==
(function() {
	if (location.href.match("jd.com")) {
		let msg = document.createElement('div');
		msg.id = "msg";
		msg.setAttribute("style", "position: fixed;left: 50%;top: 50%; transform: translate(-50%, -50%);background: rgba(45, 45, 45, 0.8);width:auto;height: auto;z-index: 9999999;text-align: center;line-height: auto;border-radius: 5%;font-size: 18px;font-family: 'STCaiyun';color: #fff;animation: mymsg 1s;display: none;");
		document.body.appendChild(msg);



   window.onload = function(){
		let login = document.createElement('div');
		login.innerHTML = '<button  style="line-height: 5vh;text-align: center;height: 5vh;width: 5vh;font-size: 14px;color: white;position: relative;overflow: hidden;border:1px solid #1e7db9;box-shadow: 0 1px 2px #8fcaee inset,0 -1px 0 #497897 inset,0 -2px 3px #8fcaee inset;background: -webkit-linear-gradient(top,#42a4e0,#2e88c0);border-radius: 100%;" >登</button>';
		login.id = "login";
		document.body.appendChild(login);
		login.setAttribute("style", "position:fixed;bottom:10vh;z-index:9999999999;height:5vh;width:5vh;right:10vh;cursor:pointer;float:right;z-index:10000000;border-radius: 100%;");
		login.onclick = function() {
           var sidenava= document.getElementById("sidenava")
            if (sidenava == "none") {
                                 document.getElementById("sidenava").style.width = "50%";;
                                sidenava = "block";


                            } else {
    
                                document.getElementById("sidenava").style.width = "0px";

                            }
		var cktext = prompt("请输入ck", "");
			var ck = cktext.split("pt_key=");
			var cka = ck[1].split("&");
			var ck1 = cktext.split("pt_pin=");
			var cks = ck1[1].split("&");
			var time = "Thu,31 Dec 2099 12:00:00 UTC";
			var b = document.domain.split('.')
				.slice(-2)
				.join('.');
			var c = "." + b;
			document.cookie = "pt_key=" + cka + ";expires=" + time + ";path=/;domain=" + c;
			document.cookie = "pt_pin=" + cks + ";expires=" + time + ";path=/;domain=" + c;
			msg.innerHTML = '登录中···';
			msg.style.display = 'block';
			setTimeout(() => {
				window.open("https://u.jd.com/fCqyl9s", "_self");
			}, 1500);
			setTimeout(() => {
				msg.style.display = 'none';
			}, 1800);
		};

		if (location.href.match("pro.m.jd.com")) {
			msg.innerHTML = '登录成功';
			msg.style.display = 'block';
		};

		function getCookie(pt_key) {
			var name = pt_key + "=";
			var ckget = name + "";
			var cookieStr = document.cookie;
			var ca = cookieStr.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					ckget = ckget + c.substring(name.length, c.length);
				}
			}
			ckget = ckget + ";";
			return ckget;
		}
		var ck = document.createElement("div");
		ck.id = "ck";
		ck.innerHTML = '<button style="line-height: 5vh;text-align: center;height: 5vh;width: 5vh;font-size: 14px;color: white;position: relative;overflow: hidden;	border: 1px solid #c33838;box-shadow: 0 1px 2px #ee8f8f inset, 0 -1px 0 #c73434 inset, 0 -2px 3px #ee8f8f inset;background: -webkit-linear-gradient(top,#e04242,#c02e2e);border-radius: 100%;">提</button>';
		ck.setAttribute("style", 'position:fixed;bottom:10vh;z-index:9999999999;height:5vh;width:5vh;right:5vh;cursor:pointer;float:right;border-radius:100%;');
		ck.onclick = function() {
			var cktxt = "";
			cktxt = cktxt + getCookie("pt_key");
			cktxt = cktxt + getCookie("pt_pin");
			var input = document.createElement("input");
			input.setAttribute("value", cktxt);
			document.body.appendChild(input);
			input.select();
			document.execCommand("copy");
			document.body.removeChild(input);
			if (cktxt) {
				msg.innerHTML = '提取成功!!!自行检查';
				msg.style.display = 'block'
			} else {
				msg.innerHTML = '(未登录)提取失败!';
				msg.style.display = 'block'
			}
			setTimeout(() => {
				msg.style.display = 'none'
			}, 1800)
		};
		document.body.appendChild(ck)
  
       		var cka = document.createElement("div");
		cka.id = "cka";
		cka.innerHTML = '<button style="line-height: 5vh;text-align: center;height: 5vh;width: 5vh;font-size: 14px;color: white;position: relative;overflow: hidden;	border: 1px solid #c33838;box-shadow: 0 1px 2px #ee8f8f inset, 0 -1px 0 #c73434 inset, 0 -2px 3px #ee8f8f inset;background: -webkit-linear-gradient(top,#e04242,#c02e2e);border-radius: 100%;">提全CK</button>';
		cka.setAttribute("style", 'position:fixed;bottom:10vh;z-index:9999999999;height:10vh;width:5vh;right:5vh;cursor:pointer;float:right;border-radius:100%;');
		cka.onclick = function() {
			var cktxt =document.cookie;
			var input = document.createElement("input");
			input.setAttribute("value", cktxt);
			document.body.appendChild(input);
			input.select();
			document.execCommand("copy");
			document.body.removeChild(input);
			if (cktxt) {
				msg.innerHTML = '提取成功!!!自行检查';
				msg.style.display = 'block'
			} else {
				msg.innerHTML = '(未登录)提取失败!';
				msg.style.display = 'block'
			}
			setTimeout(() => {
				msg.style.display = 'none'
			}, 1800)
		};
		document.body.appendChild(cka)
	}
    }
})();