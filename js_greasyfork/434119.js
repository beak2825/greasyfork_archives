// ==UserScript==
// @name         SDSblock
// @namespace    https://smrtfasizmu.si/
// @version      0.4
// @description  Ali vaša stara teta ne ve katere spletne strani so v primežu strahovlade? Vam vaš sodelavec pošilja povezave, ob katerih že takoj veste da jim ne morete zaupati? Vtičnik prikaže veliko obvestilo na straneh, povezanimi z SDS in Janezom Janšo, največjim tatovom, lažnivcem, znanim fašistom in splošnim nebodigatrebo.
// @author       DovolJJ
// @match        https://nova24tv.si/*
// @match        https://skandal24.si/*
// @match        https://politikis.si/*
// @match        https://e-koroska.si/*
// @match        https://vsenovice.info/*
// @match        https://moja-dolenjska.si/*
// @match        https://mojeposavje.si/*
// @match        https://mojepodravje.si/*
// @match        https://demokracija.si/*
// @match        https://go-portal.si/*
// @match        https://e-maribor.si/*
// @match        https://primorska24.si/*
// @match        https://pomurske-novice.si/*
// @match        https://nase-zasavje.si/*
// @match        https://gorenjski-utrip.si/*
// @match        https://portal-os.si/*
// @match        https://sasa-novice.si/*
// @match        https://spodnjepodravje.si/*
// @match        https://celjskiglasnik.si/*
// @match        https://utrip-ljubljane.si/*
// @match        https://notranjska.si/*
// @match        https://siol.net/*
// @match        https://www.sds.si/*
// @match        https://www.facebook.com/slovenska.demokratska.stranka*
// @match        https://www.facebook.com/GibanjeResni.ca/*
// @match        https://twitter.com/strankaSDS/*
// @match        https://www.youtube.com/c/SDSTV
// @match        https://nsi.si/*
// @match        https://*.sns.si/*
// @match        https://*.gov.si/drzavni-organi/predsednik-vlade/*
// @match        https://resni.ca/*
// @match        https://desus.si/*
// @match        https://www.portalplus.si/*
// @match        https://www.rtvslo.si/* 
// @match        https://mariborinfo.com/*  
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/434119/SDSblock.user.js
// @updateURL https://update.greasyfork.org/scripts/434119/SDSblock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addGlobalStyle('.notice {width:100vw;background:red;color:white;text-align:center;z-index:2147483647;line-height:initial!important;}');
    addGlobalStyle('.notice a {color:black;}');

    addGlobalStyle('.notice-big {padding:5vw;font-size:30px;position:relative;}');
    addGlobalStyle('.notice-fixed {padding:1vw;font-size:20px;position:fixed;top:5vw;}');

    var topDiv = document.createElement('div');
    var bottomDiv = document.createElement('div');
    var fixedDiv = document.createElement('div');
    topDiv.className = "notice notice-big";
    bottomDiv.className = "notice notice-big";
    fixedDiv.className = "notice notice-fixed";

    var text = 'Ogledujete si stran, ki je del SDSove mreže medijev ali pod njenim vplivom. Informacijam na tej strani ne morate zaupati. <br/><a href="https://podcrto.si/infografika-internetni-mediji-sds/">Več informacij</a>';
    topDiv.innerHTML += text;
    bottomDiv.innerHTML += text;
    fixedDiv.innerHTML += text;

    document.body.prepend(topDiv);
    document.body.appendChild(bottomDiv);
    document.body.prepend(fixedDiv);
})();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}