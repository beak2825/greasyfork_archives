// ==UserScript==
// @name        Tout_MZ
// @namespace   MH
// @description Client MountyZilla
// @include     */mountyhall/*
// @exclude     *trolls.ratibus.net*
// @exclude     *it.mh.raistlin.fr*
// @exclude     *mh2.mh.raistlin.fr*
// @exclude     *mhp.mh.raistlin.fr*
// @exclude     *mzdev.mh.raistlin.fr*
// @version     1.3.0.97
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/447163/Tout_MZ.user.js
// @updateURL https://update.greasyfork.org/scripts/447163/Tout_MZ.meta.js
// ==/UserScript==

// vérif UTF-8 ş

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

try {
var MZ_changeLog = [
"V1.3.0.97 18/06/2022",
"   Fix tableau de Fatigue et AM dans certains cas",
"V1.3.0.96 18/04/2022",
"   Ajout de la gestion des portails pour SCIZ",
"V1.3.0.95 16/04/2022",
"   Corrections du cas de soit-même dans la vue pour SCIZ",
"V1.3.0.94 22/03/2022",
"   Fix message quand la réserve de temps de tour est exactement 0",
"V1.3.0.93 20/02/2022",
"   Ajout guilde et mention 'HORS VUE' pour les trolls de la coterie SCIZ",
"V1.3.0.92 29/01/2022",
"   modif suite à changement MH sur les CdM",
"V1.3.0.91 16/01/2022",
"   Correction BM vue, PVMax en %",
"V1.3.0.89 05/01/2022",
"   Corrections variées pour SCIZ",
"V1.3.0.88 01/01/2022",
"   Fix cacher les gowaps au même niveau",
"V1.3.0.87 01/01/2022",
"   Adaptation aux modifs MH pages des suivants",
"V1.3.0.86 31/12/2021",
"   Corrections pour SCIZ",
"V1.3.0.85 31/12/2021",
"   Amélioration du support SCIZ (trolls cachés ou hors-vue)",
"V1.3.0.84 29/12/2021",
"   Corrections pour SCIZ",
"V1.3.0.83 29/12/2021",
"   Amélioration du support SCIZ (bestiaire, champignons et pièges)",
"V1.3.0.82 14/11/2021",
"	fix nom monstre marqué avec un nombre",
"V1.3.0.81 14/11/2021",
"	fix CdM sans date dans les messages du bot",
"V1.3.0.80 20/10/2021",
"	fix plantage à l'affichage du profil publique en cas de CSS avancé",
"V1.3.0.79 14/07/2021",
"	Correction effet venin GdS",
"V1.3.0.78 17/06/2021",
"	Correction affichage des trésors en vue externe",
"V1.3.0.77 23/04/2021",
"	Ajout d'une icône pour les monstres qui volent (=lévitent)",
"V1.3.0.76 23/03/2021",
"	Correction pour SCIZ (surcharge des événements)",
"V1.3.0.75 11/03/2021",
"	Masquer en vue externe les monstres masqués dans la vue",
"V1.3.0.74 18/01/2021",
"	Support ancien Firefox",
"V1.3.0.73 15/01/2021",
"	Adaptation à Dist H/V MH",
"V1.3.0.72 11/01/2021",
"	Correction de la vue des trolls avec SCIZ",
"V1.3.0.71 11/01/2021",
"	Amélioration du support SCIZ (Vue trolls)",
"V1.3.0.70 08/01/2021",
"	adaptation vue externe dist H/V",
"V1.3.0.69 25/12/2020",
"	Fix (tentative) message d'erreur sur armM_phy dans la vue",
"V1.3.0.68 10/12/2020",
"	Limitation vue externe",
"V1.3.0.66 07/12/2020",
"	Options en mode smartphone",
"V1.3.0.65 30/11/2020",
"	Fix mémorisation des missions (donc cibles plus affichées) + fix filtre en mode smartphone",
"V1.3.0.63 20/11/2020",
"	Ajout du calcul de la marge de temps de tour dans le profil (nommé marge ou augmentation)",
"V1.3.0.60 16/11/2020",
"	Vue externe en mode smartphone",
"V1.3.0.59 08/11/2020",
"	Adaptation page Bonus-Malus",
"V1.3.0.58 01/11/2020",
"	Remplacement CONST par VAR dans SCIZ",
"V1.3.0.57 30/10/2020",
"	Fix mouches présentes",
"V1.3.0.56 08/10/2020",
"	Retour de la carte des suivants",
"V1.3.0.55 05/09/2020",
"	Ajout compte à rebours de DLA",
"V1.3.0.54 28/08/2020",
"	Supprime le déplacement de la page de vue au survol de la souris du titre \"INFORMATIONS\"",
"V1.3.0.53 20/07/2020",
"	Correction de la vue smartphone",
"V1.3.0.51 23/06/2020",
"	Correction de la vue",
"V1.3.0.47 23/06/2020",
"	Correction blessure",
"V1.3.0.46 23/06/2020",
"	Adaptation réserve de temps",
"V1.3.0.45 17/06/2020",
"	Pas de reset (erroné ?) fatigue en affichage profil",
"V1.3.0.44 13/06/2020",
"	Remplacement CONST par VAR à cause de IOS (bug ?)",	// voir https://stackoverflow.com/questions/37228892/why-is-my-javascript-not-working-correctly-in-strict-mode-on-safari
"V1.3.0.43 11/06/2020",
"	Affichage callstack en erreur profil",
"V1.3.0.42 18/05/2020",
"	Amélioration du support SCIZ (Mise en option des fonctionnalités)",
"V1.3.0.41 15/05/2020",
"	Amélioration du support SCIZ (Vie des trolls de la coterie)",
"V1.3.0.40 13/05/2020",
"	Correction ARM dans le cas d'un grosse perte pour le tour",
"V1.3.0.39 08/05/2020",
"	Correction erreur sur le profil en mode smartphone",
"V1.3.0.38 25/04/2020",
"	Amélioration du support SCIZ (Gestion des trésors cachés)",
"V1.3.0.37 19/04/2020",
"	Suite travail sur l'envoi de CdM en mode smartphone",
"V1.3.0.36 20/04/2020",
"	Amélioration du support SCIZ (Icônes pour les événements !)",
"V1.3.0.35 19/04/2020",
"	Ignorer l'absence de date/heure des CdM et gestion smartphone",
"V1.3.0.33 14/04/2020",
"	Correction fausse reconnaissance de CdM sur les autres compétences",
"V1.3.0.32 14/04/2020",
"	Adaptation page des ordres des suivant + [état et callback] pour les scripts tiers (voir doc sur le mot clef MZ_callback_init)",
"V1.3.0.31 22/03/2020",
"	Envoi des CdM à partir du message du Bot",
"V1.3.0.30 22/03/2020",
"	Amélioration du support SCIZ (Trésors dans la vue !)",
"V1.3.0.29 14/03/2020",
"	Fix calcul PV après blessure en cas de maxPV inconnu",
"V1.3.0.28 13/03/2020",
"	Fix la détection incohérence CdM et affichage en rouge",
"V1.3.0.27 20/02/2020",
"	Ajout de la probabilité de toucher avec Lancer de Potion dans la Vue",
"V1.3.0.26 08/02/2020",
"	Lisibilité CdM en mode smartphone",
"V1.3.0.25 07/02/2020",
"	Adaptation basique au profil modifié",
"V1.3.0.23 30/01/2020",
"	Correction affichage filtre monstre",
"V1.3.0.22 23/01/2020",
"	Re-adaptation re-modif MH (affichage des durées négatives)",
"V1.3.0.21 21/01/2020",
"	Adaptation à une modif MH dans la page des suivants",
"V1.3.0.20 21/01/2020",
"	Adaptation modif MH (affichage des durées négatives)",
"V1.3.0.19 19/01/2020",
"	Centralisation des éléments tactiques",
"V1.3.0.18 19/01/2020",
"	Correctif pour les icônes d'action à distance dans la vue",
"V1.3.0.17 16/01/2020",
"	Correctif pour le recall du filtre des Monstres",
"V1.3.0.16 10/01/2020",
"	Amélioration du support SCIZ (Fix sur le prettyprint)",
"V1.3.0.15 10/01/2020",
"	Amélioration du support SCIZ (Fix sur les événements de zone)",
"V1.3.0.14 06/01/2020",
"	Correction filtre par famille pour les monstres variables et sans cdm",
"V1.3.0.13 06/01/2020",
"	Ajout du filtre sur la famille des monstres",
"V1.3.0.12 28/12/2019",
"	Fixed bug fix pour SCIZ (JWT)",
"V1.3.0.11 28/12/2019",
"	Bug fix pour SCIZ (JWT)",
"V1.3.0.10 22/12/2019",
"	Corrections mineures pour SCIZ",
"V1.3.0.9 19/12/2019",
"	Amélioration du support SCIZ (Fixes + AdvancedCSS + SwitchEvent)",
"V1.3.0.8 16/12/2019",
"	Amélioration du support SCIZ (Fixes + Play_evenement + PJView_Events)",
"V1.3.0.7 12/12/2019",
"	correction cibles des missions 'famille', 'pouvoir' et cas particulier de 'race'",
"V1.3.0.6 11/12/2019",
"	suppression infobulle sur l'intervalle de confiance s'il n'y en a pas, correction affiche de l'heure dernière CdM, plus de debug en profil de monstre",
"V1.3.0.5 11/12/2019",
"	Première interconnexion avec SCIZ (Options + MonsterView)",
"V1.3.0.4 29/11/2019",
"	Ajout des déciles",
"V1.3.0.3 29/11/2019",
"	Affichage d'une icône pour les Phœnix dont la génération est connue",
"V1.3.0.2 24/11/2019",
"	Réduction taille info CdM",
"V1.3.0.1 22/11/2019",
"	Ajustements sur les infos tactiques",
"V1.3.0 15/11/2019",
"	Refonte calculs tactiques de la vue - beta",
"V1.2.20.6 09/11/2019",
"	Correction de la formule d'AdD dans le profil",
"V1.2.20.5 16/10/2019",
"	Mutualisation analyse ordres suivants MZ_analyse_page_ordre_suivant",
"V1.2.20.4 03/10/2019",
"	Adaptation modif MH de la page des suivants",
"V1.2.20.3 02/09/2019",
"	Compétence golem vers l'anatroliseur",
"V1.2.20.2 25/05/2019",
"	Gestion des Parasitus pour les missions",
"V1.2.20.1 25/05/2019",
"	Correction de la cible en cas de mission demandant un kill de Crasc + message d'alerte en cas de fumeux",
"V1.2.20.0 25/05/2019",
"	Adaptation aux modifications des CdM par MH",
"V1.2.19.2 16/04/2019",
"	Correction majuscules dans les talents",
"V1.2.19.1 14/04/2019",
"	Prise en compte des nouvelles AdX dans profil2",
"V1.2.18.15 29/03/2019",
"	Correction simple quote dans toutes les missions",
"V1.2.18.14 09/03/2019",
"	Correction affichage vues 2D externes suite à une modif MH",
"V1.2.18.13 27/02/2019",
"	Correction simple quote dans les familles de monstre des missions",
"V1.2.18.12 23/12/2018",
"	Message si \"Menu d'actions contextuelles\" est décoché",
"V1.2.18.11 21/11/2018",
"	Correction it bricol'troll, login avec accent",
"V1.2.18.10 08/08/2018",
"	Correction boulette sDiplo",
"V1.2.18.09 04/08/2018",
"	Protection contre diplomatie mal initialisée",
"V1.2.18.08 11/07/2018",
"	Correction pour fonctionnement hors GM",
"V1.2.18.07 18/05/2018",
"	prise en compte bonus magique d'esquive dans le profil, correction gestion de la souris dans la page d'équipement [Dabihul, welcome back]",
"V1.2.18.06 28/01/2018",
"	Protection malus Crasc sans durée",
"V1.2.18.05 18/11/2017",
"	Désactivation MZ V2 en mode dev pour les tests d'adaptation violentmonkey",
"V1.2.18.04 04/09/2017",
"	retour version 1.2.18.02 avec GM 3.17",
"V1.2.18.03 01/09/2017",
"	Désactivation de GM_setValue/getValue à cause d'une lenteur sur GM 3.16",
"V1.2.18.02 26/08/2017",
"	correction boulette sur le compos d'enchantement",
"V1.2.18.01 25/08/2017",
"	Suppression des messages sur les certificats en https",
"	Protection contre des erreurs dans le stockage des compos d'enchantement",
"V1.2.17.19 23/08/2017",
"	Possibilité de plusieurs IT Bricol'Troll",
"V1.2.17.18 22/08/2017",
"	Adaptation compétence 'travail de la pierre' (dont anatrolliseur)",
"	Accélération de l'affichage des niveaux si plus de 500 monstres",
"V1.2.17.17 16/07/2017",
"	modification du mécanisme de filtrage pour contourner un pb",
"V1.2.17.16 16/07/2017",
"	Ajout de messages de debug sur les retours AJAX",
"V1.2.17.15 15/07/2017",
"	modification du mécanisme de filtrage pour contourner un pb",
"V1.2.17.14 14/07/2017",
"	correction dans la gestion des étapes de mission",
"V1.2.17.13 12/07/2017",
"	Adaptation au déplacement des colonnes dans la vue des Trõlls",
"V1.2.17.12 16/06/2017",
"	Correction mauvais compte de PX quand on change de Trõll",
"V1.2.17.11 01/05/2017",
"	Travail sur le fonctionnement hors Greasemonkey",
"V1.2.17.10 30/04/2017",
"	Protection dans la récupération d'erreur",
"V1.2.17.9 30/04/2017",
"	Correction récupération d'erreur IT Bricol'Troll",
"V1.2.17.8 29/04/2017",
"	Correction Bonus/Malus cas +0\+10 (AE)",
"	Correction portée IdC",
"	Prise en compte du bonus de portée PM dans le calcul tactique",
"V1.2.17.7 26/04/2017",
"	Version compatible hors GreaseMonkey",
"V1.2.17.6 23/04/2017",
"	Correction gestion des missions en cas de réinstallation",
"V1.2.17.5 20/04/2017",
"	Correction de la récupération du niveau du Trõll pour le calcul des PX",
"V1.2.17.4 08/04/2017",
"	Affichage triangle camou/invi pour les Trõlls de l'IT vus (sous VlC)",
"	Adaptation de la diplomatie à une modification de la page MH",
"V1.2.17.3 04/04/2017",
"	Messages console en cas de cadre d'erreur",
"	Trolls de l'IT mais pas dans le vue en orange",
"V1.2.17.2 20/03/2017",
"	Correction des PV restants",
"V1.2.17.1 20/03/2017",
"	Blocage des PV restants en attendant résolution de bug",
"V1.2.17 19/03/2017",
"	Refonte de l'envoi des CdM",
"	Modification de l'analyse de la frame de gauche (suite modification MH)",
"V1.2.16.4 08/03/2017",
"	correction ID de troll en envoi de PX/MP",
"V1.2.16.3 27/02/2017",
"	correction bonus/malus FP",
"V1.2.16.2 24/02/2017",
"	corrige bug des cases à cocher qui n'étaient plus mémorisées",
"V1.2.16.1 21/02/2017",
"	corrige bug sur Fx 38.8 ESR",
"V1.2.16 21/02/2017",
"	double stockage GM + localStorage version Vapulabehemot en préparation du passage HTTPS",
"	possibilité de masquer les Gowaps Sauvages dans la vue",
"	calcul des caractéristiques du siphon des âmes",
"V1.2.15.2 02/02/2017",
"	adaptation décumul VlC (page des bonus/malus)",
"V1.2.15.1 29/01/2017",
"	carte sur la page de description du lieu TP",
"V1.2.15 25/01/2017",
"	mise en place des nouvelles cartes (suivants, TP)",
"V1.2.14.3 25/01/2017",
"	résumé dans l'export des données Trõlligion",
"V1.2.14.2 20/01/2017",
"	forcer filtrage après le chargement des niveaux des monstres dans la vue",
"V1.2.14.1 20/01/2017",
"	réécriture filtrage des monstres par niveau dans la vue",
"	Changelog dans la page des news MZ",
"V1.2.14 20/01/2017",
"	Ajout de l'export des données Trõlligion",
"V1.2.13.7 10/01/2017",
"	Exclusion Bricoll'troll dans l'entête GM",
"V1.2.13.6 08/01/2017",
"	Réécriture analyse des étapes de mission sur monstre de niveau...",
"V1.2.13.5 07/01/2017",
"	Correction bug qui se manisfestait sous LINUX",
"V1.2.13.4 07/01/2017",
"	Plus de traces en mode debug pour l'analyse des étapes de mission",
"V1.2.13.3 07/01/2017",
"	Correction erreur sur un commentaire qui bloquait la compilation javascript",
"V1.2.13.2 07/01/2017",
"	Correction missions, recherche troogle (familles et types de monstres)",
"V1.2.13.1 06/01/2017",
"	Suppression oldSchoolProfile qui n'existe plus",
"	Ajout du 'refresh' du cadre de gauche",
"V1.2.13 01/01/2017",
"	homogénéisation des messages d'erreur",
"	Ajout du lien Troogle sur les étapes de mission monstre",
"V1.2.12.2 30/12/2016",
"	retour en mode normal (http si jeu en http)",
"V1.2.12.1 27/12/2016",
"	Correction mode IP",
"	Version patch pour forcer https sur /mz.mh.raistlin.fr (http en panne)",
"V1.2.12 24/12/2016",
"	Nettoyage des URL",
"	Mode dev (Shift+Click sur le mot 'Crédits' dans Options/Pack Graphique) qui se branche sur le site de dev",
"	Interface bricoll'Troll en https",
"	Remise en marche des cartes des trajets des gowaps",
"V1.2.11.5 à 7 20 & 21/12/2016",
"	Trace et protection sur plantage remonté par Marsak (lié à la diplo dans la vue)",
"V1.2.11.4 19/12/2016",
"	Changement des couleurs de la barre de vie Interface Bricol'Troll",
"V1.2.11.3 19/12/2016",
"	Correction de la récupération des PI totaux (du coup la portée de TP était NaN)",
"	Interface Bricol'Troll : suppression Trõlls pas mis à jour depuis plus d'un mois et grisé ceux depuis plus de 7 jours",
"V1.2.11.2 18/12/2016",
"	Correction bug interface Bricoll'Troll, n n'était pas affiché pour les Potrolls au soleil",
"V1.2.11.1 17/12/2016",
"	Correction bug interface Bricoll'Troll, les potrolls n'étaient pas affichés s'il n'y en avait pas au moins un",
"V1.2.11 13/12/2016",
"	Passage sur BdD Raistlin \\o/",
"V1.2.10.4 12/12/2016",
"	Correction bug à la récupération d'une erreur interface Bricoll'Troll",
"V1.2.10.3 09/12/2016",
"	Adaptation à une modification du HTML MH (voir set2DViewSystem)",
"V1.2.10.2 09/12/2016",
"	positionnement des Trõlls camou/invi à la bonne position par rapport à la distance",
"V1.2.10.1 08/12/2016",
"	option pour affichage des Trõlls {invi/camou/hors vue} avec Bricol'Troll + peaufinage affichage",
"V1.2.10 07/12/2016",
"	correction décumul des bonus/malus",
"	affichage des Trõlls {invi/camou/hors vue} avec Bricol'Troll",
"V1.2.9 16/11/2016",
"	adaptation Firefox 50 (comportement différent sur échec Ajax https)",
"V1.2.8 10/11/2016",
"	gestion des messages d'erreur de l'interface avec l'IT bricol'Troll",
"	déplacement des images sur l'infra raistlin + meilleure gestion HTTPS",
"V1.2.7 07/11/2016",
"	remise en route de l'interface avec l'IT bricol'Troll",
"V1.2.6 19/10/2016",
"	affichage d'un message en cas de certificat raistlin non accepté pour la vue sous https",
"	stockage idguilde et nomguilde",
"V1.2.5 17/10/2016",
"	correction doublon do_cdm qui bloquait l'envoi des CdMs lors de la compétence",
"	remise en route de la gestion des options avec intégration md5 dans ce script",
"V1.2.4 14/10/2016",
"	utilisation du relai raistlin pour l'envoi des CdM",
"V1.2.3 :",
"	suppression ancien profil",
"	nettoyage doublon sur getPortee",
"	adaptation portee TP basée sur les PI",
"	repository sur greasyfork.org (pour être en https et avoir la mise à jour automatique active par défaut)",
"V1.2.2 : correction bug sur les 2 URL raistlin qui avaient été confondues",
"V1.2.1 :",
"	include des URLs MH alternatives",
"	regroupement des URLs externes en tête de fichier pour pouvoir contempler l'horreur de la diversité de la chose",
"	Ajout d'un message d'alerte en cas de HTTPS sans avoir débloqué le contenu mixte",
"V1.2 : toujours un gros paquet sale, passage sous Greasemonkey",
"V1.1 : regroupement en un gros paquet sale",
];

/**********************************************************
	À faire / propositions d'évolutions

	H2P 08/07/2020
*		dans la vue des minerais, ça devrait a priori afficher, sur base des formules de mountypedia, le nombre de carats de chaque pépite de minerai
	Bireli-Gravos 08/12/2018
		FAIT faire un warning si l'utilisateur a désactivé la case "Menu d'actions contextuelles" dans la fenêtre "limiter la vue"
	breizhou13 20/12/2016
		envoyer les données à l'IT (Bricol'Trolls) aussi
			(Roule') Ça me semble difficile vis à vis de Bricol'Troll. Un bouton pour demander le rafraichissement ?
		partage de l'identification des tresors au sol. Ca c'etait cool mais ca implique une BDD
		partage des CDM avec seulement son groupe. Perso je prefere le partage general
	Akkila le boeuf le 26-03-2017 à 15:56
		- bouton pour rafraîchir les infos des trolls de son groupe
	Roule'
		FAIT corriger la façon dont les cibles de mission sont stockées (JSON très grosse table)
		Réactiver les jubilaires
		À supprimer : traces marquées [MZd] (mises pour analyser pb Tcherno Bill)
		06/01/2017 toute la partie tabcompo ne fonctionne plus (sans doute suite à la modification de l'affichage des objets en tanière)
			- voir l'intérêt de refaire fonctionner
			- gestion des compos d'enchantement, EM (!), mois des champignons, autre (?)
		FAIT : ambiguité sur le nom de monstres de mission : Shai, Ombre, Geck'oo et Boujd'la
		Sans doute à corriger, la compétence Baroufle pour le lien vers l'anatroliseur
		Prévision des DLA de monstre
		FAIT Niveau des monstres à la méthode Roule'
	Raistlin
*		et si la popup des compétences s'affichait aussi au survol des raccourcis ?
		FAIT? pages des Bonus/malus, erreur sur l'effet total, tours suivants, attaque
		FAIT Les cibles de mission ont disparu dans la vue (remonté par Hera)
	80117 - Héra
*		Il semble que l'icône de LdP n'apparait que pour les Tom
*		l'infobulle de sacrifice donne des info erronées maintenant (dues aux changement d'affichage des gains/bm de temps probablement). pour moi, ça me dit "vous ne pouvez pas compenser de blessures dues à un sacrifice" alors que clairement, je peux
		Ajout dans le vue d'un pseudo-lieu pour la caverne où le meneur d'un mission doit se rendre
		FAIT Pour la portée IdC, l'arrondi est par défaut et MZ le fait par excès (1 fois en horizontal + 1 fois en vertical)
		FAIT Possibilité de plusieurs systèmes Bricol'troll
		en 1.2.17.18 SyntaxError: expected expression, got end of script[En savoir plus] Tout_MZ.user.js:12731:6
	?
		FAIT Tenir compte de la distance pour le PM (calculatrice de combat)
	Alanae/Gnu/Pen-Hiss
*		l'infobulle du lancer de potion pourrait donner le % du jet de toucher en fonction de la distance
*		popup d'erreur js en mode smartphone sur un TP (pb trajet_canvas)
		Dans https://mhp.mh.raistlin.fr/mountyhall/View/View_closed.php, le lien pour se connecter à son troll est games.mountyhall.com Est-ce que ça peut être modifié par MZ ?
		a de temps en temps un popup "Error: Permission denied to access property Symbol:toPrimitive"
		est-ce que l'infobulle de charger pourrait calculer la portée pour les tours suivants en fonction de la diminution de fatigue (ce serait plus compliqué d'estimer quand on est blessé en fonction de la reg)
	Kali
		MASQUÉ "TyperError: InfoComposant[4] is undefined" à l'affichage de la vue
**********************************************************/

/**********************************************************
Doc État et Callback pour l'utilisation par les scripts tiers
	MZ met à jour la propriété document.body.dataset.MZ_Etat
		1 à la fin de l'initialisation (tout le code MZ s'est déroulé mais il peut y avoir des appels AJAX en cours)
		2 (uniquement sur l'onglet de la vue) quand l'onglet a été mis à jour avec les niveaux, etc.
			ATTENTION, l'utilisateur peut demander un complément de CdM s'il voit plus de 500 monstres
	MZ appelle les callback définies dans les tableaux suivants, si ces tableaux existent
		document.body.MZ_Callback_init: fonctions que MZ appellera quand MZ aura fini sont initialisation
			ATTENTION, si MZ est chargé avant le script tiers, cette fonction ne sera jamais appelée. Le script tiers doit donc tester l'état document.body.dataset.MZ_Etat et faire l'appel à la callback lui-même si l'état est déjà défini, ce qui signifie que MZ est déjà initialisé.
		document.body.MZ_Callback_fin_vue: fonctions que MZ appellera quand MZ aura fini son premier traitement des CdM dans la vue
		ATTENTION document.body.MZ_Callback_init et document.body.MZ_Callback_fin_vue sont des tableaux.
			Vous n'êtes pas seuls au monde. Un autre script externe peut s'être déjà enregistré en callback
			Voici un exemple de code pour enregistrer une callback
			if (document.body.MZ_Callback_init === undefined) {
				document.body.MZ_Callback_init = [myCallback];
			} else {
				document.body.MZ_Callback_init.push(myCallback);
			}
**********************************************************/

/**********************************************************
**** Début de zone à déplacer dans une bibli commune ******
**********************************************************/

// URL de base serveur MZ
var URL_MZ = 'http://mz.mh.raistlin.fr/mz';
// pour passer en mode IP, commenter la ligne précédente et décommenter la suivante
//var URL_MZ = 'http://192.99.225.92/mz';

// URLs externes images (pas de souci CORS mais pas de HTTPS)
// On dirait qu'il n'y en a plus...

// URLs externes redirection (pas de souci CORS)
var URL_pageNiv = 'http://mountypedia.ratibus.net/mz/niveau_monstre_combat.php';
var URL_AnatrolDispas = 'http://mountyhall.dispas.net/dynamic/';
var URL_vue_CCM = 'http://clancentremonde.free.fr/Vue2/RecupVue.php';
var URL_vue_Gloumfs2D = 'http://gloumf.free.fr/vue2d.php';
var URL_vue_Gloumfs3D = 'http://gloumf.free.fr/vue3d.php';
var URL_vue_Grouky= 'http://mh.ythogtha.org/grouky.py/grouky';
var URL_vue_cube= 'vueCube/vueCube.html';
var URL_troc_mh = 'http://troc.mountyhall.com/search.php';
var URL_cyclotrolls = 'http://www.cyclotrolls.be/';
var URL_troogle = 'http://troogle.iktomi.eu/entities/';

// URLs de test HTTPS
var URL_CertifRaistlin1 = URL_MZ.replace(/http:\/\//, 'https://') + '/img/1.gif';	// s'adapte si mode IP
var URL_CertifRaistlin2 = 'https://it.mh.raistlin.fr/vilya/mz_json.php';

// ceux-ci rendent bien les 2 entêtes CORS (mais pas de HTTPS)
var URL_bricol = 'http://trolls.ratibus.net/';	// recupération des infos des trolls dans l'IT bricol'troll
var URL_bricol_https = 'https://it.mh.raistlin.fr/'	// IT bricol'troll en https via relai Raistlin

// x~x Libs

/* ancien TODO
 * - revoir la gestion des CdM --> nott armure magique
 * - revoir tout ce qui est lié à la vue (estimateurs dég nott)
 * - vérfier la gestion des enchants
 */

// Roule 04/09/2016 switch extern URLs to https if available
var isHTTPS = false;
if (window.location.protocol.indexOf('https') === 0) {
	URL_MZ = URL_MZ.replace(/http:\/\//, 'https://');
	URL_bricol = URL_bricol_https;
	isHTTPS = true;
}

// Roule 23/12/2016 mode dev
var isDEV = false;
if (window.localStorage.getItem('MZ_dev')
		|| window.location.href.indexOf('rouletabille.mh.free.fr') > 0
		|| window.location.href.indexOf('mzdev.mh') >= 0) {
	URL_MZ = URL_MZ.replace(/$/, 'dev');
	isDEV = true;
}

// Images (pas de souci CORS)
var URL_MZimg = URL_MZ + '/img/';
// URLs externes ajax (CORS OK)
var URL_MZinfoMonstre = URL_MZ + '/monstres_0.9_FF.php';
var URL_MZgetCaracMonstre = URL_MZ + '/getCaracMonstre.php';
var URL_pageDispatcherV2 = URL_MZ + '/cdmdispatcherV2.php';

// liens externes déduits
var URL_bricol_mountyhall = URL_bricol + 'mountyhall/';

var MHicons = '/mountyhall/Images/Icones/';
// Active l'affichage des log de DEBUG (fonction debugMZ(str))
var MY_DEBUG = false;

var horsGM = false;
try {	// à partir du 11/07/2018, (GM_getValue === undefined) provoque une exception
	horsGM = (GM_getValue === undefined);
} catch (e2) {
	horsGM = true;
	//window.console.log('test GM_getValue, exception=' + e2);
}
if (horsGM) {	// éviter le blocage si pas sous GM
	window.console.log('[MZ] Fonctionnement hors Greasemonkey');
	// Roule 18/11/2017 il ne faut pas de "var" dans les ligne précédente. Ça fonctionnait sous Greasemonkey mais plus sous Violentmonkey
	GM_getValue = function(key) {};
	GM_setValue = function(key, val) {};
	GM_deleteValue = function(key) {};
	GM_info = {script: {version: 'sans GM'}}	// GM_info.script.version
}

/* Utilisation de la gestion de l'enregistrement des données de
GreaseMonkey, avec partage entre scripts via le localStorage, par
Vapulabehemot (82169) 07/02/2017 */
// Correction Roule' pour les boolean, le JSON decode pose problème car MZ utilise JSON
// Nécessite la présence de @grant GM_getValue, @grant GM_deleteValue et @grant GM_setValue
function MY_getValue(key) {
	var v = window.localStorage.getItem(key);
	vGM = GM_getValue(key);
	if ((vGM == null)
		|| (v != null && v != vGM)){
		GM_setValue(key, v);
	} else if (v == null && vGM != null) {
		v = vGM;
		window.localStorage[key] = vGM;
	}
	return v;
}
function MY_removeValue(key) {
	GM_deleteValue(key);
	window.localStorage.removeItem(key);
}
function MY_setValue(key, val) {
	if (val === true)	// conversion des booléens en 0 ou 1 à cause du localStorage infoutu de gérer les booléens
		val = 1;
	else if (val === false)
		val = 0;
	try {
	GM_setValue(key, val);
	} catch(e) {
		window.console.log('[MZ ' + GM_info.script.version + '] MY_setValue echec GM_setValue(' + key + ', ' + val + ')');
	}
	try {
		window.localStorage[key] = val;
	} catch(e) {
		window.console.log('[MZ ' + GM_info.script.version + '] MY_setValue echec localStorage[' + key + '] = ' + val);
	}
}

/*---------------- mise à jour de variables globales utiles ------------------*/
// utilisé pour accès bdd (un peu partout) :
var numTroll = MY_getValue('NUM_TROLL');
// utilisé dans vue pour PX :
// Roule 16/06/2017 on ne peut pas prendre le dernier niveau vu ! on a peut-être changé de Troll
var nivTroll; // = MY_getValue('NIV_TROLL');
// Roule 20/04/2017 le niveau n'est plus dans la frame de gauche, on récupère dans <numtroll>.niveau
if (nivTroll == undefined) nivTroll = MY_getValue(numTroll + '.niveau');
// utilisés dans actions et vue (calculs SR) :
var mmTroll = MY_getValue(numTroll+'.caracs.mm');
var rmTroll = MY_getValue(numTroll+'.caracs.rm');
var currentURL = window.location.href;

/*-[functions]------------ Fonctions durée de script -------------------------*/
var date_debut = null;

function start_script(nbJours_exp) {
	if(MY_DEBUG) window.console.log('[MZ ' + GM_info.script.version + '] début sur ' + window.location.pathname);
	if(date_debut) return;
	date_debut = new Date();
	// Créé la variable expdate si demandé
	if(nbJours_exp) {
		expdate = new Date();
		expdate.setTime(expdate.getTime()+nbJours_exp*864e5);
		}
	}

function displayScriptTime(duree, texte) {
	var footerNode = document.getElementById('footer2');
	if(!footerNode) return;
	try{
	var node = document.evaluate(
		".//text()[contains(.,'Page générée en')]/../br",
		footerNode,null,9,null).singleNodeValue;
	}
	catch(e){return;}
	if (duree) {
		insertText(node,
			' - [' + texte + ' en ' + (duree/1000) +' sec.]');
		return;
	}
	insertText(node,
		' - [Script MZ exécuté en '
		+(new Date().getTime()-date_debut.getTime())/1000+' sec.]');
	if(MY_DEBUG) window.console.log('[MZ ' + GM_info.script.version + '] fin sur ' + window.location.pathname);
}

function traceStack(e, sModule) {
	var version  = '';
	if (GM_info && GM_info.script && GM_info.script.version)
		version = ' ' + GM_info.script.version;
	sRet = '[MZ' + version + ']'
	if (sModule) sRet += ' {' + sModule + '}';
	try {
		if (e.message) sRet += ' ' + e.message;
	} catch (e2) {
		sRet += ' <exception acces message>';//+ e2.message;
	}
	try {
		if (e.stack) {
			var sStack = e.stack;
			// enlever les infos confidentielles
			sRet += "\n" + sStack.replace(/file\:\/\/.*gm_scripts/ig, '...');
		}
	} catch (e2) {
		sRet += ' <exception acces stack>'; // + e2.message;
	}
	return sRet;
}

/*-[functions]---------- DEBUG: Communication serveurs -----------------------*/

function debugMZ(str){
    if(MY_DEBUG){
        window.console.debug('[MZ_DEBUG] '+str);
        if(typeof str === "object"){
            window.console.debug(str);
        }
    }
}

if("function" != typeof isPage) {
	function isPage(url) {
		return window.location.pathname.indexOf("/mountyhall/"+url) == 0;
	}
}

function FF_XMLHttpRequest(MY_XHR_Ob) {
	var request = new XMLHttpRequest();
	request.open(MY_XHR_Ob.method,MY_XHR_Ob.url);
	for(var head in MY_XHR_Ob.headers) {
		request.setRequestHeader(head,MY_XHR_Ob.headers[head]);
	}
	request.onreadystatechange = function() {
		//window.console.log('XMLHttp readystatechange url=' + MY_XHR_Ob.url + ', readyState=' + request.readyState + ', error=' + request.error + ', status=' + request.status);
		if(request.readyState!=4) { return; }
		if(request.error) {
			if(MY_XHR_Ob.onerror) {
				MY_XHR_Ob.onerror(request);
			}
			return;
		}
		if ((request.status == 0)) {
			window.console.log('status=0 au retour de ' + MY_XHR_Ob.url + ', réponse=' + request.responseText);
			if (isDEV) {
				var grandCadre = createOrGetGrandCadre();
				var sousCadre = document.createElement('div');
				sousCadre.innerHTML = 'AJAX status = 0, voir console';
				sousCadre.style.width = 'auto';
				sousCadre.style.fontSize = 'large';
				sousCadre.style.border = 'solid 1px black';
				grandCadre.appendChild(sousCadre);
			}
			if (MY_XHR_Ob.onerror) MY_XHR_Ob.onerror(request);
			//showHttpsErrorContenuMixte();
			return;
		}
		if(MY_XHR_Ob.onload) {
			var version;
			if (MY_XHR_Ob.trace) {
				version  = '';
				if (GM_info && GM_info.script && GM_info.script.version)
					version = ' ' + GM_info.script.version;
				window.console.log('[MZ' + version + '] ' + MZ_formatDateMS() + ' début traitement retour AJAX ' + MY_XHR_Ob.trace);
			}
			/* DEBUG: Ajouter à request les pptés de MY_XHR_Ob à transmettre */
			MY_XHR_Ob.onload(request);
			if (MY_XHR_Ob.trace)
				window.console.log('[MZ' + version + '] ' + MZ_formatDateMS() + ' fin traitement retour AJAX ' + MY_XHR_Ob.trace);
		}
	};
	request.send(MY_XHR_Ob.data);
}

// rend une chaine affichant date et heure et milliseconds (maintenant si le paramètre est absent)
function MZ_formatDateMS(d, sansMicroSecondes) {
	if (d === undefined) d = new Date();
	var day = d.getDate();
	var month = d.getMonth()+1;
	var year = d.getFullYear();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	var seconds = d.getSeconds();
	if (day     < 10) {day     = "0"+day;}
	if (month   < 10) {month   = "0"+month;}
	if (hours   < 10) {hours   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	if (sansMicroSecondes) {
		return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
	} else {
		var ms = d.getMilliseconds();
		ms = ('000' + ms).substr(-3, 3);
		return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds + '.' + ms;
	}
}

/*-[functions]-------------- Interface utilisateur ---------------------------*/

// http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  var successful = document.execCommand('copy');

  document.body.removeChild(textArea);
  return successful;
}

function avertissement(txt,duree,bBloque) {
	window.console.log('[MZ] affichage avertissement ' + txt + (duree ? ' pour (' + duree + ' ms)' : ''));
	if(!duree) duree = 15000;
	var div = document.createElement('div');
	// On numérote les avertissements pour destruction sélective
	var num = document.getElementsByName('avertissement').length;
	div.num = num;
	// Numéro enregistré dans le DOM pour récupération sur getElementsByName()
	div.setAttribute('name','avertissement');
	div.className = 'mh_textbox';
	div.style.position = 'fixed';
	div.style.top = (10+15*num)+'px';
	div.style.left = (10+5*num)+'px';
	div.style.border = '5px solid red';
	div.style.zIndex = 2+num;
	div.style.cursor = 'pointer';
	div.style.fontSize = 'large';
	div.innerHTML = txt;
	if (!bBloque) div.onclick=function(){ tueAvertissement(this.num) };

	// un croix en haut à droite pour signifier à l'utilisateur qu'il peut cliquer pour fermer ce popup
	var divcroix = document.createElement('div');
	divcroix.style.position = 'absolute';
	divcroix.style.top = 0;
	divcroix.style.right = 0;
	divcroix.style.color = 'black';
	divcroix.style.fontSize = 'inherit';
	divcroix.style.cursor = 'pointer'
	divcroix.style.zIndex = 2+num;
	divcroix.innerHTML = "X";
	div.appendChild(divcroix);

	document.body.appendChild(div);
	// Destruction automatique de l'avertissement après "un certain temps"
	window.setTimeout(function(){ tueAvertissement(num) },duree);
}

function tueAvertissement(num) {
	var divs = document.getElementsByName('avertissement');
	if(divs.length==0) { return; }
	for(var i=0 ; i<divs.length ; i++) {
		if(divs[i].num==num) {
			divs[i].parentNode.removeChild(divs[i]);
			return;
		}
	}
}


/*-[functions]-------------- Modifications du DOM ----------------------------*/

function insertBefore(next,el) {
	next.parentNode.insertBefore(el,next);
	}

function appendTr(tbody,clas) {
	var tr = document.createElement('tr');
	if(clas) tr.className = clas;
	tbody.appendChild(tr);
	return tr;
	}

function insertTr(next,clas) {
	var tr = document.createElement('tr');
	if(clas) tr.className = clas;
	insertBefore(next,tr);
	return tr;
	}

function appendTd(tr) {
	var td = document.createElement('td');
	if(tr) tr.appendChild(td);
	return td;
	}

function insertTd(next) {
	var td = document.createElement('td');
	insertBefore(next,td);
	return td;
	}

function insertTh(next) {
	var th = document.createElement('th');
	insertBefore(next,th);
	return th;
	}

	// handle when eTd is the last (in this case eTd.nextSibling is null, which is fine for insertBefore)
function insertAfterTd(eTd) {
	var newTd = document.createElement('td');
	eTd.parentNode.insertBefore(newTd, eTd.nextSibling);
	return newTd;
	}

function appendTdCenter(tr,colspan) {
	var td = appendTd(tr);
	td.align = 'center'; // WARNING - Obsolete
	if(colspan) td.colSpan = colspan;
	return td;
	}

function insertTdElement(next,el) {
	var td = insertTd(next);
	if(el) td.appendChild(el);
	return td;
	}

function appendA(paren,href,cssClass,text) {
	var a = document.createElement('a');
	if (href) a.href = href;
	if (cssClass) a.className = cssClass;
	if (text) a.appendChild(document.createTextNode(text));
	paren.appendChild(a);
}

function appendText(paren,text,bold) {
	if(bold) {
		var b = document.createElement('b');
		b.appendChild(document.createTextNode(text));
		paren.appendChild(b);
		}
	else
		paren.appendChild(document.createTextNode(text));
	}

function insertText(next,text,bold) {
	if(bold) {
		var b = document.createElement('b');
		appendText(b,text);
		insertBefore(next,b);
		}
	else
		insertBefore(next,document.createTextNode(text));
	}

function appendThText(tr,text,bold) {
	var th = document.createElement('th');
	if(tr) tr.appendChild(th);
	th.appendChild(document.createTextNode(text));
	if (bold) th.style.fontWeight = 'bold';
	return th;
	}

function appendTdText(tr,text,bold) {
	var td = appendTd(tr);
	td.appendChild(document.createTextNode(text));
	if (bold) td.style.fontWeight = 'bold';
	return td;
	}

function insertThText(next,text,bold) {
	var th = insertTh(next);
	appendText(th,text,bold);
	return th;
	}

function insertTdText(next,text,bold) {
	var td = insertTd(next);
	appendText(td,text,bold);
	return td;
	}

function appendBr(paren) {
	paren.appendChild(document.createElement('br'));
	}

function insertBr(next) {
	insertBefore(next,document.createElement('br'));
	}

function appendLI(ul,text) {
	// uniquement utilisé dans les options (crédits)
	var li = document.createElement('li');
	appendText(li,text);
	ul.appendChild(li);
	return li;
	}

function appendTextbox(paren,type,nam,size,maxlength,value, sId) {
	var input = document.createElement('input');
	input.className = 'TextboxV2';
	input.type = type;
	input.name = nam;
	if (sId === undefined) input.id = nam;
	else                   input.id = sId;
	input.size = size;
	input.maxLength = maxlength;
	if(value) input.value = value;
	paren.appendChild(input);
	return input;
	}

function appendCheckBox(paren,nam,checked,onClick) {
	var input = document.createElement('input');
	input.type = 'checkbox';
	input.name = nam;
	input.id = nam;
	if(checked) input.checked = true;
	if(onClick) input.onclick = onClick;
	paren.appendChild(input);
	return input;
	}

function appendNobr(paren,id,delgg,text) {
	var nobr = document.createElement('nobr');
	appendCheckBox(nobr,id,null,delgg);
	appendText(nobr,text);
	paren.appendChild(nobr);
	appendText(paren,'   ');
	return nobr;
	}

function appendCheckBoxSpan(paren,id,onClick,text) {
	var span = document.createElement('span');
	span.style.whiteSpace = 'nowrap';
	appendCheckBox(span,id,false,onClick);
	var label = document.createElement('label');
	appendText(label,text);
	label.htmlFor = id;
	label.style.marginLeft = '-5px';
	span.appendChild(label);
	span.style.marginRight = '3px';
	paren.appendChild(span);
	appendText(paren, ' ');
	return span;
	}

function appendOption(select,value,text) {
	var option = document.createElement('option');
	option.value = value;
	appendText(option,text);
	select.appendChild(option);
	return option;
	}

function appendHidden(form,nam,value) {
	var input = document.createElement('input');
	input.type = 'hidden';
	input.name = nam;
	input.id = nam;
	input.value = value;
	form.appendChild(input);
	}

function appendButton(paren,value,onClick) {
	var input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	if(onClick) input.onclick = onClick;
	paren.appendChild(input);
	return input;
	}

function insertButton(next,value,onClick) {
	var input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	input.onclick = onClick;
	insertBefore(next,input);
	return input;
	}

function appendSubmit(paren,value,onClick) {
	var input = document.createElement('input');
	input.type = 'submit';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	if(onClick) input.onclick = onClick;
	paren.appendChild(input);
	return input;
	}

function createImage(url,title,style) {
	var img = document.createElement('img');
	img.src = url;
	img.title = title;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	if (style) img.style = style;
	return img;
	}

function createAltImage(url,alt,title) {
	var img = document.createElement('img');
	img.src = url;
	img.alt = alt;
	if (title) img.title = title;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	return img;
	}

function createImageSpan(url,alt,title,text,bold) {
	var span = document.createElement('span');
	span.title = title;
	var img = document.createElement('img');
	img.src = url;
	img.alt = alt;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	span.appendChild(img);
	appendText(span,text,bold);
	return span;
	}

function createCase(titre,table,width) {
	if(!width) width=120;
	var tr = appendTr(table,'mh_tdpage');

	var td = appendTdText(tr,titre,true);
	td.className = 'mh_tdtitre';
	td.width = width;

	td = appendTdText(tr,'');
	td.className = 'mh_tdpage';
	return td;
	}

function getMyID(e) {
	var parent = e.parentNode;
	for(var i=0 ; i<parent.childNodes.length ; i++) {
		if(e==parent.childNodes[i])
			return i;
		}
	return -1;
	}

function insertAfter(elt,newElt) {
	var id = getMyID(elt);
	if(id==-1) return;
	if(id<elt.parentNode.childNodes.length-1)
		insertBefore(elt.nextSibling,newElt);
	else
		elt.parentNode.appendChild(newElt);
	}


/*-[functions]------- Fonctions de mise en forme du texte --------------------*/

function aff(nb) {
	return (nb >= 0) ? '+' + nb : nb;
}

function getNumber(str) {
	var nbr = str.match(/\d+/);
	return nbr ? Number(nbr[0]) : Number.NaN;
}

function getNumbers(str) {
	var nbrs = str.match(/\d+/g);
	if (!nbrs) return [];
	for (var i = 0; i < nbrs.length; i++) {
		nbrs[i] = Number(nbrs[i]);
	}
	return nbrs;
}

function getIntegers(str) {
	var nbrs = str.match(/-?\d+/g);
	if (!nbrs) return [];
	for(var i=0 ; i<nbrs.length ; i++) {
		nbrs[i] = Number(nbrs[i]);
	}
	return nbrs;
}

function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

if (typeof String.prototype.trim != 'function') {
	// Intégré depuis ES5, pour rétrocompatibilité
	String.prototype.trim = function() {
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	}
}

function epure(texte) {
	return texte
		.replace(/[àâä]/g,'a').replace(/Â/g,'A')
		.replace(/[ç]/g,'c')
		.replace(/[éêèë]/g,'e')
		.replace(/[ïî]/g,'i')
		.replace(/[ôöõ]/g,'o')
		.replace(/[ùûü]/g,'u');
}

// WARNING Modifier des constantes, c'est mal
String.prototype.epure = function() {
	return this
		.replace(/[àâä]/g,'a').replace(/Â/g,'A')
		.replace(/[ç]/g,'c')
		.replace(/[éêèë]/g,'e')
		.replace(/[ïî]/g,'i')
		.replace(/[ôöõ]/g,'o')
		.replace(/[ùûü]/g,'u');
}

function bbcode(texte) {
	return texte
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#146;')
		.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>')
		.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>')
		.replace(/\[img\]([^"]*?)\[\/img\]/g, '<img src="$1" />');
}

/*-[functions]------- Gestion / Transformation des Dates ---------------------*/

function addZero(i) {
	return (i<10) ? '0'+i : i;
	}

function DateToString(date) {
	return addZero(date.getDate())+'/'+addZero(date.getMonth()+1)
		+'/'+date.getFullYear()+' '+addZero(date.getHours())
		+':'+addZero(date.getMinutes())+':'+addZero(date.getSeconds());
	}

function StringToDate(str) {
	return str.replace(/([0-9]+)\/([0-9]+)/,"$2/$1");
	}

// fonctionne aussi avec datetime
function SQLDateToFrench(str) {
	return str.replace(/([0-9]+)\-([0-9]+)\-([0-9]+)/,"$3/$2/$1");
}

// ... et ajoute un "à" du plus bel effet
function SQLDateToFrenchTime(str) {
	return str.replace(/([0-9]+)\-([0-9]+)\-([0-9]+) /,"$3/$2/$1 à ");
}

// SQLDate vers objet date Javascript
function SQLDateToObject(str) {
	var t = str.split(/[- :]/);
	return new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
}

var mz_ie = (window.attachEvent)? true:false;
if ("function" !== typeof addEvent) {
	if (mz_ie) {
		function addEvent(obj, typ, fn, sens) {
			obj["e"+typ+fn] = fn; obj[typ+fn] = function() {
				obj["e"+typ+fn]( window.event );
			}
			obj.attachEvent("on"+typ, obj[typ+fn] );
		}
	}
	else  {
		function addEvent(obj, typ, fn, sens) {
			obj.addEventListener(typ, fn, sens);
		}
	}
}

/**********************
* glissière en mode objet
* Roule 29/12/2016 à partir du code des trajets gowap doCallback_glissiere et Vapulabehemot
* Une glissière est un curseur permettant, par exemple de changer le zoom des cartes
*
* Usage:
*	gliss = new glissiere_MZ(ref, labelHTML, target, bDynamic);
*		ref : utilisé pour diversifier les IDs HTML
*		labelHTML : le label qui apparaît devant la glissière (peut contenir des balises HTML)
*		target : peut être de 3 types
*			- élément HTML : l'élément HTML à zoomer
*			- string : l'ID de l'élément à zoomer (qui doit exister au moment de la création de la glissière
*			- function : callback quand le curseur bouge
*		bDynamic : par défaut, le fonctionnement n'est pas dynamique (la callback est appellé au click)
*					dans le mode dynamique, la callback est appelée sur mouseMove
*		valDef : valeur par défaut si l'outil n'a jamais été utilisé
*		valMin, valMax : les valeurs entre lesquelles le curseur varie
*	autres méthodes
*		gliss.getElt();			// rend la div de la glissière (par exemple pour la positionner)
**********************/

function glissiere_MZ(ref, labelHTML, paramTarget, bDynamic, valDef, valMin, valMax) {
	try {
		var mouseDown = false;
		var div_gliss = document.createElement("div");	// la DIV mère
		div_gliss.id = "MZ_gliss_"+ref;
		var div_label = document.createElement("span");	// le label
		div_label.innerHTML = labelHTML;
		div_gliss.appendChild(div_label);
		div_gliss.className = "choix_zoom";
		var dessin = document.createElement("canvas");	// le dessin lui-même
		dessin.id = "MZ_gliss_dessin_"+ref;
		dessin.style.cursor = "pointer";
		dessin.width = 104;
		dessin.height = 12;
		dessin.style.marginLeft = '2px';
		dessin.style.marginRight = '2px';
		div_gliss.appendChild(dessin);
		var pourcent = document.createElement("span");	// le pourcentage
		pourcent.id = "MZ_gliss_pourcent_"+ref;
		var pourcent_text = document.createTextNode('');
		var previousVal;
		var flouPourCurseurDoubleFleche = (valMax - valMin) / 40;

		// alignement vertical
		dessin.style.verticalAlign = 'middle';
		div_label.style.verticalAlign = 'middle';
		pourcent.style.verticalAlign = 'middle';

		pourcent.appendChild(pourcent_text);
		div_gliss.appendChild(pourcent);

		var bulle_pourcent = document.createElement("div");	// la bulle
		bulle_pourcent.id = "MZ_gliss_bulle_"+ref;
		bulle_pourcent.style.display = 'block';
		bulle_pourcent.style.visibility = 'hidden';
		bulle_pourcent.style.position =  'absolute';
		bulle_pourcent.style.zIndex = 3500;
		bulle_pourcent.style.border = '1px solid  #a1927f';
		var bulle_pourcent_text = document.createTextNode('');
		bulle_pourcent.appendChild(bulle_pourcent_text);
		document.body.appendChild(bulle_pourcent);

		this.getElt = function() {return div_gliss;};

		////////////////////////////////////
		// dessine et redessine le curseur
		////////////////////////////////////
		var dessine_glissiere = function(val) {
			pos_0_100 = ((val - valMin) * 100) / (valMax - valMin);
			var ctx = dessin.getContext('2d');
			ctx.clearRect(0, 0,104, 12);
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(0,0,2,12);
			ctx.fillRect(102,0,2,12);
			ctx.fillRect(0,5,104,2);

			ctx.fillStyle = "rgb(80,80,80)";
			ctx.fillRect(pos_0_100,0,5,12);
			ctx.fillStyle = "rgb(200,200,200)";
			ctx.fillRect(pos_0_100+1,1,3,10);
			pourcent_text.nodeValue = val+'%';
			previousVal = parseInt(val);
		};

		////////////////////////////////////
		// action sur mousedown et mousemove
		//		stocker la nouvelle valeur
		//		redessiner
		//		afficher la nouvelle valeur
		//		action selon ce qui a été demandé
		////////////////////////////////////
		var doCallback_glissiere = function (evt) {
			try {
				if (evt.type === 'mousedown') mouseDown = true;
				if (evt.offsetX) {
					var xsouris = evt.offsetX;
					var xpos = evt.clientX;
					var ypos = evt.clientY + document.body.scrollTop;
				}
				else {
					var xsouris = evt.layerX;
					var xpos = evt.pageX;
					var ypos = evt.pageY;
				}
				var val = Math.floor(Math.min(valMax,Math.max(valMin,((xsouris-1) * (valMax - valMin) / 100)+valMin)));
				dessin.style.cursor = (val <= (previousVal+flouPourCurseurDoubleFleche) && val >= (previousVal-flouPourCurseurDoubleFleche)) ? "e-resize":"pointer";
				//		afficher la nouvelle valeur dans la bulle
				bulle_pourcent_text.nodeValue = val + '%';
				bulle_pourcent.style.top = (ypos+3)+'px';
				bulle_pourcent.style.left = (xpos+16)+'px';
				if (evt.buttons === undefined) {
					// mode utilisant les evt mouseup/down (mauvaise méthode, utilisé si on ne peut pas faire autrement)
					if (!mouseDown) return;	// simple survol, on ne fait rien de plus
				} else {
					if (!(evt.buttons & 1)) return;	// simple survol, on ne fait rien de plus
				}
				//		stocker la nouvelle valeur
				MY_setValue("MZ_glissiere_" + ref, val);
				//		redessiner la glissière avec le curseur où il faut
				dessine_glissiere(val);
				//		action selon ce qui a été demandé
				//for(var key in evt) window.console.log('evt key ' + key + ' => ' + evt[key]);
				if ((!bDynamic) && (evt.type !== 'mousedown')) return;
				if (typeof paramTarget === 'object') {
					var elt = paramTarget;
				} else if (typeof paramTarget === 'string') {
					var elt = document.getElementById(paramTarget);
				} else if (typeof paramTarget === 'function') {
					paramTarget(val);
					return;
				}
				if (elt.setZoom != undefined) elt.setZoom(val);
			} catch (e) {window.console.log(traceStack(e, 'glissiere_MZ.doCallback'))}
		};

		////////////////////////////////////
		// event mousedown et mousemove : redessiner et callback
		////////////////////////////////////
		addEvent(dessin, "mousedown", doCallback_glissiere, true);
		addEvent(dessin, "mousemove", doCallback_glissiere, true);
		////////////////////////////////////
		// event mouseup : mémoriser mouseup (utile seulement si le navigateur ne supporte pas evt.buttons
		////////////////////////////////////
		addEvent(dessin, "mouseup", function() {mouseDown = false;}, true);
		////////////////////////////////////
		// event mouseout & mouseover : afficher/cacher la bulle
		////////////////////////////////////
		addEvent(dessin, "mouseout", function() {bulle_pourcent.style.visibility="hidden";}, true);
		addEvent(dessin, "mouseover", function() {bulle_pourcent.style.visibility="visible";}, true);

		////////////////////////////////////
		// dessiner la première fois
		////////////////////////////////////
		var val_init = MY_getValue("MZ_glissiere_" + ref);
		if (val_init === undefined) val_init = valDef;
		dessine_glissiere(val_init);
	} catch (e) {window.console.log(traceStack(e, 'glissiere_MZ'))}
}

// calcul du point intermédiaire de déplacement gowap (x et y uniquement)
// reçoit 2 objets avec des propriétés x et y
// rend un objet avec x et y (rend undefined si le trajet est direct)
function pointIntermediaireMonstre2D(locDepart, locArrivee) {
	var deltaX = locArrivee.x - locDepart.x;
	if (deltaX == 0) return; // pas de point intermédiaire
	var deltaY = locArrivee.y - locDepart.y;
	if (deltaY == 0) return; // pas de point intermédiaire
	var absDeltaX = Math.abs(deltaX);
	var absDeltaY = Math.abs(deltaY);
	if (absDeltaX > absDeltaY) {
		return {x: locDepart.x + Math.sign(deltaX) * Math.sign(deltaY) * deltaY, y: locArrivee.y};
	} else if (absDeltaY > absDeltaX) {
		return {x: locArrivee.x, y: locDepart.y + Math.sign(deltaX) * Math.sign(deltaY) * deltaX};
	} else {
		return;	// égalité, pas de point intermédiaire
	}
}

/**********************
* carte en mode objet
* Roule 14/01/2017 à partir du code des trajets gowap de Vapulabehemot
*
* Usage:
*	carte = new carte_MZ(ref, tabDepl);
*		ref : utilisé pour diversifier les IDs HTML
*		tabDepl : table de tables d'objets contenant x, y et n (positions successives des différents suivants)
*		          pour l'affichage, le premier objet doit contenir nom et id (et typ pour des cibles particulières)
*	autres méthodes
*		carte.getElt();			// rend la div de la carte (par exemple pour la positioner dans la page)
**********************/

function carte_MZ(ref, tabDepl) {
	try {
		var div1_carte = document.createElement("div");	// la DIV mère. Elle prend toute la largeur
		div1_carte.id = "MZ_carte_"+ref;
		div1_carte.className = "mh_tdpage";	// le mh_tdpage sert à faire cacher la carte par les scripts trajet_gowap
		div1_carte.style.backgroundImage = 'none';
		div1_carte.style.backgroundColor = 'transparent';
		var div2_carte = document.createElement("div");	// la DIV mère. Elle prend toute la largeur
		div2_carte.className = "carte_MZ";
		div2_carte.style.display = 'inline-block';	// pour que la div ait la taille du contenu
		var dessin = document.createElement("canvas");	// le dessin lui-même
		dessin.id = "MZ_carte_dessin_"+ref;
		dessin.style.backgroundImage = 'url("/mountyhall/MH_Packs/packMH_parchemin/tableau/tableau1.jpg")';
		div1_carte.appendChild(div2_carte);
		div2_carte.appendChild(dessin);

		var position_trous_MZ = [[-70.5, -7.5, 2, 1.5, -69]	// x, y, ?, rayon du cercle, profondeur
			, [-66.5, -37.5, 2, 1.5, -69]
			, [-63.5, 8.5, 2, 1.5, -69]
			, [-59.5, -32.5, 2, 1.5, -69]
			, [-52, 57, 0.25, 0.8, -59]
			, [-50.5, -22.5, 2, 1.5, -69]
			, [-35.5, -51.5, 2, 1.5, -69]
			, [-34.5, 14.5, 2, 1.5, -69]
			, [-34.5, 64.5, 2, 1.5, -69]
			, [-11.5, 72.5, 2, 1.5, -69]
			, [5.5, -49.5, 2, 1.5, -69]
			, [5.5, 31.5, 2, 1.5, -69]
			, [10.5, 63.5, 2, 1.5, -69]
			, [12, -15, 0.25, 0.8, -59]
			, [21.5, 35.5, 2, 1.5, -69]
			, [30, -52, 0.25, 0.8, -59]
			, [46.5, 51.5, 2, 1.5, -69]
			, [48, -39, 0.25, 0.8, -59]
			, [55, 70, 0.25, 0.8, -59]	// correction Roule 10/10/2016 -59 au lieu de -69
			, [56.5, 23.5, 75, 8.7, -99]
			, [64, 70, 0.25, 0.8, -59]
			, [74.5, 31.5, 2, 1.5, -69]];

		var couleur_depl_normal = 'rgba(0,0,200,0.5)';
		var couleur_cible = 'rgba(0,0,0,0.5)';
		var couleur_depl_collision_trou = 'rgba(150,0,0, 0.5)';
		var couleur_trou = 'rgb(200,0,0)';

		var coord_x = function(val) {
			return decalh+coeff*(val+100);
		};
		var coord_y = function(val) {
			return decalv+coeff*(100-val);
		};

		var ctx = dessin.getContext('2d');
		var coeff = MY_getValue("MZ_glissiere_" + ref);	// ce qui a été sauvé précédement par la glissiere
		if (coeff) coeff /= 50;
		else       coeff = 2;
		var decalv=30, decalh=30;

		var detecteCollisionTrou = function (pos0, pos1) {	// fonction volée à feldspath et Vapulabehemot, merci à eux (voir calc_inter dans Trajet_Gowap)
			//var res = false
			var x0 = pos0.x;
			var y0 = pos0.x;
			var tmax = Math.max(Math.abs(pos1.x - pos0.x), Math.abs(pos1.y - pos0.y));
			var px = Math.sign(pos1.x - pos0.x);
			var py = Math.sign(pos1.y - pos0.y);
			var a = 0, b = 0, c = 0, delta = 0, t0 = 0, t1 = 0;
			//window.console.log('verif collision gowap-trou [x0=' + x0 + ',y0=' + y0 + ', px=' + px + ', py=' + py + ', tmax=' + tmax + ']');

			for(var k in position_trous_MZ) {
				a = parseFloat(px*px+py*py);
				b = parseFloat((x0-position_trous_MZ[k][0])*px+(y0-position_trous_MZ[k][1])*py);
				c = parseFloat((x0-position_trous_MZ[k][0])*(x0-position_trous_MZ[k][0])+(y0-position_trous_MZ[k][1])*(y0-position_trous_MZ[k][1])-position_trous_MZ[k][2]);
				delta = b*b-a*c
				if(delta >= 0) {
					t0 = Math.ceil(-b/a-Math.sqrt(delta)/a);
					t1 = Math.floor(-b/a+Math.sqrt(delta)/a);
					if(t0 <= tmax && t1 >= 0) {
						// Roule' 10/10/2016 J'ai déplacé le flag res=true à l'intérieur de la boucle for ci-dessous car il y avait de fausses détections
						//res = true;
						//window.console.log('***** collision gowap-trou [x0=' + x0 + ',y0=' + y0 + ', px=' + px + ', py=' + py + ', tmax=' + tmax + ']');
						for(var l=Math.max(0,t0); l<=Math.min(tmax,t1); l++) {
							//window.console.log('***** collision gowap-trou en ' + (x0+l*px) + ', ' + (y0+l*py));
							// Roule : pas utile pour nous
							//res = true;
							//chute.push([x0+l*px, y0+l*py]);
							return true;
						}
					}
				}
			}
			//return res;
			return false;
		};

		var dessine_carte = function () {
			dessin.width = 200*coeff+2*decalh;
			dessin.height = 200*coeff+2*decalv;

			//repere
			ctx.beginPath();
			ctx.moveTo(coord_x(0), coord_y(100));
			ctx.lineTo(coord_x(0), coord_y(-100));
			ctx.moveTo(coord_x(-100), coord_y(0));
			ctx.lineTo(coord_x(100), coord_y(0));
			ctx.stroke();
			ctx.strokeRect(coord_x(-100), coord_y(100), coord_x(100) - coord_x(-100), coord_y(-100) - coord_y(100));

			//trous
			ctx.fillStyle = couleur_trou;
			for(var i in position_trous_MZ) {
				ctx.beginPath();
				ctx.arc(coord_x(position_trous_MZ[i][0]), coord_y(position_trous_MZ[i][1]), coeff*position_trous_MZ[i][3], 0, Math.PI*2,  true);
				ctx.fill();
			}
			// trajets
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			for (var iSuivant in tabDepl) {
				//window.console.log('carte_MZ, suivant n°' + iSuivant);
				var tabDeplOneSuivant = tabDepl[iSuivant];
				var x0 = coord_x(tabDeplOneSuivant[0].x);
				var y0 = coord_y(tabDeplOneSuivant[0].y);
				// La "cible" au départ
				var typeDepart = tabDeplOneSuivant[0].typ;
				switch (typeDepart) {
					case 'tp':
						ctx.beginPath();
						ctx.lineWidth = 2;
						ctx.strokeStyle = couleur_cible;
						ctx.fillStyle = couleur_cible;
						ctx.moveTo(x0 + coeff * 3, y0 + coeff * 3);
						ctx.lineTo(x0 + coeff * 3, y0 - coeff * 3);
						ctx.lineTo(x0 - coeff * 3, y0 - coeff * 3);
						ctx.lineTo(x0 - coeff * 3, y0 + coeff * 3);
						ctx.lineTo(x0 + coeff * 3, y0 + coeff * 3);
						ctx.moveTo(x0 + coeff * 3, y0);
						ctx.lineTo(x0 - coeff * 3, y0);
						ctx.moveTo(x0, y0 + coeff * 3);
						ctx.lineTo(x0, y0 - coeff * 3);
						ctx.stroke();
						break;
					default:
						ctx.beginPath();
						ctx.lineWidth = 1;
						ctx.strokeStyle = couleur_cible;
						ctx.fillStyle = couleur_cible;
						ctx.arc(x0, y0, coeff * 4, 0, Math.PI*2,  true);
						ctx.moveTo(x0 + coeff * 4, y0);
						ctx.lineTo(x0 - coeff * 4, y0);
						ctx.moveTo(x0, y0 + coeff * 4);
						ctx.lineTo(x0, y0 - coeff * 4);
						ctx.stroke();
						break;
				}
				// les segments
				var nb_pts = tabDeplOneSuivant.length;
				var pointPrecedent = tabDeplOneSuivant[0];
				for (var i=1; i<nb_pts; i++) {
					ctx.beginPath();
					ctx.lineWidth = coeff;
					ctx.moveTo(coord_x(pointPrecedent.x), coord_y(pointPrecedent.y));
					ctx.strokeStyle = couleur_depl_normal;
					var pointIntermediaire = pointIntermediaireMonstre2D(pointPrecedent, tabDeplOneSuivant[i]);
					if (pointIntermediaire === undefined) {
						if (detecteCollisionTrou(pointPrecedent, tabDeplOneSuivant[i]))
							ctx.strokeStyle = couleur_depl_collision_trou;
						else
							ctx.strokeStyle = couleur_depl_normal;
						ctx.lineTo(coord_x(tabDeplOneSuivant[i].x), coord_y(tabDeplOneSuivant[i].y));
					} else {
						if (detecteCollisionTrou(pointPrecedent, pointIntermediaire)
								|| detecteCollisionTrou(pointIntermediaire, tabDeplOneSuivant[i]))
							ctx.strokeStyle = couleur_depl_collision_trou;
						else
							ctx.strokeStyle = couleur_depl_normal;
						ctx.lineTo(coord_x(pointIntermediaire.x), coord_y(pointIntermediaire.y));
						ctx.lineTo(coord_x(tabDeplOneSuivant[i].x), coord_y(tabDeplOneSuivant[i].y));
					}
					pointPrecedent = tabDeplOneSuivant[i];
					ctx.stroke();
				}
				// Les points à chaque étape
				ctx.fillStyle = couleur_depl_normal;
				for (var i=1; i<nb_pts; i++) {
					ctx.beginPath();
					var x = coord_x(tabDeplOneSuivant[i].x);
					var y = coord_y(tabDeplOneSuivant[i].y);
					ctx.arc(x, y, coeff, 0, Math.PI*2,  true);
					ctx.fill();
				}
			}
		}

		this.setZoom = function (val) {
			ctx.clearRect(0, 0, dessin.width, dessin.height);
			coeff = val / 50;
			dessine_carte();
		}

		// glissiere
		var gliss = new glissiere_MZ(ref, "Zoom\u00A0:", this, true, 100, 50, 200);
		var eGliss = gliss.getElt();
		eGliss.style.position = 'absolute';
		eGliss.style.top = (coeff * 2) + 'px';
		eGliss.style.left = decalh + 'px';
		dessin.style.position = 'relative';
		div2_carte.style.position = 'relative';
		eGliss.style.zIndex = 9000;
		div2_carte.appendChild(eGliss);

		// affichage au survol de la souris
		var bulle = document.createElement('div');
		bulle.style.visibility = 'hidden';
		bulle.style.position = 'absolute';
		bulle.style.zIndex = 3100;
		bulle.style.border = 'solid 1px #a1927f';
		bulle.className = 'mh_tdpage';
		bulle.style.display = 'block';	// ATTENTION, display doit être après className pour forcer le display
		var bulleHaut = document.createElement('div');
		bulleHaut.style.display = 'block';
		bulleHaut.style.paddingRight = '3px';
		bulleHaut.className = 'mh_tdtitre';
		bulleHaut.appendChild(document.createTextNode(' '));	// prépare texte
		bulle.appendChild(bulleHaut);
		var bulleBas = document.createElement('div');
		bulleBas.style.display = 'block';
		bulleBas.style.whiteSpace = "nowrap";
		bulleBas.style.paddingRight = '3px';

		//bulleBas.appendChild(document.createTextNode(' '));	// prépare texte
		bulle.appendChild(bulleBas);
		div2_carte.appendChild(bulle);
		var affichePosition = function(evt) {
			if (evt.offsetX) {
				var xsouris = evt.offsetX;
				var ysouris = evt.offsetY;
				var xpos = evt.clientX;
				var ypos = evt.clientY + document.body.scrollTop;
			}
			else {
				var xsouris = evt.layerX;
				var ysouris = evt.layerY;
				var xpos = evt.pageX;
				var ypos = evt.pageY;
			}
			var xUser = Math.round(((xsouris - decalh) / coeff) - 100);// l'inverse de decalh+coeff*(val+100);
			var yUser = Math.round(100-((ysouris - decalv) / coeff));// l'inverse de decalv+coeff*(100-val);
			bulleHaut.firstChild.nodeValue = 'x=' + xUser + ', y=' + yUser;
			var tabHTMLbas = [];
			// message pour les trous
			for (var i in position_trous_MZ) {
				var ceTrou = position_trous_MZ[i];
				var dist = (xUser-ceTrou[0])*(xUser-ceTrou[0])+(yUser-ceTrou[1])*(yUser-ceTrou[1])-ceTrou[2];
				if(dist <= 0) {
					tabHTMLbas.push("Trous de Météorite : n=-1 -> n="+ceTrou[4]);
					break;
				}
			}
			// messages pour les suivants
			for (var i in tabDepl) {
				var ceGowap = tabDepl[i][0];	// position courante du suivant
				if (Math.abs(xUser - ceGowap.x) < 3 && Math.abs(yUser - ceGowap.y) < 3)
					tabHTMLbas.push('(' + ceGowap.x + ', ' + ceGowap.y + ', ' + ceGowap.n + ') ' + ceGowap.id + ' ' + ceGowap.nom);
			}
			bulleBas.innerHTML = tabHTMLbas.join('<br />');
			bulle.style.top = (ysouris+8) + 'px';
			bulle.style.left = (xsouris+16) + 'px';
		};
		addEvent(dessin, "mousemove", affichePosition, true);
		addEvent(dessin, "mouseout", function() { bulle.style.visibility = 'hidden' }, true);
		addEvent(dessin, "mouseover",  function() { bulle.style.visibility = 'visible' }, true);

		// dessin initial
		dessine_carte();

		this.getElt = function() {return div1_carte;};

	} catch (e) {window.console.log(traceStack(e, 'carte_MZ'))}
}

/**********************
* analyse de la vue pour produire un objet
* Raistlin 25/09/2020, intégré par Roule
*
* en mode objet car ça permet d'isoler les noms
/**********************/

var MZ_AnalyseVue = {	// ceci est un OBJET stocké comme une variable globale
	sectionList: {
		"Monstre":"VueMONSTRE",
		"Troll":"VueTROLL",
		"Tresor":"VueTRESOR",
		"Champignon":"VueCHAMPIGNON",
		"Lieu":"VueLIEU",
		"Cenotaphe":"VueCADAVRE"
	},
	columnTranslation: {
		"Dist.":"distance",
		"Actions":"actions",
		"Réf.":"Id",
		"Nom":"nom",
		"X":"x",
		"Y":"y",
		"N":"n",
		"Niv.":"niveau",
		"Type":"nom",
		"Race":"race",
		"Champignon":"nom",
	},

	getSectionVueColsHeader: function(section){
		var colList = [];
		for (let col of document.getElementById(section).childNodes[0].childNodes[0].childNodes) {
			if (typeof col.innerText !== 'undefined') colList.push(col.innerText);
		}
		return colList;
	},

	getSectionVueLines: function(section){
		var sectionArray=[];
		for (let line of document.getElementById(section).childNodes[1].childNodes){
			let lineArray = [];
			for (let field of line.childNodes) {
				lineArray.push(field.innerText);
			}
				sectionArray.push(lineArray);
		}
		return sectionArray;
	},

	htmlToObj: function(){
		this.oVue = {};
		for(let section in this.sectionList) {
			let sectionColList = this.getSectionVueColsHeader(this.sectionList[section]);
			let sectionLineList = this.getSectionVueLines(this.sectionList[section]);
			let oSection=[];
			for (let line in sectionLineList) {
				let oElement = {};
				for(let col in sectionColList) {
					let colTranslated = this.columnTranslation[sectionColList[col]];
					if (!colTranslated) continue;
					oElement[colTranslated]=sectionLineList[line][col];
				}
				oSection.push(oElement);
			}
			this.oVue[section] = oSection;
		}
		this.oVue['caseOrigine'] = {"x":MY_getValue(numTroll+".position.X"), "y":MY_getValue(numTroll+".position.Y"), "n":MY_getValue(numTroll+".position.N")};
	},

	messageHandler: function (event) {
		if (MY_DEBUG) window.console.log('get event, origin=' + event.origin);
		if (MY_DEBUG) window.console.log('get event, data=' + event.data);
		if (MY_DEBUG) window.console.log('sendVueExterne, domaine=' + MZ_AnalyseVue.domaine);
		MZ_AnalyseVue.otherTab.postMessage(MZ_AnalyseVue.oVue, MZ_AnalyseVue.domaine);
	},

	openVueExterne: function(url) {
		window.addEventListener("message", this.messageHandler);
		// extraire le hostname, on en aura besoin dans sendVueExterne
		var oURL = new URL(url);
		this.htmlToObj();
		//if (MY_DEBUG) window.console.log(JSON.stringify(this.oVue));
		this.url = url;
		this.domaine = oURL.protocol + '//' + oURL.hostname;
		this.otherTab = window.open(url, 'vueExtnMZ');
		// l'onglet (ou fenêtre) va envoyer un message quand il sera prêt et on lui enevrra la vue alors (fonction messageHandler)
	},
};


/**********************************************************
**** Fin de zone à déplacer dans une bibli commune ********
**********************************************************/

/* DEBUG: NETTOYAGE TAGS */
if(MY_getValue(numTroll+'.TAGSURL')) {
	MY_removeValue(numTroll+'.TAGSURL');
}

// Alerte si mode dev
if (isDEV) {
	var divpopup = document.createElement('div');
	divpopup.id = 'divDEV';
	divpopup.style =
		'position: fixed;'+
		'border: 15px solid red;'+
		'top: 10px;right: 10px;'+
		'background-color: white;'+
		'color: black;'+
		'font-size: large;'+
		'padding: 5px'+
		'z-index: 200;';
	appendText(divpopup, '[MZ] Mode DEV');
	divpopup.title = 'Pour revenir en mode normal, \nshift-click sur le mot "Crédits" dans Options/Pack Graphique';
	document.body.appendChild(divpopup);
}

/*---------- regroupement des getPortee() ------------------------------------*/

function getPortee(param) {
	param = Math.max(0,Number(param));
	return Math.ceil( Math.sqrt( 2*param+10.75 )-3.5 );
	// ça devrait être floor, +10.25, -2.5
}

/*-[functions]----------- Calculs expérience / niveau ------------------------*/

function getPXKill(niv) {
	if (nivTroll == undefined) return '? (visitez le profil privé)';
	return Math.max(0,10+3*niv-2*nivTroll);
	}

function getPXDeath(niv) {
	if (nivTroll == undefined) return '? (visitez le profil privé)';
	return Math.max(0,10+3*nivTroll-2*niv);
	}

function analysePX(niv) {
	niv = niv+'';
	var i = niv.indexOf('+');
	if(i!=-1) // si niv = 'XX+' ??
		return ' --> \u2265 <b>'+getPXKill(niv.slice(0,i))+'</b> PX';
	i = niv.slice(1).indexOf('-'); // si niv = 'XX-YY' ??
	if(i!=-1) {
		var max = getPXKill(niv.slice(i+2));
		if(max==0)
			return ' --> <b>0</b> PX';
		return ' --> <b>'+getPXKill(niv.slice(0,i+1))
			+'</b> \u2264 PX \u2264 <b>'+max+'</b>';
		}
	i = niv.indexOf('='); // ???
	if(i!=-1) {
		var max = getPXKill(niv.slice(i+1));
		return max==0 ? ' --> <b>0</b> PX' : ' --> \u2264 <b>'+max+'</b> PX';
		}
	return ' --> <b>'+getPXKill(niv)+'</b> PX';
	}

function analysePXTroll(niv) {
	var str = analysePX(niv);
	str += '<br/>Vous lui rapportez <b>'+getPXDeath(niv)+'</b> PX.';
	return str;
	}


/*-[functions]------------- Gestion Compos / Champis -------------------------*/
// Refonte totale du code de Zorya

// Elements à implémenter en dur dans MZ2.0
var numQualite = {
	'Très Mauvaise':1,
	'Mauvaise':2,
	'Moyenne':3,
	'Bonne':4,
	'Très Bonne':5
	};

var qualiteNum = [
	'_dummy_',
	'Très Mauvaise',
	'Mauvaise',
	'Moyenne',
	'Bonne',
	'Très Bonne'
	];

var nival = {
	'Abishaii Bleu':19,
	'Abishaii Noir':10,
	'Abishaii Rouge':23,
	'Abishaii Vert':15,
	'Ame-en-peine':8,
	'Amibe Geante':9,
	'Anaconda des Catacombes':8,
	'Ankheg':10,
	'Anoploure Purpurin':36,
	'Araignee Geante':2,
	'Ashashin':35,
	'Balrog':50,
	'Banshee':16,
	'Barghest':36,
	'Basilisk':11,
	'Behemoth':34,
	'Behir':14,
	'Beholder':50,
	'Boggart':3,
	'Bondin':9,
	"Bouj'Dla Placide":37,
	"Bouj'Dla":19,
	'Bulette':19,
	'Caillouteux':1,
	'Capitan':35,
	'Carnosaure':25,
	'Champi-Glouton':3,
	'Chauve-Souris Geante':4,
	'Cheval a Dents de Sabre':23,
	'Chevalier du Chaos':20,
	'Chimere':13,
	'Chonchon':24,
	'Coccicruelle':22,
	'Cockatrice':5,
	'Crasc Medius':17,
	'Crasc Maexus':25,
	'Crasc':10,
	'Croquemitaine':6,
	'Cube Gelatineux':32,
	'Daemonite':27,
	'Diablotin':5,
	'Dindon du Chaos':1,
	'Djinn':29,
	'Ectoplasme':18,
	'Effrit':27,
	"Elementaire d'Air":23,
	"Elementaire d'Eau":17,
	'Elementaire de Feu':21,
	'Elementaire de Terre':21,
	'Elementaire du Chaos':26,
	'Erinyes':7,
	'Esprit-Follet':16,
	'Essaim Craterien':30,
	'Essaim Sanguinaire':25,
	'Ettin':8,
	'Familier':1,
	'Fantome':24,
	'Feu Follet':20,
	'Flagelleur Mental':33,
	'Foudroyeur':38,
	'Fumeux':22,
	'Fungus Geant':9,
	'Fungus Violet':4,
	'Furgolin':10,
	'Gargouille':3,
	'Geant de Pierre':13,
	'Geant des Gouffres':22,
	"Geck'oo Majestueux":40,
	"Geck'oo":15,
	'Glouton':20,
	'Gnoll':5,
	'Gnu Domestique':1,
	'Gnu Sauvage':1,
	'Goblin':4,
	'Goblours':4,
	"Golem d'Argile":15,
	'Golem de cuir':1,
	'Golem de Chair':8,
	'Golem de Fer':31,
	'Golem de mithril':1,
	'Golem de metal':1,
	'Golem de papier':1,
	'Golem de Pierre':23,
	'Gorgone':11,
	'Goule':4,
	'Gowap Apprivoise':1,
	'Gowap Sauvage':1,
	'Gremlins':3,
	'Gritche':39,
	'Grouilleux':4,
	'Grylle':31,
	'Harpie':4,
	'Hellrot':18,
	'Homme-Lezard':4,
	'Hurleur':8,
	'Hydre':50,
	'Incube':13,
	'Kobold':2,
	'Labeilleux':26,
	'Lezard Geant':5,
	'Liche':50,
	'Limace Geante':10,
	'Loup-Garou':8,
	'Lutin':4,
	'Mante Fulcreuse':30,
	'Manticore':9,
	'Marilith':33,
	'Meduse':6,
	'Megacephale':38,
	'Mille-Pattes Geant':14,
	'Mimique':6,
	'Minotaure':7,
	'Molosse Satanique':8,
	'Momie':4,
	'Monstre Rouilleur':3,
	"Mouch'oo Domestique":14,
	"Mouch'oo Majestueux Sauvage":33,
	"Mouch'oo Sauvage":14,
	'Na-Haniym-Heee':0,
	'Necrochore':37,
	'Necromant':39,
	'Necrophage':8,
	'Naga':10,
	'Nuee de Vermine':13,
	"Nuage d'Insectes":7,
	'Ogre':7,
	'Ombre de Roches':13,
	'Ombre':2,
	'Orque':3,
	'Ours-Garou':18,
	'Palefroi Infernal':29,
	'Phoenix':32,
	'Pititabeille':0,
	'Plante Carnivore':4,
	'Pseudo-Dragon':5,
	'Rat Geant':2,
	'Rat-Garou':3,
	'Rocketeux':5,
	'Sagouin':3,
	'Scarabee Geant':4,
	'Scorpion Geant':10,
	'Shai':28,
	'Sirene':8,
	'Slaad':5,
	'Sorciere':17,
	'Spectre':14,
	'Sphinx':30,
	'Squelette':1,
	'Strige':2,
	'Succube':13,
	'Tertre Errant':20,
	'Thri-kreen':10,
	'Tigre-Garou':12,
	'Titan':26,
	'Trancheur':35,
	'Tubercule Tueur':14,
	'Tutoki':4,
	'Vampire':29,
	'Ver Carnivore Geant':12,
	'Ver Carnivore':11,
	'Veskan Du Chaos':14,
	'Vouivre':33,
	'Worg':5,
	'Xorn':14,
	'Yeti':8,
	'Yuan-ti':15,
	'Zombie':2
	}

var tabEM = {
	//Monstre: [Compo exact, Sort, Position, Localisation]
	// AA
	'Basilisk':["Œil d'un ","Analyse Anatomique",3,"Tête"],
	// AE
	'Ankheg':["Carapace d'un","Armure Ethérée",3,"Spécial"],
	'Rocketeux':["Tripes d'un","Armure Ethérée",4,"Corps"],
	// AdA
	'Loup-Garou':["Bras d'un","Augmentation de l'Attaque",3,"Membre"],
	'Titan':["Griffe d'un","Augmentation de l'Attaque",4,"Membre"],
	// AdE
	'Erinyes':["Plume d'une","Augmentation de l'Esquive",3,"Membre"],
	'Palefroi Infernal':["Sabot d'un","Augmentation de l'Esquive",4,"Membre"],
	// AdD
	'Manticore':["Patte d'une","Augmentation des Dégâts",3,"Membre"],
	'Trancheur':["Griffe d'un","Augmentation des Dégâts",4,"Membre"],
	// BAM
	'Banshee':["Peau d'une","Bulle Anti-Magie",3,"Corps"],
	// BuM
	'Essaim Sanguinaire':["Pattes d'un","Bulle Magique",3,"Membre"],
	'Sagouin':["Patte d'un","Bulle Magique",4,"Membre"],
	'Effrit':["Cervelle d'un","Bulle Magique",5,"Tête"],
	// Explo
	'Diablotin':["Cœur d'un","Explosion",3,"Corps"],
	'Chimère':["Sang d'une","Explosion",4,"Corps"],
	'Barghest':["Bave d'un","Explosion",5,"Spécial"],
	// FP
	'Nécrophage':["Tête d'un","Faiblesse Passagère",3,"Tête"],
	'Vampire':["Canine d'un","Faiblesse Passagère",4,"Spécial"],
	// FA
	'Gorgone':["Chevelure d'une","Flash Aveuglant",3,"Tête"],
	'Géant des Gouffres':["Cervelle d'un","Flash Aveuglant",4,"Tête"],
	// Glue
	'Limace Géante':["Mucus d'une","Glue",3,"Spécial"],
	'Grylle':["Gueule d'un","Glue",4,"Tête"],
	// GdS
	'Abishaii Noir':["Serre d'un","Griffe du Sorcier",3,"Membre"],
	'Vouivre':["Venin d'une","Griffe du Sorcier",4,"Spécial"],
	'Araignée Géante':["Mandibule d'une","Griffe du Sorcier",5,"Spécial"],
	// Invi
	"Nuage d'Insectes":["Chitine d'un","Invisibilité",3,"Spécial"],
	'Yuan-ti':["Cervelle d'un","Invisibilité",4,"Tête"],
	'Gritche':["Epine d'un","Invisibilité",5,"Spécial"],
	// Lévitation
	// ???
	// PréM :
	'Ashashin':["Œil d'un ","Précision Magique",3,"Tête"],
	'Crasc':["Œil Rougeoyant d'un ","Précision Magique",4,"Tête"],
	// Proj
	'Yéti':["Jambe d'un","Projection",3,"Membre"],
	'Djinn':["Tête d'un","Projection",4,"Tête"],
	// PuM :
	'Incube':["Épaule musclée d'un","Puissance Magique",3,"Membre"],
	'Capitan':["Tripes Puantes d'un","Puissance Magique",4,"Corps"],
	// Sacro
	'Sorcière':["Verrue d'une","Sacrifice",3,"Spécial"],
	// Télék
	'Plante Carnivore':["Racine d'une","Télékinésie",3,"Spécial"],
	'Tertre Errant':["Cervelle d'un","Télékinésie",4,"Tête"],
	// TP
	'Boggart':["Main d'un","Téléportation",3,"Membre"],
	'Succube':["Téton Aguicheur d'une","Téléportation",4,"Corps"],
	'Nécrochore':["Os d'un","Téléportation",5,"Corps"],
	// VA
	'Abishaii Vert':["Œil d'un","Vision Accrue",3,"Tête"],
	// VL
	'Fungus Géant':["Spore d'un","Vision Lointaine",3,"Spécial"],
	'Abishaii Rouge':["Aile d'un","Vision Lointaine",4,"Membre"],
	// VlC
	'Zombie':["Cervelle Putréfiée d'un","Voir le Caché",3,"Tête"],
	'Shai':["Tripes d'un","Voir le Caché",4,"Corps"],
	'Phoenix':["Œil d'un","Voir le Caché",5,"Tête"],
	// VT
	'Naga':["Ecaille d'un","Vue Troublée",3,"Corps"],
	'Marilith':["Ecaille d'une","Vue Troublée",4,"Membre"],
	// Variables
	'Rat':["d'un"],
	'Rat Géant':["d'un"],
	'Dindon':["d'un"],
	'Goblin':["d'un"],
	'Limace':["d'une"],
	'Limace Géante':["d'une"],
	'Ver':["d'un"],
	'Ver Carnivore':["d'un"],
	'Ver Carnivore Géant':["d'un"],
	'Fungus':["d'un"],
	'Vouivre':["d'une"],
	'Gnu':["d'un"],
	'Scarabée':["d'un"]
	};

var mundiChampi = {
	'Préscientus Reguis':'du Phoenix',
	'Amanite Trolloïde':'de la Mouche',
	'Girolle Sanglante':'du Dindon',
	'Horreur Des Prés':'du Gobelin',
	'Bolet Péteur':'du Démon',
	'Pied Jaune':'de la Limace',
	'Agaric Sous-Terrain':'du Rat',
	'Suinte Cadavre':"de l'Hydre",
	'Cèpe Lumineux':'du Ver',
	'Fungus Rampant':'du Fungus',
	'Nez Noir':'de la Vouivre',
	'Pleurote Pleureuse':'du Gnu',
	'Phytomassus Xilénique':'du Scarabée'
	};

function addInfoMM(node,mob,niv,qualite,effetQ) {
	appendText(node,' ');
	var urlImg = URL_MZimg
		+'Competences/melangeMagique.png';
	var text = ' [-'+(niv+effetQ)+' %]';
	var str = '';
	switch(mob[0]) {
		case 'A':
		case 'E':
		case 'I':
		case 'O':
		case 'U':
			str = "Compo d'";
			break;
		default:
			str = 'Compo de ';
		}
	var title = str+mob+' : -'+niv+'\nQualité '+qualite+' : -'+effetQ;
	var span = createImageSpan(urlImg,'MM:',title,text);
	node.appendChild(span);
	}

function addInfoEM(node,mob,compo,qualite,localisation) {
	if(!tabEM[mob]) return;
	var title = 'Composant variable', texte = 'Variable';
	var bold = false;
	if(tabEM[mob].length>1) {
		var pc = 5*(numQualite[qualite]-tabEM[mob][2]);
		if(tabEM[mob][0].indexOf(compo)==-1) pc -= 20;
		if(localisation.indexOf(tabEM[mob][3])==-1) pc -= 5;
		if(pc<-20) return;
		if(pc>=0) bold = true;
		texte = aff(pc)+'%';
		title = texte+" pour l'écriture de "+tabEM[mob][1];
		}
	var urlImg = URL_MZimg
		+'Competences/ecritureMagique.png';
	var span = createImageSpan(urlImg,'EM:',title,' ['+texte+']',bold);
	node.appendChild(span);
	}

function insererInfosEM(tbody) {
	// lancé par equip, equipgowap
	var trCompos = document.evaluate(
		"./tr[not(starts-with(td[2]/img/@alt,'Pas'))]",
		tbody,null,7,null);
	var strCompos = '';
	for(var i=0 ; i<trCompos.snapshotLength ; i++) {
		var node = trCompos.snapshotItem(i).childNodes[7];
		var str = node.firstChild.textContent;
		var compo = trim(str.slice(0,str.indexOf(" d'un")));
		var mob = trim(str.slice(str.indexOf("d'un")+5));
		// Si non-EM on stoppe le traitement
		if(!tabEM[mob]) continue;
		str = trCompos.snapshotItem(i).childNodes[9].textContent;
		var qualite = trim(str.slice(str.indexOf('Qualit')+9));
		var localisation = trim(str.slice(0,str.indexOf(' |')));
		addInfoEM(node,mob,compo,qualite,localisation);
		}
	}

function getQualite(qualite) {
	var nb = numQualite[qualite];
	return nb ? nb-1 : -1;
	}

function getEM(nom) {
	if(nom.indexOf('[')!=-1)
		nom = trim(nom.substring(0,nom.indexOf('[')));
	if(tabEM[nom]) return nom;
	return '';
	}

// DEBUG ex-fonction composantEM
function compoMobEM(mob) {
	if(!tabEM[mob]) return '';
	if(tabEM[mob].length==1)
		return 'Divers composants '+tabEM[mob][0]+' '+mob+' (Composant Variable)';
	return tabEM[mob][0]+' '+mob+" (Qualité "+qualiteNum[tabEM[mob][2]]
			+") pour l'écriture de "+tabEM[mob][1];
	}

// DEBUG ex-fonction compoEM
function titreCompoEM(mob,compo,localisation,qualite) {
	if(!tabEM[mob]) return '';
	if(tabEM[mob].length==1) return 'Composant variable';

	var pc = 5*(tabEM[mob][2]-numQualite[qualite]);
	if(compo.indexOf(tabEM[mob][0])==-1) pc -= 20;
	if(localisation.indexOf(tabEM[mob][3])==-1) pc -= 5;

	if(pc>=-20) return pc+"% pour l'écriture de "+tabEM[mob][2];
	return '';
	}

// DEBUG - rétrocompatibilité
function compoEM(mob) {
	// appelé dans libs, vue
	return compoMobEM(mob);
	}
function composantEM(mob,compo,localisation,qualite) {
	// appelé dans libs, tancompo
	return titreCompoEM(mob,compo,localisation,qualite);
	}
//


/*-[functions]-------------- Stockage des Talents ----------------------------*/

arrayTalents = {
	/* Compétences */
	'Acceleration du Metabolisme':'AM',
	'Attaque Precise':'AP',
	'Balayage':'Balayage',
	//'Balluchonnage':'Ballu',
	'Baroufle':'Baroufle',
	'Bidouille':'Bidouille',
	'Botte Secrete':'BS',
	'Camouflage':'Camou',
	'Charger':'Charger',
	'Connaissance des Monstres':'CdM',
	'Construire un Piege':'Piege',
	'Piege a Feu':'PiegeFeu',
	'Piege a Glue':'PiegeGlue',
	'Contre-Attaquer':'CA',
	'Coup de Butoir':'CdB',
	'Course':'Course',
	'Deplacement Eclair':'DE',
	'Dressage':'Dressage',
	'Ecriture Magique':'EM',
	'Frenesie':'Frenesie',
	'Golemologie':'Golemo',
	'Golem de cuir':'GolemCuir',
	'Golem de metal':'GolemMetal',
	'Golem de mithril':'GolemMithril',
	'Golem de papier':'GolemPapier',
	'Grattage':'Grattage',
	'Hurlement Effrayant':'HE',
	'Identification des Champignons':'IdC',
	'Insultes':'Insultes',
	'Lancer de Potions':'LdP',
	'Marquage':'Marquage',
	'Melange Magique':'Melange',
	'Miner':'Miner',
	'Travail de la Pierre':'Pierre',
	'Necromancie':'Necro',
	'Painthure de Guerre':'PG',
	'Parer':'Parer',
	'Pistage':'Pistage',
	'Planter un Champignon':'PuC',
	'Regeneration Accrue':'RA',
	'Reparation':'Reparation',
	'Retraite':'Retraite',
	'RotoBaffe':'RB',
	'Shamaner':'Shamaner',
	"S'interposer":'SInterposer',
	'Tailler':'Tailler',
	//'Vol':'Vol',
	/* Sortilèges */
	'Analyse Anatomique':'AA',
	'Armure Etheree':'AE',
	'Augmentation de l´Attaque':'AdA', // obsolète?
	"Augmentation de l'Attaque":'AdA',
	'Augmentation de l´Esquive':'AdE',
	'Augmentation des Degats':'AdD',
	'Bulle Anti-Magie':'BAM',
	'Bulle Magique':'BuM',
	'Explosion':'Explo',
	'Faiblesse Passagere':'FP',
	'Flash Aveuglant':'FA',
	'Glue':'Glue',
	'Griffe du Sorcier':'GdS',
	'Hypnotisme':'Hypno',
	'Identification des Tresors':'IdT',
	'Invisibilite':'Invi',
	'Levitation':'Levitation',
	'Precision Magique':'PreM',
	'Projectile Magique':'Projo',
	'Projection':'Proj',
	'Puissance Magique':'PuM',
	'Rafale Psychique':'Rafale',
	'Sacrifice':'Sacro',
	'Siphon des ames':'Siphon',
	'Telekinesie':'Telek',
	'Teleportation':'TP',
	'Vampirisme':'Vampi',
	'Vision Accrue':'VA',
	'Vision lointaine':'VL',
	'Voir le Cache':'VlC',
	'Vue Troublee':'VT'
	//'':''
}

// DEBUG - Pour rétrocompatibilité
function getSortComp(nom,niveau) {
	return getTalent(nom,niveau);
}
//

function getTalent(nom,niveau) {
	if(nom===true) return true;
	var nomEnBase = arrayTalents[epure(nom)];
	if(!nomEnBase) nomEnBase=nom;
	if(!niveau) var niveau = '';
	if(MY_getValue(numTroll+'.talent.'+nomEnBase+niveau))
		return Number(MY_getValue(numTroll+'.talent.'+nomEnBase+niveau));
	return 0;
}

function removeAllTalents() {
	for(var talent in arrayTalents) {
		var nomEnBase = arrayTalents[talent];
		if(MY_getValue(numTroll+'.talent.'+nomEnBase)) {
			MY_removeValue(numTroll+'.talent.'+nomEnBase);
			continue;
		}
		var niveau = 1;
		while(MY_getValue(numTroll+'.talent.'+nomEnBase+niveau)) {
			MY_removeValue(numTroll+'.talent.'+nomEnBase+niveau);
			niveau++;
		}
	}
}

function isProfilActif() { // DEBUG: Réfléchir à l'utilité de cette fonction
	try {	// Roule 07/06/2017 protection, ça plante si on est dans une callback de XMLHTTPREQUEST
		var att = MY_getValue(numTroll+'.caracs.attaque');
		var attbmp = MY_getValue(numTroll+'.caracs.attaque.bmp');
		var attbmm = MY_getValue(numTroll+'.caracs.attaque.bmm');
		var mm = MY_getValue(numTroll+'.caracs.mm');
		var deg = MY_getValue(numTroll+'.caracs.degats');
		var degbmp = MY_getValue(numTroll+'.caracs.degats.bmp');
		var degbmm = MY_getValue(numTroll+'.caracs.degats.bmm');
		var vue = parseInt(MY_getValue(numTroll+'.caracs.vue'));
		var bmvue = parseInt(MY_getValue(numTroll+'.caracs.vue.bm'));
		if(att==null || attbmp==null || attbmm==null || mm==null || deg==null
			|| degbmp==null || degbmm==null || vue==null || bmvue==null)
			return false;
		return true;
	} catch(e) {
		return false;
	}
}


/*-[functions]---------------- Gestion des CDMs ------------------------------*/

function getPVsRestants(pv,bless,vue) {
	bless = Number(bless.match(/\d+/)[0]);
	if(bless==0) return null;
	var pvminmax = pv.match(/\d+/g);
	var oMinMaxPV = {min: pvminmax[0], max: pvminmax[1]};
	var oMinMaxPVRestant = MZ_getPVsRestants(oMinMaxPV, bless);
	if (vue) {
		if (oMinMaxPVRestant.min) {
			if (oMinMaxPVRestant.max) {
				return ' (' + oMinMaxPVRestant.min + '-' + oMinMaxPVRestant.max + ')';
			} else {
				return " (\u2A7E" + oMinMaxPVRestant.min + ')';	// U+2A7E "GREATER-THAN OR SLANTED EQUAL TO"
			}
		} else {
			if (oMinMaxPVRestant.max) {
				return " (\u2A7D" + oMinMaxPVRestant.max + ')';	// U+2A7D "LESS-THAN OR SLANTED EQUAL TO"
			} else {
				return '';
			}
		}
	}
	var oRet = ['Points de Vie restants : '];
	if (oMinMaxPVRestant.min) {
		if (oMinMaxPVRestant.max) {
			oRet[1] = 'Entre '+oMinMaxPVRestant.min+' et '+oMinMaxPVRestant.max;
		} else {
			oRet[1] = "\u2A7E" + oMinMaxPVRestant.min;	// U+2A7E "GREATER-THAN OR SLANTED EQUAL TO"
		}
	} else {
		if (oMinMaxPVRestant.max) {
			oRet[1] = "\u2A7D" + oMinMaxPVRestant.max;	// U+2A7D "LESS-THAN OR SLANTED EQUAL TO"
		} else {
			oRet[1] = 'inconnu';
		}
	}
	return oRet;
/* à supprimer
	if(bless==95) {
		var pvb = 1;
		var pvh = Math.floor( pvminmax[1]/20 );
		}
	else if(bless==5) {
		var pvb = Math.floor( pvminmax[0]*19/20 );
		var pvh = pvminmax[1];
		}
	else {
		var pvb = Math.ceil( pvminmax[0]*(95-bless) / 100 );
		var pvh = Math.floor( pvminmax[1]*(105-bless) / 100 );
		}
	return vue ? ' ('+pvb+'-'+pvh+')' :
		['Points de Vie restants : ','Entre '+pvb+' et '+pvh];
	}
*/
}

function MZ_getPVsRestants(oMinMaxPV, bless) {	// rend un objet minmax
	var oRet = {};
	if(bless==95) {
		oRet.min = 1;
		if (oMinMaxPV.max) oRet.max = Math.floor( oMinMaxPV.max/20);
	} else if(bless==5) {
		if (oMinMaxPV.min) oRet.min = Math.floor( oMinMaxPV.min*19/20);
		if (oMinMaxPV.max) oRet.max = oMinMaxPV.max;
	} else {
		if (oMinMaxPV.min) oRet.min = Math.ceil( oMinMaxPV.min*(95-bless) / 100);
		if (oMinMaxPV.max) oRet.max = Math.floor( oMinMaxPV.max*(105-bless) / 100);
	}
	return oRet;
}

/* tentative via jQuery abandonnée
function insertButtonCdmSmartphone_to_delete(nextName,onClick,texte) {
	if (window.jQuery == undefined) return;
	//window.console.log('jQuery OK');
	var eInput = $('[name="' + nextName + '"]');
	if (!eInput) return;
	//window.console.log('eInput OK');
	var eDiv = eInput.closest("div");
	if (!eDiv) return;
	//window.console.log('eDiv OK');
	var newDiv = eDiv.clone();
	var newSpan = newDiv.children('span');
	newSpan.children(':first-child').text(texte);
	var newInput = newDiv.children('input');
	newInput.removeAttr('onclick');
	newInput.click(onClick);
	newInput.val(texte);
	newInput.removeAttr("type").attr("type", "button");
	var eForm = eDiv.parent();
	window.console.log("insertButtonCdmSmartphone tag newdiv=" + newDiv.prop('tagName') + ', parent tag=' + eForm.prop('tagName'));
	eForm.prepend(newDiv);
	return true;
}

function insertButtonCdmSmartphone(nextName,onClick,texte) {
	var tabInput = document.getElementsByName(nextName);
	if (!tabInput) return;
	var eInput = tabInput[0];
	if (!eInput) return;
	//window.console.log('eInput OK');
	var eDiv = eInput.parentNode;
	if (!eDiv) return;
	window.console.log('eDiv.outerHTML=' + eDiv.outerHTML);
	var eNewDiv = eDiv.cloneNode(true);
	window.console.log('eNewDiv.outerHTML=' + eNewDiv.outerHTML);
	var tabNewSpan = eNewDiv.getElementsByTagName('span');
	if (!tabNewSpan) return;
	window.console.log('tabNewSpan lg=' + tabNewSpan.length);
	if (tabNewSpan.length == 0) return;
	tabNewSpan.forEach(function(pSpan) {
		if (pSpan.getElementsByTagName('span').length > 0) return;
		window.console.log('newSpan old text=' + pSpan.innerText);
		while (pSpan.firstChild) pSpan.removeChild(pSpan.firstChild);	// vider
		pSpan.appendChild(document.createTextNode(texte));
	});
	var tabNewInput = eNewDiv.getElementsByTagName('input');
	if (!tabNewInput) return;
	var eNewInput = tabNewInput[0];
	if (!eNewInput) return;
	eNewInput.removeAttr('onclick');
	eNewInput.onClick = onClick;
	eNewInput.value = texte;
	eNewInput.type = "button";
	var eForm = eDiv.parentNode;
	window.console.log("insertButtonCdmSmartphone tag eNewDiv=" + eNewDiv.nodeName + ', parent tag=' + eForm.nodeName);
	eForm.insertBefore(eNewDiv, eForm.firstChild);
	return true;
}
*/

function insertButtonCdm(nextName,onClick,texte) {
	if (texte==null) texte = 'Participer au bestiaire';
	//if (insertButtonCdmSmartphone(nextName,onClick,texte)) return;

	var nextNode = document.getElementsByName(nextName)[0];
	var espace = document.createTextNode('\t');
	insertBefore(nextNode,espace);

	var button = document.createElement('input');
	button.type = 'button';
	button.className = 'mh_form_submit';
	button.value = texte;
	button.onmouseover = function(){this.style.cursor='pointer';};
	if (onClick)   button.onclick = onClick;
	insertBefore(espace,button);
	return button;
	}

function createCDMTable(id,nom,donneesMonstre, closeFunct) {	// rend un Élément Table
try {
	var table = document.createElement('table');
	var profilActif = isProfilActif();
	table.className = 'mh_tdborder';
	table.border = 0;
	table.cellSpacing = 1;
	table.cellPadding = 4;

	var thead = document.createElement('thead');
	var tr = appendTr(thead,'mh_tdtitre');
	var td = appendTdText(tr, 'CDM de ' + nom + ' (N° '+ id + ')', false);
	td.style.fontWeight = 'bold';
	if (closeFunct) {
		td.colSpan = 2;
		td.style.borderRight = 'none';
		td = appendTdText(tr, 'X', false);
		td.style.cursor = 'pointer';
		td.style.textAlign = 'right';
		td.style.fontWeight = 'bold';
		td.style.width = '1%';
		td.style.borderLeft = 'none';
		td.onclick = closeFunct;
	} else {
		td.colSpan = 3;
	}
	table.appendChild(thead);
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);

	// calcul des PX gagnés
	var ominmaxPX = {};
	if (donneesMonstre.niv) {
		if (donneesMonstre.niv.min) ominmaxPX.min = getPXKill(donneesMonstre.niv.min);
		if (donneesMonstre.niv.max) ominmaxPX.max = getPXKill(donneesMonstre.niv.max);
	}

	MZ_tab_carac_add_tr_minmax2(tbody, 'Niveau', donneesMonstre.niv, 'PX', ominmaxPX);
	MZ_tab_carac_add_tr_texte(tbody, 'Famille', donneesMonstre.fam, '');
	//MZ_tab_carac_add_tr_texte(tbody, 'Génération', donneesMonstre.gen == 23 ? '2 ou 3' : donneesMonstre.gen, '');	// remplacé par une icône
	MZ_tab_carac_add_tr_texte(tbody, 'Blessure', MZ_tab_carac_mkBlessureTexte(donneesMonstre), '');
	MZ_tab_carac_add_tr_minmax(tbody, 'Points de Vie', donneesMonstre.pv, 'PV');
	MZ_tab_carac_add_tr_minmax(tbody, 'Attaque', donneesMonstre.att, 'D6');
	MZ_tab_carac_add_tr_minmax(tbody, 'Esquive', donneesMonstre.esq, 'D6');
	MZ_tab_carac_add_tr_minmax(tbody, 'Dégâts', donneesMonstre.deg, 'D3');
	MZ_tab_carac_add_tr_minmax(tbody, 'Régénération', donneesMonstre.reg, 'D3');
	MZ_tab_carac_add_tr_minmax(tbody, 'Armure physique', donneesMonstre.armP, '');
	MZ_tab_carac_add_tr_minmax(tbody, 'Armure magique', donneesMonstre.armM, '');
	MZ_tab_carac_add_tr_minmax(tbody, 'Armure totale', donneesMonstre.arm, '');
	MZ_tab_carac_add_tr_minmax(tbody, 'Vue', donneesMonstre.vue, 'Case(s)');
	MZ_tab_carac_add_tr_minmax(tbody, 'MM', donneesMonstre.MM, '');
	MZ_tab_carac_add_tr_minmax(tbody, 'RM', donneesMonstre.RM, '');
	MZ_tab_carac_add_tr_minmax(tbody, 'Durée du tour', donneesMonstre.duree, ' heures');
	MZ_tab_carac_add_tr_pouvoir(tbody, donneesMonstre);
	MZ_tab_carac_add_tr_autres(tbody, donneesMonstre, id, nom);
	/* à supprimer, remplacé par un "title" sur le 3e td de "autres"
	var msgInfo = MZ_carac_build_nb_cmd_msg(donneesMonstre);
	if (msgInfo) MZ_tab_carac_add_tr_sansTitre(tbody, msgInfo, 0, true);
	*/
	return table;
	}
	catch(e){window.alert('Erreur createCDMTable() :\n'+e);}
}

function MZ_tab_carac_mkBlessureTexte(donneesMonstre) {
	if (donneesMonstre.bless === undefined) return;
	var texte = donneesMonstre.bless + '%';
	if (donneesMonstre.bless > 0 && donneesMonstre.pv && donneesMonstre.pv.min && donneesMonstre.pv.max) {
		ominmax = MZ_getPVsRestants(donneesMonstre.pv, donneesMonstre.bless);
		texte += ' (' + ominmax.min + '-' + ominmax.max + ')';
	}
	if (donneesMonstre.timegmt) {
		texte += ' le ' + MZ_formatDateMS(new Date(donneesMonstre.timegmt * 1000), true);
	}
	return texte;
}

function MZ_tab_carac_add_tr_sansTitre(table, msg, bItalic) {
	if (!msg) return;
	var tr = appendTr(table,'mh_tdpage');
	td = appendTdText(tr,msg);
	td.colSpan = 3;
	if (bItalic) td.style.fontStyle = 'italic';
	td.className = 'mh_tdpage';
	return td;
}

function MZ_tab_carac_add_tr_pouvoir(tbody, donneesMonstre) {
	if (!donneesMonstre.pouv) return;
	var td = MZ_tab_carac_add_tr_texte(tbody, 'Pouvoir', donneesMonstre.pouv + ' ', '', 0);
	var tabImg = [];
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.portpouv, {
		'de zone': ["zone.gif","Pouvoir de zone"],
		'automatique': ["automatique.gif","Pouvoir automatique"],
		'au toucher': ["toucher.gif","Pouvoir au toucher"]});
	for (var iImg = 0; iImg < tabImg.length; iImg++) {
		var thisImg = tabImg[iImg];
		td.appendChild(createImage(URL_MZimg + thisImg[0],thisImg[1]));
	}
}

function MZ_tab_carac_add_tr_autres(table, donneesMonstre, id, nom) {
	var tabImg = [];
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.attd, {
		'1': ["distance.gif","Attaque à distance"],
		'~': ["cac.gif","Corps à corps"]});	// si absent
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.nb_att, {
		'1': ["1.gif","1 attaque par tour"],
		'2': ["2.gif","2 attaques par tour"],
		'3': ["3.gif","3 attaques par tour"],
		'4': ["4.gif","4 attaques par tour"],
		'5': ["5.gif","5 attaques par tour"],
		'6': ["6.gif","6 attaques par tour"],
		'999': ["plus.gif","Beaucoup d'attaques par tour"]});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.attm, {
		'1': ["magic-wand.png","Attaque magique"]});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.vole, {
		'1': ["levite.png","Lévite"]});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.vit, {
		'lente': ["lent.gif","Lent à se déplacer"],
		'normale': ["normal.gif","Vitesse normale de déplacement"],
		'rapide': ["rapide.gif","Déplacement rapide"]});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.charg, {
		'vide': [null,null],
		'~': ["charge2.gif", "Possède de l'équipement (" + donneesMonstre.charg + ")"]});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.vlc, {
		'1': ["oeil.gif","Voit le caché"]});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.gen, {
		'1': ["Phoenix1.png","Phœnix de première génération"],
		'2': ["Phoenix2.png","Phœnix de deuxième génération"],
		'3': ["Phoenix3.png","Phœnix de troisième génération"],
		'23': ["Phoenix23.png","Phœnix de deuxième ou troisième génération"],
		});

	var tr = appendTr(table,'mh_tdpage');
	var td = appendTdText(tr,'Autres',true);
	td.className = 'mh_tdtitre';
	td.width = MZ_EtatCdMs.tdWitdh;

	td = appendTd(tr);
	td.className = 'mh_tdpage';
	for (var iImg = 0; iImg < tabImg.length; iImg++) {
		var thisImg = tabImg[iImg];
		td.appendChild(createImage(URL_MZimg + thisImg[0],thisImg[1]));
	}
	if (donneesMonstre.esq != undefined) {
		td.appendChild(MZ_Tactique.createImage(id, nom));
	}

	var txt = String.fromCharCode(160);	// blanc insécable
	if (donneesMonstre.nCdM) txt = donneesMonstre.nCdM;
	var td2 = appendTdText(tr, txt);
	td2.title = MZ_carac_build_nb_cmd_msg(donneesMonstre);
	td2.style.width = '1%';
	var myColor = MZ_CdMColorFromMode(donneesMonstre);
	if (myColor) {
		td2.style.backgroundColor = myColor;
		td2.style.color = 'white';
	}

	return td;
}

function MZ_tab_carac_add_tr_one_img(tabImg, val, listCas) {
	if (val == undefined) return;
	//console.log('MZ_tab_carac_add_tr_one_img: val=' + val);
	var lVal = (val + '').toLowerCase();	// astuce : transformer le nombre en string (beurk !)
	if (listCas[lVal]) {
		var t = listCas[lVal];
		if (t[0] == null) return;
		tabImg.push(t);
	} else if (listCas['~']) {
		tabImg.push(listCas['~']);
	}
}

function MZ_tab_carac_add_tr_texte(table, titre, msg, unit) {
	if (!msg) return;
	var tr = appendTr(table,'mh_tdpage');

	var td = appendTdText(tr,titre,true);
	td.className = 'mh_tdtitre';
	td.width = MZ_EtatCdMs.tdWitdh;

	var texte = msg;
	if (unit) texte += ' ' + unit;
	td = appendTdText(tr,texte);
	td.colSpan = 2;
	td.className = 'mh_tdpage';
	return td;
}

function MZ_tab_carac_add_tr_minmax(table, titre, ominmax, unit) {
	if (!ominmax) return;
	if (!(ominmax.min || ominmax.max)) return;

	var tr = appendTr(table,'mh_tdpage');

	var td = appendTdText(tr,titre,true);
	td.className = 'mh_tdtitre';
	td.width = MZ_EtatCdMs.tdWitdh;

	if ((!ominmax.min) || ominmax.min == 0) {
		var texte = '\u2A7D' + ominmax.max + '\u00A0' + unit; // <= (mais plus beau)
	} else if (!ominmax.max) {
		var texte = '\u2A7E' + ominmax.min + '\u00A0' + unit;	// >=
	} else {
		var texte = '';
		if (ominmax.min != ominmax.max) {
			var texte = ominmax.min + '-' + ominmax.max + '\u00A0-->\u00A0';
			if (ominmax.min > ominmax.max) {
				td.style.color = 'red';
				unit += ' *** erreur ***';
			}
		}
		texte += ((ominmax.min + ominmax.max)/2) + '\u00A0' + unit;
	}
	td = appendTdText(tr,texte);
	if (ominmax.min2 || ominmax.max2) {	// affichage de l'intervalle de confiance à 80%
		if (!ominmax.min2) {
			var txt2 = '\u2A7D' + ominmax.max2; // <= (mais plus beau)
		} else if (!ominmax.max2) {
			var txt2 = '\u2A7E' + ominmax.min2;	// >=
		} else {
			var txt2 = ominmax.min2 + '-' + ominmax.max2;
		}
		var span = document.createElement('span');
		span.appendChild(document.createTextNode(txt2));
		span.style.float = 'right';
		span.style.textAlign = 'right';
		span.style.background = 'yellow';
		td.insertBefore(span, td.firstChild);
		table.title = 'En jaune : intervalle de confiance à 80%';
	}
	td.colSpan = 2;
	td.className = 'mh_tdpage';
	return td;
}

function MZ_tab_carac_add_tr_minmax2(table, titre, ominmax, unit, ominmaxUnit) {
	if (!ominmax) return;
	if (!(ominmax.min || ominmax.max)) return;

	var tr = appendTr(table,'mh_tdpage');

	var td = appendTdText(tr,titre,true);
	td.className = 'mh_tdtitre';
	td.width = MZ_EtatCdMs.tdWitdh;

	if ((!ominmax.min) || ominmax.min == 0) {
		var texte = '\u2A7D' + ominmax.max;
	} else if (!ominmax.max) {
		var texte = '\u2A7E' + ominmax.min;
	} else {
		var texte = '';
		if (ominmax.min != ominmax.max) {
			var texte = ominmax.min + '-' + ominmax.max;
			if (ominmax.min > ominmax.max) {
				td.style.color = 'red';
				texte += ' *** erreur ***';
			}
		} else {
			var texte = ominmax.min;
		}
	}

	if (ominmaxUnit.min === undefined) {
		if (ominmaxUnit.max === undefined) {
			// ignore (ne devrait pas arriver)
		} else {
			texte += ' --> ' + unit + '\u2A7D' + ominmaxUnit.max;
		}
	} else {
		if (ominmaxUnit.max === undefined) {
			texte += ' --> ' + unit + '\u2A7E' + ominmaxUnit.min;
		} else if (ominmaxUnit.min != ominmaxUnit.max) {
			texte += ' --> ' + ominmaxUnit.min + '\u2A7D' + unit + '\u2A7D' + ominmaxUnit.max;
			if (ominmaxUnit.min > ominmaxUnit.max) {
				td.style.color = 'red';
				texte += ' *** erreur ***';
			}
		} else if (isNaN(ominmaxUnit.min)) {
			texte += ' --> ' + ominmaxUnit.min;
		} else {
			texte += ' --> ' + ominmaxUnit.max + '\u00A0' + unit;
		}
	}

	td = appendTdText(tr,texte);
	td.colSpan = 2;
	td.className = 'mh_tdpage';
	return td;
}


/*-[functions]------------ Gestion des enchantements -------------------------*/

var listeMonstreEnchantement = null,
	listeEquipementEnchantement = null,
	listeInfoEnchantement = null;

function computeCompoEnchantement()
{
	listeMonstreEnchantement = new Array();
	listeInfoEnchantement = new Array();
	listeEquipementEnchantement = new Array();
	var liste = MY_getValue(numTroll+'.enchantement.liste').split(';');
	for(var i=0;i<liste.length;i++)
	{
		var idEquipement = liste[i]*1;
		if(MY_getValue(numTroll+'.enchantement.'+idEquipement+'.objet')==null || MY_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur')==null)
			continue;
		var nomEquipement = MY_getValue(numTroll+'.enchantement.'+idEquipement+'.objet');
		var infoEnchanteur = MY_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur').split(';');
		var texteGlobal='';
		for(var j=0;j<3;j++)
		{
			var k = numTroll+'.enchantement.'+idEquipement+'.composant.'+j;
			var v = MY_getValue(k);
			var infoComposant = MY_getValue().split(';');
			if (infoComposant.length < 5) {	// protection Roule 25/08/2017
				window.console.log('[MZ] err infoComposant k=' + k + ', v=' + v);
				continue;
			}
			listeMonstreEnchantement[infoComposant[2]] = 1;
			var array = new Array();
			array[0]=infoComposant[0].replace("Ril","Œil");
			array[1]=infoComposant[1];
			array[2]=infoComposant[2];
			array[3]=getQualite(infoComposant[3]);
			var texte = infoComposant[4].replace("Ril","Œil");
			for(var k=5;k<infoComposant.length;k++)
			{
				texte += ";"+infoComposant[k].replace("Ril","Œil");
			}
			texteGlobal+=texte+'\n';
			texte += " pour l'enchantement d'un(e) "+nomEquipement+" chez l'enchanteur n°"+infoEnchanteur[0]+' ('+infoEnchanteur[1]+'|'+infoEnchanteur[2]+'|'+infoEnchanteur[3]+')';
			array[4]=texte;
			listeInfoEnchantement.push(array);
		}
		texteGlobal += "chez l'enchanteur n°"+infoEnchanteur[0]+' ('+infoEnchanteur[1]+'|'+infoEnchanteur[2]+'|'+infoEnchanteur[3]+')';
		listeEquipementEnchantement[idEquipement] = texteGlobal;
	}

}

function isEnchant(nom) {
	var monstreEnchant = '';
	for(j in listeInfoEnchantement) {
		monstre = listeInfoEnchantement[j][2].toLowerCase();
		if((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){
			monstreEnchant=monstre;
			break; // ça permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
		}
	}
	return trim(monstreEnchant);
}

function getInfoEnchantementFromMonstre(nom)
{
	try
	{
		if(!listeMonstreEnchantement)
		{
			computeCompoEnchantement();
		}
		var infosEnchant = '';
		for(j in listeInfoEnchantement) {
			monstre = listeInfoEnchantement[j][2].toLowerCase();
			if((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){
				if(infosEnchant=='')
					infosEnchant=listeInfoEnchantement[j][4];
				else
					infosEnchant+='\n'+listeInfoEnchantement[j][4];
			}
		}
		return trim(infosEnchant);
	}
	catch(e)
	{
		window.alert(e);
	}
}

function composantEnchant(Monstre,composant,localisation,qualite) {
     var compo='';
	for(var i=0; i<listeInfoEnchantement.length; i++) {
	 	if(listeInfoEnchantement[i][2].toLowerCase()==Monstre.toLowerCase() &&
			listeInfoEnchantement[i][0].toLowerCase()==composant.toLowerCase() &&
			listeInfoEnchantement[i][1].toLowerCase()==localisation.toLowerCase() &&
			listeInfoEnchantement[i][3]<=qualite
		) {
			return listeInfoEnchantement[i][4];
		}
	}
	return compo;
}

function insertEnchantInfos(tbody) {
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate("descendant::img[@alt = 'Composant - Spécial']",
				tbody,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
		if(nodes.snapshotLength == 0)
			return false;
		var urlImg = URL_MZimg + 'enchant.png';
		for(var i = 0; i < nodes.snapshotLength; i++) {
			var link = nodes.snapshotItem(i).nextSibling.nextSibling;
			var nomCompoTotal = link.firstChild.nodeValue.replace(/\240/g,' ');
			var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf(' ')+1,nomCompoTotal.length);
			var nomMonstre = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" de Qualité"));
			var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualité")+11,nomCompoTotal.indexOf(' ['));
			var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf('[')+1,nomCompoTotal.indexOf(']'));
			if(isEnchant(nomMonstre).length>0)
			{
				var infos = composantEnchant(nomMonstre,nomCompo,localisation,getQualite(qualite));
				if(infos.length>0)
				{
					if(link.parentNode == link.nextSibling.parentNode)
					{
						var tmp = link.nextSibling;
						link.parentNode.insertBefore(createImage(urlImg,infos),link.nextSibling);
					}
					else
					{
						link.parentNode.appendChild(createImage(urlImg,infos));
					}
				}
			}
		}
	}
	catch(e)
	{
		window.alert(e);
	}
}

function computeEnchantementEquipement(fontionTexte,formateTexte)
{
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate("//a[@class='AllLinks' and contains(@href,'TresorHistory.php')]",
				document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
		if(nodes.snapshotLength == 0)
			return false;
		var urlImg = URL_MZimg + 'enchant.png';
		for(var i = 0; i < nodes.snapshotLength; i++)
		{
			var link = nodes.snapshotItem(i);
			var idEquipement = link.getAttribute('href');
			idEquipement = idEquipement.substring(idEquipement.indexOf('ai_IDTresor=')+12);
			idEquipement = parseInt(idEquipement.substring(0,idEquipement.indexOf("'")));
			var nomEquipement = trim(link.firstChild.nodeValue);
			var enchanteur = MY_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur');
			if(!enchanteur || enchanteur == '')
				continue;
			var infos = listeEquipementEnchantement[idEquipement];
			infos=formateTexte(infos);
			if(infos.length>0)
			{
				if(link.parentNode == link.nextSibling.parentNode)
				{
					var tmp = link.nextSibling;
					link.parentNode.insertBefore(fontionTexte(urlImg,infos),link.nextSibling);
				}
				else
				{
					link.parentNode.appendChild(fontionTexte(urlImg,infos));
				}
			}
			MY_setValue(numTroll+'.enchantement.'+idEquipement+'.objet',nomEquipement+' ('+idEquipement+')');
		}
	}
	catch(e)
	{
		window.alert(e);
	}
}

/*-[functions]---------------- Analyse Tactique ------------------------------*/
// Cette section est commune à InfoMonstre et Vue

var MZ_Tactique = {
	// Variables
	popup: null,

	// Méthodes
	createImage: function(id, nom) {
		// Création de l'image portant le popup tactique
		var img = document.createElement('img');
		img.src = URL_MZimg +
			(isPage('View/MonsterView') ? 'calc.png' : 'calc2.png');
		img.id = id;
		img.nom = nom;
		img.style.verticalAlign = 'middle';
		img.onmouseover = MZ_Tactique.showPopup;
		img.onmouseout = MZ_Tactique.hidePopup;
		return img;
	},

	hidePopup: function() {
		// Masquage du popup tactique
		MZ_Tactique.popup.style.display = 'none';
	},

	initPopup: function() {
		/** @mandatory Initialisation du popup tactique */
		MZ_Tactique.popup = document.createElement('div');
		MZ_Tactique.popup.id = 'MZ_Tactique.popup';
		MZ_Tactique.popup.className = 'mh_textbox';
		MZ_Tactique.popup.style =
			'position: absolute;' +
			'border: 1px solid #000000;' +
			'display: none;' +
			'z-index: 3;' +
			'max-width: 400px;';
		document.body.appendChild(MZ_Tactique.popup);
	},

	showPopup: function(evt) {
		// Affichage du popup tactique
		var id, nom
		try {
			id = this.id;
			nom = this.nom;
			var texte = getAnalyseTactique(id, nom);
			if (texte == undefined || texte == '') return;
			MZ_Tactique.popup.innerHTML = texte;
			// roule 16/03/2016 déclage horizontal différent suivant la page qu'on traite
			if (isPage('View/MonsterView')) {
				MZ_Tactique.popup.style.left = Math.min(evt.pageX - 120, window.innerWidth - 300) + 'px';
			} else {
				MZ_Tactique.popup.style.left = Math.min(evt.pageX + 15, window.innerWidth - 400) + 'px';
			}
			MZ_Tactique.popup.style.top = evt.pageY + 15 + 'px';
			MZ_Tactique.popup.style.display = 'block';
		} catch (e) {
			// window.alert(e);
			window.console.log('[MZ] showPopup exception pour id=' + id + ', nom=' + nom);
			window.console.error(e);
		}
	}
};

// Les % de toucher
var c = new Array();

// coefficients binomiaux
function cnp(n,k)
{
	if(c[n] != null && c[n][k] != null)
		return c[n][k];
	if(c[n] == null)
		c[n] = new Array();
	if(k==0)
	{
		c[n][k] = 1;
		return 1;
	}
	var result = cnp(n-1,k-1)*n/k; // mouais... k mul+k div
	c[n][k] = result;
	// Roule debug
	//window.console.log('cnp(' + n + ',' + k + ')=' + result);
	return result;
}

// by Dab, à comparer
function binom(n,p) {
	if(p<0 || p>n) return 0;

	if(c[n])
		if(c[n][p]) return c[n][p];
	else {
		c[n]=[1];
		c[n][n]=1;
		if(p==0 || p==n) return 1;
		}

	if(2*p>n)
		c[n][p]=binom(n,n-p);
	else
		c[n][p]=binom(n-1,p-1)+binom(n-1,p); // k(k-1)/2 additions

	return c[n][p];
	}

var coeff = new Array();

function coef(n,p)
{
	if(n==0 && p==0)
		return 1;
	if(p>n*3.5)
		p = 7*n-p
	// roule désactive cache
	 if(coeff[n] != null && coeff[n][p] !=null)
		return coeff[n][p];
	if(coeff[n] == null)
		coeff[n] = new Array();
	var kmax = Math.floor((p-n)/6);
	var x=0;
	for(var k=0;k<=kmax;k++)
	{
		x+=(1-2*(k%2)) * cnp(n,k) * cnp(p-6*k-1,n-1);
	}
	coeff[n][p] = x;
	// Roule debug
	//window.console.log('cnk(' + n + ',' + p + ')=' + x);
	return x;
}

function chanceEsquiveParfaite(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
/*	if(6*a+ba<2*(d+bd))
		return 100;
	if(a+ba>2*(6*d+bd))
		return 0;*/
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(2*Math.max(as+ba,0) < Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	// roule debug
	//window.console.log('chanceEsquiveParfaite, att=' + a + ', esq=' + d + ', ba=' + ba + ', bd=' + bd + ', win=' + win + ', los=' + los);
	return Math.round(100*win/(win+los));
}

function chanceTouche(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
	if(a+ba>6*d+bd)
		return 100;
	if(6*a+ba<d+bd)
		return 0;
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(Math.max(as+ba,0) > Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	return Math.round(100*win/(win+los));
}

function chanceCritique(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
	if(a+ba>2*(6*d+bd))
		return 100;
	if(6*a+ba<2*(d+bd))
		return 0;
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(Math.max(as+ba,0) > 2*Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	return Math.round(100*win/(win+los));
}

/***********************************************
Analyse tactique
***********************************************/

function getTexteAnalyse(modificateur,chiffre)
{
	if(chiffre==0)
		return chiffre;
	return modificateur+ chiffre;
}

// rend le HTML pour le tableau de la "calculette"
function getAnalyseTactique(id,nom) {
	var donneesMonstre = MZ_EtatCdMs.listeCDM[id];
	var needAutres=false;
	var i;
	if(donneesMonstre == null)
		return;
	var array = analyseTactique(donneesMonstre,nom);	// rend tableau de tableaux avec  NomAttaque,chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure
	//window.console.log('getAnalyseTactique ' + JSON.stringify(array));
	if(array==null)
		return "";
	var str = "<table class='mh_tdborder' border='0' cellspacing='1' cellpadding='4' style='background-color:rgb(229, 222, 203)'><tr class='mh_tdtitre'><td>Attaque</td><td>Esq. Parfaite</td><td>Touché</td><td>Critique</td><td>Dégâts</td></tr>";
	for(i=0;i<array.length;i++)
	{
		if(array[i][1]==100 && i>0)	// si esquive parfaite du Trõll sur le Monstre est assurée pour cette frappe
		{
			needAutres=true;
			break;
		}
		if(i==1 && array[i][4]>0)	// l'attaque normale du Trõll sur le monstre fait des dégâts => gras
			str+= "<tr class=mh_tdpage><td><b>"+array[i][0]+"</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][1])+"%</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][2])+"%</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][3])+"%</b></td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
		else if(i==0)	// attaque du monstre sur le Trõll => italique
			str+= "<tr class=mh_tdpage><td><i>"+array[i][0]+"</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][1])+"%</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][2])+"%</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][3])+"%<i></td><td><b><i>"+getTexteAnalyse(array[i][6],array[i][4])+"<i></b></td></tr>";
		else	// autre, pas de décoration
			str+= "<tr class=mh_tdpage><td>"+array[i][0]+"</td><td>"+getTexteAnalyse(array[i][5],array[i][1])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][2])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][3])+"%</td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
	}
	if(needAutres)
	{
		if(i==array.length-1)
			str+= "<tr class=mh_tdpage><td>"+array[i][0]+"</td><td>"+getTexteAnalyse(array[i][5],array[i][1])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][2])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][3])+"%</td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
		else if(i==1)
			str+= "<tr class=mh_tdpage><td><b>Toutes attaques</b></td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>";
		else
			str+= "<tr class=mh_tdpage><td>Autres attaques</td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>";
	}
	var txtCdM = MZ_carac_build_nb_cmd_msg(donneesMonstre);
	if (txtCdM) str += '<tr class="mh_tdpage"><td colspan="5" style="font-style: italic;">' + txtCdM + '</td></tr>';
	return str+"</table>";
}

function MZ_carac_build_nb_cmd_msg(donneesMonstre) {
	if (!donneesMonstre) return;
	if (!donneesMonstre.Mode) return;
	switch (donneesMonstre.Mode) {
		case 'cdm':
			return 'fondé sur ' + (+donneesMonstre.nCdM) + ' CdM' + (donneesMonstre.nCdM > 1 ? 's' : '') + ' de ce monstre à cet âge';
		case 'stat':
			return 'fondé sur les statistiques de ' + (+donneesMonstre.nCdM) + ' CdM' + (donneesMonstre.nCdM > 1 ? 's' : '') + ' de ce type de monstre (même type, même âge, même template)';
		case 'statV1':
			return 'fondé sur les statistiques anciennes (MZ V1)';
		case 'nom':
			return 'fondé sur le nom du monstre, pas de CdM';
	}
	return 'Mode ' + donneesMonstre.Mode;
}

// rend un tableau (un par attaque du Trõll ou du monstre) de tableaux contenant:
//	NomAttaque,chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure
function analyseTactique(donneesMonstre,nom) {
	try
	{
	var listeAttaques = [];
	// Roule 16/03/2016 ajout des ParseInt car je récupérais parfois une chaine non numérique :(
	var att = parseInt(MY_getValue(numTroll+".caracs.attaque"), 10);
	var reg = parseInt(MY_getValue(numTroll+".caracs.regeneration"), 10);
	var attbmp = parseInt(MY_getValue(numTroll+".caracs.attaque.bmp"), 10);
	var attbmm = parseInt(MY_getValue(numTroll+".caracs.attaque.bmm"), 10);
	var mm = parseInt(MY_getValue(numTroll+".caracs.mm"), 10);
	var deg = parseInt(MY_getValue(numTroll+".caracs.degats"), 10);
	var degbmp = parseInt(MY_getValue(numTroll+".caracs.degats.bmp"), 10);
	var degbmm = parseInt(MY_getValue(numTroll+".caracs.degats.bmm"), 10);
	var vue = parseInt(MY_getValue(numTroll+".caracs.vue"), 10);
	var pv = parseInt(MY_getValue(numTroll+".caracs.pv"), 10);
	var esq = parseInt(Math.max(MY_getValue(numTroll+".caracs.esquive"), 10)-parseInt(MY_getValue(numTroll+".caracs.esquive.nbattaques"),0), 10);
	var esqbonus = parseInt(MY_getValue(numTroll+".caracs.esquive.bm"), 10);
	var arm = parseInt(MY_getValue(numTroll+".caracs.armure"), 10);
	var armbmp = parseInt(MY_getValue(numTroll+".caracs.armure.bmp"), 10);
	var armbmm = parseInt(MY_getValue(numTroll+".caracs.armure.bmm"), 10);
	var modificateurEsquive = '';
	var modificateurArmure = '';
	var modificateurMagie = '';
	var modificateurEsquiveM = '';
	var modificateurArmureM = '';
	var pasDeSR=false;
	var esqM=0,attM=0,armM_mag=0,armM_phy=0,armM_tot=0,degM=0;
	if(donneesMonstre==null || att==null || attbmp==null || attbmm==null || mm==null || deg==null || degbmp==null || degbmm==null || vue==null ||pv==null || esq==null || arm==null)
		return null;

	if (MY_DEBUG) window.console.log('analyseTactique nom=' + nom + ' ' + JSON.stringify(donneesMonstre));
	if (donneesMonstre.index == undefined) {
		// à supprimer
		var td = document.createElement('td')
		td.innerHTML = bbcode(donneesMonstre[4]); // sans déconner ? C'est quoi cette histoire ?
		var esqM = 0;
		try
		{
			esqM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
		}
		catch(e)
		{
			debugMZ('analyseTactique, exeception calcul esqM ' + e.message);
			esqM=Math.ceil(parseInt(td.firstChild.nodeValue));
			modificateurEsquive = '<';
			modificateurArmure = '<';
			modificateurMagie = '<';
		}

		td.innerHTML = bbcode(donneesMonstre[3]);
		var attM = 0;
		try
		{
			attM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
		}
		catch(e)
		{
			debugMZ('analyseTactique, exeception calcul attM ' + e.message);
			attM=Math.ceil(parseInt(td.firstChild.nodeValue));
			modificateurEsquiveM = '>';
			modificateurArmureM = '>';
		}

		td.innerHTML = bbcode(donneesMonstre[5]);
		var degM = 0;
		try
		{
			degM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
		}
		catch(e)
		{
			debugMZ('analyseTactique, exeception calcul degM ' + e.message);
			degM=Math.ceil(parseInt(td.firstChild.nodeValue));
			modificateurArmureM = '>';
		}

		td.innerHTML = bbcode(donneesMonstre[7]);
		try
		{
			armM_tot=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
			armM_mag=armM_tot;	// compatibilité avec ancien calcul
		}
		catch(e)
		{
			debugMZ('analyseTactique, exeception calcul armM ' + e.message);
			armM_tot=Math.ceil(parseInt(td.firstChild.nodeValue));
			armM_mag=armM_tot;
			modificateurArmure = '<';
		}

		var coeffSeuil = 0.95;
		try
		{
			td.innerHTML = bbcode(donneesMonstre[9]);
			//debugMZ('analyseTactique, calcul SR, donnessMonstre=' + donneesMonstre[9] + ', bbcode=' + bbcode(donneesMonstre[9]));
			var rm = parseInt(td.getElementsByTagName('b')[0].firstChild.nodeValue);
			var v = (rm / mm);
			var seuil = (rm < mm ? Math.max(10,Math.floor(v*50)) : Math.min(90,Math.floor(100 - 50/v)));
			coeffSeuil = (200-seuil)/200;
		}
		catch(e)
		{
			debugMZ('analyseTactique, exeception calcul SR ' + e.message);
			modificateurMagie = '<';
			pasDeSR = true;
		}
	} else {
		//calcul de modificateurEsquive, modificateurArmure, modificateurMagie, modificateurEsquiveM, modificateurArmureM, pasDeSR, esqM, attM, armM_mag, armM_tot, degM;
		if (donneesMonstre.esq) {
			if (donneesMonstre.esq.min && donneesMonstre.esq.max) {
				esqM = Math.ceil((donneesMonstre.esq.min + donneesMonstre.esq.max) / 2);
			} else if (donneesMonstre.esq.max) {
				esqM = donneesMonstre.esq.max;
				modificateurEsquive = '<';
				modificateurArmure = '<';
				modificateurMagie = '<';
			}
		}

		if (donneesMonstre.att) {
			if (donneesMonstre.att.min && donneesMonstre.att.max) {
				attM = Math.ceil((donneesMonstre.att.min + donneesMonstre.att.max) / 2);
			} else if (donneesMonstre.att.max) {
				attM = donneesMonstre.att.max;
				modificateurEsquiveM = '>';
				modificateurArmureM = '>';
			}
		}

		if (donneesMonstre.armM) {
			if (donneesMonstre.armM.min && donneesMonstre.armM.max) {
				armM_mag = Math.ceil((donneesMonstre.armM.min + donneesMonstre.armM.max) / 2);
			} else if (donneesMonstre.armM.max) {
				armM_mag = donneesMonstre.armM.max;
				modificateurArmure = '<';
			}
			if (donneesMonstre.armP) {
				if (donneesMonstre.armP.min && donneesMonstre.armP.max) {
					armM_phy = Math.ceil((donneesMonstre.armP.min + donneesMonstre.armP.max) / 2);
				} else if (donneesMonstre.armP.max) {
					armM_phy = donneesMonstre.armP.max;
					modificateurArmure = '<';
				}
				armM_tot = armM_mag + armM_phy;
			} else {	// ça ne devrait pas arriver
				armM_tot = armM_mag;
			}
		} else if (donneesMonstre.arm) {
			if (donneesMonstre.arm.min && donneesMonstre.arm.max) {
				armM_tot = Math.ceil((donneesMonstre.arm.min + donneesMonstre.arm.max) / 2);
				armM_mag=armM_tot;	// worst case
			} else if (donneesMonstre.arm.max) {
				armM_tot = donneesMonstre.arm.max;
				armM_mag=armM_tot;
				modificateurArmure = '<';
			}
		}

		if (donneesMonstre.deg) {
			if (donneesMonstre.deg.min && donneesMonstre.deg.max) {
				degM = Math.ceil((donneesMonstre.deg.min + donneesMonstre.deg.max) / 2);
			} else if (donneesMonstre.deg.max) {
				degM = donneesMonstre.deg.max;
				modificateurArmureM = '>';
			}
		}

		var coeffSeuil = 0.95;
		if (donneesMonstre.RM) {
			if (donneesMonstre.RM.min && donneesMonstre.RM.max) {
				var rmM = Math.ceil((donneesMonstre.RM.min + donneesMonstre.RM.max) / 2);
				var v = (rmM / mm);
				var seuil = (rmM < mm ? Math.max(10,Math.floor(v*50)) : Math.min(90,Math.floor(100 - 50/v)));
				coeffSeuil = (200-seuil)/200;
			} else if (donneesMonstre.deg.max) {
			}
			modificateurMagie = '<';
			pasDeSR = true;
		}
	}
	if (MY_DEBUG) window.console.log('modificateurEsquive=' + modificateurEsquive + ', modificateurArmure=' + modificateurArmure + ', modificateurMagie=' + modificateurMagie + ', modificateurEsquiveM=' + modificateurEsquiveM + ', modificateurArmureM=' + modificateurArmureM + ', pasDeSR=' + pasDeSR + ', esqM=' + esqM + ', attM=' + attM + ', armM_tot=' + armM_tot + ', armM_mag=' + armM_mag + ', degM=' + degM + ', coeffSeuil=' + coeffSeuil);

	var chanceDEsquiveParfaite = chanceEsquiveParfaite(att,esqM,attbmp+attbmm,0);
	var chanceDeTouche = chanceTouche(att,esqM,attbmp+attbmm,0);
	var chanceDeCritique = chanceCritique(att,esqM,attbmp+attbmm,0);
	// roule debug
	//window.console.log('Attaque normale troll sur monstre, att=' + att + ', esqM=' + esqM + ', attbmp=' + attbmp + ', attbmm=' + attbmm
	//	+ ', chanceDEsquiveParfaite=' + chanceDEsquiveParfaite + ', chanceDeTouche=' + chanceDeTouche + ', chanceDeCritique=' + chanceDeCritique);
	var degats = (((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmp+degbmm-armM_tot,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmp+degbmm-armM_tot,1))/100);
	//str += "Attaque normale : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmp+degbmm-arm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmp+degbmm-arm,1))/100);
	listeAttaques.push(new Array("Attaque normale",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	if(getSortComp("Vampirisme")>0)
	{
		var pour = getSortComp("Vampirisme");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm-armM_mag,1)))/100;
		//str += "\nVampirisme : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Vampirisme",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Siphon des âmes")>0)
	{
		var pour = getSortComp("Siphon des âmes");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm,0)*pour/100);
		degats = (((chanceDeTouche-chanceDeCritique)*Math.max(reg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(reg*1.5)*2+degbmm-armM_mag,1))/100);
		listeAttaques.push(new Array("Siphon des âmes",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Botte Secrète")>0)
	{
		var pour = getSortComp("Botte Secrète");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(2*att/3),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(Math.floor(2*att/3),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(Math.floor(2*att/3),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(deg/2)*2+Math.floor((degbmp+degbmm)/2)-Math.floor(armM_tot/2),1)+chanceDeCritique*Math.max(Math.floor(deg*1.5/2)*2+Math.floor((degbmp+degbmm)/2)-Math.floor(armM_tot/2),1)))/100;
		//str += "\nBotte Secrète : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Botte Secrète",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Rafale Psychique")>0)
	{
		var pour = getSortComp("Rafale Psychique");
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = Math.round(100*pour/100);
		chanceDeCritique = Math.round(0*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm-armM_mag,1)))/100;
		//str += "\nRafale Psychique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Rafale Psychique",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,'',pasDeSR?modificateurMagie:''));
	}
	if(getSortComp("Explosion")>0)
	{
		var pour = getSortComp("Explosion");
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = Math.round(100*pour/100);
		chanceDeCritique = Math.round(0*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(1+deg/2+pv/20)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(1+deg/2+pv/20)*1.5)*2+degbmm,1)))/100;
		//str += "\nRafale Psychique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Explosion",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,'',pasDeSR?modificateurMagie:''));
	}
	if(getSortComp("Projectile Magique")>0)
	{
		var pour = getSortComp("Projectile Magique");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(vue,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(vue,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(vue,esqM,attbmm,0)*pour/100);
		// distance troll - monstre
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(vue/2)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(vue/2)*1.5)*2+degbmm-armM_mag,1)))/100;
		//str += "\nProjectile Magique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		if (donneesMonstre.index !== undefined && MZ_EtatCdMs.tr_monstres !== undefined && MZ_EtatCdMs.tr_monstres[donneesMonstre.index] !== undefined) {
			var dist = getMonstreDistance(donneesMonstre.index);
			//if (isDEV) window.console.log('Dist pour PM=' + dist);
			var vue_bm = parseInt(MY_getValue(numTroll+".caracs.vue.bm"), 10);
			var portee = getPortee(vue+vue_bm);
			if (dist <= portee) {
				degats = Math.round((degats + 2 * (portee-dist)) * 100) / 100;
			} else {
				degats += ' (plus bonus de portée)';
			}
			debugMZ('analyseTactique, iTR= ' + donneesMonstre.index + ', dist=' + dist + ', porteePM=' + portee);
		} else {
			degats += ' (plus bonus de portée)';
		}
		listeAttaques.push(new Array("Projectile Magique",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Frénésie")>0)
	{
		var pour = getSortComp("Frénésie");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm+attbmp,0)*pour/100);
		degats = Math.round(((chanceDeTouche-chanceDeCritique)*2*Math.max((deg*2+degbmp+degbmm-armM_tot),1)+chanceDeCritique*2*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM_tot,1)))/100;
		//str += "\nFrénésie : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Frénésie",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Charger")>0)
	{
		var pour = getSortComp("Charger");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm+attbmp,0)*pour/100);
		var degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max((deg*2+degbmp+degbmm-armM_tot),1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM_tot,1)))/100;
		//str += "\nCharge : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Charger",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Griffe du Sorcier")>0)
	{
		var pour = getSortComp("Griffe du Sorcier");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(deg/2)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(deg/2)*1.5)*2+degbmm,1)))/100;
		//str += "\nGriffe du Sorcier : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Griffe du Sorcier",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Attaque Précise",1)>0)
	{
		var niveau = 5;
		var oldPour = 0;
		var chanceDEsquiveParfaite = 0;
		var chanceDeTouche = 0;
		var chanceDeCritique = 0;
		degats = 0;
		while(niveau>0)
		{
			var pour = getSortComp("Attaque Précise",niveau);
			if(pour>oldPour)
			{
				var chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeToucheNiveau = chanceTouche(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeCritiqueNiveau = chanceCritique(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				chanceDEsquiveParfaite += chanceDEsquiveParfaiteNiveau;
				chanceDeTouche += chanceDeToucheNiveau;
				chanceDeCritique += chanceDeCritiqueNiveau;
				degats += (((chanceDeToucheNiveau-chanceDeCritiqueNiveau)*Math.max((deg*2+degbmp+degbmm-armM_tot),1)+chanceDeCritiqueNiveau*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM_tot,1))/100);
				oldPour = pour;
			}
			niveau--;
		}
		//str += "\nAttaque Précise : Touché "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% Dégâts "+Math.round(degats*100)/100;
		listeAttaques.push(new Array("Attaque Précise",chanceDEsquiveParfaite,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Coup de Butoir",1)>0)
	{
		var niveau = 5;
		var oldPour =0;
		var chanceDEsquiveParfaite = 0;
		var chanceDeTouche=0;
		var chanceDeCritique=0;
		degats=0;
		while(niveau>0)
		{
			var pour = getSortComp("Coup de Butoir",niveau);
			if(pour>oldPour)
			{
				var chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeToucheNiveau = chanceTouche(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeCritiqueNiveau = chanceCritique(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				chanceDEsquiveParfaite += chanceDEsquiveParfaiteNiveau;
				chanceDeTouche += chanceDeToucheNiveau;
				chanceDeCritique += chanceDeCritiqueNiveau;
				degats += (((chanceDeToucheNiveau-chanceDeCritiqueNiveau)*Math.max((Math.min(Math.floor(deg*1.5),deg+3*niveau)*2+degbmp+degbmm-armM_tot),1)+chanceDeCritiqueNiveau*Math.max(Math.floor(Math.min(Math.floor(deg*1.5),deg+3*niveau)*1.5)*2+degbmm+degbmp-armM_tot,1))/100);
				oldPour = pour;
			}
			niveau--;
		}
		//str += "\nCoup de Butoir : Touché "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% Dégâts "+Math.round(degats*100)/100;
		listeAttaques.push(new Array("Coup de Butoir",chanceDEsquiveParfaite,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	}
	listeAttaques.sort(function(a,b){var diff = parseInt(100*b[4])-parseInt(100*a[4]);if(diff==0) return parseInt(b[1])-parseInt(a[1]); return diff;});
	if(nom.toLowerCase().indexOf("mégacéphale")==-1)
	{
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(attM,esq,0,esqbonus));
		chanceDeTouche = Math.round(chanceTouche(attM,esq,0,esqbonus));
		chanceDeCritique = Math.round(chanceCritique(attM,esq,0,esqbonus));
	}
	else
	{
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = 100;
		chanceDeCritique = 0;
	}
	degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(degM)*2-arm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(degM)*1.5)*2-arm*2-armbmm-armbmp,1)))/100;

	listeAttaques.unshift(new Array("Monstre",Math.round(chanceDEsquiveParfaite*100)/100,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	return listeAttaques;
	}
	catch(e) {
		var msgid = '';
		try {
			msgid = ', monstre ' + donneesMonstre.id;
		}
		catch(e2) {
		}
		window.console.error(traceStack(e, 'analyseTactique' + msgid));
		window.alert(e);
		}
	}

// x~~x	marque pour s'y retrouver sous l'éditeur

/*
 * This file is part of MountyZilla (http://mountyzilla.tilk.info/),
 * published under GNU License v2.
 *
 * Patch :
 * gestion des missions terminées
 */

 // x~x mission_liste

function checkLesMimis() {	// supprimer les missions finie de numTroll.MISSIONS
	try {
		var titresMimis = document.evaluate(
			"//b[@class='mh_titre3']/a[contains(@href,'Mission_')]",
			document, null, 7, null
		);
		var obMissions = JSON.parse(MY_getValue(numTroll+'.MISSIONS'));
	} catch(e) {
		window.console.error(traceStack(e, 'mission_liste initialisation'));
		return;
	}

	var enCours = {};
	if (MY_DEBUG) window.console.log('MZ checkLesMimis nb=' + titresMimis.snapshotLength);
	for(var i=0 ; i<titresMimis.snapshotLength ; i++) {
		if (MY_DEBUG) window.console.log('MZ checkLesMimis text=' + titresMimis.snapshotItem(i).textContent);
		var num = titresMimis.snapshotItem(i).textContent.match(/\d+/)[0];
		enCours[num] = true;
	}

	for(var numMimi in obMissions) {
		if(!enCours[numMimi]) {
			delete obMissions[numMimi];
		}
	}
	MY_setValue(numTroll+'.MISSIONS',JSON.stringify(obMissions));
}

function do_mission_liste() {
	checkLesMimis();
}

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x actions

/* TODO
 * getLvl pour Explo, Rotobaffe et cie
 */



/*                                Page de combat                                */

function getLevel() {
	var divList = document.getElementsByTagName('div');
	if(divList.length <= 2)
		return;

	// On essaie de voir si cette action était une attaque
	var pList = document.getElementsByTagName('p');
	var nomM = '';
	// Modification pour Frénésie by TetDure
	var numAtt = 0;
	for (var i = 0; i < pList.length; i++) {
		if(pList[i].firstChild) {
			nomM = pList[i].firstChild.nodeValue;
			if(nomM && nomM.indexOf('Vous avez attaqué un') == 0)
				numAtt++;
			}
		}

	if(nomM == '')
		return;

	// Si c'est une attaque normale, un seul PX
	var comPX = 1;
	if(divList[2].firstChild.nodeValue.indexOf('Attaque Normale') == -1 && numAtt != 2)
		comPX++;

	// Extraction des infos du monstre attaqué
	var idM;
	var male;
	if(nomM.slice(20, 21) == 'e') {
		male = false;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(22, nomM.indexOf('(') - 1);
		}
	else {
		male = true;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(21, nomM.indexOf('(') - 1);
		}

	if(idM == '')
		return;

	var bList = document.getElementsByTagName('b');
	var niveau = '';
	for (var i = 0; i < bList.length; i++) {
		var b = bList[i];
		if(b.childNodes[0].nodeValue != "TUÉ")
			continue;
		var nbPX = "";
		for (i++; i < bList.length; i++) {
			// Si plusieurs monstres ont été tués (par ex. explo), on ne peut pas déduire leurs niveaux
			if(bList[i].childNodes[0].nodeValue == "TUÉ")
				return;
			if(bList[i].childNodes[0].nodeValue.indexOf("PX") != -1) {
				nbPX = bList[i].childNodes[0].nodeValue;
				break;
			}
		}
		if(nbPX == '')
			return;
		// Si on arrive ici c'est qu'on a trouvé un (et un seul) monstre tué et les PX gagnés
		nbPX = parseInt(nbPX.slice(0, nbPX.indexOf("P") - 1));
		if(!nbPX)
			nbPX = 0;
		chaine = (male ? "Il" : "Elle") + " était de niveau ";
		niveau = (nbPX * 1 + 2 * nivTroll - 10 - comPX) / 3;
		if(comPX > nbPX) {
			chaine += "inférieur ou égal à " + Math.floor(niveau) + ".";
			niveau = "";
		} else if(Math.floor(niveau) == niveau) {
			chaine += niveau + ".";
		} else {
			chaine = "Mountyzilla n'est pas arrivé à calculer le niveau du monstre.";
			niveau = "";
		}
		insertBr(b.nextSibling.nextSibling.nextSibling);
		insertText(b.nextSibling.nextSibling.nextSibling, chaine);
	}

	if(niveau != '') {
		var button = insertButtonCdm('as_Action');
		button.setAttribute("onClick","window.open('" + URL_pageNiv + "?id=" + (idM * 1) + "&monstre="
				+ escape(nomM) + "&niveau=" + escape(niveau)
				+ "', 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); "
				+ "this.value = 'Merci de votre participation'; this.disabled = true;");
	}
}


/*-[functions]------------- Messages du bot : MM/RM --------------------------*/

function insertInfoMagie(node, intitule, magie) {
	if(node.nextSibling) {
		node = node.nextSibling;
		insertBr(node);
		insertText(node, intitule);
		insertText(node, magie, true);
	} else {
		node = node.parentNode;
		appendBr(node);
		appendText(node, intitule);
		appendText(node, magie, true);
	}
}

function getMM(sr) {
	if(rmTroll<=0) {
		return 'Inconnue (quelle idée d\'avoir une RM valant'+rmTroll+' !)';
	}
	sr = Number(sr.match(/\d+/)[0]);
	if(sr==10) {
		return '\u2265 '+5*rmTroll;
	}
	if(sr<=50) {
		return Math.round(50*rmTroll/sr);
	}
	if(sr<90) {
		return Math.round((100-sr)*rmTroll/50);
	}
	return '\u2264 '+Math.round(rmTroll/5);
}

function traiteMM() {
	var node = document.evaluate(
		"//b[contains(preceding::text()[1], 'Seuil de Résistance')]/text()[1]",
		document, null, 9, null).singleNodeValue;

	if(node) {
		var mm = getMM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
	} else {
		var node = document.evaluate(
			"//p/text()[contains(., 'Seuil de Résistance')]",
			document, null, 9, null).singleNodeValue;
		if(!node) {
			return;
		}
		var mm = getMM(node.nodeValue);
		node = node.nextSibling.nextSibling;
	}
	insertInfoMagie(node,'MM approximative de l\'Attaquant...: ',mm);
}

function getRM(sr) {
	if(mmTroll<=0) {
		return 'Inconnue (quelle idée d\'avoir une MM valant'+mmTroll+' !)';
	}
	sr = Number(sr.match(/\d+/)[0]);
	if(sr==10) {
		return '\u2264 '+Math.round(mmTroll/5);
	}
	if(sr<=50) {
		return Math.round(sr*mmTroll/50);
	}
	if(sr<90) {
		return Math.round(50*mmTroll/(100-sr));
	}
	return '\u2265 '+5*mmTroll;
}

function traiteRM() {
	var nodes = document.evaluate(
		"//b[contains(preceding::text()[1],'Seuil de Résistance')]/text()[1]",
		document, null, 7, null);
	if(nodes.snapshotLength==0) {
		return;
	}

	for(var i=0 ; i<nodes.snapshotLength ; i++) {
		var node = nodes.snapshotItem(i);
		var rm = getRM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
		insertInfoMagie(node, 'RM approximative de la Cible.......: ', rm);
	}
}


/*                      Fonction stats IdT par Raistlin                       */

/*function getIdt() {
	if(MY_getValue("SEND_IDT") == "non")
		return false;

	var regExpBeginning = /^\s+/;
	var regExpEnd       = /\s+$/;

	var nomIdt = document.evaluate(
			"//tr/td[contains(p/text(),'identification a donné le résultat suivant : ')]/b/text()",
			document, null, XPathResult.STRING_TYPE, null).stringValue;
	if(!nomIdt)
		return false;

	var caracIdt;
	if(nomIdt.indexOf("Malédiction !") != -1) {
		caracIdt = "";
		nomIdt = "Mission maudite";
	} else {
		caracIdt = nomIdt.slice(nomIdt.indexOf("(") + 1, nomIdt.indexOf(")"));
		nomIdt = nomIdt.slice(nomIdt.indexOf(" - ")+3);
		nomIdt = nomIdt.slice(0, nomIdt.indexOf("(") - 1);
		nomIdt = nomIdt.replace(regExpBeginning, "").replace(regExpEnd, "");
	}
	FF_XMLHttpRequest({
		method: 'GET',
		url: idtURL + "?item=" + escape(nomIdt) + "&descr=" + escape(caracIdt),
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml',
		}
	});
	return true;
}*/


/*-[functions]------------------- Décalage DLA -------------------------------*/

function confirmeDecalage() {
	// On vérifie que MH n'excluera pas déjà la demande (validNumeric)
	var nbMinutes = document.getElementById('ai_NbMinutes').value;
	if(!nbMinutes || isNaN(nbMinutes) || nbMinutes<1) { return false; }

	var newDLA = new Date( oldDLA );
	newDLA.setMinutes( newDLA.getMinutes()+Number(nbMinutes) );
	return window.confirm(
		'Votre DLA sera décalée au : '+newDLA.toLocaleString()
		+'\nConfirmez-vous ce décalage ?'
	);
}

function newsubmitDLA(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	if(confirmeDecalage()) {
		this.submit();
	}
}

function changeActionDecalage() {
	if(MY_getValue('CONFIRMEDECALAGE')!='true') {
		return;
	}
	try {
		// On récupère le contenu du script JS MH de calcul du décalage
		var scriptTxt = document.evaluate(
			".//script[ not(@src) ]",
			document, null, 9, null
		).singleNodeValue.textContent;
		// On en extrait la DLA courante
		scriptTxt = scriptTxt.slice(scriptTxt.indexOf('new Date(')+9);
		scriptTxt = scriptTxt.split('\n')[0];
		var nbs = scriptTxt.match(/\d+/g);
		oldDLA = new Date( nbs[0],nbs[1],nbs[2],nbs[3],nbs[4],nbs[5] );
	} catch(e) {
		avertissement('Erreur de parsage : confirmation de décalage impossible');
		window.console.error(traceStack(e, 'changeActionDecalage DLA non trouvée'));
		return;
	}
	var form = document.getElementsByName('ActionForm')[0];
	if(form) {
		form.addEventListener('submit', newsubmitDLA, true);
	} else {
		avertissement('Erreur de parsage : confirmation de décalage impossible');
		window.console.error('[changeActionDecalage] ActionForm non trouvé');
	}
}

/*-[functions]------------------- Compte à rebours de DLA --------------------*/
function DMYHMSToDate(t) { return new Date(t.replace(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/, "$2/$1/$3 $4:$5:$6")); }

function DateDiff(d1, d2) {
	var diff = {},
	    tmp = Math.floor((d2 - d1) / 1000); // on s'affranchit des 1000e de s

	diff.sec  = tmp % 60; tmp = Math.floor((tmp - diff.sec) / 60);
	diff.min  = tmp % 60; tmp = Math.floor((tmp - diff.min) / 60);
	diff.hour = tmp % 24; tmp = Math.floor((tmp - diff.hour) / 24);
	diff.day  = tmp;

	return (diff.day > 5) ? "> 5j" : [
		diff.day  > 0 ? diff.day  + "j" : null,
		diff.hour > 0 ? diff.hour + "h" : null,
		diff.min  > 0 ? diff.min  + "m" : null,
		diff.sec  > 0 ? diff.sec  + "s" : null
	].filter(function (o){ return o; }).join(" ");
}

function initCompteAreboursDLA() {
	if(MY_getValue('COMPTEAREBOURSDLA')!='true') {
		return;
	}
	var div = document.evaluate("//div[@class='infoMenu']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
	    br = div.getElementsByTagName('br')[0];
	//window.console.log('initCompteAreboursDLA' + div.innerHTML);

	var dla = DMYHMSToDate(/DLA:\s+([^<]+)</.exec(div.innerHTML)[1]),
	    cnt = document.createElement('div');

	div.insertBefore(cnt, br);
	div.removeChild(br);

	var timer = setInterval(function() {
		var diff = DateDiff(new Date(), dla);
		if(diff.length <= 0) {
			diff = "<a href='/mountyhall/MH_Play/Activate_DLA.php' target='_top' style='color:#AEFFAE'>Vous pouvez réactiver!</a>";
			clearInterval(timer);
		}
		cnt.innerHTML = diff;
	}, 1000);
}

/*-[functions]------------------- Alerte Mundi -------------------------------*/

function prochainMundi() {
	try {
		var node;
			node = document.evaluate(
				"//div[@class='dateAction']/b",
				document, null, 9, null
			).singleNodeValue;
		if (document.evaluate) {
		} else {	// repli en JQuery
			//node = $(
		}
	} catch(e) {
		window.console.error(traceStack(e, 'prochainMundi Date introuvable'));
		return;
	}
	if(!node) { return; }

	var longueurMois = node.textContent.indexOf('Saison du Hum')==-1?28:14;
	var jour = longueurMois+1-getNumber(node.textContent);
	if(node.textContent.indexOf('Mundidey')!=-1) { jour=longueurMois; }
	var txt = '[Prochain Mundidey ';
	if(jour>1) {
		txt += 'dans '+jour+' jours]';
	} else {
		txt += 'demain]';
	}
	insertText(node.parentNode.nextSibling,txt,true);
}


/*                            Fonction principale                             */

function dispatch() {
	if(isPage('MH_Play/Play_action')) {
		prochainMundi();
	} else if(isPage('MH_Play/Actions/Play_a_Decaler.php')) {
		var oldDLA;
		changeActionDecalage();
	} else if(isPage('MH_Play/Actions')) {
		if(document.evaluate(
			"//form/descendant::p/text()[contains(., 'Zone Piégée')]",
			document, null, 2, null
		).stringValue) {
			traiteMM();
		} else if(document.evaluate(
			"//tr/td/descendant::p/text()[contains(., 'identification a donné')]",
			document, null, 2, null
		).stringValue) {
			//getIdt();
			traiteRM();
		} /*else {
			// Est censé se lancer sur quoi *précisément* ?
			traiteRM();
			getLevel();
		}*/
	} else {
		/* Traitement des messages du bot */
		var messageTitle = document.evaluate(
			"//form/table/tbody/tr[1]/td[1]/"
			+"descendant::text()[contains(.,'[MountyHall]')]",
			document, null, 2, null
		).stringValue;
		if(messageTitle.indexOf('Attaquant') != -1 &&
			messageTitle.indexOf('sur') != -1) {
			getLevel();
			traiteRM();
		} else if(messageTitle.indexOf('Résultat du pouvoir') != -1 ||
			messageTitle.indexOf('Défenseur') != -1) {
			traiteMM();
		} else if(messageTitle.indexOf('Identification des trésors') != -1 ||
			// à replacer avec Attaque après révision getLvl :
			messageTitle.indexOf('Explosion') != -1 ||
			messageTitle.indexOf('Insulte') != -1) {
			traiteRM();
		}
	}
}

function do_actions() {
	start_script(31);
	dispatch();
	displayScriptTime();
}

/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

// x~x pre-enchant

/* 2013-08-19 : correction auto syntaxe alert */

var combobox=null;

function changeObject()
{
	if(!combobox)
		return ;
	var id = combobox.options[combobox.selectedIndex].value;
	var texte = combobox.options[combobox.selectedIndex].firstChild.nodeValue;
	if(!id || id=="")
	{
		MY_removeValue(numTroll+".enchantement.lastEquipement");
		return;
	}
	MY_setValue(numTroll+".enchantement.lastEquipement",id+";"+texte);
}

function treatePreEnchantement() {
	var input = document.evaluate("//input[@name='ai_IDLI']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!input || input.getAttribute("type")=="hidden")
	{
		return false;
	}
	MY_setValue(numTroll+".enchantement.lastEnchanteur",input.getAttribute("value"));
	combobox = document.evaluate("//select[@name='ai_IDTE']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!combobox)
	{
		return true;
	}
	combobox.addEventListener('change', changeObject, true);
	return true;
}

function treateEnchantement_pre() {
	var input = document.evaluate("//input[@name='ai_IDTE']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!input || input.getAttribute("type")!="hidden")
	{
		return false;
	}
	var idEquipement = input.getAttribute("value");
	var nomEquipement = "Equipement inconnu ("+idEquipement+")";
	var enchanteur = MY_getValue(numTroll+".enchantement."+idEquipement+".enchanteur");
	if(enchanteur && enchanteur != null)
		return true;
	input = document.evaluate("//input[@name='ai_IDLI']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!input || input.getAttribute("type")!="hidden")
	{
		return false;
	}
	var idEnchanteur = input.getAttribute("value");

	var nodes = document.evaluate(
			"//p/img[@src='../Images/greenball.gif']/following-sibling::text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength != 3)
		return;
	for(var i=0;i<3;i++)
	{
		var texte = trim(nodes.snapshotItem(i).nodeValue);
		texte = texte.replace(" d'une "," d'un ");
		var compo = texte.substring(0,texte.indexOf(" d'un "));
		var monstre = texte.substring(texte.indexOf(" d'un ")+6,texte.indexOf(" d'au minimum"));
		var qualite = texte.substring(texte.indexOf("Qualité ")+8,texte.indexOf(" ["));
		var localisation = texte.substring(texte.indexOf("[")+1,texte.indexOf("]"));
		//window.alert(compo+" ["+localisation+"] "+monstre+" "+qualite);
		MY_setValue(numTroll+".enchantement."+idEquipement+".composant."+i,compo+";"+localisation+";"+monstre.replace(/ Géante?/,"")+";"+qualite+";"+trim(nodes.snapshotItem(i).nodeValue));
	}
	MY_setValue(numTroll+".enchantement."+idEquipement+".enchanteur",idEnchanteur+";"+MY_getValue(numTroll+".position.X")+";"+MY_getValue(numTroll+".position.Y")+";"+MY_getValue(numTroll+".position.N"));
	MY_setValue(numTroll+".enchantement."+idEquipement+".objet",nomEquipement);
	var liste = MY_getValue(numTroll+".enchantement.liste");
	if(!liste || liste=="")
	{
		MY_setValue(numTroll+".enchantement.liste",idEquipement);
	}
	else
		MY_setValue(numTroll+".enchantement.liste",liste+";"+idEquipement);
}

function do_pre_enchant() {
	start_script(60);
	if(!treatePreEnchantement())
		treateEnchantement_pre();
	displayScriptTime();
}

/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

// x~x enchant

/* 2013-08-19 : correction auto syntaxe alert */

function treateEnchantement() {
	var idEnchanteur = MY_getValue(numTroll+".enchantement.lastEnchanteur");
	var infoEquipement = MY_getValue(numTroll+".enchantement.lastEquipement");
	if(!idEnchanteur || idEnchanteur=="" || !infoEquipement || infoEquipement=="")
		return;
	var tab = infoEquipement.split(";");
	if(tab.length<2)
		return;
	var idEquipement = tab[0];
	var nomEquipement = tab[1];
	for(var i=2;i<tab.length;i++)
		nomEquipement += ";"+tab[i];

	var nodes = document.evaluate(
			"//p/img[@src='../Images/greenball.gif']/following-sibling::text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength != 3)
		return;
	for(var i=0;i<3;i++)
	{
		var texte = trim(nodes.snapshotItem(i).nodeValue);
		texte = texte.replace(" d'une "," d'un ");
		var compo = texte.substring(0,texte.indexOf(" d'un "));
		var monstre = texte.substring(texte.indexOf(" d'un ")+6,texte.indexOf(" d'au minimum"));
		monstre = monstre.replace(/ Géante?/,"");
		var qualite = texte.substring(texte.indexOf("Qualité ")+8,texte.indexOf(" ["));
		var localisation = texte.substring(texte.indexOf("[")+1,texte.indexOf("]"));
		//window.alert(compo+" ["+localisation+"] "+monstre+" "+qualite);
		MY_setValue(numTroll+".enchantement."+idEquipement+".composant."+i,compo+";"+localisation+";"+monstre.replace(/ Géante?/,"")+";"+qualite+";"+trim(nodes.snapshotItem(i).nodeValue));
	}
	MY_setValue(numTroll+".enchantement."+idEquipement+".enchanteur",idEnchanteur+";"+MY_getValue(numTroll+".position.X")+";"+MY_getValue(numTroll+".position.Y")+";"+MY_getValue(numTroll+".position.N"));
	MY_setValue(numTroll+".enchantement."+idEquipement+".objet",nomEquipement);
	var liste = MY_getValue(numTroll+".enchantement.liste");
	if(!liste || liste=="")
	{
		MY_setValue(numTroll+".enchantement.liste",idEquipement);
	}
	else
		MY_setValue(numTroll+".enchantement.liste",liste+";"+idEquipement);
}

function do_enchant() {
	start_script(60);

	treateEnchantement();
	MY_removeValue(numTroll+".enchantement.lastEquipement");
	MY_removeValue(numTroll+".enchantement.lastEnchanteur");
	displayScriptTime();
}

/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

// x~x myevent

// Script désactivé en attendant la màj vers le nouveau système de missions.
function do_myevent() {
}

/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

// x~x malus

/* v1.4 - 2014-01-06
 * - Gestion des sorts double composante
 * v1.4.1 - 2014-01-22
 * - Correction décumul
 * TODO
 * - Identifier la position de "PV" dans l'ordre MH
 */

var listeBM;


/* [functions]                     Utilitaires                                  */

function decumul(bmt,nbr) {
	var bmr;
	if(!nbr || nbr<2) bmr = bmt;
	else if(nbr==2) bmr = parseInt(0.67*bmt);
	else if(nbr==3) bmr = parseInt(0.40*bmt);
	else if(nbr==4) bmr = parseInt(0.25*bmt);
	else if(nbr==5) bmr = parseInt(0.15*bmt);
	else bmr = parseInt(0.1*bmt);
	if(bmt<0) return Math.min(-1,bmr);
	return Math.max(1,bmr);
	}

function triecaracs(a,b) { // version Yoyor, mod by Dab
	// Roule 23/11/2016 ajout PV
	switch( a ) {
	case 'ATT':
		return -1;
	case 'ESQ':
		if(b=='ATT') return 1;
		return -1;
	case 'DEG':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
				return 1;
			default:
				return -1;
			}
	case 'REG':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
				return 1;
			default:
				return -1;
			}
	case 'Vue':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
				return 1;
			default:
				return -1;
			}
	case 'TOUR':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
				return 1;
			default:
				return -1;
			}
	case 'PV':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
				return 1;
			default:
				return -1;
			}
	case 'Armure':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'PV':
				return 1;
			default:
				return -1;
			}
	case 'RM':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'PV':
			case 'Armure':
				return 1;
			default:
				return -1;
			}
	case 'MM':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'PV':
			case 'Armure':
			case 'RM':
				return 1;
			default:
				return -1;
			}
	case 'Concentration':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'PV':
			case 'Armure':
			case 'RM':
			case 'MM':
				return 1;
			default:
				return -1;
			}
	case 'Fatigue':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'PV':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Concentration':
				return 1;
			default:
				return -1;
			}
	case "Dés d'attaque":
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'PV':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Concentration':
			case 'Fatigue':
				return 1;
			default:
				return -1;
			}
	case 'Dés de dégâts':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'PV':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Concentration':
			case 'Fatigue':
			case "Dés d'attaque":
				return 1;
			default:
				return -1;
			}
	default :
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'PV':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Concentration':
			case 'Fatigue':
			case "Dés d'attaque":
			case 'Dés de dégâts':
				return 1;
			default:
				return -1;
			}
		}
	}


/* [functions]              Fonctions hide / display                            */

function toggleDetailsBM() {
	if(MY_getValue('BMDETAIL')!='false') {
		MY_setValue('BMDETAIL','false');
		var trlist = document.getElementsByClassName('mh_tdpage BilanDetail');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style.display = 'none';
		trlist = document.getElementsByClassName('mh_tdpage BilanSomme');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style = '';
		}
	else {
		MY_setValue('BMDETAIL','true');
		var trlist = document.getElementsByClassName('mh_tdpage BilanSomme');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style.display = 'none';
		trlist = document.getElementsByClassName('mh_tdpage BilanDetail');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style = '';
		}
	}

function toggleBMList() {
	if(MY_getValue('BMHIDELIST')=='true') {
		MY_setValue('BMHIDELIST','false');
		for(var i=0 ; i<listeBM.snapshotLength ; i++)
			listeBM.snapshotItem(i).style = '';
		document.getElementsByTagName('thead')[0].style = '';
		document.getElementById('trhelp').style = '';
		}
	else {
		MY_setValue('BMHIDELIST','true');
		for(var i=0 ; i<listeBM.snapshotLength ; i++)
			listeBM.snapshotItem(i).style.display = 'none';
		document.getElementsByTagName('thead')[0].style.display = 'none';
		document.getElementById('trhelp').style.display = 'none';
		}
	}

function setDisplayBM() {
	if(!listeBM) return;

	var titre = document.getElementById('titre2');
	if(titre) {
		titre.style.cursor = 'pointer';
		titre.onclick = toggleBMList;
		}

	var tfoot = document.getElementsByTagName('tfoot')[0];
	var tr = document.evaluate("./tr/td/text()[contains(.,'décumul')]/../..",
								tfoot, null, 9, null).singleNodeValue;
	tr.id = 'trhelp';

	if(MY_getValue('BMHIDELIST')=='true') {
		for(var i=0 ; i<listeBM.snapshotLength ; i++)
			listeBM.snapshotItem(i).style.display = 'none';
		document.getElementsByTagName('thead')[0].style.display = 'none';
		tr.style.display = 'none';
		}
	}


/* [functions]                 Fonction principale                              */

function traiteMalus() {
	var mainTab = document.getElementById('bmm');
	if (!mainTab) {
		window.console.log('[MZ], traiteMalus, pas de table bmm');
		return;
	}
	var tbody = mainTab.tBodies[0];
	if (!tbody) {
		window.console.log('[MZ], traiteMalus, pas de BM (pas de tbody)');
		return;
	}

	/* Suppression des BM de fatigue stockés */
	if(MY_getValue(numTroll+'.bm.fatigue'))
		MY_removeValue(numTroll+'.bm.fatigue');

	/* Extraction des données */
	var uniListe = [], listeDurees = {}, listeDecumuls = {};
	var nb = 0;
	for (var tr of tbody.rows) {
		nb++;
		var effetsT = tr.cells[1].textContent.split(' | ');
		var phymag = tr.cells[3].textContent;
		var duree = tr.cells[4].textContent.match(/\d+/);
		if (duree == null) {	// Roule 28/01/2018 protection malus Crasc sans durée
			duree = 1;
		} else {
			duree = Number(duree[0]);
		}
		var type = tr.childNodes[3].textContent, nom;
		// si c'est un type à décumul
		/*
		// Roule 23/11/2016 tout semble être soumis à décumul (vérifié pour Charme, Drain de vie)
		switch(type) {
			case 'Potion':
			case 'Parchemin':
			case 'Sortilège':
			case 'Capacité Spéciale':
				nom = tr.childNodes[1].textContent+phymag;
				break;
			default:
				nom = 'pasdedecumul';
		}
		*/
		nom = tr.childNodes[1].textContent+phymag;
		if(nom.indexOf('Amnésie')!=-1) // !! Amnésie = Capa, mais pas décumulée
			nom = 'pasdedecumul';

		uniListe[nb] = {
			'duree':duree,
			'nom':nom, // permet de gérer le non décumul des sorts à double composante
			'caracs':{}
		}
		for(var i=0 ; i<effetsT.length ; i++) {
			if(effetsT[i].indexOf(':')==-1) continue;
			// structure : liste[nb]=[duree , nom , [type ,] Array[caracs] ]
			// nom = 'pasdedecumul' si pas de décumul
			var carac = trim( effetsT[i].substring(0,effetsT[i].indexOf(':')) ) ;
			if(carac=='ATT' || carac=='DEG' || carac=='Armure')
				uniListe[nb]['type'] = phymag;
			//var bm = Number(effetsT[i].match(/-?\d+/)[0]);
			var tmatch = effetsT[i].match(/(-?\d+)(\\([+-]?\d+))?/);	// un numérique et exceptionnellement un autre numérique précédé d'un antislash
			if (tmatch[2] == undefined) var bm = Number(tmatch[1]);	// cas DEG : -6
			else                        var bm = Number(tmatch[3]);	// cas DEG : +0\-5
			uniListe[nb]['caracs'][carac] = bm;
			if (MY_DEBUG) window.console.log('[MZ debug] effetsT[' + i + ']=' + effetsT[i] + ', uniListe[' + nb + '][\'caracs\'][' + carac + '] = ' + bm + ', durée=' + duree + ' tmatch=' + JSON.stringify(tmatch));
			listeDurees[duree] = true;
		}
	}	// fin boucle sur les lignes de bonus/malus

	/* Gestion des décumuls et cumuls des durées */
	var toursGeres = [];
	for(var d in listeDurees) toursGeres.push(d);
	toursGeres.sort( function (a,b){return b-a;} );
	if (MY_DEBUG) window.console.log('[MZ debug] toursGeres=' + JSON.stringify(toursGeres) + "\nuniListe=" + JSON.stringify(uniListe));
	// pour sauvegarder les bm de fatigue
	var strfat = '';
	// Pour affichage & adpatation à footable.js (statique)
	var thead = document.getElementsByTagName('thead')[0];
	var nbHidden = document.evaluate("./tr/th[@style='display: none;']",
									thead, null, 7, null).snapshotLength;
	var tfoot = document.getElementsByTagName('tfoot')[0];

	for(var i=0 ; i<toursGeres.length ; i++) {
		var tour = toursGeres[i];
		var effetsCeTour = {}; decumulsCeTour = {};
		for(var nb=1 ; nb<uniListe.length ; nb++) {
			if(uniListe[nb]['duree']<toursGeres[i]) // si durée pvr < durée analysée, on passe
				continue;
			var nom = uniListe[nb]['nom'];
			if(nom!='pasdedecumul') {
				if(decumulsCeTour[nom]==null) decumulsCeTour[nom] = 0;
				decumulsCeTour[nom]++;
				}
			for(var carac in uniListe[nb]['caracs']) {
				var bm = uniListe[nb]['caracs'][carac];
				if(carac=='ATT' || carac=='DEG' || carac=='Armure') {
					var type = uniListe[nb]['type'];
					if(!effetsCeTour[carac])
						effetsCeTour[carac] = {'Physique':0, 'Magie':0};
					var thisBm;
					if(nom=='pasdedecumul')
						thisBm = bm;
					else
						thisBm = decumul(bm,decumulsCeTour[nom]);
					effetsCeTour[carac][type] += thisBm;
					if (MY_DEBUG) window.console.log('calcul décumul tour=' + tour + ', nom=' + nom + ', carac=' + carac + ', bm=' + bm + ', type=' + type + ', decumulsCeTour[nom]=' + decumulsCeTour[nom] + ' : ' + thisBm + ' => ' + effetsCeTour[carac][type]);
				} else {
					if(!effetsCeTour[carac]) effetsCeTour[carac]=0;
					var thisBm;
					if(nom=='pasdedecumul' || carac=='Fatigue')
						thisBm = bm;
					else if(carac=='TOUR') // les durees se comptent en demi-minutes dans MH
						thisBm = decumul(2*bm,decumulsCeTour[nom])/2;
					else
						thisBm = decumul(bm,decumulsCeTour[nom]);
					effetsCeTour[carac] += thisBm;
					if (MY_DEBUG) window.console.log('calcul décumul tour=' + tour + ', nom=' + nom + ', carac=' + carac + ', bm=' + bm + ', decumulsCeTour[nom]=' + decumulsCeTour[nom] + ' : ' + thisBm + ' => ' + effetsCeTour[carac]);
				}
			}	// fin boucle sur les caractéristiques
		}	// fin boucle sur les bonus/malus

		/* Création du bilan du tour */
		var texteD = '', texteS = '';
		var caracGerees = [];
		for(var k in effetsCeTour) caracGerees.push(k);
		caracGerees.sort( triecaracs );

		for(var j=0 ; j<caracGerees.length ; j++) {
			var carac = caracGerees[j], str = '';
			if (MY_DEBUG) window.console.log('MZ traiteMalus, j=' + j + ', carac=' + carac + ', effetsCeTour=' + effetsCeTour[carac] + ', toursGeres=' + toursGeres[i]);

			switch( carac ) {
				case 'ATT':
				case 'DEG':
				case 'Armure':
					var phy = effetsCeTour[carac]['Physique'];
					var mag = effetsCeTour[carac]['Magie'];
					texteD += (phy || mag)? ' | '+carac+' : '+aff(phy)+'/'+aff(mag) : '';
					texteS += (phy+mag) ? ' | '+carac+' : '+aff(phy+mag) : '';
					break;
				case 'TOUR':
					str = effetsCeTour[carac]? ' | TOUR : '+aff( effetsCeTour[carac] )+' min' : '';
					break;
 				case 'Fatigue':
					strfat += toursGeres[i]+'-'+effetsCeTour[carac]+';';
				case 'PV':
				case 'PVMax':
				case 'ESQ':
				case 'REG':
				case 'Vue':
				case 'VUE':
				case 'Voir le Caché':
					str = effetsCeTour[carac]? ' | '+carac+' : '+aff( effetsCeTour[carac] ) : '';
					break;
				default:
					str = effetsCeTour[carac]? ' | '+carac+' : '+aff( effetsCeTour[carac] )+' %' : '';
			}
			if(str) {
				texteD += str;
				texteS += str;
			}
			if (MY_DEBUG) window.console.log('MZ traiteMalus, j=' + j + ', strfat=' + strfat);
		}	// fin boucle sur les caractéristiques

		/* Affichage */
		// Si rien à afficher on passe
		if(!texteD) continue;
		// Si BMM+BMP=0
		texteS = texteS ? texteS.substring(3) : 'Aucun effet';
		var tr = insertTr(tfoot.childNodes[2],'mh_tdpage BilanDetail');
		if(MY_getValue('BMDETAIL')=='false')
			tr.style.display = 'none';
		var td = appendTdText(tr,texteD.substring(3));
		td.colSpan = 4-nbHidden;
		var txttour = toursGeres[i]+' Tour';
		if(toursGeres[i]>1) txttour += 's';
		appendTdText(tr,txttour);

		tr = insertTr(tfoot.childNodes[2],'mh_tdpage BilanSomme');
		if(MY_getValue('BMDETAIL')!='false')
			tr.style.display = 'none';
		td = appendTdText(tr,texteS);
		td.colSpan = 4-nbHidden;
		appendTdText(tr,txttour);
	}	// fin boucle sur les tours générés

	/* mise en place toggleDetails */
	tfoot.style.cursor = 'pointer';
	tfoot.onclick = toggleDetailsBM;

	/* Stockage fatigue : tour-fatigue;tour-fatigue;... */
	if(strfat)
		MY_setValue(numTroll+'.bm.fatigue',strfat);
}

function do_malus() {
	try {
	start_script();
	traiteMalus();
	setDisplayBM();
	displayScriptTime();
	}
	catch(e) {window.alert(e)};
}

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x mouches

var mainTab, tr_mouches;

function initialiseMouches() {
// Lanceur global
	try {
		mainTab = document.getElementById('mouches');
		tr_mouches = document.evaluate('./tbody/tr', mainTab, null, 7, null);
	} catch(e) {
		avertissement('Erreur MZ:<br />Consulter la console.');
		window.console.error(traceStack(e, 'mouches'));
		return;
	}
	if(mainTab===void(0) || tr_mouches.snapshotLength==0) { return; }

	setDisplayMouches();
	traiteMouches();
}

function setDisplayMouches() {
// Initialise l'affichage / l'effacement du détail des mouches
	var titre = document.getElementById('titre2');
	if(titre) {
		titre.style.cursor = 'pointer';
		titre.onclick = toggleMouches;
	}

	var tfoot = document.getElementsByTagName('tfoot')[0];
	if(tfoot) {
		tfoot.style.cursor = 'pointer';
		tfoot.onclick = toggleMouches;
	}

	if(MY_getValue('HIDEMOUCHES')=='true') {
		for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
			tr_mouches.snapshotItem(i).style.display = 'none';
		}
		document.getElementsByTagName('thead')[0].style.display = 'none';
	}
}

function toggleMouches() {
// Handler pour afficher / masquer les détasil
	if(MY_getValue('HIDEMOUCHES')=='true') {
		MY_setValue('HIDEMOUCHES','false');
		for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
			tr_mouches.snapshotItem(i).style.display = '';
		}
		document.getElementsByTagName('thead')[0].style.display = '';
	} else {
		MY_setValue('HIDEMOUCHES','true');
		for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
			tr_mouches.snapshotItem(i).style.display = 'none';
		}
		document.getElementsByTagName('thead')[0].style.display = 'none';
	}
}

function traiteMouches() {
// Traitement complet: présence et effets des mouches
	var listeTypes = {}, effetsActifs = {};
	//if (MY_DEBUG) window.console.log('traiteMouches, tr_mouches.length=' + tr_mouches.snapshotLength);

	for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
		var tr = tr_mouches.snapshotItem(i);

		// La mouche est-elle présente?
		var etat = document.evaluate(
			'./img',
			tr.cells[6], null, 9, null
		).singleNodeValue.alt;
		//if (MY_DEBUG) window.console.log('traiteMouches, i=' + i + ', etat=' + etat + ', type=' + trim(tr.cells[3].textContent));
		if(etat!='La Mouche est là') { continue; }
		// Extraction du type de mouche
		var type = trim(tr.cells[3].textContent);
		if(!listeTypes[type]) {
			listeTypes[type] = 1;
		} else {
			listeTypes[type]++;
		}
		//if (MY_DEBUG) window.console.log('traiteMouches, i=' + i + ', etat=' + etat + ', type=' + type + ', nb=' + listeTypes[type]);

		// La mouche a-t-elle un effet?
		var effet = trim(tr.cells[2].textContent);
		if(etat!='La Mouche est là' || !effet) { continue; }
		// Si oui, extraction des effets (multiples pour pogées)
		var caracs = effet.split(' | ');
		for(var j=0 ; j<caracs.length ; j++) {
			var carac = caracs[j].substring(0,caracs[j].indexOf(':')-1);
			var valeur = Number(caracs[j].match(/-?\d+/)[0]);
			if(effetsActifs[carac]===void(0)) {
				effetsActifs[carac] = valeur;
			} else {
				effetsActifs[carac] += valeur;
			}
		}
	}

	// Extraction Effet total et affichage des différences à la normale
	var tfoot = document.getElementsByTagName('tfoot')[0];
	if(!tfoot) { return; }
	var nodeTotal = document.evaluate(
		".//b[contains(./text(),'Effet total')]",
		tfoot, null, 9, null
	).singleNodeValue.nextSibling;
	var effetsTheoriques = nodeTotal.nodeValue.split('|');
	var texte = ' ';
	for(var i=0 ; i<effetsTheoriques.length ; i++) {
		if(texte.length>1) { texte += ' | '; }
		var carac = trim(
			effetsTheoriques[i].substring(0,effetsTheoriques[i].indexOf(':')-1)
		);
		var valeur = effetsTheoriques[i].match(/-?\d+/)[0];
		if(effetsActifs[carac]!==void(0) && effetsActifs[carac]==valeur) {
			texte += effetsTheoriques[i];
		} else {
			texte += '<b>'+carac+' : '+aff(effetsActifs[carac]);
			if(carac=='TOUR') { texte += ' min'; }
			texte += '</b>';
		}
	}
	var span = document.createElement('span');
	span.innerHTML = texte;
	nodeTotal.parentNode.replaceChild(span,nodeTotal);

	// Affichage des différences du nombre de mouches de chaque type
	var mouchesParType = document.evaluate(
		"./tr/td/ul/li/text()",
		tfoot, null, 7, null
	);
	for(var i=0 ; i<mouchesParType.snapshotLength ; i++) {
		var node = mouchesParType.snapshotItem(i);
		//var mots = node.nodeValue.split(' ');
		//var type = mots.pop();
		var tMatch = node.nodeValue.match(/([0-9]+) .*à *([^ ]+)/);
		if (!tMatch) continue;
		var nMouche = tMatch[1];
		var type = tMatch[2];
		if (MY_DEBUG) window.console.log('traiteMouches, texte=' + node.nodeValue + ', tMatch=' + JSON.stringify(tMatch) + ', type=' + type);
		if(!listeTypes[type]) {
			node.nodeValue += ' (0 présente)';
		} else if(nMouche != listeTypes[type]) {
			if(listeTypes[type]==1) {
				node.nodeValue += ' (1 présente)';
			} else {
				node.nodeValue += ' ('+listeTypes[type]+' présentes)';
			}
		}
	}
}

function do_mouches() {
	start_script();
	initialiseMouches();
	displayScriptTime();
}

/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

// x~x equipgowap

var popup;

function initPopupEquipgowap() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;' +
			'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function showPopupEquipgowap(evt) {
	var texte = this.getAttribute("texteinfo");
	popup.innerHTML = texte;
	popup.style.left = evt.pageX + 15 + 'px';
	popup.style.top = evt.pageY + 'px';
	popup.style.visibility = "visible";
}

function hidePopup() {
	popup.style.visibility = "hidden";
}

function createPopupImage(url, text)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('align','ABSMIDDLE');
	img.setAttribute("texteinfo",text);
	img.addEventListener("mouseover", showPopupEquipgowap,true);
	img.addEventListener("mouseout", hidePopup,true);
	return img;
}

function formateTexte(texte)
{
	texte = texte.replace(/\n/g,"<br/>");
	texte = texte.replace(/^([^<]*) d'un/g,"<b>$1</b> d'un");
	texte = texte.replace(/<br\/>([^<]*) d'un/g,"<br/><b>$1</b> d'un");
	texte = texte.replace(/(d'une? )([^<]*) d'au/g,"$1<b>$2</b> d'au");
	texte = texte.replace(/(Qualité )([^<]*) \[/g,"$1<b>$2</b> [");
	texte = texte.replace(/\[([^<]*)\]/g,"[<b>$1</b>]");
	return texte;
}


function treateGowaps() {
	//On récupère les gowaps possédants des composants
	var tbodys = document.evaluate(
			"//tr[@class='mh_tdpage_fo']/descendant::img[@alt = 'Composant - Spécial']/../../..",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var j = 0; j < tbodys.snapshotLength; j++) {
		var tbody = tbodys.snapshotItem(j);
		var id_gowap = currentURL.substring(currentURL.indexOf("?ai_IdFollower=")+15)*1;
		//insertButtonComboDB(tbody, 'gowap', id_gowap,'mh_tdpage_fo');
		if(MY_getValue("NOINFOEM") != "true")
			insertEMInfos(tbody);
		if(MY_getValue(numTroll+".enchantement.liste") && MY_getValue(numTroll+".enchantement.liste")!="" )
			insertEnchantInfos(tbody);
	}
}

function treateChampi() {
	if(MY_getValue("NOINFOEM") == "true")
		return false;
	var nodes = document.evaluate("//img[@alt = 'Champignon - Spécial']/../a/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	for (var i = 0; i < nodes.snapshotLength; i++) {
			var node = nodes.snapshotItem(i);
			var texte = trim(node.nodeValue.replace(/\240/g, " "));
			if(texte.indexOf("*")!=-1)
				texte = texte.substring(0,texte.lastIndexOf(" "));
			var nomChampi = texte.substring(0,texte.lastIndexOf(" "));
			if(moisChampi[nomChampi])
			{
				appendText(node.parentNode.parentNode," [Mois "+moisChampi[nomChampi]+"]");
			}

	}
}

function do_equipgowap() {
	start_script();

	treateGowaps();
	treateChampi();
	if(MY_getValue(numTroll+".enchantement.liste") && MY_getValue(numTroll+".enchantement.liste")!="" )
	{
		initPopupEquipgowap();
		computeEnchantementEquipement(createPopupImage,formateTexte);
	}

	displayScriptTime();
}

/*********************************************************************************
*   This file is part of zoryazilla & mountyzilla, published under GNU License   *
*********************************************************************************/

// x~x ordresgowap

var MZ_analyse_page_ordre_suivant;
if (MZ_analyse_page_ordre_suivant === undefined && isPage("MH_Follower/FO_Ordres")) {
	// Roule 07/10/2019
	// Fonction réutilisée dans MZ, dans Trajet_canvas et dans une extension perso ☺
	// rend un object, par exemple
	var MZ_analyse_page_ordre_suivant = {
		'result': {ordres: []},
		'init': function() {
			// façon blindée de tester la variable MY_DEBUG
			if (typeof MY_DEBUG !== 'undefined' && MY_DEBUG) window.console.log('start MZ_analyse_page_ordre_suivant.init');
			try {
				var eTitle = document.getElementById('titre2');
				// au 07/10/2019, on peut se baser sur les <tr> de l'élément HTML parent 'titre2'
				//if (typeof MY_DEBUG !== 'undefined' && MY_DEBUG) window.console.log('eTitle.nextSibling=' + eTitle.parentNode);
				var lignes = eTitle.parentNode.getElementsByTagName('tr');
				for(var i=0 ; i<lignes.length ; i++) {
					//if (typeof MY_DEBUG !== 'undefined' && MY_DEBUG) window.console.log('MZ_analyse_page_ordre_suivant tr ' + i +  ' className=' + lignes[i].className);
					//if (typeof MY_DEBUG !== 'undefined' && MY_DEBUG) window.console.log('MZ_analyse_page_ordre_suivant tr ' + i +  lignes[i].innerHTML);
					var etd = lignes[i].getElementsByTagName('td')[0];
					if(lignes[i].className == 'mh_tdtitre_fo'
						|| (etd && etd.className == 'mh_tdtitre_fo')) {
						var tds = lignes[i].getElementsByTagName('div');
						for (var j=0; j < tds.length; j++) {
							//if (typeof MY_DEBUG !== 'undefined' && MY_DEBUG) window.console.log('MZ_analyse_page_ordre_suivant div ' + j + ' ' + tds[j].innerText);
							var tabmatch = tds[j].innerText.match(/(\d+) *\.* *(.*\[.*\].*)$/);
							if (tabmatch) {
								// ID, Nom
								this.result.id = tabmatch[1].trim();
								this.result.nom = tabmatch[2].trim();
							}
							tabmatch = tds[j].innerText.match(/(\d+) *PA.*X = (-?\d+).*Y = (-?\d+).*N = (-?\d+)/i);
							if (tabmatch) {
								// PA, x, y, n
								this.result.PA = parseInt(tabmatch[1]);
								this.result.x = parseInt(tabmatch[2]);
								this.result.y = parseInt(tabmatch[3]);
								this.result.n = parseInt(tabmatch[4]);
								// Trajet_canvas a besoin d'un pointeur vers cette div
								this.result.eltPos = tds[j];
							}
						}
					}
					else if(lignes[i].className == 'mh_tdpage_fo') {
						if (etd !== undefined) {	// undefined dans le cas des Golems
							if (typeof MY_DEBUG !== 'undefined' && MY_DEBUG) window.console.log('MZ_analyse_page_ordre_suivant td[0]=' + etd.textContent);
							var tabmatch = etd.textContent.match(/^(.*)X=(-?\d+) \| Y=(-?\d+) \| N=(-?\d+)/i);
							if (tabmatch) {
								this.result.ordres.push({ordre: tabmatch[1].trim(), x: parseInt(tabmatch[2]), y: parseInt(tabmatch[3]), n: parseInt(tabmatch[4])});
							} else {
								this.result.ordres.push({ordre: etd.textContent.trim()});
							}
						}
					}
				}
				if (typeof MY_DEBUG !== 'undefined' && MY_DEBUG) window.console.log('fin MZ_analyse_page_ordre_suivant ' + JSON.stringify(this.result));
			} catch(e) {
				window.console.log('Exception dans MZ_analyse_page_ordre_suivant.init ' + e);
			}
		}
	}
	MZ_analyse_page_ordre_suivant.init();
}

// version Roule' janvier 2017
function MZ_setCarteUnGogoHTML5() {
	// fabriquer la liste des positions successives
	var listeDepl = [];	// ce sera un tableau d'objets
	listeDepl = MZ_analyse_page_ordre_suivant.result.ordres.slice(0);	// clone array
	listeDepl.unshift(MZ_analyse_page_ordre_suivant.result);	// le result de MZ_analyse_page_ordre_suivant a déjà juste les bonne propriétés

	/* à supprimer, remplacé par MZ_analyse_page_ordre_suivant
	listeDepl.push({x: parseInt(tabPos[2])	// ParseInt obligatoire, javascript language de m*rd*
		, y: parseInt(tabPos[3])
		, n: parseInt(tabPos[4])
		, nom: tabNomID[2]
		, id: tabNomID[1]});

	// position courante
	var eTitle = document.getElementById('titre2');
	// déplacements
	var lignes = eTitle.parentNode.getElementsByTagName('tr');
	for(var i=0 ; i<lignes.length ; i++) {
		//window.console.log('MZ_setCarteUnGogoHTML5 ' + i +  ' className=' + lignes[i].className);
		//window.console.log('MZ_setCarteUnGogoHTML5 ' + i +  lignes[i].innerHTML);
		if(lignes[i].className == 'mh_tdtitre_fo') {
			var tds = lignes[i].getElementsByTagName('div');
			for (var j=0; j < tds.length; j++) {
				tabmatch = tds[j].innerText.match(/(\d+) *(.*\[.*\].*)$/);
				if (tabmatch) var tabNomID = tabmatch;
				tabmatch = tds[j].innerText.match(/(\d+) *PA.*X = (-.\d+).*Y = (-.\d+).*N = (-.\d+)/i);
				if (tabmatch) var tabPos = tabmatch;
			}
		if (tabPos != undefined && tabNomID != undefined) {	// null dans le cas des Golems
			listeDepl.push({x: parseInt(tabPos[2])	// ParseInt obligatoire, javascript language de m*rd*
				, y: parseInt(tabPos[3])
				, n: parseInt(tabPos[4])
				, nom: tabNomID[2]
				, id: tabNomID[1]});
			} else {
				return;
			}
		}
		if(lignes[i].className == 'mh_tdpage_fo') {
			var etd = lignes[i].getElementsByTagName('td')[0];
			if (etd === undefined) return;	// cas des Golems
			var point = etd.firstChild.nodeValue.match(/X=(-?\d+) \| Y=(-?\d+) \| N=(-?\d+)/i);
			if (point) listeDepl.push({x: parseInt(point[1]), y: parseInt(point[2]), n: parseInt(point[3])});
		}
	}
	*/
	MZ_showCarteBottom([listeDepl]);	// L'arg est un tableau de tableaux d'objets
}

// L'arg est un tableau de tableaux d'objets (trajets des suivants)
function MZ_showCarteBottom(listeSuiv) {
	// générer la carte
	var carte = new carte_MZ('cartegogo', listeSuiv);
	// positionner la carte
	var eCarte = carte.getElt();
	eCarte.style.textAlign = 'left';
	eCarte.style.marginTop = '2px';
	var footer = document.getElementById('footer1');
	// Lieu_Teleport.php n'a pas de footer1 :(
	if (!footer) footer = document.getElementById('footer2');
	if (footer) footer.parentNode.insertBefore(eCarte, footer);
	else document.body.appendChild(eCarte);
}

function MZ_setCarteTousGogoHTML5() {
	// partie récupérée de "trajet gowaps" de feldspath et Vapulabehemot
	var tabForm = document.getElementsByTagName("form");
	if (tabForm.length < 0) var ligne = [0].getElementsByTagName("tbody")[0].childNodes;	// ancienne version
	else                    var ligne = document.getElementById("mhPlay").getElementsByTagName("tbody")[0].childNodes;
	var suivants = [];
	for (var i=0;i<ligne.length;i++) {
		if(ligne[i].nodeName != "TR" || !ligne[i].getElementsByTagName('a')[0]) continue;
		var cas = ligne[i].getElementsByTagName("td")[0];
		//if (cas.className == "mh_tdtitre") {
		if (cas.className == "mh_tdtitre_fo") {// correction par Vapulabehemot (82169) le 10/07/2015
			var oGogo = {};
			oGogo.id = parseInt(cas.getElementsByTagName('a')[0].href.split("=")[1]);
			oGogo.nom = trim(cas.getElementsByTagName('a')[0].firstChild.nodeValue);
			var point = cas.innerHTML.match(/X[ \n\r]+=[ \n\r]+(-?\d+)[ \n\r]+\|[ \n\r]+Y[ \n\r]+=[ \n\r]+(-?\d+)[ \n\r]+\|[ \n\r]+N =[ \n\r]+(-?\d+)/);	// Roule 21/01/2020 des espaces multiples et un saut de ligne sont apparus entre "Y" et "="
			oGogo.x = parseInt(point[1]);
			oGogo.y = parseInt(point[2]);
			oGogo.n = parseInt(point[3]);
			suivants.push([oGogo]);	// un suivant ayant un trajet d'une seule étape
		}
	}
	if (suivants.length == 0) return;
	MZ_showCarteBottom(suivants);	// L'arg est un tableau de tableaux d'objets
}

function MZ_setCarteTP() {
	// regexp compliquée par le fait que MH met une rupture de ligne dans les coord dans la page Lieu_Description.php
	var pos = window.document.getElementsByTagName("body")[0].innerHTML.match(/X[\n\r\t ]*=[\n\r\t ]*(-?\d+)[\n\r\t ]*\|[\n\r\t ]*Y[\n\r\t ]*=[\n\r\t ]*(-?\d+) *\|[\n\r\t ]*N[\n\r\t ]*=[\n\r\t ]*(-?\d+)/i);
	var sortie = {x:parseInt(pos[1]), y:parseInt(pos[2]), n:parseInt(pos[2]), id:'', nom:'Sortie TP', typ:'tp'};
	MZ_showCarteBottom([[sortie]]);	// L'arg est un tableau de tableaux d'objets
}

function testeGlissiere() {
	try {
		var gliss = new glissiere_MZ('test', 'Test glissière', 'xxx', false, 100, 50, 250);
		var footer = document.getElementById('footer1');
		footer.parentNode.insertBefore(gliss.getElt(), footer);
	} catch (e) {window.console.log(traceStack(e, 'testeGlissiere'))};
}

function MZ_testsUnitairesCalculIntermediaire(x0, y0, x1, y1) {
	if (x0 !== undefined) {
		// ouais, récursif une fois
		var PtInterm = pointIntermediaireMonstre2D({x:x0, y:y0}, {x:x1, y:y1});
		if (PtInterm === undefined)
			window.console.log('pt interm(' + x0 + ',' + y0 + ')(' + x1 + ',' + y1 + ') => rien');
		else
			window.console.log('pt interm(' + x0 + ',' + y0 + ')(' + x1 + ',' + y1 + ') => (' + PtInterm.x + ',' + PtInterm.y +')');
		return;
	}
	// MZ_testsUnitairesCalculIntermediaire(10, 10, 100, 100);
	// MZ_testsUnitairesCalculIntermediaire(10, 100, 100, 10);
	// MZ_testsUnitairesCalculIntermediaire(100, 10, 10, 100);
	// MZ_testsUnitairesCalculIntermediaire(100, 100, 10, 10);
	MZ_testsUnitairesCalculIntermediaire(10, 10, 100, 80);
	MZ_testsUnitairesCalculIntermediaire(10, 10, 80, 100);
	MZ_testsUnitairesCalculIntermediaire(10, 100, 80, 10);
	MZ_testsUnitairesCalculIntermediaire(10, 80, 100, 10);
	MZ_testsUnitairesCalculIntermediaire(100, 10, 10, 80);
	MZ_testsUnitairesCalculIntermediaire(80, 10, 10, 100);
	MZ_testsUnitairesCalculIntermediaire(100, 80, 10, 10);
	MZ_testsUnitairesCalculIntermediaire(80, 100, 10, 10);
	MZ_testsUnitairesCalculIntermediaire(-80, 100, -10, 10);
	MZ_testsUnitairesCalculIntermediaire(80, -100, 10, -10);
	MZ_testsUnitairesCalculIntermediaire(-80, -100, -10, -10);
	MZ_testsUnitairesCalculIntermediaire(35, -87, 45, -87);
	MZ_testsUnitairesCalculIntermediaire(45, -87, 45, -77);
}

function do_ordresgowap() {
	MZ_setCarteUnGogoHTML5();		// Version Roule janvier 2017
	//testeGlissiere();
	//MZ_testsUnitairesCalculIntermediaire();
}

function do_listegowap() {
	MZ_setCarteTousGogoHTML5();
}

function do_lieuDescription() {
	if (window.document.getElementsByTagName("body")[0].innerHTML.indexOf("Portail : Portail de T") != -1)
		MZ_setCarteTP();
}

function do_lieuTeleport() {
	changeButtonValidate();
	MZ_setCarteTP();
}

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x infomonstre

// DEBUG
var nomMonstre='';
var idMonstre=-1;
//var tbody;
// var popup; // NOTE Linter : already defined

function traiteMonstre() {
	try {
		var nodeTitre = document.evaluate(
			"//div[@class='titre2' and contains(text(),'(')]",
			document, null, 9, null
		).singleNodeValue;
		var texte = nodeTitre.firstChild.nodeValue;
	} catch(e) {
		window.console.log(traceStack(e, 'traiteMonstre'));
		return;
	}

	nomMonstre = texte.slice(0,texte.indexOf('(')-1);
	if(nomMonstre.indexOf(']')!=-1) {
		nomMonstre = nomMonstre.slice(0,nomMonstre.indexOf(']')+1);
	}
	idMonstre = texte.match(/[^\]]\].*\((\d+)\)/)[1];
	var tReq = [{'index':1, 'id':+idMonstre, 'nom':nomMonstre}];	// "+" pour forcer du numérique
	FF_XMLHttpRequest({
		method: 'POST',
		url: URL_MZgetCaracMonstre,
		headers : {
			'Content-type':'application/x-www-form-urlencoded'
		},
		data: 'l=' + JSON.stringify(tReq),
		trace: 'demande niveaux monstres V2, MonsterView',
		onload: function(responseDetails) {
			try {
				//window.console.log('retrieveCDMs readyState=' + responseDetails.readyState + ', error=' + responseDetails.error + ', status=' + responseDetails.status);
				if (responseDetails.status == 0) return;
				//window.console.log('[MZd] ' + (+new Date) + ' ajax niv monstres début');
				var texte = responseDetails.responseText;
				var infosRet = JSON.parse(texte);
				if(infosRet.length==0) return;
				var info = infosRet[0];
				// QUESTION Quelle est l'utilité de ceci?
				// Roule 19/01/2020 Il doit y avoir un endroit "au fond du trou" où le code va chercher les infos à partir de l'ID. Est-ce que c'est propre ? : non
				MZ_EtatCdMs.listeCDM[idMonstre] = info;
				try {
					var nodeInsert = document.evaluate(
						"//div[@class = 'titre3']",
						document, null, 9, null
					).singleNodeValue;
				} catch(e) {
					window.console.log(traceStack(e, 'recherche node pour info CdM'));
					return;
				}
				var table = createCDMTable(idMonstre,nomMonstre,info);
				table.align = 'center';
				var tbody = table.childNodes[1];
				var thead = table.childNodes[0];
				var tdEntete = thead.firstChild.firstChild;
				tdEntete.onclick = toggleTableau;
				tdEntete.style.cursor = 'pointer';
				thead.firstChild.style = 'mh_tdpage';
				tbody.style.display = 'none';
				table.style.width = '350px';
				insertBefore(nodeInsert,table);
			} catch(e) {
				window.console.log(e);
			}
		},
	});
}

function toggleTableau() {	// click sur un td de thead
	var tbody = this.parentNode.parentNode.parentNode.childNodes[1];
	tbody.style.display = tbody.style.display=='none' ? '' : 'none';
}

function do_infomonstre() {
	start_script();
	try {
		MZ_Tactique.initPopup();
		traiteMonstre();
	} catch(e) {
		window.console.error(traceStack(e, 'do_infomonstre'));
		window.alert('Erreur infoMonstre:\n'+e);
	}
	displayScriptTime();
}

/***
 *** SCIZ
 ***/

var scizSetup = {
	// Maximum interval (seconds) for matching some events
	eventsMaxMatchingInterval: 5000,
	// Maximum number of treasures to enhanced in the view
	viewMaxEnhancedTreasure: 100,
	// Maximum number of treasures to enhanced in the view
	viewMaxEnhancedMushroom: 100
};

var scizGlobal = {
	events: [],
	trolls: [],
	treasures: [],
	monsters: [],
	traps: [],
	mushrooms: [],
    portals: []
};

function scizAddCSS() {
	// SCIZ style
	var scizStyle = `
		.sciz-progress-bar-wrapper {
			width: 75px;
			margin-right: 5px;
			display: inline-block;
		}
		.sciz-progress-bar {
			width: 100%;
			background-color: #e0e0e0;
			padding: 1px;
			border-radius: 1px;
			box-shadow: inset 0 1px 3px rgba(0, 0, 0, .2);
		}
		.sciz-progress-bar-fill {
			display: block;
			height: 5px;
			border-radius: 1px;
			transition: width 500ms ease-in-out;
		}
		.sciz-troll-view-block {
			display: inline-block;
			padding-left: 10px;
			margin-left: 10px;
			border-left: 1px solid black;
			white-space: pre-wrap;
		}
	`;
	// Actually add the SCIZ style
	var scizStyleSheet = document.createElement('style');
	scizStyleSheet.type = 'text/css';
	if (scizStyleSheet.styleSheet) {
		scizStyleSheet.styleSheet.cssText = scizStyle;
	} else {
		scizStyleSheet.appendChild(document.createTextNode(scizStyle));
	}
	document.getElementsByTagName('head')[0].appendChild(scizStyleSheet);
}

function scizCreateHoverable(height, display, callbackOnHover) {
	var img = document.createElement('img');
	img.src = 'https://www.sciz.fr/static/sciz-logo-quarter.png';
	img.alt = 'SCIZ logo';
	img.style = 'height: ' + height + 'px; cursor: pointer;';
	img.onmouseover = callbackOnHover;
	var div = document.createElement('div');
	div.style = 'text-align: center;display: ' + display;
	div.appendChild(img);
	return div;
};

function scizCreateClickable(height, display, callbackOnClick) {
	var img = document.createElement('img');
	img.src = 'https://www.sciz.fr/static/sciz-logo-quarter.png';
	img.alt = 'SCIZ logo';
	img.style = 'height: ' + height + 'px; cursor: pointer;';
	img.onclick = callbackOnClick;
	var div = document.createElement('div');
	div.style = 'text-align: center;display: ' + display;
	div.appendChild(img);
	return div;
};

function scizCreateIcon(height, display, icon) {
	var img = document.createElement('img');
	img.src = 'https://www.sciz.fr/static/' + icon;
	img.alt = 'SCIZ icon';
	img.style = 'height: ' + height + 'px;';
	var div = document.createElement('div');
	div.style = 'text-align: center;display: ' + display;
	div.appendChild(img);
	return div;
};

/* SCIZ - View */

function scizPrettyPrintTroll(t) {
	var res = '<div style="float:right;margin-right:10px">';
	// Life progress bar
	var pbPercent = (t.pdv !== null && t.pdv_max !== null) ? Math.min(100, t.pdv / t.pdv_max * 100) : -1;
	var pbColor = (pbPercent === -1) ? '#424242' : ((pbPercent < 40) ? '#ff5252' : ((pbPercent < 80) ? '#fb8c00' : '#4caf50'));
	t.pdv_max = (t.pdv_max === null) ? '?' : t.pdv_max;
	res += '<div class="sciz-progress-bar-wrapper"><div class="sciz-progress-bar"><span class="sciz-progress-bar-fill" style="background-color: ' + pbColor + ';;width: ' + pbPercent + '%;"></span></div></div>';
	res += '' + t.pdv + ' / ' + t.pdv_max;
	// DLA
	res += '<div class="sciz-troll-view-block">DLA ' + t.dla + '</div>';
	// PA
	res += '<div class="sciz-troll-view-block"><= ' + t.pa + ' PA</div>';
	// Fatigue
	res += '<div class="sciz-troll-view-block">Fatigue ' + ('  ' + t.fatigue).slice(-3) + '</div>';
	// Concentration
	res += '<div class="sciz-troll-view-block">Conc ' + (' ' + t.concentration).slice(-2) + '%</div>';
	res += '</div>';
	return res;
}

function scizPrettyPrintTreasure(t) {
	var res = '';
	res += /* t.type + ' - ' + */ t.nom;
	if (t.templates) { res += ' <b>' + t.templates + '</b>' };
	if (t.mithril) { res += ' <b>en Mithril</b>' };
	if (t.effet) { res += ' (' + t.effet + ')' };
	return res;
}

function scizPrettyPrintTrap(t) {
	var res = '<span style="color:#990000">';
	res += 'Piège à ' + t.type + ' ';
	if (t.mm) { res += '(MM ' + t.mm + ') ' };
	if (t.creation_datetime) { res += ' - ' + t.creation_datetime + ' '};
	res += '</span>';
	return res;
}

function scizPrettyPrintMushroom(m) {
	var res = '';
	res += m.nom;
	if (m.qualite) { res += ' <b>' + m.qualite + '</b>' };
	return res;
}

function scizPrettyPrintPortal(p) {
	var res = '';
    var html_nom = '<a href="javascript:EPV(' + p.owner_id + ')" class="mh_trolls_1">' + p.owner_nom + '</a>'
	res += 'Portail de Téléportaion de ' + html_nom + ' vers X = ' + p.pos_x_dst + ' | Y = ' + p.pos_y_dst + ' | N = ' + p.pos_n_dst;
	return res;
}

function do_scizEnhanceView() {
	scizGlobal.treasures = [];

	// Ensure we have a JWT setup for the current user
	jwt = MY_getValue(numTroll + '.SCIZJWT');
	if (jwt === null || jwt === undefined || jwt.trim() === '') { return; }

	// Add our CSS
	scizAddCSS();

	// Retrieve position and view
	var pos = document.body.innerHTML.match(/X\s*=\s*(-?\d+)\s*,\s*Y\s*=\s*(-?\d+)\s*,\s*N\s*=\s*(-?\d+)/);
	var posX = parseInt(pos[1]);
	var posY = parseInt(pos[2]);
	var posN = parseInt(pos[3]);
	var viewH = parseInt(document.body.innerHTML.match(/(\d+)\s*cases?\s*horizontalement/)[1]);
	var viewV = parseInt(document.body.innerHTML.match(/(\d+)\s*verticalement/)[1]);

	/* SCIZ View - TROLLS */
	cbx = MY_getValue(numTroll + '.SCIZ_CB_VIEW_TROLLS');
	if (cbx !== '0') {
		// Retrieve trolls
		var xPathTrollQuery = "//*/table[@id='VueTROLL']/tbody/tr";
		var xPathTrolls = document.evaluate(xPathTrollQuery, document, null, 0, null);
		while (xPathTroll = xPathTrolls.iterateNext()) {
			scizGlobal.trolls.push({
				'id': parseInt(xPathTroll.children[2].innerHTML),
				'name': xPathTroll.children[3].innerHTML,
				'sciz_desc': null,
				'node': xPathTroll,
				'displayed': false,
				'caracs': null,
			});
		}

		// Call SCIZ
		var sciz_url = 'https://www.sciz.fr/api/hook/trolls';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json'},
			onload: function(responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						window.console.log('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...');
						window.console.log(responseDetails);
						return;
					}
					var trolls = JSON.parse(responseDetails.responseText);
					if (trolls.trolls.length < 1) {
						// window.console.log('DEBUG - MZ/SCIZ - Aucun événement trouvé dans la base SCIZ...');
						return;
					}
					// Look for trolls to enhanced
					trolls.trolls.forEach(t => {
						for (i = 0; i < scizGlobal.trolls.length; i++) {
	                        var found = false;
							if (scizGlobal.trolls[i].id === t.id) {
								// PrettyPrint
								scizGlobal.trolls[i].sciz_desc = scizGlobal.trolls[i].node.children[3].innerHTML + scizPrettyPrintTroll(t);
								// Store caracs
								scizGlobal.trolls[i].caracs = t.caracs;
	                            found = true;
	                            break;
							}
	                    }
	                    if (!found) {
	                        // Special case of itself
	                        var is_self = false;
                            if (parseInt(numTroll) === t.id) {
                                is_self = true;
	                            t.pos_x = posX;
	                            t.pos_y = posY;
	                            t.pos_n = posN;
	                            // Don't display the user itself if he does not want to
	                            cbx = MY_getValue(numTroll + '.SCIZ_CB_VIEW_USER');
	                            if (cbx === '0') {
	                                return;
	                            }
	                        }
	                        // Find the right index
	                        var distance = Math.max(Math.abs(t.pos_x - posX), Math.abs(t.pos_y - posY), Math.abs(t.pos_n - posN));
	                        var xPathTrolls = document.evaluate(xPathTrollQuery, document, null, 0, null);
	                        while (xPathTroll = xPathTrolls.iterateNext()) {
                                if (is_self) break;
	                            if (parseInt(xPathTroll.children[0].innerHTML) > distance) {
	                                break;
	                            }
	                        }
	                        // Create the troll
	                        var template = document.createElement('template');
	                        var html_nom = '<a href="javascript:EPV(' + t.id + ')" class="mh_trolls_1">' + t.nom + '</a>';
                            if (!is_self) {
                                html_nom = html_nom + ' (HORS VUE)';
                            }
	                        var html_guilde = '<a href="javascript:EAV(' + t.guilde_id + ',750,550)" class="mh_links">' + t.guilde_nom + '</a>';
	                        template.innerHTML = '<tr class="mh_tdpage"><td>' + distance + '</td><td></td><td>' + t.id + '</td><td title="">' + html_nom + '</td><td>' + html_guilde + '</td><td>' + t.niv + '</td><td>' + t.race + '</td><td>' + t.pos_x + '</td><td>' + t.pos_y + '</td><td>' + t.pos_n + '</td></tr>';
	                        var troll = template.content.firstChild;
	                        // Add the troll
	                        scizGlobal.trolls.push({
	                            'id': t.id, 'name': html_nom, 'sciz_desc': html_nom + scizPrettyPrintTroll(t), 'node': troll, 'displayed': false, 'caracs': t.caracs
	                        });
	                        if (xPathTroll !== null) {
	                            xPathTroll.parentNode.insertBefore(troll, xPathTroll);
	                        } else {
	                            document.evaluate("//*/table[@id='VueTROLL']/tbody", document, null, 0, null).iterateNext().appendChild(troll);
	                        }
	                    }
					});
				} catch(e) {
					window.console.log('ERREUR - MZ/SCIZ - Stacktrace');
					window.console.log(e);
				}
				// Do the display overwrite and add the switches
				do_scizSwitchTrolls();
			}
		});
	}

	/* SCIZ View - TREASURES */
	cbx = MY_getValue(numTroll + '.SCIZ_CB_VIEW_TREASURES');
	if (cbx !== '0') {
		// Retrieve treasures
		var ids = [];
		var xPathTreasureQuery = "//*/table[@id='VueTRESOR']/tbody/tr";
		var xPathTreasures = document.evaluate(xPathTreasureQuery, document, null, 0, null);
		while (xPathTreasure = xPathTreasures.iterateNext()) {
			scizGlobal.treasures.push({
				'id': parseInt(xPathTreasure.children[2].innerHTML),
				'type': xPathTreasure.children[3].innerHTML,
				'sciz_desc': null,
				'buried': xPathTreasure.children[3].innerHTML.includes('Enterré'),
				'node': xPathTreasure,
			});
			ids.push(xPathTreasure.children[2].innerHTML)
			if (scizGlobal.treasures.length >= scizSetup.viewMaxEnhancedTreasure) { break; }
		}

		// Call SCIZ
		sciz_url = 'https://www.sciz.fr/api/hook/treasures';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json'},
			data: JSON.stringify({'ids': ids}),
			onload: function(responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						window.console.log('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...');
						window.console.log(responseDetails);
						return;
					}
					var treasures = JSON.parse(responseDetails.responseText);
					if (treasures.treasures.length < 1) {
						// window.console.log('DEBUG - MZ/SCIZ - Aucun trésor trouvé dans la base SCIZ...');
						return;
					}
					// Look for treasures to enhanced
					treasures.treasures.forEach(t => {
						for (i = 0; i < scizGlobal.treasures.length; i++) {
							if (scizGlobal.treasures[i].id === t.id)  {
								// PrettyPrint
								t = scizPrettyPrintTreasure(t);
								// Store the SCIZ treasure desc
								scizGlobal.treasures[i].sciz_desc = t;
								// Adapt the sciz type (delete the buried marker, the do_scizSwitchTreasures will handle it)
								scizGlobal.treasures[i].type = scizGlobal.treasures[i].node.children[3].firstChild.textContent;
	                            break;
							}
						}
					});
				} catch(e) {
					window.console.log('ERREUR - MZ/SCIZ - Stacktrace');
					window.console.log(e);
				}
				// Do the display overwrite and add the switches
				do_scizSwitchTreasures();
			}
		});
	}


	/* SCIZ View - MUSHROOMS */
	cbx = MY_getValue(numTroll + '.SCIZ_CB_VIEW_MUSHROOMS');
	if (cbx !== '0') {
		// Retrieve mushrooms
		ids = [];
		var xPathMushroomQuery = "//*/table[@id='VueCHAMPIGNON']/tbody/tr";
		var xPathMushrooms = document.evaluate(xPathMushroomQuery, document, null, 0, null);
		while (xPathMushroom = xPathMushrooms.iterateNext()) {
			scizGlobal.mushrooms.push({
				'id': parseInt(xPathMushroom.children[2].innerHTML),
				'type': xPathMushroom.children[3].innerHTML,
				'sciz_desc': null,
				'node': xPathMushroom,
			});
			ids.push(xPathMushroom.children[2].innerHTML);
			if (scizGlobal.mushrooms.length >= scizSetup.viewMaxEnhancedMushroom) { break; }
		}

		// Call SCIZ
		sciz_url = 'https://www.sciz.fr/api/hook/mushrooms';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json'},
			data: JSON.stringify({'ids': ids}),
			onload: function(responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						window.console.log('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...');
						window.console.log(responseDetails);
						return;
					}
					var mushrooms = JSON.parse(responseDetails.responseText);
					if (mushrooms.mushrooms.length < 1) {
						// window.console.log('DEBUG - MZ/SCIZ - Aucun champignon trouvé dans la base SCIZ...');
						return;
					}
					// Look for mushrooms to enhanced
					mushrooms.mushrooms.forEach(m => {
						for (i = 0; i < scizGlobal.mushrooms.length; i++) {
							if (scizGlobal.mushrooms[i].id === m.id)  {
	                            // PrettyPrint
								m = scizPrettyPrintMushroom(m);
								// Store the SCIZ mushroom desc
								scizGlobal.mushrooms[i].sciz_desc = m;
	                            break;
							}
						}
					});
				} catch(e) {
					window.console.log('ERREUR - MZ/SCIZ - Stacktrace');
					window.console.log(e);
				}
				// Do the display overwrite and add the switches
				do_scizSwitchMushrooms();
			}
		});
	}

	/* SCIZ View - BESTIAIRE */
	cbx = MY_getValue(numTroll + '.SCIZ_CB_BESTIAIRE');
	if (cbx !== '0') {
		// Retrieve monsters
		var mobs = [];
	    var xPathMonsterQuery = "//*/table[@id='VueMONSTRE']/tbody/tr";
		var xPathMonsters = document.evaluate(xPathMonsterQuery, document, null, 0, null);
		while (xPathMonster = xPathMonsters.iterateNext()) {
	        var mob = xPathMonster.children[4].innerHTML.match(/([^<>]+?)\s*\[\s*(.+)\s*]/);
			scizGlobal.monsters.push({
				'id': parseInt(xPathMonster.children[2].innerHTML),
				'name': mob[1],
	            'age': mob[2],
	            'sciz_desc': null,
	            'icon': null,
				'node': xPathMonster
			});
	        mobs.push({'name': mob[1], 'age': mob[2]});
	    }
	    // Check the list against the SCIZ bestiaire
		sciz_url = 'https://www.sciz.fr/api/bestiaire/check';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json'},
			data: JSON.stringify({'mobs': mobs}),
			onload: function(responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						window.console.log('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...');
						window.console.log(responseDetails);
	                    return;
					}
	                var mobs = JSON.parse(responseDetails.responseText);
	                // Add the SCIZ icons
	                scizGlobal.monsters.forEach(m => {
	                    if (mobs.bestiaire.includes(m.name + ' ' + m.age)) {
	                        var icon = scizCreateHoverable('15', 'inline', function() { do_scizBestiaire(m); });
	                        m.icon = icon;
	                        m.node.children[4].appendChild(icon);
	                    }
	                });
				} catch(e) {
					window.console.log('ERREUR - MZ/SCIZ - Stacktrace');
					window.console.log(e);
				}
			}
		});

	}

	/* SCIZ View - TRAPS */
	cbx = MY_getValue(numTroll + '.SCIZ_CB_VIEW_TRAPS');
	if (cbx !== '0') {
		// Retrieve traps
		ids = [];
		var xPathPlaceQuery = "//*/table[@id='VueLIEU']/tbody/tr";
		var xPathPlaces = document.evaluate(xPathPlaceQuery, document, null, 0, null);
		while (xPathPlace = xPathPlaces.iterateNext()) {
	        var trap = xPathPlace.children[3].innerHTML.match(/Piège\s+à\s+/);
			if (trap === null) {
	            continue
	        }
	        scizGlobal.traps.push({
				'id': parseInt(xPathPlace.children[2].innerHTML),
				'type': xPathPlace.children[3].innerHTML,
				'hidden': xPathPlace.children[3].innerHTML.includes('Caché'),
				'sciz_desc': null,
				'node': xPathPlace
			});
			ids.push(xPathPlace.children[2].innerHTML);
		}

		// Call SCIZ
		sciz_url = 'https://www.sciz.fr/api/hook/traps';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json'},
			data: JSON.stringify({'pos_x': posX, 'pos_y': posY, 'pos_n': posN, 'view_h': viewH, 'view_v': viewV}),
			onload: function(responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						window.console.log('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...');
						window.console.log(responseDetails);
						return;
					}
					var traps = JSON.parse(responseDetails.responseText);
					if (traps.traps.length < 1) {
						return;
					}
					// Look for traps to enhanced
					traps.traps.forEach(t => {
	                    var found = false;
						for (i = 0; i < scizGlobal.traps.length; i++) {
							if (scizGlobal.traps[i].id === t.id) {
								// PrettyPrint
								scizGlobal.traps[i].sciz_desc = scizPrettyPrintTrap(t);
	                            // Adapt the sciz type (delete the hidden marker, the do_scizSwitchTraps will handle it)
								scizGlobal.traps[i].type = scizGlobal.traps[i].node.children[3].firstChild.textContent;
	                            found = true;
	                            break;
							}
						}
	                    if (!found) {
	                        // Find the right index
	                        var distance = Math.max(Math.abs(t.pos_x - posX), Math.abs(t.pos_y - posY), Math.abs(t.pos_n - posN));
	                        var xPathPlaces = document.evaluate(xPathPlaceQuery, document, null, 0, null);
	                        while (xPathPlace = xPathPlaces.iterateNext()) {
	                            if (parseInt(xPathPlace.children[0].innerHTML) > distance) {
	                                break;
	                            }
	                        }
	                        // Create the trap
	                        var template = document.createElement('template');
	                        template.innerHTML = '<tr class="mh_tdpage"><td>' + distance + '</td><td></td><td>' + t.id + '</td><td>Piège à ' + t.type
	                            + '</td><td>' + t.pos_x + '</td><td>' + t.pos_y + '</td><td>' + t.pos_n + '</td></tr>';
	                        var trap = template.content.firstChild;
	                        // Add the hidden trap
	                        scizGlobal.traps.push({
	                            'id': t.id, 'type': 'Piège à ' + t.type, 'hidden': true, 'sciz_desc': scizPrettyPrintTrap(t), 'node': trap
	                        });
	                        if (xPathPlace !== null) {
	                            xPathPlace.parentNode.insertBefore(trap, xPathPlace);
	                        } else {
	                            document.evaluate("//*/table[@id='VueLIEU']/tbody", document, null, 0, null).iterateNext().appendChild(trap);
	                        }
	                    }
					});
				} catch(e) {
					window.console.log('ERREUR - MZ/SCIZ - Stacktrace');
					window.console.log(e);
				}
				// Do the display overwrite and add the switches
				do_scizSwitchTraps();
			}
		});
	}

   	/* SCIZ View - PORTALS */
	cbx = MY_getValue(numTroll + '.SCIZ_CB_VIEW_PORTALS');
	if (cbx !== '0') {
		// Retrieve portals
		ids = [];
		xPathPlaceQuery = "//*/table[@id='VueLIEU']/tbody/tr";
		xPathPlaces = document.evaluate(xPathPlaceQuery, document, null, 0, null);
		while (xPathPlace = xPathPlaces.iterateNext()) {
	        var portal = xPathPlace.children[3].innerHTML.match(/Portail/);
			if (portal === null) {
	            continue
	        }
	        scizGlobal.portals.push({
				'id': parseInt(xPathPlace.children[2].innerHTML),
				'type': xPathPlace.children[3].innerHTML,
				'sciz_desc': null,
				'node': xPathPlace
			});
			ids.push(xPathPlace.children[2].innerHTML);
		}
		// Call SCIZ
		sciz_url = 'https://www.sciz.fr/api/hook/portals';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json'},
			data: JSON.stringify({'ids': ids}),
			onload: function(responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						window.console.log('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...');
						window.console.log(responseDetails);
						return;
					}
					var portals = JSON.parse(responseDetails.responseText);
					if (portals.portals.length < 1) {
						// window.console.log('DEBUG - MZ/SCIZ - Aucun portail trouvé dans la base SCIZ...');
						return;
					}
					// Look for treasures to enhanced
					portals.portals.forEach(t => {
						for (i = 0; i < scizGlobal.portals.length; i++) {
							if (scizGlobal.portals[i].id === t.id) {
								// PrettyPrint
								scizGlobal.portals[i].sciz_desc = scizPrettyPrintPortal(t);
	                            break;
							}
						}
					});
				} catch(e) {
					window.console.log('ERREUR - MZ/SCIZ - Stacktrace');
					window.console.log(e);
				}
				// Do the display overwrite and add the switches
				do_scizSwitchPortals();
			}
		});
	}
}

function do_scizSwitchTrolls() {
	scizGlobal.trolls.forEach((t) => {
		if (t.sciz_desc !== null) {
			var icon = scizCreateClickable('15', 'inline', do_scizSwitchTrolls);
			t.displayed = !t.displayed;
			// Do the switch
			if (t.displayed) {
				t.node.children[3].innerHTML = t.sciz_desc;
				if (t.caracs !== null) {
					icon.title = t.caracs;
				}
			} else {
				t.node.children[3].innerHTML = t.name;
			}
			// Add the SCIZ switcher
			t.node.children[3].appendChild(icon);
		}
	});
}

function do_scizSwitchTreasures() {
	scizGlobal.treasures.forEach((t) => {
		if (t.sciz_desc !== null) {
			// Do the switch
			var currentDesc = t.node.children[3].firstChild.textContent;
			t.node.children[3].innerHTML = (currentDesc === t.type) ? ((t.sciz_desc !== null) ? t.sciz_desc : t.type) : t.type;
			if (t.buried) {
				t.node.children[3].innerHTML += '<img src="/mountyhall/Images/hidden.png" alt="[Enterré]" title="Enterré" width="15" height="15">';
			}
			// Add the SCIZ switcher
			t.node.children[3].appendChild(scizCreateClickable('15', 'inline', do_scizSwitchTreasures));
		}
	});
}

function do_scizSwitchMushrooms() {
	scizGlobal.mushrooms.forEach((m) => {
		if (m.sciz_desc !== null) {
			// Do the switch
			var currentDesc = m.node.children[3].firstChild.textContent;
			m.node.children[3].innerHTML = (currentDesc === m.type) ? ((m.sciz_desc !== null) ? m.sciz_desc : m.type) : m.type;
			// Add the SCIZ switcher
			m.node.children[3].appendChild(scizCreateClickable('15', 'inline', do_scizSwitchMushrooms));
		}
	});
}

function do_scizSwitchTraps() {
	scizGlobal.traps.forEach((t) => {
		if (t.sciz_desc !== null) {
			// Do the switch
			var currentDesc = t.node.children[3].firstChild.textContent;
			t.node.children[3].innerHTML = (currentDesc === t.type) ? ((t.sciz_desc !== null) ? t.sciz_desc : t.type) : t.type;
			if (t.hidden) {
				t.node.children[3].innerHTML += '<img src="/mountyhall/Images/hidden.png" alt="[Caché]" title="Caché" width="15" height="15">';
			}
			// Add the SCIZ switcher
			t.node.children[3].appendChild(scizCreateClickable('15', 'inline', do_scizSwitchTraps));
		}
	});
}

function do_scizSwitchPortals() {
	scizGlobal.portals.forEach((m) => {
		if (m.sciz_desc !== null) {
			// Do the switch
			var currentDesc = m.node.children[3].firstChild.textContent;
			m.node.children[3].innerHTML = (currentDesc === m.type) ? ((m.sciz_desc !== null) ? m.sciz_desc : m.type) : m.type;
			// Add the SCIZ switcher
			m.node.children[3].appendChild(scizCreateClickable('15', 'inline', do_scizSwitchPortals));
		}
	});
}

function do_scizBestiaire(monster) {
	// Ensure we have a JWT setup for the current user
	jwt = MY_getValue(numTroll + '.SCIZJWT');
	if (jwt === null || jwt === undefined || jwt.trim() === '') { return; }
	// Don't do anything if we already called the bestiary for this monster
	if (monster.sciz_desc === null) {
	    // Call SCIZ
		var sciz_url = 'https://www.sciz.fr/api/bestiaire';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json'},
			data: JSON.stringify({'name': monster.name, 'age': monster.age}),
			onload: function(responseDetails) {
				try {
					if (responseDetails.status !== 200) {
	                    monster.sciz_desc = "Problème de JWT SCIZ, désactiver l'option Mountyzilla si non utilisée.";
						window.console.log('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...');
						window.console.log(responseDetails);
					}
	                monster.sciz_desc = JSON.parse(responseDetails.responseText).bestiaire;
	                // Add the tooltip (kind of)
	                if (monster.sciz_desc !== null && monster.sciz_desc !== undefined) {
	                    var abbr = document.createElement('abbr');
	                    abbr.title = monster.sciz_desc.replace(/Blason.*/, '');
	                    monster.icon.parentNode.replaceChild(abbr, monster.icon);
	                    abbr.appendChild(monster.icon);
	                }
				} catch(e) {
					window.console.log('ERREUR - MZ/SCIZ - Stacktrace');
					window.console.log(e);
				}
			}
		});
	}
}

/* SCIZ - Events */

function scizPrettyPrintEvent(e) {
	e.message = e.message.replace(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}\s[0-9]{2}h[0-9]{2}:[0-9]{2}/g, ''); // Delete date
	e.message = e.message.replace(/\n\s*\n*/g, '<br/>');
	var beings = [[e.att_id, e.att_nom], [e.def_id, e.def_nom], [e.mob_id, e.mob_nom], [e.owner_id, e.owner_nom], [e.troll_id, e.troll_nom]];
	beings.forEach(b => {
		if (b[0] && b[1]) {
			b[1] = b[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			if (b[0].toString().length > 6) {
				// Mob
				b[1] = b[1].replace(/^une?\s/g, '');
				e.message = e.message.replace(new RegExp('(' + b[1] + ')','gi'), '<b><a href="/mountyhall/View/MonsterView.php?ai_IDPJ=' + b[0] + '" rel="modal:open" class="mh_monstres">\$1</a></b>');
			} else {
				// Troll
				e.message = e.message.replace(new RegExp('(' + b[1] + ')','gi'), '<b><a href="javascript:EPV(\'' + b[0] + '\')" class="mh_trolls_1">\$1</a></b>');
			}
		}
	});
	return e;
}

function do_scizOverwriteEvents() {
	scizGlobal.events = [];
	var eventTableNode = null;

	// Ensure we have a JWT setup for the current user
	jwt = MY_getValue(numTroll + '.SCIZJWT');
	cbx = MY_getValue(numTroll + '.SCIZ_CB_EVENTS');
	if (jwt === null || jwt === undefined || jwt.trim() === '' || cbx === '0') { return; }

	// Retrieve being ID
	var url = new URL(window.location.href);
	var id = url.searchParams.get('ai_IDPJ');
	id = (!id) ? numTroll : id;

	// Check for advanced profil
	var advanced = document.querySelector("[href*='MH_Style_ProfilAvance.css']") !== null;
	var xPathQuery = (advanced) ? "//*/table[@id='events']/tbody/tr" : "//*/tr[contains(@class, 'mh_tdpage')]";

	// Retrieve local events
	var xPathEvents = document.evaluate(xPathQuery, document, null, 0, null);
	while (xPathEvent = xPathEvents.iterateNext()) {
		scizGlobal.events.push({
			'time': Date.parse(StringToDate(xPathEvent.children[0].innerHTML)),
			'type': xPathEvent.children[1].innerHTML,
			'desc': xPathEvent.children[2].innerHTML,
			'sciz_type': null,
			'sciz_desc': null,
			'node': xPathEvent,
		});
		if (eventTableNode === null) {
			eventTableNode = xPathEvent.parentNode.parentNode;
		}
	}

	var startTime = Math.min.apply(Math, scizGlobal.events.map(function(e) { return e.time; })) - scizSetup.eventsMaxMatchingInterval;
	var endTime = Math.max.apply(Math, scizGlobal.events.map(function(e) { return e.time; })) + scizSetup.eventsMaxMatchingInterval;

	// Check if events have been found in the page
	if (scizGlobal.events.length < 1) {
		window.console.log('ERREUR - MZ/SCIZ - Aucun événement trouvé sur la page...');
		return;
	}

	// Call SCIZ
	var sciz_url = 'https://www.sciz.fr/api/hook/events/' + id + '/' + startTime + '/' + endTime;
	var eventType = url.searchParams.get('as_EventType'); // Retrieve event type filter
	sciz_url += (eventType !== null && eventType !== '') ? '/' + eventType.split(' ')[0] : '' // Only the first word used for filtering ("MORT par monstre" => "MORT");
	FF_XMLHttpRequest({
		method: 'GET',
		url: sciz_url,
		headers: { 'Authorization': jwt },
		// trace: 'Appel à SCIZ pour l'entité ' + id,
		onload: function(responseDetails) {
			try {
				if (responseDetails.status == 0) {
					window.console.log('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...');
					window.console.log(responseDetails);
					return;
				}
				var events = JSON.parse(responseDetails.responseText);
				if (events.events.length < 1) {
					// window.console.log('DEBUG - MZ/SCIZ - Aucun événement trouvé dans la base SCIZ...');
					return;
				}
				// Look for events to overwrite (based on timestamps)
				events.events.forEach(e => {
					if (e.message.includes(id)) { // Exclude any event we were not looking for...
						var t = Date.parse(StringToDate(e.time));
						// Look for the best event matching and not already replaced
						var i = -1;
						var lastDelta = Infinity;
						for (j = 0; j < scizGlobal.events.length; j++) {
							if (scizGlobal.events[j].sciz_desc === null) {
								var delta = Math.abs(t - scizGlobal.events[j].time);
								if (delta <= scizSetup.eventsMaxMatchingInterval && delta < lastDelta) {
									lastDelta = delta;
									i = j;
								}
							}
						}
						if (i > -1) {
							// PrettyPrint
							e = scizPrettyPrintEvent(e);
							// Store the SCIZ event and icon
							var div = scizCreateIcon('25', 'block', e.icon);
							scizGlobal.events[i].sciz_type = div.outerHTML;
							scizGlobal.events[i].sciz_desc = e.message;
							// Actual display overwrite
							scizGlobal.events[i].node.children[1].setAttribute("valign", "middle");
							scizGlobal.events[i].node.children[2].setAttribute("valign", "middle");
							scizGlobal.events[i].node.children[1].innerHTML = scizGlobal.events[i].sciz_type;
							scizGlobal.events[i].node.children[2].innerHTML = scizGlobal.events[i].sciz_desc;
						}
					}
				});
				// Add the switch button
				if (eventTableNode !== null) {
					var div = scizCreateClickable('50', 'block', do_scizSwitchEvents);
					eventTableNode.parentNode.insertBefore(div, eventTableNode.nextSibling);
				}
			} catch(e) {
				window.console.log('ERREUR - MZ/SCIZ - Stacktrace');
				window.console.log(e);
			}
		}
	});
}

function do_scizSwitchEvents() {
	scizGlobal.events.forEach((e) => {
		var currentType = e.node.children[1].innerHTML;
		e.node.children[1].innerHTML = (currentType === e.type) ? ((e.sciz_type !== null) ? e.sciz_type : e.type) : e.type;
		var currentDesc = e.node.children[2].innerHTML;
		e.node.children[2].innerHTML = (currentDesc === e.desc) ? ((e.sciz_desc !== null) ? e.sciz_desc : e.desc) : e.desc;
	});
}

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x mission

/* TODO
 * MZ2.0 : gérer le nettoyage des missions terminées via script principal
 *		Roule 01/01/2017 : c'est fait dans do_mission_liste
 *
 * Note: nbKills n'est pas géré pour l'instant (voir avec Actions?)
 */
function isArray(a) {
	return (!!a) && (a.constructor === Array);
}

function saveMission(num,obEtape) {
	var obMissions;
	if(MY_getValue(numTroll+'.MISSIONS')) {
		try {
			//window.console.log('JSON MISSION (before) = ' + MY_getValue(numTroll+'.MISSIONS'));
			obMissions = JSON.parse(MY_getValue(numTroll+'.MISSIONS'));
		} catch(e) {
			window.console.error(traceStack(e, 'Mission parsage'));
			return;
		}
	}
	if (isArray(obMissions)) obMissions = new Object();	// corrige certains cas issus d'anciennes versions MZ
	if (obMissions == undefined) obMissions = new Object();	// protection
	//window.console.log('saveMission, obEtape=' + obEtape);	// debug roule
	if(obEtape) {
		obMissions[num] = obEtape;
	} else if(obMissions[num]) {
		delete obMissions[num];
	}
	MY_setValue(numTroll+'.MISSIONS',JSON.stringify(obMissions));
	//window.console.log('JSON MISSION (after) = ' + MY_getValue(numTroll+'.MISSIONS'));
}

function addtroogle(tdLibelle, sRestrict) {
	var img = document.createElement('img');
	img.src = URL_MZimg + 'troogle.ico';
	img.alt = 'Troogle logo';
	var a = document.createElement('a');
	var url = URL_troogle + '?utf8=' + encodeURIComponent('✓');	// hé oui, ce source est unicode
	url += '&entity_search[search]=' + encodeURIComponent(sRestrict);
	url += '&entity_search[position_x]=' + MY_getValue(numTroll+".position.X");
	url += '&entity_search[position_y]=' + MY_getValue(numTroll+".position.Y");
	url += '&entity_search[position_z]=' + MY_getValue(numTroll+".position.N");
	a.href = url;
	a.title = 'Chercher sur Troogle';
	a.target = 'troogle';
	a.appendChild(img);
	tdLibelle.appendChild(a);
	tdLibelle.parentNode.style.verticalAlign = 'bottom';
}

function traiteMission() {
	try {
		var titreMission = document.getElementsByClassName('titre2')[0];
		var numMission = titreMission.textContent.match(/\d+/)[0];
		var missionForm = document.getElementsByName('ActionForm')[0];
		var tdLibelle = document.evaluate(
			"./table/tbody/tr/td/input[starts-with(@value,'Valider')]/../../td[2]",
			missionForm, null, 9, null).singleNodeValue;
	} catch(e) {
		window.console.error(traceStack(e, 'récupération mission'));
		return;
	}
	if (!numMission) { debugMZ('traiteMission pas de numMission, titreMission=' . titreMission.outerHTML.replace(/</g, '‹')); return; }
	try {
		if(!tdLibelle) {
			// S'il n'y a plus d'étape en cours (=mission finie), on supprime
			debugMZ('traiteMission, la mission semble terminée');
			saveMission(numMission,false);
			return;
		}

		var libelle = trim(tdLibelle.textContent.replace(/\n/g,''));
		var siMundidey = libelle.indexOf('Mundidey')!=-1;
		// debug Roule'
		if (MY_DEBUG) {
			for (var i =0; i < tdLibelle.childNodes.length; i++)
				window.console.log('traiteMission, tdLibelle.childNodes[' + i + ']=' + tdLibelle.childNodes[i].textContent);
		}
		if(libelle.indexOf('niveau égal à')!=-1) {
			var nbKills = 1, niveau, mod;
			// exemples :
			// L'équipe doit tuer 3 petits monstres (d'un niveau égal à 27 + ou - 1)
			// L'équipe doit tuer 2 gros monstres (chaque monstre devant être d'un niveau égal à 44 au moins)
			// L'équipe doit tuer un petit monstre (chaque monstre devant être d'un niveau égal à 29 + ou - 1) un Mundidey
			// L'équipe doit tuer un monstre (ce monstre doit être d'un niveau égal à 44 au moins) un Mundidey
			if (tdLibelle.childNodes.length == 1) {
				// Roule' 08/01/52017 il n'y a plus de mise en forme. Un seul childNode
				var m = libelle.match(/niveau égal à *(\d+) * au moins/);
				if (m) {
					niveau = Number(m[1]);
					mod = 'plus'
				} else {
					var m = libelle.match(/niveau égal à *(\d+) *\+.*- *(\d+)/);
					if (m) {
						niveau = Number(m[1]);
						mod = Number(m[2]);
					} else {
						window.console.log('[MZ ' + GM_info.script.version + '] traiteMission, échec analyse de ' + libelle);
						return;
					}
				}
			} else {
				// ancienne méthode (multi childnode)
				// à supprimer un jour peut-être
				if(tdLibelle.firstChild.nodeValue.indexOf('niveau égal à')==-1) {
					// Étape de kill multiple de niveau donné
					//nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
					if (tdLibelle.childNodes.length <= 3) {	// Roule' 14/07/2016 le niveau n'est plus en gras, on n'a que 3 zones de texte
						mod = tdLibelle.childNodes[2].nodeValue.match(/\d+/);
						niveau = Number(mod[0]);
						// Modificateur de niveau : "niv +/- mod" ou bien "niv +"
						mod = mod.length > 1 ? Number(mod[1]) : 'plus';
					} else {
						niveau = Number(tdLibelle.childNodes[3].firstChild.nodeValue);
						// Modificateur de niveau : "niv +/- mod" ou bien "niv +"
						mod = tdLibelle.childNodes[4].nodeValue.match(/\d+/);
						mod = mod ? Number(mod[0]) : 'plus';
					}
				} else {
					// Étape de kill unique de niveau donné
					niveau = Number(tdLibelle.childNodes[1].firstChild.nodeValue);
					mod = tdLibelle.childNodes[2].nodeValue.match(/\d+/);
					mod = mod ? Number(mod[0]) : 'plus';
				}
			}
			// if (isDEV) {
				// niveau = 35;	// pour les tests Roule
				// alert('niveau forcé à 35 pour test');
			// }
			// debug Roule'
			if (MY_DEBUG) {
				window.console.log('traiteMission, save niveau=' + niveau + ', mod=' + mod + ', siMundidey=' + siMundidey + ', libelle=' + libelle);
			}
			saveMission(numMission,{
				type: 'Niveau',
				niveau: niveau,
				mod: mod,
				mundidey: siMundidey,
				libelle: libelle
			});
			if (mod == 'plus')
				addtroogle(tdLibelle, '@monstre level:' + niveau + '..' + (niveau+99));
			else
				addtroogle(tdLibelle, '@monstre level:' + (niveau-mod) + '..' + (niveau+mod));
		} else if(libelle.indexOf('de la race')!=-1) {
			var nbKills = 1, race;
			if(tdLibelle.firstChild.nodeValue.indexOf('de la race')==-1) {
				// Étape de kill multiple de race donnée
				//nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
				race = trim(tdLibelle.childNodes[3].firstChild.nodeValue);
			} else {
				// Étape de kill unique de race donnée
				race = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			}
			race = race.replace(/\"/g,'');
			race = removeEnclosingSimpleCote(race);	// Roule 29/03/2019 Maintenant, on a des '
			saveMission(numMission,{
				type: 'Race',
				race: race,
				mundidey: siMundidey,
				libelle: libelle
			});
			addtroogle(tdLibelle, '@monstre ' + race);
		} else if(libelle.indexOf('de la famille')!=-1) {
			var nbKills = 1, famille;
			if(tdLibelle.firstChild.nodeValue.indexOf('de la famille')==-1) {
				// Étape de kill multiple de famille donnée
				//nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
				famille = trim(tdLibelle.childNodes[3].firstChild.nodeValue);
			} else {
				// Étape de kill unique de famille donnée
				famille = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			}
			famille = famille.replace(/\"/g,'');
			famille = removeEnclosingSimpleCote(famille);	// Roule 29/03/2019 Maintenant, on a des '
			saveMission(numMission,{
				type: 'Famille',
				famille: famille,
				mundidey: siMundidey,
				libelle: libelle
			});
			//Roule' 07/01/2017 À ce jour, pour les familles, Troogle a besoin de minuscules sans accent
			addtroogle(tdLibelle, '@monstre:' + famille.toLowerCase().replace(/é/g, 'e').replace(/ï/g, 'i'));
		} else if(libelle.indexOf('capacité spéciale')!=-1) {
			var pouvoir = epure(trim(tdLibelle.childNodes[1].firstChild.nodeValue));
			debugMZ('traiteMission étape capacité spéciale');
			pouvoir = removeEnclosingSimpleCote(pouvoir);	// Roule 29/03/2019 Maintenant, on a des '
			saveMission(numMission,{
				type: 'Pouvoir',
				pouvoir: pouvoir,
				libelle: libelle
			});
		} else {
			debugMZ('traiteMission étape pas pour troogle');
			saveMission(numMission,false);
		}
	} catch(e) {
		window.console.error(traceStack(e, 'récupération étape mission'));
		return;
	}
}

function removeEnclosingSimpleCote(x) {	// Roule 29/03/2019
	return x.replace(/'$/, '').replace(/^'/, '');
}

function do_mission() {
	start_script(60);

	traiteMission();

	displayScriptTime();
}

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x move

/*-[variables+function]- Données sur les trous de météorites -----------------*/

var petitsTrous = {
	'-52;57': true,
	'55;70': true,
	'64;70': true,
	'12;-15': true,
	'30;-52': true,
	'48;-39': true
};

var grosTrous = {
	'-35;65': true,
	'-13;73': true,
	'-64;9': true,
	'-35;15': true,
	'5;32': true,
	'10;64': true,
	'21;36': true,
	'46;52': true,
	'74;32': true,
	'-71;-7': true,
	'-67;-37': true,
	'-60;-32': true,
	'-51;-22': true,
	'-36;-51': true,
	'5;-49': true
};

var centreCarmine_X = 56.5;
var centreCarmine_Y = 23.5;
var rayonCarmine = 8.7;

function isTrou(x,y,n) {
	if(petitsTrous[x+';'+y]) {
		return n<0 && n>-60;
	}
	if(grosTrous[x+';'+y]
		|| grosTrous[x-1+';'+y]
		|| grosTrous[x+';'+y+1]
		|| grosTrous[x-1+';'+y+1]) {
		return n<0 && n>-70;
	}
	if(Math.sqrt(
			Math.pow(x-centreCarmine_X,2)+Math.pow(y-centreCarmine_Y,2)
		)<=rayonCarmine) {
		return n<0 && n>-100;
	}
	return false;
}

/*-[functions]----------------- Gestion des DEs ------------------------------*/

function validateDestination() {
	var x = Number(document.getElementsByName('ai_XDepart')[0].value);
	var y = Number(document.getElementsByName('ai_YDepart')[0].value);
	var n = Number(document.getElementsByName('ai_NDepart')[0].value);
	var form = document.getElementsByName('ActionForm')[0];
	if(form) {
		for(var i=0 ; i<document.getElementsByName('ai_DeplX').length ; i++) {
			if(document.getElementsByName('ai_DeplX')[i].checked) {
				x += Number(document.getElementsByName('ai_DeplX')[i].value);
			}
		}
		for(var i=0 ; i<document.getElementsByName('ai_DeplY').length ; i++)	{
			if(document.getElementsByName('ai_DeplY')[i].checked) {
				y += Number(document.getElementsByName('ai_DeplY')[i].value);
			}
		}
		for(var i=0 ; i<document.getElementsByName('ai_DeplN').length ; i++) {
			if(document.getElementsByName('ai_DeplN')[i].checked) {
				n += Number(document.getElementsByName('ai_DeplN')[i].value);
			}
		}
		if(isTrou(x,y,n)) {
			return window.confirm(
				'La voix de  mini TilK (n°36216) résonne dans votre tête :\n'
				+'Vous allez tomber dans un trou de météorite.\n'
				+'Êtes vous sûr de vouloir effectuer ce déplacement ?'
			);
		}
	}
	return true;
}

function newsubmitDE(event) {
	event.stopPropagation();
	event.preventDefault();
	if(validateDestination()) {
		this.submit();
	}
}

function changeValidation() {
	var form = document.getElementsByName('ActionForm')[0];
	if(form) {
		form.addEventListener('submit', newsubmitDE, true);
	}
}


/*-[functions]----------------- Gestion des TPs ------------------------------*/

function validateTPDestination() {
	try {
		var text = document.getElementsByTagName('B')[0];
		var a = text.firstChild.nodeValue.split('|');
		var pos_x = a[0].substring(4, a[0].length - 1) * 1;
		var pos_y = a[1].substring(5, a[1].length - 1) * 1;
		var pos_n = a[2].substring(5, a[2].length) * 1;

		var nbtrous = 0;
		for(var signX=-1 ; signX<=1 ; signX+=2) {
			for(var x=0 ; x<=2 ; x++) {
				for(var signY=-1 ; signY<=1 ; signY+=2) {
					for(var y=0 ; y<=2 ; y++) {
						for(var signN = -1 ; signN <= 1 ; signN+=2) {
							for(var n = 0 ; n <= 1 ; n++) {
								if(isTrou(
										pos_x+signX*x,pos_y+signY*y,Math.min(-1,pos_n+signN*n)
									)) {
									nbtrous++;
								}
							}
						}
					}
				}
			}
		}
		if(nbtrous>0 && nbtrous<72) {
			return window.confirm(
				'La voix de  mini TilK (n°36216) résonne dans votre tête :\n'
				+'Vous avez '+Math.floor((100*nbtrous)/144)
				+'% de risque de tomber dans un trou de météorite.\n'
				+'Êtes-vous sûr de vouloir prendre ce portail ?'
			);
		}
		else if(nbtrous>=72) {
			return window.confirm(
				'La voix de  mini TilK (n°36216) tonne dans votre tête :\n'
				+'Malheureux, vous avez '+Math.floor((100*nbtrous)/144)
				+'% de risque de tomber dans un trou de météorite !\n'
				+'Êtes-vous bien certain de vouloir prendre ce portail ?'
			);
		}
		return true;
	}
	catch(e) {
		window.alert(e)
	}
}

function newsubmitTP(event) {
	event.stopPropagation();
	event.preventDefault();
	if(validateTPDestination()) {
		this.submit();
	}
}

function changeButtonValidate() {
	var form = document.getElementsByName('Formulaire')[0];
	if(form) {
		if(!form.getAttribute('onsubmit')) {
			form.setAttribute('onsubmit','return true;');
		}
		form.addEventListener('submit', newsubmitTP, true);
	}
}


/*-[functions]---------------- Partie Principale -----------------------------*/

function do_move() {
	// Roule', vérification du risque de tomber dans un trou déplacée dans do_lieuTeleport pour le cas des TP
	//if(isPage('MH_Play/Actions/Play_a_Move.php')) {
		changeValidation();
	//}
	//else if(isPage('MH_Lieux/Lieu_Teleport.php')) {
	//	changeButtonValidate();
	//}
}

/*******************************************************************************
* This file is part of Mountyzilla (http://mountyzilla.tilk.info/)             *
* Mountyzilla is free software; provided under the GNU General Public License  *
*******************************************************************************/

// x~x news

// Nombre de news à afficher & nb max de caractères par news:
var nbItems = 5;
var maxCarDescription = 300;

/*-[functions]------------------- Utilitaires --------------------------------*/

// Ne semble avoir strictement aucun effet:
String.prototype.epureDescription = function() {
	return this.replace(/\\(.)/g,"$1");
	}

function appendTitledTable(node,titre,description) {
	// Crée les tables contenant les infos (avec titre)
	var table = document.createElement('table');
	table.border = 0;
	table.className = 'mh_tdborder';
	table.cellSpacing = 1;
	table.cellPadding = 1;
	table.style.maxWidth = '98%';
	table.style.marginLeft = 'auto';
	table.style.marginRight = 'auto';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	var tr = appendTr(tbody,'mh_tdtitre');
	var td = appendTdCenter(tr,2);
	var span = document.createElement('span');
	appendText(span,titre,true);
	if(description) {
		span.title = description;
		}
	td.appendChild(span);
	node.appendChild(table);
	return tbody;
	}

function testCertif(paramURL, callbackOnError) {
	try {
		FF_XMLHttpRequest({
			method: 'GET',
			url: paramURL,
			onload: function(responseDetails) {
				//window.console.log('testCertif(' + paramURL + '), callback, status=' + responseDetails.status);
				if (responseDetails.status == 0) callbackOnError();	// FAIL si status == 0
			}
		});
	} catch(e) {
		window.console.log('[MZ] erreur testCertif(' + paramURL + ')' + traceStack(e, 'testCertif'));
		callbackOnError();
	}
}

function createOrGetGrandCadre() {
	var grandCadre = document.getElementById('grandCadre');
	if (grandCadre) return grandCadre;
	try {
		var rappels = document.evaluate(
			"//p[contains(a/text(),'messagerie')]",
			document, null, 9, null).singleNodeValue;
		}
	catch(e) {
		window.alert('Tu es en HTTPS. Pour bénéficier de MoutyZilla, tu devrais débloquer le contenu mixte');
		grandCadre = document.createElement('div');
		return grandCadre;
		}
	grandCadre = document.createElement('div');
	grandCadre.id = 'grandCadre';
	var sousCadre = document.createElement('div');
	sousCadre.innerHTML = 'Tu es en <span style="color:blue">HTTPS</span>.';
	sousCadre.style.textAlign = 'center';
	sousCadre.style.fontSize = 'xx-large';
	grandCadre.appendChild(sousCadre);

	grandCadre.style.border = 'solid 5px red';
	grandCadre.style.width = 'auto';
	insertBefore(rappels,grandCadre);
	return grandCadre;
}

function showHttpsErrorCadre1() {
	window.console.log('[MZ] showHttpsErrorCadre1');
	var grandCadre = createOrGetGrandCadre();
	var sousCadre = document.createElement('div');
	sousCadre.innerHTML = '<b>Tu n\'as pas accepté le certificat1 de Raistlin.</b>'
		+ '<br />Cela empêchera Moutyzilla de fonctionner'
		+ '<br /><a style="color:blue;font-size: inherits;" href="'
		+ URL_CertifRaistlin1
		+ '" target="raistlin">clique ici</a>'
		+ '<br />puis « Avancé » ... « Ajouter une exception » ...'
		+ ' « Confirmer l\'exception de sécurité »'
		+ '<br /><i>Il suffit de faire ceci une seule fois jusqu\'à ce que Raistlin change son certificat</i>';
	sousCadre.style.width = 'auto';
	sousCadre.style.fontSize = 'large';
	sousCadre.style.border = 'solid 1px black';
	sousCadre.style.backgroundColor = 'red';
	grandCadre.appendChild(sousCadre);
}

function showHttpsErrorCadre2() {
	window.console.log('[MZ] showHttpsErrorCadre2');
	var grandCadre = createOrGetGrandCadre();
	var sousCadre = document.createElement('div');
	sousCadre.innerHTML = '<b>Tu n\'as pas accepté le certificat2 de Raistlin.</b>'
		+ '<br />Cela empêchera le fonctionnement de l\'affichage des Potrõlls dans la vue<br />'
		+ '<a style="color:blue;font-size: inherits;" href="'
		+ URL_CertifRaistlin2
		+ '" target="raistlin">clique ici</a>'
		+ '<br />puis « Avancé » ... « Ajouter une exception » ...'
		+ ' « Confirmer l\'exception de sécurité »'
		+ '<br />(Ignorer ensuite le message sur l\'erreur de mot de passe)'
		+ '<br /><i>Il suffit de faire ceci une seule fois jusqu\'à ce que Raistlin change son certificat</i>';
	sousCadre.style.width = 'auto';
	sousCadre.style.fontSize = 'large';
	sousCadre.style.border = 'solid 1px black';
	sousCadre.style.backgroundColor = 'red';
	grandCadre.appendChild(sousCadre);
}

function showHttpsErrorContenuMixte() {
	window.console.log('[MZ] showHttpsErrorContenuMixte');
	var grandCadre = createOrGetGrandCadre();
	var sousCadre = document.createElement('div');
	sousCadre.innerHTML = '<b>Tu n\'as pas autorisé le contenu mixte.</b><br />'
		+ 'Cela interdit le fonctionnement des <b>services suivants</b> de Mountyzilla (le reste, dont l\'enrichissement de la vue, fonctionne à condition d\'accepter les certificats)'
		+ '<ul>'
		+ '<li>Interface Bricol\'Troll</li>'
		+ '<li>Nouveautés de Mountyzilla</li>'
		+ '</ul>'
		+ 'Pour autoriser le contenu mixte, regarde <a href="https://support.mozilla.org/fr/kb/blocage-du-contenu-mixte-avec-firefox#w_daebloquer-le-contenu-mixte" target="_blank">cette page</a><br />'
		+ '<i>Il faudra malheureusement le faire à chaque nouvelle connexion</i>';
	sousCadre.style.width = 'auto';
	sousCadre.style.fontSize = 'large';
	sousCadre.style.border = 'solid 1px black';
	grandCadre.appendChild(sousCadre);
}

/*-[functions]------------------- Jubilaires ---------------------------------*/

function traiterJubilaires() {
	// à faire
}

function traiterJubilaires_a_supprimer() {	// ancienne méthode
	try {
		FF_XMLHttpRequest({
			method: 'GET',
			url: URL_anniv,
			headers: {
				'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
				'Accept': 'application/xml,text/xml',
				},
			onload: function(responseDetails) {
				if ((responseDetails.status == 0) && isHTTPS) {
					window.console.log('status=0 à l\'appel jubilaires, réponse=' + responseDetails.responseText);
					//showHttpsErrorContenuMixte();
					return;
				}
				var listeTrolls = responseDetails.responseText.split('\n');
				if(!listeTrolls || listeTrolls.length==0) {
					return;
					}
				afficherJubilaires(listeTrolls);
				},
			});
		}
	catch(e) {
		if (isHTTPS) {
			window.console.log(traceStack(e, 'appel jubilaires'));
			showHttpsErrorContenuMixte();
		} else {
			window.alert('Erreur Jubilaires:\n'+e);
		}
	}
}

function afficherJubilaires(listeTrolls) {
	try {
		var rappels = document.evaluate(
			"//p[contains(a/text(),'messagerie')]",
			document, null, 9, null).singleNodeValue;
		}
	catch(e) {
		return;
		}
	var p = document.createElement('p');
	var tbody = appendTitledTable(p,
		"Les Trõlls qui fêtent leur anniversaire aujourd'hui:",
		'Envoyez leur un message ou un cadeau !'
		);
	tr = appendTr(tbody,'mh_tdpage');
	td = appendTdCenter(tr);
	var small = document.createElement('small');
	td.appendChild(small);
	var first = true;
	for(var i=0 ; i<listeTrolls.length ; i++) {
		var infos = listeTrolls[i].split(';');
		if(infos.length!=3 || infos[2]==='0') {
			continue;
			}
		if(first) {
			first = false;
			}
		else {
			appendText(small,', ');
			}
		var a = document.createElement('a');
		a.href = 'javascript:EPV('+infos[0]+')';
		appendText(a,infos[1]);
		small.appendChild(a);
		appendText(small, ' ('+infos[2]+(infos[2]==='1' ? ' an)' : ' ans)') );
		}
	insertBefore(rappels,p);
	}


/*-[functions]--------------------- News MZ ----------------------------------*/

function traiterNouvelles() {
	var news = new Array;
	news.push(['15/11/2019', 'Refonte des calculs tactiques dans la vue. Affichage du niveau du monstre à tout coup (ou presque).']);
	news.push(['24/12/2016', 'Les jubilaires ont disparu de Mountyzilla depuis un moment. Ils reviendront. Patience et espoir sont les maître qualités de l\'utilisateur MZ (et du joueur MH ;).']);
	afficherNouvelles(news);
}

function afficherNouvelles(items) {
	var footer = document.getElementById('footer1');
	if(!footer) {
		window.console.log('[MZ ' + GM_info.script.version + '] afficherNouvelles, impossible de retrouver le footer par getElementById(\'footer1\')');
		return;
		}
	var p = document.createElement('p');
	var tbody = appendTitledTable(p, 'Les nouvelles de Mountyzilla');
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.right = 0;
	div.style.top = 0;
	div.style.paddingRight = '3px';
	div.style.whiteSpace = 'nowrap';
	appendText(div, '(version ' + GM_info.script.version + ')');
	tbody.rows[0].cells[0].style.position = 'relative';
	tbody.rows[0].cells[0].appendChild(div);
	for(var i=0 ; i<items.length ; i++) {
		var tr = appendTr(tbody,'mh_tdpage');
		var td = appendTdCenter(tr);
		td.style.verticalAlign = 'top'; // semble sans effet
		appendText(td,items[i][0],true);
		td = appendTd(tr);
		td.innerHTML = items[i][1];
	}
	insertBefore(footer,p);

	// changelog
	var p = document.createElement('p');
	var tbody = appendTitledTable(p, 'Changelog de Mountyzilla');
	tbody.rows[0].cells[0].style.cursor = 'pointer';
	tbody.rows[0].cells[0].onclick = function() {
		try {
			tbody.rows[0].cells[0].onclick = undefined;
			tbody.rows[0].cells[0].style.cursor = '';
			var tr = appendTr(tbody,'mh_tdpage');
			var td = appendTd(tr);
			td.colSpan = 2;
			var pre = document.createElement('pre');
			appendText(pre,MZ_changeLog.join("\n"));
			td.appendChild(pre);
		} catch (e) {
			window.console.log('[MZ] affichage changeLog', e);
		}
	};
	insertBefore(footer,p);

	if (isDEV) {	// Roule 02/02/2017 copie de la conf vers https
		if (false) {	// essai avorté via sessionStorage (ne fonctionne pas)
			if (isHTTPS) {
				window.console.log('[MZ test] sessionStorage.getItem(xxx)=' + window.sessionStorage.getItem('xxx'));
				window.console.log('[MZ test] window.parent.xxx=' + window.parent.xxx);
			} else {
				window.console.log('[MZ test] début switch to https');
				window.sessionStorage.setItem('xxx', "test session trans https");
				window.parent.xxx = "autre test";
				var url = document.location.href;
				window.console.log('[MZ test] url=' + url);
				url = url.replace(/http:\/\//i, 'https://')
				window.console.log('[MZ test] switched url=' + url);
				document.location.href = url;
			}
		}
		if (false) {	// version par utilisation d'un IFrame en https
			if (isHTTPS) {
				//window.console.log('[MZ test] window.xxx=' + window.xxx);
				//window.console.log('[MZ test] window.name=' + window.name);
				//window.console.log('[MZ test] window.document.xxx=' + window.document.xxx);
				//window.console.log('[MZ test] window.parent.xxx=' + window.parent.xxx);
				var txt = window.name;
				var tabtxt = txt.split(/µ/);
				for (var i = 0; i < tabtxt.length; i++) {
					window.console.log('[MZ test]config https ' + tabtxt[i]);
				}
			} else {
				var txt = '';
				for ( var i = 0, len = localStorage.length; i < len; ++i ) {
					var k = localStorage.key(i);
					//if (k.match(/INFOSIT$/i)) continue;	// masquer le mdp Bricol'Troll
					txt += k + "£" + localStorage.getItem(k) + "µ";
				}
				var iframe = document.createElement('iframe');
				var url = document.location.href;
				//window.console.log('[MZ test] url=' + url);
				url = url.replace(/http:\/\//i, 'https://')
				//window.console.log('[MZ test] switched url=' + url);
				//iframe.xxx = "truc en plume";
				iframe.name = txt;
				//window.xxx = "machin";
				iframe.src = url;
				//iframe.document.xxx = "truc en plume";
				document.body.appendChild(iframe);
				iframe.style.display = 'none';
			}
		}
	}
}


/*---------------------------------- Main ------------------------------------*/

function do_news() {
	start_script();

	traiterJubilaires();
	traiterNouvelles();

	/* plus besoin, le certificat est "officiel"
	if (isHTTPS) {
		// test si les certificats raistlin ont été acceptés
		testCertif(URL_CertifRaistlin1, showHttpsErrorCadre1);	// l'infra raislin
		var infoit = MY_getValue(numTroll+'.INFOSIT');
		if(infoit && infoit!=='') {	// seulement pour les joueurs utilisant l'interface avec Bricol'Troll
			testCertif(URL_CertifRaistlin2, showHttpsErrorCadre2);	// le relai raistlin vers Bricol'Troll
		}
	}
	*/

	displayScriptTime();
}

/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

// x~x tabcompo

var popup;

function initPopupTabcompo() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;'
						+ 'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function showPopup(evt) {
	var texte = this.getAttribute("texteinfo");
	popup.innerHTML = texte;
	popup.style.left = evt.pageX + 15 + 'px';
	popup.style.top = evt.pageY + 'px';
	popup.style.visibility = "visible";
}

// roule 16/03/2016, existe déjà ailleurs
// function hidePopup() {
	// popup.style.visibility = 'hidden';
// }

function createPopupImage_tabcompo(url, text)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('align','ABSMIDDLE');
	img.setAttribute("texteinfo",text);
	img.addEventListener("mouseover", showPopup,true);
	img.addEventListener("mouseout", hidePopup,true);
	return img;
}

function formateTexte_tabcompo(texte)
{
	texte = texte.replace(/\n/g,"<br/>");
	texte = texte.replace(/^([^<]*) d'un/g,"<b>$1</b> d'un");
	texte = texte.replace(/<br\/>([^<]*) d'un/g,"<br/><b>$1</b> d'un");
	texte = texte.replace(/(d'une? )([^<]*) d'au/g,"$1<b>$2</b> d'au");
	texte = texte.replace(/(Qualité )([^<]*) \[/g,"$1<b>$2</b> [");
	texte = texte.replace(/\[([^<]*)\]/g,"[<b>$1</b>]");
	return texte;
}

function arrondi(x) {
	return Math.ceil(x-0.5); // arrondi à l'entier le plus proche, valeurs inf
	}

function traiteMinerai_tabcompo() {
	if (currentURL.indexOf("as_type=Divers")==-1) return;
	try {
	var node = document.evaluate("//form/table/tbody[@class='tablesorter-no-sort'"
								+" and contains(./tr/th/text(),'Minerai')]",
								document, null, 9, null).singleNodeValue;
	node = node.nextSibling.nextSibling;
	}
	catch(e) {return;}

	var trlist = document.evaluate('./tr', node, null, 7, null);
	for (var i=0 ; i<trlist.snapshotLength ; i++) {
		var node = trlist.snapshotItem(i);
		var nature = node.childNodes[5].textContent;
		var caracs = node.childNodes[7].textContent;
		var taille = caracs.match(/\d+/)[0];
		var coef = 1;
		if (caracs.indexOf('Moyen')!=-1) coef = 2;
		else if (caracs.indexOf('Normale')!=-1) coef = 3;
		else if (caracs.indexOf('Bonne')!=-1) coef = 4;
		else if (caracs.indexOf('Exceptionnelle')!=-1) coef = 5;
		if (nature.indexOf('Mithril')!=-1) {
			coef = 0.2*coef;
			appendText(node.childNodes[7], ' | UM: '+arrondi(taille*coef) );
			}
		else {
			coef = 0.75*coef+1.25;
			if (nature.indexOf('Taill')!=-1) coef = 1.15*coef;
			appendText(node.childNodes[7], ' | Carats: '+arrondi(taille*coef) );
			}
		}
	}

// Roule' 06/01/2017 ne fonctionne plus, la récupération des nodes ne donne rien
function treateComposants() {
	if (currentURL.indexOf("as_type=Compo")==-1) return;
	//On récupère les composants
	var nodes = document.evaluate(
			"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]"
			+ "/following::table[@width = '100%']/descendant::tr[contains(td[1]/a/b/text(),']') "
			+ "and (contains(td[3]/text()[2],'Tous les trolls') or contains(td[3]/text()[1],'Tous les trolls') ) "
			+ "and td[1]/img/@alt = 'Identifié']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0) {
		//window.console.log('[MZ] treateComposants DOWN');
		return;
		}
	//window.console.log('[MZ] treateComposants nbnodes=' + nodes.snapshotLength);

	var texte = "";
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var n1 = nodes.snapshotItem(i).childNodes[1];
		var n3 = nodes.snapshotItem(i).childNodes[3];
		var debut = n1.childNodes[2].nodeValue.replace(/\n/g, '');
		var prix = n3.childNodes[0].nodeValue;
		if (!prix)
			prix = n3.childNodes[3].getAttribute('value') + " GG'";
		texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";"
				+ prix.replace(/\n/g, '') + "\n";
	}

	var c = document.evaluate("//div[@class = 'titre2']/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var id_taniere = c.snapshotItem(0).nodeValue;
	id_taniere = id_taniere.substring(id_taniere.lastIndexOf('(') + 1, id_taniere.lastIndexOf(')'));

	var form = getFormComboDB(currentURL.indexOf('MH_Taniere') != -1 ? 'taniere' : 'grande_taniere', id_taniere,
			texte.replace(/\240/g, " ").replace(/d'un/g, "d un"));
	if (form)
	{
		if(document.getElementsByTagName('form').length>0)
			insertBefore(document.getElementsByTagName('form')[0].nextSibling, form);
		else
		{
			var thisP = document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..",	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			insertBefore(thisP, form);
		}
	}
}

function treateAllComposants() {
	if(currentURL.indexOf("as_type=Compo")==-1) return;

	//On récupère les composants
	var categ = document.evaluate( "count(//table/descendant::text()[contains(.,'Sans catégorie')])",
							document, null, 0, null ).numberValue;
	var c = (categ == 0 ? 3 : 4);
	var nodes = document.evaluate("//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') "
		+ "or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]/following::table[@width = '100%']"
		+ "/descendant::tr[contains(td[1]/a/b/text(),']') and ("
			+ "td["+c+"]/text()[1] = '\u0040-\u0040' "
			+ "or contains(td["+c+"]/text()[2],'Tous les trolls') "
			+ "or contains(td["+c+"]/text()[1],'Tous les trolls') "
			+ "or (count(td["+c+"]/text()) = 1 and td["+c+"]/text()[1]='n°') ) "
		+ "and td[1]/img/@alt = 'Identifié']",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0) {
//		window.alert('treateAllComposants DOWN');
		return;
		}

	var texte = "";
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var n1 = nodes.snapshotItem(i).childNodes[1];
		var n3 = nodes.snapshotItem(i).childNodes[3];
		var debut = n1.childNodes[2].nodeValue.replace(/\n/g, '');
		var prix = n3.childNodes[0].nodeValue;
		if (!prix)
		{
			if(n3.childNodes[3].getAttribute('value') && n3.childNodes[3].getAttribute('value')!="")
				prix = n3.childNodes[3].getAttribute('value') + " GG'";
		}
		else
		{
			prix= prix.replace(/[\240 ]/g, "");
			if(prix=="-")
				prix=null;
		}
		if(prix)
			texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";"
				+ prix.replace(/\n/g, '') + "\n";
		else
			texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";pas défini\n";
	}

	var c = document.evaluate("//div[@class = 'titre2']/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var id_taniere = c.snapshotItem(0).nodeValue;
	id_taniere = id_taniere.substring(id_taniere.indexOf('(') + 1, id_taniere.indexOf(')'));

	var form = getFormComboDB(currentURL.indexOf('MH_Taniere') != -1 ? 'taniere' : 'grande_taniere', id_taniere,
			texte.replace(/\240/g, " ").replace(/d'un/g, "d un"),"Vendre tous les composants non réservés sur le Troc de l\'Hydre");
	if (form)
	{
		if(document.getElementsByTagName('form').length>0)
			insertBefore(document.getElementsByTagName('form')[0].nextSibling, form);
		else
		{
			var thisP = document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..",	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			insertBefore(thisP, form);
		}
	}
}

function treateEM()
{
	if (1) return;	// Roule' 06/01/2017 ne fonctionne plus depuis.... longtemps
	if(currentURL.indexOf("as_type=Compo")==-1)
		return false;
	var urlImg = URL_MZimg + "Competences/ecritureMagique.png";
	var nodes = document.evaluate("//tr[@class='mh_tdpage']"
			, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var desc = nodes.snapshotItem(i).getElementsByTagName('td') ;
		var link = desc[2].firstChild ;
		var nomCompoTotal = desc[2].textContent ;
		var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
		nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
		var nomMonstre = trim(nomCompoTotal.substring(nomCompoTotal.indexOf(" ")+1,nomCompoTotal.length-1)) ;
		var locqual = desc[3].textContent ;
		var qualite = trim(locqual.substring(locqual.indexOf("Qualité:")+9)) ;
		var localisation = trim(locqual.substring(0,locqual.indexOf("|")-1)) ;
		if(isEM(nomMonstre).length>0)
		{
			var infos = composantEM(nomMonstre, trim(nomCompo), localisation,getQualite(qualite));
			if(infos.length>0)
			{
				var shortDescr = "Variable";
				var bold = 0;
				if(infos != "Composant variable")
				{
					shortDescr = infos.substring(0,infos.indexOf(" "));
					if(parseInt(shortDescr)>=0)
						bold=1;
				}
				link.parentNode.appendChild(createImage(urlImg,infos)) ;
				appendText(link.parentNode," ["+shortDescr+"]",bold) ;
			}
		}

	}
}

function treateChampi_tabcompo() {
	if (currentURL.indexOf('as_type=Champi')==-1)
		return false;
	var nodes = document.evaluate("//img[@alt = 'Identifié']/../a/text()[1]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var nomChampi = trim(node.nodeValue.replace(/\240/g, ' '));
		if (moisChampi[nomChampi])
			appendText(node.parentNode.parentNode,' [Mois '+moisChampi[nomChampi]+']');
		}
	}

function treateEnchant()
{
	if(currentURL.indexOf("as_type=Compo")==-1)
		return false;
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate(
			"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]"
			+ "/following::table[@width = '100%']/descendant::tr[contains(td[1]/a/b/text(),']') "
			+ "and td[1]/img/@alt = 'Identifié']/td[1]/a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0)
			return false;
		var urlImg = URL_MZimg + "enchant.png";
		for (var i = 0; i < nodes.snapshotLength; i++) {
			var link = nodes.snapshotItem(i);
			var nomCompoTotal = link.firstChild.nodeValue;
			var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
			var nomMonstre = nomCompoTotal.substring(nomCompoTotal.indexOf(" ")+1,nomCompoTotal.length);
			nomCompoTotal = link.childNodes[1].childNodes[0].nodeValue;
			var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualité")+11,nomCompoTotal.indexOf(" ["));
			var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf("[")+1,nomCompoTotal.indexOf("]"));
			if(isEnchant(nomMonstre).length>0)
			{
				var infos = composantEnchant(nomMonstre, nomCompo, localisation,getQualite(qualite));
				if(infos.length>0)
				{
					link.parentNode.appendChild(createImage(urlImg,infos));
				}
			}
		}
	}
	catch(e)
	{
		window.alert(e);
	}
}

function treateEquipEnchant()
{
	if(currentURL.indexOf('as_type=Arme')==-1 && currentURL.indexOf('as_type=Armure')==-1)
		return false;
	initPopupTabcompo();
	computeEnchantementEquipement(createPopupImage_tabcompo,formateTexte_tabcompo);
}

function do_tancompo() {
	start_script();

	treateAllComposants();
	treateComposants();
	traiteMinerai_tabcompo();
	if (MY_getValue('NOINFOEM')!='true') {
		treateChampi_tabcompo();
		treateEM();
		}
	if (MY_getValue(numTroll+'.enchantement.liste') && MY_getValue(numTroll+'.enchantement.liste')!='') {
		treateEnchant();
		treateEquipEnchant();
		}

	displayScriptTime();
}

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x pjview

/* TODO
 * - MZ2.0 : Implémenter les BDD en dur dans le module interne
 */

// Bulle d'infos
var DivInfo;
// Booléen stockant l'état de freezing de la bulle
var freezed = false;

// liste du matos
// mh_caracs ['Nom'] = [ 'Type', 'AttP', 'AttM', 'DegP','DegM', 'Esq',
// 'ArmP','ArmM', 'Vue', 'Reg', 'RM_Min', 'RM_Max', 'MM_Min', 'MM_Max',
// 'PV', 'DLA', 'Poids_Min', 'Poids_Max' ];
var mh_caracs = {        "Anneau":
                ['Anneau',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3],
        "Armure d'Anneaux":
                ['Armure',0,0,0,0,-4,8,0,0,0,90,180,0,0,0,0,50,50],
        "Armure de bois":
                ['Armure',0,0,0,0,-3,6,0,0,0,50,10,0,0,15,0,40,40],
        "Armure de cuir":
                ['Armure',0,0,0,0,3,4,0,0,0,40,80,0,0,0,0,10,10],
        "Armure de peaux":
                ['Armure',0,0,0,0,-3,9,0,0,0,70,140,0,0,0,0,45,45],
        "Armure de pierre":
                ['Armure',0,0,0,0,-6,12,0,0,0,75,150,0,0,0,0,75,75],
        "Armure de plates":
                ['Armure',0,0,0,0,-2,10,0,0,0,50,100,0,0,0,0,63,63],
        "Baton de mage":
                ['Arme 2 mains',0,8,0,-2,0,0,0,0,0,0,0,15,30,0,0,10,10],
        "Baton Lesté":
                ['Arme 2 mains',10,0,-2,0,0,0,0,0,0,0,0,0,0,0,0,10,10],
        "Bâtons de Parade":
                ['Arme 2 mains',0,-3,0,-2,9,0,0,0,0,0,0,0,0,0,0,10,10],
        "Bottes":
                ['Bottes',0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,5,5],
        "Bouclier à Pointes":
                ['Bouclier',1,0,1,0,-1,4,0,0,0,0,0,0,0,0,0,20,20],
        "Boulet et chaîne":
                ['Arme 1 main',-1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,8,8],
        "Cagoule":
                ['Casque',0,0,0,0,0,0,0,-1,0,0,0,5,10,0,0,2,5,2,5],
        "Casque à Cornes":
                ['Casque',0,0,1,0,0,3,0,-1,0,5,10,0,0,0,0,5,5],
        "Casque à Pointes":
                ['Casque',1,0,1,0,0,3,0,-1,0,0,0,0,0,0,0,6,6],
        "Casque en cuir":
                ['Casque',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0,5,5],
        "Casque en métal":
                ['Casque',0,0,0,0,0,2,0,-1,0,5,10,0,0,0,0,5,5],
        "Chaîne Cloutée":
                ['Arme 2 mains',-1,0,4,0,1,0,0,0,0,0,0,0,0,0,0,20,20],
        "Chapeau pointu":
                ['Casque',0,0,0,0,3,0,0,0,0,5,10,0,0,0,0,5,5],
        "Collier à Pointes":
                ['Talisman',0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,3,3],
        "Collier de dents":
                ['Talisman',0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        "Collier de pierre":
                ['Talisman',0,0,0,0,0,0,0,0,0,5,10,5,10,0,0,2,5,2,5],
        "Cotte de mailles":
                ['Armure',0,0,0,0,-1,7,0,0,0,30,60,0,0,0,0,43,43],
        "Couronne d'obsidienne":
                ['Casque',0,0,0,0,0,1,2,0,-1,0,0,0,0,0,0,10,10],
        "Couronne de Cristal":
                ['Casque',0,0,0,1,0,0,-1,3,0,0,0,5,10,0,0,10,10],
        "Coutelas d'obsidienne":
                ['Arme 1 main',2,0,3,0,2,0,0,0,-2,-5,-10,-15,-30,0,0,5,5],
        "Coutelas en os":
                ['Arme 1 main',0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,4,4],
        "Crochet":
                ['Arme 1 main',-1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,6,6],
        "Cuir bouilli":
                ['Armure',0,0,0,0,1,8,0,0,0,20,40,0,0,0,0,20,20],
        "Cuirasse d'écailles":
                ['Armure',0,0,0,0,-1,6,0,0,0,38,70,0,0,0,0,38,38],
        "Cuirasse d'Ossements":
                ['Armure',0,0,0,0,-3,6,0,0,0,50,100,20,40,0,0,40,40],
        "Culotte en Cuir":
                ['Armure',0,0,0,0,5,0,0,0,0,60,120,0,0,0,0,2,5,2,5],
        "Dague":
                ['Arme 1 main',0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,3,3],
        "Épée Courte":
                ['Arme 1 main',0,0,2,0,2,0,0,0,0,0,0,0,0,0,0,5,5],
        "Épée Longue":
                ['Arme 1 main',-1,0,4,0,1,0,0,0,0,0,0,0,0,0,0,13,13],
        "Espadon":
                ['Arme 2 mains',-3,0,8,0,0,0,0,0,0,0,0,0,0,0,0,25,25],
        "Filet":
                ['Arme 1 main',0,-1,0,-1,5,0,0,0,0,0,0,0,0,0,0,10,10],
        "Fouet":
                ['Arme 1 main',7,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,8,8],
        "Fourrures":
                ['Armure',0,0,0,0,2,6,0,0,0,30,60,0,0,0,0,15,15],
        "Gantelet":
                ['Arme 1 main',-1,0,1,0,1,2,0,0,0,0,0,0,0,0,0,4,4],
        "Gantelet (ancien)":
                ['Arme 1 main',-1,0,1,0,1,0,0,0,2,0,0,0,0,0,0,7,5,7,5],
        "Gorgeron de cuir":
                ['Talisman',0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,5,2,5],
        "Gorgeron de metal":
                ['Talisman',0,0,0,0,0,3,0,0,-1,10,20,0,0,0,0,5,5],
        "Gourdin":
                ['Arme 1 main',2,0,5,0,-2,0,0,0,0,0,0,0,0,0,0,12,5,12,5],
        "Gourdin clouté":
                ['Arme 1 main',-1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,15,15],
        "Grimoire":
                ['Bouclier',0,2,0,1,0,0,0,0,0,0,0,5,10,0,0,10,10],
        "Gros'Porte":
                ['Bouclier',0,0,0,0,-1,5,0,0,0,10,20,0,0,0,0,30,30],
        "Grosse racine":
                ['Arme 1 main',0,0,0,0,-1,2,0,0,0,5,10,0,0,5,0,20,20],
        "Grosse Stalagmite":
                ['Arme 2 mains',-20,0,28,0,-15,0,0,-4,0,0,0,0,0,0,0,90,90],
        "Hache à deux mains d'Obsidienne":
                ['Arme 2 mains',-8,0,16,0,0,0,0,0,-4,-45,-90,-15,-30,0,0,75,75],
        "Hache de Bataille":
                ['Arme 2 mains',-2,0,6,0,0,0,0,0,0,0,0,0,0,0,0,18,18],
        "Hache de guerre en os":
                ['Arme 2 mains',0,-2,0,6,0,0,0,0,0,0,0,15,30,0,0,25,25],
        "Hache de guerre en pierre":
                ['Arme 2 mains',-10,0,14,0,0,0,0,0,0,0,0,5,10,0,0,60,60],
        "Hallebarde":
                ['Arme 2 mains',-5,0,12,0,0,0,0,0,0,0,0,0,0,0,0,37,5,37,5],
        "Haubert d'écailles":
                ['Armure',0,0,0,0,-2,8,0,0,0,40,80,0,0,0,0,25,25],
        "Haubert de mailles":
                ['Armure',0,0,0,0,-3,9,0,0,0,70,140,0,0,0,0,55,55],
        "Couronne de Ronces":
                ['Casque',0,0,3,0,0,0,0,-5,0,0,0,0,0,0,0,5,5],
        "Heaume":
                ['Casque',-1,0,0,0,0,4,0,-2,0,10,20,0,0,0,0,13,13],
        "Jambière en cuir":
                ['Bottes',0,0,0,0,1,2,0,0,0,5,10,0,0,0,0,10,10],
        "Jambière en fourrure":
                ['Bottes',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0,2,5,2,5],
        "Jambière en mailles":
                ['Bottes',0,0,0,0,0,3,0,0,0,5,10,0,0,0,0,13,13],
        "Jambière en métal":
                ['Bottes',0,0,0,0,-1,4,0,0,0,5,10,0,0,0,0,15,15],
        "Jambière en os":
                ['Bottes',0,0,0,0,-1,2,0,0,0,5,10,5,10,0,0,10,10],
        "Lame d'obsidienne":
                ['Arme 1 main',3,0,7,0,0,0,0,0,-3,-30,-60,-10,-20,0,0,20,20],
        "Lame en os":
                ['Arme 1 main',0,2,0,2,0,0,0,0,0,0,0,5,10,0,0,7,5,7,5],
        "Lame en pierre":
                ['Arme 1 main',-1,0,4,0,0,0,0,0,2,0,0,0,0,0,0,20,20],
        "Lorgnons":
                ['Casque',0,3,,0,0,0,0,1,0,0,0,5,10,0,0,2,5,2,5],
        "Machette":
                ['Arme 1 main',1,0,2,0,-1,0,0,0,0,0,0,0,0,0,0,13,13],
        "Masse d'arme":
                ['Arme 1 main',0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,8,8],
        "Menhir":
                ['Arme 2 mains',-4,0,0,0,-5,10,0,-3,0,0,0,25,50,0,0,50,50],
        "Œil de sang":
                ['Talisman',0,1,0,2,0,0,0,0,0,0,0,10,20,-5,0,3,3],
        "Pagne de Mailles":
                ['Armure',0,0,0,0,2,1,0,0,0,0,0,0,0,0,0,4,4],
        "Pagne en Cuir":
                ['Armure',0,0,0,0,4,2,0,0,0,50,100,0,0,0,0,5,5],
        "Pendentif Incandescent":
                ['Talisman',0,-1,0,-1,3,0,0,0,0,10,20,10,20,0,0,2,5,2,5],
        "Robe de mage":
                ['Armure',0,0,0,0,2,1,3,0,0,10,20,10,20,0,0,20,20],
        "Rondache en Bois":
                ['Bouclier',0,0,0,0,1,3,0,0,0,0,0,0,0,5,0,15,15],
        "Rondache en Métal":
                ['Bouclier',0,0,0,0,1,2,0,0,0,0,0,0,0,0,0,18,18],
        "Sandales":
                ['Bottes',0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,2,5,2,5],
        "Souliers dorés":
                ['Bottes',0,0,0,0,-1,1,2,0,0,0,0,0,0,0,0,10,10],
        "Talisman d'Obsidienne":
                ['Talisman',1,0,2,0,0,0,0,0,-4,20,40,20,40,0,0,2,5,2,5],
        "Talisman de pierre":
                ['Talisman',0,0,0,0,0,0,0,0,2,10,20,10,20,0,0,2,5,2,5],
        "Targe":
                ['Bouclier',1,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,3],
        "Torche":
                ['Arme 1 main',0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,7,5,7,5],
        "Torque en pierre":
                ['Talisman',0,0,0,0,0,0,0,0,-2,20,40,20,40,0,0,2,5,2,5],
        "Tunique":
                ['Armure',0,0,0,0,1,0,0,0,0,5,10,5,10,0,0,2,5,2,5],
        "Tunique d'écailles":
                ['Armure',0,0,0,0,0,3,0,0,0,15,30,0,0,0,0,8,8],
        "Turban":
                ['Casque',0,0,0,0,0,0,0,0,0,15,30,15,30,0,0,2,5,2,5],
}

// liste des templates
// mh_templates['Nom'] = [ 'AttP', 'AttM', 'DegP', 'DegM', 'Esq',
// 'ArmP', 'ArmM', 'Vue', 'Reg', 'RM_Min', 'RM_Max', 'MM_Min', 'MM_Max',
// 'PV', 'DLA', 'Poids_Min', 'Poids_Max');
var mh_templates = {
	'de Feu':
		[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'de Résistance':
		[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
	"de l'Aigle":
		[0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
	'de la Salamandre':
		[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
	'des Cyclopes':
		[0,1,0,1,0,0,0,-1,0,0,0,0,0,0,0,0,0],
	'des Enragés':
		[0,1,0,1,-1,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Tortues':
		[0,0,0,0,0,0,2,0,0,0,0,0,0,0,30,0,0],
	'des Vampires':
		[0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
	'du Glacier':
		[0,1,0,0,0,0,1,0,0,5,5,0,0,0,0,0,0],
	'du Rat':
		[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	'du Roc':
		[0,0,0,0,-1,0,1,0,0,0,0,0,0,0,0,0,0],
	'du Temps':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,0,0],
	'du Vent':
		[0,0,0,-1,1,0,0,0,0,0,0,0,0,0,0,0,0],
	'en Mithril':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Anciens':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Champions':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Duellistes':
		[0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'de la Terre':
		[0,0,0,0,0,0,0,0,2,0,0,0,0,5,30,0,0],
	"de l'Orage":
		[0,0,0,-1,2,0,0,0,0,0,0,0,0,0,0,0,0],
	"de l'Ours":
		[0,0,0,2,0,0,0,0,0,0,0,0,0,5,30,0,0],
	'des Béhémoths':
		[0,0,0,0,0,0,3,0,0,0,0,0,0,0,30,0,0],
	'des Mages':
		[0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0],
	'du Pic':
		[0,0,0,0,-1,0,2,0,0,0,0,0,0,0,0,0,0],
	'du Sable':
		[0,0,0,0,3,0,-1,-1,0,0,0,0,0,0,0,0,0],
	'acéré':
		[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'acérée':
		[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'équilibré':
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'équilibrée':
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'léger':
		[0,0,0,0,1,-1,0,0,0,0,0,0,0,0,0,0,0],
	'légère':
		[0,0,0,0,1,-1,0,0,0,0,0,0,0,0,0,0,0],
	'renforcé':
		[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	'renforcée':
		[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	'robuste':
		[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]
}

function clone(arr) {
// Clonage rapide
	return arr.slice(0);
}

function addArray(arr1,arr2) {
// Somme matricielle
	var res = clone(arr1);
	for(i=res.length-1 ; i>=0 ; i--) {
		res[i] += arr2[i];
	}
	return res;
}

function getTemplates(nomItem) {
// Déstructure le nom de l'item en array [nom, template1, ...]
	var tempFound = true;
	var str = nomItem.trim();
	var arr = [];
	while(tempFound) {
		tempFound = false;
		for(var temp in mh_templates) {
			// on teste la fin du nom contre chaque template
			if(str.slice(-temp.length)!=temp) { continue; }
			tempFound = true;
			str = str.slice(0,-temp.length-1);
			arr.unshift(temp);
			if(str.slice(-3)==' et') {
				str = str.slice(0,-3);
			}
		}
	}
	arr.unshift(str);
	return arr;
}

function addMithril(arrayCaracs,typeItem) {
// Ajoute l'effet du Mithril sur les caracs
	if(typeItem=='arme') {
		if(arrayCaracs[0]<0) {
			arrayCaracs[0] = Math.ceil(arrayCaracs[0]/2);
		}
	}
	else {
		if(arrayCaracs[4]<0) {
			arrayCaracs[4] = Math.ceil(arrayCaracs[4]/2);
		}
	}
	arrayCaracs[15] /= 2;
	arrayCaracs[16] /= 2;
	return arrayCaracs;
}

function addRenfort(arrayCaracs,template) {
// Ajoute l'effet des pseudo-templates sur les caracs
// S'applique APRÈS le mithril
// WARNING - Cette formule n'a rien d'officiel, gare !
	var coef = 0;
	if(/^lég[e,è]re?$/.test(template)) {
		coef = -1;
	}
	else if(/^renforcée?$/.test(template)
		|| template==='robuste') {
		coef = 1;
	}
	if(coef) {
		arrayCaracs[15] = arrayCaracs[15]+coef*Math.floor(arrayCaracs[15]/10);
		arrayCaracs[16] = arrayCaracs[16]+coef*Math.floor(arrayCaracs[16]/10);
	}
	arrayCaracs = addArray(arrayCaracs,mh_templates[template]);
	return arrayCaracs;
}

function getCaracs(item) {
// Calcule les caractéristiques de l'item
	var templates = getTemplates(item);
	if(!mh_caracs[templates[0]]) {
		// Si l'item est inconnu
		return [];
	}
	var caracs = clone(mh_caracs[templates[0]]);
	var typeItem = caracs[0];
	caracs.shift();
	templates.shift();
	if(templates[templates.length-1]=='en Mithril') {
		caracs = addMithril(caracs,typeItem);
		templates.pop();
	}
	if(/^acérée?$/.test(templates[0])
		|| /^équilibrée?$/.test(templates[0])
		|| /^lég[e,è]re?$/.test(templates[0])
		|| /^renforcée?$/.test(templates[0])
		|| templates[0]=='robuste') {
		caracs = addRenfort(caracs,templates[0]);
		templates.shift();
	}
	for(var i=templates.length-1 ; i>=0 ; i--) {
		caracs = addArray(caracs,mh_templates[templates[i]]);
	}
	return caracs;
}

function getLine(tab) {
// Préparation de la ligne à afficher lors d'un mouseover
	var str = '';
	if(tab[0]!=0 || tab[1]!=0) {
		str += '<b>Att : </b>'+aff(tab[0]);
		if(tab[1]!=0) { str += '/'+aff(tab[1]); }
		str += ' | ';
	}
	if(tab[4]!=0) {
		str += '<b>Esq : </b>'+aff(tab[4])+' | ';
	}
	if(tab[2]!=0 || tab[3]!=0) {
		str += '<b>Deg : </b>'+aff(tab[2]);
		if(tab[3]!=0) { str += '/'+aff(tab[3]); }
		str += ' | ';
	}
	if(tab[8]!=0) {
		str += '<b>Reg : </b>'+aff(tab[8])+' | ';
	}
	if(tab[7]!=0) {
		str += '<b>Vue : </b>'+aff(tab[7])+' | ';
	}
	if(tab[5]!=0 || tab[6]!=0) {
		str += '<b>Arm : </b>'+aff(tab[5]);
		if(tab[6]!=0) { str += '/'+aff(tab[6]); }
		str += ' | ';
	}
	if(tab[9]!=0 || tab[10]!=0) {
		str += '<b>RM : </b>'+aff(tab[9])+'%';
		if(tab[9]!=tab[10]) {
			str += '/'+aff(tab[10])+'%';
			}
		str += ' | ';
		}
	if(tab[11]!=0 || tab[12]!=0) {
		str += '<b>MM : </b>'+aff(tab[11])+'%';
		if(tab[11]!=tab[12]) { str += '/'+aff(tab[12])+'%'; }
		str += ' | ';
	}
	if(tab[13]!=0) {
		str += '<b>PV : </b>'+aff(tab[13])+' | ';
	}
	if(tab[14]!=0) {
		str += '<b>DLA : </b>'+aff(tab[14])+' min | ';
	}
	str += '<b>Poids : </b>'+tab[15]+' min';
	if(tab[15]!=tab[16]) {
		str += ' / '+tab[16]+' min';
	}
	return str;
}

function toolTipInit() {
	DivInfo = document.createElement('div');
	DivInfo.id = 'infosVue';
	DivInfo.className = 'mh_textbox';
	DivInfo.style =
		'position: absolute;'
		+'border: 1px solid #000000;'
		+'visibility:hidden;'
		+'display:inline;'
		+'z-index:99;';
	document.body.appendChild(DivInfo);
	document.onmousemove = getXY;
	document.onclick = changeFreezeStatus;
}

function getXY(evt) {
	if(!freezed && DivInfo.style.visibility=='visible') {
		DivInfo.style.left = evt.pageX+'px';
		DivInfo.style.top = evt.pageY+10+'px';
	}
}

function changeFreezeStatus() {
	if(DivInfo.style.visibility=='visible') {
		freezed = !freezed;
		if(!freezed) { hideInfos(); }
	}
}

function showInfos() {
	if(freezed) { return; }
	var currentInfos = this.infos;
	DivInfo.innerHTML = currentInfos;
	DivInfo.style.visibility = 'visible';
	var compStyles = window.getComputedStyle(DivInfo);
	if (compStyles.getPropertyValue('background-color') == 'rgba(0, 0, 0, 0)') DivInfo.style.backgroundColor = 'rgb(255, 255, 238)';
}

function hideInfos() {
	if(!freezed) { DivInfo.style.visibility = 'hidden'; }
}

function treateEquipement() {
// Extrait les données du matos et réinjecte les infos déduites
	if(MY_getValue('INFOCARAC')=='false') { return; }

	var faireLigne = false;
	var caracs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var nodes = document.evaluate(
		"//td/b[text()='Equipement Utilisé']/../../"
		+"td[2]/img[contains(@src,bullet)]",
		document, null, 7, null);
	if(nodes.snapshotLength>0) {
		// Si CSS de base
		for(var i=0 ; i<nodes.snapshotLength ; i++) {
			var node = nodes.snapshotItem(i);
			var next = node.nextSibling;
			var nnext = next.nextSibling;
			var nom = next.nodeValue.toLowerCase();
			if(nnext.childNodes.length==1) {
				nom += nnext.firstChild.nodeValue;
			}
			nom = nom.trim();
			// gestion winpostrophe
			var c = String.fromCharCode(180);
			while(nom.indexOf(c)!=-1) {
				nom = nom.replace(c,"'");
			}
			var arr = getCaracs(nom);
			if(arr.length>0) {
				faireLigne = true;
				caracs = addArray(caracs,arr);
				var span = document.createElement('span');
				span.appendChild(next);
				span.appendChild(nnext);
				span.infos = getLine(arr);
				span.onmouseover = showInfos;
				span.onmouseout = hideInfos;
				insertBefore(node.nextSibling,span);
			}
		}

		if(faireLigne) {
			var node = document.evaluate("//td/b[text()='Equipement Utilisé']",
				document, null, 9, null).singleNodeValue;
			node.infos = getLine(caracs);
			node.onmouseover = showInfos;
			node.onmouseout = hideInfos;
		}
	}
	else {
		// Si CSS avancée
		nodes = document.evaluate("//dd[@class='equipement']/ul/li",
			document, null, 7, null);
		if(nodes.snapshotLength>0) {
			for(var i=0 ; i<nodes.snapshotLength ; i++) {
				var node = nodes.snapshotItem(i);
				var nom = node.firstChild.nodeValue.toLowerCase();
				if(node.childNodes.length>1 && node.childNodes[1].firstChild) {
					nom += node.childNodes[1].firstChild.nodeValue;
				}
				nom = nom.trim();
				// gestion winpostrophe
				var c = String.fromCharCode(180);
				while(nom.indexOf(c)!=-1) {
					nom = nom.replace(c,"'");
				}
				var arr = getCaracs(nom);
				if(arr.length!=0) {
					caracs = addArray(caracs,arr);
					node.infos = getLine(arr);
					node.onmouseover = showInfos;
					node.onmouseout = hideInfos;
				}
			}
			var nodes = document.evaluate("//dt[@class='equipement']",
				document, null, 7, null);
			var node = nodes.snapshotItem(0);
			node.infos = getLine(caracs);
			node.onmouseover = showInfos;
			node.onmouseout = hideInfos;
		}
	}
}

function do_pjview() {
	treateEquipement();
	toolTipInit();
}

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x option

/* TODO
 * Passer le HTML injecté aux conventions HTML5
 */


/*-[functions]------------- Fonctions de sauvegarde --------------------------*/

function saveITData() {
	var IT = document.getElementById('itSelect').value;
	if(IT=='bricol') {
		var nBricol = 1;
		for (var iBricol = 0; ; iBricol++) {
			var extClef = nBricol == 1 ? '' : nBricol;
			var eltSystem = document.getElementById('urlbricol'+iBricol);
			if (eltSystem == undefined) break;
			var system = eltSystem.value;
			window.console.log("[MZ] saveITData system=" + system);
			var login = document.getElementById('loginbricol'+iBricol).value;
			var pass = document.getElementById('passbricol'+iBricol).value;
			var affhv = document.getElementById('affhvbricol').checked ? 1 : 0;
			if(system && login) {
				if (pass) {
					var v = 'bricol$'+system+'$'+login+'$'+hex_md5(pass)+'$'+affhv;
					MY_setValue(numTroll+'.INFOSIT'+extClef, v);
					//window.console.log('v=' + v);
				} else {
					// vérif que rien n'a changé
					var str = MY_getValue(numTroll+'.INFOSIT'+extClef);
					if(str) {
						var arr = str.split('$');
						if  (system != arr[1] || login != arr[2] || affhv != arr[4]) {
							alert('Attention, système tactique Bricol\'Trolls ' + system + ' sans mot de passe => non modifié');
						}
					}
				}
				nBricol++;
			}
		}
		window.console.log("[MZ] saveITData remove " + numTroll+'.INFOSIT'+extClef);
		MY_removeValue(numTroll+'.INFOSIT'+extClef);
	}
	else {
		MY_removeValue(numTroll+'.INFOSIT');
	}
}

function saveLinks() {
	var numLinks = document.getElementById('linksBody').childNodes.length;
	var data=[ [] ];
	/* Récupération et tri des liens */
	for(var i=1 ; i<=numLinks ; i++) {
		MY_removeValue('URL'+i);
		MY_removeValue('URL'+i+'.nom');
		MY_removeValue('URL'+i+'.ico');
		var url = document.getElementById('url'+i).value;
		var nom = document.getElementById('nom'+i).value;
		var ico = document.getElementById('ico'+i).value;
		if(url && (nom || ico) ) {
			data.push( [url, nom ? nom : '', ico ? ico : ''] );
		}
	}
	/* Sauvegarde */
	for(var i=1 ; i<data.length ; i++) {
		MY_setValue('URL'+i,data[i][0]);
		MY_setValue('URL'+i+'.nom',data[i][1]);
		MY_setValue('URL'+i+'.ico',data[i][2]);
	}
}

function saveAll() {
	try {
		var urlIco = document.getElementById('icoMenuIco').value;
		if(urlIco) {
			MY_setValue(numTroll+'.ICOMENU', urlIco );
		}
		else {
			MY_removeValue(numTroll+'.ICOMENU', urlIco );
			document.getElementById('icoMenuIco').value = '';
		}
		saveLinks();
		refreshLinks();

		MY_setValue('VUEEXT',document.getElementById('vueext').value);

		var maxcdm = parseInt(document.getElementById('maxcdm').value);
		if(maxcdm) {
			MY_setValue(numTroll+'.MAXCDM', maxcdm );
		}
		else {
			MY_removeValue(numTroll+'.MAXCDM');
			document.getElementById('maxcdm').value = '';
		}

		MY_setValue('NOINFOEM',
			document.getElementById('noInfoEM').checked ? 'true' : 'false');

		// Pourquoi Tilk stockait-il tout en str ?
		// -> parce que les booléens c'est foireux (vérifié)
		MY_setValue(numTroll+'.USECSS',
			document.getElementById('usecss').checked ? 'true':'false');
		MY_setValue('INFOCARAC',
			document.getElementById('infocarac').checked ? 'true' : 'false');
		//MY_setValue(numTroll+'.SEND_IDT',
		//	document.getElementById('send_idt').checked ? 'oui' : 'non');
		// Fonctionnalité désactivée

		MY_setValue(numTroll+'.AUTOCDM',
			document.getElementById('autoCdM').checked ? 'true' : 'false');
		// MY_setValue('VUECARAC',	// Roule 12/12/2019 ça ne fait plus rien
			// document.getElementById('vueCarac').checked ? 'true' : 'false');
		MY_setValue('CONFIRMEDECALAGE',
			document.getElementById('confirmeDecalage').checked ? 'true' : 'false');

		MY_setValue('COMPTEAREBOURSDLA',
			document.getElementById('compteAreboursDLA').checked ? 'true':'false');


		/* SCIZ */
		var sciz_jwt = document.getElementById('sciz_jwt').value;
		if (sciz_jwt !== null && sciz_jwt !== undefined) {
			sciz_jwt = sciz_jwt.replace(new RegExp('[^a-zA-Z0-9\._\-]','g'), '');
			MY_setValue(numTroll + '.SCIZJWT', sciz_jwt);
		}
		var sciz_cb_events = document.getElementById('sciz_cb_events').checked;
		sciz_cb_events = (sciz_cb_events !== null) ? sciz_cb_events : true;
		MY_setValue(numTroll + '.SCIZ_CB_EVENTS', sciz_cb_events);
		var sciz_cb_view_treasures = document.getElementById('sciz_cb_view_treasures').checked;
		sciz_cb_view_treasures = (sciz_cb_view_treasures !== null) ? sciz_cb_view_treasures : true;
		MY_setValue(numTroll + '.SCIZ_CB_VIEW_TREASURES', sciz_cb_view_treasures);
	    var sciz_cb_view_mushrooms = document.getElementById('sciz_cb_view_mushrooms').checked;
		sciz_cb_view_mushrooms = (sciz_cb_view_mushrooms !== null) ? sciz_cb_view_mushrooms : true;
		MY_setValue(numTroll + '.SCIZ_CB_VIEW_MUSHROOMS', sciz_cb_view_mushrooms);
		var sciz_cb_bestiaire = document.getElementById('sciz_cb_bestiaire').checked;
		sciz_cb_bestiaire = (sciz_cb_bestiaire !== null) ? sciz_cb_bestiaire : true;
		MY_setValue(numTroll + '.SCIZ_CB_BESTIAIRE', sciz_cb_bestiaire);
		var sciz_cb_view_trolls = document.getElementById('sciz_cb_view_trolls').checked;
		sciz_cb_view_trolls = (sciz_cb_view_trolls !== null) ? sciz_cb_view_trolls : true;
		MY_setValue(numTroll + '.SCIZ_CB_VIEW_TROLLS', sciz_cb_view_trolls);
	    var sciz_cb_view_user = document.getElementById('sciz_cb_view_user').checked;
		sciz_cb_view_user = (sciz_cb_view_user !== null) ? sciz_cb_view_user : true;
		MY_setValue(numTroll + '.SCIZ_CB_VIEW_USER', sciz_cb_view_user);
		var sciz_cb_view_traps = document.getElementById('sciz_cb_view_traps').checked;
		sciz_cb_view_traps = (sciz_cb_view_traps !== null) ? sciz_cb_view_traps : true;
		MY_setValue(numTroll + '.SCIZ_CB_VIEW_TRAPS', sciz_cb_view_traps);
		var sciz_cb_view_portals = document.getElementById('sciz_cb_view_portals').checked;
		sciz_cb_view_portals = (sciz_cb_view_portals !== null) ? sciz_cb_view_portals: true;
		MY_setValue(numTroll + '.SCIZ_CB_VIEW_PORTALS', sciz_cb_view_portals);
		saveITData();
	} catch (e) {
		var bouton = document.getElementById('saveAll');
		window.console.log(e);
		bouton.value = "il y a eu une erreur";
		return;
	}

	var bouton = document.getElementById('saveAll');
	bouton.value = (bouton.value=='Sauvegardé !') ?
		'Re-sauvegardé !' : 'Sauvegardé !';
}


/*-[functions]----------------- EventListeners -------------------------------*/

function addBricolIT(sSystem, sLogin, nAffhv, bFirst, bLast) {
	var itBody = document.getElementById('itBody');
	var nTr = itBody.rows.length;
	// enlever tous les "+" des lignes précédentes
	for (var iTr = 0; iTr < nTr; iTr++) {
		var td = itBody.rows[iTr].cells[0];
		td.innerHTML = '';
		td.title = '';
		td.style.cursor = 'default';
	}
	// ajouter une ligne
	var tr = appendTr(itBody,'mh_tdpage')
	var td = appendTd(tr);
	if (bLast) {
		td.style.whiteSpace = 'nowrap';
		appendText(td, '+');
		td.style.cursor = 'pointer';
		td.title = 'Cliquer ici pour ajouter un autre système Bricol\'Troll';
		td.onclick = function (e) {
			addBricolIT(undefined, undefined, undefined, false, true);
		}
	}
	var td = appendTd(tr);
	td.style.whiteSpace = 'nowrap';
	appendText(td,'Nom du système : ');
	appendTextbox(td,'text','urlbricol',20,50,sSystem,'urlbricol' + nTr);
	td = appendTd(tr);
	td.style.whiteSpace = 'nowrap';
	appendText(td,'Login du compte : ');
	appendTextbox(td,'text','loginbricol',20,50,sLogin,'loginbricol' + nTr);
	td = appendTd(tr);
	td.style.whiteSpace = 'nowrap';
	appendText(td,'Mot de passe du compte : ');
	appendTextbox(td,'password','passbricol',20,50,undefined,'passbricol' + nTr);
	td = appendTd(tr);
	if (bFirst) {
		td.style.whiteSpace = 'nowrap';
		appendText(td,'Affichage des Trõlls hors vue : ');
		appendCheckBox(td,'affhvbricol', (nAffhv>0));
	}
}

function onChangeIT() {
	var IT = document.getElementById('itSelect').value;
	var itBody = document.getElementById('itBody');
	itBody.innerHTML = '';
	var tabStr = new Array();
	if(IT=='bricol') {
		for (var iBricol = 1; ; iBricol++) {
			var str = MY_getValue(numTroll+'.INFOSIT'+(iBricol==1 ? '' : iBricol));
			//window.console.log('onChangeIT str=' + str);
			if(str) {
				tabStr.push(str);
			} else {
				break;
			}
		}
		if (tabStr.length == 0) {
			addBricolIT('', '', 0, true, true)
		} else {
			for (var iBricol = 0; iBricol < tabStr.length; iBricol++) {
				var arr = tabStr[iBricol].split('$');
				var system = arr[1];
				var login = arr[2];
				var affhv = arr[4];
				addBricolIT(system, login, affhv, iBricol == 0, iBricol == (tabStr.length - 1));
			}
		}
	}
}

function refreshLinks() {
	document.getElementById('linksBody').innerHTML = '';
	var anotherURL = MY_getValue('URL1');
	if(!anotherURL) { addLinkField(); }
	var i=1;
	while(anotherURL && i<99) {
		addLinkField(i,anotherURL,
			MY_getValue('URL'+i+'.nom'),MY_getValue('URL'+i+'.ico') );
		i++;
		anotherURL = MY_getValue('URL'+i);
	}
}

function addLinkField(i,url,nom,ico) {
	var linksBody = document.getElementById('linksBody');
	if(!(i>0)) { i = linksBody.childNodes.length+1; }
	var tr = appendTr(linksBody);
	var td = appendTdCenter(tr);
	appendText(td,'Lien '+i+' : ');
	appendTextbox(td,'text','url'+i,40,150,url);
	td = appendTdCenter(tr);
	appendText(td,'Nom : ');
	appendTextbox(td,'text','nom'+i,20,150,nom);
	td = appendTdCenter(tr);
	appendText(td,'Icône : ');
	appendTextbox(td,'text','ico'+i,40,150,ico);
}

function removeLinkField() {
	var linksBody = document.getElementById('linksBody');
	var i = linksBody.childNodes.length;
	MY_removeValue('URL'+i);
	MY_removeValue('URL'+i+'.nom');
	MY_removeValue('URL'+i+'.ico');
	linksBody.removeChild(linksBody.lastChild);
	if(linksBody.childNodes.length==0) { addLinkField(); }
}

function resetMainIco() {
	document.getElementById('icoMenuIco').value=
		URL_MZimg + 'mz_logo_small.png';
}


/*-[functions]-------------- Fonctions d'insertion ---------------------------*/

function insertTitle(next,txt) {
	var div = document.createElement('div');
	div.className = 'titre2';
	appendText(div,txt);
	insertBefore(next,div);
	return div;
}

function insertMainTable(next) {
	var table = document.createElement('table');
	table.width = '98%';
	table.border = 0;
	table.align = 'center';
	table.cellPadding = 2;
	table.cellSpacing = 1;
	table.className =  'mh_tdborder';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	insertBefore(next,table);
	return tbody;
}

function appendSubTable(node) {
	var table = document.createElement('table');
	table.width = '100%';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	node.appendChild(table);
	return tbody;
}

function insertOptionTable(insertPt) {
	var mainBody = insertMainTable(insertPt);

	/* Liens dans le Menu */
	var tr = appendTr(mainBody,'mh_tdtitre');
	var td = appendTdText(tr,'Hyperliens ajoutés dans le Menu :',true);
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendText(td,'Icône du Menu: ');
	var url = MY_getValue(numTroll+'.ICOMENU');
	if((!url) || (url.indexOf('mountyzilla.tilk.info/scripts_0.9/images/MY_logo_small')>0)) {
		url = URL_MZimg + 'mz_logo_small.png';
	}
	appendTextbox(td,'text','icoMenuIco',50,200,url);
	appendButton(td,'Réinitialiser',resetMainIco);

	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	var tbody = appendSubTable(td);
	tbody.id = 'linksBody';
	refreshLinks();

	td = appendTdCenter(appendTr(mainBody,'mh_tdpage'));
	appendButton(td,'Ajouter',addLinkField);
	appendButton(td,'Supprimer',removeLinkField);

	/* Options de la Vue : vue externe, nb de CdM, etc */
	tr = appendTr(mainBody,'mh_tdtitre');
	appendTdText(tr,'Options de la Vue :',true);
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	tbody = appendSubTable(td);

	tr = appendTr(tbody);
	td = appendTdText(tr,'Vue externe : ');
	var select = document.createElement('select');
	select.id = 'vueext';
	td.appendChild(select);
	var listeVues2D = [
		'Bricol\' Vue',
		'Vue du CCM',
		'Vue Gloumfs 2D',
		'Vue Gloumfs 3D',
		'Grouky Vue!'
	];
	for(var i=0 ; i<listeVues2D.length ; i++) {
		appendOption(select,listeVues2D[i],listeVues2D[i]);
	}
	if(MY_getValue('VUEEXT')) {
		select.value = MY_getValue('VUEEXT');
	}

	td = appendTd(tr);
	appendCheckBox(td,'noInfoEM',MY_getValue('NOINFOEM')=='true');
	appendText(td,' Masquer les informations à propos de l\'écriture magique');

	tr = appendTr(tbody);
	td = appendTdText(tr,'Nombre de CdM automatiquement récupérées : ');
	appendTextbox(td,'text','maxcdm',5,10,MY_getValue(numTroll+'.MAXCDM'));

	td = appendTd(tr);
	appendCheckBox(td,'usecss',MY_getValue(numTroll+'.USECSS')=='true');
	appendText(td,' Utiliser la CSS pour les couleurs de la diplomatie');

	/* Interface Tactique */
	td = appendTd(appendTr(mainBody,'mh_tdtitre'));
	appendText(td,'Interface Tactique : ',true);
	select = document.createElement('select');
	select.id = 'itSelect';
	appendOption(select,'none','Aucune');
	appendOption(select,'bricol','Système Tactique des Bricol\'Trolls');
	// seule interface supportée !
	td.appendChild(select);

	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	tbody = appendSubTable(td);
	tbody.id = 'itBody';
	select.onchange = onChangeIT;
	var str = MY_getValue(numTroll+'.INFOSIT');
	if(str) {
		select.value = str.slice(0,str.indexOf('$'));
		onChangeIT();
	}

	/* SCIZ */
	// JWT
	td = appendTd(appendTr(mainBody, 'mh_tdtitre'));
	appendText(td, 'SCIZ :', true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	td = appendTdText(td, 'JWT : ');
	appendTextbox(td, 'text', 'sciz_jwt', 150, 500, MY_getValue(numTroll + '.SCIZJWT'));
	// Event checkbox
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	tbody = appendSubTable(td);
	tr = appendTr(tbody)
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_events', [null, '1'].includes(MY_getValue(numTroll + '.SCIZ_CB_EVENTS')));
	appendText(td, ' Surcharger les événements');
	// Bestiaire checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_bestiaire', [null, '1'].includes(MY_getValue(numTroll + '.SCIZ_CB_BESTIAIRE')));
	appendText(td, ' Afficher les données du bestiaire');
	// Treasures checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_treasures', [null, '1'].includes(MY_getValue(numTroll + '.SCIZ_CB_VIEW_TREASURES')));
	appendText(td, ' Afficher les trésors identifiés');
	// Mushrooms checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_mushrooms', [null, '1'].includes(MY_getValue(numTroll + '.SCIZ_CB_VIEW_MUSHROOMS')));
	appendText(td, ' Afficher les champignons identifiés');
	// Trolls data checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_trolls', [null, '1'].includes(MY_getValue(numTroll + '.SCIZ_CB_VIEW_TROLLS')));
	appendText(td, ' Afficher les données des trolls');
	// User data checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_user', [null, '1'].includes(MY_getValue(numTroll + '.SCIZ_CB_VIEW_USER')));
	appendText(td, ' S\'afficher soit même');
	// Traps checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_traps', [null, '1'].includes(MY_getValue(numTroll + '.SCIZ_CB_VIEW_TRAPS')));
	appendText(td, ' Afficher les pièges');
	// Portals checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_portals', [null, '1'].includes(MY_getValue(numTroll + '.SCIZ_CB_VIEW_PORTALS')));
	appendText(td, ' Afficher les destinations de portails');

	/* Options diverses */
	td = appendTd(appendTr(mainBody,'mh_tdtitre'));
	appendText(td,'Options diverses :',true);
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'infocarac',MY_getValue('INFOCARAC')!='false');
	appendText(td,
		' Afficher les caractéristiques des équipements des autres Trõlls');

	/*td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'send_idt',MY_getValue(numTroll+'.SEND_IDT') != 'non')
	appendText(td,' Envoyer les objets identifiés au système de stats');*/

	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'autoCdM',MY_getValue(numTroll+'.AUTOCDM')=='true');
	appendText(td,' Envoyer automatiquement les CdM vers la base MountyZilla');

	// td = appendTd(appendTr(mainBody,'mh_tdpage'));	// Roule 12/12/2019 ça ne fait plus rien
	// appendCheckBox(td,'vueCarac',MY_getValue('VUECARAC')=='true');
	// appendText(td,' Afficher la Vue avec les caractéristiques dans le Profil');

	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'confirmeDecalage',MY_getValue('CONFIRMEDECALAGE')=='true');
	appendText(td,' Demander confirmation lors d\'un décalage de DLA');

	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'compteAreboursDLA',MY_getValue('COMPTEAREBOURSDLA')=='true');
	appendText(td,' Compte à rebours de DLA');

	/* Bouton SaveAll */
	td = appendTdCenter(appendTr(mainBody,'mh_tdtitre'));
	input = appendButton(td,'Sauvegarder',saveAll);
	input.id = 'saveAll';
	}

function insertCreditsTable(insertPt) {
	var tbody = insertMainTable(insertPt);

	var td = appendTdText( appendTr(tbody,'mh_tdtitre'),
		'Depuis son origine, nombreux sont ceux qui ont contribué à faire '
		+'de MountyZilla ce qu\'il est aujourd\'hui. Merci à eux !' );

	var ul = document.createElement('ul');
	td.appendChild(ul);
	appendLI(ul,'Tilk (36216), puis Dabihul (79738) pour avoir créé puis maintenu à bout de bras MZ pendant des années');
	appendLI(ul,'Fine fille (6465) pour les popup javascript');
	appendLI(ul,'Reivax (4234) pour les infos bulles');
	appendLI(ul,'Noc (2770) pour les moyennes des caracs');
	appendLI(ul,'Endymion (12820) pour les infos sur les comp/sorts');
	appendLI(ul,'Ratibus (15916) pour l\'envoi de CdM');
	appendLI(ul,'TetDure (41931) pour les PVs restants dans les CdM');
	appendLI(ul,'Les Teubreux pour leur bestiaire !');
	appendLI(ul,'Les développeurs de vue qui font des efforts pour s\'intégrer à Mountyzilla');
	appendLI(ul,'Gros Kéké (233) qui permet de tester le script aux limites du raisonnable avec sa vue de barbare');
	appendLI(ul,'Ashitaka (9485) pour le gros nettoyage de l\'extension, des scripts, et beaucoup de choses à venir');
	appendLI(ul,'Tous ceux de l\'ancienne génération oubliés par Tilk');
	appendLI(ul,'Zorya (28468), Vapulabehemot (82169), Breizhou13 (50233) et tous les participants au projet ZoryaZilla');
	appendLI(ul,'Yoyor (87818) pour diverses améliorations de code');
	appendLI(ul,'Rokü Menton-brûlant (108387) pour avoir incité à passer sur GitHub');
	appendLI(ul,'Marmotte (93138) pour son support technique récurrent');
	appendLI(ul,'Hennet (74092) pour le script du nouveau profil');
	appendLI(ul,'Raistlin (61214, 109327) pour le script sur les caracs de l\'équipement et maintenant pour l\'hébergement');
	appendLI(ul,'Markotroll (27637) pour les tests sous LINUX');
	appendLI(ul,'Tous les testeurs de la nouvelle génération oubliés par Dabihul puis Rouletabille');
	}


/* [functions]                     Obsolètes                                  */
function deleteEnchantement()
{
	try
	{
	var idEquipement = this.getAttribute('name');
	MY_removeValue(numTroll+".enchantement."+idEquipement+".objet");
	MY_removeValue(numTroll+".enchantement."+idEquipement+".enchanteur");
	MY_removeValue(numTroll+".enchantement."+idEquipement+".composant.0");
	MY_removeValue(numTroll+".enchantement."+idEquipement+".composant.1");
	MY_removeValue(numTroll+".enchantement."+idEquipement+".composant.2");
	var listeEquipement = MY_getValue(numTroll+".enchantement.liste").split(";");
	var string = "";
	for(var i=0;i<listeEquipement.length;i++)
	{
		if(listeEquipement[i]!=idEquipement)
			if(string=="")
				string = listeEquipement[i];
			else
				string += ";"+listeEquipement[i];
	}
	if(string=="")
	{
		MY_removeValue(numTroll+".enchantement.liste");
		var table = this.parentNode.parentNode.parentNode.parentNode;
		var parent = table.parentNode;
		for(var i=0;i<parent.childNodes.length;i++)
		{
			if(parent.childNodes[i]==table)
			{
				parent.removeChild(parent.childNodes[i-1]);
				parent.removeChild(parent.childNodes[i-1]);
				parent.removeChild(parent.childNodes[i-1]);
				break;
			}
		}
	}
	else
	{
		MY_getValue(numTroll+".enchantement.liste",string);
		this.parentNode.parentNode.parentNode
			.removeChild(this.parentNode.parentNode);
	}
	}
	catch(e)
	{
		window.alert(e);
	}
}
/* [functions]                     fin Obsolètes                                  */

/*-[functions]---------------- Partie principale -----------------------------*/

function do_option() {
	start_script(712);
	var insertPoint = document.getElementById('footer1');
	if (!insertPoint) insertPoint = document.getElementById('footer');	// mode smartphone
	insertBefore(insertPoint,document.createElement('p'));
	var ti = insertTitle(insertPoint,'Mountyzilla : Options');	// 02/02/2017 SHIFT-Click pour copier la conf
	ti.onclick = function (e) {
		var evt = e || window.event;
		if (evt.shiftKey) {
			var txt = '';
			for ( var i = 0, len = localStorage.length; i < len; ++i ) {
				var k = localStorage.key(i);
				if (k.match(/INFOSIT/i)) continue;	// masquer le mdp Bricol'Troll
				txt += k + "\t" + localStorage.getItem(k) + "\n";
			}
			copyTextToClipboard(txt);
			window.alert('La configuration MZ a été copiée dans le presse-papier (sauf le mot de passe Bricol\'Trõll)');
		} else if (evt.ctrlKey) {
			var tabK= [];
			var sMatch = numTroll + '.';
			var lMatch = sMatch.length;
			for (var i = 0, len = localStorage.length; i < len; ++i ) {
				var k = localStorage.key(i);
				if (k.substring(0, lMatch) == sMatch) tabK.push(k);
			}
			for (var i = 0; i < tabK.length; ++i ) {
				MY_removeValue(tabK[i]);
			}
			window.alert(tabK.length + ' informations locales du Trõll ' + numTroll + ' ont été effacées-' + sMatch + '-' + lMatch);
		}
	}
	ti.title = 'Version ' + GM_info.script.version;
	insertOptionTable(insertPoint);
	/* insertion enchantements ici
	if(...)
	insertEnchantementTable();
	*/
	insertBefore(insertPoint,document.createElement('p'));
	var ti = insertTitle(insertPoint,'Mountyzilla : Crédits');	// 23/12/2016 SHIFT-Click pour passer en mode dev
	ti.onclick = function (e) {
		var evt = e || window.event;
		if (!evt.shiftKey) return;
		var oldDev = MY_getValue('MZ_dev');
		if (oldDev) {
			MY_removeValue('MZ_dev');
		} else {
			alert('passage en mode DEV, shift-click sur le mot "Crédits" pour revenir en mode normal');
			MY_setValue('MZ_dev', 1);
		}
		document.location.href = document.location.href;
	}
	insertCreditsTable(insertPoint);
	insertBefore(insertPoint,document.createElement('p'));

	/* [zone]                     Obsolète ??                                  */
	if(MY_getValue(numTroll+".enchantement.liste")
		&& MY_getValue(numTroll+".enchantement.liste")!="" )
	{
		insertTitle(insertPoint, 'Les Enchantements en cours');
		table = document.createElement('table');
		table.setAttribute('width', '98%');
		table.setAttribute('border', '0');
		table.setAttribute('align', 'center');
		table.setAttribute('cellpadding', '2');
		table.setAttribute('cellspacing', '1');
		table.setAttribute('class', 'mh_tdborder');

		tbody = document.createElement('tbody');
		table.appendChild(tbody);

		tr = appendTr(tbody, 'mh_tdtitre');
		appendTdText(tr, 'Equipement',1);
		appendTdText(tr, 'Composants',1);
		appendTdText(tr, 'Enchanteur',1);
		appendTdText(tr, 'Action',1);

		var listeEquipement = MY_getValue(numTroll+".enchantement.liste").split(";");
		for(var i=0;i<listeEquipement.length;i++)
		{
			try
			{
				var idEquipement = listeEquipement[i];
				var nomEquipement = MY_getValue(numTroll+".enchantement."
					+idEquipement+".objet");
				var infoEnchanteur = MY_getValue(numTroll+".enchantement."
					+idEquipement+".enchanteur").split(";");
				var ul = document.createElement('UL');
				for(var j=0;j<3;j++)
				{
					var k = numTroll+'.enchantement.'+idEquipement+'.composant.'+j;
					var v = MY_getValue(k);
					if (v == null) { 	// protection Roule 26/08/2017
						window.console.log('[MZ] err infoComposant k=' + k + ', v is null');
						continue;
					}
					var infoComposant = v.split(';');
					if (infoComposant.length < 5) {	// protection Roule 25/08/2017
						window.console.log('[MZ] err infoComposant k=' + k + ', v=' + v);
						continue;
					}
					var texte = infoComposant[4].replace("Ril ","Œil ");
					for(var k=5;k<infoComposant.length;k++)
					{
						texte += ";"+infoComposant[k].replace("Ril ","Œil ");
					}
					li = appendLI(ul,texte);
					var string = '<form action="' + URL_troc_mh + '" method="post" TARGET = "_blank">';
					string+= '<input type="hidden" name="monster" value="'+infoComposant[2]+'" />';
					string+= '<input type="hidden" name="part" value="'+infoComposant[0]+'" />';
					string+= '<input type="hidden" name="qualite" value="'+(getQualite(infoComposant[3])+1)+'" />';
					string+= '<input type="hidden" name="q" value="min" />';
					string+= '<input type="submit" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" name="enter" value="Rechercher sur le Troc de l\'Hydre" />';
					string+= ' &nbsp; <input type="button" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" onClick="javascript:window.open(&quot;' + URL_cyclotrolls + 'wakka.php?wiki=TroOGle&trooglephr=base%3Amonstres+tag%3Anom+%22'+infoComposant[2]+'%22&quot;)" value="Localiser le monstre grâce à Troogle" /></form>';

					string+= '</form>';
	//				string += '<form action="http://www.cyclotrolls.be/wakka.php" method="get" TARGET = "_blank">';
	//				string+= '<input type="hidden" name="wiki" value="TroOGle" />';
	//				string+= '<input type="hidden" name="trooglephr" value="base:monstres tag:nom &quot;'+infoComposant[2]+'&quot;" />';
	//				string+= '<input type="submit" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" name="enter" value="Localiser grâce à Troogle" /></form>';
					li.innerHTML += string;
				}
				tr = appendTr(tbody, 'mh_tdpage');

				td = appendTdText(tr, nomEquipement);
				td.setAttribute('valign', 'center');

				td = document.createElement('td');
				td.appendChild(ul);
				tr.appendChild(td);
				td.setAttribute('valign', 'center');

				td = appendTdText(tr, "Enchanteur n°"+infoEnchanteur[0]+" ("+infoEnchanteur[1]+"|"+infoEnchanteur[2]+"|"+infoEnchanteur[3]+")");
				td.setAttribute('valign', 'center');

				td = document.createElement('td');
				input = appendButton(td, 'Supprimer l\'enchantement', deleteEnchantement);
				input.setAttribute('name', idEquipement);
				tr.appendChild(td);
				td.setAttribute('valign', 'center');
			}
			catch(e)
			{
			}
		}
		insertBefore(insertPoint, table);
		insertBefore(insertPoint, document.createElement('p'));
	}
	/* [zone]                     fin Obsolète ??                                  */


	displayScriptTime();
}

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x equip

/**
 * 2014-02-08 - v2.0a (from scratch)
 * 2014-02-18 - v2.0a0
 * - ajout calcul Carats / UM des minerais + totaux
 * 2014-03-06 - v2.0a1
 * - retour Infos EM des Champis
 * TODO
 * Ces fonctions sont dev ici en test, à terme elles seront à intégrer dans libs
 */

function traiteChampis() {
	try{
		var tr = document.getElementById('mh_objet_hidden_Champignon');
		var trlist = document.evaluate('./td/table/tbody/tr', tr, null, 7, null);
		}
	catch(e){return;}
	if(trlist.length<=0) return;
	for(var i=0 ; i<trlist.snapshotLength ; i++) {
		var node = trlist.snapshotItem(i).childNodes[7];
		var str = node.textContent.trim();
		var type = str.slice(0,str.lastIndexOf(' '));
		var mundi = mundiChampi[type];
		if(!mundi) continue;
		var urlImg = URL_MZimg
			+'Competences/ecritureMagique.png';
		var img = createAltImage(urlImg,'EM','Mundidey '+mundi);
		appendText(node,' ');
		node.appendChild(img);
		}
	}

function traiteCompos() {
	try {
		var tr = document.getElementById('mh_objet_hidden_Composant');
		var tbody = document.evaluate("./td/table/tbody",
			tr, null, 9, null).singleNodeValue;
		}
	catch(e) {return;}
	insererInfosEM(tbody);
	}

function traiteMinerai() {
	try{
		var tr = document.getElementById('mh_objet_hidden_Minerai');
		var trlist = document.evaluate('./td/table/tbody/tr', tr, null, 7, null);
		}
	catch(e){return;}
	if(trlist.length<=0) return;
	var totaux = {};
	var str;
	for(var i=0 ; i<trlist.snapshotLength ; i++) {
		var node = trlist.snapshotItem(i);
		var nature = node.childNodes[7].textContent,
			caracs = node.childNodes[9].textContent;
		var taille = Number(caracs.match(/\d+/)[0]);
		var coef = 1;
		if(caracs.indexOf('Moyen')!=-1) coef = 2;
		else if(caracs.indexOf('Normale')!=-1) coef = 3;
		else if(caracs.indexOf('Bonne')!=-1) coef = 4;
		else if(caracs.indexOf('Exceptionnelle')!=-1) coef = 5;
		if(nature.indexOf('Mithril')!=-1) {
			coef = 0.2*coef;
			str = ' | UM: ';
			}
		else {
			coef = 0.75*coef+1.25;
			if(nature.indexOf('Taill')!=-1) coef = 1.15*coef;
			str = ' | Carats: ';
			}
		var carats = Math.round(taille*coef)
		appendText(node.childNodes[9], str+carats );
		if(!totaux[nature]) {
			totaux[nature] = [taille,carats];
			}
		else {
			totaux[nature][0] += taille;
			totaux[nature][1] += carats;
			}
		}
	str = 'Total : ';
	for(var nature in totaux) {
		if(str.length>8) str += ', ';
		if(nature.indexOf('Mithril')!=-1) {
			str += nature+totaux[nature][1]+' UM';
			}
		else {
			str += nature+totaux[nature][0]+'U/'
				+totaux[nature][1]+'c';
			}
		}
	/*var node = document.getElementById('mh_plus_Minerai');
	var titre = document.evaluate("./td[contains(./b/text(),'Minerai')]",
		node.parentNode.parentNode.parentNode, null, 9, null).singleNodeValue;
	if(!titre) return;*/
	// Il faut préalablement injecter du CSS pour ne pas hériter de 'mh_titre3'
	var td = appendTdText(trlist.snapshotItem(0).parentNode, '('+str+')');
	td.colSpan = 7;
	}

function do_equip() {
	start_script();

	traiteChampis();
	traiteCompos();
	traiteMinerai();

	displayScriptTime();
}

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x diplo

/*
TODO:
 V Étape 1: Gestion comme actuellement, avec 2 couleurs (amis/ennemis)
 V Étape 2: Gestion couleurs par catégorie (10 couleurs)
 V Étape 3: Ajout de la diplo perso
 X Étape 4: Gestion distante (sécurisée par mdp) de cette option
 V Étape 5: Ajout des fioritures (preview de la couleur...)

 Options Globales:
 Actuelles:
 	numTroll.USECSS,
 	numTroll.NODIPLO
 	NOMYTH
 Nouvelles:
 	TODO numTroll.USECSS
 	numTroll.diplo.off (remplace NODIPLO)
 	numTroll.diplo.guilde
 	numTroll.diplo.perso

 Structure de diplo.guilde:
 isOn: 'true' ou 'false'
 isDetailOn: 'true' ou 'false'
 guilde
 	> id
 	> couleur
 AllAmis,AllEnnemis: couleur
 Amis0,...,Ennemis5
 	> Troll: idTroll1;...;
 	> Guilde: idGuilde1;...;
 	> titre
 	> couleur

 Structure de diplo.perso:
 isOn: 'true' ou 'false'
 mythiques: couleur
 Troll,Guilde,Monstre:
 	> id
 	> couleur
 	> description
*/

/*-[functions]-------------- Fonctions utilitaires ---------------------------*/

function couleurAleatoire() {
	var alph = '0123456789ABCDEF'.split('');
	var clr = '#';
	for (var i=0; i<6; i++) {
		clr+=alph[ Math.floor(16*Math.random()) ];
	}
	return clr;
}

function isCouleur(str) {
	return /^#[0-9A-F]{6}$/i.test(str);
}

/*-[functions]---------------- Analyse de la page ----------------------------*/

function appendChoixCouleur(node,id) {
	var span = document.createElement('span');
	span.id = 'span'+id;
	if(isDetailOn) {
		span.style.display = 'none';
	}
	var couleur = id=='AllAmis'?'#AAFFAA':'#FFAAAA';
	if(diploGuilde[id]) {
		couleur = diploGuilde[id];
	}
	appendText(span,' - Couleur HTML: ');
	var input = appendTextbox(span,'text',id,7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	node.appendChild(span);
}

function insertChoixCouleur(node,id) {
	var span = document.createElement('span');
	span.id = 'span'+id;
	// La couleur détaillée passera à une valeur aléatoire
	// si toggle vers isDetailOn
	var couleur = couleurAleatoire();
	if(!isDetailOn) {
		span.style.display = 'none';
	} else if(diploGuilde[id]) {
		couleur = diploGuilde[id].couleur;
	}
	appendText(span,' - Couleur HTML: ');
	var input = appendTextbox(span,'text',id,7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	insertBefore(node,span);
}

function setChoixCouleurs() {
	try {
		//var form = document.getElementsByName('ActionForm')[0];
		var form = document.getElementById('mhPlay');
		var nodesAE = document.evaluate(
			//"./table/tbody/tr/td[@class='mh_tdtitre']",
			"./table/tbody/tr/th[@class='mh_tdtitre']",
			//"./table/tbody/tr[@class='mh_tdtitre']/th",
			form, null, 7, null
		);
		var nodes = document.evaluate(
			//"./table/tbody/tr/td[not(@class='mh_tdtitre')]",
			"./table/tbody/tr[not(@class='mh_tdtitre')]/td",
			form, null, 7, null
		);
	} catch(e) {
		window.console.error(traceStack(e, 'Diplomatie Structure de la page non reconnue'));
		return false;
	};
	nodesAE.snapshotItem(0).parentNode.id = 'insertPt';
	appendChoixCouleur(nodesAE.snapshotItem(0),'AllAmis');
	appendChoixCouleur(nodesAE.snapshotItem(1),'AllEnnemis');
	for(var i=0 ; i<5 ; i++) {
		nodes.snapshotItem(i).id = 'tdAmis'+i;
		insertChoixCouleur(nodes.snapshotItem(i).childNodes[1],'Amis'+i);
		nodes.snapshotItem(i+5).id = 'tdEnnemis'+i;
		insertChoixCouleur(nodes.snapshotItem(i+5).childNodes[1],'Ennemis'+i);
	}
	return true;
}

function fetchDiploGuilde() {
	try {
		for(var AE in {Amis:0,Ennemis:0}) {
			for(var i=0 ; i<5 ; i++) {
				/* Récup des A/E de rang i */
				var td = document.getElementById('td'+AE+i);
				var ligne = td.getElementsByTagName('table')[0].rows;
				var titre = trim(td.firstChild.textContent);
				// On laisse la gestion des couleurs à setChoixCouleurs:
				var couleur = document.getElementById(AE+i).value;
				diploGuilde[AE+i] = {
					Troll:'',
					Guilde:'',
					titre: titre,
					couleur: couleur
				};
				for(var j=1 ; j<ligne.length ; j++) {
					var str = trim(ligne[j].cells[0].textContent);
					var idx = str.lastIndexOf('(');
					var num = str.slice(idx+1,-1);
					var type = trim(ligne[j].cells[1].textContent);
					diploGuilde[AE+i][type] += num+';';
				}
			}
		}
	} catch(e) {
		window.console.error(traceStack(e, 'Diplomatie récupération de la diplo'));
		return false;
	}
	return true;
}


/*-[functions]--------------------- Handlers ---------------------------------*/

function toggleDetails() {
	isDetailOn = !isDetailOn;
	for(var AE in {Amis:0,Ennemis:0}) {
		document.getElementById('spanAll'+AE).style.display =
			(isDetailOn?'none':'');
		for(var i=0 ; i<5 ; i++) {
			document.getElementById('span'+AE+i).style.display =
				(isDetailOn?'':'none');
		}
	}
}

function toggleMythiques() {
	isMythiquesOn = !isMythiquesOn;
	document.getElementById('spanMythiques').style.display =
		(isMythiquesOn?'':'none');
}

function previewCouleur() {
	var value = this.value;
	if(isCouleur(value)) {
		this.style.backgroundColor = value;
		this.title = '';
	} else {
		this.style.backgroundColor = '';
		this.title = 'Entrez une couleur au format #789ABC pour prévisualiser';
	}
}

function appendMenuType(node,duType) {
	var select = document.createElement('select');
	select.className = 'SelectboxV2';
	var type = ['Guilde','Troll','Monstre'];
	for(var i=0 ; i<3 ; i++) {
		appendOption(select,type[i],type[i]);
		if(type[i]==duType) { select.selectedIndex=i; }
	}
	node.appendChild(select);
}

function ajouteChamp(type,num,couleur,descr) {
	var champs = document.getElementById('diploPerso');
	var nb = champs.rows.length;
	var tr = champs.insertRow(-1);
	var td = appendTd(tr);
	appendMenuType(td,type);
	td = appendTd(tr);
	appendText(td,' n°');
	appendTextbox(td,'text','num'+nb,6,15,num);
	td = appendTd(tr);
	appendText(td,' couleur HTML:');
	var input = appendTextbox(td,'text','couleur'+nb,7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	td = appendTd(tr);
	appendText(td,' Description:');
	appendTextbox(td,'text','descr'+nb,30,150,descr);
	td = appendTd(tr);
	var span = document.createElement('span');
	appendText(span,'[ok!]',true);
	span.style.visibility = 'hidden';
	td.appendChild(span);
	td = appendTd(tr);
	var bouton = appendButton(td,'Suppr.',retireCeChamp);
}

function retireCeChamp() {
	var thisTr = this.parentNode.parentNode;
	thisTr.parentNode.removeChild(thisTr);
	var champs = document.getElementById('diploPerso');
	if(champs.rows.length==0) { ajouteChamp(); }
}

function valideChamp(champ) {
	var isValide = /^\d+$/.test(champ.cells[1].childNodes[1].value) &&
		isCouleur(champ.cells[2].childNodes[1].value);
	if(isValide) {
		champ.cells[4].firstChild.style.visibility = 'visible';
	} else {
		champ.cells[4].firstChild.style.visibility = 'hidden';
	}
	return isValide;
}

function sauvegarderTout() {
	/* Diplo de guilde */
	diploGuilde.isOn =
		document.getElementById('isGuildeOn').checked?'true':'false';
	diploGuilde.isDetailOn = (isDetailOn?'true':'false');
	var numGuilde = Number(document.getElementById('numGuilde').value);
	var couleur = document.getElementById('couleurGuilde').value;
	if(numGuilde) {
		diploGuilde.guilde = {
			id: numGuilde,
			couleur: couleur
		};
	} else {
		delete diploGuilde.guilde;
	}
	for(var AE in {Amis:0,Ennemis:0}) {
		diploGuilde['All'+AE] = document.getElementById('All'+AE).value;
		for(var i=0 ; i<5 ; i++) {
			if(isDetailOn) {
				diploGuilde[AE+i].couleur = document.getElementById(AE+i).value;
			} else {
				diploGuilde[AE+i].couleur = diploGuilde['All'+AE];
			}
		}
	}
	MY_setValue(numTroll+'.diplo.guilde',JSON.stringify(diploGuilde));

	/* Diplo personnelle (ex-fonction saveChamps) */
	var champs = document.getElementById('diploPerso');
	diploPerso = {
		isOn: document.getElementById('isPersoOn').checked?'true':'false',
		Guilde: {},
		Troll: {},
		Monstre: {}
	};
	if(isMythiquesOn &&
		isCouleur(document.getElementById('couleurMythiques').value)) {
		diploPerso.mythiques = document.getElementById('couleurMythiques').value;
	}
	for(var i=0 ; i<champs.rows.length ; i++) {
		if(valideChamp(champs.rows[i])) {
			var type = champs.rows[i].cells[0].firstChild.value;
			var num = champs.rows[i].cells[1].childNodes[1].value;
			var couleur = champs.rows[i].cells[2].childNodes[1].value;
			var descr = champs.rows[i].cells[3].childNodes[1].value;
			diploPerso[type][num] = {
				couleur: couleur
			};
			if(descr) {
				diploPerso[type][num].titre = descr;
			}
		}
	}
	MY_setValue(numTroll+'.diplo.perso',JSON.stringify(diploPerso));

	avertissement('Données sauvegardées');
}


/*-[functions]------------- Modifications de la page -------------------------*/

function creeTablePrincipale() {
	var insertPt = document.getElementById('insertPt');

	/* Titre + bouton de Sauvegarde */
	var tr = insertTr(insertPt,'mh_tdtitre');
	var td = appendTdText(tr,'[Mountyzilla] Options de Diplomatie ',true);
	appendButton(td,'Sauvegarder',sauvegarderTout);

	/* Options fixes */
	tr = insertTr(insertPt,'mh_tdpage');
	td = appendTdText(tr,'Diplomatie de guilde:',true);
	appendBr(td);
	appendCheckBox(td,'isGuildeOn',diploGuilde.isOn!='false');
	appendText(td,'Afficher la diplomatie de guilde dans la Vue');
	appendBr(td);
	appendCheckBox(td,'detailOn',isDetailOn,toggleDetails);
	appendText(td,'Utiliser des couleurs détaillées (10)');

	/* Diplo personnelle */
	tr = insertTr(insertPt,'mh_tdpage');
	td = appendTdText(tr,'Diplomatie personnelle:',true);
	appendBr(td);
	// Diplo Mythiques
	appendCheckBox(td,'isMythiquesOn',isMythiquesOn,toggleMythiques);
	appendText(td,'Ajouter les monstres Mythiques à la Diplomatie');
	var span = document.createElement('span');
	span.id = 'spanMythiques';
	if(!isMythiquesOn) {
		span.style.display = 'none';
	}
	var couleur = '#FFAAAA';
	if(diploPerso.mythiques) {
		couleur = diploPerso.mythiques;
	}
	appendText(span,' - couleur HTML:');
	var input = appendTextbox(span,'text','couleurMythiques',7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	td.appendChild(span);
	appendBr(td);
	// Diplo éditable
	appendCheckBox(td,'isPersoOn',diploPerso.isOn!='false');
	appendText(td,'Afficher la diplomatie personnelle dans la Vue:');
	appendBr(td);
	var table = document.createElement('table');
	table.id = 'diploPerso'
	td.appendChild(table);
	for(var type in {Guilde:0,Troll:0,Monstre:0}) {
		for(var num in diploPerso[type]) {
			ajouteChamp(
				type,
				num,
				diploPerso[type][num].couleur,
				diploPerso[type][num].titre
			);
		}
	}
	if(table.rows.length==0) {
		ajouteChamp();
	}
	appendButton(td,'Ajouter',ajouteChamp)
	// Prévisualisation couleurs (merci à Vys d'avoir implémenté ça xD)
	appendText(td,' ');
	appendButton(td,
		'Exemples de couleur',
		function() {
			var fenetre = window.open(
				'/mountyhall/MH_Play/Options/Play_o_Color.php',
				'Divers',
				'width=500,height=550,toolbar=0,location=0,directories=0,'+
				'status=0,menubar=0,resizable=1,scrollbars=1'
			);
			fenetre.focus();
		}
	);

	/* Couleur de Guilde */
	tr = insertTr(insertPt,'mh_tdtitre');
	td = appendTdText(tr,'GUILDE',true);
	appendText(td,' - n°');
	appendTextbox(td,'text','numGuilde',5,10,
		diploGuilde.guilde && diploGuilde.guilde.id ?
			diploGuilde.guilde.id : ''
	);
	appendText(td,' - Couleur HTML: ');
	var input = appendTextbox(td,'text','couleurGuilde',7,7,
		diploGuilde.guilde && diploGuilde.guilde.couleur ?
			diploGuilde.guilde.couleur : '#BBBBFF'
	);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
}


/*-[functions]----------------------- Main -----------------------------------*/

function initDiplo(sType) {
	var sDiplo = MY_getValue(numTroll + '.diplo.' + sType)
	//console.log('sDiplo' + sType + '=' + sDiplo);
	if (sDiplo && (sDiplo != 'null')) {	// le stockage JSON nous donne parfois 'null'
		return JSON.parse(sDiplo);
	} else {
		return {};
	}
}
var diploGuilde = initDiplo('guilde');
var diploPerso = initDiplo('perso');
var isDetailOn = diploGuilde.isDetailOn=='true';
var isMythiquesOn = diploPerso.mythiques!=undefined;

function do_diplo() {
	if(setChoixCouleurs() && fetchDiploGuilde()) {
		creeTablePrincipale();
	}
}

/*******************************************************************************
*   This file is part of Mountyzilla.                                          *
*                                                                              *
*   Mountyzilla is free software; you can redistribute it and/or modify        *
*   it under the terms of the GNU General Public License as published by       *
*   the Free Software Foundation; either version 2 of the License, or          *
*   (at your option) any later version.                                        *
*                                                                              *
*   Mountyzilla is distributed in the hope that it will be useful,             *
*   but WITHOUT ANY WARRANTY; without even the implied warranty of             *
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              *
*   GNU General Public License for more details.                               *
*                                                                              *
*   You should have received a copy of the GNU General Public License          *
*   along with Mountyzilla; if not, write to the Free Software                 *
*   Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA *
*******************************************************************************/

// x~x cdmcomp

//var cdm = '';	// Roule 11/03/2017 une variable globale de moins \o/

function getNonNegInts(str) {
	var nbrs = str.match(/\d+/g);
	for(var i=0 ; i<nbrs.length ; i++) {
		nbrs[i] = Number(nbrs[i]);
	}
	return nbrs;
}

function MZ_comp_traiteCdMcomp() {
	// envoi au serveur (PHP) d'un objet avec
	//	cmd:	un tableau de chaines (éléments HTML <p>) ou de tableaux (les <TD> des lignes des tableaux HTML)
	//	tstamp:	l'horodatage
	var oContexteCdM = MZ_analyseCdM('msgEffet', true);	// analyse de la CdM, prépare l'envoi, prépare l'ajout de PV min/max selon blessure
	oContexteCdM.nameBut = 'as_Action';	// nom du bouton avant lequel insérer le bouton ou les textes
	if (!oContexteCdM.ok) {
		if (!oContexteCdM.error) oContexteCdM = MZ_analyseCdM('msgDiv', true);
		if (!oContexteCdM.ok) {
			if (oContexteCdM.error) {
				window.console.log('MZ_comp_traiteCdMcomp, ' + oContexteCdM.error);
				MZ_comp_addMessage(oContexteCdM, 'Erreur MZ, ' + oContexteCdM.error);
			}
			return;
		}
	}
	if (MY_DEBUG) window.console.log('oData=' + JSON.stringify( oContexteCdM.oData));

	MZ_comp_addPvRestant(oContexteCdM);

	var etimestamp = document.getElementById('hserveur');
	if (etimestamp != undefined) {var tstamp =  etimestamp.innerText || etimestamp.textContent;}
	if (tstamp == undefined) {
		/* dans le cas de la comp, le serveur se repliera sur la date/heure courante
		window.console.log('MZ_comp_traiteCdMcomp, pas de date/heure');
		MZ_comp_addMessage(oContexteCdM, 'Impossible d\'envoyer la CdM à MZ, pas de date/heure');
		return;
		*/
	} else {
		oContexteCdM.oData.tstamp = tstamp.replace(/\]/, '').trim();
	}

	// Envoi auto ou insertion bouton envoi (suivant option)
	if(MY_getValue(numTroll+'.AUTOCDM')=='true') {
		oContexteCdM.sendInfoCDM();
		MZ_comp_addMessage(oContexteCdM, 'CdM envoyée vers la base MountyZilla !');
	} else {
		insertButtonCdm('as_Action', oContexteCdM.sendInfoCDM);
	}
}

function MZ_comp_addMessage(oContexteCdM, msg) {
	var eBefore = document.getElementsByName(oContexteCdM.nameBut)[0].parentNode;
	if (!eBefore) {
		window.console.log('MZ_comp_addMessage, pas de ' + oContexteCdM.nameBut);
		return;
	}
	var p = document.createElement('p');
	p.style.color = 'green';
	appendText(p, msg);
	insertBefore(eBefore, p);
}

function MZ_analyseCdM(idHTMLCdM, bIgnoreEltAbsent) {	// rend un contexte
	var eltCdM = document.getElementById(idHTMLCdM);
	var oRet = {};
	if (!eltCdM) {
		oRet.ok = false;
		if (!bIgnoreEltAbsent) oRet.error = 'Pas d\'elt ' + idHTMLCdM;
		return oRet;
	}

	// le contexte contiendra
	// txtHeure : le texte de l'heure de la CdM
	// trBlessure : le <tr> de la ligne "blessure"
	// txtBlessure : le texte donnant le % de blessure
	// txtPv : le texte donnant les PV
	// ok : 1 si on a bien reconnu une CdM
	// oData : les data à envoyer en JSON au serveur MZ
	oRet.oData = {}
	oRet.oData.tabCdM = new Array();
	for (var iElt = 0; iElt < eltCdM.childNodes.length; iElt++) { //eHTML of msgEffet.childNodes) { for...of pas supporté par IE et Edge
		var eHTML = eltCdM.childNodes[iElt];
		var s = undefined;
		switch (eHTML.nodeName) {
			case '#text':
				s = eHTML.nodeValue;
				// suite : même code que <B> ou <p>
			case 'P':
			case 'B':
				if (s === undefined) s = eHTML.innerText || eHTML.textContent;	// récupération du contenu texte d'un élément HTML
				s = s.trim();
				if (s != '') {
					if (s.match(/aux *alentours* *de/i)) oRet.txtHeure = s;
					if (s.match(/Connaissance *des* *Monstres/i)) oRet.ok = true;
					oRet.oData.tabCdM.push(s);
				}
				break;
			case 'TABLE':
				var s = 'table';
				for (var iTr = 0; iTr < eHTML.rows.length; iTr++) {	// eTr of eHTML.rows) {
					var eTr = eHTML.rows[iTr];
					var tabTd = new Array();
					for (var iTd = 0; iTd < eTr.cells.length; iTd++) {	//eTd of eTr.cells) {
						var eTd = eTr.cells[iTd];
						var s = eTd.innerText || eTd.textContent;	// récupération du contenu texte d'un élément HTML
						s = s.trim();
						tabTd.push(s);
					}
					if (tabTd.length >= 2) {
						if (tabTd[0].match(/Blessure/i)) {
							oRet.trBlessure = eTr;
							oRet.txtBlessure = tabTd[1]
						} else if (tabTd[0].match(/Points* *de *Vie/i)) {
							oRet.txtPv = tabTd[1]
						}
					}
					oRet.oData.tabCdM.push(tabTd);
				}
				break;
			case 'BR':
				break;	// ignore
			default:
				var s = eHTML.innerText || eHTML.textContent;	// récupération du contenu texte d'un élément HTML
				if (s != '') oRet.oData.tabCdM.push(s);
				window.console.log('[MZ ' + GM_info.script.version + '] MZ_analyseCdM, type d\'élément non traité : ' + eHTML.nodeName + ' ' + s);
				break;
		}
	}
	oRet.oData.idTroll = numTroll;

	// préparation de l'envoi d'une CdM issue de compte-rendu de compétence
	// fonction définie ici pour avoir vue sur la variable tabCdM
	oRet.sendInfoCDM = function () {
		MY_setValue('CDMID', 1+parseInt(MY_getValue('CDMID')) );
		var buttonCDM = this;
		var texte = '';
		FF_XMLHttpRequest({
			method: 'POST',
			url: URL_pageDispatcherV2,
			data: 'cdm_json=' + encodeURIComponent(JSON.stringify(oRet.oData)),
			headers : {
				'Content-type':'application/x-www-form-urlencoded',
			},
			trace: 'envoi CdM',
			onload: function(responseDetails) {
				texte = responseDetails.responseText;
				buttonCDM.value = texte;
				//window.console.log('buttonCDM.parentNode.firstChild.nodeName=' + buttonCDM.parentNode.firstChild.nodeName);
				if (buttonCDM.parentNode && buttonCDM.parentNode.firstChild && buttonCDM.parentNode.firstChild.nodeName == 'SPAN') {	// smartphone
					buttonCDM.parentNode.firstChild.innerHTML = texte;
				}
				if (!isDEV) buttonCDM.disabled = true;
			},
			onerror: function(responseDetails) {
				var msgError = 'inconnue';
				if (responseDetails.status == 0) msgError = ' HTTPS ou CORS'
				if (responseDetails.error) msgError = responseDetails.error;
				msgError = 'Erreur MZ ' + msgError;
				buttonCDM.value = msgError;
				if (buttonCDM.parentNode.firstChild.nodeName == 'SPAN') {	// smartphone
					buttonCDM.parentNode.firstChild.innerHTML = msgError;
				}
			},
		});
	}
	return oRet;
}

function MZ_comp_addPvRestant(oContexteCdM) {
	// Insertion de l'estimation des PV restants
	if (MY_DEBUG) window.console.log('txtBlessure=' + oContexteCdM.txtBlessure + ', txtPv=' + oContexteCdM.txtPv);
	if (oContexteCdM.txtBlessure === undefined || oContexteCdM.txtPv === undefined) return;
	var pv = getPVsRestants(oContexteCdM.txtPv, oContexteCdM.txtBlessure);
	if (MY_DEBUG) window.console.log('pv=' + pv);
	if (!pv) return;	// pv null si le monstre n'est pas blessé
	var tr = document.createElement('tr');
	oContexteCdM.trBlessure.parentNode.insertBefore(tr, oContexteCdM.trBlessure.nextSibling);
	var th = appendThText(tr, pv[0], false);
	th.className = oContexteCdM.trBlessure.cells[0].className;
	var td = appendTdText(tr, pv[1], false);
	var eSpan = document.createElement('span');
	appendText(eSpan, ' (Calculé par Mountyzilla)');
	eSpan.style.fontSize = "small";
	eSpan.style.fontStyle = "italic";
	td.appendChild(eSpan);
}

function do_cdmcomp() {
	start_script(31);
	MZ_comp_traiteCdMcomp();
	displayScriptTime();
}

/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

// x~x cmdbot

/* v0.2 by Dab - 2013-08-20
 * - patch dégueu pour gérer la décomposition P/M de l'armure
 */

var buttonCDM;

/*******************************************************************************************
CDM :
Vous avez RÉUSSI à utiliser cette compétence au niveau 5 : jet de 34 sur 95 %.

Il ne vous est pas possible d'améliorer cette compétence.

Le Monstre Ciblé fait partie des : Mort-Vivant (Archi-Nécromant [Antique] - N°4571589)
Niveau :	Inimaginable (entre 49 et 51)
Points de Vie :	Surtrollesque (entre 450 et 470)
Blessure (Approximatif) :	0 %
Dés d'Attaque :	Impressionnant (entre 30 et 32)
Dés d'Esquive :	Impressionnant (entre 28 et 30)
Dés de Dégat :	Très Fort (entre 18 et 20)
Dés de Régénération :	Excellent (égal à 13)
Armure Physique :	Moyen (entre 10 et 12)
Armure Magique :	Faible (inférieur à 6)
Vue :	Moyen (entre 9 et 11)
Maitrise Magique :	Inimaginable (supérieur à 6000)
Résistance Magique :	Inimaginable (supérieur à 6000)
Nombre d'attaques :	1
Vitesse de Déplacement :	Normale
Voir le Caché :	Oui
Attaque à distance :	Non
Attaque magique :	Oui
Vole :	Non
Sang froid :	Inexistant
DLA :	Milieu
Durée Tour :	Remarquable (entre 9 et 11)
Chargement :	Vide
Bonus Malus :	Aucun

Vous avez également gagné 1 PX pour la réussite.
*******************************************************************************************
BOT :
Vous avez utilisé CONNAISSANCE DES MONSTRES sur un Capitan Ronfleur [Naissant] (4768960)

Le Monstre ciblé fait partie des : Mort-Vivant

Niveau : Incroyable (entre 36 et 38)
*******************************************************************************************/

function getNNInt(str) {
	var nbrs = str.match(/\d+/g);
	for (var i=0 ; i<nbrs.length ; i++)
		nbrs[i] = parseInt(nbrs[i]);
	return nbrs;
	}

	// envoi d'une CdM issue d'un message du BOT
function sendCDM() {
	var td = document.evaluate("//td/text()[contains(.,'CONNAISSANCE DES MONSTRES')]/..",
								document, null, 9, null).singleNodeValue;
	/* ancienne version à supprimer
	cdm = td.innerHTML;
	cdm = cdm.replace(/.* MONSTRES sur une? ([^(]+) \(([0-9]+)\)(.*partie des : )([^<]+)<br>/,
						"$3$4 ($1 - N°$2)<br>");
	cdm = cdm.replace(/Blessure :[\s]*[0-9]+ % \(approximativement\)/,
						'Blessure : XX % (approximativement)');
	// Supprime la décomposition P/M de l'Armure
	var bgn = cdm.indexOf('Armure Physique');
	if (bgn!=-1) {
		var end = cdm.indexOf('Vue')-2;
		var lines = cdm.substring(bgn,end).split('<br>');
		var armp = getNNInt(lines[0]);
		var armm = getNNInt(lines[1]);
		if (lines[0].indexOf('(inf')!=-1)
			armp = [0,armp[0]];
		if (lines[1].indexOf('(inf')!=-1)
			armm = [0,armm[0]];
		var insrt = 'Armure : ';
		if (lines[0].indexOf('(sup')!=-1 || lines[1].indexOf('(sup')!=-1)
			insrt += 'adj (supérieur à '+(armp[0]+armm[0]);
		else
			insrt += 'adj (entre '+(armp[0]+armm[0])+' et '+(armp[1]+armm[1]);
		cdm = cdm.replace(cdm.substring(bgn,end),insrt+')<br>');
		}
	cdm = cdm.replace(/<br>/g,'\n');
	*/

	var tdTxt = td.innerText || td.textContent;	// récupération du contenu texte d'un élément HTML
	//window.console.log(tdTxt);
	var oData = {};
	oData.tabCdM = tdTxt.split(/\n/);
	// nettoyage entête : enlève le premier élément tant que
	//	- suite de *
	//	- "MOUNTYHALL - La Terre des Trõlls"
	//	- ligne vide (la première expression régulière matche les lignes vides)
	while (oData.tabCdM[0].match(/^=*$/) || oData.tabCdM[0].match(/^MOUNTYHALL/i)) oData.tabCdM.shift();
	// nettoyage entête : enlève tout ce qui suit une ligne composée uniquement d'étoiles suivie de '^Vous avez configuré' + les lignes vides au dessus
	var iLigneNonVide;
	for (var i = 0; i < oData.tabCdM.length; i++) {
		if (oData.tabCdM[i].match(/^\*+$/) && oData.tabCdM[i+1].match(/^Vous avez configuré/i)) {
			if (iLigneNonVide === undefined)
				oData.tabCdM.splice(i);
			else
				oData.tabCdM.splice(iLigneNonVide+1);
			break;
		}
		if (!oData.tabCdM[i].match(/^$/)) iLigneNonVide = i;
	}
	//window.console.log(JSON.stringify(oData));

	FF_XMLHttpRequest({
				method: 'POST',
				url: URL_pageDispatcherV2,
				data: 'cdm_json=' + encodeURIComponent(JSON.stringify(oData)),
				headers : {
					/* inutile, à supprimer
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml',
					*/
					'Content-type':'application/x-www-form-urlencoded',
					},
				trace: 'envoi CdM msg du bot',
				onload: function(responseDetails) {
					buttonCDM.value=responseDetails.responseText;
					buttonCDM.disabled = true;
					}
				});
	}

function MZ_traiteCdMmsg() {
	var oContexteCdM = MZ_analyseCdM('messageContent');	// analyse de la CdM, prépare l'envoi, prépare l'ajout de PV min/max selon blessure
	oContexteCdM.nameBut = 'bForward';	// nom du bouton avant lequel insérer le bouton ou les textes
	if (!oContexteCdM.ok) {
		if (oContexteCdM.error) {
			window.console.log('MZ_traiteCdMmsg, ' + oContexteCdM.error);
			MZ_comp_addMessage(oContexteCdM, 'Erreur MZ, ' + oContexteCdM.error);
		}
		return;
	}
	if (MY_DEBUG) window.console.log('oContexteCdM=' + JSON.stringify( oContexteCdM));

	MZ_comp_addPvRestant(oContexteCdM);

	if (oContexteCdM.txtHeure) {
		var txtHeure = oContexteCdM.txtHeure;
	} else {
		var etimestamp = document.getElementById('messageDateHeure');
		if (etimestamp) var txtHeure = etimestamp.innerText || etimestamp.textContent;
	}
	if (txtHeure) {
		var m = txtHeure.match(/\d+\/\d+\/\d+ +\d+:\d+:\d+/);
		if (m) var tstamp = m[0];
	}
	if (tstamp == undefined) {
		window.console.log('MZ_traiteCdMmsg, pas de date/heure');
		MZ_comp_addMessage(oContexteCdM, 'Impossible d\'envoyer la CdM à MZ, pas de date/heure');
		return;
	} else {

	}
	oContexteCdM.oData.tstamp = tstamp.trim();
	oContexteCdM.oData.bMsgBot = 1;

	// Insertion bouton envoi
	insertButtonCdm(oContexteCdM.nameBut, oContexteCdM.sendInfoCDM);

	/* à supprimer
	// Teste si ce message du bot est un message de CdM
	var tdMessageContent = document.getElementById('messageContent');
	if (!tdMessageContent) return;

	var td = document.evaluate("//td/text()[contains(.,'fait partie')]/..",
								document, null, 9, null).singleNodeValue;
	if (!td) return false;

	cdm = td.innerHTML;

	// Insertion de l'estimation des PV restants
	var des = cdm.indexOf('Dés');
	var pv = cdm.slice(cdm.indexOf('Points de Vie'),cdm.indexOf('Blessure'));
	pv = getPVsRestants(pv, cdm.slice(cdm.indexOf('Blessure :'),des) );
	if(pv)
		td.innerHTML = cdm.slice(0,des-4)+'<br />'+(pv[0]+pv[1]) + cdm.substring(des-4);

	// Insertion bouton envoi + espace
	buttonCDM = insertButtonCdm('bClose',sendCDM);
	*/
}

/*function traitePouvoir() {
	// Teste si ce message du bot est un message de CdM
	// le test "capa" évite les pouvoirs type Chonchon (pas de SR)
	var td = document.evaluate("//td/text()[contains(.,'POUVOIR')]/../text()[contains(.,'capacité spéciale')]/..",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (!td)
		return false;

	var infos = td.innerHTML;
	var id = /monstre n°([0-9]+) /.exec(infos)[1];
	var nomMonstre = /\(une? ([^)]+)\)/.exec(infos)[1];
	var nomPouvoir = /spéciale : ([^<]+)/.exec(infos)[1];
	var date = /alors : ([^<]+)\./.exec(infos)[1];
	date = new Date(date.replace(/([0-9]+)\/([0-9]+)\//,"$2/$1/"));
	var effetPouvoir="";
	var full=false;
	if(infos.indexOf("REDUIT")!=-1) {
		effetPouvoir = /effet REDUIT : ([^<]+)/.exec(infos)[1];
		}
	else {
		effetPouvoir = /effet : ([^<]+)/.exec(infos)[1];
		full=true;
		}
	var dureePouvoir = /durée de ([0-9]+)/.exec(infos)[1];
	// On insère le bouton et un espace
	//var url = pageEffetDispatcher + "?pouv="+escape(nomPouvoir)+"&monstre="+escape(nomMonstre)+"&id="+escape(id)+"&effet="+escape(effetPouvoir)+"&duree="+escape(dureePouvoir)+"&date="+escape(Math.round(date.getTime()/1000));
	// ce type d'URL est obsolète (se fait par msgId dorénavant)
	if(!MY_getValue('AUTOSENDPOUV'))
	{
		var button = insertButtonCdm('bClose',null,"Collecter les infos du pouvoir");
		button.setAttribute("onClick", "window.open('" + url
				+ "', 'popupEffet', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); "
				+ "this.value='Merci de votre participation'; this.disabled = true;");
	}
	else
	{
		FF_XMLHttpRequest({
				method: 'GET',
				url: url,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml'
				}});
	}
}*/

function do_cdmbot() {	// Roule 17/10/2016, restreint à la page des message du bot
	MZ_traiteCdMmsg();
}
//traitePouvoir(); méthode d'envoi obsolète et gestion inconnue niveau DB

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x menu
// n'est lancé que sur refresh du volet de menu (activation ou [Refresh])

var menuRac, mainIco;

// met à jour les carac sauvegardées (position, DLA, etc.)
function updateData() {
	var inputs = document.getElementsByTagName('input');
	var divs = document.getElementsByTagName('div');

	//window.console.log('inputs=' + JSON.stringify(inputs));
	if (inputs && inputs.length > 0) {
		// Roule, 14/03/2017, ancienne version, il n'y a plus de <input>
		numTroll = inputs[0].value;
		window.console.log('[MZd ' + GM_info.script.version + '] init1 numTroll ' + numTroll);
		MY_setValue('NUM_TROLL', numTroll);
		MY_setValue('NIV_TROLL',inputs[1].value);
		if(!MY_getValue(numTroll+'.caracs.rm')) {
			MY_setValue(numTroll+'.caracs.rm',0);
			// assure l'init des 4 var de libs
		}
		MY_setValue(numTroll+'.caracs.mm',inputs[2].value);
	} else {
		// onclick="EnterPJView(91305,750,550)"
		var tabA = document.getElementsByTagName('a');
		if (tabA.length > 0 && tabA[0].onclick !== undefined) {
			var s = tabA[0].onclick.toString();;
			//window.console.log('s=' + JSON.stringify(s) + ' ' + typeof(s) + ' ' + s.toString());
			var m = s.match(/\((\d+) *,/);
			//window.console.log('m=' + JSON.stringify(m));
			numTroll = parseInt(m[1]);
			window.console.log('[MZd ' + GM_info.script.version + '] init2 numTroll ' + numTroll);
			MY_setValue('NUM_TROLL', numTroll);
		} else {
			window.console.log('[MZd ' + GM_info.script.version + '] updateData, impossible de retrouver le numéro de Troll (tabA.length=' + tabA.length + ')');
		}
	}

	var DLA = new Date(
		StringToDate(divs[1].firstChild.nodeValue.slice(5))
	);
	if(MY_getValue(numTroll+'.DLA.encours')) {
		var DLAstockee = new Date(
			StringToDate(MY_getValue(numTroll+'.DLA.encours'))
		);
		if(DLA>DLAstockee) {
			MY_setValue(numTroll+'.DLA.ancienne',DateToString(DLAstockee));
			// Pose un pb en cas de décalage de DLA
		}
	}
	MY_setValue(numTroll+'.DLA.encours',DateToString(DLA));

	try {
		var listePos = divs[1].childNodes[2].nodeValue.split('=');
		MY_setValue(numTroll+'.position.X',parseInt(listePos[1]));
		MY_setValue(numTroll+'.position.Y',parseInt(listePos[2]));
		MY_setValue(numTroll+'.position.N',parseInt(listePos[3]));
	} catch(e) {
		window.console.log('[MZ] erreur {' + e + '} à la récupération des coord. div[1] contient ' + divs[1].outerHTML.replace(/</g, '‹') + ', div[0] contient ' + divs[0].outerHTML.replace(/</g, '‹'));
	}
	if (MY_DEBUG) window.console.log('numTroll=' + numTroll + ',DLA =' + DLA + ', x= ' + parseInt(listePos[1]) + ', y= ' + parseInt(listePos[2]) + ', n= ' + parseInt(listePos[3]));
}

// ajoute les raccourcis (paramétrables dans Options/Pack Graphique)
function initRaccourcis() {
	var anotherURL = MY_getValue('URL1');
	if(!anotherURL) { return; }

	/* Création de l'icône faisant apparaître le menu */
	mainIco = document.createElement('img');
	var urlIco = MY_getValue(numTroll+'.ICOMENU');
	if(!urlIco) {
		urlIco =
			URL_MZimg + 'mz_logo_small.png';
	}
	mainIco.src = urlIco;
	mainIco.alt = 'MZ';
	mainIco.style = 'position:fixed; top:0px; left:0px';
	mainIco.onmouseover = afficheMenu;
	document.body.appendChild(mainIco);

	/* Création du menu des Raccourcis */
	menuRac = document.createElement('div');
	menuRac.className = 'mh_textbox';
	menuRac.style =
		'position:fixed; top:10px; left:10px;'+
		'max-width:190px;'+
	 	'border-radius: 4px; padding: 4px;'+
	 	'z-index: 500;'+
	 	'visibility: hidden;';
	document.body.appendChild(menuRac);
	document.addEventListener('mousemove',cacheMenu,false);
	var i=1;
	while(anotherURL) {
		var a = document.createElement('a');
		var url = MY_getValue('URL'+i);
		var nom = MY_getValue('URL'+i+'.nom');
		var ico = MY_getValue('URL'+i+'.ico');
		a.href = url;
		a.target = '_blank';
		if(ico) {
			var txt = nom ? nom : '';
			var img = createImage(ico,txt);
			a.appendChild(img);
		}
		else {
			appendText(a,'['+nom+']');
		}
		menuRac.appendChild(a);
		appendBr(menuRac);
		i++;
		anotherURL = MY_getValue('URL'+i);
	}
}

function afficheMenu() {
	menuRac.style.visibility = 'visible';
}

function cacheMenu(e) {
	if(menuRac.style.visibility=='hidden') { return; }
	// Position souris
	var ptX = e.clientX;
	var ptY = e.clientY;
	// On recalcule en live les BoundingBox pour mainIco et menuRac
	// Moins optimal, mais évite des erreurs (d'originie inconnue)
	var menuRect = menuRac.getBoundingClientRect();
	var icoRect = mainIco.getBoundingClientRect();
	if((ptX>icoRect.width || ptY>icoRect.height) &&
		(ptX<10 || ptX>10+menuRect.width || ptY<10 || ptY>10+menuRect.height)) {
		menuRac.style.visibility = 'hidden';
	}
}

// ajout de l'icône, branchée sur un refresh
function initUpdateCoordGauche() {
	var div = document.evaluate("//div[@class='infoMenu']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	//window.console.log('initUpdateCoordGauche ' + div.innerHTML);
	if (!div) return;
	var img = document.createElement('img');
	img.src = URL_MZimg + 'recycl.png'
	img.onclick = function(evt) {
		document.location.href = document.location.href;
	};
	img.title = 'Mise à jour de la localisation';
	img.style.cursor = 'pointer';
	img.style.position = 'absolute';
	img.style.bottom = 0;
	img.style.left = 0;
	div.appendChild(img);
}

// ajout sur les raccoucis des mêmes popup que dans le profil
function MZ_initPopupFrameGauche() {
	var eListeFavoris = document.getElementById('listeFavori');
	if (!eListeFavoris) {
		window.console.log('MZ **erreur** pas de listeFavori dans la frame de gauche');
		return;
	}
	var tabA = eListeFavoris.getElementsByTagName('A');
	for (var i = 0; i < tabA.length; i++) {
		var a = tabA[i];
		setInfos(a,epure(trim(a.textContent)),'*',1);
	}
}

function do_menu() {
	// met à jour les carac sauvegardées (position, DLA, etc.)
	updateData();
	// ajoute les raccourcis (paramétrables dans Options/Pack Graphique)
	initRaccourcis();
	// Ajout du compte à rebours de DLA
	initCompteAreboursDLA();
	// Ajout bouton de mise à jour coordonnées
	initUpdateCoordGauche();
	// Ajout popup sur les raccourcis des actions
	//MZ_initPopupFrameGauche();
}

/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x vue

/* TODO
 * /!\ bug latent sur diminution bonusPV (perte Telaite / template Ours),
 * prévoir fix ("delete infos")
 */

/*--------------------------- Variables Globales -----------------------------*/

// Position actuelle
var currentPosition=[0,0,0];

// Portées de la vue : [vueHpure, vueVpure, vueHlimitée, vueVlimitée]
var porteeVue=[0,0,0,0];

// Fenêtres déplaçables
var winCurr = null;
var offsetX, offsetY;

// Diplomatie
var Diplo = {
	Guilde: {},
	Troll: {},
	Monstre: {}
	// .mythiques: uniquement si option activée
};
var isDiploRaw = true; // = si la Diplo n'a pas encore été analysée

// Infos tactiques
// => MZ_Tactique.popup

// Utilisé pour supprimer les monstres "engagés"
var listeEngages = {};
var isEngagesComputed = false;
var cursorOnLink = false; // DEBUG: wtf ?

var needComputeEnchantement = MY_getValue(numTroll+'.enchantement.liste')
	&& MY_getValue(numTroll+'.enchantement.liste')!='';

// Checkboxes de filtrage
var checkBoxGG, checkBoxCompos, checkBoxBidouilles, checkBoxIntangibles,
	checkBoxDiplo, checkBoxTrou, checkBoxEM, checkBoxTresorsNonLibres,
	checkBoxTactique, checkBoxLevels, checkBoxGowapsS, checkBoxGowapsA, checkBoxEngages,
	comboBoxNiveauMin, comboBoxNiveauMax, comboBoxFamille;

/* Acquisition & Stockage des données de DB */
var typesAFetcher = {
	'monstres':1,
	'trolls':1,
	'tresors':1,
	'champignons':1,
	'lieux':1
}

var MZ_EtatCdMs = {	// zone où sont stockées les variables "globales" pour la gestion des cdM et infos tactiques
	nbMonstres: 0,
	tr_monstres: [],
	lastIndexDone: 0,
	isCDMsRetrieved: false, // = si les CdM ont déjà été DL
	listeCDM: [],
	indexCellDist: -1,
	indexCellActions: -1,
	indexCellID: -1,
	indexCellNivMZ: -1,
	indexCellX: -1,
	indexCellY: -1,
	indexCellN: -1,
	// Gère l'affichage en cascade des popups de CdM
	yIndexCDM: 0,
	tdWitdh: 110,
};

var VueContext = {};
var tr_trolls = {}, tr_tresors = {},
	tr_champignons = {}, tr_lieux = {};
var nbTrolls = 0, nbTresors = 0,
	nbChampignons = 0, nbLieux = 0;

function fetchData(type) {
	var node;
	try {
		node = document.getElementById('mh_vue_hidden_'+type);
		VueContext['tr_'+type] = node.getElementsByTagName('tr');
		VueContext['nb'+type[0].toUpperCase()+type.slice(1)] = VueContext['tr_'+type].length-1;
	} catch(e) {
		window.console.warn('[MZ Vue] Erreur acquisition type '+type, e);
	}
}

/*-[functions]-------------- Fonctions utilitaires ---------------------------*/

function positionToString(arr) {
	return arr.join(';');
}

function MZ_deltaH(pos1, pos2) {	// pos1 et pos2 doivent être des tableaux [x, y, n]
	return Math.max(Math.abs(pos1[0]-pos2[0]), Math.abs(pos1[1]-pos2[1]));
}

function MZ_deltaV(pos1, pos2) {
	return Math.abs(pos1[2]-pos2[2]);
}

function savePosition() {
	// Stocke la position (à jour) de la vue pour les autres scripts
	// DEBUG: Lesquels et pourquoi?
	var pos = getPosition();
	MY_setValue(numTroll+'.position.X',pos[0]);
	MY_setValue(numTroll+'.position.Y',pos[1]);
	MY_setValue(numTroll+'.position.N',pos[2]);
}


/*-[functions]--- Fonctions de récupération de données (DOM) -----------------*/
/* INFOS :
 * les champs-titres (table>tbody>tr>td>table>tbody>tr>td>a)
 * sont identifiables via leur Name
 * les tables-listings sont identifiables via l'ID du tr conteneur
 * (mh_vue_hidden_XXX, XXX=trolls, champignons, etc)
 */

/* [functions] Récup données Utilisateur */
function getPosition() {
	// Pour rétrocompatibilité
	return currentPosition;
}

function getPorteVue() {
	// Pour rétrocompatibilité
	return porteeVue;
}

function getVue() {
	// Retourne [vueHpure, vueVpure]
	var vues = getPorteVue();
	return [ vues[0], vues[1] ];
	}

// Roule 11/03/2016
/* [functions] Récup données monstres, trolls, etc. */
function getXxxDistance(xxx, i) {
	return MZ_getDistanceAvecSplit(VueContext['tr_' + xxx.toLowerCase()][i].cells[0].textContent);
}
function getXxxPosition(xxx, i) {
	var tds = VueContext['tr_' + xxx.toLowerCase()][i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent)
	];
}


/* [functions] Récup données monstres */
function getMonstreDistance(i) {
	//debugMZ('getMonstreDistance, i=' + i + ', tr=' + MZ_EtatCdMs.tr_monstres[i].innerHTML);
	var s = MZ_EtatCdMs.tr_monstres[i].cells[MZ_EtatCdMs.indexCellDist].textContent;
	if (s.indexOf('|') < 0) return parseInt(s);
	var m = s.match(/(\d+)[^\d]+(\d+)/);
	if (!(m && m.length >= 3)) return 0;
	return Math.max(m[1], m[2]);
}

function getMonstreID(i) {
	return Number(MZ_EtatCdMs.tr_monstres[i].cells[MZ_EtatCdMs.indexCellID].firstChild.nodeValue);
}

function getMonstreIDByTR(tr) {
	return tr.cells[MZ_EtatCdMs.indexCellID].firstChild.nodeValue;
}

function getMonstreLevelNode(i) {
	return MZ_EtatCdMs.tr_monstres[i].cells[MZ_EtatCdMs.indexCellNivMZ];
}

function isMonstreLevelOutLimit(i, limitMin, limitMax) {
	if(!MZ_EtatCdMs.isCDMsRetrieved) return false;
	var donneesMonstre = MZ_EtatCdMs.listeCDM[getMonstreID(i)];
	if (!donneesMonstre) return false;
	var niv = donneesMonstre.niv;
	if (niv == undefined) return false;
	if (limitMin > 0 && niv.max && niv.max < limitMin) return true;
	if (limitMax > 0 && niv.min && niv.min > limitMax) return true;
	return false;
}

function getMonstreNomNode(i) {
	try {
		var td = document.evaluate(
			"./td/a[starts-with(@href, 'javascript:EMV')]/..",
			MZ_EtatCdMs.tr_monstres[i], null, 9, null
		).singleNodeValue;
		return td;
	} catch(e) {
		avertissement('[getMonstreNomNode] Impossible de trouver le monstre '+i);
		window.console.error(traceStack(e, 'getMonstreNomNode Impossible de trouver le monstre'+i));
	}
}

function getMonstreNom(i) {
	return getMonstreNomByTR(MZ_EtatCdMs.tr_monstres[i]);
}

function getMonstreNomByTR(tr) {
	try {
		var nom = document.evaluate(
			"./td/a[starts-with(@href, 'javascript:EMV')]/text()",
			tr, null, 2, null
		).stringValue;
		return nom;
	} catch(e) {
		avertissement('[getMonstreNom] Impossible de trouver le monstre '+i);
		window.console.error(traceStack(e, 'getMonstreNom Impossible de trouver le monstre '+i));
	}
}

function getMonstrePosition(i) {
	var tds = MZ_EtatCdMs.tr_monstres[i].childNodes;
	return [
		parseInt(tds[MZ_EtatCdMs.indexCellX].textContent),
		parseInt(tds[MZ_EtatCdMs.indexCellY].textContent),
		parseInt(tds[MZ_EtatCdMs.indexCellN].textContent)
	];
}

function isMonstreVisible(i) {
	var tr = MZ_EtatCdMs.tr_monstres[i];
	//window.console.log('isMonstreVisible(' + i + '), display=' + tr.style.display);
	return tr.style.display !== 'none';
}

function appendMonstres(txt) {
	for(var i=1; i<=MZ_EtatCdMs.nbMonstres ; i++)
		txt += getMonstreID(i)+';'+getMonstreNom(i)+';'+positionToString(getMonstrePosition(i))+'\n';
	return txt;
}

function getMonstres() {
	var vue = getVue();
	return appendMonstres(positionToString(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

function bddMonstres(start,stop, limitH, limitV) {
	if(!start) { var start = 1; }
	if(!stop) { var stop = MZ_EtatCdMs.nbMonstres; }
	stop = Math.min(MZ_EtatCdMs.nbMonstres,stop);
	var txt='';
	var myPosition = getPosition();
	for(var i=start ; i<=stop ; i++) {
		var monstrePosition = getMonstrePosition(i);
		if (MZ_deltaH(myPosition, monstrePosition) > limitH) continue;
		if (MZ_deltaV(myPosition, monstrePosition) > limitV) continue;
		if (!isMonstreVisible(i)) continue;
		txt += getMonstreID(i)+';'+
			getMonstreNom(i)+';'+
			positionToString(monstrePosition)+'\n';
	}
	return txt ? '#DEBUT MONSTRES\n'+txt+'#FIN MONSTRES\n' : '';
}

/* [functions] Récup données Trolls */

// Roule 12/07/2017 détecte les colonnes à partir des titres. Mamoune vient de les faire bouger :(
var COL_TROLL_DIST = 0;	// celui-là, on le garde en dur

function getTrollDistance(i) {
	return parseInt(tr_trolls[i].cells[COL_TROLL_DIST].textContent);
}

var MZ_cache_col_TrollID;
var MZ_cache_col_TrollNOM;
var MZ_cache_col_TrollGUILDE;
var MZ_cache_col_TrollNIV;

function MZ_find_col_titre(trs, titre) {
	var l = titre.length;
	for (var i=0; i < trs[0].cells.length; i++)
		if (trs[0].cells[i].textContent.toLowerCase().substr(0, l) == titre) return i;
	window.console.log('MZ : impossible de trouver la colonne de titre ' + titre + ' dans ' + trs[0].textContent);
	return 0;
}

function getTrollID(i) {
	if (MZ_cache_col_TrollID === undefined) MZ_cache_col_TrollID = MZ_find_col_titre(tr_trolls, 'réf');
	// Roule 08/03/2017 protection
	var iTroll = parseInt(tr_trolls[i].cells[MZ_cache_col_TrollID].textContent)
	if (isNaN(iTroll)) return;
	if (iTroll == 0) return;
	return iTroll;
}

function getTrollNomNode(i) {
	if (MZ_cache_col_TrollNOM === undefined) MZ_cache_col_TrollNOM = MZ_find_col_titre(tr_trolls, 'nom');
	return tr_trolls[i].cells[MZ_cache_col_TrollNOM];
}

function getTrollNivNode(i) {
	if (MZ_cache_col_TrollNIV === undefined) MZ_cache_col_TrollNIV = MZ_find_col_titre(tr_trolls, 'niv');
	return tr_trolls[i].cells[MZ_cache_col_TrollNIV];
}

function getTrollGuilde(i) {
	if (MZ_cache_col_TrollGUILDE === undefined) MZ_cache_col_TrollGUILDE = MZ_find_col_titre(tr_trolls, 'guild');
	return trim(tr_trolls[i].cells[MZ_cache_col_TrollGUILDE].textContent);
}

function getTrollGuildeID(i) {
	if (MZ_cache_col_TrollGUILDE === undefined) MZ_cache_col_TrollGUILDE = MZ_find_col_titre(tr_trolls, 'guild');
	if(tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE].childNodes.length>0) {
		var href;
		try {
			if ((!tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE].firstChild) || (!tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE].firstChild.getAttribute)) return -1;	// Roule 21/12/2016 protection conte le "bug Marsak"
			href = tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE].firstChild.getAttribute('href');
		} catch(e) {	// debug pb remonté par Marsak
			window.console.error(traceStack(e, 'getTrollGuildeID')
				,'nb child=' + tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE].childNodes.length
				,tr_trolls[i].innerHTML.replace(/</g, '‹'));
			return -1;
		}
		return href.substring(href.indexOf('(')+1,href.indexOf(','));
	}
	return -1;
}

function getTrollPosition(i) {
	var tds = tr_trolls[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent)
	];
}

function bddTrolls(limitH, limitV) {
	var myPosition = getPosition();
	var txt='#DEBUT TROLLS\n'+
		numTroll+';'+positionToString(myPosition)+'\n';
	for(var i=1 ; i<=nbTrolls ; i++) {
		var trollPosition = getTrollPosition(i);
		if (MZ_deltaH(myPosition, trollPosition) > limitH) continue;
		if (MZ_deltaV(myPosition, trollPosition) > limitV) continue;
		txt += getTrollID(i)+';'+
			positionToString(trollPosition)+'\n';
	}
	return txt+'#FIN TROLLS\n';
}

/* [functions] Récup données Trésors */
function getTresorDistance(i) {
	return MZ_getDistanceAvecSplit(tr_tresors[i].cells[0].firstChild.nodeValue);
}

function MZ_getDistanceAvecSplit(cellTxt) {
	cellTxt = cellTxt.replace('\u2007', ' ').replace('\u2212', '-');
	var txtSplitted = cellTxt.split('|');
	if (txtSplitted.length == 1) txtSplitted = cellTxt.split('/');
	if (txtSplitted.length == 1) return parseInt(txtSplitted[0], 10);
	var dH = Math.abs(txtSplitted[0]);
	var dV = Math.abs(txtSplitted[1]);
	return Math.max(dH, dV);
}

function getTresorID(i) {
	var tds = tr_tresors[i].childNodes;
	var l = tds.length;
	return trim(tr_tresors[i].cells[l-5].textContent);
}

function getTresorNom(i) {
	var tds = tr_tresors[i].childNodes;
	var l = tds.length;
	// Utilisation de textContent pour régler le "bug de Pollux"
	return trim(tr_tresors[i].cells[l-4].textContent);
}

function getTresorPosition(i) {
	var tds = tr_tresors[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent),
	];
}

function bddTresors(dmin,start,stop, limitH, limitV) {
// On retire les trésors proches (dmin) pour Troogle à cause de leur description
	if(!dmin) { var dmin = 0; }
	if(!start) { var start = 1; }
	if(!stop) { var stop = nbTresors; }
	stop = Math.min(nbTresors,stop);
	var myPosition = getPosition();
	var txt='';
	for(var i=start ; i<=stop ; i++) {
		var tresorPosition = getTresorPosition(i);
		//if (MY_DEBUG) window.console.log('bddTresors, i=' + i + ', ' + getTresorID(i)+';'+ getTresorNom(i)+';'+ positionToString(tresorPosition) + ', dmin=' + dmin + ', start=' + start + ', stop=' + stop + ', limitH=' + limitH + ', limitV=' + limitV + ', MZ_deltaH=' + MZ_deltaH(myPosition, tresorPosition) + ', MZ_deltaV=' + MZ_deltaV(myPosition, tresorPosition) + ', distance=' + getTresorDistance(i));
		if (MZ_deltaH(myPosition, tresorPosition) > limitH) continue;
		if (MZ_deltaV(myPosition, tresorPosition) > limitV) continue;
		if(getTresorDistance(i)>=dmin) {
			txt += getTresorID(i)+';'+
				getTresorNom(i)+';'+
				positionToString(tresorPosition)+'\n';
		}
	}
	return txt ? '#DEBUT TRESORS\n'+txt+'#FIN TRESORS\n' : '';
}

/* [functions] Récup données Champignons */
// DEBUG: Pas de colonne "Référence" sur serveur de test
function getChampignonNom(i) {
	return trim(tr_champignons[i].cells[2].textContent);
}

function getChampignonPosition(i) {
	var tds = tr_champignons[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent)
	];
}

function bddChampignons(limitH, limitV) {
	var myPosition = getPosition();
	var txt='';
	for(var i=1 ; i<=nbChampignons ; i++) {
		var champignonPosition = getChampignonPosition(i);
		if (MZ_deltaH(myPosition, champignonPosition) > limitH) continue;
		if (MZ_deltaV(myPosition, champignonPosition) > limitV) continue;
		txt += ';'+ // Les champis n'ont pas de Référence
			getChampignonNom(i)+';'+
			positionToString(champignonPosition)+'\n';
	}
	return txt ? '#DEBUT CHAMPIGNONS\n'+txt+'#FIN CHAMPIGNONS\n' : '';
}

/* [functions] Récup données Lieux */
function getLieuDistance(i) {
	return MZ_getDistanceAvecSplit(tr_tresors[i].cells[0].firstChild.nodeValue);
}

function getLieuID(i) {
	return parseInt(tr_lieux[i].cells[2].textContent);
}

function getLieuNom(i) {
	// Conversion ASCII pour éviter les bugs des Vues externes
	return trim(tr_lieux[i].cells[3].textContent);
}

function getLieuPosition(i) {
	var tds = tr_lieux[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent)
	];
}

function appendLieux(txt) {
	for(var i = 1; i < nbLieux+1; i++) {
		var tds = x_lieux[i].childNodes;
		txt += tds[1].firstChild.nodeValue + ";" + getLieuNom(i) + ";" + tds[3].firstChild.nodeValue + ";"
				+ tds[4].firstChild.nodeValue + ";" + tds[5].firstChild.nodeValue + "\n";
	}
	return txt;
}

function getLieux() {
	var vue = getVue();
	return appendLieux(positionToString(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

function bddLieux(start, stop, limitH, limitV) {
	if(!start) { var start = 1; }
	if(!stop) { var stop = nbLieux; }
	stop = Math.min(nbLieux,stop);
	var myPosition = getPosition();
	var txt='';
	for(var i=start ; i<=stop ; i++) {
		var lieuPosition = getLieuPosition(i);
		if (MZ_deltaH(myPosition, lieuPosition) > limitH) continue;
		if (MZ_deltaV(myPosition, lieuPosition) > limitV) continue;
		txt += getLieuID(i)+';'+
			epure(getLieuNom(i))+';'+
			positionToString(lieuPosition)+'\n';
	}
	return txt ? '#DEBUT LIEUX\n'+txt+'#FIN LIEUX\n' : '';
}


/*-[functions]--------- Gestion Préférences Utilisateur ----------------------*/

function saveCheckBox(chkbox, pref) {
	// Enregistre et retourne l'état d'une CheckBox
	var etat = chkbox.checked;
	MY_setValue(pref, etat ? 'true' : 'false' );
	return etat;
}

function recallCheckBox(chkbox, pref) {
	// Restitue l'état d'une CheckBox
	chkbox.checked = (MY_getValue(pref)=='true');
}

function saveComboBox(cbb, pref) {
	if (!cbb) return;
	// Enregistre et retourne l'état d'une ComboBox
	var opt = cbb.options[cbb.selectedIndex];
	if (!opt) return;
	var etat = cbb.options[cbb.selectedIndex].value;
	MY_setValue(pref, etat);
	return etat;
}

function recallComboBox(cbb, pref) {
	// Restitue l'état d'une ComboBox
	var nb = MY_getValue(pref);
	if(nb && cbb) cbb.value = nb;
	return nb;
}

function synchroniseFiltres() {
	// Récupération de toutes les options de la vue
	var wasActive =
		Number(recallComboBox(comboBoxNiveauMin,'NIVEAUMINMONSTRE')) +
		Number(recallComboBox(comboBoxNiveauMax,'NIVEAUMAXMONSTRE')) +
		(recallComboBox(comboBoxFamille,'FAMILLEMONSTRE') == 0 ? 0 : 1);	// Roule 30/01/2020 on obtient du non numérique si il y a filtre par famille
	if(wasActive>0) {
		debutFiltrage('Monstres');
	}
	recallCheckBox(checkBoxGowapsS,'NOGOWAPS');
	recallCheckBox(checkBoxGowapsA,'NOGOWAPA');
	recallCheckBox(checkBoxMythiques,'NOMYTH');
	recallCheckBox(checkBoxEngages,'NOENGAGE');
	recallCheckBox(checkBoxLevels,'NOLEVEL');
	recallCheckBox(checkBoxIntangibles,'NOINT');
	recallCheckBox(checkBoxGG,'NOGG');
	recallCheckBox(checkBoxCompos,'NOCOMP');
	recallCheckBox(checkBoxBidouilles,'NOBID');
	recallCheckBox(checkBoxDiplo,numTroll+'.diplo.off');
	recallCheckBox(checkBoxTrou,'NOTROU');
	recallCheckBox(checkBoxTresorsNonLibres,'NOTRESORSNONLIBRES');
	recallCheckBox(checkBoxTactique,'NOTACTIQUE');
	if(MY_getValue('NOINFOEM')!='true')
		recallCheckBox(checkBoxEM,'NOEM');
}


/*-[functions]-------- Initialisation: Ajout des Boutons ---------------------*/

function getVueScript() {
	try {
		var eLimitH = document.getElementById('MZvueExtMaxH');
		if (eLimitH) var limitH = eLimitH.value;
		if (limitH != '') limitH = parseInt(limitH);
		var eLimitV = document.getElementById('MZvueExtMaxV');
		if (eLimitV) var limitV = eLimitV.value;
		if (limitV != '') limitV = parseInt(limitV);
		if (limitH == '' || limitH == 0) {
			MY_removeValue('MZ_VueExtMaxH');
			var porteeVueExt = getPorteVue()[2];	// vue limitée horizontale
			limitH = 999;
		} else {
			MY_setValue('MZ_VueExtMaxH', limitH);
			var porteeVueExt = limitH;
		}
		if (limitV == '' || limitV == 0) {
			MY_removeValue('MZ_VueExtMaxV');
			limitV = 999;
		} else {
			MY_setValue('MZ_VueExtMaxV', limitV);
		}
		var txt = bddTrolls(limitH, limitV)+
			bddMonstres(null, null, limitH, limitV)+
			bddChampignons(limitH, limitV)+
			bddTresors(null, null, null, limitH, limitV)+
			bddLieux(null, null, limitH, limitV)+
			'#DEBUT ORIGINE\n'+
			porteeVueExt+';'+positionToString(getPosition())+
			'\n#FIN ORIGINE\n';
		if (MY_DEBUG) window.console.log('MZ getVueScript nbTrolls=' + nbTrolls + ', txt=' + txt);
		window.console.log('[MZd ' + GM_info.script.version + '] fin getVueScript');
		return txt;
	} catch(e) {
		avertissement("[getVueScript] Erreur d'export vers Vue externe");
		window.console.error(traceStack(e, 'getVueScript'))
	}
}

/* [functions] Menu Vue 2D */
var vue2Ddata = {
	'Bricol\' Vue': {
		url: URL_bricol_mountyhall + 'vue_form.php',
		paramid: 'vue',
		func: getVueScript,
		extra_params: {
			'mode': 'vue_SP_Vue2',
			'screen_width': window.screen.width
		}
	},
	'Vue du CCM': {
		url: URL_vue_CCM,
		paramid: 'vue',
		func: getVueScript,
		extra_params: {
			'id': numTroll+';'+positionToString(getPosition())
		}
	},
	'Vue Gloumfs 2D': {
		url: URL_vue_Gloumfs2D,
		paramid: 'vue_mountyzilla',
		func: getVueScript,
		extra_params: {}
	},
	'Vue Gloumfs 3D': {
		url: URL_vue_Gloumfs3D,
		paramid: 'vue_mountyzilla',
		func: getVueScript,
		extra_params: {}
	},
	'Grouky Vue!': {
		url: URL_vue_Grouky,
		paramid: 'vue',
		func: getVueScript,
		extra_params: {
			'type_vue': 'V5b1'
		}
	},
	'Cube': {
		noform: true,
		func: function() {MZ_AnalyseVue.openVueExterne(URL_MZ + '/' + URL_vue_cube)},
		extra_params: {},
	},
	/*'DEBUG': {
		url: 'http://weblocal/testeur.php',
		paramid: 'vue',
		func: getVueScript,
		extra_params: {}
	},*/
};

function refresh2DViewButton() {
	// = EventListener menu+bouton vue 2D
	var vueext = document.getElementById('selectVue2D').value;
	MY_setValue('VUEEXT',vueext);
	var oParamVue = vue2Ddata[vueext];
	var form = document.getElementById('viewForm');
	form.innerHTML = '';
	form.method = 'post';
	form.action = oParamVue.url;
	form.target = '_blank';
	if (oParamVue.paramid) appendHidden(form, oParamVue.paramid, '');
	for(var key in oParamVue.extra_params) {
		appendHidden(form, key, oParamVue.extra_params[key]);
	}
	if (oParamVue.noform) {
		appendButton(form, 'Voir', oParamVue.func);
	} else {
		appendSubmit(form, 'Voir',
			function() {
				window.console.log('[MZd ' + GM_info.script.version + '] click voir vue externe');
				document.getElementsByName(oParamVue.paramid)[0].value =
					oParamVue.func();
			}
		);
	}
}

function set2DViewSystem() {
// Initialise le système de vue 2D
	// Recherche du point d'insertion
	var center;
	try {
		// Roule 09/03/2019, encore un changement MH, je fais suivre comme je peux
		center = document.getElementById('titre2');
		// version initiale "pré-Roule"
		if (!center) center = document.evaluate(
			"//h2[@id='titre2']/following-sibling::center",
			document, null, 9, null
		).singleNodeValue;
		// Roule 09/12/2016 J'ai remplacé following-sibling::center par following-sibling::div suite à une modification MH
		if (!center) center = document.evaluate(
			"//h2[@id='titre2']/following-sibling::div",
			document, null, 9, null
		).singleNodeValue;

	} catch(e) {
		avertissement("Erreur d'initialisation du système de vue 2D");
		window.console.error(traceStack(e, 'set2DViewSystem'));
		return;
	}

	// Récupération de la dernière vue utilisée
	var vueext = MY_getValue('VUEEXT');
	if(!vueext || !vue2Ddata[vueext]) {
		// sinon, la vue Bricol'Trolls est employée par défaut
		vueext = 'Bricol\' Vue';
	}

	try {
		// Création du sélecteur de vue externe
		selectVue2D = document.createElement('select');
		selectVue2D.id = 'selectVue2D';
		selectVue2D.className = 'SelectboxV2';
		//window.console.log('[MZd ' + GM_info.script.version + '] préparation ' + Object.keys(vue2Ddata).length + ' types de vue, troll n°' + numTroll);
		for(var view in vue2Ddata) {
			appendOption(selectVue2D, view, view);
		}
		selectVue2D.value = vueext;
		selectVue2D.onchange = refresh2DViewButton;

		// Création du formulaire d'envoi (vide, le submit est géré via handler)
		var form = document.createElement('form');
		form.id = 'viewForm';

		// Insertion du système de vue
		var table = document.createElement('table');
		var tr = appendTr(table);
		var td = appendTd(tr);
		td.appendChild(selectVue2D);
		appendTdText(tr, 'Limiter à ').style.whiteSpace = 'nowrap';
		td = appendTd(tr);
		appendTextbox(td,'input','MZvueExtMaxH',3,3,MY_getValue('MZ_VueExtMaxH'), 'MZvueExtMaxH');
		appendTdText(tr, ' cases horizontales et ').style.whiteSpace = 'nowrap';
		td = appendTd(tr);
		appendTextbox(td,'input','MZvueExtMaxV',3,3,MY_getValue('MZ_VueExtMaxV'), 'MZvueExtMaxV');
		appendTdText(tr, ' cases verticales').style.whiteSpace = 'nowrap';
		td = appendTd(tr);
		td.style.fontSize = '0px'; // gère le bug de l'extra character
		td.appendChild(form);
		if (center.id == 'titre2') {	// 09/03/2019 nouvelle méthode
			var eDiv = document.createElement('div');
			eDiv.appendChild(table);
			eDiv.style.witdth = '100%';
			eDiv.style.textAlign = 'center';
			table.style.width = '180px';
			table.style.margin = '0 auto';
			center.parentNode.insertBefore(eDiv,center.nextSibling);
		} else {	// ancienne méthode
			center.insertBefore(table,center.firstChild);
			insertBr(center.childNodes[1]);
		}

		// Appelle le handler pour initialiser le bouton de submit
		refresh2DViewButton();
		window.console.log('[MZd ' + GM_info.script.version + '] fin préparation des vues externes');
	} catch(e) {
		avertissement("Erreur de traitement du système de vue externe");
		window.console.error(traceStack(e, 'set2DViewSystem'));
	}
}

/* [functions] Tableau d'Infos */
function initialiseInfos() {
	// DEBUG: prévoir désactivation complète du script si infoTab non trouvé
	var
		infoTab = document.getElementById('infoTab'),
		tbody = infoTab.tBodies[0],
		thead = infoTab.createTHead(),
		tr = appendTr(thead,'mh_tdtitre'),
		td = appendTdText(tr,'INFORMATIONS',true),
		span = document.createElement('span');

	// Récupération de la position du joueur
	try {
		var strPos = document.evaluate(
				".//b/text()[contains(.,'X = ') or contains(.,'X\u00A0=\u00A0')]",	// &nbsp; en vue smartphone
				infoTab, null, 9, null
			).singleNodeValue.nodeValue;
		// ***INIT GLOBALE*** currentPosition
		currentPosition = getIntegers(strPos);
		debugMZ("retrievePosition(): "+currentPosition);
	} catch(e) {
		// Si on ne trouve pas le "X ="
		window.console.error(traceStack(e, 'Vue Position joueur non trouvée'));
	}

	// Récupération des portées (max et limitée) de la vue
	try {
		var
			nodes = document.evaluate(
				".//b/text()[contains(.,'horizontalement') "+
				"or contains(.,'verticalement')]",
				infoTab, null, 7, null
			);
			var array = [];
		for(var i=0 ; i<4 && i<nodes.snapshotLength ; i++) {
			array.push(parseInt(nodes.snapshotItem(i).nodeValue));
		}
		// ***INIT GLOBALE*** porteeVue
		porteeVue = array;
		if (porteeVue.length < 4) {
			porteeVue[2] = array[0];
			porteeVue[3] = array[1];
		}
	} catch(e) {
		window.console.error(traceStack(e, 'Vue Portées Vue non trouvée'));
	}

	infoTab.id = 'infoTab'; // Pour scripts externes
	tbody.id = 'corpsInfoTab';
	tbody.rows[0].cells[0].colSpan = 2;
	if (tbody.rows.length > 1) tbody.rows[1].cells[0].colSpan = 2;
	td.colSpan = 3;
	td.style.cursor = 'pointer';
	/* quel intérêt de changer de className ? et ça fait bouger toute la frame d'un pixel ou deux, c'est désagréable
	td.onmouseover = function() {
		this.style.cursor = 'pointer';
		this.className = 'mh_tdpage';
	};
	td.onmouseout = function() {
		this.className = 'mh_tdtitre';
	};
	*/
	td.onclick = function() {
		toggleTableauInfos(false);
	};

	span.id = 'msgInfoTab';
	span.style.display = 'none';
	appendText(
		span,
		' => Position : X = '+currentPosition[0]+
		', Y = '+currentPosition[1]+
		', N = '+currentPosition[2]+
		' --- Vue : '+porteeVue[0]+'/'+porteeVue[1]+
		' ('+porteeVue[2]+'/'+porteeVue[3]+')',
		true
	);
	td.appendChild(span);

	tr = appendTr(tbody,'mh_tdpage');
	td = appendTdText(tr,'EFFACER : ',true);
	td.align = 'center';
	td.className = 'mh_tdtitre';
	td.width = 100;
	td = appendTdCenter(tr,2);
	// DEBUG : à quoi servent les ids si on utilise des var globales ?
	checkBoxGG = appendCheckBoxSpan(
		td,'delgg',filtreTresors," Les GG'"
	).firstChild;
	checkBoxCompos = appendCheckBoxSpan(
		td,'delcomp',filtreTresors,' Les Compos'
	).firstChild;
	checkBoxBidouilles = appendCheckBoxSpan(
		td,'delbid',filtreTresors,' Les Bidouilles'
	).firstChild;
	checkBoxIntangibles = appendCheckBoxSpan(
		td,'delint',filtreTrolls,' Les Intangibles'
	).firstChild;
	checkBoxGowapsA = appendCheckBoxSpan(
		td,'delgowapA',filtreMonstres,' Les Gowaps Apprivoisés'
	).firstChild;
	checkBoxGowapsS = appendCheckBoxSpan(
		td,'delgowapS',filtreMonstres,' Les Gowaps Sauvages'
	).firstChild;
	checkBoxEngages = appendCheckBoxSpan(
		td,'delengage',filtreMonstres,' Les Engagés'
	).firstChild;
	checkBoxLevels = appendCheckBoxSpan(
		td,'delniveau',toggleLevelColumn,' Les Niveaux'
	).firstChild;
	checkBoxDiplo = appendCheckBoxSpan(
		td,'delDiplo',refreshDiplo,' La Diplomatie'
	).firstChild;
	checkBoxTrou = appendCheckBoxSpan(
		td,'deltrou',filtreLieux,' Les Trous'
	).firstChild;
	checkBoxMythiques = appendCheckBoxSpan(
		td,'delmyth',filtreMonstres,' Les Mythiques'
	).firstChild;
	if(MY_getValue('NOINFOEM')!='true') {
		checkBoxEM = appendCheckBoxSpan(
			td,'delem',filtreMonstres,' Les Composants EM'
		).firstChild;
	}
	checkBoxTresorsNonLibres = appendCheckBoxSpan(
		td,'deltres',filtreTresors,' Les Trésors non libres'
	).firstChild;
	checkBoxTactique = appendCheckBoxSpan(
		td,'deltactique',updateTactique,' Les Infos tactiques'
	).firstChild;

	if(MY_getValue('INFOPLIE')) {
		toggleTableauInfos(true);
	}
}

function toggleTableauInfos(firstRun) {
	var
		msg = document.getElementById('msgInfoTab'),
		corps = document.getElementById('corpsInfoTab'),
		infoplie = parseInt(MY_getValue('INFOPLIE'));	// 27/032016 Roule, pb sur récupération booléen, force numérique
		//window.console.log('toggleTableauInfos(' + firstRun + '), début, INFOPLIE=' + MY_getValue('INFOPLIE') + ', !INFOPLIE=' + !MY_getValue('INFOPLIE') + ', infoplie=' + infoplie);	// debug Roule
	if(!firstRun) {
		infoplie = !infoplie;
		MY_setValue('INFOPLIE', infoplie ? 1 : 0);	// 27/032016 Roule, pb sur récupération booléen, force numérique
		//window.console.log('toggleTableauInfos(' + firstRun + '), après toggle et set, INFOPLIE=' + MY_getValue('INFOPLIE') + ', infoplie=' + infoplie);	// Debug Roule
	}
	if(infoplie) {
		msg.style.display = '';
		corps.style.display = 'none';
	} else {
		msg.style.display = 'none';
		corps.style.display = '';
	}
}

/* [functions] Filtres */
function prepareFiltrage(ref,width) {
// = Initialise le filtre 'ref'
	try {
		var tdTitre = document.getElementById(ref.toLowerCase()).closest('td');
	} catch(e) {
		window.console.warn('[prepareFiltrage] Référence filtrage '+ref+' non trouvée', e);
		return false;
	}
	if(width) { tdTitre.width = width+'px'; }
	// Ajout du tr de Filtrage (masqué)
	var tbody = tdTitre.parentNode.parentNode;
	var tr = appendTr(tbody,'mh_tdpage');
	tr.style.display = 'none';
	tr.id = 'trFiltre'+ref;
	var td = appendTd(tr);
	td.colSpan = 5;
	// Ajout du bouton de gestion de Filtrage
	var tdBtn = insertAfterTd(tdTitre);
	tdBtn.id = 'tdInsert'+ref;
	var btn = appendButton(tdBtn,'Filtrer');
	btn.id = 'btnFiltre'+ref;
	btn.onclick = function() {
		debutFiltrage(ref);
	};
	return td;
}

function debutFiltrage(ref) {
	// = Handler de début de filtrage (filtre 'ref')
	var e = document.getElementById('trFiltre'+ref);
	if (e) e.style.display = '';
	var btn = document.getElementById('btnFiltre'+ref);
	if (btn) {
		btn.value = 'Annuler Filtre';
		btn.onclick = function() {
			finFiltrage(ref);
		};
	}
}

function finFiltrage(ref) {
// = Handler de fin de filtrage (filtre 'ref')
	/* On réassigne le bouton 'Filtrer' */
	document.getElementById('trFiltre'+ref).style.display = 'none';
	var btn = document.getElementById('btnFiltre'+ref);
	btn.value = 'Filtrer';
	btn.onclick = function() {
		debutFiltrage(ref);
	};
	/* Réinitialisation filtres */
	document.getElementById('str'+ref).value = '';
	switch(ref) {
		case 'Monstres':
			document.getElementById('nivMinMonstres').value = 0;
			document.getElementById('nivMaxMonstres').value = 0;
			document.getElementById('FamilleMonstres').value = 0;
			break;
		case 'Trolls':
			document.getElementById('strGuildes').value = '';
	}
	/* Nettoyage (=lance le filtre) */
	// Ici this = MZ.global = sandBox de travail de MZ
	// Roule 11/03/2016, ne fonctionne plus, il faut traiter les cas
	//this['filtre'+ref]();
	switch (ref) {
		case 'Monstres':
			filtreMonstres();
			break;
		case 'Trolls':
			filtreTrolls();
			break;
		case 'Tresors':
			filtreTresors();
			break;
		case 'Lieux':
			filtreLieux();
			break;
		default:
			window.console.log('cas incongru dans finFiltrage : ' + ref);
			break;
	}
}

function ajoutFiltreStr(td,nomBouton,id,onClick) {
	var bouton = appendButton(td,nomBouton,onClick);
	appendText(td,'\u00a0');
	var textbox = appendTextbox(td,'text',id,15,30);
	textbox.onkeypress = function(event) {
		try {
			if(event.keyCode==13) {
				event.preventDefault();
				bouton.click();
			}
		}
		catch(e){
			window.alert(e)
		}
	};
}

function ajoutFiltreMenu(tr,id,onChange,liste) {
	var select = document.createElement('select');
	select.id = id;
	select.onchange = onChange;
	appendOption(select,0,'Aucun');
	if (liste == undefined) {
		for(var i=1 ; i<=60 ; i++) {
			appendOption(select,i,i);
		}
	} else {
		liste.forEach(function(f) {appendOption(select,f,f);});
	}
	tr.appendChild(select);
	return select;
}

function ajoutDesFiltres() {
	/* Monstres */
	var td = prepareFiltrage('Monstres',130);
	if(td) {
		ajoutFiltreStr(td,'Nom du monstre:','strMonstres',filtreMonstres);
		appendText(td,'\u00a0\u00a0\u00a0');
		appendText(td,'Niveau Min: ');
		comboBoxNiveauMin = ajoutFiltreMenu(td,'nivMinMonstres',filtreMonstres);
		appendText(td,'\u00a0');
		appendText(td,'Niveau Max: ');
		comboBoxNiveauMax = ajoutFiltreMenu(td,'nivMaxMonstres',filtreMonstres);
		appendText(td,'\u00a0');
		appendText(td,'Famille: ');
		comboBoxFamille = ajoutFiltreMenu(td,'FamilleMonstres',filtreMonstres,['Animal', 'Insecte','Démon','Humanoide','Monstre','Mort-Vivant']);
	}
	/* Trõlls */
	td = prepareFiltrage('Trolls',50);
	if(td) {
		ajoutFiltreStr(td,'Nom du trõll:','strTrolls',filtreTrolls);
		appendText(td,'\u00a0\u00a0\u00a0');
		ajoutFiltreStr(td,'Nom de guilde:','strGuildes',filtreTrolls);
	}
	/* Trésors */
	td = prepareFiltrage('Tresors',55);
	if(td) {
		ajoutFiltreStr(td,'Nom du trésor:','strTresors',filtreTresors);
	}
	/* Lieux */
	td = prepareFiltrage('Lieux',40);
	if(td) {
		ajoutFiltreStr(td,'Nom du lieu:','strLieux',filtreLieux);
	}
}

/*-[functions]--------------- Fonctions Monstres -----------------------------*/

function MZ_insertStyleNth(eStyle, newCol, newStyle, maxCol) {	// DOMElement du style, numéro de colonne insérée, Style supplémentaire, nombre max de col (pas grave si c'est beaucoup plus grand)
	// cette fonction patche la série de styles en "déplaçant" les colonnes qui suivent celle insérée
	var sStyle = eStyle.innerHTML;
	for (var i = maxCol; i >= newCol; i--) {	// on déplace à partir de la fin
		// Roule : j'avais utilisé string.replaceAll() mais ce n'est pas supporté par Firefox ESR
		var rNeedle = new RegExp('\\(' + (i+1) + '\\)', "g");	// les styles "nth" comptent à partir de "1"
		sStyle = sStyle.replace(rNeedle, '(' + (i+2) + ')');
	}
	sStyle += newStyle;
	eStyle.innerHTML = sStyle;
}

/* [functions] Affichage de la colonne des niveaux */
function insertLevelColumn() {
	// Appelé dans le code attaché à la page de vue et au click/unclick de la checkbox

	MZ_EtatCdMs.indexCellNivMZ = MZ_EtatCdMs.indexCellID + 1;	// la colonne des niveaux sera insérée après la colonne des ID
	MZ_EtatCdMs.indexCellX += 1;	// et ça décale les colonnes suivantes
	MZ_EtatCdMs.indexCellY += 1;
	MZ_EtatCdMs.indexCellN += 1;
	var td = insertThText(getMonstreLevelNode(0),'Niv.',false);
	//td.width = 25;

	/* plus de colgroup le 08/07/2020. Mais comme ça pourrait revenir, je laisse le bout de code en commentaire (Roule)
	var eColGroup = getMonstreLevelNode(0).closest('table').getElementsByTagName('colgroup')[0];
	var eCol = document.createElement('col');
	eCol.style.width= '35px';
	insertBefore(eColGroup.children[3],eCol);
	*/
	var monsterStyle = document.getElementById('mh_vue_hidden_monstres').getElementsByTagName('style')[0];
	var styleColNivMZ = '.mh_tdborder.footable#VueMONSTRE th:nth-child(' + (MZ_EtatCdMs.indexCellNivMZ + 1) + ') {width:35px; text-align:center;}';
	styleColNivMZ += '.mh_tdborder.footable#VueMONSTRE td:nth-child(' + (MZ_EtatCdMs.indexCellNivMZ + 1) + ') {font-weight:bold;text-align:center;}';
	MZ_insertStyleNth(monsterStyle, MZ_EtatCdMs.indexCellNivMZ, styleColNivMZ, MZ_EtatCdMs.indexCellN);

	td.id = 'MZ_TITRE_NIVEAU_MONSTRE';
	for(var i=1 ; i<=MZ_EtatCdMs.nbMonstres ; i++) {
		//window.console.log('nbMonstres=' + MZ_EtatCdMs.nbMonstres + ', MZ_EtatCdMs.tr_monstres.length=' + MZ_EtatCdMs.tr_monstres.length);	// debug Roule
		td = insertTdText(getMonstreLevelNode(i), '-');
	}
}

function toggleLevelColumn() {	// Appelé par le code attaché à la page de vue et au click/unclick de la checkbox NOCDM
	var eltMZ_TITRE_NIVEAU_MONSTRE = document.getElementById('MZ_TITRE_NIVEAU_MONSTRE');	// test si la colonne a déjà été ajoutée
	if(saveCheckBox(checkBoxLevels,'NOLEVEL')) {
		if (!eltMZ_TITRE_NIVEAU_MONSTRE) return;	// rien à faire si la colonne n'existe pas. C'est le cas à l'ouverture de la page avec NOCMD coché
		// cacher tous les td
		for(var i=0 ; i<=MZ_EtatCdMs.nbMonstres ; i++) {
			getMonstreLevelNode(i).style.display = 'none';
		}
	} else {
		if (!eltMZ_TITRE_NIVEAU_MONSTRE) {
			insertLevelColumn();
			retrieveCDMs();
		} else {
			// afficher tous les td
			for(var i=0 ; i<=MZ_EtatCdMs.nbMonstres ; i++) {
				getMonstreLevelNode(i).style.display  = '';
			}
		}
	}
}

/* [functions] Gestion de l'AFFICHAGE des CdMs */
function basculeCDM(nom,id) {
// = Bascule l'affichage des popups CdM
	if(MZ_EtatCdMs.listeCDM[id]) {
		if(!document.getElementById('popupCDM'+id)) {
			afficherCDM(nom, id);
		} else {
			cacherPopupCDM('popupCDM'+id);
		}
	} else {
		// DEBUG: prévoir un "else" ou désactiver l'effet onmouseover si pas de CdM
		window.console.log("pas de CdM pour id=" + id + ', nom=' + nom);
	}
}

function cacherPopupCDM(titre) {
	var popup = document.getElementById(titre);
	popup.parentNode.removeChild(popup);
}

function removeTableFromClickEvent() {	// "this" est supposé être un <td> ou <th> d'une <table>
	var table = this.parentNode.parentNode.parentNode;	// <tr><tbody/thead/tfoot><table>
	table.parentNode.removeChild(table);
}

/* DEBUG: Section à mettre à jour */
var selectionFunction;

function startDrag(evt) {
	winCurr = this.parentNode;
	evt = evt || window.event; // est-ce utile sous FF ? sous FF24+ ?
	offsetX = evt.pageX - parseInt( winCurr.style.left );
	offsetY = evt.pageY - parseInt( winCurr.style.top );
	selectionFunction = document.body.style.MozUserSelect;
	document.body.style.MozUserSelect = 'none';
	winCurr.style.MozUserSelect = 'none';
	return false;
}

function stopDrag(evt) {
	winCurr.style.MozUserSelect = selectionFunction;
	document.body.style.MozUserSelect = selectionFunction;
	winCurr = null;
}

function drag(evt) {
	if(winCurr==null) { return; }
	evt = evt || window.event;
	winCurr.style.left = (evt.pageX - offsetX)+'px';
	winCurr.style.top = (evt.pageY - offsetY)+'px';
	return false;
}
/* FIN DEBUG */
if(!isPage("MH_Play/Play_equipement")) {
	// Conflit overlib/Tout_MZ:
	// Double définition du "onmousemove" sur la page d'équipement
	document.onmousemove = drag;
}

function afficherCDM(nom,id) {
// Crée la table de CdM du mob n° id
	var donneesMonstre = MZ_EtatCdMs.listeCDM[id];
	/* Début création table */
	var table = createCDMTable(id,nom,donneesMonstre, removeTableFromClickEvent);
	/* Ajout du titre avec gestion Drag & Drop */
	var tr = table.firstChild;
	tr.style.cursor = 'move';
	tr.onmousedown = startDrag;
	tr.onmouseup = stopDrag;
	/* à supprimer, remplacé par un "x" sur l'entête
	// Ajout du bouton "Fermer"
	tr = appendTr(table.childNodes[1], 'mh_tdtitre');
	tr.style.cursor = 'pointer';
	tr.onmouseover = function() {
		this.className = 'mh_tdpage';
	};
	tr.onmouseout = function() {
		this.className = 'mh_tdtitre';
	};
	tr.idcdm = id;
	tr.onclick = function() {
		cacherPopupCDM('popupCDM'+this.idcdm);
		this.className = 'mh_tdtitre';
	};
	td = appendTdText(tr,'Fermer',true);
	td.colSpan = 2;
	td.style = 'text-align:center;';
	*/
	table.id = 'popupCDM'+id;
	table.style.position = 'fixed';
	table.style.backgroundColor = 'rgb(229, 222, 203)';
	table.style.zIndex = 1;
	//var topY = +(300+(30*MZ_EtatCdMs.yIndexCDM))%(30*Math.floor((window.innerHeight-400)/30));
	table.style.left = +(window.innerWidth-365)+'px';
	table.style.width = '300px';
	/* Fin création table & Affichage */
	document.body.appendChild(table);
	var topY = 90 + (30*MZ_EtatCdMs.yIndexCDM);
	//window.console.log('topY=' + topY + ', offsetHeight=' + table.offsetHeight + ', innerHeight=' + window.innerHeight);
	if ((topY + table.offsetHeight) > window.innerHeight) {
		MZ_EtatCdMs.yIndexCDM = 0;	// on se repositionne en haut s'il n'y a pas assez de place
		topY = 90;
	} else {
		MZ_EtatCdMs.yIndexCDM++;	// décalage pour la fois suivante
	}
	table.style.top = topY + 'px';
}

/* [functions] Gestion de l'AFFICHAGE des Infos de combat */
function showPopupError(sHTML) {
	window.console.log('[MZ] affichage PopupError ' + sHTML);
	var divpopup = document.createElement('div');
	divpopup.id = 'divpopup';
	divpopup.style =
		'position: fixed;'+
		'border: 3px solid #000000;'+
		'top: 300px;left: 10px;'+
		'background-color: red;'+
		'color: white;'+
		'font-size: xx-large;'+
		'z-index: 200;';
	divpopup.innerHTML = sHTML;
	var divcroix = document.createElement('div');
	divcroix.style =
		'position: absolute;'+
		'top: 0;right: 0;'+
		'color: inherit;'+
		'font-size: inherit;'+
		'cursor: pointer;'+
		'z-index: 201;';
	divcroix.innerHTML = "X";
	divcroix.onclick = function () {document.getElementById('divpopup').style.display = 'none';};
	document.body.appendChild(divpopup);
	divpopup.appendChild(divcroix);
}

function retrieveCDMs() {
// Récupère les CdM disponibles dans la BDD
// Lancé uniquement sur toggleLevelColumn
	if(checkBoxLevels.checked) return;
	if (MZ_EtatCdMs.nbMonstres < 1) return;

	var tReq = [];
	var nbReq = 0;
	var prevLastIndexDone = MZ_EtatCdMs.lastIndexDone;
	for (var i=prevLastIndexDone+1 ; i<=MZ_EtatCdMs.nbMonstres ; i++) {
		//tReq.push(i + "\t" + getMonstreID(i) + "\t" + getMonstreNom(i));
		// ne pas demander pour les Gowaps
		var nom = getMonstreNom(i);
		if (nom.match(/^[^\[]*Gowap/i)) {	// le mot Gowap peut être précédé par un template (qui ne contient donc pas [)
			getMonstreLevelNode(i).innerHTML = '';
			continue;
		}
		tReq.push({'index':i, 'id':getMonstreID(i), 'nom':nom});
		nbReq++;
		if (nbReq >= 500) break;	// limitation pour ne pas faire attendre, et aussi car on a un dépassement mémoire coté serveur si c'est trop gros
	}
	MZ_EtatCdMs.lastIndexDone = i;
	var startAjaxCdM = new Date();
	window.console.log('[MZ] ' + MZ_formatDateMS() + ' lancement AJAX ' + nbReq + ' demandes niveaux monstres V2');

	FF_XMLHttpRequest({
		method: 'POST',
		url: URL_MZgetCaracMonstre,
		headers : {
			'Content-type':'application/x-www-form-urlencoded'
		},
		//data: 'l=' + tReq.join("\n"),
		data: 'l=' + JSON.stringify(tReq),
		trace: 'demande niveaux monstres V2',
		onload: function(responseDetails) {
			try {
				//window.console.log('retrieveCDMs readyState=' + responseDetails.readyState + ', error=' + responseDetails.error + ', status=' + responseDetails.status);
				if (responseDetails.status == 0) return;
				//window.console.log('[MZd] ' + (+new Date) + ' ajax niv monstres début');
				var texte = responseDetails.responseText;
				var infos = JSON.parse(texte);
				displayScriptTime(new Date().getTime()-date_debut.getTime(), 'Analyse des CdM MZ');
				if(infos.length==0) return;

				// ajouter les styles CSS pour les popup
				var mystyle = document.createElement('style');
				mystyle.type = 'text/css';
				var sCSS = '.MZtooltip {position: relative;color:red;text-align:center;}\n';
				sCSS += '.MZtooltip .MZtooltiptext {visibility: hidden;width: 250px;padding: 5px 0;border:solid 1px;position: absolute;z-index: 1;color:black;background-color:white}\n';
				sCSS += '.MZtooltip:hover .MZtooltiptext {visibility: visible;}\n';
				mystyle.innerHTML = sCSS;
				document.getElementsByTagName('head')[0].appendChild(mystyle);

				// if (MY_DEBUG) {
					// for (var i = 0; i < 20; i++) window.console.log('infos[' + i + ']=' + JSON.stringify(infos[i]));
				// }
				var begin2, end2, index;
				for(var j=0 ; j<infos.length ; j++) {
					var info = infos[j];
					if (info.index == undefined) continue;
					var eTdLevel = getMonstreLevelNode(info.index)
					this.className = 'mh_tdpage';
					var myColor = undefined;
					if (info.niv != undefined && info.niv.max == -1 && info.Mode != 'cdm') {
						eTdLevel.className = "MZtooltip";
						eTdLevel.style.color = "black";
						eTdLevel.innerHTML = 'Var.<span class="MZtooltiptext">Ce monstre est variable.<br />On ne peut pas avoir d\'information sans CdM.</span>';
					} else if (!(info && info.esq)) {
						//if (MY_DEBUG) window.console.log("pas d'esquive id=" + info.id + ", index=" + info.index);
						eTdLevel.className = "MZtooltip";
						eTdLevel.innerHTML = mkMinMaxHTML(info.niv) + '<span class="MZtooltiptext">Désolé, pas de CdM dans MZ pour ce type de monstre (même âge, même template).<br />Vous pouvez aider en envoyant une CdM à MZ.</span>';
					} else {
						eTdLevel.innerHTML = mkMinMaxHTML(info.niv);
						//info.iTR = info.index;	// Roule 29/04/2017 permet de récupérer la position du monstres dans analyseTactique (pour calcul de distance pour le PM). 15/11/2019 index contient l'info
						myColor = MZ_CdMColorFromMode(info);
						eTdLevel.style.cursor = 'pointer';
						eTdLevel.onclick = function() {
							basculeCDM(
								getMonstreNomByTR(this.parentNode),
								getMonstreIDByTR(this.parentNode)
							);
						};
					}
					MZ_EtatCdMs.listeCDM[info.id] = info;
					if (myColor) eTdLevel.style.color = myColor;
/* Roule' à étudier plus tard, cette différence de style selon la diplo...
						eTdLevel.onmouseover = function() {
							this.className = 'mh_tdtitre';
						};
						eTdLevel.onmouseout = function() {
							if(this.parentNode.diploActive=='oui') {
								this.className = '';
							} else {
								this.className = 'mh_tdpage';
							}
						};
*/
				}
				if (MY_DEBUG) window.console.log('[MZd] ' + MZ_formatDateMS() + ' ajax niv monstres avant computeMission');
				computeMission(prevLastIndexDone+1, MZ_EtatCdMs.nbMonstres);
				if (MY_DEBUG) window.console.log('[MZd] ' + MZ_formatDateMS() + ' ajax niv monstres avant filtreMonstres');
				filtreMonstres();	// ajout Roule' 20/01/2017 car il y a des cas où les données arrivent après le filtrage
				if (MY_DEBUG) window.console.log('[MZd] ' + MZ_formatDateMS() + ' ajax niv monstres fin');
				document.body.dataset.MZ_Etat = 2;	// indiquer aux scripts tiers qu'on a récupéré les carac
				if (document.body.MZ_Callback_fin_vue !== undefined) {
					for (var iCallback = 0;  iCallback < document.body.MZ_Callback_fin_vue.length; iCallback++) {
						document.body.MZ_Callback_fin_vue[iCallback]();
					}
				}
			} catch(e) {
				window.console.error(traceStack(e, 'retrieveCDMs')+'\n'+URL_MZgetCaracMonstre+'\n'+texte);
			}
			//if (MY_DEBUG) window.console.log('id=6376829, info=' + JSON.stringify(MZ_EtatCdMs.listeCDM[6376829]));
			MZ_EtatCdMs.isCDMsRetrieved=true;
			// afficher/supprimer le bouton pour demander la suite
			var eltBoutonSuite = document.getElementById('MZ_boutonSuiteCdM');
			window.console.log('[MZ] lastIndexDone=' + MZ_EtatCdMs.lastIndexDone + ', nbMonstres=' + MZ_EtatCdMs.nbMonstres + ', eltBoutonSuite=' + eltBoutonSuite);
			if (MZ_EtatCdMs.lastIndexDone < MZ_EtatCdMs.nbMonstres) {
				if (eltBoutonSuite) {
					while (eltBoutonSuite.firstChild) eltBoutonSuite.removeChild(eltBoutonSuite.firstChild);	// vider
					appendText(eltBoutonSuite, 'en cours ' + MZ_EtatCdMs.lastIndexDone + "/" + MZ_EtatCdMs.nbMonstres);
					retrieveCDMs();	// lancer la suite
				} else {
					eltBoutonSuite = document.createElement('div');
					eltBoutonSuite.id = 'MZ_boutonSuiteCdM';
					eltBoutonSuite.style.position = 'fixed';
					eltBoutonSuite.style.border = '1px solid black';
					eltBoutonSuite.style.top = '10px';
					eltBoutonSuite.style.right = '10px';
					//eltBoutonSuite.style.backgroundColor = 'white';
					eltBoutonSuite.style.backgroundImage = 'url("/mountyhall/MH_Packs/packMH_parchemin/fond/fond2.jpg")';
					eltBoutonSuite.style.color = 'black';
					eltBoutonSuite.style.fontSize = 'large';
					eltBoutonSuite.style.padding = '5px';
					eltBoutonSuite.style.borderRadius  = '10px';
					eltBoutonSuite.style.cursor = 'pointer';
					eltBoutonSuite.style.zIndex = '500';
					appendText(eltBoutonSuite, nbReq + ' CdM(s) récupérées');
					appendBr(eltBoutonSuite);	// C'est plus classe que d'utiliser innerHTML ☺
					appendText(eltBoutonSuite, 'Cliquer ici pour demander les CdMs');
					appendBr(eltBoutonSuite);
					appendText(eltBoutonSuite, 'des ' + MZ_EtatCdMs.nbMonstres + ' monstres');
					eltBoutonSuite.title = 'Shift-Click pour faire disparaitre ce bouton sans demander les CdMs';
					eltBoutonSuite.onclick = MZ_SuiteCdMs;
					document.body.appendChild(eltBoutonSuite);
				}
			} else {
				if (eltBoutonSuite) eltBoutonSuite.parentNode.removeChild(eltBoutonSuite);
			}
		},
	});
	//str = '';
	//begin = i+1;
	if (MY_DEBUG) window.console.log('[MZd] ' + MZ_formatDateMS() + ' requête ajax partie pour ' + tReq.length + ' monstres');
}

function MZ_CdMColorFromMode(info) {
	switch (info.Mode) {
		case 'cdm':
			return 'blue';
		case 'stat':
			return 'purple';
		case 'statV1':
			return 'orange';
	}
}

function MZ_SuiteCdMs(e) {	// handler du click sur le bouton pour demander la suite des CdMs
	var evt = e || window.event;
	if (evt.shiftKey) {
		this.parentNode.removeChild(this);
		return;
	}
	while (this.firstChild) this.removeChild(this.firstChild);	// vider
	appendText(this, 'en cours ' + MZ_EtatCdMs.lastIndexDone + "/" + MZ_EtatCdMs.nbMonstres);
	this.title = 'Shift-Click pour faire disparaitre ce bouton';
	this.style.cursor = '';	// default
	this.onclick = MZ_SupprBoutonCdMs;
	retrieveCDMs();
}

function MZ_SupprBoutonCdMs(e) {
	var evt = e || window.event;
	if (evt.shiftKey) {
		this.parentNode.removeChild(this);
	}
}

function mkMinMaxHTML(oMM) {
	if (oMM == undefined) return '';
	if (oMM.min == undefined) {
		if (oMM.max == undefined) {
			return;
		} else {
			return "\u2A7D" + oMM.max;	// U+2A7D "LESS-THAN OR SLANTED EQUAL TO"
		}
	} else {
		if (oMM.max == undefined) {
			return "\u2A7E" + oMM.min;	// U+2A7E "GREATER-THAN OR SLANTED EQUAL TO"
		} else if (oMM.min == oMM.max) {
			return oMM.min;
		} else if (oMM.min < oMM.max) {
			return oMM.min + '-' + oMM.max;
		} else {
			return '<span style="color:red">' + oMM.min + '-' + oMM.max + '</span>';
		}
	}
}

function computeMission(begin,end) {
// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance
	//+++window.console.log('computeMission, begin=' + begin + ', end=' + end);
	computeVLC(begin,end);
	//+++window.console.log('computeMission, après computeVLC');
	if(!begin) begin=1;
	if(!end) end=MZ_EtatCdMs.nbMonstres;
	var str = MY_getValue(numTroll+'.MISSIONS');
	if(!str) { return; }

	var urlImg = URL_MZimg+'mission.png';
	var obMissions = JSON.parse(str);

	for(var i=end ; i>=begin ; i--) {
		var mess = '';
		var bPeutEtreIcone = false;
		for(var num in obMissions) {
			var mobMission = false;
			var mobMissionPeutEtre = undefined;
			switch(obMissions[num].type) {
				case 'Race':
					var race = epure(obMissions[num].race.toLowerCase());
					var nom = epure(getMonstreNom(i).toLowerCase());
					if(nom.indexOf(race)!=-1) {
						if (race == 'crasc') {
							if (nom.indexOf('medius')!=-1) {
								// pas éligible
							} else if (nom.indexOf('maexus')!=-1) {
								// pas éligible
							} else if (nom.indexOf('parasitus')!=-1) {
								if (nom.match(/^crasc parasitus \[/ui)) {
									// on ne peut pas savoir
									mobMissionPeutEtre = 'Impossible de savoir si ce monstre a comme race "Crasc" ou "Crasc Parasitus"\n'
										+ 'Faire une CdM. Si la portée de pouvoir est "automatique", il s\'agit d\'un "Crasc", si elle est "au toucher", il s\'agit d\'un "Crasc Parasitus"';
								} else {
									// c'est un monstre de la race des Crasc Parasitus
									mobMission = false;
								}
							} else {
								mobMission = true;
							}
						} else if (race == 'crasc parasitus') {
							if (nom.match(/^crasc parasitus \[/ui)) {
								// on ne peut pas savoir
								mobMissionPeutEtre = 'Impossible de savoir si ce monstre a comme race "Crasc" ou "Crasc Parasitus"\n'
									+ 'Faire une CdM. Si la portée de pouvoir est "automatique", il s\'agit d\'un "Crasc", si elle est "au toucher", il s\'agit d\'un "Crasc Parasitus"';
							} else {
								// c'est un monstre de la race des Crasc Parasitus
								mobMission = true;
							}
						} else if (race == 'shai') {
							if (nom.match(/abishai/ui)) {
								mobMission = false;
							} else {
								mobMission = true;
							}
						} else if (race == 'ombre') {
							if (nom.match(/roche/ui)) {
								mobMission = false;
							} else {
								mobMission = true;
							}
						} else if (race == 'geck\'oo') {
							if (nom.match(/majestueux/ui)) {
								mobMission = false;
							} else {
								mobMission = true;
							}
						} else if (race == 'bouj\'dla') {
							if (nom.match(/placide/ui)) {
								mobMission = false;
							} else {
								mobMission = true;
							}
						} else {
							mobMission = true;
						}
					}
					break;
				case 'Niveau':
					var donneesMonstre = MZ_EtatCdMs.listeCDM[getMonstreID(i)];
					if (donneesMonstre) {
						var nivMimi = Number(obMissions[num].niveau);
						var mod = obMissions[num].mod;	// mission nivMimi±mod si mod est numérique, sinon, c'est >= nivMimi
						if (isNaN(mod)) {
							var minMimi = nivMimi;
							var maxMimi = nivMimi + 999999;
						} else {
							var minMimi = nivMimi - mod;
							var maxMimi = nivMimi + mod;
						}
						if (donneesMonstre.niv) {	// nouveau mode
							if (donneesMonstre.niv.max && donneesMonstre.niv.min) {
								if (donneesMonstre.niv.max <= maxMimi && donneesMonstre.niv.min >= minMimi) {
									mobMission = true;
								} else if (!(donneesMonstre.niv.max <  minMimi || donneesMonstre.niv.min >  maxMimi)) {
									mobMissionPeutEtre = 'Il reste à déterminer le niveau exact du monstre';
									if (isDEV) mobMissionPeutEtre += '\nMonstre=(' + donneesMonstre.niv.min + ', ' + donneesMonstre.niv.max + '), mimi=(' + minMimi + ', ' + maxMimi + ')'
								}
							} else if (donneesMonstre.niv.max) {
								if (donneesMonstre.niv.max >= minMimi) {
									mobMissionPeutEtre = 'Il reste à déterminer le niveau exact du monstre';
								}
							} else if (donneesMonstre.niv.min) {
								if (donneesMonstre.niv.min <= maxMimi) {
									mobMissionPeutEtre = 'Il reste à déterminer le niveau exact du monstre';
								}
							}
						}
					}
					break;
				case 'Famille':
					var donneesMonstre = MZ_EtatCdMs.listeCDM[getMonstreID(i)];
					if(donneesMonstre && donneesMonstre.fam) {
						var familleMimi = epure(obMissions[num].famille.toLowerCase()).replace(/[']/g,'');	// Roule 27/02/2019 simple quote dans les familles
						var familleMob = epure(donneesMonstre.fam.toLowerCase());
						if(familleMob.indexOf(familleMimi)!=-1) {
							mobMission = true;
						}
					}
					break;
				case 'Pouvoir':
					var donneesMonstre = MZ_EtatCdMs.listeCDM[getMonstreID(i)];
					if(donneesMonstre && donneesMonstre.pouv) {
						var pvrMimi = epure(obMissions[num].pouvoir.toLowerCase());
						var pvrMob = epure(donneesMonstre.pouv.toLowerCase());
						if(pvrMob.indexOf(pvrMimi)!=-1) {
							mobMission = true;
						}
					}
			}
			if(mobMission) {
				mess += mess ? '\n\n' : '';
				mess += 'Mission '+num+' :\n'+obMissions[num].libelle;
			} else if (mobMissionPeutEtre !== undefined) {
				mess += mess ? '\n\n' : '';
				mess += mobMissionPeutEtre + '\n';
				bPeutEtreIcone = true;
				mess += 'Mission '+ num + ' :\n'+obMissions[num].libelle;
			}
		}
		if(mess) {
			var td = getMonstreNomNode(i);
			appendText(td,' ');
			var myURL;
			if (bPeutEtreIcone) {
				myURL = URL_MZimg+'missionX.png';
			} else {
				myURL = urlImg;
			}
			td.appendChild(createImage(myURL,mess));
		}
	}
}

function computeVLC(begin,end) {
// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance via computeMission
	//+++window.console.log('computeVLC, begin=' + begin + ', end=' + end);
	computeTactique(begin,end);
	//+++window.console.log('computeVLC, après computeTactique');
	if(!begin) begin=1;
	if(!end) end=MZ_EtatCdMs.nbMonstres;
	var cache = getSortComp("Invisibilité")>0 || getSortComp("Camouflage")>0;
	if(!cache)
		return false;
	var urlImg = URL_MZimg + "oeil.png";
	for(var i = end; i >= begin;i--)
	{
		var id = getMonstreID(i);
		var donneesMonstre = MZ_EtatCdMs.listeCDM[id];
		var vlc = false;
		/* ancien mode à supprimer
		if(donneesMonstre && donneesMonstre.length>12)
		{
			if(donneesMonstre[12]==1) vlc = 1;
		}
		// */
		// nouveau mode
		if (donneesMonstre && donneesMonstre.vlc) {
			//if (donneesMonstre) window.console.log('computeVLC i=' + i + ' id=' + id + ' ' + JSON.stringify(donneesMonstre));
			var td = getMonstreNomNode(i);
			td.appendChild(document.createTextNode(" "));
			td.appendChild(createImage(urlImg, "Voit le caché"));
		}
		if (donneesMonstre && donneesMonstre.gen) {
			switch (donneesMonstre.gen) {
				case 1:
					var imgPh = URL_MZimg + "Phoenix1.png";
					var txtPh = 'Phœnix de première génération';
					break;
				case 2:
					var imgPh = URL_MZimg + "Phoenix2.png";
					var txtPh = 'Phœnix de deuxième génération';
					break;
				case 3:
					var imgPh = URL_MZimg + "Phoenix3.png";
					var txtPh = 'Phœnix de troisième génération';
					break;
				case 23:
					var imgPh = URL_MZimg + "Phoenix23.png";
					var txtPh = 'Phœnix de deuxième ou troisième génération';
					break;
			}
			var td = getMonstreNomNode(i);
			td.appendChild(document.createTextNode(" "));
			var img = td.appendChild(createImage(imgPh, txtPh));
			img.style.height = '15px';
			img.style.width = 'auto';
		}
	}
}

/* appelé
par updateTactique
	par initialiseInfos
		par do_vue
par computeVLC
	par computeMission
		par filtreMonstres
		par retrieveCDMs
*/
function computeTactique(begin, end) {
// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance via computeVLC
	try {
		if(!begin) begin = 1;
		if(!end) end = MZ_EtatCdMs.nbMonstres;
		//+++window.console.log('computeTactique, begin=' + begin + ', end=' + end + ', checkBoxTactique=' + checkBoxTactique);
		var noTactique = saveCheckBox(checkBoxTactique,'NOTACTIQUE');
		//+++window.console.log('computeTactique, noTactique=' + noTactique);
		if(noTactique || !isProfilActif()) return;
		//+++window.console.log('computeTactique, après isProfilActif');

		for(var j=end ; j>=begin ; j--) {
			var id = getMonstreID(j);
			var nom = getMonstreNom(j);
			var donneesMonstre = MZ_EtatCdMs.listeCDM[id];
			var bShowTactique = false;
			//if (isDEV) {
				if (donneesMonstre && donneesMonstre.esq) bShowTactique = true;
			// } else {
				// if(donneesMonstre && nom.indexOf('Gowap')==-1) bShowTactique = true;
			// }
			if (bShowTactique) {
				var td = getMonstreNomNode(j);
				appendText(td,' ');
				td.appendChild(MZ_Tactique.createImage(id, nom));
			}
		}
	}
	catch(e) {
		window.console.error(traceStack(e, 'computeTactique')+'\nmob num : ' + j);
	}
	filtreMonstres();
}

function updateTactique() {
// = Handler checkBox noTactique
	var noTactique = saveCheckBox(checkBoxTactique,'NOTACTIQUE');
	//+++window.console.log('updateTactique, noTactique=' + noTactique);
	if(!MZ_EtatCdMs.isCDMsRetrieved) return;
	//+++window.console.log('updateTactique, isCDMsRetrieved=' + MZ_EtatCdMs.isCDMsRetrieved);

	if(noTactique) {
		for(var i=MZ_EtatCdMs.nbMonstres ; i>0 ; i--) {
			var tr = getMonstreNomNode(i);
			var img = document.evaluate("img[@src='"+URL_MZimg+"calc2.png']",
				tr, null, 9, null).singleNodeValue;
			if(img) {
				img.parentNode.removeChild(img.previousSibling);
				img.parentNode.removeChild(img);
				}
			}
		}
	else
		computeTactique();
}

function filtreMonstres() {
// = Handler universel pour les fonctions liées aux monstres
	var urlImg = URL_MZimg+'Competences/ecritureMagique.png',
	urlEnchantImg = URL_MZimg+'enchant.png';

	/* Vérification/Sauvegarde de tout ce qu'il faudra traiter */
	var useCss = MY_getValue(numTroll+'.USECSS')=='true';
	var noGowapsS = saveCheckBox(checkBoxGowapsS,'NOGOWAPS');
	var noGowapsA = saveCheckBox(checkBoxGowapsA,'NOGOWAPA');
	var noEngages = saveCheckBox(checkBoxEngages,'NOENGAGE');
	var nivMin = saveComboBox(comboBoxNiveauMin,'NIVEAUMINMONSTRE');
	var nivMax = saveComboBox(comboBoxNiveauMax,'NIVEAUMAXMONSTRE');
	var famille = saveComboBox(comboBoxFamille,'FAMILLEMONSTRE');
	// old/new : détermine s'il faut ou non nettoyer les tr
	var oldNOEM = true, noEM = true;
	if(MY_getValue('NOINFOEM')!='true') {
		noEM = saveCheckBox(checkBoxEM, 'NOEM');
	}
	// Filtrage par nom
	var eMonstre = document.getElementById('strMonstres');
	if (!eMonstre) return;	// cas smartphone
	var strMonstre = eMonstre.value.toLowerCase();
	// Génère la liste des mobs engagés (si filtrés)
	if(noEngages && !isEngagesComputed) {
		for(var i=nbTrolls ; i>0 ; i--) {
			var pos = getTrollPosition(i);
			if(!listeEngages[pos[0]]) { listeEngages[pos[0]]={}; }
			if(!listeEngages[pos[0]][pos[1]]) { listeEngages[pos[0]][pos[1]]={}; }
			listeEngages[pos[0]][pos[1]][pos[2]] = 1;
		}
		isEngagesComputed = true;
	}

	/*** FILTRAGE ***/
	/* À computer :
	 * - EM (nom suffit)
	 * - Enchant (nom suffit)
	 * - Mission (nécessite CdM)
 	 * - mob VlC (nécessite CdM)
	 * Sans computation :
	 * - Gowap ? engagé ?
	 */
	for(var i=MZ_EtatCdMs.nbMonstres ; i>0 ; i--) {
		var pos = getMonstrePosition(i);
		var nom = getMonstreNom(i).toLowerCase();
		if(noEM!=oldNOEM) {
			if(noEM) {
				// Si noEM passe de false à true, on nettoie les td "Nom"
				// DEBUG: Sauf que ce serait carrément mieux avec des id...
				var tr = getMonstreNomNode(i);
				while(tr.childNodes.length>1) {
					tr.removeChild(tr.childNodes[1]);
				}
			} else {
				var tr = getMonstreNomNode(i);
				var TypeMonstre=getEM(nom);
				if(TypeMonstre!='') {
					var infosCompo=compoMobEM(TypeMonstre);
					if(infosCompo.length>0) {
						tr.appendChild(document.createTextNode(' '));
						tr.appendChild(createImage(urlImg, infosCompo));
					}
				}
			}
		}
		if(needComputeEnchantement || (noEM!=oldNOEM && noEM)) {
			var texte = getInfoEnchantementFromMonstre(nom);
			if(texte!='') {
				var td = getMonstreNomNode(i);
				td.appendChild(document.createTextNode(' '));
				td.appendChild(createImage(urlEnchantImg, texte));
			}
		}

		var dataV2 = MZ_EtatCdMs.listeCDM[getMonstreID(i)];
		MZ_EtatCdMs.tr_monstres[i].style.display = (
			noGowapsS &&
			nom.indexOf('gowap sauvage')!=-1 &&
			getMonstreDistance(i)>1
		) || (
			noGowapsA &&
			nom.indexOf('gowap apprivoisé')!=-1 &&
			getMonstreDistance(i)>1
		) || (
			noEngages &&
			getMonstreDistance(i)!=0 &&
			listeEngages[pos[0]] &&
			listeEngages[pos[0]][pos[1]] &&
			listeEngages[pos[0]][pos[1]][pos[2]]
		) || (
			strMonstre!='' &&
			nom.indexOf(strMonstre)==-1
		) || (
			isMonstreLevelOutLimit(i, nivMin, nivMax) &&
			getMonstreDistance(i)>1 &&
			nom.toLowerCase().indexOf("kilamo")==-1
		) || (
			famille!='0' &&
			dataV2 &&
			dataV2.fam &&
			dataV2.fam != famille
		) ? 'none' : '';
	}

	if(MY_getValue('NOINFOEM')!='true') {
		if(noEM != oldNOEM) {
			if(noEM && MZ_EtatCdMs.isCDMsRetrieved) computeMission();
		}
		oldNOEM = noEM;
	}

	needComputeEnchantement = false;
}


/*-[functions]---------------- Fonctions Trõlls ------------------------------*/

function filtreTrolls() {
	var noIntangibles = saveCheckBox(checkBoxIntangibles,'NOINT');
	var strTroll = document.getElementById('strTrolls').value.toLowerCase();
	var strGuilde = document.getElementById('strGuildes').value.toLowerCase();
	for(var i=1 ; i<=nbTrolls ; i++) {
		tr_trolls[i].style.display = (
			noIntangibles &&
			getTrollNomNode(i).firstChild.className=='mh_trolls_0'
		) || (
			strTroll!='' &&
			getTrollNomNode(i).textContent.toLowerCase().indexOf(strTroll)==-1
		) || (
			strGuilde!='' &&
			getTrollGuilde(i).toLowerCase().indexOf(strGuilde)==-1
		) ? 'none' : '';
	}
}

/* [functions] Bulle PX Trolls */
var bulle;

function initPXTroll() {
	bulle = document.createElement('div');
	bulle.id = 'bulle';
	bulle.className = 'mh_textbox';
	bulle.style =
		'position: absolute;'+
		'border: 1px solid #000000;'+
		'visibility: hidden;'+
		'display: inline;'+
		'z-index: 2;';
	document.body.appendChild(bulle);

	for(var i=nbTrolls ; i>0 ; i--) {
		var td_niv = getTrollNivNode(i);
		td_niv.onmouseover = showPXTroll;
		td_niv.onmouseout = hidePXTroll;
	}
}

function showPXTroll(evt) {
	var lvl = this.firstChild.nodeValue;
	bulle.innerHTML = 'Niveau '+lvl+analysePXTroll(lvl);
	bulle.style.left = evt.pageX+15+'px';
	bulle.style.top = evt.pageY+'px';
	bulle.style.visibility = 'visible';
}

function hidePXTroll() {
	bulle.style.visibility = 'hidden';
}

/* [functions] Envoi PX / MP */
function putBoutonPXMP() {
// Bouton d'initialisation du mode Envoi
// WARNING - Nécessite que le Filtre Trõll ait été mis en place
	var td = document.getElementById('tdInsertTrolls');
	if(!td) { return; }
	td.width = 100;
	td = insertAfterTd(td);
	td.style.verticalAlign = 'top';
	var bouton = appendButton(td,'Envoyer...',prepareEnvoi);
	bouton.id = 'btnEnvoi';
}

function prepareEnvoi() {
// = 1er Handler du bouton d'envoi

	/* Ajout de la colonne des CheckBoxes */
	var td = insertTdText(getTrollNomNode(0),'');
	td.width = 5;
	for(var i=nbTrolls ; i>0 ; i--) {
		td = insertTd(getTrollNomNode(i));
		appendCheckBox(td,'envoi'+i);
	}

	/* Ajout du radio de choix PX ou MP */
	var btnEnvoi = document.getElementById('btnEnvoi');
	if(!btnEnvoi) { return; }
	var tdEnvoi = btnEnvoi.parentNode;
	appendText(tdEnvoi,' ');
	var span = document.createElement('span');
	span.style.whiteSpace = 'nowrap';
	var radioElt = document.createElement('input');
	radioElt.type = 'radio';
	radioElt.name = 'envoiPXMP';
	radioElt.id = 'radioPX';
	span.appendChild(radioElt);
	appendText(span,' des PX ');
	radioElt = document.createElement('input');
	radioElt.type = 'radio';
	radioElt.name = 'envoiPXMP';
	radioElt.checked = true;
	span.appendChild(radioElt);
	appendText(span,' un MP');
	tdEnvoi.appendChild(span);

	/* Insertion du bouton Annuler */
	insertButton(btnEnvoi,'Annuler',annuleEnvoi);

	/* Modification de l'effet du bouton Envoi */
	document.getElementById('btnEnvoi').onclick = effectueEnvoi;
}

function annuleEnvoi() {
// = Handler bouton Annuler
	/* Nettoyage du td du bouton Envoi */
	var btnEnvoi = document.getElementById('btnEnvoi');
	var tdEnvoi = btnEnvoi.parentNode;
	while(tdEnvoi.firstChild) {
		tdEnvoi.removeChild(tdEnvoi.firstChild);
	}
	/* Retour à l'effet de base du bouton Envoi */
	btnEnvoi.onclick = prepareEnvoi;
	tdEnvoi.appendChild(btnEnvoi);
	/* Suppression CheckBoxes */
	for(var i=nbTrolls ; i>=0 ; i--) {
		var td = getTrollNomNode(i);
		td.parentNode.removeChild(td);
	}
}

function effectueEnvoi() {
// = 2e Handler du bouton d'envoi (charge un nouveau frame)
	var str='';
	var errID = false;
	for(var i=nbTrolls ; i>0 ; i--) {
		var chb = document.getElementById('envoi'+i);
		if(chb.checked)	{
			var idTroll = getTrollID(i);
			if (idTroll == undefined) {
				errID = true;
			} else {
				str += (str ? ',' : '') + idTroll;
			}
		}
	}
	if (errID) window.alert('MZ : il y a eu une erreur dans la liste, vérifiez à qui vous faites l\'envoi');
	var PXchecked = document.getElementById('radioPX').checked;
	if(PXchecked) {
		window.open('./Actions/Play_a_DonPX.php?cat=8&dest='+str,'Contenu');
	} else {
		window.open('../Messagerie/MH_Messagerie.php?cat=3&dest='+str,'Contenu');
	}
}

/*-[functions]---------------- Fonctions Trésors -----------------------------*/

function filtreTresors() {
// += Handler checkboxes : gg, compos, bidouilles, non libres
	var noGG = saveCheckBox(checkBoxGG,'NOGG');
	var noCompos = saveCheckBox(checkBoxCompos,'NOCOMP');
	var noBidouilles = saveCheckBox(checkBoxBidouilles,'NOBID');
	var noEngages = saveCheckBox(checkBoxTresorsNonLibres,'NOTRESORSNONLIBRES');
	if(noEngages && !isEngagesComputed) {
		for(var i=nbTrolls ; i>0 ; i--) {
			var pos = getTrollPosition(i);
			if(!listeEngages[pos[2]]) listeEngages[pos[2]] = [];
			if(!listeEngages[pos[2]][pos[1]]) listeEngages[pos[2]][pos[1]] = [];
			listeEngages[pos[2]][pos[1]][pos[0]] = 1;
		}
		isEngagesComputed = true;
	}
	var strTresor = document.getElementById('strTresors').value.toLowerCase();
	for(var i=nbTresors ; i>0 ; i--) {
		var nom = getTresorNom(i);
		var pos = getTresorPosition(i);
		tr_tresors[i].style.display = (
			noGG &&
			nom.indexOf('Gigots de Gob')!=-1
		) || (
			noCompos &&
			nom.indexOf('Composant')!=-1
		) || (
			noEngages &&
			listeEngages[pos[2]] &&
			listeEngages[pos[2]][pos[1]] &&
			listeEngages[pos[2]][pos[1]][pos[0]] &&
			getTresorDistance(i)>0
		) || (
			strTresor!='' &&
			nom.toLowerCase().indexOf(strTresor)==-1
		) || (
			noBidouilles &&
			nom.indexOf('Bidouille')!=-1
		) ? 'none' : '';
	}
}


/*-[functions]----------------- Fonctions Lieux ------------------------------*/

function filtreLieux() {
// += Handler checkbox trous
	var noTrou = saveCheckBox(checkBoxTrou,'NOTROU');
	var strLieu = document.getElementById('strLieux').value.toLowerCase();
	for(var i=nbLieux ; i>0 ; i--) {
		tr_lieux[i].style.display = (
			strLieu &&
			getLieuNom(i).toLowerCase().indexOf(strLieu)==-1
		) || (
			noTrou &&
			getLieuNom(i).toLowerCase().indexOf("trou de météorite")!=-1 &&
			getLieuDistance(i)>1
		) ? 'none' : '';
	}
}


/*-[functions]-------------------- Diplomatie --------------------------------*/

function refreshDiplo() {
	MY_setValue(numTroll+'.diplo.off',
		checkBoxDiplo.checked?'true':'false'
	);
	if(isDiploRaw) { computeDiplo(); }
	appliqueDiplo();
}

function computeDiplo() {
// On extrait les données de couleur et on les stocke par id
// Ordre de préséance :
//  source Guilde < source Perso
//  guilde cible < troll cible

	/* Diplo de Guilde */
	var diploGuilde = MY_getValue(numTroll+'.diplo.guilde') ?
		JSON.parse(MY_getValue(numTroll+'.diplo.guilde')) : {};
	if(diploGuilde && diploGuilde.isOn=='true') {
		// Guilde perso
		if(diploGuilde.guilde) {
			Diplo.Guilde[diploGuilde.guilde.id] = {
				couleur: diploGuilde.guilde.couleur,
				titre: 'Ma Guilde'
			};
		}
		// Guildes/Trolls A/E
		for(var AE in {Amis:0,Ennemis:0}) {
			for(var i=0 ; i<5 ; i++) {
				if(diploGuilde[AE+i]) {
					for(var type in {Guilde:0,Troll:0}) {
						var liste = diploGuilde[AE+i][type].split(';');
						for(var j=liste.length-2 ; j>=0 ; j--) {
							Diplo[type][liste[j]] = {
								couleur: diploGuilde[AE+i].couleur,
								titre: diploGuilde[AE+i].titre
							};
						}
					}
				}
			}
		}
	}

	/* Diplo Perso */
	//var diploPerso = MY_getValue(numTroll+'.diplo.perso') ? JSON.parse(MY_getValue(numTroll+'.diplo.perso')) : {};	// déjà chargé
	if(diploPerso && diploPerso.isOn=='true') {
		for(var type in {Guilde:0,Troll:0,Monstre:0}) {
			for(var id in diploPerso[type]) {
				Diplo[type][id] = diploPerso[type][id];
			}
		}
	}
	if(diploPerso.mythiques) {
		Diplo.mythiques = diploPerso.mythiques;
	}

	isDiploRaw = false;
}

function appliqueDiplo() {
	var aAppliquer = Diplo;
	if(checkBoxDiplo.checked) {
		// Pour retour à l'affichage basique sur désactivation de la diplo
		aAppliquer = {
			Guilde: {},
			Troll: {},
			Monstre: {}
		};
	}

	/* On applique "aAppliquer" */
	// Diplo Trõlls
	for(var i=nbTrolls ; i>0 ; i--) {
		var idG = getTrollGuildeID(i);
		var idT = getTrollID(i);
		var tr = tr_trolls[i];
		//window.console.log('diplo i=' + i + ', troll=' + idT + ', guilde=' + idG + ', HTML=' + tr.innerHTML);
		if(aAppliquer.Troll[idT]) {
			tr.className = '';
			var descr = aAppliquer.Troll[idT].titre;
			if(descr) {
				getTrollNomNode(i).title = descr
			}
			tr.style.backgroundColor = aAppliquer.Troll[idT].couleur;
		} else if(aAppliquer.Guilde[idG]) {
			tr.className = '';
			var descr = aAppliquer.Guilde[idG].titre;
			if(descr) {
				getTrollNomNode(i).title = descr
			}
			tr.style.backgroundColor = aAppliquer.Guilde[idG].couleur;
		} else {
			tr.className = 'mh_tdpage';
			getTrollNomNode(i).title = '';
		}
	}

	// Diplo Monstres
	for(var i=MZ_EtatCdMs.nbMonstres ; i>0 ; i--) {
		var id = getMonstreID(i);
		var nom = getMonstreNom(i).toLowerCase();
		var tr = MZ_EtatCdMs.tr_monstres[i];
		if(aAppliquer.Monstre[id]) {
			tr.className = '';
			tr.style.backgroundColor = aAppliquer.Monstre[id].couleur;
			tr.diploActive = 'oui';
			var descr = aAppliquer.Monstre[id].titre;
			if(descr) {
				getMonstreNomNode(i).title = descr;
			}
		} else if(aAppliquer.mythiques &&
			(nom.indexOf('liche')==0 ||
			nom.indexOf('hydre')==0 ||
			nom.indexOf('balrog')==0 ||
			nom.indexOf('beholder')==0 ||
			nom.indexOf('sidoine')==0)) {
			tr.className = '';
			tr.style.backgroundColor = aAppliquer.mythiques;
			tr.diploActive = 'oui';
			getMonstreNomNode(i).title = 'Monstre Mythique';
		} else {
			tr.className = 'mh_tdpage';
			tr.diploActive = '';
		}
	}
}


/*-[functions]---------------- Actions à distance ----------------------------*/

function computeActionDistante(dmin,dmax,keltypes,oussa,urlIcon,message) {
	var
		monN = parseInt(getPosition()[2]),
		isLdP = oussa=='self';

	for(var type in keltypes) {
		if (MY_DEBUG) {
			window.console.log(
				'MZ computeActionDistante(' + dmin + ', ' + dmax + ', ' +
				oussa + ', ' + urlIcon+ ', ' + message + ') type=' + type
			);
		}
		alt = oussa=='self' ? type.slice(0,-1) : oussa;
		for(var i=VueContext['nb'+type] ; i>0 ; i--)  {
			var tr = VueContext['tr_'+type.toLowerCase()][i];
			// Roule 11/03/2016, on passe par les nouvelles fonctions getXxxPosition et getXxxDistance
			//var sonN = this['get'+type.slice(0,-1)+'Position'](i)[2];
			//var d = this['get'+type.slice(0,-1)+'Distance'](i);
			var sonN = getXxxPosition(type, i)[2];
			var d = getXxxDistance(type, i);
			var thismessage = message;
			if (isLdP) {
				var chanceToucher = getTalent("Lancer de Potions") + Math.min(10,
					10 - 10 * d +
					parseInt(MY_getValue(numTroll+".caracs.vue")) +
					parseInt(MY_getValue(numTroll+".caracs.vue.bm"))
				);
				thismessage += ' (' + chanceToucher + '%)';
			}

			if(sonN==monN && d>=dmin && d<=dmax) {
				var iconeAction = document.evaluate(
					"./descendant::img[@alt='"+alt+"']",
					tr, null, 9, null
				).singleNodeValue;
				if(iconeAction) {
					if(iconeAction.title) {
						iconeAction.title += "\n"+thismessage;
					} else {
						iconeAction.title = thismessage;
					}
					iconeAction.src = urlIcon;
				} else {
					var tdAction = tr.getElementsByTagName('td')[1];
					var icon = document.createElement('img');
					icon.src = urlIcon;
					icon.height = 20;
					icon.alt = alt;
					icon.title = thismessage;
					tdAction.appendChild(icon);
				}
			}
		}
	}
}

function computeCharge() {
	computeActionDistante(1,
		getPortee(
			Math.ceil(MY_getValue(numTroll+".caracs.pv")/10)+
			MY_getValue(numTroll+".caracs.regeneration")
		),
		{'Monstres':1, 'Trolls':1},
		'Attaquer',
		MHicons+'E_Metal09.png',
		'Cible à portée de Charge'
	);
}

function computeProjo() {
	computeActionDistante(0,
		getPortee(
			parseInt(MY_getValue(numTroll+".caracs.vue"))+
			parseInt(MY_getValue(numTroll+".caracs.vue.bm"))
		),
		{'Monstres':1, 'Trolls':1},
		'Attaquer',
		MHicons+'S_Fire05.png',
		'Cible à portée de Projo'
	);
}

function computeTelek() {
	computeActionDistante(0,
		Math.floor((
			parseInt(MY_getValue(numTroll+".caracs.vue"))+
			parseInt(MY_getValue(numTroll+".caracs.vue.bm"))
		)/2),
		{'Tresors':1},
		'Telek',
		MHicons+'S_Magic04.png',
		'Trésor à portée de Télékinésie'
	);
}

function computeLdP() {
	computeActionDistante(0,
		2+Math.floor((
			parseInt(MY_getValue(numTroll+".caracs.vue"))+
			parseInt(MY_getValue(numTroll+".caracs.vue.bm"))
		)/5),
		{'Monstres':1, 'Trolls':1},
		'self',
		MHicons+'P_Red01.png',
		'Cible à portée de Lancer de Potions'
	);
}


/*-[functions]--------------- Systèmes Tactiques -----------------------------*/

function putScriptExterne(sInfo) {
	for (var iBricol = 1; ; iBricol++) {
		var extClef = iBricol == 1 ? '' : iBricol;
		var sInfo = MY_getValue(numTroll+'.INFOSIT'+extClef);
		if (!sInfo) break;
		putScriptExterneOneIT(sInfo);
	}
}

function putScriptExterneOneIT(sInfo) {
	if(!sInfo || sInfo=='') return;

	var nomit = sInfo.slice(0,sInfo.indexOf('$'));
	if(nomit=='bricol') {
		var data = sInfo.split('$');
		try {
			// Roule' 07/11/2016. Travail avec Ratibus, remplacement du script par l'envoi de JSON
			// appendNewScript(URL_bricol+data[1]
				// +'/mz.php?login='+data[2]
				// +'&password='+data[3]
				// );
			FF_XMLHttpRequest({
				method: 'GET',
				url: URL_bricol+data[1]
					+'/mz_json.php?login='+encodeURIComponent(data[2])
					+'&password='+data[3],
				trace: 'bricolTroll',
				onload: function(responseDetails) {
					try {
						if (responseDetails.status == 0) {
							window.console.log('status=0 à l\'appel bricol\'troll');
							if (isHTTPS) {
								avertissement('<br />Pour utiliser l\'interface Bricol\'Troll en HTTPS, il faut accepter le certificat2 de Raistlin (voir page d\'accueil)');
							} else {
								avertissement('<br />Erreur générale avec l\'interface Bricol\'Troll<');
							}
							return;
						}
						var ratibusData;
						try {
							ratibusData = JSON.parse(responseDetails.responseText);
						} catch(e) {}
						if (ratibusData === undefined) {
							avertissement('<br />Erreur à l\'appel de l\'interface Bricol\'Troll. Code HTTP=' + responseDetails.status + '. Pas de JSON');
							return;
						}
						if (ratibusData.error) {
							avertissement('<br />Bricol\'Troll (' + data[1] + ') a répondu :<br />' + ratibusData.error);
						} else {
							putInfosTrolls(ratibusData.data.trolls, data[1]);
						}
					} catch(e) {
						window.console.log(traceStack(e, 'retour bricol\'troll'));
						avertissement('<br />Erreur dans la réponse de Bricol\'Troll<br />' + e + '<br />' + responseDetails.responseText);
					}
				}
			});
		} catch(e) {
			if (isHTTPS) {
				avertissement('<br />Pour utiliser l\'interface Bricol\'Troll en HTTPS, il faut autoriser le contenu mixte (voir page d\'accueil)');
			} else {
				window.console.log(traceStack(e, 'appel bricol\'troll'));
				avertissement('<br />Erreur générale avec l\'interface Bricol\'Troll<br />' + e);
			}
		}
	}
}

/*
 * Roule 07/11/2016, on utilise mz_json qui envoie
 {
    "data": {
        "trolls": {
            "59424": {
                "id": 59424,
                "pv": xx,
                "pv_max": xx,
                "updated_at": "2016-10-31 07:28:40",
                "dla": "2016-10-05 07:28:04",
                "pa": 0
            },
        }
    }
}
 */

 // Roule 07/11/2016 ATTENTION, il faudrait modifier ici (remplacer [0] par .pa, etc.)
function corrigeBricolTrolls(infosTrolls) {
	for(var i in infosTrolls) {
		var pv = infosTrolls[i][0];
		var pvmax = infosTrolls[i][1];
		var pvmem = MY_getValue(i+'.caracs.pv.max');
		if(pvmem && pvmem>pvmax) {
			infosTrolls[i][1] = pvmem;
			pvmax = pvmem;
			}
		if(pv>pvmax) {
			var newpvmax = 5*Math.ceil(pv/5);
			MY_setValue(i+'.caracs.pv.max',newpvmax);
			infosTrolls[i][1] = newpvmax;
			}
		}
	}

	// insère 2 TD avant nextTD avec les infos venant de l'IT
function addTdInfosTroll(infos, TR, itName) {
	/* cadre barre PV */
	var tab = document.createElement('div');
	tab.title = infos.pv+'/'+infos.pv_max+' PV le '+ SQLDateToFrenchTime(infos.updated_at);
	/* barre PV */
	/* Roule' : sans aucune honte, j'ai copié la méthode de Bricol'Troll
	<div class="vieContainer"><div style="background-color: #77EE77; width: 90%">&nbsp;</div></div>
	.vieContainer {
	background-color: #CCC;
	width: 50px;
	height: 6px;
	border: 1px solid #000;
	text-align: left;
	}
	*/
	tab.style.width = '100px';
	tab.style.height = '10px';
	tab.style.border = '1px solid #000';
	tab.style.textAlign = 'left';
	var div2 = document.createElement('div');
	var pourcentVie = Math.floor( (100*infos.pv)/infos.pv_max );
	var dateLimite = new Date();
	dateLimite.setDate(dateLimite.getDate() - 7);
	if (infos.oUpdatedAt < dateLimite) {
		div2.style.backgroundColor = '#888888';	// infos de plus de 7 jours => grisé
		tab.title += "\nLes informations sont trop vieilles pour être fiables";
	} else if (pourcentVie > 66) {
		div2.style.backgroundColor = '#77EE77';
	} else if (pourcentVie > 33) {
		div2.style.backgroundColor = '#EEEE77';
	} else {
		div2.style.backgroundColor = '#FF0000';
	}
	div2.style.width = pourcentVie + '%';
	div2.style.height = '10px';
	tab.appendChild(div2);
	/* ancienne méthode par img, à supprimer
	var img = document.createElement('img');
	img.src = '../Images/Interface/milieu.gif';
	img.height = 10;
	img.width = Math.floor( (100*infos.pv)/infos.pv_max );
	tab.appendChild(img);
	*/

	if (MZ_cache_col_TrollNOM === undefined) MZ_cache_col_TrollNOM = MZ_find_col_titre(tr_trolls, 'nom');
	var tdNom = TR.childNodes[MZ_cache_col_TrollNOM]
	if (infos.camoufle)  tdNom.appendChild(createImage(URL_MZimg+"warning.gif","Camouflé","padding-left:2px"));
	if (infos.invisible) tdNom.appendChild(createImage(URL_MZimg+"warning.gif","Invisible","padding-left:2px"));

	/* lien vers l'IT */
	var lien = document.createElement('a');
	//var nomit = MY_getValue(numTroll+'.INFOSIT').split('$')[1];
	lien.href = URL_bricol+itName+'/index.php';
	lien.target = '_blank';
	lien.appendChild(tab);
	if (MZ_cache_col_TrollGUILDE === undefined) MZ_cache_col_TrollGUILDE = MZ_find_col_titre(tr_trolls, 'guild');
	//window.console.log('[MZd] MZ_cache_col_TrollGUILDE=' + MZ_cache_col_TrollGUILDE);
	//var tdGuilde = TR.childNodes[MZ_cache_col_TrollGUILDE];
	//insertTdElement(tdGuilde,lien);
	TR.childNodes[MZ_cache_col_TrollGUILDE].appendChild(lien);
	/* PAs dispos */
	var span = document.createElement('span');
	span.title = 'DLA : ' + SQLDateToFrenchTime(infos.dla);
	appendText(span, infos.pa +' PA' );
	//window.console.log('dla=' + infos.dla + ', SQLDateToObject(infos.dla)=' + SQLDateToObject(infos.dla) + ', now=' + Date.now());
	if (infos.pa > 0 || SQLDateToObject(infos.dla) < Date.now()) {
		// surligner en verdâtre pour exprimer que ce Trõll peut jouer maintenant
		span.style.backgroundColor = 'B8EEB8';
	}
	//insertTdElement(tdGuilde, span);
	TR.childNodes[MZ_cache_col_TrollGUILDE+1].appendChild(span);
}

var MZ_tabTrTrollById;
function putInfosTrolls(infosTrolls, itName) {
	try {
		if (MZ_tabTrTrollById === undefined) {
			MZ_tabTrTrollById = new Array;
			// ajout des 2 colonnes dans la table HTML des Trõlls + construire le tableau MZ_tabTrTrollById
			if (MZ_cache_col_TrollGUILDE === undefined) MZ_cache_col_TrollGUILDE = MZ_find_col_titre(tr_trolls, 'guild');
			var td = insertTdText(tr_trolls[0].childNodes[MZ_cache_col_TrollGUILDE],'PA',true);
			td.width = 40;
			td = insertTdText(tr_trolls[0].childNodes[MZ_cache_col_TrollGUILDE],'PV',true);
			td.width = 105;
			for(i=nbTrolls ; i>0 ; i--) {
				insertTd(tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE]);
				insertTd(tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE]);
				MZ_tabTrTrollById[getTrollID(i)] = tr_trolls[i];
			}
		}


		// Roule 07/11/2016 je ne suis pas trop fana de corriger les données de Bricol'Troll
		//corrigeBricolTrolls(infosTrolls);

		// supression des infos trop vieilles (un mois)
		// conversion de la date de mise à jour en objet date (on en a besoin 2 fois)
		var dateLimite = new Date();
		dateLimite.setMonth(dateLimite.getMonth() - 1);

		// Roule 07/12/2016 ajout des Trolls invi/camou/hors de portée
		var str = MY_getValue(numTroll+'.INFOSIT');
		var bAjoutTrollInvi = false;
		if (str) {
			var arr = str.split('$');
			bAjoutTrollInvi = arr[4]>0;
		}


		var tBody = tr_trolls[0].parentNode;
		if (tr_trolls[1] !== undefined)
			tBody = tr_trolls[1].parentNode;

		//window.console.log('nb Troll IT : ' + IDs.length);
		var pos = getPosition();

		// mise à jour des infos dans le HTML (et ajout de ligne si nécessaire)
		for (var idTroll in infosTrolls) {
			var infos = infosTrolls[idTroll];
			infos.oUpdatedAt = SQLDateToObject(infos.updated_at);	// trop vieux
			if (infos.oUpdatedAt < dateLimite) continue;	// infos trop vieilles
			if (idTroll == numTroll) continue;	// pas nous-même
			var tr;
			if (idTroll in MZ_tabTrTrollById) {
				//window.console.log('[MZ] putInfosTrolls, le Troll ' + idTroll + ' est déjà dans la table HTML');
				tr = MZ_tabTrTrollById[idTroll];
			} else {
				//window.console.log('[MZ] putInfosTrolls, le Troll ' + idTroll + ' doit être ajouté à la table HTML');
				var distance = Math.max(Math.abs(pos[0]-infos.x), Math.abs(pos[1]-infos.y), Math.abs(pos[2]-infos.n));
				// trouver où insérer ce Troll
				var next = undefined;
				for(var j=0 ; j<tr_trolls.length ; j++) {
					var thisDist = parseInt(tr_trolls[j].cells[0].textContent);
					if (thisDist > distance) {
						next = tr_trolls[j]
						break;
					}
				}
				if (next !== undefined) {
					tr = insertTr(next,'mh_tdpage')
				} else {
					tr = appendTr(tBody,'mh_tdpage');
				}
				tr.style.color = 'orange';
				var td = appendTd(tr);	// distance
				appendText(td, distance);
				td = appendTd(tr);	// actions
				td = appendTd(tr);	// ID
				appendText(td, idTroll);
				td = appendTd(tr);	// Nom
				// <A HREF="javascript:EPV(1649)" CLASS='mh_trolls_1'>Krounch</A>
				appendA(td, 'javascript:EPV(' + idTroll + ')', 'mh_trolls_1', infos.nom);
				td = appendTd(tr);	// PV
				td = appendTd(tr);	// PA
				td = appendTd(tr);	// Guilde
				if (infos.guilde !== undefined) appendText(td, infos.guilde);
				td = appendTd(tr);	// Niveau
				if (infos.niveau !== undefined) appendText(td, infos.niveau);
				td.align = 'center';
				td = appendTd(tr);	// Race
				if (infos.race) appendText(td, infos.race);
				td = appendTd(tr);	// X
				td.align = 'center';
				if (infos.x !== undefined) appendText(td, infos.x);
				td = appendTd(tr);	// Y
				td.align = 'center';
				if (infos.y !== undefined) appendText(td, infos.y);
				td = appendTd(tr);	// N
				td.align = 'center';
				if (infos.n !== undefined) appendText(td, infos.n);
				MZ_tabTrTrollById[idTroll] = tr;
			}
			if (!tr.done) {
				addTdInfosTroll(infos, tr, itName);
				tr.done = true;
			}
		}
	} catch(e) {
		avertissement('Erreur de traitement des informations Bricol\'Troll, le détail est dans la console (F12)');
		window.console.error(traceStack(e, 'putInfosTrolls'));
	}
}


/* Mode Tétalanvert! ---------------------------------------------------------*/

function calculeDistance(maPos,posArr) {
	return Math.max(
		Math.abs(maPos[0]-posArr[0]),
		Math.abs(maPos[1]-posArr[1]),
		Math.abs(maPos[2]-posArr[2])
	);
}

function inversionCoord() {
	var maPos = getPosition();
	var listeOffsets = {
		'monstres':checkBoxLevels.checked?4:3,
		'trolls':6,
	};
	for(var type in listeOffsets) {
		var trList = VueContext['tr_'+type];
		var offset = listeOffsets[type];
		for(var i=trList.length-1 ; i>0 ; i--) {
			var oldX = parseInt(trList[i].cells[offset].textContent);
			var oldY = parseInt(trList[i].cells[offset+1].textContent);
			var oldN = parseInt(trList[i].cells[offset+2].textContent);
			trList[i].cells[offset].innerHTML = oldY;
			trList[i].cells[offset+1].innerHTML = oldX;
			trList[i].cells[0].innerHTML = calculeDistance(maPos,[oldY,oldX,oldN]);
		}
	}
}


/*                             Partie principale                              */
function do_vue() {
	for(var type in typesAFetcher) {
		fetchData(type);
	}

	// roule' 11/03/2016
	// maintenant, tr_monstres et this['tr_monstres'], ce n'est plus la même chose
	// je fais une recopie :(
	MZ_EtatCdMs.tr_monstres = VueContext.tr_monstres;
	if (MZ_EtatCdMs.tr_monstres && MZ_EtatCdMs.tr_monstres[0])
		for (var i = 0; i < MZ_EtatCdMs.tr_monstres[0].cells.length; i++) {// Roule 22/07/2020
		if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/Dist/i)) MZ_EtatCdMs.indexCellDist = i;
		if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/Action/i)) MZ_EtatCdMs.indexCellActions = i;
		if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/r[eéè]f/i)) MZ_EtatCdMs.indexCellID = i;
		if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/^X$/i)) MZ_EtatCdMs.indexCellX = i;
		if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/^Y$/i)) MZ_EtatCdMs.indexCellY = i;
		if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/^N$/i)) MZ_EtatCdMs.indexCellN = i;
	}

	tr_trolls = VueContext.tr_trolls;
	tr_tresors = VueContext.tr_tresors;
	tr_champignons = VueContext.tr_champignons;
	tr_lieux = VueContext.tr_lieux;

	MZ_EtatCdMs.nbMonstres = VueContext.nbMonstres;
	nbTrolls = VueContext.nbTrolls;
	nbTresors = VueContext.nbTresors;
	nbChampignons = VueContext.nbChampignons;
	nbLieux = VueContext.nbLieux;

	try {
		start_script(31);

		initialiseInfos();
		savePosition();

		if (MZ_EtatCdMs.indexCellDist < 0 || MZ_EtatCdMs.indexCellID < 0 || MZ_EtatCdMs.indexCellX < 0 || MZ_EtatCdMs.indexCellY < 0 || MZ_EtatCdMs.indexCellN < 0) {
			// c'est le cas en mode smartphone, dans le cas d'une vue qui ne montre pas les monstres
			//avertissement('Impossible de retrouver les colonnes de la vue des monstres, arrêt MZ', 9999999);
			set2DViewSystem();
			return;
		}

		// Fonctionnalité "Têtalenvert" cachée, en test :
		if(MY_getValue(numTroll+'.VERLAN')=='true') {
			inversionCoord();
		}

		ajoutDesFiltres();
		set2DViewSystem();
		//putBoutonTroogle();
		putBoutonPXMP();

		synchroniseFiltres();
		toggleLevelColumn();	// appel des CdM, ne fait rien si la checkbox NOCDM est cochée

		refreshDiplo();

		//400 ms
		var noGG = saveCheckBox(checkBoxGG, "NOGG");
		var noCompos = saveCheckBox(checkBoxCompos, "NOCOMP");
		var noBidouilles = saveCheckBox(checkBoxBidouilles, "NOBID");
		var noGowapsS = saveCheckBox(checkBoxGowapsS, "NOGOWAPS");
		var noGowapsA = saveCheckBox(checkBoxGowapsA, "NOGOWAPA");
		var noEngages = saveCheckBox(checkBoxEngages, "NOENGAGE");
		var noTresorsEngages =
			saveCheckBox(checkBoxTresorsNonLibres, "NOTRESORSNONLIBRES");
		var noTrou = saveCheckBox(checkBoxTrou, "NOTROU");
		var noIntangibles = saveCheckBox(checkBoxIntangibles, "NOINT");
		filtreMonstres();
		if(noIntangibles) {
			filtreTrolls();
		}
		if(noGG || noCompos || noBidouilles || noTresorsEngages) {
			filtreTresors();
		}
		if(noTrou) {
			filtreLieux();
		}

		MZ_Tactique.initPopup();
		initPXTroll();

		if(getTalent("Projectile Magique")) {
			computeProjo();
		}
		if(getTalent("Charger")) {
			computeCharge();
		}
		if(getTalent("Télékinésie")) {
			computeTelek();
		}
		if(getTalent("Lancer de Potions")) {
			computeLdP();
		}

		putScriptExterne();

		displayScriptTime();
	} catch(e) {
		window.console.error(traceStack(e, 'vue'));
		avertissement("[MZ " + GM_info.script.version + "] Une erreur s'est produite (seriez-vous sous l'effet d'un Fumeux ?).");
	}
}



/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

// x~x profil2

/*---------------------------- Variables globales ----------------------------*/

var
	// Anatrolliseur
	urlAnatrolliseur,
	// Infobulles talents
	hauteur = 50, bulleStyle = null,
	// Caracteristiques
		// Infos troll
	race, niv, idtroll, datecrea,
	idguilde, nomguilde,
		// Etats du troll
	fatigue, bmfatigue,

		// Experience, Pi, ...
	pxdistribuables, pxperso,
	piutilisable, pitotal,
	nbmeurtres, nbmorts,
		// utilisee pour les moyennes MM/jour, kill/jour, etc
	NBjours,
		// calcul des DLA suivantes
	DLA, DLAsuiv, HeureServeur,
		// details duree du tour (calcul pvdispo) :
	dtb, pdm, bmt, adb, dpt, dtbm,
		//posale
	posX, posY, posN,
		// caracs physiques
	vue, vuebp, vuebm, vuetotale,
	pvbase, pvbp, pvbm, pvtotal, pvcourant, pvmax,
	reg, regbp, regbm, regmoy,
	att, attbp, attbm, attmoy, atttourD, atttour, attmoytour,
	esq, esqbp, esqbm, esqmoy, esqtourD, esqmoytour,
	deg, degbp, degbm, degmoy, degmoycrit, degtour, degmoytour, degmoycrittour,
	arm, armbp, armbm, armmoy, armtourD, armmoytour,
	rm, rmbp, rmbm, rmtotale,
	mm, mmbp, mmbm, mmtotale,

	// Variables speciales Kastars
	pvActuelKastar, minParPV, overDLA,
		// id pour edition manuelle de lastDLA :
	inJour, inMois, inAn, inHr, inMin, inSec,
		// id pour auto-refresh lastDLA :
	lastDLAZone, maxAMZone, cumulZone,
	lastDLA, DLAaccel;


/*-[functions]----------------- Fonctions utiles -----------------------------*/

// Retourne la valeur de l'element unique et identifie par son "selector" (cf querySelector())
// http://www.w3schools.com/jsref/met_document_queryselector.asp
function getUniqueValueBySelector(selector, defaultValue){
	var valNode = document.querySelector(selector);
	if(valNode!=null){
		if(valNode.hasChildNodes()) {
			return valNode.childNodes[0].nodeValue;
		}else{
			return defaultValue;
		}
	} else{
		debugMZ("Pas d'element trouve correspondant au selecteur : " + selector);
		return defaultValue;
	}
}
function getUniqueStringValueBySelector(selector){
    return getUniqueValueBySelector(selector,"");
}
function getUniqueIntValueBySelector(selector){
	var ret = getUniqueValueBySelector(selector,0);
	if(ret==null || /^\s*$/.test(ret)){ // test si chaine de caracteres composee de " "
		ret = 0;
	}
	return parseInt(ret);
}
function getUniqueFloatValueBySelector(selector){
	var ret = getUniqueValueBySelector(selector,0.0);
	if(ret==null || /^\s*$/.test(ret)){  // test si chaine de caracteres composee de " "
		ret = 0.0;
	}
	return parseFloat(ret);
}


function resiste(Ddeg,bm) {
	// version naive mais compréhensible ^^
	// DEBUG: à revoir
	if(!bm) {
		return 2*Math.floor(Ddeg/2);
	}
	return 2*Math.floor(Ddeg/2)+Math.round(bm/2);
}

function retourAZero(fatig) {
	var fat = fatig, raz = 0;
	while(fat>0) {
		raz++;
		fat = Math.floor(fat/1.25);
	}
	return raz;
}

function coefDecumul(i) {
	switch(i) {
		case 2: return 0.67;
		case 3: return 0.4;
		case 4: return 0.25;
		case 5: return 0.15;
		default: return 0.1;
	}
}

function dureeHM(dmin) {
	var ret = "";
	dmin = Math.floor(dmin);
	if(dmin>59) { ret = Math.floor(dmin/60)+"h"; }
	var mins = dmin%60;
	if(mins!=0) { ret += (ret) ? addZero(mins)+"min" : mins+"min"; }
	return (ret) ? ret : "-";
}

// extraction d'une durée
// l'élément pointé par le sélecteur contient "9 h 33 m" ou "- 2 h 30 m"
// c'est protégé (rend 0 si l'élément est absent)
// Roule' 24/12/2016
function extractionDuree(selecteur) {
	var s = getUniqueStringValueBySelector(selecteur);
	if (!s) return 0;
	var tabN = getNumbers(s);
	if (tabN.length < 2) return 0;
	if (s.includes('-')) {
		return - tabN[0] * 60 - tabN[1];
	}
	return tabN[0] * 60 + tabN[1];
}

/*-[functions]------- Extraction / Sauvegarde des donnees --------------------*/

function extractionDonnees() {
	    // Variables temporaires
	var Nbrs = {};

// *********************
// Cadre "Description"
// *********************
	race = getUniqueStringValueBySelector('#descr #race');
	debugMZ("Race : " + race);
	idtroll = getUniqueStringValueBySelector('#descr #id');
	debugMZ("Id troll : " + idtroll);
	var strDateCrea = getUniqueStringValueBySelector('#descr td#crea>span');
	strDateCrea = strDateCrea.slice(strDateCrea.indexOf("(") + 1, strDateCrea.indexOf(")"));
	datecrea = new Date(StringToDate(strDateCrea));
	debugMZ("Date creation : " + datecrea);
		// Guilde
	idguilde = getUniqueIntValueBySelector('#descr #idguilde');
	nomguilde = getUniqueStringValueBySelector('#descr #nomguilde');
	debugMZ("Guilde: " + idguilde + ' ' + nomguilde);

// *******************
// Cadre "Experience"
// *******************
        // Niveau de troll
	niv = getUniqueIntValueBySelector('#exp #niv');
	nivTroll = niv;
	debugMZ("Niveau : " + niv);
        // PX
	pxdistribuables = getUniqueIntValueBySelector('#exp #px');
	pxperso = getUniqueIntValueBySelector('#exp #px_perso');
	debugMZ("Px Distrib/Perso: "+pxdistribuables+" / "+pxperso);
        // PI
	piutilisable = getUniqueIntValueBySelector('#exp #pi');
	pitotal = getUniqueIntValueBySelector('#exp #pitot');
	debugMZ("PI utilisables/total: "+piutilisable+" / "+pitotal);
        // Meutres/Morts
	nbmeurtres = getUniqueIntValueBySelector('#exp #kill');
	nbmorts = getUniqueIntValueBySelector('#exp #mort');
	debugMZ("Nb Meutres/Morts: "+nbmeurtres+" / "+nbmorts);

// *********************
// Cadre "Tour de Jeu"
// *********************
	    // DLA
	Nbrs['dla'] = getUniqueStringValueBySelector('#dla #dla>b');
	DLA = new Date(StringToDate(Nbrs['dla']));
	debugMZ('DLA: ' + DLA);
	    // DLA suivante
	Nbrs['dlasuiv'] = getUniqueStringValueBySelector('#dla #dla_next');
	DLAsuiv = new Date(StringToDate(Nbrs['dlasuiv']));
	debugMZ('DLAsuiv: ' + DLAsuiv);
	    // Duree normale de mon Tour
	dtb = extractionDuree('#dla #tour');
	debugMZ('Duree normale de mon Tour : ' + dtb);
	    // Bonus/malus
	dtbm = extractionDuree('#dla #bm');
	debugMZ('Bonus/Malus équipement sur la duree : ' + dtbm);
	    // Réserve
	dtreserve = extractionDuree('#dla #reserve');
	debugMZ('Durée de réserve : ' + dtreserve);
	    // Poids de l'equipement
	pdm = extractionDuree('#dla #poids');
	debugMZ('Poids de l\'equipement : ' + pdm);
	    // Bonus/Malus equipement
	bmt = extractionDuree('#dla #bmequipement');	// Roule' 24/12/2016 on a trouvé un Troll qui n'a pas de bmt !
	debugMZ('Bonus/Malus équipement sur la duree : ' + bmt);
	    // Augmentation due aux blessures
	adb = extractionDuree('#dla #blessure');
	debugMZ('Augmentation due aux blessures : ' + adb);
	    // Mouches
	bmmouche = extractionDuree('#dla #mouche');
	debugMZ('Bonus des mouches : ' + bmmouche);
	    // Duree de mon prochain Tour
	dpt = extractionDuree('#dla #duree>b');
	debugMZ('Duree de mon prochain Tour : ' + dpt);

// ****************
// Cadre "Etats"
// ****************
	    // Position du troll :
	posX = getUniqueIntValueBySelector('#pos #x');
	posY = getUniqueIntValueBySelector('#pos #y');
	posN = getUniqueIntValueBySelector('#pos #n');
	debugMZ("(X Y Z) : " + posX + " " + posY + " " + posN);
	    // PV actuel
	pvcourant = getUniqueIntValueBySelector('#pos #pv_courant');
	pvActuelKastar = pvcourant;
	debugMZ("PV actuel : " + pvcourant)
	    // Fatigue
	fatigue = getUniqueIntValueBySelector('#pos #fatigue');
    bmfatigue = getUniqueIntValueBySelector('#pos #fatiguebm');
	debugMZ('Fatigue : '+fatigue+" + "+bmfatigue);

// **************************
// Cadre "Caracteristiques"
// **************************
		// Attaque
	att = getUniqueIntValueBySelector('#carac #att');
	attbp = getUniqueIntValueBySelector('#carac #att_p');
	attbm = getUniqueIntValueBySelector('#carac #att_m');
	atttour = getUniqueIntValueBySelector('#carac #att_tour');    // % bonus AdA
	atttourD = getUniqueIntValueBySelector('#carac #att_tour_d'); // malus Parade
	attmoy = 3.5*att + attbp + attbm;
	var DAttBonus = Math.floor(((att+atttourD)*atttour/100)); // À vérifier
	attmoytour = 3.5*(att+DAttBonus) + attbp + attbm;
	debugMZ(
		"ATT: "+att+"+("+attbp+")+("+attbm+") ;AttMoy:"+attmoy+
		"; BM Dé att/tour:("+atttourD+"D;"+atttour+"%) "+(atttourD+DAttBonus)+
		"D ;AttMoyTour:"+attmoytour
	);
	    // Esquive
	esq = getUniqueIntValueBySelector('#carac #esq');
	esqbp = getUniqueIntValueBySelector('#carac #esq_p');
	esqbm = getUniqueIntValueBySelector('#carac #esq_m');
	esqtourD = getUniqueIntValueBySelector('#carac #esq_tour_d');
	esqmoy = 3.5*esq + esqbp+esqbm;
	esqmoytour = 3.5*(esq+esqtourD) + esqbp+esqbm;
	debugMZ("ESQ: "+esq+"+("+esqbp+")+("+esqbm+") ;EsqMoy:"+esqmoy+"; esq/tour:"+esqtourD+" ;EsqMoyTour:"+esqmoytour);
		// Degat
	deg = getUniqueIntValueBySelector('#carac #deg');
	degbp = getUniqueIntValueBySelector('#carac #deg_p');
	degbm = getUniqueIntValueBySelector('#carac #deg_m');
	degtour = getUniqueIntValueBySelector('#carac #deg_tour'); // % bonus AdD
	degmoy = 2*deg + degbp + degbm;
	degmoycrit = 2*(deg+Math.floor(deg/2)) + degbp + degbm;
	var DDegBonus = Math.floor(deg*degtour/100);
	degmoytour = 2*(deg + DDegBonus) + degbp + degbm;
	degmoycrittour = degmoytour + 2*Math.floor(deg/2);
	debugMZ(
		"DEG: "+deg+"+("+degbp+")+("+degbm+") ;DegMoy:"+degmoy+"/"+degmoycrit+
		" ;deg/tour:("+degtour+"%) "+DDegBonus+
		"D; DegMoyTour:"+degmoytour+"/"+degmoycrittour
	);
	    // PV
	pvbase = getUniqueIntValueBySelector('#carac #pv');
	pvbp = getUniqueIntValueBySelector('#carac #pv_p');
	pvbm = getUniqueIntValueBySelector('#carac #pv_m');
	pvtotal = getUniqueIntValueBySelector('#carac #pv_tot');
	pvmax = getUniqueIntValueBySelector('#pv_max');
	debugMZ("PV: " + pvbase + " + (" + pvbp + ") + (" + pvbm + ") = " + pvtotal);
	    // Regeneration
	reg = getUniqueIntValueBySelector('#carac #reg');
	regbp = getUniqueIntValueBySelector('#carac #reg_p');
	regbm = getUniqueIntValueBySelector('#carac #reg_m');
	regmoy = 2 * reg + regbp + regbm; // D3
	debugMZ("REG: "+reg+"+("+regbp+")+("+regbm+") ;RegMoy:" + regmoy);
	    // Armure
	arm = getUniqueIntValueBySelector('#carac #arm');
	armbp = getUniqueIntValueBySelector('#carac #arm_p');
	armbm = getUniqueIntValueBySelector('#carac #arm_m');
	armtourD = getUniqueIntValueBySelector('#carac #arm_tour_d');
	armmoy = 2*arm + armbp+armbm;
	armmoytour = 2*Math.max(arm+armtourD, 0) + armbp+armbm;
	debugMZ("ARM: "+arm+"+("+armbp+")+("+armbm+"); ArmMoy:"+armmoy+"; arm/tour:"+armtourD+"; ArmMoyTour:"+armmoytour);
	// TODO : D d'armure non active
	    // Vue
	vue = getUniqueIntValueBySelector('#carac #vue');
	vuebp = getUniqueIntValueBySelector('#carac #vue_p');
	vuebm = getUniqueIntValueBySelector('#carac #vue_m');
	vuetotale = getUniqueIntValueBySelector('#carac #vue_tot');
	debugMZ("Vue: " + vue + " + (" + vuebp + ") + (" + vuebm + ") = " + vuetotale);
	    // RM
	rm = getUniqueIntValueBySelector('#carac #rm');
	rmbp = getUniqueIntValueBySelector('#carac #rm_p');
	rmbm = getUniqueIntValueBySelector('#carac #rm_m');
	rmtotale = getUniqueIntValueBySelector('#carac #rm_tot');
	rmTroll = rmtotale;
	debugMZ("RM: " + rm + " + (" + rmbp + ") + (" + rmbm + ") = " + rmtotale);
	    // MM
	mm = getUniqueIntValueBySelector('#carac #mm');
	mmbp = getUniqueIntValueBySelector('#carac #mm_p');
	mmbm = getUniqueIntValueBySelector('#carac #mm_m');
	mmtotale = getUniqueIntValueBySelector('#carac #mm_tot');
	mmTroll = mmtotale;
	debugMZ("MM: " + mm + " + (" + mmbp + ") + (" + mmbm + ") = " + mmtotale);

	// Heure Serveur
	try {
        var heureServeurSTR = document.querySelector("#hserveur").innerHTML;
        heureServeurSTR = heureServeurSTR.slice(heureServeurSTR.indexOf("/") - 2, heureServeurSTR.lastIndexOf(":") + 3);
		HeureServeur = new Date(StringToDate(heureServeurSTR));
	} catch (e) {
		window.console.warn(
			"[MZ " + GM_info.script.version + "] Heure Serveur introuvable, utilisation de l'heure actuelle", e
		);
		HeureServeur = new Date();
	}
	debugMZ("HeureServeur: " + HeureServeur);

	// ***INIT GLOBALE*** NBjours
	NBjours = Math.floor((HeureServeur-datecrea)/864e5)+1;

	    // Calcul debut lien anatroliseur avec les caracteristiques connues
	var amelio_dtb = function(dtb) {
			if(dtb>555) {
				return Math.floor((21-Math.sqrt(8*dtb/3-1479))/2);
			}
			return 10+Math.ceil((555-dtb)/2.5);
		},
		amelio_pv = Math.floor(pvbase/10)-3,
		amelio_vue = vue-3,
		amelio_att = att-3,
		amelio_esq = esq-3,
		amelio_deg = deg-3,
		amelio_reg = reg-1,
		amelio_arm = arm-1;
	if(race==="Darkling"){amelio_reg--; }
	if(race==="Durakuir"){amelio_pv-- ; }
	if(race==="Kastar")  {amelio_deg--; }
	if(race==="Skrim")   {amelio_att--; }
	if(race==="Tomawak") {amelio_vue--; }

	urlAnatrolliseur = URL_AnatrolDispas
	+"outils_anatrolliseur.php?anatrolliseur=v8"
	+"|r="+race.toLowerCase()
	+"|dla="+amelio_dtb(dtb)
	+"|pv="+amelio_pv+","+pvbp+","+pvbm
	+"|vue="+amelio_vue+","+vuebp+","+vuebm
	+"|att="+amelio_att+","+attbp+","+attbm
	+"|esq="+amelio_esq+","+esqbp+","+esqbm
	+"|deg="+amelio_deg+","+degbp+","+degbm
	+"|reg="+amelio_reg+","+regbp+","+regbm
	+"|arm="+amelio_arm+","+armbp+","+armbm
	+"|mm="+mmtotale
	+"|rm="+rmtotale+"|";
}

function saveProfil() {
	MY_setValue(idtroll+'.caracs.attaque',att);
	MY_setValue(idtroll+'.caracs.attaque.bm',(attbp+attbm));
	MY_setValue(idtroll+'.caracs.attaque.bmp',attbp);
	MY_setValue(idtroll+'.caracs.attaque.bmm',attbm);
	if(atttourD||atttour) {
		var DAttBonus = atttourD + Math.floor((att+atttourD)*atttour/100);
		MY_setValue(idtroll+'.bonus.DAttM',DAttBonus);
	} else {
		MY_removeValue(idtroll+'.bonus.DAttM');
	}
	MY_setValue(idtroll+'.caracs.esquive',esq);
	MY_setValue(idtroll+'.caracs.esquive.bm',(esqbp+esqbm));
	MY_setValue(idtroll+'.caracs.esquive.bmp',esqbp);
	MY_setValue(idtroll+'.caracs.esquive.bmm',esqbm);
	MY_setValue(idtroll+'.caracs.esquive.nbattaques',esqtourD);
	MY_setValue(idtroll+'.caracs.degats',deg);
	MY_setValue(idtroll+'.caracs.degats.bm',(degbp+degbm));
	MY_setValue(idtroll+'.caracs.degats.bmp',degbp);
	MY_setValue(idtroll+'.caracs.degats.bmm',degbm);
	if(degtour) {
		var DDegBonus = Math.floor(deg*degtour/100);
		MY_setValue(idtroll+'.bonus.DDeg',DDegBonus);
	} else {
		MY_removeValue(idtroll+'.bonus.DDeg');
	}
	MY_setValue(idtroll+'.caracs.regeneration',reg);
	MY_setValue(idtroll+'.caracs.regeneration.bm',(regbp+regbm));
	MY_setValue(idtroll+'.caracs.regeneration.bmp',regbp);
	MY_setValue(idtroll+'.caracs.regeneration.bmm',regbm);
	MY_setValue(idtroll+'.caracs.vue',vue);
	MY_setValue(idtroll+'.caracs.vue.bm',(vuebp+vuebm));
	MY_setValue(idtroll+'.caracs.vue.bmp',vuebp);
	MY_setValue(idtroll+'.caracs.vue.bmm',vuebm);
	MY_setValue(idtroll+'.caracs.pv',pvcourant);
	MY_setValue(idtroll+'.caracs.pv.base',pvbase);
	MY_setValue(idtroll+'.caracs.pv.max',pvtotal);
	MY_setValue(idtroll+'.caracs.rm',rm);
	MY_setValue(idtroll+'.caracs.rm.bm',(rmtotale));
	MY_setValue(idtroll+'.caracs.rm.bmp',rmbp);
	MY_setValue(idtroll+'.caracs.rm.bmm',rmbm);
	MY_setValue(idtroll+'.caracs.mm',mm);
	MY_setValue(idtroll+'.caracs.mm.bm',(mmtotale));
	MY_setValue(idtroll+'.caracs.mm.bmp',mmbp);
	MY_setValue(idtroll+'.caracs.mm.bmm',mmbm);
	MY_setValue(idtroll+'.caracs.armure',arm);
	MY_setValue(idtroll+'.caracs.armure.bm',(armbp+armbm));
	MY_setValue(idtroll+'.caracs.armure.bmp',armbp);
	MY_setValue(idtroll+'.caracs.armure.bmm',armbm);
	MY_setValue(idtroll+'.position.X',posX);
	MY_setValue(idtroll+'.position.Y',posY);
	MY_setValue(idtroll+'.position.N',posN);
	MY_setValue(idtroll+'.race',race);
	MY_setValue(idtroll+'.niveau',niv);
	MY_setValue(idtroll+'.idguilde',idguilde);
	MY_setValue(idtroll+'.nomguilde',nomguilde);
}


/*-[functions]----------- Fonctions modifiant la page ------------------------*/

function setInfosCaracteristiques() {
	// Modification de l'entete
	var thTotal = document.querySelector("table#caracs>thead>tr>th:nth-child(6)");
	thTotal.innerHTML+='|<i>Moyenne</i>';
	thTotal.title="Moyenne (Moyenne ce tour)";

	// Ajout des informations calculees
	var tdAttTotal = document.querySelector("table#caracs td#att").parentElement.children[5];
	tdAttTotal.innerHTML="<i>"+attmoy+"</i>";
	if(attmoy!=attmoytour){tdAttTotal.innerHTML+=" ("+attmoytour+")";}

	var tdEsqTotal = document.querySelector("table#caracs td#esq").parentElement.children[5];
    tdEsqTotal.innerHTML="<i>"+esqmoy+"</i>";
	if(esqmoy!=esqmoytour){tdEsqTotal.innerHTML+=" ("+esqmoytour+")";}

	var tdDegTotal = document.querySelector("table#caracs td#deg").parentElement.children[5];
	tdDegTotal.innerHTML="<i>"+degmoy+"/"+degmoycrit+"</i>";
	if(degmoy!=degmoytour){tdDegTotal.innerHTML+=" ("+degmoytour+"/"+degmoycrittour+")";}

	var trRegeneration = document.querySelector("table#caracs td#reg").parentElement;
    var tdRegTotal = trRegeneration.children[5];
    tdRegTotal.innerHTML = "<i>"+regmoy+"</i>";
	    // Temps recupere par reg (propale R')
	var regmoyTemp = Math.max(0, regmoy);
	var regTitle = "Temps moyen récupéré par régénération: " + Math.floor(250 * regmoyTemp / pvtotal) + " min";
	var sec = Math.floor(15000 * regmoyTemp / pvtotal) % 60;
	if (sec != 0) {
		regTitle += " " + sec + " sec";
	}
	trRegeneration.title = regTitle;

	var tdArmTotal = document.querySelector("table#caracs td#arm").parentElement.children[5];
	tdArmTotal.innerHTML= "<i>"+armmoy+"</i>";
	if(armmoy!=armmoytour){tdArmTotal.innerHTML+=" ("+armmoytour+")";}

	var trRM=document.querySelector("table#caracs #rm").parentElement;
	trRM.title = (Math.round(10*rm/NBjours)/10)+' ('+(Math.round(10*rmTroll/NBjours)/10)+') points de RM par jour | '
				+(Math.round(10*rm/niv)/10)+' ('+(Math.round(10*rmtotale/niv)/10)+') points de RM par niveau';


	var trMM=document.querySelector("table#caracs #mm").parentElement;
	trMM.title = (Math.round(10*mm/NBjours)/10)+' ('+(Math.round(10*mmTroll/NBjours)/10)+') points de MM  par jour | '
				+(Math.round(10*mm/niv)/10)+' ('+(Math.round(10*mmtotale/niv)/10)+') points de MM par niveau';

    var tdRefl=document.querySelector("#refl");
    // TODO : prendre en compte bonus/malus D esq du tour ?
    var refMoy = Math.floor(2*(reg+esq)/3)*3.5 + esqbp + esqbm;
    tdRefl.innerHTML+=" <i>(moyenne : "+refMoy+")</i>";
}

function setLienAnatrolliseur(){
	var pTableAmelio = document.querySelector("#carac>div>p");
	if (!pTableAmelio) pTableAmelio = document.querySelector("#carac>div>div>p");
	if (!pTableAmelio) return;
	pTableAmelio.appendChild(document.createTextNode(' - '));
	var aElt = document.createElement("a");
	aElt.setAttribute("href",urlAnatrolliseur);
	aElt.setAttribute("target","_blank");
	aElt.className="AllLinks";
	aElt.innerHTML="Anatrolliser";
	pTableAmelio.appendChild(aElt);
}
function setInfoDescription() {
	var txtDateCrea = (NBjours!=1) ?
		" ("+NBjours+" jours dans le hall)" :
		" (Bienvenue à toi pour ton premier jour dans le hall)" ;
	appendText(document.querySelector("#descr td#crea"), txtDateCrea, false);
}

function setInfosEtatLieux() {
	var urlBricol = URL_bricol_mountyhall + 'lieux.php'+
		'?search=position&orderBy=distance&posx='+
		posX+'&posy='+posY+'&posn='+posN+'&typeLieu=3';
	var tdPosition = document.querySelector("#pos td span#x").parentElement;
	appendBr(tdPosition);
    var aElt = document.createElement("a");
    aElt.setAttribute("href",urlBricol);
    aElt.setAttribute("target","_blank");
    aElt.className="AllLinks";
    aElt.innerHTML="Lieux à proximité";
    tdPosition.appendChild(aElt);
}

function setInfosEtatPV() { // pour AM et Sacro
	var
		txt = "1 PV de perdu = +"+Math.floor(250/pvtotal)+" min",
		sec = Math.floor(15000/pvtotal)%60,
		lifebar = document.querySelector("#pos .barre-vie");
	if(sec!=0) { txt += " "+sec+" sec"; }
	if(lifebar) { lifebar.title = txt; }
	if(pvcourant<=0) { return; }

	// Difference PV p/r a equilibre de temps (propale R')
	// Note : pvmin pour 0 malus = pvtotal + ceiling(pvtotal/250*(dtreserve + pdm + bmt + bmmouche))
	// ***INIT GLOBALE*** pvdispo
	var bmPVHorsBlessure = dtbm + dtreserve + pdm + bmt + bmmouche;
	var pvdispo = pvcourant-pvtotal-Math.ceil(bmPVHorsBlessure*pvtotal/250);
	var span = document.createElement("span");
	span.title = txt;
	span.style.fontStyle = "italic";
	if(bmPVHorsBlessure>=0) {
		txt = "[MZ] Vous ne pouvez compenser aucune blessure actuellement.";
	} else if(pvdispo>0) {
		txt = "[MZ] Vous pouvez encore perdre "+
			Math.min(pvdispo,pvcourant)+
			" PV sans malus de temps.";
	} else if(pvdispo<0) {
		txt = "[MZ] Il vous manque "
			+(-pvdispo)
			+" PV pour ne plus avoir de malus de temps.";
	} else {
		txt = "[MZ] Vous êtes à l'équilibre en temps (+/- 30sec).";
	}
	appendText(span,txt);
	document.querySelector("#pos #pv_courant").parentElement.parentElement.appendChild(span);
	var marge = dtbm + dtreserve + pdm + bmt + adb + bmmouche;
	var tr = document.createElement('tr');
	tr.className = 'detail';
	var th = document.createElement('th');
	if (marge <= 0) {
		appendText(th, '[MZ] Marge');
	} else {
		appendText(th, '[MZ] Augmentation');
		tr.style.color = 'red';
	}
	tr.appendChild(th);
	var td = document.createElement('td');
	appendText(td, MZ_FormatHeureMinute(marge, true));
	tr.appendChild(td);
	document.querySelector("#dla #duree").parentElement.parentElement.appendChild(tr);
}

function MZ_FormatHeureMinute(duree, bPlus) {
	var txt = '';
	if (duree < 0) {
		txt = '- ';
		duree = -duree;
	} else if (duree > 0 && bPlus) {
		txt = '+ ';
	}
	var h = Math.floor(duree / 60);
	if (h) txt += h + ' h ';
	txt += (duree % 60) + ' m';
	return txt;
}

// Complete le cadre "Experience"
function setInfosExp() {
    var tdNiv = document.querySelector("#exp #niv");

    // Calcul niveau monstre/troll min pour gain PX
    var nivCibleMin = Math.ceil((2 * nivTroll - 10) / 3);
    tdNiv.parentElement.title = "Vos cibles doivent être au minim de niveau " + nivCibleMin + " pour qu'elles vous rapportent des PX";

    // Calcul PX restant
    var pxRestant = (pxdistribuables + pxperso) - 2 * nivTroll;
    if (pxRestant >= 0) {
        var tdinfoEntrainement = document.querySelector("#exp table tr:nth-child(4) td span");
        if (tdinfoEntrainement) tdinfoEntrainement.innerHTML += " <i>Il vous restera " + pxRestant + " PX</i>";
    }

    // Calul pi/jour
    var
    	tdPiTotal=document.querySelector("#exp #pitot").parentElement,
    	tdPi = document.querySelector("#exp #pi").parentElement;
    tdPiTotal.title=(Math.round(10 * (pitotal + pxperso + pxdistribuables) / NBjours) / 10) + ' PI par jour'
    tdPi.title = tdPiTotal.title;

    // Rapports meurtres,morts
    var tdKill = document.querySelector("#exp #kill");
    tdKill.setAttribute("colspan", 1);
    appendTdText(tdKill.parentElement, (Math.round(10 * NBjours / nbmeurtres) / 10) + ' jours/kill', false);

    var tdMort = document.querySelector("#exp #mort");
    tdMort.setAttribute("colspan", 1);
    appendTdText(tdMort.parentElement, (Math.round(10 * NBjours / nbmorts) / 10) + ' jours/mort', false);

    tdKill.parentElement.title = 'Rapport meurtres/décès: ' + Math.floor((nbmeurtres / nbmorts) * 100) / 100;
    tdMort.parentElement.title = 'Rapport décès/meurtres: ' + Math.floor((nbmorts / nbmeurtres) * 100) / 100;
}


/*-[functions]----------- Fonctions speciales Kastars ------------------------*/

function minParPVsac(fat,bm) {
// Calcule le nombre de min gagnees / PV sacrifies pour une AM realisee sous
// fatigue = 'fat', sans et avec un bm de fatigue = 'bm'
	var out = [];
	out[0] = (fat>4) ?
		Math.floor(120/( fat*(1+Math.floor(fat/10)) )) :
		30;
	if(bm && bm>0) {
		var totalfat=fat+bm;
		out[1] = (totalfat>4) ?
			Math.floor(120/( totalfat*(1+Math.floor(totalfat/10)) )) :
			30; // en principe inutile pour des bm fat >= 15 mais bon...
	}
	return out;
}

function toInt(str) {
	str = parseInt(str);
	return (str) ? str : 0;
	}

function saveLastDLA() {
	// pour les calculs d'AM max
	var str = addZero(toInt(inJour.value))+'/'+addZero(toInt(inMois.value))
		+'/'+toInt(inAn.value)+' '+addZero(toInt(inHr.value))
		+':'+addZero(toInt(inMin.value))+':'+addZero(toInt(inSec.value));
	lastDLA = new Date( StringToDate(str) );
	MY_setValue(numTroll+'.DLA.ancienne',str);
	lastDLAZone.innerHTML = '';
	var b = document.createElement('b');
	b.addEventListener('click',inputMode,false);
	appendText(b,str);
	lastDLAZone.appendChild(b);
	refreshAccel();
	}

function inputMode() {
	// Edition manuelle lastDLA
	var date;
	if(lastDLA)
		date = new Date( lastDLA );
	else
		date = new Date( DLAaccel );
	lastDLAZone.innerHTML = '';
	inJour = appendTextbox(lastDLAZone,'text','inJour',1,2,date.getDate());
	appendText(lastDLAZone,'/');
	inMois = appendTextbox(lastDLAZone,'text','inMois',1,2,1+date.getMonth());
	appendText(lastDLAZone,'/');
	inAn = appendTextbox(lastDLAZone,'text','inAn',3,4,date.getFullYear());
	appendText(lastDLAZone,' - ');
	inHr = appendTextbox(lastDLAZone,'text','inHr',1,2,date.getHours()+'');
	appendText(lastDLAZone,':');
	inMin = appendTextbox(lastDLAZone,'text','inMin',1,2,date.getMinutes()+'');
	appendText(lastDLAZone,':');
	inSec = appendTextbox(lastDLAZone,'text','inSec',1,2,date.getSeconds()+'');
	appendText(lastDLAZone,' - ');
	appendButton(lastDLAZone,'Enregistrer',saveLastDLA);
	}

function setAccel() {
	var
		BMfrais=false,
		fat=fatigue, listeBmFat=[],
		tr, th, insertPt;

	// Creation ligne speciale pour AM dans le cadre "Etat"
	tr = document.createElement('tr');
	th = document.createElement('th');
	appendText(th,'[MZ] Fatigue et AM',true);
	tr.appendChild(th);
	insertPt = document.createElement('td');
	tr.appendChild(insertPt);
	document.querySelector('#pos table>tbody').insertBefore(tr,null);

	// Est-on en over-DLA ?
	// ***INIT GLOBALE*** overDLA
	overDLA = (HeureServeur>DLA.getTime()+3e5);
	if(overDLA) {
		fat=Math.floor(fatigue/1.25);
	}

	// Gestion des BM de fatigue
	if(bmfatigue>0) {
		if (MY_DEBUG) window.console.log('MZE setAccel, bmfatigue=' + bmfatigue + ', ' + numTroll+'.bm.fatigue=' + MY_getValue(numTroll+'.bm.fatigue'));
		// On tente de recuperer les BM de fatigue de la page des BM
		if(MY_getValue(numTroll+'.bm.fatigue')) {
			var BMmemoire = MY_getValue(numTroll+'.bm.fatigue').split(';');
			BMmemoire.pop();
			for(var i=0 ; i<BMmemoire.length ; i++) {
				var nbrs = BMmemoire[i].match(/\d+/g); // [tour,fatigue]
				var s = '0000' + nbrs[0];
				BMmemoire[i] = s.substr(s.length-4) + ' ' + nbrs[1];
			}
			BMmemoire.sort();	// tri par n° de tour
			var tour = 0;
			for(var i=0 ; i<BMmemoire.length ; i++) {
				var nbrs = BMmemoire[i].match(/\d+/g); // [tour,fatigue]
				while(tour<=parseInt(nbrs[0])) {
					listeBmFat[tour]=parseInt(nbrs[1]);
					tour++;
				}
			}
		}
		if(listeBmFat[0]==bmfatigue) {
			// Si (bm profil=1er bm stocke), on suppose que les bm stockes sont a jour
			BMfrais = true;
			// Roule 17/06/2020 je ne vois pas du tout pourquoi on viderait xxx;bm.fatigue ici. Et ça fait que la fatigue des Kastars affiche une erreur la 2e fois qu'on va sur le profil... J'enlève
			//MY_removeValue(numTroll+".bm.fatigue");
		}
	} else {
		// S'il n'y a pas de bm de fatigue sur le profil, on est a jour
		BMfrais = true;
	}
	if(!BMfrais && bmfatigue>0) {
		// si les BM n'ont pas ete rafraichis, on conjecture le pire:
		if(bmfatigue==15) {
			listeBmFat = [15,15,15];
		} else {
			listeBmFat = [30,30,15];
		}
		
	}
	if(overDLA) {
		// Si on est en over-DLA, on decale les bm d'un tour
		listeBmFat.shift();
	}

	// Tableau des fatigues et accel futures
	var
		minppv = minParPVsac(fat,listeBmFat[0]),
		table, tbody,
		ligneTour, ligneFat, ligneMin,
		col;
	// ***INIT GLOBALE*** minParPV
	minParPV = (listeBmFat[0]==void(0)) ? minppv[0] : minppv[1];
	if(fat>0 || listeBmFat[0]>0) {
		table = document.createElement('table');
		table.className = 'mh_tdborder';
		table.border = 0;
		table.cellSpacing = 1;
		table.cellPadding = 1;
		table.style.textAlign = "center";
		tbody = document.createElement('tbody');
		table.appendChild(tbody);
		insertPt.appendChild(table);

		ligneTour = appendTr(tbody,'mh_tdtitre');
		ligneTour.style.fontWeight = "bold";
		var td = appendTdText(ligneTour,'Tour :',true);
		td.align = 'left';
		ligneFat = appendTr(tbody,'mh_tdpage');
		td = appendTdText(ligneFat,'Fatigue :',true);
		td.className = 'mh_tdtitre';
		td.align = 'left';
		ligneMin = appendTr(tbody,'mh_tdpage');
		td = appendTdText(ligneMin,'1 PV =',true);
		td.className = 'mh_tdtitre';
		td.align = 'left';
		col=0;
		while(col<9 && (fat>0 || listeBmFat[col])) {
			if(col==0) {
				if(overDLA) {
					var i = document.createElement('i');
					appendText(i,'A activer');
					ligneTour.appendChild(i);
				} else {
					appendTdText(ligneTour,'En cours');
				}
			} else {
				appendTdText(ligneTour,'\u00A0\u00A0+'+col+'\u00A0\u00A0');
			}
			if(listeBmFat[col]) {
				if(BMfrais || (!overDLA && col==0)) {
					appendTdText(ligneFat,fat+'+'+listeBmFat[col]);
					appendTdText(ligneMin,Math.max(1, minppv[1])+'\'');
				} else {
					appendTdText(ligneFat,fat+'+'+listeBmFat[col]+' (?)');
					appendTdText(ligneMin,minppv[1]+'\' ('+minppv[0]+'\')');
				}
			} else {
				appendTdText(ligneFat,fat);
				appendTdText(ligneMin,minppv[0]+'\'');
			}
			col++;
			fat = Math.floor(fat / 1.25);
			minppv = minParPVsac(fat,listeBmFat[col]);
		}
		if(fat>1 || (fat==1 && !overDLA)) {
			appendTdText(ligneTour,'\u00A0 ... \u00A0',true);
			appendTdText(ligneFat,'-');
			appendTdText(ligneMin,'-');
		}
		col = (overDLA) ?
			Math.max(retourAZero(fatigue)-1,col) :
			Math.max(retourAZero(fatigue),col);
		appendTdText(ligneTour,'\u00A0\u00A0+'+col+'\u00A0\u00A0');
		appendTdText(ligneFat,'0');
		appendTdText(ligneMin,'30\'');

		if(!BMfrais && bmfatigue) {
			// si les BM n'ont pas ete rafraichis, on signale:
			var b = document.createElement('b');
			b.appendChild(document.createTextNode('/!\\ Attention, ce tableau est probablement faux.'
				+ ' Visitez la page des Bonus/Malus'
				+ ' pour mettre à jour votre fatigue. /!\\'));
			b.style.color = 'red';
			insertPt.appendChild(b);
			appendBr(insertPt);
		}
		appendBr(insertPt);
	}

	if(pvcourant<=0) {
		appendText(insertPt,'Aucun calcul possible : vous êtes mort voyons !');
		return;
	}

	if(fatigue>30) {
		appendText(insertPt,'Vous êtes trop fatigué pour accélérer.');
		return;
	}

	// Setup lastDLAZone
	if(overDLA) {
		// bypass des infos de "menu_FF.js" en cas d'overDLA
		DLAaccel = new Date(  DLAsuiv );
		lastDLA = new Date( DLA );
		MY_setValue(numTroll+'.DLA.ancienne',DateToString(DLA));
		// ***INIT GLOBALE*** pvActuelKastar
		pvActuelKastar = Math.min(pvcourant+regmoy,pvtotal);
		appendText(
			insertPt,
			'/!\\ Votre DLA est dépassée, calculs basés sur des estimations. /!\\',
			true
		);
		appendBr(insertPt);
	} else {
		DLAaccel = new Date( DLA );
		pvActuelKastar = pvcourant;
		if(MY_getValue(numTroll+'.DLA.ancienne')) {
			lastDLA = new Date(StringToDate(MY_getValue(numTroll+'.DLA.ancienne')));
		} else {
			lastDLA = false;
		}
	}
	appendText(insertPt,'Dernière DLA enregistrée : ');
	lastDLAZone = document.createElement('span');
	lastDLAZone.style.cursor = 'pointer';
	var b = document.createElement('b');
	b.onclick = inputMode;
	lastDLAZone.appendChild(b);
	insertPt.appendChild(lastDLAZone);
	if(lastDLA) {
		appendText(b,DateToString(lastDLA));
	} else {
		appendText(b,'aucune');
	}
	appendBr(insertPt);

	// Setup maxAMZone et cumulZone
	appendText(insertPt,'Accélération maximale possible : ');
	maxAMZone = document.createElement('b');
	insertPt.appendChild(maxAMZone);
	appendBr(insertPt);
	cumulZone = document.createElement('span');
	insertPt.appendChild(cumulZone);

	refreshAccel();
}

function refreshAccel() {
	var pvs, pvsmax;

	// Acceleration pour cumul instantane
	//window.console.debug('refreshAccel',pvActuelKastar,DLAaccel,lastDLA,minParPV);
	if(lastDLA) {
		pvsmax = Math.min(
			pvActuelKastar-1,
			Math.ceil( Math.floor((DLAaccel-lastDLA)/6e4)/minParPV )
		);
		maxAMZone.innerHTML = pvsmax+" PV";
	} else {
		pvsmax = pvActuelKastar-1;
		maxAMZone.innerHTML = "inconnue";
	}

	// pvAccel = (nb min avant DLA (arr. sup) / nb min p/ PVsac) (arrondi sup)
	pvs = Math.ceil( Math.ceil((DLAaccel-HeureServeur)/6e4) / minParPV );
	cumulZone.innerHTML = '';
	if(pvs<=pvsmax) {
		appendText(cumulZone,'Vous devez accélérer d\'au moins ');
		appendText(cumulZone,pvs+' PV', true);
		appendText(cumulZone,' pour activer immédiatement un nouveau tour.');
		if(pvs!=1) {
			var gainSec = Math.floor((DLAaccel-HeureServeur)/1e3)
				-(pvs-1)*60*minParPV;
			appendText(
				cumulZone,
				' ('+(pvs-1)+' PV dans '+
				Math.floor(gainSec/60)+'min'+
				addZero(gainSec%60)+'s)'
			);
		}
	} else {
		var avantDLA = new Date( DLAaccel-HeureServeur-pvsmax*minParPV*6e4 );
		appendText(
			cumulZone,
			'Après votre accélération maximale, il vous faudra encore attendre '+
			dureeHM(avantDLA/6e4)+
			' avant de réactiver.'
		);
	}
}


/*-[functions]-------- Fonctions gerant les infos-bulles ---------------------*/

function traitementTalents() {
	trCompetence = document.querySelectorAll("#comp table#competences>tbody>tr");
	trSorts = document.querySelectorAll("#sort table#sortileges>tbody>tr");
	removeAllTalents();
	var totalComp = injecteInfosBulles(trCompetence,'competences');
	var totalSort = injecteInfosBulles(trSorts,'sortileges');
	document.querySelector('#comp>div>h3.mh_tdtitre').textContent+=' (Total : '+totalComp+'%)';
	document.querySelector('#sort>div>h3.mh_tdtitre').textContent+=' (Total : '+totalSort+'%)';
}

function injecteInfosBulles(liste,fonction) {
	var totalpc = 0;
	// on parse la liste des talents du type 'fonction'
	for(var i=0 ; i<liste.length ; i++) {
		var
			trTalent=liste[i],
			node=trTalent.cells[1].querySelector('a'),
			nomTalent=epure(trim(node.textContent)),
			indiceTDniveaux=7,
			indiceTDSousCompetence=2,
			sousCompetences=undefined;
		if(fonction=="competences"){
			// un TD en plus pour des information complementaire liees a la comp
			indiceTDniveaux++;
			// chercher les sous-compétence (type de golem, type de piège) s'il y a
			sousCompetences = trTalent.cells[indiceTDSousCompetence].textContent.split(',');
			for (var j=0; j < sousCompetences.length; j++) {
				sousCompetences[j] = sousCompetences[j].epure().trim();
				if (arrayTalents[sousCompetences[j]]) sousCompetences[j] = arrayTalents[sousCompetences[j]];
			}
		}
		var niveauxMaitrisesTalentArray=getNumbers(trTalent.cells[indiceTDniveaux].textContent);
		setInfos(node,nomTalent,fonction,niveauxMaitrisesTalentArray[0]);
		setTalent(nomTalent,niveauxMaitrisesTalentArray[1],niveauxMaitrisesTalentArray[0],sousCompetences);
		totalpc += niveauxMaitrisesTalentArray[1];

		// stockage des niveaux inferieurs du talent si presents
		for(var j=2 ; j<niveauxMaitrisesTalentArray.length ; j+=2) {
			setTalent(nomTalent,niveauxMaitrisesTalentArray[j+1],niveauxMaitrisesTalentArray[j],sousCompetences);
			totalpc+=niveauxMaitrisesTalentArray[j+1];
		}
	}
	return totalpc;
}

function setInfos(node,nom,fonction,niveau) {
	node.nom = nom;
	node.fonction = fonction;
	node.niveau = niveau;
	node.onmouseover = setBulle;
	node.onmouseout = cacherBulle;
}

var arrayModifAnatroll = {
	'Glue':'Glu',
	'PuM':'PuiM',
	'HE':'Hurlement',
	//'Insultes':'Insu',
	'Pistage':'Pist',
	'PuC':'Planter',
	'Golemo':'Golem',
}

function setTalent(nom,pc,niveau,sousCompetences) {
	// Nota : voir plus tard si stocker les effets des comps/sorts directement
	// (et pas les % dont osf) ne serait pas plus rentable
	var nomEnBase = arrayTalents[epure(nom)];
	if(!nomEnBase) {
		debugMZ("setTalent: le talent "+nom+" n'est pas dans la base MZ");
		return;
	}
	if(!niveau) { niveau = 1; }

	switch(nomEnBase) {
		case 'Insultes':
			urlAnatrolliseur += 'Insu'+niveau+'|';
		case 'IdT':
			nomEnBase += niveau;
			break;
		case 'Piege':
			for (var i=0 ; i < sousCompetences.length ; i++) {
				urlAnatrolliseur += (arrayModifAnatroll[sousCompetences[i]] ?
					arrayModifAnatroll[sousCompetences[i]] : sousCompetences[i]) + '|';
			}
			break;
		case 'AP':
		case 'CdB':
		case 'CdM':
		case 'Parer':
		case 'Retraite':
		case 'RB':
		case 'SInterposer':
			nomEnBase += niveau;
		default:
			urlAnatrolliseur += (arrayModifAnatroll[nomEnBase] ?
				arrayModifAnatroll[nomEnBase] : nomEnBase) + '|';
	}
	//debugMZ("setTalent: nom=" + nom + ", pc=" + pc + ", niveau=" + niveau + ", sousCompetences=" + JSON.stringify(sousCompetences) + "=>setValue(" + numTroll+'.talent.'+nomEnBase+", " + pc + ")");
	MY_setValue(numTroll+'.talent.'+nomEnBase,pc);
}

function creerBulleVide() {
	var table = document.createElement('table');
	table.id = 'bulle';
	table.className = 'mh_tdborder';
	table.width = 300;
	table.border = 0;
	table.cellPadding = 5;
	table.cellSpacing = 1;
	table.style =
		 'position:absolute;'
		+'visibility:hidden;'
		+'z-index:800;'
		+'height:auto;';
	var tr = appendTr(table,'mh_tdtitre');
	appendTdText(tr,'Titre');
	tr = appendTr(table,'mh_tdpage');
	appendTdText(tr,'Contenu');
	var aList = document.getElementsByTagName('a');
	aList[aList.length-1].parentNode.appendChild(table);
	return table;
	}

function cacherBulle() {
	if(bulleStyle)
        bulleStyle.visibility = 'hidden';
}

function setBulle(evt) {
	var nom = this.nom;
	var fonction = this.fonction;
	var niveau = parseInt(this.niveau);
	var str='';
	if(fonction=='competences'){
		str=competences(nom,niveau);
	} else if(fonction=='sortileges') {
		str=sortileges(nom);
	} else if (fonction == '*') {	// pour les raccourcis de la frame de gauche : on ne sait pas si c'est compétence ou sort
		str=competences(nom,niveau);
		if (str == '') str=sortileges(nom);
	}
	if(str=='') {
		if (MY_DEBUG) window.console.log('MZ setBulle, pas de description sur ' + nom);
		return;
	}
	if(nom.indexOf('Golem')!=-1) nom='Golemologie';

	var xfenetre, yfenetre, xpage, ypage, element = null;
	var offset = 15;
	var bulleWidth = 300;
	if(!hauteur) hauteur = 50;
	element = document.getElementById('bulle');
	if (!element) element = creerBulleVide();
	xfenetre = evt.clientX;
	yfenetre = evt.clientY;
	xpage = xfenetre;
	ypage = yfenetre;
	if(evt.pageX) xpage = evt.pageX;
	if(evt.pageY) ypage = evt.pageY;
	if(element) {
		bulleStyle = element.style;
		element.firstChild.firstChild.innerHTML = '<b>'+nom+'</b>';
		element.childNodes[1].firstChild.innerHTML = str;
	}
	if(bulleStyle) {
		if(xfenetre>bulleWidth+offset)
			xpage -= bulleWidth+offset;
		else
			xpage += offset;
		if(yfenetre>hauteur+offset)
			ypage -= hauteur + offset;
		bulleStyle.width = bulleWidth;
		bulleStyle.left = xpage + 'px';
		bulleStyle.top = ypage + 'px';
		bulleStyle.visibility = 'visible';
    }
}


/*-[functions] Textes des infos-bulles pour les competences et sortileges ----*/

function competences(comp,niveau) {
	var
		modA = atttour?Math.floor((att+atttourD)*atttour/100):0,
		modD = degtour?Math.floor(deg*degtour/100):0,
		texte = "";

	if(comp.indexOf('Acceleration du Metabolisme')!=-1 && minParPV!=null) {
		texte = '<b>1</b> PV = <b>'+minParPV+'</b> minute';
		if(minParPV>1) texte += 's';
		if(overDLA) texte += '<br/><i>(Votre DLA est dépassée.)</i>';
	} else if(comp.indexOf("Attaque Precise")!=-1) {
		var
			i, pc,
			lastmax=0,
			jetatt, espatt=0,
			notMaxedOut = false;

		for(i=niveau ; i>0 ; i--) {
			pc = getTalent(comp,i);
			if(lastmax!=0 && pc<=lastmax) {
				// Si %AP(i)<%AP(i+1), on passe AP(i)
				continue;
			}
			jetatt = Math.round(3.5*(
				Math.min(Math.floor(1.5*att), att+3*i) + modA
			)) + attbp+attbm;
			espatt += (pc-lastmax)*jetatt;
			texte += "Attaque niv. "+i +
			         " ("+(pc-lastmax)+"%) : <b>" +
			         Math.min(Math.floor(att*1.5), att+3*i)+"</b> D6 ";
			if(modA) {
				texte += "<i>"+aff(modA)+"D6</i> ";
			}
			texte += aff(attbp+attbm)+" => <b>"+jetatt+"</b><br>";
			lastmax = pc;
			if(i<niveau) {
				// Si l'un des % de niveau inf est > % nivmax,
				// on affiche l'espérance à la fin
				notMaxedOut = true;
			}
		}
		if(notMaxedOut) {
			texte += "<i>Attaque moyenne (si réussite) : <b>" +
			         Math.floor(10*espatt/lastmax)/10+"</b></i><br>";
		}
		texte += "Dégâts : <b>"+deg+"</b> D3 ";
		if(modD) {
			texte += "<i>"+aff(modD)+"D3</i> ";
		}
		texte += aff(degbp+degbm) +
		         " => <b>"+degmoytour+"/"+degmoycrittour+"</b>";
	} else if(comp.indexOf("Balayage")!=-1) {
		texte = "Déstabilisation : <b>"+att+"</b> D6 ";
		if(modA) {
			texte += "<i>"+aff(modA)+"D6</i> ";
		}
		texte += aff(attbp+attbm) +
		         " => <b>"+attmoytour+"</b><br>" +
		         "Effet : <b>Met à terre l'adversaire</b>";
	} else if(comp.indexOf('Bidouille')!=-1)
		texte = 'Bidouiller un trésor permet de compléter le nom d\'un objet '
			+'de votre inventaire avec le texte de votre choix.';
	else if(comp.indexOf('Baroufle')!=-1){
		texte = 'Vous voulez encourager vos compagnons de chasse ? '
			+'Ramassez quelques Coquillages, et en avant la musique !<br>';
        texte +='<table class="mh_tdborder" cellspacing="1" cellpadding="1" border="0"><tbody>' +
            '<tr class="mh_tdtitre"><th>Nom</th><th>Effet</th></tr>' +
            '<tr class="mh_tdpage"><td>Badaboum</td><td>att +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Booong</td><td>deg +1 / esq -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Gaaaw</td><td>Fatigue +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Ghimighimighimi</td><td>Impacte le baroufleur</td></tr>' +
            '<tr class="mh_tdpage"><td>Huitsch</td><td>deg -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Kliketiiik</td><td>esq -1 / concentration -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Krouiiik</td><td>concentration -2</td></tr>' +
            '<tr class="mh_tdpage"><td>Kssksss</td><td>esq +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Praaaouuut</td><td>reg-1 </td></tr>'+
            '<tr class="mh_tdpage"><td>Sssrileur</td><td>seuil 6, rend visible</td></tr>' +
            '<tr class="mh_tdpage"><td>Tagadagada</td><td>augmente le nombre de tours (1 tour par tranche de 2)</td></tr>' +
            '<tr class="mh_tdpage"><td>Tuutuuuut</td><td>att -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Whaaag</td><td>augmente la portée horizontale (1 case par tranche de 4)</td></tr>' +
            '<tr class="mh_tdpage"><td>Whoooom</td><td>concentration +2</td></tr>' +
            '<tr class="mh_tdpage"><td>Ytseukayndof</td><td>seuil 2, rend les bonus magiques</td></tr>' +
            '<tr class="mh_tdpage"><td>Zbouing </td><td>reg +1</td></tr>' +
        '</tbody></table>';
	} else if(comp.indexOf("Botte Secrete")!=-1) {
		modA = atttour?Math.floor(Math.floor(2*att/3)*atttour/100):0;
		modD = degtour?Math.floor(Math.floor(att/2)*degtour/100):0;
		texte = "Attaque : <b>"+Math.floor(2*att/3)+"</b> D6 ";
		if(modA) {
			texte += "<i>"+aff(modA)+"D6</i> ";
		}
		texte += aff(Math.floor((attbp+attbm)/2)) +
		         " => <b>"+Math.round(
		         	3.5*(Math.floor(2*att/3)+modA)+Math.floor((attbp+attbm)/2)
		         )+"</b><br/>Dégâts : <b>"+Math.floor(att/2)+"</b> D3 ";
		if(modD) {
			texte += "<i>"+aff(modD)+"D3</i> ";
		}
		texte += aff(Math.floor((degbp+degbm)/2))+" => <b>" +
		         (2*(Math.floor(att/2)+modD)+Math.floor((degbp+degbm)/2)) +
		         "/"+(
		         	2*(Math.floor(1.5*Math.floor(att/2))+modD) +
		         	Math.floor((degbp+degbm)/2)
		         )+"</b>";
	} else if(comp.indexOf('Camouflage')!=-1) {
		var camou = getTalent('Camouflage');
		texte = 'Pour conserver son camouflage, il faut réussir un jet sous:<br/>'
			+'<i>Déplacement :</i> <b>'+Math.floor(0.75*camou)+'%</b><br/>'
			+'<i>Attaque :</i> <b>perte automatique</b>.<br/>'
			+'<i>Projectile Magique :</i> <b>'+Math.floor(0.25*camou)+'%</b>';
	} else if(comp.indexOf("Charger")!=-1) {
		if(pvcourant<=0) {
			// N'est plus censé se produire : activation obligatoire si mort
			return "<i>On ne peut charger personne quand on est mort !</i>";
		}
		var portee = Math.min(
			Math.max(
				getPortee(reg+Math.floor(pvcourant/10)) -
				Math.floor((fatigue+bmfatigue)/5),
				1
			),
			vuetotale
		);
		if(portee<1) {
			return "<b>Impossible de charger</b>";
		}
		texte = "Attaque : <b>"+att+"</b> D6 ";
		if(modA) {
			texte += "<i>"+aff(modA)+"D6</i> ";
		}
		texte += aff(attbp+attbm) +
		         " => <b>"+attmoytour+"</b><br>" +
		         "Dégâts : <b>"+deg+"</b> D3 ";
		if(modD) {
			texte += "<i>"+aff(modD)+"D3</i> ";
		}
		texte += aff(degbp+degbm) +
		         " => <b>"+degmoytour+"/"+degmoycrittour+"</b><br>" +
		         "Portée : <b>"+portee+"</b> case";
		if(portee>1) { texte += "s"; }
	} else if(comp.indexOf('Connaissance des Monstres')!=-1) {
		texte = 'Portée horizontale : <b>'+vuetotale+'</b> case';
		if(vuetotale>1) texte += 's';
		texte += '<br/>Portée verticale : <b>'+Math.ceil(vuetotale/2)+'</b> case';
		if(vuetotale>2) texte += 's';
	}
	else if(comp.indexOf('Piege')!=-1) {
		texte = 'Piège à Glue :<ul><li>Et si vous colliez vos adversaires au sol ?</li></ul>';
		texte += 'Piège à Feu: <ul><li>À moins que vous ne préfériez les envoyer en l\'air !</li>';
		texte += '<li>Dégats du piège à feu : <b>'+Math.floor((esq+vue)/2)+'</b> D3'
				+' => <b>'+2*Math.floor((esq+vue)/2)+' ('+resiste((esq+vue)/2)+')</b></li></ul>';
	} else if(comp.indexOf("Contre-Attaquer")!=-1) {
		modA = atttour?Math.floor(Math.floor(att/2)*atttour/100):0;
		texte = "Attaque : <b>"+Math.floor(att/2)+"</b> D6 ";
		if(modA) {
			texte += "<i>"+aff(modA)+"D6</i> ";
		}
		texte += aff(Math.floor((attbp+attbm)/2)) +
		         " => <b>"+Math.round(
		         	3.5*(Math.floor(att/2)+modA)+Math.floor((attbp+attbm)/2)
		         )+"</b><br>" +
		         "Dégâts : <b>"+deg+"</b> D3 ";
		if(modD) {
			texte += "<i>"+aff(modD)+"D3</i> ";
		}
		texte += aff(degbp+degbm) +
		         " => <b>"+degmoytour+"/"+degmoycrittour+"</b>";
	} else if(comp.indexOf("Coup de Butoir")!=-1) {
		var
			i, pc,
			lastmax=0,
			jetdeg, espdeg=0,
			notMaxedOut = false;

		texte = "Attaque : <b>"+att+"</b> D6 ";
		if(modA) {
			texte += "<i>"+aff(modA)+"D6</i> ";
		}
		texte += aff(attbp+attbm) +
		         " => <b>"+attmoytour+"</b>";
		for(i=niveau ; i>0 ; i--) {
			pc = getTalent(comp,i);
			if(lastmax!=0 && pc<=lastmax) {
				// Si %CdB(i)<%CdB(i+1), on passe CdB(i)
				continue;
			}
			jetdeg = 2*(
			         	Math.min(Math.floor(1.5*deg), deg+3*i) + modD
					) + degbp+degbm;
			espdeg += (pc-lastmax)*jetdeg;
			texte += "<br>Dégâts niv. "+i+" ("+(pc-lastmax)+"%) : <b>" +
			         Math.min(Math.floor(deg*1.5),deg+3*i)+"</b> D3 ";
			if(modD) {
				texte += "<i>"+aff(modD)+"D3</i> ";
			}
			texte += aff(degbp+degbm) +
			         " => <b>"+jetdeg +
					 "/"+(jetdeg+2*Math.floor(deg/2))+"</b>";
			lastmax = pc;
			if(i<niveau) {
				// Si l'un des % de niveau inf est > % nivmax,
				// on affiche l'espérance à la fin
				notMaxedOut = true;
			}
		}
		if(notMaxedOut) {
			texte += "<br><i>Dégâts moyens (si réussite) : <b>" +
			         Math.floor(10*espdeg/lastmax)/10+"/" +
			         (Math.floor(10*espdeg/lastmax)/10+2*Math.floor(deg/2)) +
					 "</b></i>";
		}
	} else if(comp.indexOf('Course')!=-1)
		texte = 'Déplacement gratuit : <b>'
			+Math.floor(getTalent('Course')/2)
			+' %</b> de chance';
	else if(comp.indexOf('Deplacement Eclair')!=-1)
		texte = 'Permet d\'économiser <b>1</b> PA '
			+'par rapport au déplacement classique';
	else if(comp.indexOf('Dressage')!=-1)
		texte = 'Le dressage permet d\'apprivoiser un Gowap redevenu sauvage, un Mouch\'oo Sauvage '
			+'ou un Gnu Sauvage. La portée est de une case.';
	else if(comp.indexOf('Ecriture Magique')!=-1)
		texte = 'Réaliser la copie d\'un sortilège après en avoir découvert '
			+'la formule nécessite de réunir les composants de cette formule, '
			+'d\'obtenir un parchemin vierge sur lequel écrire, et de récupérer '
			+'un champignon adéquat pour confectionner l\'encre.';
	else if(comp.indexOf('Frenesie')!=-1) {
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff((attbp+attbm))
			+' => <b>'+attmoy+'</b><br/>'
			+'Dégâts : <b>'+deg+'</b> D3 '+aff((degbp+degbm))
			+' => <b>'+degmoy+'/'+degmoycrit+'</b>';
	}
	else if(comp.indexOf('Golem')!=-1)
		texte = 'Animez votre golem en assemblant divers matériaux '
			+'autour d\'un cerveau minéral.'
	else if(comp.indexOf('Grattage')!=-1) {
		texte = 'Permet de confectionner un Parchemin Vierge '
			+'à partir de composants et de Gigots de Gob\'.';
	}
	else if(comp.indexOf('Hurlement Effrayant')!=-1)
		texte = 'Fait fuir un monstre si tout se passe bien.'
			+'<br/>Lui donne de gros bonus sinon...';
	else if(comp.indexOf('Identification des Champignons')!=-1) {
		texte = 'Portée horizontale : <b>'+Math.floor(vuetotale/2)+'</b> case';
		if(vuetotale>2) texte += 's';
		texte += '<br/>Portée verticale : <b>'+Math.floor(vuetotale/4)+'</b> case';
		if(vuetotale>4) texte += 's';
	}
	else if(comp.indexOf('Insultes')!=-1)
		texte = 'Portée horizontale : <b>'+Math.min(vuetotale,1)+'</b> case';
	else if(comp.indexOf('interposer')!=-1)
		texte = 'Jet de réflexe : <b>'
			+Math.floor(2*(esq+reg)/3)+'</b> D6 '+aff((esqbp+esqbm))
			+' => <b>'+Math.round(3.5*Math.floor(2*(esq+reg)/3)+(esqbp+esqbm))+'</b>';
	else if(comp.indexOf('Lancer de Potions') != -1)
		texte = 'Portée : <b>'+(2+Math.floor(vuetotale/5))+'</b> cases';
	else if(comp.indexOf('Marquage')!=-1)
		texte = 'Marquage permet de rajouter un sobriquet à un monstre. Il faut '
			+'bien choisir le nom à ajouter car celui-ci sera définitif. Il faut '
			+'se trouver dans la même caverne que le monstre pour le marquer.';
	else if(comp.indexOf('Melange Magique')!=-1)
		texte = 'Cette Compétence permet de combiner deux Potions pour '
			+'en réaliser une nouvelle dont l\'effet est la somme '
			+'des effets des potions initiales.';
	else if(comp.indexOf('Travail de la Pierre')!=-1)
		texte = 'Miner :<ul><li>Portée horizontale (officieuse) : <b>'
			+2*vuetotale+'</b> cases</li>'
			+'<li>Portée verticale (officieuse) : <b>'
			+2*Math.ceil(vuetotale/2)+'</b> cases</li></ul>'
			+'Tailler: <ul><li>Permet d\'augmenter sensiblement la valeur marchande de certains '
			+'minerais. Mais cette opération délicate n\'est pas sans risques...</li></ul>';
	else if(comp.indexOf('Necromancie')!=-1)
		texte = 'La Nécromancie permet à partir des composants d\'un monstre '
			+'de faire "revivre" ce monstre.';
	else if(comp.indexOf('Painthure de Guerre')!=-1)
		texte = 'Grimez vos potrõlls et réveillez l\'esprit guerrier '
			+'qui sommeille en eux ! Un peu d\'encre, une Tête Réduite '
			+'pour s\'inspirer, et laissez parler votre créativité.'
	else if(comp.indexOf("Parer")!=-1) {
		modA = atttour?Math.floor(Math.floor(att/2)*atttour/100):0;
		texte = "Jet de parade : <b>"+Math.floor(att/2)+"</b> D6 ";
		if(modA) {
			texte += "<i>"+aff(modA)+"D6</i> ";
		}
		texte += aff(Math.floor((attbp+attbm)/2)) +
		         " => <b>"+Math.round(
		         	3.5*(Math.floor(att/2)+modA) +
		         	Math.floor((attbp+attbm)/2)
		         )+"</b><hr>Equivalent esquive : <b>" +
		         (Math.floor(att/2)+esq)+"</b> D6 ";
		if(modA) {
			texte += "<i>"+aff(modA)+"D6</i> ";
		}
		texte += aff(Math.floor((attbp+attbm)/2)+esqbp+esqbm) +
		         " => <b>"+(Math.round(
		         	3.5*(Math.floor(att/2)+modA+esq) +
		         	Math.floor((attbp+attbm)/2)
				 )+esqbp+esqbm)+"</b></i>";
	} else if(comp.indexOf('Pistage')!=-1)
		texte = 'Portée horizontale : <b>'
			+2*vuetotale+'</b> cases<br/>'
			+'Portée verticale : <b>'
			+2*Math.ceil(vuetotale/2)+'</b> cases';
	else if(comp.indexOf('Planter un Champignon')!=-1)
		texte = 'Planter un Champignon est une compétence qui vous permet de '
			+'créer des colonies d\'une variété donnée de champignon à partir de '
			+'quelques exemplaires préalablement enterrés.';
	else if(comp.indexOf('Regeneration Accrue')!=-1)
		texte = 'Régénération : <b>'+Math.floor(pvtotal/15)+'</b> D3'
			+' => <b>+'+2*Math.floor(pvtotal/15)+'</b> PV';
	else if(comp.indexOf('Reparation')!=-1)
		texte = 'Marre de ces arnaqueurs de forgerons ? Prenez quelques outils, '
			+'et réparez vous-même votre matériel !';
	else if(comp.indexOf('Retraite')!=-1)
		texte = 'Vous jugez la situation avec sagesse et estimez qu\'il serait '
			+'préférable de préparer un repli stratégique pour déconcerter '
			+'l\'ennemi et lui foutre une bonne branlée ... plus tard. MOUAHAHA ! '
			+'Quelle intelligence démoniaque.';
	else if(comp.indexOf("RotoBaffe")!=-1) {
		var
			Datt = att, vattbm = attbp+attbm,
			Ddeg = deg, vdegbm = degbp+degbm;
		for(var i=1 ; i<niveau+2 ; i++) {
			texte += "<b>Attaque n°"+i+" :</b><br>" +
			         "Attaque : <b>"+Datt+"</b> D6 ";
			if(modA) {
				texte += "<i>"+aff(modA)+"D6</i> ";
			}
			texte += aff(vattbm) +
			         " => <b>"+(Math.round(3.5*(Datt+modA))+vattbm)+"</b><br>" +
			         "Dégâts : <b>"+Ddeg+"</b> D3 ";
			if(modD) {
				texte += "<i>"+aff(modD)+"D3</i> ";
			}
			texte += aff(vdegbm) +
			         " => <b>"+(2*(Ddeg+modD)+vdegbm) +
			         "/"+(2*(Math.floor(1.5*Ddeg)+modD)+vdegbm)+"</b>";
			Datt = Math.floor(0.75*Datt);
			modA = atttour?Math.floor((Datt+atttourD)*atttour/100):0;
			vattbm = Math.floor(0.75*vattbm);
			Ddeg = Math.floor(0.75*Ddeg);
			modD = degtour?Math.floor(Ddeg*degtour/100):0;
			vdegbm = Math.floor(0.75*vdegbm);
			if(i<niveau+1) { texte += "<hr>"; }
		}
	} else if(comp.indexOf('Shamaner')!=-1)
		texte = 'Permet de contrecarrer certains effets des pouvoirs spéciaux '
			+'des monstres en utilisant des champignons (de 1 à 3).';
	return texte;
}

function sortileges(sort) {
	sort = sort.toLowerCase();
	var
		// Fonctions utiles uniquement à "sortileges"
		decumul_buff = function(nom,str,buff) {
			// Décumul des sorts de buff (old school)
			var
				txt = "1<sup>ere</sup>"+nom+" : <b>"+str+" +"+buff+"</b>",
				dec = buff,
				total = buff,
				i=1;
			while(i<6) {
				i++;
				dec = Math.floor(coefDecumul(i)*buff);
				if(dec<=1 || i==6) break;
				total += dec;
				txt += "<br/><i>"+i+"<sup>e</sup> "+nom+" : "+
					   str+" +"+dec+" (+"+total+")</i>";
			}
			txt += "<br/><i>"+i+"<sup>e</sup> et + : "+str+" +"+dec+"</i>";
			return txt;
		},
		nbrAdX = function(pc) {
			// Détermine le nombre d'AdX actifs à partir du % de D
			switch(Number(pc)) {
				case 0 : return 0;
				case 20: return 1;
				case 33: return 2;
				case 41: return 3;
				case 46: return 4;
				default: return Math.floor((Number(pc)-39)/2);
			}
		},
		decumulPc = function(n) {
			// Détermine le % de D décumulé du n-ième AdX
			switch(Number(n)) {
				case 0: return 0;
				case 1: return 20;
				case 2: return 13;
				case 3: return 8;
				case 4: return 5;
				case 5: return 3;
				default: return 2;
			}
		},
		decumulFixe = function(bm, n) {
			// Détermine le bonus fixe décumulé du n-ième AdX
			switch(Number(n)) {
				case 0: return 0;
				case 1: return Math.max(1,bm);
				case 2: return Math.max(1,Math.round(bm*6.7)/10);
				case 3: return Math.max(1,Math.round(bm*4)/10);
				default: return 1; // Sous les 1 de moyenne même en D6
			}
		},
		texte = "";

	if (sort.indexOf('analyse anatomique') != -1) {
		texte = 'Portée horizontale : <b>'
			+ Math.floor(vuetotale / 2) + '</b> case';
		if (vuetotale > 3){ texte += 's'; }
		texte += '<br/>Portée verticale : <b>'
			+ Math.floor((vuetotale+1)/4)+'</b> case';
		if (vuetotale > 7){ texte += 's'; }
	} else if (sort.indexOf('armure etheree') != -1) {
		texte = decumul_buff('AE', 'Armure magique', reg);
	} else if (sort.indexOf("augmentation")!=-1 && sort.indexOf("attaque")!=-1) {
		var
			categoriesAdA = {
				"attx1": {
					// Affichage: code MZ (cf arrayTalents)
					"AN": true,
					"AP": "AP1",
					"Balayage": "Balayage",
					"Charge": "Charger",
					"CdB": "CdB1",
					"Frénésie": "Frenesie",
					"RB": "RB1",
					"GdS": "GdS",
					"Siphon": "Siphon"
				},
				"attx2/3": {
					"Botte Secrète": "BS"
				},
				"attx1/2": {
					"CA": "CA",
					"Parer": "Parer1"
				},
				"degx2/3": {
					"Vampirisme": "Vampi"
				},
				"vuex1": {
					"Projectile Magique": "Projo"
				}
			},
			baseAdA = {
				"attx1"  : att,
				"attx2/3": Math.floor(2*att/3),
				"attx1/2": Math.floor(att/2),
				"degx2/3": Math.floor(2*deg/3),
				"vuex1"  : vue
			},
			pc = atttour,
			pcInit = pc,
			nbrAdA = nbrAdX(pc),
			categorie, talent, newTalent,
			i, DSup, fixe=0;

		i=nbrAdA;
		while(i++<nbrAdA+3) {
			pc += decumulPc(i);
			fixe += decumulFixe(3.5,i);
			if(texte) { texte += "<hr>"; }
			texte += "<b>"+i+"<sup>e</sup> AdA : " +
			         aff(pc)+"% de Dés d'attaque :</b><br>";
			for(categorie in categoriesAdA) {
				// On génére la liste: "talent1, talent2"
				DSup = Math.floor(baseAdA[categorie]*pc/100) -
				       Math.floor(baseAdA[categorie]*pcInit/100);
				newTalent = false;
				for(var talent in categoriesAdA[categorie]) {
					if(getTalent(categoriesAdA[categorie][talent])) {
						if(newTalent) { texte += ", "; }
						texte += talent;
						newTalent = true;
					}
				}
				if(newTalent) {
					// Si le trõll a au moins un talent dans la catégorie :
					texte += ": <b>+"+DSup+"D6 +"+Math.floor(fixe)+"</b> <i>(+" +
					         Math.floor(3.5*DSup+fixe) +")</i><br>";
				}
			}
		}
	} else if (sort.indexOf('augmentation') != -1 && sort.indexOf('esquive') != -1) {
		texte = decumul_buff('AdE', 'Esquive', Math.floor((esq-1)/2));
	} else if (sort.indexOf("augmentation des degats")!=-1) {
		var
			categoriesAdD = {
				"attx1/2": {
					"Botte Secrète": "BS"
				},
				"degx1": {
					"AN": true,
					"AP": "AP1",
					"Charge": "Charger",
					"CA": "CA",
					"CdB": "CdB1",
					"Frénésie": "Frenesie",
					"RB": "RB1",
					"Rafale": "Rafale",
					"Vampi": "Vampi"
				},
				"degx1/2": {
					"Griffe du Sorcier": "GdS"
				},
				"vuex1/2": {
					"Projectile Magique": "Projo"
				},
				"regx1": {
					"Siphon des Âmes": "Siphon"
				}
			},
			baseAdD = {
				"attx1/2": Math.floor(att/2),
				"degx1"  : deg,
				"degx1/2": Math.floor(deg/2),
				"vuex1/2": Math.floor(vue/2),
				"regx1"  : reg
			},
			pc = degtour,
			pcInit = pc,
			nbrAdD = nbrAdX(pc),
			categorie, talent, newTalent,
			i, DSup, fixe=0;

		i=nbrAdD;
		while(i++<nbrAdD+3) {
			pc += decumulPc(i);
			fixe += decumulFixe(2,i);
			if(texte) { texte += "<hr>"; }
			texte += "<b>"+i+"<sup>e</sup> AdD : " +
			         aff(pc)+"% de Dés de dégâts :</b><br>";
			for(categorie in categoriesAdD) {
				// On génére la liste: "talent1, talent2"
				DSup = Math.floor(baseAdD[categorie]*pc/100) -
				       Math.floor(baseAdD[categorie]*pcInit/100);
				newTalent = false;
				for(var talent in categoriesAdD[categorie]) {
					if(getTalent(categoriesAdD[categorie][talent])) {
						if(newTalent) { texte += ", "; }
						texte += talent;
						newTalent = true;
					}
				}
				if(newTalent) {
					// Si le trõll a au moins un talent dans la catégorie :
					texte += ": <b>+"+DSup+"D3 +"+Math.floor(fixe) +
					         "</b> <i>(+"+Math.floor(2*DSup+fixe) +
					         ")</i><br>";
				}
			}
		}
	} else if(sort.indexOf('bulle anti-magie')!=-1) {
		texte = 'RM : <b>+'+rm+'</b><br/>MM : <b>-'+mm+'</b>';
	}
	else if(sort.indexOf('bulle magique')!=-1){
		texte = 'RM : <b>-'+rm+'</b><br/>MM : <b>+'+mm+'</b>';
	}
	else if(sort.indexOf('explosion')!=-1){
		texte = 'Dégâts : <b>'
			+Math.floor( 1+(deg+Math.floor(pvtotal/10))/2 )+'</b> D3 '
			+' => <b>'+2*Math.floor(1+(deg+Math.floor(pvtotal/10))/2)
			+' ('+resiste(1+(deg+Math.floor(pvtotal/10))/2 )+')</b>';
	}
	else if(sort.indexOf('faiblesse passagere')!=-1){
		if(pvcourant<=0)
			return '<i>Dans votre état, vous n\'affaiblirez personne...</i>';
		texte = 'Portée horizontale : <b>'
			+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Dégâts physiques : <b>-'
			+Math.ceil( (Math.floor(pvcourant/10)+deg-5)/4 )
			+' (-'+Math.ceil( (Math.floor(pvcourant/10)+deg-5)/8 )+')</b><br/>'
			+'Dégâts magiques : <b>-'
			+Math.floor( (Math.floor(pvcourant/10)+deg-4)/4 )
			+' (-'+Math.floor( (Math.floor(pvcourant/10)+deg-2)/8 )+')</b>';
	}
	else if(sort.indexOf('flash aveuglant')!=-1){
		texte = 'Vue, Attaque, Esquive : <b>-'+(1+Math.floor(vue/5))+'</b>';
	}
	else if(sort.indexOf('glue')!=-1) {
		texte = 'Portée : <b>'+(1+Math.floor(vuetotale/3))+'</b> case';
		if(vuetotale>2) texte += 's';
	} else if(sort.indexOf("griffe du sorcier")!=-1) {
		var
			modD =0,
			addVenin = function(type, effet, duree) {
				var
					ret = "<b>Venin "+type+" : </b><br/><b>" +
					      effet+"</b> D3" +
					      " pendant <b>"+duree+"</b> tour",
					dureeReduite = Math.max(Math.floor(duree/2),1);
				if(duree>1) {
					ret += "s";
				}
				return ret +
				       " => <b>"+2*effet+" x "+duree+" = "+2*effet*duree +
				       "</b> ("+2*effet+" x "+dureeReduite+" = " +
				       2*effet*dureeReduite+")";
			},
			effet = 1+Math.floor((Math.floor(pvmax/10)+reg)/3);
		// Frappe
		texte = "Attaque : <b>"+att+"</b> D6 ";
		if(atttour!=0) {
			modD = Math.floor(att*atttour/100);
			texte += "<i>"+aff(modD)+"D6</i> ";
		}
		texte += aff(attbm)
			+" => <b>"+(Math.round(3.5*(att+modD))+attbm)+"</b><br/>"
			+"Dégâts : <b>"+Math.floor(deg/2)+"</b> D3 ";
		if(degtour!=0) {
			modD = Math.floor(Math.floor(deg/2)*degtour/100);
			texte += "<i>"+aff(modD)+"D3</i> ";
		} else {
			modD = 0;
		}
		texte += aff(degbm) +
		         " => <b>"+(2*(Math.floor(deg/2)+modD)+degbm) +
		         "/"+(2*(Math.floor(deg/2)+Math.floor(deg/4)+modD)+degbm) +
		         " ("+resiste(Math.floor(deg/2)+modD,degbm) +
		         "/"+resiste(Math.floor(deg/2)+Math.floor(deg/4)+modD,degbm) +
		         ")</b>";
		// Venins
		texte += "<hr>"+addVenin("insidieux",effet,2+Math.floor(vue/5));
		effet = Math.floor(1.5*effet);
		texte += "<hr>"+addVenin("virulent",effet,1+Math.floor(vue/10));
	} else if(sort.indexOf('hypnotisme')!=-1)
		texte = 'Esquive : <b>-'+Math.floor(1.5*esq)+'</b> Dés'
			+' (<b>-'+Math.floor(esq/3)+'</b> Dés)';
	else if(sort.indexOf('identification des tresors')!=-1)
		texte = 'Permet de connaitre les caractéristiques et effets précis '
			+'d\'un trésor.';
	else if(sort.indexOf('invisibilite')!=-1)
		texte = 'Un troll invisible est indétectable même quand on se trouve '
			+'sur sa zone. Toute action physique ou sortilège d\'attaque '
			+'fait disparaître l\'invisibilité.';
	else if(sort.indexOf('levitation')!=-1)
		texte = 'Prendre un peu de hauteur permet parfois d\'éviter les ennuis. '
			+'Comme les pièges ou les trous par exemple...';
	else if(sort.indexOf("projectile magique")!=-1) {
		var
			modD = 0,
			portee = getPortee(vuetotale);
		// Att
		texte = "Attaque : <b>"+vue+"</b> D6 ";
		if(atttour!=0) {
			modD = Math.floor(vue*atttour/100);
			texte += "<i>"+aff(modD)+"D6</i> ";
		}
		texte += aff(attbm) +
		         " => <b>"+(Math.round(3.5*(vue+modD))+attbm)+"</b><br>" +
		         "Dégâts : <b>"+Math.floor(vue/2)+"</b> D3 ";
		// Deg
		if(degtour!=0) {
			modD = Math.floor(Math.floor(vue/2)*degtour/100);
			texte += "<i>"+aff(modD)+"D3</i> ";
		} else {
			modD = 0;
		}
		texte += aff(degbm) +
		         " => <b>"+(2*(Math.floor(vue/2)+modD)+degbm) +
		         "/"+(2*(Math.floor(1.5*Math.floor(vue/2))+modD)+degbm) +
		         " ("+resiste(Math.floor(vue/2)+modD,degbm) +
		         "/"+resiste(1.5*Math.floor(vue/2)+modD,degbm) +
		         ") (+ 1D3 par bonus de portée)</b>";
		// Portée
		texte += "<br/>Portée : <b>"+portee+"</b> case";
		if(portee>1) texte += "s";
	} else if(sort.indexOf('projection')!=-1) {
		texte = 'Si le jet de résistance de la victime est raté:<br/>'
			+'la victime est <b>déplacée</b> et perd <b>1D6</b> d\'Esquive<hr>'
			+'Si le jet de résistance de la victime est réussi:<br/>'
			+'la victime ne <b>bouge pas</b> mais perd <b>1D6</b> d\'Esquive.';
	} else if(sort.indexOf("rafale psychique")!=-1) {
		var modD = 0;
		texte = "Dégâts : <b>"+deg+"</b> D3 ";
		if(degtour!=0) {
			modD = Math.floor(deg*degtour/100);
			texte += "<i>"+aff(modD)+"D3</i> ";
		}
		texte += aff(degbm) +
		         " => <b>"+(2*(deg+modD)+degbm) +
		         " ("+resiste(deg+modD,degbm)+")</b><br>" +
		         "Malus : régénération <b>-"+(deg+modD)+"</b>";
	} else if(sort.indexOf("sacrifice")!=-1) {
		if(pvcourant<=0) {
			// N'est plus censé se produire : activation obligatoire si mort
			return "<i>Qui voulez-vous donc soigner ? Vous êtes mort !</i>";
		}
		var
			perteSacro = function(sac) {
				return " (-"+(sac+2*(1+Math.floor(sac/5)))+" PV)";
			},
			sac = Math.floor((pvcourant-1)/2),
			pvdispoSansMalusTemps =
				pvcourant-pvtotal-Math.ceil((bmt+pdm)*pvtotal/250);

		texte = "Portée horizontale : <b>" +
		        Math.min(1,vuetotale)+"</b> case<br>" +
		        "Soin maximal : <b>"+sac+"</b> PV"+perteSacro(sac);
		// Sacros max et optimal sans malus (propale R')
		sac = Math.floor((pvdispoSansMalusTemps-2)*5/7);
		if(sac>0) {
			texte += "<hr>Soin maximum limitant les risques de malus " +
			         "de temps : <b>" +sac+"</b> PV"+perteSacro(sac);
		} else {
			texte += "<hr>Vous ne pouvez pas compenser de blessures " +
			         "dues à un sacrifice";
		}
	} else if(sort.indexOf("siphon")!=-1) {
		var modD = 0;
		texte = "Attaque : <b>"+att+"</b> D6 ";
		if(atttour!=0) {
			modD = Math.floor(att*atttour/100);
			texte += "<i>"+aff(modD)+"D6</i> ";
		}
		texte += aff(attbm) +
		         " => <b>"+Math.round(3.5*(att+modD)+attbm)+"</b><br>" +
		         "Dégâts : <b>"+reg+"</b> D3 ";
		if(degtour!=0) {
			modD = Math.floor(reg*degtour/100);
			texte += "<i>"+aff(modD)+"D3</i> ";
		} else {
			modD = 0;
		}
		texte += aff(degbm) +
		         " => <b>"+(2*(reg+modD)+degbm) +
		         "/" + (2*(Math.floor(1.5*reg)+modD)+degbm) +
		         " ("+resiste(reg+modD,degbm) +
		         "/"+resiste(1.5*reg+modD,degbm)+")</b>";
		texte += "<br>Nécrose : attaque magique <b>-"+(reg+modD)+"</b>";
	} else if(sort.indexOf('telekinesie')!=-1) {
		texte = 'Portée horizontale  :';
		var vt = Math.floor(vuetotale/2)+2;
		var strList = ['d\'une Plum\' ou Très Léger','Léger',
					'Moyen','Lourd','Très Lourd ou d\'une Ton\''];
		for(var i=0 ; i<5 ; i++) {
			texte += '<br/><i>Trésor '+strList[i]+' : </i><b>'+vt+'</b> case';
			if(vt>1) texte += 's';
			vt=Math.max(0,vt-1);
		}
	}
	else if(sort.indexOf('teleportation')!=-1) {
		var portee = getPortee(pitotal/5);	// Roule, 30/09/2016, TP basé sur les PI
		debugMZ('calcul portée Teleportation, pitotal=' + pitotal + ', portée=' + portee);
		var pmh = (20+vue+portee);
		var pmv = 3+Math.floor(portee/3);
		texte = 'Portée horizontale : <b>'+pmh+'</b> cases<br/>'
			+'Portée verticale : <b>'+pmv+'</b> cases<hr>'
			+'X compris entre '+(posX-pmh)+' et '+(posX+pmh)+'<br/>'
			+'Y compris entre '+(posY-pmh)+' et '+(posY+pmh)+'<br/>'
			+'N compris entre '+(posN-pmv)+' et '+Math.min(-1,posN+pmv)+'<br/>';
	} else if(sort.indexOf('vampirisme')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+Math.floor(2*deg/3)+'</b> D6 ';
		if(atttour!=0) {
			modD = Math.floor(Math.floor(2*deg/3)*atttour/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
		}
		texte += aff(attbm) +
		         ' => <b>'+Math.round(3.5*(Math.floor(2*deg/3)+modD)+attbm) +
		         '</b><br/>Dégâts : <b>'+deg+'</b> D3 ';
		if(degtour!=0) {
			modD = Math.floor(deg*degtour/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
		} else {
			modD = 0;
		}
		texte += aff(degbm) +
		         ' => <b>'+(2*(deg+modD)+degbm) +
		         '/'+(2*(Math.floor(1.5*deg)+modD)+degbm) +
		         ' ('+resiste(deg+modD,degbm) +
		         '/'+resiste(1.5*deg+modD,degbm)+')</b>';
	} else if(sort.indexOf('vision accrue')!=-1)
		texte = decumul_buff('VA','Vue',Math.floor(vue/2));
	else if(sort.indexOf('vision lointaine')!=-1)
		texte = 'En ciblant une zone située n\'importe où dans le '
			+'Monde Souterrain, votre Trõll peut voir comme s\'il s\'y trouvait.';
	else if(sort.indexOf('voir le cache')!=-1)
		texte = '<b>Sur soi :</b><br/>Portée horizontale : <b>'
			+Math.min(5,getPortee(vue))+'</b> cases<hr>'
			+'<b>A distance :</b><br/>Portée horizontale : <b>'
			+getPortee(vuetotale)+'</b> cases';
	else if(sort.indexOf('vue troublee')!=-1)
		texte = 'Portée horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Vue : <b>-'+Math.floor(vue/3)+'</b>';
	return texte;
}


/*---------------------------------- Main ------------------------------------*/

function do_profil2()
{
	try {
		start_script(31);

		extractionDonnees();
		setInfosCaracteristiques();
		setInfoDescription();
		setInfosEtatLieux();
		setInfosEtatPV();
		setInfosExp();

		creerBulleVide();
		traitementTalents();
		setLienAnatrolliseur();

		// Cette fonction modifie lourdement le DOM, à placer en dernier :
		if(race=='Kastar' || MY_DEBUG){ setAccel(); }
		saveProfil();
		displayScriptTime();
	} catch(e) {
		avertissement("[MZ " + GM_info.script.version + "] Une erreur s'est produite.<br>" + traceStack(e, 'profil2').replace("\n", "<br>"), 1000000, true);
		window.console.error(traceStack(e, 'profil2'));
	}
}

/*******************************************************************************
*   This file is part of Mountyzilla.                                          *
*                                                                              *
*   Mountyzilla is free software; you can redistribute it and/or modify        *
*   it under the terms of the GNU General Public License as published by       *
*   the Free Software Foundation; either version 2 of the License, or          *
*   (at your option) any later version.                                        *
*                                                                              *
*   Mountyzilla is distributed in the hope that it will be useful,             *
*   but WITHOUT ANY WARRANTY; without even the implied warranty of             *
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              *
*   GNU General Public License for more details.                               *
*                                                                              *
*   You should have received a copy of the GNU General Public License          *
*   along with Mountyzilla; if not, write to the Free Software                 *
*   Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA *
*******************************************************************************/

// x~x script_principal

// x~x md5.js
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

///////////////////////////////////////////
// debug cartes capitan Roule 07/12/2016
///////////////////////////////////
// essais : objet
//	.mode : description
//	.essais : tableau d'objets essai
//		.mode : description
//		.essais : tableau de cartes
//			.noCarte : id de la carte
//			.essais : tableau d'essais, [x, y, n, nb]
function AfficheEssais(essais, sMode) {
	var eBigDiv = document.getElementById('ListeEssaiCapitan');
	if (!eBigDiv) {
		var insertPoint = document.getElementById('footer1');
		if (!insertPoint) insertPoint = document.getElementById('footer');	// mode smartphone
		eBigDiv = document.createElement('table');
		eBigDiv.id = 'ListeEssaiCapitan';
		insertBefore(insertPoint, document.createElement('p'));
		insertTitle(insertPoint,'Capitan : Liste des essais');
		insertBefore(insertPoint, eBigDiv);
		addTrEssais(eBigDiv, 'mode', 'carte', 'nombre d\'essais', true);
	}
	if (!essais) {
		addTrEssais(eBigDiv, sMode, '', 'pas d\'essai', false);
		return;
	}
	var carte;
	for (carte in essais) {
		addTrEssais(eBigDiv, sMode, carte, essais[carte] + ' essai(s)', false);
	}
	if (carte === undefined) {
		addTrEssais(eBigDiv, sMode, '', '0 essai', false);
	}
}

function addTrEssais(eTable, sMode, sCarte, sText, bBold) {
	var tr = appendTr(eTable);
	var td = appendTd(tr);
	appendText(td, sMode, bBold);
	td = appendTd(tr);
	appendText(td, sCarte, bBold);
	td = appendTd(tr);
	appendText(td, sText, bBold);
}

function getEssaiV1_0() {
	try {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		prefs = prefs.getBranch("mountyzilla.storage.capitan.");
		var tabK, nK;
		prefs.getChildList('', nK, tabK);
		window.console.log('getEssaiV1_0, nb key : ' + nK);
		//window.console.log('getEssaiV1_0, ' + nK);
		return;
		//return r;
	} catch (e) {
		window.console.log(traceStack(e, 'getEssaiV1_0'));
	}
}

function getEssaiV1_1() {
	var locSto = window.localStorage;
	window.console.log('getEssaiV1_1, nb key : ' + locSto.length);
	var r = [];
	for (var i = 0; i < locSto.length; i++) {
		var k = locSto.key(i);
		//window.console.log('getEssaiV1_1 key ' + k + ' => ' + locSto.getItem(k));
		var t = k.split(/\./);
		if (t[0] !== 'capitan') continue;
		if (t[2] !== 'essai') continue;
		var carte = 'carte n°' + t[1];
		if (r[carte]) r[carte]++;
		else         r[carte] = 1;
		//window.console.log('getEssaiV1_1 r[' + carte + ']=' + r[carte]);
	}
	return r;
}

function showEssaiCartes() {
	window.console.log('début showEssai Tout_MZ');
	var essais = getEssaiV1_0();
	AfficheEssais(essais, 'V1.0');
	essais = getEssaiV1_1();
	AfficheEssais(essais, 'V1.1');
	window.console.log('fin showEssai Tout_MZ');
}

function testBoolLocalStorage() {
	var b = true;
	var key = 'MZ_essai_bool';
	GM_setValue(key, b);
	window.localStorage[key] = b;
	var v = GM_getValue(key);
	window.console.log('recup GM true => ' + v + ', ' + typeof v);
	var v = window.localStorage.getItem(key);
	window.console.log('recup localstorage true => ' + v + ', ' + typeof v);	// localStorage nous rend une chaine 'true' :(

	var b = false;
	GM_setValue(key, b);
	window.localStorage[key] = b;
	var v = GM_getValue(key);
	window.console.log('recup GM false => ' + v + ', ' + typeof v);
	var v = window.localStorage.getItem(key);
	window.console.log('recup localstorage false => ' + v + ', ' + typeof v);

	var x = window.localStorage.getItem('lkjlkjerziurlijzer');
	window.console.log('recup LocalStorage inconnu => ' + typeof(x));	// object null
	var y = GM_getValue('654654897894654654');
	window.console.log('recup GM inconnu => ' + typeof(y));	// undefined
	window.console.log('égalité ? => ' + (x == y));	// les deux sont "égaux" avec l'opérateur == (pas avec ===, bien sûr)
}

/*--------------------------------- Création liste trolligion ---------------------------------*/
function export_trolligion() {
	try {
		var tabDl = document.getElementsByTagName('dl');
		if ((!tabDl) || !tabDl[0]) {
			window.console.log('[MZ ' + GM_info.script.version + '] pas de dl');
			return;
		}
		var tabDieux = [];	// chaque élément est un objet avec les propriétés suivantes
			// nom : string
			// rayonnement : entier
			// grades : table d'objets (une occurence par grade)
				// nom : string
				// trolls : table d'objets (un par Trõll)
					// id
					// nom
					// idguilde
					// guilde
					// race
					// niveau
					// ferveur
		var currentDieu;
		var currentGrade;
		for (var iChild1 in tabDl[0].children) {
			var eChild1 = tabDl[0].children[iChild1];
			if (eChild1.tagName) switch (eChild1.tagName.toLowerCase()) {
				case 'dd':	// Trõll
					var oTroll = {};
					export_trolligion_analyse(oTroll, eChild1);
					currentGrade.trolls.push(oTroll);
					break;
				case 'dt':
					var tabH3 = eChild1.getElementsByTagName('h3');
					if (tabH3 && tabH3[0]) {	// changement de dieu
						currentDieu = {
							nom: tabH3[0].innerText || tabH3[0].textContent
							, grades: []};
						var txt = eChild1.innerText || eChild1.textContent;
						var m = txt.match(/yon*ement *:* *(\d+)/);
						if (m) currentDieu.rayonnement = parseInt(m[1]);
						currentGrade = undefined;
						tabDieux.push(currentDieu);
						break;
					}
					var tabH4 = eChild1.getElementsByTagName('h4');
					if (tabH4 && tabH4[0]) {	// changement de grade
						var grade;
						var txt = tabH4[0].innerText || tabH4[0].textContent;
						tabI = tabH4[0].getElementsByTagName('i');
						if (tabI && tabI[0]) {
							grade = tabI[0].innerText || tabI[0].textContent;
							grade = grade.replace(/"/g, '');
							m = txt.match(/\((.*)\)/);	// cas particulier Líhã dont les grades ont des catégories
							if (m) grade += ' (' + m[1] + ')';
						} else {
							grade = txt.replace(/"/g, '');
						}
						currentGrade = {nom: grade, trolls: []};
						currentDieu.grades.push(currentGrade);
						break;
					}
					window.console.log('[MZ ' + GM_info.script.version + '] ignore tag dt ' + eChild1.innerHTML);
					break;
				default:
					window.console.log('[MZ ' + GM_info.script.version + '] ignore tag ' + eChild1.tagName); //+ ' ' + eChild1);
			}
		}

		//window.console.log('[MZ ' + GM_info.script.version + '] nb dieux = ' + tabDieux.length);
		//window.console.log('[MZ ' + GM_info.script.version + '] ' + JSON.stringify(tabDieux));
		var txt = "Dieu\tRayonnement\tGrade\tidTroll\tTroll\tidGuilde\tGuilde\tRace\tNiveau\tFerveur\n";
		var txt2 = "Dieu\tRayonnement\n";	// Roule 25/01/2017 ajout d'un tableau résumé par religion
		for (var iDieu in tabDieux) {
			var oDieu = tabDieux[iDieu];
			for (var iGrade in oDieu.grades) {
				var oGrade = oDieu.grades[iGrade];
				for (var iTroll in oGrade.trolls) {
					var oTroll = oGrade.trolls[iTroll];
					var t = [oDieu.nom, oDieu.rayonnement
						, oGrade.nom
						, oTroll.id, oTroll.nom
						, oTroll.idguilde, oTroll.guilde
						, oTroll.race, oTroll.niveau
						, oTroll.ferveur];
					for (var iParam in t) {
						if (t[iParam] === undefined) t[iParam] = '';	// protection
						t[iParam] = t[iParam].toString().replace(/[\n\r\t]/g, ' ').trim();	// plus de protection
					}
					txt += t.join("\t") + "\n";
				}
			}
			var t = [oDieu.nom, oDieu.rayonnement];
			for (var iParam in t) {
				if (t[iParam] === undefined) t[iParam] = '';	// protection
				t[iParam] = t[iParam].toString().replace(/[\n\r\t]/g, ' ').trim();	// plus de protection
			}
			txt2 += t.join("\t") + "\n";
		}
		txt += "\n" + txt2;
	} catch (e) {
		window.alert("Échec à l'extraction\n" + e);
	}
	//window.console.log('[MZ ' + GM_info.script.version + '] txt =  ' + txt);
	try {
		if (copyTextToClipboard(txt)) {
			window.alert("[MZ] Les données ont été copiées dans le presse-papier\n"
				+ "Collez dans Calc\n"
				+ "ou, au pire, dans EXCEL®");
		} else {
			window.alert("[MZ] Echec à la copie vers le presse-papier\nVoir la console (F12)");
		}
	} catch(e) {
		window.alert("[MZ] Échec à la copie vers le presse-papier\n" + e);
	}
}

function export_trolligion_analyse(oTroll, eChild1) {
	for (var iChild2 in eChild1.childNodes) {	// childNodes pour obtenir les éléments texte aussi
		var eChild2 = eChild1.childNodes[iChild2];
		if (eChild2.nodeType === undefined) continue;	// properties
		//window.console.log('[MZ ' + GM_info.script.version + '] eChild2 ' + iChild2 + ' ' + eChild2.nodeName);
		switch (eChild2.nodeType) {
			case 1:	//ELEMENT_NODE:
				switch (eChild2.nodeName.toLowerCase()) {
					case 'a':
						var m;
						if (!eChild2.href) {
							window.console.log('[MZ ' + GM_info.script.version + '] a sans href ' + eChild2.outerHTML);
							break;
						}
						m = eChild2.href.match(/EnterPJView\((\d+) *,/);
						if (m) {
							oTroll.id = parseInt(m[1]);
							oTroll.nom = (eChild2.innerText || eChild2.textContent).trim();
							break;
						}
						m = eChild2.href.match(/EnterAllianceView\((\d+) *,/);
						if (m) {
							var idGuilde = parseInt(m[1]);
							if (idGuilde > 1) {	// MH donne 1 comme idGuilde quand le Trõll n'est pas guildé
								oTroll.idguilde = parseInt(m[1]);
								oTroll.guilde = (eChild2.innerText || eChild2.textContent).trim();
							}
							break;
						}
						window.console.log('[MZ ' + GM_info.script.version + '] a non traité ' + eChild2.outerHTML);
						break;
					case 'br':	// ignore
					case 'style':	// ignore
					case 'img':	// ignore
						break;
					case 'div':	// barre de vie
						if (eChild2.children[0]  && eChild2.children[0].tagName.toLowerCase() == 'div') {
							eChild3 = eChild2.children[0];
							if (eChild3.children[0] && eChild3.children[0].tagName.toLowerCase() == 'div') {
								var eChild4 = eChild3.children[0];
								if (eChild4.style && eChild4.style.width) oTroll.ferveur = eChild4.style.width;
								break;
							}
						}
						//window.console.log(eChild2.innerHTML);
						export_trolligion_analyse(oTroll, eChild2);
						break;
					default:
						window.console.log('[MZ ' + GM_info.script.version + '] ignore élément tag ' + eChild2.nodeName);
						break;
				}
				break;
			case 3:	//TEXT_NODE:
				var txt = eChild2.nodeValue.trim();
				if (txt === '') break;
				var m = txt.match(/(.*) *\((\d+)\)/);
				if (m) {
					oTroll.race = m[1].trim();
					oTroll.niveau = parseInt(m[2]);
				} else {
					oTroll.race = txt;
				}
				break;
			default:	// ne devrait pas arriver
				window.console.log('[MZ ' + GM_info.script.version + '] ignore élément type ' + eChild2.nodeType);
				break;
		}
	}
}

function do_trolligion() {
	var divpopup = document.createElement('div');
	divpopup.id = 'MZ_divCopier';
	divpopup.style.position = 'fixed';
	divpopup.style.top = '2px';
	divpopup.style.left = '2px;';
	divpopup.style.backgroundColor = 'rgba(255,255,255,0.5)';
	divpopup.style.cursor = 'pointer';
	divpopup.style.zIndex = 200;
	divpopup.title = '[MZ] Cliquer ici pour copier les données';
	divpopup.onclick = export_trolligion;
	var img = createAltImage(URL_MZimg + 'copy_32.png', 'Cliquer ici pour copier les données');
	divpopup.appendChild(img);
	document.body.appendChild(divpopup);
}

/*--------------------------------- Dispatch ---------------------------------*/

//chargerScriptDev("libs");
//chargerScriptDev("ALWAYS");	// ALWAYS contient des aides au test (GOD-MODE ;)
//if (isDEV) testBoolLocalStorage();
/* Roule, test getPVsRestants
	var pv = 'Inimaginables (supérieurs à 200)';
	var pvminmax = pv.match(/\d+/g);
	var oMinMaxPV = {min: pvminmax[0], max: pvminmax[1]};
	window.console.log('minmax=' + JSON.stringify(pvminmax) + ', oMinMaxPV=' + JSON.stringify(oMinMaxPV));
	window.console.log('ret getPVsRestants=' + JSON.stringify(getPVsRestants(pv, '±70%')));
	window.console.log('ret getPVsRestants=' + JSON.stringify(getPVsRestants(pv, '±70%', true)));
*/

	// Détection de la page à traiter
	if(isPage("Messagerie/ViewMessageBot")) {
		do_cdmbot();
	} else if(isPage("MH_Play/Actions/Competences/Play_a_Competence16b")) {
		do_cdmcomp();
	} else if(window.location.pathname.indexOf("/mountyhall/CdM.competence")>=0) {	// test Roule 20/03/2017
		do_cdmcomp();
	} else if(isPage('MH_Play/Actions/Competences/Play_a_CompetenceResult.php')) {	// ajout Roule 10/03/2017 (modif MH ?)
		do_cdmcomp();
	} else if(isPage("MH_Guildes/Guilde_o_AmiEnnemi")) {
		do_diplo();
	} else if(isPage("MH_Play/Play_equipement")) {
		do_equip();
	} else if(isPage("MH_Play/Play_menu")) {
		do_menu();
	} else if(isPage("MH_Play/Options/Play_o_Interface") || isPage("installPack")) {
		do_option();
		//showEssaiCartes();
	} else if(isPage("View/PJView_Events")) {
		/* SCIZ */
		do_scizOverwriteEvents();
	} else if(isPage("View/PJView")) {
		do_pjview();
	} else if(isPage("MH_Taniere/TanierePJ_o_Stock") || isPage("MH_Comptoirs/Comptoir_o_Stock")) {
		do_tancompo();
	} else if(isPage("MH_Play/Play_vue")) {
		do_vue();
		/* SCIZ */
		do_scizEnhanceView();
	} else if(isPage("MH_Play/Play_news")) {
		do_news();
	} else if(isPage("MH_Play/Play_evenement")) {
		/* SCIZ */
		do_scizOverwriteEvents();
	} else if(isPage("MH_Play/Actions/Play_a_Move")) {
		do_move();
	} else if(isPage("MH_Missions/Mission_Etape")) {
		do_mission();
	} else if(isPage("View/MonsterView")) {
		do_infomonstre();
		/* SCIZ */
		do_scizOverwriteEvents();
	} else if(isPage("MH_Play/Play_e_follo.php")) {
		do_listegowap();
	} else if(isPage("MH_Lieux/Lieu_Description.php")) {
		do_lieuDescription();
	} else if(isPage("MH_Lieux/Lieu_Teleport")) {
		do_lieuTeleport();
	} else if(isPage("MH_Follower/FO_Ordres")) {
		do_ordresgowap();
	} else if(isPage("MH_Follower/FO_Equipement")) {
		do_equipgowap();
	} else if(isPage("MH_Play/Play_mouche")) {
		do_mouches();
	} else if(isPage("MH_Play/Play_BM")) {
		do_malus();
	} else if(isPage("MH_Play/Play_evenement")) {
		do_myevent();
	} else if(isPage("MH_Lieux/Lieu_DemanderEnchantement")) {
		do_enchant();
	} else if(isPage("MH_Lieux/Lieu_Enchanteur")) {
		do_pre_enchant();
	} else if(isPage("MH_Play/Actions") || isPage("Messagerie/ViewMessageBot")) {
		do_actions();
	} else if(isPage('MH_Missions/Mission_Liste.php')) { // Roule 28/03/2016 je n'ai pas vu l'utilité et ça bloque... && MY_getValue(numTroll+'.MISSIONS')) {
		do_mission_liste();
	} else if(isPage('MH_Play/Play_action')) {
		do_actions();
	} else if(isPage("MH_Play/Play_profil") && !isPage('MH_Play/Play_profil2')) {
		do_profil2();
	} else if(isPage('MH_Play/Play_profil2')) {
		do_profil2();
	} else if(isPage('View/TrolligionView.php')) {
		do_trolligion();
	}
	if (document.body.dataset.MZ_Etat === undefined) {	// si l'état a été positionné par quelqu'un d'autre, laisser tel quel
		document.body.dataset.MZ_Etat = 1;	// indiquer aux scripts tiers qu'on a fini la première initialisation
	}
	if (document.body.MZ_Callback_init !== undefined) {
		for (var iCallback = 0;  iCallback < document.body.MZ_Callback_init.length; iCallback++) {
			document.body.MZ_Callback_init[iCallback]();
		}
	}
} catch(e) {
	try {
		window.console.log(traceStack(e, 'catch général page ' + window.location.pathname));
	} catch(e2) {
		window.console.log('catch général page ' + window.location.pathname + "\n" + e.message);
	}
}
