// ==UserScript==
// @name     MM Calcul temps
// @version  0.10.7
// @grant    none
// @include    https://manymore.bodet-software.com/open/global
// @include    https://manymore.bodet-software.com/open/webgtp/declarebadge
// @description Calcul du total pointé dans Kelio
// @author Philippe Villiers
// @namespace https://greasyfork.org/users/181452
// @downloadURL https://update.greasyfork.org/scripts/40939/MM%20Calcul%20temps.user.js
// @updateURL https://update.greasyfork.org/scripts/40939/MM%20Calcul%20temps.meta.js
// ==/UserScript==

var tabPrincipale = document.querySelectorAll('table.bordered')[0];
var isCorrectPage = document.querySelectorAll('a.applicationselectionne[href="javascript:fcChangeAppli(7)"]').length === 1;
var lines = null;
var totalWeeklyTime = 0;
var timeStart = 0;
var lastTimeStart = 0;
var timeEnd = 0;
var nbColonnes, nbColonnesCurr = 0;
var cptHeure = 0;
var heure = '';
var totalDailyTime = {};
var isAbsent = false;
var isFerie = false;
var nbAbsences = 0;
var nbFeries = 0;
var totalCptHeures = 0;
const linesStart = 2;
const DEFAULT_TIME_MODE = 1;
const REDUCED_TIME_MODE = 2;
var referenceTimes = {
    rttOff: {
        maxWeeklyTime: 2100, // 35h
        maxDailyTime: 420 // 7h
    },
    rttOn: {
        maxWeeklyTime: 2220, // 37h
        maxDailyTime: 444 // 7h24
    }
};
var maxWeeklyTime = referenceTimes.rttOn.maxWeeklyTime;
var maxDailyTime = referenceTimes.rttOn.maxDailyTime;

var hourWorkMode = parseInt(localStorage.getItem('hourMode'));
if (!hourWorkMode) {
    hourWorkMode = DEFAULT_TIME_MODE;
}

if (hourWorkMode !== DEFAULT_TIME_MODE) {
    maxWeeklyTime = referenceTimes.rttOff.maxWeeklyTime;
    maxDailyTime = referenceTimes.rttOff.maxDailyTime;
}
var joursFeries = [];

var cssStrings = `
  #mm-options-window-parent {
    z-index:999;
	width: 100%;
	height: 100%;
	display: none;
	position: absolute;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.6);
  }
  #mm-options-window {
    width: 300px;
    height: auto;
    border: 1px solid #6692BC;
    border-radius: 5px;
    padding: 6px;
    margin: 250px auto;
    color: #000;
    background-color: #eff4fa;
  }
  #mm-options-window h3 {
    text-align: center;
  }
  
  #mm-options {
    z-index: 500;
    width: 32px;
    height: 32px;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 5px;
  }
`;

addStyleString(cssStrings);

var divOptions = document.createElement('div');
divOptions.id = 'mm-options-window-parent';
var divOptionsHTML = '<div id="mm-options-window"><h3>Options</h3>';
divOptionsHTML += '<p><label for="mm-select-time-type">Type de contrat (horaires hebdo.)</label>&nbsp;:&nbsp;';
divOptionsHTML += '<select id="mm-select-time-type" name="mmTimeType"><option selected="selected" value="1">37h</option><option value="2">35h</option></select></p>';
if (typeof GM !== 'undefined') {
    divOptionsHTML += '<p><small><i>MM Calcul temps v' + GM.info.script.version + '</i></small></p>';
}
divOptionsHTML += '<a class="boutonAction" id="mm-options-validate" href="#">Valider</a>';
divOptionsHTML += '</div>';
divOptions.innerHTML = divOptionsHTML;

