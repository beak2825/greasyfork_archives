    // ==UserScript==
    // @name           GobZilla
    // @namespace      Gobland
    // @description    Outils d'aide au jeu
    // @include        http://games.gobland.fr/jeuC.html
    // @include        http://games.gobland.fr/act.php
    // @include        http://games.gobland.fr/Vue.php
    // @include        http://games.gobland.fr/Menu.php
    // @include        http://games.gobland.fr/Meute.php
    // @include        http://games.gobland.fr/ProfilPerso.php
    // @include        http://games.gobland.fr/SmallEquipement.php
    // @include        http://games.gobland.fr/fo_equipement.php*
    // @include        http://games.gobland.fr/Equipement.php
    // @include        http://games.gobland.fr/fo_orders.php*
    // @include        http://games.gobland.fr/amelioration.php
    // @include        http://games.gobland.fr/Follower.php*
    // @include        http://games.gobland.fr/Followers.php**
    // @include        http://games.gobland.fr/Options.php
    // @include        http://games.gobland.fr/activDLA.php
    // @include        http://games.gobland.fr/actions.php
    // @include        http://games.gobland.fr/playActions.php
    // @include        http://games.gobland.fr/goodies.php*
    // @include        http://games.gobland.fr/stock.php?*
    // @include        http://games.gobland.fr/membresClan.php
    // @include        http://games.gobland.fr/Quetes.php
    // @include        http://games.gobland.fr/depot.php*
    // @match          http://games.gobland.fr/index.php*
    // @match          https://games.gobland.fr/index.php*
    // @match          http://games.gobland.fr/playActions.php?todo=52
    // @require        https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.js
    // @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
    // @require        https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
    // @copyright      Lordslair, Seishin, Glak (393) et Death Métal (330)
    // @author         DeathMétal 330 - Glak 393
    // @license        https://creativecommons.org/licenses/by-sa/4.0/
    // @version        2.0.5.2
    // @icon           https://i.ibb.co/HB9XztJ/gobzilla.jpg
// @downloadURL https://update.greasyfork.org/scripts/451549/GobZilla.user.js
// @updateURL https://update.greasyfork.org/scripts/451549/GobZilla.meta.js
    // ==/UserScript==







// fonction herboriser (test seulement)
(function() {
    'use strict';

    const rangMultiplicateur = {
        'Apprenti': 1.5,
        'Compagnon': 2,
        'Maître': 2.5,
        'Grand Maître': 3
    };

    function askPER() {
        let per = localStorage.getItem('per_total');
        if (!per || isNaN(parseInt(per))) {
            per = prompt("Entrez votre PER total (PER + bonus éventuel)");
            if (per !== null && !isNaN(parseInt(per))) {
                localStorage.setItem('per_total', per);
            }
        }
        return parseInt(per);
    }

    function parsePage() {
        const content = document.querySelector('#identite .deborde');
        if (!content) return;

        const html = content.innerHTML;

        const matchCoord = html.match(/X=(-?\d+)\s+Y=(-?\d+)\s+N=(-?\d+)/);
        if (!matchCoord) return;

        const x0 = parseInt(matchCoord[1]);
        const y0 = parseInt(matchCoord[2]);
        const n0 = parseInt(matchCoord[3]);

        const directionMatch = html.match(/elle se trouve ([^<]+)/);
        if (!directionMatch) return;

        const directionText = directionMatch[1];

        const rangMatch = html.match(/en tant que (\w+ ?\w*)/i);
        const rang = rangMatch ? rangMatch[1].trim() : "Apprenti";

        const per = askPER();
        if (!per) return;

        const portéeMax = Math.floor(rangMultiplicateur[rang] * per);
        const portéeMin = Math.floor(rangMultiplicateur['Apprenti'] * per); // portée min = apprenti

        const direction = {
            x: 0,
            y: 0,
            n: 0
        };

        if (directionText.includes('plus en Osten')) direction.x = 1;
        if (directionText.includes('plus en Western')) direction.x = -1;
        if (directionText.includes('plus en Nordi')) direction.y = 1;
        if (directionText.includes('plus en Sudi')) direction.y = -1;
        if (directionText.includes('plus en Haut')) direction.n = 1;
        if (directionText.includes('plus en Bas')) direction.n = -1;

        const nPortéeMin = Math.floor(portéeMin / 2);
        const nPortéeMax = Math.floor(portéeMax / 2);

        const xMin = x0 + direction.x * portéeMin;
        const xMax = x0 + direction.x * portéeMax;
        const yMin = y0 + direction.y * portéeMin;
        const yMax = y0 + direction.y * portéeMax;
        const nMin = n0 + direction.n * nPortéeMin;
        const nMax = n0 + direction.n * nPortéeMax;

        const result = `
        <div style="border: 2px dashed #4caf50; padding: 8px; margin-top: 10px;">
        📍 <b>Estimation position de la plante</b><br>
        ➤ Direction : ${directionText}<br>
        ➤ Coordonnées actuelles : X=${x0}, Y=${y0}, N=${n0}<br>
        ➤ <b>Fourchette estimée</b> :<br>
        ⤷ X entre ${Math.min(xMin,xMax)} et ${Math.max(xMin,xMax)}<br>
        ⤷ Y entre ${Math.min(yMin,yMax)} et ${Math.max(yMin,yMax)}<br>
        ⤷ N entre ${Math.min(nMin,nMax)} et ${Math.max(nMin,nMax)}<br>
        (Portée ${rang} : ${portéeMax} cases, profondeur : ${nPortéeMax})
        </div>
        `;

        content.innerHTML += result;
    }

    window.addEventListener('load', parsePage);
})();



    //==================================================================
    /// Anaglobiseur (calculateur d'évolutiuon) (page amélioration)
    //=================================================================

    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/amelioration\.php/i)) {

    // Fonction pour créer les boutons + et -
    function createButtons(row, currentValue, costValue, price, updateValueFunc, improvements, specialty, characteristic ) {
        const buttonPlus = document.createElement('button');
        buttonPlus.textContent = '+';
        const buttonMinus = document.createElement('button');
        buttonMinus.textContent = '-';
        row.appendChild(buttonMinus);
        row.appendChild(buttonPlus);

        buttonPlus.addEventListener('click', () => {
           const characteristicName = row.children[0].innerText.split('(')[0].trim();
           if (characteristicName === 'Durée du Tour') {
                let upgradesDuration = parseInt(row.children[2].innerText);
                upgradesDuration--;
                row.children[2].innerText = upgradesDuration;
                updateDuration(row, upgradesDuration);
                costValue += price;
                row.children[3].innerText = costValue;
                improvements.innerText = parseInt(improvements.innerText) + 1; // Augmente Nb Améliorations
                row.children[2].innerText = parseInt(improvements.innerText) + 1
            } else if (characteristicName === 'Points de Vie Maximum') {
                currentValue += 10;
                costValue += price;
                row.children[1].innerText = currentValue;
                row.children[3].innerText = costValue;
                improvements.innerText = parseInt(improvements.innerText) + 1; // Modifier cette ligne
            } else {
                currentValue = updateValueFunc(currentValue, 1); // Augmenter la valeur
                costValue += price; // Mettre à jour le coût
                improvements.innerText = parseInt(improvements.innerText) + 1; // Mettre à jour Nb Améliorations
                row.children[1].innerText = currentValue; // Mettre à jour la colonne "Valeur Actuelle"
                row.children[3].innerText = costValue; // Mettre à jour la colonne "Coût Amélioration Suivante"
            }
    updateTotalCost();
    updateDisplayedValues();
    calculateLevel();
    adjustPricesBasedOnSpecialty(specialiteJoueur);
    getPriceForSpecialty(specialty, characteristic);
        });

        buttonMinus.addEventListener('click', () => {
          const characteristicName = row.children[0].innerText.split('(')[0].trim();
            if (characteristicName === 'Durée du Tour') {
                    let upgradesDuration = parseInt(row.children[2].innerText);
                    upgradesDuration++;
                    row.children[2].innerText = upgradesDuration;
                    updateDuration(row, upgradesDuration);
                    costValue -= price;
                    row.children[3].innerText = costValue;
                    improvements.innerText = parseInt(improvements.innerText) - 1; // Augmente Nb Améliorations
                    row.children[2].innerText = parseInt(improvements.innerText) - 1;
                } else if (characteristicName === 'Points de Vie Maximum') {
                    currentValue -= 10;
                    costValue -= price;
                    row.children[1].innerText = currentValue;
                    row.children[3].innerText = costValue;
                   improvements.innerText = parseInt(improvements.innerText) -1; // Modifier cette ligne
                } else {
                currentValue = updateValueFunc(currentValue, -1); // Augmenter la valeur
                costValue -= price; // Mettre à jour le coût
                improvements.innerText = parseInt(improvements.innerText) + -1; // Mettre à jour Nb Améliorations
                row.children[1].innerText = currentValue; // Mettre à jour la colonne "Valeur Actuelle"
                row.children[3].innerText = costValue; // Mettre à jour la colonne "Coût Amélioration Suivante"
            }
    updateTotalCost();
    updateDisplayedValues();
    calculateLevel();

        });

    }


    // Fonction pour mettre à jour la colonne Nb Améliorations
        function updateImprovements(row, change) {
            let currentImprovements = parseInt(row.children[2].innerText);
            currentImprovements += change;
            row.children[2].innerText = currentImprovements;
        }

    // Gestion durée du tour (marche mal)
    // Fonction pour mettre à jour la durée du tour en heures et minutes
        function updateDuration(row, upgrades) {
            let newDurationInMinutes = 30 - (upgrades * 3);
            let currentDurationText = row.children[1].innerText;
            let currentDurationParts = currentDurationText.split(' ');
            let currentHours = parseInt(currentDurationParts[0]);
            let currentMinutes = parseInt(currentDurationParts[3]);
            let currentDurationInMinutes = currentHours * 60 + currentMinutes;
            let updatedDuration = currentDurationInMinutes + newDurationInMinutes;
            let updatedHours = Math.floor(updatedDuration / 60);
            let remainingMinutes = updatedDuration % 60;

            row.children[1].innerText = updatedHours + ' heures et ' + remainingMinutes + ' minutes';
        }
    // Fonction pour mettre à jour une valeur en fonction de l'incrément/decrement
        function updateValue(value, change) {
            return value + change;
        }



    // Sélection des caractéristiques et initialisation des valeurs
        const characteristics = [
            document.querySelectorAll('tr.pair')[1], // Durée du tour
            document.querySelectorAll('tr.pair')[2], // PV max
            document.querySelectorAll('tr.pair')[3], // Perception
            document.querySelectorAll('tr.pair')[4], // Attaque
            document.querySelectorAll('tr.pair')[5], // Esquive
            document.querySelectorAll('tr.pair')[6], // Dégâts
            document.querySelectorAll('tr.pair')[7]  // Régénération

        ];


    // Ajout d'une Ligne Total
    // Sélection de la ligne "Dés de Régénération (+1D3)"
      const regenerationRow = document.querySelectorAll('tr.pair')[7]; // Modifier le sélecteur si nécessaire
    // Création de la ligne "Total"
      const totalRow = document.createElement('tr');
    // Colonne 1 (caractéristique)
      const totalCell1 = document.createElement('td');
    totalCell1.textContent = 'Total';

    totalRow.appendChild(totalCell1);
    // Colonne 2 (total des valeurs actuelles)
      const totalCell2 = document.createElement('td');
    totalRow.appendChild(totalCell2);
    // Colonne 3 (vide pour laisser la colonne Nb Améliorations)
      const totalCell3 = document.createElement('td');
    totalRow.appendChild(totalCell3);
    // Colonne 4 (total des coûts)
      const totalCostValue = Array.from(document.querySelectorAll('tr.pair td:nth-child(4)'))
        .slice(1) // Ignorer la première ligne (en-tête)
        .reduce((acc, cell) => acc + parseInt(cell.innerText), 0);
      const totalCell4 = document.createElement('td');
    totalCell4.textContent = totalCostValue;
    totalCell4.title = "total cumulatif des PI dépensés. Basé sur prix 16 sauf regen 30 et spécilité 12";
    totalRow.appendChild(totalCell4);
    // Insérer la ligne "Total" après la ligne "Dés de Régénération (+1D3)"
    regenerationRow.parentNode.insertBefore(totalRow, regenerationRow.nextSibling);



    //Gestion des Dons
    // Récupération des éléments pour chaque don
      const donsRows = [
        document.querySelector('tr.pair:nth-child(13)'),
        document.querySelector('tr.pair:nth-child(14)'),
        document.querySelector('tr.pair:nth-child(15)'),
        document.querySelector('tr.pair:nth-child(16)'),
        document.querySelector('tr.pair:nth-child(17)')
    ];
    // Tableau des coûts pour chaque don
      const donsCosts = [10, 20, 10, 10, 10];
    // Tableau des améliorations pour chaque don
      const donsImprovements = donsRows.map(row => row ? parseImprovements(row) - 1 : /* Valeur par défaut */ 0);
    // Tableau des coûts totaux pour chaque don
      const donsTotalCosts = donsCosts.map((cost, index) => {
        if (donsRows[index]) {
            return calculateTotalCost(cost, donsImprovements[index]);
        }
        // Si le don n'est pas trouvé, attribuer une valeur par défaut (par exemple, 0)
        return /* Valeur par défaut */ 100;
    });
    // Calcul du coût total de tous les dons
      const totalDonCostValue = donsTotalCosts.reduce((acc, curr) => acc + curr, 0);
        localStorage.setItem('totalDonCostValue', totalDonCostValue);
    // Création de la ligne "Total" pour les dons
      const totalDonRow = document.createElement('tr');
    totalDonRow.innerHTML = '<td>Total</td><td></td><td></td><td></td>';
      const totalDonCostCell = totalDonRow.querySelector('td:last-child');
    totalDonCostCell.textContent = totalDonCostValue;
    totalDonCostCell.title = "Il s'agit du total cumulatif dépensé, en tenant compte des dons qui n'apparaissent pas ici (ceux améliorés à fond)";
    // Insérer la ligne "Total" après la dernière ligne de dons
      const lastDonRow = document.querySelector('tr.pair:last-child');
    lastDonRow.parentNode.appendChild(totalDonRow);
    // Fonction pour extraire le coût d'un don à partir de sa ligne
    function parseDonCost(row) {
        if (row) {
            const costText = row.querySelector('td:nth-child(4)').innerText;
            return parseInt(costText);
        }
        return 0;
    }
    // Fonction pour extraire le nombre d'améliorations d'un don à partir de sa ligne
    function parseImprovements(row) {
        if (row) {
            const improvementsText = row.querySelector('td:nth-child(3)').innerText.split(' ')[0];
            return parseInt(improvementsText);
        }
        return 0;
    }
    // Fonction pour calculer le coût total d'un don en fonction de son coût de base et du nombre d'améliorations
    function calculateTotalCost(baseCost, improvements) {
        let totalCostDon = 0;
        for (let i = 1; i <= improvements; i++) {
            totalCostDon += baseCost * i;
        }
        return totalCostDon;
    }


    function getPriceForSpecialty(specialty, characteristic) {
        return specialtyPrices[specialty]?.[characteristic] || defaultPrices[characteristic];

    }

    function adjustPricesBasedOnSpecialty(specialty) {
        // Réinitialisation des prix par défaut
         defaultPrices = {
            'Durée du Tour': 16,
            'Points de Vie Maximum': 16,
            'Perception': 16,
            'Dés d\'Attaque': 16,
            'Dés d\'Esquive': 16,
            'Dés de Dégats': 16,
            'Dés de Régénération': 30
            // Ajoutez d'autres caractéristiques avec leurs prix correspondants
        };

        // Réinitialisation des prix spécifiques à la spécialité
          specialtyPrices = {
            'Points de Vie': { 'Points de Vie Maximum': 12 },
            'Perception': { 'Perception': 12 },
            'Attaque': { 'Dés d\'Attaque': 12 },
            'Esquive': { 'Dés d\'Esquive': 12 },
            'Dégats': { 'Dés de Dégats': 12 },
            'Régénération': { 'Dés de Régénération': 12 }
        };

        // Mettre à jour les prix en fonction de la nouvelle spécialité
        Object.keys(defaultPrices).forEach(key => {
            const price = getPriceForSpecialty(specialty, key);
            defaultPrices[key] = price;
            console.log('const price', price);
        });

        localStorage.setItem('specialiteJoueur', specialty);
        localStorage.setItem('prix par défaut', JSON.stringify(defaultPrices));
        localStorage.setItem('prix spécialité', JSON.stringify(specialtyPrices));

        console.log('prix spécialité', specialtyPrices);
        console.log('prix par défaut', defaultPrices);
        console.log('Spécialité enregistrée', specialty);

        updateTotalCost(); // Mettre à jour le coût total
        updateDisplayedValues(); // Mettre à jour les valeurs affichées
        calculateLevel(); // Mettre à jour le niveau

    }




        let specialiteJoueur = localStorage.getItem('specialiteJoueur');
        if (specialiteJoueur) {
            adjustPricesBasedOnSpecialty(specialiteJoueur);
              console.log('Spécialité enregistrée :', specialiteJoueur);
        } else {
              console.log('Aucune spécialité enregistrée.');
              alert('Sélectionnez une spécialité pour faire des projections sur votre gobelin!');

        }
              console.log('Spécialité enregistrée :', specialiteJoueur);
        const targetElement = document.querySelector('.gfmm > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)');
              console.log("Élément cible trouvé :", targetElement);

        const specialtySelect = document.createElement('select');
        specialtySelect.id = 'specialtySelect';
        specialtySelect.title = 'Bienvenue sur AnaGlobiliseur. Choisir votre spécialité pour calculer (a peu pres) les PI nécessaires et le niveau projeté en fonction des caractéristiques que vous voulez monter'

        const defaultOption = document.createElement('option');
        defaultOption.value = '';

        specialtySelect.appendChild(defaultOption);

        const specialties = ['Points de Vie', 'Attaque', 'Esquive', 'Dégats', 'Régénération', 'Perception'];
        specialties.forEach(specialty => {
            const option = document.createElement('option');
            option.value = specialty;
            option.textContent = specialty;
            specialtySelect.appendChild(option);
        });
    if (specialiteJoueur) {
        specialtySelect.value = specialiteJoueur;
    }
        specialtySelect.addEventListener('change', () => {
            specialiteJoueur = specialtySelect.value;
            adjustPricesBasedOnSpecialty(specialiteJoueur);
                localStorage.setItem('specialiteJoueur', specialiteJoueur); // Mise à jour dans le stockage local
                location.reload();
                location.reload();
        });

        targetElement.appendChild(specialtySelect);
        console.log("Liste déroulante insérée dans l'élément cible.");



    characteristics.forEach(row => {
        const currentValue = parseInt(row.children[1].innerText);
        const improvements = row.children[2];
        const costValue = parseInt(row.children[3].innerText);
        const characteristicName = row.children[0].innerText.match(/(.*) \(.*/)[1];
        const price = getPriceForSpecialty(localStorage.getItem('specialiteJoueur'), characteristicName);
        createButtons(row, currentValue, costValue, price, updateValue, improvements);
    });



    function updateTotalCost() {
        const specialiteJoueur = localStorage.getItem('specialiteJoueur'); // Récupérer la spécialité choisie depuis le localStorage
        const totalCost = characteristics.reduce((acc, row) => {
        const characteristicName = row.children[0].innerText.split('(')[0].trim(); // Récupération du nom sans les parenthèses
        const improvements = parseInt(row.children[2].innerText); // Nombre d'améliorations
        const price = getPriceForSpecialty(specialiteJoueur, characteristicName); // Utilisation de la fonction pour récupérer le prix

            let cumulativeCost = 0;
            for (let i = 1; i <= improvements; i++) {
                cumulativeCost += price * i;
            }


            // Affichage du détail pour chaque ligne dans la console
            console.log(`Ligne: ${characteristicName} - Prix unitaire: ${price} - Améliorations: ${improvements} - Coût total: ${cumulativeCost}`);

            return acc + cumulativeCost;
        }, 0);

            console.log('Total:', totalCost); // Affichage du total dans la console

        // Enregistrement du total dans le localStorage
            localStorage.setItem('totalCost', totalCost);

        // Mise à jour de l'affichage du total dans l'interface HTML
        const totalCell = document.querySelector('.gfmm > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(11) > td:nth-child(4)');
        totalCell.textContent = totalCost;
    }




    /// Pour calculer le niveau en fonction du total de PI
      function calculateLevel() {
        const nbPIActuels = window.localStorage.getItem('nbPIActuelsValue');
        const levels = [

        { requiredPI: 0, level: 1 },
        { requiredPI: 10, level: 2 },
        { requiredPI: 30, level: 3 },
        { requiredPI: 60, level: 4 },
        { requiredPI: 100, level: 5 },
        { requiredPI: 150, level: 6 },
        { requiredPI: 210, level: 7 },
        { requiredPI: 280, level: 8 },
        { requiredPI: 360, level: 9 },
        { requiredPI: 450, level: 10 },
        { requiredPI: 550, level: 11 },
        { requiredPI: 660, level: 12 },
        { requiredPI: 780, level: 13 },
        { requiredPI: 910, level: 14 },
        { requiredPI: 1050, level: 15 },
        { requiredPI: 1200, level: 16 },
        { requiredPI: 1360, level: 17 },
        { requiredPI: 1530, level: 18 },
        { requiredPI: 1710, level: 19 },
        { requiredPI: 1900, level: 20 },
        { requiredPI: 2100, level: 21 },
        { requiredPI: 2310, level: 22 },
        { requiredPI: 2530, level: 23 },
        { requiredPI: 2760, level: 24 },
        { requiredPI: 3000, level: 25 },
        { requiredPI: 3250, level: 26 },
        { requiredPI: 3510, level: 27 },
        { requiredPI: 3780, level: 28 },
        { requiredPI: 4060, level: 29 },
        { requiredPI: 4350, level: 30 },
        { requiredPI: 4650, level: 31 },
        { requiredPI: 4960, level: 32 },
        { requiredPI: 5280, level: 33 },
        { requiredPI: 5610, level: 34 },
        { requiredPI: 5950, level: 35 },
        { requiredPI: 6300, level: 36 },
        { requiredPI: 6660, level: 37 },
        { requiredPI: 7030, level: 38 },
        { requiredPI: 7410, level: 39 },
        { requiredPI: 7800, level: 40 },
        { requiredPI: 8200, level: 41 },
        { requiredPI: 8610, level: 42 },
        { requiredPI: 9030, level: 43 },
        { requiredPI: 9460, level: 44 },
        { requiredPI: 9900, level: 45 },
        { requiredPI: 10350, level: 46 },
        { requiredPI: 10810, level: 47 },
        { requiredPI: 11280, level: 48 },
        { requiredPI: 11760, level: 49 },
        { requiredPI: 12250, level: 50 },
        { requiredPI: 12750, level: 51 },
        { requiredPI: 13260, level: 52 },
        { requiredPI: 13780, level: 53 },
        { requiredPI: 14310, level: 54 },
        { requiredPI: 14850, level: 55 },
        { requiredPI: 15400, level: 56 },
        { requiredPI: 15960, level: 57 },
        { requiredPI: 16530, level: 58 },
        { requiredPI: 17110, level: 59 },
        { requiredPI: 17700, level: 60 },
        { requiredPI: 18300, level: 61 },
        { requiredPI: 18910, level: 62 },
        { requiredPI: 19530, level: 63 },
        { requiredPI: 20170, level: 64 },
        { requiredPI: 20820, level: 65 },
        { requiredPI: 21480, level: 66 },
        { requiredPI: 22150, level: 67 },
        { requiredPI: 22830, level: 68 },
        { requiredPI: 23520, level: 69 },
        { requiredPI: 24220, level: 70 },
        { requiredPI: 24930, level: 71 },
        { requiredPI: 25650, level: 72 },
        { requiredPI: 26380, level: 73 },
        { requiredPI: 27120, level: 74 },
        { requiredPI: 27870, level: 75 },
        { requiredPI: 28630, level: 76 },
        { requiredPI: 29400, level: 77 },
        { requiredPI: 30180, level: 78 },
        { requiredPI: 30970, level: 79 },
        { requiredPI: 31770, level: 80 },
        { requiredPI: 32580, level: 81 },
        { requiredPI: 33400, level: 82 },
        { requiredPI: 34230, level: 83 },
        { requiredPI: 35070, level: 84 },
        { requiredPI: 35920, level: 85 },
        { requiredPI: 36780, level: 86 },
        { requiredPI: 37650, level: 87 },
        { requiredPI: 38530, level: 88 },
        { requiredPI: 39420, level: 89 },
        { requiredPI: 40320, level: 90 },
        { requiredPI: 41230, level: 91 },
        { requiredPI: 42150, level: 92 },
        { requiredPI: 43080, level: 93 },
        { requiredPI: 44020, level: 94 },
        { requiredPI: 44970, level: 95 },
        { requiredPI: 45930, level: 96 },
        { requiredPI: 46900, level: 97 },
        { requiredPI: 47880, level: 98 },
        { requiredPI: 48870, level: 99 },
        { requiredPI: 49870, level: 100 }
    ];

        let currentLevel = 1;
        for (const { requiredPI, level } of levels) {
            if (nbPIActuels >= requiredPI) {
                currentLevel = level;
            } else {
                break;
            }
        }
          console.log('niveau', currentLevel);
        return currentLevel;

    }


        const PX = window.localStorage.getItem('PX');
        const PXPerso = window.localStorage.getItem('PXPerso');
        const PI = window.localStorage.getItem('PI');
          console.log('PX', PX);
        const totalCost = window.localStorage.getItem('totalCost');
        const nbPIActuels = window.localStorage.getItem('nbPIActuels');
        const PIapprentissagesText = `PI investis dans les apprentissages :`;
        const PIapprentissagesValue =   nbPIActuels - totalDonCostValue - totalCost  - PI - PXPerso;
          localStorage.setItem('PIapprentissagesText', PIapprentissagesText);
          localStorage.setItem('PIapprentissagesValue', PIapprentissagesValue);

      function updateDisplayedValues() {
    // Récupérer les valeurs du local storage
        const niveau = window.localStorage.getItem('niveau');
        const PX = window.localStorage.getItem('PX');
        const PXperso = window.localStorage.getItem('PXperso');
        const PI = window.localStorage.getItem('PI');
        const totalCost = window.localStorage.getItem('totalCost');
        const PIapprentissagesText = window.localStorage.getItem('PIapprentissagesText');
        const PIapprentissagesValue = window.localStorage.getItem('PIapprentissagesValue');

    // Trouver l'élément contenant le texte "Vous pouvez vous améliorer à concurrence de ...."
        const targetElement = document.querySelector('tr.pair:nth-child(1) > td:nth-child(1)');
    // Créer des éléments pour afficher les valeurs mises à jour
        const niveauText = `Niveau actuel : ${niveau}`;
        const nbPIActuelsText = `Total PI simulés :`;
        const nbActualText = `Vous avez actuellement :`;
        const nbPIActuels =  window.localStorage.getItem('nbPIActuels');
        const nbPIActuelsValue = Math.floor(+totalCost + +totalDonCostValue  + +PIapprentissagesValue +  +PI);
         localStorage.setItem('nbPIActuelsValue', nbPIActuelsValue);
    // Calculer le niveau en fonction de nbPIActuels
        const currentLevel = calculateLevel(parseInt(nbPIActuelsValue));
        const currentLevelText = `Niveau atteint : ${currentLevel}`;
        const PICompText = 'PI investis dans les caractéristiques : '
        const PICompValue = totalCost;


    // Pour calculer le nombre de PX par jour depuis la création
        const diffpx = nbPIActuelsValue - nbPIActuels;
          console.log(diffpx);
        let dateCreationGobelin = localStorage.getItem('DateCrea');
        let dateCrea = new Date(dateCreationGobelin);
        let dateActuelle = new Date();
        let differenceEnMs = dateActuelle - dateCrea;
        let differenceEnJours = Math.floor(differenceEnMs / (1000 * 60 * 60 * 24));
       if (!localStorage.getItem('xpParJourfiged')) {
        // Calcul de xpParJourfiged
        const xpParJour = nbPIActuelsValue !== 0 ? nbPIActuelsValue / differenceEnJours : 0;
        const xpParJourArrondi = xpParJour.toFixed(2);
          localStorage.setItem('xpParJourfiged', xpParJourArrondi);
    }


        const xpParJourfiged = localStorage.getItem('xpParJourfiged');
        const nbdejourneeded = diffpx/xpParJourfiged;
        const nbdejourneededArrondi = nbdejourneeded.toFixed(2);
        const daytoyear = nbdejourneededArrondi/365;
        const daytoyearround = daytoyear.toFixed(1);

        const newContent = `
      <div>${nbActualText + "<strong>" + nbPIActuels + " PI" + "</strong>"}</div>
      <div>${PIapprentissagesText + "<strong>" + +PIapprentissagesValue + "</strong>"}</div>
      <div>${PICompText + "<strong>" + PICompValue + "</strong>"}</div>
      <div>${niveauText}</div>
      <div>${nbPIActuelsText + "<strong>" + nbPIActuelsValue + "</strong>"}</div>
      <div>${currentLevelText}</div>
      <div>${"<strong>" + differenceEnJours  + "</strong>" + " jours sont passés depuis votre naissance, vous avez gagné " + "<strong>" + xpParJourfiged + " px/jour" + "</strong>"}</div>
      <div>${"Pour atteindre les valeurs simulées au rythme actuel il vous faudra " + "<strong>" + nbdejourneededArrondi + " jours" + "</strong>" + " (" + "<strong>" + daytoyearround + " années" + "</strong>" + ")"}</div>
    `;


    // Création d'un nouvel élément div pour contenir le nouveau contenu
    const newElement = document.createElement('div');
    newElement.innerHTML = newContent;
    // Remplacement du contenu existant par le contenu nouvellement créé
    targetElement.innerHTML = ''; // Vide d'abord le contenu existant
    targetElement.appendChild(newElement);
    }

    updateDisplayedValues();
    calculateLevel();
    }



    //==============================================================================
    /// calculateur des DLA (page mon profil et menu.php)
    //==============================================================================

    /// récup des variable dans mon profil
    if (window.location.href === 'http://games.gobland.fr/ProfilPerso.php') {

      // Fonction pour actualiser les variables et rafraîchir la page



      // Récupération de l'élément contenant les dates
        const dateContainer = document.querySelector('#content div#identite table.gf tbody tr:nth-child(2) td:nth-child(2)');

        // Vérification si l'élément est récupéré
        if (dateContainer) {
            // Récupération de tous les éléments <span> dans dateContainer
            const spans = dateContainer.querySelectorAll('span.dla');

            // Vérification si les éléments <span> sont trouvés
            if (spans.length >= 3) {
                 const DLA1 = spans[0].nextSibling.textContent.trim();
                 const DLA2 = spans[1].nextSibling.textContent.trim();
                 const DLA3 = spans[2].nextSibling.textContent.trim();


                // Stockage dans le local storage
                localStorage.setItem('DLA1', DLA1);
                localStorage.setItem('DLA2', DLA2);
                localStorage.setItem('DLA3', DLA3);

                } else {
                console.error('Erreur récup DLAs . Pas assez de balises <span> trouvées.');
            }




                // Recherche de l'élément XPath spécifique
                const xpath = '/html/body/div[3]/div/table/tbody/tr[2]/td[2]/table/tbody/tr[2]/td/br[3]';
                const xpathResult = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);

                // Récupération du nœud correspondant à l'élément XPath
                const node = xpathResult.iterateNext();

                if (node) {
                    // Récupération du texte suivant l'élément XPath
                    const valeurPAText = node.nextSibling.textContent;

                    // Expression régulière pour extraire le nombre
                    const regex = /(\d+)/;
                    const match = valeurPAText.match(regex);

                    if (match && match[1]) {
                        valeurPA = parseInt(match[1], 10);
                        console.log('Valeur de PA:', valeurPA);
                        localStorage.setItem('valeurPA', valeurPA);
                    } else {
                        console.error('Aucune correspondance trouvée pour la valeur de PA.');
                    }
                } else {
                    console.error('Élément XPath pour la valeur de PA non trouvé.');
                }
              }
           else {
            console.error('Conteneur de dates non trouvé.');
        }



                    // Récupération de l'heure actuelle de Paris
            const now = new Date();
              console.log('now', now);

            const options = { timeZone: 'Europe/Paris', hour24: false };
            const currentDateTime = now.toLocaleString('fr-FR', options);

            // Conversion des dates en objets Date
            const DLA1 = localStorage.getItem('DLA1');
            const DLA2 = localStorage.getItem('DLA2');
            const DLA3 = localStorage.getItem('DLA3');
            const dateDLA1 = new Date(DLA1);
            const dateDLA2 = new Date(DLA2);
            const dateDLA3 = new Date(DLA3);
              localStorage.setItem('dateDLA1', dateDLA1);
              localStorage.setItem('dateDLA2', dateDLA2);
              localStorage.setItem('dateDLA3', dateDLA3);
              console.log('Date pour DLA1:', dateDLA1);
              console.log('Date pour DLA2:', dateDLA2);
              console.log('Date pour DLA3:', dateDLA3);

            // Calcul de la différence en millisecondes
            const diffDLA1 = dateDLA1 - now;
            const diffDLA2 = dateDLA2 - now;
            const diffDLA3 = dateDLA3 - now;
              localStorage.setItem('diffDLA1', diffDLA1);
              localStorage.setItem('diffDLA2', diffDLA2);
              localStorage.setItem('diffDLA3', diffDLA3);

    // Calcul de la différence en minutes
            const diffMinutesDLA1 = Math.round(Math.abs(diffDLA1 / (1000 * 60)));
            const diffMinutesDLA2 = Math.round(Math.abs(diffDLA2 / (1000 * 60)));
            const diffMinutesDLA3 = Math.round(Math.abs(diffDLA3 / (1000 * 60)));
              localStorage.setItem('diffMinutesDLA1', diffMinutesDLA1);
              localStorage.setItem('diffMinutesDLA2', diffMinutesDLA2);
              localStorage.setItem('diffMinutesDLA3', diffMinutesDLA3);
              console.log('Différence DLA1 en minutes:', diffMinutesDLA1, 'minutes');
              console.log('Différence DLA2 en minutes:', diffMinutesDLA2, 'minutes');
              console.log('Différence DLA3 en minutes:', diffMinutesDLA3, 'minutes');


    // Enregistrement de l'heure de réactualisation des variables dans le localStorage
            const lastRefreshTime = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
              localStorage.setItem('lastRefreshTime', lastRefreshTime);

    }





    /// affichage des variables dans le menu left (j'ai galéré on doit pvr faire mieux^^)
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Menu\.php/i)) {

    // Récupération de l'élément ciblé
            const DLA1 = localStorage.getItem('DLA1');
            const DLA2 = localStorage.getItem('DLA2');
            const DLA3 = localStorage.getItem('DLA3');
            const diffMinutesDLA1 = localStorage.getItem('diffMinutesDLA1');
            const diffMinutesDLA2 = localStorage.getItem('diffMinutesDLA2');
            const diffMinutesDLA3 = localStorage.getItem('diffMinutesDLA3');
            const dateDLA1 = new Date(localStorage.getItem('dateDLA1'));
            const dateDLA2 = new Date(localStorage.getItem('dateDLA2'));
            const dateDLA3 = new Date(localStorage.getItem('dateDLA3'));
            const valeurPA = localStorage.getItem('valeurPA');
            const now = new Date();
            const targetElement = document.getElementById('dim');
            let textToInsert = '';





    // Obtenez le jour de la semaine (0 pour dimanche, 1 pour lundi, ... , 6 pour samedi)
      const dayOfWeek = now.getDay();

    // Vérifiez si c'est le week-end (samedi ou dimanche)
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Conditions pour déterminer le texte à insérer
      //speedXekk end
    if (isWeekend) {
        if (now > dateDLA3) {
            textToInsert = `<span style="color: red" title="Décalez de ${diffMinutesDLA3} minutes pour ne pas perdre votre trimul">Trimul dépassé!</span>`;
        } else if (now > dateDLA2) {
            textToInsert = `<span style="color: blue" title="Trimul dans ${diffMinutesDLA3} minutes">Cumul jouable</span>`;
        } else if (now > dateDLA1) {
            if (valeurPA === '0') {
                textToInsert = `<span style="color: green" title="Vous pouvez activer. Cumul dans ${diffMinutesDLA2} minutes">DLA dépassée</span>`;
            } else {
                textToInsert = `<span style="color: red"  title="Décalez de ${diffMinutesDLA1} minutes pour ne pas perdre vos ${valeurPA} PA">DLA dépassée</span>`;
            }
        } else if (now < dateDLA1) {
            textToInsert = `<span style="color: green" title="Il vous reste ${valeurPA} PA">DLA dans ${diffMinutesDLA1} minutes</span>`;
        }
    }

      //pas speed week end
      if (!isWeekend) {
        if (now > dateDLA3) {
            textToInsert = `<span style="color: red" title="Décalez de ${diffMinutesDLA3} minutes pour ne pas perdre de DLA">DLA dépassée</span>`;
        } else if (now > dateDLA2) {
            textToInsert = `<span style="color: red" title="Décalez de ${diffMinutesDLA2} minutes pour jouer un cumul">DLA dépassée</span>`;
        } else if (now > dateDLA1) {
            if (valeurPA === '0') {
                textToInsert = `<span style="color: green" title="Vous pouvez activer. Cumul dans ${diffMinutesDLA2} minutes">DLA dépassée</span>`;
            } else {
                textToInsert = `<span style="color: red" title="Décalez de ${diffMinutesDLA1} minutes pour ne pas perdre vos ${valeurPA} PA">DLA dépassée</span>`;
            }
        } else if (now < dateDLA1) {
            textToInsert = `<span style="color: green" title="Il vous reste ${valeurPA} PA">DLA dans ${diffMinutesDLA1} minutes</span>`;
        }
    }

    targetElement.insertAdjacentHTML('afterend', `<br>${textToInsert}`);


    // Ajout du texte sur la date du dernier resfresh
    // Récupération de l'élément ciblé
      const targetElement2 = document.querySelector('.dla > span:nth-child(7)');

    if (targetElement) {
        const lastRefreshTime = localStorage.getItem('lastRefreshTime');

        if (lastRefreshTime) {
            const smallText = document.createElement('small');
            smallText.textContent = `(${lastRefreshTime})`;
            smallText.style.fontSize = 'smaller'; // Réduit la taille de la police
            smallText.title = 'Date du dernier refresh. Pour rafraichir le calcul, allez sur votre page profil et actualisez la page'
            targetElement2.appendChild(document.createElement('br')); // Saut de ligne
            targetElement2.appendChild(smallText); // Ajout du texte entre parenthèses après le 7e span
        }
    }

    }



    //==========================================================================================================================================================================================================================
    ///affichage de l'icone Gobzilla avec version au survol dans le menu left
    //==========================================================================================================================================================================================================================
    (function() {
        'use strict';


        var iconUrl = 'https://i.ibb.co/s1MG4Dt/g-OBZILLAICON-removebg.png';
        var scriptVersion = GM_info.script.version;
        // URL de redirection au clic sur l'icône
        var redirectionUrl = 'http://games.gobland.fr/goodies.php';


        var icon = document.createElement('img');
        icon.src = iconUrl;
        icon.style.position = 'absolute';
        icon.style.top = '-145px'; //
        icon.style.left = '80px';
        icon.style.zIndex = '9999';
        icon.style.width = '80px';
        icon.style.height = '50px';
        icon.style.opacity = '0.7';
        icon.title = 'Version du script: ' + scriptVersion;


     // Ajout du gestionnaire d'événements pour le clic sur l'icône
        icon.addEventListener('click', function() {
            window.open(redirectionUrl, '_blank', 'width=500,height=500'); // Ouvre l'URL dans une nouvelle fenêtre flottante
        });

        // Sélectionnez l'endroit où vous souhaitez ajouter l'icône
        var targetElement = document.querySelector('.presentation'); // Remplacez par la classe ou l'ID de l'élément où vous voulez ajouter l'icône

        // Ajoutez l'icône à l'emplacement sélectionné
        if (targetElement) {
            targetElement.appendChild(icon);
        }
    })();

    //==========================================================================================================================================================================================================================
    // Page suivants - Ajout de la vue sur la page "ordre", ajout de boutons de racourcis vers des ordres et mise en couleur de la position sur le profil
    //==========================================================================================================================================================================================================================

    // Vérification si la variable a déjà été définie
    if (!window.localStorage.getItem('followersnumbers')) {
        // Sélection de l'élément contenant les informations des Suivants
        let followersTable = document.querySelector('td[style="text-align:left;vertical-align:top;"] table');

        // Vérification si l'élément existe
        if (followersTable) {
            let followersnumbers = []; // Tableau pour stocker les numéros
            let followersnames = []; // Tableau pour stocker les textes restants

            // Récupération de tous les éléments <a> dans la table
            let followerLinks = followersTable.querySelectorAll('a');

            // Parcours des liens pour extraire les informations
            followerLinks.forEach(link => {
                let text = link.textContent; // Récupération du texte du lien

                // Vérification du motif "[numéro] texte restant"
                let regex = /\[(\d+)\]\s(.+)/;
                let match = text.match(regex);

                if (match) {
                    let numero = match[1]; // Numéro entre crochet
                    let resteTexte = match[2]; // Texte restant

                    // Stockage dans les tableaux
                    followersnumbers.push(numero);
                    followersnames.push(resteTexte);
                }
            });

            // Enregistrement dans le stockage local
            localStorage.setItem('followersnumbers', JSON.stringify(followersnumbers));
            localStorage.setItem('followersnames', JSON.stringify(followersnames));
        }
    }




    //mise en couleur de la position de la CM dans Profil
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Follower\.php\?IdFO=\d+/i)) {
        (function() {
            // Sélectionne tous les éléments 'td' contenant le texte des positions
            const positionElements = document.querySelectorAll('td[style="text-align:left;"]');

            // Parcours des éléments pour trouver celui contenant les informations de position
            positionElements.forEach((element) => {
                const text = element.textContent.trim();
                if (text.startsWith('X =') && text.includes('Y =') && text.includes('N =')) {
                    const positionInfo = text.match(/X = (-?\d+) \| Y = (-?\d+) \| N = (-?\d+)/);
                    if (positionInfo && positionInfo.length === 4) {
                        const posX = positionInfo[1];
                        const posY = positionInfo[2];
                        const posN = positionInfo[3];

                        // Créer des éléments <strong> pour mettre en gras le texte et le colorer en rouge
                        const posXElement = document.createElement('strong');
                        posXElement.textContent = `X = ${posX}`;
                        posXElement.style.color = 'red'; // Changer la couleur en rouge

                        const posYElement = document.createElement('strong');
                        posYElement.textContent = `Y = ${posY}`;
                        posYElement.style.color = 'red'; // Changer la couleur en rouge

                        const posNElement = document.createElement('strong');
                        posNElement.textContent = `N = ${posN} `;
                        posNElement.style.color = 'red'; // Changer la couleur en rouge

                        // Créer un élément pour le reste du texte
                        const restOfText = document.createElement('span');
                        restOfText.textContent = text.slice(text.indexOf('Perception'));

                        // Remplacer le contenu de l'élément avec les éléments <strong> colorés et le reste du texte
                        element.innerHTML = '';
                        element.appendChild(posXElement);
                        element.appendChild(document.createTextNode(' | '));
                        element.appendChild(posYElement);
                        element.appendChild(document.createTextNode(' | '));
                        element.appendChild(posNElement);
                        element.appendChild(document.createElement('br'));
                        element.appendChild(restOfText);
                    }
                }
            });
        })();
    }


    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/fo_equipement\.php\?IdFO=\d+/i)) {
    // Sélection de l'élément spécifié dans la page
    var elements = document.querySelectorAll('html body div#content div#identite table.gf tbody tr td.gfmm table tbody tr td.left table tbody tr.pair td');

    // Vérification si des éléments sont trouvés
    if (elements.length > 0) {
        // Création d'un tableau pour stocker les contenus des éléments
        var contents = [];

        // Boucle à travers les éléments trouvés pour récupérer leur contenu
        elements.forEach(function(element) {
            var content = element.textContent.trim();
            contents.push(content);
        });

        // Stockage des contenus dans le stockage local
        localStorage.setItem('contenus_elements', JSON.stringify(contents));

        // Affichage des contenus dans la console (pour vérification)
        console.log('Contenus des éléments :', contents);
    } else {
        console.log('Aucun élément correspondant trouvé.');
    }
    }



    // ajout de la vue (trèsors) direct dans la page Ordre, si on clique sur une ID ça ajoute l'odre, ya aussi des boutons de raccourcis
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/fo_orders\.php\?IdFO=\d+/i)) {
    window.addEventListener('load', function() {

    // Récupération des données de trésors depuis localStorage
    const tresorsData = localStorage.getItem('tresorsData');

    if (!tresorsData) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Aucune donnée, allez sur votre page de vue avant';
        errorMessage.style.color = 'red'; // Style facultatif pour le texte

        // Insérer le message d'erreur dans le corps de la page ou un élément spécifique
        document.body.appendChild(errorMessage);
    } else {
        const tresors = JSON.parse(tresorsData);

        // Création d'un élément de tableau
        const nouveauTableau = document.createElement('table');
        nouveauTableau.style.border = '1px solid black'; // Style du tableau

        // Création de l'en-tête du tableau
        const enTete = nouveauTableau.createTHead();
        const enTeteLigne = enTete.insertRow();
        ['Distance', 'Réf.', 'Nom', 'X', 'Y', 'N'].forEach((enteteColonne) => {
            const cellule = enTeteLigne.insertCell();
            cellule.textContent = enteteColonne;
            cellule.style.fontWeight = 'bold'; // Style pour l'en-tête
            cellule.style.border = '1px solid black'; // Style des cellules
        });

        // Ajout des données de trésors dans le tableau
        const corps = nouveauTableau.createTBody();
        tresors.forEach((tresor) => {
            const ligne = corps.insertRow();
            ['distance', 'reference', 'nom', 'x', 'y', 'n'].forEach((colonne, index) => {
                const cellule = ligne.insertCell();



                cellule.textContent = tresor[colonne];
                cellule.style.border = '1px solid black'; // Style des cellules
            });
        });

        // Trouver l'élément spécifique où insérer le tableau des trésors
        const elementSpecifique = document.evaluate('/html/body/div[3]/div/table/tbody/tr[2]/td[2]/form/table/tbody/tr[6]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (elementSpecifique) {
            // Insérer le tableau des trésors après l'élément spécifique
            elementSpecifique.insertAdjacentElement('afterend', nouveauTableau);
            console.log('Tableau inséré avec succès');
        } else {
            console.log('Élément spécifique non trouvé');
        }
    }

    });





