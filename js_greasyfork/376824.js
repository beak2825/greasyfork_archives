// ==UserScript==
// @name         Apperçu Building 3.0
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Donne un apperçu des batiments amélioré
// @author       LotusConfort
// @match        https://*/game.php?village=*&screen=overview_villages&mode=buildings
// @match        https://*/game.php?village=*&screen=overview_villages&mode=buildings&group=*
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376824/Apper%C3%A7u%20Building%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/376824/Apper%C3%A7u%20Building%2030.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function NewHUDBatGT() {
        /* ====== Variables globales ===== */
        var $tableauVillage = $('#villages');
        var trLenght = $tableauVillage.find('tr').length; // calcul la longueur du tableau
        var $headTaVillage = $('#buildings_table');
        var thLenght = $headTaVillage.find('th').length;
        /* ====== FIN ===== */

        /* ====== Var points villages ===== */
        var vvFull = 0;
        var vvMed1 = 0;
        var vvMed2 = 0;
        var vvLow = 0;
        var vvTableFull = [];
        var vvTableMed1 = [];
        var vvTableMed2 = [];
        var vvTableLow = [];
        /* ===== FIN ===== */

        /* ====== Var mur villages ===== */
        var wallFull = 0;
        var wallMed1 = 0;
        var wallMed2 = 0;
        var wallLow = 0;
        var wallTableFull = [];
        var wallTableMed1 = [];
        var wallTableMed2 = [];
        var wallTableLow = [];
        /* ===== FIN ===== */

        /* ====== Var Ferme  ===== */
        var farmnoFull = 0;
        var farmTablenoFull = [];

        /* ===== FIN ===== */

        /* ====== Var Entrepot  ===== */
        var storagenoFull = 0;
        var storageTablenoFull = [];

        /* ===== FIN ===== */

        /* ====== Listes pour les calculs ===== */
        var village = {
            'coord': undefined,
            'points': 0,
            'qg': 0,
            'caserne': 0,
            'ecurie': 0,
            'atelier': 0,
            'tdg': 0,
            'eglise1': 0,
            'eglise': 0,
            'academie': 0,
            'forge': 0,
            'place': 0,
            'statue': 0,
            'marche': 0,
            'bois': 0,
            'argile': 0,
            'fer': 0,
            'ferme': 0,
            'entrepot': 0,
            'cachette': 0,
            'mur': 0,
        }

        var moy = {
            'qg': 0,
            'caserne': 0,
            'ecurie': 0,
            'atelier': 0,
            'academie': 0,
            'forge': 0,
            'marche': 0,
            'bois': 0,
            'argile': 0,
            'fer': 0,
            'ferme': 0,
            'entrepot': 0,
            'mur': 0,

        }

        var bonus = {
            'bois': 0,
            'argile': 0,
            'fer': 0,
            'ferme': 0,
            'caserne': 0,
            'ecurie': 0,
            'atelier': 0,
            'ressources': 0,
            'marche': 0,
        }

        /* ---- Extraction des village bonus ---- */
        bonus.bois = $tableauVillage.find('.bonus_icon_1').length;
        bonus.argile = $tableauVillage.find('.bonus_icon_2').length;
        bonus.fer = $tableauVillage.find('.bonus_icon_3').length;
        bonus.ferme = $tableauVillage.find('.bonus_icon_4').length;
        bonus.caserne = $tableauVillage.find('.bonus_icon_5').length;
        bonus.ecurie = $tableauVillage.find('.bonus_icon_6').length;
        bonus.atelier = $tableauVillage.find('.bonus_icon_7').length;
        bonus.ressources = $tableauVillage.find('.bonus_icon_8').length;
        bonus.marche = $tableauVillage.find('.bonus_icon_9').length;

        var vvBonusTotal = bonus.bois + bonus.argile + bonus.fer + bonus.ferme + bonus.caserne + bonus.ecurie + bonus.atelier + bonus.ressources + bonus.marche;
        var vvNormTotal = trLenght - vvBonusTotal;

        /* ====== FIN ===== */

        /* ====== Fonction pour le calcul des datas ===== */
        function batPoints(village) {
            moy.qg += village.qg;
            moy.caserne += village.caserne;
            moy.ecurie += village.ecurie;
            moy.atelier += village.atelier;
            moy.academie += village.academie;
            moy.forge += village.forge;
            moy.marche += village.marche;
            moy.bois += village.bois;
            moy.argile += village.argile;
            moy.fer += village.fer;
            moy.ferme += village.ferme;
            moy.entrepot += village.entrepot;
            moy.mur += village.mur;


            if (village.points > 9999) {
                vvFull += 1;
                vvTableFull.push(village.coord);
            } else if (village.points > 6999) {
                vvMed1 += 1
                vvTableMed1.push(village.coord);
            } else if (village.points > 3999) {
                vvMed2 += 1
                vvTableMed2.push(village.coord);
            } else {
                vvLow += 1;
                vvTableLow.push(village.coord);
            }

            if (village.mur > 19) {
                wallFull += 1;
                wallTableFull.push(village.coord);
            } else if (village.mur > 15) {
                wallMed1 += 1
                wallTableMed1.push(village.coord);
            } else if (village.mur > 10) {
                wallMed2 += 1
                wallTableMed2.push(village.coord);
            } else {
                wallLow += 1;
                wallTableLow.push(village.coord);
            }

            if (village.ferme < 30) {
                farmnoFull += 1;
                farmTablenoFull.push(village.coord);
            }
            if (village.entrepot < 30) {
                storagenoFull += 1;
                storageTablenoFull.push(village.coord);
            }
        }
        /* ====== FIN ===== */


        /* ====== On parse le Tableau ===== */
        $tableauVillage.find('tr').each(function (index, element) {
            var $this = $(this);

            /* ---- Extraction des Coords ---- */
            var coord = $this.find('span.quickedit-label').eq(0).html();
            coord = coord.trim();
            coord = coord.substr(-12, 7);

            /* ---- Extraction du Nom du village ---- */
            var nom_village = $this.find('span.quickedit-label').eq(0).data('text');

            /* ---- Extraction des Points ---- */
            $this.find('span.grey').remove();
            var points = parseInt($this.find('td').eq(3).html());

            /* ---- Var niveau batiments ---- */
            let lvl_qg = 0;
            let lvl_barracks = 0;
            let lvl_stable = 0;
            let lvl_garage = 0;
            let lvl_watchtower = 0;
            let lvl_firstchurch = 0;
            let lvl_church = 0;
            let lvl_snob = 0;
            let lvl_smith = 0;
            let lvl_place = 0;
            let lvl_statue = 0;
            let lvl_market = 0;
            let lvl_wood = 0;
            let lvl_stone = 0;
            let lvl_iron = 0;
            let lvl_farm = 0;
            let lvl_storage = 0;
            let lvl_hide = 0;
            let lvl_wall = 0;

            switch (thLenght) {
                case 24: //Monde Eglise avec TdG
                    lvl_qg = parseInt($this.find('td.upgrade_building').eq(0).html());
                    lvl_barracks = parseInt($this.find('td.upgrade_building').eq(1).html());
                    lvl_stable = parseInt($this.find('td.upgrade_building').eq(2).html());
                    lvl_garage = parseInt($this.find('td.upgrade_building').eq(3).html());
                    lvl_watchtower = parseInt($this.find('td.upgrade_building').eq(4).html());
                    lvl_firstchurch = parseInt($this.find('td.upgrade_building').eq(5).html());
                    lvl_church = parseInt($this.find('td.upgrade_building').eq(6).html());
                    lvl_snob = parseInt($this.find('td.upgrade_building').eq(7).html());
                    lvl_smith = parseInt($this.find('td.upgrade_building').eq(8).html());
                    lvl_place = parseInt($this.find('td.upgrade_building').eq(9).html());
                    lvl_statue = parseInt($this.find('td.upgrade_building').eq(10).html());
                    lvl_market = parseInt($this.find('td.upgrade_building').eq(11).html());
                    lvl_wood = parseInt($this.find('td.upgrade_building').eq(12).html());
                    lvl_stone = parseInt($this.find('td.upgrade_building').eq(13).html());
                    lvl_iron = parseInt($this.find('td.upgrade_building').eq(14).html());
                    lvl_farm = parseInt($this.find('td.upgrade_building').eq(15).html());
                    lvl_storage = parseInt($this.find('td.upgrade_building').eq(16).html());
                    lvl_hide = parseInt($this.find('td.upgrade_building').eq(17).html());
                    lvl_wall = parseInt($this.find('td.upgrade_building').eq(18).html());
                    break;
                case 23: //Monde Eglise Sand TdG
                    lvl_qg = parseInt($this.find('td.upgrade_building').eq(0).html());
                    lvl_barracks = parseInt($this.find('td.upgrade_building').eq(1).html());
                    lvl_stable = parseInt($this.find('td.upgrade_building').eq(2).html());
                    lvl_garage = parseInt($this.find('td.upgrade_building').eq(3).html());
                    lvl_firstchurch = parseInt($this.find('td.upgrade_building').eq(4).html());
                    lvl_church = parseInt($this.find('td.upgrade_building').eq(5).html());
                    lvl_snob = parseInt($this.find('td.upgrade_building').eq(6).html());
                    lvl_smith = parseInt($this.find('td.upgrade_building').eq(7).html());
                    lvl_place = parseInt($this.find('td.upgrade_building').eq(8).html());
                    lvl_statue = parseInt($this.find('td.upgrade_building').eq(9).html());
                    lvl_market = parseInt($this.find('td.upgrade_building').eq(10).html());
                    lvl_wood = parseInt($this.find('td.upgrade_building').eq(11).html());
                    lvl_stone = parseInt($this.find('td.upgrade_building').eq(12).html());
                    lvl_iron = parseInt($this.find('td.upgrade_building').eq(13).html());
                    lvl_farm = parseInt($this.find('td.upgrade_building').eq(14).html());
                    lvl_storage = parseInt($this.find('td.upgrade_building').eq(15).html());
                    lvl_hide = parseInt($this.find('td.upgrade_building').eq(16).html());
                    lvl_wall = parseInt($this.find('td.upgrade_building').eq(17).html());
                    break;
                case 22: // Monde TdG
                    lvl_qg = parseInt($this.find('td.upgrade_building').eq(0).html());
                    lvl_barracks = parseInt($this.find('td.upgrade_building').eq(1).html());
                    lvl_stable = parseInt($this.find('td.upgrade_building').eq(2).html());
                    lvl_garage = parseInt($this.find('td.upgrade_building').eq(3).html());
                    lvl_watchtower = parseInt($this.find('td.upgrade_building').eq(4).html());
                    lvl_snob = parseInt($this.find('td.upgrade_building').eq(5).html());
                    lvl_smith = parseInt($this.find('td.upgrade_building').eq(6).html());
                    lvl_place = parseInt($this.find('td.upgrade_building').eq(7).html());
                    lvl_statue = parseInt($this.find('td.upgrade_building').eq(8).html());
                    lvl_market = parseInt($this.find('td.upgrade_building').eq(9).html());
                    lvl_wood = parseInt($this.find('td.upgrade_building').eq(10).html());
                    lvl_stone = parseInt($this.find('td.upgrade_building').eq(11).html());
                    lvl_iron = parseInt($this.find('td.upgrade_building').eq(12).html());
                    lvl_farm = parseInt($this.find('td.upgrade_building').eq(13).html());
                    lvl_storage = parseInt($this.find('td.upgrade_building').eq(14).html());
                    lvl_hide = parseInt($this.find('td.upgrade_building').eq(15).html());
                    lvl_wall = parseInt($this.find('td.upgrade_building').eq(16).html());
                    break;
                default: // Monde Sans Eglise et Sans TdG
                    lvl_qg = parseInt($this.find('td.upgrade_building').eq(0).html());
                    lvl_barracks = parseInt($this.find('td.upgrade_building').eq(1).html());
                    lvl_stable = parseInt($this.find('td.upgrade_building').eq(2).html());
                    lvl_garage = parseInt($this.find('td.upgrade_building').eq(3).html());
                    lvl_snob = parseInt($this.find('td.upgrade_building').eq(4).html());
                    lvl_smith = parseInt($this.find('td.upgrade_building').eq(5).html());
                    lvl_place = parseInt($this.find('td.upgrade_building').eq(6).html());
                    lvl_statue = parseInt($this.find('td.upgrade_building').eq(7).html());
                    lvl_market = parseInt($this.find('td.upgrade_building').eq(8).html());
                    lvl_wood = parseInt($this.find('td.upgrade_building').eq(9).html());
                    lvl_stone = parseInt($this.find('td.upgrade_building').eq(10).html());
                    lvl_iron = parseInt($this.find('td.upgrade_building').eq(11).html());
                    lvl_farm = parseInt($this.find('td.upgrade_building').eq(12).html());
                    lvl_storage = parseInt($this.find('td.upgrade_building').eq(13).html());
                    lvl_hide = parseInt($this.find('td.upgrade_building').eq(14).html());
                    lvl_wall = parseInt($this.find('td.upgrade_building').eq(15).html());
                    break;
            }

            /* ---- Cas où il 0 niveau de batiment (eviter les NaN) ---- */
            if (isNaN(lvl_qg)) {
                lvl_qg = 0
            };
            if (isNaN(lvl_barracks)) {
                lvl_barracks = 0
            };
            if (isNaN(lvl_stable)) {
                lvl_stable = 0
            };
            if (isNaN(lvl_garage)) {
                lvl_garage = 0
            };
            if (isNaN(lvl_watchtower)) {
                lvl_watchtower = 0
            };
            if (isNaN(lvl_firstchurch)) {
                lvl_firstchurch = 0
            };
            if (isNaN(lvl_church)) {
                lvl_church = 0
            };
            if (isNaN(lvl_snob)) {
                lvl_snob = 0
            };
            if (isNaN(lvl_smith)) {
                lvl_smith = 0
            };
            if (isNaN(lvl_place)) {
                lvl_place = 0
            };
            if (isNaN(lvl_statue)) {
                lvl_statue = 0
            };
            if (isNaN(lvl_market)) {
                lvl_market = 0
            };
            if (isNaN(lvl_wood)) {
                lvl_wood = 0
            };
            if (isNaN(lvl_stone)) {
                lvl_stone = 0
            };
            if (isNaN(lvl_iron)) {
                lvl_iron = 0
            };
            if (isNaN(lvl_farm)) {
                lvl_farm = 0
            };
            if (isNaN(lvl_storage)) {
                lvl_storage = 0
            };
            if (isNaN(lvl_hide)) {
                lvl_hide = 0
            };
            if (isNaN(lvl_wall)) {
                lvl_wall = 0
            };


            /* ---- On push la liste ---- */
            village.coord = coord
            village.points = points;
            village.qg = lvl_qg;
            village.caserne = lvl_barracks;
            village.ecurie = lvl_stable;
            village.atelier = lvl_garage;
            village.tdg = lvl_watchtower;
            village.eglise1 = lvl_firstchurch;
            village.eglise = lvl_church;
            village.academie = lvl_snob;
            village.forge = lvl_smith;
            village.place = lvl_place;
            village.statue = lvl_statue;
            village.marche = lvl_market;
            village.bois = lvl_wood;
            village.argile = lvl_stone;
            village.fer = lvl_iron;
            village.ferme = lvl_farm;
            village.entrepot = lvl_storage;
            village.cachette = lvl_hide;
            village.mur = lvl_wall;

            //console.log(coord, " | ", village);

            /* ---- Fonction pour les datas ---- */
            batPoints(village);

        });
        /* ====== FIN ===== */

        /* ======Affichage des Resultats ===== */
        var tableauBat = document.getElementById('content_value');
        var divGraph = document.createElement('div');
        divGraph.setAttribute("id", "graphiques")
        var divData = document.createElement('div');

        tableauBat.append(divGraph);
        tableauBat.append(divData);


        var html_graph = '';

        //-- Graph répartition par points
        html_graph += '<div style="margin-left:2.5%;width:95%;margin-bottom: 4%;height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Moyenne des points de batiments par village</h3><canvas id="graphtablePoints" height="270"></canvas></div>';
        html_graph += '<div style="clear:both;margin-top: 305px;">&nbsp;</div>';
        html_graph += '<div style="margin-left:2.5%;width:30%;margin-bottom: 4%;height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Répartition des villages par points</h3><canvas id="graphPiePoints" height="270"></canvas></div>';
        html_graph += '<div style="margin-left:2.5%;width:30%;margin-bottom: 4%;height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Villages par niveau de Mur</h3><canvas id="graphPieMur" height="270"></canvas></div>';
        html_graph += '<div style="margin-left:2.5%;width:30%;margin-bottom: 4%;height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Villages Bonus</h3><canvas id="graphPieBonus" height="270"></canvas></div>';
        html_graph += '<div style="clear:both;margin-top: 325px;">&nbsp;</div>';
        html_graph += '<div style="margin-left:2.5%;width:30%;margin-bottom: 4%;height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Villages Normaux / Villages Bonus</h3><canvas id="graphPieTotal" height="270"></canvas></div>';
        html_graph += '<div style="margin-left:2.5%;width:30%;margin-bottom: 4%;height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Village par niveau de Ferme</h3><canvas id="graphPieFarm" height="270"></canvas></div>';
        html_graph += '<div style="margin-left:2.5%;width:30%;margin-bottom: 4%;height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Village par niveau d\'Entrepôt</h3><canvas id="graphPieStorage" height="270"></canvas></div>';


        divGraph.innerHTML += html_graph;

        var html_datas = '';
        html_datas += '<div style="clear:both;margin-top: 325px;">&nbsp;</div>';
        html_datas += ' <h3>Extraction BB-codes </h3>'
        html_datas += '<textarea style="width: 100%;" rows="15">';
        html_datas += '\n [b]Nombre total de villages : [/b]' + trLenght;
        html_datas += '\n [b]Villages complets  : [/b]' + vvFull;
        html_datas += '\n [b]Villages 50% évolués : [/b]' + vvMed1;
        html_datas += '\n [b]Villages 25 % évolués : [/b]' + vvMed2;
        html_datas += '\n [b]Villages Start[/b] : ' + vvLow;
        html_datas += '\n [b]Villages avec Mur bas : [/b]' + (wallMed1 + wallMed2 + wallLow);

        html_datas += '\n\n[b]Villages +10k points :[/b] \n [spoiler] \n';
        var tabFullLength = vvTableFull.length;
        for (var x = 0; x < tabFullLength; x++) {
            html_datas += ' [coord]' + vvTableFull[x] + '[/coord] \n';
        };

        html_datas += '[/spoiler] \n\n[b]Villages de 7 à 10k points :[/b] [spoiler] \n';
        var tabMed1Length = vvTableMed1.length;
        for (var x = 0; x < tabMed1Length; x++) {
            html_datas += ' [coord]' + vvTableMed1[x] + '[/coord] \n';
        };

        html_datas += '[/spoiler] \n\n[b]Villages de 3 à 7k points :[/b] [spoiler] \n';
        var tabMed2Length = vvTableMed2.length;
        for (var x = 0; x < tabMed2Length; x++) {
            html_datas += ' [coord]' + vvTableMed2[x] + '[/coord] \n';
        };
        html_datas += '[/spoiler] \n\n[b]Villages -3k points points :[/b] [spoiler] \n';
        var tabLowLength = vvTableLow.length;
        for (var x = 0; x < tabLowLength; x++) {
            html_datas += ' [coord]' + vvTableLow[x] + '[/coord] \n';
        };
        html_datas += '[/spoiler]';
        html_datas += '</textarea>';

        html_datas += ' <h3>Détail Villages par Mur / Ferme / Entrepôt </h3>'
        html_datas += '<textarea style="width: 100%;" rows="15">';
        html_datas += '[b]Villages Mur bas :[/b]  [spoiler] \n';
        var tabwallmed1 = wallTableMed1.length;
        var tabwallmed2 = wallTableMed2.length;
        var tabwalllow = wallTableLow.length;

        for (var x = 0; x < tabwallmed1; x++) {
            html_datas += ' [coord]' + wallTableMed1[x] + '[/coord] \n';
        };
        for (var x = 0; x < tabwallmed2; x++) {
            html_datas += ' [coord]' + wallTableMed2[x] + '[/coord] \n';
        };
        for (var x = 0; x < tabwalllow; x++) {
            html_datas += ' [coord]' + wallTableLow[x] + '[/coord] \n';
        };

        html_datas += '[/spoiler]\n\n[b]Villages Ferme <30 :[/b]  [spoiler] \n';
        var tabfarmLow = farmTablenoFull.length;
        for (var x = 0; x < tabfarmLow; x++) {
            html_datas += ' [coord]' + farmTablenoFull[x] + '[/coord] \n';
        };
        html_datas += '[/spoiler]\n\n[b]Villages Entrepôt  <30 :[/b]  [spoiler] \n';
        var tabstorageLow = storageTablenoFull.length;
        for (var x = 0; x < tabstorageLow; x++) {
            html_datas += ' [coord]' + storageTablenoFull[x] + '[/coord] \n';
        };

        html_datas += '[/spoiler]';


        html_datas += '</textarea>';

        divData.innerHTML += html_datas;


        /* ====== FIN ===== */


        /* ====== Initialisation des Graphiques ===== */
        javascript: $.getScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.min.js', function (data, textStatus, jqxhr) {
            var graph1 = document.getElementById('graphPiePoints');
            var graph2 = document.getElementById('graphPieMur');
            var mixedchart = document.getElementById('graphtablePoints');
            var graph3 = document.getElementById('graphPieBonus');
            var graph4 = document.getElementById('graphPieTotal');
            var graph5 = document.getElementById('graphPieFarm');
            var graph6 = document.getElementById('graphPieStorage');

            new Chart(mixedchart, {
                type: 'bar',
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                },
                data: {
                    labels: ['Qg', 'Caserne', 'Ecurie', 'Atelier', 'Académie', 'Forge', 'Marché', 'Bois', 'Argile', 'Fer', 'Ferme', 'Entrepot', 'Mur'],
                    datasets: [{
                        label: 'Moyenne de points',
                        data: [(moy.qg / trLenght), (moy.caserne / trLenght), (moy.ecurie / trLenght), (moy.atelier / trLenght), (moy.academie / trLenght), (moy.forge / trLenght), (moy.marche / trLenght), (moy.bois / trLenght), (moy.argile / trLenght), (moy.fer / trLenght), (moy.ferme / trLenght), (moy.entrepot / trLenght), (moy.mur / trLenght)],
                        backgroundColor: "rgba(255,53,51,0.4)"
                    }, {
                        label: 'Village Optimisé',
                        data: [20, 25, 20, 15, 1, 20, 20, 30, 30, 30, 30, 30, 20],
                        borderColor: "rgba(63,127,191,0.7)",
                        type: 'line'
                    }]
                }
            });



            new Chart(graph1, {
                type: 'doughnut',
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                },
                data: {
                    labels: ['+ 10k pts', '7k à 10k pts', '3k à 7k pts', '- 3k pts'],
                    datasets: [{
                        data: [vvFull, vvMed1, vvMed2, vvLow],
                        backgroundColor: ["rgba(255,53,51,0.4)", "rgba(63,127,191,0.7)", "rgba(53,255,51,0.4)", "rgba(148, 71, 134,0.7)"]
                    }]
                }
            });

            new Chart(graph2, {
                type: 'doughnut',
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                },
                data: {
                    labels: ['Mur 20', 'Mur 15 à 20', 'Mur 10 à 15', 'Mur inf à 10'],
                    datasets: [{
                        data: [wallFull, wallMed1, wallMed2, wallLow],
                        backgroundColor: ["rgba(255,53,51,0.4)", "rgba(63,127,191,0.7)", "rgba(53,255,51,0.4)", "rgba(148, 71, 134,0.7)"]
                    }]
                }
            });

            new Chart(graph3, {
                type: 'doughnut',
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                },
                data: {
                    labels: ['Bois', 'Argile', 'Fer', 'Ferme', 'Caserne', 'Écurie', 'Atelier', 'Ressources', 'Marché'],
                    datasets: [{
                        data: [bonus.bois, bonus.argile, bonus.fer, bonus.ferme, bonus.caserne, bonus.ecurie, bonus.atelier, bonus.ressources, bonus.marche],
                        backgroundColor: ["rgba(255,53,51,0.4)", "rgba(63,127,191,0.7)", "rgba(53,255,51,0.4)", "rgba(148, 71, 134,0.7)", "rgba(244, 220, 36,0.7)", "rgba(186, 97, 53,0.4)", "rgba(53, 186, 186,0.7)", "rgba(81, 126, 113,0.4)", "rgba(208, 235, 199,0.7)"]
                    }]
                }
            });

            new Chart(graph4, {
                type: 'doughnut',
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                },
                data: {
                    labels: ['Villages Bonus', 'Villages Normaux'],
                    datasets: [{
                        data: [vvBonusTotal, vvNormTotal],
                        backgroundColor: ["rgba(255,53,51,0.4)", "rgba(63,127,191,0.7)"]
                    }]
                }
            });

            new Chart(graph5, {
                type: 'doughnut',
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                },
                data: {
                    labels: ['Ferme lvl 30', 'Ferme <30'],
                    datasets: [{
                        data: [trLenght - farmnoFull, farmnoFull],
                        backgroundColor: ["rgba(255,53,51,0.4)", "rgba(63,127,191,0.7)"]
                    }]
                }
            });

            new Chart(graph6, {
                type: 'doughnut',
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                },
                data: {
                    labels: ['Entrepôt 30', 'Entrepot <30'],
                    datasets: [{
                        data: [trLenght - storagenoFull, storagenoFull],
                        backgroundColor: ["rgba(255,53,51,0.4)", "rgba(63,127,191,0.7)"]
                    }]
                }
            });

            window.location.href = '#graphiques';
        });

    }
    /* ====== FIN ===== */

    NewHUDBatGT()


})();
