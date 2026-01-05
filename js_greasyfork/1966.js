// ==UserScript==
// @id HabrPercentageRing
// @name Habr Percentage Ring
// @version 15.2016.3.7
// @namespace github.com/spmbt
// @author spmbt0
// @description Percentage Rings around numbers which show grades (for with userstyles)
// @icon https://habrahabr.ru/favicon.ico
// @include https://habrahabr.ru*
// @include https://geektimes.ru*
// @include /^https?://(m\.|webcache\.googleusercontent\.com\/search\?q=cache(:|%3A|%3a)(https?(:|%3A|%3a)(\/|%2F|%2f)(\/|%2F|%2f))?)?(habrahabr|geektimes|megamozg|h).ru(?!\/special|\/api)/
// @exclude https://habrahabr.ru/api/*
// @update 14 https
// @downloadURL https://update.greasyfork.org/scripts/1966/Habr%20Percentage%20Ring.user.js
// @updateURL https://update.greasyfork.org/scripts/1966/Habr%20Percentage%20Ring.meta.js
// ==/UserScript==
// работает автономно или как модуль для HabrAjax: https://greasyfork.org/en/scripts/1970-habrajax
var w1n = typeof unsafeWindow !='undefined'? unsafeWindow: (function(){return this})();
(w1n.habrPercentageRing = function(blck){
var marks = blck && blck.childNodes && blck.querySelectorAll('.voting-wjt__counter')
	,r2 = 14
	,isC2 = blck && / c2/.test(blck.className)
	,$q = function(q, f){return (f||document).querySelector(q)}
	,zen = (function(a, b){ //индикатор подключения юзерстилей ZenComment
		a = $q(b) || $q(a); //b - устаревший переходной индикатор, a - входящий в действие
		b = a && w1n.getComputedStyle(a, null);
		return !!(b && (b.getPropertyValue('z-index')=='10026' || b.getPropertyValue('max-width')=='1420px'));})('.nav_panel .tab_user','#navbar')
	,isHajax = function(){return !!$q('.hAjaxLogo');};
if(!marks) return;
for(var i in marks){
	var o = marks[i]
		,oP = o.parentNode;
	if(!o || !o.attributes) continue;
	o.style.position ='relative';
	if(/\/users\//.test(location.href) ){
		oP.style.marginRight ='14px';
		oP.style.marginTop ='2px';}
	var oXS = $q('span', o);
	if(oXS && oXS.getAttribute('title')){
		var oXSt = oXS.getAttribute('title').match(/[\d\.]+/g)
			,oC = $q('canvas', o)
			,hajax = isHajax();
		if(oC) oC.parentNode.removeChild(oC);
		if(oXSt && oXSt.length && !$q('canvas', o)){
			var aP = oXSt[1], aM = oXSt[2]
				,abs = Math.abs(aP - aM)
				,c = (function(aP, aM){ //writePercRound
					var aPM = Number(aP) + Number(aM);
					if(aPM ==0) return document.createElement('div');
					var c = document.createElement('canvas')
						, pi = Math.PI, r2 = 14, ell = 1-1/3.6;
					c.width = c.height = r2 *2;
					c.style.backgroundColor ='transparent';
					c.style.position ='absolute';
					c.style.left = (-r2 +12) +'px';
					c.style.top = (-r2 +1 +8) +'px';
					var q = c.getContext("2d")
						, log = Math.log(aPM)/1.6 +1;
					c.style.opacity = 0.25 + log *0.1;
					c.style.zIndex = 1;
					q.beginPath();
					q.lineWidth = log;
					q.strokeStyle ='#1b1';
					var perc = (0.5- aM/aPM)* pi
						, perc2 = (0.5+ aM/aPM)* pi;
					q.scale(1, ell);
					q.arc(r2, r2 /ell, r2 -1, perc, perc2 +2*(perc == perc2 && aP !=0)*pi, aP ==0 || aM !=0);
					q.stroke();
					q.beginPath();
					q.strokeStyle ='#a24';
					q.arc(r2, r2/ell, r2 -1, perc, perc2 +2*(perc == perc2 && aM !=0)*pi, !1);
					q.stroke();
					return c;
				})(aP, aM, (function(obj){ //getPositionCenter
					var x =0, y =0
						,w2 = Math.floor(obj.offsetWidth /2)
						,h2 = Math.floor(obj.offsetHeight /2);
					while(obj){ x += obj.offsetLeft; y += obj.offsetTop; obj = obj.offsetParent;}
					return {x: x, y: y, w2: w2, h2: h2};
				})(o))
				,oPM = $q('.minus', oP)
				,oPP = $q('.plus', oP)
				,oPPI = /postinfo-panel__item/.test(oP.parentNode.className);
			//console.log('oPM', oPM)
			if(oPM && (-aP - aM))
				oPM.style.left =(oPPI ? 46 : (abs >9 ? 32 : 26))+'px';
			if(oPPI){ //article
				oXS.style.left ='-1px';
				c.style.left = -r2 + (abs >99 ? 17 : (abs >9 ? 11 : (abs ? 7 : 3))) +'px';
				c.style.top = 5 - (hajax && 0) +'px';
			}else{ //comments
				oXS.style.left = (abs ? -1 : 7)+'px';
				oXS.style.top =0;
				c.style.left = -1 -r2 + (abs >99 ? 18 : (abs >9 ? 11 : (abs ? 7 : 8))) -(isC2 && 1) +(zen && 0) +'px';
				c.style.top = 1+ (isC2 ? -5 + zen : -3) +(zen && 0) +'px';
			}
			oXS.style.position ='relative';
			o.insertBefore(c, oXS);
			if(oPPI && abs >99)
				o.style.left ='-9px';
			oXS.style.zIndex =2;
			(function(oP){
				var ff = function(){setTimeout(function(){
					w1n.habrPercentageRing(oP)},2999)};
				oPM && oPM.addEventListener('click',ff,!1);
				oPP && oPP.addEventListener('click',ff,!1);
			})(oP)
}}}
})(document);

w1n.addEventListener('chgDom', function(ev){ //проверить блок по событию от модулей (Fx6+, Chrome,Safari)
	w1n.habrPercentageRing(ev.detail);
},!1);
