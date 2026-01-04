// ==UserScript==
// @name AbyssusHelper
// @description Petit Script pour Abyssus
// @version  1.0.1
// @grant none
// @match https://s1.abyssus.games/*
// @include https://s1.abyssus.games/*
// @namespace https://greasyfork.org/users/184933
// @downloadURL https://update.greasyfork.org/scripts/374765/AbyssusHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/374765/AbyssusHelper.meta.js
// ==/UserScript==


// --------------------------------------------------------------------------
// Var
// --------------------------------------------------------------------------
//setCookie("AbyssusHelper_version", "1.1.0", 1);

var pseudo = document.getElementById("marqueur_pseudo_joueur").textContent;
var idjoueur = document.getElementById("marqueur_ID_joueur").textContent;
var tmJoueur = parseInt($("span[title='Territoire Marin']").text().replace(/ /g,""));
var pack_premium1 = document.getElementById("marqueur_pack_premium_1").textContent;
var pack_premium2 = document.getElementById("marqueur_pack_premium_2").textContent;
var delay = 0;
var changelog = "";
changelog += "<br/><strong>v1.18.6</strong><ul><li>Correction d'un bug dans l'enregistrement de la taille des sondes auto</li></ul><hr color=\"blue\"><br/>";
changelog += "<strong>v1.18.5</strong><ul><li>Modification des cibles outils guerre</li></ul><strong>v1.18.4</strong><ul><li>Modification des cibles outils guerre</li></ul><strong>v1.18.3</strong><ul><li>Modification des cibles outils guerre</li></ul><strong>v1.18.2</strong><ul><li>Modification des cibles outils guerre</li></ul><strong>v1.18.1</strong><ul><li>MAJ du traceur</li></ul><strong>v1.18.0</strong><ul><li>Ajout outils guerre</li></ul><strong>v1.17.1</strong><ul><li>Correction du formatage des floods en cours</li></ul><strong>v1.17.0</strong><ul><li>Ajout de la fonction post automatique des floods en cours</li></ul><strong>v1.16.8</strong><ul><li>Modification de la fonction réduction de la fenêtre AbyssusHelper</li><li>Modification de la fonction recherche de cibles à portée des lanceurs de flood</li><li>Correction d'un bug qui empêchait le Flood Optimisé de fonctionner dans certaines situations</li></ul><strong>v1.16.7</strong><ul><li>Correction d'un bug qui causait le CA de s'agrandir chaque seconde</li></ul><strong>v1.16.6</strong><ul><li>Correction d'une erreur qui causait le traceur d'être désactivé</li></ul><strong>v1.16.5</strong><ul><li>Correction du fonctionnement de la suggestion de chasses, ne force plus un certain nombre de vagues</li></ul><strong>v1.16.4</strong><ul><li>Correction d'un bug qui causait la suggestion de chasse d'être fausse</li></ul><strong>v1.16.3</strong><ul><li>Correction d'un bug qui empéchait l'affichage des cibles à portées sur les pages alliances dans la vue compacte</li></ul><strong>v1.16.2</strong><ul><li>Ajout d\'un petit espace entre la fin d\'un message et l\'icone vidéo</li></ul><strong>v1.16.1</strong><ul><li>Correction d\'un bug qui causait certaines vidéos de ne pas êtres lues</li></ul><strong>v1.16.0</strong><ul><li>Ajout du démineur ;)</li><li>Ajout de l\'intégration de vidéos youtube dans le Chat Alliance</li><li>Correction d\'un bug qui causait le texte de la page d\'être séléctionné lorsque la fenêtre AbyssusHelper était déplacée</li></ul><strong>v1.15.1</strong><ul><li>Le fond  de la version Compacte du site a été remplacé par une couleur unie</li></ul><strong>v1.15.0</strong><ul><li>Ajout d\'une option pour utiliser une version compacte du site</li><li>La fenêtre AbyssusHelper est désormais déplaçable</li><li>Modification du titre de la fenêtre AbyssusHelper sur les pages Classement Alliance, Classement Joueurs et Chat Général</li><li>Ajout d\'une suggestion de chasse</li><li>Correction des valeurs de FDF, FDD et Vie avec bonus sur la page production d\'unités</li><li>Ajout d\'une option pour forcer le MF à ignorer les paliers TM</li><li>Désactivation des outils guerre</li><li>Élargissement de la page paramètres</li><li>Ajout d\'outils sur la page paramètres</li><li>Correction du formatage du changelog</li></ul><strong>v1.14.5</strong><ul><li>Correction d\'un bug qui causait les murènes éléctriques d\'être ignorées par le Multiflood</li></ul><strong>v1.14.4</strong><ul><li>Mise à jour des cibles outils guerre à cause d\'un hébergement</li></ul><strong>v1.14.3</strong><ul><li>Mise à jour des cibles outils guerre à cause d\'un hébergement</li></ul><strong>v1.14.2</strong><ul><li>Ajout d\'un court délai avant l\'execution du traceur afin d\'essayer d\'empêcher l\'interruption de l\'enregistrement dans certains cas</li></ul><strong>v1.14.1</strong><ul><li>Augmentation de la fréquence d\'enregistrement du traceur</li></ul><strong>v1.14.0</strong><br/><ul><li>Correction d'un bug qui causait certains caractères d'être ignorés lors de l'écriture de texte dans les Chats</li><li>Ajout des outils guerre</li><li>Ajout de la coloration des joueurs sur le CG</li><li>Ajout de la coloration des alliances sur le classement alliances</li></ul><strong>v1.13.1</strong><br/><ul><li>Supression temporaire du tableau don de quêtes à cause d'un bug</li></ul><strong>v1.13.0</strong><br/><ul><li>Ajout d'un cadre news o0o sur la page accueil</li><li>Ajout du tableau log don des quêtes sur la page quête alliance</li><li>Correction d'une erreur de formatage dans le changelog</li><li>Ajout d'un bouton pour afficher le changelog dans la page paramètres</li><li>Ajout d'une option pour désactiver le respect des paliers de TM par le multiflood chaîne</li><li>Modification du multiflood chaîne afin qu'il respecte les paliers de TM</li></ul><strong>v1.12.0</strong><br/><ul><li>Modification du traceur. Celui-ci devrait maintenant être invisible</li><li>Ajout du sytème de convoi sur la page commerce</li><li>Ajout d'une alerte sur la page construction si moins de deux constructions sont en cours</li></ul><strong>v1.11.0</strong><br/><ul><li>Ajout du tag @everyone pour le Chat Alliance</li></ul><strong>v1.10.1</strong><br/><ul><li>Correction d'un bug qui empêchait le rafraichissement des préférences de TM par vague du lanceur de chasse</li></ul>v1.10.0</strong><br/><ul><li>Ajout d'une option pour désactiver le système de notification Chat Alliance</li><li>Ajout d'un système de notification Chat Alliance</li></ul><strong>v1.9.0</strong><br/><ul><li>Ajout de l'outil lanceur de chasses simultanées</li><li>Correction du format du changelog pour certaines entrées</li><li>Correction d'un bug qui enpêchait l'enregistrement des paramètres si l'option d'antisonde automatique n'était pas active</li><li>Ajout d'une liste de liens utiles sur la page Accueil</li><li>Correction d'un bug dans l'enregistrement des paramètres pour l'option des stats avancées sur la page production</li><li>Correction d'un bug dans l'enregistrement des paramètres pour l'outil de sondes automatiques</li><li>Nettoyage d'une partie du code</li></ul><strong>v1.8.6</strong><br/><ul><li>Correction d'un bug du traceur</li></ul><strong>v1.8.5</strong><br/><ul><li>Supression des outils de guerre</li><li>Modification du fonctionnement du traceur : si vous n'avez pas effectué d'enregistrement dans la dernière heure, un enregistrement est effectué</li></ul><strong>v1.8.4</strong><br/><ul><li>Le traceur ne confirme plus l'enregistrement</li></ul><strong>v1.8.3</strong><br/><ul><li>L'utilisation du traceur a été simplifiée d'avantage; une simple visite de la page alliance suffit</li></ul><strong>v1.8.2</strong><br/><ul><li>L'utilisation du traceur a été simplifiée</li></ul><strong>v1.8.1</strong><br/><ul><li>Le traceur s'ouvre dans un nouvel onglet maintenant</li></ul><strong>v1.8.0</strong><br/><ul><li>Ajout du traceur manuel de TM</li></ul><strong>v1.7.9</strong><br/><ul><li>Mise à jour de la liste des cibles des outils de guerre</li></ul><strong>v1.7.8</strong><br/><ul><li>Mise à jour de la liste des cibles des outils de guerre</li></ul><strong>v1.7.7</strong><br/><ul><li>Mise à jour de la liste des cibles des outils de guerre</li></ul><strong>v1.7.6</strong><br/><ul><li>Ajout de l'option taille sonde</li></ul><strong>v1.7.5</strong><br/><ul><li>Correction du bug des sondes infinies</li></ul><strong>v1.7.4</strong><br/><ul><li>Ajout des outils guerre</li></ul><strong>v1.7.3</strong><br/><ul><li>Petit changement pour essayer de corriger un bug dans la page paramètres</li></ul><strong>v1.7.2</strong><br/><ul><li>Petit changement temporaire pour essayer de corriger un bug dans le multiflood</li></ul><strong>v1.7.1</strong><br/><ul><li>Suppression des aides pour la guerre</li></ul><strong>v1.7.0</strong><br/><ul><li>Les descriptions d'alliances sont maintenant automatiquement masquées</li></ul><strong>v1.6.1</strong><br/><ul><li>Modification de l'apparence des marqueurs page alliance</li></ul><strong>v1.6.0</strong><br/><ul><li>Ajout de marqueurs bleu sur les pages alliance</li><li>Correction d'une erreur dans le changelog</li></ul><strong>v1.5.0</strong><br/><ul><li>Ajout de la possibilité de cliquer le titre de la fenêtre du script pour la réduire</li></ul><strong>v1.4.0</strong><br/><ul><li>Ajout d'un lien vers l'apo sur la page accueil</li></ul><strong>v1.3.1</strong><br/><ul><li>Correction d'un bug dans le lanceur de sonde</li></ul><strong>v1.3.0</strong><br/><ul><li>Supression du lien vers l'apo qui faisait tout bugger</li><li>Ajout d'un bouton sonde sur apo</li><li>Ajout de paramètres pour régler la taille de la sonde</li><li>Ajout de fonctionnalités sur la page alliance apo</li><li>Correction d'une erreur dans le changelog</li></ul><strong>v1.2.3</strong><br/><ul><li>Ajout d'un lien vers l'apo</li></ul><strong>v1.2.2</strong><br/><ul><li>Ajout du multiflood sur apo</li></ul><strong>v1.2.1</strong><br/><ul><li>Correction d'un bug qui empêchait le multiflood / flood opti de fonctionner correctement sur les cibles trop lointaines</li></ul><strong>v1.2.0</strong><br/><ul><li>Ajout d'une option pour montrer les stats des unités avec prise en compte des niveaux de Morsure et Ecaille sur la page production d\'unités</li></ul><strong>v1.1.6</strong><br/><ul><li>Ajout de l'enregistrement des niveaux Morsure et Ecaille</li></ul><strong>v1.1.5</strong><br/><ul><li>Changement de l'ordre d'utilisation des unités pour l'antisonde auto</li></ul><strong>v1.1.4</strong><br/><ul><li>Suppression du délai avant l'affichage de l'horloge</li><li>Correction d'un bug qui empêchait les préférences concernant l'horloge d'être sauvegardées</li><li>Changement de l'ordre d'utilisation des unités pour l'antisonde auto</li></ul><strong>v1.1.3</strong><br/><ul><li>L'horloge fait tic et toc mais n'est pas forcément à l'heure du serveur...</li></ul><strong>v1.1.2</strong><br/><ul><li>Ajout du cadre pour l'horloge. NB : L'horloge ne fonctionne pas encore</li></ul><strong>v1.1.1</strong><br/><ul><li>Amélioration de l'apparence du changelog</li></ul><strong>v1.1.0</strong><br/><ul><li>Ajout de l'antisonde automatique</li><li>Ajout des paramètres de l'antisonde automatique</li></ul><strong>v1.0.23</strong><br/><ul><li>Ajout du changelog</li></ul>";
var version = "1.18.6";

