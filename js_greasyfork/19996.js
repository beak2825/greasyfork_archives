// ==UserScript==
// @name         Lanzallamas
// @namespace    miki365
// @version      0.10
// @description  Filtro de comentarios para el blog EPRV
// @author       miki365
// @match        http://blogs.libertaddigital.com/penultimo-raulista-vivo/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/19996/Lanzallamas.user.js
// @updateURL https://update.greasyfork.org/scripts/19996/Lanzallamas.meta.js
// ==/UserScript==

var blacklist = ["ufumatu", "simeono", "lMBODEN", "StradIin", "Stradlin", "mazolcon", "masolcon", "vaseIina", "vaselina", "NeiI", "tibulona", "tibuIona", "molena", "anjelI", "HemoaIin", "hiIarion"];
var comments, nickname, i;
comments = document.getElementsByClassName("comentario");
for (i = 0; i < comments.length; i++) {
	nickname = comments[i].children[0].children[1].innerHTML;
    if (blacklist.indexOf(nickname) > -1) {
      comments[i].innerHTML = '<p>El lanzallamas de miki365 ha churruscado un comentario de ' + nickname + '.</p>';
      comments[i].setAttribute('class', 'blacklistedComment');
      i--;
    }
}

//Duplicate comment post button from above to below
var comentariosClassElements = document.getElementsByClassName("comentarios");
commentsNumber = comentariosClassElements[0].children[0].innerHTML;
if (commentsNumber > 0) {
    comentariosClassElements[1].children[0].parentNode.appendChild(comentariosClassElements[1].children[0].cloneNode(true));
}

GM_addStyle ("\
/*Appearance of deletion warning*/\
.blacklistedComment {\
    position: relative;\
	background: #ffff99;\
	text-align: right;\
	color: #000;\
	font: 400 .73711em/1.41421em Roboto, sans-serif;\
	-moz-border-radius: 1em;\
	-webkit-border-radius: 1em;\
	border-radius: 1em;\
	margin-top: 1em\
}\
/*Warning alignment and font*/\
.blacklistedComment p {\
    margin-right: 1em;\
    font: bold .7em Georgia, Serif;\
}\
/*Nickname and time alignment*/\
.comentario header {\
    float: left;\
    margin-top: 10px;\
    margin-left: 5em;\
}\
/*Nickname font without sans-serif*/\
.comentarista {\
    font: italic 130% Lucida Console, Monaco, monospace;\
}\
");