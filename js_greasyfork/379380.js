// ==UserScript==
// @name         Traducteur Automatique
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Traducteur FR des autres mondes
// @author       LotusConfort
// @match        https://*/game.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379380/Traducteur%20Automatique.user.js
// @updateURL https://update.greasyfork.org/scripts/379380/Traducteur%20Automatique.meta.js
// ==/UserScript==

(function () {
    'use strict';


    if (premium == true && game_data.market != 'fr') traduction();

    function traduction(){
        // Traduction Menu Principal

        var $mainMenu = $('#topTable');
        var longMainMenu = $mainMenu.find('a').length;
        for (let i = 0; i < longMainMenu; i++) {
            switch (i) {
                case 0: $mainMenu.find('a').eq(i).text('Apperçu'); break;
                case 1: $mainMenu.find('a').eq(i).text('Combiné'); break;
                case 2: $mainMenu.find('a').eq(i).text('Production'); break;
                case 3: $mainMenu.find('a').eq(i).text('Transport'); break;
                case 4: $mainMenu.find('a').eq(i).text('Troupes'); break;
                case 5: $mainMenu.find('a').eq(i).text('Commandes'); break;
                case 6: $mainMenu.find('a').eq(i).text('Entrantes'); break;
                case 7: $mainMenu.find('a').eq(i).text('Bâtiments'); break;
                case 8: $mainMenu.find('a').eq(i).text('Recherches'); break;
                case 9: $mainMenu.find('a').eq(i).text('Groupes'); break;
                case 10: $mainMenu.find('a').eq(i).text('Gestionnaire de Compte'); break;
                case 11: $mainMenu.find('a').eq(i).text('Carte'); break;
                case 12: $mainMenu.find('a').eq(i).text('Rapports'); break;
                case 13: $mainMenu.find('a').eq(i).text('Tous'); break;
                case 14: $mainMenu.find('a').eq(i).text('Attaques'); break;
                case 15: $mainMenu.find('a').eq(i).text('Defenses'); break;
                case 16: $mainMenu.find('a').eq(i).text('Supports'); break;
                case 17: $mainMenu.find('a').eq(i).text('Commerce'); break;
                case 18: $mainMenu.find('a').eq(i).text('Evenements'); break;
                case 19: $mainMenu.find('a').eq(i).text('Autres'); break;
                case 20: $mainMenu.find('a').eq(i).text('Envoyés'); break;
                case 21: $mainMenu.find('a').eq(i).text('Public'); break;
                case 22: $mainMenu.find('a').eq(i).text('Filtres'); break;
                case 23: $mainMenu.find('a').eq(i).text('Classer'); break;
                case 24: $mainMenu.find('a').eq(i).text('Messages'); break;
                case 25: $mainMenu.find('a').eq(i).text('Reçus'); break;
                case 26: $mainMenu.find('a').eq(i).text('Circulaires'); break;
                case 27: $mainMenu.find('a').eq(i).text('Envoyer un message'); break;
                case 28: $mainMenu.find('a').eq(i).text('Carnet d\'Adresse'); break;
                case 29: $mainMenu.find('a').eq(i).text('Classer'); break;
                case 31: $mainMenu.find('a').eq(i).text('Rangs'); break;
                case 32: $mainMenu.find('a').eq(i).text('Tribus'); break;
                case 33: $mainMenu.find('a').eq(i).text('Joueur'); break;
                case 34: $mainMenu.find('a').eq(i).text('Domination Mondiale'); break;
                case 35: $mainMenu.find('a').eq(i).text('Continent Tribus'); break;
                case 36: $mainMenu.find('a').eq(i).text('Continent Joueurs'); break;
                case 37: $mainMenu.find('a').eq(i).text('Opposants vaincus (tribu)'); break;
                case 38: $mainMenu.find('a').eq(i).text('Opposants vaincus (joueur)'); break;
                case 39: $mainMenu.find('a').eq(i).text('Accomplissements'); break;
                case 40: $mainMenu.find('a').eq(i).text('Rang quotidien'); break;
                case 41: $mainMenu.find('a').eq(i).text('Guerres'); break;
                case 42: $mainMenu.find('a').eq(i).text('Tribu'); break;
                case 44: $mainMenu.find('a').eq(i).text('Aperçu'); break;
                case 45: $mainMenu.find('a').eq(i).text('Propriété'); break;
                case 46: $mainMenu.find('a').eq(i).text('Expérience'); break;
                case 47: $mainMenu.find('a').eq(i).text('Membres'); break;
                case 48: $mainMenu.find('a').eq(i).text('Diplomatie'); break;
                case 49: $mainMenu.find('a').eq(i).text('Guerre'); break;
                case 50: $mainMenu.find('a').eq(i).text('Planificateur'); break;
                case 51: $mainMenu.find('a').eq(i).text('Recrutement'); break;
                case 52: $mainMenu.find('a').eq(i).text('Forum'); break;
                case 55: $mainMenu.find('a').eq(i).text('Inventaire'); break;
                case 56: $mainMenu.find('a').eq(i).text('Accomplissements'); break;
                case 57: $mainMenu.find('a').eq(i).text('Statistiques'); break;
                case 58: $mainMenu.find('a').eq(i).text('Amis'); break;
                case 59: $mainMenu.find('a').eq(i).text('Bonus Journalier'); break;
                case 60: $mainMenu.find('a').eq(i).text('Mentorat'); break;
                case 62: $mainMenu.find('a').eq(i).text('Utilisation'); break;
                case 63: $mainMenu.find('a').eq(i).text('Achat'); break;
                case 64: $mainMenu.find('a').eq(i).text('Transferer'); break;
                case 65: $mainMenu.find('a').eq(i).text('Journal de Points'); break;
                case 66: $mainMenu.find('a').eq(i).text('Journal de Fonctionnalités'); break;
                case 67: $mainMenu.find('a').eq(i).text('Réglages'); break;
                case 68: $mainMenu.find('a').eq(i).text('Option de Jeu'); break;
                case 69: $mainMenu.find('a').eq(i).text('Compte'); break;
                case 70: $mainMenu.find('a').eq(i).text('Recommencer'); break;
                case 71: $mainMenu.find('a').eq(i).text('Transfert sur le monde Casu'); break;
                case 72: $mainMenu.find('a').eq(i).text('Barre de Raccourcis'); break;
                case 73: $mainMenu.find('a').eq(i).text('Partager de connexion'); break;
                case 74: $mainMenu.find('a').eq(i).text('Sitting'); break;
                case 75: $mainMenu.find('a').eq(i).text('Connexions'); break;
                case 76: $mainMenu.find('a').eq(i).text('Sondages'); break;
                case 77: $mainMenu.find('a').eq(i).text('Inviter des joueurs'); break;
                case 78: $mainMenu.find('a').eq(i).text('Notifications Push'); break;
                case 79: $mainMenu.find('a').eq(i).text('Notifications Email'); break;
                case 80: $mainMenu.find('a').eq(i).text('Notifications Navigateur'); break;
                case 81: $mainMenu.find('a').eq(i).text('Partage des ordres'); break;
                case 82: $mainMenu.find('a').eq(i).text('PArtage des notes de villages'); break;
                case 83: $mainMenu.find('a').eq(i).text('Demande de support'); break;
                case 84: $mainMenu.find('a').eq(i).text('Options d\'utilisations des données'); break;


                default: break;
            }
        }

        // Traduction Village
        var $villageSum = $('#show_summary');
        $villageSum.find('#l_main').find('a:last').html('<img src="' + image_base + 'buildings/main.png" title="" alt="" class=""> Quartier Général');
        $villageSum.find('#l_barracks').find('a:last').html('<img src="' + image_base + 'buildings/barracks.png" title="" alt="" class=""> Caserne');
        $villageSum.find('#l_stable').find('a:last').html('<img src="' + image_base + 'buildings/stable.png" title="" alt="" class=""> Ecurie');
        $villageSum.find('#l_church_f').find('a:last').html('<img src="' + image_base + 'buildings/church.png" title="" alt="" class=""> Première Eglise');
        $villageSum.find('#l_church').find('a:last').html('<img src="' + image_base + 'buildings/church.png" title="" alt="" class=""> Eglise');
        $villageSum.find('#l_smith').find('a:last').html('<img src="' + image_base + 'buildings/smith.png" title="" alt="" class=""> Forge');
        $villageSum.find('#l_place').find('a:last').html('<img src="' + image_base + 'buildings/place.png" title="" alt="" class=""> Place');
        $villageSum.find('#l_academy').find('a:last').html('<img src="' + image_base + 'buildings/academy.png" title="" alt="" class=""> Académie');
        $villageSum.find('#l_market').find('a:last').html('<img src="' + image_base + 'buildings/market.png" title="" alt="" class=""> Marché');
        $villageSum.find('#l_wood').find('a:last').html('<img src="' + image_base + 'buildings/wood.png" title="" alt="" class=""> Camp de Bûcherons');
        $villageSum.find('#l_stone').find('a:last').html('<img src="' + image_base + 'buildings/stone.png" title="" alt="" class=""> Carrière d\'Argile');
        $villageSum.find('#l_iron').find('a:last').html('<img src="' + image_base + 'buildings/iron.png" title="" alt="" class=""> Mine de Fer');
        $villageSum.find('#l_farm').find('a:last').html('<img src="' + image_base + 'buildings/farm.png" title="" alt="" class=""> Ferme');
        $villageSum.find('#l_hide').find('a:last').html('<img src="' + image_base + 'buildings/hide.png" title="" alt="" class=""> Cachette');
        $villageSum.find('#l_storage').find('a:last').html('<img src="' + image_base + 'buildings/storage.png" title="" alt="" class=""> Entrepot');
        $villageSum.find('#l_wall').find('a:last').html('<img src="' + image_base + 'buildings/wall.png" title="" alt="" class=""> Muraille');

      // Traduction Production
        var $showProd = $('#show_prod');
        $showProd.find('tr').eq(0).find('td:first').html('<a href = "' + game_data.link_base_pure + 'wood"> <span class = "icon header wood"> </span></a> Bois');
        $showProd.find('tr').eq(1).find('td:first').html('<a href = "' + game_data.link_base_pure + 'stone"> <span class = "icon header stone"> </span></a> Argile');
        $showProd.find('tr').eq(2).find('td:first').html('<a href = "' + game_data.link_base_pure + 'iron"> <span class = "icon header iron"> </span></a> Fer'); 

    };


})();

