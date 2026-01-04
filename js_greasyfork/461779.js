// ==UserScript==
// @name          Facebook most recent figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       0.7
// @author        figuccio
// @description   reindirizza ha facebook recent 2023
// @match         https://*.facebook.com/*
// @run-at        document-start
// @icon          https://www.google.com/s2/favicons?domain=facebook.com
// @grant         GM_registerMenuCommand
// @grant         GM_addStyle
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/461779/Facebook%20most%20recent%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/461779/Facebook%20most%20recent%20figuccio.meta.js
// ==/UserScript==
 //torna ai post piu popolari mostra il title
  function fixbacktotoppostslink() {
// correggi il collegamento alle storie principali per un nuovo design
  var x;
  x=document.querySelector('div[role="main"] a[href="/"][aria-label]');

  x.id="aa";
  x.title="Post popolari";
}
 window.setTimeout(fixbacktotoppostslink,2000);
//////////////////////////////aggiunto titolo icona facebook e home
(function a() {
    window.setTimeout(a,1000);
    //facebook mostra recenti home e logo 2023
    //////////////////////////////////////////////////////////
	var title=document.querySelectorAll("div[role='banner'] a[role='link'][href='/'],div[role='banner']+div[data-isanimatedlayout] a[role='link'][href='/']");
    if(title && title.length>1)
    //{evita errore triangolo giallo}
   {title=document.querySelectorAll("a[role='link'][href='/']");}
	if(title && title.length>1)

	                  //togliere il 3 e mettere 2 cosi torna ai post popolari reindirizza al link normale e non recent
                     {for(var i=0;i<2;i++){
                     var link = title[i];
                     var url = link.getAttribute("href");
                     var figuccio = "/?sk=h_chr";
                     title[i].setAttribute("href", figuccio);
	                 title[i].title="Most Recent"
                      //--- Attiva il pulsante appena aggiunto.
title[i].addEventListener("click",function(){window.location.href = "https://www.facebook.com/?sk=h_chr";});
	  }
                }
  })();
///////////////////////////////////////////////////////////////////////////////
                      // Verifica che l'URL principale sia il più recente
if (document.URL == "https://www.facebook.com/home.php") window.location.href = "/?sk=h_chr";//log in da google

