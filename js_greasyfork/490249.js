// ==UserScript==
// @name xaos.mobi
// @description xaos.mobi bot
// @author Sultan Kalimulin (semi-fixed by ekyloff)
// @version 1.8.3
// @include http://xaos.mobi/index.php?*
// @namespace https://greasyfork.org/users/1276450
// @downloadURL https://update.greasyfork.org/scripts/490249/xaosmobi.user.js
// @updateURL https://update.greasyfork.org/scripts/490249/xaosmobi.meta.js
// ==/UserScript==


if( localStorage.enable == undefined)localStorage.enable = 1; 
 
var set      = {

enable    : parseInt(localStorage.enable), 
greedMode : true, 
parseOt   : -400, 
autoParse : true, 
debug     : true,
almaz     : true
},
rand     = 1,
title    = document.title,
bodyTxt  = document.body.innerText,
// в квадратных скобочках писать текст, на который нужно кликать. ТОЛЬКО ЗДЕСЬ, в других местах кода это не работает. для приключений лучше пишите просто "5", на "бить ещё" не работает
linksArr = ["улучшить знания", "ускорить", "эпоха", "перейти в новую эпоху", "качество", "улучшить за"];

if(set.debug)window.onerror = function(mes, url, line) {
      if(!(~mes.indexOf("'cnt'")))alert('Error: ' + mes + ' at ' + url + ' on line ' + line);
}

var newDiv    = document.createElement('div');
newDiv.id     = "tooooogleee";
newDiv.style.position    = "absolute";
newDiv.style.top         = 0;
newDiv.style.right       = 0;
newDiv.style.opacity     = "0.6";
newDiv.style.padding     = "1em 0";
newDiv.style.background  = "#2c3e50";
newDiv.innerHTML= "<span style='padding:1.5em;'>"+(parseInt(localStorage.enable) ? "on" : "off")+"<span>";
newDiv.onclick = function(){ 
   localStorage.enable = (parseInt(localStorage.enable) ? 0 : 1);
   set.enable          = localStorage.enable;
   document.querySelector("#tooooogleee").innerHTML= "<span style='padding:1.5em;'>"+(parseInt(localStorage.enable) ? "on" : "off")+"<span>";
};
document.body.appendChild(newDiv);


function getLinkByName(arr) {
   function linkTester(name) {
      return ~link.innerText.toLowerCase().indexOf(name.toLowerCase());
   }
   for (i = 0; link = document.links[i]; i++) {
      if (arr.some(linkTester)) {
         return link.href;
      }
   }
   return null;
}

function isNumeric(n) {
     return !isNaN(parseFloat(n)) && isFinite(n);
}

function getRandom(min, max){
  return parseInt(Math.random() * (max - min) + min);
}

