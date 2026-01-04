// ==UserScript==
// @name         displayRocketChatReactions
// @namespace    http://tampermonkey.net/
// @version      2024-04-23 v0.6
// @description  permet de recuperer les réactions dans rocketchat
// @author       Cyril D.
// @match        https://rocketchat.internet.np/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rocket.chat
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493165/displayRocketChatReactions.user.js
// @updateURL https://update.greasyfork.org/scripts/493165/displayRocketChatReactions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // modifiez cette variable pour changer le comportement de la div des réactions
    let gbl_BOOL_alwaysDisplayReactionsDiv = false; /*
    true : les reactions sont toujours visibles
    false : les réactions sont visible uniquement si vous mettez votre souris sur le message
    */

    function setStyleReactionsDivs(id="displayRocketChatReactions_style", BOOL_alwaysDisplayReactionsDiv=gbl_BOOL_alwaysDisplayReactionsDiv){ // Fonction qui ajoute une balise style pour afficher les DIV de reaction ; code source inspiré de https://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
        let style;
        let css_alwaysShown = 'div.rcx-message-toolbar__wrapper, div.rcx-message-toolbar { opacity:1;display:block; }'
        let css_onMouseOverShownOnly = 'div.rcx-message-toolbar { opacity:1 !important;display:block; } div.rcx-message-toolbar__wrapper{ display:none; }'

        var css = (BOOL_alwaysDisplayReactionsDiv?css_alwaysShown:css_onMouseOverShownOnly),
            head = document.head || document.getElementsByTagName('head')[0];

        try{ // on recherche l'ancien style pour ne pas recreer une nouvelle balise çà chaque fois
            style=document.getElementById(id);
            if(style==null){
                throw new Error('no item with id',id);
            }
        }catch{ // premier chargement, on crée la balise style
            style = document.createElement('style');
            style.id="displayRocketChatReactions_style";
            head.appendChild(style);
        }


        style.type = 'text/css';
        if (style.styleSheet){
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }

    // MAIN
        let watchPageInterval = -1;
        let lastPage = "";

        watchPageInterval=setInterval(() => { // on vérifie si la page a changé sans un refresh
            if(window.location.href != lastPage){
                lastPage = window.location.href;

                setStyleReactionsDivs();
                clearInterval(watchPageInterval)
            }
        }, 1000);

})();