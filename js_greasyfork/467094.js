// ==UserScript==
// @name          Facebook new feed figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       0.2
// @author        figuccio
// @description   feed aggiornamento feed recenti facebook 2023
// @match         https://*.facebook.com/*
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at        document-start
// @icon          https://facebook.com/favicon.ico
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/467094/Facebook%20new%20feed%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/467094/Facebook%20new%20feed%20figuccio.meta.js
// ==/UserScript==
 window.addEventListener('load', function() {
        // Attendi che la pagina si carichi completamente
  setTimeout(fixbacktotoppostslink, 1000); // Regola il ritardo se necessario
   });

function fixbacktotoppostslink() {
// fix top stories link for new design
  if(!document.getElementById('newtopstorieslinkdiv')){
    var newtopstorieslinkdiv=document.createElement('div');
    newtopstorieslinkdiv.id="newtopstorieslinkdiv";
    newtopstorieslinkdiv.style.fontSize="initial";
    newtopstorieslinkdiv.style.fontWeight="initial";

    newtopstorieslinkdiv.display="inline";
  var newtopstorieslink=document.createElement('a');
    //colore scritta Back to Top Posts
    newtopstorieslink.setAttribute('style',"color:yellow;background:red;border:2px solid lime;border-radius:8px;")
    newtopstorieslink.textContent="Back to Top Posts";
    newtopstorieslink.title="Torna in Home";
    newtopstorieslink.href="/?h_nor#topstories";

    newtopstorieslinkdiv.appendChild(newtopstorieslink);
	var h1s=document.querySelectorAll('h1');
	var feedsh1;
	if(h1s.length>1)
      //aggiunto { }triangolo giallo
      {feedsh1=1}
	else feedsh1=0;

    if(document.querySelectorAll('h1')[feedsh1] && document.querySelectorAll('h1')[feedsh1].textContent.match(/^Feeds/))
  	  document.querySelectorAll('h1')[feedsh1].parentNode.insertBefore(newtopstorieslinkdiv,document.querySelectorAll('h1')[feedsh1].nextSibling);
  }

// correggere il collegamento delle storie principali per il vecchio design
 var y,x;
  //x=document.querySelector('a[aria-label="Back to Top Posts"]');
  x=document.querySelector('div[role="main"] a[href="/"][aria-label]'); // should now work for all languages
  if(!x){
	if(debug)
	  console.log('didnt find (plain) top stories link');
	return;
  }

  x.id="aa";
  y=x.cloneNode(true);
  y.id="topstorieslink";
  if(!document.querySelector('#topstorieslink'))
    x.parentNode.insertBefore(y,x.nextSibling);

  document.getElementById('fbpfreestyler').innerText+=" /*hide duplicate top stories link*/ #aa {display:none !important}";
  document.getElementById("topstorieslink").href="/?sk=h_nor#topstories";
   // document.getElementById("topstorieslink").href="/";
  if(x.style && x.style.display=='none')
	 x.style="block";
  x=y=null;
}

window.setTimeout(fixbacktotoppostslink,3000);
///////////////////////////////////////////////////////////////////
GM_registerMenuCommand("mostra titolo sui post popolari",fixbacktotoppostslink);



(function a() {
    window.setTimeout(a,1000);
    //facebook mostra recenti home e logo 2023
	var title=document.querySelectorAll("div[role='banner'] a[role='link'][href='/'],div[role='banner']+div[data-isanimatedlayout] a[role='link'][href='/']");
      if(title && title.length>1)
    //{evita errore triangolo giallo}
   {title=document.querySelectorAll("a[role='link'][href='/']");}
	if(title && title.length>1)
    //{evita errore triangolo giallo}
	                  //togliere il 3 e mettere 2 cosi torna ai post popolari reindirizza al link normale e non recent
                     {for(var i=0;i<2;i++){
                     title[i].href="/?sk=h_chr";
	                 title[i].title="Most Recent"
                     title[i].id="rrr";
                      //--- Attiva il pulsante appena aggiunto.
title[i].addEventListener("click",function(){window.location.href = "/?sk=h_chr";});

	  }
                }
  })();

setTimeout(fixbacktotoppostslink, 9000);
