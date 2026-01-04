// ==UserScript==
// @name        Okoun Check Lite
// @namespace   ocl.okoun.cz
// @description V pravidelných intervalech kontroluje oblíbené a novou poštu na serveru okoun.cz
// @include     https://www.okoun.cz/favourites.jsp?new=1
// @author      BALCARENKO
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36120/Okoun%20Check%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/36120/Okoun%20Check%20Lite.meta.js
// ==/UserScript==

(function() {

	// nastaveni
	var SETTINGS = {
		reloadInSeconds: 77,
		hideCategories: false,
		openLinksInNewWindow: true,
	}

	// init
	var TITLE = 'OCL';
	var RELOAD_IN_SECONDS = SETTINGS.reloadInSeconds;
	
	document.body.id = TITLE;
	document.title = TITLE;
	
	// zmenime favico
	setFavicon();
	
	// najdeme link na posticku
	var posta = document.querySelector('.head .menu a[href="/msgbox.jsp"]');
	if(!posta) {
		// pokud nenajdeme, tak je uzivatel odhlasen => konec
		return;
	}
	
	// je-li nova posta, zmenime title a favicon
	if(posta.innerHTML!='Vzkazník') {
		document.title = TITLE + ' - nová pošta';
		setFavicon('mail');
		// po otevreni posty zmenime zpatky
		posta.addEventListener('mouseup',function(e){
			if(e.which == 3) return; // jen leve nebo stredni tlacitko
			document.title = TITLE;
			setFavicon()
		},false);
	}
	
	// pokud je ve strance #sysmsgBox, tak jsme nejspis hned po prihlaseni
	// a nasledny reload by chtel znovu odesilat POST data, proto reload takto
	// toto by melo byt az po kontrole posty, jinak se reload provede i po odhlaseni uzivatele
	if(document.getElementById("sysmsgBox")) {
		location = location.href;
	}
	
	// skryt nadpisy kategorii
	if(SETTINGS.hideCategories) {
		var headers = document.querySelectorAll('.main .main h3');
		for(header of headers) {
			header.style.display = 'none';
		}
	}
	
	// odkazy v zahlavi v novem okne
	if(SETTINGS.openLinksInNewWindow) {
		var links = document.querySelectorAll('.head a, .footer a');
		for(link of links) {
			if(link.href.search(/javascript:|\?new=1/)==-1) { // krom logoutu a reloadu
				link.setAttribute('target','ocl');
			}
		}
	}
	
	// odkazy na audirka
	var items = document.querySelectorAll('.main .item');
	for(var item of items) {
		
		// odkazy (je buď jeden, nebo dva)
		var links = item.getElementsByTagName('a');
		
		// auditko bez nazvu (12. komnata)
		if(links[0].innerHTML.search(/^\s*$/) != -1)
			links[0].innerHTML = '-- bez názvu --';

		// kdyz klikneme na nazev, tak jako by to bylo na nove (= otevre se na nejstrasich z novych)
		if(links.length == 2)
			links[0].href = links[1].href;
		
		// odkazy otevirame v novem okne
		// a po kliknuti skryjeme cely div
		for(var link of links) {
			if(SETTINGS.openLinksInNewWindow)
				link.setAttribute('target','_blank');
			
			link.addEventListener('mouseup', function(e) {
				if(e.which == 3) return; // jen leve nebo stredni tlacitko
				var div = findParentDiv(this);
				if(div)
					div.style.display = 'none';
			}, false);
		}
	}
	
	function findParentDiv(node) {
		var div = node.parentNode;
		if(!div || (div.className.search(/item/) > -1))
			return div;
		findParentDiv(div);
	}
	
	// pripravime si tlacitko s odpoctem
	var countDownButton = document.createElement('button');
	with(countDownButton) {
		id = 'reload-button';
		style = 'display: inline-block; margin-left: 10px';
		innerHTML = 'Načtení za: ' + sec2str(RELOAD_IN_SECONDS);
		onclick = function() {
			clearInterval(interval);
			RELOAD_IN_SECONDS = 1;
			countDown();
		}
	}
	
	// a umistime ho do okouni hlavicky
	var head = document.querySelector('.head');
	if (head) {
		head.insertBefore(countDownButton,head.lastElementChild);
	} else {
		document.body.appendChild(countDownButton);
	}
	
	// zahajime odpocet
	var interval = setInterval(countDown, 1000);
	
	function countDown() {
		countDownButton.innerHTML = 'Načtení za: ' + sec2str(--RELOAD_IN_SECONDS);
		
		if(RELOAD_IN_SECONDS > 0) return;

		// zastavit odpocet a reload kdyz to dojde do nuly
		clearInterval(interval);
		location.reload(true);
	}
	
	function sec2str(nsec) {
	//	var hours = Math.floor(nsec / 3600);
		var minutes = Math.floor(nsec / 60);
		var seconds = (nsec - minutes * 60);
		return minutes + ':' + ('0' + seconds).substr(-2);
	}
	
	// nastaveni ikony
	function setFavicon(what){
		
		//	okoun <link rel="shortcut icon" href="/static/201502020949/favicon.ico" type="image/x-icon">
		var link = document.querySelector('link[rel~="icon"]');
		if(!link) {
			link = document.createElement('link');
			link.setAttribute('rel','icon');
			document.head.appendChild(link);
		}
		
		link.setAttribute('id','favicon');
		if(what=='mail') {
			// blikaci dopisni obalka
			link.type = "image/gif";
			link.href = "data:image/gif;base64,R0lGODlhDAAIALIAAP8IAP///wAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFKAAHACwAAAAADAAIAAADFRi6vPAwqtcCtRZMrfF2UxVmkSQ2CQAh+QQFKAAHACwAAAAADAAIAAADFQi6vPEwqtcAtTZMrfF2UxVmkSQ2CQAh/ntUaGlzIGFuaW1hdGVkIEdJRiBmaWxlIHdhcyBjb25zdHJ1Y3RlZCB1c2luZyBVbGVhZCBHSUYgQW5pbWF0b3IsIHZpc2l0IHVzIGF0IGh0dHA6Ly93d3cudWxlYWQuY29tIHRvIGZpbmQgb3V0IG1vcmUuAVVTU1BDTVQAOw==";
		} else {
			// defaultni ikona OCL
			link.type = "image/gif";
			link.href = "data:image/gif;base64,R0lGODlhEAAQAKECAAAAAICAgP///////yH5BAEKAAIALAAAAAAQABAAAAImlI+pq+DvGIRhzVfbBTltbm0d8o3HByXByk6mRzGGKwt0za71UgAAOw==";
		}
	}

})();