// --------------------------------------------------------------------------
// Bloc Div  : Différent en fonction des pages
// --------------------------------------------------------------------------
var newDiv = document.createElement("div");
newDiv.id= "abyssusHelper";
newDiv.style ="z-index: 100; position:fixed; top:2%; margin-left: auto; margin-right: auto;margin-top: -10px; border: 1px #FFFFFF solid;background:#092869;padding:1%;";
document.getElementById('bas').appendChild(newDiv);





//------------------------------------------------------------
//Traceur
//------------------------------------------------------------
///*
function traceurTM() {
    if (getCookie("AbyssusHelper_Traceur") == "") {
        setCookie("AbyssusHelper_Traceur", "auto", 0.0416);
        var frame1 = document.createElement('IFRAME');
        frame1.src = "https://s1.abyssus.games/jeu.php?page=alliance&tag=o0o";
        frame1.style.display = "none";
        //alliance ennemie

        var frame2 = document.createElement('IFRAME');
        frame2.src = "https://s1.abyssus.games/jeu.php?page=alliance&tag=TAG";
        frame2.style.display = "none";

        document.getElementById('bas').appendChild(frame1);
        document.getElementById('bas').appendChild(frame2);

        //window.open("https://s1.abyssus.games/jeu.php?page=alliance&tag=o0o");
    }
}
setTimeout(traceurTM, 500);
//*/
//setCookie("AbyssusHelper_Traceur", "", -1);

//calculer portée TM d'attaque
function liminf(tm) {
    return parseInt(tm/ (2 * ((1 +( parseInt(getCookie("AbyssusHelper_bonusCDF")) / 10)))));
}

function limsup(tm) {
    return parseInt(tm * (3 * ((1 +( parseInt(getCookie("AbyssusHelper_bonusCDF")) / 10)))));
}

//page 2 à mettre autre part à l'occasion
function getPage(page) {
    //force la requete ajax à être synchronisée
    jQuery.ajaxSetup({async:false});
    var mintdc = liminf(tmJoueur);
    var maxtdc = limsup(tmJoueur);
    var out = document.createElement('table');
    $.post('ajax/ennemies.php', {mintdc:mintdc, maxtdc:maxtdc, page:page, tri:'distance', sens:'asc', guerre:0, paix:0, ally:0}, function(data){
        out.innerHTML = data;
    });
    //rétablit l'async pour les requetes ajax
    jQuery.ajaxSetup({async:true});
    return out.getElementsByTagName('tr');

}

//----------------------------------------------------------------------------------------------------------
//FONCTIONS COOKIES
//----------------------------------------------------------------------------------------------------------

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


//supprimer notif TM manquant
if(document.URL.indexOf("supprNotif")!=-1){
    setCookie("AbyssusHelper_tmAlly", parseInt(document.location.href.split("Notif")[1]), 7);
    document.location.href="https://s1.abyssus.games/jeu.php?page=listemembre";
}


//----------------------------------------------------------------------------------------------------------
//MULTIFLOOD CHAINE - CALCULER PROCHAINE VAGUE
//----------------------------------------------------------------------------------------------------------
function multiflood_CalculVague(tmMoi, tmLui) {
    var bonus = parseInt(getCookie("AbyssusHelper_bonusCDF"));
    var prise_max = Math.floor(0.2 * tmLui);

    if (tmLui < Math.ceil(tmMoi / (2*(1+bonus/10))) || tmLui > Math.floor(tmMoi * (3*(1+bonus/10)))) {
        //cible déjà HDP, ne pas lancer de nouvelle vague
        return -1;
    } else if (tmLui - prise_max < Math.ceil((tmMoi + prise_max) / (2*(1+bonus/10)))) {
        //cible va être HDP après l'attaque, lance attaque réduite
        var prise_init = prise_max;
        var reduction = 2;
        while (Math.floor(prise_init/reduction) > 0) {
            if (tmLui - prise_max < Math.ceil((tmMoi + prise_max) / (2*(1+bonus/10)))) {
                prise_max -= Math.ceil(prise_init/reduction);
            } else {
                prise_max += Math.floor(prise_init/reduction);
            }
            reduction *= 2;
        }
        prise_max -= 2;
        if (prise_max < 10) {
            //si prise réduite trop petite, lance juste vague normale, car probablement dernière vague ou alors vague réduite (presque) inutile
            return prise_init;
        } else {
            return prise_max;
        }
    } else {
        return prise_max;
    }
}


//----------------------------------------------------------------------------------------------------------
//MULTIFLOOD CHAINE - TROUVER CIBLES POTENTIELLES
//----------------------------------------------------------------------------------------------------------
function multiflood_Chaine() {
    //Cherche cibles
    var cibles = new Array();
    var paliers = new Array();
    var nouvelle_cible;
    var contenu_tableau = document.getElementById('tableaumembre').getElementsByTagName('tr');


    //Calcule nombre de membres... à mettre dans une fonction à part à l'occasion
    var str = document.getElementById('bloc').getElementsByTagName('center')[0].innerHTML;
    var strSub;
    strSub = str.split("Nombre de membre : ")[1];
    strSub = strSub.split("<")[0];
    var nbMembre = parseInt(strSub);

    //crée la liste de toutes les cibles.
    for (var i=1; i< nbMembre +1; i++) {
        var temp = contenu_tableau[i].cells[3].style.backgroundColor;
        var palier;
        if (temp == "#66329a" || temp == "rgb(102, 50, 154)" || temp == "rgb(77, 25, 25)" || temp == "#4d1919") {
            var contenu = contenu_tableau[i].cells[3].innerHTML;
            try {
            palier = parseInt(contenu.split('palier="')[1].split('"')[0]);
            } catch (exc) {}
            nouvelle_cible = (contenu.split('id=')[1]).split('"')[0];
            cibles.push(parseInt(nouvelle_cible));
            paliers.push(palier);
        }
    }

    setCookie("AbyssusHelper_CiblesMF", cibles, 1);
    setCookie("AbyssusHelper_PaliersMF", paliers, 1);
    setCookie("AbyssusHelper_LigneTableauMF", 1, 1);
    document.location.href="https://s1.abyssus.games/jeu.php?page=ennemies";
}

