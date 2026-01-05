// ==UserScript==
// @name        P.D.O
// @namespace   Dystiopia Online
// @version     0.6.3_1.0.4a
// @author      Chewbaka, modifié par Ayowel et Exalea
// @helped      BirdJesus
// @include     http://dystopiaonline.fr/*
// @grant none
// @require     https://greasyfork.org/scripts/4098-setting-entry-user-js/code/setting-entryuserjs.js?version=13110
// @require     https://greasyfork.org/scripts/4099-settings-store-user-js/code/settings-storeuserjs.js?version=13111
// @require     https://greasyfork.org/scripts/4096-route-user-js/code/routeuserjs.js?version=13109
// @require     https://greasyfork.org/scripts/4097-router-user-js/code/routeruserjs.js?version=13108
// @description userscript conçu pour être utilisé sur le site http://dystopiaonline.fr , ne le modifiez que si vous savez ce que vous faites.
// @run-at	document-end
// @downloadURL https://update.greasyfork.org/scripts/4025/PDO.user.js
// @updateURL https://update.greasyfork.org/scripts/4025/PDO.meta.js
// ==/UserScript==

/**
 *  Paramètrage initial
 *
 *  @author Exalea
 */
{
    /**
     *  Ajout au SettingsStore des paramètres nécessaires
     *
     *  @author Exalea
     */
    {
//        SettingsStore.add("alicia", "isAliciaEnabled", false);
        SettingsStore.add("greenBar", "isProgressBarGreen", true);
        SettingsStore.add("innerMenu", "isInnerMenuDisabled", false);
        SettingsStore.add("mess00", "messageNumber00", 0);
        SettingsStore.add("mess01", "messageNumber01", 0);
        SettingsStore.add("mess02", "messageNumber02", 0);
        SettingsStore.add("mess03", "messageNumber03", 0);
        SettingsStore.add("mess04", "messageNumber04", 0);
        SettingsStore.add("mess05", "messageNumber05", 0);
        SettingsStore.add("mess15", "messageNumber15", 0);
        SettingsStore.add("mess50", "messageNumber50", 0);
        SettingsStore.add("mess50", "messageNumber99", 0);
    }

    /**
     *  Initialisation et export du SettingsStore afin de le rendre accessible depuis le code HTML via la variable document.settings
     *
     *  ! A ne pas modifier, l'ajout de paramètres se fait via l'appel des méthodes add ou addEntry au sein du bloc ci-dessus !
     *
     *  @author Exalea
     */
    document.settings = SettingsStore.init().entries;
}
    
////////////////////////////// VARIABLE ///////////////////////////

/* Variables de base */
var leftMenu = document.createElement("div");			// Div Bouton
var newURL = window.location.search;			// URL page
var page = document.getElementById("page");			//page

//document.getElementById("mainBody").innerHTML = window.location.pathname.split("/")[1];

///////////////////////////// MODIFICATIONS SELON LA PAGE /////////////////////////////

/**
 *  Paramètres PDO
 */
Router.add("page=settings.*target=pdo", function() {
    var option = document.createElement("div"); // Div option script
    var homepage = document.getElementsByClassName("container"); // Récup containt page principale

    homepage[homepage.length - 1].parentNode.removeChild(homepage[homepage.length - 1]);
    option.className = 'container';
    option.innerHTML =
        '<div class = "content_area">' +
        '<h2 class="clearfix">' +
        '<div class="icon"></div>' +
        '<div>Options du Script</div>' +
        '</h2>' +
        '<div class="news_articles">' +
        '<br/>' +
        '<div class="news_article">' +
        '<div class="article_content">' +
        '<div class="title_block dark_hatch_container">' +
        '<table style="width:100%; left: 0px; margin-top: -5px;">' +
        '<tr>' +
        '<td class="transparent" style="box-shadow: 0px 0px 0px 0px">' +
        //code pour la création d'une catégorie
        '<div class="title_block dark_hatch_container">' +
        '<div class="content">BOUH</div>' +
        '<div class="bg">' +
        '<div class="left_chrome"></div>' +
        '<div class="top_right_chrome"></div>' +
        '<div class="bottom_right_chrome"></div>' +
        '</div>' +
        '</div>' +
        //code pour le contenu d'une catégorie
        '<div class="text_block">' +
        'Cette catégorie est destinée à recevoir la liste des options configurables qu\'aura le P.D.O., jetez un coup d\'oeil après chaque mise à jour pour voir si des éléments sont devenus configurables.<br><br>Ad Vitam Aeternam.' +
        '<br/><br/><br/><br/>' +
/*        '<label>Alicia, votre assistante personnelle </label><input style="display: inline;" type="checkbox" id="aliciaCheckbox" />' +
        '<br/><br/>' +
*/        '<label>Barres de progression vertes </label><input style="display: inline;" type="checkbox" id="greenBarCheckbox" />' +
        '<br/><br/>' +
        '<label>Désactiver le menu de gauche secondaire </label><input style="display: inline;" type="checkbox" id="innerMenuCheckbox" />' +
        '<br/><br/>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="rounded_box_css" style="padding: "><div class="bgcolor"></div></div>';
    document.getElementById("home_news_section").insertBefore(option, document.getElementById("home_news_section").firstChild);

/*    var aliciaCheckbox = document.getElementById("aliciaCheckbox");
    if (aliciaCheckbox != null) {
        aliciaCheckbox.onchange = function () {
            document.settings.alicia.setValue(aliciaCheckbox.checked)
        };
        aliciaCheckbox.checked = (document.settings.alicia.getValue() == "true");
    }*/
    var greenBarCheckbox = document.getElementById("greenBarCheckbox");
    if (greenBarCheckbox != null) {
        greenBarCheckbox.onchange = function () {
            document.settings.greenBar.setValue(greenBarCheckbox.checked)
        };
        greenBarCheckbox.checked = (document.settings.greenBar.getValue() == "true");
    }
    var innerMenuCheckbox = document.getElementById("innerMenuCheckbox");
    if (innerMenuCheckbox != null) {
        innerMenuCheckbox.onchange = function () {
            document.settings.innerMenu.setValue(innerMenuCheckbox.checked)
        };
        innerMenuCheckbox.checked = (document.settings.innerMenu.getValue() == "true");
    }
});

/**
 *  Salle de contrôle
 */
Router.add("page=overview|^$", function() {
/*    // Lien vers la pages des ressources de la planète
    var ressources = document.createElement("td");
    var ressourcesRef = document.getElementsByClassName("servertime");
    ressources.className = "transparent";
    ressources.innerHTML = '<a href="game.php?page=resources" style="text-transform: none; color: lime;">Ressources</a>';
    ressourcesRef[0].parentNode.insertBefore(ressources, ressourcesRef[0]);

    // Lien vers les données Colonies
    var colDon = document.createElement("div");
    colDon.className = "donnees_colonies";
    colDon.innerHTML = '<h3 style="text-align:center;"><a href="game.php?page=imperium" style="text-transform: none; color: lime;">Données Colonies</a></h3>';
    document.getElementById("fondoverview").insertBefore(colDon, document.getElementById("fondoverview").secondChild);
*/
});

/**
 *  Fiche Personnage
 */
/*
Router.add("page=fiche", function() {
    $("tableau519").load("game.php?page=statistics&who=2&type=1");
    if (status !== "error"){
    	document.getElementsByClassName("news_articles")[0].innerHTML = "";
    }
});*/

/**
 *  Liste d'amis
 */
