// ==UserScript==
// @name        	Informator
// @namespace   	http://www.wykop.pl/ludzie/Deykun
// @description 	Dodatkowe informacje o zgłoszeniach w panelu naruszeń portalu Wykop.pl.
// @author      	Deykun
// @icon        	http://x3.cdn03.imgwykop.pl/c3201142/comment_bWVFKhjLOfg5B1xNe08BMxJTQF4qMS8V.gif
// @include	    	htt*wykop.pl/naruszenia/*
// @version     	3.51
// @grant       	none
// @run-at			document-end
//
// @downloadURL https://update.greasyfork.org/scripts/1974/Informator.user.js
// @updateURL https://update.greasyfork.org/scripts/1974/Informator.meta.js
// ==/UserScript==

$(document).ready(function() {
	var wersjainformatora = '3.50';
	console.info('Informator '+wersjainformatora);
	// Style CSS - kolory można podmienić na własne
	var dziennynocny = $('.rbl-block').css('background-color');

	/* Matowa paleta kolorów */
	var kolory = ['#8aa380', '#b3868f', '#d4cbad', '#62a2b1', '#8cb1ba', '#717171'];

	/* Kontrastowa paleta kolorów */
	if (localStorage.getItem('informator.lo-o(2)') === '1') {kolory = ['#54a145', '#bb4751', '#c7ca85', '#4da0c5', '#8cb1ba', '#717171'];}

	// Jeśli niżej własne kolory i usuniesz "//" przed "kolory = " dodatek użyje Twojej palety
	// kolory = ['#prawidlowe', '#nieprawidlowe', '#zmieniony', '#konsultacji', '#nowe', '#rozpatrywane'];

	if (dziennynocny !== 'rgb(255, 255, 255)'){kolory[5] = '#717171';}
	$('head').append('<style>\
		@import https://fonts.googleapis.com/css?family=Rubik:300,500;\
		*{box-sizing:border-box}\
		#informator *{font-family:\'Rubik\',Arial,sans-serif;text-align:center;font-weight:300;padding:0;margin:0}\
		#informator h2,#informator h3,#informator strong,#informator .bold{font-weight:500}\
		#informator h2{font-size:2.5em;margin:20px auto}\
		#informator h3{font-size:1.3em;margin-top:5px auto}\
		#informator p{margin-bottom:5px}\
		.prawidlowe,.infMod{background-color:#8aa380}\
		.nieprawidlowe,.infUst{background-color:#b3868f}\
		.zmieniony,.infPow{background-color:#d4cbad}\
		.konsultacji{background-color:#62a2b1}\
		.nowe,.infNag{background-color:#8cb1ba}\
		.rozpatrywane{background-color:#383838}\
		.tlo{background-color:#fff}\
		.infNag,.infPow{color:#383838}\
		.infMod,.infUst,.infUst a,.infUst a:hover{color:#fff}\
		#informator .infUst span{margin-left:10px;cursor:pointer}\
		#informator > div{padding:5px 25px;display:flex;flex-flow:row wrap;justify-content:space-between}\
		#informator > .infNag > div{align-self:flex-end}\
		#informator > div > div{flex:1 1 250px;margin:15px 0}\
		#informator > div > h2{flex:1 1 100%}\
		#informator > div > p{flex:1 1 100%}\
		#informator table,#informator tr,#informator tr:hover,#informator td{background:none;border:none}\
		#informator table{margin:0 auto;max-width:360px}\
		#informator td{padding:2px 5px;vertical-align:middle}\
		#informator td:last-child{text-align:left;width:42%}\
		#informator td:first-child{text-align:right;width:42%}\
		#informator .white{position:relative;background-color:#fff;border-color:#fff;width:2em;height:2em;margin:0 auto;padding:3px;border-radius:5px}\
		#informator .white .infoBox{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}\
		.infoBox{width:1.2em;border-radius:3px}\
		.infoBar,.infoBox{display:inline-block;vertical-align:middle;height:1.2em}\
		.infoLeft{border-top-left-radius:3px;border-bottom-left-radius:3px}\
		.infoRigth{border-top-right-radius:3px;border-bottom-right-radius:3px}\
		[tooltip]:before{content:attr(tooltip);position:absolute;opacity:0;transition:all .2s ease;padding:10px}\
		[tooltip]:hover:before{opacity:1;margin-top:50px}\
		[tooltip]:not([tooltip-persistent]):before{pointer-events:none}\
		\
		#informator .divChart{margin:0 auto;margin-bottom:10px;background-color:#fff;height:190px;width:190px;padding:5px;border-radius:10px;color:#383838}\
		#informator .chartBase{position:relative;height:180px;width:180px;border-radius:50%;cursor:help}\
		#informator .infPow .chartBase,#informator #infSuma .chartBase{cursor:pointer}\
		#informator .chartPie{position:absolute;height:100%;width:100%;border-radius:50%}\
		#informator .charPieSmall{position:absolute;height:90%;width:90%;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%)}\
		#informator .clipPie{position:absolute;height:100%;width:100%;clip:rect(0,90px,180px,0)}\
		#informator .chartCenter{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:50%;width:50%;border-radius:50%;background-color:rgba(255,255,255,0.8);z-index:1000}\
		#informator .chartCenter span{position:absolute;padding:0;margin:0;top:55%;left:50%;transform:translate(-50%,-50%);text-align:center}\
		#informator .chartBase p{font-size:80%;line-height:1.2em}\
		#informator .chartBase .detalils{position:absolute;width:100%;height:100%;z-index:666;opacity:0;text-align:center}\
		#informator .detalils span{font-size:80%;position:absolute}\
		#informator .detalils .leftChart{left:0}\
		#informator .detalils .rightChart{right:0}\
		#informator .detalils .topChart{top:0}\
		#informator .detalils .bottomChart{bottom:0}\
		#informator .chartBase:hover .detalils{opacity:1;transition:1s}\
		\
		.prawidlowe, .infMod {background-color: '+kolory[0]+';}\
		.nieprawidlowe, .infUst {background-color: '+kolory[1]+';}\
		.zmieniony, .infPow {background-color: '+kolory[2]+';}\
		.konsultacji {background-color: '+kolory[3]+';}\
		.nowe, .infNag {background-color: '+kolory[4]+';}\
		.rozpatrywane {background-color: '+kolory[5]+';}\
		.tlo {background-color: #fff;}\
		.infoBox { width: 1.2em; border-radius: 3px;}\
		.infoBar, .infoBox { display:inline-block;	vertical-align:middle; height: 1.2em;}\
		.infoLeft { border-top-left-radius: 3px; border-bottom-left-radius: 3px;}\
		.infoRigth { border-top-right-radius: 3px; border-bottom-right-radius: 3px;}\
		[tooltip]:before { content: attr(tooltip);\
			position: absolute;\
			opacity: 0;\
			background-color: '+dziennynocny+';\
			transition: all 0.25s ease;\
			padding: 10px;}\
		[tooltip]:hover:before { opacity: 1; margin-top: 50px; z-index:100;}\
		[tooltip]:not([tooltip-persistent]):before { pointer-events: none;}\
		</style>');

	/* Strona z naruszeniami */
	if (document.location.pathname.match('/naruszenia/moje')){
		// Liczba zgłoszeń z określonymi ocenami:
		var prawidlowe, dprawidlowe, nieprawidlowe, dnieprawidlowe, zmieniony, dzmieniony, konsultacja, dkonsultacja, nowe, dnowe, rozpatrywane, i;
		prawidlowe = nieprawidlowe = zmieniony = konsultacja = nowe = rozpatrywane = 0;
		dprawidlowe = dnieprawidlowe = dzmieniony = dkonsultacja = dnowe = 0;

		// Ukrywanie miniaturek w panelu zgłoszeń
		if (localStorage.getItem('informator.lo-o(1)') === '1') {$('div[class="media-content m-reset-float"]').remove();}

		/*
	    	Dane localStorage:
	    	lm - lista znanych moderatorów
			lp - lista znanych powodów

			los - lista tagów ostatnio sprawdzonych
			lds - lista tagów do sprawdzenia
			nlos, nlds - listy wyżej do zapisania
		*/

		var lm = [], lp = [], los = [], lds = [], nlos = [], nlds = [];

		for(i = 0 ; localStorage.getItem('informator.lm-m('+i+')') ; i++){
			lm[i] = localStorage.getItem('informator.lm-m('+i+')');}

		for(i = 0 ; localStorage.getItem('informator.lp-p('+i+')') ; i++){
			lp[i] = localStorage.getItem('informator.lp-p('+i+')');}

		for(i = 0 ; localStorage.getItem('informator.los-t('+i+')') ; i++){
			los[i] = localStorage.getItem('informator.los-t('+i+')');}

		for(i = 0 ; localStorage.getItem('informator.lds-t('+i+')') ; i++){
			lds[i] = localStorage.getItem('informator.lds-t('+i+')');}

		if (lm.length != ''){ console.log('Moderatorzy ('+lm.length+'): '+lm);}
		if (lp.length != ''){ console.log('Powody ('+lp.length+'): '+lp);}
		if (los.length != ''){ console.log('Ostatnio rozpatrzone zgłoszenia ('+los.length+'): '+los);}
		if (lds.length != ''){ console.log('Zgłoszenia wymagające ponownego rozpatrzenia ('+lds.length+'): '+lds);}
		console.log(' ');

		// Funkcja zajmująca się rozpatrzonymi zgłoszeniami
		function analizuj(tag, werdykt, moderator, powod){
			switch (werdykt) {
				case 'Prawidłowe': prawidlowe++; break;
				case 'Nieprawidłowe': nieprawidlowe++; break;
				case 'Zmieniony powód': zmieniony++; break;
				case 'W konsultacji': konsultacja++; break;}

			if (los.indexOf(tag) === -1 ) {
				//Nowe rozpatrzone zgłoszenie
				zapisz(werdykt, moderator, powod);
				zmiana(werdykt);
			} else if (lds.indexOf(tag) !== -1 && werdykt !== 'W konsultacji'){
				//Zgłoszenie rozpatrzone ponownie po trafieniu do konsultacji
				zapisz(werdykt, moderator, powod);
				zmiana(werdykt);
			}

			nlos.push(tag);
			if (werdykt === 'W konsultacji') {nlds.push(tag);}
		}

		// Funkcja zapisywania zgłoszenia w pamięci
		function zapisz(werdykt, moderator, powod) {
			if (lm.indexOf(moderator) === -1){
				//Nieznany moderator
				console.info('Dodano moderatora '+moderator+'.');
				localStorage.setItem('informator.lm-m('+lm.length+')', moderator);
				lm[lm.length] = moderator;
			}
			if (lp.indexOf(powod) === -1) {
				//Nieznany powod
				console.info('Dodano powód "'+powod+'".');
				localStorage.setItem('informator.lp-p('+lp.length+')', powod);
				lp[lp.length] = powod;
			}

			//Zapis
			var werdykt = werdykt.toLowerCase().charAt(0);
			if (werdykt === 'w'){werdykt = 'k';}

			var zapis = localStorage.getItem('informator.lo-'+werdykt) || 0; zapis++;
			localStorage.setItem('informator.lo-'+werdykt, zapis);
			zapis = localStorage.getItem('informator.lm-m('+lm.indexOf(moderator)+')-'+werdykt) || 0; zapis++;
			localStorage.setItem('informator.lm-m('+lm.indexOf(moderator)+')-'+werdykt, zapis);
			zapis = localStorage.getItem('informator.lp-p('+lp.indexOf(powod)+')-'+werdykt) || 0; zapis++;
			localStorage.setItem('informator.lp-p('+lp.indexOf(powod)+')-'+werdykt, zapis);
			zapis = localStorage.getItem('informator.lm-m('+lm.indexOf(moderator)+')-p('+lp.indexOf(powod)+')-'+werdykt) || 0; zapis++;
			localStorage.setItem('informator.lm-m('+lm.indexOf(moderator)+')-p('+lp.indexOf(powod)+')-'+werdykt, zapis);
		}

		function zmiana(werdykt){
			switch (werdykt) {
				case 'Prawidłowe': dprawidlowe++; break;
				case 'Nieprawidłowe': dnieprawidlowe++; break;
				case 'Zmieniony powód': dzmieniony++; break;
				case 'W konsultacji': dkonsultacja++; break;
				case 'Nowe': dnowe++; break;
			}
		}

		/*
			Pobranie listy zgłoszeń z tabeli:
			t - tag,
			w - werdykt,
			m - moderator
			p - powod
		*/

	    var t, w, m, p;
	    $('#violationsList > tbody > tr').each(
	      function() {
	        t = $(this).find('td:eq(2) > p').text().split(':').reverse().pop();
	        w = $(this).find('td:eq(3) > strong').text();
			p = $(this).find('td:eq(2) > p > span').text();

	        if (w === 'Prawidłowe' || w === 'Nieprawidłowe' || w === 'Zmieniony powód' || w === 'W konsultacji'){
				//Rozpatrzone zgłoszenia
				m = $(this).find('td:eq(3) > span').text().split('przez').pop().trim();
				console.log('#'+t+' rozpatrzone przez moderatora '+m+': '+w+' (powód zgłoszenia "'+p+'").');
				analizuj(t,w,m,p);
	        } else if (w === 'Nowe' || w === ''){
				//Nierozpatrzone zgłoszenia
				switch (w) {
					case 'Nowe':
						nowe++;
						var test = (lds.indexOf(t) !== -1);
						if (lds.indexOf(t) === -1){ zmiana(w);}
						break;
					case '': rozpatrywane++; break;}
				nlds.push(t);
				console.log('#'+t+' oczekuje na rozpatrzenie (powód zgłoszenia "'+p+'").');
	        }
	    });


		/* Aktualizacja list sprawdzonych i do sprawdzenia*/
		for (i = 0 ; i <= nlos.length ; i++) {
			if (i !== nlos.length){localStorage.setItem('informator.los-t('+i+')', nlos[i]);
			} else {localStorage.removeItem('informator.los-t('+i+')');}}
		for (i = 0 ; i <= nlds.length ; i++) {
			if (i !== nlds.length){localStorage.setItem('informator.lds-t('+i+')', nlds[i]);
			} else {localStorage.removeItem('informator.lds-t('+i+')');}}

		/* Podanie podsumowania w konsoli */
		console.log(' ');
		console.info('Prawidłowe : '+prawidlowe+' | Nieprawidłowe : '+nieprawidlowe+' | Zmieniony powód : '+zmieniony+' | W konsultacji : '+konsultacja+' | Nowe : '+nowe+' | Rozpatrywane : '+rozpatrywane);

		/* Panel statystyk na pasku */
		if (prawidlowe === 0 && nieprawidlowe === 0 && zmieniony === 0 && konsultacja === 0 && nowe === 0 && rozpatrywane === 0){
			$('.bspace > ul:nth-child(3) > li:nth-child(3)').after('<li><a href="http://www.wykop.pl/naruszenia/informator">Statystyki</a></liv>');
		} else {
			var przycisk = '<li><a href="http://www.wykop.pl/naruszenia/informator">';
			if (prawidlowe !== 0 || nieprawidlowe !== 0){
				var suma = prawidlowe + nieprawidlowe;
				if(dprawidlowe !== 0){przycisk += '(+'+dprawidlowe+') ';}
				przycisk += prawidlowe+' <div class="infoBar infoLeft prawidlowe" tooltip="Prawidłowe zgłoszenia ('+prawidlowe+' - '+Math.round((prawidlowe/suma)*100)+'%)" style="width:'+(5+Math.round((prawidlowe/suma)*100))+'px"></div><div class="infoBar infoRigth nieprawidlowe" tooltip="Nieprawidłowe zgłoszenia ('+nieprawidlowe+' - '+Math.round((nieprawidlowe/suma)*100)+'%)" style="width:'+(5+Math.round((nieprawidlowe/suma)*100))+'px"></div> '+nieprawidlowe;
				if(dnieprawidlowe !== 0){przycisk += ' (+'+dnieprawidlowe+')';}}
			if (zmieniony !== 0){
				przycisk += ' <div class="infoBox zmieniony" tooltip="Zgłoszenia w których powód został zmieniony ('+zmieniony+')"></div> '+zmieniony;
				if(dzmieniony !== 0){przycisk += ' (+'+dzmieniony+')';}}
			if (konsultacja !== 0){
				przycisk += ' <div class="infoBox konsultacji" tooltip="Zgłoszenia które zostały przekazane do konsultacji ('+konsultacja+')"></div> '+konsultacja;
				if(dkonsultacja !== 0){przycisk += ' (+'+dkonsultacja+')';}}
			if (nowe !== 0){
				przycisk += ' <div class="infoBox nowe" tooltip="Zgłoszenie czekające na rozpatrzenie ('+nowe+')"></div> '+nowe;
				if(dnowe !== 0){przycisk += ' (+'+dnowe+')';}}
			if (rozpatrywane !== 0){
				przycisk += ' <div class="infoBox rozpatrywane" tooltip="Zgłoszenia które w tym momencie przegląda moderator ('+rozpatrywane+')"></div> '+rozpatrywane;}
			przycisk += '</a></li>';
			$('.bspace > ul:last-child').append(przycisk);}
		}

	/* Strona wyświetlająca szczegółowe statystyki */
	else if (document.location.pathname.match('/naruszenia/informator')){
		$('.bspace > ul:last-child').append('<li class="active"><a href="http://www.wykop.pl/naruszenia/informator">Informator</a></liv>');
		var infkomunikat = 'Witaj w zakładce ustawień dodatku Informator!</p><p>Jeśli uważasz dodatek za użyteczny i wart polecenia pamiętaj, że zawsze <strong>możesz go ocenić</strong> <a href="http://www.wykop.pl/dodatki/pokaz/409/">tutaj</a>. :)';
		var panelmoderatorow = '', panelpowodow = '', panelustawien = '', panelustawienmod = '', i;
		var lh = '', lhls = [];

		/* Pobieranie danych liczbowych do wykresu */
		function informatorGetLS(indeks){
			var output = [];
			output[0] = Number(localStorage.getItem('informator.'+indeks+'-p') || 0);
			output[1] = Number(localStorage.getItem('informator.'+indeks+'-z') || 0);
			output[2] = Number(localStorage.getItem('informator.'+indeks+'-k') || 0);
			output[3] = Number(localStorage.getItem('informator.'+indeks+'-n') || 0);
			return output;}

		/* Rysowanie wykresu */
		function informatorPieChart(prawidlowe, zmieniony, konsultacja, nieprawidlowe){
			var suma = prawidlowe+zmieniony+konsultacja+nieprawidlowe;
			var deg = 0, charArea = 0, procent = '';
			var colorClass = ['prawidlowe', 'zmieniony ', 'konsultacji ', 'nieprawidlowe '];
			var html = '';
			if (suma !== 0){
				html = '<div class="divChart"><div class="chartBase"><div class="info">';
				for (var i = 0; i < arguments.length ; i++){
					if(arguments[i] === 0){continue;}

					charArea = Math.round((arguments[i]/suma)*360);
					if(charArea < 120){
						html += '<div class="clipPie" style="transform: rotate('+deg+'deg);"><div class="chartPie clipPie" style="transform: rotate('+(charArea - 180)+'deg);"><div class="charPieSmall '+colorClass[i]+'"></div></div></div>';
						deg += charArea;
						charArea = 0;
					}
					if(charArea > 180){
						html += '<div class="clipPie" style="transform: rotate('+deg+'deg);"><div class="chartPie clipPie '+colorClass[i]+'" style="transform: rotate(0deg);"></div></div><div class="clipPie" style="transform: rotate('+(deg+179)+'deg);"><div class="chartPie clipPie '+colorClass[i]+'" style="transform: rotate(-178deg);"></div></div>';
						deg += 180;
						charArea -= 180;
						}
					if(charArea > 0){
					html += '<div class="clipPie" style="transform: rotate('+deg+'deg);"><div class="chartPie clipPie '+colorClass[i]+'" style="transform: rotate('+(charArea - 180)+'deg);"></div></div>';
				deg += charArea;}}


				if (prawidlowe !== 0){procent = '<h3>'+(parseFloat(((prawidlowe)/suma)*100).toFixed(1))+'%</h3><p>prawidłowych z <strong>'+suma+'</strong></p>';
				} else if (zmieniony !== 0 || konsultacja !== 0){procent = '<h3>'+(parseFloat(((zmieniony+konsultacja)/suma)*100).toFixed(1))+'%</h3><p>uzasadnionych z <strong>'+suma+'</strong></p>';
				} else {procent = '<h3>100.0%</h3><p>nieprawidłowych z <strong>'+suma+'</strong></p>';}

				html += '<div class="chartCenter"><span>'+procent+'</span></div></div><div class="detalils"><span class="topChart leftChart"><div class="infoBox prawidlowe"></div> '+prawidlowe+'</span><span class="topChart rightChart">'+nieprawidlowe+' <div class="infoBox nieprawidlowe"></div></span><span class="bottomChart leftChart"><div class="infoBox zmieniony"></div> '+zmieniony+'</span><span class="bottomChart rightChart">'+konsultacja+' <div class="infoBox konsultacji"></div></span></div></div></div>';
			}

			var output = [html,suma];
			return output;
		}

		//Sortowanie wykresów
		function informatorSort(a,b){
			var zamiana; do {
				zamiana = false;
				for (i = 0 ; i < a.length-1 ; i++) {
					if (a[i] < a[i+1]) {
						var temp = a[i];
						a[i] = a[i+1];
						a[i+1] = temp;

						temp = b[i];
						b[i] = b[i+1];
						b[i+1] = temp;
						zamiana = true;}}
			} while (zamiana);}

		/* Rekacja na wybór powodu */
		function informatorPowody(){
			var id = this.id;
			var panelmoderatorowdetale = '';
			if (id === ''){panelmoderatorowdetale = panelmoderatorow;
			} else {
			id = Number(id.split('_').pop()); //id powodu
			var nazwapowod = localStorage.getItem('informator.lp-p('+id+')');

			/* Pobieranie danych do wykresu moderatorów */
			var sorta = [], sortb = [];
			for(var i = 0 ; localStorage.getItem('informator.lm-m('+i+')') ; i++){
				if (localStorage.getItem('informator.lm-m('+i+')-o(1)') !== '1'){
					lh = localStorage.getItem('informator.lm-m('+i+')');
					lhls = informatorGetLS('lm-m('+i+')-p('+id+')');
					sorta[i] = informatorPieChart(lhls[0],lhls[1],lhls[2],lhls[3])[1];
					if (sorta[i] !== 0) { sortb[i] = '<div>'+informatorPieChart(lhls[0],lhls[1],lhls[2],lhls[3])[0]+'<h3>'+lh+'</h3></div>';}
					else {sortb[i] = '';}}
				else {sorta[i] = 0; sortb[i] = '';}}

			/* Wykres sumaryczny */
			lhls = informatorGetLS('lp-p('+id+')');
			panelmoderatorowdetale += '<p>Statystyki dla powodu "'+nazwapowod+'".<p><div>'+informatorPieChart(lhls[0],lhls[1],lhls[2],lhls[3])[0]+'<h3>Razem</h3></div>';
			informatorSort(sorta,sortb);	for(var i = 0 ; i < sorta.length ; i++){panelmoderatorowdetale += sortb[i];}}

			var dtime = 400;
			$('.infMod').slideUp( dtime, function() { $('.infMod').empty().append('<h2>Moderatorzy</h2>'+panelmoderatorowdetale).slideDown((dtime/2));});}

		/* Rekacja panelu ustawień */
		function informatorUstawienia(){
			var id = this.id;
			if (id == 'ustMin'){
				var temp = localStorage.getItem('informator.lo-o(1)') || 0;
				if (temp === '1') {
					temp = 0; var check = '✗ Ukryj miniaturki znalezisk w panelu.';
				} else {
					temp = 1; var check = '✔ Miniaturki znalezisk są ukrywane w panelu.';}
				localStorage.setItem('informator.lo-o(1)', temp);
				$('#ustMin').empty().append(check);
			} else if (id == 'ustKont'){
				var temp = localStorage.getItem('informator.lo-o(2)') || 0;
				if (temp === '1') {
					temp = 0; var check = 'Większy kontrast kolorów dodatku.';
					$('.prawidlowe, .infMod').css('background-color', '#8aa380');
					$('.nieprawidlowe, .infUst').css('background-color', '#b3868f');
					$('.zmieniony, .infPow').css('background-color', '#d4cbad');
					$('.konsultacji').css('background-color', '#62a2b1');
					$('.nowe, .infNag').css('background-color', '#8cb1ba');
				} else {
					temp = 1; var check = 'Mniejszy kontrast kolorów dodatku.';
					$('.prawidlowe, .infMod').css('background-color', '#6aa25d');
					$('.nieprawidlowe, .infUst').css('background-color', '#b8606a');
					$('.zmieniony, .infPow').css('background-color', '#c7ca85');
					$('.konsultacji').css('background-color', '#4da0c5');
					$('.nowe, .infNag').css('background-color', '#8cb1ba');}
				localStorage.setItem('informator.lo-o(2)', temp);
				$('#ustKont').empty().append(check);
			} else {
				id = Number(id.split('_').pop()); //id moderatora
				var temp = localStorage.getItem('informator.lm-m('+id+')-o(1)');
				if (temp === '1'){
					temp = 0; var check = localStorage.getItem('informator.lm-m('+id+')')+' ✔ ';
				} else {
					temp = 1; var check = localStorage.getItem('informator.lm-m('+id+')')+' ✗ ';}}
			localStorage.setItem('informator.lm-m('+id+')-o(1)', temp);
			$('#infoIDM_'+id).empty().append(check);}


				// kolory = ['#prawidlowe', '#nieprawidlowe', '#zmieniony', '#konsultacji', '#nowe', '#rozpatrywane'];


		/* Pobieranie danych dla moderatorów */
		var sorta = [], sortb = [];
		for(i = 0 ; localStorage.getItem('informator.lm-m('+i+')') ; i++){
			if (localStorage.getItem('informator.lm-m('+i+')-o(1)') !== '1'){
				lh = localStorage.getItem('informator.lm-m('+i+')');
				lhls = informatorGetLS('lm-m('+i+')');
				sorta[i] = informatorPieChart(lhls[0],lhls[1],lhls[2],lhls[3])[1];
				sortb[i] = '<div>'+informatorPieChart(lhls[0],lhls[1],lhls[2],lhls[3])[0]+'<h3>'+lh+'</h3></div>';}
			else {sorta[i] = 0; sortb[i] = '';} }

		informatorSort(sorta,sortb);	for(var i = 0 ; i < sorta.length ; i++){panelmoderatorow += sortb[i];}

		/* Pobieranie danych dla powodów */
		sorta = []; sortb = [];
		for(i = 0 ; localStorage.getItem('informator.lp-p('+i+')') ; i++){
			lh = localStorage.getItem('informator.lp-p('+i+')');
			lhls = informatorGetLS('lp-p('+i+')');
			sorta[i] = informatorPieChart(lhls[0],lhls[1],lhls[2],lhls[3])[1];
			sortb[i] = '<div id="infoIDP_'+i+'">'+informatorPieChart(lhls[0],lhls[1],lhls[2],lhls[3])[0]+'<p>"<em>'+lh+'</em>"</p></div>';}

		informatorSort(sorta,sortb);	for(var i = 0 ; i < sorta.length ; i++){panelpowodow += sortb[i];}

		/* Panel ustawień */
		if (localStorage.getItem('informator.lo-o(1)') === '1'){
			panelustawien += '<p><span id="ustMin">✔ Miniaturki znalezisk są ukrywane w panelu.</span></p>';
		} else {
			panelustawien += '<p><span id="ustMin">✗ Ukryj miniaturki znalezisk w panelu.</span></p>';}


		if (localStorage.getItem('informator.lo-o(2)') === '1'){
			panelustawien += '<p><span id="ustKont">Mniejszy kontrast kolorów dodatku.</span></p>';
		} else {
			panelustawien += '<p><span id="ustKont">Większy kontrast kolorów dodatku.</span></p>';}

		panelustawienmod += '<p>Widoczność moderatorów : ';
		for(i = 0 ; localStorage.getItem('informator.lm-m('+i+')') ; i++){
			if (localStorage.getItem('informator.lm-m('+i+')-o(1)') === '1'){
				panelustawienmod += ' <span id="infoIDM_'+i+'">'+localStorage.getItem('informator.lm-m('+i+')')+' ✗ </span>';
			} else {
				panelustawienmod += ' <span id="infoIDM_'+i+'">'+localStorage.getItem('informator.lm-m('+i+')')+' ✔ </span>';
		}}
		panelustawienmod += '</p>';

		/* Wykres sumaryczny */
		lhls = informatorGetLS('lo');

		/* Wyświetlenie panelu - jeśli są jakieś dane, i jeśli ich nie ma */
		if (lhls[0]+lhls[1]+lhls[2]+lhls[3] !== 0){
			$('.error-page').replaceWith('<div id="informator"><div class="infNag"><div><table>\
			<tr><td class="bold">'+lhls[0]+'</td><td><div class="white"><div class="infoBox prawidlowe"></div></div></td><td class="bold">Prawidłowe</td></tr>\
			<tr><td class="bold">'+lhls[3]+'</td><td><div class="white"><div class="infoBox nieprawidlowe"></div></div></td> <td class="bold">Nieprawidłowe</td> </tr>\
			<tr><td>'+lhls[1]+'</td><td><div class="white"><div class="infoBox zmieniony"></div></div></td><td>Zmieniony powód</td></tr>\
			<tr><td>'+lhls[2]+'</td><td><div class="white"><div class="infoBox konsultacji"></div></div></td><td>W konsultacji</td></tr>\
			<tr><td></td><td><div class="white"><div class="infoBox nowe"></div></div></td> <td>Nowe</td></tr>\
			<tr><td></td><td><div class="white"><div class="infoBox rozpatrywane"></div></div></td><td>Obecnie rozpatrywane</td></tr></table><h2>Legenda</h2></div>\
			<div id="infSuma">'+informatorPieChart(lhls[0],lhls[1],lhls[2],lhls[3])[0]+'<h2>Razem</h2></div></div>\
			<div class="infMod"><h2>Moderatorzy</h2>'+panelmoderatorow+'</div>\
			<div class="infPow"><h2>Powody zgłoszeń</h2><p>Po wybraniu powodu pojawi się więcej informacji.</p>'+panelpowodow+'</div>\
			<div class="infUst"><div><h2>Ustawienia</h2>'+panelustawien+panelustawienmod+'</div><div><h2>O dodatku</h2><p>Jeśli uważasz dodatek za użyteczny i wart polecenia pamiętaj, że zawsze <strong>możesz go ocenić</strong> <a href="http://www.wykop.pl/dodatki/pokaz/409/">tutaj</a>. :)</p><p>Błędy w jego działaniu możesz zgłosić w <a href="http://www.wykop.pl/wiadomosc-prywatna/konwersacja/Deykun/">prywatnej wiadomości</a>.</p></div></div></div>');
		} else {
			$('.error-page').replaceWith('<div id="informator"><div class="infNag"><div><table>\
			<tr><td class="bold">'+lhls[0]+'</td><td><div class="white"><div class="infoBox prawidlowe"></div></div></td><td class="bold">Prawidłowe</td></tr>\
			<tr><td class="bold">'+lhls[3]+'</td><td><div class="white"><div class="infoBox nieprawidlowe"></div></div></td> <td class="bold">Nieprawidłowe</td> </tr>\
			<tr><td>'+lhls[1]+'</td><td><div class="white"><div class="infoBox zmieniony"></div></div></td><td>Zmieniony powód</td></tr>\
			<tr><td>'+lhls[2]+'</td><td><div class="white"><div class="infoBox konsultacji"></div></div></td><td>W konsultacji</td></tr>\
			<tr><td></td><td><div class="white"><div class="infoBox nowe"></div></div></td> <td>Nowe</td></tr>\
			<tr><td></td><td><div class="white"><div class="infoBox rozpatrywane"></div></div></td><td>Obecnie rozpatrywane</td></tr></table><h2>Legenda</h2></div>\
			<div id="infSuma"><p><strong>Brak danych</strong> do wyświetlenia.</p><h2>Informator</h2></div></div>\
			<div class="infUst"><div><h2>Ustawienia</h2>'+panelustawien+'</div><div><h2>O dodatku</h2><p>Jeśli uważasz dodatek za użyteczny i wart polecenia pamiętaj, że zawsze <strong>możesz go ocenić</strong> <a href="http://www.wykop.pl/dodatki/pokaz/409/">tutaj</a>. :)</p><p>Błędy w jego działaniu możesz zgłosić w <a href="http://www.wykop.pl/wiadomosc-prywatna/konwersacja/Deykun/">prywatnej wiadomości</a>.</p></div></div></div>');
		}

		/* Obsługa akcji */
		$('.infPow > div, #infSuma > div').click(informatorPowody);
		$('.infUst span').click(informatorUstawienia);

		}
	else if (document.location.pathname.match('/naruszenia/')){
		$('.bspace > ul:last-child').append('<li><a href="http://www.wykop.pl/naruszenia/informator">Statystyki</a></liv>');
		}
	});
