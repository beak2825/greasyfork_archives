// ==UserScript==
// @name Through The Ages Boardgaming online UI Enhancement
// @version    1.3.4
// @description  Flat design UI for TTA2 on BGO.
// @match      http://*.boardgaming-online.com/*
// @match      https://*.boardgaming-online.com/*
// @match      http://boardgaming-online.com/*
// @match      https://boardgaming-online.com/*
// @grant    GM_addStyle
// @run-at      document-start
// @namespace https://greasyfork.org/users/38973
// @downloadURL https://update.greasyfork.org/scripts/18813/Through%20The%20Ages%20Boardgaming%20online%20UI%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/18813/Through%20The%20Ages%20Boardgaming%20online%20UI%20Enhancement.meta.js
// ==/UserScript==

function replaceImages(oldUrl, newUrl) {
    var imgs = document.getElementsByTagName('img');
    for (i = 0; i<imgs.length; i++) {
        var imgEl = imgs[i];
        if (imgEl.src.endsWith(oldUrl)) {
            imgEl.src = newUrl;
        }
    }
}

function overrideImage() {
    replaceImages('ma.gif', 'http://tta.nf-solution.com/Icon/Red-Ball-icon.png');
    replaceImages('blue.gif', 'http://tta.nf-solution.com/Icon/Blue-Ball-icon.png');
    replaceImages('yellow.gif', 'http://tta.nf-solution.com/Icon/Yellow-Ball-icon.png');
    replaceImages('ca.gif', 'http://tta.nf-solution.com/Icon/Grey-Ball-icon.png');
    replaceImages('missing.gif', 'http://tta.nf-solution.com/Icon/Black-Ball-icon.png');
    replaceImages('/happy.png', 'http://tta.nf-solution.com/Icon/happy.png');
    replaceImages('/unhappy.png', 'http://tta.nf-solution.com/Icon/unhappy.png');

    replaceImages('/culture.png', 'https://cf.geekdo-static.com/mbs/mb_37754_0.png');
    replaceImages('/science.png', 'http://cf.geekdo-static.com/mbs/mb_37753_0.png');
    replaceImages('/strength.png', 'http://cf.geekdo-static.com/mbs/mb_37755_0.png');

    var imgs = document.getElementsByTagName('img');
    for (i = 0; i<imgs.length; i++) {
        var imgEl = imgs[i];
        if (imgEl.title == "Civil action") {
            imgEl.src = 'http://tta.nf-solution.com/Icon/Grey-Ball-icon.png';
        }
    }
}