Router.add("page=buddyList", function() {	//Amis

    // bouton message. Ne fonctionne pas actuellement (+ fait planter en cas de demande d'ami)
    var friendList = document.getElementById("fichepersoleft").childNodes[1].childNodes[1].childNodes;
    //var friendListRef = document.getElementById("fichepersoleft").childNodes[1].childNodes[1].childNodes[4].childNodes[0];
    
    var firstValue = 0;
    while (friendList[firstValue].childNodes[0].innerHTML != "Mes amis")
    {
        firstValue = firstValue + 2;
    }
    
    for (var i=firstValue; i < friendList.length; i++){
        var tableauTD = friendList[i].childNodes[9]; // Recup TD
        if (tableauTD !== undefined) {
            if (friendList[i].childNodes[1].childNodes[1] !== undefined)
            {
                var ID = friendList[i].childNodes[1].childNodes[1].getAttribute("onclick").split("(")[1].split(")")[0]; // Recup Id joueur
                if (ID !== undefined)
                {
                    var message = document.createElement('a');
                    message.setAttribute('onclick', 'return Dialog.PM(' + ID + ')');
                    message.setAttribute('href', '#');
                    message.innerHTML = '<img title="Nouveau Message" style="margin-left: 2px; margin-right: 1.33em;" src="styles/theme/6/img/m.gif">';
                    tableauTD.insertBefore(message, tableauTD.childNodes[0]);
                    tableauTD.style.width = "12%";
                }
            }
        }
    }/**/
    //document.getElementsByClassName("news_article")[0].innerHTML = friendListRef.innerHTML;
});

/**
 *  Batiments
 */
Router.add("page=buildings", function() {
    var content = document.getElementsByClassName("news_articles");
    var newContent = document.createElement("div");
    newContent.className = "news_articles";
    newContent.innerHTML = '<div class="title_block dark_hatch_container"><div class="content"><h3 style="line-height: 0.5em;"><table style="width: 100%; height: 28px; left: 0px; position: absolute;"><tbody><tr>' +
        '<td class="transparent" style="text-align : left; box-shadow: 0px 0px 0px 0px;">' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="game.php?page=buildings">Bâtiments</a>' +
        '</td><td class="transparent" style="text-align : left; box-shadow: 0px 0px 0px 0px;">' +
        '<a href="game.php?page=research">Centre de Recherches</a>' +
        '</td>' +
        '</tr></tbody></table></h3></div><div class="bg"><div class="left_chrome"></div></div></div>' +
        '<br>';
    content[0].parentNode.insertBefore(newContent, content[0]);

});

/**
 *  Recherches
 */
Router.add("page=research", function() {
    var content = document.getElementsByClassName("news_articles");
    var newContent = document.createElement("div");
    newContent.className = "news_articles";
    newContent.innerHTML = '<div class="title_block dark_hatch_container"><div class="content"><h3 style="line-height: 0.5em;"><table style="width: 100%; height: 28px; left: 0px; position: absolute;"><tbody><tr>'+
        '<td class="transparent" style="text-align : left; box-shadow: 0px 0px 0px 0px;">'+
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="game.php?page=buildings">Bâtiments</a>'+
        '</td><td class="transparent" style="text-align : left; box-shadow: 0px 0px 0px 0px;">'+
        '<a href="game.php?page=research">Centre de Recherches</a>'+
        '</td>'+
        '</tr></tbody></table></h3></div><div class="bg"><div class="left_chrome"></div></div></div>'+
        '<br>';
    content[0].parentNode.insertBefore(newContent, content[0]);/**/

    var research = document.getElementsByClassName("tablequeusearch");
    var researchName = document.createElement('div');
    if (research[0] !== undefined)
    {
        researchName.className = "Nom_de_la_recherche";
        var researchPlace = document.createElement('div');
        researchPlace.className = "Lieu_de_la_recherche";
        researchName.innerHTML = research[0].innerHTML.split("<h3>")[1];

        research[0].innerHTML = research[0].innerHTML.split("<br>")[0] + research[0].innerHTML.split("</h3>")[1];

        researchName.innerHTML = researchName.innerHTML.split("</td>")[0];
        researchPlace.innerHTML = 'Sur' + researchName.innerHTML.split("@")[1];
        researchName.innerHTML = '<h3>' + researchName.innerHTML.split("@")[0] + '</h3>';
        document.getElementById("progressbar").parentNode.insertBefore(researchName, document.getElementById("progressbar"));
        if (researchPlace.innerHTML !== 'Surundefined')
        {
            document.getElementById("progressbar").parentNode.insertBefore(researchPlace, document.getElementById("progressbar").parentNode.secondChild);
        }

        if (research[1] !== undefined)
        {
            var researchName2 = document.createElement('td');
            var researchPlace2 = document.createElement('div');

            researchName2.className = "transparent";
            researchPlace2.className = "Lieu_de_la_recherche";
            researchName2.innerHTML = research[1].innerHTML.split("<h3>")[1].split("</h3>")[0];
//            researchName2.type.width = '70%';

            research[1].innerHTML = research[1].innerHTML.split("<br>")[0] + '</td><td' + research[1].innerHTML.split("<td")[3];

            researchPlace2.innerHTML = 'Sur' + researchName2.innerHTML.split("@")[1];
            researchName2.innerHTML = '<div class="Nom_de_la_recherche"><h3>' + researchName2.innerHTML.split("@")[0] + '</h3></div>';

            research[1].childNodes[1].childNodes[0].insertBefore(researchName2, research[1].childNodes[1].childNodes[0].childNodes[2]);
            document.getElementsByClassName("Nom_de_la_recherche")[1].parentNode.setAttribute("style", "width: 70%; box-shadow: none;");

            if (researchPlace2.innerHTML !== 'Surundefined')
            {
                document.getElementsByClassName("Nom_de_la_recherche")[1].parentNode.insertBefore(researchPlace2, document.getElementsByClassName("Nom_de_la_recherche")[1].secondChild);
            }
        }
    }
});

/**
 *  Hangar
 */
Router.add("page=shipyard", function() {
    var content = document.getElementsByClassName("news_articles");
    var newContent = document.createElement("div");
    newContent.className = "news_articles";
    newContent.innerHTML = '<div class="title_block dark_hatch_container"><div class="content"><h3 style="line-height: 0.5em;"><table style="width: 100%; height: 28px; left: 0px; position: absolute;"><tbody><tr>' +
        '<td class="transparent" style="text-align : left; box-shadow: 0px 0px 0px 0px;">' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="game.php?page=shipyard&mode=fleet&shipyardpage=2">Vaisseaux</a>' +
        '</td><td class="transparent" style="text-align : left; box-shadow: 0px 0px 0px 0px;">' +
        '<a href="game.php?page=shipyard&mode=defense">Armement défensif</a>' +
        '</td><td class="transparent" style="text-align : left; box-shadow: 0px 0px 0px 0px;">' +
        '<a href="game.php?page=shipyard&mode=fleet&shipyardpage=1">Unités</a>' +
        '</td>' +
        '</tr></tbody></table></h3></div><div class="bg"><div class="left_chrome"></div></div></div>' +
        '<br>';
    content[0].parentNode.insertBefore(newContent, content[0]);
});

/**
 * Compétences
 */
