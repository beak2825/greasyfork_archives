// ==UserScript==
// @name		Biodo Answer Viewer
// @namespace	http://tampermonkey.net/
// @version		v1.2
// @description	Show the correct ans of biodo test
// @author		PCwqyy
// @match		examin.biodo.com/examin/*
// @icon		https://beidoustatic.oss-cn-beijing.aliyuncs.com/biodoimg/biodo/biodoyuan.png
// @grant		none
// @license		MIT
// @downloadURL https://update.greasyfork.org/scripts/524276/Biodo%20Answer%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/524276/Biodo%20Answer%20Viewer.meta.js
// ==/UserScript==

(function() {
	var a;
	var ChoosedCell=document.getElementsByClassName('choose');
	var Result=jQuery('table:not(.answercell)')[0];
	Result.classList.add('Result');
	var Ansing=document.getElementById('btn2')!=null;
	try
	{
		for(var i in ChoosedCell)
		{
			if(ChoosedCell[i].style.backgroundColor=='red')
			{
				a=i-(i%2*2-1);
				ChoosedCell[a].style.backgroundColor='limegreen',
				ChoosedCell[a].style.color='white';
				ChoosedCell[i].style.color='white';
			}
			else if(ChoosedCell[i].style.backgroundColor=='green')
			{
				ChoosedCell[i].style.backgroundColor='limegreen',
				ChoosedCell[i].style.color='white';
			}
		}
	}
	catch(error){console.error('err',error);}
	var Body=document.getElementsByTagName('body')[0];
	var Style111=document.createElement('style');
	Style111.textContent=`
		*{
			user-select: none;
		}
		.answercell td.choose {
			border: gray;
			background-color: white;
			${
				Ansing?
				`padding: 0.5vh 1vw;
				font-size: 20px;`:
				`pointer-events: none;`
			}
		}
		.answercell td.choose:hover {
			background-color: aliceblue;
			color: lightseagreen;
		}
		.answercell td:not(.choose) {
			padding: 0 2px !important;
		}
		.answercell td.choose.choice {
			background-color: deepskyblue;
			color: white;
		}
		.answercell td.choose.choice:hover {
			background-color: dodgerblue;
			color: white;
		}
		table:not(.answercell) {
			border: none !important;
			padding: 2vh;
			background-color: azure !important;
			font-weight: normal !important;
			border-radius: 10px;
		}
		body>div {
			background-color: white !important;
			padding: 5vh 1vw !important;
			margin: 2vh 2vw !important;
			width: unset !important;
			box-shadow: gray 2px 2px 10px;
		}
	`
	Body.appendChild(Style111);
})();