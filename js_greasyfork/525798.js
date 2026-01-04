// ==UserScript==
// @name         MDA kinopoisk add google, rezka, imdb search
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  adds extra links to useful sites
// @author       mr-d-r
// @license      MIT
// @match        http*://*.kinopoisk.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinopoisk.ru
// @grant        GM_addStyle
// @require      https://update.greasyfork.org/scripts/524553/1525219/MDA%20library.js
// @downloadURL https://update.greasyfork.org/scripts/525798/MDA%20kinopoisk%20add%20google%2C%20rezka%2C%20imdb%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/525798/MDA%20kinopoisk%20add%20google%2C%20rezka%2C%20imdb%20search.meta.js
// ==/UserScript==


// делать ссылки на imdb, rezka, google в виде иконок справа от названия фильма

// на странице с фото типа https://www.kinopoisk.ru/name/1371/photos/ тоже делать ссылки на imdb, rezka, google

// SOLVED: кинопоиск при кликах на ссылках делает не загрузку страницы с нуля, а только navigate на новую,
// 		т.о. надо инититить страницу не только по onLoad, но и по navigate !!!

// SOLVED === ЗАГРУЗКА сайта кинопоиска НАЧИНАЕТСЯ с события navigate!!!  не с onLoad !!!
// 					страницы которые на черном фоне, они - суки - грузят по 2 раза !!!
// === при выключении скриптов кинопоиск - на белом фоне,  при выключении - на черном
// 		 https://www.kinopoisk.ru/film/258687/?utm_referrer=www.kinopoisk.ru   https://www.kinopoisk.ru/name/1111242/   	https://www.kinopoisk.ru/film/841081/
//   	- гуглить когда кинопоиск становится черным
//   	- как убрать темную тему раз и навсегда?  - МОЖЕТ просто почистить все стили *DARK* типа styles_rootInDark__?
//		- когда грузишь https://www.kinopoisk.ru/film/841081/ с нуля - она темная
//				но если прийти на нее по навигации browser hsitory - то она белая - сравнить исходники ее в темной и белой !!!
// 				см. E:\Downloads\kinopoisk 2cmp\dark & E:\Downloads\kinopoisk 2cmp\white
//				неперерисовка страниц почти всегда на темной теме
//		- DONE: МОНИТОР URL-а - И ЕСЛИ УРЛ меняется - то делать ЖЕСТКИЙ релоад !!!





