// ==UserScript==
// @name         Poke AutoClicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto click/farm/hatch
// @author       You
// @match        https://www.pokeclicker.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokeclicker.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455358/Poke%20AutoClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/455358/Poke%20AutoClicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let autoclickEL=$(`
    <div style="margin: auto 3px;line-height: 1.5em;text-align: left;">
<input type="checkbox" name="autoall" style="
    vertical-align: middle;
" id="autoall">
<label for="autoall" style="
    margin: 0px;
">All
</label>
<input type="checkbox" name="autoclick" style="
    vertical-align: middle;
" id="autoclick">
<label for="autoclick" style="
    margin: 0px;
">Auto Click
</label>
<input type="checkbox" name="autobreed" style="
    vertical-align: middle;
" id="autobreed">
<label for="autobreed" style="
    margin: 0px;
">Auto Breed
</label>
<input type="checkbox" name="autofarm" style="
    vertical-align: middle;
" id="autofarm">
<label for="autofarm" style="
    margin: 0px;
">Auto Farm
</label>
</div>
    `);
    let autobreedEL=$(`
    <div style="margin: auto 3px;line-height: 1.5em;text-align: left;">

</div>
    `);
    autoclickEL.insertAfter($('#battleContainer > .card-header')[0])
    //autobreedEL.insertAfter($('#breedingDisplay > .card-header')[0])
    let timer;
    let isClick=false;
    let isBreed=false;
    let isFarm=false;
    let breedList;
    let breedIndex=0;
    let allSwitch=$('#autoall')[0]
    let clickSwitch=$('#autoclick')[0]
    let breedSwitch=$('#autobreed')[0]
    let farmSwitch=$('#autofarm')[0]
    function initializeBreed(){
        breedList=undefined;
        $('#breedingModal').modal('show');
        setTimeout(()=>{
            $('#breedingModal').modal('hide');
            let count=4-$('.egg').length
            breedList=$('.eggSlot > a:visible');
            breedIndex=0;
            for (let i=0;i<count;i++){
                breedList[breedIndex].click()
                breedIndex++;
            }
        },2000)
    }
    allSwitch.addEventListener( "click",()=>{
        let state =allSwitch.checked;
        clickSwitch.checked=state;
        breedSwitch.checked=state;
        farmSwitch.checked=state;
        isClick=state;
        isFarm=state;
        isBreed=state;
        if (state){
            initializeBreed()
        }

    });
    clickSwitch.addEventListener( "click",()=>{
        isClick=clickSwitch.checked;
        allSwitch.checked=isClick||isBreed||isFarm;
    });
    breedSwitch.addEventListener( "click",()=>{
        isBreed=breedSwitch.checked
        if (isBreed){
            initializeBreed()
        }
        allSwitch.checked=isClick||isBreed||isFarm;

    });
    farmSwitch.addEventListener( "click",()=>{
        isFarm=  farmSwitch.checked;
        allSwitch.checked=isClick||isBreed||isFarm;
    });
    setInterval(()=>{
        try{
            if (isClick){
                Battle.clickAttack();
                $('btn.btn-warning.chest-button')[0]?.click()
            }}
        catch(e){console.log(e)}
        try{
            if(isFarm){
                App.game.farming.plantAll(FarmController.selectedBerry()||0)
                App.game.farming.harvestAll()
            }}
        catch(e){console.log(e)}
        try{
            if (isBreed){
                if($('.hatching').length>0){
                    App.game.breeding.hatchPokemonEgg(0)
                    App.game.breeding.hatchPokemonEgg(1)
                    App.game.breeding.hatchPokemonEgg(2)
                    App.game.breeding.hatchPokemonEgg(3)
                }
                if(App.game.breeding.hasFreeEggSlot()){
                    if (breedIndex==breedList.length){
                        breedIndex=0;
                    }
                    breedList[breedIndex].click()
                    breedIndex++;
                }

            }}
        catch(e){console.log(e)}
    },30)
})();