function test() {



//----------------------------------------------------------------------------------------------------------
//MULTIFLOOD CHAINE - TOUVER CIBLES LES PLUS PROCHES ET A PORTEE
//----------------------------------------------------------------------------------------------------------
if(document.URL.indexOf("ennemies")!=-1){
    var cibles = getCookie("AbyssusHelper_CiblesMF").split(",");
    var tmMoi;
    var ciblesAPortee = new Array();
    var tmciblesAPortee = new Array();
    var cible;
    var tableau;
    var paliers = getCookie("AbyssusHelper_PaliersMF").split(",");
    var paliersCiblesAPortee = new Array();

    if (cibles == "") {
        newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">AbyssusHelper  v' + version + '</font></span></center>';

        newDiv.innerHTML += '<br/><center><div class="K" style=""><button id="K", class="K ui-button ui-corner-all ui-widget">Mutliflood sur TAG</button><br><br></div></center>';
        //boutons pour guerre
        newDiv.innerHTML += '<br/><center><div class="sondes" style=""><button id="sondes", class="sondes ui-button ui-corner-all ui-widget">Sondes sur TAG</button><br><br></div></center>';

        document.getElementById("K").addEventListener(
            "click", function() {
                console.log("AHHHHHHHHHHHhhhhhhhhhhhhhhhhhh");
                //cibles alliance en guerre
                cibles = [0, 174, 687, 708, 735, 749, 762,792, 800, 823,835,1062, 1064, 1261, 1304];
                setCookie("AbyssusHelper_CiblesMF", cibles, 1);
                setCookie("AbyssusHelper_LigneTableauMF", 1, 1);
                document.location.href="https://s1.abyssus.games/jeu.php?page=ennemies";
            }, false
        );

        document.getElementById("sondes").addEventListener(
            "click", function() {
                //cibles alliance en guerre
                cibles = [0, 174, 687, 708, 735, 749, 762,792, 800, 823,835,1062, 1064, 1261, 1304];
                setCookie("AbyssusHelper_CiblesMF", cibles, 1);
                setCookie("AbyssusHelper_Sondes", true, 1);
                setCookie("AbyssusHelper_LigneTableauMF", 1, 1);
                document.location.href="https://s1.abyssus.games/jeu.php?page=ennemies";
            }, false
        );

    } else {
        newDiv.innerHTML += '<font color="white">Multiflood en cours...</font>';

        /*
        try{
            tableau = Array.from(document.getElementById("table").getElementsByTagName("tr"));
        } catch (e){
            setTimeout(test, 200);
        }
        */
        var tmCible = 0;


        tableau = Array.from(getPage(1));
        var contenuPage2 = Array.from(getPage(2));
        contenuPage2.shift();

        tableau.push.apply(tableau, contenuPage2);
        console.log(tableau);
        //enregistre notre TM de départ
        tmMoi = tmJoueur;

        //enregistre cibles à portée ainsi que leur TM de départ
        for (var ligne = 1; ligne < tableau.length; ligne++) {
            if (tableau[ligne].cells[5].innerHTML.indexOf("attaque") != -1) {
                cible = (tableau[ligne].cells[5].innerHTML.split('id=')[1]).split('"')[0];
                if (cibles.indexOf(cible) != -1) {
                    //cible trouvée
                    ciblesAPortee.push(cible);
                    tmciblesAPortee.push(parseInt(tableau[ligne].cells[4].innerHTML.replace(/\s/g, '')));
                    //enregistrer le palier de la cible
                    for (var k=0; k<cibles.length; k++) {
                        if (cibles[k] == cible) {
                            paliersCiblesAPortee.push(paliers[k]);
                            break;
                        }
                    }
                }
            }
        }

        setCookie("AbyssusHelper_tmMoiMF", tmMoi, 1);
        setCookie("AbyssusHelper_tmcibleAPorteeMF", tmciblesAPortee, 1);
        setCookie("AbyssusHelper_cibleAPorteeMF", ciblesAPortee, 1);
        setCookie("AbyssusHelper_paliersAPorteeMF", paliersCiblesAPortee, 1);
        setCookie("AbyssusHelper_CiblesMF", "", -1);
        setCookie("AbyssusHelper_PaliersMF", "", -1);

        //alert(ciblesAPortee);
        if (ciblesAPortee == "") {
            alert("Pas de cibles à portée...");
            alert(cibles);
            document.location.href=("https://s1.abyssus.games/jeu.php?page=listemembre");
        } else if (getCookie("AbyssusHelper_Sondes") == "true") {
            document.location.href=("https://s1.abyssus.games/jeu.php?page=attaque&lieu=3&id=" + ciblesAPortee[0]);
        } else {
            document.location.href=("https://s1.abyssus.games/jeu.php?page=attaque&id=" + ciblesAPortee[0]);
        }
    }
}

//----------------------------------------------------------------------------------------------------------
//MULTIFLOOD CHAINE - LANCER ATTAQUE
//----------------------------------------------------------------------------------------------------------

else if(document.URL.indexOf("attaque") != -1) {
    ciblesAPortee= getCookie("AbyssusHelper_cibleAPorteeMF");
    tmciblesAPortee = getCookie("AbyssusHelper_tmcibleAPorteeMF");
    paliersCiblesAPortee = getCookie("AbyssusHelper_paliersAPorteeMF");
    tmMoi = parseInt(getCookie("AbyssusHelper_tmMoiMF"));

    if (ciblesAPortee != "") {
        //DO STUFF
        newDiv.innerHTML += '<font color="white">Multiflood en cours...</font>';

        var ciblesAPortee_attaque = ciblesAPortee.split(",");
        var tmciblesAPortee_attaque = tmciblesAPortee.split(",");
        var paliersCiblesAPortee_attaque = paliersCiblesAPortee.split(",");

        var prise = multiflood_CalculVague(tmMoi, parseInt(tmciblesAPortee_attaque[0]));
        //Faire en sorte que la verification du respect du palier ne soit activé que lorsque le paramètre n'est pas désactivé
        if (getCookie("AbyssusHelper_paliersPARAM") != "off") {
            if (parseInt(tmciblesAPortee_attaque[0]) - prise < parseInt(paliersCiblesAPortee_attaque[0])) {
                prise = parseInt(tmciblesAPortee_attaque[0]) - parseInt(paliersCiblesAPortee_attaque[0]);
            }
        }

        var priseInit = prise;
        if (prise > 0) {

            //copié-collé de deeper - lancer l'attaque
            var token = $( "input[name='token']").val();
            var lieu = $( "select[name='lieu'] option:selected").val();
            var urlsend = $(location).attr('href');
            //distribue sur d'autres unités que REM si pas assez de REM:
            var sj = $( "input[name='SJ']").val();
            var s = $( "input[name='S']").val();
            var sc = $( "input[name='SC']").val();
            var r = $( "input[name='R']").val();
            var rb = $( "input[name='RB']").val();
            var m = $( "input[name='M']").val();
            var pp = $( "input[name='PP']").val();
            var b = $( "input[name='B']").val();
            var bc = $( "input[name='BC']").val();
            var grb = $( "input[name='GRB']").val();
            var oq = $( "input[name='OQ']").val();
            var oqc = $( "input[name='OQC']").val();
            var k = $( "input[name='K']").val();
            var l = $( "input[name='L']").val();

            var uL = [sj, s, sc, r, rb, m, pp, b, bc, grb, oq, oqc, k, l];
            var fill = false;
            for (var jter=0; jter < uL.length; jter++) {
                var uniteMessy = "";
                if (typeof uL[jter] == 'undefined') {
                    uniteMessy = "0";
                } else {
                    uniteMessy = uL[jter];
                }
                var uniteCleanedUp = parseInt(uniteMessy.replace(/ /g,""));
                if (fill == true) {
                    uL[jter] = 0;
                } else if (uniteCleanedUp >= prise) {
                    fill = true;
                    uL[jter] = prise;
                } else {
                    prise -= uniteCleanedUp;
                }
            }
            if (lieu != 3) {
                $.ajax({
                    dataType: "html",
                    type: 'POST',
                    async:false,
                    url: urlsend,
                    data : {token : token ,lieu : lieu, SJ: uL[0],S : uL[1] , SC : uL[2], R : uL[3], RB : uL[4], M : uL[5], PP : uL[6], B : uL[7], BC : uL[8], GRB : uL[9], OQ : uL[10], OQC : uL[11], K : uL[12], L : uL[13]},
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    success: function(data) {}
                });
                tmciblesAPortee_attaque[0] -= priseInit;
                tmMoi += priseInit;
            } else {
                if (getCookie("AbyssusHelper_tailleSonde") != "") {
                    var tailleSondeatk = parseInt(getCookie("AbyssusHelper_tailleSonde"));
                } else {
                    tailleSondeatk = 323;
                }
                $.ajax({
                    dataType: "html",
                    type: 'POST',
                    async:false,
                    url: urlsend,
                    data : {token : token ,lieu : lieu, SJ: 0, S : tailleSondeatk, SC : 0, R : 0, RB : 0, M : 0, PP : 0, B : 0, BC : 0, GRB : 0, OQ : 0, OQC : 0, K : 0, L : 0},
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    success: function(data) {}
                });
                //passer à la prochaine cible
                ciblesAPortee_attaque.shift();
                tmciblesAPortee_attaque.shift();
                paliersCiblesAPortee_attaque.shift();
            }

        } else {
            //passer à la prochaine cible
            ciblesAPortee_attaque.shift();
            tmciblesAPortee_attaque.shift();
            paliersCiblesAPortee_attaque.shift();
        }
        setCookie("AbyssusHelper_tmMoiMF", tmMoi, 1);
        setCookie("AbyssusHelper_tmcibleAPorteeMF", tmciblesAPortee_attaque, 1);
        setCookie("AbyssusHelper_cibleAPorteeMF", ciblesAPortee_attaque, 1);
        setCookie("AbyssusHelper_paliersAPorteeMF", paliersCiblesAPortee_attaque, 1);

        //continuer l'attaque. Si sonde, continuer à sonder, sinon flood
        if (ciblesAPortee_attaque.length > 0) {
            if (getCookie("AbyssusHelper_Sondes") != "true") {
                document.location.href=("https://s1.abyssus.games/jeu.php?page=attaque&id=" + ciblesAPortee_attaque[0]);
            } else {
                document.location.href=("https://s1.abyssus.games/jeu.php?page=attaque&lieu=3&id=" + ciblesAPortee_attaque[0]);
            }
        } else {
            //Si voulu, lance reste de l'armée en ghost
            if (getCookie("AbyssusHelper_ghostAuto") == "true") {
                //ghostdejalance == true;
                token = $( "input[name='token']").val();
                lieu = $( "select[name='lieu'] option:selected").val();
                urlsend = $(location).attr('href');
                sj = $( "input[name='SJ']").val();
                s = $( "input[name='S']").val();
                sc = $( "input[name='SC']").val();
                r = $( "input[name='R']").val();
                rb = $( "input[name='RB']").val();
                m = $( "input[name='M']").val();
                pp = $( "input[name='PP']").val();
                b = $( "input[name='B']").val();
                bc = $( "input[name='BC']").val();
                grb = $( "input[name='GRB']").val();
                oq = $( "input[name='OQ']").val();
                oqc = $( "input[name='OQC']").val();
                k = $( "input[name='K']").val();
                l = $( "input[name='L']").val();

                $.ajax({
                    dataType: "html",
                    type: 'POST',
                    async:false,
                    url: urlsend,
                    data : {token : token ,lieu : lieu, SJ: sj, S : s, SC : sc, R : r, RB : rb, M : m, PP : pp, B : b, BC : bc, GRB : grb, OQ : oq, OQC : oqc, K : k, L : l},
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    success: function(data) {}
                });
            }
            //FINI, Cleanup
            setCookie("AbyssusHelper_tmMoiMF", "", -1);
            setCookie("AbyssusHelper_tmcibleAPorteeMF", "", -1);
            setCookie("AbyssusHelper_cibleAPorteeMF", "", -1);
            setCookie("AbyssusHelper_Sondes", "", -1);
            setCookie("AbyssusHelper_paliersAPorteeMF", "", -1);
            if (getCookie("AbyssusHelper_postFloodsOFF") != "forcedoff") {
                postFloodsEnCours();
                setCookie("AbyssusHelper_postFloodsOFF", "off", 0.00347);
            }
            document.location.href="https://s1.abyssus.games/jeu.php?page=armee";
        }

    } else {
        newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">AbyssusHelper  v' + version + '</font></span></center>';
        newDiv.innerHTML += '<br/><center><div class="divmf" style=""><button id="floodOpti", class="envoi_mf ui-button ui-corner-all ui-widget">Flood optimisé</button><br><br></div></center>';

        document.getElementById ("floodOpti").addEventListener(
        "click", function() {
            var idCible = document.location.href.split("id=")[1].split("&")[0];
            var idCibleArr = [idCible];
            setCookie("AbyssusHelper_CiblesMF", idCibleArr, 1);
            document.location.href="https://s1.abyssus.games/jeu.php?page=ennemies";
        }, false
        );
    }
}
//----------------------------------------------------------------------------------------------------------
//PAGE ACCUEIL - RAFRAICHIT COOKIES ET INDIQUE TROUPES A QUAI - AFFICHE PARAMETRES - CHANGELOG
//----------------------------------------------------------------------------------------------------------

else if(document.URL.indexOf("?")==-1){
    var couveuse = 0;
    var nurserie = 0;
    var techniquedf = 0;
    var tdpHB = 0;
    var bonusTDP = 0;
    var bonusFDF = 0;
    var bonusCDF = 0;
    var tdp = 0;
    var niveauRR = 0;
    var niveauEcaille = 0;
    var morsure = 0;
    var morsureHB = 0;
    var instinctChasse = 0;
    var lastVersion = getCookie("AbyssusHelper_version").split(".");
    var currentVersion = version.split(".");

    //News customisées
    var news = '<img src="images/news.png" style="float: left; height: 50px;"><img src="images/news.png" style="float: right; height: 50px;">';
    news += '<h2 style="margin: 0px; margin-top: 10px; padding: 0px; font-size: 22px;">DERNIERES NEWS o0o</h2>';
    news += '<br/><br/>';
    news += '<br/><br/>';


    document.getElementById("news").innerHTML = news + document.getElementById("news").innerHTML;




    //Page paramètres
    //alert(getCookie("AbyssusHelper_param"));
    if (getCookie("AbyssusHelper_param") == "true") {
        var contenu = "";
        var ghostAuto = getCookie("AbyssusHelper_ghostAuto");
        var antisondeAuto = getCookie("AbyssusHelper_antisondeAuto");
        var antisondeAutoTaille = getCookie("AbyssusHelper_antisondeAutoTaille");
        var prodInfo = getCookie("AbyssusHelper_prodInfo");
        var horloge = getCookie("AbyssusHelper_horloge");
        var tailleSonde = getCookie("AbyssusHelper_tailleSonde");
        var alerteCA = getCookie("AbyssusHelper_alerteCAOff");
        var paliersPARAM = getCookie("AbyssusHelper_paliersPARAM");
        var compacte = getCookie("AbyssusHelper_restyle");
        var postFloods = getCookie("AbyssusHelper_postFloodsOFF");
        setCookie("AbyssusHelper_param", false, 1);


        newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">Accueil - AbyssusHelperPB - v' + version + '</font></span></center>';
        newDiv.innerHTML += '<br/><hr color="blue">';
        newDiv.innerHTML += '<font color="white">Paramètres \& Outils</font>';
        contenu +='<center><h2>OUTILS : </h2></center>';
        //log TM
        contenu += '<input type="button" name="log TM" id="log" class="ui-button ui-corner-all ui-widget" value="Log TM">';
        //log dons de quete
        contenu += '&nbsp;&nbsp;<input type="button" name="quete" id="quete" class="ui-button ui-corner-all ui-widget" value="Log Quêtes">';
        //Modifier la chaîne
        contenu += '&nbsp;&nbsp;<input type="button" name="modifChaine" id="modifChaine" class="ui-button ui-corner-all ui-widget" value="Modifier Chaîne">';
        //Guide d'utilisation du script
        contenu += '&nbsp;&nbsp;<input type="button" name="manuel" id="manuel" class="ui-button ui-corner-all ui-widget" value="Manuel d\'utilisation">';
        //Démineur !
        contenu += '&nbsp;&nbsp;<input type="button" name="demineur" id="demineur" class="ui-button ui-corner-all ui-widget" value="Démineur">';
        //afficher changelog
        contenu += '&nbsp;&nbsp;<input type="button" name="changelog" id="changelog" class="ui-button ui-corner-all ui-widget" value="Changelog">';


        contenu +='<br/><br/><center><h2>VOS PARAMÈTRES : </h2></center>';
        contenu +='<form>';
        //ghost auto
        contenu +='<input type="checkbox" name="ghost" id="ghost"';
        if (ghostAuto == "true") contenu += 'checked';
        contenu += '/>Ghost automatique en fin de (multi)flood';
        contenu += '<br/>';
        //antisondeAuto
        contenu +='<br/><input type="checkbox" name="antisonde" id="antisonde"';
        if (antisondeAuto == "true") contenu += 'checked';
        contenu += '/>Antisonde automatique à chaque visite de la page armée';
        //PV AntisondeAuto
        if (antisondeAuto == "true") {
            contenu +='<br/><input type="number" name="antisondeTaille" id="antisondeTaille" ';
            if (antisondeAutoTaille != "") {
                contenu += 'value="' + antisondeAutoTaille + '"';
            }
            contenu += '/> Points de vie de l\'antisonde';
        }
        contenu += '<br/>';
        //taille sonde

        contenu +='<br/><input type="number" name="sondeTaille" id="sondeTaille" ';
            if (tailleSonde != "") {
                contenu += 'value="' + tailleSonde + '"';
            }
            contenu += '/> Nombre de petites Roussettes par sonde';
        contenu += '<br/>';

        //détails prod
        contenu +='<br/><input type="checkbox" name="prod" id="prod"';
        if (prodInfo == "true") contenu += 'checked';
        contenu += '/>Stats des unités avec prise en compte des niveaux de Morsure et Ecaille sur la page production d\'unités';
        contenu += '<br/>';
        //horloge
        contenu +='<br/><input type="checkbox" name="horlogeAH" id="horlogeAH"';
        if (horloge == "true") contenu += 'checked';
        contenu += '/>Horloge';
        contenu += '<br/>';
        //alerteCA
        contenu +='<br/><input type="checkbox" name="alerteCA" id="alerteCA"';
        if (alerteCA == "off") contenu += 'checked';
        contenu += '/>Désactiver les notifications Chat Alliance';
        contenu += '<br/>';
        //paliers
        contenu +='<br/><input type="checkbox" name="paliers" id="paliers"';
        if (paliersPARAM == "off") contenu += 'checked';
        contenu += '/>Désactiver le respect des paliers TM par le MF (uniquement pour des situations EXCEPTIONNELLES)';
        contenu += '<br/>';
        //post floods
        contenu +='<br/><input type="checkbox" name="postfloods" id="postfloods"';
        if (postFloods == "forcedoff") contenu += 'checked';
        contenu += '/>Désactiver le post automatique de floods sur le forum (ATTENTION : Cette préférence n\'est pas raffraîchie automatiquement, elle expire tous les 7 jours)';
        contenu += '<br/>';
        //version compacte
        contenu +='<br/><input type="checkbox" name="compacte" id="compacte"';
        if (compacte == "on") contenu += 'checked';
        contenu += '/>Afficher le jeu de manière compacte (EXPERIMENTAL)';
        contenu += '<br/>';
        contenu += '</form>';

        for (var i = 0; i < document.getElementById("bloc").children.length; i++){
            document.getElementById("bloc").children[i].style.display = "none";
        };


        document.getElementById("bloc").innerHTML += contenu;

        //active inputs
/*
        document.getElementById('changelog').addEventListener('click', (event) => {
            document.getElementById("bloc").innerHTML = changelog;
        });
        document.getElementById('log').addEventListener('click', (event) => {
            document.getElementById("bloc").innerHTML = '<iframe src="http://askigame.000webhostapp.com/Abyssus/LogTMWar/AffTM.php" style="border:0; height:1500px; width:100%">></iframe>';
        });
        document.getElementById('quete').addEventListener('click', (event) => {
            document.getElementById("bloc").innerHTML = '<iframe src="https://askigame.000webhostapp.com/Abyssus/QueteAlly/" style="border:0; height:1500px; width:100%">></iframe>';
        });
        document.getElementById('modifChaine').addEventListener('click', (event) => {
            document.getElementById("bloc").innerHTML = '<iframe src="https://askigame.000webhostapp.com/Abyssus/ModifierChaine/" style="border:0; height:1500px; width:100%">></iframe>';
        });
        document.getElementById('manuel').addEventListener('click', (event) => {
            document.getElementById("bloc").innerHTML = '<iframe src="https://askigame.000webhostapp.com/Abyssus/AbyssusHelper/" style="border:0; height:1500px; width:100%">></iframe>';
        });
        document.getElementById('demineur').addEventListener('click', (event) => {
            document.getElementById("bloc").innerHTML = '<iframe src="https://askigame.000webhostapp.com/Demineur/index.php" style="border:0; height:1500px; width:100%">></iframe>';
        });
*/
        document.getElementById('ghost').addEventListener('change', (event) => {
            if (event.target.checked) {
                setCookie("AbyssusHelper_ghostAuto", true, 7);
            } else {
                setCookie("AbyssusHelper_ghostAuto", false, 7);
            }
        });
        document.getElementById('antisonde').addEventListener('change', (event) => {
            if (event.target.checked) {
                setCookie("AbyssusHelper_antisondeAuto", true, 7);
                setCookie("AbyssusHelper_param", true, 1);
                document.location.href="https://s1.abyssus.games/jeu.php";
            } else {
                setCookie("AbyssusHelper_antisondeAuto", false, 7);
                setCookie("AbyssusHelper_param", true, 1);
                document.location.href="https://s1.abyssus.games/jeu.php";
            }
        });
        try {
        document.getElementById('antisondeTaille').addEventListener('change', (event) => {
            setCookie("AbyssusHelper_antisondeAutoTaille", event.target.value, 7);
        });
        } catch (exception) {}

        document.getElementById('sondeTaille').addEventListener('change', (event) => {
            setCookie("AbyssusHelper_tailleSonde", event.target.value, 7);
        });

        document.getElementById('prod').addEventListener('change', (event) => {
            if (event.target.checked) {
                setCookie("AbyssusHelper_prodInfo", true, 7);
            } else {
                setCookie("AbyssusHelper_prodInfo", false, 7);
            }
        });
        document.getElementById('horlogeAH').addEventListener('change', (event) => {
            if (event.target.checked) {
                setCookie("AbyssusHelper_horloge", true, 7);
            } else {
                setCookie("AbyssusHelper_horloge", false, 7);
            }
        });
        document.getElementById('alerteCA').addEventListener('change', (event) => {
            if (event.target.checked) {
                setCookie("AbyssusHelper_alerteCAOff", "off", 7);
            } else {
                setCookie("AbyssusHelper_alerteCAOff", "", 7);
            }
        });
        document.getElementById('paliers').addEventListener('change', (event) => {
            if (event.target.checked) {
                setCookie("AbyssusHelper_paliersPARAM", "off", 7);
            } else {
                setCookie("AbyssusHelper_paliersPARAM", "", 7);
            }
        });
        document.getElementById('postfloods').addEventListener('change', (event) => {
            if (event.target.checked) {
                setCookie("AbyssusHelper_postFloodsOFF", "forcedoff", 7);
            } else {
                setCookie("AbyssusHelper_postFloodsOFF", "", 7);
            }
        });
        document.getElementById('compacte').addEventListener('change', (event) => {
            if (event.target.checked) {
                setCookie("AbyssusHelper_restyle", "on", 7);
            } else {
                setCookie("AbyssusHelper_restyle", "", 7);
            }
        });

    } else if (parseInt(lastVersion[0]) < parseInt(currentVersion[0]) || parseInt(lastVersion[1]) < parseInt(currentVersion[1]) || parseInt(lastVersion[2]) < parseInt(currentVersion[2])) {
        //changelog
        setCookie("AbyssusHelper_version", version, 7);
        newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">Accueil - AbyssusHelperPB - v' + version + '</font></span></center>';
        newDiv.innerHTML += '<br/><hr color="blue">';
        newDiv.innerHTML += '<font color="white">Changelog - liste des nouveautés</font>';

        contenu ='<center><h2>AbyssusHelper a été mis à jour... Quoi de neuf ?</h2></center>';
        contenu += changelog;
        document.getElementById("recapitulatif").innerHTML = contenu;

    } else {
        //Rafraichit les cookies de paramètres et préférences
        if (getCookie("AbyssusHelper_ghostAuto") != "") {
            setCookie("AbyssusHelper_ghostAuto", getCookie("AbyssusHelper_ghostAuto"), 7);
        }
        if (getCookie("AbyssusHelper_antisondeAuto") != "") {
            setCookie("AbyssusHelper_antisondeAuto", getCookie("AbyssusHelper_antisondeAuto"), 7);
        }
        if (getCookie("AbyssusHelper_antisondeAutoTaille") != "") {
            setCookie("AbyssusHelper_antisondeAutoTaille", getCookie("AbyssusHelper_antisondeAutoTaille"), 7);
        }
        if (getCookie("AbyssusHelper_horloge") != "") {
            setCookie("AbyssusHelper_horloge", getCookie("AbyssusHelper_horloge"), 7);
        }
        if (getCookie("AbyssusHelper_tailleSonde") != "") {
            setCookie("AbyssusHelper_tailleSonde", getCookie("AbyssusHelper_tailleSonde"), 7);
        }
        if (getCookie("AbyssusHelper_prodInfo") != "") {
            setCookie("AbyssusHelper_prodInfo", getCookie("AbyssusHelper_prodInfo"), 7);
        }
        if (getCookie("AbyssusHelper_nbVague") != "") {
            setCookie("AbyssusHelper_nbVague", getCookie("AbyssusHelper_nbVague"), 7);
        }
        if (getCookie("AbyssusHelper_tmVague") != "") {
            setCookie("AbyssusHelper_tmVague", getCookie("AbyssusHelper_tmVague"), 7);
        }
        if (getCookie("AbyssusHelper_alerteCAOff" != "")) {
            setCookie("AbyssusHelper_alerteCAOff", getCookie("AbyssusHelper_alerteCAOff"), 7);
        }
        if (getCookie("AbyssusHelper_paliersPARAM" != "")) {
            setCookie("AbyssusHelper_paliersPARAM", getCookie("AbyssusHelper_paliersPARAM"), 7);
        }
        if (getCookie("AbyssusHelper_restyle" != "")) {
            setCookie("AbyssusHelper_restyle", getCookie("AbyssusHelper_restyle"), 7);
        }
        var statsDiv = document.getElementById("recapitulatif");

        var bonus = statsDiv.getElementsByTagName('center')[1].innerHTML;
        bonusTDP = parseInt(bonus.split("+")[1].split(" ")[0]);
        bonusFDF = parseInt(bonus.split("+")[2].split(" ")[0]);
        bonusCDF = parseInt(bonus.split("+")[3].split(" ")[0]);

        //enregistrement des niveaux.
        for (let i=0; i<12; i++) {
            if (statsDiv.getElementsByTagName('tr')[i].cells[0].innerHTML.indexOf("Couveuse") != -1) {
                if (statsDiv.getElementsByTagName('tr')[i].cells[1].innerHTML.indexOf("+") != -1) {
                    var temp = statsDiv.getElementsByTagName('tr')[i].cells[1].innerHTML.split("+");
                    couveuse = parseInt(temp[0]);

                } else {
                    couveuse = parseInt(statsDiv.getElementsByTagName('tr')[i].cells[1].innerHTML);
                }
            }
            if (statsDiv.getElementsByTagName('tr')[i].cells[2].innerHTML.indexOf("Instinct de chasse") != -1) {
                if (statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML.indexOf("+") != -1) {
                    temp = statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML.split("+");
                    instinctChasse = parseInt(temp[0]);

                } else {
                    instinctChasse = parseInt(statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML);
                }
            }
            if (statsDiv.getElementsByTagName('tr')[i].cells[0].innerHTML.indexOf("Nurserie") != -1) {
                if (statsDiv.getElementsByTagName('tr')[i].cells[1].innerHTML.indexOf("+") != -1) {
                    temp = statsDiv.getElementsByTagName('tr')[i].cells[1].innerHTML.split("+");
                    nurserie = parseInt(temp[0]);

                } else {
                    nurserie = parseInt(statsDiv.getElementsByTagName('tr')[i].cells[1].innerHTML);
                }
            }
            if (statsDiv.getElementsByTagName('tr')[i].cells[2].innerHTML.indexOf("Technique") != -1) {
                if (statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML.indexOf("+") != -1) {
                    temp = statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML.split("+");
                    techniquedf = parseInt(temp[0]);

                } else {
                    techniquedf = parseInt(statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML);
                }
            }
            if (statsDiv.getElementsByTagName('tr')[i].cells[2].innerHTML.indexOf("caille") != -1) {
                if (statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML.indexOf("+") != -1) {
                    temp = statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML.split("+");
                    niveauEcaille = parseInt(temp[0]);

                } else {
                    niveauEcaille = parseInt(statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML);
                }
            }
            if (statsDiv.getElementsByTagName('tr')[i].cells[2].innerHTML.indexOf("Morsure") != -1) {
                if (statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML.indexOf("+") != -1) {
                    temp = statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML.split("+");
                    morsureHB = parseInt(temp[0]);

                } else {
                    morsureHB = parseInt(statsDiv.getElementsByTagName('tr')[i].cells[3].innerHTML);
                }
            }
            if (statsDiv.getElementsByTagName('tr')[i].cells[0].innerHTML.indexOf("rocheux") != -1) {
                if (statsDiv.getElementsByTagName('tr')[i].cells[1].innerHTML.indexOf("+") != -1) {
                    temp = statsDiv.getElementsByTagName('tr')[i].cells[1].innerHTML.split("+");
                    niveauRR = parseInt(temp[0]);

                } else {
                    niveauRR = parseInt(statsDiv.getElementsByTagName('tr')[i].cells[1].innerHTML);
                }
            }
        }

        tdpHB = couveuse + nurserie + techniquedf;
        tdp = tdpHB + bonusTDP;
        morsure = morsureHB + bonusFDF;

        setCookie("AbyssusHelper_morsureHB", morsureHB, 7);
        setCookie("AbyssusHelper_morsure", morsure, 7);
        setCookie("AbyssusHelper_bonusCDF", bonusCDF, 7);
        setCookie("AbyssusHelper_tdpHB", tdpHB, 7);
        setCookie("AbyssusHelper_tdp", tdp, 7);
        setCookie("AbyssusHelper_niveauRR", niveauRR, 7);
        setCookie("AbyssusHelper_niveauEcaille", niveauEcaille, 7);
        setCookie("AbyssusHelper_instinctChasse", instinctChasse, 7);
        setCookie("AbyssusHelper_version", version, 7);

    //Troupes qui dorment
    function analyseTexte(texte) { //Analyse le texte "Troupes en attaque..."
        var CDFreturn = 0;
        texte = texte.replace(/\n/g, " ");
        texte = texte.replace(/,/g, "");
        texte = texte.replace(/[\D?\d?]Troupes en attaque :\s/, "");

        //Troupe
        texte = texte.replace(/Remora/, "Rem");
        texte = texte.replace(/Petite Roussette/, "PR");
        texte = texte.replace(/Roussette/, "R");
        texte = texte.replace(/Grande Roussette/, "GR");
        texte = texte.replace(/Requin P[ée]lerin/, "RP");
        texte = texte.replace(/Mur[èe]ne/, "M");
        texte = texte.replace(/Mur[èe]ne Electrique/, "ME");
        texte = texte.replace(/Requin Marteau/, "RM");
        texte = texte.replace(/Requin L[ée]zard/, "RL");
        texte = texte.replace(/Requin L[ée]zard V[ée]t[ée]ran/, "RLV");
        texte = texte.replace(/Requin Blanc/, "RB");
        texte = texte.replace(/Grand Requin Blanc/, "GRB");
        texte = texte.replace(/Kraken/, "K");
        texte = texte.replace(/Kraken Immortel/, "KI");



        var ArrayTexte = texte.split(/\s+/);


        getNbparUnite("Rem");
        getNbparUnite("PR");
        getNbparUnite("R");
        getNbparUnite("GR");
        getNbparUnite("RP");
        getNbparUnite("M");
        getNbparUnite("ME");
        getNbparUnite("RM");
        getNbparUnite("RL");
        getNbparUnite("RLV");
        getNbparUnite("RB");
        getNbparUnite("GRB");
        getNbparUnite("K");
        getNbparUnite("KI");

    function getNbparUnite(Unite) { //Récupère le nombre associé à l'unité (en paramètre)
            var plc = ArrayTexte.indexOf(Unite);
            var NbTroupe = "";
            if (plc != -1) {
                var OK = true;
                while (OK) {
                    plc--;
                    if (/\d{1,3}/.test(ArrayTexte[plc])) {
                        NbTroupe = ArrayTexte[plc] + NbTroupe;
                    } else {
                        OK = false;
                    }
                }
                CDFreturn += parseInt(NbTroupe);
            }
    }
        return CDFreturn;
    }


    //Nombre de troupe au total
    var CDF = 0;
    for(var a=0; a<14; a++){
        CDF += parseInt(statsDiv.querySelectorAll("table")[1].children[0].children[a].children[1].textContent.replace(/ /g,""));

    };
    //Nombre de troupe en mouvement (dans des attaques)
    var CDFenMVT = 0;
    for (var z=0; z< document.querySelectorAll("font i").length; z++){
        if (document.querySelectorAll("font i")[z].childNodes[2].textContent != ""){ //Si il n'y a pas le mot "Annuler"
        CDFenMVT += analyseTexte(document.querySelectorAll("font i")[z].childNodes[2].textContent);
        } else { //Si il y a le mot "Annuler"
            CDFenMVT += analyseTexte(document.querySelectorAll("font i")[z].childNodes[3].textContent);
        }
    }

    var CDFdif = CDF - CDFenMVT; // Nombre de troupes stationnées.

    //Ajout du texte sur la page.
    var nombreTroupes = '<br><strong>Nombre de troupes stationnées chez vous: <a href="https://s1.abyssus.games/jeu.php?page=armee">' + CDFdif.toLocaleString(undefined,{ maximumFractionDigits: 0 }) + '</a></strong>';


    statsDiv.getElementsByTagName('center')[1].innerHTML = nombreTroupes + '<br><br>' + liensUtiles + '<br><br>' + statsDiv.getElementsByTagName('center')[1].innerHTML;


    //DEBUG
    //alert(tdpHB);
    //alert(tdp);
    //alert(bonusFDF);
    //alert(bonusCDF);
	newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">Accueil - AbyssusHelperPB - v' + version + '</font></span></center>';
    newDiv.innerHTML += '<br/><hr color="blue">';
    newDiv.innerHTML += '<font color="white"> Les cookies ont bien été mis à jour</font>';
    newDiv.innerHTML += '<br/><hr color="blue">';
    newDiv.innerHTML += '<br/><center><div class="divmf" style=""><button id="parametresAH", class="envoi_mf ui-button ui-corner-all ui-widget">Paramètres & Outils</button><br><br></div></center>';



    //activer le bouton
    document.getElementById ("parametresAH").addEventListener(
        "click", function() {
            setCookie("AbyssusHelper_param", true, 1);
            document.location.href="https://s1.abyssus.games/jeu.php";
        }, false
    );
    }
}



//----------------------------------------------------------------------------------------------------------
//Classement Alliances
//----------------------------------------------------------------------------------------------------------
else if (document.URL.indexOf("classementalliance") != -1) {

}
//----------------------------------------------------------------------------------------------------------
//Classement Joueurs
//----------------------------------------------------------------------------------------------------------
else if ( document.URL.indexOf("classementjoueur") != -1 ){

}
//----------------------------------------------------------------------------------------------------------
//Chat Général
//----------------------------------------------------------------------------------------------------------
else if (document.URL.indexOf("cgnew") != -1){

}


//----------------------------------------------------------------------------------------------------------
//Chat Alliance
//----------------------------------------------------------------------------------------------------------
else if (document.URL.indexOf("page=chatalliance") != -1){


}

//----------------------------------------------------------------------------------------------------------
//ARMEE
//----------------------------------------------------------------------------------------------------------
else if(document.URL.indexOf("armee")!=-1) {
	newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">Armée</font></span></center>';
    newDiv.innerHTML += '<br/><hr color="blue">';
    if (getCookie("AbyssusHelper_antisondeAuto") == "true") {
        var indicateur = 'activée</font>';
    } else {
        indicateur = 'désactivée</font>';
    }

    newDiv.innerHTML += '<br/><font color="white">Antisonde automatique : <strong>' + indicateur + '</strong></font>';
    if (getCookie("AbyssusHelper_antisondeAuto") == "true") {
        //place l'antisonde !

        var taille_antisonde = parseInt(getCookie("AbyssusHelper_antisondeAutoTaille").replace(/ /g,""));
        niveauRR = parseInt(getCookie("AbyssusHelper_niveauRR"));
        niveauEcaille = parseInt(getCookie("AbyssusHelper_niveauEcaille"));
        var unitésEnTM = parseInt(document.getElementById("bloc").getElementsByTagName("table")[0].getElementsByTagName("tr")[15].cells[1].innerHTML.replace(/ /g,""));
        var vieEnRR = parseInt(document.getElementById("bloc").getElementsByTagName("table")[0].getElementsByTagName("tr")[15].cells[2].innerHTML.replace(/ /g,""));

        var sj_bdc = parseInt(document.getElementById("bloc").getElementsByTagName("table")[0].innerHTML.split('data-type="SJ_loge" data-nb="')[1].split('" id="SJ"')[0]);
        var s_bdc = parseInt(document.getElementById("bloc").getElementsByTagName("table")[0].innerHTML.split('data-type="S_loge" data-nb="')[1].split('" id="S"')[0]);
        var rb_bdc = parseInt(document.getElementById("bloc").getElementsByTagName("table")[0].innerHTML.split('data-type="RB_loge" data-nb="')[1].split('" id="RB"')[0]);
        var m_bdc = parseInt(document.getElementById("bloc").getElementsByTagName("table")[0].innerHTML.split('data-type="M_loge" data-nb="')[1].split('" id="M"')[0]);

        var token_bdc = document.getElementById("bloc").innerHTML.split('href="jeu.php?page=armee&amp;action=barriere&amp;token=')[1].split('"')[0];

        if(getCookie("AbyssusHelper_antisondeAutoStage") == "") {
            setCookie("AbyssusHelper_antisondeAutoStage", 0, 1);
            document.location.href="https://s1.abyssus.games/jeu.php?page=armee&action=barriere&token=" + token_bdc;
        } else if (unitésEnTM == 0) {
            if (sj_bdc != 0) {
                $.post('ajax/deplacement_armee.php', {type:"SJ", nb:1}, function(data){
                    document.location.href='jeu.php?page=armee';
                });
            } else if (s_bdc != 0) {
                $.post('ajax/deplacement_armee.php', {type:"S", nb:1}, function(data){
                    document.location.href='jeu.php?page=armee';
                });
            } else if (rb_bdc != 0) {
                $.post('ajax/deplacement_armee.php', {type:"SC", nb:1}, function(data){
                    document.location.href='jeu.php?page=armee';
                });
            } else if (m_bdc != 0) {
                $.post('ajax/deplacement_armee.php', {type:"R", nb:1}, function(data){
                    document.location.href='jeu.php?page=armee';
                });
            }
        } else if (vieEnRR < taille_antisonde && getCookie("AbyssusHelper_antisondeAutoStage") != "-1") {
                //il reste de l'antisonde à placer
            if (s_bdc != 0 && parseInt(getCookie("AbyssusHelper_antisondeAutoStage")) < 1) {
                var vie_uniteHB = 70;
                var vie_necessaire = taille_antisonde;
                var troupes_necessaires = Math.ceil(vie_necessaire / (vie_uniteHB*(1+0.1+3*0.05+(niveauEcaille/10))));
                var troupes_bougees = Math.min(troupes_necessaires, s_bdc);
                $.post('ajax/deplacement_armee.php', {type:"S_dome", nb:troupes_bougees}, function(data){
                    setCookie("AbyssusHelper_antisondeAutoStage", 1, 1);
                    document.location.href='jeu.php?page=armee';
                });
            } else if (rb_bdc != 0 && parseInt(getCookie("AbyssusHelper_antisondeAutoStage")) < 2) {
                vie_uniteHB = 1250;
                vie_necessaire = taille_antisonde - vieEnRR;
                troupes_necessaires = Math.ceil(vie_necessaire / (vie_uniteHB*(1+0.1+3*0.05+(niveauEcaille/10))));
                troupes_bougees = Math.min(troupes_necessaires, rb_bdc);
                $.post('ajax/deplacement_armee.php', {type:"RB_dome", nb:troupes_bougees}, function(data){
                    setCookie("AbyssusHelper_antisondeAutoStage", 2, 1);
                    document.location.href='jeu.php?page=armee';
                });
            } else if (m_bdc != 0 && parseInt(getCookie("AbyssusHelper_antisondeAutoStage")) < 3) {
                vie_uniteHB = 20;
                vie_necessaire = taille_antisonde - vieEnRR;
                troupes_necessaires = Math.ceil(vie_necessaire / (vie_uniteHB*(1+0.1+3*0.05+(niveauEcaille/10))));
                troupes_bougees = Math.min(troupes_necessaires, m_bdc);
                $.post('ajax/deplacement_armee.php', {type:"M_dome", nb:troupes_bougees}, function(data){
                    setCookie("AbyssusHelper_antisondeAutoStage", 3, 1);
                    document.location.href='jeu.php?page=armee';
                });
            } else if (sj_bdc != 0 && parseInt(getCookie("AbyssusHelper_antisondeAutoStage")) < 4) {
                vie_uniteHB = 2;
                vie_necessaire = taille_antisonde - vieEnRR;
                troupes_necessaires = Math.ceil(vie_necessaire / (vie_uniteHB*(1+0.1+3*0.05+(niveauEcaille/10))));
                troupes_bougees = Math.min(troupes_necessaires, sj_bdc);
                $.post('ajax/deplacement_armee.php', {type:"SJ_dome", nb:troupes_bougees}, function(data){
                    setCookie("AbyssusHelper_antisondeAutoStage", 4, 1);
                    document.location.href='jeu.php?page=armee';
                });
            } else {
                setCookie("AbyssusHelper_antisondeAutoStage", -1, 1);
                location.reload();
            }
        } else {
            setCookie("AbyssusHelper_antisondeAutoStage", "", 1);
        }
    }
}


//----------------------------------------------------------------------------------------------------------
//Exploration
//----------------------------------------------------------------------------------------------------------
else if(document.URL.indexOf("page=chasse")!=-1) {
    newDiv.innerHTML = '<center><span style="border:1.5px solid white; background:#06C;"><font color="white">Exploration</font></span></center>';
    newDiv.innerHTML += '<hr color="blue">';
    var nbvague = 1;
    if (getCookie("AbyssusHelper_nbVague") != "") nbvague = parseInt(getCookie("AbyssusHelper_nbVague"));
    var tmvague = 1;
    if (getCookie("AbyssusHelper_tmVague") != "") tmvague = parseInt(getCookie("AbyssusHelper_tmVague"));
    newDiv.innerHTML += '<input type="button" class="button ui-button ui-corner-all ui-widget" id="suggestion" value="Suggérer chasse"><br/><br/>';
    newDiv.innerHTML += '<input type="number" id="vagues" value="' + nbvague + '"> <font color="white">vagues</font><br/>';
    newDiv.innerHTML += '<input type="number" id="tmvague" value="' + tmvague + '"> <font color="white">TM par vague</font><br/><br/>';
    newDiv.innerHTML += '<input type="button" class="button ui-button ui-corner-all ui-widget" id="chasseAuto" value="Lancer chasse automatique"><br/>';


    //suggérer chasse
    document.getElementById("suggestion").addEventListener(
        "click", function() {
            //max de vagues
            //document.getElementById("vagues").value = parseInt(getCookie("AbyssusHelper_instinctChasse"));
            var nbvague = parseInt(document.getElementById("vagues").value);
            //calculer FDF par vague
            var fdf = 0;
            var morsure = getCookie("AbyssusHelper_morsure");
            var rem = Math.floor($('#SJ').val().replace(/ /g,"")/nbvague);
            var pr = Math.floor($('#S').val().replace(/ /g,"")/nbvague);
            var r = Math.floor($('#SC').val().replace(/ /g,"")/nbvague);
            var gr = Math.floor($('#R').val().replace(/ /g,"")/nbvague);
            var rp = Math.floor($('#RB').val().replace(/ /g,"")/nbvague);
            var m = Math.floor($('#M').val().replace(/ /g,"")/nbvague);
            var me = Math.floor($('#PP').val().replace(/ /g,"")/nbvague);
            var rm = Math.floor($('#B').val().replace(/ /g,"")/nbvague);
            var rl = Math.floor($('#BC').val().replace(/ /g,"")/nbvague);
            var rlv = Math.floor($('#GRB').val().replace(/ /g,"")/nbvague);
            var rb = Math.floor($('#OQ').val().replace(/ /g,"")/nbvague);
            var grb = Math.floor($('#OQC').val().replace(/ /g,"")/nbvague);
            var k = Math.floor($('#K').val().replace(/ /g,"")/nbvague);
            var ki = Math.floor($('#L').val().replace(/ /g,"")/nbvague);
            fdf = (1+morsure/10)*(rem + pr*60 + r*100 + gr*150 + rp*150 + m*2 + me*12 + rm*2000 + rl*100 + rlv*200 + rb*1100 + grb*2500 + k*100000 + ki*1);
            //alert(fdf);
            //alert(tmJoueur);
            document.getElementById("tmvague").value = Math.floor((fdf/(10.959*Math.pow(tmJoueur,0.1725))*(1-2/100))/10000)*10000;
        }, false
    );

    //activer le bouton
    document.getElementById("chasseAuto").addEventListener(
        "click", function() {
            var recap;
            var nbvague = parseInt(document.getElementById("vagues").value);
            setCookie("AbyssusHelper_nbVague", nbvague, 7);
            var tmvague = parseInt(document.getElementById("tmvague").value);
            setCookie("AbyssusHelper_tmVague", tmvague, 7);
            var rem = Math.floor($('#SJ').val().replace(/ /g,"")/nbvague);
            var pr = Math.floor($('#S').val().replace(/ /g,"")/nbvague);
            var r = Math.floor($('#SC').val().replace(/ /g,"")/nbvague);
            var gr = Math.floor($('#R').val().replace(/ /g,"")/nbvague);
            var rp = Math.floor($('#RB').val().replace(/ /g,"")/nbvague);
            var m = Math.floor($('#M').val().replace(/ /g,"")/nbvague);
            var me = Math.floor($('#PP').val().replace(/ /g,"")/nbvague);
            var rm = Math.floor($('#B').val().replace(/ /g,"")/nbvague);
            var rl = Math.floor($('#BC').val().replace(/ /g,"")/nbvague);
            var rlv = Math.floor($('#GRB').val().replace(/ /g,"")/nbvague);
            var rb = Math.floor($('#OQ').val().replace(/ /g,"")/nbvague);
            var grb = Math.floor($('#OQC').val().replace(/ /g,"")/nbvague);
            var k = Math.floor($('#K').val().replace(/ /g,"")/nbvague);
            var ki = Math.floor($('#L').val().replace(/ /g,"")/nbvague);
            var token = $( "input[name='token']").val();
            var urlsend = $(location).attr('href');

            for (var i=1; i<parseInt(nbvague)+1;i++) {
                $.ajax({
                    dataType: "html",
                    type: 'POST',
                    async:false,
                    url: urlsend,
                    data : {token:token,tm:tmvague,SJ:rem,S:pr,SC:r,R:gr,RB:rp,M:m,PP:me,B:rm,BC:rl,GRB:rlv,OQ:rb,OQC:grb,K:k,L:ki,explorer:"Explorer"},
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    success: function(data) {
                        recap = i;
                    }
                });
            }
            //alert(recap + ' vagues lancées, vérifiez bien leur contenu !');
            document.location.href="https://s1.abyssus.games/jeu.php?page=chasse";
        }, false
    );
}

//----------------------------------------------------------------------------------------------------------
//Construction
//----------------------------------------------------------------------------------------------------------
else if(document.URL.indexOf("construction")!=-1){
    let tableau_batiment = document.querySelectorAll(".petith2");

    function extraitNombre(str){
        return Number(str.replace(/[^\d]/g, ""))
    }

    function cherche_niv_Batiment(niv){
        let niveau = "";
        for(let i = 0; i<=niv;i++){
            niveau = tableau_batiment[i].childNodes[1].innerHTML;
        }
        niveau = extraitNombre(niveau)
        niveau = parseInt(niveau);
        return niveau;
    }

    //production ferme
    let production_ferme = 200;

    function calc_prod_ferme(niveau_ferme){
        for(let i = 1; i<=niveau_ferme;i++){
            production_ferme =production_ferme + production_ferme*(70/100);
        }
        return Math.ceil(production_ferme);
    }
    //prod coquillages et crustacés

     let production_crustace = 40;

     function calc_prod_crustace(niveau_crustace){
        for(let i = 1; i<=niveau_crustace;i++){
            production_crustace =production_crustace + production_crustace*(70/100);
        }
        return Math.ceil(production_crustace);
    }

        //production coraux

    let production_coraux = 80;

    function calc_prod_coraux(niveau_coraux){
        for(let i = 1; i<=niveau_coraux;i++){
            production_coraux =production_coraux + production_coraux*(70/100);
        }
        return Math.ceil(production_coraux);
    }
    let niv_ferme = cherche_niv_Batiment(2);
    let prod_ferme = calc_prod_ferme(niv_ferme);
    let prod_ferme_jour = prod_ferme*24;

    let niv_coraux = cherche_niv_Batiment(0);
    let prod_coraux = calc_prod_coraux(niv_coraux);
    let prod_coraux_jour = prod_coraux*24;

    let niv_crust = cherche_niv_Batiment(1);
    let prod_crust = calc_prod_crustace(niv_crust);
    let prod_crust_jour =prod_crust*24;
    var international=new Intl.NumberFormat();

	newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">Construction</font></span></center>';
    newDiv.innerHTML += '<hr color="blue">';
    newDiv.innerHTML += '<center><font color="white">Production Journalière : </font></center>';
    newDiv.innerHTML += '<img src="images/corail.png" width="25" style="vertical-align:bottom;" alt="coraux">';
    newDiv.innerHTML += '<font color="white">  '+international.format(prod_coraux_jour)+'</font></br>';
    newDiv.innerHTML += '<img src="images/coquillage.png" alt="coquillage" height="25" style="vertical-align:bottom;">';
    newDiv.innerHTML += '<font color="white">  '+international.format(prod_crust_jour)+'</font></br>';
    newDiv.innerHTML += '<img src="images/nourriture.png" height="25" alt="nourriture" style="vertical-align:bottom;">';
    newDiv.innerHTML += '<font color="white">  '+international.format(prod_ferme_jour)+'</font></br>';
}

//----------------------------------------------------------------------------------------------------------
//Production D'Unités
//----------------------------------------------------------------------------------------------------------
else if(document.URL.indexOf("productionunite")!=-1){
    var pu_tdpHB = getCookie("AbyssusHelper_tdpHB");
    var pu_tdp = getCookie("AbyssusHelper_tdp");
    var pu_morsureHB = getCookie("AbyssusHelper_morsureHB");
    var pu_morsure =getCookie("AbyssusHelper_morsure");
    var pu_ecaille = getCookie("AbyssusHelper_niveauEcaille")

	newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">Production d&apos;unités</font></span></center>';
    newDiv.innerHTML += '<br/><hr color="blue">';

/*    newDiv.innerHTML += '<font color="white">Votre TDP : </font><font color="white">' + pu_tdp + ' (' + pu_tdpHB + 'HB)</font><br/>';
    newDiv.innerHTML += '<font color="white">Morsure&ensp;&nbsp;&nbsp; : </font><font color="white">' + pu_morsure + ' (' + pu_morsureHB + 'HB)</font> </br>';
    newDiv.innerHTML += '<font color="white">Ecaille : </font><font color="white">' + pu_ecaille + '</font> </br>';*/
    newDiv.innerHTML += '<table><tbody><tr><td><font color="white">TDP</font></td><td><font color="white">' + pu_tdp + ' (' + pu_tdpHB + 'HB)</font></td></tr><tr><td><font color="white">Morsure</font></td><td><font color="white">' + pu_morsure + ' (' + pu_morsureHB + 'HB)</font></td></tr><tr><td><font color="white">Ecaille</font></td><td><font color="white">' + pu_ecaille + ' </font></td></tr></tbody></table>';

    if(getCookie("AbyssusHelper_prodInfo") == "true") {
        $('.nb').keyup(function(){

            var vie = parseInt($(this).parent().parent().parent().find('.petittexte:eq(1)').text().replace(/\s/g, ''));
            var fdf = parseInt($(this).parent().parent().parent().find('.petittexte:eq(2)').text().replace(/\s/g, ''));
            var fdd = parseInt($(this).parent().parent().parent().find('.petittexte:eq(3)').text().replace(/\s/g, ''));

            $(this).parent().parent().parent().find('.petittexte:eq(1)').text(vie.toLocaleString(undefined,{ maximumFractionDigits: 0 }) + ' (' + (vie*(1+pu_ecaille/10)).toLocaleString(undefined,{ maximumFractionDigits: 0 })+')');
            $(this).parent().parent().parent().find('.petittexte:eq(2)').text(fdf.toLocaleString(undefined,{ maximumFractionDigits: 0 }) + ' (' + (fdf*(1+pu_morsure/10)).toLocaleString(undefined,{ maximumFractionDigits: 0 })+')');
            $(this).parent().parent().parent().find('.petittexte:eq(3)').text(fdd.toLocaleString(undefined,{ maximumFractionDigits: 0 }) + ' (' + (fdd*(1+pu_morsure/10)).toLocaleString(undefined,{ maximumFractionDigits: 0 })+')');

        });
    }

}
//----------------------------------------------------------------------------------------------------------
//Laboratoire
//----------------------------------------------------------------------------------------------------------

else if(document.URL.indexOf("laboratoire")!=-1){

	newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">Laboratoire</font></span></center>';

}

//----------------------------------------------------------------------------------------------------------
//Quete
//----------------------------------------------------------------------------------------------------------

else if(document.URL.indexOf("quete")!=-1){

}


//----------------------------------------------------------------------------------------------------------
//ALLIANCE
//----------------------------------------------------------------------------------------------------------
else if(document.URL.indexOf("listemembre")!=-1){
 	var totalTM =0;




    //Couleurs et rôles
    let scriptElement = document.createElement('script');
    scriptElement.src ="https://abyssushelper.fr/js/Alliance.js";
    if (false) { //TODO : si le site est down, récupérer cookie
        scriptElement.src = getCookie("AbyssusHelper_Chaine");
    } else {
        setCookie("AbyssusHelper_Chaine", "", 7)
    }

    document.body.appendChild(scriptElement);



    newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">Alliance</font></span></center>';
	var str = document.getElementById('bloc').getElementsByTagName('center')[0].innerHTML;

    var strSub;
    strSub = str.split("Nombre de membre : ")[1];
    strSub = strSub.split("<")[0];

    var nbMembre = parseInt(strSub);

    //Nombre membres
    newDiv.innerHTML += '<br/><hr color="blue">';
    //newDiv.innerHTML += '<font color="white">Nombre de membre : </font>' + '<font color="white">' + nbMembre +'</font>';

    //Calcul total membres
    for (var iter=1; iter < nbMembre +1; iter++) {
        var stringTmMembre=(document.getElementById('tableaumembre').getElementsByTagName('tr')[iter].cells[5].innerHTML).replace(/ /g,"");
        var tmMembre = parseInt(stringTmMembre);
        totalTM = totalTM + tmMembre;
    }

    var tmMoyen = Math.floor(totalTM/nbMembre);

    //Format des nombres, en fonction de la localisation du client
    var totalTmStr = totalTM.toLocaleString(
        undefined,
        { maximumFractionDigits: 0 }
    );
    var tmMoyenStr = tmMoyen.toLocaleString(
        undefined,
        { maximumFractionDigits: 0 }
    );

    //calcule difference par rapport à la dernière fois.
    var tmAllyOld = getCookie("AbyssusHelper_tmAlly");
    if (tmAllyOld =="") {
        setCookie("AbyssusHelper_tmAlly", totalTM, 7);
    }

    var tmDiff = totalTM - tmAllyOld;

    if (tmDiff < 0) tmDiff = 0-tmDiff;

    var tmDiffStr = tmDiff.toLocaleString(
        undefined,
        { maximumFractionDigits: 0 }
    );

    newDiv.innerHTML += '<font color="white">Total TM : </font><font color="white">' + totalTmStr + ' <img src="images/eau.png" alt="terrain" style="vertical-align:center;" height="15"> </font>';
    if (tmAllyOld == ""){
    }else if (tmAllyOld < totalTM) {
        newDiv.innerHTML += '<br/><font color="chartreuse">+</font><font color="chartreuse">' + tmDiffStr + '</font>';
        setCookie("AbyssusHelper_tmAlly", totalTM, 7);
    } else if (tmAllyOld > totalTM) {
        newDiv.innerHTML += '<br/><font color="red"><strong>TM MANQUANT: ' + tmDiffStr + '</strong><a href="https://s1.abyssus.games/jeu.php#supprNotif' + totalTM + '"><img src="images/supprimer.png" alt="supprimer" style="vertical-align:center;" height="15"></a></font>';
        //rafraichit cookie avec la même valeur qu'avant: l'avertissement reste jusqua ce que le terrain soit récupéré
        setCookie("AbyssusHelper_tmAlly", tmAllyOld, 7);
    }
    newDiv.innerHTML += '<br/><font color="white">Moyenne TM : </font><font color="white">' + tmMoyenStr + ' <img src="images/eau.png" alt="terrain" style="vertical-align:center;" height="15"> </font>';
    newDiv.innerHTML += '<hr color="blue">';

    //newDiv.innerHTML += '<br/>' + '<center><span style="border:1.5px solid white; background:#06C;"><font color="white">Rôle dans la chaine</font></span></center>';

    //newDiv.innerHTML += '<br/>' + '<center><span style="border:1.5px solid white; background:#06C"><font color="white">Multiflood</font></span></center>';



    newDiv.innerHTML += '<br/><center><div class="divmf" style=""><button id="multifloodChaine", class="envoi_mf ui-button ui-corner-all ui-widget">Envoyer MultiFlood</button><br><br></div></center>';



    //activer le bouton
    document.getElementById ("multifloodChaine").addEventListener(
        "click", multiflood_Chaine, false
    );
}
//----------------------------------------------------------------------------------------------------------
else{
	newDiv.innerHTML = '<center><span style=" border:1.5px solid white; background:#06C;"><font color="white">AbyssusHelper  v' + version + '</font></span></center>';

}

    //newDiv.innerHTML += '<a href="https://s1.abyssus.games/jeu.php?page=alliance&tag=apo">Lien vers apo</a>';
    //horloge
    if(getCookie("AbyssusHelper_horloge") == "true") {
        var horloge_active = document.createElement("TD");
        horloge_active.append(document.createTextNode("Horloge : active"));
        var horloge_valeur = document.createElement("TD");
        var d = new Date();
        var h = d.getHours();
        if(h<10) {
            h = "0"+h;
        }
        var minutes = d.getMinutes();
        if(minutes<10) {
            minutes = "0"+minutes;
        }
        var secondes = d.getSeconds();
        if(secondes<10) {
            secondes = "0"+secondes;
        }
        horloge_valeur.innerHTML = '<img src="images/chrono.png" height="22"> '+h+':'+minutes+':'+secondes;
        setInterval(function(){
        var d = new Date();
        var h = d.getHours();
        if(h<10) {
            h = "0"+h;
        }
        var minutes = d.getMinutes();
        if(minutes<10) {
            minutes = "0"+minutes;
        }
        var secondes = d.getSeconds();
        if(secondes<10) {
            secondes = "0"+secondes;
        }
        horloge_valeur.innerHTML = '<img src="images/chrono.png" height="22"> '+h+':'+minutes+':'+secondes;
        }, 1000);

        if (getCookie("AbyssusHelper_restyle") == "") {
            var row0 = document.getElementById("ressource").getElementsByTagName("tr")[0];
            row0.insertBefore(horloge_active, row0.childNodes[0]);
            var row1 = document.getElementById("ressource").getElementsByTagName("tr")[1];
            row1.insertBefore(horloge_valeur, row1.childNodes[0]);
        } else {
            row0 = document.getElementById("ressource");
            row0.insertBefore(horloge_valeur, row0.childNodes[0]);
        }

    }
}

setTimeout(test, delay);