Router.add("page=officier", function() {
    /* Modification de la présentation des compétences */
    		// Récupération du nombre de PC
    var PC = document.getElementsByClassName("flaticon-heart27")[0].parentNode.innerHTML.split("<span")[0];
			// Gestion de l'arbre raiders
    document.getElementById("officier601").style.borderSpacing="0px";
    var Ref = document.getElementById("officier601").childNodes[1].childNodes[2].childNodes[1];
    Ref.childNodes[1].childNodes[5].innerHTML = Ref.childNodes[1].childNodes[5].innerHTML.split("Niveau ")[0] + Ref.childNodes[1].childNodes[5].innerHTML.split("Niveau ")[1];
    var arbre = document.getElementById("officier601").childNodes[1].childNodes[2].childNodes[1];
    //document.getElementsByClassName("article_content")[0].innerHTML = document.getElementById("officier609").childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[1].childNodes[1].innerHTML;
    if (arbre.childNodes[1].childNodes[7].getAttribute("style").split("background-color: ")[1] !== undefined) {
		if (arbre.childNodes[1].childNodes[7].getAttribute("style").split("background-color: ")[1].split(";")[0] == "#B7DE94"){
    	    arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
    	            										'<td class="transparent">' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[0] + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[1].split("</strong>")[0] + ' PC</strong>' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[1].split("</strong>")[1] + '</td></tr></tbody></table>';
    	}
    	else{
    		arbre.childNodes[1].childNodes[7].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
    	                '<td class="transparent">' + arbre.childNodes[1].childNodes[7].innerHTML.split(" besoin de")[0] + ':<b><br><strong><span style="color:#450000;">' + PC + '/' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[1].childNodes[1].innerHTML + ' PC</span></strong></b></td></tr></tbody></table>';
    	}
    }
    else{
        arbre.childNodes[1].childNodes[7].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
                											'<td class="transparent"><span style="color:red"><strong style="font-weight: 200;">Niveau maximum atteint !</strong></span></td></tr></tbody></table>';
    }
    arbre.childNodes[1].childNodes[3].remove();
    arbre.childNodes[1].childNodes[1].remove();
    
    for (var i = 2 ; i<9 ; i++)
    {
        if (document.getElementById("officier60" + i) !== null)
        {
            arbre = document.getElementById("officier60" + i).childNodes[1].childNodes[2].childNodes[1];
            arbre.childNodes[1].childNodes[5].innerHTML = arbre.childNodes[1].childNodes[5].innerHTML.split("Niveau ")[0] + arbre.childNodes[1].childNodes[5].innerHTML.split("Niveau ")[1];
            if (arbre.childNodes[1].childNodes[7].getAttribute("style").split("background-color: ")[1] !== undefined) {
				if (arbre.childNodes[1].childNodes[7].getAttribute("style").split("background-color: ")[1].split(";")[0] == "#B7DE94"){
    	    		arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
   				    	         										'<td class="transparent">' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[0] + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[1].split("</strong>")[0] + ' PC</strong>' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[1].split("</strong>")[1] + '</td></tr></tbody></table>';
  				}
    			else{
    				arbre.childNodes[1].childNodes[7].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
        	            		'<td class="transparent">' + arbre.childNodes[1].childNodes[7].innerHTML.split(" besoin de")[0] + ':<b><br><strong><span style="color:#450000;">' + PC + '/' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[1].childNodes[1].innerHTML + ' PC</span></strong></b></td></tr></tbody></table>';
    			}
            }
            else{
                arbre.childNodes[1].childNodes[7].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
                													'<td class="transparent"><span style="color:red"><strong style="font-weight: 200;">Niveau maximum atteint !</strong></span></td></tr></tbody></table>';
            }
            arbre.childNodes[1].childNodes[3].remove();
            arbre.childNodes[1].childNodes[1].remove();
            Ref.insertBefore(arbre.childNodes[1], Ref.childNodes[2+i]);
            document.getElementById("officier60" + i).innerHTML = '';
        }
    }
    
			//gestion de l'arbre farmeurs
    document.getElementById("officier609").style.borderSpacing = "0px";
    Ref = document.getElementById("officier609").childNodes[1].childNodes[2].childNodes[1];
    Ref.childNodes[1].childNodes[5].innerHTML = Ref.childNodes[1].childNodes[5].innerHTML.split("Niveau ")[0] + Ref.childNodes[1].childNodes[5].innerHTML.split("Niveau ")[1];
    arbre = document.getElementById("officier609").childNodes[1].childNodes[2].childNodes[1];
    if (arbre.childNodes[1].childNodes[7].getAttribute("style").split("background-color: ")[1] !== undefined) {
	    if (arbre.childNodes[1].childNodes[7].getAttribute("style").split("background-color: ")[1].split(";")[0] == "#B7DE94"){
			arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
   			            										'<td class="transparent">' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[0] + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[1].split("</strong>")[0] + ' PC</strong>' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[1].split("</strong>")[1] + '</td></tr></tbody></table>';
  		}
    	else{
    		arbre.childNodes[1].childNodes[7].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
        				'<td class="transparent">' + arbre.childNodes[1].childNodes[7].innerHTML.split(" besoin de")[0] + ':<b><br><strong><span style="color:#450000;">' + PC + '/' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[1].childNodes[1].innerHTML + ' PC</span></strong></b></td></tr></tbody></table>';
        }
    }
    else{
        arbre.childNodes[1].childNodes[7].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
                													'<td class="transparent"><span style="color:red"><strong style="font-weight: 200;">Niveau maximum atteint !</strong></span></td></tr></tbody></table>';
    }
    arbre.childNodes[1].childNodes[3].remove();
    arbre.childNodes[1].childNodes[1].remove();

    for (var i = 0 ; i<7 ; i++)
    {
        if (document.getElementById("officier61" + i) !== null)
        {
            arbre = document.getElementById("officier61" + i).childNodes[1].childNodes[2].childNodes[1];
            arbre.childNodes[1].childNodes[5].innerHTML = arbre.childNodes[1].childNodes[5].innerHTML.split("Niveau ")[0] + arbre.childNodes[1].childNodes[5].innerHTML.split("Niveau ")[1];
            if (arbre.childNodes[1].childNodes[7].getAttribute("style").split("background-color: ")[1] !== undefined) {
	            if (arbre.childNodes[1].childNodes[7].getAttribute("style").split("background-color: ")[1].split(";")[0] == "#B7DE94"){
 		    		arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
   			        	     										'<td class="transparent">' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[0] + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[1].split("</strong>")[0] + ' PC</strong>' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[3].innerHTML.split(" Point de compétence")[1].split("</strong>")[1] + '</td></tr></tbody></table>';
  				}
    			else{
    				arbre.childNodes[1].childNodes[7].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
            	        '<td class="transparent">' + arbre.childNodes[1].childNodes[7].innerHTML.split(" besoin de")[0] + ':<b><br><strong><span style="color:#450000;">' + PC + '/' + arbre.childNodes[1].childNodes[7].childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[1].childNodes[1].childNodes[1].innerHTML + ' PC</span></strong></b></td></tr></tbody></table>';
    			}
        	}
            else{
                arbre.childNodes[1].childNodes[7].innerHTML = '<table><tbody><tr><td class="transparent"><a class="tooltip vt-p" data-tooltip-content="' + arbre.childNodes[1].childNodes[1].getAttribute("data-tooltip-content") + '"><img src="' + arbre.childNodes[1].childNodes[1].childNodes[1].getAttribute("src") + '"></a></td>' +
                													'<td class="transparent"><span style="color:red"><strong style="font-weight: 200;">Niveau maximum atteint !</strong></span></td></tr></tbody></table>';
            }
            arbre.childNodes[1].childNodes[3].remove();
            arbre.childNodes[1].childNodes[1].remove();
            Ref.insertBefore(arbre.childNodes[1], Ref.childNodes[2+i]);
            document.getElementById("officier61" + i).innerHTML = '';
        }
    }
});

/**
 *  Missions
 */
Router.add("page=mission", function() {
    var tableaux = document.getElementsByClassName("semitable");
    var content = document.createElement("tr");
    for (var i=0 ; tableaux[i] !== undefined ; i++)
    {
        content = tableaux[i].childNodes[1].childNodes[0];
        tableaux[i].childNodes[1].childNodes[0].remove();
        if (tableaux[i].childNodes[1].childNodes[3] !== undefined)
        {
            var validate = tableaux[i].childNodes[1].childNodes[3];
            validate.childNodes[1].childNodes[1].childNodes[5].setAttribute("style", "width: 100%;");
	        tableaux[i].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].insertBefore(validate, tableaux[i].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].secondChild);
        }
        tableaux[i].innerHTML = '<tbody><tr>' + content.innerHTML + '<tr><td class="transparent"><table>' + tableaux[i].innerHTML + '</table></td></tr></tbody>';
    }
    
});

