// ==UserScript==
// @name         DI Compare
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       menli
// @match        http://127.0.0.1:8080/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24835/DI%20Compare.user.js
// @updateURL https://update.greasyfork.org/scripts/24835/DI%20Compare.meta.js
// ==/UserScript==

(function() {
    'use strict';

function startUI(){
	var ui = "<table style='border:1px solid green; width:50%; margin-top:80px; margin-bottom:30px'><tr><td><button id='lmjcomp'>compare</button></td></tr></table>";
	var div = document.createElement("div");
	div.innerHTML = ui;
	document.body.insertBefore(div,document.body.firstChild);
}

function lmjSave(e){
	if(e.which == 83){
		//save here
		//mstrmojo-Table refine-table
		//tbody tr td div div refine-cell-text-container refine-cell-text
		var wrangdata = document.getElementsByClassName("refine-cell-text");
		var wrangeler = {};
		
		for(var item in wrangdata){
			wrangeler[item] =  wrangdata[item].innerText;
		}
		var wrangelerjson = JSON.stringify(wrangeler);
		window.localStorage.setItem("wrangler",wrangelerjson);
		alert("save success");
		
			
	}
}

function lmjComp(){
	//compare here
	var tmp = document.getElementsByTagName("tbody");
	var max = 0;
	var comp = tmp[tmp.length-1].getElementsByTagName("tr");
	var wrangler = JSON.parse(window.localStorage.getItem("wrangler"));
	var count = 0;

	for(var item in comp){
		if(item!=0){
			var tds = comp[item].getElementsByTagName("td");

			for(var td in tds){
				if(td<=tds.length-1){
					
					tds[td].style.backgroundColor = "yellow";

					if(tds[td].innerText == wrangler[count]){
						tds[td].style.backgroundColor = "green"; 
					}
					else{
						tds[td].style.backgroundColor = "red";
					console.log("%%%%unmatch%%%%%%%%%");
					console.log("preview:" + tds[td].innerText);
					console.log("document:" + wrangler[count]);
					console.log("*******************");
					}
					count++;
				}
					

			}
		}		
	}


	
}

function bindEvent(){
	document.body.addEventListener("keydown",lmjSave);
	document.getElementById("lmjcomp").addEventListener("click",lmjComp);
}

startUI();
bindEvent();













//**************
})();