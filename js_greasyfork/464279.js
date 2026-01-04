// ==UserScript==
// @name Stream - Tolbek + Clones Widescreen + TMDB (USw) v.93
// @namespace https://greasyfork.org/en/users/8-decembre
// @version 930.00
// @description Adaptation de Stream - Tolbek + Clones Widescreen Pour "Remplacer div par card et ajouter posters sur les site de streaming [GreasyFork]". Celui-ci remplace les Titres des Films proposés par des cards et ajoute les posters depuis l'API The Movie Database.
// @author decembre
// @license GPL version 3 or any later version;
// @grant GM_addStyle
// @run-at document-start
// @match *://*.boomycloud/*
// @match *://*.pigraz.com/*
// @match *://*.soponov.com/*
// @match *://*.udriz.com/*
// @match *://*.bradza.com/*
// @match *://*.gomdax.com/*
// @match *://*.yakwad.com/*
// @match *://*.yarkam.com/*
// @match *://*.prifaz.com/*
// @match *://*.iramiv.com/*
// @match *://*.fimior.com/*
// @match *://*.daykaz.com/*
// @match *://*.bovriz.com/*
// @match *://*.tomacloud.com/*
// @match *://*.toblek.com/*
// @match *://*.vistrov.com/*
// @match *://*.narmid.com/*
// @match *://*.slatok.com/*
// @match *://*.komrav.com/*
// @match *://*.sopror.com/*
// @match *://*.vokorn.com/*
// @match *://*.dabzov.com/*
// @match *://*.zambod.com/*
// @match *://*.ovoob.com/*
// @match *://*.baflox.com/*
// @match *://*.rizlov.com/*
// @match *://*.skimox.com/*
// @match *://*.brodok.com/*
// @match *://*.toswi.com/*
// @match *://*.brikoz.com/*
// @match *://*.avbip.com/*
// @match *://*.zinroz.com/*
// @match *://*.vadrom.com/*
// @match *://*.ladrov.com/*
// @match *://*.zivbod.com/*
// @match *://*.wavmiv.com/*
// @match *://*.voldim.com/*
// @match *://*.sevrim.com/*
// @match *://*.nakrab.com/*
// @match *://*.maxtrab.com/*
// @match *://*.fridmax.com/*
// @match *://*.mivpak.com/*
// @match *://*.alkiom.com/*
// @match *://*.trodak.com/*
// @match *://*.podvix.com/*
// @match *://*.ozpov.com/*
// @match *://*.zodrop.com/*
// @match *://*.padlim.com/*
// @match *://*.opkap.com/*
// @match *://*.batkip.com/*
// @match *://*.lekrom.com/*
// @match *://*.lofroz.com/*
// @match *://*.roplim.com/*
// @match *://*.plokim.com/*
// @match *://*.zaltav.com/*
// @match *://*.mokrof.com/*
// @match *://*.fosrak.com/*
// @match *://*.krosov.com/*
// @match *://*.izorp.com/*
// @match *://*.tartog.com/*
// @match *://*.ofziv.com/*
// @match *://*.saftim.com/*
// @match *://*.fevloz.com/*
// @match *://*.ziprov.com/*
// @match *://*.kikraz.com/*
// @match *://*.drovoo.com/*
// @match *://*.kejrop.com/*
// @match *://*.chotrom.com/*
// @match *://*.dorcho.com/*
// @match *://*.imzod.com/*
// @match *://*.borbok.com/*
// @match *://*.sodpak.com/*
// @match *://*.lamdop.com/*
// @match *://*.rivbip.com/*
// @match *://*.azrov.com/*
// @match *://*.blorog.com/*
// @match *://*.didraf.com/*
// @match *://*.viabak.com/*
// @match *://*.kradax.com/*
// @match *://*.quepom.com/*
// @match *://*.zodrok.com/*
// @match *://*.balvoz.com/*
// @match *://*.movbor.com/*
// @match *://*.faskap.com/*
// @match *://*.aksolv.com/*
// @match *://*.vifip.com/*
// @match *://*.lizdi.com/*
// @match *://*.fianzax.com/*
// @match *://*.tiviob.com/*
// @match *://*.parlif.com/*
// @match *://*.vrewal.com/*
// @match *://*.brafzo.com/*
// @match *://*.todrak.com/*
// @match *://*.yavdi.com/*
// @match *://*.zadriv.com/*
// @match *://*.ovgap.com/*
// @match *://*.sorbod.com/*
// @match *://*.trochox.com/*
// @match *://*.xodop.com/*
// @match *://*.ravkom.com/*
// @match *://*.pavdo.com/*
// @match *://*.tetriv.com/*
// @match *://*.zirkad.com/*
// @match *://*.grozov.com/*
// @match *://*.yalkaz.com/*
// @match *://*.droskop.com/*
// @match *://*.nokrom.com/*
// @match *://*.bigbov.com/*
// @match *://*.xadrop.com/*
// @match *://*.zadrip.com/*
// @match *://*.friloz.com/*
// @match *://*.azkov.com/*
// @match *://*.diprak.com/*
// @match *://*.rodzop.com/*
// @match *://*.yortom.com/*
// @match *://*.smitav.com/*
// @match *://*.fotrov.com/*
// @match *://*.kibriv.com/*
// @match *://*.ivrab.com/*
// @match *://*.dofroz.com/*
// @match *://*.fedzak.com/*
// @match *://*.govrad.com/*
// @match *://*.badzap.com/*
// @match *://*.bremob.com/*
// @match *://*.edkoz.com/*
// @match *://*.topkiv.com/*
// @match *://*.kedarp.com/*
// @match *://*.abokav.com/*
// @match *://*.lokarn.com/*
// @match *://*.apirv.com/*
// @match *://*.rodkov.com/*
// @match *://*.lotriz.com/*
// @match *://*.urmaz.com/*
// @match *://*.farliz.com/*
// @match *://*.faljam.com/*
// @match *://*.mobzax.com/*
// @match *://*.nozgap.com/*
// @match *://*.zostaz.com/*
// @match *://*.domgrav.com/*
// @match *://*.malgrim.com/*
// @match *://*.idvram.com/*
// @match *://*.karvaz.com/*
// @match *://*.lomiox.com/*
// @match *://*.vredap.com/*
// @match *://*.biapoz.com/*
// @match *://*.kambad.com/*
// @match *://*.pimtip.com/*
// @match *://*.awdrip.com/*
// @match *://*.dolorv.com/*
// @match *://*.bazrof.com/*
// @match *://*.sakmiz.com/*
// @match *://*.sapraz.com/*
// @match *://*.titrov.com/*
// @match *://*.doksov.com/*
// @match *://*.movpom.com/*
// @match *://*.pokoli.com/*
// @match *://*.veksab.com/*
// @match *://*.staklam.com/*
// @match *://*.vizvop.com/*
// @match *://*.ikfroz.com/*
// @match *://*.votark.com/*
// @match *://*.sibrav.com/*
// @match *://*.obivap.com/*
// @match *://*.alrav.com/*
// @match *://*.odvib.com/*
// @match *://*.instov.com/*
// @match *://*.dubraz.com/*
// @match *://*.toktav.com/*
// @match *://*.dromoy.com/*
// @match *://*.gabanov.com/*
// @match *://*.valdap.com/*
// @match *://*.zorbov.com/*
// @match *://*.dopriv.com/*
// @match *://*.rogzov.com/*
// @match *://*.fakoda.com/*
// @match *://*.prokiz.com/*
// @match *://*.noprak.com/*
// @match *://*.madroy.com/*
// @match *://*.batiav.com/*
// @match *://*.lakrof.com/*
// @match *://*.bramtiv.com/*
// @match *://*.gofram.com/*
// @match *://*.azmip.com/*
// @match *://*.idivov.com/*
// @match *://*.frimiv.com/*
// @match *://*.kobiom.com/*
// @match *://*.vogfo.com/*
// @match *://*.okmaz.com/*
// @match *://*.rolbob.com/*
// @match *://*.dapwop.com/*
// @match *://*.trifak.com/*
// @match *://*.dozbob.com/*
// @match *://*.robluv.com/*
// @match *://*.drikpo.com/*
// @match *://*.pradav.com/*
// @match *://*.morzid.com/*
// @match *://*.kolrag.com/*
// @match *://*.akroov.com/*
// @match *://*.folmiv.com/*
// @match *://*.yakriv.com/*
// @match *://*.savrod.com/*
// @match *://*.fusov.com/*
// @match *://*.lajma.com/*
// @match *://*.xabriv.com/*
// @match *://*.brimav.com/*
// @match *://*.yisera.com/*
// @match *://*.kidraz.com/*
// @match *://*.vadbak.com/*
// @match *://*.adivak.com/*
// @match *://*.pilkol.com/*
// @match *://*.brozlo.com/*
// @match *://*.padolmi.com/*
// @match *://*.edmiv.com/*
// @match *://*.rodorm.com/*
// @match *://*.niztal.com/*
// @match *://*.okrami.com/*
// @match *://*.yepmiv.com/*
// @match *://*.ilmiv.com/*
// @match *://*.robrov.com/*
// @match *://*.albrad.com/*
// @match *://*.dipdri.com/*
// @match *://*.driviv.com/*
// @match *://*.deksov.com/*
// @match *://*.fonzir.com/*
// @match *://*.govioz.com/*
// @match *://*.ipdro.com/*
// @match *://*.kanrak.com/*
// @match *://*.moovbob.com/*
// @match *://*.nodrav.com/*
// @match *://*.ralzom.com/*
// @match *://*.ritrom.com/*
// @match *://*.tokrav.com/*
// @match *://*.tosnov.com/*
// @match *://*.vorviz.com/*
// @match *://*.wifrad.com/*
// @match *://*.xerov.com/*
// @match *://*.zakmav.com/*
// @match *://*.zavzip.com/*
// @match *://*.zinzov.com/*
// @downloadURL https://update.greasyfork.org/scripts/464279/Stream%20-%20Tolbek%20%2B%20Clones%20Widescreen%20%2B%20TMDB%20%28USw%29%20v93.user.js
// @updateURL https://update.greasyfork.org/scripts/464279/Stream%20-%20Tolbek%20%2B%20Clones%20Widescreen%20%2B%20TMDB%20%28USw%29%20v93.meta.js
// ==/UserScript==

