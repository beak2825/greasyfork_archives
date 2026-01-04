// ==UserScript==
// @name         Nvidia geforce now browse games
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Instead of using a searchbox, now you can browse the list on the page - a feature nvidia removed
// @author       Shr4pNull
// @match        https://www.nvidia.com/*/geforce-now/games/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396626/Nvidia%20geforce%20now%20browse%20games.user.js
// @updateURL https://update.greasyfork.org/scripts/396626/Nvidia%20geforce%20now%20browse%20games.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var documents;
    var $ = window.jQuery;
    $.ajax({
       'async': false,
       type: 'GET',
       data: "JSON",
        url: "https://static.nvidiagrid.net/supported-public-game-list/gfnpc.json",
        success: function(response){
            documents = response;
            var reg_the = /(^the )/i;
            var reg_a = /(^a )/i;
            for(var i=0; i<documents.length; i++){
                documents[i].title = documents[i].title.trim();
                if(documents[i].title.match(reg_the)){
                   documents[i].title = documents[i].title.replace(reg_the,"") + ", The";
                }
                else if(documents[i].title.match(reg_a)){
                    documents[i].title = documents[i].title.replace(reg_a,"") + ", A";
                }
            }

            documents.sort((a,b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
            console.log(documents);
            documents.forEach(function(e){
                var linkToSteam = e.steamUrl ? `<a href="${e.steamUrl}"  target="_blank" style="font-size:80%;">[steam]</a>` : "";
                $(".result").append(`<div><span style="font-weight: ${e.isFullyOptimized ? "bold":"normal"}">${e.title}</span> ${linkToSteam}</div>`);

             });
         }
   }); //end of $.ajax

})();