window.addEventListener('load', function() {
    const tresorsData = localStorage.getItem('tresorsData');

    if (tresorsData) {
        const tresors = JSON.parse(tresorsData);
        const selectedNumbers = [];
        const positions = [];
        let moveCommand = '';
        let pickCommand = '';

        // Créer un élément pour le message contextuel
        const tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#f7f12e';
        tooltip.style.border = '1px solid #d3d3d3';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
        tooltip.style.display = 'none'; // Masquer par défaut
        tooltip.textContent = 'Ordre ajouté';
        document.body.appendChild(tooltip);

        // Créer un tableau pour suivre les cellules cliquées
        const clickedRefCells = new Set(); // Pour les cellules de la colonne Réf.
        const clickedPosCells = new Set(); // Pour les cellules de position

        // Gérer les cellules de la colonne "Réf."
        const references = [];
        const xpathRef = '/html/body/div[3]/div/table/tbody/tr[2]/td[2]/form/table/tbody/table/tbody/tr/td[2]';
        const refElements = document.evaluate(xpathRef, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < refElements.snapshotLength; i++) {
            references.push(refElements.snapshotItem(i));
        }

        references.forEach((reference) => {
            reference.style.cursor = 'crosshair';
            reference.title = 'Cliquez pour ramasser';
            reference.addEventListener('click', function(event) {
                event.preventDefault(); // Empêche les actions par défaut





                // Appliquer le style à la cellule cliquée
                this.style.border = '4px solid red'; // Bordure pour la cellule cliquée

                const referenceText = this.textContent.trim();
                const referenceValue = parseInt(referenceText);

                if (!isNaN(referenceValue)) {
                    selectedNumbers.push(referenceValue);

                    if (selectedNumbers.length === 1) {
                        pickCommand = `pick(OBJECT, ${selectedNumbers[0]});`;
                    } else {
                        const formattedNumbers = selectedNumbers.join(', ');
                        pickCommand = `foreach(objects() as o):if(in(id(o), array(${formattedNumbers}))):pick(OBJECT, id(o));endif;endforeach;`;
                    }

                    updateTextarea();
                }

                // Afficher le message contextuel à côté du curseur
                tooltip.style.left = `${event.pageX + 10}px`; // Position horizontale
                tooltip.style.top = `${event.pageY + 10}px`; // Position verticale
                tooltip.style.display = 'block'; // Afficher le message
            });
        });

        // Gérer les cellules de position (X, Y, N)
        const positionCells = [];
        const xpathPos = '/html/body/div[3]/div/table/tbody/tr[2]/td[2]/form/table/tbody/table/tbody/tr/td[position() >= 4]';
        const posElements = document.evaluate(xpathPos, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < posElements.snapshotLength; i++) {
            positionCells.push(posElements.snapshotItem(i));
        }

        positionCells.forEach((positionCell) => {
            positionCell.style.cursor = 'crosshair';
            positionCell.title = 'Cliquez pour se déplacer à cet endroit';
            positionCell.addEventListener('click', function(event) {
                event.preventDefault(); // Empêche les actions par défaut

                // Appliquer le style à la cellule cliquée
                if (!clickedPosCells.has(this)) {
                    this.style.backgroundColor = '#d3d3d3'; // Couleur de fond pour la cellule cliquée
                    clickedPosCells.add(this); // Ajouter à l'ensemble des cellules cliquées
                }

                let position = '';
                const positionCells = this.parentElement.querySelectorAll("td:nth-child(n+4)");
                positionCells.forEach((cell, index) => {
                    position += cell.textContent.trim();
                    if (index !== positionCells.length - 1) {
                        position += ', ';
                    }
                });

                moveCommand = `move(${position});`;

                updateTextarea();

                // Afficher le message contextuel à côté du curseur
                tooltip.style.left = `${event.pageX + 10}px`; // Position horizontale
                tooltip.style.top = `${event.pageY + 10}px`; // Position verticale
                tooltip.style.display = 'block'; // Afficher le message
            });
        });

        // Fonction pour réinitialiser le style des cellules
        function resetCellStyles() {
            // Réinitialiser le style des cellules de position uniquement
            positionCells.forEach(cell => {
                if (!clickedPosCells.has(cell)) {
                    cell.style.backgroundColor = ''; // Réinitialiser la couleur de fond des cellules de position
                }
            });

            // Réinitialiser le style des cellules de référence uniquement
            references.forEach(cell => {
                if (!clickedRefCells.has(cell)) {
                    cell.style.border = ''; // Réinitialiser la bordure des cellules de référence
                }
            });
        }

        // Fonction pour mettre à jour le contenu du textarea
        function updateTextarea() {
            const textarea = document.querySelector("textarea[name='sc']");
            let output = '';

            if (moveCommand) {
                output += `${moveCommand}\n`;
            }

            if (pickCommand) {
                output += `${pickCommand}\n`;
            }

            textarea.value = output;
        }

        // Cacher le message contextuel lorsque la souris se déplace
        document.addEventListener('mousemove', function() {
            tooltip.style.display = 'none'; // Cacher le message lorsqu'on se déplace
        });

    } else {
        console.log('Aucune donnée de trésors trouvée dans localStorage');
    }










        // Fonction pour générer le texte à insérer dans le textarea en fonction du bouton cliqué
        function generateText(action) {
            let output = '';
            switch (action) {
                 case 'move':
                    output = 'move();';
                    break;
                case 'toutramasser':
                    output = 'foreach(objects() as o):pick(OBJECT, id(o));endforeach;';
                    break;
                case 'toutdeposerausol':
                    output = 'drop(OBJECT, ALL, GROUND, GROUND);';
                    break;
                case 'toutdeposerauchateau':
                    output = 'drop(OBJECT, ALL, PLACE, 45337);';
                    break;
                case 'toutdeposeraumanoir':
                    output = 'drop(OBJECT, ALL, PLACE, 46494);';
                    break;
                 case 'toutramassersaufcorps':
                    output = 'foreach(objects() as o):if(bnot(eq(category(o), "Corps"))):pick(OBJECT, id(o));endif;endforeach;';
                    break;
                 case 'entrainer':
                    output = 'train();';
                    break;
                case 'dépot1objetcase':
                    output = 'drop(OBJECT, ID  de l objet, GROUND, GROUND);';
                    break;
                case 'dépot1objetchateau':
                    output = 'drop(OBJECT, ID de l objet, PLACE, 45337);';
                    break;
                case 'dépot1objetmanoir':
                    output = 'drop(OBJECT, ID de l objet, PLACE, 46494);';
                    break;
                case 'ramasserplantes':
                    output = 'foreach(plants() as o):pick(PLANT, id(o));endforeach;';
                    break;
                case 'ramasserct':
                    output = "foreach(objects() as o): if(eq(name(o), 'CT')): pick(OBJECT, id(o)); endif; endforeach;"
                    break;
                 case 'attackmonster':
                    output = "attack(MONSTER, Id);"
                    break;
                case 'attackall':
                    output = "foreach(monsters() as o):attack(MONSTER, id(o));endforeach;"
                    break;
                case 'equip':
                    output = "equip(Id);"
                    break;
                case 'unequip':
                    output = "unequip(Id);"
                    break;
                case 'scout':
                    output = "scout();"
                    break;
                case 'passtp':
                    output = "enter(PLACE|PORTAL, Id);"
                    break;
                // Ajoutez des cases pour d'autres actions ou boutons
                default:
                    break;
            }
            return output;
        }

      // recup du num de goblin pour l'ordre follow
    function generateFollowOrder(distance) {
        const gobId = localStorage.getItem('gobId'); // Récupérer l'ID depuis le local storage

        if (!gobId) {
            return "Je n'ai pas votre numéro, visitez votre page profil et revenez ici !"; // Retourner le message si gobId est null
        }

        const followOrder = `follow(PLAYER, ${gobId}, ${distance});`;
        return followOrder;
    }
      // Création de la liste déroulante pour choisir la distance pour l'ordre follow
    const followDistanceSelect = document.createElement('select');
  followDistanceSelect.style.backgroundColor= '#64b3e4';
    [0, 1, 2, 3, 4, 5].forEach((value) => {
        const option = document.createElement('option');
        option.value = value;

        option.textContent = value + ' cases'; // Ajout de " cases" après chaque nombre
        followDistanceSelect.appendChild(option);
    });



      // Sélection du textarea
        const textarea = document.querySelector("textarea[name='sc']");

      // Fonction pour insérer du texte dans le textarea
    function insertText(text) {
        textarea.value += text + '\n'; // Ajout du nouveau texte à la suite du texte existant
    }


      // Création du  bouton 0  "Move"
    const button0 = document.createElement('button');
    button0.textContent = 'Se déplacer';
    button0.style.backgroundColor= '#a8eff1'; // Définir la couleur de fond
    button0.title = 'cliquer sur une position dans le tableau en dessous pour faire déplacer votre suivant à cet endroit, ou cliquez ici et ajoutez manuellement vos coordonées';
    button0.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('move');
        insertText(output);
    });


      // Création du premier bouton "Tout ramasser"
    const button1 = document.createElement('button');
    button1.textContent = 'Tout ramasser';
    button1.style.backgroundColor= '#e4ed97'; // Définir la couleur de fond
    button1.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('toutramasser');
        insertText(output);
    });

      // Création du deuxième bouton
    const button2 = document.createElement('button');
    button2.textContent = 'Tout déposer (sol)';
    button2.style.backgroundColor= '#e4ed97'; // Définir la couleur de fond
    button2.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('toutdeposerausol');
        insertText(output);
    });

      // Création du troisième bouton
    const button3 = document.createElement('button');
    button3.textContent = 'Tout déposer (chateau)';
    button3.style.backgroundColor= '#e4ed97'; // Définir la couleur de fond
    button3.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('toutdeposerauchateau');
        insertText(output);
    });

        // Création du troisième bouton
    const button3b = document.createElement('button');
    button3b.textContent = 'Tout déposer (manoir)';
    button3b.style.backgroundColor= '#e4ed97'; // Définir la couleur de fond
    button3b.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('toutdeposeraumanoir');
        insertText(output);
    });

        // Création du 4em bouton
    const button4 = document.createElement('button');
    button4.textContent = 'Tout ramasser (sauf corps)';
    button4.style.backgroundColor= '#e4ed97'; // Définir la couleur de fond
    button4.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('toutramassersaufcorps');
        insertText(output);
    });

          // Création du 5em bouton
    const button5 = document.createElement('button');
    button5.textContent = 'Entrainer';
    button5.style.backgroundColor= '#a8eff1';
    button5.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('entrainer');
        insertText(output);
    });

          // Création du 6em bouton
    const button6 = document.createElement('button');
    button6.textContent = 'Déposer un objet (sol)';
    button6.title = 'remplacer ID par l id de votre objet';
    button6.style.backgroundColor= '#e4ed97'; // Définir la couleur de fond
    button6.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('dépot1objetcase');
        insertText(output);
    });

          // Création du 7em bouton
    const button7 = document.createElement('button');
    button7.textContent = 'Déposer un objet (chateau)';
    button7.title = 'remplacer ID par l id de votre objet';
    button7.style.backgroundColor= '#e4ed97'; // Définir la couleur de fond
    button7.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('dépot1objetchateau');
        insertText(output);
    });

            // Création du 7em bouton bis
    const button7b = document.createElement('button');
    button7b.textContent = 'Déposer un objet (manoir)';
    button7b.title = 'remplacer ID par l id de votre objet';
    button7b.style.backgroundColor= '#e4ed97'; // Définir la couleur de fond
    button7b.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('dépot1objetmanoir');
        insertText(output);
    });

          // Création du 8em bouton
    const button8 = document.createElement('button');
    button8.textContent = 'Ramasser plantes';
    button8.style.backgroundColor= '#e4ed97'; // Définir la couleur de fond
    button8.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('ramasserplantes');
        insertText(output);
    });

          // Création du 9em bouton
    const button9 = document.createElement('button');
    button9.textContent = 'Ramasser CT';
    button9.style.backgroundColor= '#e4ed97'; // Définir la couleur de fond
    button9.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('ramasserct');
        insertText(output);
    });

        // Création du bouton pour l'ordre follow
    const followButton = document.createElement('button');
    followButton.textContent = 'Me suivre à';
    followButton.style.backgroundColor= '#a8eff1';
    followButton.title = 'Sélectionner la distance et cliquer';
    followButton.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const distance = followDistanceSelect.value;
        const followOrderText = generateFollowOrder(distance);
        insertText(followOrderText);
    });

          // Création du 11em bouton
    const button11 = document.createElement('button');
    button11.textContent = 'Attaquer un monstre';
    button11.style.backgroundColor= '#d37d7d'
    button11.title = "Remplacer l'ID";
    button11.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('attackmonster');
        insertText(output);
    });

            // Création du 12em bouton
    const button12 = document.createElement('button');
    button12.textContent = 'Attaquer tout';
    button12.style.backgroundColor= '#d37d7d'
    button12.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('attackall');
        insertText(output);
    });

            // Création du 13em bouton
    const button13 = document.createElement('button');
    button13.textContent = 'Equiper';
    button13.style.backgroundColor= '#e4ed97';
    button13.title = "Remplacer l'ID";
    button13.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('equip');
        insertText(output);
    });

            // Création du 14em bouton
    const button14 = document.createElement('button');
    button14.textContent = 'Déséquiper';
    button14.style.backgroundColor= '#e4ed97';
    button14.title = "Remplacer l'ID";
    button14.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('unequip');
        insertText(output);
    });

            // Création du 15em bouton
    const button15 = document.createElement('button');
    button15.textContent = 'Espionner';
    button15.style.backgroundColor= '#a8eff1';
    button15.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('scout');
        insertText(output);
    });

            // Création du 16em bouton
    const button16 = document.createElement('button');
    button16.textContent = 'Prendre un TP';
    button16.style.backgroundColor= '#a8eff1';
    button16.title = "Remplacer l'ID";
    button16.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le rafraîchissement de la page
        const output = generateText('passtp');
        insertText(output);
    });




    function createDropdownMenu() {
        // Création du menu déroulant avec des options
        const dropdown = document.createElement('select');
        const option1 = document.createElement('option');
        option1.textContent = 'Option 1';
        const option2 = document.createElement('option');
        option2.textContent = 'Option 2';
        // Ajout des options au menu déroulant
        dropdown.appendChild(option1);
        dropdown.appendChild(option2);
        // Style pour positionner le menu déroulant
        dropdown.style.position = 'absolute';
        dropdown.style.left = '150px'; // Changer la position en fonction de votre mise en page
        dropdown.style.top = '50px'; // Changer la position en fonction de votre mise en page
        // Ajout du menu déroulant au document
        document.body.appendChild(dropdown);
        return dropdown;
    }

    // Trouver les boutons "Déposer un objet (sol)" et "Déposer un objet (château)"
    const solButton = document.querySelector('.gfmm > form:nth-child(11) > div:nth-child(2) > div:nth-child(5) > button:nth-child(8)');
    const chateauButton = document.querySelector('.gfmm > form:nth-child(11) > div:nth-child(2) > div:nth-child(5) > button:nth-child(9)');

    // Gérer l'événement de clic sur le bouton "Déposer un objet (sol)"
    if (solButton) {
        solButton.addEventListener('click', function() {
            // Créer le menu déroulant
            const dropdown = createDropdownMenu();
            // Positionner le menu à côté du bouton "Déposer un objet (sol)"
            dropdown.style.left = solButton.getBoundingClientRect().right + 'px';
            dropdown.style.top = solButton.getBoundingClientRect().top + 'px';
        });
    }

    // Gérer l'événement de clic sur le bouton "Déposer un objet (château)"
    if (chateauButton) {
        chateauButton.addEventListener('click', function() {
            // Créer le menu déroulant
            const dropdown = createDropdownMenu();
            // Positionner le menu à côté du bouton "Déposer un objet (château)"
            dropdown.style.left = chateauButton.getBoundingClientRect().right + 'px';
            dropdown.style.top = chateauButton.getBoundingClientRect().top + 'px';
        });
    }




    // Création des conteneurs pour chaque catégorie
    const basicActionsContainer = document.createElement('div');
    const equipmentContainer = document.createElement('div');
    const warriorsContainer = document.createElement('div');

    // Ajout des boutons dans les conteneurs appropriés
    basicActionsContainer.appendChild(button0);
    basicActionsContainer.appendChild(button5); // Actions de base
    basicActionsContainer.appendChild(followButton);
    basicActionsContainer.appendChild(followDistanceSelect);
    basicActionsContainer.appendChild(button15);
    basicActionsContainer.appendChild(button16);
    equipmentContainer.appendChild(button1); // Équipement
    equipmentContainer.appendChild(button4);
    equipmentContainer.appendChild(button8);
    equipmentContainer.appendChild(button9);
    equipmentContainer.appendChild(document.createElement('br'));
    equipmentContainer.appendChild(button2);
    equipmentContainer.appendChild(button3);
    equipmentContainer.appendChild(button3b);
    equipmentContainer.appendChild(button6);
    equipmentContainer.appendChild(button7);
    equipmentContainer.appendChild(button7b);
    equipmentContainer.appendChild(document.createElement('br'));
    equipmentContainer.appendChild(button13);
    equipmentContainer.appendChild(button14);
    warriorsContainer.appendChild(button11); // Guerriers
    warriorsContainer.appendChild(button12);
    // Ajout du style pour masquer les catégories par défaut
    basicActionsContainer.style.display = 'none';
    equipmentContainer.style.display = 'none';
    warriorsContainer.style.display = 'none';




    // Gestionnaire d'événement pour masquer ou afficher une catégorie
    function toggleCategory(category, button) {
        const display = category.style.display;
        if (display === 'none') {
            category.style.display = 'block';
            button.textContent = button.textContent.replace('►', '▼');

        } else {
            category.style.display = 'none';
            button.textContent = button.textContent.replace('▼', '►');

        }
    }

    // Fonction pour créer un bouton de catégorie et son gestionnaire d'événements
    function createCategoryButton(container, buttonText) {
        const toggleButton = document.createElement('button');
        toggleButton.textContent = `${buttonText} ►`;
        toggleButton.addEventListener('click', function(event) {
            event.preventDefault(); // Empêcher le rafraîchissement de la page
            toggleCategory(container, this);
        });
        return toggleButton;
    }

    // Création des boutons pour masquer ou afficher les catégories
    const basicActionsToggle = createCategoryButton(basicActionsContainer, 'Actions de base');
    basicActionsToggle.title = "Cliquez pour afficher/masquer les actions de base";
    basicActionsToggle.style.backgroundColor= '#8de4e7';
    basicActionsToggle.style.fontWeight= 'bold'
    const equipmentToggle = createCategoryButton(equipmentContainer, 'Équipement');
    equipmentToggle.style.backgroundColor= '#ced688';
    equipmentToggle.style.fontWeight= 'bold'
    const warriorsToggle = createCategoryButton(warriorsContainer, 'Guerriers');
    warriorsToggle.style.backgroundColor= '#d37d7d';
    warriorsToggle.style.fontWeight= 'bold'

    // Trouver l'élément spécifique où insérer les boutons
    const specificElement = document.evaluate('/html/body/div[3]/div/table/tbody/tr[2]/td[2]/form/table', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (specificElement) {
        // Création d'un conteneur principal pour tous les boutons et les catégories
        const allButtonsContainer = document.createElement('div');
        allButtonsContainer.appendChild(basicActionsToggle);
        allButtonsContainer.appendChild(basicActionsContainer);
        allButtonsContainer.appendChild(document.createElement('br'));
        allButtonsContainer.appendChild(equipmentToggle);
        allButtonsContainer.appendChild(equipmentContainer);
        allButtonsContainer.appendChild(document.createElement('br'));
        allButtonsContainer.appendChild(warriorsToggle);
        allButtonsContainer.appendChild(warriorsContainer);

        // Ajoutez les autres catégories de la même manière

        // Insérer le conteneur des boutons avant l'élément spécifique
        specificElement.parentNode.insertBefore(allButtonsContainer, specificElement);
    } else {
        console.log('Élément spécifique non trouvé');
    }
    // Sélectionner l'élément cible
    const targetElement = document.querySelector('div.titreMenu:nth-child(9)');

    if (targetElement) {
        // Créer un nouvel élément pour le texte
        const newElement = document.createElement('p'); // Utilise un <p> pour le texte, ou tout autre élément approprié
        newElement.textContent = 'Bienvenue sur GobZilla Script. Cliquez directement sur des coordonées dans la vue clonée pour y déplacer votre suivant. Cliquez sur une ou plusieurs ID de trésors pour les ramasser. Sinon, utilisez les boutons'; // Définir le texte du nouvel élément

        // Ajouter le nouvel élément sous l'élément cible
        targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
    } else {
        console.error('L\'élément spécifié n\'a pas été trouvé.');
    }
});




    // Sélection de l'élément contenant le code
    const codeElement = document.querySelector('td > div > pre > code > span > span');

    if (codeElement) {
        // Récupération du texte de l'élément
        const texte = codeElement.textContent.trim();

        // Extraction du mot "stop"
        const stopIndex = texte.indexOf('stop');
        let stopData = '';

        if (stopIndex !== -1) {
            // Si le mot "stop" est trouvé, récupération de la partie du texte à partir de "stop"
            stopData = texte.substring(stopIndex, stopIndex + 4);
            console.log('Donnée "stop" extraite :', stopData);
        } else {
            console.log('Mot "stop" non trouvé dans le texte');
        }
    } else {
        console.log('Élément contenant le code non trouvé');
    }
    }



    //==========================================================================================================================================================================================================================
    // Page équipement - récuprer les BM du matos templaté et en calculer le total
    //==========================================================================================================================================================================================================================
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Equipement\.php/i)) {
    (function() {
        'use strict';

        let elements = document.querySelectorAll('td.blanc');

        elements.forEach(element => {
            if (element.innerText.includes("Viverne")) {
                let regex = /(DEG:\W\d+)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Centaure")) {
                let regex = /(ATT:\W\d+|DEG:\+\d+|PER:\W\d+)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Titan")) {
                let regex = /(ATT:\W\d+|DEG:\W\d+|ESQ:\W\d+)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Sphinx")) {
                let regex = /(ArmMag:\W\d+)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Lézard Géant")) {
                let regex = /(-30 Min)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Griffon")) {
                let regex = /(ATT:\W\d+|PER:\W\d+)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Minotaure")) {
                let regex = /(ArmMag:\W\d+|ESQ:\W\d+)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Oni")) {
                let regex = /(ATT:\W\d+|REG:\W\d+)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Golem")) {
                let regex = /(\+30 Min|ArmMag:\W\d+)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Galopin")) {
                let regex = /(ESQ:\W\d+|DEG:\W\d+)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Dragon")) {
                let regex = /(ATT:\W\d+|DEG:\W\d+|ESQ:\W\d+|ArmMag:\W\d+|RM:\W\d+%|MM\W\d+%)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Phoenix")) {
                let regex = /(DEG:\W\d+|REG:\W\d+|MS:\W\d+%)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }
            else if (element.innerText.includes("Ombre")) {
                let regex = /(ATT:\W\d+|DEG:\W\d+|PER:\W\d+|RT\W\d+%|MT\W\d+%)/g;
                element.innerHTML = element.innerHTML.replace(regex, '<span style="color: #e530cf ;">$1</span>');
            }

        });
    })();

    // Fonction pour extraire et calculer les bonus magiques des objets équipés
    function calculerBonusMagiques() {
      // Sélection des balises contenant les informations des objets équipés
      const elements = document.querySelectorAll('.blanc');

      let attBonus = 0;
      let armBonus = 0;
      let esqBonus = 0;
      let perBonus = 0;
      let degBonus = 0;
      let regBonus = 0;
      let tempsBonus = 0;

      // Parcours de chaque élément pour extraire les informations
      elements.forEach((element) => {
        const text = element.innerText.toLowerCase();

          if (text.includes('oni')) {
          attBonus += 1;
          regBonus += 1;
        }
          else if (text.includes('griffon')) {
          attBonus += 1;
          perBonus += 1;
        }
          else if (text.includes('viverne')) {
          degBonus += 1;
        }
          else if (text.includes('centaure')) {
          attBonus += 1;
          degBonus += 1;
          perBonus -= 1;
    }
          else if (text.includes('titan')) {
          attBonus += 1;
          degBonus += 1;
          esqBonus -= 1;
        }
          else if (text.includes('sphinx ')) {
          armBonus += 1;
        }
          else if (text.includes('lézard')) {
          tempsBonus -= 30;
        }
          else if (text.includes('minotaure')) {
          armBonus += 1;
          esqBonus -= 1;
        }

          else if (text.includes('golem')) {
          tempsBonus += 30;
          armBonus += 2;
        }
          else if (text.includes('galopin')) {
          esqBonus += 1;
          degBonus -= 1;
        }

          else if (text.includes('dragon')) {
          attBonus += 1;
          degBonus += 1;
          esqBonus -= 3;
          armBonus += 2;
        }
          else if (text.includes('phoenix')) {
          degBonus += 1;
          regBonus += 2;
        }
           else if (text.includes('ombre')) {
          attBonus += 1;
          degBonus += 1;
          perBonus -= 1;
        }

      });

      // Calcul du total des bonus malus magiques
      const totalBonus = `ATT${attBonus} | ESQ${esqBonus} | DEG${degBonus} | REG${regBonus} | Arm${armBonus} | PER${perBonus} | Temps${tempsBonus}`;

      // Sélection de l'élément où insérer les bonus
      const enleverButton = document.querySelector('input[name="maction"][value="Enlever"]');

      // Création d'un élément pour afficher les bonus
      const bonusElement = document.createElement('div');
      // Ajout des styles pour la couleur et le centrage
      bonusElement.style.color = '#e530cf'; // Couleur e530cf
      bonusElement.style.fontWeight = 'bold' ; // gras
      bonusElement.style.marginTop = '20px'; // Ajout d'un espace sous l'élément

      // Fonction pour afficher un symbole '+' ou '-' en fonction de la valeur du bonus
      const afficherSymbole = (valeur) => (valeur > 0 ? '+' : valeur < 0 ? '-' : '');

      // Texte pour afficher les bonus
      let texteBonus = 'Total des BMM: ';

      // Liste des bonus individuels avec leur nom et valeur
      const bonusIndividuels = [
        { nom: 'ATT', valeur: attBonus },
        { nom: 'ESQ', valeur: esqBonus },
        { nom: 'DEG', valeur: degBonus },
        { nom: 'REG', valeur: regBonus },
        { nom: 'ArmMag', valeur: armBonus },
        { nom: 'PER', valeur: perBonus },
        { nom: 'Temps', valeur: tempsBonus },
      ];

      // Boucle à travers chaque bonus individuel et les ajouter au texte
      bonusIndividuels.forEach((bonus) => {
        const symbole = afficherSymbole(bonus.valeur);
        const valeurAbsolue = Math.abs(bonus.valeur);

        // Si la valeur du bonus est différente de zéro, l'ajouter au texte
        if (bonus.valeur !== 0) {
          texteBonus += `${bonus.nom}${symbole}${valeurAbsolue} | `;
        }
      });

      // Supprimer le dernier symbole '|' s'il est présent à la fin
      texteBonus = texteBonus.replace(/\s*\|\s*$/, '');

      // Création d'un élément avec le texte des bonus
      const totalBBMElement = document.createElement('div');
      totalBBMElement.textContent = texteBonus;
      bonusElement.appendChild(totalBBMElement);

      // Insertion du texte des bonus après l'élément "Enlever"
      enleverButton.insertAdjacentElement('afterend', bonusElement);
    }

    // Appel de la fonction une fois que la page est chargée
    window.addEventListener('load', calculerBonusMagiques);

     }


    //==========================================================================================================================================================================================================================
    // Page Option - Description de Gobzilla quand on clique sur Goodies et Gobzilla
    //==========================================================================================================================================================================================================================

        // rename Goodies
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Options\.php/i)) {
    (function() {
        'use strict';

        var newLinkText = "[Googies et GobZilla]";

        var goodiesLink = document.querySelector('a[href="goodies.php"]');
        if (goodiesLink) {
            goodiesLink.textContent = newLinkText;
        }

    })
    ();
    }

        // ajoute un paragraphe de description de Gobzilla
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Goodies\.php/i)) {
    (function() {
        'use strict';

        var newLinkText = "[Googies et GobZilla]";

        var goodiesLink = document.querySelector('a[href="goodies.php"]');
        if (goodiesLink) {
            goodiesLink.textContent = newLinkText;
        }


        var newMessageLines = [
          "Roulé à la main sous les Aisselles par DeathMétal 330, puis grandement amélioré par Glak 393",
          "Fonctions principales :",
          "- GobCDM : Cliquez sur un monstre dans la page vue pour avoir sa cdm, si déja dans la base de donnée",
          " - Affiche une vue 2d activable ou non  ",
          " - Boutons pour les ordres des suivants  ",
          " - Décoche le vestiaire, décoche l'activation de DLA ",
          ' - Masquer les petits monstres, masquer les arbres',
          " - Calcul auto de nombre d'entrainements pour passer lvl supérieur" ,
          " - Récupération des caracs et calculs des skills au survol de la souris. ",
          " - Calcul sur les Matériaux, page équipement et habitation",
          " - Modifie la Css et met en couleur les Gobelins et les gros monstres dans la vue . En rouge > 40, en orange >35, en orange clair >30",
          "-  Filtre et tri des monstres +  compteur, tri des plantes",
           "- Affiche les lieux étendus (lieux hors de vue), ainsi que les plantes étendues (plantes hors vue, activable via une coche)",
          " - Herboriser : Affiche en couleur verte les plantes herborisables",
          " - Met en évidence le Bonus/Malus de concentration sur la page Mon profil ",
          " - Calcul des Bonus Malus Magiques de l'équipement sur la page equipement et met en évidence les bonus magiques sur chaque objet ",
          " - Ajout d'icônes dans le profil et dans la vue ",
          " 🥰 amis",
          " 👨‍🍳 monstre à cuisiner  ",
          "👁️👁️👁️ VLC Totale",
          "👁️👁️ VLC Importante",
          "👁️ VLC partielle",
          " Bipez moi si vous voyez des erreurs, il doit y en avoir......."
        ];



        var developmentMessage = document.querySelector('font[color="RED"]');
        if (developmentMessage) {
            developmentMessage.textContent = ''; // Clear existing content

          // Add an image
          var imageElement = document.createElement('img');
            imageElement.src = 'https://i.ibb.co/cgqGVCt/g-OBZILLAICON.png'; // Replace with the URL of your image
            imageElement.style.maxWidth = '60%'; // Ensure the image fits within the content
            developmentMessage.appendChild(imageElement);

          var welcomeTitle = document.createElement('div');
            welcomeTitle.style.fontSize = '24px'; // Larger font size
            welcomeTitle.style.fontWeight = 'bold'; // Bold style
            welcomeTitle.style.marginBottom = '10px'; // Add some space below
            welcomeTitle.textContent = 'Bienvenue sur GobZilla';
            developmentMessage.appendChild(welcomeTitle);
            newMessageLines.forEach(function(line) {
                var paragraph = document.createElement('p');
               paragraph.style.color = 'black';
                if (line === "Fonctions principales :") {
                    var underline = document.createElement('u');
                    underline.textContent = line;
                    paragraph.appendChild(underline);
                } else {
                    paragraph.textContent = line;
                }
                developmentMessage.appendChild(paragraph);
            });
        }
    })();

    }

   //==========================================================================================================================================================================================================================
    // Page Clan - Récupération des infos et affichage au survol (surrement a fusionner avec meute juste en dessous)
    //==========================================================================================================================================================================================================================
  if (window.location.href.match(/gobland\.fr\/membresClan\.php/i)) {
    (function () {
        'use strict';

        const CLAN_ID = 330;
        const CLAN_PASSWD = "30fae3bb4bf976a5cd29628102d42fd2";
        const BASE_URL = "http://ie.gobland.fr/IE_ClanMembres.php";
        const PROXY = "https://corsproxy.io/?";
        const CACHE_KEY = "clanMembresData";
        const CACHE_TIME_KEY = "clanMembresTime";
        const CACHE_DURATION = 5 * 60 * 1000; // 5 min

        let clanData = {};

        // === CHARGEMENT DES DONNÉES CLAN ===
        function loadClanData() {
            const cached = localStorage.getItem(CACHE_KEY);
            const cacheTime = localStorage.getItem(CACHE_TIME_KEY);

            if (cached && cacheTime && (Date.now() - parseInt(cacheTime) < CACHE_DURATION)) {
                clanData = JSON.parse(cached);
                console.log("Données clan chargées depuis cache");
                addHoverEvents();
                updateButton();
                return;
            }

            const url = `${BASE_URL}?id=${CLAN_ID}&passwd=${CLAN_PASSWD}&sep=,`;
            fetch(PROXY + encodeURIComponent(url))
                .then(r => r.text())
                .then(csv => {
                    const lines = csv.trim().split('\n');
                    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());

                    clanData = {};
                    lines.slice(1).forEach(line => {
                        const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
                        const idIndex = headers.indexOf("id");
                        const id = values[idIndex];
                        if (id) {
                            const row = {};
                            headers.forEach((h, i) => row[h] = values[i]);
                            clanData[id] = row;
                        }
                    });

                    localStorage.setItem(CACHE_KEY, JSON.stringify(clanData));
                    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
                    console.log("Données clan mises à jour", clanData);
                    addHoverEvents();
                    updateButton();
                })
                .catch(err => {
                    console.error("Erreur fetch clan:", err);
                });
        }

        // === HOVER SUR LES LIENS ===
        function addHoverEvents() {
            document.querySelectorAll('td.pfmm a').forEach(link => {
                const match = link.getAttribute('href')?.match(/\((\d+)\)/);
                if (!match) return;
                const id = match[1];

                link.style.cursor = "pointer";

                let tooltip = null;
                let moveHandler = null;

                link.addEventListener('mouseenter', (e) => {
                    if (tooltip) return;
                    const data = clanData[id];
                    if (!data) {
                        link.title = "Pas de données";
                        return;
                    }

                    tooltip = document.createElement('div');
                    tooltip.style.cssText = `
                        position: fixed;
                        background: #fffde7;
                        border: 2px solid #d4af37;
                        padding: 10px;
                        font-size: 12px;
                        z-index: 9999;
                        max-width: 320px;
                        box-shadow: 0 6px 16px rgba(0,0,0,0.4);
                        border-radius: 8px;
                        pointer-events: none;
                        font-family: 'Segoe UI', sans-serif;
                        line-height: 1.4;
                    `;

                    const table = document.createElement('table');
                    table.style.cssText = "width: 100%; border-collapse: collapse;";
                    const keys = ["id", "nom", "race", "tribu", "niveau", "x", "y", "n", "z", "dla", "etat", "pa", "pv", "px", "pxperso", "pi", "ct", "carac"];
                    keys.forEach(key => {
                        if (data[key]) {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td style="padding:3px 6px; font-weight:bold; color:#8B4513; white-space:nowrap;">${key.toUpperCase()}:</td>
                                <td style="padding:3px 6px; color:#333;">${data[key]}</td>
                            `;
                            table.appendChild(tr);
                        }
                    });
                    tooltip.appendChild(table);
                    document.body.appendChild(tooltip);

                    const updatePosition = (e) => {
                        const x = e.clientX + 12;
                        const y = e.clientY + 12;
                        const rect = tooltip.getBoundingClientRect();
                        const maxX = window.innerWidth - rect.width - 10;
                        const maxY = window.innerHeight - rect.height - 10;

                        tooltip.style.left = `${Math.min(x, maxX)}px`;
                        tooltip.style.top = `${Math.min(y, maxY)}px`;
                    };

                    updatePosition(e);
                    moveHandler = (ev) => updatePosition(ev);
                    document.addEventListener('mousemove', moveHandler);
                });

                link.addEventListener('mouseleave', () => {
                    if (tooltip) {
                        tooltip.remove();
                        tooltip = null;
                    }
                    if (moveHandler) {
                        document.removeEventListener('mousemove', moveHandler);
                        moveHandler = null;
                    }
                });
            });
        }

        // === BOUTON RAFRAÎCHIR ===
        function updateButton() {
            const oldBtn = document.querySelector('.refresh-button');
            if (oldBtn) oldBtn.remove();

            const refreshButton = document.createElement('input');
            refreshButton.type = 'button';
            refreshButton.value = 'Rafraîchir les données externes';
            refreshButton.title = 'Cliquez ici pour actualiser les données externes. NE PAS ABUSER';
            refreshButton.classList.add('refresh-button');

            const time = localStorage.getItem(CACHE_TIME_KEY);
            if (time) {
                const ago = Math.floor((Date.now() - parseInt(time)) / 1000);
                const m = Math.floor(ago / 60), s = ago % 60;
                refreshButton.title += ` | Dernière MAJ il y a ${m}m ${s}s`;
            }

            refreshButton.onclick = () => {
                localStorage.removeItem(CACHE_KEY);
                localStorage.removeItem(CACHE_TIME_KEY);
                refreshButton.value = 'Chargement...';
                refreshButton.disabled = true;
                loadClanData().finally(() => {
                    refreshButton.value = 'Rafraîchir les données externes';
                    refreshButton.disabled = false;
                });
            };

            const centerElement = document.querySelector('#identite .pfmm');
            if (centerElement) {
                centerElement.appendChild(refreshButton);
            }

            const style = document.createElement('style');
            style.innerHTML = `
                .refresh-button {
                    display: block;
                    margin: 10px auto;
                    padding: 8px 16px;
                    background: #f0e68c;
                    border: 1px solid #d4af37;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    color: #333;
                }
                .refresh-button:hover { background: #e6dc7a; }
                .refresh-button:disabled { background: #ccc; cursor: not-allowed; }
            `;
            document.head.appendChild(style);
        }

        // === LANCEMENT ===
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadClanData);
        } else {
            loadClanData();
        }

    })();
}



    //==========================================================================================================================================================================================================================
    // Page Meute - Récupération du niveau pour calcul des PX et récup de l'heure de DLA via ieprofil
    //==========================================================================================================================================================================================================================
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Meute\.php/i)) {
      var lvlmeute = $('center:contains("Niveau de la meute :")').text().match(/^(\D*)(\d+)/)[2];
      window.localStorage.setItem('lvlmeute', lvlmeute);
    } else {
      var lvlmeute = window.localStorage.getItem('lvlmeute');
    }


    /// recup des données sur http://ie.gobland.fr/IE_Profil.php?id=XXX
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Meute\.php/i)) {
        (function() {
            const gobelinPasswords = {
                '330': '30fae3bb4bf976a5cd29628102d42fd2',
                '393': '461a9bdebd3bca149b7b07380b23c7fb',
                '346': '0da2dc91e48d987245a1c6b1662ea41f',
                '387': 'e49a305f7e7e0c784890f47793dd838a',
                '386' : 'b67d6b06e728729e6a2111ca7ffcf387',
                '388': 'c6d64737a6737cdb73a405353b3f1771',
                '411': 'd72e3819d988118cd76f3f5105c8fc7d',
                '407' : '8fdbd9336997cf1dab7a72cbd80733a3',
                '385': 'd8136cab7a465e1e1e2be460c161ef7e',
                '405' : 'e3d4c7b9250c8bde4c0a4ac7a596ecbb',
                '458' : '1eac37ef925c635c9be62212deba8642',
                '456' : '94238d5187351be4adbfc220e6baea4e'

            };

            const goblinIDs = ['330', '393', '346', '387' , '386', '388', '411', '407', '385', '405' , '456', '458'];

            const goblinNames = {
                '330': 'DeathMétal',
                '393': 'Glakus Batak Batak',
                '346': 'Globulus',
                '387':'SeRiNy',
                '386':'IKI',
                '388': 'Wose',
                '411':'TKeePeR',
                '407':'Groot',
                '385':'Tamarand',
                '405':'Catarate',
                '456' : 'Kroc le Bo',
                '458' : 'Shadox'
            };

            function extractinfos(csvData) {
                const rows = csvData.split('\n');
                if (rows.length < 2) return null;

                const headers = rows[0].split(',');
                const dataIndex = headers.indexOf('DLA');
                if (dataIndex === -1) return null;

                const dataArray = rows[1].split(',');
                return dataArray[dataIndex];
            }

          //ici c'est un peu le bordel j'avoue
            function updateTableWithDLA(infosValue, goblinName) {

    }

      // Enregistrement du dernier temps de récupération de données
    let lastFetchTime = performance.now();

    function refreshData() {
        goblinIDs.forEach(id => {
            const password = gobelinPasswords[id];
            const url = `http://ie.gobland.fr/IE_Profil.php?id=${id}&passwd=${password}&sep=,&`;

            fetch(url)
                .then(response => response.text())
                .then(csvData => {
                    localStorage.setItem(`goblinInfo_${id}`, csvData);
                    const currentTime = performance.now();
                    const timeElapsed = currentTime - lastFetchTime;
                    lastFetchTime = currentTime;

                    console.log(`Données pour l'ID ${id} rafraîchies et stockées dans le local storage.`);
                    console.log(`Temps écoulé depuis le dernier appel pour ID ${id}: ${timeElapsed} millisecondes`);

                    // Convertir le temps en heures et/ou minutes
                    const timeInMinutes = Math.floor(timeElapsed / (1000 * 60));
                    const hours = Math.floor(timeInMinutes / 60);
                    const minutes = timeInMinutes % 60;
                    const formattedTime = `${hours}h ${minutes}m`;

                    // Mettre à jour le titre du bouton avec le temps écoulé
                    refreshButton.title = `Cliquez ici pour actualiser les données externes. NE PAS ABUSER. Dernière mise à jour il y a ${formattedTime}`;
                })
                .catch(error => {
                    console.error(`Erreur lors de la récupération du CSV pour l'ID ${id}:`, error);
                });
        });
    }



      const refreshButton = document.createElement('input');
            refreshButton.type = 'button';
            refreshButton.value = 'Rafraîchir les données externes';
            refreshButton.title = 'Cliquez ici pour actualiser les données externes. NE PAS ABUSER';
            refreshButton.onclick = refreshData;

            refreshButton.classList.add('refresh-button'); // Ajout de la classe au bouton

            const centerElement = document.querySelector('#identite .pfmm');
            if (centerElement) {
                centerElement.appendChild(refreshButton);
            } else {
                console.error('Impossible de trouver l\'emplacement pour insérer le bouton.');
            }
        })();

        // Ajout de styles CSS pour centrer le bouton
        const style = document.createElement('style');
        style.innerHTML = `
            .refresh-button {
                display: block;
                margin: 0 auto;
                text-align: center;
            }
        `;
        document.head.appendChild(style);



    // Sélection de la colonne "Santé"
    const healthColumn = document.querySelector('.tab75 > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(4)');

    // Appliquer le style pour empêcher le texte de passer à la ligne
    if (healthColumn) {
        healthColumn.style.whiteSpace = 'nowrap';
    }


    // Fonction pour récupérer les informations du local storage
    function getGoblinInfoById(id) {
        const goblinData = localStorage.getItem(`goblinInfo_${id}`);
        console.log(`Data for ID ${id}:`, goblinData); // Vérification dans la console

        return goblinData;
    }

    // Fonction pour afficher les infos bulles
    function showGoblinInfoOnHover() {
        const playerLinks = document.querySelectorAll('td.pfmm a');

        playerLinks.forEach(link => {
            link.addEventListener('mouseover', (event) => {
                const playerId = link.getAttribute('href').match(/\((\d+)\)/)[1];
                const goblinInfo = getGoblinInfoById(playerId);

                const tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');

                if (goblinInfo) {
                    const lines = goblinInfo.split('\n'); // Divise les lignes
                    const table = document.createElement('table');
                    table.classList.add('tooltip-table');

                    lines.forEach((line, index) => {
                        const rowData = line.split(',').map(data => data.replace(/^"|"$/g, '')); // Divise les données par colonne et supprime les guillemets

                        const row = document.createElement('tr');
                        rowData.forEach(cellData => {
                            const cell = document.createElement(index === 0 ? 'th' : 'td'); // Utilisation de th pour la première ligne
                            cell.textContent = cellData;
                            row.appendChild(cell);
                        });

                        table.appendChild(row);
                    });

                    tooltip.appendChild(table);
                } else {
                    tooltip.textContent = "Aucune information disponible, mot de passe de clan manquant";
                }

                document.body.appendChild(tooltip);

                tooltip.style.position = 'absolute';
                tooltip.style.top = `${event.clientY + window.scrollY}px`;
                tooltip.style.left = `${event.clientX}px`;
                tooltip.style.backgroundColor = 'white';
                tooltip.style.border = '1px solid black';
                tooltip.style.padding = '5px';
                tooltip.style.zIndex = '9999';
                tooltip.style.backgroundColor = 'yellow'

                link.addEventListener('mouseout', () => {
                    tooltip.remove();
                });
            });
        });
    }

    // Appel de la fonction pour afficher les infos bulles
    showGoblinInfoOnHover();

    }

$(document).ready(function () {
    // Récupérer le message stocké dans localStorage
    const criStatus = localStorage.getItem("criStatus");

    // Si le message n'est pas trouvé dans le localStorage, utiliser un message par défaut
    const messageToDisplay = criStatus || "Aucune information disponible";

    // Si on est sur la page "vue", afficher le message stocké
    if ($(location).attr('href').match(/^http:\/\/(.*\.)?gobland\.fr\/vue\.php$/i)) {
        // Vérifier si un message existe dans le localStorage
        if (criStatus) {
            console.log("Message récupéré : " + criStatus);
        } else {
            console.log("Aucun message trouvé, affichage par défaut.");
        }

        // Créer l'élément pour le message
        const messageElement = $("<div>")
            .text(messageToDisplay)
            .css({
                "margin-top": "14px",
                "text-align": "center",
                "font-weight": "bold",
                "color": criStatus === "Vous êtes sous cri de Guerre" ? "green" : "red",
            });

        // Insérer le message sous les boutons
        $("input[type='button'][value='Envoyer un MP']")
            .parent()  // Cible le parent de chaque bouton
            .before(messageElement);
    }

    // Si on est sur la page "meute", déterminer le statut et l'enregistrer dans localStorage
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Meute\.php/i)) {
        let criActif = false; // Variable pour vérifier si un membre a un niveau 0

        // Parcourir chaque ligne du tableau des membres de la meute
        $("#content table.tab75 tbody tr").each(function () {
            // Extraire le niveau du membre
            const levelCell = $(this).find("td:nth-child(3)").text().trim(); // Cellule avec le niveau

            // Recherche du niveau (le dernier nombre dans la cellule)
            const match = levelCell.match(/\d+$/);
            if (match) {
                const level = parseInt(match[0], 10);
                console.log("Niveau trouvé : " + level);

                // Si un niveau est égal à 0, on active le cri de guerre
                if (level === 0) {
                    criActif = true;
                    return false; // Arrêter la boucle dès qu'on trouve un niveau égal à 0
                }
            }
        });

        // Déterminer le message en fonction de l'état du cri
        let message;
        if (criActif) {
            message = "Vous êtes sous cri de Guerre";
        } else {
            message = "Attention, pas de cri actif actuellement";
        }

        // Enregistrer le message dans localStorage
        localStorage.setItem("criStatus", message);

        // Afficher le message sur la page "meute"
        $("<div>")
            .text(message)
            .css("color", criActif ? "green" : "red")
            .css("font-weight", "bold")
            .css("margin-top", "12px")
            .insertAfter("#content table.tab75");
    }

    // Affichage pour confirmation dans la console
    console.log("Message : " + messageToDisplay);
});



    //==========================================================================================================================================================================================================================
    // Page de résultat d'action - Envoi des CdM à GobZilla
    //==========================================================================================================================================================================================================================
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/act\.php/i)) {
      // Extraction des caracs min - max d'une ligne de CdM
      function extractMinMax(intervalle) {
        var parse = intervalle.match(/entre (\d+) et (\d+)/);
        if (parse != null) {
          return new Array(parseInt(parse[1]), parseInt(parse[2]));
        } else {
          parse = intervalle.match(/inférieur ou égal à (\d+)/);
          if (parse != null) {
             return new Array(1, parseInt(parse[1]));
          } else {
            parse = intervalle.match(/supérieur ou égal à (\d+)/);
            if (parse != null) {
              return new Array(parseInt(parse[1]), parse[1]*1.5);
            } else {
              return null;
            }
          }
        }
      }

      $( document ).ready(function() {
        if ($("h1").text() == "Connaissance des Monstres") {
          // Analyse de la CdM
          var conteneur = $("#identite").find("div.deborde");
          var rang  = null;
          var executionLinesArr = conteneur.find("center:first").text().split("\n");
          $.each( executionLinesArr, function( key, value ) {
            if (value.indexOf("AVEZ RÉUSSI") > 0) {
              rang = value.substring(
                        value.indexOf("en tant que") + 12,
                        value.indexOf(" ("));
              return false;
            }
          });
          console.log("Rang = " + rang);
          // Vérification du rang : on ne traite pas les CdM des grouillots
          if (rang == "Maître" || rang == "Grand Maître") {
            var resultLinesArr = conteneur.text().split("\n");
            var cdm = {};
            cdm.gob = window.localStorage.getItem('gobId');
            cdm.rang = rang;
            $.each( resultLinesArr, function( key, value ) {
              lineArr = value.split(" : ");
              // Construction de la CdM en parsant la page
              switch (lineArr[0]) {
                case "Le monstre ciblé fait partie des":
                  cdm.nom = lineArr[1].split("(")[1].split(" - ")[0];
                  cdm.numMob = lineArr[1].split(" - N° ")[1].split(")")[0];
                  break;
                case "Niveau":
                  cdm.niveau = lineArr[1];
                  break;
                case "Points de Vie":
                  var arrMinMax = extractMinMax(lineArr[1]);
                  cdm.pvMin = arrMinMax[0];
                  cdm.pvMax = arrMinMax[1];
                  break;
                case "Dés d'Attaque":
                  var arrMinMax = extractMinMax(lineArr[1]);
                  cdm.attMin = arrMinMax[0];
                  cdm.attMax = arrMinMax[1];
                  break;
                case "Dés d'Esquive":
                  var arrMinMax = extractMinMax(lineArr[1]);
                  cdm.esqMin = arrMinMax[0];
                  cdm.esqMax = arrMinMax[1];
                  break;
                case "Dés de Dégât":
                  var arrMinMax = extractMinMax(lineArr[1]);
                  cdm.degMin = arrMinMax[0];
                  cdm.degMax = arrMinMax[1];
                  break;
                case "Dés de Régénération":
                  var arrMinMax = extractMinMax(lineArr[1]);
                  cdm.regMin = arrMinMax[0];
                  cdm.regMax = arrMinMax[1];
                  break;
                case "Perception":
                  var arrMinMax = extractMinMax(lineArr[1]);
                  cdm.perMin = arrMinMax[0];
                  cdm.perMax = arrMinMax[1];
                  break;
                case "Armure Physique":
                  var arrMinMax = extractMinMax(lineArr[1]);
                  cdm.armurePhyMin = arrMinMax[0];
                  cdm.armurePhyMax = arrMinMax[1];
                  break;
                case "Armure Magique":
                  var arrMinMax = extractMinMax(lineArr[1]);
                  cdm.armureMagMin = arrMinMax[0];
                  cdm.armureMagMax = arrMinMax[1];
                  break;
                case "Durée du tour":
                  var arrMinMax = extractMinMax(lineArr[1]);
                  cdm.tourMin = arrMinMax[0];
                  cdm.tourMax = arrMinMax[1];
                  break;
                case "Créature volante":
                  cdm.vol = lineArr[1];
                  break;
                case "Attaque à distance":
                  cdm.distance = lineArr[1];
                  break;
                case "Pouvoir":
                  cdm.pouvoir = lineArr[1];
                  break;
                case "Nombre d'attaques":
                  cdm.nbAttaques = lineArr[1];
                  break;
                case "Habitat":
                  cdm.habitat = lineArr[1];
                  break;
                case "Comportement":
                  cdm.comportement = lineArr[1];
                  break;
                case "Intelligence":
                  cdm.intelligence = lineArr[1];
                  break;
                case "Vitesse de déplacement":
                  cdm.vitesse = lineArr[1];
                  break;
                case "Vision du Caché":
                  cdm.vlc = lineArr[1];
                  break;
              }
            });

            // Envoi de la CdM
            var url = "https://gobzilla.incaworld.fr/cdm";
            var result = $("<center></center>");
            console.log(cdm);
            var data = JSON.stringify(cdm);
            console.log(data);
            $.ajax({
              type: "PUT",
              url: url,
              contentType: "application/json",
              data: data
            })
            .done(function() {
              result.html("<br><b>**** CdM envoyée à GobZilla ****</b>");
            })
            .fail(function(err) {
              console.log(err);
              result.html("<br><b>**** Echec de l'envoi de la CdM à GobZilla ****</b>");
            })
            .always(function() {
              result.insertAfter(conteneur.find("center:last"));
            });
          }
        }
      });
    }

    //==========================================================================================================================================================================================================================
    // Page MENU (left)
    //==========================================================================================================================================================================================================================
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Menu\.php/i)) {
      // Enregistrement dans le stockage local de l'identité du Gob
      var gobContainer = $(".presentation").find('a:first');
      window.localStorage.setItem('gobName', gobContainer.text());
      window.localStorage.setItem('gobId', gobContainer.attr('href').match(/javascript:EPV\((\d+)\)/)[1]);
    }


    //==========================================================================================================================================================================================================================
    // Page ACTIONS (footer) Affiche en couleur les monstres qui manquent de CDM
    //==========================================================================================================================================================================================================================
    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/playActions\.php/i)) {
      function showHideCdmNeededActions() {
        var displayCdmNeededChecked = window.localStorage.getItem('displayCdmNeededChecked');

        if(displayCdmNeededChecked == 1) {
          var cdmNeeded = window.localStorage.getItem('cdmNeeded');
          $.each(cdmNeeded.split(","), function(index, value) {
            $('option:contains("' + value + '")').css("background-color", "#FF99FF");
          });
        } else {
          $(".cdmNeeded").removeClass("cdmNeeded");
        }
      }

      // Après chargement de la page, lancement des enhancements
      $( document ).ready(function() {
        showHideCdmNeededActions();
      });
    }

    //==========================================================================================================================================================================================================================
    // Page VUE. Vue 2D, divers filtres/tri, modification de la CSS, lieux et plantes étendus, CDM, Compteur de créatures
    //==========================================================================================================================================================================================================================
    if ($(location).attr('href').match(/^http:\/\/(.*\.)?gobland\.fr\/vue\.php$/i)) {



      // Intégration de CSS pour le loader et la CDM
      var myCSS = `
        #preFilter label {
          padding-left: 10px;
        }
        #preFilter {
          padding: 5px;
          margin-bottom: 5px;
          border: 1px solid black;
          text-align: center;
        }
        #btnRefresh {
          display: block;
          text-align: center;
          margin: auto;
        }
        #filterDiv {
          padding-bottom: 5px;
        }
        #filterDiv label {
          padding-left: 10px;
        }
        .ckbFilter {
          vertical-align: middle;
        }
        .cdmNeeded {
          background-color: #FF99FF;
        }
        .cuisine {
          background-color: #99FF99;
        }
        .cdmContainer {
          background: url(http://images.gobland.fr/v1.0/grande-fenetre/gf-centre.png);
          border: 2px solid #666;
          font-family: sans-serif;
          font-size: 12px;
          padding: 10px;
          display: inline-block;
          background-color: #ddd;
          position: fixed;
          width: 400px;
          left: 270px;
          top: 10%;
        }
        .cdmContainer .title {
          font-weight: bold;
          font-size: 14px;
        }
        .cdmContainer span {
          display: block;
          padding: 2px;
        }
        .lds-roller {
          display: inline-block;
          position: fixed;
          width: 80px;
          height: 80px;
          left: 415px;
          top: 50%;
          z-index: 1000;
        }
        .lds-roller div {
          animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          transform-origin: 40px 40px;
        }
        .lds-roller div:after {
          content: " ";
          display: block;
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #000;
          margin: -4px 0 0 -4px;
        }
        .lds-roller div:nth-child(1) {
          animation-delay: -0.036s;
        }
        .lds-roller div:nth-child(1):after {
          top: 63px;
          left: 63px;
        }
        .lds-roller div:nth-child(2) {
          animation-delay: -0.072s;
        }
        .lds-roller div:nth-child(2):after {
          top: 68px;
          left: 56px;
        }
        .lds-roller div:nth-child(3) {
          animation-delay: -0.108s;
        }
        .lds-roller div:nth-child(3):after {
          top: 71px;
          left: 48px;
        }
        .lds-roller div:nth-child(4) {
          animation-delay: -0.144s;
        }
        .lds-roller div:nth-child(4):after {
          top: 72px;
          left: 40px;
        }
        .lds-roller div:nth-child(5) {
          animation-delay: -0.18s;
        }
        .lds-roller div:nth-child(5):after {
          top: 71px;
          left: 32px;
        }
        .lds-roller div:nth-child(6) {
          animation-delay: -0.216s;
        }
        .lds-roller div:nth-child(6):after {
          top: 68px;
          left: 24px;
        }
        .lds-roller div:nth-child(7) {
          animation-delay: -0.252s;
        }
        .lds-roller div:nth-child(7):after {
          top: 63px;
          left: 17px;
        }
        .lds-roller div:nth-child(8) {
          animation-delay: -0.288s;
        }
        .lds-roller div:nth-child(8):after {
          top: 56px;
          left: 12px;
        }
        @keyframes lds-roller {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }`;
      var myStyle = document.createElement("style");
      myStyle.setAttribute("type", "text/css");
      myStyle.appendChild(document.createTextNode(myCSS));
      document.body.appendChild(myStyle);

      // HTML pour le loader
      var loader = $("<div id=\"loader\" class=\"lds-roller\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>");
      $("#content").append(loader);
      $("#loader").hide();

      // HTML pour les CdM
      var cdm = $("<div id=\"cdm\" class=\"cdmContainer\"></div>");
      $("#content").append(cdm);
      cdm.click(function(evt) {
        evt.preventDefault();
        $("#cdm").hide();
      });
      $("#cdm").hide();

      const raceGobs = ["Musculeux", "Mentalo", "Nodef", "Trad Scion", "Vis Yonnair", "Zozo Giste"];
      const monstreAMasquer = ["Lémure", "Sprigan", "Larbin démoniaque", "Plante Carnivore", "Abishaii Blanc", "Abishaii Bleu" , "Abishaii Noir ", "Abishaii Vert" , "Ame-en-peine" , "Pitimarmotte" , "Diablotin" ];
      const ArbresAMasquer = ["Arbre"];
      const suivants =["Créature mécanique", "Squelette", "Pierreux" , "Esprit-rôdeur" , "Zombi"];



//insere un lien vers GobMaps
(function() {
    'use strict';

    // Fonction pour créer et insérer l'icône
    function insertIcon() {
        // Vérifier si l'icône existe déjà pour éviter les doublons
        if (document.getElementById("gobmaps-icon")) {
            console.log("Icône déjà insérée, arrêt.");
            return;
        }

        // Créer un conteneur pour l'icône
        const iconContainer = document.createElement("div");
        iconContainer.id = "gobmaps-icon";
        iconContainer.style.textAlign = "center";
        iconContainer.style.margin = "0 0";
        iconContainer.style.fontFamily = "Arial, sans-serif";

        // Créer le lien avec l'icône
        const link = document.createElement("a");
        link.href = "https://gobmaps.rf.gd/carte.html";
        link.title = "Aller sur GobMaps"; // Tooltip au survol
        link.target = "_blank";

        // Créer l'élément image
        const icon = document.createElement("img");
        icon.src = "https://i.ibb.co/tpnPvnYv/favicon.jpg";
        icon.alt = "GobMaps";
        icon.style.width = "32px"; // Ajustez la taille si nécessaire
        icon.style.height = "26px";
        icon.style.verticalAlign = "middle";

        link.appendChild(icon);
        iconContainer.appendChild(link);

        // Trouver le bouton "Envoyer des PX"
        const pxButton = document.querySelector('center input[type="BUTTON"][value="Envoyer des PX"]');

        if (pxButton && pxButton.parentNode) {
            console.log("Bouton 'Envoyer des PX' trouvé, insertion de l'icône après.");
            // Insérer après le bouton "Envoyer des PX"
            pxButton.parentNode.insertBefore(iconContainer, pxButton.nextSibling.nextSibling); // Passe après l'espace ( )
        } else {
            console.warn("Bouton 'Envoyer des PX' non trouvé.");
            // Fallback : insérer dans #content
            const contentDiv = document.getElementById("content");
            if (contentDiv) {
                console.log("Insertion de secours dans #content.");
                contentDiv.appendChild(iconContainer);
            } else {
                console.warn("Aucun conteneur de secours (#content) trouvé.");
            }
        }
    }

    // Essayer d'insérer l'icône au chargement initial
    document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM chargé, tentative d'insertion de l'icône.");
        insertIcon();
    });

    // Observer les changements dans le DOM pour un chargement dynamique
    const observer = new MutationObserver((mutations, obs) => {
        console.log("Changement détecté dans le DOM, nouvelle tentative d'insertion.");
        insertIcon();
        // Arrêter l'observation si l'icône a été insérée
        if (document.getElementById("gobmaps-icon")) {
            obs.disconnect();
            console.log("Icône insérée, observation arrêtée.");
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Observation du DOM démarrée.");
})();



      /// Coloration des gobs
      $.each(raceGobs, function(index, value) {
        $('#TCREATURES > center > table > tbody > tr > td:contains("' + value + '")').parent().css("background-color","#ccccff");
      });

    // Coloration des suivants avec condition supplémentaire
    $.each(suivants, function(index, value) {
        $('#TCREATURES > center > table > tbody > tr > td:contains("' + value + '")').each(function() {
        // Récupérez le texte de l'élément td contenant le lien
        var texte = $(this).parent().find('td:eq(2)').text();
        // Utilisez une expression régulière pour extraire le nombre entre parenthèses
        var nombre = texte.match(/\((\d+)\)/);
        // Vérifiez si le nombre extrait existe et est supérieur à 1000
        if (nombre && parseInt(nombre[1]) < 1000000) {
            // Coloration de l'élément parent de l'élément td
            $(this).parent().css("background-color", "#ffadde");
            }
        });
    });
      //// Coloration des gros mobs et indication px
      $("#TCREATURES > center > table > tbody > tr").each( function(){
        var nValue = parseInt($(this).find('td').eq(8).text(), 10); // Obtenez la valeur de la colonne N
        if (nValue === 0) {
            $(this).css({
                "font-style": "italic", // Appliquer le style italique à la ligne entière
                "color": "grey" // Changer la couleur du texte en gris
            });
            $(this).find('td a').css("color", "grey"); // Changer la couleur du lien en gris
        } else {
            $(this).css({
                "font-style": "normal", // Réinitialiser le style si la valeur de N n'est pas 0
                "color": "black" // Réinitialiser la couleur du texte
            });
            $(this).find('td a').css("color", "blue"); // Réinitialiser la couleur du lien
        }


        var race = $(this).find('td').eq(4).text();
        if (jQuery.inArray(race, raceGobs) < 0) {
          var tdlevel = $(this).find('td');
          var lvl = parseInt(tdlevel.eq(3).text(), 10);
          if (isNaN(lvl)) return;
          if (lvl > 39) {
            $(this).css("background-color","#f55442")
          } else if (lvl > 29) {
            $(this).css("background-color","#f59c42")
          } else if (lvl > 25) {
            $(this).css("background-color","#f5b342")
          }


            var id = 0;
            var infosMob = $(this).find('a:first').attr('href').match(/javascript:EMV\((\d+)\)/);
            if (infosMob != null) {
                id = parseInt(infosMob[1]);
                if (id < 9999) {
                    // $(this).css("background-color", "#6fcf97"); // Green background for creatures with ID < 9999
                    $(this).find('td').eq(2).css("background-color", "#c791b1"); // Apply green background to the ID cell
                }
            }




      /// création de tresorsData qui récup les trésors dans la vue et est utilisé dans les ordres des suivants
    const tableauTresors = document.getElementById('TOBJETS');

    if (tableauTresors) {
            // Sélection des lignes du tableau
        const lignes = tableauTresors.getElementsByTagName('tr');
        const tresors = [];

            // Parcours de chaque ligne du tableau
        for (let i = 1; i < lignes.length; i++) {
            const colonnes = lignes[i].getElementsByTagName('td');

            // Extraction des données de chaque colonne
            const distance = colonnes[0].textContent;
            const reference = colonnes[1].textContent;
            const nom = colonnes[2].textContent;
            const x = colonnes[3].textContent;
            const y = colonnes[4].textContent;
            const n = colonnes[5].textContent;

            // Stockage des données dans un objet
            const tresorObj = {
                distance,
                reference,
                nom,
                x,
                y,
                n
            };

            // Ajout de l'objet à la liste des trésors
            tresors.push(tresorObj);
        }

            // Stockage des trésors dans localStorage
        localStorage.setItem('tresorsData', JSON.stringify(tresors));
    }



        /// Ajout de l'affichage d'une CDM au clic sur la race
          $(this).find('td').eq(4).css("cursor", "pointer");
          $(this).find('td').eq(4).click(function(evt) {
            evt.preventDefault();

            $("#loader").show();

            var url = "https://gobzilla.incaworld.fr/cdm/"+race+"/"+lvl+"/"+id;
            $.getJSON( url, function( data ) {
              if (data["race"] != undefined) {
                $("#loader").hide();
                $("#cdm").html(
                    "<div class=\"title\">" + data["nom"] + (data["numMob"]?" (n° " + data["numMob"] + ")":"") + "</div>"
                    + "<p>Le monstre fait partie des : " + data["race"] + "</p>"
                    + "<span>Niveau moyen : " + data["niveau"] + "</span>"
                    + "<span>Points de Vie : entre " + data["pvMin"] + " à " + data["pvMax"] + "</span>"
                    + "<span>Dés d'Attaque : entre " + data["attMin"] + " et " + data["attMax"] + "</span>"
                    + "<span>Dés d'Esquive : entre " + data["esqMin"] + " et " + data["esqMax"] + "</span>"
                    + "<span>Dés de Dégât : entre " + data["degMin"] + " et " + data["degMax"] + "</span>"
                    + "<span>Dés de Régénération : entre " + data["regMin"] + " et " + data["regMax"] + "</span>"
                    + "<span>Perception : entre " + data["perMin"] + " et " + data["perMax"] + "</span>"
                    + "<span>Armure Physique : entre " + data["armurePhyMin"] + " et " + data["armurePhyMax"] + "</span>"
                    + "<span>Armure Magique : entre " + data["armureMagMin"] + " et " + data["armureMagMax"] + "</span>"
                    + "<span>Tour : entre " + data["tourMin"] + "h et " + data["tourMax"] + "h</span>"
                    + "<span>Pouvoir : " + data["pouvoir"] + "</span>"
                    + "<span>Créature volante : " + (data["vol"]?"Oui":"Non") + "</span>"
                    + "<span>Attaque à distance : " + (data["distance"]?"Oui":"Non") + "</span>"
                    + "<span>Nombre d'attaques : " + data["nbAttaques"] + "</span>"
                    + "<span>Comportement : " + data["comportement"] + "</span>"
                    + "<span>Intelligence : " + data["intelligence"] + "</span>"
                    + "<span>Vitesse : " + data["vitesse"] + "</span>"
                    + "<span>VLC : " + data["vlc"] + "</span>"
                    + "<span>" + data["magie"] + "</span></br>"
                    + "<b>Moyenne basée sur " + data["nbCdm"] + " CdM</b>");
              } else {
                $("#loader").hide();
                $("#cdm").html("Pas de CDM en stock !");
              }
              $("#cdm").show();
            });
          });

          if (lvlmeute != undefined) {
            var px = Math.max(0, 20+2*(lvl-lvlmeute)+lvl);
            tdlevel.prop('title', px + "px");
          } else {
            tdlevel.prop('title', "Merci de visiter la page meute pour charger le niveau");
          }
        }
      });


     //// fonction filtre creatures dans la vue
    (function() {
        'use strict';

        const table = document.querySelector('#TCREATURES table');

        if (table) {
            const headers = table.querySelectorAll('th');

            headers.forEach(header => {
                if (!header.hasAttribute('colspan')) {
                    header.style.cursor = 'pointer';

                    const arrowUp = document.createElement('span');
                    arrowUp.textContent = ' ▲';
                    arrowUp.className = 'sortIndicator';
                    arrowUp.style.display = 'none';

                    const arrowDown = document.createElement('span');
                    arrowDown.textContent = ' ▼';
                    arrowDown.className = 'sortIndicator';
                    arrowDown.style.display = 'none';

                    header.appendChild(arrowUp);
                    header.appendChild(arrowDown);

                    let ascending = false;

                    // Utilisation de l'attribut title pour l'infobulle
                    header.title = "Cliquer pour classer dans l'ordre";

                    header.addEventListener('click', () => {
                        // reset sort indicators
                        $(".sortIndicator").css("display", 'none');

                        const headerIndex = Array.from(headers).indexOf(header);
                        let rows = Array.from(table.querySelectorAll('tbody tr'));

                        rows.sort((a, b) => {
                            const aValue = a.cells[headerIndex].textContent.trim();
                            const bValue = b.cells[headerIndex].textContent.trim();

                            // La 1ère ligne est toujours en haut
                            if (a.cells[0].textContent.trim().match("^Dist.")) return -1;

                            let result = aValue.localeCompare(bValue, undefined, { numeric: true });

                            if (!ascending) {
                                result *= -1;
                            }

                            return result;
                        });

                        ascending = !ascending;

                        arrowUp.style.display = ascending ? 'none' : 'inline-block';
                        arrowDown.style.display = ascending ? 'inline-block' : 'none';

                        table.querySelector('tbody').innerHTML = '';
                        rows.forEach(row => table.querySelector('tbody').appendChild(row));
                    });
                }
            });
        }
    })();


      //// fonction filtre trésors dans la vue
    (function() {
        'use strict';

        const table = document.querySelector('#TOBJETS table');

        if (table) {
            const headers = table.querySelectorAll('th');

            headers.forEach(header => {
                if (!header.hasAttribute('colspan')) {
                    header.style.cursor = 'pointer';

                    const arrowUp = document.createElement('span');
                    arrowUp.textContent = ' ▲';
                    arrowUp.className = 'sortIndicator';
                    arrowUp.style.display = 'none';

                    const arrowDown = document.createElement('span');
                    arrowDown.textContent = ' ▼';
                    arrowDown.className = 'sortIndicator';
                    arrowDown.style.display = 'none';

                    header.appendChild(arrowUp);
                    header.appendChild(arrowDown);

                    let ascending = false;

                    // Utilisation de l'attribut title pour l'infobulle
                    header.title = "Cliquer pour classer dans l'ordre";

                    header.addEventListener('click', () => {
                        // reset sort indicators
                        $(".sortIndicator").css("display", 'none');

                        const headerIndex = Array.from(headers).indexOf(header);
                        let rows = Array.from(table.querySelectorAll('tbody tr'));

                        rows.sort((a, b) => {
                            const aValue = a.cells[headerIndex].textContent.trim();
                            const bValue = b.cells[headerIndex].textContent.trim();

                            // La 1ère ligne est toujours en haut
                            if (a.cells[0].textContent.trim().match("^Dist.")) return -1;

                            let result = aValue.localeCompare(bValue, undefined, { numeric: true });

                            if (!ascending) {
                                result *= -1;
                            }

                            return result;
                        });

                        ascending = !ascending;

                        arrowUp.style.display = ascending ? 'none' : 'inline-block';
                        arrowDown.style.display = ascending ? 'inline-block' : 'none';

                        table.querySelector('tbody').innerHTML = '';
                        rows.forEach(row => table.querySelector('tbody').appendChild(row));
                    });
                }
            });
        }
    })();



      //// fonction filtre plantes dans la vue
    (function() {
        'use strict';

        const table = document.querySelector('#TPLANTS table');

        if (table) {
            const headers = table.querySelectorAll('th');

            headers.forEach(header => {
                if (!header.hasAttribute('colspan')) {
                    header.style.cursor = 'pointer';

                    const arrowUp = document.createElement('span');
                    arrowUp.textContent = ' ▲';
                    arrowUp.className = 'sortIndicator';
                    arrowUp.style.display = 'none';

                    const arrowDown = document.createElement('span');
                    arrowDown.textContent = ' ▼';
                    arrowDown.className = 'sortIndicator';
                    arrowDown.style.display = 'none';

                    header.appendChild(arrowUp);
                    header.appendChild(arrowDown);

                    let ascending = false;

                    header.addEventListener('click', () => {
                      // reset sort indicators
                      $(".sortIndicator").css("display", 'none');

                      const headerIndex = Array.from(headers).indexOf(header);
                      let rows = Array.from(table.querySelectorAll('tbody tr'));

                      rows.sort((a, b) => {
                          const aValue = a.cells[headerIndex].textContent.trim();
                          const bValue = b.cells[headerIndex].textContent.trim();

                        // La 1ère ligne est toujours en haut
                          if (a.cells[0].textContent.trim().match("^Dist.")) return -1;

                          let result = aValue.localeCompare(bValue, undefined, { numeric: true });

                          if (!ascending) {
                              result *= -1;
                          }

                          return result;
                      });

                      ascending = !ascending;

                      arrowUp.style.display = ascending ? 'none' : 'inline-block';
                      arrowDown.style.display = ascending ? 'inline-block' : 'none';

                      table.querySelector('tbody').innerHTML = '';
                      rows.forEach(row => table.querySelector('tbody').appendChild(row));
                    });
                }
            });
        }
    })();





      //// compteur de créatures
    (function() {
        'use strict';

        function updateRowCount() {
            var table = document.getElementById("TCREATURES");
            var rowCount = table.getElementsByTagName("tr").length - 1;
    $('a[name="CREATURES"]').next().html("Créatures (" + rowCount + " visibles)");
        }

        var observer = new MutationObserver(updateRowCount);
        var target = document.querySelector("#TCREATURES tbody");
        var config = { childList: true, subtree: true };
        observer.observe(target, config);

        updateRowCount();
    })();




      var show2DChecked = window.localStorage.getItem('show2DChecked');
      var displayLieuxChecked = window.localStorage.getItem('displayLieuxChecked');
      var displayPlantesChecked = window.localStorage.getItem('displayPlantesChecked');
      var displayCdmNeeded = window.localStorage.getItem('displayCdmNeededChecked');
      var displayCuisine = window.localStorage.getItem('displayCuisineChecked');
      var displayMiniMobs = window.localStorage.getItem('displayMiniMobs');
      var displayTrees = window.localStorage.getItem('displayTreesChecked');
      var displayFullWidth = window.localStorage.getItem('displayFullWidthChecked');
      var vue2DBuilt = false;
      var extendedLieuxBuilt = false;
      var extendedPlantesBuilt = false;
      var R;



      function showHideVue2d() {
        if($('#ckbDisplay2D').is(":checked")) {
          window.localStorage.setItem('show2DChecked', 1);
          if (!vue2DBuilt) build2DView();
          $("#vue2D").show();
          $("#filterDiv").show();
        } else {
          window.localStorage.setItem('show2DChecked', 0);
          $("#vue2D").hide();
          $("#filterDiv").hide();
        }
      }


      function showHideExtendedLieux() {
        if($('#ckbDisplayLieux').is(":checked")) {
          window.localStorage.setItem('displayLieuxChecked', 1);
          if (!extendedLieuxBuilt) buildExtendedLieux();
          $(".extendedLieu").show();
        } else {
          window.localStorage.setItem('displayLieuxChecked', 0);
          $(".extendedLieu").hide();
        }
      }


        function showHideExtendedPlantes() {
        if($('#ckbDisplayPlantes').is(":checked")) {
          window.localStorage.setItem('displayPlantesChecked', 1);
          if (!extendedPlantesBuilt) buildExtendedPlantes();
          $(".extendedPlante").show();
        } else {
          window.localStorage.setItem('displayPlantesChecked', 0);
          $(".extendedPlante").hide();
        }
      }


      function refreshCdmNeeded() {
        $("#loader").show();
        var urlCdMNeeded = "https://gobzilla.incaworld.fr/mobs/cdm/5";
        $.getJSON( urlCdMNeeded, function( data ) {
          if (data != undefined) {
            window.localStorage.setItem('cdmNeeded', data.monstres);
            window.localStorage.setItem('cdmNeededUpdate', new Date());
          }
          $("#loader").hide();
        });
      }

      function showHideCdmNeeded() {
        if($('#ckbDisplayCdmNeeded').is(":checked")) {
          window.localStorage.setItem('displayCdmNeededChecked', 1);
          var cdmNeededUpdate = new Date(window.localStorage.getItem('cdmNeededUpdate'));
          var delta = (new Date() - cdmNeededUpdate)/1000/60/60/24;
          if (delta > 5) {
            refreshCdmNeeded();
          }
          var cdmNeeded = window.localStorage.getItem('cdmNeeded');
          $.each(cdmNeeded.split(","), function(index, value) {
            $('#TCREATURES td:contains("' + value + '")').closest('tr').find('td:eq(5)').text("CdM manquante !");
          });
        } else {
          window.localStorage.setItem('displayCdmNeededChecked', 0);
          $(".cdmNeeded").removeClass("cdmNeeded");
          $('#TCREATURES td:contains("CdM manquante !")').text("");
        }
      }

      function refreshCuisine() {
        $("#loader").show();
        var urlCuisine = "https://gobzilla.incaworld.fr/mobs/insecte";
        $.getJSON( urlCuisine, function( data ) {
          if (data != undefined) {
            window.localStorage.setItem('cuisine', data.monstres);
            window.localStorage.setItem('cuisineUpdate', new Date());
          }
          $("#loader").hide();
        });
      }

      function showHideCuisine() {
        if($('#ckbDisplayCuisine').is(":checked")) {
          window.localStorage.setItem('displayCuisineChecked', 1);
          var cuisineUpdate = new Date(window.localStorage.getItem('cuisineUpdate'));
          var delta = (new Date() - cuisineUpdate)/1000/60/60/24;
          if (delta > 30) {
            refreshCuisine();
          }
          var cuisine = window.localStorage.getItem('cuisine');
          $.each(cuisine.split(","), function(index, value) {
            $('#TCREATURES td:contains("' + value + '")').parent().addClass("cuisine");
          });
        } else {
          window.localStorage.setItem('displayCuisineChecked', 0);
          $(".cuisine").removeClass("cuisine");
        }
      }

    function showHideMiniMobs() {
        if ($('#ckbDisplayMiniMobs').is(":checked")) {
            window.localStorage.setItem('displayMiniMobs', 1);
            // Suppression des mobs trop nombreux
            $.each(monstreAMasquer, function(index, value) {
                $('#TCREATURES > center > table > tbody > tr > td:contains("' + value + '")').each(function() {
                    var chiffre = parseInt($(this).parent().find('td:first').text());
                    if (chiffre < 2) {
                        $(this).parent().show();
                    } else {
                        $(this).parent().hide();
                    }
                });
            });
        } else {
            window.localStorage.setItem('displayMiniMobs', 0);
            // Affichage de tous les mobs
            $.each(monstreAMasquer, function(index, value) {
                $('#TCREATURES > center > table > tbody > tr > td:contains("' + value + '")').parent().show();
            });
        }
    }

        function showHideTrees() {
        if($('#ckbDisplayTrees').is(":checked")) {
          window.localStorage.setItem('displayTreesChecked', 1);
          // Suppression des arbres
          $.each(ArbresAMasquer, function(index, value) {
            $('#TLIEUX > center > table > tbody > tr > td:contains("' + value + '")').parent().hide();
          });
        } else {
          window.localStorage.setItem('displayTreesChecked', 0);
          $.each(ArbresAMasquer, function(index, value) {
            $('#TLIEUX > center > table > tbody > tr > td:contains("' + value + '")').parent().show();
          });
        }
      }

      function showVueFullWidth() {
        if($('#ckbDisplayFullWidth').is(":checked")) {
          window.localStorage.setItem('displayFullWidthChecked', 1);
          // Vue en pleine largeur
        } else {
          window.localStorage.setItem('displayFullWidthChecked', 0);
          // Vue normale
        }
      }



      function refreshListes() {
        refreshCuisine();
        showHideCuisine();
        refreshCdmNeeded();
        showHideCdmNeeded();
      }

      // Après chargement de la page, lancement des enhancements
      $( document ).ready(function() {

        // Full width
        if (displayFullWidth == 1) {
          $('#ckbDisplayFullWidth').prop( "checked", displayFullWidth );
        }
        showVueFullWidth();

        // Mini mobs
        if (displayMiniMobs == 1) {
          $('#ckbDisplayMiniMobs').prop( "checked", displayMiniMobs );
        }
        showHideMiniMobs();

        // showhide trees
            if (displayTrees == 1) {
          $('#ckbDisplayTrees').prop( "checked", displayTrees );
        }
        showHideTrees();



        // Liste des lieux étendue
        if (displayLieuxChecked == 1) {
          $('#ckbDisplayLieux').prop( "checked", displayLieuxChecked );
        }
        showHideExtendedLieux();


        //Liste des plantes étendue
        if (displayPlantesChecked == 1) {
          $('#ckbDisplayPlantes').prop( "checked", displayPlantesChecked );
        }
        showHideExtendedPlantes();

        // Vue 2D
        if (show2DChecked == 1) {
          $('#ckbDisplay2D').prop( "checked", show2DChecked );
        }
        showHideVue2d();


        // CdM manquantes
        if (displayCdmNeeded == 1) {
          $('#ckbDisplayCdmNeeded').prop( "checked", displayCdmNeeded );
        }
        showHideCdmNeeded();

        // A cuisiner
        if (displayCuisine == 1) {
          $('#ckbDisplayCuisine').prop( "checked", displayCuisine );
        }
        showHideCuisine();

        $('#btnRefresh').click(function(evt) {
          evt.preventDefault();
          $("#btnRefresh").val("...");
          refreshListes();
          $("#btnRefresh").val("Done !");
        });

      });

      var cells = {};
      var niveau = 0;
      var _X=0, _Y=0, _N=0;

      var div = $("<div id=\"vue2D\"></div>");
      div.insertBefore($("form[action*='newMail.php']"));


      //=======================================================================
      // Filters
      //=======================================================================
    var prediv = $("<div id=\"preFilter\"></div>");
    prediv.css({
      'background-color': 'gainsboro',  // Couleur de fond sombre
      'border': '2px solid black',     // Bordure noire
      'padding': '10px',               // Espacement intérieur
      'margin': '10px'                 // Marge extérieure
    });


    var select = document.createElement('select');
    select.id = 'lvlherbo';
    select.innerHTML = `
      <option value="1.5">A</option>
      <option value="2">C</option>
      <option value="2.5">M</option>
      <option value="3">GM</option>`;
    prediv.append(select);
    prediv.append("</br>");
    prediv.insertBefore(div);
    prediv.append($('<label />', { 'for': 'ckbDisplay2D', text: 'Vue 2D', title: 'affiche une vue 2d des éléments qui vous entoure' }));
    prediv.append($("<input type=\"checkbox\" id=\"ckbDisplay2D\" title=\"affiche une vue 2d des éléments qui vous entoure\" name=\"ckbDisplay2D\" class=\"ckbFilter\" >"));
    prediv.append($('<label />', { 'for': 'ckbDisplayLieux', text: '   Lieux étendus', title: 'affiche tous les lieux déja connus hors de votre vue' }));
    prediv.append($("<input type=\"checkbox\" id=\"ckbDisplayLieux\" title=\"affiche tous les lieux déja connus hors de votre vue\" name=\"ckbDisplayLieux\" class=\"ckbFilter\" >"));
    prediv.append($('<label />', { 'for': 'ckbDisplayPlantes', text: '   Plantes étendues', title: 'affiche toutes les plantes déja connues hors de votre vue, selectionner votre niveau herboriste, il sera enregistré' }));
    prediv.append($("<input type=\"checkbox\" id=\"ckbDisplayPlantes\" title=\"affiche toutes les plantes déja connues hors de votre vue\" name=\"ckbDisplayPlantes\" class=\"ckbFilter\" >"));
    prediv.append($('<label />', { 'for': 'ckbDisplayCdmNeeded', text: '   CdM manquantes', title: 'permet de savoir quel monstres sont manquants dans la base de données des CdM' }));
    prediv.append($("<input type=\"checkbox\" id=\"ckbDisplayCdmNeeded\" title=\"permet de savoir quel monstres sont manquants dans la base de données des CdM\" name=\"ckbDisplayCdmNeeded\" class=\"ckbFilter\" >"));
    prediv.append($('<label />', { 'for': 'ckbDisplayCuisine', text: '   Mobs à cuisiner', title: 'met en surbrillance les monstres les + efficaces pour la cuisine' }));
    prediv.append($("<input type=\"checkbox\" id=\"ckbDisplayCuisine\" title=\"met en surbrillance les monstres les + efficaces pour la cuisine\" name=\"ckbDisplayCuisine\" class=\"ckbFilter\" >"));
    prediv.append("</br>");
    prediv.append($('<label />', { 'for': 'ckbDisplayMiniMobs', text: '   Assainir la vue', title: 'Enlever de la vue (sauf a moins de 2 cases) tous les petits monstres qui poluent la vue' }));
    prediv.append($("<input type=\"checkbox\" id=\"ckbDisplayMiniMobs\" title=\"masquer les tout petits monstres (lémures, larbins ..)\" name=\"ckbDisplayMiniMobs\" class=\"ckbFilter\" >"));
    prediv.append($('<label />', { 'for': 'ckbDisplayTrees', text: '   Masquer Arbres.', title: 'masque les arbres' }));
    prediv.append($("<input type=\"checkbox\" id=\"ckbDisplayTrees\" title=\"masque les arbres\" name=\"ckbDisplayTrees\" class=\"ckbFilter\" >"));
    prediv.append($('<label />', { 'for': 'ckbDisplayFullWidth', text: '   Vue pleine largeur', title: 'pour les grandes vue. Permet d élargir la vue 2d pour une meilleure visualisation' }));
    prediv.append($("<input type=\"checkbox\" id=\"ckbDisplayFullWidth\" title=\"pour les grandes vue. Permet d'élargir la vue 2d pour une meilleure visualisation\" name=\"ckbDisplayFullWidth\" class=\"ckbFilter\" >"));
    prediv.append("</br>");
    prediv.append($('<label />', { 'for': 'monsterLevelMin', text: 'Filtrer Lvl  ', title: 'Filtrer les monstres par niveau' }));
    var levelInputMin = $("<input type='number' id='monsterLevelMin' placeholder='Min' min='0' max='100' style='width: 60px;'>");
    prediv.append(levelInputMin);
    var levelInputMax = $("<input type='number' id='monsterLevelMax' placeholder='Max' min='0' max='100' style='width: 60px;'>");
    prediv.append(levelInputMax);
    var filterButton = $("<button id='applyFilter'>Filtrer</button>");
    prediv.append(filterButton);
    prediv.append("</br>");
    prediv.append("</br>");
    prediv.append($("<input type=\"button\" id=\"btnRefresh\" name=\"btnRefresh\" value=\"Rafraîchir les listes\">"));
    prediv.append("</br>");
    prediv.append($('<label />', { 'for': 'ckbFetchCSV', text: '   Vue DeathMetal', title: 'profitez de la vue de DeathMetal. Attention, utiliser avec parcimonie !' }));
    prediv.append($("<input type=\"checkbox\" id=\"ckbFetchCSV\" title=\"cliquez pour faire apparaitre la vue ici. Pour l'enlever, décocher et rafraichir la page. Attention, NE PAS ABUSER (max 1 fois par jour)\" name=\"ckbFetchCSV\" class=\"ckbFilter\" >"));


      // filtres de la vue 2d
      var filterDiv = $("<div id=\"filterDiv\"></div>");
      filterDiv.insertBefore(div);
      filterDiv.append($('<label />', { 'for': 'ckbNiveau', text: 'Même niveau' }));
      filterDiv.append($("<input type=\"checkbox\" id=\"ckbNiveau\" name=\"ckbNiveau\" class=\"ckbFilter\" >"));
      filterDiv.append($('<label />', { 'for': 'ckbObject', text: 'Trésor' }));
      filterDiv.append($("<input type=\"checkbox\" id=\"ckbObject\" name=\"ckbObject\" class=\"ckbFilter\" checked=\"checked\" >"));
      filterDiv.append($('<label />', { 'for': 'ckbMonster', text: 'Monstre' }));
      filterDiv.append($("<input type=\"checkbox\" id=\"ckbMonster\" name=\"ckbMonster\" class=\"ckbFilter\" checked=\"checked\" >"));
      filterDiv.append($('<label />', { 'for': 'ckbPlant', text: 'Plante' }));
      filterDiv.append($("<input type=\"checkbox\" id=\"ckbplants\" name=\"ckbplants\" class=\"ckbFilter\" checked=\"checked\" >"));
      filterDiv.append($('<label />', { 'for': 'ckbPlace', text: 'Lieu' }));
      filterDiv.append($("<input type=\"checkbox\" id=\"ckbPlace\" name=\"ckbPlace\" class=\"ckbFilter\" checked=\"checked\" >"));
      filterDiv.append($('<label />', { 'for': 'ckbBigMonsters', text: 'Gros monstres', title: 'afficher que les monstres sup à 40' }));
      filterDiv.append($("<input type=\"checkbox\" id=\"ckbBigMonsters\" name=\"ckbBigMonsters\" class=\"ckbFilter\" >"));


      //=======================================================================
      // Filtre Herbo
      //=======================================================================

      // Cache initialement le niveau herbo
    select.style.display = 'none';

    // Fonction pour contrôler la visibilité du niveau herbo
    function toggleLvlHerboVisibility() {

      if ($('#ckbDisplayPlantes').is(':checked')) {
        select.style.display = 'block';
        $('#lvlherbo').css('display', 'inline-block');
      } else {
        select.style.display = 'none';
        $('#lvlherbo').css('display', 'none');
      }
    }

    $('#ckbDisplayPlantes').change(function() {
      toggleLvlHerboVisibility();
    });

    toggleLvlHerboVisibility();



      //=======================================================================
      // Fonction pour filtrer les monstres dans le tableau et la vue 2D
      //=======================================================================
    function applyMonsterFilter(minLevel, maxLevel) {
        // Filtrer dans le tableau seulement si minLevel et maxLevel sont spécifiés
        if (!isNaN(minLevel) && !isNaN(maxLevel)) {
            $("#TCREATURES > center > table > tbody > tr").each(function() {
                var tdLevel = $(this).find('td').eq(3);
                var lvl = parseInt(tdLevel.text(), 10);
                if (!isNaN(lvl)) {
                    if (lvl >= minLevel && lvl <= maxLevel) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
            });
        } else {
            // Si minLevel ou maxLevel n'est pas spécifié, afficher tous les éléments
            showHideMiniMobs();
        }

        // Sauvegarder les valeurs dans le localStorage
        localStorage.setItem('monsterLevelMin', minLevel);
        localStorage.setItem('monsterLevelMax', maxLevel);
    }

    // Charger les valeurs depuis le localStorage et appliquer le filtre au chargement de la page
    $(document).ready(function() {
        var savedMinLevel = localStorage.getItem('monsterLevelMin');
        var savedMaxLevel = localStorage.getItem('monsterLevelMax');

        if (savedMinLevel !== null && savedMaxLevel !== null) {
            levelInputMin.val(savedMinLevel);
            levelInputMax.val(savedMaxLevel);
            applyMonsterFilter(parseInt(savedMinLevel, 10), parseInt(savedMaxLevel, 10));
        }

    });

    // Gestion du clic sur le bouton de filtrage
    filterButton.on('click', function() {
            var minLevel = parseInt(levelInputMin.val(), 10);
            var maxLevel = parseInt(levelInputMax.val(), 10);
            applyMonsterFilter(minLevel, maxLevel);
        });


      //=======================================================================
     ///  masquer via une petite fleche tout ce beau monde
      //=======================================================================

    var isPreFilterVisible = localStorage.getItem('isPreFilterVisible') === 'true'; // Lire l'état depuis localStorage
    // Créez un div contenant la flèche pour afficher/masquer preFilter
    var toggleDiv = $("<div id=\"togglePreFilter\" style=\"cursor: pointer; font-size: 10px; color: black;\">▼ Ouvrir les Filtres</div>");
    // Ajoutez le div avant prediv
    toggleDiv.insertBefore(prediv);
    // Fonction pour mettre à jour l'état et le texte du div
    function updateToggleDiv() {
        if (isPreFilterVisible) {
            prediv.show(); // Afficher preFilter
            toggleDiv.html('▼ Masquer les filtres'); // Affiche la flèche vers le bas (▼)
        } else {
            prediv.hide(); // Masquer preFilter
            toggleDiv.html('&#9658; Ouvrir les filtres'); // Affiche la flèche de droite (→)
        }
    }

    // Définissez un gestionnaire d'événements pour le div
    toggleDiv.on('click', function() {
        isPreFilterVisible = !isPreFilterVisible; // Inverse l'état
        updateToggleDiv();
        // Sauvegarde l'état dans localStorage
        localStorage.setItem('isPreFilterVisible', isPreFilterVisible);
    });

    // Assurez-vous que preFilter est initialement visible
    updateToggleDiv();



      //=======================================================================
      // Construction de la liste étendue des lieux sur la base d'une API externe
      //=======================================================================
      function buildExtendedLieux() {
        var reflieux = new Array();
        $("#TLIEUX > table > tbody > tr").each( function(){
          reflieux.push($(this).find('td').eq(1).text());
        });

        var url = "https://gobzilla.incaworld.fr/lieux/"+_X+"/"+_Y+"/"+_N;
        $.getJSON( url, function( data ) {
          // alert(JSON.stringify(data));
          $.each( data, function( key, val ) {
            if (( reflieux.indexOf(val["id"]) == -1 ) && (val["id"] !== -1))
            {
              var row = "<tr bgcolor=\"#E0E0E0\" class=\"extendedLieu\"><td>" + val["distance"] ;
              row += "</td><td>" + val["id"] ;
              row += "</td><td>" + val["nom"] ;
              row += "</td><td>" + val["type"] ;
              row += "</td><td>" + val["x"] ;
              row += "</td><td>" + val["y"] ;
              row += "</td><td>" + val["z"] ;
              row += "</td></tr>";
              $(row).insertAfter("#TLIEUX table tr:last");
            }
            });
        });

        extendedLieuxBuilt = true;
      }


      //=======================================================================
      // Construction de la liste étendue des plantes sur la base d'une API externe
      //=======================================================================
      var text = $("ul:contains('Ma vue peut porter')").text();
      var matches = text.match(/Ma vue peut porter à (\d+) cases horizontalement et (\d+) verticalement/);

      if (matches) {
        var perh = matches[1]; // PER max (X Y)
        var perv = matches[2]; // PER max (N)
        var herbomax = perh * 1.5;
        var herbomin = +perh +1;

        // Récupérez la liste déroulante
        var lvlherbo = $('#lvlherbo');

        // Ajoutez un gestionnaire d'événements pour écouter les changements de la liste déroulante
        lvlherbo.on('change', function() {
            var xfactor = parseFloat(lvlherbo.val()); // Obtenez la valeur sélectionnée en tant que nombre
            var herbomax = perh * xfactor;
            var herbomin = +perh + 1;
           window.localStorage.setItem('xfactor', xfactor);
           window.localStorage.setItem('herbomax', herbomax);
           console.log("Nouvelle valeur de herbomax : " + herbomax);
            console.log("Nouvelle valeur de herbomin : " + herbomin);
        });

        // Lorsque la page est chargée, vérifiez s'il y a des valeurs précédemment enregistrées et utilisez-les si elles existent
        var storedXFactor = window.localStorage.getItem('xfactor');
        var storedHerboMax = window.localStorage.getItem('herbomax');

        if (storedXFactor) {
            lvlherbo.val(storedXFactor); // Mettez à jour la liste déroulante avec la valeur précédemment enregistrée
        }

        if (storedHerboMax) {
            // Utilisez la valeur précédemment enregistrée pour herbomax
            herbomax = parseFloat(storedHerboMax);
            console.log("Utilisation de la valeur précédemment enregistrée pour herbomax : " + herbomax);
        }

        console.log("portée herboriser: " + herbomax);
        console.log("limite mini d'herboriser: " + herbomin);
      } else {
        console.log("Aucune correspondance trouvée.");
      }

      function buildExtendedPlantes() {
          var refplantes = new Array();
          $("#TPLANTS> table > tbody > tr").each(function() {
              refplantes.push($(this).find('td').eq(1).text());
          });

         var url = "https://gobzilla.incaworld.fr/plantes";
          $.ajaxSetup({
              async: false
          });
          $.getJSON(url, function(data) {
              // alert(JSON.stringify(data));
              $.each(data, function(key, val) {
                  var dist = Math.max(
                      Math.abs(val["x"] - _X),
                      Math.abs(val["y"] - _Y),
                      Math.abs(val["z"] - _N)
                  );

                  if (refplantes.indexOf(val["ID"]) == -1 && val["ID"] !== -1) {
                      var bgColor =
                          dist >= herbomin && dist <= herbomax
                              ? 'background-color: #93d278;'
                              : 'background-color: #E0E0E0;';
                      var row =
                          "<tr style='" +
                          bgColor +
                          "' class='extendedPlante'><td>" +
                          dist;
                      row += "</td><td>" + val["id"];
                      row += "</td><td>" + val["nom"] + " (" + val["espece"] + ")";
                      row += "</td><td>" + val["x"];
                      row += "</td><td>" + val["y"];
                      row += "</td><td>" + val["z"];
                      row += "</td></tr>";
                      $(row).insertAfter("#TPLANTS table tr:last");
                  }
              });
          });
          $.ajaxSetup({
              async: true
          });
          extendedPlantesBuilt = true;
      }


      //=====================================================================================================
      // Fonction pour récupérer la vue de deathmétal depuis les scripts publics http://ie.gobland.fr
      //=====================================================================================================


    function fetchCSV(url) {
      return fetch(url)
        .then(response => response.text())
        .then(csvData => parseCSV(csvData));
    }

    // Fonction pour convertir les données CSV en tableau
    function parseCSV(csvData) {
      // Convertir les données CSV en tableau
      const rows = csvData.split('\n').slice(1); // Ignorer la première ligne d'en-têtes
      const table = rows.map(row => row.split(','));

      // Créer le tableau HTML avec les en-têtes spécifiés
      const tableElement = document.createElement('table');
      const headerRow = document.createElement('tr');

      // En-têtes spécifiés
      const headers = ['Catégorie' , 'Dist.', 'Id', 'Nom', 'Niveau', 'Type' , 'Clan', 'X', 'Y', 'N', 'Z'];

      // Ajouter les en-têtes au tableau
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });

      // Ajouter la ligne d'en-tête au tableau
      tableElement.appendChild(headerRow);

      // Ajouter les données CSV au tableau
      table.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
          const td = document.createElement('td');
          // Nettoyer les guillemets autour des mots
          const cleanedCell = cell.replace(/"/g, '');
          td.textContent = cleanedCell;
          tr.appendChild(td);
        });
        tableElement.appendChild(tr);
      });

      // Trouver l'élément cible pour insérer le tableau
      const targetElement = document.evaluate(
        "/html/body/div[3]/div/table/tbody/tr[2]/td[2]/center[3]/table/tbody",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;


       // Modifier le texte de l'élément cible
      if (targetElement) {
        targetElement.textContent = "Vue Death";
        targetElement.style.fontSize = '24px'; // Larger font size
        targetElement.style.fontWeight = 'bold'; // Bold style
        targetElement.setAttribute("onclick", "javascript:retract('VUEDEATH');return false;");
      } else {
        console.error('Élément cible non trouvé.');
      }

      // Insérer le tableau en dessous de l'élément cible
      if (targetElement) {
        targetElement.parentNode.parentNode.appendChild(tableElement);
      } else {
        console.error('Élément cible non trouvé.');
      }
    }

    // Fonction pour activer ou désactiver fetchCSV en fonction de l'état de la case à cocher
    function toggleFetchCSV() {
      const tableElement = document.querySelector('#TPLANTS');

      if ($('#ckbFetchCSV').is(":checked")) {
        fetchCSV(csvURL);
        // Afficher le tableau s'il existe
        if (tableElement) {
          tableElement.style.display = 'block';
        }
      } else {
        // Actions à effectuer lors de la désactivation de la récupération des données CSV
        // Cacher le tableau s'il existe et arrêter la récupération
        if (tableElement) {
          tableElement.style.display = 'none';
        }
        // Ajoutez ici d'autres actions pour arrêter la récupération des données CSV si nécessaire
      }
    }

    // Récupération de la case à cocher par son ID
    const ckbFetchCSV = document.getElementById('ckbFetchCSV');

    // Écouteur d'événement pour détecter le changement d'état de la case à cocher
    ckbFetchCSV.addEventListener('change', toggleFetchCSV);

    // Appeler toggleFetchCSV au chargement de la page pour initialiser le comportement
    toggleFetchCSV();

    // URL du CSV à récupérer
    const csvURL = 'http://ie.gobland.fr/IE_Vue.php?id=330&passwd=30fae3bb4bf976a5cd29628102d42fd2&sep=,';

    // Appeler la fonction fetchCSV avec l'URL
    //fetchCSV(csvURL);




      //=======================================================================
      // VUE 2D. Piqué à Stéphane Beauquis (Extention Chrome)
      // Grab the data for Vue2D
      //=======================================================================



    	var _terre="", _PX=0, _PY=0;

    	// Get the name and num of the actual goblin
    	var nom = $('#identite').attr("nom");
    	var num = $('#identite').attr("num");

    	// Get the actual position and view size
    	$('li').each(function(){
    		// cache jquery var
    		var current = $(this);

    		var matches = current.text().match(/Ma position actuelle est : X = ([\-0-9]+), Y = ([\-0-9]+), N = ([\-0-9]+)([^\-]+)/);
    		if (matches) {
    			_X = parseInt(matches[1]);
    			_Y = parseInt(matches[2]);
    			_N = parseInt(matches[3]);
    			niveau = _N;
    			_terre = matches[4];
    		}

    		matches = current.text().match(/L'affichage est limité à (\d+) cases horizontalement et (\d+) verticalement/);
    		if (matches) {
    			_PX = (parseInt(matches[1])>50)?50:parseInt(matches[1]);
    			_PY = (parseInt(matches[2])>20)?20:parseInt(matches[2]);
    		}
    	});

      if (displayFullWidth == 1) {
        var width = 1800, height = 1800, leftgutter = 20, bottomgutter = 30, coordOffset = 1790;
        var tailleTxt = "16px sans-serif";
        $("#content").css("width" , "2000px");
        $("html > body > div").css("left" , "1800x");
      } else {
        var width = 630, height = 650, leftgutter = 30, bottomgutter = 20, coordOffset = 1190;
        var tailleTxt = "12px sans-serif";
      }

      var offset = 40,
          nbCase = _PX * 2 + 1,
          carre = Math.floor((width-offset-5) / nbCase),
          txt = {"font": '10px Fontin-Sans, Arial', stroke: "none", fill: "#000"};

    var alllieux = {};

    // Compute grid limits
    var xmin = _X - _PX,
        ymin = _Y - _PX,
        ymax = _Y + _PX,
        Dx = xmin * -1,
        Dy = ymin * -1;

    // Initialisation de tooltipOpen comme un objet
    var tooltipOpen = {};

    // Fonction pour attacher les gestionnaires d'événements des tooltips
    function attachTooltipEvents(st, key) {
        if (st[0]) {
            st[0].style.cursor = "pointer";
            var isClicked = false;

            // Gestion du clic
            st[0].onclick = function (e) {
                e.stopPropagation(); // Évite la propagation de l'événement aux parents
                if (tooltipOpen[key]) {
                    closeTooltip(key);
                } else {
                    openTooltip(key);
                    isClicked = true;
                }
            };

            // Gestion du double-clic
            st[0].ondblclick = function (e) {
                e.stopPropagation();
                if (isClicked) {
                    closeTooltip(key);
                    isClicked = false;
                }
            };

            // Gestion du survol
            st[0].onmouseover = function () {
                if (!tooltipOpen[key] && !isClicked) {
                    closeTooltips(); // Fermer toutes les tooltips ouvertes
                    openTooltip(key);
                }
            };

            st[0].onmouseout = function (e) {
                var target = e.relatedTarget || e.toElement;
                if (!isClicked && (!target || target !== st[0])) {
                    closeTooltip(key);
                }
            };

            // Gestion du clic droit
            st[0].oncontextmenu = function (e) {
                e.preventDefault(); // Empêche l'ouverture du menu contextuel par défaut

                // Copie du contenu de la tooltip dans le presse-papiers
                if (tooltipOpen[key]) {
                    var tooltipContent = compute_text(key);

                    // Méthode alternative pour copier le texte
                    var tempInput = document.createElement('textarea');
                    tempInput.style.position = 'absolute';
                    tempInput.style.left = '-9999px';
                    tempInput.value = tooltipContent;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    try {
                        var successful = document.execCommand('copy');
                        var msg = successful ? 'copié dans le presse-papiers' : 'Échec de la copie du contenu de la tooltip';
                        alert(msg);
                    } catch (err) {
                        console.error('Erreur lors de la copie du texte : ', err);
                    }
                    document.body.removeChild(tempInput);
                } else {
                    alert('Aucune tooltip ouverte pour copier le contenu');
                }
            };
        }
    }

    function initializeTooltips() {
        for (var key in alllieux) {
            (function (st, key) {
                attachTooltipEvents(st, key);
            })(alllieux[key], key);
        }
    }


function openTooltip(key) {
    if (key in alllieux && key in cells) { // Vérification importante
        var st = alllieux[key];
        if (st && st[0]) {
            var x = cells[key].x;
            var y = cells[key].y;

            var tic = "";
            tic += (y >= (Math.floor(nbCase / 2)) * carre) ? "bottom" : "top";
            tic += (x > (Math.floor(nbCase / 2)) * carre) ? "left" : "right";

            var s = compute_text(key);
            draw_tooltip(st[0], 1, s, x, y, carre, tic);

            tooltipOpen[key] = true; // Utilisez tooltipOpen si nécessaire
        }
    }
}

    function closeTooltip(key) {
        var st = alllieux[key];
        if (st[0] && tooltipOpen[key]) {
            draw_tooltip(st[0], 0);
            tooltipOpen[key] = false;
        }
    }

    function closeTooltips() {
        for (var k in tooltipOpen) {
            if (tooltipOpen[k]) {
                closeTooltip(k);
            }
        }
    }

// Gestion des changements de filtre
$("input.ckbFilter").change(function () {
    showVueFullWidth();
    showHideMiniMobs();
    showHideTrees();
    showHideVue2d();
    showHideExtendedLieux();
    showHideExtendedPlantes();
    showHideCdmNeeded();
    showHideCuisine();

    var showBigMonsters = $('input[name=ckbBigMonsters]').is(':checked');

    for (var key in cells) {
        var x = cells[key].x;
        var y = cells[key].y;

        var mapping = "i" + getMapping(key, showBigMonsters) + ".src";

        if (alllieux[key]) {
            alllieux[key].remove();

            // Supprimer de cells si la cellule est vide après filtrage
            var mapping = getMapping(key, showBigMonsters); // Recalculer mapping après suppression
            if (mapping === "0000") { // Adaptez "0000" si nécessaire
                delete cells[key];
            }
        }

        if (mapping in images) { // Vérifier si l'image existe
            alllieux[key] = R.image(images[mapping], x, y, carre - 1, carre - 1);

            // Attacher les gestionnaires d'événements pour les tooltips
            (function (st, key) {
                st[0].onload = function () {
                    attachTooltipEvents(st, key);
                };
            })(alllieux[key], key);
        }


    }
});

    // Appeler initializeTooltips lors du chargement initial de la page
    $(document).ready(function() {
        initializeTooltips();
    });




      // Images
      //ancienne adresse $("<img src=\"http://images.gobland.fr/addons/GGVue2D/0001.jpg\" id=\"i0001\" style=\"display:none;\" />").insertBefore(div);

      $("<img src=\"https://i.ibb.co/Dz9gDV3/0001.png\" id=\"i0001\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/8P46Rjy/0010.png\" id=\"i0010\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/QcGCGDb/0011.png\" id=\"i0011\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/KwzFZvN/0100.png\" id=\"i0100\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/XZjcdh7/0101.png\" id=\"i0101\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/S56vt5R/0110.png\" id=\"i0110\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/s1Jtrnk/0111.png\" id=\"i0111\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/N3WcT1f/1000.png\" id=\"i1000\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/PNvwHwZ/1001.png\" id=\"i1001\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/vwcwq8y/1010.png\" id=\"i1010\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/n6L9kYJ/1011.png\" id=\"i1011\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/yFrybj2/1100.png\" id=\"i1100\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/44QQsYw/1101.png\" id=\"i1101\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/58Y158g/1110.png\" id=\"i1110\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/wzsbGdL/1111.png\" id=\"i1111\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/hRDDnZM/1200.png\" id=\"i1200\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/gdm3cNW/1201.png\" id=\"i1201\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/zrwHfBK/1210.png\" id=\"i1210\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/fC7GWvd/1211.png\" id=\"i1211\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/LxnJvjS/0200.png\" id=\"i0200\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/WWDrSHy/0201.png\" id=\"i0201\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/T4FnVMk/0210.png\" id=\"i0210\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/wgHgjjC/0211.png\" id=\"i0211\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/9ZKxpfP/1300.png\" id=\"i1300\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/C6KwVnJ/1301.png\" id=\"i1301\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/NFZVP34/1310.png\" id=\"i1310\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/Sd2KRDg/0300.png\" id=\"i0300\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/yhmsDKs/0301.png\" id=\"i0301\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/r5P0BPV/0310.png\" id=\"i0310\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/3Wnk7zT/0311.png\" id=\"i0311\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/61rWLLL/0400.png\" id=\"i0400\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/vxCmWFw/0401.png\" id=\"i0401\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/tczccQC/0410.png\" id=\"i0410\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/mGq9y8f/0411.png\" id=\"i0411\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/FnxBk2g/1410.png\" id=\"i1410\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/ZXZQxht/1411.png\" id=\"i1411\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/kSrPcdd/1401.png\" id=\"i1401\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/T8y0bM2/1400.png\" id=\"i1400\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/FnxBk2g/1410.png\" id=\"i1410\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/tJ8jHpq/0500.png\" id=\"i0500\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/WFWVSF5/0501.png\" id=\"i0501\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/JtSNYrd/0510.png\" id=\"i0510\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/gdKT4Ph/0511.png\" id=\"i0511\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/FX99SN7/1500.png\" id=\"i1500\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/KWSLbzc/1501.png\" id=\"i1501\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/9212GsW/1510.png\" id=\"i1510\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/qx85SyM/1511.png\" id=\"i1511\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/0qyL5mX/0600.png\" id=\"i0600\" style=\"display:none;\" />").insertBefore(div);

      $("<img src=\"https://i.ibb.co/f9gzMtm/0601.png\" id=\"i0601\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/FYjyxXh/0610.png\" id=\"i0610\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/jv47Q2W/0611.png\" id=\"i0611\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/R7Dwjxy/1600.png\" id=\"i1600\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/Dpksj9V/1601.png\" id=\"i1601\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/mhcfSqt/1610.png\" id=\"i1610\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/d0rb5QW/1611.png\" id=\"i1611\" style=\"display:none;\" />").insertBefore(div);

      $("<img src=\"https://i.ibb.co/SXbmrNws/1701.png\" id=\"i1701\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/5XtTZS5V/0710.png\" id=\"i1710\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/N6c76tnC/1711.png\" id=\"i1711\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/GQ0BvM0g/0700.png\" id=\"i0700\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/5g3Xr5Q8/0701.png\" id=\"i0701\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/kspdj1kv/0711.png\" id=\"i0711\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/4Zn39Jq5/1700.png\" id=\"i1700\" style=\"display:none;\" />").insertBefore(div);
      $("<img src=\"https://i.ibb.co/5XtTZS5V/0710.png\" id=\"i0710\" style=\"display:none;\" />").insertBefore(div);










     var images = {

    "0001": i0001.src,
    "0010": i0010.src,
    "0011": i0011.src,
    "0100": i0100.src,
    "0101": i0101.src,
    "0110": i0110.src,
    "0111": i0111.src,
    "1000": i1000.src,
    "1001": i1001.src,
    "1010": i1010.src,
    "1011": i1011.src,
    "1100": i1100.src,
    "1101": i1101.src,
    "1110": i1110.src,
    "1111": i1111.src,
    "1200": i1200.src,
    "1201": i1201.src,
    "1210": i1210.src,
    "1211": i1211.src,
    "0200": i0200.src,
    "0201": i0201.src,
    "0210": i0210.src,
    "0211": i0211.src,
    "1300": i1300.src,
    "1301": i1301.src,
    "1310": i1310.src,
    "0300": i0300.src,
    "0301": i0301.src,
    "0310": i0310.src,
    "0311": i0311.src,
    "0400": i0400.src,
    "0401": i0401.src,
    "0410": i0410.src,
    "0411": i0411.src,
    "1400": i1400.src,
    "1401": i1401.src,
    "1410": i1410.src,
    "1411": i1411.src,
    "0500": i0500.src,
    "0501": i0501.src,
    "0510": i0510.src,
    "0511": i0511.src,
    "1500": i1500.src,
    "1501": i1501.src,
    "1510": i1510.src,
    "1511": i1511.src,
    "0600": i0600.src,
    "0601": i0601.src,
    "0610": i0610.src,
    "0611": i0611.src,
    "1600": i1600.src,
    "1601": i1601.src,
    "1610": i1610.src,
    "1611": i1611.src,
    "1700": i1700.src,
    "1701": i1701.src,
    "1710": i1710.src,
    "1711": i1711.src,
    "0700": i0700.src,
    "0701": i0701.src,
    "0710": i0701.src,
    "0711": i0711.src
};

      //initialisation de la vue2d
      //=============================================================
      //  D r a w
      //=============================================================
      function build2DView() {
        Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
          color = color || "#000";
          var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
              rowHeight = h / hv,
              columnWidth = w / wv;
          for (var i = 1; i < hv; i++) {
              path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
          }
          for (i = 1; i < wv; i++) {
              path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
          }
          return this.path(path.join(",")).attr({stroke: color});
        };



        R = Raphael("vue2D", width, height);

        // Draw the grid
        R.drawGrid(offset, offset, nbCase*carre, nbCase*carre, nbCase, nbCase, "#000");

        // Draw legend for X-axis and Y-axis
        for( var i = 0 ; i < nbCase ; i++ ) {
          // X coordinates top/bottom
          R.text( Math.round(offset+(i+.5)*carre), 10, (xmin+i).toString() ).attr(txt);
          R.text( Math.round(offset+(i+.5)*carre), coordOffset, (xmin+i).toString() ).attr(txt);

          // Y coordinates
          R.text( 10, Math.round(offset+(i+.5)*carre), (ymax-i).toString() ).attr(txt);
        }

  // Add to the list the current Goblin
    x = _PX * carre + offset + 1;
    y = _PX * carre + offset + 1;
    var key = (x + Dx) + Math.abs(y + Dy) * nbCase + 1;
    cells[key] = { x: x, y: y, realx: _X, realy: _Y };
    cells[key][_N] = {
        gob: [nom + " (" + num + ")\n"],
        monster: [], violetMonster: [], redMonster: [], orangeMonster: [], yellowMonster: [],
        place: [], object: [], plant: [], mechanicalCreature: []
    };

 var creatures = $('#TCREATURES').find("table");
$("tbody tr", creatures).each(function (index, tr) {
    var lines = $('td', tr).map(function (index, td) {
        return $(td).text();
    });

    if (typeof lines[0] != "undefined") {
        x = (_PX + parseInt(lines[6]) - _X) * carre + offset + 1;
        y = (_PX - parseInt(lines[7]) + _Y) * carre + offset + 1;
        var key = (x + Dx) + Math.abs(y + Dy) * nbCase + 1;

        var lvl = lines[8].toString();


        if (!(key in cells)) {
            cells[key] = { x: x, y: y, realx: lines[6], realy: lines[7] };
            cells[key][lvl] = {
                gob: [], monster: [], violetMonster: [], redMonster: [], orangeMonster: [],
                yellowMonster: [], place: [], object: [], plant: [], mechanicalCreature: []
            };
        }
        if (!(lvl in cells[key])) {
            cells[key][lvl] = {
                gob: [], monster: [], violetMonster: [], redMonster: [], orangeMonster: [],
                yellowMonster: [], place: [], object: [], plant: [], mechanicalCreature: []
            };
        }

        if (lines[4] === "Mentalo" || lines[4] === "Nodef" || lines[4] === "Musculeux" ||
            lines[4] === "Vis Yonnair" || lines[4] === "Trad Scion" || lines[4] === "Zozo Giste") {
            cells[key][lvl]["gob"].push(lines[2] + ' - ' + lines[3]);
        } else if (lines[4] === "Créature mécanique" || lines[4] === "Squelette" || lines[4] === "Pierreux"  || lines[4] === "Esprit-rôdeur" || lines[4] === "Pierreux") {
            console.log("suivant found!", lines[2]);
            cells[key][lvl]["mechanicalCreature"].push(lines[2] + ' - ' + lines[3]);
        } else if (parseInt(lines[3]) >= 50) {
            cells[key][lvl]["violetMonster"].push(lines[2] + ' - ' + lines[3]);
        } else if (parseInt(lines[3]) >= 40) {
            cells[key][lvl]["redMonster"].push(lines[2] + ' - ' + lines[3]);
        } else if (parseInt(lines[3]) >= 30) {
            cells[key][lvl]["orangeMonster"].push(lines[2] + ' - ' + lines[3]);
        } else if (parseInt(lines[3]) >= 25) {
            cells[key][lvl]["yellowMonster"].push(lines[2] + ' - ' + lines[3]);
        } else {
            cells[key][lvl]["monster"].push(lines[2] + ' - ' + lines[3]);
        }
    }
});

var lieux = $('#TLIEUX').find("table");
$("tbody tr", lieux).each(function (index, tr) {
    var lines = $('td', tr).map(function (index, td) {
        return $(td).text();
    });

    if (typeof lines[0] != "undefined") {
        x = (_PX + parseInt(lines[4]) - _X) * carre + offset + 1;
        y = (_PX - parseInt(lines[5]) + _Y) * carre + offset + 1;
        var key = (x + Dx) + Math.abs(y + Dy) * nbCase + 1;

        var lvl = lines[6].toString();



        if (!(key in cells)) {
            cells[key] = { x: x, y: y, realx: lines[4], realy: lines[5] };
            cells[key][lvl] = {
                gob: [], monster: [], violetMonster: [], redMonster: [], orangeMonster: [],
                yellowMonster: [], place: [], object: [], plant: [], mechanicalCreature: []
            };
        }
        if (!(lvl in cells[key])) {
            cells[key][lvl] = {
                gob: [], monster: [], violetMonster: [], redMonster: [], orangeMonster: [],
                yellowMonster: [], place: [], object: [], plant: [], mechanicalCreature: []
            };
        }

        cells[key][lvl]["place"].push(lines[2]);
    }
});

var tresors = $('#TOBJETS').find("table");
$("tbody tr", tresors).each(function (index, tr) {
    var lines = $('td', tr).map(function (index, td) {
        return $(td).text();
    });

    if (typeof lines[0] != "undefined") {
        x = (_PX + parseInt(lines[3]) - _X) * carre + offset + 1;
        y = (_PX - parseInt(lines[4]) + _Y) * carre + offset + 1;
        var key = (x + Dx) + Math.abs(y + Dy) * nbCase + 1;

        var lvl = lines[5].toString();


        if (!(key in cells)) {
            cells[key] = { x: x, y: y, realx: lines[3], realy: lines[4] };
            cells[key][lvl] = {
                gob: [], monster: [], violetMonster: [], redMonster: [], orangeMonster: [],
                yellowMonster: [], place: [], object: [], plant: [], mechanicalCreature: []
            };
        }
        if (!(lvl in cells[key])) {
            cells[key][lvl] = {
                gob: [], monster: [], violetMonster: [], redMonster: [], orangeMonster: [],
                yellowMonster: [], place: [], object: [], plant: [], mechanicalCreature: []
            };
        }

        cells[key][lvl]["object"].push(lines[2]);
    }
});

var plantes = $('#TPLANTS').find("table");
$("tbody tr", plantes).each(function (index, tr) {
    var lines = $('td', tr).map(function (index, td) {
        return $(td).text();
    });

    if (typeof lines[0] != "undefined") {
        x = (_PX + parseInt(lines[3]) - _X) * carre + offset + 1;
        y = (_PX - parseInt(lines[4]) + _Y) * carre + offset + 1;
        var key = (x + Dx) + Math.abs(y + Dy) * nbCase + 1;

        var lvl = lines[5].toString();


        if (!(key in cells)) {
            cells[key] = { x: x, y: y, realx: lines[3], realy: lines[4] };
            cells[key][lvl] = {
                gob: [], monster: [], violetMonster: [], redMonster: [], orangeMonster: [],
                yellowMonster: [], place: [], object: [], plant: [], mechanicalCreature: []
            };
        }
        if (!(lvl in cells[key])) {
            cells[key][lvl] = {
                gob: [], monster: [], violetMonster: [], redMonster: [], orangeMonster: [],
                yellowMonster: [], place: [], object: [], plant: [], mechanicalCreature: []
            };
        }

        cells[key][lvl]["plant"].push(lines[2]);
    }
});

alllieux = {};


for (var key in cells) {
    x = cells[key].x;
    y = cells[key].y;
    mapping = getMapping(key);

    if (mapping in images) {
        alllieux[key] = R.image(images[mapping], x, y, carre - 1, carre - 1);
        (function (st, key) {
            attachTooltipEvents(st, key);
        })(alllieux[key], key);

    } else {
        console.error("Image not found for mapping:", mapping);
    }
}

vue2DBuilt = true;

      }


    //getmapping
 function getMapping(k, showBigMonsters) {
    var result = "";
    var cptGob = 0, cptMob = 0, cptPlace = 0, cptObj = 0, cptVioletMobs = 0, cptRedMobs = 0, cptorandedMobs = 0, cptyellowedMobs = 0, cptplants = 0, cptMech = 0;


    if ($('input[name=ckbNiveau]').is(':checked')) {
        if (niveau in cells[k]) {
            cptGob += cells[k][niveau]["gob"].length;
            cptMob += cells[k][niveau]["monster"].length;
            cptRedMobs += cells[k][niveau]["redMonster"].length;
            cptVioletMobs += cells[k][niveau]["violetMonster"].length;
            cptPlace += cells[k][niveau]["place"].length;
            cptObj += cells[k][niveau]["object"].length;
            cptplants += cells[k][niveau]["plant"].length;
            cptorandedMobs += cells[k][niveau]["orangeMonster"].length;
            cptyellowedMobs += cells[k][niveau]["yellowMonster"].length;
            cptMech += cells[k][niveau]["mechanicalCreature"].length; // Créatures mécaniques
        }
    } else {
        for (var lvl in cells[k]) {
            if ((lvl != "x") && (lvl != "y") && (lvl != "realx") && (lvl != "realy")) {
                cptGob += cells[k][lvl]["gob"].length;
                cptMob += cells[k][lvl]["monster"].length;
                cptRedMobs += cells[k][lvl]["redMonster"].length;
                cptVioletMobs += cells[k][lvl]["violetMonster"].length;
                cptPlace += cells[k][lvl]["place"].length;
                cptObj += cells[k][lvl]["object"].length;
                cptplants += cells[k][lvl]["plant"].length;
                cptorandedMobs += cells[k][lvl]["orangeMonster"].length;
                cptyellowedMobs += cells[k][lvl]["yellowMonster"].length;
                cptMech += cells[k][lvl]["mechanicalCreature"].length; // Créatures mécaniques
            }
        }
    }

    result += (cptGob > 0) ? "1" : "0";

    // Priorité aux créatures mécaniques
    if ((cptMech > 0) && ($('input[name=ckbMonster]').is(':checked'))) {
        result += "7";
    } else if ((cptplants > 0) && ($('input[name=ckbplants]').is(':checked'))) {
        result += "3";
    } else if (showBigMonsters && $('input[name=ckbMonster]').is(':checked')) { // Simplifié pour gros monstres
        result += (cptRedMobs > 0) ? "2" : ((cptVioletMobs > 0) ? "6" : "0");
    } else if ((cptRedMobs > 0) && ($('input[name=ckbMonster]').is(':checked'))) {
        result += "2";
    } else if ((cptVioletMobs > 0) && ($('input[name=ckbMonster]').is(':checked'))) {
        result += "6";
    } else if ((cptorandedMobs > 0) && ($('input[name=ckbMonster]').is(':checked'))) {
        result += "4";
    } else if ((cptyellowedMobs > 0) && ($('input[name=ckbMonster]').is(':checked'))) {
        result += "5";
    } else if ((cptMob > 0) && ($('input[name=ckbMonster]').is(':checked'))) {
        result += "1";
    } else {
        result += "0";
    }



    result += (($('input[name=ckbObject]').is(':checked')) && (cptObj > 0)) ? "1" : "0";
    result += (($('input[name=ckbPlace]').is(':checked')) && (cptPlace > 0)) ? "1" : "0";

    return result;
}
    	//=======================================================================================
    	// Compute the global text that must be display in the popup.
    	//=======================================================================================
