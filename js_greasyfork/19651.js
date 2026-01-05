// ==UserScript==
// @name           bash
// @namespace      Nexucis.gameoperator.OGameFr
// @description    detection du bash
// @include        *://*.ogame.gameforge.*/game/admin2/toplist.php?session=*
// @grant          none
// @version        2014.04.14 - Shole update
// @downloadURL https://update.greasyfork.org/scripts/19651/bash.user.js
// @updateURL https://update.greasyfork.org/scripts/19651/bash.meta.js
// ==/UserScript==
//** Copyright © 2013 by Nexucis for ogame.fr  **
//** May only be used by ogame staff. If you are not ogame staff, then delete this script immediately. **
//** Obtain permission before redistributing. **

var bash; //nbre limite d'attaque au dessus de laquelle le bash est détectée
var langue; // langue de l'at
var speedFleet; // vitesse des vaisseaux
var country; // pays d'utilisation
var addNote = false;

function allerLangue() {
    switch (langue) {

        case "Deutsch" :
            return "flotte auf planet";
        case "English" :
            return "fleet arrives to target";
        case "Français" :
            return "aller";
        case "Español" :
            return "flota en el planeta";
        case "Italiano" :
            return "flotta sul pianeta";
        default:
            return "epique fail aller";
    }
}

function retourLangue() {
    switch (langue) {

        case "Deutsch" :
            return "rückkehr zu planet";
        case "English" :
            return "fleet returns home";
        case "Français" :
            return "retour";
        case "Español" :
            return "volver al planeta";
        case "Italiano" :
            return "ritorna al pianeta";
        default:
            return "epique fail retour";
    }
}

function sondeLangue() {
    switch (langue) {

        case "Deutsch" :
            return "sonde";
        case "English" :
            return "probe";
        case "Français" :
            return "sonde";
        case "Español" :
            return "sonda";
        case "Italiano" :
            return "sonda";
        default:
            return "epique fail sonde";
    }
}

function requestLogIP(dateBash, dateFinBash,coord, id, $ligne2, $pseudo, $table2) {
    var dateDebut = new Date();
    dateDebut.setTime(dateBash.getTime() - 7 * 24 * 3600 * 1000);

    $.ajax({
        type: "POST",
        url: 'login_log.php',
        data: {
            user: id,
            login_start_year: dateDebut.getFullYear(),
            login_start_month: dateDebut.getMonth() + 1,
            login_start_day: dateDebut.getDate(),
            login_end_year: dateBash.getFullYear(),
            login_end_month: dateBash.getMonth() + 1,
            login_end_day: dateBash.getDate(),
            showResults: 'Envoyer'
        }

    }).done(function(html) {
        var $table = $('.content .textbox>table:first', html);
        var dateCourante = new Date();
        var nbreJour = 0;

        var $lignes = $table.find('tr').not(':first').each(function(i) {
            var data = $(this).find('td:first').html();

            $.each(data.toString().split('<br>'), function(i, elem) {

                var heure = elem.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g);
                if (!heure) {
                    return true;
                }
                heure = heure.toString().split(':');
                dateCourante.setTime(dateDebut.getTime() + nbreJour * 24 * 3600 * 1000);
                dateCourante.setHours(parseInt(heure[0], 10));
                dateCourante.setMinutes(parseInt(heure[1], 10));
                dateCourante.setSeconds(parseInt(heure[2], 10));


                if ((dateCourante.getTime() + 7 * 24 * 3600 * 1000 >= dateFinBash.getTime())
                        && (dateCourante.getTime() <= dateBash.getTime())) {
                    return false;
                }

            });
            if ((dateCourante.getTime() + 7 * 24 * 3600 * 1000 >= dateFinBash.getTime())
                    && (dateCourante.getTime() <= dateBash.getTime())) {
                return false;
            }
            nbreJour++;

        });
        if ((dateCourante.getTime() + 7 * 24 * 3600 * 1000 >= dateFinBash.getTime())
                && (dateCourante.getTime() <= dateBash.getTime())) {
            var color = null;
            color = 'red';
            var $pseudo2 = $ligne2.clone().find('td:eq(1)');

            $table2.find('tbody :first').append('<tr><td>' + $pseudo2.html() + '</td><td>' + $pseudo + '</td><td>Bash</td><td>'+coord+'</td><td>' + dateBash + '</td><td>' + dateFinBash + '</td></tr>');
            var $tdColor = $table2.find('tr:last td');
            $tdColor.css('background-color', color);

            $ligne2.append('<td>' + 'bash sur ' + $pseudo + ' </td>');
            $ligne2.find('td').css('background-color', color);
        }
        else {
            var color = null;
            color = 'orange';
            $ligne2.append('<td>' + 'pas de bash sur ' + $pseudo + ' </td>');
            $ligne2.find('td').css('background-color', color);
        }
    }).fail(function() {

    });
}

