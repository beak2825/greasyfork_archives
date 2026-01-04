// ==UserScript==
// @name         AutoRefresh Contributors Portal
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Obtiene el link de FCP
// @author       SStvAA
// @match        https://account.appen.com/channels/feca/tasks?uid*
// @match        https://feca-proxy.appen.com/v1/tasks/iframe_url/*
// @match        https://feca-proxy.appen.com/v1/tasks/iframe_url
// @match        https://feca-proxy.appen.com/*
// @match        https://annotate.appen.com/login*
// @grant        nonee
// @downloadURL https://update.greasyfork.org/scripts/387455/AutoRefresh%20Contributors%20Portal.user.js
// @updateURL https://update.greasyfork.org/scripts/387455/AutoRefresh%20Contributors%20Portal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("activado");
    /*verificar la pagina actual*/
    var pagina = "https://feca-proxy.appen.com/v1/tasks/iframe_url";
    var pagina2 = "account.appen.com/channels/feca/tasks\\?uid";
    var pagina3 = 'https://feca-proxy.appen.com/v1/tasks/:%22Not%20Autheddddnticated';
    var paginalog = "https://annotate.appen.com/";
    var actual = location.href;
    if(actual==pagina){
        var link = document.getElementsByTagName("pre")[0].innerHTML;
        link = link.slice(8,-2);
        location.replace(link)

    }else if(actual.search(pagina2)>=0){
    	var cuerpo = document.getElementsByTagName("body")[0].innerHTML;
    	if(cuerpo=="Request has expired"){
    		location.replace(pagina);
    	}else if(cuerpo=="La solicitud ha caducado"){
    		location.replace(pagina);
    	}
    }else if(actual.search("Authenticated")>=0){
        location.replace(paginalog);
    }else if(actual.search("annotate.appen.com")>=0 && actual.search("login")>=0){
        var boton = document.getElementsByClassName("b-Login__submit-button")[0]
        setTimeout(crea,300)
        
    }

    function crea(){
         boton.classList.remove("b-Button--disabled");
         boton.click();
         setTimeout(crea,300)
    }
})();