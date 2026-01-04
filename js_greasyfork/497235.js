// ==UserScript==
// @name         klb 
// @namespace    klb.web
// @version      1.10
// @description  提升效率
// @author       realyuxia
// @license MIT
// @match        https://web2.gzlhzc.cn/index.php
// @match https://web3.gzlhzc.cn/index.php
// @downloadURL https://update.greasyfork.org/scripts/497235/klb.user.js
// @updateURL https://update.greasyfork.org/scripts/497235/klb.meta.js
// ==/UserScript==
(function () {
	var qrcode ="https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/qrcodejs/1.0.0/qrcode.min.js";
	var excludeList = ["描述|缺一不可|样图|一律封号|会一一核对头像审核通过|然后根据提示|点击菜单弹出内容|不准取消关注|切记|名称|必须有最新的回复和最新的菜单点击|请至少保留一个月不要取关感谢大家|再点击全部菜单栏一下|三天内不能马上取关|检测马上取关的一律不通过|关注后按照图中要求点击两个菜单并打开网址|看不到的点击中间更多就显示出来了|一定不要点错了|跪求一礼拜不取关|谢谢|并且截图时间与上传时间吻合|否则会被封号|加人加好友任务截图必须带已发送字样|跪求三天不取关|感谢大家|保留一个星期|不要取消关注|否则将不予通过|然后点击|再点击|否则将不予通过|一定要搜一搜直接搜索|跪求保持1礼拜不取关"];
	var keywordsList = ["搜|关注|回复|关注过|关键字|公众号|发送"];


	importjs(qrcode)
	addfloatbutton()


	/*import*/
	function importjs(url) {
		var script = document.createElement("script");
		script.type = "text\/javascript";
		script.src = url;
		document.head.appendChild(script);
	}

	/*floaty*/

	function addfloatbutton() {
		var jump = document.createElement("div");
		var qr = document.createElement("div");
		var tiaozhuan = document.createElement("div");

		jump.style.cssText = "border:2px solid red;position:fixed;top:60%;left:80%;width:40px;height:40px;background-color:yellow;z-index:999999;text-align:center;line-height:40px;color:red;box-shadow: 3px 3px 5px #888888;";
		qr.style.cssText = "border:2px solid red;position:fixed;top:70%;left:80%;width:40px;height:40px;background-color:yellow;z-index:999999;text-align:center;line-height:40px;color:red;box-shadow: 3px 3px 5px #888888;";
		tiaozhuan.style.cssText = "border:2px solid red;position:fixed;top:80%;left:80%;width:40px;height:40px;background-color:yellow;z-index:999999;text-align:center;line-height:40px;color:red;box-shadow: 3px 3px 5px #888888;";

		jump.textContent = "变换";
		jump.addEventListener("click", function (e) {
			var t = document.querySelector('#target');
			var n = document.querySelector('.gmiaoshu');

			if (t) {
				t.parentElement.removeChild(t)
				n.style.display = "block";
				jump.textContent = '变换';
			} else {
				var textnodes = getformattednodes(n)
				n.style.display="none";
				n.parentElement.appendChild(textnodes);
				jump.textContent = '还原';
			}
			
			e.stopPropagation();
		});

		qr.textContent = "QR";
		qr.addEventListener("click", function (e) {
			showQrcode();
			e.stopPropagation();
		});
		

		tiaozhuan.textContent = '跳转';
		tiaozhuan.addEventListener('click', function(e){
			var aaaNode = document.querySelector('#aaa');
			if (aaaNode) {
				aaaNode.parentElement.removeChild(aaaNode);
			}

			var url_node  = document.querySelector('.getright > .gmoney > textarea');

			var div = document.createElement('div');
			var a = document.createElement('a');

			div.setAttribute("id", "aaa");
			a.setAttribute('href', getUrl(url_node.value));

			div.appendChild(a);
			url_node.parentElement.appendChild(div);

			a.click();
			url_node.parentElement.removeChild(div);
			e.stopPropagation();
		});

		document.body.appendChild(jump);
		document.body.appendChild(qr);
		document.body.appendChild(tiaozhuan);
	}

	/**qrcode */
	function showQrcode() {
		var qrcode = document.querySelector('#qrcode');
		if (qrcode) {
			qrcode.parentElement.removeChild(qrcode);
		}

		var url_node = document.querySelector('.getright > .gmoney > textarea');

		if (!url_node) return;


		var parent = url_node.parentElement;

		var div = document.createElement('div');

		div.setAttribute("id", "qrcode");
		parent.appendChild(div);

		var qrcode = new QRCode("qrcode", {
			text: getUrl(url_node.value),
			render: "png",
			width: 200,
			height: 200,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: 3
		});
	}
	/*filers*/
	function gettype(w, excludeList, keywordList) {
		var type = 0;

		keywordList.forEach(function (k) {
			var r = new RegExp(k);
			if (r.test(w)) {
				type = 1;
			}
		});
		excludeList.forEach(function (e) {
			var r = new RegExp(e);
			if (r.test(w)) {
				type = 2;
			}
		});
		return type;
	}


	/*返回打散节点*/
	function getformattednodes(node) {
		var colors = ["#122656", "#73500c", "#FF6666", "#FF33CC", "#CCCC99", "#663366", "#CCCCFF", "#FFFFCC", "#CCFFFF", "#99CC33", "#FF9900", "#FFCC00"];
		var nodeText = node.textContent;
		var parentNode = node.parentNode;
		var newSpan_node = document.createElement('span');
		var div_node = document.createElement('div');
		var ws = [];

		/*动画*/
		var head = document.head;
		var style = document.createElement('style');
		var shiftA = "@keyframes shiftN{0%{-webkit-transform:scale(0.5);}50%{-webkit-transform:scale(1.2);}100%{-webkit-transform:scale(1.0);}}";

		style.innerText = shiftA;
		style.type = 'text/css';
		head.appendChild(style);

		div_node.setAttribute('id', 'target');
		div_node.style.cssText = "display:block;margin:20px";
		ws = sentenceSplitToWords(nodeText);

		ws.forEach((w) => {
			var index = Math.floor(Math.random() * 12);
			var n = newSpan_node.cloneNode(false);
			n.style.cssText = "font-size: large;display:inline-block;border: 2px dotted #F4A460; margin:10px;";
			/* type 1 target; type 2 exclude ; type 0 normal*/

			switch (gettype(w, excludeList, keywordsList)) {
				case 0:
				n.style.textShadow = "1px 1px 3px" + colors[index];
				break;
				case 1:
				n.style.backgroundColor = 'DeepPink';
				break;
				case 2:
				n.style.display = "none";
				n.style.visibility = "hidden";
				break;
				default:
			}

			n.textContent = w;
			n.addEventListener("click", function (e) {
				e.target.style.webkitAnimation = "shiftN 800ms ease-in-out ";
				e.target.addEventListener("animationend", function (e) {
					e.target.style.webkitAnimation = "";
				});
				copyText(e.target.textContent);
				e.stopPropagation();
			});
			div_node.appendChild(n);
		});
		return div_node;
	}

	function sentenceSplitToWords(sentence) {
		var s = sentence;
		var reg = /[a-zA-Z0-9\u4e00-\u9fa5]+/g;
		var ws = [];

		var match = reg.exec(s);
		while (match) {
			ws.push(match[0]);
			match = reg.exec(s);
		}
		return ws;
	}

	

	/* util */
	
function getUrl(str){
	   var trimed = str.trim(str)
	   var reg = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
	   var urls = trimed.match(reg)
	   
	   var url = ''
	   urls.forEach(u=>{
			if (u.indexOf('@')===-1) url = u
	   })
	   
	   if (url.indexOf("http") === -1) {
			/*统一添加协议头 http，无协议头生成的二维码无法直接打开*/
			url = "http://" + url
	   }
	   
	   return url
    }

	function clipText(source) {
		var m = document.createElement('input');
		var body = document.querySelector('body');

		body.appendChild(m);
		m.value = source;
		m.select();
		document.execCommand('copy');
		body.removeChild(m);

		showToast('复制成功', 1500);
	}

	function showToast(msg, duration) {
		duration = isNaN(duration) ? 3000 : duration;
		var m = document.createElement('div');
		m.innerHTML = msg.toString();
		m.style.cssText = "width:60%; min-width:180px; background:#000;opacity:0.6; height:auto;min-height: 30px;color:#fff; line-height:30px; text-align:center; border-radius:4px; position:fixed; top:5%; left:20%;z-index:999999;";
		document.body.appendChild(m);
		setTimeout(function () {
			var d = 0.5;
			m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
			m.style.opacity = '0';
			setTimeout(function () { document.body.removeChild(m) }, d * 1000);
		}, duration);
	}

})();

