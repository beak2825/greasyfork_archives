// ==UserScript==
// @name         Estadao Livre
// @namespace    https://greasyfork.org/users/715485
// @version      0.1
// @description  Informações devem ser livre!
// @author       luiz-lp
// @match        http*://estadao.com.br/*
// @match        http*://*.estadao.com.br/*
// @icon         https://statics.estadao.com.br/s2016/portal/logos/favicon/favicon.ico
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419775/Estadao%20Livre.user.js
// @updateURL https://update.greasyfork.org/scripts/419775/Estadao%20Livre.meta.js
// ==/UserScript==

window.setInterval(function(){
    if(document.querySelector("#paywall-wrapper-iframe-estadao") != null){
        document.querySelector("#paywall-wrapper-iframe-estadao").remove();
    }
}, 50);