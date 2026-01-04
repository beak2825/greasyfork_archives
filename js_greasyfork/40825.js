// ==UserScript==
// @name         以太坊日志翻译器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将以太坊的16进制data数据转换成原文
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @author       FIFO
// @include      https://etherscan.io/address/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40825/%E4%BB%A5%E5%A4%AA%E5%9D%8A%E6%97%A5%E5%BF%97%E7%BF%BB%E8%AF%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/40825/%E4%BB%A5%E5%A4%AA%E5%9D%8A%E6%97%A5%E5%BF%97%E7%BF%BB%E8%AF%91%E5%99%A8.meta.js
// ==/UserScript==

(function() {
	'use strict';
	// Your code here...
    var page;
    var list;
    function re(){
        setTimeout(function(){
            page=document.getElementById("eventsIframe").contentWindow;
            list=page.document.getElementsByClassName("address-tag");
            if(list != null){
                console.log("--------try run---------");
                run();
            }else{
                console.log("--------re---------");
                re();
            }
        },1000);
    }
    re();

    function run(){
        if(list.length == 0){
            re();
        }
		for (var i = 1; i <= list.length ; i++) {
			var content_element;
			var content = "";
			for (var j = 3; j < 6; j++) {
				var name = "chunk_" + i + "_" + j;
				content_element = page.document.getElementById(name);
				if (content_element) {
					content = content + content_element.innerHTML;
				}
			}
			console.log(i);
			console.log(content);
			var str = prePro(content);
			console.log(str);
			var nameo = "chunk_" + i + "_1";
			var add =  page.document.getElementById(nameo).parentNode.parentNode.parentNode;
            add.parentNode.parentNode.parentNode.style.paddingBottom = "20px";
			var para=document.createElement("div");
			var node=document.createTextNode("文本: " + str);
			para.appendChild(node);
            para.style.position = "absolute";
            para.style.paddingTop = "5px";
            para.style.fontFamily = "微软雅黑";
			para.style.display = "block";
			add.appendChild(para);
			content = "";
		}
		function prePro(data){
            if (data.length % 2) return "error";
            data = Trim(data);
            if (data.length % 2) data = data + 0;
			var tmp='';
			for(var x=0;x<data.length;x+=2){
			    tmp += '%' + data.charAt(x) + data.charAt(x+1);
			}
			return decodeURI(tmp);
		}
		function Trim(str){
            return str.replace(/(^0*)|(0*$)/g, "");
        }
	}
})();