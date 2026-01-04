// ==UserScript==
// @name         Optimisation Collecte
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Script affichant automatiquement les unités à envoyer dans chaque collectes :)!
// @author       LotusConfort
// @match        https://*/game.php?village=*&screen=place&mode=scavenge*
// @match        https://*/game.php?t=*&village=*&screen=place&mode=scavenge*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376743/Optimisation%20Collecte.user.js
// @updateURL https://update.greasyfork.org/scripts/376743/Optimisation%20Collecte.meta.js
// ==/UserScript==

(function () {
    'use strict';

   

    /* ======= FIN ======= */


    /* ======= DETERMINATION DES VARIABLES ======= */
    var archer_world = archer_world(); // Détermine si c'est un monde archer ou non
    var tabunits = getUnitsNumber(archer_world);
    console.table(tabunits); // Affiche le Tableau des unités
    var quantity = computeQuantity(tabunits);
    console.log('la quantité totale est de :', quantity); // Affiche la Quantité totale de transport
    var lvl_collecte = document.getElementsByClassName('free_send_button').length;
    console.log('La collecte est de niveau :', lvl_collecte); // Affiche le Niveau de collecte
    var tabScavenge = defineScavenge(quantity, lvl_collecte);
    console.table(tabScavenge); // Affiche les valeurs de collecte
    /* ======= FIN ======= */

    computeResultat(tabunits, tabScavenge, lvl_collecte, archer_world);

    function archer_world() {
        let archer_world = document.getElementsByClassName('unit_link').length; /* ======= MONDE ARCHER  OU NON ======= */
        return archer_world;
    }

    /* ======= DETERMINER LES UNITES ======= */
    function getUnitsNumber(archer_world) {

        let elementunits = document.getElementsByClassName("units-entry-all");
        if (archer_world == 8) {
            console.log('C\'est un monde avec Archers');
        } else {
            console.log('Ce n\'est pas un monde avec Archers');
        }

        if (archer_world == 8) {
            var tabunits = [{
                id: "spear",
                carry: 25,
                number: 0
            }, {
                id: "sword",
                carry: 15,
                number: 0
            }, {
                id: "axe",
                carry: 10,
                number: 0
            }, {
                id: "archer",
                carry: 10,
                number: 0
            }, {
                id: "light",
                carry: 80,
                number: 0
            }, {
                id: "marcher",
                carry: 50,
                number: 0
            }, {
                id: "heavy",
                carry: 50,
                number: 0
            }, {
                id: "knight",
                carry: 100,
                number: 0
            }];
        } else {
            var tabunits = [{
                id: "spear",
                carry: 25,
                number: 0
            }, {
                id: "sword",
                carry: 15,
                number: 0
            }, {
                id: "axe",
                carry: 10,
                number: 0
            }, {
                id: "light",
                carry: 80,
                number: 0
            }, {
                id: "heavy",
                carry: 50,
                number: 0
            }, {
                id: "knight",
                carry: 100,
                number: 0
            }];
        }

        for (let i = 0; i < elementunits.length; i++) {
            let etape1 = elementunits[i].innerHTML;
            let etape2 = etape1.replace(/[()]/g, "");
            tabunits[i].number = parseInt(etape2);
        }
        return (tabunits);
    }
    /* ======= FIN ======= */

    /* ======= CALCUL DE LA QUANTITÉ ======= */
    function computeQuantity(units) {
        let quantity = 0;
        for (let i = 0; i < units.length; i++) {
            quantity += units[i].number * units[i].carry;
        }
        return (quantity);
    }
    /* ======= FIN ======= */


    /* ======= DEFINIR LES VALEURS DES COLLECTES ======= */
    function defineScavenge(quantity, lvl_collecte) {
        let tabScavenge = [{
            id: "Petite Collecte",
            quantity: undefined,
        }, {
            id: "Moyenne Collecte",
            quantity: undefined,
        }, {
            id: "Grosse Collecte",
            quantity: undefined,
        }, {
            id: "Collecte Massive",
            quantity: undefined,
        }];

        switch (lvl_collecte) {
            case 4:
                tabScavenge[0].quantity = (quantity * 4.327) / 7.5;
                tabScavenge[1].quantity = (quantity * 0.6923) / 3;
                tabScavenge[2].quantity = (quantity * 0.1731) / 1.5;
                tabScavenge[3].quantity = (quantity * 0.0769) / 1;
                break;
            case 3:
                tabScavenge[0].quantity = (quantity * 3.125) / 5;
                tabScavenge[1].quantity = (quantity * 0.5) / 2;
                tabScavenge[2].quantity = (quantity * 0.125) / 1;
                break;
            case 2:
                tabScavenge[0].quantity = (quantity * 1.7858) / 2.5;
                tabScavenge[1].quantity = (quantity * 0.2857) / 1;
                break;
            case 1:
                tabScavenge[0].quantity = (quantity * 1) / 1;
                break;
            default:
                console.log("Il y a un pb dans le niveau de la collecte");
        }
        return (tabScavenge);

    }
    /* ======= FIN ======= */


    /* ======= CALCUL DES VALEURS DE COLLECTE ======= */
    function computeResultat(tabunits, tabScavenge, lvl_collecte, archer_world) {
        let j = undefined;
        var tabTotalSend = [{
            id: "Petite collecte",
            valeur: 0
        }, {
            id: "Moyenne Collecte",
            valeur: 0
        }, {
            id: "Grande Collecte",
            valeur: 0
        }, {
            id: "Collecte Massive",
            valeur: 0
        }];

        var TabTest = [];

        console.log(tabTotalSend);
        console.log("============ DEBUT DE LA FONCTION ============");

        if (archer_world == 8) {
            var tabSend = [{
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_spear.png\" title=\"Lancier\">",
                send: 0
            }, {
                    id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_sword.png\" title=\"Sword\">",
                send: 0
            }, {
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_axe.png\" title=\"Axe\">",
                send: 0
            }, {
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_archer.png\" title=\"Archer\">",
                send: 0
            }, {
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_light.png\" title=\"Light\">",
                send: 0
            }, {
                    id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_marcher.png\" title=\"Marcher\">",
                send: 0
            }, {
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_heavy.png\" title=\"Heavy\">",
                send: 0
            }, {
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_knight.png\" title=\"Knight\">",
                send: 0
            }];
        } else {
            var tabSend = [{
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_spear.png\" title=\"Lancier\">",
                send: 0
            }, {
                    id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_sword.png\" title=\"Sword\">",
                send: 0
            }, {
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_axe.png\" title=\"Axe\">",
                send: 0
            }, {
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_light.png\" title=\"Light\">",
                send: 0
            }, {
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_heavy.png\" title=\"Heavy\">",
                send: 0
            }, {
                id: "<img src=\"https://dsfr.innogamescdn.com/asset/76fbc28978/graphic/unit/unit_knight.png\" title=\"Knight\">",
                send: 0
            }];
        }
        j = 0;
        var zone_collecte = document.getElementById('scavenge_screen');
        var newDiv_tab = document.createElement('div');
        newDiv_tab.setAttribute("id", "tableau_collecte");
        zone_collecte.prepend(newDiv_tab);

        var html_tab = "";

        for (var i = 0; i < lvl_collecte; i++) {
            for (var x = 0; x < archer_world - 1; x++) {
                tabSend[x].send = 0;
            }
            console.log("============ Niveau :", tabScavenge[i].id, " ============");
            html_tab += "\n<h4>Niveau " + tabScavenge[i].id + "</h4>\n";
            for (j = 0; j < archer_world; j++) {
                while (tabScavenge[i].quantity > 0 && tabunits[j].number > 0) {
                    tabScavenge[i].quantity -= tabunits[j].carry;
                    tabunits[j].number--;
                    tabSend[j].send++;
                };

                var json = JSON.stringify(tabSend[j]);
                console.log(json);
                var resultat = JSON.parse(json);

                html_tab += resultat.id + " : " + resultat.send + " | \n";
            }
            console.table(tabSend);



        }
        newDiv_tab.innerHTML += html_tab;
        console.log("============ FIN DE LA FONCTION ============");

    }
    /* ======= FIN ======= */


})();
