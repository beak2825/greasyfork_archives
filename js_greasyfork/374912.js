// ==UserScript==
// @name         KepaMoney
// @namespace    http://tampermonkey.net/
// @version      7
// @description  Balance to UAH
// @author       You
// @match        *://gamdom.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.js
// @downloadURL https://update.greasyfork.org/scripts/374912/KepaMoney.user.js
// @updateURL https://update.greasyfork.org/scripts/374912/KepaMoney.meta.js
// ==/UserScript==
setTimeout(()=>{	
	let rubles = false;
	$("a[title|='Deposit']").removeAttr("href");
	$("a[title|='Deposit']").on("click", function (e) {
        e.preventDefault();
    });
	//Оставлять окно активным
	Object.defineProperty(document, "hidden", { value : false});

	let balance = $("#balance span:last-child").text();
	balance = balance.replace(/\s/g, '');
	balance = parseInt(balance, 10);

	let texthr = " | " + balance + "₴";
	var styles = {
		  color: "white",
	};
	var grivnispan=$('<span></span>',{
			text: texthr,
			class: "grivnispan",
	}).css(styles);

	grivnispan.on("click",() => {
		if(rubles)
			rubles = false;
		else if(!rubles)
			rubles = true;
	});

	$("#balance").append(grivnispan);

	setInterval(function(){
		balance = $("#balance span").text();
		balance = balance.replace(/\s/g, '');
		balance = parseInt(balance, 10);

		let balancegriven;
		if(rubles)
			balancegriven = ((balance*66)/1000);
		else if(!rubles)
			balancegriven = ((balance*28)/1000);

		balancegriven = balancegriven - (balancegriven/10);
		balancegriven = balancegriven.toFixed(2);
		balancegriven = balancegriven/1.5;
		balancegriven = balancegriven.toFixed(2);

		if(rubles)
			$(".grivnispan").text(" | " + balancegriven + "₽");
		else if(!rubles)
			$(".grivnispan").text(" | " + balancegriven + "₴");
	},100);
},5000);