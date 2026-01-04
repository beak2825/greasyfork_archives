// ==UserScript==
// @name         Link to ticket
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  cuando detecta #NNNNN te crea un link para ir a ese ticket ;D
// @author       SirFerra
// @match        *soporte.flexxus.com.ar/requests/show/index/id/*
// @grant        none
// @updateUrl    https://greasyfork.org/scripts/389824-link-to-ticket/code/Link%20to%20ticket.user.js
// @downloadURL https://update.greasyfork.org/scripts/389824/Link%20to%20ticket.user.js
// @updateURL https://update.greasyfork.org/scripts/389824/Link%20to%20ticket.meta.js
// ==/UserScript==

var messages;
(function() {
    'use strict';
    messages = document.querySelectorAll('.messageCont');
    messages.forEach((o,i)=>{
        var ticket = o.innerText.match(/(?<=#\s*)([0-9]{4,9})|((?<=(ticket|solicitud)\s*)[0-9]{6,9})/gm);
        if(ticket !== null && ticket[0] !== undefined){
          o.innerHTML = o.innerHTML
          .replace(/#\s*[0-9]{4,9}|(?<=(ticket|solicitud)(\s*|&nbsp;))[0-9]{6,9}/gm,
                   '<a target="_blank" href="http://soporte.flexxus.com.ar/requests/show/index/id/'+ticket[0]+'">#'+(ticket[0]).trim()+'</a>')
        }
    });
    var title = document.querySelector('.requestViewTitle');
    var ticket = title.innerText.match(/(?<=#\s*)([0-9]{4,9})|((?<=(ticket|solicitud)\s*)[0-9]{6,9})/gm);
    if(ticket !== null && ticket[0] !== undefined){
        title.innerHTML = title.innerHTML
        .replace(/#\s*[0-9]{4,9}|(?<=(ticket|solicitud)\s*)[0-9]{6,9}/gm,
              '<a target="_blank" href="http://soporte.flexxus.com.ar/requests/show/index/id/'+ticket[0]+'">#'+(ticket[0]).trim()+'</a>')
    }
})();