(function() {
let css = `
/* FOR GM "Remplacer div par card et ajouter posters sur les site de streaming" by matt1x (2023):
https://greasyfork.org/fr/scripts/463692-remplacer-div-par-card-et-ajouter-posters-sur-les-site-de-streaming
<a href="https://greasyfork.org/fr/scripts/463692-remplacer-div-par-card-et-ajouter-posters-sur-les-site-de-streaming">Remplacer div par card et ajouter posters sur les site de streaming</a>
=== */

/* ==== 0- Stream - Tolbek Clones Widescreen + TMDB (USw) v.93 ==== */

/* LAST VERSION AUTO UPDATE onn Userstyles.org - 20230727.18.24 */


/* REQUEST API KEY TMDB:
<a href="https://stackoverflow.com/questions/31047815/api-key-for-themoviedb-org">API key for themoviedb.org</a>
====== */

/* (new93) SUPP */
#pop-content ,
.column1[style="background-color:#202020;"] #animated-banner,
#animated-banner,
.column1 + .column2 {
    display: none  !important;
}

/* (new6) WIDE RIGHT PANEL - ALL */

.column1 {
    display: inline-block !important;
    float: none  !important;
    width: 100% !important;
    padding: 5px   5px 0 5px !important;
/* border: 1px solid red !important; */
}


/* MOVIES CARDS - ALL  */
.movie-card {
    float: left !important;
    vertical-align: top;
    width: 100% !important;
    min-width: 10.75% !important;
    max-width: 10.75% !important;
    height: 32.5vh !important;
    margin: 0 4px 4px 0 !important;
    padding: 3px !important;
    border-radius: 5px;
    text-align: center;
/*     transition: transform 0.3s ease 0s; */
    transition: unset  !important;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
border: 1px solid #ccc;
background: #222 !important;
/* border: 1px solid red !important; */
}


/* (new6) MOVIE CARD - VISITED */
.movie-card a .movie-poster {
border: 1px solid #333 !important; 
}
.movie-card a:visited .movie-poster {
border: 1px solid green !important; 
}
.movie-card a:visited .movie-info h3 {
color: tomato !important;
}

.movie-card:hover {
    transform: translateY(-5px);
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.movie-poster {
    position: relative;
    width: 100%;
    height: 23vh !important;
    border-radius: 5px;
    overflow: hidden;
/* border: 1px solid aqua  !important; */
}
.movie-poster img {
    display: block;
    height: 100% !important;
    width: 100%;
    transition: transform 0.3s ease 0s;
    object-fit: contain !important;
}

.movie-info {
    float: left !important;
    height: 6vh !important;
    width: 100% !important;
    margin: 5px 0 0 0 !important;
/* border: 1px solid red !important; */
}
.movie-info h3 {
    float: left !important;
    clear: none  !important;
    width: 100% !important;
    height: 6vh !important;
    line-height: 0.9rem !important;
    margin: 0 0 2px 0 !important;
    font-size: 0.8rem !important;
    font-weight: bold;
color: #000000;
color: peru !important;
}
.movie-info p {
   float: left !important;
    margin: 0;
    font-size: 14px;
color: #777;
}

/* (new2) MOVIE CARD - PLAYER - FIRST */
.movie-card:first-of-type {
    float: left !important;
    vertical-align: top;
    width: 100% !important;
    min-width: 42.50% !important;
    max-width: 42.50% !important;
    height: 32.5vh !important;
    margin: 0 16px 4px 10px !important;
    padding: 3px !important;
    border-radius: 5px;
    text-align: center;
    transition: transform 0.3s ease 0s;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
background: #111 !important;
border: 1px solid red !important;
}
.movie-card:first-of-type .movie-poster {
    position: relative;
    float: left !important;
    clear: none !important;
    width: 49% !important;
    height: 31.5vh !important;
    padding: 10px !important;
    border-radius: 5px;
    overflow: hidden;
/* border: 1px solid aqua  !important; */
}
.movie-card:first-of-type .movie-poster img {
    display: block;
    height: 100% !important;
    width: 100%;
    transition: transform 0.3s ease 0s;
    object-fit: contain !important;
}

.movie-card:first-of-type .movie-info {
    float: right !important;
    clear: none !important;
    height: 18vh !important;
    width: 50% !important;
    margin: 9vh 0 0 0 !important;
/* border: 1px solid red !important; */
}
/* COR - FLOAT */
.movie-card:first-of-type .movie-info h3 {
    display: block !important;
    float: left !important;
    clear: none  !important;
    width: 100% !important;
    height: 18vh !important;
    line-height: 2rem !important;
    margin: 0 0 2px 0 !important;
    font-size: 2rem !important;
    font-weight: bold;
color: #000000;
color: peru !important;
}
.movie-card:first-of-type .movie-info p {
   float: left !important;
    margin: 0;
    font-size: 14px;
color: #777;
}


/* (new2) MENU BOTTOM - IN PLAYER - DISPLAY NONE */
br + #dernieajouts.couleur1  center#dernieresajouts {
    position: fixed;
/*     display: inline-block !important; */
display: none  !important;
    height: 20px !important;
    width: 25px !important;
    bottom: 0 !important;
    right: 35px !important;
    text-align: center !important;
    z-index: 5000000 !important;
background-color: red !important;
border: 1px solid red !important;
}
br + #dernieajouts.couleur1  center#dernieresajouts #navWrap  {
    display: inline-block !important;
    width: 100%;
    width: 20px !important;
    height: 18px !important;
    padding:  0 !important;
    text-align: center !important;
background-color: #2a2a2a;
}

/* (new2) PLAYER - OPACITY */

br + #dernieajouts.couleur1 {
    transition-duration: 2s;
/*     opacity: 0.5 !important; */
/* background: linear-gradient(to bottom,  hsla(0,0%,1%,1) 0%,hsla(0,0%,7%,1) 100%); */ /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
}

br + #dernieajouts.couleur1:not(:hover) .movie-card:not(:first-of-type) {
transition: opacity ease 0.7s !important;
    transition-duration: 2s;
opacity: 0.8 !important;
/* filter: opacity(0.1) !important; */
filter: grayscale(1) brightness(0.15);
/* background: red !important; */
}
br + #dernieajouts.couleur1:hover .movie-card:not(:first-of-type) {
transition: opacity ease 0.7s !important;
transition: filter ease 0.7s !important;
    transition-duration: 2s;
opacity: 1 !important;
/* background: red !important; */
}

#dernieajouts.couleur1  .movie-card:hover {
    transform: translateY(0px) !important;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* (new2) MOVIES CARDS - PLAYER PAGE/ AFFICHE - NO ORIGINAL LINKS */
.row .column1[style^="background-color:"] > b ~ #hann ,
.column5 + .column1  #hann ,
.column1 #hann {
display: none !important;
}

/* (new2) MOVIES CARDS - IN PLAYER */
br + #dernieajouts.couleur1 .movie-card {
/*     float: left !important; */
display: inline-block !important;
    vertical-align: top;
    width: 100% !important;
    min-width: 6.5% !important;
    max-width: 6.5% !important;
    height: 21vh !important;
    margin: 0 2px 2px 0 !important;
    padding: 3px !important;
    border-radius: 5px;
    text-align: center;
    transition: transform 0.3s ease 0s;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
background-color: #111 !important;
border: 1px solid #ccc;
/* border: 1px solid aqua !important; */
}

br + #dernieajouts.couleur1 .movie-poster {
    position: relative;
    width: 100% !important;
    height: 13vh !important;
    padding: 0 !important;
    border-radius: 5px;
    overflow: hidden;
/* border: 1px solid aqua  !important; */
}
br + #dernieajouts.couleur1  .movie-card .movie-poster img {
    display: block;
    height: 100% !important;
    width: 100%;
    transition: transform 0.3s ease 0s;
    object-fit: contain !important;
}

br + #dernieajouts.couleur1  .movie-card .movie-info {
    float: left !important;
    height: 6vh !important;
    width: 100% !important;
    margin: 5px 0 0 0 !important;
}
br + #dernieajouts.couleur1  .movie-card .movie-info h3 {
    float: left !important;
    clear: none  !important;
    width: 100% !important;
    height: 5vh !important;
    line-height: 0.9rem !important;
    margin: 0 0 2px 0 !important;
    font-size: 0.75rem !important;
    font-weight: bold;
color: #000000;
}
br + #dernieajouts.couleur1  .movie-card .movie-info p {
    float: left !important;
    margin: 0;
    font-size: 0.7rem !important;
color: #777;
}
/* (new2) IN AFFICHE */
.row .column1[style^="background-color:"] > b ~ .movie-card {
/*     float: left !important; */
display: inline-block !important;
    vertical-align: top;
    width: 100% !important;
    min-width: 8.75% !important;
    max-width: 8.75% !important;
    height: 32.5vh !important;
    margin: 0 6px 4px 0 !important;
    padding: 3px !important;
    border-radius: 5px;
    text-align: center;
    transition: transform 0.3s ease 0s;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
background-color: #fff;
}

/* (new2) FIRST CARD - LARGE - IN AFFICHE */
.row .column1[style^="background-color:"] > b ~ .column20 + .movie-card {
display: inline-block !important;
    vertical-align: top;
    width: 100% !important;
    min-width: 26.85% !important;
    max-width: 26.85% !important;
    height: 32.5vh !important;
    margin: 0 6px 4px 0 !important;
    padding: 3px !important;
    border-radius: 5px;
    text-align: center;
    transition: transform 0.3s ease 0s;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
background-color: #111 !important;
/* border: 1px solid #ccc; */
/* border: 1px solid tomato !important; */
}
.row .column1[style^="background-color:"] > b ~ .movie-card:hover ,
.row .column1[style^="background-color:"] > b ~ .movie-card:hover .movie-poster img {
    transform: unset !important;
}
.row .column1[style^="background-color:"] > b ~ .column20 + .movie-card .movie-poster {
    position: relative;
    float: left;
    height: 100% !important;
    height: 32vh !important;
    width: 40% !important;
    margin: 0 0 0 0 !important;
    border-radius: 5px;
    overflow: hidden;
/* border: 1px solid aqua !important; */
}
.row .column1[style^="background-color:"] > b ~ .column20 + .movie-card .movie-info {
    float: right !important;
    height: 100% !important;
    height: 32vh !important;
    width: 60% !important;
margin: 0 0 0 0 !important;
/* border: 1px solid olive !important; */
}
.row .column1[style^="background-color:"] > b ~ .column20 + .movie-card .movie-info  h3 {
display: inline-block !important;
    vertical-align: top;
    float: none !important;
    clear: none;
    width: 100%;
    height: 29vh !important;
    line-height: 1.9rem !important;
    margin: 0 0 2px !important;
    padding: 11vh 5px 0 5px !important;
    font-size: 1.8rem !important;
    font-weight: bold;
    color: peru;
/* border: 1px solid olive !important; */
}

/* === END  ==== */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
