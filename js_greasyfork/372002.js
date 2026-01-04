// ==UserScript==
// @name         浪费了多少时间
// @namespace    mscststs
// @version      0.2
// @description  计算你在这个网页上浪费了多少时间
// @author       mscststs
// @noframes
// @include        /.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372002/%E6%B5%AA%E8%B4%B9%E4%BA%86%E5%A4%9A%E5%B0%91%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/372002/%E6%B5%AA%E8%B4%B9%E4%BA%86%E5%A4%9A%E5%B0%91%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
	CreateNode();
	let CurrentPage = 0;
	let inCurrentPage = false;
	window.onblur = ()=>{
		inCurrentPage = false;
	}
	window.onfocus = ()=>{
		inCurrentPage = true;
	}

	function getValue(Time){
		let arr  =[
			{
				key:"秒",
				cir:60,
			},
			{
				key:"分",
				cir:60,
			},
			{
				key:"时",
				cir:24,
			},
			{
				key:"天",
				cir:Infinity,
			}
		];
		let word = "";
		for(let unit of arr){
			//console.log(Time,unit.cir,word);
			if(Time>0){
				word = unit.key + word;
			}
			word = Time%unit.cir + " "+word;
			Time =  parseInt(Time/unit.cir);
			if(Time < 1){break};
		}
		return word;
	}
	window.onmousemove = ()=>{
			inCurrentPage = true;
			setInterval(()=>{
				if(inCurrentPage){
					let Time = ++CurrentPage;
					document.querySelector(".wasted_time").innerText = ("- "+getValue(Time));
				}
			},1000);
			window.onmousemove = "";
	}
	function CreateNode(){
		let div=document.createElement("div");
		div.setAttribute("class","wasted_time");
		let style=document.createElement("style");
		div.appendChild(document.createTextNode("- 0 秒"));
		style.appendChild(document.createTextNode(`
		.wasted_time{
				font-size:14px;
				position:fixed;
				display:block;
				text-align:center;
				cursor:default;
				padding:3px 20px;
				border-radius:3px;
				background-color:rgb(208, 212, 206);
				right:17px;
				bottom:3px;
				z-index:999999;
				color:rgb(17, 82, 17);
				text-shadow:0 0 0.1px rgba(0,0,0,0.5);
				user-select:none;
				box-shadow:0 0 7px 0 rgba(18, 80, 18,0.4),0 0 0 1px rgba(0,0,0,0.3);
			}
		`));
		document.querySelector("body").appendChild(div);
		document.querySelector("body").appendChild(style);
	};

})();