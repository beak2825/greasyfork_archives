// ==UserScript==
// @name         LifeRestart快速抽卡
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  痛快抽卡！因为要去重，所以实际抽卡会比较偏少。
// @match        *://liferestart.syaro.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431943/LifeRestart%E5%BF%AB%E9%80%9F%E6%8A%BD%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/431943/LifeRestart%E5%BF%AB%E9%80%9F%E6%8A%BD%E5%8D%A1.meta.js
// ==/UserScript==

var loop;
loop = setInterval(restart, 1000);

function restart() {
	if (document.querySelector("#restart")) {
		document.querySelector("#restart").addEventListener("click", LR_INF_random);
		//clearInterval(loop);
	}
}

function LR_INF_random() {
	var btn_random = document.querySelector("#random");
	btn_random.style.top = "35%";
	btn_random.addEventListener("click", LR_random);
	
	if(document.querySelector("#random1b")){
	    document.querySelector('#random1b').remove();
	    document.querySelector('#random1k').remove();
	    document.querySelector('#random1w').remove();
	}
	
	var btn_random1b = document.createElement("button");
	btn_random1b.innerText = "100连抽！";
	btn_random1b.id = "random1b";
	btn_random1b.className = "mainbtn";
	btn_random1b.style.top = "45%";
	btn_random1b.addEventListener("click", LR_random);
	btn_random.parentNode.appendChild(btn_random1b);

	var btn_random1k = document.createElement("button");
	btn_random1k.innerText = "1000连抽！";
	btn_random1k.id = "random1k";
	btn_random1k.className = "mainbtn";
	btn_random1k.style.top = "55%";
	btn_random1k.addEventListener("click", LR_random);
	btn_random.parentNode.appendChild(btn_random1k);

	var btn_random1w = document.createElement("button");
	btn_random1w.innerText = "10000连抽！";
	btn_random1w.id = "random1w";
	btn_random1w.className = "mainbtn";
	btn_random1w.style.top = "65%";
	btn_random1w.addEventListener("click", LR_random);
	btn_random.parentNode.appendChild(btn_random1w);
}

function LR_random(e) {
	var t, talents, i, j, k;
	var id = e.currentTarget.id;
	if (id == "random") {
		t = 0;
	} else if (id == "random1b") {
		t = 10;
	} else if (id == "random1k") {
		t = 100;
	} else if (id == "random1w") {
		t = 1000;
	}
	document.querySelector('#random1b').style.left = "75%";
	document.querySelector('#random1b').style.bottom = "0.1rem";
	document.querySelector('#random1b').style.top = "auto";
	document.querySelector('#random1b').innerText = "再抽！";
	document.querySelector('#random1k').style.display = "none";
	document.querySelector('#random1w').style.display = "none";
	for (i = 0; i < t; i++) {
		document.querySelector('#random').click();
		talents = document.querySelectorAll('li.grade0b,li.grade1b,li.grade2b,li.grade3b');
		for (j = talents.length - 10; j < talents.length; j++) {
			for (k = 0; k < j; k++) {
				if (talents[j].innerText == talents[k].innerText) {
					talents[j].className = "repeat";
					break;
				}
			}
		}
		document.querySelectorAll('li.repeat').forEach(item => item.remove());
	}
	LR_INF_talents()
}

function LR_INF_talents() {
	var i;
	if (document.querySelector("#CLR")) {
		document.querySelector("#CLR").remove();
	}
	var div_main = document.querySelector("#main");
	var div_CLR = document.createElement("div");
	div_CLR.id = "CLR";
	div_CLR.className = "head";
	div_CLR.style.left = "65%";
	div_main.appendChild(div_CLR);
	for (i = 0; i < 4; i++) {
		var btn_CLR = document.createElement("button");
		btn_CLR.className = "grade" + i + "b selected";
		btn_CLR.style.paddingLeft = "0";
		btn_CLR.style.width = "1rem";
		btn_CLR.style.height = "1rem";
		btn_CLR.style.margin = "0.1rem";
		btn_CLR.addEventListener("click", LR_talents);
		div_CLR.appendChild(btn_CLR);
	}
}

function LR_talents(e) {
	var btn_CLR = e.currentTarget;
	console.log(btn_CLR);
	if (btn_CLR.className.indexOf("selected") != -1) {
		btn_CLR.className = btn_CLR.className.replace(" selected", "");
		document.querySelectorAll("li." + btn_CLR.className).forEach(item => item.style.display = "none");
	} else {
		console.log("hide");
		document.querySelectorAll("li." + btn_CLR.className).forEach(item => item.style.display = "");
		btn_CLR.className = btn_CLR.className.concat(" selected");
	}
}
