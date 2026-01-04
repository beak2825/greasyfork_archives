// ==UserScript==
// @name         JSecurity Identifier
// @namespace    https://github.com/danielfsouza/SGRUserScripts
// @version      0.3
// @description  Differentiates JSecurity environment
// @author       Daniel Souza
// @match        */jsecurity/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/390192/JSecurity%20Identifier.user.js
// @updateURL https://update.greasyfork.org/scripts/390192/JSecurity%20Identifier.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';
    var sgrHostname = window.location.hostname;
    var textToDisplay;
    var colorToDisplay;

    if(sgrHostname.indexOf('hm') >= 0){
        textToDisplay = "  HOMOLOGAÇÃO";
        colorToDisplay = "lime";
    }
    else if(sgrHostname.indexOf('qa') >= 0){
        textToDisplay = "  Q.A.";
        colorToDisplay = "yellow";
    }
	else if(sgrHostname.indexOf('tr') >= 0){
        textToDisplay = "  TREINAMENTO";
        colorToDisplay = "blue";
    }
    else{
        textToDisplay = "  PRODUÇÃO";
        colorToDisplay = "red";
    }

    let div = document.createElement('environmentName');
    div.innerHTML = "<strong>" + textToDisplay + "</strong>";
    div.style.color = colorToDisplay;


    $("#siglaAplicacao").append(div);
    blink('environmentName');

})();

function blink(selector){
 $(selector).fadeOut(2000, function(){
   $(this).fadeIn('fast', function(){
    blink(this);
   });
 });
}
