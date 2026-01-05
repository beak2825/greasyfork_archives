// ==UserScript==
// @name       Inventaire tools
// @namespace  http://userscripts.org/scripts/show/138760
// @version    4 
// @description  Recupere les informations sur la page inventaire d'ogame et affiche le temps de reduction possible ainsi que la production supplémentaire acquise par les boosters
// @include    http*://*.ogame.gameforge.com/game/index.php?page=shop*
// @include    http*://*.ogame.gameforge.com/game/index.php?page=resourceSettings*
// @copyright  19 juillet 2012, nitneuc -- Libre d'être modifié ou reproduit, tant que cette ligne @copyright reste identique
// @downloadURL https://update.greasyfork.org/scripts/19919/Inventaire%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/19919/Inventaire%20tools.meta.js
// ==/UserScript==111

/*
// ****** Informations ******
Inventaire tools
----------------

Installation:
-------------
http://userscripts.org/scripts/show/138760
compatible chrome et firefox


Variables persistantes stockées:
--------------------------------
*booléen= texte.script + "_" +  pseudoJeu + "_" + universJeu + "_" + langue + "_premiereExecution"
*array= texte.script + "_" + pseudoJeu + "_" + universJeu + "_" + langue + "_proprietesPlanetes_production"


ChangeLog:
----------

v1.0: 19 juillet 2012
*première version stable

v1.1:
*Correction bug affichage
*Correction: le tableau ne s'affichait pas si on passait de la boutique à l'inventaire

v1.2:
*Simplification du code
*Amélioration de l'affichage

v2.0:
*intégration du changelog dans le script
*nom du script = Inventaire tools
*séparation de la fonction afficherSurPage() et constructionElementHTML()
*ajout du tableau de production hebdomadaire des boosters
*tableau des productions sur planète se MAJ si changement quantité production/déménagement/renommage

v2.1: 25 juillet 2012
*les 2 tableaux sont mis-en-page et réunis en bas
*nouvel emplacement pour les variables persistantes
*simplification du code

v2.1.1: 26 juillet 2012
*compatible Firefox

v2.1.2: 27 juillet 2012
*correction: initialisation programme

v2.1.3: 27 juillet 2012
*correction: les productions nulles étaient exclues
*correction: les lunes étaient incluses (production nulle)

v2.2: 28 juillet 2012
*ajout du 3ème tableau: cumul des gains booster (en nombre de ressources)
*simplification du code du 1er tableau (temps cumulés)
*nouvelle mise-en-page du 1er tableau (temps cumulés)

v2.3:
*utilisation d'un CSS
*travail de compatibilité avec autres script (uniformisation)
*modification de la structure de la variable permanente des propriétés

v2.4: 29 septembre 2012
*compatibilité v5
*modification de l'affichage des alertes

v3: 23 octobre 2012
*modification du stockage des variables
*transformation de fonctions en prototypes
*Refonte et grande simplification de l'affichage

v3.1: 24 octobre 2012
*Correction bug d'affichage

v3.2: 24 octobre 2012
*rétablissement de l'affichage après 'contentWrapper' en raisons de retours de bugs

v3.2.1: 24 octobre 2012
*réctification mineure

v3.2.2 : 25 octobre 2012
*correction de l'affichage

**********************************************************************************
** ** ** Suspension de la maintenance du script ** ** ** Pas de repreneur ** ** **
**********************************************************************************

v3.3 : 23 mai 2016.
*HTTP et HTTPS tolérés
*document.getElementById = $
*lecture de la production par planète sur la page 'resourceSettings' au lieu de la page 'resource'. Modifier la doc au passage
*affichage d'alerte sur la page 'resourceSettings' au lieu de la page 'resource'
*simplification de la fonction d'affichage d'alerte
*correction sytaxes css

v3.3.1 : 24 mai 2016
*@include modifié pour chrome : *.ogame.* -> *.ogame.gameforge.com

v3.4 : 30 mai 2016
*prototypes
*fonction get_buildLevel() et get_temp()
*inclue la page 'resources' et 'overview'
**Suppression de la ligne document.body.appendChild() qui faisait s(exécuter 2 fois le script si avec window.onload

v4 : 03 juin 2016
*réécriture partielle du code : simplifications de parties du code écrit à l'époque où je débutais le js. Ajout de fonctions, transformations de fonctions en prototypes, simplification des syntaxes, concaténations,  simplification des noms de variables, ...
*les tableaux affichés dans l'onglet 'Inventaire' s'effacent bien en retournant sur l'onglet 'Boutique'
*modification du caractère "séparateur de milliers"
*les alertes positives s'affichent en vert
*page inventaire : alerte si les productions de toutes les planètes ne sont pas renseignées
*la remise à zéro des productions se fait désormais par un bouton, plus besoin de décommenter la ligne
*désactivation du script sur le pages 'resources' et 'overview'
*border-radius sur les alertes
*les planètes s'affichent dans le même ordre que dans ogame

*/