function compute_text(k) {
    var result = "X=" + cells[k].realx + ", Y=" + cells[k].realy + "\n";
    var n = [];

    if ($('input[name=ckbNiveau]').is(':checked')) {
        if (niveau in cells[k]) {
            n.push(niveau);
        }
    } else {
        for (var lvl in cells[k]) {
            if ((lvl != "x") && (lvl != "y") &&
                (lvl != "realx") && (lvl != "realy")) {
                n.push(lvl);
            }
        }
    }

    var data = "";
    for (var i = 0; i < n.length; i++) {
        var k2 = n[i];

        if (k2 in cells[k]) { // <-- Vérification importante
            data += getString(cells[k][k2]["gob"]);
            data += getString(cells[k][k2]["monster"], true);
            data += getString(cells[k][k2]["violetMonster"], true);
            data += getString(cells[k][k2]["redMonster"], true);
            data += getString(cells[k][k2]["orangeMonster"], true);
            data += getString(cells[k][k2]["yellowMonster"], true);
            data += getString(cells[k][k2]["place"]);
            data += getString(cells[k][k2]["plant"]);
            data += getString(cells[k][k2]["mechanicalCreature"]); // <-- mechanicalCreature ici

            if ($('input[name=ckbObject]').is(':checked')) {
                data += getString(cells[k][k2]["object"], true);
            }

            if (data != "") {
                result += " \nNiveau: " + k2 + "\n" + data;
                data = "";
            }
        } // Fin de la condition if (k2 in cells[k])
    }
    return result;
}

      function getString(arr, pre) {
    if (typeof arr === 'undefined' || !arr ) return "";
    var res = "";
    if (arr.length > 0)
    {
      for (var j=0;j<arr.length;j++)
      {
        res += ((pre)?" - ":"") + arr[j] + "\n";
      }
    }
    return res;
}

    	//=======================================================================================
    	// Process the data array and generate the string to display in the popup
    	// If compressed = true, the number of items are counted to be displayed as N x items
    	//=======================================================================================
    	function getString(data,compressed) {
    		if(typeof(compressed)==='undefined') compressed = false;
    		var result = "";

    		if (compressed)
    		{
    			var tmp = {};
    			for( var i=0; i < data.length; i++ )
    			{
    				n = data[i];
    				if (!(n in tmp))
    				{
    					tmp[n] = 0;
    				}
    				tmp[n] = tmp[n] + 1;
    			}

    			for( var k in tmp )
    			{
    				result += "\t" + tmp[k] + " x " + k + "\n";
    			}
    		}
    		else
    		{
    			for( var i=0; i < data.length; i++ )
    			{
    				result += "\t" + data[i] + "\n";
    			}
    		}
    		return result;
    	}



    function draw_tooltip(object, show, text, x, y, carre, from) {
    	if(show == 0) {
    			popup.remove();
    			popup_txt.remove();
    	        transparent_txt.remove();
    			return;
    		}


    		// Center X on middle of the cell.
    		x +=  Math.floor(carre/2);

    		//draw text somewhere to get its dimensions and make it transparent
    		transparent_txt = R.text(10,10, text).attr({fill: "transparent",font: tailleTxt});

    	    //get text dimensions to obtain tooltip dimensions
    		var txt_box = transparent_txt.getBBox();


    		if (from=="topright") {
    			// Move to bottom of the cell
    			y += carre;

    		    // Compute position
    			Xtext = x+5;
    			Ytext = y+Math.floor(txt_box.height/2)+5;

    		    //draw text
    			popup_txt = R.text(Xtext, Ytext, text).attr({fill: "black",font: tailleTxt,'text-anchor': 'start'});

    			var bb = popup_txt.getBBox();

    		    // Compute path for tooltip box
    			pathText = 	// 'M'ove to the 'dent' in the bubble
    						"M" + (x) + " " + (y) +
    						// 'v'ertically draw a line 5 pixels more than the height of the text
    						"v" + (bb.height+5) +
    						// 'h'orizontally draw a line 10 more than the text's width
    						"h" + (bb.width+10) +
    						// 'v'ertically draw a line to the bottom of the text
    						"v" + -bb.height +
    						// 'h'orizontally draw a line so we're 5 pixels from the left side
    						"h" + -(bb.width+5) +
    						// 'Z' closes the figure
    						"Z";
    		} else if (from=="topleft") {
    			// Move to bottom of the cell
    			y += carre;

    		    // Compute position
    			Xtext = x-(txt_box.width+5);
    			Ytext = y+Math.floor(txt_box.height/2)+5;

    		    //draw text
    			popup_txt = R.text(Xtext, Ytext, text).attr({fill: "black",font: tailleTxt,'text-anchor': 'start'});

    			var bb = popup_txt.getBBox();

    		    // Compute path for tooltip box
    			pathText = 	// 'M'ove to the 'dent' in the bubble
    					   	"M" + (x) + " " + (y) +
    						// 'v'ertically draw a line 5 pixels more than the height of the text
    						"v" + (bb.height+5) +
    						// 'h'orizontally draw a line 10 more than the text's width
    						"h" + -(bb.width+10) +
    						// 'v'ertically draw a line to the bottom of the text
    						"v" + -bb.height +
    						// 'h'orizontally draw a line so we're 5 pixels from the left side
    						"h" + (bb.width+5) +
    						// 'Z' closes the figure
    						"Z";
    		} else if (from=="bottomleft") {
    		    // Compute position
    			Xtext = x-(txt_box.width+5);
    			Ytext = y-Math.floor(txt_box.height/2)-6;

    		    //draw text
    			popup_txt = R.text(Xtext, Ytext, text).attr({fill: "black",font: tailleTxt,'text-anchor': 'start'});

    			var bb = popup_txt.getBBox();

    		    // Compute path for tooltip box
    			pathText = 	// 'M'ove to the 'dent' in the bubble
    						"M" + (x) + " " + (y) +
    						// 'v'ertically draw a line 5 pixels more than the height of the text
    						"v" + -(bb.height+5) +
    						// 'h'orizontally draw a line 10 more than the text's width
    						"h" + -(bb.width+10) +
    						// 'v'ertically draw a line to the bottom of the text
    						"v" + bb.height +
    						// 'h'orizontally draw a line so we're 5 pixels from the left side
    						"h" + (bb.width+5) +
    						// 'Z' closes the figure
    						"Z";
    		}	else // bottom right
    		{
    		    // Compute position
    			Xtext = x+5;
    			Ytext = y-Math.floor(txt_box.height/2)-6;

    		    //draw text
    			popup_txt = R.text(Xtext, Ytext, text).attr({fill: "black",font: tailleTxt,'text-anchor': 'start'});

    			var bb = popup_txt.getBBox();

    		    // Compute path for tooltip box
    			pathText = 	// 'M'ove to the 'dent' in the bubble
    					   	"M" + (x) + " " + (y) +
    						// 'v'ertically draw a line 5 pixels more than the height of the text
    						"v" + -(bb.height+5) +
    						// 'h'orizontally draw a line 10 more than the text's width
    						"h" + (bb.width+10) +
    						// 'v'ertically draw a line to the bottom of the text
    						"v" + bb.height +
    						// 'h'orizontally draw a line so we're 5 pixels from the left side
    						"h" + -(bb.width+5) +
    						// 'Z' closes the figure
    						"Z";
    		}

        //draw path for tooltip box
      popup = R.path( pathText ).attr( {fill: "yellow"} );

    		//finally put the text in front
    		popup_txt.toFront();

    	}

    };


    //----------------------
    ///FIN DE LA VUE 2D
    //----------------------


    //==========================================================================================================================================================================================================================
    // Traitements spécifiques à la page PROFIL
    //==========================================================================================================================================================================================================================
    if ($(location).attr('href').match(/^http:\/\/(.*\.)?gobland\.fr\/ProfilPerso\.php$/i)) {

      var skills = {};



      //fait apparaitre comp et tech et dons en couleurs dans MonProfil
      $('td:contains("Connaissance des Monstres")').parent().css("background-color","cefeda");
      $('td:contains("Identification des Trésors")').parent().css("background-color","fec8f1");
      $('td:contains("Limier")').parent().css("background-color","f9ffbc");
      $('td:contains("Dur")').parent().css("background-color","f9ffbc");

      //fait apparaitre "Grand Maître" en Gras dans Mon Profil
      $('td:contains("(Grand Maître)")').css("font-weight", "bold");

      $( document ).ready(function() {
        displayNextLevel();
        buildSkillsStats();
        buildSkillsMagie();
        addToolTipsTalents();

        // Met en rouge le malus de concentration
        if (skills.CON < -1) {
          $('td:contains("Bonus de concentration")').css("color","red", "font-weight", "bold");
        } else {
          $('td:contains("Bonus de concentration")').css("color","green" , "font-weight", "bold");
        }
      });




    /// INFO BULLES TALENTS (au survol de la souris sur une comp ou tech, fait le calcul si c'est possible)

      function addToolTipsTalents() {

        $('a:contains("Symphonie Intestinale")').prop('title',
          'Apprenti...........ATT/ESQ/PER -' + Math.floor((skills.PV/30)) + "\n" +
          'Compagnon...ATT/ESQ/PER -' + Math.floor((skills.PV/25)) + "\n" +
          'Maître...............ATT/ESQ/PER -' + Math.floor((skills.PV/20)) + "\n" +
          'Grand Maître..ATT/ESQ/PER -' + Math.floor((skills.PV/15))) ;

        $('a:contains("Afflux Sanguin")').prop('title',
          'Apprenti ' + Math.floor((skills.PVMax/30) )  + 'D3'  + ' (' + Math.floor((skills.PVMax/30) )*2 + ')' + "\n"  +
          'Compagnon ' + Math.floor((skills.PVMax/25) ) + 'D3'  + ' (' + Math.floor((skills.PVMax/25) )*2 + ')' + "\n"  +
          'Maître ' + Math.floor((skills.PVMax/20) ) + 'D3'  + ' (' + Math.floor((skills.PVMax/20) )*2 + ')' + "\n"  +
          'Grand Maître ' + Math.floor((skills.PVMax/15) )+ 'D3' + ' (' + Math.floor((skills.PVMax/15) )*2 + ')') ;

        $('a:contains("Appel des Ombres")').prop('title',
          'Apprenti......' + ' MT +' + (skills.MTP/2)+ ' | ' + ' RT +0 ' + ' | ' + ' MP +0 ' + ' | ' + ' RT -' + (skills.RPP/2) + "\n"  +
          'Compagnon......' + ' MT +' + (skills.MTP)+ ' | '  + ' RT +0 '+ ' | '  + ' MP +0 '+ ' | '  + ' RP -' + (skills.RPP) + "\n"  +
          'Maître......' + ' MT +' + (skills.MTP)+ ' | '  + ' RT +' + (skills.RTP/2) + ' | '  + ' MP -' +(skills.MPP/2) + ' | ' + ' RP -' + (skills.RPP) + "\n"  +
          'Grand Maître......' + ' MT +' + (skills.MTP)+ ' | '  + ' RT +' + (skills.RTP)+ ' | '   + ' MP -' +(skills.MPP)+ ' | '  + ' RP -' + (skills.RPP));

        $('a:contains("Appel de la Nature")').prop('title',
          'Apprenti......' + ' MS +' + (skills.MSP/2)+ ' | ' + ' RS +0 ' + ' | ' + ' MC +0 ' + ' | ' + ' RC -' + (skills.RCP/2)   + "\n"  +
          'Compagnon......' + ' MS +' + (skills.MSP)+ ' | '  + ' RS +0 '+ ' | '  + ' MC +0 '+ ' | '  + ' RC -' + (skills.RCP) + "\n"  +
          'Maître......' + ' MS +' + (skills.MSP)+ ' | '  + ' RS +' + (skills.RSP/2) + ' | '  + ' MC -' +(skills.MCP/2) + ' | ' + ' RC -' + (skills.RCP) + "\n"  +
          'Grand Maître......' + ' MS +' + (skills.MSP)+ ' | '  + ' RS +' + (skills.RSP)+ ' | '   + ' MC -' +(skills.MCP)+ ' | '  + ' RC -' + (skills.RCP));

        $('a:contains("Alchimie")').prop('title',
          'ATT ' + Math.floor(skills.ATT )  + 'D6'  + skills.ATTP +  ' (' + Math.floor(((+skills.ATT) )*3.5 + +skills.ATTP)   + ')' + "\n"  +
          '......DEG......' + "\n"  +
          'Apprenti...... ' +  Math.floor(skills.ATT )  + 'D6'  + skills.ATTP +  ' (' + Math.floor(((+skills.ATT) )*3.5 + +skills.ATTP)   + ')' + "\n"  +
          'Compagnon...... ' + Math.floor((skills.PV/25) ) + 'D3'  + ' (' + Math.floor((skills.PV/25) )*3.5 + ')' + "\n"  +
          'Maître...... ' + Math.floor((skills.PV/20) ) + 'D3'  + ' (' + Math.floor((skills.PV/20) )*3.5 + ')' + "\n"  +
          'Grand Maître...... ' + Math.floor((skills.PV/15) )+ 'D3' + ' (' + Math.floor((skills.PV/15) )*3.5 + ')') ;

        $('a:contains("Renforcement magique")').prop('title',
          'Apprenti......' + ' MM +' + (skills.MMP/2)+ ' | ' + ' RM +0 ' + ' | ' + ' MR +0 ' + ' | ' + ' RR -' + (skills.RCP/2)   + "\n"  +
          'Compagnon......' + ' MM +' + (skills.MMP)+ ' | '  + ' RM +0 '+ ' | '  + ' MR +0 '+ ' | '  + ' RR -' + (skills.RCP) + "\n"  +
          'Maître......' + ' MM +' + (skills.MMP)+ ' | '  + ' RM +' + (skills.RMP/2) + ' | '  + ' MR -' +(skills.MRP/2) + ' | ' + ' RR -' + (skills.RRP) + "\n"  +
          'Grand Maître......' + ' MM +' + (skills.MMP)+ ' | '  + ' RM +' + (skills.RMP)+ ' | '   + ' MR -' +(skills.MRP)+ ' | '  + ' RR -' + (skills.RRP));

        $('a:contains("Connaissance des Monstres")').prop('title', 'portée : ' + (Math.floor((+skills.PER)+(+skills.PERM)+(+skills.PERP))));

        $('a:contains("Projectile")').prop('title',
          'ATT ' +  Math.floor(((skills.PER/2 +   skills.ATT/2)) - Math.max(0,(2/4-0))) + 'D6 +' + Math.floor(skills.PERM/2 + skills.ATTM/2 ) + '---> ' +
          (Math.floor((((skills.PER/2 +   skills.ATT/2)) - Math.max(0,2/4-0)))*3.5  + Math.floor(skills.PERM/2 + skills.ATTM/2 )) + "\n"   +
          'DEG ' +  Math.floor((skills.PER/2 +   skills.ATT/2)) + 'D3 +' + (skills.ATTM/2 + skills.PERM/2 ) + '---> ' +
          ((Math.floor((skills.PER/2 +   skills.ATT/2)))*2 + Math.floor(skills.PERM/2 + skills.ATTM/2 )) + ' (' +
          ((((Math.floor((skills.PER/2 +   skills.ATT/2)))*2 + Math.floor(skills.PERM/2 + skills.ATTM/2 ))) + ((((Math.floor((skills.PER/2 +   skills.ATT/2)))*2 + Math.floor(skills.PERM/2 + skills.ATTM/2 )))/2))  + ')' + "\n"  +
          'Divisé par 2 si résisté' + "\n" + 'Portée : ' +  getRange(skills.PER + skills.PERP + skills.PERM)
    );
    //calcul de la portée du PO
    function getRange() {
        const totalPerception = +skills.PER + +skills.PERP + +skills.PERM;
      window.localStorage.setItem('totalPerception', totalPerception);

        if (totalPerception >= 1 && totalPerception <= 4) {
            return '1 case';
        } else if (totalPerception >= 5 && totalPerception <= 9) {
            return '2 cases';
        } else if (totalPerception >= 10 && totalPerception <= 15) {
            return '3 cases';
        } else if (totalPerception >= 16 && totalPerception <= 22) {
            return '4 cases';
        } else if (totalPerception >= 23 && totalPerception <= 30) {
            return '5 cases';
        } else if (totalPerception >= 31 && totalPerception <= 39) {
            return '6 cases';
        } else if (totalPerception >= 40 && totalPerception <= 50) {
            return '7 cases';
        } else if (totalPerception >= 51 && totalPerception <= 62) {
            return '8 cases';
        } else if (totalPerception >= 62 && totalPerception <= 74) {
            return '9 cases';
        } else {
            return 'Out of Range';
        }
    } ;

        $('a:contains("Baratin")').prop('title',
          'Apprenti......' +  Math.floor((1)+((skills.PER)/5 + (skills.REG)/5))+'D6' + ' (' + Math.floor(1+((skills.PER)/5 + (skills.REG)/5)*3.5)  + ')' +  "\n"  +
          'Compagnon......'  + Math.floor((1)+((skills.PER)/4 + (skills.REG)/4)) +'D6' + ' (' + Math.floor(1+((skills.PER)/4 + (skills.REG)/4)*3.5)  + ')' + "\n"  +
          'Maître ......'  + Math.floor((1)+((skills.PER)/3 + (skills.REG)/3))+'D6' + ' (' + Math.floor(1+((skills.PER)/3 + (skills.REG)/3)*3.5)  + ')' + "\n"  +
          'Grand Maître ......' +  Math.floor((1)+((skills.PER)/2 + (skills.REG)/2))+'D6' + ' (' + Math.floor(1+((skills.PER)/2 + (skills.REG)/2)*3.5)  + ')');

        $('a:contains("Chirurgie")').prop('title',
          'Apprenti...... ' + Math.floor((3/2)*skills.REG) + 'D3'+ ' (' + Math.floor((3/2)*skills.REG) *2 + ')' + "\n"  +
          'Compagnon...... ' + Math.floor((4/2)*skills.REG) + 'D3' + ' (' + Math.floor((4/2)*skills.REG) *2 + ')' + "\n"  +
          'Maître...... ' + Math.floor((5/2)*skills.REG) + 'D3' + ' (' + Math.floor((5/2)*skills.REG) *2 + ')' + "\n"  +
          'Grand Maître...... ' + Math.floor((6/2)*skills.REG) + 'D3' + ' (' + Math.floor((6/2)*skills.REG) *2 + ')');

        $('a:contains("Soins")').prop('title',
          'Apprenti...... ' + '+' + Math.floor(+skills.REG*1 + +skills.REGM) + ' PV' + "\n"  +
          'Compagnon...... ' + '+' + Math.floor(+skills.REG*2 + +skills.REGM) + ' PV' +"\n"  +
          'Maître...... ' + '+' + Math.floor(+skills.REG*3 + +skills.REGM) + ' PV' + "\n"  +
          'Grand Maître...... ' + '+' + Math.floor(+skills.REG*4 + +skills.REGM) + ' PV');

        $('a:contains("Téléportation")').prop('title',
          'Apprenti...... ' +  'Portée horizontale : ' + ((Math.floor(Math.sqrt(19+8*skills.MM*1/5+3))-7)/2 + 20 +  + skills.PER + +skills.PERM )  + ' Portée verticale : ' +((Math.floor(((Math.sqrt(19+8*skills.MM*1/5+3))-7)/2/3+3))) + "\n"  +
          'Compagnon...... ' +  'Portée horizontale : ' + ((Math.floor(Math.sqrt(19+8*skills.MM*1.1/5+3))-7)/2 + 20 +  + skills.PER + +skills.PERM )  + ' Portée verticale : ' +((Math.floor(((Math.sqrt(19+8*skills.MM*1.1/5+3))-7)/2/3+3))) + "\n"  +
          'Maître...... ' +  'Portée horizontale : ' + ((Math.floor(Math.sqrt(19+8*skills.MM*1.2/5+3))-7)/2 + 20 +  + skills.PER + +skills.PERM )  + ' Portée verticale : ' +((Math.floor(((Math.sqrt(19+8*skills.MM*1.2/5+3))-7)/2/3+3))) + "\n"  +
          'Grand Maître...... ' +  'Portée horizontale : ' + ((Math.floor(Math.sqrt(19+8*skills.MM*1.3/5+3))-7)/2 + 20 +  + skills.PER + +skills.PERM )  + ' Portée verticale : ' +((Math.floor(((Math.sqrt(19+8*skills.MM*1.3/5+3))-7)/2/3+3))));

        $('a:contains("Double Dague")').prop('title',
          'Grand Maître : 1ere attaque : ' + skills.ATT+ 'D6'+ '+' + skills.ATTP*1+ '+' + +skills.ATTM +
          '2eme attaque : ' + Math.floor(skills.ATT-+skills.ATT*0.25) + 'D6'+ '+' +  Math.floor(skills.ATTP*1*0.25)+ '+' +  Math.floor(skills.ATTM*0.25) +
          '3eme attaque : ' + Math.floor(skills.ATT-+skills.ATT*0.5) + 'D6'+ '+' +  Math.floor(skills.ATTP*1*0.5)+ '+' +  Math.floor(skills.ATTM*0.5) +
          '4eme attaque : ' + Math.floor(skills.ATT-+skills.ATT*0.75) + 'D6'+ '+' +  Math.floor(skills.ATTP*1*0.75)+ '+' +  Math.floor(skills.ATTM*0.75) +
          'Dégâts : ' + skills.DEG  + 'D3'+ '+' +  Math.floor(skills.DEGP*1.5)+ '+' +  Math.floor(skills.DEGM)) ;

        $('a:contains("Flairer le gibier")').prop('title',
          'Apprenti...... ' +  'Portée  : ' + 1.5*(+skills.PER+(+skills.PERP)) + "\n"  +
          'Compagnon......' +  'Portée  : '+ 2*(+skills.PER+(+skills.PERP)) + "\n"  +
          'Maître...... ' +  'Portée  : ' + 2.5*(+skills.PER+(+skills.PERP)) + "\n"  +
          'Grand Maître...... ' +  'Portée  : ' + 3*(+skills.PER+(+skills.PERP)) + "\n"  );

        $('a:contains("Jet de Pierres")').prop('title',
          'Apprenti...... ' +  'Portée  : 1'  + "\n"  +
          'Compagnon......' +  'Portée  : 2'  + "\n"  +
          'Maître...... ' +  'Portée  : 3'  + "\n"  +
          'Grand Maître...... ' +  'Portée  : 4'   );

        $('a:contains("Attaque Défensive")').prop('title',
          'Apprenti.............. ' +  'ESQ +' + Math.floor(Math.max(skills.ESQ/3,1)) + " | ATT -1\n"  +
          'Compagnon....... ' +  'ESQ +' + Math.floor(Math.max(skills.ESQ/2.5,2)) + " | ATT -1\n"  +
          'Maître................... ' + 'ESQ +' + Math.floor(Math.max(skills.ESQ/2,3))  + " | ATT -1\n"  +
          'Grand Maître..... ' + 'ESQ +' + Math.floor(Math.max(skills.ESQ/1.5,4)) + " | ATT -1");

        $('a:contains("Forme spectrale")').prop('title',
          'Apprenti...... ' +  'ESQ +3 ARMM +1' + '.... total ARMM après conversion : ' + (Math.floor(skills.ARMP*0.15)+(+skills.ARMM)+1) + "\n"  +
          'Compagnon......' +  'ESQ +4 ARMM +2' + '.... total ARMM après conversion : ' + (Math.floor(skills.ARMP*0.20)+(+skills.ARMM)+2) + "\n"  +
          'Maître...... ' +  'ESQ +5 ARMM +3' + '.... total ARMM après conversion : ' + (Math.floor(skills.ARMP*0.25)+(+skills.ARMM)+3) + "\n"  +
          'Grand Maître...... ' + 'ESQ +6 ARMM +4' + '.... total ARMM après conversion : ' + (Math.floor(skills.ARMP*0.30)+(+skills.ARMM)+4));

        $('a:contains("Herboriser")').prop('title',
          'Apprenti...... ' +  'Portée  : ' + 1.5*(+skills.PER+(+skills.PERP+(+skills.PERM))) + " (Fleur,Baie) " + "\n"  +
          'Compagnon......' +  'Portée  : '+ 2*(+skills.PER+(+skills.PERP)+(+skills.PERM)) + ' (Fleur,Baie, Plante grasse, Champignon)'  + "\n"  +
          'Maître...... ' +  'Portée  : ' + 2.5*(+skills.PER+(+skills.PERP)+(+skills.PERM)) + ' (Fleur,Baie, Plante grasse, Champignon, Mousse)'  +  "\n"  +
          'Grand Maître...... ' +  'Portée  : ' + 3*(+skills.PER+(+skills.PERP)+(+skills.PERM)) + ' (tout)');

        $('a:contains("Rafale")').prop('title',
          'FULL'  + "\n"  +
          'Apprenti...... ' +  'DEG '  + skills.DEG + 'D3' + skills.DEGM + ' (pas de malus de REG)' + "\n"  +
          'Compagnon......' +  'DEG '  + skills.DEG + 'D3' + skills.DEGM + ' (Malus REG : ' + (Math.floor(skills.DEG/2)) + 'D3' + ')' + "\n"  +
          'Maître...... ' +  'DEG '  + skills.DEG + 'D3' + skills.DEGM +  ' (Malus REG : ' + (Math.floor(skills.DEG)) + 'D3' + ')' + "\n"  +
          'Grand Maître...... ' + 'DEG '  + skills.DEG + 'D3' + skills.DEGM +  ' (Malus REG : ' + (Math.floor(skills.DEG*2))  + 'D3' + ')' + "\n"  +
          'RES' + "\n"  +
          'Apprenti...... ' +  'DEG '  + (Math.floor(skills.DEG*0.3)) + 'D3' + skills.DEGM + ' (pas de malus de REG)' + "\n"  +
          'Compagnon......' +  'DEG '  + (Math.floor(skills.DEG*0.4))  + 'D3' + skills.DEGM +  ' (pas de malus de REG)' + "\n"  +
          'Maître...... ' +  'DEG '  + (Math.floor(skills.DEG*0.5))  + 'D3' + skills.DEGM +  ' (Malus REG : ' + (Math.floor(skills.DEG/2)) + 'D3' + ')' + "\n"  +
          'Grand Maître...... ' + 'DEG '  + (Math.floor(skills.DEG*0.6))  + 'D3' + skills.DEGM +  ' (Malus REG : ' + (Math.floor(skills.DEG) + 'D3' + ')'))  ;


        // DONS
        $('a:contains("Dans")').prop('title', 'ATTM + ' + skills.danslmil);
        $('a:contains("Limier")').prop('title', 'PERM + ' + skills.limier);
        $('a:contains("Chef")').prop('title', 'Bonus Cuisine :  + ' + 5*skills.grandchef);
        $('a:contains("Dur à cuir")').prop('title', '+ ' + skills.duracuir*5 + ' PV');
      };

    function displayNextLevel() {
        // Sélection de la cellule contenant l'expérience
        var gobExperience = $('th:contains("Expérience")').parent().closest('tr');
        var tdExp = $('td:first', gobExperience);
        var sExp = tdExp.html();

        // Récupération des informations à partir du texte
        var regexExp = /Niveau......: (\d+) \((\d+) PI \| Niveau (\d+) : (\d+)/;
        var matchExp = sExp.match(regexExp);

        if (matchExp) {
            var niveau = matchExp[1]; // Récupération du niveau
            var nbPIActuels = matchExp[2]; // Récupération du nombre de PI actuels
            var nextlevel = matchExp[3]; // Récupération du niveau suivant
            var nextPI = matchExp[4]; // Récupération du nombre de PI
            var nbTrain = Math.ceil((nextPI - nbPIActuels) / (2 * nextlevel)); // Calcul du nombre d'entraînements restants
        window.localStorage.setItem('niveau', niveau);
        window.localStorage.setItem('nbPIActuels', nbPIActuels);
        window.localStorage.setItem('nextlevel', nextlevel);
       window.localStorage.setItem('nextPI', nextPI);
            var pExp = sExp.indexOf(")");
            var sTrain = (nbTrain > 1) ? " entraînements" : " entraînement";
            // Modification du contenu de la cellule avec les nouvelles informations
            tdExp.html(sExp.substr(0, pExp + 1) + " ---> Il te reste " + nbTrain + sTrain + sExp.substr(pExp + 1));


          }


    var regexPX = /PX..........: (\d+)/; // Expression régulière pour récupérer PX
    var regexPXPerso = /PX Personnels......: (\d+)/
    var regexPI = /PI..........: (\d+)/
    var matchPx = sExp.match(regexPX);
    var matchPXPerso = sExp.match(regexPXPerso);
    var matchPI = sExp.match(regexPI);

      if (matchPx) {
    var PX = matchPx[1];
    window.localStorage.setItem('PX', PX);
    }
        if (matchPXPerso) {
    var PXperso = matchPXPerso[1];
    window.localStorage.setItem('PXperso', PXperso);
    }
          if (matchPI) {
    var PI = matchPI[1];
    window.localStorage.setItem('PI', PI);
    }


    }

    // Recherche du texte "Date de création" dans toute la page
    var searchText = "Date de création";
    var elementsContainingText = [...document.querySelectorAll('body, body *')].filter(element => element.textContent.includes(searchText));

    // Recherche de l'élément contenant le texte spécifique
    var dateCreationElement;
    elementsContainingText.forEach(function(element) {
        if (element.textContent.includes(searchText)) {
            dateCreationElement = element;
        }
    });

    // Sélection de l'élément contenant le texte
    var textElement = document.querySelector('.gfmm > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)');

    if (textElement) {
        var textLines = textElement.textContent.trim().split('\n');
        var dateCreationLine = textLines.find(line => line.includes('Date de création'));

        if (dateCreationLine) {
            var dateCreation = dateCreationLine.match(/\d{4}-\d{2}-\d{2}/);

            if (dateCreation) {
                console.log("Date de création:", dateCreation[0]);
              var DateCrea = dateCreation[0];
              window.localStorage.setItem('DateCrea',DateCrea);
                // Utilisez dateCreation[0] comme nécessaire ici
            } else {
                console.log("Date de création non trouvée dans la dernière ligne.");

            }
        } else {
            console.log("Ligne contenant la date de création non trouvée.");
        }
    } else {
        console.log("Élément contenant le texte non trouvé.");
    }

    // Sélecteur pour cibler l'élément spécifique
    var selector = '.gfmm > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)';

    // Récupération de l'élément correspondant au sélecteur
    var dateCreationElement = document.querySelector(selector);

    if (dateCreationElement) {
        var dateCreation = dateCreationElement.textContent.trim();
        console.log("Date de création:", dateCreation);
        // Utilisez dateCreation comme nécessaire ici
    } else {
        console.log("Élément contenant la date de création non trouvé.");
    }
      function buildSkillsStats() {
        // Recup position et PER
        var gobPosition = $('th:contains("Position")').parent().closest('tr').text();
        var pos = gobPosition.match(/X = ([-]*\d+) \| Y = ([-]*\d+) \| N = ([-]*\d+)/);

        skills.X = pos[1];
        skills.Y = pos[2];
        skills.N = pos[3];
        var XYN = pos[1] + ', '+ pos[2] +', ' + pos[3] ;
        window.localStorage.setItem('XYN', XYN);


        var per =  gobPosition.match(/Perception......: (\d+)/);
        skills.PER = per[1];
        var perp = gobPosition.match(/Cases (\W(\d+))/);
        skills.PERP = perp[1];
        var perm = gobPosition.match(/Cases (\W(\d+))(\W(\d+))/);
        skills.PERM = perm[3];

        var permax = +skills.PER +   +skills.PERP  + +skills.PERM
        window.localStorage.setItem('permax', permax);

        // Recup de la concentration (pour la modif css plus haut)
        var concentration = $('th:contains("Affinités")').parent().closest('tr').text();
        var conc = concentration.match(/Bonus de concentration : (\-\d+|\d+)/);
        skills.CON = conc[1];


        // Recup de la dla
        var gobdla = $('th:contains("Echéance du Tour")').parent().closest('tr').text();
        var dla = gobdla.match(/(\d+)-(\d+)-(\d+)/);
        skills.DLA = dla[1];


        // Recup PV, PVMax et REG
        var gobSante = $('th:contains("Santé")').parent().closest('tr');
        var tdSante = $('td:first', gobSante);
        res = tdSante.html().split(/<BR>/i); //gobSante.match(/: (\d+)([^:]+): (\d+)([^:]+): (\d+)/);
        skills.PV = res[0].match(/: (\d+)/)[1];
        skills.PVMax = res[1].match(/: (\d+)/)[1];


        var regensgob = $('td:contains("Régénération")').parent().closest('tr').text();
        var reg = regensgob.match(/Régénération..: (\d+)/);
        skills.REG = reg[1];
        var regp = regensgob.match(/D3(\W(\d+))/);
        skills.REGP = regp[1];
        var regm = regensgob.match(/D3(\W(\d+))(\W(\d+))/);
        skills.REGM = regm[3];

        /// recup DEG
        var degatsgob = $('div:contains("Dégâts")').parent().closest('tr').text();
        var deg = degatsgob.match(/: (\d+)/);
        skills.DEG = deg[1];
        var degp = degatsgob.match(/D3(\W(\d+))/);
        skills.DEGP = degp[1];
        var degm = degatsgob.match(/D3(\W(\d+))(\W(\d+))/);
        skills.DEGM = degm[3];

        /// recup ARM
        var armuresgob = $('div:contains("Armure")').parent().closest('tr').text();
        var armp = armuresgob.match(/Armure.....: (\d+)/);
        skills.ARMP = armp[1];
        var armm = armuresgob.match(/Armure.....: (\d+)(\W)(\d+)/);
        skills.ARMM = armm[3];

        /// recup ATT
        var attaquesgob = $('td:contains("Attaque")').parent().closest('tr').text();
        var att = attaquesgob.match(/Attaque.....: (\d+)/);
        skills.ATT = att[1];
        var attp = attaquesgob.match(/Attaque.....: (\d+)D6(\W(\d+))/);
        skills.ATTP = attp[2];
        var attm = attaquesgob.match(/Attaque.....: (\d+)D6(\W(\d+))(\W(\d+))/);
        skills.ATTM = attm[4];

        /// recup ESQ
        var esquivesgob = $('td:contains("Esquive")').parent().closest('tr').text();
        var esq = esquivesgob.match(/Esquive....: (\d+)/);
        skills.ESQ = esq[1];
        var esqp = esquivesgob.match(/Esquive....: (\d+)D6(\W(\d+))(\W)(\d+)/);
        skills.ESQP = esqp[2];
        var esqm = esquivesgob.match(/Esquive....: (\d+)D6(\W)(\d+)(\W(\d+))/);
        skills.ESQM = esqm[4];
      };

      function getDon(don) {
        try {
          return $('td:contains("' + don + '")').next('td').text().match(/(\d) (\W) (\d)/)[1];
        } catch (err) {
          return null;
        }
      };

      function buildSkillsMagie() {
        //recup dons
        skills.danslmil = getDon("Dans");
        skills.limier = getDon("Limier");
        skills.grandchef = getDon("Grand Chef");
        skills.duracuir = getDon("Dur à cuir");

        ///recup Magies (a finir)
        skills.RM = $('td.invisible:contains("(RM)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.RMP = $('td.invisible:contains("(RM)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.RMM = $('td.invisible:contains("(RM)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];

        skills.MM = $('td.invisible:contains("(MM)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.MMP = $('td.invisible:contains("(MM)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.MMM = $('td.invisible:contains("(MM)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];

        skills.RS = $('td.invisible:contains("(RS)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.RSP = $('td.invisible:contains("(RS)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.RSM = $('td.invisible:contains("(RS)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];

        skills.MS = $('td.invisible:contains("(MS)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.MSP = $('td.invisible:contains("(MS)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.MSM = $('td.invisible:contains("(MS)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];

        skills.RT = $('td.invisible:contains("(RT)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.RTP = $('td.invisible:contains("(RT)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.RTM = $('td.invisible:contains("(RT)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];

        skills.MT = $('td.invisible:contains("(MT)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.MTP = $('td.invisible:contains("(MT)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.MTM = $('td.invisible:contains("(MT)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];

        skills.RC = $('td.invisible:contains("(RC)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.RCP = $('td.invisible:contains("(RC)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.RCM = $('td.invisible:contains("(RC)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];

        skills.MC = $('td.invisible:contains("(RT)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.MCP = $('td.invisible:contains("(RT)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.MCM = $('td.invisible:contains("(RT)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];

        skills.RP = $('td.invisible:contains("(RP)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.RPP = $('td.invisible:contains("(RP)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.RPM = $('td.invisible:contains("(RP)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];

        skills.MP = $('td.invisible:contains("(MP)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.MPP = $('td.invisible:contains("(MP)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.MPM = $('td.invisible:contains("(MP)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];

        skills.RR = $('td.invisible:contains("(RR)")').next('td').text().match(/= ([-]*\d+)/)[1];
        skills.RRP = $('td.invisible:contains("(RR)")').next('td').text().match(/(\d+)(\W(\d+))/)[1];
        skills.RRM = $('td.invisible:contains("(RR)")').next('td').text().match(/(\d+)(\W(\d+))/)[2];
        //manque MR
      };



    ///fonction pour récup les ordres des Suivants et les afficher directement dans la section Suivant dans Profil.

    function httpGet(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
        });
    }



    // Fonction pour récupérer les valeurs stockées dans le localStorage
    function getFollowersNumbers() {
        return localStorage.getItem('followersnumbers');
    }

    function fetchFollowersInfo() {
        const followersNumbers = getFollowersNumbers();

        if (followersNumbers) {
            const baseUrl = 'http://games.gobland.fr/fo_orders.php?IdFO=';
            const numbersArray = JSON.parse(followersNumbers); // Parse le tableau JSON des numéros

            const followersNames = localStorage.getItem('followersnames') || '';
            const namesArray = JSON.parse(followersNames); // Parse le tableau JSON des noms

            const followersData = [];

            numbersArray.forEach((number, index) => {
                const sanitizedNumber = number.replace(/['"\[\]]/g, '');
                const url = baseUrl + sanitizedNumber;

                httpGet(url)
                    .then(responseText => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(responseText, "text/html");
                        const xpath = "//html/body/div[3]/div/table/tbody/tr[2]/td[2]/form/table/tbody/tr[4]/td";
                        const element = htmlDoc.evaluate(xpath, htmlDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                        if (element) {
                            const texte = element.textContent.trim();
                            followersData.push({ number: sanitizedNumber, name: namesArray[index], movements: texte });
                        } else {
                            console.log("Élément non trouvé sur la page", url);
                        }

                        if (index === numbersArray.length - 1) {
                            displayFollowersInfo(followersData);
                        }
                    })
                    .catch(error => {
                        console.error("Erreur lors de la récupération de la page", url, ":", error);

                        if (index === numbersArray.length - 1) {
                            displayFollowersInfo(followersData);
                        }
                    });
            });
        } else {
            console.log("Pas de numéro de suivants. Visitez (une seule fois) votre page suivant pour récupérer les infos.");
        }
    }

    function displayFollowersInfo(followersData) {
        const insertionPoint = document.querySelector(".gfmm > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(9) > td:nth-child(2)");

        if (insertionPoint) {
            followersData.forEach(follower => {
                const movements = follower.movements.split(';').filter(Boolean);
                const suivantName = follower.name || '';

                movements.forEach(movement => {
                    const formattedMovement = movement.trim();
                    const isStop = formattedMovement === 'stop()';

                    const span = document.createElement('span');
                    span.innerHTML = `<b>${suivantName}</b> - <i>${formattedMovement}</i>`;

                    span.querySelector('b').style.fontWeight = 'bold';
                    span.querySelector('i').style.fontStyle = 'italic';

                    if (isStop) {
                        span.style.color = 'red';
                    }

                    insertionPoint.appendChild(span);
                    insertionPoint.appendChild(document.createElement('br'));
                });
            });
        } else {
          console.log('prix spécialité', specialtyPrices);
        }
    }

    fetchFollowersInfo();
    }



    /// Affichage des carats

    const regMinerai = /^(\D*)(\d+)(\D*)$/
      const qualites = {
        'Médiocre': 2,
        'Moyenne': 2.75,
        'Normale': 3.5,
        'Bonne': 4.25,
        'Exceptionnelle': 5
      };

    $( document ).ready(function() {
      $('a:contains("taille")').each(function() {
        arr = this.text.match(regMinerai);
        carats = arr[2] * qualites[arr[3].split(' ')[3]];
        this.text = arr[0] + ' [Carats = ' + carats + ']'
      })
    });



    /// Décocher par défaut la case activer sa DLA sur la page de Log-In piqué a Seishin

    (function() {
        'use strict';

     $('input[type=checkbox][name=aDLA]').prop( "checked", false);
    })();


    // Décocher par défaut le vestaire piqué a Seishin

    (function() {
        'use strict';

        $('input[type=checkbox][name=VESTIAIRE]').prop( "checked", false );
    })();




    ///fonction RemplaceText () pour remplacer le texte et ajouter des icones dans Gobland (inspiré par Lordslair))

    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Vue\.php/i)) {

      const words = {


          // icones monstres
          'Abishaii Multicolore' : 'Abishaii Multicolore 👁️👁️ 💉',
          'Abishaii Blanc' :  'Abishaii Blanc 👁️ 💉',
          'Abishaii Bleu' :  'Abishaii Bleu 👁️ 💉',
          'Abishaii Noir' :  'Abishaii Noir 👁️ 💉',
          'Abishaii Rouge' :  'Abishaii Rouge 👁️ 💉',
          'Abishaii Vert' :  'Abishaii Vert 👁️ 💉',
          'Ankheg': 'Ankheg 🙈',
          'Ame-en-peine' :  'Ame-en-peine 👁️',
          'Amibe Géante' : 'Amibe Géante 🙈 🚨',
          'Anaconda des Catacombes' : 'Anaconda des Catacombes 🙈',
          'Araignée Géante' : 'Araignée Géante 🙈' ,
          'Arbre à gobelins' : 'Arbre à gobelins 🙈',
          'Automate' : 'Automate 👁️👁️',
          'Barghest' : 'Barghest 👁️👁️',
          'Babélien' : 'Babélien 🙈',
          'Basilic' : 'Basilic 🙈 🚨',
          'Béhir' :  'Béhir 👁️ 🚨',
          'Boggart' : 'Boggart 🙈',
          'Bondin' : 'Bondin 🙈 ',
          'Brontoscorpion' : 'Brontoscorpion 🙈',
          'Bulette' :  'Bulette 👁️',
          'Cattis' : 'Cattis 👁️👁️' ,
          'Caillouteux' : 'Caillouteux 🙈',
          'Cerbère' :  'Cerbère 👁️👁️👁️ 💉💉',
          'Centaure' : 'Centaure 🙈' ,
          'Chauve-souris Géante' : 'Chauve-souris Géante 🙈',
          'Chimère' : 'Chimère 👁️👁️ 🚨' ,
          'Cockatrice' : 'Cockatrice 🙈 🚨',
          'Colosse de pierre' :  'Colosse de pierre 👁️👁️👁️',
          'Crapaud démoniaque' :  'Crapaud démoniaque 👁️',
          'Crapaud Géant' : 'Crapaud Géant 🙈',
          'Croquemitaine' : 'Croquemitaine 🙈',
          'Cyclope' : 'Cyclope 🙈',
          'Danseur de Mort' :  'Danseur de Mort 👁️',
          'Diablotin' : 'Diablotin 👁️',
          'Dao' : 'Dao 👁️👁️',
          'Dumb' : 'Dumb 🙈',
          'Djinn' : 'Djinn 👁️👁️',
          'Dragon' : 'Dragon 🔥',
          'Dryade' :  'Dryade 👁️👁️👁️',
          'Effrit' : 'Effrit 🔥 ',
          'Elémentaire de Terre' :  'Elémentaire de Terre 👁️ 🔥',
          "Elémentaire d'Eau"  :  "Elémentaire d'Eau 👁️ 🔥",
          'Elémentaire de Feu' :  'Elémentaire de Feu 👁️ 🔥',
          'Elfe' : 'Elfe 🙈',
          'Ent' : 'Ent 👁️👁️',
          'Erinyes' : 'Erinyes 👁️ 🚨',
          'Escargot' : 'Escargot 🙈',
          'Ettercap' : 'Ettercap 🙈',
          'Ettin' : 'Ettin 🙈',
          'Eusmilus' : 'Eusmilus 🙈',
          'Fantôme' : 'Fantôme 🙈',
          'Feu follet' : 'Feu follet 🙈 🔥',
          'Fongoïde' : 'Fongoïde 🙈',
          'Furgolin' : 'Furgolin 🙈',
          'Fungus Géant' :  'Fungus Géant 👁️',
          'Fungus Violet' : 'Fungus Violet 👁️👁️',
          'Galopin' : 'Galopin 🙈',
          'Géant des Collines' : 'Géant des Collines 🙈',
          'Géant du Feu' : 'Géant du Feu 🙈',
          'Géant des Nuages' :  'Géant des Nuages 👁️',
          'Géant des Tempêtes' :  'Géant des Tempêtes 👁️',
          'Géant du Froid' :  'Géant du Froid 👁️',
          'Géant de Pierre' :  'Géant de Pierre 👁️',
          'Gnoll' : 'Gnoll 🙈',
          'Gnome de pierre' :  'Gnome de pierre 👁️',
          'Gelée ocre' : 'Gelée ocre 🙈 🚨',
          'Glouton' : 'Glouton 🙈',
          'Glouton Sanguinaire' : 'Glouton Sanguinaire 🙈',
          'Gnome Artificier' : 'Gnome Artificier 🙈',
          'Goblours' : 'Goblours 🙈',
          'Golem de Fer' : 'Golem de Fer 🙈',
          'Golem de Pierre' : 'Golem de Pierre 🙈',
          'Gorille démoniaque' : 'Gorille démoniaque 🙈 🚨',
          'Gorgone' :  'Gorgone 👁️ 🚨',
          'Goule' :  'Goule 👁️',
          'Gremlins' : 'Gremlins 🙈',
          'Grouilleux' : 'Grouilleux 🙈',
          'Griffon' :  'Griffon 👁️',
          'Guêpe géante' :  'Guêpe géante 👁️ 💉',
          'Harpie' : 'Harpie 🙈',
          'Hellrot' : 'Hellrot 👁️👁️',
          'Homme-Lézard' : 'Homme-Lézard 🙈',
          'Homothérium' :  'Homothérium 👁️',
          'Horreur chasseresse' : 'Horreur chasseresse 👁️👁️',
          'Hippopotame furieux' : 'Hippopotame furieux 🙈',
          'Hippogriffe' :  'Hippogriffe 👁️',
          'Halfelin' : 'Halfelin 🙈',
          'Hurleur' : 'Hurleur 🙈 🚨',
          'Incube' :  'Incube 👁️',
          'Illithid' :  'Illithid 👁️👁️👁️',
          'Kappa' : 'Kappa 🙈',
          'Kobold' : 'Kobold 🙈',
         	'Lacodon' : 'Lacodon 🙈 🚨',
          'Lapin Sanguinaire' : 'Lapin Sanguinaire 🙈',
          'Larbin démoniaque' :  'Larbin démoniaque 👁️',
          'Légion-en-peine' : 'Légion-en-peine 👁️👁️ 😵',
          'Lémure' :  'Lémure 👁️',
          'Lézard Géant' : 'Lézard Géant 🙈',
          'Licorne' : 'Licorne 🙈 🚨',
          'Limace Géante' : ' Limace Géante 🙈 🚨',
          'Loup-garou' : 'Loup-garou 🙈',
          'Lutin' : 'Lutin 🙈 💉',
          'Macrauchenia' : 'Macrauchenia 🙈' ,
          'Mante religieuse géante' : 'Mante religieuse géante 🙈 🚨',
          'Manticore' : 'Manticore 🙈',
          'Marid' : 'Marid 👁️👁️',
          'Marmotte' : 'Marmotte 🙈' ,
          'Méduse' : 'Méduse 🙈 🚨',
          'Meganeura' : 'Meganeura 🙈',
          'Megantereon' : 'Megantereon 🙈',
          'Méphite Aérien' : 'Méphite Aérien 🙈 🔥',
          'Méphite de Feu' : 'Méphite de Feu 🙈 🔥',
          'Méphite Aqueux' : 'Méphite Aqueux 🙈 🔥' ,
          'Méphite de Glace' : 'Méphite de Glace 🙈 🔥',
          'Méphite de Verre' : 'Méphite de Verre 🙈 🔥',
          'Méphite Magmatique' : 'Méphite Magmatique 🙈 🔥',
          'Méphite Sulfureux' : 'Méphite Sulfureux 🙈 🔥',
         	'Mille-pattes géant' : 'Mille-pattes géant 👁️ ',
          'Mimique' : 'Mimique 🙈 🚨',
          'Minotaure' : 'Minotaure 🙈',
          'Molosse Satanique' :  'Molosse Satanique 👁️ 🔥',
          'Momie' : 'Momie 👁️ ',
          'Monstre Rouilleur' : 	'Monstre Rouilleur 🙈',
          'Naga' : 'Naga 🙈 ',
          'Nécrophage' : 'Nécrophage 🙈 💉',
          "Nuage d'insectes" : "Nuage d'insectes 🙈",
          'Nuée de Vermines' : 'Nuée de Vermines  🙈',
          'Ombre' :  'Ombre 👁️',
          'Ondine' : 'Ondine 👁️ 🔥',
          'Oni' : 'Oni 👁️👁️ 😵 🚨',
          'Oiseau-Tonnerre' : 'Oiseau-Tonnerre 🙈',
          'Onyx' : 'Onyx 🙈',
          'Orque Noir' : 'Orque Noir 🙈',
          'Otyugh' : 'Otyugh 🙈',
          'Ours hibou' : 'Ours hibou 👁️ ',
          'Ours des Montagnes' : 'Ours des Montagnes 🙈',
          'Orque': 'Orque 🙈',
          'Plante Carnivore' :  'Plante Carnivore 👁️',
          'Pégase' : 'Pégase 🙈',
          'Pseudo-Dragon' :  'Pseudo-Dragon 🙈',
          'Rakshah' : 'Rakshah 👁️👁️',
          'Rat-garou' : 'Rat-garou 🙈',
          'Rat Géant' : 'Rat Géant 🙈',
          'Rocketeux' : 'Rocketeux 🙈',
          'Sagouin' : 'Sagouin 🙈',
          'Scarabée Géant' : 'Scarabée Géant 🙈 💉',
          'Shai' : 'Shai 👁️👁️ 🔥',
          'Sphinx' : 'Sphinx 👁️👁️',
          'Slaad' : 'Slaad 🙈',
          'Salamandre' :  'Salamandre 👁️ 🔥',
          'Strige': 'Strige 🙈',
          'Squelette' :  'Squelette 👁️',
          'Spectre' :  'Spectre 👁️',
          'Sprigan' : 'Sprigan 🙈',
          'Sylphide' :  'Sylphide 👁️ 🔥',
          'Taureau démoniaque' : 'Taureau démoniaque 👁️👁️ 🚨',
          'Tertre errant' :  'Tertre errant 👁️ 🚨',
          'Thri-kreen' : 'Thri-kreen 🙈',
         	'Tigre à Dents de Sabre' : 'Tigre à Dents de Sabre 🙈',
          'Tigre-garou' : 'Tigre-garou 🙈',
          'Titan' : 'Titan 🙈',
          'Tortue Carnivore' : 'Tortue Carnivore 🙈',
          'Tutoki': 'Tutoki 🙈 🚨',
          'Troglodyte' :  'Troglodyte 👁️',
          'Troll' :  'Troll 👁️',
          'Vampire \\b' : 'Vampire 👁️👁️ 😵',
          'Vampire Archaïque' : 'Vampire Archaïque 👁️👁️ 😵',
          'Viverne' : 'Viverne 🙈 💉💉',
          'Ver Géant Carnivore' : 'Ver Géant Carnivore 🙈',
          'Worg' : 'Worg 🙈',
          'Yéti' : 'Yéti 🙈 🚨',
          'Zombi' :  'Zombi 👁️',

        };


    const tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'];

      function prepareRegex(string) {
        return string.replace(/(\({2}|([\[\]\^\&\$\.\?\/\\\+\{\}])|\)$)/g, '\\$1');
      }




    function getTooltipText(icon) {
      switch (icon) {


        case 'Ankheg 🙈':
        case 'Amibe Géante 🙈':
        case 'Anaconda des Catacombes 🙈':
        case 'Araignée Géante 🙈' :
        case 'Arbre à gobelins 🙈':
        case 'Babélien 🙈':
        case 'Basilic 🙈':
        case 'Boggart 🙈':
        case 'Bondin 🙈':
        case 'Caillouteux 🙈':
        case 'Centaure 🙈' :
        case 'Chauve-souris Géante 🙈':
        case 'Cockatrice 🙈':
        case 'Crapaud Géant 🙈':
        case 'Croquemitaine 🙈':
        case 'Cyclope 🙈':
        case 'Dumb 🙈':
        case 'Elfe 🙈':
        case 'Escargot 🙈':
        case 'Ettin 🙈':
        case 'Eusmilus 🙈':
        case 'Fantôme 🙈':
        case 'Fongoïde 🙈':
        case 'Furgolin 🙈':
        case 'Galopin 🙈':
        case 'Géant des Collines 🙈':
        case 'Géant du Feu 🙈' :
        case 'Gnoll 🙈':
        case 'Gelée ocre 🙈':
        case 'Glouton 🙈':
        case 'Glouton Sanguinaire 🙈':
        case 'Gnome Artificier  ':
        case 'Goblours 🙈':
        case 'Golem de Fer 🙈':
        case 'Golem de Pierre 🙈':
        case 'Gorille démoniaque 🙈':
        case 'Gremlins 🙈':
        case 'Grouilleux 🙈':
        case 'Harpie 🙈':
        case 'Homme-Lézard 🙈':
        case 'Hippopotame furieux 🙈':
        case 'Halfelin 🙈':
        case 'Hurleur 🙈':
        case 'Kappa 🙈':
        case 'Kobold 🙈':
        case 'Lacodon 🙈':
        case 'Lapin Sanguinaire 🙈':
        case 'Lézard Géant 🙈':
        case 'Licorne 🙈':
        case 'Limace Géante 🙈':
        case 'Loup-garou 🙈':
        case 'Macrauchenia 🙈':
        case 'Mante religieuse géante 🙈':
        case 'Manticore 🙈':
        case 'Marmotte 🙈':
        case 'Méduse 🙈':
        case 'Meganeura 🙈':
        case 'Megantereon 🙈':
        case 'Mimique 🙈':
        case 'Minotaure 🙈':
        case 'Monstre Rouilleur 🙈':
        case 'Naga 🙈':
        case "Nuage d'insectes 🙈":
        case 'Nuée de Vermines  🙈':
        case 'Oiseau-Tonnerre 🙈':
        case 'Onyx 🙈':
        case 'Orque Noir 🙈':
        case 'Otyugh 🙈':
        case 'Ours des Montagnes 🙈':
        case 'Orque 🙈':
        case 'Pégase 🙈':
        case 'Pseudo-Dragon 🙈':
        case 'Rat-garou 🙈':
        case 'Rat Géant 🙈':
        case 'Rocketeux 🙈':
        case 'Sagouin 🙈':
        case 'Slaad 🙈':
        case 'Sprigan 🙈':
        case 'Strige 🙈':
        case 'Thri-kreen 🙈':
        case 'Tigre à Dents de Sabre 🙈':
        case 'Tigre-garou 🙈':
        case 'Titan 🙈':
        case 'Tortue Carnivore 🙈':
        case 'Tutoki 🙈':
        case 'Ver Géant Carnivore 🙈':
        case 'Worg 🙈':
        case 'Yéti 🙈':

          return "Ne voit pas le caché";


      case 'Ame-en-peine 👁️':
      case 'Béhir 👁️':
      case 'Bulette 👁️':
      case 'Crapaud démoniaque 👁️':
      case 'Danseur de Mort 👁️':
      case 'Diablotin 👁️':
      case 'Erinyes 👁️':
      case 'Fungus Géant 👁️':
      case 'Géant des Nuages 👁️':
      case 'Géant des Tempêtes 👁️':
      case 'Géant du Froid 👁️':
      case 'Géant de Pierre 👁️':
      case 'Gnome de pierre 👁️':
      case 'Gorgone 👁️':
      case 'Goule 👁️':
      case 'Griffon 👁️':
      case 'Homothérium 👁️':
      case 'Hippogriffe 👁️':
      case 'Incube 👁️':
      case 'Larbin démoniaque 👁️':
      case 'Lémure 👁️':
      case 'Mille-pattes géant 👁️':
      case 'Momie 👁️':
      case 'Ombre 👁️':
      case 'Ours hibou 👁️':
      case 'Plante Carnivore 👁️':
      case 'Squelette 👁️':
      case 'Spectre 👁️':
      case 'Tertre errant 👁️':
      case 'Troglodyte 👁️':
      case 'Troll 👁️':
      case 'Zombi 👁️':

          return "Voit très partiellement le caché";


      case 'Automate 👁️👁️':
      case 'Barghest 👁️👁️':
      case 'Cattis 👁️👁️':
      case 'Chimère 👁️👁️':
      case 'Dao 👁️👁️':
      case 'Djinn 👁️👁️':
      case 'Ent 👁️👁️':
      case 'Hellrot 👁️👁️':
      case 'Horreur chasseresse 👁️👁️':
      case 'Marid 👁️👁️':
      case 'Rakshah 👁️👁️':
      case 'Sphinx 👁️👁️':
      case 'Taureau démoniaque 👁️👁️':
      case 'Fungus Violet 👁️👁️':

          return "Voit partiellement le caché";


      case 'Colosse de pierre 👁️👁️👁️':
      case 'Dryade 👁️👁️👁️':
      case 'Illithid 👁️👁️👁️':

          return "Voit completement le caché";

      case 'Oni 👁️👁️ 😵':
      case 'Légion-en-peine 👁️👁️ 😵':
      case 'Vampire 👁️👁️ 😵':
      case 'Vampire Archaïque 👁️👁️ 😵':

          return "Voit partiellement le caché et Drain d'énergie";

        case 'Dragon 🔥':
        case 'Effrit 🔥 ':

           return "Dégats de zone";


      case 'Abishaii Blanc 👁️ 💉':
      case 'Abishaii Bleu 👁️ 💉':
      case 'Abishaii Noir 👁️ 💉':
      case 'Abishaii Rouge 👁️ 💉':
      case 'Abishaii Vert 👁️ 💉':
      case 'Guêpe géante 👁️ 💉':

           return "Voit très partiellement le caché et venin";

      case 'Lutin 🙈 💉':
      case 'Scarabée Géant 🙈 💉':
      case 'Nécrophage 🙈 💉':

          return "Ne voit pas le caché et venin";

      case 'Méphite Aérien 🙈 🔥':
      case 'Méphite de Feu 🙈 🔥':
      case 'Méphite Aqueux 🙈 🔥' :
      case 'Méphite de Glace 🙈 🔥':
      case 'Méphite de Verre 🙈 🔥':
      case 'Méphite Magmatique 🙈 🔥':
      case 'Méphite Sulfureux 🙈 🔥':

          return "Ne voit pas le caché et dégats de zone";
      case  'Elémentaire de Terre 👁️ 🔥':
      case 'Molosse Satanique 👁️ 🔥':
      case 'Ondine 👁️ 🔥':
      case 'Salamandre 👁️ 🔥':
      case 'Sylphide 👁️ 🔥':
      case 'Elémentaire de Terre 👁️ 🔥':
      case "Elémentaire d'Eau 👁️ 🔥":
      case 'Elémentaire de Feu 👁️ 🔥':

          return "Voit très partiellement le caché et dégats de zone";

      case 'Shai 👁️👁️ 🔥':
            return "Voit partiellement le caché et dégats de zone";
      case 'Viverne 🙈 💉💉':
          return "Ne voit pas le caché et venin virulent";
      case 'Feu follet 🙈 🔥':
          return "Ne voit pas le caché et dégats de zone et venin virulent";
     case  'Cerbère 👁️👁️👁️ 💉💉':
          return "Voit completement le caché et venin virulent";
      case 'Abishaii Multicolore 👁️👁️ 💉':
          return "Voit partiellement le caché et venin";



      }
    }

      $(document).ready(function() {
        'use strict';



        var regexs = [],
            replacements = [],
            rIsRegexp = /^\/(.+)\/([gim]+)?$/,
            word, text, texts, i, userRegexp;

        for (word in words) {
          if (typeof word === 'string' && words.hasOwnProperty(word)) {
            userRegexp = word.match(rIsRegexp);

            // Ajout des expressions régulières et des remplacements
            if (userRegexp) {
              regexs.push(new RegExp(userRegexp[1], 'g'));
            } else {
              regexs.push(new RegExp(prepareRegex(word).replace(/\\?\*/g, function(fullMatch) {
                return fullMatch === '\\*' ? '*' : '[^ ]*';
              }), 'g'));
            }
            replacements.push(words[word]);
          }
        }

        // Sélecteur pour toutes les cellules de la cinquième colonne
        var cells = document.querySelectorAll('#TCREATURES > center:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr > td:nth-child(5)');

        // Boucle à travers toutes les cellules de la cinquième colonne
        cells.forEach(function(cell) {
          var cellContent = cell.textContent;
          var originalContent = cell.innerHTML;

          regexs.forEach(function(value, index) {
            var replacementIcon = replacements[index];
            var tooltipText = getTooltipText(replacementIcon);

            cellContent = cellContent.replace(value, function(match) {
              // Ajout du tooltip avec la signification de l'icône
              return `<span title="${tooltipText}">${replacementIcon}</span>`;
            });
          });

          cell.innerHTML = cellContent;

              // Ajout de la classe 'monster-column' pour empêcher le retour à la ligne
          cell.classList.add('monster-column');

          // Ajout des styles CSS directement ici
          cell.style.whiteSpace = 'nowrap';


        });




             // Création du bouton "Légende"
            var legendButton = document.createElement('button');
            legendButton.textContent = 'Légende';
        legendButton.style.display = 'block';
            legendButton.style.margin = 'auto';
            legendButton.addEventListener('click', function(event) {
                event.stopPropagation(); // Empêche la propagation de l'événement de clic
                // Création de la fenêtre modale pour afficher la légende
                var modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';

                // Contenu de la légende
                var legendContent = document.createElement('div');
                legendContent.style.backgroundColor = 'rgb(255,235,205)';
                legendContent.style.padding = '20px';
                legendContent.style.borderRadius = '5px';

                // Ajout de chaque élément de la légende
        var legendItems = {
            '🥰': 'créatures amies',
            '🙈': 'ne voit pas le caché',
            '👁️': 'voit très partiellement le caché',
            '👁️👁️': 'voit partiellement le caché',
            '👁️👁️👁️': 'voit complètement le caché',
            '💉': 'venin',
            '🔥': 'PV-',
            '😵': 'drain d\'énergie',
            '🚨': 'enlève de l\'esquive'
        };

        for (var emoji in legendItems) {
            var legendItem = document.createElement('div');
            legendItem.textContent = `${emoji}: ${legendItems[emoji]}`;
            legendContent.appendChild(legendItem);
        }



    //ajout des textes surlignés en couleur
    var highlightText4 = document.createElement('div');
    highlightText4.textContent = 'Gobelin';
    highlightText4.style.backgroundColor = "#ccccff" ;
    highlightText4.style.color = 'black';
    highlightText4.style.padding = '5px';
    highlightText4.style.borderRadius = '5px';
    highlightText4.style.marginTop = '10px';
    // Ajout du texte surligné à la légende
    legendContent.appendChild(highlightText4);


    // Création de l'élément pour le texte "Niveau supérieur à 35"
    var highlightText = document.createElement('div');
    highlightText.textContent = 'Monstre lvl supérieur à 39';
    highlightText.style.backgroundColor = '#f55442';
    highlightText.style.color = 'white';
    highlightText.style.padding = '5px';
    highlightText.style.borderRadius = '5px';
    highlightText.style.marginTop = '10px';
    // Ajout du texte surligné à la légende
    legendContent.appendChild(highlightText);


     var highlightText2 = document.createElement('div');
    highlightText2.textContent = 'Monstre lvl supérieur à 29';
    highlightText2.style.backgroundColor = '#f59c42';
    highlightText2.style.color = 'white';
    highlightText2.style.padding = '5px';
    highlightText2.style.borderRadius = '5px';
    highlightText2.style.marginTop = '10px';
    // Ajout du texte surligné à la légende
    legendContent.appendChild(highlightText2);


     var highlightText3 = document.createElement('div');
    highlightText3.textContent = 'Monstre lvl supérieur à 25';
    highlightText3.style.backgroundColor = '#f5b342';
    highlightText3.style.color = 'white';
    highlightText3.style.padding = '5px';
    highlightText3.style.borderRadius = '5px';
    highlightText3.style.marginTop = '10px';
    // Ajout du texte surligné à la légende
    legendContent.appendChild(highlightText3);


    var highlightText5 = document.createElement('div');
    highlightText5.textContent = 'Vieilles créatures';
    highlightText5.style.backgroundColor = '#c791b1';
    highlightText5.style.color = 'white';
    highlightText5.style.padding = '5px';
    highlightText5.style.borderRadius = '5px';
    highlightText5.style.marginTop = '10px';
    // Ajout du texte surligné à la légende
    legendContent.appendChild(highlightText5);

    var highlightText6 = document.createElement('div');
    highlightText6.textContent = 'Suivant/Créature controlé par un Gob';
    highlightText6.style.backgroundColor = '#ffadde';
    highlightText6.style.color = 'black';
    highlightText6.style.padding = '5px';
    highlightText6.style.borderRadius = '5px';
    highlightText6.style.marginTop = '10px';
    // Ajout du texte surligné à la légende
    legendContent.appendChild(highlightText6);


    // Création de l'élément pour l'espace
    var space = document.createElement('div');
    space.style.height = '10px'; // Vous pouvez ajuster la hauteur selon vos besoins
    // Ajout de l'espace à la légende
    legendContent.appendChild(space);



                // Bouton pour fermer la fenêtre modale
                var closeButton = document.createElement('button');
                closeButton.textContent = 'Fermer';
                closeButton.addEventListener('click', function() {
                    document.body.removeChild(modal);
                });

                legendContent.appendChild(closeButton);
                modal.appendChild(legendContent);

                // Ajout de la fenêtre modale à la page
                document.body.appendChild(modal);
            });

            // Sélection de l'élément à côté duquel vous voulez placer le bouton "Légende"
            var referenceElement = document.querySelector('html body div#content div#identite table.gf tbody tr td.gfmm h1');

            // Création d'un conteneur pour les boutons
            var buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '10px';

            // Ajout du bouton "Légende" à ce conteneur
            buttonContainer.appendChild(legendButton);

            // Insérer le conteneur des boutons sous l'élément de référence
            referenceElement.parentNode.insertBefore(buttonContainer, referenceElement.nextSibling);
        });
    };


    if ($(location).attr('href').match(/http:\/\/(.*\.)?gobland\.fr\/Vue\.php|http:\/\/(.*\.)?gobland\.fr\/ProfilPerso\.php/i)) {

      const words = {
          // Clan et CM
          '((50125|411|346|330|286|388|386|387|83|407|456|164|407|385|405|393|46237|95720|130171|46237|47717|95720|130171|53|101759|101|50127|95982|108284|100794|94082|108|121|129|141|180|48520|66516|69423|119472|32954|135982|137884|146091|141303|141548|145977|153064|153598|147777|153645|152330|155811|163670|109|122306|90657|171796|177616|176978))' : '🥰',

        // méchants
        '((50|104|151691|270|267))' : '🔴',


          // Icônes équipement
          'Potion' : 'Potion 🧪',
          'Parchemin' : 'Parchemin 📜📜📜📜📜📜📜alerte📜📜📜📜📜📜📜📜📜📜',
          'CT| Canines de Trõll' : ' CT 💰',
          'Anneau' : 'Anneau 💍 ',
          'Bouclier' : 'Bouclier 🛡️',
          'Corps' : 'Corps ☠️',
          'Arme 1 Main' : 'Arme 1 main 🗡️',
          'Outil' : "Outil 🔧",
          'Nourriture' : 'Nouriture 🍔',
          'Rondin' : 'Rondin 🪵',

          // Dans Mon Profil
          'Santé' : 'Santé ❤️',
          'Echéance du Tour' : 'Echéance du Tour⏱️',
          'Combat' : 'Combat ⚔️',
          'Affinités' : 'Affinités ✨',
          'Position' : 'Position 🧭',
          'Description' : 'Description 📜',
          'Expérience' : 'Expérience 🇽🇵',
          'Actions programmées': 'Actions programmées ⏰',


          'Empathie' : 'Empathie 🫂',
          'Sociale' : 'Sociale 🫂',
          'Flux Obscur' : 'Flux Obscur ⚫',
          'Voile Obscur' : 'Voile Obscur ⚫',
          'Magie' : 'Magie 🪄',
          'Psychique' : 'Psychique 🧠',
          'Physique' : 'Physique 💪',
          'Corporelle' :  'Corporelle💪',
          'Technologie' : 'Technologie ⚙️',

          // Diverses icônes
          'Baguette' : 'Baguette 🪄 ',
          'Escalier' : 'Escalier 🪜 ',
          //'Baie' : 'Baie 🫐',
          //'Arbre' :     'Arbre 🌳',
          //'Fleur' : 'Fleur 🌷',
          'Zone de ténèbres' : 'Zone de ténèbres 🌫️',
          'Porte' : 'Porte 🚪',
          '':''
        };

      const tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'];

      function prepareRegex(string) {
        return string.replace(/(\({2}|([\[\]\^\&\$\.\?\/\\\+\{\}])|\)$)/g, '\\$1');
      }

      function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
      }

      function enhanceText() {
        'use strict';

        // enclenchement des remplacements et ajouts d'icones
        var regexs = [],
            replacements = [],
            rIsRegexp = /^\/(.+)\/([gim]+)?$/,
            word, text, texts, i, userRegexp;

        for (word in words) {
          if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(new RegExp(userRegexp[1], 'g'));
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }
            replacements.push(words[word]);
          }
        }

        texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
        for (i = 0; text = texts.snapshotItem(i); i += 1) {
            if ( tagsWhitelist.indexOf(text.parentNode.tagName) ) {
                regexs.forEach(function (value, index) {
                    text.data = text.data.replace( value, replacements[index] );
                });
            }
        }
      };

      $( document ).ready(function() {
        enhanceText();
      });

    };





