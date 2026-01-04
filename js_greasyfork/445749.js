// ==UserScript==
// @name         TypeFinder
// @namespace    Pokeclicker Scripts
// @version      0.1
// @description  Find routes to farm
// @author       Maxteke
// @match        https://www.pokeclicker.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445749/TypeFinder.user.js
// @updateURL https://update.greasyfork.org/scripts/445749/TypeFinder.meta.js
// ==/UserScript==

var scriptName = 'typeFinder'

var types = []

function hasType(pokemon, type) {
    var pokemon = pokemonList.find(element => element.name == pokemon)
    if (pokemon == undefined)
        return false;
    for (var t of pokemon.type) {
        if (PokemonType[t] == type)
            return true;
    }
    return false;
}

function getScore(route, type) {
    var pokemons = [];
    var find = 0;
    pokemons = pokemons.concat(route.pokemon.headbutt);
    pokemons = pokemons.concat(route.pokemon.land);
    pokemons = pokemons.concat(route.pokemon.special);
    pokemons = pokemons.concat(route.pokemon.water);
    pokemons.forEach(pokemon => {
        if (hasType(pokemon, type))
            find++;
    });
    if (find == 0)
        return undefined;
    else
        return pokemons.length - find;
}

function bestRoadForType(region, type) {
    var routes = Routes.getRoutesByRegion(region);
    var bestScore = 100;
    var bestRoute = undefined;
    routes.forEach(route => {
        var score = getScore(route, type);
        if (score < bestScore) {
            bestScore = score;
            bestRoute = route;
        }
    });
    return { route: bestRoute, score: bestScore };
}

function findForEachRegion(type) {
    var regions = [];
    for (var i = 0; i <= player.highestRegion(); i++) {
        regions.push(bestRoadForType(i, type));
    }
    regions.sort((a, b) => a.score - b.score);
    types[type] = regions;
}

function addOption(select, type) {
    var option = document.createElement('option');
    option.value = type;
    option.innerHTML = type;
    select.appendChild(option);
}

function typeFinderCard() {
    var card = document.createElement('div');
    card.id = 'typeFinder';
    card.classList.add('card')
    card.classList.add('sortable')
    card.classList.add('border-secondary')
    card.classList.add('mb-3')

    var header = document.createElement('div');
    header.classList.add('card-header');
    header.classList.add('p-0');
    header.setAttribute('data-toggle', 'collapse');
    header.setAttribute('href', '#typeFinderBody');
    var title = document.createElement('span');
    title.innerHTML = 'Type finder';

    header.appendChild(title);
    card.appendChild(header);

    var body = document.createElement('div');
    body.id = 'typeFinderBody'
    body.classList.add('card-body');
    body.classList.add('p-0');
    body.classList.add('collapse');
    body.classList.add('show');

    var container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignContent = 'center';
    container.style.alignItems = 'center';

    var result = document.createElement('div');
    result.style.display = 'flex';
    result.style.flexDirection = 'column';
    result.style.alignContent = 'center';
    result.style.alignItems = 'center';
    result.style.width = '100%';

    var select = document.createElement('select');
    select.name = 'TypeSelect'
    select.autocomplete = 'off';
    select.classList.add('custom-select');
    select.onchange = function() {findRoutes(result, select.value)};

    for (let type in PokemonType) {
        if (isNaN(Number(type)) && type != 'None') {
            findForEachRegion(type);
            addOption(select, type);
        }
    }

    container.appendChild(select);


    container.appendChild(result);

    body.appendChild(container);
    card.appendChild(body);

    document.getElementById('left-column').prepend(card);

    findRoutes(result, 'Normal');
}

function addResult(result, route) {
    var button = document.createElement('button');
    button.classList.add('btn');
    button.classList.add('btn-block');
    button.classList.add('btn-primary');
    button.classList.add('m-0');
    button.onclick = function() {
        MapHelper.moveToRoute(route.route.number, route.route.region);
    };
    button.innerHTML = route.route.routeName;
    result.appendChild(button);
}

function clearResult(result) {
    result.innerHTML = '';
}

function findRoutes(result, type) {
    clearResult(result);
    types[type].forEach(route => {
        if (route.route != undefined)
            addResult(result, route);
    });
}

function initTypeFinder() {
    typeFinderCard();
}

function loadScript(){
    var oldInit = Preload.hideSplashScreen

    Preload.hideSplashScreen = function(){
        var result = oldInit.apply(this, arguments)
        initTypeFinder()
        console.log(`[${GameConstants.formatDate(new Date())}] %cType finder loaded`, 'color:#8e44ad;font-weight:900;');
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