// ==UserScript==
// @name       minusuowanie 
// @namespace  http://www.wykop.pl/*
// @version    1.2
// @description  minusuowanie konkretnych osób
// @match      *://www.wykop.pl/*
// @copyright  Arkatch
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/34149/minusuowanie.user.js
// @updateURL https://update.greasyfork.org/scripts/34149/minusuowanie.meta.js
// ==/UserScript==
(function(){
    var ELEM = document.getElementById("nav");
    var DIVBUT = document.createElement('div');
    var BUTDEL = document.createElement('input');
    DIVBUT.setAttribute("style", "position:fixed;top:15px;left:40px;z-index: 101;");
    BUTDEL.setAttribute("id", "UsunTO");
    BUTDEL.setAttribute("onclick", "minus()");
    BUTDEL.setAttribute("value", "Minus");
    BUTDEL.setAttribute("type", "button");
    BUTDEL.setAttribute("style", "width:45px;");
    DIVBUT.appendChild(BUTDEL);
    ELEM.appendChild(DIVBUT);

window.minus=function minus(){
	//tu wpisujesz nazwę tego kogo chcesz minusować
	var who = "mobilisinmobile";

	var authors, author, buttonMinus;
	//Blok wszystkich komentarzy
	var itemsStream = document.getElementById('itemsStream');

	//każdy komentarz (wblock to tablica)
	var wblock = itemsStream.getElementsByClassName('wblock lcontrast dC  ');

	//pobieramy nazwę profilu z każdego komentarza
	for(var i=0, j=wblock.length;i<j;i++){
		//pobieramy konkretną nazwę profilu
		authors = wblock[i].getElementsByClassName('author ellipsis')[0];
		author = authors.getElementsByTagName('b')[0].innerHTML;

		if(author == who){
			//jeżeli znajdziemy to minusujemy
			buttonMinus = authors.getElementsByClassName('fa fa-minus')[0];
			buttonMinus.click();
		}
	}
    };
})();