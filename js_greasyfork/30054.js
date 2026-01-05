// ==UserScript==
// @name          V509RandomColor
// @namespace     //
// @author        V509Cassiopeiae
// @include       http://jeuxvideo.com/*
// @include       https://jeuxvideo.com/*
// @include       http://*.jeuxvideo.com/*
// @include       https://*.jeuxvideo.com/*
// @include       http://www.forumjv.com/*
// @include       https://www.forumjv.com/*
// @include       http://*.www.forumjv.com/*
// @include       https://*.www.forumjv.com/*
// @include       http://jeuxvideo.com/*
// @include       https://jeuxvideo.com/*
// @include       http://*.jeuxvideo.com/*
// @include       https://*.jeuxvideo.com/*
// @include       http://www.forumjv.com/*
// @include       https://www.forumjv.com/*
// @include       http://*.www.forumjv.com/*
// @include       https://*.www.forumjv.com/*
// @run-at        document-start
// @version       1.1
// @description Script JVC - Le thème est aléatoire
// @downloadURL https://update.greasyfork.org/scripts/30054/V509RandomColor.user.js
// @updateURL https://update.greasyfork.org/scripts/30054/V509RandomColor.meta.js
// ==/UserScript==

/*--------------------*/
/*       START        */
/*--------------------*/

// COULEURS DISPONIBLES : Blue (BLEU), Red (ROUGE), Green (VERT), Purple (VIOLET), Orange (DEVINE) ==> Vous pouvez en enlever / mettre en double pour doubler les chances d'avoir "Green" (ex).
// Si il ne reste qu'une couleur c'est 100% de chance.

var Couleurs = ["Blue", "Green", "Red", "Purple", "Orange", "Lightblue", "Lightgreen"];

