// ==UserScript==
// @name         Most OP PokeClicker Hack
// @namespace    http://tampermonkey.net/
// @version      12.6
// @description  Auto Clicker, Full Pokedex, INF Currency, Get Unavailable Pokemon And More
// @author       GSRHackZ, JUJUJUJ, Drakahn Finlay, Ephenia
// @match        https://www.pokeclicker.com/*
// @grant        none
// @icon         https://image.flaticon.com/icons/svg/99/99188.svg
// @license                  MIT
// @compatible               chrome
// @compatible               opera
// @compatible               safari
// @downloadURL https://update.greasyfork.org/scripts/442026/Most%20OP%20PokeClicker%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/442026/Most%20OP%20PokeClicker%20Hack.meta.js
// ==/UserScript==
 alert("This is a WIP. Please Contact JUJUJUJ If You Have Problems");
let x,y,set,cps=10;
 
document.addEventListener('keyup',function(evt){
    if(evt.keyCode==192){
        if(!set==true){
            set=true;
            let inp=prompt("How many clicks would you like per second? Recommended Max : 100,000 cps");
            if(!isNaN(inp)&&inp.trim().length>0){
                if(inp>100000){
                    let check=confirm(`${inp} clicks per second may crash your browser! Are you sure you would like to continue?`)
                    if(check){
                        alert("Ok whatever you say...");
                        console.warn("Idiot...");
                        cps=inp;
                    }
                    else{
                        set=false;
                        alert("Thanks for understanding. Please click ~ to try again.")
                    }
                }
                else if(inp<1000){
                    cps=1000;
                }
                else{
                    cps=inp;
                }
            }
            alert("You may now click on any point in this tab to set the autoclicker to it. Have fun !!");
            onmousedown = function(e){
                x=e.clientX;
                y=e.clientY;
            };
            let autoClick=setInterval(function(){
                if(x!==undefined&&y!==undefined&&set==true){
                    for(let i=0;i<cps/1000;i++){
                        click(x,y);
                    }
                }
            },1)}
        else{
            set=false
        }
    }
})
 
 
function click(x, y){
    let ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });
 
    let el = document.elementFromPoint(x, y);
    el.dispatchEvent(ev);
}

    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==56){
App.game.wallet.gainDiamonds(9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999)
App.game.wallet.gainQuestPoints(9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999)
App.game.wallet.gainMoney(9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999)
App.game.wallet.gainDungeonTokens(9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999)
App.game.wallet.gainBattlePoints(9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999)
App.game.wallet.gainFarmPoints(9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999)
    }});
document.addEventListener('keyup',function(evt){
    if(evt.keyCode==191){
  var indexVariable = -1000;
setInterval(
    function () {
        indexVariable = (indexVariable + 1) % 152;
        App.game.party.gainPokemonById(indexVariable, true, true)
    }, 50);
    }});
document.addEventListener('keyup',function(evt){
    if(evt.keyCode==190){
  var indexVariable = 0;
setInterval(
    function () {
        indexVariable = (indexVariable + 1) % 251;
        App.game.party.gainPokemonById(indexVariable, true, true)
    }, 50);
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==188){
  var indexVariable = 0;
setInterval(
    function () {
        indexVariable = (indexVariable + 1) % 388;
        App.game.party.gainPokemonById(indexVariable, true, true)
    }, 50);
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==222){
  var indexVariable = 0;
setInterval(
    function () {
        indexVariable = (indexVariable + 1) % 495;
        App.game.party.gainPokemonById(indexVariable, true, true)
    }, 50);
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==186){
  var indexVariable = 0;
setInterval(
    function () {
        indexVariable = (indexVariable + 1) % 651;
        App.game.party.gainPokemonById(indexVariable, true, true)
    }, 50);
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==189){
  var indexVariable = 0;
setInterval(
    function () {
        indexVariable = (indexVariable + 1) % 723;
        App.game.party.gainPokemonById(indexVariable, true, true)
    }, 50);
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==187){
  var indexVariable = -100000;
setInterval(
    function () {
        indexVariable = (indexVariable + 1) % 1000000;
        App.game.party.gainPokemonById(indexVariable, true, true)
    }, 50);
    }});
        document.addEventListener('keyup',function(evt){
    if(evt.keyCode==50){
  var indexVariable = 0;
setInterval(
    function () {
        indexVariable = (indexVariable + 1) % 20;
        Underground.sellMineItem(indexVariable, Infinity)
    }, 50);
    }});
