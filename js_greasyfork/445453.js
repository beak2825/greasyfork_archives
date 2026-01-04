
// ==UserScript==
// @name         bashi
// @namespace    bashi
// @version      1.1.1
// @description   快乐巴士辅助
// @author       realyuxia
// @match        https://k.kuaile84.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445453/bashi.user.js
// @updateURL https://update.greasyfork.org/scripts/445453/bashi.meta.js
// ==/UserScript==
(function (){
	//var qrcode ="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
        var qrcode = "https://cdn.bootcdn.net/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
	importjs(qrcode);
	addfloatbutton();
	function importjs(url){
		var script = document.createElement("script");
		script.type = "text\/javascript";
		script.src = url;
		document.head.appendChild(script);
	}
	function addfloatbutton(){
		var jump=document.createElement("div");
		var qr  =document.createElement("div");

		

		jump.style.cssText="border:2px solid red;position:fixed;top:70%;left:80%;width:40px;height:40px;background-color:yellow;z-index:999999;text-align:center;line-height:40px;color:red;box-shadow: 3px 3px 5px #888888;";
		qr.style.cssText="border:2px solid red;position:fixed;top:80%;left:80%;width:40px;height:40px;background-color:yellow;z-index:999999;text-align:center;line-height:40px;color:red;box-shadow: 3px 3px 5px #888888;";

		jump.textContent="跳转";
		jump.addEventListener("click",function(e){
			addOpen(); 
			e.stopPropagation();
		});

		qr.textContent = "QR";
		qr.addEventListener("click", function(e){
			showQrcode();
			e.stopPropagation();
		});
		document.body.appendChild(jump);
		document.body.appendChild(qr);
	}

	function showQrcode(){
		var qrcode = document.querySelector('#qrcode');
		if (qrcode) {
			qrcode.parentElement.removeChild(qrcode);
		}

		var container = document.querySelector('.uni-list');
		var url_node  = document.querySelector('.uni-list-item__content-title').firstElementChild;

		var parent = container.parentElement;
		var next = container.nextElementSibling;

		var div = document.createElement('div');

		div.setAttribute("id", "qrcode");
		parent.insertBefore(div, next);

		var qrcode = new QRCode("qrcode", {
    		text: url_node.textContent,
    		width: 200,
    		height: 200,
    		colorDark : "#000000",
    		colorLight : "#ffffff",
    		correctLevel : QRCode.CorrectLevel.H
		});
	}

	function addOpen(){
		var aaaNode = document.querySelector('#aaa');
		if (aaaNode) {
			aaaNode.parentElement.removeChild(aaaNode);
		}
		
		var container = document.querySelector('.uni-list-item__container');
		var url_node  = document.querySelector('.uni-list-item__content-title').firstElementChild;

		var  s = url_node;
		var div = document.createElement('div');
		var a = document.createElement('a');

		div.setAttribute("id", "aaa");
		a.textContent = 'open';
		a.setAttribute('href', s.textContent);

		div.appendChild(a);
		container.appendChild(div);

		a.click();
		container.removeChild(div);
	}

})();