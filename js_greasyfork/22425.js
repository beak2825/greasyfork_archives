// ==UserScript==
// 
// @name        NzBinnewZ 
// @description Ajoute des liens vers les moteurs Nzb, Allociné.fr et Imdb.com et Tmdb sur Binnewz, Renvois sur BZ RSS si soucis de SQL
// @icon        http://www.binnews.info/binnewz/favicon.ico
// @include     http://*binnews.in/*
// @include     https://*binnews.in/*
// @include     http://*binnews.me/*
// @include     https://*binnews.me/*
// @include     http://*binnews.biz/*
// @include     https://*binnews.biz/*
// @namespace   www.binnews.in
// @namespace   www.binnews.me
// @namespace   www.binnews.biz
// @author      Guile93,Jarod, Stinky
// @version     2.48.9
//
// @downloadURL https://update.greasyfork.org/scripts/22425/NzBinnewZ.user.js
// @updateURL https://update.greasyfork.org/scripts/22425/NzBinnewZ.meta.js
// ==/UserScript==
// 
// 
//   ######################  THANK'S TO GUILE93 FOR THE ORIGINAL AND PREVIOUS VERSIONS OF NZB SCRIPT  ######################
// 
// 
//                            ==> https://greasyfork.org/fr/scripts/5045-liens-moteurs-ng-sur-binnewz
// 
// 
// ######################   THANK'S TO JAROD FOR THE ORIGINAL AND PREVIOUS VERSIONS OF ALLOCINE SCRIPT   ######################
//
//                                     ==> http://userscripts-mirror.org/scripts/show/8421
//
// 
// ================================================== UPDATE HISTORY ==========================================================
// 
// v2.48.9 2019-06-02        - Ajout d'un filtre, suppression du mot "4k" dans le titre pour la recherche sur Allocine, Imdb et Tmdb
//
// v2.48.8 2019-06-01        - Modif recherche NZBKING (Le nom à rechercher est entre "guillemets" pour un meilleur résultat de recherche)
// 
// v2.48.7 2018-12-16        - Ajout recherche avec NZBFriends
// 
// v2.48.6 2018-12-10        - Modif recherche NZBKING (remplace les _ par des espaces) pour trouver certains posts dont le nom contient des _ 
//
// v2.48.5 2018-11-24        - Ajout liens NZBINDEX BETA
//
// v2.48.4 2018-09-25        - Ajout liens TMDB, Ajout filtre suppression "HDlight" du titre pour la recherche sur Allocine, Imdb et Tmdb
//
// v2.48.3 2018-03-12        - Modif liens allocine et imdb, recherche google remplacé par DuckDuckGo
//   
// v2.48.1 2018-01-07        - Ajout recherche avec Binzb
// 
// v2.48   2017-12-23        - Ajout recherche avec Nzb Monkey
// 
// v2.47.6 2017-12-23        - Ajout recherche avec Usenet_Crawler + modif liens allocine et imdb
// 
// v2.47.5 2017-11-18        - Modif recherche avec Newzleech.com
//
// v2.47.4 2017-11-12        - Remplacement du lien Usenet_Crawler par Newzleech.com
// 
// v2.47.2 2017-11-05        - Modification liens; modification recherche nzbindex suppression des * dans le texte
//                           - Modification des adresses de Binnewz; suppression de nzbking via google
//
// v2.47.1 2017-11-02        - Ajout d'un lien Imdb et modif script 
// 
// v2.47 2017-11-02          - Modification de la recherche vers allociné via google 
//                           - Ajout d'adresses + ajout de nouveaux filtres
//
// v2.46.31.10 2017-10-31    - Ajoute un lien Allociné à côté du titre si il est remplacé par cineseries, imdb, themoviedb, cinemotions
//                           - Modification de Metadata Block
//                           
// v2.45.29.10 2017-10-29    - Ajout du moteur de recherche Usenet Crawler
//                           
// v2.44.26.10 2017-10-26    - Correction Bugs
// 
// v2.43.26.10 2017-10-26    - Redirection vers le flux RSS quand Binnewz rencontre des problèmes de serveur SQL
// 
// v2.43.3.1 2017-07-29      - Ajout de l'option de recherche google pour NzbKing
// 
// v2.43.2 2017-06-17        - Suppression de NzbClub et NzbSearch
// 
// v2.43.1 2016-08-19        - Update nom du script et infos
//                           
// v2.43 2016-08-19          - Ajout moteurs de nzbking, nzbsearch et binzb 
//                           - Correction de l'adresse de recherche de nzbclub
//                           
// v2.43 2014-09-13          - DERNIERE VERSION DE GUILE93
//
//                                          
//================================================ Redirection auto vers Binnewz RSS ==============================================


