// ==UserScript==
// @name        快捷便笺
// @namespace   kjnote Scripts
// @author      Takitooru
// @match       *://*/*
// @grant       none
// @version     1.1
// @description 快捷便笺，快速记录所需信息
// @license     GPL License
// @downloadURL https://update.greasyfork.org/scripts/454303/%E5%BF%AB%E6%8D%B7%E4%BE%BF%E7%AC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/454303/%E5%BF%AB%E6%8D%B7%E4%BE%BF%E7%AC%BA.meta.js
// ==/UserScript==
(function() {
	window.onload = function() {
		var Addjstyle = document.createElement('style');
		Addjstyle.type = 'text/css';
		Addjstyle.innerHTML = '#knote{width:20px;border:1px solid #70ae2d;position:fixed;top:2px;right:0px;z-index:999;background-color:#8bc34a;color:#fff;border-radius:3px;}';
		Addjstyle.innerHTML += '.kjbtn{display: inline-block;text-align: center;cursor:pointer;}';
		Addjstyle.innerHTML += '.boxhide{display: none;position:fixed;z-index:998;padding:3px;border-radius:3px;}';
		Addjstyle.innerHTML += '.jstoolbar{color:#000;display:block;border-bottom:1px solid #ddd;background-color:#eeeeee;padding:10px 0 10px 0;}';
		Addjstyle.innerHTML += '.slider{display:inline-block;font-size:13px}.sliderinput{vertical-align:middle;}';
		Addjstyle.innerHTML += '.sclose{margin-right: 10px;font-size: 14px;text-align: center;font-weight:bold;color:black;width:20px;float:left;cursor:pointer;}';
		Addjstyle.innerHTML += '.savetxt{width:80px;float:right;background-color:#8bc34a;border-radius:3px;color:#fff;padding:2px;font-size: 14px;text-align: center;cursor:pointer;}';
		Addjstyle.innerHTML += '.stextarea{background-color: #eeeeee;margin: 0;padding: 5px 0 0 0;height: 200px;width: 350px;color: #000;font-size: 15px;resize: vertical;outline:none;border: none;scrollbar-width: thin;}.stextarea:focus{border: none;box-shadow: none;}';
        Addjstyle.innerHTML += `.stextarea::-webkit-scrollbar {
			width: 5px;
			height: 5px;
		}.stextarea::-webkit-scrollbar-thumb {
			border-radius: 3px;-webkit-border-radius: 3px;
			background-color: #8bc34a;
		}.stextarea::-webkit-scrollbar-track {
			background-color: transparent;
		}`;
		document.getElementsByTagName('head').item(0).appendChild(Addjstyle);

		var Newdiv = document.createElement("div");
		Newdiv.id = "knote";
		Newdiv.innerHTML = '<span class="kjbtn">快捷便笺</span>';
		var jsslider = '<div class="slider">透明度:<input class="sliderinput" type="range" min="30" max="100" step="1" value="100"></div>';
		var jsavetxt = '<div class="savetxt">保存为txt</div>';
		Newdiv.innerHTML += '<div class="boxhide"><div class="jstoolbar"><div class="sclose">X</div>' + jsslider + jsavetxt + '</div><textarea class="stextarea"></textarea></div>';
		document.body.insertBefore(Newdiv, document.body.lastChild);

		var boxname = document.getElementsByClassName("boxhide")[0];
		document.getElementsByClassName("kjbtn")[0].onclick = function() {
			boxname.style.display = "block";
			boxname.style.top = "2px";
			boxname.style.right = (Newdiv.clientWidth + 2) + "px";
		};
		document.getElementsByClassName("sclose")[0].onclick = function() {
			boxname.style = null;
		};
		function Val2txt() {
			let Filename = new Date().getTime();
			let TextContent = document.getElementsByClassName("stextarea")[0].value;				
			let Addele = document.createElement('a');
			Addele.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(TextContent));
			Addele.setAttribute('download', Filename);
			let jset = document.createEvent('MouseEvents');
			jset.initEvent('click', true, true);
			Addele.dispatchEvent(jset);

		}
		function o2t(vv) {
			let getnamet = document.getElementsByClassName("stextarea")[0];
			getnamet.style.opacity = vv.value / 100;
		}
		let savetxt = document.getElementsByClassName("savetxt")[0];
		savetxt.addEventListener("click",function(e) {
			Val2txt();
		});
		let opacity2t = document.getElementsByClassName("sliderinput")[0];
		opacity2t.addEventListener("input",function(e) {
			o2t(this);
		});
	}
})();