// ==UserScript==
// @name         SensCritique : Mode nuit
// @namespace    sc-night-mode
// @version      1.1
// @description  Customizable dark template for SensCritique. Colors come from the Discord dark skin.
// @author       Kazaam
// @match        https://www.senscritique.com/*
// @run-at       document-start
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @icon		 https://static.senscritique.com/img/favicon/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/33523/SensCritique%20%3A%20Mode%20nuit.user.js
// @updateURL https://update.greasyfork.org/scripts/33523/SensCritique%20%3A%20Mode%20nuit.meta.js
// ==/UserScript==

// https://github.com/sizzlemctwizzle/GM_config/wiki

$(function() {

  $('.header-user-infos-options-link:contains("Paramètres")').parent().after(`
  <li class="header-user-infos-options-item sc-night-mode-settings">
    <a href="#" class="header-user-infos-options-link">Mode nuit</a>
  </li>`);

  $('.sc-night-mode-settings').click(function() {
    GM_config.open();
  });

});

GM_config.init({
  id: "sc-night-mode",
  fields: {
  green: {
    label: "Général : vert",
    section: 'Couleurs générales',
    type: "text",
    default: "#43B581",
    size: "7"
  },
  red: {
    label: "Général : rouge",
    type: "text",
    default: "#F04747",
    size: "7"
  },
  light_grey: {
    label: "Général : gris clair",
    type: "text",
    default: "#484B51",
    size: "7"
  },
  dark_grey: {
    label: "Général : gris foncé",
    type: "text",
    default: "#282B30",
    size: "7"
  },
  white: {
    label: "Général : blanc",
    type: "text",
    default: "#FFFFFF",
    size: "7"
  },
  text_color: {
    label: "Couleur générale du texte",
    type: "text",
    default: "#dcdcdc",
    size: "7"
  },
  link_color: {
    label: "Couleur des liens",
    type: "text",
    default: "#0D93CF",
    size: "7"
  },
  header_bgc: {
    label: "Couleur de fond du header",
    type: "text",
    default: "#2F3136",
    size: "7"
  },
  footer_bgc: {
    label: "Couleur de fond du footer",
    type: "text",
    default: "#2F3136",
    size: "7"
  },
  wrapper_bgc: {
    label: "Couleur de fond des pages",
    type: "text",
    default: "#36393E",
    size: "7"
  },
  featured: {
    label: "Couleur de éléments mis en valeur (commentaires, recommandations, listes...)",
    type: "text",
    default: "#2F3136",
    size: "7"
  },
  advanced_fixes: {
    label: "Activer les modification avancées du thème de base (recommandé)",
    section: 'Autres couleurs',
    type: "checkbox",
    default: true
  }
  }
});

// Récupération de la configuration
const advanced_fixes = GM_config.get('advanced_fixes');

// Récupération des couleurs
const green      = GM_config.get('green');
const red        = GM_config.get('red');
const white      = GM_config.get('white');
const header     = GM_config.get('header_bgc');
const footer     = GM_config.get('footer_bgc');
const wrapper    = GM_config.get('wrapper_bgc');
const text       = GM_config.get('text_color');
const light_grey = GM_config.get('light_grey');
const dark_grey  = GM_config.get('dark_grey');
const featured   = GM_config.get('featured');
const link       = GM_config.get('link_color');

/**
* Application des couleurs
**/

// Header
GM_addStyle(`header.header { background-color: ${header} ; color: ${text} ; margin-left: -1px ; box-shadow: 0px 0px 6px 0px black; }`);
GM_addStyle(`.header-navigation-universe-others { background-color: ${dark_grey} ; box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6) ; border: ${dark_grey} ; }`);
GM_addStyle(`.header-user-ratings-add { background-color: ${green} ; }`);
GM_addStyle(`.header-navigation-main-item a:hover { color: ${green} ; }`);
GM_addStyle(`.header-navigation-universe-current { background-color: ${green} ;`);

// Recherche
GM_addStyle(`.header-input, ._21m6Rw6g7EXxTEFyhikpLe { background-color: ${light_grey} ; }`);
GM_addStyle(`.header-input input::-webkit-input-placeholder { color: ${text} ; }`);
GM_addStyle(`.header-input input[type=search]  { color: ${text} ; }`);
GM_addStyle(`._2e29TQbCoUs7b3T3S0OwYE::after, ._2e29TQbCoUs7b3T3S0OwYE::before { background-color: ${text} ; }`);
GM_addStyle(`._1pDGS5WNnRtxCcfwOU55mo { background-color: ${light_grey} ; }`);
GM_addStyle(`._1pDGS5WNnRtxCcfwOU55mo:hover, ._1dmZRvKwL2UKWAuiowtD73:hover { background-color: ${green} ; }`);
GM_addStyle(`._1dmZRvKwL2UKWAuiowtD73 { background-color: ${light_grey} ; color: ${text} ; }`);

