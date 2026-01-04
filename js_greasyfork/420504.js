// ==UserScript==
// @name Stylish DC Edwige - 20/01/2021.
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Le Style pour la belleu Bibu ♥
// @author Z'
// @grant GM_addStyle
// @run-at document-start
// @match https://www.dreadcast.net/Main
// @downloadURL https://update.greasyfork.org/scripts/420504/Stylish%20DC%20Edwige%20-%2020012021.user.js
// @updateURL https://update.greasyfork.org/scripts/420504/Stylish%20DC%20Edwige%20-%2020012021.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insérer le code ici... */
#db_buy_promotion .inventaire_content .zone_case7 {
    left: 70px !important;
    top: 3px !important;
}
#db_buy_promotion .inventaire_content .zone_case8 {
    left: 70px !important;
    top: 73px !important;
}
#db_buy_promotion .inventaire_content .zone_case9 {
    left: 70px !important;
    top: 143px !important;
}

#fondVille1,
#fondVille2,
#fondVille3,
#fondVille4,
#fondMaison1,
#fondMaison2,
#fondMaison3,
#fondImmeuble1,
#fondImmeuble2,
#fondImmeuble3,
#fondMort,
#fondOI,
#fondEntreprise,
#fondVide,
#fondSouterrain,
#fondcercle {
    background-image: url('https://imgur.com/1dbcEz4.gif') !important;
}

/* Bandeau */
#ingame #bandeau {
    overflow: visible;
    z-index: 300009;
    font-size: 1rem;
    color: #005437;
    box-shadow: 0 1px 5px #005437;
    display: inline-grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
}
.linka,
a {
    text-decoration: none;
    color: #005437;
}

/* Taille police stats */
#statistiques {
    font-family: True Lies;
    font-size: 6px;
}
#zone_fiche #statistiques li.max {
    color: #cdf5eb;
}
#zone_fiche #statistiques ul > li {
    width: 12%;
    float: left;
    color: #cdf5eb;
    text-align: center;
    cursor: default;
    height: 100%;
    position: initial;
    transition: all .2s ease-in-out;
}
#zone_fiche #txt_pseudo {
    grid-area: pseudo;
    font-family: True Lies;
    color: #005437;
    overflow: hidden;
    
}
#zone_fiche #txt_titre {
    grid-area: titre;
    color: #cdf5eb;
    font-size: min(.85rem, 12px);
    font-variant: small-caps;
    text-transform: none;
    overflow: hidden;
}
#zone_fiche #txt_niveau {
    grid-area: niveau;
    font-size: min(1.4rem, 16px);
    color: #cdf5eb;
}
#zone_fiche #txt_faim,
#zone_fiche #txt_soif {
    z-index: 2;
    color: #cdf5eb;
    font-variant: small-caps;
    text-align: left;
    margin: 0 2%;
    height: auto;
    box-sizing: border-box;
}
#zone_fiche #zone_classement {
    z-index: 1;
    position: absolute;
    top: -3px;
    left: 0;
    font-size: .8rem;
    color: #cdf5eb;
    width: 60px;
    text-align: center;
}
#zone_fiche #action_actuelle {
    text-transform: none;
    font-size: 1rem;
    color: #cdf5eb;
    cursor: default;
    width: 100;
    padding: 0 0 0 8%;
    box-sizing: border-box;
}
/* Menu de gauche */
#zone_fiche #img_avatar img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
#zone_fiche .barre_inv {
    border: 1px solid #ae2eff00;
}
#zone_fiche #barre_forme .barre_etat {
    background-color: #005437 !important;
}
#zone_fiche #barre_sante .barre_etat {
    background-color: #005437;
}
#zone_fiche #barre_experience .barre_etat {
    background-color: #005437 !important;
}
#zone_fiche #barre_forme:hover .barre_border {
    background: none;
}
#zone_fiche .barre_border .fa-caret-right {
    background: rgba(47, 46, 46, .69);
}
#zone_fiche .barre_inv {
    width: 100%;
    height: 100%;
    padding: 0;
    display: block;
    background: rgba(187, 255, 252, .69);
    border: 1px solid #005437;
    border-radius: 2px;
    overflow: hidden;
}

