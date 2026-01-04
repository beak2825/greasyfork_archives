// ==UserScript==
// @name         Hentai Heroes - Banned Edition
// @namespace    hentaiheroes.com
// @version      0.1.94

// @description  try to take over the world!
// @match			https://*.hentaiheroes.com/*
// @match			https://*.haremheroes.com/*
// @match           https://*.comixharem.com/*
// @match           https://*.pornstarharem.com/*

// @grant			none
// @author			Tom208
// @downloadURL https://update.greasyfork.org/scripts/418472/Hentai%20Heroes%20-%20Banned%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/418472/Hentai%20Heroes%20-%20Banned%20Edition.meta.js
// ==/UserScript==


// v0.1.94: 2024/11/16 21h30: Changement du nom des colonnes de l'export des joueurs de ligue.
// v0.1.93: 2024/10/27 01h00: Remplacement du bouton x10 pour les champions par un bouton avec le max possible de combats.
// v0.1.92: 2024/10/15 22h00: Correction d'un bug d'affichage quand on affiche la fille en ligue.
// v0.1.91: 2024/06/18 22h15: Correction d'un bug avec le bouton x10 du champion de club.
// v0.1.90: 2024/04/04 17h05: Correction de l'export des données suite au changement de variable du jeu.
// v0.1.89: 2024/04/02 19h05: Changement de style du bouton d'export.
// v0.1.88: 2024/02/01 22h45: Ajouter d'une colonne dans l'export de ligue concernant le nombre d'ampoules de niveau 5 pour toute l'équipe adverse
// v0.1.87: 2024/01/17 22h50: Correction de bug suite au changement d'adresse de la ligue.
// v0.1.86: 2023/11/09 23h00: Ajout d'infos dans l'export (boosters actifs, paliers de compétences).
// v0.1.85: 2023/09/20 03h00: Changement de place du bouton d'export.
// v0.1.84: 2023/09/18 23h00: Correction d'un bug sur la détection du palier 5 des compétences des filles.
// v0.1.83: 2023/09/18 21h30: Ajout de l'export de ligue suite à la refonte de la page de ligue.
// v0.1.82: 2023/08/03 23h30: Optimisation pour ne pas simuler le combat d'un joueur déjà affronté.
// v0.1.81: 2023/08/03 22h15: Refonte du simulateur de combat suite à la mise à jour de la page de ligue.
// v0.1.80: 2023/06/21 23h45: Changement de la sensibilité de détection des boosters.
// v0.1.79: 2023/06/07 23h55: Changement du nom de la requête pour récupérer les informations des adversaires de ligue.
// v0.1.78: 2023/05/24 12h00: Prise en compte de la mise à jour du jeu pour le récupération des infos de profil des adversaires.
// v0.1.77: 2023/04/25 20h00: Affichage du bouton x10 en cas de reset du timer de recharge.
// v0.1.76: 2023/04/23 23h00: Ajout d'un bouton x10 pour les combats de champion.
// v0.1.75: 2023/03/28 21h00: Changement de l'heure des changements de stats en ligue.
// v0.1.74: 2023/03/28 23h30: Correction d'un bug dans l'export de ligue.
// v0.1.73: 2023/03/26 01h00: Correction d'un bug sur le changement d'heure été/hiver.
// v0.1.72: 2023/03/22 14h14: Correction d'un bug sur l'affichage de la puissance de l'équipe adverse.
// v0.1.71: 2023/03/22 09h30: Correction du nom de certaines données suite à une mise à jour du jeu.
// v0.1.70: 2023/03/19 19h05: Changement automatique heure d'été / heure d'hiver
// v0.1.69: 2023/01/15 01h45: Correction d'un bug sur la récupération des boosters.
// v0.1.68: 2023/01/04 21h50: Nettoyage de code + optimisation de la simulation des combats.
// v0.1.67: 2022/12/31 01h00: Correction d'un bug sur le déclenchement du refresh auto en ligue.
// v0.1.66: 2022/12/28 02h00: Correction de bugs dans la détection des boosters.
// v0.1.65: 2022/12/28 01h00: Prise en compte des équipements mythiques dans la détection des boosters.
// v0.1.64: 2022/10/30 12h50: Passage à l'heure d'hiver.
// v0.1.63: 2022/10/07 23h50: Changement d'heure des refresh de ligue.
// v0.1.62: 2022/10/07 21h10: Adaptation de la partie ligue du script au nouveau marché.
// v0.1.61: 2022/09/28 22h50: Ajout de Comix Harem et Pornstar Harem.
// v0.1.60: 2022/09/27 23h00: Correction de bug dans le marché.
// v0.1.59: 2022/09/21 00h30: Correction du calcul de comparaison des équipements au marché.
// v0.1.58: 2022/09/15 22h00: Correction d'un bug dans le calcul des scores des adversaires en ligue.
// v0.1.57: 2022/09/09 12h15: Correction de bug.
// v0.1.56: 2022/09/03 23h30: Mémorisation du tri par puissance des équipes de ligue + indicateur du sens du tri
// v0.1.55: 2022/07/10 11h30: Correction de bug.
// v0.1.54: 2022/07/09 23h30: Ajout d'un tri des joueurs de ligue par puissance des équipes.
// v0.1.53: 2022/06/10 23h15: Prise en compte du bonus de domination initial dans le calcul des scores de ligue.
// v0.1.52: 2022/06/06 21h25: Correction d'un bug sur la détection des boosters de type chlorella.
// v0.1.51: 2022/06/03 21h15: Bonus d'égo du schéma de domination prise en compte dans les stats du jeu.
// v0.1.50: 2022/05/27 12h00: Suppression du message d'alerte au marché.
// v0.1.49: 2022/05/26 21h50: Changement du chargement du script.
// v0.1.48: 2022/05/25 10h50: Changement données adversaires.
// v0.1.46: 2022/04/14 22h40: Suppression de la bordure blanche autour des boosters.
// v0.1.45: 2022/04/12 23h45: Retour des logs car le problème n'a lieu que sur le serveur test.
// v0.1.44: 2022/04/12 17h55: Suppression des logs en raison de leur affichage sur mobile sur le serveur test.
// v0.1.43: 2022/04/09 21h00: Modification des conditions des requêtes en ligue. Déplacement du bouton de filtre du marché.
// v0.1.42: 2022/03/27 00h55: Passage à l'heure d'été.
// v0.1.41: 2022/02/23 21h30: Modification du chargement des équipements du marché.
// v0.1.40: 2022/02/06 01h00: Correction d'un bug dans la détection des chlorella.
// v0.1.39: 2022/02/04 01h00: Nouvelle simu des combats de ligue.
// v0.1.38: 2022/01/11 13h20: Correction de bug dans l'export des données.
// v0.1.37: 2022/01/11 09h30: Correction de bug dans l'export des données.
// v0.1.36: 2022/01/11 18h50: Correction de bug sur la détection des éléments de l'équipe adverse.
// v0.1.35: 2022/01/10 20h05: Correction d'un bug sur les bonus de synergies adverses.
// v0.1.34: 2022/01/10 16h55: Correction du seuil de détection des boosters. Nettoyage de code mort.
// v0.1.33: 2022/01/07 20h25: Ajout du serveur Nutaku.
// v0.1.32: 2022/01/07 20h20: Changement du timer de requêtes.
// v0.1.31: 2022/01/07 19h30: Changement du calcul des boosters.
// v0.1.30: 2022/01/05 10h30: Changement du numéro de version.
// v0.1.29: 2022/01/04 23h30: Modification des données des adversaires en ligue.
// v0.1.28: 2021/12/08 00h35: Suppression des scores en saison. Suppression du lien vers le marché depuis les scores de ligue. Changement des heures de refresh.
// v0.1.27: 2021/11/25 21h45: Ajout de la puissance de l'équipe adverse en ligue.
// v0.1.26: 2021/11/23 00h30: Ajout du level moyen de l'équipe adverse en ligue. Suppression des scores "équipements opti" et espérance.
// v0.1.25: 2021/11/11 15h00: Correction d'un bug pour le nom de l'adversaire lors de l'export.
// v0.1.24: 2021/11/10 09h00: Correction de bugs suite à changement de code côté serveur.
// v0.1.23: 2021/11/10 00h00: Prends en compte tous les bonus passifs en ligue. Affiche l'élément de l'équipe adverse. Passage à l'heure d'hiver.
// v0.1.22: 2021/10/16 21h00: Corrige quelques problèmes suite à l'apparition des "éléments".
// v0.1.21: 2021/09/29 22h00: Suppression de l'affichage des boosters de soi-même.
// v0.1.20: 2021/09/26 16h00: Optimisation des scores des combats de ligue par rapport à l'harmonie et non à l'espérance.
// v0.1.19: 2021/09/10 11h45: Ajout de la puissance de l'équipe dans l'export csv
// v0.1.18: 2021/09/10 11h35: Corrige le problème d'affichage sur 2 lignes des boosters
// v0.1.17: 2021/09/10 11h20: Prise en compte du booster pvp mythique dans le choix des équipements opti
// v0.1.16: 2021/09/10 09h00: Ajout d'attente sur les requêtes serveur
// v0.1.15: 2021/09/09 02h20: Correction d'un bug sur le calcul de l'attaque avec le booster pvp mythique
// v0.1.14: 2021/09/08 19h10: Correction d'un bug pour récupérer la puissance de l'équipe en saison
// v0.1.13: 2021/09/08 19h00: Prise en compte du booster pvp mythique
// v0.1.12: 2021/09/07 00h30: Corrections de bugs
// v0.1.11: 2021/09/01 18h30: Corrections de bugs + amélioration détection boosters
// v0.1.10: 2021/09/01 10h00: Fix HH stupid change of API.
// v0.1.9: 2021/07/22 20h50: Nouveau système de combats + nouveau système de points en ligue
// v0.1.8: 2021/07/03 17h13: Ajoute l'optimisation de l'équipe.
// v0.1.7: 2021/02/03 18h41: Fix HH stupid change of API.
// v0.1.6: 2021/01/30 12h50: Corrige crit CH def.
// v0.1.5: 2021/01/30 12h30: Prend en compte le +20% d'harmonie des classes, utilise l'espérence des coups critiques
// v0.1.4: 2021/01/14 13h50: Corrige bug reset ligue (nettoyage données de la ligue précédente) + TALO.
// v0.1.3: 2021/01/08 02h50: Supprime les données ligues lors du reset de ligue, affiche la taille des données dans le localStorage.
// v0.1.2: 2020/12/28 17h30: Corrige bug détection chlorella (carac correspondant à alpha pas player pour ego) + ego dans opti équipement (prennait l'égo actuel).
// v0.1.1: 2020/12/21 18h40: Prend en compte le bug charme.
// v0.1.0: Version initiale