var imgOptions = document.createElement('img');
imgOptions.setAttribute('id', 'mm-options');
imgOptions.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAD40lEQVRYhdWWTWgaaRjHBwJCIdBTIddAoIfQU6/p0rLtpii4hHXYPVgaNDFZk9S6qatpxjhBwdJCvqgmGqPxY6L7jLh0aWrraNRYvwVPhUKhsOBVCAhCT+8esso4znSnxQ27D/wu8/6f5/8fh/d9xbD/Y2khPWyG0vUOBJRHLzSAJVqzW6I11IWu/YkDSC7E3ACVEQtda/UEiNbQGlTVAzUioDxKQFXOfbO1aGVrLVpFXMx05SMOMMTW4gBDK3B65SvNKw0zXUUEVM8IKAcIKKvNUE2Y6SoSBKoJAqryx1CWrULFZ4ZKk4BKwwSFsS8yX4Vyg4AKGhSrUBYf4nGk5Fr9rYz+Bd6LCmAM52UrkRIaOOEiJSoAToLEGC42TeES4sMYLraNRyXaRJU0HYxHJdoYLraFes778jJRATAMwwyhQvxXqoi4GEKFmMGXHuHt8aVHDKFCjLePKjRxUuQ5oXWkhx+F8i1DqIB6COZdosIH866+3lDhTONiLv9js+7g5OpyMEcvB98iDnW+N9D7ste4z3ASJMvBt3XujF8COZug8aIve03vz1F6fw7x8dB/qugx9md1en+u/fd6W+/P6tjrD/2nCt5Zh7mazpe50xfggS9L6Q5PkQCf8A241NEuedMKPt2SN90NiW/AJd3haVto5gNfdqv3F/BmqCVvFvFykH3H0Sb4dIveTIKtWzrIvhOauejN9G7JBU+GWjjIID60nvQHjrbAq/VkCmyd1pP+IDRzwcMJMO9Obf28n0Z8zO+f9HyCeVfKxKtzpUzsTzC/f/LpMzP7DyWNi5Fp3Mn6nDuFuMzupqa6w0mQzLmTiV5NMsHeJbO7qSm+OXPuFNK4UpTGxfTtnm7N7DL22b0kYjOzx9RxvPeqVTmYiRlnUqNyMBPs5zgOQzN7TL1vxm6SVjnjVwWNuwOeMJfVDqaldjKIjcrJiDqIVE7Gxe1VO5gW7oBhMf0YToJk+vnr5rTjDeJy//mb2LTjmPconnYcj5yv8/W9josyxzAMU26+lN3biSMhlDvxlnL7FX1vO67poNx+RSt34i3Bvu24+Lvgx41j6qfNYzRo8M2X4m5DxdMX7xXP/kCD5oenL5yiAsjtMCa3xxrfP/kdDQq5PdaQ20H8/8JJEsZkNrohtdJNqTUauGsF+d11mJJa6ZTMFkVCSG10QmYFtdQaDUht9Nn5c7oxSX6BeadurMAVjLP3MRyGvluHj5PrgPogoeeCGSdBcmcNpr7K/HN12xzR3LZEEJtvLZHWTYOPd3sOvMZxUnKLOGrcMh+hDjfNIfuFmHfqm0eB0QkTdb3DuNYh7pT7L9Zf9Yc8fzr/C1sAAAAASUVORK5CYII=');
imgOptions.setAttribute('alt', 'Img options MM');
imgOptions.setAttribute('title', 'Options calcul MM');
imgOptions.addEventListener('click', function () {
    document.body.appendChild(divOptions);
    document.getElementById('mm-options-validate').addEventListener('click', function (evt) {
        updateOptions();
        evt.preventDefault();
    });
    divOptions.style.display = 'block';
});

document.body.appendChild(imgOptions);

// Démarage du calcul
startCalculation();

function closeWindow() {
    document.getElementById('mm-options-window-parent').remove();
}

function updateOptions() {
    var list = document.getElementById('mm-select-time-type');
    var chosenMode = parseInt(list.options[list.selectedIndex].value);
    switch (chosenMode) {
        case DEFAULT_TIME_MODE:
            maxWeeklyTime = referenceTimes.rttOn.maxWeeklyTime;
            maxDailyTime = referenceTimes.rttOn.maxDailyTime;
            break;
        case REDUCED_TIME_MODE:
            maxWeeklyTime = referenceTimes.rttOff.maxWeeklyTime;
            maxDailyTime = referenceTimes.rttOff.maxDailyTime;
            break;
        default:
            closeWindow();
            return;
    }
    localStorage.setItem('hourMode', '' + chosenMode);
    resetValues();
    startCalculation();
    closeWindow();
}


/**
 * @param html
 * @returns {Document}
 */
function htmlToElement(html) {
    var parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
}

/**
 *
 * @param str
 */
function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}

/**
 * Remise à 0 des valeurs pour un nouveau calcul
 */