#zone_fiche #txt_credits em {
    font-style: normal;
    color: #fd9c0000;
}
#zone_fiche #txt_credits {
    color: #cdf5eb;
}
.stat_icone_cr {
    width: 13px;
    height: 13px;
    background: url(https://imgur.com/maOpEe8.png) 0 -156px no-repeat;
}

#zone_gauche_inventaire {
    background: none 0 0 no-repeat;
}
#zone_fiche #stop_action {
    z-index: 10;
    position: absolute;
    top: -50%;
    right: 10%;
    width: 11px;
    height: 11px;
    background: url(https://imgur.com/20FgDFP.png) 0 0 no-repeat;
}
#zone_gauche {
    width: 100%;
    background-image: url(https://imgur.com/i14Zoqj.png) !important;
    background-size: 105%;
}

#zone_fiche .barre_border {
    width: 100%;
    height: 75%;
    border: 2px solid rgba(127, 31, 204, 0);
    border-radius: 4px 0 0 4px;
    transition: all .25s ease;
}

#zone_logement,
#zone_travail {
    position: relative;
    z-index: 5;
    margin: 0;
    color: #005437;
    box-sizing: border-box;
    height: 100%;
    padding: 2px;
}

.grid_head_travail_logement .btn.link.infoAide {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    align-items: center;
    justify-content: center;
    background: rgba(47, 46, 46, .69);
    color: #005437;
    box-sizing: border-box;
    border: 1px solid;
}

#zone_travail p {
    color: #005437;
    line-height: 1.2rem;
    clear: both;
    padding: 6px 0;
}
#zone_travail .icon {
    width: 40px;
    height: 40px;
    background: url(https://imgur.com/EAhn5pi.png) 0 0 no-repeat;
    background-size: contain;
    margin: 2.5px 0;
}
#mon_budget .icon,
#mon_tempsTravail .icon {
    width: 14px;
    height: 14px;
    background: url(https://imgur.com/XtS3i9o.png) 0 0 no-repeat;
}

#zone_quete {
    position: absolute;
    bottom: -13%;
    left: 2%;
    width: 100%;
    height: 18%;
    background-size: contain;
    color: #7c7b7b8a;
    padding: 12% 0 0 49%;
    line-height: 1.4rem;
    box-sizing: border-box;
}

.fakeToolTip {
    z-index: 3000;
    display: none;
    cursor: default;
    position: absolute;
    background: rgba(4, 4, 4, .85);
    color: #005437;
    font-weight: 400;
    border: 1px solid #cdf5eb;
    padding: 6px 15px;
    line-height: 14px;
    font-size: 1rem;
}

/* Mettre ici l'url de l'image du menu de messagerie et carnet */
#zone_droite > .grid > .grid.top {
    background: rgba(227, 8, 8, 0);
}

/* Fond conteneurs */
.zone_conteneurs_displayed .conteneur .conteneur_content,
#infoBox,
.infoBoxFixed,
#interface_achat.colorize {
    background-color: rgb(47, 46, 46);
}
.dataBox .content {
    background-color: rgb(47, 46, 46);
}
.case_objet.linkBox::before,
.case_objet.linkBox::after {
    background-image: url(https://imgur.com/bnTunQ1.png) !important;
}

/* Menu de droite */
#zone_droite {
    background-image: url(https://imgur.com/8pfbGWM.png) !important;
    background-size: 105%;
}
#zone_carnet,
#zone_messagerie {
    padding: 15% 8% 5% 15%;
    margin: 0;
    color: #cdf5eb;
    display: grid;
    grid-row-gap: 10%;
    grid-column-gap: 5%;
    grid-template-columns: 1fr;
    grid-template-rows: 35% 20% 20%;
}
#zone_carnet .btnTxt,
#zone_carnet .infoAide,
#zone_messagerie .btnTxt {
    background: #040404;
    color: #005437;
    font-size: min(1rem, 13px);
}
.btnTxt {
    font-weight: 700;
    text-align: center;
    margin: 6px 0;
    cursor: pointer;
    background: #000;
    border: 1px solid #cdf5eb;
    color: #cdf5eb;
    padding: 2px 4px;
    box-shadow: 0 0 4px 1px #8c0eff00;
    -moz-box-shadow: 0 0 4px 1px #cdf5eb;
    -webkit-box-shadow: 0 0 4px 1px #cdf5eb;
}
#zone_carnet .infoAide {
    width: 100%;
    height: 100%;
    padding: 0;
    color: #005437;
    text-align: center;
    display: grid;
    align-items: center;
    align-content: center;
    justify-content: center;
    border: 1px solid #cdf5eb;
    box-sizing: border-box;
    box-shadow: 0 0 5px #cdf5eb;
}
/* Fond Chat */
#zone_chat_bg {
    background: transparent;
    box-shadow: 0 0 15px -5px inset rgba(255, 5, 5, 0);
}

