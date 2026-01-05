// ==UserScript==
// @name Rich Birds подсчет серебра
// @description Добавляет на rich-birds.com подсчет Серебра из яиц на складе и подсчет серебра в час с птиц в магазине.
// @namespace richbirdssilvercount
// @version 1.6
// @supportURL alexshiry1@gmail.com
// @grant none
// @include http://rich-birds.com/*
// @include http://rich-birds.org/*
// @downloadURL https://update.greasyfork.org/scripts/28656/Rich%20Birds%20%D0%BF%D0%BE%D0%B4%D1%81%D1%87%D0%B5%D1%82%20%D1%81%D0%B5%D1%80%D0%B5%D0%B1%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/28656/Rich%20Birds%20%D0%BF%D0%BE%D0%B4%D1%81%D1%87%D0%B5%D1%82%20%D1%81%D0%B5%D1%80%D0%B5%D0%B1%D1%80%D0%B0.meta.js
// ==/UserScript==

// После загрузки DOM 
window.addEventListener('load',function(){

	// Часть 1 для страницы Склад
	if(document.location.pathname=='/account/store'){
		allsereb=0;
		smline=document.querySelectorAll('.sm-line'); //Выборка всех блоков с кол-вом яиц на складе
		for (var i1=0;i1<smline.length;i1++){ //Проход по этим элементам
			smline[i1].childNodes.forEach(function(data){
				if(data.innerText!==undefined){ //Если найден элемент с непустым текстом внутри
					if(data.innerText.search(/([0-9]+) яиц/)!=-1){ //Если внутри текст [число] яиц
						data.innerText=data.innerText.replace(/([0-9]+) яиц/,function(m,c){ // Вычисление и добавление к тексту ([число] серебра)
							allsereb+=parseInt(c);
							return parseInt(c).toLocaleString()+' яиц ('+((parseInt(c)/100).toLocaleString())+' серебра)';
						});
					}
				}
			});
		}
		btn=document.querySelector('input[name=sbor]'); // Добавление этих элементов перед кнопкой "Собрать все"
		br=document.createElement('br'); // Создание переноса строки
		span=document.createElement('span'); // Создание текстового блока
		halfsereb=((allsereb/100)/2);
		allsobm=halfsereb+(halfsereb/10+halfsereb);
		span.innerText='С обменом всего серебра: '+parseFloat(allsobm.toFixed(2)).toLocaleString();
		btn.parentElement.prepend(br.cloneNode());
		btn.parentElement.prepend(span);
		span=span.cloneNode();
		span.innerText='Всего '+allsereb.toLocaleString()+' яиц ('+((allsereb/100).toLocaleString())+' серебра)'; // Текстовый блок содержит Общее кол-во яиц и серебра из них
		btn.parentElement.prepend(br.cloneNode());
		btn.parentElement.prepend(span);
		btn.parentElement.prepend(br.cloneNode());
		span=span.cloneNode(); // Создание еще одного текстового блока (2)
		span.innerText=halfsereb.toLocaleString()+' серебра на каждый из счетов'; // Подсчет распределения серебра 50/50 на каждый из счетов
		btn.parentElement.prepend(span); // Добавление текстового блока 2
		btn.parentElement.prepend(br.cloneNode());
	}

	// Часть 2. Для страницы Магазин
	if(document.location.pathname=='/account/birds'){
		ballsereb=0;
		cbp=0;
		cbs=0;
		mnogs=0;
		clfrrgA=document.querySelectorAll('.cl-fr-rg'); // Выборка всех блоков с информацией о птицах
		for(var i2=0;i2<clfrrgA.length;i2++){
			frtegrA=clfrrgA[i2].querySelectorAll('.fr-te-gr'); // Выборка отдельных блоков из каждого блока
			for(var ii=0;ii<frtegrA.length;ii++){
				if(frtegrA[ii].innerText.search(/Плодовитость:/)!=-1){ // Если отдельный блок является информацией о плодовитости
					mnogs=frtegrA[ii].innerText.replace(/Плодовитость: (\d+) в час/,function(a,b){return b/100;}); // Сохранить в переменную как множитель серебра
				}else{
					if(frtegrA[ii].innerText.search(/Куплено:/)!=-1){ // Если отдельный блок является информацией о Кол-ве купленных птиц
						cbp=frtegrA[ii].innerText.replace(/Куплено: (\d+) шт./,function(a,b){return b;}); // Сохранить в переменную как кол-во для множителя
					}
				}
			}
			csh=document.createElement('div'); // Создать еще один блок с информацией
			csh.classList.add('fr-te-gr');
			csh.innerHTML='Серебра в час: <font color="#000000">'+cbp*mnogs+'</font>'; // Подсчет (Кол-во * Множитель) и запись в блок
			cbs+=cbp*mnogs; // Прибавление к общему числу серебра
			clfrrgA[i2].insertBefore(csh,clfrrgA[i2].querySelector('input')); // Добавление блока перед Кнопкой "Купить"
		}
		acsh=document.createElement('center'); // Добавление блока с информацией общего серебра перед всеми птицами
		acsh.innerHTML='<div style="border-top:solid 1px gray;border-bottom:solid 1px gray;margin-top:7px;">Всего серебра в час: '+cbs+'</div>';
		clfrrgA[0].parentElement.parentElement.parentElement.insertBefore(acsh,clfrrgA[0].parentElement.parentElement);
	}

	// Дополнение для обменника
	// Автозаполнение формы на 99% обмен с счета для вывода
	if(document.location.pathname=='/account/swap'){
		var lbsa=document.querySelectorAll('.field-ars');
		var lbs=0;
		for(var i=0;i<lbsa.length;i++){
			if(lbsa[i].innerHTML.search('На вывод:')!=-1){
				lbs=lbsa[i].innerHTML.replace(/На вывод: ([\d.]+)/,function(x,a){
					if(a>100){
						return parseFloat(a)-1;
					}else{
						document.querySelectorAll('.btn_kup')[0].remove();
						return '1';
					}
				});
			}
		}
		document.getElementById('sum').value=lbs;
		document.getElementById('sum').onkeyup();
	}

	// Дополнение для Склад-Продажа яиц
	// Автопереход после сбора яиц к продаже и автопродажа яиц
	if(document.location.pathname=='/account/store'){
		if(document.location.hash!='#sell'){
			document.querySelectorAll('form')[0].setAttribute('action','#sell');
		}
	}
	if(document.location.pathname=='/account/market'){ // Автопродажа яиц
		if(document.location.hash=='#autosell'){
			document.querySelectorAll('form')[0].setAttribute('action','#');
			document.querySelectorAll('.button_0')[0].click();
		}
	}
});
if(document.location.pathname=='/account/store'){ // Быстрый переход к продаже яиц
	if(document.location.hash=='#sell'){
		document.location.href='/account/market#autosell';
	}
}