function resetValues() {
    cptHeure = 0;
    timeStart = 0;
    lastTimeStart = 0;
    timeEnd = 0;
    totalDailyTime = {};
    isAbsent = false;
    isFerie = false;
    nbAbsences = 0;
    nbFeries = 0;
    totalCptHeures = 0;
}

/**
 * Calcul
 */
function startCalculation() {
    if (typeof tabPrincipale === 'undefined') {
        return;
    }
    if (!isCorrectPage) {
        return;
    }
    var now = new Date();
    joursFeries = listeJoursFeries(now.getFullYear());
    totalWeeklyTime = 0;
    lines = tabPrincipale.children[0].children;
    if (tabPrincipale.children[0].querySelectorAll('img#imagePlus[src^="/open/img/navRight"]').length > 0) {
        // Il y a une flèche de passage à une page suivante : plus de pointages
        var form = document.formAction;
        // On va d'abord récupérer le contenu de l'autre page
        var httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", form.action);
        httpRequest.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        // On décale la page
        var postData = 'offset=4&ACTION=RAFRAICHIR_DECLARATIONS_BADGE';
        postData += '&dateSelectionnee=' + document.getElementById('dateSelectionnee').getAttribute('value');
        httpRequest.send(postData);
        httpRequest.onload = function () {
            var resultElement = htmlToElement(httpRequest.responseText);
            var tabPrincipaleBis = resultElement.querySelectorAll('table.bordered')[0];
            var linesBis = tabPrincipaleBis.children[0].children;
            // On calcule d'abord le tableau "bis"
            calculateTotalTime(linesBis, false);
            // Puis celui qui est affiché
            totalCptHeures = calculateTotalTime(lines, true);

            displayTotalTime(totalCptHeures);
        };
    } else {
        var totalCptHeures = calculateTotalTime(lines, true);

        displayTotalTime(totalCptHeures);
    }
}

/**
 * Affichage du temps total
 * @param totalCptHeures
 */