/**
 *  Médailles
 */
Router.add("page=records", function() {
    /* Ajout de liens vers le classement, la liste des sièges et la BDD joueurs */
    var medailles = document.createElement("div");
    var text = document.getElementsByClassName("text_block");
    var page = document.getElementsByClassName("news_article");
    medailles.className = "article_content";
    medailles.innerHTML = '<h3 style="line-height: 0.5em;padding-top: 10px;">Médailles</h3>'+
        '<table style="width: 100%;"><tbody><tr>' +
        	'<td class="transparent" style="text-align: left"><a href="game.php?page=statistics">Voir le Classement</a></td>' +
            '<td class="transparent"><a href="game.php?page=search">Base de données joueurs</a></td>' +
        	'<td class="transparent" style="text-align: right"><a href="game.php?page=battleHall">Liste des Sièges</a></td>' +
        '</tr></tbody></table>';
    page[0].getElementsByClassName("content")[0].innerHTML = medailles.innerHTML;
});

/**
 *  Classement
 */
Router.add("page=statistics", function() {
    /* Ajout de liens vers les Médailles, la liste des sièges et la BDD joueurs */
    var medailles = document.createElement("div");
    var text = document.getElementsByClassName("text_block");
    var page = document.getElementsByClassName("news_article");
    medailles.className = "article_content";
    medailles.innerHTML = '<div class="article_content"><div class="title_block dark_hatch_container"><div class="content"><h3 style="line-height: 0.5em;padding-top: 10px;">' +
        'Classement</h3>'+
        '<table style="width: 100%;"><tbody><tr>' +
        	'<td class="transparent" style="text-align: left"><a href="game.php?page=records">Voir les Médailles</a></td>' +
            '<td class="transparent"><a href="game.php?page=search">Base de données joueurs</a></td>' +
        	'<td class="transparent" style="text-align: right"><a href="game.php?page=battleHall">Liste des Sièges</a></td>' +
        '</tr></tbody></table></div><div class="bg"><div class="left_chrome"></div><div class="top_right_chrome"></div><div class="bottom_right_chrome"></div></div></div>' +
        '<div class="text_block">' + text[0].innerHTML + '</div></div>';
    page[0].innerHTML = medailles.innerHTML;
});

/**
 *  Base de données joueurs
 */
Router.add("page=search", function() {
    /* Ajout de liens vers les Médailles, la liste des sièges et la BDD joueurs */
    var medailles = document.createElement("div");
    var page = document.getElementsByClassName("news_article");
    medailles.innerHTML = '<div class="content"><h3>Rechercher un joueur</h3>'+
        '<table style="width: 100%;"><tbody><tr>' +
        	'<td class="transparent" style="text-align: left"><a href="game.php?page=statistics">Voir le Classement</a></td>' +
        	'<td class="transparent"><a href="game.php?page=records">Voir les Médailles</a></td>' +
        	'<td class="transparent" style="text-align: right"><a href="game.php?page=battleHall">Liste des Sièges</a></td>' +
        '</tr></tbody></table></div>';
    page[0].getElementsByClassName("content")[0].innerHTML = medailles.innerHTML;
});

/**
 *  Liste des sièges
 **/
Router.add("page=battleHall", function() {
    /* Ajout de liens vers les Médailles, la liste des sièges et la BDD joueurs */
    var medailles = document.createElement("div");
    var page = document.getElementsByClassName("news_article");
    medailles.innerHTML = '<div class="content"><h3>Liste des Sièges</h3>'+
        '<table style="width: 100%;"><tbody><tr>' +
        	'<td class="transparent" style="text-align: left"><a href="game.php?page=statistics">Voir le Classement</a></td>' +
        	'<td class="transparent"><a href="game.php?page=records">Voir les Médailles</a></td>' +
        	'<td class="transparent" style="text-align: right"><a href="game.php?page=search">Base de données joueurs</a></td>' +
        '</tr></tbody></table></div>';
    page[0].getElementsByClassName("content")[0].innerHTML = medailles.innerHTML;
});

/**
 *  Marché noir
 */
Router.add("page=trader", function() {
 	/* menu de navigation */
    document.getElementById("article").getElementsByClassName("content_area")[0].childNodes[0].setAttribute("style", "text-shadow: 0px 2px 0px #EEE");

    // Suppression du tableau de la page d'accueil. non fonctionnel, non bloquant
/*    {
        var tableau = document.getElementsByClassName("canvas-container2");
        if (tableau[0] ==! undefined)
        {
            tableau[0].innerHTML = '<div></div>';
        }
    }
*/
    // Ajout du menu de navigation de la barre du haut (modification de l'original)
/*    {
        var article = document.createElement("div");
        var pos = document.getElementsByClassName("news_article")[0].getElementsByClassName("title_block dark_hatch_container");

        article.ClassName = "content";
        article.innerHTML = '<div class="content"><div id="tradeMenu"><h3 style="line-height: 0.5em;">'+
            '<a href="game.php?page=trader" class="vt-p">Vendre des ressources</a>'+
            '<a class="vt-p">&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;&nbsp;</a>'+
            '<a href="game.php?page=fleetDealer" class="vt-p">Vendre des vaisseaux</a></h3></div></div>'+
            '<div class="bg"><div class="left_chrome"></div><div class="top_right_chrome"></div><div class="bottom_right_chrome"></div></div>';

        article.innerHTML = article.innerHTML + '</div></div></div></div>';

        pos[0].innerHTML = article.innerHTML;
    }
*/
});

/**
 *  Marché
 */
Router.add("page=trade", function() {
    /* Modification du menu */
    var menu = document.createElement("div");
    menu.className = "tradeMenu";
    menu.innerHTML = '<a href="game.php?page=trade" class="vt-p">Toutes les annonces</a>' +
        '&nbsp;--&nbsp;<a href="game.php?page=trade&amp;mode=sellres" class="vt-p">Vendre des ressources</a>' +
        '&nbsp;--&nbsp;<a href="game.php?page=trade&amp;mode=mytrade" class="vt-p">Mes annonces</a>' +
        '&nbsp;--&nbsp;<a href="game.php?page=trade&amp;mode=delivery" class="vt-p">Mes livraisons</a>' +
        '<!--&nbsp;--&nbsp;<a href="game.php?page=trade&amp;mode=seeneg">Négociation/Enchère (<font color=red>5</font>)</a><br/>-->';
    document.getElementById("tradeMenu").innerHTML = menu.innerHTML;
});

/**
 *  Vendeur de vaisseaux
 */
Router.add("page=fleetDealer", function() {
 	/* menu de navigation */
    document.getElementById("article").getElementsByClassName("content_area")[0].childNodes[0].setAttribute("style", "text-shadow: 0px 2px 0px #EEE");
    
    /* Insertion du menu */
    /*var ships = document.getElementById("shipID");
    var article = document.createElement("div");
    var text = document.getElementsByClassName("secondary_content");
    var pos = document.getElementsByClassName("news_article");
    article.className = "article_content";
    article.innerHTML = '<div class="title_block dark_hatch_container"><div class="content"><div id="tradeMenu"><h3 style="line-height: 0.5em;">' +
        '<a href="game.php?page=trader" class="vt-p">Vendre des ressources</a>' +
        '<a class="vt-p">&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;&nbsp;</a><a href="game.php?page=fleetDealer" class="vt-p">Vendre des vaisseaux</a>' +
        '</h3></div></div><div class="bg"><div class="left_chrome"></div><div class="top_right_chrome"></div><div class="bottom_right_chrome"></div></div></div>' +
        '</div></div></h3><div class="bg"><div class="left_chrome"></div><div class="top_right_chrome"></div><div class="bottom_right_chrome"></div></div></div>' +
        '<div class = text_block">' +
        '<div class="message message-info"> Ici vous pourrez vous débarasser des vaisseaux devenus inutiles, il est même possible que vous parveniez à en tirer quelque chose...</div>' +
        text[0].innerHTML;
    pos[0].innerHTML = article.innerHTML;*/
});