setTimeout(function() {

    // Define jQuery
    var $ = window.jQuery;

    // Define CSS
    var sheet = (function() {
        var style = document.createElement('style');
        document.head.appendChild(style);
        return style.sheet;
    })();

    var currentPage = window.location.pathname;

    const pageLang = $('html')[0].lang.substring(0,2);

    // Numbers: rounding to K, M, G and T
    function nRounding(num, digits, updown) {
        let power = [
            { value: 1, symbol: '' },
            { value: 1E3, symbol: 'K' },
            { value: 1E6, symbol: 'M' },
            { value: 1E9, symbol: 'B' },
            { value: 1E12, symbol: 'T' },
        ];
        let i;
        for (i = power.length - 1; i > 0; i--) {
            if (num >= power[i].value) {
                break;
            }
        }
        if (updown == 1) {
            return nThousand(+(Math.ceil(num / power[i].value * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits)) + power[i].symbol;
        }
        else if (updown == 0) {
            return nThousand(+(Math.round(num / power[i].value * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits)) + power[i].symbol;
        }
        else if (updown == -1) {
            return nThousand(+(Math.floor(num / power[i].value * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits)) + power[i].symbol;
        }
    }

    // Thousand spacing
    function nThousand(x) {
        if(typeof x != 'number') {
            return 0;
        }
        switch(pageLang){ //atm this shows the numbers equal to the game
            case 'ja':
            case 'en': return x.toLocaleString("en")
            default: return x.toLocaleString("fr")
        }
    }

    /**
 * ELEMENTS ASSUMPTIONS
 *
 * 1) Girl and Harem synergy bonuses for Attack, Defense, Ego and Harmony are already included in the shown stats
 * 2) Girl and Harem synergy bonuses for Crit damage, Defense reduction, Heal-on-hit, and Crit chance are not shown at all for opponents and must be built from team and an estimate of harem
 * 3) Countering bonuses are not included in any shown stats
 *
 * ELEMENTS FACTS
 *
 * 1) Crit damage and chance bonuses are additive; Ego and damage bonuses are multiplicative
 * 2) Opponent harem synergies are completely unavailable to the player, it has been promised that they will be available soon but not in the initial release
 */
    const ELEMENTS = {
        chance: {
            darkness: 'light',
            light: 'psychic',
            psychic: 'darkness'
        },
        egoDamage: {
            fire: 'nature',
            nature: 'stone',
            stone: 'sun',
            sun: 'water',
            water: 'fire'
        }
    };

    const class_names = [null, 'HC', 'CH', 'KH'];

    const tier5_skill_id = [11, 12, 13, 14];
    const tier5_skill_names = {11: 'Stun', 12: 'Shield', 13: 'Reflect', 14: 'Execute'};


    /****************** League ++ **********************/
    (function() {

        if (currentPage.indexOf('leagues') == -1) return;

        let export_btn = $('<button class="square_blue_btn" type="button" style="width: 84px; color: #fff;">Export</button>');
        export_btn.click( () => { exportLeaguePlayersData(); });

        let btn_div = $('<div id="control_btns" style="position: relative; left: 35px;"></div>');
        btn_div.append(export_btn);
        $('#leagues .league_buttons').append(btn_div);

        function exportLeaguePlayersData() {
            let header = [
                'ID',
                'Name',
                'Score',
                'Lvl',
                'Class',
                'Team pow',
                'Ego',
                'Def',
                'Dmg',
                'Harmo',
                'T5 skill',
                'T5 value',
                'T2 points',
                'T3 points',
                'T4 points',
                'T5 points',
                'Boosters',
                'Club',
            ];

            let content = [header];

            window.opponents_list.forEach((el) => {
                const id = el.player.id_fighter;

                if (id == window.shared.Hero.infos.id) return;

                const name = el.nickname;
                const lvl = el.level;
                const class_player = class_names[el.player.class];
                const team_power = Math.ceil(el.player.team.total_power);
                const ego = Math.ceil(el.player.team.caracs.ego);
                const defense = Math.ceil(el.player.team.caracs.defense);
                const damage = Math.ceil(el.player.team.caracs.damage);
                const chance = Math.ceil(el.player.team.caracs.chance);
                const club_name = (el.player.club) ? el.player.club.name : '-';

                let simu_score = 0;
                if (localStorage.getItem('HHS.simLeagueBoardFight')) simu_score = nRounding(el.can_fight, 2, 1);
                else if (localStorage.getItem('HHPlusPlusConfig')) {
                    if (JSON.parse(localStorage.getItem('HHPlusPlusConfig')).core_simFight) simu_score = nRounding(el.power, 2, 1);
                }

                let skill_tier_5 = {name: '-', value: 0};
                const girl = el.player.team.girls[0];
                tier5_skill_id.forEach((id) => {
                    if (girl.skills[id]) {
                        skill_tier_5.name = tier5_skill_names[id];
                        skill_tier_5.value = (id == 11) ? `${girl.skills[id].skill.display_value_text}` : `${girl.skills[id].skill.percentage_value}%`;
                    }
                })

                let skill_points = {2: 0, 3: 0, 4: 0, 5: 0};
                el.player.team.girls.forEach((girl) => {
                    skill_points[2] += (typeof(girl.skill_tiers_info[2]) != "undefined") ? girl.skill_tiers_info[2].skill_points_used : 0;
                    skill_points[3] += (typeof(girl.skill_tiers_info[3]) != "undefined") ? girl.skill_tiers_info[3].skill_points_used : 0;
                    skill_points[4] += (typeof(girl.skill_tiers_info[4]) != "undefined") ? girl.skill_tiers_info[4].skill_points_used : 0;
                    skill_points[5] += (typeof(girl.skill_tiers_info[5]) != "undefined") ? girl.skill_tiers_info[5].skill_points_used : 0;
                })

                const boosters = el.boosters;
                let boosters_expired = 'Non';
                for (let booster of boosters) {
                    if (booster.expiration > 0) boosters_expired = 'Oui';
                }
                
                content.push([
                    id,
                    name,
                    simu_score,
                    lvl,
                    class_player,
                    team_power,
                    ego,
                    defense,
                    damage,
                    chance,
                    skill_tier_5.name,
                    skill_tier_5.value,
                    skill_points[2],
                    skill_points[3],
                    skill_points[4],
                    skill_points[5],
                    boosters_expired,
                    club_name
                ]);
            });

            // https://stackoverflow.com/questions/13405129/javascriptcreateandsavefile
            // Function to download data to a file
            function download(data, filename, type) {
                var file = new Blob([data], {type: type});
                if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, filename);
                else { // Others than IE10+
                    var a = document.createElement("a"),
                        url = URL.createObjectURL(file);
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                }
            }

            content = Array.from(content, e => e.join('\t') );
            download(content.join('\n'), 'data.csv', 'text/csv' );
        }
    })();


    /********************* Champions Battles++ ***********************************/

    $(function() {

        if (currentPage.indexOf('/champions/') == -1 && currentPage.indexOf('/club-champion') == -1) return;

        displayMultipleChampionBattlesButton();

        function displayMultipleChampionBattlesButton() {
            const maxBattlesChampion = window.championData.champion.maxMultipleBattles;
            $('.champions-bottom__buttons-wrapper').append('<button class="multiple-champion-battles orange_button_L" style="position:absolute;left: 430px;">' + window.GT.design.champion_perform_button + ' ' + maxBattlesChampion + '</button>');

            if ($('.champions-bottom__buttons-wrapper .multiple-champion-battles.orange_button_L').length > 0) {
                document.querySelector('.multiple-champion-battles.orange_button_L').addEventListener('click', function() {
                    let query_url = window.location.origin + '/ajax.php';
                    console.log('Champion battles x' + maxBattlesChampion);

                    let champion_type = (currentPage.includes('/champions/')) ? 'champion' : 'club_champion';
                    let champion_id = window.championData.champion.id;
                    let champion_team_data = window.championData.team;
                    let champion_team = [];

                    for (let i=0; i<champion_team_data.length; i++) {
                        champion_team.push(champion_team_data[i].id_girl);
                    }

                    $.post(query_url, {class: 'TeamBattle', battle_type: champion_type, battles_amount: maxBattlesChampion, defender_id: champion_id, 'attacker[team]': champion_team});

                    setTimeout(function() {window.location.reload()}, 1000);
                });
            }
        }

        const observer = new MutationObserver(() => {
            if ($('.champions-bottom__buttons-wrapper').length > 0) {
                displayMultipleChampionBattlesButton();
            }
        });
        observer.observe($('#contains_all section')[0], {childList: true});
    })

}, 200)