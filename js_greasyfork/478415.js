// ==UserScript==
// @name         A Dark Room Trainer
// @namespace    http://tampermonkey.net/
// @version      0.9.6
// @description  Make A Dark Room Pretty Easy, some would consider it cheats
// @description  Handles Events
// @description  Stokes, Gathers and Checks
// @description  Adds a trainer with:
// @description  - Unlock Buttons for MapBuildings, Blueprints, Perks, Map, Ressources, Craftables/Weapons
// @description  - Never Starve Button
// @description  - No wait Time to Embark after death Button
// @description  - Buttons to add 10/100/1000 Ressources
// @author       https://github.com/anisfencheltee
// @match        https://adarkroom.doublespeakgames.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doublespeakgames.com
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/478415/A%20Dark%20Room%20Trainer.user.js
// @updateURL https://update.greasyfork.org/scripts/478415/A%20Dark%20Room%20Trainer.meta.js
// ==/UserScript==

(
    function() {
    'use strict';
        GM_addStyle(".row_trainer_add {display:inline; margin-left:5px}")
        GM_addStyle(".disabled {color:grey}")
        var multiplied = [
            'scales',
            'teeth',
            'bullet'
        ]
        var perkBlueprint = {
                type:'div',
                id:'perk_',
                classList:[
                    'perkRow',
                    'disabled'
                ],
                html:'<div class="row_key">{perkname}</div>',
                parent:[
                    {
                        type:'id',
                        value:'perks'
                    }
                ],
            onclick: addPerk
            }
        var perks = {
            'boxer':false,
            'martial artist':false,
            'unarmed master':false,
            'barbarian':false,
            'evasive':false,
            'scout':false,
            'stealthy':false,
            'gastronome':false,
            'precise':false,
            'slow metabolism':false,
            'desert rat':false
        }
        var buttons = [
            {
                id:'stokeButton'
            },
            {
                id:'gatherButton'
            },
            {
                id:'trapsButton'
            },
            {
                id:'build_trap'
            },
            {
                id:'build_hut'
            }
        ]
        var events = {
            'A Beast Attack': {
                buttons:['end']
            },
            'The Mysterious Wanderer':{
                condition:{
                    item:'wood',
                    limits:{
                        300:0,
                        1000:1,
                        99999999999:2
                    }
                },
                buttons:[
                    'deny',
                    'wood100',
                    'wood500'
                ]
            },
            'The Master':{
                buttons:[
                    'agree'
                ],
                finalButtons:[
                    'force',
                    'precision',
                    'evasion',
                    'nothing',
                    'deny'
                ]
            },
            'The Nomad':{
                buttons:[
                    'goodbye'
                ]
            },
            'The Beggar':{
                condition:{
                    item:'fur',
                    limits:{
                        200:0,
                        300:1,
                        99999999999:2
                    }
                },
                buttons:[
                    'deny',
                    '50furs',
                    '100furs'
                ]
            },
            'Noises':{
                buttons:[
                    'investigate'
                ],
                finalButtons:[
                    'leave',
                    'backinside'
                ]
            },
            'Penrose':{
                buttons:[
                    'ignore'
                ]
            },
            'The Scout':{
                buttons:[
                    'buyMap'
                ],
                finalButtons:[
                    'learn',
                    'leave'
                ],
                clicks:20

            },
            'A Military Raid':{
                buttons:[
                    'end'
                ]
            },
            'A Ruined Trap':{
                buttons:[
                    'track'
                ],
                finalButtons:[
                    'end'
                ]
            },
            'Fire':{
                buttons:[
                    'mourn'
                ]
            },
            'The Thief':{
                buttons:[
                    'spare'
                ],
                finalButtons:[
                    'leave'
                ]
            },
            'The Shady Builder':{
                buttons:[
                    'build'
                ]
            }
        }


        var trainerInfos = {
            trainables: {
                stores: [
                    "wood",
                    "fur",
                    "meat",
                    "bait",
                    "cloth",
                    "scales",
                    "teeth",
                    "charm",
                    "cured meat",
                    
                    "leather",
                    "torch",
                    
                    "bone spear",
                    
                    "iron",
                    "iron sword",
                    
                    "steel sword",
                    "coal",
                    "steel",
                    
                    
                    "medicine",
                    "rifle",
                    "bullets",
                    "alien alloy",
                    "grenade",
                    "bolas",
                    "bayonet",
                    "energy cell",
                    "laser rifle",
                    
                    "energy blade",
                    "sulphur",                    
                    "hypo",
                    "glowstone",
                    "disruptor",
                    "stim",
                    "plasma rifle",
                    "fleet beacon"
                ],
                craftables:[
                    "kinetic armour",
                    "fluid recycler",
                    "cargo drone",
                    "convoy",
                    "water tank",
                    "s armour",
                    "wagon",
                    "i armour",
                    "cask",
                    "rucksack",
                    "l armour",
                    "waterskin",
                    "compass",
                    ],
                'character':
                {
                    'blueprints':[
                        "hypo",
                        "kinetic armour",
                        "glowstone",
                        "disruptor",
                        "plasma rifle",
                        "stim"
                    ],
                    'perks':[
                        'boxer',
                        'material artist',
                        'unarmed master',
                        'barbarien',
                        'evasive',
                        'scout',
                        'stealthy',
                        'gastronome',
                        'precise',
                        'slow metabolism',
                        'desert rat'
                    ]
                }
            }
        }

        var trainer = {
            menuEntry:{
                type:'span',
                id:'trainerButton',
                classList:[
                    'menuBtn'
                ],
                html:'Trainer {state}',
                parent:[
                    {
                        type:'class',
                        value:'menu'
                    }
                ],
                onclick:toggleTrainer
            },
            eventHandlerMenuEntry:{
                type:'span',
                id:'eventHandlerButton',
                classList:[
                    'menuBtn'
                ],
                html:'Eventhandler {state}',
                parent:[
                    {
                        type:'class',
                        value:'menu'
                    }
                ],
                onclick:toggleEventHandler
            },
            clickerMenuEntry:{
                type:'span',
                id:'clickerButton',
                classList:[
                    'menuBtn'
                ],
                html:'Clicker {state}',
                parent:[
                    {
                        type:'class',
                        value:'menu'
                    }
                ],
                onclick:toggleClicker
            },
            add10Entry:{
                type:'div',
                    classList:[
                        'row_trainer_add'
                    ],
                html:'+',
                parent:[
                    {
                        type:'id',
                        value:'resources',
                        modifier:'children'
                    },
                    {
                        type:'id',
                        value:'weapons',
                        modifier:'children'
                    }
                ],
                position:{
                    location:'before',
                    element: {
                        type:'class',
                        value:'clear'
                    }
                },
                attributes:{
                    additional:10,
                    notification:'10 {material} manifest in front of your eyes'
                },
                onclick:addToStorage
            },
            add100Entry:{
                type:'div',
                classList:[
                    'row_trainer_add'
                ],
                html:'++',
                parent:[
                    {
                        type:'id',
                        value:'resources',
                        modifier:'children'
                    },
                    {
                        type:'id',
                        value:'weapons',
                        modifier:'children'
                    }
                ],
                position:{
                    location:'before',
                    element: {
                        type:'class',
                        value:'clear'
                    }
                },
                attributes:{
                    additional:100,
                    notification:'100 {material} manifest in front of your eyes'
                },
                onclick:addToStorage
            },
            add1000Entry:{
                type:'div',
                classList:[
                    'row_trainer_add'
                ],
                html:'+++',
                parent:[
                    {
                        type:'id',
                        value:'resources',
                        modifier:'children'
                    },
                    {
                        type:'id',
                        value:'weapons',
                        modifier:'children'
                    }
                ],
                position:{
                    location:'before',
                    element: {
                        type:'class',
                        value:'clear'
                    }
                },
                attributes:{
                    additional:1000,
                    notification:'1000 {material} manifest in front of your eyes'
                },
                onclick:addToStorage
            },
            perksContainer:{
                type:'div',
                id:'perks',
                attributes:{
                    'data-legend':'perks'
                },
                parent:[
                    {
                        type:'id',
                        value:'pathPanel'
                    }
                ],
                position:{
                    location:'before',
                    element: {
                        type:'id',
                        value:'pathScroller'
                    }
                },
            },
            neverStarve:{
                type:'div',
                id:'neverStarveAgain',
                classList:[
                    'button'
                ],
                parent:[
                    {
                        type:'id',
                        value:'outsidePanel',
                    }
                ],
                html:'Never Starve Again',
                onclick:changeStarvation
            },
            dontWaitAfterDie:{
                type:'div',
                id:'dontWaitAfterDie',
                classList:[
                    'button'
                ],
                parent:[
                    {
                        type:'id',
                        value:'outsidePanel',
                    }
                ],
                html:'Never Wait After Dying',
                onclick:changeWaitAfterDie
            },
            unlockMap:{
                type:'div',
                id:'unlockMap',
                classList:[
                    'button'
                ],
                parent:[
                    {
                        type:'id',
                        value:'outsidePanel',
                    }
                ],
                html:'Unlock Map',
                onclick:unlockMap
            },
            unlockEveryBuilding:{
                type:'div',
                id:'unlockBuildings',
                classList:[
                    'button'
                ],
                parent:[
                    {
                        type:'id',
                        value:'outsidePanel',
                    }
                ],
                html:'Unlock Map Buildings',
                onclick:unlockBuildings
            },
            unlockBuilder:{
                type:'div',
                id:'unlockBuilder',
                classList:[
                    'button'
                ],
                parent:[
                    {
                        type:'id',
                        value:'roomPanel',
                    }
                ],
                position:{
                    location:'after',
                    element: {
                        type:'id',
                        value:'stokeButton'
                    }
                },
                html:'LVL Up Builder',
                onclick:unlockBuilder
            },
            unlockEveryMaterial:{
                type:'div',
                id:'unlockMaterials',
                classList:[
                    'button'
                ],
                parent:[
                    {
                        type:'id',
                        value:'outsidePanel',
                    }
                ],
                attributes:{
                    type:'stores',
                    notification:'1000 {material} manifest in front of your eyes'
                },
                html:'Unlock Every Material',
                onclick:unlockMaterials
            },
            unlockCraftables:{
                type:'div',
                id:'unlockCraftables',
                classList:[
                    'button'
                ],
                parent:[
                    {
                        type:'id',
                        value:'outsidePanel',
                    }
                ],
                attributes:{
                    type:'craftables',
                    notification:'1000 {material} manifest in front of your eyes'
                },
                html:'Unlock Craftables',
                onclick:unlockMaterials
            },
            unlockBlueprints:{
                type:'div',
                id:'unlockBlueprints',
                classList:[
                    'button'
                ],
                parent:[
                    {
                        type:'id',
                        value:'outsidePanel',
                    }
                ],
                html:'Unlock Every Blueprint',
                onclick:unlockBlueprints
            }
        }

        let eventHandlerStates = [
            'off',
            'auto',
            'notify'
        ]
        let clickerStates = [
            'off',
            'auto'
        ]

        var buyContainer = document.getElementById('buyBtns');
        var autoHandleEvents = true;
        var alertOnEvents = false;
        var lastEvent = '';
        World.oldDie = World.die
        function worldDieWrapper(){
            World.oldDie()
            Engine.setTimeout(function(){
                let button = $('#embarkButton')
                StateManager.remove('cooldown.embarkButton')
                Button.clearCooldown(button, true);
            },5000,false)
        }

        if(buyContainer){
            addMultipleBuyButtons(buyContainer);
        }
        StateManager.remove('character.perks["material artist"]')
        var trainerActive = GM_getValue('trainer',true);
        createMenu();
        if(trainerActive)addTrainer();
        var checker = setInterval(()=>{
            let eventHandler = GM_getValue('eventHandler','off');
            let clickHandler = GM_getValue('clickHandler','off');
            if(eventHandler !== 'off') checkForEvent(eventHandler);
            if(clickHandler !== 'off') clickButtons();
        },500)

        var saveStarveFunction;


        function addTrainer(){
            createAddButtons();
            if(StateManager.get('game.builder.level')!==4)generateElement(trainer.unlockBuilder)
            let pathSelector = document.getElementById('location_path');
            if(pathSelector){
                pathSelector.onclick = function(){
                    createPerksTrainer();
                }
            }
            let outsideSelector = document.getElementById('location_outside');
            if(outsideSelector){
                generateElement(trainer.neverStarve)
                toggleStarvation(false)
                generateElement(trainer.dontWaitAfterDie)
                toggleWaitAfterDeath(false)
                generateElement(trainer.unlockMap)
                generateElement(trainer.unlockEveryBuilding)
                generateElement(trainer.unlockEveryMaterial)
                generateElement(trainer.unlockCraftables)
                generateElement(trainer.unlockBlueprints)
            }
        }

        function unlockBuildings(){
            if(StateManager.get('game.buildings["sulphur mine"]', true) === 0) {
                StateManager.add('game.buildings["sulphur mine"]', 1);
                Engine.event('progress', 'sulphur mine');
            }
            if(StateManager.get('game.buildings["iron mine"]', true) === 0) {
                StateManager.add('game.buildings["iron mine"]', 1);
                Engine.event('progress', 'iron mine');
            }
            if(StateManager.get('game.buildings["coal mine"]', true) === 0) {
                StateManager.add('game.buildings["coal mine"]', 1);
                Engine.event('progress', 'coal mine');
            }
            if(!StateManager.get('features.location.spaceShip')) {
                Ship.init();
                Engine.event('progress', 'ship');
            }
            if (!StateManager.get('features.location.fabricator')) {
                Fabricator.init();
                Notifications.notify(null, _('builder knows the strange device when she sees it. takes it for herself real quick. doesn’t ask where it came from.'));
                Engine.event('progress', 'fabricator');
            }
        }

        function changeStarvation(){
            toggleStarvation(true)
        }

        function changeWaitAfterDie(){
            toggleWaitAfterDeath(true)
        }
        function toggleStarvation(save){
            let key = 'dontstarve';
            let id = 'neverStarveAgain';
            let check = GM_getValue(key,false)
            if(save){
                check = !check;
                GM_setValue(key,check)
            }
            console.log(check)
            let buttonText = ''
            if(check){
                buttonText=document.getElementById(id).innerHTML.replace('Never ','')
                saveStarveFunction = World.useSupplies
                World.useSupplies = function(){return true;}
            }else{
                buttonText=document.getElementById(id).innerHTML.indexOf('Never')===-1?'Never '+document.getElementById(id).innerHTML:document.getElementById(id).innerHTML
                World.useSupplies = saveStarveFunction
            }
            document.getElementById(id).innerHTML = buttonText
        }

        function toggleWaitAfterDeath(save){
            let key = 'dontWaitAfterDie';
            let id = 'dontWaitAfterDie';
            let check = GM_getValue(key,false)
            if(save){
                check = !check;
                GM_setValue(key,check)
            }
            console.log(check)
            let buttonText = ''
            if(check){
                buttonText=document.getElementById(id).innerHTML.replace('Never ','')
                console.log('Cooldown = 0')
                if(document.getElementById('embarkButton')){
                    document.getElementById('embarkButton').remove()
                    new Button.Button({
                        id: 'embarkButton',
                        text: _("embark"),
                        click: Path.embark,
                        width: '80px',
                        cooldown: 0
                    }).appendTo(document.getElementById('pathScroller'));
                }
            }else{
                buttonText=document.getElementById(id).innerHTML.indexOf('Never')===-1?'Never '+document.getElementById(id).innerHTML:document.getElementById(id).innerHTML
                console.log('Cooldown = 120')
                if(document.getElementById('embarkButton')){
                    document.getElementById('embarkButton').remove()
                    new Button.Button({
                        id: 'embarkButton',
                        text: _("embark"),
                        click: Path.embark,
                        width: '80px',
                        cooldown: World.DEATH_COOLDOWN
                    }).appendTo(document.getElementById('pathScroller'));
                }
            }
            document.getElementById(id).innerHTML = buttonText
        }
        function unlockMap(){
            World.LIGHT_RADIUS = 90;
            let map = StateManager.get('game.world.map')
            StateManager.setM('game.world', {
                map: map,
                mask: World.newMask()
            });
            World.LIGHT_RADIUS = 2;
        }
        function createMenu(){
            generateElement(trainer.eventHandlerMenuEntry)
            let eventHandler = GM_getValue('eventHandler','off');
            document.getElementById(trainer.eventHandlerMenuEntry.id).innerHTML = document.getElementById(trainer.eventHandlerMenuEntry.id).innerHTML.replace('{state}',eventHandler)
            generateElement(trainer.clickerMenuEntry)
            let clickHandler = GM_getValue('clickHandler','off');
            document.getElementById(trainer.clickerMenuEntry.id).innerHTML = document.getElementById(trainer.clickerMenuEntry.id).innerHTML.replace('{state}',clickHandler)
            generateElement(trainer.menuEntry)
            var trainerActive = GM_getValue('trainer',true)?'Active':'Inactive';
            document.getElementById(trainer.menuEntry.id).innerHTML = document.getElementById(trainer.menuEntry.id).innerHTML.replace('{state}',trainerActive)
        }

        function toggleEventHandler(e){
            let current = GM_getValue('eventHandler','off');
            let nextState = extractState(eventHandlerStates,current);
            GM_setValue('eventHandler',nextState);
            e.target.innerHTML = e.target.innerHTML.replace(current,nextState);
            console.log(e.target)
            console.log(nextState)
        }

        function toggleClicker(e){
            let current = GM_getValue('clickHandler','off');
            let nextState = extractState(clickerStates,current);
            GM_setValue('clickHandler',nextState);
            e.target.innerHTML = e.target.innerHTML.replace(current,nextState);
            console.log(e.target)
            console.log(nextState)
        }

        function extractState(array,currentState){
            let index = array.indexOf(currentState);
            let nextIndex = (index + 1)<array.length?index+1:0;
            return array[nextIndex];
        }

        function createPerksTrainer(){
            if(!document.getElementById('perks')){
                generateElement(trainer.perksContainer);
            }
            generateMissingPerks();
        }

        function addPerk(e){
            let parent = e.target.parentNode
            let name = parent.getAttribute('perkName')
            parent.classList.remove('disabled')
            parent.onclick = function(){return true;}
            StateManager.addPerk(name)
            Path.updatePerks(false)

        }

        function unlockBuilder(){
            StateManager.set('game.fire', Room.FireEnum.fromInt(4));
            $SM.set('game.temperature', Room.TempEnum.fromInt(4));
            for(let i=0;i<4;i++){
                Room.updateBuilderState()
            }
            document.getElementById('unlockBuilder').remove()
        }

        function generateMissingPerks(){
            for(let perk in perks){
                console.log(perk)
                let perkId = 'perk_'+perk.replace(' ','-');
                console.log(document.getElementById(perkId))
                if(!document.getElementById(perkId)){
                    let perkDetails = { ...perkBlueprint }
                    perkDetails.id = perkDetails.id + perk.replace(' ','-')
                    perkDetails.attributes = {
                        perkName: perk
                    }
                    perkDetails.html = perkDetails.html.replace('{perkname}',perk)
                    generateElement(perkDetails)
                }
            }
        }
        function createAddButtons(){
            generateElement(trainer.add10Entry)
            generateElement(trainer.add100Entry)
            generateElement(trainer.add1000Entry)
        }
        function toggleTrainer(){
            GM_setValue('trainer',!trainerActive);
            location.reload();
        }

        function addToStorage(e){
            let parent = e.target.parentNode;
            let additional = parseInt(e.target.getAttribute('additional'));
            let item = parent.id.replace('row_','').replace('-',' ')
            let notificationMessage = e.target.getAttribute('notification').replace('{material}',item)
            console.log(notificationMessage)
            Notifications.notify(null,notificationMessage,true);
            let amount = StateManager.get('stores.'+item,true);
            let newAmount = amount + additional
            let path = 'stores.'+item;
            console.log(path)
            console.log(newAmount)
            StateManager.set('stores.'+item,newAmount,false);
            //StateManager.addPerk('unarmed master');
        }

        function unlockMaterials(e){
            let type = e.target.getAttribute('type')
            let stores = trainerInfos.trainables[type]

            for(let i = 0; i<stores.length;i++){
                let item = stores[i]
                let amount = StateManager.get('stores.'+item,true);
                if(amount===0){
                    let notificationMessage = 'Suddenly a strange Material is found in the Village. Builder says its name is '+item;
                    console.log(notificationMessage)
                    Notifications.notify(null,notificationMessage,true);
                    let newAmount = 1
                    let path = 'stores.'+item;
                    StateManager.set('stores.'+item,newAmount,false);
                }else{
                    console.log(amount)
                }
            }
        }

        function unlockBlueprints(){
            let blueprints = trainerInfos.trainables.character.blueprints
            for (let i=0;i<blueprints.length;i++){
                let item = blueprints[i];
                StateManager.set(`character.blueprints['${item}']`, true);
            }
            Notifications.notify(null, 'blueprints feed into the fabricator data port. possibilities grow.');
        }

        function generateElement(blueprint){
            let parent;
            let id = false;
            for (let j=0;j<blueprint.parent.length;j++){
                if (blueprint.parent[j].type==='class'){
                    id=false;
                    parent = document.getElementsByClassName(blueprint.parent[j].value)[0]
                }else{
                    id=true;
                    parent = document.getElementById(blueprint.parent[j].value)
                    if(!parent) continue
                }
                let parents = [parent]
                if(id && blueprint.parent[j].modifier === 'children')
                {
                    console.log(parent)
                    parents = parent.childNodes
                }
                for(let k=0; k<parents.length; k++){
                    let element = document.createElement(blueprint.type);
                    if(blueprint.id) element.id = blueprint.id
                    if(blueprint.classList){
                        for(let i=0;i<blueprint.classList.length;i++){
                            element.classList.add(blueprint.classList[i]);
                        }
                    }
                    if(blueprint.html)element.innerHTML = blueprint.html
                    if(blueprint.attributes){
                        for (const attribute in blueprint.attributes){
                            element.setAttribute(attribute,blueprint.attributes[attribute])
                        }
                    }
                    if(blueprint.position){
                        let target
                        let el = parents[k]
                        if(blueprint.position.element.type==='class'){
                            target = el.getElementsByClassName(blueprint.position.element.value)[0]
                        }else{
                            target = document.getElementById(blueprint.position.element.value)
                        }
                        switch(blueprint.position.location){
                            case 'before':
                                parents[k].insertBefore(element,target)
                                break;
                            case 'after':
                                parents[k].insertBefore(element,target.nextSibling)
                                break;
                            default:
                                break;
                        }
                    }else{
                        parents[k].appendChild(element)
                    }
                    if(blueprint.onclick){
                        element.onclick = blueprint.onclick
                    }
                }
            }
        }
        function getPerks(){
            let state = JSON.parse(localStorage.getItem('gameState'));
            console.log(state);
            let character = state.character;
            console.log(character.perks);
        }
    function addMultipleBuyButtons(buyContainer){

        var buyButtons = buyContainer.childNodes;
        console.log(buyContainer)
        console.log(multiplied)
        for(let i = 0; i<buyButtons.length;i++){
            let button = buyButtons[i];
            console.log(button)
            if(!button.classList.contains('modded') && multiplied.includes(button.innerText)){
                let element = createMultipleButton(button.id, button.innerHTML)
                button.after(element);
                element.onclick = buyMultiples;
            }
        }
    }
    function createMultipleButton(target, targetText){
        let element = document.createElement('div');
        var clicks = 3;
        element.setAttribute('target',target);
        element.setAttribute('count',clicks);
        element.innerHTML = targetText + ' x'+clicks;
        element.classList.add('modded')
        element.classList.add('button')
        element.style.width = '80px';
        element.style.opacity = '1';
        let tooltip = element.getElementsByClassName('tooltip')[0]
        let amounts = tooltip.getElementsByClassName('row_val');
        for(let i=0;i<amounts.length;i++){
            let amount = amounts[i]
            let amountNumber = amount.innerHTML;
            amountNumber = amountNumber * clicks;
            amount.innerHTML = amountNumber;
        }
        console.log(element)
        return element;
    }

        function buyMultiples(e){
            console.log(e.target)
            let clicks = e.target.getAttribute('count')
            var target = e.target.getAttribute('target')
            var buy = document.getElementById(target)
            console.log(buy)
            console.log(clicks)
            for(let i=0; i<clicks;i++){
                console.log(i)
                buy.click();
            }
        }
    function clickButtons(){
        for(let i = 0; i<buttons.length;i++){
            let button = document.getElementById(buttons[i].id);
            if(button && !button.classList.contains('disabled')){
                button.click();
            }
        }
    }
    var checkForEvent = function(){
        let event = document.getElementById('event')
        if(event){
            let eventType = event.getElementsByClassName('eventTitle')[0].innerHTML
            if(autoHandleEvents){
                console.log(event);
                console.log(eventType)
                handleEvents(eventType)
            }else if(alertOnEvents && eventType !== lastEvent){
                lastEvent = eventType;
                GM_notification ( {title: 'An SDI event', text: eventType,
                                  onclick: () => {
                                      window.focus ();
                                  }} );
            }
        }
    }
    function handleEvents(eventType){
        if(eventType in events){
            let eventActions = events[eventType];
            let index = 0;
            console.log(eventActions)
            if('condition' in eventActions){
                let amount = getItemAmount(eventActions.condition.item);
                var buttonIndex = getButtonIndexByLimit(eventActions.condition.limits, amount);
            }
            console.log(buttonIndex)
            let clicks = 'clicks' in eventActions?eventActions.clicks:1;
            console.log(clicks)
            for(let i = 0; i<clicks; i++){
                document.getElementById(eventActions.buttons[index]).click();
            }
            if(eventActions.finalButtons){
                for(let i= 0;i<eventActions.finalButtons.length; i++){
                    let button = document.getElementById(eventActions.finalButtons[i]);
                    if (button) button.click();
                }
            }
        }
    }
    var getItemAmount = function(itemType){
        let row = document.getElementById('row_'+itemType)
        return row.getElementsByClassName('row_val')[0].innerHTML;
    }

    var getButtonIndexByLimit = function(object, amount){
        const keys = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if(amount<key){
                return object[key]
            }
        }
        return 0;
    }
    // Your code here...
})();
