// ==UserScript==
// @name         超级音频倍速播放(听歌鬼畜神器)
// @namespace    http://tampermonkey.net/
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @version      1.0.0
// @description  听音乐音频播太慢，不鬼畜，这能忍？直接倍速播放，最高速度20倍【食用方法】①调节右上角加速框右侧上下按钮即可调节倍率 ②在右上角的加速框内输入加速倍率,如2、4、8、16等。【快捷键】：①单手快捷键：“x”，“c” 恢复正常播放:“t”  ②双手快捷键：ctrl + 左右箭头
// @author       wll
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require 	 https://greasyfork.org/scripts/447214-toast-script/code/toastscript.js?version=1065649
// @resource     css https://cdn.jsdelivr.net/gh/sanzhixiaoxia/statics@main/toast.style.css
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @include      *:*
// @note         郑重声明：	本脚本只做学习交流使用，未经作者允许，禁止转载，不得使用与非法用途，一经发现，追责到底
// @note         授权联系：	leiwang2010@163.com
// @note         版本更新	22-07-04 1.0.0	初版发布音频倍速播放


// @downloadURL https://update.greasyfork.org/scripts/447414/%E8%B6%85%E7%BA%A7%E9%9F%B3%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%28%E5%90%AC%E6%AD%8C%E9%AC%BC%E7%95%9C%E7%A5%9E%E5%99%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447414/%E8%B6%85%E7%BA%A7%E9%9F%B3%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%28%E5%90%AC%E6%AD%8C%E9%AC%BC%E7%95%9C%E7%A5%9E%E5%99%A8%29.meta.js
// ==/UserScript==

(function() {
	'use strict';

    document.onkeydown = function() {
		if (window.event.ctrlKey && (window.event.keyCode == 37)) {
			console.log("ctrl---");
			$("#rangeId").val(parseFloat(parseFloat($("#rangeId").val()) - 0.1 < 0.1 ? 0.1 : parseFloat($("#rangeId").val()) - 0.1).toFixed(1)).trigger("change");
		}
		if (window.event.ctrlKey && (window.event.keyCode == 39)) {
		    console.log("ctrl+++");
			$("#rangeId").val(parseFloat(parseFloat($("#rangeId").val()) + 0.1 >  20 ?  20 : parseFloat($("#rangeId").val()) + 0.1).toFixed(1)).trigger("change");
		}
	}

	document.addEventListener("keypress", function(e) {
	    console.log("--->e.key:"+e.key);
		switch (e.key.toLowerCase()) {
			case "x":
			    console.log("x---");
				$("#rangeId").val(parseFloat(parseFloat($("#rangeId").val()) - 0.1 < 0.1 ? 0.1 : parseFloat($("#rangeId").val()) - 0.1).toFixed(1)).trigger("change");
				break;
			case "c":
			    console.log("c+++");
				$("#rangeId").val(parseFloat(parseFloat($("#rangeId").val()) + 0.1 >  20 ?  20 : parseFloat($("#rangeId").val()) + 0.1).toFixed(1)).trigger("change");
				break;
			case "t":
			    console.log("t+++");
                $("#rangeId").val(1.0);
				localUtil.setSValue("speedStepKey", null);
				break;
		}
	});

    function addToast(msgText) {
        GM_addStyle(GM_getResourceText("css"));
        $.Toast("当前倍速：", msgText, "success", {
            // stack: true,
            has_icon: true,
            has_close_btn: true,
            fullscreen: false,
            timeout: 1000,
            sticky: false,
            has_progress: true,
            rtl: false,
        });
	}

	var localUtil = {
		getSValue(name) {
			return window.localStorage.getItem(name);
		},
		setSValue(name, value) {
			window.localStorage.setItem(name, value);
		},
		getGValue(name) {
			return window.GM_getValue(name);
		},
		setGValue(name, value) {
			window.GM_setValue(name, value);
		}
	}

    var main = {
		init() {
			$("body").prepend('<input id="rangeId" type="number" step="0.1" min="0.1" max="20" value="" autofocus="autofocus" style="z-index:99999999;position:fixed;top:100px;right:100px;border:solid 1px;background-color:#E3EDCD;" />');
		},
		run() {
			var step = document.getElementById("rangeId").value;
			var htmlaudio = $("audio").length;
			if (htmlaudio > 0) {
				console.log("倍速播放方法启动,当前倍率为....." + step);
				if (location.href.indexOf('bilibili.com/video/') > 0) {
					if (stopFlag) {
						//play audio is auto
						document.querySelector('audio').play();
						stopFlag = false;
					}
				}
                var speedStepKey = localUtil.getSValue("speedStepKey");
                if((step == null || step ==  '') && speedStepKey == null){
                    $("#rangeId").val(1);
                    document.querySelector('audio').playbackRate = 1;
                    return;
                }
                if((step == null || step ==  '') && speedStepKey != null){
					localUtil.setSValue("speedStepKey", speedStepKey);
                    $("#rangeId").val(speedStepKey);
                    document.querySelector('audio').playbackRate = speedStepKey;
                    return;
                }
                if(step != null && step !=  ''&& step != speedStepKey){
                    localUtil.setSValue("speedStepKey", step);
                    $("#rangeId").val(step);
                    document.querySelector('audio').playbackRate = step;
                    return;
                }
                if(step == speedStepKey){
                    localUtil.setSValue("speedStepKey", step);
                    $("#rangeId").val(step);
                    document.querySelector('audio').playbackRate = step;
                    return;
                }
			} else {
				console.log("当前音频不支持倍速播放..... o(╥﹏╥)o");
			}
		},chages(){
            $("#rangeId").change(function(e) {
                addToast($("#rangeId").val());
            })
        }
	}

	var stopFlag = true;
	var startStamp = new Date().getTime();
	window.initTimer = setInterval(() => {
		var audios = document.querySelectorAll("audio").length;
		var nowStamp = new Date().getTime();
		if (audios > 0) {
			clearInterval(initTimer);
			main.init();
            main.chages();
			window.setInterval(function() {main.run();}, 1000);
		} else if ((nowStamp - startStamp) > 15 * 1000) {
			clearInterval(initTimer);
		} else {
			console.log('search audio waiting...');
		}
	}, 1000);

    //window.setInterval(function() {addToast("提示：成功"+new Date());}, 1*1000);
})();