/*
 * tab : matrice. Ligne 0 --> coord 
 * ligne 1 -> nbre date/coord
 * ligne x -> date 
 */

function insertionTriLog(coord, date, tab) {
    var i = 0;
    var taille = tab.length;

    while ((i < taille) && (tab[i][0] != coord)) {
        i++;
    }

    if (i === taille) {
        tab[i] = new Array();
        tab[i][0] = coord;
        tab[i][1] = 1;
        tab[i][2] = date;
    }

    else {
        var j = 2;
        var taille2 = tab[i].length;

        while ((j < taille2) && (date.getTime() < tab[i][j].getTime())) {
            j++;
        }

        if (j === taille2) {
            tab[i][j] = date;
        }

        else {
            var buffer1;
            var buffer2;
            var k = 0;

            buffer1 = tab[i][j];
            tab[i][j] = date;
            j++;
            k++;
            while (j < taille2) {

                if (k % 2 === 1) {
                    buffer2 = tab[i][j];
                    tab[i][j] = buffer1;
                }
                else {
                    buffer1 = tab[i][j];
                    tab[i][j] = buffer2;
                }
                j++;
                k++;
            }

            if (k % 2 === 1) {
                tab[i][j] = buffer1;
            }
            else {
                tab[i][j] = buffer2;
            }

        }
        tab[i][1] = tab[i][1] + 1;
    }

}

function parcoursLogTrier(tab, id, $ligne, $pseudo, $table2) {
    var i = 0;
    var j, k;
    var taille = tab.length;
    var valbash = 0;

    while ((i < taille) && (valbash <= bash)) {

        if (tab[i][1] > bash) {
            j = tab[i].length - 1;
            k = tab[i].length - 1;
            valbash = 0;

            while ((j >= 2) && (valbash <= bash)) {

                if ((tab[i][j].getTime() - tab[i][k].getTime()) <= 24 * 3600 * 1000) {
                    valbash++;
                    j--;
                }
                else {
                    while ((k > j) && ((tab[i][j].getTime() - tab[i][k].getTime()) > 24 * 3600 * 1000)) {
                        k--;
                        valbash--;
                    }
                }
            }
        }
        i++;
    }

    if (valbash > bash) {
        requestLogIP(tab[i - 1][k], tab[i - 1][j+1],tab[i-1][0], id, $ligne, $pseudo, $table2);
    }
    else {
        var color = 'green';
        //$ligne.append('<td>' + 0 + ' </td>');
        $ligne.find('td').css('background-color', color);
    }
}

