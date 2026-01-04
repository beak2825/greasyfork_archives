// ==UserScript==
// @name         Enviador de Bundles
// @namespace    https://sergiosusa.com
// @version      0.2
// @description  Envia bundles de Indiegala automaticamente
// @author       You
// @match        https://www.indiegala.com/library
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382381/Enviador%20de%20Bundles.user.js
// @updateURL https://update.greasyfork.org/scripts/382381/Enviador%20de%20Bundles.meta.js
// ==/UserScript==

var emails, emailImputs, invervalId, total, indice;

(function() {
    'use strict';

    setInterval(function(){

        let titles = document.querySelectorAll(".profile-private-page-library-gifts-title");

        for(let i = 0; i < titles.length; i++){

             if(titles[i].querySelector("#masivo-container") == null){
                 render(titles[i]);
             }

        }

    },2000);


})();

function render(nodeToRender){

     let currentNode = nodeToRender;

        while(!currentNode.id.startsWith('bundle')){

            currentNode = currentNode.parentNode;
        }

    nodeToRender.innerHTML+='<div id="masivo-container"><input id="envio-masivo-emails" type="text" /><br/><div bundle-id="'+currentNode.id+'" id="envio-masivo" href="#" style="display: block;width: 125px;border-radius: 10px;text-align: center;font-weight: bold;cursor: pointer;color: white;" class="bg-gradient-red">Envío masivo</div><div>';

    nodeToRender.querySelector("#envio-masivo").addEventListener('click',function(){

        emails = document.querySelector("ul#"+this.getAttribute('bundle-id')+" #envio-masivo-emails").value.split(',');
        emailImputs = document.querySelectorAll("ul#"+this.getAttribute('bundle-id')+" .profile-private-page-library-gift-send input");

        if (emails.length > emailImputs.length) {
            alert("Hay más emails que bundles disponibles.");
         return;
        }

        for(let x = 0; x < emails.length; x++){
            emailImputs[x].value = emails[x];
        }

        total = emails.length;
        console.log("total: "+total)
        indice = 0;
        invervalId = setInterval(function(){

            console.log(emailImputs[indice].nextSibling);

        emailImputs[indice].nextSibling.click();
            indice++;

            console.log("indice: "+indice);
            if (indice > total){
            clearInterval(invervalId);
            }

        }, 5000);

    });

}