// Utilisateur
GM_addStyle(`.header-user-name { color: ${text} ; }`);
GM_addStyle(`.header-user-ratings-number { color: ${text} ; }`);
GM_addStyle(`.header-user-ratings { background-color: ${light_grey} ; }`);
GM_addStyle(`.header-user-infos-options { background-color: ${dark_grey} ; border-color: ${dark_grey} ; color: ${text} ; box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6) ; }`);
GM_addStyle(`.header-user-infos-options-item:hover { color: ${green} ; text-decoration: none ; }`);
GM_addStyle(`.header-user-notifications.hasNotifications::after { background-color: ${red} ; }`);
GM_addStyle(`.eins-compass { filter: invert(100%) ; }`);
GM_addStyle(`.ecap-resultsLabel-label { color: ${text}; background: none ; border-bottom: 1px solid ${dark_grey} ;}`);
GM_addStyle(``);
GM_addStyle(``);

GM_addStyle(`.shadow-triangle:after { background-color: ${dark_grey} ; box-shadow: none ; }`);
GM_addStyle(`.header-user-message-notification, .hasMessages .header-user-infos-options-item:first-child::after { background-color: ${red} ; }`);
GM_addStyle(`.header-user-infos-options-item:nth-child(1), .header-user-infos-options-item:nth-child(5), .header-user-infos-options-item:nth-child(8) { border-bottom: 1px solid ${light_grey} ; }`);

// Wrapper (page)
GM_addStyle(`.wrap { background-color: ${wrapper} ; color: ${text} ; }`);
GM_addStyle(`body { background-color: ${dark_grey} ; }`);

// Livefeed
GM_addStyle(`.hoin-feed-filters, .laho-nav, .elfs-story, .hoin-feed-filter:not(.d-filter3) { border-color: ${dark_grey} ; }`);
GM_addStyle(`.elfs-story-actor { color: ${text} ; }`);
GM_addStyle(`.elfs-story-actor:hover { color: ${white} ; }`);
GM_addStyle(`.hoin-feed-filter.active { color: ${text} ; }`);
GM_addStyle(`.laho-navUser-info a { color: ${text} ; }`);
GM_addStyle(`.elfa-attachment, .eshv-shout-box { color: ${text} ; background-color: ${featured} ; }`);
GM_addStyle(`.elfa-attachment-title { color: ${text} ; }`);
GM_addStyle(`.elfa-attachment-title:hover { color: ${text} ; }`);
GM_addStyle(`.elfa-attachment .elfa-attachment-agenda-product { background-color: ${light_grey} ; color: ${text} ; }`);
GM_addStyle(`.eshv-shout-box:hover { background-color: ${light_grey} ; }`);
GM_addStyle(`.elfa-attachment-button { box-shadow: 0 0 8px rgba(255, 255, 255, 0.3) ; }`);
GM_addStyle(`.elag-item.type-1, .elag-item.type-2, .elag-item.type-3, .elag-item.type-4, .elag-item.type-5, .elag-item.type-6 { border-color: ${green} ; }`);
GM_addStyle(`.elfa-attachment-agenda-product a { color: ${text} ; }`);
GM_addStyle(`.elfa-attachment-agenda-product a:hover { color: ${text} ; }`);
GM_addStyle(`.ecap-resultsLabel-label a { color: ${text}; text-decoration: none; }`);
GM_addStyle(`.elpt-product-title { color: ${text} ; }`);
GM_addStyle(`.elpt-product-title:hover { color: ${green} ; }`);
GM_addStyle(``);
GM_addStyle(``);

