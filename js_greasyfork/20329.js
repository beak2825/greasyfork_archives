// ==UserScript==
// @name        FakeTabName
// @namespace   FakeTabName
// @description:fr Remplace le nom des onglet par des titres plus SFW
// @description:en Change tabs names for NSFW web sites
// @version     0.1
// @include     http://www.cutscenes.net/*
// @include     http://celebsroulette.com/*
// @include     http://ancensored.com/*
// @include     http://www.tubepornclassic.com/*
// @include     http://www.xvideos.com/*
// @include     http://*.4chan.org/*
// @include     http://*.cam4.com/*
// @include     http://www.pornhub.com/*
// @include     http://www.vapoclope.fr/*
// @include     http://*.xhamster.com/*
// @grant       none
// @run-at      document-end
// @description Remplace le nom des onglet par des titres plus SFW
// @downloadURL https://update.greasyfork.org/scripts/20329/FakeTabName.user.js
// @updateURL https://update.greasyfork.org/scripts/20329/FakeTabName.meta.js
// ==/UserScript==

var names = ["FileMaker Pro - Forum",
         "Accueil - LinuxFr",
         "Korben Info - Upgrade your mind",
         "Sud Ouest - Actualité",
         "GRR (Gestion et Réservations Ressources)",
         "Gestionnaire de modules",
         "Portail Client Adista",
         "JavaScript Help",
         "Google Actualités",
         "Nouvel onglet",
         "phpList :: phpList :: accueil",
         "Météo GIRONDE par Météo-France",
         "Options",
         "Se connecter à Webmin",
         "Zimbra: 9/5 - 13/5",
         "Boite de réception (53)"
];

sites = ["http://www.google.fr",
         "http://192.168.1.227",
         "http://192.168.1.228",
         "http://portail.adista.fr",
         "https://www.google.fr/search?q=filemaker&ie=utf-8&oe=utf-8&client=firefox-b-ab&gfe_rd=cr&ei=EHZWV-zVFInu8weAg7yYDg",
         "https://www.google.fr/search?q=filemaker&ie=utf-8&oe=utf-8&client=firefox-b-ab&gfe_rd=cr&ei=EHZWV-zVFInu8weAg7yYDg#q=filemaker+pro+liaisons",
         "http://news.google.fr",
         "http://korben.info",
         "https://developer.mozilla.org/fr/docs/Web/API/WindowTimers/setInterval",
         "https://192.168.1.1:20000/",
         "https://greasyfork.org"
]
var intervalID = window.setInterval( function () { window.location = sites[Math.floor(Math.random()*(sites.length-1))]; },1000*60*.5);
var nbNames = names.length - 1;
console.log("nb: "+nbNames);
document.title = names[Math.floor(Math.random()*nbNames)];

