// ==UserScript==
// @name         钉钉GroupLive倍速控件
// @author       Vincent George
// @License      CC 4.0 BY-SA
// @version      1.3.1
// @description  没错！你可以倍速看钉钉GroupLive. 而且自定义倍速！
// @namespace    http://cnily.home.blog
// @match        https://h5.dingtalk.com/group-live-share/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396133/%E9%92%89%E9%92%89GroupLive%E5%80%8D%E9%80%9F%E6%8E%A7%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/396133/%E9%92%89%E9%92%89GroupLive%E5%80%8D%E9%80%9F%E6%8E%A7%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
	window.onload = function() {
		'use strict';
		/* By Vincent George, under License CC4.0 BY-SA */
		var speedButton = document.createElement("button");
		speedButton.className = "control-button control-speed-button";
		speedButton.id = "hide";
		var speedDiv = document.createElement("div");
		speedDiv.className = "speedDiv";

		//General Style
		var appendCss = document.createElement("style");
		appendCss.type = "text/css";
		appendCss.innerHTML = ".control-button{display: -moz-flex;display: -moz-flexbox;display: -webkit-flexbox;display: flexbox;display: -moz-box;display: -webkit-box;display: box; background-color:transparent;font-size:16px;border-width:0px 0px 0px 0px;color:white;outline:none;border-color:snow;-webkit-transition: all .3s;-moz-transition: all .3s;-ms-transition: all .3s;-o-transition: all .3s; transition: all .3s;}" +
			".control-button:hover{color:#42a7ff;border-color:#0088ff;}" +
			"ele-button{display: -moz-flex;display: -moz-flexbox;display: -webkit-flexbox;display: flexbox;display: -moz-box;display: -webkit-box;display: box; outline: none;}" +
			".ele-speed-change-button {border-width:2px; border-color:#c1c1c1; color:#c1c1c1; background-color:transparent; webkit-transition: color .3s,background-color .3s;-moz-transition: color .3s,background-color .3s;-ms-transition: color .3s,background-color .3s;-o-transition: color .3s,background-color .3s; transition: color .3s,background-color .3s;}" +
			" .ele-speed-change-button:hover {color:black; background-color:#c1c1c1}";
		document.getElementsByTagName("head")[0].appendChild(appendCss);

		//speedDiv Style
		speedDiv.style.backgroundColor = "#222";
		speedDiv.style.border = "1px solid #777";
		speedDiv.style.width = "120px";
		speedDiv.style.height = "50px";
		speedDiv.style.position = "absolute";
		speedDiv.style.right = "10px";
		speedDiv.style.bottom = "50px";
		speedDiv.style.padding = "7px";
		speedDiv.style.zIndex = "99999";
		speedDiv.style.lineHeight = 1.5;
		speedDiv.style.color = "#fff";
		speedDiv.style.fontSize = "15px";
		speedDiv.style.visibility = "hidden";
		document.getElementsByClassName("lib-video")[0].appendChild(speedDiv);

		//speedButton Style
		speedButton.innerHTML = "倍速";
		speedButton.style.height = "25px";
		speedButton.style.width = "47px";
		document.getElementsByClassName("vjs-control-bar")[0].insertBefore(
			speedButton,
			document.getElementsByClassName("playback-rate-wrap")[0]
		);
		document.getElementsByClassName("playback-rate-wrap")[0].remove();

		//function
		window.changeSpeed = function() {
			var speed = parseFloat(document.getElementById("speedInput").value);
			document.getElementsByClassName("lib-video")[1].playbackRate = speed.toFixed(1);
			document.getElementById("currentSpeed").innerHTML = speed.toFixed(1);
			speedButton.innerHTML = speed.toFixed(1) == 1.0 ? "倍速" : (speed.toFixed(speed.toFixed(1) >= 10 ? 0 : 1) + " x");
		}
		speedButton.onclick = function() {
			if (speedButton.id == "hide") {
				$(".speedDiv").css("opacity", 1);
				speedDiv.style.visibility = "visible";
				speedButton.id = "display";
			} else if (speedButton.id = "display") {
				speedDiv.style.visibility = "hidden";
				speedButton.id = "hide";
			}
		}

		var isHide = true;
		window.control_ele_hide = function() {
			if (document.getElementsByClassName("vjs-control-bar vjs-opacity-hidden vjs-hidden")[0] && isHide) {
				speedDiv.style.visibility = "hidden";
				speedButton.id = "hide";
				isHide = true;
			} else {
				$(".speedDiv").css("opacity", ($(".vjs-control-bar").css("opacity")) * 0.90);
				if (document.getElementById('speedInput') == document.activeElement) {
					isHide = false;
					$(".vjs-control-bar").css("transition", "all 0s 0s");
					//$(".vjs-control-bar").css("opacity",1);
					document.getElementsByClassName("vjs-control-bar vjs-opacity-hidden vjs-hidden")[0].className = "vjs-control-bar";
				} else {
					isHide = true;
					$(".vjs-control-bar").css("transition", "all .3s ease");
				};
			}

		}

		//more settings
		speedDiv.innerHTML = "当前倍速：<text id='currentSpeed'>1.0</text> x<br><input type='text' placeholder='1.5' id='speedInput' size='3' maxlength='3'>&nbsp;&nbsp;<button class='ele-button ele-speed-change-button' onclick='window.changeSpeed();' style='height:50%;width:40%'>切换</button>";
		$(function() {
			$('#speedInput').bind('keypress', function(event) {
				if (event.keyCode == "13") {
					window.changeSpeed();
				}
			});
		});
		setInterval("window.control_ele_hide();", 10);
	}
})();