/**
 *  Carte de la galaxie 2 Dimensions
 */
Router.add("page=galaxy2d", function() {
    document.getElementById("content").getElementsByTagName("table")[0].remove();
    
    document.getElementById("galatav").innerHTML = document.getElementById("exp").innerHTML;
    document.getElementById("exp").remove();
});

/**
 *  Carte de la galaxie Tableau
 */
Router.add("page=galaxytable", function() {
    document.getElementById("content").getElementsByTagName("table")[0].remove();

    
    var navigation = document.createElement("form");
    navigation.setAttribute("action", "?page=galaxytable");
    navigation.setAttribute("method", "post");
    navigation.setAttribute("id", "galaxy_form");
    navigation.innerHTML = document.getElementsByClassName("article_content")[0].childNodes[3].innerHTML;
    document.getElementsByClassName("article_content")[0].insertBefore(navigation, document.getElementsByClassName("article_content")[0].childNodes[6]);
});

/**
 *  Itemshop
 */
Router.add("page=itemshop", function() {
          //modification de la largeur des boutons d'achat d'electrum
    document.getElementsByClassName("btn btn-primary")[0].setAttribute("style", "width: 90%; display: block;");
    document.getElementsByClassName("btn btn-primary")[1].setAttribute("style", "width: 90%; display: block;");
});


Router.apply(newURL);


///////////////////////////// MODIFICATIONS GENERALES /////////////////////////////

/* --------     Coloration des barres de progression (gris->vert)     --------- */
{
    if (document.settings.greenBar.getValue() == "true")
    {
        var progressbar = document.createElement("style");			// Style progressbar
        progressbar.innerHTML = '.ui-progressbar-value {\r\n'+
            'background-image: url("http://i.imgur.com/4eEOUoz.jpg");\r\n'+
            'background-position: left top;\r\n'+
            'border-color: #000000;\r\n'+
            '}';
        document.getElementsByTagName('head')[0].appendChild(progressbar);
    }
}


/* --------     Suppression d'Alicia et sa bulle     --------- */
					/* N'a plus lieu d'être, conservation du code en cas de résurgence d'un système similaire */
/*{
    if (document.settings.alicia.getValue() == "false") {
        document.getElementById("mini-IA").parentNode.removeChild(document.getElementById("mini-IA"));
        document.getElementById("IA").parentNode.removeChild(document.getElementById("IA"));
    }
}

/* --------     Suppression du menu interne     --------- */
{
    if (document.settings.innerMenu.getValue() == "true")
    {
        var menu = document.getElementById("fichepersoleft");			// Style progressbar
        if (menu !== null){
            menu.remove();
            menu = document.getElementById("fichepersoleft");
            menu.setAttribute("style", "width: 80%; vertical-align: top;");
        }
    }
}

/* --------     Modification de l'image des points de compétence, ajout du lien     --------- */
{
    var icone = document.getElementsByClassName("flaticon-heart27");
    var comp = icone[0].parentNode.parentNode.parentNode;
    icone[0].className = 'flaticon-robot3';
    comp.href = "?page=officier";
    comp.setAttribute("data-tooltip-content", "Compétences");
}

/* --------     Affichage de l'étoile electrum     --------- */
/*{
    document.getElementsByClassName("ressourcedarkmatterheader")[0].getElementsByClassName("res_current")[0].innerHTML += '<a href="http://dystopiaonline.fr/
    /game.php?page=itemshop"><span class="flaticon-star19" style="color: #FFD700"></span></a>';
}*/

/* --------     Correctif petits écrans pour les icônes de la loterie et du marché noir     ------- */
{
    var ref = document.getElementById("home_videos_article").getElementsByClassName("menutop")[0].parentNode.childNodes[5];
    ref.setAttribute("style", "position: fixed; top: 45px; right: 360px; z-index: 100;");
}

/* --------     Intégration du lien du bloc-note dans la fenêtre principale     --------- */
{
    var blocNoteRef = document.getElementsByClassName("hatch_strip");	// Référence position nouveau Bloc-Note
    var blocNote = document.createElement("div");			//Nouveau Bloc-Note
    blocNote.innerHTML = '<div style="text-align: center; margin-top: 70px; margin-left: 510px; margin-right: 500px;"><a href="javascript:OpenPopup(\'?page=notes\', \'notes\', 720, 300);" class="home_page_promo_link vt-p">Bloc-Note</a></div>';
    blocNoteRef[0].insertBefore(blocNote, blocNoteRef[0].childNodes[0]);
}

/* --------     Ajout des messages dans le menu     --------- */
{
			//gestion du nombre de messages reçus
/*	$.get( "game.php?page=messages", function( data ) {
        	//récupération du nombre de messages reçus
		var nombreMess = data.split('id="unread_0"')[1].split("<b>")[1].split("</b>")[0];
    	document.settings.mess00.setValue(parseInt(nombreMess)+parseInt(document.settings.mess00.getValue()));
		var nombreMess = data.split('id="unread_1"')[1].split("<b>")[1].split("</b>")[0];
    	document.settings.mess01.setValue(parseInt(nombreMess)+parseInt(document.settings.mess01.getValue()));
		var nombreMess = data.split('id="unread_2"')[1].split("<b>")[1].split("</b>")[0];
    	document.settings.mess02.setValue(parseInt(nombreMess)+parseInt(document.settings.mess02.getValue()));
		var nombreMess = data.split('id="unread_3"')[1].split("<b>")[1].split("</b>")[0];
    	document.settings.mess03.setValue(parseInt(nombreMess)+parseInt(document.settings.mess03.getValue()));
		var nombreMess = data.split('id="unread_4"')[1].split("<b>")[1].split("</b>")[0];
    	document.settings.mess04.setValue(parseInt(nombreMess)+parseInt(document.settings.mess04.getValue()));
		var nombreMess = data.split('id="unread_5"')[1].split("<b>")[1].split("</b>")[0];
    	document.settings.mess05.setValue(parseInt(nombreMess)+parseInt(document.settings.mess05.getValue()));
		var nombreMess = data.split('id="unread_15"')[1].split("<b>")[1].split("</b>")[0];
    	document.settings.mess15.setValue(parseInt(nombreMess)+parseInt(document.settings.mess15.getValue()));
		var nombreMess = data.split('id="unread_50"')[1].split("<b>")[1].split("</b>")[0];
    	document.settings.mess50.setValue(parseInt(nombreMess)+parseInt(document.settings.mess50.getValue()));
		var nombreMess = data.split('id="unread_99"')[1].split("<b>")[1].split("</b>")[0];
    	document.settings.mess99.setValue(parseInt(nombreMess)+parseInt(document.settings.mess99.getValue()));
	});
/**/
    // http://dystopiaonline.fr/v1.0.2/game.php?page=messages&mode=view&messcat=5&page=1
	// url de récupération des messages
}

