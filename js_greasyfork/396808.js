// ==UserScript==
// @name         顶点小说朗读
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  顶点小说语音朗读服务
// @author       dongxiaoqi
// @match        https://www.booktxt.net/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/396808/%E9%A1%B6%E7%82%B9%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/396808/%E9%A1%B6%E7%82%B9%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    let style = document.createElement("style");

        style.appendChild(document.createTextNode(`input.ne-range[type=range]::-webkit-slider-thumb {
		    width: 6px;
		    height: 6px;
		    border-radius: 50%;
		    border: 0;
		    background-color: #FFF;
		    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.21);
		    -webkit-transition: border-color 0.15s, background-color 0.15s;
		    transition: border-color 0.15s, background-color 0.15s;
		    cursor: pointer;
		    background-clip: padding-box;
		    box-sizing: border-box;
		    -webkit-appearance: none !important;
		}

		input.ne-range[type=range]::-webkit-slider-thumb:active {
		    border: 0;
		    background-color: #FFF;
		}

		input.ne-range[type=range] {
		    width: 70%;
		    height: 2px;
		    border-radius: 8px;
		    margin: .8em 0;
		    padding: 0;
		    cursor: pointer;
		    border: 0;
		    background: -webkit-linear-gradient(#FFF, #FFF) no-repeat #999999;
		    background-size: 0% 100%;
		    position: relative;
		    outline: 0;
		    top: -3px;
		    -webkit-appearance: none !important;
			float: left;
		}

		.btn{
			width: 100%;
			font-size: 10px;
			color: #fff;
			background: #28abde;
			border-radius: 5px;
			padding: 1px;
		}`));
        document.head.appendChild(style);
    var con = '<div style="width: 100px">'
    +'<div style="width: 100%;">'
    +'<span style="float: left;width: 30%;font-size: 10px;">语速:</span>'
    +'<input id="rate" name="rate" class="ne-range" type="range" min="0" max="10" value="3" step="0.1">'
    +'</div>'
    +'<div style="width: 100%;">'
    +'<div id="playBtn" style="float: left;width: 33%;">'
    +'<input type="button" id="play" class="btn" value="播放"/>'
    +'</div>'
    +'<div id="pauseBtn" style="float: left;width: 33%;">'
    +'<input type="button" id="pause" class="btn" value="暂停"/>'
    +'</div>'
    +'<div id="resumeBtn" style="float: left;width: 33%;" hidden="hidden">'
    +'<input type="button" id="resume" class="btn" value="恢复"/>'
    +'</div>'
    +'<div id="cancelBtn" style="float: left;width: 33%;">'
    +'<input type="button" id="cancel" class="btn" value="停止"/>'
    +'</div>'
    +'</div>'
    +'</div>';
    $(".reader_mark1").append(con);
    var msg = new SpeechSynthesisUtterance();
		msg.onstart = function(e){
		}
		msg.onend = function(e){
			window.speechSynthesis.cancel();
		}
		msg.onpause = function(e){
			$("#pauseBtn").hide();
			$("#resumeBtn").show();
		}
		msg.onresume = function(e){
			$("#pauseBtn").show();
			$("#resumeBtn").hide();
		}
    $("#play").on('click', function() {
        var rate = $("#rate").val();
        var contentText = document.getElementById("content").innerText;
        var texts = contentText.split("章节错误,点此举报");
        msg.text = texts[0];
        console.log(msg.text);
        msg.lang = 'zh-CN';
        msg.rate = rate;
        window.speechSynthesis.speak(msg);
    });
	$("#pause").on('click', function() {
        window.speechSynthesis.pause();
    });
    $("#resume").on('click', function() {
        window.speechSynthesis.resume();
    });
    $("#cancel").on('click', function() {
        window.speechSynthesis.cancel();
    });
})();