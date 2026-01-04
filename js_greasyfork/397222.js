// ==UserScript==
// @name         Thème ENT - Exia
// @namespace    Exia Tools
// @version      1.0
// @description  Change les couleurs de l'ENT par un thème inspiré de l'exia.
// @author       Aurélien KLEIN
// @match        https://ent.cesi.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397222/Th%C3%A8me%20ENT%20-%20Exia.user.js
// @updateURL https://update.greasyfork.org/scripts/397222/Th%C3%A8me%20ENT%20-%20Exia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.documentElement.style.setProperty('--gris1', 'rgb(116, 116, 116)');
    document.documentElement.style.setProperty('--gris2', 'rgb(140, 140, 140)');
    document.documentElement.style.setProperty('--gris3', 'rgb(170, 170, 170)');
    document.documentElement.style.setProperty('--gris4', 'rgb(200, 200, 200)');
    document.documentElement.style.setProperty('--rouge1', 'rgb(128, 0, 0)');
    document.documentElement.style.setProperty('--rouge2', 'rgb(192, 0, 0)');
    document.documentElement.style.setProperty('--rouge3', 'rgb(255, 0, 0)');
    document.documentElement.style.setProperty('--rouge4', 'rgb(255, 102, 102)');

    var style = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(style);
    var css = '';


    document.body.style.background = 'var(--rouge4)';
    document.querySelector('nav').style.background = 'var(--rouge4)';

    // Page principale
    // Badge messagerie
    css += '.hautDePage__compte__info .plier-deplier#acces-directs .plier-deplier__bouton .notification span.notification--inactif, .hautDePage__compte__info .plier-deplier.notification-mails .plier-deplier__bouton .notification span.notification--inactif, .hautDePage__compte__info .plier-deplier#notification .plier-deplier__bouton .notification span.notification--inactif {background: var(--rouge2)}';
    // Accès rapide -> boutons hover
    css += '.accueil .accueil__carte__info.widget li a:hover, .accueil .accueil__carte__info.widget li a:focus, .ficheaccueil .accueil__carte__info.widget li a:hover, .ficheaccueil .accueil__carte__info.widget li a:focus {background: var(--rouge2)}';
    // Badge notifications
    css += '.hautDePage__compte__info .plier-deplier#acces-directs .plier-deplier__bouton .notification span, .hautDePage__compte__info .plier-deplier.notification-mails .plier-deplier__bouton .notification span, .hautDePage__compte__info .plier-deplier#notification .plier-deplier__bouton .notification span {background: var(--rouge2)}';
    // Emploi du temps
    css += '.accueil .accueil__carte__info.paragraphe--2, .ficheaccueil .accueil__carte__info.paragraphe--2 {background: var(--rouge4)}';
    // Emploi du temps -> lien
    css += '.accueil .accueil__carte__info.paragraphe--2 .emploiDuTemps__lien, .ficheaccueil .accueil__carte__info.paragraphe--2 .emploiDuTemps__lien {background: var(--rouge4)}';
    // Fil d'activités -> icons
    css += 'ul.objets.notification li .vignette_deco .icon, ul.notification#liste_resultats li .vignette_deco .icon {color: var(--rouge2)}';
    // Accès directs -> items
    css += '.accueil .accueil__carte__info.widget li a, .ficheaccueil .accueil__carte__info.widget li a {background: var(--gris3)}';
    // Menu personnel -> item hover
    css += '.js #connexion .plier-deplier__contenu ul li a:hover, .js #connexion .plier-deplier__contenu ul li a:focus, .js #acces-directs .plier-deplier__contenu ul li a:hover, .js #acces-directs .plier-deplier__contenu ul li a:focus, .js #notification .plier-deplier__contenu ul li a:hover, .js #notification .plier-deplier__contenu ul li a:focus, .js .notification-mails .plier-deplier__contenu ul li a:hover, .js .notification-mails .plier-deplier__contenu ul li a:focus, .js #compte .plier-deplier__contenu ul li a:hover, .js #compte .plier-deplier__contenu ul li a:focus {color: var(--rouge3)}';
    // Evenement -> informations -> icons
    css += '.evenement div:before {color: var(--rouge3)}';


    // Trombinoscope
    // Compteur de personnes
    css += '.trombinoscope__information {background: var(--rouge4)}';
    // Profil > icon hover
    css += '.trombinoscope__carte__action ul li a:hover .icon, .trombinoscope__carte__action ul li a:focus .icon {color: var(--rouge2)}';


    // Général -> traits horizontaux
    css += 'h2:after, .h2:after, .no-js #connexion button.plier-deplier__bouton:after, .no-js #acces-directs button.plier-deplier__bouton:after, .no-js #versions button.plier-deplier__bouton:after {background: var(--rouge3)}';
    // Menu notifications -> links hover
    css += '.js #connexion .plier-deplier__contenu ul li .vignette_deco2 a:hover, .js #connexion .plier-deplier__contenu ul li .vignette_deco2 a:focus, .js #acces-directs .plier-deplier__contenu ul li .vignette_deco2 a:hover, .js #acces-directs .plier-deplier__contenu ul li .vignette_deco2 a:focus, .js #notification .plier-deplier__contenu ul li .vignette_deco2 a:hover, .js #notification .plier-deplier__contenu ul li .vignette_deco2 a:focus, .js .notification-mails .plier-deplier__contenu ul li .vignette_deco2 a:hover, .js .notification-mails .plier-deplier__contenu ul li .vignette_deco2 a:focus, .js #compte .plier-deplier__contenu ul li .vignette_deco2 a:hover, .js #compte .plier-deplier__contenu ul li .vignette_deco2 a:focus {color: var(--rouge3)}';
    // Changer de session
    css += '#body .ui-dialog .ui-widget-header, .choix_session__affichage {background: var(--rouge4)}';
    // Liens hover
    css += 'a:hover, .a:hover {color: var(--rouge2)}';
    // Liens menu
    css += '.sidebar-navigation .item .sidebar-lien {color: white}';
    // Selection de texte
    css += '::selection {background: var(--rouge4)}';
    // Menu -> icons
    css += '.sidebar-navigation .item.submenu .sidebar-modal:hover .icon, .sidebar-navigation .item.submenu .sidebar-modal:focus .icon, .sidebar-navigation .item.submenu .sidebar-plier-deplier.minus:before, .sidebar-navigation .item.submenu .sidebar-modal .icon, .sidebar-navigation .item.submenu .sidebar-plier-deplier.add:before {color: var(--rouge1)}';
    // Menu -> items on hover
    css += '.sidebar-navigation .item:hover {background: rgba(0, 0, 0, .2)}';
    // Menu -> item actif
    css += '.sidebar-navigation .item.active {background: rgba(0, 0, 0, .2)}';
    // Menu -> items links
    css += '.sous-item .item a {color: white}';
    // Menu -> items links hover
    css += '.sous-item .item a:hover {background: var(--rouge4)}';

    // Emploi du temps
    // Semaine
    css += '.fc-title-header {background: var(--rouge4)}';
    // Semaine hover
    css += '.fc-title-header:hover, .fc-title-header:focus {background: var(--rouge2)}';
    // Aujourd'hui
    css += '.fc-state-hover, .fc-state-down, .fc-state-active, .fc-state-disabled {background: var(--rouge4)}';
    // Date actuelle
    css += '.fc-today .fc-day-header-name, .fc-today .fc-day-header-date {color: var(--rouge3)}';
    // Evènement
    css += '.fc-event {border-color: var(--rouge2); background: var(--rouge4)}';
    // Evènement hover
    css += '.fc-event:hover, .fc-event:focus {background: var(--rouge2)}';



    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
})();