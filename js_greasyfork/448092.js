// ==UserScript==
// @name         weizhuan
// @namespace    weizhuan
// @version      1.0.1
// @description   微赚
// @author       realyuxia
// @match        http://123999.toupiao678.com/doworks.aspx
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448092/weizhuan.user.js
// @updateURL https://update.greasyfork.org/scripts/448092/weizhuan.meta.js
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
		var qrr = document.querySelector('#qrcode');
		if (qrr) {
			qrr.parentElement.removeChild(qrcode);
		}

		var container = document.querySelector('#txturl').parentElement;
		var url_node  = document.querySelector('#txturl');

		var parent = container;
		var next = parent.lastChildElement;

		var div = document.createElement('div');

		div.setAttribute("id", "qrcode");
		parent.insertBefore(div, next);

		var qrcode = new QRCode("qrcode", {
    		text: url_node.getAttribute('value'),
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
		
		var container = document.querySelector('#txturl').parentElement;
		var url_node  = document.querySelector('#txturl')

		var  s = url_node;
		var div = document.createElement('div');
		var a = document.createElement('a');

		div.setAttribute("id", "aaa");
		a.textContent = 'open';
		a.setAttribute('href', s.getAttribute('value'));

		div.appendChild(a);
		container.appendChild(div);

		a.click();
		container.removeChild(div);
	}

})();