if 
  ( document.documentElement.textContent == 'Erreur de connexion MySQL' ) {
  window.location.href = "http://linux-newsgroups.fr/";
}
if 
  ( document.documentElement.innerText == 'Erreur de connexion MySQL' ) {
  window.location.href = "http://linux-newsgroups.fr/";
}



//======================================================== Script liens Allociné ====================================================

//
for (var i=0; i < document.getElementsByTagName('a').length; i++) {

  var link = document.getElementsByTagName('a')[i];
  var aUrl = link.href.split("/");
  for (var j=0; j < aUrl.length; j++) {
                  

    if ((aUrl[j] == "www.imdb.com")||(aUrl[j] == "www.allocine.fr")||(aUrl[j] == "www.cineserie.com")||(aUrl[j] == "www.themoviedb.org")||(aUrl[j] == "www.dvdfr.com")||(aUrl[j] == "www.thetvdb.com")||(aUrl[j] == "www.cinemotions.com")||(aUrl[j] == ".wikia.com")||(aUrl[j] == "www.netflix.com")||(aUrl[j] == "anidb.net")||(aUrl[j] == "www.animeka.com")||(aUrl[j] == "www.anime-kun.net")||(aUrl[j] == "www.cinemafantastique.net")||(aUrl[j] == "cinemur.fr")||(aUrl[j] == "www.planete-jeunesse.com")||(aUrl[j] == "www.commeaucinema.com")||(aUrl[j] == "www.imdb.fr")||(aUrl[j] == "www.premiere.fr")||(aUrl[j] == "cinemafantastique.net")||(aUrl[j] == ".cinemafantastique.be")||(aUrl[j] == "www.blu-ray.com")||(aUrl[j] == "bluray.highdefdigest.com")||(aUrl[j] == "www.cinemafantastique.be")||(aUrl[j] == "www.bluray-disc.de")||(aUrl[j] == "cinema.jeuxactu.com")||(aUrl[j] == "fr.wikipedia.org")) {

      var str = "<a style=\"color: #FFCE00; background-color: black\" target=\"_blank\" href=\"https://duckduckgo.com/?q=!allocine%20"+(link.innerHTML.replace(/ /g,"%20").replace(/-/g,"").replace(/&/g,"and").replace(/{+.*?}+/g, "").replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "").replace(/S[0-9].*/g,"").replace(/E[0-9].*/g,"").replace(/Ep[0-9].*/g,"").replace(/Volume.*/g,"").replace(/Vol[0-9].*/g,"").replace(/Episode.*/g,"").replace(/Saison.*/g,"").replace(/Intégrale.*/g,"").replace(/Hdlight.*/g,"").replace(/4k.*/g,""))+"\">Allo</a>";
      var str2 = document.getElementsByTagName('a')[i].parentNode.innerHTML;
      document.getElementsByTagName('a')[i].parentNode.innerHTML = str2 + " " + str;

    }if ((aUrl[j] == "www.allocine.fr")||(aUrl[j] == "www.imdb.com")||(aUrl[j] == "www.cineserie.com")||(aUrl[j] == "www.themoviedb.org")||(aUrl[j] == "www.dvdfr.com")||(aUrl[j] == "www.thetvdb.com")||(aUrl[j] == "www.cinemotions.com")||(aUrl[j] == ".wikia.com")||(aUrl[j] == "www.netflix.com")||(aUrl[j] == "anidb.net")||(aUrl[j] == "www.animeka.com")||(aUrl[j] == "www.anime-kun.net")||(aUrl[j] == "www.cinemafantastique.net")||(aUrl[j] == "cinemur.fr")||(aUrl[j] == "www.planete-jeunesse.com")||(aUrl[j] == "www.commeaucinema.com")||(aUrl[j] == "www.imdb.fr")||(aUrl[j] == "www.premiere.fr")||(aUrl[j] == "cinemafantastique.net")||(aUrl[j] == ".cinemafantastique.be")||(aUrl[j] == "www.blu-ray.com")||(aUrl[j] == "bluray.highdefdigest.com")||(aUrl[j] == "www.cinemafantastique.be")||(aUrl[j] == "www.bluray-disc.de")||(aUrl[j] == "cinema.jeuxactu.com")||(aUrl[j] == "fr.wikipedia.org")) {

      var str = "<a style=\"color: black; background-color: #FFCE00\" target=\"_blank\" href=\"https://duckduckgo.com/?q=!imdb%20"+(link.innerHTML.replace(/ /g,"%20").replace(/-/g,"").replace(/&/g,"and").replace(/{+.*?}+/g, "").replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "").replace(/S[0-9].*/g,"").replace(/E[0-9].*/g,"").replace(/Ep[0-9].*/g,"").replace(/Volume.*/g,"").replace(/Vol[0-9].*/g,"").replace(/Episode.*/g,"").replace(/Saison.*/g,"").replace(/Intégrale.*/g,"").replace(/Hdlight.*/g,"").replace(/4k.*/g,""))+"\">Imdb</a>";
      var str2 = document.getElementsByTagName('a')[i].parentNode.innerHTML;
      document.getElementsByTagName('a')[i].parentNode.innerHTML = str2 + " " + str;

          }if ((aUrl[j] == "www.allocine.fr")||(aUrl[j] == "www.imdb.com")||(aUrl[j] == "www.cineserie.com")||(aUrl[j] == "www.themoviedb.org")||(aUrl[j] == "www.dvdfr.com")||(aUrl[j] == "www.thetvdb.com")||(aUrl[j] == "www.cinemotions.com")||(aUrl[j] == ".wikia.com")||(aUrl[j] == "www.netflix.com")||(aUrl[j] == "anidb.net")||(aUrl[j] == "www.animeka.com")||(aUrl[j] == "www.anime-kun.net")||(aUrl[j] == "www.cinemafantastique.net")||(aUrl[j] == "cinemur.fr")||(aUrl[j] == "www.planete-jeunesse.com")||(aUrl[j] == "www.commeaucinema.com")||(aUrl[j] == "www.imdb.fr")||(aUrl[j] == "www.premiere.fr")||(aUrl[j] == "cinemafantastique.net")||(aUrl[j] == ".cinemafantastique.be")||(aUrl[j] == "www.blu-ray.com")||(aUrl[j] == "bluray.highdefdigest.com")||(aUrl[j] == "www.cinemafantastique.be")||(aUrl[j] == "www.bluray-disc.de")||(aUrl[j] == "cinema.jeuxactu.com")||(aUrl[j] == "fr.wikipedia.org")) {

      var str = "<a style=\"color: green; background-color: white\" target=\"_blank\" href=\"https://duckduckgo.com/?q=!themoviedb%20"+(link.innerHTML.replace(/ /g,"%20").replace(/-/g,"").replace(/&/g,"and").replace(/{+.*?}+/g, "").replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "").replace(/S[0-9].*/g,"").replace(/E[0-9].*/g,"").replace(/Ep[0-9].*/g,"").replace(/Volume.*/g,"").replace(/Vol[0-9].*/g,"").replace(/Episode.*/g,"").replace(/Saison.*/g,"").replace(/Intégrale.*/g,"").replace(/Hdlight.*/g,"").replace(/4k.*/g,""))+"\">TMDb</a>";
      var str2 = document.getElementsByTagName('a')[i].parentNode.innerHTML;
      document.getElementsByTagName('a')[i].parentNode.innerHTML = str2 + " " + str;
          
		}
	}
}
//  
//

      //Vous pouvez personaliser la couleur du texte et du fond des liens en changeant le code couleur  
      //
      //=> "color: #FFCE00; background-color: black\" (Texte jaune et fond noir)
      //=> "color: black; background-color: #FFCE00\" (Texte noir et fond jaune)
      //
      //=> color: black;              ==>   (texte couleur noir)   (black)
      //=> background-color: #FFCE00\ ==>   (fond couleur jaune)   (#FFCE00)
      //
      //https://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F
      //
      //Exemple de 20 couleurs
      //
      //Red	#e6194b	
      //Green	#3cb44b	
      //Yellow	#ffe119	
      //Blue	#0082c8	
      //Orange	#f58231	
      //Purple	#911eb4	
      //Cyan	#46f0f0	
      //Magenta	#f032e6
      //Lime	#d2f53c	
      //Pink	#fabebe	
      //Teal	#008080	
      //Lavender	#e6beff	
      //Brown	#aa6e28	
      //Beige	#fffac8	
      //Maroon	#800000
      //Mint	#aaffc3	
      //Olive	#808000	
      //Coral	#ffd8b1	
      //Navy	#000080
      //Grey	#808080
      //White	#FFFFFF
      //Black	#000000
      //

  
