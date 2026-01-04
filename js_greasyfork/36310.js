// ==UserScript==
// @name         5Outils
// @namespace    http://tampermonkey.net/
// @version      3.6.3
// @description  Outils complémentaires pour les vendeurs du site 5euros.com. Ce plugin est gratuit :-)
// @author       Thomas21
// @match        https://5euros.com/dashboard/commande/*
// @match        https://5euros.com/dashboard/thread/*
// @match        https://5euros.com/message/*
// @match        https://5euros.com/commande/*
// @match        https://5euros.com/ventes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36310/5Outils.user.js
// @updateURL https://update.greasyfork.org/scripts/36310/5Outils.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //////////////////////////////
    var APIKEY = "VotreCleIci"; // Entrez votre clé API ici, entre les guillemets
    //////////////////////////////


    var curPage = "";

    if (window.location.href.indexOf("thread") > -1 || window.location.href.indexOf("commande") > -1 || window.location.href.indexOf("message") > -1) {
        curPage = "conversation";
    }
    if (window.location.href.indexOf("ventes") > -1) {
        curPage = "ventes";
    }

    // Features appliquées aux conversations
    if(curPage == "conversation"){
        // Conteneur du script Boutons Custom
        var PageTargetBlock = $('.trackingControl-Timeline');
        if (window.location.href.indexOf("thread") > -1) {
            PageTargetBlock = $('.messageSubmit');
        }

        $('body').on('click', '#restartAjax', function(){
            $('#restartAjax').parent().hide();
            loadDynamicButtons();
        });
        $(document).ready(function(){
            loadDynamicButtons();
        });
    }


    // Features appliquées au listing des commandes
    if(curPage == "ventes"){
        var tableauContainer = $('#threads-listing');

        $(document).ready(function(){
            showCustomBadge(true);
        });

        // Override la fonction
        var origupdateButtonFilters = window.updateButtonFilters;
        window.updateButtonFilters = function(argument) {
                origupdateButtonFilters();
                showCustomBadge(false);
        };

    }





    function loadDynamicButtons(){
        $.ajax({
            url: 'https://5outils.[domaine caché].com/controller/messagesController.php',
            type: 'GET',
            dataType: 'json',
            data: {
               ajax: '1',
               version: '3.6.2',
               security: APIKEY,
               url: window.location.href
            },
            error: function(retour) {
                erreurAjaxDynamicButtons('Impossible de joindre le serveur.');
            },
            success: function(retour) {
                if(retour.status){
                    PageTargetBlock.prepend(retour.content);
                }
                else {
                    erreurAjaxDynamicButtons(retour.content);
                }
            },
        });
    }

    function erreurAjaxDynamicButtons(messageErreur){
        PageTargetBlock.prepend('<div class="alert-danger"><b>Impossible de charger les boutons dynamiques :</b> '+messageErreur+' <button id="restartAjax" class="btn btn-small btn-default">Recommencer</button></div>');
    }


    function showCustomBadge(firstLoad){
        var messagesId = [];
        $('table.table tbody tr').each(function(){
            messagesId.push(($(this).attr("data-id")));
        });
        console.log("showCustomBadge() firstLoad: "+firstLoad);

        $.ajax({
            url: 'https://5outils.[domaine caché].com/controller/orderController.php',
            type: 'GET',
            data: {
               action: 'badge',
               messagesId: messagesId,
               firstLoad: firstLoad,
               security: APIKEY
            },
            success: function(retour) {
                $('body').append(retour);
            },
        });
    }

})();