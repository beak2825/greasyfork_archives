// ==UserScript==
// @name         Canal UA - Place libre à la vidéo
// @namespace    http://aucun.fr/
// @version      2
// @description  Place libre à la vidéo vous permet d'améliorer un tant soit peu l'interface du célèbre CANAL UA 
// @author       Antoine Tagah
// @include        http://canal-ua.univ-angers.fr/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13788/Canal%20UA%20-%20Place%20libre%20%C3%A0%20la%20vid%C3%A9o.user.js
// @updateURL https://update.greasyfork.org/scripts/13788/Canal%20UA%20-%20Place%20libre%20%C3%A0%20la%20vid%C3%A9o.meta.js
// ==/UserScript==


var el = document.getElementById('playerhtml5');
var ele = document.getElementsByClassName('visuleft');


//el.setAttribute('style', 'text-align: justify; word-spacing: 2px;');
el.setAttribute("width", "100%");
ele['0'].setAttribute('style', 'width: 17%');
el.setAttribute("height", "70%");

