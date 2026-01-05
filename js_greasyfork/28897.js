// ==UserScript==
// @name         MOH-Essai
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Récolte et Semis automatiques, Creation d'un tableau récapitulatif
// @author       AC
// @match        http://www.marchofhistory.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28897/MOH-Essai.user.js
// @updateURL https://update.greasyfork.org/scripts/28897/MOH-Essai.meta.js
// ==/UserScript==

(function() {
	'use strict';
	// creation de l'objet outils
	window.MOHA={};

	//initialise l'outil en appelant les fonction d'initialisation des sous outils
	MOHA.init=function(){
		for(var i in MOHA){
			if(MOHA[i].hasOwnProperty('init')){
				MOHA[i].init();
			}
		}

	};

	MOHA.afficheGraphEco = function(){
		if(document.getElementById('zoneGraph')){document.getElementById('main').removeChild(document.getElementById('zoneGraph'));}

		function dateInDay(y, m, d){
			return Date.UTC(y, m, d)/msInDay;
		}

		var today=dateInDay(partie.date.annee, partie.date.mois-1, partie.date.jour)/msInDay,
			tabEvents=[],
			msInDay=(1000*3600*24);
		var yearAvant=partie.date.annee;
		var solde=0;
		$('#tabs-evenements li:contains(livres)').each(function(a,b){//a:index //b:objetHTML
			var textEv=$('#tabs-evenements li:contains(livres)')[a].textContent;
			/(\d{1,2})\s(\D+)\s(\d{4}).+(rapporté|acheté).*\s(\d+)\slivres/.exec(textEv);
			var year = RegExp.$3,
				month = RegExp.$2,
				day = RegExp.$1,
				signe = RegExp.$4 == "rapporté" ? +1 : -1,
				montant=parseInt(RegExp.$5);

			month=isNaN(month)?["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"].indexOf(month):month;

			if(yearAvant!=year){
				solde-=ville.infos.recettesEstimees;
				tabEvents.push(solde);
			}
			yearAvant=year;
			var delais= dateInDay(year, month, day)-today;
			solde-=signe*montant;
			tabEvents.push(solde);
			i++;
		});


		// creation zone de dessin
		var zoneGraph=document.createElement('canvas');
		zoneGraph.id="zoneGraph";
		zoneGraph.width="250";
		zoneGraph.height="200";
		zoneGraph.style="border:1px solid #d3d3d3; position: absolute;top: 270px;left: 30px; background:url(http://statics.marchofhistory.com/images/textureContent.jpg) repeat scroll 0 0 transparent; z-index: 100000;";
		document.getElementById('main').appendChild(zoneGraph);
		zoneGraph.addEventListener("click", function(){document.getElementById('main').removeChild(this);});

		//realisation graphique
		var c = document.getElementById("zoneGraph");
		var ctx = zoneGraph.getContext("2d");
		var tabAbs=[];
		tabEvents.forEach(function(val,index){tabAbs[index]=Math.abs(val);});
		var Ymax = tabAbs.sort(function(a, b){return b - a;})[0];
		var gradY = (zoneGraph.height-20)/(2*Ymax);
		var gradX = zoneGraph.width/1826; // calculer pour faire tenir les jour de 5 années (1826) sur 200pixels

		//début graduations horizontales
		ctx.beginPath();
		ctx.strokeStyle='rgb(255,200,200)';
		ctx.font = "12px Arial";

		// 0
		ctx.moveTo(zoneGraph.width-50,zoneGraph.height/2);
		ctx.lineTo(0,zoneGraph.height/2);
		ctx.stroke();
		ctx.fillText("0",zoneGraph.width-50+5,5+zoneGraph.height/2);

		// autre grad
		for(var i=18/gradY; i<Ymax; i+=18/gradY){
			ctx.moveTo(zoneGraph.width-50,zoneGraph.height/2+i*gradY);
			ctx.lineTo(0,zoneGraph.height/2+i*gradY);
			ctx.stroke();
			ctx.moveTo(zoneGraph.width-50,zoneGraph.height/2-i*gradY);
			ctx.lineTo(0,zoneGraph.height/2-i*gradY);
			ctx.stroke();
			ctx.fillText(-i,zoneGraph.width-50+5,5+zoneGraph.height/2+i*gradY);
			ctx.fillText(i,zoneGraph.width-50+5,5+zoneGraph.height/2-i*gradY);
		}
		// fin grad hrizontales

		// début du tracé
		ctx.beginPath();
		ctx.strokeStyle='rgb(0,0,0)';
		ctx.moveTo(zoneGraph.width-50,zoneGraph.height/2);
		for(var i=0; i<tabEvents.length; i++){

			ctx.lineTo(zoneGraph.width-50-(10*gradX)*(1+i),zoneGraph.height/2-(tabEvents[i]*gradY));
		}
		ctx.stroke();

	};

	MOHA.attaqueSim={
		// attent le clique de destination avant passer à l'armée suivante
		armeeEnroute:function (listeIDArmee,compteur) {
			var comp = compteur || 0;// initialise le compteur si il n'est pas fourni

			if (comp<listeIDArmee.length){//si compteur inférieur à la longeur du tableau
				if(!monde.armees[listeIDArmee[comp]].hasOwnProperty('deplacementVersX')){// si armee immobile
					window.MOHA.attente = setTimeout(function(){// attente mise en route armée
						if(ui.getIFrame().carte.IDArmeeSelectionee != listeIDArmee[comp]){ // selectionne l'armee si pas déja fait
							$('#Armee'+listeIDArmee[comp]+'Deplacement').click();
						}
						MOHA.attaqueSim.armeeEnroute(listeIDArmee,comp); // boucle à nouveau sur la fonction
					},200);//attente

				} else {// sinon amre est en route on passe donc à la suivante en incrementant le compteur et en bouclant sur la fonction
					comp++;
					MOHA.attaqueSim.armeeEnroute(listeIDArmee,comp);
				}
			}else{
				return;
			}
		},

		// evoie la liste des armées à la fonction de boucle
		start:function(){
			var listeIDArmee=[];
			for (var idArmee in monde.armees){
				listeIDArmee.push(idArmee);
			}
			MOHA.attaqueSim.armeeEnroute(listeIDArmee,0); // commande de lancement
		},

		//initialise la commande en inserant un bouton dans le paneau du jeu
		init:function(){
			if($('#ecranCarte').length>0 && $('#lancerTtesArmees').length===0){
				$('#tabs').prepend($('<button id="lancerTtesArmees" style="position: absolute;top: 59px;right: 13px;z-index: 100;" class="btnType">Lancer toutes les armées</button>').click(function(){MOHA.attaqueSim.start();}));
			}
		}
	};
	//

	// ajoute la possibilité de changer la population d'un batiment
	// à l'aide d'une zone de texte à coté cadre indiquant pop batiment
	MOHA.changementPop={
		action:function(e, sens){

			// recupere l'id du batiment
			var idBat = $(e.target).attr('data-idbatiment');

			// recupere la population du batiment et l'incremente selon le sens
			var nbVillageois=parseInt($('#blocBatimentNombreVillageois'+idBat).text())+parseInt(sens);

			// controle du nombre demandé
			if(nbVillageois>ville.batiments[idBat].populationMax){nbVillageois=ville.batiments[idBat].populationMax;}
			if(nbVillageois<0){nbVillageois=0;}

			// affecte la pop
			ville.affecteVillageois(idBat, nbVillageois);

			//gestion graphique
			$('#blocBatimentNombreVillageois'+idBat).text(nbVillageois);
			var leftBouton=Math.round(nbVillageois*100/parseInt(ville.batiments[idBat].populationMax));
			$('#blocBatimentSliderVillageois'+idBat+' a').css('left',leftBouton+'%');
			$('#blocBatimentSliderVillageois'+idBat+' .ui-slider-range').css('width',leftBouton+'%');


		},
		init:function(){
			if ($('.inputPopulation').length>0){
				$('.inputPopulation').each(
					//pour chaque element
					function(){
						if(!$(this).siblings('.flecheAC_Container').length){// si la zone de texte n'existe pas
							//creation de la zone
							var flecheContainer=$('<div class="flecheAC_Container">');
							var flecheup=$('<div class="flecheAC upPopNum" data-idbatiment="'+$(this).closest('.blocBatiment').attr('data-idbatiment')+'"></div>').click(function(e){MOHA.changementPop.action(e,+1);});
							var flechedo=$('<div class="flecheAC downPopNum" data-idbatiment="'+$(this).closest('.blocBatiment').attr('data-idbatiment')+'"></div>').click(function(e){MOHA.changementPop.action(e,-1);});

							//insertion de la zone (avant à cause du float right)
							$(this).before(flecheContainer.append(flecheup).append(flechedo));
						}
					}
				);
			}
		},
	};

	/* ======================================== Modif Site ================================================= */
	$('#containerEcranPrincipal').css("min-height", "100%");

	/* ======================================== fonction =================================================== */

	// tri le tableau récap en fonction du parametre fourni
	MOHA.tri = function(paramTri){
		//determination du sens de tri
		var sensTri= paramTri.className.match(/(triDo|triUp)/g),
			triById=0,
			tableauTri=[],
			tabintab;

		//gestion graphique
		if(sensTri=="triDo"){
			$('#tableauRecapVille th span').removeClass('triUp triDo');
			paramTri.classList.add("triUp");
		}else if(sensTri=="triUp"){
			$('#tableauRecapVille th span').removeClass('triUp triDo');
			triById=1;
		}else{
			$('#tableauRecapVille th span').removeClass('triUp triDo');
			paramTri.classList.add("triDo");
		}
		if(!triById){
			// creation du tableau de tri avec les ligne du tableau html

			for(var i=0; i<$('#tableauRecapVille tr').length; i++ ){
				tabintab=[$('#tableauRecapVille tr .'+paramTri.id)[i].innerText, $('#tableauRecapVille tr')[i]];
				tableauTri.push(tabintab);
			}

			// tri du tableau en fonction de lettre ou nombre
			if(isNaN(tableauTri[0][0])){
				/*lettre*/tableauTri.sort(function(b, a){return b[0].localeCompare(a[0]);});
			}else{
				/*nombre*/tableauTri.sort(function(b, a){return b[0]-a[0];});
			}

			// inversion du sens en fonction du sens selectionné
			if(sensTri=="triDo"){tableauTri.reverse();}
		}else{
			for(var i=0; i<$('#tableauRecapVille tr').length; i++ ){
				tabintab=[$('#tableauRecapVille tr button')[i].getAttribute("data-idville"), $('#tableauRecapVille tr')[i]];
				tableauTri.push(tabintab);
			}
			tableauTri.sort(function(b, a){return b[0]-a[0];});
		}
		// affichage du tableau trié
		$('#tableauRecapVille tbody').html("");
		for(var j=0; j<tableauTri.length; j++){
			$('#tableauRecapVille tbody').append(tableauTri[j][1]);
		}

	};

	// s'occupe du champs dont l'id est fourni
	//       sarcler si besoin
	//       semer ble si possible
	MOHA.soccuperChamp = function(IDChamps){
		var saison = partie.date.saison;
		//sarcler le champs si besoin
		if (ville.batiments[IDChamps].entretientPret){
			$('button#champBoutonEntretien[data-idbatiment="' + IDChamps + '"]').click();
		}
		// semer si printemps ou automne et champs sans production
		if ((saison == 1 || saison == 3) && !ville.batiments[IDChamps].dateRecolte){
			$('button#champSemerChamp' + IDChamps + '_' + typeBle[saison]).click();
		}
		//affecte le max de villageois au champs
		if(ville.batiments[IDChamps].population!=50){
			ville.affecteVillageois(IDChamps,50);
		}
	};

	// gere la production
	MOHA.gestionProd = function (ressource){
		var lvlBtn=0,
			batiment="",
			manque=ville.infos.stocksMax[ressource]-ville.infos.stocks[ressource];

		if(ressource == "outil"){batiment="forge";}if(ressource == "arme"){batiment="armurerie";}
		if(manque>=100){lvlBtn=4;}else if(manque>=50){lvlBtn=3;}else if(manque>=20){lvlBtn=2;}else if(manque>=10){lvlBtn=1;}else{return;}

		if (ville[batiment].produtionEnCours == -1 && ville.batiments[ville[batiment].ID]!==undefined){
			ville[batiment].produire('button#'+batiment+'BoutonProduireActif'+lvlBtn);//console.log(batiment);
			ville[batiment].miseAJour(ville.batiments[ville[batiment].ID]);
		}
	};
	/* ======================================== declaration de variable ==================================== */

	var casesTableauRecapVille=['city', 'pop', 'bois', 'pierre', 'fer', 'salpetre', 'outil', 'arme', 'ble', 'tech', 'champs', 'chantier']; // contient les différente case du tableau recap
	var saison = partie.date.saison;

	var typeBle = ['','1','','2'];

	/* ======================================== declaration de style ======================================= */

	$('head').append('<style>'+
					 '#cadreTRV {display: none; position: relative; top: -515px; z-index:10000000; height: 515px; overflow-y: scroll}'+
					 '#tableauRecapVille {background: url("http://statics.marchofhistory.com/images/interface/fondBois.jpg"); background-size: cover; text-align: center; }'+
					 '#tableauRecapVille th span{vertical-align: middle;}'+
					 '#tableauRecapVille th {background: url("http://statics.marchofhistory.com/images/textureContent.jpg"); color: black; width: calc(100%/' + casesTableauRecapVille.length + ');}'+
					 '#tableauRecapVille tr {color: white}'+
					 '#tableauRecapVille tr:hover {background-color: rgba(200, 100, 50, 0.5)}'+
					 '#tableauRecapVille button {color:white; width:100%; background:url("http://statics.marchofhistory.com/images/interface/fondBoisSombre.jpg"); border-color:silver; border-style:ridge; height:25px; overflow:hidden;}'+
					 '#tableauRecapVille button span {vertical-align: middle;}'+
					 '#tableauRecapVille td{vertical-align:middle;}'+
					 '#tableauRecapVille td.city span {color:transparent;}'+
					 '.notFull {color: orange;}'+
					 '.full{color: lightgreen}'+
					 '#visiteAuto {background: url("https://cdn1.iconfinder.com/data/icons/windows8_icons_iconpharm/26/unchecked_checkbox.png") no-repeat; background-size: 13px 13px; width: 13px; color: transparent;}'+
					 '#visiteAuto.checked{background-image: url("https://cdn1.iconfinder.com/data/icons/windows8_icons_iconpharm/26/checked_checkbox.png")}'+
					 '.curentCity{}'+
					 '.blocRavitaillement_villes table.listing td:first-child {font-size: 10px;}'+
					 '.triDo::after {content: "˅";color: red;}'+
					 '.triUp::after {content: "˄";color: red;}'+
					 '.flecheAC_Container{float: right;margin-top: 18px;}'+
					 '.flecheAC{background:url("http://statics.marchofhistory.com/images/interface_icones.png") no-repeat -231px -584px;height: 6px;width: 14px;}'+
					 '.upPopNum{background-position-x: -251px;}'+
					 '.downPopNum{margin-top: 3px;}'+
					 '.flecheAC:hover{opacity:0.5;}'+
					 '</style>');

	/* ========================================= actions =================================================== */

	//ajout du bouton pour vider zone de notifications
	$('.zoneMenuDecoRight').prepend($('<span>').addClass('iconeEditionSupprimer').click(function(){$('#zoneNotifications>div').remove();}));


	//creation du tableau récapitulatif et son syteme on/off
	$('#main').append(
		$('<div id="cadreTRV">')
		//	.click(function(){$('#cadreTRV').toggle();})
		.append($('<table id="tableauRecapVille">'))
	);

	//creation du bouton d'appel du tableau récapitulatif par systeme on/off
	$('.topBannerInfos').prepend(
		$('<button>RecapVille</button>').click(function(){
			$('#cadreTRV').toggle();
		})
	);

	// creatoin de la case a cocher pour automatisation de la visite des villes
	var villeDepart;
	$('.topBannerInfos').prepend(
		$('<button id="visiteAuto">.</button>').click(function(){
			$('#visiteAuto').toggleClass('checked');
			villeDepart = ville.infos.ID;
		})
	);



	//remplissage de la ligne de titre du tableau
	$('#tableauRecapVille').html('<th><span id="city">Ville</span> <span id="possession" class="iconesRevendiqueesdeFacto" style="background-position-x: -400px;"></span></th>'+
								 '<th><span id="nbPop" class="iconesStrategiePopulation"></span><span id="croisPop" class="iconesCroissancePop"></span><span id="croisEco" class="iconesCroissanceEco"></span></th>'+
								 '<th><span id="bois" class="iconeRessourceBois"></span></th>'+
								 '<th><span id="pierre" class="iconeRessourcePierre"></span></th>'+
								 '<th><span id="fer" class="iconeRessourceFer"></span></th>'+
								 '<th><span id="salpetre" class="iconeRessourceSalpetre"></span></th>'+
								 '<th><span id="outil" class="iconeRessourceOutil"></span></th>'+
								 '<th><span id="arme" class="iconeRessourceArme"></span></th>'+
								 '<th><span id="ble" class="iconeRessourceAliment"></span></th>'+
								 '<th><span id="techEnCours" class="iconeRessourceTechnologie"></span> (<span id="techActi" >acti</span>/<span id="techDispo" >dispo</span>)</th>'+
								 '<th>Champs</th>'+
								 '<th>Chantier</th>'
								);

	$('#tableauRecapVille th span').click(function(){MOHA.tri(this);});
	$('#tableauRecapVille').append(localStorage.tabRecapMOH);
	$('#tableauRecapVille tbody').click(function(){$('#cadreTRV').toggle();});
	//action à lancer un certain delais apres que la ville soit chargée
	var compteur;
	$(document).ajaxStop(function(){setTimeout(function(){
		MOHA.init();//initialisation de l'outils

		// ajout de la date de naissance d'un perso en titre de son age
		if(document.querySelector('.portraitSelect_age')){
			document.querySelector('.portraitSelect_age').setAttribute("title", new Date(new Date(1100,0,1).getTime()+(famille.personnageMisEnAvant.dateNaissance*24*60*60*1000)).toLocaleDateString());
		}

		if ($('#ecranVille').length){

			//ajout affichage graphique economie par clique sur iconeHelp
			$('#infosActiviteEconomique ~ .iconHelp').click(
				function(){
					$(this).off('click');
					MOHA.afficheGraphEco();
				});

			//gestion automatique des récolte de taxe
			var btnTaxe = $('button[id^="blocBatimentBoutonRecolte"].action');
			if(btnTaxe.length > 0){
				btnTaxe.click().removeClass("action");
			}

			//gestion automatique des dons de nourriture (calcul le nombre de don possible en f° nouriture dispo et nb max possible)
			var reserve = $('#recap_'+ville.infos.ID+' .ble').text().match('r') ? 100 : 0;
			while (!ville.batiments[ville.grenier.ID].TempsAvantUtilisation && ville.infos.stocks.ble-reserve >= ville.batiments[ville.grenier.ID].cout){
				ville.grenier.donnerNourriture($('button[id^="blocBatimentBoutonDonNourriture"]'));
				ville.infos.stocks.ble-=ville.batiments[ville.grenier.ID].cout;
				ville.grenier.miseAJour(ville.batiments[ville.grenier.ID]);
			}

			//creation de la ligne de la ville si elle n'existe pas
			if($('#tableauRecapVille tr#recap_' + ville.infos.ID).length === 0){
				$('#tableauRecapVille').append('<tr class="curentCity" id="recap_' + ville.infos.ID + '" ></tr>');

				//creation des différentes cases
				for (var i=0; i<casesTableauRecapVille.length; i++){
					$('#tableauRecapVille tr#recap_'+ville.infos.ID).append('<td class="' + casesTableauRecapVille[i] + '" ></td>');
				}

				//remplissage de la case Ville contenant le bouton pour aller sur la ville (se fait ici car pas modifié par la suite)

				$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.city').html(
					$('<button>').attr({'class'       : 'action',
										'data-idville': ville.infos.ID,
										'data-ecran'  : 'ville',
										'data-action' : 'ui.changerEcran',
										'title'       : ville.infos.nom
									   }).html(ville.infos.nom.substr(0, 10) + "<span></span>")
				);
			}

			// complette case Ville en indiquant si la ville est possédée ou juste de facto par une icone
			// de facto par defaut sinon de jure
			var possClass="iconesRevendiqueesdeFacto";
			if(ville.infos.IDDirigeant==ville.infos.IDPossesseur){
				possClass="iconesRevendiqueesdeJureDeFacto";
			}
			var possText=ville.infos.legitimite;

			$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.city span').removeClass().addClass(possClass+" possession").text(possText).attr('title',possText);

			//remplissage case Population
			$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.pop').html(
				"<span class='nbPop'>" + ville.infos.populationTotale + "</span> ("+ // nombre de pop dans la ville
				"<span class='tooltip croisPop'>" + ville.infos.tauxCroissancePopulation + $('#contenuTooltipCroissancePopulation').parent().html().trim() + "</span>%; "+ // croissance pop avec detail au survol (tiré du jeu)
				"<span class='tooltip croisEco'>" + ville.infos.activiteEconomique + $('#contenuTooltipActiviteEconomique').parent().html().trim() + "</span>%)" // croissance eco avec detail au survol (tiré du jeu)
			);

			//remplissage automatique des case Ressource (compteur ignore les 2 premiere case (ville et pop) et les 3 derniere (techno champ et chantier) )
			for (var i=2; i<casesTableauRecapVille.length-3; i++){
				var ressource = casesTableauRecapVille[i],
					ri = ville.infos.stocks[ressource],
					riMax = ville.infos.stocksMax[ressource],
					ravito = "";
				//note si la ville ravitaille une armée
				if(!$('div#menuVillageRessourcesElementNourriture').attr('title').match("Consommation de l'armée : 0")&&ressource=='ble'){ravito="r";}

				//            alert(ressource);
				//note la prod
				if($('div#menuVillageRessourcesElement'+ressource.charAt(0).toUpperCase()+ressource.substr(1)).length){
					if($('div#menuVillageRessourcesElement'+ressource.charAt(0).toUpperCase()+ressource.substr(1)).attr('title').match("Production annuelle")){
						var titreDiv = $('div#menuVillageRessourcesElement'+ressource.charAt(0).toUpperCase()+ressource.substr(1)).attr('title'),
							prod;
						prod = /Production annuelle : (\d{1,3})/.exec(titreDiv)[1];
						if(prod>0){
							ravito=" (+"+prod+")";
						}
					}
				}

				$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.' + ressource).text(ri + ' / ' + riMax + ' ' + ravito).removeClass('notFull full');

				//achat ou prod auto
				// lance prod si outil ou arme
				if(ressource == 'outil' || ressource == 'arme'){MOHA.gestionProd(ressource);}

				// si gros manque (<50)
				if(ri < riMax-50){
					//achat au marché 1 fois par jour
					if ($('button#marcheAchatValidationMoinsCherPrixAchat[data-ressource="'+ressource+'"][data-prix="1000"]').length !== 0){
						ville.marche.acheter($('button#marcheAchatValidationMoinsCherPrixAchat[data-ressource="'+ressource+'"][data-prix="1000"]'));
					}
					if(ressource=='ble' && ri<riMax-100 && $('button#marcheAchatValidationMoinsCherPrixAchat[data-ressource="'+ressource+'"][data-prix="2000"]').length !== 0){
						ville.marche.acheter($('button#marcheAchatValidationMoinsCherPrixAchat[data-ressource="'+ressource+'"][data-prix="2000"]'));
					}
					// note case en manque
					$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.' + ressource).addClass('notFull');
				} else if (ri == riMax){
					// sinon note case en full
					$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.' + ressource).addClass('full');
				}
			}

			//rempli la case techno
			// determine la technologie en cours et note case full sinon affiche rien et note la case en manque
			var techEnCours;
			if($('.iconHelp span.iconeRessourceTechnologie+span').length > 0){
				techEnCours = $('.iconHelp span.iconeRessourceTechnologie+span').text();
				$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.tech').addClass('full');
			} else {
				techEnCours = 'Rien';
				$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.tech').removeClass('full');
			}
			// affichage tech en cours
			$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.tech').html(
				"<span class='techEnCours'>" + techEnCours.substr(0, 14) + "</span>"
			);

			//rempli la case Chantier
			$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.chantier').text($(".blocBatiment_constructible[id]").length);


			var listeChamps = [];

			//action par batiment
			for(var numBat in ville.batiments){
				var batiment = ville.batiments[numBat];

				if(batiment.IDBranche == 12){
					/*$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.tech').text(function(n, cc){
					return cc + " (" + batiment.recherchesActivables.length + "/" + batiment.recherchesDisponibles.length +")";
				});*/
					$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.tech').append(
						" (<span class='techActi'>" + batiment.recherchesActivables.length + "</span>/"+
						"<span class='techDispo'>" + batiment.recherchesDisponibles.length +"</span>)"
					);
					if (batiment.recherchesDisponibles.length > 0){
						$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.tech').removeClass('notFull');
					} else {
						$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.tech').addClass('notFull');
					}
				}

				/*if(batiment.IDBranche == 7 || batiment.IDBranche == 8){
                // regarde si forge ou armurie active pour tableau récap
                var choixBatiment=['outil','arme'];
                if ($('#blocBatimentNombreVillageois'+batiment.ID).text() > 0 && $('#blocBatimentIconeActivite'+batiment.ID).hasClass('iconeActivite')){
                    $('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.' + choixBatiment[batiment.IDBranche-7]).append('<span class="iconeActivite"></span>');
                }
            }*/

				if(batiment.IDBranche == 1){
					// etabli la liste des champs
					listeChamps.push(batiment.ID);
				}
			}
			// rempli la case champ
			$('#tableauRecapVille tr#recap_' + ville.infos.ID + ' td.champs').text(listeChamps.length);
			// appel fonction pour s'occuper de chaque champs
			listeChamps.forEach(function(i){
				MOHA.soccuperChamp(i);
			});

			// change de ville si la case visiteAuto est checked et si compteur==nombre paire (permet mise a jour data et achat avant de passer a 2 ville "&& compteur%2==0"

			if($('#visiteAuto').hasClass('checked')){
				if(villeDepart==ville.infos.ID){
					$('#visiteAuto').click();
				} else {
					$('.btnDirectionnelRight').click();
				}
			}
			localStorage.tabRecapMOH=$('#tableauRecapVille>tbody').html();
		}
	}, 100);});
})();