// Commentaires
GM_addStyle(`.etco-comment { background-color: ${featured} ; border-bottom: 1px solid ${dark_grey} ;}`);
GM_addStyle(`.etco-comment-actor a { color: ${text} ; }`);
GM_addStyle(`.etco-comment-actor a:hover { color: ${white} ; }`);
GM_addStyle(`.etco-component { border: none ; }`);
GM_addStyle(`.etco-component::after { border-bottom: 10px solid ${featured} ; }`);
GM_addStyle(`.etco-component-addtext { background-color: ${light_grey} ; border-color: ${dark_grey} ; color: ${text} ; }`);
GM_addStyle(`.etco-component-addtext::-webkit-input-placeholder { color: ${text} ; }`);
GM_addStyle(`.elfs-footer-action, .elfs-story-more { color: ${white} ; }`);
GM_addStyle(`.elfs-footer-action:hover, .elfs-story-more:hover { color: ${green} ; text-decoration: none ; }`);
GM_addStyle(`.etco-comment-options:hover { background-color: ${light_grey} ; }`);
GM_addStyle(`input.etco-comment-submit { background-color: ${green} ; color: ${text} ; border: none; }`);

// Liens
GM_addStyle(`a { color: ${link} ; }`);
GM_addStyle(`a:hover { color: ${link} ; }`);

// Filtres Livefeed
GM_addStyle(`.laho-nav-navFilter:not(.active):not(.disabled):hover { background-color: ${light_grey} ; color: ${text} ; }`);
GM_addStyle(`.laho-nav-navFilter { border: none ; }`);
GM_addStyle(`.laho-nav-navFilter::after { border-left: 18px solid ${light_grey} !important; }`);
GM_addStyle(`.laho-nav-navFilter.active { background-color: ${light_grey} ; box-shadow: none ; color: ${text} ; }`);
GM_addStyle(`input.laho-nav-searchField { background-image: none ; background-color: ${light_grey} ; color: ${text} ; }`);

GM_addStyle(`input.laho-nav-searchField::-webkit-input-placeholder  { color: ${text} ; }`);
GM_addStyle(`.d-filter3:hover { background-color: ${dark_grey} ; color: ${text} ; }`);
GM_addStyle(`.d-button-menu-item { background-color: ${dark_grey} ; color: ${text} ; }`);
GM_addStyle(`.d-button-menu-item:hover { background-color: ${dark_grey} ; }`);
GM_addStyle(`.d-button-menu-action { color: ${text} ; border-color: ${light_grey} ; }`);
GM_addStyle(`.d-button-menu-item, .d-button-menu-item:first-child, .d-button-menu { border-color: ${light_grey} ; }`);

// Footer
GM_addStyle(`.lafo-footer { background: initial ; background-color: ${dark_grey} ; }`);
GM_addStyle(`.lafo-footer-anchor, .lafo-resume-item { color: ${text} ; }`);
GM_addStyle(`.lafo-copyright { color: ${text} ; }`);
GM_addStyle(`.lafo-footer small { color: ${light_grey} !important; }`);

// Fiches oeuvres
GM_addStyle(`.d-menu { background-color: ${dark_grey} ; }`);
GM_addStyle(`.d-menu-item.active { background-color: ${wrapper} ; color: ${text} ;}`);
GM_addStyle(`.d-menu-item:hover { background-color: ${wrapper} ; }`);
GM_addStyle(`.pvi-productDetails-item .d-link-alt { color: ${text} ; }`);
GM_addStyle(`.pvi-productDetails-resume .d-link { color: ${link} ; }`);
GM_addStyle(`.pvi-season-item .d-link-alt { color: ${link} ; }`);
GM_addStyle(`.pvi-season-item { border-color: ${light_grey} ; }`);
GM_addStyle(`.d-border-top, .ere-versus-review+.ere-versus-review { border-color: ${dark_grey} ; }`);
GM_addStyle(`.ere-versus { background-color: ${light_grey} ; }`);
GM_addStyle(`.d-rubric-highlighted { background-color: ${dark_grey} ; border: none ; }`);
GM_addStyle(`.eas-rubric-title, .elmv-miniview-title2 { color: ${text} ; }`);
GM_addStyle(`.eas-rubric-title:hover, .elmv-miniview-title2:hover { color: ${green} ; }`);
GM_addStyle(`.eas-rubric-title { border-color: ${light_grey} ; }`);
GM_addStyle(`.eshv-shout-box.shoutWithUser::before, .eshv-shout-box.shoutWithUser::after { border-top: 22px solid ${featured} ; }`);
GM_addStyle(`.eshv-shout-box.shoutWithUser:hover::before, .eshv-shout-box.shoutWithUser:hover::after { border-top-color: ${light_grey} ; }`);

