// ==UserScript==
// @name         Botzone_LevelUpper
// @namespace    https://wr786.github.io/
// @version      0.0.6
// @description  Botzone挂机升级小工具
// @author       wr786
// @match        *://www.botzone.org.cn/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/412013/Botzone_LevelUpper.user.js
// @updateURL https://update.greasyfork.org/scripts/412013/Botzone_LevelUpper.meta.js
// ==/UserScript==

function getElementsByClass(Parent,Class){
    var Result = [];
    var Node = Parent.getElementsByTagName("*");
    for(var i=0; i<Node.length; i++){
        if(Node[i].className == Class){
            Result.push(Node[i]);
        }
    }
    return Result;
}

function gain_exp() {
    $("#txtDescription_bot").val("Botzone_levelUpper");
    $("#btnInheritVersion").click();
    $("#frmCreateBot").submit();
}	// 每次能获得10EXP

function Botzone_LevelUpper() {
	var itv = window.setInterval(gain_exp, 3000);
}

function add_button() {
	var html ="<input type=\"button\" id=\"blu\" value=\"LevelUpper\" onclick=\"this.value=\'LevelUpper已启动\';\" style=\"background: #1f1e33; color: #FFFFFF\">";
	document.getElementById("btnCreateFormClose").outerHTML = html;
}

var _itv;

function check_status() {
	var form = document.getElementById('panCreate');
	if(form) {
		if(form.firstElementChild.innerText.indexOf("给Bot增加版本") != -1) {
			var btn = document.getElementById('blu');
			if(btn) {
				if(btn.value == "LevelUpper已启动") {
					alert("LevelUpper已启动, 请等待…");
					Botzone_LevelUpper();
					_itv = window.clearInterval(_itv);
				}
			} else {
				add_button();
			}
		}
	}
}	// 判断是否生成按钮

(function() {
	_itv = window.setInterval(check_status, 1000);
})();