function makeFormRequestLogFlotte(log, $ligne, $pseudo, id, $table2) {
    $.ajax({
        url: log.toString()

    }).done(function(html) {
        var i = 0;
        var $table = $('.content .textbox table ', html);
        var tailleTable = $table.length;
        var matTriLog = new Array();
        var valBash = 0;

        while (i < tailleTable - 2) {
            var $log1 = $('.content .textbox table:eq(' + i + ')', html);
            var $aller = $log1.find('tr:first td:eq(3)')[0].firstChild.data;

            if (($aller.toLowerCase() == allerLangue()) && (valBash <= bash)) {
                var $log2 = $('.content .textbox table:eq(' + (i + 1) + ')', html);
                var $retour = $log2.find('tr:first td:eq(3)')[0].firstChild.data;
                var $date1 = $log1.find('tr:eq(3) td:eq(1)')[0].firstChild.data; // on prend comme référence la date d'impacte
                var $date2 = $log2.find('tr:eq(3) td:eq(1)')[0].firstChild.data;

                if ($retour.length == 0)
                    return false;

                if (($retour.toLowerCase() == retourLangue()) && ($date1 == $date2)) {
                    var $pseudo_joueur = $('.content .textbox h4:first a:first', html)[0].firstChild.data;
                    var $pseudo_attaquant = $log1.find('tr:first td:eq(1) a:first')[0].firstChild.data;

                    if ($pseudo_joueur == $pseudo_attaquant) {
                        var typeVaisseau = $log1.find('tr:eq(2) td:first')[0].firstChild.data;
                        typeVaisseau = typeVaisseau.toLowerCase();
                        typeVaisseau = typeVaisseau.match(/([a-z]{1})+/g);
                        typeVaisseau = typeVaisseau.toString().split(' ');

                        if (typeVaisseau.toString().indexOf(sondeLangue(), 0) === -1) {
                            var $coord = $log1.find('tr:eq(1) td:eq(2) a:first')[0];
                            if ($coord != null) { // empeche de prendre en compte les attaques sur planètes de coord undknow
                                $coord = $coord.firstChild.data;

                                var jour = $date1.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g);
                                var heure = $date1.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g);

                                heure = heure.toString().split(':');
                                jour = jour.toString().split('-');

                                var date = new Date(parseInt(jour[0], 10), parseInt(jour[1], 10) - 1, parseInt(jour[2], 10), parseInt(heure[0], 10), parseInt(heure[1], 10), parseInt(heure[2], 10));
                                insertionTriLog($coord, date, matTriLog);
                            }
                        }

                    }
                }
            }
            i++;
        }
        parcoursLogTrier(matTriLog, id, $ligne, $pseudo, $table2);

    }).fail(function() {

    });
}

function getIdJoueur($ligne) {
    var lien = $ligne.find('td:eq(1) a:first').attr('href');

    return lien.substr(lien.lastIndexOf('&') + 8);
}

function makeFormRequest(log, $ligne, $table2) {
    var $pseudo = '';
    var boolBash = 0;
    var id;
    $.ajax({
        url: log.toString()

    }).done(function(html) {

        var $content = $('.content .textbox', html);
        var $table = $content.find('table:eq(1)');

        var $l = $table.find('tr').not(':first,:eq(1)').each(function(i) {

            var $joueur = $(this).find('td').not(':first'); //collection de td , prend tous les td du tr[i]
            var $lien = $joueur.find('a:first'); // prend tous les premiers liens de chaque td de la collection de $joueur
            var $activite = $lien.find('font:first');
            if ($lien.find('font:first').length === 0) { // si pas de couleur ---> non inactif pas en mv pas space
                var $nbreAttaque = $lien.find('center:first');

                if (parseInt($nbreAttaque[0].firstChild.data, 10) > bash) { // on ne regarde que les attaques que fait le joueur et non les attaques que subit le joueur
                    var log2 = getLogJoueur($(this), 2);
                    $pseudo = $lien[0].firstChild.data;
                    if ($pseudo != 'unknown ()') {
                        boolBash++;
                        id = getIdJoueur($(this));
                        makeFormRequestLogFlotte(log2, $ligne, $pseudo, id, $table2);
                    }

                }
            }
            else if ($activite[0].firstChild.data == 'u') {
                var $nbreAttaque = $lien.find('center:first');

                if (parseInt($nbreAttaque[0].firstChild.data, 10) > bash) { // on ne regarde que les attaques que fait le joueur et non les attaques que subit le joueur
                    var log2 = getLogJoueur($(this), 2);
                    $pseudo = $lien[0].firstChild.data;
                    if ($pseudo != 'unknown ()') {
                        boolBash++;
                        id = getIdJoueur($(this));
                        makeFormRequestLogFlotte(log2, $ligne, $pseudo, id, $table2);
                    }

                }

            }


        });

        var color = null;
        if (boolBash === 0) {
            color = 'green';
            $ligne.append('<td>' + boolBash + ' </td>');
            $ligne.find('td').css('background-color', color);
        }

    }).fail(function() {

    });
}

