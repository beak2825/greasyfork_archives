// ==UserScript==
// @name         AutoBattle
// @namespace    Pokeclicker Scripts
// @version      0.2
// @description  Auto hatch
// @author       Maxteke
// @match        https://www.pokeclicker.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446466/AutoBattle.user.js
// @updateURL https://update.greasyfork.org/scripts/446466/AutoBattle.meta.js
// ==/UserScript==

var scriptName = 'autoBattle';
var autoBattleLoop;
var autoBattleState;

function card() {
    var card = document.createElement('div');
    card.id = 'autoBattle';
    card.classList.add('card')
    card.classList.add('sortable')
    card.classList.add('border-secondary')
    card.classList.add('mb-3')
    
    var header = document.createElement('div');
    header.classList.add('card-header');
    header.classList.add('p-0');
    header.setAttribute('data-toggle', 'collapse');
    header.setAttribute('href', '#autoBattleBody');
    var title = document.createElement('span');
    title.innerHTML = 'Auto battle';
    
    header.appendChild(title);
    card.appendChild(header);
    
    var body = document.createElement('div');
    body.id = 'autoBattleBody'
    body.classList.add('card-body');
    body.classList.add('p-0');
    body.classList.add('collapse');
    body.classList.add('show');

    var container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignContent = 'center';
    container.style.alignItems = 'center';

    var input = document.createElement('input');
    input.id = 'auto-battle-input';
    input.type = 'number';
    input.value = '1';
    input.min = '1';
    input.max = '1000';
    input.name = 'stopStage';
    input.classList.add('outline-dark');
    input.classList.add('form-control');
    input.classList.add('form-control-number');
    container.appendChild(input);

    var button = document.createElement('button');
    button.id = 'auto-battle-switch';
    button.classList.add("btn");
    button.classList.add("btn-sm");
    button.classList.add("btn-danger");
    button.innerHTML = `Auto battle [` + autoBattleState + `]`;
    button.onclick = function() {switchState(button, input)};
    container.appendChild(button);

    body.appendChild(container);
    card.appendChild(body);

    document.getElementById('left-column').prepend(card);
}

function switchState(button, input) {
    if (autoBattleState == "OFF") {
        autoBattleState = "ON";
        button.classList.remove('btn-danger');
        button.classList.add('btn-success');
        battleLoop(input);
    } else {
        autoBattleState = "OFF"
        button.classList.remove('btn-success');
        button.classList.add('btn-danger');
        clear();
        clearInterval(autoBattleLoop);
    }
    button.innerHTML = `Auto battle [` + autoBattleState + `]`;
}

function clear() {
    BattleFrontierRunner.end();
}

function battleLoop(input) {
    BattleFrontierRunner.start(false);
    autoBattleLoop = setInterval(function () {
        if (parseInt(input.value) < 1) {
            input.value = 1;
        }

        if (parseInt(input.value) > 1000) {
            input.value = 1000;
        }
        
        if (BattleFrontierRunner.stage() > input.value) {
            clear();
            BattleFrontierRunner.start(false);
        }
    }, 50);
}

function initAutoBattle() {
    autoBattleState = 'OFF';
    card();
}

function loadScript(){
    var oldInit = Preload.hideSplashScreen

    Preload.hideSplashScreen = function(){
        var result = oldInit.apply(this, arguments)
        initAutoBattle()
        console.log(`[${GameConstants.formatDate(new Date())}] %cAuto battle loaded`, 'color:#8e44ad;font-weight:900;');
        return result
    }
}

if (document.getElementById('scriptHandler') != undefined){
    var scriptElement = document.createElement('div')
    scriptElement.id = scriptName
    document.getElementById('scriptHandler').appendChild(scriptElement)
    if (localStorage.getItem(scriptName) != null){
        if (localStorage.getItem(scriptName) == 'true'){
            loadScript()
        }
    }
    else{
        localStorage.setItem(scriptName, 'true')
        loadScript()
    }
}
else{
    loadScript();
}