function displayTotalTime(totalCptHeures) {
    var existingLine = false;
    // Affichage du temps total
    var totalTimeText = displayTime(totalWeeklyTime);
    var newLine = tabPrincipale.children[0].querySelector('tr.mm-total-time-line');
    if (newLine === null) {
        newLine = document.createElement('tr');
        newLine.setAttribute('class', 'mm-total-time-line');
    } else {
        existingLine = true;
    }
    var newLineHtmlContent = '<td colspan="' + (nbColonnes + 1) + '" class="tabPair">Temps total de la semaine : ';
    if (totalWeeklyTime === 0) {
        newLineHtmlContent += '<em>n/a (aucun pointage ?)</em></td>';
        newLine.innerHTML = newLineHtmlContent;
        if (!existingLine) {
            tabPrincipale.children[0].appendChild(newLine);
        }
        return;
    }
    newLineHtmlContent += '<strong>' + totalTimeText + '</strong>';
    if (nbAbsences > 0 || nbFeries > 0) {
        newLineHtmlContent += '<small> (';
        if (nbAbsences > 0) {
            newLineHtmlContent += nbAbsences + ' absence' + (nbAbsences > 1 ? 's' : '')
        }
        if (nbAbsences > 0) {
            newLineHtmlContent += ' ' + nbFeries + ' férié' + (nbFeries > 1 ? 's' : '')
        }
        newLineHtmlContent += ', ajout simu.)</small>';
    }
    var deltaTime = maxWeeklyTime - totalWeeklyTime;
    var deltaTimeText = displayTime(Math.abs(deltaTime));
    if (deltaTime > 0) {
        newLineHtmlContent += ' (<span style="color: #DD1D36; font-weight: bold">' + deltaTimeText + '</span> restant avant les';
    } else {
        newLineHtmlContent += ' (<span style="color: #277C6B; font-weight: bold">' + deltaTimeText + '</span> dépassés des';
    }
    newLineHtmlContent += ' <strong>' + displayTime(maxWeeklyTime) + '</strong> hebdomadaires';

    // Badgeage impair : on "simule" et calcule un départ
    if (totalCptHeures % 2 !== 0) {
        var now = new Date();
        var hourNow = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
        var minutesNow = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
        var timeNow = hourNow + ':' + minutesNow;
        var currentTime = extractSecondsFromTime(timeNow);
        var deltaTimeOdd = currentTime - lastTimeStart;
        var deltaTime = maxWeeklyTime - totalWeeklyTime - deltaTimeOdd;
        var deltaTimeText = displayTime(Math.abs(deltaTime));
        newLineHtmlContent += ' - ' + displayTime(totalDailyTime + deltaTimeOdd);
        if (deltaTime > 0) {
            newLineHtmlContent += ' (<span style="color: #DD1D36; font-weight: bold">-' + deltaTimeText + '</span>';
        } else {
            if (deltaTime < 0) {
                newLineHtmlContent += ' (<span style="color: #277C6B; font-weight: bold">+' + deltaTimeText + '</span>';
            }
        }
        newLineHtmlContent += ' si <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADE0lEQVQ4jZ3RXU+bBRjG8X4AoslMNs880TOjcS5bCJYNtFRKZ+1sWC0MuxFZZjax0FqobSlrF1pIKUVkPE+fvjwvbBOyIcI22EI2xhxD2EahjsjQOY3ONJlfQJO/Z2s8MdHr9M79u+7k1un+R9bE47G88NGf94Zb/vhPi9+lP3lQkE6wOXmK2aSD5UFn8ekwFAoRDAbx+/34fD68Xi8ej4e2tjYKGRf3M61sfd3D7+vj/Lb6JTMDdr7pt5eAQCCAIAgIgoAoioiiSCqVIpVKsZ5u5XF+jMf5cR4tjvDjjSSXE/XMRw+UAJ/PhyAIvJ88gCAKpFIpJElCkiRWxeP8evcsD+cTbM3F2Jrr41L8Pa5GTCXA6/UiiiKGXj2W3lokSSKdTpNOp1kZbuGXZYWtuRibs2E2ZyNc7LNyKVBd1O0feou6ZDVvx/diiOn5UDvE4ZyDurCBTCZDJpNhadDJz4sZNmfCbEwH2JgKMh2zMNlZUdSZBqrIrg0hriYZvhNncDlG/HYE+4iVGn8V2WyWm/0OfloYYWPKz/0JN09uNjEVrWOs7fWirqavEuFugp5bAboXOvBfb8d/3U33jU4sA7Uc7LJxLWbjh2tDFM57eDTTDIU6ZvqqOXPi5aKuuqfiaWv0Vojwwmd0zXvZnzCy112BLMtciZh5cDVO/tzH5M+08HD6AyZPGckde7Goqzy5h4rgLvZ0vsYuzyu8m6zFnKhB316OLMsoisJ00MD3l6PcU4+ykjnMSraZybABqfmF0hecTie5XI6qT/WUu3ajKAqKoqCqKl916tmYOslK9ghLooNvU01MdL/JaefzJaCxsRFZltnX/gaynENVVVRVRdM0xty7KUwEWBIbWPzCxu1hOxdCVXze+FwJsNvt/2jVNA1N0xgdHWW09VXWxjtYH+8gf7adO7ljXOjaR9L+TFEnCAIulwubzYbVasVisWA2mzGZTBiNRgwGA+mjL3HOvZMJv56LESNXet/hfLCSRH1Z6YJ/y+lDO7YPNW0vH2rYdmTA8Ww0cbBMG2zY9ld/fdmTvwHSoRtmWpResQAAAABJRU5ErkJggg==" alt="sortie" title="sortie"> à ' + timeNow;

    }
    newLineHtmlContent += ')<br><small>En <span style="color: #DD1D36; font-weight: bold">rouge</span> le temps qu\'il manque pour atteindre la "moyenne", en <span style="color: #277C6B; font-weight: bold">vert</span> le temps "supplémentaire"</small>';
    newLineHtmlContent += '</td>';
    newLine.innerHTML = newLineHtmlContent;

    if (!existingLine) {
        tabPrincipale.children[0].appendChild(newLine);
    }
}

/**
 * Calcul du temps total pour des lignes données
 * @param lignesTab
 * @param displayDailyTime
 */