function overrideCSS() {

    GM_addStyle( "\
#contenu { \
font-family: 'Trebuchet MS', Helvetica, sans-serif !important; \
}" );

    //-------------------------------------- Player Colors --------------------------------------
    GM_addStyle( "\
#contenu .plateau { \
padding: 0px 10px; \
}" );

    GM_addStyle( "\
#contenu .plateau1 { \
background-color: #eee8e0; \
}" );

    GM_addStyle( "\
#contenu .plateau2 { \
background-color: #eee8e0; \
}" );

    GM_addStyle( "\
#contenu .plateau3 { \
background-color: #eee8e0; \
}" );

    GM_addStyle( "\
#contenu .plateau4 { \
background-color: #eee8e0; \
}" );

    //-------------------------------------- Civilization Board --------------------------------------
    GM_addStyle( "\
#statusBar { \
margin: 4px; \
padding: 2px; \
text-align: center; \
border: none; \
border-radius: 0; \
}" );

    GM_addStyle( "\
#statusBar.statusActive { \
background-color: #eecc66; \
border: none; \
border-radius: 5px; \
}" );

    GM_addStyle( "\
#contenu .dataBox { \
margin: 5px; \
padding: 5px;\
border: none; \
}" );

    GM_addStyle( "\
#indJoueur li.indCulture { \
background-image: url('http://cf.geekdo-static.com/mbs/mb_37754_0.png'); \
}" );

    GM_addStyle( "\
#indJoueur li.indScience { \
background-image: url('http://cf.geekdo-static.com/mbs/mb_37753_0.png'); \
}" );

    GM_addStyle( "\
#indJoueur li.indPuissance { \
background-image: url('http://cf.geekdo-static.com/mbs/mb_37755_0.png'); \
}" );

    GM_addStyle( "\
#contenu .civDataBox { \
background-color: rgba(255, 255, 255, 0.4); \
}" );

    GM_addStyle( "\
#contenu .colony { \
border: none; \
border-radius: 5px; \
box-shadow: none; \
margin: 4px; \
width: 60px; \
padding: 4px; \
background-color: #75750e; \
color: #dad6c5; \
font-size: 11px; \
font-weight: bold; \
}" );

    GM_addStyle( "\
#contenu .imageLeader { \
width: 68px; \
height: 90px; \
border: none; \
border-radius: 5px; \
}" );

    GM_addStyle( "\
#carteJoueur .nomCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
font-size: 11px; \
vertical-align: bottom; \
padding: 3px 8px; \
}" );

    GM_addStyle( "\
#carteJoueur .ageCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
font-size: 12px; \
vertical-align: middle; \
font-weight: bold; \
}" );

    GM_addStyle( "\
#contenu .specialTech { \
border: none; \
border-radius: 5px; \
box-shadow: none; \
margin: 4px; \
width: 60px; \
padding: 4px; \
}" );

    GM_addStyle( "\
#carteJoueur.contourCarte { \
border: 1px solid rgba(0,0,0,0.25); \
box-shadow: none; \
border-radius: 5px; \
margin: 4px; \
}" );

    GM_addStyle( "\
#carteJoueur a { \
border-radius: 5px; \
}" );

    GM_addStyle( "\
#contenu .imageMerveille { \
border: none; \
width: 60px; \
height: 45px; \
margin: 3px; \
border-radius: 5px; \
}" );

    GM_addStyle( "\
#contenu .tta_nocard0 { \
background-color: rgba(255,255,255,0.5); \
border: none; \
box-shadow: none; \
}" );


    //-------------------------------------- Card Row --------------------------------------
    GM_addStyle( "\
#contenu .ongletSelect { \
background-color: #eee8e0; \
border-color: #eee8e0; \
margin-bottom: -3px; \
border-bottom: 3px solid #eee8e0; \
}" );

    GM_addStyle( "\
#contenu .tta_action0 { \
background-color: #f1c40f; \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_action1 { \
background-color: #FFEC9D; \
}" );

    GM_addStyle( "\
#contenu .tta_special0 { \
background-color: #6780c4; \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_special1 { \
background-color: #C2CFF3; \
}" );

    GM_addStyle( "\
#contenu .tta_wonder0 { \
background-color: #794890;  \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_wonder1 { \
background-color: #D7B2E4; \
}" );

    GM_addStyle( "\
#contenu .tta_urban0 { \
background-color: #777777; \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_urban1 { \
background-color: #D2D2D2; \
}" );

    GM_addStyle( "\
#contenu .tta_production0 { \
background-color: #735334; \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_production1 { \
background-color: #E8C39E; \
}" );

    GM_addStyle( "\
#contenu .tta_military0 { \
background-color: #DC3924; \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_military1 { \
background-color: #FFB9AF; \
}" );

    GM_addStyle( "\
#contenu .tta_leader0 { \
background-color: #83a839; \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_leader1 { \
background-color: #CCDE93; \
}" );

    GM_addStyle( "\
#contenu .tta_government0 { \
background-color: #f38f24; \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_government1 { \
background-color: #FFCE9A; \
}" );

    GM_addStyle( "\
#contenu .tta_tactic0 { \
background-color: #fcdfdd; \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_tactic1 { \
background-color: #8d1108; \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_event0 { \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_event1 { \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_bonus0 { \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_bonus1 { \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_pact0 { \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_pact1 { \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_war0 { \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_war1 { \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_aggression0 { \
border: none; \
}" );

    GM_addStyle( "\
#contenu .tta_aggression1 { \
border: none; \
}" );

    GM_addStyle( "\
#card_row { \
border-spacing: 0px; \
border: none; \
border-radius: 0; \
box-shadow: none; \
padding: 5px; \
margin: 0px 20px 0px 0px; \
width: 100%; \
}" );

    GM_addStyle( "\
#card_row .spacerLeft { \
background-color: rgb(226, 213, 195); \
border-bottom: 3px solid rgb(212, 199, 181); \
border-top-left-radius: 0; \
border-bottom-left-radius: 0; \
width: 10px; \
}" );

    GM_addStyle( "\
#card_row .fond1 { \
background-color: rgb(226, 213, 195); \
border-bottom: 3px solid rgb(212, 199, 181); \
}" );

    GM_addStyle( "\
#card_row .fond2 { \
background-color: rgb(216, 193, 162); \
border-bottom: 3px solid rgb(202, 171, 130); \
}" );

    GM_addStyle( "\
#card_row .fond3 { \
background-color: rgb(195, 171, 138); \
border-bottom: 3px solid rgb(158, 126, 84); \
}" );

    GM_addStyle( "\
#card_row .spacerRight { \
background-color: rgb(195, 171, 138); \
border-bottom: 3px solid rgb(158, 126, 84); \
border-top-right-radius: 0; \
border-bottom-right-radius: 0; \
width: 10px; \
}" );

    GM_addStyle( "\
#card_row .nombre { \
color: #46484a; \
font-size: 13px; \
}" );

    GM_addStyle( "\
#carteMain a { \
padding: 0px; \
text-decoration: none; \
display: block; \
cursor: help; \
border: none; \
box-shadow: none; \
border-radius: 0; \ \
margin: 2px; \
}" );

    GM_addStyle( "\
#carte { \
position: absolute; \
left: -999em; \
border: none; \
border-radius: 5px; \
box-shadow: 1px 1px 5px rgba(0,0,0,0.25); \
padding: 0px 0px 0px 0px; \
text-align: center; \
width: 180px; \
z-index: 999; \
}" );

    GM_addStyle( "\
#carte .ssTypeCarte { \
font-weight: normal; \
font-size: 12px; \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
padding: 0px; \
text-align: right; \
margin-top: -18px; \
margin-bottom: 4px; \
}" );

    GM_addStyle( "\
#carte .texteCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
font-size: 12px;\
margin: 0px 0px 0px 0px; \
}" );

    GM_addStyle( "\
#carte .texteCarteG { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
font-size: 12px;\
margin: 0px 0px 0px 0px; \
}" );

    GM_addStyle( "\
#carteMain .nomCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
font-size: 11px; \
vertical-align: bottom; \
padding: 3px 8px; \
color: #ffff; \
border-radius: 5px; \
}" );

    GM_addStyle( "\
#carteMain .dosCarteMilitaire { \
background-color: #7c7770; \
border: none; \
cursor: default; \
border-radius: 3px; \
}" );

    GM_addStyle( "\
#carteMain .ageDosCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
font-size: 11px; \
color: #fff; \
text-shadow: none; \
padding: 6px 0px;\
}" );

    GM_addStyle( "\
#carteRangee a { \
padding: 0px; \
text-decoration: none; \
display: block; \
cursor: url(../images/grab.cur), pointer; \
border: 1px solid 686460; \
box-shadow: none; \
border-radius: 5px; \
margin: 3px; \
}" );

    GM_addStyle( "\
#carteRangee a.paquet { \
box-shadow: none !important; \
}" );

    GM_addStyle( "\
#carteRangee .nomCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
word-wrap: break-word; \
}" );

    GM_addStyle( "\
#carteRangee .ageDosCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
font-size: 40px; \
color: #fff; \
text-shadow: none; \
padding: 13px 0px; \
box-shadow: none; \
}" );

    GM_addStyle( "\
#carteRangee .dosCarteCivile { \
background-color: #9A7541; \
}" );

    GM_addStyle( "\
#carteRangee .ageCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
}" );

    GM_addStyle( "\
#carte .nomCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
word-wrap: break-word; \
}" );

    GM_addStyle( "\
#carte .ageCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
font-size: 16px; \
margin: 2px 0px; \
font-weight: bold; \
}" );


    //-------------------------------------- Player Board --------------------------------------
    GM_addStyle( "\
#contenu .playerBoardBox { \
background-color: transparent; \
}" );

    GM_addStyle( "\
#contenu .titre1 { \
padding-top: 0; \
}" );

    GM_addStyle( "\
#contenu .worker_pool { \
padding: 0; \
background-color: #fbefac; \
border: none; \
box-shadow: none; \
font-size: 11px; \
margin: 0; \
color: #906117; \
vertical-align: top; \
font-weight: bold; \
width: 100px; \
text-align: center; \
border-radius: 0; \
}" );

    GM_addStyle( "\
#contenu .libBatiment { \
text-align: center; \
margin: 0px 1px; \
font-size: 12px; \
font-weight: bold; \
border-top-left-radius: 0; \
border-top-right-radius: 0; \
}" );

    GM_addStyle( "\
#contenu .ageBatiments { \
padding-right: 10px; \
}" );

    GM_addStyle( "\
#descBatiment li a { \
padding: 0; \
}" );

    GM_addStyle( "\
#indJoueur { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
}" );

    GM_addStyle( "\
#contenu .batiment0 { \
padding: 0px; \
margin: 0px; \
border: 2px solid #eee8e0; \
background-color: rgba(255,255,255,0.5); \
}" );

    GM_addStyle( "\
#contenu .batiment1 { \
padding: 4px 4px 0 4px; \
margin: 4px; \
border: 2px solid #eee8e0; \
}" );

    GM_addStyle( "\
#descBatiment ul { \
box-shadow: 1px 1px 5px rgba(0,0,0,0.2); \
}" );

    GM_addStyle( "\
#contenu .tta_element { \
margin: 2px 0px 0px 0px; \
padding: 0 2px; \
border: none; \
background-color: rgba(255, 255, 255, 0); \
}" );

    GM_addStyle( "\
#contenu .tta_resource_bank { \
background-color: rgba(167, 211, 255, 0.3); \
padding: 9px 2px; \
margin-bottom: 0px; \
vertical-align: center; \
text-align: center; \
height: 26px; \
}" );

    GM_addStyle( "\
#contenu .tta_corruption { \
background-color: rgba(104, 179, 255, 0.6); \
width: 40px; \
color: #282838; \
}" );

    GM_addStyle( "\
#contenu .tta_pop_bank { \
background-color: #c9c497; \
padding: 5px; \
margin: 0px; \
vertical-align: center; \
text-align: center; \
height: 26px; \
}" );

    GM_addStyle( "\
#contenu .tta_consumption { \
background-color: #B5B086; \
color: #6c5b36; \
}" );

    GM_addStyle( "\
#descBatiment .nomCarte { \
font-family: 'Trebuchet MS', Helvetica, sans-serif; \
}" );

    GM_addStyle( "\
img.icone3 { \
border: 0px; \
margin: 0px; \
width: 12px; \
height: 12px; \
margin-right: 0px; \
margin-left: 0px; \
margin-top: 2px; \
}" );

    //-------------------------------------- Player Board --------------------------------------

    GM_addStyle( "\
.bouton5 { \
width: 100px; \
background-color: #D8CBA9; \
color: #000000; \
padding: 5px 10px; \
font-size: 11px; \
margin: 4px 0px 0px 15px; \
font-weight: bold; \
border-radius: 5px; \
border: none; \
}" );

    GM_addStyle( "\
.bouton5:hover { \
background-color: #9E906D; \
color: #ffffff; \
cursor: pointer; \
border: none; \
}" );
}

(function() {
    'use strict';
})();

document.addEventListener ("DOMContentLoaded", function() {
    overrideImage();
    overrideCSS();
});