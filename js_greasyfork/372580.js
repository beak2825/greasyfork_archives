// ==UserScript==
// @name         HaremHeroes XP for next level
// @version      1.2
// @description  Instead of showing the total XP recquiered on the XP bar, it only show the XP for the current level
// @author       Spychopat
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @namespace JDscripts
// @downloadURL https://update.greasyfork.org/scripts/372580/HaremHeroes%20XP%20for%20next%20level.user.js
// @updateURL https://update.greasyfork.org/scripts/372580/HaremHeroes%20XP%20for%20next%20level.meta.js
// ==/UserScript==


function refreshXp()
{
    var xpActuelle = Hero.infos.Xp.cur - Hero.infos.Xp.min;
    var xpObjectif = Hero.infos.Xp.max - Hero.infos.Xp.min;

    var divXpBarInfos = document.getElementsByClassName("over reversed_tooltip")[0];
    var spansXpBarInfos = divXpBarInfos.getElementsByTagName("span");
    spansXpBarInfos[0].innerHTML = xpActuelle;
    spansXpBarInfos[2].innerHTML = xpObjectif;
}

(function() {
    'use strict';

    refreshXp();

    setInterval(function() {
        refreshXp();
    }, 1000);
})();