function calculateTotalTime(lignesTab, displayDailyTime) {
    totalCptHeures = 0;
    var nbLignes = lignesTab.length;
    if (displayDailyTime) {
        if (lignesTab[1].querySelector('.mm-header-temps') === null) {
            // Ajout de l'en-tête supplémentaire
            var additionalHeader = document.createElement('th');
            additionalHeader.setAttribute('class', 'tabTitre mm-header-temps');
            additionalHeader.innerHTML = 'Temps';
            lignesTab[1].appendChild(additionalHeader);
            lignesTab[0].children[0].setAttribute('colspan', parseInt(lignesTab[0].children[0].getAttribute('colspan')) + 1);
        }
    }

    for (var i = linesStart; i < nbLignes; i++) {
        if (i === linesStart) {
            nbColonnes = lignesTab[i].children.length;
            nbColonnesCurr = nbColonnes;
        } else {
            nbColonnesCurr = lignesTab[i].children.length;
        }
        isAbsent = false;
        isFerie = false;
        if (parseInt(lignesTab[i].children[0].getAttribute('rowspan')) === 2) {
            // On a une ligne "double"
            var idJour = calculateTimeDay(lignesTab[i], 'span.etatAccepte input, div.inputNonModifiable', displayDailyTime);

            if (displayDailyTime) {
                var isOdd = cptHeure % 2 !== 0;
                displayDailyTimeColumn(lignesTab[i], totalDailyTime[idJour], isOdd, timeStart);
            }
        } else {
            if (parseInt(lignesTab[i].children[0].getAttribute('rowspan')) === 1) {
                // On a une ligne "normale"
                var idJour = calculateTimeDay(lignesTab[i], 'span.etatAccepte input, div.etatGtp');

                if (displayDailyTime) {
                    var isOdd = cptHeure % 2 !== 0;
                    displayDailyTimeColumn(lignesTab[i], totalDailyTime[idJour], isOdd, timeStart);
                }
            } else {
                // On a ligne d'un autre type, mais on va la conserver
            }
        }
    }
    return totalCptHeures;
}

/**
 * Calcul du temps d'un jour
 * @param aDayLine
 * @param dataSelector
 * @param isVisible
 * @returns {string}
 */
function calculateTimeDay(aDayLine, dataSelector, isVisible) {
    timeStart = 0;
    timeEnd = 0;
    cptHeure = 0;
    if (aDayLine.children[1].querySelector('div.etatGtp') != null) {
        var idJour = aDayLine.children[1].querySelector('div.etatGtp').innerText.trim();
    } else {
        var idJour = aDayLine.children[1].querySelector('div.etatAccepte').innerText.trim();
    }
    if (!totalDailyTime.hasOwnProperty(idJour)) {
        totalDailyTime[idJour] = 0;
    }
    if (idJour === 'Sa' || idJour === 'Di') {
        // Week-end, salut bisous
        return idJour;
    }
    var nodesValidation = aDayLine.querySelectorAll(dataSelector);
    if (nodesValidation.length > 0) {
        for (var cptNode = 0; cptNode < nodesValidation.length; cptNode++) {
            if (nodesValidation[cptNode].tagName.toLowerCase() === 'input' && nodesValidation[cptNode].getAttribute('type') !== 'hidden') {
                heure = nodesValidation[cptNode].getAttribute('value');
            } else {
                if (nodesValidation[cptNode].innerText.trim() !== '') {
                    heure = nodesValidation[cptNode].innerText.trim();
                } else {
                    continue;
                }
            }
            // Check moche pour vérifier qu'on a bien une heure
            if (heure.length !== 5) {
                continue;
            }

            cptHeure++;
            totalCptHeures++;
            if (cptHeure % 2 !== 0) {
                timeStart = extractSecondsFromTime(heure);
                lastTimeStart = timeStart;
            } else {
                totalWeeklyTime += (extractSecondsFromTime(heure) - timeStart);
                totalDailyTime[idJour] += (extractSecondsFromTime(heure) - timeStart);
            }
        }
    }

    if (isVisible) {
        // On a une image d'absence + aucun pointage : absence réelle (supposée)
        if (aDayLine.querySelectorAll('#imageAbsence[src^="/open/img/ficheAbsence"]').length > 0) {
            if (totalDailyTime[idJour] === 0) {
                totalWeeklyTime += maxDailyTime;
                isAbsent = true;
            }
            nbAbsences++;
        } else {
            if (estFerie(aDayLine)) {
                totalWeeklyTime += maxDailyTime;
                nbFeries++;
                isFerie = true;
            }
        }
    }

    return idJour;
}

