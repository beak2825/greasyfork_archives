// ==UserScript==
// @name        SC2CL
// @description Propose en lien la fiche CL Letterboxd et IMDB depuis une fiche SC
// @author      teragneau
// @match       https://www.senscritique.com/film/*
// @version     1.1
// @namespace https://greasyfork.org/users/753408
// @downloadURL https://update.greasyfork.org/scripts/424261/SC2CL.user.js
// @updateURL https://update.greasyfork.org/scripts/424261/SC2CL.meta.js
// ==/UserScript==

var tt = hachette_productData.movie_id_imdb.substring(2)
var el = document.getElementsByClassName('d-menu-list')[0]
//         <circle cx="11" cy="16" r="6" stroke="#FEFEFE" stroke-width="3" fill="none" />


el.innerHTML += `<li><a href="https://www.cinelounge.org/imdb2cl/`+tt+`"  target="_blank" style="vertical-align: bottom; margin-bottom:-15px; display: inline-block; padding: 14px;" onmouseover="this.style.background='#1e1e1e'; document.getElementById('cafeAuxRhum').style.filter=' brightness(110%) contrast(125%)';" onmouseout="this.style.background=''; document.getElementById('cafeAuxRhum').style.filter='brightness(100%)';">

<svg id="cafeAuxRhum" style="float:left; width: 28px; height: 32px; filter: brightness(100%);" title="Fiche CinéLounge">
         <circle cx="14" cy="16" r="13" stroke="#BBBBBB" stroke-width="1" fill="#7A7A7A" />
         <path d ="M 15,10 a 5.35 6.3 15 1 0 -1,10" fill ="none" stroke ="#FEFEFE" stroke-width ="2.75" />
         <polygon points="16,8 18.5,8 17,22 14,22" fill ="black"/>
         <rect x="15" y="20" width="8.3" height="2.5" fill="black"/>
      </svg>
</a></li>` // ajouter un bouton CL

//el.innerHTML += `<li><a href="https://letterboxd.com/imdb/`+tt+`"  target="_blank" style="vertical-align: bottom; margin-bottom:-15px; display: inline-block; padding:17px 14px;" onmouseover="this.style.background='#1e1e1e'; document.getElementById('cafeAuRhum').style.filter='grayscale(100%) brightness(110%) contrast(125%)';" onmouseout="this.style.background=''; document.getElementById('cafeAuRhum').style.filter='grayscale(100%) brightness(100%)';"><img id="cafeAuRhum" src="https://www.cinelounge.org/images/logo.png" style="float:left; width: 26px; filter: grayscale(100%) brightness(100%);" title="Fiche CinéLounge"';"/></a></li>` // ajouter un bouton CL Bis

el.innerHTML += `<li><a href="https://letterboxd.com/imdb/`+tt+`"  target="_blank" style="vertical-align: bottom; margin-bottom:-15px; display: inline-block; padding: 14px 14px;" onmouseover="this.style.background='#1e1e1e'; document.getElementById('cafeEtRhum').style.filter=' brightness(135%) grayscale(80%) contrast(100%)';" onmouseout="this.style.background=''; document.getElementById('cafeEtRhum').style.filter='brightness(120%) grayscale(80%)';">
<svg id="cafeEtRhum" style="float:left; width: 76px; height: 32px; filter: brightness(120%) grayscale(80%);" title="Fiche CinéLounge" xmlns="http://www.w3.org/2000/svg">
	<circle fill="#FF8000" cx="14" cy="14" r="14"/>
	<circle fill="#40BCF4" cx="62" cy="14" r="14"/>
	<circle fill="#00E054" cx="38" cy="14" r="14"/>
	<path d="M50 6.785c1.27 2.107 2 4.576 2 7.215 0 2.64-.73 5.108-2 7.215-1.27-2.107-2-4.576-2-7.215 0-2.612.715-5.057 1.96-7.15zm-24 0c1.27 2.107 2 4.576 2 7.215 0 2.64-.73 5.108-2 7.215-1.27-2.107-2-4.576-2-7.215 0-2.612.715-5.057 1.96-7.15z" fill="#FFF"/>
</svg>
</a></li>` // ajouter un bouton Letterboxd
el.innerHTML +=`<li><a href="https://www.imdb.com/title/tt`+tt+`/" style="vertical-align: -23px; display: inline-block; padding: 14px 14px;" onmouseover="this.style.background='#1e1e1e'; document.getElementById('rhumAuCafe').setAttribute('fill', '#F2F2F2');" onmouseout="this.style.background='';document.getElementById('rhumAuCafe').setAttribute('fill', '#DCDCDC');" target="_blank"> <svg width="64" height="32" style=" float:left; vertical-align: -10.5px;" version="1.1"><g id="rhumAuCafe" fill="#DCDCDC"><rect x="0" y="0" width="100%" height="100%" rx="4"></rect></g><g transform="translate(8.000000, 7.00000) scale(1)" fill="#000000" fill-rule="nonzero"><polygon points="0 18 5 18 5 0 0 0"></polygon><path d="M15.6725178,0 L14.5534833,8.40846934 L13.8582008,3.83502426 C13.65661,2.37009263 13.4632474,1.09175121 13.278113,0 L7,0 L7,18 L11.2416347,18 L11.2580911,6.11380679 L13.0436094,18 L16.0633571,18 L17.7583653,5.8517865 L17.7707076,18 L22,18 L22,0 L15.6725178,0 Z"></path><path d="M24,18 L24,0 L31.8045586,0 C33.5693522,0 35,1.41994415 35,3.17660424 L35,14.8233958 C35,16.5777858 33.5716617,18 31.8045586,18 L24,18 Z M29.8322479,3.2395236 C29.6339219,3.13233348 29.2545158,3.08072342 28.7026524,3.08072342 L28.7026524,14.8914865 C29.4312846,14.8914865 29.8796736,14.7604764 30.0478195,14.4865461 C30.2159654,14.2165858 30.3021941,13.486105 30.3021941,12.2871637 L30.3021941,5.3078959 C30.3021941,4.49404499 30.272014,3.97397442 30.2159654,3.74371416 C30.1599168,3.5134539 30.0348852,3.34671372 29.8322479,3.2395236 Z"></path><path d="M44.4299079,4.50685823 L44.749518,4.50685823 C46.5447098,4.50685823 48,5.91267586 48,7.64486762 L48,14.8619906 C48,16.5950653 46.5451816,18 44.749518,18 L44.4299079,18 C43.3314617,18 42.3602746,17.4736618 41.7718697,16.6682739 L41.4838962,17.7687785 L37,17.7687785 L37,0 L41.7843263,0 L41.7843263,5.78053556 C42.4024982,5.01015739 43.3551514,4.50685823 44.4299079,4.50685823 Z M43.4055679,13.2842155 L43.4055679,9.01907814 C43.4055679,8.31433946 43.3603268,7.85185468 43.2660746,7.63896485 C43.1718224,7.42607505 42.7955881,7.2893916 42.5316822,7.2893916 C42.267776,7.2893916 41.8607934,7.40047379 41.7816216,7.58767002 L41.7816216,9.01907814 L41.7816216,13.4207851 L41.7816216,14.8074788 C41.8721037,15.0130276 42.2602358,15.1274059 42.5316822,15.1274059 C42.8031285,15.1274059 43.1982131,15.0166981 43.281155,14.8074788 C43.3640968,14.5982595 43.4055679,14.0880581 43.4055679,13.2842155 Z"></path></g></svg></a></li>` // ajouter un bouton imdb
// double slash au début d'une ligne pour mettre en commentaire ; ligne précédente pour retirer imdb, ligne d'avant pour retirer CL