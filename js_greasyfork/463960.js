// ==UserScript==
// @name         TMO+
// @namespace    TMO+
// @version      0.3
// @description  Una extension para facilitar la navegacion en TMO
// @author       Aldair
// @license      GNU GPLv3
// @match *://*lectortmo.com/*
// @match *://*almtechnews.com/news/*
// @match *://*animalcanine.com/news/*
// @match *://*animalslegacy.com/news/*
// @match *://*animalsside.com/news/*
// @match *://*animation2you.com/news/*
// @match *://*animationforyou.com/news/*
// @match *://*anisurion.com/news/*
// @match *://*anitirion.com/news/*
// @match *://*anitoc.com/news/*
// @match *://*checkingcars.com/news/*
// @match *://*cocinaconlupita.com/news/*
// @match *://*cook2love.com/news/*
// @match *://*cooker2love.com/news/*
// @match *://*cookermania.com/news/*
// @match *://*cookernice.com/news/*
// @match *://*cookerready.com/news/*
// @match *://*dariusmotor.com/news/*
// @match *://*enginepassion.com/news/*
// @match *://*fanaticmanga.com/news/*
// @match *://*feelthecook.com/news/*
// @match *://*fitfooders.com/news/*
// @match *://*gamesnk.com/news/*
// @match *://*gamesxo.com/news/*
// @match *://*infogames2you.com/news/*
// @match *://*infopetworld.com/news/*
// @match *://*keepfooding.com/news/*
// @match *://*mangalong.com/news/*
// @match *://*mistermanga.com/news/*
// @match *://*motorbakery.com/news/*
// @match *://*motoroilblood.com/news/*
// @match *://*motornk.com/new/*
// @match *://*motorpi.com/news/*
// @match *://*mygamesinfo.com/news/*
// @match *://*mynewsrecipes.com/news/*
// @match *://*myotakuinfo.com/news/*
// @match *://*otakunice.com/news/*
// @match *://*otakuworldgames.com/news/*
// @match *://*otakworld.com/news/*
// @match *://*paleomotor.com/news/*
// @match *://*recetasdelupita.com/news/*
// @match *://*recetchef.com/news/*
// @match *://*recipesandcooker.com/news/*
// @match *://*recipesaniki.com/news/*
// @match *://*recipescoaching.com/news/*
// @match *://*recipesdo.com/news/*
// @match *://*recipesist.com/news/*
// @match *://*recipesnk.com/news/*
// @match *://*releasingcars.com/news/*
// @match *://*sucrecipes.com/news/*
// @match *://*techinroll.com/news/*
// @match *://*vgmotor.com/news/*
// @match *://*vsrecipes.com/news/*
// @match *://*worldmangas.com/news/*
// @match *://*wtechnews.com/news/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/463960/TMO%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/463960/TMO%2B.meta.js
// ==/UserScript==

//Puse la license como MIT por error SORRY

(function() {
    'use strict';
//AGREGA UN BLACK MODE INFINITO

if((location.href).includes("paginated")){
location.replace(`https://lectortmo.com/viewer/${location.pathname.split("/")[2]}/cascade`);
}

    document.addEventListener('keydown', logKey);
    function logKey(e) {
        if(e.code == "ArrowRight"){
            location = document.querySelector(".chapter-next").querySelector("a").href;
        }
            if(e.code == "ArrowLeft"){
            location = document.querySelector(".chapter-prev").querySelector("a").href;
        }
    }
})();