// Notes éclaireurs
GM_addStyle(`.csa-scouts, .csa-scouts-inactive { background-color: ${dark_grey} ; }`);
GM_addStyle(`.d-rubric-border, .csa-scouts-activity { border-color: ${wrapper} ; }`);
GM_addStyle(`.csa-activity-username { color: ${text} ; }`);
GM_addStyle(`.elrg-graph.scout .elrg-graph-data { background-color: ${green} ; }`);
GM_addStyle(`.csa-scouts-ratings, .elrua-useraction-action.scout { color: ${green} ; }`);
GM_addStyle(`.elrua-useraction-action { background-color: ${wrapper} ; border-bottom: none ; }`);
GM_addStyle(`.csa-scouts-more { color: ${green} ; }`);
GM_addStyle(`.csa-scouts-more:hover { color: ${text} ; }`);
GM_addStyle(`.eins-wish-list.green, .eins-wish.green { filter: invert(20%); }`);

// Posts
GM_addStyle(`.pvi-emptyTopic { border-color: ${light_grey} ; background: none ; background-color: ${dark_grey} ; }`);
GM_addStyle(`.efto-topic.highlight { background-color: ${dark_grey} ; border: none ; }`);
GM_addStyle(`.efto-topic-title { color: ${text} ; }`);
GM_addStyle(`.efsc-score { background-color: ${light_grey} ;  border: none ;}`);
GM_addStyle(`.efsc-score-count { color: ${text} ; }`);

// Sondages
GM_addStyle(`.pvi-poll a { color: ${text} !important; }`);
GM_addStyle(`.pvi-poll-rank { background-color: ${green} !important ; }`);
GM_addStyle(`.eas-item-content .d-link-alt { color: ${text} ; }`);

// Détails
GM_addStyle(`.pde-data tr:nth-child(odd) { background-color: ${light_grey} ; }`);

// Critiques
GM_addStyle(`.ere-review { background-color: ${wrapper} ; border-color: ${dark_grey} ; }`);
GM_addStyle(`.ere-review-excerpt { color: ${text} ; }`);
GM_addStyle(`.ere-review-excerpt, .ere-review-heading { color: ${text} ; }`);
GM_addStyle(`.elrua-useraction-action { background-color: ${light_grey} ; color: ${text} ; }`);
GM_addStyle(`.eins-user-recommend { filter: invert(100%) }`);

// Séries - saisons
GM_addStyle(`.pse-season-item.active { background-color: ${light_grey} ; color: ${text} ; }`);
GM_addStyle(`.pse-season-item { background-color: ${dark_grey} ; color: ${text} ; }`);
GM_addStyle(`.pse-season-item a:hover { color: ${text} !important ; }`);
GM_addStyle(`.pse-season::after { border-top: 20px solid ${dark_grey}; }`);
GM_addStyle(`.pse-season { background-color: ${dark_grey} ; color: ${text} ; }`);
GM_addStyle(`.pse-episode:nth-child(even) { background-color: ${dark_grey} ; }`);
GM_addStyle(`.pse-episode:nth-child(even) .pse-episode-number { background-color: ${light_grey} ; }`);
GM_addStyle(`.pse-episode-number { background-color: ${dark_grey} ; color: ${text} ; }`);
GM_addStyle(`.d-link-alt:hover, .d-link-reverse:hover { color: ${green} ; text-decoration: none ; }`);
GM_addStyle(`.pse-episode .pse-actions { border-color: ${dark_grey} ; }`);
GM_addStyle(`.pse-episode .pse-action-done { border-color: ${dark_grey} ; }`);
GM_addStyle(`.pse-action-done { background-color: ${light_grey} ; }`);

// Page des résultats
GM_addStyle(`.elco-anchor { color: ${text} ; }`);
GM_addStyle(`.elco-anchor:hover { color: ${green} ; }`);
GM_addStyle(`.sin-heading { border-color: ${dark_grey} ; }`);
GM_addStyle(`.d-covertab-filter.active { color: ${text} ; background-color: ${wrapper}; }`);
GM_addStyle(`.d-covertab-filter.active:hover { color: ${text} ; }`);
GM_addStyle(`.esfr-anchor, .esli-anchor { color: ${text} ; }`);
GM_addStyle(`.esfr-anchor:hover, .esli-anchor:hover { color: ${text} ; }`);

// Liste des contacts
GM_addStyle(`.ecvi-title { color: ${text}; }`);
GM_addStyle(`.ecvi-title:hover { color: ${text}; }`);
GM_addStyle(`.ecli-item, .esco-item { border-color: ${dark_grey}; }`);

// Tracklists
GM_addStyle(`.elt-tracks-item:nth-child(odd) { background-color: ${light_grey} ; }`);
GM_addStyle(`.elt-tracks-item .d-link-alt { color: ${text} ; }`);
GM_addStyle(`.elt-tracks-item .d-link-alt:hover { color: ${green} ; }`);