function estFerie(currentLine) {
    if (currentLine.children[2].querySelector('div.etatGtp') != null) {
        var dateJour = currentLine.children[2].querySelector('div.etatGtp').innerText.trim();
    } else {
        var dateJour = currentLine.children[2].querySelector('div.etatAccepte').innerText.trim();
    }
    var dateJourTab = dateJour.split('/');
    var dateJourJS = new Date(parseInt(dateJourTab[2]), parseInt(dateJourTab[1]) - 1, parseInt(dateJourTab[0]), 1,0,0);
    for (var i = 0; i < joursFeries.length; i++) {
        if (parseInt(joursFeries[i].getDate()) === parseInt(dateJourJS.getDate()) && parseInt(joursFeries[i].getMonth()) === parseInt(dateJourJS.getMonth())) {
            return true;
        }
    }

    return false;
}

/**
 * Affiche le temps journalier
 * @param currentLine
 * @param totalDailyTime
 * @param isOdd
 * @param lastTimeStart
 */
function displayDailyTimeColumn(currentLine, totalDailyTime, isOdd, lastTimeStart) {
    var newColTime = currentLine.querySelector('.mm-col-temps');
    var existingColumn = false;
    if (newColTime === null) {
        newColTime = document.createElement('td');
        newColTime.setAttribute('rowspan', currentLine.children[0].getAttribute('rowspan'));
        newColTime.setAttribute('class', currentLine.children[0].getAttribute('class') + ' mm-col-temps');
        if (totalDailyTime === 0 && !isAbsent && !isFerie) {
            currentLine.appendChild(newColTime);
            return;
        }
    } else {
        existingColumn = true;
        if (totalDailyTime === 0 && !isAbsent && !isFerie) {
            newColTime.innerHTML = '';
            return;
        }
    }
    if (isAbsent) {
        totalDailyTime = maxDailyTime;
        var newLineHtmlContent = '(<em>' + displayTime(totalDailyTime) + ' absence - simu.</em>)';
        newColTime.innerHTML = newLineHtmlContent;
        if (!existingColumn) {
            currentLine.appendChild(newColTime);
        }
        return;
    } else {
        if (isFerie) {
            totalDailyTime = maxDailyTime;
            var newLineHtmlContent = '(<em>' + displayTime(totalDailyTime) + ' férié - simu.</em>)';
            newColTime.innerHTML = newLineHtmlContent;
            if (!existingColumn) {
                currentLine.appendChild(newColTime);
            }
            return;
        }
    }
    var newLineHtmlContent = displayTime(totalDailyTime);
    var deltaTime = maxDailyTime - totalDailyTime;
    var deltaTimeText = displayTime(Math.abs(deltaTime));
    if (deltaTime > 0) {
        newLineHtmlContent += ' (<span style="color: #DD1D36; font-weight: bold">-' + deltaTimeText + '</span>)';
    } else {
        if (deltaTime < 0) {
            newLineHtmlContent += ' (<span style="color: #277C6B; font-weight: bold">+' + deltaTimeText + '</span>)';
        }
    }
    if (isOdd) {
        var now = new Date();
        var hourNow = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
        var minutesNow = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
        var timeNow = hourNow + ':' + minutesNow;
        var currentTime = extractSecondsFromTime(timeNow);
        var deltaTimeOdd = currentTime - lastTimeStart;
        var deltaTime = maxDailyTime - totalDailyTime - deltaTimeOdd;
        var deltaTimeText = displayTime(Math.abs(deltaTime));
        newLineHtmlContent += ' ou<br> ' + displayTime(totalDailyTime + deltaTimeOdd);
        if (deltaTime > 0) {
            newLineHtmlContent += ' (<span style="color: #DD1D36; font-weight: bold">-' + deltaTimeText + '</span>)';
        } else {
            if (deltaTime < 0) {
                newLineHtmlContent += ' (<span style="color: #277C6B; font-weight: bold">+' + deltaTimeText + '</span>)';
            }
        }
        newLineHtmlContent += '<br> si <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADE0lEQVQ4jZ3RXU+bBRjG8X4AoslMNs880TOjcS5bCJYNtFRKZ+1sWC0MuxFZZjax0FqobSlrF1pIKUVkPE+fvjwvbBOyIcI22EI2xhxD2EahjsjQOY3ONJlfQJO/Z2s8MdHr9M79u+7k1un+R9bE47G88NGf94Zb/vhPi9+lP3lQkE6wOXmK2aSD5UFn8ekwFAoRDAbx+/34fD68Xi8ej4e2tjYKGRf3M61sfd3D7+vj/Lb6JTMDdr7pt5eAQCCAIAgIgoAoioiiSCqVIpVKsZ5u5XF+jMf5cR4tjvDjjSSXE/XMRw+UAJ/PhyAIvJ88gCAKpFIpJElCkiRWxeP8evcsD+cTbM3F2Jrr41L8Pa5GTCXA6/UiiiKGXj2W3lokSSKdTpNOp1kZbuGXZYWtuRibs2E2ZyNc7LNyKVBd1O0feou6ZDVvx/diiOn5UDvE4ZyDurCBTCZDJpNhadDJz4sZNmfCbEwH2JgKMh2zMNlZUdSZBqrIrg0hriYZvhNncDlG/HYE+4iVGn8V2WyWm/0OfloYYWPKz/0JN09uNjEVrWOs7fWirqavEuFugp5bAboXOvBfb8d/3U33jU4sA7Uc7LJxLWbjh2tDFM57eDTTDIU6ZvqqOXPi5aKuuqfiaWv0Vojwwmd0zXvZnzCy112BLMtciZh5cDVO/tzH5M+08HD6AyZPGckde7Goqzy5h4rgLvZ0vsYuzyu8m6zFnKhB316OLMsoisJ00MD3l6PcU4+ykjnMSraZybABqfmF0hecTie5XI6qT/WUu3ajKAqKoqCqKl916tmYOslK9ghLooNvU01MdL/JaefzJaCxsRFZltnX/gaynENVVVRVRdM0xty7KUwEWBIbWPzCxu1hOxdCVXze+FwJsNvt/2jVNA1N0xgdHWW09VXWxjtYH+8gf7adO7ljXOjaR9L+TFEnCAIulwubzYbVasVisWA2mzGZTBiNRgwGA+mjL3HOvZMJv56LESNXet/hfLCSRH1Z6YJ/y+lDO7YPNW0vH2rYdmTA8Ww0cbBMG2zY9ld/fdmTvwHSoRtmWpResQAAAABJRU5ErkJggg==" alt="sortie" title="sortie"> à ' + timeNow;
    }
    newColTime.innerHTML = newLineHtmlContent;
    if (!existingColumn) {
        currentLine.appendChild(newColTime);
    }
}

