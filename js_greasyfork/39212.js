// ==UserScript==
// @name         Naruto
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ancord Setter For Site Blokino.red
// @author       edikxl
// @match        http://blokino.red/anime/online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39212/Naruto.user.js
// @updateURL https://update.greasyfork.org/scripts/39212/Naruto.meta.js
// ==/UserScript==

document.getElementById( "sel" ).onchange = function(){ if(this.value.substring(0,4)=="http"){ setTimeout(function(){ if(document.getElementById("mcode_block")){ var xvar=document.getElementById("mcode_block"); xvar.innerHTML=""; xvar.style.display="none"; }},1); if(document.getElementById("film_main")){ var xvar=document.getElementById("film_main"); var href=this.value; var link=href.split("|"); xvar.src=link[0]; var series=document.getElementById("series"); series.value=link[1]; $("#series").trigger("change"); xvar.style.display="block"; } }else{ if(document.getElementById("mcode_block")){ var xvar=document.getElementById("mcode_block"); xvar.innerHTML=this.value; xvar.style.display="block"; } if(document.getElementById("film_main")){ var xvar=document.getElementById("film_main"); xvar.src=""; xvar.style.display="none"; } }  };
document.getElementById( "sel" ).value = document.getElementById( "sel" ).options[ 2 ].value;
document.getElementById( "sel" ).onchange();