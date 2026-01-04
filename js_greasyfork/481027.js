// ==UserScript==
// @name         G-E_Ceres
// @namespace    http://tampermonkey.net/
// @version      0.2.23
// @description  Script de test - FR
// @license      MIT
// @author       Guiver
// @match        https://*.ogame.gameforge.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/481027/G-E_Ceres.user.js
// @updateURL https://update.greasyfork.org/scripts/481027/G-E_Ceres.meta.js
// ==/UserScript==
'use strict';


// Header origine
document.getElementById("mmonetbar") !== null ? document.getElementById("mmonetbar").style.display = "none" : '';
document.getElementById("mmoNetbarSubmenu") !== null ? document.getElementById("mmoNetbarSubmenu").style.display = "none" : '';
document.getElementById("pagefoldtarget") !== null ? document.getElementById("pagefoldtarget").style.display = "none" : '';
document.getElementById("messages") !== null ? document.getElementById("messages").querySelector("div.contentBoxBody") !== null ? document.getElementById("messages").querySelector("div.contentBoxBody").style.top = "auto" : '' : '';
document.getElementById("pageContent") !== null ? document.getElementById("pageContent").style.top = "auto" : '';
document.getElementById("pageContent") !== null ? document.getElementById("pageContent").style.display = "initial" : '';
document.getElementById("headerbarcomponent") !== null ? document.getElementById("headerbarcomponent").style.display = "none" : '';
document.body.style.lineHeight = "normal";
document.body.style.fontSize = "22px";
// Footer orgine
document.getElementById("siteFooter") !== null ? document.getElementById("siteFooter").style.display = "none" : '';
// Header affiché
// Menu burger
var ogmob_i = 0;
var ogmob_parentNode;
var ogmob_enfantNode;
// Langues
const ogmob_primes = 'Primes';
const ogmob_arbreTechno = 'Arbre technologique';
const ogmob_retourFlotte = ' (R)';
/*
----------------------------------
HEADER
----------------------------------
*/
if(1 === 1)
{
    // Création du nouveau header
    let ogmob_header = document.createElement("div");
    ogmob_header.id = "ogmob_header";
    // Menu Burger
    let ogmob_menuBurger = document.createElement('a');
    ogmob_menuBurger.id = 'ogmob_menuBurger';
    ogmob_menuBurger.href='#';
    ogmob_menuBurger.onclick = ogmob_openNav;
    let ogmob_iconBurger = document.createElement('span');
    ogmob_iconBurger.id = 'ogmob_iconBurger';
    let ogmob_traitBurger = document.createElement('span');
    ogmob_traitBurger.className = 'ogmob_traitBurger';
    document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarRecurringRewards"]') !== null ? ogmob_traitBurger.classList.add('premiumHighligt') : ''; // Gestion "Récompenses" (event)
    ogmob_iconBurger.appendChild(ogmob_traitBurger);
    ogmob_traitBurger = document.createElement('span');
    ogmob_traitBurger.className = 'ogmob_traitBurger';
    document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarRecurringRewards"]') !== null ? ogmob_traitBurger.classList.add('premiumHighligt') : ''; // Gestion "Récompenses" (event)
    ogmob_iconBurger.appendChild(ogmob_traitBurger);
    ogmob_traitBurger = document.createElement('span');
    ogmob_traitBurger.className = 'ogmob_traitBurger';
    document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarRecurringRewards"]') !== null ? ogmob_traitBurger.classList.add('premiumHighligt') : ''; // Gestion "Récompenses" (event)
    ogmob_iconBurger.appendChild(ogmob_traitBurger);
    // Notification des missions
    if(document.getElementById("ipimenucomponent") !== null)
    {
        if(document.getElementById("ipimenucomponent").querySelector("span.ipiHintCollect") !== null)
        {
            ogmob_enfantNode = document.createElement('span');
            ogmob_enfantNode.className = 'ipiHintCollect';
            ogmob_enfantNode.innerHTML = document.getElementById("ipimenucomponent").querySelector("span.ipiHintCollect").innerHTML;
            ogmob_iconBurger.insertBefore(ogmob_enfantNode, ogmob_iconBurger.firstChild);
        }
    }
    ogmob_menuBurger.appendChild(ogmob_iconBurger);
    ogmob_header.appendChild(ogmob_menuBurger);
    // Joueur
    ogmob_enfantNode = document.createElement('p');
    ogmob_enfantNode.id = 'ogmob_nomClassement';
    var ogmob_nomJoueur = document.getElementById("playerName").querySelector("span.textBeefy").querySelector("a");
    ogmob_enfantNode.appendChild(ogmob_nomJoueur);
    // Classement
    let ogmob_classement = document.createElement('a');
    ogmob_classement.href = document.getElementById("bar").querySelectorAll("ul li")[1].querySelector("a").href;
    ogmob_classement.innerHTML = document.getElementById("bar").querySelectorAll("ul li")[1].querySelector("a").innerHTML + document.getElementById("bar").querySelectorAll("ul li")[1].innerHTML.replace(document.getElementById("bar").querySelectorAll("ul li")[1].querySelector("a").outerHTML, '');
    ogmob_enfantNode.appendChild(ogmob_classement);
    ogmob_header.appendChild(ogmob_enfantNode);
    // Messages
    var ogmob_message = document.getElementById("message-wrapper").querySelector("a.messages");
    ogmob_message.id = 'ogmob_messageHeader';
    ogmob_message.className = '';
    ogmob_message.title = '';
    ogmob_enfantNode = document.createElement('img');
    ogmob_enfantNode.src = 'https://i.postimg.cc/VLZdzXH6/message.png';
    ogmob_message.appendChild(ogmob_enfantNode);
    ogmob_header.appendChild(ogmob_message);
    // Tchat
    var ogmob_chat = document.getElementById("message-wrapper").querySelector("a.chat");
    ogmob_chat.id = 'ogmob_chatHeader';
    ogmob_chat.className = '';
    ogmob_chat.title = '';
    ogmob_enfantNode = document.createElement('img');
    ogmob_enfantNode.src = 'https://i.postimg.cc/br8228Qw/chat.png';
    ogmob_chat.appendChild(ogmob_enfantNode);
    ogmob_header.appendChild(ogmob_chat);
    // Insertion du nouveau Header
    document.body.insertBefore(ogmob_header, document.body.firstChild);
    var ogmob_css =`
/* CSS OGMOB */
#ogmob_header {
  position: relative;
  margin: 0;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 5px;
  padding-bottom: 5px;
  top: 0px;
  left: 0px;
  height: max-content;
  width: calc(100% - 60px);
  background-color: black;
  border-bottom: 1px solid white;
  display: flex;
  text-align: center;
  align-items: center;
  line-height: normal;
}
#ogmob_header #ogmob_iconBurger span.ogmob_traitBurger {
  display: block;
  width: 40px;
  height: 4px;
  margin: 10px;
  background-color: white;
}
#ogmob_header #ogmob_iconBurger span.ogmob_traitBurger.premiumHighligt {
  background-color: #ffd700;
}
#ogmob_header #ogmob_iconBurger .ipiHintCollect {
  position: absolute;
  display: inline-block;
  background: #9c0;
  border: 1px solid #9c0;
  border-radius: 18px;
  padding: 6px;
  line-height: 15px;
  text-align: center;
  color: #000;
}
#ogmob_header #ogmob_nomClassement {
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  align-items: center;
}
#ogmob_header #ogmob_nomClassement a {
  margin: 0;
  padding: 0;
  color: #FFF;
  text-decoration: none;
  width: fit-content;
}
#ogmob_header #ogmob_messageHeader {
  padding-right: 30px !important;
}
#ogmob_header #ogmob_messageHeader, #ogmob_header #ogmob_chatHeader {
  margin: 0;
  padding: 0;
  background-repeat: no-repeat;
  height: 50px;
  width: auto;
  display: inherit;
  float: none;
  position: relative;
  background-size: cover;
  background-position: unset;
  background-image: none;
}
#ogmob_header #ogmob_messageHeader img, #ogmob_header #ogmob_chatHeader img {
  height: 100%;
  width: auto;
}
#ogmob_header .new_msg_count {
  position: absolute;
  top: -2px;
  right: 10px;
  display: inline-block;
  background: #9c0;
  border: 1px solid #9c0;
  border-radius: 18px;
  padding: 6px;
  line-height: 15px;
  text-align: center;
  color: #000;
}
/* CSS OGAME ORIGINAL */
#siteHeader {
  display: none;
}
`
}
/*
----------------------------------
Menu de navigation
----------------------------------
*/
if(1 === 1)
{
    // Création du sideNav
    let ogmob_sideNavNode = document.createElement("div");
    ogmob_sideNavNode.id = "ogmob_sideNav";
    // Croix pour fermer
    ogmob_enfantNode = document.createElement('a');
    ogmob_enfantNode.id = 'ogmob_fermerSideNav';
    ogmob_enfantNode.href = '#';
    ogmob_enfantNode.innerHTML = 'x';
    ogmob_sideNavNode.appendChild(ogmob_enfantNode);
    let ogmob_flexLigneSideNav = document.createElement('div');
    ogmob_flexLigneSideNav.id = 'ogmob_flexLigneSideNav';
    let ogmob_flexColonneSideNav = document.createElement('div');
    ogmob_flexColonneSideNav.id = 'ogmob_flexColonneSideNav';
    // icone des officiers
    if(document.getElementById("commandercomponent") !== null)
    {
        ogmob_flexColonneSideNav.appendChild(document.getElementById("commandercomponent"));
    }
    // Happy hours
    if(document.getElementById("advicebarcomponent") !== null)
    {
        ogmob_flexColonneSideNav.appendChild(document.getElementById("advicebarcomponent"));
    }
    // Bandeau promotion
    if(document.getElementById("bannerSkyscrapercomponent") !== null)
    {
        ogmob_flexColonneSideNav.appendChild(document.getElementById("bannerSkyscrapercomponent"));
    }
    ogmob_flexLigneSideNav.appendChild(ogmob_flexColonneSideNav);
    // Menu
    let ogmob_menuSideNav = document.createElement("ul");
    ogmob_menuSideNav.id = 'ogmob_menuSideNav';
    var ogmob_menuLiSideNav;
    // Gestion des "missions"
    if(document.getElementById("ipiInnerMenuContentHolder") !== null)
    {
        ogmob_menuLiSideNav = document.createElement("li");
        ogmob_enfantNode = document.getElementById("ipiInnerMenuContentHolder");
        ogmob_enfantNode.innerHTML = ogmob_enfantNode.querySelector('div.ipiMenuHead').innerHTML;
        ogmob_menuLiSideNav.appendChild(ogmob_enfantNode);
        ogmob_menuSideNav.appendChild(ogmob_menuLiSideNav);
    }
    if(document.getElementById("menuTable") !== null)
    {
        // Bouton "prime"
        if(document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarRewards"]') !== null)
        {
            ogmob_menuLiSideNav = document.createElement("li");
            ogmob_enfantNode = document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarRewards"]').parentNode.cloneNode(true);
            ogmob_enfantNode.id = 'ogmob_ipiToolbarRewards';
            ogmob_enfantNode.innerHTML = ogmob_primes;
            ogmob_menuLiSideNav.appendChild(ogmob_enfantNode);
            ogmob_menuSideNav.appendChild(ogmob_menuLiSideNav);
        }
        // Bouton "Technologie"
        if(document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarTechnology"]') !== null)
        {
            ogmob_menuLiSideNav = document.createElement("li");
            ogmob_enfantNode = document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarTechnology"]').parentNode.cloneNode(true);
            ogmob_enfantNode.id = 'ogmob_ipiToolbarTechnology';
            ogmob_enfantNode.innerHTML = ogmob_arbreTechno;
            ogmob_menuLiSideNav.appendChild(ogmob_enfantNode);
            ogmob_menuSideNav.appendChild(ogmob_menuLiSideNav);
        }
        // Bouton "mess des officiers"
        if(document.getElementById("menuTable").querySelector('a.officers') !== null)
        {
            ogmob_menuLiSideNav = document.createElement("li");
            ogmob_enfantNode = document.getElementById("menuTable").querySelector('a.officers').cloneNode(true);
            ogmob_enfantNode.className = '';
            ogmob_enfantNode.innerHTML = ogmob_enfantNode.querySelector('span').innerHTML;
            ogmob_menuLiSideNav.appendChild(ogmob_enfantNode);
            ogmob_menuSideNav.appendChild(ogmob_menuLiSideNav);
        }
        // Bouton "Boutique"
        if(document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarShop"]') !== null)
        {
            ogmob_menuLiSideNav = document.createElement("li");
            ogmob_enfantNode = document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarShop"]').cloneNode(true);
            ogmob_enfantNode.className = '';
            ogmob_enfantNode.innerHTML = ogmob_enfantNode.querySelector('span').innerHTML;
            ogmob_menuLiSideNav.appendChild(ogmob_enfantNode);
            ogmob_menuSideNav.appendChild(ogmob_menuLiSideNav);
        }
        // Bouton "Récompenses" (event)
        if(document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarRecurringRewards"]') !== null)
        {
            ogmob_menuLiSideNav = document.createElement("li");
            ogmob_enfantNode = document.getElementById("menuTable").querySelector('[data-ipi-hint="ipiToolbarRecurringRewards"]').cloneNode(true);
            ogmob_enfantNode.className = 'premiumHighligt';
            ogmob_enfantNode.innerHTML = ogmob_enfantNode.querySelector('span').innerHTML;
            ogmob_menuLiSideNav.appendChild(ogmob_enfantNode);
            ogmob_menuSideNav.appendChild(ogmob_menuLiSideNav);
        }
    }
    // Récupération des menus du header d'origine à l'exeption de "joueur"(0) et "classement"(1)
    var ogmob_menusTop = document.getElementById("bar").querySelectorAll("ul li");
    ogmob_menusTop.forEach((ogmob_menuTop) => {
        if(ogmob_i > 1)
        {
            ogmob_menuSideNav.appendChild(ogmob_menuTop);
        }
        ogmob_i = ogmob_i + 1;
    });
    ogmob_flexLigneSideNav.appendChild(ogmob_menuSideNav);
    ogmob_sideNavNode.appendChild(ogmob_flexLigneSideNav);
    document.body.insertBefore(ogmob_sideNavNode, document.body.firstChild);

    ogmob_css = ogmob_css +
        `
#ogmob_sideNav {
  position: fixed;
  top: 0;
  height: 100%;
  width: max-content;
  display: none;
  z-index: 10;
  background-color: hsl(210deg 32% 9%);
  padding: 30px;
  transition: display 1s ease;
  border-right: 1px solid white;
  overflow: auto;
}
#ogmob_sideNav a#ogmob_fermerSideNav {
  width: 100%;
  font-size: 40px;
  text-align: right;
  text-decoration: none;
  color: #FFF;
  display: block;
}
#ogmob_sideNav #commandercomponent {
  position: relative;
  top: 0;
  left: 0;
  width: max-content;
  height: max-content;
  float: none;
  display:flex;
}
#ogmob_sideNav #commandercomponent div {
  position: relative;
  top: 0;
  left: 0;
  float: none;
}
#ogmob_sideNav #ogmob_flexLigneSideNav {
  display: flex;
}
#ogmob_sideNav #ogmob_flexColonneSideNav {
  display: flex;
  flex-direction: column;
}
#ogmob_sideNav #advicebarcomponent {
  width: max-content;
  height: max-content;
  padding: 0;
  margin: 0;
}
#ogmob_sideNav #advicebarcomponent a {
  width: max-content;
  height: max-content;
}
#ogmob_sideNav #advicebarcomponent span {
  font-size: 25px;
  width: max-content;
  height: max-content;
}
#ogmob_sideNav #advicebarcomponent div.adviceWrapper {
  float: none;
  margin: 0;
}
#banner_skyscraper a.close_details {
  display: none;
}
#ogmob_sideNav ul {
  list-style-type: none;
  margin: 0;
  padding-right: 20px;
  padding-left: 20px;
}
#ogmob_sideNav ul li {
  display: flex;
  flex-direction: column;
  align-items: left;
  padding-bottom: 20px;
}
#ogmob_sideNav ul li a {
  position: relative;
  top: 0;
  rigth: 0;
  text-decoration: none;
  font-size: 25px;
  color: #FFF;
  display: block;
}
#ogmob_sideNav ul li a.premiumHighligt {
  color: #ffd700;
}
#ogmob_sideNav ul li a#ogmob_ipiInnerMenuContentHolder span {
  position: absolute;
  top: -15px;
  display: inline-block;
  background: #9c0;
  border: 1px solid #9c0;
  border-radius: 18px;
  padding: 6px;
  line-height: 15px;
  text-align: center;
  color: #000;
}
/* CSS OGAME ORIGINAL */
#ipimenucomponent, #bar, #box {
  display: none;
}
`;
}
/*
----------------------------------
Ressources
----------------------------------
*/
if(1 === 1)
{
    if(document.getElementById("resourcesbarcomponent") !== null)
    {
        document.getElementById("ogmob_header").parentNode.insertBefore(document.getElementById("resourcesbarcomponent"), document.getElementById("ogmob_header").nextSibling);
        var ogmob_ressources = document.getElementById("resources").querySelectorAll("div.resource_tile");
        var ogmob_supprListener;
        ogmob_ressources.forEach((ogmob_ressource) => {
            ogmob_supprListener = ogmob_ressource.querySelector("div.resource").cloneNode(true);
            ogmob_ressource.querySelector("div.resource").querySelector("div.resourceIcon") !== null ? ogmob_ressource.querySelector("div.resource").querySelector("div.resourceIcon").style.display = 'none' : '';
            ogmob_ressource.querySelector("div.resource").querySelector("span.value") !== null ? ogmob_ressource.querySelector("div.resource").querySelector("span.value").style.display = 'none' : '';
            ogmob_ressource.querySelector("div.resource").style.display = "none";
            ogmob_ressource.querySelector("div.resource").id = "";
            ogmob_ressource.querySelector("div.resource").parentNode.insertBefore(ogmob_supprListener, ogmob_ressource.querySelector("div.resource").nextSibling);
        });
    }
    ogmob_css = ogmob_css +
`
#resourcesbarcomponent {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: max-content;
  display: block;
  float: none;
  padding-top: 10px;
  padding-bottom: 10px;
}
#resourcesbarcomponent #resources {
  justify-content: space-between !important;
  text-align: center;
  align-items: center;
}
#resourcesbarcomponent #resources div.resource_tile {
  padding: 0;
  margin: 0;
  width: fit-content;
  height: fit-content;
  background: none;
  flex-grow: 1;
}
#resourcesbarcomponent #resources div.resource_tile div.resource {
  height: 60px!important;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  width: 100%;
}
#resourcesbarcomponent #resources div.resource_tile div.resource div.resourceIcon {
  margin: 0;
  float: none;
  min-height: 32px;
}
#resourcesbarcomponent #resources div.resource_tile div.resource span.value {
  font: inherit!important;
  width: max-content;
  display: inherit;
  justify-content: inherit;
  position: inherit;
  bottom: inherit;
}
#resourcesbarcomponent #resources div.resource_tile div.resource span.value span {
  position: inherit;
  top: inherit;
  left: inherit;
  padding-top: 3px;
}
#resourcesbarcomponent #resources div.resource_tile div.resource a.overlay img {
  position: inherit;
  margin: 0;
}
#resourcesbarcomponent #resources div.resource_tile div.resource a.overlay div.darkmatter {
  display: none;
}
#resourcesbarcomponent #resources #darkmatter_box {
  position: inherit;
}
`;
}
/*
----------------------------------
Header mouvements de flottes
----------------------------------
*/
if(1 === 1)
{
    if(document.getElementById("notificationbarcomponent") !== null)
    {
        document.getElementById("resourcesbarcomponent").parentNode.insertBefore(document.getElementById("notificationbarcomponent"), document.getElementById("resourcesbarcomponent").nextSibling);
        document.getElementById("js_eventDetailsClosed") !== null ? document.getElementById("js_eventDetailsClosed").remove() : '';
        document.getElementById("js_eventDetailsOpen") !== null ? document.getElementById("js_eventDetailsOpen").remove() : '';
    }
    let ogmob_mutHeaderFlotte = new MutationObserver(mutationRecords => {
        if(document.getElementById("eventboxFilled").querySelector("p.event_list") !== null)
        {
            // "missions :" => "mission"
            document.getElementById("eventboxFilled").querySelector("p.event_list").innerHTML = document.getElementById("eventboxFilled").querySelector("p.event_list").innerHTML.substring(0, document.getElementById("eventboxFilled").querySelector("p.event_list").innerHTML.indexOf(':')) + document.getElementById("eventboxFilled").querySelector("p.event_list").innerHTML.substring(document.getElementById("eventboxFilled").querySelector("p.event_list").innerHTML.indexOf('<'), document.getElementById("eventboxFilled").querySelector("p.event_list").innerHTML.length);
            // "," => " - "
            document.getElementById("eventboxFilled").querySelector("p.event_list").innerHTML = document.getElementById("eventboxFilled").querySelector("p.event_list").innerHTML.replaceAll(",","&nbsp;-&nbsp;");
            // Suppression du texte "Suivant:"
            document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[0].innerHTML = document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[0].innerHTML.substring(document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[0].innerHTML.indexOf(':') + 1,document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[0].innerHTML.length);
            // Suppression du texte "Type:"
            document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[1].innerHTML = document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[1].innerHTML.substring(document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[1].innerHTML.indexOf(':') + 1,document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[1].innerHTML.length);
            // Inversion du type et du compteur
            document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[1] !== null ? document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").insertBefore(document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[1], document.getElementById("eventboxFilled").querySelector("p.event_list").querySelector("p.event_list").querySelectorAll("span.next_event")[0]) : '';
        }
    });
    ogmob_mutHeaderFlotte.observe(document.getElementById("eventboxFilled"), {
        childList: true,
    });

    ogmob_css = ogmob_css +
`
#notificationbarcomponent {
  position: relative;
  top: 0;
  left: 0;
  width: 98%;
  height: max-content;
  display: block;
  margin-top: 5px;
  margin-left: 1%;
}
#notificationbarcomponent #message-wrapper {
  position: inherit;
  top: 0;
  left: 0;
  width: 100%;
  height: max-content;
  margin:0;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  border: 2px solid white;
  border-radius: 20px;
  padding-left: 5px;
  background-color: rgba(0,0,0,0.3);
}
#notificationbarcomponent #messages_collapsed {
  position: inherit;
  float: inherit;
  font-size: inherit;
  height: max-content;
  line-height: inherit;
  margin: 0;
  overflow: inherit;
  text-align: inherit;
  width: 100%;
  left: 0;
  top: 0;
  flex-grow: 3;
}
#notificationbarcomponent #eventboxFilled {
  height: 50px;
}
#notificationbarcomponent #attack_alert {
  display: none;
}
#eventboxFilled p.event_list {
  text-align: center;
  display: flex;
  height: 50px;
  align-items: center;
  padding-left: 10px;
}
#eventboxFilled p.event_list span.undermark {
  display: none;
}
#eventboxFilled p.event_list p.event_list {
  width: 100%;
}
#eventboxFilled p.event_list p.event_list span.next_event span.friendly {
  color:white!important;
}
#eventboxFilled p.event_list p.event_list span.next_event {
  width:inherit!important;
}
`;
}
/*
----------------------------------
Mouvements de flottes
----------------------------------
*/
if(1 === 1)
{
    document.getElementById("eventlistcomponent") !== null ? document.getElementById("notificationbarcomponent").parentNode.insertBefore(document.getElementById("eventlistcomponent"), document.getElementById("notificationbarcomponent").nextSibling) : '';
    var ogmob_lignesFlotte;
    var ogmob_ajoutColonne;
    var omgmob_tooltipFlotte;
    var ogmob_gifFlotte;
    var ogmob_id = 0;
    var ogmob_idConcatene = 0;
    ogmob_i = 1;
    let ogmob_mutFlotte = new MutationObserver(mutationRecords => {
        //console.log(mutationRecords);
        if(document.getElementById("eventContent") !== null)
        {
            ogmob_lignesFlotte = document.getElementById("eventContent").querySelectorAll("tr");
            ogmob_lignesFlotte.forEach((ogmob_ligneFlotte) => {
                ogmob_id = ogmob_ligneFlotte.id.replace('eventRow-', '');
                ogmob_idConcatene = 0;
                // Expédition - il y'a 3 flottes
                if(ogmob_ligneFlotte.dataset.missionType == '15')
                {
                    // Expédition - Retour
                    if(ogmob_ligneFlotte.dataset.returnFlight == 'true')
                    {
                        if(document.getElementById('ogmob_colonneFlotte_' + (ogmob_id - 2)) !== null)
                        {
                            ogmob_idConcatene = ogmob_id - 2;
                        }
                        if(document.getElementById('ogmob_colonneFlotte_' + (ogmob_id - 1)) !== null)
                        {
                            ogmob_idConcatene = ogmob_id - 1;
                        }
                    }
                    // Expédition - délai d'expédition
                    else
                    {
                        if(document.getElementById('ogmob_colonneFlotte_' + (ogmob_id - 1)) !== null)
                        {
                            return;
                        }
                    }
                }
                // Retour de flotte
                if(ogmob_ligneFlotte.dataset.returnFlight == 'true')
                {
                    if(document.getElementById('ogmob_colonneFlotte_' + (ogmob_id - 1)) !== null)
                    {
                        ogmob_idConcatene = ogmob_id - 1;
                    }
                }
                if( ogmob_idConcatene != '0')
                {
                    // Heure du retour
                    ogmob_ajoutColonne = document.createElement("span");
                    ogmob_ajoutColonne.id = 'arrivalTime' + ogmob_id;
                    ogmob_ajoutColonne.className = 'arrivalTime';
                    if(ogmob_ligneFlotte.querySelector("td.arrivalTime") !== null)
                    {
                        ogmob_ajoutColonne.innerHTML = ogmob_ligneFlotte.querySelector("td.arrivalTime").innerHTML + ogmob_retourFlotte;
                    }
                    document.getElementById('ogmob_colonneFlotte_' + ogmob_idConcatene).appendChild(ogmob_ajoutColonne);
                    return;
                }
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'ogmob_colonneFlotte_' + ogmob_id;
                ogmob_ajoutColonne.className = 'ogmob_colonneFlotte';
                document.getElementById("eventListWrap").appendChild(ogmob_ajoutColonne);
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'ogmob_colonneFlotteMaColo_' + ogmob_id;
                ogmob_ajoutColonne.className = 'ogmob_colonneFlotteMaColo';
                document.getElementById("eventListWrap").appendChild(ogmob_ajoutColonne);
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'ogmob_colonneDetailsFlotte_' + ogmob_id;
                ogmob_ajoutColonne.className = 'ogmob_colonneDetailsFlotte';
                document.getElementById("eventListWrap").appendChild(ogmob_ajoutColonne);
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'ogmob_colonneTypeMission_' + ogmob_id;
                ogmob_ajoutColonne.className = 'ogmob_colonneTypeMission';
                document.getElementById("eventListWrap").appendChild(ogmob_ajoutColonne);
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'ogmob_colonneDestination_' + ogmob_id;
                ogmob_ajoutColonne.className = 'ogmob_colonneDestination';
                document.getElementById("eventListWrap").appendChild(ogmob_ajoutColonne);
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'ogmob_colonneAction_' + ogmob_id;
                ogmob_ajoutColonne.className = 'ogmob_colonneAction';
                document.getElementById("eventListWrap").appendChild(ogmob_ajoutColonne);
                // Countdown
                if(ogmob_ligneFlotte.querySelector("td.countDown") !== null)
                {
                    if(ogmob_ligneFlotte.querySelector("td.countDown").querySelector("span") !== null)
                    {
                        document.getElementById('ogmob_colonneFlotte_' + ogmob_id).appendChild(ogmob_ligneFlotte.querySelector("td.countDown").querySelector("span"));
                    }
                }
                // Heure d'arrivée
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'arrivalTime' + ogmob_id;
                if(ogmob_ligneFlotte.querySelector("td.arrivalTime") !== null)
                {
                    ogmob_ajoutColonne.innerHTML = ogmob_ligneFlotte.querySelector("td.arrivalTime").innerHTML
                    if(ogmob_ligneFlotte.dataset.returnFlight == 'true')
                    {
                        ogmob_ajoutColonne.className = 'arrivalTime';
                        ogmob_ajoutColonne.innerHTML = ogmob_ajoutColonne.innerHTML + ogmob_retourFlotte;
                    }
                }
                document.getElementById('ogmob_colonneFlotte_' + ogmob_id).appendChild(ogmob_ajoutColonne);
                // Ma colonie
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'originFleet' + ogmob_id;
                if(ogmob_ligneFlotte.querySelector("td.originFleet") !== null)
                {
                    ogmob_ajoutColonne.innerHTML = ogmob_ligneFlotte.querySelector("td.originFleet").innerHTML
                }
                document.getElementById('ogmob_colonneFlotteMaColo_' + ogmob_id).appendChild(ogmob_ajoutColonne);
                // Coordonnée ma colonie
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'coordsOrigin' + ogmob_id;
                if(ogmob_ligneFlotte.querySelector("td.coordsOrigin") !== null)
                {
                    ogmob_ajoutColonne.innerHTML = ogmob_ligneFlotte.querySelector("td.coordsOrigin").innerHTML
                }
                document.getElementById('ogmob_colonneFlotteMaColo_' + ogmob_id).appendChild(ogmob_ajoutColonne);
                // Tooltip Flotte
                if(ogmob_ligneFlotte.querySelector("td.icon_movement_reserve") !== null)
                {
                    if(ogmob_ligneFlotte.querySelector("td.icon_movement_reserve").querySelector('span.tooltip') !== null)
                    {
                        omgmob_tooltipFlotte = ogmob_ligneFlotte.querySelector("td.icon_movement_reserve").querySelector("span.tooltip");
                        ogmob_gifFlotte = 'https://i.postimg.cc/s282rJ77/retour.gif';
                    }
                }
                if(ogmob_ligneFlotte.querySelector("td.icon_movement") !== null)
                {
                    if(ogmob_ligneFlotte.querySelector("td.icon_movement").querySelector('span.tooltip') !== null)
                    {
                        omgmob_tooltipFlotte = ogmob_ligneFlotte.querySelector("td.icon_movement").querySelector("span.tooltip");
                        ogmob_gifFlotte = 'https://i.postimg.cc/PqYL3Ysy/f9cb590cdf265f499b0e2e5d91fc75.gif';
                    }
                }
                document.getElementById('ogmob_colonneDetailsFlotte_' + ogmob_id).appendChild(omgmob_tooltipFlotte);
                // Gif de la flotte
                ogmob_ajoutColonne = document.createElement("img");
                ogmob_ajoutColonne.id = 'imgFleet' + ogmob_id;
                ogmob_ajoutColonne.className = 'imgFleet';
                ogmob_ajoutColonne.src = ogmob_gifFlotte;
                document.getElementById('ogmob_colonneDetailsFlotte_' + ogmob_id).querySelector('span.tooltip').appendChild(ogmob_ajoutColonne);
                // Détails flotte
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'detailsFleet' + ogmob_id;
                ogmob_ajoutColonne.className = 'detailsFleet';
                if(ogmob_ligneFlotte.querySelector("td.detailsFleet") !== null)
                {
                    if(ogmob_ligneFlotte.querySelector("td.detailsFleet").querySelector('span') !== null)
                    {
                        ogmob_ajoutColonne.innerHTML = ogmob_ligneFlotte.querySelector("td.detailsFleet").querySelector('span').innerHTML
                    }
                }
                document.getElementById('ogmob_colonneDetailsFlotte_' + ogmob_id).querySelector('span.tooltip').appendChild(ogmob_ajoutColonne);
                // Ordre de mission
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'missionFleet' + ogmob_id;
                ogmob_ajoutColonne.className = 'missionFleet';
                if(ogmob_ligneFlotte.querySelector("td.missionFleet") !== null)
                {
                    ogmob_ajoutColonne.innerHTML = ogmob_ligneFlotte.querySelector("td.missionFleet").innerHTML
                }
                document.getElementById('ogmob_colonneTypeMission_' + ogmob_id).appendChild(ogmob_ajoutColonne);
                // Nom destination
                if(ogmob_ligneFlotte.querySelector("td.destFleet") !== null)
                {
                    if(ogmob_ligneFlotte.querySelector("td.destFleet").querySelector('span.tooltip') !== null)
                    {
                        document.getElementById('ogmob_colonneDestination_' + ogmob_id).appendChild(ogmob_ligneFlotte.querySelector("td.destFleet").querySelector("span.tooltip"));
                    }
                    else
                    {
                        ogmob_ajoutColonne = document.createElement("span");
                        ogmob_ajoutColonne.id = 'destFleet' + ogmob_id;
                        ogmob_ajoutColonne.innerHTML = ogmob_ligneFlotte.querySelector("td.destFleet").innerHTML
                        document.getElementById('ogmob_colonneDestination_' + ogmob_id).appendChild(ogmob_ajoutColonne);
                    }
                }
                // Coordonné destination
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'destCoords' + ogmob_id;
                if(ogmob_ligneFlotte.querySelector("td.destCoords") !== null)
                {
                    ogmob_ajoutColonne.innerHTML = ogmob_ligneFlotte.querySelector("td.destCoords").innerHTML
                }
                document.getElementById('ogmob_colonneDestination_' + ogmob_id).appendChild(ogmob_ajoutColonne);
                // Bouton retour
                ogmob_ajoutColonne = document.createElement("span");
                ogmob_ajoutColonne.id = 'reversal' + ogmob_id;
                if(ogmob_ligneFlotte.querySelector("td.sendMail") !== null)
                {
                    if(ogmob_ligneFlotte.querySelector("td.sendMail").querySelector("span.reversal") !== null)
                    {
                        document.getElementById('ogmob_colonneAction_' + ogmob_id).appendChild(ogmob_ligneFlotte.querySelector("td.sendMail").querySelector("span.reversal"));
                    }
                }
                // Mise en forme
                document.getElementById("ogmob_colonneFlotte_" + ogmob_id).style.gridRow = ogmob_i;
                document.getElementById("ogmob_colonneFlotteMaColo_" + ogmob_id).style.gridRow = ogmob_i;
                document.getElementById("ogmob_colonneDetailsFlotte_" + ogmob_id).style.gridRow = ogmob_i;
                document.getElementById("ogmob_colonneTypeMission_" + ogmob_id).style.gridRow = ogmob_i;
                document.getElementById("ogmob_colonneDestination_" + ogmob_id).style.gridRow = ogmob_i;
                document.getElementById("ogmob_colonneAction_" + ogmob_id).style.gridRow = ogmob_i;
                ogmob_i = ogmob_i + 1;
            });
            ogmob_i = 1;
        }
    });
    ogmob_mutFlotte.observe(document.getElementById("eventboxContent"), {
        childList: true,
    });

    ogmob_css = ogmob_css +
`
#eventlistcomponent {
  position: relative;
  top: 0;
  left: 0;
  width: 98%;
  height: max-content;
  display: block;
  margin-left: 1%;
}
#eventlistcomponent #eventboxContent {
  width: 100%;
  margin: 0;
  border: 2px solid white;
  border-top: none;
  border-radius: 20px;
}
#eventListWrap {
  display: grid;
  grid-row-gap: 10px;
  grid-template-columns: auto auto auto 50px auto 50px;
  padding: 5px 10px 5px 10px;
  justify-content: space-between;
}
span.ogmob_colonneFlotte, span.ogmob_colonneFlotteMaColo, span.ogmob_colonneDetailsFlotte, span.ogmob_colonneDestination {
  display: flex;
  flex-direction: column;
  align-items: center;
}
span.ogmob_colonneFlotte {
  grid-column: 1;
}
span.ogmob_colonneFlotteMaColo {
  grid-column: 2;
  align-self: center;
}
span.ogmob_colonneDetailsFlotte {
  grid-column: 3;
  align-self: center;
}
span.ogmob_colonneDetailsFlotte span.tooltip {
  background: none;
  display: inline-flex;
  height: 100%;
  width: 100%;
}
span.ogmob_colonneTypeMission {
  grid-column: 4;
  display: flex;
  align-items: center;
}
span.ogmob_colonneDestination {
  grid-column: 5;
  align-self: center;
}
span.ogmob_colonneAction {
  grid-column: 6;
  display: flex;
  align-items: center;
  justify-self: end;
}
span.ogmob_colonneAction span.reversal a {
  height: 50px;
  width: max-content;
  background: none;
}
span.ogmob_colonneAction span.reversal a img, span.missionFleet img {
  height: 50px;
  width: auto;
  vertical-align: middle;
}
span.detailsFleet {
  align-self: center;
  padding-left: 10px;
  height: 50px;
}
span.missionFleet {
  height: 50px;
  vertical-align: middle;
}
span.arrivalTime {
  color: #0aa2c1;
}
#eventHeader, #eventFooter, #eventContent, #top {
  display: none;
}
`;
}
/*
----------------------------------
Menu droite - Colonies
----------------------------------
*/
if(1 === 1)
{
    let ogmob_sideColonieNode = document.createElement("div");
    ogmob_sideColonieNode.id = "ogmob_sideColonie";
    document.body.appendChild(ogmob_sideColonieNode);
    document.getElementById("ogmob_sideColonie").appendChild(document.getElementById('planetbarcomponent'));
    ogmob_parentNode = document.getElementById("planetList").querySelectorAll("div.smallplanet");
    ogmob_parentNode.forEach((ogmob_planeteColo) => {
        if(ogmob_planeteColo.querySelector("a.constructionIcon") === null)
        {
            ogmob_enfantNode = document.createElement('a');
            ogmob_enfantNode.className = 'constructionIconFaux';
            ogmob_enfantNode.style.visibility = 'hidden';
            ogmob_planeteColo.firstChild.nextSibling.after(ogmob_enfantNode);
        }
    });
    ogmob_css = ogmob_css +
`
#ogmob_sideColonie {
  position: fixed;
  top: 0;
  right: 0;
  display: none;
  flex-direction: column;
  width: max-content;
  height: calc(100% - 162px);
  border-left: 1px solid white;
  background-color: black;
  z-index: 100;
  overflow: auto;
  padding-left: 30px;
  padding-right: 30px;
  background: hsl(210deg 32% 9%);
}
#planetbarcomponent { width: 100% !important; }
#rechts {
  margin: 0px 0px 0px 0px !important;
  width: 100% !important;
  position: inherit !important;
  float: none !important;
}
#countColonies {
  background: #1c2025 !important;
  color: #FFF !important;
  position: relative !important;
  left: -30px;
  height: max-content !important;
  width: calc(100% + 60px) !important;
  font-size: 25px !important;
  margin: 10px 0px 0px 0px !important;
  padding: 10px 0px 10px 0px;
  line-height: inherit !important;
  display: flex !important;
  flex-direction: column !important;
  align-content: center !important;
  align-items: center !important;
}
#countColonies p {
  display: block !important;
  line-height: inherit !important;
  padding-bottom: 5px;
}
#planetList {
  display: flex !important;
  flex-direction: column !important;
  align-content: center !important;
  align-items: center !important;
  box-shadow: none !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: unset !important;
  width: max-content !important;
}
#planetList div.smallplanet {
  display: flex !important;
  margin: 0 !important;
  margin-top: 10px !important;
  flex-basis: max-content;
  height: max-content !important;
  width: unset !important;
  position: inherit !important;
  grid-column-gap: 0px !important;
}
#planetList div a.planetlink {
  height: max-content !important;
  width: unset !important;
  flex-basis: max-content;
  display: flex !important;
  flex-direction: column !important;
  align-content: center !important;
  align-items: center !important;
}
#planetList div a.planetlink img {
  height: 60px !important;
  width: 60px !important;
}
#planetList div a.planetlink span.planet-name, #planetList div a.planetlink span.planet-koords {
  font-size: inherit !important;
  line-height: inherit !important;
  margin: 0 !important;
  width: max-content !important;
  max-width: max-content !important;
}
#planetbarcomponent #norm .active span.planet-name, #planetbarcomponent #norm .active span.planet-koords {
  color: #9c0 !important;
  font-weight: 700 !important;
}
#planetbarcomponent #rechts #norm a.constructionIcon, #planetbarcomponent #rechts #norm a.constructionIconFaux {
  position: relative !important;
  top: 0 !important;
  left: -12px !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 12px;
  height: 12px;
  align-self: center;
}
#planetbarcomponent #rechts #norm a.constructionIcon span.icon12px {
  position: relative !important;
  width: 12px;
  height: 12px;
}
`;
}
/*
----------------------------------
Footer
----------------------------------
*/
if(1 === 1)
{
    let ogmob_Footer = document.createElement("div");
    ogmob_Footer.id = "ogmob_footer";
    let ogmob_FooterGrid = document.createElement("div");
    ogmob_FooterGrid.id = 'ogmob_footerGrid';
    ogmob_Footer.appendChild(ogmob_FooterGrid);
    document.body.appendChild(ogmob_Footer);
    var ogmob_colonneFooterImg;
    if(document.getElementById('menuTable') !== null)
    {
        var ogmob_menusFooter = document.getElementById("menuTable").querySelectorAll("li");
        ogmob_menusFooter.forEach((ogmob_menuFooter) => {
            if(ogmob_menuFooter.querySelector('a.ipiHintable') === null)
            {
                return;
            }
            ogmob_colonneFooterImg = document.createElement("img");
            if(ogmob_menuFooter.querySelector('a.ipiHintable').dataset.ipiHint !== undefined)
            {
                switch(ogmob_menuFooter.querySelector('a.ipiHintable').dataset.ipiHint)
                {
                        // Vue d'ensemble
                    case 'ipiToolbarOverview':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarOverview"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_vueFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/nrbTVgff/vue-ensemble.png';
                        if(document.getElementById("planetList") !== null)
                        {
                            if(document.getElementById("planetList").querySelector('div.hightlightPlanet') !== null)
                            {
                                if(document.getElementById("planetList").querySelector('div.hightlightPlanet').querySelector('span.planet-name') !== null)
                                {
                                    ogmob_parentNode.querySelector('span.textlabel').style.display = 'none';
                                    ogmob_enfantNode = document.createElement("span");
                                    ogmob_enfantNode.className = 'textlabel';
                                    ogmob_enfantNode.innerHTML = document.getElementById("planetList").querySelector('div.hightlightPlanet').querySelector('span.planet-name').innerHTML;
                                    ogmob_parentNode.appendChild(ogmob_enfantNode);
                                }
                            }
                        }
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        // Ressource
                    case 'ipiToolbarResourcebuildings':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarResourcebuildings"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_ressourceFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/ZYMz6k1F/ressources.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        // Forme de vie
                    case 'ipiToolbarLifeformbuildings':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarLifeformbuildings"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_fdvFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/90RrhtyK/forme-de-vie.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        // Installation
                    case 'ipiToolbarFacilities':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarFacilities"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_installationFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/vHPQGSQK/installation.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        //Recherche
                    case 'ipiToolbarResearch':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarResearch"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_rechercheFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/C117HxtF/recherche.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        // Chantier spatial
                    case 'ipiToolbarShipyard':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarShipyard"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_chantierFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/02rZFn89/chantier-spatial.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        // Défense
                    case 'ipiToolbarDefense':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarDefense"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_defenseFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/rmw0YhST/defense.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        // Marchand
                    case 'ipiToolbarTrader':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarTrader"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_marchandFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/Vkc3Qqth/marchand.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        // Flotte
                    case 'ipiToolbarFleet':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarFleet"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_flotteFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/L5cGsfbn/flotte.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        // Galaxie
                    case 'ipiToolbarGalaxy':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarGalaxy"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_galaxieFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/MHbr9pxX/galaxie.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        // Alliance
                    case 'ipiToolbarAlliance':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarAlliance"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_allianceFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/t4PmBYmz/alliance.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                        // Empire
                    case 'ipiToolbarEmpire':
                        ogmob_parentNode = ogmob_menuFooter.querySelector('[data-ipi-hint="ipiToolbarEmpire"]').cloneNode(true);
                        ogmob_parentNode.id = 'ogmob_empireFooter';
                        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/rp713J00/empire.png';
                        ogmob_parentNode.className = '';
                        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
                        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
                        break;
                    default:
                        break;
                }
            }
        });
        // Flêche side colo
        ogmob_parentNode = document.createElement("div");
        ogmob_parentNode.id = 'ogmob_sideColoFooter';
        ogmob_colonneFooterImg = document.createElement("img");
        ogmob_enfantNode = document.createElement("span");
        ogmob_enfantNode.id = 'ogmob_sensFlecheFooter';
        ogmob_enfantNode.className = 'textlabel';
        ogmob_enfantNode.innerHTML = '<<';
        ogmob_parentNode.appendChild(ogmob_enfantNode);
        ogmob_colonneFooterImg.src = 'https://i.postimg.cc/rp713J00/empire.png';
        if(document.getElementById("planetList") !== null)
        {
            if(document.getElementById("planetList").querySelector('div.hightlightPlanet') !== null)
            {
                if(document.getElementById("planetList").querySelector('div.hightlightPlanet').querySelector('img.planetPic') !== null)
                {
                    ogmob_colonneFooterImg.src = document.getElementById("planetList").querySelector('div.hightlightPlanet').querySelector('img.planetPic').src;
                }
            }
        }
        ogmob_parentNode.insertBefore(ogmob_colonneFooterImg, ogmob_parentNode.firstChild);
        document.getElementById("ogmob_footerGrid").appendChild(ogmob_parentNode);
        document.getElementById("ogmob_sideColoFooter").onclick = ogmob_sideColonie;
    }
    ogmob_css = ogmob_css +
`
#ogmob_footer {
  position: fixed;
  bottom: -2px;
  left: 0px;
  width: 100%;
  overflow: hidden;
  z-index: 100;
}
#ogmob_footerGrid {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto;
  width: calc(100% - 4px);
}
#ogmob_footerGrid a, #ogmob_footerGrid div {
  display: flex;
  flex-direction: column;
  height: 60px;
  align-items: center;
  align-content: center;
  padding-top: 10px;
  padding-bottom: 10px;
  text-decoration: none;
  border-top: 2px solid white;
  border-left: 2px solid white;
  border-right: 2px solid white;
  border-radius: 20px 20px 0px 0px;
  background-color: #1c2025;
  color: #FFF;
  cursor: pointer;
}
#ogmob_footerGrid a img, #ogmob_footerGrid div img {
  height: 27px;
  width: 27px;
}
#ogmob_vueFooter {
  grid-row: 1;
  grid-column: 1;
}
#ogmob_ressourceFooter {
  grid-row: 1;
  grid-column: 2;
}
#ogmob_fdvFooter {
  grid-row: 1;
  grid-column: 3;
}
#ogmob_installationFooter {
  grid-row: 1;
  grid-column: 4;
}
#ogmob_rechercheFooter {
  grid-row: 1;
  grid-column: 5;
}
#ogmob_allianceFooter {
  grid-row: 1;
  grid-column: 6;
}
#ogmob_sideColoFooter {
  grid-row: 1;
  grid-column: 7;
}
#ogmob_marchandFooter {
  grid-row: 2;
  grid-column: 1;
}
#ogmob_chantierFooter {
  grid-row: 2;
  grid-column: 2;
}
#ogmob_defenseFooter {
  grid-row: 2;
  grid-column: 3;
}
#ogmob_flotteFooter {
  grid-row: 2;
  grid-column: 4 / span 2;
}
#ogmob_galaxieFooter {
  grid-row: 2;
  grid-column: 6;
}
#ogmob_empireFooter {
  grid-row: 2;
  grid-column: 7;
}
#ogmob_marchandFooter, #ogmob_chantierFooter, #ogmob_defenseFooter, #ogmob_flotteFooter, #ogmob_galaxieFooter, #ogmob_empireFooter {
  border-radius: 0px !important;
}
#left, #leftMenu, #chatbarcomponent {
  display: none;
}
`;
}
/*
----------------------------------
Milieu
----------------------------------
*/
if(1 === 1)
{
    //Vue d'ensemble
    if(document.getElementById("middle") !== null)
    {
        document.body.insertBefore(document.getElementById("middle"), document.getElementById("pageContent"));
        if(document.getElementById("planet") !== null)
        {
            document.getElementById("middle").style.background = window.getComputedStyle(document.getElementById("planet")).background;
        }
        // Boutique / Inventaire
        if(document.getElementById("detail") !== null)
        {
            let ogmob_detailBoutique = new MutationObserver(mutationRecords => {
                //console.log(mutationRecords);
                if (document.getElementById("activeBuffDetails") !== null)
                {
                    document.getElementById("planet").appendChild(document.getElementById("activeBuffDetails"));
                    document.getElementById("buffBar").addEventListener("click", ogmob_boutiqueVueEnsemble);
                    document.getElementById("close").addEventListener("click", ogmob_boutiqueVueEnsemble);
                    ogmob_detailBoutique.disconnect();
                }
            });
            ogmob_detailBoutique.observe(document.getElementById("detail"), {
                childList: true, // observer les enfants directs
                attributes: false,
                subtree: true, // et les descendants aussi
                characterDataOldValue: false // transmettre les anciennes données au callback
            });
        }
        // Production en cours
        if(document.getElementById("productionboxBottom") !== null)
        {
            document.getElementById("productionboxBottom").querySelectorAll('div.boxColumn').forEach((ogmob_colonneProduction) => {
                ogmob_colonneProduction.querySelectorAll('div.injectedComponent').forEach((ogmob_elementProduction) => {
                    document.getElementById("productionboxBottom").appendChild(ogmob_elementProduction);
                });
            });
        }
    //Primes

    }
    ogmob_css = ogmob_css +
`
/* Milieu */
#middle {
  width: 98%;
  margin-left: 1%;
  float: none;
  background-size: cover !important;
  background-position: bottom !important;
}
#overviewcomponent, #inhalt, #planet, #detailWrapper, #header_text, #planetdata, #productionboxBottom {
  width: 100%;
  font-size: 25px;
}
#inhalt div.c-left, #inhalt div.c-right {
  display: none;
}
/* Header vue d'ensemble (détails planète + boutique) */
#planet {
  margin: 0;
  height: max-content;
  background: none;
  background-image: none !important;
}
#detailWrapper {
  position: relative;
  height: max-content;
  display: flex;
  flex-direction: column;
}
#detailWrapper #header_text {
  position: relative;
  height: max-content;
  flex-basis: max-content;
  left: unset;
  bottom: unset;
  top: unset;
  right: unset;
  margin: 0;
  padding: 0;
  padding-top: 10px;
  display: block !important;
  opacity: 1 !important;
}
#header_text h2 {
  height: max-content;
  margin: 0;
  padding: 0;
  float: none;
  width: unset;
  text-align: center;
}
#header_text h2 a {
  display: flex;
  float: none !important;
  width: unset !important;
  justify-content: center;
}
#header_text h2 a p, #header_text h2 a span, #header_text h2 a img {
  flex-basis: max-content;
  float: none !important;
  max-width: unset;
}
#header_text h2 a img {
  opacity: 1;
  height: 30px;
}

/* Vue d'ensemble */
#planetdata {
  float: none;
  height: 259px;
  margin: 0;
  padding: 0;
}
#planetdata div.overlay {
  display: none;
}
#planetDetails {
  height: 172px !important;
}
#planetDetails table {
  position: relative !important;
}
#planetOptions {
  height: 60px !important;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-around;
}
#planetOptions div.planetMoveStart, #planetOptions a.dark_highlight_tablet {
  float: none !important;
}
#planetOptions div.planetMoveStart span.planetMoveIcons {
  float: none !important;
}
#buffBar {
  position: relative;
  display: block;
  height: 60px;
  width: unset;
  left: unset;
  right: unset;
  top: unset;
  bottom: unset;
  background: none;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-around;
}
#buffBar div.add_item, #buffBar div.anythingSlider {
  flex-basis: max-content;
  width: unset !important;
  float: none !important;
  display: unset !important;
  height: 32px !important;
  margin: 0 !important;
  padding: 0 !important;
}
#buffBar .anythingWindow {
  display: inline-flex !important;
  margin: 0 !important;
  padding: 0 !important;
}
#buffBar .active_items {
  position: relative;
  width: max-content !important;
  height: max-content !important;
  display: unset !important;
  margin: 0 !important;
  padding: 0 !important;
}
#buffBar .active_items li {
  position: relative;
  width: max-content !important;
  height: max-content !important;
  float: none !important!
  display: unset !important;
}
#buffBar .active_items li div a {
  display: unset !important;
}

/* Boutique de la vue d'ensemble */
#detailWrapper #detail {
  display: none !important;
}
#activeBuffDetails {
  height: max-content;
  width: 100%;
  display: flex;
  flex-direction: column;
}
#activeBuffDetails #close {
  background: none;
  position: absolute;
  right: 10px;
  float: none;
  display: block;
  text-decoration: none;
}
#activeBuffDetails #close:before {
  content: 'X';
  height: 50px;
  width: 50px;
  font-size: 40px;
  color: white;
}
#activeBuffDetails .detail_screen_h2 {
  padding: 10px 0 10px 40px;
  line-height: inherit;
  height: max-content;
  width: max-content;
}
#activeBuffDetails #js_activeItemSliderBox {
  height: max-content !important;
  top: 0;
  left: 0;
  width: 100%;
  float: none;
}
#activeBuffDetails #js_activeItemSliderBox div.anythingSlider {
  padding: 0;
  height: max-content !important;
}
#activeBuffDetails #js_activeItemSliderBox div.anythingSlider .anythingWindow {
  height: max-content !important;
  width: 100% !important;
  left: 0;
  top: 0;
}
#activeBuffDetails #js_activeItemSlider {
  position: relative;
  height: max-content !important;
  width: 100% !important;
  display: flex;
  flex-flow: wrap;
  left: 0 !important;
  justify-content: center;
}
#activeBuffDetails #js_activeItemSlider li {
  flex-basis: max-content;
  height: max-content !important;
  width: unset !important;
  float: none;
  display: flex;
}
#activeBuffDetails #js_activeItemSlider li span {
  font-size: 25px;
  display: inline-block;
  height: max-content !important;
  margin: 0;
}
#activeBuffDetails #js_activeItemSliderBox div.anythingSlider .anythingControls {
  display: none !important;
}
#activeBuffDetails .item_img {
  margin: 0 5px 0 5px;
  float: none;
}
#activeBuffDetails .item_img, #activeBuffDetails .item_img_box {
  height: max-content !important;
}
#activeBuffDetails .item_img a {
  display: inline-flex;
}
#activeBuffDetails .item_img a.active, #activeBuffDetails .item_img a:hover {
  background: none;
}
#activeBuffDetails .shop_link {
  font-size: 25px;
  margin: 0px 32px 0 0;
}
#activeBuffDetails #js_activeItemSliderBox div.anythingSlider .arrow {
  display: none !important;
}
#activeBuffDetails .active_item_details {
  margin: 0;
  width: 100%;
}
#activeBuffDetails h2, #activeBuffDetails .active_item_details p, #activationButton span {
  font-size: 25px;
  line-height: inherit;
}
#activeBuffDetails #itemDetailBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#activeBuffDetails #itemDetailBox .item_detail_content {
  width: unset !important;
  height: max-content !important;
  flex-grox: 3;
}
#activeBuffDetails #activationButton {
  background: green !important;
  border: 1px solid black;
  border-radius: 20px;
  width: max-content;
  height: max-content !important;
  margin: 0;
  left: 0;
  padding: 5px;
  flex-grox: 1;
}
#activeBuffDetails #activationButton span {
  width: max-content;
  height: max-content;
  padding: 5px;
}

/* Vue de la production */
#productionboxBottom {
  flex-wrap: wrap;
  justify-content: space-between;
}
#productionboxBottom .boxColumn {
  display: none;
}
#productionboxBottom .injectedComponent {
  flex-basis: max-content;
  flex-grow: 1;
}
#productionboxbuildingcomponent, #productionboxlfbuildingcomponent, #productionboxresearchcomponent, #productionboxlfresearchcomponent, #productionboxshipyardcomponent, #productionboxBottom div.content-box-s {
  width: unset;
  margin-bottom: 24px;
}
#productionboxBottom table td a.dark_highlight {
  padding: 5px;
}
#productionboxBottom div.content-box-s .header, #productionboxBottom div.content-box-s .content, #productionboxBottom div.content-box-s .footer {
  height: max-content;
  background: none;
  opacity: 0.99;
  margin-top: 0 !important;
}
#productionboxBottom div.content-box-s .header:before, #productionboxBottom div.content-box-s .content:before, #productionboxBottom div.content-box-s .footer:before {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  opacity: 0.5;
  z-index: -1;
}
#productionboxBottom div.content-box-s .header:before {
  top: 0;
  height: 56px;
  background: url("//gf1.geo.gfsrv.net/cdnfe/b9de2f5b06c823d628d22c4067ee35.gif") no-repeat;
  background-size: cover;
}
#productionboxBottom div.content-box-s .content:before {
  top: 56px;
  height: calc(100% - 56px);
  background: url("//gf3.geo.gfsrv.net/cdnea/bd764e9b39a1a48ad708039fda1bde.gif") repeat;
  background-size: contain;
}
#productionboxBottom div.content-box-s .footer:before {
  bottom: -21px;
  height: 21px;
  background: url("//gf3.geo.gfsrv.net/cdn23/174d5c09f617701fcaf1664a414869.gif") no-repeat;
  background-size: cover;
}
#productionboxBottom div.content-box-s .header h3 {
  font-size: 25px;
  width: 100%;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 10px;
}
#productionboxBottom div.content-box-s div {
  font-size: 25px;
  width: unset;
}
#productionboxBottom div.content-box-s table {
  width: 100%;
  padding: 15px;
  text-align: center;
}
#productionboxBottom div.content-box-s table td.first {
  text-align: center;
}
#productionboxBottom div.content-box-s table a.abortNow {
  display: none;
}
#productionboxBottom img.queuePic {
  height: 60px;
  width: 60px;
}

/* Fenêtre Abandonner/Renommer */
#abandonplanet {
  width: fit-content;
  padding: 0 15px 15px 15px;
}
#abandonplanet img.float_left {
  margin-right: 20px;
}
#abandonplanet #planetMaintenance a.tooltipHTML {
  height: 60px;
  width: 60px;
  margin: 0;
  margin-right: 10px;
  padding: 0;
  background: none;
  text-decoration: none;
  border: 2px solid white;
  line-height: 60px !important;
  border-radius: 20px;
  text-align: center;
}
#abandonplanet #planetMaintenance a.tooltipHTML:after {
  content: '?';
}
#abandonplanet input {
  width: max-content;
  height: 60px !important;
}
#abandonplanet #block {
  height: 60px;
  vertical-align: middle;
  display: table-cell;
  float: none;
}
#abandonplanet #validate {
  width: unset;
}

/* Primes */
#rewardscomponent {
  width: 100%;
}
#rewardscomponent #planet {
  display: none;
}
#rewardscomponent #buttonz {
  width: 100%;
}
#rewardscomponent #buttonz .content, #rewardscomponent #buttonz .header {
  background: none;
}
#rewardscomponent #buttonz .rewardlist {
  background: rgba(31, 38, 48, 0.7);
}
#rewardscomponent .rewardlistimg {
  width: calc(100% - 60px);
  margin: 0;
  background: none;
}
#rewardscomponent .rewardlist-item-text {
  width: calc(100% - 120px - 30px);
  margin: 0 0 0 120px;
  padding: 0;
  background: rgba(31, 38, 48, 0.7);
  padding: 15px;
}
#rewardscomponent .rewardlist-item-wrapper {
  background: none;
  padding: 0;
}
#rewardscomponent .rewardlist-item-wrapper > p {
  width: 100%;
}
#rewardscomponent .rewardlist-item-bottom {
  background: none;
}

/* Evènement */
#rewardingcomponent {
  width: 100%;
}
#rewardingcomponent #planet {
  height: max-content;
  padding-bottom: 20px;
  padding-top: 20px;
}
#rewardingcomponent #rewardings .header {
  background: rgba(31, 38, 48, 0.7);
}
#rewardingcomponent .content {
  margin: 0;
  padding: 0;
  background: rgba(31, 38, 48, 0.7);
}
#rewardingcomponent .rewardlist {
  background: none;
}
#rewardingcomponent #buttonTasks {
  font-size: 25px;
  padding: 15px !important;
}
#rewardingcomponent .tierlist .btn_blue {
  font-size: 25px;
  height: 60px;
  line-height: 60px !important;
  margin: 0;
  padding: 0 15px 0 15px !important;
}
#rewardings #rewarddescription, #rewardings #header, #rewardings #commandingstaff, #rewardings #select_one {
  font-size: 25px;
}
#rewardings .rewardlist .rewardlist_wrapper .rewardContent {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#rewardings .tritiumstage {
  position: unset !important;
  font-size: 25px;
  width: max-content;
  background: rgba(31, 38, 48, 0.7);
  padding: 0 15px 0 15px;
}
#rewardings .rewardlist-item {
  width: 100%;
}
#rewardings .rewardlistimage {
  width: calc(100% - 60px);
  margin: 0;
  background: none !important;
}
#rewardings .rewardlist-item-text {
  padding: 0 0 0 0;
  margin: 0 0 0 90px;
  width: calc(100% - 90px - 60px);
  background: rgba(31, 38, 48, 0.7);
}
#rewardings .rewardlist-item-wrapper {
  background: none;
}
#rewardings .rewardlist-item-wrapper > p {
  width: 100%;
}
#rewardings .rewardlist-item-bottom {
  background: none;
}
#rewardings a.tier-button {
  width: max-content;
  padding: 0 15px 0 15px;
  background: green;
  border: 2px solid white;
  border-radius: 20px;
  height: max-content;
}
#rewardings #header, #rewardings #select_one {
  margin: 0;
  height: max-content;
}
#rewardings .normalRewards, #rewardings .additionalRewards {
  width: 100%;
  justify-content: center;
}
#rewardings .singleReward {
  font-size: 25px;
  width: max-content !important;
  line-height: normal;
}


/* Arbre technologique */
#technologytree nav li a {
  font-size: 25px;
}
#technologytree .content.technologies > ul > li {
  height: 60px;
  line-height: normal;
  margin-bottom: 15px;
  max-height: max-content;
}
#technologytree .content.technologies a.technology, #technologytree .content.technologies a.prerequisites {
  font-size: 25px;
  margin: 0;
  height: max-content;
  min-height: 60px;
  line-height: 60px;
}
#technologytree .content.technologyinformation > .information {
  margin-left: 0px;
}
#technologytree .content.technologyinformation > .information > p, #technologytree .content.technologyinformation > .information > li {
  width: calc(100% - 214px);
  max-width: calc(100% - 214px);
  margin-left: 214px;
  min-height: 214px;
}




#rewardingcomponent .footer, #rewardingcomponent .placeholder {
  display: none;
}



`;
}




ogmob_css = ogmob_css +
`
/* CSS Ogame modifié */
html, body {
  height: max-content;
  margin-bottom: 162px;
  font-size: 25px!important;
  line-height: normal;
}
.eventFleet td, .allianceAttack td {
  font-size: inherit !important;
}
div.tpd-content-wrapper h1, div.tpd-content, p, span, input, textarea, div.htmlTooltip, div.htmlTooltip tr, tr, td, th, td a  {
  line-height: normal !important;
  font-size: 25px !important;
}
input, textarea {
  touch-action: none;
}
h1, h2, h3 {
  font-size: 25px!important;
  line-height: normal;
}

/* Fenêtres (notes, chercher, ...) */
div.ui-dialog {
  width: calc(98% - 30px) !important;
  height: calc(98% - 72px - 165px) !important;
  max-height: max-content;
  left: 1% !important;
  top: calc(72px) !important;
  margin: 0 !important;
  padding: 0px 15px 0px 15px;
  overflow: auto;
}
div.ui-dialog button.ui-dialog-titlebar-close span.ui-icon-closethick {
  background: none;
}
div.ui-dialog button.ui-dialog-titlebar-close {
  right: 2em !important;
}
div.ui-dialog button.ui-dialog-titlebar-close:before {
  content: 'X';
  color: white;
  font-size: 40px !important;
}
div.ui-dialog input {
  height: 60px;
  margin: 0;
  padding: 0;
}
div.ui-dialog .dropdown {
  height: 60px;
  background: #13181D;
}
div.ui-dialog .dropdown::before {
  background-image: none;
}
div.ui-dialog .dropdown a {
  background: none;
}
div.ui-dialog .dropdown a::after {
  content: "\\0023F7";
  right: 0;
  position: absolute;
}
.ui-dialog .ui-dialog-content, #popupContent {
  font-size: 25px;
  line-height: normal;
}

/* Mission */
#ipioverviewlayer {
  max-width: unset;
  width: 100%;
  padding-bottom: unset;
  font-size: 25px;
  line-height: normal;
}
#ipioverviewlayer #ipiOverviewHeadbar {
  font-size: 25px;
  line-height: normal;
}
#ipioverviewlayer #ipiOverviewChapters .ipiChapterItem {
  font-size: 25px;
}
#ipioverviewlayer #ipiOverviewChapterTitle {
  font-size: 25px;
  height: max-content;
}
#ipioverviewlayer .ipiTaskItem .ipiTaskItemHeader {
  height: 60px;
  align-items: center;
}
#ipioverviewlayer .ipiTaskItem .ipiTaskItemHeader div {
  height: 100%;
  line-height: 60px;
}
#ipioverviewlayer .ipiTaskItem .ipiTaskItemDescriptionInner {
  width: calc(100% - 100px - 20px - 20px);
}
#ipioverviewlayer .ipiTaskItem .ipiActionItem {
  max-width: unset;
}
#ipioverviewlayer ul.ipiRewardsList {
  justify-content: space-between;
}
#ipioverviewlayer .ipiRewardsList span {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
#ipioverviewlayer .ipiOverviewCollectRewards {
  height: 60px;
  line-height: 60px;
  width: max-content;
  padding-left: 20px;
  padding-right: 20px;
  background: gray;
  border: 2px solid white;
  border-radius: 20px;
}
#ipiOverviewChapterRewards {
  flex-direction: column;
  width: 100%;
  left: 0;
  gap: 10px;
  padding: 0;
}

/* Note */
#notices #newNote {
  display: block;
  height: 60px;
}
#notices #newNote span {
  line-height: 60px !important;
}
#notices table tr {
  height: max-content;
  display: inline-block;
  padding-bottom: 15px;
  width: 100%;
}
#notices th.spacer, #notices tbody tr td:first-child {
  min-width: 60px;
  width: 60px;
}
#notices th.subject, #notices tbody tr td.subject {
  width: 100%;
  padding-left: 20px;
}
#notices th.date, #notices tbody tr td.date {
  min-width: 300px;
  width: 300px;
}
#notices tbody tr td {
  background: #13181D;
}
#notices tbody tr td.date {
  text-align: center;
  border-left: 2px solid #848484;
}
#notices input[type="checkbox"]
{
  height: 60px !important;
  width: 60px !important;
  margin: 0;
  padding: 0;
}
#notices table.createnote th.textTop {
  min-width: max-content;
  width: max-content;
}
#notices textarea {
  width: 100%;
}
ul.dropdown * {
  line-height: 60px !important;
  font-size: 25px !important;
}

/* Chercher */
#search .contentz {
  width: 100% !important;
}
#search tr {
  height: 60px;
}
#search table.searchresults tr:nth-last-child(2) {
  display: none;
}
#search td.action a {
  width: 60px;
  height: 60px;
}
#search td.action a span.icon {
  height: 60px;
  width: 60px;
  background-size: cover;
}
#search td.action a span.icon_chat {
  background-position: 0 -3483px;
}
#search td.action a span.icon_user {
  background-position: 0 -3603px;
}
#search td.pagebar a.ajaxSearch, #search td.pagebar b {
  width: 60px;
  height: 60px;
  display: inline-block;
  line-height: 60px !important;
}
`;

GM_addStyle(ogmob_css);

function ogmob_openNav() {
    if(window.getComputedStyle(document.getElementById("ogmob_sideNav")).display == "block")
    {
        document.getElementById("ogmob_sideNav").style.display = "none";
        document.body.onclick = '';
    }
    else
    {
        document.getElementById("ogmob_sideNav").style.display = "block";
        if(window.getComputedStyle(document.getElementById("ogmob_sideColonie")).display == "flex")
        {
            document.getElementById("ogmob_sideColonie").style.display = "none";
            document.getElementById("ogmob_sensFlecheFooter").innerHTML = "<<";
        }
        event.stopPropagation();
        document.body.onclick = ogmob_openNav;
    }
}
function ogmob_sideColonie() {
    if(window.getComputedStyle(document.getElementById("ogmob_sideColonie")).display == "flex")
    {
        document.getElementById("ogmob_sideColonie").style.display = "none";
        document.getElementById("ogmob_sensFlecheFooter").innerHTML = "<<";
        document.body.onclick = '';
    }
    else
    {
        document.getElementById("ogmob_sideColonie").style.display = "flex";
        document.getElementById("ogmob_sensFlecheFooter").innerHTML = ">>";
        if(window.getComputedStyle(document.getElementById("ogmob_sideNav")).display == "block")
        {
            document.getElementById("ogmob_sideNav").style.display = "none";
        }
        event.stopPropagation();
        document.body.onclick = ogmob_sideColonie;
    }
}
function ogmob_boutiqueVueEnsemble() {
    if(window.getComputedStyle(document.getElementById("activeBuffDetails")).display === "flex" || document.getElementById("activeBuffDetails").style.display === 'flex')
    {
        document.getElementById("activeBuffDetails").style.display = 'none';
    }
    else
    {
        document.getElementById("activeBuffDetails").style.display = 'flex';
    }
    event.stopPropagation();
}

// Compatibilité OCGLight
if(document.querySelector('span.ogl_leftMenuIcon') !== null)
{
/*
----------------------------------
Menu de navigation
----------------------------------
*/
    if(1 === 1)
    {
        var ogmob_OCGLight_Css =
`
#ogmob_sideNav li.ogl_timeZone, #ogmob_sideNav li.ogl_planetsCount, #ogmob_sideNav li.ogl_ping {
  display: none !important;
}
div#banner_skyscraper {
  transform: none !important;
}
`;
    }
/*
----------------------------------
Ressources
----------------------------------
*/
    if(1 === 1)
    {
        // Titre des tootlips ressources
        // Métal
        let ogmob_mutMetal = new MutationObserver(mutationRecords => {
            //console.log(mutationRecords);
            if(document.getElementById("metal_box").dataset.title !== null && document.getElementById("metal_box").dataset.title !== undefined)
            {
                document.getElementById("metal_box").dataset.title = document.getElementById("metal_box").dataset.title.replace('Métal|<table class="resourceTooltip">', '<table id="resourceTooltipMetal" class="resourceTooltip"><tr><td colspan="2" style="text-align:center;">Métal</td></tr>');
                ogmob_mutMetal.disconnect();
            }
        });
        ogmob_mutMetal.observe(document.getElementById("metal_box"), {
            childList: false, // observer les enfants directs
            attributes: true,
            subtree: false, // et les descendants aussi
            characterDataOldValue: false // transmettre les anciennes données au callback
        });
        // Cristal
        let ogmob_mutCristal = new MutationObserver(mutationRecords => {
            //console.log(mutationRecords);
            if(document.getElementById("crystal_box").dataset.title !== null && document.getElementById("crystal_box").dataset.title !== undefined)
            {
                document.getElementById("crystal_box").dataset.title = document.getElementById("crystal_box").dataset.title.replace('Cristal|<table class="resourceTooltip">', '<table id="resourceTooltipCristal" class="resourceTooltip"><tr><td colspan="2" style="text-align:center;">Cristal</td></tr>');
                ogmob_mutCristal.disconnect();
            }
        });
        ogmob_mutCristal.observe(document.getElementById("crystal_box"), {
            childList: false, // observer les enfants directs
            attributes: true,
            subtree: false, // et les descendants aussi
            characterDataOldValue: false // transmettre les anciennes données au callback
        });
        // Deuterium
        let ogmob_mutDeut = new MutationObserver(mutationRecords => {
            //console.log(mutationRecords);
            if(document.getElementById("deuterium_box").dataset.title !== null && document.getElementById("deuterium_box").dataset.title !== undefined)
            {
                document.getElementById("deuterium_box").dataset.title = document.getElementById("deuterium_box").dataset.title.replace('Deutérium|<table class="resourceTooltip">', '<table id="resourceTooltipDeut" class="resourceTooltip"><tr><td colspan="2" style="text-align:center;">Deutérium</td></tr>');
                ogmob_mutDeut.disconnect();
            }
        });
        ogmob_mutDeut.observe(document.getElementById("deuterium_box"), {
            childList: false, // observer les enfants directs
            attributes: true,
            subtree: false, // et les descendants aussi
            characterDataOldValue: false // transmettre les anciennes données au callback
        });
        // Energie
        let ogmob_mutEnergie = new MutationObserver(mutationRecords => {
            //console.log(mutationRecords);
            if(document.getElementById("energy_box").dataset.title !== null && document.getElementById("energy_box").dataset.title !== undefined)
            {
                document.getElementById("energy_box").dataset.title = document.getElementById("energy_box").dataset.title.replace('Energie|<table class="resourceTooltip">', '<table id="resourceTooltipEnergie" class="resourceTooltip"><tr><td colspan="2" style="text-align:center;">Energie</td></tr>');
                ogmob_mutEnergie.disconnect();
            }
        });
        ogmob_mutEnergie.observe(document.getElementById("energy_box"), {
            childList: false, // observer les enfants directs
            attributes: true,
            subtree: false, // et les descendants aussi
            characterDataOldValue: false // transmettre les anciennes données au callback
        });
        // Population
        let ogmob_mutPop = new MutationObserver(mutationRecords => {
            //console.log(mutationRecords);
            if(document.getElementById("population_box").dataset.title !== null && document.getElementById("population_box").dataset.title !== undefined)
            {
                document.getElementById("population_box").dataset.title = document.getElementById("population_box").dataset.title.replace('Population|<table class="resourceTooltip">', '<table id="resourceTooltipPop" class="resourceTooltip"><tr><td colspan="2" style="text-align:center;">Population</td></tr>');
                ogmob_mutPop.disconnect();
            }
        });
        ogmob_mutPop.observe(document.getElementById("population_box"), {
            childList: false, // observer les enfants directs
            attributes: true,
            subtree: false, // et les descendants aussi
            characterDataOldValue: false // transmettre les anciennes données au callback
        });
        // Nourriture
        let ogmob_mutNourriture = new MutationObserver(mutationRecords => {
            //console.log(mutationRecords);
            if(document.getElementById("food_box").dataset.title !== null && document.getElementById("food_box").dataset.title !== undefined)
            {
                document.getElementById("food_box").dataset.title = document.getElementById("food_box").dataset.title.replace('Nourriture|<table class="resourceTooltip">', '<table id="resourceTooltipNourriture" class="resourceTooltip"><tr><td colspan="2" style="text-align:center;">Nourriture</td></tr>');
                ogmob_mutNourriture.disconnect();
            }
        });
        ogmob_mutNourriture.observe(document.getElementById("food_box"), {
            childList: false, // observer les enfants directs
            attributes: true,
            subtree: false, // et les descendants aussi
            characterDataOldValue: false // transmettre les anciennes données au callback
        });
        // Anti-matière
        let ogmob_mutAntiMa = new MutationObserver(mutationRecords => {
            //console.log(mutationRecords);
            if(document.getElementById("darkmatter_box").dataset.title !== undefined && document.getElementById("darkmatter_box").dataset.title !== undefined)
            {
                document.getElementById("darkmatter_box").dataset.title = document.getElementById("darkmatter_box").dataset.title.replace('Antimatière (AM)|<table class="resourceTooltip">', '<table id="resourceTooltipAntiMa" class="resourceTooltip"><tr><td colspan="2" style="text-align:center;">Antimatière</td></tr>');
                ogmob_mutAntiMa.disconnect();
            }
        });
        ogmob_mutAntiMa.observe(document.getElementById("food_box"), {
            childList: false, // observer les enfants directs
            attributes: true,
            subtree: false, // et les descendants aussi
            characterDataOldValue: false // transmettre les anciennes données au callback
        });
    ogmob_OCGLight_Css = ogmob_OCGLight_Css +
`
#resourcesbarcomponent #resources div.resource_tile div.resource div.resourceIcon div.ogl_storage {
  visibility: hidden;
}
#darkmatter_box a.overlay img {
  display: inherit;
}
.resourceTooltip {
  position: absolute;
  top: -2px;
  width:max-content;
  background:var(--p3);
  border-image:var(--uigradient) 1;
  border-style:solid;
  border-width:2px 2px 2px 2px;
  margin: 0!important;
  padding: 5px;
}
#resourceTooltipMetal {
  left: 0px;
}
#resourceTooltipCristal {
  left: -10px;
}
#resourceTooltipDeut {
  left: -50px;
}
#resourceTooltipEnergie {
  right: -100px;
}
#resourceTooltipPop {
  right: -50px;
}
#resourceTooltipNourriture {
  right: -10px;
}
#resourceTooltipAntiMa {
  right: 0px;
}
`;
    }
/*
----------------------------------
Menu droite - Colonies
----------------------------------
*/
    if(1 === 1)
    {
        var ogmob_tooltipsFlotteColo;
        var ogmob_tooltipImgFlotteColo;

        let ogmob_mutTooltipsFlotte = new MutationObserver(mutationRecords => {
            //console.log(mutationRecords);
            ogmob_tooltipsFlotteColo = document.getElementById("planetList").querySelectorAll("div.smallplanet");
            ogmob_tooltipsFlotteColo.forEach((ogmob_tooltipFlotteColo) => {
                if(ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight") !== null)
                {
                    if(ogmob_tooltipFlotteColo.querySelector("div.ogl_stock") !== null)
                    {
                        //ogmob_tooltipFlotteColo.querySelector("div.ogl_stock").parentNode.after(ogmob_tooltipFlotteColo.querySelector("div.ogl_stock"));
                        ogmob_enfantNode = ogmob_tooltipFlotteColo.querySelector("div.ogl_stock").cloneNode(true);
                        ogmob_enfantNode.className = 'ogmob_ogl_stock';
                        ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").parentNode.insertBefore(ogmob_enfantNode, ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight"));
                        ogmob_enfantNode = document.createElement('div');
                        ogmob_enfantNode.className = 'ogmob_ogl_faux';
                        ogmob_enfantNode.innerHTML = '555.5 k';
                        ogmob_enfantNode.style.visibility = 'hidden';
                        ogmob_enfantNode.style.lineHeight = '0';
                        ogmob_tooltipFlotteColo.querySelector("div.ogmob_ogl_stock").appendChild(ogmob_enfantNode);
                    }
                    if(parseInt(ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType) < 1 || ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '11' || ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '12' || ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '13' || ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '14' || parseInt(ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType) > 16)
                    {
                        ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/44SrG4Xw/Flotte-Mission-1.png';
                        ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").style.visibility = 'hidden';
                    }
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '1' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/44SrG4Xw/Flotte-Mission-1.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '2' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/xJfKKWWL/Flotte-Mission-2.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '3' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/ZBw6jwS2/Flotte-Mission-3.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '4' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/sQWR4N7D/Flotte-Mission-4.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '5' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/CnHTWnc3/Flotte-Mission-5.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '6' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/svsR5KXs/Flotte-Mission-6.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '7' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/qzwHwnhn/Flotte-Mission-7.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '8' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/215RK6ht/Flotte-Mission-8.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '9' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/TKHMM6c3/Flotte-Mission-9.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '10' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/SjWhXHmg/Flotte-Mission-10.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '15' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/kV6r7pjF/Flotte-Mission-15.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").dataset.missionType == '16' ? ogmob_tooltipImgFlotteColo = 'https://i.postimg.cc/Y4J50zZc/Flotte-Mission-16.png' : '';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").innerHTML = '<img class="ogmob_tooltipImgFlotteColo" src="' + ogmob_tooltipImgFlotteColo + '" />';
                    ogmob_tooltipFlotteColo.querySelector("div.ogl_inFlight").onclick = ogmob_stopHeritage;
                }
            });
            ogmob_mutTooltipsFlotte.disconnect();
        });
        ogmob_mutTooltipsFlotte.observe(document.getElementById("planetList"), {
            childList: true, // observer les enfants directs
            attributes: false,
            subtree: true, // et les descendants aussi
            characterDataOldValue: false // transmettre les anciennes données au callback
        });
        ogmob_OCGLight_Css = ogmob_OCGLight_Css +
            `
#planetList {
  overflow: hidden;
}
#countColonies div.ogl_menuOptions {
  display: none !important;
}
#countColonies div.ogl_panel {
  position: inherit !important;
  font-size: 25px !important;
  bottom: 0 !important;
}
#countColonies div.ogl_panel div {
  height: 50px;
  line-height: inherit !important;
  font-size: 40px !important;
}
#countColonies div.ogl_panel div[data-title="Vue production"] {
  grid-column: 1 / span 2;
}
#countColonies div.ogl_panel div[data-title="Liste des cibles"] {
  grid-column: 3 / span 4;
}
#countColonies div.ogl_panel div[data-title="Vue économie"], #countColonies div.ogl_panel [data-title="Cible épinglée"] {
  display: none;
}
#planetList .smallplanet *
{
  box-sizing: unset !important;
}
#planetList div.smallplanet a.planetlink, #planetList div.smallplanet a.planetlink img {
  position: inherit !important;
  background: none !important;
}
#planetList div.smallplanet a.planetlink span.planet-name, #planetList div.smallplanet a.planetlink span.planet-koords {
  opacity: 1 !important;
  position: inherit !important;
  font-size: 25px !important;
}
#planetList div.smallplanet a.planetlink span.planet-name {
  min-width: 200px;
  max-width: 200px !important;
  text-align: center;
}
#planetList div.smallplanet div.ogl_shortcut, #planetList div.smallplanet div.ogl_short, #planetList div.smallplanet div.ogl_timer {
  display: none !important;
}
#planetList div.smallplanet div.ogl_stock {
  display: none !important;
}
#planetList div.smallplanet div.ogmob_ogl_stock {
  display: flex !important;
  flex-direction: column;
  line-height: inherit !important;
  align-items: center;
  margin: 0 !important;
  position: inherit !important;
  text-align: center !important;
  align-self: center;
  padding-left: 10px;
  padding-right: 10px;
}
#planetList div.smallplanet div.ogmob_ogl_stock div {
  width: max-content;
  font-size: 25px !important;
  margin: 0 !important;
}
#planetList div div.ogl_missionType {
  display: inherit !important;
  position: inherit !important;
  transform: none;
  flex-basis: max-content;
  height: max-content !important;
  width: max-content !important;
  align-self: center;
}
#planetList div div.ogl_missionType, #planetList div div.ogl_missionType:before, #planetList div div.ogl_missionType:after {
  border: none !important;
}
#planetList div div.ogl_missionType img.ogmob_tooltipImgFlotteColo {
  height: 50px;
  width: 50px;
  border: none;
  border-radius: unset !important;
  background: none !important;
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  box-shadow: none !important;
  transition: inherit !important;
}
#rechts #norm div.ogl_resourcesSum, #rechts #norm div.ogl_keyList {
  display: none;
}
#planetbarcomponent #rechts a.planetlink.active .planetPic {
  box-shadow: 0 0 6px 1px #FF9600, 0 0 3px 4px #FF9600 inset !important;
}
`;
    }
/*
----------------------------------
Mlieu
----------------------------------
*/
if(1 === 1)
{
    //Vue d'ensemble
    ogmob_OCGLight_Css = ogmob_OCGLight_Css +
`
#overviewcomponent #planetdata {
  bottom: unset !important;
  position: relative !important;
}
`;
}
/*
----------------------------------
Footer
----------------------------------
*/
if(1 === 1)
{
    if(document.getElementById("countColonies").querySelector('div.ogl_manageData') !== null)
    {
        ogmob_colonneFooterImg = document.createElement("a");
        ogmob_colonneFooterImg.href = '#';
        ogmob_colonneFooterImg.id = 'ogmob_ocglightFooter';
        ogmob_enfantNode = document.createElement("span");
        ogmob_enfantNode.innerHTML = 'OCGLight';
        document.getElementById("ogmob_flotteFooter").style.gridColumn = "4";
        document.getElementById("ogmob_galaxieFooter").style.gridColumn = "5";
        document.getElementById("ogmob_empireFooter").style.gridColumn = "6";
        document.getElementById("countColonies").querySelector('div.ogl_manageData').style.gridRow = "2";
        document.getElementById("countColonies").querySelector('div.ogl_manageData').style.gridColumn = "7";
        document.getElementById("countColonies").querySelector('div.ogl_manageData').appendChild(ogmob_enfantNode);
        document.getElementById("ogmob_footerGrid").appendChild(document.getElementById("countColonies").querySelector('div.ogl_manageData'));
        ogmob_OCGLight_Css = ogmob_OCGLight_Css +
`
#ogmob_footerGrid div.ogl_manageData {
  align-items: center;
  align-content: center;
  text-decoration: none !important;
  border-top: 2px solid white !important;
  border-left: 2px solid white !important;
  border-right: 2px solid white !important;
  border-radius: 0px 0px 0px 0px !important;
  background: #1c2025 !important;
  color: #FFF !important;
  line-height: inherit !important;
  box-sizing: unset !important;
  font-weight: inherit !important;
}
#ogmob_footerGrid div.ogl_manageData span {
  font-family: initial;
}
`;
}
    }
    ogmob_OCGLight_Css = ogmob_OCGLight_Css +
`
div.ogl_universeName {
  display: none;
}
div.ogl_tooltip {
  min-width: max-content !important;
  width: max-content !important;
  max-width: max-content !important;
  display: inline !important;
}
div.ogl_tooltip.ogl_right {
  left: 15% !important;
}
div.ogl_tooltip.ogl_left {
  right: calc(1% + 2px) !important;
}
div.ogl_tooltip:after {
  min-width: max-content !important;
  width: max-content !important;
  max-width: max-content !important;
  display: inline !important;
}
div.ogl_tooltip:before {
  min-width: max-content !important;
  width: max-content !important;
  max-width: max-content !important;
  display: inline !important;
}
div.ogl_tooltip table tbody, div.ogl_tooltip table {
  grid-gap: 0px !important;
}
div.ogl_tooltip table.fleetinfo tr td.ogl_shipIcon:not(.ogl_metal, .ogl_crystal, .ogl_deut, .ogl_dm, .ogl_energy, .ogl_food),
div.ogl_tooltip table.ogl_inFlightTable tr td:first-child:not(.ogl_metal, .ogl_crystal, .ogl_deut, .ogl_dm, .ogl_energy, .ogl_food) {
  height: 50px !important;
  width: 50px !important;
}
div.ogl_tooltip table tr td.ogl_metal, div.ogl_tooltip table tr td.ogl_crystal, div.ogl_tooltip table tr td.ogl_deut, div.ogl_tooltip table tr td.ogl_dm, div.ogl_tooltip table tr td.ogl_energy, div.ogl_tooltip table tr td.ogl_food {
  display: table-cell !important;
  width: 48px !important;
  height: 32px !important;
  background: transparent url("//gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png") 0px 0px no-repeat !important;
}
div.ogl_tooltip table tr td.ogl_metal {
  background-position: 0px -160px !important;
}
div.ogl_tooltip table tr td.ogl_crystal {
  background-position: -48px -160px !important;
}
div.ogl_tooltip table tr td.ogl_deut {
  background-position: -96px -160px !important;
}
div.ogl_tooltip table tr td.ogl_dm {
  background-position: 0px -160px !important;
}
div.ogl_tooltip table tr td.ogl_energy {
  background-position: -144px -160px !important;
}
div.ogl_tooltip table tr td.ogl_food {
  background-position: -288px -160px !important;
}
div.ogl_tooltip table tr.ogl_metal td.value, div.ogl_tooltip table tr.ogl_crystal td.value, div.ogl_tooltip table tr.ogl_deut td.value, div.ogl_tooltip table tr.ogl_dm td.value, div.ogl_tooltip table tr.ogl_energy td.value, div.ogl_tooltip table tr.ogl_food td.value {
  font-size: 25px !important;
}
`;
    GM_addStyle(ogmob_OCGLight_Css);
    function ogmob_stopHeritage() {
        event.stopPropagation();
    }
}