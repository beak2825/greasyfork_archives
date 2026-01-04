// ==UserScript==
// @name         Beautification Tools for Luogu
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Make the ugly UI become more beautiful!
// @author       disangan233
// @match        https://*.luogu.com.cn/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/406960/Beautification%20Tools%20for%20Luogu.user.js
// @updateURL https://update.greasyfork.org/scripts/406960/Beautification%20Tools%20for%20Luogu.meta.js
// ==/UserScript==

var photo = "url(http://imgs.aixifan.com/live/1483416293981/1483416293981.jpg)";
var style = "no-repeat fixed center; background-size:cover;";
var opa = "0.82";

$(window).load(function()
{
	'use strict';

	var colors = ['rgb(191, 191, 191)', 'rgb(254, 76, 97)', 'rgb(243, 156, 17)', 'rgb(255, 193, 22)', 'rgb(82, 196, 26)', 'rgb(52, 152, 219)', 'rgb(157, 61, 207)', 'rgb(14, 29, 105)'];
	function updBGC(x, color, opa) {x.style.backgroundColor = color; x.style.opacity = opa;}
	function SetBGC(x, y, z = "1", l = x.length)
	{
		for(var i = 0; i < l; i++) updBGC(x[i], y, z);
	}
	function updC(x, color, opa) {x.style.color = color; x.style.opacity = opa;}
	function SetC(x, y, z = "1", l = x.length)
	{
		for(var i = 0; i < l; i++) updC(x[i], y, z);
	}
	function sort(x)
	{
		var i, str, l, arr = [], y = x.getElementsByClassName("problem-id");
		for(i = 0; i < y.length; i++)
		{
			arr.push(y[i]);
			str = arr[i].getElementsByClassName("color-default").item("innerText").innerText, l = str.length;
			if(str[0] == 'C')
			{
				if(l == 7 || l == 8 && (str[l-1] == '1' || str[l-1] == '2')) continue;
				else if(l == 6 || l == 7 && (str[l-1] == '1' || str[l-1] == '2')) {str = "CF0" + str.split("CF")[1];}
				else if(l == 5 || l == 6 && (str[l-1] == '1' || str[l-1] == '2')) {str = "CF00" + str.split("CF")[1];}
				else {str = "CF000" + str.split("CF")[1];}
			}
			if(str[0] == 'S')
			{
				if(l == 7) continue;
				else if(l == 6) {str = "SP0" + str.split("SP")[1];}
				else if(l == 5) {str = "SP00" + str.split("SP")[1];}
				else if (l == 4) { str = "SP000" + str.split("SP")[1]; }
				else {str = "SP0000" + str.split("SP")[1];}
			}
			if(str[0] == 'U')
			{
				if(l == 8) continue;
				else if(l == 7) {str = "UVA0" + str.split("UVA")[1];}
				else {str = "UVA00" + str.split("UVA")[1];}
			}
			arr[i].getElementsByClassName("color-default").item("innerText").innerText = str;
		}
		arr.sort(function(a,b){return a.innerText.localeCompare(b.innerText);});
		for(i = 0; i < arr.length; i++)
		{
			str = arr[i].getElementsByClassName("color-default").item("innerText").innerText, l = str.length;
			var res, j;
			if(str[0] == 'C')
			{
				res = "CF", j = 2; while(str[j] == '0') j++;
				for(; j < l; j++) res += str[j];
				str = res;
			}
			if(str[0] == 'S')
			{
				res = "SP", j = 2; while(str[j] == '0') j++;
				for(; j < l; j++) res += str[j];
				str = res;
			}
			if(str[0] == 'U')
			{
				res = "UVA", j = 3; while(str[j] == '0') j++;
				for(; j < l; j++) res += str[j];
				str = res;
			}
			arr[i].getElementsByClassName("color-default").item("innerText").innerText = str;
		}
		for(i = 0; i < arr.length; i++) x.appendChild(arr[i]);
	}
	document.body.style = "background:rgba(0, 0, 0, 0)" + photo + style;
	SetBGC(document.getElementsByClassName("lfe-body"), "rgba(0, 0, 0, 0)");
	SetBGC(document.getElementsByClassName("mdblog-article-container mdui-shadow-2 mdui-hoverable"), "#FFF", opa);
	updBGC(document.getElementsByClassName("lfe-body")[0], "#FFF", opa);
	SetC(document.getElementsByClassName("color-none"), "#3498DB", opa, 5);
	SetC(document.getElementsByClassName("popup-button"), "#3498DB", opa);
	document.getElementsByClassName("lfe-body")[3].style.opacity = opa;
	document.getElementsByClassName("wrapped lfe-body")[1].style.opacity = opa;

	var posi = document.getElementsByClassName("problems");
	for(var i = 0; i < 2; i++) sort(posi[i]);

	var problems = [];
	for(var passed of window._feInjection.currentData.passedProblems) problems.push({pid: passed.pid, dif: passed.difficulty, rendered: false});
	for(var tryed of window._feInjection.currentData.submittedProblems) problems.push({pid: tryed.pid, dif: tryed.difficulty, rendered: false});

	setInterval(() =>
	{
		if(window.location.href.split("#").length == 2 && window.location.href.split("#")[1] == 'practice')
		{
			for(var i = 0; i < problems.length; i++) if(!problems[i].rendered)
			{
				var elements = document.querySelectorAll('a');
				for(var el of elements) if(el.textContent == problems[i].pid)
				{
					if (el.classList) el.classList.remove("color-default");
					else el.className = el.className.replace('color-default', ' ');
					problems[i].rendered = true;
					el.style.color = colors[problems[i].dif];
					break;
				}
			}
		}
		else for(var j = 0; j < problems.length; j++) problems[j].rendered = false;
	}, 1000);

});
