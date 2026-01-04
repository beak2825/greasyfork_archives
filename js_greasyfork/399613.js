// ==UserScript==
// @name xaos.mobi
// @description  botclick
// @author Ramiz
// @version v.0.1
// @include http://xaos.mobi/index.php?*
// @namespace vk.com/shamsi13
// @downloadURL https://update.greasyfork.org/scripts/399613/xaosmobi.user.js
// @updateURL https://update.greasyfork.org/scripts/399613/xaosmobi.meta.js
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
linksArr = [" B aтaкy ", " B aтaкy ", "Ещё 60 боёв", "бить eщё", "ещё раз", " Другой противник", "продолжить", "aтaкoвaть", "окончить путешествие", "Улучшить", "Отправиться"," Атаковать", "Получить", "Закончить изучение"];

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
newDiv.innerHTML= "<span style='padding:1.5em;'>"+(parseInt(localStorage.enable) ? "Работает" : "Включить")+"<span>";
newDiv.onclick = function(){ 
   localStorage.enable = (parseInt(localStorage.enable) ? 0 : 1);
   set.enable          = localStorage.enable;
   document.querySelector("#tooooogleee").innerHTML= "<span style='padding:1.5em;'>"+(parseInt(localStorage.enable) ? "Работает" : "Включить")+"<span>";
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
		if(~bodyTxt.indexOf('У вас не хватает энергии')){
			if(lnk = getLinkByName(["Энергия +250"]))location.replace(lnk);
      if(lnk = getLinkByName(["Энергия +50"]))location.replace(lnk);
		}else if(~bodyTxt.indexOf('Одно из заданий выполнено')){
			alert("Одно из заданий выполнено!");
			if(lnk = getLinkByName(["получить награду"]))location.replace(lnk);
		}else if(document.querySelector("body > div.box > div:nth-child(1) > table > tbody > tr > td:nth-child(2)")){
			var razsTxt = document.querySelector("body > div.box > div:nth-child(1) > table > tbody > tr > td:nth-child(2)").innerText;
			alert("смс от клана: " + razsTxt);
		}else if(document.querySelector("body > div.box > div:nth-child(1) > table > tbody > tr > td:nth-child(2)")){
			var razsTxt = document.querySelector("body > div.box > div:nth-child(1) > table > tbody > tr > td:nth-child(2)").innerText;
			alert("смс: \n" + razsTxt);
			if(~razsTxt.indexOf("Разблокирован!"))if(lnk = getLinkByName(["позже"]))location.replace(lnk);
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

					case 'путешествие':
						if(lnk = getLinkByName(["Отправиться"]))location.replace(lnk);
						if(lnk = getLinkByName(linksArr))location.replace(lnk);
						break;

					case 'завершение битвы':
						if(lnk = getLinkByName(["завершить бой"]))location.replace(lnk);
						break;
						
					case 'дуэль':
						if(lnk = getLinkByName(["бой через"]))location.replace(lnk);
						if(lnk = getLinkByName(linksArr))location.replace(lnk);
						break;
						
					case 'золотой рудник':
						if(lnk = getLinkByName(["удар киркой"]))location.replace(lnk);
						break;
						
					case 'разобрать предмет':
						//Разобрать предмет ( по умному )
						   if(lnk = getLinkByName(["Разобрать"]))location.replace(lnk);
						   if(lnk = getLinkByName(["Улучшить"]))location.replace(lnk);
						break;
            
          case 'Специализация':
						if(lnk = getLinkByName(["Закончить изучение"]))location.replace(lnk);
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
}, rand );