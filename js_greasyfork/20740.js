// ==UserScript==
// @name        Sujet sans reponses Back
// @namespace    https://realitygaming.fr/
// @version      1.0.1
// @description  -------------------------------
// @author       Marentdu93
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20740/Sujet%20sans%20reponses%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/20740/Sujet%20sans%20reponses%20Back.meta.js
// ==/UserScript==
$(document).ready(function(){
    
   var actuu = $('ul.secondaryContent.blockLinksList').children('li')[6].innerHTML;
var norep = $('ul.secondaryContent.blockLinksList').children('li')[5].innerHTML;
$('ul.secondaryContent.blockLinksList').children('li')[6].innerHTML = norep;
$('ul.secondaryContent.blockLinksList').children('li')[5].innerHTML = actuu;    
});