/* --------     Bouton de déconnexion     --------- */
{
    		// Suppression du bouton par défaut
    document.getElementById("header").childNodes[3].remove();
    		// Ajout nouveau bouton
    var deconnexion = document.createElement("div");
    deconnexion.innerHTML = '<div style="z-index: 7; border: 2px solid #000; border-radius: 20px 20px 20px 20px; right: 250px; top: 75px; height: 40px; width: 40px; background-color: grey; position: fixed;"><center><a href="?page=logout" class="tooltip vt-p" data-tooltip-content="<div style=\'color: red;\'> Déconnexion</div>">'+
    								'<span class="flaticon" style="font-family: Websymbol; font-size: 25px; color: red;">`</span>'+
							'</a></center></div>';
    document.getElementsByClassName("content_area")[0].insertBefore(deconnexion, document.getElementsByClassName("content_area")[0].childNodes[0]);
}

/* --------     Bouton du Simulateur Stratégique     --------- */
{
    var simStrat = document.createElement("div");
    simStrat.innerHTML =	'<a href="game.php?page=battleSimulator" class="tooltip vt-p" data-tooltip-content="Simulateur Stratégique">'+
        						'<span class="flaticon" style="z-index: 8;  right: 20px; top: 0px; position: fixed; font-family: Websymbol; font-size: 40px; color: white;">X</span>'+
        					'</a>';
    document.getElementsByClassName("content_area")[0].insertBefore(simStrat, document.getElementsByClassName("content_area")[0].childNodes[0]);
}

/* --------     Ressources Civils     --------- */
{
/*    var civils = document.getElementsByClassName("ressourcecivilheader")[0];
    civils.setAttribute("style", "top: 150px; right: -2px; background: rgba(0,0,0,0.65);");
    document.getElementsByClassName("ressourcetop")[0].parentNode.insertBefore(civils, document.getElementsByClassName("ressourcetop")[0]);
    document.getElementsByClassName("transparent civilheader")[0].parentNode.removeChild(document.getElementsByClassName("transparent civilheader")[0]);
*/
}

/* --------     Bouton de la FaQ     --------- */
{
    var faqBouton = document.createElement("div");
    faqBouton.innerHTML =	'<a href="game.php?page=questions" class="tooltip vt-p" data-tooltip-content="<div style=\'color: lightblue;\'>FAQ</div>"><div style="z-index: 7; border: 2px solid lightblue; border-radius: 20px 20px 20px 20px; right: 325px; top: 10px; height: 40px; width: 40px; position: fixed; box-shadow: -2px 3px 10px 12px rgba(0,0,0,0.7) inset;"><center>'+
        						'<span class="Icon" style="font-size: 28px; color: lightblue;"><strong>?</strong></span>'+
        					'</center></div></a>';
    document.getElementsByClassName("content_area")[0].insertBefore(faqBouton, document.getElementsByClassName("content_area")[0].childNodes[0]);
    document.getElementById("planetSelector").setAttribute("style", "z-index: 15");
}

/* --------     Menu du haut personnalisé     --------- */
{
    var ref = document.createElement("div");
    var message = document.createElement("div");
    var chat = document.createElement("div");
    var nombres = document.getElementsByClassName("newmessageicone");
	var nbMess = nombres[1];
    var nbChat = nombres[0];
    	//gestion des messages et du chat
	if (nombres[1] == undefined)
    {
        nbMess = nombres[0];
	    if (nbMess.innerHTML == 0)
    	{
   	     message.innerHTML = '<a href="?page=messages" class="tooltip vt-p" data-tooltip-content="Messages">'+
									'<span class="flaticon" style="position: absolute; top: -4px; left: 0px; font-family: Websymbol; font-size: 32px; color: white;">8</span>'+
							'</a>';
	    }
	    else
    	{
			message.innerHTML = '<a href="?page=messages" class="tooltip newmessage vt-p" data-tooltip-content="Messages<span id=\'newmes\'> (<span id=\'newmesnum\'>' + nbMess.innerHTML + '</span>)</span>">' +
										'<span class="flaticon" style="position: absolute; top: -4px; left: 0px; font-family: Websymbol; font-size: 32px; color: red;">8</span>' +
            							'<span class="newmessageicone">' + nbMess.innerHTML + '</span>'+
								'</a>';
	    }
   	    chat.innerHTML =	'<a href="game.php?page=chat" target="chat" data-tooltip-content="Chat" class="tooltip vt-p">'+
								'<span class="flaticon-facebook21" style="position: absolute; top: -14px; left: -10px; color: #FFF;  font-size: 48px;"></span>'+
							'</a>';
    }
    else
    {
	    if (nbMess.innerHTML == 0)
    	{
   	     message.innerHTML = '<a href="?page=messages" class="tooltip vt-p" data-tooltip-content="Messages">'+
									'<span class="flaticon" style="position: absolute; top: -4px; left: 0px; font-family: Websymbol; font-size: 32px; color: white;">8</span>'+
							'</a>';
	    }
	    else
    	{
			message.innerHTML = '<a href="?page=messages" class="tooltip newmessage vt-p" data-tooltip-content="Messages<span id=\'newmes\'> (<span id=\'newmesnum\'>' + nbMess.innerHTML + '</span>)</span>">' +
										'<span class="flaticon" style="position: absolute; top: -4px; left: 0px; font-family: Websymbol; font-size: 32px; color: red;">8</span>' +
            							'<span class="newmessageicone">' + nbMess.innerHTML + '</span>'+
								'</a>';
	    }
   	    chat.innerHTML =	'<a href="game.php?page=chat" target="chat" data-tooltip-content="Chat" class="tooltip vt-p">'+
									'<span class="flaticon-facebook21" style="position: absolute; top: -14px; left: -10px; color: lime;  font-size: 48px;"></span>'+
									'<span class="newmessageicone">' + nbChat.innerHTML + '</span>'+
							'</a>';
    }
		ref.innerHTML = '<table style="width: 90%;"><tbody><tr><td class="transparent" style="width: 45px; position: relative;">'+
/*								'<a href="?page=fiche" class="tooltip vt-p" data-tooltip-content="Fiche personnage">'+
    								'<span class="flaticon-male11" style="position: absolute; top: -5px; left: 0px; font-family: Websymbol; font-size: 32px; color: white;"></span>'+
							'</a>
*/                '<a href="?page=officier" class="tooltip vt-p" data-tooltip-content="Compétences">'+
    								'<span class="flaticon-robot3" style="position: absolute; top: -5px; left: 0px; font-family: Websymbol; font-size: 32px; color: white;"></span>'+
							'</a>'+
                    '</td>'+
            				'<td class="transparent" style="width: 45px; position: relative;">' + chat.innerHTML + '</td>'+
            				'<td class="transparent" style="width: 45px; position: relative;">' + message.innerHTML + '</td>'+
            				'<td class="transparent" style="width: 45px; position: relative;">'+
								'<a href="game.php?page=buddyList" data-tooltip-content="Amis" class="tooltip vt-p">'+
    								'<span class="flaticon-multiple25" style="position: absolute; top: -5px; left: 0px; color: #FFF;  font-size: 34px;"></span>'+
                            '</a></td>'+
            				'<td class="transparent" style="width: 45px; position: relative;">'+
					            '<a href="http://f.dystopiaonline.fr/index.php?page=Index" target="forum" data-tooltip-content="Forum" class="tooltip vt-p">'+
    								'<span class="flaticon" style="position: absolute; top: -1px; left: 0px; font-family: Websymbol; color: #FFF;  font-size: 26px;">?</span>'+
                            '</a></td>'+
							'<td class="transparent" style="width: 45px; position: relative;">'+
								'<a href="game.php?page=settings" data-tooltip-content="Configuration" class="tooltip vt-p">'+
    								'<span class="flaticon-services1" style="position: absolute; top: -3px; left: 0px; color: #FFF; font-size: 30px;"></span>'+
							'</a></td>' +
							'<td class="transparent" style="width: 45px; position: relative;">'+
								'<a href="game.php?page=ticket" data-tooltip-content="Envoyer un message à l\'administration" class="tooltip vt-p">'+
    								'<img src="./styles/resource/images/icons/support.png" style="position: absolute; top: -1px; left: 0px; width: 39px;">'+
							'</a></td>'+
            				'</tr></tbody></table>' +
            			'<img src="./styles/resource/images/angletop.png" style="opacity: 0.34; position: absolute; top: 0px; left: 350px; width: 35px; height: 45px;">';
    document.getElementsByClassName("menutop")[0].innerHTML = ref.innerHTML ;
}