(function() {
    // 'use strict';  // getFunctionsNameThatCalledThisFunction глючит в строгом режиме
	var dbg=0,  aa, bb, 	myLinkID="mda_n", 	onLOADlck=false, onLOADlckTMOUT=2500,  myINITlck=false, myStyleADDED=false,  wlh=WLH();
	console.log("\n", "\n", `${GM.info.script.name}: start -> ${wlh}  debug=${(typeof dbg == "undefined") ? "absent" : dbg}  MDAlib=${(typeof MDAlib == "undefined") ? "absent" : MDAlib}` );

	// see further in addEventListener('load') !!!

// end of script

	function myINIT (caller) { var fn=fnName();
			if( myINITlck )  {   log(`${fn} ${caller}: SKIP   myINITlck= ${myINITlck}`);   return; 	}
			myINITlck=true;
			log(`- - - -\n${fn}: ${caller}\nprev page reason: \n ${localStorage.getItem('dbg1')}\n ${localStorage.getItem('dbg2')}\n ${localStorage.getItem('dbg3')}\n ${localStorage.getItem('d4')}`);
			delete_fucking_square();

	// таки делать проверку, что стиль попал в DOM, ао избежания бесконечных добавлений !!!
			//addMyStyle("myINIT");	//addRezkaLink("000"); 	// чисто прмониторить и выключить // не запускать сразу!!!  кинопоиск со страницами на черном фоне грузит их по 2 раза - addRezkaLink("1")

			ttout(900,  ()=>{ 	addMyStyle("myINIT");	addRezkaLink("001");		delete_fucking_square(); 	});   // вынужден добавить, т.к. при navigate функция запускается раньше загрузки контента
			ttout(5000, ()=>{ 	addMyStyle("myINIT");	addRezkaLink("002");		delete_fucking_square();	});   // вынужден добавить, т.к. при navigate функция запускается раньше загрузки контента

			if(dbg &&dbg>5) localStorage.setItem('dbg1','-');			localStorage.setItem('dbg2','-');			localStorage.setItem('dbg3','-');
			ttout(3000,  ()=>{ 	myINITlck=false; 	});	 // 3000ms IMPORTANT !!!
	} // myINIT()


	function addRezkaLink (caller) { 	var par, parCl, qs1, serial=false, serialText='', year='', EXIST, url, add,  nn=1,	a1, a2, aL,	 bgColor='CornflowerBlue',  hhh=window.location.href,  fn=fnName();
		// myLinkID='rezka_link' - GLOBAL
			if( ! hhh.match(/\/series\/|\/film\/|\/name\//) ) 	{	log(`${fn}:${caller}:  not series, film or name - exiting`); 	return;  };

			a1=document.querySelector("[class*='styles_imagesCount__']");  if(a1) {		if( !a1.innerText.match("изображений") ) a1.innerText=`${a1.innerText} изображений`;
																						a1.style.fontSize='13px';										}

			// доработать  if(   hhh.match(/\/film\/[0-9].*/) ) 					{	log(`${fn}:${caller}:  ignore posters - exiting`); 			return;  };
			// добавить еще игнорирование https://www.kinopoisk.ru/film/841081/stills/  Кадры Съёмки Постеры Фан-арт Промо Обложки Скриншоты
			//  т.е. пропустить /film/841081/$  но не пропускать /film/841081/.* !!!
2

			if(   hhh.match(/\/series\/|\/film\//) ) 				parCl="styles_title__", 			add='',			url="https://hdrezka.me/search/?do=search&subaction=search&q=";
			if(   hhh.match(/\/name\//) )							parCl="styles_primaryName__",		add='rezka', 	url="https://www.google.com/search?q=";

			for( let nn=1;  nn <= 2;  nn++) {
				if(dbg && dbg>5) log(`   ----  ${caller}  --- ${nn}`);
				if(   hhh.match(/\/series\/|\/film\//) ) {
					if(nn==1) parCl='styles_title__',  			qs1=`h1[class*='${parCl}']`,	serialText='сериал';  // styles_title__  // styles_imagesCount__
					if(nn==2) parCl='styles_originalTitle__',  	qs1=`[class*='${parCl}']`,		serialText='series';
				}
				if(   hhh.match(/\/name\//) ) {
					if(nn==1) parCl='styles_primaryName__', 	qs1=`h1[class*='${parCl}'], .styles_title__WOyvc`; 		// different page use different styles
					if(nn==2) parCl='styles_secondaryName__',  	qs1=`[class*='${parCl}'], .styles_subTitle__WTDRC`;		// different page use different styles
				}
				par=qS(qs1); 		if( !par )			{ 	if(dbg && dbg>5) log(`${fn}:${caller}:  nn=${nn} parent ${qs1} is ABSENT;`); 		continue;				}  // return;		}

				a1=qS(`#${myLinkID}${nn}`);	if( !a1 ) 	{	EXIST=false;	log(`${fn}:${caller}:  create NEW #${myLinkID}${nn}`);
															a1=setMyHTML(nn, fn);
															if(dbg && dbg>5) log(`a1=`, a1);
															//debugger;
				} else 									{	EXIST=true; 	if(dbg && dbg>5) log(`${fn}:${caller}:  use existing #${myLinkID}${nn}`);						}

				if(   hhh.match(/\/series\/|\/film\//) ) {
					nam						=par.innerText.replace(/\(.*/g,'');								// par.innerText.replace(/\(|\)/g,'');	// get film title to search, removing '(' & ')'
					if( !year ) 	year	=par.innerText.replace(/.*(\(.*? |\()([0-9]+.*)\).*/g, '$2');	// https://regexr.com/
					if( par.innerText.match(/сериал/g) ) 	serial=1;
				}
				if(   hhh.match(/\/name\//) ) {
					nam						=par.innerText;
					add='';
				}

				a1.querySelector(`#rezka_${nn}`).href	=encodeURI(`https://hdrezka.me/search/?do=search&subaction=search&q=${nam} ${year} ${(serial) ? serialText : ''}`);
				a1.querySelector(`#filmix_${nn}`).href	=encodeURI(`https://filmix.my/search/${nam} ${year} ${(serial) ? serialText : ''}`);
				a1.querySelector(`#imdb_${nn}`).href	=encodeURI(`https://www.imdb.com/find/?q=${nam} ${year} ${(serial) ? serialText : ''}`);
				a1.querySelector(`#google_${nn}`).href	=encodeURI(`https://www.google.com/search?q=${nam} ${year} ${(serial) ? serialText : ''} ${add}`);
				if( !EXIST ) { 		aa=par.insertAdjacentElement('afterend', a1);   }
				if(dbg && dbg>5) log(`${fn}:${caller}: ${nn} DONE `, a1);
			}
	} // addRezkaLink()


	function setMyHTML (nn=1, caller) {		var aa, 		fn=fnName();
		var cl=`mdaButtons`; // styles_yearsInDark__sswnF styles_years__s0WWl`;
		aa = fromHTML(`
			<!-- html -->
			<div id=${myLinkID}${nn} 							class="${cl}">
				<br>
				<span><a 	id="rezka_${nn}"	href="aaa" 		class="${cl}">
						rezka&nbsp;
					</a>
				</span>
				<span><a id="nothing_${nn}" 	href="ddd"		class="mdaSepar">|</a></span>

				<span><a 	id="filmix_${nn}"	href="aaa" 		class="${cl}">
						&nbsp;filmix&nbsp;
					</a>
				</span>
				<span><a id="nothing_${nn}" 	href="ddd"		class="mdaSepar">|</a></span>

				<span><a id="imdb_${nn}" 		href="bbb" 		class="${cl}">
						&nbsp;imdb&nbsp;
					</a>
				</span>
				<span><a id="nothing_${nn}" 	href="ddd"		class="mdaSepar">|</a></span>

				<span><a id="google_${nn}" 		href="ccc" 		class="${cl}">
						&nbsp;google&nbsp;
					</a>
				</span>
			</div>
		`);
		if(dbg && dbg>5) log(`${fn}:${caller}: DONE`);
		return aa;
	} // setMyHTML()


	function addMyStyle(caller) {		var rc,  	fn=fnName(),  displ='flex;' ; //'inline-block;' ;   // 'flex;' ;
	//	if( !myStyleADDED )  { 	log(`${fn}:${caller}:  style is already added - exiting`); 	return;  };
		rc=GM_addStyle(`
        	/* css */
        	/* Style player */
			.mdaButtons {
				display: ${displ};
				font-size: 12px;					text-decoration: none;
				margin-top: 3px; 	margin-bottom: 8px;
			}
			.mdaSepar {
				display: ${displ};
				background-color: black;
				margin-top: 3px; 	margin-bottom: 8px;
			}
		`);
		//		color: yellow;				background-color: cornflowerblue;
		// 		font-weight: bold;			border: 5px solid cornflowerblue;
		if( rc )  myStyleADDED=true;
		if(dbg && dbg>5) log(`${fn}:${caller}: DONE  rc=${rc}`);
	}


	window.addEventListener('load', function() {
		if( onLOADlck )  {   	log(`onLoad: SKIP   onLOADlck= ${onLOADlck}`);   return; 	}
		onLOADlck=true;			log(`===> on load event`);
		myINIT("onLoad");

		ttout(onLOADlckTMOUT,  ()=>{ 	onLOADlck=false; 					});  	// 3000 ms IMPORTANT !!!
	}); // window.addEventListener('load'...) // onload


	window.navigation.addEventListener("navigate", (event) => {  // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
		if( onLOADlck )  { 	log("onNavigate - SKIP due to onLOADlck"); 	return;	}
		onLOADlck=true;		log("===> on navigate event");
		// no need delRezkaLink("onNavigate");	// IMPORTANT !!!	// при переходе на новую страницу (клике на ссылке), сука кинопоиск оставлял на месте мою myLinkID='rezka_link'
		myINIT("onNavigate");  		// IMPORTANT !!!

		if(dbg &&dbg>5) localStorage.setItem("dbg3", `${Date.now()}  onNavigate`);
		ttout(onLOADlckTMOUT,  ()=>{ 	onLOADlck=false; 					});  	// IMPORTANT !!!
		// НЕЛЬЗЯ location.reload(), иначе бесконечный цикл - window.location.reload();
	});


	window.addEventListener("beforeunload", (event) => {   // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
		if( onLOADlck )  {	log("onBeforeUnload- SKIP due to onLOADlck"); 	return;	}
		onLOADlck=true;		log("===> on beforeunload event");		// почему-то при переходе на новую страницу (клике на ссылке), сука кинопоиск оставлял на месте мою myLinkID='rezka_link'
		// no need delRezkaLink("onBeforeUnload");

		if(dbg &&dbg>5) localStorage.setItem("dbg1", `${Date.now()}  beforeunload`);
		ttout(onLOADlckTMOUT,  ()=>{ 	onLOADlck=false; 					});  	// IMPORTANT !!!
	});
	//window.addEventListener("unload", // onbeforeunload is more efficient because it does not run in competition with the actual closing of the window and is triggered before onunload


	window.addEventListener("pageswap", (event) => {   // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
		if( onLOADlck )  {	log("pageswap - SKIP due to onLOADlck"); 	return;	}
		onLOADlck=true;		log("===> on pageswap event");		// почему-то при переходе на новую страницу (клике на ссылке), сука кинопоиск оставлял на месте мою myLinkID='rezka_link'
		// no need delRezkaLink("onPageswap");

		if(dbg &&dbg>5) localStorage.setItem("dbg2", `${Date.now()}  pageswap`);
		ttout(onLOADlckTMOUT,  ()=>{ 	onLOADlck=false; 					});  	// IMPORTANT !!!
	});


	window.addEventListener("pageshow", (event) => {   // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
		if( onLOADlck )  {	log("pageshow - SKIP due to onLOADlck"); 	return;	}
		onLOADlck=true;		log("===> on pageshow event");		// почему-то при переходе на новую страницу (клике на ссылке), сука кинопоиск оставлял на месте мою myLinkID='rezka_link'
		// no need delRezkaLink("on pageshow");

		if(dbg &&dbg>5) localStorage.setItem("dbg4", `${Date.now()}  pageshow`);
		ttout(onLOADlckTMOUT,  ()=>{ 	onLOADlck=false; 					});  	// IMPORTANT !!!
	});


	function delete_fucking_square () {  var a; // WORKS FINE !!!
			// удаление белого прямоугольника вверху страницы, который тупит несколько секунд и потом пропадает сам
			// 		<div class="zyc0w771fp8r2m2__AMNhR styles_zb8nyobkj8__Dw0ef"    data-tid="a913e1e7">
			// 			<div class="styles_zwlpkqiu2ko981x__RLKkf" aria-hidden="true" data-tid="e810e001">
			//		 		<div id="zg4i8gdesktop_zhjvfhwnnex"  class="styles_container__XXCpX"  data-tid="9501d3f4">	</div> </div> </div>
			document.querySelector("div[class*='styles_'] > div[class^='styles_'][aria-hidden='true'] > div[class^='styles_container__']")?.parentNode?.parentNode?.remove();
	} // delete_fucking_square()


    function fromHTML (html, trim = true) {        // Process the HTML string.
        html = trim ? html : html.trim();
        if (!html) return null;

        const template = document.createElement('template');  // Then set up a new template element.
        template.innerHTML = html;
        const result = template.content.children;

        if (result.length === 1) return result[0];  // Then return either an HTMLElement or HTMLCollection, based on whether the input HTML had one or more roots.
        return result;
    }

})();

/*
	function addRezkaLink_prev (caller) { 	var par, parCl, EXIST, url, add, 	a1, a2, aL,	 bgColor='CornflowerBlue',  hhh=window.location.href,  fn=fnName();
		// myLinkID='rezka_link' - GLOBAL
			if( ! hhh.match(/\/series\/|\/film\/|\/name\//) ) 	{	log(`${fn}:${caller}:  not series, film, name - exiting`); 	return;  };
			if(   hhh.match(/\/series\/|\/film\//) ) 				parCl="styles_title__", 			add='',			url="https://hdrezka.me/search/?do=search&subaction=search&q=";
			if(   hhh.match(/\/name\//) )							parCl="styles_primaryName__",		add=' rezka', 	url="https://www.google.com/search?q=";

			aL=qS("#" +myLinkID);	if( !aL ) 	{	EXIST=false;	log(`${fn}:${caller}:  create NEW ${myLinkID}`);
													a1=document.createElement('div');	a2=document.createElement('h3');	aL=document.createElement('a');
													aL.id=myLinkID;		aL.style=`display:inline-block;  background-color: ${bgColor};  color: yellow;  border: 5px solid ${bgColor};  font-weight: bold;  text-decoration: none;`;   //  background-color: white;";  // text-decoration: none - убрать подчеркивание ссылки
			} else 								{	EXIST=true; 	log(`${fn}:${caller}:  use existing ${myLinkID}`);									}

			par=qS(`h1[class*='${parCl}']`); 			if( !par 			  )	{ 	log(`${fn}:${caller}:  no parent found;`); 					return;	};

			nam=par.innerText.replace(/\(|\)/g,'');			// get film title to search, removing '(' & ')'
			aL.innerHTML='&nbsp;Search&nbsp;rezka&nbsp;';	//aL.classList.add("styles_yearsInDark__sswnF");	aL.classList.add("styles_years__s0WWl");		// aa.target = '_blank'; // Opens the link in a new tab
			aL.href = encodeURI(url+nam+add);
			if( !EXIST ) { 		par.insertAdjacentElement('afterend', a1);				a1.append(a2);				a2.append(aL);   }
			log(`${fn}:${caller}: DONE`)
	} // addRezkaLink_prev()



			<!-- html -->
			<div id=${myLinkID}${nn} 						class="${cl}">
				<h3><a 	id="rezka_${nn}"	href="aaa" 		class="${cl}">
						&nbsp;rezka&nbsp;
					</a>
				</h3>
				<h3><a	href="zzz"							class="$mdaSepar">	&nbsp					</a></h3>
				<h3><a id="imdb_${nn}" 		href="bbb" 		class="${cl}">
						&nbsp;imdb&nbsp;
					</a>
				</h3>
				<h3><a	href="zzz"							class="mdaSepar">	&nbsp					</a></h3>
				<h3><a id="google_${nn}" 	href="ccc" 		class="${cl}">
						&nbsp;google&nbsp;
					</a>
				</h3>
				<h3><a	href="zzz"							class="$mdaSepar">	&nbsp					</a></h3>
			</div>



*/

