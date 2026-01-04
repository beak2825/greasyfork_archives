// ==UserScript==
// 
// @description Ajoute des liens vers Allociné et Imdb sur le site Binnews
// @namespace   http://blog.kodono.info/
// @name        ImdBinnewZ 
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
// @author      Jarod, Stinky
// @version     1.5
// 
// @downloadURL https://update.greasyfork.org/scripts/34724/ImdBinnewZ.user.js
// @updateURL https://update.greasyfork.org/scripts/34724/ImdBinnewZ.meta.js
// ==/UserScript==
// 
// 
// ######################   THANK'S TO JAROD FOR THE ORIGINAL AND PREVIOUS VERSIONS OF ALLOCINE SCRIPT   ######################
//
//                                     ==> http://userscripts-mirror.org/scripts/show/8421
//
// 
// ================================================== UPDATE HISTORY ==========================================================
// 
// v1.5 2018-03-12          - Modif recherche google par DuckDuckGo
// 
// v1.4 2018-01-07          - Modification des liens
// 
// v1.3 2017-11-07          - Modification des liens
//
// v1.2 2017-11-07          - Modification du texte Allociné (raccourcis en "Allo")
//                          - Modification des adresses de Binnewz, ajout du .me et du .biz pour que le script soit actif sur ses 2 domaines
//                          - Modification de l'icone du script par celui de Binnewz
//                          
// v1.1 2017-11-03          - Amelioration du script, Ajout d'un lien Imdb 
// 
// v1.0 2017-11-02          - Modification de la recherche vers allociné via google 

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

   
for (var i=0; i < document.getElementsByTagName('a').length; i++) {
  var link = document.getElementsByTagName('a')[i];
  var aUrl = link.href.split("/");
  for (var j=0; j < aUrl.length; j++) {
    
    if ((aUrl[j] == "www.imdb.com")||(aUrl[j] == "www.allocine.fr")||(aUrl[j] == "www.cineserie.com")||(aUrl[j] == "www.themoviedb.org")||(aUrl[j] == "www.dvdfr.com")||(aUrl[j] == "www.thetvdb.com")||(aUrl[j] == "www.cinemotions.com")||(aUrl[j] == ".wikia.com")||(aUrl[j] == "www.netflix.com")||(aUrl[j] == "anidb.net")||(aUrl[j] == "www.animeka.com")||(aUrl[j] == "www.anime-kun.net")||(aUrl[j] == "www.cinemafantastique.net")||(aUrl[j] == "cinemur.fr")||(aUrl[j] == "www.planete-jeunesse.com")||(aUrl[j] == "www.commeaucinema.com")||(aUrl[j] == "www.imdb.fr")||(aUrl[j] == "www.premiere.fr")||(aUrl[j] == "cinemafantastique.net")||(aUrl[j] == ".cinemafantastique.be")||(aUrl[j] == "www.blu-ray.com")||(aUrl[j] == "bluray.highdefdigest.com")||(aUrl[j] == "www.cinemafantastique.be")||(aUrl[j] == "www.bluray-disc.de")||(aUrl[j] == "cinema.jeuxactu.com")||(aUrl[j] == "fr.wikipedia.org")) {

      var str = "<a style=\"color: #FFCE00; background-color: black\" target=\"_blank\" href=\"https://duckduckgo.com/?q=!allocine%20"+(link.innerHTML.replace(/ /g,"%20").replace(/-/g,"").replace(/&/g,"and").replace(/{+.*?}+/g, "").replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "").replace(/S[0-9].*/g,"").replace(/E[0-9].*/g,"").replace(/Ep[0-9].*/g,"").replace(/Volume.*/g,"").replace(/Vol[0-9].*/g,"").replace(/Episode.*/g,"").replace(/Saison.*/g,"").replace(/Intégrale.*/g,""))+"\">Allo</a>";
      var str2 = document.getElementsByTagName('a')[i].parentNode.innerHTML;
      document.getElementsByTagName('a')[i].parentNode.innerHTML = str2 + " " + str;

    }if ((aUrl[j] == "www.allocine.fr")||(aUrl[j] == "www.imdb.com")||(aUrl[j] == "www.cineserie.com")||(aUrl[j] == "www.themoviedb.org")||(aUrl[j] == "www.dvdfr.com")||(aUrl[j] == "www.thetvdb.com")||(aUrl[j] == "www.cinemotions.com")||(aUrl[j] == ".wikia.com")||(aUrl[j] == "www.netflix.com")||(aUrl[j] == "anidb.net")||(aUrl[j] == "www.animeka.com")||(aUrl[j] == "www.anime-kun.net")||(aUrl[j] == "www.cinemafantastique.net")||(aUrl[j] == "cinemur.fr")||(aUrl[j] == "www.planete-jeunesse.com")||(aUrl[j] == "www.commeaucinema.com")||(aUrl[j] == "www.imdb.fr")||(aUrl[j] == "www.premiere.fr")||(aUrl[j] == "cinemafantastique.net")||(aUrl[j] == ".cinemafantastique.be")||(aUrl[j] == "www.blu-ray.com")||(aUrl[j] == "bluray.highdefdigest.com")||(aUrl[j] == "www.cinemafantastique.be")||(aUrl[j] == "www.bluray-disc.de")||(aUrl[j] == "cinema.jeuxactu.com")||(aUrl[j] == "fr.wikipedia.org")) {

      var str = "<a style=\"color: black; background-color: #FFCE00\" target=\"_blank\" href=\"https://duckduckgo.com/?q=!imdb%20"+(link.innerHTML.replace(/ /g,"%20").replace(/-/g,"").replace(/&/g,"and").replace(/{+.*?}+/g, "").replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "").replace(/S[0-9].*/g,"").replace(/E[0-9].*/g,"").replace(/Ep[0-9].*/g,"").replace(/Volume.*/g,"").replace(/Vol[0-9].*/g,"").replace(/Episode.*/g,"").replace(/Saison.*/g,"").replace(/Intégrale.*/g,""))+"\">Imdb</a>";
      var str2 = document.getElementsByTagName('a')[i].parentNode.innerHTML;
      document.getElementsByTagName('a')[i].parentNode.innerHTML = str2 + " " + str;
 
      }
  }
}


      //Vous pouvez personaliser la couleur du texte et du fond des liens en changeant le code couleur 
      //
      //  => "color: #FFCE00; background-color: black\" (Texte jaune et fond noir)
      //  => "color: black; background-color: #FFCE00\" (Texte noir et fond jaune)
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