document.addEventListener('keyup',function(evt){
    if(evt.keyCode==51){
  var indexVariable = 0;
    setInterval(
    function () {
        var getEnergy = Math.floor(App.game.underground.energy);
if (getEnergy < 100) {
                    ItemList["MediumRestore"].use();
                }
    }, 50);
    }});
    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==52){
    
  var indexVariable = 0;
    setInterval(
    function () {
    indexVariable = (indexVariable + 1) % 18;
    App.game.gems.gainGems(999999999,indexVariable)
    }, 50);
    
    }});
        document.addEventListener('keyup',function(evt){
    if(evt.keyCode==55){
  //Gain Pokeballs
App.game.pokeballs.gainPokeballs(0,mu,true)
App.game.pokeballs.gainPokeballs(1,mu,true)
App.game.pokeballs.gainPokeballs(2,mu,true)
App.game.pokeballs.gainPokeballs(3,mu,true)
//end
    }});
            document.addEventListener('keyup',function(evt){
        if(evt.keyCode==57){
//Max Farm Hire
App.game.farming.farmHands.MAX_HIRES = mu
//end
    }});
                document.addEventListener('keyup',function(evt){
        if(evt.keyCode==221){
//Bonus List
App.game.oakItems.itemList[0].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[1].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[2].bonusList = [mu,mu,mu,mu,mu,mu];
App.game.oakItems.itemList[3].bonusList = [100,100,100,100,100,100];
App.game.oakItems.itemList[4].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[5].bonusList = [1000000,1000000,1000000,1000000,1000000,1000000];
App.game.oakItems.itemList[6].bonusList = [10000,10000,10000,10000,10000,10000];
App.game.oakItems.itemList[7].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[8].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[9].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[10].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[11].bonusList = [1000,1000,1000,1000,1000,1000];
//end 
    }});
                document.addEventListener('keyup',function(evt){
        if(evt.keyCode==219){
//Attack Bonus
  var indexVariable = -2100;
    setInterval(
    function () {
    indexVariable = (indexVariable + 1) % 100000;
App.game.party.getPokemon(indexVariable).attackBonusAmount = mu
    }, 50);
//end
    }});
        document.addEventListener('keyup',function(evt){
    if(evt.keyCode==54){
    //catch speed
var ballAdjuster;
var getBalls;
var awaitBallAdjust;
var defaultTime = [];
var newSave;
var trainerCards;
 
function initBallAdjust() {
    var getBalls = App.game.pokeballs.pokeballs;
    for (var i = 0; i < getBalls.length; i++) {
        defaultTime.push(getBalls[i].catchTime)
    }
    var ballCont = document.getElementById('pokeballSelectorBody').querySelector('thead');
    var ballAdj = document.createElement("tr");
    ballAdj.innerHTML = `<td colspan="4"><div style="height: 25px;"><label for="ball-adjust">0 Delay Capture <label><input id="ball-adjust" type="checkbox" style="position: relative;top: 2px;"></div></td>`
    ballCont.append(ballAdj)
    document.getElementById('ball-adjust').addEventListener('click', event => changeAdjust(event.target));
 
    if (ballAdjuster == "true") {
        document.getElementById('ball-adjust').checked = true;
        catchDelay();
    }
 
    function changeAdjust(ele) {
        if (ballAdjuster == "true") {
            ballAdjuster = "false"
        } else {
            ballAdjuster = "true"
        }
        localStorage.setItem("ballAdjuster", ballAdjuster);
        catchDelay();
    }
 
    function catchDelay() {
        for (var i = 0; i < getBalls.length; i++) {
            if (ballAdjuster == "true") {
                getBalls[i].catchTime = 0;
            } else {
                getBalls[i].catchTime = defaultTime[i];
            }
        }
    }
}
 
if (localStorage.getItem('ballAdjuster') == null) {
    localStorage.setItem("ballAdjuster", "false");
}
ballAdjuster = localStorage.getItem('ballAdjuster');
 
var scriptLoad = setInterval(function () {
    try {
        newSave = document.querySelectorAll('label')[0];
        trainerCards = document.querySelectorAll('.trainer-card');
    } catch (err) { }
    if (typeof newSave != 'undefined') {
        for (var i = 0; i < trainerCards.length; i++) {
            trainerCards[i].addEventListener('click', checkBallAdjust, false);
        }
        newSave.addEventListener('click', checkBallAdjust, false);
        clearInterval(scriptLoad)
    }
}, 50);
 
function checkBallAdjust() {
    awaitBallAdjust = setInterval(function () {
        var gameState;
        try {
            gameState = App.game.gameState;
        } catch (err) { }
        if (typeof gameState != 'undefined') {
            initBallAdjust();
            clearInterval(awaitBallAdjust)
        }
    }, 1000);
}
//end
    }});
    
        document.addEventListener('keyup',function(evt){
    if(evt.keyCode==49){
        //Unlimited Oak Items
var newSave;
var oakItems;
var trainerCards;
var awaitOakItems;
 
function initOakItems() {
    var oakMax = oakItems.itemList.length;
    for (let i = 0; i < oakMax; i++) {
        App.game.oakItems.unlockRequirements[i] = 0;
    }
    oakItems.maxActiveCount(oakMax);
    document.getElementById('oakItemsModal').querySelector('h5').innerHTML = "Oak Items Equipped: " + oakItems.activeCount() + '/' + oakMax;
}
 
var scriptLoad = setInterval(function () {
    try {
        newSave = document.querySelectorAll('label')[0];
        trainerCards = document.querySelectorAll('.trainer-card');
    } catch (err) { }
    if (typeof newSave != 'undefined') {
        for (var i = 0; i < trainerCards.length; i++) {
            trainerCards[i].addEventListener('click', checkOakItems, false);
        }
        newSave.addEventListener('click', checkOakItems, false);
        clearInterval(scriptLoad)
    }
}, 50);
 
function checkOakItems() {
    awaitOakItems = setInterval(function () {
        try {
            oakItems = App.game.oakItems;
        } catch (err) { }
        if (typeof oakItems != 'undefined') {
            initOakItems();
            clearInterval(awaitOakItems)
        }
    }, 50);
}
//end
    }});
        document.addEventListener('keyup',function(evt){
    if(evt.keyCode==53){
    //infinite season
var startDate = new Date(new Date().getFullYear(), -1);
var endDate = new Date(new Date().getFullYear(), 10000);
var getEvents = SpecialEvents.events;
var storedEvents = [];
var profileDrop = document.getElementById('startMenu').querySelectorAll('ul li')[0];
var profileModal = document.getElementById('profileModal');
 
SpecialEvents.newEvent('Hacker\'s Gift', 'Encounter Ribombee that roams across all regions.<br/>A special thanks for using our scripts!',
    startDate, () => {
        GameHelper.enumNumbers(GameConstants.Region).filter(i => i != GameConstants.Region.none).forEach(region => {
            RoamingPokemonList.add(region, new RoamingPokemon('Ribombee'));
        });
    },
    startDate, () => {
        GameHelper.enumNumbers(GameConstants.Region).filter(i => i != GameConstants.Region.none).forEach(region => {
            RoamingPokemonList.remove(region, new RoamingPokemon('Ribombee'));
        });
    }
);
 
setTimeout(() => {
    for (var i = 0; i < getEvents.length; i++) {
        if (localStorage.getItem('specialEvent'+i) == null) {
            localStorage.setItem('specialEvent'+i, 0);
        }
        storedEvents.push(+localStorage.getItem('specialEvent'+i))
    }
 
    for (var ii = 0; ii < getEvents.length; ii++) {
        getEvents[ii].startTime = startDate
        getEvents[ii].endTime = endDate
        if (getEvents[ii].hasStarted() == false && storedEvents[ii] == 1) {
            getEvents[ii].start()
        }
    }
    initEvents();
    if (getEvents.length != 7) {
        setTimeout(() => {
            Notifier.notify({
                title: '[Outdated] Infinite Seasonal Events',
                message: `Please contact <a href="//github.com/Ephenia/Pokeclicker-Scripts" target="_blank">Ephenia</a> so that this script can be updated!`,
                type: NotificationConstants.NotificationOption.danger,
                timeout: 10000
            });
        }, 2000);
    }
}, 50);
 
 
function initEvents() {
    setTimeout(() => {
        for (var iii = 0; iii < getEvents.length; iii++) {
            var eventNotify = document.querySelectorAll('.ml-2');
            if (eventNotify.length >= iii + 1) {
                eventNotify[iii].click()
            }
        }
 
        var eventLi = document.createElement('li');
        eventLi.innerHTML = `<a class="dropdown-item" href="#eventModal" data-toggle="modal">Events</a>`
        profileDrop.before(eventLi);
 
        var eventMod = document.createElement('div');
        eventMod.setAttribute("class", "modal noselect fade show");
        eventMod.setAttribute("id", "eventModal");
        eventMod.setAttribute("tabindex", "-1");
        eventMod.setAttribute("aria-labelledby", "eventModal");
        eventMod.setAttribute("aria-labelledby", "eventModal");
        eventMod.setAttribute("aria-modal", "true");
        eventMod.setAttribute("role", "dialog");
        eventMod.innerHTML = `<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header" style="justify-content: space-around;">
                <h5 class="modal-title">Events</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
            <div id="event-1" class="event-select" data-value="0"><b>`+getEvents[0].title+`</b><br>`+getEvents[0].description+`<br>
            <img src="assets/images/pokemon/666.19.png">
            </div><hr>
            <div id="event-2" class="event-select" data-value="1"><b>`+getEvents[1].title+`</b><br>`+getEvents[1].description+`<br>
            <img src="assets/images/pokemon/-1.png">
            </div><hr>
            <div id="event-3" class="event-select" data-value="2"><b>`+getEvents[2].title+`</b><br>`+getEvents[2].description+`<br>
            <img src="assets/images/pokemon/-3.png">
            <img src="assets/images/pokemon/-10.png">
            <img src="assets/images/pokemon/-13.png">
            <img src="assets/images/pokemon/-16.png">
            </div><hr>
            <div id="event-4" class="event-select" data-value="3"><b>`+getEvents[3].title+`</b><br>`+getEvents[3].description+`<br>
            <img src="assets/images/pokemon/-6.png">
            <img src="assets/images/pokemon/-5.png">
            <img src="assets/images/pokemon/-7.png"><br>
            <img src="assets/images/pokemon/92.png">
            <img src="assets/images/pokemon/200.png">
            <img src="assets/images/pokemon/353.png">
            <img src="assets/images/pokemon/355.png">
            </div><hr>
            <div id="event-5" class="event-select" data-value="4"><b>`+getEvents[4].title+`</b><br>`+getEvents[4].description+`<br>
            <img src="assets/images/pokemon/-9.png">
            <img src="assets/images/pokemon/-8.png">
            </div><hr>
            <div id="event-6" class="event-select" data-value="5"><b>`+getEvents[5].title+`</b><br>`+getEvents[5].description+`<br>
            <img src="assets/images/pokemon/-4.png">
            </div><hr>
            <div id="event-7" class="event-select" data-value="6"><b>`+getEvents[6].title+`</b><br>`+getEvents[6].description+`<br>
            <img src="assets/images/pokemon/743.png">
            </div><hr>
            <div>
        </div>
    </div>`
        profileModal.before(eventMod);
 
        for (var add = 0; add < getEvents.length; add++) {
            if (storedEvents[add] == 1) {
                document.getElementById('event-'+(add+1)).style = "background-color: rgba(93, 226, 60, 0.5)"
            }
            $("#event-"+(add+1)).click (toggleEvent)
        }
 
        addGlobalStyle('.event-select { cursor: pointer; }');
        addGlobalStyle('.event-select:hover { background-color: rgba(48, 197, 255, 0.5); }');
    }, 1450);
}
 
function toggleEvent() {
    var getVal = this.getAttribute('data-value');
    var getEvent = +localStorage.getItem('specialEvent'+getVal)
    if (getEvent == 0) {
        this.style = "background-color: rgba(93, 226, 60, 0.5)"
        storedEvents[getVal] = 1
        localStorage.setItem('specialEvent'+getVal, 1)
        getEvents[getVal].start()
    } else {
        this.style = ""
        storedEvents[getVal] = 0
        localStorage.setItem('specialEvent'+getVal, 0)
        getEvents[getVal].end()
    }
    //console.log(getVal)
}
 
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//end
    }});
        document.addEventListener('keyup',function(evt){
    if(evt.keyCode==48){
    let mu = 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
  var indexVariable = 0;
    setInterval(
    function () {
    indexVariable = (indexVariable + 1) % 20;
    App.game.gems.gainGems(999999999,indexVariable)
    Underground.sellMineItem(indexVariable, Infinity)

    }, 50);

    setInterval(
    function () {
      var indexVariable = -2000;
    indexVariable = (indexVariable + 1) % 100000;
    App.game.party.gainPokemonById(indexVariable,true)
console.log(indexVariable)
    }, 50);
    //currency
    App.game.wallet.gainDiamonds(mu)
	  App.game.wallet.gainQuestPoints(mu)
	  App.game.wallet.gainMoney(mu)
	  App.game.wallet.gainDungeonTokens(mu)
	  App.game.wallet.gainBattlePoints(mu)
    App.game.wallet.gainFarmPoints(mu)
    //end
    
    //Unlimited Oak Items
var newSave;
var oakItems;
var trainerCards;
var awaitOakItems;
 
function initOakItems() {
    var oakMax = oakItems.itemList.length;
    for (let i = 0; i < oakMax; i++) {
        App.game.oakItems.unlockRequirements[i] = 0;
    }
    oakItems.maxActiveCount(oakMax);
    document.getElementById('oakItemsModal').querySelector('h5').innerHTML = "Oak Items Equipped: " + oakItems.activeCount() + '/' + oakMax;
}
 
var scriptLoad = setInterval(function () {
    try {
        newSave = document.querySelectorAll('label')[0];
        trainerCards = document.querySelectorAll('.trainer-card');
    } catch (err) { }
    if (typeof newSave != 'undefined') {
        for (var i = 0; i < trainerCards.length; i++) {
            trainerCards[i].addEventListener('click', checkOakItems, false);
        }
        newSave.addEventListener('click', checkOakItems, false);
        clearInterval(scriptLoad)
    }
}, 50);
 
function checkOakItems() {
    awaitOakItems = setInterval(function () {
        try {
            oakItems = App.game.oakItems;
        } catch (err) { }
        if (typeof oakItems != 'undefined') {
            initOakItems();
            clearInterval(awaitOakItems)
        }
    }, 50);
}
//end

//infinite season
var startDate = new Date(new Date().getFullYear(), -1);
var endDate = new Date(new Date().getFullYear(), 10000);
var getEvents = SpecialEvents.events;
var storedEvents = [];
var profileDrop = document.getElementById('startMenu').querySelectorAll('ul li')[0];
var profileModal = document.getElementById('profileModal');
 
SpecialEvents.newEvent('Hacker\'s Gift', 'Encounter Ribombee that roams across all regions.<br/>A special thanks for using our scripts!',
    startDate, () => {
        GameHelper.enumNumbers(GameConstants.Region).filter(i => i != GameConstants.Region.none).forEach(region => {
            RoamingPokemonList.add(region, new RoamingPokemon('Ribombee'));
        });
    },
    startDate, () => {
        GameHelper.enumNumbers(GameConstants.Region).filter(i => i != GameConstants.Region.none).forEach(region => {
            RoamingPokemonList.remove(region, new RoamingPokemon('Ribombee'));
        });
    }
);
 
setTimeout(() => {
    for (var i = 0; i < getEvents.length; i++) {
        if (localStorage.getItem('specialEvent'+i) == null) {
            localStorage.setItem('specialEvent'+i, 0);
        }
        storedEvents.push(+localStorage.getItem('specialEvent'+i))
    }
 
    for (var ii = 0; ii < getEvents.length; ii++) {
        getEvents[ii].startTime = startDate
        getEvents[ii].endTime = endDate
        if (getEvents[ii].hasStarted() == false && storedEvents[ii] == 1) {
            getEvents[ii].start()
        }
    }
    initEvents();
    if (getEvents.length != 7) {
        setTimeout(() => {
            Notifier.notify({
                title: '[Outdated] Infinite Seasonal Events',
                message: `Please contact <a href="//github.com/Ephenia/Pokeclicker-Scripts" target="_blank">Ephenia</a> so that this script can be updated!`,
                type: NotificationConstants.NotificationOption.danger,
                timeout: 10000
            });
        }, 2000);
    }
}, 50);
 
 
function initEvents() {
    setTimeout(() => {
        for (var iii = 0; iii < getEvents.length; iii++) {
            var eventNotify = document.querySelectorAll('.ml-2');
            if (eventNotify.length >= iii + 1) {
                eventNotify[iii].click()
            }
        }
 
        var eventLi = document.createElement('li');
        eventLi.innerHTML = `<a class="dropdown-item" href="#eventModal" data-toggle="modal">Events</a>`
        profileDrop.before(eventLi);
 
        var eventMod = document.createElement('div');
        eventMod.setAttribute("class", "modal noselect fade show");
        eventMod.setAttribute("id", "eventModal");
        eventMod.setAttribute("tabindex", "-1");
        eventMod.setAttribute("aria-labelledby", "eventModal");
        eventMod.setAttribute("aria-labelledby", "eventModal");
        eventMod.setAttribute("aria-modal", "true");
        eventMod.setAttribute("role", "dialog");
        eventMod.innerHTML = `<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header" style="justify-content: space-around;">
                <h5 class="modal-title">Events</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
            <div id="event-1" class="event-select" data-value="0"><b>`+getEvents[0].title+`</b><br>`+getEvents[0].description+`<br>
            <img src="assets/images/pokemon/666.19.png">
            </div><hr>
            <div id="event-2" class="event-select" data-value="1"><b>`+getEvents[1].title+`</b><br>`+getEvents[1].description+`<br>
            <img src="assets/images/pokemon/-1.png">
            </div><hr>
            <div id="event-3" class="event-select" data-value="2"><b>`+getEvents[2].title+`</b><br>`+getEvents[2].description+`<br>
            <img src="assets/images/pokemon/-3.png">
            <img src="assets/images/pokemon/-10.png">
            <img src="assets/images/pokemon/-13.png">
            <img src="assets/images/pokemon/-16.png">
            </div><hr>
            <div id="event-4" class="event-select" data-value="3"><b>`+getEvents[3].title+`</b><br>`+getEvents[3].description+`<br>
            <img src="assets/images/pokemon/-6.png">
            <img src="assets/images/pokemon/-5.png">
            <img src="assets/images/pokemon/-7.png"><br>
            <img src="assets/images/pokemon/92.png">
            <img src="assets/images/pokemon/200.png">
            <img src="assets/images/pokemon/353.png">
            <img src="assets/images/pokemon/355.png">
            </div><hr>
            <div id="event-5" class="event-select" data-value="4"><b>`+getEvents[4].title+`</b><br>`+getEvents[4].description+`<br>
            <img src="assets/images/pokemon/-9.png">
            <img src="assets/images/pokemon/-8.png">
            </div><hr>
            <div id="event-6" class="event-select" data-value="5"><b>`+getEvents[5].title+`</b><br>`+getEvents[5].description+`<br>
            <img src="assets/images/pokemon/-4.png">
            </div><hr>
            <div id="event-7" class="event-select" data-value="6"><b>`+getEvents[6].title+`</b><br>`+getEvents[6].description+`<br>
            <img src="assets/images/pokemon/743.png">
            </div><hr>
            <div>
        </div>
    </div>`
        profileModal.before(eventMod);
 
        for (var add = 0; add < getEvents.length; add++) {
            if (storedEvents[add] == 1) {
                document.getElementById('event-'+(add+1)).style = "background-color: rgba(93, 226, 60, 0.5)"
            }
            $("#event-"+(add+1)).click (toggleEvent)
        }
 
        addGlobalStyle('.event-select { cursor: pointer; }');
        addGlobalStyle('.event-select:hover { background-color: rgba(48, 197, 255, 0.5); }');
    }, 1450);
}
 
function toggleEvent() {
    var getVal = this.getAttribute('data-value');
    var getEvent = +localStorage.getItem('specialEvent'+getVal)
    if (getEvent == 0) {
        this.style = "background-color: rgba(93, 226, 60, 0.5)"
        storedEvents[getVal] = 1
        localStorage.setItem('specialEvent'+getVal, 1)
        getEvents[getVal].start()
    } else {
        this.style = ""
        storedEvents[getVal] = 0
        localStorage.setItem('specialEvent'+getVal, 0)
        getEvents[getVal].end()
    }
    //console.log(getVal)
}
 
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//end

//catch speed
var ballAdjuster;
var getBalls;
var awaitBallAdjust;
var defaultTime = [];
var newSave;
var trainerCards;
 
function initBallAdjust() {
    var getBalls = App.game.pokeballs.pokeballs;
    for (var i = 0; i < getBalls.length; i++) {
        defaultTime.push(getBalls[i].catchTime)
    }
    var ballCont = document.getElementById('pokeballSelectorBody').querySelector('thead');
    var ballAdj = document.createElement("tr");
    ballAdj.innerHTML = `<td colspan="4"><div style="height: 25px;"><label for="ball-adjust">0 Delay Capture <label><input id="ball-adjust" type="checkbox" style="position: relative;top: 2px;"></div></td>`
    ballCont.append(ballAdj)
    document.getElementById('ball-adjust').addEventListener('click', event => changeAdjust(event.target));
 
    if (ballAdjuster == "true") {
        document.getElementById('ball-adjust').checked = true;
        catchDelay();
    }
 
    function changeAdjust(ele) {
        if (ballAdjuster == "true") {
            ballAdjuster = "false"
        } else {
            ballAdjuster = "true"
        }
        localStorage.setItem("ballAdjuster", ballAdjuster);
        catchDelay();
    }
 
    function catchDelay() {
        for (var i = 0; i < getBalls.length; i++) {
            if (ballAdjuster == "true") {
                getBalls[i].catchTime = 0;
            } else {
                getBalls[i].catchTime = defaultTime[i];
            }
        }
    }
}
 
if (localStorage.getItem('ballAdjuster') == null) {
    localStorage.setItem("ballAdjuster", "false");
}
ballAdjuster = localStorage.getItem('ballAdjuster');
 
var scriptLoad = setInterval(function () {
    try {
        newSave = document.querySelectorAll('label')[0];
        trainerCards = document.querySelectorAll('.trainer-card');
    } catch (err) { }
    if (typeof newSave != 'undefined') {
        for (var i = 0; i < trainerCards.length; i++) {
            trainerCards[i].addEventListener('click', checkBallAdjust, false);
        }
        newSave.addEventListener('click', checkBallAdjust, false);
        clearInterval(scriptLoad)
    }
}, 50);
 
function checkBallAdjust() {
    awaitBallAdjust = setInterval(function () {
        var gameState;
        try {
            gameState = App.game.gameState;
        } catch (err) { }
        if (typeof gameState != 'undefined') {
            initBallAdjust();
            clearInterval(awaitBallAdjust)
        }
    }, 1000);
}
//end

//Unlimited Protein
 
var proteinTable;
var awaitProteinTable;
var awaitOmegaProtein;
var newSave;
var trainerCards;
 
function initOmegaProtein() {
    document.getElementById('itemBag').querySelectorAll('div')[2].addEventListener('click', initProtein, true);
    
    function initProtein() {
        awaitProteinTable = setInterval(function () {
            proteinTable = document.getElementById('pokemonSelectorModal').querySelectorAll('tbody')
            if (proteinTable.length != 0) {
                clearInterval(awaitProteinTable);
                proteinTable[0].addEventListener('click', bypassProtein, true);
                function bypassProtein(event) {
                    var child = event.target.closest('tr').rowIndex - 1;
                    var protein = player.itemList.Protein();
                    var setProtein = VitaminController.getMultiplier()
                    var usedProtein = protein - setProtein;
                    var pokeProtein = PartyController.getProteinSortedList()[child].proteinsUsed()
                    if (setProtein == Infinity && protein > 0) {
                        PartyController.getProteinSortedList()[child].proteinsUsed(pokeProtein + protein)
                        player.itemList.Protein(0)
                    } else if (usedProtein >= 0) {
                        PartyController.getProteinSortedList()[child].proteinsUsed(pokeProtein + setProtein)
                        player.itemList.Protein(usedProtein)
                    } else {
                        Notifier.notify({
                            message: `You don't have any Proteins left...`,
                            type: NotificationConstants.NotificationOption.danger,
                        });
                    }
                    event.stopImmediatePropagation();
                }
            }
        }, 50);
    }
}
 
var scriptLoad = setInterval(function () {
    try {
        newSave = document.querySelectorAll('label')[0];
        trainerCards = document.querySelectorAll('.trainer-card');
    } catch (err) { }
    if (typeof newSave != 'undefined') {
        for (var i = 0; i < trainerCards.length; i++) {
            trainerCards[i].addEventListener('click', checkOmegaProtein, false);
        }
        newSave.addEventListener('click', checkOmegaProtein, false);
        clearInterval(scriptLoad)
    }
}, 50);
 
function checkOmegaProtein() {
    awaitOmegaProtein = setInterval(function () {
        var gameState;
        try {
            gameState = App.game.gameState;
        } catch (err) { }
        if (typeof gameState != 'undefined') {
            initOmegaProtein();
            clearInterval(awaitOmegaProtein)
        }
    }, 1000);
}
//end
//Bonus List
App.game.oakItems.itemList[0].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[1].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[2].bonusList = [mu,mu,mu,mu,mu,mu];
App.game.oakItems.itemList[3].bonusList = [100,100,100,100,100,100];
App.game.oakItems.itemList[4].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[5].bonusList = [1000000,1000000,1000000,1000000,1000000,1000000];
App.game.oakItems.itemList[6].bonusList = [10000,10000,10000,10000,10000,10000];
App.game.oakItems.itemList[7].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[8].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[9].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[10].bonusList = [1000,1000,1000,1000,1000,1000];
App.game.oakItems.itemList[11].bonusList = [1000,1000,1000,1000,1000,1000];
//end 
//Gain Pokeballs
App.game.pokeballs.gainPokeballs(0,mu,true)
App.game.pokeballs.gainPokeballs(1,mu,true)
App.game.pokeballs.gainPokeballs(2,mu,true)
App.game.pokeballs.gainPokeballs(3,mu,true)
//end
//Max Farm Hire
App.game.farming.farmHands.MAX_HIRES = mu
//end
//Attack Bonus
  var indexVariable = -2100;
    setInterval(
    function () {
    indexVariable = (indexVariable + 1) % 100000;
App.game.party.getPokemon(indexVariable).attackBonusAmount = mu
    }, 50);
//end
}});