function getLogJoueur($ligne, i) {
    var lien = $ligne.find('td:eq(' + i + ') a:first').attr('href');
    return lien;
}

function getEtatJoueur($ligne) {
    var etat = $ligne.find('td:eq(1) font:first');
    return etat;
}

function createNote() {
    var a = $('.content .textbox a');
    var i = 0;
    var length = a.length;
    while ((!a[i].firstChild.firstChild) && (i < length)) {
        i++;
    }
    i++;
    i = i * 100;
    //console.log("on est au top "+i);
    $.ajax({
        type: "POST",
        url: 'note.php?session=*&addnew=3',
        data: {
            notiz: 'bashTool using for top ' + i,
            add: '   Envoyer   '
        }
    }).done(function(html) {
    }).fail(function() {
    });
}

function rechercheBash() {
    var $table = $('.content .textbox table :first');
    $table.before('<table><tbody><tr><th> Summary of bash</th></tr></tbody></table>\n\
                   <table><tbody><tr><th>Playeur 1</th>\n\
                                     <th>Playeur 2</th>\n\
                                     <th>Reason</th>\n\
                                     <th>Coord</th>\n\
                                     <th>Start Date</th>\n\
                                     <th>End Date</th></tr></tbody></table></br></br>');
    var $table2 = $('.content .textbox table :eq(1)');
    var taille = $('.content .textbox table').length - 2;

    $table = $('.content .textbox table :eq(' + taille + ')');

    $table.find('tr').not(':first').each(function($ligne) {
        var etat = getEtatJoueur($(this));
        if ((etat.length === 0)
                || (etat[0].firstChild.data == 'u')) { // joueur actif
            var log = getLogJoueur($(this), 3);
            makeFormRequest(log, $(this), $table2);
        }
        //return false;

    });
	if(addNote)
		createNote();	
}

function creationBouton() {
    var queryForm = document.querySelector('.foot');
    var bouton = document.createElement('button');
    bouton.innerHTML = "bash";
    bouton.id = 'bash';
    queryForm.appendChild(bouton);
}

function ajoutBibliothequeJquery() {

    var script = document.createElement('script');
    var debut = document.querySelector('head');
    script.type = "text/javascript";
    script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js";
    debut.appendChild(script);
}

function detectLangue() {
    var $option = $('.overbox .content option').not(':first');
    var i = 0;
    while (!$option[i].selected) {
        i++;
    }
    langue = $option[i].firstChild.data;
}

function loadApiXml() {
    $.ajax({
        type: "GET",
        url: "/api/serverData.xml",
        dataType: "xml"
    }).done(function(xml) {
        speedFleet = $(xml).find('speedFleet').text();
        country = $(xml).find('language').text();
        detectLimitOfBash();
    }).fail(function() {
        alert("error, api doesn't exist");
    });
}

function detectLimitOfBash() {
    switch (country) {
        case "en":
        case "ro":
            switch (speedFleet) {
                case "2":
                    bash = 12;
                    break;
                case "4":
                case "5":
                    bash = 20;
                    break;
                default:
                    bash = 6;
                    break;
            }
            break;
        case "tw":
            switch (speedFleet) {
                case "2":
                    bash = 12;
                    break;
                default:
                    bash = 6;
                    break;
            }
            break;
		case 'fr':
			addNote = true;
			bash = 6;
        default:
            bash = 6;
            break;
    }
	console.log('bash :'+bash+' addNote:'+addNote);
}

ajoutBibliothequeJquery();
creationBouton();
detectLangue();
loadApiXml();
document.getElementById('bash').addEventListener('click', rechercheBash, false);