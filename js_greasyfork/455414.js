// ==UserScript==
// @name         Lootfilter
// @version      1.0
// @author       Bancewald, edit: Arh
// @match        *.margonem.pl/
// @grant        none
// @description  ...
// @namespace https://greasyfork.org/users/935016
// @downloadURL https://update.greasyfork.org/scripts/455414/Lootfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/455414/Lootfilter.meta.js
// ==/UserScript==

function run(){
    if(!Engine){
        setTimeout(run, 100);
        return;
    }
    const timer = ms => new Promise(res => setTimeout(res, ms))
    async function newItemLooted(item){
        if(!Engine.loots){
            return;
        }
        var itemId = item.id
        var logicResult = USERLOGIC(item)
        if(logicResult == 'want'){
            Engine.loots.itemsDecision[itemId] = Engine.party ? "must" : "want"
        }
        else if(logicResult == 'not'){
            Engine.loots.itemsDecision[itemId] = "not"
        }
        else{
            Engine.loots.itemsDecision[itemId] = Engine.party ? "must" : "want"
        }
        const iloscItemkow = Object.entries(Engine.loots.statesOfLoot).length

        for (let i = 0; i < iloscItemkow; i++) {
            Engine.loots.setLootItems()
        }
        if(!Engine.party && !MaddonzAPI.Item.isLegendary(item)){
            await timer(100)
            // TUTAJ ODKOMENTOWAĆ JAK PRZETESTUJESZ, ŻE NA PEWNO DOBRZE CI DZIAŁA :)
            //Engine.loots.acceptLoot()
        }
    }

    Engine.items.fetch(Engine.itemsFetchData.FETCH_NEW_LOOT, newItemLooted)

}
run()


function USERLOGIC(item){
    if(item._cachedStats.hasOwnProperty("teleport") || item._cachedStats.hasOwnProperty("runes") || item._cachedStats.hasOwnProperty("fullheal") || item._cachedStats.hasOwnProperty("canpreview") || item.name == "Serce pajęczego ołtarza" || item.name == "Pazur młodego smoka" || item.name == "Tytoń" || item.name == "Kolec pajęczej matki" || MaddonzAPI.Item.isStone(item) || item.name == "Głowa zbira") return 'want'
    else if(item.cl===16 || item.cl===21 || item.cl===22 || (item.cl===15 && item.parseStats().opis != 'Jeden ze składników legendarnej zbroi wykuwanej przez krasnoludy.') || (item.cl == 26 && (item._cachedStats.target_rarity == "common" || item._cachedStats.target_rarity == "unique"))) return 'not'
    else return null
}
