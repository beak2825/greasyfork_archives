// ==UserScript==
// @name         zone buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  lol6
// @author       shtos
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408028/zone%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/408028/zone%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const ZONES = [{zone: 'Fields/Forest', id: 1},{zone: 'Caves', id: 2},{zone: 'Lava Dungeon', id: 3},{zone: 'Northern Fields', id: 4},{zone: 'Cemetery', id: 8}]
    const SECTION = document.getElementById('item-section-combat-1')
    const startThing = () => {
        if(window.var_username){
            addZoneButtons()
        }else{
            setTimeout(startThing, 1000)
        }
    }
    startThing()

    function addZoneButtons(){
        let wrapper = document.createElement('div')
        wrapper.style = 'width: 800px;display:flex; justify-content: center; margin-top: 20px;'
        let div = document.createElement('div')
        div.id = 'zone-buttons'
        div.style = 'display:flex; flex-direction: row; width: 400px; flex-wrap: wrap;'
        ZONES.forEach(zone=>{
            let button = document.createElement('button')
            button.style = 'height: 30px; width: 120px; font-family: sans-serif; background: #222831; border: 1px solid grey; color: #eeeeee; margin: 2px; font-weight: bold;'
            button.textContent = zone.zone
            button.onclick = () => {window.clicksItem('fightMonsterButton'); window.changeCombatMap(zone.id)}
            div.appendChild(button)
        })
        wrapper.appendChild(div)
        $(SECTION).before(wrapper)
    }
})();