/*--------------------*/
/*     V509Color      */
/*--------------------*/
var percent = (100/ Couleurs.length);
var color;
(function() {
    var head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style'),
    css;

    style.type = 'text/css';
    if (style.styleSheet){
       style.styleSheet.cssText = css;
    } else {
       style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    var random = Math.floor(Math.random() * 100) + 1;
    for (i = 0; i <= Couleurs.length; i++) {
        if (random <= percent*(i+1) && random > percent*i) {
            color = Couleurs[i];
        }
    }
    if (color == "Blue") {
        css = " \
        body {height:100%;} \
        .account-pseudo {color:#0011FF !important;} \
        .header-top {background-color:#272727 !important;} \
        .nav-link {background-color:#2B2B2B !important; color:#005BD8 !important;} \
        .nav-link:hover {background-color:#19709E !important; color:#FFFFFF !important;} \
        .header-sticky {background:linear-gradient(#292929, #00176B) !important;} \
        .nav-toggler::before {border-top-color: #005BD8 !important;} \
        .btn {background-color:#2980b9 !important; border:1px black solid !important; color:white !important;} \
        .topic-title{color:#002bff !important;} \
        .topic-title:visited{color:#5c5c5c !important;} \
        .page-active{background-color:#0011FF !important;} \
        .bloc-liste-num-page:not(.page-active){color:#1a24a9 !important;} \
        h2{color:#0676dd !important;} \
        .nav-lvl2-item>.nav-link{border-bottom:1px #0964c9 solid !important;} \
        h2 span {color:#1357c9 !important;} \
        .lien-pratique-gestion a, .liste-sujets-nomiss li a {color:#0d57f4 !important;} \
        .lien-pratique-gestion a:hover, .liste-sujets-nomiss li a:hover {color:#119cd2 !important;} \
        .fil-ariane-crumb a {color:#0d57f4 !important;} \
        h4 {color:#037aff !important} \
        .panel-heading{color:white !important;} \
        .highlight {color: black !important;} \
        .nav-dropdown:hover span {background-color:#19709E !important;} \
        ";
         }
    else if (color == "Green") {
        css = " \
        body {height:100%;} \
        .account-pseudo {color:#1ea908 !important;} \
        .header-top {background-color:#272727 !important;} \
        .nav-link {background-color:#2B2B2B !important; color:#30d416 !important;} \
        .nav-link:hover {background-color:#30d416 !important; color:#FFFFFF !important;} \
        .header-sticky {background:linear-gradient(#292929, #1a9008) !important;} \
        .nav-toggler::before {border-top-color: #1a9008 !important;} \
        .btn {background-color:#299617 !important; border:1px black solid !important; color:white !important;} \
        .topic-title{color:#1eb607 !important;} \
        .topic-title:visited{color:#5c5c5c !important;} \
        .page-active{background-color:#30c50e !important;} \
        .bloc-liste-num-page:not(.page-active){color:#34a91a !important;} \
        h2{color:#259403 !important;} \
        .nav-lvl2-item>.nav-link{border-bottom:1px #4cff01 solid !important;} \
        h2 span {color:#2cb217 !important;} \
        .lien-pratique-gestion a, .liste-sujets-nomiss li a {color:#20c511 !important;} \
        .lien-pratique-gestion a:hover, .liste-sujets-nomiss li a:hover {color:#3eea09 !important;} \
        .fil-ariane-crumb a {color:#20c511 !important;} \
        h4 {color:#1ae51d !important} \
        .panel-heading{color:white !important;} \
        .highlight {color: black !important;} \
        .nav-dropdown:hover span {background-color:#30d416 !important;} \
        ";
         }
    else if (color == "Red") {
        css = " \
        body {height:100%;} \
        .account-pseudo {color:#f40d0d !important;} \
        .header-top {background-color:#272727 !important;} \
        .nav-link {background-color:#2B2B2B !important; color:#ff0000 !important;} \
        .nav-link:hover {background-color:#ff0000 !important; color:#FFFFFF !important;} \
        .header-sticky {background:linear-gradient(#292929, #c90606) !important;} \
        .nav-toggler::before {border-top-color: #ee0b0b !important;} \
        .btn {background-color:#f0422e !important; border:1px black solid !important; color:white !important;} \
        .topic-title{color:#ff0d00 !important;} \
        .topic-title:visited{color:#5c5c5c !important;} \
        .page-active{background-color:#f63605 !important;} \
        .bloc-liste-num-page:not(.page-active){color:#e54016 !important;} \
        h2 {color:#c90909 !important;} \
        .nav-lvl2-item>.nav-link{border-bottom:1px #c90909 solid !important;} \
        h2 span {color:#ff0000 !important;} \
        .lien-pratique-gestion a, .liste-sujets-nomiss li a {color:#f40d0d !important;} \
        .lien-pratique-gestion a:hover, .liste-sujets-nomiss li a:hover {color:#ff7400 !important;} \
        .fil-ariane-crumb a {color:#f40d0d !important;} \
        h4 {color:#ff0000 !important} \
        .panel-heading{color:white !important;} \
        .highlight {color: black !important;} \
        .nav-dropdown:hover span {background-color:#ff0000 !important;} \
        ";
         }
    else if (color == "Purple") {
        css = " \
        body {height:100%;} \
        .account-pseudo {color:#a300ff !important;} \
        .header-top {background-color:#272727 !important;} \
        .nav-link {background-color:#2B2B2B !important; color:#b32cff !important;} \
        .nav-link:hover {background-color:#b32cff !important; color:#FFFFFF !important;} \
        .header-sticky {background:linear-gradient(#292929, #a109c9) !important;} \
        .nav-toggler::before {border-top-color: #d50bee !important;} \
        .btn {background-color:#aa2ef0 !important; border:1px black solid !important; color:white !important;} \
        .topic-title{color:#9600ff !important;} \
        .topic-title:visited{color:#5c5c5c !important;} \
        .page-active{background-color:#d005f6 !important;} \
        .bloc-liste-num-page:not(.page-active){color:#c416e5 !important;} \
        h2 {color:#7a09c9 !important;} \
        .nav-lvl2-item>.nav-link{border-bottom:1px #b32cff solid !important;} \
        h2 span {color:#b32cff !important;} \
        .lien-pratique-gestion a, .liste-sujets-nomiss li a {color:#9100e3 !important;} \
        .lien-pratique-gestion a:hover, .liste-sujets-nomiss li a:hover {color:#bd00ff !important;} \
        .fil-ariane-crumb a {color:#9100e3 !important;} \
        h4 {color:#b000ff !important} \
        .panel-heading{color:white !important;} \
        .highlight {color: black !important;} \
        .nav-dropdown:hover span {background-color:#b32cff !important;} \
        ";
         }
    else if (color == "Orange") {
        css = " \
        body {height:100%;} \
        .account-pseudo {color:#ff8d00 !important;} \
        .header-top {background-color:#272727 !important;} \
        .nav-link {background-color:#2B2B2B !important; color:#ffb400 !important;} \
        .nav-link:hover {background-color:#ffb400 !important; color:#FFFFFF !important;} \
        .header-sticky {background:linear-gradient(#292929, #d35400) !important;} \
        .nav-toggler::before {border-top-color: #f39c12 !important;} \
        .btn {background-color:#f39c12 !important; border:1px black solid !important; color:white !important;} \
        .topic-title{color:#ffa700 !important;} \
        .topic-title:visited{color:#5c5c5c !important;} \
        .page-active{background-color:#fb900c !important;} \
        .bloc-liste-num-page:not(.page-active){color:#fb900c !important;} \
        h2 {color:#ff8d00 !important;} \
        .nav-lvl2-item>.nav-link{border-bottom:1px #ffb400 solid !important;} \
        h2 span {color:#f97303 !important;} \
        .lien-pratique-gestion a, .liste-sujets-nomiss li a {color:#ffa700 !important;} \
        .lien-pratique-gestion a:hover, .liste-sujets-nomiss li a:hover {color:#ffdb00 !important;} \
        .fil-ariane-crumb a {color:#e3b700 !important;} \
        h4 {color:#ffe700 !important} \
        .panel-heading{color:white !important;} \
        .highlight {color: black !important;} \
        .nav-dropdown:hover span {background-color:#ffb400 !important;} \
        ";
        }
    else if (color == "Lightblue") {
        css = " \
        body {height:100%;} \
        .account-pseudo {color:#00ffec !important;} \
        .header-top {background-color:#272727 !important;} \
        .nav-link {background-color:#2B2B2B !important; color:#00ffec !important;} \
        .nav-link:hover {background-color:#006bff !important; color:#FFFFFF !important;} \
        .header-sticky {background:linear-gradient(#292929, #00abff) !important;} \
        .nav-toggler::before {border-top-color: #00ffec !important;} \
        .btn {background-color:#006bff !important; border:1px black solid !important; color:white !important;} \
        .topic-title{color:#006bff !important;} \
        .topic-title:visited{color:#5c5c5c !important;} \
        .page-active{background-color:#137bf0 !important;} \
        .bloc-liste-num-page:not(.page-active){color:#00ffec !important;} \
        h2 {color:#009fff !important;} \
        .nav-lvl2-item>.nav-link{border-bottom:1px #00ffec solid !important;} \
        h2 span {color:#006bff !important;} \
        .lien-pratique-gestion a, .liste-sujets-nomiss li a {color:#00ffec !important;} \
        .lien-pratique-gestion a:hover, .liste-sujets-nomiss li a:hover {color:#0085ff !important;} \
        .fil-ariane-crumb a {color:#006bff !important;} \
        h4 {color:#00abff !important} \
        .panel-heading{color:white !important;} \
        .highlight {color: black !important;} \
        .nav-dropdown:hover span {background-color:#006bff !important;} \
        ";
    }
    else if (color == "Lightgreen") {
        css = " \
        body {height:100%;} \
        .account-pseudo {color:#22ff00 !important;} \
        .header-top {background-color:#272727 !important;} \
        .nav-link {background-color:#2B2B2B !important; color:#22ff00 !important;} \
        .nav-link:hover {background-color:#35d81c !important; color:#FFFFFF !important;} \
        .header-sticky {background:linear-gradient(#292929, #35d81c) !important;} \
        .nav-toggler::before {border-top-color: #22ff00 !important;} \
        .btn {background-color:#35d81c !important; border:1px black solid !important; color:white !important;} \
        .lien-pratique-gestion a:hover, .liste-sujets-nomiss li a:hover {color:#3cff00 !important;} \
        .topic-title{color:#35d81c !important;} \
        .topic-title:visited{color:#5c5c5c !important;} \
        .page-active{background-color:#22ff00 !important;} \
        .bloc-liste-num-page:not(.page-active){color:#22ff00 !important;} \
        h2 {color:#05e31f !important;} \
        .nav-lvl2-item>.nav-link{border-bottom:1px #22ff00 solid !important;} \
        h2 span {color:#3ac310 !important;} \
        .lien-pratique-gestion a, .liste-sujets-nomiss li a {color:#3ac310 !important;} \
        .fil-ariane-crumb a {color:#05e31f !important;} \
        h4 {color:#3cff00 !important} \
        .panel-heading{color:white !important;} \
        .highlight {color: black !important;} \
        .nav-dropdown:hover span {background-color:#35d81c !important;} \
        ";
    }
    if (style.styleSheet){
       style.styleSheet.cssText = css;
    } else {
       style.appendChild(document.createTextNode(css));
    }
})();