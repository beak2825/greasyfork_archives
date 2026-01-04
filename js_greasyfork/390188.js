// ==UserScript==
// @name         SGR Identifier
// @namespace    https://github.com/danielfsouza/SGRUserScripts
// @version      0.7
// @description  Differentiates SGR environment
// @author       Daniel Souza
// @match        */sgr-web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390188/SGR%20Identifier.user.js
// @updateURL https://update.greasyfork.org/scripts/390188/SGR%20Identifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sgrHostname = window.location.hostname.split(".")[0];
    var textToDisplay;
    var colorToDisplay;

    switch(sgrHostname){
        case "sgr":
            textToDisplay = "PRODUÇÃO";
            colorToDisplay = "alert alert-danger";
            break;
        case "sgr-hm":
            textToDisplay = "TREINAMENTO / HML MANUTENÇÃO";
            colorToDisplay = "alert alert-info";
            break;
		case "sgr-tr":
            textToDisplay = "Q.A.";
            colorToDisplay = "alert alert-warning";
            break;
		case "sgr-pj-hm":
            textToDisplay = "HOMOLOGAÇÃO - PROJETO";
            colorToDisplay = "alert alert-success";
            break;
        default:
            textToDisplay = "Q.A.";
            colorToDisplay = "alert alert-warning";
    }

    let wrap = document.createElement('environWrapper');
    wrap.style = "position: fixed;  top: 1px; z-index: 5000; text-align: center;transform: translate(-50%, 0)";


    let div = document.createElement('environmentName');
    div.className = colorToDisplay;
    div.innerHTML = "<strong>" + textToDisplay + "</strong>";
    div.style = "display: inline-block;";

    wrap.appendChild(div);
    document.getElementsByClassName('header-centro')[0].appendChild(wrap)

})();