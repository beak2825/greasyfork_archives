// ==UserScript==
// @name         Idlescape No Gathering Ironman
// @namespace    NGI
// @version      1.1.2
// @description  Hides Gathering Skills Nodes
// @author       Dael
// @match        *://*.idlescape.com/game*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422967/Idlescape%20No%20Gathering%20Ironman.user.js
// @updateURL https://update.greasyfork.org/scripts/422967/Idlescape%20No%20Gathering%20Ironman.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function _isIronManCharacter(){
        return document.getElementsByClassName("header-league-icon")[0].getAttribute("src").includes("ironman");
    }

    function _isValidSkill(skillDOM){
        if (skillDOM.getElementsByClassName("max-skill-glow").length > 0) return false;
        if (skillDOM.getElementsByClassName("max-skill-glow30").length > 0) return false;
        if (skillDOM.getElementsByClassName("mastery-bar").length > 0) return false;

        let skillInfo = skillDOM.getElementsByClassName("CircularProgressbar-text");
        if (skillInfo.length === 0) skillInfo = skillDOM.getElementsByClassName("skill-level-bar-exp-level");
        if (skillInfo.length === 0) skillInfo = skillDOM.getElementsByClassName("skill-level-bar-ni-exp-level");

        const skillLevel = skillInfo[0].innerHTML;
        return parseInt(skillLevel) === 1;
    }

    function isValidPlayer(){
        if (!_isIronManCharacter()) return false;
        let miningSkill = false;
        let foragingSkill = false;
        let fishingSkill = false;

        if (document.querySelectorAll('[data-for="miningHeader"]').length > 0) {
            // Medium and Large Screens
            document.querySelectorAll('[data-for="miningHeader"]').forEach(e=> { miningSkill = _isValidSkill(e) });
            document.querySelectorAll('[data-for="foragingHeader"]').forEach(e=> { foragingSkill = _isValidSkill(e) });
            document.querySelectorAll('[data-for="fishingHeader"]').forEach(e=> { fishingSkill = _isValidSkill(e) });
        } else {
            // Mobile mode
            document.querySelectorAll('[data-for="miningHeadernavDrawer"]').forEach(e=> { miningSkill = _isValidSkill(e) });
            document.querySelectorAll('[data-for="foragingHeaderundefined"]').forEach(e=> { foragingSkill = _isValidSkill(e) });
            document.querySelectorAll('[data-for="fishingHeaderundefined"]').forEach(e=> { fishingSkill = _isValidSkill(e) });
        }
        return miningSkill && foragingSkill && fishingSkill;
    }

    function injectCSS(){
        const NGIStyle="<style>.theme-mining .resource-wrapper{display: none;}.theme-foraging .resource-wrapper{display: none;}.theme-fishing .resource-wrapper{display: none;}</style>";
        const head = document.querySelector('head');
        head.insertAdjacentHTML('beforeend', NGIStyle);
    }

    function blockGatheringSkills(){
        const callback = function(mutationsList, observer) {
            document.querySelectorAll(".theme-mining").forEach(e=>{e.querySelectorAll(".resource-wrapper").forEach(e=>e.parentNode.removeChild(e))});
            document.querySelectorAll(".theme-foraging").forEach(e=>{e.querySelectorAll(".resource-wrapper").forEach(e=>e.parentNode.removeChild(e))});
            document.querySelectorAll(".theme-fishing").forEach(e=>{e.querySelectorAll(".resource-wrapper").forEach(e=>e.parentNode.removeChild(e))});
        };

        // Observe Play Area DOM changes
        const playAreaContainer = document.getElementsByClassName("play-area-container")[0];
        const config = {attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver(callback);
        observer.observe(playAreaContainer, config);
    }

    function onGameReady(callback) {
        const gameContainer = document.getElementsByClassName("play-area-container");
        if(gameContainer.length === 0) {
            setTimeout(function(){onGameReady(callback);}, 500 );
        } else {
            callback();
        }
    }

    function init(){
        if (!isValidPlayer()) return;
        injectCSS();
        blockGatheringSkills();
    }

    onGameReady(function(){init()});
})();