/**
 *
 * @param an
 * @returns {*[]}
 */
function listeJoursFeries(an) {
    var JourAn = new Date(an, 0, 1);
    var FeteTravail = new Date(an, 4, 1);
    var Victoire1945 = new Date(an, 4, 8);
    var FeteNationale = new Date(an, 6, 14);
    var Assomption = new Date(an, 7, 15);
    var Toussaint = new Date(an, 10, 1);
    var Armistice = new Date(an, 10, 11);
    var Noel = new Date(an, 11, 25);

    var G = an % 19;
    var C = Math.floor(an / 100);
    var H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30;
    var I = H - Math.floor(H / 28) * (1 - Math.floor(H / 28) * Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11));
    var J = (an * 1 + Math.floor(an / 4) + I + 2 - C + Math.floor(C / 4)) % 7;
    var L = I - J;
    var MoisPaques = 3 + Math.floor((L + 40) / 44);
    var JourPaques = L + 28 - 31 * Math.floor(MoisPaques / 4);
    var Paques = new Date(an, MoisPaques - 1, JourPaques);
    var LundiPaques = new Date(an, MoisPaques - 1, JourPaques + 1);
    var Ascension = new Date(an, MoisPaques - 1, JourPaques + 39);
    var Pentecote = new Date(an, MoisPaques - 1, JourPaques + 49);

    return [JourAn, Paques, LundiPaques, FeteTravail, Victoire1945, Ascension, Pentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel];
}

/**
 * @param givenTime
 * @returns {number}
 */
function extractSecondsFromTime(givenTime) {
    var arrTime = givenTime.split(':');
    if (arrTime.length !== 2) {
        return 0;
    }
    return parseInt(arrTime[0]) * 60 + parseInt(arrTime[1]);
}

/**
 *
 * @param timeInMinutes
 * @returns {string}
 */
function displayTime(timeInMinutes) {
    var hours = Math.floor(timeInMinutes / 60);
    var resultTime = hours > 0 ? hours + 'h ' : '';
    var minutes = timeInMinutes % 60;
    resultTime += minutes > 0 ? minutes + 'm' : '';
    return resultTime.trim();
}