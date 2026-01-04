// ==UserScript==
// @name         bitmex add BTCtoUSD calculator
// @namespace    https://cyemang.shop/btctousd
// @version      1.06.0
// @description  Add the calculator to Bitmex
// @author       Cyemang
// @match        https://www.bitmex.com/app/trade/XBTUSD
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/381361/bitmex%20add%20BTCtoUSD%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/381361/bitmex%20add%20BTCtoUSD%20calculator.meta.js
// ==/UserScript==
window.addEventListener("load", main, false);

function returnprice() {
	var btcvalue = document.getElementById("btctousd").value;
	var usdvalue = document.getElementById("sasine").value;
	var result = Math.floor(btcvalue * usdvalue * 10) / 10;
	return result;
}

function BTCtoUSD() {
	document.getElementById("kekka").value = returnprice();
}

function Rendo() {
	document.getElementById("sasine").value = document.getElementById("price").value;
	BTCtoUSD();
}

function copydata() {
	var textarea = document.createElement("textarea");
	textarea.id = "copibox";
	textarea.value = returnprice();
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("Copy");
	var target = document.getElementById("copibox");
	document.body.removeChild(target);
}

function tien() {
	setTimeout(Rendo, 20);
}

function addeventclickandkeyup(target, func) {
	target.addEventListener('click', func);
	target.addEventListener('keyup', func);
}

function hashedtag(){
	return Math.random().toString(32).substring(2);
}

function viewcopysuc() {
	var jikan = new Date();
	var hour = ("0" + jikan.getHours()).slice(-2);
	var minute = ("0" + jikan.getMinutes()).slice(-2);
	var second = ("0" + jikan.getSeconds()).slice(-2);
	var tag1 = hashedtag();
	var txt =
		"<button type=\"button\" id="+
		`"${tag1}"`+
		"class=\"close\"><i class=\"fa fa-fw fa-times-circle\"></i></button><h4><span class=\"alert alert-success date pull-right\">" +
		`${hour}:${minute}:${second}` +
		"</span><i class=\"fa fa-fw fa-check-square-o\"></i>コピー完了</h4><p>計算結果をコピーしました。</p>";
	var copysuc = document.createElement("div");
	copysuc.className = "notification success item-1";
	copysuc.id = "sucopy"+tag1;
	copysuc.style = "display: none";
	copysuc.innerHTML = [txt, ].join("");
	document.querySelector("div.notifications ").appendChild(copysuc);
	document.getElementById(tag1).addEventListener('click', closetab);
	setTimeout(closetab, 10000);
	$("#sucopy"+tag1).fadeIn(250);

	function closetab() {
		var target = document.getElementById("sucopy"+tag1);
		if (target !== null) {
			$("#sucopy"+tag1).fadeOut(200);
			setTimeout(function(){
				document.querySelector("div.notifications ").removeChild(target);
			},200);
		}
	}
}

function changestatus() {
	var op = "accordion-group fullPositionStatus orderWrapper open animating";
	var opn = "accordion-group fullPositionStatus orderWrapper open notAnimating";
	var clo = "accordion-group fullPositionStatus orderWrapper closed animating";
	var clon ="accordion-group fullPositionStatus orderWrapper closed notAnimating";

	var getctab = document.getElementById("ctab");
	var gethta = document.getElementById("hta");
	var mbar =document.getElementById("mmothertab");

	if (getctab !== null) {
		//opening
		getctab.className ="fa fa-fw fa-chevron-right fa-rotate-90";
		getctab.id = "btab";
		mbar.className = op;
		gethta.className ="panel-collapse collapse open in";

		setTimeout(function() {
			document.getElementById("mtab").className ="accordion-toggle underlined nowrap";
			gethta.style = "height: 100px;";
		}, 5);
		setTimeout(function() {
			gethta.className ="panel-collapse collapse open in";
			gethta.style = "height: auto;";
			mbar.className = opn;
		}, 250);
		//opened
	} else {
		//closing
		document.getElementById("btab").className = "fa fa-fw fa-chevron-right";
		document.getElementById("btab").id = "ctab";
		mbar.className = clo;
		document.getElementById("mtab").className ="accordion-toggle underlined nowrap collapsed";
		gethta.style = "height: 100px;";

		setTimeout(function() {
			gethta.style = "height: 0px;";
		}, 5);
		setTimeout(function() {
			gethta.className ="panel-collapse collapse";
			gethta.style = "height: 0px;";
			mbar.className = clon;
		}, 250);
		//closed
	}
}

function main() {
	var txt =
		"<h4 class=\"accordion-toggle underlined nowrap\" id=\"mtab\"><i class=\"fa fa-fw fa-chevron-right fa-rotate-90\" id =\"btab\"></i>BTCtoUSD計算機&nbsp;    <a href=\"https://cyemang.shop/btctousd.html\" target=\"_blank\" class=\"helpCircle  tooltipWrapper\"><sup><i class=\"fa fa-question-circle\"></i></sup></a></h4><ul class=\"panel-collapse collapse open in\" style=\"height: auto;\" id=\"hta\"><div class=\"measuringWrapper\"><div class=\"borderWrapper\"><div class=\"controlsBody limit\"><div class=\"orderControlsInputs inputs \"><div class=\"numInputs clearfix\"><div class=\"qty orderControlsInput\"><div class=\"inputWrap\"><label for=\"orderQty\" class=\"nowrap tooltipWrapper\">BTC数量</label><span class=\"input-group-inline\"><span class=\"input-group-addon\">BTC</span><input type=\"number\" id=\"btctousd\" autocomplete=\"off\" class=\"form-control valid\" min=\"-Infinity\" max=\"100000000\" placeholder=\"\" step=\"0.1\"></span></div></div><div class=\"qty orderControlsInput\"><div class=\"inputWrap\"><label for=\"orderQty\" class=\"nowrap tooltipWrapper\">指値</label><span class=\"input-group-inline\"><span class=\"input-group-addon\">USD</span><input type=\"number\" id=\"sasine\" autocomplete=\"off\" class=\"form-control valid\" min=\"-Infinity\" max=\"100000000\" placeholder=\"\" step=\"0.5\"></span></div></div><div class=\"price orderControlsInput\"><div class=\"inputWrap\"><label for=\"price\" class=\"nowrap tooltipWrapper\">計算結果</label><span class=\"input-group-inline\"><span class=\"input-group-addon\">USD</span><input class=\"\" type=\"number\" id=\"kekka\" style=\"\"><button id=\"copi\" class=\"input-group-addon\">copy</button></span></div></div></div></div></div></div></div></ul>";
	var keisantuika = document.createElement("li");
	addeventclickandkeyup(keisantuika, BTCtoUSD);
	keisantuika.className = "accordion-group fullPositionStatus orderWrapper open notAnimating";
	keisantuika.id="mmothertab";
	keisantuika.innerHTML = [txt, ].join("");
	document.querySelector("div.orderControls.basic").appendChild(keisantuika);
	document.getElementById("copi").addEventListener('click', copydata);
	document.getElementById("copi").addEventListener('click', viewcopysuc);
	addeventclickandkeyup(document.getElementById("price"), Rendo);
	document.querySelector("section.widget-xxs-height-7.widget.bitmexWidget.notFullscreened").addEventListener('click', tien);
	document.querySelector("li.accordion-group.orderWrapper.open.notAnimating").addEventListener('click',function() {
		addeventclickandkeyup(document.getElementById("price"), Rendo);
	});
	document.getElementById("mtab").addEventListener('click',changestatus);
}