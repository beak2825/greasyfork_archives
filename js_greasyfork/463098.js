// ==UserScript==
// @name         Competitive Companion 兼容 + 自动字符画生成器 + 复制辅助 用于 accoding.buaa.edu.cn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ... 听说会自己测试自己代码的人写代码容易AC~(误)
// @author       You
// @match        https://accoding.buaa.edu.cn/*
// @icon         http://buaa.edu.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @license MIT
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463098/Competitive%20Companion%20%E5%85%BC%E5%AE%B9%20%2B%20%E8%87%AA%E5%8A%A8%E5%AD%97%E7%AC%A6%E7%94%BB%E7%94%9F%E6%88%90%E5%99%A8%20%2B%20%E5%A4%8D%E5%88%B6%E8%BE%85%E5%8A%A9%20%E7%94%A8%E4%BA%8E%20accodingbuaaeducn.user.js
// @updateURL https://update.greasyfork.org/scripts/463098/Competitive%20Companion%20%E5%85%BC%E5%AE%B9%20%2B%20%E8%87%AA%E5%8A%A8%E5%AD%97%E7%AC%A6%E7%94%BB%E7%94%9F%E6%88%90%E5%99%A8%20%2B%20%E5%A4%8D%E5%88%B6%E8%BE%85%E5%8A%A9%20%E7%94%A8%E4%BA%8E%20accodingbuaaeducn.meta.js
// ==/UserScript==


function insertCSS(css){
	$("head").append($("<style>").html(css));
}
function sendToCC() {
	var data = (function() {
		var memoryAndTime = $(".problem-limit p").text().trim();
		var regRes = /.+?(\d+).+?(\d+).+?/.exec(memoryAndTime);
		var inputs = Array.from($("pre")).filter((a)=>(a.previousElementSibling.nodeName[0] == ("H") && a.previousElementSibling.innerText.replace(/\s/g, "").includes("输入")));
		var outputs = Array.from($("pre")).filter((a)=>(a.previousElementSibling.nodeName[0] == ("H") && a.previousElementSibling.innerText.replace(/\s/g, "").includes("输出")));

		return {
			name: $(".problem-title").text().replace(/\s+/g, " ").trim(),
			group: "ACCoding - " + $("h4").text().trim().replace(/\s+/g, " "),
			url: location.href,
			interactive: false,
			memoryLimit: +regRes[2],
			timeLimit: +regRes[1],
			tests: (function() {
				var list = [];
				var len = inputs.length;
				for (var i = 0; i < len; i++) {
					list.push({
						input: inputs[i].innerText,
						output: outputs[i].innerText
					})
				}
				return list;
			}
			)(),
			testType: "single",
			input: {
				type: "stdin"
			},
			output: {
				type: "stdout"
			},
			languages: {},
			batch: {
				"id": `123e67c8-03c6-000${location.href.includes("contest")?1:0}-${("0000" + $(".problem-title").text().replace(/\s+/g, " ").trim().charCodeAt(0)).slice(-4)}-${("00000000000000000" + location.href.replace(/[^0-9]/g,"")).slice(-12) }`,
				"size": 1
			}
		}

	}
	)();

	GM_xmlhttpRequest({
		url: 'http://127.0.0.1:10045/',
		method: 'POST',
		// *GET, POST, PUT, DELETE, etc.
		headers: {
			'Content-Type': 'application/json'// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: JSON.stringify(data),// body data type must match "Content-Type" header
                onerror: function(a){console.error(a)}
	})

}


function escapeToC(str)
{
	var shouldWarn = false;
	for(let i of str)
	{
		if(typeof i != "string") break;
		let code = i.charCodeAt(0);
		if(code > 127)
		{
			shouldWarn = true;
		}
	}

	//if(shouldWarn)alert("警告：含有非 ASCII 字符串。\n\n我不是按照 C 标准转义，这里体现规则不同性。")
	return JSON.stringify(str);
}

$(function(){
	var uuid = Array.from(((Math.random()*100000)|0).toString())
	                .map(function(ch){
						return ('abcdegfhijk')[ch];
					}).join("");
	insertCSS(`.${uuid}:hover{
		color: white;
		background:black;
	}`);
	var popupMenu = function(menu, x, y){
		var menuEle = menu.map(function(a){
			return $("<li>").text(a.text).on("click", a.event)
			                .css({padding:3,
								paddingLeft:16,
								minWidth:60,display:"block"}).addClass( uuid);
		}).reduce(function(prev, cur, id, ary){
			return prev.append(cur);
		},$("<menu>"));
		menuEle.css({
			position:"absolute",
			background:"rgba(255,255,255,0.5)",
			border: "1px solid",
			color: "black",
			left: x,
			top: y - 10,
			margin:0,padding:0,
			boxShadow: "1px 1px 0 0 grey",
			userSelect: "none",
			borderRadius: "3px"
		});
		menuEle.one("click", function(){
			menuEle.remove();
		})
		function onBackgroundClick(e)
		{
			var isSelf = menuEle[0].contains(e.target) || menuEle[0] == e.target;
			console.log(isSelf);
			setTimeout(function(){menuEle.remove();},isSelf?300:10);
			document.documentElement.removeEventListener("mousedown",onBackgroundClick, true);
			if(!isSelf)
			{
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		}
		$("html").append(menuEle);
		menuEle.hide().fadeIn(100);
		document.documentElement.addEventListener("mousedown",onBackgroundClick, true);
	}
	$("html").on("contextmenu","code,pre",function(e){
		var text = $(e.target).text();
		var selection = document.getSelection().toString() || text;
		popupMenu([
			{text:"复制", event:function(){
				navigator.clipboard.writeText(selection);
			}},
			{text:"复制全部", event:function(){
				navigator.clipboard.writeText(text);
			}},
			{text:"复制为 C 字符串", event:function(){
				navigator.clipboard.writeText(escapeToC(text) );
			}},
			{text:"复制为 puts 调用", event:function(){
				navigator.clipboard.writeText("puts(" + escapeToC(text) + ");");
			}},
			{text:"复制为 printf 调用", event:function(){
				navigator.clipboard.writeText("printf(" + escapeToC(text) + ");");
			}},
			{text:"复制为字符画程序", event:function(){
				navigator.clipboard.writeText("#include<stdio.h>\n\nint main()\n{\n\tputs(" + escapeToC(text) + ");\n\t/* Code below would make you see the ASCII-Art while the OJ wouldn't know what happened.*/\n\tfprintf(stderr, \"\\nPress Enter to continue...\\n\");\n\tgetchar();\n\treturn 0;\n}");
			}},
			{text:"发送题目", event:function(){
				sendToCC();
			}},
		],e.pageX, e.pageY);
		return false;
	})
});

$(document).on("mouseup", "pre,code", function (e) { if (!document.getSelection().toString().trim()) document.getSelection().selectAllChildren(e.target) });