.hologram img {
    width: 0%;
}
#zone_chat .icon {
    display: inline-block;
    width: 10%;
    height: 28px;
    background: url(https://imgur.com/XtS3i9o.png) -184px 0 no-repeat;
    vertical-align: middle;
}
#zone_chat {
    position: relative;
    width: 100%;
    height: 100%;
    color: #005437;
    grid-column: 1;
    padding: 0 4%;
    box-sizing: border-box;
}
#action_list,
#adresse_action_list,
#adresse_folder_list,
#contact_action_list,
#contact_folder_list,
#folder_list {
    display: none;
    position: absolute;
    top: 19px;
    right: -1px;
    width: 930%;
    padding: 4px 6%;
    background-color: rgba(0, 0, 0, .99);
    font-size: 10px;
    line-height: 12px;
    color: #005437;
    font-weight: 400;
    border: 1px solid #cdf5eb;
    border-top: none;
    -moz-box-shadow: 1px 3px 4px 0 #ebec4a;
    -webkit-box-shadow: 1px 3px 4px 0 #cdf5eb;
}
#zone_chat #bouton_chat_droite,
#zone_chat #bouton_chat_gauche {
    display: none;
    z-index: 100;
    position: absolute;
    top: 10px;
    width: 15px;
    height: 22px;
    background: #cdf5eb;
}
#zone_chat #onglets_chat li.selected {
    color: #005437;
    background: #fff0;
}
#zone_chat #onglets_chat {
    width: 87%;
    font-size: inherit;
    overflow: hidden;
    margin: 0 auto;
    border-bottom: 1px solid #cdf5eb;
    display: inline-block;
    vertical-align: middle;
}
#zone_chat .connectes {
    color: #cdf5eb;
    border-bottom: 1px solid #cdf5eb;
    margin: 3px 10px 5px;
    overflow: hidden;
    padding-bottom: 5px;
    max-height: 3rem;
}
#chat_preview .chatContent,
#zone_chat .zone_infos {
    color: #005437;
    text-transform: none;
    font-size: 1rem;
    line-height: 1.2rem;
}
#chatForm {
    position: relative;
    bottom: 5px;
    left: 5%;
    width: 90%;
    padding-left: 5px;
    border: 1px solid #cdf5eb;
    height: 2rem;
}
#element.style {
    border-color: #cdf5eb;
    box-shadow: none;
}
#chatForm .text_chat {
    border: none;
    background: 0 0;
    color: #cdf5eb;
    width: 80%;
    padding: 3px;
    box-sizing: border-box;
    font-size: 1rem;
}
#chatForm .text_valider {
    background: #000;
    color: #cdf5eb;
    width: 10%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    border: 1px solid #cdf5eb;
    border-width: 0 0 0 1px;
    display: grid;
}

#chatForm .text_mode {
    border-left: 1px solid #cdf5eb;
    color: #cdf5eb;
    width: 9%;
    margin-top: 1px;
}

/* Mise en forme Accomplissements */
#zone_quete {
    background-image: url('https://imgur.com/67BbHpS.png') !important;
    left: 0px !important;
    top: 300px !important;
}

/* Fond des cases meuble */
.meuble_inventaire .case_objet.linkBox_vide {
    background-image: none !important;
}
span.couleur0 {
    color: rgba(91, 89, 89, .69)
}
.couleur4,
.couleur4:hover {
    color: #005437
}
#zone_dataBox .meuble_inventaire .case_objet.linkBox_vide {
    border: none !important;
}

/* Mise en forme des messages */
#adresse_folder_list,
#contact_folder_list,
#folder_list {
    width: 110%;
}

#liste_messages {
    width: 150%;
}

div[id^="db_message_"] {
    background: rgba(225, 20, 20, 0);
}
.avatar {
    width: 150px;
    height: 150px;
}
ul {
    background: #0b0200fa;
}
.message_titre {
    color: #005437;
    font-family: Arial;
    font-size: 10px;
}
.dataBox .message .contenu {
    color: #005437;
    background: #141414ad;
}
.dataBox .message .zone_conversation .conversation {
    background: #000;
}
.dataBox .message .zone_conversation .conversation .ligne2 {
    bottom: 5px;
}
.dataBox .message .zone_conversation .conversation .ligne1 {
    bottom: 5px;
}