//========================================================== Script liens NZB =========================================================


function make_link(elem,cible,title,img){
	var newLink = document.createElement("a");
	newLink.href=cible;
	newLink.target="_blank";
	var new_img = document.createElement("img");
	new_img.src=img;
	new_img.title="Chercher sur "+title;
	new_img.alt="Chercher sur "+title;
	newLink.appendChild(new_img);
	elem.appendChild(newLink);
}
function add_links(){
	var search_array = document.getElementsByTagName("TD");
	for (var n=0; n < search_array.length; ++n){
		var Td = search_array[n];
		if(Td.innerHTML.match(/flag/)){
						var z=1;
						do{
						++z;
					}while(search_array[n+z].innerHTML.match(/ng_id/));
				var newelem=search_array[n+z];
                var div = document.createElement("div");
                var cont=newelem.innerHTML;
				var req=cont.replace(/ /g,"+").split("*").join(" ").replace(/&lt;/,"<").replace(/&gt;/,">").replace(/#/,"%23");
                var method1=req.replace(/&amp;/,"");
            	var method2=encodeURIComponent(cont.replace(/&amp;/," "));
                var method3=encodeURIComponent(cont);
                 var method4=escape(cont.replace(/&amp;/,"%26"));
                  var method5=cont.replace(/ /g,"+");
                  var method6=cont.replace(/ /g,"+").replace(/_/g,"+");


                make_link(div,"nzblnk:?t="+method3+('&h=')+method3,"Nzb_Monkey","data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA+Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBkZWZhdWx0IHF1YWxpdHkK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAFgAWAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8AxvB3w4Pie0XU9V1qHTorp3Fv5mGluCpwzAEjgE4zzzXSRfAmSO6uGvtegisUGY5li+Zv94EgL+ZqHwH4h0HVtE0vw7q1zd2Go2krR2NzbdZBK3KfdYck4wRjgc16Vf8AhjS7fQbRJjdWFrpKSSpdwz7pI16sTlSDkZJ4OO1ckIRkr2Pdr4itSny3tfyW3Rr8DwDxV4ZvPBd/C9pqa3NpdK3kXto+BIFOGU4J5BxkZNFaPxD8S6RqqabpGgrIdM01X2zS53TO5BZueeozk4ySeKKxk7O0T0KUHKCdRanH5n0zUmVZNtxay4DxsRhlPUHr1Fdhq/xJutS0E6bFaz2zyJsll/tG4kVl7gIzYAPTnPFFFTdq6RahGolKW6OU0vS7jWrt7e3eNHVC5MhIGMgdgfWiiirjFWOerUkpaM//2Q==");
      
                make_link(div,"https://www.binsearch.info/?max=250&adv_age=&server=1&q="+method1,"Binsearch","data:image/png;base64,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");
      
                make_link(div,"https://www.binsearch.info/?max=250&adv_age=&server=2&q="+method1,"Binsearch \"other groups\"","data:image/png;base64,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");

                make_link(div,"https://www.nzbindex.nl/search/?q="+method1,"NZBindex.nl","data:image/x-png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAWCAYAAAGkkcxkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABMlJREFUeNpi+P//P4OgoKAsCDOAAEiAwWze/3v37gMZDBxggfcfv/z//v07WAAggBi5ubmF2NjYuMHKp06duuvajTv/GXRm/Wfi5+dnUFeWZXh/NIoBIIAYQfr6+vp2eXh4uIINBQJGRkYGbW1tThYQR0BAgEE7/CgDAzszw+sd/gyiDmshikCqra2ti2RlZZ0YkMDKlStDAAIILCkkJCSLLAEy9u3bt4/Bxh45cuQRSBFIEAR4eHjAaphA5NK9bxiCG64xaEcdY5i55SWDhCgfWBFYkp2dg6E6ThPIY2RgY2djYOPkRzjo69fv/1lYGBm+//zLwMLMxMDDzQmWA9uZnJy4lQEVMK1YsYIBIIAYYR6fMmXKIU9PT1sGPADkUAkJCXagnl9MMMG/f//+2HP2DUN+7xUGTjZGhq/ffzPk910FiTNsPf6SIb/nCgMbC8IPcI2cnJwMT98CFZ19xyAdsJ/h/N2fDFuPvGLg5uZhePDyD8PWw6+AEc8Ht50FxuDg4GBg/cXGwPDxJ8P/G0kMEm5rQKmCgZeXl4GZhZWB4c9foDWcCHeD/AjCQA/v+vPnz398+D8kQDhAFEAAPqpdJWIgit68x6yPL5D8gx/hB2yVQvIXSmprOxt7G7WzkIVlt1UIW0oaK3crQSWanZCAm3hmyAwjKxkIcznh3DPcc2Ys5ZLO3sDinBdN05TmUXfyPF/ixyAxTdNbbLFJtJBlQjd9fJUVsxYT1maqYn+X0dnlC90/flLg+3R+/UoXdys66PHpotAN/kx1FDI5/oendzo5PqTZ4gMkD3gg8SjCdB1nW1GoyE6hQ9F4TiFzpYIPm8QSJNu2t4mWx6RvV6dH1CG0q7dKEploCFwQ/1VET5jcUon7vpyOiUDetECDQOIWrpKpSH3IQ2GueCnWvJKvRfHNuy98dV1LvFxXXZIkNyowrunT3ojp2vMM3O3TbSgq4k8cxxPs7VAAsix7VvWvAKVVTUsbYRB+kt133+xiSOIXxJqLCZQee/MWVMSDBoIEvJlD6Un7J3rw4KE9Fe89pE2P9aTgR7RUD/6EqKCCoifRBtnNhzNvNjHZ1BDIuwy7O/vsDPPxzDT56E4NXzKZzMTj8Xfcm+jjCCF8hULhsFgs7rX60D04M5VKfUyn07OlUqkff2pY0Mj7RQ6P6PXpNYeqxDrl0DINSFHPYblSozlWdbNAzRnQ1L1araFEeo6AsYaLt52qskE16MiS36tg4HDEwsbva8RmdhBb2Edi6Q/Ob2wMhU08lf14u/wXsbldTK6cEF5gdNDCev6yjidZy11ghGy0tVk3h4YhEZAUvEm9a+moUDjzn47x+fuZMmTxN9ozzB7aXRCteBJTCmWjZ4eCyKC7rQm7gtXMBEbeDODbj1O8/3CgUsx/+uiShGXRNL1BmDptDdnGwK4O4XPB3F3EwsR4CLdbi1iYjuHu6hH3/xxVTK4jR8hzo4l3+4D6tPcI+YQGJKLDJqJDJhFUki0/Nr9MI/91CmNBQ+lHIwHlsKYZCAddPEmInr3E7dgZjdGRy+W2eXw4jk17wlHCz7b9Ig192XGaOi+eTzab/dnYMf8dNS5/ZD1S0RPftC7fqLYdRryTRm1W3gMcPPo7bIyKjYdai5NneQAnEnLrIpsAAAAASUVORK5CYII=");

                make_link(div,"https://beta.nzbindex.com/?q="+method1,"BETA","data:image/x-png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAWCAYAAAGkkcxkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABMlJREFUeNpi+P//P4OgoKAsCDOAAEiAwWze/3v37gMZDBxggfcfv/z//v07WAAggBi5ubmF2NjYuMHKp06duuvajTv/GXRm/Wfi5+dnUFeWZXh/NIoBIIAYQfr6+vp2eXh4uIINBQJGRkYGbW1tThYQR0BAgEE7/CgDAzszw+sd/gyiDmshikCqra2ti2RlZZ0YkMDKlStDAAIILCkkJCSLLAEy9u3bt4/Bxh45cuQRSBFIEAR4eHjAaphA5NK9bxiCG64xaEcdY5i55SWDhCgfWBFYkp2dg6E6ThPIY2RgY2djYOPkRzjo69fv/1lYGBm+//zLwMLMxMDDzQmWA9uZnJy4lQEVMK1YsYIBIIAYYR6fMmXKIU9PT1sGPADkUAkJCXagnl9MMMG/f//+2HP2DUN+7xUGTjZGhq/ffzPk910FiTNsPf6SIb/nCgMbC8IPcI2cnJwMT98CFZ19xyAdsJ/h/N2fDFuPvGLg5uZhePDyD8PWw6+AEc8Ht50FxuDg4GBg/cXGwPDxJ8P/G0kMEm5rQKmCgZeXl4GZhZWB4c9foDWcCHeD/AjCQA/v+vPnz398+D8kQDhAFEAAPqpdJWIgit68x6yPL5D8gx/hB2yVQvIXSmprOxt7G7WzkIVlt1UIW0oaK3crQSWanZCAm3hmyAwjKxkIcznh3DPcc2Ys5ZLO3sDinBdN05TmUXfyPF/ixyAxTdNbbLFJtJBlQjd9fJUVsxYT1maqYn+X0dnlC90/flLg+3R+/UoXdys66PHpotAN/kx1FDI5/oendzo5PqTZ4gMkD3gg8SjCdB1nW1GoyE6hQ9F4TiFzpYIPm8QSJNu2t4mWx6RvV6dH1CG0q7dKEploCFwQ/1VET5jcUon7vpyOiUDetECDQOIWrpKpSH3IQ2GueCnWvJKvRfHNuy98dV1LvFxXXZIkNyowrunT3ojp2vMM3O3TbSgq4k8cxxPs7VAAsix7VvWvAKVVTUsbYRB+kt133+xiSOIXxJqLCZQee/MWVMSDBoIEvJlD6Un7J3rw4KE9Fe89pE2P9aTgR7RUD/6EqKCCoifRBtnNhzNvNjHZ1BDIuwy7O/vsDPPxzDT56E4NXzKZzMTj8Xfcm+jjCCF8hULhsFgs7rX60D04M5VKfUyn07OlUqkff2pY0Mj7RQ6P6PXpNYeqxDrl0DINSFHPYblSozlWdbNAzRnQ1L1araFEeo6AsYaLt52qskE16MiS36tg4HDEwsbva8RmdhBb2Edi6Q/Ob2wMhU08lf14u/wXsbldTK6cEF5gdNDCev6yjidZy11ghGy0tVk3h4YhEZAUvEm9a+moUDjzn47x+fuZMmTxN9ozzB7aXRCteBJTCmWjZ4eCyKC7rQm7gtXMBEbeDODbj1O8/3CgUsx/+uiShGXRNL1BmDptDdnGwK4O4XPB3F3EwsR4CLdbi1iYjuHu6hH3/xxVTK4jR8hzo4l3+4D6tPcI+YQGJKLDJqJDJhFUki0/Nr9MI/91CmNBQ+lHIwHlsKYZCAddPEmInr3E7dgZjdGRy+W2eXw4jk17wlHCz7b9Ig192XGaOi+eTzab/dnYMf8dNS5/ZD1S0RPftC7fqLYdRryTRm1W3gMcPPo7bIyKjYdai5NneQAnEnLrIpsAAAAASUVORK5CYII=");
          
                make_link(div,"https://www.newzleech.com/?group=&minage=&age=&min=Size+%28Min%29&max=Size+%28Max%29&q="+method5 +('&m=search&adv='), "Newzleech.com","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABrVBMVEUAAABwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrFwdrH///+lDBX9AAAAjXRSTlMAAEbt4SgFof6WCTXqyx4CkO5MJt/9hwQBe/7/vhMBCRUmPVdxXhvT94lmhqO80+b0/b9m+/35wiYUwtUxYffjRMz78eHNvPHuWQDN18KnimxQNiEQSPH2cAITFwsCBJ77iAcz6f6gDgKM/7YYJN3JJgB5/to3GdHnS2T78WEBEMH4eQRU+PuPCXPtqRRoKoWqAAAAAWJLR0SOggWzbwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB+ELDA8JNaDn1HkAAAEISURBVBjTY2BgYGBkYu6FAhZWBjhgY4eJcnBywUUZuXlgwrx8jHBhfgGYqKAQRJQRSDEKi0BFRcXEGaGAgUFCUgoiKi0jyygnr6CopKyiysCopg5VrKGppa2jq6dvYNhrxMBobAIVNjWD2WFuwWBp1YsOrG0YGWzt0EXtHYBWOoKZTs4urm7uYKaHpxfQId4+vn7+AYFBwSGhYSDR8IhIkOOjomNiwU6NiweJJiQmMUJ8BHY9A2NyClA0NS0d4X0QyMjMAgpn56CKMubmAUXzCxhRhQuLint7S0rRRBnLynt7KyrRRBkYq6p7a2rr0EQZ6ht6G5ua0UUZWlrb2jswRBk6u7p7kEUBpPFwji0892QAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTEvMjcvMTZjbxPnAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTExLTEyVDE1OjA5OjUzKzAxOjAwEKI+ggAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMS0xMlQxNTowOTo1MyswMTowMGH/hj4AAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAAElFTkSuQmCC");
          
                make_link(div,"http://www.nzbking.com/search/?q=%22"+cont+"%22","NZBKing","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAWCAIAAABc9GulAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH4AgTADojL4KtmQAABSFJREFUOMutVetPk2cUf7/7VywhJvsnjIsydRE6poSr4kBBlngJTBkMaLgKtKMNYLmIBWNkYTJx0znYAKHte7+076VXWkDBOFEsfS+lQIGdtnHqtg/L4snvPTl53vP8znnOc/IcRJL8BOGiKAEnBYwUUUr4D+CTcGGUiyBdBMGTAJIHEqCS3H6E49w7u3sgoOJ7e9tJxN+x38PuWzvls5Pc+JfEd/Y4TgJSz94HFafTi9CshJMMxVA0Q1AUTpI4QWCgKZKgaYoBMDQYJIHjGIaiDgCGOnDUjmNzGDbnwGbfArc9dthnHRTCuDw0x3NOjhc4v98fDAZDoRBosHne5XI5nU6OY1kS4uBAisIH7ASGEjjw2jDUhqL2FByoY8Zms6EM4pT8uQVneMFVWXkpLy//wIEDFRWVOp2uuLhYEPicnByDwVBRUVFdXe31ehkmlTdF0yRNw1EIhqQZEmImQbEoSmOYC1nX4h+lfTw5+YvR2NHS0myxWHJzcy9evFhQUGC1WktLS7u7uwcGBm7fvh0IBNxutyCKkD+czOlinTzL87zAuwWnW+QlURBIioUuAtKd9KNHrlZV2GxzL1686O3t7e/vB5bBwcG+vr6uri4gffnypaqqS0tLqbK4vT5fcMnt9XBumvcJTkkILASkeZFbpHGR4th55I9X0aqaqmPHDs/NzW1ububl5eE4DnRACtmVlJSMjo6urq6azeasrCxdpo4g8aOfHPEGQp6A95zx7B16pML67ZDDkmnUZZq+qL3X4BNXkPml1R/ujR377PDIyIimaQcPHoS2gJqmpaWBsW/fvvHx8Ugkkp+fX1lZeeHChZtWa8anx1kCm1l43HKv5Zvv6+5g1rKx8+X3v7p8/2v9T01ecRnxzq9MTk+XlBQ2NDSEw+Hs7Gzggvs5dOgQtMH+/fvLyspgpaam5tatW8DY3Nzyncm88nxxwN4XXBNu/tpDSDPnRy8P2iwDs92myU6PsAKky49+m+rvv67THYd+0Ov1QFFbW4thWFtbG1x9RkZGPB6vr9cPDQ1BTZoam0rKS/fW97onzYth//CD67bAzKUfr9yw9fTMmq9NGSXxGeILLj+cmAothDJ1GcBit9tTpCzLtLa2Pnj4oLy8nGEZuLrh4WHQUHqHHQUfw6P24HpAP91hW5pummzqmTVZbGbDjNEDNfWFlq9W12vRiMHQlp6ebrfbhoasRUVFxcVfdnf3dHZ2mkymEydOmN7I1aorvZ290nOxaPz0aVNpF9pvnu6yTFsaHzV3TBkbJq55hCeI6FsoKDoTDq89fbp47tzZ9PQj+vrGU6cKTxcVrjx7Cg17d+zuyeyT7R3tUArosLq6OgRBrJM3fl4bK+oqe/IqaJww4RLWPtFp+P1684RJcIUQTvQrmqJFtVhs429Pw/ZOfHN7eyu++e4idDjoxcACaHlTUaMq9EwUvg0tuqUq2jrLeBGSc8tqRNOguxVFWZeVcBKKrEQVbUPRwE8Gh+iGFttMRM3K+rypsTUWiW1FY0pii6LKsFVNOEZlWX5NkiJCspKsykCa+J8gXZOVV3LCUBJQI7K6nkBiJQKk+vqG3LwcMJJZyClJOAI0OaJGMEpCSEaCKHB2TYNwEVULq9prOAUkmEQkBdgA2NqOvXmMt9SooqqyokYSSDpsxKKypuKUiFCs+8M+0hQNx3dKMANS42Q3OR7+Fbvvj43dfyAlMJlYFsaJx4+SLpwWMIrHkuPsf4HHSZ5MDD6nKPn+BIBEonlFto6lAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTA4LTE5VDAwOjU4OjM1KzAyOjAwT8rRLgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0wOC0xOVQwMDo1ODozNSswMjowMD6XaZIAAAAASUVORK5CYII=");

                make_link(div,"http://binzb.com/search?q="+method5,"BiNZB","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAWCAYAAADTlvzyAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH4AgTASY2pep+GAAAA1ZJREFUSMftVUtLW1EQjmJ9gBUpUkUIiGiFBDUQkazqwirEhSgq/gJduGiJj42iIihS0fqAgoiC4mshCuLGB4pElEqFShuNCdqkaqzWGGl9gKiZzow313tza3ftph043JnvPL5z5nxnrgr+sqn+E/4Rwr29PVCpVGJ7kZ3NnbeTk+CMi4NbGoj4+7U1xsfHxyEmJgZcLpdsHrXFxUXo7u6WYWNjY3LChYUFxcTty0uAri5woG8TFq6orORJvb29HC8tLSnmDQwMQFlZmQyLiIiQE87Nzd0tWFEBxpwc9t9OTADMzsJRVBRsn5wwptFqedLQ0BDHXq8X6urqoKGhAQoKChibnp6GwsJC9js6OiAoKIj9m5ube8KZmRkGxV2g/6qx8S5YXgbHxYW4W7IJ3Ix0PBkR+zCDwQBaYXO0AcJ3dnbuCX2glPBlUxPAygr80OvBeX4uEu7v7ys2SBYcHAwhISHsp6amioROp1NJOIup8yd8Qxc9OAhf0f98eioStrW1wfz8vGw8LUZxVVUVxykpKUxK1t/fz31XV1dK0ajVaoiOjmbfRR0Cof34mLHHePlpaWmKE5pMJtkp9JgVinU6HX9J0TLRkJT91cY2PAyHAQFgPTxkzFRezt9GvF//jEjj9PR02Vp5eXm/fhYajQaeJSWx34RkMDoKR6gyy8EBY+9WV/mbnJwsEhwLpy8tLRUXpXQSlpmZKZLSOMUdnp2diTvWZmUxoRvF8AmF4iOIj49nPwBPTlZbW8uxxWIRCRMTEyEhIYF9s9nM/cN0gIdU+txohCd4CkrpCSrvo1CJyHyPOiwsjOPw8HCFYmlTRCpNeWtr68OEaiR7ikrzEa7v7or9ZqG6REZGgtvtZr+5uVlGmITXQtcjJWxvb1dWmpqaGqivr2ffUFQEMDIC3wID4YPDoRAJEXZh6SO/CMd2dnZCdXU1bGxsQEZGBuN9fX1gxGyRPzU19fta+hrJ6IQHVLTtdsYuqL4Kj5xi/5pJjZ5NcXGxAj/FtywS0oVLOx+Fht4dBUXzJTYWHIISvwuiKikp4ZT19PQoFs7Pz4eWlhYZlpubq/wfUio2Nzf565Xcxy0qlGxdosLr62vweDzsb21tgR0zQM1qtYJ0Peqz2Wz/2B//J4rpBnvXYlU1AAAAIXRFWHRDcmVhdGlvbiBUaW1lADIwMTY6MDg6MTkgMDE6MzY6NTclI3DcAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTA4LTE5VDAxOjM4OjU1KzAyOjAwvIbLbwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0wOC0xOVQwMTozODo1NCswMjowMGuseGcAAAAASUVORK5CYII="); 

                make_link(div,"http://nzbfriends.com/?q="+method6,"NzbFriends","data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA+Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBkZWZhdWx0IHF1YWxpdHkK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAGQAZAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A9U8b6neWMWl29neSWYu7kxyzRKrOFEbthdwI5IHaub+16h/0Nms/98W//wAbqLxzrd3fa1Dpj6abb7DO0qSvLkzIUKhlGOnPqcdDXIahe3vllY3MY9R1r5nMsZXWJ5KM7K34nj4zEVVW5acrI9R8D6tfXt9rFjd30t7HaNC0U0yIsmHUkg7QAcEccd67KvCfBHiHUvCmpPavod3fT6wIZoP3m1mT5sMMg5HPqOle65P90172FlJ0kpv3luenRb5Epb9Tzq7OhnxBpsV/b6RIZL2+F411DE7qoZzHuZhlR93HTIxXn+gWd7aeC7y9vLTQNQu3UxWNhNHaJJGnP72RzhywAwBknJ5FfQ1FbuKe6NLI8ttnsbjRbN520qQw+G44oWcxG4juQv3Vz84PTj1969SoopjP/9k=");          
          
                make_link(div,"https://www.usenet-crawler.com/search?val="+method3 +('&age=-1&index=3'), "Usenet_crawler","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAHtSURBVDhPrZPNThNRFMf/M739YJjSdmpLaAsKpCF+Rt2amPgALkh4Ax6DsHDjAxifww1LXeHaRBI+AkRjwJSC0k5xOnU6X5xzpl0IrsST3Nwz596553f+91wtJsMNTB/N/2za9842IUS4Zd5BLp3HGOjHr6/wgj7K5px8nztHyCpDfC9wZTYyRWhvP6zEfuRh+ekr3C4/QRB6svju0zqOOlt4+XiNvmJsfH6Neum+JGjZu7Ln7swLqFrpHsLIR06ZEtS0pKrK1AL9FksWPmDWeoRKfgHWZIP8h8me/OLNNVCnvUMEVALXyxbHkcznzjFO7D389i8Em32VyuL50iqUnpE9bHolP48qoWRGAnEJPEqTNVSnmiScKeKyXzLq0K5A6z+dbzgjxYcjZZmAh91vUfwLkTlE4Yhvuy1SIyEcm87XVyVxrhIUmYDIEgJT/KJRu07Q6R/LHfvhQAJjgp57CqZjMqZgvzdoXycoGDOSjYW6GJyhP+zKMHNlurI60mpC6Lh+M1uG63Xp8BMZ7tCGYieMQ+y3N3HQ/ojpQlNOZoou6eAHA8nK9U9kCni/8wbt3oHsaU4/40bi7oqkZRvWA8rUkEVuonQqRz8V5QBuJGvU1iqVXKNlzv6HxxRFkbweTWNsif1hHGf7+xpwCfCm4i717Co0AAAAAElFTkSuQmCC");
      
   
				div.style.display="none";
				newelem.addEventListener("mouseover",make_visible,false);
				newelem.appendChild(div);
		}
	}
}

 

function make_visible(e){
	var div=e.target.getElementsByTagName("div")[0];
	if(div){
		if(olddiv){
			olddiv.style.display="none";
		}
		olddiv=div;
		div.style.display="block";
	}
}

var olddiv;
add_links();