// var strFunc = (window.onload = function(){     // Fait s'exécuter 2 fois le script
var strFunc = (function(){    

    // ****** Prototypes ******
    Storage.prototype.setObj = function(key, obj) {
		return this.setItem(key, JSON.stringify(obj));
    };
    
	Storage.prototype.getObj = function(key) {
		return JSON.parse(this.getItem(key));
	};
    
    Number.prototype.ajoutSeparateurMilliers = function(car) {
	// v1: fonction ; v2: prototype ; v2.1: prise en charge des nombres négatifs ; v2.2: prise en charge des nombre décimaux
        var dec = "";
        if ( this < 0 ) var neg = true;
        if ( this != Math.floor(this) ) {
            dec = ((this-Math.floor(this))+"").substr(1, (this+"").length-(Math.floor(this)+"").length);
            var str = Math.floor(this)+"";
        } else {
            var str = this+"";
        }
        if (neg) str = str.substring(1);
        var str_decoupe = new Array();
        for (var tmp=0; tmp<Math.ceil(str.length/3) ; tmp++) str_decoupe[tmp] = str.substring(str.length-3*tmp-3,str.length-3*tmp); // on remplit un array() de groupes de 3 chiffres  
        var str_2 = str_decoupe[str_decoupe.length-1]; // on cree une string composée des groupes de 3 chiffres + du signe
        for (var tmp = str_decoupe.length-2; tmp>=0; tmp--) str_2 = str_2 + car + str_decoupe[tmp];
        if (neg) str_2 = "-"+str_2;
        return str_2+dec;
    };
	
	Number.prototype.divEuclidienne = function(diviseur) {
        return new Array(Math.floor(this/diviseur) , this-Math.floor(this/diviseur)*diviseur);
	};
    
    Array.prototype.niemeValeurDifferenteDe = function(n, val) {
        var tmp_2=0;
        for (var tmp=0; tmp<this.length; tmp++) {
            if ( this[tmp] != val ) tmp_2++;
            if ( tmp_2 == n ) return tmp;
        }
        return -1;       
    };
	
	Array.prototype.max = function() {
		return Math.max.apply(null, this);
	};
	
	Array.prototype.nbOccurences = function(val) { // Compte le nombre d'occurences de val
		var incr = 0;
		for (var i=0; i<this.length; i++) if ( this[i] == val ) incr++;
		return incr;
	};
	
	Array.prototype.nbOccurencesDifferentDe = function(val) { // Compte le nombre d'occurences de toute valeur sauf val.
	// *** *** Dépendance : Array.prototype.nbOccurences(val)
		return this.length - this.nbOccurences(val);
	};
	
	
	// !!!!!!!!!!!!!!!!!!!!!!!!!
	// !!! PROTOTYPES LOCAUX !!!
	// !!!!!!!!!!!!!!!!!!!!!!!!!

	// !! J'utilise ici des prototypes, n'ayant pas réussi à définir une méthode propre aux objets Array sans passer par un prototype. Cependant, et contrairement aux autres prototypes, ceux-cis sont spécifiques à ce script et n'ont pas vocation à être réutilisable !!
	Array.prototype.testPlaneteExiste = function(el) {
		for ( var i=0 ; i<this.length ; i++ ) if ( this[i][0][0] == el ) return i;
		return -1;
	};
	
	Array.prototype.max_prod = function() { // Renvoie un tableau des 3 maximums de ressources pour toutes les planètes (this)
		var tabl_max = new Array();
		for (var ress=0; ress<=2; ress++) {
			var tabl_temp = new Array();
			for (var i=0; i<this.length; i++) tabl_temp[i] = this[i][1][ress];
			tabl_max[ress] = tabl_temp.max();
		}
        return tabl_max;
	};
	
	Array.prototype.reorgPlanete = function() { // Réorganise le tableau enregistré des planètes, afin de placer les planètes dans le même ordre que le volet droite d'ogame. Cette réorganisation est à exécuter avant chaque affichage (page 'shop'), et son résultat n'a donc pas à être sauvegardé.
		var liste = $('planetList').getElementsByClassName('smallplanet');
		var tabl_temp = new Array(); // La table dans laquelle sera transférée this, éléments positionnés pour l'affichage
		for (var i=0; i<liste.length; i++) for (var j=0; j<this.length; j++) if ( this[j][0][1] == liste[i].getElementsByClassName('planet-koords')[0].innerHTML.supprNonNumEtDeuxPoints() ) tabl_temp.push(this[j]); // Parcours les planètes dans le volet de droite et réécrit la table this en les repositionnant, dans tabl_temp
		return tabl_temp;
	};
	
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !!! FIN PROTOTYPES LOCAUX !!!
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	String.prototype.supprSpaces = function() {
		// Supprime le ou les espaces se trouvant en fin de chaîne
		return this.replace(/\s/g,'');
	};

	String.prototype.cutLongString = function(lmax) {
		// Coupe la chaîne en remplaçant les caractères de la position lmmax jusqu'à la fin de la chaîne par '...'
		return ( this.length <= lmax ) ? this : this.substr(0,lmax)+"...";
	};
	
	String.prototype.supprNonNum = function() { // Supprime tous les caractères non numériques d'une chaîne
		return this.replace(/[^0-9-]/g,'');
	};
	
	String.prototype.supprNonNumEtDeuxPoints = function() { // Supprime tous les caractères non numériques d'une chaîne
		return this.replace(/[^0-9-:]/g,'');
	};
	
	Element.prototype.remove_HTML = function() {
		this.parentNode.removeChild(this);
	};


    // ****** fonctions 'hard' ******
    
	function $(id) {	// Abrégé de document.getElementById(id);
		return document.getElementById(id);
	}

    function minutes2hhmm(minutes) {
        var div = minutes.divEuclidienne(60);
        if ( div[1] == 0 ) div[1] = '';
        return div;
    }
	
	function accord_pluriel(nb, str_sin, str_plu) { // Selon le nombre, renvoie la chaîne singulier ou pluriel (typiquement avec un 's' final)
		return ( nb > 1 ) ? str_plu : str_sin;
	}

    function positionPlanete2nombre(position) { // Convertit la position de planète en nombre (pour le stockage)
        return 1000000*parseInt(position.split(":")[0])+1000*parseInt(position.split(":")[1])+parseInt(position.split(":")[2]);
    }

    
    // ****** fonctions affichage ******
    
    function creer_CSS() { // ajoute des classes CSS
		document.getElementsByTagName("head")[0].innerHTML = '<style type="text/css">'
            +'.table1 { width:'+ config.table1_width +'px; padding-top: 20px; padding-bottom: 20px;} '
            +'.table { width:100%; border-width: 3px; border-style: double; border-color: #666666; text-align: center; font-size:' +config.valeur_fontSize +'px;} '
            +'.header2 { background-color:'+ config.header2_bgColor+ '; color:'+ config.header2_fontColor +'; font-size:'+ config.header2_fontSize +'px; font-weight:'+ config.header2_fontBold +'; text-align:'+ config.header2_textAlign +';} '
            +'.header3 { background-color:'+ config.header3_bgColor+ '; color:'+ config.header3_fontColor +'; font-size:'+ config.header3_fontSize +'px; font-weight:'+ config.header3_fontBold +'; text-align:'+ config.header3_textAlign +';} '
            +'.headerLigne { background-color:'+ config.headerLigne_bgColor+ '; color:'+ config.headerLigne_fontColor +'; font-size:'+ config.headerLigne_fontSize +'px; font-weight:'+ config.headerLigne_fontBold +';} '
            +'.valeur { background-color:'+ config.valeur_bgColor+ '; color:'+ config.valeur_fontColor +'; font-size:'+ config.valeur_fontSize +'px; font-weight:'+ config.valeur_fontBold +'; text-align:'+ config.valeur_textAlign +';} '
            +'.valeursMax { background-color:'+ config.valeursMax_bgColor+ '; color:'+ config.valeursMax_fontColor +'; font-size:'+ config.valeursMax_fontSize +'px; font-weight:'+ config.valeursMax_fontBold +';} '
            +'.alerte_red { background-color:'+ config.alerte_red_bgColor+ '; color:'+ config.alerte_fontColor +'; font-size:'+ config.alerte_fontSize +'px; font-weight:'+ config.alerte_fontBold +'; text-align:'+ config.alerte_textAlign +'; border-radius: 4px;} '
            +'.alerte_green { background-color:'+ config.alerte_green_bgColor+ '; color:'+ config.alerte_fontColor +'; font-size:'+ config.alerte_fontSize +'px; font-weight:'+ config.alerte_fontBold +'; text-align:'+ config.alerte_textAlign +'; border-radius: 4px;} '
            +'</style>' + document.getElementsByTagName("head")[0].innerHTML;
    }
    
    
    function affichageAlerte(texteAAfficher, type) { // affiche alerte. Type prend comme valeur "green" ou "red"
        $("inhalt").innerHTML = '<div id="InventaireToolsAlert" class="alerte_'+type+'">' +texteAAfficher +'</div>'+$("inhalt").innerHTML;
    }
    
	function alerte_planetesNonVisitees(nb) { // Agfiche une alerte disant qu'il reste nb planètes sans production enregistrée
		affichageAlerte('Attention : La production de '+ nb +' '+ accord_pluriel(nb, 'planète', 'planètes')+' reste inconnue !', 'red');
	}
    
    function afficherTable(tout, affichageTempsCumules, affichageGainBooster, affichageProdBooster) {
        var ajoutHTML_2 = ""; // Déclaration
        var ajoutHTML_1 = '<div align="center" id="inventairetoolstable"><div id="eraseDataInventaireTools" style="margin-top: 20px;">[ Effacer données Inventaire tools ]</div><table class="table1"><tr><td style="padding-bottom: 12px;" align="center"><table style="width:250px; align: center;" class="table">'
            +'<tr><td colspan="3" style="padding-top: 5px, padding-bottom: 5px;" class="header2">CUMULS DES GAINS</td></tr><tr>';
        for (var i=0; i<=2 ; i++) ajoutHTML_1 += '<td class="header3" width="33%">'+affichageTempsCumules[i].split(":")[0] +'</td>';
        ajoutHTML_1 += '</tr><tr>';
        for (var i=0; i<=2 ; i++) ajoutHTML_1 += '<td class="valeur">'+affichageTempsCumules[i].split(":")[1] +'</td>';
        ajoutHTML_1 += '</tr>';
        if (tout) { // si tous les tableaux doivent être affichés
            ajoutHTML_1 += '<tr>';
            for (var i=0; i<=2 ; i++) ajoutHTML_1 += '<td class="header3" width="33%">'+ressource[0][i] +'</td>';
            ajoutHTML_1 += '</tr><tr>';
            for (var i=0; i<=2 ; i++) ajoutHTML_1 += '<td class="valeur">'+affichageGainBooster[i].ajoutSeparateurMilliers("'")+'</td>';
            ajoutHTML_1 += '</tr>';
        }
        ajoutHTML_1 += '</table></td></tr>';
		
		if ( affichageProdBooster == undefined ) { // Si aucune production sauvegardée pour l'instant
			alerte_planetesNonVisitees(get_nbCol().split("/")[0]);
		} else { // Si des productions sont sauvegardées, mais pas toutes
			var nbPlaneteInconnues = get_nbCol().split("/")[0] - affichageProdBooster.length;
			if ( nbPlaneteInconnues > 0 ) alerte_planetesNonVisitees(nbPlaneteInconnues);
		}
		if (tout) {
			var nombre_type_booster = nombre_booster.nbOccurencesDifferentDe(0);; // définit le nombre de colonnes à fabriquer dans le grand tableau

            ajoutHTML_2 = '<tr><td style="padding-bottom: 30px;" align="center"><table class="valeur table" width="'+ (142+nombre_type_booster*(config.prodBooster_largeurColonne+2)) +'px"><tr><td colspan="'+(nombre_type_booster+2)+'" style="padding-top: 5px; padding-bottom: 5px;" class="header2">GAIN SUR 1 SEMAINE</td></tr><tr>';
            for (var i=0; i<=nombre_type_booster+1; i++) {
                ajoutHTML_2 += '<td class="header3" width=';
                if ( i==0 ) ajoutHTML_2 += '"91px" align="left">'+ affichageProdBooster.length + "/" + get_nbCol().split("/")[0] + ' planètes</td>';
                if ( i==1 ) ajoutHTML_2 += '"45px">position</td>';
                if ( i>=2 ) {
                    var j = nombre_booster.niemeValeurDifferenteDe(i-1,0);
                    ajoutHTML_2 += '"'+ config.prodBooster_largeurColonne +'px">'+ (j-3*Math.ceil((j+1)/3)+4) + '0% '+ ressource[1][Math.floor(j/3)] +'/' + nombre_booster[j] +'</td>';
                }
            }
            ajoutHTML_2 += '</tr>';
			
			var maxProd = affichageProdBooster.max_prod();  // Maximum de production entre les planètes
			
            for (var i=0; i<affichageProdBooster.length; i++) { // i = les lignes du tableau
                ajoutHTML_2 += '<tr><td class="headerLigne" align="left">' + '<a href="http://uni'+ universJeu +'.ogame.'+ langue +'/game/index.php?page=shop&cp='+ affichageProdBooster[i][0][0] + '#page=inventory" style="color:'+ config.headerLigne_fontColor +'; text-decoration:none;">' + affichageProdBooster[i][0][2].cutLongString(14) + '</a></td><td class="headerLigne">'+ affichageProdBooster[i][0][1] +'</td>';;
                for (var k=0; k<=2; k++) { // k= chaque ressource
                    for (var l=1 ; l<=3 ; l++) {                        
                        if ( nombre_booster[3*k+l-1] != 0 ) { // le contenu du td est nul si le booster n'est pas dans l'inventaire
                            ajoutHTML_2 += '<td';
                            if ( affichageProdBooster[i][1][k] == maxProd[k] ) ajoutHTML_2 += ' class="valeursMax"';
                            ajoutHTML_2 += '>'+ Math.ceil((affichageProdBooster[i][1][k])*l*.1*168).ajoutSeparateurMilliers("'") +'</td>';  
                        }
                    }
                }
                ajoutHTML_2 += '</tr>';
            }
            ajoutHTML_2 += '</table></td></tr>';
        }
        document.getElementsByClassName("footer")[0].innerHTML += ajoutHTML_1+ajoutHTML_2;
		
		$('eraseDataInventaireTools').addEventListener("click", function(event) { // Bouton de RAZ data
			if ( confirm('Attention, Les valeurs de production de toutes les planètes seront remises à zéro.') ) {
				localStorage.removeItem(texte.script + "_" + pseudoJeu + "_" + universJeu + "_" + langue + "_premiereExecution");
				window.location.reload();
			}
		}, true);
    }    
    
    // ****** Fonctions 'get' ******	
	
	function get_infoInventaire() {
        var inventaire = $("js_inventorySlider").getElementsByClassName("item_img_box"); // On récupère un élément HTML de la page
        var liste = new Array();
        
        for (var i=0 ; i < inventaire.length ; i++) { // fais le tour des objets de la page
            var inventaire2 = inventaire[i].getElementsByTagName("a");
            var nbObjet = inventaire2[0].getElementsByClassName("level amount")[0].innerHTML; // récupère le nombre de l'objet
            var attributObjet = inventaire2[0].getAttribute("title").split("|")[0]; // récupère le titre de l'objet
            liste[i] = (attributObjet.split(" en ")[0] + ":" + attributObjet.split(" en ")[1] + ":" + nbObjet).toLowerCase();
        }
        return liste;
    }
    
    
    function get_nbCol() {
        return $("countColonies").getElementsByTagName("span")[0].innerHTML;
    }
    
    
    function get_infoPlaneteCourante() {
        var ensembleBaliseMeta = document.getElementsByTagName("meta"); // récupère toutes les balises meta du <head>
        var info = new Array();
        for (var i=0 ; i<ensembleBaliseMeta.length ; i++) { //trouve certaines balises dans la liste
			var balise_name = ensembleBaliseMeta[i].getAttribute("name");
			var balise_content = ensembleBaliseMeta[i].getAttribute("content");
            if ( balise_name == "ogame-planet-id" ) info[0] = balise_content;
            if ( balise_name == "ogame-planet-coordinates" ) info[1] = balise_content;
            if ( balise_name == "ogame-planet-name" ) info[2] = balise_content;
            if ( balise_name == "ogame-planet-type" ) info[3] = balise_content;
        }
        return info;
    }
    
    
    function get_prodCourante() { // renvoie la production M,C et D, sous forme d'Array(). Attention les objets s'appliquent sur les mines et pas sur la prod totale de la planète (hors plasma, hors prod initiale, hors objets, ...)
        var production = new Array();
		lignesTabl = $('inhalt').getElementsByClassName('list listOfResourceSettingsPerPlanet')[0].getElementsByTagName('tr');
		for (var i=2; i<lignesTabl.length; i++) { // Les 2 premières lignes ne sont concernent en aucun cas les mines (en-têtes)
			var txt = lignesTabl[i].getElementsByTagName('td')[0].innerHTML;
			if ( txt.indexOf('Mine de métal') != -1 ) production[0] = lignesTabl[i].getElementsByTagName('td')[2].getElementsByTagName('span')[0].innerHTML.supprNonNum()
			if ( txt.indexOf('Mine de cristal') != -1 ) production[1] = lignesTabl[i].getElementsByTagName('td')[3].getElementsByTagName('span')[0].innerHTML.supprNonNum();
			if ( txt.indexOf('Synthétiseur de deutérium') != -1 ) production[2] = lignesTabl[i].getElementsByTagName('td')[4].getElementsByTagName('span')[0].innerHTML.supprNonNum();
		}
		return production;
    }
    
    
    // ****** Autres fonctions ******        
    
    function affichageInventaire() {
        if ( $("js_inventorySlider") ) {
            if ( ! pageCouranteEstInventaire ) {
				pageCouranteEstInventaire = true;
                
                // Préparation du tableau tempsCumulés
				var duree_obj = new Array(0,0,0); // remise à zéro des compteurs de duree/nombre pour chaque type d'items (kraken, detroid, newtron)
                var listeItem = get_infoInventaire();
                
                for (var i=0 ; i<listeItem.length ; i++) { // Modifie les compteurs de durée des 3 types d'item
                    if ( listeItem[i].split(":")[0] == "kraken") duree_obj[0] += niveauItem2temps(listeItem[i].split(":")[1], listeItem[i].split(":")[2]);
                    if ( listeItem[i].split(":")[0] == "detroid") duree_obj[1] += niveauItem2temps(listeItem[i].split(":")[1], listeItem[i].split(":")[2]);
                    if ( listeItem[i].split(":")[0] == "newtron") duree_obj[2] += niveauItem2temps(listeItem[i].split(":")[1], listeItem[i].split(":")[2]);
                    
					if (( listeItem[i].split(":")[0] == "booster de métal" ) || ( listeItem[i].split(":")[0] == "booster de cristal" ) || ( listeItem[i].split(":")[0] == "booster de deutérium" )) {
                        // Calcule l'emplacement de la case de l'array() à incrémenter                    
                        if ( listeItem[i].split(":")[0] == "booster de métal" ) var a = 1;
                        if ( listeItem[i].split(":")[0] == "booster de cristal" ) var a = 2;
                        if ( listeItem[i].split(":")[0] == "booster de deutérium" ) var a = 3;
                        if ( listeItem[i].split(":")[1] == "bronze" ) var b = 1;
                        if ( listeItem[i].split(":")[1] == "argent" ) var b = 2;
                        if ( listeItem[i].split(":")[1] == "or" ) var b = 3;
                        nombre_booster[3*a+b-4] = listeItem[i].split(":")[2];
                    }
                }                
                var affichage = new Array(// les valeurs à afficher à l'écran sont entrées dans un array()
                    "Bâtiments : "+ minutes2hhmm(duree_obj[0])[0]+ "h"+ minutes2hhmm(duree_obj[0])[1],
                    "Chantier spatial : "+ minutes2hhmm(duree_obj[1])[0]+ "h"+ minutes2hhmm(duree_obj[1])[1],
                    "Recherche : "+ minutes2hhmm(duree_obj[2])[0]+ "h"+ minutes2hhmm(duree_obj[2])[1]
                ); 
                if (( nombre_booster.nbOccurencesDifferentDe(0) != 0 ) && ( typeof proprietesPlanetes_production[0] != 'undefined' )) { // si on affiche les 3 tables
                    afficherTable(true, affichage, gainTotalBooster(proprietesPlanetes_production), proprietesPlanetes_production.reorgPlanete());
                } else { // si on affiche qu'une table 
                    afficherTable(false, affichage);
                }
            }
        }
        else { // si la page courante n'est pas l'inventaire, la div contenant les tableaux affichés précédemment doit être efffacée
			pageCouranteEstInventaire = false;
			if ( $('InventaireToolsAlert') != undefined ) $('InventaireToolsAlert').remove_HTML();
			$('inventairetoolstable').remove_HTML();
        }
    }
    
    
    function niveauItem2temps(niveau, nombre) { // renvoie la durée associée à chaque item en fonction de son nombre
        if ( niveau == "bronze" ) return nombre*config.duree_bronze;
        if ( niveau == "argent" ) return nombre*config.duree_argent;
        if ( niveau == "or" ) return nombre*config.duree_or;
    }
    
    
    function ajouterPlanete(info, proprietesAAjouter, tableProprietes, nomVariablePersistante) { // ajout d'une planète (id) +ses proprietes (array de 3 cases) à la liste
        var pos = 0;
        if ( tableProprietes.length != 0 ) for (var pos=0; pos<tableProprietes.length; pos++) if ( positionPlanete2nombre(info[1]) < positionPlanete2nombre(tableProprietes[pos][0][1]) ) break;
		tableProprietes.splice(pos, 0, new Array(info,proprietesAAjouter));
        localStorage.setObj(texte.script+ "_"+ pseudoJeu+ "_"+ universJeu+ "_"+ langue+ "_"+ nomVariablePersistante,tableProprietes);
        affichageAlerte(texte.alerte_planeteAjoutee, 'green'); // affiche alerte de confirmation
    }
    
    
    function maxProdEmpire(tableProprietes) { // trouve les meilleures productions de l'empire, pour trouver les meilleures planètes où appliquer les boosters
        var maxProd_temp = new Array(0,0,0);
        for (var i=0 ; i<tableProprietes.length ; i++) for (var j=0 ; j<=2 ; j++) if (parseInt(tableProprietes[i][1][j]) > maxProd_temp[j]) maxProd_temp[j] = parseInt(tableProprietes[i][1][j]);
        return maxProd_temp;
    }
    
    
    function gainTotalBooster(tableProprietes) {
        var maxProd_temp = maxProdEmpire(tableProprietes);
        var gain_parRessource = new Array(0,0,0);
        for (var i=0 ; i<=2 ; i++) for (var j=3*i ; j<=3*i+2 ; j++) gain_parRessource[i] = gain_parRessource[i] + nombre_booster[j]*Math.ceil(maxProd_temp[i]*168*(j+1-3*Math.floor(j/3))/10);
        return gain_parRessource;
    }
    
    
    function initialiserDonneesUtilisateur() { // initialise les données utilisateur du script
        var proprietes = new Array();  
        localStorage.setObj(texte.script + "_" + pseudoJeu + "_" + universJeu + "_" + langue + "_proprietesPlanetes_production",proprietes);
        localStorage.setObj(texte.script + "_" + pseudoJeu + "_" + universJeu + "_" + langue + "_premiereExecution",false);
        return proprietes;
    }
    
    
    // ****** Initialisations valeurs ******
    
    const langue = location.href.split("/")[2].split(".")[2];
    const universJeu = location.href.split("/")[2].split(".")[0].replace("uni","");
    const pseudoJeu = document.getElementsByName("ogame-player-name")[0].getAttribute("content");
    var pageCouranteEstInventaire = false;
    var nombre_booster = new Array(0,0,0,0,0,0,0,0,0); // array() contenant le nombre de chaque booster
    
    
    // ****** Paramètres utilisateur ******
    
    var config = {
        duree_bronze:30,
        duree_argent:120,
        duree_or:360,
        
        header2_fontColor:"#FFFFFF",
        header2_fontSize:"9",
        header2_fontBold:"bold",
        header2_bgColor:"#00002D",
        header2_textAlign:"center",
        
        header3_fontColor:"#FFFF00",
        header3_fontSize:"9",
        header3_fontBold:"bold",
        header3_bgColor:"#00002D",
        header3_textAlign:"center",
        
        headerLigne_fontColor:"#FF8000",
        headerLigne_fontSize:"9",
        headerLigne_fontBold:"bold",
        headerLigne_bgColor:"#000000",
        
        valeur_fontColor:"#FFFFFF",
        valeur_fontSize:"9",
        valeur_fontBold:"normal",
        valeur_bgColor:"#000000",
        valeur_textAlign:"center",
        
        
        valeursMax_fontColor:"#FFFFFF",
        valeursMax_fontSize:"9",
        valeursMax_fontBold:"normal",
        valeursMax_bgColor:"#FF0000",
        
        prodBooster_largeurColonne:70,
        
        alerte_fontColor:"#FFFFFF",
        alerte_fontSize:"9",
        alerte_fontBold:"bold",
        alerte_red_bgColor:"#FF0000",
        alerte_green_bgColor:"#009900",
        alerte_textAlign:"center",        
    };
    
    var texte = {
        script:"Inventaire tools",
        alerte_planeteAjoutee:"Inventaire tools: Planète ajoutée",
        alerte_proprietesModifiees:"Inventaire tools: Propriétés modifiees",
    };
    
    var ressource = new Array(
        new Array("Métal","Cristal","Deutérium"),
        new Array("mét","cri","deut")
    );
    
    // ****** script ******
    
    creer_CSS();
    
    if ( localStorage.getObj(texte.script + "_" + pseudoJeu + "_" + universJeu + "_" + langue + "_premiereExecution") != false )  { // teste si l'utilisateur est à sa première exécution ou non
        var proprietesPlanetes_production = initialiserDonneesUtilisateur();
    } else {
        var proprietesPlanetes_production = localStorage.getObj(texte.script + "_" + pseudoJeu + "_" + universJeu + "_" + langue + "_proprietesPlanetes_production");
    }
    
    var url = location.href.split("page=")[1].split("&")[0].split("#")[0];
	
    if ( url == "resourceSettings" ) { // si la page courante est la page 'ressourcesSettings'
        // Récuperation des infos sur la planète courante 
        var infoPlanete = get_infoPlaneteCourante();
        var productionPlaneteCourante = get_prodCourante();
		
        if ( infoPlanete[3] == "planet" ) { // teste si la planète courante n'est pas une lune
            var n_planete = proprietesPlanetes_production.testPlaneteExiste(infoPlanete[0]); // teste si la planète courante a déjà été enregistrée			
            if ( n_planete == -1 ) { // si la planète n'existe pas dans la liste
				ajouterPlanete(infoPlanete, productionPlaneteCourante, proprietesPlanetes_production, "proprietesPlanetes_production");
            } else { // si la planète est déjà dans la liste
                if (( proprietesPlanetes_production[n_planete][0][1] != infoPlanete[1] )
                    || ( proprietesPlanetes_production[n_planete][0][2] != infoPlanete[2] )
                    || ( proprietesPlanetes_production[n_planete][1][0] != productionPlaneteCourante[0] )
                    || ( proprietesPlanetes_production[n_planete][1][1] != productionPlaneteCourante[1] )
                    || ( proprietesPlanetes_production[n_planete][1][2] != productionPlaneteCourante[2] )) { // on test si les valeurs des productions+nom+emplacement ont changées
                    proprietesPlanetes_production[n_planete] = new Array(infoPlanete,productionPlaneteCourante);
                    localStorage.setObj(texte.script + "_" + pseudoJeu + "_" + universJeu + "_" + langue + "_proprietesPlanetes_production",proprietesPlanetes_production);
                    affichageAlerte(texte.alerte_proprietesodifiees, 'green');
                }
            }  
        }
    }
    
    if ( url == "shop" ) setInterval(affichageInventaire,500);
	
}).toString();

var script = document.createElement("script");
script.setAttribute("type","text/javascript");
script.text = "(" + strFunc + ")();";
document.body.appendChild(script);