/* Aitl */
.dataBox {
    background: #000b0fc2;
}

/* Silmerion */
.deck_main {
    width: 70vh;
    height: 37vh;
    font-family: "Lucida console", "Courier New";
    overflow: auto;
    max-width: 95vw;
    box-sizing: border-box;
}

/* Fixes */
/* i really want this to be global */
.inventaire_content .personnage_image {
    top: 10% !important;
    left: 20% !important;
}
/* Implant */
.inventaire_content .zone_case-2 {
    left: 60% !important;
    top: 4% !important;
}
/* Equipement */
/* Tête */
.inventaire_content .zone_case1 {
    left: 0% !important;
    top: 4% !important;
}
/* Buste */
.inventaire_content .zone_case5 {
    left: 0% !important;
    top: 24% !important;
}
/* Jambes */
.inventaire_content .zone_case-1 {
    left: 0% !important;
    top: 44% !important;
}
/* Pieds */
.inventaire_content .zone_case6 {
    left: 0% !important;
    top: 64% !important;
}
/* Secondaire */
.inventaire_content .zone_case2 {
    left: 60% !important;
    top: 64% !important;
}
/* Armes */
.inventaire_content .zone_case3 {
    left: 60% !important;
    top: 24% !important;
}
.inventaire_content .zone_case4 {
    left: 60% !important;
    top: 44% !important;
}
/* Sacs */
.inventaire_content .zone_case7 {
    top: 4% !important;
    right: -1% !important;
}
.inventaire_content .zone_case8 {
    top: 24% !important;
    right: -1% !important;
}
.inventaire_content .zone_case9 {
    top: 44% !important;
    right: -1% !important;
}

.inventaire_content .zone_case-1,
.inventaire_content .zone_case-2,
.inventaire_content .zone_case1,
.inventaire_content .zone_case10,
.inventaire_content .zone_case11,
.inventaire_content .zone_case12,
.inventaire_content .zone_case13,
.inventaire_content .zone_case2,
.inventaire_content .zone_case3,
.inventaire_content .zone_case4,
.inventaire_content .zone_case5,
.inventaire_content .zone_case6,
.inventaire_content .zone_case7,
.inventaire_content .zone_case8,
.inventaire_content .zone_case9 {
    width: 17%;
    height: auto;
    position: absolute;
    background-color: rgba(238, 233, 229, .19);
}
.case_objet {
    width: 4rem;
    height: 4rem;
    margin: 5% 0;
    display: inline-block;
    float: none;
    padding: .05rem;
    overflow: hidden;
    border: .04rem solid #000000b3;
    box-shadow: 0 0 2px 0 #cdf5eb, 0 0 10px 0 #cdf5eb, 2px 2px 5px -1px #cdf5eb, inset 0 0 3px #cdf5eb, inset 0 0 5px 0 #cdf5eb;
    border-radius: 1px;
    transition: .25s all ease-in-out;
}

/* RP */
.inventaire_content .zone_case10 {
    left: 0% !important;
    top: -1600% !important;
}
.inventaire_content .zone_case11 {
    left: 20% !important;
    top: -1600% !important;
}
.inventaire_content .zone_case12 {
    left: 40% !important;
    top: -1600% !important;
}
.inventaire_content .zone_case13 {
    left: 60% !important;
    top: -1600% !important;
}
/* Utils */
.inventaire_content #ciseauxInventaire {
    right: 8% !important;
}
.inventaire_content #poubelleInventaire {
    right: 8% !important;
}
.inventaire_content #statsInventaire {
    right: -2% !important;
}
.inventaire_content #stockInventaire {
    right: -2% !important;
}

#ciseauxInventaire,
#poubelleInventaire,
#statsInventaire,
#stockInventaire {
    display: grid;
    align-items: center;
    justify-content: center;
    color: #005437;
    width: 7%;
    height: 10%;
    box-sizing: border-box;
    border: 1px solid #005437;
}
#ciseauxInventaire.hover,
#ciseauxInventaire.selected,
#ciseauxInventaire:hover,
#poubelleInventaire.hover,
#poubelleInventaire.selected,
#poubelleInventaire:hover,
#statsInventaire.hover,
#statsInventaire.selected,
#statsInventaire:hover,
#stockInventaire.hover,
#stockInventaire.selected,
#stockInventaire:hover {
    color: #005437;
    background: #000;
}
#ciseauxInventaire,
#poubelleInventaire {
    width: 10%;
    text-shadow: 1px 1px 1px #000;
    border: 1px solid rgba(0, 255, 153, .5);
}

