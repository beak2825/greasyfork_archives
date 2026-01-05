// ==UserScript==
// @name         No shitposting
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Elimina post que contengan un titulo determinado
// @author       Darcyys-
// @match        http*://www.taringa.net/
// @match        http*://www.taringa.net/pagina*
// @match        http*://www.taringa.net/posts/ascenso*
// @match        http*://www.taringa.net/posts/recientes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24680/No%20shitposting.user.js
// @updateURL https://update.greasyfork.org/scripts/24680/No%20shitposting.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nop = ["trump", "cristina", "cfk", "macri", "mugricio", "hilary", "hillary", "clinton", "hilari", "comandante", "maga",
              "presidente", "presidenta"];
    
    $(".list-l__title").each(function(i){
        for(var xd = 0; xd !== nop.length; ) {
            if ( $(this).text().toLowerCase().indexOf(nop[xd].toLowerCase()) !== -1) {
                $(this).closest('li').remove();
                console.log($(this).text());
                break;
            }
            xd++;
        }
    });
})();