setTimeout( function() {
	if(set.enable){
		if(~bodyTxt.indexOf('asd')){
			alert("asd");}
        else if(~bodyTxt.indexOf('asd')){
			//alert("Нет свободного места в рюкзаке.");
			if(lnk = getLinkByName(["asd"]))location.replace(lnk);}
        else if(~bodyTxt.indexOf('asd')){
			alert("asdqqq");
			if(lnk = getLinkByName(["asd"]))location.replace(lnk);}
        //else if(document.querySelector("body > div.box > div:nth-child(1) > table > tbody > tr > td:nth-child(2)")){
			//var razsTxt = document.querySelector("body > div.box > div:nth-child(1) > table > tbody > tr > td:nth-child(2)").innerText;
			//alert("смс от клана: " + razsTxt);}
        else if(document.querySelector("asd")){
			var razsTxt = document.querySelector("asd").innerText;
			//alert("смс: \n" + razsTxt);
			if(~razsTxt.indexOf("asd"))if(lnk = getLinkByName(["позже"]))location.replace(lnk);
    }else{
		  //новая вещь
			if(document.querySelector("body > div.box > div.jour") && set.autoParse){
				var selector = 'div.jour > div > table span[style="color:red"] , div.jour > div > table span[style="color:green"]',
				cnt = document.querySelector(selector);

				if((cnt == null) || (cnt == undefined)){
					if(lnk = getLinkByName(["Атаковать", "В атаку", "ещё раз", "скрыть"]))location.replace(lnk);
				}else if(isNaN(cnt.innerText)){
					var elements = document.querySelectorAll(selector);
					for (var i=0; i<elements.length; i++) {
						if(isNumeric(elements[i].innerText))cnt = elements[i].innerText;
					}
				}

				if(!isNumeric(cnt))cnt = cnt.innerText

				if(parseInt(cnt) > 1){
					if(lnk = getLinkByName(["надеть"]))location.replace(lnk);
				}else if(set.greedMode && (parseInt(cnt) < 0) && (parseInt(cnt) > set.parseOt) ){
					if(lnk = getLinkByName(["скрыть"]))location.replace(lnk);
				}else if(parseInt(cnt) < 0){
					if(lnk = getLinkByName(["Разобрать"]))location.replace(lnk);//, "скрыть"
				}else{
					if(lnk = getLinkByName(["ещё раз", "В атаку"]))location.replace(lnk);
				}
			//новая вещь розобрана :)
			}else{
				switch (title.toLowerCase()) {
					case 'наследие хаоса':
						if(lnk = getLinkByName(["забрать награду"]))location.replace(lnk);
						break;

					case 'шахты':
						if(lnk = getLinkByName(["отправиться на работу", "удар киркой", "закончить работу"]))location.replace(lnk);
						break;

					case 'задания':
						if(lnk = getLinkByName(["завершить задание"]))location.replace(lnk);
						break;

					case 'колизей':
						if(lnk = getLinkByName(["бой через", "бросить вызов всем", "ожидание начала боя", "найти врага" ]))location.replace(lnk);
						break;

					case 'приключения':
						if(lnk = getLinkByName(["Отправиться на задание"]))location.replace(lnk);
						if(lnk = getLinkByName(linksArr))location.replace(lnk);
						break;

					case 'завершение битвы':
						if(lnk = getLinkByName(["Завершить бой"]))location.replace(lnk);
						break;
						
					case 'дуэль':
						if(lnk = getLinkByName(["бой через"]))location.replace(lnk);
						if(lnk = getLinkByName(linksArr))location.replace(lnk);
						break;
						
					case 'золотой рудник':
						if(lnk = getLinkByName(["удар киркой"]))location.replace(lnk);
						break;
						
					//case 'разобрать предмет':
						//Разобрать предмет ( по умному )
						if((~bodyTxt.indexOf('В вашей экипировке нет подходящего предмета')) || (set.almaz)){
						   if(lnk = getLinkByName(["разобрать на кристаллы"]))location.replace(lnk);
						 }else{
						   if(lnk = getLinkByName(["улучшить экипировку"]))location.replace(lnk);
						 }
						break;
						
					case 'призрачный разлом':
						//case 'поединок':
						var vragPercentLife = parseFloat(document.querySelector("body > div.box > div:nth-child(5) > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > div > div").style.width);
							mePercentLife   = parseFloat(document.querySelector("body > div.box > div:nth-child(9) > table > tbody > tr > td:nth-child(2) > div > div > div").style.width);
						
						var vrag = parseFloat(document.querySelector("body > div.box > div:nth-child(5) > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(2)").innerText),
							me   = parseFloat(document.querySelector("body > div.box > div:nth-child(9) > table > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td:nth-child(2)").innerText)
						
						var one  =  [
								parseFloat(document.querySelector("body > div.box > div:nth-child(7) > center > a:nth-child(1) > div:nth-child(1) > div > div > div:nth-child(2)").innerText),
								parseFloat(document.querySelector("body > div.box > div:nth-child(7) > center > a:nth-child(1) > div:nth-child(3) > div > div:nth-child(2)").innerText),
								],
							two  =  [
								parseFloat(document.querySelector("body > div.box > div:nth-child(7) > center > a:nth-child(2) > div:nth-child(1) > div > div > div:nth-child(2)").innerText),
								parseFloat(document.querySelector("body > div.box > div:nth-child(7) > center > a:nth-child(2) > div:nth-child(3) > div > div:nth-child(2)").innerText),
								],
							tree =  [
								parseFloat(document.querySelector("body > div.box > div:nth-child(7) > center > a:nth-child(3) > div:nth-child(1) > div > div > div:nth-child(2)").innerText),
								parseFloat(document.querySelector("body > div.box > div:nth-child(7) > center > a:nth-child(3) > div:nth-child(3) > div > div:nth-child(2)").innerText),
								];

						var arr = [
									parseFloat(document.querySelector("body > div.box > div:nth-child(7) > center > a:nth-child(1) > div:nth-child(2)").innerText),
									parseFloat(document.querySelector("body > div.box > div:nth-child(7) > center > a:nth-child(2) > div:nth-child(2)").innerText),
									parseFloat(document.querySelector("body > div.box > div:nth-child(7) > center > a:nth-child(3) > div:nth-child(2)").innerText)
								];

						var percentArm = [
											parseInt(one[0] * 100 / one[1]),
											parseInt(two[0] * 100 / two[1]),
											parseInt(tree[0] * 100 / tree[1])
										]				
						var r = percentArm.some(
							function(element, index, array) {
								console.log(element, index, array);
								return (element > 70);
						});


						var percent = (vrag * 100 / me);

						if ( (percent < 100 || (percent > 200) || r) && (( mePercentLife == 100) || (vragPercentLife == 100))){
							if(lnk = getLinkByName(["другой противник"]))location.replace(lnk);
						}else{
							if(mePercentLife == 100){
								var id = getRandom(1, 3);
							}else if(mePercentLife - vragPercentLife > 13){
								var id = arr.indexOf(Math.min.apply(0, arr))+1;
							}else{
								var id = arr.indexOf(Math.max.apply(0, arr))+1;
							}
							console.log(arr[id-1]);

							location.replace(document.querySelector("body > div.box > div:nth-child(7) > center > a:nth-child("+ id +")").getAttribute("href"));
						}
						break;
						
					case 'выживание':
						if(lnk = getLinkByName(["найти врага"]))location.replace(lnk);

					default:
						if(lnk = getLinkByName(linksArr))location.replace(lnk);
				}
			} 
		}
	}
}, rand );