/* Couleurs des actions */
#icon-rejoindrecercle,
#icon-social,
#icon-soigner,
#icon-soin,
#icon-star,
#icon-stat0,
#icon-stat1,
#icon-stat2,
#icon-stat3,
#icon-stat4,
#icon-stat5,
#icon-stat6,
#icon-stat7,
#icon-tableaucercle,
#icon-tooltip_angle,
#icon-tourauto,
#icon-travailler,
#icon-travailler2,
#icon-vendeurvitrine,
#icon-vol,
#icon-prevenir,
#icon-offresemploi,
#icon-mettrevente,
#icon-maison,
#icon-fouiller,
#icon-soigner,
#icon-energie,
#icon-star,
#icon-noaction,
#icon-repos,
#icon-fouiller,
#icon-cacher,
#icon-scruter,
#icon-soigner,
#icon-meubledetruire,
#icon-meublereparer,
#icon-mort,
#icon-12,
#icon-14,
#icon-79,
#icon-arrestation,
#icon-arret,
#icon-assassinat,
#icon-attaque_cac,
#icon-attaque_tir,
#icon-attaque,
#icon-cacher,
#icon-contact,
#icon-controle,
#icon-corners_cac,
#icon-corners_drapeau,
#icon-corners_shield,
#icon-corners_gun,
#icon-corners_soigner,
#icon-corners_tourauto,
#icon-corners,
#icon-cryo,
#icon-deplacement,
#icon-doncercle,
#icon-echange,
#icon-energie,
#icon-envelope,
#icon-fiche,
#icon-filter,
#icon-fouiller,
#icon-fullscreen,
#icon-gun,
#icon-heart,
#icon-inspecter,
#icon-livrerp {
    fill: #618c71;
}
#zone_actions > div:hover > svg {
    border: 1px solid #005437;
    background: #8dfbaa;
}
#zone_actions > div.active > svg {
    border: 1px solid #005437;
    background: #8dfbaa;
}
    element.style {
    margin: 7px auto 0px 4px;
    left: 209px;
    top: 159px;
}
    element.style {
}

#combat_menu div svg, #zone_actions div svg {
    stroke: #000;
    fill: url(#Degrade_sans_nom_245);
    background: #000;
    position: absolute;
    top: 7%;
    left: 7%;
    width: 80%;
    height: 80%;
    border: 1px solid #000e11;
    border-radius: 7px;
    transition: all .2s ease-in-out;
}
#combat_menu>div.disabled>svg, #zone_actions>div.disabled>svg {
    border: 1px solid transparent;
    background: #000;
}
#menu_actions .action_perso .inset_action_perso {
    padding: 1px;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    border: 1px solid #4e5150;
    box-sizing: border-box;
    box-shadow: inset 0 0 5px 0 #000;
    background: #000;
    background: -moz-linear-gradient(top,rgb(0, 0, 0) 0,rgb(0, 0, 0) 45%,rgb(0, 0, 0) 55%,rgb(0, 0, 0) 100%);
    background: -webkit-linear-gradient(top,rgb(0, 0, 0) 0,rgb(0, 0, 0) 45%,rgb(0, 0, 0) 55%,rgb(0, 0, 0) 100%);
    background: linear-gradient(to bottom,rgb(0, 0, 0) 0,rgb(0, 0, 0) 45%,rgb(0, 0, 0) 55%,rgb(0, 0, 0) 100%);
    transition: all .5s ease;
}
.stat_icone_soif {
    width: 13px;
    height: 13px;
    background: url(https://imgur.com/maOpEe8.png) -13px -143px no-repeat;
}
    .stat_icone_faim {
    width: 13px;
    height: 13px;
    background: url(https://imgur.com/maOpEe8.png) 0 -143px no-repeat;
}
    #lieu_actuel .titre1 {
    font-size: 1rem;
    color: #cdf5eb;
    text-transform: uppercase;
}
    #zone_carnet .btnTxt.selected, #zone_carnet .btnTxt:hover, #zone_carnet .infoAide:hover, #zone_messagerie .btnTxt.selected, #zone_messagerie .btnTxt:hover {
    color: #cdf5eb;
    background: #005437;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
