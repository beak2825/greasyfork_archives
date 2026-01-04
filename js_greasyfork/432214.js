// ==UserScript==
// @name ThemeDC - ♥Nivéole♥
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description ThemeDC créé juste pour ♥Nivéole♥
// @author Isilin
// @grant GM_addStyle
// @run-at document-start
// @match https://www.dreadcast.net/Main
// @downloadURL https://update.greasyfork.org/scripts/432214/ThemeDC%20-%20%E2%99%A5Niv%C3%A9ole%E2%99%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/432214/ThemeDC%20-%20%E2%99%A5Niv%C3%A9ole%E2%99%A5.meta.js
// ==/UserScript==

(function() {
let css = `
	/* DECKS */

	/* silmerion */
	.deck_type_4 .fond {
		background: url(https://nsa40.casimages.com/img/2021/01/31/210131012605705561.png) center center no-repeat;
		background-size: cover;
		width: calc(100% - 4px);
		height: calc(100% - 4px);
		top: 2px;
		left: 2px;
		position: absolute;
		z-index: 0;
		box-shadow: 0 0 10px #a80000;
	}

	.deck_type_4 .intro {
		color: #887070!important;
		font-family: monospace!important;
		border-radius: 10px;
		background-color: rgb(0 0 0 / 63%);
		padding: 10px;
		font-size: 11px;
	}

	.deck_type_4 .ligne_resultat_fixed {
		color: #ffa0a0!important;
		font-family: monospace!important;
		font-size: 13px;
	}

	/* LYRIA */
	.deck_type_3 .deck_main {
		background: rgba(35,61,100,.84);
		font-size: 12px;
		padding: 10px;
		border: 1px solid #a80000;
		background: url(https://nsa40.casimages.com/img/2021/01/31/210131012605705561.png) center center;
		color: #ea7a7a !important;
		font-family: monospace!important;
		font-size: 12px;
	}

	.deck_type_3 input {
		width: auto;
		
	}


	.deck_type_3 {
	   
		background: url(https://i.imgur.com/2xCS7aU.png); /* Boxe 9 fond 0 */
		
	}


	/* PUTAIN DE COM DE MERDE QUI CHANGE PLUS DE TAILLE MTN */
	.dataBox .message .contenu {
		width:400px !important;
	}

	/* Interface personnage gauche */
	#zone_gauche_inventaire {
		
		text-transform: uppercase;
		height: 100%;
		font-size: .7rem;
		font-family: Arial;
		background:url(https://i.imgur.com/tDZ4UzF.png) 0 0 no-repeat; /* interface_personnage.png */
		background-size: contain;
	}

	/* Contenu barre d'état (Santé + Forme + Exp) */
	#zone_fiche .barre_etat{
		
		background: #dad4d4; /* Barre remplie ou vide */
	}

	/* Container de la barre d'état (Santé + Forme + Exp) */
	#zone_fiche .barre_inv {

		background: #A80000 !important;
		border: 1px solid #a10303 !important;

	}

	/* Couleur du titre du personnage */
	#zone_fiche #txt_titre {

		color: #d45555;

	}

	/* Couleur du nom du personnage */
	#zone_fiche #txt_pseudo {
	   
		color: #dad4d4;

	}

	/* Couleur du niveau */
	#zone_fiche #txt_niveau {
	   
		color: #dad4d4;
	}


	/* Icones Santé, Forme et Exp */
	#zone_fiche #barre_experience svg, #zone_fiche #barre_forme svg, #zone_fiche #barre_sante svg {
		stroke: #A80000;
		fill: #A80000;

	}

	/* Caret de la santé, forme et Exp */
	#zone_fiche .barre_border .fa-caret-right {
		
		background: #A80000;
	   
	}


	/* Block stats */
	#zone_fiche #statistiques li .infos {
		
		background: #2b2c2d;
		border-top: 1px solid #2b2c2d;
		border-left: 1px solid #2b2c2d;
		border-right: 1px solid #2b2c2d;

	}

	/* Stat max */
	#zone_fiche #statistiques li.max {
		color: #ea7a7a;
	}

	/* Stat */
	#zone_fiche #statistiques ul>li{
		color: #dad4d4;
	}

	/* Stat icones */
	#zone_fiche #statistiques li svg {
		
		fill:#dad4d4;
	}

	/* Majorité des icones SVG */
	svg {
	  
		fill: #dad4d4;
	}

	/* Icones stats hover */
	#zone_fiche #statistiques li .infos svg{
		stroke: #A80000;
		fill: #A80000;
		color:#FFFFFF;
	}

	/* Description stats */
	#zone_fiche #statistiques li>.infos_desc_1 {
	   
		background: #2b2c2d;
		border-bottom: 2px solid #A80000;
		border-left: 2px solid #A80000;
		border-right: 2px solid #A80000;
		border-top: 2px solid #A80000;
		border-radius: 5px;
		
	}

	/* Description stats : MAX */
	#zone_fiche #statistiques .infostats .max {
		color: #ea7a7a;
	}


	/* Icone de faim */
	.stat_icone_faim {
	   
		background: url(https://i.imgur.com/P4yBNY5.png) 0 -143px no-repeat; /* Mini icones image */
	}

	/* Icone de soif */
	.stat_icone_soif {
		width: 13px;
		height: 13px;
		background: url(https://i.imgur.com/P4yBNY5.png) -13px -143px no-repeat; /* Mini icones image */
	}


	/* Icone de crédits */
	.stat_icone_cr {
	   
		background: url(https://i.imgur.com/P4yBNY5.png) 0 -156px no-repeat; /* Mini icones image */
	}

	/* Texte crédits */
	#zone_fiche #txt_credits {
		color: #dad4d4;
		
	}

	/* Suite du texte crédits */
	#zone_fiche #txt_credits em {
		
		color: #2f0303;
		
	}

	/* Bouton d'arrêt d'action */
	#zone_fiche #stop_action {
	   
		background: url(https://i.imgur.com/gsapO14.png) 0 0 no-repeat; /* Image boutons */
		
	}    
		

	/* Cases personnage */
	.case_objet {
	   
		border: .04rem solid #9a9999;
		box-shadow: 0 0 2px 0 #630101, 0 0 10px 0 #630101, 2px 2px 5px -1px #630101, inset 0 0 3px #630101, inset 0 0 5px 0 #630101;
		
	}

	/* Cases personnage ouvert */
	.case_objet.active.linkBox, .case_objet.case_main_hover.linkBox, case_objet.case_main_hover {
		background-color: #7b0000;
	}
	.case_objet.active, .case_objet.active.linkBox {
		border-color: #cc4f4f;
	}
	.case_objet.active, .case_objet.active.linkBox, .case_objet.active.linkBox:hover, .case_objet.active:hover, .case_objet.case_main_hover, .case_objet.case_main_hover.linkBox {
		box-shadow: 0 0 2px 0 #fff, 0 0 10px 0 #dc0909, 2px 2px 5px -1px #e60f0f, inset 0 0 3px #fff, inset 0 0 5px 0 #e40c0c;
	}
	#zone_inventaire {
		background: url(https://i.imgur.com/EHhfuWo.png) no-repeat; /* Logo DevOps transparent */
		 -webkit-background-size: cover;
		-moz-background-size: cover;
		-o-background-size: cover;
		background-size: cover;
	}

		
	/* Poubelle */
	#ciseauxInventaire, #poubelleInventaire {

		border: 1px solid #d45555;
		
	}

	#ciseauxInventaire, #poubelleInventaire, #statsInventaire, #stockInventaire{
		color:#ea7a7a;
	}
		
		
	/* Poubelle : hover */
	#ciseauxInventaire:hover, #poubelleInventaire:hover {

		background:#A80000;
		
	}   


	/* Ouvrir et fermer l'inventaire RP */
	#ciseauxInventaire.hover, #ciseauxInventaire.selected, #ciseauxInventaire:hover, #poubelleInventaire.hover, #poubelleInventaire.selected, #poubelleInventaire:hover, #statsInventaire.hover, #statsInventaire.selected, #statsInventaire:hover, #stockInventaire.hover, #stockInventaire.selected, #stockInventaire:hover {
		color: #fff;
		background: #A80000;
	}

	/* Valeurs des infos fiche personnag+e */
	#annexe_inventaire .valeur {
		color: #ea7a7a;
		text-align: right;
	}

	/* Icone du travail */
	#zone_travail .icon {
		width: 40px;
		height: 40px;
		background: url(https://i.imgur.com/FOIRcg0.png) 0 0 no-repeat; /* Image travail */
		background-size: contain;
		margin: 2.5px 0;
	}
	   

	/* Boutons de navigation à gauche */
	.grid_head_travail_logement .btn.link.infoAide {
		
		color: #a80000;

	}

	/* Boutons de navigation à gauche Hover */
	.grid_head_travail_logement .btn.link.infoAide.selected, .grid_head_travail_logement .btn.link.infoAide:hover {
		
		background: #A80000;
	}

	/* Bouton accomplissements */
	#zone_quete {
		color:#ea7a7a;
	}

	/* Block accomplissements */
	#acc_carte_content {
	   
		background: rgb(4, 4, 4, 0.9);
		box-shadow: 15px 15px 75px inset #151515, -15px -15px 75px inset #353535;
	   
	}
	#acc_carte {
	   
		box-shadow: 0 0 10px -1px #a80000;
	   
	}
	#acc_actuel .precision {
		font-size: 1rem;
		color: #ea7a7a;
	}


	/* Titre accomplissement */
	#acc_carte_drag .titre1 {

		color: #ea7a7a;

	}

	/* Image BG accomplissement */
	#acc_groupe_1 {
		
		background: url(https://i.imgur.com/hmsdepE.png) 0 0 no-repeat; /* Accomplissement BG image */
		
	}

	/* Accomplissement navigation bouton */
	#acc_carte_drag .accomp.link, #acc_carte_drag .gv_cercle {
		background: url(https://i.imgur.com/79fv4et.png) 0 0 no-repeat; /* accomplissement navigation bouton image */
	}
	#acc_carte_drag .valide, #acc_carte_drag .valide.link {
		background: url(https://i.imgur.com/79fv4et.png) 0 -35px no-repeat; /* accomplissement navigation bouton image */
	}
	.acc_retour{ background: url(https://i.imgur.com/79fv4et.png) 0 0 no-repeat; /* accomplissement navigation bouton image */}

	/* Fermer accomplissement block */
	#acc_carte .close {
	   
		background: url(https://i.imgur.com/gsapO14.png) 0 -78px no-repeat; /* Image boutons */
	}
	.dataBox .close, .dataBox .reduce {
	   
		box-shadow: 0 2rem 1rem 0.5rem inset #a80000;
		
	}
	.dataBox .close:hover{
		box-shadow: 0 2rem 1rem 0.5rem inset #d20e0e;
	}

	.dataBox .close:hover, .dataBox .reduce:hover{
		box-shadow: 0 2rem 1rem 0.5rem inset #d20e0e;
	}

	.dataBox .head {
		border-bottom: 2px solid #2b2a2a;
	}


	/* Fiche travail hierarchie */
	#zone_travail .type0 {
		color: #ea7a7a;
	}

	/* Boutons textes */
	.btnTxt {
	   
		color: #a80000;
		box-shadow: 0 0 4px 1px #a80000;
		-webkit-box-shadow: 0 0 4px 1px #a80000;
	}

	/* Responsive Swiper */
	.swiper-pagination .btn-slider {

		background: #a80000;

	}

	/* Modal */
	.dataBox .head {
		background: linear-gradient(to bottom,#121313 0,#393a3a 100%);
	}
	.dataBox {
	   
		background: #121313;
		box-shadow: inset 0 0 25px 10px #393a3a;
		border: 1px solid #A80000;
		padding: 0;
		transition: padding .15s linear;
	}


	/* Block pilz */
	#compte_premium, #modification_personnage, #pilule_forme, #reassignation_talents {

		background: url(https://i.imgur.com/hpytizs.png) center 0 no-repeat;
		background-size: cover;
		border: 2px solid #d1d1d1;
		box-shadow: 0 0 5px 1px #7c757c, inset 0 0 10px #000;
	}

	/* titre */
	#compte_premium.opened:hover .titre, #modification_personnage.opened:hover .titre, #pilule_forme.opened:hover .titre, #reassignation_talents.opened:hover .titre {
		color: #ea7a7a;
	}
	#compte_premium.opened:hover .titre, #modification_personnage.opened:hover .titre, #pilule_forme.opened:hover .titre, #reassignation_talents.opened:hover .titre {
		color: #ea7a7a;
	}
	#compte_premium:hover .titre, #modification_personnage:hover .titre, #pilule_forme:hover .titre, #reassignation_talents:hover .titre {
		color: #ea7a7a;
	}
	#db_actions_speciales .titre {
		color: #ea7a7a;
		
	}

	/* texte jaune */
	#db_actions_speciales .avantage span, #db_actions_speciales .cout span {
		color: #ea7a7a;
	}

	/* avantages */
	#db_actions_speciales .avantage, #db_actions_speciales .cout {
		color: #dad4d4;
		
	}

	/* retour */
	.backlink {
		width: 20px;
		height: 20px;
		background: url(https://i.imgur.com/gsapO14.png) -73px -78px no-repeat; /* image boutons */
	}

	/* Block gestion logement */
	#gb_informations_batiment .infos {
		
		color: #ea7a7a;
	}

	/* gestion logement boutons */
	#gb_informations_logement .mettre_location {

		background: url(https://i.imgur.com/gsapO14.png) -302px -92px no-repeat; /* image boutons */
	}

	#gb_informations_logement .mettre_vente {

		background: url(https://i.imgur.com/gsapO14.png) -302px -262px no-repeat; /* image boutons */
	}

	#gb_informations_logement .habiter {
		
		background: url(https://i.imgur.com/gsapO14.png) -302px -170px no-repeat; /* image boutons */
	}

	form .bigValidInput {

		background: url(https://i.imgur.com/gsapO14.png) -97px -145px no-repeat; /* image boutons */
	}



	/* LightBox */
	#zone_lightBox .lightBox {
		
		background: linear-gradient(to bottom,rgb(49 49 49) 0,rgb(29 29 29) 20%,rgb(29 29 29) 50%,rgb(41 41 41) 80%,rgb(53 53 53) 100%);
	}


	/* Digicode champtexte */
	form div.digicode .left {
		width: 91px;
		background: url(https://i.imgur.com/71S7GUz.png) 0 -46px no-repeat; /* Champ texte bords */
	}
	form div.cible .left {
		
		background: url(https://i.imgur.com/71S7GUz.png) 0 0 no-repeat; /* Champ texte bords */
	}
	form div.sujet .left {
		width: 70px;
		background: url(https://i.imgur.com/71S7GUz.png) 0 -23px no-repeat; /* Champ texte bords */
	}
	.btn_message_gradient {
	   
		border: 1px solid #790000;
		background: #540000;
		box-shadow: 0 1px 3px 3px #670101;
	   
	}
	.btn_message_gradient:hover {
		border: 1px solid #A80000;
		background: #A80000;
		box-shadow: 0 1px 3px 3px #A80000;
	}

	/* Bouton annuler */
	#zone_lightBox .lightBox .annuler {

		background: url(https://i.imgur.com/gsapO14.png) 0 -122px no-repeat; /* image boutons */
	}

	/* Bouton valider */
	#zone_lightBox .lightBox .valider {

		background: url(https://i.imgur.com/gsapO14.png) 0 -203px no-repeat; /* image boutons */
		
	}

	/* créer un compte bancaire bouton */
	#creer_compte {
		width: 98px;
		height: 23px;
		background: url(https://i.imgur.com/gsapO14.png) 0 -653px no-repeat; /* image boutons */
	}

	/* Consulter un compte bancaire */
	#consulter_compte {
		width: 98px;
		height: 23px;
		background: url(https://i.imgur.com/gsapO14.png) -196px -653px no-repeat; /* image boutons */
	}

	/* fermer compte */
	#fermer_compte {
		width: 98px;
		height: 23px;
		background: url(https://i.imgur.com/gsapO14.png) -98px -653px no-repeat; /* image boutons */
	}

	/* Titre lieu */
	#lieu_actuel .titre1 {
	   
		color: #ea7a7a;

	}

	/* Infos menu place people */
	#infos_menu .book-place .icon {

		background: url(https://i.imgur.com/H9mF1pV.png) 0 -11px no-repeat; /* icones place people */
	}


	#infos_menu .search .icon {
	   
		background: url(https://i.imgur.com/H9mF1pV.png) 0 0 no-repeat; /* icones place people */
	}


	/* Croix fermeture */
	.croix_fermer {

		background: url(https://i.imgur.com/gsapO14.png) 0 0 no-repeat; /* image boutons */
	}

	/* Modal banque */
	#modif_stocks_form {

		background: url(https://i.imgur.com/ghi7CtV.png) 0 0 no-repeat; /* fond liste objets */
	}

	/* Header modal banque */
	#critere_selection .taille1 {
	   
		background: url(https://i.imgur.com/WGkxM6t.png) 0 0 no-repeat; /* fonds */
	}

	/* Boutons header */
	#critere_selection td.selected, #critere_selection td:hover {
		background: url(https://i.imgur.com/L2eNNia.png) repeat-x; /* bouton repeat X */
	}

	/* Fond objets conteneurs banque */
	#liste_stocks .stock {

		background: url(https://i.imgur.com/kpaXlEB.png) 0 0 no-repeat; /* fond objets stock */
	}

	/* Conteneur */
	.zone_conteneurs_displayed .conteneur .conteneur_content {
		background-color: rgb(43, 43, 43, 0.9);
		border: 1px solid #fff;
		box-shadow: 0 0 3px inset #9a0909, 0 0 5px #730a0a;
	}

	/* modal banque : annuler */
	#modif_stocks_form .annuler {

		background: url(https://i.imgur.com/gsapO14.png) 0 -99px no-repeat; /* image boutons */
	}

	/* compteur */
	form .counter {

		background: url(https://i.imgur.com/i23wDA3.png) 0 -16px repeat-x; /* compteur */
	}
	form .counter .decor1 {

		background: url(https://i.imgur.com/i23wDA3.png) 0 0 no-repeat; /* compteur */
	}
	form .counter .btnUp {

		background: url(https://i.imgur.com/i23wDA3.png) -2px 0 no-repeat; /* compteur */
	}
	form .counter .btnDown {

		background: url(https://i.imgur.com/i23wDA3.png) -2px -8px no-repeat; /* compteur */
	}

	/* Menu actions */
	#combat_menu div svg, #zone_actions div svg {
		stroke: #a80000;
		background: #4a0000;
		border: 1px solid #a80000;
		fill: #dad4d4;
	}

	/* Menu actions */
	#combat_menu div svg, #zone_actions:hover div:hover svg {
		stroke: #a80000;
		background: #a80000;
		border: 1px solid #a80000;
		fill: #dad4d4;
	}


	/* Bouton actif */
	#combat_menu>div.active>svg, #zone_actions>div.active>svg {
		border: 1px solid #a80000;
		background: #a80000;
		fill: #fff;
	}


	/* Scrbollbar*/
	div::-webkit-scrollbar-thumb, form::-webkit-scrollbar-thumb, ul::-webkit-scrollbar-thumb {
		background: #d09f9f;
	}
	div::-webkit-scrollbar-track, form::-webkit-scrollbar-track, ul::-webkit-scrollbar-track {
		background: #c4c5c5;
	}

	/* InfoBulle */
	span.notif-number {
		background: #ea7a7a;
	}


	/* Interface vitrine */
	#interface_achat.colorize {
		background-color: rgb(36, 37, 37, 0.9);
		border-bottom: 1px solid #424242;
	}

	/* boutique RP */
	#zone_cases_achat .boutique_rp {
	   
		background: #2d2d2d;
	}

	/* Interface stock boutique */
	#stocks_mise_en_vente {
		top: 0;
		left: 0;
		width: 153px;
		height: 413px;
		background: url(https://i.imgur.com/z5dkP0k.png) 0 0 no-repeat; /* fond stock mev */
		background-size: contain;
		padding: 30px;
		box-sizing: border-box;
	}


	/* bouton annuler */
	.annuler {

		background: url(https://i.imgur.com/gsapO14.png) -266px -418px no-repeat; /* image boutons */
	}
	#stocks_mise_en_vente .annuler {
	  
		background: url(https://i.imgur.com/gsapO14.png) 0 -99px no-repeat; /* image boutons */
	}

	/* Page précédente */
	#stocks_mise_en_vente .pagePrec {
	   
		background: url(https://i.imgur.com/gsapO14.png) -394px 0 no-repeat; /* image boutons */
	}

	/* page suivante */
	#stocks_mise_en_vente .pageSuiv {
		
		background: url(https://i.imgur.com/gsapO14.png) -393px -46px no-repeat; /* image boutons */
	}

	/* interface terminal : hover lignes */
	#page_gestion .menu:hover .intitule, #page_gestion .menu:hover .label{
		
		color:#ea7a7a;
	}

	/* menu interface terminal */
	#entreprise_selecteur .label {
		color: #ea7a7a;
	}

	/* Icone Local */
	#selecteur_local .icone {
		
		background: url(https://i.imgur.com/mv05KKZ.png) -14px 0 no-repeat; /* icones image */
	}

	/* gestion icone */
	#selecteur_gestion .icone {
		width: 14px;
		height: 13px;
		background: url(https://i.imgur.com/mv05KKZ.png) 0 0 no-repeat; /* icones image */
	}

	/* postes icone */
	#selecteur_postes .icone {
		
		background: url(https://i.imgur.com/mv05KKZ.png) -28px 0 no-repeat; /* icones image */
	}

	/* stocks icone */
	#selecteur_stocks .icone {

		background: url(https://i.imgur.com/mv05KKZ.png) -42px 0 no-repeat; /* icones image */
	}

	/* statistiques icone */
	#selecteur_stats .icone {

		background: url(https://i.imgur.com/mv05KKZ.png) -56px 0 no-repeat; /* icones image */
	}

	/* Entreprise infos générales label */
	.entreprise_infos_generales .type1 {
		color: #ea7a7a;
	}

	/* Infos batiment angle 4 */
	.entreprise_infos_generales .angle4 {

		background: url(https://i.imgur.com/1RqvwRE.png) 0 0 no-repeat; /* fond buiolding actions */
	}

	/* Infos batiment angle 3 */
	.entreprise_infos_generales .angle3 {
	   
		background: url(https://i.imgur.com/1RqvwRE.png) -10px 0 no-repeat; /* fond buiolding actions */
	}

	/* Infos batiment angle 2 */
	.entreprise_infos_generales .angle2 {
	   
		background: url(https://i.imgur.com/1RqvwRE.png) -30px 0 no-repeat; /* fond buiolding actions */
	}

	/* Infos batiment angle 1 */
	.entreprise_infos_generales .angle1 {
	   
		background: url(https://i.imgur.com/1RqvwRE.png) -20px 0 no-repeat; /* fond buiolding actions */
	}

	/* Interface local hover lignes */
	#page_local_actions li:hover{
		color:#ea7a7a;
	}
	#page_local_actions li:hover .small{
		color:#ea7a7a;
	}

	/* interface postes hover lignes */
	#page_postes_actions li:hover{
		color:#ea7a7a;
	}
	#page_postes_actions li:hover .small{
		color:#ea7a7a;
	}

	/* interface stocks hover lignes */
	#page_stocks_actions li:hover{
		color:#ea7a7a;
	}
	#page_stocks_actions li:hover .small{
		color:#ea7a7a;
	}


	/* Bouton terminer stock */
	#modif_stocks_form .terminer {
		
		background: url(https://i.imgur.com/gsapO14.png) 0 -203px no-repeat; /* image boutons */
	}

	/* tableau stock type 1 */
	#liste_stocks table .type1 {
		color: #ea7a7a;
	}

	/* bulle actions */
	#menu_actions .action_perso .inset_action_perso {
	   
		border: 1px solid #a80000;
		background: -moz-linear-gradient(to bottom,rgb(109 2 2) 0,rgb(111 2 2) 45%,rgb(86 2 2) 55%,rgb(72 0 0) 100%);
		background: -webkit-linear-gradient(to bottom,rgb(109 2 2) 0,rgb(111 2 2) 45%,rgb(86 2 2) 55%,rgb(72 0 0) 100%);
		background: linear-gradient(to bottom,rgb(109 2 2) 0,rgb(111 2 2) 45%,rgb(86 2 2) 55%,rgb(72 0 0) 100%);
	}

	/* infobox content */
	#infoBox, .infoBoxFixed {
	   
		background-color: rgb(39, 39, 39, 0.9);
	}
	.conteneur_content_inlight::after, .conteneur_content_inlight::before {
		box-shadow: 0 0 2px 1px #fff, 0 0 4px 1px #a80000;
	}

	/* Atelier de réparation fond */
	#atelier_form {
	   
		background: url(https://i.imgur.com/FAllMR5.png) 0 0 no-repeat; /* fond technopole image */
	}


	/* Bouton valider atelier */
	#atelier_form .valider {
		position: absolute;
		top: 193px;
		left: 43px;
		width: 138px;
		height: 32px;
		background: url(https://i.imgur.com/gsapO14.png) 0 -937px no-repeat; /* image bouton */
	}

	/* bouton retour */
	#atelier_form .retour {
		
		background: url(https://i.imgur.com/gsapO14.png) 0 -122px no-repeat; /* image bouton */
	}


	/* cases meubles */
	#zone_dataBox .meuble_inventaire .case_objet.linkBox_vide {
	   
		border: 4px dashed #964e4e;
		
	}


	/* centrale fond */
	#zone_dataBox .onglets .nav_elts {
		
		background: rgb(74, 1, 1, 0.3);
		
	   
	}

	/* header centrale */
	#zone_dataBox .onglets .navigation li.selected, #zone_dataBox .onglets .navigation li:hover {
		
		background: #710101;
		
	}
	#zone_dataBox .onglets .navigation li {
	   
		background: #2d0101;
		
	}

	/*rewardbox */
	#zone_rewardBox .header {
		z-index: 1;
		width: 435px;
		height: 116px;
		background: url(https://i.imgur.com/9YYk3T2.png) 0 0 no-repeat; /* fond rewardbox */
	}


	/*reward box texte */
	#zone_rewardBox .small .data1 {
	  
		color: #ea7a7a;
	}
	#zone_rewardBox .competences {

		background: url(https://i.imgur.com/uqtr7Wt.png); /*box 8 fond 0 */
	}
	#zone_rewardBox .footer {
	   
		background: url(https://i.imgur.com/9YYk3T2.png) -435px 0 no-repeat; /* fond rewardbox */
	}
	#zone_rewardBox .footer .close {
	   
		background: url(https://i.imgur.com/gsapO14.png) -194px -845px no-repeat; /* image boutons */
	}


	/* EVIL BOX */
	.evilBox {
		
		background-color: #0e0000;
		border: 1px solid #560000;
	}
	.evilBox .titre {
		color: #ea7a7a;
		
	}
	.evilBox .action {
		color: #ea7a7a;
		
	}

	/* zone messagerie */
	#zone_droite>.grid>.grid.top {
		
		background: url(https://i.imgur.com/RKyPOow.png) 0 0 no-repeat;
		background-size: contain;
	   
	}

	/* icones messagerie et carnet */
	#zone_carnet .icon svg, #zone_messagerie .icon svg {
		fill:#dad4d4;
		
	}

	/* boutons messagerie */
	#zone_carnet .btnTxt, #zone_carnet .infoAide, #zone_messagerie .btnTxt {
		
		color: #A80000;
		
	}

	/* boutons messagerie */
	#zone_carnet .btnTxt:hover, #zone_carnet .infoAide:hover, #zone_messagerie .btnTxt:hover {
		
		background: #A80000;
		
	}
	#zone_carnet .btnTxt.selected, #zone_carnet .btnTxt:hover, #zone_carnet .infoAide:hover, #zone_messagerie .btnTxt.selected, #zone_messagerie .btnTxt:hover {
		color: #fff;
		background: #A80000;
	}

	/* Couleur hover messages */
	#liste_adresses .content li:hover, #liste_adresses .content li:hover .couleur5, #liste_contacts .content li:hover, #liste_contacts .content li:hover .couleur5, #liste_messages .content li:hover, #liste_messages .content li:hover .couleur5 {
		color: #ea7a7a;
	}
	#action_list li:hover, #adresse_action_list li:hover, #adresse_folder_list li.selected, #adresse_folder_list li:hover, #contact_action_list li:hover, #contact_folder_list li.selected, #contact_folder_list li:hover, #folder_list li.selected, #folder_list li:hover {
		color: #ea7a7a;
	}

	/* fond contenu message */
	.dataBox .message .contenu {
		
		background: rgb(0 0 0 / 30%);
		color:#dab7b7;
		
	}

	/* liste messages */
	.dataBox .message .zone_conversation .conversation.selected, .dataBox .message .zone_conversation .conversation:hover {
		background: #710101;
	}
	.dataBox .message .zone_conversation .conversation {

		background: #1d0000;
		border-bottom: 1px solid #7b0101;
		padding-top:5px;
		padding-bottom:5px;
	}

	.dataBox .message .zone_conversation .conversation .ligne2 {
		position: absolute;
		bottom: 5px;
		left: 3px;
		font-size: 10px;
		color: #dad4d4;
	}

	.dataBox .message .zone_conversation .conversation .ligne1 {
		
		color: #a96262;
	}

	/* Fond tchat */
	#zone_chat_bg {
		
		background: url(https://i.imgur.com/WalaHUg.png) 0 0 no-repeat; /* fond interface 3 chat */
		background-size: cover;
		box-shadow: 0 0 15px -5px inset #a80000;
	   
	}

	/* Tchat icon */
	#zone_chat .icon {
	   
		background: url(https://i.imgur.com/avGvQ2j.png) -184px 0 no-repeat;
		
	}

	#zone_chat #onglets_chat li.selected {
		color: #A80000;
		background: #fff;
	}

	/* Bprder tchat */
	#zone_chat #onglets_chat {
		
		border-bottom: 1px solid #610000;
	   
	}
	#zone_chat .connectes {
		
	  border-bottom: 1px solid #610000;
	}

	/* Personnages présents */
	#zone_chat .connectes span:not(.couleur5) {
		
		color:#ea7a7a;
	}
	#chat_preview .chatContent, #zone_chat .zone_infos {
		color:#ea7a7a;
	}

	/* formulaire tchat */
	#chatForm .text_chat {
		border: none;
		background: 0 0;
		color: #dad4d4;
		width: 80%;
		padding: 3px;
		box-sizing: border-box;
		font-size: 1rem;
	}
	#chatForm {
	   
		border: 1px solid #b77070 !important;
		background:#130000;
	   
	}
	#chatForm .text_mode {
		border-left: 1px solid #b77070 !important;
		color: #b77070;
		width: 9%;
		margin-top: 1px;
	}
	#chatForm .text_valider {
		background: #8c0202 !important;
		color: #FFFFFF;
		width: 10%;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		border: 1px solid #b77070;
		border-width: 0 0 0 1px;
		display: grid;
		font-size: 18px;
	}
	#chatForm .text_valider:hover {
		background: #A80000 !important;
		color: #FFFFFF;
	   
	}

	.couleur6 {
		color: #ea7a7a;
	}

	#chat_preview {
		
		background: url(https://i.imgur.com/WalaHUg.png) 0 0 no-repeat; /* fond interface chat 3*/
	   background-size: cover;
		border-Top: 1px solid #a80000;
		box-shadow: 0 0 10px 2px inset #a80000;
	}

	.linka, a {
		text-decoration: none;
		color: #ea7a7a;
	}

	.linka, a:hover {
		text-decoration: none;
		color: #FFFFFF;
	}

	form .longSelectInput .right, form .mediumSelectInput .right, form .variableSelectInput .right {
		position: absolute;
		top: 0;
		right: -3px;
		width: 36px;
		height: 23px;
		background: url(https://i.imgur.com/DT0ZZpg.png) -10px 0 no-repeat; /*champ select bord 1 */
	}

	/* Interface des tickets */
	#db_feedbacks .billet.selected, #db_feedbacks .billet.voted {
		border: 1px solid #a80000;
	}

	#db_feedbacks .billet {
	   
		border: 1px solid #670000;
		
	}

	#db_feedbacks .billet:hover {
	   
		border: 1px solid #a80000;
		
	}

	#feedback_billets, #feedback_popular {
		border: 1px solid #670000;
	}

	#db_feedbacks .repondre {
		width: 35px;
		height: 35px;
		background: url(https://i.imgur.com/gsapO14.png) -194px -138px no-repeat; /* image boutons */
	}


	.couleur2 {
		color: #acacad;
	}

	.couleur2:hover {
		color: #ea7a7a;
	}

	#ingame #bandeau .link:hover, #ingame #bandeau .news a:hover {
		color: #ea7a7a;
	}

	#zone_dataBox .cercle_dashboard .nav_elts {
	   
		background: rgb(0 0 0 / 30%);
		
	}

	#zone_dataBox .cercle_dashboard .encart {
	  
		background: rgb(0 0 0 / 30%);
	}

	#zone_dataBox .cercle_dashboard .navigation li.selected, #zone_dataBox .cercle_dashboard .navigation li:hover {
	   
		background: #115f73;
	   
	}

	#zone_dataBox .cercle_dashboard .navigation li.selected, #zone_dataBox .cercle_dashboard .navigation li:hover {
	   
		background: #750202;
		border-top: 1px solid #888;
		border-right: 1px solid #888;
		border-left: 1px solid #888;
	   
	}

	#zone_dataBox .cercle_dashboard .navigation {
	   
		border-bottom: 1px solid #a80000;
	}

	#zone_dataBox .cercle_dashboard .navigation li {
		
		background: #2b2b2b;
		
	}

	#zone_dataBox .cercle_dashboard .membres .elt_liste_personnage .infos .link.couleur5 {
	   
		color: #ea7a7a;
	}

	.heal .actions, .transfert .actions {
		
		background-color: rgb(64, 0, 0, 0.9);
		
	}

	#batiment_gestion {
	   
		background: rgb(4, 4, 4, 0.3);
		border: 1px solid #666;
		
	}

	#menu_actions .action_perso {
	   
		background: url(https://i.imgur.com/Ly5UktQ.png) no-repeat; /* btn actions image */
		
	}

	#zone_dataBox .cercle_dashboard .historique .canWriteWall {
		background: rgb(0, 0, 0, 0.3);
		border: 1px solid #A80000;
		border-radius: 5px;
	}

	#zone_dataBox .cercle_dashboard .membres .elt_liste_personnage:hover{
		
		background:#5d0000;
	}

	.detruire {
		width: 98px;
		height: 23px;
		background: url(https://i.imgur.com/gsapO14.png) -198px 0 no-repeat; /* image boutons */
	}

	form .longSelectInputOptions, form .mediumSelectInputOptions, form .variableSelectInputOptions {
	   
		background: #212121;
	   
	}

	form .longSelectInputOptions div.type1, form .mediumSelectInputOptions div.type1, form .variableSelectInputOptions div.type1 {
		padding: 1px 10px;
		color: #ea7a7a;
		font-variant: small-caps;
	}

	form .mediumSelectInputOptions span.bas {
	   
		background: url(https://i.imgur.com/DT0ZZpg.png) -82px 0 no-repeat; /* champ select 1 bords */
	}

	.acheter {
		width: 84px;
		height: 23px;
		background: url(https://i.imgur.com/gsapO14.png) -98px -405px no-repeat;
	}

	#gestion_poste .poste .decor1 {
		
		background: url(https://i.imgur.com/IKw1s5N.png) 0 -37px repeat-x; /* fond repeat barre verte */
	}

	#gestion_poste .poste .decor2 {
	   
		background: url(https://i.imgur.com/IKw1s5N.png) 0 0 repeat-x; /* fond repeat barre verte */
	}

	#gestion_poste .poste .decor3 {
	   
		background: url(https://i.imgur.com/IKw1s5N.png) -9px 0 repeat-x; /* fond repeat barre verte */
	}

	#gestion_poste .disponible {
	   
		color: #333131;
		
	}

	#gestion_poste .type4 .croix {
		top:0px;
		color: #540000;
	   
	}

	#gestion_poste .poste .icone_1 {
	   
		background: url(https://i.imgur.com/mv05KKZ.png) 0 -58px no-repeat; /* icones image */
	}

	#gestion_poste .poste .icone_2 {
		
		background: url(https://i.imgur.com/mv05KKZ.png) 0 -58px no-repeat; /* icones image */
	}

	#gestion_poste .budget .fond, #gestion_poste .employe .fond {

		background: url(https://i.imgur.com/IKw1s5N.png) 0 -45px repeat-x; /* fond repeat barre verte */

	}

	.smallTip {
	   
		background: url(https://i.imgur.com/RVmzbUR.png) 0 0 no-repeat; /* boxe 1 */
	}

	.fouiller {
	   
		background: url(https://i.imgur.com/gsapO14.png) -294px -653px no-repeat;
	}

	#combat_carte #cadre_position, #zone_carte #carte #cadre_position {
	   
		background: url(https://i.imgur.com/U9ieyBE.png) center center no-repeat; /* Cadre cadre */
	}

	#acheter_habitation {
	   
		background: url(https://i.imgur.com/gsapO14.png) -98px -405px no-repeat; /* image boutons */
	}

	#vendre_habitation {
		
		background: url(https://i.imgur.com/gsapO14.png) -182px -418px no-repeat; /* image boutons */
	}

	#liste_stocks .acheter {
		
		background: url(https://i.imgur.com/gsapO14.png) -202px -464px no-repeat; /* image boutons */
	}

	#ameliorer_terrain {
		
		background: url(https://i.imgur.com/gsapO14.png) -198px -46px no-repeat; /* image boutons */
	}

	#customisation_form {
		
		background: url(https://i.imgur.com/FAllMR5.png) 0 0 no-repeat; /* fond technopole */
	}

	#customisation_form .retour {
		
		background: url(https://i.imgur.com/gsapO14.png) 0 -122px no-repeat; /* image boutons */
	}

	#liste_customisation_container .amelioration.active {
		border: 1px solid #a80000;
	}

	#critere_selection .taille2 {
	   
		background: url(https://i.imgur.com/WGkxM6t.png) 0 -29px no-repeat; /* fonds */
	}

	#liste_stocks .infos_batiment .nom {
		
		color: #ea7a7a;
	}

	#liste_stocks .icon_etat.etat3 {
		background: url(https://i.imgur.com/mv05KKZ.png) -179px 0 no-repeat; /* icones */
	}

	#liste_stocks .icon_renforcement {
	   
		background: url(https://i.imgur.com/mv05KKZ.png) -166px 0 no-repeat; /* icones */
	}

	#liste_stocks .icon_camera {
	   
		background: url(https://i.imgur.com/mv05KKZ.png) -153px 0 no-repeat; /* icones */
	}

	#liste_stocks .icon_digicode {
	   
		background: url(https://i.imgur.com/mv05KKZ.png) -140px 0 no-repeat; /* icones */
	}

	#louer_habitation {
	   
		background: url(https://i.imgur.com/gsapO14.png) -118px -464px no-repeat; /* image boutons */
	}

	#combat_carte, #zone_carte #carte {
		
		border: 1px solid #a80000;
	}

	.dataBox .minimize {
	   
		background: url(https://i.imgur.com/gsapO14.png) -154px 0 no-repeat; /* image boutons */
	}

	form .mediumValidInput {
	   
		background: url(https://i.imgur.com/VLhlgKV.png) 0 0 no-repeat; /* btn validation */
	}

	.carte_secteur .mapList .listes .titre1 {

		color: #ea7a7a;

	}

	#action2 {
		
		background: url(https://i.imgur.com/IRqycvl.png) 0 0 no-repeat; /* map_actions_bouton1 */
		
	}

	#action1 {
	   
		background: url(https://i.imgur.com/IRqycvl.png) 0 0 no-repeat; /* map_actions_bouton1 */

	}

	#action3 {

		background: url(https://i.imgur.com/IRqycvl.png) 0 0 no-repeat; /* map_actions_bouton1 */

	}

	#db_mes_achats1 .objets_premium .nb_pilules {
		background: #4e0000;
	}

	form .radio .radioInput {
		
		background: url(https://i.imgur.com/gsapO14.png) 0 -168px no-repeat; /* image boutons */
	`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
