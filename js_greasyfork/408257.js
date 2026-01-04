// ==UserScript==
// @name         hitchance in combat
// @namespace    FileFace
// @version      0.1.2
// @description  lol7
// @author       shtos
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408257/hitchance%20in%20combat.user.js
// @updateURL https://update.greasyfork.org/scripts/408257/hitchance%20in%20combat.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jslint es5: true */


(function() {
    'use strict';

    const fightScreen = document.getElementById('navigation-right-combat-fighting')
    const combatTables = document.querySelectorAll('.fighting-section-stats-and-hp-area')
    const accHeroElement = combatTables[0].children[0].children[0].children[1]
    const accMonsterElement = combatTables[1].children[0].children[0].children[1]
    const heroAcc = document.querySelectorAll('item-accuracy')[1]
    const heroDef = document.querySelectorAll('item-defence')[1]
    const monsterAcc = document.querySelector('item-monsteraccuracy')
    const magicMonsters = ['fireMage', 'spider', 'yeti', 'dungeonSpider', 'skeletonMonks']
    var tempMonsterName = ''
    function linkuStarto(){
        if (window.var_username){
            addColumns()
            setTimeout(notifObserver, 2000)
        }else{
            setTimeout(linkuStarto, 1000)
        }
    }
    linkuStarto()
    function notifObserver(){
        const observer = new MutationObserver(mutation => {
            let monsterHitChance
            let playerHitChance
            if (magicMonsters.includes(window.var_monsterName)){
                monsterHitChance = '100%'
            }else{
                monsterHitChance = (hitChance(parseInt(window.var_monsterAccuracy), parseInt(window.var_defence))*100).toFixed(0) + '%'
            }
            playerHitChance = (hitChance(parseInt(window.var_accuracy), parseInt(window.var_monsterDefence))*100).toFixed(0) + '%'
            playerHitChance === '100%' ? document.querySelector('#hitchance-span').style.color = 'green' : document.querySelector('#hitchance-span').style.color = 'red'
            monsterHitChance === '100%' ? document.querySelector('#hitchance-monster-span').style.color = 'red' : document.querySelector('#hitchance-monster-span').style.color = 'green'
            document.querySelector('#hitchance-span').textContent = playerHitChance
            document.querySelector('#hitchance-monster-span').textContent = monsterHitChance
        })
        const config = { attributes: true, characterData: true, subtree: true, childList: true }
        observer.observe(heroAcc, config)
        observer.observe(heroDef, config)
        observer.observe(monsterAcc, config)
    }
    function addColumns(){
        let td = document.createElement('td')
        td.innerHTML = `<img src="images/accuracy.png" class="img-30"> <span id="hitchance-span">0</span>`
        accHeroElement.style.display = 'none'
        $(accHeroElement).after(td)
        td = document.createElement('td')
        td.innerHTML = `<img src="images/accuracy.png" class="img-30"> <span id="hitchance-monster-span">0</span>`
        $(accMonsterElement).after(td)
        accMonsterElement.style.display = 'none'
    }
    function hitChance(accuracy, defence) {
        if (defence % 2 == 0){
            return 1 / Math.max(1, defence/2 - accuracy + 1);
        }
        else {
            return ( hitChance(accuracy, defence-1) + hitChance(accuracy, defence+1) ) / 2;
        }
    }
})();