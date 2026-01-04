// ==UserScript==
// @name         AtCoder Sample Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1.0.2
// @description  Add a button to download sample cases.
// @author       RMQ
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380863/AtCoder%20Sample%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/380863/AtCoder%20Sample%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
$("<span></span>",{
	css:{
		"background-color":"#ddd",
		"border":"solid 1px #ccc",
		"padding":"0.5em",
		"font-size":"0.5em",
		"margin-left":"0.5em"
	},
	html:"Sample Download",
	on:{
		click:function(event){
			sample_downloader()
		}
	}
}).appendTo(".h2");

function sample_downloader(){
	var sample_input=[];
	var sample_output=[];
	$(".lang-en").remove();
	for(var i=0;;i++){
		if($("#pre-sample"+i).length){
			var txt = $("#pre-sample"+i).text();
			if(i%2===0){
				console.log(i);
				sample_input[i/2]=txt;
			}else{
				// console.log(i);
				sample_output[(i-1)/2]=txt;
			}
		}else{
			break;
		}
	}
	console.log(sample_input);
	console.log(sample_output);
	//ファイルを作ってダウンロードします。
	for(var i=0;i<sample_input.length;i++){
		var resultJson = JSON.stringify(sample_input[i]);
		var txt = resultJson.substr(1,resultJson.length-2);
		txt = txt.replace(/\\n/g,"\n");
		var downLoadLink = document.createElement("a");
		downLoadLink.download = "input"+i+".txt";
		downLoadLink.href = URL.createObjectURL(new Blob([txt], {type: "text.plain"}));
		downLoadLink.dataset.downloadurl = ["text/plain", downLoadLink.download, downLoadLink.href].join(":");
		downLoadLink.click();
	}
}
//
})();