// ==UserScript==
// @description scriptsurf
// @name        de-sponsors trusted-site
// @version     1.0
// @date        2011-08-10
// @author      mleha (mleha@xakep.ru)
// @include     http://*
// @include     https://*
/*******************************************
Скрипт предназначен для автоматического закрытия страниц нежелательных сайтов
В список нужно добавить сайты, которые НЕ ДОЛЖНЫ закрываться. Остальные сайты скрипт будет пытаться закрыть

sites.push("www.site.com");
sites.push("site.com");

добавить эти строки нужно ниже подобных и перед строкой 
Array.prototype.contains2 = function(obj) {

добавлять сайт с WWW. или без зависит от того как он открывается в браузере.
*******************************************/
// @namespace https://greasyfork.org/users/160340
// @downloadURL https://update.greasyfork.org/scripts/35537/de-sponsors%20trusted-site.user.js
// @updateURL https://update.greasyfork.org/scripts/35537/de-sponsors%20trusted-site.meta.js
// ==/UserScript==

var sites=new Array();
sites.push("surfmore.eu");
sites.push("www.proyos.de");
sites.push("mail.google.com");
sites.push("www.klamm4mail.de");
sites.push("klamm4mail.de");
sites.push("klamm-mailer.de");
sites.push("www.klamm-mailer.de");
sites.push("www.trucker-mails.de");
sites.push("www.kueko-net.de");
sites.push("www.exclusivmails.de");
sites.push("www.maggis-diamant.de");
sites.push("www.maiks-diamant.de");
sites.push("www.klammlose-euro-mailer.de");
sites.push("www.klammino.de");
sites.push("ya.ru");
sites.push("www.losecompany.de");
sites.push("www2.searchresultsdirect.com");
sites.push("www.horrorfilme.de");
sites.push("www.vistaprint.de");
sites.push("www3.westfalia.de");
sites.push("www.thomson-line.de");
sites.push("shop.beate-uhse");
sites.push("www.tipp24games.de");
sites.push("www.ccbparis.de");
sites.push("www.absahnen.de");
sites.push("www.autoteile-meile.at");
sites.push("www.rotlichtgangsta.de");
sites.push("global.dubli");
sites.push("regger24.de");
sites.push("tt.adcocktail");
sites.push("cashinlink.com");
sites.push("www.etoro.ru");
sites.push("www.adsure.de");
sites.push("kruta.de");
sites.push("www.ghetto-mafia.eu");
sites.push("besutau.de");
sites.push("www.50cent-mail.de");
sites.push("regionalmail.de");
sites.push("www.regionalmail.de");
sites.push("www.monsterpots.de");


window.onbeforeunload = function () { }; 

//добавляйте разрешенные сайты выше, согласно рекомендации
Array.prototype.contains2 = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] == obj) {
      return true;
    }
  }
  return false;
}

function getSite(){
	return window.location.hostname;
}

var SITE = getSite();
try{
	if (window.top.location.href==window.location.href){
		
		if (!sites.contains2(SITE)){
			window.close();
		}
	}
}catch(err){}