/* --------     menu de gauche personnalisé     --------- */
{
    var menuSocial = document.getElementsByClassName("item14");
    var pos = 0;
    while (menuSocial[pos].childNodes[0].innerHTML!="Menu social")
            pos++;
    
    			// Suppression des liens "amis" et "bloc-note"
    menuSocial[pos].getElementsByClassName("subitem1 minili")[0].remove();
    menuSocial[pos].getElementsByClassName("subitem4 minili")[0].remove();
    document.getElementsByClassName("item19")[0].remove();

    menuSocial[pos].childNodes[0].innerHTML = "Statistiques";
    
    var subitem = document.createElement("li");
    subitem.className = "subitem1 minili";
    subitem.innerHTML = '<a href="game.php?page=statistics">Classement<div class="hover"></div></a>';
    
    menuSocial[pos].getElementsByTagName("ul")[0].insertBefore(subitem, menuSocial[pos].getElementsByTagName("ul")[0].firstChild);
    
    
}

/**
 *  FAQ Area
 */

		// Infos Constructions
if (newURL == "?page=questions")
{
    document.getElementsByClassName("article_content")[0].innerHTML = '<div class="article_content"><div class="title_block dark_hatch_container"><div class="content"><h3 style="height: 34px; margin-top: 10px;"><table style="width: 100%;"><tbody><tr>'+
	'<td class="transparent" style="box-shadow: 0px 0px 0px 0px; text-align: left;">'+
        'Foire aux Questions'+
	'</td></tr></tbody></table></h3></div>'+
'<div class="bg"><div class="left_chrome"></div><div class="top_right_chrome"></div><div class="bottom_right_chrome"></div></div></div>'+
	'<div class="text_block"><div class="secondary_content">'+
        '<table style="width: 100%; text-align: left;"><tbody><tr><td class="transparent" style="box-shadow: 0px 0px 0px 0px; width: 100%; text-align: left; line-height: 26px;">'+
        	'<h2 style="text-align: center; top: 0px;">Guide du débutant</h2>'+
        	'<br>'+
        	'<ul><li><a href="game.php?page=questions&amp;mode=single&amp;categoryID=1&amp;questionID=1" class="vt-p">Les Ressources</a></li>'+
				'<li><a href="game.php?page=questions&amp;mode=single&amp;categoryID=1&amp;questionID=2" class="vt-p">Construire des bâtiments, lancer des recherches et produire des unités, défenses ou vaisseaux</a></li>'+
				'<li><a href="game.php?page=questions&amp;mode=single&amp;categoryID=1&amp;questionID=3" class="vt-p">Les marchés</a></li>'+
			'</ul>'+
	        '<br><br>'+
    	'</td></tr>'+
        '<tr><td class="transparent" style="box-shadow: 0px 0px 0px 0px; width: 100%; text-align: left; line-height: 26px;">'+
        	'<h2 style="text-align: center; top: 0px;">Techniques avancées</h2>'+
        	'<br>'+
			'<ul>'+
				'<li><a href="game.php?page=questions&amp;mode=single&amp;categoryID=2&amp;questionID=1" class="vt-p">Les attaques, l\'espionnage et la coopération</a></li>'+
				'<li><a href="game.php?page=questions&amp;mode=single&amp;categoryID=2&amp;questionID=2" class="vt-p">Les alliances</a></li>'+
				'<li><a href="game.php?page=questions&amp;mode=single&amp;categoryID=2&amp;questionID=3" class="vt-p">Les lunes</a></li>'+
				'<li><a href="game.php?page=questions&amp;mode=single&amp;categoryID=2&amp;questionID=4" class="vt-p">Les colonies</a></li>'+
			'</ul>'+
        '</td></tr></tbody></table>'+
	'<br></div></div></div>';
}else if (newURL == "?page=questions&mode=single&categoryID=1&questionID=1"){
    document.getElementsByClassName("article_content")[0].innerHTML = '<div class="article_content"><div class="title_block dark_hatch_container"><div class="content"><h3 style="height: 34px; margin-top: 10px;"><table style="width: 100%;"><tbody><tr>'+
	'<td class="transparent" style="box-shadow: 0px 0px 0px 0px; text-align: left;">'+
		'Les Ressources'+
	'</td><td class="transparent" style="box-shadow: 0px 0px 0px 0px; text-align: right;margin-right: 5px;">'+
		'<a class="button red vt-p" href="game.php?page=questions">'+
			'Retour'+
		'</a>'+
	'</td>'+
'</tr></tbody></table></h3></div>'+
'<div class="bg"><div class="left_chrome"></div><div class="top_right_chrome"></div><div class="bottom_right_chrome"></div></div></div>'+
	'<div class="text_block"><div class="secondary_content">'+
        '<br>'+
        'Il existe de nombreuses ressources dans Dystopia ; certaines sont dédiées à la production, d\'autres aux services, et d\'autres encore peuvent remplir de multiples rôles. Les connaître et connaître leurs rôles respectifs vous permettra de mieux appréhender le jeu et de mieux comprendre quelles possibilités vous avez en tant que joueur.'+
        '<br><br>'+
        '<table style="width: 100%;"><tbody><tr><td style="background-color: #000;">'+
			'<h3>Ressources de base</h3>'+
        '</td></tr></tbody></table><table style="width: 100%; text-align: left;"><tbody><tr><td class="transparent">'+
        '<span class="flaticon" style="font-family: Websymbol; color: #FFF; font-size: 1000%;">~</span>'+
        '</td><td class="transparent" style="text-align: left; background-color: rgba(0,0,0,0.45); border-radius: 5px 5px 5px 5px; padding: 10px 10px; box-shadow: -1px 2px 10px 3px rgba(0,0,0,0.7) inset;">'+
        'Il existe 5 ressources dédiées à la production dans Dystopia. Ces ressources sont : <table><tbody>'+
    		'<tr><td class="transparent"><img src="./styles/theme/6/images/metal.png" style="width: 57px;" alt=""></td>'+
        		'<td class="transparent" style="width: 100%; text-align: left;">L\'alliage : ressource de base servant dans toutes les constructions, l\'alliage est aisé à extraire et le <a href="#" onclick="return Dialog.info(1)" class="vt-p" style="color: green">Synthétiseur d\'Alliage</a> l\'un des bâtiments dont l\'amélioration est la plus simple.</td>'+
        	'</tr><tr><td class="transparent"><img src="./styles/theme/6/images/crystal.png" style="width: 57px;" alt=""></td>'+
    			'<td class="transparent" style="width: 100%; text-align: left;">Le quartz </td>'+
    		'</tr><tr><td class="transparent"><img src="./styles/theme/6/images/deuterium.png" style="width: 57px;" alt=""></td>'+
    			'<td class="transparent"style="width: 100%; text-align: left;">Le Nakrium</td></tr>'+
    		'</tr><tr><td class="transparent"><img src="./styles/theme/6/images/nanite.png" style="width: 57px;" alt=""></td>'+
    			'<td class="transparent"style="width: 100%; text-align: left;">Les Nanites</td></tr>'+
    		'</tr><tr><td class="transparent"><img src="./styles/theme/6/images/energy.png" style="width: 57px;" alt=""></td>'+
    			'<td class="transparent"style="width: 100%; text-align: left;">L\'énergie</td></tr>'+
        '</tbody></table>'+
		'</td></tr></tbody></table>'+
			'<br><br>'+
        '<table style="width: 100%;"><tbody><tr><td style="background-color: #000;">'+
        	'<h3>Lancer des Recherches</h3>'+
		'</td></tr></tbody></table><table><tbody><tr><td class="transparent">'+
			'<span class="flaticon-beaker4" style="color: #FFF; font-size: 1000%;"></span>'+
        '</td><td class="transparent" style="text-align: left; background-color: rgba(0,0,0,0.45); border-radius: 5px 5px 5px 5px; padding: 10px 10px; box-shadow: -1px 2px 10px 3px rgba(0,0,0,0.7) inset;">'+
			'Pour pouvoir lancer une recherche, il faut avant tout satisfaire à ses pré-requis. Vous pouvez trouver ces pré-requis dans <a href="game.php?page=techtree&mode=tech">l\'arbre des technologies</a>.<br>Une fois les prérequis satisfaits, la recherche apparaîtra dans le centre de recherche et vous pourrez alors lancer sa découverte à condition que vous disposiez des <a href="game.php?page=questions&mode=single&categoryID=1&questionID=1">ressources</a> nécessaires à sa création. Si tel est le cas, la construction se lancera et prendra un certain temps dépendant de la recherche et de son niveau.<br>Seule une recherche peut être lancée à la fois, mais il est possible de placer une recherche supplémentaire en file d\'attente dont les ressources ne seront consommées que lorsque la phase de recherche démarrera.<br>'+
		'</td></tr></tbody></table><br></div></div></div>';
}
else if (newURL == "?page=questions&mode=single&categoryID=1&questionID=2"){
    document.getElementsByClassName("article_content")[0].innerHTML = '<div class="article_content"><div class="title_block dark_hatch_container"><div class="content"><h3 style="height: 34px; margin-top: 10px;"><table style="width: 100%;"><tbody><tr>'+
	'<td class="transparent" style="box-shadow: 0px 0px 0px 0px; text-align: left;">'+
		'Construire des bâtiments, lancer des recherches et produire des unités, défenses ou vaisseaux'+
	'</td><td class="transparent" style="box-shadow: 0px 0px 0px 0px; text-align: right;margin-right: 5px;">'+
		'<a class="button red vt-p" href="game.php?page=questions">'+
			'Retour'+
		'</a>'+
	'</td>'+
'</tr></tbody></table></h3></div>'+
'<div class="bg"><div class="left_chrome"></div><div class="top_right_chrome"></div><div class="bottom_right_chrome"></div></div></div>'+
	'<div class="text_block"><div class="secondary_content">'+
        '<table style="width: 100%;"><tbody><tr><td style="background-color: #000;">'+
			'<h3>Construire des Bâtiments</h3>'+
        '</td></tr></tbody></table><table><tbody><tr><td class="transparent">'+
        	'<span class="flaticon-wrench44" style="color: #FFF; font-size: 1000%;"></span>'+
        '</td><td class="transparent" style="text-align: left; background-color: rgba(0,0,0,0.45); border-radius: 5px 5px 5px 5px; padding: 10px 10px; box-shadow: -1px 2px 10px 3px rgba(0,0,0,0.7) inset;">'+
			'Pour pouvoir construire un bâtiment, il faut avant tout satisfaire aux pré-requis de sa construction. Vous pouvez trouver ces pré-requis dans <a href="game.php?page=techtree&mode=build">l\'arbre de technologie des bâtiments</a>.<br>Une fois les prérequis satisfaits, le bâtiment apparaîtra dans la liste des infrastructures disponibles et vous pourrez alors lancer sa construction à condition que vous disposiez des <a href="game.php?page=questions&mode=single&categoryID=1&questionID=1">ressources</a> nécessaires à sa création. Si tel est le cas, la construction se lancera et prendra un certain temps dépendant du bâtiment et de son niveau.<br> Seule une construction peut être lancée à la fois, mais il est possible de placer 3 bâtiments supplémentaires en file d\'attente ; les ressources nécessaires à la construction des bâtiments ne seront consommées que lorsque celle-ci démarrera.<br>'+
		'</td></tr></tbody></table>'+
			'<br><br>'+
        '<table style="width: 100%;"><tbody><tr><td style="background-color: #000;">'+
        	'<h3>Lancer des Recherches</h3>'+
		'</td></tr></tbody></table><table><tbody><tr><td class="transparent">'+
			'<span class="flaticon-beaker4" style="color: #FFF; font-size: 1000%;"></span>'+
        '</td><td class="transparent" style="text-align: left; background-color: rgba(0,0,0,0.45); border-radius: 5px 5px 5px 5px; padding: 10px 10px; box-shadow: -1px 2px 10px 3px rgba(0,0,0,0.7) inset;">'+
			'Pour pouvoir lancer une recherche, il faut avant tout satisfaire à ses pré-requis. Vous pouvez trouver ces pré-requis dans <a href="game.php?page=techtree&mode=tech">l\'arbre des technologies</a>.<br>Une fois les prérequis satisfaits, la recherche apparaîtra dans le centre de recherche et vous pourrez alors lancer sa découverte à condition que vous disposiez des <a href="game.php?page=questions&mode=single&categoryID=1&questionID=1">ressources</a> nécessaires à sa création. Si tel est le cas, la construction se lancera et prendra un certain temps dépendant de la recherche et de son niveau.<br>Seule une recherche peut être lancée à la fois, mais il est possible de placer une recherche supplémentaire en file d\'attente dont les ressources ne seront consommées que lorsque la phase de recherche démarrera.<br>'+
		'</td></tr></tbody></table>'+
			'<br><br>'+
        '<table style="width: 100%;"><tbody><tr><td style="background-color: #000;">'+
			'<h3>Produire des soldats, défenses ou vaisseaux</h3>'+
        '</td></tr></tbody></table><table><tbody><tr><td class="transparent">'+
			'<span class="flaticon-satellite22" style="color: #FFF; font-size: 1000%;"></span>'+
		'</td><td class="transparent" style="text-align: left; background-color: rgba(0,0,0,0.45); border-radius: 5px 5px 5px 5px; padding: 10px 10px; box-shadow: -1px 2px 10px 3px rgba(0,0,0,0.7) inset;">'+
        'Pour pouvoir produire des vaisseaux ou des défenses, il faut avant tout satisfaire aux pré-requis de leur création. Vous pouvez trouver ces pré-requis dans <a href="game.php?page=techtree&mode=fleet">l\'arbre de technologie des vaisseaux</a> et <a href="game.php?page=techtree&mode=defense">l\'arbre de technologie des défenses</a>. Les unités, elles, peuvent toutes être recrutées sitôt la <a href="#" onclick="return Dialog.info(20)" class="vt-p" style="color: green;">Caserne</a> débloquée (nécessite le <a href="#" onclick="return Dialog.info(7)" class="vt-p" style="color: green;">Centre civil</a> niveau 5).<br><br>Une fois ces pré-requis satisfaits, rendez-vous dans le <a href="game.php?page=shipyard&mode=fleet">Hangar</a> pour les vaisseaux, dans <a href="game.php?page=shipyard&mode=defense">l\'armement défensif</a> pour les défenses et dans <a href="game.php?page=shipyard&amp;mode=fleet&amp;shipyardpage=1" class="vt-p">Unités</a> pour les unités. De là vous pourrez lancer la production d\'unités du type de votre choix pour peu que vous ayez les <a href="game.php?page=questions&mode=single&categoryID=1&questionID=1">ressources</a> nécessaires.<br><br><a style="color: red">ATTENTION</a> il est impossible de produire des unités si le hangar ou l\'usine de Nanites sont en construction ou en attente de construction'+
		'</td></tr></tbody></table><br></div></div></div>';
}