// Listes
GM_addStyle(`.d-rubric-description { background-color: ${dark_grey} ; color: ${text}; }`);


GM_addStyle(`.elpo-other-polls .d-link-alt { color: ${text} ; }`);
GM_addStyle(`.elpo-other-polls .d-link-alt:hover { color: ${green} ; }`);
GM_addStyle(`.elpo-item { border-color: ${dark_grey} ; }`);
GM_addStyle(`.elpo-rank { background-color: ${wrapper} ; border-color: ${light_grey} ; }`);



GM_addStyle(`.elth-thumbnail-heading  { color: ${text} ; }`);
GM_addStyle(`.elth-thumbnail { border: 1px solid ${light_grey} ; }`);
GM_addStyle(``);
GM_addStyle(``);
GM_addStyle(``);
GM_addStyle(``);
GM_addStyle(``);
GM_addStyle(``);
GM_addStyle(``);


// Application de la configuration avancée
if(advanced_fixes) {
  // Header
  GM_addStyle(`header.header { margin-left: -1px ; box-shadow: 0px 0px 6px 0px black; }`);
  GM_addStyle(`.header::before { background-color: #101010 }`);
  GM_addStyle(`.header-input svg, .eins-search-header { -webkit-filter: invert(100%); filter: invert(100%); }`);
  // Recherche
  GM_addStyle(`._1pDGS5WNnRtxCcfwOU55mo { border-radius: 0 ; border-bottom: 1px solid ${dark_grey} ; }`);
  GM_addStyle(`._1pDGS5WNnRtxCcfwOU55mo:last-child { border-bottom: 0 ; }`);
  GM_addStyle(`._1pDGS5WNnRtxCcfwOU55mo:not(:last-child) { margin-bottom: 0 ; }`);
  GM_addStyle(`.header-input input:focus::-webkit-input-placeholder { color: ${dark_grey} ; }`);
  // Icônes RS
  GM_addStyle(`.header-logo-small { -webkit-filter: invert(100%); filter: invert(100%); }`);
  GM_addStyle(`.header-social-item { -webkit-filter: invert(100%); filter: invert(100%); }`);
  GM_addStyle(`.header-social-item:hover { -webkit-filter: invert(0%); filter: invert(0%); }`);
  // Filtres du live
  GM_addStyle(`.eins-friends-small, .eins-feed-small, .laho-nav-searchIco { -webkit-filter: invert(100%); filter: invert(100%); }`);
  GM_addStyle(`input.laho-nav-searchField { border-radius: 0px ; }`);
  // Actions des objets du live
  GM_addStyle('.elfs-story-footer, .elfs-story-more { font-family: Arial, "Helvetica Neue", Helvetica, sans-serif ; font-size: 12px;');
  // Commentaires du feed
  GM_addStyle(`input.etco-comment-submit { padding: 10px 15px; }`);
  GM_addStyle(`input.etco-comment-submit:hover { background-color: #54585f ; }`);
  // Elements des formulaires
  GM_addStyle(`input:not(.unfocus):focus, textarea:not(.unfocus):focus { box-shadow: 0 0 8px rgba(255, 255, 255, 0.3) ; }`);
  GM_addStyle(`input:focus, textarea:focus { border-color: #737373 ; }`);
  // Shoutbox
  GM_addStyle(`.eshv-shout-box { border: none ; }`);
  // Footer
  GM_addStyle(`.lafo-footer { border-top: 1px solid #101010 ; box-shadow: 0px 0px 6px 0px black ; }`);
  GM_addStyle(`.lafo-footer a:hover { color: ${green} ; text-decoration: none; }`);
  // Oeuvres des homes
  GM_addStyle(`.ecbi-billboard-popularItem { box-shadow: 0px 6px 20px -5px black; } `);
  // Page des saisons
  GM_addStyle(`.pse-season-item { border-radius: 0px ; }`);
  // Liste des contacts et produits
  GM_addStyle(`.ecli-item, .esco-item { border-bottom: none; }`);
  // Tracklists
  GM_addStyle(`.elt-tracks-item { border: none; }`);
  GM_addStyle(`.elt-tracks-item:hover { border: none; }`);
  GM_addStyle(`.elt-tracks-item:not(:hover) td { box-shadow: none; }`);
  // Listes
  GM_addStyle(`.epba-badge { box-shadow: 0 0 10px 6px rgba(0, 0, 0, 0.25); }`);
}